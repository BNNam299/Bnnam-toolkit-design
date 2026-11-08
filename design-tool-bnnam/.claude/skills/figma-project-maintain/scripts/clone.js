// scripts/clone.js — SAFE SCREEN CLONE. Use when: making a `_Fix AI` copy, a new screen from an existing one, a `_Variant` draft, a copy for a flow.
// Three things a bare clone() / clone_node gets wrong (lessons from the first maintenance project):
//   1. clone() of a screen with a MAIN COMPONENT inside → creates extra new main components (a real file had 19 main components sitting inside screens).
//      Here: every main component in the clone is replaced by an INSTANCE of the original main component.
//   2. Puts the clone into ITS OWN SECTION — never into the designer's source section, never enlarges the designer's section.
//   3. Checks OVERLAPS after placing: the new section must not sit on top of any top-level section / frame.
// DRY_RUN = true (default): creates nothing — reports the plan: number of main components to replace, target section, position, overlap or not.
// Run via execute_code: set CONFIG below, send the whole file as `code`; run once with DRY_RUN true, then again with false.
const CONFIG = {
  DRY_RUN: true,
  PAGE: "5. UI Design",
  SOURCE: "",                      // required — name of the source screen
  NEW_NAME: "",                    // required — e.g. "Checkout-Payment_Result_Fix AI" · "Settings_Disabled" · per ../bnnam-standards/references/naming.md
  SECTION: "",                     // required — the agent's OWN section for the new copy, e.g. "Fix AI — Checkout". Missing → created in empty space
  GAP: 80,                         // spacing between screens and between sections
  OWNER_KEY: "designtoolkit",      // sharedPluginData namespace — readable from every plugin / MCP session; keep it so sections made earlier are still recognised
  ALLOW_DESIGNER_SECTION: false,   // true ONLY when the designer says explicitly "put it in section <name>" — even then it is never enlarged
};
// ── section title frame — shared by clone · prototype · background · section. Recognised by SHAPE + POSITION, not by name:
//    direct child of the section · top-left corner (x < 300, y < 200) · short (< 200) · contains text. Names like "— Settings", "Home", "Frame 1171" all work.
const T_NUM = /^\s*(\d+(?:\.\d+)*)\s*$/;
const tTexts = n => n.type === "TEXT" ? [n] : (n.type !== "TEXT" && "findAll" in n) ? n.findAll(x => x.type === "TEXT") : [];
const tChars = t => { try { return t.characters; } catch (e) { return ""; } };
function titleOf(sec) {
  for (const k of sec.children) {
    if (k.y > 200 || k.x > 300 || k.height > 200 || (k.type === "FRAME" && k.height >= 400)) continue;
    const ts = tTexts(k); if (!ts.length) continue;
    const num = ts.map(tChars).find(c => T_NUM.test(c));
    return { node: k, number: num ? num.trim() : null };
  }
  return null;
}
const tCmp = (a, b) => { const x = a.split(".").map(Number), y = b.split(".").map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
function nextNumber(near, others) {
  const nums = others.map(titleOf).filter(t => t && t.number).map(t => t.number);
  const base = near && titleOf(near) && titleOf(near).number;
  if (base) { const kids = nums.filter(n => n.startsWith(base + ".") && n.split(".").length === base.split(".").length + 1).sort(tCmp);
    return kids.length ? kids[kids.length - 1].replace(/\d+$/, d => String(+d + 1)) : `${base}.1`; }
  return nums.length ? String(Math.max(...nums.map(n => +n.split(".")[0])) + 1) : null;
}
async function addTitle(sec, near, number) {
  const others = sec.parent.children.filter(n => n.type === "SECTION" && n.id !== sec.id);
  const src = (near && titleOf(near)) || others.map(titleOf).find(Boolean);
  if (!src) return "the file has no section title frame — left empty";
  if (number === undefined) number = nextNumber(near, others);
  const t = src.node.clone(); sec.appendChild(t); t.x = src.node.x; t.y = src.node.y;   // appendChild does not return the node — use t
  if (t.type !== "TEXT" && "resize" in t) { try { t.resize(Math.max(t.width, sec.width - t.x * 2), t.height); } catch (e) {} }
  let named = false; const fails = [];
  for (const x of tTexts(t)) { const c = tChars(x); let to = null;
    if (T_NUM.test(c)) to = number; else if (!named && c.trim()) { to = sec.name; named = true; }
    if (!to) continue;
    try { await figma.loadFontAsync(x.fontName); x.characters = to; } catch (e) { fails.push(e.message || String(e)); } }
  return `copied title frame "${src.node.name}"${number ? " · number " + number : ""}${fails.length ? " · text not changed: " + fails[0] : ""}`;
}

const need = ["SOURCE", "NEW_NAME", "SECTION"].filter(k => !CONFIG[k]);
if (need.length) return { stop: `missing ${need.join(", ")}` };
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on a TEXT node throws in real Figma — check the type first, use `in`
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();

const frames = [];
(function walk(c) { for (const k of c.children) { if (k.type === "SECTION") walk(k); else if (k.type === "FRAME") frames.push(k); } })(page);
const src = frames.find(f => f.name === CONFIG.SOURCE);
if (!src) return { stop: `screen "${CONFIG.SOURCE}" not found` };
if (frames.some(f => f.name === CONFIG.NEW_NAME)) return { stop: `frame "${CONFIG.NEW_NAME}" already exists — change NEW_NAME or delete the old copy` };

// ── absolute geometry
const abs = n => { const t = n.absoluteTransform; return { x: t ? t[0][2] : n.x, y: t ? t[1][2] : n.y, w: n.width, h: n.height }; };
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const tops = page.children.filter(n => n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP");

// ── target section
let sec = page.children.find(n => n.type === "SECTION" && n.name === CONFIG.SECTION);
const ownedByAgent = sec ? sec.getSharedPluginData(CONFIG.OWNER_KEY, "owner") === "agent" : true;
const srcSection = (() => { for (let p = src.parent; p && p.type !== "PAGE"; p = p.parent) if (p.type === "SECTION") return p; return null; })();
if (sec && !ownedByAgent && !CONFIG.ALLOW_DESIGNER_SECTION) return { stop: `"${CONFIG.SECTION}" is a designer's section — the new copy goes into the agent's OWN section, and into the original only once the designer is sure. Change SECTION to a new name` };
if (sec && srcSection && sec.id === srcSection.id) return { stop: `"${CONFIG.SECTION}" is the SOURCE section holding the source screen — the new copy must be in its own section` };

// position: existing section → right of the rightmost screen in it; none yet → a new section in empty space to the right of everything
let plan;
if (sec) {
  const kids = sec.children.filter(k => k.type === "FRAME");
  const right = kids.length ? Math.max(...kids.map(k => k.x + k.width)) : 0;
  const x = kids.length ? right + CONFIG.GAP : CONFIG.GAP, y = kids.length ? Math.min(...kids.map(k => k.y)) : CONFIG.GAP * 2;
  const needW = x + src.width + CONFIG.GAP, needH = y + src.height + CONFIG.GAP;
  const grow = needW > sec.width || needH > sec.height;
  if (grow && !ownedByAgent) return { stop: `the designer's section "${CONFIG.SECTION}" has no room — NEVER enlarge a designer's section. Use a new SECTION` };
  plan = { section: "existing" + (ownedByAgent ? " (agent-made)" : " (designer's)"), x, y, enlarge: grow ? `${Math.round(sec.width)}×${Math.round(sec.height)} → ${Math.round(Math.max(needW, sec.width))}×${Math.round(Math.max(needH, sec.height))}` : "no" };
} else {
  const box = tops.map(abs);
  const maxRight = box.length ? Math.max(...box.map(b => b.x + b.w)) : 0;
  const top = srcSection ? abs(srcSection).y : abs(src).y;
  plan = { section: "create new", sx: maxRight + CONFIG.GAP * 2, sy: top, x: CONFIG.GAP, y: CONFIG.GAP * 2 };
}

// main components sitting inside the source screen — a bare clone() would duplicate them
const innerMains = src.findAll(n => n.type === "COMPONENT" || n.type === "COMPONENT_SET").filter(n => !(n.type === "COMPONENT" && n.parent && n.parent.type === "COMPONENT_SET"));
const report = {
  mode: CONFIG.DRY_RUN ? "DRY RUN — nothing created" : "CREATED",
  source: src.name, newCopy: CONFIG.NEW_NAME, targetSection: CONFIG.SECTION, plan: plan,
  mainComponentsInScreen: innerMains.map(n => n.name),
  note: innerMains.length ? `${innerMains.length} main components sit inside the source screen — the new copy uses INSTANCES of them, no duplicates` : undefined,
};
if (CONFIG.DRY_RUN) return report;

// ── create the section if needed, with a title frame copied from an existing section
if (!sec) {
  sec = figma.createSection();
  sec.name = CONFIG.SECTION;
  page.appendChild(sec);
  sec.x = plan.sx; sec.y = plan.sy;
  sec.resizeWithoutConstraints(src.width + CONFIG.GAP * 2, src.height + CONFIG.GAP * 3);
  sec.setSharedPluginData(CONFIG.OWNER_KEY, "owner", "agent");
  report.title = await addTitle(sec, srcSection);
}

// ── clone, then replace the main components in the clone with instances of the original ones
const copy = src.clone();
copy.name = CONFIG.NEW_NAME;
sec.appendChild(copy);
copy.x = plan.x; copy.y = plan.y;
const pathOf = (n, root) => { const p = []; for (let q = n; q && q !== root; q = q.parent) p.unshift(q.parent ? q.parent.children.indexOf(q) : 0); return p.join("/"); };
const origByPath = new Map(innerMains.map(m => [pathOf(m, src), m]));
const copiedMains = copy.findAll(n => n.type === "COMPONENT" || n.type === "COMPONENT_SET").filter(n => !(n.type === "COMPONENT" && n.parent && n.parent.type === "COMPONENT_SET"));
let swapped = 0; const swapFail = [];
for (const c of copiedMains) {
  const orig = origByPath.get(pathOf(c, copy));
  try {
    const main = orig.type === "COMPONENT_SET" ? orig.defaultVariant || orig.children[0] : orig;
    const inst = main.createInstance();
    const parent = c.parent, idx = parent.children.indexOf(c);
    parent.insertChild(idx, inst);
    if (!parent.layoutMode || parent.layoutMode === "NONE") { inst.x = c.x; inst.y = c.y; }
    c.remove(); swapped++;
  } catch (e) { swapFail.push(`${c.name}: ${e.message || e}`); }
}
report.replaced = swapped; if (swapFail.length) report.replaceErrors = swapFail;

// ── enlarge the section — only a section the agent created
const kids = sec.children;
const needW = Math.max(...kids.map(k => k.x + k.width)) + CONFIG.GAP, needH = Math.max(...kids.map(k => k.y + k.height)) + CONFIG.GAP;
if (needW > sec.width || needH > sec.height) sec.resizeWithoutConstraints(Math.max(needW, sec.width), Math.max(needH, sec.height));

// ── overlap check after placing — push the agent's section right until it is clear
let moved = 0;
while (sec.getSharedPluginData(CONFIG.OWNER_KEY, "owner") === "agent" && page.children.some(n => n.id !== sec.id && (n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP") && hit(abs(sec), abs(n))) && moved < 50) { sec.x += CONFIG.GAP * 4; moved++; }
const overlaps = page.children.filter(n => n.id !== sec.id && (n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP") && hit(abs(sec), abs(n))).map(n => n.name);
report.overlaps = overlaps.length ? overlaps : "none";
if (moved) report.sectionMoved = `moved right ${moved} times to avoid overlap`;
report.id = copy.id;
return report;
