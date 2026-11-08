<!-- Source: https://m3.material.io/components/split-button · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__split-button.md @ 3c0e291 -->

# Split buttons

## Overview

- Use to show an action with a menu of related actions
- Same size range as buttons and icon buttons: XS, S, M, L, XL

*[video: An extra large split button. It has a label and icon on one part of the button, and a menu icon on the other part.]*
Split buttons are made of a common button and a menu icon button

### Availability & resources

### M3 Expressive update

**May 2025**

The split button has a separate menu button that spins and changes shape when activated. It can be used alongside other buttons of the same size. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

New component added to catalog.<br><br>Sizes:

- Extra small
- Small
- Medium
- Large
- Extra large

Color styles:

- Elevated
- Filled
- Tonal
- Outlined

*[image: 5 sizes of split buttons.]*
Split buttons have the same five recommended sizes as label and icon buttons

## Specs

### Variants

*[image: 1 type of split button.]*

| Variant | M3 | M3 Expressive |
|---|---|---|
| Split button | -- | Available |

### Configurations

*[image: 4 colors and 5 sizes of split buttons.]*
1. Color configurations: Elevated, filled, tonal, outlined
2. Size configurations: XS, S, M, L, XL

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Size | XS, S, M, L, XL | -- | Available |
| Color | Elevated, filled, tonal, outlined | -- | Available |

### Tokens & specs

Use the table's menu to select a token set. Split button token sets are organized by size. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__split-button.md` — Button - Color - Elevated, Button - Color - Tonal, Button - Color - Filled, Split button - Size - Xsmall, Split button - Size - Small, Split button - Size - Medium, Split button - Size - Large, Split button - Size - Xlarge, Button - Color - Outlined]*

### Anatomy

*[image: 4 elements of a split button.]*
1. Leading button
2. Icon
3. Label text
4. Trailing button

The leading button in split buttons can have an icon, label text, or both. The trailing button should always have a menu icon.

*[image: 3 customizations of the leading button in the split button.]*
1. Label + icon
2. Label
3. Icon

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value.

Split buttons use the same color schemes as standard buttons. However, unlike toggle buttons, the split button color doesn’t change when selected—only a state layer is applied.

