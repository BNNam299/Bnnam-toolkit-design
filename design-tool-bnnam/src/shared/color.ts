// Colour distance and variable matching for `bind_variables` (figma-ui-flow
// Stage 7: bulk raw-fill fixes). Pure: the plugin passes resolved values.

export type RGB = { r: number; g: number; b: number };

function toLab({ r, g, b }: RGB): [number, number, number] {
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  // sRGB → XYZ (D65), normalised by the white point.
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

// CIE76 ΔE: < 1 is invisible, ≈ 2 is "only a trained eye sees it".
export function deltaE(a: RGB, b: RGB): number {
  const [l1, a1, b1] = toLab(a);
  const [l2, a2, b2] = toLab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

export type Field = 'fill' | 'text-fill' | 'stroke' | 'gap' | 'radius';

// Which variable scopes may be bound to a field (Figma VariableScope names).
const SCOPES: Record<Field, string[]> = {
  fill: ['ALL_SCOPES', 'ALL_FILLS', 'FRAME_FILL', 'SHAPE_FILL'],
  'text-fill': ['ALL_SCOPES', 'ALL_FILLS', 'TEXT_FILL'],
  stroke: ['ALL_SCOPES', 'STROKE_COLOR'],
  gap: ['ALL_SCOPES', 'GAP'],
  radius: ['ALL_SCOPES', 'CORNER_RADIUS'],
};

// Primitives carry scopes = [] (hidden from pickers) and must never be bound
// directly (design-system.md §1), so an empty scope list never matches.
export function scopeAllows(scopes: string[], field: Field): boolean {
  return scopes.some((s) => SCOPES[field].includes(s));
}

export interface ColorCandidate {
  id: string;
  name: string;
  scopes: string[];
  value: RGB;
}

export type Match<T> =
  | { kind: 'match'; variable: T; distance: number }
  | { kind: 'ambiguous'; candidates: T[]; distance: number }
  | { kind: 'none' };

// Nearest in-scope colour within `tolerance` ΔE. Several variables at the
// same best distance (e.g. text/primary and bg/inverse both gray-900) is
// ambiguous: the caller must decide via an explicit map.
export function nearestColor(target: RGB, field: Field, candidates: ColorCandidate[], tolerance = 2): Match<ColorCandidate> {
  let best = Infinity;
  let hits: ColorCandidate[] = [];
  for (const c of candidates) {
    if (!scopeAllows(c.scopes, field)) continue;
    const d = deltaE(target, c.value);
    if (d > tolerance) continue;
    if (d < best - 0.05) {
      best = d;
      hits = [c];
    } else if (Math.abs(d - best) <= 0.05) {
      hits.push(c);
    }
  }
  if (hits.length === 0) return { kind: 'none' };
  const distance = Math.round(best * 100) / 100;
  return hits.length === 1 ? { kind: 'match', variable: hits[0], distance } : { kind: 'ambiguous', candidates: hits, distance };
}

export interface NumberCandidate {
  id: string;
  name: string;
  scopes: string[];
  value: number;
}

export function exactNumber(target: number, field: Field, candidates: NumberCandidate[]): Match<NumberCandidate> {
  const hits = candidates.filter((c) => scopeAllows(c.scopes, field) && Math.abs(c.value - target) < 0.01);
  if (hits.length === 0) return { kind: 'none' };
  return hits.length === 1 ? { kind: 'match', variable: hits[0], distance: 0 } : { kind: 'ambiguous', candidates: hits, distance: 0 };
}
