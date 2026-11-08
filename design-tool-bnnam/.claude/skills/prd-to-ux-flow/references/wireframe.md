# Job 4 — Grey wireframes by flow, in Figma (optional, on request)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/wireframe.md, knowledge/wireframe.md @ 3c0e291 — translated, complete

**Deleting a wireframe deletes one frame; deleting a component breaks every screen that uses it.** Four of the five most expensive
reworks in an earlier project would have been stopped by a wireframe approval step.

## Contents
1. When to use
2. Inputs and outputs
3. Step 1 — Prototypes of each interaction type, not every screen
4. Step 2 — Fidelity
5. Step 3 — The wireframe kit (`Wireframe/` prefix)
6. Step 4 — Layout by flow on the canvas
7. Step 5 — Notes outside the frame: exactly three items
8. Step 6 — Stretched frames keep a fold line
9. Step 7 — Technical assumptions
10. Step 8 — A missing screen is found
11. Wireframe acceptance
12. Adaptive projects (iOS 27 · iPhone Duo · iPad)
13. Stop points, self-check, report, knowledge
14. Wireframe craft — sitemap, three fidelities, build order, cautions

---

## 1. When to use

- **Only when the designer asks for it** (the project sets `process.wireframe: true`, or the user says *"build wireframes"* /
  *"dựng wireframe"*). When used: after the flows, before UI — approve the flows and every screen case (empty, error, loading, first
  time…) before moving to UI (`../figma-project-maintain/references/processes.md` §1). Without it, the UI build starts straight from
  `flows.md`.
- `flows.md` and `voice.md` are approved and the layout needs approval before components are made.
- Adding wireframes for new screens already in `flows.md`.
- The UI produced a new state → add it back into the wireframe (`../bnnam-standards/references/naming.md` §4).

**Not for** color, images, style or real components — those are the style, component and UI build jobs
(`../design-system-audit/SKILL.md`, `../figma-ui-flow/SKILL.md`).

## 2. Inputs and outputs

| Check | If missing |
|---|---|
| `design/flows.md` `approved` | run `ux-flow.md` |
| `design/voice.md` `approved` | set the voice (`../ux-writing/references/voice-and-tone.md`) — wireframes use real copy |
| The project file knows the Figma setup (platform, pages) | run `../design-system-audit/scripts/detect.js` and give the detection to the user to confirm |
| The designer's template screen is pointed to and analysed (if the designer has one) | run `detect.js` with `TEMPLATE`, describe its skeleton back for the designer to confirm (`../bnnam-standards/references/frame-standards.md` §4) |
| The screen about to be touched has **no** `<screen name>_Fix` copy | it has one → the designer is editing: learn from the designer's edit first (`../bnnam-standards/references/team-rules.md` §12) |

| Reads | Writes |
|---|---|
| the lessons the team currently applies · `flows.md` · `voice.md` · `prd.md` (bans) · the project settings · the wireframe page in Figma | frames on the wireframe page · `flows.md` (new assumptions; `wireframe_approved` when the user approves) |

Before the first batch: read the Figma API traps (`../figma-agent-tools/references/troubleshooting.md`). Before and after every screen:
the screen build checklist (`../bnnam-standards/references/frame-standards.md` §14).

## 3. Step 1 — Prototypes of each interaction type, not every screen

Build one carefully made **prototype per interaction type** first — the main screen of each tab · a pick-from-list · detail / edit ·
bottom sheet · multi-step guide · transaction. About eight prototypes cover 25 screens. **Derive the list from `flows.md`:** count
interaction types, not screens.

**Stop rhythm** (same rhythm as the UI build): the **template screen** (first prototype) is built straight through to done → **stop
once** for the designer to review it as the standard · the remaining prototypes and then the multiplied screens are built in **batches
= a group or flow of related screens**, **reviewed at the end of the batch** — no separate approval per prototype · **never stop between
the passes** of one screen.

App-type-specific prototypes: commerce has cart and checkout; content has feed and player; finance has balance and transaction history.

## 4. Step 2 — Fidelity

