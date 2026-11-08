import { describe, expect, it } from 'vitest';
import { sanitize } from '../src/plugin/sanitize';

const mixed = Symbol('mixed');

describe('sanitize', () => {
  it('summarizes node-like objects', () => {
    const node = { id: '1:2', name: 'Card', type: 'FRAME', parent: null, children: [] };
    expect(sanitize({ node, list: [node] }, { mixed })).toEqual({
      node: { id: '1:2', name: 'Card', type: 'FRAME' },
      list: [{ id: '1:2', name: 'Card', type: 'FRAME' }],
    });
  });

  it('handles mixed, bytes, cycles, maps, errors and functions', () => {
    const a: Record<string, unknown> = { size: mixed, bytes: new Uint8Array(3), fn: () => 1 };
    a.self = a;
    expect(sanitize(a, { mixed })).toEqual({ size: 'MIXED', bytes: '<3 bytes>', self: '<circular>' });
    expect(sanitize(new Map([['k', 1]]), { mixed })).toEqual({ k: 1 });
    expect(sanitize(new Error('boom'), { mixed })).toEqual({ error: 'boom' });
    expect(sanitize(NaN, { mixed })).toBe('NaN');
  });

  it('limits depth and array length', () => {
    expect(sanitize({ a: { b: { c: 1 } } }, { mixed, maxDepth: 2 })).toEqual({ a: { b: '<max depth>' } });
    expect(sanitize([1, 2, 3], { mixed, maxArray: 2 })).toEqual([1, 2, '<1 more>']);
  });
});
