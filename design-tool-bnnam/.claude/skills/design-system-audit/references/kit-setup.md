# Job — check and refine the base kit for a project

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/kit-setup.md @ 3c0e291 — translated, complete

Designer rule: every new project duplicates the **base kit** (atom components + variables) into its file. The kit's variable values are
not stable yet → on entering a project the kit must be **re-checked, its variables refined and atoms added** to fit. Main components are
**never edited before approval** — always draft first; edit the main component only once the designer says OK. The kit is refined
**after the first screen's direction is locked**, never guessed from the moodboard.

## Contents
1. When to use
2. Inputs and outputs
3. Scale of the job
4. §1 On entry — audit and snapshot (read only)
5. §2 Scope — before proposing
6. §3 Refine variables — propose → approve → write
7. §4 Atoms — draft next to the main component → approve → edit the main component
8. §5 End of project — bring changes back to the base kit
9. Stop points, self-check, report

---

## 1. When to use

- **On entering a project** (case `new`, `redesign`): the base kit was just duplicated into the file — **§1, read only**.
- **After the designer locks the first screen's direction** — **§3–§4**: refine variables, adjust / add atoms.
- **End of the project** — **§5**: propose changes to bring back to the base kit.
- *"prepare the kit"*, *"refine the variables for this project"*, *"add atom components"*, *"what does the base kit need"* (*"chuẩn bị
  kit"*, *"tinh chỉnh variables cho dự án"*, *"thêm component nguyên tử"*, *"kit gốc cần sửa gì"*).

**Not for** case `maintain` (the app's existing system is the standard — `../figma-project-maintain/references/processes.md` §3) unless
the designer asks · not for auditing the system in general (`system-audit.md`) or generating the screens' components
(`component-spec.md`).

## 2. Inputs and outputs

| Check | If missing |
|---|---|
| the base kit is duplicated into the project file (variable collections + component page) | ask the designer |
| §3–§4: the first screen's **direction is locked** (`design/work/notes.md` › *locked direction*) | go back to the UI build's option rhythm (`../figma-project-maintain/references/processes.md` §1 rule 1) |
| §3: `style.md` `approved` (moodboard read) | run `style-read.md` |

| Reads | Writes |
|---|---|
| the file's variables, styles, components · `style.md` · `style-parts/index.md` · `competitor-parts/index.md` · locked screens · `design/work/notes.md` · `tokens.md` §2 · `atomic-design.md` | `design/kit.md` (`../assets/kit.template.md`) · `design/kit/kit-goc.json`, `design/kit/kit-du-an.json` (snapshots: base kit, project kit) · `design/kit/ledger.json` (edit ledger) · `design/kit/chenh-lech.md` (diff) · the decision log `[design]` · in Figma: **only** approved items |

Source: the kit in the file + the moodboard already read (`style.md`). The designer's design-system documentation (if any in
`design/sources/`) is read for naming conventions and locked areas before proposing.

Terms: base kit · snapshot · ramp · step · OKLCH · scope · primitive / alias / mapped · atom · atom draft · ledger · locked · diff.

## 3. Scale of the job

| Level | What |
|---|---|
| **Light** | §1 audit + snapshot · §3 only the main color group and radius |
| **Standard** | + every variable group (color, spacing, radius, type) · §4 off-style atoms |
| **Full** | + missing atoms · §5 propose bringing changes back to the base kit |

★ **Mandatory floor:** no edit to main components before approval · a dry run before every write · ledger before → after — even at Light.

## 4. §1 On entry — audit and snapshot (read only)

1. Run `scripts/system-audit.js` (`PAGES: null`) → learn what the kit has, lacks, and where it is inconsistent (`system-audit.md`).
2. Run `scripts/kit-snapshot.js` → save its result as `design/kit/kit-goc.json` — the baseline to compare against later.
3. Write `design/kit.md` (`../assets/kit.template.md`): which base kit version / date duplicated · audit summary · **Locked** — variables
   and atoms the designer doesn't want the agent to touch (one question; default: Safe-Area, foundation black / white).
4. **Change nothing.** The first screen will be built as 2–3 options — before that the agent asks *"build with the kit, or a fresh
   draft?"* (`../figma-project-maintain/references/processes.md` §2 step 6).

## 5. §2 Scope — before proposing

After the direction is locked, state **which groups** (color · spacing · radius · type · off-style atoms · missing atoms) and **when it's
done** (e.g. *"primary color, states and backgrounds from the locked screen; spacing unchanged"*) — so one color tweak doesn't balloon
into rebuilding the whole kit (that is Figma's `figma-generate-library` job). The designer strikes / adds groups.

## 6. §3 Refine variables — propose → approve → write

1. **Values with evidence** — measured from the locked screen (`../bnnam-standards/scripts/clone_measure.py` on the screen image) +
   the moodboard (`style.md`); if the option screens were built as drafts (way *b*), the draft values are the proposal.
2. **Generate scales per `tokens.md` §2:** color → `../screen-background/scripts/palette.py ramp <source color> --steps <kit steps>` (keep
   the kit's exact step set; sibling ramps with `palette.py match`), dark mode by mirrored steps (`palette.py dark`); spacing, radius, type
   per §2.5–2.7 — **the designer's rules win** (letter spacing 2.5 %, adjacent radius — `../mobile-ui-master/references/layout-spacing.md`).
3. **Proposal table per group:** `variable · mode · before → after · reason` + a **NEEDS REVIEW** flag for: contrast pairs that slip
   (`palette.py contrast`), atoms / screens that change with it, steps removed while aliases still point at them. Self-critique once:
   *"does this table make the app look like every other app in the category?"* — if so, say so (two-pass bootstrap).
4. **Preview:** a separate section *"Kit — preview"* — per group two rows of swatches **before / after**, in both Light and Dark (frames
   with raw fills, not bound — the kit is not touched), with the locked screen captured next to them for comparison.
5. The designer approves group by group (striking unwanted rows) → run `scripts/kit-apply.js` with `DRY_RUN: true` and exactly the
   approved rows, `LOCKED` taken from `kit.md` → report → the designer says *"run it for real"* → `DRY_RUN: false` → save the returned
   **ledger** into `design/kit/ledger.json` (before → after, ids — reversible) → log a decision.

## 7. §4 Atoms — draft next to the main component → approve → edit the main component

**Dependency order:** foundations (variables) → atoms → molecules (`atomic-design.md` §5.1). Never edit a molecule before the atoms it
contains.

1. **Off-style atoms** (shape: radius, border, shadow, padding — `style-read.md` §9): create a **draft** in the section *"Kit — draft"*:
   an instance of the atom → detach → a frame named `Kit draft / <name>` placed **next to** a recaptured copy of the original · edit the
   draft · record draft id ↔ main id in `ledger.json` (`drafts`). **Check before creating** — if a draft with that name exists, edit it;
   don't create another.
2. **Missing atoms** (from `style-parts/`, `competitor-parts/`, `flows.md` — `atomic-design.md` §4): build a **draft frame** following the
   kit's conventions (name, properties, variants — `../bnnam-standards/references/naming.md`), in the same section.
3. `scripts/impact.js` for every atom to be edited: instance count, screens, other components containing it → report with the draft.
4. The designer approves → **edit the main component**: off-style → `scripts/restyle.js` (dry run → *"run it for real"*) · missing →
   `scripts/componentize.js` turns the draft into a new component on the kit's component page (a set with variants when there are several
   states, bound to semantic variables, with a description) · log a decision.
5. **Clean up drafts only by the ids in `ledger.json`** — never by name or prefix.
6. Re-run `system-audit.js`: fixed groups back to 0, no new errors · the screen audit (`../ux-review-handoff/scripts/audit.js`) on the
   locked screen.

Then the component spec generates components for the whole app (`component-spec.md`;
`../figma-project-maintain/references/processes.md` §2 step 7) → rebuild the first screen with instances; draft values still on the
options → `scripts/bind.js` binds them to variables.

## 8. §5 End of project — bring changes back to the base kit

`scripts/kit-snapshot.js` → `design/kit/kit-du-an.json` → `python scripts/kit_diff.py design/kit/kit-goc.json design/kit/kit-du-an.json
--out design/kit/chenh-lech.md` — added / removed / changed for every variable, style and component + **NEEDS REVIEW** flags. The agent
marks rows **worth bringing back to the base kit** (reusable for the next project: missing color steps, new atoms, system fixes) and
**project-only** rows (brand color, special type sizes). The designer decides; updating the base kit is the designer's job, or the
agent's when the designer gives an explicit order on the base kit file.

## 9. Stop points, self-check, report

**Stop and ask:** §1 locked areas · §2 scope · §3 approval per variable group, *"run it for real"* · §4 approval of each atom draft,
*"run it for real"* for restyle · §5 which rows go back to the base kit.

**Self-check:**
- nothing written to main components without approval + a dry run · every write has a before → after ledger in `ledger.json` · locked
  areas untouched
- drafts deleted by id · `system-audit.js` re-run after fixing · token-pair contrast passes in every mode · `kit.md` updated

**Report** (team format — `../bnnam-standards/references/team-rules.md` §9), plus: groups done · variables changed / created · atoms
adjusted / added · contrast pairs before → after · items still awaiting approval · paths of the snapshots and the diff.

```
Next step
  → "approve the color group"
  → "run it for real"
  → "generate components for the whole app"
```

Knowledge: `tokens.md` §1, **§2** (generating scales) · `atomic-design.md` (§4 kit, §5 assembly, §8 governance) ·
`../mobile-ui-master/references/layout-spacing.md` (designer rules) · `system-binding.md`.
