---
name: product-plan
description: Step 3 of the product toolkit, run for EVERY version - decides what goes into a version. Takes incoming requests (features, paywall or onboarding scenarios, A/B tests, fixes from reviews or data) into a queue, writes the feature table the team way (evidence, persona or job, P0/P1/P2), applies scope rules, drafts monetization decisions (model, free vs paid, plans anchored to competitors, trial, which of the 8 onboarding + paywall scenarios, paywall and ad touchpoints) and metrics (North Star, input, guardrail), builds the version roadmap and the kick-off sheet for Dev feasibility and team sign-off. Use after product-users for version 1.0.0, and whenever the user plans an update, adds a feature or scenario, reprioritises or prepares a kick-off. Vietnamese triggers such as "lên danh sách tính năng", "chốt MVP", "bản cập nhật", "thêm tính năng", "thêm kịch bản paywall", "roadmap", "họp kick-off", "chọn kịch bản onboarding", "giá gói", "chỉ số".
---

# product-plan — step 3, every version: what goes in, what pays, what we measure

Every version — the first release and every update after it — is planned here, so scope, money and metrics are decided together
instead of drifting apart across chats. The output is a version the team can sign off at kick-off, with every feature traceable to a
user pain or a data point.

**Read first:** `../product-standards/SKILL.md`.

## Need → Read
| Need | Read |
|---|---|
| Request queue, release cycle and batching, feature table, priorities, scope rules, version roadmap, retest scope | `references/plan.md` §1–4 |
| Kick-off sheet and recording the team's sign-off | `references/plan.md` §5 |
| Gates 0–6, choosing ICE / RICE / Kano / WSJF / MoSCoW, opportunity canvas, story map, hypothesis + harm question, three lenses, dot voting, impact–effort, risk score, Now / Next / Later roadmap | `references/plan.md` §6–7 |
| Monetization decisions, the 8 onboarding + paywall scenarios, ads placement | `references/monetize-draft.md` |
| Thinking in user states (who sees what), fixed vs config values, revenue model first | `references/monetize-draft.md` §7 |
| Update for a live app: order of improvements, baseline, hard stops, diagnosing why users do not act | `references/plan.md` §8 |
| North Star, input, guardrail metrics, HEART UX metrics, time to value | `references/metrics-draft.md` |
| Consistency checks for free tier, quotas, ads | `../product-standards/references/quality-gates.md` §5 |

## Workflow
1. **Which version?** First release → 1.0.0 from prd.md §2–5. Update → read §13 (what shipped, which metrics), the new data in
   `raw/`, and the request queue. Missing inputs → say it and ask before writing.
2. **Take requests into the queue** (decisions.md, `R-…`) with source and evidence; nothing jumps straight into a version. Check the
   cycle (prd.md §1): gather the queue into one version with one goal; too little → propose waiting or merging; out-of-cycle patch
   only for a crash, a store rejection or a policy violation (`references/plan.md` §1).
3. **Feature table** (`references/plan.md` §2): one FEAT per capability, each tracing to M# / P# / R- and a persona or job; P0/P1/P2;
   apply the scope rules (§3). New FEATs start at level *Đề xuất*.
4. **Money and metrics decisions** — draft, labelled for the future monetize / measure toolkits: `references/monetize-draft.md`,
   `references/metrics-draft.md`. Decisions only (model, split, price range, scenario, touchpoints, metric definitions); screen-level
   detail waits for `product-detail`. Who sees what and when (paywall, trial, free limit, ads, config switches) goes into the §8
   "Rẽ nhánh" table; offer to draw it on FigJam (`../product-standards/references/inputs-and-handoffs.md` §6).
5. **Version roadmap** (§13): what this version must prove, FEATs, metrics, target date in the cycle, and the **retest scope**
   (lead checks UI, Dev checks logic / data / payments).
6. **Kick-off sheet** (`references/plan.md` §5): give it to the user for the team meeting; Dev fills feasibility and hours. Stop.
7. **After the meeting** (the user returns with results or minutes in `raw/`): record decisions D-…, update priorities and §13 status
   "đã chốt", drop or postpone what the team cut. Next step `product-spec`.

## Core rules
- **The team decides scope, not the AI.** The AI proposes and challenges; the sign-off is recorded with names and date.
- **A feature that traces nowhere is cut or sent back** to `product-users` / market — not kept "for later".
- **Recovery paths share their flow's priority** (dependency rule).
- **Money decisions respect the evidence**: the free tier never locks what users complained about paying for; no quota on the core
  action when ads are a revenue line; prices sit against the competitor anchor, never picked by feel.
- **Updates never rewrite shipped features** — they add FEATs or "Thay đổi ở các bản sau" rows (`ids-and-states.md` §4).

## Self-check before reporting
- Every FEAT of the version: source, persona / job, priority, level *Đề xuất*, version; every request has a status.
- §4 still consistent (no banned item in the table); P0 set serves the proof sentence; "không được cắt" items present.
- §7 has one North Star, input metrics, ≥ 1 guardrail, each with a formula; §8 has model, split, plans with anchor, scenario + reason,
  touchpoints; both labelled draft.
- The version follows the cycle and batches its changes (or the out-of-cycle reason is one of the three allowed); retest scope
  written.
- Kick-off sheet ready, or the meeting result recorded as decisions; §0 updated; next step named.
