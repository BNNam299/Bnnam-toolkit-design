---
name: bnnam-standards
description: The design team's own standard for its Figma files, winning over generic defaults there - read before acting, who wins when sources disagree (Apple's system numbers first), gates, error groups, consent and stop points, the design/ folder and decision log, reports, nine hard rules; working with the designer (_Fix and _Fix AI copies, own section, main components hands-off, learning from edits), brainstorming; screen naming; the designer's frame (root NONE, Safe-Area per device, background clusters, 402x874 for new projects); team lessons for building screens (image placeholders, vector vs generated image, clone tests); the draft and option rhythm and the lock phase (components, icons, audit, batches). Use whenever you build, edit, name, clone or review screens in the team's files. Vietnamese triggers such as "chuẩn team", "đặt tên màn", "khung màn chuẩn", "safe area", "dựng nháp", "làm option", "chốt màn", "nghiệm thu lô", "clone màn từ ảnh", "bản Fix". For the generic build loop use figma-ui-flow.
---

# bnnam-standards — how the team works in its Figma files

This skill is the team's (designer's) standard. It sits **on top of** the tool demo: `figma-ui-flow` owns the 8-stage process and the
three-pass build loop, `figma-agent-tools` owns the tool mechanics. Wherever this skill differs from them, **the team standard wins in the
team's files** — the designer's standard was decided to win in every file. The parts:
- **Team rules** — reading first, who wins, gates, error groups, saying it, consent, project data, reports, hard rules, collaboration with
  the designer, brainstorming (`references/team-rules.md`).
- **Naming** — screens, suffixes, components, reserved layer names (`references/naming.md`).
- **The designer's frame** — draft vs locked frame, root `NONE`, Safe-Area component per device, background clusters, Duo frames,
  platforms, build checklist (`references/frame-standards.md`).
- **Building screens** — the team's additions to the build loop, image placeholders, clone tests, common mistakes
  (`references/screen-building-lessons.md`); the draft and option rhythm (`references/draft-and-option-rhythm.md`); the lock phase,
  components, icons, audit, batches (`references/lock-phase.md`).

What lives elsewhere: the screen structure measured from the designer's screens and monetization screens (`mobile-ui-master`); the
file's design system, tokens, `detect.js`, binding, kit setup (`design-system-audit`); running projects, `_Fix` comparison, status
(`figma-project-maintain`); flows and wireframes (`prd-to-ux-flow`); copy (`ux-writing`); audit script and UX review
(`ux-review-handoff`); backgrounds (`screen-background`); generated images (`app-asset-generator`); iOS 27, iPhone Duo and iPad
adaptation (`iphone-duo-adaptive`, `apple-design-iphone`, `apple-design-ipad`).

## Need → Read
| Need | Read |
|---|---|
| Golden rule, three layers, who wins (Apple numbers, designer, project, defaults) | `references/team-rules.md` §1–3 |
| Gates, roles, six error groups, what to always say, going in circles | `references/team-rules.md` §4–6 |
| Plan before running, what counts as consent, where to stop | `references/team-rules.md` §7 |
| The `design/` folder, status block, decision log, `project.yaml` | `references/team-rules.md` §8 |
| Report format; knowledge as a lens; HIG + Material; one layout for iOS and Android; nine hard rules | `references/team-rules.md` §9–10 |
| `_Fix` / `_Fix AI`, own section, designer edits win, main components, learning loop, where lessons go | `references/team-rules.md` §12 |
| Brainstorming options with the designer | `references/team-rules.md` §13 |
| Name a screen, a suffix, a component, a placeholder layer | `references/naming.md` |
| Frame size, root `NONE`, template screen, Safe-Area, background clusters, Duo frames, build checklist | `references/frame-standards.md` |
| Building or editing a screen — team rules for the loop, vector vs generated image, done gate, modes | `references/screen-building-lessons.md` §1–9 |
| Image placeholders → layout → ask → fill (table, drawing style, detail level, generated images) | `references/screen-building-lessons.md` §3 |
| Clone a screen from an image (test mode) | `references/screen-building-lessons.md` §10 · `scripts/clone_measure.py` |
| Drafts, options for a new direction, quick check | `references/draft-and-option-rhythm.md` |
| "Lock screen …", components, icon rules, audit, eye check, batches, legacy binding | `references/lock-phase.md` |
| Create / extend the `Safe-Area` component set | `scripts/safearea.js` · `references/frame-standards.md` §6 |
| The tool demo's build loop and Definition of Done (the base this skill adds to) | `../figma-ui-flow/references/build-loop.md` |

