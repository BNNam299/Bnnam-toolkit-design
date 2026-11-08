<!-- Source: https://m3.material.io/components/text-fields · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__text-fields.md @ 3c0e291 -->

# Text fields

## Overview

- Make sure text fields look interactive
- Two variants: filled and outlined
- The text field’s state (blank, with input, error, etc) should be visible at a glance
- Keep labels and error messages brief and easy to act on
- Text fields commonly appear in forms and dialogs

*[image: 2 variants of text fields, filled and outlined.]*
1. Filled text field
2. Outlined text field

### Availability & resources

### Differences from M2

- Color: New color mappings and compatibility with dynamic color

*[image: A filled and outlined text field with M3 color mappings.]*
Text fields have new color mappings

## Specs

### Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__text-fields.md` — Text field - Select, outlined, Text field - Autocomplete, filled, Text field - Autocomplete, outlined, Text field - Select, filled, Text field - Filled, Text field - Outlined]*

### Filled text field

*[image: Diagram of a filled text field indicating the 10 parts of its anatomy.]*
1. Container
2. Leading icon (optional)
3. Label text in empty field
4. Label text in populated field
5. Trailing icon (optional)
6. Focused active Indicator
7. Caret
8. Input text
9. Supporting text (optional)
10. Enabled active indicator

#### Filled text field color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Diagram of a filled text field indicating its color mappings.]*
Filled text field color roles used for light and dark schemes:

1. Surface container highest
2. On surface variant
3. On surface variant
4. Primary
5. On surface variant
6. Primary
7. Primary
8. On surface
9. On surface variant
10. On surface

#### Filled text field states

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

*[image: Side by side view of empty and populated filled text fields across different states, showing the differences between enabled, focused, hovered, and disabled.]*
1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Disabled (empty)
5. Enabled (populated)
6. Focused (populated)
7. Hovered (populated)
8. Disabled (populated)

#### Filled text field error states

Error states are visual representations used to communicate the status of a component or interactive element. An error message can display instructions on how to fix it. Error messages are displayed below the text field as supporting text until fixed.

*[image: Side by side view of empty and populated filled text fields across different error states, showing the differences between enabled, focused, hovered.]*
1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Enabled (populated)
5. Focused (populated)
6. Hovered (populated)

#### Filled text field measurements

*[image: Diagram showing layout values and paddings for filled text fields without icons.]*
Padding and size measurements without icons

*[image: Diagram showing layout values and paddings for outlined text fields with leading and trailing icons.]*
Padding and size measurements with icons

*[image: A diagram showing layout values and paddings for supporting text, and supporting text in combination with a character count.]*
Padding and size measurements with supporting text and character count

| Attribute | Value |
|---|---|
| Default container height | 56dp |
| Label alignment (unpopulated) | Vertically centered |
| Top/bottom padding | 8dp |
| Left/right padding without icons | 16dp |
| Left/right padding with icons | 12dp |
| Icon alignment | Vertically centered |
| Padding between icons and text | 16dp |
| Supporting text and character counter top padding | 4dp |
| Padding between supporting text and character counter | 16dp |
| Target size | 56dp |

#### Filled text field configurations

*[image: Side by side view of filled text fields in different configurations.]*
Empty and populated filled text fields with:

1. Supporting text
2. Trailing icon
3. Leading icon
4. Leading and trailing icons
5. Prefix
6. Suffix
7. Multi-line text field

### Outlined text field

*[image: Diagram of an outlined text field indicating the 9 parts of its anatomy]*
1. Enabled container outline
2. Leading icon (optional)
3. Label text in empty field
4. Label text in populated field
5. Trailing icon (optional)
6. Focused container outline
7. Caret
8. Input text
9. Supporting text (optional)

#### Outlined text field color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Diagram of an outlined text field indicating its color mappings]*
Outlined text field color roles used for light and dark schemes:

1. Outline
2. On surface variant
3. On surface variant
4. Primary
5. On surface variant
6. Primary
7. Primary
8. On surface
9. On surface variant

