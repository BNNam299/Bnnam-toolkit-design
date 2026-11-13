#!/usr/bin/env node
// score.cjs — COPY jobs (a reference image, or a concept image the designer generated): how close is the drawing to the reference,
// part by part. Replaces "it lines up" by eye — and replaces excuses: the verdict is the WORST part, and the edge-tolerant score
// already forgives anti-aliasing, so a part that still fails is a wrong shape, not "blur of the original".
// Both images must show the same area at the same scale (screenshot the reference crop and the drawing in two frames of the same
// size, same scale). The drawing is resized to the reference if the pixel sizes differ.
//
// usage: node score.cjs --ref ref.png --draw draw.png [--parts parts.json] [--edge 1] [--bg "#ffffff"] [--diff diff.png] [--json]
//        node score.cjs --plan plan.json --draw draw.png [--groups Head] [--diff diff.png]   ← the vectorize.cjs plan: reference,
//        crop and every part (colours + box) come from it; --groups scores only those groups, --only p07,p12 only those parts
//        (refine re-scores just the parts it touched)
//   parts.json: [{ "name": "Mustache", "color": "#420700", "tol": 40 }, { "name": "Cap", "box": [x, y, w, h] }, …]
//     color → the part = pixels of that colour in each image (shape match of that colour region)
//     box   → the part = the silhouette inside that rectangle (reference px)
//   --edge: width in px of the band along the reference's edges that is ignored for the tolerant score — set it to the size of ONE
//           original pixel in this image (a sprite shown at 4× → 4). Default 1.
//   --bg:   background colour when the images have no transparency (default: the top-left pixel of each image)
//   --diff: write a mismatch map — red = in the reference only (missing), blue = in the drawing only (extra), grey = match
// Prints per part: IoU (strict), IoU± (edge-tolerant — the one judged), box offset (dx dy dw dh, reference px), mean colour
// difference ΔE (CIE76, < 3 invisible, < 6 close, > 10 visibly off), verdict; then the overall verdict = the worst part.
'use strict';
const sharp = require('sharp');
const fs = require('fs');

function args() {
  const a = process.argv.slice(2), o = { edge: 1 };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--ref') o.ref = a[++i];
    else if (a[i] === '--draw') o.draw = a[++i];
    else if (a[i] === '--parts') o.parts = JSON.parse(fs.readFileSync(a[++i], 'utf8'));
    else if (a[i] === '--edge') o.edge = Math.max(0, Math.round(+a[++i]));
    else if (a[i] === '--bg') o.bg = a[++i];
    else if (a[i] === '--diff') o.diff = a[++i];
    else if (a[i] === '--json') o.json = true;
    else if (a[i] === '--plan') o.plan = JSON.parse(fs.readFileSync(a[++i], 'utf8'));
    else if (a[i] === '--groups') o.groups = a[++i].split(',').map((x) => x.trim());
    else if (a[i] === '--only') o.only = a[++i].split(',').map((x) => x.trim());
  }
  if (o.plan) {
    o.ref = o.plan.img; o.crop = o.plan.crop; o.edge = Math.max(1, Math.round(o.plan.srcPx || 1));
    o.parts = [];
    for (const g of o.plan.groups) if (!o.groups || o.groups.includes(g.name))
      for (const p of g.parts) if (!o.only || o.only.includes(p.name)) o.parts.push({ name: `${g.name} / ${p.name}`, colors: p.colors || [p.color], tol: p.tol || 30, box: p.box });
  }
  if (!o.ref || !o.draw) { console.error('need --ref and --draw (or --plan and --draw)'); process.exit(2); }
  return o;
}
const hex = (h) => { const n = parseInt(h.replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
function lab([r, g, b]) {
  const f = (c) => { c /= 255; return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92; };
  const R = f(r), G = f(g), B = f(b);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const t = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  return [116 * t(Y) - 16, 500 * (t(X) - t(Y)), 200 * (t(Y) - t(Z))];
}
async function load(file, W, H, crop) {
  let img = sharp(file);
  if (crop) img = img.extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] });
  img = img.ensureAlpha();
  if (W) img = img.resize(W, H, { fit: 'fill' });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}
