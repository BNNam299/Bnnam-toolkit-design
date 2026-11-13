// fit-shapes.cjs — the CLEAN step of a copy job: replace a traced blob by the simplest clean shape that matches it.
// Flat art is made of rectangles, rounded rectangles, circles / ellipses and straight-sided polygons; tracing a small or soft
// reference gives wobbly outlines of those shapes (a 120 px sprite traced at 4×: every pixel stair became a 4 px wave). A test copy
// that the agent then rebuilt by hand from measured shapes went from 14/32 to 31/32 parts — this does the same automatically.
//
// fitComponent(mask, W, H, comp, { srcPx, minIoU, allowed, hidden }) → { type, d, iou, anchors, ok: [every shape that fits], margin } | null
// fitAs(mask, W, H, comp, model, { srcPx, hidden, cover }) → the piece drawn as a matched set's model (same kind, width, length)
// pick(ok, family) → the candidate to use, the style's shape family winning close calls
//   mask: Uint8Array W×H of the WHOLE part; comp: { idx: [pixel indices], x0, y0, x1, y1, holes } one connected piece of it.
//   Candidates, fewest anchors first: rect (4) · roundrect (4–8, a radius per corner) · ellipse (4) and pill (6), both rotatable
//   and allowed to continue under the parts in front (`hidden`) · polygon
//   (straight sides, ≤ 14 corners, from the traced outline). Each is rasterised at the reference's pixel centres and compared with
//   the piece, ignoring a band of one original pixel along the piece's edge (anti-aliasing). The best one at or above minIoU wins,
//   preferring fewer anchors when two are within 0.01. A piece with holes is not fitted (traced instead).
// components(mask, W, H) → [{ idx, x0, y0, x1, y1, n, holes }]   4-connected pieces
// Paths are in reference pixel coordinates (pixel x covers [x, x + 1)); the caller scales them.
'use strict';

const KAPPA = 0.5522847498;
const r2 = (v) => Math.round(v * 1000) / 1000;

function components(mask, W, H, bb) { // bb = [x0, y0, x1, y1] (inclusive): the mask is known to be empty outside it
  const seen = new Uint8Array(W * H), out = [], [bx0, by0, bx1, by1] = bb || [0, 0, W - 1, H - 1];
  for (let sy = by0; sy <= by1; sy++) for (let sx = bx0; sx <= bx1; sx++) { const i0 = sy * W + sx;
    if (!mask[i0] || seen[i0]) continue;
    const idx = [], st = [i0]; seen[i0] = 1; let x0 = W, y0 = H, x1 = -1, y1 = -1;
    while (st.length) { const i = st.pop(), x = i % W, y = (i / W) | 0; idx.push(i);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const j of [x + 1 < W ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < H ? i + W : -1, y > 0 ? i - W : -1])
        if (j >= 0 && mask[j] && !seen[j]) { seen[j] = 1; st.push(j); } }
    // holes: background pockets inside the piece's box that do not reach the box border
    const bw = x1 - x0 + 3, bh = y1 - y0 + 3, inside = new Uint8Array(bw * bh), outer = new Uint8Array(bw * bh);
    for (const i of idx) inside[((i / W | 0) - y0 + 1) * bw + (i % W) - x0 + 1] = 1;
    const st2 = [0]; outer[0] = 1;
    while (st2.length) { const j = st2.pop(), x = j % bw, y = (j / bw) | 0;
      for (const k of [x + 1 < bw ? j + 1 : -1, x > 0 ? j - 1 : -1, y + 1 < bh ? j + bw : -1, y > 0 ? j - bw : -1])
        if (k >= 0 && !inside[k] && !outer[k]) { outer[k] = 1; st2.push(k); } }
    let holes = 0; for (let j = 0; j < bw * bh; j++) if (!inside[j] && !outer[j]) holes++;
    out.push({ idx, x0, y0, x1, y1, n: idx.length, holes });
  }
  return out;
}

