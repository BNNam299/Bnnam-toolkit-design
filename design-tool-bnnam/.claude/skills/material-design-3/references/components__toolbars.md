<!-- Source: https://m3.material.io/components/toolbars · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__toolbars.md @ 3c0e291 -->

# Toolbars

## Overview

- Two expressive variants: **docked toolbar** and **floating toolbar**
- Use the vibrant color style for greater emphasis
- Can display a wide variety of control types, like buttons, icon buttons, and text fields
- Can be paired with FABs to emphasize certain actions
- Don’t show at the same time as a navigation bar

*[image: 2 variants of toolbars.]*
Configurations of floating toolbars

### Availability & resources

### M3 Expressive update

The **bottom app bar** is no longer recommended and should be replaced with the **docked toolbar**, which functions similarly, but is shorter and has more flexibility. The **floating toolbar** was created for more versatility, greater amounts of actions, and more variety in where it's placed. [More on GM3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Added **docked toolbar**to replace **bottom app bar**
  - Size: Shorter height
  - Color: Standard or vibrant
  - Flexibility: More layout and element options

- Added **floating toolbar** with the following configurations:
  - Layout: Horizontal or vertical
  - Color: Standard or vibrant
  - Flexibility: Can hold many elements and components. Can be paired with FAB.

- **Bottom app bar**is still available, but not recommended

*[image: 2 examples of toolbar variants.]*
1. Floating, vibrant color scheme and paired with FAB
2. Docked with embedded primary action instead of FAB

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- Elevation: No shadow
- Layout: Container height is taller and the FAB is now contained within the app bar container

*[image: M2 bottom app bar.]*
M2: Bottom app bar had higher elevation of 8dp and didn't contain the FAB

*[image: M3 bottom app bar.]*
M3: Bottom app bar has new colors, a taller container, no elevation or shadow, and contains the FAB

## Specs

### Variants

*[image: 2 variants of toolbars.]*
1. Docked toolbar
2. Floating toolbar

#### Baseline variant

The baseline bottom app bar is no longer recommended. It should be replaced with the docked toolbar, which is very similar and more flexible.

*[image: Baseline bottom app bar, which looks like the docked toolbar, but is not recommended.]*
1. Bottom app bar (not recommended)

| Variant | M3 | M3 Expressive |
|---|---|---|
| Docked toolbar | -- | Available |
| Floating toolbar | -- | Available |
| Bottom app bar | Available | Not recommended. Use **docked toolbar**. |

> **Note:** Implementation differs per platform. On Jetpack Compose, the floating toolbar is a separate component from the docked toolbar and bottom app bar.

### Configurations

*[image: Color configuration of toolbars.]*
1. Standard and vibrant toolbars
2. Vertical floating toolbar
3. Floating toolbar with FAB

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Color | Standard (default) | Available as bottom app bar | Available |
| Vibrant | -- | Available |  |
| Floating toolbar layout | Horizontal (default) | -- | Available |
| Vertical | -- | Available |  |
| Other elements | With FAB | Available as bottom app bar | Available* |

