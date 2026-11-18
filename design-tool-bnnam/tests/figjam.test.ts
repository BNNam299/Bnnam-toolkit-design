import { beforeAll, describe, expect, it } from 'vitest';
import { Serializer } from '../src/plugin/serialize';
import { DESIGN_ONLY_TOOLS, designOnlyError } from '../src/shared/figjam';
import { RenderTreeInput, TreeNode, UpdateProps } from '../src/shared/schemas';

beforeAll(() => {
  (globalThis as Record<string, unknown>).figma = {
    mixed: Symbol('mixed'),
    variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
    getStyleByIdAsync: async () => null,
  };
});

function base(over: Record<string, unknown> = {}) {
  return { id: '9:1', name: 'n', visible: true, x: 0, y: 0, width: 100, height: 100, ...over };
}
export const figjamStub = {
  sticky: (over: Record<string, unknown> = {}) =>
    base({ type: 'STICKY', text: { characters: 'idea' }, authorName: 'Nam', ...over }),
  shape: (over: Record<string, unknown> = {}) =>
    base({ type: 'SHAPE_WITH_TEXT', shapeType: 'DIAMOND', text: { characters: 'step' }, ...over }),
  connector: (over: Record<string, unknown> = {}) =>
    base({
      type: 'CONNECTOR',
      connectorLineType: 'ELBOWED',
      connectorStartStrokeCap: 'NONE',
      connectorEndStrokeCap: 'ARROW_EQUILATERAL',
      connectorStart: { endpointNodeId: '9:2', magnet: 'AUTO' },
      connectorEnd: { position: { x: 10, y: 20 } },
      text: { characters: '' },
      ...over,
    }),
  table: (rows = 2, cols = 2) => {
    const cells: string[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => `${r},${c}`),
    );
    return base({
      type: 'TABLE',
      numRows: rows,
      numColumns: cols,
      cellAt: (r: number, c: number) => ({ text: { characters: cells[r][c] } }),
    });
  },
  code: (over: Record<string, unknown> = {}) =>
    base({ type: 'CODE_BLOCK', code: 'npm test', codeLanguage: 'BASH', ...over }),
  widget: () => base({ type: 'WIDGET' }),
};

describe('FigJam DSL schemas (T013)', () => {
  const tree = (t: unknown) => RenderTreeInput.parse({ tree: t });

  it('accepts the five FigJam types', () => {
    expect(tree({ type: 'sticky', text: 'hi' }).tree.type).toBe('sticky');
    expect(tree({ type: 'shape', shape: 'DIAMOND' }).tree.type).toBe('shape');
    expect(tree({ type: 'connector', from: '1:1', to: 'Board/step' }).tree.type).toBe('connector');
    expect(tree({ type: 'code', code: 'x', language: 'BASH' }).tree.type).toBe('code');
    expect(tree({ type: 'table', rows: 2, columns: 3 }).tree.type).toBe('table');
  });

  it('rejects unknown shape, code language, and missing required fields', () => {
    expect(() => TreeNode.parse({ type: 'shape', shape: 'NOPE' })).toThrow();
    expect(() => TreeNode.parse({ type: 'code', code: 'x', language: 'NOPE' })).toThrow();
    expect(() => TreeNode.parse({ type: 'sticky' })).toThrow();
    expect(() => TreeNode.parse({ type: 'connector', from: '1:1' })).toThrow();
    expect(() => TreeNode.parse({ type: 'table', rows: 0, columns: 2 })).toThrow();
  });

  it('caps are limited to the ConnectorStrokeCap vocabulary', () => {
    expect(() => TreeNode.parse({ type: 'connector', from: 'a', to: 'b', caps: { end: 'ARROW' } })).toThrow();
    const ok = TreeNode.parse({ type: 'connector', from: 'a', to: 'b', caps: { end: 'ARROW_EQUILATERAL' } });
    expect(ok.type).toBe('connector');
  });

  it('update props accept FigJam patches', () => {
    const p = UpdateProps.parse({ text: 'new', from: '1:1', cells: [['a']] });
    expect(p.text).toBe('new');
  });
});

