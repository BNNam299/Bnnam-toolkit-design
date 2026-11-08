# iPhone Duo device geometry, size classes, reserved regions and postures

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §2 (fig. 1–2), §4, §5.1, §10, §11.5, §23.1 (02:46–03:56, 06:06–09:11), §23.3 (00:27–02:25, 06:39–08:38), §23.4 (00:49–02:34), §23.6 (00:28–03:41, 03:42–05:06, 06:33–07:33) @ 3c0e291 — translated, complete

Labels: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal (see `duo-foundations.md`).
Verbatim Apple pages: [designing-for-iphone-duo](../apple-hig/references/designing-for-iphone-duo.md), [layout](../apple-hig/references/layout.md).

## Contents
1. Anatomy: two displays, two cameras, one continuum
2. The postures (with wireframes)
3. Size classes per display and orientation
4. Reserved regions (camera, folding; division vs occlusion; active vs inactive)
5. Safe area, layout margins, full bleed, asymmetry
6. Concentricity
7. Hinge state and angle — interaction and effect, never a layout breakpoint
8. Designing per posture without building six apps

---

## 1. Anatomy `[A]`

- **Outer display:** used when the device is closed; **wider and shorter** than a traditional iPhone. Its front camera sits in a corner and is **always visible**.
- **Inner display:** the large canvas when open; its front camera is **under the display** and shows only when activated.
- **Hinge / folding region:** affects usable space when partly folded; not a fixed decorative line.
- **Side system region:** in many configurations Dynamic Island, status, the app toolbar/navigation and the tab bar share **one vertical axis on the side**.
- Closed, Duo is compact, familiar and fits the hand; open, it is the largest iPhone canvas yet still pocketable (video 111466 @ 00:28).
- On the outer display, top/bottom controls move to the **right** edge to give content more height and to be easy to reach with the right thumb. **Left of the bar remains one continuous content area of roughly a traditional iPhone's size.**
- The side region holds tab bar, app toolbar, navigation, the new status bar and the Dynamic Island, which **extends vertically** when a Live Activity appears.
- Inner landscape keeps the side controls to preserve logic and reachability.

Wireframe of `images/01-iphone-duo-overview.png` (Apple, iPhone Duo open, Home Screen):
```text
+-------------------------------++-------------------------------------+
|                               ||                 (o) inner cam    9:41|
|  +-------------------------+  ||  +-----------+ +-----------+   (wifi)|
|  |                         |  ||  | Weather   | | Maps      |         |
|  |   PHOTO WIDGET          |  ||  | widget    | | widget    |  +----+ |
|  |   (large, tall)         |  ||  +-----------+ +-----------+  |Ph  | |
|  |                         |  ||  [app][app][app][app]         |Saf | |
|  |                         |  ||  [app][app][app][app]         |Msg | |
|  |  "On This Day"     (>)  |  ||  [app][app][app][app]         |Mus | |
|  +-------------------------+  ||  [app][app][app][app]         +----+ |
|                               ||            . .                 (Q)  |
+-------------------------------++-------------------------------------+
          left region          fold          right region      side axis
```
Shows: the fold splits the inner display into two usable regions and no widget crosses it; status, Wi-Fi and the dock stack **vertically on the outer (right) hardware edge**; the inner camera sits near the top, by the fold.

## 2. The postures `[A]`

The continuum (full list in `duo-foundations.md` §3): closed/outer · fully open (flat) · book (vertical fold) · tabletop/laptop (horizontal fold) · tent/standing on edge · half of Split View · window shrunk by PiP/keyboard/system surface · resized in iPhone Mirroring or on iPad. Main poses named by Apple: **book, tabletop/laptop, standing on its edge**. Always name poses with the plain-language Vietnamese names + Apple term (`duo-foundations.md` §6).

Wireframe of `images/02-iphone-duo-poses.jpg` (Apple, three typical poses):
```text
 TENT / STANDING            BOOK (vertical fold)                         TABLETOP (horizontal fold)
 /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\          +---------------------++-----------------+    +---------------------------+
/  Wed Apr  [clock]\        |(≡)  [card] [card]   ||  9:41 (wifi)     |    |                           |
| 1   12           |        |     [card] [card]   ||  msg header   (<)|    |   VIDEO (workout class)   |
| cal  9 · 3       |        |     [card] [card]   ||  "Misty..."   (^)|    |   view-from-afar half     |
|      6           |        |(Q)                  ||  body text    (v)|    |                           |
+------------------+        |(✎)  2 even columns  ||  image     (trash)|   +===== horizontal fold =====+
 glanceable face            |  list pane          ||  (folder)(reply)(✎)|  | ◦ ◦    ▮▮ playback   ◦ ◦  |
 seen from afar             +---------------------++-----------------+    +---------------------------+
                             list toolbar on left   detail toolbar is the     touch half: controls
                             pane edge              vertical bar on the
                                                    outer right edge
```
Shows: tent = large glanceable content; book = list–detail split along the fold, list in **two even columns**, the detail's toolbar becomes the **vertical side bar on the outer hardware edge** (Back, previous/next, then Delete, Move, Reply, Compose) while list actions stay on the list pane; tabletop = content to watch on top, controls near the hand below.

