# Layout transformation: from a regular iPhone screen to iPhone Duo

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §5.2–5.4 (fig. 4–7), §6, §7, §13, §16.1, §23.1 (00:30–05:00, 05:01–06:05), §23.3 (02:26–17:45), §23.6 (03:42–05:06, 07:34–08:35) @ 3c0e291 — translated, complete

Labels: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal (see `duo-foundations.md`).
Verbatim Apple pages: [designing-for-iphone-duo](../apple-hig/references/designing-for-iphone-duo.md), [layout](../apple-hig/references/layout.md), [split-views](../apple-hig/references/split-views.md), [multitasking](../apple-hig/references/multitasking.md). Geometry and regions: `duo-device-postures.md`. Bars and presentations: `duo-components.md`.

## Contents
1. How to transform a screen (procedure)
2. SDK compatibility levels (with wireframes)
3. Assumptions to remove
4. Resize rules for assets and content
5. Continuous content, point content, related groups
6. Displacement pattern
7. Choosing a region by purpose and adapting content inside it
8. Keeping transitions trackable
9. Navigation split view
10. Arrangement: split, overlay, choosing, when not to use
11. Container decision table
12. Screen types: how each transforms from a regular iPhone to Duo

---

## 1. How to transform a screen `[T]` (procedure assembled from the rules below)

Start from the existing regular-iPhone screen. Its compact-width layout is the baseline for the **outer display** (compact width, and left of the side bar a content area roughly the size of a traditional iPhone — `duo-device-postures.md` §1, §3). Then:
1. **Classify the screen** by product group (§12) and by hierarchy (list–detail? two peer regions? foreground over background? continuous scroll?).
2. **Pick the container** (§11): navigation split view, split arrangement, overlay arrangement, plain scroll, or plain layout + reserved region/displacement.
3. **Outer (compact)**: keep one hierarchy level; let standard bars go vertical on the hardware edge; inset content for the asymmetric safe area; set overflow priorities (`duo-components.md` §4–§6).
4. **Inner (regular)**: reveal hierarchy/panes/columns instead of stretching; cap readable width; keep selection/task.
5. **Book / tabletop**: classify every element as continuous, point or related group (§5); displace the smallest scope (§6); choose regions by purpose (§7); prefer even column counts.
6. **Intermediate sizes, Split View left/right, PiP, keyboard**: verify nothing breaks between the "nice" frames.
7. **State**: list what persists across resize/pose/scene (selection, draft, scroll, play/capture/edit, undo).
8. **Write the adaptive behaviour spec** (`duo-handoff-testing.md` §5) — never hand off artboards only.

## 2. SDK compatibility levels `[A]`

| Build | Typical behaviour on Duo | UX/UI meaning |
|---|---|---|
| iOS 26 SDK or older | runs but tends to letterbox. Closed: uses the part of the screen left of the status bar and camera. Open: appears in a frame of familiar proportion in the middle instead of using the whole canvas | does not fully break but wastes space and feels non-native |
| iOS 27 SDK | uses most of the inner display — extends to the left of the status area — but still reserves a status area | audit resize, crop and hierarchy structure |
| iOS 27.1 SDK | edge-to-edge; standard toolbar/tab/navigation can become vertical **under the status bar** | full Duo behaviour; must handle safe area, overflow and asymmetry correctly |

`[C]` Binary compatibility ≠ an optimised experience. Design QA must know which SDK the app is built with, because the same layout source can appear differently. Once an app uses the full screen, per-pose layout bugs become visible; "looks fine in the letterbox frame" does not prove the app is adaptive.

