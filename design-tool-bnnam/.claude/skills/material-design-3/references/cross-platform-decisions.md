# Cross-platform decision matrix (iOS ↔ Android)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/decision-matrix.md @ 3c0e291 — translated, complete

Use this when one product ships on iOS and Android and you must pick the right native pattern on each side, or decide between native, shared
and custom components. For a component-by-component iOS ↔ Android name map see
`../design-system-audit/references/component-system.md`. Verbatim rules: iOS → `../apple-hig/references/<page>.md`,
Android → the `components__*.md` pages in this folder.

## 1. Navigation by number of destinations and width

| Situation | iOS | Android |
|---|---|---|
| 3–5 destinations, phone | Tab bar | Navigation bar |
| Many destinations, tablet | Sidebar / adaptable tab bar | Navigation rail or drawer |
| List-detail | Navigation stack → split view | Single pane → list-detail canonical layout |
| Search is a main area | Search tab / search field | Search destination / search bar / search view |
| Per-screen actions | Toolbar / navigation bar actions | Top app bar / toolbar / FAB, depending on priority |

iOS pages: `tab-bars.md`, `sidebars.md`, `split-views.md`, `search-fields.md`, `toolbars.md`. Android pages: `components__navigation-bar.md`,
`components__navigation-rail.md`, `components__navigation-drawer.md`, `foundations__layout__canonical-examples.md`, `components__search.md`,
`components__app-bars.md`, `components__toolbars.md`, `components__floating-action-button.md`.

## 2. Presentation by complexity

| Content | iOS | Android |
|---|---|---|
| Short choice tied to a source | Menu / popover / action sheet | Menu / bottom sheet |
| Blocking decision, few actions | Alert | Basic dialog |
| Short secondary task | Sheet | Modal bottom sheet / dialog |
| Long / complex task | Full-screen cover / navigation push | Full-screen dialog / destination |
| Secondary pane on wide screens | Inspector / split view / sidebar | Side sheet / supporting pane |

## 3. Feedback

| Situation | Preferred approach |
|---|---|
| Tap received | Press / ripple / highlight + state change |
| Quick save | Update directly; inline confirmation is optional |
| Background save | Progress inside the control, or a non-blocking status |
| Delete with undo | Android: snackbar. iOS: a suitable inline element/banner, or direct restore |
| Form error | Inline error + focus / announcement |
| Whole-page error | Error state + retry |
| Decision needed | Alert / dialog |

## 4. When to use native, shared or custom components

**Native component** when:
- There is a strong convention: date picker, share, permission, authentication, menu, navigation.
- Accessibility and behaviour are complex.
- Users expect system integration.

**Shared visual component** when:
- The brand needs consistency and the behaviour is simple.
- Tokens can map onto native semantics.
- A team exists to maintain accessibility on both platforms.

**Custom component** only when:
- No native component meets the task.
- The measurable UX benefit outweighs the learning and maintenance cost.
- It has full states, keyboard, screen reader, large text, RTL, reduced motion, and tests.

## 5. Final decision rule

When iOS HIG, Material and the brand conflict, decide in this order:
1. Protect safety, privacy and accessibility first.
2. Keep the platform's mental model and conventions for **behaviour**.
3. Keep task efficiency and recoverability.
4. Express the brand in the remaining visuals / content / motion.
5. Prototype and test if the trade-off is still unclear.
