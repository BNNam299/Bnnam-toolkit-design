#!/usr/bin/env node
/**
 * export_docx.js — Convert a markdown document (report, meeting brief, PRD…) to a formatted .docx
 * Usage: node export_docx.js <input.md> <output.docx>
 * Needs the npm package "docx" (npm install -g docx, or npm install docx next to this script).
 *
 * Adapted from export_prd.js of the prd-builder skill (pipeline-v2 kit, prd-architect). Changes: strips
 * HTML comments and inline backticks, skips code-fence markers, keeps the original dialect below.
 *
 * Dialect: # title · **Key**: value meta lines · ## H1 · ### H2 · #### H3 ·
 * "- " bullets (2-space nesting) · GitHub pipe tables · "> " callouts · **bold** inline ·
 * status tags [CONFIRMED]/[DRAFT]/[RESEARCH] are stripped on export.
 */
const fs = require("fs");
const path = require("path");
let docxLib;
try { docxLib = require("docx"); } catch (e) {
  console.error('Missing npm package "docx". Install once: npm install -g docx  (then set NODE_PATH to the global node_modules), or run npm install docx in this folder.');
  process.exit(2);
}
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  LevelFormat, convertInchesToTwip,
} = docxLib;

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) { console.error("Usage: node export_prd.js <input.md> <output.docx>"); process.exit(1); }
const src = fs.readFileSync(inPath, "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/`([^`]*)`/g, "$1");

// ---------- helpers ----------
const ACCENT = "1F4E79";   // heading blue
const HEADER_BG = "D9E2F3"; // table header fill
const stripTags = (s) => s.replace(/\s*\[(CONFIRMED|DRAFT|RESEARCH[^\]]*)\]\s*/g, " ").replace(/\s+$/,"");

// Inline **bold** parser -> TextRun[]
function runs(text, extra = {}) {
  const out = [];
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) {
    if (!p) continue;
    const m = p.match(/^\*\*([^*]+)\*\*$/);
    if (m) out.push(new TextRun({ text: m[1], bold: true, ...extra }));
    else out.push(new TextRun({ text: p, ...extra }));
  }
  return out.length ? out : [new TextRun({ text: "", ...extra })];
}

