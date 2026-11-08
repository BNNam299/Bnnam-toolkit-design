import type {
  CloneNodeInput,
  DeleteNodesInput,
  MoveNodesInput,
  SelectNodesInput,
  UpdateNodesInput,
} from '../../shared/schemas';
import { applyPlacement, applyProps, type ApplyCtx } from '../apply';
import { iconWarnings } from '../icons';
import { Resources } from '../resources';
import { summary } from '../serialize';
import { findNode, getContainer, getSceneNode } from '../util';

// Applies every update; failures are reported per node instead of aborting
// the batch, so the agent knows exactly which ids changed.
export async function updateNodes(p: UpdateNodesInput) {
  const ctx: ApplyCtx = { res: new Resources(), defaultFont: 'Inter' };
  const updated: string[] = [];
  const failed: { id: string; error: string }[] = [];
  const touched: BaseNode[] = [];
  for (const u of p.updates) {
    try {
      const node = await getSceneNode(u.id);
      await applyProps(node, u.props, ctx, false);
      applyPlacement(node, u.props, false);
      updated.push(u.id);
      // The node may be the slot or the icon inside it: check both.
      touched.push(node);
      if (node.parent) touched.push(node.parent);
    } catch (e) {
      failed.push({ id: u.id, error: e instanceof Error ? e.message : String(e) });
    }
  }
  if (updated.length === 0 && failed.length > 0) {
    throw new Error(`No node updated. ${failed.map((f) => `${f.id}: ${f.error}`).join(' | ')}`);
  }
  const warnings = iconWarnings(touched);
  return { updated, failed, ...(warnings.length ? { warnings } : {}) };
}

export async function deleteNodes(p: DeleteNodesInput) {
  const deleted: string[] = [];
  const missing: string[] = [];
  for (const id of p.ids) {
    const node = await findNode(id).catch(() => null);
    if (!node || node.type === 'DOCUMENT' || node.type === 'PAGE') {
      missing.push(id);
      continue;
    }
    node.remove();
    deleted.push(id);
  }
  return { deleted, missing };
}

export async function moveNodes(p: MoveNodesInput) {
  const parent = p.parentId ? await getContainer(p.parentId) : null;
  const moved = [];
  let index = p.index;
  for (const id of p.ids) {
    const node = await getSceneNode(id);
    if (parent) {
      if (index !== undefined) parent.insertChild(Math.min(index++, parent.children.length), node);
      else parent.appendChild(node);
    } else if (index !== undefined && node.parent && 'insertChild' in node.parent) {
      node.parent.insertChild(Math.min(index++, node.parent.children.length - 1), node);
    }
    if (p.x !== undefined || p.y !== undefined) applyPlacement(node, { x: p.x, y: p.y }, false);
    moved.push(summary(node));
  }
  return { moved };
}

export async function cloneNode(p: CloneNodeInput) {
  const node = await getSceneNode(p.id);
  const copy = node.clone();
  const parent = p.parentId ? await getContainer(p.parentId) : null;
  if (parent) {
    if (p.index !== undefined) parent.insertChild(Math.min(p.index, parent.children.length), copy);
    else parent.appendChild(copy);
  }
  if (p.x !== undefined || p.y !== undefined) applyPlacement(copy, { x: p.x, y: p.y }, false);
  else if (!parent && copy.parent?.type === 'PAGE') copy.x = node.x + node.width + 80;
  return summary(copy);
}

export async function selectNodes(p: SelectNodesInput) {
  const nodes: SceneNode[] = [];
  for (const id of p.ids) nodes.push(await getSceneNode(id));
  const offPage = nodes.filter((n) => pageOf(n) !== figma.currentPage);
  if (offPage.length) throw new Error(`Nodes not on the current page: ${offPage.map((n) => n.id).join(', ')}. Use set_current_page.`);
  figma.currentPage.selection = nodes;
  if (p.zoom && nodes.length) figma.viewport.scrollAndZoomIntoView(nodes);
  return { selected: nodes.map((n) => n.id) };
}

function pageOf(n: BaseNode): BaseNode | null {
  let p: BaseNode | null = n;
  while (p && p.type !== 'PAGE') p = p.parent;
  return p;
}
