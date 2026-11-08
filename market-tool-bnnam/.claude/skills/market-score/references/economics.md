# "Có lời không" — money per download vs cost per download

A rough check, not a forecast. Before launch there is no observed value for anything, so the goal is to know **in which country tiers
buying users could pay off, under which assumptions, and which parameters matter most** — not to promise a number. Method from the
team's iOS LTV report (F1, v7, 09/2026).

## Contents
1. What to compare
2. Estimating money per download
3. Cost per download (CPI) references
4. The §5.3 table
5. Sensitivity — what moves the result
6. Team benchmarks
7. Pitfalls

## 1. What to compare
- **LTV (tổng tiền một người dùng mang về)** of a group of users who install in the same month, over 12 months, **net** (after store
  fees and refunds), split by tier: **T1** (US, UK, CA, AU, DE, JP, KR, Nordics) and **T3** (BR, MX, TR, ID, PH, VN, TH, EG, ZA…).
- **CPI (tiền mua một lượt tải)** in the same tier.
- **Break-even CPI** = LTV — the highest price per download that does not lose money. **CPI for LTV/CPI = 2** = LTV ÷ 2 — a common
  safety target.

## 2. Estimating money per download
Use whatever data exists, label the method, give three scenarios (thận trọng / giữa / mạnh tay).

**a. From competitors' tool data (most common in this step)**
- Monthly revenue ÷ monthly downloads = money per *new* download this month. It includes renewals from older users, so it overstates
  value for apps whose downloads are shrinking and understates it for growing ones. Use it to compare apps, and say which direction
  each app is moving.
- The tool's own "revenue per download" is often the app's all-time average — not this month's.
- In the team's remote-TV study, about **50% of 12-month revenue arrives in the first month** (five apps: 43–53%). So a first-month
  net revenue per download ×~2 gives a rough 12-month LTV for subscription/IAP. State this as the basis.

**b. From prices and conversion (subscription)**
- LTV ≈ share of installs who pay × ARPPU (tiền trung bình thu từ một người trả tiền) over 12 months.
- For a monthly subscription: LTV of a payer ≈ monthly price (net) ÷ monthly churn (% bỏ gói mỗi tháng).
- From list prices, net ≈ list × ~0,65 (team convention: store fee, taxes, refunds). **Never apply it to revenue that is already net**
  — check what the tool reports.
- **Store fees changed — check the convention.** Snapshot 10/2026 (verify current terms): Apple 15% for Small Business Program
  members (< 1M USD/year), otherwise 30% in a subscriber's first year and 15% after; Google Play (US, UK, EEA from 30/06/2026) 10% + 5%
  billing. If ×0,65 covers only the store fee it may now understate net revenue; if it also covers tax and refunds it may still hold.
  Until the team confirms, use ×0,65 and say in §7 which factor would change the verdict.
- Per-download formula for a trial-led subscription: money per download ≈ trial start rate × trial → paid × yearly price × (1 − fees).
  Outside reference (RevenueCat State of Subscription Apps 2026, cited by Marketing Skills — not a team benchmark): hard-paywall apps
  convert ~5× more users to paid in 35 days than freemium, with similar one-year retention of yearly subscribers; trials ≥ 17 days
  convert better than ≤ 4 days but cash arrives later.
- Paying share seen in the remote-TV study (implied from prices): ~2% to ~10% across three apps — a wide range, which is why
  scenarios are needed.

**c. Ads**
Monthly ad revenue = DAU × 30 × ad impressions per DAU per day × eCPM ÷ 1000. Scenarios: thận trọng 3 impressions and eCPM 3 USD ·
giữa 6 and 5 · mạnh tay 10 and 8. Ad money is already net. Ad revenue follows active days, so it depends on retention: a user who
stays ~5 active days in 12 months cannot carry much ad revenue. Check that "DAU" is really DAU, not MAU.

## 3. Cost per download (CPI) references
The team has **no UA person**, so nobody can hand over a CPI. Get the range yourself and turn the question around:
- **Find published CPI benchmarks** for the category × platform × country (or tier), 2025–2026 only — e.g. reports or benchmark pages
  from AppsFlyer, Liftoff, Adjust, Business of Apps. Record each as an evidence entry (source, period, country, platform, category,
  and whether it is CPI or cost per trial / per payer). Show a **range (low – high)** labelled **"tham khảo ngành"** — never as the
  team's CPI. Two sources disagreeing → show both ends.
