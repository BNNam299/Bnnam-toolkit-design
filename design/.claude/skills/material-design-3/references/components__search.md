<!-- Source: https://m3.material.io/components/search · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__search.md @ 3c0e291 -->

# Search

## Overview

- Use search for navigating a product with queries
- A search bar can include a leading search icon, hinted search text, and optional trailing icons
- Search can display suggested keywords or phrases as a person types
- A search bar displays search suggestions or results in a list
- Use a search app bar to provide an emphasized, global entry-point

*[video: Mobile UI shows a person typing into an email search bar. It expands to show a list of results.]*
When inputting text, search suggestions or results appear below the search bar

### Availability & resources

### M3 Expressive update

Search has a new visual style, motion, and more flexibility for trailing icons. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

**February 2025**

Naming

- Search bar and search view are now collectively named **search**

Configurations

- Styles: Search can be contained (recommended) or divided
- Gaps can separate results into groups

Motion

- The search bar grows wider when focused

Supported platforms:

- [Jetpack Compose](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#SearchBar(androidx.compose.material3.SearchBarState,kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Shape,androidx.compose.material3.SearchBarColors,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp))

*[video: A recipe search with “Search recipes” hinted text, “Mexican dishes” is entered, then results appear in a list.]*
The **contained** search style features a persistent, filled search container

### Differences from M2 to M3 baseline

- Color: New color mappings and compatibility with dynamic color
- Elevation: Lower elevation and no shadow by default
- Name: Search was formerly known as open search bar
- Variants: Two official variants of search components: search bar and search view

*[image: M2 open search bar.]*
M2 open search bars were square and elevated

*[image: M3 search bar.]*
M3 search bars are rounded, use tonal surface, and support dynamic color

## Specs

### Variants

*[video: Typing “Ping” into a search bar reveals a list of email results.]*
When a person executes a **search**, results appear in a list below the search bar

| Variant | M3 | M3 Expressive |
|---|---|---|
| Search | Available | Available |

### Configurations

#### Style

Search comes in two styles:

- Contained: Has an expressive look and feel. It uses a filled container to separate a search bar from a list of suggestions or results
- Divided (baseline): Doesn’t have the latest visual style, motion, or flexibility

*[image: An email inbox search bar in a contained style.]*
The contained style has a persistent, filled container, expressive motion, and rounded shape

*[image: An email inbox search bar in a divided style.]*
The divided (baseline) style uses a divider to separate the search bar from suggestions and results

#### Layout

Search suggestions and results appear in customizable lists, with two layout options: full-screen and docked. [More on search layouts](https://m3.material.io/components/search)

*[image: Full-screen search results with a search bar in the contained style.]*
Full-screen layout in the contained style

*[image: Docked search results with a search bar in the contained style.]*
Docked layout in the contained style

*[image: Full-screen search results with a search bar in the divided style.]*
Full-screen layout in the divided style

*[image: Docked search results with a search bar in the divided style.]*
Docked layout in the divided style

| Category | Configuration | M3 | M3 Expressive |
|---|---|---|---|
| Style | Contained | -- | Available |
|  | Divided | Available | Not recommended. Use contained. |
| Layout | Docked, full-screen | Available | Available |

### Tokens & specs

Use the table's menu to select a token set. The **search bar** set only contains tokens for the unfocused search bar. The **search view** set contains all other tokens when interacting with search, including all styles and layouts. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[Token table (measurements, color, shape): `tokens__components__search.md` — Search - Bar, Search - View]*

### Anatomy

Search includes a search bar and a container for suggestions and results. The container is empty by default. Use the list component to add content. In the divided (baseline) style, a divider separates the search bar and results.

*[image: 6 elements of search.]*
1. Search bar container
2. Leading icon
3. Supporting text
4. Trailing icon and avatar (optional)
5. Input text
6. Container for search suggestions or results

#### Examples

1. With avatar
2. With one trailing icon button
3. With two trailing icon buttons
4. With trailing icon button and avatar

*[image: 4 search bars with different trailing elements.]*

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value.

#### Full-screen layout

*[image: 6 full-screen search color roles in light and dark themes.]*
Full-screen search color roles used in light and dark themes:

1. Surface container low
2. On surface variant
3. On surface variant
4. Surface container high
5. On surface variant
6. On surface

#### Docked layout

*[image: 6 docked search color roles in light and dark themes.]*
Docked search color roles used in light and dark themes:

1. Surface container high
2. On surface variant
3. On surface variant
4. Surface container high
5. On surface variant
6. On surface

### States

States are visual representations used to communicate the status of a component or an interactive element. In [focused search](https://m3.material.io/components/search), individual elements maintain their own interaction states. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

#### Search bar

*[image: 4 search bar states in light and dark mode.]*
1. Enabled
2. Hovered
3. Focused
4. Pressed (ripple)

#### Search suggestions & results

Search includes a container for suggestions and results. The container is empty by default. Use the list component to add content.

*[image: 4 search result states in light and dark mode.]*
1. Enabled
2. Hovered
3. Focused
4. Pressed (ripple)

### Measurements

#### Search bar

*[image: Search bar with leading and trailing icon size and padding measurements.]*
Unfocused search bar with leading and trailing icon measurements

*[image: Search bar with trailing avatar size and padding measurements.]*
Unfocused search bar with avatar measurements

In M3 Expressive, the search bar expands when focused. The margins change from 24dp to 12dp.

*[image: Unfocused search bar margins of 24dp.]*
Unfocused search bar margin measurements

*[image: Focused search bar margins of 12dp.]*
Focused search bar margin measurements

| Element | Attribute | Value |
|---|---|---|
| Container | Width | Min: 360dp, max: 720dp |
| Height | 56dp |  |
| Label alignment | Start-aligned |  |
| Leading padding | Unfocused: 24dp, focused: 12dp |  |
| Trailing padding | Unfocused: 24dp, focused: 12dp |  |
| Leading icon and label padding (from tap target) | 4dp |  |
| Label and trailing icon padding (from tap target) | 4dp |  |
| Avatar | Size | 30dp |

#### Focused search

##### Contained style

*[image: Full-screen layout size and padding measurements in contained style.]*
Full-screen search padding and size measurements for contained style

*[image: Docked layout size and padding measurements in contained style.]*
Docked search padding and size measurements for contained style

| Element | Attribute | Value |
|---|---|---|
| Full-screen container | Width | Full width |
| Height | Full height |  |
| Docked container | Width | Min: 360dp, max: 720dp |
| Height | Min: 240dp, max: 2/3 of screen height |  |
| Search bar container | Height | 56dp |
| Label alignment | Start-aligned |  |
| Leading padding | 16dp |  |
| Trailing padding | 16dp |  |
| Leading icon and label padding (from tap target) | 4dp |  |
| Leading icon and label padding (from tap target) | 4dp |  |

##### Divided style

*[image: Full-screen layout size and padding measurements in divided style.]*
Full-screen search padding and size measurements for divided style

*[image: Docked layout size and padding measurements in divided style.]*
Docked search padding and size measurements for divided style

## Guidelines

*[video: A mobile UI search with hinted text “Search recipes”, “Mexican dishes” is entered, and a list of recipe results appear.]*
When focused, a search bar can show a list of search suggestions. As text is entered, search results appear.

### Usage

Search helps people find information quickly.<br><br>Use search for products with many items to manage, such as files or messages.

*[image: Mobile UI shows a search bar at the top of a message inbox.]*
Search helps people find information in large inboxes like messages or emails

#### Different ways to search

The search entry point is dependent on a product’s needs, and should be easy to find:

- Search bar: Use to search contents in a specific view, like **Search your messages**
- Search app bar: Use this app bar variant when search is the primary, global function
- Search icon button: Use when search is a secondary action or not the main focus

*[image: A mobile app with a search bar below the page title.]*
Add a **search bar** below a title to search specific content

*[image: A mobile app with a search app bar.]*
For global search, use a persistent **search app bar**, integrated into an app bar

*[image: A mobile app with a magnifying glass icon on the leading side of the app bar.]*
Use a **search** **icon button** when search is a secondary action

#### Focused search

When a search entry point is selected, it opens focused search.

- Search suggestions can appear before text is entered
- Search results can show as someone is typing or after a search is executed
- Individual elements maintain their own interaction states when search is focused

[More on search states](https://m3.material.io/components/search)

*[image: Focused search with a list of suggestions on a mobile screen.]*
When focused, a search bar expands to show search suggestions or results in a list

If search is the primary action, focused search can be a standalone destination reached from a navigation bar.

*[image: Focused search on a mobile screen with a list of suggested contacts.]*
Focused search can be a standalone destination, reached by selecting an item in a navigation bar

#### Search suggestions & results

Search suggestions and results both appear in a list component by default.<br><br>To help people find information quickly, consider adding variety and context, such as:

- Leading icons related to suggestions
- Category labels, like **Recent**, **Contacts**, or **Suggestions**
- Avatars or other high-priority items
- Filter chips to narrow down results

*[image: Search with suggestions organized in a column, ending with a row of 5 contact avatars with names.]*
Include high-priority items like avatars in search suggestions or results

#### Gaps

Use gaps to separate a list of suggestions or results into groups.<br><br>[More on using gaps in lists](https://m3.material.io/components/lists)

*[image: A gap separates the location and calendar list items from people and pets avatars.]*
To separate list items into distinct groups, use a gap

### Placement

A search bar is typically placed at the top of a screen to remain prominent and accessible. Its location depends on whether search is the primary focus of a product or a secondary action.

*[image: Mobile UI with a search bar directly below a Settings headline.]*
A search bar can be the primary focus of a page

*[image: Mobile UI with a search bar centered at the top of the screen, above a row of Favorites avatars.]*
Search bars should usually be placed at the top of the content

*[image: A photos app with a search icon.]*
Search can be a secondary action

#### Focused search layouts

When focused, search suggestions and results appear in a list below the search bar.  <br><br>There are two layout options:

- **Docked** opens a list below the search bar, with a scrim covering main content
- **Full-screen** expands to fill the screen

[More on adaptive design](https://m3.material.io/components/search)

*[image: Tablet UI shows a list of search results docked below the search bar.]*
Docked layout on a tablet

*[image: Mobile UI shows a list of search results filling the screen.]*
Full-screen layout on mobile

### Anatomy

*[image: 6 elements of search.]*
1. Search bar container
2. Leading icon
3. Supporting text
4. Avatar or trailing icon (optional)
5. Input text
6. Container for search suggestions or results

#### Search bar container

In the contained style, the search bar container remains the same shape in both the unfocused and focused states. Avoid changing the container behavior. <br><br>The container’s margins should be:

- Unfocused: 24dp
- Focused: 12dp

In the divided (baseline) style, a divider separates the search bar and results.

*[image: Side-by-side comparison of a search container in unfocused and focused states.]*
Search bar containers have persistent, rounded corners

##### Container color

Search bars use the **surface container high** color role. This role applies when the screen background is white or a tonal **surface** color, ensuring the container has clear contrast.

*[image: 2 mobile UIs show search bars on white and tonal backgrounds.]*
Search bars use **surface container high** to provide clear contrast

Avoid using a **surface container high** color on a **surface container** background. This can cause the search bar to blend in, making it difficult for people to find.<br><br>To ensure proper contrast, use surface container roles that are more than one step apart.

*[image: A “surface container high” search bar on a “surface container” background.]* **⚠️ Caution**
Using a **surface container high** color on a **surface container** background reduces contrast and may affect accessibility

#### Icons & icon buttons

##### Leading icons

The leading side of a search bar should include either:

- A navigational icon button, such as a menu or arrow
- A non-functional search icon

*[image: A search bar on a tablet screen contains a non-functional search icon and a trailing avatar.]*
A search bar can contain a non-functional search icon

##### Trailing icons

A search bar should have one or two trailing icons or icon buttons.<br><br>Trailing actions can include:

- Additional modes of searching like voice search
- A separate high-level action such as current location or profile
- An overflow menu
- A decorative search icon

*[image: A search bar with 2 trailing icon buttons: a microphone and an overflow menu.]*
Use a maximum of two trailing icons

*[image: A search bar with a trailing microphone icon and avatar.]*
Combine an avatar with up to one other trailing icon button

*[image: Focused search with a trailing x icon to clear input text.]*
Focused search can show an optional **clear** icon to remove input text

#### Text

##### Hinted search text

Provide a short description of the information people can search, like **Search replies** or **Search your messages**.

##### Input text

When a person starts typing, the hinted text is replaced with the input text.

*[video: A search bar labeled “Search replies”. “Peanut is entered and “Quick results” appear.]*
Hinted search text is replaced when a search query is entered

### Adaptive design

The search bar position and alignment should scale with the layout, and stay close to the searchable content.<br><br>In most cases, a search bar should:

- Stay in its pane and scale in width accordingly
- Internal elements anchor to the left and right as the parent container scales

[More on applying layout](https://m3.material.io/foundations/layout/layout-overview)

*[video: A search bar keeps its layout region and scales with different window sizes and layouts.]*
Keep the search bar close to the content a person can search

#### Focused search

When focused, search can switch between showing suggestions or results in a:

- **Docked layout**: Best for medium and expanded windows
- **Full-screen layout**: Default for compact breakpoints

[More on search layouts](https://m3.material.io/components/search)

*[image: Search suggestions in docked and full screen layouts.]*
1. A docked layout on a large screen
2. A full-screen layout, the default for compact screens

Search suggestions or results should swap from full-screen in compact windows to docked in larger breakpoints.

*[video: Animation shows search suggestions adapting from full-screen on mobile to a docked layout as the window size increases.]*
Search suggestions and results should adapt to fit different window sizes

### Behavior

#### Focused search

When a search bar is selected, search becomes focused and can:

- Show historical suggestions before typing
- Show suggestions or results as someone is typing
- Wait to show suggestions or results until a search is queried

The **back** icon releases focus, dismisses any suggestions or results, and returns the search bar to its original state.

*[video: When a search bar is tapped, it becomes focused, and suggestions appear in a list.]*
When focused, a list of search suggestions can appear

*[video: A person searches a photo app. The back icon returns the search bar to its original state.]*
Focus is released when the back icon is selected

#### Scroll

Depending on needs, a search bar can:

- Scroll away with content, then reappear when a person begins scrolling up
- Remain fixed at the top of the screen

*[video: Scrolling up hides the search bar. It reappears when scrolling down.]*
A search bar can scroll up with content, then reappear when a person scrolls down

#### Search results

To execute a search, a person can:

- Type a query and press **Enter**
- Select a suggestion or result without querying a search

Search results appear in a list below the bar, and scroll beneath the bar.   <br><br>For accessibility, focused search needs a clear status indicator that it’s searching content, like a search icon or **Results** label. [More on search accessibility](https://m3.material.io/components/search)

*[image: “Peanut” is the entered search query and the first suggestion in the list.]*
Show search results in a compact, organized list, with an indicator like **Quick results**

When search results are queried, the input text should remain visible, but not in focus.

*[video: “Pla” is entered into the search bar, “Plants” is suggested and selected.]*
Search suggestions and results display in a list, and the input text remains visible

#### Predictive back

On Android, [predictive back](https://github.com/material-components/material-components-android/blob/master/docs/foundations/PredictiveBack.md) allows a person to swipe left or right on search.

- Search detaches from the screen edge to signal the full-screen layout will minimize
- The previous screen is revealed in a preview

[More predictive back design guidance](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)

*[video: Swiping left on search causes the Android screen to scale left.]*
The search surface and content scale back in the direction of the gesture

## Accessibility

### Use cases

People should be able to use assistive technology to:

- Navigate to and focus on a search bar
- View the hinted search text or persistent label
- Input text and complete a search
- Interact with a list of search suggestions and results
- Clear the input text

### Interaction & style

#### Autosuggest

When search suggestions and results appear, the screen reader must announce the change. This lets people know list items are available for selection.

*[image: Hinted search text and autocomplete results on a mobile screen.]*
Autocomplete results should be announced by the screen reader

### Initial focus

Initial focus lands on the first interactive element. This is often a leading icon button or text field. A leading icon button usually activates search directly or opens a navigation component.

*[image: Search bar with a focused leading icon.]*
Initial focus can land on a leading icon

*[image: Search bar with no leading icon. The text field is focused.]*
If there’s no leading icon, focus lands on the text field

### Keyboard navigation

| **Keys** | **Actions** |
|---|---|
| **Tab** or **Shift** + **Tab** | Navigate between interactive elements |
| **Space** or **Enter** | Activate the search text field for input |
| **Arrows** | Navigate between search result items |

### Labeling elements

The hinted search text should be used as the accessibility label describing the search bar.  <br><br>The role for the input field should be:

- Android: **Text field**
- iOS: **Search field**

*[image: Search bar with “Label: Search messages” and “Role: Text field”.]*
The accessibility label should match the hinted search text

Leading and trailing icon buttons should be labeled according to their [accessibility guidance](https://m3.material.io/components/icon-buttons).

*[image: A search bar with accessibility labels for its leading icon button and trailing avatar.]*
Use icon labels for icon buttons

Search suggestions and results use the list component. Screen readers automatically announce the results as a list.<br><br>For accessibility labels, follow the [list accessibility guidelines](https://m3.material.io/components/lists).

*[image: A search bar on mobile, showing search results in a list.]*
Search suggestions and results are created using lists