#### Outlined text field states

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

*[image: Side by side view of empty and populated outlined text fields across different states, showing the differences between enabled, focused, hovered, and disabled.]*
1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Disabled (empty)
5. Enabled (populated)
6. Focused (populated)
7. Hovered (populated)
8. Disabled (populated)

#### Outlined text field error states

Error states are visual representations used to communicate the status of a component or interactive element. An error message can display instructions on how to fix it. Error messages are displayed below the text field as supporting text until fixed.

*[image: Side by side view of empty and populated filled text fields across different error states, showing the differences between enabled, focused, hovered.]*
1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Enabled (populated)
5. Focused (populated)
6. Hovered (populated)

#### Outlined text field measurements

*[image: A diagram showing layout values and paddings for outlined text fields without icons.]*
Padding and size measurements without icons

*[image: A diagram showing layout values and paddings for outlined text fields with leading and trailing icons.]*
Padding and size measurements with icons

*[image: A diagram showing layout values and paddings for supporting text, and supporting text in combination with a character count.]*
Padding and size measurements with supporting text and character count

| Attribute | Value |
|---|---|
| Container height | 56dp |
| Left/right padding without icons | 16dp |
| Left/right padding with icons | 12dp |
| Padding between icons and text | 16dp |
| Icon alignment | Vertically centered |
| Supporting text and character counter top padding | 4dp |
| Padding between supporting text and character counter | 16dp |
| Label alignment | Vertically centered |
| Left/right padding populated label text | 4dp |
| Target size | 56dp |

#### Outlined text field configurations

*[image: A side by side view of outlined text fields in different configurations.]*
Empty and populated outlined text fields with:

1. Supporting text
2. Trailing icon
3. Leading icon
4. Leading and trailing icons
5. Prefix
6. Suffix
7. Multi-line text field

## Guidelines

*[image: A side by side view of a filled and a outlined text field.]*
Filled and outlined text fields

### Usage

Use a text field when someone needs to enter text into a UI, such as filling in contact or payment information.

*[image: Mobile UI of contact form with several text fields.]*
Contact form using outlined text fields

There are two variants of text fields:

1. Filled text fields
2. Outlined text fields

Both variants of text fields use a container to provide a visual cue for interaction and provide the same functionality.

*[image: Side by side view of a populated and unpopulated filled text field.]*
Filled text field

*[image: Side by side view of a populated and unpopulated outlined text field.]*
Outlined text field

#### Outlined text fields

Outlined text fields have less visual emphasis than filled text fields. When they appear in places like forms (where many text fields are placed together), their reduced emphasis helps simplify the layout.

*[image: App screen with 1 focused and 1 unfocused outlined text field.]*
Login screen with outlined text fields

### Choosing text fields

#### Choosing text fields

Both variants of text field provide the same functionality. The variant of text field used can depend on style alone.

Choose the variant that:

- Works best with an app’s visual style
- Best accommodates the UI's goals
- Is most distinct from other components (like buttons) and surrounding content

*[image: Mobile UI of a contact form with several filled text fields.]*
Mobile form using filled text fields

*[image: Mobile UI of a contact form with several outlined text fields.]*
The same mobile form using outlined text fields

#### Using both text field variants on the same screen

If both variants of text field are used in a UI, they should be used consistently within different sections, and not intermixed within the same region.

For example, use outlined text fields in one section and filled text fields in another.

*[image: Mobile UI of a contact form with several filled text fields, and an open dialog on top using an outlined text field.]* **✅ Do**
When using both variants of text fields in a UI, separate them by region

*[image: Mobile UI of a contact form with a mix of outlined and filled text fields.]* **❌ Don't**
When using both variants of text fields, don't use both next to each other or within the same form

### Anatomy

#### Filled text field