describe('FigJam serializer views (T009–T011)', () => {
  it('serializes sticky with text and author', async () => {
    const out = await new Serializer().node(figjamStub.sticky() as never, 1);
    expect(out).toMatchObject({ type: 'STICKY', text: 'idea', author: 'Nam' });
  });

  it('serializes shape with shapeType and text', async () => {
    const out = await new Serializer().node(figjamStub.shape() as never, 1);
    expect(out).toMatchObject({ type: 'SHAPE_WITH_TEXT', shape: 'DIAMOND', text: 'step' });
  });

  it('serializes connector endpoints, line type and caps', async () => {
    const out = await new Serializer().node(figjamStub.connector() as never, 1);
    expect(out).toMatchObject({
      type: 'CONNECTOR',
      lineType: 'ELBOWED',
      from: { id: '9:2', magnet: 'AUTO' },
      to: { x: 10, y: 20 },
    });
    expect(out.caps).toMatchObject({ start: 'NONE', end: 'ARROW_EQUILATERAL' });
  });

  it('serializes table matrix and code block', async () => {
    const t = await new Serializer().node(figjamStub.table() as never, 1);
    expect(t).toMatchObject({ type: 'TABLE', rows: 2, columns: 2, cells: [['0,0', '0,1'], ['1,0', '1,1']] });
    const c = await new Serializer().node(figjamStub.code() as never, 1);
    expect(c).toMatchObject({ type: 'CODE_BLOCK', code: 'npm test', language: 'BASH' });
  });

  it('marks widgets read-only', async () => {
    const out = await new Serializer().node(figjamStub.widget() as never, 1);
    expect(out).toMatchObject({ type: 'WIDGET', readOnly: true });
  });
});

describe('Design-only refusal vocabulary (T023)', () => {
  it('covers the 13 gated tools with the contract message', () => {
    expect(DESIGN_ONLY_TOOLS).toHaveLength(13);
    for (const tool of DESIGN_ONLY_TOOLS) {
      expect(designOnlyError(tool)).toBe(`${tool} is Design-only and has no effect on this FigJam board.`);
    }
  });
});

describe('Read bounds (T024)', () => {
  it('truncates giant tables at 400 cells', async () => {
    const out = await new Serializer().node(figjamStub.table(30, 30) as never, 1);
    expect(out.cellsTruncated).toBe(true);
    expect((out.cells as string[][]).flat().length).toBeLessThanOrEqual(400);
  });

  it('respects the node budget for wide boards', async () => {
    const s = new Serializer(2);
    const page = { id: '0:1', name: 'p', type: 'PAGE', children: [figjamStub.sticky(), figjamStub.shape(), figjamStub.code()] };
    const out = await s.node(page as never, 1);
    expect(out.childrenTruncated).toBe(true);
  });
});

describe('Workshop-starter DSL round-trip (T026)', () => {
  it('the quickstart board validates and serializes back in contract shape', async () => {
    const parsed = RenderTreeInput.parse({
      tree: {
        type: 'section',
        name: 'Workshop',
        children: [
          { type: 'shape', name: 'step-1', shape: 'ROUNDED_RECTANGLE', text: 'Sign up' },
          { type: 'shape', name: 'step-2', shape: 'ROUNDED_RECTANGLE', text: 'Review' },
          { type: 'connector', name: 'flow', from: 'Workshop/step-1', to: 'Workshop/step-2' },
          { type: 'sticky', name: 'idea', text: 'Guest checkout', color: '#FFE066' },
          { type: 'table', name: 'matrix', rows: 2, columns: 3, cells: [['a', 'b', 'c'], ['d', 'e', 'f']] },
        ],
      },
    });
    const section = parsed.tree as { children?: unknown[] };
    expect(section.children).toHaveLength(5);

    const ids: Record<string, string> = { 'Workshop/step-1': '9:10', 'Workshop/step-2': '9:11' };
    const conn = (section.children as { type: string; from: string; to: string }[])[2];
    expect(ids[conn.from]).toBe('9:10');
    expect(ids[conn.to]).toBe('9:11');

    const s = new Serializer();
    expect(await s.node(figjamStub.sticky({ text: { characters: 'Guest checkout' } }) as never, 0)).toMatchObject({
      type: 'STICKY',
      text: 'Guest checkout',
    });
  });
});
