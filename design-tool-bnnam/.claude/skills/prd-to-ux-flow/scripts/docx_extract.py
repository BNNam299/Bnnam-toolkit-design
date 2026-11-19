#!/usr/bin/env python3
"""docx_extract.py — extract a PRD .docx into Markdown WITH LOCATIONS, for the prd-read job (references/prd-read.md).

Python standard library only — runs on any machine with python3.
Extracts, in reading order:
  headings and paragraphs (with paragraph number ¶) · tables (merged cells written once, with table / row number) ·
  images AT THEIR PLACE (🖼 name, pixel size) — the preview picture of an embedded Excel table is NOT counted as an image:
  the table's content is printed right there instead · embedded Excel tables (word/embeddings/*.xlsx — every sheet, every row) ·
  comments attached to their paragraph, image or table cell — also on paragraphs with no text — with resolved / reply status ·
  tracked changes not yet accepted ({+inserted+} {-deleted-}) · text boxes · hyperlinks with their address ·
  places that could NOT be read (Lark / Feishu blocks exported as "[This type of content is unavailable…]",
  embeddings that are not xlsx, comments that could not be placed) → listed at the end, so you can ask the user for the original.

    python <skill>/scripts/docx_extract.py product/sources/prd/PRD.docx            # print to screen
    python <skill>/scripts/docx_extract.py product/sources/prd/PRD.docx -o design/extract/PRD.md

Never writes into a sources/ folder — sources are read-only. The extract lives in design/extract/.
"""
import io, os, re, sys, struct, zipfile, argparse, posixpath
try:
    sys.stdout.reconfigure(encoding="utf-8")   # Windows: console / file default to cp1252 — cannot print Vietnamese
except Exception:
    pass
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
S = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
V = "{urn:schemas-microsoft-com:vml}"
O = "{urn:schemas-microsoft-com:office:office}"
MC = "{http://schemas.openxmlformats.org/markup-compatibility/2006}"
W14 = "{http://schemas.microsoft.com/office/word/2010/wordml}"
W15 = "{http://schemas.microsoft.com/office/word/2012/wordml}"
UNAVAILABLE = re.compile(r"\[?This type of content is unavailable|content is not supported|无法显示|暂不支持", re.I)
COMMENT_TAGS = (W + "commentRangeStart", W + "commentReference")


def image_size(b):
    """Pixel size of a PNG / JPEG / GIF, or None."""
    try:
        if b[:8] == b"\x89PNG\r\n\x1a\n": return struct.unpack(">II", b[16:24])
        if b[:6] in (b"GIF87a", b"GIF89a"): return struct.unpack("<HH", b[6:10])
        if b[:2] == b"\xff\xd8":
            i = 2
            while i + 9 < len(b):
                if b[i] != 0xFF: i += 1; continue
                m = b[i + 1]
                if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    h, w = struct.unpack(">HH", b[i + 5:i + 9]); return (w, h)
                i += 2 + struct.unpack(">H", b[i + 2:i + 4])[0]
    except struct.error:
        pass
    return None


