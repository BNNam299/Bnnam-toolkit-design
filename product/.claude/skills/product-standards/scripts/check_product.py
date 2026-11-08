#!/usr/bin/env python3
"""check_product.py — mechanical checks on docs/product/ (IDs, levels, links, AC tags, wording).

Usage: python check_product.py [docs/product]
Prints one line per finding (file:line · rule · detail) and a summary. Exit 0 = no errors, 1 = errors found.
It checks form and traceability only; whether a feature is right is still the team's call.
"""
import io
import re
import sys
from pathlib import Path

LEVELS = ["Đề xuất", "Đủ để thiết kế", "Đủ để build", "Đã phát hành"]
FORBIDDEN = [
    (re.compile(r"NO[- ]?GO|\bGO\s*/\s*NO", re.I), "dùng 'làm tiếp / đổi hướng / dừng', không dùng GO / NO-GO"),
    (re.compile(r"(?<![\w])(anh|chị)\s+(cần|có thể|muốn|xem|gửi|duyệt|chọn|nhé)", re.I), "xưng 'bạn', không xưng anh / chị"),
]
findings = []


def add(level, path, line, rule, detail):
    findings.append((level, f"{path.name}:{line}", rule, detail))


def read(path):
    return io.open(path, encoding="utf-8").read().splitlines() if path.exists() else None


def words(lines, path):
    for i, ln in enumerate(lines, 1):
        if ln.lstrip().startswith("<!--"):
            continue
        for rx, msg in FORBIDDEN:
            if rx.search(ln):
                add("LỖI", path, i, "từ ngữ", msg)


