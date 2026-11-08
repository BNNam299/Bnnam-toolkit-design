// scripts/safearea.js — STANDARD SAFE-AREA COMPONENT for every design file (designer's standard · references/frame-standards.md §6).
// Run through figma-agent `execute_code{code: <this whole file>, timeoutMs}` after setting CONFIG below.
// Set "Safe-Area" · two variant properties: Position = Top | Bottom × Device = iPhone | iPad | Duo Inner Portrait | Duo Inner Landscape | Duo Outer.
// NO Trailing: the 84 vertical-bar area belongs to the system, Pane controls holds it. Left margin / inner pane edge = PADDING (≥ 20 on Duo), not Safe-Area.
// VERTICAL-BAR frames (Duo Outer, Duo Inner Landscape): NO variant is created — padding left / top / bottom, edge touching the vertical bar = 0 (designer's decision).
// Safe-Area only for HORIZONTAL-BAR frames: iPhone, iPad, Duo Inner Portrait (Bottom).
// Safe-Area = SYSTEM area (status, camera, home indicator) — does NOT include the app's bars (toolbar, tab bar). The "Safe Area Inset" annotation layer in Apple's kit
// sometimes includes a bar (e.g. 95 = tab bar on Duo Inner Portrait) → do not take it as a system number.
// VALUES FOLLOW APPLE wherever Apple publishes a number (designer's rule); a designer number that differs from Apple → reported, FIX_TO_APPLE fixes it when the designer agrees.
// Variant = EMPTY frame, no fill, clip, any width (instances are placed FILL), height = the device's inset.
//   MODE "check"  READ ONLY — does the file have the set · which variants are missing · which heights differ from the standard table
//   MODE "apply"  missing → create the full set in a separate section · exists → add the Device property (old variants → Device = iPhone) + add missing variants.
//                 Does NOT change the size of existing variants — except with FIX_TO_APPLE (only for Apple-sourced numbers). DRY_RUN = true by default.
const CONFIG = {
  MODE: "check",
  DRY_RUN: true,
  SET_NAME: "Safe-Area",
  DEVICES: ["iPhone", "iPad", "Duo Inner Landscape", "Duo Inner Portrait", "Duo Outer"],   // the project's target devices decide this list
  // inset (pt) per Apple — apple: true = number published by Apple (Apple iOS 27 kit · handbook); false = no Apple number yet, provisional. 0 / missing = no variant created
  INSETS: {
    "iPhone":              { Top: 62, Bottom: 34, apple: true,  source: "Apple kit: Status bar - iPhone 17 Pro 402×62 · Status Bar/Height 62 · bottom 34 — frame 402×874" },
    "iPad":                { Top: 32, Bottom: 20, apple: "Top", source: "Top: Apple kit Status Bar/Height iPad 32 · Bottom: NO Apple number in the sources yet — provisional 20, PENDING measurement on Device Hub" },
    "Duo Inner Portrait":  { Bottom: 24, apple: false, source: "portrait 669×951 — Top: NO variant, the 84 strip is the system bar (Toolbar - Top - iPhone Duo contains status + camera) · Bottom: designer's choice (the kit's 95 = tab bar)" },
    // VERTICAL-BAR frames: no variant — use PADDING left / top / bottom ≥ 20 / 24 / 24, edge touching the vertical bar = 0 (designer's decision · replaces "24 inside each pane")
    "Duo Inner Landscape": { padding: true, apple: false, source: "unfolded 951×669 — Apple inset top / bottom = 0 (status sits in the vertical bar) · designer: NO Safe-Area, padding inside the pane (references/frame-standards.md §6)" },
    "Duo Outer":           { padding: true, apple: false, source: "466×678 / 678×466 — same as Duo Inner Landscape: padding, no Safe-Area" },
  },
  FIX_TO_APPLE: false,             // true ONLY when the designer agrees: fixes existing variants that differ from the Apple number (Apple-sourced cells) — this edits the main component
  WIDTH: 375,                      // variant width when creating — instances are placed FILL, so it does not matter
  PLACE_SECTION: "Components — agent",
  GAP: 40, OWNER_KEY: "designtoolkit",
};
const vName = (pos, dev) => `Position=${pos}, Device=${dev}`;

// find the set on every page — in one pass (keep the number of calls low)
let set = null, setPage = null;
for (const p of figma.root.children) { await p.loadAsync(); set = p.findOne(n => n.type === "COMPONENT_SET" && n.name === CONFIG.SET_NAME); if (set) { setPage = p; break; } }

const isApple = (d, pos) => { const a = (CONFIG.INSETS[d] || {}).apple; return a === true || a === pos; };
const want = [];
for (const d of CONFIG.DEVICES) for (const pos of ["Top", "Bottom"]) { const h = (CONFIG.INSETS[d] || {})[pos]; if (h !== undefined) want.push({ d, pos, h, apple: isApple(d, pos) }); }
const zero = want.filter(w => !w.h).map(w => `${w.d} · ${w.pos}`);

