// background.js — BACKGROUND FROM SHAPES + BLUR (screen-background skill · references/technique.md).
// Run through execute_code{code: <this whole file>, timeoutMs}. Set CONFIG first.
// A background is a separate component, THE SAME SIZE AS THE FRAME IT BACKS (screen, card, Live Activity…); the frame uses it as an INSTANCE on the BOTTOM LAYER.
// The top overlay is the same size as that frame, constraints on all 4 edges. Changing the background = add a variant / edit the main component.
//   MODE "explore"   build the blur methods side by side, same shape layout, in the agent's OWN section — for the designer to choose
//   MODE "component" turn the chosen version into component Background/<name> · or add it as a VARIANT — on a COPY of the existing background
//                    component set, placed in the agent's own section; the main component is NOT touched (the designer confirms first)
//   MODE "merge"     designer has confirmed → move the new variant from the copy into the main component set, delete the copy (DESIGNER_CONFIRMED = true)
//   MODE "apply"     place a background instance as the bottom layer of frames (screen, card, Live Activity — new frames, "_Fix AI" copies; never the source screens of a maintenance project)
// Surfaces that cannot blur (Live Activity, Dynamic Island, widget): METHODS ["skeleton"], shapes [] → one solid color.
// DRY_RUN = true (default): reports the plan, creates nothing.
const CONFIG = {
  MODE: "explore",
  DRY_RUN: true,
  PAGE: "5. UI Design",            // the page to work on
  NAME: "",                        // required — background name, e.g. "Default", "Focus Dark" → component "Background/<NAME>"
  SIZE: null,                      // { w, h } — null = SIZE_FROM, then the most common screen size on the page
  SIZE_FROM: "",                   // name of the frame that needs the background — take exactly its size (e.g. a card, Live Activity "Focus_Live Activity")
  // explore — each paint: "#hex" · "var:<variable name>" · ["#a", "#b"] (linear) · ["#a", "#b", "radial"]
  PALETTE: { base: "", shapes: [], overlay: ["#000000", 0.2] },   // overlay: [color, opacity] · or "var:<alpha token>"
  PALETTE_LIGHT: null,             // optional — a light version with the same layout: { base, shapes, overlay: ["#FFFFFF", 0.1] }
  METHODS: ["skeleton", "overlay", "layer", "combined"],
  BLUR: "auto",                    // "auto" = from the long edge: single layer 23% · combined 14% (layer) + 23% (overlay) · or { overlay, layer, combinedLayer, combinedOverlay }
  // component
  PICK: "",                        // name of the chosen frame in the explore section, e.g. "Combined" · "Combined — light"
  ADD_AS_VARIANT_OF: "",           // name of an existing background component set, e.g. "Background" → add the variant on a COPY of that set
  VARIANT_PROPS: "Style=Dark",     // name of the new variant
  DESIGNER_CONFIRMED: false,       // merge: true ONLY when the designer has confirmed the variant on the copy
  // apply
  COMPONENT: "",                   // background component or variant, e.g. "Background/Default" · "Style=Dark" (inside set ADD_AS_VARIANT_OF)
  SCREEN_NAMES: [],
  GAP: 120, OWNER_KEY: "designtoolkit",
};
// ── section title frame — shared by clone · prototype · background · section scripts. Recognised by SHAPE + POSITION, not by name:
//    direct child of the section · top-left (x < 300, y < 200) · short (< 200) · contains text. Names like "— Settings", "Home", "Frame 1171" all work.
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
  if (!src) return "file has no section title frame — left empty";
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
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();
if (!CONFIG.NAME && !["apply", "merge"].includes(CONFIG.MODE)) return { stop: "NAME is empty" };

