// scripts/textdump.js — READ ONLY. Reads the text already on the screens to extract the project's voice and UX-writing conventions.
// Use when: taking over a maintenance project — write design/voice.md from the current state so copy on new screens matches old ones.
// Run via execute_code: set CONFIG below, send the whole file as `code` (timeoutMs up to ~120000 on big files).
// Returns two things: STATISTICS per text role (button, title, body, error…) and TEXT SAMPLES for the agent to read the voice — not every string.
const CONFIG = {
  PAGES: ["5. UI Design"],         // pages that hold the UI screens
  MIN_SCREEN_HEIGHT: 400,
  EDIT_SUFFIXES: ["Fix", "Fix AI"], // skip edited copies (frames named <screen>_Fix …)
  TEMPLATE_FRAMES: [],             // skip template screens (copied from another file)
  SAMPLES_PER_ROLE: 25,            // number of sample strings per role
  PRONOUNS: null,                  // null = Vietnamese + English · other languages: { "あなた": /あなた/, "Sie": /\bSie\b/ … }
  // detect the text role from the parent instance name / text style / layer name — adjust to the file's conventions
  // (Vietnamese alternatives in the regexes match Vietnamese layer names)
  ROLES: {
    title:     /title|heading|headline|nav ?bar|header|display|tiêu đề/i,
    subtitle:  /subtitle|caption|sub|mô tả ngắn/i,
    button:    /button|btn|cta|nút|link/i,
    tab:       /tab ?bar|tab|bottom ?nav|segment/i,
    input:     /input|field|textfield|search|placeholder|ô nhập/i,
    selection: /toggle|switch|checkbox|radio|chip|select/i,
    back:      /back|chevron.?left|arrow.?left|close|quay lại|đóng/i,
    error:     /error|warning|alert|lỗi|cảnh báo/i,
    notice:    /toast|snackbar|banner|notification|dialog|modal|popup/i,
    label:     /label|chip|badge|tag|nhãn/i,
  },
};

const out = { screens: 0, texts: 0, byRole: {}, pronouns: {}, emoji: 0, samples: {} };
const roleOf = (t) => {
  const hints = [t.name];
  for (let p = t.parent; p && p.type !== "PAGE" && hints.length < 5; p = p.parent) hints.push(p.name);
  const h = hints.join(" ");
  for (const [r, re] of Object.entries(CONFIG.ROLES)) if (re.test(h)) return r;
  return "body";
};
// forms of address by interface language — add other languages here (voice.md › interface language)
const PRONOUNS = CONFIG.PRONOUNS || {
  "bạn": /\bbạn\b/i, "quý khách": /quý khách/i, "mình": /\bmình\b/i, "anh/chị": /anh\/chị|anh chị/i, "chúng tôi": /chúng tôi|chúng mình/i,
  "you": /\byou(r)?\b/i, "we": /\b(we|our)\b/i,
};
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const caseOf = s => {
  const w = s.trim().split(/\s+/).filter(x => /\p{L}/u.test(x));
  if (!w.length) return "other";
  if (w.every(x => x === x.toUpperCase() && x !== x.toLowerCase())) return "ALL CAPS";
  if (w.length > 1 && w.every(x => x[0] === x[0].toUpperCase())) return "Title Case";
  if (w[0][0] === w[0][0].toUpperCase()) return "Sentence case";
  return "lowercase";
};

for (const pn of CONFIG.PAGES) {
  const page = figma.root.children.find(p => p.name === pn);
  if (!page) continue;
  await page.loadAsync();
  const screens = [];
  (function walk(c) { for (const k of c.children) { if (k.type === "SECTION") walk(k); else if (k.type === "FRAME" && k.height >= CONFIG.MIN_SCREEN_HEIGHT) screens.push(k); } })(page);
  for (const s of screens) {
    if (CONFIG.EDIT_SUFFIXES.some(x => s.name.endsWith("_" + x)) || CONFIG.TEMPLATE_FRAMES.includes(s.name)) continue;
    out.screens++;
    for (const t of s.findAll(n => n.type === "TEXT" && n.visible !== false)) {
      let c = "";
      try { c = typeof t.characters === "string" ? t.characters.trim() : ""; } catch (e) { (out.readErrors = out.readErrors || []).push(`${s.name} › ${t.name}: ${e.message || e}`); continue; }   // unreadable text node (e.g. missing font)
      if (!c || /^[\d\s.,:%/+-]+$/.test(c) || c.length === 1) continue;             // skip numbers and single characters (icon glyphs)
      out.texts++;
      const r = roleOf(t), st = out.byRole[r] = out.byRole[r] || { count: 0, avgWords: 0, longest: 0, capitalization: {}, ending: {} };
      const words = c.split(/\s+/).length;
      st.count++; st.avgWords += words; st.longest = Math.max(st.longest, c.length);
      st.capitalization[caseOf(c)] = (st.capitalization[caseOf(c)] || 0) + 1;
      const end = /[.!?…]$/.test(c) ? c.slice(-1) : "no punctuation";
      st.ending[end] = (st.ending[end] || 0) + 1;
      for (const [k, re] of Object.entries(PRONOUNS)) if (re.test(c)) out.pronouns[k] = (out.pronouns[k] || 0) + 1;
      if (EMOJI.test(c)) out.emoji++;
      const m = out.samples[r] = out.samples[r] || new Map();
      if (m.size < CONFIG.SAMPLES_PER_ROLE && !m.has(c)) m.set(c, s.name);
    }
  }
}
if (!out.screens) return { stop: "no screens found — check PAGES (page names in the file)" };
for (const st of Object.values(out.byRole)) st.avgWords = Math.round((st.avgWords / st.count) * 10) / 10;
for (const [r, m] of Object.entries(out.samples)) out.samples[r] = [...m.entries()].map(([text, screen]) => `${text}  ·  ${screen}`);
// nearly identical text across buttons → terminology candidate; two different words for the same job → the agent checks the samples itself
out.note = "statistics are hints — read the SAMPLES to infer the voice; where the project contradicts itself (two names for one action, two capitalization styles) record it in voice.md › Inconsistencies and ask the designer to choose";
return out;