class Doc:
    def __init__(self, path):
        self.z = zipfile.ZipFile(path); self.names = set(self.z.namelist())
        self.rels = {}
        if "word/_rels/document.xml.rels" in self.names:
            for r in ET.fromstring(self.z.read("word/_rels/document.xml.rels")):
                t = r.get("Target", "")
                if r.get("TargetMode") != "External": t = posixpath.normpath(posixpath.join("word", t.lstrip("/").replace("word/", "", 1) if t.startswith("/") else t))
                self.rels[r.get("Id")] = t
        self.comments, self.comment_order = {}, []
        para_of_comment = {}
        if "word/comments.xml" in self.names:
            for c in ET.fromstring(self.z.read("word/comments.xml")).findall(W + "comment"):
                cid = c.get(W + "id"); self.comment_order.append(cid)
                self.comments[cid] = {"author": c.get(W + "author", "?"), "date": (c.get(W + "date") or "")[:10],
                                      "text": self.text_of(c)[0], "done": None, "reply_to": None}
                ps = c.findall(W + "p")
                if ps and ps[-1].get(W14 + "paraId"): para_of_comment[ps[-1].get(W14 + "paraId")] = cid
        if "word/commentsExtended.xml" in self.names:
            for ex in ET.fromstring(self.z.read("word/commentsExtended.xml")).iter(W15 + "commentEx"):
                cid = para_of_comment.get(ex.get(W15 + "paraId"))
                if cid is None: continue
                self.comments[cid]["done"] = ex.get(W15 + "done") == "1"
                self.comments[cid]["reply_to"] = para_of_comment.get(ex.get(W15 + "paraIdParent"))
        self.placed = set()
        self.notes, self.images, self.previews, self.tables_done = [], [], [], set()
        self.links, self.tracked, self.textboxes = [], 0, 0
        self.xlsx_blocks = []

    # ---- text with tracked changes, text boxes and links handled ----
    def text_of(self, el):
        out, boxes = [], []

        def walk(n, mode):
            tag = n.tag
            if tag == MC + "Fallback": return                              # same content as mc:Choice — read once
            if tag == W + "txbxContent":
                boxes.append(" ".join(t for t in (self.text_of(p)[0] for p in n.iter(W + "p")) if t)); return
            if tag == W + "ins":
                s = []; [walk(c, s) for c in n]; t = "".join(s)
                if t.strip(): mode.append("{+" + t + "+}"); self.tracked += 1
                return
            if tag == W + "del":
                t = "".join(x.text or "" for x in n.iter(W + "delText"))
                if t.strip(): mode.append("{-" + t + "-}"); self.tracked += 1
                return
            if tag == W + "hyperlink":
                s = []; [walk(c, s) for c in n]; t = "".join(s)
                url = self.rels.get(n.get(R + "id"), "") if n.get(R + "id") else ""
                anchor = n.get(W + "anchor")
                if url.startswith(("http", "mailto")): mode.append(f"[{t}]({url})"); self.links.append((t, url))
                elif anchor: mode.append(f"{t} (→ #{anchor})")
                else: mode.append(t)
                return
            if tag == W + "t" and n.text: mode.append(n.text)
            elif tag == W + "tab": mode.append("\t")
            elif tag in (W + "br", W + "cr"): mode.append("\n")
            for c in n: walk(c, mode)

        walk(el, out)
        return "".join(out).strip(), [b for b in boxes if b]

    # ---- images and embedded objects inside one element ----
    def visuals(self, el):
        """Images and embedded objects of el, in order: list of markdown lines; embedded tables queued for printing."""
        lines = []

        def walk(n):
            if n.tag == MC + "Fallback": return
            if n.tag == W + "object":
                ole = next(n.iter(O + "OLEObject"), None); prev = next(n.iter(V + "imagedata"), None)
                target = self.rels.get(ole.get(R + "id"), "") if ole is not None else ""
                pv = self.rels.get(prev.get(R + "id"), "") if prev is not None else ""
                if pv: self.previews.append(posixpath.basename(pv))
                name = posixpath.basename(target) or "?"
                if target.lower().endswith((".xlsx", ".xlsm")) and target in self.names:
                    lines.append(f"📊 embedded table `{name}` (preview picture `{posixpath.basename(pv)}` — not an image, content below)")
                    self.xlsx_blocks.append(target)
                else:
                    lines.append(f"📎 embedded object `{name}` ({ole.get('ProgID', '?') if ole is not None else '?'}) — could not read")
                    self.notes.append(f"embedded `{name}` ({ole.get('ProgID', '?') if ole is not None else '?'}): not .xlsx — ask for the original")
                return
            if n.tag in (A + "blip", V + "imagedata"):
                rid = n.get(R + "embed") or n.get(R + "id") or n.get(R + "link")
                t = self.rels.get(rid, "")
                if t:
                    sz = image_size(self.z.read(t)) if t in self.names else None
                    self.images.append(posixpath.basename(t))
                    lines.append(f"🖼 `{posixpath.basename(t)}`" + (f" ({sz[0]}×{sz[1]} px)" if sz else ""))
                return
            for c in n: walk(c)

        walk(el)
        return lines

    def comments_in(self, el):
        ids = []
        for n in el.iter():
            if n.tag in COMMENT_TAGS:
                cid = n.get(W + "id")
                if cid in self.comments and cid not in self.placed and cid not in ids: ids.append(cid)
        return ids

    def comment_lines(self, ids, where="", depth=0):
        out = []
        for cid in ids:
            if cid in self.placed: continue
            self.placed.add(cid); c = self.comments[cid]
            tag = {True: "resolved", False: "open", None: "resolved or not: not recorded in the file"}[c["done"]]
            if c["reply_to"]: tag += f", reply to #{c['reply_to']}"
            out.append(f"> {'  ' * depth}💬 comment #{cid} ({c['author']}, {c['date']}, {tag}){where if not depth else ''}: {c['text']}")
            out += self.comment_lines([r for r in self.comment_order if self.comments[r]["reply_to"] == cid], where, depth + 1)
        return out


