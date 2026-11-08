// system-audit.js — DESIGN SYSTEM HEALTH AUDIT of the file: variables, styles, components (references/system-audit.md).
// Uses the system as a whole, not one screen: for a single screen use the audit_design tool.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
// A 40k-layer file takes ~17 s; pass timeoutMs: 120000. Files > 50k layers: audit per page first (PAGES).
//
// READ-ONLY by default — report + proposals. Fixes only after the designer has approved each group: fill APPLY, run DRY_RUN = true
// (reports what would change), the designer says "run it for real" → DRY_RUN = false. Never touches main components — component
// findings are report-only.
const CONFIG = {
  PAGES: null,                     // null = every page · or ["Components", "5. UI Design"] — large files: audit per page
  SYSTEM_PAGES: /component|design system|foundation|token|style|library|atom/i,   // pages that hold the system — primitives used here are not an error
  PRIMITIVE_COLLECTION: /primitive|base|core|palette|global/i,                     // tier-1 collection (references/tokens.md §1.1)
  NEAR_COLOR: 0.02,                // near-duplicate colors: max difference per channel (0–1) — same collection, same mode
  MAX_COMPONENTS: 300,             // number of components whose instances are counted (getInstancesAsync is slow on big files)
  MAX_ITEMS: 40,                   // detail items listed per group
  SEMANTIC_COLLECTION: /alias|mapped|semantic|theme/i,                          // semantic tier — must alias, no raw values
  CONTRAST_PAIRS: [],              // [["content/primary", "surface/default"], …] — declared text / background pairs; empty = auto-pair "on-X" ↔ "X"
  MIN_FONT_SIZE: 11,               // smallest font size (iOS Caption 2 = 11 — references/tokens.md §2.5)
  MAX_ALIAS_DEPTH: 10,
  ICON_SET: /icon|ic[_-]|glyph|symbol/i,                                        // sets with many icon-like variants → should use instance swap
  ICON_VARIANT_MAX: 20,
  COMPONENT_SCAN: true,            // audit inside components: unbound values, text styles, auto layout, properties, default names
  DRY_RUN: true,
  // Approved fixes — one action per item. Only 4 kinds, all reversible by hand:
  //   { type: "scope",  id: "<variable id>", scopes: ["FRAME_FILL", "SHAPE_FILL"] }
  //   { type: "rename", id: "<variable id>", name: "color/bg/surface" }
  //   { type: "delete", id: "<variable id>" }                         — only when a re-audit still shows 0 uses
  //   { type: "merge",  from: "<variable id>", to: "<variable id>" }  — rebind every use of `from` to `to`, then delete `from`
  APPLY: [],
};

// config may arrive as JSON — patterns sent as strings are turned back into RegExp
const rx = x => (x instanceof RegExp ? x : new RegExp(String(x), "i"));
CONFIG.SYSTEM_PAGES = rx(CONFIG.SYSTEM_PAGES); CONFIG.PRIMITIVE_COLLECTION = rx(CONFIG.PRIMITIVE_COLLECTION);
CONFIG.SEMANTIC_COLLECTION = rx(CONFIG.SEMANTIC_COLLECTION); CONFIG.ICON_SET = rx(CONFIG.ICON_SET);
const out = { variables: {}, styles: {}, components: {}, proposals: [], caveats: [] };
const cap = a => a.slice(0, CONFIG.MAX_ITEMS);
const hex = c => c && typeof c.r === "number" ? "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("") : String(c);

// ───────────────────────── load the system
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const vById = new Map(vars.map(v => [v.id, v]));
const cById = new Map(collections.map(c => [c.id, c]));
const pages = figma.root.children.filter(p => !CONFIG.PAGES || CONFIG.PAGES.includes(p.name));
if (CONFIG.PAGES) out.caveats.push(`audited pages only: ${CONFIG.PAGES.join(", ")} — "unused" is only true within this scope`);

// ───────────────────────── scan uses: variables (field, paint, effect, alias) · styles · instances
const useVar = new Map();          // variable id → [{ node, kind, field, index }]
const useStyle = new Map();        // style id → number of uses
const primitiveOnScreen = [];
let mixedText = 0;
const addUse = (id, u) => { if (!useVar.has(id)) useVar.set(id, []); useVar.get(id).push(u); };
const addStyle = id => { if (id && typeof id === "string") useStyle.set(id, (useStyle.get(id) || 0) + 1); };
for (const v of vars) for (const val of Object.values(v.valuesByMode)) if (val && val.type === "VARIABLE_ALIAS") addUse(val.id, { alias: v.id });

