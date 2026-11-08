# Kickoff method

## 1. Questions — one round, only what docs/market did not answer
Group them, give a default for each, accept "ok":
- Context: new product, clone-and-improve a proven category, or extending the portfolio?
- What the company needs from it: new revenue, learning a category, using existing traffic, filling the portfolio.
- Team and dates: default team = the lead (designer, also PO / UX / ASO / data, tests the UI) + iOS Dev + Android Dev; anyone else
  (BE, AI, graphics)? Deadline for version 1.0.0.
- **Platform — decided per app, no default**: iOS, Android or both; if both, which first and whether they ship together. Then minimum
  OS, tablet or not. Record as a decision (D-…); it picks the store rules in gate 0 (Apple, Google Play or both) and the mobile
  constraints later.
- **Release cycle — decided per app**: how many weeks between versions (D-…). Every version has a kick-off meeting; changes are
  batched per cycle, not shipped one by one, because each change means retesting.
- Anything already decided by management (assigned idea, fixed price, required feature)?
- What the user already has: a feature sheet, a competitor sheet → into `docs/product/raw/`; Figma / FigJam files (boards, early
  flows) → links into prd.md §1 "Liên kết" and "Đọc theo vai trò" (`../../product-standards/references/inputs-and-handoffs.md` §6).

## 2. Problem → solution, why now
- Max 3 problems, numbered, each a cause → measurable effect chain: "app thiền bắt chọn trong thư viện 300 bài → người đang hoảng
  không chọn nổi → bỏ app giữa chừng (M#1, M#2)". Name who hurts and when, not "người dùng gặp khó khăn".
- Solutions map 1-1: problem 1 → mechanism 1. A problem with no mechanism goes to §14 as an open question.
- Why now cites ≥ 1 external signal (category scale, new entrants growing, a gap the competitor matrix shows, a platform change) with
  its source, and must fail the test "was this equally true 3 years ago?". Check platform facts with Dev; do not date OS features
  from memory.
- Frame the market by retention economics: the size that matters is people who stay and pay, not downloads.

## 3. Positioning and success
- From → to: "app thiền thư viện dài → một việc 2 phút đúng lúc căng".
- One line: "Cho <ai> đang <vấn đề>, <app> là <loại app> giúp <kết quả>, khác <đối thủ> ở chỗ <khác biệt>." Take it from the
  market's chosen idea sentence; change it only with a decision.
- Differentiators ≤ 3, each: where competitors are weak (market §4) and why it is hard to copy within 6 months. "Đẹp hơn, nhanh hơn,
  rẻ hơn" is not a differentiator.
- Success criteria are checkable states ("giữ chân giai đoạn đầu đạt mốc trước khi mở rộng tính năng"); the numbers come in §7.

## 4. Principles that decide
3–5 principles in the form "ưu tiên A hơn B", each with the reasonable feature it rules out:

| Weak | Strong | It rules out |
|---|---|---|
| Chất lượng là trên hết | Ưu tiên dùng hằng ngày trong 2 phút hơn độ sâu nội dung | thư viện 300 bài |
| Tôn trọng người dùng | Ưu tiên giá nói trước hơn tối đa tỉ lệ dùng thử | paywall giấu giá sau trial |
| Đơn giản | Ưu tiên dữ liệu nằm trên máy hơn đồng bộ nhiều thiết bị | đăng nhập tài khoản ở bản đầu |

Check later decisions against them: a principle like "giá trị gói trả phí là thêm, không ép" forbids locking the core daily loop.

## 5. Scope lock
- **Proof sentence** — one line: what version 1.0.0 must prove ("người đi làm quay lại check-in ≥ 3 ngày/tuần mà không cần thư
  viện"). Everything that does not serve it is out.
- **In scope**: 5–8 capabilities. For each ask "if we drop it, can we still prove the sentence?" — if yes, move it out.
- **Out of scope, considered**: what people will ask about, with the reason and when to reconsider. If nothing painful is out, scope
  was not cut.
- **Bans** `BAN-01…`: things not to propose or add even when they sound reasonable; who may unlock them (PO, via a decision).
- **Không được cắt**: things nobody demos or buys, so they are cut first when scope grows — and the product breaks without them:
  the path when a permission is denied · the fallback when the main thing fails · a diagnostic / help screen · public promises
  (price shown upfront, a free tier, privacy). Each with "cắt thì hỏng thế nào". Cutting one later needs its own decision.

## 6. Gate 0 bans and positioning for sensitive categories
Read `../product-standards/references/policy-and-safety.md` and add the bans that apply as BAN- items from the start:
- Never require notifications, location, tracking or data sharing for a feature to work; never reward or gate ATT consent.
- No login unless account features need it; if accounts exist, in-app deletion is in scope ("không được cắt").
- Health and wellbeing: no wording that diagnoses, treats or cures; health data never used for ads; Dev confirms whether the planned
  storage (e.g. iCloud sync) is allowed for this data before it becomes a promise.
- Kids: no third-party analytics or ads if the app is primarily for children.
For mental-wellbeing apps the default positioning is **a companion for everyday wellbeing, not treatment** — write it into the
positioning line and the bans. Propose crisis resources as an option for the team to decide (record D-…), not as a rule.
