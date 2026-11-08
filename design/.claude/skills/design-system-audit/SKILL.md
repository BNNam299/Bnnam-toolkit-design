---
name: design-system-audit
description: Design-system work in the user's Figma file - detect its conventions (token tiers, bind target, atoms, state language), audit variables, styles and components (unused, duplicates, broken aliases, scopes, ramps, token-pair contrast, variants) and fix approved groups after a dry run; read a moodboard into measured tokens and component signatures; snapshot, refine and diff the base kit; lock the component list before building; bind legacy hard-coded values; check the impact of editing a main component, restyle one on order, turn a repeated block into a component. Knowledge on token tiers, OKLCH ramps, type / spacing / radius scales, Atomic Design, component properties. Use when the user asks to audit or optimise the design system or variables, prepare the kit, read the style, plan components or bind raw values. Vietnamese triggers such as "soát design system", "tối ưu variables", "dọn biến", "chuẩn bị kit", "đọc style", "chốt component", "gắn biến". For building screens use figma-ui-flow.
---

# design-system-audit — the file's system: audit it, feed it, use it

This skill owns **the design system inside the user's Figma file** — variables, styles and components — and the jobs around it:
- **Detect** the file's conventions before anything else (`scripts/detect.js`).
- **Audit** the system's health and fix approved groups (`references/system-audit.md`).
- **Style reading** — moodboard → measured tokens, component signatures, cut-out parts (`references/style-read.md`).
- **Base kit setup** — snapshot, refine variables / atoms after the first screen's direction is locked, diff at the end
  (`references/kit-setup.md`).
- **Component spec** — the full component list, coverage against the system, build order (`references/component-spec.md`).
- **Using the system** — the binding rules every build follows, bulk-binding legacy values, impact checks before touching a main
  component, restyle on order, componentize repeated blocks (`references/system-binding.md` + scripts).

What lives elsewhere: building screens and the outside-in build loop (`figma-ui-flow`); tool mechanics and `execute_code`
(`figma-agent-tools`); the per-screen audit (`../ux-review-handoff/scripts/audit.js`, tool `audit_design`); backgrounds
(`screen-background`); team naming, frame and main-component rules (`bnnam-standards`); which case a project is in
(`../figma-project-maintain/references/processes.md`).

## Need → Read
| Need | Read |
|---|---|
| Which collection is primitive / alias / mapped, bind target, spacing / radius / sizing variables, atoms, state language, safe-area components, template screen | `scripts/detect.js` (below) |
| Every property → its required source; priority variable → style → report; exceptions; visual zones; the nine counts | `references/system-binding.md` |
| Audit variables, styles, components; the result groups and what to do with each; the four fix types | `references/system-audit.md` |
| Measure a moodboard, mode 1 / mode 2, component signatures, off-style atoms (a1 / a2 / b / c), cut-out parts | `references/style-read.md` |
| Base kit: snapshot on entry, refine variables / atoms after the lock, ledger, diff back to the base kit | `references/kit-setup.md` |
| Component list, coverage table, three kinds of component, `style from`, build order | `references/component-spec.md` |
| Token tiers, token groups, governance; generating ramps, dark mode, contrast fixes, type / spacing / radius scales; design-system checklist | `references/tokens.md` (§1–2 rules, §3–12 background) |
| Component choice per job (buttons, inputs, navigation, containers, dialogs, feedback); iOS ↔ Android map | `references/component-system.md` |
| Atom → page levels, when to make / split a component, the mobile kit checklist, variants vs properties vs slots, Figma library practice, governance | `references/atomic-design.md` |
| Figma file / auto layout / variables practice, AI in Figma, audit checklists | `references/figma-practice.md` |
| Templates for `style.md`, `components.md`, `kit.md` | `assets/*.template.md` |
| OKLCH ramps, sibling ramps, mirrored dark steps, contrast of a pair | `../screen-background/scripts/palette.py` |
| Measuring a screenshot / cutting reference parts | `../bnnam-standards/scripts/clone_measure.py` |
| Writing variables / styles / component sets; library search | `../figma-agent-tools/SKILL.md` (`create_variables`, `import_tokens`, `create_styles`, `create_component_set`, `search_design_system`) |
| Main components hands-off, the three exceptions; designer edits win | `../bnnam-standards/references/team-rules.md` §12 |
| Exact Apple / Material scales and component pages | `../apple-hig/SKILL.md`, `../material-design-3/SKILL.md` |

