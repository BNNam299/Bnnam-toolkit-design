# Maintain a running project — overview, edit screens, add screens, redesign

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/maintain.md @ 3c0e291 — translated, complete (collaboration rules it relies on restated from core/rules.md §13)

## Contents
1. When to use
2. Two sources — never mix them
3. Hard rules: the original stays untouched, ways of working
4. Needs first · reads · writes
5. Entering through one feature
6. §A Project overview — the first time
7. §A Overview report
8. §B1 Rework an existing screen → a `_Fix AI` copy
9. §B2 Add new UI
10. §B3 New feature with a new document
11. §C Redesign
12. Approval per request, not per file
13. Stop-and-ask points · self-check · report
14. Knowledge to load

The project **already has a Figma file and documents** — usually made before any of this skill set existed, so there is no
`design/` folder yet. Do not rerun the whole chain from the PRD: get the overview once, then each request takes a short path and is
approved on its own. **Build and edit screens on Figma with the three-pass build loop** (`../figma-ui-flow/references/build-loop.md`):
build in passes, numbers after every write, one screenshot per pass.

---

## 1. When to use

- The designer hands over a running project: *"nắm dự án này"* (get to know this project), *"xem tổng quan dự án"* (show me the
  project overview), *"dự án này luồng thế nào"* (what are this project's flows), *"còn thiếu gì"* (what is missing)
- Rework an existing screen: *"chỉnh lại màn …"* (rework screen …), *"tăng khoảng cách thẻ ở …"* (more spacing between cards on …),
  *"đổi nút này thành …"* (change this button to …)
- Add UI to a running project: *"thêm màn …"* (add screen …), *"thêm trạng thái lỗi cho …"* (add an error state to …),
  *"làm thêm tính năng …"* (build another feature …)
- Redesign a running app: *"redesign"*, *"làm lại giao diện"* (redo the UI) → §A, then `processes.md` §4

Stage order and approval points of each case: `processes.md` §3 (maintain) · §4 (redesign).

**Not for** a project built new from a PRD — that is the full chain (`processes.md` §2). Not for learning from edits the **designer**
made — that is `learn.md`.

## 2. Two sources — never mix them

| Take from **the project** — so the product stays itself | Take from **the designer's standard** — not the old project's way |
|---|---|
| flows, content, current copy, terminology | screen skeleton: root frame with layout `NONE`, top block / content / bottom block (`../bnnam-standards/references/frame-standards.md`) |
| the file's tokens, text styles, effect styles | safe area built with spacer components (same reference) |
| existing components — use instances, never edit the originals (§3) | the designer's template screen (`project.yaml › screen.template`) |
| documents: features, business rules | naming convention for **new** screens (`../bnnam-standards/references/naming.md`) |

The old project builds layout differently (auto-layout root, a drawn status bar, safe area as padding…) → **any screen the agent
builds or edits still follows the designer's standard**: it looks like the old screens, but is packaged the designer's way. When the
two sources disagree: **structure** follows the designer's standard, **appearance** follows the project.

## 3. Hard rules: the original stays untouched, ways of working

- **Original screens are absolutely untouched.** Read them only to understand the project. Any change — even one word — goes through a
  `_Fix AI` copy. Do not rename old screens, do not "correct" anything you were not asked to.
- **Everything the agent creates** — new screens, `_Fix AI`, `_Variant` drafts, click-through flows — goes into **its own section**
  created by the agent. Never into a designer's section, never enlarge a designer's section, never into the source screen's section.
  Fit it into the original only when the designer is sure (*"chốt"* — lock it, *"lắp vào section …"* — put it into section …).
- **Clone with `scripts/clone.js`**, not a bare `clone()` / `clone_node`: a bare clone duplicates every main component that sits inside
  the screen. Create a new numbered section with `scripts/section.js`. Both check overlaps after placing.
- **Main components are off limits.** Screens use instances only. No editing, adding variants or changing properties of an existing main
  component — including system atoms (safe area, button…). Need something different → override on the instance if the component allows;
  otherwise **propose** the change, the designer edits the original. Never detach an instance to save time. Before any edit to a main
  component (designer edits it, or the designer orders the agent to), count its instances, affected screens, components containing it
  and existing overrides, and tell the designer first.
- A screen with a **`<name>_Fix`** copy is being edited by the designer: do not build, bind or audit it until `learn.md` is done.
  The `_Fix AI` copy is the agent's: build, bind and audit it normally, then hand it over for comparison.

**Work with the designer** in one of three ways (the designer chooses and may switch any time):

| Way | Designer | Agent |
|---|---|---|
| **Agent works to orders** | orders *"tạo màn …"* (create screen …), *"sửa màn …"* (edit screen …) · compares · locks | new screen: build it new · edit an existing screen: always on a **`<name>_Fix AI`** copy, never touch the original |
| **Designer edits** | edits on a **`<name>_Fix`** copy · tells the agent | compare, ask why, extract lessons (`learn.md`) |
| **In parallel** | works on Figma while giving orders | **re-read exactly the assigned area right before each order** · touch only the frames / nodes named in the order · never touch the designer's `_Fix` copies · a spot you were about to touch was just changed by the designer → stop and ask · report one line after each order |

Usually it opens with a brainstorm: restate the question as *"How might we …"*, put 2–3 genuinely different options side by side
**with every state of the changed part** (on and off, empty and filled, normal and error), compare on the same criteria (feasible per
documents and tech · what users want · sustainable for the system); need to see it to decide → draft `<screen>_Variant A` / `_Variant B`
with `clone.js` in an own section. The designer picks an option, then picks whether the agent does it alone or they work in parallel.

## 4. Needs first · reads · writes

| Check | If missing |
|---|---|
| access to the project's Figma file | ask the designer for the file link |
| project documents in `product/sources/prd/` (if any) | does not block — build the overview from Figma, note *"not checked against documents"* |
| the designer's template screen and two safe-area components **in this file** — the designer always places them | remind the designer (`../bnnam-standards/references/frame-standards.md`) — the agent never creates atoms itself. Missing → §B stops, §A can still run |

| Reads | Writes |
|---|---|
| Figma (read only during §A) · `product/sources/prd/` · `design/lessons.md` · `design/project.yaml` | `project.yaml` · `flows.md` · `voice.md` · `analysis.md › Gaps` · in §B: the `_Fix AI` copy, new screens in Figma · `flows.md` · `components.md` · decision-log entries |

## 5. Entering through one feature

Designers often work one feature at a time and never say *"nắm dự án này"* first. Then §A runs **within that feature**: read the
related sections, write `flows.md` under a heading `## Feature — <name>` with `scope: <feature>`; the rest of the project is recorded
later, when needed.

## 6. §A Project overview — the first time

Goal: **understand the flows, know where things lead, capture the voice, see what is missing.** Do not rebuild every `design/` file;
no competitor analysis, no reading style from images — the project already exists in Figma. The voice is **extracted from the copy
that exists**, not defined anew.

1. **Detect conventions** with `../design-system-audit/scripts/detect.js` (plus `get_document_info` / `get_design_system` and
   screenshots when you need more): pages, frame size, tokens, atoms, how the project builds its safe area, **background components
   `Background/*`** and how they are blurred, the state language (how states are shown: background · border · opacity · shadow ·
   mixed), `process.case: maintain` (or `redesign` when the designer says so — `processes.md` §0). Submit a draft `project.yaml`
   (detect.js returns `projectYamlDraft`; full format `assets/project.template.yaml`), the designer confirms. Also record
   `screen.template` and the safe area **of the designer** (not of the old project).
2. **Read every screen, one by one, in detail** — section → row → left to right; for each screen look at the image (`screenshot`) and
   read the outline (`scripts/readscreen.js`), and answer all six questions:

   | # | Question | Taken from |
   |---|---|---|
   | 1 | **What is this screen for?** — one sentence, in terms of the user's task | title · main content · position in the section |
   | 2 | **What does the user see first?** — the most prominent block | the image |
   | 3 | **What can be done here?** — every button, tab, input, choice, gesture | outline › `actions`, `inputs`, `choices` |
   | 4 | **Where does each action lead?** — target screen name, with certainty | links / arrows if any · button text matching another screen's title · the next screen in the same row |
   | 5 | **Which state is this?** — empty, filled, loading, error, editing… | content · name suffix · sibling screens next to it |
   | 6 | **What is unclear?** | write it down to ask — never fill it in yourself |

   Question 4 records **certainty**: *sure* (a link, an arrow, or button text equal to the target's title) · *guess* (position only).
   A guess must be asked. Full method: `../mobile-ui-master/references/reading-screens.md`.
   **Mandatory, whether or not the file has links.** Extra hints from `scripts/flowmap.js`:
   - **prototype links** — if present, they are the real flows the designer wired. A button whose text leads somewhere but has no link
     → *"missing link?"*
   - **arrows drawn on the canvas** and the labels next to them
   - **a tab bar repeated** on many screens → the tabs are the root flows
   Done reading → **retell the project in words**; the designer confirms before you write `flows.md`. Anything guessed → ask.
3. **Check against documents** (if any): skim them the way `../prd-to-ux-flow/SKILL.md` reads a PRD — only to connect features ↔
   screens, not to extract everything.
4. **Write `flows.md`** with `from: maintain` · `based_on: figma@<date>`. Every screen keeps **exactly the name it has in the file** —
   never rename old screens. Every flow records the chain `<Screen> → <Screen>` from the map, field `source: current state`.
   - **Normalise identifiers:** each screen gets `screen type` and `main components` — detected with `scripts/situations.js`
     (labels such as `M-PAYWALL` = screen type *paywall*, `T-TAB-BAR` = component *tab bar*, `S-EMPTY` = state *empty*,
     `P-IPHONE` = frame *iPhone*; write them in `flows.md` as plain words), confirmed by the designer. A frame name that deviates from the naming convention (duplicate names,
     missing suffix, typos) → record a **`standard name`** as a mapping in `flows.md`. **Never rename the designer's frames in
     Figma** — the name may be the creator's intent; the agent **only renames frames it created itself** (`_Fix AI`, drafts in its own
     section). The list of deviating screens goes into the overview report.
5. **Capture tone of voice and UX writing** — so copy on new screens is **consistent** with the old screens.
   `../ux-writing/scripts/textdump.js` reads the text on every screen and tallies it by role (button, title, subtitle, label, input,
   error, notice, body): average word count, capitalisation, end punctuation, form of address, emoji — with sample sentences. Read the
   samples, write `voice.md` with `from: maintain`, using the voice format `../ux-writing/assets/voice.template.md`:
   - **Product voice** extracted from real copy: 3–4 attributes, position on the four tone axes, form of address — each attribute
     backed by a **sample sentence** that proves it
   - **Tone per situation** only for situations the project **already has** (error, empty state, success…) — with real sentences
   - **Measurable copy rules:** capitalisation, button and title length, punctuation, emoji, number and date formats
   - **Terminology** — which word the project uses for each concept
   - **Inconsistencies** — the project contradicts itself (two button capitalisation styles, two words for one thing, *"bạn"* (you,
     casual) in some places and *"quý khách"* (valued customer, formal) in others). Do not choose: **ask the designer to pick one**,
     record it, new copy follows that choice. Old screens stay as they are.
   The designer approves `voice.md` before the agent writes copy for a new screen.
6. **Find what needs adding** → `analysis.md › Gaps`:
   - screens with no way out (no button, no tab, no back) · screens with no way in (no button on another screen leads to it)
   - missing states: sweep the state table (`../prd-to-ux-flow/references/ux-flow.md` §8) over the main flows — screens with data but no `Empty`,
     `Loading`, `Error`…
   - features the documents have that the UI does not, and the reverse

**Adaptive projects — iOS 27 · iPhone Duo · iPad.** Upgrading an existing app to run well on iPhone Duo / iPad: detect fixed frames,
hinge spacers, idiom-based layouts; choose the support level; build the variants on the `_Fix AI` copy following
`../iphone-duo-adaptive/SKILL.md` — the original screen stays untouched.

## 7. §A Overview report

Plain words, short — so the designer grasps the project in one read. Example (Vietnamese UI copy kept verbatim):

```text
Project: 42 screens · 7 sections · 6 main flows — all 42 read (please confirm the ones marked "guess")

Where things lead
  Login → Home screen → Detail → Payment done
  Root tabs: Trang chủ · Nhật ký · Cá nhân          (Home · Diary · Profile)
  …

Voice: addresses the user as "bạn" · buttons in Sentence case, 2–3 words · errors say how to fix, with "nhé" · emoji in empty states
  · inconsistent: 4 buttons in Title Case ("Xem Tất Cả" — See All) — pick one style?

Needs adding
  · 3 screens with no way out: Payment done, …        — missing a back / next button?
  · 2 screens nothing leads to: Old promo, …          — still used, or leftover?
  · the Payment flow lacks Error and Loading states
  · the documents have "Lịch sử đơn" (order history) — no screen yet

Layout standard: the old screens are built differently from your standard (auto-layout root · drawn status bar).
Edited and new screens will follow your standard.

Next steps
  → "chỉnh lại màn Detail"                    (rework the Detail screen)
  → "thêm trạng thái lỗi cho Thanh toán"      (add an error state to Payment)
  → "Old promo còn dùng không?"               (is Old promo still used?)
```

## 8. §B1 Rework an existing screen → a `_Fix AI` copy

1. **Duplicate** the screen as `<screen name>_Fix AI` with `scripts/clone.js` — into **its own section**, not the original section,
   without enlarging the original section. The original is not touched.
2. On the `_Fix` copy: **rebuild the skeleton to the designer's standard** (root frame, blocks, safe area, following the template
   screen) — keeping the project's content, tokens and components unchanged — then apply exactly the requested change.
