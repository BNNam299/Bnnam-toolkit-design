// Token helpers for `create_variables` / `import_tokens` (figma-ui-flow Giai
// đoạn 2). Pure so the encoding and validation rules stay unit-testable.

export type VariableType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

export type TokenValue = string | number | boolean | { alias: string };

export interface VariableSpec {
  name: string;
  type: VariableType;
  scopes?: string[];
  values: Record<string, TokenValue>;
}

export interface CreateVariablesInputShape {
  collection: string;
  modes?: string[];
  variables: VariableSpec[];
}

export interface VariablePlan {
  collection: string;
  modes: string[];
  variables: VariableSpec[];
  problems: string[];
  warnings: string[];
  // Names that already exist in the collection and will be overwritten.
  updating: string[];
}

export function parseColor(input: string): { r: number; g: number; b: number; a: number } {
  const hex = input.trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) throw new Error(`Invalid color "${input}" — use #RGB, #RRGGBB or #RRGGBBAA`);
  let full = hex;
  if (hex.length === 3) full = hex.split('').map((c) => c + c).join('');
  if (full.length === 6) full += 'ff';
  return {
    r: parseInt(full.slice(0, 2), 16) / 255,
    g: parseInt(full.slice(2, 4), 16) / 255,
    b: parseInt(full.slice(4, 6), 16) / 255,
    a: parseInt(full.slice(6, 8), 16) / 255,
  };
}

export function encodeValue(type: VariableType, value: TokenValue): unknown {
  if (typeof value === 'object' && value !== null && 'alias' in value) {
    if (!value.alias.trim()) throw new Error('Alias cần tên variable đích');
    return value; // resolved by the plugin via createVariableAlias
  }
  switch (type) {
    case 'COLOR':
      if (typeof value !== 'string') throw new Error(`COLOR cần chuỗi hex, nhận ${typeof value}`);
      return parseColor(value);
    case 'FLOAT':
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`FLOAT cần số, nhận ${typeof value}`);
      return value;
    case 'STRING':
      if (typeof value !== 'string') throw new Error(`STRING cần chuỗi, nhận ${typeof value}`);
      return value;
    case 'BOOLEAN':
      if (typeof value !== 'boolean') throw new Error(`BOOLEAN cần true/false, nhận ${typeof value}`);
      return value;
  }
}

export const VARIABLE_TYPES: VariableType[] = ['COLOR', 'FLOAT', 'STRING', 'BOOLEAN'];

