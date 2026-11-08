# Learn from designer edits — compare, ask why, record the lesson

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/learn.md @ 3c0e291 — translated, complete (the shared loop rules are in `../bnnam-standards/references/team-rules.md` §12.5–12.6)

## Contents
1. When to use
2. Needs first · reads · writes
3. Step 1 — Compare: see what the designer changed
4. Step 2 — Understand before asking
5. Step 3 — Ask why: by group, at most three per turn
6. Step 4 — Record: each thing in exactly one place
7. Step 5 — Fix other places with the same mistake
8. Step 6 — Lock: the designer deletes the old copy
9. Step 7 — Raising the team standard
10. Stop-and-ask · self-check · report · knowledge

Every place the designer edits is a place where the agent got something wrong, left something out, or did not know what the
designer knows. This job turns each edit into a **lesson** so the mistake does not happen again — and fixes the other places with
the same mistake. **The designer's edit wins:** never judge it.

---

## 1. When to use

- The designer says *"tôi vừa sửa màn …"* (I just edited screen …), *"tôi đã chỉnh lại …"* (I adjusted …), *"xem tôi sửa gì"* (see
  what I changed), *"học từ chỗ tôi sửa"* (learn from my edits).
- Another job is about to touch a screen again and finds a **`<screen name>_Fix`** copy — the designer is editing it. Run this job
  first; do not build, bind or audit that screen until it is done.
- The designer edited a `design/` file by hand (`flows.md`, `voice.md`…) and wants the agent to understand why.

**Not for** building or editing screens — that is the build loop (`../figma-ui-flow/SKILL.md`) or the maintenance edits
(`maintain.md` §8–9). A **`_Fix AI`** copy belongs to the agent: when the designer tweaks it further, just ask why (step 3) — do not run
`compare.js` on it.

## 2. Needs first · reads · writes

| Check | If missing |
|---|---|
| a **`<screen name>_Fix`** copy sits next to the original | the designer edited the original directly → nothing to compare: ask what was changed. Remind them of the `_Fix` method for next time |
| the designer edited a **main component** (no `_Fix` copy) | read that component, ask why as for a screen · check the screens that use it (`../bnnam-standards/references/team-rules.md` §12.4) |
| `project.yaml › pages` | run `../design-system-audit/scripts/detect.js` |

| Reads | Writes |
|---|---|
| `design/lessons.md` · `flows.md` · `voice.md` · `style.md` · `components.md` · the decision log `[design]` · screens in Figma (read only) | `lessons.md` (`assets/lessons.template.md`) · the file that owns the changed data (`flows.md` · `voice.md` · `style.md` · `components.md`) · the decision log `[design]` · `toolkit-queue.md` · `design/work/notes.md` (*Open questions*, *One-off taste*) |

Before comparing, **read the original and the edited copy** the way `../mobile-ui-master/references/reading-screens.md` says —
understand what the screen is for, then you can ask the right *why*.

## 3. Step 1 — Compare: see what the designer changed

The designer duplicated the screen, renamed the copy `<screen name>_Fix` (`project.yaml › collab.editSuffix`) and edited it. Run
`scripts/compare.js` through `execute_code` (set `PAGE`, optionally `SCREEN_NAMES`): it pairs `<name>` with `<name>_Fix` **by name, not
by position**. The designer named them differently → fill `PAIRS` with `{ original, edited }` ids. Results are grouped by:

position · size · layout · spacing · corner radius · colour · stroke · opacity · hidden / shown · copy · text style · component ·
layer type · added · removed

- The designer named no screen → compare **every `_Fix` copy** on the page (leave `SCREEN_NAMES` empty).
- A `_Fix` copy whose original is gone (deleted, renamed) → the script reports it; ask the designer.
- Layers are matched by **name path** (plus order among same-named siblings). A layer the designer **renamed** shows up as *removed* +
  *added*: read both before asking.
- The inside of an instance is not compared layer by layer (it belongs to the component) — only the instance's own properties and its
  main component name.
- Edits in `design/` files instead of Figma → compare with `git diff` if the project uses git; otherwise ask the designer what changed.

The result also returns `editedIds` per pair — keep them for step 6.

## 4. Step 2 — Understand before asking

For each change group, answer three questions yourself first — so the question you ask is specific, never generic:

- **Which agent rule did the edit contradict?** `lessons.md › Active`, `voice.md`, `style.md`, the team standard? Or did the agent
  follow the rule correctly and the rule is not enough?
- **Where does it repeat?** The same edit on several screens (card padding on 4 screens) is one group, not four.
- **Is it a consequence of another edit?** Longer copy pulled the height with it — merge them, ask only about the root.

An edit that is an **addition** (new screen, new state, new layer) → the question is *"should this go into `flows.md` /
`components.md`?"*, not *"why?"*.

## 5. Step 3 — Ask why: by group, at most three per turn

