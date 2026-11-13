// anchors.js — count and optimise the anchor points of vector paths (team hard rule: the shape first, then the fewest anchors).
// Paste the functions you need at the top of the code sent to execute_code (figma-agent), like illustration-helpers.js.
// Pure geometry (parsePath … simplifyPath) runs anywhere; anchorReport / optimizeAnchors need the Figma Plugin API.
//
// Fidelity before count: simplifyPath only returns a lighter path when every point of the new outline lies within `tol` px of
// the old one (checked both ways on densely sampled outlines). Otherwise it returns the original untouched. Corners (tangent
// break > cornerDeg) always stay anchors; smooth runs between corners are refit with as few cubic Béziers as the tolerance allows
// (Schneider, "An Algorithm for Automatically Fitting Digitized Curves", Graphics Gems 1990).

const V2 = {
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  mul: (a, s) => ({ x: a.x * s, y: a.y * s }),
  dot: (a, b) => a.x * b.x + a.y * b.y,
  len: (a) => Math.hypot(a.x, a.y),
  dist: (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
  norm: (a) => { const l = Math.hypot(a.x, a.y); return l < 1e-12 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l }; },
};

// ---------------------------------------------------------------- parse / write
// SVG / Figma path data → [{ start, segs: [{ t: 'L' | 'C', c1?, c2?, p }], closed }]. Q, H, V and relative commands are converted;
// a closed subpath always ends on its start point (an implicit closing line becomes an explicit L).
function parsePath(d) {
  const tok = String(d).match(/[MLHVCQZmlhvcqz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || [];
  const subs = [];
  let cur = null, cmd = null, last = { x: 0, y: 0 }, i = 0;
  const num = () => parseFloat(tok[i++]);
  const isCmd = (s) => /^[A-Za-z]$/.test(s);
  while (i < tok.length) {
    if (isCmd(tok[i])) cmd = tok[i++];
    else if (!cmd || cmd === 'Z' || cmd === 'z') { i++; continue; }
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    const pt = () => { const x = num(), y = num(); return rel ? { x: last.x + x, y: last.y + y } : { x, y }; };
    if (C === 'Z') {
      if (cur) { if (V2.dist(last, cur.start) > 1e-6) cur.segs.push({ t: 'L', p: { ...cur.start } }); cur.closed = true; last = cur.start; cur = null; }
      continue;
    }
    if (C === 'M') { const p = pt(); cur = { start: p, segs: [], closed: false }; subs.push(cur); last = p; cmd = rel ? 'l' : 'L'; continue; }
    if (!cur) { cur = { start: { ...last }, segs: [], closed: false }; subs.push(cur); }
    if (C === 'L') { const p = pt(); cur.segs.push({ t: 'L', p }); last = p; }
    else if (C === 'H') { const x = num(); const p = { x: rel ? last.x + x : x, y: last.y }; cur.segs.push({ t: 'L', p }); last = p; }
    else if (C === 'V') { const y = num(); const p = { x: last.x, y: rel ? last.y + y : y }; cur.segs.push({ t: 'L', p }); last = p; }
    else if (C === 'C') { const c1 = pt(), c2 = pt(), p = pt(); cur.segs.push({ t: 'C', c1, c2, p }); last = p; }
    else if (C === 'Q') { const q = pt(), p = pt(); const p0 = last;
      cur.segs.push({ t: 'C', c1: V2.add(p0, V2.mul(V2.sub(q, p0), 2 / 3)), c2: V2.add(p, V2.mul(V2.sub(q, p), 2 / 3)), p }); last = p; }
  }
  return subs;
}

const fmt = (v) => String(Math.round(v * 1000) / 1000);
function pathToD(subs) {
  return subs.map((s) => {
    let out = `M ${fmt(s.start.x)} ${fmt(s.start.y)}`;
    s.segs.forEach((g, k) => {
      if (s.closed && k === s.segs.length - 1 && g.t === 'L') return; // Z draws the closing line
      out += g.t === 'L' ? ` L ${fmt(g.p.x)} ${fmt(g.p.y)}`
        : ` C ${fmt(g.c1.x)} ${fmt(g.c1.y)} ${fmt(g.c2.x)} ${fmt(g.c2.y)} ${fmt(g.p.x)} ${fmt(g.p.y)}`;
    });
    return s.closed ? out + ' Z' : out;
  }).join(' ');
}

// Anchors of one subpath: every segment end, plus the start of an open path.
const subAnchors = (s) => (s.segs.length === 0 ? 1 : s.segs.length + (s.closed ? 0 : 1));
function countAnchors(d) { return parsePath(d).reduce((n, s) => n + subAnchors(s), 0); }

// ---------------------------------------------------------------- geometry helpers
const bez = (b, t) => { const u = 1 - t;
  return { x: u * u * u * b[0].x + 3 * u * u * t * b[1].x + 3 * u * t * t * b[2].x + t * t * t * b[3].x,
           y: u * u * u * b[0].y + 3 * u * u * t * b[1].y + 3 * u * t * t * b[2].y + t * t * t * b[3].y }; };
const bezD1 = (b, t) => { const u = 1 - t;
  return { x: 3 * (u * u * (b[1].x - b[0].x) + 2 * u * t * (b[2].x - b[1].x) + t * t * (b[3].x - b[2].x)),
           y: 3 * (u * u * (b[1].y - b[0].y) + 2 * u * t * (b[2].y - b[1].y) + t * t * (b[3].y - b[2].y)) }; };
const bezD2 = (b, t) => ({ x: 6 * ((1 - t) * (b[2].x - 2 * b[1].x + b[0].x) + t * (b[3].x - 2 * b[2].x + b[1].x)),
                           y: 6 * ((1 - t) * (b[2].y - 2 * b[1].y + b[0].y) + t * (b[3].y - 2 * b[2].y + b[1].y)) });
function distToLine(p, a, b) { const ab = V2.sub(b, a), l2 = V2.dot(ab, ab); if (l2 < 1e-12) return V2.dist(p, a);
  return Math.abs(ab.x * (p.y - a.y) - ab.y * (p.x - a.x)) / Math.sqrt(l2); }
function distToSeg(p, a, b) { const ab = V2.sub(b, a), l2 = V2.dot(ab, ab); if (l2 < 1e-12) return V2.dist(p, a);
  const t = Math.max(0, Math.min(1, V2.dot(V2.sub(p, a), ab) / l2)); return V2.dist(p, V2.add(a, V2.mul(ab, t))); }
const segFrom = (s, k) => (k === 0 ? s.start : s.segs[k - 1].p);
const asBez = (from, g) => (g.t === 'L' ? [from, from, g.p, g.p] : [from, g.c1, g.c2, g.p]);
// A curve whose handles lie on its chord draws a straight line.
const isStraight = (from, g, eps = 0.05) => g.t === 'L' || (distToLine(g.c1, from, g.p) < eps && distToLine(g.c2, from, g.p) < eps);
// Unit tangent leaving / entering an anchor (falls back to the far control point when a handle is retracted).
function outTangent(from, g) { const b = asBez(from, g);
  for (const q of [b[1], b[2], b[3]]) if (V2.dist(q, from) > 1e-6) return V2.norm(V2.sub(q, from)); return { x: 0, y: 0 }; }
function inTangent(from, g) { const b = asBez(from, g);
  for (const q of [b[2], b[1], b[0]]) if (V2.dist(q, b[3]) > 1e-6) return V2.norm(V2.sub(b[3], q)); return { x: 0, y: 0 }; }

// Dense outline of one subpath (step ≈ `step` px) — used for fitting and for the fidelity check.
function sampleSub(s, step = 0.25) {
  const pts = [{ ...s.start }], at = [0];
  s.segs.forEach((g, k) => { const b = asBez(segFrom(s, k), g);
    const L = V2.dist(b[0], b[1]) + V2.dist(b[1], b[2]) + V2.dist(b[2], b[3]);
    const n = Math.max(2, Math.min(400, Math.ceil(L / step)));
    for (let j = 1; j <= n; j++) pts.push(bez(b, j / n));
    at.push(pts.length - 1); });
  return { pts, at }; // at[k] = sample index of anchor k
}

// ---------------------------------------------------------------- analysis (cheap, for audits)
// removable: anchors on a straight line between their neighbours, or duplicates · polyline: a curve drawn as ≥ 5 short straight
// pieces turning the same way (the usual waste — a circle or wave computed point by point).
function analyzeAnchors(d, tol = 0.5) {
  const subs = parsePath(d);
  let anchors = 0, removable = 0, polylineRuns = 0, polylineAnchors = 0;
  for (const s of subs) {
    anchors += subAnchors(s);
    const n = s.segs.length; if (n < 2) continue;
    const xs = [s.start.x, ...s.segs.map((g) => g.p.x)], ys = [s.start.y, ...s.segs.map((g) => g.p.y)];
    const diag = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
    const turns = []; let keep = s.start;
    for (let k = 0; k < n; k++) { // vertex between seg k and seg k+1
      const next = k + 1 < n ? k + 1 : (s.closed ? 0 : -1); if (next < 0) break;
      const a = segFrom(s, k), g1 = s.segs[k], v = g1.p, g2 = s.segs[next];
      if (V2.dist(a, v) < 0.05) { removable++; turns.push(null); continue; }
      const st = isStraight(a, g1) && isStraight(v, g2);
      // greedy along straight runs: the anchor goes when it sits within tol of the line from the last KEPT anchor to the next one
      if (st && distToLine(v, keep, g2.p) <= tol && V2.dot(V2.sub(v, keep), V2.sub(g2.p, v)) > 0) removable++; else keep = v;
      if (st && V2.dist(a, v) < 0.15 * diag && V2.dist(v, g2.p) < 0.15 * diag) {
        const t1 = V2.norm(V2.sub(v, a)), t2 = V2.norm(V2.sub(g2.p, v));
        const ang = Math.atan2(t1.x * t2.y - t1.y * t2.x, V2.dot(t1, t2)) * 180 / Math.PI;
        turns.push(Math.abs(ang) > 2 && Math.abs(ang) < 40 ? Math.sign(ang) : null);
      } else turns.push(null);
    }
    let run = 0, sign = 0; const flush = () => { if (run >= 4) { polylineRuns++; polylineAnchors += run; } run = 0; };
    for (const t of turns) { if (t !== null && (run === 0 || t === sign)) { sign = t; run++; } else { flush(); if (t !== null) { sign = t; run = 1; } } }
    flush();
  }
  return { anchors, removable, polylineRuns, polylineAnchors };
}

// ---------------------------------------------------------------- Schneider curve fit
function fitCubic(P, first, last, t1, t2, err2, out, depth) {
  const p0 = P[first], p3 = P[last];
  if (last - first === 1 || depth > 14) { const dd = V2.dist(p0, p3) / 3; out.push([p0, V2.add(p0, V2.mul(t1, dd)), V2.add(p3, V2.mul(t2, dd)), p3]); return; }
  let u = [0]; for (let i = first + 1; i <= last; i++) u.push(u[u.length - 1] + V2.dist(P[i], P[i - 1]));
  const tot = u[u.length - 1] || 1; u = u.map((x) => x / tot);
  const gen = (uu) => { let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0;
    for (let i = 0; i < uu.length; i++) { const t = uu[i], m = 1 - t;
      const b0 = m * m * m, b1 = 3 * m * m * t, b2 = 3 * m * t * t, b3 = t * t * t;
      const a1 = V2.mul(t1, b1), a2 = V2.mul(t2, b2);
      c00 += V2.dot(a1, a1); c01 += V2.dot(a1, a2); c11 += V2.dot(a2, a2);
      const tmp = V2.sub(P[first + i], V2.add(V2.mul(p0, b0 + b1), V2.mul(p3, b2 + b3)));
      x0 += V2.dot(a1, tmp); x1 += V2.dot(a2, tmp); }
    const det = c00 * c11 - c01 * c01, seg = V2.dist(p0, p3), eps = 1e-6 * seg;
    let al = det === 0 ? 0 : (x0 * c11 - x1 * c01) / det, ar = det === 0 ? 0 : (c00 * x1 - c01 * x0) / det;
    if (al < eps || ar < eps) al = ar = seg / 3;
    return [p0, V2.add(p0, V2.mul(t1, al)), V2.add(p3, V2.mul(t2, ar)), p3]; };
  const maxErr = (b, uu) => { let m = 0, at = Math.floor((last - first + 1) / 2) + first;
    for (let i = 1; i < uu.length - 1; i++) { const dd = V2.sub(bez(b, uu[i]), P[first + i]); const e = V2.dot(dd, dd); if (e >= m) { m = e; at = first + i; } }
    return [m, at]; };
  let b = gen(u), [e, split] = maxErr(b, u);
  if (e < err2) { out.push(b); return; }
  if (e < err2 * 16) for (let it = 0; it < 20; it++) {
    u = u.map((t, i) => { const q = bez(b, t), q1 = bezD1(b, t), q2 = bezD2(b, t), dd = V2.sub(q, P[first + i]);
      const den = V2.dot(q1, q1) + V2.dot(dd, q2); return den === 0 ? t : Math.min(1, Math.max(0, t - V2.dot(dd, q1) / den)); });
    b = gen(u); [e, split] = maxErr(b, u); if (e < err2) { out.push(b); return; } }
  split = Math.min(last - 1, Math.max(first + 1, split));
  const tc = V2.norm(V2.sub(P[split - 1], P[split + 1]));
  fitCubic(P, first, split, t1, tc, err2, out, depth + 1);
  fitCubic(P, split, last, V2.mul(tc, -1), t2, err2, out, depth + 1);
}

// ---------------------------------------------------------------- simplify one path, fidelity-checked
// cap (optional): the caller only needs to know whether the deviation stays within cap — segments are put in a grid of cap-sized
// cells and each sample looks only at its 3 × 3 cells (exact up to cap; anything farther returns > cap). Without a cap every sample
// is compared with every segment, which on a long traced outline (10 000+ samples) took most of a minute per part.
function maxDeviation(a, b, cap) { // symmetric: farthest sample of each outline from the other outline (px)
  const brute = (P, Q) => { let m = 0; for (const p of P) { let best = Infinity;
    for (let j = 1; j < Q.length && best > m; j++) best = Math.min(best, distToSeg(p, Q[j - 1], Q[j]));
    if (best > m) m = best; } return m; };
  const gridded = (P, Q) => {
    const c = cap, cells = new Map(), key = (i, j) => i * 73856093 ^ j * 19349663;
    for (let j = 1; j < Q.length; j++) { const p = Q[j - 1], q = Q[j];
      const i0 = Math.floor(Math.min(p.x, q.x) / c), i1 = Math.floor(Math.max(p.x, q.x) / c), j0 = Math.floor(Math.min(p.y, q.y) / c), j1 = Math.floor(Math.max(p.y, q.y) / c);
      for (let ii = i0; ii <= i1; ii++) for (let jj = j0; jj <= j1; jj++) { const k = key(ii, jj); let l = cells.get(k); if (!l) cells.set(k, l = []); l.push(j); } }
    let m = 0;
    for (const p of P) { const ci = Math.floor(p.x / c), cj = Math.floor(p.y / c); let best = Infinity;
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const l = cells.get(key(ci + di, cj + dj)); if (!l) continue;
        for (const j of l) { const d = distToSeg(p, Q[j - 1], Q[j]); if (d < best) best = d; } }
      if (best > c) return Infinity;  // farther than cap: the answer is already "no"
      if (best > m) m = best; }
    return m; };
  const one = cap > 0 ? gridded : brute;
  return Math.max(one(a, b), one(b, a));
}

function simplifySub(s, tol, cornerDeg, err) {
  const n = s.segs.length; if (n < 2) return s;
  const { pts, at } = sampleSub(s, Math.max(0.1, tol / 2));
  const cosMax = Math.cos(cornerDeg * Math.PI / 180);
  // corner flags per anchor (open path ends are corners)
  const isCorner = [], tin = [], tout = [];
  for (let k = 0; k <= n; k++) {
    const hasIn = k > 0 || s.closed, hasOut = k < n || s.closed;
    const ki = k > 0 ? k - 1 : n - 1, ko = k < n ? k : 0;
    tin[k] = hasIn ? inTangent(segFrom(s, ki), s.segs[ki]) : null;
    tout[k] = hasOut ? outTangent(segFrom(s, ko), s.segs[ko]) : null;
    isCorner[k] = !(tin[k] && tout[k]) || V2.dot(tin[k], tout[k]) < cosMax;
  }
  if (s.closed) isCorner[n] = isCorner[0];
  let cuts = []; for (let k = 0; k <= n; k++) if (isCorner[k]) cuts.push(k);
  let P = pts, A = at, segsOut = [];
  if (s.closed && cuts.length === 0) cuts = [0, n];                     // smooth loop: cut at its start
  else if (s.closed) { // rotate so the loop starts at a corner
    const r = cuts[0], rp = pts.slice(at[r], pts.length - 1).concat(pts.slice(0, at[r] + 1));
    const shift = (i) => (i >= at[r] ? i - at[r] : i + (pts.length - 1 - at[r]));
    A = []; for (let k = 0; k <= n; k++) A[k] = shift(at[(k + r) % n]); A[n] = rp.length - 1;
    const c2 = []; for (let k = 0; k <= n; k++) if (isCorner[(k + r) % n]) c2.push(k); if (c2[c2.length - 1] !== n) c2.push(n);
    P = rp; cuts = c2;
    const ti = tin.slice(), to = tout.slice(); for (let k = 0; k <= n; k++) { tin[k] = ti[(k + r) % n]; tout[k] = to[(k + r) % n]; }
  }
  for (let c = 0; c + 1 < cuts.length; c++) {
    const f = A[cuts[c]], l = A[cuts[c + 1]];
    let straight = true; for (let i = f + 1; i < l && straight; i++) if (distToLine(P[i], P[f], P[l]) > tol * 0.5) straight = false;
    if (straight) { segsOut.push({ t: 'L', p: { ...P[l] } }); continue; }
    const out = []; fitCubic(P, f, l, tout[cuts[c]] || V2.norm(V2.sub(P[f + 1], P[f])), V2.mul(tin[cuts[c + 1]] || V2.norm(V2.sub(P[l], P[l - 1])), -1), err * err, out, 0);
    for (const b of out) segsOut.push(isStraight(b[0], { t: 'C', c1: b[1], c2: b[2], p: b[3] }) ? { t: 'L', p: b[3] } : { t: 'C', c1: b[1], c2: b[2], p: b[3] });
  }
  return { start: { ...P[0] }, segs: segsOut, closed: s.closed };
}

// d → { d, before, after, maxDev, changed }. tol = allowed deviation in px (0.5 at 1×; use 0.25 for icons ≤ 24 px).
// cornerDeg = tangent break that counts as a corner (kept as an anchor).
function simplifyPath(d, { tol = 0.5, cornerDeg = 25 } = {}) {
  const subs = parsePath(d), before = countAnchors(d);
  let maxDev = 0; const outSubs = [];
  for (const s of subs) {
    const orig = sampleSub(s, 0.25).pts; let best = s;
    for (const err of [tol * 0.8, tol * 0.5, tol * 0.25, tol * 0.1]) { // tighter fits until the outline matches
      const cand = simplifySub(s, tol, cornerDeg, err);
      if (subAnchors(cand) >= subAnchors(s)) break;
      const dev = maxDeviation(orig, sampleSub(cand, 0.25).pts, tol);
      if (dev <= tol) { best = cand; maxDev = Math.max(maxDev, dev); break; }
    }
    outSubs.push(best);
  }
  const out = pathToD(outSubs), after = countAnchors(out);
  return after < before ? { d: out, before, after, maxDev: Math.round(maxDev * 1000) / 1000, changed: true }
                        : { d, before, after: before, maxDev: 0, changed: false };
}

// ---------------------------------------------------------------- fit a TRACED outline (pixel stairs → long smooth curves)
// simplifyPath above keeps a path faithful to itself — right for a designer's drawing, wrong for an outline traced from pixels: there
// every step of the staircase turns by 45–90°, so every vertex counts as a corner, nothing is left to fit between corners and the
// result stays a run of 1–3 px straight pieces (a test: hair 549 anchors, 89 % short straight segments, teeth all along the edge).
// fitOutline reads the outline at the size of a few ORIGINAL pixels instead:
//   1. resample evenly, smooth lightly (σ ≈ 0.6 original px) — the stairs go, the shape stays;
//   2. corners = turns of > cornerDeg measured over ±2.5 original px (a real corner turns over that distance, a stair does not), the
//      sharpest one in its neighbourhood; corner points are pinned, the runs between them are smoothed on their own;
//   3. each run between corners → as few cubic Béziers as `err` allows (Schneider), joined smoothly (shared tangent = collinear handles);
//      a run that is straight within ¼ px → one line;
//   4. fidelity: the result must stay within `tol` of the RAW outline (stairs included, default 1 original px) — else tighter, else
//      simplifyPath's result.
// unit = size of one original pixel in the path's coordinates (crop px × srcPx). Works on any closed path data: traced loops, or a
// typed / pasted polyline that should have been curves.
function fitOutline(d, { unit = 1, tol, cornerDeg = 40 } = {}) {
  const subs = parsePath(d), before = countAnchors(d), maxTol = tol || unit;
  const outSubs = []; let maxDev = 0;
  for (const s of subs) {
    if (!s.closed || s.segs.length < 6) { outSubs.push(s); continue; }
    const raw = sampleSub(s, 0.25 * unit).pts;
    let best = null;
    for (const [sig, err] of [[1.0, 0.5], [0.7, 0.35], [0.45, 0.25]]) {
      const plain = fitLoop(raw, unit, sig, err, cornerDeg);
      if (!plain) continue;
      // first with the soft kinks straightened (handles collinear), else as fitted — whichever stays within tol of the raw outline
      for (const cand of [smoothFalseCorners(JSON.parse(JSON.stringify(plain)), cornerDeg), plain]) {
        const dev = maxDeviation(raw, sampleSub(cand, 0.25 * unit).pts, maxTol);
        if (dev <= maxTol) { best = cand; maxDev = Math.max(maxDev, dev); break; }
      }
      if (best) break;
    }
    if (!best) { const r = simplifyPath(pathToD([s]), { tol: 0.75 * unit }); best = parsePath(r.d)[0]; maxDev = Math.max(maxDev, r.maxDev); }
    outSubs.push(subAnchors(best) < subAnchors(s) ? best : s);
  }
  const out = pathToD(outSubs), after = countAnchors(out);
  return { d: out, before, after, maxDev: Math.round(maxDev * 1000) / 1000, changed: out !== d };
}

function fitLoop(raw, unit, sig, err, cornerDeg) {
  // evenly spaced points (h ≈ ¼ original px) on the closed outline
  let pts = raw.slice(0, -1); if (pts.length < 8) return null;
  const h = 0.25 * unit, even = [pts[0]]; let carry = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], L = V2.dist(a, b);
    let t = h - carry; while (t <= L) { even.push(V2.add(a, V2.mul(V2.sub(b, a), t / L))); t += h; } carry = L - (t - h); }
  pts = even.length > 8 ? even.slice(0, -1) : pts; const n = pts.length;
  const at = (i) => pts[((i % n) + n) % n];
  const gauss = (P, s, closedIdx) => { // closed-loop Gaussian smoothing, σ in points
    if (s <= 0) return P.slice(); const r = Math.ceil(3 * s), w = []; let ws = 0;
    for (let k = -r; k <= r; k++) { const v = Math.exp(-(k * k) / (2 * s * s)); w.push(v); ws += v; }
    return P.map((_, i) => { let x = 0, y = 0; for (let k = -r; k <= r; k++) { const q = closedIdx(i + k); x += q.x * w[k + r]; y += q.y * w[k + r]; } return { x: x / ws, y: y / ws }; }); };
  // corners on a lightly smoothed copy, turn measured over ±2.5 original px
  const light = gauss(pts, (0.35 * unit) / h, at), la = (i) => light[((i % n) + n) % n];
  const K = Math.max(2, Math.round((2.5 * unit) / h)), turn = new Float32Array(n);
  for (let i = 0; i < n; i++) { const u = V2.norm(V2.sub(la(i), la(i - K))), v = V2.norm(V2.sub(la(i + K), la(i)));
    turn[i] = Math.acos(Math.max(-1, Math.min(1, V2.dot(u, v)))) * 180 / Math.PI; }
  const corners = [];
  // the sharpest point of its ±K neighbourhood (ties: the first one)
  for (let i = 0; i < n; i++) { if (turn[i] < cornerDeg) continue; let peak = true;
    for (let k = 1; k <= K && peak; k++) { if (turn[(i + k) % n] > turn[i] || turn[(i - k + n) % n] >= turn[i]) peak = false; }
    if (peak) corners.push(i); }
  const segsOut = [];
  const fitRun = (run, t0, t1) => { // run = points from one anchor to the next (inclusive)
    const f = run[0], l = run[run.length - 1];
    if (run.every((p) => distToLine(p, f, l) <= 0.4 * unit)) { segsOut.push({ t: 'L', p: { ...l } }); return; }
    const out = []; fitCubic(run, 0, run.length - 1, t0, t1, (err * unit) * (err * unit), out, 0);
    for (const b of out) segsOut.push(isStraight(b[0], { t: 'C', c1: b[1], c2: b[2], p: b[3] }, 0.3 * unit) ? { t: 'L', p: b[3] } : { t: 'C', c1: b[1], c2: b[2], p: b[3] }); };
  const sP = (sig * unit) / h;
  if (!corners.length) { // smooth loop: one run from a point back to itself, same tangent both ways (no kink at the seam)
    const sm = gauss(pts, sP, at), run = sm.concat([sm[0]]);
    const tc = V2.norm(V2.sub(sm[1], sm[n - 1]));
    fitRun(run, tc, V2.mul(tc, -1));
    return { start: { ...sm[0] }, segs: segsOut, closed: true };
  }
  // smooth each run between corners on its own (corners pinned), then fit it
  let start = null;
  for (let c = 0; c < corners.length; c++) {
    const i0 = corners[c], i1 = c + 1 < corners.length ? corners[c + 1] : corners[0] + n;
    const run = []; for (let i = i0; i <= i1; i++) run.push(at(i));
    if (run.length < 3) { segsOut.push({ t: 'L', p: { ...run[run.length - 1] } }); if (!start) start = run[0]; continue; }
    const m = run.length, ra = (i) => run[Math.max(0, Math.min(m - 1, i))];
    const sm = run.map((p, i) => { if (i === 0 || i === m - 1) return p; const r = Math.min(Math.ceil(3 * sP), i, m - 1 - i);
      let x = 0, y = 0, ws = 0; for (let k = -r; k <= r; k++) { const w = Math.exp(-(k * k) / (2 * sP * sP)), q = ra(i + k); x += q.x * w; y += q.y * w; ws += w; } return { x: x / ws, y: y / ws }; });
    if (!start) start = sm[0];
    const k = Math.min(m - 1, Math.max(1, Math.round(K / 2)));
    fitRun(sm, V2.norm(V2.sub(sm[k], sm[0])), V2.norm(V2.sub(sm[m - 1 - k], sm[m - 1])));
  }
  return { start: { ...start }, segs: segsOut, closed: true };
}