// Validates names, modes and alias targets before anything touches the file.
// `existingNames` are the variables already in the target collection.
export function planVariables(
  input: CreateVariablesInputShape,
  existingNames: string[] = [],
  onExisting: 'error' | 'skip' | 'update' = 'error',
): VariablePlan {
  const plan: VariablePlan = {
    collection: input.collection.trim(),
    modes: input.modes?.length ? [...input.modes] : ['Value'],
    variables: [],
    problems: [],
    warnings: [],
    updating: [],
  };
  const existing = new Set(existingNames);
  if (!plan.collection) plan.problems.push('collection: tên không được rỗng');
  if (new Set(plan.modes).size !== plan.modes.length) plan.problems.push('modes: tên mode bị trùng');

  const seen = new Set<string>();
  for (const v of input.variables) {
    if (!v.name.trim()) {
      plan.problems.push('variable: có mục tên rỗng');
      continue;
    }
    if (seen.has(v.name)) {
      plan.problems.push(`variable "${v.name}": bị khai báo trùng`);
      continue;
    }
    if (existing.has(v.name)) {
      if (onExisting === 'error') {
        plan.problems.push(`variable "${v.name}": đã tồn tại trong "${plan.collection}" (dùng onExisting: "skip" hoặc "update")`);
        continue;
      }
      if (onExisting === 'skip') {
        plan.warnings.push(`variable "${v.name}": đã tồn tại, giữ nguyên`);
        seen.add(v.name);
        continue;
      }
      plan.updating.push(v.name);
    }
    if (!VARIABLE_TYPES.includes(v.type)) {
      plan.problems.push(`variable "${v.name}": type "${v.type}" không hợp lệ`);
      continue;
    }
    const modeNames = Object.keys(v.values);
    for (const m of modeNames) {
      if (!plan.modes.includes(m)) plan.problems.push(`variable "${v.name}": value cho mode "${m}" không khai báo trong modes`);
    }
    const missing = plan.modes.filter((m) => !(m in v.values));
    if (missing.length) {
      // The master is explicit: a mode without a value silently falls back.
      plan.problems.push(`variable "${v.name}": thiếu value cho mode ${missing.join(', ')}`);
      continue;
    }
    for (const [mode, value] of Object.entries(v.values)) {
      try {
        encodeValue(v.type, value);
      } catch (e) {
        plan.problems.push(`variable "${v.name}" (${mode}): ${(e as Error).message}`);
      }
    }
    seen.add(v.name);
    plan.variables.push(v);
  }
  // design-system.md §1: primitives are raw values hidden from pickers.
  for (const v of plan.variables) {
    const hasAlias = Object.values(v.values).some((x) => typeof x === 'object');
    if (/primitive/i.test(plan.collection) && v.scopes && v.scopes.length > 0) {
      plan.warnings.push(`variable "${v.name}": primitive nên có scopes: [] để không hiện trong picker (design-system §1)`);
    }
    if (/primitive/i.test(plan.collection) && hasAlias) {
      plan.warnings.push(`variable "${v.name}": primitive không nên là alias`);
    }
  }
  if (plan.modes.length > 1) {
    plan.warnings.push(
      `Cần ${plan.modes.length} modes; nếu file/gói chỉ cho 1 mode thì Figma sẽ từ chối \`addMode\` và chỉ mode "${plan.modes[0]}" được ghi.`,
    );
  }
  return plan;
}

// -- Design Tokens Community Group (DTCG) import/export ---------------------

export interface DtcgToken {
  $type?: string;
  $value: unknown;
  $extensions?: { modes?: Record<string, unknown> };
}

export type DtcgTree = { [key: string]: DtcgToken | DtcgTree };

const isToken = (v: unknown): v is DtcgToken =>
  !!v && typeof v === 'object' && '$value' in (v as Record<string, unknown>);

