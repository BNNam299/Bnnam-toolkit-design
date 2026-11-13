#!/usr/bin/env node
// contour.cjs — COPY jobs only: read one part's outline from the reference image so anchors land where the reference's shape is,
// then simplify it with anchors.js (fidelity-checked). Output = path data ready for a Figma vector, plus the anchor count.
// The contour places anchors; the result is still checked by eye and by score.cjs — never deliver a raw trace.
//
// usage: node contour.cjs --img ref.png (--color "#420700" [--tol 40] | --alpha) [--box x,y,w,h] [--scale 4] [--simplify 0.5]
//                         [--min-area 30] [--json]
//   --color   the part's colour in the reference (sample it first); --tol = RGB distance counted as the same colour
//   --alpha   the part is everything not transparent (a cut-out sprite)
//   --box     only look inside this rectangle (reference px) — one part at a time, e.g. the mustache box
//   --scale   output units per reference px (the drawing is 4× the sprite → 4); path coordinates start at the box's top-left
//   --src-px  size of ONE original pixel in this image (a sprite screenshotted at 2.8× → 2.8); default 1
//   --simplify  allowed deviation in OUTPUT px; default = half an original pixel × scale (0.5 × src-px × scale). Pixel stairs and
//             compression noise are smaller than one original pixel — they are not shape. Tried on a 2.8× sprite mustache: 456 traced
//             anchors → 19 at 1.5 px, scallops kept.
// A part covered by another (a mustache under the nose) only shows its visible area: extend the hidden edge by hand afterwards.
// Needs sharp (in the tool demo's node_modules): run with NODE_PATH pointing there, or from the tool demo folder.
'use strict';
const path = require('path');
const sharp = require('sharp');
const { simplifyPath, countAnchors } = require(path.join(__dirname, 'anchors.js'));

function args() {
  const a = process.argv.slice(2), o = { tol: 40, scale: 1, srcPx: 1, minArea: 30 };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--img') o.img = a[++i];
    else if (k === '--color') o.color = a[++i];
    else if (k === '--tol') o.tol = +a[++i];
    else if (k === '--alpha') o.alpha = true;
    else if (k === '--box') o.box = a[++i].split(',').map(Number);
    else if (k === '--scale') o.scale = +a[++i];
    else if (k === '--simplify') o.simplify = +a[++i];
    else if (k === '--src-px') o.srcPx = +a[++i];
    else if (k === '--min-area') o.minArea = +a[++i];
    else if (k === '--json') o.json = true;
  }
  if (o.simplify === undefined) o.simplify = Math.max(0.25, 0.5 * o.srcPx * o.scale);
  if (!o.img || (!o.color && !o.alpha)) { console.error('need --img and --color or --alpha'); process.exit(2); }
  return o;
}
const hex = (h) => { const n = parseInt(h.replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };

// Binary mask → soft field (two 3×3 box blurs) so the iso-line at 0.5 runs between pixel centres, not along pixel stairs.
function blur(f, W, H) {
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) { n++; continue; } s += f[yy * W + xx]; n++; }
    out[y * W + x] = s / n;
  }
  return out;
}

