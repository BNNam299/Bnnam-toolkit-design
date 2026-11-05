# Android app widgets — official guidance: types, limits, quality tiers, sizing, canonical layouts, style, discovery, form factors

> Source: developer.android.com, fetched 2026-11-05 — `docs/quality-guidelines/widget-quality` (verbatim table text),
> `develop/ui/views/appwidgets/overview`, `develop/ui/views/appwidgets/layouts`, `design/ui/mobile/guides/widgets` (overview,
> `layouts`, `sizing`, `style`, `discovery-promotion`, `adapt`), `about/versions/16/features/progress-centric-notifications` —
> condensed, every rule and number kept; canonical layouts redrawn as wireframes. Google wins over this summary.

Units are **dp**; sizes are launcher **grid cells** (columns × rows). Wireframe legend as in
`../../apple-design-widget/references/widget-patterns.md`.

## Contents
1. What a widget is, and the four widget types
2. Limitations (gestures, elements)
3. Quality tiers — Tier 3 low quality · Tier 2 standard · Tier 1 differentiated (IDs verbatim)
4. Sizing: grid cells → dp, resize range, responsive breakpoints, fill the bounds
5. Canonical layouts (text, toolbar, list, grid) as wireframes
6. Style: colour roles, dynamic colour, light / dark, shape and corner radius, typography
7. Content, navigation, configuration
8. Discovery: widget picker, preview, name, description, in-app pinning
9. Other form factors: tablet, foldable, desktop, car
10. Real-time on Android: Live Updates (progress-centric notifications)
11. Design checklist

---

## 1. What a widget is, and the four widget types

Widgets are customizable home screen elements that show an **at-a-glance** view of an app's most important data and functionality;
content can refresh periodically. Users move them across home screen panels and, if supported, resize them. Get started:
(1) choose **one primary use case**, (2) check Google's widget templates (*Android UI Kit* on Figma community, *Figma Widget
Canonical Builder*), (3) design within the sizing guidelines, (4) test multiple screen sizes, (5) test other form factors (Android
Auto), (6) meet the widget quality guidelines.

| Type | Purpose | Examples | Tap |
|---|---|---|---|
| **Information** | Show crucial elements and how they change over time | Weather, clock, sports score | Opens the app at a detailed view |
| **Collection** | Many elements of the same type; **scroll vertically** | Gallery photos, news articles, emails / messages | Browse; open an element's detail; interact (mark done — compound buttons from Android 12, API 31) |
| **Control** | Frequently used functions triggered from the home screen — a "remote control" | Home lights on / off, search | May open a detail view if the function outputs data (search) |
| **Hybrid** | Mix of the above | Music player = control + now-playing info | Design around **one base type**, add elements of others as needed |

---

## 2. Limitations

- Widgets share the home screen's navigation: horizontal swipe switches home panels. **Only touch and vertical swipe** are available
  inside a widget.
- UI building blocks that need restricted gestures (horizontal pagers, swipe-to-dismiss…) are not available.
- Widgets can be shown by Google Assistant (App Actions), not currently by Gemini as the assistant.

---

## 3. Quality tiers (IDs and wording from the official checklist)

### Tier 3 — Low quality (any one of these)
| ID | Description |
|---|---|
| WL-1 | Placed widget does not fill the bounds of the host grid. |
| WL-1.1 | Widget doesn't touch at least 2 opposing edges of the grid (custom shapes are fine if they touch 2 edges). |
| WC-3 | Text and icon buttons have insufficient colour contrast for accessibility. |
| WD-4.2 | Widget name isn't included in the widget design. |
| WD-4.3 | Widget has no preview image. |
| WT-3 | Content is consistently stale or untimely. |
| WT-3.1 | Widget doesn't update after the user completes an action **from the widget**. |
| WT-3.2 | Widget doesn't update after the user completes a related action **in the app**. |
| WT-4 | UI isn't functional or content is cropped. |

