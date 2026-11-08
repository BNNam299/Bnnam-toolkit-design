import { matchFontStyle, weightToStyle } from '../shared/values';

let available: Promise<Font[]> | null = null;
const loaded = new Set<string>();

export function listFonts(): Promise<Font[]> {
  if (!available) available = figma.listAvailableFontsAsync();
  return available;
}

const key = (f: FontName) => `${f.family}::${f.style}`;

export async function loadFont(font: FontName): Promise<void> {
  if (loaded.has(key(font))) return;
  await figma.loadFontAsync(font);
  loaded.add(key(font));
}

// Resolves a family + style/weight into a FontName that exists, tolerating
// "SemiBold" vs "Semi Bold". Throws with the available styles otherwise.
export async function resolveFont(family: string, style?: string, weight?: number | string): Promise<FontName> {
  const wanted = style ?? (weight !== undefined ? weightToStyle(weight) : 'Regular');
  const fonts = await listFonts();
  const familyLower = family.toLowerCase();
  const styles = fonts.filter((f) => f.fontName.family.toLowerCase() === familyLower).map((f) => f.fontName.style);
  if (styles.length === 0) {
    throw new Error(`Font family "${family}" is not available. Call list_fonts to see installed families.`);
  }
  const exact = matchFontStyle(wanted, styles);
  if (!exact) throw new Error(`Font "${family}" has no style "${wanted}". Available: ${styles.join(', ')}.`);
  const realFamily = fonts.find((f) => f.fontName.family.toLowerCase() === familyLower)!.fontName.family;
  return { family: realFamily, style: exact };
}

// Loads every font used by an existing text node; required before editing it.
export async function loadNodeFonts(node: TextNode): Promise<void> {
  if (node.characters.length === 0) {
    if (node.fontName !== figma.mixed) await loadFont(node.fontName);
    return;
  }
  const segments = node.getStyledTextSegments(['fontName']);
  await Promise.all(segments.map((s) => loadFont(s.fontName)));
}
