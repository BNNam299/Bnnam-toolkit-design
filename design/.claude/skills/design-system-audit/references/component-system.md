# Component system and the iOS–Android equivalence map

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/components.md @ 3c0e291 — translated, complete

Knowledge is a lens for thinking, not a procedure. Where a team rule (`../bnnam-standards/SKILL.md`) differs, the team rule wins.
How components are assembled from atoms (levels, variants, properties, slots): `atomic-design.md`. Which components to build for a
project: `component-spec.md`.

## Contents
1. Choosing a component
2. Action
3. Selection and input
4. Navigation
5. Containment
6. Presentation
7. Status and feedback
8. iOS ↔ Android equivalence map
9. Shared core, native shell
10. Adaptive component contracts — iOS 27, iPhone Duo

---

## 1. Choosing a component

Choose by **task and behaviour**, not by look. Every component needs a spec of:
- purpose, and when to use / not use it
- anatomy
- variants and sizes
- states: enabled, disabled, hover, focus, pressed, selected, loading, error
- content rules
- responsive / adaptive behaviour
- accessibility semantics
- token and API mapping

## 2. Action

### Button
- One area has **one** prominent primary action.
- Secondary / tertiary show a lower hierarchy.
- Labels start with a specific verb.
- Use disabled only when the reason is obvious; otherwise allow the tap and explain the missing condition.
- Destructive actions are clearly distinct and placed away from safe actions.
- On submit, prevent double-submit; show loading **without the button changing size**.

### Floating Action Button — Android
- For one primary, frequent, screen-wide action.
- Never several competing FABs.
- Don't copy the FAB to iOS just for visual sameness; use a placement / component that fits the HIG.

### Icon button
- Only when the icon is familiar; otherwise add a label or tooltip.
- The touch area is large enough even when the icon is small.

## 3. Selection and input

| Need | Component |
|---|---|
| On / off taking effect immediately | Switch / Toggle |
| Pick several items | Checkbox (Android) or an iOS-appropriate multi-select list |
| Pick one of a fully visible group | Radio button (Android); picker / list / segmented control on iOS, by case |
| Pick among a few peer modes with short labels | Segmented control / segmented button |
| Pick a continuous or approximate value | Slider |
| Small step up / down | Stepper |
| Pick from a long list | Picker / menu / searchable selection |
| Enter text | Text field / text area |

### Text field
- A label always exists; the placeholder is only an example / hint.
- Pick the keyboard / input type that matches the data.
- Autofill, password managers and paste must work.
- Validate at the right time: format errors can show when leaving the field; server errors after submit.
- Put errors next to the field and say how to fix them; move focus to the first error after submit.
- Never clear the input when a request fails.

## 4. Navigation

### Tab bar (iOS) / Navigation bar (Android)
- For peer top-level destinations.
- Each destination keeps its own state.
- Never used to drive a filter within one screen.
- Short, stable labels; the selected state is recognisable without relying on color alone.

### Navigation rail / drawer / sidebar
- Android: a rail suits medium / expanded widths; a drawer suits many destinations or rarely used ones.
- iOS / iPadOS: a sidebar suits hierarchy and wide screens.
- Don't hide the most important areas in a drawer when a bar / rail could show them more clearly.

### Search
- If search is a primary task, give it a clear entry point.
- Offer recents, suggestions, corrections and a useful empty result.
- Let the user edit the query without losing filters unexpectedly.
- Distinguish "no data" from "no results".

## 5. Containment

### List
- For uniform data scanned vertically.
- Rows have a clear hierarchy; accessories / actions are not confusable with tapping the whole row.
- Swipe actions need an alternative way to discover them, and undo when destructive.

### Card
- Material uses cards to group content / actions about one topic.
- iOS doesn't need every group to be a card; sections / lists / system materials are often more natural.
- Don't nest many cards or turn the whole screen into "boxes inside boxes".

### Divider
- Only when spacing / hierarchy is not enough.
- Don't run a divider across an area so that it groups things wrongly.

## 6. Presentation

### Alert / Dialog
- For information that needs attention or a decision before continuing.
- Short title, body states the consequence, clear actions.
- Not for ordinary success messages.
- Avoid many CTAs and long forms inside an alert.