// ---------- parse markdown into blocks ----------
const lines = src.split(/\r?\n/);
const blocks = [];
let i = 0;
while (i < lines.length) {
  const raw = lines[i];
  const line = raw.replace(/\s+$/, "");
  if (!line.trim() || line.trim() === "---" || /^```/.test(line.trim())) { i++; continue; }

  let m;
  if ((m = line.match(/^# (.+)$/)))       { blocks.push({ t: "title", text: stripTags(m[1]) }); i++; continue; }
  if ((m = line.match(/^## (.+)$/)))      { blocks.push({ t: "h1", text: stripTags(m[1]) }); i++; continue; }
  if ((m = line.match(/^### (.+)$/)))     { blocks.push({ t: "h2", text: stripTags(m[1]) }); i++; continue; }
  if ((m = line.match(/^#### (.+)$/)))    { blocks.push({ t: "h3", text: stripTags(m[1]) }); i++; continue; }
  if ((m = line.match(/^> ?(.*)$/)))      { blocks.push({ t: "callout", text: stripTags(m[1]) }); i++; continue; }

  // pipe table: header | --- | rows
  if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
    const rows = [];
    const parseRow = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => stripTags(c.trim()));
    rows.push(parseRow(line));
    i += 2;
    while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(parseRow(lines[i])); i++; }
    blocks.push({ t: "table", rows });
    continue;
  }

  if ((m = line.match(/^(\s*)- (.+)$/))) {
    const level = Math.min(Math.floor(m[1].length / 2), 3);
    blocks.push({ t: "bullet", level, text: stripTags(m[2]) });
    i++; continue;
  }

  // meta line right after title zone: **Key**: value
  if ((m = line.match(/^\*\*([^*]+)\*\*\s*:\s*(.*)$/)) && blocks.length && blocks.filter(b=>b.t==="h1").length===0) {
    blocks.push({ t: "meta", key: m[1].trim(), value: stripTags(m[2]) }); i++; continue;
  }

  blocks.push({ t: "p", text: stripTags(line) }); i++;
}

// ---------- build docx children ----------
const children = [];
const numbering = {
  config: [{
    reference: "prd-bullets",
    levels: [0,1,2,3].map((lvl) => ({
      level: lvl, format: LevelFormat.BULLET, text: ["•","◦","▪","▫"][lvl], alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: convertInchesToTwip(0.30 + 0.25*lvl), hanging: convertInchesToTwip(0.19) } } },
    })),
  }],
};

function makeTable(rows) {
  const nCols = Math.max(...rows.map((r) => r.length));
  const total = 9600; // DXA usable width on A4 with 0.7" margins
  const colW = Array(nCols).fill(Math.floor(total / nCols));
  const trows = rows.map((r, ri) => new TableRow({
    tableHeader: ri === 0,
    children: Array.from({ length: nCols }, (_, ci) => new TableCell({
      width: { size: colW[ci], type: WidthType.DXA },
      shading: ri === 0 ? { type: ShadingType.CLEAR, fill: HEADER_BG } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({
        children: runs(r[ci] ?? "", { size: 19, bold: ri === 0 ? true : undefined }),
        spacing: { before: 20, after: 20 },
      })],
    })),
  }));
  return new Table({ rows: trows, columnWidths: colW, width: { size: total, type: WidthType.DXA },
    borders: {
      top:{style:BorderStyle.SINGLE,size:4,color:"999999"}, bottom:{style:BorderStyle.SINGLE,size:4,color:"999999"},
      left:{style:BorderStyle.SINGLE,size:4,color:"999999"}, right:{style:BorderStyle.SINGLE,size:4,color:"999999"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:4,color:"BBBBBB"}, insideVertical:{style:BorderStyle.SINGLE,size:4,color:"BBBBBB"},
    }});
}

let pendingMeta = [];
function flushMeta() {
  if (!pendingMeta.length) return;
  for (const mrow of pendingMeta) {
    children.push(new Paragraph({
      children: [new TextRun({ text: mrow.key + ": ", bold: true, size: 21 }), ...runs(mrow.value, { size: 21 })],
      spacing: { after: 40 },
    }));
  }
  pendingMeta = [];
}

for (const b of blocks) {
  if (b.t === "title") {
    children.push(new Paragraph({ children: runs(b.text, { size: 40, bold: true, color: ACCENT }), spacing: { after: 200 } , alignment: AlignmentType.CENTER}));
  } else if (b.t === "meta") {
    pendingMeta.push(b);
  } else if (b.t === "h1") {
    flushMeta();
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(b.text, { size: 30, bold: true, color: ACCENT }), spacing: { before: 320, after: 140 } }));
  } else if (b.t === "h2") {
    flushMeta();
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(b.text, { size: 24, bold: true, color: "2E5E8C" }), spacing: { before: 220, after: 100 } }));
  } else if (b.t === "h3") {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: runs(b.text, { size: 22, bold: true, color: "444444" }), spacing: { before: 160, after: 80 } }));
  } else if (b.t === "bullet") {
    children.push(new Paragraph({ children: runs(b.text, { size: 21 }), numbering: { reference: "prd-bullets", level: b.level }, spacing: { after: 40 } }));
  } else if (b.t === "table") {
    flushMeta();
    children.push(makeTable(b.rows));
    children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
  } else if (b.t === "callout") {
    children.push(new Paragraph({
      children: runs(b.text, { size: 19, italics: true, color: "555555" }),
      spacing: { before: 80, after: 80 },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 8 } },
      indent: { left: convertInchesToTwip(0.15) },
    }));
  } else if (b.t === "p") {
    flushMeta();
    children.push(new Paragraph({ children: runs(b.text, { size: 21 }), spacing: { after: 100 } }));
  }
}
flushMeta();

const doc = new Document({
  numbering,
  styles: { default: { document: { run: { font: "Calibri", size: 21 } } } },
  sections: [{
    properties: { page: { margin: { top: convertInchesToTwip(0.7), bottom: convertInchesToTwip(0.7), left: convertInchesToTwip(0.7), right: convertInchesToTwip(0.7) } } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log("Wrote", outPath, "(" + buf.length + " bytes,", blocks.length, "blocks)");
}).catch((e) => { console.error("Export failed:", e.message); process.exit(1); });
