<!-- Source: https://m3.material.io/components/navigation-bar · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__navigation-bar.md @ 3c0e291 -->

# Navigation bar

## Overview

- Use navigation bars in compact or medium window sizes
- Can contain 3-5 destinations of equal importance
- Destinations don't change. They should be consistent across app screens.

*[image: Two navigation bars of different widths with 4 destinations.]*
Navigation bar for compact and medium window sizes

### Availability & resources

### M3 Expressive update

**May 2025**

A new flexible navigation bar was introduced to replace the baseline navigation bar. It’s shorter and supports horizontal navigation items in medium windows. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Baseline navigation bar is no longer recommended
- Added **flexible**navigation bar
  - Shorter height
  - Can be used in medium window sizes with horizontal navigation items

Color:

- Active label changed from **on-surface-variant** to **secondary**

*[image: Navigation bar in M3 Expressive. It’s shorter than the baseline nav bar.]*
The flexible navigation bar is shorter and can be used in medium windows with horizontal nav items

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- Elevation: No shadow
- Layout: Container height is taller
- States: The active destination can be indicated with a pill shape in a contrasting color
- Name: Bottom navigation has been renamed **navigation bar**

*[image: M2 nav bar with a drop shadow and no active indicator.]*
M2: A drop shadow indicates placement on top of content. Filled and regular weight icons indicate active states.

*[image: M3 nav bar with a surface color and active indicator.]*
M3: Taller and no drop shadow. Filled icons and an active indicator indicate active state.

## Specs

### Variants

*[image: The recommended flexible navigation bar.]*
1. Flexible navigation bar

#### Baseline variants

The baseline nav bar is no longer recommended, and should be replaced by the flexible nav bar, which is shorter and supports horizontal navigation items in medium windows. [View baseline nav bar specs](https://m3.material.io/components/navigation-bar)

*[image: 1 baseline navigation bar.]*
1. Navigation bar (not recommended)

| Variant | M3 | M3 Expressive |
|---|---|---|
| Flexible navigation bar | -- | Available |
| Navigation bar | Available | Not recommended.Use **flexible navigation bar**. |

### Configurations

In compact windows, navigation bars use vertical items. In medium windows, navigation bars should use horizontal items.

*[image: Two size configurations for navigation bar and items.]*
1. Vertical navigation items
2. Horizontal navigation items

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Navigation item layout | Vertical (default) | Available | Available |
| Horizontal | -- | Available |  |

### Tokens & specs

Use the table's menu to switch between token sets for the navigation bar and the nav items. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__navigation-bar.md` — Nav bar - Common, Nav bar - Item - Vertical, Nav bar - Item - Horizontal, Navigation bar (baseline)]*

### Anatomy

*[image: Seven elements of the navigation bar.]*
1. Container
2. Icon
3. Label text
4. Active indicator
5. Small badge (optional)
6. Large badge (optional)
7. Large badge label

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Six color roles of the navigation bar.]*
Navigation bar color roles used for light and dark schemes:

1. Surface container
2. On-secondary container
3. Secondary
4. Secondary container
5. On-surface variant
6. On-surface variant

