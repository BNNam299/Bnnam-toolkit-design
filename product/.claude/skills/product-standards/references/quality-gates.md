# The review — gates, anti-patterns, orphans, easy-to-miss groups

Run at the end of product-spec (scope: the version's FEATs, level *Đủ để thiết kế*) and product-detail (level *Đủ để build*, before
export). Record the result in prd.md §15 "Lần soát gần nhất": date, each gate đạt / chưa đạt + why, what must be fixed. A failed gate
is written down, never hidden; the user may still export with open items visibly marked.

## 1. Five gates (plus gate 0)
| Gate | Passes when |
|---|---|
| 0 Chính sách và an toàn | every applicable item in `policy-and-safety.md` is either met or written as an open question with an owner; no feature needs notifications, location, tracking or data sharing to work; refused permissions have an alternative path |
| 1 Đủ phần lõi | §2–5 and §10 filled for this version; no heading without content |
| 2 Bằng chứng | every number and claim has M# / P# / Dev / mốc team / giả định; no orphan numbers |
| 3 Ràng buộc mobile | §9 covers offline, notifications, accessibility, privacy, release readiness (restore purchase, permission denial, offline tested) |
| 4 Phạm vi rõ | in / out / bans / "không được cắt" filled; every P0 FEAT serves the "phải chứng minh" sentence; recovery paths of P0 flows are P0 |
| 5 Đo được | every metric in §7 can be computed from ≥ 1 event; every event serves a metric or funnel step (spec: draft list; detail: complete) |

## 2. Eight anti-patterns from the team's real PRDs
1. Empty section dressed as done — a heading with nothing under it.
2. A decision table pasted as an image or "click to view the sheet" (feature, KPI, price, competitor tables must be real tables).
3. A flow only as a picture or diagram code, with no numbered text steps — nobody can count screens or review branches.
4. Bullet fragments instead of sentences.
5. Numbers without a source or label.
6. A persona that is only an age band and interests — no context, no behaviour, no source; or a proto-persona not labelled as one.
7. Dead embeds ("[This type of content is unavailable…]") — use a link + one line describing it.
8. Camera / photo / AI features without a permission-denied branch and an "AI is wrong or slow" branch (latency limit, what happens
   on timeout, can the user correct it, quota per free user).

## 3. Orphan checks
- Every FEAT of the version has ≥ 1 UC; every UC has ≥ 1 FR; every FR has ≥ 1 AC without banned words.
- Every BR has a formula and a worked example; every permission has the permanently-denied branch.
- Every FEAT traces to M# / P# / R- and a persona or job; every user goal in the task analysis has a FEAT.
- (spec) Every SCR sits in the text sitemap and appears in ≥ 1 text flow; every ◇ has both exits.
- (detail) Every screen in the rules tables exists in `design/flows.md` / Figma; every FR at *Đủ để build* names its screens.

## 4. Easy-to-miss groups (detail level)
Errors and recovery · permission denied · permanently denied · offline mid-action · free limit reached · purchase success · purchase
failed · pending · cancelled mid-way · refund · expired · renewal failed · restore purchase · largest system text size · dark mode ·
app killed and reopened. Each has what the user sees and an AC (requirements §7).

## 5. Monetization consistency (spec: decisions; detail: full)
- **Free tier does not lock what users complained about.** If the market evidence shows users angry at paying for a basic action,
  the free tier must include it.
- **No quota on the core action when ads are a revenue line.** Ad revenue ≈ DAU_free × impressions per DAU × eCPM / 1000; a quota
  that makes free users quit removes the very audience the ads need. Quota expensive extras instead (AI calls, exports, HD).
- **One number per rule.** Several drafts with different limits (15 / 10 / 5) are settled before events and AC are written.
- **Catalog check:** weekly / yearly / lifetime? a remove-ads purchase? a downsell? Each absence is a decision, not an oversight.
- **Ads placement:** never show an ad at a user's first touch of a feature before they got its value; prefer rewarded over popups.
- **Dark-pattern check** (all must pass): price and cycle visible before the buy button · trial end date stated · how to cancel stated ·
  close button visible · no fake countdown · no false feature claim · Continue in onboarding is not an ad trigger · "trusted by N
  users" only when N is verifiable · onboarding promises match the real product.
- **Before hand-off to Dev** (lessons from the team's design review of a real app): one price table, and every screen in Figma —
  hidden layers included — matches it · a button on a sale screen says what it does ("Bắt đầu dùng thử 3 ngày"); a button labelled
  Continue never starts a purchase · no text from the other platform (Google Play wording on iOS screens or the reverse) · no
  unverifiable claims ("#1", "best") — use a checkable number or nothing · two flows meant as A/B variants share the same price
  structure, otherwise the result cannot be read.

## 6. Report line
Finish with one block: version · level reached · FEATs moved up / held back (and why) · gates passed · open assumptions · next step.