// Morphology on a 0/1 mask (square neighbourhood, n passes).
function morph(m, W, H, n, grow) {
  let cur = m;
  for (let k = 0; k < n; k++) {
    const out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = grow ? 0 : 1;
      for (let dy = -1; dy <= 1 && (grow ? !v : v); dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy, s = xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : cur[yy * W + xx];
        if (grow && s) { v = 1; break; } if (!grow && !s) { v = 0; break; }
      }
      out[y * W + x] = v;
    }
    cur = out;
  }
  return cur;
}

(async () => {
  const o = args();
  const ref = await load(o.ref, 0, 0, o.crop);
  const drw = await load(o.draw, ref.W, ref.H);
  const { W, H } = ref;
  const px = (im, i) => [im.data[i * 4], im.data[i * 4 + 1], im.data[i * 4 + 2], im.data[i * 4 + 3]];
  const bgOf = (im) => (o.bg ? hex(o.bg) : px(im, 0).slice(0, 3));
  const fg = (im) => { const bg = bgOf(im), m = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) { const [r, g, b, a] = px(im, i); m[i] = a > 127 && Math.hypot(r - bg[0], g - bg[1], b - bg[2]) > 30 ? 1 : 0; } return m; };
  const F = [fg(ref), fg(drw)];
  // plan.palette (auto-plan): a pixel counts for a part only when its nearest palette colour is one of the part's — as vectorize does
  const pal = o.plan && o.plan.palette ? o.plan.palette.map(hex) : null;
  const nearIdx = pal ? [ref, drw].map((im) => { const idx = new Int16Array(W * H);
    for (let i = 0; i < W * H; i++) { const [r, g, b] = px(im, i); let bi = 0, bd = Infinity;
      pal.forEach((c, k) => { const d = Math.hypot(r - c[0], g - c[1], b - c[2]); if (d < bd) { bd = d; bi = k; } }); idx[i] = bi; } return idx; }) : null;
  const maskOf = (im, k, part) => { const m = new Uint8Array(W * H);
    if (part.color || part.colors) { const names = part.colors || [part.color], cs = names.map(hex), tol = part.tol || 40;
      const own = nearIdx ? new Set(names.map((n) => o.plan.palette.findIndex((p) => p.toLowerCase() === String(n).toLowerCase())).filter((i) => i >= 0)) : null;
      const [x0, y0, w, h] = part.box || [0, 0, W, H];
      for (let y = Math.max(0, y0); y < Math.min(H, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) { const i = y * W + x;
        const [r, g, b, a] = px(im, i); m[i] = a > 127 && cs.some((c) => Math.hypot(r - c[0], g - c[1], b - c[2]) <= tol)
          && (!own || !own.size || own.has(nearIdx[k][i])) ? 1 : 0; } }
    else { const [x0, y0, w, h] = part.box || [0, 0, W, H];
      for (let y = Math.max(0, y0); y < Math.min(H, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) m[y * W + x] = F[k][y * W + x]; }
    return m; };
  const box = (m) => { let x0 = W, y0 = H, x1 = -1, y1 = -1; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return x1 < 0 ? null : [x0, y0, x1 - x0 + 1, y1 - y0 + 1]; };
  const parts = [{ name: 'Whole silhouette' }, ...(o.parts || [])];
  const rows = parts.map((p) => {
    const a = maskOf(ref, 0, p), b = maskOf(drw, 1, p);
    // the band along the reference's edge (anti-aliasing, half-pixels) is ignored for the tolerant score
    const band = o.edge ? (() => { const g = morph(a, W, H, o.edge, true), s = morph(a, W, H, o.edge, false), m = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) m[i] = g[i] && !s[i] ? 1 : 0; return m; })() : null;
    let inter = 0, uni = 0, tI = 0, tU = 0, dE = 0, n = 0;
    for (let i = 0; i < W * H; i++) {
      if (a[i] || b[i]) uni++;
      if (a[i] && b[i]) inter++;
      if (band && band[i]) continue;
      // colour is judged inside the part, off the anti-aliased band (edge pixels are blends, a flat fill never matches them)
      if (a[i] && b[i]) { const l1 = lab(px(ref, i)), l2 = lab(px(drw, i)); dE += Math.hypot(l1[0] - l2[0], l1[1] - l2[1], l1[2] - l2[2]); n++; }
      if (a[i] || b[i]) tU++; if (a[i] && b[i]) tI++;
    }
    let iou = uni ? inter / uni : 0, tol = band ? (tU ? tI / tU : 1) : iou;
    // a thin part (a seam, a crease, a lid line: 1–3 px) lies almost wholly in the edge band, so IoU± would read 0 for a perfect line —
    // judge it instead by how much of each mask lies within one edge band of the other
    let na = 0, inBand = 0; for (let i = 0; i < W * H; i++) if (a[i]) { na++; if (band && band[i]) inBand++; }
    if (band && na && inBand >= 0.8 * na) { const ga = morph(a, W, H, o.edge, true), gb = morph(b, W, H, o.edge, true); let ab = 0, nb = 0, bb2 = 0;
      for (let i = 0; i < W * H; i++) { if (a[i] && gb[i]) ab++; if (b[i]) { nb++; if (ga[i]) bb2++; } }
      tol = nb ? Math.min(ab / na, bb2 / nb) : 0; }
    const ba = box(a), bb = box(b);
    const off = ba && bb ? [bb[0] - ba[0], bb[1] - ba[1], bb[2] - ba[2], bb[3] - ba[3]] : null;
    const de = n ? dE / n : null;
    const whole = p.name === 'Whole silhouette', need = whole ? 0.9 : 0.85;
    // the whole silhouette is judged on shape only: its ΔE mixes the blend pixels between parts; colour is judged per part
    const verdict = !ba ? 'not in the reference — check colour / box' : !bb ? 'MISSING in the drawing'
      : tol >= need && (whole || de === null || de <= 6) ? 'ok' : tol < need ? 'FAIL shape — redraw' : 'FAIL colour';
    return { part: p.name, iou: Math.round(iou * 1000) / 1000, iouTolerant: Math.round(tol * 1000) / 1000, offset: off, deltaE: de === null ? null : Math.round(de * 10) / 10, verdict, need, a, b };
  });
  const failing = rows.filter((r) => r.verdict !== 'ok');
  const worst = failing.reduce((w, r) => (r.iouTolerant - r.need < w.iouTolerant - w.need ? r : w), failing[0]);
  const why = (r) => (r.verdict === 'FAIL colour' ? `ΔE ${r.deltaE} > 6` : r.verdict.startsWith('FAIL') ? `IoU± ${r.iouTolerant} < ${r.need}` : r.verdict);
  const overall = failing.length ? `NOT DONE — ${failing.length} part(s) fail: ${failing.map((r) => r.part.replace(/^.* \/ /, '')).join(', ')}; worst: ${worst.part} (${why(worst)}). Fix only these, or report them as not done with the diff map — never as "close enough".` : 'DONE — every part passes';
  if (o.diff) {
    const all = rows[0], out = Buffer.alloc(W * H * 3);
    for (let i = 0; i < W * H; i++) { const r = all.a[i], d = all.b[i];
      const c = r && d ? [200, 200, 200] : r ? [230, 40, 40] : d ? [40, 90, 230] : [255, 255, 255]; out[i * 3] = c[0]; out[i * 3 + 1] = c[1]; out[i * 3 + 2] = c[2]; }
    for (const p of rows.slice(1)) { // per-part mismatches drawn darker on top
      for (let i = 0; i < W * H; i++) if (p.a[i] !== p.b[i]) { const c = p.a[i] ? [150, 0, 0] : [0, 30, 150]; out[i * 3] = c[0]; out[i * 3 + 1] = c[1]; out[i * 3 + 2] = c[2]; } }
    await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(o.diff);
  }
  const clean = rows.map(({ a, b, need, ...r }) => r);
  if (o.json) return console.log(JSON.stringify({ size: [W, H], edge: o.edge, rows: clean, overall }));
  console.log(`size ${W}×${H} · edge band ${o.edge}px ignored for IoU± · pass: whole ≥ 0.90, each part ≥ 0.85 (IoU±), ΔE ≤ 6`);
  console.log('part'.padEnd(20) + 'IoU    IoU±   ' + 'offset dx dy dw dh'.padEnd(22) + 'ΔE     verdict');
  for (const r of clean) console.log(r.part.padEnd(20) + String(r.iou).padEnd(7) + String(r.iouTolerant).padEnd(7) + (r.offset ? r.offset.join(' ') : '—').padEnd(22) + String(r.deltaE ?? '—').padEnd(7) + r.verdict);
  console.log(overall);
  if (o.diff) console.log(`mismatch map: ${o.diff} (red = missing, blue = extra; darker = inside a scored part)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
