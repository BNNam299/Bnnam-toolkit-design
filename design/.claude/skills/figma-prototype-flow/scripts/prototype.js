// prototype.js — CLICK-THROUGH PROTOTYPE FLOW for trying options before deciding (figma-prototype-flow skill).
// Run through execute_code{code: <this whole file>, timeoutMs}. Set CONFIG first.
//   MODE "build": own flow section → a copy of each screen (safe clone: main components inside become instances) → wire the links
//   MODE "start": set the flow starting point — a SEPARATE CALL after build (setting it in the same call that creates the nodes → "duplicate input nodeIds")
//   MODE "check": READ ONLY — which copies are stale (source screen changed after copying), which source screens were deleted
// The copies are NOT project screens: named "<Flow name> Flow_Step <n>" (designer convention), inside section "Flow — <flow name>"; audits and progress counts skip them.
// DRY_RUN = true (default) in MODE "build": reports the plan, creates nothing.
const CONFIG = {
  MODE: "check",                   // "build" | "start" | "check"
  DRY_RUN: true,
  PAGE: "5. UI Design",            // the page holding the source screens — the flow section is created on the same page
  FLOW: "",                        // flow name — e.g. "Quick checkout"
  STEPS: [],                       // build: source screen names in the order walked — ["Product-Detail_Result", "Checkout-Payment_Result", …]
  // build: links on the COPIES — from/to are source screen names; layer is the layer name (or "Parent/Child") inside the from screen; to: "BACK" to go back
  // trigger: "ON_CLICK" (default) | "AFTER_TIMEOUT" + timeout (unit not confirmed — check it in the Prototype panel after wiring)
  LINKS: [],                       // [{ from: "…", layer: "Buy now", to: "…", nav: "NAVIGATE" | "OVERLAY" }]
  GAP: 120,
  OWNER_KEY: "designtoolkit",      // sharedPluginData namespace — readable from every plugin / MCP session
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
const stepName = i => `${CONFIG.FLOW} Flow_Step ${i + 1}`;   // designer convention
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on a TEXT node throws in real Figma — check type first, use `in`
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();

// fingerprint of a screen — changes when the source screen changes (layer names, sizes, text, fills, layout)
async function fingerprint(root) {
  const parts = [];
  const visit = n => {
    const f = Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false).map(p => p.type === "SOLID" ? (p.boundVariables && p.boundVariables.color ? "v" + p.boundVariables.color.id : [p.color.r, p.color.g, p.color.b].map(x => Math.round(x * 255)).join(",")) : p.type).join("|") : "M";
    let ch = ""; if (n.type === "TEXT") { try { ch = n.characters; } catch (e) { ch = "?"; } }
    parts.push([n.type, n.name, Math.round(n.width), Math.round(n.height), n.layoutMode || "", n.visible === false ? 0 : 1, f, ch].join("~"));
    if (n.type !== "INSTANCE" && n.children) n.children.forEach(visit);
  };
  visit(root);
  let h = 5381; const s = parts.join("\n"); for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
const frames = [];
(function walk(c) { for (const k of c.children) { if (k.type === "SECTION") walk(k); else if (k.type === "FRAME") frames.push(k); } })(page);

// ───────────────────────── CHECK — read only
if (CONFIG.MODE === "check") {
  const copies = frames.filter(f => f.getSharedPluginData(CONFIG.OWNER_KEY, "flowSource"));
  const out = { copies: copies.length, stale: [], sourceMissing: [], startingPoints: (page.flowStartingPoints || []).map(p => p.name) };
  for (const c of copies) {
    const srcId = c.getSharedPluginData(CONFIG.OWNER_KEY, "flowSource"), was = c.getSharedPluginData(CONFIG.OWNER_KEY, "flowPrint");
    const src = await figma.getNodeByIdAsync(srcId);
    if (!src) { out.sourceMissing.push(c.name); continue; }
    if ((await fingerprint(src)) !== was) out.stale.push(`${c.name}  ←  "${src.name}" changed after copying`);
  }
  out.hint = out.stale.length || out.sourceMissing.length ? "rebuild the flow (MODE build with the same FLOW) — old copies are replaced by new ones" : "flow matches the source screens";
  return out;
}

// ───────────────────────── START — separate call, new array
if (CONFIG.MODE === "start") {
  const first = frames.find(f => f.name === stepName(0) && f.getSharedPluginData(CONFIG.OWNER_KEY, "flowSource"));
  if (!first) return { stop: `"${stepName(0)}" not found — run MODE "build" first` };
  const live = new Set(frames.map(f => f.id));
  const keep = (page.flowStartingPoints || []).filter(p => p.name !== CONFIG.FLOW && live.has(p.nodeId)).map(p => ({ nodeId: String(p.nodeId), name: String(p.name) }));
  const seen = new Set(); const next = [...keep, { nodeId: first.id, name: CONFIG.FLOW }].filter(p => !seen.has(p.nodeId) && seen.add(p.nodeId));
  if (CONFIG.DRY_RUN) return { mode: "DRY RUN", startingPoints: next.map(p => p.name) };
  page.flowStartingPoints = next;                                // a new literal array — never reassign the array you read
  return { mode: "SET", startingPoints: next.map(p => p.name), tryIt: `Figma › Present (▶) › pick flow "${CONFIG.FLOW}"` };
}

// ───────────────────────── BUILD
if (!CONFIG.FLOW || !CONFIG.STEPS.length) return { stop: "build needs FLOW and STEPS" };
const srcs = CONFIG.STEPS.map(n => frames.find(f => f.name === n && !f.getSharedPluginData(CONFIG.OWNER_KEY, "flowSource")));
const missing = CONFIG.STEPS.filter((n, i) => !srcs[i]);
if (missing.length) return { stop: `screens not found: ${missing.join(", ")}` };
const secName = `Flow — ${CONFIG.FLOW}`;
const oldSec = page.children.find(n => n.type === "SECTION" && n.name === secName);
if (oldSec && oldSec.getSharedPluginData(CONFIG.OWNER_KEY, "owner") !== "agent") return { stop: `section "${secName}" was not created by the agent — rename FLOW` };
const abs = n => { const t = n.absoluteTransform; return { x: t ? t[0][2] : n.x, y: t ? t[1][2] : n.y, w: n.width, h: n.height }; };
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const linkPlan = CONFIG.LINKS.map(l => ({ ...l, ok: CONFIG.STEPS.includes(l.from) && (l.to === "BACK" || CONFIG.STEPS.includes(l.to)) }));
const report = {
  mode: CONFIG.DRY_RUN ? "DRY RUN — nothing created" : "BUILT",
  section: secName + (oldSec ? " (rebuild — old one replaced)" : " (new)"),
  steps: CONFIG.STEPS.map((s, i) => `${stepName(i)}  ←  ${s}`),
  links: linkPlan.map(l => `${l.from} › ${l.layer} → ${l.to}${l.ok ? "" : "  ✗ screen not in STEPS"}`),
  startingPoint: `${stepName(0)} — set in a separate call: MODE "start"`,
};
if (CONFIG.DRY_RUN) return report;

// section: on rebuild, delete the old flow section (the agent's) — position kept
let sx, sy;
if (oldSec) { sx = oldSec.x; sy = oldSec.y; oldSec.remove(); }   // old starting point now points at a deleted node → MODE "start" cleans it up
else { const tops = page.children.filter(n => n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP").map(abs); sx = (tops.length ? Math.max(...tops.map(b => b.x + b.w)) : 0) + CONFIG.GAP * 2; sy = tops.length ? Math.min(...tops.map(b => b.y)) : 0; }
const sec = figma.createSection(); sec.name = secName; page.appendChild(sec); sec.x = sx; sec.y = sy; sec.setSharedPluginData(CONFIG.OWNER_KEY, "owner", "agent");
const firstSec = (() => { for (let p = srcs[0].parent; p && p.type !== "PAGE"; p = p.parent) if (p.type === "SECTION") return p; return null; })();
const titleNote = await addTitle(sec, firstSec);

// copies — safe clone: a main component inside the screen → an instance of that main component
const copies = new Map(); let x = CONFIG.GAP, swapped = 0;
const pathOf = (n, root) => { const p = []; for (let q = n; q && q !== root; q = q.parent) p.unshift(q.parent ? q.parent.children.indexOf(q) : 0); return p.join("/"); };
const mainsIn = r => r.findAll(n => n.type === "COMPONENT" || n.type === "COMPONENT_SET").filter(n => !(n.type === "COMPONENT" && n.parent && n.parent.type === "COMPONENT_SET"));
let stepIdx = 0;
for (const src of srcs) {
  const orig = new Map(mainsIn(src).map(m => [pathOf(m, src), m]));
  const c = src.clone(); c.name = stepName(stepIdx++); sec.appendChild(c); c.x = x; c.y = CONFIG.GAP * 1.5;
  for (const m of mainsIn(c)) { const o = orig.get(pathOf(m, c)); if (!o) continue; const main = o.type === "COMPONENT_SET" ? o.defaultVariant || o.children[0] : o;
    const inst = main.createInstance(); const p = m.parent; p.insertChild(p.children.indexOf(m), inst); if (!p.layoutMode || p.layoutMode === "NONE") { inst.x = m.x; inst.y = m.y; } m.remove(); swapped++; }
  c.setSharedPluginData(CONFIG.OWNER_KEY, "flowSource", src.id);
  c.setSharedPluginData(CONFIG.OWNER_KEY, "flowPrint", await fingerprint(src));
  copies.set(src.name, c); x += c.width + CONFIG.GAP;
}
sec.resizeWithoutConstraints(x, Math.max(...srcs.map(s => s.height)) + CONFIG.GAP * 2.5);

// links — on the copies
const linked = [], failed = [];
for (const l of linkPlan) {
  if (!l.ok) { failed.push(`${l.from} › ${l.layer}: screen not in STEPS`); continue; }
  const from = copies.get(l.from), segs = String(l.layer).split("/");
  // search DIRECT CHILDREN first — a deep findOne can match a parent instance with the same name; only search deep if not found
  let node = from; for (const sg of segs) { if (!canFind(node)) { node = null; break; } node = node.children.find(n => n.name === sg) || node.findOne(n => n.name === sg && n.type !== "INSTANCE") || node.findOne(n => n.name === sg); }
  if (!node) { failed.push(`${l.from} › ${l.layer}: layer not found`); continue; }
  const action = l.to === "BACK" ? { type: "BACK" }
    : { type: "NODE", destinationId: copies.get(l.to).id, navigation: l.nav || "NAVIGATE", transition: null, resetVideoPosition: false };
  const trigger = l.trigger === "AFTER_TIMEOUT" ? { type: "AFTER_TIMEOUT", timeout: l.timeout ?? 800 } : { type: "ON_CLICK" };
  try { await node.setReactionsAsync([...(node.reactions || []), { trigger, actions: [action] }]); linked.push(`${l.from} › ${l.layer} → ${l.to}${l.trigger === "AFTER_TIMEOUT" ? " (after " + (l.timeout ?? 800) + ")" : ""}`); }
  catch (e) { failed.push(`${l.from} › ${l.layer}: ${e.message || e}`); }   // unknown error → pass it on verbatim
}

// overlap check — push the flow section right until it sits on empty canvas
let moved = 0;
while (page.children.some(n => n.id !== sec.id && (n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP") && hit(abs(sec), abs(n))) && moved < 50) { sec.x += CONFIG.GAP * 4; moved++; }
Object.assign(report, { title: titleNote, linked: linked, notLinked: failed, mainComponentsSwapped: swapped, sectionShifted: moved || undefined,
  next: `run MODE "start" (separate call) to set the starting point · then Figma › Present (▶) › pick flow "${CONFIG.FLOW}"`,
  copySource: CONFIG.STEPS.map((s, i) => `${stepName(i)} ← ${s}`) });   // record in flows.md › flow › click-through flow
return report;
