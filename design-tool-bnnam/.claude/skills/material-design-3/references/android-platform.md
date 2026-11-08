# Material 3 on Android — design summary

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/platform-material.md @ 3c0e291 — translated, complete

This is a quick-reading summary of how Material 3 shapes Android design. The verbatim Google pages in this folder
(`components__*`, `foundations__*`, `styles__*`, `tokens__*`) are the full source: **when this summary and a verbatim page differ,
the verbatim page wins.** Each section names the verbatim pages to open for detail.

## Contents
1. Android design characteristics with Material 3
2. Material 3 Foundations and Styles — in depth
3. Material 3 components — usage catalog

---

## 1. Android design characteristics with Material 3

### 1.1 Foundations
Material organises its foundations into:
- Accessibility.
- Content design.
- Customization.
- Design tokens.
- Interaction states.
- Layout / adaptive design.
- Building for all.

Verbatim: `foundations__overview.md`, `foundations__content-design__*.md`, `foundations__customization.md`, `foundations__design-tokens.md`,
`foundations__interaction__states.md`, `foundations__layout__*.md`, `foundations__building-for-all.md`.

### 1.2 Interaction states
Components must show these states consistently:
- Enabled.
- Disabled.
- Hovered.
- Focused.
- Pressed.
- Dragged.
- Selected — if the component supports selection.

Material recommends that a state uses **at least two visual indicators** to support accessibility. States can combine (e.g. selected + hovered).
A state layer must never destroy the contrast of the label/icon. Verbatim: `foundations__interaction__states.md`.

### 1.3 Shape
M3 Expressive extends the shape library to **35 shapes** plus **shape morphing**. Principles:
- Shape works together with typography and motion.
- Morph to express selection, progress, or a change of environment.
- You may create "tension" through round–square contrast, but never at the cost of clarity.
- Shape should not carry hard semantics unless there is a clear convention.
- Abstract shapes suit images, avatars, loading and decorative moments; use them sparingly in functional UI.

Verbatim: `styles__shape.md`.

### 1.4 Material 3 component inventory
- Buttons: button groups, common buttons, extended FAB, FAB menu, FAB, icon button, segmented button, split button.
- Date/time: date picker, time picker.
- Loading/progress: loading indicator, progress indicator.
- Navigation: navigation bar, drawer, rail.
- Sheets: bottom sheet, side sheet.
- Other: app bar, badge, card, carousel, checkbox, chips, dialog, divider, list, menu, radio button, search, slider, snackbar, switch, tabs,
  text field, toolbar, tooltip.

Each has a `components__<name>.md` page and a `tokens__components__<name>.md` token table (see the SKILL.md index).

### 1.5 Jetpack Compose and Views
- For new products, prefer the Material components for **Compose** where feasible, to get the newest theme, state, accessibility and adaptive behaviour.
- Do not assume every guideline has the same level of support across Compose, Android Views, Flutter and Web; check the implementation
  status of each component.
- Custom components must use the same semantics, minimum touch target, state indication and tokens as the system.

---

## 2. Material 3 Foundations and Styles — in depth

### 2.1 Accessibility by default
Material treats accessibility as a component default, but using components correctly does **not** automatically make the whole product accessible.
Verbatim: `foundations__overview.md`, `foundations__designing.md`, `foundations__usability.md`.

**Visual**
- Use the correct container / on-container role pair to keep contrast.
- Large text scale can make a component taller; never lock a height to the baseline mockup.
- The focus indicator must sit outside or inside the shape without being clipped.
- Selected, focused and error must not be distinguished by a single colour layer only.

**Motor**
- Minimum target **48dp**, with enough spacing to avoid mis-taps.
- Important actions must not depend on a fast gesture, precise dragging or a long press.
- Reordering has a Move up / Move down alternative action.
- Timeouts, auto-dismiss and auto-scroll must be controllable.

**Cognitive**
- Limit motion, flashing content and unexpected position changes.
- Multi-step flows keep a stable structure, title and progress.
- Errors use specific language and sit close to where the fix is needed.
- Defaults and suggestions must not make the user think a choice is mandatory.

**Assistive technology**
- Compose semantics need an appropriate role, state description, content description and custom actions.
- Do not set a content description on text that is already read aloud — it gets duplicated.
- Merge descendants deliberately; a row with several actions must not merge away the individual actions.
- Traversal order follows the task, especially in grids and multi-pane layouts.

