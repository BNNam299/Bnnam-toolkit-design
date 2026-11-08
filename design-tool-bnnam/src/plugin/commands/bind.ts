// figma-ui-flow Stage 7 fix — bind raw fills, strokes, spacing and radius
// to Semantic variables in bulk. Matching lives in ../../shared/color.ts;
// dryRun (default) only reports.
import { exactNumber, nearestColor, type ColorCandidate, type Field, type NumberCandidate } from '../../shared/color';
import type { BindVariablesInput } from '../../shared/schemas';
import { parseColor, toHex } from '../../shared/values';
import { getNode } from '../util';

type Bindable = SceneNode & { setBoundVariable(field: VariableBindableNodeField, v: Variable | null): void };

interface Change {
  id: string;
  name: string;
  field: string;
  from: string;
  to: string;
  distance?: number;
}

async function resolveValue(v: Variable, byId: Map<string, Variable>, defaults: Map<string, string>): Promise<VariableValue | undefined> {
  let cur: Variable | undefined = v;
  for (let i = 0; i < 10 && cur; i++) {
    const raw: VariableValue = cur.valuesByMode[defaults.get(cur.variableCollectionId) ?? ''] ?? Object.values(cur.valuesByMode)[0];
    if (typeof raw === 'object' && raw !== null && 'type' in raw && (raw as VariableAlias).type === 'VARIABLE_ALIAS') {
      cur = byId.get((raw as VariableAlias).id);
      continue;
    }
    return raw;
  }
  return undefined;
}