### Sheet / Bottom sheet
- For a secondary task or a choice tied to the current context.
- Keep a clear way to close and protect draft data.
- Android bottom sheets can be modal or standard; iOS sheets use detents where appropriate.
- Long / complex tasks become a full screen.

### Popover / Menu
- For temporary choices directly related to the source control.
- Place it near the source, without covering information needed to decide.
- Menu items have action labels; destructive items are grouped apart.

## 7. Status and feedback

- **Determinate progress** when progress is known; **indeterminate** when it isn't.
- Short loading can use a spinner / indicator; content loading uses a stable skeleton and never fakes progress.
- A badge is a secondary signal and never the only carrier of important content.
- A snackbar is a Material pattern for short updates, optionally with one action. iOS has no standard snackbar; choose inline feedback, a
  suitable banner, or state shown directly on the object.
- Show success near the result; don't open a "Success" modal unless a decision is needed.

States and feedback in depth: `../mobile-ux-fundamentals/references/states-feedback-motion.md`.

## 8. iOS ↔ Android equivalence map

| Need | iOS | Android / Material 3 | Note |
|---|---|---|---|
| Top-level destinations on phone | Tab bar | Navigation bar | Keep the semantics; the look need not match |
| Navigation on wide screens | Sidebar / split view | Navigation rail / drawer + panes | Switch by container |
| Title / action bar | Navigation bar + toolbar | Top app bar + toolbar | Placement follows each convention |
| Secondary modal task | Sheet / popover | Bottom sheet / side sheet / dialog | Choose by complexity |
| Alert needing a decision | Alert / action sheet | Dialog | Few actions, clear consequence |
| System share | Activity view / share sheet | Android Sharesheet | Use the system one |
| Pick among a few modes | Segmented control | Segmented button | Not for many items |
| Instant on / off | Toggle / Switch | Switch | Label describes the state |
| Pick one option | Picker / list / segmented | Radio / menu / picker | By count and context |
| Prominent primary action | Prominent button / toolbar action | FAB / filled button | The FAB is not a default iOS pattern |
| Short feedback | Inline state / suitable banner | Snackbar | iOS has no standard snackbar |
| Ongoing background task | Live Activity / progress / notification | Progress / notification | Respect permission and privacy |
| Icons | SF Symbols | Material Symbols | Never mix glyph styles |
| Layout unit | pt | dp; text in sp | No 1:1 pixel conversion |
| Touch target | 44 pt | 48 dp | The hit area may be larger than the shape |

Platform decision rules in more depth: `../material-design-3/references/cross-platform-decisions.md`,
`../apple-design-iphone/references/ios-platform.md`.

## 9. Shared core, native shell

Split the design into:
- **Shared core:** user goal, IA, data, content model, business rules, brand principles, semantic tokens.
- **Native shell:** navigation, components, gestures, typography, dialogs / sheets, permissions, back behaviour, keyboard and system
  integration.

Pixel-identical iOS and Android usually make both feel less native. Aim for consistent brand and function, with familiar behaviour on
each platform.

## 10. Adaptive component contracts — iOS 27, iPhone Duo

Pointers only — full content lives in `../iphone-duo-adaptive/SKILL.md`:
- the contract: role · size behaviour · axis behaviour · priority · safe behaviour · state · continuity · accessibility
- vertical toolbar items, toolbar / tab bar compression, system overflow (`../iphone-duo-adaptive/references/duo-components.md` §1–7)
- adaptive sheets, menus, popovers — use system components (`duo-components.md` §11–12)
- split / overlay arrangements, the camera control across two displays
- iOS 27 kit components: Toolbar - Top - iPhone Duo, Tab Bar - iPhone Duo, `_Buttons - 48pt` Preferred Axis, sheet detents
  (`../apple-design-iphone/references/ios27-figma-kit.md`)
- when a custom component is allowed (`duo-components.md` §14)
- the adaptive component contract in depth: invariant anatomy, representation per space, transition, failure
- anatomy of the community kit's vertical bar, status bar, horizontal bar, pane, split view, arrangement view
