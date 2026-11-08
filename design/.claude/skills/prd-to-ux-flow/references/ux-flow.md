# Job 3 — From PRD to flows and a complete screen list (`design/flows.md`)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/ux-flow.md @ 3c0e291 — translated, complete

`flows.md` is the **single source of screen names** — wireframes, UI and components all take their names from it. The thinnest
spot to fill: going from a PRD to a screen list that is **neither missing screens nor bloated**.

## Contents
1. When to use
2. Inputs and outputs
3. Internal order
4. Step 1 — Task analysis: Goal → Task → Action
5. Step 2 — Information architecture
6. Step 3 — Flows: eight rules
7. Step 4 — Counting screens: three layers + one extra
8. Step 5 — State sweep for every core screen (15 states)
9. Step 6 — Own screen · variant · annotation
10. Step 7 — Default: no permission screens
11. Step 8 — State matrix: two axes
12. Step 9 — Technical assumptions `A-##`
13. Step 10 — Writing `flows.md`
14. Step 11 — Cross-check before asking for approval
15. Step 12 — The `trace` command
16. Screen identifiers — every project
17. Adaptive projects (iOS 27 · iPhone Duo · iPad)
18. Stop points, self-check, report, knowledge

---

## 1. When to use

- `analysis.md` is approved and the project needs flows and a screen inventory.
- Adding screens or states — every new screen goes into `flows.md` **before** it is built.
- A traceability table is needed: which FR does this screen answer, where does it lead, are there orphan screens (`trace`, §15).

**Not for** building wireframes or writing screen copy. Not for setting the voice — that is `../ux-writing/references/voice-and-tone.md`.

## 2. Inputs and outputs

| Check | If missing |
|---|---|
| `design/analysis.md` `status: approved` — for a `new` / `redesign` project. For `maintain`: not blocking, *Gaps* come from the project overview (`../figma-project-maintain/references/maintain.md` §6) | run `analyze.md` first |
| `design/prd.md` `status: approved` | run `prd-read.md` first |

| Reads | Writes |
|---|---|
| `prd.md` · `analysis.md` · the design decision log · competitor screenshots in `sources/competitors/` · `competitor-parts/index.md` (competitor screens that answer an FR / UC) | `design/flows.md` (`status: draft`, `based_on: prd.md@… · analysis.md@…`) from `assets/flows.template.md` · the design decision log (new `DEC`) |

## 3. Internal order

```
Task analysis → Information architecture → Flows → Count screens → State matrix → flows.md → Cross-check
```

## 4. Step 1 — Task analysis: Goal → Task → Action

| Level | What it is | Becomes |
|---|---|---|
| **Goal** | the end result the user wants | a **function** — tied back to an FR |
| **Task** | the activity needed to reach the goal; one goal, many ways | a **flow** |
| **Action** | the smallest step | an **interaction on a screen** |

Worked example and scenario cards: `structure.md` §3.

## 5. Step 2 — Information architecture

- **Object model:** which objects the user handles → their attributes → their relations.
- **Pick an architecture:** tree · linear · category · hub · tab. Mobile favours **linear** and **tab** (`structure.md` §2).
- Each box in the diagram = one screen → **countable**, and the box name is the screen name
  (`../bnnam-standards/references/naming.md`).

## 6. Step 3 — Flows: eight rules

Self-describing name · one direction · **one goal per flow** · has a legend · a clear start point — several start points → split the
flow · short labels · limited color · **a clear end** — the flow must complete when the goal is reached. Detail and examples:
`structure.md` §4.

**Start by redrawing the competitors' flows** (screenshots in `sources/competitors/`), then draw yours.

## 7. Step 4 — Counting screens: three layers + one extra

**Total screens = main flow + branch screens + data-state screens (+ overlays)**

- **Layer 1 — Main flow.** The shortest path, no errors.
- **Layer 2 — Branches.** For **every** decision point, list **every** outcome — do not stop at the two branches already drawn. Login
  has at least four: correct · wrong · not activated → OTP · forgot password → a whole sub-flow.
  Prompt questions: is there a **waiting** state · a branch **into another flow** · does the system **refuse for business reasons**
  (expired, locked, over quota) · does the outcome **differ by user type** (free / premium, new / returning)?
- **Layer 3 — Data states.** Sweep every core screen with the table in §8. Base rule: each core screen pulls in **1–2 extra states**.
- **Extra layer — overlays.** Modal, bottom sheet, dialog, toast — not full screens, but they still have to be designed.

## 8. Step 5 — State sweep for every core screen

A **list to think through**, not a list to build. A cell that does not apply gets a reason.

