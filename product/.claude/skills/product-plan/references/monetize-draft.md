# Monetization decisions (draft until a monetize toolkit exists)

Label prd.md §8 "Bản nháp — sẽ chuyển sang bộ monetize khi có". Here only **decisions that change which screens exist**; per-screen
paywall content, product IDs per country and A/B details are `product-detail`'s job.

## 1. Model and split
- Model (subscription / one-off / ads / hybrid), justified by the primary persona's usage rhythm: daily habit → subscription fits;
  one-off urgent task → weekly or one-off purchase; low intent, high volume → ads with a remove-ads purchase.
- **Free tier must let the user form the habit** — otherwise nobody stays long enough to convert. It fully solves the entry pain
  (prd §5); premium sells depth, not relief from crippling.
- List free and premium **item by item**, each premium item with "vì sao đáng tiền" in one clause. Limits are exact with reset time.
- Hybrid pattern "quota + watch an ad for more": quota an *expensive* extra (AI calls, HD export), never the core action — free DAU is
  the audience ads need (R_ads ≈ DAU_free × impressions/DAU × eCPM / 1000).
- Check against market evidence: if users complained about paying for something basic, it is free here.

## 2. Plans and price
- Anchor to competitors (market §4.5 price anchor): state where we sit (equal / below / above) and why.
- Always state weekly **and** yearly; check whether lifetime, monthly, a remove-ads purchase, a downsell are wanted — each absence is a
  decision. Trial length: team default 3 days; justify a different one.
- Ranges by country tier when the market money check split T1 / T3; prices per country in detail later.
- Prices are written only in §8; everywhere else cites the plan code.

## 3. Onboarding + paywall scenario (team's 8 scenarios)
| Code | Name | Sells with | Pick when |
|---|---|---|---|
| KB1 | Direct Outcome | outcome promise after 2–3 screens | strong intent, clear pain, no visual result needed |
| KB2 | Aha Before Paywall / Result Unlock | a real preview, full result gated | value is a visible result (AI output, scan, before/after) |
| KB3 | Personalized Intent | 1 intent question changes headline / benefits | many use cases or personas |
| KB4 | Progress Loading + Value Build | real processing time used to build trust | real AI / scan / analysis taking seconds |
| KB5 | Trial-first Risk-free | trial timeline, low risk | broad / social traffic, low intent, fear of subscriptions |
| KB6 | No Trial / Direct Purchase | buy now | very high intent by keyword / source; trial cancel history high |
| KB7 | Downsell After Close | a softer offer on close | many paywall views, few trials; price-sensitive markets |
| KB8 | Permission-led Setup | pre-permission at the right moment | the value needs a sensitive permission |

Choose with three questions: must users **see a real result** to believe? · what is the **traffic source and intent**? · new flow, or
optimising one (which metric is bad)? Then:
- visible value → backbone KB2 (+KB4 if real loading, +KB8 if a permission is needed first); outcome utility + high intent → KB1
  (KB6 only by source / geo); broad low intent → KB5 + KB7; many personas → add KB3 on top.
- Collisions: KB1 and KB2 never in one flow; KB6 never with KB5; KB7 fits any flow with a close button.
- Write: backbone + layers with one reason each · 1–2 near-miss scenarios and why not · target numbers and **kill rule** of the chosen
  scenarios (below) · their required events go to requirements §6.

| Code | Target | Kill rule |
|---|---|---|
| KB1 | install → paywall view > 70%; view → trial 4–8%; D1 cancel < 25–30% | trial up but D1 cancel > 35%, refunds up, reviews say forced |
| KB2 | first result view > 35–50%; result → trial > 8–12%; trial → paid > 30% | "pay before result" complaints; result fail > 5% |
| KB3 | view → trial +15–30%; intent screen drop < 20% | drop at intent > 20%, or no uplift with enough sample |
| KB4 | loading completion > 85%; paywall conversion +10–20% | loading drop > 15%, "fake loading" complaints |
| KB5 | view → trial +20–40%; trial → paid ≥ 25%; D1 cancel < 30–35% | trial → paid < 25% or D1 cancel > 35% |
| KB6 | D0 revenue / install up; refund < 5–8% | refunds / bad reviews up, or D7 net revenue not above trial variant |
| KB7 | trial / purchase +5–15%, no rise in rage closes | close rate up, session length down, spam complaints |
| KB8 | permission accept +15–30%; aha reach up | permission screen drop > 20%, or denied users have no fallback |

