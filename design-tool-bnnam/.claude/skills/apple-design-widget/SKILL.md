---
name: apple-design-widget
description: Apple HIG standard for iOS / iPadOS system surfaces outside the app — Home Screen and Lock Screen widgets (system small / medium / large / extra large, accessory circular / rectangular / inline, StandBy, CarPlay), Live Activities (compact, minimal, expanded in the Dynamic Island, Lock Screen banner, StandBy), Home Screen quick actions — exact pt sizes, margins, text ≥ 11 pt, update limits, hard surface limits (no blur, Dynamic Island black), plus wireframed layout patterns from Apple's kit and real apps. Use whenever someone designs, builds in Figma or reviews a widget, Live Activity, Dynamic Island view or quick action menu, including Vietnamese requests such as "thiết kế widget", "làm widget màn hình khoá", "Live Activity giao hàng", "Dynamic Island hiện gì", "quick action khi nhấn giữ icon", "widget có blur được không". For in-app screens use apple-design-iphone; for Android widgets use android-design-widget; for the surface background use screen-background; for the build loop use figma-ui-flow.
---

# apple-design-widget — widgets, Live Activities and quick actions (iOS / iPadOS 27)

This skill covers **surfaces the system draws outside your app**: widgets, Live Activities (Dynamic Island, Lock Screen, StandBy) and
Home Screen quick actions. They are small, glanceable, rendered by the system — so most in-app freedom (blur, custom chrome, dense
layouts) is gone.
- In-app iPhone / iPad rules, notifications, App Shortcuts: `../apple-design-iphone/SKILL.md` (`../apple-design-iphone/references/ios-platform.md` §7).
- Background component of a widget / Live Activity frame: `../screen-background/SKILL.md`.
- Live Activity sharing the vertical side bar on iPhone Duo: `../iphone-duo-adaptive/SKILL.md`.
- Verbatim Apple pages (Apple wins over this summary): `../apple-hig/references/widgets.md`, `live-activities.md`,
  `home-screen-quick-actions.md`, `notifications.md` (App Shortcuts and watch complications pages are not in the iOS / iPadOS copy).

## Need → Read

| Need | Read |
|---|---|
| Widget sizes and where each appears, accessory widgets, rendering modes (full-colour, accented, vibrant) | `../apple-hig/references/widgets.md` §Anatomy, §Rendering modes |
| Widget best practices, updates, interactivity, margins, text, colour, previews | `../apple-hig/references/widgets.md` §Best practices, §Previews and placeholders |
| Widget sizes in pt (iOS, iPadOS) | `../apple-hig/references/widgets.md` §Specifications |
| Live Activity presentations, layouts, colours, animation, lifecycle, sizes | `../apple-hig/references/live-activities.md` |
| Lock Screen widgets (inline, circular, rectangular; Always-On) | `../apple-hig/references/widgets.md` §iOS, iPadOS |
| Quick action menu | `../apple-hig/references/home-screen-quick-actions.md` |
| Push notifications (content, actions, marketing) | `../apple-hig/references/notifications.md`, `managing-notifications.md` · copy: `../ux-writing/SKILL.md` |
| Background component for the surface frame | `../screen-background/SKILL.md` |
| Vector art inside the widget (scene, shading, rain, grouping, Illustration + Content structure, lean paths / anchors) | `../figma-vector-illustration/SKILL.md` |
| **Layout ideas**: kit anatomy and layer names, 13 Home Screen patterns from Apple and real apps (search + shortcuts, action grid, trending, people row, status, quick play, re-order), size growth, branding, all states, Lock Screen and StandBy patterns, gallery copy, pattern picker by app type | `references/widget-patterns.md` |
| Control Center / Lock Screen / Action button **controls** (iOS 18+) | `../apple-hig/references/controls.md` |
| Android widgets, or one widget for iOS and Android | `../android-design-widget/SKILL.md` · comparison: `../android-design-widget/references/widget-platform-comparison.md` |

## Core rules (apply even without opening a reference)

### 1. Pick the right surface
| Need | Surface |
|---|---|
| Glanceable, periodically refreshed content from the app's main purpose | **Widget** |
| A task or event with a defined start and end, frequent updates, ≤ 8 hours (delivery, ride, match, workout, timer) | **Live Activity** |
| A one-off timely message | **Notification** |
| A few high-value actions straight from the app icon | **Home Screen quick action** |
| An action exposed to Siri, Spotlight, the Action button | **App Shortcut** (`../apple-design-iphone/references/ios-platform.md` §7) |
| A one-tap toggle or action in Control Center, on the Lock Screen or the Action button (iOS 18+) | **Control** (`../apple-hig/references/controls.md`) |

