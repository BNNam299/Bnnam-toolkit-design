// figma-ui-flow Stage 8 — Dev Mode annotations, Ready-for-dev status and
// asset export (handoff-qa.md §4).
import type { AnnotateInput, ExportAssetsInput, SetDevStatusInput } from '../../shared/schemas';
import { getSceneNode } from '../util';

const ANNOTATION_PROPS: readonly AnnotationPropertyType[] = ['width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight', 'fills', 'strokes', 'effects', 'strokeWeight', 'cornerRadius', 'textStyleId', 'textAlignHorizontal', 'fontFamily', 'fontStyle', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'itemSpacing', 'padding', 'layoutMode', 'alignItems', 'opacity', 'mainComponent', 'gridRowGap', 'gridColumnGap', 'gridRowCount', 'gridColumnCount', 'gridRowAnchorIndex', 'gridColumnAnchorIndex', 'gridRowSpan', 'gridColumnSpan'];

export async function annotate(p: AnnotateInput) {
  const categories = p.items.some((i) => i.category) ? await figma.annotations.getAnnotationCategoriesAsync() : [];
  const done: { id: string; annotations: number }[] = [];
  for (const item of p.items) {
    const node = await getSceneNode(item.id);
    if (!('annotations' in node)) throw new Error(`${node.type} ${node.id} không nhận annotation`);
    let categoryId: string | undefined;
    if (item.category) {
      const c = categories.find((x) => x.label.toLowerCase() === item.category!.toLowerCase());
      if (!c) throw new Error(`Không có annotation category "${item.category}". Có: ${categories.map((x) => x.label).join(', ') || '(none)'}.`);
      categoryId = c.id;
    }
    for (const prop of item.properties ?? []) {
      if (!(ANNOTATION_PROPS as readonly string[]).includes(prop)) {
        throw new Error(`Annotation property "${prop}" không hợp lệ. Dùng: ${ANNOTATION_PROPS.join(', ')}.`);
      }
    }
    const annotation: Annotation = {
      labelMarkdown: item.label,
      ...(item.properties?.length ? { properties: item.properties.map((type) => ({ type: type as AnnotationPropertyType })) } : {}),
      ...(categoryId ? { categoryId } : {}),
    };
    const next = p.replace ? [annotation] : [...node.annotations, annotation];
    node.annotations = next;
    done.push({ id: node.id, annotations: next.length });
  }
  return { updated: done };
}

export async function setDevStatus(p: SetDevStatusInput) {
  const done: string[] = [];
  const failed: { id: string; error: string }[] = [];
  for (const id of p.ids) {
    try {
      const node = await getSceneNode(id);
      if (!('devStatus' in node)) throw new Error(`${node.type} không có devStatus`);
      if (node.parent?.type !== 'PAGE' && node.parent?.type !== 'SECTION') {
        throw new Error('chỉ đặt được cho node nằm trực tiếp trên page hoặc trong section');
      }
      node.devStatus = p.status === 'NONE' ? null : { type: p.status, ...(p.description ? { description: p.description } : {}) };
      done.push(id);
    } catch (e) {
      failed.push({ id, error: e instanceof Error ? e.message : String(e) });
    }
  }
  if (!done.length && failed.length) throw new Error(failed.map((f) => `${f.id}: ${f.error}`).join(' | '));
  return { updated: done, failed };
}

// Bytes go back to the server, which writes the files (the plugin has no disk).
export async function exportAssets(p: ExportAssetsInput) {
  const files: { id: string; name: string; scale?: number; format: string; base64: string }[] = [];
  for (const id of p.ids) {
    const node = await getSceneNode(id);
    if (p.format === 'SVG' || p.format === 'PDF') {
      const bytes = await node.exportAsync({ format: p.format });
      files.push({ id, name: node.name, format: p.format, base64: figma.base64Encode(bytes) });
      continue;
    }
    for (const scale of p.scales) {
      const bytes = await node.exportAsync({ format: p.format, constraint: { type: 'SCALE', value: scale } });
      files.push({ id, name: node.name, scale, format: p.format, base64: figma.base64Encode(bytes) });
    }
  }
  return { files };
}
