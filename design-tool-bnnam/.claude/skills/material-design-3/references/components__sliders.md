<!-- Source: https://m3.material.io/components/sliders · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__sliders.md @ 3c0e291 -->

# Sliders

## Overview

- Three variants: Standard, centered, range
- Has five sizes, vertical and horizontal orientation, and an optional inset icon
- Sliders should present the full range of available values
- The slider value should take effect immediately

*[video: A vertical slider changes the brightness of bedroom lights.]*
Sliders change values along a range

### Availability & resources

### M3 Expressive update

**May 2025**

The slider includes expressive configurations for orientation, shape sizes, and an inset icon. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Updated on Android Views (MDC-Android) and Jetpack Compose.

Variants and naming:

- Changed **continuous** slider to **standard** slider
- The **discrete** slider is now the **stops** configuration

New configurations:

- Orientation: Horizontal, vertical
- Optional inset icon (standard slider only)
- Sizes: XS (existing default), S, M, L, XL

*[image: 3 M3 Expressive sliders.]*
1. Standard slider
2. Centered slider
3. Range slider

### Previous updates

#### Visual refresh to improve non-text contrast

**Dec 2023:** Updated on Android Views (MDC-Android) and Jetpack Compose.

- **Configuration:** Added centered configuration and range selection
- **Shape:**New shape for slider tracks and handles. Slider elements change shape when selected.
- **Motion:** Slider handle adjusts width upon selection. Slider tracks adjust in shape when sliding to the edge.
- **Color:**Refreshed color mappings

*[image: M3 visually-refreshed slider.]*
M3 visual refresh: Sliders have a stop indicator, larger label text, and a vertical handle that narrows when pressed. Centered sliders start from the middle instead of the leading edge.

### Differences from M2

- **Color**: New color mappings and compatibility with dynamic color

*[image: M2 slider.]*
M2: Sliders have a circular handle and a small label when pressed

*[image: Original M3 slider.]*
M3: Sliders have new color mappings and support dynamic color

## Specs

### Variants

*[image: 3 variants of sliders.]*
1. Standard
2. Centered
3. Range

| Variant | M3 | M3 Expressive |
|---|---|---|
| Standard | Available as “continuous” slider | Available |
| Centered | Available (web only) | Available |
| Range | Available | Available |
| Discrete | Available | Available as “stops” configuration |

### Configurations

*[image: Orientation and size configurations of sliders.]*
1. Orientation: Horizontal, vertical
2. Size: XS, S, M, L, XL

*[image: Optional anatomy configurations of sliders.]*
1. Inset icon
2. Stops
3. Value indicator

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Inset icon | No (default) | Available | Available |
| Yes | -- | Available |  |
| Orientation | Horizontal (default) | Available | Available |
| Vertical | -- | Available |  |
| Size | XS (default) | Available | Available |
| S, M, L, XL | -- | Available on Android Views (MDC-Android).<br>Available as tokens on other platforms.* |  |
| Stop indicators | No (default), Yes | Available as “discrete” slider | Available |
| Value Indicator | No (default), Yes | Available | Available |

> *Configurations only available using tokens don’t have implemented presets in code. To change the size, swap the default size tokens `md.comp.slider.xsmall.[...]` with those of the desired size.

### Tokens & specs