Widgets never show real-time data — real-time progress belongs in a Live Activity. Widgets and Live Activities share frameworks and
design components: design them together and reuse parts.

### 2. Surface limits — no blur, one background colour
| Surface | Limit | Design it as |
|---|---|---|
| **Live Activity** (Lock Screen) | background is **one colour with opacity**; no blur; a gradient must be drawn in code | one solid colour from an alpha token |
| **Dynamic Island** | background is **always system black**; the app can't change it | light / bold-coloured content only |
| **Widget** | no arbitrary blur | solid colour, or a gradient built in code |

- The surface still gets a background **component** `Background/<name>` at the **exact size of the surface frame** (e.g. a Live
  Activity 370 × 150), but only a single colour from an alpha token — no shapes, no blur, never cloned from the app's blurred background
  (`../screen-background/SKILL.md`). The developer builds it in code.
- A blur inside a frame or section named Live Activity, Dynamic Island, widget or Lock Screen misleads the developer — the audit
  flags it (`../ux-review-handoff/SKILL.md`).

### 3. Widgets — content
- **One main purpose**, glanceable in seconds, tied to the app's core job; **a window onto the app, not a shrunken app screen**.
  Meaningful content and useful deep links — a widget that replicates the app icon adds nothing.
- Prefer content that changes during the day; look for moments to delight (e.g. a special treatment on birthdays).
- **Each size keeps the same purpose and adds detail** — small shows one piece of information, larger sizes add layers and actions.
  Never just stretch a small widget's content. One widget in the best-fitting size beats every size done poorly.
- Balance density: too sparse looks useless, too dense isn't glanceable — go up a size or swap text for graphics.
- Brand through colour, type and glyphs; a logo is rarely needed — if content comes from several sources, a **small logo top-right**.
- Choose automatic content or let people configure it (e.g. which stocks). Don't put a widget look-alike inside the app.
- Signed-out / no-permission states show alternative content that says what signing in adds ("Sign in to view reservations").
- Also draw **loading** (placeholder skeleton), **empty** (keep the header, one calm line), **needs setup** ("Tap and hold to add…"),
  **error / offline** (last good data + "Updated …") and **after a tap** (new state shown at once) — `references/widget-patterns.md` §7.
- Lock Screen widgets give useful information, not just another launcher; they follow complication rules (design both together).

### 4. Widgets — sizes and layout
- System family: **small** (iPhone Home Screen, Today View, StandBy, CarPlay, HomeView; iPad also Lock Screen) · **medium**, **large**
  (Home Screen, Today View) · **extra large** (iPad, Mac, Vision Pro — Apple's page says not on iPhone; the iOS 27 kit change log says
  it added XL for iPhone: check the current Apple page before offering it). Accessory: **circular**, **rectangular** (below the clock),
  **inline** (text above the clock) on iPhone / iPad Lock Screen.
- iOS sizes (pt, portrait screen → small · medium · large · circular · rectangular · inline):

| Screen | Small | Medium | Large | Circular | Rectangular | Inline |
|---|---|---|---|---|---|---|
| 430 × 932 / 428 × 926 | 170 × 170 | 364 × 170 | 364 × 382 | 76 × 76 | 172 × 76 | 257 × 26 |
| 414 × 896 | 169 × 169 | 360 × 169 | 360 × 379 | 76 × 76 | 160 × 72 | 248 × 26 |
| 414 × 736 | 159 × 159 | 348 × 157 | 348 × 357 | 76 × 76 | 170 × 76 | 248 × 26 |
| 393 × 852 / 390 × 844 | 158 × 158 | 338 × 158 | 338 × 354 | 72 × 72 | 160 × 72 | 234 × 26 |
| 375 × 812 / 360 × 780 | 155 × 155 | 329 × 155 | 329 × 345 | 72 × 72 | 157 × 72 | 225 × 26 |
| 375 × 667 | 148 × 148 | 321 × 148 | 321 × 324 | 68 × 68 | 153 × 68 | 225 × 26 |
| 320 × 568 | 141 × 141 | 292 × 141 | 292 × 311 | — | — | — |

  Apple's table has **no row for 402 × 874 / 440 × 956** yet: mock up at the nearest row, design for the largest and let the system
  scale (it resizes iOS widgets for small devices; iPadOS renders large then scales down). iPad sizes: `widgets.md` §iPadOS dimensions.
- **Margins 16 pt** standard; **11 pt** for tight groupings of graphics, buttons or background shapes. Lock Screen, StandBy and the Mac
  desktop use smaller margins.
