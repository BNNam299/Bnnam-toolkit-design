#!/usr/bin/env node
// compare-sheet.cjs — ONE image to look at the places a whole-figure score cannot see: every join, every hard part, every region
// side by side, reference | drawing, at 2×. Used by the region check (references/draw-loop.md §1 "Build sheet + look check") for copy AND
// create. It replaces zoomed crops and comparison scripts of the agent's own — look at this sheet once, write what you see per cell.
//
// usage: node compare-sheet.cjs --plan plan.json --draw draw.png --checks checks.json --out sheet.png [--scale 2] [--cols 2]
//        node compare-sheet.cjs --plan plan.json --draw draw.png --out review.png --hotspots 6   ← self-review: the areas that
//                                                       differ most, reference | drawing | difference at 4× (no checks file)
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
    else if (k === '--hotspots') o.hotspots = Math.max(1, +a[++i] || 6);
    else if (k === '--edge') o.edge = Math.max(1, Math.round(+a[++i]));  // erosion radius in px: 1 (default), 2 on a prepared (2×) reference
  }
  if (!o.checks && !o.hotspots) o.hotspots = 6;
  if (o.hotspots && !o.ref) { console.error('--hotspots needs the reference (--plan or --ref)'); process.exit(2); }
  if (!o.draw || !o.out) { console.error('need --draw and --out (plus --plan or --ref when copying, and --checks or --hotspots)'); process.exit(2); }
  return o;
}

