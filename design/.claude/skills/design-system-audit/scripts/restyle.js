// restyle.js — REFINES A MAIN COMPONENT to match the style ref. Run ONLY on the designer's explicit order (choice a2 —
// references/style-read.md §9 · bnnam-standards team-rules §12.4). Exactly ONE component, exactly the changes recorded in style.md › Atoms off-style.
//
// DRY_RUN = true (default): changes nothing — reports before → after values, instance count and the screens that will change.
// The designer reviews and says "run it for real" → DRY_RUN = false.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  DRY_RUN: true,
  PAGE: "Components",              // project settings › atom location
  COMPONENT: "",                   // required — component or component set name, exactly as in style.md › Atoms off-style
  VARIANTS: "all",                 // "all" | ["State=Default", "State=Pressed"]
  // declare only the properties to change. Value: a VARIABLE name in the system (preferred — references/system-binding.md) or a number when the system has none
  CHANGES: {
    // radius: "alias/border-radius/full" | 24 | "pill"      ("pill" = half the height, only when the system has no variable)
    // fill: "mapped/surface/brand"                          (color variable)
    // stroke: "none" | "mapped/border/default"
    // strokeWeight: "alias/border-width/1" | 1
    // effect: "none" | "<effect style name>"
    // paddingH: "responsive/spacing/24" | 24 · paddingV: … · gap: …
    // height: 52                                            (fixed height)
  },
  SCREEN_PAGES: [],                // pages whose screens are listed in the impact — project settings › wireframe page, UI page
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

if (!CONFIG.COMPONENT) return { stop: "COMPONENT is empty — use the exact name of the component the designer ordered refined" };
if (!Object.keys(CONFIG.CHANGES).length) return { stop: "CHANGES is empty — copy the changes from style.md › Atoms off-style › proposed refinement" };

const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();
const target = page.findOne(n => (n.type === "COMPONENT_SET" || n.type === "COMPONENT") && n.name === CONFIG.COMPONENT);
if (!target) return { stop: `component "${CONFIG.COMPONENT}" not found on page "${CONFIG.PAGE}"` };
if (target.remote) return { stop: `"${target.name}" is an external library component (remote) — it can't be edited in this file; edit it in the library file` };
const variants = target.type === "COMPONENT_SET"
  ? target.children.filter(v => CONFIG.VARIANTS === "all" || CONFIG.VARIANTS.includes(v.name))
  : [target];

// ── resolve variable / style names
const locals = await figma.variables.getLocalVariablesAsync();
const findVar = name => locals.find(v => v.name === name);
const effStyles = await figma.getLocalEffectStylesAsync();
const unresolved = [];
function val(key, raw) {
  if (typeof raw === "number" || raw === "none" || raw === "pill") return { raw };
  const v = findVar(raw);
  if (!v) { unresolved.push(`${key}: variable "${raw}" not found`); return null; }
  return { v };
}

