# Apple video atlas: iPhone Duo tech talks, Device Hub and the WWDC25 design system — by video and timestamp

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-video-transcript-visual-atlas.md (8 videos, 149 frames in `images/apple-videos/`) @ 3c0e291 — translated, complete

Labels: everything here is `[A]` — what Apple shows or says in the video — unless tagged `[T]`. **Use this file to verify a statement by source and timestamp**; for applying knowledge by topic use the topic references (`duo-layout-transformation.md`, `duo-components.md`, `duo-device-postures.md`, `duo-multi-display-scenes.md`, `duo-camera-*.md`, `duo-handoff-testing.md`, `duo-ios27-visual.md`). Where a topic reference already holds the full detail, the entry here is a short summary plus the link.
Frames come from Apple's official videos, checked visually on 13 Oct 2026 (exact seek, 5 s storyboard + 0.5 s around transitions; presenter-only frames, title cards and mid-transition frames removed, except where the motion itself is the rule). Frames with a layout are drawn as wireframes; code / diagram / tool screenshots are described in one line. Video links: `duo-apple-sources.md`.

## Contents
1. 111461 Prepare your app for iPhone Duo (10:09)
2. 111462 Raise the bar with iPhone Duo (15:42)
3. 111463 Strike a pose with adaptive layouts on iPhone Duo (18:00)
4. 111464 Leverage multiple displays and scenes on iPhone Duo (07:17)
5. 111465 Build a great camera experience for iPhone Duo (09:27)
6. 111466 Design for iPhone Duo (10:44) — incl. **08:44 presentation across six states**
7. WWDC26/260 Get the most out of Device Hub (17:09)
8. WWDC25/356 Get to know the new design system (18:14)
9. Coverage and deliberate limits

---

## 1. 111461 — Prepare your app for iPhone Duo (10:09)

Scope: SDK opt-in, Device Hub, flexible layout, size class, screen assumptions, standard navigation, safe area, reserved regions, verification. Topic detail: `duo-layout-transformation.md` §2–§3, `duo-device-postures.md` §3–§5.

**00:30–01:16 Three compatibility levels by SDK**
- An app not built with iOS 27 still runs: closed, it uses the part of the screen left of status / camera; open, it appears in a frame of familiar size and ratio instead of the whole canvas.
- Built with the iOS 27 SDK, it also uses the area left of the status bar on the inner display thanks to existing resizability work.
- Only the iOS 27.1 SDK unlocks full edge-to-edge: the app reaches the screen edges and standard navigation / toolbars lay out vertically under the status bar.
- A capability progression, not just a size difference — when judging a screenshot, know which SDK level the app runs.

```text
00:38 — pre-iOS 27.0 SDK built apps
INNER (open)                                   OUTER (closed)
┌──────────────────────────────────────────┐   ┌──────────────────────┬──┐
│ ███████ ┌──────────────────┐ ███████ 9:41│   │ [⚙ ▦ ＋]              │ ◉│
│ ███████ │ [⚙ ▦ ＋]          │ ███████  ◔ │   │ ┌ Springtime flowers┐│9:│
│ black   │ ┌Springtime ──┐  │ black       │   │ └───────────────────┘│ ◔│
│ bands   │ └─────────────┘  │ bands       │   │ ┌ Granny Square ────┐│  │
│         │ ┌Granny Square┐  │             │   │ └───────────────────┘│  │
│         │ (iPhone-sized    │             │   │ (left of status /    │  │
│         │  frame, centred) │             │   │  camera strip)       │  │
└──────────────────────────────────────────┘   └──────────────────────┴──┘
```

**01:17–01:32 Start with Device Hub** — Xcode 27.1, iPhone Duo simulator in Device Hub; bottom controls open, close, rotate and fold the device. Pose layout bugs show once you opt into full screen; the simulator starts the audit, it is not proof that sensors, camera or real hardware are right. *(Frame 01:24 — Device Hub with Duo and the open / close / rotate / fold controls.)*

**01:33–02:45 Flexible layout is the foundation**
- The app resizes across the whole continuum: closed, open, rotated, folded — not two artboards "phone" and "tablet".
- Duo continues changes iPhone already handled: size, screen shape, Dynamic Island, new camera position.
- iOS 27 also lets iPhone apps resize large in iPhone Mirroring on Mac — flexible layout is not Duo-only logic.
- Opening / closing can cross a size-class boundary but the app is still an iPhone app — never infer capability or layout from the idiom.
- Good layouts use available space and size class to choose the small / large experience, never a model check or a fixed screen size.

**02:46–03:56 Size class and orientation**
- Horizontal / vertical size class express the right experience for the space in each dimension; SwiftUI reads them from the environment, UIKit from the trait collection.
- Outer portrait: compact width, regular height · outer landscape: compact width, compact height · inner: regular in both, room for sidebars and expanded hierarchy.
- The outer display handles orientation like a normal iPhone; landscape helps when the device stands as a tent.
- The inner display does not follow supported interface orientations the way the outer does — never use interface orientation as the main layout condition; use size class.
*(Frames 02:55 — the two size-class dimensions read independently; 03:18 — drawn in `duo-adaptive-layout-system.md` §3.3.)*

**03:57–05:00 Remove screen assumptions**
- On a two-display device `main screen` is ambiguous and will be deprecated; avoid referencing a screen. Prefer environment, trait collection or scene bounds; if you must, get the screen dynamically from the current window scene.
- `ConcentricRectangle` (SwiftUI) / `UICornerConfiguration` (UIKit) make surfaces / cards follow the hardware curve; never copy a radius from a screenshot.
- `UIRequiresFullScreen` is still honoured, but the app still resizes when the device opens / closes.
- Supported orientations still apply, but the app may be scaled on the inner display, even in Split View — locking orientation never replaces responsive layout.
*(Frame 04:23 — code beside a blue surface following the corner geometry of the current environment. Frame 04:48 — a `UIRequiresFullScreen` app on the inner display, resized to the new space and still honouring orientation.)*

**05:01–06:05 Standard navigation and presentation**
- `NavigationSplitView` / `UISplitViewController` collapse columns into a single stack when closed and show tiled / overlay when open.
- `TabView` / `UITabBarController` work on outer and inner, going vertical where appropriate; the inner display may opt into a sidebar for richer navigation.
- Sheets adapt by pose: vertical actions on outer, centered by default on inner. Popover, context menu and alert adapt too — prefer system components over custom copies.
*(Frame 05:20 — drawn in `duo-adaptive-layout-system.md` §6.3. Frame 05:50 — tab / navigation becomes an information-rich sidebar on the inner display.)*

```text
05:35 — TabView (Fitness "Summary")
OUTER                               INNER
┌ Summary ───────────────┬──┐       ┌ Summary ─────────────────────────────────┬──┐
│ ┌ Activity Rings ─────┐│9:│       │ ┌ Activity Rings ──┐┌ Step Count┐┌ Step  ┐│9:│
│ │ ◎ Move · Exercise · ││ ◔│       │ │ ◎ Move …         ││ 3,727 ▁▃▇ ││ Dist. ││ ◔│
│ └─────────────────────┘│ 👤│       │ └──────────────────┘└───────────┘└───────┘│ 👤│
│ ┌Step Count┐┌Step Dist┐│  │       │ ┌ Trends ──────────┐┌ Swimming ┐┌ Mindful┐│  │
│ │ 9,044    ││ 3.94MI  ││ ◎│       │ │ (figure, text)   ││ 0YD      ││ 0MIN   ││ ◎│ tab group
│ └──────────┘└─────────┘│ ⟳│       │ │                  │└──────────┘└────────┘│ ⟳│ on the
│ ┌Running ─┐┌Awards ──┐ │ ⚡│       │ │                  │┌ Training Load ─────┐│ ⚡│ vertical
│ └─────────┘└─────────┘ │ 👥│       │ └──────────────────┘└────────────────────┘│ 👥│ bar, both
└────────────────────────┴──┘       └──────────────────────────────────────────┴──┘ displays
```
Same information architecture; content and tab controls are spread over the wider inner display.

