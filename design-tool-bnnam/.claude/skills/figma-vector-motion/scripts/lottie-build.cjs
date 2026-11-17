#!/usr/bin/env node
// lottie-build.cjs — figma-vector-motion: a rig (export_rig) + a motion plan (motion.json, written by the agent) → Lottie JSON for
// lottie-ios / lottie-android (Bodymovin 5.7 shape layers, no expressions, no effects).
//
//   node lottie-build.cjs --rig rig.json --motion motion.json --out anim.json      (Lottie JSON)
//   node lottie-build.cjs --rig rig.json --motion motion.json --out anim.lottie    (dotLottie: the same JSON zipped, ~70-80 % smaller)
//
// Structure: every top-level part of the frame is one layer (named as in Figma, so the app can reach it by keypath); groups inside it
// are nested shape groups with their own transform (animatable); a Figma mask turns its group into a null layer + content layers and
// the masked run into a layer with a layer mask. Outlines stay in the frame's px — at rest every transform is identity, so the
// rest pose IS the Figma frame. Motion values are offsets from rest: rotate in degrees, move [dx, dy] px, scale % (100 = rest),
// opacity % of the part's own opacity, color a hex the solid fills turn to, trim [start%, end%] of a stroke's centre line.
//
// motion.json:
// { "fps": 60, "duration": 1.2, "loop": false,
//   "tracks": [ { "target": "Bell", "pivot": "Bell body@top",
//                 "rotate": [[0, 0, "out"], [0.18, -14, "inout"], [0.5, 9, "inout"], [0.8, 0]] } ] }
// A key is [seconds, value, ease] — ease shapes the segment that LEAVES the key: linear · hold · standard · out · in · inout · sine ·
// back · release · [x1, y1, x2, y2]. Optional "markers": [{ "name": "loading", "from": 0, "to": 1.2 }] — named segments the app plays
// (lottie-ios play(fromMarker:toMarker:), lottie-android setMinAndMaxFrame(name)): a loading loop and its success ending in one file. Target = a group path ("Bell/Clapper"), a part name, or "#<node id>"
// (figma-motion.cjs writes ids when two parts share a path). Pivot = [x, y] in frame px or
// "<node>@<center|top|bottom|left|right|top-left|top-right|bottom-left|bottom-right>"; default the target's own centre.
'use strict';
const fs = require('fs');

const EASE = {
  linear: [0.167, 0.167, 0.833, 0.833],          // Bodymovin's linear
  standard: [0.2, 0, 0, 1],                      // MD3 standard — the default
  out: [0.05, 0.7, 0.1, 1],                      // entering / landing (decelerate)
  in: [0.3, 0, 1, 1],                            // leaving (accelerate)
  inout: [0.42, 0, 0.58, 1],                     // on-screen move (UIKit easeInOut)
  sine: [0.37, 0, 0.63, 1],                      // ambient loops (sine in-out)
  back: [0.175, 0.885, 0.32, 1.275],             // ≈ 10 % overshoot
  release: [0.34, 1.56, 0.64, 1],                // press release pop
};

function args() {
  const a = {}; const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) if (v[i].startsWith('--')) { const k = v[i].slice(2); a[k] = v[i + 1] && !v[i + 1].startsWith('--') ? v[++i] : true; }
  return a;
}
const r3 = (x) => Math.round(x * 1000) / 1000;
const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255].map(r3); };
const stat = (k) => ({ a: 0, k });

