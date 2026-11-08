# Design status — where are we, what next

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/design-status.md @ 3c0e291 — translated, complete (toolkit install / version checks dropped)

## Contents
1. When to use · what it reads
2. Step 1 — No `design/` yet, or no PRD
3. Step 2 — Read the status blocks
4. Step 3 — Count wireframe and UI progress
5. Step 4 — Check the dependency graph
6. Step 5 — Drift warnings (`based_on`)
7. Step 6 — Designer edits and lessons
8. Report

**The skill set remembers for the user.** This job stands **outside** the chain — call it at any time, it depends on no stage.
**Read and suggest only.** It runs no other job and edits no file. The user chooses.

---

## 1. When to use · what it reads

- The user asks *"đang tới đâu"* (where are we), *"giờ làm gì tiếp"* (what next), *"có thể làm gì"* (what can I do), *"help"*.
- **Opening a new session** on a project that already has `design/`.

**Not for** doing any stage. Writes nothing — not even a progress note; writing belongs to the job that does the work.

| Reads | Writes |
|---|---|
| the status block of **every** `design/*.md` file · `design/project.yaml` · `design/sources/` · the `ui:` field of each flow in `flows.md` · `design/lessons.md` · `design/toolkit-queue.md` · `design/work/notes.md › Open questions` · the project's progress note, if it keeps one · frame names on the wireframe and UI pages (read only) | **nothing** |

Needs nothing first — no file has to be approved.

## 2. Step 1 — No `design/` yet, or `product/sources/prd/` is empty

**First check the setup:** the Figma tool is connected (`figma_status`) and the project has a `design/sources/` folder. Something
missing → say what is missing and how to add it; come back here when it is in place.

**Then tell the two cases apart** — ask one question if it is unclear:

- **Running project** — the Figma file already has screens (`../design-system-audit/scripts/detect.js` finds screens on the UI page), or
  the designer says it is maintenance → suggest *"nắm tổng quan dự án này"* (get the overview of this project — `maintain.md` §6). Do not
  make them rerun the chain from the PRD.
- **New project** → suggest the first step — *"thả PRD vào `product/sources/prd/` để bắt đầu"* (drop the PRD into
  `product/sources/prd/` to start) — and explain **once**, briefly, the whole chain for the case (`processes.md` §2). The chain below is
  the short version; wireframe only when the designer asks, first screen 2–3 options, components after the direction is locked:

```text
read PRD → competitor analysis (cut parts) → flows + voice → [wireframe] ─┐
               style read (moodboard, cut parts) ─────────────────────────┴→ first screen 2–3 options → lock direction →
               components → build UI by screen group → review → (dev notes)
```

Say it in the words the user would use at each step (*"đọc PRD"* — read the PRD, *"phân tích đối thủ"* — analyse competitors…), not
in skill or job names.

## 3. Step 2 — Read the status blocks

Every `design/*.md` file has a status block at the top (`../bnnam-standards/references/team-rules.md` §8.4): between the first two
`---` lines, one `key: value` per line, ignore everything after `#`. `project.yaml` has the same keys at top level. No status block →
report the file as missing its block, treat it as `draft`. The shared decision log has no approval gate — only count its `[design]`
entries.

| File | Stage |
|---|---|
| `prd.md` | read the PRD |
| `analysis.md` | competitor analysis |
| `flows.md` | UX flow — plus `wireframe_approved`, `ui_approved`, the `ui:` field of each flow |
| `voice.md` | voice |
| `style.md` | style read |
| `components.md` | component spec |
| `review.md` | UX review |

## 4. Step 3 — Count wireframe and UI progress

**Maintained project** (`flows.md` has `from: maintain`): count screens by the per-screen `approved` field, not by whole-file flags.
`flows.md` grouped by `## Feature — <name>` → report progress per feature. A click-through flow copy is open → run
`../figma-prototype-flow/scripts/prototype.js` in `check` mode and report stale copies.

Do not count `<screen name>_Fix`, `_Fix AI`, `_Variant` drafts or the template screen (`project.yaml › screen.template`) — they are not
project screens.

Compare **screen names** in `flows.md` (every `### ` heading under `## Screens`) with **frame names** on the `pages.wireframe` and
`pages.ui` pages — a 1:1 mapping (`../bnnam-standards/references/naming.md`). Get frame names from `detect.js` (its `screens` field,
read only). No separate file needed.