// Self-review (draw-loop §2 pass 5): where do reference and drawing differ most? Per pixel colour distance, a 3×3 erosion so the
// 1–2 px anti-aliased edge band drops out, then the blocks with the most difference left, best first, never two overlapping. What it
// catches is what a part score cannot: a missing light / dark split inside a part (the coin face, 16/11), a colour showing under a
// detail (the orange under the coin's eyes), a detail drawn the wrong shape (a pointed leaf tip where the reference is round).
async function hotspots(refBuf, drawBuf, W, H, n, r) {
  const a = await sharp(refBuf).removeAlpha().raw().toBuffer(), b = await sharp(drawBuf).removeAlpha().raw().toBuffer();
  const T = 40, m = new Uint8Array(W * H);
  // each image's backdrop = its corner pixel (an export may come back on white while the reference sits on pink): a pixel that is
  // backdrop in both is no difference
  const near = (buf, i, c) => Math.abs(buf[3 * i] - c[0]) + Math.abs(buf[3 * i + 1] - c[1]) + Math.abs(buf[3 * i + 2] - c[2]) < 30;
  const ra = [a[0], a[1], a[2]], rb = [b[0], b[1], b[2]];
  for (let i = 0; i < W * H; i++) {
    if (near(a, i, ra) && near(b, i, rb)) continue;
    const dr = a[3 * i] - b[3 * i], dg = a[3 * i + 1] - b[3 * i + 1], db = a[3 * i + 2] - b[3 * i + 2];
    m[i] = dr * dr + dg * dg + db * db > T * T ? 1 : 0;
  }
  // erosion: a pixel stays only if its whole (2r+1)² window differs — the edge band (r = 2 on a prepared 2× reference, its band is wider)
  // drops out, a real area of difference stays. Integral image, so any r costs the same.
  const I = new Uint32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) for (let x = 0, row = 0; x < W; x++) { row += m[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + row; }
  const e = new Uint8Array(W * H), full = (2 * r + 1) ** 2;
  for (let y = r; y < H - r; y++) for (let x = r; x < W - r; x++) {
    const x0 = x - r, y0 = y - r, x1 = x + r + 1, y1 = y + r + 1;
    e[y * W + x] = I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0] === full ? 1 : 0;
  }
  const s = Math.max(6, Math.round(Math.min(W, H) / 24)), bw = Math.ceil(W / s), bh = Math.ceil(H / s), sum = new Float64Array(bw * bh);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (e[y * W + x]) sum[Math.floor(y / s) * bw + Math.floor(x / s)]++;
  // a window of 3×3 blocks around each block; pick the best, blank its neighbours, repeat
  const win = (bx, by) => { let t = 0; for (let j = by - 1; j <= by + 1; j++) for (let i = bx - 1; i <= bx + 1; i++) if (i >= 0 && j >= 0 && i < bw && j < bh) t += sum[j * bw + i]; return t; };
  const used = new Uint8Array(bw * bh), out = [], minPx = Math.max(6, s);  // fewer differing px than one block's side: noise
  for (let k = 0; k < n; k++) {
    let best = -1, bx = 0, by = 0;
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) if (!used[j * bw + i]) { const v = win(i, j); if (v > best) { best = v; bx = i; by = j; } }
    if (best < minPx) break;
    for (let j = by - 2; j <= by + 2; j++) for (let i = bx - 2; i <= bx + 2; i++) if (i >= 0 && j >= 0 && i < bw && j < bh) used[j * bw + i] = 1;
    const x = Math.max(0, (bx - 1) * s), y = Math.max(0, (by - 1) * s);
    out.push({ kind: 'hotspot', name: `${Math.round((best / (9 * s * s)) * 100)} % differs at ${x + Math.round(1.5 * s)},${y + Math.round(1.5 * s)}`, box: [x, y, Math.min(W - x, 3 * s), Math.min(H - y, 3 * s)] });
  }
  return { cells: out, mask: m };
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
  // a transparent drawing sits on the reference's own backdrop (its corner pixel), so the backdrop never counts as a difference
  let bg = '#ffffff';
  if (refBuf) { const px = await sharp(refBuf).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer(); bg = `#${[...px].map((v) => v.toString(16).padStart(2, '0')).join('')}`; }
  let drw = sharp(o.draw).ensureAlpha();
  if (W) drw = drw.resize(W, H, { fit: 'fill' });
  const drawBuf = await sharp(await drw.png().toBuffer()).flatten({ background: bg }).png().toBuffer();
  if (!W) ({ width: W, height: H } = await sharp(drawBuf).metadata());

  const cells = [];
  let diffBuf = null;
  if (o.hotspots) {
    const hs = await hotspots(refBuf, drawBuf, W, H, o.hotspots, o.edge ?? (/\.prep\.png$/i.test(o.ref) ? 2 : 1));
    cells.push(...hs.cells);
    // third panel: the reference in grey, differing pixels in red
    const g = await sharp(refBuf).greyscale().removeAlpha().raw().toBuffer(), d = Buffer.alloc(W * H * 3);
    for (let i = 0; i < W * H; i++) { const v = 150 + (g[i] >> 2); if (hs.mask[i]) { d[3 * i] = 230; d[3 * i + 1] = 30; d[3 * i + 2] = 30; } else d[3 * i] = d[3 * i + 1] = d[3 * i + 2] = v; }
    diffBuf = await sharp(d, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
    if (!hs.cells.length) console.log('hotspots: no area differs beyond the anti-aliased edge');
  }
  const checks = o.checks || {};
  for (const j of checks.joins || []) cells.push({ kind: 'join', ...j });
  for (const h of checks.hard || []) cells.push({ kind: 'hard part', ...h });
  if (checks.grid) {
    const [gc, gr] = checks.grid, cw = Math.ceil(W / gc), ch = Math.ceil(H / gr);
    for (let y = 0; y < gr; y++) for (let x = 0; x < gc; x++) cells.push({ kind: 'region', name: `r${y + 1}c${x + 1}`, box: [x * cw, y * ch, cw, ch] });
  }
  if (!cells.length) {
    if (o.hotspots) { console.log('nothing to show — reference and drawing match beyond the edge band'); return; }
    console.error('checks.json has no joins, hard parts or grid'); process.exit(2);
  }

  const LABEL = 22, GAP = 12, PAD = 12;
  const tiles = [];
  for (const c of cells) {
    let [x, y, w, h] = c.box.map(Math.round);
    const m = c.kind === 'region' || c.kind === 'hotspot' ? 0 : Math.round(Math.max(w, h) * 0.25); // a join needs what is around it
    x = Math.max(0, x - m); y = Math.max(0, y - m); w = Math.min(W - x, w + 2 * m); h = Math.min(H - y, h + 2 * m);
    if (w < 1 || h < 1) { console.error(`box outside the image: ${c.name}`); continue; }
    const k = Math.min(c.kind === 'hotspot' ? Math.max(o.scale, 4) : o.scale, 420 / w), tw = Math.max(1, Math.round(w * k)), th = Math.max(1, Math.round(h * k));
    const crop = (buf) => sharp(buf).extract({ left: x, top: y, width: w, height: h }).resize(tw, th, { kernel: 'nearest' }).png().toBuffer();
    const pics = refBuf ? [await crop(refBuf), await crop(drawBuf)] : [await crop(drawBuf)];
    if (c.kind === 'hotspot' && diffBuf) pics.push(await crop(diffBuf));
    const text = `${cells.indexOf(c) + 1}. ${c.kind} · ${c.name}${c.kind === 'hotspot' ? '  (reference | drawing | difference)' : refBuf ? '  (reference | drawing)' : ''}`;
    const picsW = pics.length * tw + (pics.length - 1) * GAP, cw = Math.max(picsW, Math.ceil(text.length * 7.6)), chh = LABEL + th;
    const label = Buffer.from(`<svg width="${cw}" height="${LABEL}"><text x="0" y="16" font-family="Arial, sans-serif" font-size="14" fill="#222">${esc(text)}</text></svg>`);
    const divider = pics.slice(1).map((_, i) => ({ input: { create: { width: 2, height: th, channels: 3, background: '#555555' } }, left: (i + 1) * (tw + GAP) - GAP / 2 - 1, top: LABEL }));
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