// --- candidate shapes: inside(px, py) at pixel centres + path ---
function rectShape(L, T, R, B, rad) { // rad = [tl, tr, br, bl]
  const [tl, tr, br, bl] = rad || [0, 0, 0, 0];
  const inside = (px, py) => {
    if (px < L || px > R || py < T || py > B) return false;
    const c = (cx, cy, r) => (r > 0 ? (px - cx) ** 2 + (py - cy) ** 2 <= r * r : true);
    if (px < L + tl && py < T + tl) return c(L + tl, T + tl, tl);
    if (px > R - tr && py < T + tr) return c(R - tr, T + tr, tr);
    if (px > R - br && py > B - br) return c(R - br, B - br, br);
    if (px < L + bl && py > B - bl) return c(L + bl, B - bl, bl);
    return true; };
  const k = (r) => r * (1 - KAPPA);
  let d = `M ${r2(L + tl)} ${r2(T)} L ${r2(R - tr)} ${r2(T)}`;
  if (tr) d += ` C ${r2(R - k(tr))} ${r2(T)} ${r2(R)} ${r2(T + k(tr))} ${r2(R)} ${r2(T + tr)}`;
  d += ` L ${r2(R)} ${r2(B - br)}`;
  if (br) d += ` C ${r2(R)} ${r2(B - k(br))} ${r2(R - k(br))} ${r2(B)} ${r2(R - br)} ${r2(B)}`;
  d += ` L ${r2(L + bl)} ${r2(B)}`;
  if (bl) d += ` C ${r2(L + k(bl))} ${r2(B)} ${r2(L)} ${r2(B - k(bl))} ${r2(L)} ${r2(B - bl)}`;
  d += ` L ${r2(L)} ${r2(T + tl)}`;
  if (tl) d += ` C ${r2(L)} ${r2(T + k(tl))} ${r2(L + k(tl))} ${r2(T)} ${r2(L + tl)} ${r2(T)}`;
  const n = 4 + [tl, tr, br, bl].filter((r) => r > 0).length;
  return { inside, d: d + ' Z', anchors: n };
}
function ellipseShape(cx, cy, a, b, th) {
  const c = Math.cos(th), s = Math.sin(th);
  const inside = (px, py) => { const dx = px - cx, dy = py - cy, u = dx * c + dy * s, v = -dx * s + dy * c; return (u * u) / (a * a) + (v * v) / (b * b) <= 1; };
  const P = (u, v) => [cx + u * c - v * s, cy + u * s + v * c];
  const pts = [[a, 0], [0, b], [-a, 0], [0, -b]];
  const ctl = [[[a, KAPPA * b], [KAPPA * a, b]], [[-KAPPA * a, b], [-a, KAPPA * b]], [[-a, -KAPPA * b], [-KAPPA * a, -b]], [[KAPPA * a, -b], [a, -KAPPA * b]]];
  let d = 'M ' + P(...pts[0]).map(r2).join(' ');
  for (let q = 0; q < 4; q++) d += ' C ' + [P(...ctl[q][0]), P(...ctl[q][1]), P(...pts[(q + 1) % 4])].map((p) => p.map(r2).join(' ')).join(' ');
  return { inside, d: d + ' Z', anchors: 4 };
}
function polygonShape(pts) {
  const inside = (px, py) => { let o = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) o = !o; } return o; };
  return { inside, d: 'M ' + pts.map((p) => p.map(r2).join(' ')).join(' L ') + ' Z', anchors: pts.length };
}

// Douglas–Peucker on a closed loop (points {x, y}); returns corner points
function dpClosed(loop, eps) {
  const n = loop.length; if (n < 4) return loop.map((p) => [p.x, p.y]);
  // start at the point farthest from the first, so the split is stable
  let far = 0, fd = -1; for (let i = 0; i < n; i++) { const d = (loop[i].x - loop[0].x) ** 2 + (loop[i].y - loop[0].y) ** 2; if (d > fd) { fd = d; far = i; } }
  const seq = (a, b) => { const out = []; for (let i = a; ; i = (i + 1) % n) { out.push(loop[i]); if (i === b) break; } return out; };
  const dp = (pts) => { if (pts.length < 3) return [pts[0]];
    const A = pts[0], B = pts[pts.length - 1], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1e-9;
    let mi = 0, md = -1; for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs((pts[i].x - A.x) * dy - (pts[i].y - A.y) * dx) / L; if (d > md) { md = d; mi = i; } }
    if (md <= eps) return [A];
    return dp(pts.slice(0, mi + 1)).concat(dp(pts.slice(mi))); };
  return dp(seq(0, far)).concat(dp(seq(far, 0))).map((p) => [p.x, p.y]);
}

