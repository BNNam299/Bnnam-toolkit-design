<!-- Source: https://m3.material.io/foundations/layout/scaffold · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__layout__scaffold.md @ 3c0e291 -->

# Scaffold

A fundamental UI design structure that provides a standard platform for assembling key components

## Overview

- The layout scaffold structures every piece of an adaptive layout into bars, rails, and panes
- Bars can frame the page to help people navigate through a product
- Rails create the perimeter space surrounding panes, creating space for elements like navigation and toolbars
- Panes hold a product’s primary content, adapting to breakpoints (previously window size classes) and other conditions

### Availability & resources

| Type | Resource | Status |
|---|---|---|
| Design | [M3 Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
|  | [Spacing system & tokens](https://m3.material.io/styles/spacing) | Available |
| Implementation | [Jetpack Compose: Rulers](https://developer.android.com/reference/kotlin/androidx/compose/ui/layout/Ruler) | Available |

*[image: 2 diagrams of mobile and desktop layouts, identifying the parts of a scaffold.]*
1. Safety region
2. Bar
3. Pane
4. Rail

## Bars

### Bars

Bars frame the screen to help people navigate through a product. They typically contain an app bar or bottom navigation bar.

Bars can span a single pane or across the full width of a window.

*[image: Navigation bar on mobile and app bar on desktop.]*
1. A navigation bar occupies the bottom bar region on mobile
2. An app bar occupies the top bar region on the web

App bars are placed at the top of the screen to help people navigate, providing a title and 1–2 essential actions like search or back.

*[image: A photo app with an app bar below the safety region and above a grid of photos.]*
1. The app bar sits at the top of the screen, outside of the safety region

Navigation bars let people switch between 3–5 primary UI views at compact or medium breakpoints.

*[image: A photo app with a navigation bar below a grid of photos.]*
1. The navigation bar sits at the bottom of the screen, above the safety region

#### Safety region

Bars are placed adjacent to the safety regions, which contain [system UI](https://developer.android.com/develop/ui/compose/system/system-bars) elements.

The safety region shouldn’t contain primary content.

*[image: A photo app with a safety region above an app bar and grid of photos.]*
1. The safety region—at the top and bottom edges of the screen on compact devices—protect system UI elements

## Rails

### Rails

Rails are the next level in layout after bars, filling the perimeter space surrounding panes or floating above them.

*[image: Rail regions highlighted, a bottom toolbar on mobile, and a leading and trailing rail on desktop.]*
Rails occupy the spaces immediately adjacent to bars:

1. A toolbar sits above the navigation bar
2. A navigation rail and companion rail occupy the leading and trailing sides of a large window

On compact screens, the top and bottom rail regions can be used for components like:

- Toolbars
- Chat inputs
- FABs
- Other primary controls related to an individual screen

*[image: A mobile photo app highlighting a toolbar above a navigation bar.]*
1. On mobile, a toolbar can float in the rail region

On larger screens, there are rails on the sides of the screen (as well as top and bottom). The leading side rail region commonly holds the navigation rail.

*[image: A photo app on desktop, highlighting an expanded navigation rail.]*
At larger breakpoints, the leading rail region can be occupied by an expanded navigation rail

The rail region on the trailing side of a large screen can hold supporting controls or actions that modify or relate to the content in a pane.

*[image: A photo app on desktop, highlighting a trailing vertical toolbar.]*
The rail region can also be occupied by a vertical toolbar or other controls

In [XR](https://m3.material.io/foundations/xr/design), rail components can become [orbiters](https://developer.android.com/design/ui/xr/guides/spatial-ui#orbiters), which float outside the visible content area.

*[image: A photo app in immersive XR, with a navigation rail floating outside the pane.]*
In full space, an XR navigation rail can float outside the main content as an orbiter

## Panes

### Panes

All layouts are made up of 1–3 panes. The type of layout and amount of panes you choose should depend on the breakpoint (previously window size classes) and the type of product being built.

*[image: A two-pane layout on desktop.]*
Layouts often include multiple panes that work together

All layouts are made up of 1–3 visible panes. The type of layout and amount of panes you choose should depend on the breakpoint and the type of product you're building.

| Breakpoint | Recommended pane total | Other pane totals |
|---|---|---|
| Compact | 1 | -- |
| Medium | 1 | 2 |
| Expanded | 2 | 1 |
| Large | 2 | 1 |
| Extra-large | 2 | 1, 3 |

Panes can be:

- Fixed: Width doesn’t change based on available space
- Flexible: Width changes based on available space, and can grow and shrink

All layouts need at least one flexible pane.

*[image: A device with 2 panes: 1 fixed and 1 flexible.]*
1. Fixed pane
2. Flexible pane

Panes can be permanent or temporary. Temporary panes can appear and be dismissed when necessary, affecting the layout and size of other panes.

*[image: 2 permanent panes.]*
Panes can be displayed permanently side by side

*[video: Right pane with a close button being dismissed. The left pane fills the available space.]*
Temporary panes can be dismissed

#### Single-pane layouts

Single-pane layouts use one flexible pane that extends to fit the available space in a layout’s width. They can be used at any breakpoint, but are recommended for compact and medium.

*[image: A mobile screen with 1 flexible pane.]*
A single flexible pane adapts to fit any breakpoint

#### Two-pane layouts

**Split-pane layout**

A split-pane layout keeps the spacer visually centered. It’s best for foldable devices and dynamic layouts.

When a navigation rail or drawer is present, it only reduces the size of one pane. The other pane remains at 50% of the window width.

*[image: 2 flexible panes in a split-pane layout.]*
The navigation and first pane should be 50% of the window width to keep the spacer centered

With a navigation bar, or no navigation, both panes span 50% of the window width by default.

*[image: 2 flexible panes at 50% width, with a navigation bar below them spanning the whole window.]*
With no navigation rail visible, split-pane layouts set each pane to 50% width by default

**Fixed-and-flexible layout**

This layout is common for expanded, large, and extra-large breakpoints. The fixed-and-flexible panes can appear in whichever order is best for the content.

The fixed pane is often temporary, and used for side sheets or lists with light information density.

*[image: Fixed and flexible panes arranged 2 different ways.]*
1. Fixed pane
2. Flexible pane

#### Three-pane layouts

While less common, the extra-large breakpoint supports using a standard side sheet as a third pane. When the side sheet is present, the expanded navigation rail can remain visible, change into a collapsed navigation rail, or hide completely. Don't use more than three panes.

Note: Fixed panes at this breakpoint are recommended to be 412dp, but side sheets have a default maximum width of 400dp.

*[image: Extra large breakpoint with 2 panes and a side sheet acting as a third pane.]*
1. A standard side sheet can be used as a third pane

### Pane expansion & resizing

Panes can be resized, expanded, and collapsed using drag handles.

- In a split-pane layout, both flexible panes can be freely adjusted, or can snap to certain widths.
- In a fixed-and-flexible layout, the drag handle can fully collapse and expand the fixed pane. This makes it easy to switch between a single-pane and two-pane layout.

The drag handle should also toggle between layout sizes when selected. This can be a tap, double tap, or long press.

*[video: A drag handle is used to collapse a two-pane layout into a single-pane layout.]*
Drag handles can adjust pane size in a list-detail layout

At expanded, large, and extra-large breakpoints, two-pane layouts can be customized to snap to set widths when resized.

The recommended custom widths are:

- 360dp
- 412dp
- Split-pane with spacer centered visually

*[video: A drag handle adjusts the panes to recommended custom widths.]*
Panes can snap to custom widths when releasing the drag handle

#### Persistent pane resizing

The persistent resizing behavior remembers a person's pane width preference. Use this for most resizable layouts.

*[video: Resizing the panes and then resetting the app preserves the set width.]*
Pane widths persist even after a person closes the app

The width persists even after a breakpoint change. This means that if a two-pane layout is collapsed to one pane at any size, it’ll remain collapsed even when changing breakpoints.

*[video: Resizing the panes and then rotating a tablet back and forth preserves the set width.]*
When a two-pane layout is resized to a single full-width pane, that pane should remain at full-width after switching breakpoints

#### Temporary pane resizing

The temporary resizing behavior doesn't remember a person’s preferences for pane width. This is primarily used in supporting pane layouts where resizing is uncommon.

*[video: Resizing the panes and then closing the second pane resets the set width when expanded again.]*
Supporting pane layouts can have a pane drag handle to temporarily resize the secondary content

With temporary resizing, panes should always return to the default layout after the pane or product is closed and reopened. This ensures content is a suitable size for most interactions.

*[video: Layouts with temporary resizing reset any custom widths to the default.]*
The pane width can be temporarily adjusted using the drag handle, but will return to the default layout

### Displaying multiple panes

Multiple panes can be displayed in three ways: co-planar, floating, or docked. The layout depends on breakpoint, what the pane does, and how people interact with it:

- Co-planar: Two side-by-side panes. To stay accessible, persistent utilities like tool panels should be co-planar with primary content.
- Floating: A small pane displays above larger panes. Temporary tasks should remain floating regardless of breakpoint, such as a dialog.
- Docked: A small pane pinned to the edge of a window. For example, a bottom sheet can be docked to show additional actions.

*[image: A foldable open screen with 2 co-planar panes displayed side by side.]*
Co-planar: Panes are displayed side by side

*[image: A foldable open screen with a floating pane displayed above other elements.]*
Floating: A pane is displayed above other panes or content, like a dialog

*[image: A foldable open screen with a docked pane to the bottom of the screen displayed above other elements.]*
Docked: A pane is displayed above other panes and one of its edges extends beyond one side of the screen, like a bottom sheet

### How panes adapt

Pane layouts can adapt using three strategies: **show and hide, levitate,** or **reflow**. When a window is resized or changes orientation, these strategies allow panes to reorganize themselves to preserve context and meaning.

#### Show and hide

As the breakpoint size or orientation changes, panes can enter and exit the screen or appear next to one another.

*[video: 1 pane animates off-screen when the device is vertical, then reappears when horizontal.]*
A pane can be shown or hidden depending on the available space and orientation

#### Levitate

Panes can be elevated above other content as **floating** or **docked** panes. This strategy helps panes appear relative to their triggers.

Floating panes:

- Appear in front of the body content
- Can be customized to be dragged or resized

When adding controls that resize or move a floating pane, provide accessible controls.

*[video: 1 pane floats on top of the other when the device changes to a vertical orientation.]*
A co-planar pane can float when switching breakpoint or orientation

On large screens:

- Floating panes are the default
- The scrim behind a floating pane is optional

*[image: 2 ways of showing floating panes on large screens, with and without a scrim.]*
1. Floating pane with a scrim
2. Floating pane without a scrim

Docked panes are usually at the bottom of the window, like a bottom sheet.

At medium and expanded breakpoints, docked panes can adapt into floating panes.

*[video: A docked pane on mobile turning into a floating pane on desktop.]*
A docked pane can adapt into a floating pane at medium and expanded breakpoints

Alternatively, at medium and expanded breakpoints, a docked pane can adapt into a co-planar pane.

*[video: A docked pane on the lower half of a mobile screen changes to a co-planar pane on a larger screen.]*
A docked pane can also adapt into a co-planar pane at medium and expanded breakpoints

On large screens, consider changing docked panes into co-planar panes.

*[image: A docked pane on mobile and a co-planar pane on a tablet.]*
1. A compact screen can have a docked pane
2. On a large screen, it should change to a co-planar pane

#### Reflow

Panes can be reorganized on screen as the breakpoint or orientation changes, also known as reflow.

For example, in a vertical orientation, the supporting pane can move underneath the primary pane.

*[video: A supporting pane changes orientation and location as the screen changes orientation.]*
In a vertical orientation, the supporting pane can move below the primary pane

Reflow also applies to breakpoints. When there’s not enough horizontal space for panes, they can stack vertically instead.

*[video: A supporting pane on the right side of a large horizontal screen moves to the bottom of a vertical small screen.]*
Panes can change size, location, and orientation when switching screen sizes

### Spatial panels

On XR devices, pane layouts can be presented in disconnected spatial panels. These panels must have clear containment to make them easy to see on any background.

The content in a spatial panel can use implicit grouping when the pane has an explicit container to distinguish it from the environment.

*[image: 2-pane layout in XR with implicit content grouping and a virtual reality background.]*
When a pane uses explicit containment, content can use implicit grouping

### Accessibility considerations

**Coplanar panes**

- The focus order should match the visual arrangement of the panes on screen

**Floating panes**

Modal floating pane:

- When active, the elements behind it can’t be interacted with
- Focus moves automatically to the first element in the pane, and when the pane is closed, focus moves back to the element that triggered it, like a dialog
- If triggered automatically, focus should still move to it, but when it’s closed, focus should go to the next most logical element on screen
- It disappears when a person interacts with something behind it.

Non-modal floating pane:

- When open, other parts of a product can be interacted with
- Focus should be able to move to and from the pane
- The pane should be available in a logical reading order of the screen

**Docked panes**

- Have the same focus requirements as modal and non-modal panes
- The focus order should match the visual arrangement of the panes on screen
