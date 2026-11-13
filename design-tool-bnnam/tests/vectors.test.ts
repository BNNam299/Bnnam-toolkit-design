import { describe, expect, it } from 'vitest';
import { linearTransform } from '../src/plugin/commands/vectors';

// build_vectors gradients: handles in the part's own box (0..1) → Figma's gradientTransform (box → gradient space)
const apply = (t: number[][], x: number, y: number) => [t[0][0] * x + t[0][1] * y + t[0][2], t[1][0] * x + t[1][1] * y + t[1][2]];
describe('linearTransform', () => {
  it('maps from → (0, 0.5) and to → (1, 0.5)', () => {
    for (const [from, to] of [[[0, 0], [0, 1]], [[0.5, 0], [0.5, 1]], [[0.1, 0.2], [0.9, 0.7]]] as [[number, number], [number, number]][]) {
      const t = linearTransform(from, to);
      const a = apply(t, ...from), b = apply(t, ...to);
      expect(a[0]).toBeCloseTo(0); expect(a[1]).toBeCloseTo(0.5);
      expect(b[0]).toBeCloseTo(1); expect(b[1]).toBeCloseTo(0.5);
    }
  });
});