Split buttons use the same colors and state layers as buttons, shown in the following token module. [Go to buttons](https://m3.material.io/components/buttons) for more details.

*[image: 4 color roles of the split button when unselected and selected in light and dark theme.]*
A: Unselected, B: Selected trailing icon

1. Elevated
2. Filled
3. Tonal
4. Outlined

*[Token table (measurements, color, shape): `tokens__components__split-button.md` — Button - Color - Elevated, Button - Color - Tonal, Button - Color - Filled, Split button - Size - Xsmall, Split button - Size - Small, Split button - Size - Medium, Split button - Size - Large, Split button - Size - Xlarge, Button - Color - Outlined]*

### States

States are visual representations used to communicate the status of a component or an interactive element.

Split button states use the same colors and state layers as buttons and icon buttons. Go to those specs for details.

#### Leading button shape

The inner corners change shape for hovered, focused, and pressed states.

*[image: 5 states of the leading button in the split button.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed, pressed with focus

#### Trailing button shape

The inner corners change shape for hovered, focused, and pressed states, and the icon becomes centered when selected.

*[image: 6 states of the trailing menu button in the split button.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed, pressed with focus
6. Selected, selected with focus

### Measurements

Text and icons are optically centered when the buttons are asymmetrical. They’re centered normally when symmetrical.

*[image: Padding and size measurements of the split button.]*
Menu icon offset when unselected:

1. XS: -1dp from center
2. S: -1dp from center
3. M: -2dp from center
4. L: -3dp from center
5. XL: -6dp from center

The inner corner radius changes depending on button sizing. The space should always be 2dp.

*[image: Inner padding and inner corner measurements of the split button.]*
1. Extra small 4dp
2. Small 4dp
3. Medium 4dp
4. Large 8dp
5. Extra large 12dp

## Guidelines

*[image: Split buttons of many colors and sizes scattered.]*
Split buttons come in many sizes and colors

### Usage

Split buttons are used to add a menu of actions alongside a main action. This reduces visual complexity by hiding extra options. Split buttons work well alone or alongside common buttons and icon buttons.

*[image: A split button applied a filter of “Canada” to a list of activities. Three narrow buttons are next to it to share, favorite, and bookmark.]*
Split buttons on their own can grab attention

Split buttons have five recommended sizes. These sizes match the sizes offered on buttons and icon buttons:

- Extra small
- Small (default)
- Medium
- Large
- Extra large

Scale up the split button in large breakpoints, or to create more emphasis in smaller windows.

*[image: A large split button in a compact window draws attention to buying an enamel mug in an online store.]*
Using large split buttons on small screens can add extra emphasis for hero moments

Split buttons can be used alongside other buttons and button groups.

*[image: A vibrant split button for starting a car drive is next to 2 muted icon buttons for bookmarking and sharing the trip.]*
Split buttons work harmoniously with regular buttons

Split buttons can be of different sizes from other buttons on the page, especially since they take up more space.

*[image: A media player has a split button for changing the speed quickly, or opening a menu of options.]*
The most prominent controls can be larger while secondary controls in a split button can be smaller

The split button typically opens a menu, but can be customized to open other components like cards.

*[image: A split button opens a menu with a vibrant color scheme.]* **✅ Do**
Open a menu from a split button

*[image: A split button opens a menu with an irregular shape highlighting the selected item.]* **❌ Don't**
Avoid modifying the menu in unusual ways

### Anatomy

*[image: 4 elements of a split button.]*
1. Leading button
2. Icon
3. Label text
4. Trailing button

The leading button should be brief, just one or two words, with an icon that best matches the action.<br><br>The trailing button should always have the expand and collapse icon since it rotates when selected. Avoid modifying the icon.

*[image: A split button for starting driving directions has a label “32 minutes away” and a refresh icon instead of a menu icon.]* **❌ Don't**
Avoid using very long labels or changing the trailing icon

In right-to-left languages, the component layout is mirrored.

*[image: The split button elements are reversed in a right-to-left language.]*
Split buttons mirror the order of elements in right-to-left languages

### Behavior

The split button uses the standard motion scheme (not the expressive motion scheme) when rotating the menu button.

The menu button rotates inwards 180° when opened and closed.

*[video: The trailing menu button spins 180° to point up, and applies a 10% state layer when selected.]*
Selecting the menu button rotates the icon inwards and applies shape morph

#### Menu placement

When using the split button with a menu, align the menu with the trailing button when possible.

*[image: A split button with an open menu. The leading edge of the menu is aligned to the leading edge of the menu button.]*
Align the menu with the trailing button

If there’s not enough room, align the menu to one of the sides of the button.

*[image: A split button with an open menu. The trailing edge of the menu is aligned to the trailing edge of the menu button.]*
If not possible, align the menu to the side of the leading or trailing button

Depending on breakpoint, scroll position, and other factors, the menu may need to appear elsewhere around the button. Always try to align it with one of the edges of the button.

The menu should be 4dp from the split button.

*[image: 6 other ways the menu can align to the split button.]*
1. Top aligned to trailing button
2. Bottom aligned to trailing button
3. Top right-aligned
4. Top left-aligned
5. Bottom right-aligned
6. Bottom left-aligned

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Navigate to each button and interact with them
- Navigate to any element opened by the trailing button
- Understand the current selection state of the button

### Interaction & style

Each button in the split button needs a minimum target area of 48x48dp. Extra small and small split buttons are shorter than 48dp, so the target areas around them need to be at least 48dp tall.

*[image: Diagram showing extra small and small split buttons with visible 48x48dp target areas.]*
Target areas should be at least 48x48dp

1. Extra small
2. Small

### Initial focus

Focus should land on the leading button then move to the trailing button. This can depend on the operating system’s settings.

*[image: Focus on the leading button and trailing button for both LTR and RTL languages.]*
1. Left to right
2. Right to left

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab | Navigate between buttons |
| Space or enter | Activate focused button |

### Labeling elements

The accessibility label for the leading button is the same as buttons.

*[image: “Watch later” is both the button label text and the accessibility label.]*
Leading buttons should have the same labels as common buttons

The trailing icon button should have an extra state or similar label indicating that the menu is expanded or collapsed.<br><br>Label the button to clearly indicate that there are more options. The label of the secondary button should indicate that it provides additional choices related to the action of the main button. For instance, if the main button says "Watch later," the secondary button should be something like "More watch options."<br><br>Label the opened menu according to the [menu accessibility guidance](https://m3.material.io/components/menus).

*[image: Collapsed state indicated for the trailing button.]*
Trailing buttons should communicate the state of the menu and that more options are available
