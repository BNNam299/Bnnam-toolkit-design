---
name: ux-review-handoff
description: Usability review of a finished UI and developer handoff - one pass over every flow with a usage scenario, five usability components, Nielsen's heuristics, Shneiderman, cognitive walkthrough, one 0-4 severity scale (0 = fix now), a design/review.md fix list; acceptance checklist, anti-patterns, Definition of Done; planning usability tests (tasks, metrics, research methods), trust and dark patterns; a read-only Figma audit script (structure, naming, raw values, meta text, contrast); dev notes and the state, behaviour and content spec developers need. Use when the user asks to review, evaluate or score the UX of a set of screens, run a heuristic evaluation or walkthrough, plan a usability test with users, audit screens, or hand off to developers. Vietnamese triggers such as "review UX", "soát lại UX", "chấm usability", "đánh giá heuristic", "test người dùng", "kiểm màn", "ghi chú cho dev", "bàn giao dev", "nghiệm thu thiết kế". For per-screen QA during the build use figma-ui-flow; for copy review use ux-writing.
---

# ux-review-handoff — review the finished UI, hand it to developers

This skill answers **"is the finished UI usable, and what do developers need?"** Three jobs:
- **UX review** — one usability pass over the whole accepted UI; the output is a ranked list of fixes the user chooses from.
  Purpose: refinement, not a blocking gate. The reviewer never fixes anything itself.
- **Screen audit** — a read-only machine scan of a page (`scripts/audit.js`) for structure, naming, raw values, meta text, contrast and
  overflow problems.
- **Developer handoff** — optional team dev notes on Figma, plus the spec content (states, behaviour, responsive, content).

What lives elsewhere: per-screen QA and Definition of Done while building (`figma-ui-flow` Stage 7,
`../figma-ui-flow/references/handoff-qa.md`, tools `audit_design` / `stress_test`); copy review (`ux-writing`); states and feedback rules (`mobile-ux-fundamentals`); layout review by
eye (`mobile-ui-master`). Exact Apple / Material wording: `apple-hig`, `material-design-3`.

## Need → Read
| Need | Read |
|---|---|
| Run the UX review: scenario, three lenses, 0–4 scoring, accessibility by eye, honesty, `review.md` format, adaptive pass | `references/review-methods.md` |
| Review file template | `assets/review.template.md` |
| One overall score weighted by app type (subscription, productivity, brand, consumer), bands, arithmetic | `references/review-methods.md` §13 |
| Laws of UX to name in an entry (Fitts, Jakob, Von Restorff, peak–end, Gestalt…) | `../mobile-ux-fundamentals/references/behavior-psychology.md` §9 |
| Nielsen's ten heuristics in depth, heuristic evaluation procedure and issue template | `references/heuristics-evaluation.md` §3–4 |
| Which evaluation method answers which question (walkthrough, PURE, usability test, A/B, analytics, reporting) | `references/heuristics-evaluation.md` §5 |
| UX metrics, other severity scales (S0–S3, NN/g 0–4) and how they map to the team scale | `references/heuristics-evaluation.md` top note, §1 |
| Master UX review checklist | `references/heuristics-evaluation.md` §7 |
| Why users fail: mental models, cognitive load, recognition, attention, scent, response times, choices, undo/confirmation | `references/ux-research-principles.md` §1–8 |
| Research methods, usability testing, card sort / tree test, journey map, service blueprint, evidence ledger | `references/ux-research-principles.md` §9–13, §17–18 |
| Trust, deceptive patterns and the symmetry audit; inclusive UX; AI UX | `references/ux-research-principles.md` §14–16 |
| Acceptance checklists (flow, platform, adaptive, visual, accessibility, performance), anti-patterns | `references/acceptance-checklist.md` §1–2 |
| Review a component / screen / flow; Definition of Ready / Done (design, build); critique | `references/acceptance-checklist.md` §3 |
| Audit a page by machine | `scripts/audit.js` (below) |
| Dev notes on Figma: modes, note convention, content sources | `references/handoff-spec.md` §1–8 |
| State matrix, behaviour / responsive / content spec, implementation limits | `references/handoff-spec.md` §9–13 |
| System bars, back, keyboard, permissions, lifecycle, offline, optimistic UI, notifications, widgets, foldables, security, AI states | `references/handoff-spec.md` §14–30 |
| Dev Mode, annotations, asset export, token mapping (tool mechanics) | `../figma-ui-flow/references/handoff-qa.md` §4–6, `../figma-agent-tools/SKILL.md` |
| Error-message rubric (12 questions) | `../ux-writing/references/handbook-patterns.md` §2.3 |
| Paywall, sale, ad-gate screens | `../mobile-ui-master/references/monetization-screens.md`, `../app-store-policies/SKILL.md` |
| Adaptive projects (iPhone Duo, iPad): adaptive review pass, behaviour spec, Device Hub matrix | `../iphone-duo-adaptive/SKILL.md` |

Do not read everything at once. Each workflow step below names the file it needs.

## Core rules
1. **Review once, after the whole UI is accepted** — not before the wireframes are approved, not after every batch. Copy checks during
   the build belong to `ux-writing` and the audit.
2. **Scenario before screens.** Write Who / When / Why / How from the PRD (plus PACT context when it changes the judgement), then walk
   each flow in the order a real user meets it. Never review screens in isolation.
