import type { AnyProps, ConnectorSpec, RenderTreeInput, SectionSpec, TreeNode } from '../../shared/schemas';
import { parseColor } from '../../shared/values';
import { applyPlacement, applyProps, endpointFor, setSublayerText, type ApplyCtx } from '../apply';
import { resolveFill } from '../paints';
import { Resources } from '../resources';
import { iconWarnings } from '../icons';
import { freeSpot, getContainer, isAutoLayout, RolledBackError } from '../util';

export async function renderTree(p: RenderTreeInput) {
  const ctx: ApplyCtx = { res: new Resources(), defaultFont: p.defaultFont ?? 'Inter' };
  let parent: BaseNode & ChildrenMixin;
  let parentNote: string | undefined;
  if (p.parentId) {
    parent = await getContainer(p.parentId);
  } else if ((figma.editorType as string) === 'slides') {
    if (p.tree.type === 'slide') {
      parent = figma.currentPage;
    } else {
      const focused = (figma.currentPage as unknown as { focusedSlide?: SlideNode | null }).focusedSlide;
      if (focused) {
        parent = focused;
        parentNote = `No parentId in Slides: used focused slide ${focused.id}. Pass parentId explicitly.`;
      } else {
        parent = figma.currentPage;
      }
    }
  } else {
    parent = figma.currentPage;
  }
  const ids: Record<string, string> = {};
  const state: BuildState = { root: null, count: 0, created: [], deferred: [] };

  const t = p.tree as { x?: unknown; y?: unknown };
  const onPage = parent.type === 'PAGE' && t.x === undefined && t.y === undefined;
  const spot = onPage ? freeSpot((parent as PageNode).children) : null;

  try {
    const root = await build(p.tree, parent, p.index, ctx, [], ids, state);
    await wireConnectors(state, ids);
    if (spot) {
      root.x = spot.x;
      root.y = spot.y;
    }
    if (p.select && root.parent?.type === 'PAGE') {
      figma.currentPage.selection = [root];
      figma.viewport.scrollAndZoomIntoView([root]);
    }
    const warnings = iconWarnings([root]);
    return {
      rootId: root.id,
      created: state.count,
      bounds: 'x' in root ? { x: root.x, y: root.y, width: root.width, height: root.height } : undefined,
      ids,
      ...(parentNote ? { parentNote } : {}),
      ...(warnings.length ? { warnings } : {}),
    };
  } catch (e) {
    for (const n of state.created) {
      try {
        if (!n.removed) n.remove();
      // eslint-disable-next-line no-empty
      } catch {
      }
    }
    if (state.root && !state.root.removed) state.root.remove();
    throw new RolledBackError(`${e instanceof Error ? e.message : String(e)} (nothing was left on the canvas)`);
  }
}

export interface BuildState {
  root: SceneNode | null;
  count: number;
  created: SceneNode[];
  deferred: { node: ConnectorNode; spec: ConnectorSpec }[];
}

export async function wireConnectors(state: BuildState, ids: Record<string, string>) {
  for (const { node, spec } of state.deferred) {
    const fromRef = ids[spec.from] ?? spec.from;
    const toRef = ids[spec.to] ?? spec.to;
    if (fromRef === toRef) throw new Error(`Connector "${spec.name ?? 'connector'}" cannot loop onto itself.`);
    const magnet = node.connectorLineType === 'STRAIGHT' ? 'CENTER' : 'AUTO';
    node.connectorStart = await endpointFor(fromRef, 'from', magnet);
    node.connectorEnd = await endpointFor(toRef, 'to', magnet);
  }
  state.deferred = [];
}

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
    if (spec.type === 'slide') return await buildSlide(spec, parent, index, ctx, here, ids, state);
    const props = { ...spec } as unknown as AnyProps;
    const node = await create(spec, ctx, props);
    if (!state.root) state.root = node;
    state.count++;
    state.created.push(node);

    await applyProps(node, props, ctx, true);
    if (index !== undefined) parent.insertChild(Math.min(index, parent.children.length), node);
    else parent.appendChild(node);
    if (node.type === 'CONNECTOR') {
      state.deferred.push({ node, spec: spec as ConnectorSpec });
    }
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

