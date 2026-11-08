<!-- Source: https://m3.material.io/components/switch · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__switch.md @ 3c0e291 -->

# Switch

## Overview

- Use switches (not radio buttons) if the items in a list can be independently controlled
- Switches are the best way to let people adjust settings
- Make sure the switch’s selection (on or off) is visible at a glance

*[image: A switch in two states, off and on.]*
Switches can be toggled on and off

### Availability & resources

### Differences from M2

- Accessibility: Visual presentation is more accessible
- Color: New color mappings meet Material's non-text-contrast requirements in addition to compatibility with dynamic color
- Icons: Ability to have an optional icon within the switch handle
- Layout: Track is taller and wider

*[image: M2 switches in off and on states.]*
M2: Switches have a circular handle that extends beyond the edge of the track

*[image: M3 switch shown toggled off and toggled on. When switched on, it has a checkmark icon.]*
M3: Switches have a taller and wider track, new color mappings, and the ability to show an icon in the handle

## Specs

*[image: 3 elements of a switch.]*
1. Track
2. Handle (formerly "thumb")
3. Icon

### Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__switch.md` — Switch]*

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 6 color roles of a switch in light and dark themes.]*
Switch color roles used for light and dark themes:

1. Surface container highest
2. Outline
3. Outline
4. Primary
5. On primary
6. On primary container

#### Adjacent text label color

Use the color role **on surface** for adjacent text labels. This remains the same even if interacting with the label or component.

*[image: The large body text adjacent to switches uses "on surface" color and the body text uses "on surface variant."]*
The text label uses **on surface**. Supporting text may use **on surface variant**.

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states)

*[image: 5 states of a switch shown in light and dark themes.]*
1. Enabled
2. Hovered
3. Focused
4. Pressed
5. Disabled

