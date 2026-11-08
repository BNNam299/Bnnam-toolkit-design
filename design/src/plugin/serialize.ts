import { toHex } from '../shared/values';
import { round2 } from './util';

type Json = Record<string, unknown>;

export class Serializer {
  private varNames = new Map<string, Promise<string>>();
  private styleNames = new Map<string, Promise<string>>();
  count = 0;
  truncated = false;

  constructor(private maxNodes = 300) {}

  async node(node: BaseNode, depth: number): Promise<Json> {
    this.count++;
    const out: Json = { id: node.id, name: node.name, type: node.type };
    if (node.type === 'DOCUMENT' || node.type === 'PAGE') {
      if ('children' in node) await this.children(node, out, depth);
      return out;
    }
    const n = node as SceneNode;
    if (!n.visible) out.visible = false;
    if ('x' in n) Object.assign(out, { x: round2(n.x), y: round2(n.y), width: round2(n.width), height: round2(n.height) });
    if ('rotation' in n && n.rotation) out.rotation = round2(n.rotation);
    if ('opacity' in n && n.opacity < 1) out.opacity = round2(n.opacity);
    if ('locked' in n && n.locked) out.locked = true;

    if (isAutoLayoutParent(n.parent) && 'layoutSizingHorizontal' in n) {
      if (n.layoutPositioning === 'ABSOLUTE') out.absolute = true;
      out.widthMode = n.layoutSizingHorizontal;
      out.heightMode = n.layoutSizingVertical;
    } else if ('layoutSizingHorizontal' in n && 'layoutMode' in n && n.layoutMode !== 'NONE') {
      out.widthMode = n.layoutSizingHorizontal;
      out.heightMode = n.layoutSizingVertical;
    }

    if ('layoutMode' in n && n.layoutMode !== 'NONE') {
      out.layout = n.layoutMode;
      out.gap = n.primaryAxisAlignItems === 'SPACE_BETWEEN' ? 'AUTO' : n.itemSpacing;
      out.padding = [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft];
      out.justify = ALIGN_NAME[n.primaryAxisAlignItems];
      out.align = ALIGN_NAME[n.counterAxisAlignItems];
      if (n.layoutWrap === 'WRAP') Object.assign(out, { wrap: true, counterGap: n.counterAxisSpacing });
    }
    if ('clipsContent' in n && n.type !== 'INSTANCE' && n.type === 'FRAME') out.clip = n.clipsContent;
    if ('layoutGrids' in n && Array.isArray(n.layoutGrids) && n.layoutGrids.length > 0) {
      const grids = 'gridStyleId' in n && typeof n.gridStyleId === 'string' && n.gridStyleId
        ? { style: await this.style(n.gridStyleId) }
        : n.layoutGrids.map(serializeGrid);
      (out as Json).layoutGrids = grids;
    }

    if ('fills' in n) {
      const fills = await this.paints(n.fills, 'fillStyleId' in n ? n.fillStyleId : '');
      if (fills !== undefined) out.fill = fills;
    }
    if ('strokes' in n && n.strokes.length > 0) {
      out.stroke = {
        color: await this.paints(n.strokes, 'strokeStyleId' in n ? n.strokeStyleId : ''),
        width: mixed(n.strokeWeight),
        align: n.strokeAlign,
      };
      if ('dashPattern' in n && Array.isArray(n.dashPattern) && n.dashPattern.length > 0) {
        (out.stroke as Json).dash = [...n.dashPattern];
      }
    }
    if ('cornerRadius' in n) {
      const r = mixed(n.cornerRadius);
      if (r === 'MIXED' && 'topLeftRadius' in n) {
        out.radius = [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius];
      } else if (r) out.radius = r;
    }
    if ('effects' in n && n.effects.length > 0) {
      out.effects = n.effectStyleId ? { style: await this.style(n.effectStyleId) } : n.effects.map(effect);
    }
    if ('boundVariables' in n && n.boundVariables) {
      const bound = await this.bound(n.boundVariables as Record<string, unknown>);
      if (Object.keys(bound).length) out.variables = bound;
    }

    if (n.type === 'TEXT') await this.text(n, out);
    if (n.type === 'INSTANCE') {
      const main = await n.getMainComponentAsync();
      if (main) {
        const set = main.parent?.type === 'COMPONENT_SET' ? main.parent : null;
        out.component = { id: (set ?? main).id, name: (set ?? main).name, key: (set ?? main).key, remote: main.remote };
      }
      out.properties = Object.fromEntries(Object.entries(n.componentProperties).map(([k, v]) => [k, v.value]));
    }
    if (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') {
      out.key = n.key;
      if (n.description) out.description = n.description;
      if (n.type === 'COMPONENT_SET' || n.parent?.type !== 'COMPONENT_SET') {
        out.propertyDefinitions = n.componentPropertyDefinitions;
      }
    }
    if ('children' in n) await this.children(n, out, depth);
    return out;
  }

