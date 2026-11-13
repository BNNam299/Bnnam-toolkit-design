import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { analyzeAnchors, anchorFinding, ANCHOR_LOOK_AT, parsePath } from '../src/shared/anchors';

// The skill's simplifier (plain JS pasted into execute_code) — tested here so the plugin and the skill agree.
const require = createRequire(import.meta.url);
const skill = require('../.claude/skills/figma-vector-illustration/scripts/anchors.js') as {
  simplifyPath: (d: string, o?: { tol?: number }) => { d: string; before: number; after: number; maxDev: number; changed: boolean };
  analyzeAnchors: typeof analyzeAnchors;
};

const k = 0.5523 * 50;
const CIRCLE4 = `M 100 50 C 100 ${50 + k} ${50 + k} 100 50 100 C ${50 - k} 100 0 ${50 + k} 0 50 C 0 ${50 - k} ${50 - k} 0 50 0 C ${50 + k} 0 100 ${50 - k} 100 50 Z`;
const polyCircle = (() => {
  let d = 'M 100 50';
  for (let i = 1; i < 100; i++) d += ` L ${50 + 50 * Math.cos((i / 100) * 2 * Math.PI)} ${50 + 50 * Math.sin((i / 100) * 2 * Math.PI)}`;
  return d + ' Z';
})();
const STAR = (() => {
  let s = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 20 : 50;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    s += `${i ? ' L ' : 'M '}${50 + r * Math.cos(a)} ${50 + r * Math.sin(a)}`;
  }
  return s + ' Z';
})();

describe('parsePath', () => {
  it('counts anchors of open, closed, relative and H/V paths', () => {
    expect(parsePath('M 0 0 L 10 0 L 10 10 Z')[0].segs).toHaveLength(3);
    expect(analyzeAnchors('M 0 0 L 10 0 L 10 10 Z').anchors).toBe(3);
    expect(analyzeAnchors('M 0 0 h 10 v 10').anchors).toBe(3);
    expect(analyzeAnchors('M 0 0 Q 5 10 10 0').anchors).toBe(2);
  });
});

describe('analyzeAnchors / anchorFinding (audit)', () => {
  it('flags a circle drawn point by point', () => {
    const s = analyzeAnchors(polyCircle);
    expect(s.polylineRuns).toBeGreaterThan(0);
    expect(anchorFinding(s)).toContain('100 điểm neo');
  });
  it('flags collinear anchors', () => {
    expect(analyzeAnchors('M 0 0 L 10 0 L 20 0 L 30 0 L 30 30 L 0 30 Z').removable).toBe(2);
  });
  it('leaves clean shapes alone — a proper circle, a star, a 2-anchor leaf', () => {
    for (const d of [CIRCLE4, STAR, 'M 0 0 C 20 -15 50 -15 70 0 C 50 15 20 15 0 0 Z']) expect(anchorFinding(analyzeAnchors(d))).toBeNull();
  });
  it('asks for a look at very dense paths even without other signals', () => {
    expect(anchorFinding({ anchors: ANCHOR_LOOK_AT, removable: 0, polylineRuns: 0, polylineAnchors: 0 })).not.toBeNull();
  });
  it('agrees with the skill copy', () => {
    for (const d of [polyCircle, CIRCLE4, STAR]) expect(skill.analyzeAnchors(d)).toEqual(analyzeAnchors(d));
  });
});

describe('simplifyPath (skill) — the shape first, then the fewest anchors', () => {
  it('turns a 100-point circle into a few Béziers within 0.5 px', () => {
    const r = skill.simplifyPath(polyCircle);
    expect(r.after).toBeLessThanOrEqual(6);
    expect(r.maxDev).toBeLessThanOrEqual(0.5);
  });
  it('never touches shapes that are already lean', () => {
    for (const d of [CIRCLE4, STAR]) expect(skill.simplifyPath(d).changed).toBe(false);
  });
  it('keeps small details the shape needs', () => {
    expect(skill.simplifyPath('M 0 0 L 10 0 L 11 1 L 12 0 L 24 0 L 24 24 L 0 24 Z', { tol: 0.25 }).changed).toBe(false);
    let e = 'M 0 0';
    for (let x = 1; x <= 40; x++) e += ` L ${x} ${x >= 19 && x <= 21 ? 0.8 : 0}`;
    const r = skill.simplifyPath(e + ' L 40 10 L 0 10 Z', { tol: 0.25 });
    expect(r.after).toBe(8);
    expect(r.d).toContain('0.8');
  });
});

describe('fitOutline (skill) — a traced outline becomes long smooth curves, never stairs', () => {
  const fit = skill as unknown as {
    fitOutline: (d: string, o?: { unit?: number }) => { d: string; before: number; after: number; maxDev: number };
    pathBounds: (d: string) => { x0: number; y0: number; x1: number; y1: number };
    parsePath: typeof parsePath;
  };
  // the outline of a pixel mask, traced by the skill's own marching squares with no blur: 1 px stairs everywhere
  const contour = require('../.claude/skills/figma-vector-illustration/scripts/contour.cjs') as {
    marching: (f: Float32Array, W: number, H: number) => { x: number; y: number }[][];
  };
  const stairs = (inside: (x: number, y: number) => boolean) => {
    const W = 100, f = new Float32Array(W * W);
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) f[y * W + x] = inside(x + 0.5, y + 0.5) ? 1 : 0;
    const loop = contour.marching(f, W, W).reduce((a, b) => (b.length > a.length ? b : a));
    return 'M ' + loop.map((p) => `${p.x + 0.5} ${p.y + 0.5}`).join(' L ') + ' Z';
  };
  it('a pixel-stair circle → a handful of curves, no short straight pieces', () => {
    const r = fit.fitOutline(stairs((x, y) => (x - 50) ** 2 + (y - 50) ** 2 <= 1600));
    expect(r.before).toBeGreaterThan(150);
    expect(r.after).toBeLessThanOrEqual(12);
    expect(r.maxDev).toBeLessThanOrEqual(1);
    const short = fit.parsePath(r.d)[0].segs.filter((g, k, all) => { const a = k ? all[k - 1].p : fit.parsePath(r.d)[0].start; return g.t === 'L' && Math.hypot(g.p.x - a.x, g.p.y - a.y) < 2; });
    expect(short).toHaveLength(0);
  });
  it('keeps the real corners of a square (four straight sides)', () => {
    const r = fit.fitOutline('M 20 20 L 80 20 L 80 80 L 20 80 Z');
    expect(r.after).toBe(4);
  });
  it('pathBounds reads the curve, not its handles', () => {
    const b = fit.pathBounds('M 0 10 C 0 -10 20 -10 20 10 Z'); // handles reach y = -10, the curve only y = -5
    expect(b.y0).toBeGreaterThan(-5.1);
    expect(b.y0).toBeLessThan(-4.9);
  });
});
