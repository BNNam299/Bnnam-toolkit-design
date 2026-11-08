// kitread.js — READ ONLY. Reads a WHOLE kit / library file in ONE call: pages, variables (real values in every mode), styles, components
// (properties, variants), text on guide pages. Use when turning a Figma resource into a reference (e.g. a system UI kit, a community kit).
// Why one call: Figma MCP limits calls PER ACCOUNT (the Starter plan stops midway) — a copy of the file grants no extra calls.
// Large results → the agent saves them to a file first, then summarises.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  SKIP_PAGES: ["Examples", "Cover", "License", "---", "——————————————————"],   // pages already read / not needed
  ONLY_PAGES: [],                  // empty = every remaining page · or a list of page names still to read
  MAX_COMPONENTS_PER_PAGE: 60,
  MAX_TEXT_PER_PAGE: 30,
  VARIABLES: true,
  SKIP_COLLECTIONS: [],            // e.g. ["Text Leading"] if already captured
};
const res = { file: figma.root.name, pages: figma.root.children.map(p => `${p.id} ${p.name}`) };
if (CONFIG.VARIABLES) {
  const colls = await figma.variables.getLocalVariableCollectionsAsync();
  const vars = await figma.variables.getLocalVariablesAsync();
  const byId = new Map(vars.map(v => [v.id, v]));
  const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase() + (c.a !== undefined && c.a < 1 ? ` @${Math.round(c.a * 100)}%` : '');
  const fmt = v => v && typeof v === 'object' ? (v.type === 'VARIABLE_ALIAS' ? `→ ${byId.get(v.id) ? byId.get(v.id).name : 'outside the file'}` : ('r' in v ? hex(v) : JSON.stringify(v))) : v;
  res.variables = colls.filter(c => !CONFIG.SKIP_COLLECTIONS.includes(c.name)).map(c => ({ name: c.name, modes: c.modes.map(m => m.name),
    vars: vars.filter(v => v.variableCollectionId === c.id).map(v => [v.name, ...c.modes.map(m => fmt(v.valuesByMode[m.modeId]))].join(' | ')) }));
}
res.textStyles = (await figma.getLocalTextStylesAsync()).map(s => `${s.name} · ${s.fontName.family} ${s.fontName.style} ${s.fontSize}`);
res.paintStyles = (await figma.getLocalPaintStylesAsync()).map(s => s.name);
res.effectStyles = (await figma.getLocalEffectStylesAsync()).map(s => s.name);
res.byPage = {};
for (const p of figma.root.children) {
  if (CONFIG.SKIP_PAGES.includes(p.name.trim()) || /^[-—\s]+$/.test(p.name)) continue;
  if (CONFIG.ONLY_PAGES.length && !CONFIG.ONLY_PAGES.includes(p.name)) continue;
  try {
    await p.loadAsync();                                         // load the page within the same call — doesn't change the current page
    const sets = p.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] }).filter(n => n.type === 'COMPONENT_SET' || !(n.parent && n.parent.type === 'COMPONENT_SET'));
    res.byPage[p.name] = {
      components: sets.slice(0, CONFIG.MAX_COMPONENTS_PER_PAGE).map(n => {
        let props = '';
        try { props = Object.entries(n.componentPropertyDefinitions).map(([k, v]) => `${k.split('#')[0]}${v.variantOptions ? '=' + v.variantOptions.slice(0, 12).join('/') : ':' + v.type}`).join(' · '); } catch (e) { props = '?'; }   // not readable on a variant
        return `${n.name} [${Math.round(n.width)}×${Math.round(n.height)}${n.type === 'COMPONENT_SET' ? ', ' + n.children.length + 'v' : ''}] ${props}`.slice(0, 300);
      }),
      ...(sets.length ? {} : { top: p.children.slice(0, 25).map(c => `${c.type} ${c.name} ${Math.round(c.width)}×${Math.round(c.height)}`) }),
      text: p.findAll(n => n.type === 'TEXT').slice(0, 120).map(t => { try { return t.characters.trim().slice(0, 240); } catch (e) { return ''; } }).filter(x => x.length > 3).slice(0, CONFIG.MAX_TEXT_PER_PAGE),
    };
  } catch (e) { res.byPage[p.name] = 'error: ' + (e.message || e); }
}
return res;
