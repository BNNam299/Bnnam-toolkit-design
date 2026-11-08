<!-- Source: https://m3.material.io/foundations/interaction/states · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__interaction__states.md @ 3c0e291 -->

# States

States show the interaction status of a component or UI element

## Overview

- States have two visual indicators to ensure accessibility
- States can be combined, such as selection and hover
- Apply states consistently across components

### Resources

| Type | Link | Status |
|---|---|---|
| Design | [Design Kit](http://goo.gle/m3-design-kit) | Available |

1. [Enabled<br>](https://m3.material.io/m3/pages/interaction-states/applying-states#39b2fc90-01db-41b5-b6f8-47be61ed1479)An enabled state communicates an interactive component or element.

2. [Disabled](https://m3.material.io/m3/pages/interaction-states/applying-states#4aff9c51-d20f-4580-a510-862d2e25e931)<br>A disabled state communicates an inoperable component or element.

*[image: Enabled button has a strong contrast between container and text.]*
Enabled button

*[image: Disabled button has low contrast grey text on grey container.]*
Disabled button

3. [Hover](https://m3.material.io/m3/pages/interaction-states/applying-states#71c347c2-dd75-485b-892e-04d2900bd844)<br>A hover state communicates when a user has placed a cursor above an interactive element.

4. [Focused](https://m3.material.io/m3/pages/interaction-states/applying-states#bc6d6853-48ef-490e-8076-448e89e69f0f)<br>A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice.

*[image: Cursor positioned over a button.]*
Hovered button

*[image: The focused button has a strong contrast between container and text.]*
Focused button

5. [Pressed](https://m3.material.io/m3/pages/interaction-states/applying-states#c3690714-b741-492d-97b0-5fc1960e43e6)<br>A pressed state communicates a user tap.

6. [Dragged](https://m3.material.io/m3/pages/interaction-states/applying-states#c97582c4-5fef-42ce-9c34-71f8dcc5b8ad)<br>A dragged state communicates when a user presses and moves an element.

*[image: The pressed button has a strong contrast between container and text.]*
Pressed button

*[image: Dragged chip]*
Dragged chip

## State layers

### State layers

A state layer is a semi-transparent covering on an element that indicates its state. State layers provide a systematic approach to visualizing states by using opacity. A layer can be applied to an entire element or in a circular shape and only one state layer can be applied at a given time.

To transition from an enabled style to a stateful style requires the addition of a state layer.

The state layer is an overlay with a fixed opacity for each state and uses the same color as the content.

For example, if the enabled style uses the **secondary container** color for the container and **on secondary container** for content, the state layer will be an overlay using the **on secondary container** color.

If the enabled style uses the **surface** color for the container and the **primary** color role for content, then the state layer will be an overlay using the **primary** color.

*[image: State layer sandwiched between the container and content.]*
1. Container
2. State layer
3. Content

The size of state layers is 40dp while the interactive target size is 48dp.

*[image: Interaction target is larger than the state layer.]*
1. State layer
2. Interactive target

#### On colors

By default, a component’s state layer color is derived from the color of its content, either the color of an icon or label text if no icon is present.

An [on color](https://m3.material.io/styles/color/roles) is a color role used by the content. Each container color has its own corresponding on color. <br><br>For example, if a container color is **secondary container**, the content will use the **on secondary container** color role.

*[image: State layer sandwiched between  the content and container.]*
Order of surface layers shows the state layer (2) between the container (1) and content (3) layers

#### State layer tokens & values

The state layer uses a fixed percentage for the opacity for each state. A state layer uses the color used by content (usually the [on color](https://m3.material.io/styles/color/roles)) and the percentage opacity for its respective state.

*[image: The opacity values of four overlay states.]*
Four overlay states and their values:

1. Hover +8% opacity
2. Focus +10% opacity
3. Press +10% opacity
4. Drag +16% opacity

## Applying states

### Enabled

An enabled state communicates an interactive component or element. Enabled states use the default styling for each interactive component.

*[image: Enabled state of 4 components.]*
Enabled states for:

1. Button
2. FAB
3. Switch
4. Text field

### Disabled

A disabled state communicates when a component or element isn’t interactive. This state is visually communicated through color changes and reduced elevation.

**Disabled states don't need to meet Material's contrast requirements.**

*[image: Low opacity solitary button labeled disabled, indicates a  disabled/inoperable state.]*
Disabled button

Disabled states **are** inherited by action, selection, and input components:

- Buttons
- Cards
- Checkboxes
- Chips
- List items
- Radio buttons
- Switches
- Text fields

*[image: Inoperable state of 4 components.]*
Disabled states for:

1. Checkbox
2. Icon button
3. Radio button
4. Segmented button

Disabled states **aren't** inherited by communication, containment, navigation, and some actions components:

- App bars
- Badges
- Dialogs
- Floating action buttons (FABs)
- Menus
- Navigation bar, drawer, and rail
- Sheets
- Tabs
- Tooltips

*[image: Screen erroneously showing edit FAB in inoperable state, though the edit function is unavailable.]* **❌ Don't**
If the action represented in the FAB is unavailable, the FAB shouldn't appear

#### Behavior

Disabled components can’t be focused, dragged, or pressed, and they don’t change state when tapped or hovered over.

*[video: A cursor moves over and clicks on an disabled/inoperable button and the button doesn’t change.]*
A disabled button doesn’t inherit hover or other state layers

There can be any number of disabled states in a layout.

*[image: Disabled components on a screen.]*
1. Disabled redo icon button
2. Disabled checklist icon button

### Hover

Hover states are initiated by the user pausing over an interactive element using a cursor.

The lower-emphasis surface overlay for hover states can be applied to the entire component, elements within a component, or as a circular shape over part of the component.

*[image: Cursor moves toward button which reads “enabled” and when the cursor touches the button text changes to “hovered.”]*
Hovered button

Hover states **are** inherited by action, selection, and input components:

- Buttons
- Cards
- Checkbox
- Chips
- Date and time pickers
- List items
- Slider
- Switch
- Text fields

*[image: Hover state of 4 components.]*
Hovered states for:

1. FAB
2. Icon button
3. Chip
4. Segmented buttons

Hover states **aren’t** inherited by communication, containment, or navigation components:

- App bars
- Badges
- Dialogs
- Menus
- Navigation bar, drawer, and rail
- Sheets
- Tabs

*[image: Mobile screen with the whole  app bar wrongly in hover state.]* **❌ Don't**
The individual components that are actionable within the app bar inherit hover states, not the whole app bar

#### Behavior

Hover states are initiated by the user pausing over an interactive element using a cursor.

*[video: Button’s text“Enabled”  changes to“Hovered” when cursor moves over the button.]*
Hover states appear and disappear using a low-emphasis animated fade

Hover states can be combined with focused, activated, selected, or pressed states.

*[video: Filter chip text matches state as it's unselected, hovered, and selected by a cursor.]*
A selected filter chip in both selected and hover states

There can only be one hover state at a time in a layout.

*[video: Hover state moves from one card to another with cursor movement.]*
Hover state can only be on one element at a time based on cursor position

### Focused

A focused state communicates when a user has highlighted an element using a keyboard or voice. Focus states apply to all interactive components.

The higher-emphasis surface overlay for focused states can be applied to the entire component, elements within a component, or as a circular shape over part of the component.

*[image: A button in focused state.]*
Focused button

Focus states **are** inherited by action, selection, and input components:

- Buttons
- Cards
- Checkbox
- Chips
- Date and time pickers
- List items
- Selection controls
- Text fields

*[image: Focus state of 4 components.]*
Focused states for:

1. FAB
2. Icon button
3. Chip
4. Segmented buttons

Focus states **aren’t** inherited by most communication, containment, or navigation components:

- App bars
- Badges
- Banner
- Card
- Dialogs
- Navigation bar, drawer, and rail
- Sheets

*[image: Mobile screen showing  entire app bar in focus state, which is an error.]* **❌ Don't**
The individual components that are actionable within the app bar inherit focus states, not the whole app bar

#### Keyboard focus indicator

Many people use the **Tab** key or other shortcut to navigate the interactive elements of a web page, like links, buttons, and chips.

When an element is tabbed to, it appears in its focused state with a ring-like **keyboard focus indicator**. This indicator helps web users know where they are on the page.

While focused, an element can be acted on with the keyboard.

*[image: A single filled button in focused state, displaying the keyboard focus indicator.]*
Keyboard focus indicator for a filled button

#### Behavior

Focus states are initiated by the user by pressing the **Tab**key on the keyboard (or equivalent).

Focus states can be represented in combination with hover, activated, or selected states.

*[image: A single filter chip simultaneously in selected state and focus state.]*
A selected filter chip in both selected and focused states

There can only be one focus state at a time in a layout.

*[video: Cursor moving from one card in focus state to another card moves the focus state to the second card.]*
A focus state applied to one card at a time

### Pressed

A pressed state communicates a user-initiated tap or click via cursor, keyboard, or voice input. This state applies to all interactive components.

Pressed states trigger a change in composition and should be high-emphasis.

A ripple overlay signifies a pressed state. It can be applied to an entire component or elements within a component, or as a circular shape over part of the component.

*[image: Button using a ripple overlay to signify it’s in a pressed state.]*
Pressed button

Some components, such as buttons or cards, can inherit elevation to signify a pressed state.

*[image: Button using elevation to signify it’s in a pressed state.]*
Pressed button with elevation

Pressed states **are** inherited by action, selection, and some containment components:

- Buttons
- Cards
- Checkbox
- Chips
- List items
- Text fields

*[image: Four components shown in pressed state.]*
Pressed states for:

1. FAB
2. Icon button
3. Chip
4. Segmented button

Pressed states **aren’t** inherited by communication, navigation, or some containment components:

- App bars
- Badges
- Bottom navigation
- Dialogs
- Menus
- Sheets
- Tabs

*[image: Mobile screen showing  entire app bar in pressed state is an error.]* **❌ Don't**
The individual components that are actionable within the app bar inherit pressed states, not the whole app bar

#### Behavior

Pressed states are initiated by user keyboard or voice input on an interactive element.

*[video: Enabled state activated to pressed state.]*
Activated states appear in user-initiated order

Pressed states can be combined with hovered, focused, activated, or selected states.

*[video: Hovered state activated to a pressed state.]*
Activated states can be represented in combination with hover and focus

There may only be a single pressed state at a time in a layout.

*[video: Pressed state on one card at a time.]*
A pressed state applied to one card at a time

### Dragged

A dragged state occurs when a user presses and moves an element or component. Dragged states should be low emphasis, to avoid distracting users from their task.

Dragged states use a lower emphasis overlay. It can be applied to the entire component or to elements within a component.

Some components, such as list items, chips, or cards, can inherit elevation to signify a dragged state.

*[image: List item shown in dragged state.]*
Dragged list item

Dragged states **are** inherited by some containment and selection components:

- Cards
- Chips
- List items
- Sliders

*[image: A chip and a card both shown in dragged state.]*
Dragged states for:

1. Chip
2. Card

Dragged states **aren’t** inherited by action, communication, navigation, or some containment components:

- App bars
- Badges
- Buttons
- Dialogs
- Menus
- Navigation bar, drawer, and rail

*[image: Mobile screen with app bar in dragged state is an error.]* **❌ Don't**
Components like an app bar that require consistent placement should not inherit dragged states

#### Behavior

Dragged states are initiated when users touch and hold elements, using an input method such as a tap or click.

*[video: Going through the states of a draggable list item:  enabled, hovered, dragged.]*
A list item in a dragged state

There may only be a single dragged state at a time within a layout.

*[video: Cursor dragging cards one at a time.]*
Dragged state applied to one card at a time
