---
name: apple-design-ipad
description: Apple HIG standard for designing and reviewing iPad screens — size classes instead of device checks, full-screen vs windowed apps and resizable windows, multitasking, tab bar at the top that converts to a sidebar, sidebars and two- or three-pane split views, popovers vs sheets by width, pointer / trackpad / keyboard / Apple Pencil input, plus exact iPadOS 27 kit numbers (frames 1210 × 834, 1376 × 1034, 1133 × 744, margin 20, status bar 32, sheet radius 32) and iPad kit components. Use whenever a screen targets iPad or must adapt to a wide or resizable window — designing, building in Figma, or reviewing — including Vietnamese requests such as "thêm bản iPad", "màn này trên iPad thế nào", "chia hai pane", "làm sidebar iPad", "iPad xoay ngang", "app chạy khi thu nhỏ cửa sổ". For iPhone rules and the full HIG digest use apple-design-iphone; for iPhone Duo and fold postures use iphone-duo-adaptive; for the screen build loop use figma-ui-flow.
---

# apple-design-ipad — iPad screens per Apple HIG (iPadOS 27)

This skill is the **iPad platform standard**: what changes when the same app runs on a large, resizable canvas. Everything the
iPhone skill says about type, colour, Liquid Glass, bars, sheets and accessibility still applies — this skill only adds the iPad layer.
- **Shared iOS / iPadOS rules and the HIG digest:** `../apple-design-iphone/SKILL.md`, `../apple-design-iphone/references/ios-platform.md`.
- **Exact kit numbers and component names:** `../apple-design-iphone/references/ios27-figma-kit.md` (iPad columns and components).
- **How to build a screen:** `../figma-ui-flow/SKILL.md` · **Figma tools:** `../figma-agent-tools/SKILL.md`.
- **Verbatim Apple pages** (Apple wins over this summary): `../apple-hig/references/<page>.md`.
- Neighbours: iPhone Duo, fold postures, adapting one screen to many geometries → `../iphone-duo-adaptive/SKILL.md` · team frame
  standards (Safe-Area set, frame suffixes) → `../bnnam-standards/references/frame-standards.md` · Android tablets →
  `../material-design-3/SKILL.md`.

## Need → Read

| Need | Read |
|---|---|
| Device traits and iPad best practices | `../apple-hig/references/designing-for-ipados.md` |
| Size classes, adaptability, safe areas | `../apple-hig/references/layout.md` §Adaptability, §Size classes |
| Full screen vs windowed, window controls, new windows | `../apple-hig/references/windows.md` §iPadOS · `multitasking.md` §iPadOS |
| Tab bar at the top, tab bar ↔ sidebar | `../apple-hig/references/tab-bars.md` §iPadOS · `sidebars.md` |
| Split view (2–3 panes), selection, drag between panes | `../apple-hig/references/split-views.md` |
| Sheets, popovers, action sheets on iPad | `../apple-hig/references/sheets.md`, `popovers.md`, `action-sheets.md`, `activity-views.md` |
| Trackpad / mouse, keyboard, Apple Pencil | `../apple-hig/references/pointing-devices.md`, `keyboards.md`, `apple-pencil-and-scribble.md`, `drag-and-drop.md` |
| iPad frame sizes, Dimensions (iPad mode), iPad components | `../apple-design-iphone/references/ios27-figma-kit.md` §2, §4.2, §6 |
| Team Safe-Area values, frame suffix `_iPad`, wireframe scope | `../bnnam-standards/references/frame-standards.md`, `naming.md` |
| Layout transformations when width changes (reflow, split, reveal…) | `../iphone-duo-adaptive/SKILL.md` |

Do not read everything at once: the core rules below cover most iPad screens; open the Apple page for the component you are judging.

## Core rules (apply even without opening a reference)

### 1. What iPad is
- Large, high-resolution display; usually within about **3 feet** — held, set on a surface, or on a stand.
- Input is combined: Multi-Touch, virtual or attached keyboard, trackpad / mouse, Apple Pencil, voice.
- Sessions range from quick actions to hours of media, games, creation or productivity; several apps are often onscreen at once,
  with drag and drop between them.