// Flattens { primitives: { color: { blue: { 600: { $value } } } } } into
// "primitives/color/blue/600" (Figma-style slash names).
export function flattenDtcg(tree: DtcgTree, prefix = ''): { path: string; token: DtcgToken }[] {
  const out: { path: string; token: DtcgToken }[] = [];
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}/${key}` : key;
    if (isToken(value)) out.push({ path, token: value });
    else out.push(...flattenDtcg(value as DtcgTree, path));
  }
  return out;
}

const DTCG_TYPE: Record<string, VariableType> = {
  color: 'COLOR',
  dimension: 'FLOAT',
  number: 'FLOAT',
  string: 'STRING',
  boolean: 'BOOLEAN',
};

// DTCG value → the DSL value. `{primitives.color.blue.600}` becomes an alias.
export function fromDtcg(type: string, value: unknown): TokenValue {
  if (typeof value === 'string' && /^\{[^}]+\}$/.test(value)) {
    return { alias: value.slice(1, -1).replace(/\./g, '/') };
  }
  const mapped = DTCG_TYPE[type];
  if (!mapped) throw new Error(`DTCG type "${type}" chưa hỗ trợ`);
  if (mapped === 'FLOAT' && typeof value === 'string') {
    const m = /^(-?[\d.]+)/.exec(value);
    if (!m) throw new Error(`Không đọc được số từ "${value}"`);
    return Number(m[1]);
  }
  return value as TokenValue;
}

export function dtcgTypeToVariable(type: string): VariableType {
  const mapped = DTCG_TYPE[type];
  if (!mapped) throw new Error(`DTCG type "${type}" chưa hỗ trợ`);
  return mapped;
}

// -- lint: same rules and wording as figma-ui-flow scripts/check_tokens.py ----
// Kept in lockstep with the Python script (tests/tokens.test.ts runs both on
// the same fixture) so a JSON that passes one passes the other.

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ALIAS = /^\{([^{}]+)\}$/;
const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export interface TokenLint {
  tokens: number;
  modes: string[];
  errors: string[];
  warnings: string[];
  contrast_pass: string[];
}

type Flat = Map<string, DtcgToken>;

function flatDots(tree: DtcgTree): Flat {
  const out: Flat = new Map();
  for (const { path, token } of flattenDtcg(tree)) out.set(path.replace(/\//g, '.'), token);
  return out;
}

function modeValues(t: DtcgToken): Record<string, unknown> {
  const modes = t.$extensions?.modes;
  if (modes && typeof modes === 'object' && Object.keys(modes).length) return { ...modes };
  return { default: t.$value };
}

function resolveDots(name: string, mode: string, tokens: Flat, stack: string[] = []): unknown {
  if (stack.includes(name)) throw new Error('alias cycle: ' + [...stack, name].join(' → '));
  const t = tokens.get(name);
  if (!t) throw new RangeError(name);
  const vals = modeValues(t);
  const v = mode in vals ? vals[mode] : 'default' in vals ? vals.default : t.$value;
  const m = typeof v === 'string' ? ALIAS.exec(v) : null;
  return m ? resolveDots(m[1], mode, tokens, [...stack, name]) : v;
}

const pyRepr = (v: unknown) => (typeof v === 'string' ? `'${v}'` : String(v));
const pyFloat = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));

function tierOf(name: string): 'primitive' | 'semantic' | null {
  const root = name.split('.')[0].toLowerCase();
  if (root.includes('primitive')) return 'primitive';
  if (root.includes('semantic')) return 'semantic';
  return null;
}
const stripTier = (name: string) => (tierOf(name) ? name.split('.').slice(1).join('.') : name);

function hexContrast(a: string, b: string): number {
  const lum = (h: string) => {
    let x = h.replace('#', '');
    if (x.length === 3) x = x.split('').map((c) => c + c).join('');
    const ch = (i: number) => {
      const c = parseInt(x.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
  };
  const [la, lb] = [lum(a), lum(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function autoPairs(tokens: Flat): [string, string, number][] {
  const byShort = new Map<string, string>();
  for (const n of tokens.keys()) byShort.set(stripTier(n), n);
  const bgs = ['color.bg.default', 'color.surface.default', 'color.surface.raised'].filter((s) => byShort.has(s)).map((s) => byShort.get(s)!);
  const pairs: [string, string, number][] = [];
  for (const [short, full] of byShort) {
    if (short.startsWith('color.text.') && !/(disabled|inverse|on-action)$/.test(short)) pairs.push(...bgs.map((bg): [string, string, number] => [full, bg, 4.5]));
    else if (short.startsWith('color.icon.') && !/(disabled|inverse)$/.test(short)) pairs.push(...bgs.map((bg): [string, string, number] => [full, bg, 3.0]));
    else if (short === 'color.border.strong' || short === 'color.border.focus') pairs.push(...bgs.map((bg): [string, string, number] => [full, bg, 3.0]));
  }
  const onAction = byShort.get('color.text.on-action');
  for (const s of ['color.action.primary', 'color.action.destructive']) {
    if (onAction && byShort.has(s)) pairs.push([onAction, byShort.get(s)!, 4.5]);
  }
  return pairs;
}

export function lintTokens(tree: DtcgTree, extraPairs: [string, string, number][] = []): TokenLint {
  const tokens = flatDots(tree);
  const errors: string[] = [];
  const warnings: string[] = [];
  const passes: string[] = [];
  if (tokens.size === 0) errors.push('No token with "$value" found.');

  const allModes = new Set<string>();
  for (const t of tokens.values()) for (const m of Object.keys(modeValues(t))) allModes.add(m);

  for (const [name, tok] of tokens) {
    const bad = name.split('.').filter((p) => !KEBAB.test(p));
    if (bad.length) errors.push(`[name] ${name}: invalid segment(s) [${bad.map(pyRepr).join(', ')}] (use lowercase kebab-case)`);

    const vals = modeValues(tok);
    const tier = tierOf(name);
    for (const [mode, v] of Object.entries(vals)) {
      const isAlias = typeof v === 'string' && ALIAS.test(v);
      if (isAlias) {
        try {
          resolveDots(name, mode, tokens);
        } catch (e) {
          if (e instanceof RangeError) errors.push(`[alias] ${name} (${mode}): points to a missing token '${e.message}'`);
          else errors.push(`[alias] ${name} (${mode}): ${(e as Error).message}`);
          continue;
        }
      }
      if (tier === 'primitive' && isAlias) errors.push(`[tier] ${name}: a primitive must not be an alias`);
      if (tier === 'semantic' && !isAlias) warnings.push(`[tier] ${name} (${mode}): semantic should alias a primitive, got raw value ${pyRepr(v)}`);
    }

    if (Object.keys(vals).length > 1 || !('default' in vals)) {
      const missing = [...allModes].filter((m) => m !== 'default' && !(m in vals)).sort();
      if (missing.length) warnings.push(`[mode] ${name}: missing value for mode(s) [${missing.map(pyRepr).join(', ')}]`);
    }

    const short = stripTier(name);
    if (['space', 'spacing', 'radius'].includes(short.split('.')[0])) {
      for (const mode of Object.keys(vals)) {
        let v: unknown;
        try {
          v = resolveDots(name, mode, tokens);
        } catch {
          continue;
        }
        let num: number | null = null;
        if (typeof v === 'number') num = v;
        else if (typeof v === 'string') {
          const m = /^(-?\d+(\.\d+)?)(px)?$/.exec(v.trim());
          if (m) num = parseFloat(m[1]);
        }
        if (num !== null && ![0, 1, 2, 999].includes(num) && num % 4 !== 0) warnings.push(`[grid] ${name} = ${String(v)}: not on the 4-pt grid`);
      }
    }
  }

  const pairs = [...autoPairs(tokens), ...extraPairs];
  const modes = [...allModes].filter((m) => m !== 'default').sort();
  const toCheck = modes.length ? modes : ['default'];
  const seen = new Set<string>();
  for (const [fg, bg, mn] of pairs) {
    for (const mode of toCheck) {
      const key = `${fg}|${bg}|${mode}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let a: unknown;
      let b: unknown;
      try {
        a = resolveDots(fg, mode, tokens);
        b = resolveDots(bg, mode, tokens);
      } catch (e) {
        // Python prints a KeyError with quotes, a cycle error without.
        const why = e instanceof RangeError ? `'${e.message}'` : (e as Error).message;
        errors.push(`[contrast] ${fg} / ${bg} (${mode}): cannot resolve token ${why}`);
        continue;
      }
      if (!(typeof a === 'string' && HEX.test(a) && typeof b === 'string' && HEX.test(b))) {
        warnings.push(`[contrast] ${fg} / ${bg} (${mode}): skipped, only hex is supported (${pyRepr(a)}, ${pyRepr(b)})`);
        continue;
      }
      const r = hexContrast(a, b);
      const line = `${fg} on ${bg} (${mode}): ${r.toFixed(2)}:1 (needs ≥ ${pyFloat(mn)})`;
      if (r >= mn) passes.push(line);
      else errors.push('[contrast] ' + line);
    }
  }
  return { tokens: tokens.size, modes: [...allModes].sort(), errors, warnings, contrast_pass: passes };
}

