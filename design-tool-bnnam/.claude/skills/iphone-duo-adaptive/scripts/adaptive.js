// scripts/adaptive.js — READ ONLY. Checks adaptive SCREEN FAMILIES (references/duo-adapt-workflow.md §7 · duo-foundations.md §3 · duo-device-postures.md §4 · duo-handoff-testing.md §8–9).
// Family = base screen + frame variants by suffix (bnnam-standards/references/naming.md §3): "Inbox_Result" · "Inbox_Result_Inner" · "Inbox_Result_Inner Landscape"…
// Reports: variants MISSING for the support level · ACTIONS present in one variant but missing in another (functions must match at every size) ·
//      fixed HINGE / FOLD SPACER (a reserved region is dynamic — never draw it as a spacer) · text blocks wider than readable.
const CONFIG = {
  PAGES: ["5. UI Design"],
  LEVEL: "adaptive",               // project.yaml › platform.adaptiveLevel — compatible | adaptive | duo-enhanced
  TARGETS: ["iphone-duo"],         // project.yaml › platform.targets — add "ipad" if needed
  POSES: [],                       // project.yaml › platform.poses — postures with value: ["Book", "Tabletop", "Tent"]
  ROTATES: true,                   // the app rotates to landscape on the outer display
  FAMILIES: [],                    // empty = every family with ≥ 2 variants · or base screen names
  READABLE_MAX_WIDTH: 700,         // wider text blocks → reported (forms, reading text need a max width). Tune to the project's system
  ACTION_ROLE: /button|btn|cta|tab|toolbar|bar button|menu item|nút/i,   // detects actions by layer / parent instance name (project.yaml › textRoles)
  OVERFLOW: /more|ellipsis|overflow|…|thêm|khác/i,                       // overflow button — actions may live inside it
  HINGE: /hinge|fold|spine|bản lề|nếp gập|gập/i,
  EDIT_SUFFIXES: ["Fix", "Fix AI"],
};
const VARIANTS = ["Outer", "Outer Landscape", "Inner", "Inner Landscape", "Intermediate", "Book", "Tabletop", "Tent", "Split Left", "Split Right", "iPad", "iPad Landscape"];
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;   // TEXT nodes have no findAll
const chars = t => { try { return (t.characters || "").trim(); } catch (e) { return ""; } };

// variants needed for the level
const need = new Set(["Inner", "Inner Landscape"]);
if (CONFIG.ROTATES) need.add("Outer Landscape");
if (CONFIG.LEVEL !== "compatible") { need.add("Intermediate"); need.add("Split Left"); need.add("Split Right"); }
for (const p of CONFIG.POSES) need.add(p);
if (CONFIG.TARGETS.includes("ipad")) need.add("iPad");

// group into families
const frames = [];
for (const pn of CONFIG.PAGES) {
  const page = figma.root.children.find(p => p.name === pn); if (!page) continue;
  await page.loadAsync();
  (function w(c) { for (const k of c.children) { if (k.type === "SECTION") w(k); else if (k.type === "FRAME" && k.height >= 300) frames.push(k); } })(page);
}
const split = name => { for (const v of [...VARIANTS].sort((a, b) => b.length - a.length)) if (name.endsWith("_" + v)) return [name.slice(0, -(v.length + 1)), v]; return [name, "Outer"]; };
const fams = new Map();
for (const f of frames) {
  if (CONFIG.EDIT_SUFFIXES.some(x => f.name.endsWith("_" + x))) continue;
  const [base, v] = split(f.name);
  if (!fams.has(base)) fams.set(base, new Map());
  fams.get(base).set(v, f);
}

function actionsOf(screen) {
  const acts = new Set(); let overflow = false;
  if (!canFind(screen)) return { acts, overflow };
  for (const n of screen.findAll(x => x.type === "TEXT" || x.type === "INSTANCE")) {
    const trail = []; for (let p = n; p && p !== screen && trail.length < 5; p = p.parent) trail.push(p.name);
    const t = trail.join(" ");
    if (n.type === "INSTANCE" && CONFIG.OVERFLOW.test(n.name)) overflow = true;
    if (!CONFIG.ACTION_ROLE.test(t)) continue;
    if (n.type === "TEXT") { const c = chars(n); if (c && c.length > 1 && !/^\d/.test(c)) acts.add(c); }
  }
  return { acts, overflow };
}

const out = { level: CONFIG.LEVEL, variantsNeeded: ["(base)", ...need], families: [] };
for (const [base, vs] of fams) {
  if (CONFIG.FAMILIES.length ? !CONFIG.FAMILIES.includes(base) : vs.size < 2) continue;
  const r = { screen: base, has: [...vs.keys()].map(v => v === "Outer" ? "(base)" : v) };
  r.missing = [...need].filter(v => !vs.has(v));
  // same functions
  const per = new Map(); for (const [v, f] of vs) per.set(v, actionsOf(f));
  const union = new Set(); for (const { acts } of per.values()) for (const a of acts) union.add(a);
  const lech = [];
  for (const [v, { acts, overflow }] of per) {
    const miss = [...union].filter(a => !acts.has(a));
    if (miss.length) lech.push({ variant: v === "Outer" ? "(base)" : v, missingActions: miss.slice(0, 12), ...(overflow ? { note: "has an overflow button — check the actions inside it, with titles" } : {}) });
  }
  if (lech.length) r.actionMismatch = lech;
  // hinge spacer, text too wide
  const hinge = [], wide = [];
  for (const [v, f] of vs) {
    if (!canFind(f)) continue;
    for (const n of f.findAll(x => CONFIG.HINGE.test(x.name) && (x.type === "FRAME" || x.type === "RECTANGLE") && (!("children" in x) || x.children.length === 0)))
      hinge.push(`${v === "Outer" ? "(base)" : v} › ${n.name} ${Math.round(n.width)}×${Math.round(n.height)}`);
    for (const t of f.findAll(x => x.type === "TEXT" && x.width > CONFIG.READABLE_MAX_WIDTH && chars(x).length > 60))
      wide.push(`${v === "Outer" ? "(base)" : v} › ${t.name} width ${Math.round(t.width)}`);
  }
  if (hinge.length) r.hingeSpacer = { error: "a reserved region is DYNAMIC — never draw a fixed spacer; annotate with the Reserved Region overlay (apple-design-iphone/references/ios27-figma-kit.md §3)", at: hinge.slice(0, 10) };
  if (wide.length) r.textTooWide = { hint: "give reading text / forms a max width; use the large space to reveal another pane (duo-layout-transformation.md §4)", at: wide.slice(0, 10) };
  r.pass = !r.missing.length && !lech.length && !hinge.length && !wide.length;
  out.families.push(r);
}
out.total = { families: out.families.length, pass: out.families.filter(h => h.pass).length };
out.note = "only what is visible on static frames can be checked — continuity (state kept, focus on transition) is walked through the 10 scenarios in duo-handoff-testing.md §3";
return out;
