import type { AnyProps, NumOrVar } from '../shared/schemas';
import { GRID_PRESETS, toLayoutGrid } from '../shared/grids';
import { expandSides, parseLetterSpacing, parseLineHeight, weightToStyle } from '../shared/values';
import { loadFont, loadNodeFonts, resolveFont } from './fonts';
import { resolveEffects, resolveFill } from './paints';
import type { Resources } from './resources';
import { isAutoLayout } from './util';

export interface ApplyCtx {
  res: Resources;
  defaultFont: string;
}

type BindField = VariableBindableNodeField | VariableBindableTextField;
type Bindable = SceneNode & { setBoundVariable(field: BindField, variable: Variable | null): void };

async function setNum(node: SceneNode, field: BindField, v: NumOrVar, ctx: ApplyCtx, assign: (n: number) => void) {
  if (typeof v === 'number') {
    assign(v);
    return;
  }
  (node as Bindable).setBoundVariable(field, await ctx.res.variable(v.var));
}

export async function applyProps(node: SceneNode, p: AnyProps, ctx: ApplyCtx, isNew: boolean): Promise<void> {
  if (p.name !== undefined) node.name = p.name;
  if (p.visible !== undefined) node.visible = p.visible;
  if (p.locked !== undefined) node.locked = p.locked;
  if (p.rotation !== undefined && 'rotation' in node) node.rotation = p.rotation;
  if (p.opacity !== undefined && 'opacity' in node) {
    await setNum(node, 'opacity', p.opacity, ctx, (n) => ((node as BlendMixin).opacity = n));
  }
  if ('layoutMode' in node) await applyFrame(node as FrameNode, p, ctx);
  if (node.type === 'TEXT') await applyText(node, p, ctx, isNew);
  if (node.type === 'INSTANCE') await applyInstance(node, p, ctx);

  const fill = node.type === 'TEXT' ? (p.color ?? p.fill) : p.fill;
  if (fill !== undefined && 'fills' in node) {
    const r = await resolveFill(fill, ctx.res);
    if ('style' in r) await (node as MinimalFillsMixin).setFillStyleIdAsync(r.style.id);
    else (node as MinimalFillsMixin).fills = r.paints;
  }
  if (p.stroke && 'strokes' in node) await applyStroke(node, p.stroke, ctx);
  if (p.radius !== undefined && 'cornerRadius' in node) await applyRadius(node, p.radius, ctx);
  if (p.effects !== undefined && 'effects' in node) {
    const r = await resolveEffects(p.effects, ctx.res);
    if ('style' in r) await (node as BlendMixin).setEffectStyleIdAsync(r.style.id);
    else (node as BlendMixin).effects = r.effects;
  }

  await applySize(node, p, ctx);
  for (const k of ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'] as const) {
    const v = p[k];
    if (v !== undefined) await setNum(node, k, v, ctx, (n) => ((node as FrameNode)[k] = n));
  }

  if (p.variableModes && 'setExplicitVariableModeForCollection' in node) {
    for (const [collectionName, modeName] of Object.entries(p.variableModes)) {
      const collection = await ctx.res.collection(collectionName);
      const mode = collection.modes.find((m) => m.name === modeName || m.modeId === modeName);
      if (!mode) {
        throw new Error(
          `Collection "${collection.name}" has no mode "${modeName}". Modes: ${collection.modes.map((m) => m.name).join(', ')}.`,
        );
      }
      node.setExplicitVariableModeForCollection(collection, mode.modeId);
    }
  }
  if (p.description !== undefined) {
    if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
      throw new Error('description can only be set on components and component sets.');
    }
    node.description = p.description;
  }
}

const ALIGN: Record<string, 'MIN' | 'CENTER' | 'MAX'> = { START: 'MIN', CENTER: 'CENTER', END: 'MAX' };

async function applyFrame(node: FrameNode, p: AnyProps, ctx: ApplyCtx) {
  if (p.layout !== undefined) node.layoutMode = p.layout;
  if (p.wrap !== undefined) node.layoutWrap = p.wrap ? 'WRAP' : 'NO_WRAP';
  if (p.justify !== undefined) node.primaryAxisAlignItems = p.justify === 'SPACE_BETWEEN' ? 'SPACE_BETWEEN' : ALIGN[p.justify];
  if (p.align !== undefined) node.counterAxisAlignItems = p.align === 'BASELINE' ? 'BASELINE' : ALIGN[p.align];
  if (p.gap === 'AUTO') node.primaryAxisAlignItems = 'SPACE_BETWEEN';
  else if (p.gap !== undefined) await setNum(node, 'itemSpacing', p.gap, ctx, (n) => (node.itemSpacing = n));
  if (p.counterGap !== undefined) {
    await setNum(node, 'counterAxisSpacing', p.counterGap, ctx, (n) => (node.counterAxisSpacing = n));
  }

  const sides: (NumOrVar | undefined)[] = p.padding !== undefined ? expandSides<NumOrVar>(p.padding) : [];
  const fields = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const;
  for (let i = 0; i < 4; i++) {
    const v = p[fields[i]] ?? sides[i];
    if (v !== undefined) await setNum(node, fields[i], v, ctx, (n) => (node[fields[i]] = n));
  }
  if (p.clip !== undefined) node.clipsContent = p.clip;
  if (p.layoutGrids !== undefined) {
    const g = p.layoutGrids;
    if (!Array.isArray(g) && 'style' in g) await node.setGridStyleIdAsync((await ctx.res.gridStyle(g.style)).id);
    else node.layoutGrids = resolveGrids(g);
  }
}

