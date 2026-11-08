// Pure conversions shared by the plugin and the server. No figma or node APIs
// here so the functions stay unit-testable.

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function parseColor(input: string): Rgba {
  const s = input.trim();
  const hex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = h.split('').map((c) => c + c).join('');
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(s);
  if (fn) {
    let a = 1;
    if (fn[4] !== undefined) a = fn[4].endsWith('%') ? parseFloat(fn[4]) / 100 : parseFloat(fn[4]);
    return {
      r: clamp01(parseFloat(fn[1]) / 255),
      g: clamp01(parseFloat(fn[2]) / 255),
      b: clamp01(parseFloat(fn[3]) / 255),
      a: clamp01(a),
    };
  }
  throw new Error(`Invalid color "${input}". Use #RGB, #RRGGBB, #RRGGBBAA, rgb() or rgba().`);
}

export function toHex(c: { r: number; g: number; b: number; a?: number }): string {
  const h = (v: number) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0').toUpperCase();
  const base = `#${h(c.r)}${h(c.g)}${h(c.b)}`;
  return c.a === undefined || c.a >= 0.999 ? base : base + h(c.a);
}

// Figma gradientTransform for a CSS-style angle (0 = to top, 90 = to right,
// 180 = to bottom). The transform maps node space (0..1) to gradient space,
// where the gradient runs along x from 0 to 1, rotated about the center.
export function gradientTransform(angleDeg: number): [[number, number, number], [number, number, number]] {
  const phi = ((angleDeg - 90) * Math.PI) / 180;
  const cos = round6(Math.cos(phi));
  const sin = round6(Math.sin(phi));
  return [
    [cos, sin, round6(0.5 - 0.5 * cos - 0.5 * sin)],
    [round6(-sin), cos, round6(0.5 + 0.5 * sin - 0.5 * cos)],
  ];
}

const round6 = (v: number) => Math.round(v * 1e6) / 1e6 || 0;

export type LineHeightValue = { unit: 'AUTO' } | { unit: 'PIXELS' | 'PERCENT'; value: number };

// 24 → 24px, "150%" → percent, "AUTO" → auto, "24px" → 24px.
export function parseLineHeight(v: number | string): LineHeightValue {
  if (typeof v === 'number') return { unit: 'PIXELS', value: v };
  if (v.toUpperCase() === 'AUTO') return { unit: 'AUTO' };
  return parseLength(v);
}

export function parseLetterSpacing(v: number | string): { unit: 'PIXELS' | 'PERCENT'; value: number } {
  if (typeof v === 'number') return { unit: 'PIXELS', value: v };
  return parseLength(v);
}

function parseLength(v: string): { unit: 'PIXELS' | 'PERCENT'; value: number } {
  const m = /^(-?[\d.]+)\s*(%|px)?$/i.exec(v.trim());
  if (!m) throw new Error(`Invalid length "${v}". Use a number (px) or a string like "150%".`);
  return { unit: m[2] === '%' ? 'PERCENT' : 'PIXELS', value: parseFloat(m[1]) };
}

const WEIGHT_STYLES: Record<number, string> = {
  100: 'Thin',
  200: 'Extra Light',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semi Bold',
  700: 'Bold',
  800: 'Extra Bold',
  900: 'Black',
};

export function weightToStyle(weight: number | string): string {
  if (typeof weight === 'string' && !/^\d+$/.test(weight)) return weight;
  const n = Math.round(Number(weight) / 100) * 100;
  return WEIGHT_STYLES[Math.min(900, Math.max(100, n))];
}

// "SemiBold", "semi-bold" and "Semi Bold" all compare equal.
export const normalizeStyle = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, '');

// Picks the style from `available` that matches `wanted`, tolerating spacing
// differences. Returns undefined when nothing matches.
export function matchFontStyle(wanted: string, available: string[]): string | undefined {
  const w = normalizeStyle(wanted);
  return available.find((s) => normalizeStyle(s) === w);
}

// [all] | [vertical, horizontal] | [top, right, bottom, left] → 4 sides.
export function expandSides<T>(v: T | [T, T] | [T, T, T, T]): [T, T, T, T] {
  if (!Array.isArray(v)) return [v, v, v, v];
  if (v.length === 2) return [v[0], v[1], v[0], v[1]];
  return v;
}
