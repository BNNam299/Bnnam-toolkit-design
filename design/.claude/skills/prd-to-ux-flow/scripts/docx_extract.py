#!/usr/bin/env python3
"""docx_extract.py — extract a PRD .docx into Markdown WITH LOCATIONS, for the prd-read job (references/prd-read.md).

Python standard library only — runs on any machine with python3.
Extracts: headings and paragraphs (with paragraph number ¶) · tables (merged cells written once, with table / row number) ·
comments (attached to the commented paragraph) · embedded images (file names) · embedded Excel tables (word/embeddings/*.xlsx —
every sheet, every row) · places that could NOT be read (Lark / Feishu blocks exported as "[This type of content is unavailable…]",
embeddings that are not xlsx) → listed at the end, so you can ask the user for the original.

    python <skill>/scripts/docx_extract.py product/sources/prd/PRD.docx            # print to screen
    python <skill>/scripts/docx_extract.py product/sources/prd/PRD.docx -o design/extract/PRD.md

Never writes into a sources/ folder — sources are read-only. The extract lives in design/extract/.
"""
import re, sys, zipfile, argparse, posixpath
try:
    sys.stdout.reconfigure(encoding="utf-8")   # Windows: console / file default to cp1252 — cannot print Vietnamese
except Exception:
    pass
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
S = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
UNAVAILABLE = re.compile(r"\[?This type of content is unavailable|content is not supported|无法显示|暂不支持", re.I)


def text_of(el):
    out = []
    for n in el.iter():
        if n.tag == W + "t" and n.text: out.append(n.text)
        elif n.tag == W + "tab": out.append("\t")
        elif n.tag in (W + "br", W + "cr"): out.append("\n")
    return "".join(out).strip()


def para_style(p):
    ppr = p.find(W + "pPr")
    st = ppr.find(W + "pStyle") if ppr is not None else None
    return st.get(W + "val", "") if st is not None else ""


def table_md(tbl, ti, notes):
    rows = []
    for ri, tr in enumerate(tbl.findall(W + "tr")):
        cells = []
        for tc in tr.findall(W + "tc"):
            pr = tc.find(W + "tcPr")
            span, vmerge = 1, None
            if pr is not None:
                gs = pr.find(W + "gridSpan"); vm = pr.find(W + "vMerge")
                if gs is not None: span = int(gs.get(W + "val", "1"))
                if vm is not None: vmerge = vm.get(W + "val", "continue")
            t = " ".join(text_of(p) for p in tc.iter(W + "p")).replace("|", "\\|").replace("\n", " ").strip()
            if vmerge == "continue": t = "↑"                        # vertically merged cell — content is in the cell above
            if UNAVAILABLE.search(t): notes.append(f"table {ti} · row {ri + 1}: embedded block could not be exported")
            cells.append(t); cells.extend(["←"] * (span - 1))       # horizontally merged cell — content is in the cell to the left
        rows.append(cells)
    if not rows: return ""
    n = max(len(r) for r in rows)
    rows = [r + [""] * (n - len(r)) for r in rows]
    md = [f"**Table {ti}**", "", "| # | " + " | ".join(rows[0]) + " |", "|---|" + "---|" * n]
    md += [f"| {i + 2} | " + " | ".join(r) + " |" for i, r in enumerate(rows[1:])]
    return "\n".join(md)


