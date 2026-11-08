// Pure page planning for `manage_pages` (figma-ui-flow Stage 1: the standard
// file skeleton). No Figma API here, so the safety rules are unit-testable.

export interface PageRef {
  id: string;
  name: string;
}

// file-standards.md §1.2 — the standard page order.
export const MASTER_PAGES = [
  '📘 Cover',
  '📝 Brief',
  '🧪 Explore',
  '🎨 Foundations',
  '🧩 Components',
  '📱 Screens',
  '▶️ Prototype',
  '✅ Ready for dev',
  '🗄 Archive',
];

export interface ManagePagesInput {
  template?: boolean;
  create?: string[];
  rename?: { page: string; to: string }[];
  delete?: string[];
  order?: string[];
}

export type PageOp =
  | { op: 'create'; name: string }
  | { op: 'rename'; id: string; from: string; to: string }
  | { op: 'delete'; id: string; name: string }
  | { op: 'order'; ids: string[] };

export interface PagePlan {
  ops: PageOp[];
  skipped: { what: string; reason: string }[];
  problems: string[];
}

const find = (pages: PageRef[], ref: string): PageRef | undefined =>
  pages.find((p) => p.id === ref) ?? pages.find((p) => p.name === ref);

// Builds the operation list. Never returns a plan that would delete every page:
// Figma requires a file to keep at least one.
export function planPages(existing: PageRef[], input: ManagePagesInput): PagePlan {
  const plan: PagePlan = { ops: [], skipped: [], problems: [] };
  let current = existing.map((p) => ({ ...p }));

  const wantsCreate = [...(input.template ? MASTER_PAGES : []), ...(input.create ?? [])];
  for (const name of wantsCreate) {
    if (current.some((p) => p.name === name)) {
      plan.skipped.push({ what: `create ${name}`, reason: 'page đã tồn tại' });
      continue;
    }
    plan.ops.push({ op: 'create', name });
    current.push({ id: `pending:${name}`, name });
  }

  for (const r of input.rename ?? []) {
    const hit = find(current, r.page);
    if (!hit) {
      plan.problems.push(`rename: không tìm thấy page "${r.page}"`);
      continue;
    }
    if (current.some((p) => p.name === r.to && p.id !== hit.id)) {
      plan.problems.push(`rename: tên "${r.to}" đã bị page khác dùng`);
      continue;
    }
    plan.ops.push({ op: 'rename', id: hit.id, from: hit.name, to: r.to });
    hit.name = r.to;
  }

  const toDelete: PageRef[] = [];
  for (const ref of input.delete ?? []) {
    const hit = find(current, ref);
    if (!hit) {
      plan.problems.push(`delete: không tìm thấy page "${ref}"`);
      continue;
    }
    toDelete.push(hit);
  }
  for (const hit of toDelete) {
    if (current.length <= 1) {
      plan.problems.push(`delete: phải giữ lại ít nhất 1 page (bỏ qua "${hit.name}")`);
      continue;
    }
    plan.ops.push({ op: 'delete', id: hit.id, name: hit.name });
    current = current.filter((p) => p.id !== hit.id);
  }

  if (input.order?.length) {
    const wanted: string[] = [];
    for (const ref of input.order) {
      const hit = find(current, ref);
      if (!hit) {
        plan.problems.push(`order: không tìm thấy page "${ref}"`);
        continue;
      }
      if (!wanted.includes(hit.id)) wanted.push(hit.id);
    }
    const rest = current.filter((p) => !wanted.includes(p.id)).map((p) => p.id);
    if (wanted.length) plan.ops.push({ op: 'order', ids: [...wanted, ...rest] });
  }

  return plan;
}
