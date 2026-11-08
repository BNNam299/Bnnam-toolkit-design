# Monetization screens — real samples from Amobear projects

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/monetization-screens.md + images/monetization/ (102 images) @ 3c0e291 — translated, complete; images redrawn as wireframes in `monetization-wireframes.md`

## Contents
1. Scope and how to use
2. Types of monetization screen
3. Paywall anatomy — blocks and the variants seen
4. Rewarded-ad gate — "Premium or watch an ad"
5. Banners and in-app entry points
6. Five style families
7. Screen chains around the paywall
8. Risk checklist — mandatory when building or reviewing
9. File-quality problems common in maintenance
10. The sample set

## 1. Scope and how to use

Where these samples come from: five shipped Amobear projects, read through Figma (read-only) — Calories AI F1 iOS · HOME AI F3 iOS ·
Sketra AR Drawing F2 iOS · Universal TV Remote F1 iOS · Home AI F2 "Android".

**Status: this is the designer's standard for monetization screens.** The screen types, anatomy, triggers and paywall variants below are the
standard. Each user segment has its own paywall type and trigger; a variant with a "trick" is a valid business choice, not a defect (§8 says
which items are real errors).

**What not to learn from the old files:** their frame structure and layer names do not follow the current standard. Learn the **screen type,
anatomy, content and style**; build the frame with the standard structure — `screen-structure.md` §1–6 and the Paywall row of §7b.

**Store policies are reference only.** `../app-store-policies/SKILL.md` holds Apple / Google text verbatim, but this skill **does not apply,
block or warn** on them. Read them only when the designer / PO asks for a comparison; read ad rules only when the screen has ads (IAA).
Store-review risk belongs to release / PO, not to the design pass.

- **Use when:** building, editing or reviewing a paywall, sale, ad gate or plan-selling banner — especially in **maintenance projects**, where
  these screens are added and changed often.
- **Take from here:** the screen type that fits the placement (§2), the blocks it must have (§3), how to offer Premium vs ads (§4), the entry
  points (§5), the style (§6), the screen chain around the paywall (§7), the **mandatory risk checklist** (§8), file defects to clean (§9).
- **Do not take from here:** layer structure or frame names of the old files (not standard) · concrete prices (pricing belongs to the PO) ·
  the strategy for which plan is pre-selected (a monetization decision — this file only records the display risk).
- Every sample image is redrawn in `monetization-wireframes.md`, under an ID (`CAL-1`, `F3-2`, `F2-4`, `SK-5`, `TV-3`…) followed by the
  original file name. Node IDs from the source files are for traceability only — **do not reopen them** when working on a project.

## 2. Types of monetization screen

### 2.1 Paywall

| Type | Characteristics | Sample (wireframe) |
|---|---|---|
| **Hard paywall at the end of onboarding** | no way to skip — the user must buy to enter the app (project note in Home AI F2: "no skipping past the Sub screen") | Sketra `IAP`, no close button — SK-1 |
| **Plan picker — 3 columns** | 3 vertical cards, the middle one enlarged, the pre-selected card tinted with the accent | CAL-1 |
| **Plan picker — 2 rows** | 2 horizontal rows with radios, weekly price as the big number | CAL-2 · F2-1 |
| **Plan picker — with a trial switch** | an "Enable Free Trial" on/off row; CTA changes "Try for free" ↔ "Continue" | TV-1 |
| **Single plan with trial (big hero)** | hero image fills the top half, one line "3 days free, then …", no plan choice; Skip + Restore as text at the top | TV-9 · F2-2 |
| **Feature paywall** | same template, **title changes with the entry point** ("Get unlimited cast…", "Get full access to channels…") | TV-9 |
| **Paywall after a result** | opens with the result of what the user just did ("Kết nối thành công!" — *Connected successfully!*, "Kết nối lại thất bại" — *Reconnect failed*), then sells | TV-4 |
| **Lifetime** | one purchase, compared with a physical price ("cheaper than a real remote") | TV-7 |
| **Buy ad removal** | small glass popup over the screen in use, low price ($2.99), ad-specific benefits | TV-8 |
| **Long-terms frame** | a stretched paywall (≈ 1360 tall) showing the full subscription terms for developers / review | CAL-3 · TV-1 (`m02`) |

### 2.2 Offers — sale, countdown, win-back