Do not read everything at once. Each workflow below names the file it needs.

## Core rules
1. **Detect, then confirm.** Run `detect.js` on an unfamiliar file and give its `projectYamlDraft` to the user to confirm before relying on
   it. An empty query is a suspect query — re-check with a different method before concluding something is missing.
2. **Always use the file's system.** Every property with a matching variable or style uses it: **variable → style → report**. Never
   hard-code, never create a variable or style mid-build, never snap to the nearest value unless the project chose `snap-nearest`. An
   off-system value is a gap to report, grouped by value with counts (`system-binding.md` §1–4).
3. **Bind to the design tier, by role.** Colors bind to the mapped / semantic collection, never to primitives; text → `content/*`,
   backgrounds → `surface/*`, borders → `border/*`. **Primitives carry empty scopes**; semantic variables carry role scopes. A variable
   without values in every mode is not bound.
4. **Two zones.** System UI (auto layout, everything bound) vs free visuals inside a plain `visual_…` frame (only color should be
   tokenised; skipped by audits). Text on top of a visual is still system UI.
5. **Read only until approved; dry run before every write.** Every writing script defaults to `DRY_RUN: true`. Report before → after,
   wait for *"run it for real"* (*"chạy thật"*), then run. Delete / merge variables only after auditing every page.
6. **Main components are hands-off.** Report or propose; the designer edits. The agent edits only on an explicit order (restyle a2, kit
   refinement after approval) and always runs `impact.js` first. New main components live in their own section, never inside a screen.
7. **Draft, then lock, then componentize.** Options and drafts are plain frames; components are created after the designer locks the
   direction. A part becomes a component when it repeats **≥ 2 times** on different screens or has **≥ 2 states**. Repeated items with a
   variable count (OTP cells, dots, stars) are **one** component per item, with the row as an auto-layout frame of instances.
8. **Measure, don't feel.** Style values come from the moodboard and the locked screen, measured (hex, area share, hue, WCAG contrast,
   radius, padding). Competitor images give structure, never style.
9. **Follow the file's state language.** If the file shows states with background, new components do too — `detect.js › stateLanguage`.
10. **Scales are closed and evidence-based.** OKLCH ramps on the kit's own step set; dark mode by mirrored steps; fix contrast by shifting
    L only; **letter spacing = size × 2.5 %** and the designer's radius rules win over generic advice (`tokens.md` §2).

## Running the scripts
Every `.js` file in `scripts/` is the body of an async function for the tool demo's **`execute_code{code, timeoutMs}`**: read the script,
set the `CONFIG` constants at its top, send the whole file as `code`. Default timeout is 30 s — pass `timeoutMs: 120000` for whole-file
scans. Results are JSON; a `stop` key means it refused and says why.

| Script | Writes? | Use |
|---|---|---|
| `detect.js` | no | file conventions → a draft of the project settings for the user to confirm; `TEMPLATE` returns a template screen's skeleton |
| `system-audit.js` | only approved `APPLY` (`DRY_RUN`) | system health; fixes `scope` / `rename` / `delete` / `merge` on variables |
| `kitread.js` | no | read a whole kit / library file in one call (pages, variables per mode, styles, components, guide text) |
| `kit-snapshot.js` | no | near-DTCG snapshot of variables, styles, components → `design/kit/kit-goc.json` / `kit-du-an.json` |
| `kit-apply.js` | yes (`DRY_RUN`, `LOCKED`) | apply approved variable changes (`value`, `create`, `scope`, `describe`), returns a ledger |
| `kit_diff.py` | — | `python scripts/kit_diff.py <kit-goc.json> <kit-du-an.json> --out design/kit/chenh-lech.md` |
| `inspect.js` | no | shape signature of existing components (radius, fill, border, shadow, padding, type, children) |
| `impact.js` | no | instances, screens, host components, overrides of a component — before any main-component edit |
| `restyle.js` | yes (`DRY_RUN`) | refine ONE main component to the approved off-style proposal (choice a2 only) |
| `componentize.js` | yes (`DRY_RUN`) | turn an identical repeated block into a component and replace it with instances, keeping text overrides |
| `bind.js` | yes (`DRY_RUN`) | bind legacy raw fills, strokes, text, spacing, radius, stroke weight, effects on named screens |

