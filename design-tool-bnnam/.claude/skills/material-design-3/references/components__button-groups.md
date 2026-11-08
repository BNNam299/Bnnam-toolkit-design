<!-- Source: https://m3.material.io/components/button-groups · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__button-groups.md @ 3c0e291 -->

# Button groups

## Overview

- Two variants: **standard** and **connected**
- Applies shape morph when pressed and selected
- Connected button groups replace the segmented button
- Works with all button sizes: XS, S, M, L, and XL
- Support for single-select, multi-select, and selection-required

*[image: A standard button group and a segmented button group.]*
Button groups can contain buttons and icon buttons

### Availability & resources

### M3 Expressive update

Button groups apply shape, motion, and width changes to buttons and icon buttons to make them more interactive. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

**May 2025**

New component added to catalog.<br><br>Variants and naming:

- Added standard button group
- Added connected button group
  - Use instead of segmented button, which is no longer recommended

Configurations:

- Works with all button sizes: XS, S, M, L, and XL
- Applies default shape to all buttons: round or square

*[image: Standard button group in 3 of 5 available sizes, and segmented button group with just icon buttons and just common buttons.]*
Button groups are containers that hold buttons of many shapes and sizes

## Specs

### Variants

*[image: Various colors and shapes of standard and connected button groups.]*
1. Standard button group
2. Connected button group

| Variant | M3 | M3 Expressive |
|---|---|---|
| Standard button group | -- | Available |
| Connected button group | Available as segmented button | Available |

### Configurations

*[image: Five sizes of button groups and two shapes of button groups.]*
Configurations for both variants of button groups:

1. Extra small
2. Small
3. Medium
4. Large
5. Extra large
6. Single-select and multi-select
7. Round and square

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Size | XS, S, M, L, XL | -- | Available |
| Default shape | Round, square | -- | Available |
| Selection | Single-select, multi-select, selection-required | Available as segmented button | Available |

### Tokens & specs

