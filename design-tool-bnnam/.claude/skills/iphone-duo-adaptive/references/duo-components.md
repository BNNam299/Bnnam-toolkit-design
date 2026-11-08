# Components on iPhone Duo: vertical bars, overflow, sheets, alerts, menus, popovers, PiP, custom components

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §8 (fig. 9–10), §9, §16.4, §23.1 (05:01–06:05), §23.2 (all), §23.6 (02:03–03:41 PiP, 05:07–06:32, 08:36–10:32) @ 3c0e291 — translated, complete

Labels: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal (see `duo-foundations.md`).
Verbatim Apple pages: [designing-for-iphone-duo](../apple-hig/references/designing-for-iphone-duo.md), [toolbars](../apple-hig/references/toolbars.md), [tab-bars](../apple-hig/references/tab-bars.md), [sheets](../apple-hig/references/sheets.md), [alerts](../apple-hig/references/alerts.md), [menus](../apple-hig/references/menus.md), [popovers](../apple-hig/references/popovers.md), [split-views](../apple-hig/references/split-views.md), [multitasking](../apple-hig/references/multitasking.md).

## Contents
1. Why and when bars go vertical
2. Which bars qualify (container ownership)
3. The shared side axis
4. Item order, grouping, priority and overflow
5. Item representation: symbol, title, text, badge
6. Axis behaviour and custom views on the vertical axis
7. Toolbar vs tab bar compression
8. Proximity: control near the content it acts on; RTL
9. Split View with two apps
10. When to opt out of vertical bars
11. Sheets
12. Alerts, menus, popovers; fold avoidance
13. Picture in Picture
14. When a custom component is allowed

---

## 1. Why and when bars go vertical `[A]`

- The outer display is wide and short; moving top/bottom controls to the side preserves content height and improves reachability.
- On the **outer display and inner landscape**, standard toolbar, tab bar and navigation controls can move to the side edge. The side position is **kept in inner landscape** so continuity is not broken when moving between displays.
- **Inner portrait** is tall enough, so it returns to horizontal bars.
- Except inner portrait, most configurations use side controls.
- It is the same component and the same action hierarchy, only arranged differently.

Wireframe of `images/12-video-design.jpg` (Apple, FaceTime call in book pose):
```text
+--------------------------++---------------------------------+
|                          || [(@) Lennon >]   (cam)    9:41  |
|   REMOTE PARTICIPANT     ||                          (wifi)  |
|   video (left page)      ||    SECOND VIDEO (right page)     |
|                          ||                           ( ○ )  |  capture
|                          ||                           (cam)  |  camera on/off
|                          ||                           (mic)  |  mute
| (fx)                     ||                           (···)  |  more
| (↻)                      ||                           ( ✕ )  |  end call (red)
+--------------------------++---------------------------------+
                          fold                    vertical bar on the outer
                                                  hardware edge, under status
```
Shows: toolbar, status and camera organised along the hardware edge; call controls stack vertically on the outer right edge with the destructive End at the bottom; each page keeps its own context controls; nothing interactive on the fold.

## 2. Which bars qualify `[A]`

- Built with the new SDK (iOS 27.1 for full vertical bars — `duo-layout-transformation.md` §2).
- The bar must belong to a **standard navigation container**: `TabView`, `NavigationStack`, `NavigationSplitView`, `UINavigationController` or `UITabBarController`.
- UIKit: put toolbar items on the view controller **inside** the navigation controller. A standalone `UIToolbar`, `UINavigationBar` or `UITabBar` used to build a custom bar is **not** treated as an adaptive bar.
- Only the container touching the **hardware edge** gets a vertical bar. In complex layouts only that container's toolbar goes vertical.
- In a split view only the **detail column** participates (the detail/trailing area joins the outer-edge control region); items of other columns stay horizontal; controls of an inner pane do not run out to the edge automatically.
- An **inspector** gets no extra vertical bar when the detail already has one — two side axes would confuse.
- `[C]` Handoff states which container each bar belongs to — not just a strip that looks like a system bar.

## 3. The shared side axis `[A]`

Navigation, toolbar and tab controls coexist in one shared vertical region — picture the horizontal stack rotated 90°. From top to bottom it may hold:
1. Dynamic Island / Live Activity;
2. status;
3. navigation such as Back or Close;
4. a prominent action such as Done;
5. the remaining toolbar groups;
6. the tab bar at the bottom.

