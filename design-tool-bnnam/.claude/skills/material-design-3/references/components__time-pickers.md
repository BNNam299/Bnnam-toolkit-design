<!-- Source: https://m3.material.io/components/time-pickers · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__time-pickers.md @ 3c0e291 -->

# Time pickers

## Overview

- Time pickers are modal and cover the main content
- Two variants: dial and input
- People can select hours, minutes, or periods of time
- Make sure time can easily be selected by hand on a mobile device

*[image: Dial time picker dial and input time picker.]*
1. Time picker dial
2. Time picker input

### Availability & resources

### Differences from M2

- Color: New color mappings and compatibility with dynamic color

*[image: Time picker’s old color mappings. The selected hour of 7 and AM text is purple, on a purple background.]*
M2: Time pickers had different color mappings

*[image: Time picker's new color mappings. The selected hour of 7 and AM text is black, with different background colors.]*
M3: Time pickers have new color mappings compatible with dynamic color

## Specs

### Tokens & specs

Select a component variant below to see its elements, attributes, tokens, and their values. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__time-pickers.md` — Time picker - Dial, Time picker - Input]*

### Anatomy

#### Time picker dial

*[image: Diagram indicating the 14 elements of a time picker dial.]*
1. Headline
2. Time selector separator
3. Container
4. Period selector container
5. Period selector label text
6. Clock dial selector center
7. Clock dial selector track
8. Text button
9. Icon button
10. Clock dial selector container
11. Clock dial label text
12. Clock dial container
13. Time selector label text
14. Time selector container

#### Time picker input

*[image: Diagram indicating the 10 elements of a time picker input.]*
1. Headline
2. Time input field seperator
3. Container
4. Period selector container
5. Period selector label text
6. Text button
7. Icon button
8. Time input field supporting text
9. Time input field label text
10. Time input field container

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

#### Time picker dial color

*[image: Side-by-side diagram indicating the 17 different color elements of a time picker dial.]*
Time picker dial color roles used for light and dark themes:

1. On surface variant
2. On surface
3. Surface container highest
4. On surface
5. Tertiary container
6. On tertiary container
7. Surface container high
8. Outline
9. On surface
10. Primary
11. On primary
12. Primary
13. On surface variant
14. On surface
15. Surface container highest
16. On primary container
17. Primary container

#### Time picker input color

*[image: Side-by-side diagram indicating the 13 different color elements of a time picker input.]*
Time picker input color roles used for light and dark themes:

1. On surface variant
2. On surface
3. Surface container highest
4. On surface
5. Tertiary container
6. On tertiary container
7. Surface container high
8. Outline
9. On surface
10. Primary
11. On surface variant
12. On primary container
13. Primary container

### States

*[image: Diagram showing the 4 interactive states of a time picker, in both light theme and dark theme.]*
1. Enabled
2. Hover
3. Focus
4. Pressed

[States specs can be found in the token module above](https://m3.material.io/components/time-pickers)

### Measurements

#### Time picker dial - vertical

*[image: Diagram of vertical time picker dial measurements.]*
Vertical time picker dial padding and size measurements

| Element | Attribute | Value |
|---|---|---|
| Container | Width | Dynamic |
| Height | Dynamic |  |
| Headline alignment | Left |  |
| Top/bottom padding | 24dp |  |
| Left/right padding | 24dp |  |
| Time selector container | Width | 96dp |
| Width (24h vertical) | 114dp |  |
| Height | 80dp |  |
| Period selector container | Width (vertical layout) | 52dp |
| Height (vertical layout) | 80dp |  |
| Width (horizontal layout) | 216dp |  |
| Height (horizontal layout) | 38dp |  |
| Clock dial container | Size | 256dp |
| Clock dial selector handle | Size | 48dp |
| Clock dial selector center | Size | 8dp |
| Clock dial selector track | Width | 2dp |

#### Time picker dial - horizontal

*[image: Diagram of horizontal time picker dial measurements.]*
Horizontal time picker dial padding and size measurements

| Element | Attribute | Value |
|---|---|---|
| Container | Width | Dynamic |
| Height | Dynamic |  |
| Headline alignment | Left |  |
| Top/bottom padding | 24dp |  |
| Left/right padding | 24dp |  |
| Time selector container | Width | 96dp |
| Width (24h vertical) | 114dp |  |
| Height | 80dp |  |
| Period selector container | Width (vertical layout) | 52dp |
| Height (vertical layout) | 80dp |  |
| Width (horizontal layout) | 216dp |  |
| Height (horizontal layout) | 38dp |  |
| Clock dial container | Size | 256dp |
| Clock dial selector handle | Size | 48dp |
| Clock dial selector center | Size | 8dp |
| Clock dial selector track | Width | 2dp |

#### Time picker input

*[image: Diagram of time picker input measurements.]*
Time picker input padding and size measurements

| Element | Attribute | Value |
|---|---|---|
| Container | Width | Dynamic |
| Height | Dynamic |  |
| Headline alignment | Left |  |
| Top/bottom padding | 24dp |  |
| Left/right padding | 24dp |  |
| Time input field container | Width | 96dp |
| Height | 72dp |  |
| Period selector container | Width | 52dp |
| Height | 72dp |  |

### Configurations

#### Vertical orientation and horizontal orientation

*[image: Comparing vertical and horizontal time picker dials.]*
1. Vertical layout (default on mobile)
2. Horizontal layout

#### 24-hour time picker dial

*[image: 2 24-hour time picker dials with vertical and horizontal layouts.]*
1. 24h dial in vertical layout (default on mobile)
2. 24h dial in horizontal layout

#### 12-hour and 24-hour time picker inputs

*[image: Compare 12-hour and 24-hour time picker inputs.]*
1. 12h input
2. 24h input

## Guidelines

*[image: Time picker. It has a dial and keyboard input for hours and minutes, and a setting for AM or PM.]*
Dial selector time picker for a 12-hour clock

### Usage

Time pickers allow people to enter a specific time value. They’re displayed in dialogs and can be used to select hours, minutes, or periods of time.

They can be used for a wide range of scenarios. Common use cases include:

- Setting an alarm
- Scheduling a meeting

Time pickers are not ideal for nuanced or granular time selection, such as milliseconds for a stopwatch application.

*[image: Time picker with dial input selecting hour 7.]* **✅ Do**
Hour selection in a mobile calendar picker

#### Time input picker

Time input pickers allow people to specify a time using keyboard numbers. This input option should be accessible from any other mobile time picker interface by tapping the keyboard icon.

*[image: Input time picker with keyboard active for the hour.]*
Hour input with keyboard entry

#### 24-hour time selection

The dial view can be changed to reflect time selection across 24 hours. This option is set outside of the time picker component, typically through system settings.

*[image: Time picker with dial input selecting hour 20. Hours 0–11 use an outer dial, hours 12–23 use an inner dial.]*
24-hour dial view

### Anatomy

*[image: 17 elements of a dial time picker.]*
1. Label (headline)
2. Time selector separator
3. Input field
4. Input text
5. Period selector (selected)
6. Period selector text (selected)
7. Container
8. Period selector outline
9. Period selector text
10. Dial selector track
11. Dial label (selected)
12. Text buttons
13. Icon button
14. Dial label (unselected)
15. Clock dial
16. Input text (selected)
17. Input field (selected)

*[image: 13 elements of an input time picker.]*
1. Label (headline)
2. Time selector separator
3. Input field
4. Input text
5. Period selector (selected)
6. Period selector text (selected)
7. Container
8. Period selector outline
9. Period selector text (unselected)
10. Text buttons
11. Icon button
12. Input text (selected)
13. Input field (selected)

#### Container

Like dialogs, the container should appear above other screen elements. To focus attention, surfaces behind the container have a temporary scrim overlay to make them less prominent.

*[image: Time picker container, all elements inside.]*
The container includes all time picker elements

#### Input selector

The input selector is a unique kind of text field input. It differs from typical text field inputs in that it has:

- An added highlight to call attention to the selected field
- A larger shape, size, and font
- A label below the field

Hours and minutes should have separate inputs. For people using a 12-hour clock, an AM/PM selector appears to the right of minutes. For people using a 24-hour clock, the AM/PM selector shouldn’t appear.

*[image: Input time picker with the hour field active, and so highlighted.]*
Input selector for a 12-hour clock

#### Dial selector

Dial selectors always mimic a round watch face. Hours and minutes can be selected by tapping a number or dragging the dial selector track.

When representing a 12-hour dial, all numbers appear in the outer ring. When representing a 24-hour dial, even numbers appear in an inner ring, and odd numbers appear in an outer ring.

*[image: Dial time picker with hour 7 selected.]*
Dial selector for a 12-hour clock

#### Text & icon buttons

Icon buttons are used to switch between the input selector, represented by a keyboard, and the dial selector, represented by a clock.

Text buttons are used to exit the dialog (**Cancel**) and save the selector input (**OK**).

*[image: Time picker buttons.]*
The keyboard icon allows people to switch between the dial selector (pictured) and the input selector

#### Landscape orientation

The clock dial interface adapts to a device’s orientation. In landscape mode, the stacked input and selection options are positioned side-by-side.

*[image: Time picker in landscape orientation on mobile.]*
On mobile, the time picker can adapt to landscape orientation

### Placement

Time pickers shouldn’t be obscured by other elements.

Time pickers should change orientation or variant to ensure they aren't cropped by the edge of the screen.<br><br>Time pickers are modal windows above a scrim. This puts the time pickers at the forefront of a person's view, calling attention to make a selection of time.

*[image: Input time picker in landscape orientation on mobile. It's fully visible despite the limited device height.]*
The time picker should change to fit the size of the screen so the time picker is always fully visible

### Adaptive design

Time pickers can swap between orientation or variant depending on device orientation and viewport constraints.

For example, the time picker can change to landscape orientation on larger breakpoints or when viewport height is limited, to avoid scrolling the dial presentation.

Time pickers can fallback to the input time picker when there isn’t enough vertical real estate to present the landscape orientation without scrolling.

*[image: Dial time picker in portrait orientation on mobile.]*
High-density time picker displayed on mobile

#### Density

Don’t apply density to the time picker dial when the viewport is constrained. Instead, use an input picker.

*[image: Dial time picker in portrait orientation, too tall to fully fit on a mobile device in landscape mode.]* **❌ Don't**
Don’t apply density to the time picker dial when the viewport is constrained. Instead, use an input picker.

### Behavior

There are two primary methods for selecting time with the mobile time picker. People can:

- Type in a specific value in the hour and minute fields
- Select the hour or minute field from the text input and adjust the clock dial to simultaneously change the corresponding time field above

*[video: Dial time picker possible interactions. Dial selector adjusts to match manual input.]*
The dial time picker supports both manual and dial input

#### Appearing & disappearing

Like other kinds of dialogs, time pickers use an enter and exit transition pattern to appear on the screen.

To exit a time picker, the input can either be confirmed (**OK**) or dismissed (**Cancel**). Interacting outside of the dialog will also dismiss the time picker. Unless one of these actions is taken, a time picker will continue to retain focus.

*[video: Time picker enter and exit transitions.]*
**OK** confirms the entry and closes the dialog

#### Toggle between dial & input

Tapping the keyboard icon on a mobile time picker switches the view to the input picker.

*[video: Time picker transitioning between dial and input selectors.]*
The keyboard icon in the lower left toggles between the input picker and the dial picker

#### Scrolling

Time pickers should avoid scrolling, and swap component orientation or variant based on device orientation or viewport size.

Time pickers don’t scroll with elements outside of the modal window, such as the background.

*[image: Input time picker in landscape orientation to fit a mobile device in landscape mode.]*
Time pickers shouldn’t scroll

## Accessibility

### Use cases

People should be able to use assistive technology to:

- Select or enter hours/minutes, and in some cases, seconds/milliseconds
- Choose from multiple time formats, including 24-hour clock view and AM/PM
- Enter time selection manually using input fields

### Interaction & style

Time pickers should allow manual time entry through text input, rather than exclusively through the dial selector. This makes it easier for those using keyboard inputs rather than touchscreens.

If a screen is not large enough to display the dial selector, consider displaying the input selector alone. Currently for Android Views, the dial selector is always visible.

The input selector should be accessible from the dial selector via the keyboard icon. This interaction allows multiple input methods and makes the time picker accessible for assistive technology users.

*[image: Time picker with active manual text input for hours.]*
For time selection that doesn’t require a dial view, make a time input picker the default option

#### Targets

Targets for dial selectors should be 48x48dp.

*[image: Time picker dial selector specs, selecting hour 7.]*
Dial selector targets should be 48x48dp

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Focus lands on (non-disabled) time slot |
| **Space** or **Enter** | Activates the (non-disabled) time slot |

### Labeling elements

If the input text is correctly linked, assistive tech like a screenreader will read the component’s role first, then the UI text.

*[image: Accessibility tags on the time picker's hour input field.]*
The hour and minute fields have the text input role

The dial selector will read a selection of total hours, such as **Hour 7 of 12**.

*[image: Accessibility tag on the time picker's dial selector.]*
A screen reader reads the text label of a dial selector

#### Dial selector

| Element | Accessibility label | Role (Wiz and Jetpack Compose) | Role (Android Views) |
|---|---|---|---|
| Hour input (input picker) | Hour | Text input | - |
| Minutes input | Minute | Text input | - |
| AM/PM selection | AM or PM | Radio button (in list) | Checkbox (in list) |
| Keyboard button | Toggle input picker | Button | Button |
| Cancel button | Cancel | Button | Button |
| OK button | OK | Button | Button |
| Clock dial time selection (dial selector) | {Value} Hours or minutes of {Total} | Button | - |

#### Input selector

| Element | Accessibility label | Role (Wiz and Jetpack Compose) | Role (Android Views) |
|---|---|---|---|
| Hour input (input picker) | Hour | Text input | - |
| Minutes input | Minute | Text input | - |
| Clock button | Toggle dial picker | Button | Button |
| Cancel button | Cancel | Button | Button |
| OK button | OK | Button | Button |
