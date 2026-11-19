# Monetization options — a library, not a default

Patterns the team has actually run (source: Remote TV PRD, 2026; notes in the project's `docs/notes/hoc-prd-remote-tv.md`). **None of
them is the default.** When deciding prd.md §8, brainstorm with this library and the market evidence, then offer the user **2–3 options
that fit this product**, each with its trade-off, and recommend one. Never copy a whole setup from another app.

Read with `monetize-draft.md` (model, split, plans, the 8 onboarding + paywall scenarios, user states). That file holds the defaults;
this one holds the alternatives.

## How to use
1. Answer the model question first (`monetize-draft.md` §7: subscription only, or ads + subscription, and for which countries).
2. Pick the options below that fit the persona's usage rhythm and the market money check by country group.
3. For each option offered, write: how it runs here · why it fits · the risk · the numbers that decide whether it stays (target and a
   stop rule) · which default it goes against.
4. **Going against a default** (`quality-gates.md` §5 — locking what users complained about, a quota on the core action with ads)
   is allowed only with a decision D-… that states the reason and the number at which the team stops (spec decision #127).
5. The chosen option fills §8 "Rẽ nhánh" (one row per state + trigger); values that may change by country or test are marked
   "config". Rejected options go to decisions.md with why.

## Options

### 1. Country groups, each with its own revenue model
- **How**: split countries into groups (e.g. 4) by willingness to pay; each group gets its own flow — group 1 subscription only ·
  group 2 hybrid (subscription + ads) · groups 3–4 mostly ads, with cheap one-off plans (lifetime, remove ads) priced per group.
- **Fits when**: the app sells worldwide and payers concentrate in a few countries (market money check by tier shows it).
- **Risk**: every group multiplies scenarios, configs, QA and analysis; small groups never reach a readable sample.
- **Decide with**: revenue per install by group vs the single-flow baseline; keep the number of groups as low as the data allows (2
  is often enough).
- **Write it as**: a table "Nhóm nước · danh sách nước · cách kiếm tiền · gói bán · quảng cáo bật / tắt" in §8, the country list
  as config.

### 2. Paywall ladder by session
- **How**: the user moves through stages. Stage 0 ends when they reached the value (e.g. connected the TV and pressed one button)
  **and** saw the paywall n times · stage 1 ends after n more paywall views without buying · then the app switches to ads (or a
  softer offer). Killing and reopening the app does not skip a stage. n per stage is config (e.g. `paywall_limit_session_0`).
- **Fits when**: the team wants to sell early to high-intent users and fall back to ads for those who will not pay.
- **Risk**: hard to test and easy to get wrong (Remote TV reused the wrong config key in two groups). Users who close the paywall
  repeatedly feel nagged.
- **Decide with**: paywall view → trial by stage, D1 return of users who reached the ads stage, rage closes.
- **Write it as**: one "Rẽ nhánh" row per stage: Nếu (stage + condition) → Thì (what is shown) → Ngược lại; a stage diagram on FigJam
  drawn from the table.

### 3. Free uses of the core action
- **How**: N free uses (button presses, casts, channel changes), then the paywall or "watch an ad for N more". A priority rule says
  which limit wins when several apply. Ads start only after the free uses run out and the user did not buy.
- **Fits when**: the core action is attractive enough that users accept an ad to continue, and the app is a one-off / urgent use.
- **Goes against**: "no quota on the core action when ads are a revenue line" — a quota that makes free users leave removes the
  audience the ads need. Needs D-… with the stop rule.
- **Risk**: several drafts with different numbers (15 / 10 / 5) — settle one number per rule before events and AC.
- **Decide with**: share of users reaching the value before the limit, D1 return, ad revenue per DAU, reviews about "limited".

### 4. Paywall once, then rewarded ads
- **How**: when a limit is hit, show the paywall once; if the user does not buy, from then on show "xem quảng cáo / mua" and turn on
  ads.
- **Fits when**: users in high-paying countries should see the price before meeting ads.
- **Risk**: two different messages at the same limit can confuse; state the frequency cap.

### 5. Lock by button / feature tier
- **How**: free keeps only the most basic controls (e.g. D-pad + OK); premium unlocks every other button and feature.
- **Fits when**: rarely — only when the market shows users accept it.
- **Goes against**: "the free tier does not lock what users complained about". Remote TV's own review analysis listed "paying for
  basic buttons" as a top complaint. Needs D-… with evidence that this market accepts it.

### 6. Rewarded ad for a short unlock
- **How**: watch an ad to unlock an expensive extra (cast, HD export) for a while or a few uses. Already the hybrid pattern in
  `monetize-draft.md` §1 — listed here for completeness.

### 7. Seasonal sale plan
- **How**: a dedicated yearly plan at a deep discount for an event (Black Friday 9,99, Christmas 19,99), shown on a sale paywall.
  The version plan for the event is in `plan.md` §9.
- **Risk**: users who bought at the sale price expect it again; a sale with no end date trains users to wait.

## Plan table (product-detail fills it)
When options create many plans, keep one table: tên nội bộ · tên hiển thị · mã gói (`loai_nhom_gia`, e.g. `lifetime_tier3_12_99`) ·
dùng thử · giá · **quyền lợi** · **áp dụng ở** (country group / stage / event). Details in `../../product-detail/references/detail.md` §4.