- Inner corner radii **concentric** with the widget's corner (container-relative shape) — never an independent radius.

### 5. Widgets — text, colour, updates, interaction
- System font, text styles, SF Symbols; a custom font sparingly (works for the big number, SF Pro for small text). **Text ≥ 11 pt.**
  Never rasterise text (it must scale and be read by VoiceOver). Widgets support Dynamic Type **Large to AX5**.
- Colour enhances without competing; **never the only carrier of meaning** — widgets may render monochrome or tinted. In tinted / clear
  appearances full-colour images are desaturated by default; keep full colour for media (album art), smaller than the widget.
- Refresh is periodic, not continuous: pick a frequency from how often the data changes; show "last updated" when people check more
  often than it updates; let the system refresh dates and times; never hide stale data behind placeholder content.
  Animate updates with transitions **≤ 2 s**.
- Tapping anywhere that isn't a button / toggle **opens the app at the right place** (deep link to that item). Buttons and toggles
  only for simple, relevant actions; targets big enough to hit confidently; no app-like layouts. Inline accessory widgets have **one** tap target.
- Lock Screen on Always-On displays: reduced luminance — use greys with enough contrast.
- StandBy / CarPlay: the small widget, background removed, scaled up — rely on large text, not rich images or colour; mark the
  background removable. In low light StandBy renders monochrome red.

### 6. Widgets — gallery, preview, placeholder
- Gallery preview is realistic (real data, or realistic simulated data if loading is slow).
- **Placeholder** = static components + semi-opaque shapes standing in for dynamic content (bars for text lines, circles / squares
  for glyphs); **never real data**, and close to the final layout.
- Description starts with a verb ("See the current weather conditions…"), never "This widget shows…"; one description for all
  sizes, sizes grouped together; sentence case. The Add button may take the brand colour.

### 7. Live Activities — content and look
- Only for tasks / events with a **defined beginning and end**, up to **8 hours**. Show only what matters at a glance; tap opens the
  app at the related details.
- **No ads or promotions. No sensitive data** — they are visible on the Lock Screen and Always-On: show an innocuous summary or redact,
  and let people choose.
- Match the app's look in **light and dark**. A logo mark goes **without a container**; never the whole app icon.
- Don't add anything to the app that draws attention to the Dynamic Island.
- Text large and **medium weight or heavier**; small text sparingly.
- Colour: compact, minimal and expanded can't have a custom background (Dynamic Island is black, opaque) — use **bold colours** for
  text and objects, and tint the **key line** (shown around the island on dark backgrounds) to match. Only the **Lock Screen**
  presentation may have a custom background colour / opacity — check contrast, also on Always-On.

### 8. Live Activities — presentations
| Presentation | When | Rules |
|---|---|---|
| **Compact** | one active Live Activity, Dynamic Island | leading + trailing parts around the camera read as **one** piece of information (same colour, type) · narrow, **snug to the camera, no padding** · balanced widths (shorten units) · both parts link to the same screen |
| **Minimal** | several active — up to three in the island (one attached, others detached circle / oval) | recognisable; show live data rather than a static logo (e.g. remaining time) |
| **Expanded** | touch and hold compact / minimal | enlarged compact layout, same relative placement · wrap content tightly around the camera |
| **Lock Screen** | banner at the bottom of the Lock Screen; also a banner over other apps on devices without a Dynamic Island | own layout, not a notification copy · margin **14 pt** · colours sparing on personalised Lock Screens · default background is light in light mode, dark in dark mode · verify the auto-generated dismiss button colour |
| **StandBy** | iPhone in StandBy — minimal, tap → Lock Screen view scaled **2×** | custom layout for the space · default background recommended (blends with the bezel) · standard margins, no art to the screen edge · check Night Mode (red tint) |

- Start with the iPhone design for every presentation, then refine for StandBy, CarPlay, Apple Watch.
- **Limited width** (e.g. Dynamic Island in landscape): compact and minimal fit a **28 pt circle** — abbreviation or graphic; leading
  only is allowed (trailing hides).
- Layout: use only the space needed; **change height dynamically** (Lock Screen and expanded grow as information arrives); even,
  concentric margins — rounded elements never poke into the outer corner; separate blocks with an inset container or a thick line,
  never draw content to the island's edge. Start from Apple Design Resources templates.
- iOS sizes (pt): screen 430 × 932 → compact 62.33 × 36.67 each side · minimal 36.67–45 × 36.67 · expanded and Lock Screen
  408 × 84–160 · limited 28 × 28. Screen 393 × 852 → compact 52.33 × 36.67 · minimal 36.67–45 × 36.67 · expanded and Lock Screen
  371 × 84–160 · limited 28 × 28. iPad Lock Screen: 500 × 84–160 (1366 × 1024) · 425 × 84–160 (other iPads). No row for 402 × 874 yet
  — mock up between the two.

