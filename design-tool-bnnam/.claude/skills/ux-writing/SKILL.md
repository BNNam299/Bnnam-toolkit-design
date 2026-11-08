---
name: ux-writing
description: UX writing and microcopy for app screens - text inside a screen frame is real product copy (no "Title", "CTA", specs or explanations; those go in notes outside the frame) with a scan for meta text, eight principles with tests, button and dialog labels, error-message formula and rubric, copy for empty, loading, permission, destructive and notification states, voice and tone, the project voice file design/voice.md with terminology and forbidden words, Vietnamese rules, localization and a copy review procedure. Use whenever words appear on a screen or the user asks about wording or to rewrite UI copy or push notifications, even if they only say "draw this screen". Vietnamese triggers such as "viết chữ cho màn này", "đặt tên nút", "thông báo lỗi viết sao", "soát chữ", "giọng văn", "xưng hô bạn hay quý khách", "gọi là Xoá hay Gỡ", "trạng thái rỗng ghi gì". For screen states use mobile-ux-fundamentals; for the build loop use figma-ui-flow; for a full UX review use ux-review-handoff.
---

# ux-writing — the words on the screen

This skill answers **"what does the screen say?"** — every title, button, label, error, empty state and notice, and the project's
voice. It does not decide which states exist or which feedback channel to use (`mobile-ux-fundamentals`), lay out the screen
(`mobile-ui-master`) or run the build (`figma-ui-flow` — its Pass 2 fills content; this skill supplies the copy and the checks).

Two layers of rules:
- **Every project** — `references/principles.md` (hard rules) and the handbook (thinking lens; the hard rules win where they differ).
- **This project** — the project voice file `design/voice.md`: voice, tone, lengths, forbidden words, terminology. It is the **single
  source of truth for the project's words**. If it doesn't exist yet, create it before writing wireframe copy (workflow B).

## Need → Read
| Need | Read |
|---|---|
| Hard rules: text inside vs outside the frame, meta-text scan, 8 principles, verification, buttons, errors, Vietnamese, review procedure | `references/principles.md` |
| Scan a screen for meta text / forbidden words (read-only `execute_code` snippet) | `references/principles.md` §2.5 |
| Create or update `design/voice.md` (inputs, steps, approval gate, where it is used) | `references/voice-and-tone.md` + `assets/voice.template.md` |
| Read the current voice from an existing file (maintenance project) | `scripts/textdump.js` — `references/voice-and-tone.md` §3.0 |
| Six questions and the content frame with a worked example | `references/handbook.md` §3 |
| How people scan, legibility/readability/comprehension, plain language, inverted pyramid, chunking, progressive disclosure | `references/handbook.md` §4–7 |
| Headings, link labels (4S), button/menu/command labels, dialog action pairs | `references/handbook.md` §8–10 |
| Copy per component and state: onboarding, permission, form, empty, loading, success, destructive, search, settings, tooltip, notification, auth/payment, AI content | `references/handbook-patterns.md` §1 |
| Error messages in depth + 12-criterion rubric (A/B/C/D scale) | `references/handbook-patterns.md` §2 |
| Voice vs tone, tone matrix, building a voice chart | `references/handbook-patterns.md` §3 |
| Accessibility labels, alt text; localization, string keys, variables, Vietnamese format | `references/handbook-patterns.md` §4–5 |
| Vietnamese before/after library (CTA, form, empty, error, destructive, notification, permission) | `references/handbook-patterns.md` §6 |
| AI-assisted drafting, writing in the product process, handoff per string, research methods, metrics, governance | `references/handbook-process.md` §1–4 |
| Copy scorecard (12 criteria, 0–2), Definition of Done, quick checklists by content type | `references/handbook-process.md` §5–6 |
| Which states a screen needs, toast vs alert vs inline | `../mobile-ux-fundamentals/SKILL.md` |
| Copy for posture-adaptive layouts (iPhone Duo) | `../iphone-duo-adaptive/SKILL.md` |
| Exact Apple / Material wording on writing | `../apple-hig/references/writing.md`, `../material-design-3/references/foundations__content-design__*.md` |

Do not read everything at once. Each workflow step below names the file it needs.

## Core rules
1. **Inside the frame is the product; outside is notes.** Every string inside a screen frame is what the user reads on their phone.
   Explanations — what the screen is for, when it shows, which button is disabled — go in notes outside the frame. This applies to
   wireframes and UI alike, and it is the mistake agents make most: they *describe* the screen instead of *writing* it.
   **The App Store test:** if a screenshot of this screen were posted on the App Store, would this sentence stand up? No → note.
2. **Seven kinds of text never sit inside the frame:** component-role descriptions (`Primary action`), design specs (`22pt bold`,
   `#3AADFF`), placeholders (`Label`, `Title`, `Button`, lorem, `TBD`, `[name]`), trade jargon (`Empty state`, `CTA`, `Paywall`,
   `Toast`), technical names (`image_too_large`, `FR-014`, `Error 500`), behaviour explanations (`Tap here to open…`), screen/state/layer
   names the user never sees (`Home_Empty`). Image placeholders are crossed boxes with **no text**; the description goes in the layer
   name. Exception only for apps that really show technical text (diagnostics, developer tools) — record that decision with its reason.
3. **Real copy from the first wireframe.** Write the CTA, titles and errors first — they decide the flow. Write every state, not just the
   happy path. Text length decides layout, so never lorem.