[State specs are in the token module above](https://m3.material.io/components/switch)

### Measurements

*[image: Measurements of switches without icons.]*
Switches without icons

*[image: Measurements of pressed switches without icons.]*
Pressed switches without icons

*[image: Measurements of switches with icons.]*
Switches with icons

*[image: Measurements of pressed switches with icons.]*
Pressed switches with icons

| Element | Attribute | Value |
|---|---|---|
| Track | Height | 32dp |
| Width | 52dp |  |
| Outline width | 2dp |  |
| Shape | [md.sys.shape.corner.full](https://m3.material.io/styles/shape) |  |
| Handle | Height (unselected) | 16dp |
| Height - with icon | 24dp |  |
| Height (selected) | 24dp |  |
| Height (pressed) | 28dp |  |
| Width (unselected) | 16dp |  |
| Width - with icon | 24dp |  |
| Width (selected) | 24dp |  |
| Width (pressed) | 28dp |  |
| Shape | [md.sys.shape.corner.full](https://m3.material.io/styles/shape) |  |
| State layer | Size | 40dp |
| Shape | [md.sys.shape.corner.full](https://m3.material.io/styles/shape) |  |
| Target | Size | 48dp |
| Icon | Size (selected) | 16dp |
| Icon | Size (unselected) | 16dp |

### Configurations

1. Without icons
2. Icon on selected switch
3. Icon on selected and unselected switch

*[image: 3 example switches with and without icons in on and off states.]*

## Guidelines

*[image: A switch in 2 states, off and on.]*
Switches change settings and other options immediately

### Usage

Switches are best used to adjust settings and other standalone options.

They make a binary selection:

- On and off
- True and false

The effects of a switch should start immediately, without needing to save.

*[video: Toggling a switch turns on dark mode in Settings on a mobile device.]*
Use a switch to turn an option on and off

Use switches to:

- Toggle a single item on or off
- Immediately activate or deactivate something

*[image: Switch used in notification settings to turn on and off the "play over notifications" function.]*
Switches are commonly used on mobile to turn settings on or off

Switches control binary options, not opposing ones. A binary option represents a single selection that's either on or off.

Opposing options are when only one option in a set can be selected at a time, like a list or map view. Use a connected button group instead.

*[image: A connected button group with options of List View and Map View.]* **✅ Do**
Use a connected button group to choose between opposing options

*[image: A switch with non-binary options of List View and Map View.]* **❌ Don't**
Avoid using switches to toggle between opposing options

#### Alternate selection controls

Checkboxes, radio buttons, and switches are the three main kinds of selection controls. They help people make choices, like selecting options or turning settings on and off.

Use checkboxes to select multiple related options in a list.

Use radio buttons to select a single option in a list.

Use switches to select standalone or more verbose options in a list, like settings.

*[image: 2 checkboxes, 1 unchecked and 1 checked.]*
Checkboxes

*[image: 2 radio buttons, 1 in an enabled state, 1 in a disabled state.]*
Radio buttons

*[image: Mobile screen with checkboxes to select list items and call to action button to update the list.]* **✅ Do**
Use checkboxes (not switches) to let people select one or more options from a list

*[image: Mobile screen with checkboxes to select list items and call to action switch to update the list.]* **❌ Don't**
A switch can't replace a button. People expect a call to action to be a button, not a switch.

*[image: Radio buttons used to select a language for a mobile app.]* **✅ Do**
Use radio buttons (not switches) when only one item can be selected from a list

*[image: Mobile screen with switches to select list items and call to action button to update the list.]* **❌ Don't**
Avoid using a switch to select multiple options that require people to save. Switches should be immediate. Use checkboxes instead.

### Anatomy

*[image: 3 elements of a switch.]*
1. Track
2. Handle
3. Icon (optional)

#### Icon (optional)

The switch handle can contain an optional icon.

*[video: A checkmark appears on the filled circle of a handle when the switch is toggled on.]*
The icon within the handle should always communicate the switch's selection

Icons can be used to visually emphasize the switch’s selection. The icon’s meaning should be clear and unambiguous to help the people understand whether switch is on or off.

*[image: 2 switches, the unselected state icon is an X, and the selected state is a checkmark.]* **✅ Do**
Use icons that clearly communicate whether the switch is on or off, such as an X and a checkmark

*[image: A switch’s unselected handle icon is a moon and the selected state icon is a pencil.]* **❌ Don't**
Avoid using more ambiguous or non-binary icons, such as a moon or edit icon

#### Label text

Switches should always be paired with an inline label describing what the switch controls when selected.

*[image: Switch label text: 1. Permission manager, App has access to your data. 2. Camera access, app has access to your camera. 3. Show password.]* **✅ Do**
Keep labels short and direct. A label should describe what the control does when the switch is on.

*[image: On a mobile screen’s privacy settings, 2 switches have “On” label text and checkmark icons. The last switch has “Off” label text and no icon.]* **❌ Don't**
Don't add label text into the switch; the font size would be too small to be accessible. Use an appropriate icon instead.

### Placement

Switches are often arranged in stacked layouts.

*[image: Screen showing labels and stacked switches in varying on/off modes.]*
Settings screens are common places to use switches

### Behavior

A switch is successfully toggled when the handle slides to the other side of the track after an interaction.

*[video: A switch is toggled to turn on airplane mode and Wi-Fi switch automatically turns off.]*
When selected, the switch handle slides to the opposite end of the track

When a person toggles a switch, its handle size changes and the corresponding action takes effect immediately.

*[video: When selected the switch’s handle gets larger and a checkmark appears on the filled circle.]*
The **on** state of the switch is indicated by a larger handle size

## Accessibility

### Use cases

People should be able to do the following with assistive technology:

- Navigate to a switch with a keyboard or switch input
- Toggle the switch on and off
- Get appropriate feedback based on input type documented under [Interaction & style](https://m3.material.io/components/switch)

### Interaction & style

The switch handle increases in size to indicate interactivity for both touch and cursor control interactions.

**Touch**<br>When tapped or dragged, the handle size grows, providing interaction feedback.

**Cursor**<br>When hovered (in both on and off states), the hover area grows, providing a visual cue that the handle is interactive. When clicked, the handle size grows.

*[image: The switch handle increases in size when tapped and dragged.]*
Touch: Tap, Drag

*[image: The cursor changes from an arrow to a hand pointer when hovering over and clicking the switch.]*
Cursor: Hover, Click

#### Avoid applying density by default

Don't apply density to switches by default — this lowers their targets below our best practice of 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme.

To ensure that this density setting can easily be reverted when it's active, keep all targets to change it at a minimum 48x48 CSS pixels each.

### Initial focus

Initial focus lands directly on the switch’s handle, since it’s the primary interactive element of the component.

*[image: The focus is on the switch handle, which is toggled on.]*
Focus lands on the switch handle

*[image: Space or Enter is used to toggle the switch off.]*
The switch is toggled using **Space** or **Enter**

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Focus lands on the switch handle |
| **Space**or**Enter** | Toggles the handle on and off |

### Labeling elements

The accessibility label for a switch uses the adjacent label text if implemented correctly.

Assistive tech such as a screen reader will read the UI text followed by the component’s role.

*[image: “Dark theme” is the switch’s adjacent label text and the accessibility label.]*
A switch’s accessibility label can incorporate its adjacent UI text

When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a switch visibly labelled **Photo album** would benefit from additional information to clarify the switch’s function.

Consider making the adjacent label text more descriptive when possible. This reduces the need for different accessibility text.

*[image: The accessibility label for the switch is “Photo album access” though the label text is “photo album.”]*
While the visible label text reads **Photo album**, the accessibility label for this switch clarifies its function: **Photo album access**
