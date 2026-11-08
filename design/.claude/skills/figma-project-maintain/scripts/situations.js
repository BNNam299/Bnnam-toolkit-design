// scripts/situations.js — READ ONLY. Detects the SITUATION of every screen to route knowledge (screen type, main components).
// Returns per screen: S (state — name suffix) · P (frame — suffix, size) · T (main components — layer names, main component, structure) ·
// M (screen type — candidates with CONFIDENCE and REASON). Detects by STRUCTURE, not only by name (old files with poor names are still partly detected).
// The result is a HINT: the agent fills flows.md › screen type / main components → the designer confirms. Disagrees with flows.md → ask. No M at all → detect by hand / new type.
// Labels: S-EMPTY = state "empty" · P-IPHONE = frame "iPhone" · T-TAB-BAR = component "tab bar" · M-PAYWALL = screen type "paywall" — write them in flows.md as plain words.
// Run via execute_code: set CONFIG below, send the whole file as `code` (timeoutMs up to ~120000 on big pages).
const CONFIG = {
  PAGE: "5. UI Design",
  SECTION: null,                   // null = every section on the page
  SCREEN_NAMES: [],                // optional: detect only these screens
  MIN_SCREEN_HEIGHT: 400,
  SKIP_SUFFIXES: ["Fix", "Fix AI"],
  MAX_NODES: 4000,                 // per screen — guards against very heavy screens
};
const canFind = n => !!n && n.type !== "TEXT" && "findAll" in n;

// ── suffix table (../bnnam-standards/references/naming.md) → S · frame variants → P
const S_BY_SUFFIX = { "Empty": "S-EMPTY", "Loading": "S-LOADING", "Error": "S-ERROR", "Result": "S-RESULT", "First run": "S-FIRST-RUN",
  "Returning": "S-RETURNING", "Free": "S-FREE", "Premium": "S-PREMIUM", "Editing": "S-EDITING", "Selected": "S-SELECTED", "Expanded": "S-EXPANDED",
  "Draft": "S-DRAFT", "Offline": "S-OFFLINE", "Partial": "S-PARTIAL", "Logged out": "S-LOGGED-OUT", "Locked": "S-LOCKED", "Invalid": "S-INVALID",
  "Success": "S-SUCCESS", "Failed": "S-FAILED", "Pending": "S-PENDING", "Confirm": "S-CONFIRM", "Update": "S-UPDATE", "Mastered": "S-MASTERED",
  "Recovering": "S-RECOVERING", "Disconnected": "S-DISCONNECTED", "Denied": "S-DENIED", "Limit": "S-LIMIT" };
const P_BY_SUFFIX = { "Outer": "P-DUO-OUTER", "Outer Landscape": "P-DUO-OUTER-LAND", "Inner": "P-DUO-INNER", "Inner Landscape": "P-DUO-INNER-LAND",
  "Intermediate": "P-DUO-INTERMEDIATE", "Split Left": "P-SPLIT-VIEW", "Split Right": "P-SPLIT-VIEW", "Book": "P-DUO-POSE", "Tabletop": "P-DUO-POSE",
  "Tent": "P-DUO-POSE", "iPad": "P-IPAD", "iPad Landscape": "P-IPAD" };
const IPAD = ["744x1133", "1133x744", "834x1194", "1194x834", "1024x1366", "1366x1024", "1210x834", "834x1210", "1376x1032", "1032x1376"];

