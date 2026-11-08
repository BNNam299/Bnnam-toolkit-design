// Pure logic behind the figma-ui-flow tools: search, colour matching,
// component sets, motion, renaming, grids, foundations and audit additions.
import { describe, expect, it } from 'vitest';
import { LOREM, worstContrast } from '../src/shared/audit';
import { deltaE, exactNumber, nearestColor, scopeAllows } from '../src/shared/color';
import { planComponentSet, variantName } from '../src/shared/components';
import { foundationsTree } from '../src/shared/foundations';
import { GRID_PRESETS, toLayoutGrid } from '../src/shared/grids';
import { easingFor, msToSeconds, transitionFor } from '../src/shared/motion';
import { planRename, slug, suggestName } from '../src/shared/rename';
import { CreateComponentSetInput, RenderTreeInput, SetInteractionsInput, StyleSpec, TreeNode } from '../src/shared/schemas';
import { normalize, rank, scoreName } from '../src/shared/search';
import { parseColor } from '../src/shared/values';

const rgb = (hex: string) => {
  const c = parseColor(hex);
  return { r: c.r, g: c.g, b: c.b };
};

describe('search_design_system ranking (luật #3)', () => {
  it('normalizes Vietnamese and separators', () => {
    expect(normalize('Nút Đăng nhập')).toBe('nut dang nhap');
    expect(scoreName('dang nhap', 'Button/Đăng nhập')).toBeGreaterThan(0);
  });

  it('orders exact > last segment > prefix > words > subsequence', () => {
    expect(scoreName('Button', 'Button')).toBe(100);
    expect(scoreName('primary', 'color/text/primary')).toBe(90);
    expect(scoreName('color/text', 'color/text/primary')).toBe(80);
    expect(scoreName('button primary', 'Button/Primary/Large')).toBe(60);
    expect(scoreName('btn', 'Button')).toBe(20);
    expect(scoreName('zzz', 'Button')).toBe(0);
  });

  it('ranks, drops misses and prefers shorter names on ties', () => {
    const hits = rank('primary', [{ name: 'color/action/primary' }, { name: 'Card' }, { name: 'color/text/primary' }]);
    expect(hits.map((h) => h.name)).toEqual(['color/text/primary', 'color/action/primary']);
  });
});

describe('bind_variables matching', () => {
  const candidates = [
    { id: '1', name: 'color/text/primary', scopes: ['TEXT_FILL'], value: rgb('#0F172A') },
    { id: '2', name: 'color/bg/inverse', scopes: ['FRAME_FILL'], value: rgb('#0F172A') },
    { id: '3', name: 'color/action/primary', scopes: ['FRAME_FILL', 'SHAPE_FILL'], value: rgb('#1D4ED8') },
    { id: '4', name: 'color/blue/700', scopes: [], value: rgb('#1D4ED8') },
    { id: '5', name: 'color/bg/default', scopes: ['ALL_SCOPES'], value: rgb('#0F172A') },
  ];

  it('ΔE is 0 for equal colours and grows with difference', () => {
    expect(deltaE(rgb('#2563EB'), rgb('#2563EB'))).toBe(0);
    expect(deltaE(rgb('#2563EB'), rgb('#2664EB'))).toBeLessThan(1);
    expect(deltaE(rgb('#000000'), rgb('#FFFFFF'))).toBeGreaterThan(90);
  });

  it('never binds primitives (scopes [])', () => {
    expect(scopeAllows([], 'fill')).toBe(false);
    const m = nearestColor(rgb('#1D4ED8'), 'fill', candidates);
    expect(m).toMatchObject({ kind: 'match', variable: { name: 'color/action/primary' } });
  });

  it('uses the field scope to pick between equal colours', () => {
    expect(nearestColor(rgb('#0F172A'), 'text-fill', candidates.slice(0, 4))).toMatchObject({ kind: 'match', variable: { name: 'color/text/primary' } });
  });

  it('reports ambiguity instead of guessing', () => {
    const m = nearestColor(rgb('#0F172A'), 'fill', candidates);
    expect(m.kind).toBe('ambiguous');
    if (m.kind === 'ambiguous') expect(m.candidates.map((c) => c.name).sort()).toEqual(['color/bg/default', 'color/bg/inverse']);
  });

  it('respects the tolerance', () => {
    expect(nearestColor(rgb('#3B82F6'), 'fill', candidates, 2).kind).toBe('none');
  });

  it('matches spacing and radius exactly within scope', () => {
    const nums = [
      { id: 'a', name: 'space/4', scopes: ['GAP'], value: 16 },
      { id: 'b', name: 'radius/lg', scopes: ['CORNER_RADIUS'], value: 16 },
    ];
    expect(exactNumber(16, 'gap', nums)).toMatchObject({ kind: 'match', variable: { name: 'space/4' } });
    expect(exactNumber(16, 'radius', nums)).toMatchObject({ kind: 'match', variable: { name: 'radius/lg' } });
    expect(exactNumber(14, 'gap', nums).kind).toBe('none');
  });
});