- name in `flows.md` but no frame → *missing*
- frame on the UI page but not on the wireframe page → *built directly, layout not approved* (only when the project uses wireframes)
- frame not in `flows.md` → *screen outside the list* (scope gate)

Figma not reachable right now → report progress from the project's progress note and say clearly **not checked against Figma**.

## 5. Step 4 — Check the dependency graph

The graph **per case** — `processes.md` §5 (`project.yaml › process`: `new` · `maintain` · `redesign`). Below is case `new` with
wireframes (`process.wireframe: true`):

```text
prd-read → analyze ─┬→ ux-flow ─────┬→ wireframe ──⛔──┐
                    └→ voice ──⛔───┘                  ├──→ ui-build first screen (2–3 options) ──⛔──→ component-spec ──⛔──→ ui-build → ux-review → handoff
                       style-read ──────────────────⛔──┘
```

- The style read runs **in parallel** with the wireframe · no wireframes → the first-screen UI build follows the UX flow + style read
  directly.
- The component spec needs an approved `style.md` + a template screen with a **locked direction** (+ wireframes when they are used).
- UI is built in batches — the next batch only after the previous one is accepted.
- UX review when **every** batch is accepted · handoff optional.

A stage you *can do next* = a stage not finished whose every prerequisite is `approved`.

## 6. Step 5 — Drift warnings (`based_on`)

For each `approved` file, read every source in `based_on` (form `<file>@<date>`, several sources separated by ` · `):

- the source is a `design/` file → drift if the source's current `approved` date **differs** from the date in `based_on`, or the source
  is in `draft`
- the source is a file in `sources/` (no status block) → drift if it changed after the recorded date: the last git commit date if there
  is a repo, otherwise the file's modified date

```text
  ⚠ prd.md changed on 15/09 — after flows.md was approved.
    flows.md may be out of date.
```

The progress note says something different from Figma → trust Figma for content, trust the status blocks for approval — report the gap.

## 7. Step 6 — Designer edits and lessons

- Count entries in `lessons.md › Active` and in `toolkit-queue.md` (status *waiting for next version*) — report in one line.
- `design/work/notes.md › Open questions` still has unanswered *why* questions → put them in the suggestions.
- A **`<screen name>_Fix AI`** copy → the agent edited it and it **waits for the designer to compare and lock** — suggest
  *"chốt màn …"* (lock screen …).
- **`_Variant A/B`** screens → brainstorm drafts not chosen yet — suggest choosing an option; they are not screens outside the list.
- Frame names (step 3) include **`<screen name>_Fix`** (`project.yaml › collab.editSuffix`) → the designer is editing that screen and
  it has not been through `learn.md` → suggest *"xem tôi sửa gì"* (see what I changed) **before** any new work. No extra script — the
  names from step 3 are enough.

```text
  ✎ 3 screens in the Onboarding batch were edited after they were built — not reviewed yet
  · lessons: 4 active · 1 in the team-standard queue
```

## 8. Report

Its own format — no *Changed / Skipped* because this job changes nothing:

```text
Project: Calories AI

  ✓ prd-read        prd.md          approved 12/09
  ✓ analyze         analysis.md     approved 12/09
  ✓ ux-flow         flows.md        approved 13/09
  ✓ voice           voice.md        approved 13/09
  ◐ wireframe       18/24 screens   not approved
  ✓ style-read      style.md        approved 14/09
  · component-spec  not run         waiting for wireframe
  · ui-build        not run         batch 0/4
  · ux-review       not run         waiting for all UI

  ⚠ prd.md changed on 15/09 — after flows.md was approved.
    flows.md may be out of date.

In progress: Tracking-Calendar_Empty — no UX writing yet

You can:
  → "làm nốt wireframe"            (finish the wireframes) — 6 screens missing
  → "duyệt wireframe"              (approve the wireframes) — unlocks the component spec
  → "kiểm lại flows theo PRD mới"  (re-check flows against the new PRD)
```

Symbols: `✓` approved · `◐` in progress / draft · `·` not run · `⚠` drift · `✎` designer edited, not reviewed.

At most **three** suggestions, ordered by priority, each a **sentence the user can say verbatim**. Drift warnings, designer edits not yet
reviewed, and unfinished work come before new work.

**Self-check:** at most three suggestions, each sayable verbatim · no file written. **Knowledge to load:** none.