### Tier 2 — Standard (all required)
| ID | Description |
|---|---|
| WL-1 | Aligns with other host elements on the vertical or horizontal axis; no extra space. |
| WL-1.2 | All shapes hit at least 2 opposing edges of the grid bounds. |
| WL-4 | Resizable → define min and max size; **rearrange to show more content** as it grows; **don't scale text and icons linearly**. |
| WL-4.1 | If a larger size only adds blank space, set a max width / height; if it shows more content (taller scrolling list), allow unrestricted resizing. |
| WL-4.2 | Minimum size shows a clear use case and meets **48 × 48 dp** touch targets (system may scale targets on desktop / car). |
| WD-4 | Accurate preview in the widget picker (static asset). |
| WT-1 | Zero / empty states scale to larger bounds **without sparse areas**; installed before login → show a distinct use case or a call to action. |
| WT-2 | Manual **refresh** if users expect data to change faster than the UI refreshes. |

### Tier 1 — Differentiated (recommended and featured; all of Tier 2 plus)
| ID | Description |
|---|---|
| WL-1.1 | Rectangular widgets **hit all four edges** of the grid bounds; custom shapes hit all 4 edges of a square grid; exception: a **4 × 1 search bar** may hit only 2 edges. |
| WL-2 | Resizable to **2 × 1** and **at least two of 1 × 1, 2 × 2, 4 × 2, 4 × 4**. |
| WL-3 | Header used consistently. Recommended when content scrolls or the header gives context (list name). Optional when full bleed (photo), space is limited, or the header is redundant. If used: **icon always present**, title when there is space, actions based on widget context. |
| WL-5 | Collection / feed widgets use vertical scrolling; at 4 × 2 and 4 × 4 show more items and more detail per item. |
| WC-1 | Colour theming from device or app context (dynamic colour). |
| WC-2 | Light and dark palettes. |
| WD-1 | Preview shows layout proportions for the target form factor and includes user content, a system theme, or both. |
| WD-4.4 | Description helps users understand the widget's value. |
| WD-4.5 | Name is descriptive and unique among the app's widgets. |
| WS-2 | Rectangular widgets use the **system corner radius** (OEM specific). |
| WS-3 | Uses the loading-state spec and **shows errors directly on the widget UI**. |
| WS-4 | Uses **system configuration** instead of a custom settings entry point. |
| WS-5 | Uses the **system launch transition** entering / exiting the app. |

Do / Don't from the page: touch targets 48 × 48 dp, not smaller · sufficient contrast · fill all 4 edges, no custom size that leaves
gaps · header to spec, no custom title sizes · unique succinct description, not generic · system corner radius, not a custom one ·
preview accurate.

---

## 4. Sizing

### 4.1 Grid cells → dp (typical 5 × 4 handset, Pixel 4 estimate)
| Cells (w × h) | Portrait (dp) | Landscape (dp) |
|---|---|---|
| 1 × 1 | 57 × 102 | 127 × 51 |
| 2 × 1 | 130 × 102 | 269 × 51 |
| 3 × 1 | 203 × 102 | 412 × 51 |
| 4 × 1 | 276 × 102 | 554 × 51 |
| 5 × 1 | 349 × 102 | 697 × 51 |
| 5 × 2 | 349 × 220 | 697 × 117 |
| 5 × 3 | 349 × 337 | 697 × 184 |
| 5 × 4 | 349 × 455 | 697 × 250 |
| n × m | (73n − 16) × (118m − 16) | (142n − 15) × (66m − 15) |

- Cell count, size and spacing **vary by device** (many phones 5 × 4, tablets larger) — design for **size buckets**, not one phone's grid.
- Widths come from the **portrait** column (narrowest cells); heights from the **landscape** column (shortest cells). E.g. resizable
  down to 1 cell wide → `minResizeWidth` ≤ 56 dp; 1 cell high → `minResizeHeight` ≤ 50 dp.
- Android 12+: `targetCellWidth` / `targetCellHeight` = default span in cells (used instead of `minWidth` / `minHeight`), plus
  `maxResizeWidth` / `maxResizeHeight`. Set targets for **handheld and tablet** separately; the widget can still end up larger than max.
- Example: target 3 × 2, min 180 × 110 dp, resizable 180–530 × 110–450 dp → 3 × 2 up to 5 × 2 on a 5 × 4 grid.

### 4.2 Responsive breakpoints
- Provide a **small set of layouts, each valid for a size range** (responsive), or exact layouts per reported size (typically 2 on
  phones — portrait / landscape — and 4 on foldables).
- Worked example (weather): small layout from 180 × 110 dp (3 × 2: place, temperature, symbol) · medium from 270 × 110 dp (4 × 2 /
  5 × 2: + "Mostly cloudy" + hourly 4–7 pm) · large from 270 × 280 dp (5 × 3: + Tue–Wed daily · 5 × 4: + Thu–Fri).
