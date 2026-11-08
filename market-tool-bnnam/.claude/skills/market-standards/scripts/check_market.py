#!/usr/bin/env python3
"""check_market.py — mechanical checks on docs/market/ so the agent does not re-read everything by eye.

Usage: python check_market.py [docs/market]
Prints one line per finding (file:line · rule · detail) and a summary. Exit code 0 = no errors, 1 = errors found.
It checks form, not judgement: whether a number is right or a conclusion is sound is still the agent's and the team's job.
"""
import io
import re
import sys
from datetime import date
from pathlib import Path

FORBIDDEN = [
    (re.compile(r"NO[- ]?GO|\bGO\s*/\s*NO", re.I), "dùng 'làm tiếp / đổi hướng / dừng', không dùng GO / NO-GO"),
    (re.compile(r"(?<![\w])(anh|chị)\s+(cần|có thể|muốn|xem|gửi|duyệt|chọn|nhé)", re.I), "xưng 'bạn', không xưng anh / chị"),
]
EVID_DEF = re.compile(r"^#(\d+)(?:\s*[–-]\s*#?(\d+))?\s*·")
EVID_REF = re.compile(r"(?<![\w&])#(\d+)(?:\s*[–-]\s*#?(\d+))?")
TABLE_ROW = re.compile(r"^\s*\|.*\|\s*$")
SEP_ROW = re.compile(r"^\s*\|?\s*:?-{3,}")
DATE_MY = re.compile(r"\b(0?[1-9]|1[0-2])/(20\d\d)\b")

findings = []


def add(level, path, line, rule, detail):
    findings.append((level, f"{path.name}:{line}", rule, detail))


def read(path):
    return io.open(path, encoding="utf-8").read().splitlines() if path.exists() else None


def evidence_ids(lines, path):
    ids = set()
    for i, ln in enumerate(lines, 1):
        m = EVID_DEF.match(ln.strip())
        if not m:
            continue
        a = int(m.group(1)); b = int(m.group(2) or a)
        for n in range(a, b + 1):
            if n in ids:
                add("LỖI", path, i, "evidence", f"số #{n} bị trùng — chỉ thêm, không đánh lại")
            ids.add(n)
        for mm, yy in DATE_MY.findall(ln):
            if int(yy) < 2025:
                add("CẢNH BÁO", path, i, "evidence", f"dữ liệu {mm}/{yy} cũ hơn 2025 — không dùng làm bằng chứng hiện tại")
    if ids:
        missing = sorted(set(range(1, max(ids) + 1)) - ids)
        if missing:
            add("CẢNH BÁO", path, 0, "evidence", f"thiếu số: {missing[:10]} — nếu đã bỏ, ghi '(bỏ — lý do)'")
    return ids


NO_TAKEAWAY = ("Cần bổ sung", "Phiếu xin", "Phụ lục", "Việc bạn tự làm", "Sau họp")


def check_tables(lines, path):
    i = 0
    heading = ""
    while i < len(lines):
        if lines[i].startswith("#"):
            heading = lines[i]
        if TABLE_ROW.match(lines[i]) and i + 1 < len(lines) and SEP_ROW.match(lines[i + 1]):
            start = i
            cols = len([c for c in lines[i].strip().strip("|").split("|")])
            if cols > 6:
                add("LỖI", path, start + 1, "bảng", f"{cols} cột — tối đa 6")
            i += 2
            while i < len(lines) and TABLE_ROW.match(lines[i]):
                i += 1
            nxt = [ln for ln in lines[i:i + 4] if ln.strip()]
            if any(k in heading for k in NO_TAKEAWAY):
                continue
            if not any("Rút ra" in ln for ln in nxt[:2]):
                add("CẢNH BÁO", path, start + 1, "bảng", "không thấy dòng '→ Rút ra:' ngay dưới bảng")
        else:
            i += 1


