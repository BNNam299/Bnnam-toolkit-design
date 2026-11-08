// Motion tokens → Figma prototype transitions (figma-ui-flow Stage 6,
// design-system.md §2.5). Pure: the plugin resolves duration variables first.

export interface EasingSpec {
  type: string;
  easingFunctionCubicBezier?: { x1: number; y1: number; x2: number; y2: number };
}

// The master's named easings, plus Figma's own names passed through.
const NAMED: Record<string, EasingSpec> = {
  standard: { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1: 0.2, y1: 0, x2: 0, y2: 1 } },
  decelerate: { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1: 0, y1: 0, x2: 0, y2: 1 } },
  accelerate: { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1: 0.3, y1: 0, x2: 1, y2: 1 } },
  spring: { type: 'GENTLE' },
  linear: { type: 'LINEAR' },
};

const FIGMA_EASINGS = [
  'EASE_IN',
  'EASE_OUT',
  'EASE_IN_AND_OUT',
  'LINEAR',
  'EASE_IN_BACK',
  'EASE_OUT_BACK',
  'EASE_IN_AND_OUT_BACK',
  'GENTLE',
  'QUICK',
  'BOUNCY',
  'SLOW',
];

export function easingFor(name = 'standard'): EasingSpec {
  if (NAMED[name]) return NAMED[name];
  if (FIGMA_EASINGS.includes(name)) return { type: name };
  const bezier = /^cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)$/.exec(name);
  if (bezier) {
    const [x1, y1, x2, y2] = bezier.slice(1).map(Number);
    return { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1, y1, x2, y2 } };
  }
  throw new Error(`Easing "${name}" không hợp lệ. Dùng standard, decelerate, accelerate, spring, linear, ${FIGMA_EASINGS.join(', ')} hoặc cubic-bezier(a,b,c,d).`);
}

// Motion tokens are stored in milliseconds; Figma transitions use seconds.
export function msToSeconds(ms: number): number {
  if (!Number.isFinite(ms) || ms < 0) throw new Error(`Thời lượng ${ms}ms không hợp lệ`);
  if (ms > 0 && ms < 10) {
    throw new Error(`Thời lượng ${ms} quá nhỏ — motion token lưu bằng mili giây (vd 250), không phải giây`);
  }
  return Math.round(ms) / 1000;
}

export const DIRECTIONAL = ['MOVE_IN', 'MOVE_OUT', 'PUSH', 'SLIDE_IN', 'SLIDE_OUT'];

export function transitionFor(spec: { type: string; direction?: string; easing?: string }, durationMs: number) {
  const easing = easingFor(spec.easing);
  const duration = msToSeconds(durationMs);
  if (DIRECTIONAL.includes(spec.type)) {
    return { type: spec.type, direction: spec.direction ?? 'LEFT', matchLayers: false, easing, duration };
  }
  return { type: spec.type, easing, duration };
}
