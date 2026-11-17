// figma-vector-illustration — build_vectors: create (or replace) named vector groups from a scene the vectorize script wrote, so
// path coordinates never pass through the agent. Additive: no other command uses this file.
//   · a group name with "/" is nested: "Head/Eye L" is the group "Eye L" inside the group "Head" (built when "Head" exists, or made
//     around it) — parts that move together stay one unit, and a blink or a mouth swap is one layer;
//   · a part may carry a linear gradient (`paint`), its own `opacity` and `blend` (shading laid over a base the way designers draw it);
//   · a shade drawn the designer's way: `cutFrom` = a duplicate of its base, cut by the part's path (intersect, then flattened to one
//     clean path) — its outer edge IS the base's edge, so nothing gaps or pokes out, and no mask (art that will be animated);
//     `maskOf` = the part inside a mask group whose mask is a duplicate of the base (static art, icons).
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

// the base of a frame name that may carry a stage: "Coin · vector 2 · 1 thô" → "Coin · vector 2" (kept when it starts with the
// scene's frame name, so a frame moved to "<name> 2" keeps its number through the next stages)
export function baseOfFrame(name: string, sceneBase: string): string {
  const m = name.match(/^(.*?) · \d/);
  const b = m ? m[1] : name;
  return b.startsWith(sceneBase) ? b : sceneBase;
}

