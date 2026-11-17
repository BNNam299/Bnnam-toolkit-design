// figma-apply-motion.js — figma-vector-motion: writes a motion plan (motion.json) as Figma Motion keyframes on the frame's parts,
// so the designer watches and tweaks it in Figma's own timeline before anything is exported.
// Plugin API code: send the whole file as `code` to figma-agent execute_code (timeoutMs 60000) — or, when the plugin reports
// motionApi: unavailable, to the official Figma MCP use_figma. Set the three constants first.
//
// What it does per track: finds the target (group path "Bell/Clapper", a name, or "#<id>"), sets the part's transform origin to the
// pivot (frame px or "<node>@top" …), and writes manual keyframe tracks — ROTATION (sign flipped: Figma + = counter-clockwise),
// TRANSLATION_X / _Y (move), SCALE_X / _Y (scale % → multiplier), OPACITY (% of the part's own → absolute), PATH_TRIM_START / _END
// (trim %), fills[0] colour (hex). Each ease moves one key forward (motion.json: the key a segment leaves; Figma: the key it
// arrives at). Fields the plan writes are replaced; other tracks on the part are kept. The frame's timeline is set to the duration.
// Returns the parts touched, their ids and warnings. Nothing else in the file changes.

const FRAME_ID = '0:0';          // the top-level frame that holds the art
const MOTION = { fps: 60, duration: 1, loop: false, tracks: [] };   // paste motion.json here
const REPLACE_ALL = false;       // true: first remove every manual track under the frame (a fresh plan, not a tweak)

const EASE = { linear: 'LINEAR', hold: 'HOLD', standard: [0.2, 0, 0, 1], out: [0.05, 0.7, 0.1, 1], in: [0.3, 0, 1, 1],
  inout: [0.42, 0, 0.58, 1], sine: [0.37, 0, 0.63, 1], back: [0.175, 0.885, 0.32, 1.275], release: [0.34, 1.56, 0.64, 1] };
const warnings = [];
const easing = (e) => {
  const v = e === undefined ? EASE.standard : Array.isArray(e) ? e : EASE[e];
  if (v === undefined) { warnings.push(`unknown ease "${e}" → standard`); return easing('standard'); }
  if (v === 'LINEAR' || v === 'HOLD') return { type: v };
  return { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1: v[0], y1: v[1], x2: v[2], y2: v[3] } };
};
const mul = (a, b) => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1], a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]]];
const inv = (m) => { const [[a, b, c], [d, e, f]] = m, det = a * e - b * d || 1e-12; return [[e / det, -b / det, (b * f - c * e) / det], [-d / det, a / det, (c * d - a * f) / det]]; };
const ap = (m, x, y) => [m[0][0] * x + m[0][1] * y + m[0][2], m[1][0] * x + m[1][1] * y + m[1][2]];

const frame = await figma.getNodeByIdAsync(FRAME_ID);
if (!frame || !('children' in frame)) throw new Error(`${FRAME_ID} is not a frame`);
if (frame.parent && frame.parent.type !== 'PAGE') warnings.push('the frame is not top-level — Figma keeps one timeline per top-level frame');
const fInv = inv(frame.absoluteTransform);
const fb = frame.absoluteBoundingBox;
const toFrame = (n) => mul(fInv, n.absoluteTransform);

const byPath = (path) => {
  let level = [frame], node = null;
  for (const part of path.split('/')) {
    node = null;
    for (const p of level) { node = ('children' in p ? p.children : []).find((c) => c.name === part) || null; if (node) break; }
    if (!node) return null;
    level = [node];
  }
  return node;
};
const find = async (t) => t.startsWith('#') ? figma.getNodeByIdAsync(t.slice(1)) : byPath(t) || frame.findOne((n) => n.name === t);
const pivotFrame = async (spec, n) => {
  if (Array.isArray(spec)) return spec;
  let node = n, at = 'center';
  if (typeof spec === 'string') { const [nm, a] = spec.split('@'); node = (await find(nm.trim())) || n; if (node === n && nm.trim() !== n.name) warnings.push(`pivot "${nm}" not found — the target's centre`); at = (a || 'center').trim(); }
  const b = node.absoluteBoundingBox;
  const fx = at.includes('left') ? 0 : at.includes('right') ? 1 : 0.5, fy = at.includes('top') ? 0 : at.includes('bottom') ? 1 : 0.5;
  return [b.x - fb.x + fx * b.width, b.y - fb.y + fy * b.height];
};
// motion.json keys [[s, v, easeLeaving]] → Figma keyframes (ease on the key it arrives at)
const figmaKeys = (keys, val) => {
  const ks = [...keys].sort((a, b) => a[0] - b[0]);
  return ks.map((k, i) => ({ timelinePosition: k[0], value: val(k[1]), ...(i > 0 ? { easing: easing(ks[i - 1][2]) } : {}) }));
};
const F = (v) => ({ type: 'FLOAT', value: v });
const hexRgb = (h) => { const s = h.replace('#', ''); return { r: parseInt(s.slice(0, 2), 16) / 255, g: parseInt(s.slice(2, 4), 16) / 255, b: parseInt(s.slice(4, 6), 16) / 255, a: 1 }; };

