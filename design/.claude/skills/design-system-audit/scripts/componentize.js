// componentize.js — REPEATED BLOCK → COMPONENT (designer standard, mobile-ui-master screen-structure §1 · bnnam-standards team-rules §12.4 exception 3).
// Main blocks (Top Container, Content, Bottom Container, …) are FRAMES by default. When the second screen's block has EXACTLY THE SAME STRUCTURE
// as the first screen's → turn the first screen's block into a component and replace the block on every listed screen with an INSTANCE.
// Text that differs between screens is kept as OVERRIDES. Only blocks the agent built (new screens, _Fix AI, the agent's sections). Blocks in
// the designer's screens → ask first (DESIGNER_OK).
// DRY_RUN = true (default): compares structure, reports the plan, changes nothing.
// Body of an async function: top-level `await` and `return`. Run through execute_code{code, timeoutMs} — set CONFIG, send the whole file.
const CONFIG = {
  DRY_RUN: true,
  PAGE: "5. UI Design",
  BLOCK: "",                       // required — block name, e.g. "Top Container"
  SCREENS: [],                     // required — ≥ 2 screens; the FIRST screen is the component's source
  COMPONENT_NAME: "",              // empty = BLOCK
  COMPONENT_SECTION: "Components — agent",   // a SEPARATE section for the main component — never leave a main component inside a screen
  DESIGNER_OK: false,              // true ONLY when the designer agreed to componentize a block in the designer's screen
  GAP: 120, OWNER_KEY: "designtoolkit",
};
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // reading findAll on TEXT throws in real Figma
if (!CONFIG.BLOCK || CONFIG.SCREENS.length < 2) return { stop: "needs BLOCK and ≥ 2 SCREENS" };
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();
const NAME = CONFIG.COMPONENT_NAME || CONFIG.BLOCK;

const frames = [];
(function w(c) { for (const k of c.children) { if (k.type === "SECTION") w(k); else if (k.type === "FRAME") frames.push(k); } })(page);
const screens = CONFIG.SCREENS.map(n => frames.find(f => f.name === n));
const miss = CONFIG.SCREENS.filter((n, i) => !screens[i]);
if (miss.length) return { stop: `screens not found: ${miss.join(", ")}` };
const blocks = screens.map(s => s.children.find(c => c.name === CONFIG.BLOCK));
const noBlock = CONFIG.SCREENS.filter((n, i) => !blocks[i]);
if (noBlock.length) return { stop: `screens with no top-level block "${CONFIG.BLOCK}": ${noBlock.join(", ")}` };
const already = CONFIG.SCREENS.filter((n, i) => blocks[i].type === "INSTANCE");
if (already.length) return { stop: `the block is already an instance in: ${already.join(", ")} — use that instance for the other screens, don't create a new component` };

// a component with the same name exists → use it, never create a duplicate
const exist = page.findOne(n => (n.type === "COMPONENT" || n.type === "COMPONENT_SET") && n.name === NAME);
if (exist) return { stop: `component "${NAME}" already exists — replace the blocks with its instances (or add a variant per team-rules §12.4), don't create a duplicate` };

// permission: only blocks the agent built
const agentOwned = s => { for (let p = s.parent; p && p.type !== "PAGE"; p = p.parent) if (p.type === "SECTION" && p.getSharedPluginData(CONFIG.OWNER_KEY, "owner") === "agent") return true; return /_Fix AI$/.test(s.name); };
const notMine = CONFIG.SCREENS.filter((n, i) => !agentOwned(screens[i]));
if (notMine.length && !CONFIG.DESIGNER_OK) return { stop: `screens not built by the agent: ${notMine.join(", ")} — ask the designer first (DESIGNER_OK)` };

// compare structure — identical except text
const sig = n => { const o = [n.type, n.name, n.layoutMode || "", n.layoutSizingHorizontal || "", n.layoutSizingVertical || "", Math.round(n.width), n.type === "TEXT" ? "" : Math.round(n.height)].join("~");
  return canFind(n) && n.type !== "INSTANCE" ? o + "{" + n.children.map(sig).join(",") + "}" : o + (n.type === "INSTANCE" ? "@" + (n.mainComponent ? "" : "") : ""); };
const pathOf = (n, root) => { const p = []; for (let q = n; q && q !== root; q = q.parent) p.unshift(q.parent.children.indexOf(q)); return p.join("/"); };
const mains = async n => { const out = []; if (!canFind(n)) return out; for (const i of n.findAll(x => x.type === "INSTANCE")) { try { const m = await i.getMainComponentAsync(); out.push(pathOf(i, n) + "=" + (m ? m.id : "?")); } catch (e) {} } return out.join(";"); };
const base = sig(blocks[0]), baseMains = await mains(blocks[0]);
const diff = [];
for (let i = 1; i < blocks.length; i++) {
  if (sig(blocks[i]) !== base) diff.push(`${CONFIG.SCREENS[i]}: different structure`);
  else if ((await mains(blocks[i])) !== baseMains) diff.push(`${CONFIG.SCREENS[i]}: uses different child components`);
}
if (diff.length) return { stop: "blocks are not identical — keep them as frames", differences: diff };