// A corner kept by the detector whose two sides leave it < cornerDeg apart is not a corner the eye sees, only a soft kink (the
// "gợn" between a curve and the line next to it): turn its handles onto one line. Curves turn toward the line's direction, two curves
// toward their average; a corner between two straight sides is left alone.
function smoothFalseCorners(s, cornerDeg) {
  const n = s.segs.length, from = (k) => (k === 0 ? s.start : s.segs[k - 1].p), cosMax = Math.cos(cornerDeg * Math.PI / 180);
  for (let k = 0; k < n; k++) {
    const g1 = s.segs[k], g2 = s.segs[(k + 1) % n]; if (!s.closed && k === n - 1) break;
    if (g1.t === 'L' && g2.t === 'L') continue;
    const v = g1.p, a = from(k);
    const tin = V2.norm(g1.t === 'C' ? V2.sub(v, g1.c2) : V2.sub(v, a)), tout = V2.norm(g2.t === 'C' ? V2.sub(g2.c1, v) : V2.sub(g2.p, v));
    if (V2.len(tin) < 0.5 || V2.len(tout) < 0.5 || V2.dot(tin, tout) < cosMax || V2.dot(tin, tout) > 0.9995) continue;
    const dir = g1.t === 'L' ? tin : g2.t === 'L' ? tout : V2.norm(V2.add(tin, tout));
    if (g1.t === 'C') g1.c2 = V2.sub(v, V2.mul(dir, V2.dist(v, g1.c2)));
    if (g2.t === 'C') g2.c1 = V2.add(v, V2.mul(dir, V2.dist(g2.c1, v)));
  }
  return s;
}

