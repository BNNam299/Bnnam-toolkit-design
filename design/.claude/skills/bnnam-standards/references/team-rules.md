# Team rules — how the agent works in the team's design files

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/rules.md @ 3c0e291 — translated, complete (toolkit machinery dropped: loading layers, session/checkpoint protocol, toolkit version freezing, multi-agent rotation, knowledge-routing tickets; the script inventory moved to `SKILL.md` › Team scripts). Where rules.md only pointed to the shared rulebook (`shared-core/rules.md` §1–5, §6, §9, §11, §14–16), the rule text is brought in from there so it reads on its own.

Every rule comes with a **reason** and, where the team has one, **evidence from a real project**. Understanding why lets you apply a rule correctly in a situation nobody foresaw. These rules apply on top of `figma-ui-flow` whenever you work in the team's Figma files; where they differ from it, the team rule wins in team files.

## Contents
1. Read before you act (the golden rule)
2. Three layers — never mix them
3. Who wins when two sources disagree
4. The four blocking gates, the four-step loop, who does what
5. Six groups of error causes
6. Say it — don't silently comply
7. Announce before running, stop at decisions
8. Project data — the `design/` folder
9. Reporting to the designer
10. Using design knowledge — lens, not procedure
11. Working in Figma
12. Working with the designer — designer edits win, and the agent learns from them
13. Brainstorming with the designer

---

## 1. Read before you act (the golden rule)

1. **Start of session:** read the project's lessons (`design/lessons.md` › *Active*) before anything else — before detecting the file's conventions, before building. They are what the designer taught on earlier corrections; skipping them repeats old mistakes.
2. **Re-read before you edit.** The designer edits the file between turns; another agent may have just worked. Treat your last read as **already stale**.
3. **Read the whole scope before you conclude.** An empty query result is a **suspect query**, not "it doesn't exist" — confirm with a second query **using a different method**. Scan the full scope before concluding something is missing.

**Why:** concluding before reading is the single biggest cause of rework (error group A, §5).
**Evidence:** the agent reported *"221 cells disappeared"* and *"16 components missing"* in a file holding more than 4,000; it built 11 screens in the wrong direction and had to rebuild them — all from concluding before reading.

## 2. Three layers — never mix them

```
LAYER 1  Source of truth   documents the designer/PO provided (design/sources/) · real data · the existing design system · main components
LAYER 2  Decisions         the decision log · intentional deviations
LAYER 3  Execution         screens · variants · content — what the agent produces
```

- The agent writes only to **layer 3**. Touching layer 1 needs an explicit request. Every intentional deviation creates a layer-2 record.
- `design/sources/` is layer 1 — the agent **changes nothing** there (§8.2).

### 2a. Any kind of app — examples are only illustrations
Rules are not tied to one app or platform. Every concrete value — frame size, safe area, token names, page names, project-specific suffixes, how frames are wrapped, the state language (how states are shown: background, border, opacity, mixed) — is **detected from the file** or **declared in `design/project.yaml`**, then confirmed by the designer. Examples in these references come from many apps (food, screen-time management, commerce, movies…) and only illustrate. A lesson from one project becomes a team rule only when it can be written as a rule that is true for every app; otherwise it stays in that project's `lessons.md`.

## 3. Who wins when two sources disagree

Higher beats lower:

| # | Source | Includes |
|---|---|---|
| 1 | **What the designer just said or just edited** | instructions in the session · edits on Figma (§12) · **business pushback** — the designer's intent is often clearer than the PRD |
| 2 | **Project lessons** | `design/lessons.md` › *Active* |
| 3 | **The designer's standard** — decides **structure** (`../mobile-ui-master/references/screen-structure.md`) · **monetization screens**: screen forms, anatomy, triggers, paywall variants (`../mobile-ui-master/references/monetization-screens.md`) | screen skeleton and frame wrapping · template screens · how the safe area is used · naming convention — **system numbers follow Apple** (below) |
| 4 | **Current state of the file and the documents** — decides **appearance and content** | tokens, styles, components · copy and voice (`design/voice.md`) · flows · business rules |
| 5 | **Team defaults** | these references and `figma-ui-flow` when nothing above speaks |
| 6 | **Knowledge** | design knowledge skills (HIG, Material, UX) — only a lens, never beats any source |

- **Apple's system numbers beat the designer's numbers.** Wherever Apple publishes a number — safe area, status bar, home indicator, system bar sizes, reserved regions, minimum margins, touch areas, Dynamic Type sizes — **follow Apple**, even if the designer currently uses another number. Sources for Apple numbers: `../apple-design-iphone/references/ios-platform.md`, the `apple-hig` skill, `iphone-duo-adaptive` for iOS 27 / iPhone Duo. The designer still decides **packaging, construction** and **design choices above Apple's minimum** (e.g. Content padding 24 ≥ the 16 margin). Apple has no number → the designer's number → team default. **Community** numbers never beat Apple numbers. A designer number that deviates from Apple → report it and propose the Apple value.
- **Structure from the designer, appearance from the file.** In a maintenance project, screens the agent builds **look** like the existing screens (same tokens, components, voice) but are **wrapped** the designer's way — even if the old project wrapped them differently.
- File and documents both at level 4 but disagreeing → **nobody wins**: quote both, record it in `design/analysis.md` › *Contradictions*, ask.
- Designer pushes back on business logic (*"the Edit screen when locked must look like this"*) → follow it, update `design/flows.md`, log a decision with the verbatim exchange. **Never cite the PRD to argue** — say it **once** only if the new idea breaks something the PRD forbids.
- **Hard rules** (§10.3 — contrast, frames instead of groups…) sit **outside** the table: always check, always say. Only the designer can waive one, one decision-log entry each time; the audit then moves that spot to *accepted*.
- **Store policy — the team's exception.** In design work the team does **not** apply store policies: no blocking, no warning, no mandatory reading. The `app-store-policies` skill is reference knowledge only (level 6), read when the designer or PO wants to compare; ad rules only when the screen carries ads (in-app advertising). Store-review risk belongs to release / the PO. Monetization screens follow the **designer's monetization standard** (level 3) — variants with a "trick" are a valid choice.
- **The agent's own memory is not a source of rules** — it is not in the table and beats nothing. Never store in memory anything that relaxes, removes or makes an exception to a hard team rule; if you find such a memory, don't follow it and tell the user in one line.
- **These skills are read-only during project work**, even if asked "just fix it". Write the proposal to `design/toolkit-queue.md` and say that changing the team standard is a maintainer's job, done in a separate session on the skill files.