// ---------------------------------------------------------------- paths: SVG (absolute M L Q C Z) → Lottie {c, v, i, o}
function toShapes(d) {
  const tok = d.match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
  const subs = []; let cur = null; let cmd = ''; let i = 0; let last = [0, 0];
  const num = () => Number(tok[i++]);
  const close = () => {
    if (!cur) return;
    const n = cur.v.length;
    // Figma closes with a segment back to the start: fold that duplicate vertex into the first one
    if (cur.c && n > 1) {
      const [x0, y0] = cur.v[0], [xn, yn] = cur.v[n - 1];
      if (Math.abs(x0 - xn) < 1e-3 && Math.abs(y0 - yn) < 1e-3) { cur.i[0] = cur.i[n - 1]; cur.v.pop(); cur.i.pop(); cur.o.pop(); }
    }
    if (cur.v.length) subs.push(cur);
    cur = null;
  };
  while (i < tok.length) {
    if (/[a-z]/i.test(tok[i])) cmd = tok[i++].toUpperCase();
    if (cmd === 'M') { close(); const p = [num(), num()]; cur = { c: false, v: [p], i: [[0, 0]], o: [[0, 0]] }; last = p; cmd = 'L'; continue; }
    if (cmd === 'Z') { if (cur) cur.c = true; close(); continue; }
    if (!cur) cur = { c: false, v: [last], i: [[0, 0]], o: [[0, 0]] };
    const n = cur.v.length - 1;
    if (cmd === 'L') { const p = [num(), num()]; cur.v.push(p); cur.i.push([0, 0]); cur.o.push([0, 0]); last = p; }
    else if (cmd === 'C') {
      const c1 = [num(), num()], c2 = [num(), num()], p = [num(), num()];
      cur.o[n] = [c1[0] - cur.v[n][0], c1[1] - cur.v[n][1]];
      cur.v.push(p); cur.i.push([c2[0] - p[0], c2[1] - p[1]]); cur.o.push([0, 0]); last = p;
    } else if (cmd === 'Q') {
      const q = [num(), num()], p = [num(), num()], s = cur.v[n];
      const c1 = [s[0] + 2 / 3 * (q[0] - s[0]), s[1] + 2 / 3 * (q[1] - s[1])], c2 = [p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1])];
      cur.o[n] = [c1[0] - s[0], c1[1] - s[1]];
      cur.v.push(p); cur.i.push([c2[0] - p[0], c2[1] - p[1]]); cur.o.push([0, 0]); last = p;
    } else i++;
  }
  close();
  const R = (a) => a.map((p) => [r3(p[0]), r3(p[1])]);
  return subs.map((s) => ({ c: s.c, v: R(s.v), i: R(s.i), o: R(s.o) }));
}

// ---------------------------------------------------------------- paints
function paintItem(p, wind, opMul = 1) {
  const r = wind === 'EVENODD' ? 2 : 1;
  if (p.type === 'solid') return { ty: 'fl', nm: 'Fill', c: stat([...hexRgb(p.color), 1]), o: stat(r3(p.opacity * opMul * 100)), r };
  const colors = p.stops.flatMap((s) => [s.pos, ...hexRgb(s.color)]);
  const anyAlpha = p.stops.some((s) => s.alpha < 1);
  const k = anyAlpha ? [...colors, ...p.stops.flatMap((s) => [s.pos, s.alpha])] : colors;
  const g = { ty: 'gf', nm: 'Gradient', t: p.type === 'linear' ? 1 : 2, s: stat(p.from), e: stat(p.to), g: { p: p.stops.length, k: stat(k) }, o: stat(r3(p.opacity * opMul * 100)), r };
  if (p.type === 'radial') { g.h = stat(0); g.a = stat(0); }
  return g;
}
const trRest = (piv = [0, 0], o = 100) => ({ ty: 'tr', p: stat(piv), a: stat(piv), s: stat([100, 100]), r: stat(0), o: stat(o), sk: stat(0), sa: stat(0) });

// ---------------------------------------------------------------- keyframes
function easeOf(e, warn, where) {
  if (Array.isArray(e)) return e;
  if (e === undefined) return EASE.standard;
  if (e === 'hold') return 'hold';
  if (EASE[e]) return EASE[e];
  warn(`${where}: unknown ease "${e}" → standard`); return EASE.standard;
}
// keys [[sec, value, ease]] → an animated property; map(value) turns the motion value into the Lottie value (an array)
function animated(keys, fps, map, warn, where) {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  if (ks.length === 1) return stat(map(ks[0][1]));
  const out = ks.map((k, j) => {
    const kf = { t: Math.round(k[0] * fps), s: map(k[1]) };
    if (j === ks.length - 1) return kf;
    const e = easeOf(k[2], warn, where);
    if (e === 'hold') { kf.h = 1; return kf; }
    const n = kf.s.length;
    kf.o = { x: Array(n).fill(e[0]), y: Array(n).fill(e[1]) };
    kf.i = { x: Array(n).fill(e[2]), y: Array(n).fill(e[3]) };
    return kf;
  });
  for (let j = 1; j < out.length; j++) if (out[j].t <= out[j - 1].t) warn(`${where}: two keys on frame ${out[j].t} — spread them`);
  return { a: 1, k: out };
}