def check_words(lines, path):
    for i, ln in enumerate(lines, 1):
        if ln.lstrip().startswith("<!--"):
            continue
        for rx, msg in FORBIDDEN:
            if rx.search(ln):
                add("LỖI", path, i, "từ ngữ", msg)


def check_report(lines, path, ids):
    text = "\n".join(lines)
    m = re.search(r"^## 0\..*?$(.*?)^## ", text, re.S | re.M)
    if not m:
        add("LỖI", path, 0, "đọc nhanh", "không thấy mục '## 0.'")
    else:
        bullets = [ln for ln in m.group(1).splitlines() if ln.strip().startswith("- ")]
        if len(bullets) < 4:
            add("LỖI", path, 0, "đọc nhanh", f"mục 0 có {len(bullets)} dòng — cần 4 dòng đọc nhanh")
    if ids:
        for i, ln in enumerate(lines, 1):
            for a, b in EVID_REF.findall(ln):
                for n in range(int(a), int(b or a) + 1):
                    if n not in ids and n < 10000:
                        add("LỖI", path, i, "bằng chứng", f"trỏ tới #{n} nhưng evidence.md không có")
    if "Phương pháp đã dùng" not in text:
        add("CẢNH BÁO", path, 0, "phương pháp", "thiếu phụ lục 'Phương pháp đã dùng' — ghi phương pháp nào, dùng ở mục nào, ra kết quả gì")
    check_tables(lines, path)
    check_words(lines, path)


def check_brief(lines, path):
    text = "\n".join(lines)
    if not re.search(r"(Hạn trả lời|trả lời trước):?\**\s*\d{1,2}/\d{1,2}/\d{4}", text):
        add("LỖI", path, 0, "brief Dev", "chưa ghi 'Hạn trả lời: dd/mm/yyyy'")
    rounds = 1 + len(re.findall(r"^## Câu hỏi mới — Bản 2 · \d", text, re.M)) + len(re.findall(r"^## Vòng thêm · \d", text, re.M))
    extra = len(re.findall(r"^## Vòng (thứ )?[4-9]|^## Bản [3-9]", text, re.M))
    if rounds + extra > 3:
        add("LỖI", path, 0, "brief Dev", "quá 3 lần hỏi Dev — sau vòng thêm, phần chưa rõ đưa vào họp dạng rủi ro")
    today = date.today()
    for d, mth, y in re.findall(r"Hạn[^\n]*?(\d{1,2})/(\d{1,2})/(\d{4})", text):
        try:
            if date(int(y), int(mth), int(d)) < today:
                add("CẢNH BÁO", path, 0, "brief Dev", f"hạn {d}/{mth}/{y} đã qua — chưa có trả lời thì đưa vào tài liệu họp dạng rủi ro")
        except ValueError:
            pass
    check_words(lines, path)


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "docs/market")
    if not root.exists():
        print(f"Không thấy {root}"); return 1
    ev_path = root / "evidence.md"
    ev = read(ev_path)
    ids = evidence_ids(ev, ev_path) if ev else set()
    rp = root / "market-report.md"
    if read(rp) is not None:
        check_report(read(rp), rp, ids)
    else:
        add("LỖI", rp, 0, "cấu trúc", "chưa có market-report.md")
    bp = root / "dev-brief.md"
    if read(bp) is not None:
        check_brief(read(bp), bp)
    for mb in sorted(root.glob("meeting-brief-*.md")):
        lines = read(mb)
        check_words(lines, mb)
        for i, ln in enumerate(lines, 1):
            for a, b in EVID_REF.findall(ln):
                for n in range(int(a), int(b or a) + 1):
                    if ids and n not in ids:
                        add("LỖI", mb, i, "bằng chứng", f"trỏ tới #{n} nhưng evidence.md không có")
    errors = [f for f in findings if f[0] == "LỖI"]
    for lvl, where, rule, detail in findings:
        print(f"{lvl:9} {where:28} {rule:12} {detail}")
    print(f"\nTổng: {len(errors)} lỗi, {len(findings) - len(errors)} cảnh báo · {len(ids)} bằng chứng")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
