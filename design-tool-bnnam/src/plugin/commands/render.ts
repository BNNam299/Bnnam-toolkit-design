import type { AnyProps, RenderTreeInput, SectionSpec, TreeNode } from '../../shared/schemas';
import { parseColor } from '../../shared/values';
import { applyPlacement, applyProps, type ApplyCtx } from '../apply';
import { resolveFill } from '../paints';
import { Resources } from '../resources';
import { iconWarnings } from '../icons';
import { freeSpot, getContainer, isAutoLayout, RolledBackError } from '../util';

export async function renderTree(p: RenderTreeInput) {
  const ctx: ApplyCtx = { res: new Resources(), defaultFont: p.defaultFont ?? 'Inter' };
  const parent = p.parentId ? await getContainer(p.parentId) : figma.currentPage;
  const ids: Record<string, string> = {};
  const state: BuildState = { root: null, count: 0 };

  const onPage = parent.type === 'PAGE' && p.tree.x === undefined && p.tree.y === undefined;
  const spot = onPage ? freeSpot((parent as PageNode).children) : null;

  try {
    const root = await build(p.tree, parent, p.index, ctx, [], ids, state);
    if (spot) {
      root.x = spot.x;
      root.y = spot.y;
    }
    if (p.select && root.parent?.type === 'PAGE') {
      figma.currentPage.selection = [root];
      figma.viewport.scrollAndZoomIntoView([root]);
    }
    // Measured, not guessed: an icon off its slot centre is invisible in the
    // numbers the agent reads back, so say it here.
    const warnings = iconWarnings([root]);
    return {
      rootId: root.id,
      created: state.count,
      bounds: { x: root.x, y: root.y, width: root.width, height: root.height },
      ids,
      ...(warnings.length ? { warnings } : {}),
    };
  } catch (e) {
    if (state.root && !state.root.removed) state.root.remove();
    throw new RolledBackError(`${e instanceof Error ? e.message : String(e)} (nothing was left on the canvas)`);
  }
}

export interface BuildState {
  root: SceneNode | null;
  count: number;
}

// Builds one spec subtree under `parent`. Exported for create_component_set,
// which builds each variant with the same appliers as render_tree.
export async function build(
  spec: TreeNode,
  parent: BaseNode & ChildrenMixin,
  index: number | undefined,
  ctx: ApplyCtx,
  path: string[],
  ids: Record<string, string>,
  state: BuildState,
): Promise<SceneNode> {
  const label = spec.name ?? spec.type;
  const here = [...path, label];
  try {
    if (spec.type === 'section') return await buildSection(spec, parent, index, ctx, here, ids, state);
    // Mutable copy: create() may consume or derive some properties.
    const props = { ...spec } as unknown as AnyProps;
    const node = await create(spec, ctx, props);
    if (!state.root) state.root = node;
    state.count++;

    await applyProps(node, props, ctx, true);
    if (index !== undefined) parent.insertChild(Math.min(index, parent.children.length), node);
    else parent.appendChild(node);
    applyPlacement(node, props, true);

    if (spec.type === 'frame' && spec.children?.length) {
      const frame = node as FrameNode;
      for (const child of spec.children) await build(child, frame, undefined, ctx, here, ids, state);
      if (!isAutoLayout(frame) && spec.width === undefined && spec.height === undefined) fitToChildren(frame);
    }

    let key = here.join('/');
    for (let i = 2; key in ids; i++) key = `${here.join('/')}#${i}`;
    ids[key] = node.id;
    return node;
  } catch (e) {
    if (e instanceof PathError) throw e;
    throw new PathError(`At "${here.join(' > ')}": ${e instanceof Error ? e.message : String(e)}`);
  }
}

class PathError extends Error {}

