<!-- Source: https://m3.material.io/components/divider · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/components__divider.md @ 3c0e291 -->

# Divider

## Overview

- Make dividers visible but not bold
- Only use dividers if items can’t be grouped with open space
- Use dividers to group things, not separate individual items

*[image: Screen shot of five stacked dividers]*
Dividers separating items in a list

### Availability & resources

### Differences from M2

- Color: New color mappings and compatibility with dynamic color
- Configurations: Ability to have vertical dividers

*[image: Screen shot of three dividers]*
Dividers have new color mappings

## Specs

*[image: Diagram of divider set on horizontal line]*
1. Divider

### Tokens and specs

Browse the component elements, attributes, tokens, and their values.

*[Token table (measurements, color, shape): `tokens__components__divider.md` — Divider]*

### Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](https://m3.material.io/foundations/design-tokens)

*[image: Divider on light background and dark background.]*
Divider color roles used for light and dark schemes:

1. Outline variant

### Measurements

*[image: Divider's measurement.]*
Measurements

| Attribute | Value |
|---|---|
| Divider full-width | 100% |
| Divider inset left margin | 16dp |
| Divider inset right margin | 0dp |
| Divider middle-inset left margin | 16dp |
| Divider middle-inset right margin | 16dp |
| Space between divider & supporting-text | 4dp |
| Divider right margin | 8dp |
| Divider bottom margin | 8dp |

## Guidelines

*[image: Inbox app using full-width dividers to separate messages.]*
Full-width dividers

### Usage

Dividers are one way to visually group components and create hierarchy. They can also be used to imply nested parent/child relationships.<br><br>The divider can be used in two ways:

1. Full width
2. Inset

*[image: Inbox app using full-width dividers to separate messages.]*
Full-width divider

*[image: Music app using inset dividers to separate songs in a playlist.]*
Inset divider

### Anatomy

A divider is a simple line.

*[image: Illustration of a divider.]*
1. Divider

### Full-width dividers

Use full-width dividers to separate larger sections of unrelated content. They can be used directly on a surface or inside other components like cards or lists.<br><br>Full-width dividers can also separate interactive areas from non-interactive areas. <br><br>They are used to group visual elements together, and indicate when elements are related to each other from an interaction perspective.

*[image: Inbox messages visually separated by full-width dividers for improved readability.]*
Full-width dividers to indicate separation of content

*[image: Non-interactive information on a card and a clickable read more link separated by a full-width divider.]* **✅ Do**
Use full-width divider lines to separate interactive and non-interactive areas of a container such as a card

*[image: Full-width dividers used after every piece of content on a page.]* **⚠️ Caution**
Use full-width dividers sparingly. Too many divider lines will make an interface look cluttered.

### Inset dividers

Use inset dividers to separate related content within a section.<br><br>Inset dividers are equally indented from both sides of the screen by default.

*[image: 2 different content sections separated by an inset divider.]*
Inset dividers separate related content, such as emails in a list. They should be used with anchoring elements such as icons or avatars, and align with the leading edge of the screen.

*[image: 3 types of related content separated by inset dividers on a mobile screen.]*
Inset dividers in a list of related items

*[image: Inset divider separating body text and selection chips.]*
Inset dividers can be placed in the middle of a layout to separate elements such as body text from selection chips

#### Using dividers both ways on the same screen

If dividers are used both ways in a UI, they must reinforce the hierarchy of information within different sections.

1. To separate a different kind of content, use a full-width divider
2. To separate nested content items, use inset dividers

*[image: Dividers used to show content hierarchy: full-width for sections, inset for related items.]* **✅ Do**
Use a combination of inset and full-width dividers to reflect the hierarchy of information

List items with repetitive formats may not require an inset divider, in which using only the margin between items is acceptable.

*[image: List with repetitive item formats. Visual separation achieved through margins only.]* **✅ Do**
Content may not require a divider line

### Vertical divider

A vertical divider can be used to arrange content on a larger screen, such as separating paragraph text from video or imagery media.

*[image: Image and text side-by-side, separated by a vertical divider on a large screen.]*
Vertical divider in a large screen context

## Accessibility

Dividers are decorative elements, which have no contrast minimums.

*[image: Divider separating messages in an inbox that are already separated with type styles and spacing is annotated as decorative.]*
Decorative elements have no contrast minimums