if (REPLACE_ALL) for (const n of frame.findAll(() => true)) {
  const t = n.manualKeyframeTracks; if (t && Object.keys(t).length) n.manualKeyframeTracks = {};
}
const touched = [];
for (const t of MOTION.tracks || []) {
  const n = await find(t.target);
  if (!n) { warnings.push(`target "${t.target}" not found`); continue; }
  if (n === frame) { warnings.push(`"${t.target}" is the frame itself — Figma animates its children only; group the art`); continue; }
  const piv = await pivotFrame(t.pivot, n);
  const local = ap(inv(toFrame(n)), piv[0], piv[1]);
  const w = n.width || 0, h = n.height || 0;
  n.transformOrigin = w > 0.01 && h > 0.01
    ? { x: { unit: 'PERCENT', value: (local[0] / w) * 100 }, y: { unit: 'PERCENT', value: (local[1] / h) * 100 } }
    : { x: { unit: 'PIXELS', value: local[0] }, y: { unit: 'PIXELS', value: local[1] } };
  const put = (name, keys) => n.applyManualKeyframeTrack({ type: 'PROPERTY', name }, { keyframes: keys });
  const fields = [];
  if (t.rotate) { put('ROTATION', figmaKeys(t.rotate, (v) => F(-v))); fields.push('ROTATION'); }
  if (t.move) { put('TRANSLATION_X', figmaKeys(t.move, (v) => F(v[0]))); put('TRANSLATION_Y', figmaKeys(t.move, (v) => F(v[1]))); fields.push('TRANSLATION_X', 'TRANSLATION_Y'); }
  if (t.scale) {
    const sx = (v) => (Array.isArray(v) ? v[0] : v) / 100, sy = (v) => (Array.isArray(v) ? v[1] : v) / 100;
    put('SCALE_X', figmaKeys(t.scale, (v) => F(sx(v)))); put('SCALE_Y', figmaKeys(t.scale, (v) => F(sy(v)))); fields.push('SCALE_X', 'SCALE_Y');
  }
  if (t.opacity) { const own = n.opacity; put('OPACITY', figmaKeys(t.opacity, (v) => F((v / 100) * own))); fields.push('OPACITY'); }
  if (t.trim) { put('PATH_TRIM_START', figmaKeys(t.trim, (v) => F(v[0] / 100))); put('PATH_TRIM_END', figmaKeys(t.trim, (v) => F(v[1] / 100))); fields.push('PATH_TRIM_START', 'PATH_TRIM_END'); }
  if (t.color) {
    if (!('fills' in n) || !n.fills.length || n.fills[0].type !== 'SOLID') warnings.push(`${t.target}: colour needs a solid first fill`);
    else { const ex = n.manualKeyframeTracks || {}; n.manualKeyframeTracks = { ...ex, fills: { ...(ex.fills || {}), 0: { keyframes: figmaKeys(t.color, (v) => ({ type: 'COLOR', value: hexRgb(v) })) } } }; fields.push('fills[0]'); }
  }
  touched.push({ id: n.id, name: n.name, fields, origin: n.transformOrigin });
}
const [tl] = frame.timelines || [];
if (tl && MOTION.duration) frame.setTimelineDuration(tl.id, MOTION.duration);
return { mutatedNodeIds: touched.map((x) => x.id), touched, timeline: frame.timelines, warnings };