// file-standards.md §5–6: one Section per flow; screens 200px apart, laid
// out left → right unless they carry their own x/y.
async function buildSection(
  spec: SectionSpec,
  parent: BaseNode & ChildrenMixin,
  index: number | undefined,
  ctx: ApplyCtx,
  here: string[],
  ids: Record<string, string>,
  state: BuildState,
): Promise<SceneNode> {
  if (parent.type !== 'PAGE' && parent.type !== 'SECTION') {
    throw new Error(`A section can only live on a page or inside another section, not in a ${parent.type}.`);
  }
  const section = figma.createSection();
  if (!state.root) state.root = section;
  state.count++;
  if (spec.name !== undefined) section.name = spec.name;
  if (spec.fill !== undefined) {
    const r = await resolveFill(spec.fill, ctx.res);
    if ('style' in r) await section.setFillStyleIdAsync(r.style.id);
    else section.fills = r.paints;
  }
  if (index !== undefined) parent.insertChild(Math.min(index, parent.children.length), section);
  else parent.appendChild(section);
  if (spec.x !== undefined) section.x = spec.x;
  if (spec.y !== undefined) section.y = spec.y;

  const pad = spec.padding ?? 80;
  const gap = spec.gap ?? 200;
  let cursor = pad;
  for (const child of spec.children ?? []) {
    const node = await build(child, section, undefined, ctx, here, ids, state);
    const placed = 'x' in child && (child.x !== undefined || child.y !== undefined);
    if (!placed) {
      node.x = cursor;
      node.y = pad;
    }
    cursor = Math.max(cursor, node.x + node.width + gap);
  }
  let w = spec.width ?? 0;
  let h = spec.height ?? 0;
  if (spec.width === undefined || spec.height === undefined) {
    for (const c of section.children) {
      w = Math.max(w, c.x + c.width + pad);
      h = Math.max(h, c.y + c.height + pad);
    }
  }
  section.resizeWithoutConstraints(Math.max(w, 400), Math.max(h, 300));

  let key = here.join('/');
  for (let i = 2; key in ids; i++) key = `${here.join('/')}#${i}`;
  ids[key] = section.id;
  return section;
}

async function create(spec: Exclude<TreeNode, SectionSpec>, ctx: ApplyCtx, props: AnyProps): Promise<SceneNode> {
  switch (spec.type) {
    case 'frame': {
      const node = spec.component ? figma.createComponent() : figma.createFrame();
      delete props.component;
      node.fills = []; // transparent unless a fill is given
      // createFrame starts at 100x100; layout frames without a size will hug.
      return node;
    }
    case 'text':
      return figma.createText();
    case 'rect':
      return figma.createRectangle();
    case 'ellipse':
      return figma.createEllipse();
    case 'svg': {
      const node = figma.createNodeFromSvg(spec.svg);
      if (spec.color) recolor(node, spec.color);
      const w = typeof spec.width === 'number' ? spec.width : undefined;
      const h = typeof spec.height === 'number' ? spec.height : undefined;
      // Scale vectors with the frame instead of resizing only the frame.
      const factor = w !== undefined && h !== undefined ? Math.min(w / node.width, h / node.height) : w !== undefined ? w / node.width : h !== undefined ? h / node.height : 1;
      if (factor !== 1 && isFinite(factor) && factor > 0) node.rescale(factor);
      if (w === undefined || h === undefined) {
        delete props.width;
        delete props.height;
      }
      return node;
    }
    case 'image': {
      if (!spec.imageBase64 && !spec.src) throw new Error('image needs src (or imageBase64).');
      const rect = figma.createRectangle();
      const hash = spec.imageBase64
        ? ctx.res.imageHash(spec.imageBase64)
        : (await figma.createImageAsync(spec.src!)).hash;
      const image = figma.getImageByHash(hash);
      const size = image ? await image.getSizeAsync() : { width: 100, height: 100 };
      const w = typeof spec.width === 'number' ? spec.width : undefined;
      const h = typeof spec.height === 'number' ? spec.height : undefined;
      if (w === undefined && h === undefined) Object.assign(props, size);
      else if (w === undefined) props.width = Math.round((size.width / size.height) * h!);
      else if (h === undefined) props.height = Math.round((size.height / size.width) * w);
      if (spec.fill === undefined) rect.fills = [{ type: 'IMAGE', imageHash: hash, scaleMode: spec.scaleMode ?? 'FILL' }];
      return rect;
    }
    case 'instance': {
      const c = await ctx.res.component(spec.component);
      const main = c.type === 'COMPONENT_SET' ? c.defaultVariant : c;
      const inst = main.createInstance();
      // The component ref is consumed here; applyProps would treat it as a swap.
      delete props.component;
      return inst;
    }
  }
}

function recolor(root: FrameNode, color: string) {
  const c = parseColor(color);
  const paint: SolidPaint = { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a };
  for (const n of root.findAll(() => true)) {
    if ('fills' in n && Array.isArray(n.fills) && n.fills.some((f: Paint) => f.type === 'SOLID')) n.fills = [paint];
    if ('strokes' in n && n.strokes.some((s) => s.type === 'SOLID')) n.strokes = [paint];
  }
}

function fitToChildren(frame: FrameNode) {
  let w = 0;
  let h = 0;
  for (const c of frame.children) {
    w = Math.max(w, c.x + c.width);
    h = Math.max(h, c.y + c.height);
  }
  if (w > 0 && h > 0) frame.resize(w, h);
}
