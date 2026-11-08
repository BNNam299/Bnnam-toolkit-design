// kit-snapshot.js — SNAPSHOT OF THE FILE'S KIT: variables (every collection, mode, value, alias, scope, description), text / effect styles,
// components (set, variants, properties, description). READ ONLY. Kit setup (references/kit-setup.md): snapshot when the base kit has just been
// duplicated → design/kit/kit-goc.json; snapshot again after refining → scripts/kit_diff.py shows "what the project changed vs the base kit".
// Near-DTCG JSON ($type / $value / $description).
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  COMPONENT_PAGES: /component|foundation|design system|library|atom|icon/i,   // pages holding the kit's components — null = every page (slow on big files)
  INCLUDE_COMPONENTS: true,
  MAX_COMPONENTS: 2000,
  ICON_MAX: 64,                    // standalone components ≤ 64×64 count as icons — counted, not listed (4501 icons once made a 254 KB snapshot)
};
const rx = x => (x == null || x instanceof RegExp ? x : new RegExp(String(x), "i"));
CONFIG.COMPONENT_PAGES = rx(CONFIG.COMPONENT_PAGES);
const hex = c => "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase() + (typeof c.a === "number" && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, "0").toUpperCase() : "");
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const vById = new Map(vars.map(v => [v.id, v]));
const cById = new Map(collections.map(c => [c.id, c]));
const val = v => (v && v.type === "VARIABLE_ALIAS" ? { $alias: (() => { const t = vById.get(v.id); return t ? `${cById.get(t.variableCollectionId).name}/${t.name}` : `?${v.id}`; })() }
  : v && typeof v === "object" && typeof v.r === "number" ? hex(v) : v);
const snap = { $schema: "bnnam-kit-snapshot/1 (near DTCG 2025.10)", file: figma.root.name, takenAt: new Date().toISOString(), collections: [], textStyles: [], effectStyles: [], components: [] };
for (const c of collections) {
  snap.collections.push({
    name: c.name, modes: c.modes.map(m => m.name),
    variables: c.variableIds.map(id => vById.get(id)).filter(Boolean).map(v => ({
      name: v.name, $type: v.resolvedType, scopes: v.scopes || [], $description: v.description || "",
      $value: Object.fromEntries(c.modes.map(m => [m.name, val(v.valuesByMode[m.modeId])])),
    })),
  });
}
for (const s of await figma.getLocalTextStylesAsync())
  snap.textStyles.push({ name: s.name, font: `${s.fontName.family} ${s.fontName.style}`, size: s.fontSize,
    lineHeight: s.lineHeight.unit === "AUTO" ? "auto" : `${Math.round(s.lineHeight.value * 100) / 100}${s.lineHeight.unit === "PERCENT" ? "%" : ""}`,
    letterSpacing: `${Math.round(s.letterSpacing.value * 100) / 100}${s.letterSpacing.unit === "PERCENT" ? "%" : ""}`, $description: s.description || "" });
for (const s of await figma.getLocalEffectStylesAsync()) snap.effectStyles.push({ name: s.name, effects: s.effects.map(e => e.type) });
if (CONFIG.INCLUDE_COMPONENTS) {
  let n = 0;
  for (const page of figma.root.children) {
    if (CONFIG.COMPONENT_PAGES && !CONFIG.COMPONENT_PAGES.test(page.name)) continue;
    await page.loadAsync();
    const all = page.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] }).filter(c => !(c.type === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET"));
    const icons = all.filter(c => c.type === "COMPONENT" && c.width <= CONFIG.ICON_MAX && c.height <= CONFIG.ICON_MAX);
    snap.iconCount = (snap.iconCount || 0) + icons.length;
    const ordered = [...all.filter(c => c.type === "COMPONENT_SET"), ...all.filter(c => c.type === "COMPONENT" && !icons.includes(c))];   // sets first
    for (const c of ordered) {
      if (++n > CONFIG.MAX_COMPONENTS) break;
      let props = {};
      try { props = Object.fromEntries(Object.entries(c.componentPropertyDefinitions || {}).map(([k, d]) => [k.replace(/#\d+:\d+$/, ""), d.type === "VARIANT" ? { type: "VARIANT", options: d.variantOptions } : { type: d.type, default: d.defaultValue }])); } catch (e) {}
      snap.components.push({ name: c.name, page: page.name, kind: c.type === "COMPONENT_SET" ? "set" : "component", $description: c.description || "",
        variants: c.type === "COMPONENT_SET" ? c.children.length : 1, properties: props, w: Math.round(c.width), h: Math.round(c.height) });
    }
  }
  if (n > CONFIG.MAX_COMPONENTS) snap.incomplete = `only ${CONFIG.MAX_COMPONENTS} components captured (MAX_COMPONENTS)`;
}
snap.summary = { collections: snap.collections.length, variables: vars.length, textStyles: snap.textStyles.length, effectStyles: snap.effectStyles.length, components: snap.components.length, icons: snap.iconCount || 0 };
return snap;