| # | State | Applies when | Usually | Suffix |
|---|---|---|---|---|
| 1 | Empty | the screen shows data the user creates / accumulates | own screen, with an invitation to the first action | `Empty` |
| 2 | Loading | data from the network / heavy data | variant | `Loading` |
| 3 | Connection error | every network-dependent screen | shared app-wide + a variant if this screen has its own retry | `Error` |
| 4 | Offline | the app is required to work offline | per-screen variant | `Offline` |
| 5 | Little data / limit reached | a list with 1 item vs many vs full | usually an annotation | `Partial` |
| 6 | First time | first visit to the screen | overlay variant | `First run` |
| 7 | Permission request | needs notifications, camera, location | **not built by default — §10** | — |
| 8 | Sign-in | can it be viewed signed out? | signed-out variant · session expired | `Logged out` |
| 9 | Paywall / plan | what free vs premium sees | own paywall screen + locked variant | `Locked` · `Premium` |
| 10 | Form validation | every form | variant: per-field errors, button enabled / disabled | `Invalid` |
| 11 | Payment result | there is a payment | success · failure · pending · cancelled · restore | `Success` · `Failed` · `Pending` |
| 12 | Destructive confirmation | delete, leave without saving, cancel | confirmation overlay | `Confirm` |
| 13 | Entered from a notification | push / deep link into the middle of a flow | check that the target screen stands on its own | — |
| 14 | Update / maintenance | forced update, server maintenance | 1–2 app-wide screens, counted once | `Update` |
| 15 | **In progress (draft)** | an input screen interrupted — left half-way, connection lost | variant: the content is still there on return | `Draft` |

Freemium mobile apps: rows 9 and 11 **almost always apply** — remind the user if they forget.

## 9. Step 6 — Own screen · variant · annotation

| Treatment | When |
|---|---|
| **Own screen** | the layout is clearly different from the base screen; the user **navigates to** it (OTP, paywall, empty with an invitation) |
| **Variant** | same layout, the main region's content changes (loading, inline error, locked) |
| **Annotation** | a micro change (toast, button label change, tooltip) — **not a screen**; write it in the base screen's `notes` field |

Own screens and variants are each **one screen entry** in `flows.md`, with their own suffix. Get this wrong and the screen list
**bloats artificially** or is **really missing screens**.

## 10. Step 7 — Default: no permission screens

The permission prompt is **system UI**. By default **assume the user has granted every permission** — do not build permission screens
and do not build pre-permission explanation screens. Behaviour when permission is denied goes into the **dev note**
(`../ux-review-handoff/references/handoff-spec.md` §18 permission state machine). A project that wants otherwise records a `DEC`.

## 11. Step 8 — State matrix: two axes

**Axis 1 — data:** what the device currently holds (the table in §8).
**Axis 2 — user context:** where the user is in their relationship with the product.

| Context | Meaning | Differs from default by | Suffix |
|---|---|---|---|
| First time | just finished onboarding, no data | a card inviting the first task, or sample data | `First run` |
| Returning | has used it, has data | the screen's default | `Result` |
| **Mastered** | uses it regularly | **lower density** — drop the tip cards, give the space to content | `Mastered` |
| Error left from last session | the previous session had an unresolved error | one warning line that **disappears by itself** once resolved | `Recovering` |

**The "Mastered" column is the one most often skipped and the most worth doing** — it forces the decision *when do we stop
teaching*. Most apps teach forever: the tip card is still there after three months, taking space from what users actually want to see.

- **No empty cell.** If it does not apply, write *not applicable* **with a one-sentence reason**. An empty cell means *not thought about*.
- **Every state needs an exit.** A state with no way out is where users abandon the app. Projects with Android: state explicitly where
  the **system back button** goes on that screen — same layout as iOS, but Android always has back.
- The matrix is **not saved as a separate file** — every named cell becomes a screen entry in `flows.md`, with `entry condition` and
  `exit`. Cells that are *not applicable* or *later* go in the base screen's `notes` field, so they never disappear silently.

## 12. Step 9 — Technical assumptions `A-##`

Every sentence that asserts a state is an assumption a developer must confirm **before the UI is built**. Every sentence like
*"not done yet"*, *"running"*, *"failed"*, *"connected"* goes through this table.

```markdown
### A-03 · The app knows the widget has been added to the car
- screen: Widget_Result
- status: UNVERIFIED                # UNVERIFIED | VERIFIED | WRONG
- verified: —                       # who, date
```

Evidence: three late discoveries in an earlier project (Carbina) would all have been caught here. An assumption marked `WRONG` →
change the screen, record a `DEC`.

## 13. Step 10 — Writing `flows.md`

Template: `assets/flows.template.md`. One entry per flow under `## Flows` (field `sequence`, `ui: not built`); one entry per screen
under `## Screens` — the heading is the full semantic name with its suffix (`../bnnam-standards/references/naming.md` §2–3).

## 14. Step 11 — Cross-check before asking for approval

- Every screen appears in **≥ 1 flow** — an orphan screen is either extra or a flow is missing.
- Every flow step has a **matching screen** (exact heading match).
- States decided as **later** are written down — never allowed to disappear silently.
- The main flow reaches value in **≤ the competitors' step count**, if `analysis.md` has that number.
- Run `trace` (§15): no FR without a screen, no screen without an FR/UC, no empty *entered from* / *leads to* unless there is a reason.

