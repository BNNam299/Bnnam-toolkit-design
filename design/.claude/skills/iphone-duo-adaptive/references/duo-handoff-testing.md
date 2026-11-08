# Device Hub testing, adaptive handoff, phase checklists and anti-patterns

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §15 (fig. 13–14), §16.1–16.3, §17, §18, §20.9–20.10, §23.7 @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). When a custom component is allowed: [duo-components.md](duo-components.md) §14. Camera-only test matrix: [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md) §7. The general review / handoff method lives in `../ux-review-handoff/SKILL.md`; this file adds what is specific to adaptive layouts.

## Contents
1. Device Hub — what it is and what it gives UI work
2. Minimum test matrix
3. Continuity test scenarios
4. Reproducible UI bug reports (Device Hub workflow, `devicectl`)
5. Never hand off artboards only — the adaptive behaviour spec
6. Component contract
7. Just-enough developer awareness for designers
8. Checklists per phase (discovery → handoff)
9. Anti-patterns and fixes

---

## 1. Device Hub — what it is and what it gives UI work `[A]`

Apple illustrations: Device Hub on the iPhone Duo page brings real devices and simulators together, including the Duo simulator (fig. 13, Apple — iPhone Duo); the Device Hub interface in the WWDC26 session *Get the most out of Device Hub* (fig. 14).

In Xcode 27, Device Hub is a separate app to manage and interact with real devices and simulators. It ships with Xcode 27 but runs on its own, for developers, testers and device-inventory managers. Real devices and simulators share the same tools and configuration. Running a simulator from Xcode opens Device Hub automatically with a live, interactive screen.

Two main modes:
- **Compact** — a small window holding the screen and essentials, so several devices / simulators can sit side by side for comparison; device controls at the bottom change with the device type.
- **Full** — expanding gives a full window with canvas, sidebar and inspector: interactive screen, properties, settings, diagnostics, context controls.

Capabilities that matter for UI:
- view and operate the live screen; click, drag, scroll and trackpad gestures behave the same on device and simulator; context controls stay at the bottom;
- rotate, home, lock and hardware controls per device;
- zoom in/out for pixel detail; **1:1 physical size** to judge real size, reachability and density;
- **resize** the iOS simulator freely to find intermediate breaking points;
- open / close / rotate / fold the Duo simulator;
- change appearance, Dark Mode and text size instantly;
- simulate location / audio (level and I/O) and some device states;
- capture screenshots and compare several configurations;
- **Capture Keyboard** sends Mac keystrokes straight to the device — needed for focus order, shortcuts and hardware-keyboard support;
- organise: the sidebar holds the whole device / simulator inventory with filter, sort and group; context-click for quick actions (restart, pair simulator); open several devices in tabs or independent compact windows. Select several phone sizes and open them together for a comparison setup — use it for regression instead of testing one after another from memory;
- inspector groups: settings, diagnostics (crashes, spins, related logs), info (storage, model, serial), apps (install / uninstall, download / replace the **app data container**), profiles (configuration / provisioning profiles). For UX QA the data container matters: content length / state can be part of the condition that reproduces a bug;
- automate with **`devicectl`** (same foundation as Device Hub): list devices, install apps, switch Dark/Light, read device info, collect diagnostics; JSON output feeds scripts or CI — the bridge from a manual checklist to an automated visual-regression matrix.

What to put into the QA process `[A]`: Device Hub for resizability, appearance, text size, real device / simulator and bug reproduction; `devicectl` when the matrix must repeat or run in CI; bug reports contain the **combination** of conditions, not only the screen name and a final screenshot.

## 2. Minimum test matrix `[T]`

| Axis | Cases to test |
|---|---|
| Display | outer, inner |
| Pose | closed, fully open, book partial fold, tabletop, tent if the use case has it |
| Size | compact / regular and several intermediate resize points |
| Multitasking | full screen, Split View left, Split View right |
| Interruption | keyboard, PiP, Live Activity / Dynamic Island when relevant |
| Appearance | light, dark, glass clear, glass tinted |
| Accessibility | default text, large text, Reduce Transparency, Increase Contrast, VoiceOver |
| Language | Vietnamese, English, one long language, RTL |
| Content | empty, normal, long text, extreme data, error, offline / loading |
| Lifecycle | closing / opening while editing, playing, capturing, with a sheet open or the keyboard active |

## 3. Continuity test scenarios `[T]`

