<!-- Source: https://m3.material.io/foundations/layout/canonical-examples · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__layout__canonical-examples.md @ 3c0e291 -->

# Canonical layout examples

Canonical layout examples are designs for common screen layouts across all breakpoints

## Overview

Canonical layout examples demonstrate how to implement the layout scaffold. They’re also available in code to provide a strong starting point for your product.

Each layout example considers common use cases and components to address expectations and user needs for how products adapt across breakpoints (previously window size classes).

*[image: A messaging app on desktop mapping bar, rail, and pane regions.]*
A layout scaffold can include bar, rail, and pane regions

### Availability & resources

| Type | Resource | Status |
|---|---|---|
| Design | [M3 Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [Jetpack Compose: Canonical layouts](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) | Available |
| [Android Views (MDC-Android): Canonical layouts](https://github.com/android/user-interface-samples/tree/main/CanonicalLayouts) | Available |  |

### Examples

There are three canonical layout examples: feed, list-detail, and supporting pane. Each example has configurations for compact, medium, and expanded breakpoints.

Use these canonical examples as a starting point to create layouts for a product.

#### Feed

Use a feed layout to arrange elements like cards in a configurable grid for a quick, convenient view of a large amount of content.

[More on feed layouts](https://m3.material.io/foundations/layout/canonical-examples)

*[image: A course list in a feed layout at a medium breakpoint. 8 cards in a single pane, with bar above and leading rail.]*

#### List-detail

Use a list-detail layout to display explorable lists of items alongside each item’s details. This layout divides the window into two side-by-side panes.

[More on list-detail layouts](https://m3.material.io/foundations/layout/canonical-examples)

*[image: List-detail layout of a messaging app. Pane 1 lists all conversations. Pane 2 shows the selected message.]*

#### Supporting pane

Use a supporting pane layout to organize content into primary and secondary sections:

- Primary display area: Contains the main content and occupies the majority of the window (typically about two-thirds)
- Secondary display area: Presents supporting content in a panel that takes up the remainder of the space

[More on supporting pane layouts](https://m3.material.io/foundations/layout/canonical-examples)

*[image: Supporting pane layout. The primary pane shows course details. The  secondary pane lists “Lessons in this course”.]*

### Advanced custom layouts

To create a custom layout, build on top of canonical layouts or layer scaffold elements.

#### Layering

Use the [levitate](https://m3.material.io/foundations/layout/scaffold) adaptive strategy to create a layered layout. Layering panes above other content can create a focused, task-oriented experience such as:

- Reviewing a shopping basket
- Responding to comments
- Creating a calendar event

*[image: Custom layout. A shopping basket floats above a clothing product page.]*
Layering panes helps people focus on a specific task

## Feed

A feed layout uses a grid composition to enable quick content browsing and discovery. Key use cases include news, photos, and social media.

*[image: Education app using a feed layout.]*
Feed layouts help people quickly browse and discover content

### Usage

Use a feed layout to show different pieces of content through cards and lists.<br><br>Feeds support displays of almost any size as grids can adapt from single to multi-column.

*[image: An education app has 2 columns on mobile, and 4 columns on a tablet.]*
Feed layouts can adapt the number of columns across breakpoints

### Dividing space

A feed composition is flexible enough to allow for content with varying proportions and sizing.

*[image: Feed layout in a medium window with 2 panes. 1 pane has 2 columns of small cards and the other has 1 large card.]*
Feeds can organize content of different sizes, like using small and large cards

Use size and position to establish relationships among content elements.

Feed items should reflow when the amount of available space changes like:

- Rotating or unfolding a device
- Entering multi-window mode

The order of items is determined by their position.

[More on adaptive design for cards](https://m3.material.io/components/cards)

*[image: Lead article image is prominent in a 2-pane news feed.]*
Feed items can change size to group content

### Across breakpoints

#### Compact

A feed layout should stack vertically, like a list of cards with individual items filling the width of the pane.

*[image: Cards in 2 feed layouts, compact and expanded.]*
In compact windows, the cards in a feed stack vertically, filling the full width:

1. Compact breakpoint
2. Expanded breakpoint

#### Medium

A feed layout can support components with different widths and be split across multiple columns.

*[image: In a medium window, 4 equal-width columns of cards in a feed layout.]*
Feed layouts can add columns in a medium window

#### Expanded, large, & extra-large

A feed layout can support components with different widths and be split across multiple columns. The number of columns should usually increase at expanded breakpoints.

*[image: Expanded window has wider columns than a compact window.]*
Column width can increase at larger breakpoints

## List-detail

Many layouts can be split into a list view and a detail view.

Key use cases for this layout include parent-child pairings of information like:

- Text message + conversation
- File browser + open folder
- Musical artist + album detail
- Settings + category detail
- Email inbox + selected email

*[image: An email app in a list-detail layout at a medium breakpoint.]*
1. List
2. Detail

### Usage

Use the list-detail layout for quickly accessing details of an item from a long list of content.

Examples include:

- Showing a series of conversations and a text message
- Browsing files and seeing their details
- Browsing multiple albums and seeing individual track information

*[image: Several stacked cards make up the list area on the left pane, while the detail area is a single section on the right pane.]*
Simplified diagram of:

1. List area
2. Detail area

#### Dividing space

*[image: Compact windows have 1 pane, while medium and expanded windows can have 2 panes for list-detailed views.]*
The most basic list-detail views for compact, medium, and expanded layouts

A list-detail layout uses two panes. Depending on the breakpoint, the two panes may appear together in the same layout or across separate layouts.

List-detail layouts use the same pane guidance as all single and two-pane layouts, including special behavior for foldables.

| **Breakpoint (dp)** | **Visible panes** |
|---|---|
| Compact (0-599) | 1 pane |
| Medium (600-839) | 1 (recommended) or 2 panes |
| Expanded (840+) | 2 panes |
| Large (1200-1599) | 2 panes |
| Extra-large (1600+) | 2 panes |

### Across breakpoints

#### Compact

- Use a single-pane layout
- Only one view is visible at a time, either list or detail

*[image: Single-pane layout on 3 devices at compact breakpoints.]*
1. Phone in portrait orientation
2. Closed foldable
3. Tablet in split-screen mode

#### Medium

- Use a single-pane layout for information-dense content or deep focus

*[image: Single-pane layout on a foldable open flat and a tablet in portrait orientation.]*
1. Foldable open flat
2. Tablet in portrait orientation

- Use a two-pane layout to browse collections and switch between items quickly
- To maximize horizontal space for two-pane layouts, use a bottom navigation bar or modal navigation rail

*[image: 2-pane layout on a foldable open flat and a tablet in portrait orientation.]*
1. Foldable open flat
2. Tablet in portrait orientation

#### Expanded, large, & extra-large

- Use a two-pane layout

*[image: 2-pane layout on a phone and tablet, both in landscape orientation.]*
1. Phone in landscape orientation
2. Tablet in landscape orientation

### Behavior

#### Single vs two-pane

- Back button: Appears in detail view only for single-pane layouts
- Selected state: Appears only in list view for two-pane layouts
- Visual focus: Use [explicit and implicit grouping](https://m3.material.io/foundations/layout/grids-spacing) to direct focus in two-pane layouts

*[image: A 2-pane layout shows a selected list item. A single-pane layout uses a Back button to return to the list.]*
1. Use a selection state in two-pane layouts only
2. Use a back button in single-pane layouts only

#### Transitioning between layouts

The amount of available space is dynamic and changes based on how someone uses a device, such as rotating or unfolding it, or entering multi-window mode.

*[video: Device rotating from landscape to portrait mode, reducing layout panes from 2 to 1.]*
A two-pane layout adapts to a single-pane layout when a device rotates from an expanded to medium breakpoint

##### No selected list item

A single-pane layout shows a list view, while a two-pane layout shows placeholder content in the detail pane.

In some cases, such as multi-select, the most recently used pane should stay visible when switching to single-pane layout.

*[video: No item selected on a folded device. When unfolded, the detail pane is empty.]*
If no item is selected when a foldable opens, the detail pane displays an empty state

##### Selected list item

When switching from a single- to two-pane layout, both panes should be shown and the selected item’s details are visible.

When going from a two- to single-pane layout, the view depends on the product:

- The detail pane should typically show in a single-pane layout, and an app bar appears
- If the product supports selection without deep navigation, like multi-select, the list view can show with the item selected
- Consistency is key: If a layout showed the list view previously, it should return to that view when returning to a single pane

*[video: Item selected on a folded device. When unfolded, the detail view shows the item.]*
If an item is selected when a foldable opens, the detail pane shows that item

*[video: Item selected on an unfolded device. When folded, only the detail view shows.]*
When a foldable closes with an item selected, the single pane shows the detail view

##### Persistent states

In most cases, a state should be saved when navigating between detail views. This includes read and unread content.

*[video: Scroll position is kept after folding or unfolding the device.]*
Detail views should retain their scroll position when navigating to other items

## Supporting pane

The supporting pane layout organizes content into primary and secondary areas.

The primary area contains the main content and occupies the majority of the space. The secondary area contains supporting content.

Key use cases for supporting pane layouts include:

- Productivity
- Document editing and commenting
- Content and media browsing

*[image: A video app has the main content in the primary area and “up next” content is listed in the secondary area.]*
Supporting pane layouts organize content into primary and secondary areas

### Usage

Use the supporting pane layout when the secondary content is only meaningful in relation to the primary content.

For content with a parent-child relationship, use a [list-detail layout](https://m3.material.io/m3/pages/canonical-layouts/list-detail/) instead.

*[image: The supporting pane has vertically stacked cards.]*
Supporting panes provide contextual info for the primary area

### Dividing space

The window is divided between a focus pane and a supporting pane.

Depending on the breakpoint, the supporting pane may appear below or beside the focus pane.

*[image: The cards of a supporting pane scroll horizontally across the bottom of the screen.]*
Supporting panes can appear beside or below the primary area

| Supporting pane placement | Pane width | Breakpoint |
|---|---|---|
| Below | Flexible | Compact or Medium |
| Leading or trailing | Fixed (360 dp) | Expanded |

### Across breakpoints

#### Compact

The supporting pane should appear below the focus pane. <br><br>A bottom sheet can be useful for keeping focus on the primary pane while providing access to supporting information.

*[image: 2 layouts showing  bottom sheets at a compact breakpoint.]*
Bottom sheets can provide supporting information in compact windows

#### Medium

The supporting pane should appear below the focus pane.

*[image: 3 cards in a supporting pane are horizontal across the bottom of a tablet.]*
Supporting panes appear below the focus pane in medium windows

#### Expanded

The supporting pane should appear on the leading or trailing side of the focus pane.

*[image: The supporting pane is to the right of the primary focus pane on 2 screens.]*
Supporting panes appear beside the focus pane in expanded windows