  private async children(node: { children: readonly BaseNode[] }, out: Json, depth: number) {
    out.childCount = node.children.length;
    if (depth <= 0 || node.children.length === 0) return;
    const kids: Json[] = [];
    for (const child of node.children) {
      if (this.count >= this.maxNodes) {
        this.truncated = true;
        out.childrenTruncated = true;
        break;
      }
      kids.push(await this.node(child, depth - 1));
    }
    out.children = kids;
  }

  private async text(n: TextNode, out: Json) {
    out.text = n.characters.length > 400 ? n.characters.slice(0, 400) + '…' : n.characters;
    const font = n.fontName;
    out.font = font === figma.mixed ? 'MIXED' : `${font.family} ${font.style}`;
    out.fontSize = mixed(n.fontSize);
    const lh = n.lineHeight;
    if (lh !== figma.mixed) out.lineHeight = lh.unit === 'AUTO' ? 'AUTO' : lh.unit === 'PERCENT' ? `${round2(lh.value)}%` : lh.value;
    const ls = n.letterSpacing;
    if (ls !== figma.mixed && ls.value !== 0) out.letterSpacing = ls.unit === 'PERCENT' ? `${round2(ls.value)}%` : ls.value;
    if (n.textAlignHorizontal !== 'LEFT') out.textAlign = n.textAlignHorizontal;
    if (n.textAlignVertical !== 'TOP') out.verticalAlign = n.textAlignVertical;
    if (n.textCase !== figma.mixed && n.textCase !== 'ORIGINAL') out.textCase = n.textCase;
    if (n.textDecoration !== figma.mixed && n.textDecoration !== 'NONE') out.decoration = n.textDecoration;
    if (n.textTruncation === 'ENDING' && typeof n.maxLines === 'number') out.maxLines = n.maxLines;
    out.autoResize = n.textAutoResize;
    if (typeof n.textStyleId === 'string' && n.textStyleId) out.textStyle = await this.style(n.textStyleId);
  }

  private async paints(paints: readonly Paint[] | PluginAPI['mixed'], styleId: string | PluginAPI['mixed']) {
    if (typeof styleId === 'string' && styleId) return { style: await this.style(styleId) };
    if (paints === figma.mixed) return 'MIXED';
    const visible = paints.filter((p) => p.visible !== false);
    if (visible.length === 0) return undefined;
    const list = await Promise.all(visible.map((p) => this.paint(p)));
    list.reverse();
    return list.length === 1 ? list[0] : list;
  }

