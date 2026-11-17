// figma-read-motion.js — figma-vector-motion: reads the Figma Motion keyframes under a frame when export_rig says
// motionApi: unavailable (Motion not exposed to the figma-agent plugin). Send the whole file as `code` to the official Figma MCP
// use_figma, save the returned JSON as design/motion/<name>/motion-read.json, then
//   node scripts/figma-motion.cjs --rig rig.json --tracks motion-read.json --out motion.json
// Read-only. Returns { timeline, nodes: { <id>: { tracks, origin: [x, y] frame px, styles } } } — the same fields export_rig writes.

const FRAME_ID = '0:0';

const mul = (a, b) => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1], a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]]];
const inv = (m) => { const [[a, b, c], [d, e, f]] = m, det = a * e - b * d || 1e-12; return [[e / det, -b / det, (b * f - c * e) / det], [-d / det, a / det, (c * d - a * f) / det]]; };
const ap = (m, x, y) => [m[0][0] * x + m[0][1] * y + m[0][2], m[1][0] * x + m[1][1] * y + m[1][2]];
const r3 = (v) => Math.round(v * 1000) / 1000;

const frame = await figma.getNodeByIdAsync(FRAME_ID);
if (!frame || !('children' in frame)) throw new Error(`${FRAME_ID} is not a frame`);
const fInv = inv(frame.absoluteTransform);
const nodes = {};
for (const n of frame.findAll(() => true)) {
  const tracks = n.manualKeyframeTracks || {}, styles = n.animationStyles || [];
  if (!Object.keys(tracks).length && !styles.length) continue;
  const to = n.transformOrigin, w = n.width || 0, h = n.height || 0;
  const ax = to ? (to.x.unit === 'PERCENT' ? (to.x.value / 100) * w : to.x.value) : w / 2;
  const ay = to ? (to.y.unit === 'PERCENT' ? (to.y.value / 100) * h : to.y.value) : h / 2;
  nodes[n.id] = { name: n.name, tracks, origin: ap(mul(fInv, n.absoluteTransform), ax, ay).map(r3), styles: styles.length };
}
return { frame: frame.name, timeline: frame.timelines?.[0]?.duration ?? null, nodes };