def xlsx_md(data, name, notes):
    import io
    try: z = zipfile.ZipFile(io.BytesIO(data))
    except zipfile.BadZipFile: notes.append(f"embedded table {name}: could not open"); return ""
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall(S + "si"):
            shared.append("".join(t.text or "" for t in si.iter(S + "t")))
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    target = {r.get("Id"): r.get("Target") for r in rels}
    out = [f"### Embedded table `{name}`"]
    for sh in wb.iter(S + "sheet"):
        path = "xl/" + target[sh.get(R + "id")].lstrip("/").replace("xl/", "")
        if path not in z.namelist(): continue
        rows = []
        for row in ET.fromstring(z.read(path)).iter(S + "row"):
            vals = {}
            for c in row.findall(S + "c"):
                ref = re.match(r"([A-Z]+)", c.get("r", "A")).group(1)
                v = c.find(S + "v"); isn = c.find(S + "is")
                if c.get("t") == "s" and v is not None: val = shared[int(v.text)]
                elif c.get("t") == "inlineStr" and isn is not None: val = "".join(t.text or "" for t in isn.iter(S + "t"))
                else: val = v.text if v is not None else ""
                vals[ref] = (val or "").replace("|", "\\|").replace("\n", " ")
            if any(vals.values()): rows.append((row.get("r"), vals))
        if not rows: continue
        cols = sorted({k for _, v in rows for k in v}, key=lambda s: (len(s), s))
        out += ["", f"**sheet {sh.get('name')}**", "", "| row | " + " | ".join(cols) + " |", "|---|" + "---|" * len(cols)]
        out += [f"| {r} | " + " | ".join(v.get(c, "") for c in cols) + " |" for r, v in rows]
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("docx"); ap.add_argument("-o", "--out")
    a = ap.parse_args()
    z = zipfile.ZipFile(a.docx); names = z.namelist()
    body = ET.fromstring(z.read("word/document.xml")).find(W + "body")
    notes, out = [], [f"# Extract of `{a.docx}`", "", "> Created by `docx_extract.py`. Locations: ¶ = paragraph number · Table n · row n. **The original file is still the source** — "
                       "when unsure, reopen the original.", ""]
    comments = {}
    if "word/comments.xml" in names:
        for c in ET.fromstring(z.read("word/comments.xml")).findall(W + "comment"):
            comments[c.get(W + "id")] = (c.get(W + "author", "?"), text_of(c))
    pi = ti = 0
    for el in body:
        if el.tag == W + "p":
            t = text_of(el)
            if not t: continue
            pi += 1
            if UNAVAILABLE.search(t): notes.append(f"¶{pi}: embedded block could not be exported — \"{t[:60]}\"")
            st = para_style(el); m = re.match(r"(?:Heading|heading|Tiêu ?đề|Title)\s*(\d)?", st)
            line = ("#" * (int(m.group(1)) + 1 if m and m.group(1) else 2) + " " + t) if m else t
            out.append(f"{line}  `¶{pi}`")
            for cr in el.iter(W + "commentRangeStart"):
                cid = cr.get(W + "id")
                if cid in comments: out.append(f"> 💬 comment ({comments[cid][0]}): {comments[cid][1]}")
            out.append("")
        elif el.tag == W + "tbl":
            ti += 1; out += [table_md(el, ti, notes), ""]
    media = [n for n in names if n.startswith("word/media/")]
    if media: out += ["## Embedded images", ""] + [f"- `{posixpath.basename(m)}`" for m in media] + [""]
    emb = [n for n in names if n.startswith("word/embeddings/")]
    for e in emb:
        if e.lower().endswith((".xlsx", ".xlsm")): out += [xlsx_md(z.read(e), posixpath.basename(e), notes), ""]
        else: notes.append(f"embedded `{posixpath.basename(e)}`: not .xlsx — ask for the original")
    out += ["## Could not read — ask the user for the original / a link", ""] + ([f"- {n}" for n in notes] or ["- (none)"])
    res = "\n".join(out) + "\n"
    if a.out:
        import os
        if "/sources/" in os.path.abspath(a.out).replace("\\", "/"): sys.exit("✗ will not write into a sources/ folder — sources are read-only. Write to design/extract/")
        os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
        open(a.out, "w", encoding="utf-8").write(res); print(f"✓ {a.out} · {pi} paragraphs · {ti} tables · {len(emb)} embeddings · {len(notes)} unreadable places")
    else: sys.stdout.write(res)


if __name__ == "__main__":
    main()