export function resolveGrids(g: NonNullable<AnyProps['layoutGrids']>): LayoutGrid[] {
  if (!Array.isArray(g) && 'style' in g) throw new Error('A grid style must be applied with setGridStyleIdAsync.');
  const specs = Array.isArray(g) ? g : GRID_PRESETS[g.preset];
  return specs.map((x) => toLayoutGrid(x) as LayoutGrid);
}

async function applyText(node: TextNode, p: AnyProps, ctx: ApplyCtx, isNew: boolean) {
  const current = !isNew && node.fontName !== figma.mixed ? node.fontName : undefined;
  const fontChange = isNew || p.fontFamily !== undefined || p.fontStyle !== undefined || p.fontWeight !== undefined;
  if (!isNew) await loadNodeFonts(node);
  if (fontChange) {
    const family = p.fontFamily ?? current?.family ?? ctx.defaultFont;
    const style =
      p.fontStyle ?? (p.fontWeight !== undefined ? weightToStyle(p.fontWeight) : (current?.style ?? 'Regular'));
    const font = await resolveFont(family, style);
    await loadFont(font);
    node.fontName = font;
  }
  if (p.text !== undefined) node.characters = p.text;
  if (p.textStyle !== undefined) {
    const style = await ctx.res.textStyle(p.textStyle);
    await loadFont(style.fontName);
    await node.setTextStyleIdAsync(style.id);
  }
  if (p.fontSize !== undefined) await setNum(node, 'fontSize', p.fontSize, ctx, (n) => (node.fontSize = n));
  if (p.lineHeight !== undefined) node.lineHeight = parseLineHeight(p.lineHeight);
  if (p.letterSpacing !== undefined) node.letterSpacing = parseLetterSpacing(p.letterSpacing);
  if (p.textAlign !== undefined) node.textAlignHorizontal = p.textAlign;
  if (p.verticalAlign !== undefined) node.textAlignVertical = p.verticalAlign;
  if (p.textCase !== undefined) node.textCase = p.textCase;
  if (p.decoration !== undefined) node.textDecoration = p.decoration;
  if (p.maxLines !== undefined) {
    node.textTruncation = 'ENDING';
    node.maxLines = p.maxLines;
  }
}

async function applyStroke(node: SceneNode, s: NonNullable<AnyProps['stroke']>, ctx: ApplyCtx) {
  const n = node as GeometryMixin & MinimalStrokesMixin & SceneNode;
  const r = await resolveFill(s.color, ctx.res);
  if ('style' in r) await n.setStrokeStyleIdAsync(r.style.id);
  else n.strokes = r.paints;
  if (s.align !== undefined) n.strokeAlign = s.align;
  if (s.dash !== undefined) n.dashPattern = s.dash;
  if (s.width === undefined) return;
  if (Array.isArray(s.width)) {
    if (!('strokeTopWeight' in node)) throw new Error(`${node.type} does not support per-side stroke widths.`);
    const fields = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'] as const;
    for (let i = 0; i < 4; i++) {
      await setNum(node, fields[i], s.width[i], ctx, (v) => ((node as FrameNode)[fields[i]] = v));
    }
  } else {
    await setNum(node, 'strokeWeight', s.width, ctx, (v) => (n.strokeWeight = v));
  }
}

async function applyRadius(node: SceneNode, radius: NonNullable<AnyProps['radius']>, ctx: ApplyCtx) {
  if (!Array.isArray(radius)) {
    await setNum(node, 'cornerRadius', radius, ctx, (v) => ((node as CornerMixin).cornerRadius = v));
    return;
  }
  if (!('topLeftRadius' in node)) throw new Error(`${node.type} does not support per-corner radius.`);
  const fields = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'] as const;
  for (let i = 0; i < 4; i++) {
    await setNum(node, fields[i], radius[i], ctx, (v) => ((node as RectangleCornerMixin)[fields[i]] = v));
  }
}