// ── components: expressions on the LAYER name / MAIN COMPONENT name (case-insensitive)
const T_RULES = [
  ["T-VERTICAL-BAR", /pane controls/], ["T-TAB-BAR", /tab ?bar|bottom ?nav|navigation bar\b/], ["T-NAV-BAR", /top container|toolbar[ _-]?top|nav ?bar|header/],
  ["T-SIDEBAR", /sidebar|navigation rail/], ["T-BOTTOM-TOOLBAR", /bottom toolbar/], ["T-SEARCH-FIELD", /search/],
  ["T-ICON-BUTTON", /icon button|buttons ›|^buttons$|round button/], ["T-BUTTON", /^button|cta|button -/], ["T-FAB", /\bfab\b|floating/],
  ["T-TEXT-FIELD", /input|text ?field/], ["T-PICKER", /picker|scroll items|wheel/], ["T-SELECTION", /toggle|switch|checkbox|radio/],
  ["T-SLIDER", /slider/], ["T-SEGMENTED", /segment/], ["T-CHIP", /\bchip|\btag\b/], ["T-CARD", /card/], ["T-LIST-ROW", /table row|list ?row|\brow\b/],
  ["T-CHART", /chart|graph/], ["T-KEYBOARD", /keyboard/], ["T-SHEET", /sheet/], ["T-POPOVER-MENU", /popover|\bmenu\b/],
  ["T-DIALOG", /dialog|alert|pop ?up/], ["T-TOAST", /toast|snackbar/], ["T-SCRIM", /scrim|overlay\b/], ["T-BACKGROUND", /^background/],
  ["T-PAGINATION", /pagination|page control/], ["T-STEPPER", /stepper/], ["T-COUNTDOWN", /countdown|timer/],
  ["T-PLAN-CARD", /package|sub pack|plan\b|plans\b|pricing/], ["T-AD-SLOT", /ad zone|native.?ads?|banner_google|small_native|\bads?\b/],
  ["T-WATERMARK", /watermark|watermask/], ["T-LOCK", /\block\b|crown|pro label|premium icon/], ["T-PROGRESS", /progress|spinner|loading/],
  ["T-BADGE", /badge/], ["T-ILLUSTRATION", /^visual|^asset_|illustration|hero/],
];
const PRICE = /([$€£¥₫]\s?\d)|(\d[\d.,]*\s?(\$|₫|đ|vnd)\b)|\/(week|month|year|tuần|tháng|năm)\b/i;

// ── screen type: NAME keywords (low confidence on their own) and STRUCTURE rules (Vietnamese alternatives match Vietnamese names / copy)
const M_NAME = [
  ["M-SPLASH", /splash/], ["M-WELCOME", /welcome/], ["M-ONBOARDING-QUIZ", /onboarding.?question|quiz|q&a/], ["M-ONBOARDING", /onboard/],
  ["M-LANGUAGE", /language|ngôn ngữ/], ["M-PERMISSION", /permission|allow access|xin quyền/], ["M-LOGIN", /log ?in|sign ?in|sign ?up|account/],
  ["M-TUTORIAL", /tutorial|tips|coach|guide|how to/], ["M-HOME", /^home|main page/], ["M-DASHBOARD", /statistic|dashboard|insight|report\b(?!.*image)/],
  ["M-SEARCH", /search/], ["M-FILTER", /filter/], ["M-SETTINGS", /setting/], ["M-PROFILE", /profile|my creat|history|library\b/],
  ["M-CALENDAR", /calendar/], ["M-MAP", /\bmap\b/], ["M-CHAT", /chat|assistant|helper/], ["M-PLAYER", /player|session|playing/],
  ["M-CAMERA", /camera|scan|capture/], ["M-GALLERY-PICKER", /gallery|choose photo|upload/], ["M-EDITOR-CANVAS", /canvas|drawing|editor|mask|brush|clean ?up|remove object/],
  ["M-AI-GENERATING", /generat|processing|detecting|analyz/], ["M-AI-RESULT", /result|preview|before.?after/], ["M-REMOTE-CONTROL", /remote|touchpad|d-?pad/],
  ["M-DEVICE-PAIRING", /pair|connect|device list|reconnect|add ip/], ["M-SHIELD", /block screen|shield/], ["M-PASSCODE", /passcode|pin code/],
  ["M-WAITING", /barrier|waiting|pending/], ["M-RATING-PROMPT", /\brate\b|rating|review prompt/], ["M-REPORT", /report/], ["M-CELEBRATION", /streak|congrat|celebrat|gift|reward(?!.*ad)/],
  ["M-PAYWALL", /paywall|\biap\b|subscription|premium|upgrade|\bsub\b|\bpro\b/], ["M-OFFER", /sale|offer|discount|welcome back|lifetime/],
  ["M-REMOVE-ADS", /remove ads/], ["M-AD-GATE", /reward|watch.?ad|save mode|dialog limit/], ["M-UPSELL-ENTRY", /banner/],
  ["M-PRE-PAYWALL", /social proof|show feature|before payment|free trial|setting up/],
  ["M-SHEET", /sheet/], ["M-DIALOG", /dialog|alert|pop ?up/], ["M-POPOVER", /popover|menu|choose mode/], ["M-TOAST", /toast/],
  ["M-FORM", /create|edit\b|add new|new group|form/],
];