- Each breakpoint **adds** supplemental content or a new ≥ 48 dp button; it never just stretches.

```text
3 × 2 small               4 × 2 medium                         5 × 4 large
╭────────────────╮        ╭───────────────────────────────╮    ╭──────────────────────────────────╮
│ Tokyo          │        │ Tokyo            Mostly cloudy │    │ Tokyo               Mostly cloudy │
│ 14°   ☁        │        │ 14°  ☁     4pm 5pm 6pm 7pm     │    │ 14°  ☁      4pm 5pm 6pm 7pm       │
╰────────────────╯        ╰───────────────────────────────╯    │ Tue ☀ 18/9 · Wed ☂ 15/8 · Thu …   │
                                                               │ Fri ☀ 19/10                       │
                                                               ╰──────────────────────────────────╯
```

### 4.3 Fill the bounds
Misalignment with other home screen elements is a main reason users remove widgets. The container **stretches edge-to-edge** at all
sizes — no custom outer padding. Non-rectangular shapes touch the grid on the vertical or horizontal axis. Don't use fixed square
shapes; use responsive rectangles. Don't change shape or size when the widget is first dropped.

---

## 5. Canonical layouts (Google's prebuilt set)

```text
TEXT ONLY                     TEXT + IMAGE                       SEARCH TOOLBAR (4 × 1 may touch 2 edges)
╭─────────────────────╮       ╭───────────────────────────╮      ╭─────────────────────────────────────────╮
│ Title / status line │       │ Headline text      [▢ img]│      │ ● ╭ ⌕ Search ─────────────╮ (🎤) (📷)   │
│ Short description   │       │ Supporting line           │      ╰─────────────────────────────────────────╯
╰─────────────────────╯       ╰───────────────────────────╯      search is the primary action; extra buttons ≥ 48 dp
TOOLBAR                                     TEXT + IMAGE LIST (scrolls)          CHECKLIST (scrolls)
╭───────────────────────────────────╮       ╭───────────────────────────╮       ╭───────────────────────────╮
│ ● Brand   (⌕) (＋) (✎) (↗) (🎤)    │       │ ● Header            (↻)   │       │ ● To-do            (＋)   │
╰───────────────────────────────────╯       │ [▢] Title / secondary     │       │ ☐ Buy milk                │
 brand first, then most-used tasks;         │ [▢] Title / secondary     │       │ ☑ Call mom                │
 less-used buttons hide as it shrinks;      │ [▢] Title / secondary     │       │ ☐ Pay rent                │
 add a ≥ 48 dp button per breakpoint        ╰───────────────────────────╯       ╰───────────────────────────╯
ACTION LIST (on/off states)                 FULL-BLEED IMAGE (Android 17+, snap scroll)   IMAGE GRID (± labels, scrolls)
╭───────────────────────────╮               ╭───────────────────────────╮       ╭───────────────────────────╮
│ ● Home              (＋)   │               │[▢ image fills widget     ]│       │ ● Photos            (↻)   │
│ ▭ 💡 Kitchen   ● on       │               │ ● Title on scrim     (ⓘ) │       │ [▢] [▢] [▢]               │
│ ▭ 🌡 Thermostat ○ off     │               ╰───────────────────────────╯       │ [▢] [▢] [▢]               │
╰───────────────────────────╯                each item = full widget height      ╰───────────────────────────╯
```
- Text layouts: concise information; optional image for impact; switch side-by-side ↔ stacked with breakpoints.
- Toolbars: quick access to frequent tasks; ideal for toggleable settings or task links.
- Lists: news headlines, playlists, messages, to-dos; containerized or containerless rows; checklist gives clear targets to mark done;
  action list shows visual on / off state for immediate feedback. **Lists on Android Auto don't scroll.**
- Grid: visually rich, rows and columns adapt to screen size.
- Empty / no-data content is part of each canonical layout (`EmptyListContent`, `NoDataContent` in the samples): icon + one line +
  action.

---

## 6. Style