### 2.2 Content design
Material content design focuses on clarity and information design. Verbatim: `foundations__content-design__*.md`, `foundations__writing.md`.
- Every screen title tells users where they are.
- A CTA states the outcome; don't use "OK"/"Submit" when a more specific word exists.
- Labels are short but not ambiguous; supporting text explains format or consequence.
- Error messages don't use a technical code as the main content.
- Empty states don't blame; give a next step where there is one.
- Write consistently: person/pronouns, capitalization, punctuation and terminology.
- On Android, **sentence case** usually reads more naturally than Title Case for controls and headings.

### 2.3 Customizing Material
Customise in this order (verbatim: `foundations__customization.md`):
1. Choose the color scheme and semantic roles.
2. Choose the typeface / type scale.
3. Choose the shape scale.
4. Choose the motion scheme.
5. Adjust component tokens, with a specific goal.

Don't:
- Redraw every component just to look "different from Google".
- Change shapes so that the affordance disappears.
- Use the brand color for every surface/action.
- Remove the state layer / ripple / focus because it doesn't fit the aesthetic.
- Change sizes so that a touch target drops below standard.

A successful theme is recognisably the brand while keeping Material's grammar.

### 2.4 Design tokens in detail
Example token chain (verbatim: `foundations__design-tokens.md`):

```text
md.ref.palette.primary40 = #6750A4
md.sys.color.primary = md.ref.palette.primary40
md.comp.button.filled.container.color = md.sys.color.primary
```

When switching to dark / high-contrast, the **system** token changes its reference while the **component** token keeps its name. Benefits:
- Design and code speak the same language.
- Global theme changes are controlled.
- It is easy to trace why a component has its current value.
- You can create platform aliases for iOS/Android while keeping the semantic core.

Naming rules:
- From general to specific.
- Name by role, not by temporary appearance.
- Distinguish container / content / state.
- Avoid tokens with duplicate meaning, or single-use tokens that add no governance value.

### 2.5 State system
Design states as a system, not as an afterthought (verbatim: `foundations__interaction__states.md`):

| State | Meaning | Usual signals |
|---|---|---|
| Enabled | Can be interacted with | Default color / shape / elevation |
| Disabled | Cannot be operated | Reduced emphasis, disabled semantics |
| Hovered | Pointer is over it | State layer / elevation / subtle shape change |
| Focused | Has keyboard / voice focus | Clear focus ring / state layer |
| Pressed | Touch/click is activating | Ripple / state layer / controlled scale |
| Dragged | Being moved | Elevation / opacity / placeholder at the old position |
| Selected | Chosen | Fill / icon / check / shape + semantics |
| Error | Data/state error | Error role + message + icon / announcement |

Disabled should not be the default way to prevent errors. If users don't understand the condition, letting them interact and then explaining is
usually more helpful.

### 2.6 Layout scaffold
The scaffold is the assembly frame (verbatim: `foundations__layout__scaffold.md`, `foundations__layout__layout-overview.md`):
- Bar regions: top / bottom app bar.
- Rail regions: navigation rail, toolbar or controls at the perimeter.
- Pane regions: primary, secondary, tertiary content.
- FAB / snackbar host.
- Insets and safety region.

The scaffold lets components change per breakpoint without changing the information architecture. Example:

| Window class | Typical assembly |
|---|---|
| Compact | Top app bar + one pane + navigation bar |
| Medium | Top app bar + one pane or two light panes + rail |
| Expanded | Rail/drawer + two-pane list-detail |
| Extra-large | Add a supporting / tertiary pane if it adds value |

### 2.7 Breakpoint strategy
Not every screen needs to support three panes. Choose by content (verbatim: `foundations__layout__breakpoints.md`, `foundations__layout__canonical-examples.md`):
- Dense list: stays one pane at medium to keep readability.
- Light settings: can be two panes at medium.
- Immersive task: stays one pane at expanded, on purpose.
- Dashboard: add columns but keep a readable group width.

Use height breakpoints only when vertical space is unusual, because most content can scroll. Still, landscape phones need special checks for the
keyboard and bottom controls.

### 2.8 Color roles
Main role groups (verbatim: `styles__color__roles.md`, `styles__color__system.md`):
- Primary / secondary / tertiary and their `on…` roles.
- Container variants for softer emphasis.
- Error / onError / errorContainer.
- Surface, surface variants / containers, and `onSurface`.
- Outline / outlineVariant.
- Inverse roles for elements that float over an inverted context.

