---
name: market-dig
description: Step 3 of the market toolkit - the deep dig in one pass. Mines real user words (store reviews, Reddit, forums, video comments), records each quote both as a user pain and as a competitor weakness, groups pains into need clusters with independent-source counts, analyses 5–6 competitors in the team's research template, builds the free-vs-paid feature matrix and the price anchor, prompts the user to connect AppStoreSpy and hands over ONE data request for Sensor Tower and hands-on app checks; fills market-report.md §3–4 and the appendix, appends to evidence.md. Use after market-scan, or whenever the user asks for competitor analysis, review mining, user pain points, what is free vs paid in competitor apps, a competitor teardown, or what to pull from Sensor Tower. Vietnamese triggers such as "đào sâu", "phân tích đối thủ", "đọc review", "người dùng chê gì", "nỗi đau người dùng", "tính năng nào miễn phí", "cần lấy số gì từ Sensor Tower".
---

# market-dig — step 3: what users suffer and where competitors are weak

Reading reviews twice — once for pains, once for competitor weaknesses — doubles the work and splits the evidence. Here every review is
read once and recorded both ways. The step runs straight through and stops **once**: to connect AppStoreSpy and hand over the data
request.

**Read first:** `../market-standards/SKILL.md` (writing, evidence, missing-data rule).

## Need → Read
| Need | Read |
|---|---|
| Where to mine, seed phrases, Reddit queries and subreddits, complaint types, minimum counts | `references/pain-mining.md` §1–4 |
| Recording a pain (said vs needed), grouping into clusters, counting independent sources | `references/pain-mining.md` §5–6 |
| Reading pains honestly: quote vs finding, did vs says, disagreeing sources, frequency × impact, confidence | `references/pain-mining.md` §7 |
| Choosing competitors, archetypes, the per-app block (team template), teardown checklist | `references/competitors.md` §1–3 |
| Free-vs-paid feature matrix, gaps and "forgotten money", price anchor, 3-layer competition | `references/competitors.md` §4–6 |
| Writing competitor facts: observed / inferred / implication, claim status, entry model and paywall position | `references/competitors.md` §7 |
| Which source gives what, AppStoreSpy prompt, the Sensor Tower request and hands-on tasks | `../market-standards/references/data-sources.md` |
| Evidence format, labels, reading `raw/` files, data traps | `../market-standards/references/evidence-and-sources.md` |
| Table rules and the "→ Rút ra" line | `../market-standards/references/writing.md` §6–7 |

## Workflow
1. **Check steps 1–2.** §1 (idea, constraints, thresholds) and §2 (app list, conclusion "đào tiếp") must exist. Missing → apply the
   missing-data rule (say, ask, continue on marked assumptions or stop).
2. **Pick 5–6 competitors** in the same target country (`references/competitors.md` §1), at least one manual / non-app way of doing
   the job.
3. **Mine in one pass** (`references/pain-mining.md`): reviews of these apps (1–3★ recent first, plus 5★ for what to keep), Reddit and
   communities, video comments. Every quote → one evidence entry tagged with its pain cluster *and* its app. Record dead ends.
4. **Public data first**: store pages for every competitor (plans and prices, update history, size, min iOS, rating count).
5. **Stop once — data.** Ask the user to connect AppStoreSpy (prompt in `data-sources.md` §3) and take what you need. Then write the
   appendix "Phiếu xin số liệu" — only the Sensor Tower lines and hands-on tasks still needed, each with its question, level
   (bắt buộc / tốt nếu có) and file name in `raw/`. Present it and wait. If the user wants you to go on without it, continue with
   "chưa có số" and add the gaps to §7.
6. **When the data comes back**: read `raw/` files (scripts for CSV/XLSX), check the three data traps, add evidence entries, tick the
   appendix lines.
7. **Write §3** (pain clusters table + what users praise + workarounds + demand vs trend) and **§4** (comparison table, archetypes,
   free-vs-paid matrix, one block per competitor, price anchor, gaps considered and rejected). Update §0 and evidence.md's quick-read
   line.
**Reader copy first:** carry any hand edits from `docs/market/reader/` into the working file, then rewrite `docs/market/reader/market-report.md` for the current state (`market-standards/references/reader-copy.md`; md only — no docx until the end); the reply points the user to the reader md.
8. **Report**: the 2–3 strongest pains and gaps with evidence counts, what data is still missing, next step `market-score`.

## Core rules
- **Verbatim or nothing.** A pain without a user's own words and a link is a guess. Keep the original language.
- **What users say ≠ what they need.** Record both; the need column drives the ideas in step 4.
- **Count independent sources, not quotes.** A cluster stated as a finding needs ≥ 2 independent sources; one viral thread is a weak
  signal.
- **Minimums** (serious run): ≥ 30 pain quotes from ≥ 3 source types · ≥ 40 reviews from ≥ 2 apps including praise · 5–6 competitors
  · ≥ 3 apps tried hands-on (by the user or via screenshots). Below the minimum → say so in §3 and in the quick-read line.
- **The store does not say what is behind the paywall.** Free-vs-paid must come from hands-on use or screenshots; from store text
  alone it is "ước tính từ mô tả store".
- **Every number leads somewhere.** The comparison table answers "where is the opening"; the per-app blocks hold the details.
- **Borrow insight, not content.** Record competitors' structure and weaknesses; do not copy their names, copy or assets into ideas.

## Self-check before reporting
- Evidence: minimums met or the shortfall stated; every quote verbatim with link and date (2025+); dead ends recorded.
- §3: clusters with "really needs", evidence numbers, independent-source counts, "→ Rút ra".
- §4: comparison ≤ 6 columns with derived numbers; archetypes; free-vs-paid matrix; one block per competitor with sources; price
  anchor; rejected gaps.
- Appendix: every line has a question, level and file name; ticked lines match files in `raw/`.
- Assumptions in §7; §0 updated; next step named.
