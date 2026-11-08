# Writing requirements Dev can build and QA can accept

The chain: **FEAT → UC** (what the user does) **→ FR** (what the system must do) **→ AC** (how to tell pass from fail), plus NFR, BR,
permissions and data, events. Write what and how it is accepted — never how it is built.

## 1. Use cases (UC)
- One FEAT → at least one UC. Written from the user's side, in the user's words, no technical terms.
- Fields: "Là … tôi muốn … để …" · điều kiện trước · luồng chính (numbered) · luồng thay thế `AF-001.1` · luồng ngoại lệ `EX-001.1` ·
  kết quả sau cùng.
- For every main-flow step ask: can it fail, and where does the user go then? A UC with only a main flow is unfinished.
- Every branch ends somewhere (a screen, a retry, an exit) — no dead ends.

## 2. Functional requirements (FR) and acceptance criteria (AC)
- One UC → one or more FR. Each FR answers 5 questions: what problem · for whom · in what context · what the user gets · how it is
  measured.
- Every FR has at least one AC, written Given / When / Then (or a tickable checklist), so a stranger can answer "đạt hay không" without
  asking.
- Banned in AC because they cannot be measured: nhanh, mượt, dễ dùng, trực quan, đẹp, hợp lý, đầy đủ, tối ưu, thân thiện.
  - Sai: "Kết quả hiển thị nhanh."
  - Đúng: "Given đã chọn tâm trạng, When bấm Bắt đầu, Then bài thở chạy trong ≤ 1 giây trên iPhone 11; quá 1 giây thì hiện vòng chờ
    kèm nút Huỷ."
- AC must be checkable **on a real device**, not only in code. Permission errors, purchase errors and emergency / exit paths always
  have AC. A premium feature is visible in onboarding and in settings.
- **Dependency rule**: if a P0 flow needs a recovery path (manual entry when the camera fails, demo when permission is denied), that
  recovery UC / FR is P0 too. A recovery path can never be later than the flow it rescues.

## 3. Quality requirements (NFR)
Every NFR has a number **and** a condition: which device, which network, which state. Cover six groups: performance (cold start,
response, app size) · reliability (offline, killed, storage full) · accessibility (the five minimum rows in the template) ·
compatibility (min OS, reference devices) · privacy and security (what is stored where, how long) · operations (crash-free,
error reporting). A threshold Dev has not confirmed is **giả định** + `DQ-…`.

## 4. Business rules (BR)
The only place a formula lives. Each BR: statement · formula · **a worked example by hand** · ≥ 5 edge cases (zero, negative, exactly
at the threshold, one over, time reset — with hour and time zone, carry-over, the user changing time zone) · what happens when broken ·
which FRs apply it.

## 5. Permissions and data
- Each permission: why · when in the flow (after the user sees why, not on first launch by default) · the explanation screen before
  the system dialog · granted · denied · **permanently denied** (the app can no longer ask — only guide to Settings) · which FRs
  depend on it. A feature that is useless without the permission needs a fallback (sample / demo / manual path).
- Each data item: what · why · where it lives (Dev confirms) · how long · can the user delete it · what happens on a new device.
- "Không thu thập" list matches the bans in prd.md §4.

## 6. Events (draft until a measure toolkit exists)
- Metrics first, events second: every event serves a metric or a funnel step in prd.md §7, else delete it.
- Name `<object>_<action>` in snake_case, past tense: `paywall_viewed`, `trial_started`, `checkin_completed`. A shipped name never
  changes; replace with a new event and mark the old one deprecated.
- Each event: when it fires (exact moment) · properties it needs (no personal data outside the approved list) · metric / funnel step ·
  screen.
- Never forget: app lifecycle · core action completed · each onboarding step · paywall viewed / trial / purchase · the 8 transaction
  states · errors and recovery · permission denied (incl. permanently) · offline · free limit reached · notifications on/off.
- When a paywall scenario KBx is chosen, its required events (from the scenario table) are added here.

## 7. Boundary with Dev
Not here: architecture diagrams, endpoints, table names, schemas, library or SDK names, data models. When a requirement depends on one
of them, write the requirement, mark the unknown **giả định**, and add the question to requirements §8.