Pairing principles:
- Content uses the `onX` matching container `X`.
- Never swap primary / onPrimary — contrast can be lost.
- Surface tone conveys elevation, but don't turn every layer into a completely different colour.
- Dynamic color personalises the theme, but semantic error and brand-critical colours must be protected.

### 2.9 User-controlled contrast
M3 supports **standard, medium and high** contrast. When building a theme:
- Don't only raise text contrast; icons, dividers, outlines and states must adapt too.
- Test that images / brand assets that don't change with the theme still work.
- Custom components must use the same semantic roles so they receive the contrast mode.
- High contrast must not destroy hierarchy by making everything too heavy.

### 2.10 Typography system
M3 type tokens usually consist of (verbatim: `styles__typography.md`):
- Font family.
- Font weight.
- Font size.
- Line height.
- Letter spacing / tracking.

Choose a role by purpose, not by the size you want. If the design needs another size, customise that role's token or create a meaningful product
role; avoid picking `headlineLarge` just because it "looks right".

Emphasized styles:
- Use for hero, editorial, and selected / high-priority moments.
- Don't replace baseline body/label styles wholesale.
- Variable fonts can adjust weight, width, grade, slant and optical size, but test performance and glyph coverage.

### 2.11 Shape scale and morph
The shape scale conveys personality and hierarchy (verbatim: `styles__shape.md`):
- Small radius for small / dense controls.
- Medium / large for cards, sheets, dialogs.
- Full shape for capsule / FAB / chip when the semantics fit.

M3 Expressive adds larger radii such as **20dp, 32dp, 48dp** and a library of abstract shapes. Not every product needs all of them.

Morph works well when:
- A button changes to the selected state.
- Loading / progress changes phase.
- A container expands from its source.

Morph works badly when:
- The shape change is unrelated to the action.
- It makes targets/labels shift in a way that is hard to follow.
- It is only for show and repeats continuously.

### 2.12 Elevation levels
Elevation supports (verbatim: `styles__elevation.md`):
- Content scrolling under the app bar.
- A FAB floating over a collection.
- A dialog standing in front of the app.
- A dragged item separating from its old position.

M3 uses tonal surfaces more than shadows. Shadows are still useful when the background is hard to distinguish or a lift needs to be suggested.
Keep few levels, and don't change a standard component's resting elevation without a reason.

### 2.13 Material Symbols
Four variable axes (verbatim: `styles__icons.md`):
- Weight.
- Fill.
- Optical size.
- Grade.

Grade changes heaviness with less effect on size than weight — useful for balancing against typography. Optical size optimises detail for the
display size. When animating fill/weight, make sure the state is still understood if motion is turned off.

### 2.14 Motion scheme
Verbatim: `styles__motion__overview.md`, `styles__motion__easing-and-duration.md`, `styles__motion__transitions.md`.

| Spring | Applies to | Overshoot |
|---|---|---|
| **Spatial spring** | Position, scale, rotation, corner radius | Can overshoot |
| **Effects spring** | Color, opacity | Usually no overshoot |

Speed:
- **Fast:** small elements or instant feedback.
- **Default:** most transitions.
- **Slow:** large / hero elements, but must not block the task.

The **Standard** scheme suits utilitarian, data-heavy products or ones that need calm. **Expressive** suits consumer, media, personalisation and
hero interactions. You can use Expressive product-wide and override with Standard in sensitive flows such as payment / confirmation to reduce the
playful feel.

### 2.15 Spacing token strategy
With an **8dp** base (verbatim: `styles__spacing.md`, `foundations__layout__grids-spacing.md`):
- Use whole multiples for large layout.
- A **4dp** half-step is allowed for small internal gaps.
- Don't turn the grid into a hard law when optical alignment needs adjusting.
- Tokens should have semantic aliases such as `space.component.gap.small`, not raw `8` / `16` scattered around.
- A density mode, if any, must change components, typography and targets together; never shrink the touch target.

---

## 3. Material 3 components — usage catalog

### 3.1 General principles for M3 components
A Material component is a starting point that already has anatomy, tokens, states and accessibility. When customising:
- Keep the correct semantics and interaction model.
- Theme through color / type / shape / motion tokens; don't edit individual instances.
- Check enabled, disabled, hovered, focused, pressed, dragged, selected, loading and error where applicable.
- Ensure a minimum target of **48×48dp**, including small icons.
- A state needs more than one signal when color alone isn't enough.
- Test the Compose implementation, because not every web / Views / Flutter component has the same Expressive version.

