<!-- Source: https://m3.material.io/components/carousel · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__carousel.md @ 3c0e291 -->

# Carousel

## Overview

- Contain visual items like images or video, along with optional label text
- Six layouts: Multi-browse, uncontained, uncontained multi-aspect ratio, hero, center-aligned hero and full-screen
- Layouts can be start-aligned or center-aligned
- Item visuals have a parallax effect when scrolled
- Items change size as they move through the carousel

*[video: A carousel being scrolled horizontally. Each carousel item changes shape as it scrolls.]*
Carousels can show items of various sizes

### Availability & resources

### Updates

**November 2025**

New carousel layout:

- Uncontained multi-aspect ratio

**2023**

Additional layouts and configurations:

- Uncontained
- Full-screen
- Centered carousels
- Hero carousel layout
- Multi-browse layout

*[image: Items of different widths in an uncontained multi-aspect ratio layout.]*
New carousel layout: uncontained multi-aspect ratio

### Differences from M2

This component is new in Material 3.

- **Shape**: Dynamic carousel items change shape when scrolled
- **Motion**: Carousel items move at a different speed than their content, creating a parallax effect
- **Interaction**: When scrolled, carousel items snap into place to maintain the same layout. Hero carousels swipe through one item at a time. Multi-browse carousels scroll through many items at once.

*[image: Carousel in a contained layout with a large item and a small item.]*
Hero carousels scroll through one large item at a time

### Research

The Material Research Team conducted two studies (quantitative and qualitative) with over 200 participants to understand their perspectives of five different carousel designs. The studies measured their understanding of how to interact with each carousel, their expectations of the number of items in each design, and how they expected carousels to be used.

**Summary of findings:**

- Participants thought carousels were a good way to explore many different kinds of content
- A previewed or squished item strongly indicated that there was more content to swipe through
- Participants expected around 10 items in a carousel that scrolled multiple items at once
- While some contexts were considered better for some carousel designs, all designs were considered similarly usable

## Specs

*[image: 4 elements of a carousel.]*
1. Container
2. Large carousel item
3. Medium carousel item
4. Small carousel item

### Tokens & specs

Browse the component elements, attributes, tokens, and their values.

*[Token table (measurements, color, shape): `tokens__components__carousel.md` — Carousel item]*

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: 2 color roles of a carousel.]*
Carousel color roles used for light and dark schemes:

1. Container
2. Surface

### States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](https://m3.material.io/m3/pages/interaction-states/overview)

*[image: 5 states of a carousel in light and dark schemes.]*
1. Enabled
2. Hovered
3. Focused
4. Pressed
5. Disabled

### Carousel item dynamic widths

All kinds of carousel items dynamically adapt to the width of the container.

Large items have a customizable maximum width that's used to optimally fit carousel items into the available space.

Small carousel items have a minimum width of 40dp and a maximum width of 56dp.

Items change size as they move through the carousel layout.

*[image: Measurements for a small carousel item.]*
Small carousel items have a minimum and maximum width

### Multi-browse

The multi-browse layout shows at least one large, medium, and small carousel item.

*[image: 4 elements of a multi-browse carousel layout.]*
1. Container
2. Large carousel item
3. Medium carousel item
4. Small carousel item

#### Measurements

*[image: Measurements of a multi-browse carousel layout.]*
Multi-browse carousels have padding on both sides of the container

| Attribute | Value |
|---|---|
| Alignment | Vertically centered |
| Leading/trailing padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Large item width | Dynamic, or user-set |
| Medium item width | Dynamic |
| Small item width | 40–56dp, dynamic |
| Item corner radius | 28dp |

### Uncontained

The uncontained layout shows items that scroll to the edge of the container.

*[image: 4 elements of an uncontained carousel layout.]*
1. Container
2. Large carousel item

#### Measurements

*[image: Measurements of an uncontained carousel layout.]*
Uncontained carousel items bleed over the padding on each side when scrolling

| Attribute | Value |
|---|---|
| Alignment | Vertically centered |
| Leading padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Item corner radius | 28dp |

### Uncontained mutli-aspect ratio

The uncontained multi-aspect ratio layout shows carousel items of various widths.

*[image: 4 elements of an uncontained carousel layout]*
1. Container
2. Carousel item (16:9)
3. Carousel item (9:16)
4. Carousel item (1:1)
5. Carousel item (3:4)

#### Measurements

Uncontained multi-aspect ratio carousels only have leading padding, with 8dp of padding between items.

| Attribute | Value |
|---|---|
| Alignment | Vertically centered |
| Leading padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Item corner radius | 28dp |

### Hero

The hero layout shows at least one large item and one small item.

*[image: 3 elements of a hero carousel layout.]*
1. Container
2. Large carousel item
3. Small carousel item

