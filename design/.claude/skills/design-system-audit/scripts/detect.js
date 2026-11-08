// detect.js — detect the conventions of a Figma file. READ-ONLY — writes nothing to the file.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
// Use when: starting on an unfamiliar file · the project's conventions (project.yaml) have no Figma part yet · at the start of a session to
//           re-detect page positions · progress counting needs frame names (the `screens` field).
// The result is a DRAFT for the user to confirm — never write it into project.yaml before confirmation.
// A broken component set (Figma: "has existing errors") is skipped and listed in `brokenSets` — ask the designer to repair it.

const CONFIG = {
  PAGES: null,                     // null = every page · or ["3. Wireframe", "5. UI Design"] for a quick pass
  SCREEN_PAGES: [],                // pages whose screen names are returned — e.g. ["3. Wireframe", "5. UI Design"]
  GLYPH_RANGES: [[0xE000, 0xF8FF], [0xF0000, 0x10FFFF]],   // project.yaml › icons.glyphRanges
  MIN_SCREEN_HEIGHT: 400,          // shorter frames do not count as screens when guessing the frame size
  TEMPLATE: null,                  // template screen the designer built — { page: "5. UI Design", frame: "Template_Home" }
                                   // → returns its skeleton for the agent to analyse before building
  TEMPLATE_DEPTH: 3,
};

// ───────────────────────── utilities
const inc = (m, k, by = 1) => m.set(k, (m.get(k) || 0) + by);
const top = (m, n = 5) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const isLabel = n => /^—\s/.test(n.name);                       // "— section label", "— fold"
const isGlyph = n => {
  if (n.type !== "TEXT") return false;
  const t = (n.characters || "").trim();
  if (!t || t.length > 3) return false;
  for (const ch of t) {
    const c = ch.codePointAt(0);
    if (CONFIG.GLYPH_RANGES.some(([a, b]) => c >= a && c <= b)) return true;
  }
  return false;
};
// screen frame: a FRAME at page level or inside a SECTION (recursing through sections) — not a label
function screensOf(container, out = []) {
  for (const c of container.children) {
    if (c.type === "SECTION") screensOf(c, out);
    else if (c.type === "FRAME" && !isLabel(c)) out.push(c);
  }
  return out;
}

// ───────────────────────── pages, screens, components, icons
const pages = figma.root.children.filter(p => !CONFIG.PAGES || CONFIG.PAGES.includes(p.name));
const pageInfo = [];
const frameSizes = new Map();
const safeTop = new Map();
const safeBottom = new Map();
const safeTopComp = new Map(), safeBottomComp = new Map();   // safe area built from a component instance
const atoms = new Map();
const componentPrefixes = new Map();
const glyphFonts = new Map();
let glyphCount = 0, iconComponents = 0;
const screens = {};
const sectionLabels = new Map();
// state language: component sets with state variants — what differs between states
const STATE_RE = /^(default|empty|filled|active|inactive|selected|unselected|focus(ed)?|error|fail(ed)?|disabled?|enabled|pressed|hover|on|off|checked|unchecked|locked)$/i;
const stateBy = { background: 0, border: 0, opacity: 0, shadow: 0 }, stateSets = [];
let uiFrames = 0, uiFramesStroked = 0;

