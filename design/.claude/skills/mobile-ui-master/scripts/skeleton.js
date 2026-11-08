// scripts/skeleton.js — READ ONLY. Compares the SKELETON of a freshly built screen with a reference screen (the template screen or an approved screen of the same family).
// Does not compare content (text, colours) — only STRUCTURE: block order, node type, auto layout, sizing, instance component, background, safe area.
// Use it as a GATE before reporting a screen done. Mismatch → fix it to match, or ask if the difference is intentional.
// Run through execute_code: set CONFIG below, send the whole file as `code`.
const CONFIG = {
  PAGE: "5. UI Design",
  REFERENCE: "",                   // required — name of the reference screen (the project's template screen, or an approved screen of the same family)
  REFERENCE_PAGE: "",              // empty = same as PAGE
  TARGETS: [],                     // required — names of the screens just built
  DEPTH: 3,                        // levels to compare (the skeleton usually lives in the first 2–3 levels)
};
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;
if (!CONFIG.REFERENCE || !CONFIG.TARGETS.length) return { stopped: "REFERENCE and TARGETS are required" };
async function framesOf(pageName) {
  const p = figma.root.children.find(x => x.name === pageName); if (!p) return null; await p.loadAsync();
  const out = []; (function w(c) { for (const k of c.children) { if (k.type === "SECTION") w(k); else if (k.type === "FRAME") out.push(k); } })(p);
  return out;
}
const tFrames = await framesOf(CONFIG.PAGE), rFrames = await framesOf(CONFIG.REFERENCE_PAGE || CONFIG.PAGE);
if (!tFrames || !rFrames) return { stopped: "page not found" };
const ref = rFrames.find(f => f.name === CONFIG.REFERENCE);
if (!ref) return { stopped: `reference screen "${CONFIG.REFERENCE}" not found` };

// signature of one node — structure only
async function sig(n) {
  const s = { type: n.type };
  if (n.layoutMode && n.layoutMode !== "NONE") s.layout = n.layoutMode;
  if (n.type === "FRAME" || n.type === "INSTANCE" || n.type === "COMPONENT") {
    if (n.layoutSizingHorizontal) s.width = n.layoutSizingHorizontal;
    if (n.layoutSizingVertical) s.height = n.layoutSizingVertical;
  }
  if (n.layoutPositioning === "ABSOLUTE") s.position = "absolute";
  if (n.type === "INSTANCE") { try { const m = await n.getMainComponentAsync(); s.component = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : "LINK LOST"; } catch (e) { s.component = "?"; } }
  return s;
}
async function tree(n, d) {
  const node = { name: n.name, ...(await sig(n)) };
  if (d < CONFIG.DEPTH && n.type !== "INSTANCE" && canFind(n) && n.children) { node.children = []; for (const c of n.children) if (c.visible !== false) node.children.push(await tree(c, d + 1)); }
  return node;
}
const key = s => s.type === "INSTANCE" ? `INSTANCE:${s.component}` : `${s.type}:${s.layout || "-"}`;
// compare two child lists: match by order + structural key (not by name — the new screen may use different names)
function diff(a, b, path, out) {
  const rootA = { ...a }, rootB = { ...b };
  for (const k of ["type", "layout", "width", "height", "position", "component"]) if ((rootA[k] || null) !== (rootB[k] || null)) out.push({ at: path || "(screen root)", differs: k, reference: rootA[k] || "—", new: rootB[k] || "—" });
  const A = a.children || [], B = b.children || [];
  if (!A.length && !B.length) return;
  const ka = A.map(key), kb = B.map(key);
  const sm = []; let j = 0;
  for (let i = 0; i < A.length; i++) {
    const at = kb.indexOf(ka[i], j);
    if (at < 0) { out.push({ at: path, missing: `${A[i].name} (${ka[i]})`, indexInReference: i }); continue; }
    for (let x = j; x < at; x++) out.push({ at: path, extra: `${B[x].name} (${kb[x]})`, index: x });
    sm.push([A[i], B[at]]); j = at + 1;
  }
  for (let x = j; x < B.length; x++) out.push({ at: path, extra: `${B[x].name} (${kb[x]})`, index: x });
  for (const [x, y] of sm) diff(x, y, `${path ? path + " › " : ""}${y.name}`, out);
}
const R = await tree(ref, 0);
const out = { reference: ref.name, screens: [] };
for (const name of CONFIG.TARGETS) {
  const t = tFrames.find(f => f.name === name);
  if (!t) { out.screens.push({ screen: name, error: "not found" }); continue; }
  const T = await tree(t, 0), d = []; diff(R, T, "", d);
  // two mandatory structural points of the standard — reported separately
  const first = (T.children || [])[0];
  const notes = [];
  if ((R.children || [])[0] && /^INSTANCE:background/i.test(key(R.children[0])) && !(first && /^INSTANCE:background/i.test(key(first)))) notes.push("reference has a background instance as the bottom-most layer — the new screen does not");
  if (JSON.stringify(R).match(/"component":"[^"]*safe[ _-]?area/i) && !JSON.stringify(T).match(/"component":"[^"]*safe[ _-]?area/i)) notes.push("reference uses a safe area component — the new screen does not");
  out.screens.push({ screen: name, matches: d.length === 0 && !notes.length, differenceCount: d.length, differences: d.slice(0, 40), ...(notes.length ? { required: notes } : {}) });
}
out.note = "difference = the new screen's structure differs from the reference. Fix it to match; an intentional difference (the screen has its own block) → tell the designer explicitly, never silently";
return out;
