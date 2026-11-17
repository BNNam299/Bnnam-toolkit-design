#!/usr/bin/env node
// figma-motion.cjs — figma-vector-motion: the keyframes the designer approved in Figma (Figma Motion) → motion.json for lottie-build.
//
//   node figma-motion.cjs --rig rig.json --out motion.json [--loop] [--fps 60] [--duration 2] [--tracks motion-read.json]
//
// rig.json comes from export_rig (each animated node carries motion = { origin, tracks, styles }). When the figma-agent plugin cannot
// read Motion (export_rig says motionApi: unavailable), run scripts/figma-read-motion.js through the official Figma MCP (use_figma),
// save its result and pass it with --tracks: it fills the same fields by node id.
//
// What changes on the way (measured on Figma, 11/2026):
// - Figma puts the ease on the key it ARRIVES at; Lottie / motion.json on the key the segment LEAVES → shifted one key back.
// - ROTATION + = counter-clockwise in Figma, + = clockwise in Lottie → sign flipped.
// - TRANSLATION_* px offsets → move [dx, dy]; SCALE_* multipliers → scale % (×100); OPACITY absolute 0..1 → % of the part's own
//   opacity; PATH_TRIM_START / END 0..1 → trim [start %, end %]; fills[0] COLOR → color hex (solid fills only).
// - Springs (GENTLE, QUICK, BOUNCY, SLOW, CUSTOM_SPRING) have no Lottie form. Figma's spring depends on bounce only, stretched over
//   the segment: p(u) = 1 − e^(−a·u)·(cos ωu + (a/ω)·sin ωu), ζ = 1 − bounce, ω = (a/ζ)·√(1 − ζ²), a measured per bounce (table
//   below). It turns into keys at the swing peaks (velocity 0 there) with a fitted cubic per piece — few keys, error reported.
// - Channels Figma keeps apart (TRANSLATION_X and _Y, SCALE_X and _Y, trim start and end) with different times or eases are
//   sampled every 2 frames with linear eases (exact, more keys) — the report says where.
// - Other fields (size, corner radius, stroke weight, layout, effects) and animation styles are not converted — warned.
'use strict';
const fs = require('fs');

function args() {
  const a = {}; const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) if (v[i].startsWith('--')) { const k = v[i].slice(2); a[k] = v[i + 1] && !v[i + 1].startsWith('--') ? v[++i] : true; }
  return a;
}
const r3 = (x) => Math.round(x * 1000) / 1000 || 0; // no -0

