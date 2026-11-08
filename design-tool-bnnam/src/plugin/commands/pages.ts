// figma-ui-flow Stage 1 — the standard page skeleton and page maintenance.
// Safety rules (never delete the last page, reject name collisions, unknown
// refs) live in ../../shared/pageplan.ts and are unit-tested there.
import type { ManagePagesInput } from '../../shared/schemas';
import { planPages, type PageRef } from '../../shared/pageplan';

export async function managePages(p: ManagePagesInput) {
  const existing: PageRef[] = figma.root.children.map((x) => ({ id: x.id, name: x.name }));
  const plan = planPages(existing, p);
  if (p.dryRun) return { dryRun: true, ops: plan.ops, skipped: plan.skipped, problems: plan.problems };

  const created: { id: string; name: string }[] = [];
  const renamed: { id: string; name: string }[] = [];
  const deleted: { id: string; name: string }[] = [];

  for (const op of plan.ops) {
    if (op.op === 'create') {
      const page = figma.createPage();
      page.name = op.name;
      created.push({ id: page.id, name: page.name });
    } else if (op.op === 'rename') {
      const page = await figma.getNodeByIdAsync(op.id);
      if (page && page.type === 'PAGE') {
        page.name = op.to;
        renamed.push({ id: page.id, name: op.to });
      }
    } else if (op.op === 'delete') {
      const page = await figma.getNodeByIdAsync(op.id);
      if (page && page.type === 'PAGE') {
        // Never leave the file without a current page.
        if (figma.currentPage.id === page.id) {
          const next = figma.root.children.find((x) => x.id !== page.id);
          if (next) await figma.setCurrentPageAsync(next);
        }
        const name = page.name;
        page.remove();
        deleted.push({ id: op.id, name });
      }
    } else if (op.op === 'order') {
      op.ids.forEach((id, index) => {
        const page = figma.root.children.find((x) => x.id === id);
        if (page) figma.root.insertChild(index, page);
      });
    }
  }

  return {
    created,
    renamed,
    deleted,
    pages: figma.root.children.map((x) => ({ id: x.id, name: x.name })),
    skipped: plan.skipped,
    problems: plan.problems,
  };
}
