# Scoring and choosing the idea

## Contents
1. Need Score — filter the clusters
2. Opportunity Score — rank the ideas
3. Writing ideas
4. Action groups
5. Why now
6. The chosen idea as an opportunity canvas
7. The priority table — AI's view and the user's view

## 1. Need Score — filter the clusters
Score each need cluster from §3 on seven criteria, 1–5 each. Keep clusters with **≥ 25/35**.

| Criterion | Question | Evidence that supports a high score |
|---|---|---|
| Tần suất | does it happen often? | "every day I have to…", daily-use apps |
| Mức đau | annoying enough to fix now? | angry 1★ reviews, "ruined", refunds |
| Tìm kiếm | do people actively search for it? | keyword volume, "is there an app for" |
| Đang xoay xở | do they already pay or spend time on a workaround? | spreadsheets, manual steps, several tools |
| Trả tiền | can and will they pay? | revenue per download of competitors, "I'd pay for" |
| Quay lại | is there a reason to use the app again? | recurring problem, retention of competitors |
| Hợp team | can the team build it better than others? | team strengths from §1 |

Every score cites evidence numbers or is marked "giả định — cần <dữ liệu>". A table scored without research is illustrative and must
say so.

Strongest signals — if present, they justify a high score: spreadsheets · copying data by hand · many reminders · paying several tools
for one job · complex workarounds · constant tutorial searching · accepting a bad app for lack of choice · "hate it but still use it".

## 2. Opportunity Score — rank the ideas
Score each idea 1–5 per factor, then weight:

| Factor | Weight |
|---|---|
| Nhu cầu tăng (demand growth) | 25% |
| Kiếm tiền (monetization) | 20% |
| Khoảng trống cạnh tranh (gap) | 20% |
| Dùng lặp lại / giữ chân (repeat use) | 15% |
| Lợi thế phân phối (easy to advertise / search) | 10% |
| Lợi thế build của team | 10% |

Opportunity Score = Demand×0,25 + Money×0,20 + Gap×0,20 + Repeat×0,15 + Distribution×0,10 + Build×0,10.
§5.2 table keeps ≤ 6 columns: idea · for whom / what it solves · the three heaviest factors · total; put the full scoring under the
table if needed. Close with "→ Rút ra".

## 3. Writing ideas
One sentence per idea:
```
Cho <ai> đang khổ vì <vấn đề> trong <hoàn cảnh>, app giúp <kết quả> bằng <cách riêng>.
```
- A strong cluster gives 5–10 ideas; write at least 3 overall, never stop at the first.
- Solve the *need* from §3, not the requested feature.
- Avoid the hot-category trap: "an AI app" is not an idea; "dùng AI biến truyện ngắn thành bài vẽ đồ theo được cho người mới tập vẽ"
  is. AI is the mechanism, not the value.
- Each idea names which §4 gap it uses (a forgotten segment, a baseline hole, a differentiator from the matrix).

## 4. Action groups
Sort ideas into:
1. high demand + gap still open → **làm thử ngay**
2. high demand + strong competition → needs a strong difference
3. lower demand + good money → niche opportunity
4. growing only because of a short trend → watch, do not build yet
5. high downloads + low retention in the group → avoid

## 5. Why now
A strong why-now has at least one of these, with evidence:
- behaviour shift (a usage pattern newly mainstream)
- technology unlock (something recently became cheap or possible: on-device AI, a new OS API…)
- competitive signal (new focused apps gaining fast — demand outrunning incumbents)
- distribution window (store policy change, new surface such as widgets or lock screen)
- gap persistence (the archetype map in §4.2 shows an empty middle)

Test: would this sentence have been equally true three years ago? If yes, it is not a why-now.

Platform facts (when an OS feature, API or surface appeared) are not dated from memory: cite a source, or write the claim as a
question for Dev. A widget or lock-screen surface that has existed for years is not a "new distribution window".

## 6. The chosen idea as an opportunity canvas
Write the chosen idea in §5 with these lines (short, each with evidence numbers):
- **Vấn đề**: who (persona type) · the problem · the pain.
- **Thay đổi nhỏ nhất đủ dùng**: the smallest product that tests the idea; what is out of scope for it; what makes it different; the
  likely next step if it works.
- **Đo gì**: the 1–2 numbers that would say it works.
- **Giả định + cách kiểm**: the assumptions the idea stands on and how each will be checked (this feeds §7).

**Sensitivity of the ranking**: state which weight or single score, if changed, would swap the top two ideas ("nếu điểm Kiếm tiền của
Ý2 lên 4 thì Ý2 vượt Ý1"). If a small change flips the ranking, say the choice is close.

## 7. The priority table — AI's view and the user's view
The user runs this toolkit and is the lead; the choice of idea is theirs, alone or with the team. Show the ranking so they can disagree
in one glance, and keep both views on record:

| # | Ý tưởng | Opportunity Score | AI xếp | <Tên> xếp | Vì sao khác (nếu khác) |
|---|---|---|---|---|---|
| 1 | … | 4,1 | 1 | 2 | <một dòng> |

- Fill "AI xếp" from the scores; ask the user for their order (they may say "giống AI"). Never fill the user's column yourself.
- Under the table: "→ Rút ra:" which idea goes to the in-depth check, and who decided (the user / the team meeting, date).
- Taken to the team → the same table goes into `meeting-brief-b4.md`; the outcome is written back here, not only in the brief.

