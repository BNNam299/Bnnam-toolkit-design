<!-- Source: https://m3.material.io/components/app-bars · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__app-bars.md @ 3c0e291 -->

# App bars

## Overview

- Focus on describing the current page and provide 1–2 essential actions
- Displays labels and page navigation controls at the top of the page. (Use a toolbar to display page actions)
- Four variants: Search app bar, small, medium flexible, large flexible
- On scroll, apply a fill color to separate from body content
- Can animate on and off screen with another bar of controls, like a row of chips

*[image: 4 configurations of app bars stacked vertically to show differences.]*
1. Search app bar
2. Small
3. Medium flexible
4. Large flexible

### Availability & resources

### M3 Expressive update

**May 2025**<br>The new **search app bar** supports icons inside and outside the search bar, and centered text. It opens the [search view](https://m3.material.io/components/search) component when selected. <br><br>The new **medium flexible** and **large flexible** app bars come with significant improvements, and should replace **medium** and **large** app bars, which are no longer recommended. The **small** app bar is updated with the same flexible improvements. <br><br>[More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Renamed component from **top app bar** to **app bar**
- Added **search app bar**
- **Medium** and **large** app bars are no longer recommended
- Added **medium flexible** and **large flexible**app bars with:
  - Reduced overall height
  - Larger title text
  - Subtitle
  - Left- and center-aligned text options
  - Text wrapping
  - More flexible elements for imagery and filled buttons

- Added features to **small**app bar:
  - Subtitle
  - Center-aligned text option
  - More flexible elements for imagery and filled buttons

*[image: 4 total app bar configurations.]*
1. Search app bar
2. Small
3. Medium flexible
4. Large flexible

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- On scroll: No drop shadow, instead a color fill creates separation from content
- Typography: Larger default text
- Layout: Smaller default height

*[image: M2 top app bar with elevation to separate it from main content.]*
M2: Elevation and a drop shadow raise the top app bar when content is present underneath

*[image: M3 app bar with subtle color difference from main content.]*
M3: On scroll, a color fill overlay separates the app bar from the content beneath

## Specs

### Variants

*[image: 4 variants of app bars.]*
1. Search app bar
2. Small
3. Medium flexible
4. Large flexible

#### Baseline variants

The baseline M3 **medium** and **large** app bars are no longer recommended in M3 Expressive, and should be replaced with **medium flexible** and **large flexible** app bars, which are similar visually, but have multi-line support, a shorter height, and can contain a wide variety of elements, like images. [Jump to baseline app bar specs](https://m3.material.io/components/app-bars)

*[image: 2 baseline app bar variants, medium and large.]*
Baseline variants

1. Medium
2. Large

| Variant | M3 | M3 Expressive |
|---|---|---|
| Search app bar | -- | Available |
| Small | Available | Available |
| Center-aligned | Available | Merged into **small**. <br>Use centered-text configuration. |
| Medium (baseline) | Available | Not recommended.Use **medium flexible** |
| Medium flexible | -- | Available |
| Large (baseline) | Available | Not recommended.Use **large flexible** |
| Large flexible | -- | Available |

### Configurations

#### Text alignment

*[image: 4 variants of app bars with different left and center aligned text headlines.]*
Text labels, including supporting text, can be aligned to the leading edge or centered

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Text alignment | Leading edge (default) | Available | Available |
| Centered | -- | Available |  |

### Tokens & specs

Select a token set to view in the table's menu. App bar token sets are organized into a common token set, and size-specific tokens. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__app-bars.md` — App bar - Size - Small, App bar - Common, App bar - Size - Medium Flexible, App bar - Size - Large Flexible, App bar - Size - Large (baseline), App bar - Size - Medium (baseline), [Deprecated] Top app bar -  Large, [Deprecated] Top app bar - Medium, [Deprecated] Top app bar - Small, Center-aligned, [Deprecated] Top app bar - Small]*

#### Search component tokens & specs

The default search component tokens are used in the search app bar.

*[Token table (measurements, color, shape): `tokens__components__app-bars.md` — Search - Bar, Search - View]*

### Anatomy

*[image: 5 elements of the component.]*
1. Container
2. Leading button
3. Trailing elements
4. Headline
5. Subtitle

App bars can be customized to include:

- An image or logo
- A subtitle
- A filled icon button

Avoid customizing the size of the heading and subtitle, or adding too many actions.

*[image: 3 app bars: 1 with a newspaper logo, 1 with a subtitle, and 1 with a filled icon button.]*
The app bar can have different layouts depending on which elements are shown

#### Search

The search app bar can include trailing actions inside and outside the search bar. When the search bar is selected, it should open the search view component.

*[image: 5 elements of the search app bar.]*
1. Container
2. Leading icon button
3. Hinted search text
4. Trailing icon or avatar
5. Search container

*[image: 3 layouts of icons in the search app bar.]*
1. A leading element and a trailing element outside search
2. A leading element, a trailing element inside search, and a trailing element outside search
3. A leading element and two trailing elements outside search

#### Image

An image can be placed in the app bar. In small app bars, this can replace the label text.

*[image: Graphic replacing text headline content.]*
Images can be added to app bars and can replace label text on small app bars

#### Filled trailing icon button

The app bar's trailing icon buttons can be replaced with a single, primary, or tonal filled icon button in default or wide sizes.

*[image: App bars configured with filled trailing icons.]*
The trailing icons can be configured to be a single filled icon button

#### Subtitle

*[image: App bars configured with subtitles below their headlines.]*
The medium flexible and large flexible app bars hug the text contents, so they are taller when a subtitle is visible

1. Small
2. Small with subtitle
3. Medium flexible
4. Medium flexible with subtitle
5. Large flexible
6. Large flexible with subtitle

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

All app bars share the same color roles. On scroll, the container changes color to **surface container**.

*[image: 4 color roles of the leading edge app bar in light and dark scheme.]*
App bar color roles used for light and dark themes:

1. Surface
2. On surface
3. On surface variant
4. On surface
5. On surface variant
6. Surface container (on scroll)

*[image: 4 color roles of the center-aligned app bar in light and dark scheme.]*
Search app bar color roles used for light and dark themes:

1. Surface
2. On surface variant
3. On surface variant
4. On surface variant
5. Surface container
6. Surface container
7. Surface container highest

#### Scroll states

*[image: Color roles for app bars when flat and on scroll.]*
The app bar changes color when flat or on scroll. The search bar can also change color on scroll.

1. Flat
2. On scroll

### Measurements

#### Search app bar

*[image: Search app bar size and padding measurements.]*
Search app bar padding and size measurements

#### Small app bar

*[image: Small app bar size and padding measurements.]*
Small app bar padding and size measurements

#### Medium flexible app bar

*[image: Medium flexible app bar padding and size measurements.]*
Medium flexible app bar padding and size measurements

#### Large flexible app bar

*[image: Large flexible app bar padding and size measurements]*
Large flexible app bar padding and size measurements

---

### Baseline app bars

The **medium** and **large** app bars are no longer recommended in M3 Expressive. Use the **medium flexible** and **large flexible** app bars in their place.

*[image: 4 elements of medium and large app bars.]*
Medium and large app bars have the same elements:

1. Container
2. Leading button
3. Trailing icons
4. Headline

#### Tokens & specs

Select a token set to view in the table's menu. Baseline app bar token sets are organized into medium, large, and older baseline token sets. [Learn about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__app-bars.md` — App bar - Size - Small, App bar - Common, App bar - Size - Medium Flexible, App bar - Size - Large Flexible, App bar - Size - Large (baseline), App bar - Size - Medium (baseline), [Deprecated] Top app bar -  Large, [Deprecated] Top app bar - Medium, [Deprecated] Top app bar - Small, Center-aligned, [Deprecated] Top app bar - Small]*

#### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 4 color roles of the medium top app bar in light and dark scheme.]*
Medium top app bar color roles used for light and dark schemes:

1. Surface
2. On surface
3. On surface
4. On surface variant

#### Measurements

##### Medium app bar

*[image: Diagram of medium app bar padding and size measurements.]*
Medium app bar padding and size measurements

##### Large app bar

*[image: Diagram of large app bar padding and size measurements.]*
Large app bar padding and size measurements

## Guidelines

*[image: 4 app bars with headlines and action icons.]*
App bars show information about the page, key actions, and navigation actions like **Back** or **Menu**

### Usage

Use an app bar to provide content and actions related to the current page, such as page navigation actions, headlines, images, and 1–2 essential actions.

The information and actions in the app bar should be contextual and specific to a page, but can also include global product controls, such as search or notifications.

*[image: App bar with navigation icon buttons and a 2-line title.]*
App bars provide content and actions related to the current page

App bars should only have one action, two if necessary.

The primary action should alter or exit the entire page, like **Send**, **Save**, or **Edit**.

If the product has many actions, place those in a toolbar. Avoid placing an overflow menu in the app bar when possible.

*[image: App bar with content below.]*
App bars can display one high visibility action to boost its prominence

To boost visibility of a primary action, change the style of the icon button to filled or tonal, and consider using a wide icon button.

Avoid using multiple filled or tonal buttons.

*[image: App bar with 1 filled button.]* **✅ Do**
Use a filled or tonal button for important actions

*[image: App bar with 2 filled buttons, side by side.]* **❌ Don't**
Don’t put multiple filled or tonal buttons in the app bar

The four variants of app bars are:

1. **Search app bar** Use on home pages when search is key to the product.
2. **Small** Use in dense layouts or when a page is scrolled.
3. **Medium flexible** Use to display a larger headline. It can collapse into a small app bar on scroll.
4. **Large flexible** Use to emphasize the headline of the page.

*[image: The 4 app bar variants.]*
1. Search app bar
2. Small
3. Medium flexible
4. Large flexible

#### Baseline app bars

There are two baseline app bars that are no longer recommended:

1. **Medium** Replace with medium flexible.
2. **Large** Replace with large flexible.

*[image: 2 baseline app bars.]*
1. Medium
2. Large

### Search app bar

Use a search app bar to provide an emphasized entry-point to open the search view.

*[image: A search bar within an app bar.]*
Search app bars have a search field instead of heading text

Search bars should always include the word **Search**. They can use various capitalization styles depending on the product.

1. **Search**
2. Searching a specific area Example: **Search inbox**
3. Search [Product]  Example: **Search Photos**

*[image: 3 examples of search text in an app bar.]*
Use proper capitalization depending on what’s being searched

#### Buttons in search app bar

In addition to a trailing avatar, search app bars can have up to two trailing icons on mobile.

Trailing icons can be placed inside or outside the search bar.

*[image: 2 icons placed in the search bar.]*
Put the most used actions on the left and least used on the right

The leading element of a search app bar can be used for a product’s logo to brand the app’s overall experience. <br><br>This logo can be purely cosmetic, or can trigger an action like returning to the home screen or refreshing it.

Avoid using a logo to open an expanded navigation rail.

*[image: A search app bar with a logo, search bar, and avatar.]*
The leading element can be a product logo

Don’t use more than two trailing icon buttons with an avatar. <br><br>If more actions are needed, place them in a toolbar instead.

*[image: 3 icons placed in a search app bar.]* **❌ Don't**
Don’t use three icons and an avatar in a search app bar

#### Large screens

The search app bar dynamically adapts to available width. There should be up to four trailing icons on larger screens.

*[image: 4 actions placed in a search app bar on a large screen.]*
Increased horizontal space on larger screens allows for up to four trailing icons.

#### Alternate color options

By default, search containers in app bars use the **surface container** color to distinguish it from the app background. If the background is darker, use a lighter container color on the search bar, like **surface bright**.

When choosing alternate colors, make sure the search text and container have at least 3:1 contrast for readability.

*[image: App bar with a light search container color.]*
Search app bars can use different colors, like **surface bright**, for improved contrast with surrounding elements

### Anatomy

*[image: Diagram of app bar layout.]*
1. Container
2. Headline
3. Trailing icons
4. Subtitle
5. Leading button

#### Container

The app bar container holds all information and actions at the top of a screen, including navigation icons, headlines, and buttons.

Avoid changing the position or shape of the container.

*[image: App bar with square corners.]* **✅ Do**
Use straight corners for app bars

*[image: App bar with curved corners.]* **❌ Don't**
Don’t use curved shapes. This implies that the container can expand upon interaction.

Always use the default height of the app bar, and make it span the full width of the window.

*[image: App bar at default height.]* **✅ Do**
Default heights were chosen to ensure readability of on-screen elements

*[image: App bar with reduced height.]* **❌ Don't**
Don't make an app bar shorter than its default height

#### Adding logos

Image logos can be used in app bars to bolster brand identity or visual appeal.

The image should be high quality and pertinent, and shouldn’t disrupt the app bar's functionality.

*[image: A logo added to an app bar.]*
Image logos can replace all text in small app bars, and appear above the text in other app bars

#### Leading button

The leading button should be used for navigating the product.

It typically is one of the following:

- A menu icon, which opens a modal expanded navigation rail
- A back arrow, which returns to the previous screen

*[image: Leading navigation icon aligned on left of app bar]*
1. Leading **Back** button

#### Headline

The headline can describe:

- The current page
- The current section
- The product

Headline text should be brief enough to easily fit in the app bar.

In medium flexible and large flexible app bars, the headline can wrap to a second line.

Don’t truncate the headline text.

*[image: App bar headline text set in 2 lines.]* **✅ Do**
If headline text is long, use a medium flexible or large flexible app bar and wrap the headline to two lines maximum

*[image: Small app bar headline text wrapped on 2 lines.]* **❌ Don't**
Don’t wrap text in a small app bar

Headlines can be aligned to the leading edge or centered.

The headline’s typography size and style change depending on the app bar variant.

*[image: Search, small, medium and large flexible app bars with headline styles.]*
Headline typography style for each app bar

1. Search: Body large
2. Small: Title large
3. Medium flexible: Headline medium
4. Large flexible: Display small

#### Subtitle

Subtitles can add additional context to a page.

These can be leading-aligned or center-aligned with the headline text.

*[image: Small to large flexible app bars with headline and subtitle styles.]*
Subtitle typography style for each app bar:

1. Small: Label medium
2. Medium flexible: Label large
3. Large flexible: Title medium

#### Trailing icon buttons

Up to two icon buttons can be placed after the headline, aligned to the trailing edge of the app bar. Place most-used actions closest to the leading edge.

Avoid using these buttons to open a menu with more actions. If more actions are needed, place them in a toolbar instead.

If changing the icon button color style to filled or tonal, only use one icon button.

*[image: 2 icons placed to right of headline, from most to least used.]*
Put the most used actions on the left and least used on the right

Use filled icons when possible for the best visibility. Outlined icons can also be used, particularly for unselected toggle buttons.

*[image: App bar with 2 filled icons, “save” and “download.”]* **✅ Do**
Use filled icons for clear, visible actions

*[image: App bar with 2 outlined icons, “save” and “download.”]* **⚠️ Caution**
Outlined icons can be used as needed, or when using toggle buttons

### Adaptive design

Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. [More on adaptive design](https://m3.material.io/foundations/layout/layout-overview)

#### Resizing

The width of the app bar container responds to the view or device width.

It should always span 100% of the window width.

*[video: App bar resizing to wider view.]*
The app bar’s container responds to always fill the window width

Resizing may cause actions at the trailing edge of the app bar to collapse into an overflow menu at smaller breakpoints.

These actions become visible again at larger sizes.

*[video: Trailing icons in app bar collapse into overflow when screen size shrinks.]*
Actions at the trailing edge collapse into an overflow menu

The search container of the search app bar should fill 100% of the space between leading and trailing app bar elements until it reaches 312dp. Then, it should only grow further to fill 50% of that space.

*[video: Search app bar resizing to wider view.]*
The search field adapts to the amount of space between other elements in the app bar

#### Presentation

The app bar automatically supports right-to-left (RTL) languages by aligning the layout of elements to the leading and trailing edges of the container.

This means that in RTL languages, the layout of the app bar is mirrored.

*[image: App bar in RTL with Hebrew text.]*
The app bar’s layout is mirrored for right-to-left (RTL) languages

### Behavior

#### Scrolling

App bars should initially be the same color as the background, then fill with a contrasting color on scroll to provide visual separation from the background.

The app bar can remain on a page at all times, or can hide and reappear when scrolling.

*[video: Scrolling app bar container fills with contrasting color.]*
Upon scrolling, an app bar container fills with contrasting color to create a visual separation

To focus more on body content, consider setting the app bar container to be transparent on scroll. This allows the buttons to float above the content.

Make sure icon buttons have a container fill.

Consider using narrow-width icon buttons for actions, like **Back**, to reduce the amount of space they take up.

*[video: Medium flexible app bar compresses to transform into transparent small app bar.]*
Upon scrolling, an app bar container remains transparent and actions inside become filled icon buttons

Selecting the search bar should open the search view component.

*[video: A search app bar opening the search view component when selected.]*
When selected, a search app bar opens a search view

When scrolled, **medium flexible** and **large flexible** app bars can transform into **small** app bars. They should remain small until the page is scrolled back to the top. Don’t transform app bars into a **search app bar**.

*[video: Scrolling top app bar compressing to scroll upwards or downward.]*
The app bar can hide when scrolling up and reveal when scrolling down

*[video: Medium app bar compresses to transform into Compact top app bar.]*
Medium and large flexible app bars can use the compress effect to transform into small app bars when scrolled

## Accessibility

### Use cases

People should be able to do the following using assistive technology:

- Understand what page they’re currently visiting
- Take actions or navigate to a new page destination
- Maintain access to app bar actions when the content is scrolled

### Interaction & style

#### Touch

When tapping on an icon button, a touch ripple appears, indicating interaction feedback.

*[video: An animation of the user tapping on an action item and the ripple effect being shown.]*
Touch: Tap

#### Cursor

When hovered, the hover state provides a visual cue to the user that the element is interactive.

When clicked (in both active and inactive states), a ripple appears to indicate feedback.

*[video: A mouse hovering over a button in the app bar, then clicking.]*
Cursor: Hover, Click

#### Keyboard or switch

When navigating to an interactive element, a focus indicator appears to show that action can be taken.

When the element is selected, an action is then performed.

*[video: An example of how to navigate the app bar using a keyboard.]*
Interactive elements should have focus rings

#### Initial focus

Focus should initially land on the leading button, since it’s the first interactive element of the app bar.

*[image: The tab button is used to navigate from the first button to the second button in the app bar.]*
Use **Tabs** to navigate through interactive items

*[image: The space or enter button activates the second action.]*
Use **Space** or **Enter** to activate actions

### Color

On search app bars, use the default color roles when possible.

- Search container: **surface container**
- Search label: **on surface variant**

On darker backgrounds, search bar containers can use the **surface bright** role to maintain strong visual contrast.

If mapping to other color roles, make sure the text and container have 3:1 contrast to ensure readability.

*[image: A search app bar with default dark text on a light container background.]* **✅ Do**
Make sure search bars and their labels have at least 3:1 contrast. Use the default colors when possible.

*[image: A search app bar with custom light text on a light container background.]* **❌ Don't**
Avoid using custom color roles for the search bar container and search label text. If custom roles are necessary, make sure they have contrast of at least 3:1.

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab | Move focus to the next interactive element |
| Space or Enter | Activate the focused element |

### Labeling elements

The accessibility label for a title should be the same as the content within the title. If needed, add additional context to the accessibility label to ensure users understand what page they’re on or what content is being shown.

Screen readers will read the UI text followed by the component’s role.

*[image: The headline has accessibility role “Title”.]*
An app bar’s accessibility label can incorporate its UI text as well as additional context

Label icon buttons according to their [accessibility guidelines](https://m3.material.io/components/icon-buttons).

*[image: The app bar icon button has the accessibility role “Button”.]*
An icon button should be clearly labeled on the action it takes, like **View on map**
