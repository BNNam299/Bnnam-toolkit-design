// bind.js — fixing legacy work: bind hard-coded values to the file's system (references/system-binding.md §1–4).
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
// DEFAULT DRY_RUN = true — reads only and reports what would change. Dry-run ONE screen, read the report, only then set false.
// Principles: bind only on an exact match · no match → REPORT (onMismatch = report) · never create variables · skip glyphs (text style),
//             visual_… zones, nodes inside instances (fix those in the main component) · bind only to the collection meant for design.

const CONFIG = {
  DRY_RUN: true,
  PAGE: "5. UI Design",                  // project settings › UI page
  SCREEN_NAMES: [],                      // REQUIRED — e.g. ["Home_Result"]. Empty = does not run
  MODE: null,                            // mode name used to compare values (e.g. "Light") · null = the collection's default mode
  BIND_TARGET: "mapped",                 // project settings › bind target — colors bind only to this collection
  COLOR_PREFIX: { text: "content/", surface: "surface/", border: "border/" },   // project settings › color prefixes
  // patterns "<collection>/<variable name>" with * — project settings › spacing / radius / stroke width · "none" = the file has none
  SPACING: "none", RADIUS: "none", STROKE_WIDTH: "none",
  EFFECTS: true,                         // project settings › effects ≠ none
  ON_MISMATCH: "report",                 // project settings › onMismatch — "report" | "snap-nearest" (applies to text styles only)
  GLYPH_RANGES: [[0xE000, 0xF8FF], [0xF0000, 0x10FFFF]],
  WHAT: { fill: true, stroke: true, text: true, spacing: true, radius: true, strokeWeight: true, effect: true },
  // layers the designer edited by hand — from the designer-edit comparison (figma-project-maintain). Left alone unless the designer says to
  // bind them too (bnnam-standards team-rules §12 — designer edits win)
  DESIGNER_EDITED_IDS: [],
  EDIT_SUFFIX: "Fix",                    // project settings › edit suffix
  TEMPLATE_FRAMES: [],                   // project settings › template screen — never bound
};

if (!CONFIG.SCREEN_NAMES.length) return { stop: "SCREEN_NAMES is empty — pick one screen for a dry run first (run one sample first)" };
{
  const fix = CONFIG.SCREEN_NAMES.filter(n => n.endsWith("_" + CONFIG.EDIT_SUFFIX));
  const tpl = CONFIG.SCREEN_NAMES.filter(n => CONFIG.TEMPLATE_FRAMES.includes(n));
  if (fix.length) return { stop: `copies the designer is editing: ${fix.join(", ")} — not bound; learn from the designer's edit first (team-rules §12)` };
  if (tpl.length) return { stop: `template screen: ${tpl.join(", ")} — not bound (frame-standards §4)` };
}

