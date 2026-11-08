---
name: figma-project-maintain
description: Work on a project that already exists in Figma - take over a running app (read every screen in order, map flows from prototype links, canvas arrows, tab bars and button text, extract the voice, list gaps like dead ends, unreachable screens, missing states), rework a screen on a safe "_Fix AI" copy, add screens or states that look like the same product, redesign a running app, report where the project stands and what to do next, and learn from the designer's own "_Fix" edits. Also sets the case (new, maintain, redesign, one-off) and its stage order with approval points. Scripts for screen outlines, flow maps, screen-type detection, safe clones into an own section, edit comparison. Use whenever the user works on an existing Figma file or asks for status, including Vietnamese such as "nắm dự án này", "xem tổng quan dự án", "chỉnh lại màn", "thêm màn", "thêm trạng thái lỗi", "redesign app", "đang tới đâu", "làm gì tiếp", "xem tôi sửa gì". For the screen build loop use figma-ui-flow.
---

# figma-project-maintain — running projects, status, and learning from the designer

This skill owns the jobs around **a project that already lives in Figma** and the project's process as a whole:
- **Case and stage order** — new · maintain · redesign · one-off; which stage comes when and where the designer approves
  (`references/processes.md`).
- **Maintenance** — get the project overview once, then each request takes a short path: rework a screen on a `_Fix AI` copy, add new
  UI, a new feature with a new document, a redesign (`references/maintain.md`).
- **Status** — where the project stands, drift between approved files, what can be done next (`references/design-status.md`).
- **Learning** — the designer edits a `_Fix` copy; compare, ask why, record a testable lesson, fix the same mistake elsewhere
  (`references/learn.md`).

What lives elsewhere: building or editing any screen — the outside-in build loop (`figma-ui-flow`); tool mechanics and `execute_code`
(`figma-agent-tools`); the team's frame, naming, main-component and collaboration rules (`bnnam-standards`); reading the PRD,
UX flows and `flows.md` (`prd-to-ux-flow`); the file's design system, `detect.js`, binding (`design-system-audit`); voice and copy
(`ux-writing`); audit and review (`ux-review-handoff`); click-through flows (`figma-prototype-flow`).

## Need → Read
| Need | Read |
|---|---|
| Which case is this project, the stage order of each case, approval points, the dependency graph | `references/processes.md` |
| Take over a running project: two sources, hard rules, overview steps, the overview report | `references/maintain.md` §1–7 |
| Rework an existing screen · add UI · a new feature · redesign · approval per screen | `references/maintain.md` §8–12 |
| "Where are we / what next" — status blocks, progress, drift, suggestions | `references/design-status.md` |
| The designer edited a `_Fix` copy — compare, ask why, record lessons | `references/learn.md` |
| Outline of every screen, in reading order (blocks, text by role, actions, inputs, choices, images, repeated lists, padding) | `scripts/readscreen.js` |
| Flow map — prototype links, overlays, entry points, dead ends, unlinked buttons, canvas arrows, root tabs, layout order | `scripts/flowmap.js` |
| Screen type, main components, state and frame of each screen (with confidence and reason) | `scripts/situations.js` |
| Clone a screen safely (`_Fix AI`, `_Variant`, new from existing) into the agent's own section | `scripts/clone.js` |
| Create the agent's own numbered section with the file's title frame | `scripts/section.js` |
| Compare `<name>` with the designer's `<name>_Fix` | `scripts/compare.js` |
| Templates for `design/project.yaml` and `design/lessons.md` | `assets/project.template.yaml`, `assets/lessons.template.md` |
| How to read one screen (six questions, certainty) | `../mobile-ui-master/references/reading-screens.md` |
| Detect the file's conventions, `projectYamlDraft` | `../design-system-audit/scripts/detect.js` |
| Read the current voice from the file | `../ux-writing/scripts/textdump.js` |
| Collaboration modes, own section, designer edits win, main components, lesson places | `../bnnam-standards/references/team-rules.md` §12 |
| Screen frame, safe area, template screen | `../bnnam-standards/references/frame-standards.md` |

Do not read everything at once. Each workflow below names the file it needs.

## Core rules
1. **Original screens are untouched.** Read them only to understand the project. Every change — even one word — goes through a
   `<screen>_Fix AI` copy. Never rename the designer's frames (record a *standard name* mapping in `flows.md` instead); rename only frames
   the agent created.
2. **Two sources, never mixed.** Flows, content, copy, terms, tokens, styles and components come **from the project**. Screen skeleton,
   safe area, template screen and naming of new screens come **from the designer's standard**. Disagreement: structure follows the
   standard, appearance follows the project.
