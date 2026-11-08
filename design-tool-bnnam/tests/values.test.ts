import { describe, expect, it } from 'vitest';
import {
  expandSides,
  gradientTransform,
  matchFontStyle,
  parseColor,
  parseLetterSpacing,
  parseLineHeight,
  toHex,
  weightToStyle,
} from '../src/shared/values';

describe('parseColor', () => {
  it.each([
    ['#FFF', { r: 1, g: 1, b: 1, a: 1 }],
    ['#000000', { r: 0, g: 0, b: 0, a: 1 }],
    ['ff0000', { r: 1, g: 0, b: 0, a: 1 }],
    ['#00FF0080', { r: 0, g: 1, b: 0, a: 128 / 255 }],
    ['#0008', { r: 0, g: 0, b: 0, a: 136 / 255 }],
    ['rgb(255, 0, 0)', { r: 1, g: 0, b: 0, a: 1 }],
    ['rgba(0,0,255,0.5)', { r: 0, g: 0, b: 1, a: 0.5 }],
    ['rgb(0 0 255 / 50%)', { r: 0, g: 0, b: 1, a: 0.5 }],
  ])('%s', (input, expected) => {
    const c = parseColor(input);
    for (const k of ['r', 'g', 'b', 'a'] as const) expect(c[k]).toBeCloseTo(expected[k], 5);
  });

  it('rejects invalid colors with a helpful message', () => {
    expect(() => parseColor('blue')).toThrow(/Invalid color "blue"/);
    expect(() => parseColor('#12345')).toThrow();
  });

  it('round-trips through toHex', () => {
    expect(toHex(parseColor('#3B82F6'))).toBe('#3B82F6');
    expect(toHex(parseColor('#3B82F680'))).toBe('#3B82F680');
    expect(toHex({ r: 1, g: 1, b: 1 })).toBe('#FFFFFF');
  });
});

describe('gradientTransform', () => {
  const apply = (t: number[][], x: number, y: number) => t[0][0] * x + t[0][1] * y + t[0][2];

  it('90deg runs left to right (identity)', () => {
    expect(gradientTransform(90)).toEqual([
      [1, 0, 0],
      [0, 1, 0],
    ]);
  });

  it('180deg runs top to bottom', () => {
    const t = gradientTransform(180);
    expect(apply(t, 0.5, 0)).toBeCloseTo(0);
    expect(apply(t, 0.5, 1)).toBeCloseTo(1);
  });

  it('0deg runs bottom to top', () => {
    const t = gradientTransform(0);
    expect(apply(t, 0.5, 1)).toBeCloseTo(0);
    expect(apply(t, 0.5, 0)).toBeCloseTo(1);
  });
});

describe('text values', () => {
  it('parses line height', () => {
    expect(parseLineHeight(24)).toEqual({ unit: 'PIXELS', value: 24 });
    expect(parseLineHeight('150%')).toEqual({ unit: 'PERCENT', value: 150 });
    expect(parseLineHeight('auto')).toEqual({ unit: 'AUTO' });
    expect(parseLineHeight('20px')).toEqual({ unit: 'PIXELS', value: 20 });
    expect(() => parseLineHeight('tall')).toThrow();
  });

  it('parses letter spacing', () => {
    expect(parseLetterSpacing(-0.5)).toEqual({ unit: 'PIXELS', value: -0.5 });
    expect(parseLetterSpacing('-2%')).toEqual({ unit: 'PERCENT', value: -2 });
  });

  it('maps weights to style names', () => {
    expect(weightToStyle(400)).toBe('Regular');
    expect(weightToStyle(600)).toBe('Semi Bold');
    expect(weightToStyle('700')).toBe('Bold');
    expect(weightToStyle(650)).toBe('Bold');
    expect(weightToStyle('Medium')).toBe('Medium');
  });

  it('matches font styles regardless of spacing', () => {
    const styles = ['Regular', 'Semi Bold', 'Bold Italic'];
    expect(matchFontStyle('SemiBold', styles)).toBe('Semi Bold');
    expect(matchFontStyle('bold-italic', styles)).toBe('Bold Italic');
    expect(matchFontStyle('Black', styles)).toBeUndefined();
  });
});

describe('expandSides', () => {
  it('expands CSS-like shorthands', () => {
    expect(expandSides(8)).toEqual([8, 8, 8, 8]);
    expect(expandSides<number>([4, 8])).toEqual([4, 8, 4, 8]);
    expect(expandSides<number>([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });
});