| Type | Characteristics | Sample |
|---|---|---|
| **Sale + countdown** | 3D voucher / ticket "50% OFF", struck price → new price, a line committing to the renewal price, hour / minute / second boxes | F3-2 · F2-4 · CAL-6 · TV-3 |
| **Win-back** | "Welcome back!" + "Limited offer" + struck price, when the user reopens the app | TV-2 |
| **Seasonal** | Christmas, "99% Off", timer down to milliseconds | CAL-8 |
| **Introductory price** | "$0.99 first week, then $24.99/week" | CAL-9 · CAL-10 |
| **Trial-switch screen** | bright screen, big 3D switch "Your 3-day free trial is ready" — a transition before the paywall | F2-3 |

### 2.3 Ads and ad gates

| Type | Characteristics | Sample |
|---|---|---|
| **"Premium or watch an ad" dialog** | seen in **all 5 projects** — details §4 | F3-3 · CAL-5 · SK-5 · TV-6 · F2-5 |
| **Save mode / remove watermark** | at save time: "Save without ads — Premium" or "Save — watch an ad" | F3-4 · F2-6 |
| **Native ad inside onboarding** | a 390 × 260 slot under the onboarding content; the CTA shrinks to "Next" | F3-5 |
| **Ad slot on a tool screen** | banner 50 / native 220 at the bottom, even while "Detecting object" | F2-13 |
| **App-open ad splash** | progress bar + "(This action may contain advertisement)" | F3-6 · F2-13 |

### 2.4 Selling entry points inside the app

Crown / "PRO" in the top bar · banner at the top of Settings (next to Restore, Manage subscription) · banner in the feed / on a feature
screen · **floating gift button** "Exclusive Offer" · tapping a locked feature → the gate in §4 · at save time · end of onboarding ·
reopening the app (win-back, reconnect). Samples: §5.

## 3. Paywall anatomy — blocks and the variants seen

### 3.1 Top block — close, Restore, Skip

| Variant | Seen in | Note |
|---|---|---|
| × in a circle, **top-left**, clearly visible | Calories `IAP_1` (CAL-1) | easy to find |
| × **top-right**, 24–32, translucent fill | Home AI F3, Sketra, TV Remote, Home AI F2 | Sketra / Home AI F3: 20 % white fill over a photo → **hard to see** |
| **"Skip" text left + "Restore Purchase" right**, no × | TV Remote template KB3 (TV-9), Sketra `pw_us_3` (SK-3) | Skip in light grey text — a weak exit |
| **no close button** | Sketra `IAP` (SK-1), Calories drafts | hard paywall — must be a deliberate decision, recorded in the project's decision log |
| "Restore Purchase" as text in the top bar | sale 50 % (Home AI F2 / F3), KB3 | 12 px, 70 % opacity |

### 3.2 Hero and title

- **The hero follows the app's main function** and **restates the core value**: a food-scan frame + "120 kcal" (Calories), a carousel of
  rendered rooms (Home AI), a photo collage fading into a dark background (Home AI F2), TV + phone photo (TV Remote), line-art drawings (Sketra).
- **Logo + PRO tag** ("CAI AI [PRO]", "Sketra* VIP", "HomeAI PRO"), then a 24–36 Bold title with the emphasised part in another colour
  ("Track less. **Achieve more.**").
- Hero variants: **video** (Android AR Drawing draft), before / after image, 3D illustration.

### 3.3 Benefit list

Check rows + text (4–5 lines) · horizontally scrolling tiles (5 tiles 84 × 88, the 4th one cut at the edge) · 2 × 2 chip grid · 6-icon grid ·
chips running off the screen edge. Common benefits: unlimited use, no ads, **no watermark**, unlocked templates / features, speed, 24/7 support.

### 3.4 Plans — layout, badge, price

