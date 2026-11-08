// scripts/flowmap.js — READ ONLY. Flow map of an existing project — so the agent INFERS the flows, then asks the designer to confirm.
// Use when: taking over a maintenance project — get the overview, know where things lead, see the gaps (references/maintain.md §6 step 2).
// File WITH prototype links → the links are the main source; layout and button text are for cross-checking.
// File WITHOUT links → infer from how screens are laid out (section, row, left → right), screen names, text on the screen (title, buttons, tabs, back).
// Run via execute_code: set CONFIG below, send the whole file as `code` (timeoutMs up to ~120000 on big files).
const CONFIG = {
  PAGES: ["5. UI Design"],         // pages holding screens — project.yaml › pages.ui (may be several pages)
  MIN_SCREEN_HEIGHT: 400,          // shorter frames are not counted as screens
  EDIT_SUFFIXES: ["Fix", "Fix AI"], // skip edited copies by the designer and by the agent
  TEMPLATE_FRAMES: [],             // skip template screens
  ROW_TOLERANCE: 200,              // screens offset vertically by less than this count as the same row
  HINTS_PER_SCREEN: 8,
  // detect the text role from the layer name / parent instance — adjust to the file's conventions
  NAV: {                        // project.yaml › textRoles — ONE shared rule set for every script (readscreen.js, textdump.js)
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
// page.findAll does NOT descend into instances — keep searching inside every instance found, nested instances included
function deepFind(root, pred) {
  const out = [], seen = new Set(), queue = [root];
  while (queue.length) {
    const r = queue.shift(); let found; try { found = r.findAll(() => true); } catch (e) { continue; }
    for (const n of found) { if (seen.has(n.id)) continue; seen.add(n.id); if (pred(n)) out.push(n); if (n.type === "INSTANCE") queue.push(n); }
  }
  return out;
}
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on a TEXT node throws in real Figma — check the type first, use `in`

const screens = new Map();         // id → { name, page, section }
const owner = new Map();           // id of any node → id of the screen containing it
for (const pn of CONFIG.PAGES) {
  const page = figma.root.children.find(p => p.name === pn);
  if (!page) continue;
  await page.loadAsync();
  (function walk(c, section) {
    for (const k of c.children) {
      if (k.type === "SECTION") { walk(k, k.name); continue; }
      if (k.type !== "FRAME" || k.height < CONFIG.MIN_SCREEN_HEIGHT) continue;
      if (CONFIG.EDIT_SUFFIXES.some(x => k.name.endsWith("_" + x)) || CONFIG.TEMPLATE_FRAMES.includes(k.name)) continue;
      screens.set(k.id, { name: k.name, page: pn, section, x: k.absoluteTransform ? k.absoluteTransform[0][2] : k.x, y: k.absoluteTransform ? k.absoluteTransform[1][2] : k.y, node: k });
      owner.set(k.id, k.id);
      for (const d of k.findAll(() => true)) owner.set(d.id, k.id);
    }
  })(page, null);
}
if (!screens.size) return { stop: "no screens found — check PAGES (../design-system-audit/scripts/detect.js)" };

// prototype links: node.reactions[].actions[] (new API) or .action (old API)
const edges = [], external = [], overlays = [];
for (const pn of CONFIG.PAGES) {
  const page = figma.root.children.find(p => p.name === pn);
  if (!page) continue;
  for (const n of deepFind(page, x => Array.isArray(x.reactions) && x.reactions.length)) {   // links inside instances count too
    const from = owner.get(n.id);
    if (!from) continue;
    for (const r of n.reactions) {
      const acts = r.actions || (r.action ? [r.action] : []);
      for (const a of acts) {
        if (!a) continue;
        if (a.type === "URL") { external.push({ from: screens.get(from).name, layer: n.name, url: a.url }); continue; }
        if (a.type === "BACK" || a.type === "CLOSE") { edges.push({ from: screens.get(from).name, layer: n.name, to: a.type === "BACK" ? "← back" : "✕ close", kind: a.type }); continue; }
        if (a.type !== "NODE" || !a.destinationId) continue;
        const toScreen = screens.get(a.destinationId) ? a.destinationId : owner.get(a.destinationId);
        const target = toScreen ? screens.get(toScreen).name : `?${a.destinationId} (outside the scanned pages)`;
        const rec = { from: screens.get(from).name, layer: n.name, to: target, kind: a.navigation || "NAVIGATE", trigger: r.trigger && r.trigger.type };
        (a.navigation === "OVERLAY" ? overlays : edges).push(rec);
      }
    }
  }
}

// ── navigation hints read from the text on each screen
const roleOf = n => { const h = []; for (let p = n; p && p.type !== "PAGE" && h.length < 5; p = p.parent) h.push(p.name); const j = h.join(" ");
  for (const [r, re] of Object.entries(CONFIG.NAV)) if (re.test(j)) return r; return null; };
const hints = new Map();
for (const [id, sc] of screens) {
  const h = { title: null, button: [], tab: [], back: false };
  const texts = sc.node.findAll(n => { try { return n.type === "TEXT" && n.visible !== false && (n.characters || "").trim().length > 1; } catch (e) { return false; } });
  for (const t of texts) {
    let c; try { c = t.characters.trim(); } catch (e) { continue; }   // text that fails to read → skip, do not crash
    const r = roleOf(t);
    if (r === "title" && !h.title) h.title = c;
    else if (r === "button" && h.button.length < CONFIG.HINTS_PER_SCREEN && !h.button.includes(c)) h.button.push(c);
    else if (r === "tab" && h.tab.length < CONFIG.HINTS_PER_SCREEN && !h.tab.includes(c)) h.tab.push(c);
  }
  if (sc.node.findOne(n => CONFIG.NAV.back.test(n.name))) h.back = true;
  hints.set(id, h);
}

// ── layout order: by section, then row (y), then left → right (x)
const groups = {};
for (const [id, sc] of screens) { const k = `${sc.page}${sc.section ? " › " + sc.section : ""}`; (groups[k] = groups[k] || []).push(id); }
const layout = {};
for (const [k, ids] of Object.entries(groups)) {
  const arr = ids.map(id => screens.get(id)).sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = [];
  for (const sc of arr) { const r = rows.find(r => Math.abs(r.y - sc.y) < CONFIG.ROW_TOLERANCE); if (r) r.items.push(sc); else rows.push({ y: sc.y, items: [sc] }); }
  layout[k] = rows.map(r => r.items.sort((a, b) => a.x - b.x).map(sc => {
    const h = hints.get(sc.node.id);
    return { screen: sc.name, ...(h.title ? { title: h.title } : {}), ...(h.button.length ? { buttons: h.button } : {}), ...(h.tab.length ? { tabs: h.tab } : {}), ...(h.back ? { hasBack: true } : {}) };
  }));
}

// the same tab bar on many screens → the tabs are the app's root flows
const tabSets = {};
for (const h of hints.values()) if (h.tab.length > 1) { const k = h.tab.join(" | "); tabSets[k] = (tabSets[k] || 0) + 1; }

// ── arrows drawn on the canvas (connector, line, vector named "arrow" / "→"), with the label nearest the arrow's middle
const arrows = [];
const box = n => { const t = n.absoluteTransform; const x = t ? t[0][2] : n.x, y = t ? t[1][2] : n.y; return { x, y, w: n.width, h: n.height }; };
const scrBoxes = [...screens.entries()].map(([id, sc]) => ({ id, name: sc.name, b: box(sc.node) }));
const nearest = (px, py) => { let best = null, d = Infinity;
  for (const s of scrBoxes) { const dx = Math.max(s.b.x - px, 0, px - (s.b.x + s.b.w)), dy = Math.max(s.b.y - py, 0, py - (s.b.y + s.b.h)); const dd = Math.hypot(dx, dy); if (dd < d) { d = dd; best = s; } }
  return d < 300 ? best : null; };
for (const pn of CONFIG.PAGES) {
  const page = figma.root.children.find(p => p.name === pn);
  if (!page) continue;
  const cands = page.findAll(n => !owner.has(n.id) && (n.type === "CONNECTOR" || ((n.type === "LINE" || n.type === "VECTOR") && /arrow|mũi tên|→|connector|flow/i.test(n.name))));
  const labels = page.findAll(n => n.type === "TEXT" && !owner.has(n.id));
  for (const a of cands) {
    const b = box(a);
    const p1 = [b.x, b.y + b.h / 2], p2 = [b.x + b.w, b.y + b.h / 2];
    const vert = b.h > b.w; if (vert) { p1[0] = p2[0] = b.x + b.w / 2; p1[1] = b.y; p2[1] = b.y + b.h; }
    const s1 = nearest(...p1), s2 = nearest(...p2);
    if (!s1 || !s2 || s1.id === s2.id) continue;
    const mx = b.x + b.w / 2, my = b.y + b.h / 2;
    const lab = labels.map(t => ({ t, d: Math.hypot(box(t).x - mx, box(t).y - my) })).sort((x, y) => x.d - y.d)[0];
    arrows.push({ from: s1.name, to: s2.name, ...(lab && lab.d < 120 ? { label: lab.t.characters.trim() } : {}), note: "direction guessed from left → right / top → bottom — verify" });
  }
}

const linked = edges.length + overlays.length;
const linkedFrom = new Set([...edges, ...overlays].map(e => e.from + "␟" + e.layer));
const missing = [];
if (linked) for (const [id, sc] of screens) {
  for (const b of sc.node.findAll(n => n.type !== "TEXT" && CONFIG.NAV.button.test(n.name) && !(Array.isArray(n.reactions) && n.reactions.length))) {
    const t = canFind(b) ? b.findOne(x => x.type === "TEXT") : null;
    if (t && !linkedFrom.has(sc.name + "␟" + b.name)) missing.push(`${sc.name} › "${t.characters.trim()}"`);
  }
}
const inDeg = new Map(), outDeg = new Map();
for (const e of [...edges, ...overlays]) {
  if (!e.to.startsWith("←") && !e.to.startsWith("✕") && !e.to.startsWith("?")) inDeg.set(e.to, (inDeg.get(e.to) || 0) + 1);
  outDeg.set(e.from, (outDeg.get(e.from) || 0) + 1);
}
const names = [...screens.values()].map(s => s.name);
return {
  screenCount: screens.size,
  layout: layout,                                                  // MAIN SOURCE — per section: the rows, each row left → right
  rootTabs: Object.entries(tabSets).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}  (${v} screens)`),
  prototype: linked ? {
    links: linked, flows: edges.slice(0, 300), overlays: overlays.slice(0, 100), externalLinks: external.slice(0, 30),
    entryPoints: names.filter(n => !inDeg.has(n) && outDeg.has(n)), deadEnds: names.filter(n => inDeg.has(n) && !outDeg.has(n)),
    unlinkedButtons: missing.slice(0, 50),                              // buttons whose text leads somewhere but have no link — missing link?
  } : "the file has no prototype links — flows inferred from layout, screen names, button / tab / title text",
  arrows: arrows.length ? arrows.slice(0, 200) : "no arrows drawn on the canvas",
  note: "these are HINTS — links or arrows or not, still read every screen in turn (../mobile-ui-master/references/reading-screens.md), retell the flows in words, the designer confirms before you write flows.md",
};
