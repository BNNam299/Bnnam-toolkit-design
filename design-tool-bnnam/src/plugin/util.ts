export class RolledBackError extends Error {}

export async function findNode(id: string): Promise<BaseNode | null> {
  try {
    return await figma.getNodeByIdAsync(id);
  } catch (e) {
    throw new Error(
      `${id} is not a layer id in this file (${e instanceof Error ? e.message : String(e)}). Node ids are per file: read them from this file.`,
    );
  }
}

export async function getNode(id: string): Promise<BaseNode> {
  const node = await findNode(id);
  if (!node) throw new Error(`Node ${id} not found (deleted, or on a page that is not loaded).`);
  return node;
}

export async function getSceneNode(id: string): Promise<SceneNode> {
  const node = await getNode(id);
  if (node.type === 'DOCUMENT' || node.type === 'PAGE') throw new Error(`Node ${id} is a ${node.type}, not a layer.`);
  return node as SceneNode;
}

export async function getContainer(id: string): Promise<BaseNode & ChildrenMixin> {
  const node = await getNode(id);
  if (!('appendChild' in node)) throw new Error(`Node ${id} (${node.type}) cannot have children.`);
  return node as BaseNode & ChildrenMixin;
}

export function isAutoLayout(node: BaseNode | null): node is FrameNode | ComponentNode | InstanceNode | ComponentSetNode {
  return !!node && 'layoutMode' in node && node.layoutMode !== 'NONE';
}

export function freeSpot(siblings: readonly SceneNode[], gap = 120): { x: number; y: number } {
  let maxX = -Infinity;
  let minY = Infinity;
  for (const child of siblings) {
    maxX = Math.max(maxX, child.x + child.width);
    minY = Math.min(minY, child.y);
  }
  if (maxX === -Infinity) return { x: 0, y: 0 };
  return { x: Math.round(maxX + gap), y: Math.round(minY) };
}

export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export const round2 = (v: number) => Math.round(v * 100) / 100;