// ---------------------------------------------------------------- Figma helpers
// Every VECTOR under `root` (or root itself): anchors now, anchors after a fidelity-checked simplify, and the waste signals.
// Sorted by anchors that could go. Read-only.
function anchorReport(root, { tol = 0.5 } = {}) {
  const nodes = root.type === 'VECTOR' ? [root] : root.findAll((n) => n.type === 'VECTOR');
  return nodes.map((n) => {
    let anchors = 0, couldBe = 0, removable = 0, polyline = 0, maxDev = 0;
    for (const p of n.vectorPaths) { const a = analyzeAnchors(p.data, tol); anchors += a.anchors; removable += a.removable; polyline += a.polylineRuns;
      const s = a.anchors > 3000 ? { after: a.anchors, maxDev: 0 } : simplifyPath(p.data, { tol }); couldBe += s.after; maxDev = Math.max(maxDev, s.maxDev); }
    return { id: n.id, name: n.name, anchors, couldBe, removable, polylineRuns: polyline, maxDev };
  }).sort((a, b) => (b.anchors - b.couldBe) - (a.anchors - a.couldBe));
}

// Rewrite a VECTOR's paths with the simplified ones (winding rules kept). Run on a copy of the designer's art.
// Returns before / after / max deviation and the bounds drift so the report can say what changed.
function optimizeAnchors(node, { tol = 0.5, cornerDeg = 25 } = {}) {
  if (node.type !== 'VECTOR') return { id: node.id, skipped: `${node.type} — primitives and booleans: optimise their child vectors` };
  const box0 = node.absoluteBoundingBox; let before = 0, after = 0, maxDev = 0;
  const paths = node.vectorPaths.map((p) => { const r = simplifyPath(p.data, { tol, cornerDeg });
    before += r.before; after += r.after; maxDev = Math.max(maxDev, r.maxDev); return { windingRule: p.windingRule, data: r.d }; });
  if (after < before) node.vectorPaths = paths;
  const box1 = node.absoluteBoundingBox;
  const drift = box0 && box1 ? Math.max(Math.abs(box0.x - box1.x), Math.abs(box0.y - box1.y), Math.abs(box0.width - box1.width), Math.abs(box0.height - box1.height)) : 0;
  return { id: node.id, name: node.name, before, after, maxDev, boundsDrift: Math.round(drift * 100) / 100 };
}

// True bounds of path data (the curve itself, not its handles) — Figma places a vector by these, so a position computed from the
// handles lands the part off by the handle overhang (a test: up to 13.8 px).
function pathBounds(d) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of parsePath(d)) for (const p of sampleSub(s, 0.5).pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  return { x0, y0, x1, y1 };
}

if (typeof module !== 'undefined') module.exports = { parsePath, pathToD, countAnchors, analyzeAnchors, simplifyPath, fitOutline, pathBounds, maxDeviation, sampleSub, anchorReport, optimizeAnchors };
