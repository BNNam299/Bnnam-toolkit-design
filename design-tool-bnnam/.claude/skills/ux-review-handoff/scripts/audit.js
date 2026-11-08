// scripts/audit.js — screen audit on one page. READ ONLY — writes nothing to the file.
// Run via execute_code: set CONFIG below, send the whole file as `code` (timeoutMs up to ~120000 on big files).
// Body of an async function: top-level `await` and `return`, `figma` in scope.
// Covers: the nine binding counts (raw values) · screen frame structure · meta text in frames (ux-writing principles §2) ·
//         hard rules (contrast, glyph icons, overflow, radii) · broken instances and duplicate components.
// Reports per category, never one merged number. Image placeholders are expected — counted separately.

const CONFIG = {
  PAGE: "5. UI Design",            // the UI page (or the wireframe page)
  MODE: "ui",                      // "ui" | "wireframe" — wireframes may use raw greys
  OS: "ios",                       // "ios" | "android" | "ios+android" — touch area 44 (ios) / 48 (android)
  FRAME: { w: 402, h: 874 },       // screen size — designer standard 402×874 for a new project; an existing project: the size of the screens already designed
  // safe area built from a component instance. null = not checked
  SAFE_AREA: null,                 // e.g. { top: "Safe-Area", bottom: "Safe-Area", topH: 62, bottomH: 34 } — Apple values; a set with a Device property: the component decides the height
                                   // bottom: null when the project's screens have no bottom safe area
  SCREEN_NAMES: null,              // null = every screen on the page · or a list of names (one screen / one batch)
  EDIT_SUFFIX: "Fix",              // copy the DESIGNER is editing: not audited
  AGENT_SUFFIX: "Fix AI",          // copy the AGENT built for the designer to compare: always audited
  // places the designer keeps on purpose, with a recorded decision — not counted in must-be-zero, moved to "accepted"
  ACCEPTED: [],                    // [{ id: "<node id>", dec: "DEC-012" }] — ids from the previous audit's detail
  TEMPLATE_FRAMES: [],             // template screens copied from another file: not audited
  SYSTEMS: {                       // false when the file has NO matching system (no spacing variables, etc.)
    fill: true, text: true, spacing: true, radius: true, stroke: true, effect: true,
  },
  GLYPH_RANGES: [[0xE000, 0xF8FF], [0xF0000, 0x10FFFF]],   // private-use ranges of icon glyphs (SF Symbols)
  SYMBOL_FONTS: ["SF Pro"],        // glyphs must use this font
  FORBIDDEN_WORDS: [],             // design/voice.md › Forbidden words
  TERMS: [],                       // design/voice.md › Terminology — [{ use: "Delete", avoid: ["Remove"] }]
  LIMITS: { buttonChars: null, titleWords: null, subtitleWords: null },   // design/voice.md › Copy rules
  CASE: null,                      // design/voice.md capitalization: "sentence" | "title" | null
  CONTRAST_MODES: null,            // null = every mode of the collection holding the variable · or ["Light", "Dark"]
  CHECK_DUPLICATES: true,          // scan duplicate and near-duplicate component names on EVERY page (slower on big files)
  PROJECT_PREFIX: "",              // project component prefix, e.g. "XX/" — to compare project components with atoms
  DEV_NOTE: "Dev Note",            // dev-note component name
  // screen names: Flow-path_State_Variant. A suffix outside this table → ask (it may be a state from the flow file)
  SUFFIXES: ["Empty", "Loading", "Error", "Result", "First run", "Returning", "Free", "Premium", "Editing", "Selected", "Expanded",
    "Draft", "Offline", "Partial", "Logged out", "Locked", "Invalid", "Success", "Failed", "Pending", "Confirm", "Update",
    "Mastered", "Recovering", "Disconnected", "Denied", "Limit", "Disabled", "Off", "On", "Locked", "Unlocked", "Focused", "Filled",
    "Outer", "Outer Landscape", "Inner", "Inner Landscape", "Intermediate", "Book", "Tabletop", "Tent", "Split Left", "Split Right", "iPad", "iPad Landscape"],   // frame variants — iphone-duo-adaptive
  EXTRA_SUFFIXES: [],              // the project's own extra suffixes
  FLOW_SUFFIX: "Flow",             // copies in a prototype flow "<screen name>_Flow <flow name>" — not audited (figma-prototype-flow)
  // faded card background: a node with a background fill and opacity < 1 → the card sinks into the screen background. Disabled = fade the CONTENT, not the background
  // background variable group of the system in use (surface/*, bg-*, background.*…).
  // The default catches common naming; a system with other naming → edit this line, not the logic
  CARD_FILL: /^(surface|background|bg|container|card|fill|layer|elevation)[\/._-]|[\/._-](surface|background|bg|container|card|layer|elevated|recessed)/i,
  OVERLAP_CHECK: true,
  // floating layer over text (a floating pill covered text in a test): a freely positioned node (ABSOLUTE, or in a frame without auto
  // layout) lying ABOVE another text in the screen. The NONE screen root is standard (Top / Content / Bottom overlap on purpose) → direct children of the root are not checked
  FLOAT_OVER_TEXT: true,
  FLOAT_MIN_OVERLAP: 4,              // px in each direction — touching edges by 1–2 px doesn't count
  // text over a shape (vector / image / gradient) directly below — measure contrast against that shape (in a test the digit "1" sank into a flame)
  TEXT_OVER_SHAPE: true,
  TEXT_OVER_SHAPE_MIN: 3,            // minimum contrast ratio between text and the shape directly below
  // image slots (illustration, mascot, logo, photo) built empty in the layout pass, filled after the designer chooses
  SLOT_NAME: /^(illustration|image|logo)_/i,
  // touch area 44 / 48 — team decision: "touch area is the developer's job, no warning in design" (visible 32, 36 buttons are fine)
  TAP_CHECK: false,
  // a layer named status bar / home indicator that is NOT an instance = hand-drawn
  HAND_STATUS_BAR: /status ?bar|home ?indicator/i,
  // errors inside an instance are INHERITED from the component — fix in the main component, not counted on the screen (counted separately: inheritedFromComponent)
  SKIP_INSIDE_INSTANCE: true,
  // designer standard for iPhone Duo: frame variants by name suffix; configurations with a VERTICAL BAR
  // (a child whose name matches VERTICAL_BAR) may use a HORIZONTAL auto-layout root, with no top / bottom safe-area blocks — the vertical bar must be the last layer
  VARIANT_SUFFIX: /_(Outer|Outer Landscape|Inner|Inner Landscape|Intermediate|Book|Tabletop|Tent|Split Left|Split Right|iPad|iPad Landscape)$/,
  VERTICAL_BAR: /pane controls|vertical bar|thanh dọc/i,          // "thanh dọc" = Vietnamese layer name for the vertical bar
  DUO_TOP_BAR: /iphone duo/i,
  // standard Safe-Area: the Device variant must match the screen's device — name suffix → Device. Screen without suffix → DEFAULT_DEVICE
  DEFAULT_DEVICE: "iPhone",
  DEVICE_BY_SUFFIX: { "Outer": "Duo Outer", "Outer Landscape": "Duo Outer", "Inner": "Duo Inner Portrait", "Inner Landscape": "Duo Inner Landscape",
    "Book": "Duo Inner Landscape", "Tabletop": "Duo Inner Portrait", "Tent": "Duo Outer", "Split Left": "Duo Inner Landscape", "Split Right": "Duo Inner Landscape",
    "iPad": "iPad", "iPad Landscape": "iPad" },
  IPAD_SIZES: ["744x1133", "1133x744", "834x1194", "1194x834", "1024x1366", "1366x1024", "1210x834", "834x1210", "1376x1032", "1032x1376"],   // iPad screens without a name suffix → recognised by size
  DUO_MIN_MARGIN: 20,              // Apple minimum margin on Duo (kit Apple Layout Margin 20) — horizontal padding of a pane / block in a pane; the kit's Duo toolbar already holds the status → no top Safe-Area needed
  DUO_MIN_VPAD: 24,                // vertical-bar frames: top / bottom padding instead of Safe-Area (designer decision)
  // designer standard: padding / gap of LAYOUT FRAMES inside a screen (Content, section containers, rows)
  // are RAW NUMBERS ON PURPOSE — only recorded (rawSpacingIntent), not errors. Inside COMPONENTS they must still be bound. false = the project wants everything bound
  RAW_SPACING_IN_SCREEN: true,
  STATE_LANGUAGE: null,            // "fill" → the file shows states with fills: warn about UI frames with strokes
  NOTICE_NAME: /notice|\bnote\b|banner|toast|alert|callout|hint|thông báo|nhắc|ghi chú/i,   // status notices must not dress like content cards (e.g. "Locked Note"); Vietnamese alternatives match Vietnamese layer names
  // backgrounds: component Background/* — its instance must be the BOTTOM layer of the screen; never paint a background straight onto the screen frame
  BACKGROUND_PREFIX: /^background\b/i,
  // system surfaces that cannot blur (apple-design-widget)
  NO_BLUR_SURFACE: /live ?activity|dynamic ?island|widget|lock ?screen/i,
  MAX_ITEMS: 30,                   // max detail items per category in the result
};