Wireframes of `images/03-sdk-before-ios27.png`, `04-sdk-ios27.png`, `05-sdk-ios27-1.png` (Apple; left = inner display landscape, right = outer display):
```text
OLD SDK (≤ iOS 26)
inner:  +#########+----------------+#########+ 9:41    outer: +----------------+###+
        #  black  | [⚙][▦][+]      |  black  # wifi           | [⚙][▦][+]      |(o)|
        # letter- | [card]         |  letter-#                | [card]         |9:41
        #  box    | [card]         |  box    #                | [card]         |   |
        +#########+----------------+#########+                +----------------+###+
        app in a phone-ratio frame, centred                   app left of camera/status strip

iOS 27 SDK
inner:  +-------------------------------+####+                outer: unchanged from old SDK
        | [card] [card]         [⚙][+] |9:41#
        | [card] [card]                |wifi#
        +-------------------------------+####+
        2-column grid, uses most of the screen; status strip still reserved; toolbar horizontal

iOS 27.1 SDK
inner:  +-------------------------------------+   outer: +--------------------(o)+
        | [card] [card]               9:41    |          | [card]          9:41  |
        | [card] [card]               wifi    |          | [card]          (⚙)   |
        |                              (⚙)    |          | [card]          (▦)   |
        |                              (+)    |          |                 (+)   |
        +-------------------------------------+          +-----------------------+
        edge-to-edge; toolbar items become a vertical bar under status on the hardware edge
```

*Image skipped:* `images/07-video-prepare.jpg` — presenter frame of "Prepare your app for iPhone Duo" (no layout information).

## 3. Assumptions to remove `[A]`

- Reading the main screen size once and keeping it for the whole session. On a two-display device "main screen" is ambiguous and Apple plans to deprecate referring to it; prefer environment, trait collection or scene bounds; if you must know the screen, read it dynamically from the current window scene.
- Using orientation to infer width/height or UI type.
- Using the device idiom to choose "phone layout" vs "tablet layout" (inferring size/capability from the user-interface idiom).
- Assuming the app is full screen, has a single scene or a single window.
- Assuming the toolbar is always top/bottom and the tab bar always bottom.
- Assuming `aspectFill` always looks good — a wide canvas can crop the subject away.
- Assuming images/cards have a fixed width because "all iPhones are about the same".
- Setting "requires full screen" to dodge adaptive design: `UIRequiresFullScreen` is still respected, but the app still resizes when the device opens/closes, and on the inner display the app may be **scaled**, even in Split View. The flag is no escape from adaptive design.

`[A]` Duo continues iPhone's history of adapting to sizes, shapes and special regions such as the Dynamic Island; it is not a separate layout system. iOS 27 also lets iPhone apps resize large in iPhone Mirroring on Mac; opening/closing Duo is handled with the same mental model — **window geometry changes while the app runs**. Good layouts work on a continuum.

## 4. Resize rules for assets and content `[A]` / `[C]`

- Define a focal point for cover images.
- Allow switching between aspect fill and fit based on the task, not just the ratio.
- Give forms/reading text a max width, but let the surrounding canvas expand usefully.
- With more space, prefer revealing hierarchy / panes / context over growing cards and text without limit.
- With less space, scroll/overflow on purpose; never compress text, hit targets or fields below usable size.
- Resizing never resets selection, player, draft or active tool.

## 5. Continuous content, point content, related groups `[A]`

Not everything avoids the fold the same way:
- **Continuous content** — feed, article, document, long list — can usually scroll across the fold. Cutting it into two hard halves breaks reading rhythm. Scrolling is already the adaptation mechanism; moving such content between regions would break continuity, so it is **not displaced**.
- **Point content** — button, menu, field, dialog, selected object, camera control, a single card — must sit wholly inside a visible, touchable region.
- **Related group** — must move together if splitting it breaks the relationship. Example: a selected photo and its context menu move to the same region; the menu never "floats" far from its source.

## 6. Displacement pattern `[A]`

Displacement adjusts the **frame of an existing element** to the available space so it stays visible, touchable and uncovered — it does not create another screen. Scope can be one button, a container, or most of the layout. Independent elements move alone; elements that work together move together.

Decision order:
1. Identify which elements are really covered or hard to reach because of fold/camera/bar.
2. Choose the **smallest scope** that can move without breaking meaning.
3. If elements share one task/context, move the whole group.
4. Keep distance and visual relationship to the source.
5. Limit travel; avoid making people hunt for the control again.
6. Keep the same label, icon, action and state after moving.

## 7. Choosing a region by purpose; adapting content inside it `[A]`