- Top toolbar items go to the upper part, bottom toolbar items to the lower part; the tab bar stays **bottom-aligned** on the vertical axis.
- The mix varies by app: Notes has a toolbar, Clock a tab bar, Fitness both.
- App controls share the axis with Live Activity and status; when space runs out they collapse into overflow automatically.
- Available height changes with pose, keyboard, PiP, Live Activity and concurrent apps. **Overflow is a normal state, not a design error.**

## 4. Item order, grouping, priority, overflow `[A]`

- Top: primary navigation (Back/Close) in its familiar upper area. Then the prominent action (Done) right after navigation.
- A custom Back/Close must use the correct **semantic placement** so it doesn't appear next to the system Back.
- Remaining items keep their original grouping; when merged into one bar the system inserts the gap between the top and bottom groups. Keep related actions in a group and let the system space groups — **never insert fixed spacers**.
- Because not every pose uses a vertical bar, the **relative position of actions must stay stable** between horizontal and vertical.
- When the toolbar exceeds the space, items leave the bar **from the bottom up** by default.
- Priority can be high, low or custom; prioritise **whole groups first**, then items within a group.
- Compose/New Note and high-frequency actions leave last; items carrying status/badges stay longer so people can still glance at them; content-creating actions stay longer.
- Destructive or rare actions may go to overflow, but never hide an essential action with no alternative path.
- If the app already has its own overflow, merge those actions into the **system overflow** (`ToolbarOverflowMenu` / `additionalOverflowItems`). Do not turn every menu into overflow: the **ellipsis is reserved for system overflow**; other menus need their own symbol.

Wireframe of `images/08-video-raise-the-bar.jpg` (Apple, vertical bar groups):
```text
   ( ^ )      group 1: previous / next
   ( v )
              ← system-made gap between groups
   (archive)  group 2: archive, move to folder, reply
   (folder)
   (reply)

   ( ✎ )      group 3: compose (prominent, last to overflow)
```
Shows: items keep their groups as Liquid Glass capsules; spacing between groups comes from the system, not from spacers.

## 5. Item representation `[A]`

- Horizontal bars: **fixed height, flexible item width**. Vertical bars: **fixed width, flexible item height**.
- Symbol-only suits vertical bars better than text.
- The item model supplies **both icon and title**. The system picks the representation: bars usually prefer the icon; text-only items show text; overflow shows title and icon.
- Text-only items stay on the horizontal axis; items with an icon can go vertical.
- The title remains **mandatory** even when only the symbol shows — overflow, expanded form, menus and VoiceOver need it.
- To let more items go vertical: reduce title-only items and custom views containing both image and text. If the text only repeats the symbol's meaning, drop it from the visible representation but keep the title metadata.
- Turn an inline count into a **system badge** so the item becomes symbol-only and stays glanceable (badges save width better than long inline counts).
- If the text carries independent data — e.g. a cart total — keep the control in a horizontal bar.
- Text buttons, segmented controls and other too-wide items stay in the horizontal nav bar.
- The **keyboard accessory bar** stays attached to the keyboard; it never moves to the side.

## 6. Axis behaviour and custom views `[A]`

- By default the system infers the axis from content; `AxisBehavior` adjusts it.
- An item that switches between symbol and text must stay on one axis. System Edit already stays horizontal; a similar custom item needs `horizontalOnly`.
- Custom/complex views default to horizontal. Opt in to `verticalPreferred` only if the view has a genuinely good vertical representation.
- Don't force a vertical symbol variant if the same action sometimes needs text and jumping axes would be unstable.
- A custom view must fit the fixed width or have its own vertical layout. The vertical variant may change metrics, hide the title or reduce height, as long as meaning and access are intact. Never shrink a horizontal control until it is unusable.
- The `toolbarVerticalEdge` environment/trait tells content when it may sit on a vertical axis (nil/unspecified when not).
- Vertical bars have **no scroll-edge effect** by default; with **Reduce Transparency** on, they get a background. Custom content must be clear in both cases.
- A flexible spacer has size 0 on the vertical axis; a fixed spacer keeps its minimum. Apps should not add their own spacing on either axis — grouping drives the layout.

## 7. Toolbar vs tab bar compression `[A]`

