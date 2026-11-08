<!-- Source: https://m3.material.io/foundations/layout/grids-spacing · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__layout__grids-spacing.md @ 3c0e291 -->

# Grids &amp; spacing

Grids and spacing organize content and actions for any layout

## Overview

- Grids create a consistent foundation and adapt across breakpoints (previously window size classes)
- Use spacing to group related information and direct people’s attention to key actions
- Density helps people see and compare more information in data-heavy views

*[image: Mobile and desktop UIs with grid lines.]*
Layouts in Material are based on a grid that adapts across all screen sizes

### Availability & resources

| Type | Resource | Status |
|---|---|---|
| Design | [M3 Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| [Spacing system & tokens](https://m3.material.io/styles/spacing) | Available |  |
| Implementation | [Jetpack Compose: Rulers](https://developer.android.com/reference/kotlin/androidx/compose/ui/layout/Ruler) | Available |

### What’s new

###### **May 2026**

- How to use grids and rulers to adapt layouts across devices
- Expressive spacing guidelines

*[image: Tablet with content divided into 8 columns. Each pane of content is 4 columns wide.]*
As screen size increases, additional columns allow for a richer layout

## Grids

- Layouts in Material are based on a grid that adapts across all breakpoints (previously window size classes)
- Parts of the layout scaffold like rails and panes are positioned on this grid to create consistent adaptive layouts
- The structure and spacing values used in a grid can add personality to a product’s layout

### How to use grids

#### Start with placing grid columns

Grids adapt across breakpoints. As the size increases, column count, width, and spacing change as well.

*[image: A mockup of grid columns, showing compact, medium/expanded, and large/extra-large breakpoints.]*
The number and size of columns changes based on breakpoints

When moving between sizes, column count may increase to show more content or controls.

*[image: A course listing on a compact screen, with 4 columns.]*
On compact screens, fewer columns are used to create a focused layout

*[image: A course listing on a foldable screen, with 8 columns.]*
As screen size increases, for example when a foldable screen is unfolded, additional columns allow for a richer layout

#### Place bars & rails

Populate regions of the layout scaffold that are closest to the edges of the screen’s usable space first. This may include:

- Bars like the navigation bar and rail
- Components like toolbars and app bars

*[image: A compact screen with a toolbar highlighted.]*
The bar region can contain a toolbar

*[image: A large screen with a leading navigation rail highlighted.]*
The rail region on larger screens usually contains a navigation rail

#### Place panes

Next, populate the main region of the screen with panes with content and components, based on available space and structure.

See the [canonical layout examples](https://m3.material.io/foundations/layout/canonical-examples) for ideas on which panes are appropriate for a product.

*[image: Mobile UI with 1 pane. Foldable UI with 2 panes in a supporting pane layout.]*
1. Primary pane
2. Supporting pane

### Rulers & alignment

Rulers are a set of recommended global alignment lines that help create consistent focal points in a product, while keeping content and components consistently aligned.

[How to implement rulers in Compose](https://developer.android.com/reference/kotlin/androidx/compose/ui/layout/Ruler)

*[image: 1 compact and 1 desktop UI mapping rulers.]*
1. Margin
2. Bar or safety region
3. Title
4. Content 1
5. Content 2
6. Content 3
7. Content 4
8. Bar or safety region
9. Rail

#### Bar & safety rulers

Bar and safety rulers reserve space for [system UI](https://developer.android.com/training/system-ui) elements like the status bar and gesture navigation.

They ensure actionable content like app bars aren’t covered by system UI.

*[image: 2 mobile UIs showing bar and safety rulers at the top and bottom.]*
Bar and safety rulers align to the edges of a screen’s usable space, providing a reference for where system UI like the status bar or gesture navigation appear

#### Title rulers

The title ruler creates consistency for the screen’s title, aligning the text, icons, and other components in an app bar.

*[image: 1 mobile and 1 desktop UI showing title rulers.]*
The title ruler aligns with the title in an app bar

#### Content rulers

Use content rulers to align and anchor key content, such as headlines and carousels.

- First content ruler: Emphasizes major blocks like hero images, headlines, or primary components
- Secondary rulers: Determine where supplementary text or actions begin

*[image: 1 mobile and 1 desktop UI showing content rulers.]*
Content rulers offer flexible alignment options to help create a consistent layout across a product

*[video: Carousel and text resizing to align with content rulers, creating a structured layout.]*
Realigning primary components or content to a content ruler can create strong hierarchy and visual rhythm across a product

#### Ruler options

Margin rulers come with some wiggle room to determine how tight or loose a product’s content feels on-screen. The standard ruler can be adjusted to the left or right.

Choosing a narrower or wider margin can create or remove negative space, or create expressive moments in a content-forward product.

*[video: Mobile UI showing a recipe layout where text margins narrow while the hero photo expands.]*
Margin rulers can adjust to create more or less negative space

Rulers can also be used to create more immersive experiences. For example, a photo grid can take the full width of the screen, while components like search use wider margins.

*[image: Mobile UI for a photo app showing a full-width image grid and a search bar with wide margins.]*
Rulers allow components and media to use different margin widths

## Spacing

- Spacing helps group content, direct attention, and shape the personality of a product
- A denser layout can feel more serious and focused, while a more spacious layout can feel calm and open
- Material’s spacing system can adapt to breakpoints and density settings. [More on the spacing system](https://m3.material.io/styles/spacing)

*[image: 2 screens: 1 mobile with tight spacing, 1 desktop with wider spacing.]*
Desktop layouts can use more generous spacing than mobile layouts

### Spacing to group content

Grouping connects related elements that share context, such as an image and its caption. Use spacing to visually tie elements together and establish boundaries between unrelated items.

*[image: Photo of dumplings with a caption reading “restaurants in the area”.]*
Placing a caption under an image creates an implicit group

**Explicit grouping** uses visual boundaries like outlines, dividers, and shadows to group related elements in an enclosed area.

It can also indicate that an item is interactive, such as:

- List items between dividers
- A card displaying an image and its caption

*[image: A contact grouped in an outlined card with a photo and caption.]*
Outlines define clear boundaries to explicitly group elements

**Implicit grouping** uses close proximity and open space (rather than lines and shadows) to group related items.

For example, the items in a carousel are placed close together, with space around the composition to separate them from other content.

*[image: Carousel of food-related photos.]*
Close spacing implicitly groups carousel images

### Spacing to direct attention

Use rhythm, similarity, and other grouping principles to distinguish and highlight important elements.

#### Rhythm

Consistent spacing between related elements or groups makes them easier to navigate with the eye.

*[image: 4 art courses in a row of cards with consistent horizontal spacing and different heights.]*
Cards should maintain consistent horizontal spacing to establish a strong rhythm when their height varies

#### Similarity

Similar elements should have the same spacing and sizing in a layout to show they’re related.

Leading elements like thumbnails, avatars, or icons should always be aligned.

*[image: 3 shopping basket list items with the same thumbnail sizes and text styles.]*
Thumbnails in a shopping basket should use identical sizes and styles to signal that each one represents a product, even if the original photos have different aspect ratios

#### Proximity

Place components near each other to create cohesive groups. This helps people understand the relationships between information and actions.

For example, buttons should be close to the content they’re affecting.

*[image: Email message with Reply and Reply all buttons positioned close together.]*
Placing two buttons as a group near content implies they’ll both affect it in similar ways

#### Continuity

Place related elements in a container, row, or column to establish a clear group or relationship.

*[image: Clothing product page with a horizontal row of size chips, with 6 selected.]*
Use a row of chips to signal a single, unified control

### Spacing as expression

Give the most important content, tasks, or actions visual prominence with generous spacing and the brightest surfaces.

#### Focal points

Consistent placement of key actions and information helps build recognizable focal points across a product.

*[image: 2 mobile screens showing carousels with identical layouts and title placement.]*
Carousel images, categories, and titles should appear in a consistent location across pages

#### Negative space

Allow negative space to give form and meaning to elements on screen. Framing important actions or content with generous spacing creates emphasis.

*[image: A mobile screen shows  generous negative space around carousel images.]*
Negative space gives shape and emphasis to the course header

## Density

- Information density is the consideration of the amount of information visible on the screen
- The default target size should be at least 48x48 CSS pixels
- People can change density as long as the density controls are accessible
- Apply density thoughtfully; not every layout needs it
- Layout and component scaling (component adaptation or component density) can allow people to scan, view, or compare more information at once

*[video: A website design with a denser arrangement of text and graphics.]*
Information density can change based on context and preference

*[video: 5 components scaling with multiple size examples.]*
Consider whether components should scale

**Information density**

- Information density can be achieved through layout and design decisions without using component scaling
- Some people may not benefit from increased density

**Component scaling**

- Components can adapt and change dimensions to help people scan, view, or compare different amounts of information
- Don't apply component scaling by default if it would result in a target below 48x48 CSS pixels

*[video: An email app with “Appearance settings” open to change information density between cozy, comfortable, and compact.]*
Information density and component scaling can be used together to provide more information and additional user control

### Information density

Information density refers to the amount of content (such as text, images, or videos) in a given space.

A layout’s spacing dimensions, including margins, spacers, and padding, can change to increase or decrease its information density. High density layouts are useful when people need to scan, view, or compare a lot of information, such as in a data table. Increasing the layout density of lists, tables, and long forms makes more content available on-screen.

Consider density settings in the context of a device. Although a person may prefer a denser layout for desktop, they may not for mobile. Density shouldn’t automatically change across breakpoints or orientation unless a person changes it.

*[image: 2 layouts: 1 with low density and 1 with high density.]* **✅ Do**
Consider using higher density information design when people need to scan lots of information

*[image: News website on desktop displaying a high information density.]*
Consider the amount and priority of information on-screen. Higher density can be useful for data-rich products where people expect to scan lots of information quickly. Examples: News, financial portals, dashboards

*[image: News website on desktop displaying a low information density.]*
Lower density can be better for sites prioritizing aesthetics, a focused message, less information, or easier navigation

### Component scaling

The component density scale controls the internal spacing of individual components.

The density scale is numbered, starting at 0 for a component’s default density. The scale moves to negative numbers (-1, -2, -3) as space decreases, creating higher density.

Higher density is typically applied by decreasing the top and bottom padding or overall height by 4dp.

*[image: 3 buttons with densities  of 0, -1, -2.]*
Apply component density based on the needs and layout of a design

Center the grouped element within the component container.

Text size shouldn’t change as the container size scales.

*[image: Text field showing 20dp between label and input]*
The measurement between the label and input is 20dp

*[image: Parent container showing label above input.]*
The label and input are centered within their parent container

*[image: Dropdown menu with high density items and selectable space height of 38dp.]* **❌ Don't**
Don’t increase density in UIs that involve focused tasks, such as selecting from a menu. It reduces usability by limiting selectable space.

*[image: Single-line snackbar with high density.]* **❌ Don't**
Don't increase the density in components that alert a person of changes, such as snackbars or dialogs

#### Avoid applying component scaling by default

People should be able to **opt in** to dense layouts and components.

To ensure density settings can be easily reverted, settings interactions must use default target sizes (48x48 CSS pixels).

Don't scale layouts below 48x48dp by default.

*[video: A density menu with large, medium, and small options to customize the screen layout of a table on desktop.]*
People can opt in to dense layouts in settings

### Targets

Dense components can be less accessible because interactive elements are smaller, so use caution when increasing information density.

*[image: Selectable target of only 40dp.]* **⚠️ Caution**
Use caution when applying component scaling where selectable targets will be reduced to less than 48x48dp. Only apply density where it provides a better experience.

Use caution when applying density to interaction targets. Accessible targets should retain a minimum of 48x48dp, even if the visual element, such as an icon, is smaller.

*[image: Settings button icon is 24x24dp, but has interaction target of 48x48dp.]*
The target should remain 48x48dp, even if the icon is smaller

*[image: Button with height of 36dp and interaction target of 48dp.]*
The interaction target of a common button can be larger, as long as it meets the 48x48dp minimum size

### Pixel density

Pixel density is the number of pixels per inch. High-density screens have more pixels per inch than low-density ones. Elements with the same pixel dimensions appear larger on low-density screens and smaller on high-density screens.

To calculate pixel density:

Pixel density = Screen width (or height) in pixels / Screen width (or height) in inches

*[image: Magnified UI element  showing a high number of pixels in the focus area.]*
High-density elements have more pixels per inch

*[image: Magnified UI element  showing a low number of pixels in the focus area.]*
Low-density elements have fewer pixels per inch

#### Density-independent pixels

Density-independent pixels, written as dp, are flexible units that scale to have uniform dimensions on any screen. They provide a flexible way to accommodate a design across devices. The Material design system uses density-independent pixels to display elements consistently on screens with different densities.

A dp is equal to one physical pixel on a screen with a density of 160.

To calculate dp: <br>dp = (width in pixels * 160) / screen density

*[image: Screen with grid representing a low number of pixels.]*
Low-density screen displayed with density independence

*[image: Screen with grid representing a high number of pixels.]*
High-density screen displayed with density independence

| Screen physical width | Screen density | Screen width in pixels | Screen width in dps |
|---|---|---|---|
| 1.5 in | 120 | 180 px | 240dp |
| 1.5 in | 160 | 240 px |  |
| 1.5 in | 240 | 360 px |  |