// ── change plan, per variant
const plan = [];
for (const n of variants) {
  const rows = [];
  for (const [k, raw] of Object.entries(CONFIG.CHANGES)) {
    if (k === "effect") {
      const st = raw === "none" ? null : effStyles.find(s => s.name === raw);
      if (raw !== "none" && !st) { unresolved.push(`effect: effect style "${raw}" not found`); continue; }
      rows.push({ k, before: n.effectStyleId ? "style" : (n.effects || []).length ? `${n.effects.length} effects` : "none", after: raw, apply: async () => {
        if (st) await n.setEffectStyleIdAsync(st.id); else { if (n.effectStyleId) await n.setEffectStyleIdAsync(""); n.effects = []; } } });
      continue;
    }
    const r = val(k, raw); if (!r) continue;
    const setNum = (field, num) => { n[field] = num; };
    const bindOr = (field, num) => r.v ? n.setBoundVariable(field, r.v) : setNum(field, num);
    if (k === "radius") {
      const num = raw === "pill" ? n.height / 2 : r.raw;
      rows.push({ k, before: n.cornerRadius === figma.mixed ? "MIXED" : n.cornerRadius, after: raw, apply: () => {
        for (const f of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]) bindOr(f, num); } });
    } else if (k === "fill" || k === "stroke") {
      const field = k === "fill" ? "fills" : "strokes";
      rows.push({ k, before: (n[field] || []).length ? "yes" : "none", after: raw, apply: async () => {
        if (raw === "none") { n[field] = []; return; }
        if (!r.v) throw new Error(`${k} needs a color variable name`);
        // a fallback color {0,0,0} makes screenshots render black — pass the variable's resolved color
        let c = { r: 0, g: 0, b: 0 }; try { const coll = await figma.variables.getVariableCollectionByIdAsync(r.v.variableCollectionId); let val = r.v.valuesByMode[coll.defaultModeId];
          for (let d = 0; val && val.type === "VARIABLE_ALIAS" && d < 8; d++) { const nx = await figma.variables.getVariableByIdAsync(val.id); const cc = nx && await figma.variables.getVariableCollectionByIdAsync(nx.variableCollectionId); val = nx && cc ? nx.valuesByMode[cc.defaultModeId] : null; }
          if (val && typeof val.r === "number") c = { r: val.r, g: val.g, b: val.b }; } catch (e) {}
        n[field] = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: c }, "color", r.v)];
      } });
    } else if (k === "strokeWeight") {
      rows.push({ k, before: n.strokeWeight, after: raw, apply: () => bindOr("strokeWeight", r.raw) });
    } else if (k === "paddingH" || k === "paddingV") {
      const fs = k === "paddingH" ? ["paddingLeft", "paddingRight"] : ["paddingTop", "paddingBottom"];
      rows.push({ k, before: fs.map(f => n[f]).join("/"), after: raw, apply: () => fs.forEach(f => bindOr(f, r.raw)) });
    } else if (k === "gap") {
      rows.push({ k, before: n.itemSpacing, after: raw, apply: () => bindOr("itemSpacing", r.raw) });
    } else if (k === "height") {
      rows.push({ k, before: Math.round(n.height), after: raw, apply: () => { n.resize(n.width, r.raw); } });
    } else unresolved.push(`${k}: unsupported property — edit by hand or ask the designer`);
  }
  plan.push({ variant: n.name, n, rows });
}
if (unresolved.length) return { stop: "some values could not be resolved — nothing changed", errors: [...new Set(unresolved)] };

// ── impact: instances and screens using this component
const ids = new Set(variants.map(v => v.id));
const affected = new Map(); let instCount = 0;
for (const pn of CONFIG.SCREEN_PAGES) {
  const p = figma.root.children.find(x => x.name === pn);
  if (!p) continue;
  await p.loadAsync();
  for (const i of deepFind(p, x => x.type === "INSTANCE")) {
    const m = await i.getMainComponentAsync();
    if (!m || !ids.has(m.id)) continue;
    instCount++;
    let s = i; while (s.parent && s.parent.type !== "PAGE" && s.parent.type !== "SECTION") s = s.parent;
    affected.set(`${pn} › ${s.name}`, (affected.get(`${pn} › ${s.name}`) || 0) + 1);
  }
}

const report = {
  mode: CONFIG.DRY_RUN ? "DRY RUN — nothing changed" : "CHANGED",
  component: CONFIG.COMPONENT,
  changes: plan.map(p => ({ variant: p.variant, change: p.rows.map(r => `${r.k}: ${r.before} → ${r.after}`) })),
  impact: { instances: instCount, screens: [...affected.entries()].map(([k, v]) => `${k} (${v})`) },
  ...(CONFIG.SCREEN_PAGES.length ? {} : { note: "SCREEN_PAGES is empty — affected screens not listed" }),
};
if (CONFIG.DRY_RUN) return report;

for (const p of plan) for (const r of p.rows) await r.apply();
report.recheck = "run the screen audit (ux-review-handoff/scripts/audit.js) on the screens under impact · check by eye for text overflow and layouts broken by the new sizes";
return report;