// -- import: DTCG tree → create_variables batches ---------------------------

export interface ImportPlan {
  collections: (CreateVariablesInputShape & { variables: VariableSpec[] })[];
  skipped: string[];
  lint: TokenLint;
}

const titleCase = (s: string) => s.replace(/(^|[\s_-])(\w)/g, (_m, sep: string, c: string) => (sep === '-' || sep === '_' ? ' ' : sep) + c.toUpperCase());

// Semantic scopes by role (design-system.md §1): picker shows the token only
// where it belongs. Primitives get [] so they stay out of pickers entirely.
export function inferScopes(name: string, type: VariableType, primitive: boolean): string[] {
  if (primitive) return [];
  const n = name.toLowerCase();
  if (type === 'COLOR') {
    if (/(^|\/)text(\/|$)/.test(n)) return ['TEXT_FILL'];
    if (/(^|\/)icon(\/|$)/.test(n)) return ['SHAPE_FILL', 'STROKE_COLOR'];
    if (/(^|\/)border(\/|$)/.test(n)) return ['STROKE_COLOR'];
    if (/(^|\/)(bg|surface|background|action|feedback)(\/|$)/.test(n)) return ['FRAME_FILL', 'SHAPE_FILL'];
    return ['ALL_FILLS', 'STROKE_COLOR'];
  }
  if (type === 'FLOAT') {
    if (/(^|\/)(space|spacing|gap|inset|padding)(\/|$)/.test(n)) return ['GAP'];
    if (/(^|\/)radius(\/|$)/.test(n)) return ['CORNER_RADIUS'];
    // Before the size rule: "border/width/thin" is a stroke weight, not a width.
    if (/(^|\/)(border-width|border\/width|stroke)(\/|$)/.test(n)) return ['STROKE_FLOAT'];
    if (/(^|\/)(size|width|height)(\/|$)/.test(n)) return ['WIDTH_HEIGHT'];
    if (/(^|\/)(line-height|leading)(\/|$)/.test(n)) return ['LINE_HEIGHT'];
    if (/(^|\/)(font-size|text-size|type|typography)(\/|$)/.test(n)) return ['FONT_SIZE'];
    if (/(^|\/)opacity(\/|$)/.test(n)) return ['OPACITY'];
    // duration/easing are prototype-only: hidden from layer pickers.
    if (/(^|\/)(duration|motion|easing)(\/|$)/.test(n)) return [];
    return ['ALL_SCOPES'];
  }
  if (type === 'STRING') return /font/.test(n) ? ['FONT_FAMILY', 'FONT_STYLE'] : ['TEXT_CONTENT'];
  return ['ALL_SCOPES'];
}

