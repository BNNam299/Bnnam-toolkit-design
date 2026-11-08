<!-- Source: https://m3.material.io/components/fab-menu · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__fab-menu.md @ 3c0e291 -->

# FAB menu

## Overview

- Opens from a FAB to show 2–6 related actions floating on screen
- One FAB menu size for all sizes of FABs
- Not used with extended FABs
- Available in primary, secondary, and tertiary color sets

*[image: 3 FAB menus in different color schemes.]*
The FAB menu comes in three color sets: primary, secondary, tertiary

### Availability & resources

### M3 Expressive update

**May 2025**

The FAB menu adds more options to the FAB. It should replace the speed dial and any usage of stacked small FABs. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

New component added to catalog:

- One menu size that pairs with any FAB
- Replaces any usage of stacked small FABs

Color:

- Contrasting close button and item colors
- Supports dynamic color
- Compatible with any FAB color style

*[image: 4 screens. The FAB menu is on the first, and 3 FABs of different sizes are on the others.]*
The FAB menu uses contrasting color and large items to focus attention. It can open from any size FAB.

### Differences from M2

*[image: M2 speed dial.]*
M2: The speed dial used small round FABs

*[image: GM3 FAB menu.]*
M3: The FAB menu uses dynamic color and a larger item size

## Specs

### Variants

*[image: The FAB menu in its single variant.]*
There’s one variant of FAB menu

| Variant | M3 | M3 Expressive |
|---|---|---|
| FAB menu | -- | Available |

### Configurations

*[image: 3 color configurations of FAB menus.]*
Three color sets:

1. Primary
2. Secondary
3. Tertiary

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Color | Primary set, secondary set, tertiary set | -- | Available |

### Tokens & specs

Use the table's menu to switch token sets. The FAB menu has a common token set and six color sets, three for each element (close button and menu item). [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__fab-menu.md` — FAB menu - Common, FAB menu close button - Color - Tertiary, FAB menu list items - Color - Primary, FAB menu list items - Color - Secondary, FAB menu list items - Color - Tertiary, FAB menu close button - Color - Primary, FAB menu close button - Color - Secondary]*

### Anatomy

*[image: 2 elements of a FAB menu.]*
1. Close button
2. Menu item

*[image: 5 FAB menus showing the range of 2–6 items.]*
The FAB menu can have up to six items

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 12 colors of the FAB menu.]*
1. On primary container
2. Primary container
3. On primary
4. Primary
5. On secondary container
6. Secondary container
7. On secondary
8. Secondary
9. On tertiary container
10. Tertiary container
11. On tertiary
12. Tertiary

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states)

#### Close button

*[image: 4 states of the FAB menu close button.]*
Close button states in light and dark themes:

1. Enabled
2. Hovered
3. Focused
4. Pressed

#### Menu item

*[image: 4 states of the FAB menu items.]*
Menu item states in light and dark themes:

1. Enabled
2. Hovered
3. Focused
4. Pressed

### Measurements

FAB menu items share the same measurements as the medium button specs.

The close button should always be 56dp.

*[image: FAB menu size measurements.]*
FAB menu size measurements

The FAB menu animates from the top trailing edge of the FAB to ensure a smooth animation.

*[image: FAB on a mobile screen with 16dp margins annotated.]*
The FAB should always have 16dp margins

*[image: FAB menu opened from a FAB has matching margins of 16dp.]*
The close button and FAB share the top trailing corner as an anchor and appear in the same place

Larger FABs will place the FAB menu slightly higher, with larger margins underneath.

*[image: Medium FAB on a mobile screen with 16dp margins annotated.]*
The medium FAB placement has 16dp margins

*[image: FAB menu opened from the medium FAB has a 40dp margin from bottom of screen.]*
The close button is placed higher to align with the top of the medium FAB

*[image: Large FAB on a mobile screen with 16dp margins annotated.]*
The large FAB placement has 16dp margins

*[image: FAB menu opened from the large FAB has a 56dp margin from bottom of screen.]*
The close button is placed higher to align with the top of the large FAB

On web, the FAB menu opens from the FAB, and inherits its states and specs from the baseline menu component.

The gap between the FAB and menu can vary, but 4dp is recommended.

