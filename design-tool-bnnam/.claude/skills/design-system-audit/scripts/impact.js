// impact.js — READ ONLY. If this component changes, what changes with it? Run BEFORE every edit to a main component —
// by the designer, under a1 / a2 (restyle.js), or a new component replacing an old one. bnnam-standards team-rules §12.4.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  COMPONENTS: [],                  // required — component or component set names
  PAGES: [],                       // empty = every page (slower on big files)
  MAX_SCREENS: 60,
  MAX_OVERRIDES: 80,               // number of instances with overrides listed in detail
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
if (!CONFIG.COMPONENTS.length) return { stop: "COMPONENTS is empty" };
const pages = CONFIG.PAGES.length ? figma.root.children.filter(p => CONFIG.PAGES.includes(p.name)) : figma.root.children;
for (const p of pages) await p.loadAsync();

// find the target components
const targets = new Map();       // variant / component id → target name
for (const p of pages) for (const n of p.findAll(x => (x.type === "COMPONENT_SET" || x.type === "COMPONENT") && CONFIG.COMPONENTS.includes(x.name))) {
  if (n.type === "COMPONENT_SET") n.children.forEach(v => targets.set(v.id, n.name)); else targets.set(n.id, n.name);
}
const notFound = CONFIG.COMPONENTS.filter(c => ![...targets.values()].includes(c));

const screenOf = n => { let s = n; for (let p = n.parent; p && p.type !== "PAGE"; p = p.parent) { if (p.type === "SECTION") break; s = p; } return s; };
const out = {};
for (const name of CONFIG.COMPONENTS) out[name] = { instances: 0, screens: {}, insideOtherComponents: new Set(), commonOverrides: {}, variantsUsed: {}, overrideDetail: [] };
for (const p of pages) for (const i of deepFind(p, x => x.type === "INSTANCE")) {
  let m; try { m = await i.getMainComponentAsync(); } catch (e) { continue; }
  if (!m || !targets.has(m.id)) continue;
  const name = targets.get(m.id), o = out[name];
  o.instances++;
  o.variantsUsed[m.name] = (o.variantsUsed[m.name] || 0) + 1;
  // an instance inside another component → the edit spreads through that component
  let host = null; for (let q = i.parent; q && q.type !== "PAGE"; q = q.parent) if (q.type === "COMPONENT" || q.type === "COMPONENT_SET") { host = q.type === "COMPONENT" && q.parent && q.parent.type === "COMPONENT_SET" ? q.parent : q; break; }
  if (host) { o.insideOtherComponents.add(host.name); continue; }
  const s = screenOf(i), key = `${p.name} › ${s.name}`;
  o.screens[key] = (o.screens[key] || 0) + 1;
  // overrides: properties the designer set on the instance itself — editing the main component does NOT overwrite them
  const ov = Array.isArray(i.overrides) ? i.overrides : [];
  for (const x of ov) for (const f of x.overriddenFields || []) o.commonOverrides[f] = (o.commonOverrides[f] || 0) + 1;
  // per-instance overrides — changing the component's STRUCTURE (renaming / removing layers) can drop overrides → record them to reapply
  if (ov.length && o.overrideDetail.length < CONFIG.MAX_OVERRIDES) {
    const fields = [...new Set(ov.flatMap(x => x.overriddenFields || []))];
    let txt = []; try { txt = i.findAll(n => n.type === "TEXT").slice(0, 4).map(t => { try { return t.characters; } catch (e) { return "?"; } }); } catch (e) {}
    o.overrideDetail.push({ id: i.id, screen: key, variant: m.name, fields, text: txt });
  }
}
for (const o of Object.values(out)) {
  o.insideOtherComponents = [...o.insideOtherComponents];
  const entries = Object.entries(o.screens).sort((a, b) => b[1] - a[1]);
  o.screenCount = entries.length;
  o.screens = Object.fromEntries(entries.slice(0, CONFIG.MAX_SCREENS));
}
return {
  impact: out,
  ...(notFound.length ? { notFound } : {}),
  note: "tell the designer before editing: instance count, screen count, other components containing it, overridden places. Editing the main component's VALUES doesn't overwrite overrides; changing its STRUCTURE (renaming / removing layers) can drop overrides → use overrideDetail to reapply them. After editing: audit these screens, check text overflow",
};
