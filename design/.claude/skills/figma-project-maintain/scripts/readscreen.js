// scripts/readscreen.js — READ ONLY. Outline of every screen, read in order: section → row → left to right.
// Use together with the screen IMAGE (../mobile-ui-master/references/reading-screens.md): the image to see, the outline to miss nothing — text, buttons, inputs, images, repeated lists, states.
// Run via execute_code: set CONFIG below, send the whole file as `code` (timeoutMs up to ~120000 on big pages).
const CONFIG = {
  PAGE: "5. UI Design",
  SECTION: null,                   // name of the section to read · null = every section on the page
  SCREEN_NAMES: [],                // optional: read only these screens
  MIN_SCREEN_HEIGHT: 400,
  ROW_TOLERANCE: 200,
  SKIP_SUFFIXES: ["Fix", "Fix AI"],// edited copies are read separately when needed — set [] to read them too
  MAX_TEXT_PER_BLOCK: 12,
  ROLES: {                        // project.yaml › textRoles — ONE shared rule set for every script (textdump.js, flowmap.js)
    title:     /title|heading|headline|nav ?bar|header|display|tiêu đề/i,   // Vietnamese alternatives match Vietnamese layer names
    subtitle:  /subtitle|caption|sub|mô tả ngắn/i,
    button:    /button|btn|cta|nút|link/i,
    tab:       /tab ?bar|tab|bottom ?nav|segment/i,
    input:     /input|field|textfield|search|placeholder|ô nhập/i,
    selection: /toggle|switch|checkbox|radio|chip|select/i,
    back:      /back|chevron.?left|arrow.?left|close|quay lại|đóng/i,
    error:     /error|warning|alert|lỗi|cảnh báo/i,
    notice:    /toast|snackbar|banner|notification|dialog|modal|popup/i,
    label:     /label|chip|badge|tag|nhãn/i,
  },
};
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on a TEXT node throws in real Figma — check the type first, use `in`

const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();

const list = [];
(function walk(c, section) {
  for (const k of c.children) {
    if (k.type === "SECTION") { if (!CONFIG.SECTION || k.name === CONFIG.SECTION) walk(k, k.name); continue; }
    if (k.type !== "FRAME" || k.height < CONFIG.MIN_SCREEN_HEIGHT) continue;
    if (CONFIG.SECTION && section !== CONFIG.SECTION) continue;
    if (CONFIG.SKIP_SUFFIXES.some(x => k.name.endsWith("_" + x))) continue;
    if (CONFIG.SCREEN_NAMES.length && !CONFIG.SCREEN_NAMES.includes(k.name)) continue;
    list.push({ k, section, x: k.absoluteTransform ? k.absoluteTransform[0][2] : k.x, y: k.absoluteTransform ? k.absoluteTransform[1][2] : k.y });
  }
})(page, null);
if (!list.length) return { stop: "no screens found — check PAGE / SECTION / SCREEN_NAMES" };

// reading order: section → row → left to right
const order = [];
const bySec = new Map(); for (const s of list) { if (!bySec.has(s.section)) bySec.set(s.section, []); bySec.get(s.section).push(s); }
for (const [, arr] of bySec) {
  arr.sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = []; for (const s of arr) { const r = rows.find(r => Math.abs(r.y - s.y) < CONFIG.ROW_TOLERANCE); r ? r.items.push(s) : rows.push({ y: s.y, items: [s] }); }
  rows.forEach(r => r.items.sort((a, b) => a.x - b.x).forEach(s => order.push(s)));
}

const roleOf = n => { const h = []; for (let p = n; p && h.length < 4; p = p.parent) { if (p.type === "FRAME" && p.height >= CONFIG.MIN_SCREEN_HEIGHT) break; h.push(p.name); }
  const j = h.join(" "); for (const [r, re] of Object.entries(CONFIG.ROLES)) if (re.test(j)) return r; return null; };
const hasImage = n => Array.isArray(n.fills) && n.fills.some(f => f.type === "IMAGE" && f.visible !== false);

async function outline(screen) {
  const H = screen.height;
  const blocks = [...screen.children].filter(c => c.visible !== false).sort((a, b) => a.y - b.y);
  const res = [];
  for (const b of blocks) {
    try {                                                           // one failing block does not bring down the whole screen
    const where = b.y < 1 ? "top" : b.y + b.height > H - 1 ? "bottom" : "middle";
    const o = { block: b.name, position: where, height: Math.round(b.height) };
    if (b.layoutMode && b.layoutMode !== "NONE") {                 // padding, spacing — so a new screen reuses the numbers of its sibling screens
      const v = k => (typeof b[k] === "number" ? Math.round(b[k]) : "?") + (b.boundVariables && b.boundVariables[k] ? "◆" : "");
      o.padding = `${v("paddingTop")} ${v("paddingRight")} ${v("paddingBottom")} ${v("paddingLeft")} · gap ${v("itemSpacing")}`;   // ◆ = bound to a variable
    }
    if (b.layoutPositioning === "ABSOLUTE" || (b.width < screen.width - 1 && where === "middle" && b.height > H * 0.5)) o.note = "may be an overlay / sheet";
    const all = canFind(b) ? [b, ...b.findAll(() => true)] : [b];   // text blocks, vectors: no findAll
    const text = [], actions = [], inputs = [], choices = []; let images = 0;
    const repeated = new Map();
    for (const n of all) {
      if (hasImage(n) || /^image_/i.test(n.name)) images++;
      if (n.type === "INSTANCE") { const m = await n.getMainComponentAsync(); const k = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : n.name; repeated.set(k, (repeated.get(k) || 0) + 1); }
      if (n.type !== "TEXT" || n.visible === false) continue;
      const c = typeof n.characters === "string" ? n.characters.trim() : ""; if (!c || c.length === 1) continue;
      const r = roleOf(n);
      if (r === "button" || r === "tab" || r === "back") actions.push(`${r === "tab" ? "tab" : "button"}: ${c}`);
      else if (r === "input") inputs.push(c);
      else if (r === "selection") choices.push(c);
      else { const v = r === "title" ? `【${c}】` : c; if (text.length < CONFIG.MAX_TEXT_PER_BLOCK && !text.includes(v)) text.push(v); }   // merge repeated text in lists
    }
    if (all.some(n => n !== b && CONFIG.ROLES.back.test(n.name))) actions.unshift("back / close");
    if (text.length) o.text = text;
    if (actions.length) o.actions = [...new Set(actions)];
    if (inputs.length) o.inputs = inputs;
    if (choices.length) o.choices = choices;
    if (images) o.images = images;
    const rep = [...repeated.entries()].filter(([, v]) => v >= 3).map(([k, v]) => `${k} ×${v}`);
    if (rep.length) o.repeatedList = rep;                        // ≥ 3 instances of the same kind — a list / grid
    res.push(o);
    } catch (e) { res.push({ block: b.name, type: b.type, readError: String(e && e.message || e) }); }   // send verbatim to whoever maintains the script
  }
  return res;
}

const out = { page: page.name, readingOrder: order.map(s => `${s.section || "(outside any section)"} › ${s.k.name}`), screens: [] };
for (const s of order) out.screens.push({ screen: s.k.name, section: s.section, size: `${Math.round(s.k.width)}×${Math.round(s.k.height)}`, outline: await outline(s.k) });
out.note = "the outline does NOT replace the image — look at each screen's image, read it per reading-screens.md, record purpose and paths in flows.md";
return out;