for (const page of pages) {
  await page.loadAsync();                                  // mandatory — forgetting it returns empty results
  const pageScreens = screensOf(page);
  pageInfo.push({ name: page.name, topLevel: page.children.length, screens: pageScreens.length });
  if (CONFIG.SCREEN_PAGES.includes(page.name)) screens[page.name] = pageScreens.map(s => s.name);

  for (const s of pageScreens) {
    if (CONFIG.SCREEN_PAGES.includes(page.name)) for (const f of s.findAll(n => n.type === "FRAME" || n.type === "INSTANCE")) {
      uiFrames++; if (Array.isArray(f.strokes) && f.strokes.some(st => st.visible !== false) && f.strokeWeight !== 0) uiFramesStroked++;
    }
    if (s.height < CONFIG.MIN_SCREEN_HEIGHT) continue;
    inc(frameSizes, `${Math.round(s.width)} × ${Math.round(s.height)}`);
    // safe area: first/last block as wide as the screen, repeated across screens
    const kids = (s.children || []).filter(k => k.visible !== false && Math.abs(k.width - s.width) < 1);
    // several blocks can touch an edge (Content scrolls under the bars) → take the TOPMOST layer: Top / Bottom Container sit above Content
    const first = kids.filter(k => Math.abs(k.y) < 1).pop();
    if (first && first.height < 140) inc(safeTop, `${Math.round(first.height)} · "${first.name}"`);
    const last = kids.filter(k => Math.abs(k.y + k.height - s.height) < 1 && k !== first).pop();
    if (last && last.height < 100) inc(safeBottom, `${Math.round(last.height)} · "${last.name}"`);
    // safe area as a component: first instance of the top block · last instance of the bottom block
    const edgeInst = async (box, pick) => {
      if (!box) return null;
      const self = box.type === "INSTANCE" && /safe[ _-]?area/i.test(box.name);   // Safe-Area placed straight on the screen root
      if (!self && (!box.children || !box.children.length)) return null;
      const k = self ? box : pick(box.children);
      if (!k || k.type !== "INSTANCE") return null;
      const m = await k.getMainComponentAsync();
      return m ? `${m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name} · height ${Math.round(k.height)}` : null;
    };
    const tc = await edgeInst(first, c => c[0]);            if (tc) inc(safeTopComp, tc);
    const bc = await edgeInst(last, c => c[c.length - 1]);  if (bc) inc(safeBottomComp, bc);
  }

  for (const n of page.findAll(x => /^—\s/.test(x.name))) inc(sectionLabels, n.name.split(/\s·\s|\s/).slice(0, 3).join(" "));

  // atom inventory — every page (scan the whole file before concluding something is missing)
  for (const n of page.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })) {
    if (n.type === "COMPONENT" && n.parent && n.parent.type === "COMPONENT_SET") continue;
    atoms.set(n.name, {
      id: n.id, page: page.name,
      variants: n.type === "COMPONENT_SET" ? n.children.map(c => c.name) : null,
    });
    if (n.name.includes("/")) inc(componentPrefixes, n.name.split("/")[0] + "/");
    if (/icon/i.test(n.name)) iconComponents++;
  }
  for (const t of page.findAllWithCriteria({ types: ["TEXT"] })) {
    if (!isGlyph(t)) continue;
    glyphCount++;
    if (t.fontName !== figma.mixed) inc(glyphFonts, t.fontName.family);
  }
}

// ───────────────────────── variables
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(allVars.map(v => [v.id, v]));
const collInfo = [];
const floatPools = { spacing: new Map(), radius: new Map(), strokeWidth: new Map(), sizing: new Map() };
const scopeRole = { GAP: "spacing", CORNER_RADIUS: "radius", STROKE_FLOAT: "strokeWidth", WIDTH_HEIGHT: "sizing" };
const nameRole = [
  [/spac|gap|padding|inset|margin/i, "spacing"],
  [/radius|corner|rounded/i, "radius"],
  [/border-?width|stroke/i, "strokeWidth"],
  [/sizing|size|height|width|tap/i, "sizing"],
];
const unfilled = [];

for (const c of collections) {
  const vars = c.variableIds.map(id => byId.get(id)).filter(Boolean);
  const types = new Map(), prefixes = new Map();
  let missing = 0, sameAcrossModes = 0, aliases = 0;
  for (const v of vars) {
    inc(types, v.resolvedType);
    if (v.name.includes("/")) inc(prefixes, v.name.split("/")[0] + "/*");
    const vals = c.modes.map(m => v.valuesByMode[m.modeId]);
    if (vals.some(x => x === undefined || x === null)) missing++;
    if (vals.some(x => x && x.type === "VARIABLE_ALIAS")) aliases++;
    if (c.modes.length > 1 && v.resolvedType === "FLOAT" && vals.every(x => x === vals[0])) sameAcrossModes++;
    if (v.resolvedType === "FLOAT") {
      let role = null;
      for (const s of v.scopes || []) if (scopeRole[s]) { role = scopeRole[s]; break; }
      if (!role) for (const [re, r] of nameRole) if (re.test(v.name)) { role = r; break; }
      if (role) {
        const segs = v.name.split("/");
        inc(floatPools[role], `${c.name}/${segs.length > 1 ? segs.slice(0, -1).join("/") + "/" : ""}*`);
      }
    }
  }
  if (missing) unfilled.push(`${c.name}: ${missing}/${vars.length} variables lack a value in at least one mode`);
  if (sameAcrossModes && sameAcrossModes === vars.filter(v => v.resolvedType === "FLOAT").length && c.modes.length > 1)
    unfilled.push(`${c.name}: every number variable has the same value in every mode — switching modes changes nothing (references/system-binding.md §2)`);
  collInfo.push({
    name: c.name, modes: c.modes.map(m => m.name), variables: vars.length,
    types: Object.fromEntries(types), aliases, prefixes: top(prefixes, 8).map(([k]) => k),
  });
}
const designColl = collInfo.find(c => /mapped|semantic|theme/i.test(c.name))
  || [...collInfo].sort((a, b) => b.aliases - a.aliases)[0] || null;