| Topic | Guidance |
|---|---|
| **Colour** | Use **Material colour roles and tokens** → contrast compliance + dynamic colour + light / dark. Express hierarchy with accent roles, or a playful custom theme for brand. |
| **Dynamic themes** | Android 12+: widgets can use the device theme colours for buttons, backgrounds, components → consistent with other widgets, icons, wallpaper, across OEM themes. |
| **Light / dark** | Required for a quality widget — a widget that ignores dark theme looks out of place. |
| **Shape** | Rectangular widgets use the system corner radius property (`system_app_widget_background_radius`) — consistent across devices, prevents clipping. Minimal-content widgets (photo, weather, now playing) may be one **expressive shape**; complex ones can use expressive shapes inside for hierarchy (new content, call to action). Keep important content away from corners. |
| **Typography** | System fonts; hierarchy through weight, size, line height, letter spacing. Five roles: display, headline, title, subtitle, body. Add expression with dramatic scales — bolder headlines, labels and data. Mind line and letter spacing at small sizes. |

Material tokens and roles in detail: `../../material-design-3/SKILL.md` (colour roles, type scale, shape).

---

## 7. Content, navigation, configuration

- Widget = the information **"snack"**, the app = the **"meal"**; the app must show more detail than the widget. Like newspaper teasers,
  widgets can "advertise" new and interesting content inside the app.
- Good navigation links: **generative functions** (new document, new message) and **open the app at the top level** (can replace an
  app shortcut; the app icon gives identity when data is ambiguous).
- Resizing: touch & hold → release → resize handles. Collections resize easily (the scroll area grows); information widgets need
  planned content per size. Fixed-size widgets need not support resizing.
- **Configuration:** when setup is needed (mail folder, photo choice), Android shows the configuration right after the drop. Android
  12+ lets users reconfigure placed widgets and lets you skip the default step. Offer colour / shape choices **inside configuration**
  rather than publishing duplicate widgets.

---

## 8. Discovery

- Users add widgets from the **widget picker** (long-press home screen or app icon); some devices show a suggestions section of
  quality widgets.
- **Default size = shop window**: showcase the function without clutter; set `targetCellWidth/Height` per form factor (don't use the
  same default on phones, tablets, foldables).
- Don't publish several widgets of the same purpose differing only by colour or shape — use configuration.
- **Preview:** accurate to size and layout (a missing preview shows only the app icon); use `previewLayout`; with dynamic colour, show
  the preview in those colours.
- **Name** included in the design, descriptive, unique among the app's widgets; **description** clear, concise, a value proposition.
- **In-app pinning:** offer "add widget" at relevant moments — after the user completes a task that has a matching widget, or after
  repeated use of a feature the widget streamlines; subtle hint (icon, brief animation); never block the primary action.

---

## 9. Other form factors

- **Tablets, desktops:** same principles, different input expectations; larger grids → set separate target sizes.
- **Foldables:** exact layouts can receive four sizes.
- **Cars (Android Auto, cars with Google built-in):** build with **Jetpack Glance**, responsive sizes, light + dark, dynamic theming,
  fill the grid (WL-1). Cars **don't support manual scrolling**: if the widget uses a scrolling list, offer a version with all
  essential information on one surface, or put the most valuable personalised content first — only the first items show.

---

## 10. Real-time on Android: Live Updates

Android 16 adds **progress-centric notifications** (`Notification.ProgressStyle`) — the counterpart of iOS Live Activities for ride
sharing, delivery and navigation. Design: vehicle / item image as large icon in its real colour; **segments** for the journey and
**points** for milestones (food prepared, picked up, delivered); concise text with arrival time, driver name and journey state;
update segments and text as reality changes (traffic → segment colour). Use this, not a constantly refreshing widget, for live
progress.

---

## 11. Design checklist

- [ ] Small portion of glanceable information; details live in the app.
- [ ] Right widget type (information, collection, control, hybrid around one base type).
- [ ] Content plan per size bucket; layout stretches and contracts independent of orientation and device.
- [ ] Fills the grid bounds; system corner radius; no custom outer padding.
- [ ] Targets ≥ 48 × 48 dp, also at the minimum size.
- [ ] Light + dark, dynamic colour, contrast passes.
- [ ] Loading, empty / zero, signed-out (use case or call to action), error on the widget, after-action update, manual refresh if needed.
- [ ] Configuration only when needed, through the system flow.
- [ ] Accurate preview, unique name, value description; in-app pin prompt at the right moment.
- [ ] Tier target stated (2 standard, or 1 differentiated: 2 × 1 + two of 1 × 1 / 2 × 2 / 4 × 2 / 4 × 4, header, scroll at 4 × 2 / 4 × 4).
