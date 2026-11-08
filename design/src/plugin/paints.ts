import type { FillInput, PaintInput } from '../shared/schemas';
import { gradientTransform, parseColor } from '../shared/values';
import type { Resources } from './resources';

export type ResolvedFill = { style: PaintStyle } | { paints: Paint[] };

export async function resolveFill(input: FillInput, res: Resources): Promise<ResolvedFill> {
  const list = Array.isArray(input) ? input : [input];
  const styleRef = list.find((p): p is { style: string } => typeof p === 'object' && 'style' in p);
  if (styleRef) {
    if (list.length > 1) throw new Error('A paint style must be the only entry of a fill.');
    return { style: await res.paintStyle(styleRef.style) };
  }
  // Figma paints are listed bottom-up; the DSL lists them top-down like CSS.
  const paints = await Promise.all(list.map((p) => toPaint(p, res)));
  return { paints: paints.reverse() };
}

export function solid(color: string): SolidPaint {
  const c = parseColor(color);
  return { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a };
}

async function toPaint(p: PaintInput, res: Resources): Promise<Paint> {
  if (typeof p === 'string') return solid(p);
  if ('var' in p) {
    const variable = await res.variable(p.var);
    return figma.variables.setBoundVariableForPaint(solid('#000000'), 'color', variable);
  }
  if ('gradient' in p) {
    const type = `GRADIENT_${p.gradient}` as GradientPaint['type'];
    const transform: Transform =
      p.gradient === 'LINEAR' ? gradientTransform(p.angle ?? 180) : [[1, 0, 0], [0, 1, 0]];
    return {
      type,
      gradientTransform: transform,
      gradientStops: p.stops.map((s) => {
        const c = parseColor(s.color);
        return { position: s.position, color: { r: c.r, g: c.g, b: c.b, a: c.a } };
      }),
    };
  }
  if ('imageBase64' in p) {
    return { type: 'IMAGE', imageHash: res.imageHash(p.imageBase64), scaleMode: p.scaleMode ?? 'FILL' };
  }
  if ('image' in p && p.image.startsWith('hash:')) {
    // Round-trip of an existing image as reported by get_node.
    return { type: 'IMAGE', imageHash: p.image.slice(5), scaleMode: p.scaleMode ?? 'FILL' };
  }
  if ('image' in p) {
    // Normally the MCP server downloads images and sends imageBase64. This
    // path is only reached from the in-plugin test box.
    const image = await figma.createImageAsync(p.image);
    return { type: 'IMAGE', imageHash: image.hash, scaleMode: p.scaleMode ?? 'FILL' };
  }
  throw new Error(`Unsupported paint ${JSON.stringify(p)}`);
}

interface ShadowInput {
  type?: 'DROP' | 'INNER';
  color?: string;
  x?: number;
  y?: number;
  blur?: number;
  spread?: number;
}

const PRESETS: Record<string, ShadowInput[]> = {
  none: [],
  sm: [{ y: 1, blur: 2, color: '#0000000D' }],
  md: [
    { y: 4, blur: 6, spread: -1, color: '#0000001A' },
    { y: 2, blur: 4, spread: -2, color: '#0000001A' },
  ],
  lg: [
    { y: 10, blur: 15, spread: -3, color: '#0000001A' },
    { y: 4, blur: 6, spread: -4, color: '#0000001A' },
  ],
  xl: [
    { y: 20, blur: 25, spread: -5, color: '#0000001A' },
    { y: 8, blur: 10, spread: -6, color: '#0000001A' },
  ],
};

export type EffectsInput = string | { style: string } | (ShadowInput | { layerBlur: number } | { backgroundBlur: number })[];

export async function resolveEffects(
  input: EffectsInput,
  res: Resources,
): Promise<{ style: EffectStyle } | { effects: Effect[] }> {
  if (typeof input === 'object' && !Array.isArray(input)) return { style: await res.effectStyle(input.style) };
  const list = typeof input === 'string' ? PRESETS[input] : input;
  if (!list) throw new Error(`Unknown shadow preset "${String(input)}". Use none, sm, md, lg or xl.`);
  return {
    effects: list.map((e): Effect => {
      if ('layerBlur' in e) return { type: 'LAYER_BLUR', blurType: 'NORMAL', radius: e.layerBlur, visible: true };
      if ('backgroundBlur' in e) {
        return { type: 'BACKGROUND_BLUR', blurType: 'NORMAL', radius: e.backgroundBlur, visible: true };
      }
      const s = e;
      const c = parseColor(s.color ?? '#0000001A');
      return {
        type: s.type === 'INNER' ? 'INNER_SHADOW' : 'DROP_SHADOW',
        color: { r: c.r, g: c.g, b: c.b, a: c.a },
        offset: { x: s.x ?? 0, y: s.y ?? 0 },
        radius: s.blur ?? 0,
        spread: s.spread ?? 0,
        visible: true,
        blendMode: 'NORMAL',
      };
    }),
  };
}
