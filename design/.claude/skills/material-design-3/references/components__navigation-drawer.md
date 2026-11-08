<!-- Source: https://m3.material.io/components/navigation-drawer · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__navigation-drawer.md @ 3c0e291 -->

# Navigation drawer

## Overview

> **Note:** The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an [expanded navigation rail](https://m3.material.io/components/navigation-rail), which has mostly the same functionality of the navigation drawer and adapts better across breakpoints.

- Use standard navigation drawers in expanded, large, and extra-large breakpoints
- Use modal navigation drawers in compact and medium breakpoints
- Can be open or closed by default
- Two variants: standard and modal
- Put the most frequent destinations at the top and group related destinations together

*[image: 2 variants of navigation drawers: standard and modal.]*
1. Standard navigation drawer
2. Modal navigation drawer

### Availability & resources

### M3 Expressive update

**May 2025**

The navigation drawer is no longer recommended. Use the expanded navigation rail instead. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- Variants: Distinguishes two separate variants of navigation drawer: Standard and modal
- Shape: Rounded corners at the ending edge of the drawer
- States: Updated color and shape for indicating selected state

*[image: M2 navigation drawer with 4 destinations in a mail app. The active destination “Inbox” is rectangular.]*
M2: Navigation drawer had square corners and a rectangular shape indicating the active destination

*[image: M3 navigation drawer with 4 destinations in a mail app. The active destination “Inbox” has rounded corners.]*
M3: Navigation drawer has rounded corners, new color mappings, and an updated style for indicating the active destination

## Specs

> **Note:** The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an [expanded navigation rail](https://m3.material.io/components/navigation-rail), which has mostly the same functionality of the navigation drawer and adapts better across breakpoints.

*[image: Navigation drawer diagram numbering 7 elements]*
1. Container
2. Headline
3. Label text
4. Active indicator
5. Badge label text
6. Scrim
7. Icon

### Tokens & specs

The navigation drawer has one token set. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__navigation-drawer.md` — Navigation drawers (baseline)]*

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Navigation drawer diagram numbering 9 color roles.]*
Navigation drawer color roles used for light and dark schemes:

1. Surface container low
2. On surface variant
3. On secondary container
4. On secondary container
5. Secondary container
6. On secondary container
7. On surface variant
8. On surface variant
9. Scrim

For divider color roles, go to [divider specs](https://m3.material.io/components/divider).

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

*[image: 4 navigation drawers illustrating enabled, hovered, focused, and pressed states.]*
Navigation drawer states:

1. Enabled
2. Hovered
3. Focused
4. Pressed

[State specs are in the tokens module above](https://m3.material.io/components/navigation-drawer)

### Measurements

#### Standard navigation drawer

*[image: Standard navigation drawer with measurements shown for various elements.]*
Element size measurements

*[image: Standard navigation drawer with measurements shown for padding and margins.]*
Padding and margins

| Attribute | Value |
|---|---|
| Container height | 100% |
| Container width | 360dp |
| Container shape | 0,16,16,0dp corner radii |
| Icon size | 24dp |
| Active indicator height | 56dp |
| Active indicator shape | 28dp |
| Active indicator width | 336dp |
| Horizontal label alignment | Start-aligned |
| Left padding | 28dp |
| Right padding | 28dp |
| Active indicator padding | 12dp |
| Padding between elements | 0dp |

#### Modal navigation drawer

*[image: Modal navigation drawer with measurements shown for various elements.]*
Element size measurements

*[image: Modal navigation drawer with measurements shown for padding and margins.]*
Padding and margins

| Attribute | Value |
|---|---|
| Container height | 100% |
| Container width | 360dp |
| Icon size | 24dp |
| Active indicator height | 56dp |
| Active indicator shape | 28dp |
| Active indicator width | 336dp |
| Horizontal label alignment | Start-aligned |
| Left padding | 28dp |
| Right padding | 28dp |
| Active indicator padding | 12dp |
| Padding between elements | 0dp |

## Guidelines

> **Note:** The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an [expanded navigation rail](https://m3.material.io/components/navigation-rail), which has mostly the same functionality of the navigation drawer and adapts better across breakpoints.

*[image: Navigation drawer with 4 primary destinations]*

### Usage

Navigation drawers provide access to destinations and app functionality, such as switching accounts. They can either be permanently on-screen or opened and closed by a navigation menu icon. One navigation destination is always active.

Navigation drawers are recommended for:

- Apps with 5 or more top-level destinations
- Apps with 2 or more levels of navigation hierarchy
- Quick navigation between unrelated destinations
- Replacing the navigation rail or navigation bar on large screens

*[image: Navigation drawer with multiple destinations in a mail app.]* **✅ Do**
Use a navigation drawer for 5 or more primary destinations, or more than 1 level of navigation hierarchy

Avoid using a navigation drawer with other primary navigation components, such as a navigation bar.

Instead, choose a single navigation component based on product requirements and breakpoints:

- Navigation bars for compact breakpoints
- Navigation rails for medium and expanded breakpoints
- Standard navigation drawers for expanded, large and extra-large breakpoints

*[image: Standard navigation drawer and navigation bar used together.]* **⚠️ Caution**
Avoid using two navigation components on the same screen

There are two variants of navigation drawers:

1. Standard navigation drawer
2. Modal navigation drawer

*[image: Standard navigation drawer with destinations in mail app.]*
Standard navigation drawer

*[image: Modal navigation drawer with destinations and scrim.]*
Modal navigation drawer

#### Standard navigation drawer

Standard navigation drawers provide access to drawer destinations and app content for layouts in expanded, large, and extra-large breakpoints.

Standard drawers can be permanently visible (best for frequently switching destinations) or opened and closed by tapping a menu icon (best for focusing more on screen content).

In medium and compact breakpoints, use modal drawers instead.

*[image: Standard navigation drawer in a mail app with active destination “Inbox” next to app content.]*
Standard navigation drawer providing access to drawer destinations next to app content

#### Modal navigation drawer

Modal navigation drawers use a scrim to block interaction with the rest of an app’s content, and don’t affect the screen’s layout grid.

Modal navigation drawers can be used in any breakpoint, but are primarily used in compact and medium sizes where space is limited or prioritized for app content.

They can be swapped with standard drawers on expanded, large, and extra-large breakpoints.

*[image: Modal navigation drawer with 1 active destination and scrim.]*
Modal navigation drawer using a scrim to block interaction with the rest of an app’s content

Modal navigation drawers are always opened by an action outside of the drawer, such as clicking a navigation menu icon in a navigation rail.

Modal drawers can be dismissed by:

- Selecting a drawer item
- Tapping the scrim
- Swiping toward the drawer’s anchoring edge (for example, swiping right-to-left for a left-aligned navigation drawer)

*[image: Diagram noting a navigation menu icon in a navigation rail.]*
A modal drawer opened by an action such as clicking a navigation menu icon (1)

Modal drawers can be dismissed by tapping the scrim or swiping the drawer toward its anchoring screen edge.

*[image: 2 modal navigations illustrating tapping the scrim or swiping to dismiss a modal drawer]*
1. Dismiss by tapping the scrim<br>2. Dismiss by swiping the drawer

### Anatomy

Navigation drawers are essentially a list contained within a side sheet. They can also include headers, subheads, and dividers to organize longer lists.

*[image: Navigation drawer diagram numbering 8 elements.]*
Navigation drawers can include headers, subheads, and dividers to organize longer lists

1. Active Indicator
2. Icon
3. Label
4. Badge label
5. Sheet
6. Divider
7. Section label (optional)
8. Scrim

#### Sheet

A sheet holds all navigation drawer elements. Side sheets are used as the container for standard and modal navigation drawers.

Navigation drawers that open from the side are always placed on the start edge of the screen, on the left for left-to-right (LTR) languages, and on the right for right-to-left (RTL) languages.

*[image: Modal navigation drawer opening from left side of screen.]* **✅ Do**
A navigation drawer opens from the left side of the screen for left-to-right languages

#### Divider (optional)

Dividers can be used to separate groups of destinations within the navigation drawer.

*[image: Navigation drawer using horizontal dividers to separate a group of destinations]* **✅ Do**
Use full-width dividers (1) to separate groups of destinations

*[image: Navigation drawer using horizontal dividers to separate individual destinations]* **❌ Don't**
Don’t use dividers to separate individual destinations

#### Active indicator

The active indicator is a background shape communicating which destination of the navigation drawer is currently being displayed.

*[image: Navigation drawer diagram numbering 1 element.]*
The active indicator (1) is a background shape communicating which destination of the navigation drawer is currently being displayed

#### Label text and icons

Destinations in a navigation drawer take the form of actionable list items. Each item describes its destination using label text and an optional icon.

*[image: Navigation drawer diagram numbering 2 elements.]*
Actionable list items in a navigation drawer describe each destination using (1) an optional icon and (2) required label text

Label text should be clear and short enough that it isn’t cut off by the sheet.

*[image: Navigation drawer using only label text for 4 destinations. Label text “Inbox” in active destination.]*
Navigation drawers can use text labels without icons

*[image: Navigation drawer with 1 truncated text label.]* **✅ Do**
Keep text labels concise, but truncate them if they extend beyond the container width

*[image: Navigation drawer with 1 text label with wrapped label text.]* **❌ Don't**
Don’t wrap label text

*[image: Navigation drawer with 1 text label featuring smaller text.]* **❌ Don't**
Don’t shrink text size in order to fit a text label on a single line

Icons can supplement labels as indicators of a destination. When used, they should always be placed before text. Other app components and content should reference these icons.

*[image: Navigation drawer with active destination “Inbox” featuring recognizable icon.]* **✅ Do**
Use recognizable icons when conventions exist

*[image: Navigation drawer with 4 destinations, 2 with text label and icon, 2 with only text label.]* **❌ Don't**
Don’t apply icons to some destinations and not others. Icons should be used for all destinations, or none.

#### Section label (optional)

Short subhead section labels can help group related destinations in the navigation drawer.

*[image: Navigation drawer showing subhead section labels.]*
Related destinations can be grouped using short subhead section labels in the navigation drawer

#### Scrim (modal only)

Modal navigation drawers use a scrim to block interaction with the rest of the app. The scrim is placed directly behind the drawer’s sheet and can be tapped or clicked to dismiss the drawer.

*[image: Modal navigation drawer with scrim placed behind.]*
Scrim applied behind a modal navigation drawer

### Responsive layout

A product’s navigation component should change to suit the breakpoint and form factor of the screen.

Modal navigation drawers can be used at any breakpoint but are most common in compact and medium breakpoints.

Standard navigation drawers are best for expanded, large, and extra-large breakpoints.

Use a transition when swapping components. For example, when switching from a portrait to landscape layout, the navigation rail should transform into a navigation drawer.

*[image: Navigation rail changing to navigation. drawer on a larger screen]*
Standard navigation drawers change size to suit the device’s screen

#### Compact breakpoint

Use modal navigation drawers in compact breakpoints. Or swap the drawer for a navigation bar.

On web, when the screen size is smaller than 320 CSS pixels, swap the navigation drawer for a navigation bar to ensure accessibility.

*[image: Modal navigation drawer with 1 active destination.]*
Use a modal navigation drawer on mobile screens

#### Medium & expanded breakpoints

Use a modal navigation drawer alone or with a navigation rail on medium and expanded breakpoints.

When a navigation rail and modal navigation drawer are used together, the drawer can repeat destinations in the navigation rail as long as the drawer offers enough visual separation between levels of the navigation hierarchy.

A standard navigation drawer can be used in [single pane layouts](https://m3.material.io/m3/pages/understanding-layout/parts-of-layout) in expanded breakpoints.

*[video: Navigation drawer on tablet with 1 active destination.]*
Use a navigation rail on tablet screens, or also allow a drawer to open and close via a menu icon

#### Large and extra-large breakpoints

For web experiences on laptop and desktop devices, use either a standard navigation drawer, or a navigation rail that transitions into a modal navigation drawer.

*[image: Navigation drawer showing 1 active destination.]*
Use a standard navigation drawer on large and desktop screens

### Behavior

#### Scrolling

Navigation drawers can be vertically scrolled, independent of the rest of the screen’s content and UI. If the list of navigation destinations is longer than the height of the drawer, the drawer’s contents can be scrolled within the drawer.

*[video: A navigation drawer on the left region of an email app is scrolled vertically without disturbing the rest of the content.]*
When a navigation drawer is scrolled, the body content should remain stationary

#### Visibility

**Dismissible standard drawers** can be used for layouts that prioritize content (such as a photo gallery) or for apps where users are unlikely to switch destinations often. They should use a visible navigation menu icon to open and close the drawer.

*[image: Side-by-side standard navigation drawer opened and then closed after tapping menu bar.]*
A standard dismissible navigation drawer is opened and closed by tapping the navigation menu icon in the app bar (1), and remains open until the menu icon is tapped again (2)

**Permanently visible standard drawers** allow quick navigation between unrelated destinations. They can’t be closed or dismissed by the user.

*[image: Standard navigation drawer moving between destinations.]*
A permanently-visible standard navigation drawer on desktop

#### Appearing

When a navigation drawer animates on screen, it uses an [enter and exit](https://m3.material.io/styles/motion/transitions) transition pattern.

*[video: In an email app, navigation drawer opens on menu icon click, and closes on outside click.]*
A navigation drawer animating on screen

## Accessibility

> **Note:** The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an [expanded navigation rail](https://m3.material.io/components/navigation-rail), which has mostly the same functionality of the navigation drawer and adapts better across window size classes.

### Use cases

Users should be able to:

- Move between navigation destinations with assistive technology
- Select a particular navigation destination from a set
- Get appropriate feedback based on input type

### Interaction & style

**Touch**

- When a navigation item is tapped, the active indicator appears in place, providing feedback to the user that it is selected
- A touch ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color, becoming darker

*[video: Active indicator and other visual cues appear when nav drawers are tapped.]*
Touch: Tap

**Cursor**

- When hovered, the hover indicator appears providing a visual cue that the destination is interactive
- When clicked, a ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color, becoming darker in light theme and lighter in dark theme, to increase the contrast

*[video: When a cursor goes over a navigation drawer, a hover indicator appears. When tapped, the active indicator appears.]*
Cursor: Hover, Click

### Initial focus

Initial focus lands directly on the first navigation item, since that is the first interactive element of the component.

*[image: 1. Tab lands on the first navigation item, Inbox. 2. Down arrow to get to the second navigation item, Outbox.]*
Focus lands on first navigation item

### Closing

The modal navigation drawer can be dismissed by selecting the scrim that covers the rest of the screen.

*[image: A navigation drawer with a scrim covering the body content. A touch target is selecting the scrim.]*
Select the scrim to close the navigation drawer

### Visual indicators

Icons are the primary focus of the navigation and such give the dominant cue of its state. Use a filled icon for the selected destination to differentiate from the outlined icons of non-selected destinations.

*[image: Space + enter is used to select the navigation item inbox.]*
The navigation item is selected via **Space**/**Enter**

*[image: A navigation drawer with the home destination using a filled icon.]* **✅ Do**
Use a filled icon for the selected navigation destination to differentiate from the other destinations

*[image: A navigation drawer with the home destination using an outlined icon.]* **❌ Don't**
Avoid keeping the icon style for the selected navigation destination the same as unselected destination's icons. This removes an important visual indicator of which destination is active.

*[image: A selected home icon using a filled icon and active indicator and a unselected home icon using an outlined icon.]*
When selected, the icon fills, darkens in light theme (or lightens in dark theme), and is backed by an active indicator shape

### Keyboard navigation

| **Keys** | **Actions** |
|---|---|
| Tab | Focus lands on the first navigation destination |
| Space or Enter | Selects the focused navigation destination, and focus moves to the newly opened section (if applicable) |
| Arrow | Navigate between destinations within the navigation drawer |

### Labeling elements

The accessibility label for a navigation item is typically the same as the destination name.<br><br>If the UI text is correctly linked, assistive tech (such as a screenreader) will read the UI text followed by the component’s role.<br><br>For Android Views (MDC-Android), a more descriptive accessibility label is not available to be set and the role is not announced.

*[image: A navigation drawer item’s label text and accessibility label both read “photos.” The role is “tab.”]*
A navigation drawer’s accessibility label can incorporate its adjacent UI text

When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation destination visibly labeled **Recents** would benefit from additional information in its accessibility label to clarify the destination’s intent.

*[image: A navigation drawer item’s label text is “recents”, the accessibility label is “recent images.” The role is “tab.”]*
While the visible label text reads **Recents,** the accessibility label for this destination clarifies its function: **Recent images**
