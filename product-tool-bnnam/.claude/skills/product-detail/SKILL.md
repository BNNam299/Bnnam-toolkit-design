---
name: product-detail
description: Step 5 of the product toolkit, run for every version AFTER the UI exists - brings the version's features to "Đủ để build". From the real screens (Figma, screenshots, design/flows.md) writes per feature the screen rules table and other cases (the team "Design & Product Rule" format), onboarding screen by screen, monetization detail (plans and product IDs by country, paywall per placement, 8 transaction states, ads, A/B tests with kill rules, dark-pattern check), events and acceptance criteria per screen; runs the full review, exports prd.docx and requirements.docx, hands off to Dev (md for their agent) and the build toolkit, each criterion tagged lead or Dev. Use when a version's design is done, or when the user asks to finish the PRD, write rules per screen, detail the paywall or IAP, write tracking events, finalise acceptance criteria or export to Word. Vietnamese triggers such as "hoàn thiện PRD", "PRD sau design", "quy tắc từng màn", "kịch bản IAP", "event tracking", "xuất PRD ra word", "bàn giao dev".
---

# product-detail — step 5, every version: enough to build

Some things can only be written once screens exist: what each button does and defaults to, what the paywall says at each placement,
which event fires on which screen, what the tester checks on which screen. The team's own PRDs carry this as a "Design & Product Rule"
table per screen plus "Other cases". This step writes that for the version's features, closes the review, and exports the documents
people will read.

**Read first:** `../product-standards/SKILL.md`.

## Need → Read
| Need | Read |
|---|---|
| Screen rules table, other cases, onboarding screen by screen | `references/detail.md` §1–3 |
| Monetization detail: plans by country, placements, transactions, ads, A/B | `references/detail.md` §4 |
| Paywall content, submission checklist, cancellation flow, trustworthy A/B tests and learnings | `references/detail.md` §7–9 |
| Events and acceptance criteria tied to screens | `references/detail.md` §5, `../product-standards/references/requirements-writing.md` §2, §6 |
| Full review and export | `../product-standards/references/quality-gates.md`, `../product-standards/SKILL.md` "Export" |
| Hand-off to Dev, QA, build toolkit | `../product-standards/references/inputs-and-handoffs.md` §4 |
| Traceability table, acceptance entry / exit, defect severity | `references/detail.md` §10 |

## Workflow
1. **Check inputs**: the version's FEATs are at *Đủ để thiết kế*; the UI for them exists (Figma link in §1, screenshots in `raw/`,
   `design/flows.md` if the design toolkit ran). Missing UI → say it and ask; never describe screens you have not seen.
2. **Take screen names and links from the design** (`design/flows.md` / Figma; links into §1, FEAT `Hình:` lines, §11 —
   `../product-standards/references/inputs-and-handoffs.md` §6). Map old `SCR-…` to them in §11; new screens the designer added
   get a FEAT or a decision.
3. **Per FEAT** (`references/detail.md` §1–2): screen rules table + other cases under its block in prd.md §10.
4. **Onboarding** screen by screen (§3), **monetization detail** (§4) in prd.md §8 and requirements §7.
5. **Events and AC** tied to screens (§5) in requirements §2, §6, §7; settle any open limit numbers first. Tag each AC **[Lead kiểm]**
   (UI, copy, screen states) or **[Dev kiểm]** (logic, data, permissions, payments) — the team has no tester.
6. **Full review** (`quality-gates.md` all sections) → prd.md §15. FEATs that pass → *Đủ để build*; others stay, with what is missing.
**Reader copy first:** carry any hand edits from `docs/product/reader/` into the working files, then rewrite `docs/product/reader/prd.md` and `docs/product/reader/requirements.md` for the current state (`product-standards/references/reader-copy.md`; md only — no docx until the version is ready to build); the reply points the user to the reader md.
7. **Export** the two reader copies to `docs/product/export/prd.docx` and `requirements.docx`, check both exist, then delete
   `docs/product/reader/` (`../product-standards/SKILL.md` "Export"): working md stays the source for Dev's agent, docx is for
   people; if the docx package is missing, ask before installing and keep `reader/` until it is.
8. **Report**: version, FEATs ready to build, open items, files to send (docx for people, md for Dev's agent), the retest scope, next — build (Dev / `/ios-spec`), and
   `product-plan` for the next version after release. Stop.

## Core rules
- **Describe what is on the screen, from the screen.** Rules come from the real UI; if a component's behaviour is not decided, ask —
  do not invent one.
- **Every rule is testable**: a timeout in seconds, a default state, an exact limit with reset time, an exact message trigger.
- **One number per rule**: conflicting drafts (limits, prices) are settled with a decision before events and AC are written.
- **Prices live only in §8**; product IDs follow the team's IAP sheet format.
- **Shipped versions are not edited** — new behaviour goes into "Thay đổi ở các bản sau" and a new decision.

## Self-check before reporting
- Every FEAT moved to *Đủ để build*: rules table on real screens, other cases, events, AC per screen each tagged Lead / Dev, Dev
  feasibility answered.
- Onboarding screens each have goal, content, choices, microcopy, data to collect, event.
- §8 detail: plans by country, placements with scenario, 8 transaction states, ads with frequency caps, dark-pattern check all pass.
- Review recorded; .docx exported (or the install step pending and said); §0 and §13 updated; next step named.