// ───────────────────────── recognition
const isGlyphIcon = n => {
  if (n.type !== "TEXT") return false;
  const t = (n.characters || "").trim();
  if (!t || t.length > 3) return false;
  for (const ch of t) {
    const c = ch.codePointAt(0);
    if (CONFIG.GLYPH_RANGES.some(([a, b]) => c >= a && c <= b)) return true;
  }
  return false;
};
const isLabel = n => /^—\s/.test(n.name);
const num = x => typeof x === "number";                               // figma.mixed is a symbol — comparing it would throw
const isPlaceholderImage = n => /^image_/i.test(n.name);
function screensOf(container, out = []) {
  for (const c of container.children) {
    if (c.type === "SECTION") screensOf(c, out);
    else if (c.type === "FRAME" && !isLabel(c)) out.push(c);
  }
  return out;
}
function inVisual(n, screen) {
  for (let p = n; p && p !== screen; p = p.parent) if (/^visual_/i.test(p.name) || (p.type === "INSTANCE" && CONFIG.BACKGROUND_PREFIX.test(p.name))) return true;   // the background is a visual region
  return false;
}
// inside an illustration / image / logo (illustration_ · image_ · logo_) — many vector pieces with their own colours, no tokens needed: skip the nine counts like a
// visual_ region, but STILL check text (sinking into the shape, contrast, overlap). Designer decision: an agent once renamed illustration_ → visual_ to dodge the audit
function inArt(n, screen) {
  for (let p = n; p && p !== screen; p = p.parent) if (CONFIG.SLOT_NAME.test(p.name)) return true;
  return false;
}
function inInstance(n, screen) {
  for (let p = n.parent; p && p !== screen; p = p.parent) if (p.type === "INSTANCE") return true;
  return false;
}

// ───────────────────────── colour, contrast
const varCache = new Map(), collCache = new Map();
async function getVar(id) {
  if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id));
  return varCache.get(id);
}
async function getColl(id) {
  if (!collCache.has(id)) collCache.set(id, await figma.variables.getVariableCollectionByIdAsync(id));
  return collCache.get(id);
}
async function resolveVarColor(variable, modeName) {
  let v = variable, guard = 0;
  while (v && guard++ < 6) {
    const c = await getColl(v.variableCollectionId);
    const mode = (modeName && c.modes.find(m => m.name === modeName)) || c.modes.find(m => m.modeId === c.defaultModeId);
    const val = v.valuesByMode[mode.modeId];
    if (val && val.type === "VARIABLE_ALIAS") { v = await getVar(val.id); continue; }
    return val && num(val.r) ? val : null;
  }
  return null;
}
async function paintColor(p, modeName) {
  if (!p || p.type !== "SOLID" || p.visible === false) return null;
  const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
  if (id) { const v = await getVar(id); if (v) return await resolveVarColor(v, modeName); }
  return p.color;
}
const firstSolid = n => (Array.isArray(n.fills) ? n.fills.find(f => f.type === "SOLID" && f.visible !== false) : null);
const lum = c => [c.r, c.g, c.b].map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  .reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const hex = c => "#" + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
// visible fill — in a test, render_tree created frames with a white fill at OPACITY 0 → read as a white background, 37 false contrastText errors
// (white text on a purple band measured as white on white = 1.00). Fills < 5 % count as none; 5–95 % are blended with the layer below (bgColorAt)
const paintOpacity = f => (f.opacity == null ? 1 : f.opacity);
const solidBg = n => (Array.isArray(n.fills) ? n.fills.find(f => f.type === "SOLID" && f.visible !== false && paintOpacity(f) >= 0.05) : null);
function bgAncestor(n, screen) {
  for (let p = n.parent; p; p = p.parent) {
    if (Array.isArray(p.fills) && p.fills.some(f => f.visible !== false && f.type !== "SOLID" && paintOpacity(f) >= 0.05)) return null;   // image / gradient — not measured here (text: bgColorAt)
    if (solidBg(p)) return p;
    if (p === screen) return null;
  }
  return null;
}

