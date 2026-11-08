# Design system: variables, styles, components

## Contents
1. 3-tier token architecture
2. Names and value scales
3. Modes: theme, brand, density, language
4. Variables or Styles?
5. Component anatomy and construction
6. Variants and component properties
7. Minimum component set per platform
8. Libraries, publishing and governance

---

## 1. 3-tier token architecture

```
Primitives  (raw values, 1 mode, hidden from the picker)
   color/blue/600 = #2563EB      space/4 = 16      radius/3 = 12
        │ alias
Semantic    (roles, with modes)
   color/action/primary  → Light: blue/600 | Dark: blue/400
   color/text/primary    → Light: gray/900 | Dark: gray/50
   space/inset/md        → space/4
        │ alias (only when needed)
Component   (specific to one component, when it needs independent customization)
   button/primary/bg     → color/action/primary
```

Rules:
- Layers **bind only to Semantic** (or Component) tokens. Never bind a Primitive directly — otherwise dark mode and brand switching won't apply.
- Set Primitives to `scopes = []` so they don't appear in the picker; give **every** Semantic token the correct scope (fill, text, stroke, gap, radius, font size, stroke weight…). A Semantic token left at `scopes = []` is hidden from designers and is treated as a primitive by the audit. Only prototype-only tokens (duration, easing) stay at `[]`.
- Semantic and Primitives may share a name (`space/4` in both); a bare `{var: "space/4"}` binds the Semantic one.
- Add the Component tier only when a component must change independently of the system (e.g. the brand allows the CTA button its own color). Don't pre-create it for every component — it triples the maintenance load.

## 2. Names and value scales

### 2.1 Minimum Semantic colors
| Group | Token |
|---|---|
| `color/bg/` | `default`, `subtle`, `inverse` |
| `color/surface/` | `default`, `raised`, `overlay`, `sunken` |
| `color/text/` | `primary`, `secondary`, `tertiary`, `disabled`, `inverse`, `on-action` |
| `color/icon/` | `primary`, `secondary`, `disabled`, `inverse` |
| `color/border/` | `default`, `subtle`, `strong`, `focus` |
| `color/action/` | `primary`, `primary-pressed`, `secondary`, `destructive`, `disabled` |
| `color/feedback/` | `success`, `warning`, `error`, `info` (+ `-subtle` for backgrounds) |

### 2.2 Primitive color palette
Each brand color and gray: 10–12 steps (50, 100 … 900, 950). Generate them in a perceptually uniform color space (OKLCH) so steps are evenly spaced in lightness — avoiding "muddy" middle steps from RGB interpolation.

### 2.3 Typography
Suggested scale (mobile); each step is a text style with a role name:

| Style | Size / line | Weight |
|---|---|---|
| `display` | 34 / 41 | Bold |
| `title/lg` | 28 / 34 | Bold |
| `title/md` | 22 / 28 | Semi Bold |
| `title/sm` | 20 / 25 | Semi Bold |
| `body/lg` | 17 / 22 | Regular |
| `body/md` | 15 / 20 | Regular |
| `label` | 13 / 18 | Medium |
| `caption` | 12 / 16 | Regular |

- iOS: follow the Dynamic Type text styles (Large Title, Title 1–3, Headline, Body, Callout, Subheadline, Footnote, Caption 1–2) so dev can map 1-to-1.
- Android: follow the Material 3 scale (Display / Headline / Title / Body / Label × L/M/S).
- Web: 16px body, scale ratio 1.2–1.25.
- Line-height in multiples of 4 where possible. Letter spacing = font size × 2.5 % for every size (designer standard; e.g. 16 → 0.4).
- Font family, weight and size can be variables (string/number) to switch by brand or density.

### 2.4 Numbers
| Group | Scale |
|---|---|
| `space/` | 0, 0.5(2), 1(4), 2(8), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40), 12(48), 16(64) |
| `radius/` | none 0, sm 4, md 8, lg 12, xl 16, 2xl 24, full 999 |
| `border-width/` | thin 1, thick 2 |
| `size/icon/` | sm 16, md 20, lg 24 |
| `size/touch/` | min 44 (iOS) / 48 (Android) |

### 2.5 Elevation and motion
- Elevation: 3–4 shadow steps as effect styles (`elevation/1…4`); in dark mode, also use progressively lighter surface colors instead of shadows alone.
- Motion: `duration/fast 150ms`, `duration/base 250ms`, `duration/slow 400ms`; easing `standard`, `decelerate` (enter), `accelerate` (exit), `spring` (drag interactions). Store as number variables + easing documentation.

## 3. Modes

| Collection | Common modes |
|---|---|
| Semantic color | Light, Dark (+ High contrast if needed) |
| Brand | Brand A, Brand B (white-label) |
| Density / Size | Compact, Default, Comfortable |
| Content (string) | vi, en — to test text length |