// ---------------------------------------------------------------- springs
// decay a (= ζ·ω0, segment time normalised to 0..1) measured from Figma's own export for these bounces
const SPRING_A = [[0, 11.1803], [0.25, 7.6657], [0.3, 7.591], [0.4226, 7.4426], [0.6938, 7.1866]];
function springA(b) {
  const t = SPRING_A;
  if (b <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) if (b <= t[i][0]) { const [b0, a0] = t[i - 1], [b1, a1] = t[i]; return a0 + (a1 - a0) * (b - b0) / (b1 - b0); }
  const [b0, a0] = t[t.length - 2], [b1, a1] = t[t.length - 1];
  return a1 + (a1 - a0) * (b - b1) / (b1 - b0);
}
// progress 0..1 (overshoots when bounce > 0) at normalised time u of a spring segment
function springCurve(bounce) {
  const b = Math.max(0, Math.min(0.95, bounce || 0)), a = springA(b), z = 1 - b;
  if (b < 1e-3) return { p: (u) => 1 - Math.exp(-a * u) * (1 + a * u), peaks: [], a, w: 0 };
  const w = (a / z) * Math.sqrt(1 - z * z), c = a / w;
  const peaks = []; for (let k = 1; k * Math.PI / w < 1; k++) peaks.push(k * Math.PI / w);
  return { p: (u) => 1 - Math.exp(-a * u) * (Math.cos(w * u) + c * Math.sin(w * u)), peaks, a, w };
}
// y at x of a CSS-style cubic [x1, y1, x2, y2]
function bezierAt(e, x) {
  const [x1, y1, x2, y2] = e;
  const bx = (t) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 30; i++) { t = (lo + hi) / 2; if (bx(t) < x) lo = t; else hi = t; }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
}
// best [x1, 0, x2, 1] (zero speed at both ends, as at a spring's peaks) for samples ys of a piece normalised to 0..1
function fitEase(ys) {
  let best = null;
  const err = (e) => { let m = 0; for (let i = 1; i < ys.length - 1; i++) m = Math.max(m, Math.abs(bezierAt(e, i / (ys.length - 1)) - ys[i])); return m; };
  for (let x1 = 0; x1 <= 1.0001; x1 += 0.05) for (let x2 = 0; x2 <= 1.0001; x2 += 0.05) {
    const e = [r3(x1), 0, r3(x2), 1], m = err(e); if (!best || m < best.m) best = { e, m };
  }
  const [bx1, , bx2] = best.e;
  for (let x1 = Math.max(0, bx1 - 0.05); x1 <= Math.min(1, bx1 + 0.05); x1 += 0.01) for (let x2 = Math.max(0, bx2 - 0.05); x2 <= Math.min(1, bx2 + 0.05); x2 += 0.01) {
    const e = [r3(x1), 0, r3(x2), 1], m = err(e); if (m < best.m) best = { e, m };
  }
  return best;
}
// a spring segment (t0 → t1, from v0 to v1) → keys [[t, v, easeLeaving]] (last key's ease left for the caller) + worst error as a
// share of the travel. Pieces run peak to peak (speed 0 at both ends); each piece gets the better of a fitted [x1,0,x2,1] and a
// Hermite cubic from the curve's real slopes, and is halved until it is within 0.5 % of the travel (max 4 halvings).
function springKeys(t0, t1, v0, v1, bounce, lerp, fps = 60) {
  const s = springCurve(bounce);
  const settle = 0.004; // stop placing peaks once the swing is under 0.4 % of the travel
  const P = (u) => (u >= 1 ? 1 : s.p(u));
  const slope = (u) => { const h = 1e-4; return (s.p(Math.min(1, u + h)) - s.p(Math.max(0, u - h))) / (Math.min(1, u + h) - Math.max(0, u - h)); };
  const pieceFit = (ua, ub) => {
    const pa = P(ua), pb = P(ub), d = pb - pa, N = 24, ys = [];
    for (let j = 0; j <= N; j++) ys.push(Math.abs(d) < 1e-9 ? j / N : (P(ua + (ub - ua) * j / N) - pa) / d);
    const errOf = (e) => { let m = 0; for (let j = 1; j < N; j++) m = Math.max(m, Math.abs(bezierAt(e, j / N) - ys[j])); return m; };
    const k = Math.abs(d) < 1e-9 ? 0 : (ub - ua) / d;
    const herm = [1 / 3, r3((slope(ua) * k) / 3), 2 / 3, r3(1 - (slope(ub) * k) / 3)].map(r3);
    const fit = fitEase(ys);
    const hErr = errOf(herm);
    return hErr < fit.m ? { e: herm, m: hErr * Math.abs(d) } : { e: fit.e, m: fit.m * Math.abs(d) };
  };
  const pieces = [];
  const place = (ua, ub, depth) => {
    const f = pieceFit(ua, ub);
    if (f.m > 0.005 && depth < 4) { const um = (ua + ub) / 2; place(ua, um, depth + 1); place(um, ub, depth + 1); }
    else pieces.push({ ua, e: f.e, m: f.m });
  };
  const us = [0, ...s.peaks.filter((u) => Math.abs(1 - s.p(u)) > settle)];
  if (us[us.length - 1] < 1) us.push(1);
  for (let i = 0; i < us.length - 1; i++) place(us[i], us[i + 1], 0);
  // a piece shorter than 2 frames buys nothing (the player draws whole frames): key every frame, linear — exact where it is drawn
  const frames = (t1 - t0) * fps;
  if (pieces.some((p, i) => ((pieces[i + 1]?.ua ?? 1) - p.ua) * frames < 2)) {
    const n = Math.max(1, Math.round(frames)), keys = [];
    for (let i = 0; i < n; i++) keys.push([t0 + (t1 - t0) * i / n, lerp(v0, v1, P(i / n)), 'linear']);
    return { keys, worst: 0, pieces: n, perFrame: true };
  }
  const keys = pieces.map((p) => [t0 + (t1 - t0) * p.ua, lerp(v0, v1, P(p.ua)), p.e]);
  return { keys, worst: Math.max(...pieces.map((p) => p.m)), pieces: pieces.length };
}

