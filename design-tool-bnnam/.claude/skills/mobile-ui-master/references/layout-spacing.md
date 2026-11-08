# Adaptive layout, breakpoints, spacing and numeric UI rules

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/layout.md, knowledge/ui-rules.md @ 3c0e291 — translated, complete

Knowledge here is a lens for thinking, not a procedure. Where a project's own standard or template screen says otherwise, the project wins.
The measured designer structure (paddings, gaps, toolbar and CTA heights) lives in `screen-structure.md`.

## Contents
1. Container-first thinking
2. iOS layout
3. Material 3 breakpoints
4. Five questions when the breakpoint changes
5. Material canonical layouts
6. Spacing
7. Foldables and interruption zones
8. Corner radius rules
9. Action hierarchy and feature exposure
10. Layer opacity vs alpha fill
11. Color dust
12. Letter spacing
13. Adaptive layout for iOS 27 and iPhone Duo — where to look

---

## 1. Container-first thinking

Do not design for a list of phone models. Design for the **real space of the window/container**, because:

- Split screen, multi-window, Stage Manager and desktop mode change the available area.
- Foldables change posture and the hinge/fold area.
- Orientation does not always predict width.
- Dynamic Type / font scale changes the size of the content.

## 2. iOS layout

- Respect the **safe area**, status bar, home indicator, camera cutout and keyboard.
- Use flexible Auto Layout / SwiftUI layout; avoid fixed coordinates.
- Use size classes and container size to change the structure when needed.
- Let content scroll when text is large; never clip text or lock a cell's height.
- Put frequent actions where they are easy to reach — especially the middle and bottom of the screen for one-handed use.
- Keep important content away from screen edges and system gesture areas.
- When switching portrait/landscape or resizing, keep selection, scroll position and task context.

## 3. Material 3 breakpoints

Material now calls "window size classes" **breakpoints**:

| Breakpoint | Window width | Typical example |
|---|---:|---|
| Compact | `< 600dp` | Phone in portrait |
| Medium | `600–839dp` | Tablet in portrait, foldable open in portrait |
| Expanded | `840–1199dp` | Phone in landscape, tablet in landscape, small desktop |
| Large | `1200–1599dp` | Desktop |
| Extra-large | `≥ 1600dp` | Desktop / ultra-wide monitor |

A breakpoint describes the **window**, not the device. The same device can change breakpoint when rotated, resized or run in multi-window.
Detail: `../material-design-3/SKILL.md` (foundations__ layout pages).

## 4. Five questions when the breakpoint changes

1. **Reveal** — is there content or an action that should become visible instead of sitting in a menu?
2. **Divide** — should one pane become two or three?
3. **Resize** — how should cards, images, lists or type change size?
4. **Reposition** — should navigation, actions and content move to suit ergonomics?
5. **Swap** — should a functionally equivalent component replace another, e.g. navigation bar → navigation rail?

Do not swap just because there is room. The two components must be functionally equivalent and the change must improve operation or structure.

## 5. Material canonical layouts

| Layout | Use |
|---|---|
| **Feed** | Grid/cards whose column count can change; for large amounts of browsable content |
| **List-detail** | A list plus its detail; compact is usually one pane, expanded usually two panes |
| **Supporting pane** | The main area takes most of the space, a secondary pane supports it; suits editor–preview, content–comments, map–detail |

## 6. Spacing

- Material uses an **8dp** scale, with token `space100 = 8dp`; extend it when the system needs.
- Distinguish **padding** (inside), **gap** (between elements) and **margin** (outside).
- Prefer padding/gap on the container over margins scattered on each child.
- iOS does not mandate a single arithmetic grid; use system spacing and the product's semantic tokens.
- Use `leading/trailing` instead of `left/right` to support RTL.
- For long reading passages limit line length; Material suggests about **40–60 characters per line** in expanded layouts.

## 7. Foldables and interruption zones