// Marching squares on the field at iso 0.5 → closed loops of points (field coordinates).
function marching(f, W, H) {
  const v = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : f[y * W + x]);
  const lerp = (a, b) => (0.5 - a) / (b - a);
  const segs = new Map(); // key -> [otherKey], points by key
  const pts = new Map();
  const edgePt = (key, p) => { if (!pts.has(key)) pts.set(key, p); return key; };
  const link = (a, b) => { (segs.get(a) || segs.set(a, []).get(a)).push(b); (segs.get(b) || segs.set(b, []).get(b)).push(a); };
  for (let y = -1; y < H; y++) for (let x = -1; x < W; x++) {
    const tl = v(x, y), tr = v(x + 1, y), br = v(x + 1, y + 1), bl = v(x, y + 1);
    const c = (tl > 0.5 ? 8 : 0) | (tr > 0.5 ? 4 : 0) | (br > 0.5 ? 2 : 0) | (bl > 0.5 ? 1 : 0);
    if (c === 0 || c === 15) continue;
    const T = () => edgePt(`h${x},${y}`, { x: x + lerp(tl, tr), y });
    const R = () => edgePt(`v${x + 1},${y}`, { x: x + 1, y: y + lerp(tr, br) });
    const B = () => edgePt(`h${x},${y + 1}`, { x: x + lerp(bl, br), y: y + 1 });
    const L = () => edgePt(`v${x},${y}`, { x, y: y + lerp(tl, bl) });
    const centre = (tl + tr + br + bl) / 4 > 0.5;
    switch (c) {
      case 1: case 14: link(L(), B()); break;
      case 2: case 13: link(B(), R()); break;
      case 3: case 12: link(L(), R()); break;
      case 4: case 11: link(T(), R()); break;
      case 6: case 9: link(T(), B()); break;
      case 7: case 8: link(L(), T()); break;
      case 5: if (centre) { link(L(), T()); link(B(), R()); } else { link(L(), B()); link(T(), R()); } break;
      case 10: if (centre) { link(T(), R()); link(L(), B()); } else { link(L(), T()); link(B(), R()); } break;
    }
  }
  const seen = new Set(), loops = [];
  for (const start of segs.keys()) {
    if (seen.has(start)) continue;
    const loop = []; let prev = null, cur = start;
    while (cur && !seen.has(cur)) { seen.add(cur); loop.push(pts.get(cur)); const nx = (segs.get(cur) || []).find((k) => k !== prev && !seen.has(k)); prev = cur; cur = nx; }
    if (loop.length > 2) loops.push(loop);
  }
  return loops;
}
const area = (l) => { let s = 0; for (let i = 0; i < l.length; i++) { const a = l[i], b = l[(i + 1) % l.length]; s += a.x * b.y - b.x * a.y; } return s / 2; };

// Library use (vectorize.cjs): require('./contour.cjs') → { blur, marching, area }. CLI only when run directly.
module.exports = { blur, marching, area };
if (require.main === module) (async () => {
  const o = args();
  const img = sharp(o.img).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const [bx, by, bw, bh] = o.box || [0, 0, info.width, info.height];
  const W = Math.round(bw), H = Math.round(bh), want = o.color && hex(o.color);
  const mask = new Float32Array(W * H);
  let on = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = ((y + by) * info.width + (x + bx)) * 4;
    const a = data[i + 3];
    const hit = o.alpha ? a > 127 : a > 127 && Math.hypot(data[i] - want[0], data[i + 1] - want[1], data[i + 2] - want[2]) <= o.tol;
    if (hit) { mask[y * W + x] = 1; on++; }
  }
  if (!on) { console.error('no pixel matched — sample the colour again or raise --tol'); process.exit(1); }
  const loops = marching(blur(blur(mask, W, H), W, H), W, H).filter((l) => Math.abs(area(l)) >= o.minArea);
  const s = o.scale, f = (n) => String(Math.round(n * 1000) / 1000);
  const raw = loops.map((l) => 'M ' + l.map((p) => `${f(p.x * s)} ${f(p.y * s)}`).join(' L ') + ' Z').join(' ');
  const r = simplifyPath(raw, { tol: o.simplify });
  const out = { box: [bx, by, bw, bh], scale: s, simplify: o.simplify, loops: loops.length, holes: loops.filter((l) => area(l) > 0).length,
    pixels: on, anchorsTraced: countAnchors(raw), anchors: r.after, maxDev: r.maxDev, windingRule: 'EVENODD', d: r.d };
  if (o.json) console.log(JSON.stringify(out));
  else {
    console.log(`loops ${out.loops} · traced ${out.anchorsTraced} anchors → ${out.anchors} (max ${out.maxDev} px) · windingRule EVENODD`);
    console.log(out.d);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