4. **Eight principles, each a test:** clear (a distracted first-timer gets it on one read) · concise (removing a word loses meaning) ·
   useful (the reader knows what to do next) · voice and tone (fixed voice; tone fits the moment — no jokes in errors or payment) ·
   consistent (one concept, one word) · accessible · accurate and honest (every promise is true of the product) · scannable (headings and
   buttons alone carry the point). Clarity or accuracy failures on a CTA, permission or payment are **high** severity.
5. **Claim only what the app can measure.** If it can't measure "not added yet", write an entry to instructions (`How to add widgets`).
   A chevron promises a destination — no destination, no chevron. No empty marketing; one button, one job.
6. **Buttons: verb + object** when the object isn't clear (*Save address*), the verb alone when it is (*Save*); usually 2–4 words; state
   the resulting state (hidden item → *Show*); same action, same label everywhere; no *OK / Yes / No* when a verb exists; destructive
   names the object and count (*Delete 12 files*); dialog title is a specific question, buttons are two specific actions
   (*Delete 3 photos?* — **Delete photos** / **Keep photos**). A placeholder never replaces a visible label.
7. **Errors:** `[what happened] + [impact / is data kept, if needed] + [how to fix]`, dropping what's obvious. Near the source, not colour
   alone, as prominent as the severity, not while the user is still typing; plain words, no codes, no blame, no jokes; keep the input,
   focus the right place, allow retry. A support reference code goes in a secondary, copyable area.
8. **Honesty limits.** Don't invent a brand voice — with no guidance, say you are applying the general standard. Don't claim new copy
   will raise conversion — say *expected* and how to test it. Better wording that promises a missing feature is broken. A good label
   that overflows its button is wrong.
9. **Vietnamese:** a space after commas and periods, none before punctuation; money and units in one format (`450.000 ₫`); headings in
   sentence case; *bạn* / *quý khách* / dropped subject — one choice in `voice.md`, never changed per screen.
10. **A status notice is not a content card.** One sentence stating the status, no how-to when no action comes with it, and a shape
    clearly different from the cards around it — learn the form from notices already in the file.

## Workflows

### A. Writing copy for a screen (wireframe or UI)
1. Load `design/voice.md` if it exists (no file and the project spans several screens → run workflow B first, or say you are applying
   the general standard).
2. For each string, answer the six questions (`references/handbook.md` §3); for high-risk states — delete, payment, permission, data-loss
   error, sensitive data — write the content frame into a note outside the frame.
3. Write titles, CTAs and errors first, then the rest, per state. Use `references/handbook-patterns.md` §1 for the component or state at
   hand and §6 for Vietnamese before/after models.
4. In the build (`figma-ui-flow` Pass 2), put only product copy inside the frame; explanations become notes outside.
5. Before reporting the screen done: run the meta-text scan (`references/principles.md` §2.5, with `FORBIDDEN` from `voice.md`), then
   the App Store test by eye on every remaining string. In the UI build, copy is not edited to fit — overflow goes back to the wireframe.

### B. Defining the project voice (`design/voice.md`)
Follow `references/voice-and-tone.md`: inputs (PRD, competitor analysis with measured text rhythm, visual style) → maintenance projects
first read the current voice with `scripts/textdump.js` → no brand direction means proposing 2–3 voice directions with sample sentences
for onboarding, error and paywall → fill `assets/voice.template.md` → **stop for approval before wireframes**, because the voice decides
every string.

### C. Reviewing copy (one screen or a whole set)
Follow `references/principles.md` §10: inventory per screen and kind in reading order → establish context → run the eight tests and tag
each issue with its principle → rewrite with before/after (one alternative only for a real strategic choice) → check consistency across
the set (fixing strings one by one while the set still drifts is a failure) → note what needs user testing or data. Score with the
scorecard and checklists in `references/handbook-process.md` §5–6; errors with the rubric in `references/handbook-patterns.md` §2.3.

### Running `scripts/textdump.js`
Read the script, set `CONFIG` at its top (`PAGES`, `ROLES` regexes matching the file's layer naming, `SAMPLES_PER_ROLE`, `PRONOUNS` for
non-Vietnamese/English UIs), and send the whole file as `code` to `execute_code` with `timeoutMs` up to ~120000 on big files. It is
read-only and returns statistics per text role plus sample strings — infer the voice from the **samples**; the numbers are hints.

## Common pitfalls
- Screen copy that explains the screen (*"Nơi bạn xem lại các bữa ăn"* — *"The place where you review your meals"* — as a title).
- Leftover `Title` / `Button` text in layers named `Title` / `Button`.
- One "No data yet" sentence for first use, no results, filtered, offline and error alike.
- Cheerful or jokey tone in an error, data loss or payment.
- Two words for one concept across screens (*Xoá* here, *Gỡ* there) instead of the glossary term.
- Permission pre-prompts that threaten (*"the app won't work"*) when most of it still works.
- A notice styled like a card, read as one more settings item.
- Shortening a label until it no longer says what happens (*OK*).

## Self-check before reporting
- No meta text inside any frame: scan run, App Store test done by eye; notes sit outside the frame.
- Every state on the screen has real copy; errors follow the formula and keep the user's input.
- Labels, terms, capitalization and forms of address match `voice.md` (or the report says the general standard was applied).
- Every claim is something the app actually does or measures; every chevron has a destination.
- Copy fits its container at the largest supported text size without being cut.
