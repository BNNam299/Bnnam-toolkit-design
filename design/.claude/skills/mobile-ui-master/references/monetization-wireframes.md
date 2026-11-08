# Monetization screens — wireframes of the 102 samples

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/images/monetization/ (102 images) @ 3c0e291 — each image redrawn as a text wireframe; image files not copied

## Contents
1. How to read these wireframes
2. Calories AI (iOS) — 21 images
3. HOME AI F3 (iOS) — 17 images
4. Home AI F2 ("Android", drawn on iPhone frames) — 21 images
5. Sketra AR Drawing F2 (iOS) — 22 images
6. Universal TV Remote F1 (iOS) — 21 images

## 1. How to read these wireframes

- Each `###` heading = one sample: an ID (`CAL-n`, `F3-n`, `F2-n`, `SK-n`, `TV-n`) · what it is · the original file name(s). The rules these
  samples illustrate live in `monetization-screens.md`; it cites the IDs. Search this file by ID or by file name.
- Sizes are in pt, read from the image (≈ = estimated). `r` = corner radius. Notes to the right of a box explain the element.
- The line under each wireframe says what the sample **demonstrates** (layout rule, variant, risk `R1`–`R15` from `monetization-screens.md` §8).
- These are samples of **screen type, anatomy, content and style** — not of frame structure. Build frames with `screen-structure.md`.
- `case-…` rows illustrate another screen type only (onboarding, loading, error, empty, permission…).

## 2. Calories AI (iOS) — `calories-ai/` (21 images)