- 3–4 greys · **no** brand color, images, gradients or shadows.
- **Real UX writing**, no lorem ipsum — text length decides the layout (`../ux-writing/references/principles.md` §11).
- **No measurements written in the wireframe** — no pt, no px, no radius labels on the canvas. The placeholder blocks still have **real
  sizes**: the wireframe is Pass 1 of the build loop (`../figma-ui-flow/references/build-loop.md`) — build the root frame with
  `layoutMode NONE` + Safe-Area + the three containers + sized blocks, then Pass 2 drops in wireframe-kit instances and real copy region
  by region (frame rules: `../mobile-ui-master/references/screen-structure.md` §1, `../bnnam-standards/references/frame-standards.md`).
- Two pieces of behaviour information **do** belong in a wireframe: **content order** and **what is visible without scrolling**.
- Image placeholder: a crossed box, no text, described in the layer name (`../ux-writing/references/principles.md` §2).
- Phone screens (compact) only — unless the project is adaptive (§12).

**A wireframe pretty enough to feel sorry about deleting has the wrong fidelity.**

## 5. Step 3 — The wireframe kit (`Wireframe/` prefix)

**In the kit** — repeated elements whose shape does not depend on the project: nav bar · tab bar · button · icon button · toggle ·
radio · checkbox · search · segmented · slider · chip · list row (+value, +toggle) · card · sheet · scrim · section header · badge · dot ·
progress · skeleton · image box · avatar box · icon box.

**Safe area is not in the kit** — wireframes use the two safe-area components the designer places in every project directly
(`../bnnam-standards/references/frame-standards.md` §5–6): they are empty space, no color, so wireframe and UI share one structure
from the start.

**Not in the kit** — the parts that need thinking: project-specific cards · how the screen is arranged · how content is grouped · how
space is shared. That is the value of the wireframe step.

- **1:1 mapping** of every kit element to a real atom → moving to UI is a mechanical swap.
- An element with **no counterpart** = a signal that a new project component is needed → input for the component spec job.
- **Three constraints:** the kit is visually flat · **the agent never adds to the kit by itself** (missing → report it) · the kit takes
  real text.
- **A hand-drawn grey box is a component candidate**, not junk — give it a descriptive name
  (`../bnnam-standards/references/naming.md` §6). At the end of the session hand in the list with repeat counts.

Tokens: use the kit's tokens if the kit has them; if not, raw greys are allowed in wireframes.

## 6. Step 4 — Layout by flow on the canvas

One **section** per flow, its label named `— section label`. Three rows, left → right following the flow's `sequence:` in `flows.md`:

```
Row 1   Main path              screen → screen → screen      arrows labelled with "what is tapped"
Row 2   Conditional branches                                each branch labelled: "if the code is wrong 3 times"
Row 3   Remaining states                                    every state-matrix cell not yet in the two rows above
```

**Row 3 is the row that saves you** — everyone draws the main path; loading, empty and offline are always the ones left out.

**No arrow without a label.** An arrow leaving a branch states the **condition**, not the action.

Frame name = **exactly the screen heading in `flows.md`**, suffix included. Root frame `layoutMode = NONE`.

## 7. Step 5 — Notes outside the frame: exactly three items

Same placement convention as dev notes: **at section level, next to the screen**, never inside the frame
(`../ux-review-handoff/references/handoff-spec.md` §3). All explanation of a screen lives here, **never inside the frame**
(`../ux-writing/references/principles.md` §2):

1. What the screen is for — with its FR/UC.
2. Where it is entered from, where it goes, which button is disabled when, the exit.
3. The screen's other states, with their conditions.

High-risk states (delete, payment, permission, data loss, sensitive data) add a **content frame**
(`../ux-writing/references/principles.md` §6).

## 8. Step 6 — Stretched frames keep a fold line

Users often stretch a frame to illustrate scrolling. Allowed, but place a thin line at exactly the device height (the project's frame
size), named `— fold` — so you can still see whether the primary CTA is in the first view.

## 9. Step 7 — Technical assumptions

**Every wireframe comes with an assumptions table** — any copy that asserts a state (*"connected"*, *"not added yet"*) must have an
`A-##` entry in `flows.md` (`ux-flow.md` §12). Writing copy uncovers new assumptions → add them to `flows.md` and name them in the
report. The wireframe approval gate approves **layout + the assumptions table**.

