# Spec method — enough for design

## 1. The feature block (prd.md §10, level *Đủ để thiết kế*)
6–10 lines per FEAT, every line carrying something:
- Mức · Bản · Ưu tiên.
- Cho ai, giải gì: PER · JTBD · M# / P#.
- Người dùng làm gì: 2–3 lines of behaviour in the user's words.
- Luồng chính: numbered steps from the trigger to the result, decision points marked `◇ … ? → Có: bước 4 / Không: bước 2b`.
- Khi không suôn sẻ: each branch with where the user ends up (see §2).
- Quyền và dữ liệu: PRM- / DATA- IDs. Paywall / quảng cáo chạm ở: which step.
- Yêu cầu: UC- / FR- IDs. Câu hỏi cho Dev: DQ- IDs + answer status.

## 2. Flows and branches
- **Main flow** = the primary persona's desired journey (prd §5), first launch → aha moment, then the daily return session (often
  more important for retention than first run).
- **Branches every feature is checked against** — write the ones that apply, say "không áp dụng" for the rest:
  permission denied · permanently denied · offline at start / mid-action · error from a service · empty first run (no data yet) ·
  free limit reached · trial ended · purchase failed / pending · the user leaves and comes back · notification permission refused.
- **AI touchpoints** (if any): number them (AI-1, AI-2). For each: acceptable wait + what happens on timeout · what happens when the
  result is wrong (can the user correct it, what updates downstream) · cost per call vs free quota (link §8).
- **Features meant to bring users back** (reminders, streaks, notifications): pick the kind of nudge by the user's motivation and how
  easy the action is — low motivation + easy action → a light spark ("chỉ 2 phút thôi"); high motivation + hard action → step-by-step
  guidance; high motivation + easy → a plain signal is enough. Write the loop in the FEAT's "Giữ chân" line: nudge → simple action →
  reward → something the user puts in (history, streak, data) that brings them back. Every mechanism passes the product principles
  (no guilt, no manipulation).