export async function bindVariables(p: BindVariablesInput) {
  const root = await getNode(p.rootId);
  const [vars, collections] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
  ]);
  const byId = new Map(vars.map((v) => [v.id, v]));
  const defaults = new Map(collections.map((c) => [c.id, c.defaultModeId]));
  const byName = new Map<string, Variable>();
  for (const v of vars) {
    byName.set(`${collections.find((c) => c.id === v.variableCollectionId)?.name}/${v.name}`, v);
    if (!byName.has(v.name)) byName.set(v.name, v);
  }

  const colors: ColorCandidate[] = [];
  const numbers: NumberCandidate[] = [];
  for (const v of vars) {
    const value = await resolveValue(v, byId, defaults);
    if (v.resolvedType === 'COLOR' && value && typeof value === 'object' && 'r' in value) {
      colors.push({ id: v.id, name: v.name, scopes: v.scopes, value: { r: value.r, g: value.g, b: value.b } });
    } else if (v.resolvedType === 'FLOAT' && typeof value === 'number') {
      numbers.push({ id: v.id, name: v.name, scopes: v.scopes, value });
    }
  }

  // Explicit map keys: "#2563EB" (colour) or "16" (number).
  const explicit = new Map<string, Variable>();
  for (const [k, name] of Object.entries(p.map ?? {})) {
    const v = byName.get(name) ?? byId.get(name);
    if (!v) throw new Error(`map: variable "${name}" không tồn tại`);
    explicit.set(/^#/.test(k) ? toHex(parseColor(k)).slice(0, 7) : String(Number(k)), v);
  }

  const fields = new Set(p.fields);
  const changes: Change[] = [];
  const ambiguous: { id: string; name: string; field: string; value: string; candidates: string[] }[] = [];
  let unmatched = 0;
  let skippedInstances = 0;

  const pickColor = (rgb: RGB, field: Field) => {
    const hit = explicit.get(toHex(rgb));
    if (hit) return { variable: hit, distance: 0 };
    if (!p.auto) return null;
    const m = nearestColor(rgb, field, colors, p.tolerance);
    if (m.kind === 'match') return { variable: byId.get(m.variable.id)!, distance: m.distance };
    if (m.kind === 'ambiguous') return { ambiguous: m.candidates.map((c) => c.name) };
    return null;
  };
  const pickNumber = (n: number, field: Field) => {
    const hit = explicit.get(String(n));
    if (hit) return { variable: hit, distance: 0 };
    if (!p.auto) return null;
    const m = exactNumber(n, field, numbers);
    if (m.kind === 'match') return { variable: byId.get(m.variable.id)!, distance: 0 };
    if (m.kind === 'ambiguous') return { ambiguous: m.candidates.map((c) => c.name) };
    return null;
  };

  const nodes: SceneNode[] = [];
  if ('findAll' in root) nodes.push(...(root as ChildrenMixin).findAll(() => true));
  if (root.type !== 'PAGE' && root.type !== 'DOCUMENT') nodes.unshift(root as SceneNode);

  for (const n of nodes) {
    // Instances (and their sublayers) are overrides: fix the main component
    // instead. Sections only carry Figma's default canvas fill.
    if (n.id.startsWith('I') || n.type === 'INSTANCE' || n.type === 'SECTION') {
      skippedInstances++;
      continue;
    }
    const bv = (n as SceneNode & { boundVariables?: Record<string, unknown> }).boundVariables ?? {};

    for (const kind of ['fills', 'strokes'] as const) {
      if (!fields.has(kind) || !(kind in n)) continue;
      const styleId = kind === 'fills' ? (n as MinimalFillsMixin).fillStyleId : (n as MinimalStrokesMixin).strokeStyleId;
      const paints = (n as MinimalFillsMixin & MinimalStrokesMixin)[kind];
      if (!Array.isArray(paints) || styleId) continue;
      const boundList = (bv[kind] as unknown[] | undefined) ?? [];
      let next: Paint[] | null = null;
      paints.forEach((paint: Paint, i: number) => {
        if (paint.type !== 'SOLID' || paint.visible === false || boundList[i]) return;
        const field: Field = kind === 'strokes' ? 'stroke' : n.type === 'TEXT' ? 'text-fill' : 'fill';
        const pick = pickColor(paint.color, field);
        const from = toHex(paint.color);
        if (!pick) return void unmatched++;
        if ('ambiguous' in pick) return void ambiguous.push({ id: n.id, name: n.name, field: `${kind}[${i}]`, value: from, candidates: pick.ambiguous! });
        changes.push({ id: n.id, name: n.name, field: `${kind}[${i}]`, from, to: pick.variable.name, distance: pick.distance });
        next ??= [...paints];
        next[i] = figma.variables.setBoundVariableForPaint(paint, 'color', pick.variable);
      });
      if (next && !p.dryRun) (n as MinimalFillsMixin & MinimalStrokesMixin)[kind] = next;
    }

    if (fields.has('spacing') && 'layoutMode' in n && (n as FrameNode).layoutMode !== 'NONE') {
      const f = n as FrameNode;
      const spacing: [VariableBindableNodeField, number][] = [
        ['itemSpacing', f.itemSpacing],
        ['paddingTop', f.paddingTop],
        ['paddingRight', f.paddingRight],
        ['paddingBottom', f.paddingBottom],
        ['paddingLeft', f.paddingLeft],
      ];
      if (f.layoutWrap === 'WRAP' && typeof f.counterAxisSpacing === 'number') spacing.push(['counterAxisSpacing', f.counterAxisSpacing]);
      for (const [field, value] of spacing) {
        if (bv[field] || value === 0 || (f.primaryAxisAlignItems === 'SPACE_BETWEEN' && field === 'itemSpacing')) continue;
        const pick = pickNumber(value, 'gap');
        if (!pick) {
          unmatched++;
          continue;
        }
        if ('ambiguous' in pick) {
          ambiguous.push({ id: n.id, name: n.name, field, value: String(value), candidates: pick.ambiguous! });
          continue;
        }
        changes.push({ id: n.id, name: n.name, field, from: String(value), to: pick.variable.name });
        if (!p.dryRun) (n as Bindable).setBoundVariable(field, pick.variable);
      }
    }

    if (fields.has('radius') && 'cornerRadius' in n && typeof (n as RectangleNode).cornerRadius === 'number') {
      const r = (n as RectangleNode).cornerRadius as number;
      if (r > 0 && !bv.topLeftRadius && !bv.cornerRadius) {
        const pick = pickNumber(r, 'radius');
        if (!pick) unmatched++;
        else if ('ambiguous' in pick) ambiguous.push({ id: n.id, name: n.name, field: 'radius', value: String(r), candidates: pick.ambiguous! });
        else {
          changes.push({ id: n.id, name: n.name, field: 'radius', from: String(r), to: pick.variable.name });
          if (!p.dryRun && 'topLeftRadius' in n) {
            for (const corner of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'] as const) {
              (n as Bindable).setBoundVariable(corner, pick.variable);
            }
          }
        }
      }
    }
  }

  return {
    dryRun: p.dryRun,
    changed: changes.length,
    changes: changes.slice(0, p.limit),
    ambiguous: ambiguous.slice(0, p.limit),
    ambiguousCount: ambiguous.length,
    unmatched,
    skippedInstances,
    hint: p.dryRun
      ? 'Chưa ghi gì. Xem lại changes/ambiguous, thêm map cho các giá trị mơ hồ, rồi gọi lại với dryRun: false.'
      : 'Đã bind. Chạy audit_design để kiểm raw-fill còn lại; giá trị không khớp token nào cần thêm token hoặc sửa thiết kế.',
  };
}