### 9. Live Activities — motion, interaction, lifecycle
- Animations reinforce updates, **≤ 2 s**; none on Always-On. Animate layout changes by moving existing elements; avoid overlaps
  (fade the others).
- Interactivity only for essential, directly related functions people start once or pause / resume (playback, workout, recording);
  prefer **one** control. Offer a response to an update when it makes sense (contact the driver).
- Start when people expect it (after ordering, at match start) and give an easy off switch in the related app view; offer an App
  Shortcut to start it.
- Update only when content changes; alert only for essential updates (alerts light the screen and play a sound); never duplicate the
  same update as a push notification. Track several events with **one** Live Activity that rotates.
- **End it as soon as the task ends.** It leaves the Dynamic Island at once but stays on the Lock Screen up to **4 hours** — set a custom
  dismissal time proportional to the activity, usually **15–30 minutes**.

### 10. Home Screen quick actions
- Touch and hold the app icon → menu of app actions plus system items. Each action: title, interface icon (left or right depending on
  the icon's position), optional subtitle; text left-aligned in left-to-right languages.
- Up to **four** actions; people expect at least one useful one. Only compelling, high-value tasks (e.g. "Directions Home").
- Dynamic actions are fine (location, recent items, time) but must change predictably.
- Succinct title that says the result; subtitle for extra context; **no app name**, keep it short, plan for localisation.
- SF Symbols (or the Quick Action Icon Template from Apple Design Resources); **never an emoji** (quick-action icons are monochrome and
  adapt to Dark Mode).

## Workflow (designing a widget or Live Activity)
1. Confirm the surface with the table in §1; write its single purpose in one sentence; pick a base layout pattern from
   `references/widget-patterns.md` (§11 picker by app type) and show its wireframe before building.
2. Pick sizes / presentations: widget sizes that add value · for a Live Activity every presentation (compact, minimal, expanded,
   Lock Screen, StandBy).
3. Create frames at the Apple sizes above, each with its `Background/<name>` component (one colour, alpha token) at the frame size.
4. Build content with system text styles ≥ 11 pt, SF Symbols, margins 16 / 11 (widget) or 14 (Lock Screen Live Activity), concentric radii.
   In Figma the widget is an auto layout and every cluster of related elements is its own named auto-layout frame (art · text group ·
   value row · actions); only art that bleeds past the padding may sit absolute behind Content — `../figma-vector-illustration/SKILL.md` rules 3–5.
5. Draw the extra states: widget placeholder, signed-out, stale data; Live Activity limited width, Dark Mode, Always-On, StandBy Night Mode.
6. Review with the self-check; hand off noting that backgrounds and gradients are built in code.

## Common pitfalls
- A miniature app screen as a widget; a medium widget that is the small one stretched.
- Blur or glass on a widget / Live Activity / Dynamic Island frame; a custom background in the Dynamic Island.
- Real-time progress in a widget (should be a Live Activity); a Live Activity used for ads or left running after the event ends.
- Text under 11 pt, rasterised text, colour as the only signal.
- Compact parts that don't read as one; padding between content and the camera; truncation in landscape (ignoring the 28 pt circle).
- Real data in the placeholder; "This widget shows…" descriptions.
- Quick actions with the app name, more than four, or emoji icons.

## Self-check before reporting
- [ ] Surface choice justified (widget vs Live Activity vs notification vs quick action).
- [ ] Sizes from the Apple tables; a missing device row is stated.
- [ ] No blur anywhere; Lock Screen background is one colour; Dynamic Island content works on black.
- [ ] Widget margins 16 / 11, Lock Screen Live Activity 14; radii concentric; text ≥ 11 pt; meaning not by colour alone.
- [ ] Every Live Activity presentation exists (compact, minimal, expanded, Lock Screen, StandBy) incl. limited width.
- [ ] Taps deep-link to the right place; at most a few simple controls (one preferred on Live Activities).
- [ ] Placeholder without real data; loading, empty, needs-setup, signed-out, error, stale and after-tap states shown.
- [ ] Each size has its own content strategy; ≤ 4 actions side by side, targets ≈ 44 × 44 pt.
- [ ] Lock Screen set includes at least one informative accessory, not only launchers; reads in one colour.
- [ ] Gallery name + verb-first description; preview matches the widget.
- [ ] Live Activity ends with the task and has a dismissal time; no sensitive data or ads.