### 3.2 Buttons
Verbatim: `components__all-buttons.md`, `components__buttons.md`, `components__button-groups.md`, `components__split-button.md`,
`components__floating-action-button.md`, `components__extended-fab.md`, `components__fab-menu.md`, `components__icon-buttons.md`,
`components__segmented-buttons.md`.

**Common buttons**

| Type | Use |
|---|---|
| Filled | High-priority CTA |
| Filled tonal | Medium-important action, less contrast than primary |
| Elevated | Needs separation from a background with a similar surface |
| Outlined | Medium action or an alternative choice |
| Text | Low-priority action, usually in dialogs/cards |

Don't place several filled buttons side by side. Labels use verbs; avoid wrapping onto many lines. Loading must keep the button's size.

**Button group**
- Groups related actions and can react with shape on interaction.
- Use when the relationship between the buttons matters; don't group unrelated actions just to save space.
- Selected/pressed states must be clear and keyboard traversal sensible.

**Split button**
- The main part runs the default action; the secondary part opens a menu of variants.
- Use only when there is a clear default and the secondary actions are truly related.
- Don't use it if users have to open the menu almost every time.

**FAB and extended FAB**
- One screen-level primary action, usually create/compose.
- Extended FAB has a label — useful when the action is new or needs clarity; it can collapse on scroll as long as it stays discoverable.
- FAB menu opens a few actions of the same family; don't turn it into main navigation.
- Avoid the FAB covering list items, the snackbar, the keyboard or a bottom sheet.

**Icon button**
- For familiar actions in the app bar / toolbar.
- Tooltip on hover / long press when helpful.
- A toggle icon button must have a selected state and an accessible state description.

**Segmented button**
- Single-select to switch view/sort; multi-select for small filters.
- Short labels, few items; no long horizontal scroll.
- Selection isn't only a color change — add a check/icon/shape where appropriate.

### 3.3 Pickers
Verbatim: `components__date-pickers.md`, `components__time-pickers.md`.

**Date picker**
- Modal when it is a secondary task; docked/inline when the date must be compared with content.
- Support text entry when typing a distant date is faster than the calendar.
- A range must distinguish start/end and unavailable dates.
- Localise the calendar, first day of week, month names and format.

**Time picker**
- Choose 12/24-hour per locale/system.
- Pick the input mode: dial for visual choice, text for an exact value.
- Time zone and daylight saving must be clear in multi-region scheduling.

### 3.4 Loading and progress
Verbatim: `components__loading-indicator.md`, `components__progress-indicators.md`.

**Loading indicator**
- Short waits with unknown proportion.
- M3 Expressive gives it a prominent motion form; don't show many indicators at once.

**Progress indicator**
- Linear for progress tied to a wide region or sequential loading.
- Circular for small areas / actions.
- Determinate must reflect real progress; otherwise use indeterminate.
- Long processes get status text, plus cancel/retry when needed.

### 3.5 Navigation
Verbatim: `components__navigation-bar.md`, `components__navigation-rail.md`, `components__navigation-drawer.md`, `components__app-bars.md`,
`components__tabs.md`.

**Navigation bar**
- Compact phone, **3–5** top-level destinations.
- Icon + label aid recognition; the label doesn't change between selected/unselected.
- Keep each destination's back stack and scroll position.

**Navigation rail**
- Medium / expanded windows; placed at the leading edge.
- Collapsed or expanded depending on space and number of destinations.
- Can be combined with a FAB if the main action is app-wide.
- Don't use a rail just because the device is in landscape if the content is still too narrow.

**Navigation drawer**
- Modal drawer for compact/medium when many secondary destinations are needed.
- Standard drawer for expanded when navigation should be permanently visible.
- Important destinations stay easy to reach; the drawer is not a place for every setting/action.

**Top app bar**
- Small / center-aligned / medium / large according to hierarchy and scroll behaviour.
- Navigation icon only when there is a real back/drawer; don't use the menu icon as a logo.
- Frequent actions at the trailing side; less-used ones in overflow.
- Collapsing must keep the title and important actions.

**Tabs**
- Primary tabs for peer content groups within one destination.
- Secondary tabs for a deeper level.
- Fixed when there are few items; scrollable when there are many, but information scent must remain.
- Tabs don't replace the app-wide navigation bar.

### 3.6 Sheets
Verbatim: `components__bottom-sheets.md`, `components__side-sheets.md`.

**Bottom sheet**
- Modal: users must handle/close it before returning.
- Standard: shown alongside content; both can be interacted with.
- For secondary, context-bound content/actions — not for very long flows.
- Drag handle only when the sheet can change detent; swipe-to-dismiss must not lose data.

