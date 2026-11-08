# Metric decisions (draft until a measure toolkit exists)

Label prd.md §7 "Bản nháp — sẽ chuyển sang bộ measure khi có". Metrics first, events later (events are listed in `product-spec` and
tied to screens in `product-detail`).

## 1. Three layers
- **North Star — exactly one.** Reflects value the user really receives, not surface activity. Test: if it rises and users gain
  nothing, it is the wrong one. Example: "số người dùng hoàn thành ≥ 3 bài 2 phút trong 7 ngày", not "lượt mở app".
- **Input metrics — 3 to 5** the team can move directly that together push the North Star (aha reach in first session, onboarding
  completion, trial start rate, D7 retention…).
- **Guardrails — at least one** that must not get worse while optimising: refund rate, D1 trial cancel, uninstall rate, crash-free,
  store rating, complaints about being forced to pay.

## 2. Each metric
Name · plain definition · formula (numerator, denominator, time window) · data source · frequency · baseline and target. No real
baseline → **giả định** with the basis (market evidence, team benchmark, scenario target) and "thay bằng số thật sau 4 tuần phát hành".

- **Activation is a behaviour**, not a time window: "hoàn thành hành động cốt lõi ≥ N lần trong M ngày đầu", using the aha moment from
  prd §5 — never redefined here.
- **Say which retention**: classic day-N (D1 / D7 / D30) or rolling; they give different numbers and get compared wrongly.
- Team benchmarks to start from (label "mốc team"): trial start > 6% of installs, trial → paid > 20%, crash-free > 99%, launch < 4 s;
  scenario targets from `monetize-draft.md` §3.

## 2b. UX metrics — HEART
When a version is about experience rather than money, pick from **HEART** and write goal → signal → metric for the ones that matter
(rarely all five): **Hài lòng** (rating, a one-question score after the key task) · **Gắn bó** (sessions per week, core actions per
user) · **Chấp nhận** (share of users who try a new feature in 7 days) · **Giữ chân** (D7 / D30 of users who reached the aha moment)
· **Hoàn thành tác vụ** (share who finish the key task, time to finish, errors). **Time to value** — time or steps from first launch
to the aha moment — is usually the most useful single UX number for a new app.

## 2c. Funnel and metric traps (team metric catalog)
- **Main funnel**, each step defined by one event, with an expected rate: cài → mở lần đầu → xong onboarding → **chạm aha** → xem
  paywall → bắt đầu dùng thử → trả tiền → còn sau kỳ đầu. Order follows AARRR (acquisition → activation → retention → referral →
  revenue).
- A subscription app never picks DAU as its North Star (it rises while revenue falls); use it as a guardrail. **Core-action frequency**
  ("% người làm hành động cốt lõi ≥ N lần / tuần") usually beats DAU. Stickiness = DAU ÷ MAU; under 10% means opened and abandoned.
- Time to value uses the **median**, not the mean. Onboarding completion high but activation low = a long, useless onboarding.
- Retention on a fixed day (D7) and within a range (day 7–14) differ — say which. A **monthly cohort table** is the only way to see
  the product getting better or worse; if the retention curve never flattens above 0, optimising anything else is pointless.
- Trial → paid is measured after the trial ends, not early. Split churn into voluntary and failed payment.

## 3. Vanity check
For each metric ask: "if this doubles and nothing else changes, is the business better?" No → drop it (total downloads, total screen
views, total accounts).

## 4. Per version
Each version row in §13 names the 1–3 metrics that decide whether it worked, and what result would make the team roll back or change
direction. After release, the next `product-plan` run reads these first.

## 5. Team metric sheet
The team's "Bộ chỉ số đo lường" sheet tracks per version: content of the update · metric · definition · current · expected · actual ·
Đạt / Chưa đạt. Keep the same columns when the user asks for a sheet-ready block.
