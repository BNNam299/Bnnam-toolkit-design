// figma-vector-motion — export_rig: read a finished vector frame as plain data for the motion scripts (Lottie build, Rive notes):
// every group and shape in paint order with its name, opacity, blend, and every outline in the FRAME's coordinates (fillGeometry,
// so rectangles, ellipses, booleans and text arrive as paths too), fills as solid / linear / radial with handles in frame px, strokes
// as outlined paths (plus the centre line of a vector, for draw-on), masks as the shape that clips what lies above it in its group.
// Additive and read-only: no other command uses this file. The server writes the result to a file, so coordinates never pass through
// the agent.

type M = [[number, number, number], [number, number, number]];
export type RigPaint =
  | { type: 'solid'; color: string; opacity: number }
  | { type: 'linear' | 'radial'; from: [number, number]; to: [number, number]; edge?: [number, number]; stops: { pos: number; color: string; alpha: number }[]; opacity: number };
export type RigPath = { d: string; wind: 'NONZERO' | 'EVENODD' };
export type RigNode = {
  id: string;
  name: string;
  kind: 'group' | 'shape' | 'mask';
  opacity: number;
  blend: string;
  box: { x: number; y: number; w: number; h: number };
  children?: RigNode[];
  paths?: RigPath[];
  fills?: RigPaint[];
  stroke?: { paths: RigPath[]; fills: RigPaint[]; weight: number; cap: string; join: string; centre?: RigPath[] };
  // Figma Motion on this node: manual keyframe tracks as Figma stores them, the transform origin in frame px, applied styles
  motion?: { origin: [number, number]; tracks: Record<string, unknown>; styles: number };
};

// Figma Motion (beta) — every getter can throw "not a supported API" when Motion is off for this user / plugin
type MotionNode = SceneNode & {
  manualKeyframeTracks?: Record<string, unknown>;
  animationStyles?: unknown[];
  transformOrigin?: { x: { unit: 'PERCENT' | 'PIXELS'; value: number }; y: { unit: 'PERCENT' | 'PIXELS'; value: number } };
  timelines?: { id: string; duration: number }[];
};
function motionOf(n: SceneNode, toFrame: M): RigNode['motion'] | undefined | 'unavailable' {
  const m = n as MotionNode;
  let tracks: Record<string, unknown> | undefined, styles: unknown[] | undefined, to: MotionNode['transformOrigin'];
  try { tracks = m.manualKeyframeTracks; styles = m.animationStyles; to = m.transformOrigin; } catch { return 'unavailable'; }
  const has = tracks && Object.keys(tracks).length > 0;
  if (!has && !(styles && styles.length)) return undefined;
  const w = 'width' in n ? n.width : 0, h = 'height' in n ? n.height : 0;
  const ax = to ? (to.x.unit === 'PERCENT' ? (to.x.value / 100) * w : to.x.value) : w / 2;
  const ay = to ? (to.y.unit === 'PERCENT' ? (to.y.value / 100) * h : to.y.value) : h / 2;
  return { origin: apply(toFrame, ax, ay).map(r3) as [number, number], tracks: tracks ?? {}, styles: styles?.length ?? 0 };
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;
export const mul = (a: M, b: M): M => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1], a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]],
];
export const inv = (m: M): M => {
  const [[a, b, c], [d, e, f]] = m, det = a * e - b * d || 1e-12;
  return [[e / det, -b / det, (b * f - c * e) / det], [-d / det, a / det, (c * d - a * f) / det]];
};
export const apply = (m: M, x: number, y: number): [number, number] => [m[0][0] * x + m[0][1] * y + m[0][2], m[1][0] * x + m[1][1] * y + m[1][2]];