## 3. Size classes per display `[A]`

| Configuration | Horizontal | Vertical | Note |
|---|---|---|---|
| Outer portrait | compact | regular | |
| Outer landscape | compact | compact | landscape is worth supporting: people can stand Duo as a tent |
| Inner display | regular | regular | wider regular space, room for multi-pane hierarchy such as a sidebar |
| Split View, PiP, keyboard, resize | — | — | can produce other narrow/short combinations |

- Each display has its own size class; the hinge and both cameras keep shaping the usable area.
- The outer display handles interface orientation like other iPhones. The **inner display does not follow the supported-interface-orientations list** the way an app might expect on a traditional iPhone.
- Size class is a **layout signal, not a device identity**: `regular` ≠ "iPad", `compact` ≠ "traditional iPhone"; orientation is not enough to decide layout. Use size class and local space; never use the device name as a breakpoint.
- `[C]` Design for two size classes — compact width (outer) and regular width (inner) — not for poses (video 111466 @ 03:42; see §8).

## 4. Reserved regions `[A]`

A reserved region is an area interactive content must avoid or a component must adapt to. On Duo:
1. **Outer camera region** — always present; can expand into Dynamic Island / Live Activity. Vertical toolbars/tabs are laid out inside the new safe area beside it.
2. **Inner camera region** (inner FaceTime camera) — exists **only while the camera is active**; UI moves away so the camera's presence is obvious. If a viewfinder is the focus, keep important content/controls out of the camera region.
3. **Folding region** — conditional; when folded it splits the inner display into several usable regions and removes the curved middle from the interactive area. An image or UI spanning the fold loses continuity like a picture across a book's spine.

Two kinds of region (video 111463 @ 06:39):
| Kind | Example | Behaviour |
|---|---|---|
| **Division region** | fold | active when folded; when flat it is **inactive and has width 0**. An inactive division is still useful for rules such as "prefer even column counts on a device that can be split". |
| **Occlusion region** | camera | does not divide the area; only covers a small frame inside the bounds. Inner camera region is active while the camera is active, inactive when off. |

- Regions can be active or inactive; by default only active ones are reported; inactive ones can be queried for higher-level decisions.
- SwiftUI reads regions through geometry, UIKit through the view; regions are reported **in the layout's local coordinates**, not as a global "hinge width".
- iOS 27.1 adds `ReservedRegion` (SwiftUI) and `UIViewReservedRegion` (UIKit): lets custom UI use space beyond the safe area without colliding with system UI. Suited to custom bars and edge-to-edge interfaces; **not** a reason to ignore the safe area app-wide.
- **Priority order** (video 111461 @ 08:08): standard bars first → foreground follows safe area → background may go full bleed → handle each edge independently → use reserved-region APIs only when a complex layout truly needs them.
- `[C]` A reserved region is dynamic state. **Never draw a fixed "hinge spacer" in every frame.** When flat, the folding region may be inactive / zero-width; when the inner camera is off, the camera region must not leave an unexplained hole.

## 5. Safe area, layout margins, full bleed `[A]`

- Background, images or video may run edge-to-edge (behind toolbars/sidebars to the bounds).
- Text, CTAs, fields, drag handles and every interactive element follow the safe area / suitable margins.
- Navigation bar, toolbar and tab bar sit **outside** the safe area and avoid status bar and camera automatically. **Horizontal bars create top/bottom insets; vertical bars create leading/trailing insets.**
- The safe area is often **asymmetric** and can change per edge: in landscape and Split View the vertical bar may be on the left. Never take the left inset and mirror it to the right.
- Layout margins are deliberately asymmetric too: foreground may come closer to the vertical buttons/status while the opposite side keeps its margin.
- Test both sides of Split View (drag via the home indicator) — vertical content can appear on either edge.
- Continuous scroll content may pass across the fold if reading stays natural; interactive controls and point content avoid the fold.
- **Outer display asymmetry** (video 111466 @ 06:33): most content must be offset so side controls don't cover it — horizontal safe-area insets do this automatically. **Immersive, highly visual, non-scrolling UI** may centre on the full display if no interactive item is covered by the bar or conflicts with camera/status. A **mixed model** often works best: background/header full width, foreground scroll content inset — and every interactive element of the mixed model stays inside the safe/inset scroll area.