const page = figma.root.children.find(p => p.name === CONFIG.PAGE);
if (!page) return { stop: `page "${CONFIG.PAGE}" not found` };
await page.loadAsync();
const list = [];
(function walk(c, section) {
  for (const k of c.children) {
    if (k.type === "SECTION") { if (!CONFIG.SECTION || k.name === CONFIG.SECTION) walk(k, k.name); continue; }
    if (k.type !== "FRAME" || k.height < CONFIG.MIN_SCREEN_HEIGHT) continue;
    if (CONFIG.SECTION && section !== CONFIG.SECTION) continue;
    if (CONFIG.SKIP_SUFFIXES.some(x => k.name.endsWith("_" + x))) continue;
    if (CONFIG.SCREEN_NAMES.length && !CONFIG.SCREEN_NAMES.includes(k.name)) continue;
    list.push({ k, section });
  }
})(page, null);
if (!list.length) return { stop: "no screens found — check PAGE / SECTION / SCREEN_NAMES" };

const mainName = new Map();
const out_ctx = new Map();   // parent flow from the name (e.g. Home) — context, not the screen type
async function compName(n) {
  if (n.type !== "INSTANCE") return "";
  if (mainName.has(n.id)) return mainName.get(n.id);
  let s = ""; try { const m = await n.getMainComponentAsync(); s = m ? (m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name + " › " + m.name : m.name) : ""; } catch (e) {}
  mainName.set(n.id, s); return s;
}