// ───────────────────────── meta text (ux-writing principles §2)
const META = [
  /\b(label|title|subtitle|description|button|text|placeholder|lorem|ipsum|tbd|todo|xxx)\b/i,
  /\b(empty state|cta|paywall|onboarding|toast|modal|bottom sheet|hero|skeleton|tooltip)\b/i,
  /(hành động chính|thành phần|trạng thái rỗng|màn hình này|bấm vào đây sẽ|hiện khi)/i,   // Vietnamese: primary action · component · empty state · this screen · tapping here will · shown when
  /\b\d+\s?(pt|px)\b|#[0-9a-f]{6}\b|\b(bold|semibold|regular|medium)\b/i,
  /\b[a-z]+_[a-z_]+\b|\b(FR|UC|WF|DEC|SCR|ST)-\d+/,
  /[\[{<][^\]}>]{1,40}[\]}>]/,
  /\b[A-Z][\w -]*_(Empty|Loading|Error|Result|Editing|Success|Failed|Step \d+|Variant [A-Z]|Fix)\b/,   // a screen name leaked into the text
];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordRe = w => new RegExp(`(^|[^\\p{L}])${esc(w)}(?=$|[^\\p{L}])`, "iu");
const styleCache = new Map();
// text over a SHAPE (vector, ellipse, image, gradient) lying below it — in a test the digit "1" on a same-tone flame disappeared completely.
// The old contrast check only compared with the parent frame's background (bgAncestor) and never saw a sibling shape directly under the text.
const faint = k => (typeof k.opacity === "number" && k.opacity < 0.95) || (Array.isArray(k.effects) && k.effects.some(e => e.visible !== false && e.type === "LAYER_BLUR"));
const opaqueFills = k => (Array.isArray(k.fills) ? k.fills.filter(f => f.visible !== false && (f.opacity == null ? 1 : f.opacity) >= 0.95) : []);
function hitBelow(k, cx, cy, depth, bgMode) {
  if (!k || k.visible === false || depth > 5) return null;
  if (bgMode && faint(k)) return null;                                   // looking for a background: a faint glow / blur is not the text's background
  const b = k.absoluteBoundingBox;
  if (!b || cx < b.x || cx > b.x + b.width || cy < b.y || cy > b.y + b.height) return null;
  if (k.children) for (let i = k.children.length - 1; i >= 0; i--) { const h = hitBelow(k.children[i], cx, cy, depth + 1, bgMode); if (h) return h; }
  if (k.type === "TEXT") return null;
  const fills = bgMode ? opaqueFills(k) : (Array.isArray(k.fills) ? k.fills.filter(f => f.visible !== false && paintOpacity(f) >= 0.05) : []);
  return fills.length ? k : null;
}
// the text's real background — walk up from the text: at each level look at sibling layers BELOW first (visual_Background, a gradient band), then the
// frame's own fill; semi-transparent fills (a 15 % white pill) are blended with what's below. In a test, 37 false contrastText errors — white text on a purple
// band was measured against a frame's 0-opacity white fill, or against the root frame's white background lying BELOW the visual_Background layer
async function bgColorAt(n, screen, modeName) {
  const bb = n.absoluteBoundingBox; if (!bb) return null;
  const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, veil = [];
  const finish = (c, node, paint) => {
    for (let i = veil.length - 1; i >= 0; i--) { const [v, a] = veil[i]; c = { r: v.r * a + c.r * (1 - a), g: v.g * a + c.g * (1 - a), b: v.b * a + c.b * (1 - a) }; }
    return { c, node, paint: veil.length ? null : paint, blended: veil.length > 0 };
  };
  let child = n;
  for (let p = n.parent; p; child = p, p = p.parent) {
    const kids = p.children || [];
    for (let i = kids.indexOf(child) - 1; i >= 0; i--) {
      const h = hitBelow(kids[i], cx, cy, 0, true);
      if (h) { const c = await colorAt(h, n, modeName); if (!c) return null; const top = opaqueFills(h).slice(-1)[0]; return finish(c, h, top && top.type === "SOLID" ? top : null); }
    }
    const vis = Array.isArray(p.fills) ? p.fills.filter(f => f.visible !== false && paintOpacity(f) >= 0.05) : [];
    const f = vis[vis.length - 1];                                       // the frame's top fill
    if (f) {
      if (paintOpacity(f) >= 0.95) { const c = await colorAt(p, n, modeName); if (!c) return null; return finish(c, p, f.type === "SOLID" ? f : null); }
      if (f.type !== "SOLID") return null;                               // semi-transparent gradient / image — not measured
      const c = await paintColor(f, modeName); if (!c) return null;
      veil.push([c, paintOpacity(f)]);
    }
    if (p === screen) return null;
  }
  return null;
}
// colour of the background layer at the text centre — top fill: SOLID → colour (per mode) · GRADIENT_LINEAR → interpolated at the position · other (image, radial…) → null
async function colorAt(k, n, modeName) {
  const f = opaqueFills(k).slice(-1)[0]; if (!f) return null;
  if (f.type === "SOLID") return await paintColor(f, modeName);
  if (f.type !== "GRADIENT_LINEAR" || !f.gradientStops || !f.gradientTransform) return null;
  const t0 = n.absoluteBoundingBox; if (!t0) return null;
  if (f.gradientStops.some(x => x.color.a != null && x.color.a < 0.95)) return null;   // transparent stop — the colour depends on further layers below
  return gradientAt(f, k, t0.x + t0.width / 2, t0.y + t0.height / 2);
}
// linear-gradient colour at a point (absolute coordinates) — gradientTransform: the layer's normalised coordinates → gradient axis
function gradientAt(f, k, px, py) {
  const b = k.absoluteBoundingBox; if (!b || !b.width || !b.height) return null;
  const u = (px - b.x) / b.width, v = (py - b.y) / b.height, m = f.gradientTransform;
  const t = Math.max(0, Math.min(1, m[0][0] * u + m[0][1] * v + m[0][2]));
  const st = [...f.gradientStops].sort((x, y) => x.position - y.position);
  let i = 0; while (i < st.length - 1 && st[i + 1].position < t) i++;
  const A = st[i], B = st[Math.min(i + 1, st.length - 1)], span = B.position - A.position, w = span > 0 ? Math.max(0, Math.min(1, (t - A.position) / span)) : 0;
  return { r: A.color.r + (B.color.r - A.color.r) * w, g: A.color.g + (B.color.g - A.color.g) * w, b: A.color.b + (B.color.b - A.color.b) * w };
}
function shapeUnder(n, screen) {
  const bb = n.absoluteBoundingBox; if (!bb) return null;
  const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
  let child = n;
  for (let p = n.parent; p; child = p, p = p.parent) {
    const kids = p.children || [];
    for (let i = kids.indexOf(child) - 1; i >= 0; i--) { const h = hitBelow(kids[i], cx, cy, 0); if (h) return h; }
    if (opaqueFills(p).some(f => f.type !== "SOLID")) return p;       // an ancestor frame with a gradient / image background (a purple progress card) is the shape under the text
    if (p === screen || solidBg(p)) return null;                       // reached a frame background — bgAncestor already measures this
  }
  return null;
}
async function shapeColors(k, modeName, n) {
  const out = [], tb = n && n.absoluteBoundingBox;
  for (const f of (k.fills || []).filter(f => f.visible !== false && paintOpacity(f) >= 0.05)) {
    if (f.type === "SOLID") { const c = await paintColor(f, modeName); if (c) out.push(c); }
    // linear gradient: only colours INSIDE the text area (centre + 4 corners) — in a test, 8 false reports: white text on the purple part was compared with
    // the pale stop at the other end of the gradient · radial / angular / diamond: still every stop
    else if (f.type === "GRADIENT_LINEAR" && f.gradientStops && f.gradientTransform && tb)
      for (const [px, py] of [[tb.x + tb.width / 2, tb.y + tb.height / 2], [tb.x, tb.y], [tb.x + tb.width, tb.y], [tb.x, tb.y + tb.height], [tb.x + tb.width, tb.y + tb.height]]) {
        const c = gradientAt(f, k, px, py); if (c) out.push(c);
      }
    else if (/GRADIENT/.test(f.type) && f.gradientStops) out.push(...f.gradientStops.map(st => st.color));
    else if (f.type === "IMAGE") return null;                            // image — can't be measured by colour
  }
  return out.length ? out : null;
}

async function styleNameOf(n) {
  if (!n.textStyleId || n.textStyleId === figma.mixed) return "";
  if (!styleCache.has(n.textStyleId)) styleCache.set(n.textStyleId, ((await figma.getStyleByIdAsync(n.textStyleId)) || {}).name || "");
  return styleCache.get(n.textStyleId);
}
const DEAD_END = /how to|learn more|see all|set up|xem tất cả|tìm hiểu thêm|cách /i;   // Vietnamese: see all · learn more · how to

// ───────────────────────── run
const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { error: `page "${CONFIG.PAGE}" not found — check the page names below and set PAGE`, pages: figma.root.children.map(p => p.name) };
await page.loadAsync();

let screens = screensOf(page);
if (CONFIG.SCREEN_NAMES) screens = screens.filter(s => CONFIG.SCREEN_NAMES.includes(s.name));
const skippedFrames = { editCopies: [], templateScreens: [] };
screens = screens.filter(s => {
  if (CONFIG.EDIT_SUFFIX && s.name.endsWith("_" + CONFIG.EDIT_SUFFIX)) { skippedFrames.editCopies.push(s.name); return false; }
  if (CONFIG.TEMPLATE_FRAMES.includes(s.name)) { skippedFrames.templateScreens.push(s.name); return false; }
  if (/ Flow_Step \d+$/.test(s.name) || new RegExp("_" + CONFIG.FLOW_SUFFIX + " ").test(s.name) || (s.getSharedPluginData && s.getSharedPluginData("designtoolkit", "flowSource"))) { (skippedFrames.flowCopies = skippedFrames.flowCopies || []).push(s.name); return false; }
  return true;
});

const TAP = /android/.test(CONFIG.OS) ? 48 : 44;   // "ios+android" → 48: one layout running on both
const UI = CONFIG.MODE === "ui";
const KEYS = ["fill", "text", "spacing", "radius", "stroke", "effect", "opacity", "group", "tap"];
const totals = {};
const detail = {};
const acceptedMap = new Map(CONFIG.ACCEPTED.map(a => [a.id, a.dec])), accepted = [];
const add = (cat, screen, node, extra) => {
  if (acceptedMap.has(node.id)) { accepted.push({ type: cat, screen: screen.name, node: node.name, id: node.id, dec: acceptedMap.get(node.id) }); return; }
  totals[cat] = (totals[cat] || 0) + 1;
  (detail[cat] = detail[cat] || []);
  if (detail[cat].length < CONFIG.MAX_ITEMS) detail[cat].push({ screen: screen.name, node: node.name, id: node.id, ...(extra || {}) });
};
const perScreen = [];
const detailInfo = {};                                              // recorded, not errors
let rawSpacingIntent = 0;                                            // raw padding / gap on layout frames — the designer's intent
let inherited = 0;                                                  // nodes inside instances, not counted
const nine = {};                                                       // the nine counts — totals per kind
const notHandled = [];
let contrastUnmeasured = 0, slotTotal = 0;
const slotList = [];
const modeNames = new Set(CONFIG.CONTRAST_MODES || []);

