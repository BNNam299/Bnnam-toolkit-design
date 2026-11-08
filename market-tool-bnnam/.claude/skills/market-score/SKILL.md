---
name: market-score
description: Step 4 of the market toolkit - turns the dig into a choice. Scores need clusters (Need Score, keep ≥ 25/35), writes at least 3 app ideas as testable sentences and ranks them (weighted Opportunity Score), states why now, then quick-checks the chosen idea - "có lời không" (money per download vs cost per download by country tier, three scenarios, break-even CPI, what moves the result most) and "làm được không" (AI's rough guess per core capability, never a conclusion, plus questions for Dev), and updates dev-brief.md to version 2. Fills market-report.md §5 and stops to discuss. Use after market-dig, or whenever the user asks to score or compare app ideas, pick an opportunity, estimate LTV vs CPI, compute a break-even CPI, or prepare technical questions for Dev. Vietnamese triggers such as "chấm điểm", "chọn ý tưởng", "so sánh ý tưởng", "có lời không", "LTV CPI", "trần CPI", "làm được không", "câu hỏi cho dev".
---

# market-score — step 4: which idea, does it pay, can it be built

Scores without evidence are decoration, and a profit estimate given as a single number is false precision. This step scores only what
step 3 proved, compares at least three ideas, and checks money and feasibility in ranges — then stops so the user decides with the
numbers in front of them.

**Read first:** `../market-standards/SKILL.md`. Stops for the user at the end (discussion).

## Need → Read
| Need | Read |
|---|---|
| Need Score (7 criteria, ≥ 25/35), strongest signals, Opportunity Score weights | `references/scoring.md` §1–2 |
| Writing ideas, ≥ 3 per cluster, the "AI is a mechanism" trap, action groups, why now | `references/scoring.md` §3–5 |
| The chosen idea as an opportunity canvas; sensitivity of the ranking | `references/scoring.md` §6 |
| Money per download by tier, break-even CPI, industry CPI range (no UA person), ads formula, scenarios, sensitivity | `references/economics.md` |
| Store fees vs the ×0,65 convention, payback month by cohort | `references/economics.md` §2b, §8 |
| Feasibility guess and `dev-brief.md` version 2 | `../market-standards/references/dev-brief-writing.md` |
| Data traps when reading competitor revenue, DAU, retention | `../market-standards/references/evidence-and-sources.md` §7 |

## Workflow
1. **Check step 3.** §3 clusters with evidence and §4 competitors (comparison, matrix, price anchor) must exist. Missing → apply the
   missing-data rule: tell the user what is missing and **ask before writing any part of §5** — including the money and feasibility
   checks that do not need the missing sections. Only after they agree, continue; scores built on assumptions are marked "giả định"
   cell by cell.
2. **Need Score** every cluster from §3 (`references/scoring.md` §1). Each score cites evidence or is marked "giả định".
3. **Ideas**: from the clusters that pass, write ≥ 3 ideas as testable sentences (more than one per strong cluster), score them with
   the Opportunity Score, sort into action groups (`references/scoring.md` §2–4). If the user arrived with an idea, it is one of the
   candidates — score it honestly next to the others.
4. **Propose the chosen idea** and why now (`references/scoring.md` §5).
5. **"Có lời không"** for the chosen idea (`references/economics.md`): money per download per tier in three scenarios, break-even CPI,
   compared with the **industry CPI range you look up yourself** (the team has no UA person — `economics.md` §3), said in one plain
   sentence; the parameters that move the result most. Missing country revenue split or CPI range → say which number would change the
   conclusion and add it to the data request and §7.
6. **"Làm được không"**: per core capability, "AI đoán sơ bộ: dễ / vừa / khó / không rõ — chờ Dev xác nhận" + the question for Dev.
   Read any `raw/dev-answer-*` that arrived since step 1 first and use it (a capability Dev called impossible is dropped or
   downgraded). Add **Bản 2 = only the new questions** to `dev-brief.md` (no rewrite; deadline 2 working days, as a date; change note
   at top; thresholds awaiting the user's approval) — `../market-standards/references/dev-brief-writing.md`.
7. **Write §5** — full detail only for the chosen idea; clusters and ideas that were dropped get one line each (score + reason).
   Run the delete test from `../market-standards/references/writing.md` §1. Update §0, check against the step-1 stop thresholds, add assumptions to §7.
8. **Stop and discuss**: present a short **priority table with the AI's view and the user's view side by side** (`references/scoring.md`
   §7) — the user may reorder; where the two differ, write how and why. Then ask: **decide now, or take it to the team?** Team → write
   `meeting-brief-b4.md` + .docx (`../market-standards/references/meeting-brief.md`). Record in §5 who chose (the user or the team) and
   the date. Ask the user to approve the brief's thresholds and send it to Dev. Next step: `market-decide` once Dev answers or the
   deadline passes.
9. **Dev reports a blocker after Bản 2** (rerun of this step): with the user, propose 1–2 other routes — a technical workaround, a
   narrower feature, or the next idea in the ranking (use Dev's suggestion if any) — and add the **extra round** to `dev-brief.md`
   (only those routes, 2 working days). This is the last round; nothing is asked after it.

## Core rules
- **Score from evidence.** Every score points to evidence numbers; a score without data is "giả định" and says what data would fix it.
- **Never pick the first idea.** At least 3, written so a stranger could tell them apart.
- **Ranges, not points.** Money per download in three scenarios (thận trọng / giữa / mạnh tay); the useful output is which parameters
  matter most, not the exact LTV.
- **Split by country tier.** What drives revenue in T1 (subscription funnel) differs from T3 (ads and retention); one blended number
  hides the decision.
- **Feasibility is Dev's call.** The model's knowledge stops at its training date; write guesses and questions, never "làm được".
- **An assigned idea** (stopping not allowed, recorded in §1) is still scored — the scores show where to invest, not whether to go.

## Self-check before reporting
- Need Score table complete, ≥ 25/35 rule applied, every score with evidence or "giả định".
- ≥ 3 ideas with sentences, Opportunity Scores, action groups; chosen idea with why-now.
- Money check per tier with three scenarios, industry CPI range with source (or "chưa có số tham khảo"), break-even CPI, top parameters; missing numbers named.
- Feasibility table with AI guess + Dev question per core capability; `dev-brief.md` Bản 2 holds only new questions, with a dated
  deadline; never more than 3 rounds in total.
- Priority table shows the AI's and the user's view; who chose and when is recorded; meeting brief written if the team decides.
- Stop thresholds from §1 checked; §0 and §7 updated; the user was asked before moving on.
- §5 stays about 120 lines at most: a "Cách làm:" line is one line; sensitivity details that do not change the choice are cut
  or moved to the appendix.
