<!-- Source: https://m3.material.io/components/menus · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__menus.md @ 3c0e291 -->

# Menus

## Overview

- Use a **menu** to show a temporary set of actions. To show actions on screen at all times, use a **toolbar** instead
- Menus can open from many components, including icon buttons, split buttons, and text fields
- **Context menus** provide actions for a specific element, like an image or highlighted text, and usually open with a secondary click

*[image: 1 vertical menu with vibrant colors opens from a split button, and 1 vertical menu with a submenu.]*
Vertical menus can include vibrant colors, gaps, dividers, and submenus to organize a list of choices

### Availability & resources

### M3 Expressive update

**November 2025**

**Vertical menus** were introduced with new shapes, color styles, selection states, and refined submenu motion. Gaps can be used for a more flexible layout on Android. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants:

- Added **vertical menus**, recommended for new designs
- Baseline **menu** is still available

Color styles:

- Standard
- Vibrant

*[image: A vertical menu using shape and vibrant color to show a selected state.]*
Vibrant colors help selected menu items stand out

### Differences from M2

- **Color**: New color mappings and compatibility with dynamic color
- **Variants**: Dropdown menu and exposed dropdown menu are now both referred to as menu, since they differ only in the element which opens the menu surface

*[image: Menu with gray color.]*
M2: Former menu colors don’t contrast with the background

*[image: Menu with purple background and outline.]*
M3: Menus feature new color mappings and dynamic color

## Specs

### Variants

#### Vertical menus

Use vertical menus for a more expressive look and feel, including rounded corners, standard and vibrant color styles, more selection states, and submenu motion.

*[image: 2 vertical menus use shape and color to indicate selected state.]*
1. Vertical menu with gap
2. Vertical menu with divider

#### Baseline variant