for (const screen of screens) {
  const raw = Object.fromEntries(KEYS.map(k => [k, 0]));
  let placeholders = 0, slots = 0, artLayers = 0, frames = 0, instances = 0;

  // root frame structure
  const isVariant = CONFIG.VARIANT_SUFFIX.test(screen.name);
  const sizeKey = `${Math.round(screen.width)}x${Math.round(screen.height)}`;
  const sufM = screen.name.match(CONFIG.VARIANT_SUFFIX);
  const screenDevice = sufM ? (CONFIG.DEVICE_BY_SUFFIX[sufM[1]] || CONFIG.DEFAULT_DEVICE) : CONFIG.IPAD_SIZES.includes(sizeKey) ? "iPad" : CONFIG.DEFAULT_DEVICE;
  const vBar = screen.layoutMode === "HORIZONTAL" && (screen.children || []).some(c => CONFIG.VERTICAL_BAR.test(c.name));
  if (screen.layoutMode !== "NONE" && !vBar) add("rootAutoLayout", screen, screen, { layoutMode: screen.layoutMode });
  if (vBar) {                                                       // the vertical bar is the last layer in the auto-layout flow (ABS overlays don't count)
    const flow = screen.children.filter(c => c.visible !== false && c.layoutPositioning !== "ABSOLUTE");
    const last = flow[flow.length - 1];
    if (!last || !CONFIG.VERTICAL_BAR.test(last.name)) add("verticalBarNotAtEdge", screen, last || screen, { hint: "Pane controls must be the last layer of the horizontal root — it sits at the hardware edge" });
  }
  if (!isVariant && screenDevice === CONFIG.DEFAULT_DEVICE && Math.round(screen.width) !== CONFIG.FRAME.w) add("frameSize", screen, screen, { size: `${Math.round(screen.width)}×${Math.round(screen.height)}` });
  if (screen.height > CONFIG.FRAME.h + 1) {
    const fold = screen.findOne(n => /^—\s*fold/i.test(n.name));
    add("tallScreen", screen, screen, { height: Math.round(screen.height), foldLine: !!fold, note: "real overflow or an intentional scroll illustration? — ask, don't guess" });
  }

  // screen lying OUTSIDE the section that holds it (in a test: moved into a section while keeping page coordinates → the screen drifted far away, the designer couldn't see it)
  if (screen.parent && screen.parent.type === "SECTION") {
    const sp = screen.parent, tol = 1;
    if (screen.x < -tol || screen.y < -tol || screen.x + screen.width > sp.width + tol || screen.y + screen.height > sp.height + tol)
      add("outsideSection", screen, screen, { section: sp.name, position: `${Math.round(screen.x)}, ${Math.round(screen.y)}`, sectionSize: `${Math.round(sp.width)}×${Math.round(sp.height)}`,
        hint: "set x / y RELATIVE to the section (or enlarge the section)" });
  }

  // background — a Background/* instance at the bottom layer; the screen frame doesn't paint its own gradient / image background
  {
    const kids = screen.children || [];
    const bgIdx = [];
    for (let i = 0; i < kids.length; i++) if (kids[i].type === "INSTANCE" && CONFIG.BACKGROUND_PREFIX.test(kids[i].name)) bgIdx.push(i);
    if (bgIdx.length && bgIdx[0] !== 0) add("backgroundNotAtBottom", screen, kids[bgIdx[0]], { position: bgIdx[0], hint: "move the background instance to the bottom layer (index 0)" });
    if (bgIdx.length > 1) add("duplicateBackground", screen, kids[bgIdx[1]], { count: bgIdx.length });
    const rootPaint = Array.isArray(screen.fills) && screen.fills.find(f => f.visible !== false && f.type !== "SOLID");
    if (rootPaint) add("backgroundPaintedOnFrame", screen, screen, { type: rootPaint.type, hint: "a background is a Background/* component placed as the bottom instance — screen-background skill" });
  }
  // blur on system surfaces that can't blur (Live Activity, Dynamic Island, widget)
  if (CONFIG.NO_BLUR_SURFACE.test(screen.name) || (screen.parent && CONFIG.NO_BLUR_SURFACE.test(screen.parent.name || ""))) {
    for (const n of [screen, ...screen.findAll(x => Array.isArray(x.effects) && x.effects.length)])
      for (const e of n.effects || []) if (e.visible !== false && (e.type === "BACKGROUND_BLUR" || e.type === "LAYER_BLUR"))
        add("blurOnSystemSurface", screen, n, { effect: e.type, hint: "this surface can't blur — use one solid colour from an alpha token" });
  }

  // screen name
  {
    const nm = [CONFIG.AGENT_SUFFIX, CONFIG.EDIT_SUFFIX].reduce((n, x) => x && n.endsWith("_" + x) ? n.slice(0, -(x.length + 1)) : n, screen.name), bad = [];
    if (/[.·\/]/.test(nm)) bad.push("contains a dot or / — use - for hierarchy, _ to separate the state");
    if (/\s[-_]|[-_]\s/.test(nm)) bad.push("spaces around - or _");
    if (/[-_]{2,}|^[-_]|[-_]$/.test(nm)) bad.push("extra separator");
    if (/\s{2,}/.test(nm)) bad.push("two spaces in a row");
    if (bad.length) add("screenName", screen, screen, { error: bad.join(" · ") });
    else {
      const [, ...suf] = nm.split("_");
      if (!suf.length) add("nameMissingSuffix", screen, screen, { hint: "add _<state> — bnnam-standards naming" });
      const odd = suf.filter(x => !CONFIG.SUFFIXES.includes(x) && !CONFIG.EXTRA_SUFFIXES.includes(x) && !/^Step \d+$/.test(x) && !/^Variant [A-Z]$/.test(x));
      if (odd.length) add("unknownSuffix", screen, screen, { suffix: odd.join(", "), hint: "a new state from the flow file? add it to the suffix table, or rename" });
    }
  }

  // status bar matches the device — e.g. an iPad screen using an iPhone status bar
  for (const sb of screen.findAll(x => x.type === "INSTANCE" && /status ?bar/i.test(x.name))) {
    let m = null; try { m = await sb.getMainComponentAsync(); } catch (e) {}
    const nm = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name + " " + m.name : m.name) : sb.name;
    const isPhone = /iphone/i.test(nm) && !/duo/i.test(nm), isPad = /ipad/i.test(nm), isDuo = /duo/i.test(nm);
    const bad = (screenDevice === "iPad" && !isPad) || (screenDevice === "iPhone" && (isPad || isDuo)) || (/^Duo/.test(screenDevice) && isPad);
    if (bad) add("statusBarWrongDevice", screen, sb, { status: nm.slice(0, 50), screenDevice: screenDevice });
  }
  // Duo with a vertical bar (Outer, Inner Landscape, Split…): NO Safe-Area — left / top / bottom padding; the side next to the vertical bar = 0
  // (designer decision — replaces the old rule "Safe-Area 24 in each pane")
  if (vBar) {
    const flow = screen.children.filter(c => c.visible !== false && c.layoutPositioning !== "ABSOLUTE");
    const barIdx = flow.findIndex(c => CONFIG.VERTICAL_BAR.test(c.name));
    const barSide = barIdx === 0 ? "paddingLeft" : "paddingRight";          // Split Left: the bar is on the left edge → swap sides
    const outerSide = barSide === "paddingLeft" ? "paddingRight" : "paddingLeft";
    const panes = flow.filter(c => !CONFIG.VERTICAL_BAR.test(c.name) && c.type === "FRAME");
    const adjacent = barIdx === 0 ? flow[1] : flow[barIdx - 1];             // the pane right next to the vertical bar
    for (const pane of panes) {
      const inner = pane.layoutMode === "HORIZONTAL" ? pane.children.filter(c => c.type === "FRAME" && c.visible !== false) : [pane];   // a horizontal Container wrapping panes
      for (const pn of inner) {
        for (const k of pn.findAll(x => x.type === "INSTANCE" && /safe.?area/i.test(x.name)))
          add("safeArea", screen, k, { where: `${pn.name}`, error: "extra Safe-Area — vertical-bar frames use left / top / bottom padding, no Safe-Area frame" });
        const blocks = [pn, ...(pn.children || []).filter(c => c.type === "FRAME" && c.layoutMode && c.layoutMode !== "NONE" && c.layoutSizingHorizontal === "FILL")];
        for (const b of blocks) {
          // 0 = content / background bleeding to the edge on purpose → not reported; when there is padding it must reach the minimum
          if (num(b[outerSide]) && b[outerSide] > 0 && b[outerSide] < CONFIG.DUO_MIN_MARGIN)
            add("duoMarginBelowApple", screen, b, { side: outerSide, value: b[outerSide], need: `≥ ${CONFIG.DUO_MIN_MARGIN}` });
          for (const side of ["paddingTop", "paddingBottom"]) if (num(b[side]) && b[side] > 0 && b[side] < CONFIG.DUO_MIN_VPAD)
            add("duoMarginBelowApple", screen, b, { side: side, value: b[side], need: `≥ ${CONFIG.DUO_MIN_VPAD}` });
          if ((pane === adjacent) && num(b[barSide]) && b[barSide] > 0)
            add("duoPaddingNextToBar", screen, b, { side: barSide, value: b[barSide], need: "0 — content sits against the vertical bar; the Pane controls padding provides the gap" });
        }
      }
    }
  }

  // safe area from a component — first instance of the top block, last instance of the bottom block
  if (CONFIG.SAFE_AREA && !vBar) {                                   // vertical-bar configuration: the status sits inside the vertical bar — no top / bottom blocks
    const kids = (screen.children || []).filter(k => k.visible !== false && Math.abs(k.width - screen.width) < 1
      && !/^visual_/i.test(k.name) && !CONFIG.BACKGROUND_PREFIX.test(k.name) && Math.abs(k.height - screen.height) >= 1);   // a full-screen background layer is not a top / bottom block
    // several blocks can touch an edge (Content scrolls under the bars and often reaches the bottom) → take the TOPMOST layer: Top / Bottom Container sit above Content
    const topBox = kids.filter(k => Math.abs(k.y) < 1).pop();
    const botBox = kids.filter(k => Math.abs(k.y + k.height - screen.height) < 1 && k !== topBox).pop();
    const check = async (box, want, h, pick, where) => {
      if (!want) return;
      if (isVariant && where === "top" && box && box.type === "INSTANCE") { const bm = await box.getMainComponentAsync(); if (bm && CONFIG.DUO_TOP_BAR.test((bm.parent && bm.parent.type === "COMPONENT_SET" ? bm.parent.name : bm.name))) return; }   // the kit's Duo toolbar already holds the status
      if (screenDevice === "Duo Inner Portrait" && where === "top") {   // the 84 band is the system bar — no Safe-Area Top
        const first = box && box.children && box.children[0];
        const fm = first && first.type === "INSTANCE" ? await first.getMainComponentAsync() : null;
        const fn = fm ? (fm.parent && fm.parent.type === "COMPONENT_SET" ? fm.parent.name : fm.name) : "";
        if (CONFIG.DUO_TOP_BAR.test(fn)) return;
        if (first && /safe/i.test(first.name)) return add("safeArea", screen, first, { where: where, error: "extra Safe-Area Top — on Duo Inner Portrait the top 84 band is the system bar (Toolbar - Top - iPhone Duo)" });
        return add("safeArea", screen, box || screen, { where: where, error: "the top block must be the Duo system bar (Toolbar - Top - iPhone Duo, 84)" });
      }
      if (!box || !box.children || !box.children.length) return add("safeArea", screen, screen, { where: where, error: "no " + where + " block" });
      const k = pick(box.children);
      if (isVariant && where === "top" && k.type === "INSTANCE") { const km = await k.getMainComponentAsync(); if (km && CONFIG.DUO_TOP_BAR.test((km.parent && km.parent.type === "COMPONENT_SET" ? km.parent.name : km.name))) return; }
      if (k.type !== "INSTANCE") return add("safeArea", screen, k, { where: where, error: `the ${where === "top" ? "first" : "last"} layer is ${k.type}, not an instance of "${want}" — hand-drawn or detached` });
      const m = await k.getMainComponentAsync();
      const mn = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name) : null;
      if (mn !== want) return add("safeArea", screen, k, { where: where, error: `instance of "${mn}", need "${want}"` });
      const dev = (() => { try { return (k.variantProperties || {}).Device; } catch (e) { return null; } })();   // standard set Position × Device — the component decides the height; a broken set throws → treat as no Device
      if (dev) {
        const need = screenDevice;
        if (dev !== need) add("safeArea", screen, k, { where: where, error: `variant Device=${dev}, the screen needs Device=${need}` });
        return;
      }
      if (isVariant) { (detailInfo.safeAreaVariants = detailInfo.safeAreaVariants || []).push(`${screen.name} › ${where} height ${Math.round(k.height)}`); return; }   // Duo values WAITING for the designer's decision — recorded only
      if (h && Math.round(k.height) !== h) add("safeArea", screen, k, { where: where, error: `height ${Math.round(k.height)}, need ${h}` });
    };
    await check(topBox, CONFIG.SAFE_AREA.top, CONFIG.SAFE_AREA.topH, c => c[0], "top");
    await check(botBox, CONFIG.SAFE_AREA.bottom, CONFIG.SAFE_AREA.bottomH, c => c[c.length - 1], "bottom");
  }

  const nodes = screen.findAll(() => true);
  for (const n of nodes) {
    const visual = inVisual(n, screen);
    if (n.type === "FRAME") frames++;
    if (n.type === "INSTANCE") instances++;

    // a main component inside a screen
    if (n.type === "COMPONENT" || n.type === "COMPONENT_SET") add("componentInScreen", screen, n);
    // default names
    if (n.type === "FRAME" && /^Frame \d+$/.test(n.name)) add("genericFrameName", screen, n);
    // a dev note that slipped into the screen — ux-review-handoff handoff-spec §3
    if (n.type === "INSTANCE" && n.name === CONFIG.DEV_NOTE) add("devNoteInScreen", screen, n);
    // hand-drawn status bar / home indicator — Safe-Area is empty space, not drawn (designer decision: clones drew it by hand twice)
    if (n.type !== "INSTANCE" && CONFIG.HAND_STATUS_BAR.test(n.name) && !inInstance(n, screen))
      add("handDrawnStatusBar", screen, n, { error: "delete — this spot is a Safe-Area instance; for the kit's status bar (iPhone Duo) use the instance" });

    if (n.type === "TEXT") {
      const glyph = isGlyphIcon(n);
      if (glyph) {
        // glyph health
        const bad = [];
        if (n.textStyleId) bad.push("has a text style");
        if (n.fontName !== figma.mixed && !CONFIG.SYMBOL_FONTS.includes(n.fontName.family)) bad.push(`font ${n.fontName.family}`);
        if (n.letterSpacing !== figma.mixed && n.letterSpacing.value !== 0) bad.push("letter spacing ≠ 0");
        if (n.lineHeight !== figma.mixed && n.lineHeight.unit !== "AUTO") bad.push("line height ≠ AUTO");
        if (bad.length) add("glyphHealth", screen, n, { error: bad.join(" · ") });
      } else if (!visual) {
        const c = n.characters.trim();
        // meta text — ux-writing principles §2
        if (META.some(r => r.test(c))) add("metaText", screen, n, { text: c.slice(0, 60) });
        if (c.toLowerCase() === n.name.toLowerCase() && /^(title|label|text|button)/i.test(c)) add("placeholderText", screen, n, { text: c });
        for (const w of CONFIG.FORBIDDEN_WORDS) if (wordRe(w).test(c)) add("forbiddenWord", screen, n, { word: w });
        for (const t of CONFIG.TERMS) for (const a of t.avoid || []) if (wordRe(a).test(c)) add("termMismatch", screen, n, { use: t.use, insteadOf: a });
        if (DEAD_END.test(c)) add("deadEndCandidate", screen, n, { text: c.slice(0, 60), check: "is there a destination screen in flows.md?" });
        // length — heuristic from the instance name / text style name
        const words = c.split(/\s+/).filter(Boolean).length;
        let inButton = false;
        for (let p = n.parent; p && p !== screen; p = p.parent) if (p.type === "INSTANCE" && /button|btn|nút/i.test(p.name)) { inButton = true; break; }   // "nút" = Vietnamese "button"
        const styleName = await styleNameOf(n);
        if (inButton && CONFIG.LIMITS.buttonChars && c.length > CONFIG.LIMITS.buttonChars) add("length", screen, n, { type: "button", text: c, limit: CONFIG.LIMITS.buttonChars });
        if (/subtitle|subhead/i.test(styleName)) { if (CONFIG.LIMITS.subtitleWords && words > CONFIG.LIMITS.subtitleWords) add("length", screen, n, { type: "subtitle", words: words }); }
        else if (/title|heading|headline/i.test(styleName) && CONFIG.LIMITS.titleWords && words > CONFIG.LIMITS.titleWords) add("length", screen, n, { type: "title", words: words });
        if (CONFIG.CASE && (inButton || /title|heading|headline/i.test(styleName))) {
          const ws = c.split(/\s+/).filter(w => /\p{L}/u.test(w));
          const upperLater = ws.slice(1).filter(w => w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()).length;
          if (CONFIG.CASE === "sentence" && upperLater) add("caseCheck", screen, n, { text: c, note: "capital letter mid-sentence — ignore proper names" });
          if (CONFIG.CASE === "title" && ws.length > 1 && upperLater < ws.length - 1) add("caseCheck", screen, n, { text: c });
        }
        // text contrast — WCAG AA: 4.5 · large text 3.0 (≥ 24px, or ≥ 18.66px bold)
        // text and background both tokens → the system handles contrast; a failure means the WRONG PAIR was picked → suggest another token (not an error)
        // raw colour → an error to fix
        if (UI) {
          const fg = firstSolid(n);
          if (!fg) contrastUnmeasured++;
          else {
            const size = num(n.fontSize) ? n.fontSize : 0;
            const bold = n.fontName && n.fontName !== figma.mixed && /bold|heavy|black/i.test(n.fontName.style || "");
            const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
            const fgVar = fg.boundVariables && fg.boundVariables.color;
            const modes = modeNames.size ? [...modeNames] : [null];
            for (const m of modes) {
              // the real background at the text centre — layer below / frame fill / gradient; semi-transparent fills are blended (bgColorAt)
              const a = await paintColor(fg, m), bg = await bgColorAt(n, screen, m), b = bg && bg.c;
              if (!a || !b) { contrastUnmeasured++; continue; }
              const r = ratio(a, b);
              if (r >= need) continue;
              const bgPaint = bg.paint, bgVar = bgPaint && bgPaint.boundVariables && bgPaint.boundVariables.color;
              const info = { mode: m || "default", ratio: +r.toFixed(2), need: need, disabled: /disable/i.test(n.parent ? n.parent.name : ""), bgLayer: bg.node.name, ...(bg.blended ? { bgBlended: true } : {}) };
              if (fgVar && bgVar) {
                const fv = await figma.variables.getVariableByIdAsync(fgVar.id), bv = await figma.variables.getVariableByIdAsync(bgVar.id);
                add("contrastTokenPair", screen, n, { ...info, text: fv ? fv.name : "?", bg: bv ? bv.name : "?" });
              } else add("contrastText", screen, n, { ...info, text: fgVar ? "token" : hex(a), bg: bgVar ? "token" : hex(b) });
            }
          }
          // text sinking into the shape directly below — measured against EVERY colour of the shape (gradient: each stop), worst ratio taken
          const sh = fg && CONFIG.TEXT_OVER_SHAPE ? shapeUnder(n, screen) : null;
          if (sh) {
            const cols = await shapeColors(sh, null, n), a = await paintColor(fg, null);
            if (!cols || !a) contrastUnmeasured++;
            else {
              const worst = Math.min(...cols.map(c => ratio(a, c)));
              if (worst < CONFIG.TEXT_OVER_SHAPE_MIN)
                add("textLostOnShape", screen, n, { text: (n.characters || "").slice(0, 30), shape: sh.name, worstRatio: +worst.toFixed(2), need: CONFIG.TEXT_OVER_SHAPE_MIN,
                  hint: "change the text colour / add an outline or shadow, or change the shape's tone so the text reads — compare zoomed in next to the source image" });
            }
          }
        }
      }
    }

    // faded card background — a background fill (by variable name, or a solid fill on a frame with children) with opacity < 1
    if (UI && !inArt(n, screen) && typeof n.opacity === "number" && n.opacity < 1 && n.opacity > 0 && Array.isArray(n.fills) && n.fills.some(f => f.visible !== false && f.type === "SOLID")) {
      const fv = n.fills.find(f => f.visible !== false && f.boundVariables && f.boundVariables.color);
      let vname = ""; if (fv) { const v = await figma.variables.getVariableByIdAsync(fv.boundVariables.color.id); vname = v ? v.name : ""; }
      if ((vname && CONFIG.CARD_FILL.test(vname)) || (!vname && (n.type === "FRAME" || n.type === "INSTANCE") && n.children && n.children.length))
        add("fadedCardBackground", screen, n, { opacity: n.opacity, bg: vname || "raw colour", hint: "put the opacity on the content inside; keep the background at 100%" });
    }

    // image slots waiting for the designer's choice · counted EVERYWHERE, even inside visual_ / art regions (in a test a character frame inside a
    // visual_ hero was missed and the agent reported "no slots left" while one remained)
    // an image placed via an IMAGE fill (generated) is filled, not empty (in a test 4 frames that already had images were reported empty)
    if (n.type === "FRAME" && CONFIG.SLOT_NAME.test(n.name) && !(n.children && n.children.length)) {
      if (Array.isArray(n.fills) && n.fills.some(f => f.type === "IMAGE" && f.visible !== false)) { artLayers++; continue; }
      slots++; slotTotal++; slotList.push(`${screen.name} › ${n.name}`); continue;
    }
    if (visual) continue;                                              // visual region — skip the nine counts
    if (inArt(n, screen)) { artLayers++; continue; }                   // inside an illustration / image / logo — skip the nine counts, counted separately
    if (isPlaceholderImage(n)) { placeholders++; continue; }           // expected — counted separately
    if (CONFIG.SKIP_INSIDE_INSTANCE && inInstance(n, screen)) { inherited++; continue; }   // fix in the main component

    // stale paint — the variable is bound but the paint colour is still the old one: Figma DRAWS the old colour while every binding count passes
    // (boundVariables assigned by hand in execute_code). Fix: rebind with setBoundVariableForPaint / update_nodes {var}
    for (const field of ["fills", "strokes"]) {
      const paints = Array.isArray(n[field]) ? n[field] : [];
      for (let i = 0; i < paints.length; i++) {
        const p = paints[i], vid = p.type === "SOLID" && p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
        if (!vid) continue;
        const v = await getVar(vid);
        if (!v || v.remote || typeof v.resolveForConsumer !== "function") continue;
        let val = null; try { val = v.resolveForConsumer(n).value; } catch (e) { continue; }
        if (val && num(val.r) && ["r", "g", "b"].some(k => Math.abs(p.color[k] - val[k]) > 1 / 255))
          add("stalePaint", screen, n, { layer: `${field}[${i}]`, variable: v.name, value: hex(val), paint: hex(p.color), hint: "rebind — setBoundVariableForPaint or update_nodes {var}" });
      }
    }

    // the file expresses states with FILLS but a UI frame has a stroke
    if (CONFIG.STATE_LANGUAGE === "fill" && (n.type === "FRAME" || n.type === "INSTANCE") && Array.isArray(n.strokes) && n.strokes.some(t => t.visible !== false) && num(n.strokeWeight) && n.strokeWeight > 0)
      add("strokeAgainstStateLanguage", screen, n, { hint: "the file shows state with fills — remove the stroke, distinguish with a fill token" });
    // a status notice with a background like a content card
    if (CONFIG.NOTICE_NAME.test(n.name) && !n.name.startsWith(CONFIG.DEV_NOTE) && (n.type === "FRAME" || n.type === "INSTANCE")) {
      const why = [firstSolid(n) && "has a fill", num(n.cornerRadius) && n.cornerRadius > 0 && "rounded corners", Array.isArray(n.strokes) && n.strokes.some(t => t.visible !== false) && "stroke"].filter(Boolean);
      if (why.length) add("noticeLooksLikeCard", screen, n, { because: why.join(" · "), hint: "a status notice must look different from content cards — learn the form from notices already in the file" });
    }

    // the nine counts
    const B = n.boundVariables || {};
    if (Array.isArray(n.fills) && n.fills[0] && n.fills[0].type === "SOLID" && !(n.fills[0].boundVariables && n.fills[0].boundVariables.color)) raw.fill++;
    if (n.type === "TEXT" && !n.textStyleId && !isGlyphIcon(n)) raw.text++;
    if (n.layoutMode && n.layoutMode !== "NONE")
      for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "itemSpacing"])
        if (num(n[k]) && n[k] > 0 && !B[k]) { if (CONFIG.RAW_SPACING_IN_SCREEN && n.type === "FRAME") rawSpacingIntent++; else raw.spacing++; }
    if (num(n.cornerRadius) && n.cornerRadius > 0 && !B.topLeftRadius) raw.radius++;
    if (Array.isArray(n.strokes) && n.strokes.length && num(n.strokeWeight) && n.strokeWeight > 0 && !B.strokeWeight) raw.stroke++;
    if (Array.isArray(n.effects) && n.effects.length && !n.effectStyleId) raw.effect++;
    if (num(n.opacity) && n.opacity < 1 && !(n.children && n.children.length > 1 && /disable/i.test(n.name))) { raw.opacity++; add("opacity", screen, n, { opacity: n.opacity }); }
    if (n.type === "GROUP") { raw.group++; add("group", screen, n); }
    // touch area: off by default — the developer's job (team decision)
    if (CONFIG.TAP_CHECK && n.reactions && n.reactions.length && (n.width < TAP || n.height < TAP)) { raw.tap++; add("tap", screen, n, { size: `${Math.round(n.width)}×${Math.round(n.height)}`, need: TAP }); }

    // wireframe: brand colour, text in image boxes
    if (!UI && Array.isArray(n.fills)) {
      const f = firstSolid(n);
      if (f) { const { r, g, b } = f.color; if (Math.max(r, g, b) - Math.min(r, g, b) > 0.08) add("colorInWireframe", screen, n, { color: hex(f.color) }); }
    }

    if (!UI || inInstance(n, screen)) continue;

    // surface vs background ~1.2 — only without stroke and shadow
    if (n !== screen && ["FRAME", "RECTANGLE", "INSTANCE", "COMPONENT"].includes(n.type) && solidBg(n)
        && !(Array.isArray(n.strokes) && n.strokes.length) && !(Array.isArray(n.effects) && n.effects.length)) {
      const bgNode = bgAncestor(n, screen);
      if (bgNode) {
        const modes = modeNames.size ? [...modeNames] : [null];
        for (const m of modes) {
          const a = await paintColor(solidBg(n), m), b = await paintColor(solidBg(bgNode), m);
          if (!a || !b) continue;
          const r = ratio(a, b);
          if (r > 1.001 && r < 1.2) add("contrastSurface", screen, n, { mode: m || "default", ratio: +r.toFixed(2), surface: hex(a), bg: hex(b) });
        }
      }
    }

    // overflow — fixed-size auto layout
    if (n.layoutMode && n.layoutMode !== "NONE" && n.children) {
      const horiz = n.layoutMode === "HORIZONTAL";
      const fixed = horiz ? n.layoutSizingHorizontal === "FIXED" : n.layoutSizingVertical === "FIXED";
      const kids = n.children.filter(k => k.visible !== false && k.layoutPositioning !== "ABSOLUTE");
      if (fixed && kids.length && n.layoutWrap !== "WRAP") {
        const gap = num(n.itemSpacing) ? n.itemSpacing : 0;
        const need = kids.reduce((s, k) => s + (horiz ? k.width : k.height), 0) + gap * (kids.length - 1)
          + (horiz ? n.paddingLeft + n.paddingRight : n.paddingTop + n.paddingBottom);
        const have = horiz ? n.width : n.height;
        if (need > have + 0.5) add("overflow", screen, n, { need: Math.round(need), have: Math.round(have) });
      }
      // adjacent radii · report only, never fix
      for (let i = 0; i + 1 < kids.length; i++) {
        const a = kids[i], b = kids[i + 1];
        if (a.type === "TEXT" || b.type === "TEXT") continue;
        const [big, small] = a.height >= b.height ? [a, b] : [b, a];
        if (num(big.cornerRadius) && big.cornerRadius > 0 && Math.abs(big.cornerRadius - small.height / 2) > 1)
          add("adjacentRadius", screen, big, { radius: big.cornerRadius, shouldBe: small.height / 2, nextTo: small.name });
      }
      // concentric radii — a block sitting against the inner corner of a rounded frame: inner radius = outer radius − padding (designer decision) · report only
      if (num(n.cornerRadius) && n.cornerRadius > 0) {
        const pl = n.paddingLeft || 0, pr = n.paddingRight || 0, pt = n.paddingTop || 0, pb = n.paddingBottom || 0;
        for (const c of kids) {
          if (c.type === "TEXT" || !num(c.cornerRadius) || c.cornerRadius <= 0) continue;
          const left = Math.abs(c.x - pl) <= 1, right = Math.abs(c.x + c.width - (n.width - pr)) <= 1;
          const top = Math.abs(c.y - pt) <= 1, bottom = Math.abs(c.y + c.height - (n.height - pb)) <= 1;
          if (!((left || right) && (top || bottom))) continue;
          const pad = Math.min(left ? pl : pr, top ? pt : pb);
          const want = Math.max(0, n.cornerRadius - pad);
          if (Math.abs(c.cornerRadius - want) > 1)
            add("concentricRadius", screen, c, { radius: c.cornerRadius, shouldBe: want, frame: n.name, frameRadius: n.cornerRadius, padding: pad });
        }
      }
    }
  }

  // floating layer over text — only when the floating layer is ABOVE the text in layer order (text above a decorative shape is normal)
  if (CONFIG.FLOAT_OVER_TEXT) {
    const box = n => n.absoluteBoundingBox || { x: n.absoluteTransform[0][2], y: n.absoluteTransform[1][2], width: n.width, height: n.height };
    const path = n => { const out = []; for (let c = n; c && c !== screen; c = c.parent) out.unshift(c.parent.children.indexOf(c)); return out; };
    const above = (a, b) => { const pa = path(a), pb = path(b); for (let i = 0; i < Math.min(pa.length, pb.length); i++) if (pa[i] !== pb[i]) return pa[i] > pb[i]; return false; };
    const shown = n => { for (let c = n; c && c !== screen; c = c.parent) if (c.visible === false) return false; return true; };
    const texts = nodes.filter(t => t.type === "TEXT" && shown(t) && !inVisual(t, screen));
    const floats = nodes.filter(f => f.type !== "TEXT" && f.parent !== screen && shown(f) && !inVisual(f, screen) && !inInstance(f, screen)
      && (f.layoutPositioning === "ABSOLUTE" || (f.parent && f.parent.type !== "INSTANCE" && f.parent.layoutMode === "NONE")));
    for (const f of floats) {
      const a = box(f);
      for (const t of texts) {
        { let own = false; for (let c = t.parent; c && c !== screen; c = c.parent) if (c === f) { own = true; break; } if (own) continue; }   // the floating layer's own text
        const b = box(t);
        const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x), oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        if (ox < CONFIG.FLOAT_MIN_OVERLAP || oy < CONFIG.FLOAT_MIN_OVERLAP || !above(f, t)) continue;
        add("floatOverText", screen, f, { text: (t.characters || "").slice(0, 40), textId: t.id, overlap: `${Math.round(ox)}×${Math.round(oy)}`,
          hint: "move the floating layer into the auto-layout flow, or shift it / leave room for the text — intentional (a badge over a label) → record a decision in ACCEPTED" });
        break;
      }
    }
  }

  // instance that lost its main component — stale overrides after a library swap
  const insts = nodes.filter(n => n.type === "INSTANCE");
  for (let i = 0; i < insts.length; i += 50) {
    const mains = await Promise.all(insts.slice(i, i + 50).map(x => x.getMainComponentAsync().catch(() => null)));
    mains.forEach((m, j) => { if (!m) add("brokenInstance", screen, insts[i + j]); });
  }

  const counted = Object.fromEntries(KEYS.filter(k => {
    const sys = { fill: "fill", text: "text", spacing: "spacing", radius: "radius", stroke: "stroke", effect: "effect" }[k];
    return !sys || CONFIG.SYSTEMS[sys];
  }).map(k => [k, raw[k]]));
  for (const [k, v] of Object.entries(counted)) nine[k] = (nine[k] || 0) + v;
  perScreen.push({ screen: screen.name, ...counted, placeholderImages: placeholders, emptySlots: slots, artLayers: artLayers, instance: instances, frame: frames,
    instanceFrameRatio: frames ? +(instances / frames).toFixed(2) : null });
}