// differing text → overrides
const textsOf = n => (canFind(n) ? n.findAll(x => x.type === "TEXT") : []).map(t => { let c = ""; try { c = t.characters; } catch (e) {} return { path: pathOf(t, n), c }; });
const baseTexts = textsOf(blocks[0]);
const overrides = blocks.map((b, i) => i === 0 ? [] : textsOf(b).filter((t, k) => baseTexts[k] && t.c !== baseTexts[k].c));
const plan = { component: NAME, from: `${CONFIG.SCREENS[0]} › ${CONFIG.BLOCK}`, placedIn: `section "${CONFIG.COMPONENT_SECTION}"`,
  replacedWithInstance: CONFIG.SCREENS, textOverrides: overrides.map((o, i) => o.length ? `${CONFIG.SCREENS[i]}: ${o.length} texts` : null).filter(Boolean) };
if (CONFIG.DRY_RUN) return { mode: "DRY RUN — nothing changed", plan };

// section for the main component
const abs = n => { const t = n.absoluteTransform; return { x: t ? t[0][2] : n.x, y: t ? t[1][2] : n.y, w: n.width, h: n.height }; };
const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
let sec = page.children.find(n => n.type === "SECTION" && n.name === CONFIG.COMPONENT_SECTION);
if (sec && sec.getSharedPluginData(CONFIG.OWNER_KEY, "owner") !== "agent") return { stop: `section "${CONFIG.COMPONENT_SECTION}" belongs to the designer — change COMPONENT_SECTION` };
if (!sec) { const tops = page.children.filter(n => n.type === "SECTION" || n.type === "FRAME").map(abs);
  sec = figma.createSection(); sec.name = CONFIG.COMPONENT_SECTION; page.appendChild(sec);
  sec.x = (tops.length ? Math.max(...tops.map(b => b.x + b.w)) : 0) + CONFIG.GAP * 2; sec.y = tops.length ? Math.min(...tops.map(b => b.y)) : 0;
  sec.setSharedPluginData(CONFIG.OWNER_KEY, "owner", "agent"); }

// record each screen's block position before changing anything
const spots = blocks.map((b, i) => ({ s: screens[i], idx: screens[i].children.indexOf(b), x: b.x, y: b.y, w: b.width, h: b.height }));
const comp = figma.createComponentFromNode(blocks[0]);          // first screen's block → component (still inside the screen)
comp.name = NAME;
sec.appendChild(comp);                                          // move the main component to its own section — appendChild returns no node
const kids = sec.children.filter(c => c !== comp);
comp.x = CONFIG.GAP; comp.y = kids.length ? Math.max(...kids.map(c => c.y + c.height)) + CONFIG.GAP : CONFIG.GAP;
sec.resizeWithoutConstraints(Math.max(sec.width, comp.x + comp.width + CONFIG.GAP), Math.max(sec.height, comp.y + comp.height + CONFIG.GAP));

const done = [], fails = [];
for (let i = 0; i < spots.length; i++) {
  const sp = spots[i];
  const inst = comp.createInstance();
  sp.s.insertChild(Math.min(sp.idx, sp.s.children.length), inst);
  inst.x = sp.x; inst.y = sp.y;
  if (i > 0) blocks[i].remove();                                // the old frame block on later screens
  for (const o of overrides[i]) {                               // keep each screen's own text
    let n = inst; for (const k of o.path.split("/").map(Number)) n = n && n.children ? n.children[k] : null;
    if (!n || n.type !== "TEXT") { fails.push(`${sp.s.name}: could not set text "${o.c.slice(0, 20)}"`); continue; }
    try { await figma.loadFontAsync(n.fontName); n.characters = o.c; } catch (e) { fails.push(`${sp.s.name}: ${e.message || e}`); }
  }
  done.push(sp.s.name);
}
let moved = 0;
while (page.children.some(n => n.id !== sec.id && (n.type === "SECTION" || n.type === "FRAME") && hit(abs(sec), abs(n))) && moved < 50) { sec.x += CONFIG.GAP * 4; moved++; }
return { mode: "COMPONENTIZED", plan, componentId: comp.id, replaced: done, ...(fails.length ? { overrideErrors: fails } : {}),
  note: "the new component is a main component — from now on edit it per team-rules §12.4; record it in components.md" };