For badge color roles, go to [badge specs](https://m3.material.io/components/badges).

### States

States are visual representations used to communicate the status of a component or an interactive element.

*[image: Four states of the navigation bar items.]*
1. Enabled
2. Hovered (8% state layer)
3. Focused (10% state layer)
4. Pressed (10% state layer)

### Measurements

The navigation bar stretches the full window width.

*[image: Navigation bar padding and size measurements.]*
Navigation bar padding and size measurements

Vertical navigation items dynamically change width to equally fit the container. Horizontal navigation items have a fixed width, so extra space is added to the ends of the navigation bar instead.

*[image: Navigation bar and item widths.]*
Navigation bar width and margins for compact and medium windows.

1. Vertical navigation item
2. Margin from window edge
3. Horizontal navigation item

---

### Baseline navigation bar

*[image: 7 elements of baseline navigation bar.]*
1. Container
2. Icon
3. Label text
4. Active indicator
5. Small badge
6. Large badge
7. Large badge label

#### Tokens & specs

These tokens are for the baseline navigation bar.

*[Token table (measurements, color, shape): `tokens__components__navigation-bar.md` — Nav bar - Common, Nav bar - Item - Vertical, Nav bar - Item - Horizontal, Navigation bar (baseline)]*

#### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 6 color roles of baseline navigation bar.]*
Navigation bar color roles used for light and dark schemes:

1. Surface
2. On secondary container
3. On surface
4. Secondary container
5. On surface variant
6. On surface variant

For badge color roles, go to [badge specs](https://m3.material.io/components/badges).

#### States

States are visual representations used to communicate the status of a component or an interactive element.

*[image: 4 states of baseline navigation bar.]*
Navigation bar states:

1. Enabled
2. Hovered
3. Focused
4. Pressed

### Measurements

*[image: Baseline navigation bar padding and size measurements.]*
Navigation bar padding and size measurements

*[image: Baseline navigation bar target size and margins.]*
Navigation bar target size and margins

### Configurations

*[image: 3 configurations of the baseline navigation bar.]*
1. 3 destinations
2. 4 destinations
3. 5 destinations

## Guidelines

*[image: A nav bar with vertical items in a compact window, and horizontal items in a medium window.]*
Navigation bars adapt to different breakpoints

### Usage

Navigation bars provide access to three to five destinations. The nav bar is positioned at the bottom of windows for convenient access.

Each destination is represented by an icon and label text. One navigation destination is always active.

When a navigation bar icon is tapped or focused, people are taken to the navigation destination associated with that icon.

*[image: A nav bar for a music app with 4 destinations: Home, Browse, Radio, Library, It’s in a compact window.]*
Navigation bars can have three to five destinations

Navigation bars should be used for:

- Three to five main pages in the product
- Mobile or tablet only

Navigation bars shouldn’t be used for accessing single tasks, such as viewing one email.

*[image: A nav bar for a music app with 4 destinations: Home, Browse, Radio, Library. It’s in a medium window.]*
On mobile or tablet, navigation bars should be used for top-level destinations

The navigation items can be **vertical** or **horizontal**.

- Use vertical items in compact windows, like mobile
- Use horizontal items in medium windows, like tablets

*[image: A nav bar with vertical items in a compact window, and horizontal items in a medium window.]*
Vertical navigation items work best in compact windows. Horizontal items work best in medium windows.

For products with more than five navigation items, don’t use a navigation bar; the elements may collide and there likely won’t be enough space for translated text.<br><br>Instead, consider using tabs to organize similar content within a page, or hide the navigation behind a menu icon using a modal expanded navigation rail.

*[image: A nav bar with 7 items in a compact window.]* **❌ Don't**
Avoid putting more than five navigation items in a navigation bar

*[image: A nav bar with no labels for each page item.]* **❌ Don't**
Don’t remove the labels from navigation items

*[image: A nav bar with 2 page items.]* **❌ Don't**
Don’t use a navigation bar for fewer than three destinations. Instead, use tabs.

*[image: A nav bar is on the Library page of a music app. Tabs at the top of the page have secondary navigation for playlists, artists, albums, and songs.]*
Use navigation for distinct pages and tabs for related content within a page

*[image: Nav bar using horizontal items in a compact window. The items are too wide and flow off screen.]* **❌ Don't**
Navigation bar destinations have fixed positions. Don’t scroll them or modify their positions.

### Anatomy

*[image: 6 elements of the nav bar.]*
1. Container
2. Icon
3. Label text
4. Active indicator
5. Large badge (optional)
6. Small badge (optional)

#### Container

The container should always be placed at the bottom of the product and span the full length of the window. Navigation items are centered within the container.<br><br>The container has a color fill to provide separation from other content.

*[image: The nav bar at the bottom of a medium window has a color fill to differentiate from the background.]*
The navigation bar container holds all elements

#### Navigation items

Navigation items hold all elements for each destination: the icon, label text, and active indicator. They can be **vertical**, with the text below the icon and indicator, or **horizontal**, with the icon and text beside each other inside the indicator. <br><br>Vertical items are best in compact windows, and horizontal items are best in medium windows.<br><br>Horizontal items are centered in the nav bar with outer margins.

*[image: The nav bar in a medium window with padding on each side.]*
The navigation bar is divided into equal-width segments with padding from the window edge

#### Icons

Navigation rail items must use icons that symbolize the content of their page. Browse [popular icon](https://fonts.google.com/icons).<br><br>Use a filled icon for the active destination and outlined icons for inactive destinations. If an icon doesn’t have a filled version, apply **semibold** weight to the icon instead.

*[image: An active nav item with a filled icon compared to inactive items with outlined icons.]* **✅ Do**
Use filled icons when the navigation item is active

*[image: An active nav item with a semibold icon compared to inactive items with outlined icons.]* **⚠️ Caution**
If a filled version of an icon is unavailable, the icon’s weight must increase

Active and inactive icons must have a minimum 3:1 contrast ratio with the container.

*[image: 4 nav items that are each different colors with low contrast with the background.]* **❌ Don't**
Don’t use multiple or low-contrast colors in a navigation bar, as they make it harder for people to distinguish the active item and navigate to other destinations

#### Active indicator

The active indicator shows which page from the nav bar is currently being displayed.

*[image: The current page in a nav bar has an active indicator.]* **✅ Do**
Use the active indicator only for the active destination

*[image: All items in a nav bar have active indicators.]* **❌ Don't**
Don’t use the active indicator for more than one destination at a time

#### Label text

The label text should be a short, meaningful description of each navigation destination and another way for people to understand an icon’s meaning.<br><br>All navigation items require a label text. It should be 1-2 words.

*[image: A nav bar on a music app with clearly labelled destinations: home, browse, radio, library.]*
Label text must be brief and clear

*[image: A nav bar with 1-word labels for each page.]* **✅ Do**
Use brief text labels to identify the purpose of a destination

*[image: A nav bar with “Music catalog” for a label. The label is truncated.]* **❌ Don't**
Don’t wrap or truncate text as it can make the label hard to understand

*[image: A nav bar with “Music catalog” for a label. The label is a smaller size to make the text fit.]* **❌ Don't**
Don’t shrink longer text to fit on a single line

#### Badges (optional)

Navigation bars can display badges in the upper right corners of the destination icon.<br><br>Badges can contain dynamic information, such as the number of new messages.

*[image: A nav bar with a destination called “Go” with a small badge and one called “Saved” with a large badge saying “3.”]*
Use a small badge to indicate an update, and a large badge to show the amount of updates

*[image: Horizontal nav items with the badges in the same place of the icon as vertical nav items.]*
Badges overlap the icon in both vertical and horizontal navigation items

### Placement

The floating action button (FAB) is placed above the navigation bar. Nav bars are always placed at the bottom of the window.

*[image: The FAB should be right-aligned above the navigation bar]* **✅ Do**
The FAB should be right-aligned above the navigation bar

*[image: A mobile page with a FAB overlapping a nav bar.]* **❌ Don't**
Don’t cover the navigation bar with a FAB

Navigation bars can be temporarily covered by dialogs, bottom sheets, navigation drawers, the on-screen keyboard, or other elements needed to complete a flow. They should not be permanently obstructed on any screen.

*[video: The navigation bar being covered by a bottom sheet when users take an action on screen.]*
The search feature of the screen triggers the on-screen keyboard, temporarily covering the bottom navigation bar until the search flow is completed

### Adaptive design

Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. More on [adaptive design](https://m3.material.io/foundations/layout/layout-overview)

#### Resizing

Only use navigation bars for compact and medium breakpoints.

**Compact**: For narrow windows, use a navigation bar or modal navigation rail.

**Medium**: Use a navigation bar or navigation rail. Decide based on whether horizontal or vertical space is more important.

**Expanded and extra-large**: Use a navigation rail instead. Decide based on available window space and the number of navigation destinations.

*[video: A music app with a nav bar adapting to larger screens, where it changes to horizontal items, and then into a nav rail.]*
Navigation bars are best suited for compact and medium breakpoints

The navigation bar container spans 100% of the window width.

*[image: Navigation bar spanning the full width of a compact window.]*
Navigation bars use 100% of the screen width

The navigation bar is used on smaller devices. It’s not intended for desktop.

*[image: Navigation bar spanning the full width of an expanded window size.]* **❌ Don't**
Don’t use navigation bars for desktop layouts. Instead, use a navigation rail or tabs.

#### Presentation

In medium breakpoints, use horizontal nav items to better use available space.

Horizontal nav items should remain centered with the same padding at each breakpoint.

*[image: Horizontal nav items have the same width in medium and expanded windows. Only the padding changes.]*
A navigation bar in horizontal orientation keeps the same spacing between destinations

### Behavior

#### Navigation

When selecting a navigation bar item not currently selected, the product navigates to that destination’s screen using a [top level](https://m3.material.io/styles/motion/transitions) transition pattern. It can either remember where you left off, or reset to the default view.

1. **Preserve state**: If someone has interacted with this destination, it returns to their scroll position, current tab, and in-line search status.
2. **Reset state**: Any prior user interactions are reset, including scroll position, tab selection, and in-line search.

Choose the behavior that best suits the product and user needs. For example, an app that requires frequent switching between sections should preserve each section’s state.

*[video: After selecting an item on the bottom navigation bar, the app navigates to that destination’s screen]*
After selecting an item on the bottom navigation bar, the app navigates to that destination’s screen

Re-selecting the currently active destination should reset the scroll position to the top of the page.

**Don't swipe between destinations**<br>Swiping across the screen does not navigate between destinations, and is not supported by the navigation bar. Swipe behavior should be reserved for related items, such as cards in a carousel, or actions such as archiving a list item.

*[video: Selecting the currently active nav item scrolls the page content back to the top.]*
Selecting the already selected navigation item scrolls to the top of the screen

#### Scrolling

Upon scroll, the navigation bar can appear or disappear.

Don’t hide the navigation bar on scroll when a [screen reader](https://m3.material.io/foundations/overview/assistive-technology#ec6f3e84-a51c-4dc0-a353-6844f5bde698) is active.

*[video: When scrolling on the page, the nav bar scrolls the opposite direction off screen.]*
Scrolling downward can hide the navigation bar; scrolling upward reveals it

#### Selection

The icon becomes filled and the active indicator expands from the center of the icon when switching between destinations.<br><br>The active indicator animation should only apply on one axis to better represent a flat, shared plane.

*[video: The active indicator expands from the target when a destination is selected]*
An active indicator appears when the item is selected.

When a destination is tapped, the destination screens use a [top level](https://m3.material.io/styles/motion/transitions) transition pattern. In addition, the icon becomes filled and the active indicator expands from the center of the icon.

*[video: Selecting the home item changes the entire page contents.]*
Tapping a destination uses a top level transition pattern

## Accessibility

### Use cases

People should be able to do the following using the assistive technology:

- Move between navigation destinations
- Select a particular navigation destination from a set
- Get appropriate feedback based on input type

### Interaction & style

**Touch**

- When a navigation item is tapped, the active indicator appears in place, providing feedback that it’s selected
- A touch ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color

*[video: On a navigation bar, when the Home and Explore icons are tapped, an active indicator is displayed as interaction feedback.]*
Touch: Tap

**Cursor**

- When hovered, the active indicator appears in a reduced state providing a visual cue that the destination is interactive
- When clicked (in both active and inactive states), a ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color, becoming darker

*[video: On a navigation bar, the hover and click interactions on the Home and Explore icons have different interaction feedback.]*
Cursor: Hover, Click

#### Text scaling and truncation

When someone sets their device to show a larger text size, the navigation bar should grow vertically to accommodate larger labels while retaining the default padding. It’s okay for scaled text to wrap in navigation items.

To remain accessible, ensure the full label is always visible on-screen at up to 2x text sizing. Beyond this size, text can truncate.

*[image: Nav bar with text scaled to 1.5x size. Some labels are on two lines, others are on one line.]*
Text scaled to 1.5 size

*[image: Nav bar with text scaled to 2x size. Some labels wrap to two lines.]*
Text scaled to 2x size

### Initial focus

Initial focus lands directly on the first navigation item, since that is the first interactive element of the component.

*[image: Focus order and keyboard navigation of a nav bar.]*
Focus lands on first navigation item

*[image: Activating a nav item with space on a keyboard.]*
The navigation item is selected with Space/Enter

### Visual indicators

Use a filled icon with a bold label for selected destinations. For unselected destinations use an outlined icon with a medium label.<br><br>If an icon doesn’t have a filled style, use a thicker or heavier version of the icon instead.

*[image: A nav bar with a filled icon for the selected nav item.]* **✅ Do**
Use a filled icon for the selected navigation destination to differentiate from the other destinations

*[image: A nav bar with an outlined icon for the selected nav item.]* **❌ Don't**
Don’t use outlined icons on selected nav items

*[image: 2 nav items, one selected, one unselected.]*
When selected, the icon fills, darkens, and is backed by an active indicator shape

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab | Move between navigation items |
| Space / Enter | Selects the focused navigation item |

### Labeling elements

The accessibility label for a navigation item is typically the same as the destination name.

*[image: Accessibility label and role defined for a Home icon on a navigation bar.]*
A navigation bar’s accessibility label can incorporate its adjacent UI text

When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation destination visibly labeled **Library**would benefit from additional information in its accessibility label to clarify the destination’s intent.<br><br>Note: On Android Views (MDC-Android), a more descriptive accessibility label is not available and the role is not announced.

*[image: Accessibility labels of a navigation bar.]*
While the visible label text reads **Library**, the accessibility label for this destination clarifies its function: **Music library**