// ---------------------------------------------------------------- build
function build(rig, motion) {
  const warnings = [...(rig.warnings || []).map((w) => `rig: ${w}`)];
  const warn = (s) => { if (!warnings.includes(s)) warnings.push(s); };
  const fps = motion.fps || 60;
  const op = Math.max(1, Math.round((motion.duration || 1) * fps));
  const W = Math.round(rig.frame.width), H = Math.round(rig.frame.height);

  // index the rig: path names ("Bell/Clapper"), plain names, boxes
  const byPath = new Map(); const byName = new Map(); const byId = new Map();
  const walk = (ns, pre, parent) => ns.forEach((n) => {
    const path = pre ? `${pre}/${n.name}` : n.name;
    n._path = path; n._parent = parent;
    byPath.set(path, n); if (!byName.has(n.name)) byName.set(n.name, n); byId.set(`#${n.id}`, n);
    if (n.children) walk(n.children, path, n);
  });
  walk(rig.children, '', null);
  const find = (t) => byId.get(t) || byPath.get(t) || byName.get(t);
  const pivotOf = (spec, n) => {
    if (Array.isArray(spec)) return spec.map(r3);
    let node = n, at = 'center';
    if (typeof spec === 'string') { const [nm, a] = spec.split('@'); node = find(nm.trim()) || (warn(`pivot: "${nm}" not found — using the target's centre`), n); at = (a || 'center').trim(); }
    const b = node.box; const fx = at.includes('left') ? 0 : at.includes('right') ? 1 : 0.5; const fy = at.includes('top') ? 0 : at.includes('bottom') ? 1 : 0.5;
    return [r3(b.x + fx * b.w), r3(b.y + fy * b.h)];
  };
  const tracks = new Map();
  for (const t of motion.tracks || []) {
    const n = find(t.target);
    if (!n) { warn(`track: target "${t.target}" not found in the rig`); continue; }
    if (tracks.has(n)) warn(`track: "${t.target}" has two tracks — the last one wins`);
    tracks.set(n, { ...t, pivot: pivotOf(t.pivot, n) });
  }
  const hasMask = (n) => n.kind === 'mask' || (n.children || []).some(hasMask);

  // a transform (layer ks or group tr) for node n at rest or animated by its track
  const transformFor = (n, isLayer) => {
    const t = tracks.get(n); const rest = n.opacity * 100;
    const piv = t ? t.pivot : [0, 0];
    const where = t ? t.target : n.name;
    const tr = isLayer ? { o: stat(r3(rest)), r: stat(0), p: stat(piv), a: stat(piv), s: stat([100, 100]) } : trRest(piv, r3(rest));
    if (!t) return tr;
    if (t.rotate) tr.r = animated(t.rotate, fps, (v) => [v], warn, `${where} rotate`);
    if (t.move) tr.p = animated(t.move, fps, (v) => [r3(piv[0] + v[0]), r3(piv[1] + v[1])], warn, `${where} move`);
    if (t.scale) tr.s = animated(t.scale, fps, (v) => (Array.isArray(v) ? v : [v, v]), warn, `${where} scale`);
    if (t.opacity) tr.o = animated(t.opacity, fps, (v) => [r3(rest * v / 100)], warn, `${where} opacity`);
    return tr;
  };

  // one shape (with its fills, stroke, track) → a shape group
  const shapeGroup = (n, own = true) => {
    const t = tracks.get(n);
    const it = [];
    const sh = (n.paths || []).flatMap((p) => toShapes(p.d).map((s) => ({ ty: 'sh', nm: 'Path', ks: stat(s), _w: p.wind })));
    const wind = (n.paths || [])[0]?.wind || 'NONZERO';
    // stroke on top of the fill; a trim track draws the centre line instead of the outline
    if (n.stroke) {
      if (t && t.trim && n.stroke.centre) {
        const col = n.stroke.fills.find((f) => f.type === 'solid');
        if (!col) warn(`${n.name}: trim needs a solid stroke colour`);
        const lc = { ROUND: 2, SQUARE: 3 }[n.stroke.cap] || 1, lj = { ROUND: 2, BEVEL: 3 }[n.stroke.join] || 1;
        it.push({ ty: 'gr', nm: 'Stroke', it: [
          ...n.stroke.centre.flatMap((p) => toShapes(p.d).map((s) => ({ ty: 'sh', nm: 'Line', ks: stat(s) }))),
          { ty: 'tm', nm: 'Trim', s: animated(t.trim, fps, (v) => [v[0]], warn, `${n.name} trim`), e: animated(t.trim, fps, (v) => [v[1]], warn, `${n.name} trim`), o: stat(0), m: 1 },
          { ty: 'st', nm: 'Stroke', c: stat([...hexRgb(col ? col.color : '#000000'), 1]), o: stat(100 * (col ? col.opacity : 1)), w: stat(n.stroke.weight), lc, lj, ml: 4 },
          trRest(),
        ] });
      } else {
        if (t && t.trim) warn(`${n.name}: trim asks for a vector's centre line — this part has none (draw it as a vector stroke)`);
        const ssh = n.stroke.paths.flatMap((p) => toShapes(p.d).map((s) => ({ ty: 'sh', nm: 'Outline', ks: stat(s) })));
        [...n.stroke.fills].reverse().forEach((f) => it.push({ ty: 'gr', nm: 'Stroke', it: [...ssh, paintItem(f, 'NONZERO'), trRest()] }));
      }
    }
    // fills: Figma lists them bottom → top, Lottie draws the first item on top
    const fills = [...(n.fills || [])].reverse();
    fills.forEach((f) => {
      const p = paintItem(f, wind);
      if (t && t.color && f.type === 'solid') p.c = animated(t.color, fps, (v) => [...hexRgb(v), 1], warn, `${n.name} color`);
      it.push({ ty: 'gr', nm: 'Fill', it: [...sh.map(({ _w, ...s }) => s), p, trRest()] });
    });
    if (!fills.length && !n.stroke) warn(`${n.name}: no visible fill — skipped`);
    if (t && t.color && !(n.fills || []).some((f) => f.type === 'solid')) warn(`${n.name}: color track needs a solid fill — this part has a gradient (animate opacity of a second fill instead)`);
    it.push(own ? transformFor(n, false) : trRest());
    return { ty: 'gr', nm: n.name, it };
  };
  const groupItem = (n) => {
    const kids = [...(n.children || [])].filter((c) => c.kind !== 'mask').reverse().map(item);
    return { ty: 'gr', nm: n.name, it: [...kids, transformFor(n, false)] };
  };
  const item = (n) => (n.kind === 'group' ? groupItem(n) : shapeGroup(n));

  // layers, bottom → top; reversed at the end (Lottie: first layer on top)
  const layers = []; let ind = 0;
  const layerBase = (nm, ty, parent) => { const L = { ddd: 0, ind: ++ind, ty, nm, sr: 1, ao: 0, ip: 0, op, st: 0, bm: 0 }; if (parent) L.parent = parent; return L; };
  const BM = { MULTIPLY: 1, SCREEN: 2, OVERLAY: 3, DARKEN: 4, LIGHTEN: 5, COLOR_DODGE: 6, COLOR_BURN: 7, HARD_LIGHT: 8, SOFT_LIGHT: 9, DIFFERENCE: 10, EXCLUSION: 11, HUE: 12, SATURATION: 13, COLOR: 14, LUMINOSITY: 15 };
  const contentLayer = (nm, nodes, parent, mask) => {
    if (!nodes.length) return;
    const L = layerBase(nm, 4, parent);
    L.ks = { o: stat(100), r: stat(0), p: stat([0, 0]), a: stat([0, 0]), s: stat([100, 100]) };
    L.shapes = [...nodes].reverse().map(item);
    if (mask) {
      L.hasMask = true;
      L.masksProperties = (mask.paths || []).flatMap((p) => toShapes(p.d)).map((s, j) => ({ inv: false, mode: 'a', pt: stat(s), o: stat(100), x: stat(0), nm: `${mask.name} ${j + 1}` }));
    }
    layers.push(L);
  };
  const emit = (n, parent) => {
    if (n.kind === 'group' && hasMask(n)) {
      // a group holding a mask: a null layer carries its transform, its children become layers parented to it
      const N = layerBase(n.name, 3, parent);
      N.ks = transformFor(n, true);
      layers.push(N);
      if (tracks.get(n)?.opacity || n.opacity < 1) warn(`${n.name}: a group with a mask passes no opacity to its parts (Lottie null layers) — set opacity on the parts`);
      let run = [];
      const kids = n.children || [];
      for (let j = 0; j < kids.length; j++) {
        const c = kids[j];
        if (c.kind === 'mask') {
          contentLayer(`${n.name} ·${layers.length}`, run, N.ind); run = [];
          const masked = kids.slice(j + 1);
          masked.filter(hasMask).forEach((m) => warn(`${m.name}: a mask inside a masked run — inner mask dropped`));
          contentLayer(`${c.name} (masked)`, masked, N.ind, c);
          return;
        }
        if (c.kind === 'group' && hasMask(c)) { contentLayer(`${n.name} ·${layers.length}`, run, N.ind); run = []; emit(c, N.ind); }
        else run.push(c);
      }
      contentLayer(`${n.name} ·${layers.length}`, run, N.ind);
      return;
    }
    // a top-level part without masks: one shape layer, the part's own transform on the layer
    const L = layerBase(n.name, 4, parent);
    L.ks = transformFor(n, true);
    // the layer carries the part's motion and opacity; its shape group stays at rest
    L.shapes = n.kind === 'group' ? [...n.children].filter((c) => c.kind !== 'mask').reverse().map(item) : [shapeGroup(n, false)];
    if (BM[n.blend]) L.bm = BM[n.blend];
    layers.push(L);
  };
  rig.children.forEach((n) => emit(n, null));
  for (const [n, t] of tracks) {
    const end = [t.rotate, t.move, t.scale, t.opacity, t.color, t.trim].filter(Boolean).flatMap((k) => k.map((x) => x[0]));
    if (end.some((s) => Math.round(s * fps) > op)) warn(`${t.target}: a key lies after the end (${motion.duration}s)`);
    if (motion.loop) for (const k of [t.rotate, t.move, t.scale, t.opacity, t.color, t.trim].filter(Boolean)) {
      const s = [...k].sort((a, b) => a[0] - b[0]);
      if (JSON.stringify(s[0][1]) !== JSON.stringify(s[s.length - 1][1]) || Math.round(s[s.length - 1][0] * fps) !== op) warn(`${t.target}: loop — first and last key differ or the last key is not on the end frame (seam)`);
    }
    void n;
  }
  return { anim: { v: '5.7.0', fr: fps, ip: 0, op, w: W, h: H, nm: motion.name || rig.frame.name, ddd: 0, assets: [], layers: layers.reverse(), markers: (motion.markers || []).map((m) => ({ cm: m.name, tm: Math.round(m.from * fps), dr: Math.round((m.to - m.from) * fps) })) }, warnings, counts: { layers: layers.length, tracks: tracks.size, frames: op } };
}

if (require.main === module) {
  const a = args();
  if (!a.rig || !a.motion || !a.out) { console.error('usage: node lottie-build.cjs --rig rig.json --motion motion.json --out anim.json|anim.lottie'); process.exit(2); }
  const rig = JSON.parse(fs.readFileSync(a.rig, 'utf8'));
  const motion = JSON.parse(fs.readFileSync(a.motion, 'utf8'));
  const { anim, warnings, counts } = build(rig, motion);
  if (/\.lottie$/i.test(a.out)) fs.writeFileSync(a.out, require('./dotlottie.cjs').pack(anim, { loop: motion.loop, autoplay: true }));
  else fs.writeFileSync(a.out, JSON.stringify(anim));
  const kb = (fs.statSync(a.out).size / 1024).toFixed(1);
  console.log(`wrote ${a.out} · ${counts.layers} layers · ${counts.tracks} tracks · ${counts.frames} frames @ ${motion.fps || 60} fps · ${kb} KB`);
  for (const w of warnings) console.log(`⚠ ${w}`);
}
module.exports = { build, toShapes, EASE };