async function buildSlide(
  spec: Extract<TreeNode, { type: 'slide' }>,
  parent: BaseNode & ChildrenMixin,
  index: number | undefined,
  ctx: ApplyCtx,
  here: string[],
  ids: Record<string, string>,
  state: BuildState,
): Promise<SceneNode> {
  if ((figma.editorType as string) !== 'slides') {
    throw new Error('slide nodes are only valid in Figma Slides files.');
  }
  if (parent.type !== 'PAGE' && parent.type !== 'SLIDE_GRID') {
    throw new Error(`A slide can only live on a page or the slide grid, not in a ${parent.type}.`);
  }
  if (index !== undefined) {
    throw new Error('slide does not support index: grid position is row/col.');
  }
  const slide = figma.createSlide(spec.row, spec.col);
  if (!state.root) state.root = slide as unknown as SceneNode;
  state.count++;
  state.created.push(slide as unknown as SceneNode);
  const props = { ...spec } as unknown as AnyProps;
  delete props.row;
  delete (props as Record<string, unknown>).col;
  await applyProps(slide as unknown as SceneNode, props, ctx, true);
  const slideChildren = (spec as unknown as { children?: TreeNode[] }).children ?? [];
  for (const child of slideChildren) {
    await build(child, slide as unknown as BaseNode & ChildrenMixin, undefined, ctx, here, ids, state);
  }
  let key = here.join('/');
  for (let i = 2; key in ids; i++) key = `${here.join('/')}#${i}`;
  ids[key] = slide.id;
  return slide as unknown as SceneNode;
}

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

async function create(
  spec: Exclude<TreeNode, SectionSpec | { type: 'slide' }>,
  ctx: ApplyCtx,
  props: AnyProps,
): Promise<SceneNode> {
  switch (spec.type) {
    case 'frame': {
      const node = spec.component ? figma.createComponent() : figma.createFrame();
      delete props.component;
      node.fills = [];
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
      delete props.component;
      return inst;
    }
    case 'sticky': {
      const node = figma.createSticky();
      if (props.isWide !== undefined) node.isWideWidth = props.isWide;
      delete props.isWide;
      return node;
    }
    case 'shape': {
      const node = figma.createShapeWithText();
      node.shapeType = spec.shape;
      delete props.shape;
      return node;
    }
    case 'connector': {
      const node = figma.createConnector();
      if (props.lineType !== undefined) node.connectorLineType = props.lineType;
      if (props.caps?.start) node.connectorStartStrokeCap = props.caps.start;
      if (props.caps?.end) node.connectorEndStrokeCap = props.caps.end;
      delete props.lineType;
      delete props.caps;
      delete props.from;
      delete props.to;
      return node;
    }
    case 'code': {
      const node = figma.createCodeBlock();
      node.code = spec.code;
      if (props.language !== undefined) node.codeLanguage = props.language;
      delete props.code;
      delete props.language;
      return node;
    }
    case 'table': {
      const rows = props.rows;
      const columns = props.columns;
      if (!Number.isInteger(rows) || (rows as number) < 1 || !Number.isInteger(columns) || (columns as number) < 1) {
        throw new Error(`table needs rows and columns ≥ 1 (got ${String(rows)}×${String(columns)}).`);
      }
      if ((rows as number) * (columns as number) > 400) {
        throw new Error(`table is capped at 400 cells (got ${(rows as number) * (columns as number)}).`);
      }
      const node = figma.createTable(rows as number, columns as number);
      const cells = props.cells;
      if (cells !== undefined) {
        if (cells.length !== rows || cells.some((r) => r.length !== columns)) {
          throw new Error(`cells must be exactly ${String(rows)}×${String(columns)}.`);
        }
        for (let r = 0; r < (rows as number); r++) {
          for (let c = 0; c < (columns as number); c++) {
            await setSublayerText(node.cellAt(r, c).text, cells[r][c], ctx);
          }
        }
      }
      delete props.rows;
      delete props.columns;
      delete props.cells;
      return node;
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