// ───────────────────────── recognition
const num = x => typeof x === "number";
const isGlyphIcon = n => {
  if (n.type !== "TEXT") return false;
  const t = (n.characters || "").trim();
  if (!t || t.length > 3) return false;
  for (const ch of t) { const c = ch.codePointAt(0); if (CONFIG.GLYPH_RANGES.some(([a, b]) => c >= a && c <= b)) return true; }
  return false;
};
const skipReason = (n, screen) => {
  for (let p = n; p && p !== screen; p = p.parent) if (/^visual_/i.test(p.name)) return "visual zone";
  for (let p = n.parent; p && p !== screen; p = p.parent) if (p.type === "INSTANCE") return "inside an instance";
  if (/^image_/i.test(n.name)) return "image placeholder";
  return null;
};
const glob = pat => new RegExp("^" + pat.split("*").map(s => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$", "i");

// ───────────────────────── variables and values
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collById = new Map(collections.map(c => [c.id, c]));
const vars = await figma.variables.getLocalVariablesAsync();
const varById = new Map(vars.map(v => [v.id, v]));
function valueOf(v, guard = 0) {
  const c = collById.get(v.variableCollectionId);
  if (!c || guard > 6) return undefined;
  const mode = (CONFIG.MODE && c.modes.find(m => m.name === CONFIG.MODE)) || c.modes.find(m => m.modeId === c.defaultModeId);
  const val = v.valuesByMode[mode.modeId];
  if (val && val.type === "VARIABLE_ALIAS") { const t = varById.get(val.id); return t ? valueOf(t, guard + 1) : undefined; }
  return val;
}
const filled = v => { const c = collById.get(v.variableCollectionId); return c.modes.every(m => v.valuesByMode[m.modeId] !== undefined && v.valuesByMode[m.modeId] !== null); };
const target = collections.find(c => c.name === CONFIG.BIND_TARGET);
if (CONFIG.WHAT.fill || CONFIG.WHAT.stroke) if (!target) return { stop: `collection "${CONFIG.BIND_TARGET}" not found — check the project's bind target` };

const colorPool = role => vars.filter(v => target && v.variableCollectionId === target.id && v.resolvedType === "COLOR"
  && v.name.startsWith(CONFIG.COLOR_PREFIX[role])).map(v => ({ v, c: valueOf(v) })).filter(x => x.c);
const pools = { text: colorPool("text"), surface: colorPool("surface"), border: colorPool("border") };
const floatPool = pat => pat === "none" ? [] : vars.filter(v => v.resolvedType === "FLOAT"
  && glob(pat).test(`${collById.get(v.variableCollectionId).name}/${v.name}`)).map(v => ({ v, x: valueOf(v) })).filter(p => num(p.x));
const fp = { spacing: floatPool(CONFIG.SPACING), radius: floatPool(CONFIG.RADIUS), strokeWeight: floatPool(CONFIG.STROKE_WIDTH) };

const sameColor = (a, b, alpha) => Math.abs(a.r - b.r) < 0.6 / 255 && Math.abs(a.g - b.g) < 0.6 / 255 && Math.abs(a.b - b.b) < 0.6 / 255
  && Math.abs((b.a === undefined ? 1 : b.a) - alpha) < 0.01;
const hex = c => "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");

// text styles keyed by size/weight — exact match (references/system-binding.md §3)
const TS = {};
const textStyles = await figma.getLocalTextStylesAsync();
for (const st of textStyles) TS[`${Math.round(st.fontSize)}/${st.fontName.style}`] = st;
const RANK = { thin: 1, hairline: 1, extralight: 2, ultralight: 2, light: 3, regular: 4, book: 4, normal: 4, medium: 5,
  semibold: 6, demibold: 6, bold: 7, extrabold: 8, heavy: 9, black: 9 };
const rank = style => RANK[String(style).toLowerCase().replace(/[\s_-]/g, "").replace("italic", "")] || 4;
const nearestStyle = (size, weight) => {
  let best = null, bs = Infinity;
  for (const st of textStyles) {
    const score = Math.abs(st.fontSize - size) * 10 + Math.abs(rank(st.fontName.style) - rank(weight));   // size outweighs weight
    if (score < bs) { bs = score; best = st; }
  }
  return best;
};
const effectStyles = CONFIG.EFFECTS ? await figma.getLocalEffectStylesAsync() : [];
const effKey = effs => JSON.stringify(effs.filter(e => e.visible !== false).map(e => [e.type, Math.round(e.radius || 0),
  e.offset ? [Math.round(e.offset.x), Math.round(e.offset.y)] : null, Math.round(e.spread || 0), e.color ? hex(e.color) + (e.color.a ?? 1).toFixed(2) : null]));
const effByKey = new Map(effectStyles.map(s => [effKey(s.effects), s]));

// ───────────────────────── run
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();
const screens = [];
(function walk(c) { for (const k of c.children) { if (k.type === "SECTION") walk(k); else if (k.type === "FRAME" && CONFIG.SCREEN_NAMES.includes(k.name)) screens.push(k); } })(page);
const missing = CONFIG.SCREEN_NAMES.filter(n => !screens.some(s => s.name === n));

const changed = {}, alreadyOk = {}, notHandled = {}, mismatch = {}, failed = [];
const mutated = new Set();
const bump = (m, k) => { m[k] = (m[k] || 0) + 1; };
const miss = (kind, key) => { (mismatch[kind] = mismatch[kind] || {}); mismatch[kind][key] = (mismatch[kind][key] || 0) + 1; };

async function bindPaints(n, prop, role, kind) {
  const paints = n[prop];
  if (!Array.isArray(paints) || !paints.length) return;
  const next = [...paints];
  let touched = false;
  for (let i = 0; i < next.length; i++) {
    const p = next[i];
    if (p.type !== "SOLID" || p.visible === false) continue;
    if (p.boundVariables && p.boundVariables.color) { bump(alreadyOk, kind); continue; }
    const alpha = p.opacity === undefined ? 1 : p.opacity;
    const hit = pools[role].find(x => sameColor(p.color, x.c, alpha)) || pools[role].find(x => sameColor(p.color, x.c, 1) && alpha === 1);
    if (!hit) { miss(kind, `${role} ${hex(p.color)}${alpha < 1 ? " @" + alpha : ""}`); continue; }
    if (!filled(hit.v)) { bump(notHandled, `${kind}: variable ${hit.v.name} has no value in one mode`); continue; }
    let np = figma.variables.setBoundVariableForPaint({ ...p }, "color", hit.v);   // spread — keeps blend mode, visible
    if ((hit.c.a ?? 1) < 1) np = { ...np, opacity: 1 };                            // the alpha already lives in the variable
    next[i] = np; touched = true; bump(changed, kind);
  }
  if (touched && !CONFIG.DRY_RUN) { n[prop] = next; mutated.add(n.id); }
}
async function bindFloat(n, field, pool, kind, fields) {
  const val = n[field];
  if (!num(val) || val <= 0) return;
  const B = n.boundVariables || {};
  if (B[fields ? fields[0] : field]) { bump(alreadyOk, kind); return; }
  const hit = pool.find(p => Math.abs(p.x - val) < 0.01);
  if (!hit) { miss(kind, String(val)); return; }
  if (!filled(hit.v)) { bump(notHandled, `${kind}: variable ${hit.v.name} has no value in one mode`); return; }
  bump(changed, kind);
  if (!CONFIG.DRY_RUN) { for (const f of fields || [field]) n.setBoundVariable(f, hit.v); mutated.add(n.id); }
}

for (const screen of screens) {
  for (const n of [screen, ...screen.findAll(() => true)]) {
    const why = skipReason(n, screen);
    if (why) { bump(notHandled, `skipped — ${why}`); continue; }
    if (CONFIG.DESIGNER_EDITED_IDS.includes(n.id)) { bump(notHandled, "skipped — edited by hand by the designer"); continue; }
    try {
      const isText = n.type === "TEXT";
      const glyph = isGlyphIcon(n);
      if (CONFIG.WHAT.fill && n !== screen) await bindPaints(n, "fills", isText ? "text" : "surface", "fill");
      if (CONFIG.WHAT.stroke) await bindPaints(n, "strokes", "border", "stroke");

      if (isText && CONFIG.WHAT.text && !glyph) {                     // glyphs never get a text style
        if (n.textStyleId) bump(alreadyOk, "text");
        else if (n.fontName === figma.mixed || !num(n.fontSize)) bump(notHandled, "text: mixed font or size — handle by hand");
        else {
          const key = `${Math.round(n.fontSize)}/${n.fontName.style}`;
          let st = TS[key];
          if (!st && CONFIG.ON_MISMATCH === "snap-nearest") st = nearestStyle(n.fontSize, n.fontName.style);
          if (!st) miss("text", key);
          else {
            bump(changed, "text");
            if (!CONFIG.DRY_RUN) {
              await figma.loadFontAsync(n.fontName);
              await figma.loadFontAsync(st.fontName);
              await n.setTextStyleIdAsync(st.id);
              mutated.add(n.id);
            }
          }
        }
      }
      if (n.layoutMode && n.layoutMode !== "NONE" && CONFIG.WHAT.spacing)
        for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "itemSpacing"]) await bindFloat(n, k, fp.spacing, "spacing");
      if (CONFIG.WHAT.radius && num(n.cornerRadius))
        await bindFloat(n, "cornerRadius", fp.radius, "radius", ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]);
      if (CONFIG.WHAT.strokeWeight && Array.isArray(n.strokes) && n.strokes.length) await bindFloat(n, "strokeWeight", fp.strokeWeight, "strokeWeight");
      if (CONFIG.WHAT.effect && CONFIG.EFFECTS && Array.isArray(n.effects) && n.effects.length) {
        if (n.effectStyleId) bump(alreadyOk, "effect");
        else {
          const st = effByKey.get(effKey(n.effects));
          if (!st) miss("effect", effKey(n.effects).slice(0, 80));
          else { bump(changed, "effect"); if (!CONFIG.DRY_RUN) { await n.setEffectStyleIdAsync(st.id); mutated.add(n.id); } }
        }
      }
    } catch (e) {
      failed.push({ node: n.name, id: n.id, error: String(e && e.message || e) });   // count and report — batch discipline
    }
  }
}

return {
  mode: CONFIG.DRY_RUN ? "DRY RUN — nothing written" : "WRITTEN",
  screens: screens.map(s => s.name), screensNotFound: missing,
  "Changed": changed,                       // in a dry run: how many would change
  "Skipped (already correct)": alreadyOk,
  "Not handled": notHandled,
  "No match in the system — report so it can be added": mismatch,   // grouped by value with counts (references/system-binding.md §4)
  runErrors: failed,
  mutatedNodeIds: [...mutated],
};