```text
06:00 — Sheet (Weather moon detail)
OUTER: sheet fills the pane, ✕ on the bar     INNER: centered card, ✕ in its own header, context dimmed
┌──────────────────────┬──┐                   ┌▯┌──────────────────────────────┐ (weather   9:41┐
│      (moon image)    │9:│                   │ │(✕)        (moon image)       │  cards        │
│                      │ ◔│                   │ │ ← Waning Crescent            │  visible,     │
│ ← Waning Crescent    │✕ │                   │ │   September 9 at 10 AM       │  dimmed)      │
│ MON TUE ▼WED THU FRI │  │                   │ │ SAT SUN MON TUE ▼WED … SUN   │               │
│ Illumination     3%  │  │                   │ │ Illumination 3% · Moonrise … │               │
│ Moonrise     5:03AM  │  │                   │ └──────────────────────────────┘               │
└──────────────────────┴──┘                   └────────────────────────────────────────────────┘
```

**06:06–08:07 Safe area, background, asymmetric margins**
- Navigation bar, toolbar and tab bar sit outside the safe area and avoid status bar / camera themselves.
- Horizontal bars create top / bottom insets; vertical bars create leading / trailing insets.
- Visible or interactive foreground stays inside the safe area — SwiftUI does it by default; UIKit custom layout uses safe-area insets / layout guide. Background / artwork may run full bleed past the safe area and behind toolbar / sidebar.
- Safe area and layout margins are often asymmetric on Duo — never take one edge's inset and double it for the opposite edge; handle each edge independently.
- Split View can put vertical system content on the left or right of the app — drag the app to both sides in Device Hub to check.
*(Frames 06:15, 07:35 — drawn in `duo-adaptive-layout-system.md` §4.2–4.3.)*

```text
06:52 — foreground inset, background full bleed (UIKit: foreground.frame = view.bounds.inset(by: view.safeAreaInsets))
┌───────────────────────────┬────┐
│░┌ Springtime flowers ───┐░│ ◉  │  ░ = background continues to the edge and behind the bar
│░└───────────────────────┘░│9:41│  cards (foreground) stay inside the safe area
│░┌ Cute jumping frog ────┐░│ ⚙  │
│░└───────────────────────┘░│ ▦  │
│░┌ Pink crane ───────────┐░│ ＋ │
└───────────────────────────┴────┘
```

```text
07:58 / 08:04 — Split View in Device Hub: the app on the right, then on the left
APP ON THE RIGHT                               APP ON THE LEFT
┌──────────┐┌ Springtime flowers ───────┬─┐    ┌─┬ Springtime flowers ──┐┌ Home screen ──┐
│ (other   ││ [photo] [photo]           │‹│    │‹│ [photo] [photo]      ││ app icons     │
│  half)   ││ Origami Tulip …           │⇪│    │⇪│ Origami Tulip for …  ││               │
│          ││                           │⚙│    │⚙│ Materials · Tips …   ││               │
└──────────┘└───────────────────────────┴─┘    └─┴──────────────────────┘└───────────────┘
 controls on the app's outer (right) edge       controls move to the app's outer (left) edge
```

**08:08–09:11 Reserved regions for custom UI**
- iOS 27.1 adds `ReservedRegion` (SwiftUI) and `UIViewReservedRegion` (UIKit). Custom UI may use the area outside the safe area while still avoiding system-provided UI — for custom bars and edge-to-edge interfaces; never a reason to drop the safe area for all foreground.
- Decision order: system bars → foreground by safe area → full-bleed background → each edge separately → reserved regions for complex cases.
*(Frames 08:20, 08:30 — the SwiftUI and UIKit APIs.)*

**09:12–10:09 Wrap-up** — Xcode 27.1 renames the modernization skill **App Resizability** (SwiftUI + iPhone Duo). Recommended loop: build with the new SDK → run Duo in Device Hub → check every pose → audit flexible / adaptive layout → use App Resizability → test again. Opting into the SDK only unlocks capability; quality comes from removing screen assumptions and testing real geometry.

## 2. 111462 — Raise the bar with iPhone Duo (15:42)

Scope: why bars go vertical, system-container opt-in, shared region, item order, representation, axis behaviour, custom views, compression, overflow, visibility priority, opt-out. Full topic detail: `duo-components.md` §1–§10.

**00:28–01:28 Why bars move to the edge** — the wide outer silhouette adds width but limits height; top / bottom controls move to the edge to keep height for content and stay reachable; the bar stays on the edge in inner landscape for continuity; inner portrait returns to familiar horizontal bars. Same components and hierarchy, adapted — not a different navigation set. *(Frames 00:52 — navigation, toolbar and tab controls on the outer edge; 01:12 — the same components back to horizontal bars in inner portrait.)*

**01:29–02:00 Four questions of a bar** — move to the new axis; item order and container relation; prepare content for the vertical axis; manage overflow. A bar that only "stands up" without the other three is not an adaptive bar.

**02:00–03:08 Opt-in conditions** — rebuild with the new SDK; use bars managed by a navigation container (`TabView`, `NavigationStack`, `NavigationSplitView`, `UINavigationController`, `UITabBarController`); SwiftUI puts the toolbar modifier inside the navigation container; UIKit puts toolbar items on the view controller inside the navigation controller instead of a standalone `UIToolbar`. Content in a `UIToolbar`, `UINavigationBar` or `UITabBar` used as a standalone custom bar is **not** considered for vertical behaviour. *(Frame 02:45 — toolbar items of a navigation controller vs a standalone toolbar.)*

