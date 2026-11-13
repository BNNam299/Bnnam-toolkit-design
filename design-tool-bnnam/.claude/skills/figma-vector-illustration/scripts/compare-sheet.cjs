#!/usr/bin/env node
// compare-sheet.cjs — ONE image to look at the places a whole-figure score cannot see: every join, every hard part, every region
// side by side, reference | drawing, at 2×. Used by the region check (references/draw-loop.md §1 "Build sheet + look check") for copy AND
// create. It replaces zoomed crops and comparison scripts of the agent's own — look at this sheet once, write what you see per cell.
//
// usage: node compare-sheet.cjs --plan plan.json --draw draw.png --checks checks.json --out sheet.png [--scale 2] [--cols 2]
//        node compare-sheet.cjs --ref ref.png [--crop x,y,w,h] --draw draw.png --checks checks.json --out sheet.png
//        node compare-sheet.cjs --draw draw.png --checks checks.json --out sheet.png        ← create route B: no reference, the
//                                                                                          drawing alone, one cell per check
//   --plan: the vectorize.cjs plan → reference image + crop come from it (draw.png is resized to the crop, as score.cjs does)
//   checks.json: { "joins": [{ "name": "Sleeve L ↔ Shoulder", "box": [x, y, w, h] }, …],
//                  "hard":  [{ "name": "Hand R", "box": [...] }, …],
//                  "grid":  [3, 4] }                                     ← optional: cut the figure into 3 columns × 4 rows of
//                                                                           neighbouring regions (the region pass)
//     boxes in reference-crop px (the same px as the draw hints and score rows). Each box gets a 25 % margin so the join's
//     surroundings are in view.
//   --scale: zoom of every cell (default 2; a cell is capped at 420 px wide so the sheet stays readable)
// Prints the list of cells in sheet order — answer each one in the report with what you saw (not "ok").
'use strict';
const sharp = require('sharp');
const fs = require('fs');

function args() {
  const a = process.argv.slice(2), o = { scale: 2, cols: 2 };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--plan') { const p = JSON.parse(fs.readFileSync(a[++i], 'utf8')); o.ref = p.img; o.crop = p.crop; }
    else if (k === '--ref') o.ref = a[++i];
    else if (k === '--crop') o.crop = a[++i].split(',').map(Number);
    else if (k === '--draw') o.draw = a[++i];
    else if (k === '--checks') o.checks = JSON.parse(fs.readFileSync(a[++i], 'utf8'));
    else if (k === '--out') o.out = a[++i];
    else if (k === '--scale') o.scale = +a[++i];
    else if (k === '--cols') o.cols = Math.max(1, +a[++i]);
  }
  if (!o.draw || !o.checks || !o.out) { console.error('need --draw, --checks and --out (plus --plan or --ref when copying)'); process.exit(2); }
  return o;
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