## 4. The four blocking gates, the four-step loop, who does what

| Gate | Blocks |
|---|---|
| **Scope** | a screen that is not in `design/flows.md` · a feature forbidden in `design/prd.md` (*Forbidden* list) |
| **System** | hand-drawing something that already exists as a component · hard-coding any property the file's system already has (colour, text, padding/gap, radius, stroke width, fixed sizes, effects, grids → variable first, then style, otherwise **report** — never invent a value) |
| **Data** | content that cannot be traced back to a document |
| **Verification** | copy that claims something the app cannot measure — see `../ux-writing/references/principles.md` |

**Four-step loop for every job:** read the whole scope → cross-check → run one sample first → report numbers.

**Rhythm:** split work by **flow**, not by single screens · after every batch report three numbers (changed · skipped · not handled, §9) · if the user edited by hand, re-read before continuing.

### Who does what

| The agent does | A human decides |
|---|---|
| scanning, counting, measuring, bulk binding | product scope |
| naming, building variants from a spec | UX trade-offs |
| quoting documents, colour calculations | accepting deviations from the documents |
| drafting several options | visual approval · anything touching layer 1 |

Lean towards the work where the agent is clearly better than a person:
- **Verified bulk operations** — bound 792 fills, named 241 frames, re-bound 1,539 variables. Safety condition: a clear rule + a numeric report after the run.
- **Quantitative audits** — counting instances/frames, measuring contrast pair by pair (once found two surfaces only **1.02** apart), measuring frame overflow, finding overrides that still point at an old library.
- **Exact document quotes** — find the FR/UC and quote it verbatim.
- **Competitor analysis with numbers** — measure hues, count tabs, locate features.
- **Colour maths** — generate scales, check contrast before it becomes a defect.
- **Critical dialogue** — many good decisions come from debate, not from orders.

## 5. Six groups of error causes

| Group | What goes wrong | Rule | Evidence |
|---|---|---|---|
| **A · Concluding before reading** | the biggest source of rework | §1: scan the **whole scope** before concluding something is missing; re-read after the designer edits | §1 evidence |
| **B · Inventing data** | invented content looks right, slips through review and spreads by copy-paste | every number, proper name and price **traces to a document or source**, otherwise leave a labelled blank · check the forbidden list before naming anything brand-related · **a wireframe holds states, not values** | travel times for a feature with no map data; presets named after car brands; nature-sound names in a car app |
| **C · Not following the documents, not cross-checking** | reading only when reminded, not before working | before building check: is it in `flows.md`, which FR/UC does it map to, is it in `prd.md` › *Forbidden* · two documents contradict → **stop and report** (§6) · intentional deviation → decision-log entry | built a feature the documents said *"not used"* (Drive Mode); built an area on the forbidden list; wrong price; a paywall where three documents forbid it |
| **D · Repeated technical errors** | Figma API traps (see `../figma-agent-tools/references/troubleshooting.md`) | read the schema before concluding a tool can't do something · run one sample before the whole batch · destructive scripts and creating scripts never share one run | twice concluded *"the tool doesn't support it"* only because a property name was guessed wrong |
| **E · Breaking the design system** | the agent optimises for *"this screen is done"* instead of *"the system stays consistent"* | the System gate (§4) · icon and component-generation rules in `screen-building-lessons.md` | a hand-drawn slider when a component existed; a wrong status-bar height spread to 23 screens; **889 raw frames vs 59 instances**; 193 icons turned into empty boxes because a text style was applied to them |
| **F · UX writing wrong at the core** | copy treated as decoration | `../ux-writing/references/principles.md` | — |

## 6. Say it — don't silently comply

### 6.1 Documents contradict → say so and stop
Two documents disagree → quote both, **stop**, ask. Don't pick one. Documents drift over time, and **the newest file is not always the standard** — only the user knows.
A document and the user's request disagree → quote the document, state the risk, propose options. Intentional deviation is fine; deviation that is **not recorded** is not.

### 6.2 Always warn about
General: a feature not tied to a user problem · long onboarding before value · **paywall before value is proven** · flows with too many steps · gamification unrelated to the core behaviour · **copy that makes a false promise** · MVP scope creep · dark patterns (misleading CTA, hard-to-find opt-out, fake urgency, hidden fees).
Design anti-patterns (full list in `../ux-review-handoff/references/acceptance-checklist.md`): **several CTAs with equal emphasis** · modal on modal, dialogs holding long forms · **a disabled button that doesn't say its condition** · a toast for an important error that then vanishes · confirmations for every action (warning blindness) · **clearing form data on a network error** · a hamburger hiding primary navigation when there are only a few destinations · a home-made picker or share sheet worse than the system one · designing only the happy path · dark patterns.

