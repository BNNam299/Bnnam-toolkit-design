# Gate 0 — store policy, privacy and safety

Mandatory items are not ranked against features: they are in the version or the version does not ship. Check them in product-kickoff
(bans), product-plan (gate 0), product-spec (per feature) and product-detail (paywall, screens). **Platform is decided per app** in
product-kickoff: apply §1–4 for iOS, §6 for Android, both when the app ships on both. Rules change — quote the guideline number, and
re-read the live pages (developer.apple.com/app-store/review/guidelines, support.google.com/googleplay/android-developer) before a
release. Apple part read 07/11/2026; Google Play part read 07/11/2026.

This file covers only rules that **change a product decision** (what a feature may do, what a screen must show). Filling store forms
(App Privacy, Data safety, Health apps declaration), store setup and pre-submission review belong to a later ship toolkit.

## Contents
1. Apple App Review — what a subscription app must respect
2. Privacy, permissions and tracking
3. Sensitive categories (health and wellbeing, kids, location, media)
4. Paywall checklist before submission
5. Safety for wellbeing apps — a product decision, not a store rule
6. Google Play — rules that change product decisions (Android apps)

## 1. Apple App Review — subscription essentials
| Rule | What it means for the PRD |
|---|---|
| 2.3 accurate metadata | Store text, screenshots and onboarding promises match the real app; screenshots show the app in use |
| 3.1.1 in-app purchase | Unlocking features uses IAP; a restore mechanism exists |
| 3.1.2(a) subscriptions | Ongoing value; **period ≥ 7 days**; works on all the user's devices; no bait-and-switch; the user gets what they paid for **without extra tasks** (posting, inviting, checking in N times) |
| 3.1.2(b) | Upgrade / downgrade cannot buy the same thing twice |
| 3.1.2(c) | **Say clearly what the user gets for the price before asking them to subscribe** |
| 3.1.3 | Links to buy outside the app only on the US storefront |
| 4.2 minimum functionality | Real app value, not a wrapped website or a list of links |
| 5.6 code of conduct | No tricking into purchases, no tricky price increases, no charging for undelivered features; many refunds / bad reviews count against the developer |
| 5.6.1 reviews | Ask for ratings **only with Apple's rating API** — no custom review pop-ups |

## 2. Privacy, permissions and tracking
- **5.1.1(i)** privacy policy linked in the app and in store metadata: what is collected, how, why, retention / deletion, how to withdraw
  consent. **App Privacy details** must be filled for every submission (SDK data included — the team answers for every SDK).
- **5.1.1(ii)** consent even for "anonymous" data; **paid features must not depend on granting data access**; easy way to withdraw.
- **5.1.1(iii)** minimum data for the core function. **5.1.1(iv)** respect the user's choice and **offer an alternative when a
  permission is refused** (e.g. manual entry instead of location).
- **5.1.1(v)** no login unless account features need it; if accounts exist, **in-app account deletion**.
- **5.1.2** no sharing personal data (incl. with third-party AI) without explicit permission; **the app may not require turning on
  notifications, location or tracking to use a feature**; data collected for one purpose is not reused for another.
- **Tracking / ATT**: linking app data with other companies' data for ads or ad measurement, or sharing with data brokers, needs the
  ATT prompt with a purpose string; **no gating or rewards for allowing tracking**; explaining before the prompt is fine; IDFV for
  analytics across the same developer's apps does not need ATT.
- **OWASP MASVS-PRIVACY**: (1) minimise sensitive access; third-party SDKs only after consent (2) prevent identifying the user (3) be
  transparent, including behaviour users would not expect (4) let users view, delete, change data and withdraw consent; **asking for
  more data later means asking again and updating the disclosures**.

## 3. Sensitive categories
- **Health and wellbeing** — 1.4.1: apps that could be used to diagnose or treat get extra scrutiny; health measurement claims need a
  validated method; remind users to check with a doctor before medical decisions. 5.1.3: health data never used for ads or marketing,
  specific health data collected must be disclosed, **no personal health information stored in iCloud** — Dev confirms whether the
  app's data counts as health data before choosing storage or sync.
- **Kids** — 5.1.4: apps primarily for children: no third-party analytics or ads; COPPA / GDPR; any personal data from minors needs a
  privacy policy and compliance.
- **Location** — 5.1.5: only when directly relevant; explain the purpose; not for emergency services.
- **Media and content** — 5.2: no third-party music, video, fonts, trademarks or content without permission; no downloading from
  third-party services. Background music in breathing / meditation sessions needs a licence record.

## 4. Paywall checklist before submission
Price, billing period, trial length and "tự gia hạn cho tới khi huỷ" shown on the paywall · links to Terms of Use (EULA) and Privacy
Policy · Restore Purchases · visible close button, no dark pattern · trial-ending reminder planned · paywall, trial and subscription
events carry the paywall variant ID · what the user gets is described before the buy button (3.1.2(c)).

## 5. Safety for wellbeing apps — a product decision
For mental-wellbeing apps the team's default positioning is **a companion, not treatment**:
- Ban (BAN-…) any wording that diagnoses, treats, cures or promises a clinical outcome ("chữa", "điều trị", "giảm trầm cảm"), in the
  app, the store page and ads.