// an SVG path from Figma (absolute M L Q C Z, numbers separated by spaces or commas) moved by m — affine maps keep béziers exact
export function transformPath(d: string, m: M): string {
  const tok = d.match(/[MLQCZmlqcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const out: string[] = [];
  let cmd = '';
  for (let i = 0; i < tok.length;) {
    if (/[A-Za-z]/.test(tok[i])) { cmd = tok[i++].toUpperCase(); out.push(cmd); if (cmd === 'Z') continue; }
    const n = cmd === 'C' ? 3 : cmd === 'Q' ? 2 : 1;
    for (let k = 0; k < n; k++) {
      const [x, y] = apply(m, Number(tok[i]), Number(tok[i + 1]));
      out.push(`${r3(x)} ${r3(y)}`);
      i += 2;
    }
  }
  return out.join(' ');
}

const hex2 = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
const hexOf = (c: RGB | RGBA) => `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`;

// Figma's gradientTransform maps the node's unit box into gradient space (axis (0,.5) → (1,.5)); its inverse gives the handles
export function gradientHandles(gt: Transform, w: number, h: number, toFrame: M) {
  const back = inv(gt as M);
  const at = (u: number, v: number) => { const [x, y] = apply(back, u, v); return apply(toFrame, x * w, y * h).map(r3) as [number, number]; };
  return { from: at(0, 0.5), to: at(1, 0.5), centre: at(0.5, 0.5), edge: at(0.5, 1) };
}

function paintsOf(paints: readonly Paint[] | typeof figma.mixed, w: number, h: number, toFrame: M, warn: (s: string) => void, who: string): RigPaint[] {
  if (paints === figma.mixed) { warn(`${who}: mixed fills (text with several colours) — first colour only`); return []; }
  const out: RigPaint[] = [];
  for (const p of paints) {
    if (p.visible === false) continue;
    const opacity = p.opacity ?? 1;
    if (p.type === 'SOLID') out.push({ type: 'solid', color: hexOf(p.color), opacity: r3(opacity) });
    else if (p.type === 'GRADIENT_LINEAR' || p.type === 'GRADIENT_RADIAL') {
      const hd = gradientHandles(p.gradientTransform, w, h, toFrame);
      const stops = p.gradientStops.map((s) => ({ pos: r3(s.position), color: hexOf(s.color), alpha: r3(s.color.a) }));
      if (p.type === 'GRADIENT_LINEAR') out.push({ type: 'linear', from: hd.from, to: hd.to, stops, opacity: r3(opacity) });
      else {
        const rx = Math.hypot(hd.to[0] - hd.centre[0], hd.to[1] - hd.centre[1]), ry = Math.hypot(hd.edge[0] - hd.centre[0], hd.edge[1] - hd.centre[1]);
        if (Math.abs(rx - ry) > 0.05 * Math.max(rx, ry)) warn(`${who}: elliptical radial gradient (${r3(rx)}×${r3(ry)}) — Lottie draws it round`);
        out.push({ type: 'radial', from: hd.centre, to: hd.to, edge: hd.edge, stops, opacity: r3(opacity) });
      }
    } else warn(`${who}: ${p.type} fill not exported (images / angular / diamond) — bake or redraw`);
  }
  return out;
}

const geom = (list: readonly VectorPath[], m: M): RigPath[] => list.map((g) => ({ d: transformPath(g.data, m), wind: g.windingRule === 'EVENODD' ? 'EVENODD' : 'NONZERO' }));

export async function exportRig(p: { nodeId: string }) {
  const root = await figma.getNodeByIdAsync(p.nodeId);
  if (!root || !('children' in root) || root.type === 'PAGE' || root.type === 'DOCUMENT') throw new Error(`${p.nodeId} không phải frame / group có con`);
  const frame = root as SceneNode & ChildrenMixin;
  const frameInv = inv(frame.absoluteTransform as M);
  const warnings: string[] = [];
  const warn = (s: string) => { if (warnings.length < 60 && !warnings.includes(s)) warnings.push(s); };
  const fb = frame.absoluteBoundingBox ?? { x: 0, y: 0, width: 0, height: 0 };
  let shapes = 0, groups = 0, animated = 0;
  let motionApi: 'ok' | 'unavailable' = 'ok';

  const read = (n: SceneNode): RigNode | null => {
    if (!n.visible) return null;
    const toFrame = mul(frameInv, n.absoluteTransform as M);
    const bb = n.absoluteBoundingBox ?? { x: fb.x, y: fb.y, width: 0, height: 0 };
    const mo = motionApi === 'ok' ? motionOf(n, toFrame) : undefined;
    if (mo === 'unavailable') motionApi = 'unavailable';
    const base = {
      id: n.id, name: n.name,
      opacity: r3('opacity' in n ? n.opacity : 1),
      blend: 'blendMode' in n ? n.blendMode : 'NORMAL',
      box: { x: r3(bb.x - fb.x), y: r3(bb.y - fb.y), w: r3(bb.width), h: r3(bb.height) },
      ...(mo && mo !== 'unavailable' ? { motion: mo } : {}),
    };
    if (mo && mo !== 'unavailable') {
      animated++;
      if (mo.styles) warn(`${n.name}: ${mo.styles} Figma animation style(s) — not readable as keyframes, not converted; use manual keyframes`);
      if ('rotation' in n && Math.abs(n.rotation) > 0.01) warn(`${n.name}: animated part is rotated at rest (${r3(n.rotation)}°) — check its pivot in the preview`);
    }
    if (base.blend !== 'NORMAL' && base.blend !== 'PASS_THROUGH') warn(`${n.name}: blend ${base.blend} — partial on Android`);
    if ('effects' in n && n.effects.some((e) => e.visible)) warn(`${n.name}: effects (${n.effects.filter((e) => e.visible).map((e) => e.type).join(', ')}) not exported — blur / shadow render unevenly; bake to PNG or redraw as shapes`);
    const isMask = 'isMask' in n && n.isMask;
    if (!isMask && 'children' in n && n.type !== 'BOOLEAN_OPERATION') {
      groups++;
      const kids: RigNode[] = [];
      // a frame's own fill is a shape under its children; clipping a nested frame is not exported
      if (n.type === 'FRAME' || n.type === 'COMPONENT' || n.type === 'INSTANCE') {
        if (n.clipsContent) warn(`${n.name}: nested frame clips its content — not exported as a mask; use a mask group`);
        const f = paintsOf(n.fills, n.width, n.height, toFrame, warn, n.name);
        if (f.length && n.fillGeometry.length) kids.push({ ...base, id: n.id + ':bg', name: n.name + ' bg', kind: 'shape', opacity: 1, blend: 'NORMAL', paths: geom(n.fillGeometry, toFrame), fills: f });
      }
      for (const c of n.children) { const r = read(c); if (r) kids.push(r); }
      return { ...base, kind: 'group', children: kids };
    }
    if (!('fillGeometry' in n)) { warn(`${n.name}: ${n.type} not exported`); return null; }
    shapes++;
    const g = n as SceneNode & GeometryMixin & LayoutMixin;
    if (n.type === 'TEXT') warn(`${n.name}: text exported as outlines (no font needed)`);
    const node: RigNode = { ...base, kind: isMask ? 'mask' : 'shape', paths: geom(g.fillGeometry, toFrame), fills: paintsOf(g.fills, g.width, g.height, toFrame, warn, n.name) };
    const sw = typeof g.strokeWeight === 'number' ? g.strokeWeight : 0;
    if (!isMask && g.strokes.some((s) => s.visible !== false) && sw > 0 && g.strokeGeometry.length) {
      node.stroke = {
        paths: geom(g.strokeGeometry, toFrame), fills: paintsOf(g.strokes, g.width, g.height, toFrame, warn, n.name + ' stroke'),
        weight: sw, cap: typeof g.strokeCap === 'string' ? g.strokeCap : 'NONE', join: typeof g.strokeJoin === 'string' ? g.strokeJoin : 'MITER',
        ...(n.type === 'VECTOR' ? { centre: geom(n.vectorPaths, toFrame) } : {}),
      };
      if ('dashPattern' in g && g.dashPattern.length) warn(`${n.name}: dashed stroke — outlined as drawn; a trim-path draw-on needs the plain line`);
    }
    if (isMask && 'maskType' in n && n.maskType === 'LUMINANCE') warn(`${n.name}: luminance mask — exported as its outline`);
    return node;
  };

  const children: RigNode[] = [];
  for (const c of frame.children) { const r = read(c); if (r) children.push(r); }
  if (!shapes) throw new Error(`${frame.name}: không có hình nào để xuất`);
  let timeline: number | null = null;
  try { timeline = (frame as MotionNode).timelines?.[0]?.duration ?? null; } catch { motionApi = 'unavailable'; }
  if (motionApi === 'unavailable') warn('Figma Motion API not available to this plugin — keyframes not read (read them with the official Figma MCP, see the motion skill)');
  return {
    frame: { id: frame.id, name: frame.name, width: r3(fb.width), height: r3(fb.height), timeline },
    children, counts: { shapes, groups, animated }, motionApi, warnings,
  };
}