> **Note:** *Implementation differs per platform. On Jetpack Compose, floating toolbar with FAB is [fully supported](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#HorizontalFloatingToolbar(kotlin.Boolean,androidx.compose.ui.Modifier,androidx.compose.material3.FloatingToolbarColors,androidx.compose.foundation.layout.PaddingValues,androidx.compose.material3.FloatingToolbarScrollBehavior,androidx.compose.ui.graphics.Shape,kotlin.Function1,kotlin.Function1,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp,kotlin.Function1)). On other platforms, each component needs to be added separately.

### Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Jump to baseline bottom app bar specs](https://m3.material.io/components/toolbars)

*[Token table (measurements, color, shape): `tokens__components__toolbars.md` — Toolbar - Color - Vibrant, Toolbar - Floating - FAB, Toolbar - Color - Standard, Toolbar - Floating, Toolbar - Docked, Bottom app bar (baseline)]*

### Anatomy

*[image: 2 elements of a toolbar.]*
1. Container
2. Placed components

#### Flexibility & slots

When configuring a toolbar, think of it as a container with several slots.

Each slot can be a different element. The most common elements are icon buttons, buttons, and text fields.

*[image: A toolbar with 5 slots, conceptual spaces for UI elements, next to each other.]*
A toolbar is essentially a container with configurable slots

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

#### Standard

*[image: 4 color roles in the standard color scheme  of the floating toolbar in light and dark scheme.]*
Standard color schemes and icon button types:

1. Surface container
2. Filled button (Primary, On primary)
3. Toggle tonal button (Secondary container, On secondary container)
4. Standard button (Primary)

#### Vibrant

*[image: 4 color roles in the vibrant color scheme of the floating toolbar in light and dark scheme.]*
Vibrant color scheme and icon button types:

1. Primary container
2. Filled button (Primary, On primary)
3. Toggle tonal button: (Surface container, On surface)
4. Standard button (On primary container)

### Measurements

By default all toolbars are 64dp high, center-aligned, have equal padding between items, and have a minimum outside padding of 16dp.

#### Docked toolbar

*[image: Default internal padding of a docked toolbar.]*
1. Default margins and padding
2. Margins and padding with leading, middle, and trailing content

*[image: 2 docked toolbars with different margins and alignment.]*
Alignment and padding can be configured to create unique layouts:

1. Left and right alignment
2. Center-aligned, 8dp padding between items

#### Floating toolbar

*[image: Diagram noting margin around edge of floating toolbar.]*
Default padding of floating toolbar

*[image: Diagram noting layout measurements.]*
Floating toolbar size and padding measurements

*[image: Diagram noting layout margins.]*
Floating toolbar margins

---

### Bottom app bar (baseline)

*[image: Diagram of bottom app bar indicating the container.]*
1. Container

#### Tokens & specs

Bottom app bar tokens are in one token set.

*[Token table (measurements, color, shape): `tokens__components__toolbars.md` — Toolbar - Color - Vibrant, Toolbar - Floating - FAB, Toolbar - Color - Standard, Toolbar - Floating, Toolbar - Docked, Bottom app bar (baseline)]*

#### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Diagram of bottom app bar indicating its color mappings.]*
Bottom app bar color role used for light and dark themes:

1. Surface container

#### Measurements

*[image: Diagram showing layout values and paddings for bottom app bar.]*
Bottom app bar padding and size measurements

#### Common layouts

*[image: Side by side view of bottom app bars in different configurations.]*
1. Icon buttons and FAB
2. Icon buttons and no FAB

## Guidelines

*[image: 5 toolbars of various colors, elements, and actions.]*
Toolbars can be used for a wide variety of use cases

### Usage

Use a toolbar to provide actions related to the current page.

Toolbars can contain many actions and can scale to show more actions in larger windows.

*[image: Vibrant toolbar at bottom of mobile screen.]*
A toolbar provides actions related to the current page

There are two variants of toolbars:

- **Docked toolbar**  Spans the full width of the window. It’s best used for global actions that remain the same across multiple pages.

- **Floating toolbar**  Floats above the body content. It’s best used for contextual actions relevant to the body content or the specific page.

The baseline **bottom app bar**is no longer recommended, but is still supported.

*[image: Docked toolbar example.]*
Docked toolbar shows global controls

*[image: Floating toolbar example.]*
Floating toolbar show controls relevant to the current page

When actions don’t fit in a toolbar, add a menu.

*[image: Toolbar showing local navigation.]*
Toolbar actions can open a menu

There are two color configurations:

- **Standard**  A low-emphasis color scheme best used for focusing attention on the body content.

- **Vibrant**  A high-emphasis color scheme that draws attention to the controls. It can also indicate a temporary change in the page behavior, such as entering edit mode.

Consider using alternative color roles to create greater or lesser emphasis depending on the needs of the app. Experiment with different color roles to achieve different effects.

*[image: Toolbar with low-emphasis controls.]*
Use the standard color scheme to draw focus to content outside the toolbar

*[image: Toolbar with high-emphasis controls.]*
Use the vibrant color scheme to emphasize controls or actions

#### Toolbars & navigation bars

The toolbar and navigation bar are both placed at the bottom of the window, so should **not** be shown at the same time. Show the navigation bar on primary pages, and toolbars on subsequent pages with actions.

*[image: A navigation bar shown on the main email Inbox page, and a toolbar shown when reading the email.]*
1. Navigation bar on a primary page
2. Toolbar on a secondary page with contextual actions

Floating toolbars can be used as tabs between related subsequent pages in the product hierarchy.

This helps group similar pages together, and shows that the selection affects the body content underneath.

*[image: Floating toolbar with secondary navigation labels.]* **✅ Do**
Keep navigation distinct, and use a toolbar to display local navigation on a specific page

Consider the existing app hierarchy when using a toolbar for local navigation. <br><br>Avoid redundant or confusing navigation combinations in the same view.

*[image: Floating toolbar with secondary navigation labels displaying above a bottom navigation bar.]* **❌ Don't**
Don’t show a navigation bar and a toolbar with navigation controls at the same time

### Anatomy

*[image: Diagram of toolbar layouts.]*
1. Container
2. Elements

#### Container

The docked toolbar’s container spans the full width of the window. <br><br>Avoid applying rounded corners to the container. This can imply the container expands or changes upon interaction.

*[image: Docked toolbar with square corners.]* **✅ Do**
Use straight corners for docked toolbars

*[image: Docked toolbar with rounded corners.]* **❌ Don't**
Avoid modifying the container shape

As long as there's a minimum of 16dp padding on the leading and trailing edge, arrange controls inside however you see fit. The 32dp padding between items is just the default. <br><br>All elements need a minimum 48x48dp target area to be accessible.<br><br>Be cautious of including too many controls as it can be overwhelming.

*[image: Docked toolbar with too many controls.]* **❌ Don't**
Don’t overwhelm people with too many controls

The floating toolbar’s container should be fully visible on screen. If more actions are needed, use an overflow menu.

*[image: Floating toolbar with overflow menu icon.]* **✅ Do**
Choose the most essential actions to show on screen by default

*[image: Floating toolbar that expands off edge of screen.]* **❌ Don't**
Floating toolbars shouldn’t exceed the edge of the window or pane

##### Elevation

Floating toolbars have elevation by default. <br><br>If the content beneath the toolbar is visually distinct, elevation can be removed.

*[image: Vibrant floating toolbar that's easy to see in front of a neutral text background.]*
The elevation on floating toolbars can be removed if on a visually distinct background

#### Flexibility & slots

When configuring a toolbar, think of it as a container with several slots.<br><br>These slots can be populated by buttons, icon buttons, images, text fields, or any kind of custom component.<br><br>Icon buttons provide an even hierarchy of controls. Mixing in a filled icon button can help add emphasis to a single action.

*[image: 5 toolbars with slots, and various combinations of buttons, icon buttons, filled icon buttons, and text fields.]*
Toolbars are made of slots that can contain many kinds of actions

Visually emphasizing a single action more than others is an effective way to create hierarchy and guide people to controls they use most often. Avoid emphasizing more than one action at a time.<br><br>Some common ways to add emphasis to toolbar actions include:

- Use different icon button color styles, such as filled, tonal, and standard
- Customize the color roles of a single action, such as a primary or secondary palette
- Use wide and narrow icon buttons
- Pair the toolbar with a FAB

*[image: 2 floating toolbars, 1 with a filled action button and 1 paired with a FAB.]*
Two different ways to create a high emphasis action in toolbars

*[image: Floating toolbar with primary action and FAB.]* **❌ Don't**
Don’t emphasize multiple buttons with bold, primary colors, such as a button and FAB together. Emphasize one action at a time.

*[image: Floating toolbar with different control designs.]* **❌ Don't**
Avoid mixing too many different controls in the same toolbar. A consistent control design keeps things clear.

Avoid using square icon buttons in floating toolbars. Their square shape conflicts with the fully-rounded shape of the floating toolbar container.

Square buttons can be used in the docked toolbar.

*[image: A floating toolbar, which is rounded, with squared icon buttons inside.]* **❌ Don't**
Don’t use square filled icon buttons in floating toolbars

#### Floating toolbar with FAB

A FAB can be placed next to a floating toolbar to present one high-priority action alongside a unified set of toolbar actions.

Use a FAB for the highest-priority action in the view, or to complement the controls.

*[image: 3 toolbars paired with FABs.]*
Floating toolbars can be paired with FABs

### Position & orientation

Only place docked toolbars at the bottom of the window.

If using other bottom-aligned elements, such as a navigation bar, don't use a docked toolbar.

*[image: Docked toolbar on mobile.]*
Docked toolbars are always at the bottom of the window

Floating toolbars can be horizontal or vertical. <br><br>Horizontal toolbars should have a minimum 16dp margin from the edge of the window.

*[image: Floating toolbar on mobile.]*
Horizontal floating toolbars should be at least 16dp from the edge of the window

In larger breakpoints, floating toolbars can be vertical and placed on either side of the screen.

Vertical toolbars should have a minimum 24dp margin.

*[image: Vertical floating toolbar with 24dp margin.]*
Maintain at least a 24dp margin for vertical toolbars

To keep vertical toolbars compact, don’t use wide icon buttons.

Use narrow or default icon buttons instead.

*[image: Toolbar showing local navigation.]* **❌ Don't**
Using wide buttons with vertical toolbars can unnecessarily widen toolbar containers and hide other UI elements

Vertical toolbars should be positioned opposite the navigation rail to balance out the screen and keep actions easy to access.

When showing a navigation rail and vertical floating toolbar at once, use the centered configuration of the navigation rail.

*[image: Large screen UI showing both a navigation rail and vertical floating toolbar.]*
When a nav rail is visible, the floating toolbar should be vertical on the opposite edge of the window

### Adaptive design

Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. [More on adaptive design](https://m3.material.io/foundations/layout/layout-overview)

#### Resizing

##### Docked

The docked toolbar should always span 100% of the screen width.

In compact breakpoints, elements in the toolbar should be evenly spaced.

In medium breakpoints and larger, adjust the padding between controls to create a comfortable layout. This can be achieved by:

- Centering all elements
- Customizing to center a key action, and aligning other elements to the edges

*[image: Docked toolbar with evenly spaced elements.]*
Docked toolbar items should be evenly spaced in compact windows

*[image: Docked toolbar with centered elements.]*
In medium breakpoints and larger, create a spacious layout by centering all elements

*[image: Docked toolbar with central action and some elements pushed to the edge.]*
Align controls to the edge of the screen to make them easier to reach on tablets, and to better highlight a primary action in the middle

On web and large screens, the docked toolbar can be rounded. Dividers can be used to organize large amounts of items. Only shrink the height and use extra small buttons if vertical space is limited.

*[image: Docked toolbar with 15 actions for text editing on large screens, organized with dividers.]*
On web and other large screens, docked toolbars can be rounded and placed in different parts of the page

##### Floating

The container should only be as big as needed to hold the items inside before reaching the 16dp margin.

If there’s not enough space for all items, put them in an overflow menu in the trailing slot. As the breakpoint expands, more actions can be revealed.

The floating toolbar width can also be capped to keep it smaller and hide more elements.

*[image: Floating toolbar in compact window with excess padding.]* **❌ Don't**
Don’t add extra space to a toolbar beyond its necessary items

*[image: Floating toolbar in expanded window class.]*
At larger screen sizes, the container can display more controls before hitting the 16dp margin

Vertical toolbars aren’t recommended for compact windows.<br><br>They take up a significant area of the screen and may feel visually overwhelming, especially on screens with complex layouts.

Only use them when the screen is simple or when the toolbar has a few controls.

*[image: Vertical toolbar in a compact window.]* **⚠️ Caution**
Vertical toolbars can cover important content in compact windows

#### Presentation

In larger breakpoints, floating toolbars can be aligned to opposite edges of the screen so they're easy to reach and group similar actions. For example, consider placing the undo and redo actions in one toolbar, and editing controls like highlight, erase, and select in another. Stylistic differences can help emphasize each toolbar’s purpose and clarify hierarchy.

*[image: 2 toolbars, each with distinct stylistic treatment and actions.]*
Multiple toolbars with different stylistic treatments can create hierarchy and distinguish different kinds of actions

Don’t use multiple toolbars in compact windows. There typically isn’t enough room on screen. <br><br>Instead, use one toolbar for all actions.

*[image: Multiple toolbars in a compact window.]* **❌ Don't**
Avoid using multiple toolbars in smaller windows

Actions at the trailing edge of the toolbar can collapse into an overflow menu at smaller breakpoints, and become visible again at larger sizes.

*[video: App bar resizing to wider view.]*
Actions at the trailing edge collapse into an overflow menu

#### Right-to-left languages

In right-to-left (RTL) languages, mirror individual items that need it, like icons and text direction. If the order of actions is important, flip the order of the actions as well.

*[image: Next button is on trailing edge for a LTR language.]*
In LTR languages, the **Next** button is intentionally placed on the trailing (right) edge

*[image: Next button is now on the trailing edge, at left, for RTL language.]*
In RTL languages, reverse the order so **Next** remains on the trailing edge when flipped, now on the left. Text is not translated to illustrate mirroring.

### Behavior

#### Scrolling

Docked toolbars can either remain on the screen during scroll, or animate offscreen.

*[video: Docked toolbar animating off screen.]*
Docked toolbars can animate offscreen

Floating toolbars can remain on the screen, animate offscreen, or collapse into a single, high-emphasis action on scroll.

*[video: Floating toolbar animating off screen.]*
Floating toolbars can animate off screen

On Jetpack Compose, the floating toolbar can collapse to a FAB or key action on scroll.

*[video: Floating toolbar with several actions animating on scroll to hide all actions except the center one.]*
Floating toolbars can be customized to do other actions on scroll, like collapse into a single action

Don't collapse actions and scroll at the same time.

*[video: A toolbar collapsing to one action, and moving off screen when the page is scrolled.]* **❌ Don't**
Toolbars shouldn't both collapse and transition off page

## Accessibility

### Use cases

People should be able to the following with assistive technology:

- Navigate and activate any actions in the toolbar
- Select a destination from a menu
- Activate a back button
- Maintain access to toolbar controls when the content is scrolled or collapsed

### Interaction & style

The toolbar has no interactions by default. All interactions are with the elements placed inside.

**Touch**

- When tapping on an icon button in the toolbar, a touch ripple appears, indicating interaction feedback.

*[video: An animation of the user tapping on an action item and the ripple effect being shown.]*
Touch: Tap

**Cursor**

- When hovered, the hover state provides a visual cue to the user that the element is interactive.
- When clicked (in both active and inactive states), a ripple appears, showing the user feedback.

*[video: A mouse hovering over a button in the top app bar, then clicking.]*
Cursor: Hover, Click

#### Initial focus

Focus lands on the first interactive element.

Use **Tab** to navigate through all other actions.

*[image: Navigating the top app bar using arrow or tab on a keyboard.]*
Use **Tab** to navigate through interactive elements

*[image: Activating actions in the top app bar using space or enter on a keyboard.]*
Use **Space** or **Enter** to activate actions

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab or Arrows | Navigate between interactive elements |
| Space or Enter | Activate the focused element |

#### Labeling elements

On web, the toolbar container should have the **toolbar** role.

On mobile, it can be a generic container.

All actions inside the toolbar should follow their respective accessibility guidelines.

*[image: A toolbar on web, with a “toolbar” role label.]*
On web, use the **toolbar** role