// Pill / stadium, rotatable: centre (cx, cy), half-length A along the axis at angle th, radius r (half the width). The shape of
// "rounded ends, straight sides" that ellipses only imitate — ears, muzzles, pupils, capsule buttons. A ≈ r → a circle.
function pillShape(cx, cy, A, r, th) {
  const c = Math.cos(th), s = Math.sin(th), h = Math.max(0, A - r);
  const inside = (px, py) => { const dx = px - cx, dy = py - cy, u = dx * c + dy * s, v = -dx * s + dy * c, du = Math.max(0, Math.abs(u) - h); return du * du + v * v <= r * r; };
  if (h < 0.25) { const e = ellipseShape(cx, cy, r, r, 0); return { inside, d: e.d, anchors: 4 }; }
  const P = (u, v) => [cx + u * c - v * s, cy + u * s + v * c].map(r2).join(' '), K = KAPPA * r;
  const d = `M ${P(-h, -r)} L ${P(h, -r)} C ${P(h + K, -r)} ${P(h + r, -K)} ${P(h + r, 0)} C ${P(h + r, K)} ${P(h + K, r)} ${P(h, r)}`
    + ` L ${P(-h, r)} C ${P(-h - K, r)} ${P(-h - r, K)} ${P(-h - r, 0)} C ${P(-h - r, -K)} ${P(-h - K, -r)} ${P(-h, -r)} Z`;
  return { inside, d, anchors: 6 };
}
// a few degrees off straight is the reference's anti-aliasing, not the designer's intent: snap (≈ 3.5°)
const snapAngle = (th) => { for (const t of [0, Math.PI / 2, -Math.PI / 2]) if (Math.abs(th - t) < 0.06) return t; return th; };