// ───────────────────────── styles
const textStyles = await figma.getLocalTextStylesAsync();
const effectStyles = await figma.getLocalEffectStylesAsync();
const gridStyles = await figma.getLocalGridStylesAsync();
const paintStyles = await figma.getLocalPaintStylesAsync();
const sizes = [...new Set(textStyles.map(s => Math.round(s.fontSize)))].sort((a, b) => a - b);
const tsKeys = new Map();
for (const s of textStyles) inc(tsKeys, `${Math.round(s.fontSize)}/${s.fontName.style}`);
const tsFamilies = new Map();
for (const s of textStyles) inc(tsFamilies, s.fontName.family);

// ───────────────────────── conclusions
const pool = r => { const t = top(floatPools[r], 1); return t.length ? t[0][0] : "none"; };
const frameTop = top(frameSizes, 3);
const totalScreens = [...frameSizes.values()].reduce((a, b) => a + b, 0);
const mainFrame = frameTop[0] ? frameTop[0][0] : null;
const styleMode = designColl && textStyles.length ? 2 : 1;          // references/style-read.md §5

const needConfirm = [];
if (frameTop.length > 1) for (const [k, n] of frameTop.slice(1)) needConfirm.push(`${n} screens sized ${k} — legacy or intentional?`);
if (!designColl) needConfirm.push("no collection for design use (mapped) found — which collection is the bindTarget?");
else if (!/mapped|semantic|theme/i.test(designColl.name)) needConfirm.push(`bindTarget guessed as "${designColl.name}" — correct?`);
needConfirm.push("values off the system: report (default) or snap to the nearest (snap-nearest)?");
for (const u of unfilled) needConfirm.push(u);
if (tsKeys.size < textStyles.length) needConfirm.push("some text styles share a size/weight key — binding by key will be ambiguous");
if (glyphCount && glyphFonts.size > 1) needConfirm.push(`glyph icons use ${glyphFonts.size} fonts: ${[...glyphFonts.keys()].join(", ")}`);

  // ───────────────────────── template screen — skeleton
let template = null;
if (CONFIG.TEMPLATE) {
  const tp = figma.root.children.find(p => p.name === CONFIG.TEMPLATE.page);
  if (tp) await tp.loadAsync();
  const tf = tp && screensOf(tp).find(f => f.name === CONFIG.TEMPLATE.frame);
  if (!tf) template = { error: `template screen "${CONFIG.TEMPLATE.frame}" not found on page "${CONFIG.TEMPLATE.page}"` };
  else {
    const sk = async (n, d) => {
      const o = { name: n.name, type: n.type, size: `${Math.round(n.width)}×${Math.round(n.height)}` };
      if (n.layoutMode) o.layout = n.layoutMode;
      if (n.layoutPositioning === "ABSOLUTE") o.positioning = "absolute";
      if (n.layoutSizingHorizontal) o.width = n.layoutSizingHorizontal;
      if (n.layoutSizingVertical) o.height = n.layoutSizingVertical;
      if (n.type === "INSTANCE") { const m = await n.getMainComponentAsync(); o.component = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? `${m.parent.name} › ${m.name}` : m.name) : "LINK LOST"; return o; }
      if (n.children && d < CONFIG.TEMPLATE_DEPTH) { o.children = []; for (const c of n.children) o.children.push(await sk(c, d + 1)); }
      else if (n.children && n.children.length) o.children = `${n.children.length} layers — deeper than ${CONFIG.TEMPLATE_DEPTH} levels, not listed`;
      return o;
    };
    template = await sk(tf, 0);
    // template screens are often copied from another file — variables, styles, components point to that file. Learn the STRUCTURE only
    const foreign = { variables: 0, styles: 0, components: 0, componentNames: new Set() };
    const localVarIds = new Set((await figma.variables.getLocalVariablesAsync()).map(v => v.id));
    const localStyleIds = new Set([...(await figma.getLocalTextStylesAsync()), ...(await figma.getLocalPaintStylesAsync()),
      ...(await figma.getLocalEffectStylesAsync())].map(s => s.id));
    for (const n of [tf, ...tf.findAll(() => true)]) {
      const ids = [];
      for (const v of Object.values(n.boundVariables || {})) (Array.isArray(v) ? v : [v]).forEach(x => x && x.id && ids.push(x.id));
      for (const p of Array.isArray(n.fills) ? n.fills : []) if (p.boundVariables && p.boundVariables.color) ids.push(p.boundVariables.color.id);
      foreign.variables += ids.filter(id => !localVarIds.has(id)).length;
      for (const k of ["textStyleId", "fillStyleId", "effectStyleId"]) if (typeof n[k] === "string" && n[k] && !localStyleIds.has(n[k])) foreign.styles++;
      if (n.type === "INSTANCE") { const m = await n.getMainComponentAsync(); if (m && m.remote) { foreign.components++; foreign.componentNames.add(m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name); } }
    }
    template = { skeleton: template, foreignValues: { variables: foreign.variables, styles: foreign.styles, components: foreign.components,
      componentsFromOtherFiles: [...foreign.componentNames].slice(0, 30) },
      note: "learn the structure only — colors, text, variables, styles of the template come from another file: do NOT use them as values. Components from another file → match them to the same-named atom in this file" };
  }
}
if (safeTopComp.size) needConfirm.push(`top safe area built from a component: ${top(safeTopComp, 1)[0][0]} (${top(safeTopComp, 1)[0][1]} screens) — use it as the standard?`);

