import { describe, expect, it } from 'vitest';
import { MASTER_PAGES, planPages, type PageRef } from '../src/shared/pageplan';

const pages = (...names: string[]): PageRef[] => names.map((name, i) => ({ id: `0:${i + 1}`, name }));

describe('manage_pages planning', () => {
  it('builds the 9-page master skeleton (file-standards §1.2)', () => {
    const plan = planPages(pages('Page 1'), { template: true });
    expect(plan.problems).toEqual([]);
    expect(plan.ops.filter((o) => o.op === 'create')).toHaveLength(MASTER_PAGES.length);
    expect(plan.ops.map((o) => (o.op === 'create' ? o.name : '')).filter(Boolean)).toEqual(MASTER_PAGES);
  });

  it('skips pages that already exist instead of duplicating them', () => {
    const plan = planPages(pages('Page 1', '🧪 Explore'), { template: true, create: ['Screens mới'] });
    const created = plan.ops.filter((o) => o.op === 'create').map((o) => (o.op === 'create' ? o.name : ''));
    expect(created).not.toContain('🧪 Explore');
    expect(created).toContain('Screens mới');
    expect(plan.skipped.some((s) => s.what.includes('🧪 Explore'))).toBe(true);
  });

  it('renames by id or by exact name and rejects collisions', () => {
    const plan = planPages(pages('Page 1', 'Draft'), {
      rename: [
        { page: '0:1', to: '📘 Cover' },
        { page: 'Draft', to: '📝 Brief' },
        { page: 'Missing', to: 'X' },
        { page: '0:2', to: '📘 Cover' },
      ],
    });
    expect(plan.ops.filter((o) => o.op === 'rename')).toHaveLength(2);
    expect(plan.problems.some((p) => p.includes('Missing'))).toBe(true);
    expect(plan.problems.some((p) => p.includes('đã bị page khác dùng'))).toBe(true);
  });

  it('never deletes the last page (Figma requires at least one)', () => {
    const single = planPages(pages('Page 1'), { delete: ['Page 1'] });
    expect(single.ops.filter((o) => o.op === 'delete')).toHaveLength(0);
    expect(single.problems.some((p) => p.includes('ít nhất 1 page'))).toBe(true);

    const two = planPages(pages('A', 'B'), { delete: ['A'] });
    expect(two.ops.filter((o) => o.op === 'delete')).toHaveLength(1);
    expect(two.problems).toEqual([]);
  });

  it('keeps one page when the caller asks to delete everything', () => {
    const plan = planPages(pages('A', 'B', 'C'), { delete: ['A', 'B', 'C'] });
    const ops = plan.ops.filter((o) => o.op === 'delete');
    expect(ops.length).toBe(2);
    expect(plan.problems.some((p) => p.includes('ít nhất 1 page'))).toBe(true);
  });

  it('orders the requested pages first and keeps the rest in relative order', () => {
    const plan = planPages(pages('A', 'B', 'C', 'D'), { order: ['C', 'A', 'Nope'] });
    const op = plan.ops.find((o) => o.op === 'order');
    expect(op).toBeDefined();
    expect(op && op.op === 'order' ? op.ids : []).toEqual(['0:3', '0:1', '0:2', '0:4']);
    expect(plan.problems.some((p) => p.includes('Nope'))).toBe(true);
  });

  it('chains template + rename + order in one plan', () => {
    const plan = planPages(pages('Page 1'), { template: true, rename: [{ page: 'Page 1', to: '🗄 Old drafts' }], order: ['📘 Cover'] });
    expect(plan.problems).toEqual([]);
    expect(plan.ops[0]).toMatchObject({ op: 'create', name: '📘 Cover' });
    expect(plan.ops.some((o) => o.op === 'rename')).toBe(true);
    expect(plan.ops.at(-1)).toMatchObject({ op: 'order' });
  });
});
