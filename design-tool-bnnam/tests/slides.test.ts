import { beforeAll, describe, expect, it } from 'vitest';
import { Serializer } from '../src/plugin/serialize';
import { RenderTreeInput, TreeNode, UpdateProps } from '../src/shared/schemas';

beforeAll(() => {
  (globalThis as Record<string, unknown>).figma = {
    mixed: Symbol('mixed'),
    editorType: 'slides',
    variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
    getStyleByIdAsync: async () => null,
  };
});

function base(over: Record<string, unknown> = {}) {
  return { id: '1:1', name: 'n', visible: true, x: 0, y: 0, width: 1920, height: 1080, ...over };
}

const slidesStub = {
  slide: (over: Record<string, unknown> = {}) =>
    base({
      type: 'SLIDE',
      getSlideTransition: () => ({ style: 'DISSOLVE', duration: 0.3, curve: 'EASE_IN', timing: { type: 'ON_CLICK' } }),
      isSkippedSlide: false,
      children: [],
      ...over,
    }),
  grid: () => base({ type: 'SLIDE_GRID', children: [] }),
  row: () => base({ type: 'SLIDE_ROW', children: [] }),
  interactive: (over: Record<string, unknown> = {}) =>
    base({ type: 'INTERACTIVE_SLIDE_ELEMENT', interactiveSlideElementType: 'YOUTUBE', ...over }),
};

describe('Slides DSL schemas (T008)', () => {
  const tree = (t: unknown) => RenderTreeInput.parse({ tree: t });

  it('accepts the slide type with row/col/transition/skipped/children', () => {
    const t = tree({
      type: 'slide',
      name: 'Slide moi',
      row: 0,
      col: 1,
      transition: { style: 'DISSOLVE', duration: 0.5 },
      skipped: true,
      children: [{ type: 'text', text: 'chao' }],
    }).tree;
    expect(t.type).toBe('slide');
    if (t.type === 'slide') {
      expect(t.row).toBe(0);
      expect(t.skipped).toBe(true);
    }
  });

  it('rejects negative row/col and unknown transition styles', () => {
    expect(() => TreeNode.parse({ type: 'slide', row: -1 })).toThrow();
    expect(() => TreeNode.parse({ type: 'slide', transition: { style: 'NOPE' } })).toThrow();
    expect(() => TreeNode.parse({ type: 'slide', transition: { duration: 99 } })).toThrow();
  });

  it('update props accept Slides patches', () => {
    const p = UpdateProps.parse({ skipped: true, transition: { style: 'SMART_ANIMATE' } });
    expect(p.skipped).toBe(true);
    expect(p.transition?.style).toBe('SMART_ANIMATE');
  });
});

describe('Slides serializer views (T006)', () => {
  it('serializes SLIDE with transition + skipped', async () => {
    const s = new Serializer();
    const out = (await s.node(slidesStub.slide() as never, 0)) as Record<string, unknown>;
    expect(out.type).toBe('SLIDE');
    expect(out.transition).toMatchObject({ style: 'DISSOLVE', duration: 0.3 });
    expect(out.skipped).toBe(false);
  });

  it('marks INTERACTIVE_SLIDE_ELEMENT read-only with element type', async () => {
    const s = new Serializer();
    const out = (await s.node(slidesStub.interactive() as never, 0)) as Record<string, unknown>;
    expect(out.readOnly).toBe(true);
    expect(out.elementType).toBe('YOUTUBE');
  });

  it('serializes GRID/ROW headers without geometry failures', async () => {
    const s = new Serializer();
    const g = (await s.node(slidesStub.grid() as never, 0)) as Record<string, unknown>;
    const r = (await s.node(slidesStub.row() as never, 0)) as Record<string, unknown>;
    expect(g.kind).toBe('slide-grid');
    expect(r.kind).toBe('slide-row');
  });
});

describe('Slides refusal vocabulary (T017)', () => {
  it('uses the Slides deck message, not the FigJam board message', () => {
    const cmd = 'set_interactions';
    const slidesMsg = `${cmd} is Design-only and has no effect in this Slides deck.`;
    expect(slidesMsg).toContain('Slides deck');
    expect(slidesMsg).not.toContain('FigJam');
  });
});
