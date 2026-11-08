// figma-ui-flow Stage 7 — read-only QA audit of a page or subtree.
// The heuristics live in ../../shared/audit.ts (unit-tested); this file only
// collects node data from the Figma tree.
import type { AuditInput } from '../../shared/schemas';
import {
  buildReport,
  colorsDiffer,
  contrastVerdict,
  isOffScale,
  isRedundantWrapper,
  LOREM,
  nameProblem,
  worstContrast,
  targetSeverity,
  toQaMarkdown,
  type Issue,
  type RGB,
} from '../../shared/audit';
import { toHex } from '../../shared/values';
import { offCentreIcons } from '../icons';
import { getNode } from '../util';

const CHECK_GROUPS: Record<string, string[]> = {
  names: ['default-name', 'blacklisted-name'],
  tokens: ['raw-fill', 'raw-text', 'raw-stroke', 'raw-radius', 'primitive-bound', 'stale-paint'],
  layout: ['no-autolayout', 'redundant-wrapper', 'off-scale-spacing', 'icon-offcenter'],
  a11y: ['contrast', 'small-target'],
  hygiene: ['hidden-layer', 'orphan-token', 'outside-section', 'variant-explosion'],
  content: ['lorem'],
};

// Names that make a layer an interactive target (master: button, tab, chip,
// field, row…). Icons are excluded on purpose: their glyph is small but the
// hit area belongs to the interactive ancestor.
const INTERACTIVE = /^(Button|Tab(\/|$)|Chip|Link|Input|Field|Row|Item|Toggle|Checkbox|Radio|Segment|FAB)/;

const isScene = (n: BaseNode): n is SceneNode => 'visible' in n;

