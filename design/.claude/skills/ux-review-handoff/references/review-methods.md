# UX review — procedure, methods, team 0–4 severity, review file format

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/review-methods.md, modules/ux-review.md, templates/design/review.md @ 3c0e291 — translated, complete

How the team runs **one usability review pass after the whole UI is done**: build the scenario, walk every flow as a real user, look
through three overlapping lenses, score every problem on one 0–4 scale, and write `design/review.md`. The purpose is **refinement, not a
blocking gate**. The reviewer never fixes anything — it produces a list and the user picks what to fix.

## Contents
1. When to run (and when not)
2. Inputs
3. Procedure (7 steps)
4. Usability components and sub-criteria
5. Shneiderman's eight golden rules
6. Cognitive walkthrough
7. Severity 0–4 with evidence
8. Accessibility — the part checked by eye
9. Honesty
10. Output — `design/review.md`
11. Adaptive projects (iOS 27 · iPhone Duo · iPad)
12. Stop points, self-check, report
13. Overall score weighted by app type (optional)

---

## 1. When to run (and when not)

- **Every UI batch that has been accepted** — one pass, over the whole UI.
- The user asks to *"review"*, *"soát lại UX"* *(re-check the UX)*, *"chấm usability"* *(score usability)*.

**Don't run** before the wireframes are approved, and **don't run** after each batch. Checking individual strings while building belongs
to `../ux-writing/SKILL.md` (meta-text scan) and the screen audit (`../scripts/audit.js`), not to this review.

Role: designer.

## 2. Inputs

| Check | If missing |
|---|---|
| Every flow in `design/flows.md` is marked accepted (`ui: accepted <date>`) | say which flows are missing; suggest finishing the batch |
| `design/voice.md` approved | needed to check consistency across the whole set |

| Read | Write |
|---|---|
| `prd.md` · `flows.md` · `voice.md` · the design decision log · the UI page in Figma (read-only, screenshots) | `design/review.md` (`status: draft`, `based_on: flows.md@…`) from `../assets/review.template.md` |

(Flow and PRD files: `../prd-to-ux-flow/SKILL.md`. Voice file: `../ux-writing/references/voice-and-tone.md`.)

---

## 3. Procedure (7 steps)

1. **Build the scenario before looking at screens:** who uses it · when · to do what · what it brings them (**Who / When / Why / How**),
   taken from `prd.md`. Add **PACT context** when it changes the judgement — who the people are, frequent or rare activity, where it's used
   (one hand, outdoors, wearing gloves), which device. A flow that fails for someone at a desk may be right for someone riding a motorbike.
2. **Walk each flow along the scenario** like a real user — read every screen in the order the user meets it, with the six screen-reading
   questions (`../mobile-ui-master/references/reading-screens.md`); never review screens in isolation.
3. **Three lenses, overlapping on purpose:**
   - **Five usability components** — the main pass. Score **learnability · efficiency · memorability · errors** with the **sub-criteria**
     (§4): predictability, recognisability · navigation, control, feedback, smart system · familiarity, consistency · three error levels
     and three recovery mechanisms. *Satisfaction* needs real users — never self-score it; put it under *Needs testing with users*.
   - **Nielsen and Shneiderman** — the second lens, especially for forms, multi-step flows and controls (§5; Nielsen's ten:
     `heuristics-evaluation.md` §3).
   - **Cognitive walkthrough** — for every multi-step flow: onboarding, payment, first run. A specific task, the correct action sequence,
     four questions at each step (§6). Catches problems at the joins between screens.
4. **Score each problem 0–4** — set the score by frequency × impact × persistence (§7). **Two independent lenses catching the same problem
   → one point lower (one level more severe).** Score by impact on the user, not by how easy it is to fix:

   | Score | Meaning | Fix |
   |---|---|---|
   | 4 | fine — goes under *What works well* | — |
   | 3 | not great, fix or not | backlog |
   | 2 | fairly serious, needs fixing | in a batch |
   | 1 | very serious, fix soon | first |
   | 0 | must fix — otherwise users can't use it | first |

