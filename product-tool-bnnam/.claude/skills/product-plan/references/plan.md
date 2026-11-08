# Planning a version

## 1. Request queue
Every incoming idea becomes a row in decisions.md "Hàng chờ yêu cầu" before it can enter a version:
- **From**: team · store review · data (dashboard, funnel) · A/B result · market research · management.
- **Evidence**: M# / P# / a number with source. A request with no evidence can still be queued, labelled **giả định**, and ranked
  lower.
- **Status**: chờ xét → vào bản x.y.z (D-…) / bỏ (D-…). For updates, read what the last version's metrics say first (§13 and
  `raw/`): a request that fixes the worst funnel step outranks a new feature.

### Release cycle and batching (team rule)
Every version has a kick-off meeting, and versions follow **the cycle set at kickoff** (prd.md §1, D-…). Changes are **batched per
cycle, never shipped one by one**, because every change means retesting:
- A request never enters the current version directly; it waits in the queue until the next cycle's planning.
- At planning time, gather the queue into **one version with one clear goal** (what it must prove). Requests that do not serve that
  goal stay queued.
- **Too little to justify a version** (one or two small, unrelated items): propose waiting or merging them into the next cycle, and
  say what the retest would cost.
- **Out-of-cycle patch only for**: a crash, a store rejection, a policy violation. Keep the patch to the fix itself; anything else
  waits for the cycle.
- Each version gets a **retest scope** in prd.md §13 (below).

## 2. Feature table
Match the team's Feature sheet so the meeting can use either:

