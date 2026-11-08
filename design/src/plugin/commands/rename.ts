// figma-ui-flow rule #4 — clean up default and blacklisted layer names, by
// explicit rules or role names (file-standards.md §2.3). dryRun by default.
import { planRename, type LayerInfo } from '../../shared/rename';
import type { RenameByRuleInput } from '../../shared/schemas';
import { getNode } from '../util';

function info(n: SceneNode): LayerInfo {
  const fills = 'fills' in n && Array.isArray(n.fills) ? (n.fills as Paint[]) : [];
  return {
    type: n.type,
    name: n.name,
    text: n.type === 'TEXT' ? n.characters : undefined,
    childCount: 'children' in n ? n.children.length : 0,
    hasImageFill: fills.some((f) => f.type === 'IMAGE'),
    // A frame holding only vectors is an icon (Lucide/SVG import).
    isVector:
      'children' in n &&
      n.children.length > 0 &&
      n.children.every((c) => ['VECTOR', 'BOOLEAN_OPERATION', 'LINE', 'STAR', 'POLYGON', 'ELLIPSE'].includes(c.type)) &&
      n.width <= 48 &&
      n.height <= 48,
    layout: 'layoutMode' in n ? (n as FrameNode).layoutMode === 'GRID' ? 'NONE' : ((n as FrameNode).layoutMode as LayerInfo['layout']) : undefined,
  };
}

export async function renameByRule(p: RenameByRuleInput) {
  for (const r of p.rules) {
    try {
      new RegExp(r.match);
    } catch (e) {
      throw new Error(`rule "${r.match}": RegExp không hợp lệ (${String(e)})`);
    }
  }
  const root = await getNode(p.rootId);
  const nodes: SceneNode[] = 'findAll' in root ? (root as ChildrenMixin).findAll(() => true) : [];
  if (root.type !== 'PAGE' && root.type !== 'DOCUMENT') nodes.unshift(root as SceneNode);

  const changes: { id: string; from: string; to: string }[] = [];
  for (const n of nodes) {
    // Instance sublayers keep the main component's names.
    if (n.id.startsWith('I')) continue;
    const to = planRename(info(n), p.rules, p.auto);
    if (!to) continue;
    changes.push({ id: n.id, from: n.name, to });
    if (!p.dryRun) n.name = to;
  }
  return {
    dryRun: p.dryRun,
    renamed: changes.length,
    changes: changes.slice(0, p.limit),
    hint: p.dryRun ? 'Chưa đổi gì. Kiểm tra changes rồi gọi lại với dryRun: false.' : undefined,
  };
}
