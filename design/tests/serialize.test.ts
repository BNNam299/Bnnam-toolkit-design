import { beforeAll, describe, expect, it } from 'vitest';
import { Serializer } from '../src/plugin/serialize';
import { TreeNode, UpdateProps } from '../src/shared/schemas';
import { gradientTransform } from '../src/shared/values';

beforeAll(() => {
  (globalThis as Record<string, unknown>).figma = {
    mixed: Symbol('mixed'),
    variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
    getStyleByIdAsync: async () => null,
  };
});

function textNode(over: Record<string, unknown> = {}) {
  return {
    id: '1:1',
    name: 't',
    type: 'TEXT',
    visible: true,
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    fontName: { family: 'Inter', style: 'Regular' },
    fontSize: 14,
    lineHeight: { unit: 'AUTO' },
    letterSpacing: { value: 0, unit: 'PIXELS' },
    textAlignHorizontal: 'LEFT',
    textAlignVertical: 'TOP',
    textCase: 'ORIGINAL',
    textDecoration: 'NONE',
    textTruncation: 'DISABLED',
    maxLines: null,
    textAutoResize: 'WIDTH_AND_HEIGHT',
    textStyleId: '',
    characters: 'hi',
    fills: [],
    effects: [],
    boundVariables: {},
    ...over,
  };
}

describe('serializer round-trip (probe findings)', () => {
  it('emits stroke dash so update_nodes can replay it', async () => {
    const s = new Serializer();
    const out = await s.node(
      {
        id: '1:2',
        name: 'r',
        type: 'RECTANGLE',
        visible: true,
        x: 0,
        y: 0,
        width: 80,
        height: 40,
        strokes: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1, visible: true }],
        strokeWeight: 3,
        strokeAlign: 'OUTSIDE',
        dashPattern: [6, 4],
        strokeStyleId: '',
        fills: [],
        effects: [],
        boundVariables: {},
      } as never,
      0,
    );
    expect(out.stroke).toMatchObject({ width: 3, align: 'OUTSIDE', dash: [6, 4] });
  });

  it('omits empty dashPattern (solid stroke)', async () => {
    const s = new Serializer();
    const out = await s.node(
      {
        id: '1:3',
        name: 'r',
        type: 'RECTANGLE',
        visible: true,
        x: 0,
        y: 0,
        width: 80,
        height: 40,
        strokes: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1, visible: true }],
        strokeWeight: 1,
        strokeAlign: 'CENTER',
        dashPattern: [],
        strokeStyleId: '',
        fills: [],
        effects: [],
        boundVariables: {},
      } as never,
      0,
    );
    expect(out.stroke).not.toHaveProperty('dash');
  });

  it('emits textCase/decoration/maxLines/verticalAlign only when non-default', async () => {
    const s = new Serializer();
    const plain = await s.node(textNode() as never, 0);
    expect(plain).not.toHaveProperty('textCase');
    expect(plain).not.toHaveProperty('decoration');
    expect(plain).not.toHaveProperty('maxLines');
    expect(plain).not.toHaveProperty('verticalAlign');
    const styled = await s.node(
      textNode({ textCase: 'UPPER', textDecoration: 'UNDERLINE', textTruncation: 'ENDING', maxLines: 2, textAlignVertical: 'CENTER' }) as never,
      0,
    );
    expect(styled).toMatchObject({ textCase: 'UPPER', decoration: 'UNDERLINE', maxLines: 2, verticalAlign: 'CENTER' });
  });

  it('emits clip:false and layoutGrids round-trippable to the DSL', async () => {
    const s = new Serializer();
    const out = await s.node(
      {
        id: '1:4',
        name: 'f',
        type: 'FRAME',
        visible: true,
        x: 0,
        y: 0,
        width: 320,
        height: 100,
        layoutMode: 'HORIZONTAL',
        primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN',
        itemSpacing: 8,
        counterAxisSpacing: 8,
        layoutWrap: 'NO_WRAP',
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        clipsContent: false,
        layoutGrids: [{ pattern: 'COLUMNS', alignment: 'STRETCH', gutterSize: 16, count: 4, offset: 16 }],
        gridStyleId: '',
        fills: [],
        effects: [],
        boundVariables: {},
        children: [],
      } as never,
      0,
    );
    expect(out.clip).toBe(false);
    expect(out.layoutGrids).toEqual([{ pattern: 'COLUMNS', count: 4, gutter: 16, alignment: 'STRETCH', margin: 16 }]);
  });

  it('emits gradient angle so LINEAR gradients replay exactly', async () => {
    const s = new Serializer();
    const t = gradientTransform(135);
    const out = await s.node(
      {
        id: '1:5',
        name: 'r',
        type: 'RECTANGLE',
        visible: true,
        x: 0,
        y: 0,
        width: 80,
        height: 40,
        fills: [
          {
            type: 'GRADIENT_LINEAR',
            gradientTransform: t,
            gradientStops: [
              { position: 0, color: { r: 1, g: 0.5, b: 0, a: 1 } },
              { position: 1, color: { r: 1, g: 0, b: 0, a: 1 } },
            ],
            visible: true,
          },
        ],
        fillStyleId: '',
        effects: [],
        boundVariables: {},
      } as never,
      0,
    );
    const fill = out.fill as { gradient: string; angle: number };
    expect(fill.gradient).toBe('LINEAR');
    expect(fill.angle).toBeCloseTo(135, 0);
  });

  it('schema accepts locked so get_node output replays into update_nodes', () => {
    expect(UpdateProps.safeParse({ locked: true }).success).toBe(true);
    expect(TreeNode.safeParse({ type: 'rect', locked: true, width: 10, height: 10 }).success).toBe(true);
  });
});