// Shared scoring context for one piece. hidden: pixels of parts IN FRONT of this one — a shape may run under them (a lid over an
// eye, a nose over a muzzle) without counting as a miss, because a designer draws the eye whole and lays the lid on top.
function context(mask, W, H, comp, opts) {
  const srcPx = (opts && opts.srcPx) || 1, hidden = opts && opts.hidden, allowed = opts && opts.allowed;
  const own = new Set(comp.idx), inC = (x, y) => x >= 0 && y >= 0 && x < W && y < H && own.has(y * W + x);
  // look further around the piece only when something in front touches it (room for the shape to continue underneath)
  let pad = 2;
  if (hidden) { let near = false;
    for (let y = Math.max(0, comp.y0 - 2); y <= Math.min(H - 1, comp.y1 + 2) && !near; y++)
      for (let x = Math.max(0, comp.x0 - 2); x <= Math.min(W - 1, comp.x1 + 2); x++) if (hidden[y * W + x] && !inC(x, y)) { near = true; break; }
    if (near) pad = Math.ceil(Math.max(comp.x1 - comp.x0, comp.y1 - comp.y0)) + 2; }
  const X0 = Math.max(0, comp.x0 - pad), Y0 = Math.max(0, comp.y0 - pad), X1 = Math.min(W - 1, comp.x1 + pad), Y1 = Math.min(H - 1, comp.y1 + pad);
  const band = Math.max(1, Math.round(srcPx));
  const isEdge = (x, y) => { const v = inC(x, y); for (let dy = -band; dy <= band; dy++) for (let dx = -band; dx <= band; dx++) if (inC(x + dx, y + dy) !== v) return true; return false; };
  const cells = [];
  for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
    const v = inC(x, y), hid = !v && !!hidden && !!hidden[y * W + x];
    const far = x < comp.x0 - 2 || x > comp.x1 + 2 || y < comp.y0 - 2 || y > comp.y1 + 2;
    cells.push([x, y, v, far ? false : isEdge(x, y), hid, far]); }
  // two scores: `tol` ignores the edge band (decides IF a shape is accepted), `full` counts every pixel (decides WHICH shape wins)
  const score = (sh) => { let i = 0, u = 0, fi = 0, fu = 0, bad = 0, spill = 0, miss = 0;
    for (const [x, y, v, e, hid] of cells) { const s = sh.inside(x + 0.5, y + 0.5);
      if (allowed && s && !allowed[y * W + x]) spill++;
      if (hid) continue;                                   // under a part in front: free either way
      if (s && !v) bad++;
      if (v && !s && !e) miss++;
      if (s || v) fu++; if (s && v) fi++; if (e) continue; if (s || v) u++; if (s && v) i++; }
    sh.full = fu ? fi / fu : 0; sh.iou = u ? i / u : 1; sh.bad = bad; sh.spill = spill; sh.miss = miss; return sh; };
  // stretch a pill / ellipse along its axis into the hidden area (each end separately), as long as it lands on nothing visible
  const extend = (make, p) => {
    if (pad === 2) return make(p);
    const base = score(make(p)), lim = 0, steps = [0.5, 1, 1.5, 2, 3].map((k) => k * p.r), c = Math.cos(p.th), s = Math.sin(p.th);
    const at = (e1, e2) => make({ ...p, A: p.A + (e1 + e2) / 2, cx: p.cx + c * (e2 - e1) / 2, cy: p.cy + s * (e2 - e1) / 2 });
    let e1 = 0, e2 = 0;
    for (const e of steps) { if (score(at(0, e)).bad - base.bad <= lim) e2 = e; else break; }
    for (const e of steps) { if (score(at(e, 0)).bad - base.bad <= lim) e1 = e; else break; }
    let best = at(e1, e2); if (score(best).bad - base.bad > lim) best = e2 >= e1 ? at(0, e2) : at(e1, 0);
    return best; };
  return { srcPx, inC, cells, score, extend, occluded: pad > 2 };
}
// principal axis + extents of the piece's pixels along / across it (th0: use this angle instead of the piece's own)
function axes(comp, W, th0) {
  let sx = 0, sy = 0; for (const i of comp.idx) { sx += i % W + 0.5; sy += ((i / W) | 0) + 0.5; }
  const n = comp.n, mx = sx / n, my = sy / n; let xx = 0, yy = 0, xy = 0;
  for (const i of comp.idx) { const dx = i % W + 0.5 - mx, dy = ((i / W) | 0) + 0.5 - my; xx += dx * dx; yy += dy * dy; xy += dx * dy; }
  xx /= n; yy /= n; xy /= n; const tr = xx + yy, det = xx * yy - xy * xy, disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
  const l1 = tr / 2 + disc, l2 = tr / 2 - disc, th = th0 !== undefined ? th0 : snapAngle(0.5 * Math.atan2(2 * xy, xx - yy));
  const c = Math.cos(th), s = Math.sin(th); let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const i of comp.idx) { const dx = i % W + 0.5 - mx, dy = ((i / W) | 0) + 0.5 - my, u = dx * c + dy * s, v = -dx * s + dy * c;
    if (u < u0) u0 = u; if (u > u1) u1 = u; if (v < v0) v0 = v; if (v > v1) v1 = v; }
  const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  return { mx, my, l1, l2, th, A: (u1 - u0) / 2 + 0.5, B: (v1 - v0) / 2 + 0.5, cx: mx + cu * c - cv * s, cy: my + cu * s + cv * c };
}
const pillOf = (q) => Object.assign(pillShape(q.cx, q.cy, q.A, q.r, q.th), { params: q });
const ellOf = (q) => Object.assign(ellipseShape(q.cx, q.cy, q.A, q.b, q.th), { params: q });

