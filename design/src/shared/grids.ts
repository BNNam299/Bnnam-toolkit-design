// Layout grids for frames and grid styles (file-standards.md §4: 4 columns
// mobile, 8 tablet, 12 desktop). Pure: returns plain Figma LayoutGrid objects.
import { parseColor } from './values';

export interface GridSpec {
  pattern: 'COLUMNS' | 'ROWS' | 'GRID';
  count?: number | 'auto';
  gutter?: number;
  margin?: number;
  size?: number;
  alignment?: 'STRETCH' | 'CENTER' | 'MIN' | 'MAX';
  color?: string;
  visible?: boolean;
}

export type PlainGrid =
  | {
      pattern: 'COLUMNS' | 'ROWS';
      alignment: 'STRETCH' | 'CENTER' | 'MIN' | 'MAX';
      gutterSize: number;
      count: number;
      offset?: number;
      sectionSize?: number;
      visible: boolean;
      color: { r: number; g: number; b: number; a: number };
    }
  | { pattern: 'GRID'; sectionSize: number; visible: boolean; color: { r: number; g: number; b: number; a: number } };

export function toLayoutGrid(g: GridSpec): PlainGrid {
  const color = parseColor(g.color ?? (g.pattern === 'GRID' ? '#FF00001A' : '#FF000014'));
  const visible = g.visible ?? true;
  if (g.pattern === 'GRID') return { pattern: 'GRID', sectionSize: g.size ?? 8, visible, color };
  const alignment = g.alignment ?? 'STRETCH';
  if (alignment !== 'STRETCH' && g.size === undefined) {
    throw new Error(`Grid ${g.pattern} alignment ${alignment} cần size (độ rộng cột/hàng)`);
  }
  return {
    pattern: g.pattern,
    alignment,
    gutterSize: g.gutter ?? 16,
    count: g.count === 'auto' ? Infinity : (g.count ?? (g.pattern === 'COLUMNS' ? 4 : 1)),
    ...(alignment === 'STRETCH' ? { offset: g.margin ?? 16 } : { offset: g.margin ?? 0, sectionSize: g.size }),
    visible,
    color,
  };
}

// file-standards.md §4.1–4.2 presets, usable as `{ preset: "mobile" }`.
export const GRID_PRESETS: Record<string, GridSpec[]> = {
  mobile: [{ pattern: 'COLUMNS', count: 4, gutter: 16, margin: 16 }],
  tablet: [{ pattern: 'COLUMNS', count: 8, gutter: 24, margin: 32 }],
  desktop: [{ pattern: 'COLUMNS', count: 12, gutter: 24, margin: 80 }],
  baseline: [{ pattern: 'ROWS', count: 1, gutter: 0, margin: 0, alignment: 'MIN', size: 4, color: '#0000FF0D' }],
};