// ---------------------------------------------------------------- Figma tracks → channels
const PRESET = { LINEAR: 'linear', EASE_IN: [0.42, 0, 1, 1], EASE_OUT: [0, 0, 0.58, 1], EASE_IN_AND_OUT: [0.42, 0, 0.58, 1],
  EASE_IN_BACK: [0.3, -0.05, 0.7, -0.5], EASE_OUT_BACK: [0.45, 1.45, 0.8, 1], EASE_IN_AND_OUT_BACK: [0.7, -0.4, 0.4, 1.4] };
const SPRING_PRESET = { GENTLE: 0.25, QUICK: 0.4226, BOUNCY: 0.6938, SLOW: 0 };
// Figma easing object → { kind: 'bezier', e } | { kind: 'hold' } | { kind: 'linear' } | { kind: 'spring', bounce }
function easeFrom(easing, warn, where) {
  if (!easing) return { kind: 'linear' };
  const t = easing.type;
  if (t === 'HOLD') return { kind: 'hold' };
  if (t === 'LINEAR') return { kind: 'linear' };
  if (easing.easingFunctionSpring || SPRING_PRESET[t] !== undefined || t === 'CUSTOM_SPRING') {
    const b = easing.easingFunctionSpring?.bounce ?? SPRING_PRESET[t] ?? 0;
    return { kind: 'spring', bounce: b };
  }
  const c = easing.easingFunctionCubicBezier;
  if (c) return { kind: 'bezier', e: [c.x1, c.y1, c.x2, c.y2].map(r3) };
  if (PRESET[t]) return PRESET[t] === 'linear' ? { kind: 'linear' } : { kind: 'bezier', e: PRESET[t] };
  warn(`${where}: easing ${t} not known — linear`); return { kind: 'linear' };
}
// one Figma track → [{ t, v, ease }] where ease is the ease ARRIVING at this key (Figma's way)
function figmaKeys(track, map, warn, where) {
  const ks = [...(track.keyframes || [])].sort((a, b) => a.timelinePosition - b.timelinePosition);
  return ks.map((k, i) => ({ t: k.timelinePosition, v: map(k.value?.value), ease: i === 0 ? null : easeFrom(k.easing, warn, where) }));
}
const lerpV = (a, b, p) => Array.isArray(a) ? a.map((x, i) => r3(x + (b[i] - x) * p)) : r3(a + (b - a) * p);
// value of a Figma-keyed channel at time t
function valueAt(ks, t) {
  if (t <= ks[0].t) return ks[0].v;
  for (let i = 1; i < ks.length; i++) if (t <= ks[i].t) {
    const a = ks[i - 1], b = ks[i], u = (t - a.t) / (b.t - a.t || 1), e = b.ease;
    const p = e.kind === 'hold' ? (u >= 1 ? 1 : 0) : e.kind === 'linear' ? u : e.kind === 'spring' ? springCurve(e.bounce).p(u) : bezierAt(e.e, u);
    return lerpV(a.v, b.v, p);
  }
  return ks[ks.length - 1].v;
}
// Figma keys (ease arriving) → motion.json keys (ease leaving); springs expanded
function toMotionKeys(ks, note, where, fps = 60) {
  const out = [];
  for (let i = 0; i < ks.length; i++) {
    const k = ks[i], next = ks[i + 1];
    if (!next) { out.push([r3(k.t), k.v]); break; }
    const e = next.ease;
    if (e.kind === 'spring') {
      const s = springKeys(k.t, next.t, k.v, next.v, e.bounce, lerpV, fps);
      s.keys.forEach((x) => out.push([r3(x[0]), x[1], x[2]]));
      note(`${where}: spring (bounce ${r3(e.bounce)}) ${r3(k.t)}–${r3(next.t)} s → ${s.perFrame ? `a key every frame (${s.pieces}) — too short for fitted pieces` : `${s.pieces} piece(s), worst error ${r3(s.worst * 100)} % of the travel`}`);
    } else out.push([r3(k.t), k.v, e.kind === 'bezier' ? e.e : e.kind]);
  }
  return out;
}
const sameTiming = (lists) => lists.every((l) => l.length === lists[0].length && l.every((k, i) => Math.abs(k.t - lists[0][i].t) < 1e-6 && JSON.stringify(k.ease) === JSON.stringify(lists[0][i].ease)));
// several Figma channels (X, Y …) → one motion.json key list of combined values
function combine(lists, defaults, fps, note, where) {
  const present = lists.map((l, i) => l || [{ t: 0, v: defaults[i], ease: null }]);
  const real = lists.filter(Boolean);
  if (real.length === 1 || sameTiming(real)) {
    const base = real.length === 1 ? real[0] : real[0];
    const merged = base.map((k) => ({ t: k.t, ease: k.ease, v: present.map((l) => valueAt(l, k.t)) }));
    return toMotionKeys(merged, note, where, fps);
  }
  // different times / eases per channel → sample every 2 frames, linear
  const t0 = Math.min(...real.map((l) => l[0].t)), t1 = Math.max(...real.map((l) => l[l.length - 1].t));
  const step = 2 / fps, out = [];
  for (let t = t0; t < t1 - 1e-9; t += step) out.push([r3(t), present.map((l) => valueAt(l, t)), 'linear']);
  out.push([r3(t1), present.map((l) => valueAt(l, t1))]);
  note(`${where}: channels keyed at different times / eases → sampled every 2 frames (${out.length} keys)`);
  return out;
}