// Each top-level group becomes a collection ("primitives" → "Primitives");
// aliases "{primitives.color.white}" become { alias: "Primitives/color/white" }.
// Collections are ordered so alias targets are created first.
export function planTokenImport(tree: DtcgTree): ImportPlan {
  const lint = lintTokens(tree);
  const roots = Object.keys(tree).filter((k) => !k.startsWith('$'));
  const collName = new Map(roots.map((r) => [r, titleCase(r)]));
  const skipped: string[] = [];
  const collections: ImportPlan['collections'] = [];

  const aliasTarget = (raw: string): string => {
    const [root, ...rest] = raw.split('/');
    return collName.has(root) ? `${collName.get(root)}/${rest.join('/')}` : raw;
  };

  for (const root of roots) {
    const flat = flattenDtcg(tree[root] as DtcgTree);
    const modeKeys: string[] = [];
    for (const { token } of flat) for (const m of Object.keys(token.$extensions?.modes ?? {})) if (!modeKeys.includes(m)) modeKeys.push(m);
    const modes = modeKeys.length ? modeKeys.map(titleCase) : ['Value'];
    const primitive = /primitive/i.test(root);
    const variables: VariableSpec[] = [];
    for (const { path, token } of flat) {
      const type = token.$type ?? '';
      if (!DTCG_TYPE[type]) {
        skipped.push(`${root}/${path}: $type "${type || '(thiếu)'}" không phải variable — dùng create_styles`);
        continue;
      }
      const vtype = DTCG_TYPE[type];
      const perMode = token.$extensions?.modes;
      const values: Record<string, TokenValue> = {};
      modes.forEach((mode, i) => {
        const raw = perMode && modeKeys[i] in perMode ? perMode[modeKeys[i]] : token.$value;
        const v = fromDtcg(type, raw);
        values[mode] = typeof v === 'object' ? { alias: aliasTarget(v.alias) } : v;
      });
      variables.push({ name: path, type: vtype, scopes: inferScopes(path, vtype, primitive), values });
    }
    if (variables.length) collections.push({ collection: collName.get(root)!, modes, variables });
  }

  // Alias targets first: a collection that points at another goes after it.
  const dependsOn = (c: ImportPlan['collections'][number]) =>
    new Set(
      c.variables.flatMap((v) => Object.values(v.values).filter((x): x is { alias: string } => typeof x === 'object').map((x) => x.alias.split('/')[0])),
    );
  collections.sort((a, b) => (dependsOn(b).has(a.collection) ? -1 : dependsOn(a).has(b.collection) ? 1 : 0));
  return { collections, skipped, lint };
}

