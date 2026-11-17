import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

// figma-vector-motion scripts are plain CommonJS (run with node, no build) — tested through require
const require = createRequire(import.meta.url);
const fm = require('../.claude/skills/figma-vector-motion/scripts/figma-motion.cjs');
const dl = require('../.claude/skills/figma-vector-motion/scripts/dotlottie.cjs');

// Figma's own sampled spring curves (get_motion_context, 11/2026): 51 samples over the segment, by bounce
const FIGMA = {
  0.6938: [0, 0.0985, 0.342, 0.6483, 0.9442, 1.1767, 1.3179, 1.364, 1.3302, 1.2427, 1.1314, 1.0233, 0.9377, 0.8853, 0.8675, 0.8791, 0.9105, 0.9509, 0.9904, 1.0219, 1.0414, 1.0482, 1.0443, 1.033, 1.0183, 1.0039, 0.9923, 0.9851, 0.9825, 0.9838, 0.9878, 0.9932, 0.9984, 1.0027, 1.0054, 1.0064, 1.0059, 1.0045, 1.0025, 1.0006, 0.9991, 0.9981, 0.9977, 0.9978, 0.9983, 0.9991, 0.9998, 1.0003, 1.0007, 1.0008, 1.0008],
  0.25: [0, 0.0188, 0.0679, 0.1374, 0.2195, 0.308, 0.3978, 0.4856, 0.5686, 0.6452, 0.7142, 0.7753, 0.8283, 0.8735, 0.9113, 0.9423, 0.9671, 0.9866, 1.0014, 1.0123, 1.0198, 1.0247, 1.0274, 1.0283, 1.0281, 1.0268, 1.025, 1.0227, 1.0202, 1.0177, 1.0152, 1.0128, 1.0106, 1.0085, 1.0068, 1.0052, 1.0039, 1.0028, 1.0018, 1.0011, 1.0005, 1, 0.9997, 0.9995, 0.9993, 0.9992, 0.9992, 0.9992, 0.9992, 0.9993, 0.9993],
  0: [0, 0.0216, 0.0747, 0.1458, 0.2255, 0.3076, 0.3879, 0.4638, 0.5339, 0.5974, 0.6542, 0.7044, 0.7484, 0.7866, 0.8196, 0.8479, 0.8722, 0.8928, 0.9103, 0.9251, 0.9375, 0.948, 0.9568, 0.9642, 0.9703, 0.9754, 0.9797, 0.9832, 0.9862, 0.9886, 0.9906, 0.9923, 0.9936, 0.9948, 0.9957, 0.9965, 0.9971, 0.9976, 0.9981, 0.9984, 0.9987, 0.9989, 0.9991, 0.9993, 0.9994, 0.9995, 0.9996, 0.9997, 0.9997, 0.9998, 0.9998],
} as Record<string, number[]>;

describe('Figma spring model', () => {
  it('matches Figma\'s own curve for Bouncy, Gentle and Slow', () => {
    for (const [b, ys] of Object.entries(FIGMA)) {
      const p = fm.springCurve(Number(b)).p;
      ys.forEach((y, i) => expect(Math.abs(p(i / 50) - y)).toBeLessThan(0.001));
    }
  });
  it('keys a long spring at its peaks within 0.5 % of the travel', () => {
    for (const b of [0, 0.25, 0.42, 0.69]) {
      const s = fm.springKeys(0, 1, 0, 100, b, (a: number, c: number, q: number) => a + (c - a) * q, 60);
      expect(s.perFrame).toBeUndefined();
      expect(s.worst).toBeLessThan(0.005);
      expect(s.keys.length).toBeLessThan(10);
    }
  });
  it('keys a spring too short for pieces on every frame', () => {
    const s = fm.springKeys(0, 0.2, 0, 14, 0.69, (a: number, c: number, q: number) => a + (c - a) * q, 60);
    expect(s.perFrame).toBe(true);
    expect(s.keys.length).toBe(12);
  });
});

const kf = (t: number, v: number, easing?: object) => ({ timelinePosition: t, value: { type: 'FLOAT', value: v }, ...(easing ? { easing } : {}) });
const rig = (motion: object) => ({ frame: { id: '1:1', name: 'F', width: 100, height: 100, timeline: 1 }, children: [
  { id: '1:2', name: 'Bell', kind: 'group', opacity: 1, box: { x: 0, y: 0, w: 10, h: 10 }, children: [], motion: { origin: [5, 0], styles: 0, tracks: motion } },
] });

describe('figma-motion convert', () => {
  it('moves the ease to the leaving key and flips the rotation sign', () => {
    const r = rig({ ROTATION: { keyframes: [kf(0, 0, { type: 'LINEAR' }), kf(0.5, 20, { type: 'EASE_OUT', easingFunctionCubicBezier: { x1: 0, y1: 0, x2: 0.58, y2: 1 } }), kf(1, 0, { type: 'HOLD' })] } });
    const { motion } = fm.convert(r, {});
    expect(motion.tracks[0].pivot).toEqual([5, 0]);
    expect(motion.tracks[0].rotate).toEqual([[0, 0, [0, 0, 0.58, 1]], [0.5, -20, 'hold'], [1, 0]]);
    expect(motion.duration).toBe(1);
  });
  it('merges X and Y keyed together, samples them when they differ', () => {
    const ez = { type: 'LINEAR' };
    const same = fm.convert(rig({ TRANSLATION_X: { keyframes: [kf(0, 0), kf(1, 10, ez)] }, TRANSLATION_Y: { keyframes: [kf(0, 0), kf(1, -4, ez)] } }), {});
    expect(same.motion.tracks[0].move).toEqual([[0, [0, 0], 'linear'], [1, [10, -4]]]);
    const diff = fm.convert(rig({ TRANSLATION_X: { keyframes: [kf(0, 0), kf(1, 10, ez)] }, TRANSLATION_Y: { keyframes: [kf(0, 0), kf(0.5, -4, ez)] } }), { fps: 60 });
    expect(diff.motion.tracks[0].move.length).toBe(31);
    expect(diff.notes.join(' ')).toMatch(/sampled every 2 frames/);
  });
  it('warns on fields with no Lottie form', () => {
    const { warnings } = fm.convert(rig({ CORNER_RADIUS: { keyframes: [kf(0, 0), kf(1, 8)] } }), {});
    expect(warnings.join(' ')).toMatch(/CORNER_RADIUS keys not converted/);
  });
});

describe('dotLottie', () => {
  it('packs and unpacks the same animation', () => {
    const anim = { v: '5.7.0', fr: 60, ip: 0, op: 60, w: 10, h: 10, nm: 'Bell ring', layers: [], assets: [] };
    const buf = dl.pack(anim, { loop: true });
    expect(buf.readUInt32LE(0)).toBe(0x04034b50);
    const files = dl.unzip(buf);
    expect(JSON.parse(files['manifest.json'].toString()).animations[0]).toMatchObject({ id: 'bell_ring', loop: true });
    expect(dl.unpack(buf)).toEqual(anim);
  });
});