*[image: Diagram of filled text field indicating the 10 parts of its anatomy.]*
1. Container
2. Leading icon (optional)
3. Label text in empty field
4. Label text in populated field
5. Trailing icon (optional)
6. Focused active Indicator
7. Caret
8. Input text
9. Supporting text (optional)
10. Enabled active Indicator

#### Outlined text field

*[image: Diagram of an outlined text field indicating the 9 parts of its anatomy.]*
1. Enabled container outline
2. Label text in empty field
3. Leading icon (optional)
4. Label text in populated field
5. Trailing icon (optional)
6. Focused container outline
7. Caret
8. Input text
9. Supporting text (optional)

#### Containers

Containers improve the discoverability of text fields by creating contrast between the text field and surrounding content.

**Fill and stroke**<br>A text field container has a fill and a stroke either around the entire container, or just the bottom edge. The color and thickness of a stroke can change to indicate when the text field is active.

**Rounded corners**<br>The container of an outlined text field has rounded corners, while the container of a filled text field has rounded top corners and square bottom corners.

*[image: Side by side view of the containers of a filled and outlined text field.]*
Text field containers

#### Label text

Label text tells people what information is requested. Every text field should have a label.

Label text should be aligned with the input text, and always visible. It can be placed in the middle of a text field, or rest near the top of the container.

Label text shouldn't be truncated or take up multiple lines. Keep it short, clear, and fully visible.

*[video: Animation of 2 text field’s label text changing position when empty and populated.]*
Label text should always be visible. When the field is selected, the label text moves from the middle of the text field to the top.

*[image: Text field with very long label text, too long to display fully display inside the text field container.]* **❌ Don't**
Don’t truncate label text. Keep it short, clear, and fully visible.

*[image: Text field with very long label text split into 2 lines.]* **❌ Don't**
Label text shouldn’t take up multiple lines

#### Adjacent label

A text field doesn't require a label if the field's purpose is indicated by a separate, adjacent label.

Adjacent labels should be aligned to the leading edge of the text field container.

*[image: Mobile UI of a contact form with label texts placed outside and on top of the text fields.]*
Text fields with adjacent labels

#### Required text indicator

To show a field is required, display an asterisk (*) next to the label text, and explain that asterisks indicate required fields in one of two ways:

- Supporting text
- A single note at the beginning of the form

Additional best practices include:

- Indicate all required fields
- If required text has a particular color, use the same color for the asterisk

*[image: Mobile UI of a contact form showing supporting text below the text field, indicating an input is required.]*
Asterisk with required supporting text

#### Input text

Input text is text a person has entered into a text field.

Text fields can display input text in the following ways:

- **Single line** text fields display only one line of text
- **Multi-line** text fields grow to accommodate multiple lines of text
- **Text areas** are fixed-height fields

*[image: Text field with populated input text.]*
Input text in a filled text field

*[video: Text field with very long input text that scrolls sideways.]*
In **single-line** fields, as the cursor reaches the right field edge, text longer than the input line automatically scrolls left. Single-line fields are not suitable for collecting long responses; use a multi-line text field or text area instead.

*[video: Text field with very long input text that wraps into a second line, expanding the text field container.]*
In **multi-line** fields, overflow text causes the text field to expand, shifting screen elements downward and text wraps onto a new line. These fields initially appear as single-line fields, which is useful for compact layouts that need to accommodate large amounts of text.

*[video: Text area with enough space to allow a very long input text to wrap into a second line without the need to expand the container.]*
**Text areas** are taller than text fields and wrap overflow text onto a new line. They are a fixed height and scroll vertically when the cursor reaches the bottom of the field. The large initial size indicates that longer responses are possible and encouraged. These should be used instead of multi-line fields on the web. Ensure the height of a text area fits within mobile screen sizes.

#### Prefix text

Text fields can contain prefix text such as currency symbol.

*[image: Text field with a currency prefix before the input text.]*
A text field with a currency symbol text prefix

#### Suffix text

Text fields can contain suffix text such as unit of measurement or email domain.

*[image: Text field with a suffix after the input text indicating a maximum input of 100.]*
A text field with a grading scale as suffix

