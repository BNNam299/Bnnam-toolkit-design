# Processes — the three cases for building UI (new · maintain · redesign)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/processes.md @ 3c0e291 — translated, complete

## Contents
0. Identify the case
1. Rules for every case
2. Case `new` — new project
3. Case `maintain` — edit screens, add screens
4. Case `redesign`
5. Dependency graph (read by the status report)
6. Where each stage lives in this skill set

This file says **stage order, outputs and where the designer approves** for each case. How to do each stage lives in the skill
that owns it (§6). ⛔ = designer approval point.

---

## 0. Identify the case

Record it in `design/project.yaml › process.case`: `new` · `maintain` · `redesign` — plus `process.wireframe: false` (default).

| Signal | Case |
|---|---|
| Starting from scratch · no design Figma file yet | `new` |
| A Figma file with screens already exists · *"thêm màn …"* (add a screen), *"chỉnh lại màn …"* (rework a screen), *"làm thêm tính năng …"* (build another feature) | `maintain` |
| *"redesign"*, *"làm lại giao diện"* (redo the UI), *"đổi style toàn app"* (change the whole app's style) — even while in `maintain` | `redesign` |
| **One-off request**: *"dựng màn …"* (build screen …), *"clone màn này"* (clone this screen), *"làm thử một màn"* (try one screen) when there is no document chain yet | `single` |

**`single` does not follow the chain.** Run exactly the job requested. The "needs first" checks on documents (`flows.md`, `style.md`,
`components.md`) **do not block** — whatever is missing is **reported** (*"not through the chain: no … yet"*); screen-building rules,
knowledge and audit still apply in full. A test clone of a screen is always `single`. If the designer later wants it in the project,
pick a case and continue from the first missing stage.

Case not recorded → ask **one** question and write it into `project.yaml`. A `maintain` project may open a `redesign` round for one
part only (record it in `process.scope`).

## 1. Rules for every case

1. **A screen with a new direction → 2–3 quick option sketches** (first screen of a new project · first screen of a redesign · a
   maintenance screen whose layout or components do not exist in the system yet): 2–3 fast sketches that are genuinely different →
   the designer picks 1–2 → develop them properly → **lock the direction**. *(Same count as figma-ui-flow Stage 4 — 2–3
   directions; the source toolkit asked for 5, reduced to save time.)*
2. **Not locked → no components.** Options and drafts are plain frames. New parts too: build the UI normally, develop it, lock one
   option, **then** create components.
3. **Direction locked → generate components**: the list comes from the locked screen + cut-out reference parts + `flows.md` + spec →
   designer approves → build sets with variants and the system's tokens → re-assemble the screen with instances.
4. **Wireframe only when the designer asks** (`process.wireframe: true`, or *"dựng wireframe"*). When used: **after the UX flow,
   before UI** — approve the flow and the screen cases (empty, error, loading, first run…), then move to UI. Not used → the screen
   cases are still listed in full in `flows.md` (the state table of the flow) and get built in UI.
5. **Two sources of cut-out images, two jobs:** `design/competitor-parts/` — **function, layout, block order** ·
   `design/style-parts/` — **visual form**. **Combine:** which blocks, how they are ordered, where the primary action sits → from the
   competitor parts with the matching function; what it looks like → from style (the moodboard in `new` / `redesign`, the existing
   system in `maintain`). **Never borrow a competitor's style.**
6. **Every stage writes an output with a status block** (`status`, `approved`, `from`, `based_on` at the top of the file); the
   designer approves at the ⛔ points below; a later stage reads the approved output of the earlier one.
7. **Draft / lock rhythm and documents:** drafts go into `design/work/notes.md`; only a lock writes `flows.md`, a decision-log entry
   (DEC), `components.md`.
8. **Base kit** — `new` / `redesign` projects duplicate the designer's base kit (atoms + variables): review it and snapshot it on
   entry (read only) · **tune it after the first screen's direction is locked**, never guessed from the moodboard · draft → approve →
   only then edit the originals.

## 2. Case `new` — new project

| # | Stage | Output | Approve |
|---|---|---|---|
| 1 | Read the PRD | `prd.md` (scope, functional requirements FR, use cases UC, open gaps) | ⛔ |
| 2 | Competitor analysis — images in `sources/competitors/`: pick screens that **fit the FR / UC**, cut parts by function | `analysis.md` · `competitor-parts/` + `index.md` | ⛔ |
| 3 | Style read — moodboard in `sources/style/`: tokens, signature, cut-out images, *proposed components* (not built yet) | `style.md` · `style-parts/` + `index.md` | ⛔ *approve style* |
| 3b | Base kit §1 — the duplicated base kit: review + snapshot, **read only** | `kit.md` · `kit/kit-goc.json` (base-kit snapshot) | locked |
| 4 | UX flow · voice (in parallel) | `flows.md` (flows, screen list, screen cases) · `voice.md` | ⛔ |
| 5 | Wireframe — **only when asked** | grey frames for the flows | ⛔ |
| 6 | UI build — **first screen: 2–3 options** (ask first: build with the kit or a fresh draft) → pick 1–2 → develop | template screen in Figma | ⛔ *lock direction* |
| 6b | Base kit §2–§4 — tune variables to the locked screen + moodboard · atoms that deviate / are missing: draft next to the original → approve → edit the original | `kit.md` · `kit/ledger.json` · kit in Figma | ⛔ per group |
| 7 | Component spec — generate **every** component the app needs → build → re-assemble the template screen | `components.md` · components in Figma | ⛔ |
| 8 | UI build by **screen group** (flows in `flows.md`) — draft → refine → lock each group · a new block with a different role → draft, lock an option, only then add a component | screens in Figma · `flows.md › ui:` | ⛔ each group |
| 9 | UX review once everything is covered · handoff optional · base kit §5 — propose pushing changes back to the base kit | `review.md` · `kit/chenh-lech.md` (kit differences) | ⛔ |

## 3. Case `maintain` — edit screens, add screens

**Stick to the existing system — mandatory:** the file's variables, text / effect styles, components, template screen and safe area —
and the PRD / spec for whatever changes.

| # | Stage | Output | Approve |
|---|---|---|---|
| 1 | Project overview (`references/maintain.md` §A) — once, or scoped to one feature: flows, voice, system (`../design-system-audit/scripts/detect.js`, `inspect.js`) | `project.yaml` · `flows.md` `from: maintain` · `voice.md` | ⛔ |
| 2 | Read the PRD — only the changed part | `prd.md` (new section) | ⛔ |
| 3 | References (if the designer gives any): competitor → cut by function · style reference screen → **mode 2**: cut parts, write the signature **in the system's tokens and components**, not in the reference's style | `competitor-parts/` · `style-parts/` | — |
| 4 | UX flow — add screens and screen cases to `flows.md` (`source: added <date>`) | `flows.md` | ⛔ |
| 5 | Wireframe — only when asked | | ⛔ |
| 6 | Edits (`references/maintain.md` §B) → UI build: an edit → a `_Fix AI` copy · a new screen built with the existing system · new layout / parts → **2–3 options** (§1.1) | screens in Figma | ⛔ lock option |
| 7 | New parts that were locked → component spec **mode 2** (follow the existing system, same family, same variables) → re-assemble | `components.md` | ⛔ |
| 8 | UX review of the changed part | `review.md` | ⛔ |

## 4. Case `redesign`

Like `new`, plus a comparison with the old system — **reshape the style** from a moodboard, generate new components, but keep what the
product needs to keep.

| # | Stage | Output | Approve |
|---|---|---|---|
| 1 | Project overview (`references/maintain.md` §A) — flows, voice and screen names of the running app · audit the old system | `flows.md` · `voice.md` · system audit | ⛔ |
| 2 | Read the PRD — the redesign spec | `prd.md` | ⛔ |
| 3 | Style read **mode 1** with the new moodboard + compare with the old system: each token / component family → **keep · replace · drop**, record a DEC | `style.md` · `style-parts/` | ⛔ *approve style* |
| 4 | Competitor cut by function, if there are competitor images | `competitor-parts/` | ⛔ |
| 5 | UX flow — keep existing screen names (`flows.md` records screens changed / added / dropped) · voice keeps the voice unless the spec changes it | `flows.md` | ⛔ |
| 6–9 | As `new` 5–9 — first screen 2–3 options, lock direction, base kit (a new kit for the new style, or the duplicated base kit), generate new components, screen groups, review | | ⛔ |

Variables and components of the old system that get replaced → **do not delete them, do not edit the originals** without an
explicit instruction: new components go into a new set, screens switch over group by group as they are locked; the *replace / drop*
list waits for the designer to order the clean-up.

## 5. Dependency graph (read by the status report, per `process.case`)

```text
new       prd ⛔ → competitors ⛔ ─┬→ ux-flow ⛔ ─┬→ [wireframe ⛔] → first screen (2–3 options) ⛔ → base kit ⛔ → components ⛔ → screen groups ⛔ → ux-review ⛔
                                  ├→ voice ⛔ ───┘
                    style-read ⛔ ┘   (base kit §1 review — read only — right after duplicating)
maintain  overview ⛔ → prd (new part) ⛔ → [refs: competitor cut · style mode 2] → ux-flow ⛔ → [wireframe ⛔] →
          ui-build (options when the layout is new) ⛔ → [components mode 2 ⛔] → ux-review ⛔
redesign  overview ⛔ → prd ⛔ → style-read mode 1 + old-system comparison ⛔ → [competitor cut ⛔] → ux-flow ⛔ → as new from wireframe
```

A stage you *can do next* = a stage not finished whose every prerequisite (for this case) is `approved`. `[ ]` = optional.

## 6. Where each stage lives in this skill set

| Stage | Skill |
|---|---|
| Read the PRD, competitor analysis, UX flow, `flows.md` format | `../prd-to-ux-flow/SKILL.md` |
| Voice, UX writing | `../ux-writing/SKILL.md` |
| Style read, base kit, system audit, component spec | `../design-system-audit/SKILL.md` |
| Wireframe, UI build — the three-pass build loop | `../figma-ui-flow/references/build-loop.md` |
| Screen frame, naming, team rules | `../bnnam-standards/SKILL.md` |
| Click-through prototype | `../figma-prototype-flow/SKILL.md` |
| UX review, handoff | `../ux-review-handoff/SKILL.md` |
| Overview, edits on a running project (`maintain.md`), status (`design-status.md`), learning from designer edits (`learn.md`) | this skill |