1. Open a detail on the outer display → open the device → the detail stays selected and the list appears sensibly.
2. Type in a form / draft → fold / unfold → focus, keyboard and text are not lost.
3. Open a sheet / menu → partially fold → the presentation avoids the fold and keeps its context.
4. Playing a video → turn on PiP → resize / fold → playback and controls stay stable.
5. App in Split View left → move it to the right → safe area / bar correct on both edges.
6. Camera recording → change display / pose → preview, orientation, state and mirroring correct.
7. Turn on the inner camera → the UI yields the inner camera region; turn it off → the gap disappears.
8. Raise text to an accessibility size → the bar overflows sensibly, no action lost.
9. Move the glass slider and turn on Reduce Transparency → controls stay readable.
10. Create a second scene → each scene keeps its own selection / draft.

## 4. Reproducible UI bug reports `[A]` / `[T]`

A good bug report stores:
- device / simulator and OS build;
- app build / SDK;
- display, pose and enough angle / geometry description;
- window size / Split View side;
- appearance, text size, accessibility settings;
- content / data state;
- orientation and active camera / display when relevant;
- the open / close / resize steps;
- screenshot or screen recording before, during and after the bug.

Many adaptive bugs appear only under a specific combination — e.g. "outer landscape + keyboard + large text + Live Activity" — so writing just "Duo" is not enough.

Apple's worked example (WWDC26/260) `[A]`:
- **Report on a real device:** a Workout app truncates text in landscape; the feature depends on altitude, so content changes with location. The reporter pairs the device, installs a logging profile, reproduces the bug, takes a screenshot, runs sysdiagnose, copies the truncated text and downloads the app data container (it can be inspected in Finder, restored to a baseline or snapshotted). Lesson: a screenshot alone is not enough — real content, data state, orientation and system configuration are needed.
- **Reproduce on the simulator:** pick a simulator of the same model (confirm in the Info panel) → replace its data container with the reporter's data so content / state match → mirror the configuration: landscape, Johannesburg location, large text size. Only when all three conditions are present does the truncation appear; none of them alone reproduces it. Device Hub turns combination testing into a repeatable workflow, and the fix is then easy to verify on the same baseline.

## 5. Never hand off artboards only — the adaptive behaviour spec `[T]`

Every screen / flow gets an **adaptive behaviour spec** with:
- primary content and hierarchy;
- what stays the same at every size;
- what reveals / collapses / reflows / overflows;
- the compact and the regular model;
- content-driven max / min widths — not tied to a device model;
- safe-area / full-bleed behaviour of every layer;
- response to the fold, the camera and the side bar;
- state preservation on resize;
- action priority in the toolbar / tab bar;
- interaction with keyboard, PiP, sheets and multitasking;
- accessibility variants.

## 6. Component contract `[T]`

Every important component records:

| Property | Content |
|---|---|
| Role | navigation, global action, contextual action, content or decoration |
| Size behaviour | fixed intrinsic, flexible, max-width, wraps, scrolls |
| Axis behaviour | horizontal only, vertical preferred, or its own variant |
| Priority | must remain visible, group priority, overflow allowed |
| Safe behaviour | follows safe area, full bleed, avoids reserved region |
| State | default, pressed, selected, disabled, loading, error, badge |
| Continuity | how state / selection / focus survive reparent / reflow |
| Accessibility | label, value, order, large text, contrast, reduced motion / transparency |

The project component file format is in `../design-system-audit/references/component-spec.md`.

## 7. Just-enough developer awareness for designers `[A]`

Implementation concepts a designer needs to spec correctly:
- SwiftUI `NavigationSplitView` and UIKit `UISplitViewController` handle responsive hierarchy better than custom frames.
- `ArrangementView` / `UIArrangementViewController` solve split / overlay from geometry and reserved regions.
- `safeAreaInsets`, layout margins and reserved-region APIs are **dynamic** data.
- `ToolbarItemGroup` / `UIBarButtonItemGroup` keep grouping; visibility priority and system overflow arrange items when space runs out.
- `toolbarVerticalEdge` or axis behaviour tells a custom control when it sits in a vertical bar.
- The scene lifecycle replaces the assumption "one app = one window".
- Environment / traits / current scene bounds are more correct for layout than `UIScreen.main`.
- Camera direction is judged relative to the view / display, not only the hardware position.

The designer need not prescribe code if the team has another architecture, but must describe the behaviour well enough for developers to choose the standard container instead of stacking exceptions.

## 8. Checklists per phase `[T]`

**Discovery / PRD**
- [ ] Does the app truly benefit from the inner display, or does it only need to resize without breaking?
- [ ] Are there list–detail, supporting-pane, overlay or dual-display use cases?
- [ ] Which pose creates new value, which only needs continuity?
- [ ] Are there edit / play / capture tasks that must keep state across open / close?
- [ ] Are several scenes / windows needed?
- [ ] Is the scene accessory supplementary, or does it hold a required function?
- [ ] Does camera / display direction affect the mental model?