for (const page of pages) {
  await page.loadAsync();
  const sys = CONFIG.SYSTEM_PAGES.test(page.name);
  for (const n of page.findAll(() => true)) {
    const bv = n.boundVariables || {};
    for (const [field, b] of Object.entries(bv)) {
      if (field === "fills" || field === "strokes" || field === "effects" || field === "textRangeFills") continue;   // read via the paints below
      for (const x of Array.isArray(b) ? b : [b]) if (x && x.id) addUse(x.id, { node: n.id, kind: "field", field });
    }
    for (const f of ["fills", "strokes"]) {
      const ps = n[f];
      if (ps === figma.mixed) { if (n.type === "TEXT") mixedText++; continue; }
      if (Array.isArray(ps)) ps.forEach((p, i) => { const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id; if (id) addUse(id, { node: n.id, kind: "paint", field: f, index: i }); });
    }
    if (Array.isArray(n.effects)) n.effects.forEach((e, i) => { for (const b of Object.values(e.boundVariables || {})) if (b && b.id) addUse(b.id, { node: n.id, kind: "effect", index: i }); });
    for (const k of ["fillStyleId", "strokeStyleId", "effectStyleId", "textStyleId", "gridStyleId"]) if (k in n) addStyle(n[k]);
    if (!sys) {                                                        // primitive bound directly on a screen — should go through alias / mapped
      const ids = [];                                                  // colors only — font / weight bound to primitives produced ~960 false hits
      for (const f of ["fills", "strokes"]) if (Array.isArray(n[f])) n[f].forEach(p => ids.push(p.boundVariables && p.boundVariables.color && p.boundVariables.color.id));
      for (const id of ids.filter(Boolean)) { const v = vById.get(id), c = v && cById.get(v.variableCollectionId); if (c && CONFIG.PRIMITIVE_COLLECTION.test(c.name)) primitiveOnScreen.push(`${page.name} › ${n.name} → ${v.name}`); }
    }
  }
}
if (mixedText) out.caveats.push(`${mixedText} text layers have several colors in one line (fills mixed) — variables bound per text range are not counted; "unused" may miss some`);

