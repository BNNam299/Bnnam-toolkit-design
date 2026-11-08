# Thinking toolbox — frameworks to reach for, and how to mix them

Each step already has its own method (Need Score, Opportunity Score, three-layer competition, cohort payback…). This file is the
wider toolbox: when the step's own method leaves a question open, pick a tool by the **kind of problem**, and when one tool leaves a
gap, add the one listed under "ghép với". Name every tool you actually used (`writing.md` §9). Tools are for thinking — the output
stays in the step's own sections; never paste a whole canvas when two lines carry the result.

## Contents
1. Read the situation
2. Size without inventing
3. Find the gap
4. Shape the idea
5. Decide under uncertainty
6. Mixing rules — when one tool is not enough

## 1. Read the situation
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **SWOT → TOWS** | the idea's position needs one view of inside vs outside | Strengths / Weaknesses (team, idea) · Opportunities / Threats (market, platform). Then TOWS turns it into moves: S×O use strengths on openings · W×O fix a weakness to take an opening · S×T defend · W×T avoid. A SWOT without TOWS moves is decoration | Porter for the threats, ERRC for the moves |
| **Porter's five forces (app version)** | judging if a category can pay at all | rivalry (how many apps, how close) · new entrants (barrier is low on stores — what keeps copies out?) · substitutes (built-in OS features, web, doing nothing) · buyer power (switching cost ≈ 0, price comparison in one search) · supplier power (Apple / Google rules and fees, AI / API providers). Each force: thấp / vừa / cao + one evidence line | three-layer competition (`market-dig`), economics |
| **PESTEL (light)** | "why now" or a regulation risk | only the letters that matter for apps: policy / law (privacy, AI rules, store policy) · technology (new OS / device capability) · social (a behaviour rising). One external signal with source each | why-now test (fails if true 3 years ago) |

## 2. Size without inventing
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Bottom-up TAM / SAM / SOM** | someone asks "how big" | build from data, never a top-down "$X billion": SAM = downloads of the 5–10 apps doing this job in the target country (tool data) · SOM = a share we can reach in 12 months, stated as an assumption · money = SOM × trial rate × paid rate × price × (1 − store fee). Every factor has a source or "giả định" | economics (`market-score`), scan §2 |
| **Fermi estimate** | no tool data at all | break the number into factors anyone can check (people with the problem × share who search × share who pay), write each assumption, give a range not a point | label "ước tính", list in §7 |

## 3. Find the gap
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Strategy canvas + ERRC (Blue Ocean)** | competitors look alike and we need a different shape, not a better copy | list the 6–8 factors apps compete on (price, library size, AI, speed, privacy…), score each competitor 1–5 → the lines show the crowd. Then ERRC: what to **Eliminate**, **Reduce**, **Raise**, **Create**. A good new line differs on ≥ 2 factors | free-vs-paid matrix, three-layer competition |
| **ODI opportunity score (Ulwick)** | many needs, which is under-served | per outcome: importance 1–10 and satisfaction with today's tools 1–10 → score = importance + max(importance − satisfaction, 0). > 10 worth a look, > 15 strong. Without a survey, estimate from review volume (importance) and complaint share (dissatisfaction), labelled "ước tính" | Need Score, pain clusters |
| **Value Proposition Canvas** | checking the idea really fits the pains | customer side: jobs · pains · gains (from evidence) ↔ product side: pain relievers · gain creators · features. Fit = each top pain has a reliever; a feature with no pain or gain is a cut candidate | JTBD, concept sentence |
| **Pareto 80/20** | too many complaints to read | count complaints per cluster; the few clusters holding ~80% are the ones to design for | pain mining clusters |

## 4. Shape the idea
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Lean Canvas** | comparing 3+ ideas on one page each (step 4) | problem (top 3) · segment · unique value (one line) · solution · channels · revenue · costs · key metric · unfair advantage. Empty "unfair advantage" or "channels" is a finding, not a gap to fill with words | Opportunity Score, economics |
| **Positioning (Moore)** | the idea sentence is vague | "Cho <ai> đang <vấn đề>, <app> là <loại> giúp <kết quả>, khác <đối thủ> ở chỗ <khác biệt>." | concept sentence, ERRC |

## 5. Decide under uncertainty
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Assumption mapping** | many "giả định" and limited time | each assumption: how important (if wrong, does the idea die?) × how much evidence we have. High importance + low evidence = test first (the riskiest assumption) | §7 "cần bổ sung", dev-brief |
| **Pre-mortem** | before deciding "làm tiếp" | "12 tháng sau app thất bại — vì sao?" list 5–10 reasons, mark the ones the research has not ruled out → they become stop thresholds or Dev questions | decide step, thresholds |
| **Inversion** | a plan looks too good | ask "điều gì chắc chắn làm việc này thất bại?" and check we are not doing it | pre-mortem |
| **One-way / two-way door** | a decision feels heavy | reversible cheaply (try, learn) vs hard to undo (decide slowly, with the team). Most market-step decisions are two-way; platform and positioning are closer to one-way | meeting brief |
| **Weighted decision matrix** | choosing among options with several criteria | criteria with weights agreed **before** scoring, each score with evidence; show the arithmetic; equal weights are also a choice | Opportunity Score |

## 6. Mixing rules — when one tool is not enough
| The tool you used | What it leaves open | Add |
|---|---|---|
| Need Score | whether competitors already satisfy the need | ODI score or the free-vs-paid matrix |
| SWOT | what to actually do | TOWS moves, then ERRC |
| Opportunity Score | hidden risks behind a high score | pre-mortem + assumption mapping |
| Competitor matrix | why the gap is still open | "khó / không đáng / chưa nghĩ tới" (`market-dig` competitors §6) |
| Bottom-up size | whether the money works | economics by tier, payback by cohort |
| Review mining | how widespread the pain is | Pareto by cluster, then a number from tools |

If two tools disagree, report both and say which dimension causes the difference; do not average them away.
