// scripts/compare.js — READ ONLY. Compares the copy the designer edited with the original the agent built, both side by side in Figma.
// The designer's way: duplicate the screen right next to it → rename the copy "<screen name>_Fix" → edit → tell the agent.
// After locking, the designer deletes the old copy and drops the suffix. No snapshot is stored — only the differences are returned. references/learn.md.
// Run via execute_code: set CONFIG below, send the whole file as `code`.
//
// Pairing: frame "<name>" and frame "<name>_Fix" on the same page (project.yaml › collab.editSuffix). The designer named them differently → fill PAIRS.
const CONFIG = {
  PAGE: "5. UI Design",            // project.yaml › pages.ui or pages.wireframe
  SCREEN_NAMES: [],                // empty = every same-name pair on the page
  EDIT_SUFFIX: "Fix",              // project.yaml › collab.editSuffix — the DESIGNER's copy "<screen name>_Fix". The agent's "_Fix AI" copy is not compared here
  PAIRS: [],                       // optional: [{ original: "<id>", edited: "<id>" }] when the designer points them out
  MAX_CHANGES_PER_SCREEN: 200,
};

const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found — detect again with ../design-system-audit/scripts/detect.js` };
await page.loadAsync();

// ── find the pairs
const frames = [];
(function walk(c) { for (const k of c.children) { if (k.type === "SECTION") walk(k); else if (k.type === "FRAME") frames.push(k); } })(page);
const pairs = [];
if (CONFIG.PAIRS.length) {
  for (const p of CONFIG.PAIRS) {
    const o = frames.find(f => f.id === p.original), e = frames.find(f => f.id === p.edited);
    if (o && e) pairs.push({ name: o.name, o, e, how: "pointed out by the designer" });
  }
} else {
  const suf = "_" + CONFIG.EDIT_SUFFIX;
  const byName = new Map();
  for (const f of frames) { if (!byName.has(f.name)) byName.set(f.name, []); byName.get(f.name).push(f); }
  for (const f of frames) {
    if (!f.name.endsWith(suf)) continue;
    const base = f.name.slice(0, -suf.length);
    if (CONFIG.SCREEN_NAMES.length && !CONFIG.SCREEN_NAMES.includes(base)) continue;
    const orig = byName.get(base) || [];
    if (!orig.length) { pairs.push({ name: base, o: null, e: f, how: "original not found" }); continue; }
    pairs.push({ name: base, o: orig[0], e: f, how: `suffix "${CONFIG.EDIT_SUFFIX}"`, ...(orig.length > 1 ? { extra: orig.length - 1 } : {}) });
  }
}
if (!pairs.length) return { noPairs: true, hint: `no screen named "<screen name>_${CONFIG.EDIT_SUFFIX}" yet — the designer duplicates the screen to edit and adds the suffix "_${CONFIG.EDIT_SUFFIX}"` };

// ── read the properties to compare
const varName = new Map(), styleName = new Map();
const vName = async id => { if (!varName.has(id)) { const v = await figma.variables.getVariableByIdAsync(id); varName.set(id, v ? v.name : `?${id}`); } return varName.get(id); };
const sName = async id => { if (!id) return null; if (id === figma.mixed) return "MIXED"; if (!styleName.has(id)) { const s = await figma.getStyleByIdAsync(id); styleName.set(id, s ? s.name : `?${id}`); } return styleName.get(id); };
const hex = c => "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const r1 = x => (typeof x === "number" ? Math.round(x * 10) / 10 : x === figma.mixed ? "MIXED" : x);
async function paint(list) {
  if (!Array.isArray(list)) return list === figma.mixed ? "MIXED" : null;
  const p = list.find(f => f.visible !== false);
  if (!p) return null;
  if (p.type !== "SOLID") return p.type;
  const b = p.boundVariables && p.boundVariables.color;
  return b ? `var:${await vName(b.id)}` : hex(p.color);
}
const bound = async (n, f) => { const b = n.boundVariables && n.boundVariables[f]; return b && b.id ? `var:${await vName(b.id)}` : undefined; };
async function props(n, isRoot) {
  const s = { t: n.type };
  if (!isRoot) Object.assign(s, { x: r1(n.x), y: r1(n.y) });
  Object.assign(s, { w: r1(n.width), h: r1(n.height) });
  if (n.visible === false) s.hidden = true;
  if (typeof n.opacity === "number" && n.opacity < 1) s.op = r1(n.opacity);
  if ("fills" in n) s.fill = await paint(n.fills);
  if ("strokes" in n && n.strokes && n.strokes.length) { s.stroke = await paint(n.strokes); s.sw = r1(n.strokeWeight); }
  if ("cornerRadius" in n && n.cornerRadius) s.r = (await bound(n, "topLeftRadius")) || r1(n.cornerRadius);
  if (n.layoutMode && n.layoutMode !== "NONE") {
    s.lm = n.layoutMode; s.pad = [];
    for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) s.pad.push((await bound(n, k)) || r1(n[k] || 0));
    s.gap = (await bound(n, "itemSpacing")) || r1(n.itemSpacing || 0);
  } else if (n.layoutMode === "NONE" && isRoot) s.lm = "NONE";
  if (n.type === "TEXT") { s.ch = n.characters; s.ts = await sName(n.textStyleId); if (!s.ts) { s.fs = r1(n.fontSize); s.fw = n.fontName === figma.mixed ? "MIXED" : n.fontName && n.fontName.style; } }
  if (n.type === "INSTANCE") { const m = await n.getMainComponentAsync(); s.mc = m ? m.name : null; }
  return s;
}
// match layers by name path + order within the parent (a duplicate has new ids, so ids cannot be matched)
function index(root) {
  const m = new Map();
  (function walk(n, path) {
    m.set(path, n);
    if (n.type === "INSTANCE" || !n.children) return;               // the inside of an instance belongs to the component — not compared layer by layer
    const seen = {};
    for (const c of n.children) { const k = c.name; seen[k] = (seen[k] || 0) + 1; walk(c, `${path}/${k}${seen[k] > 1 ? `#${seen[k]}` : ""}`); }
  })(root, "");
  return m;
}
const GROUP = { x: "position", y: "position", w: "size", h: "size", lm: "layout", pad: "spacing", gap: "spacing",
  r: "corner radius", fill: "colour", stroke: "stroke", sw: "stroke", op: "opacity", hidden: "hidden / shown", ch: "copy", ts: "text style", fs: "text style",
  fw: "text style", mc: "component", t: "layer type" };

const out = { page: page.name, pairs: [] };
for (const { name, o, e, how, extra } of pairs) {
  if (!o) { out.pairs.push({ screen: name, editedCopy: e.id, error: `"${e.name}" exists but the original "${name}" was not found — the original was renamed, or the old copy was already deleted` }); continue; }
  const A = index(o), B = index(e), changes = [], byGroup = {}, editedIds = [];
  const push = (g, c) => { byGroup[g] = (byGroup[g] || 0) + 1; if (changes.length < CONFIG.MAX_CHANGES_PER_SCREEN) changes.push({ group: g, ...c }); };
  for (const [path, a] of A) {
    const b = B.get(path);
    if (!b) { push("removed", { layer: path || name, type: a.type }); continue; }
    const pa = await props(a, a === o), pb = await props(b, b === e);
    let touched = false;
    for (const k of new Set([...Object.keys(pa), ...Object.keys(pb)])) {
      if (JSON.stringify(pa[k]) !== JSON.stringify(pb[k])) { push(GROUP[k] || k, { layer: path || name, field: k, before: pa[k] ?? null, after: pb[k] ?? null }); touched = true; }
    }
    if (touched) editedIds.push(b.id);
  }
  for (const [path, b] of B) if (!A.has(path)) { push("added", { layer: path, type: b.type }); editedIds.push(b.id); }
  out.pairs.push({ screen: name, original: o.id, editedCopy: e.id, pairedBy: how, ...(extra ? { warning: `${extra + 1} original screens named "${name}" — compared with the first one` } : {}),
    changeCount: Object.values(byGroup).reduce((s, v) => s + v, 0), byGroup: byGroup, details: changes, editedIds: editedIds });
}
return out;