// ───────────────────────── variables
const unused = [], dupe = [], near = [], broken = [], allScopes = [], missingMode = [], naming = [];
const primScoped = [], scopeRole = [], rawSemantic = [], deepAlias = [], tinyFont = [], noDesc = [];
// role guessed from the name → expected scope (Figma figma-generate-library skill · references/tokens.md §2.1). BOOLEAN / STRING have no scope — skipped
const ROLE = [
  [/(^|\/)(text|content|on[-_]|label|foreground|fg)/i, ["TEXT_FILL"], "COLOR"],
  [/(^|\/)(bg|background|surface|fill|container|overlay|scrim)/i, ["FRAME_FILL", "SHAPE_FILL", "ALL_FILLS"], "COLOR"],
  [/(^|\/)(border|stroke|outline|divider)(\/|$)/i, ["STROKE_COLOR"], "COLOR"],
  [/(^|\/)(spacing|space|gap|padding|margin)/i, ["GAP", "WIDTH_HEIGHT"], "FLOAT"],
  [/(^|\/)(radius|corner)/i, ["CORNER_RADIUS"], "FLOAT"],
  [/(font[-_ ]?size|fontsize)/i, ["FONT_SIZE"], "FLOAT"],
  [/(line[-_ ]?height|lineheight|leading)/i, ["LINE_HEIGHT"], "FLOAT"],
  [/(tracking|letter[-_ ]?spacing)/i, ["LETTER_SPACING"], "FLOAT"],
  [/(border[-_ ]?width|stroke[-_ ]?width)/i, ["STROKE_FLOAT"], "FLOAT"],
];
const aliasDepth = (v, seen) => {
  let d = 0, cur = v; const s2 = new Set();
  while (cur && d <= CONFIG.MAX_ALIAS_DEPTH + 1) {
    const val = Object.values(cur.valuesByMode)[0];
    if (!(val && val.type === "VARIABLE_ALIAS")) return d;
    if (s2.has(cur.id)) return Infinity;                                 // alias loop
    s2.add(cur.id); cur = vById.get(val.id); d++;
  }
  return d;
};
for (const c of collections) {
  const cv = c.variableIds.map(id => vById.get(id)).filter(Boolean);
  // naming — the group separator used by the majority of the collection
  const sep = v => (v.name.includes("/") ? "/" : v.name.includes(".") ? "." : v.name.includes("-") ? "-" : "none");
  const count = {}; cv.forEach(v => (count[sep(v)] = (count[sep(v)] || 0) + 1));
  const major = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  for (const v of cv) {
    if (major && sep(v) !== major[0] && cv.length > 3) naming.push(`${c.name} › ${v.name} (majority separates with "${major[0]}")`);
    if (/\s{2,}|^\s|\s$|\s\/|\/\s/.test(v.name)) naming.push(`${c.name} › "${v.name}" has stray whitespace`);
    if (!useVar.has(v.id)) unused.push({ id: v.id, name: `${c.name} › ${v.name}` });
    const isPrim = CONFIG.PRIMITIVE_COLLECTION.test(c.name), isSem = !isPrim && CONFIG.SEMANTIC_COLLECTION.test(c.name);
    const hasScope = v.resolvedType === "COLOR" || v.resolvedType === "FLOAT";
    // primitives carry no role: empty scopes — designer rule (references/tokens.md §2.1)
    if (isPrim && hasScope && Array.isArray(v.scopes) && v.scopes.length) primScoped.push({ id: v.id, name: `${c.name} › ${v.name}`, scope: v.scopes.join(",") });
    else if (hasScope && Array.isArray(v.scopes) && v.scopes.includes("ALL_SCOPES"))
      allScopes.push({ id: v.id, name: `${c.name} › ${v.name}`, type: v.resolvedType });
    else if (!isPrim && hasScope && Array.isArray(v.scopes)) {
      const r = ROLE.find(([re, , t]) => t === v.resolvedType && re.test(v.name));
      if (r && !r[1].some(x => v.scopes.includes(x))) scopeRole.push({ id: v.id, name: `${c.name} › ${v.name}`, current: v.scopes.join(",") || "empty", expected: r[1].join(" / ") });
    }
    // alpha colors (a < 1, e.g. alpha/black/80) kept raw in the semantic tier are intentional — counting them gave 48 false hits
    if (isSem) for (const m of c.modes) { const val = v.valuesByMode[m.modeId]; if (v.resolvedType === "COLOR" && val && val.type !== "VARIABLE_ALIAS" && !(typeof val.a === "number" && val.a < 1)) { rawSemantic.push(`${c.name} › ${v.name} · ${m.name} = ${hex(val)}`); break; } }
    const dep = aliasDepth(v); if (dep > CONFIG.MAX_ALIAS_DEPTH) deepAlias.push(`${c.name} › ${v.name} (${dep === Infinity ? "loop" : dep + " levels"})`);
    if (v.resolvedType === "FLOAT" && /(font[-_ ]?size|fontsize)/i.test(v.name)) for (const m of c.modes) { const val = v.valuesByMode[m.modeId]; if (typeof val === "number" && val < CONFIG.MIN_FONT_SIZE) tinyFont.push(`${c.name} › ${v.name} · ${m.name} = ${val}`); }
    if (!isPrim && !v.description) noDesc.push(`${c.name} › ${v.name}`);
    for (const m of c.modes) {
      const val = v.valuesByMode[m.modeId];
      if (val === undefined) missingMode.push(`${c.name} › ${v.name} · mode ${m.name}`);
      else if (val && val.type === "VARIABLE_ALIAS" && !vById.has(val.id) && !(await figma.variables.getVariableByIdAsync(val.id)))
        broken.push({ id: v.id, name: `${c.name} › ${v.name}`, mode: m.name });
    }
  }
  // duplicate / near-duplicate values — first mode, direct values only (aliases are intentional)
  const m0 = c.modes[0] && c.modes[0].modeId, groups = new Map(), colors = [];
  for (const v of cv) {
    const val = v.valuesByMode[m0];
    if (val === undefined || (val && val.type === "VARIABLE_ALIAS")) continue;
    const grp = v.resolvedType === "COLOR" ? "" : v.name.split("/")[0];   // numbers: compare only within the same group (fontsize ≠ lineheight even at 16)
    const key = v.resolvedType + ":" + grp + ":" + (typeof val === "object" ? JSON.stringify([val.r, val.g, val.b, val.a].map(x => Math.round((x == null ? 1 : x) * 1000))) : String(val));
    if (!groups.has(key)) groups.set(key, []); groups.get(key).push(v);
    if (v.resolvedType === "COLOR") colors.push(v);
  }
  for (const [, g] of groups) if (g.length > 1) dupe.push({ collection: c.name, value: g[0].resolvedType === "COLOR" ? hex(g[0].valuesByMode[m0]) : g[0].valuesByMode[m0], variables: g.map(v => ({ id: v.id, name: v.name, uses: (useVar.get(v.id) || []).length })) });
  for (let i = 0; i < colors.length; i++) for (let j = i + 1; j < colors.length; j++) {
    const a = colors[i].valuesByMode[m0], b = colors[j].valuesByMode[m0];
    const d = Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));
    if (d > 0 && d <= CONFIG.NEAR_COLOR) near.push(`${c.name} › ${colors[i].name} ${hex(a)} ≈ ${colors[j].name} ${hex(b)}`);
  }
}
// primitive color ramps: same steps as the majority of ramps · lightness decreasing with the step (references/tokens.md §2.2, §2.8)
const ramps = new Map();
for (const v of vars) {
  const c = cById.get(v.variableCollectionId);
  if (!c || !CONFIG.PRIMITIVE_COLLECTION.test(c.name) || v.resolvedType !== "COLOR") continue;
  const m = v.name.match(/^(.*)\/(\d{1,4})$/); if (!m) continue;
  if (!ramps.has(m[1])) ramps.set(m[1], []); ramps.get(m[1]).push({ step: +m[2], v, c });
}
const stepCount = new Map(); for (const [, r] of ramps) { const k = r.map(x => x.step).sort((a, b) => a - b).join(","); stepCount.set(k, (stepCount.get(k) || 0) + 1); }
const majorSteps = ([...stepCount.entries()].sort((a, b) => b[1] - a[1])[0] || [""])[0].split(",").filter(Boolean).map(Number);
const rampGap = [], rampOrder = [];
const relLum = c => [c.r, c.g, c.b].map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
for (const [name, r] of ramps) {
  const steps = new Set(r.map(x => x.step));
  const miss = majorSteps.filter(x => !steps.has(x));
  if (r.length >= 3 && miss.length && miss.length < majorSteps.length) rampGap.push(`${name}: missing ${miss.join(", ")}`);
  const sorted = [...r].sort((a, b) => a.step - b.step), m0 = sorted[0].c.modes[0].modeId;
  const lums = sorted.map(x => { const val = x.v.valuesByMode[m0]; return val && typeof val.r === "number" ? relLum(val) : null; });
  for (let i = 1; i < lums.length; i++) if (lums[i] != null && lums[i - 1] != null && lums[i] > lums[i - 1] + 0.005) { rampOrder.push(`${name}: step ${sorted[i].step} is lighter than step ${sorted[i - 1].step}`); break; }
}
// contrast per token pair, every mode (references/tokens.md §2.4)
const resolveColor = (v, modeId, guard = 0) => {
  if (!v || guard > 12) return null;
  const c = cById.get(v.variableCollectionId); if (!c) return null;
  const val = v.valuesByMode[modeId] !== undefined ? v.valuesByMode[modeId] : v.valuesByMode[c.defaultModeId];
  if (val && val.type === "VARIABLE_ALIAS") { const t = vById.get(val.id); const tc = t && cById.get(t.variableCollectionId); return resolveColor(t, tc ? tc.defaultModeId : null, guard + 1); }
  return val && typeof val.r === "number" ? val : null;
};
const byName = new Map(vars.filter(v => v.resolvedType === "COLOR").map(v => [v.name, v]));
let pairs = CONFIG.CONTRAST_PAIRS.map(([f, b]) => [byName.get(f), byName.get(b), f, b]);
if (!pairs.length) for (const v of byName.values()) {
  const m = v.name.match(/^(.*\/)?on[-_]?(.+)$/i); if (!m) continue;
  // background with the same suffix — prefer names with a background role (content/on_success was paired with the text color content/success)
  const cand = [...byName.values()].filter(x => x !== v && x.name.toLowerCase().endsWith("/" + m[2].toLowerCase()) && !/(^|\/)on[-_]/i.test(x.name));
  const bg = cand.find(x => /(^|\/)(surface|bg|background|container|fill)/i.test(x.name)) || byName.get((m[1] || "") + m[2]) || cand[0];
  if (bg) pairs.push([v, bg, v.name, bg.name]);
}
const contrastFail = [], contrastMissing = [];
const ratio = (a, b) => { const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
for (const [f, b, fn, bn] of pairs) {
  if (!f || !b) { contrastMissing.push(`${fn} / ${bn}`); continue; }
  const c = cById.get(f.variableCollectionId);
  for (const m of c.modes) { const a = resolveColor(f, m.modeId), bb = resolveColor(b, m.modeId); if (a && bb && ratio(a, bb) < 4.5) contrastFail.push(`${fn} on ${bn} · ${m.name}: ${ratio(a, bb).toFixed(2)}`); }
}
out.variables = {
  total: vars.length, collections: collections.map(c => `${c.name} (${c.variableIds.length} variables · ${c.modes.map(m => m.name).join("/")})`),
  unused: { count: unused.length, items: cap(unused) }, duplicateValues: { count: dupe.length, groups: cap(dupe) }, nearDuplicateColors: { count: near.length, items: cap(near) },
  brokenAliases: { count: broken.length, items: cap(broken) }, allScopes: { count: allScopes.length, items: cap(allScopes) },
  missingModeValues: { count: missingMode.length, items: cap(missingMode) }, namingInconsistent: { count: naming.length, items: cap(naming) },
  primitiveBoundOnScreens: { count: primitiveOnScreen.length, items: cap(primitiveOnScreen) },
  primitiveWithScopes: { count: primScoped.length, items: cap(primScoped) }, scopeRoleMismatch: { count: scopeRole.length, items: cap(scopeRole) },
  rawValueInSemanticTier: { count: rawSemantic.length, items: cap(rawSemantic) }, aliasTooDeep: { count: deepAlias.length, items: cap(deepAlias) },
  rampMissingSteps: { count: rampGap.length, standardSteps: majorSteps.join(","), items: cap(rampGap) }, rampNotMonotonic: { count: rampOrder.length, items: cap(rampOrder) },
  tokenPairContrastBelow4_5: { count: contrastFail.length, pairCount: pairs.length, items: cap(contrastFail) }, declaredPairsNotFound: cap(contrastMissing),
  fontSizeBelowFloor: { count: tinyFont.length, items: cap(tinyFont) }, semanticMissingDescription: { count: noDesc.length, items: cap(noDesc) },
};
if (primScoped.length) out.proposals.push(`set empty scopes on ${primScoped.length} primitive variables — primitives carry no role, designers pick semantic variables only (references/tokens.md §2.1)`);
if (scopeRole.length) out.proposals.push(`${scopeRole.length} semantic variables have scopes that do not match the role in their name — e.g. text/* → TEXT_FILL`);
if (rawSemantic.length) out.proposals.push(`${rawSemantic.length} semantic-tier color variables hold a raw color — point them at a primitive step`);
if (rampGap.length || rampOrder.length) out.proposals.push(`color ramps: ${rampGap.length} missing steps · ${rampOrder.length} not decreasing evenly (references/tokens.md §2.8)`);
if (contrastFail.length) out.proposals.push(`${contrastFail.length} text / background pairs below 4.5:1 — fix by shifting L on one side (references/tokens.md §2.4)`);
if (unused.length) out.proposals.push(`delete ${unused.length} unused variables — re-run after auditing every page; keep variables reserved for dev / modes not built yet`);
if (dupe.length) out.proposals.push(`merge ${dupe.length} groups of duplicate-value variables — keep the variable named at the right tier (alias / mapped), merge the others into it`);
if (near.length) out.proposals.push(`${near.length} near-duplicate color pairs — usually one color entered twice; the designer picks which to keep`);
if (allScopes.length) out.proposals.push(`set scopes on ${allScopes.length} variables that are "used everywhere" — background colors: FRAME_FILL, SHAPE_FILL · text: TEXT_FILL · spacing: GAP · radius: CORNER_RADIUS`);
if (primitiveOnScreen.length) out.proposals.push(`${primitiveOnScreen.length} places on screens bind a primitive directly — switch to the matching mapped variable (scripts/bind.js, BIND_TARGET mapped)`);
if (broken.length) out.proposals.push(`${broken.length} aliases point to a variable that no longer exists — re-point or delete`);

// ───────────────────────── styles
const styleLists = { paint: await figma.getLocalPaintStylesAsync(), text: await figma.getLocalTextStylesAsync(), effect: await figma.getLocalEffectStylesAsync() };
for (const [k, list] of Object.entries(styleLists)) {
  const un = list.filter(s => !useStyle.has(s.id)).map(s => s.name);
  const sig = new Map();
  for (const s of list) {
    const key = k === "text" ? JSON.stringify([s.fontName, s.fontSize, s.lineHeight, s.letterSpacing]) : JSON.stringify(k === "paint" ? s.paints : s.effects);
    if (!sig.has(key)) sig.set(key, []); sig.get(key).push(s.name);
  }
  out.styles[k] = { total: list.length, unused: { count: un.length, items: cap(un) }, duplicates: cap([...sig.values()].filter(g => g.length > 1)) };
  if (k === "text") out.styles.text.sizeBelowFloor = cap(list.filter(s => s.fontSize < CONFIG.MIN_FONT_SIZE).map(s => `${s.name} ${s.fontSize}`));
}

// ───────────────────────── components — report only (main components are not edited)
const comps = [], sets = [];
for (const page of pages) for (const n of page.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })) {
  if (n.type === "COMPONENT_SET") sets.push(n); else if (!(n.parent && n.parent.type === "COMPONENT_SET")) comps.push(n);
}
const noInstance = [];
for (const c of [...sets, ...comps].slice(0, CONFIG.MAX_COMPONENTS)) {
  const kids = c.type === "COMPONENT_SET" ? c.children : [c];
  let n = 0; for (const k of kids) { try { n += (await k.getInstancesAsync()).length; } catch (e) { n = -1; break; } }
  if (n === 0) noInstance.push(c.name);
}
if (sets.length + comps.length > CONFIG.MAX_COMPONENTS) out.caveats.push(`instances counted for only ${CONFIG.MAX_COMPONENTS} / ${sets.length + comps.length} components (MAX_COMPONENTS)`);
// variant properties: same meaning, different name (State / Status), values differing only in case (Default / default)
const propNames = new Map(), valueCase = [];
for (const s of sets) {
  let defs = {}; try { defs = s.componentPropertyDefinitions || {}; } catch (e) {}
  for (const [name, d] of Object.entries(defs)) {
    if (d.type !== "VARIANT") continue;
    const key = name.toLowerCase().replace(/[^a-z]/g, "").replace(/^status$/, "state").replace(/s$/, "");
    if (!propNames.has(key)) propNames.set(key, new Set()); propNames.get(key).add(name);
    const opts = d.variantOptions || [], low = new Map();
    for (const o of opts) { const l = o.toLowerCase(); if (low.has(l) && low.get(l) !== o) valueCase.push(`${s.name} › ${name}: "${low.get(l)}" / "${o}"`); low.set(l, o); }
  }
}
const propClash = [...propNames.values()].filter(x => x.size > 1).map(x => [...x].join(" / "));
let looksDetached = [];
const GENERIC = /^(content|container|top container|bottom container|frame|group|header|footer|body|wrapper|row|item|text|icon|left|right|stack|title|label|card|list|section)$/i;   // without this, 1304 "Content" frames were reported
const compNames = new Set([...sets, ...comps].map(c => c.name.toLowerCase()).filter(n => !GENERIC.test(n)));
// detach: the official `detachedInfo` property (work-with-design-systems) — guess by name only when the API lacks it
let hasDetachedApi = false; const detached = [];
for (const page of pages) for (const f of page.findAllWithCriteria({ types: ["FRAME"] })) {
  if ("detachedInfo" in f) { hasDetachedApi = true; if (f.detachedInfo) detached.push(`${page.name} › ${f.name}`); }
  else if (compNames.has(f.name.toLowerCase())) looksDetached.push(`${page.name} › ${f.name}`);
}
if (hasDetachedApi) looksDetached = detached;
// inside components (main + variants): unbound values, text styles, auto layout, TEXT property, hand-typed opacity, default names
const inside = { unboundValues: [], textWithoutStyle: [], missingAutoLayout: [], textWithoutProperty: [], manualOpacity: [], defaultLayerNames: [] };
const variantIssue = { defaultNames: [], overlapping: [], matrixMismatch: [], tooMany: [], iconsAsVariants: [], missingDescription: [] };
const DEFAULT_NAME = /^(Frame|Rectangle|Group|Ellipse|Vector|Line|Polygon|Star|Component|Text) \d+$/;
if (CONFIG.COMPONENT_SCAN) {
  const roots = [...sets, ...comps].slice(0, CONFIG.MAX_COMPONENTS);
  for (const root of roots) {
    if (!root.description && !(root.parent && root.parent.type === "COMPONENT_SET")) variantIssue.missingDescription.push(root.name);
    if (root.type === "COMPONENT_SET") {
      const kids = root.children.filter(k => k.type === "COMPONENT");
      if (kids.some(k => /^(Property \d+|Variant\d*|Component \d+)/.test(k.name) || /Property \d+=/.test(k.name))) variantIssue.defaultNames.push(root.name);
      const pos = new Map(); for (const k of kids) { const key = Math.round(k.x) + ":" + Math.round(k.y); pos.set(key, (pos.get(key) || 0) + 1); }
      if ([...pos.values()].some(n => n > 1)) variantIssue.overlapping.push(root.name);
      let defs = {}; try { defs = root.componentPropertyDefinitions || {}; } catch (e) {}
      const vprops = Object.values(defs).filter(d => d.type === "VARIANT");
      const expect = vprops.reduce((a, d) => a * ((d.variantOptions || []).length || 1), 1);
      if (vprops.length && expect !== kids.length) variantIssue.matrixMismatch.push(`${root.name}: ${kids.length} / ${expect} combinations`);
      if (kids.length > 30) variantIssue.tooMany.push(`${root.name}: ${kids.length} variants`);
      if (CONFIG.ICON_SET.test(root.name) && kids.length > CONFIG.ICON_VARIANT_MAX) variantIssue.iconsAsVariants.push(`${root.name}: ${kids.length} variants — use instance swap`);
    }
    const mains = root.type === "COMPONENT_SET" ? root.children.filter(k => k.type === "COMPONENT") : [root];
    for (const mc of mains) {
      const label = root === mc ? mc.name : `${root.name} › ${mc.name}`;
      if (mc.layoutMode === "NONE" && (mc.children || []).length > 1 && !CONFIG.ICON_SET.test(root.name)) inside.missingAutoLayout.push(label);
      for (const n of [mc, ...mc.findAll(() => true)]) {
        if (n.type === "INSTANCE" || (n.parent && n.parent.type === "INSTANCE")) continue;          // issues inside nested instances are fixed in their own component
        const B = n.boundVariables || {};
        for (const f of ["fills", "strokes"]) if (Array.isArray(n[f])) for (const pnt of n[f]) if (pnt.visible !== false && pnt.type === "SOLID" && !(pnt.boundVariables && pnt.boundVariables.color) && !(f === "fills" ? n.fillStyleId : n.strokeStyleId)) { inside.unboundValues.push(`${label} › ${n.name} (${f === "fills" ? "fill" : "stroke"} ${hex(pnt.color)})`); break; }
        for (const k of ["cornerRadius", "paddingLeft", "paddingTop", "itemSpacing"]) if (typeof n[k] === "number" && n[k] > 0 && !B[k] && !(k === "cornerRadius" && B.topLeftRadius)
            && !(k === "itemSpacing" && n.primaryAxisAlignItems === "SPACE_BETWEEN")                                   // space-between: the gap has no effect
            && !(k === "cornerRadius" && n[k] >= Math.min(n.width, n.height) / 2)) {                                    // fully rounded (pill) — no variable needed
          inside.unboundValues.push(`${label} › ${n.name} (${k} ${n[k]})`); break;
        }
        const glyph = n.type === "TEXT" && /^[\uE000-\uF8FF\u{F0000}-\u{10FFFF}\s]+$/u.test(n.characters || "");   // SF Symbols icon typed as a character — no text style / property needed
        if (n.type === "TEXT" && !glyph) {
          if (!n.textStyleId) inside.textWithoutStyle.push(`${label} › ${n.name}`);
          if (!(n.componentPropertyReferences && n.componentPropertyReferences.characters)) inside.textWithoutProperty.push(`${label} › ${n.name}`);
        }
        if (typeof n.opacity === "number" && n.opacity < 1 && n.opacity > 0 && !B.opacity) inside.manualOpacity.push(`${label} › ${n.name} (${n.opacity})`);
        if (DEFAULT_NAME.test(n.name)) inside.defaultLayerNames.push(`${label} › ${n.name}`);
      }
    }
  }
}
out.components = { sets: sets.length, standalone: comps.length, noInstances: { count: noInstance.length, items: cap(noInstance) },
  variantPropertyNameClash: cap(propClash), variantValueCaseClash: cap(valueCase),
  [hasDetachedApi ? "detached" : "framesNamedLikeComponent_maybeDetached"]: { count: looksDetached.length, items: cap(looksDetached) },
  inside: Object.fromEntries(Object.entries(inside).map(([k, a]) => [k, { count: a.length, items: cap(a) }])),
  variants: Object.fromEntries(Object.entries(variantIssue).map(([k, a]) => [k, { count: a.length, items: cap(a) }])) };