function fitComponent(mask, W, H, comp, opts) {
  const srcPx = (opts && opts.srcPx) || 1, minIoU = (opts && opts.minIoU) || 0.95, loop = opts && opts.loop;
  // a detail may hold a few blend pixels round the detail in front of it (a pupil in an eye); a big mass with holes stays traced
  const big = comp.n > 0.05 * W * H;   // a mass, by area (a long thin leg is not)
  if (comp.holes > (big ? 2 * srcPx * srcPx : Math.max(2 * srcPx * srcPx, 0.03 * comp.n)) || comp.n < 6) return null;
  const ctx = context(mask, W, H, comp, opts), inC = ctx.inC;
  // robust box: a row / column belongs to the shape when at least half of the piece's typical span is filled
  const colN = new Map(), rowN = new Map();
  for (const i of comp.idx) { const x = i % W, y = (i / W) | 0; colN.set(x, (colN.get(x) || 0) + 1); rowN.set(y, (rowN.get(y) || 0) + 1); }
  const span = (m) => { const v = [...m.values()].sort((a, b) => a - b); const med = v[Math.floor(v.length * 0.75)] || 1;
    const keys = [...m.keys()].filter((k) => m.get(k) >= med * 0.35).sort((a, b) => a - b); return [keys[0], keys[keys.length - 1] + 1]; };
  const [L, R] = span(colN), [T, B] = span(rowN);
  const cands = [];
  cands.push({ type: 'rect', ...rectShape(L, T, R, B), params: { L, T, R, B } });
  // rounded rect: a radius per corner from the pixels missing in that corner (missing area = r²(1 − π/4)); four corners nearly as
  // round as they can be is a pill — tried below, rotatable
  { const w = R - L, h = B - T, lim = Math.min(w, h) / 2, q = Math.max(1, Math.floor(lim));
    const miss = (sx, sy, ex, ey) => { let m = 0; for (let y = sy; y < ey; y++) for (let x = sx; x < ex; x++) if (!inC(x, y)) m++; return m; };
    const rad = (m) => { const r = Math.sqrt(m / (1 - Math.PI / 4)); return r < 0.75 * srcPx ? 0 : Math.min(lim, r); };
    const rr = [rad(miss(L, T, L + q, T + q)), rad(miss(R - q, T, R, T + q)), rad(miss(R - q, B - q, R, B)), rad(miss(L, B - q, L + q, B))];
    if (rr.some((r) => r > 0) && !rr.every((r) => r >= 0.6 * lim)) cands.push({ type: 'roundrect', ...rectShape(L, T, R, B, rr), params: { L, T, R, B, rr } }); }
  // ellipse and pill from the piece's principal axis (both rotatable, both may continue under a part in front)
  { const a = axes(comp, W), b = 2 * Math.sqrt(Math.max(0.01, a.l2));
    cands.push({ type: 'ellipse', ...ctx.extend(ellOf, { type: 'ellipse', cx: a.mx, cy: a.my, A: 2 * Math.sqrt(a.l1), b, r: b, th: a.th }) });
    // pill width from its area (area = π r² + 4 r (A − r)), not from the outermost pixels — one stray pixel made every pill too wide
    const long = a.A >= a.B, AL = Math.max(a.A, a.B), q = 4 - Math.PI, disc = 16 * AL * AL - 4 * q * comp.n;
    const r = disc > 0 ? Math.min(Math.min(a.A, a.B), (4 * AL - Math.sqrt(disc)) / (2 * q)) : Math.min(a.A, a.B);
    cands.push({ type: 'pill', ...ctx.extend(pillOf, { type: 'pill', cx: a.cx, cy: a.cy, A: AL, r, th: long ? a.th : a.th + Math.PI / 2 }) }); }
  // polygon with straight sides from the traced outline
  if (loop && loop.length >= 4) { const pts = dpClosed(loop, 0.9 * srcPx); if (pts.length >= 3 && pts.length <= 14) cands.push({ type: 'polygon', ...polygonShape(pts) }); }
  for (const c of cands) ctx.score(c);
  // a detail that lives inside another part must not poke out of it (spill = pixels outside the owner + its own pixels)
  // a big mass carries the style's character (a head that tapers, a coat that flares): a primitive replaces it only when it is
  // nearly exact — otherwise it stays traced and the agent draws it from the build sheet (`draw`)
  const ok = cands.filter((c) => c.iou >= minIoU && c.full >= (big ? 0.97 : 0.8) && c.spill <= srcPx * srcPx)
    .map((c) => ({ type: c.type, d: c.d, iou: Math.round(c.iou * 1000) / 1000, full: Math.round(c.full * 1000) / 1000, anchors: c.anchors, params: c.params }));
  if (!ok.length) return null;
  return { ...pick(ok), ok, margin: margin(ok), occluded: ctx.occluded };
}
// A designer draws a button as a circle, not an octagon that hugs the pixels: primitives win unless a polygon is clearly better.
// `family`: the shape kinds this style is built from (read from its clear pieces) — when two kinds are close, the family's wins.
const rank = (c, family) => c.full + (c.type === 'polygon' ? 0 : 0.05) + (family && family.includes(c.type) ? 0.06 : 0);
function pick(ok, family) {
  return [...ok].sort((a, b) => (Math.abs(rank(a, family) - rank(b, family)) <= 0.01 ? a.anchors - b.anchors : rank(b, family) - rank(a, family)))[0];
}
// how clearly the winner beats the best candidate of another kind (no family) — clear pieces teach the family
function margin(ok) { const b = pick(ok), o = ok.filter((c) => c.type !== b.type).map((c) => rank(c)); return o.length ? rank(b) - Math.max(...o) : 1; }