- Show a short line in onboarding and settings: the app supports everyday wellbeing and does not replace professional care.
- **Crisis resources** (e.g. 988 in the US) are not required by Apple's guidelines. Propose them as an option and let the team decide
  per project, recording the decision (D-…): where they appear, what triggers them, and that they never block the user.

## 6. Google Play — rules that change product decisions
Read from the official Play Console Help pages on 07/11/2026: Payments (answer 9858738), Subscriptions (9900533), User Data
(10144311), Ads (9857753), Health Content and Services (16679511). The pages show no update date — re-read before each release.

| Area | Rule | What it means for the PRD |
|---|---|---|
| Billing | Digital features, content and subscriptions use **Google Play Billing**; no leading users to other payment methods (buttons, links, webviews, ads) except via Google's alternative-billing / external-offer programmes in eligible countries | No "mua trên web rẻ hơn" button unless the team enrolls in a programme for that country (decision D-…) |
| Price shown | In-app price matches the Play billing sheet; localised language and currency; **annual plan not shown prominently as a monthly price**; monthly plans say they renew and charge every month | Paywall copy: lead with the real billed amount and period; per-month equivalent only as secondary text |
| Subscription offer | Before buying: price, billing frequency, auto-renewal, whether a subscription is needed to use the app, **what is usable without subscribing**; a clearly visible dismiss option; no extra steps to see the terms | Same paywall elements as Apple §4, plus a line on what stays free |
| Free trial / intro offer | Say trial length, price, what is included, **that it converts automatically, when, at what price, and how to cancel before conversion**; the trial must not be shown so big that the later charge is hard to see; a plan with a recurring charge may not be named "Free Trial" | Trial copy states the post-trial price at the same visual weight; product names in the store match |
| Cancel | Easy online cancellation from the app's account settings or equivalent (e.g. link to the Play Subscription Center); access continues to the end of the paid period | Settings screen has "Quản lý / huỷ gói" → Play Subscription Center; any retention screen comes before it and never blocks it |
| Dark patterns | No flows that cause accidental subscribing (several screens or repeated taps in the same spot), no one-time benefit disguised as a subscription, no cancelling or cutting recurring value after purchase | Paywall review: buy button never sits where the previous screen's "Tiếp tục" was |
| Value | Subscriptions give sustained value; one-time credits or boosters are sold as in-app products; no big first-month grant followed by a tiny recurring amount | Monetize draft: one-off packs are IAP, not subscription |
| Discount eligibility (from **27/01/2027**) | Ongoing eligibility discounts (e.g. student) must disclose criteria, verification and post-eligibility price | Only if such a plan is planned |
| Privacy policy | Required for every app, linked in Play Console **and inside the app** | Settings / onboarding has the privacy policy link |
| Prominent disclosure | When data use may surprise users (e.g. background collection): an **in-app** disclosure during normal use (not only in settings or the policy), saying what data, for which feature, how used / shared; shown **before** the permission prompt and before collection; consent only by an affirmative tap — back, home or tapping away is not consent; no auto-dismiss | Every permission or background-data feature gets a pre-permission screen with that wording; designer draws it |
| Permissions | Request only what the core function needs; runtime permission before access; never before the disclosure | Same branches as Apple 5.1.1(iv): denied → alternative path |
| Account deletion | If accounts exist: deletion **in the app and via a web link**, all associated data deleted (deactivation is not deletion), retained data disclosed | Account feature → FR for in-app delete + web delete page |
| Data limits | Only data needed for the core purpose; never sold; SDKs and AI integrations included — the team answers for them | Each data item in requirements §5 has a purpose; third-party AI gets only what the feature needs, with consent |
| Ads | No full-screen ad with no close button or fake close; **no interstitial at app start, before the splash, at the start of a content segment, or right after a tap before its action happens**; interstitials closable after 15 s unless opt-in; no repeated interstitials after consecutive actions; no ads outside the app (home screen, lock screen, widgets); ads never mimic system UI; rewarded ads must be opt-in; ad content matches the app's rating; location never requested only for ads | Ad slots in §11 placed only at natural breaks; rewarded ads have an explicit "Xem quảng cáo để mở" choice |
| Advertising ID | Use only for ads / analytics; respect the user's opt-out each time; never link to persistent device IDs; disclose in the privacy policy | Analytics / ads SDK choice noted for Dev |
| Health and wellbeing | Mindfulness, stress, meditation apps fall under the health policy: **Health apps declaration** in Play Console; the store description carries the disclaimer "not a medical device and does not diagnose, treat, cure, or prevent any medical condition"; remind users to consult a professional; no misleading or harmful health claims; health data is sensitive user data | Matches §5: the ban on clinical wording also covers the Play description; the disclaimer line goes into the store text brief |
| Kids | Apps for children only use SDKs approved for child-directed services and follow Families ads rules | If the audience includes children → raise at kickoff |

Google's pages above say nothing about crisis resources — like Apple, that stays a team decision (§5).