describe('create_component_set planning (design-system §6)', () => {
  const v = (Size: string, State: string) => ({ props: { Size, State } });

  it('names variants Property=Value in a stable axis order', () => {
    expect(variantName({ State: 'Default', Size: 'md' }, ['Size', 'State'])).toBe('Size=md, State=Default');
    const plan = planComponentSet('Button', [v('md', 'Default'), { props: { State: 'Pressed', Size: 'md' } }]);
    expect(plan.problems).toEqual([]);
    expect(plan.names).toEqual(['Size=md, State=Default', 'Size=md, State=Pressed']);
  });

  it('rejects duplicates, missing values and reserved characters', () => {
    const plan = planComponentSet('Button', [v('md', 'Default'), v('md', 'Default'), { props: { Size: 'lg' } }, v('a=b', 'x')]);
    expect(plan.problems.join('\n')).toMatch(/bị trùng/);
    expect(plan.problems.join('\n')).toMatch(/thiếu giá trị cho State/);
    expect(plan.problems.join('\n')).toMatch(/không được chứa/);
  });

  it('warns on mixed size vocabularies, lowercase axes and the 50-variant budget', () => {
    expect(planComponentSet('B', [v('md', 'A'), v('Large', 'A')]).warnings.join()).toMatch(/trộn/);
    expect(planComponentSet('B', [{ props: { size: 'md' } }]).warnings.join()).toMatch(/viết hoa/);
    const many = Array.from({ length: 51 }, (_, i) => v(`s${i}`, 'Default'));
    expect(planComponentSet('B', many).warnings.join()).toMatch(/> 50/);
  });

  it('checks property defaults by type', () => {
    const plan = planComponentSet('B', [v('md', 'A')], [
      { name: 'Label', type: 'TEXT', default: true, targets: ['label'] },
      { name: 'Has icon', type: 'BOOLEAN', default: 'yes', targets: [] },
      { name: 'Size', type: 'TEXT', default: 'x', targets: ['t'] },
    ]);
    expect(plan.problems.join('\n')).toMatch(/Label.*chuỗi/);
    expect(plan.problems.join('\n')).toMatch(/Has icon.*true\/false/);
    expect(plan.problems.join('\n')).toMatch(/"Size": trùng/);
    expect(plan.warnings.join()).toMatch(/targets rỗng/);
  });

  it('schema accepts a realistic Button set', () => {
    const tree = { type: 'frame', layout: 'HORIZONTAL', padding: [12, 16], children: [{ type: 'text', name: 'label', text: 'Tiếp tục' }] };
    const r = CreateComponentSetInput.safeParse({
      name: 'Button',
      variants: [
        { props: { State: 'Default' }, tree },
        { props: { State: 'Pressed' }, tree },
      ],
      properties: [{ name: 'Label', type: 'TEXT', default: 'Tiếp tục', targets: ['label'] }],
    });
    expect(r.success, JSON.stringify(r.error?.issues)).toBe(true);
  });
});