**Side sheet**
- Expanded / desktop; secondary content anchored to an edge, such as filters, details or an inspector.
- Modal if it blocks content; standard if it supports content continuously.
- Width and behaviour change per breakpoint.

### 3.7 Containment and content
Verbatim: `components__cards.md`, `components__carousel.md`, `components__lists.md`, `components__divider.md`.

**Card**
- One subject and its related actions.
- Elevated / filled / outlined chosen by background and hierarchy — don't mix arbitrarily.
- If the whole card is clickable, nested buttons need non-conflicting targets/semantics.
- Don't turn every row into a card when a list is clear enough.

**Carousel**
- Browse a visual collection; the next item is partly revealed to hint at scrolling.
- Not for content that must be seen or compared in full.
- Provide keyboard/focus support, page semantics, and no hard-to-control auto-rotation.

**List**
- One-line / two-line / three-line according to content; avoid being too dense.
- Leading/trailing supporting content has a clear meaning.
- Dividers per group; row targets large enough.
- A swipe action is never the only path.

**Divider**
- Use sparingly; spacing/surfaces often group better.
- Full-width or inset according to content alignment.

### 3.8 Selection controls
Verbatim: `components__checkbox.md`, `components__radio-button.md`, `components__switch.md`, `components__chips.md`.

**Checkbox**
- Multi-select, or turning individual items in a group on/off.
- Indeterminate for a parent with some children selected.
- The label is part of the target; don't use a checkbox for an independent immediate action when a switch is clearer.

**Radio button**
- Choose exactly one in a group, with all options visible at once.
- Provide a sensible default if a choice is required; if "none" is meaningful, provide an explicit option for it.

**Switch**
- A boolean that takes effect immediately.
- The label describes the property; don't phrase it as a question.
- On/off is clear through thumb position + color/icon when needed.

**Chips**

| Chip | Use |
|---|---|
| Assist | Contextual suggested action |
| Filter | Toggle a filter |
| Input | A user-entered entity, removable |
| Suggestion | Dynamic suggestion |

Don't use chips instead of buttons for every action; chips suit short content and flexible groups.

### 3.9 Text input
Verbatim: `components__text-fields.md`, `components__search.md`.

**Text field**
- Filled or outlined according to the theme; don't use both without a system.
- The floating label keeps context once there is a value.
- Supporting text is for guidance/error; prefix/suffix for units or format.
- A trailing icon has a clear action such as show password, clear, or dropdown.
- Counter only when there is a limit; don't cause anxiety when it isn't needed.
- The error state includes a message, icon/semantics and focus management.
- Never block paste, autofill or password managers.

**Search**
- Search bar as the entry point; search view for the expanded search state.
- Suggestions / recent / results must be distinguishable.
- Filter chips may accompany it, but need a way to reset.
- Keep the query when returning if the user is exploring results.

### 3.10 Communication
Verbatim: `components__dialogs.md`, `components__snackbar.md`, `components__badges.md`, `components__tooltips.md`.

**Dialog**
- Basic dialog for short decisions.
- Full-screen dialog on compact when the task is complex; on large screens the presentation can change.
- Actions use text buttons, ordered per platform/localisation.
- No dialog on top of a dialog; don't use a dialog for information that can be inline.

**Snackbar**
- Short feedback about a process; appears near the bottom but avoids nav / keyboard / FAB.
- At most **one** short action, usually Undo / Retry.
- No close icon if the timeout/action is enough, unless a specific accessibility requirement asks for it.
- Not for errors users need to read for a long time, or for form fixes.
- Queue sensibly; never stack several snackbars.

**Badge**
- Small badge for presence/status; large badge carries a number.
- Cap the displayed number, e.g. `99+`, when needed.
- A badge supplements the label; it is never the only content for a screen reader.

**Tooltip**
- Explains an icon/action on hover or long press.
- Short; no interactive content.
- Don't use a tooltip in place of an essential label on touch UI.

### 3.11 Menus and toolbars
Verbatim: `components__menus.md`, `components__toolbars.md`.

**Menu**
- A temporary list of actions/selections.
- Short items, grouped with dividers/headers when needed.
- The selected item has a check; destructive items are separated.
- Use submenus sparingly — they are hard on touch.

**Toolbar**
- The M3 Expressive toolbar groups frequent actions and can be combined with a FAB.
- Only actions related to the current page.
- On compact, prioritise main actions + overflow; on expanded, more can be exposed.
- Don't use a toolbar as a navigation bar.