// duplicate component names on every page
const duplicates = [], nearDuplicates = [];
if (CONFIG.CHECK_DUPLICATES) {
  const seen = new Map(), loose = new Map();
  // near duplicates: the same thing under two names, or a project component repeating an atom — candidates only, a person decides
  const looseKey = name => {
    let n = name.trim();
    if (CONFIG.PROJECT_PREFIX && n.startsWith(CONFIG.PROJECT_PREFIX)) n = n.slice(CONFIG.PROJECT_PREFIX.length);
    return n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  };
  for (const p of figma.root.children) {
    await p.loadAsync();
    for (const c of p.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })) {
      if (c.type === "COMPONENT" && c.parent && c.parent.type === "COMPONENT_SET") continue;
      const k = c.name.trim().toLowerCase();
      if (!seen.has(k)) seen.set(k, []);
      seen.get(k).push(`${p.name} › ${c.name}`);
      const lk = looseKey(c.name);
      if (!loose.has(lk)) loose.set(lk, new Set());
      loose.get(lk).add(c.name.trim());
    }
  }
  for (const [, where] of seen) if (where.length > 1) duplicates.push(where);
  for (const [, names] of loose) if (names.size > 1) nearDuplicates.push([...names]);
} else notHandled.push("duplicate component names — CHECK_DUPLICATES = false");
if (slotTotal) notHandled.push(`${slotTotal} image slots still empty (${slotList.slice(0, 10).join(" · ")}) — draft: ask the designer (a) agent draws vectors / (b) generate an image / (c) the designer finds one; final: only slots the designer agreed to fill themselves remain`);
if (UI && contrastUnmeasured) notHandled.push(`${contrastUnmeasured} text/background pairs whose contrast couldn't be measured (image background, gradient, or no fill) — check by eye`);
if (skippedFrames.editCopies.length) notHandled.push(`${skippedFrames.editCopies.length} "${CONFIG.EDIT_SUFFIX}" copies the designer is editing — not audited; learn from them (figma-project-maintain)`);
if (skippedFrames.templateScreens.length) notHandled.push(`template screens not audited (copied from another file): ${skippedFrames.templateScreens.join(", ")}`);
if (!CONFIG.SAFE_AREA) notHandled.push("safe area not checked — SAFE_AREA = null");
if (!UI) notHandled.push("wireframe mode: the nine counts are information — raw greys allowed if the kit has no tokens");
for (const [k, v] of Object.entries(CONFIG.SYSTEMS)) if (!v) notHandled.push(`"${k}" not counted — the file has no matching system`);