3. The old screen has raw values (colours, spacing not bound) → in the `_Fix` copy bind them to the file's system
   (`bind_variables` or `../design-system-audit/scripts/bind.js`, dry run first — `../design-system-audit/references/system-binding.md`);
   a value with no matching token is **reported**, never turned into a new token on your own.
4. `../ux-review-handoff/scripts/audit.js` (set `SCREEN_NAMES` to the `_Fix AI` copy) and the tool demo's `audit_design` on it — always
   audit the agent's copy · check by eye with both copies side by side.
5. Report to the designer: changes as requested · skeleton changes (not requested, caused by moving to the standard) · remaining
   deviations.
6. The designer compares → more tweaks either by working in parallel and giving orders, or by editing the `_Fix AI` copy directly and
   telling you — then ask why (`learn.md` §5); do **not** compare with `compare.js`, because the original has a different skeleton.
7. **Lock:** before anything is deleted, run `scripts/flowmap.js` and **report every prototype link that points at the old screen**
   (which screen, which layer) — the designer re-wires them, the agent does not edit links. Then the old copy is deleted (the designer
   deletes it; the agent deletes only when the designer says explicitly *"xoá bản cũ"* — delete the old one) · the new copy gets an
   **official name per the naming convention** — the agent proposes it, e.g. `Home screen` → `Home_Result` · `flows.md` records old
   name → new name · its `approved` field gets the date.

