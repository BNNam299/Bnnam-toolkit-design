# Job — lock the component list before building

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/component-spec.md @ 3c0e291 — translated, complete

The meeting point of two branches: structure (the locked screen / wireframe) and style (how things are built). Don't wait until the UI
build to discover which components are needed — the locked screen, the wireframe and the competitors already tell you.

## Contents
0. When to use, inputs and outputs
1. Inventory the whole file first
2. Candidates
3. Criteria for making a component
4. The design-system coverage table
5. Three kinds of output component
6. Style shapes how components are built
7. Spec each component
8. Adaptive projects (iOS 27 · iPhone Duo · iPad)
9. Stop points, self-check, report, knowledge

---

## 0. When to use, inputs and outputs

- The template screen's direction is locked (and, when wireframes are used, the wireframe and `style.md` are approved).
- The UI build discovers a missing component midway → add it to the system through this job, never create it on the spot.

**Not for** building components in Figma (that's the UI build — `../figma-ui-flow/SKILL.md`, then `scripts/componentize.js`). Never
changes a screen's layout.

| Check | If missing |
|---|---|
| the template screen **has a locked direction** (case `new` / `redesign`) or the new screen's option is locked (`maintain`) — `../figma-project-maintain/references/processes.md` | go back to the UI build's option rhythm |
| `flows.md` has `wireframe_approved: <date>` — **only when wireframes are used** | run the wireframe job (`../prd-to-ux-flow/references/wireframe.md`), then the user approves |
| `design/style.md` `approved` — case `new` / `redesign` · case `maintain`: the existing system (mode 2) replaces `style.md`; `style.md` is needed only when there are cut-out ref images | run `style-read.md` |
| the project's component setup is detected | run `scripts/detect.js` |

| Reads | Writes |
|---|---|
| `flows.md` · `style.md` (tokens, component signatures, off-style atoms, *Proposed components*) · `analysis.md` (competitor patterns) · `voice.md` (default values) · `style-parts/index.md` · `competitor-parts/index.md` · the locked screen + `design/work/notes.md` · wireframes and every page in Figma (read only) | `design/components.md` (`../assets/components.template.md`, `status: draft`, `based_on: flows.md@… · style.md@…`) · the project's component naming convention |

## 1. Inventory the whole file first

**Every page, not just the open one.** `scripts/detect.js` returns the atom set (`atoms`) — name, page, variants of each component set.
An empty query is a suspect query (`../bnnam-standards/references/team-rules.md` §1). The tool demo's `search_design_system` gives
a ranked second view.

Record the **existing system's naming convention** in the project settings — e.g. `Button/Primary/Default`,
`Card/List-item/With-thumbnail` — so the agent calls the right names and never builds something that looks alike but isn't an instance.

## 2. Candidates

**Without wireframes** (`../figma-project-maintain/references/processes.md` §1 rule 4) → candidates come from the **locked screen**
(repeated blocks, blocks with several states) · `style.md › Proposed components` + cut-outs in `style-parts/` · `competitor-parts/` with
the matching function · `flows.md` (every screen to be built, screen cases) · the spec. Generate **every** component the app needs in one
pass, not only the template screen's (designer rule); case `maintain` → mode 2: same families, same variables as the existing system.
With wireframes, also read as below.

Read the wireframe page: kit elements with no atom counterpart, and **hand-drawn grey boxes** with descriptive names — count how often each
repeats across different screens. Cross-check with the candidate list the wireframe job submitted.

## 3. Criteria for making a component

Repeats **≥ 2 times** on different screens, **or** has **≥ 2 states**. Below that threshold it's just a frame.

## 4. The design-system coverage table

Each part the wireframe / screens need → one entry under `## Coverage` in `components.md`:
`in the system` (**Yes** / **Yes but missing variants** / **No**) · `component name` · `missing`.
Conclude with three numbers: use as is · needs more variants · **must build new**.

**The states a component already has decide how many cells of the matrix can be built.** A component with only a default state means
every error, empty and loading screen is built by hand, one by one. So the coverage table matches **component states** against **the states
in `flows.md`** (screen suffixes), not only names.

## 5. Three kinds of output component

| Kind | Definition | Example |
|---|---|---|
| **Assembled** | built entirely from atoms, nothing new drawn | `Meal Row` = List Row + Badge + Icon Button |
| **Same style, new structure** | no atom matches the shape; drawn new | `Macro Ring`, `Calorie Chart` |
| **Atom extension** | an atom is close but lacks a state | **propose** a variant — the designer adds it to the main atom |

- **Assembled:** any element that looks like an atom **must be an instance**.
- **New structure:** existing tokens only (`system-binding.md` §1). If it needs a value the system lacks → report (`system-binding.md`
  §4).
- **Atom extension:** touches a main component — layer 1 — the agent **doesn't edit**, only proposes; the designer edits
  (`../bnnam-standards/references/team-rules.md` §12.4).

**Test for every element:** an atom exists → instance is mandatory · a small variation → instance + override, or propose a variant ·
genuinely new → draw it, and record why.

## 6. Style shapes how components are built

Read *Effects on building* in `style.md`: floating or pinned tab bar · cards or flat rows · density. Record it in the spec of every affected
component.

**Repeated elements with a variable count** — code cells, OTP boxes, steps, page dots, rating stars — **the component is ONE element**,
its states are variants; the row is an auto-layout frame holding instances. Never wrap the whole row in one component: the count would be
frozen. Test: adding or removing one cell is just duplicating or deleting one instance.

**How the file expresses state** — `scripts/detect.js › stateLanguage` (stored in the project settings): if the file changes state with
**background**, new components change background too, with no added border; with a border → border. Never guess from general habit.

**Look for existing components in libraries** before specifying a new one — the tool demo's `search_design_system` (with
`includeLibraries` for team libraries). If it exists, use it; don't rebuild. A component from an **external library** (`remote`) cannot
gain variants in this file — propose the change in the library file, never promise a new variant.

