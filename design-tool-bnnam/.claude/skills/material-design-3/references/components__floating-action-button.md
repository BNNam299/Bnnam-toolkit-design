<!-- Source: https://m3.material.io/components/floating-action-button · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__floating-action-button.md @ 3c0e291 -->

# FABs

## Overview

- Use a FAB for the most common or important action on a screen
- Make sure the icon in a FAB is clear and understandable
- FABs persist on the screen when content is scrolling
- Three variants: FAB, medium FAB, large FAB

*[image: The 3 sizes of floating action buttons.]*
1. FAB
2. Medium FAB
3. Large FAB

### Availability & resources

### M3 Expressive update

**May 2025**

The FAB has new sizes to match the extended FAB and more color options. The small FAB is no longer recommended. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Added **medium** FAB size
- **Small** FAB size is no longer recommended
- FAB and large FAB sizes are unchanged
- FAB variants are based on size, not color

Color:

- Added tone color styles:
  - Primary
  - Secondary
  - Tertiary

- Renamed existing tonal color styles to match their token names:
  - **Primary** to **Primary container**
  - **Secondary** to **Secondary container**
  - **Tertiary** to **Tertiary container**
  - The values haven't changed

- Surface color FABs are no longer recommended

*[image: 4 FABs showing the colors available after the expressive update.]*
FABs have updated colors and sizes

### Differences from M2

*[image: M2 circular FAB with a plus icon.]*
M2: FABs are circles and always have a drop shadow

*[image: M3 rounded corner square FAB with an artist’s palette icon.]*
M3: FABs have a boxier shape, can use dynamic color, and include a new large FAB variation

## Specs

### Variants

*[image: An icon on the container of a FAB, medium FAB, and large FAB.]*
1. FAB
2. Medium FAB
3. Large FAB

#### Baseline variants