// ───────────────────────── report
const mustBeZero = ["rootAutoLayout", "safeArea", "verticalBarNotAtEdge", "statusBarWrongDevice", "duoMarginBelowApple", "duoPaddingNextToBar", "screenName", "fadedCardBackground", "stalePaint", "floatOverText", "outsideSection", "textLostOnShape", "handDrawnStatusBar", "backgroundNotAtBottom", "duplicateBackground", "blurOnSystemSurface", "componentInScreen", "genericFrameName", "devNoteInScreen", "metaText", "placeholderText",
  "forbiddenWord", "termMismatch", "glyphHealth", "brokenInstance", "contrastText", "tap", "opacity", "group"];
const errors = Object.fromEntries(mustBeZero.filter(k => totals[k] && !["tap", "opacity", "group"].includes(k)).map(k => [k, totals[k]]));
for (const [k, v] of Object.entries(nine)) if (v && (UI || ["opacity", "group", "tap"].includes(k))) errors[k] = v;   // the nine counts — reported per kind
const nineInfo = UI ? null : nine;                                     // wireframe: fill/text/spacing… are information only
const decide = [];
if (totals.frameSize) decide.push(`${totals.frameSize} screens differ from the standard size ${CONFIG.FRAME.w}×${CONFIG.FRAME.h}`);
if (totals.tallScreen) decide.push(`${totals.tallScreen} screens taller than the device — real overflow or an intentional scroll illustration?`);
if (totals.componentInScreen) decide.push(`${totals.componentInScreen} main components inside screens — clone such screens with the clone script (figma-project-maintain), not a bare clone()`);
if (totals.strokeAgainstStateLanguage) decide.push(`${totals.strokeAgainstStateLanguage} UI frames have strokes while the file shows state with fills — intended or drift?`);
if (totals.noticeLooksLikeCard) decide.push(`${totals.noticeLooksLikeCard} notices look like content cards (fill, rounded corners)`);
if (totals.deadEndCandidate) decide.push(`${totals.deadEndCandidate} "see more / how to…" links — check the destination screen in flows.md`);
if (totals.contrastTokenPair) decide.push(`${totals.contrastTokenPair} text/background token pairs with too little contrast — pick another token from the system (detail: contrastTokenPair)`);
if (totals.contrastSurface) decide.push(`${totals.contrastSurface} surfaces less than 1.2 from their background`);
if (totals.adjacentRadius) decide.push(`${totals.adjacentRadius} adjacent radius pairs off from ½ height — report only`);
if (totals.concentricRadius) decide.push(`${totals.concentricRadius} rounded blocks not concentric with their frame (inner radius ≠ outer radius − padding) — report only`);
if (totals.caseCheck) decide.push(`${totals.caseCheck} texts may break the capitalization rule — check proper names`);
if (totals.nameMissingSuffix) decide.push(`${totals.nameMissingSuffix} screens without a state suffix — screens on the same branch will be hard to tell apart`);
{ const v = screens.filter(x => /_Variant [A-Z]/.test(x.name)).length; if (v) decide.push(`${v} _Variant screens — brainstorm drafts: a chosen option goes into flows.md, a rejected one is deleted`); }
// top-level sections / frames overlapping
if (CONFIG.OVERLAP_CHECK) {
  const abs = n => { const t = n.absoluteTransform; return { x: t ? t[0][2] : n.x, y: t ? t[1][2] : n.y, w: n.width, h: n.height }; };
  const tops = page.children.filter(n => n.type === "SECTION" || n.type === "FRAME" || n.type === "GROUP");
  const pairs = [];
  for (let i = 0; i < tops.length; i++) for (let j = i + 1; j < tops.length; j++) { const a = abs(tops[i]), b = abs(tops[j]);
    if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) pairs.push(`${tops[i].name} ⟷ ${tops[j].name}`); }
  if (pairs.length) { decide.push(`${pairs.length} pairs of top-level sections / frames overlap — move sections the agent created`); detail.overlaps = pairs.slice(0, CONFIG.MAX_ITEMS); }
}
{ // a section title frame (direct child named "— …") must describe that section — in a test a new section copied the old section's title verbatim
  const seen = new Map(), bad = [];
  for (const sec of page.children.filter(n => n.type === "SECTION")) {
    const lab = sec.children.find(isLabel); if (!lab) continue;
    const txt = (lab.type === "TEXT" ? [lab] : lab.findAll(x => x.type === "TEXT")).map(t => { try { return t.characters.trim(); } catch (e) { return ""; } }).filter(t => t && !/^\d+(\.\d+)*$/.test(t));
    const key = txt.join(" · ") || lab.name;
    if (seen.has(key)) bad.push(`"${key}": ${seen.get(key)} ⟷ ${sec.name}`); else seen.set(key, sec.name);
    const mine = sec.getSharedPluginData && sec.getSharedPluginData("designtoolkit", "owner") === "agent";
    const norm = x => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    if (mine && !txt.some(t => norm(sec.name).includes(norm(t)) || norm(t).includes(norm(sec.name))) && !norm(lab.name).includes(norm(sec.name)))
      bad.push(`section "${sec.name}" has the title "${key}"`);
    if (lab.width > sec.width + 1) bad.push(`section "${sec.name}": title frame width ${Math.round(lab.width)} > section ${Math.round(sec.width)}`);
    const ln = norm(lab.name);
    if (mine && txt.length && ln && !ln.includes(norm(txt[0])) && !norm(txt[0]).includes(ln) && !ln.includes(norm(sec.name)) && !norm(sec.name).includes(ln))
      bad.push(`section "${sec.name}": the title layer still has the old name "${lab.name}" — rename it after the title text`);
  }
  if (bad.length) { decide.push(`${bad.length} section title frames wrong / duplicated — change the title text to match the section name`); detail.sectionTitles = bad.slice(0, CONFIG.MAX_ITEMS); }
}
if (totals.backgroundPaintedOnFrame) decide.push(`${totals.backgroundPaintedOnFrame} screens paint a gradient / image background on the screen frame — turn it into a Background/* component (screen-background skill)`);
if (totals.unknownSuffix) decide.push(`${totals.unknownSuffix} screens with a suffix outside the table — a new state, or a wrong name?`);
if (duplicates.length) decide.push(`${duplicates.length} duplicate component names`);
if (nearDuplicates.length) decide.push(`${nearDuplicates.length} groups of near-duplicate component names — the same thing, or really different?`);

return {
  scope: { page: CONFIG.PAGE, mode: CONFIG.MODE, screenCount: screens.length },
  perScreen: perScreen,
  mustBeZero: errors,
  wireframeInfo: nineInfo,
  needsDecision: decide,
  notHandled: notHandled,
  detail: detail,
  duplicateNames: duplicates.slice(0, CONFIG.MAX_ITEMS),
  accepted: accepted.slice(0, CONFIG.MAX_ITEMS),
  inheritedFromComponent: inherited,                                   // errors inside instances — fix in the main component
  rawSpacingIntent: rawSpacingIntent,                                  // RAW_SPACING_IN_SCREEN — recorded, not an error
  ...(Object.keys(detailInfo).length ? { info: detailInfo } : {}),
  nearDuplicates: nearDuplicates.slice(0, CONFIG.MAX_ITEMS),
};