// ───────────────────────── Background/* — how the file builds backgrounds (screen-background skill)
const backgrounds = [];
for (const page of pages) for (const c of page.findAll(n => (n.type === "COMPONENT" || n.type === "COMPONENT_SET") && /^background\b/i.test(n.name))) {
  const vs = c.type === "COMPONENT_SET" ? c.children : [c];
  for (const v of vs) {
    const kids = v.children || [];
    const has = t => kids.some(k => (k.effects || []).some(e => e.visible !== false && e.type === t));
    const top = kids[kids.length - 1];
    const overlay = top && (top.effects || []).some(e => e.type === "BACKGROUND_BLUR");
    const layer = has("LAYER_BLUR");
    const how = overlay && layer ? "combined" : overlay ? "overlay" : layer ? "layer" : (Array.isArray(v.fills) && v.fills.some(f => /GRADIENT/.test(f.type)) ? "gradient — not blurred" : "other");
    const radius = t => Math.max(0, ...kids.flatMap(k => (k.effects || []).filter(e => e.type === t).map(e => e.radius || 0)));
    backgrounds.push({ name: c.type === "COMPONENT_SET" ? `${c.name} › ${v.name}` : v.name, page: page.name, method: how, size: `${Math.round(v.width)}×${Math.round(v.height)}`,
      blur: { overlay: radius("BACKGROUND_BLUR") || undefined, shape: radius("LAYER_BLUR") || undefined } });
  }
}
if (backgrounds.length) needConfirm.push(`the file has ${backgrounds.length} Background/* backgrounds — new screens use an instance of these, never draw their own (screen-background skill)`);

// ───────────────────────── state language
const paintKey = list => Array.isArray(list) ? list.filter(p => p.visible !== false).map(p => p.type === "SOLID" ? (p.boundVariables && p.boundVariables.color ? p.boundVariables.color.id : [p.color.r, p.color.g, p.color.b].map(x => Math.round(x * 255)).join(",")) : p.type).join("|") : "M";
// broken set (Figma: "Component set … has existing errors" — e.g. two variants with the same name) → skip, report its name; do not stop the whole script
const brokenSets = [];
for (const page of pages) {
  for (const set of page.findAll(n => n.type === "COMPONENT_SET")) {
    const vs = set.children.filter(v => v.type === "COMPONENT");
    const st = v => Object.values(v.variantProperties || {}).find(x => STATE_RE.test(String(x)));
    let withState;
    try { withState = vs.filter(st); } catch (e) { brokenSets.push({ name: set.name, id: set.id, page: page.name, error: String(e.message || e).slice(0, 120) }); continue; }
    if (withState.length < 2) continue;
    const base = withState[0], d = { background: 0, border: 0, opacity: 0, shadow: 0 };
    for (const v of withState.slice(1)) {
      if (paintKey(v.fills) !== paintKey(base.fills)) d.background++;
      const sk = x => (Array.isArray(x.strokes) && x.strokes.some(t => t.visible !== false) ? paintKey(x.strokes) + "/" + x.strokeWeight : "none");
      if (sk(v) !== sk(base)) d.border++;
      if ((v.opacity ?? 1) !== (base.opacity ?? 1)) d.opacity++;
      if ((v.effects || []).length !== (base.effects || []).length) d.shadow++;
    }
    const main = Object.entries(d).sort((a, b) => b[1] - a[1])[0];
    if (main[1]) { stateBy[main[0]]++; stateSets.push(`${set.name}: ${main[0]}`); }
  }
}
const stateLang = Object.entries(stateBy).sort((a, b) => b[1] - a[1]);
const stateMain = stateLang[0][1] ? (stateLang[1][1] && stateLang[1][1] * 2 > stateLang[0][1] ? "mixed" : stateLang[0][0]) : null;
if (stateMain === "background" && uiFrames && uiFramesStroked / uiFrames < 0.05) needConfirm.push(`states are shown by BACKGROUND, borders are almost never used (${uiFramesStroked}/${uiFrames} frames have a border) — new components should not use borders for states?`);
else if (stateMain) needConfirm.push(`states are shown mainly by ${stateMain} (${stateSets.length} component sets) — new components follow this?`);
if (brokenSets.length) needConfirm.push(`${brokenSets.length} broken component sets were skipped: ${brokenSets.map(b => `${b.name} (page ${b.page})`).join(" · ")} — if a screen needs one → fix a copy in a separate section (never the main set)`);

  const atomsByPage = [...atoms.values()].reduce((m, a) => (inc(m, a.page), m), new Map());