(async () => {
  const o = args();
  // the reference crop sets the coordinate space; with no reference the drawing does
  let refBuf = null, W, H;
  if (o.ref) {
    let r = sharp(o.ref);
    if (o.crop) r = r.extract({ left: o.crop[0], top: o.crop[1], width: o.crop[2], height: o.crop[3] });
    refBuf = await r.ensureAlpha().flatten({ background: '#ffffff' }).png().toBuffer();
    ({ width: W, height: H } = await sharp(refBuf).metadata());
  }
  let drw = sharp(o.draw).ensureAlpha().flatten({ background: '#ffffff' });
  if (W) drw = drw.resize(W, H, { fit: 'fill' });
  const drawBuf = await drw.png().toBuffer();
  if (!W) ({ width: W, height: H } = await sharp(drawBuf).metadata());

  const cells = [];
  for (const j of o.checks.joins || []) cells.push({ kind: 'join', ...j });
  for (const h of o.checks.hard || []) cells.push({ kind: 'hard part', ...h });
  if (o.checks.grid) {
    const [gc, gr] = o.checks.grid, cw = Math.ceil(W / gc), ch = Math.ceil(H / gr);
    for (let y = 0; y < gr; y++) for (let x = 0; x < gc; x++) cells.push({ kind: 'region', name: `r${y + 1}c${x + 1}`, box: [x * cw, y * ch, cw, ch] });
  }
  if (!cells.length) { console.error('checks.json has no joins, hard parts or grid'); process.exit(2); }

  const LABEL = 22, GAP = 12, PAD = 12;
  const tiles = [];
  for (const c of cells) {
    let [x, y, w, h] = c.box.map(Math.round);
    const m = c.kind === 'region' ? 0 : Math.round(Math.max(w, h) * 0.25); // a join needs what is around it
    x = Math.max(0, x - m); y = Math.max(0, y - m); w = Math.min(W - x, w + 2 * m); h = Math.min(H - y, h + 2 * m);
    if (w < 1 || h < 1) { console.error(`box outside the image: ${c.name}`); continue; }
    const k = Math.min(o.scale, 420 / w), tw = Math.max(1, Math.round(w * k)), th = Math.max(1, Math.round(h * k));
    const crop = (buf) => sharp(buf).extract({ left: x, top: y, width: w, height: h }).resize(tw, th, { kernel: 'nearest' }).png().toBuffer();
    const pics = refBuf ? [await crop(refBuf), await crop(drawBuf)] : [await crop(drawBuf)];
    const text = `${cells.indexOf(c) + 1}. ${c.kind} · ${c.name}${refBuf ? '  (reference | drawing)' : ''}`;
    const picsW = pics.length * tw + (pics.length - 1) * GAP, cw = Math.max(picsW, Math.ceil(text.length * 7.6)), chh = LABEL + th;
    const label = Buffer.from(`<svg width="${cw}" height="${LABEL}"><text x="0" y="16" font-family="Arial, sans-serif" font-size="14" fill="#222">${esc(text)}</text></svg>`);
    const divider = pics.length > 1 ? [{ input: { create: { width: 2, height: th, channels: 3, background: '#555555' } }, left: tw + GAP / 2 - 1, top: LABEL }] : [];
    const tile = await sharp({ create: { width: cw, height: chh, channels: 3, background: '#ffffff' } })
      .composite([{ input: label, left: 0, top: 0 }, ...pics.map((p, i) => ({ input: p, left: i * (tw + GAP), top: LABEL })), ...divider]).png().toBuffer();
    tiles.push({ buf: tile, w: cw, h: chh, c });
  }
  // grid of tiles, row height = tallest tile in the row
  const rows = [];
  for (let i = 0; i < tiles.length; i += o.cols) rows.push(tiles.slice(i, i + o.cols));
  const colW = Array.from({ length: o.cols }, (_, ci) => Math.max(0, ...rows.map((r) => (r[ci] ? r[ci].w : 0))));
  const SW = PAD * (o.cols + 1) + colW.reduce((s, v) => s + v, 0);
  const rowH = rows.map((r) => Math.max(...r.map((t) => t.h)));
  const SH = PAD * (rows.length + 1) + rowH.reduce((s, v) => s + v, 0);
  const comp = []; let yy = PAD;
  rows.forEach((r, ri) => { let xx = PAD; r.forEach((t, ci) => { comp.push({ input: t.buf, left: xx, top: yy }); xx += colW[ci] + PAD; }); yy += rowH[ri] + PAD; });
  await sharp({ create: { width: SW, height: SH, channels: 3, background: '#eeeeee' } }).composite(comp).png().toFile(o.out);
  console.log(`sheet ${SW}×${SH} → ${o.out} · ${tiles.length} cells${refBuf ? ' (reference | drawing)' : ' (drawing only)'}`);
  tiles.forEach((t, i) => console.log(`${String(i + 1).padStart(2)}. ${t.c.kind.padEnd(9)} ${t.c.name}`));
  console.log('Answer every cell in the report with what you saw — overlap or gap, taper, layering, missing detail, finish — never "ok".');
})().catch((e) => { console.error(e.message); process.exit(1); });
