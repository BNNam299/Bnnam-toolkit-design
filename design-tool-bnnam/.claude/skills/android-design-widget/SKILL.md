---
name: android-design-widget
description: Android home screen app widgets (Jetpack Glance, Material You) — widget types, launcher grid cells to dp (1×1 57×102 … 5×4 349×455), resizing and breakpoints, Google's canonical layouts (search toolbar, toolbar, image list, checklist, action list, full-bleed, image grid), 48dp targets, system corner radius, dynamic color, light/dark, header rules, loading/empty/error/refresh states, widget picker preview and description, official quality tiers (Tier 3/2/1, WL/WC/WD/WT/WS IDs), cars, Live Updates, and an iOS vs Android widget comparison. Use whenever someone designs, reviews or ports a widget for Android, or one widget for both platforms, including Vietnamese requests like "thiết kế widget Android", "widget màn hình chính Android", "widget 4x2", "widget Android khác iOS thế nào", "làm widget cho cả iOS và Android". For iOS widgets, Live Activities and widget layout ideas use apple-design-widget; for in-app Android components use material-design-3.
---

# android-design-widget — Android home screen widgets (Material You, Jetpack Glance)

This skill covers **app widgets on Android launchers**: placed on a grid, resizable, themed by the system. In-app components
(buttons, bars, sheets) are Material 3 → `../material-design-3/SKILL.md`. iOS widgets, Lock Screen accessories, StandBy and Live
Activities → `../apple-design-widget/SKILL.md`. Layout ideas from real apps (search + shortcuts, action grid, people row, status,
re-order card…) → `../apple-design-widget/references/widget-patterns.md` — the patterns transfer; redraw them in cells and dp.

## Need → Read

| Need | Read |
|---|---|
| Widget type, limits, quality tiers with IDs, cells → dp table, breakpoints, canonical layouts, style, discovery, cars | `references/android-widget-guidelines.md` |
| Same widget on iOS and Android — size mapping, differences, shared accessibility | `references/widget-platform-comparison.md` |
| Layout ideas proven in real apps (wireframes) | `../apple-design-widget/references/widget-patterns.md` §3–7, §11 |
| Material colour roles, type scale, shape tokens | `../material-design-3/SKILL.md` |
| Android platform summary (window classes, system bars) | `../material-design-3/references/android-platform.md` |
| Accessibility (contrast, font scaling, TalkBack) | `../mobile-ux-fundamentals/references/accessibility.md` |
| Live progress (delivery, ride, navigation) | `references/android-widget-guidelines.md` §10 — Live Updates, not a widget |

## Core rules (apply even without opening a reference)

### 1. One purpose, one base type
- Choose **one primary use case**. Pick the base type: **information** (weather, score), **collection** (scrolling list / grid of
  same-type items), **control** (remote-control buttons, search), or **hybrid** built around one base type.
- Widget = "snack", app = "meal": the app always shows more detail. Good links: generative actions (new message) and opening the app
  at the top level.

### 2. Grid, sizes, resizing
- Design for **size buckets**, never one phone's grid — cells differ per device. Typical 5 × 4 phone (portrait, dp): 1 × 1 57 × 102 ·
  2 × 1 130 × 102 · 4 × 1 276 × 102 · 5 × 2 349 × 220 · 5 × 4 349 × 455; formula (73n − 16) × (118m − 16).
- Set default span (`targetCellWidth/Height`) per form factor, a min and a max. Below the min the use case must still be clear and
  every target ≥ **48 × 48 dp**.
- Growing **adds** content or a ≥ 48 dp button at each breakpoint — **never scale text and icons linearly**. If bigger only adds blank
  space, cap the size; scrolling lists may grow freely.
- Quality target: **Tier 2 standard** always; **Tier 1** = resizable to 2 × 1 and at least two of 1 × 1, 2 × 2, 4 × 2, 4 × 4.

### 3. Fill the bounds, system shape
- The container stretches **edge-to-edge** across its cells at every size — no outer padding (misaligned widgets get removed).
  Rectangles touch all 4 edges (Tier 1; a 4 × 1 search bar may touch 2); custom shapes touch at least 2 opposing edges.