  private async paint(p: Paint): Promise<unknown> {
    if (p.type === 'SOLID') {
      const alias = p.boundVariables?.color;
      if (alias) return { var: await this.varName(alias.id) };
      return toHex({ ...p.color, a: p.opacity ?? 1 });
    }
    if (p.type.startsWith('GRADIENT_')) {
      const g = p as GradientPaint;
      const out: Json = {
        gradient: g.type.replace('GRADIENT_', ''),
        stops: g.gradientStops.map((s) => ({ color: toHex(s.color), position: round2(s.position) })),
      };
      if (g.type === 'GRADIENT_LINEAR') out.angle = gradientAngle(g.gradientTransform);
      return out;
    }
    if (p.type === 'IMAGE') return { image: `hash:${p.imageHash}`, scaleMode: p.scaleMode };
    return { type: p.type };
  }

  private async bound(bv: Record<string, unknown>): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(bv)) {
      if (field === 'fills' || field === 'strokes') continue;
      const aliases = (Array.isArray(value) ? value : [value]) as { id?: string }[];
      const names = await Promise.all(aliases.filter((a) => a?.id).map((a) => this.varName(a.id!)));
      if (names.length) out[field] = names.length === 1 ? names[0] : names;
    }
    return out;
  }

  private varName(id: string): Promise<string> {
    let p = this.varNames.get(id);
    if (!p) {
      p = figma.variables.getVariableByIdAsync(id).then(async (v) => {
        if (!v) return id;
        const c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
        return c ? `${c.name}/${v.name}` : v.name;
      });
      this.varNames.set(id, p);
    }
    return p;
  }

  private style(id: string): Promise<string> {
    let p = this.styleNames.get(id);
    if (!p) {
      p = figma.getStyleByIdAsync(id).then((s) => s?.name ?? id);
      this.styleNames.set(id, p);
    }
    return p;
  }
}

const ALIGN_NAME: Record<string, string> = {
  MIN: 'START',
  CENTER: 'CENTER',
  MAX: 'END',
  SPACE_BETWEEN: 'SPACE_BETWEEN',
  BASELINE: 'BASELINE',
};

function isAutoLayoutParent(p: BaseNode | null): boolean {
  return !!p && 'layoutMode' in p && p.layoutMode !== 'NONE';
}

function mixed<T>(v: T | PluginAPI['mixed']): T | 'MIXED' {
  return v === figma.mixed ? 'MIXED' : (v as T);
}

function serializeGrid(g: LayoutGrid): Json {
  if (g.pattern === 'GRID') return { pattern: g.pattern, size: g.sectionSize };
  const out: Json = { pattern: g.pattern, count: g.count === Infinity ? 'auto' : g.count, gutter: g.gutterSize, alignment: g.alignment };
  if (g.offset !== undefined) out.margin = g.offset;
  if (g.sectionSize !== undefined) out.size = g.sectionSize;
  return out;
}

function gradientAngle(t: Transform): number {
  const phi = Math.atan2(t[0][1], t[0][0]);
  const deg = (phi * 180) / Math.PI + 90;
  return Math.round((((deg % 360) + 360) % 360) * 10) / 10;
}

function effect(e: Effect): unknown {
  if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
    return {
      type: e.type === 'DROP_SHADOW' ? 'DROP' : 'INNER',
      color: toHex(e.color),
      x: e.offset.x,
      y: e.offset.y,
      blur: e.radius,
      spread: e.spread ?? 0,
    };
  }
  if (e.type === 'LAYER_BLUR') return { layerBlur: e.radius };
  if (e.type === 'BACKGROUND_BLUR') return { backgroundBlur: e.radius };
  return { type: e.type };
}

export function summary(n: BaseNode): Json {
  const out: Json = { id: n.id, name: n.name, type: n.type };
  if ('x' in n) {
    const s = n as SceneNode;
    Object.assign(out, { x: round2(s.x), y: round2(s.y), width: round2(s.width), height: round2(s.height) });
  }
  if (n.type === 'TEXT') out.text = n.characters.length > 80 ? n.characters.slice(0, 80) + '…' : n.characters;
  if (n.parent && n.parent.type !== 'PAGE' && n.parent.type !== 'DOCUMENT') out.parent = n.parent.name;
  return out;
}