def dup_defs(lines, path, rx, kind):
    seen = {}
    for i, ln in enumerate(lines, 1):
        m = rx.match(ln)
        if m:
            k = m.group(1)
            if k in seen:
                add("LỖI", path, i, kind, f"{k} định nghĩa 2 lần (dòng {seen[k]}) — mã không đánh lại, không dùng lại")
            seen[k] = i
    return seen


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "docs/product")
    prd_p, req_p, dec_p = root / "prd.md", root / "requirements.md", root / "decisions.md"
    prd, req, dec = read(prd_p), read(req_p), read(dec_p)
    if prd is None:
        print(f"Không thấy {prd_p}"); return 1

    # --- prd.md: feature table vs feature blocks, levels, bans, §0
    table = {}
    in10 = False
    for i, ln in enumerate(prd, 1):
        if ln.startswith("## "):
            in10 = ln.startswith("## 10.")
        m = re.match(r"^\|\s*(FEAT-\d+)\s*\|(.*)\|\s*$", ln) if in10 else None
        if m:
            cells = [c.strip() for c in m.group(2).split("|")]
            lvl = next((c for c in cells if c in LEVELS), None)
            prio = next((c for c in cells if re.fullmatch(r"P[0-2]", c)), None)
            if lvl is None:
                add("LỖI", prd_p, i, "mức", f"{m.group(1)}: mức phải là một trong {LEVELS}")
            table[m.group(1)] = (lvl, prio, i)
    blocks = dup_defs(prd, prd_p, re.compile(r"^###\s+(FEAT-\d+)\b"), "tính năng")
    for f, (lvl, prio, i) in table.items():
        if lvl and lvl != "Đề xuất" and f not in blocks:
            add("CẢNH BÁO", prd_p, i, "tính năng", f"{f} ở mức '{lvl}' nhưng chưa có khối '### {f}' trong §10")
    for f, i in blocks.items():
        if f not in table:
            add("LỖI", prd_p, i, "tính năng", f"{f} có khối nhưng không có trong bảng §10")
    text = "\n".join(prd)
    if re.search(r"^## 4\.", text, re.M) and "Chưa làm" not in text.split("## 4.")[1].split("\n## ")[0] and "BAN-" not in text:
        add("LỖI", prd_p, 0, "điều cấm", "§4 đã viết nhưng không có BAN- nào — phạm vi chưa cắt gì")
    m = re.search(r"^## 0\..*?$(.*?)^## ", text, re.S | re.M)
    if m and len([l for l in m.group(1).splitlines() if l.strip().startswith("- ")]) < 4:
        add("LỖI", prd_p, 0, "đọc nhanh", "§0 cần 4 dòng: Đang làm · Tình trạng · Cần chốt · Bước tiếp")
    if re.search(r"^## 1\.", text, re.M) and "Nền tảng:" in text and re.search(r"Nền tảng:\s*<", text):
        add("CẢNH BÁO", prd_p, 0, "nền tảng", "§1 chưa ghi nền tảng (iOS / Android / cả hai) — product-kickoff phải hỏi")
    if re.search(r"^## 0\.", text, re.M) and "Đọc theo vai trò" not in text:
        add("CẢNH BÁO", prd_p, 0, "vai trò", "thiếu khối 'Đọc theo vai trò' dưới §0 — Dev và Designer cần biết đọc mục nào")
    def sec(n):
        m2 = re.search(rf"^## {n}\..*?$(.*?)(?=^## |\Z)", text, re.S | re.M)
        return m2.group(1) if m2 else ""
    s5, s11 = sec(5), sec(11)
    if "Phương pháp đã dùng" not in text:
        add("CẢNH BÁO", prd_p, 0, "phương pháp", "§15 thiếu 'Phương pháp đã dùng' — ghi phương pháp nào, dùng ở mục nào, ra kết quả gì")
    if re.search(r"PER-\d+", s5) and "Empathy map" not in s5:
        add("CẢNH BÁO", prd_p, 0, "người dùng", "§5 có persona nhưng chưa có empathy map — persona phải dựng từ map có nguồn")
    if re.search(r"^\|\s*SCR-\d+", s11, re.M) and not ("Sitemap" in s11 and "Luồng tổng" in s11):
        add("CẢNH BÁO", prd_p, 0, "luồng", "§11 có danh sách màn nhưng thiếu sitemap / luồng tổng dạng chữ — PRD phải tự đủ khi không có Figma")
    words(prd, prd_p)

    # --- requirements.md: UC / FR links, AC tags, traceability
    if req is not None:
        ucs = dup_defs(req, req_p, re.compile(r"^###\s+(UC-\d+)\b"), "UC")
        frs = dup_defs(req, req_p, re.compile(r"^###\s+(FR-\d+)\b"), "FR")
        fr_feat, fr_p0 = {}, set()
        cur_fr = None
        for i, ln in enumerate(req, 1):
            m = re.match(r"^###\s+(UC-\d+).*?(FEAT-\d+)", ln)
            if m and table and m.group(2) not in table:
                add("LỖI", req_p, i, "truy vết", f"{m.group(1)} trỏ tới {m.group(2)} không có trong bảng §10")
            m = re.match(r"^###\s+(FR-\d+)(.*)$", ln)
            if m:
                cur_fr = m.group(1)
                uc = re.search(r"UC-\d+", m.group(2))
                if uc and uc.group(0) not in ucs:
                    add("LỖI", req_p, i, "truy vết", f"{cur_fr} trỏ tới {uc.group(0)} chưa định nghĩa")
                if re.search(r"·\s*P0\b", m.group(2)):
                    fr_p0.add(cur_fr)
                continue
            if ln.startswith("## "):
                cur_fr = None
            am = re.match(r"^\s*-\s*(AC-[\d.]+)", ln)
            if am and cur_fr:
                if "[Lead kiểm]" not in ln and "[Dev kiểm]" not in ln:
                    add("CẢNH BÁO", req_p, i, "nghiệm thu", f"{am.group(1)} chưa gắn [Lead kiểm] / [Dev kiểm] (bắt buộc từ mức Đủ để build)")
        trace = "\n".join(l for l in req if l.startswith("|"))
        if re.search(r"^## 9\.", "\n".join(req), re.M) and "Chưa làm" not in "\n".join(req).split("## 9.")[1][:200]:
            for fr in sorted(fr_p0):
                if fr not in trace:
                    add("CẢNH BÁO", req_p, 0, "truy vết", f"{fr} (P0) chưa có dòng trong bảng truy vết §9")
        for i, ln in enumerate(prd, 1):
            for ref in re.findall(r"\b(FR-\d+|UC-\d+)\b", ln):
                if ref.startswith("FR") and frs and ref not in frs:
                    add("LỖI", prd_p, i, "truy vết", f"{ref} được nhắc nhưng requirements.md không có")
                if ref.startswith("UC") and ucs and ref not in ucs:
                    add("LỖI", prd_p, i, "truy vết", f"{ref} được nhắc nhưng requirements.md không có")
        words(req, req_p)

    # --- decisions.md: unique D- and R- ids, who + date
    if dec is not None:
        for rx, kind in ((re.compile(r"^\|\s*(D-\d+)\s*\|"), "quyết định"), (re.compile(r"^\|\s*(R-\d+)\s*\|"), "hàng chờ")):
            dup_defs(dec, dec_p, rx, kind)
        for i, ln in enumerate(dec, 1):
            if re.match(r"^\|\s*D-\d+\s*\|", ln) and not re.search(r"\d{1,2}/\d{1,2}/\d{4}", ln):
                add("LỖI", dec_p, i, "quyết định", "thiếu ngày · ai chốt")
        words(dec, dec_p)

    errors = [f for f in findings if f[0] == "LỖI"]
    for lvl, where, rule, detail in findings:
        print(f"{lvl:9} {where:26} {rule:11} {detail}")
    print(f"\nTổng: {len(errors)} lỗi, {len(findings) - len(errors)} cảnh báo · {len(table)} tính năng")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
