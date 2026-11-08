#!/usr/bin/env python3
"""check_market.py — mechanical checks on docs/market/ so the agent does not re-read everything by eye.

Usage: python check_market.py [docs/market]                 check everything
       python check_market.py [docs/market] --mark-reader   after writing reader/*.md: record them so hand edits can be shown
Prints one line per finding (file:line · rule · detail) and a summary. Exit code 0 = no errors, 1 = errors found.
If the user edited a reader md since it was marked, the changed lines are printed at the end.
It checks form, not judgement: whether a number is right or a conclusion is sound is still the agent's and the team's job.
"""
import io
import re
import sys
for _s in (sys.stdout, sys.stderr):  # Windows consoles default to cp1252 and crash on Vietnamese
    try:
        _s.reconfigure(encoding="utf-8")
    except AttributeError:
        pass
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
    name = f"{path.parent.name}/{path.name}" if path.parent.name == "reader" else path.name
    findings.append((level, f"{name}:{line}", rule, detail))


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
    if not re.search(r"(Hạn trả lời|trả lời trước):?\**\s*\d{1,2}/\d{1,2}/\d{4}", text) and not re.search(r"Không đặt hạn", text, re.I):
        add("LỖI", path, 0, "brief Dev", "chưa ghi 'Hạn trả lời: dd/mm/yyyy' (hoặc 'Không đặt hạn' nếu bạn yêu cầu)")
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

READER_RULES = [
    (re.compile(r"(?<![\w&])#\d+"), "số bằng chứng (#..) — bản đọc không dùng, ghi nguồn ngắn bằng chữ"),
    (re.compile(r"\b[NT]\d\b|\bFEAT-|§\s?\d"), "mã nội bộ (N1, T1, FEAT-, §) — gọi bằng tên thường"),
    (re.compile(r"<!--"), "comment HTML — bỏ khỏi bản đọc"),
    (re.compile(r"[\w/-]+\.(md|kt|py|js|json)\b|market-(kickoff|scan|dig|score|decide|standards)"), "tên file / skill — người đọc không mở được"),
    (re.compile(r"\b\d+([.,]\d+)?\s?[KM]\b"), "đơn vị K/M — viết 'nghìn' / 'triệu'"),
    (re.compile(r"\bcommit\b|\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b"), "mã commit / repo — để ở tài liệu cho Dev"),
]


def check_reader(lines, path, for_dev=False):
    # Dev opens the repo: file names, paths and commits are allowed in the Dev brief's reader copy.
    rules = [r for r in READER_RULES if not (for_dev and ("tên file" in r[1] or "commit" in r[1]))]
    for i, ln in enumerate(lines, 1):
        for rx, msg in rules:
            if rx.search(ln):
                add("LỖI", path, i, "bản đọc", msg)
                break
    arrows = sum(ln.count("→") for ln in lines)
    if arrows > 3:
        add("CẢNH BÁO", path, 0, "bản đọc", f"{arrows} mũi tên '→' — viết thành câu đủ chủ vị")
    if len(lines) > 220:
        add("CẢNH BÁO", path, 0, "bản đọc", f"{len(lines)} dòng — bản đọc nên đọc xong trong 5–10 phút")
    check_words(lines, path)


MARK_FILE = ".written"


def fingerprint(path):
    import hashlib
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()[:16]


def read_marks(reader_dir):
    marks = {}
    f = reader_dir / MARK_FILE
    if f.exists():
        for ln in f.read_text(encoding="utf-8").splitlines():
            if " " in ln:
                name, h = ln.split(" ", 1)
                marks[name] = h.strip()
    return marks


def mark_reader(reader_dir):
    """Record what the agent just wrote (fingerprint + a copy in reader/.goc/), so later hand edits can be shown."""
    import shutil
    files = sorted(p for p in reader_dir.glob("*.md"))
    (reader_dir / MARK_FILE).write_text("".join(f"{p.name} {fingerprint(p)}\n" for p in files), encoding="utf-8")
    goc = reader_dir / ".goc"
    goc.mkdir(exist_ok=True)
    for p in files:
        shutil.copyfile(p, goc / p.name)
    print("Đã ghi dấu bản đọc: " + ", ".join(p.name for p in files))


hand_edits = []


def check_hand_edit(path, marks):
    h = marks.get(path.name)
    if h is None:
        add("CẢNH BÁO", path, 0, "bản đọc", "chưa ghi dấu — sau khi viết bản đọc, chạy lại với --mark-reader")
    elif h != fingerprint(path):
        add("LỖI", path, 0, "bản đọc đã sửa tay",
            "người dùng đã sửa bản đọc — phần sửa in ở cuối; đưa vào bản làm việc (hỏi nếu đổi kết luận) rồi mới viết lại")
        orig = path.parent / ".goc" / path.name
        if orig.exists():
            import difflib
            a = orig.read_text(encoding="utf-8").splitlines()
            b = path.read_text(encoding="utf-8").splitlines()
            diff = [d for d in difflib.unified_diff(a, b, "bản agent viết", "bản người dùng sửa", n=0, lineterm="")]
            hand_edits.append((path.name, diff[:80]))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    root = Path(args[0] if args else "docs/market")
    if not root.exists():
        print(f"Không thấy {root}"); return 1
    if "--mark-reader" in sys.argv:
        if not (root / "reader").exists():
            print("Không có thư mục reader/"); return 1
        mark_reader(root / "reader"); return 0
    ev_path = root / "evidence.md"
    ev = read(ev_path)
    ids = evidence_ids(ev, ev_path) if ev else set()
    rp = root / "market-report.md"
    if read(rp) is not None:
        check_report(read(rp), rp, ids)
    else:
        add("LỖI", rp, 0, "cấu trúc", "chưa có market-report.md")
    reader_dir, export_dir = root / "reader", root / "export"
    marks = read_marks(reader_dir)
    rd = reader_dir / "market-report.md"
    if read(rp) is not None:
        if read(rd) is not None:
            check_reader(read(rd), rd)
            check_hand_edit(rd, marks)
        elif not (export_dir / "market-report.docx").exists():
            add("CẢNH BÁO", rd, 0, "bản đọc", "chưa có bản đọc cho người — viết lại cuối mỗi bước (reader-copy.md)")
    bp = root / "dev-brief.md"
    if read(bp) is not None:
        rdb = reader_dir / "dev-brief.md"
        if read(rdb) is not None:
            check_reader(read(rdb), rdb, for_dev=True)
            check_hand_edit(rdb, marks)
        elif not (export_dir / "dev-brief.docx").exists():
            add("CẢNH BÁO", rdb, 0, "bản đọc", "chưa có bản đọc của brief cho Dev — reader-copy.md 'Dev brief'")
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
    for name, diff in hand_edits:
        print(f"\n--- Phần người dùng sửa trong reader/{name} ---")
        print("\n".join(diff))
    print(f"\nTổng: {len(errors)} lỗi, {len(findings) - len(errors)} cảnh báo · {len(ids)} bằng chứng")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