Never: fake urgency, fake loading, a price hidden after the trial, Continue buttons that open ads.

## 4. Paywall and ad touchpoints
List every touchpoint (§8 table): where, type, has the user already seen the value there? Paywall before the aha moment needs a written
reason. Ads: prefer rewarded over popups; never at a user's first touch of a feature before they got its value; state frequency caps.

## 5. Sanity numbers
If the market toolkit ran, reuse its money-per-download range and break-even CPI (market §5) instead of recomputing; note which plan
and conversion assumptions changed since, as **giả định** in §14.

## 6. Entry model, paywall position and price research
- **Entry model follows the market** (what competitors and users expect, market §4 entry models): freemium · free trial · paid trial
  (small fee for 7 days) · hard paywall (pay before use) · one-time purchase / refund window. Freemium must "hook, then limit" — a
  daily cap felt inside the habit, not a limit that bites after a month; giving away too much turns free into the destination.
- **Mobile paywall order**: onboarding → a personalised first result → paywall. No paywall on first launch before anything personal
  has happened. Yearly plan first, its weekly / monthly equivalent as secondary text (the billed amount and period stay clear); at most
  one shorter plan to compare. Trial on the yearly plan, with a reminder before it ends. A softer offer when the paywall is closed —
  **once, not on every close** (= KB7). Localise prices per storefront; test price, plan mix, trial length and design by remote config.
- **Subscription rules** (Apple 3.1.2): period ≥ 7 days; say what the user gets before asking; no extra tasks to receive what was paid
  for. Check `../product-standards/references/policy-and-safety.md` §1.
- **Price**: between the user's next best alternative (floor) and perceived value (ceiling); a competitor price is a data point, not a
  target; never from cost; avoid prices so low they attract the users who churn most. Research when the team can: **Van Westendorp**
  (4 questions — too expensive, too cheap, getting expensive, bargain — 100–300 people per persona; gives an acceptable range, not an
  optimal price) · **MaxDiff** (8–15 features, 4–5 per set: top features in every plan, middle ones separate plans, bottom ones premium
  or cut) · Gabor-Granger ("would you buy at X?" across prices). Avoid asking "how much would you pay?" directly.
- **Plans**: three tiers is the standard (middle = anchor) when tiers exist; most consumer apps need one paid plan in two billing
  periods. A reverse trial (full access, then back to free) is an option for freemium apps.

## 7. Think in user states, not screens
Lesson from the team's teardowns (CamScanner, Remote TV apps, Cal AI): what a user sees is decided by their **state**, checked in a
fixed order, and most numbers come from remote config rather than the build. Use this to fill the §8 "Rẽ nhánh" table.
- **States** (keep those that apply): mới · chưa tới giá trị · chạm giới hạn / tính năng trả phí · đang dùng thử · đang trả tiền ·
  từng trả nay hết hạn · đã đóng màn bán nhiều lần (≥ 3) · dùng nhiều mà miễn phí. Write the check order (đang trả còn hạn? → đang
  dùng thử? → …); the first match wins.
- **Per state**: what they get (quota, ads, locked features), what is offered, what is never shown. Paying users are not sold to
  again. A user who closed the paywall ≥ 3 times gets a different offer (remove ads, one-time purchase, "trả một lần cho yên") or
  nothing — not the same paywall again. Expired payers get their own welcome-back with "why did you leave" and an offer.
- **Fixed or config**: values that may change by country or test (quota, plans shown, ads on / off, paywall variant) are marked
  "config" in the table; Dev turns them into keys (product-detail). Ads on / off by country follows where users come from — T1 leans
  on subscription, T3 needs ads to earn from non-payers (market economics).
- **One scenario = one row**: Nếu (state + trigger) → Thì (screen / offer / result) → Ngược lại, plus the events it fires.
- **Decide the revenue model first** — ads + subscription or subscription only, and for which countries. Every placement depends on
  it; drawing screens before this answer is the most common rework.
