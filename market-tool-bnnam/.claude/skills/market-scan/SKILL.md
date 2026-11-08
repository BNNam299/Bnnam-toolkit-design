---
name: market-scan
description: Step 2 of the market toolkit - a quick scan that decides whether an app market is worth digging into before any deep work. Looks at the size and direction of the app group (download and revenue scale of the leading apps, 3-month and 12-month trend, share of the top 3, whether new apps still break in), the 2–3 main keywords (search volume, difficulty, trend over 90 days / 12 months / 5 years), real demand vs a passing trend, and checks the stop thresholds set in step 1; fills market-report.md §2 and stops early if the market is not worth it. Use after market-kickoff, or whenever the user asks how big an app category is, whether it is growing or dying, whether a newcomer still has room, or wants a fast first look at a keyword or niche before committing time. Vietnamese triggers such as "quét nhanh thị trường", "dòng app này lớn cỡ nào", "đang lên hay xuống", "còn chỗ cho app mới không", "xem nhanh keyword", "có đáng làm không".
---

# market-scan — step 2: is this market worth digging into?

A deep dig costs days. A scan costs an hour and can save them: if the market is closed, shrinking, or only a passing trend, stop here.
The scan is deliberately shallow — enough to decide *dig or stop*, not to understand users (that is `market-dig`).

**Read first:** `../market-standards/SKILL.md`. Runs straight through; stops for the user only if the result hits a stop threshold or
looks not worth digging.

## Need → Read
| Need | Read |
|---|---|
| Which apps to look at, what to measure, how to frame size without "billion-dollar" numbers | `references/scan.md` §1–2 |
| Keywords: five directions, three time frames, what to record | `references/scan.md` §3 |
| Real demand vs passing trend; signs a group is about to grow | `references/scan.md` §4 |
| Writing the conclusion and checking stop thresholds | `references/scan.md` §5 |
| Outside reference numbers (store conversion, rating floor) — context only | `references/scan.md` §6 |
| Sources and the AppStoreSpy connection prompt | `../market-standards/references/data-sources.md` §1–3 |
| Evidence entries, labels, dates | `../market-standards/references/evidence-and-sources.md` |

## Workflow
1. **Check step 1.** §1 of `docs/market/market-report.md` must have the entry point, constraints and stop thresholds. Missing → apply
   the missing-data rule from `market-standards` (say what is missing, ask, continue on marked assumptions or stop).
2. **List 5–8 apps** of the group from the App Store (search the main keywords, category charts, "best … apps" lists): leaders,
   newcomers gaining fast, 1–2 indirect alternatives.
3. **Get scale and direction.** Store pages first (ratings count, update dates, prices). For downloads/revenue trend: if AppStoreSpy
   can help, **stop and ask the user to connect it** (prompt in `data-sources.md` §3); otherwise use the user's exports in `raw/`, or
   estimates from rating counts, clearly labelled. Do not hand over the full Sensor Tower request yet — that comes in `market-dig`;
   only ask now if a stop threshold cannot be checked without it.
4. **Keywords**: 2–3 main keywords — volume, difficulty, who ranks top, trend over 90 days / 12 months / 5 years (`references/scan.md`
   §3).
5. **Demand vs trend** check (`references/scan.md` §4).
6. **Write §2** with the comparison table (≤ 6 columns, derived numbers, "→ Rút ra"), keyword lines, room-for-newcomers line, demand
   vs trend line, and the step conclusion compared with each relevant stop threshold. Add evidence entries. Update §0.
**Reader copy first:** carry any hand edits from `docs/market/reader/` into the working file, then rewrite `docs/market/reader/market-report.md` for the current state (`market-standards/references/reader-copy.md`; md only — no docx until the end); the reply points the user to the reader md.
7. **Decide the next move.** Worth digging → say so and point to `market-dig`. A stop threshold is hit, or the market looks not worth
   it → stop and ask the user: dừng / đổi hướng (another keyword, another tier, a narrower segment) / vẫn đào tiếp (recorded as the
   user's choice, with the reason).

## Core rules
- **Trend over totals.** Whether the group is rising or falling, and whether new apps still break in, matters more than any absolute
  number — tool estimates for small apps can be off by several times.
- **High downloads ≠ a good market.** Read downloads together with revenue per download and, when available, D30 retention.
- **Size in downloads and revenue of the leading apps**, never in consultant "market worth $X billion" figures.
- **Many apps rising together is a good market; one app taking everything is not.**
- **Shallow on purpose.** No review mining here beyond a glance; no competitor teardown.

## Self-check before reporting
- 5–8 apps listed with source; each number tagged (tool / store, country, month, ước tính / chắc).
- The table has derived numbers (trend %, revenue per download, top-3 share) and a "→ Rút ra" line.
- Keywords with three time frames; room for newcomers answered with evidence.
- Conclusion states dig / stop against the step-1 thresholds; assumptions added to §7.
- §0 updated; next step named.
