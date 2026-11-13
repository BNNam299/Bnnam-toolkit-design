#!/usr/bin/env node
// vectorize.cjs — COPY jobs (a reference, or a concept image the designer generated): turn a PART PLAN into lean vector paths, group
// by group, so the drawing appears in Figma cluster by cluster and the agent never types coordinates.
// Passes 0–4 of the copy loop (references/draw-loop.md §2). The draft plan comes from --auto-plan (colours measured, never typed);
// the agent only adds tweaks (draw, inside, tol…) and, at lock, names via --names; this script measures and traces every part; the plugin command `build_vectors` reads the scene file and builds / replaces the groups.
//
// usage:
//   node vectorize.cjs --palette --img ref.png [--crop x,y,w,h] [--top 16]      → dominant flat colours with area + box (to re-measure a colour that looks wrong)
//   node vectorize.cjs --auto-plan draft.json --img ref.png [--crop x,y,w,h] --scale 4 [--src-px 1] [--name "Hero · vector"]
//        [--out draft-scene.json] [--render draft.png]
//        → a DRAFT plan: every flat-colour region (connected) becomes a part p01, p02… (one group "Draft") with a seed and the colour
//          measured from the image, plus draft.labels.png showing each part's number on the reference. With --out it also writes the
//          scene straight away — build it at once, the draft is on the canvas in about a minute; names come later.
//   node vectorize.cjs --names names.json --plan draft.json --to plan.json
//        → the LOCK pass: names.json only says which draft parts make which named part, in which group, back → front:
//          { "frame": "Hero · vector", "groups": [{ "name": "Legs", "parts": [{ "name": "Leg L", "from": ["p03", "p17"] }] }],
//            "drop": ["p41"] }
//          seeds, colours and boxes are copied from the draft (several parts → seeds + colours joined, boxes united) — colours are
//          never typed. Every draft part must be used or dropped; tweaks made to draft parts (tol, box, complete) carry over.
//   node vectorize.cjs --plan plan.json --out scene.json [--groups Head,Body] [--render preview.png] [--no-clean]
//        → scene for build_vectors (only those groups if given); --render also draws the scene to a PNG (preview / scoring offline)
//   CLEAN step (default; --no-clean or a part's "clean": false skips it): each traced piece is replaced by the simplest clean shape
//   that matches it (fit-shapes.cjs: rect · rounded rect · pill / circle / ellipse · straight polygon). Big parts nothing fits are
//   listed with a draw hint (corners in crop px); the agent tidies the hint into a part's "draw" (a path string, { rect: [x, y, w,
//   h, r] }, { ellipse: [cx, cy, rx, ry] }, or an array of them) — a few numbers, never a traced outline typed out.
//
// plan.json:
// { "img": "C:/abs/ref.png", "crop": [x, y, w, h],          // reference px; omit crop = whole image
//   "scale": 4,                                              // drawing px per reference px
//   "srcPx": 1,                                              // size of one ORIGINAL pixel in this image (a 2× screenshot → 2)
//   "frame": { "name": "Hero · vector" },
//   "groups": [                                              // back → front; parts inside a group back → front
//     { "name": "Legs", "parts": [
//       { "name": "Leg L", "color": "#8fc31f", "tol": 30, "box": [x, y, w, h] },        // box in CROP px
//       { "name": "Boot L", "colors": ["#5a2410", "#7a3a1c"], "box": [...], "complete": false },
//       { "name": "Belt", "color": "#5b230c", "seeds": [[60, 190], [80, 190]] } ] } ] }    // seeds: crop px inside the part
//   seeds (optional): the part = the connected regions of its colour(s) that contain these points — exact, never grabs another region
//   of the same colour; with a box, only inside the box. Without seeds: every pixel of the colour(s) inside the box.
//   color / colors: the part's pixels (several shades of one part → colors). box: where the part is (keeps same-colour parts apart).
//   simplify (optional, rarely needed): how far (ORIGINAL px) the smooth refit of a traced outline may move from the trace, default 1.
//   gradient (lock): the part is one tone changing across it → one linear gradient measured on its pixels (join tone-step bands).
//   overlay (lock): a shade laid over a base — true (tint = plan.shadowTint, else the darkest palette colour) or "#hex"; opacity is
//   computed; base = the part it sits inside, or "over": "<name>". opacity / blend ("MULTIPLY", "SOFT_LIGHT"…) pass to Figma.
//   Group names with "/" nest ("Head/Eye L" inside "Head"; list the holder first).
//   complete (default true): the part is drawn whole — what hides behind parts listed LATER (in front) inside the part's own convex
//   hull is filled in, so a mustache under a nose stays one mustache and an arm under a sleeve reaches the shoulder. Set false for
//   parts that really have a hole or a cut.
//   inside (default auto): a detail sitting inside another part stays inside it — the owner is the part behind it holding ≥ 75 % of
//   its border (eye in a face, button on a coat, cuff on a sleeve), or "inside": "<part name>"; "inside": false for a detail that
//   really crosses the edge. Clean shapes that would poke out are refused; a `draw` that pokes out is reported. The scene part
//   carries "inside" so the report can list it.
//   family (plan top level, default auto): the style's shape family for the pill / ellipse close call — auto = votes of the pieces
//   seen whole, by size; ["pill"] / ["ellipse"] from the build sheet; [] = off.
//   same (plan top level, default auto): matched sets drawn as one shape (same kind, width, length; mirrored for left / right) —
//   [["Eye L", "Eye R"], …] by name, false = off. Auto: same colour, similar width and size, detail-sized (≥ 10 × 10 original px).
//   A member shorter than its model grows toward its cut end; where it grows under a bigger part's colour, a "<name> cover" part
//   in that colour is added in front (an eyelid painted in the head's colour).
// Output scene.json: { frame: {name, width, height}, groups: [{ name, parts: [{ name, fill, x, y, d, windingRule, anchors, maxDev }] }] }
// Coordinates: frame px; each part's path starts at its own top-left (x, y) = the top-left of the CURVE (Figma places by it, not by the
// handles). Lean paths: traced outlines → anchors.js fitOutline (long smooth curves, stairs never become anchors). Seams between touching parts are closed (each part grows one
// original pixel into anti-aliased borders and under the parts in front).
'use strict';
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { simplifyPath, fitOutline, pathBounds, parsePath, countAnchors } = require(path.join(__dirname, 'anchors.js'));
const { blur, marching, area } = require(path.join(__dirname, 'contour.cjs'));
const { components, fitComponent, fitAs, pick, dpClosed } = require(path.join(__dirname, 'fit-shapes.cjs'));