describe('motion tokens → transitions', () => {
  it('maps the master easings', () => {
    expect(easingFor('standard')).toEqual({ type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1: 0.2, y1: 0, x2: 0, y2: 1 } });
    expect(easingFor('spring').type).toBe('GENTLE');
    expect(easingFor('EASE_OUT').type).toBe('EASE_OUT');
    expect(easingFor('cubic-bezier(0.4, 0, 0.2, 1)').easingFunctionCubicBezier).toEqual({ x1: 0.4, y1: 0, x2: 0.2, y2: 1 });
    expect(() => easingFor('wobbly')).toThrow(/không hợp lệ/);
  });

  it('converts ms to seconds and catches tokens stored in seconds', () => {
    expect(msToSeconds(250)).toBe(0.25);
    expect(msToSeconds(0)).toBe(0);
    expect(() => msToSeconds(0.25)).toThrow(/mili giây/);
  });

  it('builds directional and simple transitions', () => {
    expect(transitionFor({ type: 'SMART_ANIMATE' }, 250)).toMatchObject({ type: 'SMART_ANIMATE', duration: 0.25 });
    expect(transitionFor({ type: 'PUSH', direction: 'RIGHT' }, 400)).toMatchObject({ type: 'PUSH', direction: 'RIGHT', matchLayers: false, duration: 0.4 });
  });

  it('schema defaults a reaction to ON_CLICK + SMART_ANIMATE 250ms', () => {
    const r = SetInteractionsInput.parse({ items: [{ id: '1:2', reactions: [{ action: 'NAVIGATE', destination: '1:3', transition: {} }] }] });
    expect(r.items[0].reactions[0]).toMatchObject({ trigger: 'ON_CLICK', transition: { type: 'SMART_ANIMATE', duration: 250, easing: 'standard' } });
  });
});

describe('rename_by_rule (file-standards §2.3)', () => {
  it('slugs Vietnamese text', () => {
    expect(slug('Đăng nhập bằng vân tay')).toBe('dang-nhap-bang');
  });

  it('suggests role names', () => {
    expect(suggestName({ type: 'TEXT', name: 'Text 3', text: 'Quên mật khẩu?' })).toBe('label/quen-mat-khau');
    expect(suggestName({ type: 'FRAME', name: 'Frame 1', isVector: true })).toBe('icon/glyph');
    expect(suggestName({ type: 'RECTANGLE', name: 'Rectangle 2', hasImageFill: true })).toBe('image/placeholder');
    expect(suggestName({ type: 'FRAME', name: 'Frame 4', layout: 'HORIZONTAL', childCount: 2 })).toBe('row');
  });

  it('auto only touches default/blacklisted names; rules win', () => {
    expect(planRename({ type: 'TEXT', name: 'title', text: 'Xin chào' }, [], true)).toBeNull();
    expect(planRename({ type: 'TEXT', name: 'Text 9', text: 'Xin chào' }, [], true)).toBe('label/xin-chao');
    expect(planRename({ type: 'TEXT', name: 'Text 9', text: 'Xin chào' }, [], false)).toBeNull();
    expect(planRename({ type: 'FRAME', name: 'Icon/Home' }, [{ match: '^Icon/(.*)$', to: 'icon/$1' }], false)).toBe('icon/Home');
    expect(planRename({ type: 'TEXT', name: 'Icon/Home' }, [{ match: '^Icon/', to: 'icon/', types: ['FRAME'] }], false)).toBeNull();
  });
});