Do not read everything at once: `team-rules.md` §1–7 once per session, then only the file of the job at hand.

## Core rules
1. **Read before you act.** Figma is the source of truth — re-read the screens, pages and components you will touch every session and
   right before each command when the designer is working in parallel. Notes that disagree with Figma are stale.
2. **Who wins:** Apple's published system numbers (safe area, bars, margins, Dynamic Type) → the designer's standard (template screen,
   frame, naming) → project data and lessons → tool-demo defaults. A designer number that deviates from Apple → report it, propose Apple's.
3. **Never destroy, never overreach.** Everything the agent makes goes into **its own section** (`clone.js`, `section.js`); existing
   screens are edited only on a `<screen>_Fix AI` copy; the designer's frames are never renamed; **main components are hands-off** —
   instances and overrides only, propose changes.
4. **Designer edits win.** A `_Fix` copy means the designer is working — don't build, bind or audit that screen; compare, ask why (at most
   three questions), record a testable lesson.
5. **The designer's frame — drafts and locked screens alike.** The screen frame has **no auto layout** (`layoutMode NONE`); inside it
   sit layer frames, each built with auto layout. Usually `Background/*` → `Content` → `Bottom Container` → `Top Container` → `Scrim` →
   sheet, but **not limited to these**: anything that must sit over something else gets its own layer frame. Safe-Area is an
   **instance** (iPhone 62 / 34), never a hand-drawn status bar. New project 402×874; an existing project keeps the size of its designed
   screens. Read the clusters first and never split one.
6. **Two rhythms, one structure.** Draft (options, drafts, clones): same frame structure as locked, only Figma, raw hex, no variables, no components, one line per decision in
   `design/work/notes.md`, quick `audit.js` only. Lock (*"chốt màn …"*): designer's frame, bind variables, components, full Pass 3,
   then the proposed document writes.
7. **Images.** Common UI icons are drawn as vectors right away; illustrations, mascots, logos, photos are empty placeholders until the
   layout is done, then ask once (table with kind, size, content, drawing style, detail level) and fill. 1–2 flat shapes → vector;
   anything layered or detailed → generated image. Every vector drawn lean: anchors only where the shape needs them, never at the
   cost of the drawing (hard rule, `references/team-rules.md` §10.3).
8. **Say it, don't silently comply.** Contradictions between documents → stop and ask; direction decisions are the designer's; only an
   explicit yes is consent. Never report "done" without numbers; always list *where I had to decide myself*.
9. **Names come from `flows.md`.** `[Flow-path]_[State]_[Variant]`, suffixes from the table, no `/` or `.` in frame names; wireframe and UI
   share names 1:1.
10. **Hard rules always apply:** layer opacity only for a disabled composite · nested radius = ½ the inner height (report only) · text
    contrast AA (4.5 / 3) · frames, never groups · every input has a visible label.

## Workflow — a screen job in the team's file
1. Session start: `team-rules.md` §1–7, `design/project.yaml` (re-detect pages with `detect.js`), `design/lessons.md › Active`,
   `design/work/notes.md`. Template screen exists → analyse it (`frame-standards.md` §4).
2. Decide the rhythm: draft / option (`draft-and-option-rhythm.md`) or lock (`lock-phase.md`); decide the mode (New build, From
   template, Sketch, Option, Clone test — `screen-building-lessons.md` §9). Present the plan (3–5 lines while drafting) and wait for a yes.
3. Build with the tool demo's loop plus `screen-building-lessons.md`: clusters read, frame within ~1 minute, layer by layer without
   stopping, placeholders for images, numbers every write, one screenshot per pass.
4. Stop only at the template screen, at the end of a batch, at a direction decision, or after 3 failed fix rounds.
5. Check: draft → quick `audit.js`; lock → full Pass 3 and the team done gate (`screen-building-lessons.md` §8), checklist
   `frame-standards.md` §14.
6. Report per `team-rules.md` §9.

## Team scripts
All `.js` files are Figma Plugin API code for **`execute_code{code, timeoutMs}`**: read the script, set the `CONFIG` block at the top,
send the whole file as `code` (long scans: `timeoutMs` up to ~120000). Scripts that write default to a dry run — show the plan, then run
for real when the designer says *"chạy thật"*. Python tools run locally (`python -I <script> -h`).