function args() {
  const a = process.argv.slice(2), o = { top: 16 };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--palette') o.palette = true;
    else if (k === '--img') o.img = a[++i];
    else if (k === '--crop') o.crop = a[++i].split(',').map(Number);
    else if (k === '--top') o.top = +a[++i];
    else if (k === '--plan') o.plan = a[++i];
    else if (k === '--out') o.out = a[++i];
    else if (k === '--groups') o.groups = a[++i].split(',').map((s) => s.trim());
    else if (k === '--auto-plan') o.autoPlan = a[++i];
    else if (k === '--scale') o.scale = +a[++i];
    else if (k === '--src-px') o.srcPx = +a[++i];
    else if (k === '--name') o.name = a[++i];
    else if (k === '--render') o.render = a[++i];
    else if (k === '--names') o.names = a[++i];
    else if (k === '--to') o.to = a[++i];
    else if (k === '--no-clean') o.clean = false;
    else if (k === '--rough') o.rough = true;
    else if (k === '--dark') o.dark = true;
  }
  return o;
}
const hex = (h) => { const n = parseInt(h.replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

async function loadCrop(img, crop) {
  const { data, info } = await sharp(img).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const [cx, cy, cw, ch] = crop || [0, 0, info.width, info.height];
  return { data, IW: info.width, cx, cy, W: Math.round(cw), H: Math.round(ch),
    at: (x, y) => { const i = ((y + cy) * info.width + (x + cx)) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; } };
}

// --palette: flat colours by area (5-bit bins, merged when close), each with its box — the raw material of the plan.
async function palette(o) {
  const im = await loadCrop(o.img, o.crop);
  const bins = new Map();
  for (let y = 0; y < im.H; y++) for (let x = 0; x < im.W; x++) {
    const [r, g, b, a] = im.at(x, y); if (a < 128) continue;
    const k = (r >> 3) << 10 | (g >> 3) << 5 | (b >> 3);
    let e = bins.get(k); if (!e) bins.set(k, e = { n: 0, r: 0, g: 0, b: 0, x0: x, y0: y, x1: x, y1: y });
    e.n++; e.r += r; e.g += g; e.b += b; e.x0 = Math.min(e.x0, x); e.y0 = Math.min(e.y0, y); e.x1 = Math.max(e.x1, x); e.y1 = Math.max(e.y1, y);
  }
  const list = [...bins.values()].map((e) => ({ ...e, c: [e.r / e.n, e.g / e.n, e.b / e.n] })).sort((p, q) => q.n - p.n);
  const merged = [];
  for (const e of list) {
    const m = merged.find((x) => Math.hypot(x.c[0] - e.c[0], x.c[1] - e.c[1], x.c[2] - e.c[2]) < 24);
    if (m) { m.n += e.n; m.x0 = Math.min(m.x0, e.x0); m.y0 = Math.min(m.y0, e.y0); m.x1 = Math.max(m.x1, e.x1); m.y1 = Math.max(m.y1, e.y1); }
    else merged.push({ ...e });
  }
  const total = merged.reduce((s, e) => s + e.n, 0);
  console.log(`crop ${im.W}×${im.H} · ${merged.length} colour groups · top ${o.top} (anti-aliased edge colours are the small ones — skip them)`);
  for (const e of merged.slice(0, o.top))
    console.log(`${toHex(...e.c)}  ${(100 * e.n / total).toFixed(1).padStart(5)}%  box ${e.x0},${e.y0},${e.x1 - e.x0 + 1},${e.y1 - e.y0 + 1}`);
}

// plan.palette (written by --auto-plan): a pixel belongs only to the palette colour nearest to it, so two close greens never bleed
// into each other. own(names) → (x, y) → true when the pixel's nearest palette colour is one of the part's colours (always true
// for a hand-made plan without a palette, or colours not in it).
function nearestOf(palette, at, W, H) {
  if (!palette || !palette.length) return { own: () => () => true };
  const pc = palette.map(hex), idx = new Int16Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [r, g, b] = at(x, y); let bi = 0, bd = Infinity;
    pc.forEach((c, i) => { const d = Math.hypot(r - c[0], g - c[1], b - c[2]); if (d < bd) { bd = d; bi = i; } }); idx[y * W + x] = bi; }
  return { own: (names) => { const set = new Set(names.map((n) => palette.findIndex((p) => p.toLowerCase() === String(n).toLowerCase())).filter((i) => i >= 0));
    return set.size ? (x, y) => set.has(idx[y * W + x]) : () => true; } };
}

// `draw` in a plan part: the agent's own clean shape for a part the fit cannot do, in CROP reference px (same space as box / seeds):
//   "M 10 20 L 30 20 C …"  ·  { "rect": [x, y, w, h, r?] } (r: one radius or [tl, tr, br, bl])  ·  { "ellipse": [cx, cy, rx, ry] }
//   · or an array of those for a part in several pieces. A few numbers, never a traced outline typed out.
function drawnPath(dr) {
  if (Array.isArray(dr) && dr.length && typeof dr[0] !== 'number') return dr.map(drawnPath).join(' ');
  if (typeof dr === 'string') return dr;
  const k = 0.5522847498;
  if (dr.rect) { const [x, y, w, h, rr] = dr.rect, [a, b, c, e] = Array.isArray(rr) ? rr : [rr || 0, rr || 0, rr || 0, rr || 0];
    const R = x + w, B = y + h, q = (r) => r * (1 - k);
    return `M ${x + a} ${y} L ${R - b} ${y}` + (b ? ` C ${R - q(b)} ${y} ${R} ${y + q(b)} ${R} ${y + b}` : '') + ` L ${R} ${B - c}`
      + (c ? ` C ${R} ${B - q(c)} ${R - q(c)} ${B} ${R - c} ${B}` : '') + ` L ${x + e} ${B}` + (e ? ` C ${x + q(e)} ${B} ${x} ${B - q(e)} ${x} ${B - e}` : '')
      + ` L ${x} ${y + a}` + (a ? ` C ${x} ${y + q(a)} ${x + q(a)} ${y} ${x + a} ${y}` : '') + ' Z'; }
  if (dr.ellipse) { const [cx, cy, rx, ry] = dr.ellipse;
    return `M ${cx + rx} ${cy} C ${cx + rx} ${cy + k * ry} ${cx + k * rx} ${cy + ry} ${cx} ${cy + ry} C ${cx - k * rx} ${cy + ry} ${cx - rx} ${cy + k * ry} ${cx - rx} ${cy}`
      + ` C ${cx - rx} ${cy - k * ry} ${cx - k * rx} ${cy - ry} ${cx} ${cy - ry} C ${cx + k * rx} ${cy - ry} ${cx + rx} ${cy - k * ry} ${cx + rx} ${cy} Z`; }
  throw new Error('draw: use a path string, { rect: [x, y, w, h, r?] } or { ellipse: [cx, cy, rx, ry] }');
}

// Convex hull (monotone chain) of a mask, from each row's extreme pixels. bb = [x0, y0, x1, y1] (inclusive) limits the scan.
function hull(mask, W, H, bb) {
  const pts = [], [bx0, by0, bx1, by1] = bb || [0, 0, W - 1, H - 1];
  for (let y = by0; y <= by1; y++) { let l = -1, r = -1; for (let x = bx0; x <= bx1; x++) if (mask[y * W + x]) { if (l < 0) l = x; r = x; }
    if (l >= 0) { pts.push([l, y], [r + 1, y], [l, y + 1], [r + 1, y + 1]); } }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const inHull = (h, x, y) => { for (let i = 0; i < h.length; i++) { const a = h[i], b = h[(i + 1) % h.length];
  if ((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) < 0) return false; } return true; };

// One part's colour change: the direction (of 12) along which its pixels' colour follows a straight line best, and 2–3 stops from
// the fit (the ends at the 5th / 95th percentile, a middle stop when the middle is off the line). null when nothing changes.
function measureGradient(mask, W, at) {
  const px = []; for (let i = 0; i < mask.length; i++) if (mask[i]) { const x = i % W, y = (i / W) | 0; px.push([x + 0.5, y + 0.5, at(x, y)]); }
  if (px.length < 30) return null;
  let tot = 0; const mean = [0, 0, 0]; for (const p of px) for (let q = 0; q < 3; q++) mean[q] += p[2][q] / px.length;
  for (const p of px) for (let q = 0; q < 3; q++) tot += (p[2][q] - mean[q]) ** 2;
  if (tot / px.length < 25) return null;   // a flat colour (< 5 levels of spread)
  let best = null;
  for (let a = 0; a < 12; a++) { const th = (a * Math.PI) / 12, c = Math.cos(th), sn = Math.sin(th);
    const t = px.map((p) => p[0] * c + p[1] * sn), tm = t.reduce((x, y) => x + y, 0) / t.length; let tt = 0; for (const v of t) tt += (v - tm) ** 2;
    let expl = 0; const slope = [0, 0, 0];
    for (let q = 0; q < 3; q++) { let st = 0; px.forEach((p, i) => { st += (t[i] - tm) * (p[2][q] - mean[q]); }); slope[q] = st / (tt || 1); expl += slope[q] * slope[q] * tt; }
    if (!best || expl > best.expl) best = { th, c, sn, t, tm, slope, expl }; }
  if (best.expl / tot < 0.35) return null;
  const sorted = best.t.slice().sort((x, y) => x - y), lo = sorted[Math.floor(0.05 * sorted.length)], hi = sorted[Math.floor(0.95 * sorted.length)];
  if (hi - lo < 2) return null;
  const colourAt = (tv) => mean.map((m, q) => Math.max(0, Math.min(255, m + best.slope[q] * (tv - best.tm))));
  const mid = (lo + hi) / 2, band = px.filter((p, i) => Math.abs(best.t[i] - mid) < (hi - lo) * 0.06);
  const stops = [{ color: toHex(...colourAt(lo)), pos: 0 }];
  if (band.length > 10) { const mc = [0, 1, 2].map((q) => band.reduce((x, p) => x + p[2][q], 0) / band.length), lc = colourAt(mid);
    if (Math.hypot(mc[0] - lc[0], mc[1] - lc[1], mc[2] - lc[2]) > 8) stops.push({ color: toHex(...mc), pos: 0.5 }); }
  stops.push({ color: toHex(...colourAt(hi)), pos: 1 });
  const cx = px.reduce((x, p) => x + p[0], 0) / px.length, cy = px.reduce((x, p) => x + p[1], 0) / px.length, tc = cx * best.c + cy * best.sn;
  const pt = (tv) => [cx + (tv - tc) * best.c, cy + (tv - tc) * best.sn];
  return { from: pt(lo), to: pt(hi), stops };
}

async function build(o) {
  const plan = JSON.parse(fs.readFileSync(o.plan, 'utf8'));
  const im = await loadCrop(plan.img, plan.crop);
  const { W, H } = im, S = plan.scale || 1, srcPx = plan.srcPx || 1, tol = Math.max(0.25, 0.75 * srcPx * S);  // below one original pixel: colour noise, not shape
  const flat = [];
  plan.groups.forEach((g, gi) => g.parts.forEach((p, pi) => flat.push({ g, gi, p, pi })));
  const near = nearestOf(plan.palette, (x, y) => im.at(x, y), W, H);
  // every part's own mask first (needed to know what lies in front of whom)
  for (const f of flat) {
    const names = f.p.colors || [f.p.color], cols = names.map(hex), t = f.p.tol || 30, [bx, by, bw, bh] = f.p.box || [0, 0, W, H];
    const m = new Uint8Array(W * H); let n = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
    const set = (x, y) => { m[y * W + x] = 1; n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
    const inBox = (x, y) => x >= Math.max(0, bx) && y >= Math.max(0, by) && x < Math.min(W, bx + bw) && y < Math.min(H, by + bh);
    const own = near.own(names);
    const match = (x, y) => { const [r, g, b, a] = im.at(x, y); return a >= 128 && cols.some((c) => Math.hypot(r - c[0], g - c[1], b - c[2]) <= t) && own(x, y); };
    const seeds = f.p.seeds || (f.p.seed ? [f.p.seed] : null);
    if (seeds) { // flood fill from each seed over matching pixels (4-neighbour)
      const stack = [];
      for (const [sx, sy] of seeds) { const x = Math.round(sx), y = Math.round(sy); if (inBox(x, y) && match(x, y) && !m[y * W + x]) { set(x, y); stack.push(x, y); } }
      while (stack.length) { const y = stack.pop(), x = stack.pop();
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (nx < 0 || ny < 0 || nx >= W || ny >= H || m[ny * W + nx] || !inBox(nx, ny) || !match(nx, ny)) continue;
          set(nx, ny); stack.push(nx, ny); } }
    } else
      for (let y = Math.max(0, by); y < Math.min(H, by + bh); y++) for (let x = Math.max(0, bx); x < Math.min(W, bx + bw); x++)
        if (match(x, y)) set(x, y);
    // bb = the mask's box (inclusive), kept up to date as the mask grows: every later pass over a part scans its box, not the whole
    // image (a 1254 px reference with ~400 parts took 3 minutes per build when each part scanned every pixel several times)
    f.mask = m; f.n = n; f.bb = n ? [x0, y0, x1, y1] : [0, 0, -1, -1];
  }
  const grownBB = (bb, d) => [Math.max(0, bb[0] - d), Math.max(0, bb[1] - d), Math.min(W - 1, bb[2] + d), Math.min(H - 1, bb[3] + d)];
  const eachIn = (bb, fn) => { for (let y = bb[1]; y <= bb[3]; y++) for (let x = bb[0], i = y * W + bb[0]; x <= bb[2]; x++, i++) fn(i, x, y); };
  // background = pixels no part claims and that match the corner colour (or are transparent) — seams may grow, background may not
  const claimed = new Uint8Array(W * H); for (const f of flat) { const m = f.mask; eachIn(f.bb, (i) => { if (m[i]) claimed[i] = 1; }); }
  const bg = (() => { const c = im.at(0, 0); const m = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [r, g, b, a] = im.at(x, y);
      m[y * W + x] = a < 128 || (!claimed[y * W + x] && Math.hypot(r - c[0], g - c[1], b - c[2]) < 40) ? 1 : 0; } return m; })();
  // blend pixels nobody claims (anti-aliased rings round a button, crumbs) go to the BACK-most touching part, up to 2 original px —
  // otherwise they show as white seams (the score cannot see them: they are in neither image's part masks). Back, not nearest: the
  // part behind slides under its neighbour, so small front parts (a brow, a button) keep their size and the seam still closes.
  { const owner = new Int16Array(W * H).fill(-1);
    flat.forEach((f, k) => { f.own = Uint8Array.from(f.mask); f.ownBB = f.bb.slice(); const m = f.mask; eachIn(f.bb, (i) => { if (m[i] && owner[i] < 0) owner[i] = k; }); });
    for (let d = 0; d < 2 * Math.max(1, Math.round(srcPx)); d++) { const take = [];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (owner[i] >= 0 || bg[i]) continue; let k = Infinity;
        for (const j of [x + 1 < W ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < H ? i + W : -1, y > 0 ? i - W : -1]) if (j >= 0 && owner[j] >= 0 && owner[j] < k) k = owner[j];
        if (k < Infinity) take.push(i, k); }
      if (!take.length) break;
      for (let t = 0; t < take.length; t += 2) { const i = take[t], k = take[t + 1], x = i % W, y = (i / W) | 0, b = flat[k].bb; owner[i] = k; flat[k].mask[i] = 1; claimed[i] = 1;
        if (b[2] < b[0]) { b[0] = b[2] = x; b[1] = b[3] = y; } else { if (x < b[0]) b[0] = x; if (x > b[2]) b[2] = x; if (y < b[1]) b[1] = y; if (y > b[3]) b[3] = y; } } } }
  // the TOP part at each pixel (front-most mask covering it): "everything drawn in front of part k" = top > k. Built once — the old
  // per-part union of every later mask grew with parts² × pixels and was most of a 3-minute build
  const top = new Int16Array(W * H).fill(-1);
  flat.forEach((f, k) => { const m = f.mask; eachIn(f.bb, (i) => { if (m[i]) top[i] = k; }); });
  const frontOf = (k) => { const fr = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) if (top[i] > k) fr[i] = 1; return fr; };
  // CONTAINMENT: a detail that sits inside another part (eye in a face, button on a coat, cuff on a sleeve, stripe on a sock) stays
  // inside it. Owner = the part BEHIND it that holds ≥ 75 % of the detail's border (auto), or the plan's "inside": "<part name>";
  // "inside": false turns it off (a detail meant to cross the edge). The detail's pixels and its clean shape are then kept within the
  // owner's full outline + 1 original px — a fitted ellipse or rect that pokes out is refused, a `draw` that pokes out is reported.
  // trace a mask: upsampled U× and lightly blurred — thin features survive, corners stay square
  const U = 3;
  const traceMask = (mm, bx0, by0, bx1, by1, passes = 4) => {
    const mx0 = bx0 - 1, my0 = by0 - 1, FW = (bx1 - mx0 + 2) * U, FH = (by1 - my0 + 2) * U, field = new Float32Array(FW * FH);
    for (let v = 0; v < FH; v++) for (let u = 0; u < FW; u++) { const x = mx0 + Math.floor(u / U), y = my0 + Math.floor(v / U);
      if (x >= 0 && y >= 0 && x < W && y < H && mm[y * W + x]) field[v * FW + u] = 1; }
    let soft = field; for (let q = 0; q < passes; q++) soft = blur(soft, FW, FH);  // ≈ ½ reference px of smoothing (a thin line: 1 pass, or it fades out)
    // reference pixel x covers [x, x + 1); upsampled pixel u's centre sits at off + (u + 0.5) / U
    return marching(soft, FW, FH).filter((l) => Math.abs(area(l)) >= Math.max(2, 2 * srcPx * srcPx) * U * U)
      .map((l) => l.map((p) => ({ x: (p.x + 0.5) / U + mx0, y: (p.y + 0.5) / U + my0 })));
  };
  // traced outline → long smooth curves (anchors.js fitOutline: reads the outline at the size of a few original pixels, so pixel
  // stairs never become anchors); `simplify` (original px) only loosens the fidelity bound for one visibly wobbly part
  const leanTrace = (raw, simp) => fitOutline(raw, { unit: srcPx, tol: (simp || 1) * srcPx }).d;
  // a `draw` string that is really a pasted trace (a long run of short straight pieces) gets the same treatment — typed coordinates
  // of a staircase are the teeth the designer sees
  // (stairs turn left, right, left… so the polyline signal misses them — count short straight pieces instead)
  const leanDraw = (d) => { let segs = 0, short = 0;
    for (const sp of parsePath(d)) sp.segs.forEach((g, k) => { segs++; const a = k ? sp.segs[k - 1].p : sp.start; if (g.t === 'L' && Math.hypot(g.p.x - a.x, g.p.y - a.y) < 2 * srcPx) short++; });
    if (segs < 12 || short < 0.3 * segs) return d;
    const r = fitOutline(d, { unit: srcPx }); if (r.after < r.before) warnings.push(`draw of ${r.before} anchors looked traced (stairs) → refit to ${r.after} smooth anchors (max ${r.maxDev} px) — write a few corners and curves, never a trace`); return r.d; };
  const warnings = [];
  const ownIdx = new Int16Array(W * H).fill(-1);
  flat.forEach((f, k) => { const ow = f.own; eachIn(f.ownBB, (i) => { if (ow[i]) ownIdx[i] = k; }); });
  const ownerOf = flat.map((f, k) => {
    if (f.p.inside === false || !f.n) return -1;
    if (typeof f.p.inside === 'string') { const j = flat.findIndex((q) => q.p.name === f.p.inside);
      if (j < 0 || j >= k) { warnings.push(`${f.p.name}: inside "${f.p.inside}" — no such part behind it (owners come earlier in the plan)`); return -1; } return j; }
    const cnt = new Map(); let tot = 0;
    eachIn(f.ownBB, (i, x, y) => { if (!f.own[i]) return;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { const j = nx < 0 || ny < 0 || nx >= W || ny >= H ? -1 : ny * W + nx;
        if (j >= 0 && f.own[j]) continue; tot++; const o = j < 0 ? -1 : ownIdx[j]; cnt.set(o, (cnt.get(o) || 0) + 1); } });
    let best = -1, bestN = 0; for (const [o, c] of cnt) if (o >= 0 && c > bestN) { best = o; bestN = c; }
    return best >= 0 && best < k && bestN >= 0.75 * tot && flat[best].n > f.n ? best : -1;
  });
  // background = the reference's corner colour: the preview is drawn on it, so score.cjs compares like with like (a black-backed
  // reference against a white preview made the whole silhouette fail and cost a test run six minutes)
  const bgc = im.at(0, 0);
  const scene = { frame: { name: (plan.frame && plan.frame.name) || 'Vector', width: Math.round(W * S), height: Math.round(H * S) }, background: bgc[3] < 128 ? '#ffffff' : toHex(bgc[0], bgc[1], bgc[2]), groups: [] };
  for (let k = 0; k < flat.length; k++) {
    const f = flat[k];
    const emit = !o.groups || o.groups.includes(f.g.name);  // every part's outline is computed (an owner may sit in another group)
    let gOut = null;
    if (emit) { gOut = scene.groups.find((x) => x.name === f.g.name); if (!gOut) scene.groups.push(gOut = { name: f.g.name, parts: [] }); }
    if (!f.n) { if (emit) warnings.push(`${f.g.name} / ${f.p.name}: no pixel matched — resample the colour or widen the box`); continue; }
    let m = f.mask, bb = f.bb.slice();
    const front = frontOf(k);   // everything drawn in front of this part
    // fill what the parts in FRONT hide, inside this part's hull — for masses; a small detail (a piece of an eye under its lashes) would
    // only swell to its hull (a test run lost minutes on puffed-up eye pieces); "complete": true forces it. Rough draft: skipped.
    if (!o.rough && (f.p.complete === true || (f.p.complete !== false && f.n >= 400 * srcPx * srcPx))) {
      const h = hull(m, W, H, bb); m = Uint8Array.from(m); let added = 0;
      // only what a part in front hides — filling unclaimed blend pixels across the hull made a V collar bleed into the neck
      if (h.length >= 3) eachIn(bb, (i, x, y) => { if (!m[i] && front[i] && inHull(h, x + 0.5, y + 0.5)) { m[i] = 1; added++; } });
      if (added) f.completed = added;
    }
    // close seams: grow one original pixel into unclaimed non-background pixels (anti-aliased borders) and under the parts in front
    { const grow = Math.max(1, Math.round(srcPx));
      for (let it = 0; it < grow; it++) { const nm = Uint8Array.from(m); bb = grownBB(bb, 1);
        eachIn(bb, (i, x, y) => { if (m[i] || bg[i] || (claimed[i] && !front[i])) return;
          if ((x > 0 && m[i - 1]) || (x < W - 1 && m[i + 1]) || (y > 0 && m[i - W]) || (y < H - 1 && m[i + W])) nm[i] = 1; });
        m = nm; } }
    // containment: keep the detail within its owner's full outline (+1 original px) and its own pixels
    let allowed = null;
    if (!o.rough && ownerOf[k] >= 0 && flat[ownerOf[k]].final) {
      const ow = flat[ownerOf[k]]; let abb = ow.finalBB;
      allowed = Uint8Array.from(ow.final);
      for (let it = 0; it < Math.max(1, Math.round(srcPx)); it++) { const nm = Uint8Array.from(allowed); abb = grownBB(abb, 1);
        eachIn(abb, (i, x, y) => { if (allowed[i]) return;
          if ((x > 0 && allowed[i - 1]) || (x < W - 1 && allowed[i + 1]) || (y > 0 && allowed[i - W]) || (y < H - 1 && allowed[i + W])) nm[i] = 1; });
        allowed = nm; }
      eachIn(f.ownBB, (i) => { if (f.own[i]) allowed[i] = 1; });
      eachIn(bb, (i) => { if (!allowed[i]) m[i] = 0; });
      f.insideOf = ow.p.name;
    }
    f.final = m; f.finalBB = bb;
    if (!emit) continue;
    // Each connected piece of the part: trace it (upsampled U× and lightly blurred — thin features survive, corners stay square),
    // then the CLEAN step (fit-shapes.cjs): every clean shape that matches it is kept as a candidate; which one is used is decided
    // after all parts are measured (the style's shape family, matched sets). A piece nothing fits keeps its traced outline.
    // `draw` in the plan overrides it all. Rough draft: the trace becomes a plain polygon (no fit, no smoothing) — seconds, not minutes.
    const pieces = [];
    if (f.p.draw) pieces.push({ kind: 'drawn', d: leanDraw(drawnPath(f.p.draw)) });
    else for (const c of components(m, W, H, bb)) {
      if (c.n < Math.max(2, 2 * srcPx * srcPx)) continue;
      const cm = new Uint8Array(W * H); for (const i of c.idx) cm[i] = 1;
      const loops = traceMask(cm, c.x0, c.y0, c.x1, c.y1, f.p.line || f.p.pattern ? 1 : 4);
      if (!loops.length) continue;
      const big = loops.reduce((a, b) => (Math.abs(area(b)) > Math.abs(area(a)) ? b : a));
      if (o.rough) { pieces.push({ kind: 'traced', d: loops.map((l) => 'M ' + dpClosed(l, 0.75 * srcPx).map((p) => p.map((v) => Math.round(v * 100) / 100).join(' ')).join(' L ') + ' Z').join(' '),
        multi: loops.length > 1, hint: '' }); continue; }
      const fit = o.clean === false || f.p.clean === false ? null : fitComponent(m, W, H, c, { srcPx, loop: big, allowed, hidden: front });
      if (fit) { pieces.push({ kind: 'fit', fit, comp: c }); continue; }
      const raw = loops.map((l) => 'M ' + l.map((p) => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' L ') + ' Z').join(' ');
      // a starting point for the agent's `draw`: the outline's corners, few points, crop px — tidy it, curve what is round
      pieces.push({ kind: 'traced', d: leanTrace(raw, f.p.simplify), multi: loops.length > 1,
        hint: 'M ' + dpClosed(big, 1.5 * srcPx).map((p) => p.map((v) => Math.round(v * 2) / 2).join(' ')).join(' L ') + ' Z' });
    }
    if (!pieces.length) { warnings.push(`${f.g.name} / ${f.p.name}: too small to trace`); continue; }
    if (f.p.draw && allowed) { // a hand-drawn detail is checked against its owner too — reported, never silently clipped
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path fill="#000" d="${pieces[0].d}"/></svg>`;
      const { data } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let out = 0; for (let i = 0; i < W * H; i++) if (data[i * 4 + 3] > 127 && !allowed[i]) out++;
      if (out > srcPx * srcPx) warnings.push(`${f.g.name} / ${f.p.name}: draw pokes ${out} px out of ${f.insideOf} — pull it inside, or set "inside": false if it really crosses the edge`); }
    // fill = the most frequent colour of the part's own pixels (the flat colour of the reference, not an average with its edges)
    const counts = new Map(); let best = null, bestN = 0;
    eachIn(f.ownBB, (i, x, y) => { if (!f.own[i]) return; const [rr, gg, bv] = im.at(x, y);
      const key = (rr >> 2) << 12 | (gg >> 2) << 6 | (bv >> 2); const e = counts.get(key) || [0, 0, 0, 0];
      e[0]++; e[1] += rr; e[2] += gg; e[3] += bv; counts.set(key, e); if (e[0] > bestN) { bestN = e[0]; best = e; } });
    f.fill = best ? toHex(best[1] / best[0], best[2] / best[0], best[3] / best[0]) : (f.p.colors || [f.p.color])[0];
    // "gradient": true — the part is one tone changing across it (skin, hair, a sky): measure the direction and the stops on its own
    // pixels; the reference artist fills one shape with one gradient instead of cutting it into flat bands
    if (f.p.gradient) { const gr = measureGradient(f.own || f.mask, W, (x, y) => im.at(x, y));
      if (gr) f.paintCrop = gr; else warnings.push(`${f.g.name} / ${f.p.name}: "gradient" — no clear direction of change in its pixels, kept flat`); }
    f.work = { pieces, gOut, k, allowed };   // front is rebuilt when needed (frontOf), not kept: one full-size mask per part ran to gigabytes
  }

  // "overlay": a shade or tint laid OVER a base part (the reference artist's way: one dark colour at low opacity for every shadow on a
  // figure, multiply for blush). fill = the tint ("overlay": "#hex", else plan.shadowTint, else the darkest palette colour),
  // opacity = what turns the base into the colour seen; base = the part it sits inside ("over": "<name>" to set it).
  { const pal = (plan.palette || []).map(hex), dark = pal.length ? toHex(...pal.reduce((a, b) => (a[0] + a[1] + a[2] <= b[0] + b[1] + b[2] ? a : b))) : '#000000';
    flat.forEach((f, k) => { if (!f.p.overlay || !f.work) return;
      const baseIdx = typeof f.p.over === 'string' ? flat.findIndex((q) => q.p.name === f.p.over) : ownerOf[k];
      const base = baseIdx >= 0 ? flat[baseIdx] : null;
      if (!base || !base.fill) { warnings.push(`${f.g.name} / ${f.p.name}: overlay needs the part under it — set "over": "<part name>"`); return; }
      const T = hex(typeof f.p.overlay === 'string' ? f.p.overlay : plan.shadowTint || dark), B = hex(base.fill), C = hex(f.fill);
      let num = 0, den = 0; for (let q = 0; q < 3; q++) { num += (C[q] - B[q]) * (T[q] - B[q]); den += (T[q] - B[q]) ** 2; }
      const a = Math.max(0.03, Math.min(1, den ? num / den : 1)), seen = B.map((b, q) => b + (T[q] - b) * a);
      const miss = Math.hypot(seen[0] - C[0], seen[1] - C[1], seen[2] - C[2]);
      if (miss > 18) warnings.push(`${f.g.name} / ${f.p.name}: overlay of ${toHex(...T)} over ${base.p.name} misses the colour seen by ${Math.round(miss)} — try another tint ("overlay": "#hex") or keep it flat`);
      f.overlayOf = { fill: toHex(...T), opacity: Math.round(a * 100) / 100, over: base.p.name }; }); }

  // SHAPE FAMILY — a style is built from a few kinds of shape (one style is pills everywhere, another circles and rounded rects). The
  // pieces where one kind clearly wins teach the family; pieces where two kinds are close (a small detail: ellipse or pill?) follow
  // it, so the same kind of feature is drawn the same way across the figure. plan.family sets it by hand ([] = off).
  const done = flat.filter((f) => f.work);
  const fits = done.flatMap((f) => f.work.pieces.filter((p) => p.kind === 'fit'));
  // Pill or ellipse is the close call that breaks consistency (an ear fits both within 1 %), so only that call is voted: each piece
  // seen whole (nothing in front touching it) votes, weighted by its size, for whichever of the two fits it better.
  let family = Array.isArray(plan.family) ? plan.family : null, why = 'from the plan';
  if (!family) { const v = { pill: 0, ellipse: 0 };
    for (const p of fits) { if (p.fit.occluded) continue; const pl = p.fit.ok.find((c) => c.type === 'pill'), el = p.fit.ok.find((c) => c.type === 'ellipse');
      if (pl && el && Math.abs(pl.full - el.full) >= 0.005) v[pl.full > el.full ? 'pill' : 'ellipse'] += p.comp.n; }
    family = v.pill + v.ellipse ? [v.pill >= v.ellipse ? 'pill' : 'ellipse'] : [];
    why = `votes by size of the pieces seen whole: pill ${v.pill} px, ellipse ${v.ellipse} px`; }
  for (const p of fits) p.chosen = pick(p.fit.ok, family.length ? family : null);

  // MATCHED SETS — features that are the same thing (two eyes, two ears, two pupils, a row of buttons) are drawn as ONE shape: same
  // kind, same width, same angle; only length and position differ. The clearest member (most visible pixels) is the model; a member
  // half hidden (an eye under its lid) continues under the part in front. Auto: same colour, similar width and size, not touching,
  // detail-sized; a member whose own shape is clearly long must point the same way. plan.same: [["Eye L", "Eye R"], …] by hand,
  // false = off.
  const hexd = (a, b) => { const x = hex(a), y = hex(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const single = done.filter((f) => f.work.pieces.length === 1 && f.work.pieces[0].kind === 'fit');
  const info = new Map(single.map((f) => { const c = f.work.pieces[0].comp; let sx = 0, sy = 0, xx = 0, yy = 0, xy = 0;
    for (const i of c.idx) { sx += i % W; sy += (i / W) | 0; } const mx = sx / c.n, my = sy / c.n;
    for (const i of c.idx) { const dx = i % W - mx, dy = ((i / W) | 0) - my; xx += dx * dx; yy += dy * dy; xy += dx * dy; }
    xx /= c.n; yy /= c.n; xy /= c.n; const tr = xx + yy, disc = Math.sqrt(Math.max(0, tr * tr / 4 - (xx * yy - xy * xy)));
    return [f, { n: c.n, box: [c.x0, c.y0, c.x1, c.y1], long: Math.sqrt((tr / 2 + disc) / Math.max(1e-6, tr / 2 - disc)), th: 0.5 * Math.atan2(2 * xy, xx - yy),
      width: 4 * Math.sqrt(Math.max(0.01, tr / 2 - disc)) }]; }));
  const sets = [];
  const compatible = (A, B) => { const a = info.get(A), b = info.get(B);
    if (!a || !b) return false;
    const angle = (x, y) => { const d = Math.abs(x - y) % Math.PI; return Math.min(d, Math.PI - d); };
    // detail-sized, but big enough to tell a pill from an ellipse (≥ 10 × 10 original px; a sprite's 20-pixel buttons are not)
    const small = (q) => q.box[2] - q.box[0] < 0.25 * W && q.box[3] - q.box[1] < 0.25 * H && q.n >= 100 * srcPx * srcPx;
    const apart = a.box[2] + 1 < b.box[0] || b.box[2] + 1 < a.box[0] || a.box[3] + 1 < b.box[1] || b.box[3] + 1 < a.box[1];
    if (!small(a) || !small(b) || !apart || hexd(A.fill, B.fill) > 30) return false;
    if (Math.max(a.n, b.n) / Math.min(a.n, b.n) > 4 || Math.max(a.width, b.width) / Math.min(a.width, b.width) > 1.5) return false;
    // a pair sits side by side (eyes, ears, brows) or in a column (buttons): a hair lock of the brow's colour elsewhere is not its twin
    const cy = (q) => (q.box[1] + q.box[3]) / 2, cx = (q) => (q.box[0] + q.box[2]) / 2, hh = Math.max(a.box[3] - a.box[1], b.box[3] - b.box[1]) + 1, ww = Math.max(a.box[2] - a.box[0], b.box[2] - b.box[0]) + 1;
    if (Math.abs(cy(a) - cy(b)) > 0.6 * hh && Math.abs(cx(a) - cx(b)) > 0.6 * ww) return false;
    return !(a.long >= 1.25 && b.long >= 1.25 && angle(a.th, b.th) > 0.35); };
  if (Array.isArray(plan.same)) for (const names of plan.same) { const s = names.map((nm) => done.find((f) => f.p.name === nm)).filter(Boolean);
    if (s.length >= 2) sets.push(s); else warnings.push(`same: ${names.join(', ')} — fewer than two parts found`); }
  else if (plan.same !== false) {
    // every pair inside a set must match (a pupil must not pull the nose in through the other pupil)
    const groups = [];
    for (const f of single) { const g = groups.find((s) => s.every((x) => compatible(x, f))); if (g) g.push(f); else groups.push([f]); }
    for (const s of groups) if (s.length >= 2) sets.push(s);
  }
  const setLines = [], covers = [];
  for (const s of sets) {
    const model = s.filter((f) => f.work.pieces.length === 1 && f.work.pieces[0].kind === 'fit')
      .sort((a, b) => b.work.pieces[0].comp.n - a.work.pieces[0].comp.n)[0];
    if (!model) { warnings.push(`same: ${s.map((f) => f.p.name).join(', ')} — no clean model shape`); continue; }
    const mp = model.work.pieces[0];
    // the model takes the family's pill / ellipse when that fits it (a set is only as consistent as its model)
    if (!['pill', 'ellipse'].includes(mp.chosen.type)) { const alt = mp.fit.ok.filter((c) => ['pill', 'ellipse'].includes(c.type)); if (alt.length) mp.chosen = pick(alt, family); }
    if (!['pill', 'ellipse'].includes(mp.chosen.type)) continue;   // sets are drawn alike through a pill / ellipse model only
    const line = [`${model.p.name} (model, ${mp.chosen.type})`];
    for (const f of s) { if (f === model) continue; const p = f.work.pieces[0];
      if (!p || p.kind !== 'fit') { line.push(`${f.p.name} ✗ not a clean piece`); continue; }
      // big parts behind the member may be painted over it (an eyelid in the head's colour)
      const k = flat.indexOf(f), cover = new Uint8Array(W * H); let anyCover = false;
      for (let j = 0; j < k; j++) if (flat[j].n >= 8 * p.comp.n) { const ow = flat[j].own; for (let i = 0; i < W * H; i++) if (ow[i]) { cover[i] = 1; anyCover = true; } }
      const r = fitAs(f.final, W, H, p.comp, mp.chosen, { srcPx, hidden: frontOf(f.work.k), allowed: f.work.allowed, ...(anyCover ? { cover } : {}) });
      if (!(r && r.iou >= 0.9 && r.full >= 0.75 && r.spill <= srcPx * srcPx)) {
        line.push(`${f.p.name} ✗ (${r ? `IoU± ${r.iou}` : 'model is not a pill / ellipse'})`);
        warnings.push(`same: ${f.p.name} does not match ${model.p.name} — check it is the same feature, or draw it`); continue; }
      p.chosen = r;
      // where the grown shape lies under a cover colour, the reference paints a cover over it → a cover part in that colour
      const cm = new Uint8Array(W * H), by = new Map(); let cn = 0;
      if (anyCover && r.grown > 0) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x;
        if (cover[i] && !f.final[i] && r.inside(x + 0.5, y + 0.5)) { cm[i] = 1; cn++; by.set(ownIdx[i], (by.get(ownIdx[i]) || 0) + 1); } }
      if (cn >= 4 * srcPx * srcPx) {
        // grow the cover a little into its own colour so its edge never lands exactly on the member's edge (a hairline of white)
        for (let it = 0; it < Math.max(1, Math.round(srcPx)) + 1; it++) { const add = [];
          for (let i = 0; i < W * H; i++) { if (cm[i] || !cover[i] || f.final[i]) continue; const x = i % W;
            if ((x > 0 && cm[i - 1]) || (x < W - 1 && cm[i + 1]) || cm[i - W] || cm[i + W]) add.push(i); }
          for (const i of add) cm[i] = 1; }
        const holder = flat[[...by].sort((a, b) => b[1] - a[1])[0][0]];
        // the cover goes in front of the member and of the details inside it (a pupil under the same lid)
        let anchor = k;
        for (let j = k + 1; j < flat.length; j++) { let inn = 0, tot = 0; const ow = flat[j].own;
          for (let i = 0; i < W * H; i++) if (ow[i]) { tot++; if (r.inside(i % W + 0.5, ((i / W) | 0) + 0.5)) inn++; }
          if (tot && inn >= 0.5 * tot) anchor = Math.max(anchor, j); }
        covers.push({ mask: cm, fill: holder.fill, anchor, names: [f.p.name] });
        line.push(`${f.p.name} (+${r.grown} px under a ${holder.p.name} cover)`);
      } else line.push(r.grown >= 1 ? `${f.p.name} (+${r.grown} px under the part in front)` : f.p.name); }
    setLines.push(line.join(' = '));
  }
  // covers of one colour that touch are one piece (the lid over an eye and over its pupil)
  for (let i = 0; i < covers.length; i++) for (let j = covers.length - 1; j > i; j--) {
    const A = covers[i], B = covers[j]; if (A.fill !== B.fill) continue;
    let touch = false; for (let q = 0; q < W * H && !touch; q++) if (B.mask[q]) { const x = q % W;
      if (A.mask[q] || (x > 0 && A.mask[q - 1]) || (x < W - 1 && A.mask[q + 1]) || A.mask[q - W] || A.mask[q + W]) touch = true; }
    if (!touch) continue;
    for (let q = 0; q < W * H; q++) if (B.mask[q]) A.mask[q] = 1;
    A.anchor = Math.max(A.anchor, B.anchor); A.names.push(...B.names); covers.splice(j, 1); }
  const coversAfter = new Map();
  for (const cv of covers) {
    const cs = components(cv.mask, W, H); if (!cs.length) continue;
    let x0 = W, y0 = H, x1 = 0, y1 = 0; for (const c of cs) { x0 = Math.min(x0, c.x0); y0 = Math.min(y0, c.y0); x1 = Math.max(x1, c.x1); y1 = Math.max(y1, c.y1); }
    const loops = traceMask(cv.mask, x0, y0, x1, y1); if (!loops.length) continue;
    const raw = loops.map((l) => 'M ' + l.map((p) => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' L ') + ' Z').join(' ');
    const at = flat[cv.anchor]; if (!coversAfter.has(at)) coversAfter.set(at, []);
    coversAfter.get(at).push({ name: `${cv.names.join(' + ')} cover`, fill: cv.fill, d: leanTrace(raw), multi: loops.length > 1 });
  }

  const emitPart = (gOut, name, fill, ds, shapes, hints, multiLoop, extra) => {
    // scale to frame px, then shift to the part's own top-left
    const scaled = ds.join(' ').replace(/-?\d+(?:\.\d+)?/g, (v) => String(+v * S));
    // the part's position = the top-left of the CURVE, not of its handles: Figma lays a vector out by its true bounds, so the handle
    // overhang used to shift every curved part up / left (13.8 px seen in a test)
    const { x0, y0, x1, y1 } = pathBounds(scaled);
    if (extra && extra.paintCrop) { const pc = extra.paintCrop, fx = (v) => Math.round(((v * S - x0) / Math.max(1e-6, x1 - x0)) * 1000) / 1000,
      fy = (v) => Math.round(((v * S - y0) / Math.max(1e-6, y1 - y0)) * 1000) / 1000;
      extra = { ...extra, paint: { type: 'linear', from: [fx(pc.from[0]), fy(pc.from[1])], to: [fx(pc.to[0]), fy(pc.to[1])], stops: pc.stops } }; delete extra.paintCrop; }
    let idx = 0; const d = scaled.replace(/-?\d+(?:\.\d+)?/g, (v) => { const out = idx % 2 === 0 ? +v - x0 : +v - y0; idx++; return String(Math.round(out * 1000) / 1000); });
    const shapeSummary = [...new Set(shapes)].map((s) => `${s}${shapes.filter((x) => x === s).length > 1 ? '×' + shapes.filter((x) => x === s).length : ''}`).join('+');
    gOut.parts.push({ name, fill, x: Math.round(x0 * 100) / 100, y: Math.round(y0 * 100) / 100, d,
      windingRule: multiLoop ? 'EVENODD' : 'NONZERO', anchors: countAnchors(d), shape: shapeSummary,
      ...(hints.length ? { drawHint: hints.join(' ') } : {}), ...extra });
  };
  for (const f of done) {
    const { pieces, gOut } = f.work, shapes = [], hints = [];
    const ds = pieces.map((p) => { if (p.kind === 'fit') { shapes.push(p.chosen.type); return p.chosen.d; }
      if (p.kind === 'traced') { shapes.push('traced'); hints.push(p.hint); return p.d; } shapes.push('drawn'); return p.d; });
    emitPart(gOut, f.p.name, f.overlayOf ? f.overlayOf.fill : f.fill, ds, shapes, hints, pieces.some((p) => p.multi),
      { ...(f.completed ? { completedPx: f.completed } : {}), ...(f.insideOf ? { inside: f.insideOf } : {}),
        ...(f.paintCrop ? { paintCrop: f.paintCrop } : {}),
        ...(f.overlayOf ? { opacity: f.overlayOf.opacity, over: f.overlayOf.over } : f.p.opacity !== undefined ? { opacity: f.p.opacity } : {}),
        ...(f.p.blend ? { blend: f.p.blend } : {}) });
    for (const cv of coversAfter.get(f) || []) emitPart(gOut, cv.name, cv.fill, [cv.d], ['cover'], [], cv.multi, { cover: true });
  }
  if (family.length) console.log(`shape family: ${family.join(', ')} (${why}) — close calls and matched sets follow it; the build sheet decides — set "family" in the plan when it says otherwise`);
  for (const l of setLines) console.log(`matched set: ${l}`);
  const shaded = flat.filter((f) => f.overlayOf || f.paintCrop);
  if (shaded.length) console.log(`shading: ${shaded.map((f) => f.overlayOf ? `${f.p.name} = ${f.overlayOf.fill} at ${f.overlayOf.opacity} over ${f.overlayOf.over}` : `${f.p.name} gradient ${f.paintCrop.stops.map((x) => x.color).join(' → ')}`).join(' · ')}`);
  fs.writeFileSync(o.out, JSON.stringify(scene));
  if (o.render) await renderScene(scene, o.render);
  // --dark: the same scene on Figma's dark canvas — a dropped fill (a face punched out) and seams between parts show there; on the
  // reference's own white they are invisible to the eye and to score.cjs
  if (o.render && o.dark) await renderScene({ ...scene, background: '#2c2c2c' }, o.render.replace(/(\.png)?$/i, '-dark.png'));
  if (!o.rough) for (const g of scene.groups) console.log(`${g.name}: ` + g.parts.map((p) => `${p.name} ${p.shape} ${p.anchors}`).join(' · '));
  const all = scene.groups.flatMap((g) => g.parts), tr = all.filter((p) => /traced/.test(p.shape));
  if (o.rough) console.log(`rough draft: ${all.length} parts as plain polygons (no clean shapes, no smoothing, nothing filled in under the parts in front) — build it now so the whole picture shows; the full build (--plan draft.json, no --rough) comes next`);
  else console.log(`clean step: ${all.length - tr.length}/${all.length} parts are clean shapes · still traced: ${tr.map((p) => p.name).join(', ') || 'none'}`);
  const kept = all.filter((p) => p.inside);
  if (kept.length) console.log(`kept inside their owner: ${kept.map((p) => `${p.name} ⊂ ${p.inside}`).join(' · ')}`);
  // big traced parts are the ones worth the agent's hand (`draw`); tiny ones rarely show
  const big = o.rough ? [] : tr.filter((p) => p.anchors >= 10);
  if (big.length) { console.log('draw hints (crop px, corners only — copy into the plan as "draw", round off what is round):');
    for (const p of big) console.log(`  ${p.name}: ${p.drawHint}`); }
  for (const w of warnings) console.log('⚠ ' + w);
  console.log(`scene → ${o.out} · frame ${scene.frame.width}×${scene.frame.height} · build it: build_vectors { path: "${o.out.replace(/\\/g, '/')}" }`);
}

// scene → PNG at frame size, white background (preview, and the drawing score.cjs reads when Figma is not open)
async function renderScene(scene, file) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.frame.width}" height="${scene.frame.height}"><rect width="100%" height="100%" fill="${scene.background || '#ffffff'}"/>`, gi = 0;
  for (const g of scene.groups) for (const p of g.parts) {
    let fill = p.fill;
    if (p.paint) { const id = `g${gi++}`; fill = `url(#${id})`;
      svg += `<defs><linearGradient id="${id}" gradientUnits="objectBoundingBox" x1="${p.paint.from[0]}" y1="${p.paint.from[1]}" x2="${p.paint.to[0]}" y2="${p.paint.to[1]}">`
        + p.paint.stops.map((st) => `<stop offset="${st.pos}" stop-color="${st.color}" stop-opacity="${st.alpha ?? 1}"/>`).join('') + '</linearGradient></defs>'; }
    // blend modes are previewed as plain opacity (the renderer has no multiply); Figma draws the real mode
    svg += `<path transform="translate(${p.x},${p.y})" fill-rule="${p.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}" fill="${fill}"${p.opacity !== undefined ? ` opacity="${p.opacity}"` : ''} d="${p.d}"/>`; }
  await sharp(Buffer.from(svg + '</svg>')).png().toFile(file);
  console.log(`render → ${file}`);
}

// --auto-plan: flat-colour regions → draft parts with seeds; labels image to name them in one look
async function autoPlan(o) {
  const im = await loadCrop(o.img, o.crop);
  const { W, H } = im, srcPx = o.srcPx || 1;
  // palette (same merge as --palette), background = the corner colour
  const bins = new Map();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [r, g, b, a] = im.at(x, y); if (a < 128) continue;
    const k = (r >> 3) << 10 | (g >> 3) << 5 | (b >> 3); const e = bins.get(k) || { n: 0, r: 0, g: 0, b: 0 }; e.n++; e.r += r; e.g += g; e.b += b; bins.set(k, e); }
  const pal = [];
  for (const e of [...bins.values()].sort((p, q) => q.n - p.n)) { const c = [e.r / e.n, e.g / e.n, e.b / e.n];
    const m = pal.find((x) => Math.hypot(x.c[0] - c[0], x.c[1] - c[1], x.c[2] - c[2]) < 24); if (m) m.n += e.n; else pal.push({ c, n: e.n }); }
  // small but real colours (black eyes ≈ 80 px of a 147×307 sprite) must make the palette, or their regions vanish
  // the floor is capped in ORIGINAL pixels: on a big full-figure image 0.04 % is ~700 px, and the iris of an eye is less than that
  const total = W * H, colours = pal.filter((p) => p.n >= Math.max(12 * srcPx * srcPx, Math.min(total * 0.0004, 100 * srcPx * srcPx))).slice(0, 64);
  const corner = im.at(0, 0);
  // background = the corner colour CONNECTED to the image border (white teeth inside the figure are not background)
  const bg = new Uint8Array(W * H), isBg = (x, y) => { const [r, g, b, a] = im.at(x, y); return a < 128 || Math.hypot(r - corner[0], g - corner[1], b - corner[2]) < 30; };
  { const st = []; for (let x = 0; x < W; x++) st.push(x, 0, x, H - 1); for (let y = 0; y < H; y++) st.push(0, y, W - 1, y);
    while (st.length) { const y = st.pop(), x = st.pop(); if (x < 0 || y < 0 || x >= W || y >= H || bg[y * W + x] || !isBg(x, y)) continue;
      bg[y * W + x] = 1; st.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1); } }
  // label every pixel with its nearest kept colour (within 40) — the same rule vectorize/score apply through plan.palette
  const lab = new Int16Array(W * H).fill(-1), dist = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (bg[y * W + x]) continue; const [r, g, b] = im.at(x, y);
    let bi = -1, bd = 40; colours.forEach((p, i) => { const d = Math.hypot(r - p.c[0], g - p.c[1], b - p.c[2]); if (d < bd) { bd = d; bi = i; } });
    lab[y * W + x] = bi; dist[y * W + x] = bd; }
  // connected regions per colour
  let fg = 0; for (let i = 0; i < W * H; i++) if (lab[i] >= 0) fg++;
  // crumbs (anti-aliased borders, specks) are dropped: under 0.1 % of the figure or a few original pixels
  const seen = new Uint8Array(W * H), regions = [], small = [], minPx = Math.max(20 * srcPx * srcPx, Math.round(fg * 0.001));
  for (let i0 = 0; i0 < W * H; i0++) { if (seen[i0] || lab[i0] < 0) continue;
    const ci = lab[i0], stack = [i0]; seen[i0] = 1; let n = 0, x0 = W, y0 = H, x1 = 0, y1 = 0, seed = i0, seedScore = Infinity;
    while (stack.length) { const i = stack.pop(), x = i % W, y = (i / W) | 0; n++;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      const nb = [x + 1 < W ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < H ? i + W : -1, y > 0 ? i - W : -1];
      // seed = an interior pixel closest to the region's colour (an edge pixel is anti-aliased and may not match)
      const interior = nb.every((j) => j >= 0 && lab[j] === ci), sc = dist[i] + (interior ? 0 : 1000);
      if (sc < seedScore) { seedScore = sc; seed = i; }
      for (const j of nb) if (j >= 0 && !seen[j] && lab[j] === ci) { seen[j] = 1; stack.push(j); } }
    const reg = { ci, n, box: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], seed, i0 };
    if (n >= minPx) regions.push(reg); else if (n >= 3 * srcPx * srcPx) small.push(reg);
  }
  // THIN LINES and DOT PATTERNS the 0.1 % floor would drop (a seam down the shorts, an eyelid crease, halftone dots behind a bubble):
  // a small region is kept when it is a line — long and thin, in its own colour, not the blend between its two neighbours (an
  // anti-aliased ring is exactly that blend) — and small dots of one colour, many of them, become one "pattern" part.
  const pc = colours.map((p) => p.c);
  const between = (c, a, b) => { const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2; if (L2 < 1) return false;
    const t = ((c[0] - a[0]) * ab[0] + (c[1] - a[1]) * ab[1] + (c[2] - a[2]) * ab[2]) / L2; if (t < 0.15 || t > 0.85) return false;
    return Math.hypot(a[0] + ab[0] * t - c[0], a[1] + ab[1] * t - c[1], a[2] + ab[2] * t - c[2]) < 14; };
  const neighbourLabels = (r) => { const set = new Set(), st = [r.i0], vis = new Set([r.i0]);
    while (st.length) { const i = st.pop(), x = i % W, y = (i / W) | 0;
      for (const j of [x + 1 < W ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < H ? i + W : -1, y > 0 ? i - W : -1]) { if (j < 0) continue;
        if (lab[j] === r.ci) { if (!vis.has(j)) { vis.add(j); st.push(j); } } else set.add(bg[j] ? 'bg' : lab[j]); } }
    return [...set]; };
  const dots = new Map();
  const cdist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  for (const r of small) {
    const long = Math.max(r.box[2], r.box[3]), short = Math.min(r.box[2], r.box[3]), thick = r.n / long;
    const raw = neighbourLabels(r), nb = raw.filter((l) => l !== 'bg' && l >= 0).map((l) => pc[l]);
    const ring = nb.some((a) => nb.some((b) => a !== b && between(pc[r.ci], a, b)));
    // a FEATURE (an eye white, an iris, a nostril, a mouth): compact, ≥ 2.5 original px thick, not the blend of its neighbours. The
    // 0.1 % floor dropped every face detail of a full-body figure (a test run then spent its whole budget redrawing the eyes by hand)
    // (a brow drawn in two dark tones with a soft rim: its pieces sit next to each other and between rim tones — what tells it from a
    // crumb is that it is thick and sits on something clearly different, like skin)
    if (thick >= 2.5 * srcPx && r.n >= 20 * srcPx * srcPx && (r.n >= 60 * srcPx * srcPx || !ring) && nb.some((a) => cdist(pc[r.ci], a) >= 60)) { regions.push(r); continue; }
    const blend = ring || nb.some((a) => cdist(pc[r.ci], a) < 40);
    if (blend) continue;
    // a line is drawn ON a part (a seam, a crease): ≥ 1.2 original px thick on average, never against the background (that is the
    // anti-aliased rim of the figure)
    if (long >= 20 * srcPx && thick >= 1.2 * srcPx && thick <= 4 * srcPx && !raw.includes('bg')) regions.push({ ...r, line: true });
    // a dot of a pattern: roundish, ≥ 2 original px, alone in one colour (halftone dots on a backdrop, freckles on a cheek)
    else if (long <= 12 * srcPx && short >= 2 * srcPx && long <= 2.5 * short && r.n >= 4 * srcPx * srcPx && raw.length === 1) {
      if (!dots.has(r.ci)) dots.set(r.ci, []); dots.get(r.ci).push(r); }
  }
  const patterns = [];
  for (const [ci, list] of dots) if (list.length >= 12) {
    const x0 = Math.min(...list.map((r) => r.box[0])), y0 = Math.min(...list.map((r) => r.box[1]));
    const x1 = Math.max(...list.map((r) => r.box[0] + r.box[2])), y1 = Math.max(...list.map((r) => r.box[1] + r.box[3]));
    patterns.push({ ci, n: list.reduce((q, r) => q + r.n, 0), box: [x0, y0, x1 - x0, y1 - y0], seeds: list.slice(0, 400).map((r) => r.seed), pattern: list.length }); }
  regions.sort((a, b) => b.n - a.n); // biggest first = furthest back as a starting guess
  const all = regions.concat(patterns);
  const palette = colours.map((p) => toHex(...p.c));
  const parts = all.map((r, k) => ({ name: `p${String(k + 1).padStart(2, '0')}`, color: palette[r.ci], tol: 40,
    seeds: (r.seeds || [r.seed]).map((sd) => [sd % W, (sd / W) | 0]), box: [Math.max(0, r.box[0] - 1), Math.max(0, r.box[1] - 1), r.box[2] + 2, r.box[3] + 2], px: r.n,
    ...(r.line ? { line: true } : {}), ...(r.pattern ? { pattern: r.pattern } : {}) }));
  // which part touches which (border pixels) — for the ink and tone readings below
  const partOf = new Int16Array(W * H).fill(-1);
  all.forEach((r, k) => { const st = (r.seeds || [r.seed]).filter((i) => lab[i] === r.ci && partOf[i] < 0); for (const i of st) partOf[i] = k;
    while (st.length) { const i = st.pop(), x = i % W, y = (i / W) | 0;
      for (const j of [x + 1 < W ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < H ? i + W : -1, y > 0 ? i - W : -1]) if (j >= 0 && partOf[j] < 0 && lab[j] === r.ci) { partOf[j] = k; st.push(j); } } });
  const touch = parts.map(() => new Map()), border = new Float64Array(parts.length);
  for (let i = 0; i < W * H; i++) { const a = partOf[i]; if (a < 0) continue; const x = i % W;
    for (const j of [x + 1 < W ? i + 1 : -1, i + W < W * H ? i + W : -1]) { if (j < 0) continue; const b = partOf[j]; if (b === a || b < 0) continue;
      touch[a].set(b, (touch[a].get(b) || 0) + 1); touch[b].set(a, (touch[b].get(a) || 0) + 1); border[a]++; border[b]++; } }
  const lum = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  // INK STYLE: one dark part that most coloured parts are framed by (retro / sticker art). The artist draws it as one outline with
  // holes ON TOP of the colours, so the colours run under it and no seam can open; drawn at the back, every colour must fit the line
  // exactly and the slightest miss shows the ink through as a hairline.
  // read per COLOUR: the ink of a bubble and the ink of a body are separate regions of one ink
  const inkNotes = [];
  const inkDone = new Set();
  for (const ci of new Set(all.map((r) => r.ci))) {
    if (lum(pc[ci]) > 70 || inkDone.has(ci)) continue;
    // one ink may be two palette entries (a bubble's ink a shade off the body's): every dark colour within 25 counts as this ink
    const fam = new Set([...new Set(all.map((r) => r.ci))].filter((c) => lum(pc[c]) <= 70 && cdist(pc[c], pc[ci]) < 25)); for (const c of fam) inkDone.add(c);
    const mine = parts.map((q, j) => j).filter((j) => fam.has(all[j].ci)); if (mine.reduce((t, j) => t + parts[j].px, 0) < 0.05 * fg) continue;
    let framed = 0, others = 0;
    parts.forEach((q, j) => { if (fam.has(all[j].ci) || q.px < minPx) return; others++;
      const t = mine.reduce((sum, m) => sum + (touch[j].get(m) || 0), 0); if (border[j] && t >= 0.35 * border[j]) framed++; });
    if (others >= 4 && framed >= 0.55 * others) for (const j of mine) { parts[j].ink = true; inkNotes.push(parts[j].name); } }
  // background colour INSIDE the figure: a white tooth, or a hole the background shows through (a gap under an arm, a cut-out eye)?
  // Only the reference can say — such parts are listed for the agent (and the designer when unsure); never paint a hole white.
  const bgLike = parts.filter((p) => { const c = hex(p.color); return Math.hypot(c[0] - corner[0], c[1] - corner[1], c[2] - corner[2]) < 30; });
  for (const p of bgLike) p.bgColour = true;
  // A region that HOLDS features (a face with its eyes and mouth, a body with its buttons) is the object's own fill in the background's
  // colour — dropping it as a "hole" punched a snowman's face and belly out (test 11/2026, white on white). Feature = a smaller part
  // inside its box that touches it along ≥ half its border (strict on purpose: at 30 % the inside of a ring sign counted as a fill; a region it misses — a belly whose buttons sit on a shade — is still listed for the agent's look). Regions holding none are left to the agent's look (hole, tooth, highlight).
  const featuresOf = new Map();
  for (const p of bgLike) { const k = parts.indexOf(p), [bx, by, bw, bh] = p.box;
    const f = parts.filter((q, j) => { if (j === k || q.bgColour || q.px >= p.px) return false; const [qx, qy, qw, qh] = q.box;
      return qx >= bx && qy >= by && qx + qw <= bx + bw && qy + qh <= by + bh && border[j] && (touch[j].get(k) || 0) >= 0.5 * border[j]; });
    if (f.length >= 2) { p.bgFill = true; featuresOf.set(p.name, f.map((q) => q.name)); } }
  // TONE STEPS: touching neighbours whose colours are steps of one tone (a soft gradient the palette cut into bands) — one part with a
  // gradient, not five flat bands with seams between them
  // a band of a gradient is not flat inside (its pixels keep changing); a flat fold shade next to its coat is — only bands count
  const acc = parts.map(() => [0, 0, 0, 0, 0, 0, 0]);   // n, Σrgb, Σrgb² — one pass over the image
  for (let i = 0; i < W * H; i++) { const k = partOf[i]; if (k < 0) continue; const c = im.at(i % W, (i / W) | 0), e = acc[k]; e[0]++;
    for (let z = 0; z < 3; z++) { e[1 + z] += c[z]; e[4 + z] += c[z] * c[z]; } }
  const spread = acc.map((e) => (e[0] ? Math.sqrt([0, 1, 2].reduce((t, z) => t + Math.max(0, e[4 + z] / e[0] - (e[1 + z] / e[0]) ** 2), 0)) : 0));
  const chains = [];
  parts.forEach((p, k) => { if (p.ink || p.pattern || p.line || p.bgColour || spread[k] < 6) return; const c = hex(p.color);
    for (const [j, nTouch] of touch[k]) { const q = parts[j]; if (j <= k || q.ink || q.pattern || q.line || q.bgColour || spread[j] < 6) continue; const d = hex(q.color);
      if (Math.hypot(c[0] - d[0], c[1] - d[1], c[2] - d[2]) >= 42 || nTouch < 0.25 * Math.min(border[k], border[j])) continue;
      { const u = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) if (partOf[i] === k || partOf[i] === j) u[i] = 1; if (!measureGradient(u, W, (x, y) => im.at(x, y))) continue; }
      const ca = chains.find((x) => x.has(p.name)), cb = chains.find((x) => x.has(q.name));
      if (ca && cb && ca !== cb) { for (const x of cb) ca.add(x); chains.splice(chains.indexOf(cb), 1); }
      else if (ca) ca.add(q.name); else if (cb) cb.add(p.name); else chains.push(new Set([p.name, q.name])); } });
  if (inkNotes.length) { const ink = parts.filter((p) => p.ink), rest = parts.filter((p) => !p.ink); parts.length = 0; parts.push(...rest, ...ink); }
  const plan = { img: o.img, ...(o.crop ? { crop: o.crop } : {}), scale: o.scale || 1, srcPx, frame: { name: o.name || 'Vector' },
    palette, groups: [{ name: 'Draft', parts }] };
  // one part per line: easy to read, and easy to tweak one part in place during refine
  fs.writeFileSync(o.autoPlan, '{"img":' + JSON.stringify(plan.img) + (plan.crop ? ',"crop":' + JSON.stringify(plan.crop) : '') +
    `,"scale":${plan.scale},"srcPx":${plan.srcPx},"frame":${JSON.stringify(plan.frame)},\n"palette":${JSON.stringify(palette)},\n"groups":[{"name":"Draft","parts":[\n` +
    parts.map((p) => JSON.stringify(p)).join(',\n') + '\n]}]}\n');
  // labels image: reference ×k, each region outlined + its number
  const k = Math.max(2, Math.min(6, Math.round(900 / Math.max(W, H))));
  const base = await sharp(o.img).extract({ left: im.cx, top: im.cy, width: W, height: H }).resize(W * k, H * k, { kernel: 'nearest' }).png().toBuffer();
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * k}" height="${H * k}">`;
  parts.forEach((p, idx) => { const [x, y, w, h] = p.box; const hue = (idx * 47) % 360;
    svg += `<rect x="${x * k}" y="${y * k}" width="${w * k}" height="${h * k}" fill="none" stroke="hsl(${hue},90%,45%)" stroke-width="1"/>`;
    const [sx, sy] = p.seeds[0];
    svg += `<text x="${sx * k + 1}" y="${sy * k + 9}" font-size="10" font-family="Arial" font-weight="bold" fill="#000" stroke="#fff" stroke-width="2.5" paint-order="stroke">${idx + 1}</text>`; });
  const labels = o.autoPlan.replace(/\.json$/i, '') + '.labels.png';
  await sharp(base).composite([{ input: Buffer.from(svg + '</svg>') }]).png().toFile(labels);
  console.log(`${parts.length} regions → draft plan ${o.autoPlan} · labels ${labels}`);
  const lines = parts.filter((p) => p.line), pats = parts.filter((p) => p.pattern);
  if (lines.length || pats.length) console.log(`kept fine detail: ${lines.map((p) => `${p.name} line`).concat(pats.map((p) => `${p.name} pattern of ${p.pattern} dots`)).join(' · ')} — name them at lock, never drop them unasked`);
  if (inkNotes.length) console.log(`ink style: ${inkNotes.join(', ')} frames the colours → placed IN FRONT (one outline with holes over the colour parts, which run under it — no seam can open). Keep the ink group last at lock`);
  if (bgLike.length) { const fills = bgLike.filter((p) => p.bgFill), open = bgLike.filter((p) => !p.bgFill);
    if (fills.length) console.log(`background colour inside the figure, holding features → the object's own fill, KEEP it (name it, e.g. Face, Belly): ${fills.map((p) => `${p.name} (holds ${featuresOf.get(p.name).join(', ')})`).join(' · ')}`);
    if (open.length) console.log(`background colour inside the figure, holding nothing: ${open.map((p) => p.name).join(', ')} — decide each by looking: a hole the background shows through (inside of a ring, a gap under an arm, a letter's counter) → "drop" at lock; a part of that colour (a tooth, a highlight, a white shirt) → keep and name it. Never drop them all at once; unsure → ask the designer. The --dark preview at lock shows every hole`); }
  // one line, however many chains: a soft-shaded image has dozens, and one line per chain buried the other readings
  if (chains.length) console.log(`tone steps (${chains.length}): ${chains.map((c) => [...c].join('+')).join(' · ')} — each chain is one soft gradient cut into bands: at lock make it ONE part with "gradient": true (one shape, one gradient fill, no seams). Many chains = soft-shaded art: shading goes as gradients / see-through overlays on the base shapes, never as more flat bands or a harder colour reduction`);
  if (o.out) await build({ plan: o.autoPlan, out: o.out, render: o.render, clean: o.clean, rough: o.rough });
  console.log('Next: build the draft now (build_vectors), score it once (score.cjs --plan), look check (build sheet + compare-sheet.cjs), then refine everything fixable in at most two rounds (no zooms, no probes);'
    + ' names and groups come in the lock pass (--names names.json --plan draft.json --to plan.json).');
}

