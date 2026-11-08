// Planning for `create_component_set` (figma-ui-flow Stage 3, design-system.md
// §5–6). Pure: names, property definitions and the variant budget are
// validated before anything is drawn.

export type ComponentPropType = 'TEXT' | 'BOOLEAN' | 'INSTANCE_SWAP';

export interface PropertySpec {
  name: string;
  type: ComponentPropType;
  default: string | boolean;
  // Layer names inside each variant the property drives: characters (TEXT),
  // visible (BOOLEAN) or the swapped instance (INSTANCE_SWAP).
  targets: string[];
}

export interface VariantSpec {
  props: Record<string, string>;
}

export interface ComponentSetPlan {
  axes: string[];
  names: string[];
  problems: string[];
  warnings: string[];
}

// design-system.md §6.4: above ~50 variants, move axes to properties/modes.
export const VARIANT_BUDGET = 50;

// "Size=md, State=Default" — axes in a stable order so every variant of the
// set spells its name the same way.
export function variantName(props: Record<string, string>, axes: string[]): string {
  return axes.map((a) => `${a}=${props[a]}`).join(', ');
}

const SIZE_SHORT = /^(xs|sm|md|lg|xl|2xl|3xl)$/;
const SIZE_LONG = /^(extra small|small|medium|large|extra large)$/i;

export function planComponentSet(name: string, variants: VariantSpec[], properties: PropertySpec[] = []): ComponentSetPlan {
  const plan: ComponentSetPlan = { axes: [], names: [], problems: [], warnings: [] };
  if (!name.trim()) plan.problems.push('name: tên component set không được rỗng');
  if (variants.length === 0) plan.problems.push('variants: cần ít nhất 1 variant');

  const axes: string[] = [];
  for (const v of variants) for (const k of Object.keys(v.props)) if (!axes.includes(k)) axes.push(k);
  plan.axes = axes;
  if (axes.length === 0 && variants.length > 1) plan.problems.push('variants: nhiều variant cần ít nhất một property (vd State)');

  for (const axis of axes) {
    if (/[=,]/.test(axis)) plan.problems.push(`property "${axis}": không được chứa "=" hoặc ","`);
    // §6.2: short nouns, Title Case ("Size", "Has icon").
    if (axis[0] && axis[0] !== axis[0].toUpperCase()) plan.warnings.push(`property "${axis}": nên viết hoa chữ đầu (Size, State, Style)`);
  }

  const seen = new Set<string>();
  variants.forEach((v, i) => {
    const missing = axes.filter((a) => !(a in v.props) || !String(v.props[a]).trim());
    if (missing.length) {
      plan.problems.push(`variant #${i + 1}: thiếu giá trị cho ${missing.join(', ')}`);
      return;
    }
    for (const [k, val] of Object.entries(v.props)) {
      if (/[=,]/.test(val)) plan.problems.push(`variant #${i + 1}: giá trị "${k}=${val}" không được chứa "=" hoặc ","`);
    }
    const n = variantName(v.props, axes);
    if (seen.has(n)) plan.problems.push(`variant "${n}": bị trùng`);
    seen.add(n);
    plan.names.push(n);
  });

  if (variants.length > VARIANT_BUDGET) {
    plan.warnings.push(
      `${variants.length} variant > ${VARIANT_BUDGET}: chuyển bớt trục sang boolean/instance-swap property hoặc variable mode (design-system §6.4)`,
    );
  }

  // §6.2: one vocabulary per axis — "md" and "Large" in the same set is a smell.
  for (const axis of axes) {
    const values = new Set(variants.map((v) => v.props[axis]));
    const short = [...values].some((x) => SIZE_SHORT.test(x));
    const long = [...values].some((x) => SIZE_LONG.test(x));
    if (short && long) plan.warnings.push(`property "${axis}": trộn "sm/md/lg" với "Small/Medium/Large" — chọn một kiểu`);
  }

  const propNames = new Set<string>();
  for (const p of properties) {
    if (!p.name.trim()) plan.problems.push('properties: có property tên rỗng');
    if (propNames.has(p.name) || axes.includes(p.name)) plan.problems.push(`property "${p.name}": trùng tên`);
    propNames.add(p.name);
    if (p.type === 'BOOLEAN' && typeof p.default !== 'boolean') plan.problems.push(`property "${p.name}": BOOLEAN cần default true/false`);
    if (p.type !== 'BOOLEAN' && typeof p.default !== 'string') plan.problems.push(`property "${p.name}": ${p.type} cần default dạng chuỗi`);
    if (!p.targets.length) plan.warnings.push(`property "${p.name}": không gắn vào layer nào (targets rỗng)`);
  }
  return plan;
}
