# Detail method — enough to build

## 1. Screen rules table (per FEAT, team "Design & Product Rule" format)
One table per screen of the feature, rows in the order a user meets the components:

| Màn | Thành phần | Làm gì | Quy tắc | Mặc định |
|---|---|---|---|---|
| Kết nối TV | Nút Tải lại | quét lại TV cùng wifi | bấm → danh sách về trạng thái ban đầu, quét lại tối đa 15 giây | bật |

- **Thành phần**: as named in the design (button, toggle, list, card, field); one row each, icons included.
- **Quy tắc**: deterministic and testable — timing, limits with reset, what happens on each state, what is disabled when.
- **Mặc định**: on / off / value / hidden — never blank.
- Keep the rule about behaviour; the visual belongs to Figma (link the frame in the block, no pasted images as the only content).

## 2. Other cases (per FEAT)
| Màn | Trường hợp | Hành động |
|---|---|---|
| Kết nối TV | quá 15 giây chưa thấy TV nào | hiện hướng dẫn kiểm tra cùng wifi + nút Thử lại |

Go through every branch written at *Đủ để thiết kế* (permission denied / permanently, offline, errors, empty, limit reached, trial
ended, app killed and reopened) and state, per screen, what the user sees and can do.

## 3. Onboarding screen by screen (prd.md §12)
Per screen: **mục tiêu màn** · tiêu đề và mô tả (real copy from the design, or marked "chờ ux-writing") · câu hỏi chính · lựa chọn ·
microcopy trấn an ("Bạn có thể đổi lại sau") · CTA chính / phụ · **dữ liệu cần thu** (choice, time to decide, drop at this step) ·
event. Then: what later screens personalise from the answers · drop-off points to watch by behaviour · questions still open.
Permission screens: the explanation before the system dialog and the path when denied (sample / demo, re-ask at key moments).

## 4. Monetization detail (prd.md §8, requirements §7)
- **Plans by country** in the team's IAP sheet format: product ID · plan name · price · localised price by country · discount / trial ·
  type (subscription / non-consumable / consumable) · note. Prices researched per country follow the team guide: top 5 competitors in
  that country (AppStoreSpy), their plans and offers (Sensor Tower) — the user fetches these; never invent localised prices.
- **Placements**: each paywall placement with its trigger, the scenario (KB…) it implements, headline / benefits / plans shown,
  downsell on close (frequency cap), where cancel is explained.
- **8 transaction states** (success, failed, pending, cancelled mid-way, refunded, expired, renewal failed, restore): what the user
  sees, screen, event, AC.
- **Ads**: placement · screen · type · what the user gets · max frequency · has the user already seen the value here (never at the
  first touch of a feature) · which tier sees ads.
- **A/B tests**: hypothesis "tin rằng … sẽ khiến … vì …" · variants · main metric and **guardrail** · **kill rule set before
  starting** · remote config key · no two tests on the same flow at once · metrics by role: chính (decides), phụ (to understand),
  rào chắn (must not worsen), kinh doanh (payer conversion, revenue per user) · sample size counted on users who actually reach the
  tested screen, not all traffic · no test without a hypothesis. Matches the team's A/B sheet columns.
- **Dark-pattern check**: every line in `quality-gates.md` §5 marked pass.
- **Config table** in the team's Firebase / Qonversion sheet format: Key · Type · Country · Value · Description. Every row marked
  "config" in the §8 branch table becomes a key with its default value; fixed rules are not keys. Dev owns the key names.

## 5. Events and acceptance criteria tied to screens
- Complete requirements §6: each event with its screen, trigger moment, properties, metric / funnel step; include the chosen
  scenario's required events and the "never forget" groups.
- Every metric in prd §7 computable from ≥ 1 event; every event serves a metric or funnel step — delete the rest.
- Each FR gets its screens and final AC (Given / When / Then on a named device); requirements §7 filled for the easy-to-miss groups.
- Rule rows in §1 and cases in §2 are the main source of AC — each testable rule becomes at least one AC.
- **Tag every AC with who checks it** — the team has no tester: **[Lead kiểm]** for what is seen (UI, copy, screen states, empty /
  error / permission screens, paywall content) and **[Dev kiểm]** for what happens underneath (logic, limits and resets, data,
  permissions behaviour, purchases and restore, events firing). An AC that needs both is split in two. Each person can then read only
  their own lines.