| Mã | Tính năng | Giải gì (bằng chứng) | Ưu tiên | Mức | Bản |
|---|---|---|---|---|---|
| FEAT-01 | Check-in 1 chạm | quá nhiều lựa chọn khi căng (M#1, M#2) · JTBD-01 | P0 | Đề xuất | 1.0.0 |

Under the table, per FEAT, a short block: module · definition (1–2 lines: what the user can do, as an action) · reference app if any
(market §4). Describe outcomes ("người dùng tiếp tục từ chỗ dừng"), never implementation ("lưu timestamp vào UserDefaults").

## 3. Scope rules
- **Proof sentence first** (§4). For each P0: "without it, can the version still prove the sentence?" Yes → P1 or out.
- Lite first version: 5–8 P0 capabilities. P0 on everything means nothing was prioritised.
- **Dependency rule**: a P0 flow's recovery path (permission denied, AI wrong, offline, payment failed) is P0.
- **"Không được cắt"** items from §4 stay, even when the table is cut.
- Out-of-scope items with future intent go to a later version row in §13; permanent exclusions do not.
- Any move away from the original priority → a decision D-… with the reason.

## 4. Version roadmap (§13)
| Bản | Phải chứng minh | Tính năng | Chỉ số đo | Ngày chốt | Trạng thái |
|---|---|---|---|---|---|
| 1.0.0 | quay lại ≥ 3 ngày/tuần | FEAT-01…06 | D7, tỉ lệ đạt aha | 20/11/2026 | chờ kick-off |
| 1.1.0 | lời nhắc đúng giờ tăng D30 | FEAT-07 | D30 | — | dự kiến |

**Retest scope** — under the §13 table, one block per version in progress: each change → the screens and functions that must be
tested again, split into what the lead checks (UI, copy, screen states) and what Dev checks (logic, data, payments, permissions).
Include features that did not change but share a flow, data or the paywall with a changed one. A big retest scope is a reason to cut
the version, not to skip testing.

**First version as an experiment** (lesson from the Pose project): when the product's weakest point is retention, 1.0.0 can be a
soft launch in a small English-speaking market (e.g. PH, CA, AU) with gate numbers written **before** shipping — activation, D7,
D30, trial → paid. Missing the gate means stop or change direction, not an automatic next version. Propose it; the team decides (D-…).

Statuses: dự kiến · chờ kick-off · đã chốt · đang thiết kế · đang build · đã phát hành. Later rows are intentions, not promises;
only the version being planned is detailed. Milestones for the active version follow the team: duyệt PRD → khoá phạm vi → duyệt
wireframe → alpha → beta → lên store.

## 5. Kick-off sheet
The team's process: the lead sends the feature list → the iOS / Android Devs study feasibility and estimate **before** the meeting →
the meeting (the day after) confirms features, dates and the retest scope. Every version has this meeting, small ones included. Prepare, in chat and as a block the user can paste into the team's Feature sheet:

| Mã | Tính năng | Ưu tiên | Dev: khả thi | Dev: giờ ước | Lead (UI/UX): giờ ước |
|---|---|---|---|---|---|
| FEAT-01 | | P0 | Possible / Khó / Không / chưa trả lời | | |

Below it: questions the team must settle in the meeting (open items in §14, conflicting drafts, price range), and what the AI is
unsure about. Never fill the Dev and UI/UX columns yourself.

After the meeting: record each outcome as D-… (who attended, date, what was decided), set §13 to "đã chốt", move cut items to
postponed with the reason. Dev answers saved by the user in `raw/` are cited with their date.

## 6. Choosing what goes in — gates and frameworks
Gates in order: **0 mandatory** (policy, privacy, safety, legal — never scored) → **1 strategy** (serves the proof sentence / version
goal?) → **2 evidence** (M#, P#, data) → **3 ranking** → **4 feasibility and economics** (Dev answer, money check) → **5 how to
validate** (prototype, test, A/B, staged release) → **6 learn after release** (version metrics, learnings L-…).

Pick the ranking framework by what you have, and run every one that applies (never force one):
| Framework | Use when | Scale |
|---|---|---|
| ICE | always; quick, before much data | Impact × Confidence × Ease, each 1–10 |
| RICE | real reach numbers exist (after release) | Reach = users affected in the first quarter, 0,5 (< 5%) → 10 (≥ 80%) · Impact 0,25 / 0,5 / 1 / 2 / 3 · Confidence 50–100% (< 50% = moonshot, deprioritise) · Effort in person-months by size (XS 0,03 … XXXL 20); score = R × I × C ÷ E |
| Kano | user research exists | must-be (keep free) · performance · delighter (premium candidate) · indifferent · reverse; under 100 answers = directional only |
| WSJF | deadlines, seasonal events, items that unblock others | cost of delay (value + time criticality + risk reduction) ÷ size |
| MoSCoW | binding scope for one version | = P0 / P1 / P2 / out |

Rules: every score points to an input or a flagged assumption; equal weights are also a choice; with ≤ 10 items show the full order;
when frameworks disagree, name the dimension that causes it. Items with confidence ≤ 80% or effort > 1 week get a short **opportunity
canvas** (problem · smallest change · out of scope · what to measure · assumptions and how to check) before they enter a version.

**Slicing a version with a story map**: the backbone is the main journey from §5 (the high-level steps that carry the value); under
each step, the stories for it; rows by priority — the top row across all steps is the smallest version that still works end to end.
A version that is deep in one step and empty in another does not deliver the journey.

**Each FEAT or version carries a hypothesis**: "Chúng tôi tin làm <X> cho <ai> sẽ dẫn tới <kết quả>; biết là đúng khi thấy <chỉ số>"
— and the harm question: "Nhưng có thể gây hại cho <ai> nếu <điều gì xảy ra>" (essential for wellbeing, money and kids apps). A harm
with no guard goes to §14.

**Three lenses** when choosing between options: người dùng có muốn không (behaviour, size of the pain, willingness to switch — not
"do you like it") · làm được không trong điều kiện hiện tại (Dev, time, running it after launch) · có bền về kinh doanh không
(conversion, retention, cost to serve). Say how each option does on all three, then recommend one.

**In the kick-off meeting**, when the team disagrees on priorities: each person marks their top 3 (dot voting); clusters that collect
most votes are discussed first. Votes inform, the lead decides and records D-….

For the kick-off meeting a quick **impact – effort** picture helps (quick wins · strategic bets · fill-ins · defer) — a view for
discussion, not a ranking. Risks in §14 get a score: likelihood 1–5 × impact 1–5; ≥ 15 is handled before kick-off, 8–14 has an owner
and a check, the rest is listed.

## 7. Roadmap beyond the current version
- Later versions as **Now / Next / Later** (confidence falls from left to right); only "Now" has dates.
- Each item: one line, status (xong / đúng tiến độ / rủi ro / bị chặn / chưa bắt đầu), owner, dependencies. Each dependency (technical,
  team, external, knowledge, sequence) has an owner, a "cần trước" date and a fallback.
- Changing the roadmap: say what changes · why (the new information) · what is traded off · the new plan · who is affected — and record
  D-…. Batch changes; do not reshuffle for every new signal. When adding work, ask "bỏ cái gì?" (team rule of thumb: ~70% features,
  20% technical health, 10% unplanned).

## 8. After release — improving a live version
Lessons from the team's optimisation roadmap for a live app; apply when planning an update.
- **Order matters more than the idea.** Revenue model per country → store-review blockers and one price table → the path to the
  value moment (it multiplies every revenue line) → a **baseline**: the key rates (reach value, next-day return, paywall seen, trial
  start, trial → paid, refunds) stable for 2 weeks → experiments one at a time → grow only when each user earns more than they cost.
  Running the right test while the denominator still moves gives an unreadable result.
- **Hard stops for any test**, even when the main metric wins: rate of reaching value drops at all · next-day return drops > 10%
  relative · refunds rise > 1,5×. Variants differ in one thing only.
- **Diagnose before adding features.** When a behaviour does not happen (users do not return, do not turn on reminders, do not
  upgrade), ask in order: do they know what to do now (trigger)? → is it easy right now (ability)? → do they want it (motivation)?
  Motivation can only be found, not pushed — make it easier first. A habit loop is trigger → simple action → a reward → something the
  user puts in that brings them back; every mechanism passes the product principles (no manipulation). Ask for an upgrade right after
  a moment of success, not after a failure.