- **iOS utility apps in T1: 1,5–4 USD** per install (team LTV report, 09/2026) — the only team number, and **only for utility apps**.
  Never reuse it for another category.
- No usable benchmark for the category or tier → write "chưa có số tham khảo", say which verdict that leaves open, and add it to §7.
- **Say it in one plain sentence the team can decide on**: "Mỗi lượt tải được phép tốn tối đa <trần CPI hoà vốn> mà không lỗ; báo cáo
  ngành cho dòng app này ở <nước> là <thấp – cao> → <mua lượt tải nhiều khả năng lỗ / có cửa / chưa rõ>; muốn có lời thì dựa vào
  <tìm kiếm trên store / cách bán tốt hơn / …>." No exact CPI is needed for this decision.
- Store search (ASO) brings installs without CPI; if the idea can win search for its keywords (step 2), note that paid acquisition is
  not the only way in. Full ASO and UA work belongs to a later growth toolkit — here only "can we get in through search" and "does
  buying installs pay".

## 4. The §5.3 table
| Nhóm nước | Tiền thu / lượt tải (thận trọng – giữa – mạnh tay) | CPI tham khảo ngành (nguồn) | Trần CPI hoà vốn | Đánh giá |
|---|---|---|---|---|
| T1 | 0,6 – 1,0 – 1,6 USD | 1,5 – 4 USD (tham khảo ngành, <nguồn>, 2026) | ~1,0 USD (mức giữa) | lỗ nếu chỉ mua quảng cáo; cần search / cách bán tốt hơn |
| T3 | 0,13 – 0,18 – 0,27 USD | chưa có số tham khảo | ~0,18 USD | chưa kết luận — thiếu khoảng CPI ngành cho T3 |

(Numbers above only illustrate the format.) "→ Rút ra" says in which tier the idea can pay off, what it depends on, and which missing
number would change the conclusion.

## 5. Sensitivity — what moves the result
Instead of defending one LTV, show which parameters change it most: move each across a realistic range while holding the others at the
middle, and rank by how much LTV moves. In the team's remote-TV study:
- **T1**: the subscription funnel dominates — trial start rate, trial → paid conversion, share of users reaching the value moment.
- **T3**: ads and retention dominate — D30 retention, one-time purchase (lifetime / remove ads), eCPM.
- D1 retention barely mattered in either tier.
The ranking was stable even when the middle values were corrected — that is the point of the method. Use it to say where the product
should invest first, per tier. A full sensitivity model is optional in this step; at minimum name the top 3 parameters per tier and why.

Also worth stating: in that study, three apps of the same type in the same top countries differed ~3× in value per download — **how
the app sells decided it, not the market** (the leader had a one-time purchase and closed the sale in the first session). The money
model also depends on **which countries the users are bought in**.

## 6. Team benchmarks (internal, iOS)
Use as reference lines, labelled "mốc nội bộ team":
- install → trial start > 6%
- trial → paid > 20%
- crash-free users > 99%
- app launch < 4 s

## 7. Pitfalls
- A single blended LTV across tiers.
- Applying the 0,65 store factor to revenue that is already net.
- Using "avg DAU" that is actually MAU for ad revenue (8–17× too high).
- Treating this month's revenue ÷ downloads as cohort LTV for a shrinking app.
- Concluding "có lời" without a CPI for the tier — write "chưa kết luận — cần CPI <tier>" instead.

## 8. Payback — how long cash is tied up
Break-even CPI says whether a download pays back at all; payback says **when**.
- Payback (months) = CAC ÷ (monthly ARPU × gross margin). Maximum CAC = target months × monthly ARPU × gross margin.
- For subscriptions use **cumulative recovery by cohort**: add monthly net revenue per original user (already counting who is left)
  month by month; the first month the total reaches CPI is the payback month. Two cohorts with the same 12-month retention can pay back
  in month 4 or month 6 depending on whether users leave early or late — one blended ratio hides that.
- Do not average ARPU across very different plans (weekly vs yearly); compute per plan. Trials and yearly plans move cash later.
- If the data cannot show payback yet, write "chưa hoàn vốn / chưa đủ dữ liệu" — never guess a month.