In M3 Expressive, baseline menu is still available to use, but doesn’t have the latest shapes, color styles, selection states, and motion. [See baseline menu specs](https://m3.material.io/components/menus)

*[image: A baseline menu variant with square corners and standard colors.]*
A baseline **menu** has square corners, as compared to a **vertical menu’s** round corners and expressive styling

| **Variant** | **M3** | **M3 Expressive** |
|---|---|---|
| Vertical menus | -- | Available |
| Menu (baseline) | Available | Available |

### Configurations

#### Vertical menus layout

*[image: 2 menus: 1 standard, and 1 with a gap, creating groups.]*
1. Standard
2. Grouped

| **Category<br>** | **Configuration<br>** | **M3** | **M3 Expressiv****e** |
|---|---|---|---|
| Color | Standard | Available | Available |
| Vibrant | -- | Available |  |
| Layout | Standard | Available | Available |
| Grouped | -- | Available |  |

### Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__menus.md` — Menus - Common, Menus - Color - Vibrant, Menus - Color - Standard, Menu (baseline)]*

### Anatomy

#### Vertical menus

*[image: A diagram of a vertical menu.]*
1. Menu item
2. Leading icon (optional)
3. Menu item text
4. Trailing icon (optional)
5. Badge (optional)
6. Trailing text (optional)
7. Container
8. Supporting text (optional)
9. Label text (optional)
10. Gap (optional)
11. Divider (optional)

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

Menus have two color mappings:

- Standard: Surface-based
- Vibrant: Tertiary-based

These mappings provide options for lower or higher visual emphasis. Vibrant menus are more prominent so should be used sparingly.

*[image: 2 vertical menus: 1 with lower visual emphasis, and 1 vibrant menu with bold shades.]*
1. Standard color scheme
2. Vibrant color scheme

#### Standard colors

*[image: 2 vertical menus with standard color roles mapped to 11 elements.]*
Vertical menus color roles used for light and dark themes:

1. On surface variant
2. On surface
3. On surface (state layer)
4. Surface container low
5. On surface variant
6. On surface variant
7. Tertiary container (selected)
8. On tertiary container (selected)
9. On surface variant
10. On surface variant
11. On tertiary container (selected)

#### Vibrant colors

*[image: 2 vertical menus with vibrant color roles mapped to 11 elements.]*
Vertical menus color roles used for light and dark themes:

1. On tertiary container
2. On tertiary container
3. On tertiary container (state layer)
4. Tertiary container
5. On tertiary container
6. On tertiary container
7. Tertiary (selected)
8. On tertiary (selected)
9. On tertiary container
10. On tertiary container
11. On tertiary (selected)

### States

States are visual representations used to communicate the status of a component or an interactive element. [More on interaction states](https://m3.material.io/m3/pages/interaction-states/overview)<br><br>Shape morphing in vertical menus creates an expressive active state. As focus moves between submenus, the corner shape changes to highlight the active menu. [More on menu focus](https://m3.material.io/components/menus)

*[image: 6 vertical menu states in light and dark themes.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed
6. Active (main menu reveals submenu)

### Measurements

*[image: Vertical menu marked with spacing and padding measurements.]*
Vertical menu padding and size measurements

### Menu (baseline)

The baseline menu variant is available and continues to work in existing products. However, M3 expressive vertical menus are recommended for new designs.

#### Baseline tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__menus.md` — Menus - Common, Menus - Color - Vibrant, Menus - Color - Standard, Menu (baseline)]*

#### Anatomy

*[image: Diagram of 6 elements of a baseline menu.]*
1. List item
2. List item leading icon
3. List item trailing icon
4. Container
5. List item trailing text
6. Divider

#### Color

*[image: 9 color roles of a baseline menu in light and dark themes.]*
Baseline menu color roles used for light and dark themes:

1. On surface variant
2. On surface
3. On surface - opacity: 0.08
4. Surface container
5. On surface variant
6. On surface variant
7. On surface variant
8. Surface container highest
9. Outline variant

#### States

##### Default menu items

*[image: Diagram numbering the 5 default states of a baseline menu.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

##### Selected menu items

*[image: 5 states of a selected baseline menu item.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

[State specs are in the token module above](https://m3.material.io/components/menus)

#### Measurements

*[image: Diagram of a baseline menu’s padding, text alignment, height, and width.]*
Baseline menu padding and size measurements

| Attribute | Value |
|---|---|
| Container width | 112dp min, 280dp max |
| Corner radius | 4dp |
| Vertical label text alignment | Center-aligned |
| Horizontal label text alignment | Start-aligned |
| Left/right padding | 12dp |
| Left/right padding with-icon | 12dp |
| List item height | 48dp |
| Padding between elements within a list item | 12dp |
| Divider top/bottom padding | 8dp |
| Divider height | 1dp |
| Divider width | Dynamic |
| Leading/trailing icon size | 24dp |

#### Configurations

A baseline menu appears when a person interacts with a button, action, or other control.

A few examples:

1. Button
2. Text field
3. Icon button
4. Selected text

*[image: Examples of 4 baseline menu inputs.]*

## Guidelines

*[video: 2 vertical menus, 1 with vibrant colors, 1 with standard colors and grouped items.]*
A menu in the **vibrant** color style is more expressive, and one with **standard** colors is more utilitarian

### Usage

Use a menu to show a temporary set of actions. To show actions on screen at all times, use a toolbar instead.

A menu takes up less space than a set of radio buttons or chips.

#### Color options

Menus have two color mappings:

- Standard: Surface-based, lower visual emphasis
- Vibrant: Tertiary-based, higher visual emphasis

Vibrant menus are more prominent, and should be used sparingly.

*[image: Menu shows item “Line spacing” opening a submenu. In the second menu, “Custom 1.2” is selected with vibrant color.]*
On web, menus can open submenus

#### Opening menus

Menus temporarily appear in front of all other permanent UI elements.

A menu should open when a person:

- Selects an element, such as an icon, button, or text field
- Performs a specific action to trigger the menu, like right-click or press-and-hold

Use menus in situations that need extra actions, like:

- Overflow menus
- Text field dropdown menus
- Select menus
- Context menus

*[image: A grouped menu with Undo, Redo, Cut, Copy, and Paste options appear over highlighted text in an ebook.]*
Menus appear in front of all other UI elements

#### Menu groups

Vertical menu items can be grouped by adding a divider or small gap. Use groups to bundle similar actions together.

[Gaps and dividers guidelines](https://m3.material.io/components/menus)

*[image: 2 vertical menus: a standard menu with no gap and a grouped menu with 1 gap.]*
Menu items can be grouped to be more scannable:

1. Standard vertical menu
2. Grouped vertical menu

#### Context menus

Context menus provide a list of additional actions a person can take on an item. A secondary click, like a right-click on a mouse or a two-finger tap on a trackpad, opens a context menu.

*[image: A context menu pops up from a newspaper link. The menu items are: Open in new window, Save link as, Copy address, and Inspect.]*
A context menu appears when right clicking with a mouse or trackpad. It can reveal key actions related to the associated content.

### Anatomy

*[image: Diagram outlining 11 elements of a menu’s anatomy.]*
1. Menu item
2. Leading icon (optional)
3. Menu item text
4. Trailing icon (optional)
5. Badge (optional)
6. Trailing text (optional)
7. Container
8. Supporting text (optional)
9. Label text (optional)
10. Gap (optional)
11. Divider (optional)

#### Menu items

Menu items can include label text, leading icons, trailing icons, and keyboard commands.

When a menu item can only be used under specific conditions, it should appear disabled rather than be removed.

*[image: Menu shows 1 item that’s  disabled, “Redo”. The text color of the disabled item is lighter than the active items.]*
The **Redo** action is disabled when that action isn’t available

#### Gaps & dividers (optional)

Gaps and dividers can be used to separate and group menu items.

**Gaps**

Use a gap to visually divide menu items into distinct groups. Gaps are more expressive than dividers and make the relationship between items clear.

- Avoid changing the size of the gap
- Limit the number of gaps in a menu to one or two
- Don’t use gaps in scrollable menus

*[image: 2 vertical menus with 5 items. A gap separates items into a group of 3 and group of 2.]*
Gaps separate menu items using expressive shapes

> **Note:** Gaps are not currently available on web

**Dividers**

Dividers create a more subtle separation between items. Use a divider for:

- Scrollable menus
- Text fields with a dropdown menu, where a grouped treatment isn’t appropriate

On web, use a divider to separate menu items.

*[image: A menu on a web interface with items separated by a divider line.]*
Dividers separate menu items in baseline menus and on web

### Flexibility & slots

Menus have custom slots that support more flexible item layouts.

When creating a complicated menu, think of the menu item as a container with a swappable slot.

Slots work best with simple content such as:

- Images
- Progress indicators
- Color swatches

*[image: A menu showing an undefined slot that could be used for a different element, such as an image.]*
Slots can appear anywhere in a menu

**Slot accessibility**<br><br>Use caution when adding slots to menus:

- Make sure the menu remains accessible
- Elements must follow the rules and interaction patterns of the menu component
- Keep the same menu item padding
- Targets should be 48x48dp or larger

Don't add buttons, switches, or other direct actions into the menu item. Nested elements should only perform one action. Adding multiple actions can break keyboard navigation and screen reader functionality.

[More on required accessibility guidelines](https://m3.material.io/components/menus)

*[image: 1 diagram and 1 menu showing icons in each item’s leading slot.]* **⚠️ Caution**
Reserve the use of slots for use cases that maintain the menu’s accessibility and functionality

### Placement

A menu is positioned relative to the window edge. It typically appears below, next to, or in front of the element that generates it.

If a menu is in a position to be cut off, it should automatically reposition to appear to the left, right, or above the element that generates it.

*[image: 6 abstract shapes showing how a menu can extend from the edge of the screen.]*
Menus can appear around or in front of the element that opened them

#### Submenus

Submenus should open next to the parent menu item without overlapping it.

Submenus are best used on large screens where there's space. [See adaptive guidance](https://m3.material.io/components/menus) for alternatives on mobile.

*[image: A submenu opens to the right of its parent menu item, and doesn’t cover it. A selected submenu item includes a checkmark and vibrant highlight.]*
Position submenus to the side of the parent item

> **Note:** Submenus are not currently available on Jetpack Compose

### Adaptive design

#### Compact breakpoints

Consider adapting menus into bottom sheets on small screens. They have more space to display additional items and longer labels.

*[image: A bottom sheet shows longer labels and improved readability on a compact window.]*
A bottom sheet can replace a menu on smaller screens

#### Other breakpoints

On medium and expanded windows, menus are most effective as they appear in context with the content. On larger screens, menus can also display more items, and can use submenus to organize complex sets of options.

*[image: A menu with vibrant color on a mid-size screen, with the same elements as a bottom sheet.]*
On large screens, a menu is often more appropriate than a bottom sheet

### Behavior

#### Appearing

A menu can appear when a person interacts with an element on the page, like a button, text field, filter chip, or highlighted text.

A menu’s position on screen affects where and how it appears. If opened at the top of the screen, it expands downwards to avoid being cropped.

*[video: A menu activated at the top of the screen expands downwards, then a menu opened at the bottom of the screen expands upward.]*
Menus at different positions on a screen open in different directions, adapting to the available space

*[video: A menu expands downward from the top of the screen, appearing below a split button.]*
A menu can open from a split button

*[video: A menu expands both above and below a line of selected text, separated by a gap.]*
A menu can appear in context, like next to highlighted text or a selected image

*[video: Selecting the “Phone type” text field reveals a menu with multiple options: Business, Mobile (selected), and Home.]*
A menu can open from a text field

*[video: A filter chip for “Cycling” in a map UI reveals more menus items: Running, Walking, and Hiking.]*
A menu can open from a filter chip

**Motion**

Menus use an enter and exit transition. This animation creates a relationship between the menu and the element that generates it.

When a menu expands, the trigger element becomes pressed. When an item is selected, a ripple appears on touch.

*[video: An animation for entering a new contact’s address. The state selection menu expands and the state California is selected.]*
A menu expands when opened, and has a ripple when an item is selected

In dense products, such as on desktop, menus can open instantly to reduce motion.

*[video: A menu for changing a font type opens instantly on a desktop UI.]*
Desktop menus can open instantly

#### Filtering

A menu can include a text field to filter options. This pattern is also known as autocomplete.

As someone types, the list of menu options filters to show relevant results. This helps people quickly find the right option from a long list.

Menu items ease into their new position as the menu is filtered.

*[video: An animation showing a text field being typed into. As text is added, the list of menu items below filters down to show only matching options.]*
As a person types in the text field, the menu options filter to match the input

#### Scrolling

Menus can scroll when all menu items can’t display at once. In this state, menus show a persistent scrollbar.

Don’t use gaps if a menu scrolls; this is currently unsupported.

*[video: A font menu on a document shows a scrollbar to access font options not currently visible.]*
When content is scrollable, menus display scrollbars

#### Selecting

When a menu is opened, the corresponding button or icon button should remain the same visually, with the addition of a pressed state.

This should happen even when opening from a keyboard shortcut.

*[image: The overflow icon remains the same, even after the menu is opened.]*
Tapping the icon triggers a menu. Choosing a menu option doesn’t change the icon generating the menu.

#### Single- and multi-select menus

Menus can allow either single-select or multi-select actions:

- **Single-select** menus can have one item selected at a time. When a new item is selected, the previously selected item is automatically unselected.
- **Multi-select** menus can have many selected items. They stay open until the person dismisses the menu.

[More on selection accessibility requirements](https://m3.material.io/components/menus)

*[image: 1 menu for dietary options shows a single selection, Vegan. Another menu shows Vegan and Nut-free selections at the same time.]*
Menus can be single- or multi-select

### Focus

When a menu has multiple submenus, focus follows the current hovered or focused submenu.

**Shape morphing**

As a person moves from one submenu to the next, the corners of the focused submenu become more rounded, while the unfocused submenu becomes less rounded. This adds a dynamic quality to menu interactions.

*[video: On a submenu next to a main menu, a selected item’s corner shape expands for added emphasis.]*
On a custom menu, the corner shape changes to indicate focus as the cursor moves across submenus

### Density

On web only, density levels control the spacing between elements. Increasing density decreases the top and bottom padding. [More on layout density](https://m3.material.io/m3/pages/understanding-layout/density)

*[image: 4 menus becoming increasingly dense and compressed.]*
Density of menus from 0 to -3

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Navigate to, open, and close a menu
- Navigate between and select menu items

### Interaction & style

Menu items need certain cues to clearly show when they're selected:

- By default, menu items change shape and color when selected
- The default color contrast is 3:1 between selected and unselected menu items
- It's recommended to include another visual cue, like a checkmark

*[image: A state dropdown menu with the selected item Alaska highlighted in a vibrant color, with a checkmark icon.]*
Use multiple visual cues like color, shape, and icons to show that an item is selected

### Flexibility & slots

Use caution when adding slots to menus:

- Make sure the menu remains accessible
- Elements must follow the rules and interaction patterns of the menu component
- Keep the same menu item padding
- Targets should be 48x48dp or larger

Don't add buttons, switches, or other direct actions into the menu item. Nested elements should only perform one action. Adding multiple actions can break keyboard navigation and screen reader functionality.

[More on slots in menus](https://m3.material.io/components/menus)

*[image: 1 diagram and 1 menu showing icons in each item’s leading slot.]* **⚠️ Caution**
Reserve the use of slots for use cases that maintain the menu’s accessibility and functionality

### Focus

**Initial focus**

When a menu opens, focus should be placed on the first menu item. This allows people using a keyboard or other assistive technologies to begin navigating the menu immediately.

**Exiting a menu**

People expect to exit a menu by:

- Selecting an option
- Tapping **Escape** or outside of the menu
- Using the system back button

Where focus is placed after closing the menu depends on the app.

*[image: 4 common keyboard navigation methods for menus on Android and web.]*
Keyboard navigation on Android and web:

1. **Tab** to select a menu item
2. **Space** or **Enter** to open a menu
3. **Space** or **Enter** to select a menu item
4. **Escape** to close a menu

### Keyboard navigation

| **Keys** | **Actions** |
|---|---|
| **Tab** | Focus lands on menu |
| **Space**or**Enter** | For closed menus: Opens menu or submenuFor open menus: Selects a menu item |
| **Up** and **Down** arrows | For closed menus: Opens menu For open menus: Moves focus to the next item |
| **Left** and **Right** arrows | Opens or closes a submenu |
| **Letters** | Focus moves to the next menu item starting with letter |
| **Escape** | Closes menu |

### Interactability

Disabled menu items can receive focus but aren't selectable.

Dividers and gaps can't receive focus.

*[image: A disabled menu item “Share” is in focus.]* **✅ Do**
Disabled menu items can receive focus

*[image: A divider with focus.]* **❌ Don't**
A divider or gap can’t receive focus

### Labeling elements

Accessibility labels are used with assistive technology devices like screen readers.

The accessibility label should be the same as the menu item text.

The role is [dependent on platform](https://m3.material.io/components/menus).

*[image: A “Preview” menu item has an accessibility label of ”preview”.]*
The menu item’s accessibility label aligns with the UI text

| **Element** | **A11y label** | **Role (Web)** | **Role (Android Views)<br>** | **Role (Jetpack Compose)** |
|---|---|---|---|---|
| Menu item text | Preview | Menu item | Generic actionable element | Generic actionable element |

For menu items with text and an icon, the icon’s accessibility label should be marked as **decorative** to avoid redundant verbalizations.

*[image: A menu item icon of an eye next to the word “preview” has a note of “Decorative.”]*
For menu items with text and an icon, the icon’s accessibility label is **decorative**