Style family: white with blurred pink/yellow glow, orange accent, 3D food illustrations (see [monetization-screens.md §6](monetization-screens.md#6-five-style-families)).
Frames are 402 × 874 (iPhone 16 Pro) unless stated.

### CAL-1 · 3-column plan picker — `iap1-3plans.png`
```text
┌──────────────────────────────────────────┐
│ (×)  circle 44, TOP-LEFT, clearly visible │  floating 3D food around the edge
│        ┌──────────────┐                  │
│        │ [120 kcal]   │  hero: scan frame │  orange corner brackets around
│        │  sushi 3D    │  (≈160×120)       │  a food photo = core value (scan)
│        └──────────────┘                  │
│            CAI AI [PRO]                   │  logo + PRO pill (orange, crown)
│   Track less. Achieve more.   (28 Bold,   │  "Achieve more." in orange
│   Scan smarter. Reach goals faster.  15   │
│ ┌──────────────────────────────────────┐ │
│ │ ▣ Unlimited Food Scans            ✔ │ │  benefit card: 5 rows
│ │ ▣ Unlimited AI Meal Recognition   ✔ │ │  icon + label + orange check
│ │ ▣ Unlimited Daily AI Insights     ✔ │ │  (white card r≈16)
│ │ ▣ Smart Recipe Suggestions        ✔ │ │
│ │ ▣ Unlock Goal Recalculation       ✔ │ │
│ └──────────────────────────────────────┘ │
│ [Save 70%]  ┌──────────┐                  │
│ ┌───────┐   │ Weekly  ✔│   ┌───────┐      │  3 cards ≈104 / 140 / 104 wide
│ │Yearly ○│  │  $3.99   │   │Monthly○│     │  middle card ENLARGED, pre-selected,
│ │$49.99  │  │$3.99/Week│   │ $9.99  │     │  orange border + tint + glow
│ │Just $0.│  │3 days free│  │$2.49/wk│     │
│ │96/week │  │  trial   │   └───────┘      │
│ └───────┘   └──────────┘                  │
│        Auto-renew. Cancel anytime.  12    │
│ ┌──────────────────────────────────────┐ │
│ │            Continue                  │ │  pill CTA ≈362×56, orange gradient,
│ └──────────────────────────────────────┘ │  diagonal gloss stripes
│  Privacy Policy  |  Restore  |  Terms of Use │  one-row legal footer ≈10
└──────────────────────────────────────────┘
```
Demonstrates the 3-column picker: middle (trial) card enlarged and pre-selected (R2), CTA says "Continue" while the selected plan starts a trial (R4), trial copy sits inside the card, not above the CTA. Close × top-left is the most visible close button of the five projects.

### CAL-2 · 2-row plan picker with trial — `iap2-2plans-trial.png`
```text
┌──────────────────────────────────────────┐
│ (×) top-left        hero: noodle bowl in scan frame [120 kcal]
│            CAI AI [PRO]                   │
│   Track less. Achieve more.               │
│   Scan smarter. Reach goals faster.       │
│ ┌ benefit card — same 5 rows as CAL-1 ──┐ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ ◉ Weekly                     $3.99   │ │  row 1 SELECTED: orange border,
│ │   3 days free trial         Per week │ │  cream tint, filled radio
│ └──────────────────────────────────────┘ │
│ ┌────────────────────────── [Save 70%] ┐ │  badge pill on top-right edge
│ │ ○ Yearly                     $0.96   │ │  yearly shows WEEKLY-equivalent
│ │   Just $49.99/year          Per week │ │  as the big number, yearly total small
│ └──────────────────────────────────────┘ │
│        Auto-renew. Cancel anytime.        │
│ [        Start Free Trial               ] │  CTA names the trial
│  Privacy Policy  |  Restore  |  Terms of Use │
└──────────────────────────────────────────┘
```
Demonstrates the 2-row radio picker and "weekly price as the biggest number" (R3): the yearly row's large figure is $0.96 per week, the real $49.99/year is small text.

### CAL-3 · Long-terms version (≈1360 tall) — `iap2-term-scrolled.png`
```text
┌──────────────────────────────┐
│ (×)  hero  CAI AI PRO  title │  same top as CAL-2, scaled
│ benefit card (5 rows)        │
│ ┌──────────────── [Best Offer]┐  row 1 SELECTED: ◉ Yearly
│ │◉ Yearly          $49.99    │  [Save 70%] pill under label,
│ │ [Save 70%]  Just $0.96/week│  yearly total is the big number here
│ └────────────────────────────┘
│ ┌────────────────────────────┐
│ │○ Weekly           $3.99    │
│ │  3 days free trial $3.99/wk│
│ └────────────────────────────┘
│  Auto-renew. Cancel anytime. │
│ [        Continue          ] │
│  Restore | Privacy Policy | Terms of Use
│        Subscription Terms     │  section title, then bullet text ≈10 px:
│ - Subscribed users have unlimited use and access to all of its Premium features, without any ads.
│ - Non-subscribed users can continuously use the app with advertisements, and have a limited for use of Premium features.
│ - Users can subscribe to 2 different plans: Yearly ($49.99) and Weekly ($3.99) auto-renewing subscriptions.
│ - Payment will be charged to your Google Account at confirmation of purchase.
│ - Subscriptions automatically renew unless auto-renew is disabled at least 24 hours before the end of the current period.
│ - Account will be charged for renewal within 24-hour prior to the end of the current period, and identify the cost of renewal.
│ - Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription …
│ - Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user Account Settings after purchase. Note that uninstalling the app will not cancel your subscription.
│ 1. On your Android phone or tablet, let open the Google Play Store.
│ 2. Check if you are signed in to the correct Google Account.
│ 3. Tap Menu Subscriptions and Select the subscription you want to cancel.
│ 4. Tap Cancel subscription.
└──────────────────────────────┘
```
Demonstrates the "long terms frame": a stretched paywall that carries the full subscription terms for dev/review. Note the iOS project's terms say "Google Account" / "Google Play Store" — wrong platform (R9). Same screen as CAL-2 but with yearly pre-selected and "Best Offer" badge.

### CAL-4 · Plan-card component variants — `plan-card-variants.png`
```text
 component `Sub Pack` / property `content` — 6 variants (each ≈362×72, r≈16)
 ┌ Weekly / 3 days free trial      $3.99 $3.99/week ┐  default   (white, grey border, ○)
 ┌ Weekly / 3 days free trial      $3.99 $3.99/week ┐  selected  (cream fill, orange border + glow, ◉)
 ┌[Best Offer] Yearly [Save 70%]   $49.99 Just $0.96/week ┐  default
 ┌[Best Offer] Yearly [Save 70%]   $49.99 Just $0.96/week ┐  selected
 ┌[Save 70%]  Yearly Just $49.99/year   $0.96 Per week ┐  default   (weekly-equivalent big)
 ┌[Save 70%]  Yearly Just $49.99/year   $0.96 Per week ┐  selected
```
Demonstrates a properly componentized plan card (one of only two projects that did this): state (default/selected) × content (weekly / yearly-total-big / yearly-weekly-big). Badge pill sits on the top-right edge, overlapping the border.

### CAL-5 · Rewarded-ad gate (Premium or Watch Ad) — `reward-ads-popup.png`
```text
┌──────────────────────────────────────────┐
│ Home (Today, May 22, week strip) dimmed  │  overlay ≈50 % dark
│                                   (×)    │  × white circle 32, OUTSIDE card top-right
│  ┌────────────────────────────────────┐  │
│  │ orange header: 3D open gift box,   │  │  card ≈354 wide, r≈32
│  │ crown, ∞ coin, ruby, padlock,      │  │  illustration = value
│  │ confetti                            │  │
│  │ ┌────────────────────────────────┐ │  │
│  │ │     Unlock This Feature   24 B │ │  │
│  │ │ Watch an ad to use this feature│ │  │
│  │ │ once, or Go Premium for        │ │  │
│  │ │ unlimited access.          15  │ │  │
│  │ │ [        Go Premium          ] │ │  │  primary pill ≈320×56 orange gradient
│  │ │          Watch Ad              │ │  │  ad = TEXT LINK (demoted but visible)
│  │ └────────────────────────────────┘ │  │
│  └────────────────────────────────────┘  │
│ tab bar: Tracking | Add | Recipe (dimmed)│
└──────────────────────────────────────────┘
```
Demonstrates the "Premium is a button, ad is a text link" hierarchy variant of the rewarded gate (§4). Note: the source frame is named `Reward Ads Popup` but another frame of that name is actually Home + banner (§9 naming error).

### CAL-6 · Sale 50 % + countdown — `sale-off-50-countdown.png`
```text
┌──────────────────────────────────────────┐
│ (×) circle 32 top-left                    │  bg: cream→pink→orange glow, sun rays
│             Special Offer          28 B   │
│  Unlock the full power of AI to track,    │
│  understand and improve your nutrition.   │
│   ┌───────────────────────────────┐(BIG   │  3D orange ticket "50% OFF"
│   │       50%  OFF                │ SALE) │  + starburst sticker "BIG SALE"
│   └───────────────────────────────┘       │
│   ( $7.99  ➠  $3.99/Week )                │  struck price → new price, pill bg
│ Get 50% off your first month. After that, │  renewal-price promise 11–12 grey
│ your subscription renews at the regular   │
│ price. Cancel anytime.                    │
│            Time is limited!               │
│   ┌──────┐  ┌──────┐  ┌──────┐            │  3 timer boxes ≈72×72, r≈16
│   │  02  │  │  14  │  │  59  │            │  white 5 % fill
│   │hours │  │minutes│ │seconds│           │
│   └──────┘  └──────┘  └──────┘            │
│ [        Claim Limited Offer           ]  │  orange pill CTA
│ The subscription renews automatically till│  paragraph footer, bold links
│ you turn it off. Please see our **Privacy │  — NO Restore (R8)
│ Policy** and **EULA**                     │
└──────────────────────────────────────────┘
```
Demonstrates the sale + countdown template (ticket, struck price, renewal promise, timer). "50% off your first month" contradicts a "/Week" price (R10 copy mismatch); footer lacks Restore (R8).

### CAL-7 · In-feed "SPECIAL OFFER" banner on Home — `home-special-offer-banner.png`
```text
┌──────────────────────────────────────────┐
│ (⚙)                 [▮ Statistics] (💎Pro)│  top bar: settings, stats pill, PRO gem
│ Today, May 22                      (📅)   │
│ (S17)(M18)(T19)(W20●)(T21)(F22)(S23)      │  week strip, today = orange pill
│ ┌──────────────────────────────────────┐ │
│ │ SPECIAL OFFER (italic B)   [3D gift] │ │  banner ≈370×80, r≈20,
│ │ Unlock full nutrition experience     │ │  orange gradient, art at right
│ └──────────────────────────────────────┘ │
│ ┌ Short review … [Today's Insight Ready ›]┐ │  content cards continue
│ ┌ Eaten 1000kcal  (50 % ring)  Remaining 1000kcal ┐ │
│ tab bar (floating pill): Tracking | Add | Recipe   │
└──────────────────────────────────────────┘
```
Demonstrates a sale entry point placed in the feed under the date strip, same orange as the sale screen it opens. The PRO gem in the top bar is a second entry point.

### CAL-8 · Seasonal sale "99% Off" with millisecond timer (draft) — `draft-discount-countdown-ms.png`
```text
┌──────────────────────────────────────────┐
│ 9:41                              ▮▮ ≋ ▭ │  status bar
│        "Merry Christmas" script logo  (×)│  × tiny grey 20, top-right, low contrast
│   Special Offer to Unlock                 │  24 B navy, 2 lines
│   Premium Features                        │
│        99  %Off   (gradient purple→orange │  huge display numerals ≈120,
│           Santa hat on the 9)             │  Santa hat
│        Only $0.07/day                     │
│   Total $25.99/year ($51.98/year struck)  │
│            Time is limited!               │
│    [15] : [00] : [00]                     │  3 outlined boxes
│     Min    Sec    Milli                   │  minutes / seconds / milliseconds
│ [  Claim Limited Offer  ] snow on top     │  purple→orange pill, snow-cap decor
│ The subscription renews automatically till│
│ you turn it off. Please see our Privacy   │
│ Policy and EULA                           │
└──────────────────────────────────────────┘
```
Demonstrates the seasonal variant (Christmas, ms countdown). "99% Off" while $25.99 vs $51.98 is 50 % — wrong discount math (R6); no Restore (R8).

### CAL-9 · Intro-offer paywall with trial row (draft) — `draft-iap-intro-offer-trial.png`
```text
┌──────────────────────────────────────────┐
│ hero: line-art character on dashed paper │  (art/sketch content — leftover from
│ with crayons, palette                     │   another app, see §9 hidden-layer note)
│   Unlock All Features [PRO]   orange 24 B │
│ ┌──────────────────┐ ┌──────────────────┐ │  2 × 2 benefit chips
│ │∞ 1M+ exclusive   │ │🔥 Trending updated│ │
│ │  templates       │ │  sketches         │ │
│ ├──────────────────┤ ├──────────────────┤ │
│ │🔓 Unlock all     │ │AD Ad-free         │ │
│ │  features        │ │  experience       │ │
│ └──────────────────┘ └──────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │◉ 3 days free trial        $24.99     │ │  SELECTED, [Best Offer] pill
│ │  [Best Offer]             per week   │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │○ $5                then $24.99/week  │ │  intro offer: $5 first week
│ │  1 week                              │ │
│ └──────────────────────────────────────┘ │
│   🛡 No payment due today. Cancel anytime │  reassurance line just above CTA
│ [            Continue                  ] │
│ EULA      Restore Purchase   Privacy Policy │  3-column footer
└──────────────────────────────────────────┘
```
Demonstrates the introductory-price offer ($5 first week, then $24.99/week) next to a trial row, a 2 × 2 chip benefit grid and the 3-column EULA / Restore / Privacy footer. No close button.

### CAL-10 · "99% OFF … for a lifetime" on a weekly plan (draft) — `draft-paywall-lifetime-99off.png`
```text
┌──────────────────────────────────────────┐
│ 9:41  (no × anywhere)                    │  dark navy bg, jellyfish photo
│                                           │
│  99%     (huge gradient pink→peach ≈140)  │
│  OFF                                      │
│  The sale you've been waiting for!        │
│ ┌──────────────────────────────────────┐ │  outlined purple box r≈20
│ │ Only $0.99 for the first week        │ │
│ │     then $24.99/week                 │ │
│ └──────────────────────────────────────┘ │
│  Unlimited Access, now at 99% off for a   │
│  lifetime. There's no better deal         │
│ [      Claim Limited Offer       ]        │  purple→orange pill
│ The subscription renews automatically …   │
│ Privacy Policy and EULA                   │
└──────────────────────────────────────────┘
```
Demonstrates two real errors: "Lifetime" attached to a weekly plan (R7) and "99%" when $0.99 vs $24.99 is ≈96 % (R6); also no close button and no Restore.

### CAL-11 · Gift-box sale with 2-box timer (draft) — `draft-sale-giftbox-countdown.png`
```text
┌──────────────────────────────────────────┐
│ (⊗) white circle 36, top-left             │  mint/teal pastel bg
│ ┌──────────────────────────────────────┐ │  white card r≈28
│ │        flat teal gift box            │ │
│ │      Get a Special Offer  22 B       │ │
│ │      Change the way you feel         │ │
│ │           -50%   (teal 56 B)         │ │
│ └──────────────────────────────────────┘ │
│              [59] : [51]                  │  2 boxes (min : sec)
│   7-day trial. Then auto-renews at        │
│   $9.99 ~~$9.99~~ → $4.99 per year        │
│ [7-day trial] tag on CTA top-left edge    │
│ [ Try Free for 7 Days & Then Subscribe ]  │  green gradient pill
│ The subscription renews automatically     │
│ until you cancel. Please see our          │
│ Privacy Policy and EULA.                  │
└──────────────────────────────────────────┘
```
Demonstrates a calmer sale variant (card + 2-box timer + trial tag on the CTA). Copy error "$9.99 ~~$9.99~~" (duplicated price) — typo class R15.

### CAL-12 · Starburst sale with "View All Plans" (draft) — `draft-sale-starburst-trial.png`
```text
┌──────────────────────────────────────────┐
│ (⊗) top-left                              │  lavender bg
│          ✦ Special Offer ✦   22 B purple  │
│   For limited time only, offer ends soon  │
│   ███ purple blob with green outline ███  │  "50% OFF" inside blob,
│   ███        50%  OFF                ███  │  bleeds off left edge
│        ~~Was $9.99/year~~                 │
│      Total $4.99/year      (28 B navy)    │
│  Only $0.41/month, 7-day Free Trial       │
│          View All Plans (underlined)      │  escape to the full paywall
│ [            Continue                  ] │  purple pill
│ 7 days free trial, then $4.99/year, cancel anytime │  trial terms 10 px under CTA
└──────────────────────────────────────────┘
```
Demonstrates a sale that offers a "View All Plans" link back to the full plan list; trial terms are tiny and below the CTA (R4 class). No Restore/Privacy links.

### CAL-13 · AI Coach upsell card (draft) — `draft-sale-trial-card.png`
```text
┌──────────────────────────────────────────┐
│ 9:41      blurred food photo bg + dim     │
│  ┌────────────────────────────────────┐  │  card ≈354 wide, r≈28
│  │[CAI AI PRO]            50% OFF     │  │  header: pink→purple gradient
│  │ Unlock AI Coach         28 B white │  │
│  │ Precision nutrition at your        │  │
│  │ fingertips                         │  │
│  ├────────────────────────────────────┤  │
│  │ Use advanced AI camera scanning and│  │  white body
│  │ personalized meal recommendations  │  │
│  │ … Get a 50% discount.              │  │
│  │ $4.99/mo   ~~$9.99/mo~~            │  │  price 36 B + struck
│  │ [         Claim 50% Off          ] │  │  orange pill
│  │ Limited time offer. Cancel anytime.│  │
│  └────────────────────────────────────┘  │
│                 (⊗)                       │  close BELOW card, centred, small
└──────────────────────────────────────────┘
```
Demonstrates a feature-specific discount card over a dimmed photo with the close button below the card (bottom-centre). No legal links.

### CAL-14 · Wireframe "Upgrade Premium" (draft, greyscale) — `draft-sub1-yearly-weekly.png`
```text
┌──────────────────────────────────────────┐
│ ┌──────────────────────────────────────┐ │  image placeholder ≈370×270, r≈24
│ │              [img]                   │ │  (no close button)
│ └──────────────────────────────────────┘ │
│           Upgrade Premium   24 B          │
│  ◔ Unlimited Food Tracking                │  4 icon + text rows
│  🔒 Unlock Daily AI Insights              │
│  ↗ Unlock AI Chef                         │
│  ↗ Unlock Personalized Plans              │
│ ┌────────────────────────── (Best Offer) ┐│
│ │ Yearly Access               $0.96      ││  grey cards, no radio
│ │ Just $49.99 per year     per week      ││
│ └────────────────────────────────────────┘│
│ ┌────────────────────────────────────────┐│
│ │ Weekly Access               $3.99      ││
│ │                          per week      ││
│ └────────────────────────────────────────┘│
│ [            Continue  (black)         ] │
│ Term of Use      **Restore**    Privacy Policy │  Restore bold centre
└──────────────────────────────────────────┘
```
Demonstrates the low-fidelity structure the final paywalls were built from: hero → title → benefits → 2 plans → CTA → 3-link footer.

### CAL-15 · Context screens (`case-…`, other screen types — illustrate the type only)
| File | Wireframe (compact) | Shows |
|---|---|---|
| `case-onboarding.png` | full-bleed roast-chicken plate (top 60 %) with 4 glass callouts "110 kcal / 120 kcal / 550 kcal / 140 kcal" joined by dotted leaders → "Your AI / **Calorie Tracker**" (40 B, 2nd line orange) → 1-line subtitle → small centred pill "GET STARTED" (≈160×48) | welcome screen whose hero already demonstrates the core value |
| `case-camera-photo.png` | title "Ready to analyze" → photo r≈32 (≈370×370) → text field "Detail your meal to help AI analyze more accurately (Optional)" → chip "Meal Size (+)" → bottom: back circle (‹) 48 + orange pill "Analyze" | capture-review step before AI work |
| `case-processing.png` | photo with orange tint → staged text list fading out: "Detecting food items…" / "Estimating calories" / "Calculating macros" / "Generating AI insights" → bottom progress pill "Processing…" (fill ≈55 %) | processing state with staged steps |
| `case-insight-fail.png` | sheet with title "Daily Insight" + (×) top-right → 3D chart icon in grey circle → "Insight Didn't Load" → 2-line explanation → orange pill "Generate Insight" | error/empty state with recovery CTA |
| `case-ai-chef-no-result.png` | (×) top-right → 3D calculator+apple → "No perfect calorie matches" → explanation → chip "See alternatives below »" → "Cook with your ingredients anyway" + list rows (thumb, "Caramel apple pie", 🔥600kcal • ⏱60min, ›) | no-result state that still offers alternatives |
| `case-settings-upsell.png` | nav: (‹) "Settings" (💎Pro gem top-right) → grouped cards: Plan [↻ Recaculate Plan] (Calories 2000 kcal, Nutritions 500/400/600 g, Weight 75 kg) · Activity (Activity Level, Apple Health "Not connected") · System (Glass size 250ml, Unit lbs/ft, Language English) · Other (Privacy Policy, Write a Feedback, Share the App, Rate Us) | settings with only a PRO gem as entry point (no banner); "Recaculate" typo (R15) |
| `case-statistics-7days.png` | nav (‹) "Statistics" [7 days ▾] → "‹ May 26, 2026 - May 31, 2026 ›" → card "Eaten Calories" Goal 1500kcal, 7 rounded bars Mon–Sun (Fri highlighted orange) → card "Nutrition" stacked 100 % bars Carbs/Proteins/Fats + legend | data screen; "Fry" typo for Fri (R15 class) |

## 3. HOME AI F3 (iOS) — `home-ai-f3-ios/` (17 images)

Style family: dark luxury gold — bg #140905 with brown glow, yellow-gold gradient CTA, display title in gold gradient.
Frames 390 × 844 (iPhone 14/15).

### F3-1 · "Join Premium" 2-card paywall — `iap-paywall-v4-watermark.png`
```text
┌──────────────────────────────────────────┐
│ 9:41                              ▮▮ ≋ ▭ │
│                                     (×)  │  × 28 top-right, dark grey fill —
│ ┌──┐ ┌──────────────────────┐ ┌──┐       │  low contrast on dark bg (R1)
│ │  │ │ room render (centre) │ │  │       │  hero: room carousel, centre card
│ │  │ │ ≈190×200 r≈20        │ │  │       │  big, side cards peeking
│ └──┘ └──────────────────────┘ └──┘       │
│          Join Premium   (32, gold glow)   │
│  ✔ Get full access to features            │  4 gold-check rows
│  ✔ 200+ Premium templates                 │
│  ✔ Save without watermark                 │
│  ✔ Enjoy a smooth, ad-free experience     │
│ ┌──────────────┐ ┌──────[Save 86%]──────┐ │  2 side-by-side cards ≈160×136
│ │     1        │ │      12              │ │  left: dimmed glass (looks LOCKED)
│ │    Week      │ │     Months           │ │  right: gold border, SELECTED
│ │ $6.99 /week  │ │  $39.99 /year        │ │
│ │─────────────│ │──────────────────────│ │
│ │Billed weekly │ │   $0.96 /week        │ │  footer strip inside card
│ └──────────────┘ └──────────────────────┘ │
│──────────────────────────────────────────│  bottom panel
│ [        Try 3days for free           ]  │  yellow-gold pill ≈358×52
│  Try 3 days for free and then $39.99/year.│  trial line directly UNDER CTA
│              Cancel anytime!              │
│   Term of use  •  Privacy Policy  •  Restore │  ≈10 px, underlined
└──────────────────────────────────────────┘
```
Demonstrates the 2-card horizontal picker: pre-selected yearly card glows while the weekly card looks disabled (R2). "Try 3days" missing space (R15). "Save 86%": $39.99/yr vs $6.99×52 = $363 → 89 % — near but not exact (check R6).

### F3-2 · Limited Offer sale 50 % — `sale50-limited-offer.png`
```text
┌──────────────────────────────────────────┐
│ Restore Purchase (12, 70 %)        (×)   │  top bar: Restore text left, × right
│  ┌────────────────────────────────────┐  │  glass card r≈32, faint grid
│  │   3D gold gift box + stars          │  │
│  │      Limited Offer  (gold display)  │  │
│  │ Unlock every room, style, and       │  │
│  │ premium tool.                       │  │
│  │          50% OFF  (≈72 white)       │  │
│  │   $39.99  »  $19.99/Year (gold B)   │  │  struck → new, double chevron
│  └────────────────────────────────────┘  │
│ Your 50% off price stays the same at renewal. │  renewal-price promise
│            Offer ends in  (gold)          │
│   ┌──────┐  ┌──────┐  ┌──────┐            │  3 boxes ≈72×72, r 16, white 5 %
│   │  02  │  │  14  │  │  59  │            │
│   │hours │  │minutes│ │seconds│           │
│   └──────┘  └──────┘  └──────┘            │
│   Secure payment via Apple. Cancel anytime.│  reassurance above CTA
│ [            Get Offer                 ]  │  gold pill
│   Privacy Policy  |  Restore  |  Terms of Use │
└──────────────────────────────────────────┘
```
Demonstrates the reference sale layout: price commitment at renewal, countdown boxes, reassurance line, full three-link footer (good). Countdown layer is a static dev mock (R5).

### F3-3 · Rewarded gate "Finish up your design" — `reward-dialog-discover.png`, `reward-dialog-product.png`
```text
┌──────────────────────────────────────────┐
│ underlying screen blurred + dimmed        │  (Discover feed / Product screen)
│  ┌────────────────────────────────────┐  │  white sheet-card r≈32,
│  │                               (×)  │  │  × grey circle 24 inside top-right
│  │   Before ↷ After  (tilted photos,  │  │  illustration: before/after
│  │   gold glow on "After")            │  │
│  │     Finish up your design   22 B   │  │
│  │ Get unlimited access with PRO, or  │  │
│  │ just keep watching ads!            │  │
│  │ ┌────────────────────────────────┐ │  │  primary ≈326×50 gold gradient
│  │ │👑   Remove limit            ›  │ │  │  2-line label
│  │ │     Join Premium               │ │  │
│  │ └────────────────────────────────┘ │  │
│  │ ┌────────────────────────────────┐ │  │  secondary: cream fill, gold border
│  │ │[AD]  Generate now       [FREE] │ │  │  AD icon left, black FREE pill right
│  │ │      Watch an ads              │ │  │
│  │ └────────────────────────────────┘ │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```
Covers both files (identical dialog, different screen underneath). Demonstrates the balanced two-row gate: Premium more prominent, ad option equal size with "FREE" label. "Watch an ads" grammar error (R15).

### F3-4 · Save-mode / remove-watermark bottom dialogs — `dialog-save-mode.png`, `dialog-remove-watermark.png`
```text
┌──────────────────────────────────────────┐
│ Result screen (blurred): (×) Result (⎘)  │
│ big result image                          │
│  ┌────────────────────────────────────┐  │  bottom-anchored card r≈32
│  │  Choose save mode            (×)   │  │  / "Remove Watermark"
│  │ [👑  Save ad-free          ›     ] │  │  / "Remove watermark"
│  │ [    Join Premium               ] │  │
│  │ [AD  Save image          [FREE] ] │  │  / "Remove with ad"
│  │ [    Watch an ads              ] │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```
Same component as F3-3 without illustration/description. Demonstrates the monetization moment at save time: Premium = save without ads / watermark, ad = free path.

### F3-5 · Native ad inside onboarding — `onboarding-native-ad.png`
```text
┌──────────────────────────────────────────┐
│ full-bleed house photo (top ≈55 %)        │  inset before/after thumb + arrow
│   Design your Dream Home  (gold accent)   │
│        in seconds                         │
│ ▬ ● ● ●                         Next      │  dots + CTA shrunk to TEXT "Next"
│┌────────────────────────────────────────┐│  native ad ≈390×260
││[img] [Ad] Shopee: Mua Sắm Online  ⓘ ▷ ││  "Shopee: Mua Sắm Online" = Shopee: Online Shopping
││      Sponsored                         ││
││ ad creative image                      ││
││[        Săn Sale Ngay               ]  ││  "Săn Sale Ngay" = Hunt deals now (ad CTA, orange)
│└────────────────────────────────────────┘│
└──────────────────────────────────────────┘
```
Demonstrates a native-ad slot of 390 × 260 below onboarding content; the app's own CTA shrinks to a text "Next" while the ad's button is the biggest button on screen.

### F3-6 · Splash with ad disclosure — `splash-ad-disclosure.png`
```text
┌──────────────────────────────────────────┐
│ full-bleed interior photo, fades to dark  │
│          WELCOME TO                       │
│        HOME MAGIC AI  ("MAGIC AI" gold)   │
│      Please wait, loading...              │
│   ━━━━━━━━━━━──────────────────────       │  thin progress bar ≈280
│  (This action may contain advertisement)  │  disclosure 11 px grey
└──────────────────────────────────────────┘
```
Demonstrates the app-open ad splash: progress bar + disclosure that an ad may follow.

### F3-7 · Settings / Home entry points — `banner-sub-crown.png`, `case-settings-banner-iap.png`, `case-home-crown.png`
```text
banner-sub-crown.png  (≈358×126, r≈16)
┌──────────────────────────────────────────┐
│ Unlock All          │ [room]  [house] (👑)│  gradient gold→brown
│ Features (gold)     │      [50% OFF ticket]│  2 tilted photos + crown badge
│ Premium yearly plan now at half price    │  + yellow "50% OFF" ticket
└──────────────────────────────────────────┘
case-settings-banner-iap.png
┌──────────────────────────────────────────┐
│ (←)            Settings                   │
│ ┌──────────────────────────────────────┐ │  banner ≈358×126 r≈24
│ │ Home Magic (gold)        [room photo │ │  orange→cream gradient, sparkle
│ │ Subscribe now to enjoy    + 5 thumbs]│ │
│ │ VIP benefits                         │ │
│ └──────────────────────────────────────┘ │
│ (🌐) Language                       ›    │  rows: icon circle 40 + label + chevron
│ (★) Rate Us · (👍) Feedback · (⇪) Share App · (🛡) Privacy Policy
│ (▭) Restore Purchase · (⇧) Check App Update · (★) Updates · (👤) GDPR
└──────────────────────────────────────────┘
case-home-crown.png
┌──────────────────────────────────────────┐
│ ⌂ HOME AI INTERIOR             (👑) (⚙)  │  crown button 32 gold = Premium entry
│ carousel: "Find Furniture" + 3 thumbs 10+ │
│ Special tools ▸ 3 tiles · Hot tools ▸ 3 tiles
│ floating tab bar: Home · HelperAI · Discover · My creation
└──────────────────────────────────────────┘
```
Demonstrates three entry points: crown button in the top bar, banner at the top of Settings (with Restore Purchase as a row below), and a "half price" sale banner.

### F3-8 · Locked step with crown CTA — `case-step-locked.png`
```text
┌──────────────────────────────────────────┐
│ (←)      ①───②───③              (⚙?)     │  3-step stepper
│ Choose your room vibe!                    │
│ ( 80s Style ) ( Ancient Egyptian ) ( Biophilic )   3-col circle grid ≈110
│ ( Mediterranean ) ( Luxury ) ( Japandi )
│ ( Bohemian ) ( Cabin ) ( Coastal ✔ )     │  selected = gold ring + check
│ ( … row 4 cut off … )                     │
│ ┌ bottom panel ───────────────────────┐  │
│ │ [        Generate now 👑         ]  │  │  pale-gold pill with crown =
│ └─────────────────────────────────────┘  │  tapping opens the gate (F3-3)
└──────────────────────────────────────────┘
```
Demonstrates "tap locked feature → gate": the crown on the primary CTA warns that generation is Premium / ad-gated.

### F3-9 · Context screens (`case-…`)
| File | Wireframe (compact) | Shows |
|---|---|---|
| `case-ai-loading.png` | dark bg with faint grid → 3D armchair + lamp → "58%" gold → progress bar ≈330 → "AI is processing..." → "The transformation process takes 15-20 seconds. Please do not lock your device" | processing state with % and expected duration |
| `case-chat-assistant-picker.png` | bottom sheet (grabber) "Choose Your Assistant" / "Pick the perfect AI companion for you" → 2 × 2 photo cards (House Stylist, Garden Designer, Exterior Arch ✔, Renovation Pro) with radio top-right → yellow pill "Confirm" | selection sheet |
| `case-dialog-no-internet.png` | centred card r≈28 with (×) → mascot illustration → "No Internet" / "Please check your WiFi or 4G connection" → 2 buttons: grey "Settings" + yellow "Try again" | error dialog |
| `case-empty.png` | top bar (crown, gear) → stacked photo cards illustration → "Board is empty" / "We couldn't find any designs mactching your query" → yellow pill "Create Now" → tab bar (My creation active) | empty state; typo "mactching" (R15) |
| `case-permission-photos.png` | Home with "Your workspace 🔥" card → blurred photos → "Access to Photos" / "Allow the app to access and store your photos for easy uploads" → yellow "Allow Access" | in-context permission pre-prompt |

## 4. Home AI F2 ("Android", drawn on iPhone frames) — `home-ai-f2-android/` (21 images)

Style family: dark red-orange — bg #101011, photo collage fading into the dark, selected card tinted red, CTA red → orange. In-app screens are light
with red accent. All frames are iPhone 393 × 852 with Dynamic Island — the "Android" project was drawn on iPhone frames (no Material, no navigation
bar; see [monetization-screens.md §9](monetization-screens.md#9-file-quality-problems-common-in-maintenance)).

### F2-1 · 2-row paywall, yearly or weekly-trial selected — `m01-iap-yearly-selected.png`, `m02-iap-weekly-trial-selected.png`
```text
┌──────────────────────────────────────────┐
│ 9:41  (Dynamic Island)            ▮▮ ≋ ▭ │
│ Restore (12, top-left, over photos)  (×) │  × 32 dark circle top-right
│ ╱ tilted collage of room renders,  ╱     │  hero ≈ top 40 %, fades into #101011
│╱  gold-outlined cards              ╱      │
│        HomeAI [PRO⊕]                      │  wordmark + red→orange PRO pill
│        Unlock All Features   (grey 20)    │
│ ┌──────┐┌──────┐┌──────┐┌──────┐          │  4 benefit tiles ≈84×88, r 12
│ │Ads-Free││100+ ││Remove ││All Styles│     │  m01: Ads-Free Experience · 100+ Templates ·
│ │Experience│Templates│Watermark│Access │    │       Remove Watermark · All Styles Access
│ └──────┘└──────┘└──────┘└──────┘          │  m02: 100+ Templates · Remove Watermark ·
│                                           │       All Styles Access · Ultra-Fast Render
│ ┌──────────────────────────────────────┐ │
│ │ ○ Weekly              $9.99/week     │ │  m01: unselected
│ │                     3 days free trial│ │
│ └──────────────────────────────────────┘ │
│ ┌───────────────────────────[Best Offer]┐│  m01: SELECTED, dark-red fill, red border,
│ │ ◉ Yearly             $19.99/year     │ │  red check-circle
│ │                         $0.86/week   │ │
│ └──────────────────────────────────────┘ │
│  m01: Auto - renew. Cancel anytime        │  line above CTA changes with selection
│  m02: Try 3 days for free, then $9.99/week. (price in red)
│ [  m01: Upgrade Now | m02: Start Free Trial ] │  red→orange pill ≈360×56, gloss stripes
│      Privacy Policy   •   Terms of Use    │  footer (Restore is at the top instead)
└──────────────────────────────────────────┘
```
Covers m01 and m02: same template, the selected row, the "Best Offer" badge position (it moves to whichever row is selected), the line above the CTA and the CTA label all switch together. Demonstrates the good practice of naming the trial in the CTA when the trial plan is selected.

### F2-2 · Single-plan free-trial paywall — `m03-free-trial-paywall.png`
```text
┌──────────────────────────────────────────┐
│ Restore (top-left)       — NO × visible   │  same collage hero as F2-1
│          [ 3 DAYS FREE ]                  │  red→orange pill badge ≈170×44
│         Unlock Everything   28 B white    │
│ Explore every feature. Nothing charged today. │
│ [Ads-Free Experience][100+ Templates][Remove Watermark][All Styles Access]
│ ┌──────────────────────────────────────┐ │  single plan card, red border
│ │ Weekly Plan                3 days free│ │
│ │ Billed after free trial ends then$9.99/week │
│ └──────────────────────────────────────┘ │
│ We'll remind you before your trial ends. Cancel anytime. │  reassurance (best of the 5 projects)
│ [         Start My Free Trial          ] │
│      Privacy Policy   •   Terms of Use    │
└──────────────────────────────────────────┘
```
Demonstrates the one-plan trial paywall with the strongest reassurance copy ("Nothing charged today", "We'll remind you before your trial ends"). No visible close button in this frame (hard-paywall position at the end of onboarding — the project note says "no skip past the Sub screen"). "then$9.99" missing space (R15).

### F2-3 · Free-trial toggle intro — `m04-free-trial-toggle-intro.png`
```text
┌──────────────────────────────────────────┐
│ bg: red/pink gradient top → near-white    │
│                                           │
│        ┌────────────────────┐             │  large 3D toggle ≈180×96
│        │ (✦ chrome knob)    │             │  knob on the left (= about to switch on)
│        └────────────────────┘             │
│      Your 3-day free trial                │  "3-day free trial" in red, 24 B
│           is ready                        │
│                                           │  no buttons — transition screen
└──────────────────────────────────────────┘
```
Demonstrates a transition screen shown just before the paywall to prime the trial.

### F2-4 · Sale 50 % yearly with countdown — `m05-sale-50-countdown.png`
```text
┌──────────────────────────────────────────┐
│ Restore Purchase (12)               (×)  │
│        Limited Offer   (32, "Offer" peach) │
│  Unlock every room, style, and premium tool. │
│   ┌─────────────────────────────────┐     │  3D pink ticket, stacked shadow tickets
│   │        50%                      │     │
│   │     OFF YEARLY                  │     │
│   └─────────────────────────────────┘     │
│   $49.99  »  $24.99/Year (pink)           │
│  Your 50% off price stays the same at renewal. │
│            Offer ends in                  │
│   [02 hours] [14 minutes] [59 seconds]    │  3 dark boxes ≈72×72
│  Secure payment via Apple. Cancel anytime.│  ← Apple wording in an Android project (R9)
│ [             Get Offer                ] │  pink→orange pill
│   Privacy Policy  |  Restore  |  Terms of Use │
└──────────────────────────────────────────┘
```
Same template as HOME AI F3 sale (F3-2) re-skinned red. Demonstrates template reuse across apps — and how platform copy leaks with it (R9). $24.99 here vs $19.99/year on the paywall (R10 price mismatch between screens).

### F2-5 · Rewarded gate "Bring your design to life" — `m06-upgrade-pro-reward-ad-dialog.png`
```text
┌──────────────────────────────────────────┐
│ Preview screen dimmed: (‹) Preview (⚑)   │
│  ┌────────────────────────────────────┐  │  card r≈28
│  │ before | after split photo    (×)  │  │  × dark circle on image top-right
│  │ with sparkles  (≈360×220)          │  │
│  │  Bring your design to life  22 B   │  │
│  │ Go PRO for unlimited access, or    │  │
│  │ watch an ad to keep going.         │  │
│  │ [ Upgrade PRO⊕ ]   [ 🎬 Watch Ads ]│  │  two equal-width buttons side by side:
│  └────────────────────────────────────┘  │  red→orange vs light grey
│  (Regenerate) (Save) (Share) dimmed       │
└──────────────────────────────────────────┘
```
Demonstrates the side-by-side variant of the gate: Premium is coloured, ad is neutral, same size.

### F2-6 · Remove-watermark sheet — `m07-remove-watermark-dialog.png`
```text
┌──────────────────────────────────────────┐
│ Preview (before/after slider) dimmed      │
│  ┌────────────────────────────────────┐  │  bottom card r≈28
│  │   3D "AI" logo + eraser       (×)  │  │
│  │      Remove HomeAI Logo?           │  │
│  │ [ Remove Watermark               ] │  │  red pill, 2 lines
│  │ [ Upgrade to PRO                 ] │  │
│  │          Maybe Later (underlined)  │  │  text dismiss
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```
Demonstrates the save-time watermark upsell with a soft "Maybe Later" dismissal (Premium only, no ad path).

### F2-7 · Remove-watermark dialog with native ad (draft) — `draft-remove-watermark-with-native-ad.png`
```text
┌────────────────────────────────────┐  dialog ≈360×390
│                               (×)  │
│     purple 3D "Ai" + eraser        │
│     Remove AppName Logo?           │
│ ┌────────────────────────────────┐ │  Premium: OUTLINED pink (weaker)
│ │ 💎  Remove forever             │ │
│ │     Upgrade to premium         │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │  Ad: FILLED pink gradient (stronger)
│ │ AD  Remove once                │ │
│ │     Watch an Ads               │ │
│ └────────────────────────────────┘ │
│ [Ad] ▷ thumb  Sollicitudin diam    │  native ad strip with "Open" pill
│       eleifend / Lorem ipsum …  [Open] │
└────────────────────────────────────┘
```
Demonstrates two discouraged gate variants at once: ad button stronger than Premium (inverted hierarchy — avoid) and a native ad inside the dialog (cluttered). "Watch an Ads" (R15).

### F2-8 · Paywall drafts — `draft-iap-colorful.png`, `draft-iap-old-brand.png`
```text
draft-iap-colorful.png  (DreamSpace brand, same template as F2-1)
│ Restore                              (×) │
│ dark empty card grid (placeholder hero)   │
│        Get DreamSpace PRO   28 B          │
│ [Ads-Free][100+ Templates][Remove Watermark][All Styles Access]  coloured icon tiles
│ ○ Yearly   $9.99/week  3 days free trial  │  ← weekly price labelled "Yearly" (copy error)
│ ◉ Yearly  $19.99/year  $0.86/week [Best Offer]
│ Auto - renew. Cancel anytime              │
│ [   Start Free Trial  (✦)   ]             │  CTA says trial while yearly (no trial) is selected (R4)
│ Privacy Policy • Terms of Use             │

draft-iap-old-brand.png  (HomeMagic Pro)
│                                       (×)│  × tiny, low contrast on photo (R1)
│ full-bleed Moroccan interior photo        │
│        [app icon]  HomeMagic Pro          │
│ (100% Ad-Free)(🔓 Access all design styles)(🔓 100+ Te… │  chip rows overflow both edges
│ (Export without Watermark)(🔓 Ultra-Fast 3D rendering)( │  (horizontal scrolling chips)
│ ┌ Weekly [3-day free trial]  $9.99 / week ┐ SELECTED, pink→orange border
│ ┌ Monthly  $19.99 / month  Just $1.35/week  [SAVE 50%] ┐
│ Renew $9.99/weekly. Cancel anytime!       │
│ [      Start Free Trial      → ]          │  pink→orange pill
│ Privacy Policy • Terms of use • Restore   │
```
Demonstrates earlier iterations: placeholder hero, coloured tiles, horizontally overflowing benefit chips. Observed price errors: "$19.99/month — Just $1.35/week" (≈ $4.60/week in reality) and "SAVE 50%" vs ≈ 54 % — discount math (R6).

### F2-9 · Banners — `banner-sale-50.png`, `draft-upgrade-banner.png`
```text
banner-sale-50.png  (≈358×136, r≈20, pink→red gradient)
┌──────────────────────────────────────────┐
│ Unlock                  ✦ [room cards with│
│ Every Style               tags Tropical / │
│ Transform your space with Minimalist /    │
│ AI-powered interior design.  Modern]      │
│ [ Get 50% Off ]  white pill               │
└──────────────────────────────────────────┘
draft-upgrade-banner.png  (≈358×96, red gradient)
┌──────────────────────────────────────────┐
│ Go PRO for smarter design      [3D house │
│ Unlock full access to styles,   + paint  │
│ palettes, and tools              roller] │
└──────────────────────────────────────────┘  no button — the whole banner is the tap target
```
Demonstrates the banner pattern: title + one line + small pill, illustration on the right, same colour as the sale/paywall it opens.

### F2-10 · Settings "Go PRO / BOOSTER" banner — `case-settings-upgrade.png`
```text
┌──────────────────────────────────────────┐
│ (‹)             Settings                  │
│ ┌──────────────────────────────────────┐ │  banner ≈358×110, red→pink swirl, 3D house
│ │ Go PRO                               │ │
│ │ Unlock full access to styles,        │ │
│ │ palettes, and tools                  │ │
│ │[BOOSTER ⚡] white tab bottom-left    │ │
│ └──────────────────────────────────────┘ │
│ 🛍 Manage Subscription               ›   │  subscription rows FIRST
│ ⟲ Restore Purchase                   ›   │
│ 🌐 Language · ☆ Rate us · 💬 Feedback · ⇪ Share app · 🛡 GDPR
│ 🔒 Privacyy Policy · ☁ Check app update   │  "Privacyy" typo (R15)
└──────────────────────────────────────────┘
```
Demonstrates the Settings entry point: banner at top, Manage Subscription and Restore Purchase directly under it.

### F2-11 · Save-option sheet — `save-options-sheet.png`
```text
┌──────────────────────────────────────────┐
│ Preview (before/after, watermark ⊗ bottom-right) dimmed │
│ ┌──────────────────────────────────────┐ │  bottom sheet, grabber
│ │        Select download option        │ │
│ │ [PRO⊕ red tile]  Save without ads [PRO] │  56 icon tile + title + PRO pill
│ │                  Ads-free and best image quality │
│ │ [⬇ blue tile]    Free Save           │ │
│ │                  Watch an ads and standard quality │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```
Demonstrates the save-mode choice as a list sheet (Premium = no ads + best quality, free = ad + standard quality). Note the watermark badge with ⊗ on the image — tapping it is the other entry to F2-6.

### F2-12 · Onboarding Rate Us — `rate-us-onboarding.png`
```text
┌──────────────────────────────────────────┐
│          Enjoying Home AI?   22 B         │
│ If you're loving your first design, we'd  │
│ appreciate your feedback.                 │
│  room photo with cut-out sticker furniture│  (table, chair, frame with white outline,
│  and sparkles                             │   sparkles)
│        ( ★ ★ ★ ★ ★ ) glass pill            │  5 stars, pre-filled
│ [              Continue                ] │  red pill
└──────────────────────────────────────────┘
```
Demonstrates the Rate Us step placed after the paywall at the end of the selling onboarding (§7).

### F2-13 · Splash and ad slots — `splash-ad-disclosure.png`, `case-detecting-with-ad.png`
```text
splash-ad-disclosure.png
│ pink-white gradient · centred "Dream Space" logo (house outline)
│                Almost there...
│ ━━━━━━━━──────────────────────────  red progress ≈30 %
│      (This action may contain advertisement)
case-detecting-with-ad.png
│ (‹) Replace Object (?)                    │
│ photo dimmed · ✦ wand  "Detecting objects..." │
│ tool panel: Auto · Manual · Erase / chips "All (5)" + "Loading" ×5 / [Continue] disabled
│ ┌ [ADS] Ad Zone ─────────────────────────┐ │  banner slot at the very bottom, ≈50 tall
│ │ In order to continue developing the app, we need show Ad in this position. │
│ └────────────────────────────────────────┘ │
```
Demonstrates the app-open ad disclosure and a banner ad slot kept at the bottom of a tool screen even during a loading state ("Ad Zone" placeholder copy explains the slot to devs).

### F2-14 · Context screens (`case-…`)
| File | Wireframe (compact) | Shows |
|---|---|---|
| `case-home.png` | "HomeAI" + [PRO⊕] pill + ⚙ → "Interior Renovation": big before/after card "Interior Design" (↗) + 2 × 2 tool cards (Replace Object, Reference Style, New Material, Clean Up) → "Exterior Renovation": big card "Exterior Design" + 2 cards (Garden Design, Exterior Wall) → floating tab bar Design · Explore · Profile | home hub; PRO pill in top bar is the permanent entry point |
| `case-empty-profile.png` | "Profile" + [PRO⊕] + ⚙ → 3D house + paint brush → "No Designs Yet" / "Start your first project and bring your ideas to life" → red pill "Discover Now" → tab bar | empty state |
| `case-generating.png` | photo with cyan scan line + teal tint → "72%" red 32 B → "Generation AI magic..." → bottom grey: "The transformation process takes 15-20 seconds. Please do not lock your device." | processing with % |
| `case-generation-failed.png` | dimmed processing screen → bottom card (×) → 3D broken-image icon → "Generation Failed" / "An unexpected issue occurred. Please try regenerating the photo." → red pill "Got It" | error sheet |

## 5. Sketra AR Drawing F2 (iOS) — `sketra-f2/` (22 images)

Style family: pastel pink — light pink gradient background, pink gradient CTA with diagonal gloss stripes, 3D illustrations (mascot robot,
palette, pencils); the sale dialog drifts to cream / gold. Frames 390 × 844 unless stated.

### SK-1 · Hard paywall, 2 rows "Annual / 3-day free Trial", no close — `iap-annual-weekly-save92.png`
```text
┌──────────────────────────────────────────┐
│ 9:41                              ▮▮ ≋ ▭ │  NO close button anywhere (hard paywall, R1)
│   hero ≈ 0–330: palette + brush 3D,       │
│   line-art cards (anime) fanned, sparkles │
│ ┌ 3D gift box ┐ ▓ Sketra* VIP ▓▓▓▓▓▓▓▓▓▓ │  logo ribbon over the hero/sheet seam
│ ╭────────────────────────────────────────╮│  white sheet r≈24 starts ≈370
│ │ ┌────┐ ┌────┐ ┌────┐ ┌──             ││  4+ benefit tiles ≈ 92 × 88, r16, pink tint,
│ │ │200+│ │Rem.│ │Unl.│ │Unli…  (cut)    ││  scroll horizontally; 4th tile cut at the edge
│ │ │Pro │ │100%│ │full│ │gener…          ││  "200+ Pro templates" · "Remove 100% Ads" ·
│ │ └────┘ └────┘ └────┘ └──             ││  "Unlock full features" · "Unlimited generat…"
│ │                         [SAVE 92%]    ││  badge pill on the card's top-right edge
│ │ ┌────────────────────────────────────┐ ││  SELECTED: pink tint + pink border, r16, ≈ 74 tall
│ │ │ Annual Plan          Just $0.38    │ ││  weekly-equivalent price is the big number (R3)
│ │ │ $35.99 → $19.99 /year  per week    │ ││  struck price → new price with an arrow
│ │ └────────────────────────────────────┘ ││
│ │ ┌────────────────────────────────────┐ ││  unselected: grey fill, no border
│ │ │ 3-day free Trial     Then $4.99    │ ││
│ │ │                       per week     │ ││
│ │ └────────────────────────────────────┘ ││
│ │      Auto-renewed. Cancel anytime!     ││  11 grey
│ │ ( CONTINUE                        → )  ││  pill 56, pink gradient + gloss stripes
│ │ Privacy Policy  •  Terms of use  • Restore ││ 11, one row
│ ╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```
Shows the hard paywall (no close, no Skip) at the end of onboarding, and the "SAVE 92%" claim that does not match the prices
($35.99 → $19.99 ≈ 44 % off) — R6. Weekly price ($4.99) here differs from SK-2 ($8.99) — R10.

### SK-2 · Same paywall, Weekly-trial vs Yearly, with close — `iap-weekly-trial-start-free-trial.png`, `iap-yearly-selected-weekly-trial.png`
```text
│ hero as SK-1 · (×) 24 top-right, white 20 % on a light photo → hard to see (R1)
│ benefit tiles as SK-1
│ [Most Popular]                              badge tab on the card's top-left edge (pink, slanted end)
│ ┌────────────────────────────────────────┐  state A (trial file): Weekly SELECTED (pink tint + border)
│ │ Weekly Access              $8.99/week  │  "3-day Free Trial" under the title
│ │ 3-day Free Trial                       │
│ └────────────────────────────────────────┘
│ ┌────────────────────────────────────────┐  state B (yearly file): Yearly SELECTED instead,
│ │ Yearly Access             $39.99/year  │  Weekly card turns grey but keeps "Most Popular"
│ │ Only $2.79/week                        │
│ └────────────────────────────────────────┘
│ A: "3days free trial. Then 8.99$/ week. Cancel anytime!"  (price in pink)    B: "Auto-renewed. Cancel anytime!"
│ ( START FREE TRIAL → )   ← state A          ( CONTINUE → )   ← state B
│ Privacy Policy • Terms of use • Restore
```
Shows the CTA label and the line above it **changing with the selected plan** (trial plan → "Start free trial" + trial terms; paid plan →
"Continue" + auto-renew note). Trial terms sit directly above the CTA (good placement, §3.5).

### SK-3 · Onboarding paywall, single plan, "Skip" + "Restore Purchase" text — `pw-onboarding-skip-restore.png`, `pw-onboarding-variant.png`
```text
┌──────────────────────────────────────────┐
│ Skip                    Restore Purchase │  text only, 15 grey, no ×  — weak exit (R1)
│  ┌─┐ ┌────────────────────────────┐ ┌─┐  │  hero carousel: centre line-art card ≈ 210 × 380 r24,
│  │ │ │   chibi girl line-art       │ │ │  │  side cards peek (pink / lilac); 3D mascots overlap
│  │ │ │                             │ │ │  │  the edges (flame, robot painter, book)
│  └─┘ └────────────────────────────┘ └─┘  │
│        Unlock All                        │  title 24 Bold pink, 2 lines, centred
│     Premium Features                     │  variant file: "A world of lessons, / ready at your level"
│ 3 days free trial, then $8.99/week       │  14 semibold; "then $8.99/week" grey
│ (✓ shield) No payment due today. Cancel anytime │  reassurance row, 12
│ ( CONTINUE                          → )  │  pill 56 pink gradient
│ By continuing you agree to our Privacy Policy, Terms of Service and Subscription Terms │ 11, links bold
└──────────────────────────────────────────┘
```
Shows the one-plan onboarding paywall (no plan picker), with A/B title variants on the same layout (`pw_us_3`). Exit is a grey "Skip" word only.

### SK-4 · Sale dialog "Special offer 50%" with no price — `dialog-sale-50-no-price.png`
```text
│ Congratulations screen dimmed (scrim ≈ 50 %)
│        ┌──────────────────────┐             gold ticket card overlapping the dialog top:
│        │ SPECIAL OFFER         │             "SPECIAL OFFER" + "50% sale" in 3D gold + crown
│  ╭─────│  50% sale    ♛        │─────╮       sparkles around
│  │     └──────────────────────┘      │      cream dialog r≈28, ≈ 342 wide
│  │ (icon) Unlimited Pro template     │      2 benefit rows, icon tile 28
│  │ (icon) Unlock full feature        │
│  │ ( Claim Now )                     │      pill 56, brown/gold gradient
│  ╰───────────────────────────────────╯
│                 (×)                          close 24 BELOW the dialog, grey circle
```
Shows a sale popup with **no price and no terms**, only "50%" (R14), and the sale's own event language (gold ticket, cream instead of pink).

### SK-5 · Rewarded gates — "Unlock drawing mode" / "Finish up your artwork" — `dialog-limit-unlock-drawing-mode-reward.png`, `reward-dialog-limit-generate.png`
```text
│ tool screen dimmed behind (scrim ≈ 40 %)
│ ╭──────────────────────────────────────╮    white card r≈28, ≈ 358 × 445, centred
│ │                                  (×) │    × 24 grey circle, top-right
│ │   [3D app-icon card: robot painter,  │    illustration ≈ 150 × 170, "Premium" ribbon,
│ │    "Premium" ribbon, "AI" sticker]   │    "AI" badge
│ │        Unlock drawing mode           │    title 20 Bold — contextual (other file: "Finish up your artwork")
│ │ Get unlimited access with PRO, or just keep watching ads! │ 14 grey, 2 lines
│ │ ┌──────────────────────────────────┐ │    PRIMARY: pink gradient pill 48,
│ │ │ ⤓   Remove limit             ›   │ │    title + sub "Join Premium"
│ │ │     Join Premium                 │ │
│ │ └──────────────────────────────────┘ │
│ │ ┌──────────────────────────────────┐ │    SECONDARY: light pink fill + pink border, same size,
│ │ │ [AD]  Drawing now        [FREE]  │ │    "AD" icon left, black "FREE" pill right,
│ │ │       Watch an ads               │ │    sub "Watch an ads" (typo, R15); other file: "Generate now"
│ │ └──────────────────────────────────┘ │
│ ╰──────────────────────────────────────╯
```
Shows the rewarded-ad gate pattern (§4): two equal-height rows, Premium visually stronger, the ad option labelled FREE, title tied to the
action that was blocked.

### SK-6 · Selling onboarding chain — `social-proof.png`, `case-fake-processing.png`, `trust-before-payment.png`, `appstore-sheet-mock.png`
```text
social-proof                         case-fake-processing (390 × 852)
┌────────────────────────────┐       ┌────────────────────────────┐
│  laurel ⟨ 100k+ App Ratings │       │                            │
│          4.5  ★★★★★ ⟩      │       │   3D pencil box ≈ 140      │
│  Join Millions   (pink 28)  │       │ [██████░░░░░░░░]  40%      │  progress bar 316 × 36 r18
│  of happy creators (black)  │       │ ◌ Reading your drawing level │  current step 16 + spinner
│  People around the world…   │       │   Matching your template picks│  next steps fade out
│  [card fan: 3 line-art,     │       │   Sorting lessons by difficulty│  (grey → lighter)
│   centre one raised]        │       │   Building your path        │
│  ◯◯◯◯◯◯◯  7 avatars         │       └────────────────────────────┘
│  Loved by creators worldwide│
│ ( CONTINUE → )              │
└────────────────────────────┘
trust-before-payment                 appstore-sheet-mock
┌────────────────────────────┐       ┌────────────────────────────┐
│ paywall blurred + grey scrim│       │ paywall blurred + scrim     │
│        app logo 3D          │       │╭──────────────────────────╮│  sheet from ≈ 350, r≈28
│  Nothing charged today (20) │       ││ App Store            (×) ││
│     Secured by Apple   (14)│       ││ ┌──────────────────────┐ ││
└────────────────────────────┘       ││ │  Payment Content      │ ││  grey placeholder box
                                     ││ └──────────────────────┘ ││
                                     │╰──────────────────────────╯│
```
Shows the screens around the paywall in a selling onboarding: social proof (unverified counts, R11; brand name "PicTrace" left in copy — a
leftover from another app), a fake "processing" screen with % (R12), a reassurance screen before payment, and a **mock App Store sheet** so
developers see the purchase step in the flow.

### SK-7 · Retention gift — "Congratulations" lesson ticket — `streak-gift-ticket.png` (393 × 853), `unlock-ticket.png`
```text
│ previous screen dimmed (scrim ≈ 50 %)
│   CONGRATULATIONS  (display, white outlined, slanted, confetti)
│  ═══ metal slot bar (ticket printing out of a machine) ═══
│  ┌──────────────────────────────────┐    pink ticket ≈ 290 wide, perforated bottom edge (row of holes)
│  │ You've unlocked a new course—    │    16 semibold, centred
│  │ Create more, get more gifts      │
│  │ - - - - - - - - - - - - - - - - -│    dashed tear line
│  │  ┌[NEW]──────────────────┐       │    template card 180 × 220 r20, green "NEW" tab
│  │  │  character line-art   │       │
│  │  │ ID #00001      ✦ ✦ ✦  │       │
│  │  └───────────────────────┘       │
│  │ ✺ LESSON TOPIC   ✺ DRAWING TIME  │    two stat columns: label 12 caps pink, value 20 Bold
│  │   Anime            15:00s        │
│  └ o o o o o o o ───────────────────┘
│   ( UNLOCK NOW 🎟 )                         pink gradient pill 48
│          (×)                                close BELOW, grey circle
```
Shows a reward / retention moment (streak gift) using the same ticket language as sale screens; it unlocks content, not a purchase.

### SK-8 · Reference paywalls from other apps — `ref-android-legal-paywall.png` (360 × 800), `ref-vpn-paywall.png` (375 × 812)
```text
ref-android-legal-paywall (dark, green accent)      ref-vpn-paywall (dark, orange accent)
│ benefit tiles row (Endless Saves · Ads Free · Fast speed) │ (×) 24 top-right · floating app icons 3D
│ [SAVE 20%]                                         │ Start protecting / your Privacy  (28 Bold white)
│ ┌● Weekly          $8.99/week ┐ selected: green   │ ┌ 2 × 2 benefit grid on glass card ┐
│ │                3 days free trial│ border + glow │ │ Private | Secure / Multi servers | Fast │
│ └──────────────────────────────┘                  │ └──────────────────────────────────┘
│ ┌○ Yearly         $44.99/year ┐                   │ ┌ $4.9 / weekly   [Free trial 3 days] ┐ grey
│ │                  $0.86/week │                   │ ┌ $59 / yearly        [Save 75%]  ┐ SELECTED:
│ └──────────────────────────────┘                  │ │ (Just $1.23 / week)              │ orange border
│ 3 days free trial, then $8.99/week. Cancel anytime.│ Auto-renewed. Cancel anytime!
│ ( Start Free Trial )  green gradient pill          │ ( Subscribe Now ) orange gradient pill
│ Restore | Privacy Policy | Terms of Use            │ Privacy Policy • Terms of use • Restore
│ Subscription Terms (heading)                       │
│ - long bullet list: what Premium gives, plans and   │
│   local prices, charged to Google Account, auto-    │
│   renew 24 h rule, unused trial forfeited, how to   │
│   cancel in Play Store (numbered steps 1–4)…        │
```
References the team copied from: the Android one is the **most complete legal footer** seen (§3.7) — three links plus a full
"Subscription Terms" block under the CTA; the VPN one shows the 2-row picker with weekly-equivalent price on the yearly card.

### SK-9 · Content promo banners and avatars (component sheet) — `banners-content-promo.png` (724 × 900)
```text
Row 1–2: challenge cards ≈ 170 × 134 r12: photo bg + dark gradient → "CHALLENGE [DAILY]" · title 14 Bold white ·
         avatars + "200+ joined" · white pill "Join Challenge"; last tile = "See more" (white, pink icon)
Row 3:   wide banners ≈ 193 × 80 r12: "Trending Now 🔥 / Art of the Month / [Explore Now]" (pink) ·
         "Discover category / Quirky Animal Drawing!" (yellow, 3 sticker cards) · "Uncover Inspiration / Disney Artworld / [Discover More]" (cyan)
Row 4–5: avatar set 52 circles · picker: selected avatar with pink check · add-photo placeholder · designer note "Avatar random với user" (= random avatar per user)
```
Shows in-feed content banners (not paid offers) — same banner anatomy as §5 (title + one line + small pill, illustration right).

### SK-10 · Rate-us dialog over Settings with Pro banner — `case-rating-settings-banner.png`
```text
│ Settings dimmed: top banner "Sketra Pro — Subscribe now to enjoy VIP benefits [Upgrade]" + robot painter 3D, then list rows
│ ╭──────────────────────────────────────╮   white card r28, pink gradient top, mascot with heart eyes overlapping the top edge
│ │                                  (×) │
│ │       Do you enjoy Sketra app?       │   20 Bold
│ │      Rate your experience with us!   │   14 grey
│ │         ★   ★   ★   ★   ★            │   5 stars 32
│ │ (            Rate Now              ) │   pink pill 52
│ ╰──────────────────────────────────────╯
```
Shows the Pro banner at the top of Settings (§5) and an in-app rating prompt.

### SK-11 · Context screens (`case-…`)
| File | Wireframe (compact) | Shows |
|---|---|---|
| `case-home.png` (225 × 900, scaled) | "Sketra" logo + 🔥04 streak + [PRO] pill + ⚙ → "EXPLORE IN BROWSER" hero banner → 2 tiles "EXPLORE IN PHOTO" / "DRAW WITH AI" → "Daily challenge" carousel (big card, "Join Challenge") → "Trending Now / Art of the Month" banner → "Library" row of template cards (Trending tag, lock) → "Lessons For You" card → "Disney" row → tab bar Home · Trending · (+) · Lessons · Profile | home hub; PRO pill in the top bar is the permanent entry point |
| `case-empty-profile.png` (372 × 900) | 3D candy-land header + avatar 88 with edit badge → name → "Skill level: [Intermediate]" card with Drawn · Challenges · Lessons → "My project / see all" with dashed "Draw with Photo" tile → "Artwork Collection" → glowing bulb 3D + "No lessons yet" → tab bar | empty state inside a filled profile |
| `case-dialog-error.png` | dimmed form → white card r28: robot with warning bubbles → "Error" 20 Bold → "Sorry! Something went wrong, Let's try again" → two pills side by side: "Back Home" (grey) · "Try again" (pink) | error dialog with two exits |
| `case-drawing-canvas.png` | grey top bar: ‹ · undo / redo · [Finish] (disabled grey pill) → white canvas with line-art + yellow strokes → floating adjust button (bottom-right, 44) → bottom tool tray: pen, marker 80, brush 50, eraser, smudge, ruler, colour wheel | tool canvas: Finish disabled until there is work |

## 6. Universal TV Remote F1 (iOS) — `tv-remote/` (21 images)

Style family: dark — purple neon: near-black textured background, living-room / TV photography for heroes, purple gradient CTA with diagonal
gloss stripes, display titles in a pink → cyan gradient, synthwave grid on the sale screen. Frames 375 × 812 unless stated.

### TV-1 · Plan picker with "Enable Free Trial" switch — `m01-iap-trial-on.png`, `m02-iap-full-weekly.png` (375 × 877)
```text
┌──────────────────────────────────────────┐
│ 9:41                              ▮▮ ≋ ▭ │
│ hero photo ≈ 0–250: friends watching     │  (×) 32 top-right, dark glass circle
│ football on a wall TV, hand with phone   │
│ remote in the foreground                 │
│            Get Full Access               │  28 Bold white, over the photo's dark fade
│ ✓ Unlock full Voice & Keyboard           │  4 benefit rows: gradient check-badge 20 + 15 text, gap ≈ 24
│ ✓ Unlock full Remote & Channel           │
│ ✓ Enjoy Photo & Video Cast               │
│ ✓ Ads-free & 24/7 Support                │
│ ┌──────────────────────────────────────┐ │  switch row 343 × 48 r12, dark grey fill
│ │ Enable Free Trial              (●━━) │ │  green iOS switch ON
│ └──────────────────────────────────────┘ │
│                        [MOST POPULAR]    │  badge pill red → orange gradient on the card edge
│ ┌──────────────────────────────────────┐ │  Yearly SELECTED (m01): purple tint + purple border r16
│ │ Yearly                       $0.96   │ │  weekly-equivalent price is the big number (R3)
│ │ Just $49.99 per year       per week  │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │  Weekly row (cut by the sticky footer in m01;
│ │ Weekly                         $8.99 │ │  in m02 the full 877 frame shows it, selected)
│ └──────────────────────────────────────┘ │
│ Privacy Policy  •  EULA  •  Restore Purchase │ (m02: links under the plans, underlined 12)
│ ─ sticky footer, darker ─                 │
│ Auto-renew. Cancel anytime.              │  12 grey
│ Free for 3 days, then $49.99/year        │  trial line directly above the CTA (m01 only, switch ON)
│ (        Try for free                )   │  pill 56 purple gradient · m02: "Continue"
└──────────────────────────────────────────┘
```
Shows the trial **switch** variant: switch ON → trial line + "Try for free"; plan without trial → "Continue". m02 is the stretched frame so
the second plan and the legal row are visible for developers (§2.1 "long terms frame").

### TV-2 · Win-back "Welcome back!" offer — `m03-welcome-back-offer.png`
```text
│ hero photo: family on a sofa, TV wall with streaming-app logos (Netflix, HBO max…) · (×) 32 top-right
│               Welcome                    display ≈ 56, white with purple → orange neon outline, 2 lines
│                back!
│ Thanks for your continued support. This is our exclusive offer we give for you as our gratefullness.   15 grey, centred
│                  ✦                         thin glowing divider
│             Limited offer                 24 Bold, pink → cyan gradient
│        $49.99  $24.99/year                struck grey 15 → new price 28 Bold white
│ (          Grab the deal             )    pill 56 purple
│ Privacy Policy  •  EULA  •  Restore Purchase
```
Shows the win-back offer shown when a user returns: greeting → reason → one struck-through price. Copy typo "gratefullness" (R15).

### TV-3 · Sale "40% OFF" with countdown — `m04-sale-countdown.png`
```text
│ black bg + purple synthwave perspective grid, sparkles · (×) 32 top-right
│ 3D ticket card "40% OFF", tilted, wrapped by a holographic ribbon "TIME LIMITED"
│            SALE OFF                    italic display, pink → cyan gradient
│            EXPRIRE IN                  13 caps grey (typo, R15)
│        [00] : [59] : [59]              3 boxes ≈ 40 × 36 r8, dark grey
│ ┌──────────────────────────────────────┐   price card r16, purple border + gradient tint
│ │ $24,99 /year              Only $0,07 │   new price 22 Bold · per-day price right
│ │ $49.99 /year (struck)       per day  │   comma vs dot decimal mixed (R10-type inconsistency)
│ └──────────────────────────────────────┘
│ (            Continue                )
│ Privacy Policy  •  EULA  •  Restore Purchase
```
Shows sale + countdown anatomy (§2.2, §3.6). "40% OFF" while $49.99 → $24.99 is 50 % — R6; countdown is static — R5.

### TV-4 · Paywall after a result — "Successfully connected!" — `m05-connected-paywall.png`
```text
│ photo: TV on a stand, big green check on the screen · (×) 32
│        Successfully                   32 Bold white, 2 lines
│         connected!
│ Tap Continue to start controlling your TV      15, "Continue" bold
│ ✓ Unlock Full buttons in Remote                3 benefit rows
│ ✓ Unlimited to Voice & Keyboard
│ ✓ Completely Ads-free
│ Auto-renew. Cancel anytime. / Free for 3 days, then $8.99/week   12 grey
│ (            Continue                )
│ Privacy Policy • EULA • Restore Purchase
```
Shows a paywall that opens on the result of the task just done (connection success) and reads like the next step of the flow — R13.

### TV-5 · Remote screen with floating "Exclusive Offer" gift — `m06-home-exclusive-offer-fab.png`
```text
│ (♛ crown 36)        Roku Remote          (cast 36)    top bar: crown = PRO entry, left
│ [ ✚ d-pad | ☝ touchpad | 123 ]                         segmented 3 tabs, purple selected
│ (←) (⌂)                       (🎤) (⏻ red)             round buttons 44
│ ┌🎁──┐(×)          ┌───┐                                FLOATING gift FAB ≈ 64, left edge, mid-screen:
│ │Excl.│           ┌┘ ^ └┐                              3D gift + orange "Exclusive Offer" tag,
│ │Offer│           │< OK >│  purple d-pad ≈ 200          small × to dismiss
│ └─────┘           └┐ v ┌┘
│ [↺] [✳] [⌨]  [⏪] [⏯] [⏩]  [🔇] [🔉] [🔊]               3 × 3 key grid, keys 88 × 48 r16
│ ╭ Remote · Channels · Cast · Settings ╮                floating tab bar, Remote selected
```
Shows an in-app sale entry point that floats over the main tool (§5) and can be dismissed.

### TV-6 · Rewarded gate "Upgrade to Full Acess" — `m07-cast-upgrade-or-watch-ad.png`
```text
│ Cast screen dimmed ("Cast Photos", "Cast Videos" rows)
│ ╭──────────────────────────────────────╮   bottom-anchored glass card r≈32, dark, 343 × 400
│ │            ( ♛ glowing crown 72 )     │   NO close button (R1)
│ │       Upgrade to Full Acess           │   22 Bold (typo, R15)
│ │ Purchase Premium to enjoy cast unlimited times & ads-free use. Or you can watch an ads to cast free temporarily. │ 14 grey
│ │ (            Upgrade               ) │   purple solid pill 48
│ │ ( 📢        Watch an Ads           ) │   dark grey pill 48, megaphone icon
│ ╰──────────────────────────────────────╯
```
Shows the Premium-or-ad gate (§4) **without a close button** — the user is forced to choose (R1).

### TV-7 · Lifetime paywall — `m08-lifetime-paywall.png`
```text
│ Skip                     Restore Purchase       text links, no ×
│ hero: TV showing a streaming home + hand holding a phone remote; floating round badges: "ADS" crossed (gold),
│       voice ∞ (blue), remote unlock (purple)
│         ONE PURCHASE,                 24 Bold caps, pink → cyan gradient
│         LIFETIME USER
│ Cheaper than your physical remote, just $12.99 for a lifetime     15; "Cheaper", "$12.99" bold
│ (        Go Lifetime Now!            )
│ Privacy Policy • EULA • Restore Purchase
```
Shows the one-time lifetime purchase, priced against the physical remote. Restore appears twice (top and footer).

### TV-8 · Remove-ads popup — `m09-remove-ads-popup-b.png`
```text
│ remote screen dimmed
│ ╭──────────────────────────────────────╮   glass card r≈32, purple / orange blur inside
│ │                                  (×) │
│ │         3D "ADS" with red ⃠ sign      │   ≈ 120
│ │ Remove Ads                           │   22 Bold, LEFT-aligned
│ │ ✓ Remove all ads                     │
│ │ ✓ Keep optional ads for rewards      │
│ │ ✓ Still use remote buttons           │
│ │ (          Try with $2.99          ) │   purple pill 48 — price in the button
│ ╰──────────────────────────────────────╯
```
Shows the small "buy remove-ads" offer (§2.1): low price in the CTA, ad-specific benefits.

### TV-9 · Feature paywall "Get unlimited cast" — `m10-paywall-cast-feature.png`; KB3 "Get full access" — `pw-kb3-full-access.png`
```text
│ Skip                     Restore Purchase       text links, no ×
│ hero (≈ 0–500): m10 → TV + phone casting photos, floating photo / video thumbnails, ∞ badge
│                 KB3 → same hero as TV-7
│   GET UNLIMITED CAST / VIDEOS & PHOTOS          m10 title (feature-specific)
│   GET FULL ACCESS TO ALL / REMOTE TVS           KB3 title
│ Try 3 days for free, then $8.99/week / Auto-renewable. Cancel anytime     15, centred
│ ( Continue )   m10: purple gradient pill · KB3: flat blue pill (older brand)
│ m10: Privacy Policy • EULA • Restore Purchase   KB3: EULA · Restore Purchase · Privacy Policy (3 columns)
```
Shows the **one-plan hero paywall** whose **title changes with where the user came from** (cast feature vs general), and the KB3
onboarding A/B layout (Skip left, Restore right, 3-column legal footer).

### TV-10 · Remove-ads banner — `m11-banner-iap-variant-b.png` (343 × 140)
```text
┌───────────────────────────────────────────┐  r16, purple → indigo gradient
│ Remove Ads with              [3D remotes,  │  title 18 Bold white, 2 lines
│ Free Remote Buttons           "Ad-free" /  │  right: phone remotes + crossed "ADS" badge,
│ ( Upgrade Now )               "All buttons"│  chips "Ad-free", "All buttons"
└───────────────────────────────────────────┘  CTA: orange gradient pill ≈ 120 × 40
```
Shows banner anatomy (§5): title + small pill CTA, illustration on the right.

### TV-11 · Reference paywalls (rip) — `m12-rip-iap-dark-android.png`, `m13-rip-iap-light-old.png` (360 × 800, Android)
```text
m12 (dark, blue accent)                         m13 (light, indigo accent)
│ (×) 24 top-left · "Universal TV Remote"      │ (×) 24 top-right on photo
│ hero: TV + phone, brand chips Roku/fireTV/LG │ hero: man on sofa casting snowboard video
│ ─ EXPERIENCE ALL FEATURES ─  (caps 18)       │ Stream / Without Limits  (32 Bold, "Without" purple)
│ 2 × 3 icon grid: Favorite Channels · Screen  │ Enjoy HD streaming and remove all ads
│ mirroring · Touchpad and keyboard · Full     │ chips row, scrolls: Ultimate Casting · Remove ads · HD Qu…
│ remote control · Remove Ads · Enhance video  │ ┌ $4.99 Weekly        3-Day FREE TRIAL ┐ grey pill row
│ 3-DAY FREE TRIAL (22 Bold)                   │ [⚡ BEST VALUE]
│ and then $6.99/week. Cancel anytime          │ ┌ $49.99 Yearly       $0.99 PER WEEK ┐ SELECTED: white + purple border
│ ( Try for free )  blue pill 56               │ Auto - Renewal at $0.99/week, cancel anytime
│ ┌ Yearly  Just $3.5 per week   $49.99 ┐       │ ( Start Free Trial   (→) )  indigo pill with round arrow
│ │                [3-day free trial]   │       │ Privacy Policy | Terms of Use | Restore Purchase
│ Privacy Policy • Restore Purchase            │
```
Competitor references the team studied: the trial headline as the hero line (m12), CTA placed **above** the plan card (m12), and pill-shaped
plan rows (m13). m13's renewal line ("$0.99/week") conflicts with the selected plan's real price ($49.99/year) — R10.

### TV-12 · Settings with IAP banner — `m14-settings-with-iap-banner.png` (338 × 900, scaled)
```text
│ (♛)            Settings              (cast)
│ ┌──────────────────────────────────────────┐  banner ≈ 310 × 124 r16: "Transform your TV experience"
│ │ Transform your  [ TRY NOW ]   TV + phone │  neon title + outlined glowing pill, TV + phone art right
│ └──────────────────────────────────────────┘
│ ┌ grouped list r16 ┐ Button press vibrations (switch ON) · FAQ · Contact us · How to use TV Cast?
│ ┌ grouped list ┐    Language · Rate us · Favorites · Share app
│ ┌ grouped list ┐    Privacy Policy · Check app update
│ ┌ grouped list ┐    Restore purchase · Manager subscription   ← subscription rows grouped last
│ ╭ Remote · Channels · Cast · Settings ╮  Settings selected
```
Shows the Settings banner entry point (§5) and grouped rows with colour icon tiles; Restore + Manage subscription kept together.
"Manager subscription" is a copy error (R15).

### TV-13 · Context screens (`case-…`)
| File | Wireframe (compact) | Shows |
|---|---|---|
| `case-empty-connect-device.png` | (×) · "Connect device" · (ⓘ) → grey TV icon → "No Device Found" 20 Bold → numbered tips: "1. Check the device you want to connect" / "2. Ensure that your phone and TV are connected to the same Wi-Fi network" → blue pill "Refresh" ≈ 212 | empty state with numbered fixes + one action |
| `case-local-network-permission.png` | dimmed Connect device → glass dialog r28: blue globe app-icon 56 → "Local Network Required" 17 Bold, left-aligned → "We need Local Network permission to find and connect to your TV. Please enable it in your device Settings to proceed." → "Allow" blue pill 48 → "Not now" grey pill 48 | pre-permission explanation before the system prompt |
| `case-add-ip-editing.png` | dimmed → dialog: "Add your IP Address" / "Please enter your Wifi IP to smoothly find your devices" → filled field "192.168.1.25│" r24 → [Cancel] grey · [Connect] blue side by side → dark system keyboard | manual-entry fallback dialog with keyboard up |
| `case-pairing-error.png` | dimmed "Searching Devices…" → dialog "Pairing" / "Please enter the code show on TV Screen" → field with red border + red text "35734│" → red helper "The code you entered is incorrect. Please try again." → [Cancel] · [Pair] disabled → number pad | inline error state on a code field |
| `case-setting-up-progress.png` | dark gradient → line icons TV + hand with remote → "10%" blue → "Setting up your personal remote TV..." 20 → checklist with spinner: "Analyzing local network..." (current) · "Checking Wifi connection..." · "Finding nearby TVs..." · "100% Ready" (fading) → "Continue" blue pill at the bottom | onboarding "processing" screen with % before the paywall (R12) |
| `case-touchpad.png` | same remote screen as TV-5 with the touchpad tab selected: big touch area ≈ 303 × 196 r16 "Swipe to move / Tap to select" replaces the d-pad | tool mode switch inside one screen |