- Rectangular widgets use the **system corner radius** (OEM specific); keep important content away from corners. Minimal widgets
  (photo, weather, now playing) may be one expressive shape.

### 4. Gestures and layout
- Only **tap** and **vertical swipe**: no horizontal paging inside a widget (it switches home panels).
- Start from a **canonical layout**: text, text + image, search toolbar, toolbar, text + image list, checklist, action list,
  full-bleed image (Android 17+), image grid.
- Header (icon always, title when space allows, contextual actions) for scrolling or contextual widgets; skip it on full-bleed or
  tight sizes. Collections scroll and show more items and detail at 4 × 2 and 4 × 4.

### 5. Colour and type
- Use **Material colour roles** so dynamic colour (wallpaper / theme, Android 12+) and light / dark both work; brand in accents or a
  custom theme, contrast always passing (small text ≥ 4.5 : 1). Never colour as the only signal.
- System fonts; hierarchy by weight and size across display / headline / title / subtitle / body; bold expressive numbers are fine.

### 6. States and freshness
- Draw **loading**, **empty / zero** (fills large sizes without sparse areas), **before login** (a use case or call to action),
  **error on the widget itself**, **after an action** (widget updates at once — also after related actions in the app), and a
  **manual refresh** when users expect data faster than the widget refreshes.
- Setup goes through the **system configuration** flow after the drop; colour / shape options live there, not as duplicate widgets.

### 7. Discovery
- Picker: a default size that sells the function, an **accurate preview** (size, layout, user content or system theme), a
  **unique descriptive name**, a **value description**. Prompt "add widget" inside the app after a related task — never blocking.

### 8. Other surfaces
- Cars (Android Auto, Google built-in): no manual scrolling — first items carry the value, or ship a one-surface variant; light +
  dark + dynamic theme. Tablets / foldables: own target sizes, exact layouts can get 4 sizes.
- Live progress (ride, delivery, navigation) → **Live Updates** (progress-centric notifications, Android 16), not a widget.

## Workflow (designing an Android widget)
1. Write the purpose in one sentence; pick the base type and the canonical layout (§1, §4).
2. Choose size buckets: default span, min, max; list what each breakpoint adds (§2) — sketch 2 × 1 (or 1 × 1), 2 × 2, 4 × 2, 4 × 4.
3. Build frames at the dp sizes from the table, container edge-to-edge, system radius, Material roles for every colour (§3, §5).
   In Figma the widget is an auto layout and every cluster of related elements is its own named auto-layout frame (art · text group ·
   value row · actions); only art that bleeds past the padding may sit absolute behind Content — `../figma-vector-illustration/SKILL.md` rules 3–5.
4. Draw states: loading, empty, before login, error, after action, refresh (§6); light, dark and one dynamic-colour preview.
5. Write the picker name + description and the preview; note the in-app pin moment (§7).
6. Check the Tier 2 list, then Tier 1 if targeted (`references/android-widget-guidelines.md` §3, §11). When the same widget ships
   on iOS, run `references/widget-platform-comparison.md` §2.

## Common pitfalls
- Designing on one phone's grid; fixed square widgets; custom outer padding or a custom corner radius.
- Stretching the small layout instead of adding content; text and icons scaled up with the widget.
- Horizontal carousels or swipe gestures inside the widget.
- Hard-coded brand colours that break dynamic colour or dark theme; contrast below 4.5 : 1.
- No preview, a preview that doesn't match, a generic name or description, several widgets that differ only by colour.
- Widget not updating after the user taps a checkbox or acts in the app; stale data without refresh.
- Copying the iOS layout 1 : 1 (fixed rows, SF Symbols, 44 pt targets) instead of adapting.

## Self-check before reporting
- [ ] One purpose; base type and canonical layout named.
- [ ] Sizes given in cells and dp; min, max, default per form factor; breakpoints add content; targets ≥ 48 dp at min size.
- [ ] Edge-to-edge, system radius, no outer padding; only tap and vertical scroll.
- [ ] Material colour roles; light, dark, dynamic colour; contrast passes; not colour-only.
- [ ] Loading, empty, before-login, error, after-action, refresh states drawn.
- [ ] Preview, name, description; configuration via the system flow.
- [ ] Tier stated (2 or 1) and its list checked; iOS differences handled if the widget ships on both.
