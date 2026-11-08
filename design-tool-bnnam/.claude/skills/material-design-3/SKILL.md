---
name: material-design-3
description: Verbatim Google Material Design 3 library (incl. M3 Expressive) - 74 Foundations/Styles/Components pages, 36 component token tables (exact dp, color roles, shape, type), an Android design summary, and an iOS vs Android decision matrix. Use whenever a screen, component or token targets Android, Material You or Jetpack Compose - navigation bar/rail/drawer, FAB, app bar, bottom sheet, dialog, snackbar, chips, text fields, color roles, dynamic color, type scale, shape, elevation, motion, window classes, 48dp targets - or when choosing iOS vs Android patterns for one product. Triggers include "Material 3", "M3", "Android design", "make it feel Android", "what is the token for", and Vietnamese like "theo Material", "chuẩn Material 3", "thiết kế cho Android", "màn Android", "token M3 là bao nhiêu", "iOS với Android khác gì". For Android widgets use android-design-widget; for iOS rules use apple-hig; for the screen build loop use figma-ui-flow; for a project's own tokens/components use design-system-audit.
---

# material-design-3 — Google Material Design 3, verbatim

This skill is a **library**: the design part of m3.material.io copied verbatim (English, original headings), plus two translated toolkit
notes. It answers "what does Material say, exactly?" and "what is the exact value?". It does not run a process — building screens is
`figma-ui-flow` (`../figma-ui-flow/references/build-loop.md`), Figma tool mechanics are `figma-agent-tools`, a project's own token and
component system is `design-system-audit` (`../design-system-audit/references/tokens.md`, `../design-system-audit/references/component-system.md`).

**Fetched 2026-10-18** from Google's official site data (content build `2026-10-13_06-10-19` + the DSDB token tables). Text check: every source
paragraph ≥ 20 characters is present (0 missing across 75 pages). Scope is **design knowledge only**: Foundations, Styles, Components (with
M3 Expressive). Not included: developer docs (MDC-Android, Jetpack Compose, Flutter, Web), blog, Wear OS (`foundations/watches`), Android XR
(`foundations/xr/*`), the site home and index pages. If a project needs those, say so and ask the user to fetch them — don't guess.

## Need → Read

Do not read everything at once. Open one page, and inside it the `###` sub-section you need.

