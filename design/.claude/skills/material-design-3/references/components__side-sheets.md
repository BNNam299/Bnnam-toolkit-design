<!-- Source: https://m3.material.io/components/side-sheets · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__side-sheets.md @ 3c0e291 -->

# Side sheets

## Overview

- Use side sheets to provide optional content and actions without interrupting the main content
- Two variants: standard and modal
- People can navigate to another region within the sheet
- Side sheets can contain a back icon for navigation

*[image: The 2 variants of side sheets.]*
1. Standard side sheet
2. Modal side sheet

### Availability & resources

### Differences from M2

- Right-to-left (RTL) language support with left side sheet
- Color: New color mappings and compatibility with dynamic color
- Shape: Modal side sheets have a 16dp corner radius

*[image: A modal side sheet showing the 16dp corner radius.]*
Side sheets have new color mappings to support dynamic color

## Specs

### Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__side-sheets.md` — Sheets - Side]*

### Standard side sheet

*[image: 4 elements of a standard side sheet.]*
1. Divider (optional)
2. Headline
3. Container
4. Close icon button

#### Standard side sheet color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 4 color roles applied to a side sheet in light and dark themes.]*
Side sheet color roles used for light and dark themes:

1. Outline variant
2. On surface variant
3. Surface
4. On surface variant

#### Standard side sheet measurements

*[image: Standard side sheet padding and size measurements.]*
Side sheet padding and size measurements

| Attribute | Value |
|---|---|
| Start/end padding | 24dp |
| Padding between top elements | 12dp |
| Bottom actions height | 72dp |
| Bottom actions top padding | 16dp |
| Bottom actions bottom padding | 24dp |
| Bottom actions alignment (horizontal) | Left |
| Max-width | 400dp |
| Margins (when detached) | 16dp |

### Modal side sheet

*[image: 7 elements of a modal side sheet.]*
1. Back icon button (optional)
2. Headline
3. Container
4. Close icon button
5. Divider (optional)
6. Action buttons (optional)
7. Scrim

#### Modal side sheet color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens).

*[image: 4 color roles applied to a modal side sheet in light and dark themes.]*
Side sheet color roles used for light and dark themes:

1. On surface variant
2. On surface variant
3. Surface container low
4. On surface variant

#### Modal side sheet measurements

*[image: Modal side sheet padding and size measurements]*
Modal side sheet padding and size measurements

| Attribute | Value |
|---|---|
| Start/end padding | 24dp |
| Start padding with icon | 16dp |
| Padding between top elements | 12dp |
| Bottom actions height | 72dp |
| Bottom actions top padding | 16dp |
| Bottom actions bottom padding | 24dp |
| Bottom actions alignment (horizontal) | Left |
| Max-width | 400dp |
| Margins (when detached) | 16dp |

## Guidelines

*[image: Side by side comparison of a standard and a modal side sheet.]*
1. Standard side sheet
2. Modal side sheet

### Usage

Standard side sheets are supplementary surfaces used mostly in medium to expanded breakpoints, like tablet and desktop. They provide a consistent and predictable surface for contextual actions and information.<br><br>Standard side sheets display content that complements the screen’s primary content. They remain visible while people interact with primary content.

Common uses include:

- Displaying a list of actions that affect the screen’s primary content, such as filters
- Displaying supplemental content and features

*[image: Standard side sheet showing supplementary information about a photo.]*
Information about a photo in a standard side sheet

Modal side sheets are preferred in compact breakpoints, like mobile, due to limited screen size.

They can display the same kinds of content as standard side sheets, but must be dismissed in order to interact with the underlying content.

*[image: Modal side sheet showing filter controls.]*
Modal side sheet with filter controls

Side sheets have a fixed width and typically span the height of the screen.

Their dimensions depend on how the app’s layout is subdivided into UI regions.

*[image: A modal sheet at the right of a screen, with the correct inset.]* **✅ Do**
Place side sheets along the edge of the screen, usually on the right side to avoid interference with any navigational components on the left edge. They can be slightly inset by 16dp.

*[image: A modal side sheet at the right of the screen with the wrong inset.]* **❌ Don't**
Don’t inset a side sheet from the screen edges far beyond the recommended margin. This makes the sheet’s position and scroll behavior unclear, while obscuring primary content.

### Anatomy

*[image: 4 elements of a standard side sheet.]*
1. Divider (optional)
2. Headline
3. Container
4. Close icon button

*[image: 7 elements of a modal side sheet.]*
1. Back icon button (optional)
2. Headline
3. Container
4. Close icon button
5. Divider (optional)
6. Action buttons (optional)
7. Scrim

#### Container

