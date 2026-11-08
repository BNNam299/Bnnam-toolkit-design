// Layer naming for `rename_by_rule` (figma-ui-flow rule #4, file-standards.md
// §2.3). Pure: the plugin passes a light description of each layer.

import { DEFAULT_NAME, nameProblem } from './audit';
import { normalize } from './search';

export interface LayerInfo {
  type: string;
  name: string;
  text?: string;
  childCount?: number;
  hasImageFill?: boolean;
  isVector?: boolean;
  parentLayout?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  layout?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
}

export interface Rule {
  match: string;
  to: string;
  types?: string[];
}

export const slug = (s: string, max = 3): string =>
  normalize(s)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .join('-');

// Role names from §2.3: text → content slug, icon/…, image/…, layout regions.
export function suggestName(n: LayerInfo): string | null {
  if (n.type === 'TEXT') {
    const s = slug(n.text ?? '');
    return s ? `label/${s}` : 'label';
  }
  if (n.hasImageFill) return 'image/placeholder';
  if (n.isVector || ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'LINE'].includes(n.type)) return 'icon/glyph';
  if (n.type === 'ELLIPSE') return 'decor/circle';
  if (n.type === 'RECTANGLE') return 'decor/shape';
  if (n.type === 'GROUP') return 'group';
  if (['FRAME', 'COMPONENT', 'INSTANCE'].includes(n.type)) {
    if (n.layout === 'HORIZONTAL') return 'row';
    if (n.layout === 'VERTICAL') return 'stack';
    return (n.childCount ?? 0) > 0 ? 'container' : 'decor/frame';
  }
  return null;
}

export function applyRules(n: LayerInfo, rules: Rule[]): string | null {
  for (const r of rules) {
    if (r.types?.length && !r.types.includes(n.type)) continue;
    const re = new RegExp(r.match);
    if (re.test(n.name)) return n.name.replace(re, r.to);
  }
  return null;
}

// Explicit rules win; `auto` only touches names Figma invented or the
// blacklist (never a name a designer chose).
export function planRename(n: LayerInfo, rules: Rule[], auto: boolean): string | null {
  const ruled = applyRules(n, rules);
  if (ruled !== null && ruled !== n.name) return ruled;
  if (auto && (DEFAULT_NAME.test(n.name) || nameProblem(n.name) === 'blacklisted-name')) {
    const s = suggestName(n);
    return s && s !== n.name ? s : null;
  }
  return null;
}
