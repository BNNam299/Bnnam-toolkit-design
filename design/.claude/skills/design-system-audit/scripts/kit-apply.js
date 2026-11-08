// kit-apply.js — WRITES APPROVED VARIABLE CHANGES into the project's kit (kit setup — references/kit-setup.md §6).
// Run only with the list the designer approved group by group. DRY_RUN = true (default): reports before → after, changes nothing. The designer
// says "run it for real" → DRY_RUN = false. The result is a LEDGER (before → after per item) — the agent saves it to design/kit/ledger.json so it can be undone.
// Variables are named "<collection>/<variable name>" (e.g. "mapped/surface/primary"). Areas the designer locked (LOCKED) → refused.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  DRY_RUN: true,
  LOCKED: [],                      // prefixes the designer locked, e.g. ["primitive/color/foundation/", "mapped/content/"] — design/kit.md › Locked
  // { type: "value",  var: "mapped/surface/primary", mode: "Light", value: "#2F6BFF" | 16 | { alias: "primitive/color/Blue/500" } }
  // { type: "create", var: "primitive/color/Blue/950", varType: "COLOR", values: { "Mode 1": "#111A2D" }, scopes: [] , description: "" }
  // { type: "scope",  var: "primitive/color/Blue/500", scopes: [] }
  // { type: "describe", var: "mapped/surface/primary", description: "primary button background" }
  APPLY: [],
};
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const cByName = new Map(collections.map(c => [c.name, c]));
const cById = new Map(collections.map(c => [c.id, c]));
const vByFull = new Map(vars.map(v => [`${cById.get(v.variableCollectionId).name}/${v.name}`, v]));
const split = full => { const c = collections.find(c => full.startsWith(c.name + "/")); return c ? [c, full.slice(c.name.length + 1)] : [null, full]; };
const parseHex = h => { const s = String(h).replace("#", ""); const n = i => parseInt(s.slice(i, i + 2), 16) / 255; return { r: n(0), g: n(2), b: n(4), a: s.length >= 8 ? n(6) : 1 }; };
const hex = c => c && typeof c.r === "number" ? "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase() + (typeof c.a === "number" && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, "0").toUpperCase() : "") : c;
const show = (v, val) => (val && val.type === "VARIABLE_ALIAS" ? { alias: (() => { const t = vars.find(x => x.id === val.id); return t ? `${cById.get(t.variableCollectionId).name}/${t.name}` : val.id; })() } : v && v.resolvedType === "COLOR" ? hex(val) : val);
const toValue = (type, value) => {
  if (value && typeof value === "object" && value.alias) { const t = vByFull.get(value.alias); if (!t) throw new Error(`alias variable "${value.alias}" not found`); return figma.variables.createVariableAlias(t); }
  if (type === "COLOR") return parseHex(value);
  return value;
};
const ledger = [], refused = [];
for (const a of CONFIG.APPLY) {
  try {
    if (CONFIG.LOCKED.some(p => a.var.startsWith(p))) { refused.push({ ...a, reason: "locked by the designer" }); continue; }
    if (a.type === "create") {
      if (vByFull.has(a.var)) { refused.push({ ...a, reason: "variable already exists — use type value" }); continue; }  // check before creating
      const [c, name] = split(a.var); if (!c) { refused.push({ ...a, reason: "collection not found" }); continue; }
      const entry = { op: "create", var: a.var, after: a.values, scopes: a.scopes || [] };
      if (!CONFIG.DRY_RUN) {
        const v = figma.variables.createVariable(name, c, a.varType);
        for (const [mName, val] of Object.entries(a.values || {})) { const m = c.modes.find(x => x.name === mName); if (m) v.setValueForMode(m.modeId, toValue(a.varType, val)); }
        v.scopes = a.scopes || []; if (a.description) v.description = a.description;
        entry.id = v.id; vByFull.set(a.var, v);
      }
      ledger.push(entry); continue;
    }
    const v = vByFull.get(a.var); if (!v) { refused.push({ ...a, reason: "variable not found" }); continue; }
    const c = cById.get(v.variableCollectionId);
    if (a.type === "value") {
      const m = c.modes.find(x => x.name === a.mode); if (!m) { refused.push({ ...a, reason: `no mode "${a.mode}"` }); continue; }
      const before = show(v, v.valuesByMode[m.modeId]);
      const next = toValue(v.resolvedType, a.value);
      if (!CONFIG.DRY_RUN) v.setValueForMode(m.modeId, next);
      ledger.push({ op: "value", var: a.var, id: v.id, mode: a.mode, before, after: a.value });
    } else if (a.type === "scope") {
      const before = v.scopes.slice(); if (!CONFIG.DRY_RUN) v.scopes = a.scopes;
      ledger.push({ op: "scope", var: a.var, id: v.id, before, after: a.scopes });
    } else if (a.type === "describe") {
      const before = v.description; if (!CONFIG.DRY_RUN) v.description = a.description;
      ledger.push({ op: "describe", var: a.var, id: v.id, before, after: a.description });
    } else refused.push({ ...a, reason: "unsupported type — only value / create / scope / describe" });
  } catch (e) { refused.push({ ...a, reason: e.message || String(e) }); }
}
return { mode: CONFIG.DRY_RUN ? "DRY RUN — nothing changed" : "CHANGED — save the ledger to design/kit/ledger.json", ledger, refused,
  undo: "swap before ↔ after for each ledger item and run kit-apply.js again (create → delete the variable by id)" };