*[image: FAB menu on web states and specifications.]*
Spacing and interaction on FAB menu for web:

1. Enabled
2. Hovered
3. Selected

## Guidelines

*[image: On a page of music albums, a FAB menu shows options to make a new playlist, collection, or station.]*
Use the FAB menu to show multiple related actions in a prominent, expressive style

### Usage

A FAB menu opens from a FAB to show multiple related actions. It should always appear in the same place as the FAB that opened it.

This makes actions immediately accessible, and keeps the UI clean by concealing actions when they’re not needed.

Don’t open a FAB menu from an extended FAB or any other component.

*[image: 1 mobile screen with a FAB, 1 with a FAB menu. Both are right aligned.]*
The FAB menu should always open from a FAB

The FAB menu should be aligned to the trailing edge of the window.

In right-to-left (RTL) languages, this means the FAB and FAB menu should be aligned to the left edge, and the layout of elements should be mirrored.

*[image: 1 mobile screen with a FAB, 1 with a FAB menu. Both are left aligned and mirrored for a right-to-left language.]*
In RTL languages, the FAB menu should be left-aligned with the icon and text placement mirrored

FAB menus can contain 2–6 items. These should be closely related under a single action, like **Share**.

Avoid grouping unrelated actions in the same FAB menu.

*[image: A FAB menu with 5 options on a photo gallery UI.]* **✅ Do**
FAB menus can have 2-6 items

*[image: A FAB menu with 1 option on a photo gallery UI.]* **❌ Don't**
Don’t use a FAB menu with one item

When a FAB is paired with other components, like the floating toolbar or navigation rail, don’t use the FAB menu. This prevents cognitive overload and interface clutter.

*[image: A toolbar with a FAB directly next to it.]* **✅ Do**
FABs can be placed next to toolbars and other components

*[image: A toolbar with a FAB menu next to it.]* **❌ Don't**
Don't use a FAB menu with a toolbar or navigation rail

#### Color sets

FAB menus have three color sets: primary, secondary, and tertiary. Use the color set that best matches the FAB color style.

Use the primary FAB menu color set with the **primary** or **primary container** FAB color styles.

*[image: A FAB menu using the primary color set.]*
A primary FAB is paired with a primary FAB menu

Use the secondary FAB menu color set with the **secondary** or **secondary container** FAB color styles.

*[image: A FAB menu using the secondary color set.]*
A secondary FAB is paired with a secondary FAB menu

Use the tertiary FAB menu color set with the **tertiary** or **tertiary container** FAB color styles.

*[image: A FAB menu using the tertiary color set.]*
A tertiary FAB is paired with a tertiary FAB menu

### Anatomy

*[image: 2 elements of a FAB menu.]*
1. Close button
2. List item

FAB menu items should always have label text. The icons shouldn’t be removed since they make each item easy to identify.

*[image: A FAB menu with 3 options for selecting Food, People, or Nature. There are no icons next to the text.]* **⚠️ Caution**
Only remove the icon if necessary. The icon provides a differentiation between items.

*[image: A FAB menu with 3 options for selecting Food, People, or Nature. The options are only icons, no text.]* **❌ Don't**
Don’t remove the label

The list item should always hug its contents and look consistent. Avoid truncating text or setting fixed widths. All FAB menu elements should be rounded.

*[image: A FAB menu used out of the box with no configurations.]* **✅ Do**
Keep the padding between the container and icon, icon and text, and text and container consistent

*[image: FAB menu items are equal width despite having different lengths of text.]* **❌ Don't**
Don’t expand container sizes

*[image: FAB menu items are square instead of round.]* **❌ Don't**
Don’t change FAB menu shapes

### Adaptive layout

The FAB menu can open from any sized FAB. Use with a FAB size suitable for the window size class. For example, larger FABs are recommended for larger windows.

*[video: The same FAB menu used in medium and compact window sizes.]*
The FAB menu works in any window size. Pair it with the FAB suitable for that window size.

The FAB menu should remain anchored to the same corner or edge regardless of window size.

In large and extra large windows, the FAB and FAB menu margins should increase from 16dp to 24dp.