// --names: the lock pass — draft parts p01… → named parts in groups, back → front; seeds / colours / boxes copied, never typed
function nameParts(o) {
  const draft = JSON.parse(fs.readFileSync(o.plan, 'utf8')), names = JSON.parse(fs.readFileSync(o.names, 'utf8'));
  const byId = new Map(); for (const g of draft.groups) for (const p of g.parts) byId.set(p.name, p);
  const used = new Set(), errors = [], notes = [];
  for (const id of names.drop || []) { if (!byId.has(id)) errors.push(`drop: no draft part ${id}`); used.add(id); }
  const groups = (names.groups || []).map((g) => ({ name: g.name, parts: (g.parts || []).map((np) => {
    const src = (np.from || []).map((id) => { if (!byId.has(id)) errors.push(`${g.name} / ${np.name}: no draft part ${id}`);
      else if (used.has(id)) errors.push(`${id} used twice (${g.name} / ${np.name})`); used.add(id); return byId.get(id); }).filter(Boolean);
    if (!src.length) { errors.push(`${g.name} / ${np.name}: "from" is empty`); return null; }
    const colors = [...new Set(src.flatMap((p) => p.colors || [p.color]))];
    const x0 = Math.min(...src.map((p) => p.box[0])), y0 = Math.min(...src.map((p) => p.box[1]));
    const x1 = Math.max(...src.map((p) => p.box[0] + p.box[2])), y1 = Math.max(...src.map((p) => p.box[1] + p.box[3]));
    const out = { name: np.name, ...(colors.length > 1 ? { colors } : { color: colors[0] }), tol: Math.max(...src.map((p) => p.tol || 30)),
      seeds: src.flatMap((p) => p.seeds || (p.seed ? [p.seed] : [])), box: [x0, y0, x1 - x0, y1 - y0] };
    for (const k of ['complete', 'simplify', 'clean', 'draw', 'inside', 'line', 'pattern']) { const v = src.find((p) => p[k] !== undefined); if (v) out[k] = v[k]; }
    if (np.inside !== undefined) out.inside = np.inside;  // names.json may set it by the new name
    // shading written at lock: one gradient over joined tone steps, an overlay over its base, a layer opacity / blend
    for (const k of ['gradient', 'overlay', 'over', 'opacity', 'blend', 'draw', 'complete']) if (np[k] !== undefined) out[k] = np[k];
    if (colors.length > 1 && !np.gradient) { const c = colors.map(hex), far = c.some((a) => c.some((b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 60));
      if (far) notes.push(`${g.name} / ${np.name}: joins clearly different colours (${colors.join(' ')}) — one fill; keep them as two parts if the reference shows two tones`); }
    return out; }).filter(Boolean) }));
  // "inside": "p07" written on the draft → the new name of the part p07 went into
  const renamed = new Map(); for (const g of names.groups || []) for (const np of g.parts || []) for (const id of np.from || []) renamed.set(id, np.name);
  for (const g of groups) for (const p of g.parts) if (typeof p.inside === 'string' && renamed.has(p.inside)) p.inside = renamed.get(p.inside);
  const left = [...byId.keys()].filter((id) => !used.has(id));
  if (left.length) errors.push(`not used or dropped: ${left.join(' ')}`);
  if (errors.length) { for (const e of errors) console.log('✗ ' + e); process.exit(1); }
  const plan = { img: draft.img, ...(draft.crop ? { crop: draft.crop } : {}), scale: draft.scale, srcPx: draft.srcPx,
    ...(draft.palette ? { palette: draft.palette } : {}), frame: { name: names.frame || (draft.frame && draft.frame.name) || 'Vector' }, groups,
    ...(names.shadowTint ? { shadowTint: names.shadowTint } : {}) };
  // nested groups ("Head/Eye L") come right after their holder and before the next top-level group — the stack order is the scene order
  for (let i = 0; i < groups.length; i++) { const nm = groups[i].name; if (!nm.includes('/')) continue; const top = nm.split('/')[0].trim();
    const holder = groups.findIndex((g) => g.name === top); if (holder > i) notes.push(`${nm}: list the group "${top}" before its nested groups`); }
  // shape family and matched sets carry over; sets written with draft ids get the new names (two ids in one part count once)
  const fam = names.family !== undefined ? names.family : draft.family; if (fam !== undefined) plan.family = fam;
  const same = names.same !== undefined ? names.same : draft.same;
  if (same === false) plan.same = false;
  else if (Array.isArray(same)) plan.same = same.map((set) => [...new Set(set.map((id) => renamed.get(id) || id))]).filter((set) => set.length >= 2);
  fs.writeFileSync(o.to, JSON.stringify(plan, null, 1));
  for (const n of notes) console.log('⚠ ' + n);
  console.log(`${groups.length} groups · ${groups.reduce((s, g) => s + g.parts.length, 0)} named parts → ${o.to}`
    + ' · next: --plan it --out scene.json, build_vectors, delete the "Draft" group, score once more');
}

const o = args();
(o.palette ? palette(o) : o.autoPlan ? autoPlan(o) : o.names && o.plan && o.to ? Promise.resolve(nameParts(o)) : o.plan && o.out ? build(o)
  : Promise.reject(new Error('use --palette --img … · --auto-plan draft.json --img … [--out scene.json] · --names names.json --plan draft.json --to plan.json · --plan … --out …')))
  .catch((e) => { console.error(e.message); process.exit(1); });
