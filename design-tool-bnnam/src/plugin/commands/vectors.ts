// figma-vector-illustration — build_vectors: create (or replace) named vector groups from a scene the vectorize script wrote, so
// path coordinates never pass through the agent. Additive: no other command uses this file.
//   · a group name with "/" is nested: "Head/Eye L" is the group "Eye L" inside the group "Head" (built when "Head" exists, or made
//     around it) — parts that move together stay one unit, and a blink or a mouth swap is one layer;
//   · a part may carry a linear gradient (`paint`), its own `opacity` and `blend` (shading laid over a base the way designers draw it).
import type { BuildVectorsParams, BuildVectorsPaint } from '../../shared/schemas';
import { isStageOf, stageFrameName } from '../../shared/stage';
import { solid } from '../paints';
import { freeSpot, getSceneNode } from '../util';

// gradient handles are fractions of the part's own box (0..1): from → to. Figma wants the transform from the box to gradient space
// (x runs 0 → 1 from `from` to `to`, y centred at 0.5).
export function linearTransform(from: [number, number], to: [number, number]): Transform {
  const [sx, sy] = from, dx = to[0] - sx, dy = to[1] - sy, L2 = dx * dx + dy * dy || 1;
  return [
    [dx / L2, dy / L2, -(sx * dx + sy * dy) / L2],
    [-dy / L2, dx / L2, 0.5 - (-dy * sx + dx * sy) / L2],
  ];
}
function paintOf(fill: string, paint?: BuildVectorsPaint): Paint {
  if (!paint) return solid(fill);
  return {
    type: 'GRADIENT_LINEAR',
    gradientTransform: linearTransform(paint.from, paint.to),
    gradientStops: paint.stops.map((s) => { const c = solid(s.color).color; return { position: s.pos, color: { r: c.r, g: c.g, b: c.b, a: s.alpha ?? 1 } }; }),
  };
}

type Holder = FrameNode | GroupNode;
export async function buildVectors(p: BuildVectorsParams) {
  // target frame: the given id, else a top-level frame of that name on the current page, else a new one at a free spot
  let frame: FrameNode;
  if (p.parentId) {
    const n = await getSceneNode(p.parentId);
    if (n.type !== 'FRAME') throw new Error(`parentId ${p.parentId} là ${n.type}, cần FRAME`);
    frame = n;
  } else {
    // the frame may already carry a stage ("Hotdog · vector · 1 thô") — still the same frame
    const found = figma.currentPage.children.find((c) => c.type === 'FRAME' && (c.name === p.frame.name || (p.stage !== undefined && isStageOf(c.name, p.frame.name)))) as FrameNode | undefined;
    if (found) frame = found;
    else {
      frame = figma.createFrame();
      frame.name = p.frame.name;
      frame.fills = [];
      frame.clipsContent = false;
      frame.resize(Math.max(1, p.frame.width), Math.max(1, p.frame.height));
      const spot = p.x !== undefined && p.y !== undefined ? { x: p.x, y: p.y } : freeSpot(figma.currentPage.children);
      figma.currentPage.appendChild(frame);
      frame.x = spot.x;
      frame.y = spot.y;
    }
  }
  if (p.stage !== undefined) frame.name = stageFrameName(p.frame.name, p.stage);
  // the holder of a nested group = the group named by the path before the last "/" (searched from the frame down)
  const holderOf = (path: string[]): GroupNode | null => {
    let at: Holder = frame;
    for (const name of path) {
      const next = at.children.find((c) => c.type === 'GROUP' && c.name === name) as GroupNode | undefined;
      if (!next) return null;
      at = next;
    }
    return at === frame ? null : (at as GroupNode);
  };
  const built: { group: string; id: string; replaced: boolean; parts: { name: string; id: string; anchors: number }[] }[] = [];
  for (const g of p.groups) {
    const path = g.name.split('/').map((s) => s.trim()).filter(Boolean);
    const leaf = path[path.length - 1] ?? g.name;
    let holder: Holder = frame;
    let wrapIn: string | null = null; // a nested group whose holder does not exist yet: the holder is made around it
    if (path.length > 1) {
      const h = holderOf(path.slice(0, -1));
      if (h) holder = h;
      else if (path.length === 2) wrapIn = path[0];
      else throw new Error(`build_vectors: nhóm "${g.name}" cần nhóm "${path.slice(0, -1).join('/')}" dựng trước`);
    }
    // keep a replaced group at its old place in the stack; its own sub-groups move into the new one
    const old = holder.children.find((c) => c.name === leaf);
    const index = old ? holder.children.indexOf(old) : holder.children.length;
    const nodes: SceneNode[] = [];
    const parts: { name: string; id: string; anchors: number }[] = [];
    for (const part of g.parts) {
      const v = figma.createVector();
      frame.appendChild(v);
      v.vectorPaths = [{ windingRule: part.windingRule, data: part.d }];
      v.name = part.name;
      v.fills = [paintOf(part.fill, part.paint)];
      v.strokes = [];
      if (part.opacity !== undefined) v.opacity = part.opacity;
      if (part.blend) v.blendMode = part.blend;
      v.x = part.x;
      v.y = part.y;
      nodes.push(v);
      parts.push({ name: part.name, id: v.id, anchors: v.vectorNetwork.vertices.length });
    }
    if (!nodes.length) continue;
    if (old && old.type === 'GROUP') for (const c of [...old.children]) if (c.type === 'GROUP') nodes.push(c);
    const group = figma.group(nodes, holder, Math.min(index, holder.children.length));
    group.name = leaf;
    if (old && !old.removed) old.remove();
    if (wrapIn) { const outer = figma.group([group], frame, frame.children.indexOf(group)); outer.name = wrapIn; }
    built.push({ group: g.name, id: group.id, replaced: !!old, parts });
  }
  return {
    frameId: frame.id,
    frame: { name: frame.name, x: Math.round(frame.x), y: Math.round(frame.y), width: frame.width, height: frame.height },
    groups: built,
  };
}