Side sheet containers hold all side sheet elements. Their size is determined by the space those elements occupy.<br> <br>The container is the only required element of a side sheet.

*[image: A modal side sheet’s container.]*
1. Container

#### Back icon button (optional)

Icon buttons can provide ways to exit a side sheet or move to a different experience.<br><br>Because the primary content behind or beside a side sheet is always visible, it’s important to provide affordances for leaving a side sheet and returning to the primary content.

*[image: Back icon button on the upper left of a modal side sheet.]*
1. Back icon button

#### Close icon button (optional)

A close affordance provides a consistent method for dismissing a side sheet.

A close icon button is highly recommended, increases accessibility, and makes focused side sheets easier to close.

*[image: Close icon button on the upper right of a modal side sheet.]*
1. Close icon button

#### Action buttons (optional)

Buttons represent actions available from a side sheet. Examples: **Save**, **Edit**, **Download**

Use elevation, fill, and tone to call attention to specific actions.

*[image: Save and cancel buttons at the bottom of a modal side sheet.]*
1. Action buttons

#### Divider (optional)

Dividers can separate different kinds of content and create distinct regions in a side sheet.

Use a divider to separate:

- Action buttons from content
- User-generated content from system-generated content

*[image: Horizontal divider on a modal side sheet.]*
1. Divider

#### Content (optional)

Side sheets can display a wide variety of content and layouts, ranging from a list of actions to supplemental content in a tabular layout.

*[image: 2 side sheets with different content displayed side by side.]*
Form controls shown in a side sheet for app settings

*[video: As a small screen changes to a larger size the modal side sheet transitions to a standard side sheet.]*
Modal side sheets on smaller screens can transition to standard side sheets at larger screen sizes

### Adaptive design

Side sheets have a default width, but can be resized depending on the needs of the layout. <br><br>When a standard side sheet opens, the body area shrinks to accommodate the sheet’s width while maintaining a margin on the body’s trailing edge.

*[video: Body area of a screen adjusts to accommodate entrance and exit of side sheet.]*
Entrance of standard side sheets will cause the body area to adjust and accommodate the new content

#### RTL language support

In right-to-left (RTL) languages, side sheets should appear on the left edge of the window with all elements reversed.

*[image: Side sheet along the left edge of a screen. All buttons and icons are reversed.]*
Side sheet elements are reversed in RTL languages

### Behavior

Side sheets can vertically scroll independent of the rest of the UI.

This allows their scroll position and content to persist while the page is scrolled, and vice versa.<br><br>Side sheets cannot scroll horizontally.

*[video: Animation showing a side sheet being scrolled vertically to view all the options.]* **✅ Do**
Side sheets can vertically scroll internally when their content exceeds the screen height

*[image: A side sheet appears to scroll horizontally.]* **❌ Don't**
Don’t allow horizontal scrolling or lay out the side sheet in a way that suggests horizontal scrolling. A side sheet’s narrow width leaves limited space to fully view items.

#### Predictive back

On Android, a gesture called [predictive back](https://github.com/material-components/material-components-android/blob/master/docs/foundations/PredictiveBack.md) allows a person to swipe left or right on the side sheet.

When predictive back is used:

- The side sheet detaches from the top and bottom edges of the screen to signal it will close
- The previous screen is revealed in a preview
- The side sheet and its content always scales in the direction of the gesture

[Find a list of compatible components](https://m3.material.io/foundations/interaction/gestures)

*[video: Swiping to go back shows a preview of the previous screen.]*
Preview of the result of the gestures: release to commit, fling to commit, and cancel

## Accessibility

### Use cases

People should be able to dismiss the side sheet using assistive technology.

### Interaction & style

Material requires that a close affordance, such as a close icon button, is always present within a side sheet.

*[image: Side sheet correctly designed with close icon in upper right corner.]* **✅ Do**
A close icon button makes the side sheet easy to dismiss

*[image: Side sheet incorrectly designed with no close icon button.]* **❌ Don't**
Without a close icon button, people can’t predict the opening and closing flow of side sheets, or know if the sheet is transient or permanent

### Initial focus

Actions within a side sheet can be focused by tab order using a keyboard or switch control.

*[image: Side sheet diagram showing the focus order of headline, close, save, cancel.]*
Visible focus shown on the available actions within a side sheet:

1. Headline
2. Close
3. Cancel
4. Save

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Focus lands on (non-disabled) icon button |
| **Space** or **Enter** | Activates the (non-disabled) icon button |

### Labeling

The accessibility role for a side sheet is **Dialog**.

*[image: Side sheet showing the accessibility role as dialog.]*
The role for side sheets is **Dialog**
