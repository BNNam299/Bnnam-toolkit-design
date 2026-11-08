<!-- Source: https://m3.material.io/components/icon-buttons · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__icon-buttons.md @ 3c0e291 -->

# Icon buttons

## Overview

- Icon buttons must use a system icon with a clear meaning
- Two variants: default and toggle
- Many configurations: Color, size, width, and shape
- On web, display a tooltip describing the action while hovering
- In toggle buttons, use the outlined style of an icon for the unselected state, and the filled style for the selected state

*[image: 5 kinds of outline buttons.]*
Standard, filled unselected, filled selected, filled tonal, and outlined icon buttons

### Availability & resources

### M3 Expressive update

**May 2025**

Icon buttons now have a wider variety of shapes and sizes, changing shape when selected. When placed in button groups, icon buttons interact with each other when pressed. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Default and toggle (selection)
- Color styles are now configurations. (filled, tonal, outlined, standard)

Shapes:

- Round and square options
- Shape morphs when pressed
- Shape morphs when selected

Sizes:

- Extra small
- Small (default)
- Medium
- Large
- Extra large

Widths:

- Narrow
- Default
- Wide

*[image: Icon buttons can vary in size, shape, and width.]*
1. Five sizes
2. Two shapes
3. Three widths

### Differences from M2

- **Color:** New color mappings and compatibility with dynamic color
- **Variants and naming:**Icon buttons were called toggle buttons. There are now two variants of icon buttons: default and toggle.

*[image: Icon buttons were known as toggle buttons in M2.]*
1. Default icon buttons
2. Toggle icon buttons

## Specs

### Variants

*[image: Side by side view of default and toggle icon buttons.]*
1. Default icon button
2. Toggle icon button

| Variant | M3 | M3 Expressive |
|---|---|---|
| Default | Available | Available |
| Toggle (selection) | Available | Available |

### Configurations

*[image: Side by side view of size, shape, color, and width variations.]*
1. Five sizes
2. Two shapes
3. Four color styles
4. Three widths

| Category | Options | M3 | M3 Expressive |
|---|---|---|---|
| Size | Small (default) | Available | Available |
| XS, M, L, XL | -- | Available |  |
| Shape | Round (default) | Available | Available |
| Square | -- | Available |  |
| Color | Filled (default), tonal, outlined, standard | Available | Available |
| Width | Default | Available | Available |
| Narrow, wide | -- | Available |  |

### Tokens & specs

