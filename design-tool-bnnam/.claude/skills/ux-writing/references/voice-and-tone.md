# Defining the project voice — the voice & tone job

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/voice.md @ 3c0e291 — translated, complete

`principles.md` holds the rules for **every** project. The project voice file `design/voice.md` is how they apply to **this project** —
and it is the **single source of truth for the project's words**. Good UX writing sets the vibe and voice of all content in the app.
Background knowledge for this job: `handbook-patterns.md` §3 (voice chart, four tone dimensions, tone by situation).

## Contents
1. When to run this job
2. Inputs
3. Steps
4. Where the voice file is used
5. Stop points and self-check
6. Report

---

## 1. When to run this job

- After the PRD and the competitor analysis, **before wireframes** — wireframes are written with real copy; without a voice file every
  screen ends up with its own voice.
- The user talks about voice, tone of voice, forms of address, words to avoid.
- Adding or changing terminology — *"should it be Delete or Remove"*.
- **Maintenance project** (an existing file): extract the current voice from the screens first with `../scripts/textdump.js` (§3.0).

**Do not use it** to write copy for individual screens (that is wireframe work — `principles.md` §11 and
`../figma-ui-flow/references/build-loop.md`) or to review copy already built (`../ux-review-handoff/SKILL.md`).

Role: designer.

## 2. Inputs

| Check | If missing |
|---|---|
| `design/prd.md` approved | read the PRD first (`../prd-to-ux-flow/SKILL.md`) |
| `design/analysis.md` (competitor analysis) approved | run the analysis first — the measured competitor text rhythm and competitor voice are needed |
| `design/style.md` (visual style) — **read if present** | does not block; say in the report that the visual vibe has not been cross-checked |

| Read | Write |
|---|---|
| `prd.md` · `analysis.md` · `style.md` (if present) · brand guidelines the user provides | `design/voice.md` (`status: draft`), from `../assets/voice.template.md` |

---

## 3. Steps

### 3.0 Maintenance project — read the current voice first

Run `../scripts/textdump.js` through `execute_code` (set `CONFIG` at the top: `PAGES`, the `ROLES` regexes matching the file's naming;
pass `timeoutMs` up to ~120000 on big files). It returns statistics per text role (count, average words, longest, capitalization,
ending punctuation), forms of address, emoji count, and up to `SAMPLES_PER_ROLE` sample strings per role. Read the **samples** to infer
the voice — the statistics are only hints. Where the project contradicts itself (two names for one action, two capitalization styles),
record it in `voice.md › Inconsistencies` and ask the designer to choose: **new** copy follows the choice, old screens are left alone.

### 3.1 Where to take things from

| Source | Take |
|---|---|
| `prd.md` | product positioning · audience · what the product does **not** do (so nothing false is promised) |
| `analysis.md` | the measured **competitor text rhythm** · competitor voice — to be **different**, not to copy |
| `style.md` | the **visual vibe** — the voice must match it: playful visuals with stiff, dry copy is a mismatch |
| user | brand guidelines, if any |

**Do not invent a brand voice.** With no direction → propose **two or three voice directions**, each with sample sentences for the
same few situations (onboarding, error, paywall), and let the user choose.

**An adjective on its own is too vague** — *thân thiện* *(friendly)*, *hiện đại* *(modern)*, *trẻ trung* *(youthful)* need do/don't
examples and rules by severity. That is why a **voice chart** is used instead of a list of adjectives.

### 3.2 Write `voice.md`

Template: `../assets/voice.template.md`. Sections:

- **Product voice — fixed:** a voice chart of 3–4 attributes, each with *we are… · we are not… · shown by…* · position on the four NN/g
  tone dimensions · form of address (**does not change per screen**).
- **Tone by situation — varies:** one sample sentence per situation. Errors: no jokes, no blame. Lost data / money: no emoji, no showy
  brand voice. Paywall: clear value, **no pressure**.
- **Copy rules:** capitalization · buttons · title/subtitle length (**taken from the measured competitor rhythm**, not guessed) ·
  numbers, dates, times, units · punctuation · emoji · interface language and dev-note language.
- **Forbidden words:** promises the product can't keep · empty marketing words · words claiming things the app can't measure. This list
  feeds the meta-text scan in `principles.md` §2.5 (`FORBIDDEN`).
- **Terminology — one concept, one word:** one entry per concept — `meaning` · `don't use` · `reason`.

**Terminology lives in `voice.md`, not in `flows.md`.** `flows.md` holds **screen** names; `voice.md` holds **concept** names.

### 3.3 Separate approval gate

The voice decides **every** string — changing it after wireframes exist means rewriting everything. Get approval before moving to
wireframes.

---

## 4. Where the voice file is used

| Stage | How |
|---|---|
| Wireframe | write every string by the voice, tone, lengths and terminology |
| UI build | don't change copy; if it overflows its box, **go back to the wireframe** and fix it there, don't cut it on the spot |
| Handoff | the language of dev notes |
| UX review | check consistency across the whole set |

Copy that doesn't fit `voice.md` but must be kept → record a decision with the reason; never drift silently.

### 4.1 What can be checked by machine

From `voice.md` the following can be checked automatically: button, title and subtitle length against the limits · **forbidden words**
in every text node · **words outside the glossary** for a concept that already has a name (using *"Remove"* where *"Delete"* was
chosen) · capitalization that breaks the rule · meta text inside the frame. In the tool demo: the meta/forbidden-word scan in
`principles.md` §2.5, and `../scripts/textdump.js` statistics (length, capitalization per role) for the rest.

Everything else — is the voice right, does the tone fit the moment — is judgement and belongs to the review (`../ux-review-handoff/SKILL.md`).

---

## 5. Stop points and self-check

- Stop at §3.3 — `voice.md` approved before wireframes.
- Stop when proposing voice directions — the user chooses A, B or C.
- Self-check: limits in `voice.md` come from measured rhythm, not guesses; form of address is a single choice; every adjective in the
  voice chart has a *shown by* behaviour; terminology entries all have meaning · don't use · reason.

## 6. Report

When proposing several voice directions: one paragraph of sample sentences per direction — **do not** present the theoretical framework.

```text
Next steps
  → choose voice direction A, B or C
  → "approve voice"
  → "build wireframes"          once flows and voice are both approved
```
