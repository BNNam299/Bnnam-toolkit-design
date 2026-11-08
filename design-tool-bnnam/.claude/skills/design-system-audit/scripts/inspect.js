// inspect.js — READ ONLY. Reads the "shape signature" of existing components: radius, fill, border, shadow, height, padding, type.
// Use when: style reading compares existing atoms with the style ref (references/style-read.md §9) · the component spec's inventory (§1).
// Never edits a component — main components are not touched (bnnam-standards team-rules §12.4).
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  PAGE: "Components",              // project settings › atom location (scripts/detect.js › components.atomicLocation)
  NAMES: [],                       // empty = every component / component set on the page · or ["Button/Primary", "Input"]
  VARIANT: "default",              // "default" = the set's first variant · "all" = every variant
  MAX: 60,
};
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on TEXT throws in real Figma — check type first, use `in`

const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found — detect again with scripts/detect.js` };
await page.loadAsync();

const varName = new Map(), styleName = new Map();
const vName = async id => { if (!varName.has(id)) { const v = await figma.variables.getVariableByIdAsync(id); varName.set(id, v ? v.name : `?${id}`); } return varName.get(id); };
const sName = async id => { if (!id || id === figma.mixed) return id === figma.mixed ? "MIXED" : null; if (!styleName.has(id)) { const s = await figma.getStyleByIdAsync(id); styleName.set(id, s ? s.name : `?${id}`); } return styleName.get(id); };
const hex = c => "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const r1 = x => (typeof x === "number" ? Math.round(x * 10) / 10 : x === figma.mixed ? "MIXED" : x);
async function paint(list) {
  if (!Array.isArray(list)) return list === figma.mixed ? "MIXED" : null;
  const p = list.find(f => f.visible !== false);
  if (!p) return "none";
  if (p.type !== "SOLID") return p.type === "GRADIENT_LINEAR" ? "gradient" : p.type.toLowerCase();
  const b = p.boundVariables && p.boundVariables.color;
  const op = typeof p.opacity === "number" && p.opacity < 1 ? ` @${Math.round(p.opacity * 100)}%` : "";
  return (b ? `var:${await vName(b.id)}` : hex(p.color)) + op;
}
const bound = async (n, f) => { const b = n.boundVariables && n.boundVariables[f]; return b && b.id ? `var:${await vName(b.id)}` : undefined; };

// shape: pill when the radius ≥ half the height
function shape(n) {
  if (!("cornerRadius" in n)) return null;
  const r = n.cornerRadius;
  if (r === figma.mixed) return "different radius per corner";
  if (!r) return "square";
  return r >= Math.min(n.width, n.height) / 2 - 0.5 ? "pill / round" : `radius ${r1(r)}`;
}
async function signature(n) {
  const s = { size: `${Math.round(n.width)}×${Math.round(n.height)}`, shape: shape(n) };
  const rb = await bound(n, "topLeftRadius"); if (rb) s.radius = rb;
  s.fill = "fills" in n ? await paint(n.fills) : null;
  if ("strokes" in n && n.strokes && n.strokes.length) s.border = `${await paint(n.strokes)} · ${r1(n.strokeWeight)}`;
  else s.border = "none";
  const eff = (n.effects || []).filter(e => e.visible !== false);
  if (n.effectStyleId) s.shadow = `style:${await sName(n.effectStyleId)}`;
  else s.shadow = eff.length ? eff.map(e => `${e.type === "DROP_SHADOW" ? "drop shadow" : e.type === "INNER_SHADOW" ? "inner shadow" : e.type === "LAYER_BLUR" ? "layer blur" : "background blur"} ${r1(e.radius || 0)}`).join(" + ") : "none";
  if (n.layoutMode && n.layoutMode !== "NONE") {
    const pad = []; for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) pad.push((await bound(n, k)) || r1(n[k] || 0));
    s.padding = pad.join(" "); s.gap = (await bound(n, "itemSpacing")) || r1(n.itemSpacing || 0);
  }
  const texts = canFind(n) ? n.findAll(x => x.type === "TEXT") : [];
  if (texts.length) {
    const t = texts[0];
    s.text = (await sName(t.textStyleId)) || `${r1(t.fontSize)} ${t.fontName && t.fontName !== figma.mixed ? t.fontName.style : ""}`.trim();
    s.textColor = await paint(t.fills);
  }
  const insts = canFind(n) ? n.findAll(x => x.type === "INSTANCE") : [];
  if (insts.length) { const names = new Set(); for (const i of insts.slice(0, 10)) { const m = await i.getMainComponentAsync(); if (m) names.add(m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name); } s.contains = [...names]; }
  return s;
}

const tops = page.findAll(n => (n.type === "COMPONENT_SET" || (n.type === "COMPONENT" && (!n.parent || n.parent.type !== "COMPONENT_SET"))));
const pick = CONFIG.NAMES.length ? tops.filter(n => CONFIG.NAMES.includes(n.name)) : tops;
const out = { page: page.name, components: [], notFound: CONFIG.NAMES.filter(x => !tops.some(t => t.name === x)) };
for (const c of pick.slice(0, CONFIG.MAX)) {
  if (c.type === "COMPONENT_SET") {
    const vs = CONFIG.VARIANT === "all" ? c.children : c.children.slice(0, 1);
    const rows = [];
    for (const v of vs) rows.push({ variant: v.name, ...(await signature(v)) });
    out.components.push({ name: c.name, variantCount: c.children.length, signature: rows });
  } else out.components.push({ name: c.name, signature: [await signature(c)] });
}
if (pick.length > CONFIG.MAX) out.truncated = `${pick.length - CONFIG.MAX} components not read — narrow NAMES`;
return out;