*[image: Text field with a suffix after the input text indicating an email address.]*
A text field with an email domain suffix

#### Supporting text & character counter

Supporting text conveys additional information about the input field, such as how it will be used. It should ideally be one line, though may wrap to multiple lines if required. It can be either persistently visible or visible only on focus.

If there is a character or word limit, include a character or word counter. They display the ratio of characters used and the total character limit.

*[image: A side by side view of a text field with supporting text aligned with the trailing side, and a character counter aligned with the trailing side.]*
1. Supporting text
2. Character counter

#### Error text

For text fields that validate their content such as passwords, replace supporting text with error text. Swapping supporting text with error text prevents new lines of text from bumping content and changing the layout.

- If only one error is possible, error text should describe how to avoid the error
- If multiple errors are possible, error text should describe how to avoid the most likely error

*[video: Mobile UI of a sign up form indicating a invalid entry, and a hint on how to resolve as supporting text below the container.]* **✅ Do**
Swap supporting text with error text

*[video: Mobile UI of a sign up form with an invalid text field entry. The regular supporting text remains above the error message.]* **❌ Don't**
Don't add error text in addition to supporting text, as their appearance will shift content

*[image: Mobile UI of a sign up form with an invalid text field entry. The error message wraps to 2 lines.]* **⚠️ Caution**
Long errors can wrap to multiple lines if there isn't enough space to clearly describe the error. In this case, ensure padding between text fields is sufficient to prevent multi-lined errors from bumping layout content.

#### Error icon

It’s strongly recommended to show an error icon when the text field is in the error state.

This highlights the error for people with visual impairments, and provides an additional sensory indicator.

*[image: 2 text fields with error messages. The active text field has a thicker border. Both text fields have a trailing error icon.]*
The error icon is an important second visual indicator that a text field has an error

#### Icons & images

Icons in text fields are optional. Text field icons can:

- Describe valid input methods such as a microphone icon
- Provide affordances to access additional functionality such as clearing the content of a field
- Express an error

Leading and trailing icons change their position based on LTR or RTL contexts.

Images that are 24dp in height can be placed inside of text fields. This image height allows for optimal top and bottom padding within the field and is consistent with icon size recommendations.

1. **Icon signifier  **Icon signifiers can describe the type of input a text field requires, and be touch targets for nested components. For example, a calendar icon may be tapped to reveal a date picker.
2. **Valid or error icon **Iconography can indicate both valid and invalid inputs, making error states clear for colorblind users.
3. **Clear icon **Clear icons let a person clear an entire input field. They appear only when input text is present.
4. **Voice input icon **A microphone icon signifies that people can input characters using voice.
5. **Dropdown icon **A dropdown arrow indicates that a text field has a nested selection component.
6. **Image **An image can help contextualize the required input text such as a credit card number.

*[image: Side by side view of text fields with different icons and images as trailing elements within the container.]*
1. Icon signifier
2. Valid or error icon
3. Clear icon
4. Voice input icon
5. Dropdown icon
6. Image

#### Read-only fields

Read-only text fields display pre-filled text that people cannot edit.

A read-only text field is styled the same as a regular text field and is clearly labeled as read-only.

*[image: Read only filled text field.]*
A filled read-only text field

*[image: Read only outlined text field.]*
An outlined read-only text field

### Adaptive design

As layouts adapt to larger screens and different breakpoints, apply flexible container dimensions to text fields. Set minimum and maximum values for margins, padding, and container dimensions as layouts scale so that typography adjusts for better reading experiences.

*[image: UI for creating a new album in a side by side view on mobile and tablet.]*
For compact breakpoints, text fields can span the full width of the display. For medium and expanded breakpoints, text fields should be bound by flexible margins or other containers.

As text fields expand in fluid layouts, avoid maintaining fixed margins and typography properties. This can lead to extra long text fields.

For example, text fields should not span the full width of a large screen.