## 10. Step 8 — A missing screen is found

Never build a screen that is not in `flows.md`. Add it to `flows.md` first (`ux-flow.md`), then build it.

## 11. Wireframe acceptance

Every element that exists in the kit is an instance · hand-drawn boxes have descriptive names · real copy in the `voice.md` rhythm · no
brand color, no images · assumptions table present · component-candidate list present · the screen audit
(`../ux-review-handoff/scripts/audit.js`, `MODE: "wireframe"`) has no errors left.

**The wireframe has done its job when** the UI step only has to make it beautiful: no screens added, none removed, no content changed.

## 12. Adaptive projects — iOS 27 · iPhone Duo · iPad

When the project's adaptive level is not *none* — this **replaces the "phone only" limit** for that project: build at least **compact,
regular and one intermediate size**; add book / tabletop if that posture has value · mark the full-bleed layer and the safe content
layer · annotate reserved regions with an overlay, **never** as a fixed spacer · an even column count around the fold · forms and text
have a max-width · controls sit next to the pane / content they act on. Names and the variant matrix, the minimum frame set and the
**annotations required on every frame**: `../iphone-duo-adaptive/SKILL.md`.

## 13. Stop points, self-check, report, knowledge

**Stop and ask:** template screen done → review as the standard · end of each batch → review · **never** stop between the passes (§3) ·
wireframe approval.

**Self-check:** *Wireframe acceptance* (§11) · `audit.js` in `wireframe` mode.

**Report** adds: screens built / total in `flows.md` · number of prototypes · audit result · **component-candidate list** with repeat
counts · new assumptions.

```
Next steps
  → "approve wireframe"            unlocks the component spec
  → "read the style"               can run in parallel
  → "finish the wireframes"        if screens are still missing
```

User says *"approve wireframe"* (*"duyệt wireframe"*) → write `wireframe_approved: <date>` into the status block of `flows.md`.

**Knowledge lenses:** the designer's screen structure standard — read before building any frame
(`../mobile-ui-master/references/screen-structure.md`) · `structure.md` · interaction patterns
(`../mobile-ux-fundamentals/references/interaction-patterns.md`) · §14 below · layout (`../mobile-ui-master/references/layout-spacing.md`)
· **writing** (`../ux-writing/references/handbook.md`) · both platforms — iOS (`../apple-design-iphone/references/ios-platform.md`) and
Android (`../material-design-3/references/android-platform.md`). Adaptive projects: `../iphone-duo-adaptive/SKILL.md`,
`../apple-design-iphone/references/ios27-figma-kit.md`. **Monetization screens** (paywall, sale, ad gate, plan banner):
`../mobile-ui-master/references/monetization-screens.md` — **read its §8 risk checklist before building / reviewing**; the other
sections as the screen type needs.

## 14. Wireframe craft — sitemap, three fidelities, build order, cautions

A thinking lens, not a procedure; the decided rules above win where they differ.

- **Sitemap:** run **card sorting first** to cluster the functions.
- **Three levels:** **lo-fi** (pen and paper, rough) · **mid-fi** (digital tool, more precise) · **hi-fi wireframe** (close to a
  prototype in shape, text, color and buttons but **not interactive**).
- **Build order:**
  1. **Set the frame size** — lo-fi need not be exact; mid/hi-fi follow the device standard.
  2. **Draw navigation first** — nav bar, search, navigation icons (arrows, chevrons) → keeps the frames linked.
  3. **Large parts** — header in **bold strokes**, body in **thin strokes**, image = **crossed rectangle**.
  4. **Details** — dropdown, button, checkbox, text field; multi-frame flows get a progress bar or dialog; **add the CTA / choices**.
- **Cautions:**
  - **draw every interaction on the main page** — it is the starting point of many sub-pages and detail pages;
  - **no lorem ipsum** — the text carries meaning: store name, section title, CTA;
  - **keep actions realistic** — only draw what can be done in the real product;
  - **annotate clearly** so every party understands fast;
  - **show hierarchy** — navigation, in-page components, content;
  - **be creative — several solutions per idea**, then choose the one that fits the goal.