// -- export: Figma variables → DTCG / CSS / Swift / Kotlin -------------------

export interface ExportVariable {
  name: string;
  type: VariableType;
  // Aliases are "Collection/variable/name".
  values: Record<string, TokenValue>;
}
export interface ExportCollection {
  name: string;
  modes: string[];
  variables: ExportVariable[];
}
export interface ExportTextStyle {
  name: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number | string;
  letterSpacing: number | string;
}
export type ExportFormat = 'json' | 'css' | 'swift' | 'kotlin';

const kebab = (s: string) => slugPart(s).join('-');
function slugPart(s: string): string[] {
  return s
    .split(/[/\s._-]+/)
    .filter(Boolean)
    .map((p) => p.replace(/[^A-Za-z0-9]/g, '').toLowerCase())
    .filter(Boolean);
}
const camel = (s: string) => {
  const parts = slugPart(s);
  const out = parts.map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join('');
  return /^\d/.test(out) ? `_${out}` : out;
};
const pascal = (s: string) => {
  const c = camel(s).replace(/^_/, '');
  return c[0].toUpperCase() + c.slice(1);
};

const isDuration = (name: string) => /(^|\/)(duration|motion)(\/|$)/.test(name);
const isUnitless = (name: string) => /(^|\/)(opacity|weight|z|zindex|scale|ratio|easing)(\/|$)/.test(name);

class Resolver {
  private byKey = new Map<string, { c: ExportCollection; v: ExportVariable }>();
  constructor(private collections: ExportCollection[]) {
    for (const c of collections) for (const v of c.variables) this.byKey.set(`${c.name}/${v.name}`, { c, v });
  }
  find(alias: string) {
    return this.byKey.get(alias);
  }
  // Mode of the referencing collection; a single-mode target uses its only value.
  value(c: ExportCollection, v: ExportVariable, mode: string, depth = 0): string | number | boolean {
    if (depth > 20) throw new Error(`alias lặp vô hạn tại ${c.name}/${v.name}`);
    const raw = v.values[mode] ?? v.values[c.modes[0]];
    if (typeof raw === 'object') {
      const t = this.find(raw.alias);
      if (!t) throw new Error(`alias "${raw.alias}" không tồn tại`);
      const m = t.c.modes.includes(mode) ? mode : t.c.modes[0];
      return this.value(t.c, t.v, m, depth + 1);
    }
    return raw;
  }
  get all() {
    return this.collections;
  }
}