const hex2 = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
const DONE = new Set(['ROTATION', 'TRANSLATION_X', 'TRANSLATION_Y', 'TRANSLATION_XY', 'SCALE_X', 'SCALE_Y', 'SCALE_XY', 'OPACITY', 'PATH_TRIM_START', 'PATH_TRIM_END', 'fills']);

// a rig node's Figma motion → a motion.json track
function trackFor(n, target, fps, warn, note) {
  const T = n.motion.tracks || {}; const tr = { target, pivot: n.motion.origin };
  const k = (name, map) => T[name] ? figmaKeys(T[name], map, warn, `${target} ${name}`) : null;
  const num = (v) => Number(v);
  if (T.ROTATION) tr.rotate = toMotionKeys(k('ROTATION', (v) => -num(v)), note, `${target} rotate`, fps).map((x) => (x[1] = r3(x[1]), x));
  if (T.TRANSLATION_XY) tr.move = toMotionKeys(k('TRANSLATION_XY', (v) => [r3(v.x), r3(v.y)]), note, `${target} move`, fps);
  else if (T.TRANSLATION_X || T.TRANSLATION_Y) tr.move = combine([k('TRANSLATION_X', num), k('TRANSLATION_Y', num)], [0, 0], fps, note, `${target} move`);
  if (T.SCALE_XY) tr.scale = toMotionKeys(k('SCALE_XY', (v) => typeof v === 'number' ? [r3(v * 100), r3(v * 100)] : [r3(v.x * 100), r3(v.y * 100)]), note, `${target} scale`, fps);
  else if (T.SCALE_X || T.SCALE_Y) tr.scale = combine([k('SCALE_X', (v) => r3(v * 100)), k('SCALE_Y', (v) => r3(v * 100))], [100, 100], fps, note, `${target} scale`);
  if (T.OPACITY) {
    const own = n.opacity || 1;
    if (!n.opacity) warn(`${target}: opacity 0 at rest — opacity keys taken as absolute`);
    tr.opacity = toMotionKeys(k('OPACITY', (v) => r3((num(v) / own) * 100)), note, `${target} opacity`, fps);
  }
  if (T.PATH_TRIM_START || T.PATH_TRIM_END) tr.trim = combine([k('PATH_TRIM_START', (v) => r3(v * 100)), k('PATH_TRIM_END', (v) => r3(v * 100))], [0, 100], fps, note, `${target} trim`);
  if (T.fills) {
    const idx = Object.keys(T.fills);
    if (idx.some((i) => i !== '0')) warn(`${target}: colour keys on fill ${idx.join(', ')} — only the first fill's colour is converted`);
    if (T.fills['0']) {
      const ks = figmaKeys(T.fills['0'], (c) => (c && c.a < 1 ? (warn(`${target}: colour key with alpha ${r3(c.a)} — alpha dropped, animate opacity instead`), 0) : 0, `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`), warn, `${target} color`);
      if (ks.some((x) => x.ease && x.ease.kind === 'spring')) warn(`${target}: spring on a colour — taken as ease-out`);
      ks.forEach((x) => { if (x.ease && x.ease.kind === 'spring') x.ease = { kind: 'bezier', e: [0, 0, 0.58, 1] }; });
      tr.color = toMotionKeys(ks, note, `${target} color`, fps);
    }
  }
  for (const f of Object.keys(T)) if (!DONE.has(f)) warn(`${target}: ${f} keys not converted (no mobile-safe Lottie form) — remove in Figma or accept the static value`);
  return tr;
}