- **[Lead kiểm] on a build**: the lead checks UI lines with the team's usability scale (design toolkit `ux-review-handoff`): five
  parts — dễ học lần đầu, hiệu suất, dễ nhớ, lỗi và cách sửa, hài lòng — each finding scored 4 (ổn) · 3 (chưa tốt, sửa hoặc không) ·
  2 (khá nặng, cần sửa) · 1 (rất nặng, sửa sớm) · 0 (không sửa thì không dùng được). Findings 0–2 go back to the version as fixes.
  Redo the spec's walkthrough on the real screens; a step that scores low **and** shows a big drop in the data after release is a
  confirmed problem, not a guess.

## 6. Export and hand-off
Run the full review, then export prd.md and requirements.md. The **md files are the source** — Dev's agent reads them directly; the
`.docx` in `export/` is for people and is regenerated after every md change (never edited by hand). In the report list: files to send
(`export/*.docx` for people, `.md` for Dev's agent), open questions with owners, DQs still unanswered, the retest scope of this
version (prd.md §13), and for the build toolkit the FR / UC ranges of this version.

## 7. Paywall content and the submission checklist
Each placement's paywall has: a benefit headline ("Mở <tính năng> để <lợi ích>") · a demonstration of value (preview, before / after) ·
what the paid plan adds compared with now · price — yearly first with its billed amount and period · social proof only if verifiable ·
a specific CTA · a visible way out ("Để sau" / "Dùng bản miễn phí"). Frequency: cap per session, cool-down in days, never mid-flow or
right after a dismissal. Trial: reminders before it ends. Then tick the paywall checklist in
`../product-standards/references/policy-and-safety.md` §4.

## 8. Cancellation and win-back
- On iOS the actual cancellation happens in the App Store subscription settings; the app links there (manage subscriptions) from
  Settings. A retention step before the link is allowed, never a maze: the "tiếp tục huỷ" path stays visible and one tap away (FTC
  click-to-cancel: cancelling as easy as subscribing).
- Flow: reason (one question, 5–8 options, optional text) → one offer matched to the reason (too expensive → lower plan or a 20–30%
  discount for 2–3 months, never ≥ 50% · not using it → a pause or a reminder plan · missing feature → what is planned) → confirmation
  (access until the end of the paid period) → after cancelling, an easy way back.
- Count a "saved" user only if they are still paying 30 days later. Renewal failed (billing issue): what the user sees and how to fix
  the payment — part of the 8 transaction states.

## 9. A/B tests that can be trusted
- Spec per EXP-…: hypothesis "Nếu đổi X thì Y tăng vì Z" (names the metric) · variants (default 2: control + one change) · **one
  primary metric (max two)** · **1–3 guardrails** · secondary metrics (exploratory only) · minimum detectable effect · sample per
  variant · duration · kill rule set before starting.
- Sample size (≈ 80% power, proportion metric): n ≈ 16 × p × (1 − p) ÷ (p × MDE)² per variant; at least ~200 conversions per
  variant. Duration ≈ 2n ÷ daily traffic **on the affected screen**. Over 4 weeks → underpowered: raise the MDE, pick a more sensitive
  metric or a busier screen. Under 1 week → weekday effects. A team that never ran a test starts with an A/A test.
- Reading: a failed sample-ratio check voids the result; do not peek and decide; under 50% of the planned sample = speculation; **a
  guardrail that gets worse blocks shipping**; never declare a win on a secondary metric; a huge lift is more often a tracking bug.
  Outcome: ra / bỏ / kéo dài / điều tra. Check decisions.md "Bài học" before designing a new test; add a learning (L-…) only when more
  than one result supports it, citing supporting and contradicting tests.

## 10. Hand-off to QA — traceability and acceptance
The team has no QA: the lead tests the UI, the Devs test the rest. "Testers" below means those two.
- **Traceability table** in requirements.md: FEAT · FR · AC · who checks (Lead / Dev) · acceptance scenario (UAT-…) · status. Every P0 FR has at least one
  scenario; failed or deferred scenarios keep their links; a changed requirement triggers a review of the table.
- **Acceptance entry**: requirements and AC approved · system testing done · test devices, accounts and data ready · severe defects
  closed · scenarios reviewed by the lead and Devs. **Exit**: all P0 scenarios run, plus everything in the version's retest scope ·
  no severity 1–2 defects open · lower ones have an owner and a date · table updated · the lead signs off.
- Defect severity: 1 critical (cannot continue, or a security / payment failure with no workaround) · 2 high (a main function fails, no
  workaround) · 3 medium (wrong but with a workaround) · 4 low (cosmetic). Lifecycle: new → triaged → assigned → fixing → ready to retest
  → closed (or back to assigned) / deferred or rejected.
