<!-- Source: https://m3.material.io/components/extended-fab · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__extended-fab.md @ 3c0e291 -->

# Extended FABs

## Overview

- Use for the most common or important action on a screen
- Three variants: small, medium, and large
- Use instead of FAB when label text is needed to understand action

*[image: 3 extended fab sizes.]*
1. Small extended FAB
2. Medium extended FAB
3. Large extended FAB

### Availability & resources

### M3 Expressive update

**May 2025**

The extended FAB now has three sizes: small, medium, and large, each with updated type styles. These align with the FAB sizes for an easier transition between FABs. The baseline extended FAB is no longer recommended and should be replaced with the small extended FAB. Surface and FABs are also no longer recommended. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Added new sizes
  - Small: 56dp
  - Medium: 80dp
  - Large: 96dp

- No longer recommended
  - Baseline extended FAB (56dp)
  - Surface extended FAB

Updates:

- Adjusted typography to be larger

*[image: The baseline extended FAB and the small, medium, and large extended FABs from the expressive update.]*
The baseline extended FAB is replaced with a set of small, medium, and large extended FABs with new typography

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- Layout: Extended FAB is the same height as the FAB
- Shape: Boxier style with smaller corner radius

*[image: Diagram comparing the M2 FAB and extended FAB.]*
M2: Extended FABs are pill-shaped and have a different height and elevation

*[image: Diagram comparing the M3 FAB and extended FAB.]*
M3: Extended FABs share the same height, boxier shape, and simpler elevation model as FABs

## Specs

### Variants

*[image: 3 variants of extended FABs.]*
1. Small extended FAB
2. Medium extended FAB
3. Large extended FAB

#### Baseline variants

The baseline extended FAB is no longer recommended in the M3 expressive update. Use a small extended FAB; the type style was updated from **label large** to **title medium**, and the inner padding was reduced. [View baseline extended FAB specs](https://m3.material.io/components/extended-fab)

*[image: 1 baseline extended FAB.]*
1. Extended FAB

| Variant | M3 | M3 Expressive |
|---|---|---|
| Small extended FAB | -- | Available |
| Medium extended FAB | -- | Available |
| Large extended FAB | -- | Available |
| Extended FAB (baseline) | Available | Not recommended.<br>Use **small extended FAB.** |

### Tokens & specs

Use the table's menu to select a token set. Extended FAB tokens are organized by size and color.

*[Token table (measurements, color, shape): `tokens__components__extended-fab.md` — Extended FAB - Color - Tonal primary, Extended FAB - Color - Tonal secondary, Extended FAB - Color - Tonal tertiary, Extended FAB - Size - Large, Extended FAB - Size - Medium, Extended FAB - Size - Small, Extended FAB - Size - Baseline, Extended FAB - Color - Primary, Extended FAB - Color - Surface, Extended FAB - Color - Secondary, Extended FAB - Color - Tertiary, Extended FAB - Color - Branded]*

### Anatomy

*[image: 3 elements of extended FABs.]*
1. Container
2. Label text
3. Icon

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

#### Color styles

Extended FABs can use several combinations of **color** and **on color** styles, such as **primary** and **on primary**. The following color mappings provide the same level of contrast and functionality, so choose a color mapping based on visual preference.

*[image: 6 extended FAB color styles.]*
Extended FAB color roles used for light and dark schemes:

1. Primary container & on primary container (default)
2. Secondary container & on secondary container
3. Tertiary container & on tertiary container
4. Primary & on primary
5. Secondary & on secondary
6. Tertiary & on tertiary

#### Baseline color styles

Extended FABs should no longer use surface color styles. They’re still available, but not recommended.

*[image: 1 baseline extended FAB color style.]*
1. Surface container FAB

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

When using a non-default color mapping for extended FABs, make sure the state layer color is the same as the icon color. For example, the state layer color for primary mapping should be md.sys.color.primary.

*[image: 4 states of extended FABs.]*
1. Enabled
2. Hovered - elevation 4
3. Focused
4. Pressed

### Measurements

*[image: Extended FAB padding and size measurements.]*
Size and padding measurements of the small, medium, and large extended FABs

*[image: Extended FAB margin measurements.]*
Extended FABs should have margins of 16dp

### Baseline extended FAB

*[image: 3 elements of baseline extended FAB.]*
1. Container
2. Label text
3. Icon

#### Baseline configurations

*[image: Baseline extended FAB with icon.]*
With icon

*[image: Baseline extended FAB without icon.]*
Without icon

#### Baseline tokens

Use the table's menu to select a token set. The baseline extended FAB token sets are organized by common tokens, then by surface and branded color styles. Other color styles like primary, secondary, and tertiary are still used by the latest extended FABs.

*[Token table (measurements, color, shape): `tokens__components__extended-fab.md` — Extended FAB - Color - Tonal primary, Extended FAB - Color - Tonal secondary, Extended FAB - Color - Tonal tertiary, Extended FAB - Size - Large, Extended FAB - Size - Medium, Extended FAB - Size - Small, Extended FAB - Size - Baseline, Extended FAB - Color - Primary, Extended FAB - Color - Surface, Extended FAB - Color - Secondary, Extended FAB - Color - Tertiary, Extended FAB - Color - Branded]*

#### Baseline colors

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 3 baseline extended FAB color roles.]*
Extended FAB color roles used for light and dark schemes:

