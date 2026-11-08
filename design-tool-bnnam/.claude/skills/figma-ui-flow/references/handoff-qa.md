# QA and handoff

## Contents
1. 6-group QA checklist
2. Accessibility in detail
3. Severity levels and reporting
4. Dev Mode and annotation
5. Mapping tokens to code
6. Code Connect and post-handoff

---

## 1. 6-group QA checklist

### A. Structure
- [ ] Pages follow the standard; Cover shows the current status.
- [ ] No default layer names; screen names follow `Flow / Screen / State`.
- [ ] No leftover hidden layers, no stray frames outside a Section.
- [ ] Instances are not detached (or the reason is noted).

### B. Tokens
- [ ] Every fill/stroke/text color is bound to a Semantic variable or style.
- [ ] Every text layer uses a text style.
- [ ] Spacing and radius are bound to variables; no odd values off the scale (13, 17, 22…).
- [ ] Switching Light/Dark mode: no element keeps a wrong color.

### C. Layout
- [ ] Content frames use Auto Layout; resizing does not break (see `file-standards.md` 3.5).
- [ ] Device safe areas are respected.
- [ ] Alignment follows the grid; spacing is consistent across screens of the same type.

### D. States
- [ ] Present: normal data, empty, loading, error, offline.
- [ ] Extremely long content (40-character names, 9-digit numbers), extremely short, missing images.
- [ ] Every interactive element has Pressed/Focused/Disabled.
- [ ] Keyboard open (mobile): inputs are not covered.

### E. Accessibility (details in section 2)
- [ ] Contrast meets thresholds.
- [ ] Touch targets ≥ 44 (iOS) / 48 (Android).
- [ ] Information is never conveyed by color alone.
- [ ] The largest text size does not break the layout.

### F. Content
- [ ] No lorem ipsum on handoff screens.
- [ ] Spelling, diacritics, and number/date/currency formatting are consistent.
- [ ] Microcopy tone is consistent (buttons are verbs: "Save", "Continue").
- [ ] Error messages say what happened and how to fix it.

## 2. Accessibility in detail

| Item | Threshold / rule |
|---|---|
| Body text contrast | ≥ 4.5 : 1 (WCAG AA) |
| Large text (≥ 24px regular or ≥ 18.66px bold) | ≥ 3 : 1 |
| UI components, meaningful icons, input borders | ≥ 3 : 1 against the adjacent background |
| Touch targets | ≥ 44×44 pt (iOS), ≥ 48×48 dp (Android), ≥ 24×24 CSS px minimum (web, 44 recommended) |
| Dynamic type size | Test the largest iOS Dynamic Type (AX) / Android font scale 200%: text wraps, nothing is clipped |
| Focus | Web and keyboard: a clear focus ring (`color/border/focus`), logical focus order |
| Color | Error = red **and** icon/text; charts remain distinguishable for color-blind users |
| Motion | Provide a Reduce Motion alternative; no flashing more than 3 times per second |
| Labels | Icon buttons have accessibility labels (annotate `a11y label: "Close"`) |

Measuring contrast: a contrast-checker plugin in Figma, or `scripts/check_tokens.py` for token pairs declared in JSON.

## 3. Severity levels and reporting

| Level | Definition | Example |
|---|---|---|
| 🔴 **Blocker** | Functional error, broken layout, AA accessibility violation, missing required state | No payment error screen; text at 3:1 on its background |
| 🟡 **Should fix** | Inconsistency, system debt | Hand-typed color; spacing 14 |
| 🔵 **Nice to have** | Quality improvement | Add a micro-interaction; tighten copy |

Report using `assets/qa-report.template.md`: each issue has an ID (`QA-01`), level, location (screen name + node ID/link), description, suggested fix, and status.

## 4. Dev Mode and annotation

1. **Mark Ready for dev** per Section once it passes QA. Edits after marking → Dev Mode shows "changed"; write a short changelog.
2. **Annotate** what cannot be seen:
   - Behavior: "Long press 0.5s → open context menu".
   - Logic: "Pay button disabled when cart is empty".
   - Edge case: "Name > 2 lines → truncate with …".
   - Motion: duration, easing, properties that change.
   - Accessibility: screen-reader labels, focus order, roles (button/heading).
3. **Measurements:** no manual redlines needed — Dev Mode measures. Annotate only when a value cannot be derived from tokens.
4. **Assets:** mark exports for icons/images (SVG for icons, PNG/WebP @2x @3x for bitmap images; PDF/SVG vector for the iOS asset catalog where appropriate).
5. **Flows:** include a prototype link or flow diagram; note the starting screen.

## 5. Mapping tokens to code

| Figma | SwiftUI | Jetpack Compose | CSS |
|---|---|---|---|
| `color/text/primary` (Light/Dark) | Color asset with Any/Dark appearance → `Color("TextPrimary")` or `extension Color { static let textPrimary }` | `MaterialTheme.colorScheme` / `val TextPrimary` in the theme | `--color-text-primary` in `:root` and `[data-theme=dark]` |
| `space/4` = 16 | `CGFloat` constant `Spacing.md` | `Dp` `Spacing.md = 16.dp` | `--space-4: 16px` / `1rem` |
| `radius/lg` = 12 | `.clipShape(.rect(cornerRadius: Radius.lg))` | `RoundedCornerShape(Radius.lg)` | `--radius-lg: 12px` |
| text style `body/lg` | `.font(.body)` (Dynamic Type) or custom font + `relativeTo:` | `MaterialTheme.typography.bodyLarge` | `font: var(--font-body-lg)` |
| elevation | `.shadow(...)` or material | `shadowElevation` / `tonalElevation` | `box-shadow: var(--elevation-2)` |
| motion `duration/base` + easing | `.animation(.snappy(duration:))`, `.spring(...)` | `tween(250, easing)` / `spring()` | `transition: 250ms var(--ease-standard)` |

Convention: token names in code keep the same structure as in Figma (convert `/` to camelCase or `-`). Export tokens with an export-variables plugin (JSON in the W3C Design Tokens format where possible) and run `scripts/check_tokens.py` before handing over.

## 6. Code Connect and post-handoff

- **Code Connect:** link Figma components to code components (file path, props mapping) → Dev Mode and agents show real code instead of generated code. Link the most-used components first.
- **Post-build comparison:** capture screenshots of the real build (or `generate_figma_design` from the running app), place them next to the design, compare differences; log issues as in QA.
- **Feedback loop:** anything dev had to "guess" → add it to the component description or this standard so no one has to guess next time.