- Apple's four priorities: **elevate content** on the large display (fewer modal and full-screen transitions, controls easy to reach
  but not in the way) · set **size and density from viewing distance and input mode** · support **every input mode** and combinations
  · **adapt seamlessly** to orientation, multitasking, Dark Mode, Dynamic Type and running on Mac.
- iPad sits between iPhone (narrow, focused task) and Mac (wide, dense): it scales from focused utility to expansive canvas with **one
  shared anatomy** — not a new product per device.

### 2. Layout by size class, never by device
- Each axis is **compact** or **regular**; the system sets them from device, window configuration and multitasking state. An iPad app
  can be in **every combination** — `regular` does not mean "iPad", `compact` does not mean "iPhone".
- Decide layout from size class, not orientation or device type (idiom). Consider all combinations, in portrait and landscape.
- **Same functionality at every size**; only how much is visible changes. Larger space → tab bar becomes sidebar, overflow-menu items
  come out. The idiom stays: the layout remains recognisably iPad while resizing.
- Don't stretch one phone column: add panes, an inspector or a toolbar. Cap the width of forms and long text (readable width — kit
  `Readable Content Margin`).
- Background artwork scales to fill (never change its aspect ratio); very wide or tall windows reveal more of it.
- An iPhone app can also be resized on iPad or in iPhone Mirroring — the same rules make it work there.

### 3. Windows and multitasking
- People choose **full screen** (app switcher between windows) or **windowed** (freely resizable, overlapping, positions remembered).
  Apps neither control nor learn which one is used.
- Windowed apps get **window controls at the leading edge of the toolbar** — don't put buttons right at the leading edge; move them
  inward when the controls appear.
- Support **multiple windows**; consider a gesture (e.g. pinch) to open content in a new window.
- Survive resize and loss of focus: state never resets when the window shrinks or grows; background work reflects its state on return.
  Video and FaceTime may float in Picture in Picture above everything.
- Design and check at **narrow, compact and intermediate widths**, not only full screen.

### 4. Navigation
- The iPad **tab bar sits near the top**. It is fixed, or (sidebar-adaptable style) has a button that converts it to a sidebar; the
  style adapts to rotation and window width by itself. **Prefer the tab bar**; offer the sidebar for apps with more sections.
- Tabs may be customisable; keep the **default list ≤ 5** so compact and regular sizes stay continuous.
- Sidebar only (no tab bar option) → a split view with the sidebar in the primary pane.
- Sidebar: content can extend beneath it (horizontal scroll or **background extension effect** — sidebars float on Liquid Glass) ·
  let people customise its items · group with disclosure controls when long · familiar SF Symbols (custom symbol, not bitmap) · let
  people hide it with the edge swipe, but **don't hide it by default** · **no more than two levels** of hierarchy — deeper data needs a
  split view with a content list · short group labels · icon colours only with a clear purpose (default = app accent).

### 5. Split views
- Two vertical panes (Mail) or three (Keynote). Navigation between panes must stay logical at every width.
- **Persistently highlight the current selection** in each pane that leads to the detail view.
- Consider drag and drop of content between panes.

### 6. Presentation
- Sheets follow the iOS rules (Cancel leading, Done trailing; multi-step flows swap Cancel for Back). Kit `Sheet - iPad`: radius
  **32**, toolbar buttons inset **10**.
- **Popovers only in wide (regular) views**; in compact views use a sheet / full-screen modal instead. Popovers are iPad-only in the kit
  (`Edge` 12 positions) and must not cover their source.
- Action sheets and share sheets (activity views) on iPad **anchor to the control that opened them**.
- Context menus may be horizontal on iPad (kit `Alignment = Horizontal (iPad only)`).

### 7. Pointer, keyboard, Pencil
- Pointer gestures behave as they do system-wide; never redefine system trackpad gestures.
- One consistent experience across touch, pointer, keyboard (and eyes): same result whichever input performs an action, including
  modifier-key behaviour.
- The pointer can reveal controls that auto-minimise or fade (minimised toolbar, video playback controls).
- Hover, right-click / context menu, keyboard navigation and shortcuts, resize and multi-window all work; a **focus ring is distinct
  from hover**; selection is distinct from both.
- Special inputs (Apple Pencil, Scribble) add value but always have a touch path.