- Never put a CTA, drag handle or important content on the hinge/fold.
- Treat the fold as a spacer or a natural boundary between panes.
- Do not assume "expanded = scale everything up"; prefer a multi-pane structure.
- Test continuity when folding/unfolding: video, forms, selection and progress must be preserved.

## 8. Corner radius rules

From the designer's personal UI notes; numbers are exact.

| Rule | Statement | Example |
|---|---|---|
| **Same frame, same radius** | Containers inside the same frame have **equal** corner radii | — |
| **Adjacent radius** | A **large** element's radius = **½ the height of the small element next to it** | an image with radius 22 next to a 44-high button · an info bar 50 high → the container below it has radius 25 |
| **Equivalent form** | A chip-like bar has **height = 2 × the radius** of the other large frames | chip row 44 high ↔ cards with radius 22 |

The measured radius scale of the designer's files (pill / 21 / 28 / 36 / 44) is in `screen-structure.md` §8.

## 9. Action hierarchy and feature exposure

- **Primary action = big button; secondary actions = small buttons or partly hidden.**
- **Advanced features that mainstream users are not familiar with → put the function directly on the surface**, so that one tap starts the work (do not hide it behind a menu or explanation step).

Two-button arrangements (side by side vs stacked) are in `screen-structure.md` §7b.

## 10. Layer opacity vs alpha fill

| | Affects |
|---|---|
| **Layer opacity** | The **whole object** — fill + stroke + effects |
| **Alpha in the fill colour** | Only the **fill colour** |

- **Do not use layer opacity to "save colours".** Create a colour token with its own alpha and name it clearly (`Primary / Black 50%`). Reasons:
  - code performance — rendering an alpha fill is lighter than computing opacity for a whole layer;
  - consistency — the token is fixed; with layer opacity the developer has to guess whether it is 50% or 48%;
  - maintenance — change one variable and you are done;
  - interaction — hover states stacking opacity on opacity are hard to control.
- **Use layer opacity only to fade a whole composite** (a card made of image + text + icon) to express **Disabled**.

## 11. Color dust

**Avoid colour dust** — a tint mixed into white/black areas produces a cloudy, dirty colour that loses its saturation. Keep tinted overlays and
tinted neutrals deliberate; when a surface needs a hint of brand, use a defined token rather than a low-alpha brand wash over grey.

## 12. Letter spacing

**Letter spacing = font size × 2.5%** (designer's rule; e.g. 16 pt → 0.4 pt).

> Overrides the tool demo: `../figma-ui-flow/references/design-system.md` §2.3 suggests slightly negative tracking for large sizes and slightly
> positive for small all-caps text. Do not follow that — always use the 2.5% rule.

## 13. Adaptive layout for iOS 27 and iPhone Duo — where to look

Full knowledge lives in the `iphone-duo-adaptive` skill (`../iphone-duo-adaptive/SKILL.md`) and Apple's page
`../apple-hig/references/designing-for-iphone-duo.md`. Topics to look up there:

- size class is a layout signal, not a device identifier
- asymmetric safe areas; full bleed vs safe content
- displacement: continuous vs point content, related groups
- choosing the container: navigation split view · split arrangement · overlay arrangement
- even column counts around the fold
- intermediate resize states, readable width
- concentric corner radii close to the hardware
- ergonomics and occluded areas per posture
- loading / empty / error inside an adaptive container
- the adaptive-layout deep dive: state vector, four geometry layers, six transformations, the reserved-region algorithm, the container decision tree, patterns by content type
- the community starter kit: 6 states, the `Duo System` variables, layout guides, 9 product patterns, 10 Do / Don't pairs — **for mockups only**

Measured geometry worth remembering: **vertical bar 84, toolbar 84, margin 20, sheet margin 16**. The designer's own Duo packaging (four variants per
screen, pane split, `Pane controls`) is in `screen-structure.md` §11.
