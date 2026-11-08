# Adaptive layout system for iPhone Duo: inputs, geometry layers, transformations, reserved regions, containers, bars, content patterns, contracts

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/iphone-duo-adaptive-layout-deep-dive.md §header, §1–12 (images `apple-videos/111461/05, 08a, 10, 12`, `111462/06a, 06ab, 06b`, `111463/03a, 05, 06, 08, 14, 16`, `111466/12`) @ 3c0e291 — translated, complete

Labels: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal / contract (see `duo-foundations.md`). This file turns Apple's Duo guidance into a **decision system** for flow, wireframe, UI, component spec, prototype, handoff and QA. Scope is adaptive layout only — camera, multiple scenes, Liquid Glass and accessibility appear only where they change geometry, hierarchy, state or transitions.
**Status:** checked 13 Oct 2026. The iOS 27.1 APIs for `ReservedRegion`, `ArrangementView` and vertical bars were still marked **beta** — confirm against the final SDK before closing an implementation rule.
Frame set, annotations, handoff, test matrix, anti-patterns, review gate: `duo-rule-map.md`. Step-by-step job: `duo-adapt-workflow.md`. Shorter Apple-only versions of some topics: `duo-layout-transformation.md`, `duo-components.md`, `duo-device-postures.md`.

## Contents
1. Sources and boundary
2. Mental model: one task, many geometries
3. The state vector a layout reads
4. Four geometry layers that must not be mixed
5. Posture matrix and layout goals
6. Six layout transformations
7. Reserved-region algorithm
8. Choosing the right container
9. Adaptive bars are part of the layout
10. Patterns per content type
11. Component adaptive contract
12. Motion and continuity

---

## 1. Sources and boundary

Apple sources: HIG *Designing for iPhone Duo*, *Layout*, *Split views*, *Toolbars* (verbatim: `../apple-hig/references/designing-for-iphone-duo.md`, `layout.md`, `split-views.md`, `toolbars.md`) · tech talks 111461 *Prepare your app for iPhone Duo*, 111463 *Strike a pose with adaptive layouts on iPhone Duo*, 111462 *Raise the bar with iPhone Duo*, 111466 *Design for iPhone Duo* · docs `GeometryProxy` (SwiftUI), `UIView.ReservedRegion`, `UIArrangementViewController` (UIKit), SwiftUI updates — Arrangement views and Reserved regions. Links: `duo-apple-sources.md`.