// One member of a matched set (two eyes, two ears, two pupils) drawn like the set's model: same kind, same angle, same width AND the
// same length — the same feature is the same size. The member's own pixels give its position. When it shows shorter than the
// model, the missing length is hidden: under a part in front, or under a COVER of a bigger part's colour (an eyelid painted in the
// head's colour over the top of the eye). The shape grows toward the end that is cut (flat), not the end that is already round:
// the split with the fewest of the member's own pixels left outside wins.
//   opts.cover: pixels of big parts behind the member that may be covering it; the caller adds a cover part where the grown
//   shape lies under them.
function fitAs(mask, W, H, comp, model, opts) {
  if (!model || !['pill', 'ellipse'].includes(model.type)) return null;
  const front = opts && opts.hidden, cover = opts && opts.cover;
  let hidden = front;
  if (cover) { hidden = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) hidden[i] = (front && front[i]) || cover[i] ? 1 : 0; }
  const ctx = context(mask, W, H, comp, { ...opts, hidden }), q = model.params;
  const w = model.type === 'ellipse' ? q.b : q.r, make = model.type === 'pill' ? pillOf : ellOf;
  let best = null;
  // the model's angle, its mirror (a left ear is the right ear flipped) and the member's own
  for (const th of [q.th, Math.PI - q.th, axes(comp, W).th]) {
    const a = axes(comp, W, th), base = { type: model.type, cx: a.cx, cy: a.cy, A: Math.max(a.A, w), r: w, b: w, th };
    const need = Math.max(0, q.A - base.A), c = Math.cos(th), s = Math.sin(th);
    for (const t of need > 0 ? [0, 0.25, 0.5, 0.75, 1] : [0.5]) {
      const e2 = need * t, e1 = need - e2;
      const sh = ctx.score(make({ ...base, A: base.A + need / 2, cx: base.cx + c * (e2 - e1) / 2, cy: base.cy + s * (e2 - e1) / 2 }));
      sh.need = need;
      if (!best || sh.miss + sh.bad < best.miss + best.bad) best = sh; } }
  return { type: model.type, d: best.d, iou: Math.round(best.iou * 1000) / 1000, full: Math.round(best.full * 1000) / 1000, anchors: best.anchors,
    params: best.params, spill: best.spill, inside: best.inside, grown: Math.round(best.need * 10) / 10 };
}

module.exports = { components, fitComponent, fitAs, pick, dpClosed };