Icon button token sets are organized by common tokens, color, and size. Select the token set from the table’s menu. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__icon-buttons.md` — Icon button - Color - Outlined, Icon button - Size - Xsmall, Icon button - Size - Small, Icon button - Size - Medium, Icon button - Size - Large, Icon button - Size - Xlarge, Icon button - Color - Filled, Icon button - Color - Tonal, Icon button - Color - Standard, Icon button (baseline), [Deprecated] Icon button - Outlined, [Deprecated] Icon button - Tonal, [Deprecated] Icon button - Filled]*

### Anatomy

*[image: Diagram indicating anatomy of filled icon button.]*
1. Icon
2. Container

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value.

There are four built-in color styles: filled, tonal, outlined, and standard. Default and toggle buttons use different color roles per style.

> **Note:** These color roles were chosen to create design coherence and familiarity. Other color roles can be used as long as the container and text have a 3:1 contrast ratio. For example, tertiary and on tertiary.

*[image: Color roles of default and toggle buttons in 4 visual styles.]*
A: Filled, B: Tonal, C: Outlined, D: Standard

1. Default
2. Toggle, unselected
3. Toggle, selected

|  | 1. Default | 2. Toggle, unselected | 3. Toggle, selected |
|---|---|---|---|
| Filled containerFilled icon | Primary On primary | Surface containerOn surface variant | Primary On primary |
| Tonal containerTonal icon | Secondary containerOn secondary container | Secondary containerOn secondary container | Secondary On secondary |
| Outlined containerOutlined icon | Outline variant (outline)On surface variant | Outline variant (outline)On surface variant | Inverse surfaceInverse on surface |
| Standard icon | On surface variant | On surface variant | Primary |

### States

States are visual representations used to communicate the status of a component or interactive element. State layers slightly change button color. Disabled states have different base colors. [View tokens for details](https://m3.material.io/foundations/design-tokens)

#### Filled button states

##### Default

*[image: 5 states of filled icon button.]*
1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

##### Toggle

*[image: 5 states of filled toggle icon button.]*
A: Unselected. B: Selected

1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

#### Tonal button states

##### Default

*[image: 5 states of tonal icon button.]*
1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

##### Toggle

*[image: 5 states of tonal toggle icon button.]*
A: Unselected. B: Selected

1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

#### Outlined button states

##### Default

*[image: 5 states of outlined icon button.]*
1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

##### Toggle

*[image: 5 states of outlined toggle icon button.]*
A: Unselected. B: Selected

1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

#### Standard icon button states

The standard icon button’s container is invisible at rest, but visible when the state layer is applied.

##### Default

*[image: 5 states of standard icon button.]*
1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

##### Toggle

*[image: 5 states of standard toggle icon button.]*
A: Unselected. B: Selected

1. Enabled
2. Disabled (10% state layer)
3. Hovered (8% state layer)
4. Focused (10% state layer)
5. Pressed (10% state layer)

### Shape morph

#### Pressed state

While pressed, icon buttons can morph to become more square.

Both round and square icon buttons should have the same pressed shape radius.<br><br>The corner radius value differs for each button size. [See full icon button corner measurements](https://m3.material.io/components/icon-buttons)

*[image: Shape changes for round and square icon buttons in 3 states.]*
A. Round, B. Square

1. Enabled
2. Hovered
3. Pressed

#### When selected

In addition to changing shape when pressed, toggle icon buttons also change the resting shape from round (unselected) to square (selected) by default.<br><br>If the resting shape is square, the selected shape should be round.

*[image: Shape changes for round and square toggle icon buttons in 3 states.]*
A. Round, B. Square

1. Enabled
2. Hovered
3. Pressed
4. Selected

### Measurements

*[image: Diagram of 5 sizes of icon buttons in 4 widths.]*
A. Extra small B. Small C. Medium D. Large E. Extra large

1. Icon size
2. Default width size
3. Narrow width size
4. Wide width size

#### Target sizes

Extra small and small icon buttons must have a target size of 48x48dp or larger to be accessible.

*[image: Diagram of target sizes.]*
A. Extra small icon button size B. Small icon button size

1. Narrow width
2. Default width
3. Wide width

#### Button corner radius

*[image: Diagram of icon button corner radius.]*

|  | XS | S | M | L | XL |
|---|---|---|---|---|---|
| A. Round button | Full | Full | Full | Full | Full |
| B. Square button | 12dp | 12dp | 16dp | 28dp | 28dp |
| C. Pressed state | 8dp | 8dp | 12dp | 16dp | 16dp |

### Baseline tokens

Use the table's menu to select a token set. Filled, tonal, and outlined icon button tokens are now deprecated in favor of the new token sets. All other tokens are still available in the module at the top of the page.

*[Token table (measurements, color, shape): `tokens__components__icon-buttons.md` — Icon button - Color - Outlined, Icon button - Size - Xsmall, Icon button - Size - Small, Icon button - Size - Medium, Icon button - Size - Large, Icon button - Size - Xlarge, Icon button - Color - Filled, Icon button - Color - Tonal, Icon button - Color - Standard, Icon button (baseline), [Deprecated] Icon button - Outlined, [Deprecated] Icon button - Tonal, [Deprecated] Icon button - Filled]*

## Guidelines

*[video: Illustrative example of icon buttons in a variety of sizes and shapes.]*
Icon buttons can be a wide variety of sizes, shapes, and colors. When placed in a button group, adjacent icon buttons respond to one another when pressed.

### Usage

Use icon buttons to display common actions. There are two variants: **default** and **toggle**.

- Default icon buttons can open other elements, such as a menu or search.
- Toggle icon buttons can represent binary actions that can be toggled on and off, such as **favorite** or **bookmark**.

Icon buttons can be placed directly on the background or in most container components, such as cards, app bars, and toolbars.

Multiple icon buttons can be placed in a standard button group to add interaction and motion between the buttons when pressed. [More about standard button groups](https://m3.material.io/components/button-groups)

*[image: Icon buttons in a toolbar.]*
Icon buttons can be used within other components, such as in a toolbar or card

#### Color

There are four icon button color styles, in order of emphasis:

1. Filled
2. Tonal
3. Outlined
4. Standard

For the highest emphasis, use the filled style. For the lowest emphasis, use standard.

*[image: Diagram of default and toggle icon buttons in 4 color styles.]*
The default (left) and toggle (right) icon buttons are available in all four color styles

Use a filled, tonal, or outlined icon button when the button needs more visual separation from the background.<br><br>Choose the right style and emphasis for the situation.

*[image: ‘Heart” icon on a background about a cooking show.]* **✅ Do**
Use icons with a background to make them easy to see on any surface

*[image: Text button and icon button in an app together.]* **✅ Do**
When mixing button variants, use color styles to make the primary action clear

Use the **filled** style for visual impact and key actions that require high emphasis.<br><br>Avoid overusing the filled style on a screen. Use them sparingly.

*[video: Cards that swipe to reveal buttons with actions.]*
Use filled icon buttons for high emphasis actions, such as downloading or deleting

Use the **tonal** style as a middle ground between filled and outlined icon buttons. It’s useful for secondary actions paired with a high emphasis action.<br><br>For example, use the tonal style for actions like **Raise hand**in a video meeting. When selected, its visual emphasis is greater than the outlined menu button, but less than the filled **End call** button.

*[image: Icons found on the bottom of a telephone screen, including a “hang up” icon with a bright red tone.]*
Leverage the different color styles to establish emphasis and direct people to important actions

Use the **outlined** style for medium-emphasis buttons. It’s useful when the button isn’t the main focus of the interaction, such as browsing through sets of cards.<br><br>Use the **standard** style for low-emphasis buttons, or when placing buttons on a colorful surface.

*[image: Left and right arrow outlined icon buttons indicating that more cards are available to browse.]*
Outlined buttons indicate that more content is available without grabbing attention

#### Size & width

Icon buttons are available in five different sizes:

- Extra small - 32dp
- Small - 40dp (default)
- Medium - 56dp
- Large - 96dp
- Extra large - 136dp

And three widths:

- Default
- Narrow
- Wide

Use size and width to provide emphasis and visual hierarchy in a page with multiple buttons. The main action should be the most visually prominent, whether through color or size, like starting and stopping a timer or playing and pausing a song.

*[image: Variety of buttons in a timer app.]*
Use different button colors and sizes to provide visual hierarchy and emphasize primary actions

Not all icon buttons will need to emphasize a primary and secondary action.

When buttons have a similar importance, they should be the same size.

*[image: Uniform button sizes in a calculator app.]*
When everything should have the same emphasis, use icon buttons that are the same size

### Anatomy

*[image: Diagram of anatomy of outlined, standard, and filled icon buttons.]*
1. Icon
2. Container

#### Icon

Icons visually communicate the button’s action. Their meaning should be clear and unambiguous. [Browse popular icons](https://fonts.google.com/icons)<br><br>Default icon buttons should use filled icons.

Toggle buttons should use an outlined icon when unselected, and a filled version of the icon when selected.

*[image: “Heart” icon in a restaurant app.]*
Ensure the meaning of the icon is clear, such as a heart indicating Favorite

##### Icon accessibility requirements

For selected toggle buttons, if a filled version of an icon doesn’t exist, increase the icon weight to semibold. If semibold doesn’t provide enough visual change, use bold.

This is to ensure that selection is communicated through at least two properties, rather than just color. This requirement doesn't apply to default non-toggle buttons.

*[image: Selected, semi-bold icon in a text editing app.]*
Icons without a fill should be semibolded when selected

#### Container

The container provides increased contrast and hierarchy in places that need more visual separation from the background or other elements.

*[image: Container separating a video call preview with actions you can take.]*
The container provides visual separation from the background image

### Placement

Icon buttons are commonly used in other components, such as app bars and cards.

These buttons should be used for common, easily understandable actions.

Only use a few icon buttons at once.

*[image: App bar with icon buttons.]*
App bars often contain icon buttons

In dense layouts, group popular actions by placing many icon buttons next to each other in components like a toolbar or button group.

These components draw attention or add interaction between buttons.

*[image: Toolbar with icon buttons and FAB.]*
A toolbar is a collection of icon buttons and other components

### Behavior

#### Hover

On hover, the icon button displays a tooltip describing its action, rather than the name of the icon itself.

*[video: The text Add to favorites appears as a tooltip when the curser is placed on a heart shaped icon.]*
The tooltip label text should be clear and concise

#### Selection

Toggle icon buttons allow a single choice to be selected or deselected, such as adding or removing something from favorites. <br><br>When placed in a button group, icon buttons change shape to help the selected button stand out.<br><br>[More on button groups](https://m3.material.io/components/button-groups)

*[video: A star-shaped toggle icon button to add or remove a song from favorites.]* **✅ Do**
Use toggle icon buttons when the icon can be selected

*[video: A toggle icon button to open an overflow menu.]* **❌ Don't**
Don’t use toggle icon buttons for actions that don’t have a selected state, such as an icon button for an overflow menu

The icon should become filled to represent selection.

If a filled version of the icon doesn't exist, use semibold weight instead.

*[video: An outlined-style bookmark icon in an unselected state changing to a filled-style selected state.]*
When making a selection, such as bookmarking or saving a video, the icon transitions from outlined (unselected) to filled (selected)

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Understand meaning of the icon
- Navigate to and activate an icon button
- When applicable, a tooltip should be available to help describe the icon button's purpose

### Interaction & style

Ensure the icon has contrast of at least 3:1 with the surface or background.

*[image: Icon button with correct contrast ratio.]* **✅ Do**
Icon buttons should have a 3:1 contrast ratio with the surface or background

*[image: Icon button with insufficient contrast ratio.]* **❌ Don't**
Avoid using colors with contrast below 3:1

### Keyboard navigation

| **Keys** | **Actions** |
|---|---|
| Tab | Focus lands on (non-disabled) icon button |
| Space or Enter | Activates the (non-disabled) icon button |

### Labeling elements

The accessibility label for icon buttons describes the action the button is executing, such as **Add to favorites**, **Bookmark**, or **Send message**.

*[image: Icon button label and role.]*
The icon button label describes the action, such as Add to favorites for the heart icon

### Layout & density

Groups of similar components can be nested together inside a component, or they can stand alone.<br><br>The target size of each icon button should be at least 48dp, even when nested.

*[image: Icon buttons with 48dp target sizes.]*
Icon buttons can be used within other components, such as an app bar

#### Avoid applying density by default

Don't apply density to icon buttons by default. This lowers their targets below the required 48x48 CSS pixels minimum size.

Provide density options that allow people to choose a higher density, such as selecting a denser layout or changing the theme. Controls for adjusting density must maintain a target size of at least 48x48 CSS pixels.

### Hover

On web, icon buttons should display a tooltip with an accessibility label.

*[image: “Heart” icon with "Add to favorites" tooltip on hover.]*
The tooltip label text should be clear and concise