- Overflow happens most on the **outer display in landscape** and when the keyboard or PiP competes for space.
- **Navigation-focused view:** the toolbar compresses first to keep tabs/destinations — the default, sensible for browsing.
- **Task-focused view:** the tab bar compresses first (can minimise to a single control) to keep frequent tools — configured per view via compression behaviour.
- The decision comes from the **screen state**, not one app-wide rule: an editor in use may prioritise tools; a discovery screen prioritises destinations. For editors, prefer toolbar over tabs during an active task.

## 8. Proximity and RTL `[A]`

Don't pull every control to the edge just because there is room. A control stays near the content it affects:
- list/sidebar actions sit on that list pane;
- detail actions on the outer edge or the detail's toolbar;
- contextual controls near the selection;
- only global navigation/actions belong on the system axis.

The vertical bar follows the **hardware edge** — it does **not** move to the other side for RTL. Content still follows leading/trailing and reading order around it; the bar keeps its relationship to camera/hardware. Full RTL table: `duo-accessibility-localization.md` §8.

## 9. Split View with two apps `[A]`

Split View is created with the home gesture, **50/50 by default**; both halves work independently. Each app puts its vertical controls on the **outer edge of its own half**: the left app's bar on the left edge, the right app's on the right edge — away from the centre fold and close to the thumb. `[C]` Design review tests both sides; never assume the large safe inset is always trailing. More: `duo-multi-display-scenes.md` §3.

## 10. When to opt out of vertical bars `[A]`

- Most apps suit vertical bars, but not all.
- Single-page, bottom-heavy layouts like Calculator may keep the horizontal bar so content can use the full width.
- A content-heavy sheet with a single toolbar item such as Close may disable the vertical bar to avoid wasting the edge.
- Opting out is a **local decision per view/sheet**, never disabling it app-wide to avoid adaptive behaviour.

## 11. Sheets `[A]`

| Situation | Behaviour |
|---|---|
| Outer display | sheet moves its controls to the side by default (vertical controls / vertical buttons) |
| Outer, vertical bar disabled for the sheet (e.g. one toolbar button) | the sheet stops before the front camera; the status bar repositions itself |
| Inner display, landscape and portrait | sheet is centred by default and uses horizontal bars |
| Inner, sheet placement changed | the sheet on the **left** has no vertical bar; the sheet on the **right** (by the hardware edge) has one |
| Partial fold | the sheet slides to a safe region instead of sitting on the fold |

`[C]` Opting a sheet out (one control, vertical bar makes it heavy) follows system guidance and is never an app-wide pattern change. More detail on six sheet states with frames: the Apple video atlas (handled in the video references of this skill).

## 12. Alerts, menus, popovers; fold avoidance `[A]`

- Popover, context menu, alert and action sheet adapt to the pose; standard components avoid fold/camera/reserved regions and keep their relationship to the source. This is a big part of the value of system components.
- A button on the fold is hard to tap; the system nudges interactive elements off the curve — built into sheets, alerts, menus, toolbar buttons and many standard components. Prefer system components to get consistent fold avoidance. Scrollable content need not avoid the fold; interactive items avoid it as much as possible. End goal: **one experience that adapts**, not many apps by pose.
- `[C]` A custom overlay must recreate all of: anchor/source relationship; placement when folded; safe area; keyboard and Dynamic Type; VoiceOver focus; dismissal and continuous animation. That is why utility functions use system components; custom only pays off for truly specific interactions.

## 13. Picture in Picture `[A]`

- PiP can pin to the top area; the current app resizes to the remaining height. Layout must shrink vertically, bars must overflow sensibly, and important controls must not sit under PiP.
- When partly folded, the video can expand to fill one half; the app must adapt **continuously to the video size**, not just to two states (PiP on/off).
- Duo also has a stacked video-and-app layout; for the app, side-by-side and video-stacked are handled by the same resize foundation.
- `[C]` Keep playback, captions, focus and the path back to full screen.

## 14. When a custom component is allowed `[T]`

Custom is reasonable when it:
- expresses an interaction specific to the product domain;
- makes content faster to understand;
- creates a brand moment in the content layer;
- does something a system component cannot express.

Before customising a menu / sheet / bar / navigation, prove:
- a clear UX benefit;
- full reserved-region, overflow and resize handling;
- keyboard / VoiceOver / Dynamic Type support;
- Reduce Transparency / Reduce Motion variants;
- RTL behaviour;
- tests on every important pose.

Component contract fields (role, size, axis, priority, safe behaviour, state, continuity, accessibility): `duo-handoff-testing.md` §6.