5. **Accessibility — the part machines can't check:** enlarged text · screen-reader labels · colour as the only signal · motion (§8).
   Not checkable on a static design → write *"check in build"*.
6. **Check copy consistency across the whole set** against `voice.md` — is the voice right, does the tone fit the moment (the part machines
   can't check). **Error messages** are scored separately with the 12-question rubric (3 groups × 4 questions, scale 1–4) in
   `../ux-writing/references/handbook-patterns.md` §2.3 — payment, data and safety flows get a higher bar.
7. **Honesty** (§9): score only screens you read · never invent usage data · every problem names the standard that caught it · record
   what works well too.

**One single 0–4 scale.** No extra 0–100 total score: the output of a review is a list of fixes ranked by severity, and the 0–4 scale
answers exactly that (decided by the user).

When the screen is a **monetization screen** (paywall, sale, ad gate, plan-selling banner): read
`../mobile-ui-master/references/monetization-screens.md` — its risk checklist first — and `../app-store-policies/SKILL.md`.

---

## 4. Usability components and sub-criteria

Score against the **usage scenario** Who · When · Why · How built first.

| Component | Sub-criteria | Typical defect |
|---|---|---|
| **Learnability** | **predictability** — you can guess the result of an action, and the guess must be right · **recognisability** — visible and understandable; a button doesn't blend into text | tapping *"All recommended movies"* opens the Movies section instead. Hidden interactions are acceptable only when based on existing experience (a card flips because real cards flip) |
| **Efficiency** | **navigation** — clear, shortest path (tied to IA) · **control** — personalisation, control over what's shown · **feedback** — clear, consistent, fast, continuous · **smart system** — suggestions, fewer actions | a scan runs with no progress; 4 steps for a daily task |
| **Memorability** | **familiarity** — familiar words and icons; a new icon gets a caption the first time · **consistency** across the system | the same action has three different labels across screens |
| **Errors** | **three levels:** not serious (self-fixable) · neutral (annoying, no big consequence) · serious (data loss, accidental delete) · **three mandatory mechanisms:** warn (confirm before risk) · self-protect (autosave, block dangerous actions) · recover (trash, undo) | bulk delete with no confirmation and no restore |
| **Satisfaction** | flexibility · style fits the audience · no sudden changes | **measurable only with real users** — experts don't score it |

A defect that reveals a **feature without a purpose** → the proposal must answer *"what was this feature made for"* (recommendations
that aren't personalised — what are they for?).

## 5. Shneiderman's eight golden rules

The second lens next to Nielsen's ten heuristics — sharper on **interaction mechanics**: forms, multi-step flows, controls. The two
lenses overlap on purpose; a problem caught by both is a strong signal.

| # | Rule | Check |
|---|---|---|
| 1 | **Consistency** | same action, same label and control everywhere; destructive actions all work the same way |
| 2 | **Serve all users** | a fast path for regulars, a guided path for newcomers |
| 3 | **Informative feedback** | every action has feedback — light for frequent things, clear for big, rare things; long operations show progress |
| 4 | **Closure** | multi-step flows (onboarding, payment, logging a meal) end with a clear *done* state |
| 5 | **Prevent errors** | grey out invalid options · constrain inputs · confirm before consequential actions |
| 6 | **Easy reversal** | undo after delete · back out of every step |
| 7 | **User in control** | no doing things on the user's behalf; the user starts, the system responds — an autoplaying video with no skip, a paywall with no visible close are violations |
| 8 | **Reduce short-term memory load** | never require remembering values from a previous screen · group related things · recognition over recall |

## 6. Cognitive walkthrough

A heuristic review looks at **screens** through principles; a walkthrough looks at a **task** the way a first-time user thinks. It
catches problems at the **joins between screens** that screen-by-screen review misses. Use it for multi-step flows: onboarding, payment,
first run.

**Prepare:** who the user is and what they already know (usually a newcomer) · **a specific task** (*"log a meal by photo for the first
time"*, not *"explore the app"*) · **the correct action sequence**, one action per step.

**Four questions at every step:**
1. Will the user **intend** to do this — do they know this step is needed for the goal?
2. Will the user **see** the right control — not hidden, not off-screen, not disguised?
3. Will the user **connect** the control with the result they want — do the label and icon say what it does? (a *"Continue"* button that
   actually starts a free trial fails this question)
4. After the action, does the user **see progress** toward the goal?

A *"no"* or *"maybe"* at any step is a problem — record the step, which question failed and why.

## 7. Severity 0–4 with evidence

Three factors, weighed together:
- **Frequency** — rare, or every time it's used.
- **Impact** — mild annoyance, or blocks the task.
- **Persistence** — trip once and learn, or trip every time.

| Score | When | Example |
|---|---|---|
| **0** | high on all three, blocks the task — or data loss, store rejection | placeholder data that looks like an error · delete without confirmation · promoting a feature that doesn't exist |
| **1** | very serious, users can still continue but easily give up | a walkthrough step where a newcomer would give up |
| **2** | causes snags and confusion; only some users or sessions hit it | inconsistent terminology · control in the wrong context · weak visual hierarchy |
| **3** | polish — low frequency, low impact | slightly uneven spacing · a label could be shorter |
| **4** | fine — goes under *what works well* | — |

**Two independent methods catching the same problem** (five components and Nielsen/Shneiderman, or heuristics and walkthrough) → **one
level more severe** (one point lower). Two lenses pointing at the same spot is strong evidence.

Scores reflect **impact on the user**, not ease of fixing. (Other published scales and how they map: `heuristics-evaluation.md`, top note.)

## 8. Accessibility — the part checked by eye

The machine checks contrast (`../scripts/audit.js`; the tool demo's `audit_design` also checks contrast). Touch-target size is a
developer concern in this team: a visible control smaller than 44 pt / 48 dp is allowed, and the developer enlarges the **hit area** in
code (`handoff-spec.md` §2.4) — the audit's tap check is off by default. The rest must be looked at:

- **Enlarged text** — fixed-height text boxes, single-line labels, dense rows of numbers: does raising the system text size break,
  overlap or clip?
- **Screen reader** — icon-only buttons need a label; informative images need a description. Usually not checkable on a static design →
  write *"check in build"*; don't pass or fail it on your own.
- **Colour as the only signal** — states told apart only by colour → add text, an icon or a shape.
- **Motion** — onboarding that forces watching an animation · information only conveyed by motion · Reduce Motion not respected.

(Full accessibility rules: `../mobile-ux-fundamentals/references/accessibility.md`.)

## 9. Honesty

- **Score only what you saw.** Saw 3 of 7 screens → the review covers 3 screens; say so.
- **Never invent data.** Without usage data, every claim about conversion is inference — say so.
- **Every problem names the standard that caught it** — so the designer can check it, not just trust the agent.
- **Record what works well too** — a review that only criticises is neither correct nor helpful for knowing what to keep.

---

## 10. Output — `design/review.md`

Template: `../assets/review.template.md`. One entry per problem, **lowest score first**:

```markdown
### "All" in Recommended opens Movies by mistake
- screen: Home_Result
- criteria: learnability — predictability; efficiency — navigation
- caught by: 5 components · Nielsen #2 · walkthrough step 3 question 3
- score: 0
- proposal: rename it "Movies", or link to the real recommendations list
- fix in: flows.md (link target) · wireframe (label)
```

Three fixed sections besides the problems: **`## What works well`** — so you know what to keep · **`## Scope and confidence`** — screens
read / not read, flows walked, usage data or not · **`## Needs testing with users`**.

**Say it in plain words** — *"users tapping All will expect more recommended movies"*, not *"violates predictability"* as the main
sentence. The criterion goes in its own field for filtering, not as the explanation. Write the review in the user's language.

**The user picks which entries to fix.** Fixes take the normal route: the owning stage first (`flows.md`, wireframe, `voice.md`), then
the UI.

### 10.1 What is worth testing with real users
User testing is **outside this review** — not something the designer does together with the agent, and no test scripts are written here.
Only list, under `## Needs testing with users`, the low-score entries the agent is unsure about and everything about *satisfaction*.

## 11. Adaptive projects (iOS 27 · iPhone Duo · iPad)

When the project supports adaptive layouts (adaptive level other than none): add an **adaptive pass** using the iPhone Duo knowledge
(`../iphone-duo-adaptive/SKILL.md`): the adaptive checklists, anti-patterns, states and conditions, the deep-dive checklist
(structure · geometry · content · controls · continuity · verification), the starter-kit checklist, the eight output questions and the
10 continuity scenarios walked on the frames; plus the adaptive-variant scan (missing variants, actions that differ between variants).
Record it in `review.md › Adaptive`. Each problem states the **combination of conditions** that causes it (e.g. *outer landscape +
keyboard + AX text size + Live Activity*) — the word "Duo" alone is not enough.

## 12. Stop points, self-check, report

- **Stop:** the user chooses which entries to fix — this review never fixes anything itself.
- **Self-check:** every problem has a 0–4 score and names the method that found it · only things actually seen are scored · scope and
  confidence filled in · satisfaction left to user testing.
- **Report** (in addition to the usual summary): the methods used and what each found (e.g. "Nielsen: 6 issues · walkthrough of onboarding:
  2 steps scored 1") · number of problems by score (0 · 1 · 2 · 3) · by component (learnability · efficiency ·
  memorability · errors) · flows walked, flows walked through cognitively · number of *check in build* items · number of items needing
  user tests.

```text
Next steps
  → choose entries to fix — e.g. "fix the 0 and 1 entries"
  → "write dev notes"              if you want a handoff
```

## 13. Overall score weighted by app type (optional)

> Source: the team handbook (11 UX & Product skills), skill UX Design Review, `scoring.md` — added 08/11/2026.

Use only when the user wants one number for the whole design (comparing two versions, reporting to the team). The 0–4 entries stay
the main output; this score never replaces them.
- **Five criteria, each scored 0–100**: usability and heuristics (Nielsen, platform conventions, error prevention, feedback) · visual
  design (hierarchy, type, colour, spacing, consistency, trust) · conversion / goal effectiveness (does the design drive its main goal
  — funnel data if any) · information architecture (structure, navigation, labels) · content and consistency (microcopy, terms, no
  placeholder text). Accessibility is a baseline check whose violations appear as entries; score it as its own line (10–15%) only if
  asked, and renormalise.
- **Bands**: 90–100 excellent · 75–89 good · 60–74 fair · 40–59 weak · 20–39 poor · 0–19 broken. Score against the standard, not
  other apps, and cite the entries that put a criterion in its band.
- **Weights by app type** (state which preset was used):
  | App type | Usability | Visual | Conversion | IA | Content |
  |---|---|---|---|---|---|
  | Subscription / commerce | 25% | 20% | 30% | 15% | 10% |
  | Productivity / work | 35% | 15% | 10% | 25% | 15% |
  | Brand / marketing | 15% | 35% | 20% | 10% | 20% |
  | General consumer (default) | 30% | 20% | 20% | 15% | 15% |
- **Show the arithmetic** (e.g. 50 × 0.25 + 75 × 0.20 + 40 × 0.30 + 55 × 0.15 + 55 × 0.10 = 53.25 ≈ 53 / 100). When the total
  changes only because the weights changed, say so.
