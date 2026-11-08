import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { RenderTreeInput, TreeNode, UpdateNodesInput } from '../src/shared/schemas';

const wallet = {
  type: 'frame',
  name: 'Wallet',
  width: 393,
  height: 852,
  layout: 'VERTICAL',
  fill: '#F8FAFC',
  padding: [24, 20],
  gap: 20,
  children: [
    {
      type: 'frame',
      name: 'Header',
      layout: 'HORIZONTAL',
      widthMode: 'FILL',
      justify: 'SPACE_BETWEEN',
      align: 'CENTER',
      children: [
        { type: 'text', text: 'Xin chào 👋', fontSize: 13, color: '#64748B' },
        { type: 'instance', component: 'Avatar', variant: { Size: 'Large' } },
      ],
    },
    {
      type: 'frame',
      name: 'Card',
      layout: 'VERTICAL',
      widthMode: 'FILL',
      radius: [20, 20, 8, 8],
      fill: { gradient: 'LINEAR', angle: 135, stops: [{ color: '#1E293B', position: 0 }, { color: '#334155', position: 1 }] },
      effects: 'lg',
      stroke: { color: { var: 'border/subtle' }, width: 1 },
      children: [
        { type: 'text', text: '128.500.000 ₫', fontSize: 32, fontWeight: 700, color: '#FFFFFF', lineHeight: '120%' },
        { type: 'svg', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"/>', width: 20, color: '#FFF' },
        { type: 'image', src: 'https://example.com/a.png', width: 40, height: 40, radius: 20 },
      ],
    },
  ],
};

describe('render_tree DSL', () => {
  it('accepts a realistic nested tree', () => {
    const r = RenderTreeInput.safeParse({ tree: wallet });
    expect(r.success, JSON.stringify(r.error?.issues)).toBe(true);
    expect(r.data?.select).toBe(true);
  });

  it('rejects unknown keys so the agent learns the vocabulary', () => {
    const r = TreeNode.safeParse({ type: 'frame', layoutMode: 'VERTICAL', bg: '#fff' });
    expect(r.success).toBe(false);
    const keys = r.error!.issues.flatMap((i) => ('keys' in i ? i.keys : []));
    expect(keys).toEqual(expect.arrayContaining(['layoutMode', 'bg']));
  });

  it('rejects children on non-frame nodes and missing text', () => {
    expect(TreeNode.safeParse({ type: 'text', text: 'a', children: [] }).success).toBe(false);
    expect(TreeNode.safeParse({ type: 'text' }).success).toBe(false);
  });

  it('reports the path of a deep error', () => {
    const bad = structuredClone(wallet) as typeof wallet;
    (bad.children[1].children[0] as Record<string, unknown>).fontSize = 'big';
    const r = TreeNode.safeParse(bad);
    expect(r.success).toBe(false);
    expect(r.error!.issues[0].path).toEqual(['children', 1, 'children', 0, 'fontSize']);
  });

  it('accepts update props including instance and variable bindings', () => {
    const r = UpdateNodesInput.safeParse({
      updates: [
        { id: '1:2', props: { text: 'Hi', fontWeight: 600 } },
        { id: '1:3', props: { gap: { var: 'space/4' }, padding: [8, 16, 8, 16], widthMode: 'FILL' } },
        { id: '1:4', props: { variant: { State: 'Hover' }, texts: { Label: 'Buy' }, component: 'abc' } },
      ],
    });
    expect(r.success, JSON.stringify(r.error?.issues)).toBe(true);
  });

  it('converts to JSON Schema (needed by MCP tools/list)', () => {
    const schema = z.toJSONSchema(RenderTreeInput, { io: 'input' }) as Record<string, unknown>;
    expect(JSON.stringify(schema)).toContain('"frame"');
  });
});

describe('examples', () => {
  it('examples/fintech-wallet.json is a valid tree', async () => {
    const { readFileSync } = await import('node:fs');
    const tree = JSON.parse(readFileSync(new URL('../examples/fintech-wallet.json', import.meta.url), 'utf8'));
    const r = TreeNode.safeParse(tree);
    expect(r.success, JSON.stringify(r.error?.issues)).toBe(true);
  });
});