- Set the mode at the frame/Section level: the whole screen switches, no need to duplicate screens.
- Every mode must **have a value for every variable** — a mode missing a value falls back to the default and causes hard-to-spot bugs.
- Prototypes can switch modes at runtime (e.g. a dark mode toggle).

## 4. Variables or Styles?

| Use a **Variable** | Use a **Style** |
|---|---|
| Solid colors, numbers (spacing, radius, size), strings, booleans | Gradients, multiple fill layers, images |
| Need modes (theme, brand, density) | Complex effects (shadow, blur) |
| Need to be used in prototype logic | Full text styles (bundling many properties) |
| | Layout grids |

Text styles remain the best way to package typography; inside a text style you can bind variables for font size/family/weight.

## 5. Component anatomy and construction

### 5.1 Build process
1. **Search first** in the library. If it exists → use/extend it.
2. **Anatomy:** diagram the parts (container, leading icon, label, trailing icon, badge…), noting which are required/optional.
3. **Auto Layout frame:** container → child rows, set Hug/Fill correctly, bind padding/gap to tokens.
4. **Bind tokens** for every fill, stroke, text, radius, spacing.
5. **Properties** (section 6) — prefer properties over variants.
6. **States**, the full set (section 6.3).
7. **Component description:** when to use, when not to use, documentation link.
8. **Test in the Playground:** long label, no icon, two lines, large text size, dark mode, another language.

### 5.2 Principles
- A **base component** (hidden, name starting with `_` or `.`) holds the shared structure; public variants use instances of the base → edit once, apply everywhere.
- Minimum touch target 44/48 even if the visible part is smaller (add transparent padding or a touch-target frame).
- No outer margins inside a component — spacing between components is decided by the parent.
- **Slots:** reserve customizable content regions with an instance-swap property pointing to a placeholder (or the slot feature if your Figma version has it), instead of creating a variant for every content combination.

## 6. Variants and component properties

### 6.1 Choosing a property type
| Need | Use |
|---|---|
| Change text | **Text** property |
| Show/hide an element | **Boolean** property |
| Swap an icon / child block | **Instance swap** property (with preferred values) |
| Change structure or several attributes at once (size, style, state) | **Variant** |
| Theme, brand, density | **Variable mode** — not a variant |

### 6.2 Names
- Property: short noun, Title Case: `Size`, `Style`, `State`, `Has icon`, `Label`, `Icon`.
- Value: `sm/md/lg`, `Primary/Secondary/Tertiary/Destructive`, `Default/Pressed/Disabled/Loading`.
- Consistent across the whole library: if Button uses `Size=md`, Input also uses `Size=md`, not `Medium`.

### 6.3 States by component type
| Component | States |
|---|---|
| Button | Default, Pressed (mobile) / Hover (web), Focused, Disabled, Loading |
| Input | Empty, Filled, Focused, Error, Disabled, Read-only (+ helper text, counter) |
| Toggle/Checkbox/Radio | Off/On (+ Indeterminate for checkbox) × Default/Disabled |
| List row | Default, Pressed, Selected, Disabled, Swipe actions |
| Card | Default, Pressed, Skeleton/Loading |

### 6.4 Preventing variant explosion
Estimated variant count = product of variant values. If > ~50 for one component: move some to boolean/instance-swap/mode, or split into two components.

## 7. Minimum component set

**Common:** Icon, Text link, Button, Icon button, Input, Text area, Select/Picker, Checkbox, Radio, Toggle, Chip/Tag, Badge, Avatar, Divider, Card, List row, Empty state, Toast/Snackbar, Dialog/Alert, Skeleton, Progress, Tooltip (web).

**iOS additions:** Navigation bar (inline/large title), Tab bar, Sheet (detents), Segmented control, Search field, Context menu, Swipe actions. Base them on Apple Design Resources where possible — don't redraw system controls from scratch.

**Android additions:** Top app bar, Navigation bar/rail, FAB, Bottom sheet, Snackbar, M3 Chips. Base them on the Material 3 Design Kit.

**Web additions:** Header/Nav, Sidebar, Breadcrumb, Table, Pagination, Tabs, Modal, Dropdown menu.

## 8. Libraries, publishing and governance

1. **Publish** the library with a clear change description: what was added, what changed, whether there are breaking changes.
2. **Semantic versioning** in the description: `2.3.0` (addition), `2.3.1` (fix), `3.0.0` (breaking — renamed property, removed variant).
3. **Don't rename a published property or variant value** without notice: instances in other files will lose their overrides.
4. **Deprecate before deleting:** rename to `⚠️ Deprecated / Button old`, note the replacement, keep it for at least one release cycle.
5. **Measure usage** (Library analytics if your plan has it): rarely used components → check whether they're redundant; many detaches → the component lacks flexibility.
6. **One owner** approves library changes; everyone else proposes via branches or comments.