async function detect(screen) {
  const name = screen.name, low = name.toLowerCase();
  const parts = name.split("_").slice(1).map(x => x.trim());
  const S = [...new Set(parts.map(p => S_BY_SUFFIX[p]).filter(Boolean))];
  if (parts.some(p => /^Step \d+/.test(p))) S.push("S-STEP");
  if (parts.some(p => /^Variant /.test(p))) S.push("S-VARIANT");
  const size = `${Math.round(screen.width)}x${Math.round(screen.height)}`;
  const P = [...new Set(parts.map(p => P_BY_SUFFIX[p]).filter(Boolean))];
  if (!P.length) P.push(IPAD.includes(size) ? "P-IPAD" : "P-IPHONE");

  const nodes = canFind(screen) ? screen.findAll(() => true).slice(0, CONFIG.MAX_NODES) : [];
  const T = new Map(); const why = (code, r) => { if (!T.has(code)) T.set(code, r); };
  let texts = [], imageCount = 0, textFields = 0;
  const repeated = new Map();
  for (const n of nodes) {
    if (n.visible === false) continue;
    const cn = await compName(n);
    const hay = (n.name + " " + cn).toLowerCase();
    for (const [code, re] of T_RULES) if (re.test(hay)) why(code, cn ? `${n.name} ‹${cn}›` : n.name);
    if (n.type === "INSTANCE" && cn) repeated.set(cn.split(" › ")[0], (repeated.get(cn.split(" › ")[0]) || 0) + 1);
    if (Array.isArray(n.fills) && n.fills.some(f => f.type === "IMAGE" && f.visible !== false)) imageCount++;
    if (n.type === "TEXT") { const c = typeof n.characters === "string" ? n.characters : ""; if (c) texts.push(c); }
    if (/input|text ?field/i.test(hay)) textFields++;
    if (n.type === "FRAME" && n.layoutMode === "HORIZONTAL" && n.clipsContent && n.children.length >= 2) {
      const w = n.children.reduce((a, c) => a + (c.visible === false ? 0 : c.width), 0); if (w > n.width + 8) why("T-CAROUSEL", n.name);
    }
  }
  const allText = texts.join(" \n ");
  if (PRICE.test(allText)) why("T-PRICE", (allText.match(PRICE) || [""])[0]);
  if (imageCount) why("T-MEDIA", `${imageCount} image layers`);
  const rep = [...repeated.entries()].filter(([, v]) => v >= 3);

  // ── screen type: structure
  const M = new Map(); const add = (code, src, r) => { const o = M.get(code) || { name: null, structure: null }; o[src] = r; M.set(code, o); };
  const top = screen.children.filter(c => c.visible !== false);
  const hasScrim = T.has("T-SCRIM");
  const bottomPanel = top.find(c => c.y + c.height >= screen.height - 2 && c.y > screen.height * 0.25 && c.width >= screen.width - 2 && c.height < screen.height * 0.85 && (c.topLeftRadius > 0 || /sheet/i.test(c.name)));
  if (hasScrim && (T.has("T-SHEET") || bottomPanel)) add("M-SHEET", "structure", "scrim + top-rounded block anchored to the bottom");
  else if (hasScrim && T.has("T-DIALOG")) add("M-DIALOG", "structure", "scrim + dialog box");
  if (T.has("T-PLAN-CARD") && T.has("T-PRICE")) add("M-PAYWALL", "structure", "plan card + price");
  if (T.has("T-COUNTDOWN") && T.has("T-PRICE")) add("M-OFFER", "structure", "countdown + price");
  if (/watch (an )?ads?|xem quảng cáo/i.test(allText) && /premium|pro\b|upgrade/i.test(allText)) add("M-AD-GATE", "structure", "Premium + Watch ad text");
  if (T.has("T-AD-SLOT")) add("M-AD-PLACEMENT", "structure", "ad slot");
  if (T.has("T-PAGINATION")) add("M-ONBOARDING", "structure", "page dots");
  if (T.has("T-CHART")) add("M-DASHBOARD", "structure", "chart");
  if (T.has("T-KEYBOARD") && textFields <= 1 && !rep.length) add("M-PASSCODE", "structure", "keyboard, few inputs");
  if (textFields >= 2) add("M-FORM", "structure", `${textFields} inputs`);
  if (rep.length && !hasScrim) add(T.has("T-CARD") ? "M-GRID-FEED" : "M-LIST", "structure", rep.map(([k, v]) => `${k} ×${v}`).join(", "));
  if (T.has("T-POPOVER-MENU") && !hasScrim && !M.has("M-SHEET")) add("M-POPOVER", "structure", "popover / menu floating over the screen");
  if (T.has("T-VERTICAL-BAR") === false && !T.has("T-NAV-BAR") && !T.has("T-TAB-BAR") && !hasScrim && top.length <= 3) add("M-SHIELD", "structure", "no navigation bar, few blocks — may be a blocking / waiting screen");
  // ── screen type: name — read the LAST LEVEL of the path first (the first level is usually the parent flow: "Home-Create Group-…" is not the Home screen)
  const segs = low.split("_")[0].split("-").map(x => x.trim()).filter(Boolean);
  const deep = segs.slice(-2).join(" "), parent = segs.slice(0, -2).join(" ");
  for (const [code, re] of M_NAME) {
    if (re.test(deep)) add(code, "name", `last level of the name contains "${(deep.match(re) || [""])[0]}"`);
    else if (segs.length <= 2 && re.test(parent)) add(code, "name", `name contains "${(parent.match(re) || [""])[0]}"`);
  }
  if (segs.length > 2) { const ctx = M_NAME.filter(([, re]) => re.test(parent)).map(([c]) => c); if (ctx.length) out_ctx.set(screen.id, ctx); }

  const Mlist = [...M.entries()].map(([code, o]) => ({ code, confidence: o.name && o.structure ? "high" : o.structure ? "medium" : "low", reason: [o.structure, o.name].filter(Boolean).join(" · ") }))
    .sort((a, b) => ["high", "medium", "low"].indexOf(a.confidence) - ["high", "medium", "low"].indexOf(b.confidence));
  return { screen: name, size: size, S, P, T: [...T.keys()], parentFlow: out_ctx.get(screen.id) || [], M: Mlist.length ? Mlist : [{ code: "?", confidence: "—", reason: "no match — detect by hand, or record a new screen type with a description" }],
    detailT: Object.fromEntries([...T.entries()].map(([k, v]) => [k, String(v).slice(0, 60)])) };
}

const out = { page: page.name, screens: [] };
for (const s of list) { try { out.screens.push({ section: s.section, ...(await detect(s.k)) }); } catch (e) { out.screens.push({ screen: s.k.name, readError: String(e && e.message || e) }); } }
const cnt = {}; for (const m of out.screens) if (m.M) { const k = m.M[0].confidence; cnt[k] = (cnt[k] || 0) + 1; }
out.total = { screens: out.screens.length, byTopConfidence: cnt };
out.note = "HINTS to fill flows.md › screen type / main components — the designer confirms. Confidence: high = name + structure match · medium = structure only · low = name only";
return out;
