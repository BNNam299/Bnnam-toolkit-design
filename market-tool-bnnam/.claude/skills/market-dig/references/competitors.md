# Competitors — who wins, why, and where they are weak

## Contents
1. Choosing competitors
2. Archetypes
3. The per-app block and teardown
4. Free-vs-paid feature matrix
5. Price anchor
6. Three layers of competition and rejected gaps

## 1. Choosing competitors
5–6 apps **in the target country** (how apps charge differs by country): the leaders from step 2, 1–2 newcomers gaining fast, and at
least one non-app way of doing the job (built-in OS feature, web tool, manual process, doing nothing). The team's process: for each
main keyword, take 3–5 apps from the top 1–5 results.

## 2. Archetypes
Group the apps into 3–5 archetypes, e.g. "tất cả trong một nhưng rối", "cao cấp nhưng hẹp", "miễn phí nhưng dày quảng cáo",
"đơn giản, làm một việc thật tốt". The gap is usually visible *between* archetypes, not inside one app. One line per archetype:
apps · what they do well · what they sacrifice.

## 3. The per-app block and teardown
One block per app in §4.4, following the team's research template (Template Research — Cast TV). Every number carries its source,
country and date.

| Part | What to write | Mostly from |
|---|---|---|
| Số liệu | downloads, IAP revenue, avg DAU, revenue per download, minutes per day, sessions per day, rating, launch date, last update | tools (AppStoreSpy / Sensor Tower) + store |
| Màn mở đầu và giới thiệu | splash, onboarding steps, what is promised | hands-on / screenshots |
| Tính năng | what is good and what is different (not a feature list) | hands-on + store + reviews |
| Hiệu năng | min iOS, app size, how smooth (connect time, crashes) | store + hands-on + reviews |
| Giao diện, luồng | main flow, how many steps to the value | hands-on |
| Lý do quay lại | why users come back (or don't) | reviews + retention if available |
| Kiếm tiền | plans and prices, when the paywall appears (before / after the user sees value), trial, ads (types, where) | store IAP list + hands-on |
| Kéo người dùng | keywords they rank for, ads they run (Sensor Tower ad intelligence) | tools |
| Đánh giá người dùng | what is praised / complained about, with evidence numbers | evidence A |
| Nhận xét | one or two lines: what to learn, what to beat | — |

Teardown checklist for hands-on use (the user does it, or sends screenshots to `raw/`): onboarding — how many screens, what it asks;
paywall — before or after the first value moment, which plans, trial length, how to close it; the main flow — steps to the result;
what works well; what breaks. Mark observations as group C evidence with who saw it and when.

Data traps when filling metrics: the tool's revenue per download is often all-time; "avg DAU" is often MAU; retention columns get
mislabelled (`market-standards/references/evidence-and-sources.md` §7).

## 4. Free-vs-paid feature matrix
Purpose: decide which features must exist and which can earn, based on how the market treats them.
1. Take the 5–6 apps of the same type and same target market.
2. For each feature, note whether each app gives it free or locks it — **from hands-on use or screenshots**; the store description does
   not say what is behind the paywall (store-only → "ước tính từ mô tả store").
3. Put every feature (theirs + the idea's) in one of four zones by *how many apps have it* and *free or paid*:

| Zone | Meaning | What to do |
|---|---|---|
| Baseline (free, most apps) | must-have; without it users leave before discovering anything else | must have, free |
| Core premium (paid, most apps) | what the market already sells | the paid tier is built around these |
| Premium differentiator (paid, few apps) | special and different | the place to stand out and sell |
| Niche utility (free, few apps) | serves a narrow group deeply | only if it fits the target user |

4. Read the matrix for two things: **holes** — baseline features the idea lacks (add them, or users leave); **forgotten money** —
   features the idea would give free while the market charges for them (consider locking, unless it is the main reason people download).
5. From the few-apps zones pick 1–2 differentiators.

§4.3 table (≤ 6 columns): feature · how many apps have it · usually free or paid · zone · what we should do. "→ Rút ra" names the holes
and the 1–2 differentiators.

## 5. Price anchor
From the store IAP lists: weekly and yearly price of each app, trial length, intro offers, one-time purchase if any. Find where prices
cluster (e.g. "phần lớn quanh 29,99–39,99 USD/năm"). Note the position the idea could take: at the anchor (parity), under it (conversion
play — not so low it signals low quality), above it (needs a premium story the matrix supports). A one-time purchase option is worth
noting: in the team's remote-TV study, the only competitor with a lifetime plan had the highest value per download.

## 6. Three layers of competition and rejected gaps
1. **Direct apps** — "no competitor" is not automatically good; it may mean no demand.
2. **Non-app alternatives** — built-in OS features, manual work (notes, timers, spreadsheets), doing nothing. Check the built-in
   ones explicitly: a free feature already on every phone can cap the paid market.
3. **Segments competitors miss** — too professional for ordinary users, missing a country or language, too expensive, weak privacy,
   hard-to-read results, only part of the workflow. **Opportunity is usually a forgotten segment, not a new category.**

Also read competitor health: high downloads + low D30 = bought traffic and a product that does not hold users; heavy ad spend + low
retention = a fragile model; no update for months while revenue holds = a slow incumbent.

§4.6 lists gaps considered and rejected, each with the reason and evidence — so nobody re-proposes them without new data.

- **Why has no competitor filled this gap?** Because it is hard, because it is not worth it, or because nobody thought of it. Only
  the first and the last are opportunities; "not worth it" needs a reason we see differently, or the gap goes to the rejected list
  with that reason (so nobody re-proposes it).
## 7. Writing competitor facts
- Three layers, kept apart in every per-app block: **Quan sát** (what a page, the store or hands-on use shows — with source and date) ·
  **Suy luận** (your reading — with confidence) · **Hàm ý** (what it could mean for us — written as a question or option).
- Status of a claim when re-checked: còn đúng (with check date) / đã đổi / không kiểm được / nói quá. Never "còn đúng" without a date.
- Credit competitors' strengths; do not exaggerate their weaknesses.
- **Entry model and paywall**, per app: freemium · free trial (length) · paid trial · hard paywall (pay before use) · one-time purchase;
  where the paywall first appears (first launch / after onboarding / after a first result / at a feature or limit); is there an offer
  when the paywall is closed. This feeds the price anchor and the product toolkit's monetization draft.
- **How they earn, as scenarios** (lesson from the team's monetization teardowns): list each way the app makes money as one line —
  where it triggers, which revenue line (subscription · ads · one-time / lifetime · remove-ads · web checkout), the screen, and how
  sure we are (seen / inferred). Name the revenue lines **not** found too. Worth checking: is there a separate offer for users whose
  plan expired, a cheaper offer after the paywall is closed several times, ads before the user reached any value, how many steps
  before the first paywall. Keep "seen" and "inferred" apart — a static read or the store page cannot prove order or timing.
- **Where they are heading**: new reviews in the last 30 days against their usual pace, and the last change of store screenshots or
  paywall — a competitor changing these is testing a direction (AI, video, a new audience). Note the date seen.
- **Product facts worth comparing** across apps: works offline · account required · steps to the value · minimum OS · update rhythm.