Each question names **exactly what changed, where, and in how many places**, with suggested answers so the designer replies fast:

```text
I see 3 groups of changes in the Onboarding batch:

1. Card side padding 16 → 20, on 4 screens. Why?
   a) this app's own standard — apply to every card   b) only these screens   c) my rule was wrong   d) other reason: …
2. "Bữa hôm nay" (Today's meal) → "Hôm nay bạn ăn gì" (What did you eat today) on Home_Result. Should voice.md change too?
3. Removed the "— fold" line on Home_Result — does the screen no longer scroll, or was only the line removed?
```

- Put groups **likely to repeat** first — that is where a lesson is worth most.
- More than three groups → ask three, park the rest in `design/work/notes.md › Open questions` for the next turn.
- **Never guess for the designer.** A question the designer skips → record *"reason unclear"*, derive no rule from it.
- The designer says *"đừng hỏi loại này nữa"* (don't ask about this kind again) → record that as a lesson
  (*"position tweaks under 4px: don't ask"*).

## 6. Step 4 — Record: each thing in exactly one place

| The answer | Do |
|---|---|
| **only this screen / one-off taste** | write `design/work/notes.md › One-off taste` (to count repeats). Not a lesson |
| **project data changed** (colour, copy, term, state, component) | edit the **owning file** — `style.md`, `voice.md`, `flows.md`, `components.md`; deviates from the documents → add a DEC. Write a lesson **only if** the agent must do something differently next time |
| **a build rule of this project** | add an entry to `lessons.md › Active` (`assets/lessons.template.md`) |
| **a team-standard rule is wrong or missing** | add an *Active* entry (applies to the project now) **and** an entry in `design/toolkit-queue.md` pointing at the exact skill reference to change |

**A lesson must be a testable rule** — *"content card: side padding = token `spacing/20`"*, not *"cards need more air"*. Cannot be written
testably → ask one more question, or record *"no rule derived yet"*. A lesson that adds a gate (*"without X you may not do Y"*) changes
the process → confirm with the designer before recording.

Editing an already **approved** `design/` file because of the designer's answer → it goes back to `draft`; show before → after, check
together, the designer locks it again (`../bnnam-standards/references/team-rules.md` §8.4).

## 7. Step 5 — Fix other places with the same mistake

A new *Active* lesson → find every **already built** screen with the same mistake (`../ux-review-handoff/scripts/audit.js`, the tool
demo's `audit_design`, or read the screens). Report the list; **the designer chooses**: fix all · fix some · leave as is. Fixing goes
through the normal path of the stage that owns it (the build loop for UI, the wireframe stage for wireframes).

## 8. Step 6 — Lock: the designer deletes the old copy

After steps 4–5, tell the designer: *"recorded — delete the old copy and drop the `Fix` suffix when you lock"*. **The designer** deletes
the original and drops the suffix — the edited copy becomes the official screen, with the same name as in `flows.md`. The agent does not
delete: deleting cannot be undone, and which copy survives is the designer's decision.

Layers the designer edited but has not merged into the system (e.g. a raw colour kept on purpose) → put those ids (`editedIds` from
step 1) into `DESIGNER_EDITED_IDS` when running `../design-system-audit/scripts/bind.js`, so bulk binding leaves them alone.

## 9. Step 7 — Raising the team standard

A running project **never changes** the skill files (`../bnnam-standards/references/team-rules.md` §3). `design/toolkit-queue.md`
is the queue for the next version of the team standard:

- The same proposal in ≥ 2 projects, or repeated ≥ 2 times in one project → high priority.
- When a new version of the standard is made: collect the `toolkit-queue.md` of every project → brainstorm → change the skills.
- A lesson that is only **reference knowledge** (not a rule) may be added to the matching knowledge reference right away by whoever
  maintains the skills, with the date noted.

## 10. Stop-and-ask · self-check · report · knowledge

**Stop and ask:** ask why by group, at most three questions (step 3) · fixing other places — the designer chooses (step 5) · the
designer locks and deletes the old copy (step 6).

**Self-check:** every lesson is a testable rule (step 4) · no rule derived from an unanswered question (step 3).

**Report:** the usual report (numbers, at most three next steps) plus: screens compared · change groups · new lessons (*Active* /
queue for the standard) · other screens with the same mistake.

```text
Compared:       6 screen pairs · 9 change groups
New lessons:    2 active · 1 into the team-standard queue
Same mistake:   5 other screens have card padding 16

Next steps
  → delete the 6 old copies, drop the Fix suffix      when you lock
  → "sửa hết 5 màn" (fix all 5 screens)               apply lesson L-004 to built screens
  → answer the 2 remaining questions                  parked in work/notes.md › Open questions
  → "dựng lô Add" (build the Add batch)               the next batch applies the lessons from the start
```

**Knowledge to load:** `../ux-review-handoff/references/heuristics-evaluation.md` · the knowledge of the stage that owns the edited
part (see `processes.md` §6).