3. **Three overlapping lenses:** the five usability components with sub-criteria (main pass) · Nielsen + Shneiderman (second lens,
   especially forms, multi-step flows, controls) · cognitive walkthrough with four questions per step (every multi-step flow).
   Satisfaction is never self-scored — it goes to *Needs testing with users*.
4. **One scale, 0–4, where 0 is worst:** 0 must fix (unusable) · 1 very serious, fix soon · 2 fairly serious, fix in a batch · 3 not
   great, backlog · 4 fine → *What works well*. Score by frequency × impact × persistence, by impact on the user, never by ease of fixing.
   Two independent lenses catching the same problem → one point lower. **No 0–100 total, even when the user asks for one** — say why
   (a single number hides which fixes matter and invents a precision the method doesn't have) and give the count per severity and per
   component instead. Other published scales run the other way — read the mapping before quoting them.
5. **Honest scope.** Score only screens actually read; never invent usage data; every problem names the standard that caught it; always
   record what works well. Things a static design can't show (screen reader, real text scaling) → *check in build*.
6. **Plain words first.** Each entry's title and proposal say what the user will experience (*"users tapping All will expect more
   recommended movies"*); the violated criterion sits in its own field. Lowest score first.
7. **The user chooses the fixes.** Fixes go to the owning stage first (flows, wireframe, `voice.md`), then the UI.
8. **Dev notes carry, never invent.** Ask which mode first (Figma notes · skip · Dev Mode). Notes are `Dev Note` instances outside screen
   frames, in the file's own note style; content comes only from the project's design files — missing information is reported back.
9. **Touch area is the developer's job in this team.** Visible controls smaller than 44 pt / 48 dp are allowed in design; the dev note
   asks the developer to enlarge the hit area. The audit's tap check is off by default.

## Workflows

### A. UX review (`design/review.md`)
1. Check inputs: every flow accepted, `voice.md` approved (`references/review-methods.md` §2).
2. Build the scenario; walk every flow; apply the three lenses (`references/review-methods.md` §3–6; Nielsen detail in
   `references/heuristics-evaluation.md` §3).
3. Score each problem 0–4 (§7); add accessibility-by-eye findings (§8); copy consistency against `voice.md` and the error rubric.
4. Monetization screens → read the monetization checklist; adaptive projects → add the adaptive pass (§11).
5. Write `design/review.md` from `assets/review.template.md`, lowest score first, with *What works well*, *Scope and confidence*,
   *Needs testing with users*.
6. Report counts by score and component, flows walked, *check in build* and user-test items — then stop and let the user pick fixes.

### B. Screen audit (`scripts/audit.js`)
Read the script, set `CONFIG` at its top — at least `PAGE`, `MODE` (`"ui"` or `"wireframe"`), `OS`, `FRAME` (402×874 for a new project;
the existing screen size for an existing one), `SAFE_AREA` if the file uses a Safe-Area component, and `FORBIDDEN_WORDS` / `TERMS` /
`LIMITS` / `CASE` from `voice.md` — then send the whole file as `code` to `execute_code` with `timeoutMs` up to ~120000 on big files.
It is read-only and returns:
- `mustBeZero` — errors to fix (root auto layout, safe area, names, meta text, contrast with raw colours, stale paints, broken instances,
  dev notes inside screens, and the nine raw-value counts).
- `needsDecision` — questions for the designer (frame size, tall screens, token pairs with low contrast, notices that look like cards…).
- `notHandled` — what wasn't checked (unmeasurable contrast → check by eye, empty image slots, skipped copies).
- `detail`, `perScreen`, `accepted`, `inheritedFromComponent`, `rawSpacingIntent` (raw spacing on layout frames is the designer's intent,
  not an error).
Places the designer keeps on purpose go into `ACCEPTED` with their decision id, so they stop counting. Use it alongside the tool
demo's `audit_design` and a screenshot — the numbers find problems, the eye confirms them.

### C. Developer handoff
Follow `references/handoff-spec.md` §1–8: confirm screens are accepted → ask the mode → detect the note component and arrow style in the
file → place notes at section level next to each screen, content only from the design files (§5) → report screens with notes, note
count and missing information. For the spec content a handoff must cover, use §9–12 as the checklist; for adaptive projects attach the
behaviour spec and Device Hub matrix.

## Common pitfalls
- Reviewing screen by screen and missing the joins between screens — that's what the walkthrough is for.
- Quoting an NN/g severity "4" as if it meant *fine*: on the team scale 0 is the worst.
- Scoring satisfaction or conversion without users or data.
- A review that only criticises, with no *What works well* and no scope statement.
- Fixing things during the review instead of listing them.
- Dev notes placed inside screen frames (they end up in exports and audits), or notes drawn by hand instead of instances.
- Writing new behaviour into a dev note that isn't in the flow file.
- Trusting `audit.js` contrast numbers on images/gradients — they are reported as unmeasured; check by eye.

## Self-check before reporting
- Every flow walked along the scenario; every multi-step flow walked through cognitively.
- Every problem: plain-words title, screen, criterion, method that caught it, 0–4 score, proposal, where to fix.
- *What works well*, *Scope and confidence* and *Needs testing with users* filled in.
- Nothing fixed without the user's choice; dev notes outside frames and sourced from the design files.
