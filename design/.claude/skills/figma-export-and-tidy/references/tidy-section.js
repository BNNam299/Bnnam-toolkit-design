// Body for figma-agent `execute_code`. Set SECTION_ID (and sizes/steps) before running.
// 1) Evens out the grid of same-size frames (keeps each item's row/column).
// 2) Reorders the Layers panel to canvas reading order (top→bottom, left→right).
const SECTION_ID = "17094:35760";
const ITEM_W = 312, ITEM_H = 120;          // size of the repeated frames to align
const COL = ITEM_W + 40, ROW = ITEM_H + 30; // column / row step
const X0 = 100;                            // x of the first column inside the section

const s = await figma.getNodeByIdAsync(SECTION_ID);
const items = s.children.filter(c =>
  c.type === "FRAME" && Math.round(c.width) === ITEM_W && Math.round(c.height) === ITEM_H);

const rows = [];
for (const b of [...items].sort((a, b) => a.y - b.y)) {
  const r = rows.find(r => Math.abs(r.y0 - b.y) < 40);
  if (r) r.items.push(b); else rows.push({ y0: b.y, items: [b] });
}
const groups = [];
for (const r of rows) {
  const g = groups[groups.length - 1];
  if (g && r.y0 - g.rows[g.rows.length - 1].y0 < 200) g.rows.push(r); else groups.push({ rows: [r] });
}
const log = [];
for (const g of groups) {
  const top = Math.round(g.rows[0].y0);
  const xs = [];
  for (const r of g.rows) for (const b of r.items) if (!xs.some(x => Math.abs(x - b.x) < 60)) xs.push(b.x);
  xs.sort((a, b) => a - b);
  g.rows.forEach((r, ri) => {
    for (const b of r.items) {
      const ci = xs.findIndex(x => Math.abs(x - b.x) < 60);
      b.x = X0 + ci * COL;
      b.y = top + ri * ROW;
    }
  });
  log.push({ top, rows: g.rows.length, cols: xs.length });
}

const all = [...s.children].sort((a, b) => (Math.abs(a.y - b.y) < 40 ? a.x - b.x : a.y - b.y));
for (const n of all) s.insertChild(0, n); // first in reading order ends on top of the panel

return {
  log,
  order: [...s.children].reverse().map(c => `${c.name}@${Math.round(c.x)},${Math.round(c.y)}`),
};