| Script | Read / run when |
|---|---|
| `scripts/safearea.js` | the file has no `Safe-Area` set or it misses a target device — `check` (read only), then `apply` with the designer's consent; dry run by default |
| `scripts/clone_measure.py` | clone test: split screens, screen image + 8pt grid, palette, block edges, point / row / column / box measurements, diff image — units in pt, needs Pillow |
| `../ux-review-handoff/scripts/audit.js` | after each screen, at the end of each batch, diagnosing a messy file — read only |
| `../mobile-ui-master/scripts/skeleton.js` | compare a built screen's skeleton with the template / a sibling screen |
| `../design-system-audit/scripts/detect.js` | a new file · `project.yaml` lacks the Figma part · every session to re-detect pages · analysing a template (`TEMPLATE`) |
| `../design-system-audit/scripts/bind.js` | binding a legacy file in bulk — dry run by default |
| `../design-system-audit/scripts/kit-snapshot.js`, `kit-apply.js`, `kit_diff.py` | kit setup: snapshot the kit (read only), apply approved variable changes (dry run), diff two snapshots |
| `../design-system-audit/scripts/system-audit.js` | design-system audit: unused / duplicate variables, broken aliases, scopes, styles, components — read only; fixes dry run |
| `../design-system-audit/scripts/inspect.js` | shape signature of existing components vs the style reference — read only |
| `../design-system-audit/scripts/restyle.js` | refine a main component on the designer's order — dry run by default |
| `../design-system-audit/scripts/impact.js` | before any edit of a main component — read only |
| `../design-system-audit/scripts/componentize.js` | a block repeated identically → component in its own section + instances — dry run by default |
| `../design-system-audit/scripts/kitread.js` | read a whole kit / library file in one call — for maintaining knowledge, not for project work |
| `../figma-project-maintain/scripts/readscreen.js` | screen outline in reading order; learning margins from sibling screens — read only |
| `../figma-project-maintain/scripts/flowmap.js` | flows from layout, button / tab / title text and prototype links; links still pointing at an old copy — read only |
| `../figma-project-maintain/scripts/situations.js` | screen type, main components, state and frame per screen — read only, hints for `flows.md` |
| `../figma-project-maintain/scripts/clone.js` | clone a screen safely into the agent's own section — dry run by default |
| `../figma-project-maintain/scripts/section.js` | the agent's own numbered section next to the related one — dry run by default |
| `../figma-project-maintain/scripts/compare.js` | the designer says they edited — compare `<name>_Fix` with `<name>` — read only |
| `../ux-writing/scripts/textdump.js` | read the copy of existing screens, extract the voice — read only |
| `../figma-prototype-flow/scripts/prototype.js` | click-through flow on copies; `check` reports stale copies — dry run by default |
| `../figma-vector-illustration/scripts/illustration-helpers.js` | drawing / fixing a vector illustration: shading paints, masks, contact shadow, rain, glass drops, grouping, widget build, 4× zoom check — helpers to paste, they write |
| `../figma-vector-illustration/scripts/anchors.js` | any vector (art, icon, logo, background shape): `anchorReport` counts anchors and waste (read only) · `optimizeAnchors` simplifies on a copy within 0.5 px — helpers to paste |
| `../screen-background/scripts/background.js`, `palette.py` | background from a palette (explore, component, instance at the bottom layer); OKLCH ramps and contrast |
| `../prd-to-ux-flow/scripts/docx_extract.py` | extract a `.docx` PRD (merged cells, comments, images, embedded Excel) |
| `../iphone-duo-adaptive/scripts/adaptive.js` | adaptive screen families: missing variants, actions differing between variants, fixed hinge spacer, text too wide — read only |

## Common pitfalls
- Drawing a status bar or home indicator because the ref shows one — it is a Safe-Area instance.
- Splitting a screen by coordinates into Top / Content / Bottom and breaking a visual cluster in two.
- Planning the whole screen for minutes before the first write; or stopping after the grey frame to ask for layout approval.
- Drawing illustrations during the layout pass; crude one-shape vectors; one drawing-style sentence for every generated image.
- Creating components, binding variables, running `stress_test` or writing `flows.md` / decision entries while still drafting.
- Swapping a ref colour for the "nearest token" in a clone; copying the ref's text into a real screen.
- Editing a main component, detaching an instance, renaming the designer's frames, putting work into the designer's section.
- Taking a recommendation on a direction decision instead of asking; reading a sent document as consent.

## Self-check before reporting
- Plan approved; the work sits in the agent's own section; no original screen, designer section or main component changed.
- Names follow `naming.md`; frame follows `frame-standards.md` (lock: root `NONE`, Safe-Area instances, `audit.js` 0 errors).
- Image placeholders asked about or filled; numbers and copy checked for logic; final screenshot at `scale: 1` read.
- Report has numbers, what still differs, *where I had to decide myself*, at most three next steps.