### Start here
| Need | Read |
|---|---|
| Quick Android design summary (states, a11y, customisation order, scaffold, component do/don't) | `references/android-platform.md` |
| One product on iOS + Android: which pattern on each side, native vs shared vs custom, conflict rule | `references/cross-platform-decisions.md` |
| iOS ↔ Android component name map | `../design-system-audit/references/component-system.md` |
| Material vocabulary (A–Z) | `references/foundations__glossary.md` |

### Foundations
| Need | Read |
|---|---|
| Accessibility principles, assistive tech | `references/foundations__overview.md` |
| Accessible design: contrast, hierarchy, target sizes, focus order, labeling | `references/foundations__designing.md` |
| Usability tactics, M3 Expressive applied (Aura example) | `references/foundations__usability.md` |
| Inclusive design, co-design | `references/foundations__building-for-all.md` |
| Text color, truncation, resizing, accessibility text | `references/foundations__writing.md` |
| Content design overview / style guide (word choice, pronouns, grammar) | `references/foundations__content-design__overview.md`, `references/foundations__content-design__style-guide.md` |
| Alt text | `references/foundations__content-design__alt-text.md` |
| Global writing (localisation-friendly words) | `references/foundations__content-design__global-writing.md` |
| Notification copy | `references/foundations__content-design__notifications.md` |
| Customising Material (dynamic color, custom schemes) | `references/foundations__customization.md` |
| Token anatomy: ref / sys / comp classes, contexts, use in Figma | `references/foundations__design-tokens.md` |
| Layout terms, parts of layout, adaptive design | `references/foundations__layout__layout-overview.md` |
| Window size classes compact / medium / expanded / large / extra-large: navigation, panes, spacing per class | `references/foundations__layout__breakpoints.md` |
| Canonical layouts: feed, list-detail, supporting pane | `references/foundations__layout__canonical-examples.md` |
| Scaffold: bars, rails, panes, pane resizing | `references/foundations__layout__scaffold.md` |
| Grids, spacing, density, targets, pixel density | `references/foundations__layout__grids-spacing.md` |
| RTL / bidirectionality, mirroring | `references/foundations__layout__bidirectionality-rtl.md` |
| Gestures incl. predictive back | `references/foundations__interaction__gestures.md` |
| External inputs: mouse, stylus, keyboard, trackpad | `references/foundations__interaction__inputs.md` |
| Selection mode | `references/foundations__interaction__selection.md` |
| States & state layers (enabled, disabled, hover, focus, pressed, dragged) | `references/foundations__interaction__states.md` |

### Styles
| Need | Read |
|---|---|
| Color system, HCT, three contrast levels | `references/styles__color__system.md` |
| Color roles (primary…surface, fixed, bright/dim), pairing | `references/styles__color__roles.md` |
| Static vs dynamic — which to choose | `references/styles__color__choosing-a-scheme.md` |
| Baseline / custom brand scheme | `references/styles__color__static.md` |
| Dynamic color (user-generated, content-based) | `references/styles__color__dynamic.md` |
| Custom roles, harmonise, remap, own baseline | `references/styles__color__advanced.md` |
| Theme Builder and tutorials | `references/styles__color__resources.md` |
| Typography: type scale + tokens, emphasized styles, custom typefaces | `references/styles__typography.md` |
| Shape: 35-shape library, corner radius scale, morph | `references/styles__shape.md` |
| Elevation levels, shadows, scrims | `references/styles__elevation.md` |
| Spacing units and tokens | `references/styles__spacing.md` |
| Icons, Material Symbols axes, sizes | `references/styles__icons.md` |
| Motion physics: springs, motion schemes | `references/styles__motion__overview.md` |
| Easing & duration tokens | `references/styles__motion__easing-and-duration.md` |
| Transition patterns (container transform, lateral, top level, enter/exit, skeleton) | `references/styles__motion__transitions.md` |

### Components (each page: `## Overview` · `## Specs` · `## Guidelines` · `## Accessibility`)
| Family | Pages (`references/components__<name>.md`) |
|---|---|
| Buttons & actions | `all-buttons` (which button when) · `buttons` · `button-groups` · `split-button` · `icon-buttons` · `segmented-buttons` · `floating-action-button` · `extended-fab` · `fab-menu` · `toolbars` |
| Navigation | `navigation-bar` · `navigation-rail` · `navigation-drawer` · `app-bars` · `tabs` · `search` |
| Containment & overlays | `cards` · `carousel` · `lists` · `divider` · `bottom-sheets` · `side-sheets` · `dialogs` · `menus` |
| Communication & status | `badges` · `snackbar` · `tooltips` · `loading-indicator` · `progress-indicators` |
| Selection & input | `checkbox` · `radio-button` · `switch` · `chips` · `sliders` · `text-fields` · `date-pickers` · `time-pickers` |

### Token tables — lookup only
`references/tokens__components__<name>.md` exists for **36 components** — every component above except `all-buttons`. Open one only when you
need an exact measurement, color role, shape or type token; usage guidance stays in the component page. Big tables (buttons 637 lines,
text-fields 622, floating-action-button 577, icon-buttons 450, extended-fab 361, chips 339, split-button 314) — **grep for the token or group
name** rather than reading them whole. System-level tokens (color, type, shape, elevation, motion, spacing) are in the matching `styles__*` page.

## How to read these files
- **Component pages:** the four site tabs are `##` headings; point at the `###` you need (e.g. `components__dialogs.md › Guidelines › Usage`).
- **Token pointers:** inside a Specs tab, a line `*[Token table (measurements, color, shape): tokens__components__X.md — …]*` points to
  the matching `tokens__components__*.md` file in `references/`, followed by the token sets it contains.
- **Token table columns:** `Group` (group/state) · `Token` · `Reference` (the system token it aliases) · `Value (default contrast, light)`.
  Values are the **public (3P) set, Light, default contrast, Android**.
- **Images and videos** survive only as text: `*[image: …]*` = image description, `*[video …]*` = video description. Labels
  **✅ Do / ❌ Don't / ⚠️ Caution** mark the original do/don't figures. Anatomy and measurement diagrams are text only — take real numbers
  from the token table.
- **Known heading duplicate:** `components__navigation-bar.md › Specs` has two `### Measurements` / `### Configurations`. The **first** is the
  M3 Expressive navigation bar; the baseline bar's versions come right after `### Baseline navigation bar`.
- `[Deprecated] …` token sets are kept for reference; prefer the current (Expressive) sets for new work.

## Core rules
1. **Verbatim beats summary.** These Google pages win over `references/android-platform.md`, over any Material summary in other skills
   (`mobile-ux-fundamentals`, `mobile-ui-master`, `apple-design-*`), and over memory. Quote the page and section when you rely on a rule.
2. **Bind roles, not hex.** Every token row gives its reference (`md.sys.color.primary`). Build with the role/system token; the hex is the
   light-scheme baseline sample only. Dark and high-contrast values are not in the tables — they come from the scheme via the same roles.
3. **Customise in order:** color scheme + roles → typeface/type scale → shape scale → motion scheme → targeted component tokens. Never
   remove state layers/ripple/focus, hide affordances by reshaping, or shrink targets to look "less Google".
4. **48×48dp minimum target**, including small icons; density changes never shrink targets.
5. **Every state has ≥ 2 visual signals** where color alone isn't enough (selected = fill + check/icon/shape; error = role + message + icon).
6. **Choose type roles by purpose**, not by the size that "looks right"; emphasized styles only for hero/editorial/high-priority moments.
7. **Adapt by window class, not device:** compact → navigation bar; medium/expanded → rail or drawer; panes per
   `foundations__layout__breakpoints.md`. Not every screen needs multiple panes.
8. **Stay in scope:** design only. If asked about Compose/Views code, Wear OS or XR, say these pages are not in the library.
9. **Use these copies during project work** instead of browsing m3.material.io, so every agent reads the same text. Refreshing the
   library is a separate job done in the source toolkit — tell the user if a page looks outdated.

## Workflow — answering a Material question
1. Identify the component/foundation → pick the page from the tables above.
2. Read only the relevant `###` sub-section (Guidelines › Usage / Placement / Behavior, or Accessibility).
3. Need numbers → open the token table, grep the token set, report value **and** reference token.
4. Cross-platform question → `references/cross-platform-decisions.md` first, then the iOS page in `../apple-hig/references/` and the
   Android page here.
5. Report: the rule (quoted or closely paraphrased), file › section, and any Expressive vs baseline difference.

## Common pitfalls
- Copying the hex from a token table into a design → breaks dark mode, contrast modes and dynamic color. Bind the role.
- Reading the baseline navigation bar measurements thinking they are Expressive (or vice versa).
- Treating the token table as guidance — it has values, not usage; usage is in the component page.
- Using M2 habits (heavy shadows, elevation as the main separator) — M3 relies on tonal surfaces; check `styles__elevation.md › Differences from M2`.
- Using a rail just because the phone is in landscape, a navigation bar on expanded windows, or tabs as app-wide navigation.
- Several filled buttons side by side; a FAB covering the snackbar, keyboard or a bottom sheet.

## Self-check before reporting
- Every Material claim points to `references/<file>.md › <section>`.
- Numbers come from a token table or a `styles__*` page, with the reference token named.
- Colors are expressed as roles; targets ≥ 48dp; states have two signals.
- Expressive vs baseline and any `[Deprecated]` set are called out.
- For iOS + Android work, both platform pages were consulted, and the conflict order in `cross-platform-decisions.md` §5 was applied.