// ── color
const hexRgb = h => { const x = h.replace("#", ""); return { r: parseInt(x.slice(0, 2), 16) / 255, g: parseInt(x.slice(2, 4), 16) / 255, b: parseInt(x.slice(4, 6), 16) / 255 }; };
const locals = await figma.variables.getLocalVariablesAsync();
async function resolve(v, depth = 0) {                        // actual value of a color variable (follows aliases) — fallback for the bound paint
  const coll = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  const val = v.valuesByMode[coll ? coll.defaultModeId : Object.keys(v.valuesByMode)[0]];
  if (val && val.type === "VARIABLE_ALIAS" && depth < 8) { const nx = await figma.variables.getVariableByIdAsync(val.id); return nx ? resolve(nx, depth + 1) : null; }
  return val && typeof val.r === "number" ? val : null;
}
const unresolved = [];
async function colorOf(spec) {                                 // → { color, a, v }
  if (typeof spec === "string" && spec.startsWith("var:")) {
    const v = locals.find(x => x.name === spec.slice(4));
    if (!v) { unresolved.push(spec); return { color: { r: 0.5, g: 0.5, b: 0.5 }, a: 1 }; }
    const c = await resolve(v); return { color: c ? { r: c.r, g: c.g, b: c.b } : { r: 0.5, g: 0.5, b: 0.5 }, a: c && typeof c.a === "number" ? c.a : 1, v };
  }
  return { color: hexRgb(spec), a: 1 };
}
async function paint(spec) {
  if (Array.isArray(spec)) {
    const radial = spec[2] === "radial", ends = [await colorOf(spec[0]), await colorOf(spec[1])];
    return { type: radial ? "GRADIENT_RADIAL" : "GRADIENT_LINEAR", gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: ends.map((e, i) => ({ position: i, color: { ...e.color, a: e.a }, ...(e.v ? { boundVariables: { color: figma.variables.createVariableAlias(e.v) } } : {}) })) };
  }
  const e = await colorOf(spec);
  const p = { type: "SOLID", color: e.color, opacity: e.a };
  return e.v ? figma.variables.setBoundVariableForPaint(p, "color", e.v) : p;   // p carries the resolved color — never leave it {0,0,0}
}

// ── frame size
const screens = [], allFrames = [];
(function walk(c) { for (const k of c.children) { if (k.type === "SECTION") walk(k); else if (k.type === "FRAME") { allFrames.push(k); if (k.height >= 400) screens.push(k); for (const f of k.findAll(n => n.type === "FRAME")) allFrames.push(f); } } })(page);
let W, H;
const sizeFrom = CONFIG.SIZE_FROM ? allFrames.find(f => f.name === CONFIG.SIZE_FROM) : null;
if (CONFIG.SIZE_FROM && !sizeFrom && !CONFIG.SIZE) return { stop: `frame "${CONFIG.SIZE_FROM}" not found to take the size from` };
if (CONFIG.SIZE) ({ w: W, h: H } = CONFIG.SIZE);
else if (sizeFrom) { W = Math.round(sizeFrom.width); H = Math.round(sizeFrom.height); }
else { const m = new Map(); for (const s of screens) { const k = `${Math.round(s.width)}x${Math.round(s.height)}`; m.set(k, (m.get(k) || 0) + 1); }
  const top = [...m.entries()].sort((a, b) => b[1] - a[1])[0]; [W, H] = top ? top[0].split("x").map(Number) : [393, 852]; }
const L = Math.max(W, H);
const B = CONFIG.BLUR === "auto" ? { overlay: Math.round(L * 0.23), layer: Math.round(L * 0.23), combinedLayer: Math.round(L * 0.14), combinedOverlay: Math.round(L * 0.23) } : CONFIG.BLUR;