**UX flow**
- [ ] The same flow completes on outer, inner and in Split View.
- [ ] Compact ↔ regular keeps selection, draft, progress and undo context.
- [ ] Revealing more hierarchy does not change the meaning of Back / Close / Done.
- [ ] Sheets / menus / alerts have a clear origin and return point.
- [ ] Losing the accessory or opening a new scene never leads to a dead end.
- [ ] Pose-specific features have a fallback.

**Wireframe**
- [ ] At least compact, regular and one intermediate resize.
- [ ] Book / tabletop when the product benefits.
- [ ] Full-bleed layers and safe content layers are marked.
- [ ] Dynamic reserved regions are marked — not turned into fixed spacers.
- [ ] The grid uses a column count and spacing that divide sensibly around the fold.
- [ ] Forms / text have a max width; a large canvas is not just stretched.
- [ ] Controls sit near the pane / content they act on.

**Visual design**
- [ ] Brand concentrates in content, not painted over system chrome without reason.
- [ ] Liquid Glass is not overused in the content layer.
- [ ] Contrast tested on moving backgrounds and glass clear / tinted.
- [ ] Light / Dark and Reduce Transparency have correct variants.
- [ ] Custom fonts support Dynamic Type and Vietnamese.
- [ ] Icons are clear at small sizes and follow iOS conventions.
- [ ] Radius / surfaces near the hardware keep concentricity.

**Toolbar / tab / navigation**
- [ ] Every item has a fitting symbol / title.
- [ ] Back/Close, Done and item groups are in the right order.
- [ ] Visibility priority and overflow logic exist.
- [ ] Decided whether the screen prefers the toolbar or the tab bar when space runs out.
- [ ] Text / segmented / custom items that are too wide have a horizontal-bar fallback.
- [ ] No fixed spacers inserted between groups.
- [ ] The bar was tested on the left and the right edge in Split View.
- [ ] RTL does not mirror the hardware edge wrongly.

**Prototype**
- [ ] Continuous resize, not just jumps between two frames.
- [ ] Fold / unfold shows small, trackable displacement.
- [ ] Pane reveal / collapse keeps selection.
- [ ] Sheets / menus avoid the fold.
- [ ] Keyboard / PiP shrink the layout correctly.
- [ ] Camera switch shows preview, mirroring and active state.

**Accessibility**
- [ ] Large Dynamic Type loses no action.
- [ ] VoiceOver focus stays sensible after resize.
- [ ] Reduce Motion still keeps feedback and continuity.
- [ ] Reduce Transparency / Increase Contrast still separate the layers.
- [ ] Touch targets avoid the fold / curve / system-gesture edge.
- [ ] Gestures have an alternative action.

**Handoff / acceptance criteria**
- [ ] The spec describes behaviour, not just coordinates.
- [ ] States that persist across scene / resize are named.
- [ ] The proposed container pattern and its reason are named.
- [ ] Overflow / group priority is named.
- [ ] There is a Device Hub test matrix.
- [ ] There are screenshots / videos of the extreme states.
- [ ] No hard-coded model, orientation or screen bounds.

## 9. Anti-patterns and fixes `[T]`

| Anti-pattern | Why it is wrong | Fix |
|---|---|---|
| Drawing one fixed Duo artboard | ignores resize, Split View, PiP, keyboard and intermediate poses | design by container and state transition |
| Cloning the iPhone screen onto the large canvas | wastes hierarchy, creates meaningless empty space | reveal pane / context, limit readable width |
| A separate layout per fold angle | many branches, easy loss of continuity, fragile | size class + reserved region + arrangement |
| A permanent hinge spacer | the hinge is only a conditional reserved region | use the region the system reports |
| Pushing every control into the side bar | loses proximity to its pane / content | only global / trailing-container controls go to the edge |
| A custom overflow of your own | the user must search two places | merge into the system overflow; keep the ellipsis for overflow |
| Keeping full toolbar and tab bar at any cost | cramped items, smaller hit targets, the bar competes with status | choose priority, minimize or overflow |
| Centring content on the full display | vertical controls cover content; asymmetry ignored | safe area for content; full width only for deliberate backgrounds / immersive UI |
| Using orientation / device idiom | does not reflect the real window geometry | size class, current bounds, traits |
| Using hinge angle as a layout breakpoint | the angle does not describe the usable area | geometry and reserved region decide layout |
| Testing only open / closed | misses bugs during transitions | test the continuum and intermediate sizes |
| Branding navigation too strongly | breaks convention, lowers learnability | brand in content; familiar system chrome |
| Glass on every card | messy hierarchy, unstable contrast | standard material / content surface; glass for floating functional UI |
| A camera button that only says "flip" | unclear which camera / display becomes active | preview + state + label by direction / purpose |
| The only call to action lives on the accessory | the function is lost when the accessory is unavailable | the accessory supplements; the main task has a fallback |
