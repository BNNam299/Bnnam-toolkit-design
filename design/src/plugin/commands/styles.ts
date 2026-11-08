// figma-ui-flow Stage 2 — text, paint, effect and grid styles in one call.
// Text style properties can bind variables ({ var }) so typography follows
// the token system (design-system.md §4).
import type { CreateStylesInput, StyleSpec } from '../../shared/schemas';
import { parseLetterSpacing, parseLineHeight, weightToStyle } from '../../shared/values';
import { resolveGrids } from '../apply';
import { loadFont, resolveFont } from '../fonts';
import { resolveEffects, resolveFill } from '../paints';
import { Resources } from '../resources';
import { RolledBackError } from '../util';

type AnyStyle = TextStyle | PaintStyle | EffectStyle | GridStyle;

async function localStyles(): Promise<Record<StyleSpec['kind'], AnyStyle[]>> {
  const [text, paint, effect, grid] = await Promise.all([
    figma.getLocalTextStylesAsync(),
    figma.getLocalPaintStylesAsync(),
    figma.getLocalEffectStylesAsync(),
    figma.getLocalGridStylesAsync(),
  ]);
  return { text, paint, effect, grid };
}

export async function createStyles(p: CreateStylesInput) {
  const res = new Resources();
  const existing = await localStyles();
  const created: { id: string; name: string; kind: string }[] = [];
  const updated: { id: string; name: string; kind: string }[] = [];
  const skipped: string[] = [];
  const fresh: BaseStyle[] = [];

  const names = new Set<string>();
  for (const s of p.styles) {
    const key = `${s.kind}:${s.name}`;
    if (names.has(key)) throw new RolledBackError(`style ${s.kind} "${s.name}" bị khai báo trùng`);
    names.add(key);
  }

  try {
    for (const spec of p.styles) {
      let style = existing[spec.kind].find((x) => x.name === spec.name);
      if (style && p.onExisting === 'error') {
        throw new Error(`style ${spec.kind} "${spec.name}" đã tồn tại (dùng onExisting: "skip" hoặc "update")`);
      }
      if (style && p.onExisting === 'skip') {
        skipped.push(`${spec.kind}:${spec.name}`);
        continue;
      }
      const isNew = !style;
      if (!style) {
        style =
          spec.kind === 'text'
            ? figma.createTextStyle()
            : spec.kind === 'paint'
              ? figma.createPaintStyle()
              : spec.kind === 'effect'
                ? figma.createEffectStyle()
                : figma.createGridStyle();
        fresh.push(style);
        style.name = spec.name;
      }
      if (spec.description !== undefined) style.description = spec.description;

      if (spec.kind === 'text') {
        const t = style as TextStyle;
        const font = await resolveFont(spec.fontFamily, spec.fontStyle ?? (spec.fontWeight !== undefined ? weightToStyle(spec.fontWeight) : 'Regular'));
        await loadFont(font);
        t.fontName = font;
        if (typeof spec.fontSize === 'number') t.fontSize = spec.fontSize;
        else t.setBoundVariable('fontSize', await res.variable(spec.fontSize.var));
        if (spec.lineHeight !== undefined) t.lineHeight = parseLineHeight(spec.lineHeight);
        if (spec.letterSpacing !== undefined) t.letterSpacing = parseLetterSpacing(spec.letterSpacing);
        if (spec.textCase !== undefined) t.textCase = spec.textCase;
        if (spec.decoration !== undefined) t.textDecoration = spec.decoration;
      } else if (spec.kind === 'paint') {
        const r = await resolveFill(spec.fill, res);
        if ('style' in r) throw new Error(`paint style "${spec.name}" không thể trỏ tới style khác`);
        (style as PaintStyle).paints = r.paints;
      } else if (spec.kind === 'effect') {
        const r = await resolveEffects(spec.effects, res);
        if ('style' in r) throw new Error(`effect style "${spec.name}" không thể trỏ tới style khác`);
        (style as EffectStyle).effects = r.effects;
      } else {
        (style as GridStyle).layoutGrids = resolveGrids(spec.grids);
      }
      (isNew ? created : updated).push({ id: style.id, name: style.name, kind: spec.kind });
    }
  } catch (e) {
    // Leave no half-made styles behind. Updates to existing styles are not
    // undone, so the canvas is only "clean" when nothing was updated yet.
    for (const s of fresh) s.remove();
    const msg = `${e instanceof Error ? e.message : String(e)} (các style mới đã bị gỡ)`;
    if (updated.length) throw new Error(`${msg}; đã cập nhật trước khi lỗi: ${updated.map((u) => u.name).join(', ')}`);
    throw new RolledBackError(msg);
  }
  return { created, updated, skipped };
}