def table_md(doc, tbl, ti):
    rows, after = [], []
    for ri, tr in enumerate(tbl.findall(W + "tr")):
        cells = []
        for ci, tc in enumerate(tr.findall(W + "tc")):
            pr = tc.find(W + "tcPr")
            span, vmerge = 1, None
            if pr is not None:
                gs = pr.find(W + "gridSpan"); vm = pr.find(W + "vMerge")
                if gs is not None: span = int(gs.get(W + "val", "1"))
                if vm is not None: vmerge = vm.get(W + "val", "continue")
            parts = []
            for p in tc.iter(W + "p"):
                t, boxes = doc.text_of(p); parts.append(t); parts += [f"[text box: {b}]" for b in boxes]
                doc.textboxes += len(boxes)
            vis = doc.visuals(tc)
            t = " ".join(x for x in parts + vis if x).replace("|", "\\|").replace("\n", " ").strip()
            if vmerge == "continue": t = "↑"                        # vertically merged cell — content is in the cell above
            if UNAVAILABLE.search(t): doc.notes.append(f"table {ti} · row {ri + 1}: embedded block could not be exported")
            after += doc.comment_lines(doc.comments_in(tc), f" — on table {ti} · row {ri + 1} · column {ci + 1}")
            cells.append(t); cells.extend(["←"] * (span - 1))       # horizontally merged cell — content is in the cell to the left
        rows.append(cells)
    if not rows: return ""
    n = max(len(r) for r in rows)
    rows = [r + [""] * (n - len(r)) for r in rows]
    md = [f"**Table {ti}**", "", "| # | " + " | ".join(rows[0]) + " |", "|---|" + "---|" * n]
    md += [f"| {i + 2} | " + " | ".join(r) + " |" for i, r in enumerate(rows[1:])]
    return "\n".join(md + ([""] + after if after else []))


def xlsx_md(data, name, notes):
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