Slider tokens are organized into a common token set, and token sets for each size. Switch token sets from the table’s menu. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__sliders.md` — Slider - Size - Xlarge, Slider - Size - Large, Slider - Size - Medium, Slider - Size - Small, Slider - Size - Xsmall, Slider]*

### Anatomy

*[image: 6 elements of a slider.]*
1. Value indicator (optional)
2. Stop indicators (optional)
3. Active track
4. Handle
5. Inactive track
6. Inset icon (optional)

### Color

*[image: 9 color roles of a slider.]*
Slider color roles used for light and dark schemes:

1. Inverse surface
2. Inverse on surface
3. Primary
4. On primary
5. Primary
6. Secondary container
7. On secondary container
8. On secondary container
9. On primary

### States

*[image: 5 states of sliders in light and dark schemes.]*
1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

### Measurements

*[image: Common slider padding and size measurements.]*
Padding and size measurements for common sliders

*[image: Slider padding and size measurements at each size configuration, XS to XL.]*
Padding and size measurements for XS, S, M, L, and XL sliders

| Attribute | XS | S | M | L | XL |
|---|---|---|---|---|---|
| Track height | 16dp | 24dp | 40dp | 56dp | 96dp |
| Label container height | 44dp |  |  |  |  |
| Label container width | 48dp |  |  |  |  |
| Handle height | 44dp | 44dp | 52dp | 68dp | 108dp |
| Handle width | 4dp |  |  |  |  |
| Track shape | 8dp | 8dp | 12dp | 16dp | 28dp |
| Inset icon size | -- | -- | 24dp | 24dp | 32dp |

## Guidelines

*[video: Photo editor with sliders labeled pop, sharpen, and denoise being adjusted.]*
Sliders can adjust values in real time, such as image attributes

### Usage

Sliders are used to select values along a track. They’re ideal for adjusting settings such as volume and brightness, or changing the intensity of image filters.<br><br>Sliders can use icons or labels to represent a numeric or relative scale.

*[image: Sound settings screen with continuous sliders labeled call volume and alarm volume.]*
Use sliders to pick a value from a range, like volume loudness

Changes made with sliders must take effect immediately, so people can understand the effects of their selection as they're moving the slider.

*[video: The brightness slider changes the screen’s brightness in real time.]*
Selection changes are immediate

There are three different variants of sliders: **standard**, **centered**, and **range:**<br><br>Standard sliders select one value from a range of values. Use this when the slider should start from zero or the beginning of a sequence.

*[image: Horizontal standard slider with an end stop indicator.]*
Horizontal standard slider

*[image: Vertical standard slider  with an end stop indicator.]*
Vertical standard slider

Centered sliders select a value from a positive and negative value range. Use this when zero, or the default value, is in the middle of the range.

*[image: Horizontal centered slider with a negative value and visible stop indicators at each end.]*
Horizontal centered slider

*[image: Vertical centered slider with a negative value and visible stop indicators at each end.]*
Vertical centered slider

Range sliders select two values on one slider to create a range. Use this when defining a minimum and maximum value.<br><br>Avoid using range sliders vertically, as this can add too much cognitive load. People are used to most sliders being horizontal.

*[image: Horizontal range selection slider with 2 values selected, and a stop indicator at each end.]* **✅ Do**
Horizontal range slider

*[image: Vertical range slider with 2 values selected, and a stop indicator at each end.]* **❌ Don't**
Because of the additional cognitive load of a range slider, avoid using it in vertical orientation.

### Anatomy

*[image: 6 elements of a slider.]*
1. Value indicator (optional)
2. Stop indicators (optional)
3. Active track
4. Handle
5. Inactive track
6. Inset icon (optional)

#### Track

The track shows the full range of values that can be selected on the slider. It has two sections: active and inactive.

- The **active**section of the track is from the minimum value to the handle. For range sliders, the active track is between the two handles.
- The **inactive** section of the track is from the handle to the maximum value, or outside the two handles of a range slider.

For left-to-right (LTR) languages, the values increase from left to right. For right-to-left (RTL) languages, this is reversed.

*[image: Sliders for font size and display size with stop indicators along the track.]*
The track on a slider shows the available range

#### Handle

The handle can be moved along the track to choose a value.<br><br>When sliders have two handles, the handles choose the minimum and maximum values in a range.<br><br>The handle changes shape to indicate when it’s pressed.

*[image: The handle is a vertical line on the current value of the slider. It shrinks in width when selected.]*
A handle changes shape when it's being pressed or dragged

*[image: 2 unselected handles on a slider with range selection.]*
Two handles are used for sliders with range selection

### Configurations

#### Value

The value displays the specific value that corresponds with the handle’s placement. <br><br>A value appears when interacting with the corresponding handle. For range sliders, only one value should be shown at a time.<br><br>If the value is shown elsewhere, the indicator is not required.

*[image: A value of 50 is above a slider handle in the middle of the track.]*
A value can appear while the handle is being pressed or dragged

*[image: A value of 75 is above the pressed range slider handle. The unselected slider doesn’t show the value.]*
For range sliders, the value only appears on one handle at a time

Instead of showing the built-in value label, a separate text input field can be added outside of the slider. If this is added, the slider and value in this text field should automatically update to match each other.

Make sure people can tab to the text field directly after the slider.

*[video: Navigating to an adjacent text label, changing the value to 100 using arrow keys. The slider auto-updates based on input value.]*
Use **Tab** to navigate to values that are shown outside the slider, like a text input field

#### Stop indicators

Stop indicators show which predetermined values can be chosen on the slider. The slider handle snaps to the closest stop. <br><br>Avoid having too many stop indicators on a slider, because it can become visually crowded and difficult to adjust the value.<br><br>All sliders have stops at the end of the inactive track to ensure at least a 3:1 contrast with the background. If the inactive track has this level of contrast already, the end stops can be removed.

*[image: Stop indicators are equally spaced out on a slider.]*
Stop indicators show each available value on a slider

Icons or text can be added outside the slider to indicate the range of values and make the slider more accessible. This can be used instead of a stop indicator.

*[image: Plus and minus icons on each end of the slider.]*
Plus and minus icons, or text, can be added to the left and right of the slider

#### Orientation

Sliders can be oriented either horizontally or vertically, depending on what is best for your use case.

*[image: Horizontal slider.]*
Standard slider in horizontal orientation

*[image: Vertical slider. Zero is at the bottom.]*
Standard slider in vertical orientation

#### Inset icon

Standard sliders that are M, L, or XL can include an icon within the track. This icon should illustrate what the slider controls. Avoid adding inset icons to XS or S sliders.<br><br>When there’s not enough space for the icon on the active track, like at a low value, the icon moves to the inactive track.<br><br>Consider swapping which icon is displayed at zero, like a volume icon becoming a mute icon.

*[image: Inset icon on the active track when the handle is at 50%, and on the inactive track when the handle is at 0.]* **✅ Do**
Inset icons change placement based on the handle

*[image: An inset icon on an XS slider. The icon bounds are cut off by the slider container.]* **❌ Don't**
Don’t use an inset icon with sliders that have track thicknesses under 40dp

Don’t use inset icons on centered or range sliders. It makes it unclear where the start of the slider is.

*[image: Centered slider with an inset icon on one end, and a stop indicator on the other.]* **❌ Don't**
Don’t use an inset icon on a centered slider

*[image: Range slider with an inset icon on one end, and a stop indicator on the other.]* **❌ Don't**
Don’t use an inset icon on a range slider

#### Size

Sliders come in different sizes: XS, S, M, L, and XL. Use larger sizes to increase the targets and provide a larger visual emphasis.<br><br>The active and inactive tracks should always be the same size.

*[image: 5 sizes of sliders.]*
1. XS: 16dp
2. S: 24dp
3. M: 40dp
4. L: 56dp
5. XL: 96dp

XL sliders should be reserved for hero moments, where the slider itself is the most important element on the page.

*[image: An XL slider used to adjust living room temperature on mobile. No other controls are on screen.]*
XL sliders should be the focus of the page

### Behaviors

#### Select & drag

Select a value by dragging the handle.

*[video: Slider handle moves smoothly. The value increases and decreases by single digits.]*
**Standard slider**: The handle drags smoothly

*[video: Slider handle snaps to the nearest multiple of 10 when moved.]*
**Slider with stop indicators:** The handle snaps to the closest stop indicator while dragged

#### Select jump

Select a value by selecting part of the track.

*[video: Slider handle moves smoothly to selected value of the slider.]*
**Standard****slider**: The handle moves to the selected location

*[video: Slider handle moves smoothly to the closest stop indicator value.]*
**Slider with stop indicators:** The handle moves to the closest stop indicator

#### Select & arrow

Select a value using the keyboard.<br><br>**Tab:** Focus lands on handle <br><br>**Arrows:**Selected value increases or decreases by one value or stop indicator<br><br>**Space & arrows:** Selected value increases or decreases by a larger interval or stop indicator

*[video: Tab selects the slider, and arrow keys move the value by 1.]*
**Standard****slider**: The handle moves one value

*[video: Tab selects the slider, and arrow keys move the value by 10.]*
**Slider with stop indicators:**The handle moves to the next stop indicator

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Navigate to a slider
- Select a range by controlling a handle along a track
- Get appropriate feedback based on input type

### Interaction & style

The slider handle shrinks in width and the value appears to provide a visual cue to the user that the handle is being pressed.

**Touch**

When tapped or dragged, the handle width shrinks to provide interaction feedback, and the value appears.

**Cursor**

When hovered, the cursor changes. When clicked and dragged, the handle width shrinks, and the value appears.

*[video: Dragging a slider using a mouse cursor and by touch. Handle width shrinks when dragged.]*
The slider handle changes width during interaction

#### Focus and navigation

Initial focus lands directly on the handle, since it’s the primary interactive element of the slider.

The slider value can then be adjusted using the arrow keys or other keyboard navigation options.

*[video: Using keyboard navigation on a slider. Tab to the handle, and use arrow keys to change the value.]*
Use arrow keys to change the slider value

### Color contrast

Use visual anchors so the end of the slider’s inactive track has at least 3:1 contrast with the background. The stop indicator makes the end easily visible on most backgrounds.

*[image: The inactive track has contrast below 3:1 with the background. The stop indicator is above 3:1. Slider is accessible.]*
A stop indicator on the inactive track makes it easier to identify the end of the slider on a low-contrast background

Alternatively, icons or other elements that have a 3:1 contrast with the background can be used to indicate the ends of the slider’s inactive track.

*[image: The inactive track has contrast ratio below 3:1 with the background. The icon is above 3:1. The slider is accessible.]*
Icons make it easier to identify the ends of the slider on a low-contrast background

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab | Moves focus to the slider handle |
| Arrows | Increase and decrease the value by one value or one stop indicator |
| Space & Arrows | Increase and decrease the value by one interval or one stop indicator |
| Home or End | Set the slider to the first and last values on the slider |

### Labeling elements

The accessibility label for a slider is typically the same as the slider's adjacent text label. It should have the **slider** role.

*[image: Annotated aria tags of a slider.]*
A slider’s accessibility label should match the adjacent UI text

If the UI text is correctly linked to the slider, assistive tech (such as a screenreader) will read the UI text followed by the component’s role.

*[image: Annotated aria tags of a slider with stepper icons.]*
Icon buttons placed outside the slider should have the button role