## 6. Concentricity `[A]`

Sheets, cards or surfaces near the hardware need corner radii **concentric** with the device curve. Do not copy a fixed radius from a screenshot. Use the geometry / system container so the outer-edge/inner-edge relationship stays right when the display or pose changes. Implementation: `ConcentricRectangle` (SwiftUI) or `UICornerConfiguration` (UIKit); the iOS 26 concentricity APIs are updated for Duo's shape.

## 7. Hinge state and angle `[A]`

- The system provides closed / partially open / fully open state plus a continuous fold angle: SwiftUI `onHingeChange`, UIKit `UIHingeInteraction`; updates are live.
- Use it for: physical effects or animation; adjusting interaction by angle; sensory feedback; special use cases that need to know how the device is set down.
- A hinge may not exist on other devices: interactions need a fallback and must reset state when the angle is no longer readable.
- **Never use 73°, 90° or 120° as a primary layout breakpoint.** Layout is decided by geometry, size class and reserved regions, because the same angle can produce different usable areas. Layout uses arrangement and reserved-region APIs; the hinge API is for interaction/effect only.
- Example (video 111464): a guitar app turns the fold angle into pitch bend like a whammy bar — the value is the direct physical link between folding and the sound, not "detecting a breakpoint".

Wireframe of `images/10-video-multiple-displays.jpg` (guitar example):
```text
+------------------------------\  /---------------------------------+
|  [guitar BODY + pickups,      \/   NECK / frets continue across   |
|   knobs]  ====================||=================================  |
|                               ||  (fold angle = whammy-bar bend)   |
+-------------------------------++----------------------------------+
```
Shows: a hinge-driven effect, where the fold is an input. The layout itself stays geometry-driven.

## 8. Designing per posture without building six apps

`[A]` You do not need a custom layout per pose. Focus on compact width (outer) and regular width (inner); avoid fixed widths, breakpoints or metrics tied to a specific screen; use layout margins and horizontal safe-area insets; the goal is **freely resizable**. A hands-free tabletop layout (media top, controls bottom) is allowed, but a pose-specific layout keeps the **same controls and hierarchy**; never lock functionality to a pose.

`[A]` Fold behaviour (video 111466 @ 02:03): in book pose the display curves in the middle; text/images move off the curve automatically and interactive elements move to the sides — the fold becomes a natural layout boundary. Tabletop portrait moves interactive elements to the lower half to fit the hand and keep the device stable.

### 8.1 Closed / outer display — goal: compact, familiar, one-handed `[C]`
- prefer one hierarchy level;
- inset content for the asymmetric bar/camera;
- primary action in a reachable position;
- audit cover-image crops (wide, short screen);
- tab/toolbar has a clear overflow strategy;
- do not cram a two-pane layout in just because it is wide.

### 8.2 Fully open / inner display — goal: use space for context and efficiency `[C]`
- reveal list–detail, a supporting pane or a sidebar when sensible;
- add columns/grid but keep readable width;
- never stretch one phone column across the full width;
- keep the same selection and task as on the outer display;
- allow multiple instances/windows if the app benefits from comparison or multitasking.

### 8.3 Book pose (vertical fold) — goal: the fold as a natural boundary between two related regions `[C]`
- balance panes around the fold;
- no buttons/menus on the curve;
- move related groups together;
- point text or images are not split by the spine;
- long scroll content may cross the fold if readability holds.

### 8.4 Tabletop / laptop pose (horizontal fold) — goal: hands-free, look-vs-touch roles `[C]`
- top: video, preview, participants, content to watch;
- bottom: playback, capture, keyboard, editing controls;
- keep controls stable in the half near the hand;
- no feature exclusive to tabletop if people still need it in other poses.

### 8.5 Tent / standing — goal: glanceable, remote/hands-free, several viewing angles `[C]`
- large content readable from afar;
- no dependence on small buttons near the fold;
- decide which face/scene is primary;
- always a fallback if the accessory / second display is unavailable.

### 8.6 Custom posture-specific UI `[C]`
Allowed when a pose creates a clear use case — teleprompter, capture preview, tabletop player — but it must:
- keep overall functionality and hierarchy;
- not change the action vocabulary;
- not use the hinge angle to decide the main layout;
- behave well when the pose changes mid-task;
- not lock people into a single way of holding the device.

Per-pose placement for camera apps: `duo-camera-layout-controls.md` §3–§8. Per-pose reach and occlusion: `duo-ergonomics-motion-input.md` §1.