export function exportTokens(collections: ExportCollection[], textStyles: ExportTextStyle[], format: ExportFormat): string {
  const r = new Resolver(collections);
  switch (format) {
    case 'json':
      return JSON.stringify(toDtcg(r, textStyles), null, 2) + '\n';
    case 'css':
      return toCss(r, textStyles);
    case 'swift':
      return toSwift(r);
    case 'kotlin':
      return toKotlin(r);
  }
}

function toDtcg(r: Resolver, textStyles: ExportTextStyle[]): DtcgTree {
  const tree: DtcgTree = {};
  const put = (path: string[], token: DtcgToken) => {
    let node = tree;
    for (const p of path.slice(0, -1)) node = (node[p] ??= {}) as DtcgTree;
    node[path[path.length - 1]] = token;
  };
  const enc = (v: ExportVariable, raw: TokenValue): unknown => {
    if (typeof raw === 'object') {
      const [coll, ...rest] = raw.alias.split('/');
      return `{${[kebab(coll), ...rest].join('.')}}`;
    }
    if (v.type === 'FLOAT') return isDuration(v.name) ? `${raw}ms` : isUnitless(v.name) ? raw : `${raw}px`;
    return raw;
  };
  for (const c of r.all) {
    for (const v of c.variables) {
      const $type = v.type === 'COLOR' ? 'color' : v.type === 'FLOAT' ? (isDuration(v.name) ? 'duration' : isUnitless(v.name) ? 'number' : 'dimension') : v.type.toLowerCase();
      const token: DtcgToken & { $type: string } = { $type, $value: enc(v, v.values[c.modes[0]]) };
      if (c.modes.length > 1) {
        token.$extensions = { modes: Object.fromEntries(c.modes.map((m) => [m.toLowerCase(), enc(v, v.values[m])])) };
      }
      put([kebab(c.name), ...v.name.split('/')], token);
    }
  }
  for (const s of textStyles) {
    put(['typography', ...s.name.split('/')], {
      $type: 'typography',
      $value: { fontFamily: s.fontFamily, fontWeight: s.fontWeight, fontSize: `${s.fontSize}px`, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing },
    } as DtcgToken);
  }
  return tree;
}

function cssValue(r: Resolver, c: ExportCollection, v: ExportVariable, mode: string): string {
  const raw = v.values[mode] ?? v.values[c.modes[0]];
  if (typeof raw === 'object') {
    const t = r.find(raw.alias);
    if (!t) throw new Error(`alias "${raw.alias}" không tồn tại`);
    return `var(--${kebab(t.v.name)})`;
  }
  if (v.type === 'FLOAT') return isDuration(v.name) ? `${raw}ms` : isUnitless(v.name) ? String(raw) : `${raw}px`;
  if (v.type === 'STRING') return JSON.stringify(raw);
  return String(raw);
}

function toCss(r: Resolver, textStyles: ExportTextStyle[]): string {
  const lines = ['/* Generated by figma-agent export_tokens — do not edit by hand. */', ':root {'];
  const extra = new Map<string, string[]>();
  for (const c of r.all) {
    for (const v of c.variables) {
      lines.push(`  --${kebab(v.name)}: ${cssValue(r, c, v, c.modes[0])};`);
      for (const m of c.modes.slice(1)) {
        const list = extra.get(m) ?? [];
        list.push(`  --${kebab(v.name)}: ${cssValue(r, c, v, m)};`);
        extra.set(m, list);
      }
    }
  }
  for (const s of textStyles) {
    const lh = typeof s.lineHeight === 'number' ? `${s.lineHeight}px` : s.lineHeight === 'AUTO' ? 'normal' : s.lineHeight;
    lines.push(`  --font-${kebab(s.name)}: ${s.fontWeight} ${s.fontSize}px/${lh} ${JSON.stringify(s.fontFamily)};`);
  }
  lines.push('}');
  for (const [mode, list] of extra) lines.push('', `[data-theme="${kebab(mode)}"] {`, ...list, '}');
  return lines.join('\n') + '\n';
}