1. Primary container + shadow
2. On primary container
3. On primary container

##### Additional color mappings

Extended FABs can use other combinations of container and icon colors. The color mappings below provide the same legibility and functionality as the default, so the color mapping you use depends on style alone.

*[image: 3 deprecated extended FABs with different container and icon colors.]*
Extended FABs can use different combinations of container and icon colors

#### Baseline states

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states)

*[image: 4 states of baseline extended FAB.]*
1. Enabled
2. Hovered
3. Focused
4. Pressed

#### Baseline measurements

*[image: Margins of baseline extended FAB.]*
Extended FABs have a padding of 16dp

*[image: Size of baseline extended FAB while on screen.]*
Extended FAB height, width, and icon size

| Attribute | Value |
|---|---|
| Container height | 56dp |
| Container width | Dynamic, 80dp min |
| Container shape | 16dp corner radius |
| Icon size | 24dp |
| Padding | 16dp |

## Guidelines

*[image: Vibrant extended FAB on an email screen.]*
Extended FABs are more prominent than regular FABs

### Usage

Use an extended FAB on screens with long, scrolling views that require persistent access to an action, such as a checkout screen.

Use it when label text helps understand the main action, or to add further emphasis to the button.

*[image: A centered extended FAB is used to check out in a shopping app.]*
Extended FABs ensure the main action is visible at all times

*[image: Extended FAB on an article with lots of body content to publish that article.]*
Use an extended FAB to provide constant access to a primary action above long-scrolling surface content

*[image: Extended FAB on a task list to create a new task.]*
Use an extended FAB to emphasize a page’s primary action

#### Additional emphasis

The extended FAB can provide more emphasis and clarity to a product’s primary action.

Since it has room for both a text label and icon, the extended FAB can be effective where an icon alone is ambiguous. However, the relationship between an extended FAB's icon and label should be clear.

*[image: Extended FAB labeled “find flights” with an airplane icon, which would be unclear on its own.]*
An extended FAB can be effective where an icon alone is too vague

Like the regular FAB, only one extended FAB should be used per screen.

Multiple FABs compete for attention.

If additional high-level actions are required, consider adding more buttons elsewhere on the page.

*[image: An extended FAB used on a screen.]* **✅ Do**
Only show one prominent action at a time with the extended FAB

*[image: 2 extended FABs used on 1 screen.]* **❌ Don't**
Don’t use multiple extended FABs in one screen as it disrupts visual hierarchy

The extended FAB shouldn't be used as an option in a set of actions.

Instead, use filled buttons for a similar level of emphasis.

*[image: Filled button labeled “finish setup” next to a “back” button.]* **✅ Do**
Use a button with appropriate styling to emphasize it in a group of buttons

*[image: Extended FAB labeled “finish setup” next to a “back” button.]* **❌ Don't**
Don’t use the extended FAB to convey an option in a set of actions

#### Choosing a size

There are three variants of extended FABs: small, medium, and large.

Choose an appropriately-sized extended FAB to add the right amount of emphasis for an action.

In compact windows with one prominent action, the large extended FAB can be appropriate.

In larger breakpoints, use a medium or large extended FAB.

*[image: 1 large, 1 medium, and 1 small extended FAB on 3 different screen sizes.]*
There are three sizes of extended FABs

### Anatomy

*[image: 3 extended FAB elements.]*
1. Container
2. Label text
3. Icon (optional)

#### Container

The extended FAB container is a rounded rectangle that hugs its contents.

The extended FAB grows and shrinks with text length.

*[image: Fixed-width extended FAB, centered, ignoring layout grid.]*
The extended FAB container hugs the icon and text

#### Icon (optional)

An extended FAB's icon should intuitively represent its action.

*[image: Extended FAB without an icon, labeled “Save draft”.]* **✅ Do**
Unlike standard FABs, extended FABs don't require an icon

*[image: Extended FAB with icon only, with no label text.]* **❌ Don't**
An extended FAB can't have an icon without a text label

#### Label text

The extended FAB’s label should clearly describe its action.

Use 1–2 words at most. Keep in mind that localization may increase the amount of characters and width of the extended FAB.

*[image: Extended FAB with short text “Save”.]* **✅ Do**
Shorten the text as much as needed. Include an icon for additional context.

*[image: Extended FAB with wrapping text “Save draft in folder”.]* **❌ Don't**
Avoid wrapping or truncating text

### Placement

*[image: Extended FAB placed above navigation bar.]* **✅ Do**
Place the extended FAB above the rest of the UI, off of elements like app bars

*[image: Extended FAB overlaid on a docked toolbar.]* **❌ Don't**
Don’t place the extended FAB on top of toolbars. It disrupts the consistency of the elevation and surface layers.

*[image: Extended FAB below an app bar at the top of a mobile screen.]* **❌ Don't**
Don’t place the extended FAB in the upper half of a mobile screen, as it disrupts the reading of the UI

