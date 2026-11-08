// Finds icon slots under the written nodes and measures where the glyph
// really is (render bounds = painted ink, strokes included). The verdict and
// its hint live in ../shared/icons.ts.
import { iconProblem, isSlotSize, type Box, type SlotInfo } from '../shared/icons';

const VECTORISH = new Set<string>(['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'RECTANGLE', 'STAR', 'POLYGON']);
const ICON_BOX = new Set<string>(['FRAME', 'GROUP', 'INSTANCE', 'COMPONENT']);
const SLOT = new Set<string>(['FRAME', 'COMPONENT']);
const MAX_NODES = 3000;

export interface IconIssue {
  id: string;
  name: string;
  detail: string;
}

const toBox = (r: Rect | null): Box | null => (r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null);

function union(boxes: Box[]): Box | null {
  if (!boxes.length) return null;
  const x0 = Math.min(...boxes.map((b) => b.x));
  const y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.w));
  const y1 = Math.max(...boxes.map((b) => b.y + b.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// The single icon of a slot: an SVG frame / icon instance / group made only
// of vectors, or a one- or two-character text glyph. Anything else (a label,
// a swatch, an avatar) is not an icon slot.
function iconOf(slot: FrameNode | ComponentNode): { icon: Box; glyph: Box } | null {
  const kids = slot.children.filter((c) => c.visible);
  if (kids.length !== 1) return null;
  const c = kids[0];
  if (c.type === 'TEXT') {
    const chars = c.characters.trim();
    if (!chars || [...chars].length > 2) return null;
    const glyph = toBox(c.absoluteRenderBounds);
    const icon = toBox(c.absoluteBoundingBox);
    return glyph && icon ? { icon, glyph } : null;
  }
  if (!ICON_BOX.has(c.type) || !('findAll' in c)) return null;
  const leaves = (c as FrameNode).findAll((n) => !('children' in n) && n.visible);
  if (!leaves.length || !leaves.every((n) => VECTORISH.has(n.type))) return null;
  const glyph = union(leaves.map((n) => toBox('absoluteRenderBounds' in n ? n.absoluteRenderBounds : null)).filter((b): b is Box => !!b));
  const icon = toBox(c.absoluteBoundingBox);
  return glyph && icon ? { icon, glyph } : null;
}

/** Icon slots under `roots` (roots included) whose glyph is off-centre. */
export function offCentreIcons(roots: readonly BaseNode[]): IconIssue[] {
  const issues: IconIssue[] = [];
  const seen = new Set<string>();
  let budget = MAX_NODES;
  const visit = (n: BaseNode) => {
    if (budget-- <= 0 || seen.has(n.id) || !('visible' in n) || !n.visible) return;
    seen.add(n.id);
    // Instances repeat their main component: report the component once.
    if (n.type === 'INSTANCE') return;
    if (SLOT.has(n.type)) {
      const slot = n as FrameNode | ComponentNode;
      const box = toBox(slot.absoluteBoundingBox);
      const found = box && isSlotSize(box) ? iconOf(slot) : null;
      if (box && found) {
        const info: SlotInfo = {
          box,
          layout: slot.layoutMode,
          primary: slot.primaryAxisAlignItems,
          counter: slot.counterAxisAlignItems,
          padding: [slot.paddingTop, slot.paddingRight, slot.paddingBottom, slot.paddingLeft],
        };
        const inFrame = {
          dx: found.glyph.x + found.glyph.w / 2 - (found.icon.x + found.icon.w / 2),
          dy: found.glyph.y + found.glyph.h / 2 - (found.icon.y + found.icon.h / 2),
        };
        const detail = iconProblem(info, found.glyph, inFrame);
        if (detail) issues.push({ id: slot.id, name: slot.name, detail });
      }
    }
    if ('children' in n) for (const c of (n as ChildrenMixin).children) visit(c);
  };
  for (const r of roots) visit(r);
  return issues;
}

/** One line per issue, for a write tool's `warnings`. */
export function iconWarnings(roots: readonly BaseNode[]): string[] {
  return offCentreIcons(roots).map((i) => `icon-offcenter "${i.name}" (${i.id}): ${i.detail}`);
}