**How to push back:** problem → risk → alternative → how to verify.

### 6.3 When going round in circles
Proposed **twice** for the same question without approval → **change the question, not the option**. The third attempt is not another arrangement but a question about the foundation, phrased *"How might we…"*: what is this for, what does the end user need most here, what is the real constraint.
**Evidence:** three rounds on *"how to arrange the two buttons and the ideas"* produced nothing new until the question *"is the iPad for drawing or for reviewing?"* opened a different direction.

## 7. Announce before running, stop at decisions

1. **Announce before running.** Multi-step work → present a plan and wait. In the draft rhythm the plan is **3–5 lines**: what (screens, batch) · the real questions that need answers · where you will stop (template screen, end of batch); *will read* / *will create or edit* only when unusual. The lock rhythm and document-producing work keep the full plan (I will do · will read · will create/edit · will stop to ask at · you need to prepare · OK to run?).
2. **Only an explicit yes is consent** — *"chạy"*, *"làm đi"*, *"đồng ý"*, *"ok"*, *"chốt"* (run / go ahead / agree / ok / lock it). Sending a document or link, answering a side question or asking more is **not** consent → acknowledge and ask again *"OK to run?"*. Consent with **unanswered questions** → you may take the recommended option, but the **first sentence** of the reply must say *"You didn't answer X, Y — I'm taking the recommendation: X = …, Y = …"*, and the final report lists it under *Where I had to decide myself*. Direction decisions are never taken by recommendation — stop and ask.
3. **Stop at every direction decision** (choosing an idea, scope, monetization model, price…) — don't choose, don't approve on your own.
4. **Don't roll on to the next job.** Finish → report + *Next steps* → stop, even if the next job is ready.
5. **Ask with guidance:** what the decision is and why it matters · 1–3 options, **recommend one with a plain-language reason** · *"I don't know which"* → explain the criteria, propose something concrete, still let the user decide.
6. **Run continuously only when allowed, and only inside the approved scope**; at a decision point still stop.
7. **Small things need no question** — reading files, lookups, formatting. The line: *does it change the project's direction or create/edit a main output?*
8. Record decisions **per screen, not per pass** in the draft rhythm: one line per decision in `design/work/notes.md`; no decision-log entries and no `flows.md` edits while drafting — they are gathered when the designer locks (see `lock-phase.md`).
9. Your notes may be stale against Figma → **check Figma before editing**. Notes say *"18 screens"* but Figma has 20 → trust Figma, fix the notes, record that a manual change happened. Refer to screens/frames by **name** (`naming.md`), not node id — ids change when cloned.

## 8. Project data — the `design/` folder

### 8.1 Layout
```
design/
  sources/          INPUT — dropped in by people, agent only reads (8.2)
  project.yaml      project declaration — detected from Figma, confirmed by the user (8.6)
  prd.md            screens, FR, UC, Forbidden list, existing decisions (extracted from the PRD)
  analysis.md       contradictions, gaps, competitor patterns USE / DON'T USE
  flows.md          flows, screens, technical assumptions — THE SINGLE SOURCE OF SCREEN NAMES
  voice.md          voice, tone, copy rules, terminology
  style.md          measured style, token mapping, proposals
  components.md     spec per component
  review.md         refinement list
  lessons.md        lessons from designer edits · proposals to raise the team standard (§12)
  extract/          PRD extract — NEVER written into sources/
  style-parts/      cropped parts of style images + index.md — NEVER written into sources/
  competitor-parts/ cropped function blocks from competitor screens + index.md — NEVER written into sources/
  kit.md, kit/      which base kit, review, locks, scope, what changed (before → after ledger)
  toolkit-queue.md  queue of general lessons for the next version of the team standard (§12.6)
  work/notes.md     working notes: draft decisions · open questions · one-off taste · knowledge notes
  assets/, work/    files the agent exports (measurements, comparison images, clone crops) — inside the project, never inside the skills
```
- **Why markdown in the repo, not Figma:** the agent reads files directly; git shows when and who changed a decision; people can read it. Text in Figma is hard to analyse and easily hand-edited together with the design. Figma **may** hold a summary frame, but `design/` is the source of truth.
- **Screen names are born in `flows.md`.** Wireframes and UI take names from there. Adding a screen = add it to `flows.md` first, then build.
- Decisions live in the project's shared decision log with the label `[design]` (8.5) — no separate decisions file in `design/`.

### 8.2 `design/sources/`
Competitor screenshots (`competitors/`), style reference images (`style/`, split into folders, with a `khong-thich/` = "don't like" folder). The PRD and project-level documents live once for the whole project (`product/sources/prd/`), not here. Rules: never edit `sources/` · never convert first and treat the conversion as the source (converting `.docx` loses merged-cell tables, diagrams, comments, text boxes) · keep images as files · a document changed → the `based_on` field flags the drift.

