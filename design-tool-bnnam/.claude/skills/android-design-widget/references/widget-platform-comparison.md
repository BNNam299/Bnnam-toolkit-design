# Widgets on iOS vs Android — what changes when one widget ships on both

> Source: Apple HIG Widgets / Live Activities (`../../apple-hig/references/widgets.md`, `live-activities.md`), Android widget
> guidance (`android-widget-guidelines.md`), designer's widget UX brief — merged and corrected against the official pages
> (2026-11-05).

"Widget" means two things in mobile design: (1) **home / lock screen widgets** outside the app — this file; (2) **in-app UI
components** (button, switch, card, tab bar) — not covered here: iOS → `../../apple-design-iphone/SKILL.md`, `../../apple-hig/SKILL.md`;
Android → `../../material-design-3/SKILL.md`; cross-platform component choices → `../../material-design-3/references/cross-platform-decisions.md`.

## 1. Side by side

| Aspect | iOS / iPadOS | Android |
|---|---|---|
| Design system | Apple HIG, WidgetKit | Material 3 / Material You, Jetpack Glance |
| Sizes | Fixed **families**: small, medium, large, extra large (iPad…), accessory circular / rectangular / inline | **Grid cells**, freely resizable between min and max; design for size buckets |
| Unit at mock-up | pt — 158 × 158 / 338 × 158 / 338 × 354 (393 × 852) | dp — 1 × 1 57 × 102 … 5 × 4 349 × 455 (5 × 4 grid, portrait) |
| Margins | 16 pt standard, 11 pt tight grouping | Fill the grid edge-to-edge; inner padding from the canonical layouts; no outer padding |
| Corner radius | System-managed container; inner radii concentric | System corner radius (`system_app_widget_background_radius`, OEM specific) |
| Touch target | Aim for 44 × 44 pt | **48 × 48 dp** minimum (quality WL-4.2) |
| Text | ≥ 11 pt, Dynamic Type Large → AX5 | System fonts, font scaling; display / headline / title / subtitle / body roles |
| Colour / appearance | Light, Dark, **tinted**, **clear**; Lock Screen monochrome vibrant; StandBy Night Mode red | Light, Dark, **dynamic colour** from the wallpaper / theme |
| Gestures | Tap; buttons and toggles (iOS 17+) | Tap and **vertical swipe** (scrolling lists, grids) |
| Collections | Fixed rows per size, no scrolling | Scrolling lists and grids (not on Android Auto) |
| Header | Optional; small logo top-right or coloured title | Recommended for scrolling / contextual widgets: **icon always**, title when space allows, context actions |
| Configuration | Edit Widget (system), or automatic content | System configuration activity after drop; reconfigure later |
| Updates | Timeline + system refresh budget; show "updated" when stale | Periodic + manual **refresh button** when users expect faster data |
| Real-time | **Live Activities** (Dynamic Island, Lock Screen) | **Live Updates** — progress-centric notifications (Android 16) |
| Discovery | Gallery: name + verb-first description + preview | Widget picker: default size, accurate preview, unique name, value description; in-app pin prompt |
| Lock Screen | Accessory circular / rectangular / inline | Not a phone surface; widgets also appear in cars, tablets, desktop |

## 2. Designing one widget for both

1. Write the single purpose once; pick the **base pattern** (big number, list, grid, image, toolbar, status) — it maps on both
   (`../../apple-design-widget/references/widget-patterns.md`, `android-widget-guidelines.md` §5).
2. Map sizes: iOS small ≈ Android 2 × 2 · iOS medium ≈ Android 4 × 2 · iOS large ≈ Android 4 × 4. Android also needs **2 × 1**
   (and ideally 1 × 1) and in-between widths — plan breakpoints, not three fixed frames.
3. Lists: on iOS cut to what fits; on Android let them scroll and add a header with icon.
4. Touch targets: lay out for 48 dp; it satisfies 44 pt too.
5. Colour: brand in accents; on iOS test tinted / clear, on Android map colours to Material roles so dynamic colour works.
6. States: draw loading, empty, needs setup, signed-out, error, stale, after-tap for both; Android adds a refresh button when needed.
7. Don't force identical visuals: iOS uses SF Symbols and system type; Android uses Material icons, system font, dynamic colour.

## 3. Shared accessibility rules
- Contrast: small text ≥ 4.5 : 1, large or bold text ≥ 3 : 1; check Light, Dark and Increase Contrast.
- Never state success / error / status by colour alone.
- Let text grow (Dynamic Type / font scaling); avoid fixed-height containers that clip; let rows stack vertically when text is large.
- Screen readers (VoiceOver / TalkBack): every icon button labelled, decorative images hidden, focus order = reading order = visual order.
- Details: `../../mobile-ux-fundamentals/references/accessibility.md`.