const hex8 = (v: string) => {
  const c = parseColor(v);
  const h = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0').toUpperCase();
  return { rgb: `${h(c.r)}${h(c.g)}${h(c.b)}`, a: c.a };
};

function toSwift(r: Resolver): string {
  const out = [
    '// Generated by figma-agent export_tokens — do not edit by hand.',
    'import SwiftUI',
    'import UIKit',
    '',
    'private extension UIColor {',
    '  convenience init(hex: UInt32, alpha: CGFloat = 1) {',
    '    self.init(red: CGFloat((hex >> 16) & 0xFF) / 255, green: CGFloat((hex >> 8) & 0xFF) / 255, blue: CGFloat(hex & 0xFF) / 255, alpha: alpha)',
    '  }',
    '}',
    '',
  ];
  for (const c of r.all) {
    const light = c.modes[0];
    const dark = c.modes.find((m) => /dark/i.test(m));
    out.push(`public enum ${pascal(c.name)} {`);
    for (const v of c.variables) {
      const id = camel(v.name);
      if (v.type === 'COLOR') {
        const L = hex8(String(r.value(c, v, light)));
        const lit = (x: { rgb: string; a: number }) => `UIColor(hex: 0x${x.rgb}${x.a < 1 ? `, alpha: ${x.a.toFixed(2)}` : ''})`;
        if (dark) {
          const D = hex8(String(r.value(c, v, dark)));
          out.push(`  public static let ${id} = Color(UIColor { $0.userInterfaceStyle == .dark ? ${lit(D)} : ${lit(L)} })`);
        } else {
          out.push(`  public static let ${id} = Color(${lit(L)})`);
        }
      } else if (v.type === 'FLOAT') {
        const n = Number(r.value(c, v, light));
        out.push(isDuration(v.name) ? `  public static let ${id}: TimeInterval = ${n / 1000}` : `  public static let ${id}: CGFloat = ${n}`);
      } else if (v.type === 'STRING') {
        out.push(`  public static let ${id} = ${JSON.stringify(r.value(c, v, light))}`);
      } else {
        out.push(`  public static let ${id} = ${String(r.value(c, v, light))}`);
      }
    }
    out.push('}', '');
  }
  return out.join('\n');
}

function toKotlin(r: Resolver): string {
  const out = [
    '// Generated by figma-agent export_tokens — do not edit by hand.',
    'package design.tokens',
    '',
    'import androidx.compose.ui.graphics.Color',
    'import androidx.compose.ui.unit.dp',
    '',
  ];
  for (const c of r.all) {
    const colors = c.variables.filter((v) => v.type === 'COLOR');
    const others = c.variables.filter((v) => v.type !== 'COLOR');
    // One object per mode for colours (Light/Dark colour schemes); the rest
    // is mode-independent and uses the default mode.
    for (const mode of colors.length ? c.modes : []) {
      out.push(`object ${pascal(c.name)}${c.modes.length > 1 ? pascal(mode) : ''}Colors {`);
      for (const v of colors) {
        const x = hex8(String(r.value(c, v, mode)));
        const a = Math.round(x.a * 255).toString(16).padStart(2, '0').toUpperCase();
        out.push(`    val ${camel(v.name)} = Color(0x${a}${x.rgb})`);
      }
      out.push('}', '');
    }
    if (others.length) {
      out.push(`object ${pascal(c.name)}Values {`);
      for (const v of others) {
        const val = r.value(c, v, c.modes[0]);
        if (v.type === 'FLOAT') out.push(isDuration(v.name) || isUnitless(v.name) ? `    const val ${camel(v.name)} = ${Number(val)}f` : `    val ${camel(v.name)} = ${Number(val)}.dp`);
        else if (v.type === 'STRING') out.push(`    const val ${camel(v.name)} = ${JSON.stringify(val)}`);
        else out.push(`    const val ${camel(v.name)} = ${String(val)}`);
      }
      out.push('}', '');
    }
  }
  return out.join('\n');
}