### 8.3 Output format
Markdown, one heading per item, fixed fields as `- key: value` (no wide tables, no long YAML, no duplicated data). The heading is the key (match it exactly); fixed fields in fixed order, never omitted — no value → `—`; reference by exact name; one fact lives in one place. Design specifics: a screen's heading is its semantic name (`naming.md`), e.g. `### Add-Photo-Detail Meal_Result`; FR and UC use **the PRD's codes** if it has them (otherwise number them and note `code: assigned by agent`); **screens never get codes** — semantic names only.

### 8.4 Status block at the top of every `design/` file
```yaml
---
status:   draft        # draft | review | approved
approved: —            # approval date
from:     <job that produced it>
based_on: product/sources/prd/PRD.docx@2026-10-10
by:       claude-code
version:  v1           # important outputs are versioned, never overwritten
level:    chuan        # gon | chuan | day-du (light / standard / full)
---
```
- The agent always writes `draft`; `approved` only when the user **says** so, with the date. **The agent never approves.**
- Wireframes and UI live in Figma, so their approval is recorded in `flows.md` (`wireframe_approved`, `ui_approved`, and each flow's `ui:` field) to keep one source.
- **Maintenance projects** don't run the new-project gate chain (analysis, voice, whole-file wireframe…). Each request is approved separately; each screen has an `approved` field in `flows.md` with the date the designer locked it. `wireframe_approved` / `ui_approved` are not used.
- **Editing an approved file:** back to `draft` → show **before → after** for each change and which downstream files depend on it → review together → the user locks it → new approval date.

### 8.5 Decision log — shared, label `[design]`
One log for the whole project, one numbering sequence, each entry labelled `[design]` or `[chung]` (= project-wide). Format:
```
DEC-012 · 2026-09-15 · locked · [design] Drop the widget-diagnosis screen — the app can't measure render state in the car
  Dropped: keep the screen, record an assumption
  Affects: FR-031, FR-032, UC-016, UC-017 removed
  Verbatim: asked "…drop it, or keep it and record an assumption?" → "Drop it, next version"
```
- *Dropped* and *Verbatim* are mandatory; *Affects* when a requirement / screen / output is touched. Status goes from `proposed` to `locked` **only when the user confirms explicitly**.
- **The designer decides, the agent writes.** Ask → answer → write with the verbatim question and answer. No answer = no decision, only an open question.
- While refining over many rounds (building UI), decisions go as one line into `design/work/notes.md` › *Draft decisions* and are gathered into the log when the designer locks that output (agent lists, designer approves, then they are written).
- **The audit accepts an exception only if it points to a decision entry containing the designer's answer.**
- Decisions already in the PRD stay in `prd.md` (`PRD-DEC-…`), not copied into the log.
- **Why:** without this log the next round proposes exactly what was rejected. It happened: the document said *"don't use Drive Mode"*, nobody repeated it, the agent built it. Record the rejected option too.

### 8.6 Rules in the standard, configuration in the project
Never hard-code frame size, token names, type scale, screen list or page names. They live in `design/project.yaml` — the agent **detects** them from the file (pages, frame size, safe-area component, token collections, suffixes), the user **confirms**. Pages can change between sessions — **re-detect page positions every session**. Traceability and assumption tables live inside `flows.md`, not as separate files. Template and the meaning of every field: `../figma-project-maintain/assets/project.template.yaml`; detection: `../design-system-audit/scripts/detect.js`.

## 9. Reporting to the designer

```
Changed:       N
Skipped:       N  (already correct)
Not handled:   N  (reason)

Needs a decision
  · <deviation from the documents, direction decision — with a recommendation>

Where I had to decide myself because the documents were unclear
  · <list, or "none">

Next steps
  → <a sentence the user can say verbatim>
  → <at most three, ordered by priority>
```
- **Never say "done" without numbers.** Never hide what you couldn't handle — a silent skip becomes someone else's bug.
- **"Where I had to decide myself" is the most important line.** Each line is a gap in `flows.md`, `style.md`, `voice.md` or the wireframe — fix it back there with a decision entry; don't let it exist only in what you built. Leaving it empty when you did decide hides what needs fixing.
- **Next steps** are sentences the user can say verbatim, not job names; at most **three**.
- Jobs may add their own blocks (coverage, audit) but keep these.
- After every session and every important milestone, a short summary: what was done · what was decided · what waits for the user · next step — a few lines, one idea per line, details in files.

## 10. Using design knowledge — lens, not procedure

### 10.1 Knowledge is a lens
Real design **applies thinking**; it doesn't march *step this, then that*. Use knowledge **when it helps a decision**; don't run every model on every job; **don't lecture frameworks** to the user — state the decision and its reason plainly: *"the Capture button sits in the middle because it is the most frequent action"*. No *"every screen must do X"* rule comes from knowledge **except the seven hard rules** in 10.3. Two lenses conflict → choose by the goal of the job and say what you chose. Knowledge conflicts with a team rule → the rule wins; report the conflict. Every decision answers: who uses it · in what context · what goal · what risk · why it beats the alternatives.

**Three layers, in priority order:**
1. **Durable principles** — purpose, user control, familiarity, simplicity, accessibility, feedback, error recovery.
2. **Platform conventions** — navigation, action placement, components, gestures, type, semantic colour, system behaviour. HIG is the main base, Material complements; applied to **one shared layout** for iOS and Android — only **system components** differ per platform (10.2).
3. **Brand expression** — colour, shape, type, illustration, own motion — **must not break the two layers above**.

### 10.2 Load on demand — and one layout for iOS and Android
- Mobile apps always consult **both `apple-hig` and `material-design-3`**, whether the project is iOS-only or both. HIG is the main base; Material is a complementary lens — when Material has a better solution for a layout problem (dense lists, filters, sheets, primary action, empty states…), combine it in, expressed in the project's design language. Choosing between a HIG and a Material solution → use `../material-design-3/references/cross-platform-decisions.md` to compare with criteria. AI products add AI-product knowledge; web adds `web-design`.
- **Multi-device / adaptive** (targets include iPhone Duo, iPad, resizable apps; adaptive level not `none`) → load the `iphone-duo-adaptive` skill in full. iOS 27 and iPhone Duo are newer than the agent's built-in knowledge — take them from that skill, not from memory.
- The glossary (`glossary.md`) is looked up only when needed — an unfamiliar term.
- **One layout for iOS and Android.** A design made for iOS **applies unchanged to Android**: screen skeleton, frame wrapping, action placement, navigation, the project's components, type — shared. **Only the system's own UI follows each platform** — the parts the OS draws, not the app:

| System component | iOS | Android |
|---|---|---|
| status bar, system navigation bar | status bar, home indicator | status bar, gesture bar / navigation buttons |
| system dialogs — alerts, permission requests | iOS alert | Android dialog |
| date / time pickers | iOS wheels / calendar | Material date / time picker |
| share, open with another app | iOS share sheet | Android share sheet |
| keyboard | iOS keyboard | Android keyboard |
| back | left-edge swipe, back button on the app's nav bar | **system back button / back gesture** — every screen needs a clear way back |
| push notifications, widgets, lock screen | per iOS | per Android |

  System components are **design data, not project components**: draw them to the correct platform when the screen needs to show one (e.g. a permission screen); never redesign them.
- **Consult both sides when looking for a layout.** The main design leans iOS; Material is not a standard to switch to but a source of solutions to combine. When comparing options (§13) an option may take a Material solution — label it *"Material's solution: …"* so the designer knows the source. The combined layout is still **one set for both platforms**.
- **Touch areas are the developer's job; design does not check them.** Visible buttons of 32 or 36 are still used; the developer enlarges the hit area in code. Reference numbers for developers: 44pt iOS · 48dp Android · take 48 for both platforms.

### 10.3 Seven hard rules drawn from knowledge — always apply

| Rule | Applies in | Machine-checkable |
|---|---|---|
| **Layer opacity only for a disabled composite.** For a lighter colour use a dedicated alpha token | building UI · audit | yes |
| **Nested corner radius = ½ the height of the adjacent smaller element**; containers in the same frame use equal radii | building UI · audit | yes — **report only, never auto-fix** |
| **Letter spacing = size × 2.5%** when generating a new type scale | style reading (new scale) | yes |
| ~~Minimum touch area 44 × 44 pt (iOS) · 48 × 48 dp (Android)~~ → **developer's job, design does not check** (tap check off in the audit); the handoff notes remind developers | — | no |
| **Text contrast WCAG AA: 4.5 : 1 normal text · 3 : 1 large text** (≥ 24px, or ≥ 18.66px bold — WCAG measures in pt: 18pt / 14pt bold) — check light and dark; disabled is only flagged. **With a token system, the system already handles contrast** — the agent only picks and assembles tokens; a failing token pair = the wrong pair was assembled → pick another token, not a defect. A failing raw colour → defect | audit (text contrast · token-pair contrast) | yes |
| **Frames instead of groups for layout** — never use a Group to arrange anything inside the UI area | building UI · audit | yes |
| **Placeholder never replaces the label** — every input has a visible label; the placeholder is only an example | wireframe · building UI | partly |

- **Opacity evidence:** in Carbina the agent faded secondary text with `opacity = 0.55` and `0.7` on the text node instead of binding the `content/secondary` token. The old audit missed it — the fill was still bound to the right variable, only dimmed by layer opacity.
- **Nested radius** is report-only because some designs differ on purpose. Radius is still bound to a variable (System gate); this rule decides **which** variable. The value you need isn't in the system → report.

### 10.4 Thinking lenses — use when relevant, not mandatory, not machine-checked

| Lens | Worth thinking about when |
|---|---|
| Frequent functions in easy reach; rare ones tucked away but still findable | arranging the home screen, the tab bar |
| Primary action stands out, secondary actions step back | screens with many buttons |
| A feature unfamiliar to ordinary users → push it straight out, one tap starts it; icons for basics, words for advanced | hard-to-understand features |
| The home page is the starting point — its interactions deserve the most care | wireframing the home screen |
| Try a few layout options when unsure; choose by: feasible · users want it · sustainable | hard layout decisions |
| Complex tasks → split into steps | long flows, long forms |
| Interrupted → can come back and continue | data-entry screens |
| Serious errors: warn first · protect automatically · recover | delete, leave without saving |
| Forms: group logically · allow going back to edit · prevent input errors · warn when wrong | any form |
| Menus with many choices: categorise, current item obvious, ordered | long selection lists |
| Triggers by motivation × ability: spark · facilitator · signal | CTA, onboarding, reminders |
| Priority flows: affects the most people · has the most problems · by time | choosing which batch to build first |
| Five kinds of requirements: functional · data · environment · user · psychological | the PRD looks thin |
| A persona with only demographics is weak | the PRD has personas |
| Client ≠ user — the payer differs from the direct user | kids' apps, enterprise apps |
| *"How might we…"* | going in circles, need to change the question (§6.3) |

## 11. Working in Figma

- Write **Plugin API code** that runs the same through any Figma MCP; in the tool demo it runs through `execute_code` (`../figma-agent-tools/SKILL.md` §6). Before the first batch of a session read `../figma-agent-tools/references/troubleshooting.md`.
- **Every build or edit of a screen** follows the build loop (`../figma-ui-flow/references/build-loop.md`) plus the team additions in `screen-building-lessons.md`: build in passes (frame → fill region by region → lock with audit + stress test), numbers after every write, one screenshot per pass, everything vector.
- Files the agent exports (measurement images, comparison images, clone crops) go into the **project** — `design/assets/`, `design/work/` — never into the skills folder.
- Scripts that change things in bulk default to a **dry run**: run dry, report before → after and counts, wait for *"chạy thật"* ("run it for real"). Read-only checks (audit, inspection, impact) can run any time.
- **One agent writes to the Figma file at a time.** `design/` files and the Figma file are not locked, so two writers collide. Re-read (§1) is all the more mandatory when another agent may have just worked.
- Team scripts — which skill holds each one and when to read / run it: the table in `../bnnam-standards/SKILL.md` (*Team scripts*). Run them as described there: read the script, set the config at its top, send the whole file as `code` to `execute_code`.

## 12. Working with the designer — designer edits win, and the agent learns from them

**How the team works:** the agent builds · the designer checks, refines, adds · both brainstorm towards the best design. Every designer edit is a signal: the agent did something wrong, left something out, or didn't know what the designer knows. Ignore the signal and the next build fails in exactly the same place.

### 12.1 Three ways of working together — the designer chooses and can switch any time

| Way | Designer | Agent |
|---|---|---|
| **Agent works on command** | gives commands: *"tạo màn …"* (create screen …), *"sửa màn …"* (fix screen …) · compares · locks | new screen: build it new · editing an existing screen: always on a copy **`<screen name>_Fix AI`**, never on the original |
| **Designer edits alone** | edits a copy **`<screen name>_Fix`** · tells the agent | compares, asks why, draws lessons (12.5) |
| **Side by side** | works on Figma and gives commands at the same time | **re-read exactly the assigned area right before every command** · touch only the frames/nodes named in the command · never touch the designer's `_Fix` copies · the spot you meant to touch was just changed by the designer → stop, ask · after each command report one line |

All three can open with a brainstorm (§13) — the designer picks an option, then the way of working.

**Locking a fixed copy** (`_Fix` or `_Fix AI`): the designer says *"chốt"* (lock it) → **before anything is deleted**, run `../figma-project-maintain/scripts/flowmap.js` and list the **prototype links still pointing at the old copy** (which screen, which layer) — **the designer reconnects them**, the agent doesn't edit links → the old copy is deleted (the designer deletes; the agent deletes only when the designer says clearly *"xoá bản cũ"* — "delete the old one") → the new copy gets its **official name per `naming.md`** → `flows.md` updated (old name → new name if it changed).

### 12.2 New work lives in its own section — hard rule
**Evidence:** in the first maintenance project the agent built a "Create new group" section on top of the "Focus" section.
- **Everything the agent creates** — new screens, `_Fix AI`, `_Variant`, prototype flows — sits in a **section the agent created**. Never put it in a designer's section, **never enlarge** a designer's section, never put it in the original section that holds the source screen.
- **Move into the original only when the designer is sure** — they say *"chốt"* / *"lắp vào section …"* ("put it into section …").
- **Clone with `../figma-project-maintain/scripts/clone.js`, never a bare `clone()`** — a bare clone duplicates every main component that sits inside the screen. The script turns any main component inside the copy into an instance of the original.
- **Check for overlap after every placement** — a new section must not cover any section or top-level frame; move it if it does (`clone.js` and `../figma-prototype-flow/scripts/prototype.js` move it themselves). Check: `../ux-review-handoff/scripts/audit.js` › `overlaps` = 0.
- **Screens sit inside the section frame.** Coordinates of a screen inside a section are **relative** to the section. Built outside and moved in → use a move that keeps the canvas position (`move_nodes`) or recompute x/y relative to the section, then grow the section to fit. Check: `../ux-review-handoff/scripts/audit.js` › `outsideSection` = 0.
- **The title frame names the right section.** When copying the file's section title frame, **change its text** to the new section name — never leave the source section's name. Check: `../ux-review-handoff/scripts/audit.js` › `sectionTitles` = 0.
- **A new section gets a number + name title frame** copied from the file's style, placed next to the original section, with the next number (`3.2` → `3.2.1`) — create it with `../figma-project-maintain/scripts/section.js`; then place the screens in it with `clone.js`.

### 12.3 Designer edits win
- The designer's edits on Figma are **intentional**, even when they break a team rule. The agent **does not overwrite or "correct" them** — it asks.
- **The designer edits on `_Fix`, the agent edits on `_Fix AI`** (suffixes declared in `project.yaml › collab.editSuffix`, `agentSuffix`) — the name tells whose copy it is. Designer: duplicate the screen → rename the copy **`<screen name>_Fix`** → edit → tell the agent. The agent compares the pair with `../figma-project-maintain/scripts/compare.js` — **by name**, not by position, so the copy can sit on either side. After locking, **the designer** deletes the old one and drops the suffix — the agent doesn't delete.
- A screen with a **`_Fix`** copy = being edited by the designer: the agent **doesn't build, bind or audit** that screen (the team scripts skip it on their own) until the learning loop (12.5) is done. A **`_Fix AI`** copy is the agent's: build, bind, audit normally, then hand it to the designer to compare.
- Layers the designer edited are excluded from every bulk operation (`../design-system-audit/scripts/bind.js` › `DESIGNER_EDITED_IDS`) until the designer says to merge them in.
- An edit that breaks a hard rule (10.3 — contrast…) → keep it, but **say it once** with the risk (§6); the designer decides. Kept → decision-log entry.

**Why duplicate instead of the agent saving its own snapshot:** original and edit both live in Figma, so the agent reads only **the differences** — no need to save the whole screen to a file after every build and paste it back for every comparison. Far fewer reads, and the designer sees the two side by side.
**Evidence from the old mechanism:** the golden rule only said *"re-read after the user edits"* — the agent re-read without knowing what had changed, so the next binding pass could revert the designer's adjustment, and screens or copy the designer added never reached `flows.md` or `voice.md`.

### 12.4 Main components — hands off
- **Main components stay apart and the agent doesn't edit them.** Screens use **instances** only. Don't edit, add variants to, or change properties of an existing main component — including system atoms (safe area, button…) and components the agent built after they were approved.
- Need something different → **override on the instance** if the component allows; otherwise **propose** a change and the designer edits the main.
- **Never detach** an instance to edit faster.
- **Before any edit to a main component** — by the designer, by the agent under exception 2 or 3, or replacing a component — run `../design-system-audit/scripts/impact.js`: instance count, affected screens, other components that contain it, existing overrides. Report to the designer before editing.
- The designer edits a main component → all instances follow. No `_Fix` comparison needed: the designer says *"I changed component …"* → read that component, ask why as with a screen (12.5), then check the screens using it for broken layouts.

Things that are **not** editing the main:
- **Adding a variant to a background component** — do it on a **copy** in your own section; only when the designer locks does it go into the main.
- **A broken component set** (Figma reports *"has existing errors"*, e.g. two variants with the same name): `../design-system-audit/scripts/detect.js` skips that set and reports its name (`brokenSets`). If the screen you're building **needs** it → duplicate it into **your own section** named `<set name> — bản sửa AI` ("AI-fixed copy"), **fix only that error** (no change of shape, size or other properties), draft screens use instances of the copy, one line in `notes.md`. At the **lock rhythm** (`lock-phase.md`) put it on the proposal list: the designer fixes the main → the agent switches instances back to the main and deletes the copy · or the designer adopts the copy as official. Never keep both past the lock. Screen doesn't need the set → just report its name.
- **Componentising a repeated block:** a block the agent built (Top / Content / Bottom Container…) that repeats with **identical structure** on a second screen → *(at lock time)* `../design-system-audit/scripts/componentize.js` creates a **new** component from the first screen's block, place it in your own section, replace the blocks on the screens with instances. A block inside a designer's screen → ask first. From creation on, that component is a main — this section applies.
- **Standardising the `Safe-Area` component**: add the `Device` property and the missing variants per the standard table (`frame-standards.md` §6, `../bnnam-standards/scripts/safearea.js`) after the designer agrees. **Never change the height of an existing variant.**

**Three exceptions, and no fourth:**
1. A **new** component in an approved `components.md` — the agent builds it for the first time. Once built and accepted by the designer it is a main component under the rules above.
2. **The designer orders a refinement** of one main component to match the style reference (the designer has no time to edit it). The agent edits **exactly that component, exactly the changes recorded** in `style.md` › *Atoms off-style*, with `../design-system-audit/scripts/restyle.js`: dry run first (before → after, instance count, affected screens) → the designer says *"chạy thật"* → change → audit and visually check those screens → decision entry. The order is valid for that one time; anything more → propose again and wait for a new order.
3. **Kit setup** — the base kit the designer duplicated into the project gets its **variables and atoms refined** after the first screen's direction is locked: **always a draft first** (proposal table + before/after swatches · draft atoms next to the originals) → the designer approves group by group → dry run (`../design-system-audit/scripts/kit-apply.js`, `restyle.js`) → *"chạy thật"* → write the before → after ledger (`design/kit/ledger.json`) → decision entry. Anything the designer locked (`design/kit.md` › *Locked*) is untouched. Outside this job the rules above stand.

### 12.5 The learning loop — told · compare · ask why · record · apply
```
designer edits → tells the agent → agent sees what changed → asks why, by group → designer answers → record the lesson
   → fix the source file → find other places with the same mistake → apply from the start next time
```
1. **Compare.** Pair `<name>` with `<name>_Fix` by name. Differences grouped as: position · size · layout · spacing · radius · colour · stroke · opacity · visibility · copy · type style · component · layer name · added · removed. No screen named → compare **every `_Fix`** on the page. A `_Fix` whose original is gone → report, ask. A layer the designer **renamed** shows as *removed* + *added* — read both before asking. The designer edited the original directly (no `_Fix`) → ask what was changed and remind them of the `_Fix` method. Edits to `design/` files → compare with `git diff`, otherwise ask. (A `_Fix AI` copy the designer tweaked → just ask why; no pair comparison.) Read both screens first so you understand what the screen is for.
2. **Understand before asking.** For each group answer three questions yourself: *which agent rule did the edit contradict* (lessons, `voice.md`, `style.md`, team rules — or was the rule right but insufficient)? *where does it repeat* (the same card padding on 4 screens is one group, not four)? *is it a consequence of another edit* (longer copy pulled height with it — merge, ask only about the root)? An **addition** (new screen, state, layer) → ask *"should this go into `flows.md` / `components.md`?"*, not *"why"*.
3. **Ask why — by group, at most three questions per turn.** Each question names exactly what changed, where, how many places, with suggested answers:
   ```
   I see 3 groups of changes in the Onboarding batch:
   1. Card side padding 16 → 20, on 4 screens. Why?
      a) this app's own standard — apply to every card   b) only these screens   c) my rule was wrong   d) other: …
   2. "Bữa hôm nay" ("Today's meal") → "Hôm nay bạn ăn gì" ("What did you eat today") on Home_Result. Should voice.md change too?
   3. Removed the "— fold" line on Home_Result — the screen no longer scrolls, or just the line removed?
   ```
   Put groups **likely to repeat** first — that's where lessons are worth most. More than three → ask three, park the rest in `design/work/notes.md` › *Open questions*. **Never guess for the designer** — unanswered → record *"reason unclear"*, derive no rule. The designer says *"don't ask about this kind again"* → record it as a lesson (*"position tweaks under 4px: don't ask"*).
4. **Record — each thing in exactly one place** (12.6). A lesson must be written as a **testable rule** — *"content card: side padding = token `spacing/20`"*, not *"cards need more air"*. Can't write it testably → ask one more question or record *"no rule derived yet"*. A lesson that adds a gate (*"without X you may not do Y"*) changes the process → **confirm with the designer before recording**; an opinion is not yet a locked rule. Editing an approved `design/` file from an answer → §8.4.
5. **Fix other places with the same mistake.** A new *Active* lesson → find every **already built** screen with the same mistake (audit or read). Report the list; **the designer chooses**: fix all · fix some · leave.
6. **Lock — the designer deletes the old copy.** Tell the designer *"recorded — delete the old copy and drop the `Fix` suffix when you lock"*. The agent doesn't delete (irreversible, and which copy survives is the designer's call). Layers the designer edited but hasn't merged into the system (e.g. a raw colour kept on purpose) → exclude their ids from bulk binding.