if (inside.unboundValues.length) out.proposals.push(`${inside.unboundValues.length} values inside components are not bound — bind to semantic variables (atoms are where the system spreads to every screen — references/atomic-design.md §5.1)`);
if (inside.textWithoutStyle.length) out.proposals.push(`${inside.textWithoutStyle.length} text layers inside components have no text style`);
if (variantIssue.matrixMismatch.length || variantIssue.overlapping.length || variantIssue.defaultNames.length) out.proposals.push(`variants: ${variantIssue.matrixMismatch.length} sets with missing/extra combinations · ${variantIssue.overlapping.length} sets with overlapping variants · ${variantIssue.defaultNames.length} sets still using default names`);
if (propClash.length) out.proposals.push(`unify variant property names: ${propClash.slice(0, 5).join(" · ")} — the designer fixes this on the main component`);
if (looksDetached.length) out.proposals.push(hasDetachedApi ? `${looksDetached.length} frames are detached instances (detachedInfo) — replace them with instances` : `${looksDetached.length} frames share a component's name — possibly detached instances; designer to review`);

// ───────────────────────── approved fixes
if (CONFIG.APPLY.length) {
  const done = [], refused = [];
  for (const a of CONFIG.APPLY) {
    const v = await figma.variables.getVariableByIdAsync(a.id || a.from);
    if (!v) { refused.push({ ...a, reason: "variable not found" }); continue; }
    if (a.type === "scope") { if (!CONFIG.DRY_RUN) v.scopes = a.scopes; done.push(`${v.name}: scopes → ${a.scopes.join(", ")}`); }
    else if (a.type === "rename") { if (!CONFIG.DRY_RUN) v.name = a.name; done.push(`${v.name} → ${a.name}`); }
    else if (a.type === "delete") {
      if (useVar.has(v.id)) { refused.push({ ...a, reason: `still ${useVar.get(v.id).length} uses` }); continue; }
      if (CONFIG.PAGES) { refused.push({ ...a, reason: "only some pages audited — audit every page before deleting" }); continue; }
      if (!CONFIG.DRY_RUN) v.remove(); done.push(`delete ${v.name}`);
    } else if (a.type === "merge") {
      const to = await figma.variables.getVariableByIdAsync(a.to);
      if (!to || to.resolvedType !== v.resolvedType) { refused.push({ ...a, reason: "target variable missing or of a different type" }); continue; }
      if (CONFIG.PAGES) { refused.push({ ...a, reason: "only some pages audited — merging needs every page audited" }); continue; }
      if (mixedText) { refused.push({ ...a, reason: `${mixedText} multi-color text layers could not be counted — a merge could miss uses` }); continue; }
      const uses = useVar.get(v.id) || [];
      if (!CONFIG.DRY_RUN) for (const u of uses) {
        if (u.alias) { const owner = vById.get(u.alias); for (const [mid, val] of Object.entries(owner.valuesByMode)) if (val && val.type === "VARIABLE_ALIAS" && val.id === v.id) owner.setValueForMode(mid, figma.variables.createVariableAlias(to)); continue; }
        const n = await figma.getNodeByIdAsync(u.node); if (!n) continue;
        if (u.kind === "field") n.setBoundVariable(u.field, to);
        else if (u.kind === "paint") { const ps = n[u.field].slice(); ps[u.index] = figma.variables.setBoundVariableForPaint(ps[u.index], "color", to); n[u.field] = ps; }
        else if (u.kind === "effect") { const es = n.effects.slice(); for (const f of Object.keys(es[u.index].boundVariables || {})) es[u.index] = figma.variables.setBoundVariableForEffect(es[u.index], f, to); n.effects = es; }
      }
      if (!CONFIG.DRY_RUN) v.remove();
      done.push(`merge ${v.name} → ${to.name} (${uses.length} uses rebound)`);
    } else refused.push({ ...a, reason: "unsupported fix type" });
  }
  out.fix = { mode: CONFIG.DRY_RUN ? "DRY RUN — nothing changed" : "CHANGED", done, refused };
}
return out;
