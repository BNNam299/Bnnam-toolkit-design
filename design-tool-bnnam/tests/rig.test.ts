import { describe, expect, it } from 'vitest';
import { apply, gradientHandles, inv, mul, transformPath } from '../src/plugin/commands/rig';
import { linearTransform } from '../src/plugin/commands/vectors';

type M = [[number, number, number], [number, number, number]];
const I: M = [[1, 0, 0], [0, 1, 0]];

// export_rig: outlines move into the frame's px exactly (affine maps keep béziers), so the motion scripts never re-place anything
describe('transformPath', () => {
  it('moves every point, keeps the commands', () => {
    expect(transformPath('M 0 0 L 10 0 C 10 5 5 10 0 10 Z', [[1, 0, 100], [0, 1, 50]])).toBe('M 100 50 L 110 50 C 110 55 105 60 100 60 Z');
  });
  it('rotates and reads quadratic segments and commas', () => {
    expect(transformPath('M1,0 Q 1 1 0 1', [[0, -1, 0], [1, 0, 0]])).toBe('M 0 1 Q -1 1 -1 0');
  });
});

describe('affine helpers', () => {
  it('inverse undoes the transform', () => {
    const m: M = [[2, 0.5, 10], [-0.3, 1.5, 4]];
    const [x, y] = apply(mul(inv(m), m), 7, -3);
    expect(x).toBeCloseTo(7, 9);
    expect(y).toBeCloseTo(-3, 9);
    expect(mul(I, m)).toEqual(m);
  });
});

// gradient handles come back from Figma's gradientTransform as frame px: the same handles build_vectors wrote
describe('gradientHandles', () => {
  it('round-trips the handles build_vectors sets', () => {
    const gt = linearTransform([0.2, 0.1], [0.8, 0.9]) as Transform;
    const h = gradientHandles(gt, 100, 50, [[1, 0, 10], [0, 1, 20]]);
    expect(h.from[0]).toBeCloseTo(30, 3);
    expect(h.from[1]).toBeCloseTo(25, 3);
    expect(h.to[0]).toBeCloseTo(90, 3);
    expect(h.to[1]).toBeCloseTo(65, 3);
  });
});