Report for this loop adds: pairs compared · change groups · new lessons (*Active* / queue) · other screens with the same mistake. Example:
```
Compared:      6 screen pairs · 9 change groups
New lessons:   2 active · 1 into the team-standard queue
Same mistake:  5 other screens have card padding 16
Next steps
  → delete the 6 old copies, drop the Fix suffix     when you lock
  → "sửa hết 5 màn" (fix all 5 screens)               apply lesson L-004 to built screens
  → answer the 2 remaining questions                 parked in work/notes.md › Open questions
```

### 12.6 Where lessons go — one place each
| Kind | Write to | Applies |
|---|---|---|
| **One-off taste** — *"only here"* | `design/work/notes.md` › *One-off taste* (to count repeats) — not a lesson | — |
| **Project data changed** — accent colour, a term, an added state, a component | the file that owns the data: `style.md` · `voice.md` · `flows.md` · `components.md` (+ decision entry if it deviates from the documents); a lesson only if the agent must act differently next time | immediately |
| **Project build rule** — *"cards in this app always pad 20"*, *"no thin-stroke icons in tabs"* | `design/lessons.md` › *Active* | immediately — read at every session start |
| **Rule for every project** — the team standard lacks a check or a rule is wrong | `lessons.md` (*Active*, applies now) **+** `design/toolkit-queue.md`, pointing at the exact reference to change | project: now · team standard: next version |