#### Measurements

*[image: Measurements of a hero carousel layout.]*
Hero carousels have padding on both sides of the container

| Attribute | Value |
|---|---|
| Alignment | Vertically centered |
| Leading/Trailing padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Large item width | Dynamic |
| Small item width | 40-56dp, dynamic |
| Item corner radius | 28dp |

### Center-aligned hero

The center-aligned hero layout shows at least one large item and two small items.

*[image: 3 elements of a center-aligned hero carousel layout.]*
1. Container
2. Large carousel item
3. Small carousel item

#### Measurements

*[image: Measurements of a center-aligned hero carousel layout.]*
Center-aligned hero carousels have padding on both sides of the container

| Attribute | Value |
|---|---|
| Alignment | Vertically centered |
| Leading/Trailing padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Large item width | Dynamic |
| Small item width | 40-56dp, dynamic |
| Item corner radius | 28dp |

### Full-screen

The full-screen layout shows one edge-to-edge large item.

*[image: 2 elements of a full-screen carousel layout.]*
1. Container
2. Large carousel item

#### Measurements

*[image: Measurements of a full-screen carousel layout.]*
Full-screen carousels fill the window edge-to-edge

| Attribute | Value |
|---|---|
| Alignment | Centered |
| Leading/Trailing padding | 0dp |
| Top/bottom padding | 0dp |
| Padding between elements | 16dp |

## Guidelines

*[image: Carousel items adapting dynamically to device size by shrinking and reducing in number.]*
Carousel items adapt dynamically based on breakpoint

### Usage

Carousels display a scrollable list of items. Carousel items emphasize visuals, but can also contain brief text that adapts to the item size.

There are four carousel layouts:

- Multi-browse
- Uncontained
- Hero
- Full-screen

All of these layouts can be centered, though center-aligned hero is the most common centered carousel.

Carousels can scroll in two ways:

- **Default**: Standard scrolling. Recommended for uncontained layouts.
- **Snap-scrolling**: Scrolled items snap to the carousel's layout. Recommended for multi-browse, hero, and full-screen layouts

*[image: Contained carousel with a large, medium, and small item. Text is hidden on the small item.]*
A carousel can contain different sized items

Choose the best carousel layout for your product. Some layouts are more visual-focused, while others are more customizable.

