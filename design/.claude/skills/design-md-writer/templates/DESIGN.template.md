---
version: alpha
name: <Product name>
description: <One sentence describing the product and its visual identity>
colors:
  primary: "<#hex>"
  on-primary: "<#hex>"
  secondary: "<#hex>"
  on-secondary: "<#hex>"
  accent: "<#hex>"
  surface: "<#hex>"
  surface-variant: "<#hex>"
  on-surface: "<#hex>"
  on-surface-muted: "<#hex>"
  outline: "<#hex>"
  success: "<#hex>"
  warning: "<#hex>"
  error: "<#hex>"
  on-error: "<#hex>"
typography:
  headline-display: { fontFamily: "<Font>", fontSize: 48px, fontWeight: 700, lineHeight: 56px, letterSpacing: -0.02em }
  headline-lg: { fontFamily: "<Font>", fontSize: 32px, fontWeight: 600, lineHeight: 40px, letterSpacing: -0.01em }
  headline-md: { fontFamily: "<Font>", fontSize: 24px, fontWeight: 600, lineHeight: 32px }
  body-lg: { fontFamily: "<Font>", fontSize: 18px, fontWeight: 400, lineHeight: 28px }
  body-md: { fontFamily: "<Font>", fontSize: 16px, fontWeight: 400, lineHeight: 24px }
  body-sm: { fontFamily: "<Font>", fontSize: 14px, fontWeight: 400, lineHeight: 20px }
  label-lg: { fontFamily: "<Font>", fontSize: 16px, fontWeight: 500, lineHeight: 24px }
  label-md: { fontFamily: "<Font>", fontSize: 14px, fontWeight: 500, lineHeight: 20px }
  label-sm: { fontFamily: "<Font>", fontSize: 12px, fontWeight: 500, lineHeight: 16px, letterSpacing: 0.02em }
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.outline}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.outline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

# <Product name> Design System

<!-- Replace every <placeholder> and remove all HTML comments before delivery. -->

## Visual Theme & Atmosphere

<!-- 2–4 sentences: brand personality, overall feel, what the UI should evoke and what it must avoid. -->
<Product> feels <adjective>, <adjective> and <adjective>. <What the interface prioritizes, e.g. "content over chrome">. <What it avoids, e.g. "no decorative illustration in core flows">.

## Color Palette & Roles

<!-- For each color: role, when to use, when NOT to use. -->
- **primary**: <role>. Use for <usage>. Never for <misuse>.
- **accent**: <role>. At most <N> per screen, because <reason>.
- **surface / surface-variant**: <role of backgrounds and layering>.
- **on-surface / on-surface-muted**: <primary vs secondary text>.
- **outline**: <borders and dividers>.
- **success / warning / error**: status only, never decorative.

Dark mode: <how colors map in dark mode, or "not supported">.

## Typography

<!-- Hierarchy and usage rules per level. -->
- **headline-display**: <usage, e.g. marketing hero only>.
- **headline-lg / headline-md**: <page and section titles>.
- **body-lg / body-md / body-sm**: <reading text, default is body-md>.
- **label-lg / label-md / label-sm**: <buttons, form labels, metadata>.

Rules: <e.g. max 2 headline levels per screen; no all-caps except label-sm>.

## Components

<!-- Key components with all states: default, hover, pressed, focus, disabled. -->
### Buttons
- Primary: <description>. Hover: <change>. Pressed: <change>. Focus: <focus ring spec>. Disabled: <treatment>.
- Secondary: <description and states>.

### Inputs
- <default, focus, error, disabled states; label and helper text placement>.

### Cards
- <structure, padding, when to use a card vs plain list>.

### Navigation
- <top bar / tab bar / sidebar rules>.

## Layout & Spacing

<!-- Grid, max widths, spacing rhythm. -->
- Grid: <columns, gutters>.
- Max content width: <value>.
- Spacing between sections: <token>. Between related elements: <token>.

## Depth & Elevation

<!-- Shadows, borders, layering. -->
- Level 0: <flat surfaces>.
- Level 1: <cards, e.g. border only or subtle shadow>.
- Level 2: <menus, popovers>.
- Level 3: <modals>.

## Do's & Don'ts

<!-- At least 10 concrete, verifiable rules. -->
Do:
- <rule>
- <rule>
- <rule>

Don't:
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>
- <prohibition>

## Responsive Behavior

<!-- Breakpoints and how layout adapts. -->
- Mobile (< <value>): <behavior>.
- Tablet (<value>–<value>): <behavior>.
- Desktop (> <value>): <behavior>.

## Agent Prompt Guide

<!-- Direct instructions for AI agents generating UI. -->
When generating UI for <Product>:
1. Use only the tokens defined above. Never introduce new colors, sizes or radii.
2. <Instruction>.
3. <Instruction>.
4. If something is not defined here, <what to do, e.g. choose the closest existing token and flag it>.

Intentionally undefined: <list what is deliberately not specified>.
