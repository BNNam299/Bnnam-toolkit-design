import { describe, expect, it } from 'vitest';
import {
  dtcgTypeToVariable,
  encodeValue,
  flattenDtcg,
  fromDtcg,
  parseColor,
  planVariables,
  type DtcgTree,
} from '../src/shared/tokens';

describe('colour parsing (figma-ui-flow GĐ2)', () => {
  it('reads #RRGGBB, #RGB and #RRGGBBAA', () => {
    expect(parseColor('#3B82F6')).toMatchObject({ r: 59 / 255, g: 130 / 255, b: 246 / 255, a: 1 });
    expect(parseColor('#fff')).toMatchObject({ r: 1, g: 1, b: 1, a: 1 });
    expect(parseColor('#00000080').a).toBeCloseTo(128 / 255, 3);
  });

  it('rejects anything else', () => {
    for (const bad of ['blue', '#12345', 'rgb(1,2,3)', '']) expect(() => parseColor(bad)).toThrow(/Invalid color/);
  });
});

describe('value encoding', () => {
  it('enforces the declared type', () => {
    expect(encodeValue('COLOR', '#FFFFFF')).toMatchObject({ r: 1, g: 1, b: 1 });
    expect(encodeValue('FLOAT', 16)).toBe(16);
    expect(encodeValue('STRING', 'Inter')).toBe('Inter');
    expect(encodeValue('BOOLEAN', true)).toBe(true);
    expect(() => encodeValue('FLOAT', '16px' as unknown as number)).toThrow(/FLOAT/);
    expect(() => encodeValue('COLOR', 16 as unknown as string)).toThrow(/COLOR/);
  });

  it('passes aliases through and rejects empty targets', () => {
    expect(encodeValue('COLOR', { alias: 'color/blue/600' })).toEqual({ alias: 'color/blue/600' });
    expect(() => encodeValue('COLOR', { alias: '  ' })).toThrow(/Alias/);
  });
});

describe('planVariables', () => {
  const base = {
    collection: 'Primitives',
    variables: [
      { name: 'color/blue/600', type: 'COLOR' as const, scopes: [], values: { Value: '#2563EB' } },
    ],
  };

  it('defaults to a single "Value" mode and accepts a primitive', () => {
    const plan = planVariables(base);
    expect(plan.problems).toEqual([]);
    expect(plan.modes).toEqual(['Value']);
    expect(plan.variables).toHaveLength(1);
  });

  it('requires a value for every declared mode (silent fallback is a bug)', () => {
    const plan = planVariables({ ...base, modes: ['Light', 'Dark'] });
    expect(plan.problems.some((p) => p.includes('thiếu value cho mode'))).toBe(true);
  });

  it('rejects values for undeclared modes and duplicate names', () => {
    const undeclared = planVariables({ ...base, variables: [{ ...base.variables[0], values: { Nope: '#fff' } }] });
    expect(undeclared.problems.some((p) => p.includes('không khai báo'))).toBe(true);

    const dup = planVariables(base, ['color/blue/600']);
    expect(dup.problems.some((p) => p.includes('đã tồn tại'))).toBe(true);
  });

  it('warns about multi-mode plans (the account may allow one mode)', () => {
    const plan = planVariables({
      collection: 'Semantic',
      modes: ['Light', 'Dark'],
      variables: [
        { name: 'color/text/primary', type: 'COLOR', values: { Light: { alias: 'color/gray/900' }, Dark: { alias: 'color/gray/50' } } },
      ],
    });
    expect(plan.problems).toEqual([]);
    expect(plan.warnings.join(' ')).toMatch(/addMode/);
  });

  it('rejects an invalid type instead of writing it', () => {
    const plan = planVariables({ ...base, variables: [{ ...base.variables[0], type: 'DATE' as never }] });
    expect(plan.problems.some((p) => p.includes('không hợp lệ'))).toBe(true);
  });
});