- **Rules worth writing now** (Cal AI pattern): deterministic behaviour a tester can check — timeouts ("tìm TV quá 15 giây → hiện
  hướng dẫn"), formulas (→ BR), state conflicts ("sửa liên tiếp → lấy lần sửa cuối"), display rules. They become AC.

## 3. Screens and onboarding
- **§11 screen list**: `SCR-…` · name · feature · P0/P1 · dependency (permission, billing, rule engine…). Each screen belongs to ≥ 1
  flow. This is a first happy-path inventory; the design toolkit expands it with states and becomes the source of names.
- **Task analysis** (§11, before the screen list): HTA for the whole picture of a goal (goal → tasks → actions as a tree); CTA when
  one step carries a heavy thinking load (follow what the user has to understand and remember at that step). For each main task,
  walk the steps with three questions — how should the user be able to do this step · what can go wrong here · do it or not, what to
  weigh — the answers become branches, rules or DQ.
- **Task analysis — what to write**: each user goal from §5 (JTBD) → the tasks to reach it → the smallest actions →
  which FEAT and screen. A goal with no FEAT is a gap; a FEAT with no goal is a candidate to cut.
- **Information first, then the tree**: which information objects the user works with (a session, a mood entry, a plan…), their
  attributes and how they relate; how content is grouped (time · event · alphabet · place · format · task · user group).
- **Sitemap in text** (§11): choose the navigation model and say why — also category + database (same kind of content repeated per
  category, e.g. catalogs) — tab (2–5 equal areas used daily), linear (one main job done
  step by step), hierarchical tree, hub (start screen leading to separate tools); mobile apps mostly use tab or linear. Draw it as a
  text tree with SCR codes. Every screen sits in the tree; nothing is reachable only by accident.
- **Overall flows in text** (§11): at least the first-launch flow to the aha moment and the daily return flow, across SCR codes,
  numbered, with `◇ condition? → Có / Không` and both exits written. Flow rules: one goal per flow, a clear start and end, no dead
  end, the main path never interrupted by an unrelated ask. Every SCR appears in ≥ 1 flow; an orphan screen is extra or a flow is
  missing. Count steps to the value and compare with competitors (market evidence). Each flow states: persona · start point · what
  "done" means · the error flows linked. Labels short and self-describing ("Màn đăng nhập"; a decision "Đăng nhập hay đăng ký?").
- **How many screens** (a first count Dev and the designer can plan with): screens = main path + one per decision outcome that needs
  its own UI + data states of each core screen (usually 1–2: empty, error, offline, permission, paywall / locked) + overlays (sheet,
  dialog, toast) counted 0,25–0,5. At each ◇ ask: is there a waiting / pending outcome? does it jump to another flow? can the business
  refuse (expired, locked, over limit)? does the result differ by user type (free / paid, new / returning)? Mark each row in §11 as
  core / nhánh / trạng thái / lớp phủ and write the total under the table.
- **Walk the text flow before hand-off** (cognitive walkthrough) for the tasks that matter most: first launch → aha, and reaching the
  paywall → understanding the offer. For a first-time user, at every step ask: do they know this step is needed? will they notice the
  way to do it? will they connect it with what they want (a "Continue" that starts a trial fails here)? after it, do they see they
  are closer? Score each step 1–5; steps at 1–2 are fixed in the spec before design.
- **Laws a text flow already has to respect**: feedback after every action · forgiveness (undo, back, drafts) · recognition over
  recall · progressive disclosure (what is needed first) · privacy explained by its value at the moment it is asked · one goal per
  screen of the main path.
- **Features that depend on things the user does not see** (purchase, sync, AI, notifications): write a short four-row blueprint —
  user steps · what the user sees · what happens behind (app, store, AI service) · support processes (refunds, content updates). It
  shows Dev where the feature can fail and where the DQ are.
- These text versions are the PRD's own — they must exist even if nobody draws them. The design toolkit turns them into visual
  flows / sitemap / wireframes and the links come back to the `Hình:` lines.
- **Forgotten screens check**: paywall with restore purchase · pre-permission explanation + denied fallback · offline / error ·
  free limit reached · rating prompt (when, how often) · ad slots · empty first run · settings with subscription status and cancel
  path · account deletion if accounts exist.
- **§12 onboarding outline** from the scenario in §8: steps · question or content · purpose · answer type · can it be skipped. Each
  step answers "bỏ được không?". A paywall placed before the aha moment needs a reason. Personalisation: what later screens change
  according to the answers. Drop-off points to watch, by behaviour.

## 4. Questions for Dev (per FEAT, Must and Should only)
For each FEAT: what it needs (data, permission, external service, device capability) · **chỗ tôi chưa chắc** and what breaks if the
guess is wrong · DQ with the acceptable threshold and "cần trả lời trước" (before design, before build). Reuse answers already given in
the market `dev-brief.md` / `raw/dev-answer-*.md` — never re-ask what Dev has answered. Dev's verdict column: KHẢ THI / KHÓ, TỐN CÔNG /
KHÔNG KHẢ THI / CHƯA TRẢ LỜI, filled only from Dev's answer with its date. A FEAT cut for infeasibility → decision + §10/§4 update.

## 5. Mobile constraints (§9)
Walk the team defaults with the user and adjust rather than brainstorm from blank: cold start < 2,0 s, screen render < 1,0 s cached,
crash-free ≥ 99,5%, 44 pt targets, Dynamic Type, VoiceOver, notifications opt-in max 1/day and re-engagement only after 3+ inactive
days, in-app account deletion if accounts exist. Ask only where defaults may not fit: min OS version, tablet, offline needs, sync conflict
policy, content licensing, minimum personal data. **Platform comes from prd.md §1** (decided per app): use Android equivalents when
Android is in scope (48 dp targets, TalkBack, font scaling), and when the app ships on both, add a short "Khác nhau giữa iOS và
Android" list per FEAT where behaviour differs — permissions and their wording, purchase / restore / cancel path (Play Subscription
Center vs App Store), widgets, notifications, back navigation. Gate 0 uses Apple §1–4 and / or Google Play §6 of
`policy-and-safety.md` accordingly. Every number is a gate the tester can verify, with the device named.

## 6. Gate 0 per feature and onboarding rules
- Per feature, check `../product-standards/references/policy-and-safety.md`: does it need a permission (then an alternative path when
  refused — 5.1.1(iv)), personal or health data (disclosure, storage confirmed by Dev), tracking (ATT, no gating), third-party content
  (licence)? Write the result in the feature block; open items go to §14 with an owner.
- **Ratings** are requested only with Apple's rating API, at a moment after value; no custom review pop-up.
- **Onboarding**: list every step from install to value — screens, fields, taps, confirmations, **permission prompts**, empty states
  (teams usually count about half). Each step is "guilty until proven needed": cut, defer, pre-fill or make skippable. The first
  session aims at **one** successful outcome; doing beats learning; give a head start (sample data, a ready choice); end on a high
  point. Mobile order: permission (only if the first value needs it) → quick win → ask for notifications → daily loop. Tours 3–5 steps,
  skippable, never repeated for returning users. Empty states explain and offer the first action.