return {
  detected: {
    pages: pageInfo,
    frame: mainFrame ? `${mainFrame}  (${frameTop[0][1]}/${totalScreens} screens)` : "could not guess",
    safeTop: top(safeTop, 2), safeBottom: top(safeBottom, 2),
    safeAreaComponent: { top: top(safeTopComp, 2), bottom: top(safeBottomComp, 2) },
    token: collInfo,
    bindTargetGuess: designColl ? designColl.name : null,
    textStyles: { count: textStyles.length, sizes, families: Object.fromEntries(tsFamilies) },
    effectStyles: effectStyles.length, gridStyles: gridStyles.length, paintStyles: paintStyles.length,
    icon: { glyph: glyphCount, glyphFonts: Object.fromEntries(glyphFonts), componentsNamedIcon: iconComponents },
    atoms: { count: atoms.size, byPage: Object.fromEntries(top(atomsByPage, 20)) },
    componentPrefixes: top(componentPrefixes, 8),
    specialLabels: Object.fromEntries(sectionLabels),
    styleReadMode: styleMode,
    backgrounds: backgrounds.slice(0, 20),
    stateLanguage: { main: stateMain, byKind: Object.fromEntries(stateLang), samples: stateSets.slice(0, 15), framesWithBorder: `${uiFramesStroked}/${uiFrames}` },
    brokenSets: brokenSets,
  },
  needsConfirmation: needConfirm,
  projectYamlDraft: {
    platform: { frame: mainFrame },
    visual: { background: backgrounds.length ? backgrounds.map(b => `${b.name} · ${b.method}`).slice(0, 8) : null },
    stateLanguage: stateMain,          // references/component-spec.md §6 — background | border | opacity | shadow | mixed
    tokens: {
      collections: collInfo.map(c => c.name).join(" → "),
      modes: designColl ? designColl.modes.join(" · ") : null,
      bindTarget: designColl ? designColl.name : null,
      colorPrefix: designColl ? designColl.prefixes.join(" · ") : null,
      spacing: pool("spacing"), radius: pool("radius"), strokeWidth: pool("strokeWidth"), sizing: pool("sizing"),
      effects: effectStyles.length ? "effect styles" : "none",
      grids: gridStyles.length ? "grid styles" : "none",
      valuesFilled: unfilled.length === 0,
    },
    typography: { scale: sizes.join(" ") },
    icons: { strategy: [glyphCount ? "symbol-font" : null, iconComponents ? "vector" : null].filter(Boolean).join(" + ") || "none", font: top(glyphFonts, 1).map(([k]) => k)[0] || null },
    screen: {
      template: CONFIG.TEMPLATE ? `page "${CONFIG.TEMPLATE.page}" · frame "${CONFIG.TEMPLATE.frame}"` : null,
      safeArea: safeTopComp.size || safeBottomComp.size ? "spacer-component" : null,
      safeTop: safeTopComp.size ? `component "${top(safeTopComp, 1)[0][0].split(" · ")[0]}"` : null,
      safeBottom: safeBottomComp.size ? `component "${top(safeBottomComp, 1)[0][0].split(" · ")[0]}"` : null,
    },
    components: { atomicLocation: top(atomsByPage, 1).map(([k]) => `page "${k}"`)[0] || null },
  },
  templateScreen: template,
  atoms: Object.fromEntries(atoms),
  screens,
};
