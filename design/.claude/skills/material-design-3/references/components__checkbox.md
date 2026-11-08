<!-- Source: https://m3.material.io/components/checkbox · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__checkbox.md @ 3c0e291 -->

# Checkbox

## Overview

- Use checkboxes (instead of switches or radio buttons) if multiple options can be selected from a list
- Label should be scannable
- Selected items are more prominent than unselected items

*[image: 3 checkboxes in a diagram demonstrating all three states.]*
Unselected, selected (hover), and indeterminate checkboxes

### Availability & resources

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- States: New indeterminate states as well as error states for unselected, selected, and indeterminate

*[image: Color mapping of a checkbox in M2.]*
M2

*[image: Color mapping of a checkbox in M3 with new color.]*
M3

## Specs

### Tokens & specs

Browse the component elements, attributes, tokens, and their values.

*[Token table (measurements, color, shape): `tokens__components__checkbox.md` — Checkbox]*

### Checkbox

*[image: Diagram of checkbox indicating the 2 parts of its anatomy.]*
1. Container
2. Icon

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Checkbox color roles in light and dark themes.]*
1. Checkbox
2. State-layer
3. Icon

#### Adjacent text label color

Use the color role **on surface** for adjacent text labels. This remains the same even if interacting with the label or component.

*[image: Checkboxes with text labels. The text color is the same for checked and unchecked checkboxes.]*
The text color remains the same regardless if the checkbox is selected or not

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

*[image: Side by side view of states in light and dark themes.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

### Measurements

*[image: Diagram of a selected checkbox with a container width and height of 18dp and a state-layer width and height of 40dp.]*

| Attribute | Value |
|---|---|
| Container size | 18dp |
| Container corner shape | 2dp |
| Icon size | 18dp |
| Icon alignment | Center-aligned |
| Target size | 48dp |
| State-layer size | 40dp |

## Guidelines

*[image: A list of burger additions represented with checkboxes.]*
Checkboxes in a list of items

### Usage

Use checkboxes to:

- Select one or more options from a list
- Present a list containing sub-selections
- Turn an item on or off in a desktop environment
- Visually group similar options together

*[image: List of 80's songs indicating choice through checkbox selection.]*
Checkboxes select multiple, related options

Checkboxes should be used instead of switches if multiple, related options can be selected from a list. Checkboxes visually group similar items effectively and take up less space than switches.

*[image: List indicating choice with checkbox selection.]* **✅ Do**
Checkboxes let users select one or more options from a list. A parent checkbox allows for easy selection or deselection of all items.

*[image: A list with multiple switches selected.]* **❌ Don't**
If a list consists of multiple options, don't use switches. Instead, use checkboxes. Checkboxes imply the items are related, and take up less visual space.

#### Alternate selection controls

Checkboxes, radio buttons, and switches are the three main selection controls. They all help people make choices, like selecting options or switching settings on or off.

- Use checkboxes to select multiple related options in a list.
- Use radio buttons to select a single option in a list.
- Use switches to select standalone or more verbose options in a list, like settings.

*[image: Diagram of 2 radio buttons, one selected and one unselected.]*
Radio buttons

*[image: Diagram of 2 switches, one selected and one unselected.]*
Switches

### Anatomy

*[image: Diagram of checkbox indicating the 2 parts of its anatomy.]*
1. Container

2. Icon

### Responsive layout

In expanded breakpoints, placing checkboxes within a contained region such as a side sheet can help group related controls and available actions.

*[image: Desktop screen showing music albums and a side sheet containing checkboxes for filtering music genres.]*
A side sheet can group related controls on larger screens

### Behavior

Multiple checkboxes in a list can be selected.

*[video: Using checkboxes to select a list of extra ingredients, like pickles and tomatoes, to add to a meal.]*
Selecting multiple items in a list using checkboxes

Checkboxes can have a parent-child relationship with other checkboxes.

- When the parent checkbox is checked, all child checkboxes are checked
- If a parent checkbox is unchecked, all child checkboxes are unchecked
- If some, but not all, child checkboxes are checked, the parent checkbox becomes an indeterminate checkbox. Checking an indeterminate checkbox checks all child items.

*[video: Checking parent checkbox also checks child items. Unchecking one child item makes parent indeterminate.]*
Use a parent checkbox to make it more efficient to select many items

When selected, a checkbox clearly and instantly communicates its selected state.

If used to turn something on or off, the action should be immediately executed.

*[video: Selecting a checkbox for turning on dark mode immediately changes the phone theme.]*
Turning an item on or off using a checkbox

## Accessibility

### Use cases

People should be able to use assistive technology to:

- Navigate to a checkbox
- Toggle the checkbox on and off
- Get appropriate feedback based on input type documented under [Interaction & style](https://m3.material.io/components/checkbox)

### Interaction & style

Users should be able to select either the text label or the checkbox to select an option.

*[image: In a list, checkboxes for 2 items are selected via their text labels.]*
A checkbox selected via the text label

The parent checkbox has three states: selected, unselected, and indeterminate.

Checkboxes can be selected or unselected regardless of the state of the other checkboxes in a group.

If some, but not all, child checkboxes are checked, the parent checkbox becomes indeterminate. Selecting an indeterminate parent checkbox will check all of its child checkboxes.

*[image: In a list, a child checkbox for 1 item is selected and the parent checkbox is in indeterminate state.]*
An indeterminate selection indicating that at least one checkbox is selected within a group

### Avoid applying density by default

Don't apply density to checkboxes by default — this lowers their targets below our best practice of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme.

To ensure that this density setting can be easily reverted when it's active, keep all the targets to change it at minimum 48x48 CSS pixels each.

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Moves focus to enabled chip or chip group |
| **Space** or **Enter** | Activates, selects, or deselects the focused chip |
| **Backspace** or **Delete** | Removes currently focused input chip |
| **Arrows** | Moves focus between chips |

### Labeling elements

If the UI text is correctly linked to the checkbox, assistive tech (such as a screen reader) will read the UI text followed by the component’s role.

The accessibility label for an individual checkbox is typically the same as its adjacent text label.

*[image: Accessibility labels of a checkbox.]*
The accessibility label clearly states the text label of the checkbox
