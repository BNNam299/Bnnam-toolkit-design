<!-- Source: https://m3.material.io/components/radio-button · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__radio-button.md @ 3c0e291 -->

# Radio button

## Overview

- Use radio buttons (not switches) when only one item can be selected from a list
- Label should be scannable
- Selected items are more prominent than unselected items

*[image: 1 radio button is selected from a list of 4 radio buttons of different ringtones.]*
Radio buttons can be selected

### Resources & availability

### What’s new

- Color: New color mappings and compatibility with dynamic color

*[image: App screen with 1 active button selected from list of 3 buttons.]*
Radio buttons feature new color mappings

## Specs

*[image: Diagram of enabled radio button.]*
1. Radio button icon

### Tokens & specs

[Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__radio-button.md` — Radio Button]*

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Diagram of selected and unselected radio button colors.]*
Radio button color roles used for light and dark themes:

1. Primary
2. On surface variant

#### Adjacent text label color

Use the color role **on surface** for adjacent text labels. This remains the same even if interacting with the label or component.

*[image: Radio buttons with labels. The labels are the same color for both selected and unselected radio buttons.]*
The text color remains the same regardless if the button is selected or not

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

*[image: Diagram of radio button states including enabled, hover, focus, pressed, and disabled.]*
1. Enabled
2. Hover
3. Focus
4. Pressed
5. Disabled

[State specs are in the token module above](https://m3.material.io/components/radio-button)

### Measurements

*[image: Diagram of radio button layout values.]*
Radio button size measurements

| Attribute | Value |
|---|---|
| Icon size | 20dp |
| State layer size | 40dp |
| Target size | 48dp |

## Guidelines

*[image: 1 radio button is selected from a list of 4 radio buttons of different ringtones.]*
Radio buttons

### Usage

Radio buttons are the recommended way to allow users to make a single selection from a list of options.

Only one radio button can be selected at a time.

*[video: 1 of 3 languages is chosen using radio buttons. Selecting a language deselects the previous 1.]*
Radio buttons should always be accompanied by clear inline labels

Use radio buttons to:

- Select a single option from a set
- Expose all available options

*[image: 2 radio buttons are used for allowing or turning off notifications. 2 checkboxes are used for microphone and location access.]*
Radio buttons are single-select, unlike checkboxes which are multi-select

*[image: Filter page with 4 sort by options as radio buttons. Relevance is selected.]* **✅ Do**
Use radio buttons when only one option can be selected from a list

*[image: Meal options page with the Additions item selected, along with 4 nested checkboxes for selecting various toppings. All checkboxes are selected.]* **✅ Do**
Use checkboxes when multiple options can be selected from a list

Avoid nesting radio buttons or using radio buttons to select multiple options.

*[image: Selected radio button with 2 nested radio buttons.]* **❌ Don't**
Don’t nest radio buttons

*[image: 2 radio buttons selected at once from a list of 3 buttons.]* **❌ Don't**
Don’t allow radio buttons to select multiple options

#### Alternate selection controls

Radio buttons are one of several selection controls, which allow people to make choices such as selecting options or switching settings on or off.

Switches and checkboxes are alternative selection controls that can be used to change settings or preferences.

*[image: A selected and unselected switch.]*
Switches

*[image: An unselected and selected checkbox.]*
Checkboxes

Use radio buttons when there are five or fewer options.

Consider using a drop-down menu instead of radio buttons when it’s important to save space on a screen. However, drop-down menus require additional steps for a person, both in the number of clicks and cognitive effort.

*[image: A filter UI with 1 radio button selected from a list of 3 buttons.]* **✅ Do**
Use radio buttons when there are five or fewer options

*[image: A dropdown menu with a list of 4 options.]* **✅ Do**
Consider using a drop-down menu instead of radio buttons when space is constrained

### Anatomy

*[image: 3 elements of a radio button.]*
1. Selected icon
2. Adjacent label text
3. Unselected icon

#### Adjacent label text

Always pair radio buttons with an adjacent label describing what the radio button selects.

Because only one radio button can be selected at a time, each choice must have its own label.

*[video: Checkout page with 2 radio buttons for home and office addresses. The labels are "Home" and "Office."]*
Radio button always need label text

### Placement

Radio buttons are often arranged in stacked layouts.

*[image: Settings page with 3 stacked radio buttons for selecting a language.]*

Radio buttons should be vertically listed and have one option always selected.

*[image: 3 radio buttons with 1 option selected.]* **✅ Do**
Radio buttons should always have one option pre-selected

*[image: 2 radio buttons side by side with 1 option selected.]* **⚠️ Caution**
Avoid using horizontal radio button lists

### Behavior

A radio button is successfully selected when a person clicks or taps either the radio button icon or the label.

*[video: Selecting the radio button for dark theme instantly changes the screen to dark theme.]*
Radio buttons should take effect immediately, unless they're in a dialog or page that needs to be saved

## Accessibility

### Use cases

People should be able to do the following with assistive technology:

- Navigate to a radio button
- Select a radio button
- Get appropriate feedback based on input type

### Interaction & style

A radio button can be either selected or unselected. Selecting one radio button deselects any others. A radio group can start with one radio button selected, or none selected.

Once a radio button is selected, the group can’t be deselected. To let people opt out of their selection, either provide a **Not applicable** or **No option** radio button, or provide a separate way to deselect all radio buttons, like **Clear selection**.

People should be able to select either the text label or the radio button to select an option.

*[video: Selecting between radio buttons for a home and office address.]*
Only one radio button is selected at a time

#### Avoid applying density by default

Don't apply density to radio buttons by default. This lowers their targets below Material's recommendation of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme.

To ensure this density setting can be easily reverted when it's active, keep all targets to change it at a minimum of 48x48 CSS pixels each.

### Initial focus

When outside the radio group, **Tab** moves focus directly to the selected radio button, or the first one if none are selected.

**Shift+Tab** instead focuses on the last radio if none are selected.

Use the **arrows** to navigate between options.

*[image: The Tab key focuses on the first of 2 stacked radio buttons.]*
Tab brings the focus to the initially selected item or the initial radio option

*[image: The up and down arrow keys move through a list of stacked radio buttons.]*
Arrows move to next element in a list

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Moves focus into the group to the selected radio button, or the first if none are selected |
| **Shift** + **Tab** | Moves focus into the group to the selected radio button, or the last if none are selected |
| **Arrows** | Moves focus and selects the previous or next radio button. Wraps focus and selection between the first and last radio buttons. |
| **Space** | Selects a focused radio button. If already selected, does nothing. |

### Labeling elements

If the UI text is correctly linked to the radio button, assistive tech such as a screenreader will read the UI text, followed by the component’s role.

The accessibility label for a group of radio buttons is typically the same as its title. The role is **Radio group**.

*[image: Accessibility tags for a radio button group.]*
Label the radio group based on the category title

The accessibility label for an individual radio button is typically the same as its adjacent text label.

*[image: Accessibility tags for a radio button.]*
Label the radio button based on its label text