describe('DTCG tokens (check_tokens.py format)', () => {
  const tree: DtcgTree = {
    primitives: {
      color: {
        blue: { 600: { $type: 'color', $value: '#2563EB' } },
        white: { $type: 'color', $value: '#FFFFFF' },
      },
      space: { 4: { $type: 'dimension', $value: '16px' } },
    },
    semantic: {
      bg: {
        default: {
          $type: 'color',
          $value: '{primitives.color.white}',
          $extensions: { modes: { light: '{primitives.color.white}' } },
        },
      },
    },
  };

  it('flattens nested groups into slash paths', () => {
    const flat = flattenDtcg(tree);
    expect(flat.map((t) => t.path)).toContain('primitives/color/blue/600');
    expect(flat.map((t) => t.path)).toContain('semantic/bg/default');
    expect(flat.every((t) => !t.path.startsWith('$'))).toBe(true);
  });

  it('maps DTCG aliases and dimensions to DSL values', () => {
    expect(fromDtcg('color', '{primitives.color.blue.600}')).toEqual({ alias: 'primitives/color/blue/600' });
    expect(fromDtcg('dimension', '16px')).toBe(16);
    expect(fromDtcg('color', '#FFFFFF')).toBe('#FFFFFF');
    expect(dtcgTypeToVariable('dimension')).toBe('FLOAT');
    expect(() => dtcgTypeToVariable('duration')).toThrow(/chưa hỗ trợ/);
  });
});

// -- figma-ui-flow parity: lint / import / export -----------------------------
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { exportTokens, inferScopes, lintTokens, planTokenImport, type ExportCollection } from '../src/shared/tokens';

const SKILL = join(__dirname, '..', '.claude', 'skills', 'figma-ui-flow');
const EXAMPLE = join(SKILL, 'assets', 'tokens.example.json');
const example = () => JSON.parse(readFileSync(EXAMPLE, 'utf8')) as DtcgTree;

function python(file: string): unknown | null {
  try {
    const out = execFileSync('python3', [join(SKILL, 'scripts', 'check_tokens.py'), file, '--json'], { encoding: 'utf8' });
    return JSON.parse(out);
  } catch (e) {
    const err = e as { stdout?: string; code?: string };
    if (err.code === 'ENOENT') return null; // no python3 on this machine
    return err.stdout ? JSON.parse(err.stdout) : null;
  }
}

describe('lintTokens ≡ scripts/check_tokens.py', () => {
  const broken = {
    primitives: {
      color: { Blue: { $type: 'color', $value: '#1D4ED8' }, alias: { $type: 'color', $value: '{primitives.color.Blue}' } },
      space: { 3: { $type: 'dimension', $value: '6px' } },
    },
    semantic: {
      color: {
        bg: { default: { $type: 'color', $value: '#FFFFFF', $extensions: { modes: { light: '#FFFFFF', dark: '#000000' } } } },
        text: {
          primary: { $type: 'color', $value: '{primitives.color.missing}' },
          secondary: { $type: 'color', $value: '#EEEEEE', $extensions: { modes: { light: '#EEEEEE' } } },
        },
      },
    },
  };

  for (const [label, tree] of [['example', null], ['broken', broken]] as const) {
    it(`matches the Python checker on the ${label} file`, () => {
      const data = (tree ?? example()) as DtcgTree;
      const dir = mkdtempSync(join(tmpdir(), 'tokens-'));
      const file = join(dir, 'tokens.json');
      writeFileSync(file, JSON.stringify(data));
      const py = python(file);
      const ts = lintTokens(data);
      if (py === null) return; // python3 missing: TS-only assertions below still run
      expect(ts).toEqual(py);
    });
  }

  it('passes the example and flags the broken file', () => {
    expect(lintTokens(example()).errors).toEqual([]);
    expect(lintTokens(example()).contrast_pass).toHaveLength(6);
    const r = lintTokens(broken as unknown as DtcgTree);
    expect(r.errors.join('\n')).toMatch(/\[name\].*Blue/);
    expect(r.errors.join('\n')).toMatch(/\[alias\].*missing/);
    expect(r.errors.join('\n')).toMatch(/a primitive must not be an alias/);
    expect(r.warnings.join('\n')).toMatch(/\[grid\]/);
    expect(r.warnings.join('\n')).toMatch(/missing value for mode\(s\) \['dark'\]/);
  });
});