function convert(rig, opts = {}) {
  const warnings = [], notes = [];
  const warn = (s) => { if (!warnings.includes(s)) warnings.push(s); };
  const note = (s) => { if (!notes.includes(s)) notes.push(s); };
  const fps = Number(opts.fps) || 60;
  if (opts.read) { // fallback read from the official MCP: { timeline, nodes: { id: { tracks, origin, styles } } }
    const walk = (ns) => ns.forEach((n) => { const m = opts.read.nodes?.[n.id]; if (m) n.motion = m; if (n.children) walk(n.children); });
    walk(rig.children);
    if (opts.read.timeline && !rig.frame.timeline) rig.frame.timeline = opts.read.timeline;
  }
  const all = []; const paths = new Map();
  const walk = (ns, pre) => ns.forEach((n) => { const p = pre ? `${pre}/${n.name}` : n.name; paths.set(p, (paths.get(p) || 0) + 1); all.push([n, p]); if (n.children) walk(n.children, p); });
  walk(rig.children, '');
  const tracks = [];
  for (const [n, p] of all) {
    if (!n.motion) continue;
    if (n.motion.styles) warn(`${p}: Figma animation style — not converted (use manual keyframes)`);
    if (!n.motion.tracks || !Object.keys(n.motion.tracks).length) continue;
    tracks.push(trackFor(n, paths.get(p) > 1 ? `#${n.id}` : p, fps, warn, note));
  }
  if (!tracks.length) warn('no Figma keyframes found in this frame — nothing to convert');
  const ends = tracks.flatMap((t) => ['rotate', 'move', 'scale', 'opacity', 'color', 'trim'].flatMap((c) => (t[c] || []).map((k) => k[0])));
  const duration = Number(opts.duration) || rig.frame.timeline || Math.max(0.1, ...ends);
  const motion = { name: opts.name || rig.frame.name, fps, duration: r3(duration), loop: !!opts.loop, source: 'figma', tracks };
  if (opts.loop) for (const t of tracks) for (const c of ['rotate', 'move', 'scale', 'opacity', 'color', 'trim']) {
    const ks = t[c]; if (!ks) continue;
    if (JSON.stringify(ks[0][1]) !== JSON.stringify(ks[ks.length - 1][1])) warn(`${t.target} ${c}: loop — first and last value differ in Figma (the seam jumps); fix in Figma`);
    else if (Math.abs(ks[ks.length - 1][0] - duration) > 1 / fps && ks[ks.length - 1][0] < duration) ks.push([r3(duration), ks[ks.length - 1][1]]);
  }
  return { motion, warnings, notes };
}

if (require.main === module) {
  const a = args();
  if (!a.rig || !a.out) { console.error('usage: node figma-motion.cjs --rig rig.json --out motion.json [--loop] [--fps 60] [--duration s] [--tracks motion-read.json] [--name n]'); process.exit(2); }
  const rig = JSON.parse(fs.readFileSync(a.rig, 'utf8'));
  const read = a.tracks ? JSON.parse(fs.readFileSync(a.tracks, 'utf8')) : null;
  const { motion, warnings, notes } = convert(rig, { ...a, read });
  fs.writeFileSync(a.out, JSON.stringify(motion, null, 1));
  console.log(`wrote ${a.out} · ${motion.tracks.length} tracks · ${motion.duration} s @ ${motion.fps} fps · ${motion.loop ? 'loop' : 'once'}`);
  for (const s of notes) console.log(`· ${s}`);
  for (const w of warnings) console.log(`⚠ ${w}`);
}
module.exports = { convert, springCurve, springKeys, fitEase, bezierAt, easeFrom };