**`bind.js` vs the tool demo's `bind_variables`:** `bind_variables` is faster for fills, strokes, gap / padding and radius under one
root and also defaults to a dry run. Use `bind.js` when you also need text styles by exact `size/weight`, stroke weight, effect styles,
the text / surface pool split, or the skips for visual zones, instance children, `_Fix` copies and template screens. Never bind to
primitives with either.

## Workflows

### A. First contact with a file
1. `detect.js` (`PAGES: null`, `SCREEN_PAGES` set) → show the draft settings, `needsConfirmation` and `brokenSets` → the user confirms.
2. Read the conventions you will rely on: bind target, color prefixes, spacing / radius pools, `valuesFilled`, safe-area components,
   atom page, state language.

### B. Audit the system — `references/system-audit.md`
`system-audit.js` read-only over every page → `design/system-audit.md` → ask by group, heaviest first, at most three per round → fill
`APPLY` with the approved rows → dry run → *"run it for real"* → re-audit and confirm the counts dropped. Styles and components are
report-only.

### C. Read the style — `references/style-read.md`
Measure the moodboard (§6) → mode 1: generate tokens (`tokens.md` §2) · mode 2: USE / PROPOSE / REPORT against existing tokens → component
signatures per family (§8) → `inspect.js` on existing atoms and ask a1 / a2 / b / c for off-style ones (§9) → cut-out parts and the index
(§10) → `design/style.md` from `assets/style.template.md` → write to Figma only after *"approve style"*, primitive → alias → mapped.

### D. Base kit — `references/kit-setup.md`
On entry: audit + `kit-snapshot.js` + `kit.md`, change nothing. After the first screen is locked: agree the scope → proposal table with
NEEDS REVIEW flags and a before / after preview → `kit-apply.js` dry run → real run → ledger. Atoms: drafts next to the originals →
`impact.js` → approval → `restyle.js` / `componentize.js` → delete drafts by ledger id → re-audit. End of project: snapshot + `kit_diff.py`.

### E. Component spec — `references/component-spec.md`
Inventory every page (`detect.js › atoms`, `search_design_system`) → candidates from the locked screen, `style.md`, competitor parts,
`flows.md` → apply the ≥ 2 rule → coverage table matched on **states**, not just names → kind, `style from`, properties, states per
component → `design/components.md` from `assets/components.template.md` → approval → build atoms → molecules → organisms.

### F. Use the system while building or fixing
Before a build: know the pools (`detect.js`). While building: follow `system-binding.md`. Legacy screens: `bind.js` on one screen as a dry
run → report → real run → the screen audit. Touching a main component: `impact.js` first, report instances / screens / overrides; a
structural change can drop overrides — reapply from `overrideDetail`.

## Common pitfalls
- **Broken component sets** (`brokenSets` in `detect.js`, *"has existing errors"* from `search_design_system`): the script skips them and
  carries on; tool calls on that set still fail — ask the designer to repair the set before binding or componentising against it.
  `safeAreaComponent` empty → confirm the safe-area components with the designer before assuming there are none.
- Binding a color to a primitive "because it matched" — it breaks theming; use the mapped variable or report.
- Deleting "unused" variables after auditing only some pages, or variables reserved for developers / future modes.
- Treating a responsive collection as usable when every mode holds the same value (`valuesFilled: false`) — report it.
- Creating a token or a component mid-build to make a screen work.
- Componentizing during the draft rhythm, or wrapping a whole row of OTP cells / stars into one component.
- Borrowing a competitor's colors or radii; inventing a signature for a family the moodboard doesn't show (*"not in ref"*).
- Detaching to tweak, one variant per icon, theme as variants — fix the component's properties instead (`atomic-design.md` §5).
- Cleaning drafts by name or prefix instead of by ledger id.
- Trusting a dry run on one screen as proof for all — re-run the audit after every real run.

## Self-check before reporting
- Conventions detected and confirmed; nothing relied on that the user hasn't confirmed.
- No raw value where the system has an entry; off-system values reported, grouped, with counts.
- Every write had an approval and a dry run first; ledgers saved; locked areas untouched; main components untouched unless ordered,
  with `impact.js` run first.
- Audits re-run after fixes, fixed groups back to 0, token-pair contrast passing in every mode.
- Report counts per group / type (never one combined number), what is waiting for the designer, and the next step.