*[image: An extended FAB labeled "Confirm" on a dialog to "Confirm your location".]* **❌ Don't**
Don’t place extended FABs on cards or inside other containers

Avoid putting other floating components, like the floating toolbar, on screen with the extended FAB.

*[image: The extended FAB is next to a floating toolbar.]* **❌ Don't**
Floating toolbars can be paired with FABs, but not extended FABs

### Responsive layout

The FAB and extended FAB can transform into each other depending on available space and layout.

In a collapsed navigation rail, a FAB would be used. When the rail is expanded, the FAB can transform into an extended FAB.

*[image: Example of extended FAB transforming into standard FAB.]*
When space is limited, an extended FAB can transform into a FAB

#### Right-to-left languages

Extended FABs should mirror their elements in right-to-left (RTL) languages.

*[image: Extended FAB in a left-to-right language placed at the bottom right of a screen. The icon is to the left of the text.]*
Icons should be placed to the left of labels for left-to-right (LTR) languages

*[image: Extended FAB in a right-to-left language placed at the bottom left of a screen. The icon is to the right of the text.]*
Icons should be placed to the right of labels for RTL languages

#### Breakpoints

In compact and medium breakpoints, the extended FAB should be placed at the bottom of the screen, either center-aligned or aligned to the trailing edge of the window.

*[image: Extended FAB center-aligned on a mobile screen.]*
The extended FAB can be center-aligned

*[image: Extended FAB right-aligned on a mobile screen.]*
The extended FAB can be aligned to the trailing edge of the window

In expanded and larger breakpoints, the extended FAB should appear either:

- At the bottom right edge of the window, in both LTR and RTL languages
- Within the navigation rail

*[image: Extended FAB at bottom right of screen.]*
The extended FAB can be right-aligned in both LTR and RTL languages

*[image: Extended FAB in navigation drawer.]*
The extended FAB can be at the top of the expanded navigation rail

### Behavior

#### Appearing

The extended FAB surface expands when appearing on screen using an [enter and exit](https://m3.material.io/styles/motion/transitions) transition pattern.

*[video: Extended FAB appearing on screen.]*
An extended FAB expands when appearing on screen

#### Expanding

The extended FAB can expand and adapt to any shape using a [container transform](https://m3.material.io/styles/motion/transitions) transition pattern.

This includes a surface that is part of the app structure, or a surface that spans the entire screen.

*[video: Extended FAB adapting to various shapes.]*
An extended FAB can expand and adapt to any shape

#### Transforming

The extended FAB can transform into a FAB on scroll to temporarily take up less space on screen.

*[video: Extended FAB transforming into a FAB when the page is scrolled.]*
An extended FAB can transform into a FAB

#### Scrolling

The extended FAB can transform into a FAB when scrolling down, and back to an extended FAB when scrolling up.

*[video: Extended FAB transforming while scrolling.]*
An extended FAB collapses and expands when scrolling

When the FAB switches to an extended FAB, the following transitions occur:

- The FAB shape changes
- FAB icon moves to the left
- FAB text label fades in

*[video: FAB transforming into extended FAB.]*
FAB switches to an extended FAB

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Navigate to and activate the extended FAB

### Interaction & style

To make it easier for users of screen readers to reach a primary action such as an extended FAB, consider placing the action in the upper left region of large web screens, like in an expanded navigation rail.

In smaller windows, the best place for the extended FAB is the lower right corner of a screen.

*[image: On a large screen, the Compose FAB is placed on the upper left region in an email app with the expanded window on the right.]*
Extended FABs can be placed in the expanded navigation rail

*[image: In a compact window, the Compose FAB is placed on the lower right region in an email app.]* **✅ Do**
Place extended FABs in an easy-to-reach place that doesn’t obstruct other actions

*[image: In a compact window, the Compose FAB is overlapping other buttons in an email app.]* **❌ Don't**
Don’t place extended FABs over another actionable element

### Initial focus

Ensure the extended FAB is prioritized in the overall focus order to create an efficient experience for people who navigate UIs with assistive tech.

On mobile, the focus order may start with the app bar, move to the navigation bar, and then skip past any other content on the page to land on the extended FAB.

When using an extended FAB, both the visible label and icon should be treated as one focusable element. The extended FAB doesn’t need a tooltip because it already has a visible label.

*[image: A focused extended FAB in the lower right region of a mobile screen.]* **✅ Do**
Ensure extended FABs get focus when navigating with assistive technology

*[image: A focused extended FAB with a tooltip matching the text label.]* **❌ Don't**
Tooltips aren’t required since the extended FAB has label text

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab** | Moves focus to the extended FAB |
| **Space**or **Enter** | Activates the extended FAB |

### Labeling elements

To ensure the action is clear, use consistent icons and text labels, such as a **Compos****e**icon with a **Compose** text label.

The icon and text label combination should have one distinct purpose.

The accessibility label must include the same first word as the visible label. For example, if the visible button is **Create**, then the accessibility label might say **Create a new invite**.

*[image: Accessibility labels of an extended FAB.]*
The accessibility label reads **Compose**to match the extended FAB's displayed label