const VECTOR_TYPES = new Set<string>(['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'RECTANGLE', 'STAR', 'POLYGON']);

function solidColor(node: SceneNode): RGB | null {
  const paints = 'fills' in node && Array.isArray(node.fills) ? node.fills : [];
  // The last visible paint is the topmost one.
  for (let i = paints.length - 1; i >= 0; i--) {
    const p = paints[i];
    if (p.type === 'SOLID' && p.visible !== false) {
      if (p.opacity !== undefined && p.opacity < 0.95) return null; // blended with what is behind
      return p.color;
    }
    if (p.visible !== false && (p.type === 'GRADIENT_LINEAR' || p.type === 'GRADIENT_RADIAL' || p.type === 'IMAGE')) return null;
  }
  return null;
}

// Real backdrop: nearest ancestor with a visible fill. A solid gives one
// colour, an opaque gradient gives its stops (judged by the worst one);
// images and translucent paints return null → "needs-check", never a wrong ratio.
function backdropOf(node: SceneNode): RGB[] | null {
  let cur: BaseNode | null = node.parent;
  while (cur && cur.type !== 'PAGE' && cur.type !== 'DOCUMENT') {
    if (isScene(cur)) {
      const paints = 'fills' in cur && Array.isArray(cur.fills) ? (cur.fills as Paint[]) : [];
      const visible = paints.filter((p) => p.visible !== false);
      if (visible.length) {
        const top = visible[visible.length - 1];
        if ((top.type === 'GRADIENT_LINEAR' || top.type === 'GRADIENT_RADIAL') && (top.opacity ?? 1) >= 0.95) {
          const stops = top.gradientStops;
          return stops.every((s) => s.color.a >= 0.95) ? stops.map((s) => s.color) : null;
        }
        const solid = solidColor(cur);
        return solid ? [solid] : null;
      }
    }
    cur = cur.parent;
  }
  return [{ r: 1, g: 1, b: 1 }];
}

const bound = (node: SceneNode, field: string): boolean => {
  const bv = (node as SceneNode & { boundVariables?: Record<string, unknown> }).boundVariables;
  return !!bv && !!bv[field];
};

// Every variable id bound on the node, its fills/strokes and effects.
function boundIds(n: SceneNode): string[] {
  const ids: string[] = [];
  const collect = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach(collect);
    const alias = value as VariableAlias;
    if (alias.type === 'VARIABLE_ALIAS') ids.push(alias.id);
    else Object.values(value).forEach(collect);
  };
  collect((n as SceneNode & { boundVariables?: unknown }).boundVariables);
  return [...new Set(ids)];
}

export async function auditDesign(p: AuditInput) {
  const root = p.rootId ? await getNode(p.rootId) : figma.currentPage;
  const enabled = new Set((p.checks?.length ? p.checks : Object.keys(CHECK_GROUPS)).flatMap((g) => CHECK_GROUPS[g] ?? []));
  const issues: Issue[] = [];
  const nodes: SceneNode[] = [];

  const walk = (n: BaseNode) => {
    if (!isScene(n)) return;
    nodes.push(n);
    for (const c of (n as ChildrenMixin).children ?? []) walk(c);
  };
  // A page is a container only; a rootId node is audited itself too, so a
  // single frame or component set is not reported as "0 scanned".
  if (root.type === 'PAGE') for (const child of root.children) walk(child);
  else walk(root);

  // Primitives (scopes [] or a "Primitive…" collection) must not be bound to
  // layers. Say which rule matched: a Semantic token with scopes [] is a data
  // bug (hidden from the pickers), not a wrong binding.
  const primitives = new Map<string, string>();
  const localVars = new Map<string, Variable>();
  if (enabled.has('primitive-bound') || enabled.has('stale-paint')) {
    const [vars, colls] = await Promise.all([figma.variables.getLocalVariablesAsync(), figma.variables.getLocalVariableCollectionsAsync()]);
    const collName = new Map(colls.map((c) => [c.id, c.name]));
    for (const v of vars) {
      localVars.set(v.id, v);
      const coll = collName.get(v.variableCollectionId) ?? '?';
      if (/primitive/i.test(coll)) primitives.set(v.id, `bind thẳng primitive "${coll}/${v.name}"`);
      else if (v.scopes.length === 0) primitives.set(v.id, `"${coll}/${v.name}" có scopes [] (bị ẩn khỏi picker) nên bị coi là primitive — đặt lại scopes`);
    }
  }
  const page = root.type === 'PAGE' ? root : null;
  const pageHasSections = !!page && page.children.some((c) => c.type === 'SECTION');

  for (const n of nodes) {
    const rect = 'x' in n ? { x: Math.round(n.x), y: Math.round(n.y), w: Math.round(n.width), h: Math.round(n.height) } : undefined;
    const push = (kind: Issue['kind'], detail?: string) => issues.push({ id: n.id, kind, name: n.name, detail, rect });

    // A + D5/D6 — naming
    if (enabled.has('default-name') || enabled.has('blacklisted-name')) {
      const problem = nameProblem(n.name);
      if (problem && enabled.has(problem)) push(problem);
    }

    // A1 / G2 — raw values (only meaningful once the file has tokens, but the
    // finding is exactly "this value is not bound", so it is always valid).
    if (enabled.has('raw-fill') && 'fills' in n && Array.isArray(n.fills)) {
      const styleId = 'fillStyleId' in n ? n.fillStyleId : '';
      n.fills.forEach((paint, i) => {
        if (paint.type === 'SOLID' && paint.visible !== false && !bound(n, 'fills') && !styleId) {
          push('raw-fill', `fill[${i}] không bind variable/style`);
        }
      });
    }
    if (enabled.has('raw-text') && n.type === 'TEXT') {
      const styleId = (n as TextNode).textStyleId;
      if (!styleId || styleId === figma.mixed) push('raw-text', 'text không dùng text style');
    }

    // A2 / D7 — auto layout
    if (enabled.has('no-autolayout') && n.type === 'FRAME') {
      const f = n as FrameNode;
      // An SVG icon frame holds only vectors: auto layout would break the
      // drawing, so it is not a finding.
      const vectorsOnly = f.children.every((c) => VECTOR_TYPES.has(c.type));
      if (f.layoutMode === 'NONE' && f.children.length > 1 && !vectorsOnly && !/^(decor|overlay)\//.test(f.name)) {
        push('no-autolayout', `${f.children.length} lớp con nhưng layout NONE`);
      }
    }
    if (enabled.has('redundant-wrapper') && n.type === 'FRAME') {
      const f = n as FrameNode;
      if (
        isRedundantWrapper({
          type: 'FRAME',
          childCount: f.children.length,
          hasVisual:
            (Array.isArray(f.fills) && f.fills.length > 0) ||
            (Array.isArray(f.strokes) && f.strokes.length > 0) ||
            f.effects.length > 0 ||
            f.cornerRadius !== 0 ||
            f.clipsContent,
          hasPadding: f.paddingTop + f.paddingRight + f.paddingBottom + f.paddingLeft > 0,
        })
      ) {
        push('redundant-wrapper', 'frame chỉ bọc 1 lớp, không có style/padding riêng');
      }
    }

    // D9 — spacing on the 4/8 scale
    if (enabled.has('off-scale-spacing') && 'layoutMode' in n && (n as FrameNode).layoutMode !== 'NONE') {
      const f = n as FrameNode;
      const fields: [string, number | typeof figma.mixed][] = [
        ['itemSpacing', f.itemSpacing],
        ['counterAxisSpacing', f.counterAxisSpacing ?? 0],
        ['paddingTop', f.paddingTop],
        ['paddingRight', f.paddingRight],
        ['paddingBottom', f.paddingBottom],
        ['paddingLeft', f.paddingLeft],
      ];
      const bad = fields.filter(([, v]) => typeof v === 'number' && isOffScale(v));
      if (bad.length) push('off-scale-spacing', bad.map(([k, v]) => `${k}=${String(v)}`).join(', '));
    }

    // E — contrast (B2)
    if (enabled.has('contrast') && n.type === 'TEXT') {
      const t = n as TextNode;
      if (t.fills === figma.mixed) continue;
      const fg = solidColor(t);
      if (!fg) continue;
      const bg = backdropOf(t);
      if (!bg) {
        // Unverifiable is not a violation: keep it as a "nice" note so a
        // gradient backdrop never blocks handoff on its own.
        issues.push({ id: n.id, kind: 'contrast', name: n.name, detail: 'needs-check: nền gradient/ảnh — không tính được tỉ lệ', rect, severity: 'nice' });
        continue;
      }
      const weight = t.fontName === figma.mixed ? undefined : t.fontName.style;
      const size = t.fontSize === figma.mixed ? 14 : t.fontSize;
      const v = bg.length === 1 ? contrastVerdict(fg, bg[0], size, weight) : worstContrast(fg, bg, size, weight);
      if (!v.pass) {
        push('contrast', `${v.ratio}:1 < ${v.need}:1 (cần ${v.need === 3 ? 'chữ lớn' : 'chữ thường'})${bg.length > 1 ? ' — điểm tệ nhất của nền gradient' : ''}`);
      }
    }

    // E — tap target (B3): only real interactive layers, never icon glyphs.
    if (enabled.has('small-target') && 'width' in n && INTERACTIVE.test(n.name)) {
      const sev = targetSeverity(n.width, n.height);
      if (sev) issues.push({ id: n.id, kind: 'small-target', name: n.name, detail: `${Math.round(n.width)}×${Math.round(n.height)} < 44pt`, rect, severity: sev });
    }

    // B — strokes and radius bound to tokens too. A component set's dashed
    // purple frame and radius 5 are its chrome (create_component_set draws
    // them like the Figma UI does), not design values.
    const chrome = n.type === 'COMPONENT_SET';
    if (enabled.has('raw-stroke') && !chrome && 'strokes' in n && Array.isArray(n.strokes)) {
      const styleId = 'strokeStyleId' in n ? n.strokeStyleId : '';
      const boundStrokes = ((n as SceneNode & { boundVariables?: Record<string, unknown[]> }).boundVariables?.strokes ?? []) as unknown[];
      n.strokes.forEach((paint, i) => {
        if (paint.type === 'SOLID' && paint.visible !== false && !boundStrokes[i] && !styleId) push('raw-stroke', `stroke[${i}] không bind variable/style`);
      });
    }
    if (enabled.has('raw-radius') && !chrome && 'cornerRadius' in n && typeof n.cornerRadius === 'number' && n.cornerRadius > 0) {
      if (!bound(n, 'topLeftRadius') && !bound(n, 'cornerRadius')) push('raw-radius', `radius ${n.cornerRadius} không bind variable`);
    }
    if (enabled.has('primitive-bound')) {
      for (const vid of boundIds(n)) {
        const meta = primitives.get(vid);
        if (meta) push('primitive-bound', meta);
      }
    }
    // The binding is valid but the paint kept its old colour (manual
    // `boundVariables` in execute_code): Figma renders the stale colour and
    // every check that reads boundVariables passes. Local variables only.
    if (enabled.has('stale-paint')) {
      for (const field of ['fills', 'strokes'] as const) {
        const paints = field in n ? (n as GeometryMixin)[field] : null;
        if (!Array.isArray(paints)) continue;
        paints.forEach((paint: Paint, i: number) => {
          const alias = paint.type === 'SOLID' ? paint.boundVariables?.color : undefined;
          const v = alias ? localVars.get(alias.id) : undefined;
          if (!v || paint.type !== 'SOLID') return;
          const value = v.resolveForConsumer(n).value as RGB | undefined;
          if (value && typeof value === 'object' && 'r' in value && colorsDiffer(paint.color, value)) {
            push('stale-paint', `${field}[${i}] bind "${v.name}" = ${toHex(value)} nhưng paint vẫn là ${toHex(paint.color)} → Figma vẽ màu cũ`);
          }
        });
      }
    }

    // F1 — placeholder copy
    if (enabled.has('lorem') && n.type === 'TEXT' && LOREM.test((n as TextNode).characters)) push('lorem', 'nội dung giả (lorem ipsum)');

    // A — structure
    if (enabled.has('variant-explosion') && n.type === 'COMPONENT_SET' && n.children.length > 50) {
      push('variant-explosion', `${n.children.length} variant > 50`);
    }
    if (enabled.has('outside-section') && pageHasSections && n.parent?.type === 'PAGE' && n.type === 'FRAME') {
      push('outside-section', 'frame top-level nằm ngoài Section');
    }

    // G1 — hygiene
    if (enabled.has('hidden-layer') && n.visible === false) push('hidden-layer');
  }

  // Orphan styles: defined locally but referenced by nothing in the whole
  // file (a style used on another page is not an orphan).
  if (enabled.has('orphan-token')) {
    const used = new Set<string>();
    await figma.loadAllPagesAsync();
    // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice -- pages loaded just above
    for (const n of figma.root.findAll(() => true)) {
      for (const key of ['fillStyleId', 'strokeStyleId', 'effectStyleId', 'textStyleId', 'gridStyleId'] as const) {
        if (key in n) {
          const v = (n as unknown as Record<string, unknown>)[key];
          if (typeof v === 'string' && v) used.add(v);
        }
      }
    }
    const [paint, text, effect, grid] = await Promise.all([
      figma.getLocalPaintStylesAsync(),
      figma.getLocalTextStylesAsync(),
      figma.getLocalEffectStylesAsync(),
      figma.getLocalGridStylesAsync(),
    ]);
    for (const s of [...paint, ...text, ...effect, ...grid]) {
      if (!used.has(s.id)) issues.push({ id: s.id, kind: 'orphan-token', name: s.name, detail: 'style không được dùng' });
    }
  }

  // Icon slots whose glyph is not on the slot centre (measured ink).
  if (enabled.has('icon-offcenter')) {
    for (const i of offCentreIcons(root.type === 'PAGE' ? root.children : [root])) {
      const n = nodes.find((x) => x.id === i.id);
      const rect = n && 'x' in n ? { x: Math.round(n.x), y: Math.round(n.y), w: Math.round(n.width), h: Math.round(n.height) } : undefined;
      issues.push({ id: i.id, kind: 'icon-offcenter', name: i.name, detail: i.detail, rect });
    }
  }

  const report = buildReport(root.type === 'PAGE' ? `page ${root.name}` : `node ${root.name} (${root.id})`, nodes.length, issues, p.limit);
  if (p.format === 'markdown') {
    return {
      markdown: toQaMarkdown(report, { file: figma.root.name, author: `figma-agent · ${figma.currentUser?.name ?? 'agent'}` }),
      counts: report.counts,
      severity: report.severity,
    };
  }
  return {
    scope: report.scope,
    scanned: report.scanned,
    totalIssues: report.issues.length,
    counts: report.counts,
    severity: report.severity,
    samples: report.samples,
    truncated: report.truncated,
  };
}