// ── the agent's own section (never write inside the designer's sections)
const abs = n => { const t = n.absoluteTransform; return { x: t ? t[0][2] : n.x, y: t ? t[1][2] : n.y, w: n.width, h: n.height }; };
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
function sectionFor(name) {
  let sec = page.children.find(n => n.type === "SECTION" && n.name === name);
  if (sec && sec.getSharedPluginData(CONFIG.OWNER_KEY, "owner") !== "agent") return { error: `section "${name}" belongs to the designer — use another name` };
  if (sec) return { sec };
  const tops = page.children.filter(n => n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP").map(abs);
  sec = figma.createSection(); sec.name = name; page.appendChild(sec);
  sec.x = (tops.length ? Math.max(...tops.map(b => b.x + b.w)) : 0) + CONFIG.GAP * 2; sec.y = tops.length ? Math.min(...tops.map(b => b.y)) : 0;
  sec.setSharedPluginData(CONFIG.OWNER_KEY, "owner", "agent");
  return { sec, isNew: true };   // title frame is added once the size is known — addTitle
}
function settle(sec) {
  const kids = sec.children; if (!kids.length) return 0;
  sec.resizeWithoutConstraints(Math.max(...kids.map(k => k.x + k.width)) + CONFIG.GAP, Math.max(...kids.map(k => k.y + k.height)) + CONFIG.GAP);
  let moved = 0;
  while (page.children.some(n => n.id !== sec.id && (n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP") && hit(abs(sec), abs(n))) && moved < 50) { sec.x += CONFIG.GAP * 4; moved++; }
  return moved;
}

// ═══════════════════════ EXPLORE
if (CONFIG.MODE === "explore") {
  const pals = [["", CONFIG.PALETTE], ...(CONFIG.PALETTE_LIGHT ? [[" — light", CONFIG.PALETTE_LIGHT]] : [])];
  const solidOnly = CONFIG.METHODS.length === 1 && CONFIG.METHODS[0] === "skeleton";
  for (const [, p] of pals) if (!p.base || (!solidOnly && (!p.shapes || p.shapes.length < 3))) return { stop: solidOnly ? "PALETTE needs base" : "PALETTE needs base and ≥ 3 shapes" };
  if (/live ?activity|dynamic ?island|widget|lock ?screen/i.test(CONFIG.NAME + " " + CONFIG.SIZE_FROM) && CONFIG.METHODS.some(m => m !== "skeleton"))
    return { stop: "system surfaces cannot blur — METHODS [\"skeleton\"], shapes [] → one solid color" };
  // shape layout — bleeding past the edges (negative positions, larger than the visible part). [kind, size×L, x×W, y×H, rotation]
  const LAYOUT = [["ellipse", 0.75, -0.35, -0.12, 0], ["rect", 0.55, 0.5, 0.05, 20], ["ellipse", 0.6, -0.2, 0.42, 0],
                  ["polygon", 0.5, 0.55, 0.55, 15], ["ellipse", 0.45, 0.15, 0.78, 0], ["rect", 0.4, -0.25, 0.9, -12]];
  // wash-out warning (light background): shape color after the overlay is almost the same as the base
  const fade = async p => { if (!Array.isArray(p.overlay) || !/^#?f{6}$/i.test(String(p.overlay[0]).replace("#", ""))) return null;
    const base = (await colorOf(p.base)).color, op = p.overlay[1], mix = c => ({ r: c.r * (1 - op) + op, g: c.g * (1 - op) + op, b: c.b * (1 - op) + op });
    const dist = (a, b) => Math.sqrt(((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2) / 3);
    let maxD = 0; for (const s of p.shapes) { const c = (await colorOf(Array.isArray(s) ? s[0] : s)).color; maxD = Math.max(maxD, dist(mix(c), base)); }
    return maxD < 0.12 ? `WASH-OUT risk — shape colors under the ${Math.round(op * 100)}% white overlay are only ${maxD.toFixed(2)} from the base: use colors deeper than you want to see, or lower the overlay to ~10%` : null; };
  const plan = [];
  for (const [suf] of pals) for (const m of CONFIG.METHODS) plan.push(`${m[0].toUpperCase() + m.slice(1)}${suf}`);
  const warns = []; for (const [suf, p] of pals) { const w = await fade(p); if (w) warns.push(`version${suf || " dark"}: ${w}`); }
  const report = { mode: CONFIG.DRY_RUN ? "DRY RUN — nothing created" : "BUILT", section: `Background — ${CONFIG.NAME}`, size: `${W}×${H}`, blur: B, versions: plan,
    ...(warns.length ? { warnings: warns } : {}) };
  if (CONFIG.DRY_RUN) return report;
  const S = sectionFor(`Background — ${CONFIG.NAME}`); if (S.error) return { stop: S.error };
  if (S.isNew) { S.sec.resizeWithoutConstraints(CONFIG.GAP * 2 + (W + CONFIG.GAP) * plan.length, H + CONFIG.GAP * 3); report.title = await addTitle(S.sec, null); }
  let x = CONFIG.GAP; const ids = {};
  for (const [suf, p] of pals) for (const m of CONFIG.METHODS) {
    const f = figma.createFrame(); f.name = `${m[0].toUpperCase() + m.slice(1)}${suf}`; S.sec.appendChild(f);
    f.resize(W, H); f.clipsContent = true; f.layoutMode = "NONE"; f.x = x; f.y = CONFIG.GAP * 1.5; f.fills = [await paint(p.base)];
    const layerBlur = m === "layer" ? B.layer : m === "combined" ? B.combinedLayer : 0, bgBlur = m === "overlay" ? B.overlay : m === "combined" ? B.combinedOverlay : 0;
    for (let i = 0; i < Math.min((p.shapes || []).length, LAYOUT.length); i++) {
      const [kind, sz, fx, fy, rot] = LAYOUT[i];
      const n = kind === "ellipse" ? figma.createEllipse() : kind === "rect" ? figma.createRectangle() : figma.createPolygon();
      n.name = `Shape ${i + 1}`; f.appendChild(n); n.resize(L * sz, L * sz); n.x = W * fx; n.y = H * fy; if (rot) n.rotation = rot;
      if (kind === "rect") n.cornerRadius = L * sz * 0.2;
      n.fills = [await paint(p.shapes[i])];
      if (layerBlur) n.effects = [{ type: "LAYER_BLUR", radius: layerBlur, visible: true, blurType: "NORMAL" }];
    }
    if (bgBlur) {
      const o = figma.createRectangle(); o.name = "Overlay"; f.appendChild(o); o.resize(W, H); o.x = 0; o.y = 0;
      o.fills = [Array.isArray(p.overlay) ? { type: "SOLID", color: hexRgb(p.overlay[0]), opacity: p.overlay[1] } : await paint(p.overlay)];
      o.effects = [{ type: "BACKGROUND_BLUR", radius: bgBlur, visible: true, blurType: "NORMAL" }];
      o.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    }
    ids[f.name] = f.id; x += W + CONFIG.GAP;
  }
  const moved = settle(S.sec);
  return { ...report, id: ids, ...(unresolved.length ? { variablesNotFound: [...new Set(unresolved)] } : {}), ...(moved ? { sectionShifted: moved } : {}),
    next: `designer picks one version → MODE "component", PICK = version name` };
}

// ═══════════════════════ COMPONENT
if (CONFIG.MODE === "component") {
  const sec = page.children.find(n => n.type === "SECTION" && n.name === `Background — ${CONFIG.NAME}`);
  const pick = sec && sec.children.find(n => n.type === "FRAME" && n.name === CONFIG.PICK);
  if (!pick) return { stop: `version "${CONFIG.PICK}" not found in section "Background — ${CONFIG.NAME}"` };
  let orig = null;
  if (CONFIG.ADD_AS_VARIANT_OF) {
    for (const p of figma.root.children) { await p.loadAsync(); orig = p.findOne(n => n.type === "COMPONENT_SET" && n.name === CONFIG.ADD_AS_VARIANT_OF && !n.getSharedPluginData(CONFIG.OWNER_KEY, "copyOf")); if (orig) break; }
    if (!orig) return { stop: `component set "${CONFIG.ADD_AS_VARIANT_OF}" not found` };
    if (orig.remote) return { stop: `"${orig.name}" is a component from an external library — variants cannot be added in this file` };
    if (orig.children.some(c => c.name === CONFIG.VARIANT_PROPS)) return { stop: `"${orig.name}" already has variant "${CONFIG.VARIANT_PROPS}" — use another name` };
  }
  const plan = orig ? `add variant "${CONFIG.VARIANT_PROPS}" on a COPY of "${orig.name}" (section "${sec.name}") — main component untouched`
                    : `create component "Background/${CONFIG.NAME}" from version "${CONFIG.PICK}"`;
  if (CONFIG.DRY_RUN) return { mode: "DRY RUN — nothing created", plan: plan };
  const comp = figma.createComponentFromNode(pick);
  if (!orig) { comp.name = `Background/${CONFIG.NAME}`; return { mode: "CREATED", plan: plan, id: comp.id, next: `MODE "apply" — place an instance as the frame's bottom layer` }; }
  // copy of the main set — lives in the agent's section; reuse the existing copy if one was made earlier
  let copy = sec.children.find(n => n.type === "COMPONENT_SET" && n.getSharedPluginData(CONFIG.OWNER_KEY, "copyOf") === orig.id);
  if (!copy) { copy = orig.clone(); sec.appendChild(copy); copy.name = orig.name;   // appendChild does not return the node — use copy
    copy.setSharedPluginData(CONFIG.OWNER_KEY, "copyOf", orig.id); copy.x = CONFIG.GAP; copy.y = Math.max(...sec.children.filter(c => c !== copy).map(c => c.y + c.height)) + CONFIG.GAP; }
  comp.name = CONFIG.VARIANT_PROPS; copy.appendChild(comp);
  comp.x = Math.max(0, ...copy.children.filter(c => c !== comp).map(c => c.x + c.width)) + 40; comp.y = 0;
  const moved = settle(sec);
  return { mode: "CREATED", plan: plan, copy: copy.id, newVariant: comp.id, ...(moved ? { sectionShifted: moved } : {}),
    next: `designer reviews the copy in section "${sec.name}" — once confirmed, MODE "merge" (DESIGNER_CONFIRMED) moves it into "${orig.name}"` };
}

// ═══════════════════════ MERGE — the designer has confirmed the variant on the copy
if (CONFIG.MODE === "merge") {
  if (!CONFIG.ADD_AS_VARIANT_OF) return { stop: "merge needs ADD_AS_VARIANT_OF" };
  let orig = null, copy = null;
  for (const p of figma.root.children) { await p.loadAsync();
    for (const n of p.findAll(x => x.type === "COMPONENT_SET" && x.name === CONFIG.ADD_AS_VARIANT_OF)) { if (n.getSharedPluginData(CONFIG.OWNER_KEY, "copyOf")) copy = n; else orig = n; } }
  if (!orig || !copy || copy.getSharedPluginData(CONFIG.OWNER_KEY, "copyOf") !== orig.id) return { stop: `main / copy pair of "${CONFIG.ADD_AS_VARIANT_OF}" not found` };
  const fresh = copy.children.filter(c => c.type === "COMPONENT" && !orig.children.some(o => o.name === c.name));
  const plan = `move ${fresh.length} new variant(s) (${fresh.map(c => c.name).join(", ") || "—"}) into "${orig.name}" · delete the copy`;
  if (!CONFIG.DESIGNER_CONFIRMED) return { stop: `merge edits the main component — only after the designer has confirmed (DESIGNER_CONFIRMED). Run an impact check first`, plan: plan };
  if (CONFIG.DRY_RUN) return { mode: "DRY RUN", plan: plan };
  for (const c of fresh) { orig.appendChild(c); c.x = Math.max(0, ...orig.children.filter(o => o !== c).map(o => o.x + o.width)) + 40; c.y = 0; }
  copy.remove();
  return { mode: "MERGED INTO MAIN", plan: plan, next: `MODE "apply" to switch frames to the new variant (if needed)` };
}

// ═══════════════════════ APPLY
if (CONFIG.MODE === "apply") {
  if (!CONFIG.COMPONENT || !CONFIG.SCREEN_NAMES.length) return { stop: "apply needs COMPONENT and SCREEN_NAMES" };
  let comp = null;
  for (const p of figma.root.children) { await p.loadAsync();
    comp = p.findOne(n => n.type === "COMPONENT" && (n.name === CONFIG.COMPONENT || (CONFIG.ADD_AS_VARIANT_OF && n.parent && n.parent.type === "COMPONENT_SET" && n.parent.name === CONFIG.ADD_AS_VARIANT_OF && n.name === CONFIG.COMPONENT && !n.parent.getSharedPluginData(CONFIG.OWNER_KEY, "copyOf"))));
    if (comp) break; }
  if (!comp) return { stop: `background component "${CONFIG.COMPONENT}" not found` };
  const isBg = async n => { if (n.type !== "INSTANCE") return false; const m = await n.getMainComponentAsync(); const nm = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : ""; return /^background/i.test(nm); };
  const rows = [];
  for (const name of CONFIG.SCREEN_NAMES) {
    const hits = allFrames.filter(f => f.name === name);
    if (!hits.length) { rows.push(`${name}: not found`); continue; }
    if (hits.length > 1) { rows.push(`${name}: ${hits.length} frames with the same name — give them unique names first`); continue; }
    const s = hits[0];
    if (Math.abs(comp.width - s.width) > 1 || Math.abs(comp.height - s.height) > 1) { rows.push(`${name}: size ${Math.round(s.width)}×${Math.round(s.height)} ≠ background ${Math.round(comp.width)}×${Math.round(comp.height)} — build a background of this size (SIZE_FROM "${name}")`); continue; }
    if (/_Fix$/.test(name)) { rows.push(`${name}: the designer is editing this copy — skipped`); continue; }
    const bottom = s.children[0], had = bottom ? await isBg(bottom) : false;
    const rootPaint = Array.isArray(s.fills) && s.fills.find(f => f.visible !== false && f.type !== "SOLID");
    rows.push(`${name}: ${had ? "switch the existing background to " + comp.name : "add an instance as the bottom layer"}${rootPaint ? " · screen frame paints its own " + rootPaint.type + " — removed, the background is the instance" : ""}`);
    if (CONFIG.DRY_RUN) continue;
    if (had) { bottom.swapComponent(comp); bottom.resize(s.width, s.height); continue; }
    const inst = comp.createInstance(); s.insertChild(0, inst); inst.x = 0; inst.y = 0; inst.resize(s.width, s.height);
    inst.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    if (rootPaint) s.fills = [];
  }
  return { mode: CONFIG.DRY_RUN ? "DRY RUN — nothing changed" : "PLACED", background: comp.name, frames: rows };
}
return { stop: `invalid MODE: ${CONFIG.MODE}` };