describe('planTokenImport', () => {
  it('turns top-level groups into ordered collections with modes, aliases and scopes', () => {
    const plan = planTokenImport(example());
    expect(plan.collections.map((c) => c.collection)).toEqual(['Primitives', 'Semantic']);
    const [prim, sem] = plan.collections;
    expect(prim.modes).toEqual(['Value']);
    expect(prim.variables.find((v) => v.name === 'space/4')).toMatchObject({ type: 'FLOAT', scopes: [], values: { Value: 16 } });
    expect(sem.modes).toEqual(['Light', 'Dark']);
    expect(sem.variables.find((v) => v.name === 'color/text/primary')).toMatchObject({
      scopes: ['TEXT_FILL'],
      values: { Light: { alias: 'Primitives/color/gray/900' }, Dark: { alias: 'Primitives/color/gray/50' } },
    });
    // A token without modes in a multi-mode collection uses $value everywhere.
    expect(sem.variables.find((v) => v.name === 'space/inset/md')).toMatchObject({
      scopes: ['GAP'],
      values: { Light: { alias: 'Primitives/space/4' }, Dark: { alias: 'Primitives/space/4' } },
    });
    for (const c of plan.collections) expect(planVariables(c).problems).toEqual([]);
  });

  it('skips composite tokens with a hint', () => {
    const plan = planTokenImport({ semantic: { shadow: { md: { $type: 'shadow', $value: {} } }, x: { $type: 'color', $value: '#fff' } } } as DtcgTree);
    expect(plan.skipped[0]).toMatch(/create_styles/);
  });

  it('infers scopes by role', () => {
    expect(inferScopes('color/border/strong', 'COLOR', false)).toEqual(['STROKE_COLOR']);
    expect(inferScopes('radius/lg', 'FLOAT', false)).toEqual(['CORNER_RADIUS']);
    expect(inferScopes('duration/base', 'FLOAT', false)).toEqual([]);
    // Stroke weight, not a width; type scale steps are font sizes.
    expect(inferScopes('border/width/thin', 'FLOAT', false)).toEqual(['STROKE_FLOAT']);
    expect(inferScopes('type/title-md', 'FLOAT', false)).toEqual(['FONT_SIZE']);
    expect(inferScopes('size/touch-target', 'FLOAT', false)).toEqual(['WIDTH_HEIGHT']);
    expect(inferScopes('color/blue/600', 'COLOR', true)).toEqual([]);
  });
});

describe('planVariables onExisting', () => {
  const input = { collection: 'Semantic', variables: [{ name: 'space/4', type: 'FLOAT' as const, values: { Value: 16 } }] };
  it('errors, skips or updates an existing name', () => {
    expect(planVariables(input, ['space/4']).problems[0]).toMatch(/đã tồn tại/);
    const skip = planVariables(input, ['space/4'], 'skip');
    expect(skip.variables).toEqual([]);
    expect(skip.problems).toEqual([]);
    expect(planVariables(input, ['space/4'], 'update')).toMatchObject({ updating: ['space/4'], problems: [] });
  });
  it('warns when a primitive is visible in pickers', () => {
    const w = planVariables({ collection: 'Primitives', variables: [{ name: 'c', type: 'COLOR', scopes: ['ALL_FILLS'], values: { Value: '#fff' } }] }).warnings;
    expect(w.join()).toMatch(/scopes: \[\]/);
  });
});