The small FAB is still available, but no longer recommended. [Jump to baseline specs](https://m3.material.io/components/floating-action-button)

*[image: An icon on the container of a small FAB.]*
1. Small FAB

| Variant | M3 | M3 Expressive |
|---|---|---|
| FAB | Available | Available |
| Medium FAB | -- | Available |
| Large FAB | Available | Available |
| Small FAB | Available | Not recommended.Use a larger size. |

### Configurations

In the expressive update, the **primary**, **secondary**, and **tertiary** set colors were renamed to **primary container**, **secondary container**, and **tertiary container**to match the actual color roles used. New primary, secondary, and tertiary color styles were created to match the corresponding color roles. [View details in the color styles section](https://m3.material.io/components/floating-action-button)

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Color | Primary container, secondary container, tertiary container | Available as primary, secondary, tertiary | Available |
| Primary. secondary, tertiary | -- | Available |  |

### Tokens & specs

Use the table's menu to select a token set. FAB tokens are organized by size and color. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__floating-action-button.md` — FAB - Size - Large, FAB - Size - Medium, FAB - Size - Small, FAB - Color - Tonal primary, FAB - Color - Tonal secondary, FAB - Color - Tonal tertiary, FAB - Size - Regular, [Deprecated] FAB - Primary, large, [Deprecated] FAB - Tertiary, small, [Deprecated] FAB - Secondary, large, FAB - Color - Tertiary, FAB - Color - Primary, FAB - Color - Surface, [Deprecated] FAB - Surface, large, [Deprecated] FAB - Secondary, small, [Deprecated] FAB - Tertiary, large, FAB - Color - Secondary, [Deprecated] FAB - Surface, small, [Deprecated] FAB - Primary, small, FAB - Color - Branded, [Deprecated] FAB - Branded, large]*

### Anatomy

*[image: 2 elements of the FAB.]*
1. Container

2. Icon

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

#### Color styles

FABs can use several combinations of **color** and **on-color** styles, such as **primary** and **on-primary**. The following color mappings provide the same legibility and functionality, so the color mapping you use depends on style alone.

*[image: 6 FAB color styles in light and dark themes. Each style has 2 color roles, 1 for the container and icon.]*
1. Primary container & On primary container (default)
2. Secondary container & On secondary container
3. Tertiary container & On tertiary container
4. Primary & On primary
5. Secondary & On secondary
6. Tertiary & On tertiary

#### Baseline color styles

Surface FAB color styles are still available, but no longer recommended.

*[image: Baseline FAB style in all 3 sizes.]*
1. Surface FABs

### States

States are visual representations used to communicate the status of a component or interactive element.<br><br>When using a non-default color mapping for FABs, make sure the state layer color is the same as the icon color. For example, the state layer color for the **primary** color style should be `md.sys.color.primary`.

*[image: 4 states of a FAB shown in light and dark themes.]*
1. Enabled
2. Hovered (8% state layer) - elevation 4
3. Focused (10% state layer)
4. Pressed (10% state layer)

### Measurements

#### FAB

*[image: FAB size measurements.]*
FAB size measurements

*[image: FAB padding measurements.]*
FAB padding measurements

#### Medium FAB

*[image: Medium FAB size measurements.]*
Medium FAB size measurements

*[image: Medium FAB padding measurements.]*
Medium FAB padding measurements

#### Large FAB

*[image: Large FAB size measurements.]*
Large FAB size measurements

*[image: Large FAB padding measurements.]*
Large FAB padding measurements

### Baseline tokens & specs

Use the table's menu to select a token set. This only includes tokens for small and surface FABs, which are both no longer recommended. It doesn't include other colors, or large or regular FABs, since those are still currently used.

*[Token table (measurements, color, shape): `tokens__components__floating-action-button.md` — FAB - Size - Large, FAB - Size - Medium, FAB - Size - Small, FAB - Color - Tonal primary, FAB - Color - Tonal secondary, FAB - Color - Tonal tertiary, FAB - Size - Regular, [Deprecated] FAB - Primary, large, [Deprecated] FAB - Tertiary, small, [Deprecated] FAB - Secondary, large, FAB - Color - Tertiary, FAB - Color - Primary, FAB - Color - Surface, [Deprecated] FAB - Surface, large, [Deprecated] FAB - Secondary, small, [Deprecated] FAB - Tertiary, large, FAB - Color - Secondary, [Deprecated] FAB - Surface, small, [Deprecated] FAB - Primary, small, FAB - Color - Branded, [Deprecated] FAB - Branded, large]*

## Guidelines

*[image: 3 screens with various FAB sizes.]*
FABs have multiple sizes that scale with the breakpoint

### Usage

Use a FAB for the most important action on a screen; it appears in front of all other content.<br><br>The FAB can be aligned left, center, or right. It can be positioned above the navigation bar, or nested within it.

*[image: A Compose FAB is positioned above a nav bar on a mobile email inbox.]*
FABs can use dynamic color

There are three FAB sizes:

1. FAB
2. Medium FAB (most recommended)
3. Large FAB

Choose the FAB size based on the visual hierarchy of your layout. <br><br>Note: The small FAB is no longer recommended.

*[image: 3 FAB sizes.]*
1. FAB
2. Medium FAB
3. Large FAB

The FAB is the smallest size, and is best used in compact windows where other actions may be present on screen.<br><br>The medium FAB is recommended for most situations, and works best in compact and medium windows. Use it for important actions without taking up too much space. <br><br>A large FAB is useful in any window size when the layout calls for a clear and prominent primary action, but is best suited for expanded and larger breakpoints, where its size helps draw attention.

*[image: A medium FAB over an email app UI.]*
Use a medium FAB in most breakpoints

*[image: A large FAB over an email app UI.]*
Use a large FAB when the primary action needs to be prominent

*[image: A photo feed with no FAB.]* **✅ Do**
FABs are not needed on every screen, such as when images represent primary actions

*[image: A screen with 3 FABs makes it hard to tell what the primary action should be.]* **❌ Don't**
Don't display multiple FABs on a single screen

A FAB can transform into an extended FAB on larger screens, or it can transition into a FAB menu when selected. Use a FAB menu when there are many kinds of actions relevant to the FAB.

[More on FAB menus](https://m3.material.io/components/fab-menu)

*[image: A extended FAB saying “Share” with a less popular share icon.]*
Use the extended FAB when label text is necessary

*[image: A FAB menu showing 3 actions related to sharing.]*
Use the FAB menu when there are many kinds of actions relevant to the FAB

### Actions

A FAB can trigger an action on the current screen, or it can perform an action that creates a new screen.<br><br>A FAB promotes an important, constructive action such as:

- Create
- Favorite
- Share
- Start a process

*[image: FABS for 12 common actions including, create, edit, and navigate.]* **✅ Do**
Use FABs for primary, positive actions

Avoid using a FAB for minor or destructive actions, such as:

- Archive or trash
- Alerts or errors
- Limited tasks like cutting text
- Controls better suited to a toolbar, like to adjust volume or font color

*[image: FABs for 18 minor or destructive actions, such as cut, trash, and volume.]* **❌ Don't**
Don’t use FABs for minor, overflow, unclear, or destructive actions

### Anatomy

*[image: 2 elements of a FAB.]*
1. Container
2. Icon

#### Container

The FAB is typically displayed in a square container. The container shouldn’t be covered by other elements, such as badges.<br><br>The container must have sufficient color contrast with the surface it’s placed on.

*[image: A bright colored FAB has high contrast with the background.]*
A FAB container color needs to stand out from its background

#### Icon

An icon in a FAB should be clear and understandable. When hovering over a FAB on web products, FABs should display a tooltip with an accompanying icon text label. Use a filled icon instead of an outlined icon.<br><br>A FAB shouldn't contain notifications or actions found elsewhere on a screen.

*[image: 4 FABs each with a simple icon.]* **✅ Do**
Use clear and simple icons such as add, message, or edit

*[image: 4 FABs each with an ambiguous icon.]* **❌ Don't**
Don’t use confusing or open-ended icons to symbolize less common actions

### Adaptive design

In compact and medium breakpoints, the best place for the FAB is typically the lower right corner of a screen, since it’s easy to reach and is less likely to cover important content.<br><br>In expanded breakpoints, consider placing the FAB in the upper left corner, like in the navigation rail. This positions it as one of the first interactive elements people see when they land on the page.<br><br>Adjust the size of the FAB based on the context. Use a medium FAB for mobile layouts, and large FAB for tablets and large screens.

*[image: Large screen layout showing FAB in upper left region of the screen, below navigation rail icon.]*
For large screens, place the FAB in the upper left corner

*[image: A screen layout with several interactive elements. A single FAB is in the navigation rail.]* **✅ Do**
A FAB can be used within a navigation component, such as a navigation rail

*[image: A busy screen layout with 8 cards, each with their own FAB.]* **❌ Don't**
Individual components, such as cards, shouldn’t have their own FAB

### Behaviors

#### Appearing

When a FAB animates on screen, it expands outward from a central point. The icon within it can be animated as well.<br><br>While FABs should be relevant to screen content, they aren't attached to the surface on which content appears. FABs move separately from other UI elements because of their relative importance.<br><br>**Screen transitions <br>**FABs can morph to launch related actions. When a screen changes its layout, the FAB should disappear and reappear during the transition.<br><br>**Reappearance <br>**The FAB should only reappear if it's relevant to the new screen. It should reappear in the same position, if possible.

*[video: FAB appearing from the bottom of the screen, moving to a position above the  navigation bar.]*
FAB animating on screen

#### Expanding

The FAB can expand and adapt to any shape using a container transform transition pattern. This includes a surface that's part of the app structure, or a surface that spans the entire screen.<br><br>The FAB can also transition into a FAB menu. <br><br>[More on FAB menus](https://m3.material.io/components/fab-menu)

*[video: Compose FAB expands to container size, opening a draft email screen.]*
FABs can expand and adapt to any shape

#### Scrolling

FABs remain in place on scroll.<br><br>Extended FABs can collapse into a FAB on scroll and expand on reaching the bottom of the view.

*[video: Extended FAB collapsed into a FAB when scrolling on the page.]*
FABs stay in place above a scrolling background

#### Moving across tabs

When tabs are present, the FAB should briefly disappear, then reappear when the new content moves into place. This shows that the FAB is not connected to any particular tab.

*[video: FAB blinks away and reappears with new screen content.]* **✅ Do**
The FAB should disappear and reappear when switching pages

Don't animate the FAB with body content.

*[video: FAB moves horizontally when scrolling between tabs.]* **❌ Don't**
Don’t keep the FAB on screen when switching pages

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Navigate to and activate the FAB
- Perform an action with the FAB
- Expand and minimize an extended FAB

### Interaction & style

Don't disable the FAB. If the action represented in the FAB is unavailable, the FAB shouldn't appear.

Ensure the icon has a minimum 3:1 contrast ratio with the container.

*[image: FAB with highly contrasting bright container and dark icon.]* **✅ Do**
FAB icons are above the 3:1 contrast ratio

*[image: FAB with low-contrasting dark container and dark icon.]* **❌ Don't**
Avoid using colors with a contrast below 3:1

### Focus

Ensure the FAB is prioritized in the overall focus order to create an efficient experience for people who navigate UIs with assistive tech. <br><br>On mobile, the focus order may start with the app bar, move to the navigation bar, and then skip past any other content on the page to land on the FAB.<br><br>Consider displaying a tooltip when the FAB is focused. This is supported on web.

*[image: A focused FAB with a tooltip saying “Compose” appearing below it.]*
Tooltips surface the FAB’s label when focused

### Layout & position

To make it easier for users of screen readers to reach a primary action such as a FAB on expanded breakpoints, consider placing the FAB in the upper left region. <br><br>However, it’s critical to test placement options with users to see if the upper left region is the best position in all browser windows. For compact and medium breakpoints, the best place for the FAB is the lower right corner of a screen.

*[image: FAB in the lower right region of a small screen.]*
In compact windows, place the FAB in the bottom trailing edge

*[image: FAB in the upper left region of a large screen.]*
In expanded windows, place the FAB in the navigation rail

To ensure accessibility for keyboard users on the web, avoid positioning the FAB in a way that completely obscures the focus indicator of an actionable element. <br><br>It’s okay to partially cover the desired element, as long as the focus indicators are still visible.

*[image: FAB in the lower right region doesn’t obscure the focus indicator of an actionable icon.]* **✅ Do**
The FAB can partially cover an actionable element, as long as the focus indicator is still clearly visible

*[image: FAB in the lower right region obscures an actionable icon and its focus indicator.]* **❌ Don't**
Don’t completely obscure an actionable element and its focus indicator

### Keyboard navigation

| **Keys** | **Actions** |
|---|---|
| **Tab** | Focus lands on the FAB |
| **Space** or **Enter** | Perform the default action on an item |

### Labeling elements

The accessibility label should describe the action that the button is performing, such as **Compose a new message**.

*[image: Accessibility label and accessibility role of a FAB.]*
The accessibility label of the FAB with a pencil icon describes the action of composing a new message