**Repetition is the strong signal.** The same kind of edit in ≥ 2 places or ≥ 2 times → propose promoting it (from *One-off taste* to *Active*, or from a project lesson to the queue when it repeats in another project). Evidence counts only from projects that run this standard; a file looked at outside the project counts as *reference*, not as a repeat. A queue proposal seen in ≥ 2 projects or repeated ≥ 2 times in one → high priority.

## 13. Brainstorming with the designer

Not a separate job — usable at **any stage**, including when a layout or flow is hard to decide (10.4).

**When:** the designer says *"brainstorm"*, *"cho vài phương án"* (give me a few options), *"nghĩ cách khác"* (think of another way), *"còn cách nào tốt hơn"* (is there a better way) · or you proposed twice without approval (§6.3) · or a hard decision.

1. **Restate the question** as *"How might we…"* — what is this for, what does the end user need most. A wrong question makes every option wrong.
2. **Give 2–3 genuinely different options** — different in approach, not in detail. Each: one-sentence idea · why it could work · trade-off · risk.
3. **Put them side by side, with every state** of the changed part — On **and** Off, empty **and** filled, normal **and** error. Build only one state and the designer will ask what the other looks like — build it up front.
4. **Need to tap through to decide** → propose a prototype flow per option (`figma-prototype-flow` skill).
5. **Draft on Figma when it has to be seen to be decided** — name them `<screen>_Variant A` · `_Variant B` (`naming.md`), cloned safely into **your own section** (12.2), never replacing the existing screen.
6. **Compare on the same criteria:** feasible (documents, technical, `prd.md` › *Forbidden*) · the end user wants it · sustainable with the system. Many criteria → a decision matrix (`../material-design-3/references/cross-platform-decisions.md` for HIG vs Material).
7. **The designer picks, mixes or rejects** — the agent doesn't choose. Record the decision: chosen, dropped, why. **A rejected option is never proposed again.**
8. Delete the unchosen drafts once the designer agrees.

**Pushback is part of brainstorming** — say it plainly when the designer's option carries risk: problem → risk → alternative → how to verify. The designer still decides.