- **Book pose:** an alert/dialog moves to the **trailing region**, close to where it will appear if the device keeps closing towards the outer display; contextual controls go to one side instead of sitting on the fold; list–detail can rebalance its two panes around the fold.
- **Tabletop:** the upper region suits content viewed from afar — an alert can go there to be easy to find; the lower region suits tappable media controls because it is a stable touch surface. Content to watch far from the hand, controls near the hand: a natural division of roles.
- **Several usable regions:** prefer the contextual relationship. A search field stays above the view it searches and keeps its relationship with the keyboard; do not push the field to another region just because of the fold if that loses context (same for camera/search + keyboard).
- **Grid:** prefer an **even number of columns** so the halves split cleanly; the system can add space at the fold while keeping outer margins (Fitness grid keeps outer margins but increases spacing at the hinge so every tile sits wholly inside a region).
- Position and size are the common changes; other visual properties may change if needed.
- Action sheets, alerts, menus and popovers must show completely; the system repositions them around reserved regions.
- Reminders' split view keeps both columns by rebalancing to **50/50** when folded.
- **Principle:** move, resize or reorganise what already exists; **never delete content, functionality or a layout option because the pose changed.**

## 8. Keeping transitions trackable `[A]`

When someone folds slowly they watch the UI change continuously:
- move only what is necessary;
- avoid changing panes, action order, colour and scale at the same time;
- keep targets/actions near their old position;
- use geometry-linked animation if available, but motion must never slow resizing;
- preserve focus, selection and accessibility focus.
Full motion rules: `duo-ergonomics-motion-input.md` §2.

*Image skipped:* `images/09-video-adaptive-layouts.jpg` — presenter frame of "Strike a pose with adaptive layouts" (no layout information).

## 9. Navigation split view `[A]`

For hierarchies like list → detail or sidebar → content (`NavigationSplitView` / `UISplitViewController`):
- outer / compact: collapses to one pane / a single stack; people move through the navigation stack;
- inner / regular: shows list and detail together, as tiled or overlay columns;
- when folded: the two panes' widths/margins adjust so content is clear and balanced with the fold;
- selection is synchronised: the item open in compact **is** the selected detail in regular.
- `TabView` / `UITabBarController` appear on both displays and go vertical when appropriate. On the inner display the app can **opt in to a sidebar** for richer navigation — best for information-dense apps like Health, **not a default for every app**.
- Inner display (video 111466 @ 07:34): don't stretch the phone UI; split views show several hierarchy levels at once, but hierarchy must **not change meaning** between inner and outer; never limit functions by pose (people open/close often); a vertical layout can reflow into two columns with more horizontal space.
- `[C]` Don't force 50/50 if content doesn't need it, but let the system/container rebalance on fold. Don't keep a rigid iPad sidebar width and squeeze the detail.

## 10. Arrangement `[A]`

An arrangement is a **layout** container, not navigation. `NavigationStack`, `NavigationSplitView` and `TabView` own navigation; `List`/`ScrollView` hold content; an arrangement sits between them: a layout container that takes **two views (primary, secondary)** and lays them out by a set of rules. Inputs: size class, aspect ratio and active division region. Outputs: which views are shown and each view's frame. iOS 27.1 provides system arrangements (`ArrangementView`; UIKit `UIArrangementViewController`) so apps need not hand-code this condition matrix.

Example (Podcasts): turning on the transcript splits the layout; on a folded Duo, Now Playing sits in the left region instead of centring on the whole display; when the device is taller than wide, the transcript moves inline instead of splitting.