// resize() resets both axes to FIXED; restore the axis that was not asked to
// change so a width-only update keeps a hugging height.
async function applySize(node: SceneNode, p: AnyProps, ctx: ApplyCtx) {
  if (p.width === undefined && p.height === undefined) return;
  if (!('resize' in node)) throw new Error(`${node.type} cannot be resized.`);
  const before =
    'layoutSizingHorizontal' in node ? { h: node.layoutSizingHorizontal, v: node.layoutSizingVertical } : undefined;
  const w = typeof p.width === 'number' ? p.width : undefined;
  const h = typeof p.height === 'number' ? p.height : undefined;
  if (w !== undefined || h !== undefined) {
    node.resize(Math.max(0.01, w ?? node.width), Math.max(0.01, h ?? node.height));
  }
  if (p.width !== undefined && typeof p.width !== 'number') await setNum(node, 'width', p.width, ctx, () => {});
  if (p.height !== undefined && typeof p.height !== 'number') await setNum(node, 'height', p.height, ctx, () => {});
  if (before && 'layoutSizingHorizontal' in node) {
    if (p.width === undefined && before.h !== 'FIXED') {
      try {
        node.layoutSizingHorizontal = before.h;
      } catch { node.layoutSizingHorizontal = 'FIXED'; }
    }
    if (p.height === undefined && before.v !== 'FIXED') {
      try {
        node.layoutSizingVertical = before.v;
      } catch { node.layoutSizingVertical = 'FIXED'; }
    }
  }
}

export function applyPlacement(node: SceneNode, p: AnyProps, isNew: boolean): void {
  const parentAL = isAutoLayout(node.parent);
  if (p.absolute !== undefined) {
    if (!parentAL) throw new Error('absolute only applies to children of an auto-layout frame.');
    (node as FrameNode).layoutPositioning = p.absolute ? 'ABSOLUTE' : 'AUTO';
  }
  const inFlow = parentAL && (node as FrameNode).layoutPositioning !== 'ABSOLUTE';
  if (p.x !== undefined || p.y !== undefined) {
    if (inFlow) throw new Error('x/y have no effect inside auto layout; add absolute: true or use the parent gap/padding.');
    if (p.x !== undefined) node.x = p.x;
    if (p.y !== undefined) node.y = p.y;
  }

  if (!('layoutSizingHorizontal' in node)) return;
  const selfAL = isAutoLayout(node);
  const isText = node.type === 'TEXT';
  let wm = p.widthMode;
  let hm = p.heightMode;
  if (isNew && node.type !== 'INSTANCE') {
    if (wm === undefined && p.width === undefined && (selfAL || isText)) wm = 'HUG';
    if (hm === undefined && p.height === undefined && (selfAL || isText)) hm = 'HUG';
  }
  for (const [axis, mode] of [
    ['widthMode', wm],
    ['heightMode', hm],
  ] as const) {
    if (mode === 'FILL' && !inFlow) {
      throw new Error(`${axis} FILL needs a parent with auto layout (layout: HORIZONTAL/VERTICAL) and no absolute.`);
    }
    if (mode === 'HUG' && !selfAL && !isText) {
      throw new Error(`${axis} HUG only works on auto-layout frames and text; set layout or a fixed size.`);
    }
  }
  if (wm !== undefined) node.layoutSizingHorizontal = wm;
  if (hm !== undefined) node.layoutSizingVertical = hm;

  if (isText && (isNew || wm !== undefined || p.width !== undefined)) {
    const text = node as TextNode;
    if (text.layoutSizingHorizontal === 'HUG') text.textAutoResize = 'WIDTH_AND_HEIGHT';
    else if (hm !== 'FIXED' && p.height === undefined) text.textAutoResize = 'HEIGHT';
    if (p.maxLines !== undefined) {
      text.textTruncation = 'ENDING';
      text.maxLines = p.maxLines;
    }
  }
}

async function applyInstance(node: InstanceNode, p: AnyProps, ctx: ApplyCtx) {
  if (p.component !== undefined) {
    const c = await ctx.res.component(p.component);
    node.swapComponent(c.type === 'COMPONENT_SET' ? c.defaultVariant : c);
  }
  const props: Record<string, string | boolean> = {};
  const defs = node.componentProperties;
  const resolveKey = (name: string) => {
    if (name in defs) return name;
    const key = Object.keys(defs).find((k) => k.split('#')[0] === name);
    if (!key) throw new Error(`Instance has no property "${name}". Properties: ${Object.keys(defs).join(', ') || '(none)'}.`);
    return key;
  };
  for (const [k, v] of Object.entries(p.variant ?? {})) props[resolveKey(k)] = v;
  for (const [k, v] of Object.entries(p.properties ?? {})) props[resolveKey(k)] = v;
  if (Object.keys(props).length > 0) node.setProperties(props);

  for (const [layer, text] of Object.entries(p.texts ?? {})) {
    const targets = node.findAll((n) => n.type === 'TEXT' && n.name === layer) as TextNode[];
    if (targets.length === 0) {
      const names = node.findAll((n) => n.type === 'TEXT').map((n) => n.name);
      throw new Error(`Instance has no text layer "${layer}". Text layers: ${names.join(', ') || '(none)'}.`);
    }
    for (const t of targets) {
      await loadNodeFonts(t);
      t.characters = text;
    }
  }
}

