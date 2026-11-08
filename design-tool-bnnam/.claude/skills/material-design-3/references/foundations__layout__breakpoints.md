<!-- Source: https://m3.material.io/foundations/layout/breakpoints · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__layout__breakpoints.md @ 3c0e291 -->

# Breakpoints

Breakpoints ensure layouts work across a wide range of devices

## Overview

Material uses breakpoints to create adaptive designs that work across devices:

- There are five main breakpoints: compact, medium, expanded, large, and extra-large
- Layouts typically transition from a single pane to two or three panes as window size increases
- When moving across breakpoints, decide which elements to reveal, divide, resize, reposition, or swap

### Breakpoints overview

A breakpoint (previously window size class) is the window size at which a layout needs to change to match available space, device conventions, and ergonomics. These apply to Android and web.

All devices fall into one of five Material breakpoints:

- Compact
- Medium
- Expanded
- Large
- Extra-large

Rather than designing for an ever-increasing number of display states, focusing on breakpoints ensures layouts work across a wide range of devices.

*[image: 3 breakpoints from small to expanded.]*
1. Compact
2. Medium
3. Expanded

Large and extra-large breakpoints are used on devices like laptops, desktops, and external monitors.

*[image: 2 devices with large and extra-large breakpoints.]*
1. Large
2. Extra-large

**Design for breakpoints instead of specific devices because:**

- The amount of available window space is dynamic and changes based on user behavior, such as multi-window modes or unfolding a foldable device
- Devices fall into different breakpoints based on orientation

| Breakpoint | Width (dp) | Common devices |
|---|---|---|
| Compact | Under 600dp | Phone in portrait |
| Medium | 600–839dp | Tablet in portraitFoldable in portrait (unfolded) |
| Expanded | 840–1199dp | Phone in landscapeTablet in landscapeFoldable in landscape (unfolded)Desktop |
| Large | 1200–1599dp | Desktop |
| Extra-large | 1600dp+ | DesktopUltra-wide monitors |

#### Height breakpoints

