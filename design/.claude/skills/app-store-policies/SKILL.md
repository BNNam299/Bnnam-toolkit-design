---
name: app-store-policies
description: Verbatim App Store and Google Play policies that decide whether an app's screens get approved - Apple App Review Guidelines, auto-renewable subscriptions, user privacy and App Tracking Transparency; Google Play subscriptions, payments, ads, permissions, user data - plus a screen-level compliance checklist with exact section pointers. Use whenever you design or review a paywall, subscription or plan picker, free trial or intro offer, restore purchases, in-app purchase, interstitial or rewarded ads, permission pre-prompt, tracking (ATT) prompt, sign-in and account deletion, privacy disclosure or data-safety copy - even if the user only asks to "make the paywall convert better". Vietnamese, e.g. "paywall có bị reject không", "chính sách App Store", "chính sách Google Play", "màn đăng ký gói", "dùng thử miễn phí", "khôi phục mua hàng", "quảng cáo toàn màn hình", "xin quyền", "xoá tài khoản". For paywall layouts and real samples use mobile-ui-master (monetization-screens); for Apple UI wording use apple-hig.
---

# app-store-policies — store rules that decide approval, verbatim

This skill is a **library + checklist**. The eight policy pages in `references/` are copied word for word from Apple and Google. The
checklist below turns them into checks for **screens** (paywall, ads, permissions, sign-in, privacy) and points every check to the exact
section, so a design decision can be defended with the policy text. Layout ideas for paywalls are in
`../mobile-ui-master/references/monetization-screens.md`; Apple's UI guidance for purchases is in `../apple-hig/references/apple-in-app-purchase.md`.

**Freshness.** Fetched 2026-10-18. Store policies change often: each file's first line has its fetch date — if it is older than 6 months,
tell the user to re-fetch before relying on it. Never answer a policy question from memory when the page is here.

## Need → Read
| Need | Read |
|---|---|
| Any App Store rejection question; full guideline numbering (1 Safety · 2 Performance · 3 Business · 4 Design · 5 Legal) | `references/apple-app-review-guidelines.md` — grep the number, e.g. `3.1.2(c)` |
| Subscription sign-up screen, billing amount, free trials, offers (intro, promo, win-back, offer codes), retention | `references/apple-auto-renewable-subscriptions.md` › *Clearly describing subscriptions*, *Providing subscription offers* |
| App privacy labels, tracking, ATT prompt and pre-prompt, FAQ | `references/apple-user-privacy-and-data-use.md` |
| Google Play subscriptions, trials, cancellation, refund | `references/google-play-subscriptions.md` |
| Google Play billing (what must use Play Billing) | `references/google-play-payments.md` |
| Ads: deceptive, disruptive, interstitial timing, "made for ads", families | `references/google-play-ads.md` |
| Android permissions: restricted permissions, location, SMS/call log, all-files, full-screen intent, exact alarm | `references/google-play-permissions.md` |
| Personal and sensitive data, prominent disclosure + consent, data safety, privacy policy, account deletion | `references/google-play-user-data.md` |

## Screen checklist
Run the relevant block when designing or reviewing a screen. Each line is a check → its source.

### Paywall / subscription sign-up (both stores)
- [ ] Subscription **name, duration and what the user gets** for the price are on the screen before the subscribe button — Apple `apple-auto-renewable-subscriptions.md` › *Clearly describing subscriptions*; `apple-app-review-guidelines.md` 3.1.2(c); Google `google-play-subscriptions.md` (offer terms, cost, billing frequency, auto-renewal).
- [ ] The **amount actually billed is the most prominent price**. An annual plan shows the annual total first; "≈ $X/month" or "save N%" is subordinate in position and size — Apple *Clearly describing subscriptions › Billing amount*; Google lists "annual subscriptions that most prominently display their pricing in terms of monthly cost" as a violation.
- [ ] **Free trial / intro offer:** how long it lasts, that it **auto-converts** to paid, the price after the trial, and how to cancel — Apple *Billing amount › Free trials*; Google *Free Trials & Introductory Offers*. SKU/plan names must not say "Free Trial" for an auto-recurring charge.
- [ ] **Dismiss/close is visible** and the app makes clear when content is usable without subscribing — Google examples ① (dismiss missing) for subscriptions and trials.
- [ ] **Restore purchases / sign in** for current subscribers is on the sign-up screen — Apple *Clearly describing subscriptions*; restore mechanism for restorable IAP — `apple-app-review-guidelines.md` 3.1.1.
- [ ] Links to **Terms of Use and Privacy Policy** in the app (and store metadata) — Apple *Clearly describing subscriptions*; 5.1.1(i).
- [ ] **Localized** price, currency and terms — Apple *Clearly describing subscriptions*; Google example ④.
- [ ] No flow that makes repeated taps in the same spot land on the final subscribe button; no bait-and-switch — Google example 2 ①; Apple 3.1.2(a) (scams removed).
- [ ] Ongoing value; period ≥ 7 days; works on all the user's devices; no extra tasks to get what was paid for (posting, uploading contacts…) — Apple 3.1.2(a); Google "sustained or recurring value".
- [ ] Upgrade/downgrade can't create duplicate subscriptions to the same thing — Apple 3.1.2(b).
- [ ] Digital features/content are unlocked **only through in-app purchase** (no license keys, QR codes, crypto) — Apple 3.1.1 (exceptions 3.1.1(a), 3.1.3); Google `google-play-payments.md`.
- [ ] Moving an existing app to subscriptions doesn't take away what existing users already paid for — Apple 3.1.2(a).
- [ ] Non-subscription trial: Non-Consumable at Price Tier 0 named "XX-day Trial"; before it starts, show duration, what becomes inaccessible, and later charges — Apple 3.1.1.
- [ ] Loot boxes / random items: show odds before purchase — Apple 3.1.1.
- [ ] Subscription management/cancellation reachable in account settings (Google: link to Play Subscription Center or direct cancel) — `google-play-subscriptions.md` › *Subscription Management, Cancellation & Refunds*.