**03:09–04:28 Shared bar region and ownership**
- Navigation, toolbar and tab controls share one vertical region — picture the horizontal bars merged, then rotated into a vertical stack (frames 03:18 → 03:19 → 03:20, drawn in `duo-adaptive-layout-system.md` §9.1; the mid-animation frame is kept on purpose: the two capsules rotate, rescale and restack on one axis, keeping group identity).
- Combinations vary: Notes toolbar only (03:26 — editing controls stay with the content, screen-level actions on the vertical bar), Clock tab bar (03:30), Fitness both (03:34 — groups keep hierarchy and spacing).
- In complex layouts an item goes vertical only if its container sits at the display edge. Split view: the detail column takes part; other columns' items stay horizontal (03:44, 03:50).
- An inspector gets no vertical bar of its own when the detail already has one — avoids two edge axes (03:56).
- Outer sheets have a vertical toolbar (04:00 — a narrow sheet at the display edge has its own vertical toolbar; controls follow the sheet's container, not the screen behind). Inner centered sheets keep horizontal items; an expanded sheet keeps separate control areas for background sidebar and foreground sheet (04:06).
- With a changed preferred placement, a sheet on the left has no vertical bar; a sheet on the right, at the edge, gets it (04:16).
- The bar is anchored to the hardware, so it does not change sides in RTL; content mirrors / adapts around it (04:26).

```text
03:44 — detail column at the display edge takes the vertical bar (Reminders)
┌ sidebar (dimmed) ──────┬ Reminders ─────────────────────────┬──┐
│ (≡ ⋯ ▯)                │ ○ Milk                             │9:│
│ [Today][Scheduled]     │ ○ Tofu                             │ ◔│
│ [All 6][Flagged]       │ ○ Eggs                             │🔍│ detail's controls
│ [Urgent][Completed]    │ ○ Yogurt                           │⇪ │ on the vertical bar
│ My Lists: Reminders 6  │ ○ Bread (ideally sourdough …)      │☰ │
│ Recently Deleted 1     │ ○ Turmeric                         │⋯ │
│ (sidebar keeps its own │                               (＋) │  │
│  controls)             │                                    │  │
└────────────────────────┴────────────────────────────────────┴──┘

04:16 — preferred placement: the sheet at the edge gets the vertical bar (Reminders "New List")
┌ sidebar (dimmed) ───┬ sheet "New List" ─────────────────────┬──┐
│ [Today][Scheduled]  │ [New List | Templates]                │9:│
│ [All 15][Flagged]   │ (✈ icon) Yosemite Packing             │ ◔│
│ My Lists: Today …   │ List Type            Standard ⌃       │✕ │ sheet's ✕ and ✓
│ Groceries · Work …  │ colours ●●●●●●●●●●●                   │✓ │ on the vertical bar
│                     │ icons ☺ ☰ 🔖 …                         │  │
└─────────────────────┴───────────────────────────────────────┴──┘

04:26 — RTL: content mirrors, the bar stays on the hardware edge (Calendar)
LTR                                  RTL (Arabic)
┌ April 2026 ─────────────────┬──┐   ┌───────────────── أبريل 2026 ┬──┐
│ S M T W T F S               │◉ │   │ (weekday names mirrored)    │◉ │
│       ①  2  3  4            │9:│   │ 4  3  2  ①                  │9:│
│ 5  6  7  8  9 10 11         │‹ │   │ 11 10 9  8  7  6  5         │› │ Back arrow flips,
│ …                           │▤ │   │ …                           │▤ │ position does not
│ ★ April Fools' Day  all-day │WED│  │ all-day  April Fools' Day ★ │1 │
│ ★ Passover          all-day │▦ │   │ all-day          Passover ★ │▦ │
│                             │🔍│   │                             │🔍│
│                             │＋│   │                             │＋│
└─────────────────────────────┴──┘   └─────────────────────────────┴──┘
```

**04:29–05:55 Item order and continuity**
- Keep top-to-bottom hierarchy: first primary navigation (Back or Close), then a prominent action (Done), then the remaining groups.
- The navigation controller adds Back itself. A custom Back / Close uses the semantic cancellation placement; a UIKit leading item does not supplement the default Back.
- The prominent action uses the matching pinned-trailing placement on SwiftUI / UIKit (05:30).
- Other items keep their grouping; a system spacer separates the top and bottom groups after merging (05:36).
- Since some poses use horizontal bars, placement must be stable enough that people never relearn where actions are.

```text
04:50 — order on the vertical axis
 ●      outer camera
 9:41   status
 (‹)    Back / Close — primary navigation
 (✓)    prominent action (Done), tinted
 (⬠)    remaining groups
```

**05:56–07:59 Representation of toolbar content**
- Horizontal bar: fixed height, flexible item width. Vertical bar: fixed width, flexible item height (06:05).
- Symbol-only suits the vertical bar. The item model provides icon **and** title; the system picks the representation by context: on bars an icon first, text if there is no icon; in overflow icon + title.
- Items with an icon may go vertical; text-only items stay on the horizontal axis.
- Even if the UI shows only an icon, the title is required for overflow, expanded form and accessibility. Provide full metadata and let the system choose, instead of designing two different actions.

```text
06:40 — one model item, two representations (Toolbar on iPhone)
┌──────────────────────────────┐
│ 9:41     (island)     ▮▮ ◔   │
│ (‹)             [Edit] (⇪)   │  Edit stays a text item (changes representation → horizontal);
│                              │  Share has a symbol → can go vertical
└──────────────────────────────┘
```

**08:00–08:59 Axis behaviour** — the system infers the axis; `AxisBehavior` overrides it. Related representations of one item stay on one axis. Items that switch between symbol and text (Edit) stay horizontal — system Edit does it itself (08:10); a custom Select-like item uses `horizontalOnly`. Custom / complex views default to horizontal; set `verticalPreferred` only when a good vertical representation exists (e.g. a compass view).

**09:00–10:06 Symbol-only, badges, independent text**
- Cut title-only items and custom views holding image + text so more content can go vertical.
- If the text only reinforces the symbol, drop it from the visible representation but keep the title metadata.
- An inline count can become a system badge so the item is symbol-only and still glanceable (09:22 — Calendar's inbox count); use the standard badge API for consistent appearance.
- If the text carries independent information, e.g. a cart total, keep the control on a horizontal bar. The keyboard accessory bar stays with the keyboard, never moves to the edge.

```text
09:55 — text with its own meaning stays horizontal
│ Reusable Paper Filters   $9.00 (＋) │
│ Whole Bean Sampler      $18.00 (✓) │
│ Cold Brew Concentrate   $14.00 (✓) │
│ [🛒 Cart • 32.00 ─────────────] (🔍)│  "Cart • 32.00" is information → stays on the horizontal bar
```

**10:07–11:39 Custom views on the vertical axis**
- A custom view must fit a fixed width or have a vertically adapted layout; it may change metrics, hide the title and shorten when vertical, as long as meaning and access stay (10:15 — a custom action panel needs its own vertical variant, not a squeezed horizontal one).
- Read the `toolbarVerticalEdge` environment / trait inside content or a custom item to know whether the vertical axis is available — nil / unspecified when not.
- The vertical bar has no scroll-edge effect by default; with Reduce Transparency it gets a background — custom content must be clear in both.
- Flexible spacers are 0 on the vertical axis; fixed spacers keep their minimum. The app adds no extra spacing of its own; use system grouping and placement.

**11:40–13:09 Compression and system overflow**
- Outer landscape has little height; keyboard and PiP compete for more. First decision: keep the toolbar or the tab bar longer.
- Navigation-focused view: the toolbar compresses first so destinations stay reachable — the default. Task-oriented view: the tab bar compresses first to keep frequent actions — set per view with the compression behaviour.
- If the app has its own overflow, merge actions into the system overflow with `ToolbarOverflowMenu` or `additionalOverflowItems` (12:45). Do not turn every menu into overflow — the ellipsis is reserved for system overflow; other menus need their own symbol.

```text
12:20 — task-oriented view keeps its tools; the tab bar compresses first (Games, outer landscape)
┌──────────────────────────────────────────────┬──┐
│ [N icon]  Apple News+ Puzzles                │‹ │
│           Played 1m ago · ★★★★★ 1.6M · 13+   │⇪ │
│           [ Play ]  [ ⚑ Challenge ]          │  │
│ What to Play                                 │  │
│ [tile] [tile] [tile]                         │▣ │ tab bar collapsed
└──────────────────────────────────────────────┴──┘ to one button
```

**13:10–14:20 Visibility priority**
- When the toolbar runs out of room, items go into overflow from the bottom up by default (13:25).
- Assign high, low or custom priority — first per group, then fine-tune items inside the group.
- Compose, New Note and frequent actions leave the bar last; status / badges must stay so people can still glance (14:10 — Calendar).
- Priority expresses product need to the system; never hard-code pixel positions.

```text
13:25 — overflow from the bottom up
┌ group ┐  ✈ ticket
│       │  ▦ calendar
└───────┘
┌ group ┐  💼
│       │  🗺
│       │  👤
└───────┘
  (⋯)      system overflow — the bottom items go here first
```

**14:21–14:52 When to opt out** — most apps suit the vertical bar, but not every view. A single-page bottom-heavy layout like Calculator may keep horizontal bars so content spans the full width; a content-heavy sheet with only a Close item may disable the vertical bar (14:45) so it does not sacrifice the edge. Use the vertical-behaviour API to opt out locally — never for the whole app because of one view.

```text
14:28 — Calculator: iPhone vs Duo outer (bottom-heavy, full width, no vertical bar)
iPhone                           Duo outer
┌──────────────────┐             ┌───────────────────────────┐
│ (🕘)        (▦)  │             │ (🕘)              (▦)   ◉ │
│                0 │             │                         0 │
│ ⌫  AC  %   ÷     │             │ 7  8  9  ⌫   ÷            │
│ 7  8  9   ×      │             │ 4  5  6  AC  ×            │
│ 4  5  6   −      │             │ 1  2  3  %   −            │
│ 1  2  3   +      │             │ ±  0  .  =   +            │
│ ±  0  .   =      │             └───────────────────────────┘
└──────────────────┘              keypad reflows to 5 columns across the full width
```

**14:53–15:42 Checklist** — vertical bars keep content roomy and controls accessible in the new silhouette; build the new SDK; audit every bar and system-container ownership; turn custom items into deliberate vertical representations; set compression and overflow priorities. Nothing new after the checklist.

## 3. 111463 — Strike a pose with adaptive layouts on iPhone Duo (18:00)

Scope: reserved regions, fold, displacement, division / occlusion, system containers, `ArrangementView`. Topic detail: `duo-layout-transformation.md` §5–§11, `duo-adaptive-layout-system.md` §6–§8.

**00:27–02:25 Reserved regions and the fold problem**
- Each display has its own size class; hinge and cameras change the truly usable space. Apple calls them **reserved regions**, like window controls on iPadOS.
- The outer camera is always there; vertical system toolbar / tab bar sit in the new safe area.
- The inner interface may have to avoid the fold or the FaceTime camera while it is active; if the viewfinder is central, important content / controls leave the camera area.
- Half open like a book, the inner display curves through the middle into several usable areas; point content or controls across the "spine" lose readability, like a photo printed across a book's gutter (01:35).
- The fold does not mean every piece of content must split — classify continuous vs point / interactive content first.

**02:26–03:59 Displacement** — many interfaces flow around reserved regions; elements with a clear focal point need deliberate displacement: adjust the frame of the existing element to keep it visible, reachable, unobstructed. An element centered when flat may move into a fitting region when folded (02:55, drawn in `duo-adaptive-layout-system.md` §6.4). Scope may be a button, a container or most of the layout; independent elements move alone, related groups together. Never move too far from the source / context — an image's context menu moves with the image around the fold instead of centering in another region. Articles, feeds, documents, scrolling lists are not displaced — scrolling is already the continuity mechanism.

```text
03:45 — the context menu moves with its source image (Photos "Patagonia", book pose)
┌ Patagonia · 14 items ─────────────╲╱──────────────────────┬──┐
│ [thumb]   ┌──────────────┐  ┌ Copy  Duplicate  Hide ┐   │9:│
│ [thumb]   │  lifted      │  │ Share                 │   │‹ │
│ [thumb]   │  photo       │  │ Favorite · Show in All│   │☰ │
│           │ (left half)  │  │ Make Album Cover …    │   │⋯ │
│           └──────────────┘  │ Delete                │   │▣ │
│                             └───────────────────────┘   │🔍│
└──────────────────────────────╱╲──────────────────────────┴──┘
 photo and its menu sit side by side around the fold as one group, neither straddles it
```

**04:00–05:11 Choosing a region by purpose** — book: the alert moves to the trailing region, near where it continues on the outer display (04:18, drawn in `duo-adaptive-layout-system.md` §7.4). Tabletop: the upper region is for content seen at a distance (an alert may move up to be seen); the lower region is a stable touch surface — media controls and interactive controls go there (04:48, drawn there). When several regions are valid, keep the contextual relationship: a search field stays above the view it searches and in the right relation to the keyboard; when folding, the field changes width / position but never separates from its results or keyboard just to dodge the hinge.

**05:12–06:38 Adapting content in the new region** — position and size are the common changes; other visual properties may change if needed. Action sheet, alert, menu and popover must show whole; the system repositions them around reserved regions. A split view like Reminders rebalances both columns to 50 / 50 around the fold. A grid like Fitness keeps outer margins and widens the spacing at the hinge so tiles sit whole in each region (05:52, drawn in `duo-adaptive-layout-system.md` §6.2). Preservation principle: move, resize or reorganise what exists — never remove content, functionality or layout options because the pose changed.

**06:39–08:38 Division and occlusion regions**
- SwiftUI reads reserved regions from `GeometryProxy`, UIKit from `UIView`; frames come in the view's coordinate space, not a global hinge width (06:55).
- Regions have active / inactive state; queries return only active ones by default; `includeInactive` reveals the capability even when not active (07:25 — an inactive division has width 0).
- The fold is a **division region**: splits one large area into smaller ones; inactive and 0 wide when flat. An inactive division is still useful for high-level decisions, e.g. a grid preferring an even column count to be ready to split.
- The FaceTime camera is an **occlusion region**: covers a small frame without splitting the area; active while the camera is active, inactive when off (07:58).
- Never turn an inactive reserved region into a permanent spacer.

**08:39–11:16 System containers and arrangement** — NavigationStack, NavigationSplitView, TabView give navigation behaviour; List and ScrollView are content containers; **arrangement** is a layout container between the two: arranges a primary and a secondary view by rule without creating navigation (08:48, 09:28 — the three container layers). Podcasts: turning the transcript on splits the screen with Now Playing; folded, the layout splits at the fold; with the transcript off, Now Playing stays in the left region so controls stay reachable instead of centering across the fold. When the Duo is taller than wide, the transcript may use an inline representation instead of a split. An arrangement maps inputs (size class, aspect ratio, active division regions) to outputs (which views show and their frames).

```text
10:18 — Podcasts around the fold (book pose, transcript off)
┌───────────────────────────────╲╱──────────────────────────────┐
│        (episode artwork spans the top of both halves)  9:41  │
│ August 11, 2026               │                              │
│ Bamboo Is Innocent        ⋯   │                              │
│ 99% Invisible                 │                              │
│ ━━━━━━━━━━━━━━━━━  −57:02     │   (right region left empty   │
│ 1×  (⟲15)  (▶)  (⟳30)  ◑      │    for the transcript /      │
│ 🔈 ━━━━━━━━━━━━━━━ 🔊          │    queue when turned on)     │
│ ⌁                             │                      💬  ☰  │
└───────────────────────────────╱╲──────────────────────────────┘
 Now Playing stays in the left region — controls reachable, nothing centered across the fold
```

**11:17–13:20 Split arrangement** — `ArrangementView` takes a primary and a secondary view; UIKit uses `UIArrangementViewController` as the navigation controller's root. Declaring primary / secondary is a **UX decision**: when there is not enough room the system may keep only the primary. The default style is split: horizontal when the view is wider than tall, vertical when taller than wide. Axes can be restricted — if the primary axis is not allowed, the arrangement shows only one view (the PlayerView in the example — 12:45). Split fits when both views must show at once and must not cover each other (12:08, drawn in `duo-adaptive-layout-system.md` §8.2).

**13:21–14:38 Overlay arrangement** — foreground / background instead of two peer panes; primary / secondary order can be swapped and a collapsed state added; when the fold creates enough regions, the overlay may put both views side by side so the secondary gets more room (13:30, drawn in §8.2). SwiftUI reads `overlayArrangementZIndex` to know whether a view is foreground / background and switch collapsed / expanded representation; UIKit reads the equivalent placement state and z-index. **Z-index is layout state for the component contract, not just an implementation detail.**

**14:39–16:08 Split or overlay** — first follow the existing pattern: HStack / VStack-like → split; ZStack-like → overlay. With no pattern yet: overlay when foreground / background is clear and the background may be partly covered (controls over the readable content of Accessibility Reader — 15:20: the content can still scroll); split when main and detail are peers and neither may be covered (player + transcript). An audio note uses split because Up Next gives detail for the playing state rather than floating over the player.

**16:09–18:00 When not to use an arrangement; checklist** — an arrangement gives no navigation; never put `NavigationSplitView` inside `ArrangementView`; avoid putting `ArrangementView` in List / ScrollView (scroll container lifecycle / geometry do not fit) (16:30). Audit centered layouts: two columns or displacement? Prefer system containers / presentations for free behaviour. Custom horizontal split / overlay can move to `ArrangementView` to work across devices. Identify manually laid-out high-priority controls and use Reserved Regions for the displacement they need. Hinge interaction / effects belong to the Device Hinge API (video 111464); never use the hinge angle instead of an arrangement for the main layout.

## 4. 111464 — Leverage multiple displays and scenes on iPhone Duo (07:17)

Scope: hinge interaction, multitasking, multiple scenes, scene accessory, Camera Capture Accessory. Topic detail: `duo-multi-display-scenes.md`.

**00:49–02:34 Hinge is for interaction / effects** — the system wallpaper reacts to the opening angle with a zoom effect; apps can too. SwiftUI `onHingeChange`, UIKit `UIHingeInteraction`. The context gives a high-level status (closed, partially open, fully open) and a continuous angle. Handle null / no hinge so the app works on devices without one. Read the angle only in the right state and reset the effect when leaving partial-open — never leave it stuck at an old value. Example: a guitar app uses the hinge as a whammy bar for pitch bend (01:26) — expressive interaction, not a layout breakpoint.

**02:35–02:58 Boundary between hinge data and layout** — hinge is observed live and suits interaction / effects; layout uses arrangement and reserved-region APIs; never use self-chosen angles such as 80° / 90° as the main breakpoint — that creates brittle layout branches and ignores real geometry (02:42).

**02:59–03:37 Split View and stacked video / app** — every app takes part in side-by-side multitasking on Duo; apps already resizable on iPad or iPhone Mirroring have a good base. Duo also stacks a video and an app; the app handles it with the same size-class and scene-geometry model, not a new assumed device. `[T]` Handoff describes min width, collapse and state continuity, not just a full-screen picture. *(Frame 03:08 — two apps / video sharing the inner display.)*

**03:38–04:21 Several instances and dynamic availability** — Duo is the first iPhone supporting several UI instances of one app; apps with multiple windows on iPad get most of the behaviour. The inner display can create a new window; the outer cannot. A scene request can fail when availability changes, so the UI must not promise an action always works. `UIWindowSceneActivationAction` hides itself when a window cannot be created — a system action beats a custom button that is always visible and then errors. *(Frame 03:45 — two scenes of one app on the inner display.)*

**04:22–04:59 Scene accessory** — pairs extra UI with the main UI on another display (e.g. iPhone as a controller for a game on an external display). The system controls availability dynamically; an accessory is enabled by default but can be toggled or lose its conditions at any time. Observe availability and sync model / UI; an accessory is an enhancement, never the only place for a vital action. `[T]` States at least: unavailable, connecting / loading, active, ended / error depending on the accessory. *(Frame 04:48 — the scene-accessory model.)*

**05:00–06:43 Camera Capture Accessory and teleprompter** — `CameraCaptureAccessory` puts secondary UI on the outer display while the main camera UI is on the inner. Uses: preview for the person being filmed, teleprompter, countdown, framing guidance. Available only when the app is full screen on the inner display with an active camera session. Register the accessory on the same view as the camera UI so its lifecycle follows the feature — when the camera view goes, the accessory goes. Teleprompter example: a scene-accessory modifier shows the script on the outer display while the operator controls the camera on the inner; a toolbar button in the main UI toggles the teleprompter model; observe availability (`onAvailabilityChange`, 06:25) to disable that button when the accessory cannot be used, e.g. the device is closed. Never leave a button active that does nothing when tapped — availability is UI state.

```text
05:08 / 05:34 / 05:59 — Camera Capture Accessory
INNER (operator)                                  OUTER (subject)
┌──────────────────────────────────────────┐      ┌──────────────────┐
│ camera preview          [teleprompter ⏻] │      │ script text       │
│                                          │      │ scrolling for the │
│                     (shutter)            │      │ person on camera  │
└──────────────────────────────────────────┘      └──────────────────┘
 main capture UI stays on the inner display; the accessory only adds to it
```

**06:44–07:17 Checklist** — support Split View / resizability first; use the Hinge API for valuable interactions / effects, with fallback and reset; use scene accessories to extend across displays; always handle availability, errors and losing the accessory mid-task.

## 5. 111465 — Build a great camera experience for iPhone Duo (09:27)

Scope: two front cameras, Virtual Front Camera, physical capabilities, direction coordinator, dual display, preview composition, rotation. Full topic detail: `duo-camera-layout-controls.md` §1–§2, §9, `duo-camera-lifecycle-privacy.md`.

**00:31–00:57 Two new front cameras** — Duo is the first iPhone with two front cameras, both square sensors with an ultrawide field of view; the outer ultrawide on the outer display supports high-quality photo / video (00:45); the inner ultrawide is the first under-display camera on iPhone (00:53 — the camera sits inside the content canvas when open). Apps reach the streams through AVFoundation; hardware camera and the display being looked at no longer have a simple front / back relation.

**00:58–01:52 Virtual Front Camera** — a discovery session with position `.front` and wide / ultrawide device type returns the Virtual Front Camera on Duo; it picks the inner physical camera when open and the outer when closed (01:30 → 01:38: after the close animation the system has switched to the outer camera and the camera UI is complete again; the mid-transition frame 01:36 was removed). A good default when the app needs continuity and only shared capabilities. The system handles the hardware switch; the UI still keeps preview, mirroring, selected mode and capture state consistent.

**01:53–02:45 Each camera and its trade-offs** — outer / inner ultrawide have their own device types for full capability (02:05). Inner: video 1080p up to 60 fps · outer: up to 4K, 120 fps · Virtual Front Camera exposes only the intersection: up to 1080p / 60 fps (02:35). Depth only when accessing a physical camera (02:42). With a physical device the app is responsible for switching cameras on open / close. The product spec must decide: automatic continuity, or higher quality / depth — the UI must not offer an option the next camera cannot keep and then silently lower quality.

**02:46–04:02 Direction instead of position** — `position` used to be only front / back and fixed. Both inner and outer front cameras have position front, but their displays may face opposite ways; a front camera may face away from the person looking at the inner display, and when closed the same camera faces the person again; when open and flipped, the rear camera may become the one facing the person (03:25). So "flip camera", mirroring and preview must be based on the camera's **direction relative to the view / display**, not just position.

**04:03–05:37 Direction coordinator and two displays** — create a coordinator from a `UIView`, the device types to track and a change handler. View on the outer display: outer front is forward-facing, rear backward-facing (04:16). Open, view on the inner display: inner front becomes forward-facing; outer front and rear backward-facing (04:30). Camera app moved to the outer display while open / flipped: rear and outer front may both be forward-facing (04:45). A camera app may use both displays at once — each display has a `UIView` and needs its own coordinator because direction is reported relative to that view (05:05, 05:18 — the same rear camera is forward-facing for the outer view, backward-facing for the inner view). Uses: group video calls, fun content for a child while taking the photo, preview for the subject.

**05:38–06:16 Device descriptor and the UI / capture boundary** — the coordinator is tied to a view, so it runs on the main actor; the change handler does not call AVFoundation directly; the coordinator returns an `AVCaptureDeviceDescriptor` — a sendable, main-actor-safe representation with enough information for the camera actor to create the device (05:45). `[C]` The UI receives direction / capability state and the capture layer reconfigures the camera — this separation avoids races, freezes and an out-of-sync preview when folding fast.

**06:17–07:02 Handling a direction change** — the change handler fires on open / close and reports the new forward-facing camera; reconfigure the capture session to keep streaming the right camera (06:25); re-evaluate mirroring after every change — when the rear camera becomes forward-facing for a selfie, mirror the preview for a natural interaction if the product convention wants it (06:40); update the UI in the same transition: active-camera label, icon, preview, capability and selected controls change together.

**07:03–08:02 Preview on the inner display** — a rear camera's full field of view can leave space around the preview on the inner display. Pattern 1: offset the preview and use the remaining area for controls. Pattern 2: fill the display for immersion — accept a deliberate crop (07:27, part of the image falls outside the bounds). `videoGravity` controls the preview inside the layer bounds. The square ultrawide front sensor can use a dynamic aspect ratio to pick a landscape ratio and fill the inner display better (07:50). Fill vs offset is a composition decision: focal content, overlays, controls and output crop must match expectations.

```text
07:20 — preview offset, controls in the freed area (inner display)
┌──────────────────────┬────────────────────────────────────┐
│   (●)      (●)       │                                    │
│                      │        camera preview              │
│   (●)      (●)       │        (offset to the right,       │
│                      │         not stretched)             │
│   (●)      (●)       │                                    │
└──────────────────────┴────────────────────────────────────┘
 left area holds the controls (6 placeholder buttons)
```

**08:03–08:46 Rotation** — the rotation coordinator keeps preview and output upright; on Duo it also updates when the app changes display, not only when the device rotates (08:18). Apply rotation consistently to preview, media output and the overlay coordinate space. After adopting the rotation coordinator, turn off camera-sensor-orientation compensation for performance (08:40) — a slow / janky preview is a UX problem.

**08:47–09:27 Required decisions** — build with the iOS 27.1 SDK; choose the camera-switch strategy on open / close; use the direction coordinator when you need more than the Virtual Front Camera; test the real preview on Duo: orientation, mirroring, crop, camera switch, dual display and capability downgrade.

## 6. 111466 — Design for iPhone Duo (10:44)

Scope: design principles, poses, side controls, resizability, outer / inner layout, sheets, fold avoidance. Topic detail: `duo-device-postures.md`, `duo-components.md`, `duo-layout-transformation.md`.

**00:28–01:50 Silhouette, poses, the edge region** — closed, Duo is compact, familiar and fits the hand; open, it is a large iPhone canvas that is still pocketable (00:45). Poses named: half open like a book, laid like a laptop / tabletop with the inner display facing the person, standing on its edge (01:02 — standing by itself, the UI visible on one half without holding it). The outer display is wider / shorter than a traditional iPhone; top / bottom controls move to the **right** edge to keep height and improve right-thumb reach. The continuous content area on the left is close to a traditional iPhone's. The edge region holds tab bar, app toolbar, navigation, the new status bar and the Dynamic Island; Live Activities expand vertically (01:42). The edge logic continues on the inner display for continuity and reach.

**02:03–03:41 Book, tabletop, Split View, PiP**
- Book pose curves the middle; text / images and interactive elements are pushed off the curve; the fold becomes a natural divider (02:09 — content and presentation on two "pages").
- Tabletop portrait moves interactive controls to the lower half for reach and stability; content is watched on the upper half (02:28).
- Split View is created with the home gesture, 50 / 50 by default, the two halves independent (02:54 — the fold as a natural divider). The app on the left puts its controls on the **left** edge, away from the center fold and near the thumb.
- PiP can pin at the top; the app resizes to the remaining height. Partially folded, the video may grow to fill a half; the app must react continuously to the video size, not just two states PiP on / off (03:50 — outer, inner, split, tabletop and PiP are all geometries of one experience).

```text
03:27 — partial fold: video fills the upper region, the app below shrinks to the rest
┌──────────────────────────────────┐
│ (✕)                     (▯)(⧉)   │
│        video (ISS)               │
│     (⟲)    (⏸)    (⟳)           │
│ ━━─────────────────────────      │
├──────────────── fold ────────────┤
│ (▯) ◯ Christine >          (📹)  │
│ Never do… (sticker)              │
│        (Should I bring both …?)  │
│              (Parking is bad …)  │
│ (No problem. I'll check in)      │
│                (Thanks)(See you) │
│ (＋) [ iMessage            ]     │
└──────────────────────────────────┘
 a continuous resize, not a switch to another screen
```

**03:42–05:06 Two size classes, not a layout per pose** — no custom layout per pose; focus on compact width (outer) and regular width (inner). Avoid fixed widths, breakpoints and metrics tied to a specific screen; use layout margins and horizontal safe-area insets (04:28); design freely resizable. A tabletop enhancement is fine — media on top, tappable controls below — but it keeps the same controls and hierarchy; never lock functionality to a posture.

**05:07–06:32 Mapping controls to the edge** — except inner portrait, most configurations use side controls. The side region is shared with Live Activities and status (05:48); when space runs out, app controls collapse into overflow by themselves. Toolbar items at the top of the app go to the top of the vertical axis; bottom toolbar items to the bottom; the tab bar stays bottom-aligned. Text buttons, segmented controls or items too wide should not be forced vertical — keep them in the horizontal navigation bar. Mapping follows placement and semantics, never a geometric rotation of the whole bar.

**06:33–07:33 Outer display and asymmetry** — most content should center within the remaining safe / content area, i.e. offset from the whole display to avoid the bar; the safe-area inset creates that offset if used properly. A non-scrolling immersive visual may center on the whole display if no interactive element is covered by the bar (07:12). A full-width background / header can combine with an inset scrollable foreground. Every interactive element stays in the safe region — full bleed never means a CTA behind the bar.

```text
06:55 — content centered in the content region, not the whole display (Mail, outer)
┌───────────────────────────┬────┐
│ 1 Message      Summarize  │ ◉  │
│ ◯ Elisha St. Denis 8:32 AM│9:41│
│ Dive Photos               │ ◔  │
│ Hey crew, …               │(‹) │
│ [ photo ]                 │(↑↓)│
│                           │ 🗑 │
│                           │ 📁 │
│                           │ ↩  │
│                           │(✎) │
└───────────────────────────┴────┘

07:25 — full-width header under the edge, foreground inset (App Store story, outer)
┌────────────────────────────────┐
│ (artwork runs to the edge,  ◉  │  background / header full bleed, behind the bar strip
│  behind the bar)          9:41 │
│                            (✕) │  ✕ on the edge
│ GAMES WE LOVE                  │
│ Snow Much Fun                  │
│ [icon] Grand Mountain … (Get)  │
├───────────────────────────┬────┤
│ You're free to ski …      │    │  scrolling text inset from the bar
└───────────────────────────┴────┘
```

**07:34–08:35 Inner display** — never stretch the phone UI over the large canvas. A split view reveals more hierarchy levels but the hierarchy keeps its meaning between inner / outer (07:49). Never limit functionality by pose — people open / close often. A vertical stack may reflow into two columns when width allows (08:18). A tab bar may become a sidebar, best for information-dense apps like Health (08:31), not as a default.

```text
08:18 — vertical stack reflows into two columns (Music album)
OUTER                              INNER
┌ (album art) ──────────┬──┐      ┌ (album art, wide) ─────┬ 1 Cards          ⋯ ┬──┐
│ Vie · Doja Cat        │9:│      │                        │ 2 Jealous Type   ⋯ │9:│
│ (🔀)[▶ Play] (＋)      │‹ │      │ Vie · Doja Cat         │ 3 AAAHH MEN!     ⋯ │‹ │
│ "I believe …" MORE    │⇪⋯│      │ (🔀)[▶ Play] (＋)       │ … 12 Make It Up  ⋯ │⇪⋯│
│ 1 Cards           ⋯   │⌂ │      │ "I believe …" MORE     │                    │⌂ │
│ (▣ So Easy  ▶ ⏭)      │▦ │      │ (🔀 ⏮ ▶ ⏭ 🔁 ▣ So Easy ⋯ 💬 ☰) — mini player spans both │▦ │
│ 3 AAAHH MEN!          │🔍│      └────────────────────────┴────────────────────┴🔍┘
└───────────────────────┴──┘
```

**08:36–09:27 Sheet behaviour** — the outer sheet has vertical controls by default; it may disable them if the content suits better, especially a sheet with a single toolbar button; with the vertical bar disabled, the sheet stops before the front camera and the status bar repositions. Inner landscape / portrait use horizontal bars. Partially folded, the sheet slides off the folding region.

### 6.1 08:44 — presentation across six states (Reminders *List Info* sheet)

Drawn in `duo-adaptive-layout-system.md` §5. The same sheet (colour and icon for the *To-Do* list) is presented differently by display and posture:

| State | Sheet covers | Context behind | × / ✓ |
|---|---|---|---|
| Outer portrait | the whole content pane | not visible | **on the vertical bar**: camera → time → × → ✓ · small sheet title at the top of the pane |
| Outer landscape | the whole frame | not visible | stacked on the right edge: × above, ✓ below |
| Inner landscape | most of the width, against the hardware edge | **the Reminders sidebar still partly visible on the left** (dimmed) · the app's vertical bar and ＋ stay on the edge | **the sheet's own horizontal header**: × left · title · ✓ right |
| Book (half folded) | **one half** (left) — never across the fold | **the other half is the *To-Do* list being edited** | the sheet's horizontal header |
| Inner portrait | nearly the full width, under the app's toolbar | the app's horizontal toolbar on top still visible | the sheet's horizontal header · more of the icon grid visible |
| Tabletop | upper half: title + colours · lower half: icon grid | the app's toolbar on top | horizontal header · view on the upper half, touch on the lower half |

**Rules** (this frame + 08:36–09:27 + video 111462 03:09–04:28, 14:45):
1. **A sheet stays a sheet** — size, position and button placement change; it **never** becomes a full-frame screen, except where the frame is too small (Outer).
2. **Outer:** the sheet fills the pane; its buttons (×, ✓) go onto the vertical bar. A sheet with a single button (×) may disable the vertical bar (111462 14:45).
3. **Inner (landscape and portrait):** the sheet keeps **its own horizontal header** (× · title · ✓); the context behind **stays visible** (sidebar, app toolbar).
4. **The confirm action keeps one representation** in every state (Apple: ✓ in the header / bar). `[T]` If the iPhone version uses a text button at the bottom, choose one form for every frame and record the decision; never ✓ in one frame and a text button in another.
5. **Half folded:** the sheet slides to one half, never on the fold; the other half is the content being edited.
6. **Buttons follow the sheet's container**, not the screen behind; only a sheet against the hardware edge gets the vertical bar (111462 04:00–04:16).

**09:28–10:44 Fold avoidance and conclusion** — a button on the fold is hard to tap; the system nudges interactive elements aside — built into sheets, alerts, menus, toolbar buttons and many system components; prefer standard components for consistent fold avoidance. Interactive elements avoid the curve as much as possible; scrolling content need not, because reading-flow continuity matters more. The goal is one app experience adapting across displays / poses, not different apps per posture.

```text
09:38 — fold avoidance (book: Weather sheet · tabletop: Photos menu)
BOOK                                           TABLETOP
┌ (✕) Air Quality ──────╲╱ (weather behind) 9:41┐  ┌ ‹ Thailand  (▤ ☰ ⋯)  Select 9:41 ┐
│ [ AQI map ]           │  ~ 70°                │  │ ┌ Copy Duplicate Hide┐ [photo]  │
│ Good — Scale: US (AQI)│  Conditions           │  │ │ Share · Favorite · │          │ menu sits wholly
│ Air quality index 34… │  1PM 2PM 3PM …        │  │ │ Add To · Ask Siri  │ [photo]  │ in the upper
│ News                  │                       │  │ └────────────────────┘          │ region
└───────────────────────╱╲──────────────────────┘  ├──────────── fold ────────────────┤
 sheet slides to the left page, off the curve      │ [photo][photo][photo] (scrolls)  │
                                                   └──────────────────────────────────┘
```

## 7. WWDC26/260 — Get the most out of Device Hub (17:09)

Everything that matters for UX / UI testing is already in `duo-handoff-testing.md` §1 (overview, compact / full modes, controls, 1:1 size, resize mode, Capture Keyboard, organise / compare, inspector's five panels, `devicectl` with JSON output) and §4 (the Workout truncation case study: report on a real device, then reproduce on the simulator by matching **device + data + configuration**). Timestamp index for verification:

| Time | What it shows |
|---|---|
| 01:04–02:59 (frame 01:48) | Device Hub ships with Xcode 27 but runs on its own, for developers, QA, designers and inventory managers; compact mode = live screen + context controls (Home, screenshot, rotation…; Apple TV playback / navigation, Vision Pro environment / camera, Watch side button / Digital Crown); expanding gives Control, Organize, Configure |
| 03:00–04:38 (03:48) | canvas: click, drag, scroll, trackpad; zoom and **1:1 physical size** to judge touch targets, type and density; **resize mode** to find intermediate failures; Capture Keyboard; back to compact to place devices side by side |
| 04:39–06:03 (04:47) | sidebar inventory, filter / sort / group, quick actions (restart, pair iPhone–Watch simulator), tabs or compact windows; compare phone sizes side by side for clipping, density and hierarchy regressions — same for Duo outer / inner / poses |
| 06:04–08:07 (06:12) | inspector: Settings (Dark Mode, text size, location, audio — instant), Diagnostics (crashes, spins, hangs, logs), Info, Apps (data container), Profiles. `[T]` UX QA saves the configuration with the screenshot — "right device" is not enough if text size, locale, location, appearance and app data differ |
| 08:08–12:23 (08:32, 10:15, 10:55, 11:20, 12:05) | real-device bug: recovery advice truncated in landscape; pair wirelessly, install the Core Location logging profile (reboot if required), reproduce, screenshot, sysdiagnose, copy the truncated string to a file, inspect / snapshot the data container. A good report = visual evidence + content + data + system diagnostics |
| 12:24–15:51 (13:00, 13:35, 14:40, 14:45) | reproduce on the simulator: device (model in Info) · data (replace container) · configuration (orientation, location, text size, appearance). The bug needed landscape + Johannesburg / high altitude (long string) + maximum text size together; portrait made it disappear — adaptive bugs live at the intersection of variables |
| 15:52–17:09 (15:58) | `devicectl`: list devices, install apps, switch Light / Dark, read info, capture diagnostics, `json-output`; `[T]` combine exploratory Device Hub with a repeatable automated matrix — neither replaces usability / physical-device tests |

## 8. WWDC25/356 — Get to know the new design system (18:14)

Scope: Liquid Glass foundations, colour, typography, component geometry, navigation structure, focus / depth, bars and tab bar, scroll-edge / sidebar, continuity across devices — the base layer that keeps iOS 27 and iPhone Duo styling systematic, not a set of decorative effects. Summary also in `duo-ios27-visual.md` §6.

**00:07–02:06 A design system, not a visual refresh**
- Three related layers change together: **visual design**, **information architecture**, **core system components** — you cannot copy the glass material and keep the old hierarchy.
- Liquid Glass changes the relation between interface and content: UI becomes an adaptive functional layer; content stays central.
- One shared language, not mechanical sameness: cohesive across platforms, while each experience still fits its device, screen size and input mode.
- SwiftUI, Mac Catalyst and window resizing are the foundation that lets one anatomy / component scale across environments.
- Three axes through the video: **design language** (cohesion at system scale) · **structure** (guides navigation and how people interact with content) · **continuity** (keeps task, meaning and familiar feedback when device or size changes).

**02:07–03:02 Colour and typography**
- System colours are tuned together for Light, Dark and Increased Contrast, to separate hues better on Liquid Glass while staying vivid (02:40).
- Never test a palette on solid backgrounds only — test colours where the material samples content behind, in Dark Mode and in Increased Contrast.
- Typography gets clearer hierarchy through heavier weights and **left alignment** where quick reading matters, especially alerts and onboarding (02:58 old centered alert → 03:00 new: title / body left-aligned, actions with large touch areas, clear hierarchy).
- For alerts / onboarding, centering is no longer the default just because the component is small; multi-line content favours reading flow, scannability and a clear title–body–action relation.

**03:03–04:48 Geometry, concentricity, control size**
- Curvature, size and proportion of UI are tied to hardware geometry for one rhythm between screen and device.
- **Concentricity**: radii and margins of nested layers share a common center — not simply one corner radius everywhere.
- The system may use mathematical centering, but optically offsets where the eye needs a different balance.
- Three shape types (03:45): **Fixed** — constant corner radius · **Capsule** — radius = half the container height · **Concentric** — radius = parent radius − padding.
- Capsules support concentricity naturally — sliders, switches, bars, buttons, grouped table corners. On touch-first layouts capsules aid focus and touch clarity; in dense desktop environments reserve them for prominent actions.
- On macOS, Mini / Small / Medium controls keep rounded rectangles for inspectors and dense layouts; Large and the new X-Large use capsule / Liquid Glass for emphasis in wider areas (04:30).
- `[T]` A shape token holds **shape behaviour** and **context**, not just a radius number.

**04:49–06:15 Harmonising a custom design system with Liquid Glass**
- Custom components keep their identity but must move "in step" with the system in geometry, hierarchy and material behaviour; using the three shape types keeps them in tune with Apple APIs when the system adapts.
- Two geometry faults to review (05:20): **pinched corner** — gap / radius between two layers squeezed, the corner looks tense · **flared corner** — the gap widens abnormally, the curves no longer run parallel. Typical when artwork sits in a card or components nest several levels; fix by making the inner shape concentric with the outer container, never assigning an independent radius.
- Near a phone's screen edge: capsules and larger margins so nothing hits the screen curvature. In iPad / Mac windows: concentric shapes following the window edge for optical balance.
- A component that can stand alone or be nested uses a **concentric shape with a fallback radius**: nested, the radius follows the parent; standalone, the fallback keeps a valid shape.

**06:16–07:24 Liquid Glass as a functional layer; source–presentation**
- UI appears when interaction is needed and recedes otherwise; Liquid Glass is a functional layer floating over content that organises without taking the lead.
- A new surface must show **where it came from** and **how it relates to its source** — spatial semantics, not just a pretty transition.
- The old action sheet always appeared at the bottom, detached from the action that called it (06:58); now presentations grow from the action source (07:10). Correct roles / semantics let the system treat source and presentation as one interaction.
- On a custom control, apply the material directly to the control container, never separately to inner views — otherwise geometry, hit target and transition fragment.

**07:25–08:32 Focus, modality, depth**
- Liquid Glass changes subtly with navigation focus, showing whether the flow goes deeper, changes direction or moves to another task.
- **A task that interrupts the main flow:** Liquid Glass + a dimming layer to focus attention (07:46) — the presentation becomes a purposeful space.
- **A parallel task:** the natural layer separation of Liquid Glass keeps both contexts alive without breaking flow with heavy dimming.
- **As focus increases**, e.g. pulling a sheet up: the glass recedes, becomes more opaque and grows slightly to signal deeper engagement (08:08).
- `[T]` Material state belongs in the interaction spec — rest, parallel, modal, focused / deep — never a single static picture.
- Navigation controls are lifted off content by material for separation and affordance; at rest they must not blend into the background.

**08:33–10:09 Cleaning up old customisation; organising bar items**
- Bars with custom backgrounds, borders or decoration "for weight" need re-auditing: the new system creates emphasis through material and structure, so old decoration becomes redundant or conflicting.
- Show hierarchy through **layout and grouping**, not borders / backgrounds on each button. Bar items declared with the right API / semantics share a background and keep their spatial relation.
- A crowded bar: drop unnecessary actions; put secondary actions in a More menu; never shrink everything to fit.
- Group by **function** and **frequency**; related actions in one group (09:58 — Undo, Redo and Done grouped by function).
- Never group a text action with a symbol action if together they may read as one combined button — a text button gets its own container (09:50).
- The primary action such as Done stands alone and is tinted: usually a blue checkmark on iOS / iPadOS, a prominent text button on macOS.
- `[T]` A bar component spec describes item ownership, grouping, priority, overflow, representation and primary state — "icon coordinates" are not enough.

**10:10–10:55 Tab bar, Search, accessory view**
- The tab bar is a durable navigation structure that gives a stable mental map between sections.
- When content is not visible up front and search is an essential way in, iOS has a dedicated **Search tab** at the bottom for quick, easy reach (10:25).
- A persistent feature such as media playback can use an **accessory view** that lives across the app (10:35 — Now Playing above the tab bar, distinct from navigation but moving with the app-wide chrome).
- Screen-specific actions such as Checkout do not belong in the tab accessory; an action sits next to the content / task it serves. Mixing persistent navigation and contextual actions blurs the hierarchy.

```text
10:45 — "Add to cart" stays in the content, not in the tab accessory slot
│ (🗑)  1  (＋)                          │
│ [ 🛒  Add to cart ───────────────── ] │  contextual action → content area
│ Ratings and reviews                   │
│ ┌ ⌂Home · 🛒Cart · 👛Wallet · 🧾Orders ┐ (🔍) │  tab bar + separate Search
```

**10:56–12:33 Scroll-edge effects: a functional boundary, not decoration**
- Liquid Glass controls need separation from content for legibility; directly on complex content contrast can fail.
- The scroll-edge effect replaces hard dividers with a transitional blur showing where content runs under floating UI (11:25); it is not an overlay to block or darken content; do not use it where no floating UI needs separating. Scroll views get the effect automatically where pinned controls overlap.
- Two styles: **Soft** — default, mostly iOS / iPadOS, for Liquid Glass buttons / inputs · **Hard** — mostly macOS, a more opaque boundary for interactive text, backgroundless controls or pinned table headers. Never mix / stack Soft and Hard on one boundary.
- One scroll-edge effect per view; in Split View each pane may have its own, but heights stay consistent for alignment.

**12:34–13:33 Sidebar inset, background extension, content under navigation**
- The new sidebar is inset with Liquid Glass, letting content continue behind it for a wider, more immersive canvas.
- The background extension effect extends visuals behind the sidebar / full width while keeping the image's subject centered in the layout (12:46) — for hero images, tinted backgrounds or deliberately expansive surfaces; text and controls stay on the right layer, never distorted or less legible.
- Scroll views may run under the sidebar so a carousel continues naturally instead of being cut by a "navigation wall" (13:16).
- The effect applies per view: extend the background for top / bottom views while the middle scroll view stays independent — no need for one treatment across the whole screen.

**13:34–14:53 Continuity: same task across devices / resize**
- Changing device or resizing a window never starts a new task — the app keeps the moment, context and progress.
- A layout, hierarchy or interaction decision must have logic across every device where the app appears; design one shared anatomy and let representation / layout adapt — no new anatomy per platform.
- Device context: **iPhone** — narrow vertical canvas, high focus on the current task · **Mac** — wide canvas, more depth and density · **iPad** — the middle layer where design learns to scale between focused utility and expansive canvas.
- `[C]` On iPhone Duo the inner display / poses are an extra context of the same anatomy — opening the device never turns the task into another product.

**14:54–16:16 Shared content, symbols and labels**
- Deliberately grouped content stays together when the layout adapts — responsive rearrangement never breaks a semantic group.
- Use the same symbols across devices for meaning and familiarity through repetition.
- Not every action has clear shorthand: a pencil may read as annotate, a checkmark as confirm — for Edit or Select a text label is better when the symbol is ambiguous (15:20, 15:36).
- Bars and menus use more symbols than before, but the goal is recognition, not removing text at all costs.
- For closely related actions (several ways to copy) do not repeat or vary the icon per row — use a symbol once to introduce the group, then text to tell actions apart.
- The HIG Icons page lists preferred glyphs for common actions — the starting point for SF Symbols or mapping into your own icon system.

**16:17–17:38 Shared anatomy and shared behaviour**
- Component continuity rests on two questions: **how it is built** and **how it behaves**.
- Shared anatomy: durable parts stay and sit in familiar places when representation changes. A macOS popup menu and an iOS context menu differ visually but share anatomy: selection indicator, icon / accessory, label / title, accessory / disclosure item (16:58).
- When structure must change, behaviour carries continuity: the component keeps supporting the same core interactions. Tab bar, segmented control and sidebar differ in shape but signal selection, navigation and state with consistent feedback (17:16).
- `[T]` A design-system spec therefore separates: required anatomy · representation by platform / size · invariant core behaviour · feedback / state mapping · parts that may reorder or collapse.
- Continuity links platforms, and also makes related components on one platform feel like one system.

**17:39–18:14 Conclusion for the toolkit** — visual design, information architecture and component behaviour are updated together; changing only the material does not reach the cohesion Apple describes. HIG and Apple Design Resources / UI kits are the reference for anatomy, symbols and component states; this atlas keeps the rationale and relations between decisions. `[T]` Every pattern turned into a rule needs at least: **intent → anatomy → adaptive rules → interaction states → accessibility / contrast → platform representation → test matrix**.

## 9. Coverage and deliberate limits

| Source | Length | Covered | Frames in the source atlas |
|---|---:|---|---|
| 111461 Prepare your app | 10:09 | full transcript: SDK, Device Hub, layout, size class, screen assumptions, navigation, safe / reserved regions | 17 |
| 111462 Raise the bar | 15:42 | full transcript: ownership, ordering, representation, grouping, compression, overflow, visibility | 31, incl. the before–during–after toolbar sequence |
| 111463 Strike a pose | 18:00 | full transcript: poses, reserved regions, displacement, containers, arrangements, split / overlay choice | 17 |
| 111464 Multiple displays / scenes | 07:17 | full transcript: effects, scenes, accessories, camera / teleprompter | 9 |
| 111465 Camera experience | 09:27 | full transcript: capabilities, direction, dual view, preview, rotation | 21 |
| 111466 Design for Duo | 10:44 | full transcript: silhouette, poses, outer / inner, sheets, fold avoidance | 18 |
| WWDC26/260 Device Hub | 17:09 | full transcript: control, organisation, configuration, diagnostics, reproduction, automation | 14 |
| WWDC25/356 New design system | 18:14 | full transcript: design language, structure, continuity | 22 |

Limits: no verbatim English transcript — every point is restated, greetings / jokes / repetition removed; no presenter-only frames; code kept only where the API / structure decides ownership, layout, state, scene or adaptive behaviour; each frame is timestamped evidence and never replaces HIG / API documentation as the final reference for values that may change.