*[image: Tablet UI with text fields spanning the complete width of the screen.]* **❌ Don't**
Don’t use fixed text field margins on large devices. Text fields shouldn’t span the full width of a large screen.

#### Density

Dense text fields enable people to scan and take action on large amounts of information.

*[image: Tablet UI with desne text field as part of event creation form.]*
A form with dense text fields

##### **Avoid applying density by default**

Don't apply density to text fields by default. This lowers their targets below the recommended 48x48 CSS pixels. Instead, give people a way to choose a higher density, like selecting a denser layout or changing the theme.

To ensure this density setting can be easily reverted when it's active, keep all the targets to change it at a minimum of 48x48 CSS pixels each.

## Accessibility

### Use cases

User should be able to:

- Navigate to and activate a text field with assistive technology
- Input information into the text field
- Receive and understand supporting text and error messages
- Navigate to and select interactive icons

### Interaction & style

The containers for both filled and outlined text fields provide the same functionality. Changes to color and thickness of stroke help provide clear visual cues for interaction.

*[image: 2 filled text fields in enabled empty state and in focused populated state have visual cues to identify their state.]*
Filled text fields

*[image: 2 outlined text fields in enabled empty state and in focused populated state have visual cues to identify their state.]*
Outlined text fields

Containers improve the discoverability of text fields by creating contrast between the text field and surrounding content. <br><br>In some contexts, outlined text fields can improve the perception of the fields with a 3:1 or greater contrast ratio between the container outline and the background.

*[image: An outlined text field with label text that passes the minimum contrast of 3:1.]* **✅ Do**
Make sure the container outline has a minimum contrast of 3:1 to the background

*[image: An outlined text field with label text fails the minimum 3:1 contrast.]* **❌ Don't**
Don't choose colors that won't pass Material's minimum contrast of 3:1

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab | Focus lands on (non-disabled) text field |

### Labeling elements

If the UI text is correctly linked, assistive tech (such as a screenreader) will read the UI text followed by the component’s role.<br><br>The accessibility label for a text field is the same as the text field label.

*[image: The text field  and accessibility label both read “Email.” The role is “textbox.”]*
A text field’s label should include its UI text

For text fields with interactive trailing icons, the accessibility label clarifies its function.

For example, when a password is hidden, the label for the view icon is "Show password," and when the password is visible, the label is "Hide password."<br><br>When an icon has no actionable role, like an error icon, the label is "Error."

*[image: The trailing icon’s accessibility label “Show Password.” The role is “Button.”]*
When a trailing icon in the field acts as a button, the label should clarify function, while the role explains the component type

The prefix and suffix of a text field provides symbols and abbreviations to help users enter the correct values. <br> <br>The accessibility label for prefix and suffix needs to have a unique id attribute, for example, the currency name for a currency symbol prefix.

*[image: Text field accessibility labels “UI text” are “Euro” for a currency prefix and “At gmail dot com” for the email address suffix.]*
A form containing fields with both a prefix for currency, and a suffix for email address

When there is an error, "alert" is applied to the role and the error message to the text label.

If a text field displays both supporting text and error text, the label should include the supporting text first, followed by the error text.

*[image: The text field accessibility labels is: UI text “Not a valid ZIP code.” The role is “Alert.”]*
Text field error messages should be given an “alert” role in accessibility labels

The accessibility label for the character counter clarifies the number of characters that can be entered into the text field.

*[image: A character counter's accessibility label  reads: UI text (“Character count, 5/20”)]*
The remaining character counter should be called “character count” within the label

The text displayed in the supporting text is also used for its accessibility label.

*[image: The accessibility label uses the supporting text. It reads: UI text (“Please use the company email address”). Role [No role].]*
Text field supporting text should have its own accessibility label

If a text field requires input, indicate so with an asterisk at the end of the text field label. The accessibility label must include the asterisk.

*[image: Accessibility label reads: UI text (“Username*”).  The role is “Textbox.”]*
A required text field’s accessibility label should include any supporting text
