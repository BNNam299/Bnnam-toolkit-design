---
name: product-spec
description: Step 4 of the product toolkit, run for every version BEFORE design - brings the version's features to "Đủ để thiết kế" so a designer can draw without guessing. Per feature - behaviour, numbered main flow, every unhappy branch with an exit (permission denied incl. permanently, offline, error, empty first run, AI wrong or slow), permissions, data, paywall and ad touchpoints; writes use cases, functional requirements with first acceptance criteria, quality requirements, business rules, draft events; fills mobile constraints, the screen list incl. often-forgotten screens and the onboarding outline; sends Dev questions; reviews and hands off to the design toolkit (prd-to-ux-flow). Use after the kick-off sign-off, or when the user asks to write the PRD for design, use cases, requirements, acceptance criteria, permissions, the screen list or onboarding outline. Vietnamese triggers such as "viết PRD", "PRD cho design", "use case", "yêu cầu chức năng", "tiêu chí nghiệm thu", "danh sách màn", "bàn giao design".
---

# product-spec — step 4, every version: enough for design

The design toolkit turns requirements into flows and screens; anything left vague here becomes a guess there, and the costliest guesses
are the unhappy paths nobody wrote: a denied permission, a failed purchase, an empty first run. This step writes each feature of the
version until a designer could draw it and a tester could already argue about it — and stops before screen-level detail, which needs
the real UI.

**Read first:** `../product-standards/SKILL.md`.

## Need → Read
| Need | Read |
|---|---|
| What *Đủ để thiết kế* requires per feature; flows; retention nudges; task analysis (HTA / CTA), information objects, text sitemap and overall flows, screen count, cognitive walkthrough, UX laws, service blueprint; the forgotten screens; onboarding outline | `references/spec.md` |
| UC, FR, AC, NFR, BR, permissions and data, events | `../product-standards/references/requirements-writing.md` |
| Questions for Dev per feature | `references/spec.md` §4 |
| Gate 0 per feature (permissions, data, tracking, licences), ratings prompt, onboarding step rules | `references/spec.md` §6, `../product-standards/references/policy-and-safety.md` |
| The review before hand-off | `../product-standards/references/quality-gates.md` §1–3, §5 |
| Hand-off to the design toolkit | `../product-standards/references/inputs-and-handoffs.md` §4 |

## Workflow
1. **Check inputs**: the version is "đã chốt" in §13 with FEATs at *Đề xuất* (`inputs-and-handoffs.md` §2). Missing → ask first.
2. **Per FEAT** (`references/spec.md` §1–2): fill its block in prd.md §10 — behaviour, numbered flow, unhappy branches, permissions,
   data, touchpoints. A decision with ≥ 2 conditions gets a "nếu … thì … · ngược lại …" table in the block; existing Figma /
   FigJam links go on its `Hình:` line, and §11 gets the frame links and sitemap (`../product-standards/references/inputs-and-handoffs.md` §6).
3. **requirements.md**: UC → FR with first AC → NFR → BR → permissions and data → draft events (§1–6), only for this version's FEATs.
4. **prd.md §9, §11, §12**: mobile constraints adjusted from the team defaults for the platform(s) in §1 (iOS / Android differences listed when both), screen list with the forgotten-screens check,
   onboarding outline from the chosen scenario. §11 also gets, as text the PRD owns: the task analysis, the sitemap tree with the
   navigation model, and the first-launch and daily-return flows across screens (`references/spec.md` §3).
5. **Dev questions** (`references/spec.md` §4) into requirements §8 and a short block in chat for the user to forward.
6. **Review** (`quality-gates.md` §1–3, §5) → record in prd.md §15; move FEATs that pass to *Đủ để thiết kế*, keep the others and say why.
**Reader copy first:** carry any hand edits from `docs/product/reader/` into the working files, then rewrite `docs/product/reader/prd.md` and `docs/product/reader/requirements.md` for the current state (`product-standards/references/reader-copy.md`; md only — no docx until the version is ready to build); the reply points the user to the reader md.
7. **Report and hand off**: which FEATs are ready, open questions, what the designer must read; next step — the design toolkit
   (`prd-to-ux-flow`), then `product-detail` once the UI exists. When the user approves sending to the designer, export `reader/prd.md` to `export/prd.docx` at once; `reader/` stays.

## Core rules
- **Unhappy paths are part of "ready".** A feature without its denied / offline / error / empty branches stays at *Đề xuất*.
- **Text flows are the contract.** Numbered steps with decision points; a diagram is welcome but never alone.
- **No UI prescriptions.** Say what the user must be able to do and see, not button shapes or layouts — the designer owns that.
- **No technology.** Unknown technical limits → **giả định** + DQ; AI never states "làm được".
- **Only this version's FEATs.** Shipped features are not touched; changes go through `ids-and-states.md` §4.

## Self-check before reporting
- Every FEAT moved up has: flow, unhappy branches with exits, permissions with 3 branches, data, touchpoints, ≥ 1 UC with alternative
  and exception flows, ≥ 1 FR with measurable AC, its DQs.
- §11 has the task analysis, a text sitemap where every screen sits, and text flows where every screen appears with both exits of
  every ◇, the screen count under the list, and a walkthrough of first launch → aha and → paywall with no step left at 1–2; it lists screens incl. paywall + restore, permission + denied, offline, free limit reached, rating prompt, ad slots, empty state.
- §12 onboarding outline matches the scenario in §8 and reaches the aha moment in the step count of §5 (or explains why not).
- Review recorded in §15; §0 updated; next step named.