### 8. Kit numbers (iOS and iPadOS 27 kit, iPad mode)
| Item | iPad value |
|---|---|
| Example frame (iPad Pro 11", landscape) | **1210 × 834** |
| iPad Pro 13" · iPad mini (bezel components) | 1376 × 1034 · 1133 × 744 |
| Margin | **20** (iPhone 16) |
| Status bar height | **32** |
| Sheet radius top / bottom | **32 / 32** |
| Popover radius · grabber | 38 · 60 × 4 |
| Home indicator portrait / landscape width · height | 273 / 315 · 5.5 |
| Menu item title size · line height · padding top+bottom / sides | 15 · 18 · 11 / 8 |

Components: `Toolbar - Top - iPad` (`Tab Bar = True/False`, Show Search) · `Toolbar - Bottom - iPad` (Leading / Center / Trailing slots)
· `Tab Bar - iPad` (Show Sidebar, Show Search) · `Sheet - iPad` · `Sidebar` (`Floating Window`) · `Window with Sidebar`
(Active / Inactive) · `Status bar and Menu bar - iPad` · `Index Bar` (`Device = iPad`). Place kit instances; never redraw system controls.
Full tables: `../apple-design-iphone/references/ios27-figma-kit.md`.

### 9. Team standard for iPad frames (designer standard wins over tool-demo defaults)
- Safe-Area set variant `Device = iPad`: **Top 32 / Bottom 20** — Top from Apple; Bottom is provisional until measured on Device Hub.
  The screen's status bar and Safe-Area variant must be the iPad ones (`frame-standards.md`).
- iPad frames are named with the suffix `_iPad` / `_iPad Landscape` and live in their own section, cloned from the phone screen and
  then restructured — never stretched (`naming.md`, `../iphone-duo-adaptive/SKILL.md`).
- **Wireframes are phone (compact) only**; iPad layouts are built at UI stage, or by the user as variables and modes.
- The team has **no fixed packaging yet for an iPad frame** (Top / Content / Bottom containers vs panes) — propose one, say it is an
  assumption, and let the designer confirm on the first iPad screen.

## Workflow (designing or reviewing an iPad screen)
1. Confirm targets: iPad only, or also iPhone / Duo / Mac. Load `apple-design-iphone` for the shared rules.
2. List the widths that matter: full-screen landscape and portrait, plus windowed narrow / compact / intermediate. Note which size
   classes each produces.
3. Pick navigation: top tab bar (≤ 5 default tabs) · sidebar-adaptable · split view (two or three panes) — from the information
   depth, not from "it's a big screen".
4. Build with figma-ui-flow's loop on a `_iPad` frame (1210 × 834 unless the file already uses another iPad size); kit instances for
   bars, sidebar, sheets.
5. Stress: shrink the window to compact width (does it collapse to one column, keep the selection, keep every function?), pointer
   hover and context menu, keyboard focus, Dark Mode, AX5 text.
6. Review against the self-check; cite the Apple page for any violation.

## Common pitfalls
- A phone layout stretched to 1210 pt wide; forms and text lines running the full width.
- Layout switched on "is iPad" or orientation instead of size class; features missing in a narrow window.
- Buttons at the leading edge of the toolbar hidden by window controls.
- Popover shown in a compact window; action sheet not anchored to its source.
- Sidebar hidden by default, or three-plus levels of hierarchy crammed into it.
- Selection lost or state reset after a resize or rotation.
- Hover used as the only way to reveal something; focus ring and hover look the same.
- Wireframes drawn for iPad (team rule: phone only).

## Self-check before reporting
- [ ] Layout decided per size class; checked at full screen and at least one compact and one intermediate window width.
- [ ] Same functions at every width; only visibility changes.
- [ ] Navigation choice justified (tab bar ≤ 5 default / sidebar ≤ 2 levels / split view) and selection persistently highlighted.
- [ ] Nothing at the toolbar's leading edge that window controls would cover.
- [ ] Popovers only in regular width; sheets and action sheets correct and anchored.
- [ ] Pointer, keyboard and touch give the same results; focus ring ≠ hover.
- [ ] iPad kit values used (margin 20, status bar 32, sheet radius 32); iPad status bar and Safe-Area variants; frame suffix `_iPad`.
- [ ] Any Apple rule you cited exists in `../apple-hig/references/`.