**New components take their shape from the style ref, not only its tokens.** Every new component records a `style from` field:
- the family has a signature in `style.md` › *Component signatures* → follow it, with the source image
- the family has an **off-style** atom → follow the designer's choice in `style.md` › *Atoms off-style*: (a1, a2) wait until the main
  component is refined, then build · (b) follow the main component · (c) follow the ref + log a decision. **No choice yet → stop that
  family and ask** — never choose yourself
- the family isn't in the ref → follow the nearest atom in the file; write *"not in ref — follows <atom>"*

A new component next to an existing atom on the same screen (a new button beside `Button/Primary`) → check the two speak **the same
language**: same shape, same shadow style. If they differ and it isn't choice (c) → report.

## 7. Spec each component

Template: `../assets/components.template.md`. Names by domain (`../bnnam-standards/references/naming.md` §6), states are variants.
- **Used in** takes the **exact screen names** in `flows.md`.
- **Reference** records the **structural** pattern taken from a competitor (`analysis.md`) — the next pass needn't rescan.
- **Properties** recorded up front for every component property — editable text, icon on/off, swappable icon, size — so none is forgotten
  during the build (`atomic-design.md` §5.4).
- **Style from** records the **shape** source: a signature in `style.md` + ref image, or the main atom (§6).
- **States** listed fully enough to cover the matrix cells of §4.
- Think ahead about properties per the new-component standard: which text users often change, which parts are optional, which icons are
  swappable — record under `notes`.

**Build order:** atoms → molecules → organisms. Never build a card before the badge it contains. Safe area is an **atom the designer has
prebuilt** (`../bnnam-standards/references/frame-standards.md` §5) — list it in the coverage table as *exists*, don't spec it again.
Can't find it → ask the designer.

---

## 8. Adaptive projects (iOS 27 · iPhone Duo · iPad)

When the project's adaptive level is not `none`: every important component gets an **adaptive contract** — role · size behaviour ·
**axis behaviour** (horizontal only / prefers vertical / has its own variant) · **visibility priority** (always shown / grouped priority /
may go to overflow) · safe behaviour (follows safe area / full bleed / avoids reserved region) · continuity · accessibility. Prefer iOS 27
kit components (`../apple-design-iphone/references/ios27-figma-kit.md` §6): toolbar, tab bar, sheet, sidebar, status bar have ready
iPhone Duo versions. Detailed contract — invariant anatomy, representation per space, transition contract, **failure contract**:
`../iphone-duo-adaptive/SKILL.md` (`../iphone-duo-adaptive/references/duo-components.md`).

## 9. Stop points, self-check, report, knowledge

**Stop and ask:** an off-style component family with no a / b / c choice → stop that family, ask (§6) · approval of `components.md`.

**Self-check:** §1 the whole file inventoried first · §3 criteria for making a component applied · §4 coverage table complete.

**Report** (team format — `../bnnam-standards/references/team-rules.md` §9), plus: the three coverage numbers · components by kind ·
atoms inventoried.

```
Next step
  → "approve components"
  → "build the Onboarding screens"   first batch, once components.md is approved
```

Knowledge: `../mobile-ui-master/references/screen-structure.md` (the designer's screen structure — read before building frames) ·
`component-system.md` · `tokens.md` · `figma-practice.md` · `../apple-hig/SKILL.md` + `../material-design-3/SKILL.md` — consult both.
Adaptive projects: `../iphone-duo-adaptive/SKILL.md` · `../apple-design-iphone/references/ios27-figma-kit.md`. **Monetization screens**
(paywall, sale, ad gate, plan banner): `../mobile-ui-master/references/monetization-screens.md` — **read the §8 risk checklist before
building / reviewing**; other sections as the screen type needs.