A change that touches a **main component** (change the button on every screen) → not done on the screen; follow the main-component
rule (§3): propose it, or the designer explicitly orders the agent to tune that component (only the changes written down, dry run
first, before → after and affected screens reported, then audit and check those screens, record a DEC; the order is valid once).

## 9. §B2 Add new UI → build new

1. **Into `flows.md` first** — the new name per the naming convention, field `source: added <date>`, wire `comes from` / `leads to`
   to existing screens (their exact current names, old names included).
2. New copy follows the **approved `voice.md`** (§A5) and `../ux-writing/SKILL.md` — same form of address, same rhythm, same terms as
   the old screens. A situation the project never had (e.g. a lost-connection error) → write it in the extracted product voice, have
   the designer approve that sentence, then add it to `voice.md`.
3. **Wireframe only when the designer asks.** A screen of an existing family (adding `Error` to a screen that has `Result`) → build UI
   directly, using the sibling as the proportion template (figma-ui-flow's *From template* mode). A new layout the designer did not ask
   to wireframe → **2–3 UI options** (step 4).
4. **A part that does not exist yet → no component yet:** build the UI normally with the **system's tokens, text styles and
   components** for what exists, and the new part as plain frames in the same visual language · new layout / new parts → **2–3 options**
   (`processes.md` §1) · references the designer gives → cut them into parts to follow their **function**, while the form follows the
   existing system · the designer **locks one option** → component spec mode 2 for those new parts (same family, same variables —
   `../design-system-audit/SKILL.md`) → approve → build → re-assemble the screen with instances.
5. Build the UI with the build loop — the designer's standard skeleton, the project's tokens and components.
6. Audit, check by eye next to the sibling screens — a new screen must **look like the same product**.

## 10. §B3 New feature with a new document

The full chain **shrunk to the new part**: the new document goes into `product/sources/prd/` → read only the new section → the UX flow
adds flows → wireframe (only when asked) → UI build (options when the layout is new) → lock → component spec mode 2 if there are new
parts. Each stage is approved separately for the new part (`processes.md` §3).

## 11. §C Redesign — reshape the style

§A first (flows, voice and screen names stay) → `processes.md` §4: style read mode 1 with the new moodboard, compare with the old system
family by family (keep · replace · drop, record a DEC) → first screen 2–3 options → lock the direction → new components in a new set →
rebuild by screen group. Old variables and components are not deleted, and originals are not edited, without an order.

## 12. Approval per request, not per file

A maintained project does not use whole-file flags (`wireframe_approved` / `ui_approved`). Every screen in `flows.md` has an
`approved` field — the date the designer locked that screen. The status report counts by this field (`design-status.md` §4).

## 13. Stop-and-ask points · self-check · report

**Stop and ask:** the designer confirms the inferred flows and the extracted voice (§A) · approval **per request, per screen** (§12).

**Self-check:** `audit.js` / `audit_design` on the `_Fix AI` copy + check by eye with both copies side by side (§B1) · audit only new
screens and `_Fix AI` copies.

**Report:** §A — the overview report (§7). §B — add: number of screens edited / added · number of skeleton changes · number of raw
values bound / with no token · number of new copy lines and the ones written outside `voice.md`. Never say "done" without numbers;
at most three next steps.

**In a maintained project, audit runs only on new screens and `_Fix AI` copies** (pass their ids / names) — original screens are not
audited, because nobody edits them.

## 14. Knowledge to load

- §A: screen structure and patterns (`../mobile-ui-master/references/screen-structure.md`), Figma practice
  (`../figma-ui-flow/references/file-standards.md`), writing (`../ux-writing/references/principles.md`, for §A5).
- §B: the knowledge of the stage you are running (`processes.md` §6).
- Adaptive project: `../iphone-duo-adaptive/SKILL.md` and `../apple-design-iphone/references/ios-platform.md`.
- **Monetisation screens** (paywall, sale, ad gate, plan banner): `../mobile-ui-master/references/monetization-screens.md` — **read its
  risk checklist before building / reviewing**; other sections as the screen type needs.