Standard and connected button group tokens are organized by size. Select the variant and size from the token set menu. Go to the [button](https://m3.material.io/components/buttons) and [icon button](https://m3.material.io/components/icon-buttons) pages to view their tokens. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__button-groups.md` — Button group connected - Size - Xlarge, Button group connected - Size - Large, Button group connected - Size - Medium, Button group connected - Size - Small, Button group connected - Size - Xsmall, Button group standard - Size - Xsmall, Button group standard - Size - Small, Button group standard - Size - Medium, Button group standard - Size - Large, Button group standard - Size - Xlarge]*

### Anatomy

Button groups are invisible containers that add padding between buttons and modify button shape. They don’t contain any buttons by default.

*[image: The container outlined on both variants of button groups.]*
1. Container

#### Common layouts

Mix and match buttons and icon buttons for different scenarios.

*[image: 4 common layouts of button groups.]*
1. Label buttons
2. Label buttons and icon buttons
3. Extra small icon buttons
4. Large icon buttons

#### Color

Button groups have no color properties. They can use the default button or toggle button color styles, like filled, tonal, and outlined. Avoid using standard icon buttons or text buttons, as they have no container treatment.

*[image: The container outlined on both variants of button groups.]*
1. Filled
2. Tonal
3. Outlined
4. Elevated

### Selection & activation

**Standard button groups** add interaction between adjacent buttons when a button is selected or activated.<br><br>This interaction changes the width, shape, and padding of the selected or activated button, which adjusts the width of buttons directly next to it.

*[video: A selected button in a standard group bounces against its adjacent button, changing their widths.]*
A selected button changes shape, and briefly changes the width of itself and adjacent buttons

**Connected button groups** don’t add any interaction between buttons when selected or activated.

They only affect the shape of the button being selected or activated.

*[video: A selected button in a connected button group only changes its own shape.]*
A selected button changes shape without affecting adjacent buttons

### States

#### Standard button group

When a button is pressed, standard button groups modify the width and shape of that button and adjacent buttons.

*[image: 5 states of a standard button group.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

When a toggle button is selected in a standard button group, its shape should change between square and round. The color should change according to the [button specs](https://m3.material.io/components/buttons).

*[image: 5 states of a standard button group with toggle buttons.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

#### Connected button group

Connected button groups have different shape changes than standard button groups. Selecting a button does not affect adjacent buttons.

*[image: 5 states of a segmented button group.]*
Connected button group unselected states:

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

*[image: 4 states of a segmented button group with toggle buttons.]*
Connected button group selected states:

1. Enabled
2. Hovered
3. Focused
4. Pressed

### Measurements

#### Standard button group

Standard groups apply padding between all buttons. The amount of padding changes based on button size to ensure a minimum accessible target size of 48dp. More details on padding: [Button specs](https://m3.material.io/components/buttons), [icon button specs](https://m3.material.io/components/icon-buttons)

*[image: Standard button group padding measurements.]*
Standard button group inner padding:

1. XS: 18dp
2. S: 12dp
3. M: 8dp
4. L: 8dp
5. XL: 8dp

#### Connected button group

For all connected button groups, use 2dp padding. This provides visual consistency at scale.

*[image: Connected button group padding and corner radius measurements.]*
Round connected button group inner padding is 2dp at every size. The outer shape is fully round, and the inner shape remains square with the following corner sizes:

1. XS: 4dp
2. S: 8dp
3. M: 8dp
4. L: 16dp
5. XL: 20dp

*[image: Connected button group padding and corner radius measurements for square buttons.]*
Square connected button group inner padding is 2dp at every size. The outer shape has the following corner sizes:

1. XS: 4dp
2. S: 8dp
3. M: 8dp
4. L: 16dp
5. XL: 20dp

#### Minimum widths

Extra small and small connected button groups have 48dp target areas and a minimum width of 48dp.

*[image: 48x48dp accessible target areas on the XS and S connected button groups.]*
1. Extra small
2. Small

### Density

Button groups adapt to density of the buttons inside. [More on density](https://m3.material.io/foundations/layout/grids-spacing)

*[image: Connected button groups at 0, -1, -2, and -3 density.]*
Button groups adapt to the height of the buttons inside, including when density is applied

## Guidelines

*[video: A video call with a standard button group. Selecting the mic changes shape and color, and bounces against adjacent buttons.]*
Standard button groups add interaction between adjacent buttons

### Usage

There are two variants of button groups: **standard** and **connected**. <br><br>**Standard button groups** add interaction between adjacent buttons so they respond to each other. When a button in a standard group is selected:

- The selected button changes shape and width
- A selected toggle button also changes color
- Adjacent buttons move and temporarily change width

*[image: A welcome screen with a colorful standard button group. 2 pink icon buttons are narrow, and 1 purple button is labelled “Get started".]*
Button groups add more expression to a product

Mix and match the different button variants, widths, and colors to emphasize what’s important, and to visually group related buttons.<br><br>By default, all buttons in a standard group should be the same size (XS to XL) and shape (round or square).

- Only use multiple sizes in a group for hero moments
- Avoid mixing sizes frequently
- Only use a different shape in a group when a button is selected, or to add meaning or contrast

*[image: A standard button group with 3 buttons of different colors but the same square shape.]* **✅ Do**
Use the same shapes for buttons in a group, but change other properties like width and color

*[image: A standard button group with 3 buttons, including a round primary button. A square button is used to add items.]* **⚠️ Caution**
Reserve shape differences in button groups for key interactions

**Connected button groups** help people select options, switch views, or sort elements in a page.

They behave similarly to standard groups, except they don’t affect adjacent buttons.

Connected groups should replace the baseline segmented button, which is no longer recommended.

*[video: Selecting a button in a connected button group labelled “My files,” “Shared,” and “Computers.”]*
Connected button groups can be used to toggle between similar actions

Use connected button groups when the button content is related, and buttons can be selected.

*[image: A shopping app with an option to choose the volume of an item using a connected button group.]*
Closely related actions work well in a connected button group

Connected button groups should be used for single or multi-select patterns that use toggle buttons.

Avoid using a connected group when none of the buttons can be toggled.

*[image: 2 filters using connected button groups of 2 and 4 items. The group with 4 items has multiple buttons selected.]*
Use the connected button group with single or multi-select patterns

#### Color

Avoid mixing color styles in connected button groups; it can make selection and emphasis unclear.

*[image: Selecting a button in a connected button group labelled “My files,” “Shared,” and “Computers.”]* **❌ Don't**
Don’t mix color styles in connected button groups

### Anatomy

*[image: 1 element of a button group.]*
1. Container

#### Container

The standard button group container has padding between buttons so they can animate width and shape without disrupting the product layout. <br><br>The standard button group hugs the width of the buttons inside.

*[image: The container hugs the buttons. Inner padding is highlighted.]*
Button groups can animate without affecting their surroundings

The connected button group should span the width of the page or surface it’s placed on, increasing the button widths inside.

In larger windows, consider adding a maximum width to the connected group to avoid it growing too wide.

*[image: 2 connected button groups, with 2 and 4 buttons respectively, spanning the same width on a screen, with margins from the edge.]*
Connected button groups increase the widths of each button inside and expand to their container width

### Adaptive design

Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. [More on adaptive design](https://m3.material.io/foundations/layout/layout-overview)

#### Resizing

Button groups should move through layouts together in a single line. They shouldn’t wrap to a second line. Multiple button groups can be stacked to keep items close together. However, button groups don’t interact vertically.

Button groups and individual buttons can be set to **fixed** or **flexible** resizing:

- **Fixed**: Manually define the button width (narrow to wide), size (XS to XL), or padding at each breakpoint.
- **Flexible**: Automatically increase or decrease the width of buttons and the button group. Button groups grow until all flexible buttons are at their largest width.

If adjusting button width manually, avoid stretching icon buttons beyond the wide setting.

*[image: Two button groups, each with distinct width, size, and padding adjusted to fit two different window sizes.]*
Buttons can have width, size, and padding manually adjusted to fit different breakpoints

In compact windows, consider using smaller, narrower buttons so all buttons in the button group can fit. In large and extra large windows, consider using larger, wider buttons to better fill in the available space.

Flexible buttons or button groups will automatically adjust width.

*[video: Button group is adjusted to fill the window size.]*
Set the size, shape, and padding to manually adjust the button group at different breakpoints

When scaling to larger breakpoints, make sure that the visual hierarchy of each button is preserved using qualities like color and size. <br><br>For example, the primary action should remain the largest, widest, or most visually prominent button at all breakpoints.

*[video: Narrow buttons in a group on a compact window become a mixture of wide and narrow buttons on a larger window.]*
Maintain hierarchy across layouts and devices

#### Presentation

Buttons at the trailing edge of the button group can be customized to collapse into an overflow menu at smaller breakpoints, and become visible again at larger sizes. Place the overflow menu at the trailing end of the group.

Buttons outside the group aren’t affected by button group behavior.

*[video: Buttons collapse into an overflow menu when window size shrinks, and reappear when window size expands.]*
Buttons should become hidden in an overflow menu or visible again, depending on screen size. Buttons outside the button group, like the **end call** button, will not be affected.

### Behavior

#### Pressed

When a button is pressed, it changes width and shape.<br><br>In a standard button group, pressing a button also affects the width of adjacent buttons.<br><br>In a connected button group, only the shape of the pressed button changes.

*[video: In a calculator app, pressing numbers changes the width of adjacent numbers.]*
Pressing buttons in a standard group changes the width of adjacent buttons

#### Selected

A selected button should change shape from round to square, or square to round.

*[video: A video call with a standard button group. Selecting the mic changes shape and color, and bounces against adjacent buttons.]*
Selected buttons should change shape

## Accessibility

### Use cases

People should be able to do the following with assistive technology:

- Navigate to and interact with each button in the group
- Identify when buttons are selected

### Interaction & style

Each button in a group should have a minimum 48x48dp target. <br><br>Extra small and small button groups have larger inner padding to ensure accessible targets. Avoid reducing the padding in these sizes.

*[image: Extra small and small button groups with 48x48dp target areas annotated over top. The area is larger than the buttons.]*
1. Extra small button group
2. Small button group

#### Initial focus

The button group container is not a focusable element. Initial focus should land on the first button in the group and then move to each button.

*[image: Focus order lands on the first button, then the next buttons.]*
Initial focus should land on the first button, not on the container

Use **Tab** to navigate to a button group, the arrow keys to navigate between each item in the group, and **Space** or **Enter** to select a focused button.

*[image: Button group with annotations for navigation with Tab and selecting with Space or Enter.]*
1. **Tab**: Initial focus lands on the first button
2. Arrow keys: Navigate between items
3. **Space** or **Enter**: Selects a focused item

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Navigate between buttons |
| Arrow keys | Navigate inside the component |
| **Space** or **Enter** | Activate a focused button |

### Labeling elements

The button group container doesn't need to be labeled. Label each button according to the button and icon button accessibility guidance.

*[image: In a messaging products, an email icon is labelled “email” with the role “button”.]*
Label each button within the button group