describe('exportTokens', () => {
  const collections: ExportCollection[] = [
    {
      name: 'Primitives',
      modes: ['Value'],
      variables: [
        { name: 'color/gray/900', type: 'COLOR', values: { Value: '#0F172A' } },
        { name: 'color/gray/50', type: 'COLOR', values: { Value: '#F8FAFC' } },
        { name: 'space/4', type: 'FLOAT', values: { Value: 16 } },
        { name: 'duration/base', type: 'FLOAT', values: { Value: 250 } },
      ],
    },
    {
      name: 'Semantic',
      modes: ['Light', 'Dark'],
      variables: [
        { name: 'color/text/primary', type: 'COLOR', values: { Light: { alias: 'Primitives/color/gray/900' }, Dark: { alias: 'Primitives/color/gray/50' } } },
        { name: 'space/inset/md', type: 'FLOAT', values: { Light: { alias: 'Primitives/space/4' }, Dark: { alias: 'Primitives/space/4' } } },
      ],
    },
  ];
  const styles = [{ name: 'body/md', fontFamily: 'Inter', fontStyle: 'Regular', fontWeight: 400, fontSize: 15, lineHeight: 20, letterSpacing: 0 }];

  it('json round-trips through planTokenImport', () => {
    const json = JSON.parse(exportTokens(collections, styles, 'json'));
    expect(json.semantic.color.text.primary).toEqual({
      $type: 'color',
      $value: '{primitives.color.gray.900}',
      $extensions: { modes: { light: '{primitives.color.gray.900}', dark: '{primitives.color.gray.50}' } },
    });
    expect(json.primitives.duration.base).toEqual({ $type: 'duration', $value: '250ms' });
    expect(json.typography.body.md.$type).toBe('typography');
    const back = planTokenImport(json);
    expect(back.collections.find((c) => c.collection === 'Semantic')!.variables[0].values.Dark).toEqual({ alias: 'Primitives/color/gray/50' });
    expect(lintTokens(json).errors).toEqual([]);
  });

  it('css uses custom properties, var() aliases and a dark block', () => {
    const css = exportTokens(collections, styles, 'css');
    expect(css).toContain('--color-gray-900: #0F172A;');
    expect(css).toContain('--color-text-primary: var(--color-gray-900);');
    expect(css).toContain('--duration-base: 250ms;');
    expect(css).toContain('[data-theme="dark"] {\n  --color-text-primary: var(--color-gray-50);');
    expect(css).toContain('--font-body-md: 400 15px/20px "Inter";');
  });

  it('swift resolves aliases with a dark appearance', () => {
    const swift = exportTokens(collections, [], 'swift');
    expect(swift).toContain('public enum Semantic {');
    expect(swift).toContain('public static let colorTextPrimary = Color(UIColor { $0.userInterfaceStyle == .dark ? UIColor(hex: 0xF8FAFC) : UIColor(hex: 0x0F172A) })');
    expect(swift).toContain('public static let space4: CGFloat = 16');
    expect(swift).toContain('public static let durationBase: TimeInterval = 0.25');
  });

  it('kotlin emits one colour object per mode and dp values', () => {
    const kt = exportTokens(collections, [], 'kotlin');
    expect(kt).toContain('object SemanticLightColors {\n    val colorTextPrimary = Color(0xFF0F172A)');
    expect(kt).toContain('object SemanticDarkColors {\n    val colorTextPrimary = Color(0xFFF8FAFC)');
    expect(kt).toContain('val spaceInsetMd = 16.dp');
  });

  it('fails loudly on a dangling alias', () => {
    const bad: ExportCollection[] = [{ name: 'S', modes: ['Value'], variables: [{ name: 'x', type: 'COLOR', values: { Value: { alias: 'P/missing' } } }] }];
    expect(() => exportTokens(bad, [], 'swift')).toThrow(/không tồn tại/);
  });
});