type Holder = FrameNode | GroupNode;
// a node's transform expressed in the frame's coordinates (it may sit inside groups — groups do not move their children's space,
// but a nested frame would)
function absoluteIn(frame: FrameNode, n: SceneNode): Transform {
  const [[a, b, tx], [c, d, ty]] = n.absoluteTransform, [[, , fx], [, , fy]] = frame.absoluteTransform;
  return [[a, b, tx - fx], [c, d, ty - fy]];
}
export async function buildVectors(p: BuildVectorsParams) {
  // target frame: the given id, else a top-level frame of that name on the current page, else a new one at a free spot
  let frame: FrameNode;
  let base = p.frame.name;  // the frame's name without a stage — changes when the name is taken by someone else's drawing
  let frameNote: string | undefined;
  if (p.parentId) {
    const n = await getSceneNode(p.parentId);
    if (n.type !== 'FRAME') throw new Error(`parentId ${p.parentId} là ${n.type}, cần FRAME`);
    frame = n;
  } else {
    // the frame may already carry a stage ("Hotdog · vector · 1 thô") — still the same frame. A same-named frame is reused only
    // when it is ours: still at a stage, empty, or holding nothing but this scene's groups and "Draft". Otherwise it is an older
    // drawing (a test once drew straight into a finished "Coin · vector" left in the file) → a new frame "<name> 2", "<name> 3"…
    const known = new Set([...(p.known ?? p.groups.map((g) => g.name.split('/')[0].trim())), 'Draft']);
    const ours = (f: FrameNode) => f.name !== base || f.children.every((c) => known.has(c.name));
    const frames = figma.currentPage.children.filter((c): c is FrameNode => c.type === 'FRAME');
    const found = frames.find((c) => (c.name === base || (p.stage !== undefined && isStageOf(c.name, base))));
    if (found && !ours(found)) {
      let k = 2;
      while (frames.some((c) => isStageOf(c.name, `${p.frame.name} ${k}`))) k++;
      frameNote = `frame "${base}" đã có bản vẽ khác (${found.id}) — dựng vào frame mới "${p.frame.name} ${k}"`;
      base = `${p.frame.name} ${k}`;
    }
    if (found && ours(found)) frame = found;
    else {
      frame = figma.createFrame();
      frame.name = base;
      frame.fills = [];
      frame.clipsContent = false;
      frame.resize(Math.max(1, p.frame.width), Math.max(1, p.frame.height));
      const spot = p.x !== undefined && p.y !== undefined ? { x: p.x, y: p.y } : freeSpot(figma.currentPage.children);
      figma.currentPage.appendChild(frame);
      frame.x = spot.x;
      frame.y = spot.y;
    }
  }
  if (p.stage !== undefined) frame.name = stageFrameName(p.parentId ? baseOfFrame(frame.name, p.frame.name) : base, p.stage);
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
  const built: { group: string; id: string; replaced: boolean; parts: { name: string; id: string; anchors: number; note?: string }[] }[] = [];
  // bases for cutFrom / maskOf: parts built in this call first, else a vector of that name already in the frame
  const byName = new Map<string, VectorNode>();
  const baseOf = (name: string): VectorNode | null =>
    byName.get(name) ?? (frame.findOne((n) => n.type === 'VECTOR' && n.name === name) as VectorNode | null);
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
    const parts: { name: string; id: string; anchors: number; note?: string }[] = [];
    const masks = new Map<string, GroupNode>();   // one mask group per base in this group
    for (const part of g.parts) {
      let v: VectorNode = figma.createVector();
      frame.appendChild(v);
      v.vectorPaths = [{ windingRule: part.windingRule, data: part.d }];
      v.name = part.name;
      v.strokes = [];
      v.x = part.x;
      v.y = part.y;
      let note: string | undefined;
      const baseName = part.cutFrom || part.maskOf;
      const base = baseName ? baseOf(baseName) : null;
      if (baseName && !base) note = `base "${baseName}" not found — built as a plain shape`;
      if (base && part.cutFrom) {
        // the designer's move: duplicate the base in place, cut it with this path, keep one clean path
        const dup = base.clone();
        frame.appendChild(dup);
        dup.relativeTransform = absoluteIn(frame, base);
        try {
          const cut = figma.intersect([dup, v], frame);
          const flat = figma.flatten([cut], frame);
          v = flat;
          v.name = part.name;
        } catch (e) {
          if (!dup.removed) dup.remove();
          note = `cut from "${baseName}" failed (${String(e).slice(0, 80)}) — built as a plain shape`;
        }
      }
      v.fills = [paintOf(part.fill, part.paint)];
      v.strokes = [];
      if (part.opacity !== undefined) v.opacity = part.opacity;
      if (part.blend) v.blendMode = part.blend;
      byName.set(part.name, v);
      if (base && part.maskOf) {
        let mg = masks.get(baseName!);
        if (mg) mg.appendChild(v);
        else {
          const m = base.clone();
          frame.appendChild(m);
          m.relativeTransform = absoluteIn(frame, base);
          m.name = `${baseName} mask`;
          m.isMask = true;
          mg = figma.group([m, v], frame);
          mg.name = `${baseName} shading`;
          masks.set(baseName!, mg);
          nodes.push(mg);
        }
      } else nodes.push(v);
      parts.push({ name: part.name, id: v.id, anchors: v.vectorNetwork.vertices.length, ...(note ? { note } : {}) });
    }
    if (!nodes.length) continue;
    // sub-groups of the replaced group move into the new one and keep their place in the stack: each goes right above the layer
    // that sat under it before (matched by name). figma.group alone stacks them by their old position — below every new part,
    // which hid "Medallion/Bunny" behind the disc it sits on.
    const subs: { node: SceneNode; below: string | null }[] = [];
    if (old && old.type === 'GROUP') {
      const kids = [...old.children];
      // a sub-group holding a layer this call rebuilds (a mask group made by hand: "Rim glass" around "Floor glass") is not
      // carried over — it goes with the old group, else the rebuilt part shows twice (coin TON, 16/11)
      const rebuilt = new Set(g.parts.map((p) => p.name));
      const holdsRebuilt = (c: GroupNode) => c.findAll((n) => rebuilt.has(n.name)).length > 0;
      kids.forEach((c, i) => {
        if (c.type === 'GROUP' && !masks.has(c.name.replace(/ shading$/, '')) && !holdsRebuilt(c))
          subs.push({ node: c, below: i > 0 ? kids[i - 1].name : null });
      });
      for (const s of subs) nodes.push(s.node);
    }
    const group = figma.group(nodes, holder, Math.min(index, holder.children.length));
    group.name = leaf;
    for (const s of subs) {
      const under = s.below === null ? -1 : group.children.findIndex((c) => c !== s.node && c.name === s.below);
      group.insertChild(s.below === null ? 0 : under >= 0 ? under + 1 : group.children.length, s.node);
    }
    if (old && !old.removed) old.remove();
    if (wrapIn) { const outer = figma.group([group], frame, frame.children.indexOf(group)); outer.name = wrapIn; }
    built.push({ group: g.name, id: group.id, replaced: !!old, parts });
  }
  return {
    ...(frameNote ? { note: frameNote } : {}),
    frameId: frame.id,
    frame: { name: frame.name, x: Math.round(frame.x), y: Math.round(frame.y), width: frame.width, height: frame.height },
    groups: built,
  };
}