| Element | Variants |
|---|---|
| layout | 3 columns (middle enlarged) · 2 rows with radios · 2 horizontal cards · 1 card · price box (sale) |
| selected card | light accent fill + accent border + glow · check in the corner · filled radio |
| badge | "Save 70%" · "Best Offer" · "Most Popular" · "BEST VALUE" (gradient pill sitting on the card's top edge) |
| price | plan price + **price per week** ("Just $0.96/week") · many screens make **the weekly price the largest number**, the yearly price small |
| struck price | "~~$49.99~~ » $24.99/Year" — a double arrow or chevron between the two prices |
| component | only Calories (`Sub Pack`, `content` with 6 variants — CAL-4) and Home AI F2 (`Package`) made the plan card a component; the other projects use loose frames |

### 3.5 Trial and CTA

- Trial line: "Try 3 days for free, then $X/week. Cancel anytime" — placed **directly above** the CTA (good) or as **grey 10–12 px text**
  far from the CTA (risk, §8 R4).
- CTA: full-width pill 52–60, accent gradient, **diagonal gloss stripes**; labels "Continue" / "Try for free" / "Start Free Trial" /
  "Upgrade Now" / "Get Offer".
- Reassurance: "No payment due today", "Secure payment via Apple", "We'll remind you before your trial ends" (Home AI F2 — the best one).

### 3.6 Countdown

3 boxes hours / minutes / seconds, r16, 5 % white fill · label "Offer ends in" / "Time is limited!" · a draft has a millisecond box. In 2
projects the layer is named **"Countdown · DEV MOCK (static)"** → no real rule behind it yet — §8 R5.

### 3.7 Legal footer

`Privacy Policy • Terms • Restore` on one row, 10–12 px (most common) · 3 columns EULA / Restore / Privacy · a paragraph with bold links (sale
screens — **Restore missing**) · a full "Subscription Terms" block (the long-terms frame; most complete sample: SK-8). Sale screens should keep
all three links, like the paywall.

## 4. Rewarded-ad gate — "Premium or watch an ad"

The same template in all 5 projects (white card r28–36 over a 30–70 % scrim):
1. an **illustration** of the value (before / after, 3D gift box, mascot)
2. a **contextual title**: "Finish up your design", "Unlock drawing mode", "Unlock This Feature", "Upgrade to Full Access"
3. a description: "use Premium for unlimited use, or watch an ad to use it once"
4. **primary button Premium** (accent gradient, crown icon) · **secondary button Watch an ad** (outlined / light, "AD" icon, "FREE" tag)
5. a close ×

| Hierarchy variant | Sample | Assessment |
|---|---|---|
| two full-width button rows, Premium stronger | Home AI F3 (F3-3), Sketra (SK-5), Home AI F2 (F2-5) | clear, balanced |
| Premium is a button, the ad is a **text link** | Calories (CAL-5) | the ad is demoted but still visible |
| **ad button bigger than the Premium button** | Home AI F2 draft `Popup` | inverted hierarchy — avoid |
| **no close button** | TV Remote (TV-6) | forces a choice — risk §8 R1 |
| native ad placed inside the dialog | Home AI F2 draft (F2-7) | cluttered |

## 5. Banners and in-app entry points

| Type | Sample |
|---|---|
| banner at the top of Settings (sell plan / discounted plan) | TV-12 · F3-7 · SK-10 |
| banner in the feed / on a feature screen ("SPECIAL OFFER") | CAL-7 |
| remove-ads banner 343 × 140 | TV-10 |
| **floating gift button "Exclusive Offer"** on the remote screen | TV-5 |

Banner anatomy: r12–24, gradient or image background, title + one line + a small pill button, illustration on the right. Same colours as the
sale screen it leads to.

## 6. Five style families

| Family | Project | Recognisable by |
|---|---|---|
| **Dark luxury — gold** | HOME AI F3 | background #140905 + brown glow, gold gradient CTA, display title in gold gradient |
| **Dark — red-orange** | Home AI F2 | background #101011, photo collage fading out, selected card tinted red, CTA red → orange |
| **Pastel pink** | Sketra | light pink gradient background, pink CTA, 3D illustrations; the sale screen drifts to cream / gold |
| **White — orange accents** | Calories | white background + blurred pink / yellow glow, orange CTA, 3D food illustrations |
| **Dark — neon purple** | TV Remote | black background + living-room photo, purple CTA, pink → cyan gradient text, synthwave grid on the sale screen |

Monetization screens **follow the app's accent colour** but may look "richer" than the rest of the app (gradients, light, 3D). Sale screens
often have their **own event language** (3D ticket, "TIME LIMITED" ribbon, light rays).

## 7. Screen chains around the paywall

- **Selling onboarding** (A/B templates KB1–KB4 in Home AI F2, TV Remote, Sketra): Splash (with ad) → Welcome → personalisation questions →
  **"processing" screen with %** → **social proof** ("100k+ ratings") → **3-step feature demo** → paywall → (sale if closed) → **Rate Us** →
  into the app. Samples: SK-6, F2-12, TV-13 `case-setting-up-progress`.
- **Reassurance before payment** ("Nothing charged today · Secured by Apple") and a **mock App Store payment sheet** so developers see the
  purchase step — Sketra (SK-6).
- **Reopening the app:** reconnect → success / failure → paywall (TV Remote, TV-4) · win-back offer (TV-2).
- **At the point of use:** tap a locked feature → the gate in §4 · save → choose a save mode · out of quota → a quota warning inside the form
  (Calories `Over remaining`).

## 8. Risk checklist — mandatory when building or reviewing a monetization screen

Every row was seen **at least once** in the 5 projects. The agent **does not decide** these rows itself — it reports them to the designer / PO
and records the outcome in the project's decision log.

**Two kinds (designer's rule):**
- **Real errors — always check and report:** R6 wrong discount maths · R7 "Lifetime" on a weekly plan · R9 wrong-platform text ·
  R10 prices that do not match between screens · R15 spelling mistakes. These are mistakes, not choices.
- **Business choices — valid; build them as requested / as in the sample screen, do not report them as errors:** R1, R2, R3, R4, R5, R8,
  R11, R12, R13, R14. Each user segment has its own paywall type / trigger. Record the variant used in the project's `flows.md`
  (format: `reading-screens.md`); do not "clean it up" into a more transparent version on your own.

| # | Risk | Seen in |
|---|---|---|
| R1 | **no close button**, or only a faint "Skip" text, or a low-contrast × | Sketra `IAP` (SK-1), TV KB3 (TV-9), TV Remote gate (TV-6) |
| R2 | **expensive plan pre-selected** / trial card pre-selected and enlarged; the other plan looks locked | Calories `IAP_1` (CAL-1), Home AI F3 |
| R3 | **weekly price is the largest number**, the yearly total in small text | Calories `IAP_2` (CAL-2), TV Remote (TV-1) |
| R4 | **trial terms far from the CTA** / CTA "Continue" does not say it starts a trial | Calories `IAP_1`, Home AI F3 |
| R5 | **fake countdown** (static, resets on every open) | sale 50 % in 4 projects |
| R6 | **wrong discount maths**: "40% OFF" but 50 % off, "SAVE 92%" but ≈ 44 %, "99% OFF" | TV Remote (TV-3), Sketra (SK-1), Calories draft (CAL-10) |
| R7 | **"Lifetime" attached to a weekly plan** | Calories draft (CAL-10) |
| R8 | **Restore missing** (sale screens) or Restore at 10 px, hard to see | Calories sale, Home AI F3 |
| R9 | **wrong platform**: Google Play / "Google ID" text on iOS · "Secure payment via Apple" on Android | Calories, Home AI F3, TV Remote, Home AI F2 |
| R10 | **prices do not match** between screens (paywall, reassurance, terms) | Sketra ($4.99 / $8.99 / $24.99), TV Remote, Home AI F2 |
| R11 | **unverified social proof** ("100k+", "Millions", "200+ joined") | Sketra (SK-6) |
| R12 | **fake processing screen** building expectation before the paywall | Sketra (SK-6), TV Remote (TV-13) |
| R13 | **paywall that looks like the next step of the flow** ("Success! Tap Continue to control your TV") | TV Remote (TV-4) |
| R14 | sale **without price / terms**, only "50%" | Sketra `dialog sale` (SK-4) |
| R15 | **spelling mistakes on selling screens** ("Acess", "EXPRIRE", "Watch an ads") | TV Remote, all 5 projects |

## 9. File-quality problems common in maintenance

- **Hidden layers still holding another app's text** (Calories `IAP_1` still has AR Drawing text) — clean before reusing a screen.
- **Duplicate frame names** (4 identical `IAP` frames, 6 `dialog report` frames), **misnamed frames** (`Reward Ads Popup` is actually Home +
  a banner).
- **"Android" project drawn on iPhone frames** (Home AI F2: Dynamic Island status bar, no Material, no navigation bar) — when maintaining
  for Android, ask again which frame standard to use.
- **Monetization screens are rarely componentized** — only plan cards in 2 projects; banners, countdowns, footers are loose frames. When
  building new ones, propose components (`../design-system-audit/SKILL.md`).

## 10. The sample set

102 images, all redrawn in `monetization-wireframes.md`: Calories AI 21 (§2) · HOME AI F3 17 (§3) · Home AI F2 21 (§4) · Sketra 22 (§5) ·
TV Remote 21 (§6). File-name prefixes:
- **no prefix** — a monetization screen (paywall, sale, ad gate, banner)
- **`draft-…`** — a trial version from the Draft page (a variant reference, not a shipped screen)
- **`ref-…`** / **`rip-…`** — another app's screen the project used as reference
- **`case-…`** — **an example of another screen type** (onboarding, loading, error, empty, permission, settings, home, canvas…) — it only
  illustrates the screen type; **do not learn frame structure from it**

Worth reading together with the sections above: selling-onboarding chain — SK-6, F2-12 (§7) · retention — SK-7 · most complete legal
footer — SK-8 (§3.7) · sale without a price (R14) — SK-4 · native ad inside the remove-watermark dialog — F2-7 (§4).