3. **Everything the agent makes goes into its own section** — new screens, `_Fix AI`, `_Variant`, flow copies. Never into a designer's
   section, never enlarge one. Use `clone.js` (a bare `clone_node` duplicates main components inside the screen) and `section.js`; both
   check overlaps.
4. **Main components are hands-off.** Use instances; propose changes, the designer edits. Never detach to save time.
5. **Read every screen, in order, whether or not the file has links** — section → row → left to right, image + outline, six questions.
   Link and arrow maps are hints. Retell the project in words and get it confirmed before writing `flows.md`; a guess is asked, never
   filled in.
6. **Copy follows the extracted voice.** Inconsistencies in the old project are put to the designer to choose; old screens stay as they
   are.
7. **A new layout or a part the system lacks → 2–3 option sketches, no component until one is locked** (`processes.md` §1). A screen of an
   existing family is built directly with the sibling as the proportion template. Wireframes only when the designer asks.
8. **Approve per screen, audit only the agent's work.** Maintained projects record `approved` per screen in `flows.md`; audit runs on
   new screens and `_Fix AI` copies, never on originals.
9. **A `<screen>_Fix` copy means the designer is editing.** Do not build, bind or audit it; run the learning loop first. The designer
   deletes old copies — the agent never deletes on its own.

## Workflows

### Take over a running project (`references/maintain.md` §6–7)
1. Read `design/lessons.md › Active` if it exists. Run `../design-system-audit/scripts/detect.js`; submit the `project.yaml` draft
   (`process.case: maintain`), the designer confirms.
2. `scripts/readscreen.js` (per section) + a screenshot of each screen; `scripts/flowmap.js` for links, arrows and root tabs. Answer the
   six questions per screen, mark each path *sure* or *guess*.
3. Retell the flows → designer confirms → write `flows.md` (`from: maintain`), with screen type and main components from
   `scripts/situations.js`, confirmed by the designer.
4. `../ux-writing/scripts/textdump.js` → `voice.md`; gaps → `analysis.md › Gaps`. Report with the overview format (§7).

Entering through one feature → do the same, scoped to that feature's sections (`maintain.md` §5).

### Rework a screen (`maintain.md` §8)
`clone.js` (dry run, then real) → rebuild the skeleton to the standard on the copy, keep content / tokens / components → apply exactly
the change → bind raw values (report values without a token) → audit + side-by-side look → report requested vs skeleton changes →
on lock, `flowmap.js` lists links pointing at the old screen, the designer re-wires and deletes, the copy gets its official name.

### Add UI / new feature / redesign (`maintain.md` §9–11, `processes.md` §3–4)
Into `flows.md` first → copy from `voice.md` → build with the build loop (`../figma-ui-flow/references/build-loop.md`) using the
project's system → audit, compare by eye with sibling screens.

### Status (`references/design-status.md`)
Read only; at most three suggestions, each a sentence the user can say. Drift, unreviewed designer edits and unfinished work first.

### Learn from designer edits (`references/learn.md`)
`compare.js` → understand → ask why by group (max three) → record each answer in one place, as a testable rule → offer to fix the
same mistake elsewhere → the designer locks and deletes the old copy.

## Running the scripts
All scripts are Figma Plugin API code for the tool demo's **`execute_code{code, timeoutMs}`**: read the script, set the `CONFIG` block at
the top (page names from `project.yaml › pages`), send the whole file as `code`. Large pages → `timeoutMs` up to ~120000.
`readscreen.js`, `flowmap.js`, `situations.js`, `compare.js` are read only. `clone.js` and `section.js` write, and default to
`DRY_RUN: true` — show the plan, then run again with `false`. `ROLES` / `NAV` in the readers are the shared text-role rules
(`project.yaml › textRoles`); adjust them when the file names layers differently.

## Common pitfalls
- Trusting `flowmap.js` alone — a file without links still has flows; the layout is the main source and every screen must be read.
- Renaming or "fixing" old screens nobody asked about; auditing original screens.
- Putting a `_Fix AI` copy inside the designer's section, or growing that section to fit it.
- Comparing a `_Fix AI` copy with `compare.js` — its skeleton differs by design; just ask why.
- Picking one of two inconsistent copy styles yourself instead of asking.
- Deleting the old screen, or editing prototype links, at lock time — report them; the designer does it.
- Treating `situations.js` labels as final — they are hints with a confidence; the designer confirms.

## Self-check before reporting
- Every screen in scope was read, with *guess* paths listed as questions.
- No original screen, designer section or main component was changed; new work sits in the agent's own section without overlaps.
- `_Fix AI` copies and new screens audited and checked by eye next to their siblings.
- The report has numbers (screens read / edited / added, skeleton changes, raw values bound / without token, new copy lines) and at
  most three next steps.