**Flows do not spawn new screens during the build.** A later stage finds a missing screen → go back and add it to `flows.md` first,
then build it.

## 15. Step 12 — The `trace` command (traceability table built on demand)

The traceability table is **not saved as a separate file** — the fields `answers`, `serves`, `entered from`, `leads to` in each screen
entry **are** the table. Saving it separately means two copies of the same data that will drift apart sooner or later.

The user asks *"what is this screen for"*, *"does FR-008 have a screen yet"*, *"what breaks if I delete screen X"* → read every `### `
entry under `## Screens` and build the table in the report:

```
Screen                           Answers FR  Serves UC    Entered from  Leads to
Add-Photo-Detail Meal_Result     FR-014      UC-008       Add/Photo     Meal Detail
Tracking-Calendar_Empty          FR-022      UC-011       Tracking      —
```

| Question | Signal |
|---|---|
| Is this screen needed? | no FR/UC → extra screen |
| Does this FR have a surface yet? | an FR in `prd.md` that appears in no `answers` field → missing screen |
| Where is this screen entered from? | `entered from` empty → orphan screen |
| Where does this chevron lead? | `leads to` empty → dead end |

Deleting a screen → list every screen that has its name in `entered from` / `leads to`, and every FR that loses its surface.

`trace` is read-only — it never edits `flows.md`.

## 16. Screen identifiers — every project

Every screen in `flows.md` has a **`screen type`** (mandatory — e.g. *home*, *paywall*, *onboarding step*, *settings*, *detail*) and
**`main components`** (e.g. *tab bar*, *list rows*, *plan picker*). They are the signal that lets an agent recognise the situation and
load the right knowledge (paywall → `../mobile-ui-master/references/monetization-screens.md`; onboarding → interaction patterns…).
Missing → the wrong situation is detected and the knowledge never arrives.

Detect them with `../figma-project-maintain/scripts/situations.js` (from the screen's structure, with a confidence value — labels such
as `M-PAYWALL` = screen type *paywall*, `T-TAB-BAR` = component *tab bar*) → the agent fills them in → **the designer confirms**. The
detection disagrees with `flows.md` → ask, never choose yourself. Nothing matches → write *new type* + a description; once the designer
confirms, add it to the project's list of screen types.

## 17. Adaptive projects — iOS 27 · iPhone Duo · iPad

When the project's adaptive level is not *none* (`../iphone-duo-adaptive/SKILL.md`): every flow must **complete** on the outer
display, the inner display and in Split View · compact ↔ regular keeps selection, draft, progress and undo · opening more hierarchy does
not change the meaning of Back / Close / Done · sheets / menus / alerts have a clear source and return point · losing an accessory or a
new scene never becomes a dead end · posture-dependent features have a fallback. Each screen gets an **Adaptive** entry in `flows.md`
(the flow's `adaptive` field: container · what is kept at every size · reveal / collapse / reflow / overflow · state kept across resize ·
posture — written as **conditions** — *"when the width fits primary + secondary → reveal split"* — never by device name).

**Declare the adaptive structure in the sitemap — before the wireframe.** Every screen in the adaptive scope has an `adaptive structure`
field: **level** (hierarchy) · **detail of** (parent screen) · **pane role** when there is room (primary / detail / supplementary) ·
**default selection** when nothing is selected (last opened → most relevant → first · empty list → empty state with a create action) ·
**outer screen keeps** (the pane kept when folded). Why: Duo layout follows the list → detail relation (kit Do / Don't #2); if the
sitemap does not say it, the layout has to be fixed after the fact. The agent infers it from Figma / the PRD, **the designer confirms**.
The adaptive layout job does not build frames for screens missing this field.

## 18. Stop points, self-check, report, knowledge

**Stop and ask:** technical assumptions that need developer verification (§12) · approval of `flows.md`.

**Self-check:** §14 *Cross-check before asking for approval*.

**Report** adds: number of flows · screens per layer (main · branch · state · overlay) · number of unverified assumptions · cross-check
result.

```
Next steps
  → "approve flows"
  → "set the voice"                if voice.md does not exist yet — the wireframe needs both
  → send A-03, A-05 to the developers for verification
```

User says *"approve flows"* (*"duyệt flows"*) → write `status: approved`, `approved: <date>` into `flows.md`.

**Knowledge lenses:** `structure.md` · interaction patterns (`../mobile-ux-fundamentals/references/interaction-patterns.md`) · system
integration and developer awareness (`../ux-review-handoff/references/handoff-spec.md` §13–30). Adaptive projects:
`../iphone-duo-adaptive/SKILL.md`, `../apple-design-iphone/references/ios27-figma-kit.md`. **Monetization screens** (paywall, sale, ad
gate, plan banner): `../mobile-ui-master/references/monetization-screens.md` — **read its §8 risk checklist before building / reviewing**;
the other sections as the screen type needs.