| Layout | Best used for |
|---|---|
| [Multi-browse](https://m3.material.io/components/carousel) | Browsing many visual items at once (like photos), dynamic designs |
| [Uncontained](https://m3.material.io/components/carousel) | Highly-customized or text-heavy carousels, stacked imaged and text, traditional carousel behavior |
| [Hero](https://m3.material.io/components/carousel) | Spotlighting very large visual items (like a movie or featured app) |
| [Center-aligned hero<br>](https://m3.material.io/components/carousel) | Centered, large visual items |
| [Full-screen<br>](https://m3.material.io/components/carousel) | Vertically-scrolling video or image feeds, immersive experiences |

Carousel items must be fully visible on-screen (except for the uncontained layout). When scrolled, items automatically change size and snap into place to maintain the same layout.

*[image: Multi-browse carousel with all images and text easily legible.]* **✅ Do**
Set the large carousel item size to ensure the images and text are easy to read and recognize

*[image: Multi-browse carousel with a very thin small item, making the image unrecognizable.]* **❌ Don't**
Avoid setting carousel items so small that the image isn't recognizable

#### Accessibility requirements on scrolling pages

On vertically-scrolling pages, carousels require an accessible way to view all the items without horizontally scrolling. (This requirement doesn't apply to full-screen carousels.)

Material recommends adding a **Show all** button below the carousel, which opens a dedicated vertically-scrolling page of all carousel items.

If the carousel has a header, you can use an arrow icon button instead.

View the [accessibility tab](https://m3.material.io/components/carousel) for more details and alternate solutions.

*[video: Carousel on mobile has a "show all" button that opens a page with all carousel items.]*
Make sure users can scroll vertically through all carousel items

#### Multi-browse

The multi-browse layout is best for browsing many items at once, like photos or event feeds. Snap-scrolling is recommended to ensure items are recognizable and consistently sized.

On larger screens, more large and medium items are visible in this layout.

Avoid using this layout if the carousel items need lots of text or have complicated imagery.

*[video: Swiping a multi-browse carousel with snap-scrolling. Items adjust size to fit the layout.]*
A multi-browse layout has different sized items within the carousel

At compact breakpoints, only show up to three carousel items if they have text.

If you need to show more than three items, make sure the images and content are easy to understand and recognize.

*[image: Carousel on a phone. 2 large, 1 medium, and 1 small item are fully visible but thin. The items don't have text.]* **⚠️ Caution**
At compact breakpoints, only show more than three items if the items are easy to understand and recognize

#### Uncontained

The uncontained layout is most similar to a traditional carousel, where items are a single size and flow past the edge of the screen.

Both default scrolling and snap-scrolling work well with this layout.

Since items don't change size, this layout can be customized to show more text or other UI above or below each item without the text being masked or cropped.

*[video: Swiping an uncontained carousel with default scrolling. Items scroll to the edge and can stop anywhere.]*
Carousel items are all the same size in an uncontained layout

#### Uncontained multi-aspect ratio

The uncontained multi-aspect ratio carousel has the same layout as the uncontained carousel but contains items of various sizes.

Item widths can range anywhere between 9:16 for min width size to 16:9 for max width.

Only use this carousel layout if the items have various widths.

*[video: Swiping an uncontained carousel with default scrolling. Items scroll to the edge and can stop anywhere.]*
Carousel items are of various sizes in an uncontained multi-aspect ratio layout

#### Hero

The hero layout is best for spotlighting content that needs more attention, like movie, shows, or other media thumbnails. It highlights one large image to focus on, while providing a sneak peek of what’s next.

On larger screens, more large items are visible.

Use snap-scrolling so users can easily cycle through items one at a time.

*[video: Swiping a hero carousel with snap-scrolling. Items adjust size to fit the layout.]*
A hero carousel at a compact breakpoint should show one large item and one small item

#### Center-aligned hero

When the hero layout is center-aligned, it adds an additional previewed item on the leading edge, making the large carousel item centered.

*[video: Swiping a center-aligned hero carousel with snap-scrolling. Items adjust size to fit the layout.]*
A centered hero carousel has two small carousel items, with a large item centered

#### Full-screen

The full-screen layout is best used for immersive experiences like video articles, featured headlines, or items that are visually rich. It can contain text and other UI elements on top of the image.

This layout works best with content that is taller than it is wide, and scrolls vertically. It only works in portrait orientation in compact and medium breakpoints. Don't use this layout in landscape orientation.

Use snap-scrolling for full-screen layouts. Don't use default scrolling.

*[video: Vertically swiping a full-screen carousel with snap-scrolling. Items fit edge-to-edge.]*
Full-screen carousels fill the entire content area of the screen

### Anatomy

*[image: 4 elements of a carousel.]*
Multi-browse carousel (left) and hero carousel (right):

1. Container
2. Large carousel item
3. Medium carousel item
4. Small carousel item

#### Container

The carousel container holds all carousel items. The number of carousel items visible in the container can change based on the carousel layout and breakpoint.

*[image: An empty rectangle representing a carousel container.]*
The carousel container is a rectangle. It can be used in many ways and stretched to any size.

#### Carousel items

Carousel items hold content. A carousel item has no fixed width; it changes width depending on the breakpoint or its position in the carousel's layout. There are three dynamic widths an item can be: **large**, **medium**, and **small**.

*[image: 3 sizes of carousel items.]*
1. Large carousel item
2. Medium carousel item
3. Small carousel item

Large items have a max width that can be adjusted. This changes how all other large, medium, and small carousel items fit on screen. Large items must remain big enough to be easy to understand and recognize.

Medium items adjust width dynamically to the carousel size and available space.

Small items have a width range of 40–56dp.

*[image: 2 sizes of carousel items for hero layouts.]*
1. Large item
2. Small item

When the large item's max width is narrow enough, more items can be shown on screen at once. At compact breakpoints, this is only recommended for carousels with simple imagery.

*[image: 3 sizes of carousel items for multi-browse layouts. 2 large items are visible.]*
1. Large item
2. Medium item
3. Small item

#### Item text (optional)

Carousel items are primarily visual. Item text is optional and should be brief.

If your carousel items require a lot of text, consider using the **uncontained layout**, which can show more information, or use a series of cards instead.

*[image: Contained carousel items with 5 lines of content: a title, a description, and a label.]* **⚠️ Caution**
Avoid exceeding two lines of text in carousel items at compact breakpoints unless the background is simple, like a single color

Content within a carousel item can adapt dynamically based on the container and breakpoint.

Text should always be understandable at each size. Consider adapting the text to use brief labels on smaller carousel items.

*[image: A carousel item at 3 different sizes to show  how text changes at each size.]*
1. Large carousel item with the full title and label text
2. Medium carousel item hiding the title text
3. Small carousel item abbreviating the label text

### Adaptive design

As the carousel container size increases, so do the number of carousel items visible at a time.

At compact breakpoints, carousels can comfortably show up to three carousel items at once.

At larger breakpoints, more carousel items are added and scale in size.

Full-screen carousels only ever show one item at once.

*[image: 8 carousel items visible at once on a tablet in landscape orientation.]*
Carousels can show more items at once on larger screens

### Behavior

#### Scrolling

Carousel items have a parallax effect when they're scrolled.

The **default** scrolling behavior doesn't snap items to a layout grid. They can stop anywhere in the container. Only use this for the uncontained layout.

The **snap-scrolling** behavior aligns carousel items to the layout grid after they're scrolled. Items snap to the grid when released. Use this for multi-browse, hero, and full-screen layouts.

*[video: Multi-browse carousel with snap-scrolling. Items slot into the layout once scrolled.]*
Carousel items with snap-scrolling maintain the same layout when released

In full-screen layouts, make sure the carousel items snap to the edges of the carousel container. Avoid letting them scroll freely or stop halfway.

Full-screen layouts must use snap-scrolling.

*[image: Full-screen carousel with items stopping halfway off screen once scrolled.]* **❌ Don't**
Avoid scrolling freely on full-screen carousels

## Accessibility

### Use cases

Users should be able to do the following with assistive technology:

- Navigate to the carousel container
- Navigate between different carousel items
- Activate a carousel item
- Skip over the carousel items

### Requirements on scrolling pages

On vertically-scrolling pages, carousels require an accessible way to view all the items without horizontally scrolling. (This requirement doesn't apply to full-screen carousels.)

Material recommends adding a **Show all** button below the carousel, which opens a dedicated vertically-scrolling page of all carousel items.

*[video: Carousel on mobile has a "show all" button that opens a page with all carousel items.]*
Carousels without headers should use a **Show all**button to view all carousel items

*[image: Measurements of a "show all" button added below a carousel.]*
The **Show all** button should have a padding of 4dp

If the carousel has a header, you can use an arrow icon button instead. Place the arrow icon directly next to the header or in the same row.

Make sure the header is also displayed on the page of all carousel items.

*[video: Carousels in a list on mobile with headers have an arrow icon that opens a page with all carousel items.]*
Carousels with headers should use an arrow to view all carousel items

*[image: Measurements of an arrow icon button added next to a carousel header.]*
Headers should align with the leading edge, and the arrow icon should have a size of 48dp

Avoid customizing the accessibility solution when possible. However, if your product needs an alternative solution, consider adding a **Show all** button in nearby navigation, or add alternative control buttons close to the carousel.

Avoid adding UI elements, like arrows or other icons, within or beside the carousel.

*[image: Arrow icons on the left and right of the carousel, reducing container width.]* **❌ Don't**
Avoid adding buttons into the carousel container or beside it. Place any buttons above or below the carousel.

*[image: Arrow icons floating on top of the carousel edge, concealing items.]* **❌ Don't**
Don't cover the carousel with buttons or other UI

### Interaction & style

#### Touch

Tapping on a carousel item changes the shape slightly, and creates a touch ripple for interaction feedback.

*[video: Carousel providing a ripple feedback when being tapped.]*
Touch: Tap

#### Cursor

The hover state provides a visual cue that the carousel item is interactive.

When the carousel item is clicked (in both active and inactive states), a ripple appears for interaction feedback.

*[video: Carousel changing state when hovered.]*
Cursor: Hover, click

#### Initial focus

When navigating to a carousel using assistive technology, use **Tab** to place initial focus on the first carousel item. Then, use **Tab** or the arrow keys to navigate the carousel items.

Use the up and down arrow keys to leave the carousel and focus on the next element on the page, like the **Show all** button.

*[image: Diagram of how to navigate a carousel using assistive technology.]* **✅ Do**
Set initial focus on the first carousel item, and use arrows to navigate items

*[image: Diagram of how not to navigate a carousel using assistive technology.]* **❌ Don't**
Avoid focusing on the carousel container

### Keyboard navigation

| Keys | Actions |
|---|---|
| **Tab**or **Arrows** | Moves to the previous or next carousel item |
| **Space** or **Enter** | Activates the focused carousel item |

### Labeling elements

The carousel container has the **container** role.

*[image: Accessibility labels of a carousel.]*
The carousel container is labelled appropriately and has the **container** role

Each carousel may have a different number of items, so the label reads out the total amount of items and the current item in focus.

*[image: Accessibility labels of a carousel item.]*
The carousel item label indicates the current item in focus and the total number of items

### Reduced motion

When reduced motion settings are turned on, the parallax effect should be removed and carousel items should no longer expand as they come into view. All items are the same size.

Make sure carousels with reduced motion reach the edges of the window to avoid clipping visuals.

*[video: Comparison of a multi-browse carousel with the reduced motion setting off and on.]*
1. Default carousel for multi-scroll
2. Carousel with reduced motion settings turned on

For hero carousels with reduced motion, the small carousel item is only partially shown on screen.

*[video: Comparison of a hero carousel with the reduced motion setting off and on.]*
1. Default carousel for single-scroll
2. Carousel with reduced motion settings turned on