### 10.1 Split arrangement (default style)
- divides the bounds between primary and secondary;
- wider than tall → side by side (horizontal split); taller than wide → stacked (vertical split);
- allowed axes can be limited; if a split is not allowed on the primary axis, the arrangement shows **only one view** (in Apple's example the PlayerView);
- may keep only the primary if the secondary does not fit a narrow area;
- use when the original UI is already like HStack/VStack, or both parts matter and must not cover each other: preview + controls, canvas + properties, media + transcript.
- `[C]` Handoff states which view is **primary**, so collapsing never keeps the secondary by mistake.

### 10.2 Overlay arrangement
- primary and secondary normally stack on top of each other (z-order); when folded they separate into regions / stand side by side;
- suits foreground/background; the secondary can be collapsed/expanded by state (read the z-index/placement state to switch the secondary between collapsed and expanded on fold/unfold);
- use when the foreground may partly cover the background and the task stays understandable: player controls over media, palette over canvas, info card over a map;
- it is a presentation change of the same content, not a new destination.

### 10.3 Choosing split or overlay
- Existing HStack/VStack of two equivalent regions → **split**. Existing ZStack or a clear foreground/background → **overlay**.
- Accessibility Reader: foreground controls may partly cover a readable, scrollable background → overlay.
- Podcasts: transcript is detail of the playing content and neither may be covered → split.
- Audio note: Up Next adds detail to the playing state, it is not background → split.

### 10.4 When not to use an arrangement; final audit
- It provides no navigation: never put a `NavigationSplitView` (or any navigation container) **inside** it; navigation stack/split/tab wrap it from outside, the arrangement only lays out content. Do not try to "solve everything" with it.
- Avoid putting an `ArrangementView` inside a `List`/`ScrollView`: scrollable containers make its lifecycle and geometry unpredictable.
- Audit centred layouts first: should it become two columns, or does it only need displacement?
- Prefer system containers/presentations to get behaviour for free.
- For custom horizontal split/overlay, consider `ArrangementView` on **every** device, not only Duo.
- Identify the most important manually laid-out controls, then use `ReservedRegion` selectively.
- Hinge API is for interaction/effect; layout keeps using arrangement/regions.

## 11. Container decision table `[A]`

| Need | Preferred container |
|---|---|
| Hierarchy and list–detail navigation | Navigation split view |
| Two peer regions that must not cover each other | Split arrangement |
| Controls/context floating over background content | Overlay arrangement |
| Continuous feed/article | Normal scroll/list; do not force an arrangement |
| UI where only a few controls must avoid the fold | Normal layout + reserved region / displacement |

## 12. Screen types: regular iPhone → Duo `[C]`

The regular-iPhone column is the compact baseline; "Outer" is the same compact model with the side bar and wide/short ratio.

| Screen type | Regular iPhone / Outer (compact) | Inner, flat (regular) | Book (vertical fold) | Tabletop (horizontal fold) | Must persist |
|---|---|---|---|---|---|
| **Feed / content** | one feed; detail as push or sheet | more columns if cards suit it, or list–detail if selection has value | even columns; no important card split by the fold | — | scroll, selection |
| **Mail / chat / productivity** | list **or** detail at one time | list–detail; optional inspector/supporting pane only if the hierarchy truly needs it | panes balanced around the fold | — | draft, unread state, selection across collapse/expand |
| **Media** | compact player; bar overflows sensibly | media + queue / transcript / comments | — | media on top, controls/queue below | playback, subtitle, speed, scrub position through PiP/fold/resize |
| **Editor / creative tool** | canvas/document is primary; tools via toolbar/menu/sheet | canvas + properties/supporting pane; contextual tools near the selection | — | preview on top, timeline/palette/input below if natural | undo/redo, selection; prefer toolbar over tabs during an active task |
| **Camera / call** | preview/participant is primary content | see `duo-camera-layout-controls.md` | can separate person / content / controls | can separate person / content / controls | meaning of mute/camera/switch never changes; End/Stop clear, consistent, reachable, never silently in overflow |
| **Game** | may lock portrait or landscape but still fills the canvas when the pose changes | prefer changing aspect ratio over letterbox/pillarbox | gameplay controls never on the fold, camera region or system-gesture edge | same | text/control size stable on resize; HUD not scaled with the canvas |

Extra rules:
- Feed: never auto-open a random detail just because there is room; selection needs logic.
- Mail/productivity: list controls near the list; composer/detail actions in their own pane.
- Game: if empty space is unavoidable, use deliberate artwork instead of meaningless black bars.
- Empty detail pane on inner can prompt "pick an item from the list"; when collapsing to outer, don't keep an empty screen if navigation can return to the list (`duo-states-feedback.md` §3).

Per-pose goals: `duo-device-postures.md` §8. Bars per screen state (toolbar vs tab priority): `duo-components.md` §6.