Three statement levels are kept apart: **Apple rule** (published directly) · **design consequence** (what the designer must do to meet it) · **proposed contract** (structure for the toolkit or handoff — derived, not Apple's official naming).

Community supplement: *iPhone Duo Adaptive Design Starter Kit* (Noah Elhadedy, v1.0, 9/2026) — fully extracted in `duo-community-kit.md` / `duo-community-patterns.md`. Never promote the kit's self-assigned *Official* badge to independent Apple confirmation; *Derived / Recommended / Illustrative / Assumption* values are for mockups or hypotheses to verify.

**No hard-coded screen sizes here.** Apple requires layout from the real container, size class, safe area, margins and reserved regions. A Figma file with Duo frames is only a test example, never the source of truth for runtime.

## 2. Mental model: one task, many geometries `[A]` / `[C]`

iPhone Duo is still an iPhone. The novelty is not "design an app for a folding screen" but that one scene can pass through a **continuous chain of geometries**:

```text
outer display
  ↕ open / close
inner display flat
  ↕ partially fold
book / tabletop / tent
  ↕ change of available space
Split View / keyboard / PiP / Dynamic Type / system surfaces
```

Never treat each node as an independent screen. When geometry changes, task and state stay continuous.

### 2.1 Allowed to change
- how many panes are visible at once;
- layout axis;
- pane size and ratio;
- spacing between items;
- control position, to avoid reserved regions;
- representation of the same control: full label, symbol, menu or overflow;
- how a presentation anchors to its source;
- how much hierarchy is revealed when there is more space.

### 2.2 Never changed silently
- the current task;
- the selected item;
- draft content and cursor;
- meaningful scroll / focus;
- play, capture, edit or upload state;
- the meaning of an action;
- access to a function;
- the core information hierarchy.

### 2.3 Adaptive vs responsive
- **Responsive:** the same structure stretches, wraps, changes spacing or column count.
- **Adaptive:** the system may change representation or displayed structure — one pane becomes two, overlay becomes split, a horizontal toolbar becomes vertical.

A good Duo layout usually uses both: stretching solves the small continuum; changing representation solves big hierarchy changes.

## 3. The state vector a layout reads `[C]` / `[T]`

Never use only `device == Duo`, `orientation == landscape` or a fixed hinge angle. The right layout is derived from a set of signals.

### 3.1 Base inputs

| Input | Design question | Never infer |
|---|---|---|
| Container width / height | how much real space does this view have? | physical screen size in place of the container's bounds |
| Horizontal / vertical size class | compact or expanded representation? | regular width ≠ iPad |
| Safe-area insets | where may foreground and interactive content go? | symmetric insets on both edges |
| Layout margins | alignment rhythm and breathing room of content | margins are not safe-area insets |
| Reserved regions | which areas are covered or divided? | hard-coded hinge width or camera frame |
| Vertical bar edge | which edge does the system give to vertical controls? | mirroring the hardware edge just because of RTL |
| Dynamic Type and content size | do text / controls still fit and read? | just scaling the font inside a fixed frame |
| Locale and layout direction | how do reading order, alignment and text expansion change? | mechanically mirroring media, maps or the hardware edge |
| Keyboard, PiP, Live Activity, sheet | is a system layer reducing usable space? | posture as the only variable deciding layout |
| Selection, focus, task state | what must survive the recompose? | rebuilding the scene from scratch on resize |

### 3.2 Secondary inputs — never the main breakpoint
- hinge state and hinge angle may drive physical effects or interactions;
- camera active / inactive can make the inner-camera reserved region appear or disappear;
- scene / display-accessory availability can change a secondary display area;
- input mode can change hit targets, hover / focus or shortcuts.

Never use 90°, 120° or a posture name as the only layout breakpoint — two states with the same angle can still have different containers, multitasking or system overlays.

### 3.3 Size classes on Duo `[A]`
- outer portrait: compact width, regular height;
- outer landscape: compact width, compact height;
- inner display: regular in both dimensions in the illustrated state;
- Split View or system surfaces can give a child view different geometry from the whole display.

```text
Size Class (video 111461, 03:18)
        compact                       compact
     ◄──────────►               ◄──────────────────►
   ▲ ┌──────────╮               ╭──────────────────╮ ▲
   │ │          │               │                  │ │
 reg │          │               │                  │ │ compact
 ular│          │               │                  │ │
   │ │          │               ╰──────────────────╯ ▼
   ▼ └──────────╯
  outer portrait                  outer landscape
```
Size class is an input from the current environment, not a device label.

Practice rule:
1. Use size class to choose the **representation family**.
2. Use container size to resolve the continuum **inside** that family.
3. Use safe area and reserved regions to correct the **final geometry**.
4. Use task state to decide **what collapses** — not area alone.

## 4. Four geometry layers that must not be mixed `[A]` / `[C]`

### 4.1 Container bounds
The view's local canvas. A pane in a split view never lays out against the full screen size. Reusable components react to the bounds of the container they actually sit in.

### 4.2 Safe area
Protects foreground / interactive content from system UI and hard-to-reach zones. On Duo vertical controls create an edge inset, so the safe area is usually **asymmetric**.

```text
Safe Areas (video 111461, 06:15)
iPhone                               iPhone Duo outer
┌──────────────────────────┐         ┌──────────────────────┬────┐
│ 9:41    (island)    ▮▮ ◔ │         │ ┌ Springtime flowers ┐│ ◉  │
│              [⚙ ▦ ＋] ◄──┼ toolbar │ │ In progress  photos ││9:41│
│ ┌ Springtime flowers ──┐ │ top-    │ └────────────────────┘│ ◔  │
│ │ In progress  photos  │ │ right   │ ┌ Cute jumping frog ─┐│┌──┐│ same toolbar
│ └──────────────────────┘ │ (hor.   │ │ Completed   photo  │││⚙ ││ as a vertical
│ ┌ Granny Square Quilt ─┐ │  inset  │ └────────────────────┘││▦ ││ strip on the
│ │ In progress  photo   │ │  top)   │ ┌ Pink crane ────────┐│││＋││ trailing edge
│ └──────────────────────┘ │         │ └────────────────────┘│└──┘│ (inset trailing)
└──────────────────────────┘         └──────────────────────┴────┘
```
Horizontal and vertical bars create insets along different axes.

Background, artwork or media may run full bleed if legibility does not suffer. Important text, icons and hit targets still respect the safe area or the right reserved region.

### 4.3 Layout margins
Margins set the alignment rhythm of content. They may differ from the safe area and need not be symmetric.

```text
Layout Margins (video 111461, 07:35) — outer display
┌▒┬──────────────────────────┬█████┐
│▒│ Cancel              Next │█ ◉ █│
│▒│                          │█9:41│
│▒│          [🖼＋]           │█ ◔ █│
│▒│ Select up to three photos│█████│
│▒│ to start your project    │█████│
└▒┴──────────────────────────┴█████┘
 ▒ = layout margin (leading)  █ = safe-area inset (trailing, wide)
```
Never take the inset of one edge and copy it to the opposite edge.

### 4.4 Reserved regions
An area in the view's coordinate space that another entity occupies or interrupts. Each region has a frame, margin, kind, active state and identifier.
- **Occlusion** — an area covered, such as a camera, Dynamic Island or window controls. Content may continue around it if still readable and operable.
- **Division** — an area that splits the canvas into separate usable areas, such as the fold. Continuous content passing through may be distorted or unreadable.

On Duo consider at least: the **outer front camera** (always present; may expand into the Dynamic Island) · the **inner front camera** (a meaningful reserved region only while the camera is active) · the **folding region** (conditional; when active it splits the inner display into several usable regions). Apple detail: `duo-device-postures.md` §4.

### 4.5 Processing order

```text
container bounds
    ↓
size class / representation family
    ↓
system container layout
    ↓
safe area + layout margins
    ↓
reserved regions
    ↓
content-specific displacement
```
Never jump straight from "this is a Duo" to coordinates. Never use reserved regions to replace the safe area for the whole UI.

## 5. Posture matrix and layout goals `[A]` / `[C]`

Apple stresses you do not need a separate layout per pose. Use the posture as a **test context**, not a breakpoint set.

| Context | Usable space | Layout goal | Main risk |
|---|---|---|---|
| Outer portrait | compact width, more familiar height | focused hierarchy, one pane, core actions | mechanical scale up / down, actions lost in overflow |
| Outer landscape | wider but short; controls usually on an edge | protect content height, check overflow on the vertical axis | custom bottom bar eats the height, keyboard covers content |
| Inner landscape, flat | wide canvas; vertical controls may stay on the edge | reveal more hierarchy, split / arrangement if valuable | stretching the phone UI, over-long text lines |
| Inner portrait, flat | enough height for familiar horizontal bars | expanded iPhone layout, keep relative placement | actions jump to unrecognisable places |
| Book | fold splits two regions vertically | panes / items sit wholly in one region; keep reading / task relation | text, image, hit target or dialog across the spine |
| Tabletop / laptop | one region to view, one to touch | media / preview on the upright part; controls / keyboard on the flat part | hard-to-reach controls on the upright part, hands covering content |
| Tent / stand | device stands by itself, one face to the viewer | content read at a distance, controls on the reachable face | assuming traditional portrait / landscape |
| Split View | app owns only part of the inner display | layout by the app's bounds; bar on each app's outer edge | using the whole display's safe area, assuming the bar is always on the right |
| Keyboard / PiP / system overlay | usable space shrinks independent of pose | keep task, field, focus and key actions | switching family too early, focus lost, pane disappears |

```text
Same content across postures (video 111466, 08:44 — "List Info" sheet of a To-Do app)
OUTER P                     INNER L (flat)                      INNER P (flat)
┌──────────────┬──┐         ┌sidebar┬ sheet card ───────┬──┐    ┌ app bar (←  To-Do  ⇪ 🔍 ⋯) ──┐
│ List Info    │◉ │         │ Today │(✕) List Info  (✓) │9:│    │ (✕)    List Info        (✓)  │
│ (● icon)     │✕ │ ✕ ✓ on  │ All   │ (● icon) To-Do     │↶ │    │ (● icon) To-Do               │
│ To-Do        │✓ │ the     │ To-Do │ List Type          │🔍│    │ List Type   Standard         │
│ colours ●●●● │  │ vertical│ Work  │ colours ●●●●●●●    │⇪ │    │ colours ●●●●●●●●●●            │
│ icons ▢▢▢▢   │  │ strip   │ Shop  │ icons ▢▢▢▢▢▢       │⋯ │    │ icons grid                    │
└──────────────┴──┘         └───────┴────────────────────┴──┘    └──────────────────────────────┘
OUTER L                     BOOK (half open)                    TABLETOP
┌──────────────────┬──┐     ┌ sheet ────────┐╲╱┌ To-Do list ─┬─┐ ┌ (✕) List Info (✓) ─────────┐ upright:
│ List Info        │✕ │     │(✕) List Info  │  │ ○ groceries │🔍│ │ (● icon) To-Do  List Type  │ header +
│ (● icon) To-Do   │✓ │     │ To-Do  colours│  │ ○ plants    │⇪ │ │ colours ●●●●●●●●●●          │ colours
│ List Type        │  │     │ icons         │  │ ○ haircut   │⋯ │ ├────────── fold ────────────┤
│ colours ●●●●●●   │  │     └───────────────┘  └─────────────┴─┘ │ icons grid (flat part)      │
└──────────────────┴──┘      sheet slides to one side of the fold └────────────────────────────┘
```
The same content adapts across postures — not six separate apps. On outer the sheet fills the pane with ✕ / ✓ on the vertical strip; on inner it keeps its own horizontal header with the context visible behind; in book it slides to one half.

## 6. Six layout transformations `[C]`

Describe every change as one or more of these.

### 6.1 Resize
The component keeps its anatomy but changes size — for cards, media, columns or controls with sensible min / ideal / max. Never resize until:
- text truncates with no way to see the rest;
- touch targets shrink;
- an important image crops the wrong subject;
- a control loses a needed label;
- a pane still exists but is no longer usable.

### 6.2 Reflow
Items keep semantic order but wrap, change rows / columns or change axis — for grids, forms, metadata and control groups. On Duo grids should **prefer an even column count** if content must split cleanly around the fold — a structural preference, not a law forcing every grid even at every size.

```text
Grid absorbs the fold in the gutter (video 111463, 05:52 — Fitness "Summary")
┌ Summary ──────────────────────────────────────────────┬──┐
│ ┌ Activity Rings ──────────┐ ┊ ┌ Step Count ┐┌ Step Dist ┐│9:│
│ │ ◎  Move 0/120 CAL …      │ ┊ │ 823  ▁▃▇   ││ 0.39MI ▁▇ ││◔ │
│ └──────────────────────────┘ ┊ └────────────┘└───────────┘│  │
│ ┌ Sessions ──┐┌ Awards ────┐ ┊ ┌ Fitness+ ────────────────┐│  │
│ │ 5.21MI     ││ July Chall.│ ┊ │ Strength with Kim        ││◉ │
│ └────────────┘└────────────┘ ┊ │ [View Workout]           ││⟳ │
│ ┌ Trends ────────────────────┐┊ └──────────────────────────┘│⚡ │
└────────────────────────────────────────────────────────────┴──┘
                               ┊ = fold, falls in the wider gutter between columns
```
Tiles stay whole; the spacing between columns absorbs the folding region.

### 6.3 Reveal or collapse hierarchy
Compact may show only the primary or the detail. Expanded may show list and detail together. **Selection links the two representations.**

```text
NavigationSplitView (video 111461, 05:20 — Mail)
OUTER: detail only                 INNER: list + detail
┌─────────────────────┬────┐       ┌ ▯        (☰ ⋯) ┬ 1 Message   Summarize ┬────┐
│ ◯ Elisha St. Denis  │ ◉  │       │ All Inboxes     │ ◯ Elisha St. Denis    │9:41│
│ Dive Photos         │(←) │       │ [Primary] 🛒 💬  │ Dive Photos           │(✎) │
│ Hey crew, …         │(↑↓)│       │[◯ Elisha  8:32 ]│ Hey crew, …           │ ↩  │
│ [photo]             │ 🗑 │       │ ◯ Anthony Wu    │ [photo]               │ ↩↩ │
│                     │ 📁 │       │ ◯ Chris & Raul  │                       │ ↪  │
│                     │ ↩  │       │ (🔍 Search)     │                       │ 🗑📁│
│                     │(✎) │       └─────────────────┴───────────────────────┴────┘
└─────────────────────┴────┘
```
More space reveals another hierarchy level instead of enlarging the pane that was already there.

### 6.4 Displacement
Move an element or a group off the fold / camera while keeping its role and relation to its source.

```text
Displacement (video 111463, 02:55)
┌────────────────────────────────────────┐
│                                   9:41 │   one small element (rounded square) moved
│                                     ◔  │   into a usable region; the rest of the
│             ┌────────┐                 │   screen is not rearranged
│             │  item  │                 │
│             └────────┘                 │
└────────────────────────────────────────┘
```
Only the element that needs protecting moves into a usable region; the whole screen is not rearranged.

Displacement can apply to: one floating control · a dialog or menu · an image + context menu as a group · a container of tightly related content · most of the layout if the whole structure is truly cut by the fold.
Do **not** displace a feed, article or long document just because one passage crosses the fold — for continuous content, scrolling and the system container keep continuity better than making content jump regions.

### 6.5 Recompose
The same primary / secondary content switches from overlay to side by side, or from horizontal split to vertical split. This is the arrangement container's job while the relation between the two views stays the same.

### 6.6 Overflow or representation change
The action still exists but may change from text to symbol, go into a menu or overflow. Keep discoverability and priority — never keep every item visible by shrinking it.

## 7. Reserved-region algorithm `[C]` / `[T]`

### 7.1 Step 1 — classify content

| Content | How strictly it avoids reserved regions |
|---|---|
| Background / texture with no information | may run full bleed |
| Photo / video with unimportant areas | may pass under an occlusion if the crop is safe |
| Text, status icons, hit targets | must avoid occlusions and distorted areas |
| Independent item with a clear focal point | displace into a usable region |
| Continuous scroll content | keep the flow; avoid putting key reading / touch points exactly on the division |
| Dialog / menu / sheet | use system presentation, which repositions itself |
| Grid / tiles | adjust column count / gutter so no item is cut |
| Two peer views | split / arrangement around the division region |

### 7.2 Step 2 — read the region in the right coordinate space
A region's frame is returned in the coordinate space of the view queried. A child component never takes the whole-window frame and subtracts an offset with a constant. Handoff records: which view / container owns the avoidance decision · which region kind to read · behaviour when the region is active · whether the inactive division capability matters · scope of the move (item, group or container) · fallback when the API returns no region.

### 7.3 Step 3 — active vs inactive
- An active occlusion / division affects the current layout.
- An inactive division may be used to **prepare** the structure, e.g. choose an even column count for a grid on a device that can be divided.
- Never turn an inactive region into permanent empty space.
- Never make the UI jump just because a region appears in a capability query without being active.

### 7.4 Step 4 — choose the usable region by task
Not always the biggest region — the one that keeps the best relation:
- in book pose an alert may prefer the trailing region, near where the person continues after closing the device;
- tabletop puts media on the upright part and controls on the flat part;
- a search field stays attached to its results and keyboard;
- a context menu moves with its source image;
- capture controls sit in a stable touch region, not merely the largest one.

```text
Alert region chosen by continuity (video 111463, 04:18 — Music "New Folder")
BOOK (inner)                                        OUTER (after closing)
┌ Playlists ───────────╲╱────────────────────┬──┐   ┌ Playlists ─────────┬──┐
│ (🔍 Search)            ┌ New Folder ──────┐ │9:│   │ (🔍 Search)        │◉ │
│ [All Day][Good Times]  │ Workout          │ │← │   │ ┌ New Folder ─────┐│← │
│                        │ (Cancel)(Create) │ │＋│   │ │ Workout         ││＋│
│ [Study ][Viral    ]    └──────────────────┘ │⋯ │   │ │(Cancel)(Create) ││⋯ │
│ (▶ ⏭ Because I'm Me)                        │⌂ │   │ └─────────────────┘│⌂ │
└──────────────────────╱╲─────────────────────┴──┘   └────────────────────┴──┘
 alert sits wholly in the trailing region — the part that becomes the outer display
```

```text
Tabletop splits viewing and touching (video 111463, 04:48 — TV player)
┌────────────────────────────────┐
│        video (upright part)    │  view
├─ (✕)(⧉)(▭) ────── ━━━━━━ 🔊 ───┤  fold
│      (⟲10)   (⏸)   (⟳10)       │  touch: transport on the flat part
│ Remarkable 1 >      (⏱)(〰)(💬) │
│ 0:21 ━━━━━━━━━━──────── −0:24  │
└────────────────────────────────┘
```

### 7.5 Step 5 — minimise the change
Apple advises avoiding extreme layout changes when the person folds the device. Order of preference:
1. let the system container adapt;
2. change spacing / margins;
3. light resize;
4. minimal displacement;
5. reflow / recompose if the content relation requires it;
6. collapse content only when there is truly no room **and** there is still a way back to it.

## 8. Choosing the right container `[A]` / `[C]`

### 8.1 NavigationSplitView / UISplitViewController
Use when two or three panes are **levels of a navigation hierarchy**: sidebar → collection → detail · mailbox → message list → message · project list → document.
Expected behaviour:
- compact: collapses to one pane with a clear back path;
- regular: reveals several panes;
- selection in the earlier pane always explains the current detail;
- fold active: the system adjusts column widths and margins;
- a hidden pane has several ways back if the person hid it on purpose.

Do not use a split view just because two blocks sit side by side; if they are not navigation levels, an arrangement fits better.

### 8.2 ArrangementView / UIArrangementViewController
For two views that are peers in layout but do not create a new navigation hierarchy.

**Split arrangement** — both views must be visible at once and neither should cover the other: player + transcript / lyrics · preview + an equally valuable inspector · canvas + controls / detail that must coexist. By default it adapts the axis to the space; the axis can be restricted and a ratio / min / ideal / max set when the product needs it.

```text
Split arrangement (video 111463, 12:08)
NavigationStack {                         ┌──────────────┬──────────────┐
  ArrangementView { PlayerView() }        │              │              │
  secondary: { UpNextView() }             │  PlayerView  │  UpNextView  │
  .arrangementViewStyle(.split)           │  (primary)   │ (secondary)  │
}                                         └──────────────┴──────────────┘
```

**Overlay arrangement** — clear foreground / background where the background may be partly covered: media + playback controls · readable content + control palette · map / canvas + floating panel. When the fold creates two usable regions, the overlay may turn side by side but keeps its foreground / background semantics.

```text
Arrangement restricted to the horizontal axis (video 111463, 13:30)
.arrangementViewStyle(.split.axes(.horizontal))
┌ player ───────────────────┬ Queue ────────────────────┬──┐
│                           │ ▣ Cities as living …  6:38│9:│
│  ▣ Why the onboarding fl… │ ▣ What if pricing …   3:24│◔ │
│  ━━━━━━━──────── −8:22    │ ▣ The case against …  5:07│← │
│     ⏮    ▶    ⏭           │ ▣ Memory as recon…    8:10│  │
│                           │ ▣ … (scrolling list)      │  │
└───────────────────────────┴───────────────────────────┴──┘
```
A layered relationship can adapt into two regions without changing the task.

### 8.3 Navigation sits outside the arrangement
An arrangement does not manage navigation. Never embed `NavigationSplitView` or `TabView` as arbitrary content inside an arrangement to force geometry. The navigation container wraps; the arrangement organises primary / secondary inside one screen / task.

### 8.4 List, ScrollView, custom layout
- List / ScrollView manage content flow; they do not replace an arrangement.
- Never put an arrangement as an arbitrary row inside a scroll container if geometry / lifecycle do not fit.
- Custom layout only when the system containers cannot describe the content relation.
- A custom layout still takes safe area, margins, reserved regions, Dynamic Type and localization as inputs.

### 8.5 Container decision tree

```text
Several hierarchy levels to navigate?
├─ Yes → NavigationSplitView / UISplitViewController
└─ No
   └─ A lasting primary + secondary relation?
      ├─ No → ordinary responsive stack / grid / list / form
      └─ Yes
         ├─ Both must show, neither may cover the other → split arrangement
         └─ Foreground / background, covering allowed → overlay arrangement
```

## 9. Adaptive bars are part of the layout `[A]` / `[C]`

The outer display is wider and shorter than the familiar iPhone. The system moves navigation, toolbar and tab controls to the edge to keep height for content. Inner landscape keeps using the edge for continuity; inner portrait may return to horizontal bars. Apple detail: `duo-components.md` §1–§10.

### 9.1 A structural transformation

```text
Toolbar changing axis (video 111462, 03:18 → 03:19 → 03:20 — photo editor)
03:18 horizontal                 03:19 turning                  03:20 vertical, shared region
┌──────────────────────┐         ┌──────────────────────┐       ┌──────────────────────┐
│       photo          │         │       photo     (♡?) │       │       photo     (♡?) │
│                      │         │                 (⇪)  │       │                 (⇪)  │
│                      │         │                 ┌──┐ │       │                 ┌──┐ │
│ [(♡?)(⇪)] [(◎)(⫶)(🗑)]│         │                 │◎ │ │       │                 │◎ │ │
└──────────────────────┘         │                 │⫶ │ │       │                 │⫶ │ │
two groups along the bottom      │                 │🗑│ │       │                 │🗑│ │
                                 └─────────────────└──┘─┘       └─────────────────└──┘─┘
```
Groups keep their identity while changing axis; navigation, actions and tab controls then share the vertical region at the display edge.

### 9.2 Bar item contract `[T]`
Every item has: semantic role (navigation, primary action, status, contextual action, secondary) · group ownership · relative placement in horizontal and vertical representations · symbol **and** title · vertical-axis eligibility · visibility priority · overflow representation · behaviour with long text, Dynamic Type, localization · disabled / loading / selected / badged states.

### 9.3 Ordering and reach
- Navigation such as Back / Close at the start of the vertical region.
- A prominent action such as Done follows navigation.
- Remaining groups keep their functional relation.
- Items overflow from the bottom up by default; frequent actions and important status stay visible longer.
- No fixed spacers to fake grouping; use the system's group semantics.
- Do not mix text actions and symbol actions in one capsule if it may read as one combined control.

### 9.4 Asymmetry and RTL
The vertical bar follows the hardware edge / system preference and is **not** mirrored mechanically for RTL. Content still uses semantic leading / trailing; the hardware edge is a different concept. In Split View multitasking each app puts controls on the outer edge of its own area, so an app may see its bar on the left or the right — read the safe area / vertical bar edge, never assume.

### 9.5 When opting out is allowed
Some immersive, non-scrolling interfaces with no need for bars may use the full width (e.g. a calculator or a game surface), provided: no conflict with the Dynamic Island / status · navigation and an escape path stay clear · no control lands in a hard-to-reach area · the background may be full bleed but interactive foreground stays safe · never opt out just to keep an old custom bottom bar.

## 10. Patterns per content type `[C]`

Nine product patterns with all fields (Feed, Master–detail, Messaging, Media, Maps, E-commerce, Dashboard, Settings, Calendar): `duo-community-patterns.md` §2. The principles below are general and add form, editor / canvas and game.

### 10.1 List–detail
Compact: one pane · selection kept in the model while list and detail replace each other · clear back path · when returning to the list the selected item is still recognisable where appropriate.
Expanded: list and detail together · persistent selection · detail never resets on fold · empty detail shows an instruction or sensible recent / default content.

### 10.2 Grid and dashboard
- column count = min card width + usable region, not the device model;
- keep tiles whole around the division region;
- outer margins stay consistent; the fold is absorbed by gutter / inter-column spacing;
- reading order survives when the grid splits into two regions;
- never raise density until touch targets or scannability suffer.

### 10.3 Feed, article, document
- keep the scroll flow continuous;
- never displace the whole article because of the fold;
- avoid headings, selection handles, inline actions or key text exactly on the distorted area;
- keep the scroll anchor when the layout width changes;
- reflow typography by line length; never widen the column endlessly on the inner display.

### 10.4 Form and keyboard
- field, validation, suggestion and keyboard keep their spatial relation;
- focus survives when a field moves pane;
- never dismiss and reopen the keyboard just because of a reflow;
- Submit / Next / Save always reachable;
- errors anchored near the field and reached by accessibility focus in a sensible order;
- tabletop may put form / result on the upright part and keyboard / controls on the flat part if the task naturally supports it.

### 10.5 Media player
- overlay when controls are temporary foreground over the media;
- split when transcript / playlist is peer content read at the same time;
- full screen does not mean dropping safe interaction at the edges;
- on fold, player state, position, captions, route and control visibility never reset;
- PiP is a geometry / lifecycle state to test together with the fold.

### 10.6 Editor / canvas
- the canvas may be full bleed;
- inspector / tool palette avoid the fold and cameras;
- tool selection, undo stack, zoom and selection never reset on recompose;
- an overlay palette may turn side by side through an arrangement;
- key controls never at the edge the person must hold.

### 10.7 Games and immersive UI `[A]` (HIG Duo)
- playable in every supported pose;
- may lock portrait or landscape but must still fill the screen when the pose changes;
- keep text / control size stable where possible;
- prefer changing the aspect ratio over letterboxing / pillarboxing;
- if padding is unavoidable, use fitting artwork instead of meaningless empty bands;
- HUD, pause, primary action and the system escape never fall on the fold, cameras or system-gesture edges.

## 11. Component adaptive contract `[T]`

Every important component should have this spec (short form also in `duo-handoff-testing.md` §6).

### 11.1 Invariant anatomy
Required content · semantic label · primary action · selected / loading / error state · minimum hit target · accessibility order.

### 11.2 Representation by space

| Level | Describe |
|---|---|
| Compact | what is visible, what goes into a menu, axis and text wrapping |
| Intermediate | the content-based threshold where behaviour changes — not just a px number |
| Expanded | which hierarchy is revealed, which pane / metadata appears |
| Fold active | which item / group is displaced or split |
| Vertical bar | symbol / title / group / priority / overflow |
| Accessibility text | when the component changes axis, scrolls or splits into rows |

### 11.3 Transition contract
Source frame / state · destination frame / state · item identity preserved · which animation is allowed · focus / selection / scroll mapping · whether the transition is interruptible and reversible · Reduce Motion behaviour · which state must not restart.

### 11.4 Failure contract
Not enough room for both panes · text longer than expected · a reserved region appears mid-interaction · keyboard or sheet reduces usable height · an item is being dragged / focused / captured when folding · display switches outer ↔ inner while loading / saving · the app goes to background or the scene loses active state.

## 12. Motion and continuity `[A]` / `[C]`

Motion on an adaptive layout explains relations; it is not decoration (full motion rules: `duo-ergonomics-motion-input.md` §2).

### 12.1 Rules
- the same semantic element keeps its identity across resize / recompose;
- short, trackable movement;
- avoid fading the whole screen out and in if you can morph / reflow directly;
- a displaced item moves with its source / context;
- the layout never "explodes" at an arbitrary hinge angle;
- if the person reverses the fold, the animation can be interrupted or reversed safely;
- Reduce Motion cuts big movement, zoom, parallax or animated blur but still signals state through position, opacity or clear labels.

### 12.2 State to keep
Navigation path · current selection · text cursor and composition · scroll anchor · media / capture time · deliberate expanded / collapsed state · assistive-technology focus · transient presentation while still valid.

### 12.3 When a presentation is no longer valid
If its source disappears or moves container:
1. try to re-anchor the presentation to the same semantic source;
2. if the source is gone but the task is still valid, switch to a safe representation such as a centered sheet;
3. if the task is no longer valid, dismiss with an explanation or keep the draft;
4. never leave a popover / menu floating at its old position with no relation left.
