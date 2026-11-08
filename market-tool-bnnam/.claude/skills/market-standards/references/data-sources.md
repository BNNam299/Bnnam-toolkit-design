# Data sources — who fetches what, and the data request

A new PO rarely knows what a market-intelligence tool can show, so they either fetch too little or fetch a pile of numbers that feeds
no conclusion. And when the AI cannot open a tool, it asks for numbers one at a time across many turns. The fix: use every source the
AI can open first, work out exactly what is still missing, then hand the user **one** request listing each number, the question it
answers and where to save it.

## 1. Source map
| Source | Who fetches | Gives | Confidence |
|---|---|---|---|
| App Store page | AI | description, screenshots, prices of plans (In-App Purchases list), rating and rating count, update history, size, min iOS | chắc — published |
| Store reviews | AI | verbatim complaints and praise, by version | high for wording, low for proportions |
| Reddit, forums, YouTube / TikTok comments | AI | real user language, manual workarounds | trung bình |
| Google Trends | AI | relative interest over time, seasonality — not volume | trung bình |
| **AppStoreSpy** | AI, **after the user connects it** | rankings, estimated downloads and revenue, update history, keyword ranks | ước tính |
| **Sensor Tower** | **the user, by hand** | downloads and revenue by country, retention, session length, DAU/MAU, ad spend and creatives, keyword volume | ước tính — usually the strongest of the tools |
| Public company reports | AI | real numbers for listed companies | chắc |
| Published CPI benchmarks (AppsFlyer, Liftoff, Adjust, Business of Apps…) | AI | CPI range by category × platform × country — the team has no UA person, so this replaces asking one | tham khảo ngành |
| Hands-on use of competitor apps | **the user** (AI cannot install apps) | onboarding steps, when the paywall appears, what is free vs locked | chắc for that build and date |

## 2. Order — do not reverse it
1. **Store pages, reviews, communities** — free, verbatim, feed the needs section.
2. **AppStoreSpy** — confirm the real competitor set and their rankings.
3. **Hands-on use** of 3+ competitor apps by the user (or screenshots in `raw/`) — no tool replaces it; the store never says what
   sits behind the paywall.
4. **Only then the Sensor Tower request** — only now do you know which apps, which countries and which questions. Asking before step
   3 is asking blindly.

## 3. AppStoreSpy — the connection prompt
The user can connect AppStoreSpy (a browser session or connector they control). When `market-dig` (or `market-scan`) reaches the point
where it needs it, **stop and ask**:
```
Tới bước lấy số từ AppStoreSpy. Bạn kết nối giúp mình (mở phiên đăng nhập / bật kết nối), rồi nhắn "đã kết nối".
Nếu chưa kết nối được, mình ghi các số này là "chưa có số" và đưa vào phiếu xin số liệu.
```
Never ask for, type, or store the password. If the connection works, take only the metrics the current step needs, record each as an
evidence entry (tool, country, period). If it does not, continue and list the gap.

**Keywords (the team has no ASO person):** once connected, check whether the account shows keyword search volume or popularity, not
only ranks. If it does, take volume, difficulty and the top-ranking apps for the 2–3 main keywords from AppStoreSpy and drop that line
from the Sensor Tower request. If it does not, keep "keyword volume, difficulty" on the Sensor Tower request (Group 3).

## 4. Sensor Tower — what to request and why
Do not request everything. Each line must name the question it answers and the report section it feeds; a number without a question
only dilutes the report.

### Group 1 — Size: is the market big enough, and is it growing?
| Metric | Question it answers | Feeds |
|---|---|---|
| Downloads / month, last 12 months, top 5–8 competitors | how big, rising or falling (the trend matters more than the total) | §2, §4 |
| Revenue / month, same apps and period | do users pay; revenue ÷ downloads = rough money per download | §4, §5 |
| Downloads and revenue split by country | which country tier to target | §2, §5 |
| New apps launched in the last 12 months + their first-month downloads | is there still room for a newcomer | §2 |

### Group 2 — Competitor health: where are they weak?
| Metric | Question | Feeds |
|---|---|---|
| Retention D1 / D7 / D30 | do users come back? High downloads + low D30 = bought traffic, product does not hold users → gap | §4 |
| DAU / MAU, session length, sessions per day | how often people really use it | §4, §5 |
| User overlap between apps | high overlap = users have not found a good enough app | §4 |

### Group 3 — Money: what do they charge, how do they acquire users?
| Metric | Question | Feeds |
|---|---|---|
| Plans and prices by country | the price anchor of the market | §4 |
| Revenue share by plan (week / month / year / lifetime) | which plan really earns | §5 |
| Ad spend, networks, top creatives | how expensive it is to pull users; heavy spend + low retention = fragile model | §4, §5 |
| Keyword volume, difficulty, who ranks top (for 2–3 main keywords) — skip if AppStoreSpy already gave volume | can we get in through search | §2 |

### Group 4 — only when a specific question needs it
SDKs, renaming history, specific creative details. Do not fetch in advance.

Mark each line **bắt buộc** (the step cannot conclude without it) or **tốt nếu có**, so the user knows what may stay empty.

## 5. The request (appendix of market-report.md)
Write it as the report's appendix "Phiếu xin số liệu", one table, ticked as the user returns data:

| ☐ | Lấy gì (app · nước · kỳ) | Để trả lời câu hỏi gì | Mức | Lưu vào |
|---|---|---|---|---|
| ☐ | Tải + doanh thu theo tháng, 12 tháng, app A–E · US | Thị trường lớn cỡ nào, lên hay xuống | bắt buộc | `raw/st-downloads-revenue-us-2026-10.csv` |

Then a short "Cách lấy" block in plain words: which screen in the tool, which filter (country, period), export as CSV/XLSX when
possible, screenshot only when export is not possible (and keep chart number labels visible). File names:
`raw/<tool>-<what>-<country>-<yyyy-mm>.<ext>` (tool: `st` Sensor Tower, `ass` AppStoreSpy).

Also list hands-on tasks for the user in the same appendix ("Việc bạn tự làm"): try 3 competitor apps — screenshot onboarding, the
first paywall, and note which features are locked.

When the user says the data is in: read it (see `evidence-and-sources.md` §5), report which sections it will fill and any conflict
with earlier data, then fill. Never edit the files the user filled. A required line left empty → mark "chưa có số", continue only if
the user agrees, and add it to §7.