*[image: A FAB menu with 24dp margins from the edge of the window.]*
On desktop, use larger FABs and margins

On web, the FAB menu uses a menu component for an experience that's consistent with other desktop apps.

*[image: A FAB menu using menu component on web and traditional FAB menu on compact screen.]*
The same FAB menu options on both large window (left) and an Android compact window (right)

### Behavior

#### Appearing

The FAB should transform into the close button of the FAB menu. The menu items should appear using the [enter and exit](https://m3.material.io/styles/motion/transitions) transition.

Originate the transition from one of the FAB's trailing corners, preferably the top-aligned corner.

*[video: A FAB transforms into a FAB menu while anchoring the animation to the top right corner of the FAB.]*
Animate FAB menus from the top-aligned corner of FABs

To ensure accessibility for keyboard users on the web, avoid positioning the FAB menu to completely obscure the focus indicator of an actionable element. <br><br>Partially covering the desired element is fine, as long as the focus indicator is visible.

*[image: FAB menu doesn’t obscure actionable element and its focus indicator.]* **✅ Do**
Ensure the actionable element and its focus indicator are visible behind the FAB menu

*[image: FAB menu obscures both an actionable element and its focus indicator.]* **❌ Don't**
Don’t block an actionable element and its focus indicator completely with the FAB menu

#### Scrolling

When window height is limited, like when viewing phones in horizontal orientation, FAB menu items can scroll.

The items should scroll behind the close button.

*[video: A FAB menu with 6 items scrolls off screen on a horizontal-oriented device. Scrolled items move behind the close button.]*
FAB menus can scroll if the window height is too short to contain all the options

#### Expanding

Any FAB menu item can expand and adapt to any shape using a [container transform](https://m3.material.io/styles/motion/transitions) transition pattern. This includes a surface that is part of the app structure, or a surface that spans the entire screen.

*[video: A FAB menu item expands and transforms into a full screen dialog.]*
FAB menu items can transition into any kind of shape when selected

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Navigate and interact with the FAB menu
- Ensure focus is correct when navigating through the menu

### Interaction & style

FAB menu elements meet the minimum target size of 48dp.

*[image: FAB menu measurement annotations. All elements are larger than the minimum target size.]*
FAB menus have 48x48dp minimum width and sufficient spacing by default

When the FAB menu can scroll, make sure the items scroll behind the close button.

The close button should always be easy to access and unobstructed.

*[image: FAB menu items are scrolling behind the close button.]* **✅ Do**
Allow the menu items to scroll behind the close button

*[image: FAB menu items are scrolling in front of the close button.]* **❌ Don't**
Don’t obstruct the close button in short screens like horizontal orientation

### Initial focus

When the FAB is selected, the FAB menu opens, and initial focus remains on the close button, which takes the place of the original FAB.

Then the focus moves from the top menu item to the bottom.

*[image: 4 FAB menus with the focus order labelled. Focus moves from the close button at the bottom to the topmost menu item next.]*
Focus lands on the close button. People can then navigate through all the items.

1. Close button
2. First menu item
3. Second menu item
4. Third menu item

### Keyboard navigation

| **Keys** | **Actions** |
|---|---|
| **Tab** | Navigate to the next interactive element |
| **Space** or **Enter** | Activate the focused button or item |

### Labeling elements

#### Android

On Android, a FAB menu’s close button should include a state to tell screen readers what action will occur when it's toggled. The close button should be labeled:

- Label: Toggle menu
- Role: Button
- State: Expanded or collapsed

*[image: Accessibility labels for the close button on an Android device.]*
On Android, the **close button** accessibility labels should include a toggle menu label, button role, and an expanded or collapsed state

FAB menu items should be labeled:

- Label: Match the item’s UI text, such as **Reply all**
- Role: Button

*[image: Accessibility labels for a FAB menu item on an Android device.]*
Label FAB menu items to match their UI text, like **Reply all**, and use the button role

#### Web

On web, a FAB menu is a combination of a FAB and a menu component. The FAB opens the menu. Follow the [accessibility guidelines for FABs](https://m3.material.io/components/floating-action-button) and [menus](https://m3.material.io/components/menus).

The FAB's accessibility label should describe the menu that the FAB will open.