const report = { set: set ? `exists — page "${setPage.name}"` : "MISSING", toCreate: [], toRename: [], heightMismatch: [], notCreatedBecauseZero: zero };
if (set) {
  if (set.remote) return { stop: `"${set.name}" is a component from an external library — edit it in the library file` };
  const defs = (() => { try { return set.componentPropertyDefinitions; } catch (e) { return {}; } })();
  const hasDevice = Object.keys(defs).some(k => k.split("#")[0] === "Device");
  const have = new Map();
  for (const v of set.children) {
    const vp = v.variantProperties || {};
    const dev = vp.Device || "iPhone", pos = vp.Position;
    if (!hasDevice) report.toRename.push(`${v.name} → ${vName(pos, "iPhone")}`);
    have.set(`${pos}|${dev}`, v);
    if ((CONFIG.INSETS[dev] || {}).padding) (report.noLongerUsed = report.noLongerUsed || []).push(`${vName(pos, dev)} — vertical-bar frames use padding (designer's decision); do NOT delete the designer's variant yourself, report it for the designer to decide`);
    const w = want.find(x => x.d === dev && x.pos === pos);
    const cur = Math.round(v.height);
    if (w && w.h && cur !== w.h) report.heightMismatch.push(`${vName(pos, dev)}: file ${cur} · ${w.apple ? "**Apple number**" : "provisional table"} ${w.h} (${CONFIG.INSETS[dev].source})${w.apple ? " — by the rule this should be fixed to Apple (FIX_TO_APPLE, designer agrees)" : " — keep the file's value"}`);
  }
  for (const w of want) if (w.h && !have.has(`${w.pos}|${w.d}`)) report.toCreate.push(`${vName(w.pos, w.d)} height ${w.h}${w.apple ? " (Apple)" : " (provisional)"}`);
} else {
  for (const w of want) if (w.h) report.toCreate.push(`${vName(w.pos, w.d)} height ${w.h}${w.apple ? " (Apple)" : " (provisional)"}`);
}
if (CONFIG.MODE === "check" || CONFIG.DRY_RUN) return { mode: CONFIG.MODE === "check" ? "CHECK — read only" : "DRY RUN — nothing changed", ...report };

// ── apply
const made = [];
if (!set) {
  // the agent's own section, on the first page whose name contains "component", or the current page
  const page = figma.root.children.find(p => /component/i.test(p.name)) || figma.currentPage;
  await page.loadAsync();
  let sec = page.children.find(n => n.type === "SECTION" && n.name === CONFIG.PLACE_SECTION);
  if (!sec) { const tops = page.children.filter(n => n.type === "SECTION" || n.type === "FRAME");
    sec = figma.createSection(); sec.name = CONFIG.PLACE_SECTION; page.appendChild(sec);
    sec.x = (tops.length ? Math.max(...tops.map(n => n.x + n.width)) : 0) + CONFIG.GAP * 4; sec.y = tops.length ? Math.min(...tops.map(n => n.y)) : 0;
    sec.setSharedPluginData(CONFIG.OWNER_KEY, "owner", "agent"); }
  const comps = [];
  for (const w of want.filter(w => w.h)) {
    const c = figma.createComponent(); c.name = vName(w.pos, w.d); c.resize(CONFIG.WIDTH, w.h); c.fills = []; c.clipsContent = true;
    sec.appendChild(c); comps.push(c); made.push(c.name);
  }
  set = figma.combineAsVariants(comps, sec); set.name = CONFIG.SET_NAME; set.x = CONFIG.GAP; set.y = CONFIG.GAP * 2;
  set.description = "Standard safe area — Position × Device. Empty frame; place instances FILL horizontally. bnnam-standards references/frame-standards.md §6";
  let y = 0; for (const c of set.children) { c.x = CONFIG.GAP; c.y = y + CONFIG.GAP; y += c.height + CONFIG.GAP; }
  set.resizeWithoutConstraints(CONFIG.WIDTH + CONFIG.GAP * 2, y + CONFIG.GAP);
  sec.resizeWithoutConstraints(Math.max(sec.width, set.width + CONFIG.GAP * 2), Math.max(sec.height, set.height + CONFIG.GAP * 4));
} else {
  // add the Device property: rename the old variants (instances keep their link when a variant is renamed)
  for (const v of set.children) { const vp = v.variantProperties || {}; if (!vp.Device) v.name = vName(vp.Position, "iPhone"); }
  const fixed = [];
  if (CONFIG.FIX_TO_APPLE) for (const v of set.children) {            // fix existing variants to the Apple number — Apple-sourced cells only
    const vp = v.variantProperties || {}; const w = want.find(x => x.d === (vp.Device || "iPhone") && x.pos === vp.Position);
    if (!w || !w.apple || !w.h) continue;
    if (Math.round(v.height) !== w.h) { const before = Math.round(v.height); v.resize(v.width, w.h); fixed.push(`${v.name}: ${before} → ${w.h} (Apple)`); }
  }
  report.fixedToApple = fixed;
  const base = set.children[0];
  let y = Math.max(...set.children.map(c => c.y + c.height));
  for (const w of want) {
    if (!w.h || set.children.some(c => (c.variantProperties || {}).Position === w.pos && (c.variantProperties || {}).Device === w.d)) continue;
    const c = base.clone(); set.appendChild(c); c.name = vName(w.pos, w.d); c.resize(c.width, w.h); c.x = base.x; c.y = y + CONFIG.GAP; y = c.y + c.height; made.push(c.name);
  }
  set.resizeWithoutConstraints(Math.max(set.width, base.x + base.width + CONFIG.GAP), y + CONFIG.GAP);
}
return { mode: "STANDARDISED", set: set.name, created: made, toRename: report.toRename, ...(report.fixedToApple && report.fixedToApple.length ? { fixedToApple: report.fixedToApple } : {}), heightMismatch: report.heightMismatch, notCreatedBecauseZero: zero,
  note: "Apple numbers beat designer numbers (designer's rule); iPad Bottom has no Apple number yet — PENDING measurement on Device Hub; Duo Inner Landscape / Outer: NO Safe-Area — padding left 20 / top 24 / bottom 24, edge touching the vertical bar 0 (designer's decision)" };