### Ads
- [ ] Ads never imitate app UI, system notifications or warnings; it is clear which app serves the ad — `google-play-ads.md` › *Deceptive Ads*.
- [ ] Full-screen interstitials only at natural breaks — not unexpectedly when the user chose to do something else, not before the splash/loading screen, not on exit/home — *Disruptive Ads*, *Better Ads Experiences*.
- [ ] Interstitials closeable within **15 seconds** (opt-in or non-interrupting ones may run longer); real dismiss button, no fake close — *Better Ads Experiences*, *Disruptive Ads*.
- [ ] No interstitial after consecutive user actions ("made for ads"); no forcing an ad click or personal data before full use — *Made for Ads*, *Disruptive Ads*.
- [ ] Ads don't appear where the user usually taps for another function — *Disruptive Ads*.
- [ ] Apple: no paid feature depends on consenting to data collection; ads/tracking need ATT consent — `apple-app-review-guidelines.md` 5.1.1(ii), 5.1.2(i).

### Permissions, tracking and data
- [ ] Request only data the core feature needs; prefer pickers/share sheets over full Photos/Contacts access — Apple 5.1.1(iii).
- [ ] Purpose strings explain clearly and completely why — Apple 5.1.1(ii).
- [ ] Declining is respected; offer an alternative (e.g. type an address if Location is denied); no tricks to force consent — Apple 5.1.1(iv).
- [ ] **ATT:** a pre-prompt explanation is allowed if transparent; no incentives and no gating functionality on allowing tracking — `apple-user-privacy-and-data-use.md` › FAQ (*Can I explain…*, *Can I gate functionality…*).
- [ ] **Google prominent disclosure** precedes any runtime permission or consent when collection may be unexpected: inside the app, in normal use (not in settings), says what data, how used/shared, not only in the privacy policy, not bundled with unrelated disclosures; consent needs an affirmative action, tapping away/back is not consent, no auto-dismissing consent — `google-play-user-data.md` › *Prominent Disclosure & Consent Requirement* (recommended sentence format there).
- [ ] Restricted Android permissions (SMS/Call log, background location, all-files access, full-screen intent, exact alarm…) only when the core use case qualifies — `google-play-permissions.md` (matching section).
- [ ] Push notifications are not required for the app to work; marketing pushes need explicit in-app opt-in and an opt-out — Apple 4.5.4.

### Sign-in and accounts
- [ ] No login wall unless the app has significant account-based features; basic contact info requests are optional — Apple 5.1.1(v), 5.1.1(x).
- [ ] Account creation ⇒ **account deletion inside the app** — Apple 5.1.1(v); Google `google-play-user-data.md` › *Account Deletion Requirement*.
- [ ] Third-party/social login as primary account ⇒ also offer an equivalent privacy-preserving login (e.g. Sign in with Apple), unless an exception applies — Apple 4.8; UI in `../apple-hig/references/sign-in-with-apple.md`.

### Store listing assets (when designing screenshots)
- [ ] Screenshots show the app in use (not only title art, login or splash); IAP-only content is identified — Apple 2.3.2, 2.3.3; no other platforms' names/icons — 2.3.10.

## Core rules
1. **Cite the policy, don't paraphrase from memory.** Every compliance statement names `file › section` (Apple: guideline number).
2. **Both stores when the product ships on both.** Apple and Google differ in wording, not in spirit — check both blocks.
3. **The strictest reading wins for a shared design.** If one store requires something (e.g. Google's prominent disclosure), design the
   shared screen to meet it.
4. **Conversion tricks that hide the price, the renewal or the close button are rejections**, not growth ideas — say so when asked to
   "optimise" a paywall.
5. Policies are not legal advice; regulated domains (finance, health, gambling, crypto) need the company's legal review (Apple 5.1.1(ix)).

## Self-check before reporting
- Each finding: check → status (pass / fail / unclear) → `file › section` → fix.
- Fetch date checked (≤ 6 months) or the user warned.
- Paywall: billed amount most prominent, trial terms, restore, terms/privacy links, visible close — all confirmed.
