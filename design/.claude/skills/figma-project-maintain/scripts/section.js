// scripts/section.js — THE AGENT'S OWN SECTION WITH A TITLE FRAME.
//   creates a new section in empty space (or next to the source section NEAR) · copies the file's title frame (number "x.y" + name) · checks overlaps.
// The title frame is recognised by SHAPE + POSITION, not only by name: a direct child of the section, at the top left, short (< 200),
// containing a number such as "3" / "3.2" / "3.2.1". Files without the "— " prefix are recognised too.
// DRY_RUN = true (default): reports the plan.
// Run via execute_code: set CONFIG below, send the whole file as `code`; run once with DRY_RUN true, then again with false.
const CONFIG = {
  DRY_RUN: true,
  PAGE: "5. UI Design",
  NAME: "",                        // required — section name, e.g. "Hard mode — Fix AI"
  NEAR: "",                        // optional — name or id of the source section to sit next to (to the right, same row); empty = the agent's latest section, or empty space right of everything
  NUMBER: "auto",                  // "auto" = next number after section NEAR (3.2 → 3.2.1) or after the largest number · or a string "3.4"
  SIZE: { w: 1200, h: 1100 },      // starting size — other scripts (clone, prototype, background) enlarge the agent's section when placing screens
  GAP: 120, OWNER_KEY: "designtoolkit",
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
  t.name = (/^—\s/.test(src.node.name) ? "— " : "") + sec.name;   // layer name follows the new section — otherwise the copy keeps the old name
  if (t.type !== "TEXT" && "resize" in t) { try { t.resize(Math.max(t.width, sec.width - t.x * 2), t.height); } catch (e) {} }
  let named = false; const fails = [];
  for (const x of tTexts(t)) { const c = tChars(x); let to = null;
    if (T_NUM.test(c)) to = number; else if (!named && c.trim()) { to = sec.name; named = true; }
    if (!to) continue;
    try { await figma.loadFontAsync(x.fontName); x.characters = to; } catch (e) { fails.push(e.message || String(e)); } }
  return `copied title frame "${src.node.name}"${number ? " · number " + number : ""}${fails.length ? " · text not changed: " + fails[0] : ""}`;
}
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on a TEXT node throws — check the type first
if (!CONFIG.NAME) return { stop: "NAME is empty" };
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();
if (page.children.some(n => n.type === "SECTION" && n.name === CONFIG.NAME)) return { stop: `section "${CONFIG.NAME}" already exists` };

const sections = page.children.filter(n => n.type === "SECTION");
const titled = sections.map(s => ({ s, t: titleOf(s) })).filter(x => x.t);
// NEAR empty → the agent's most recent section (the last child on the page with owner = agent) — so new sections do not land at random
const mineSecs = sections.filter(s => s.getSharedPluginData && s.getSharedPluginData(CONFIG.OWNER_KEY, "owner") === "agent");
// NEAR accepts a section name or id
const near = CONFIG.NEAR ? sections.find(s => s.name === CONFIG.NEAR || s.id === CONFIG.NEAR) : (mineSecs.length ? mineSecs[mineSecs.length - 1] : null);
if (CONFIG.NEAR && !near) return { stop: `section "${CONFIG.NEAR}" not found` };

let number = CONFIG.NUMBER === "auto" ? nextNumber(near, sections) : CONFIG.NUMBER;

// position: next to NEAR (to the right, same row) or right of everything — then move until nothing overlaps
const abs = n => { const t = n.absoluteTransform; return { x: t ? t[0][2] : n.x, y: t ? t[1][2] : n.y, w: n.width, h: n.height }; };
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
// every top-level layer of the page (images, shapes, text, components…) — checking only sections / frames / groups let a new section land on a source image (RECTANGLE)
const tops = page.children.filter(n => n.visible !== false && n.width > 0 && n.height > 0);
let box = near ? { x: abs(near).x + near.width + CONFIG.GAP, y: abs(near).y, w: CONFIG.SIZE.w, h: CONFIG.SIZE.h }
               : { x: (tops.length ? Math.max(...tops.map(n => abs(n).x + n.width)) : 0) + CONFIG.GAP * 2, y: tops.length ? Math.min(...tops.map(n => abs(n).y)) : 0, w: CONFIG.SIZE.w, h: CONFIG.SIZE.h };
let moved = 0; while (tops.some(n => hit(box, abs(n))) && moved < 80) { box.x += CONFIG.GAP * 4; moved++; }
const titleSrc = (near && titleOf(near)) || (titled[0] && titled[0].t) || null;
const report = { mode: CONFIG.DRY_RUN ? "DRY RUN — nothing created" : "CREATED", section: CONFIG.NAME, number: number || "the file does not number sections",
  position: `x ${Math.round(box.x)} · y ${Math.round(box.y)}${moved ? ` (moved ${moved} times to avoid overlap)` : ""}`,
  titleFrame: titleSrc ? `copied from "${titleSrc.node.name}"${titleSrc.number ? ` (number ${titleSrc.number})` : ""}` : "the file has no section title frame — left empty" };
if (CONFIG.DRY_RUN) return report;

const sec = figma.createSection(); sec.name = CONFIG.NAME; page.appendChild(sec);
sec.x = box.x; sec.y = box.y; sec.resizeWithoutConstraints(box.w, box.h);
sec.setSharedPluginData(CONFIG.OWNER_KEY, "owner", "agent");
if (titleSrc) report.titleFrame = await addTitle(sec, near || titleSrc && sections.find(x => titleOf(x) && titleOf(x).node === titleSrc.node), number);
report.id = sec.id;
return report;