On Android, compact, medium, and expanded breakpoints are also available for [height](https://developer.android.com/develop/ui/compose/layouts/adaptive/support-different-display-sizes#window_size_classes). These can be used to adjust the layout when available vertical space is unusually small or large. However, since most layouts contain vertically scrolling content, it's rare that layouts need to adjust to available height.

### Designing across breakpoints

*[image: An email app shown at 3 breakpoints: compact, medium, and expanded.]*
Products should automatically adapt to any breakpoint

*[image: 2 screens at large and extra-large breakpoints.]*
A product’s layout should adjust to fit each breakpoint. For example, a large window can have two panes, while an extra-large window can have three.

Each product view should have a layout for the breakpoints most appropriate for your platform and users.

Different components are recommended for performing the same function across the five layouts.

| Breakpoint | Panes | Navigation | Communication | Action |
|---|---|---|---|---|
| Compact | 1 | Navigation bar, modal expandednavigation rail | Simple dialogFull-screen dialog | Bottom sheet |
| Medium | 1 (recommended) or 2 | Navigation bar, modal expandednavigation rail | Simple dialog | Menu |
| Expanded | 1 or 2 (recommended) | Modal or standard expandednavigation rail | Simple dialog | Menu |
| Large | 1 or 2 (recommended) | Modal or standard expandednavigation rail | Simple dialog | Menu |
| Extra-large | 1 to 3 (recommended) | Modal or standard expandednavigation rail | Simple dialog | Menu |

Start by designing for one breakpoint, then adjust the layout for the next size by asking these five questions:

#### 1. What should be revealed?

Parts of the UI that are hidden on smaller devices can be revealed in larger layouts.

For example:

- On mobile, the navigation rail is collapsed by default
- On an expanded device, the navigation rail can be open by default, revealing more actions and features

*[image: Email app layouts in compact and expanded windows.]*
A product’s navigation rail can be revealed in an expanded layout

The same can be applied to [panes](https://m3.material.io/foundations/layout/scaffold). Larger layouts can simultaneously display an inbox pane and a pane containing a selected conversation. Additional space doesn’t just mean making the same thing bigger.

*[image: Messaging app layouts in compact and expanded windows.]*
An expanded layout for a messaging app reveals a second pane with the selected conversation

#### 2. How should a screen be divided?

When dividing a screen into layout panes, consider the breakpoint:

- Compact and medium breakpoints:  A single pane works best
- Expanded and large breakpoints:  Two panes are recommended
- Extra-large breakpoints: Consider using three panes

*[image: A compact and medium window have a single pane. A larger window has 2 panes.]*
Compact and medium breakpoints should use a single pane, while larger breakpoints can use two

At medium breakpoints, two panes are useful when they contain low-density content with clear actions.

Don’t use two panes in medium layouts with high information density, as it can reduce usability.

*[image: Medium window with 2 panes with low-density content: an email setting menu and a list of setting switches.]*
A settings view with low-density content and quick actions is a good use of two panes in a medium layout

*[image: Video app in a medium window has 1 pane in portrait layout and 2 in landscape.]*
Rotating a device often changes the breakpoint. A layout can have two panes in landscape orientation, and one pane in portrait.

Single-pane layouts can focus attention on one action or view, creating a distraction-free environment for a specific goal such as:

- Playing a game
- Watching a movie
- Video calls
- Creative applications

*[image: Video app in a single-pane landscape layout at an expanded breakpoint.]*
Consider using an immersive single-pane layout for video calls

#### 3. What should be resized?

UI elements that are small on compact screens can grow as breakpoints increase. Panes can also expand to rearrange elements and make better use of space.

Consider resizing:

- Cards
- Feeds
- Lists
- Panes

Resizing can highlight imagery and improve text readability. This type of adaptation affects the scale of content and the relationship between objects on screen. For example, a vertical card on mobile can adjust its margins, orientation, text size, and density to better fit a tablet.

Across all breakpoints, adjust margins and type styles to keep text between 40–60 characters per line.

*[image: 2 cards in compact and medium layouts. The image and text are rearranged and resized to be more legible in the medium layout.]*
A small card in a compact layout can be resized larger in a medium or expanded layout

#### 4. What should be repositioned?

A UI and its components can reflow or reposition to make use of additional space on expanded screens and in resized panes. Repositioning is also a way to match the ergonomic and input needs that change across device sizes, such as shifting actions from the bottom of a compact window to the leading edge of medium and expanded windows. This method is similar to responsive design on the web.

Consider:

- Repositioning cards
- Adding a second column of content
- Creating a more complex layout of photos
- Introducing more negative space
- Ensuring reachability for navigation and interactive elements

Internal elements can be anchored to the left, right, or center as a parent container scales. Internal elements can also maintain fixed positions, such as a floating action button (FAB) in a navigation rail.

*[image: Comparison of compact and medium breakpoints with tabs anchored to the middle of each layout.]*
Tabs can remain anchored to the middle of a layout at both compact and medium breakpoints

In the case of a button, the icon and text label within the button container can remain anchored to each other, staying centered as the button container scales horizontally.

*[image: Label text remains the same size and centered as button size increases.]*
Button icons and label text can remain anchored to each other no matter the width

#### 5. What should be swapped?

As a layout changes across breakpoints, components with similar functions can also be exchanged. This makes it possible to adjust a layout for large-scale changes to the ergonomic and functional qualities of an interface.

For example, a bottom navigation bar in a compact layout can be swapped with a navigation rail in a medium layout.

*[image: A compact layout’s navigation bar becomes a navigation rail in an expanded layout.]* **✅ Do**
Swap a navigation bar in a compact layout for a navigation rail in a medium or expanded layout

Likewise, a navigation rail can swap from collapsed to expanded at larger breakpoints.

Use caution when swapping components. Make sure:

- The interchangeable components are functionally equivalent
- The component swap serves a functional and ergonomic purpose

Don’t swap a button for a chip. Be careful when changing between list items and cards.

*[image: A compact layout’s navigation rail expands in an extra-large layout.]* **✅ Do**
A collapsed navigation rail in medium or expanded layouts can become an expanded navigation rail in large or extra-large layouts

*[image: A button is swapped out for a menu in a food delivery app.]* **❌ Don't**
Don’t arbitrarily swap components that aren’t functionally equivalent, such as swapping a button with a menu

#### Common swappable components

| Component type | Compact | Medium | Expanded |
|---|---|---|---|
| Navigation | Navigation bar | Collapsed navigation rail | Collapsed navigation rail |
| Navigation | Modal expanded navigation rail | Modal expanded navigation rail | Standard expanded navigation rail |
| Communication | Basic or full-screen dialog | Basic dialog | Basic dialog |
| Supplemental selection | Bottom sheet | Menu | Menu |

## Compact

Layouts for compact breakpoints are for **screen widths smaller than 600dp.**

*[image: Messaging app at a compact breakpoint.]*
A compact breakpoint focuses on a single view

### Navigation

Use a navigation bar or modal expanded navigation rail.

Place navigation components close to the edge of the screen where they’re easier to reach.

*[image: Navigation bar and FAB are close to the bottom of a mobile app in a compact window.]*
Place navigation elements near the bottom of a compact window so they’re easy to reach

### Panes

Use a single pane in compact layouts.

*[image: The single pane consumes most of the area in a compact window.]*
1. Single-pane layouts work best for compact breakpoints

### Spacing

Margins are 16dp from the leading and trailing edge of the window.

*[image: The left and right margins of a compact window pane are 16dp.]*
In compact layouts, use 16dp margins

### Special considerations

A compact layout will need to transition dynamically to a medium or expanded layout when:

- A foldable device is unfolded
- A mobile device is rotated from portrait to landscape
- A tablet exits split-screen mode
- A product is resized to be larger in multi-window mode
- A free-form window is resized

*[image: 2 mobile layouts showing a messaging app with a 1-pane list and an expanded navigation rail.]*
Compact layouts should dynamically transition to larger layouts when a device is unfolded or rotated

## Medium

Layouts for medium breakpoints are for **screen widths from 600dp to 839dp.**

*[image: A medium breakpoint with a video call app in full-screen mode.]*
Single-pane layouts can focus attention on one action or view, such as a video call

### Navigation

Place navigation components close to edges of the window where they’re easier to reach:

- Single-pane layouts: Navigation rail
- Two-pane layouts: Navigation bar

The navigation rail can be hidden in secondary destinations as long as the primary destination can still be accessed using a back button.

*[image: The navigation area of a medium breakpoint is a vertical bar at the leading edge, beside a single pane.]*
1. Navigation area
2. Single pane

### Panes

#### Single-pane layout

In a medium layout, a single pane is recommended because of limited screen width.

*[image: A single pane uses most of the space in a medium window.]*
1. A single-pane layout is recommended for medium breakpoints

#### Two-pane layout

Limit use of two panes for content with lower information density, such as a settings screen.

Each pane in a two-pane layout should take up 50% of the window width. Avoid setting custom widths. A drag handle can be used to expand or collapse panes to be 100% of the window width.

*[image: 2-pane layout in a medium window. Both panes fit 50% of the window width by default.]*
Two-pane layouts should use 50% widths for each pane by default

When adding navigation to a two-pane layout, use a navigation bar. This allows the panes to fully use the available window width.

*[image: A navigation bar extends over 2 panes at the bottom of a medium window.]*
Two-pane layout with:

1. Navigation bar

### Spacing

Medium layouts have margins of 24dp.

The spacer between panes is also 24dp.

*[image: 2 pane layout with 24dp margins and 24dp space between panes.]*
Use 24dp for margins and spacer in a medium layout

### Special considerations

A medium layout will need to transition dynamically to a compact or expanded layout when:

- A foldable device is folded
- A tablet is rotated from portrait to landscape
- A product goes from full-screen to split-screen
- Multi-window mode is initiated
- A free-form window is resized

*[image: Email app with 2 panes at  a medium breakpoint.]*
Think of how a medium layout should change to a compact or expanded layout

#### Reachability

For horizontal tablets and unfolded foldables, the top 25% of the screen is likely out of reach, unless the grip is adjusted. To accommodate device and hand sizes, limit the amount of interactions that are placed in the upper 25% of the screen.

*[image: The hard-to-reach top quarter of a medium breakpoint in landscape mode.]*
1. Limit interactions in the upper quarter of a screen, as they can be hard to reach

Avoid placing essential interactive elements too close to the bottom edge of the screen. Some users, particularly those with larger hands, might struggle to reach this area.

Specify interactions in a layout with these ergonomic regions in mind:

1. Users can reach this area by extending their fingers, which makes it inconvenient
2. Users can reach this area comfortably
3. Reaching this area is challenging when holding the device

*[image: The 3 ergonomic regions of a medium breakpoint.]*
Medium breakpoint ergonomic regions:

1. Inconvenient
2. Comfortable
3. Challenging

## Expanded

Layouts for expanded breakpoints are for **screen widths from 840dp to 1199dp.**

*[image: Supporting pane layout of a video app. The large, primary pane has the video, title, and actions. The secondary pane has queued videos.]*
Two-pane layouts are often best for expanded breakpoints

### Navigation

Place navigation components close to edges of the window where they’re easier to reach. Use a navigation rail, either collapsed or expanded.

The navigation rail can be hidden in secondary destinations as long as the primary destination can still be accessed using a back button.

For sorting, filtering, or secondary navigation, use tabs or other components directly in the pane.

*[image: The navigation area is a vertical bar at the left of the screen. To its right, the body pane fills the rest of the window.]*
1. Navigation area
2. Single pane

### Panes

Use a single-pane or two-pane layout.

A two-pane layout is often best for expanded breakpoints. However, a single-pane layout can work when displaying visually- or information-dense content, such as videos.

*[image: A single pane covers most of the expanded screen except for the navigation area and margins.]*
At an expanded breakpoint, reserve single-pane layouts for information-dense content

When using a [fixed-and-flexible](https://m3.material.io/foundations/layout/scaffold) layout, the fixed pane should have a width of 360dp by default.

*[video: A 2-pane layout at an expanded breakpoint. The fixed pane starts at 360dp, then expands to a single-pane layout.]*
In a fixed-and-flexible layout, the fixed pane is 360dp by default

A [split-pane layout](https://m3.material.io/foundations/layout/scaffold) uses two flexible panes and visually centers the spacer by default.

*[video: A nav rail and a pane fill 50% of the window. A second pane fills the remaining 50%.]*
The navigation and first pane are 50% of the window width to keep the spacer visually centered

### Spacing

Expanded layouts have a leading and trailing margin of 24dp.

The spacer between panes is 24dp.

*[image: 2 pane layout with 24dp margins and 24dp space between panes.]*
Use 24dp for margins and spacer in an expanded layout

### Special considerations

An expanded layout will need to transition dynamically to a compact or medium layout when:

- A foldable device is folded
- A tablet is rotated from landscape to portrait
- The app goes from full-screen to split-screen
- Multi-window mode is initiated
- A free-form window is resized

*[video: Email app moves from 2-pane expanded layout to medium to 1-pane small layout.]*
Consider how an expanded layout should change at medium and compact breakpoints

## Large & extra-large

These breakpoints are most useful for creating web experiences tailored to laptop and desktop devices. Some products may not need large and extra-large breakpoints. Consider your platform’s conventions and users when making decisions on which breakpoints to design for.

- Layouts for large breakpoints are for screen widths **from 1200dp to 1599dp**
- Layouts for extra-large breakpoints are for screen widths of **1600dp and larger**

*[image: Large window with a video app in 2 pane layout.]*
A two-pane layout is recommended for large and extra-large breakpoints

### Navigation

Use a navigation rail, either collapsed or expanded, depending on the amount of content.

For sorting, filtering, or secondary navigation, use tabs or other components directly in the pane.

*[image: Large web browser with a small navigation area on the leading edge with 1 pane filling the rest of the window.]*
1. Collapsed navigation area
2. Single-pane layout

An expanded navigation rail is best suited for extra-large windows, where there's still plenty of room for content. Consider collapsing the navigation rail when space is needed, or when on pages deeper in the page hierarchy.

*[image: Extra-large web browser with an expanded navigation area and 1 pane filling the rest of the window.]*
1. Expanded navigation area
2. Single-pane layout

### Panes

A two-pane layout is often best for large and extra-large breakpoints.

However, a single-pane layout can work when displaying visually- or information-dense content, such as videos.

*[image: The single pane covers most of a large screen except for the navigation area and margins.]*
Only use a single-pane layout for dense content or media

When using a [fixed-and-flexible](https://m3.material.io/foundations/layout/scaffold) layout, the fixed pane should have a width of 412dp by default.

*[image: A 2-pane layout with 1 pane fixed at 412dp.]*
Fixed panes should be 412dp in large and extra-large layouts

When using a [split-pane layout](https://m3.material.io/foundations/layout/scaffold), the spacer should be visually centered by default, even when using an expanded navigation rail.

*[image: An expanded nav rail and the first pane take up 50% of the window, and the second pane takes up 50%.]*
In split-pane layouts, navigation components shrink the leading pane, so the spacer remains centered

### Additional panes

The extra-large breakpoint supports using a standard side sheet as a third pane. When the side sheet is present, the navigation rail can remain visible, collapse, or hide completely. Don't use more than three panes.

Note: Fixed panes in this window size are recommended to be 412dp, but side sheets have a default maximum width of 400dp.

*[image: Extra-large window with 2 panes and a side sheet acting as a third pane.]*
1. Standard side sheet (third pane)

### Spacing

Large and extra-large layouts have a leading and trailing margin of 24dp.

The spacer between panes is 24dp.

*[image: 2 pane layout with 24dp margins and 24dp space between panes.]*
Use 24dp for margins and spacers in large and extra-large layouts

### Special considerations

Large and extra-large layouts will need to transition dynamically to a smaller layout when:

- The app goes from full-screen to split-screen
- Multi-window mode is initiated
- A free-form window is resized

Pay attention to typographic elements such as line length to ensure readability on large and extra-large layouts.

*[image: An email app with 2 panes in a large layout.]*
Consider how a large layout should change at smaller breakpoints