def flush_xlsx(doc, out):
    while doc.xlsx_blocks:
        t = doc.xlsx_blocks.pop(0)
        if t in doc.tables_done: continue
        doc.tables_done.add(t); out += [xlsx_md(doc.z.read(t), posixpath.basename(t), doc.notes), ""]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("docx"); ap.add_argument("-o", "--out")
    a = ap.parse_args()
    doc = Doc(a.docx)
    body = ET.fromstring(doc.z.read("word/document.xml")).find(W + "body")
    out = [f"# Extract of `{a.docx}`", "",
           "> Created by `docx_extract.py`. Locations: ¶ = paragraph number · Table n · row n. 🖼 = image at this place "
           "(after the last ¶) · 📊 = embedded Excel table, printed right here · {+text+} / {-text-} = tracked change not yet accepted. "
           "**The original file is still the source** — when unsure, reopen the original.", ""]
    pi = ti = 0
    for el in body:
        if el.tag == W + "p":
            t, boxes = doc.text_of(el); vis = doc.visuals(el); cids = doc.comments_in(el)
            if t:
                pi += 1
                if UNAVAILABLE.search(t): doc.notes.append(f"¶{pi}: embedded block could not be exported — \"{t[:60]}\"")
                st = (el.find(W + "pPr").find(W + "pStyle").get(W + "val", "") if el.find(W + "pPr") is not None and el.find(W + "pPr").find(W + "pStyle") is not None else "")
                m = re.match(r"(?:Heading|heading|Tiêu ?đề|Title)\s*(\d)?", st)
                line = ("#" * (int(m.group(1)) + 1 if m and m.group(1) else 2) + " " + t) if m else t
                out.append(f"{line}  `¶{pi}`")
            where = f"after ¶{pi}" if pi else "before ¶1"
            out += [f"{v} · {where}" if not t else v for v in vis]
            for b in boxes: doc.textboxes += 1; out.append(f"> 🗒 text box ({where}): {b}")
            target = "" if t else (" — on the image above" if vis else f" — on an empty paragraph {where}")
            out += doc.comment_lines(cids, target)
            if t or vis or boxes or cids: out.append("")
            flush_xlsx(doc, out)
        elif el.tag == W + "tbl":
            ti += 1; out += [table_md(doc, el, ti), ""]; flush_xlsx(doc, out)
    for e in sorted(n for n in doc.names if n.startswith("word/embeddings/")):
        if e in doc.tables_done: continue
        if e.lower().endswith((".xlsx", ".xlsm")):
            out += ["## Embedded table found outside the text flow", "", xlsx_md(doc.z.read(e), posixpath.basename(e), doc.notes), ""]
            doc.tables_done.add(e)
        elif not any(posixpath.basename(e) in n for n in doc.notes):
            doc.notes.append(f"embedded `{posixpath.basename(e)}`: not .xlsx — ask for the original")
    loose = [c for c in doc.comment_order if c not in doc.placed]
    if loose:
        out += ["## Comments not tied to a place in the text", ""] + doc.comment_lines(loose) + [""]
        doc.notes.append(f"{len(loose)} comment(s) not tied to a place — see 'Comments not tied to a place'")
    media = sorted((n for n in doc.names if n.startswith("word/media/")), key=lambda s: [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", s)])
    previews, shown = set(doc.previews), set(doc.images)
    real = [m for m in media if posixpath.basename(m) not in previews]
    out += ["## Images", "", f"{len(real)} images · {len(previews)} preview pictures of embedded tables / objects (not images — tables are printed in place, other objects are listed under Could not read)", ""]
    for m in real:
        sz = image_size(doc.z.read(m)); b = posixpath.basename(m)
        out.append(f"- `{b}`" + (f" {sz[0]}×{sz[1]} px" if sz else "") + ("" if b in shown else " — not placed in the text flow"))
    out.append("")
    if doc.links:
        out += ["## Links in the document", "", "Lark / Feishu / Figma links are often the readable original of a board shown as a small image — ask for access.", ""]
        seen = set()
        for t, u in doc.links:
            if u in seen: continue
            seen.add(u); out.append(f"- {t or '(no text)'} — {u}")
        out.append("")
    out += ["## Could not read — ask the user for the original / a link", ""] + ([f"- {n}" for n in doc.notes] or ["- (none)"])
    res = "\n".join(out) + "\n"
    known = [c for c in doc.comments.values() if c["done"] is not None]
    open_c = f"{sum(1 for c in known if not c['done'])} open" if known else "status not recorded"
    summary = (f"{pi} paragraphs · {ti} tables · {len(real)} images + {len(previews)} table previews · {len(doc.tables_done)} embedded tables · "
               f"{len(doc.comments)} comments ({open_c}) · {doc.tracked} tracked changes · {doc.textboxes} text boxes · "
               f"{len(set(u for _, u in doc.links))} links · {len(doc.notes)} unreadable places")
    if a.out:
        if "/sources/" in os.path.abspath(a.out).replace("\\", "/"): sys.exit("✗ will not write into a sources/ folder — sources are read-only. Write to design/extract/")
        os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
        open(a.out, "w", encoding="utf-8").write(res); print(f"✓ {a.out} · {summary}")
    else: sys.stdout.write(res + "\n" + summary + "\n")


if __name__ == "__main__":
    main()