describe('layout grids (file-standards §4)', () => {
  it('builds stretch columns with margin as offset', () => {
    expect(toLayoutGrid({ pattern: 'COLUMNS', count: 12, gutter: 24, margin: 80 })).toMatchObject({ pattern: 'COLUMNS', alignment: 'STRETCH', count: 12, gutterSize: 24, offset: 80 });
  });

  it('needs a size for non-stretch grids', () => {
    expect(() => toLayoutGrid({ pattern: 'COLUMNS', alignment: 'CENTER' })).toThrow(/cần size/);
    expect(toLayoutGrid({ pattern: 'GRID', size: 4 })).toMatchObject({ pattern: 'GRID', sectionSize: 4 });
  });

  it('has the platform presets', () => {
    expect(GRID_PRESETS.mobile[0]).toMatchObject({ count: 4, margin: 16 });
    expect(GRID_PRESETS.desktop[0]).toMatchObject({ count: 12 });
  });

  it('DSL accepts grids and presets; styles accept grid styles', () => {
    expect(TreeNode.safeParse({ type: 'frame', layoutGrids: { preset: 'mobile' } }).success).toBe(true);
    expect(TreeNode.safeParse({ type: 'frame', layoutGrids: [{ pattern: 'COLUMNS', count: 4 }] }).success).toBe(true);
    expect(StyleSpec.safeParse({ kind: 'grid', name: 'grid/mobile', grids: { preset: 'mobile' } }).success).toBe(true);
    expect(StyleSpec.safeParse({ kind: 'text', name: 'body/md', fontSize: { var: 'font/size/md' }, lineHeight: 20 }).success).toBe(true);
  });
});

describe('section node (file-standards §5)', () => {
  it('render_tree accepts a flow section with screens', () => {
    const r = RenderTreeInput.safeParse({
      tree: { type: 'section', name: 'Login', children: [{ type: 'frame', name: 'Login / Sign in / Default', width: 393, height: 852 }] },
    });
    expect(r.success, JSON.stringify(r.error?.issues)).toBe(true);
  });

  it('rejects frame-only props on a section', () => {
    expect(TreeNode.safeParse({ type: 'section', layout: 'VERTICAL' }).success).toBe(false);
  });
});

describe('render_foundations tree', () => {
  const data = {
    variables: [
      { id: 'VariableID:1', name: 'color/text/primary', collection: 'Semantic', type: 'COLOR' as const, display: '#0F172A' },
      { id: 'VariableID:2', name: 'space/4', collection: 'Primitives', type: 'FLOAT' as const, display: '16' },
      { id: 'VariableID:3', name: 'radius/lg', collection: 'Primitives', type: 'FLOAT' as const, display: '12' },
    ],
    textStyles: [{ name: 'body/md', caption: 'Inter Regular · 15/20' }],
    effectStyles: [{ name: 'elevation/1' }],
  };

  it('is a valid render_tree spec that binds real tokens', () => {
    const tree = foundationsTree(data);
    expect(RenderTreeInput.safeParse({ tree }).success).toBe(true);
    const json = JSON.stringify(tree);
    expect(json).toContain('"var":"VariableID:1"');
    expect(json).toContain('"textStyle":"body/md"');
    expect(json).toContain('"style":"elevation/1"');
    for (const s of ['section/colors', 'section/typography', 'section/spacing', 'section/radius', 'section/elevation']) expect(json).toContain(s);
  });

  it('explains an empty file instead of drawing nothing', () => {
    expect(JSON.stringify(foundationsTree({ variables: [], textStyles: [], effectStyles: [] }))).toContain('chưa có variable');
  });
});

describe('audit additions', () => {
  it('judges gradient backdrops by the worst stop', () => {
    const v = worstContrast(rgb('#FFFFFF'), [rgb('#1E293B'), rgb('#94A3B8')], 14);
    expect(v.pass).toBe(false);
    expect(v.ratio).toBeLessThan(4.5);
    expect(worstContrast(rgb('#FFFFFF'), [rgb('#1E293B'), rgb('#334155')], 14).pass).toBe(true);
  });

  it('spots placeholder copy', () => {
    expect(LOREM.test('Lorem ipsum dolor sit amet')).toBe(true);
    expect(LOREM.test('Đăng nhập')).toBe(false);
  });
});
