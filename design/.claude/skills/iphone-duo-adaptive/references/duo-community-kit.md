# iPhone Duo Adaptive Design Starter Kit (community): states, tokens, layout guides, components, templates

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/figma-adaptive-design-starter-kit-extraction.md §1–7, §9, §12 (images `community-figma-adaptive/start-here-*`, `device-*`, `layout-guides-*`, `components-*`, `template-*`) @ 3c0e291 — translated, complete

**Community source, not Apple.** *iPhone Duo Adaptive Design Starter Kit (Community)* by Noah Elhadedy (noahelhadedy.com), v1.0, September 2026; Figma file `vLsfIhagZDtzNEikq0qxwp`. The kit states it is unofficial — not created, reviewed or endorsed by Apple; specifications may change; check the latest HIG and test on a device. Apple rules live in `duo-foundations.md`, `duo-device-postures.md`, `duo-layout-transformation.md`, `duo-components.md` — **when this file and those differ, the Apple-based references win.**
Navigation transitions, the nine product patterns, Do / Don't and the review checklist: `duo-community-patterns.md`. Real-app examples from a second community kit: `duo-community-app-examples.md`.

## Contents
1. What the kit is and where its knowledge lives
2. The kit's five reliability badges (and the 27 pt inconsistency)
3. Kit pages
4. Five-step workflow
5. Six device states and four poses
6. `Duo System` variables (tokens)
7. Layout guides: safe area, hinge, reserved regions, margins, columns
8. Component anatomy: bars, status, panes, split and arrangement views
9. Starter templates and component architecture

---

## 1. What the kit is and where its knowledge lives

- It is a complete adaptive-layout guide, not just device frames.
- Knowledge sits in two layers: **visible text layers** on the canvas, and **override values inside instance property assignments** (`componentPropAssignments`) plus **component descriptions**. Reading text layers alone misses almost all of the nine product patterns, the ten Do / Don't pairs, many headings, section descriptions, numbers, source notes, and the detailed descriptions of the vertical bar, split view and arrangement view. Everything is recovered in this file and `duo-community-patterns.md`.
- The kit's four raster images are only device hero shots and the author portrait — no layout diagrams. All teaching diagrams are vector frames / components / instances. Do not use the raster images as layout illustrations.

## 2. The kit's five reliability badges

| Badge | Kit's meaning | How to use it |
|---|---|---|
| OFFICIAL | the author believes Apple states it directly (HIG, Design Resources, Tech Talks, Tech Specs) | treat as "kit-labelled Official" until checked against the Apple source |
| DERIVED | calculated by the author from published Apple numbers | mockups / comparison only; never hard-code at runtime |
| RECOMMENDED | chosen by the author because Apple has not published a value | kit token only |
| ILLUSTRATIVE | drawn for clarity, not measurement | never a spec |
| ASSUMPTION | inferred, not confirmed (listed on the kit's About page) | verify before using in production work |

```text
How to read the numbers — every value carries a badge; anything not Official is a starting point to verify
in the Xcode 27.1 simulator and on device
┌──────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ OFFICIAL     │ stated by Apple (HIG, Design Resources, Tech Talks, Tech Specs) — e.g. 84 pt  │
│              │ vertical bar                                                                  │
│ DERIVED      │ calculated from official numbers — e.g. 475.5 pt hinge = half of 951 pt inner │
│ RECOMMENDED  │ chosen by the kit because Apple has not published one — e.g. 27 pt avoidance  │
│              │ band around the fold                                                          │
│ ILLUSTRATIVE │ drawn for clarity, not measurement — e.g. device corner radii, camera size    │
│ ASSUMPTION   │ believed true from context, not confirmed — listed on the About page          │
└──────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

**Internal inconsistency — the 27 pt folding / avoidance band.** The legend uses it as the RECOMMENDED example; the variable `hinge/avoidance-band` says DERIVED from an HIG figure; the About page calls it a "kit value". Treat 27 pt as a **community estimate for mockups** — not an Apple guarantee, never a runtime constant. Apple has not published the folded division width (§7.2).

## 3. Kit pages

| Page | Content |
|---|---|
| Cover | kit identity |
| Internal Only Canvas | styles, variables, internal parts (local archive only) |
| Start Here | purpose, workflow, how to read badges, source list |
| Device Anatomy | six device states, two displays, poses, regions |
| Device Frames | frame component and state properties |
| Layout Guides | safe area, hinge, reserved regions, margins, columns |
| Navigation | 8 navigation / bar transitions (`duo-community-patterns.md` §1) |
| Adaptive Patterns | 9 product patterns closed → open + a Dark Mode check (`duo-community-patterns.md` §2) |
| Components | Duo-specific parts and mockup parts (§8) |
| Starter Templates | blank frame + 6 starter templates (§9) |
| Do / Don't | 10 rule pairs (`duo-community-patterns.md` §3) |
| About | author, version, legal, assumptions, scope of numbers (local archive only) |
| Some Ex (online file only) | finished outer / inner mockups of Music, Notes, Mail, Maps / Safari, Netflix, Slack in Light and Dark — described in `duo-community-app-examples.md` |

The online file shows 11 pages (no Internal Only Canvas / About, plus Some Ex).

## 4. Five-step workflow

1. **Choose the device state for the task** — start from the state people use most for that task; the outer display is usually the first touch.
2. **Duplicate a starter frame** — from Starter Templates or Device Frames; guides are inside, hidden and locked.
3. **Replace the wireframe with product UI** — keep vertical bar, bars and panes in their roles; swap placeholders for real components.
4. **Design the folded / unfolded pair** — put the matching inner or outer state next to it; check task, selection and scroll position carry over.
5. **Turn guides on to check hierarchy and regions** — nothing important on the hinge, nothing under the vertical bar, reveal **at most one** extra hierarchy level.

Central claim of the kit: design **one adaptive app**, not two unrelated screens.

```text
How to use — five steps, repeat for every screen that matters
┌ 01 Choose the device ┬ 02 Duplicate a     ┬ 03 Apply your     ┬ 04 Test folded    ┬ 05 Validate regions ┐
│ state                │ starter frame      │ product UI        │ and unfolded      │ and hierarchy       │
│ start from the state │ copy a template    │ replace wireframe │ build the matching│ show the guides:    │
│ people use most for  │ (Starter Templates)│ blocks with your  │ inner/outer state │ nothing important on│
│ the task; outer is   │ or a Device Frame; │ components; keep  │ next to it; check │ the hinge, nothing  │
│ usually first touch  │ guides inside,     │ vertical bar, bars│ task, selection,  │ under the vertical  │
│                      │ hidden + locked    │ and panes in place│ scroll carry over │ bar, ≤ 1 extra level│
└──────────────────────┴────────────────────┴───────────────────┴───────────────────┴─────────────────────┘
```

## 5. Six device states and four poses

### 5.1 State matrix

| State | Posture | Logical size (kit) | Pixels (kit) | Size class / bars / geometry |
|---|---|---:|---:|---|
| Outer Portrait | closed, upright | 466 × 678 pt | 1398 × 2034 px | width compact; vertical bar on the side; no hinge on this display |
| Outer Landscape | closed, sideways | 678 × 466 pt | 2034 × 1398 px | width compact; vertical bar, overflows sooner; bar on the same edge as the camera |
| Inner Portrait | open, upright | 669 × 951 pt | 1878 × 2670 px | regular × regular; horizontal bars top / bottom; horizontal hinge line at 475.5 pt |
| Inner Landscape | open flat — the natural open pose | 951 × 669 pt | 2670 × 1878 px | regular × regular; vertical bar; division region inactive, width 0 |
| Partial Book | inner folded like a book | 951 × 669 pt | inner-landscape geometry | division active; system components avoid the fold; split view balances columns to the fold |
| Partial Tabletop | inner propped on a surface | 669 × 951 pt | inner-portrait geometry | top region for viewing at a distance; bottom region for controls; overlay splits to the two sides of the fold |

Inner pixels `2670 × 1878` are **not** exactly 3 × `951 × 669` — never derive pixels from a fixed scale factor.

```text
Outer Portrait (closed, upright)   Outer Landscape (closed, sideways)   Inner Portrait (open, upright)
┌──────────┬──┐                    ┌────────────────┬──┐                ┌────────────────────┐ ← top bar
│          │● │ vertical bar       │                │● │                │────────────────────│ hinge line
│ content  │● │ on the side        │   content      │● │ bar on the     │ (horizontal 475.5) │ (DERIVED)
│          │● │                    │                │● │ camera edge    │                    │
└──────────┴──┘                    └────────────────┴──┘                │      [tab bar]     │ ← bottom bar
466×678 pt · 1398×2034 px          678×466 pt · 2034×1398 px            └────────────────────┘
width Compact · bars vertical      width Compact · vertical,            669×951 pt · 1878×2670 px
on the side · hinge: not on        overflow sooner · bar side = same    Regular × Regular · bars horizontal
this display                       edge as the camera                   top and bottom

Inner Landscape (fully open)       Partial Book (folded like a book)    Partial Tabletop (propped on a surface)
┌──────────┊──────────┬──┐         ┌──────────█──────────┬──┐          ┌────────────────────┐
│          ┊          │● │         │          █          │● │          │ top region: content│
│          ┊          │● │         │          █ (fold)   │● │          │ viewed at distance │
│          ┊          │● │         │          █          │● │          │████████████████████│ fold + band
└──────────┊──────────┴──┘         └──────────█──────────┴──┘          │ bottom: controls   │
951×669 pt · 2670×1878 px          951×669 pt                           └────────────────────┘
Regular × Regular · bars vertical  division region Active (splits)      669×951 pt
on the side · division region      system components move away from     overlay arrangement moves to each
Inactive, zero width               fold · split-view columns adapt to   side of the fold
                                   fold · avoidance band 27 pt centered avoidance band 27 pt centered
                                   (RECOMMENDED)                        (RECOMMENDED)
```
The kit labels sizes, size classes and bar placements OFFICIAL, the hinge line DERIVED, the band RECOMMENDED.

**Naming:** this kit uses Apple's names (466 × 678 = Outer **Portrait**, 951 × 669 = Inner **Landscape**). Another community kit names them the other way round — always map by **size**, not by the word in the frame name (`duo-community-app-examples.md` §5).

### 5.2 Poses

- **Flat** — division region width 0, inactive; treat the inner display as one continuous surface.
- **Folded like a book** — the hinge splits the inner display into two usable regions; content across the fold is harder to see.
- **Propped on a surface / tabletop** — top region favours content viewed at a distance; bottom region favours controls.
- **Standing on its edges** — listed by Apple as a way to place the device; the kit notes size classes do not change, so existing layouts keep applying (no layout of its own).

Design by **size class, container, safe area and reserved regions** — never a breakpoint per pose name (Apple rule: `duo-device-postures.md` §2, §7).

```text
Flat ────────┼────────    Folded like a book  ╲  ╱     Propped on a surface     ╱    Standing on its edges   ╱╲
                                               ╲╱                    ________●╱                            ╱  ╲
division region has zero  the hinge divides the    top region = content       listed by Apple as a way to
width and is inactive →   inner display into two   viewed at a distance;      position the device; same size
treat as one surface      usable regions; content  bottom region = controls   classes, so the same layouts
                          across the fold is                                  apply
                          harder to see
```

### 5.3 Display anatomy

```text
OUTER DISPLAY
┌ safe area (dashed) ───────────────┬─ vertical bar 84 pt ─┐
│ ┌ layout margins (dashed) ──────┐ │  ◉ OUTER CAMERA      │ always present, round cutout, top corner
│ │                               │ │                      │
│ │       CONTENT REGION          │ │  ○                   │
│ │  your layout — keep inside    │ │  ○  VERTICAL CONTROLS│ Back, prominent action, toolbar groups,
│ │  safe area + layout margins   │ │  ○                   │ tab bar — top to bottom
│ │                               │ │                      │
│ └───────────────────────────────┘ │                      │
└───────────────────────────────────┴──────────────────────┘
Safe area: 84 pt trailing, none on top / bottom / leading (Apple iOS & iPadOS 27 design resource)
```
The outer display is wider and shorter than other iPhones, so the system moves the status bar and bars to the side to keep height for content.

```text
INNER DISPLAY (landscape)
┌───────────────────────┬┬────────────────────────┬─ vertical bar ─┐
│ ┌ LEADING PANE ─────┐ ││ ┌ TRAILING PANE ─────┐ │                │
│ │ list, sidebar or  │ ││ │   ◉ INNER CAMERA   │ │   ○            │ inner camera: hidden until active,
│ │ primary view      │ ││ │ detail / secondary │ │   ○            │ then the UI moves aside (position
│ │                   │ ││ │ view               │ │   ○            │ drawn is illustrative)
│ └───────────────────┘ ││ └────────────────────┘ │                │
└───────────────────────┴┴────────────────────────┴────────────────┘
                        ↑ FOLDING REGION — zero width when flat; when partially open it divides the display
                          and excludes the center
```
Regular width and height leave room for sidebars and two panes. In landscape, controls stay on the side so the experience matches the outer display; horizontal bars return only in portrait.

### 5.4 Device frame component

```text
Component properties (split the way designers think)      Valid states (only combinations that exist on hardware)
Display        Outer, Inner           which display       Outer · Portrait · Folded       466 × 678 pt
Orientation    Portrait, Landscape    how it is held      Outer · Landscape · Folded      678 × 466 pt
Fold           Folded, Unfolded,      Folded = closed     Inner · Portrait · Unfolded     669 × 951 pt
               Partial                (outer); Partial =  Inner · Landscape · Unfolded    951 × 669 pt
                                      inner partly open   Inner · Landscape · Partial     951 × 669 pt, folded like a book
Presentation   Device, Screen Only,   body / bare screen /Inner · Portrait · Partial      669 × 951 pt, propped on a surface
               Guides                 safe-area + hinge   (all OFFICIAL)
                                      overlays
Content        instance swap          replace the placeholder; it fills the screen
Show System    boolean                hide the status bar layer for immersive work or exports
Chrome
ILLUSTRATIVE: bodies, corner radii and camera shapes are simplified drawings, not Apple bezels; keep the body
quiet so the UI stays the focus. For marketing imagery use the official iPhone Duo bezel from Apple Design
Resources, under Apple's marketing guidelines.
```

```text
           Presentation: Device       Screen Only        Guides
Outer P    ┌───────●┐ 9:41 +       ┌───────●┐         ┌┄┄┄┄┄┄┄┄┬██┐ trailing strip = vertical-bar
           │ Screen │ Wi-Fi in     │        │         ┊ safe   │██│ inset; dashed = safe area ·
           └────────┘ side rail    └────────┘         └┄┄┄┄┄┄┄┄┴██┘ content margin
Outer L    ┌──────────────┐        ┌──────────────┐   ┌┄┄┄┄┄┄┄┄┄┄┄┄┬██┐ bar + camera on the same
           │   Screen     │        │              │   ┊            │██│ trailing edge (camera
           └─────────────●┘        └─────────────●┘   └┄┄┄┄┄┄┄┄┄┄┄┄┴●█┘ bottom-right)
Inner P    ┌────────────────┐ 9:41 ┌──────────────┐   ┌████████████████┐ top inset band
           │                │ top- │              │   ┊ FOLD — INACTIVE ┊ hinge line across
           │   Screen       │ right│              │   ┊ WHEN FLAT ──────┊ the middle
           └────────────────┘      └──────────────┘   └████████████████┘ bottom inset band
Inner L    ┌──────────────────────┐ ┌────────────────┐ ┌┄┄┄┄┄┄┄┄┊┄┄┄┄┄┄┄┄┬██┐ vertical fold line
           │       Screen         │ │                │ ┊ FOLD — INACTIVE  │██│ "inactive when flat",
           └──────────────────────┘ └────────────────┘ └┄┄┄┄┄┄┄┄┊┄┄┄┄┄┄┄┄┴██┘ trailing bar strip
Partial    ┌──────────░───────────┐ shaded crease      ┌┄┄┄┄┄┄┄┄▓┄┄┄┄┄┄┄┄┬██┐ red band = "division
Book       │          ░           │                    ┊ DIVISION REGION  │██│ region · keep clear"
           └──────────░───────────┘                    └┄┄┄┄┄┄┄┄▓┄┄┄┄┄┄┄┄┴██┘
Partial    ┌────────────────┐                         ┌████████████████┐
Tabletop   │────░░░░░░──────│ horizontal crease        ┊▓ DIVISION REGION · KEEP CLEAR ▓┊
           └────────────────┘                         └████████████████┘
```
Every state comes in three presentations; Guides mode shows safe area, content margin, the fold (inactive when flat) and the division region (keep clear when partial).

## 6. `Duo System` variables (tokens)

Values are the Figma kit's; the "badge" column is the author's label, not independent Apple confirmation. **Use only for Figma mockups / overlays** — never as runtime constants and never as an "if this is Duo" condition (§9.3).

### 6.1 Size, safe area and bars

| Variable | Outer P | Outer L | Inner P | Inner L | Partial Book | Partial Tabletop | Badge |
|---|---:|---:|---:|---:|---:|---:|---|
| `device/width` | 466 | 678 | 669 | 951 | 951 | 669 | Official |
| `device/height` | 678 | 466 | 951 | 669 | 669 | 951 | Official |
| `safe/top` | 0 | 0 | 84 | 0 | 0 | 84 | Official |
| `safe/bottom` | 0 | 0 | 95 | 0 | 0 | 95 | Official |
| `safe/leading` | 0 | 0 | 0 | 0 | 0 | 0 | Official |
| `safe/trailing` | 84 | 84 | 0 | 84 | 84 | 0 | Official |
| `bars/vertical-bar-width` | 84 | 84 | 0 | 84 | 84 | 0 | Official |
| `layout/content-margin` | 20 | 20 | 20 | 20 | 20 | 20 | Official |

The point is not to memorise `84` but to see that the safe area is **asymmetric**: read each inset separately, never mirror leading / trailing out of habit.

### 6.2 Grid, panes, readable width

| Variable | Outer P | Outer L | Inner P | Inner L | Partial Book | Partial Tabletop | Badge |
|---|---:|---:|---:|---:|---:|---:|---|
| `layout/gap` | 16 | 16 | 24 | 24 | 24 | 24 | Recommended |
| `layout/columns` | 4 | 6 | 6 | 8 | 8 | 6 | Recommended |
| `layout/content-max-width` | 342 | 554 | 629 | 600 | 600 | 629 | Recommended |
| `layout/leading-column-width` | 0 | 0 | 260 | 280 | 462 | 0 | Recommended |

Intent of these tokens:
- keep cards and text at a sensible reading / tapping size;
- spend extra width on a pane or new context;
- prefer even column counts so the grid splits cleanly around the fold;
- in Partial Book the leading pane may **snap to the fold** instead of keeping a fixed ratio.

### 6.3 Hinge and shape

| Variable | Outer P | Outer L | Inner P | Inner L | Partial Book | Partial Tabletop | Badge |
|---|---:|---:|---:|---:|---:|---:|---|
| `hinge/position` | 0 | 0 | 475.5 | 475.5 | 475.5 | 475.5 | Derived |
| `hinge/avoidance-band` | 0 | 0 | 0 | 0 | 27 | 27 | Derived / kit value — inconsistent (§2) |
| `device/corner-radius` | 40 | 40 | 36 | 36 | 36 | 36 | Illustrative |

At runtime these three never replace the reserved-region API; they are useful only for Figma overlays, mockups and representative geometry checks.

## 7. Layout guides

### 7.1 Safe area

- Read each inset independently; never assume left = right.
- Backgrounds and images may run to the edge; text, controls and targets stay inside the safe area.
- In Split View multitasking each app puts its controls on the **outer edge of the area it owns**, so the opposite edge can carry an inset too.
- Inner portrait: the top inset holds status bar + top toolbar; the bottom inset holds the tab bar.
- Outer and inner landscape: the trailing inset holds the vertical bar.

```text
Safe areas — the part of the screen not covered by hardware or system UI; asymmetric on Duo because the
status bar and bars sit along one edge
┌───────────────────────────┬─────────────────────────────────┬──────────┐
│ Outer, top and bottom     │ 0 pt                            │ OFFICIAL │
│ Outer, trailing           │ 84 pt (vertical bar)            │ OFFICIAL │
│ Inner portrait, top       │ 84 pt (status bar and top bar)  │ OFFICIAL │
│ Inner portrait, bottom    │ 95 pt (tab bar)                 │ OFFICIAL │
│ Inner landscape, trailing │ 84 pt (vertical bar)            │ OFFICIAL │
│ Leading inset, all states │ 0 pt                            │ OFFICIAL │
└───────────────────────────┴─────────────────────────────────┴──────────┘
NOTE: insets and margins match the iPhone Duo safe-area templates in Apple's iOS and iPadOS 27 design resource.

Outer P              Inner P                    Partial Tabletop
┌┄┄┄┄┄┄┄┄┄┬██┐       ┌████████████████┐ top 84    ┌████████████████┐ top 84
┊┊ safe · ┊┊██│       ┊┊ SAFE AREA ·  ┊┊            ┊┊              ┊┊
┊┊ margin ┊┊██│       ┊┊ CONTENT      ┊┊            ┊┊              ┊┊
┊┊        ┊┊██│ 84    ┊┊ MARGIN       ┊┊            ┊┊              ┊┊
└┄┄┄┄┄┄┄┄┄┴██┘       └████████████████┘ bottom 95 └████████████████┘ bottom 95
Outer L                         Inner L / Partial Book (same guide)
┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬██┐             ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬██┐
┊┊             ┊┊██│ 84          ┊┊                       ┊┊██│ 84
└┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴██┘             └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴██┘
```
Dashed outer line = safe area; dotted inner line = 20 pt content margin; filled strip = inset. Leading inset is always 0.

### 7.2 Hinge area

- Flat: the folding region has width 0 and is inactive.
- Partial: it becomes a division region that splits the display.
- Buttons, sliders and small targets avoid the band around the fold.
- Feeds / articles may scroll across the fold; controls may not.
- Split views and arrangement views should resize panes to the regions themselves instead of using fixed spacers.
- Move only what is needed (to stay visible and easy to tap); no extreme rearrangement of the whole screen.

```text
Hinge area — runs through the center of the inner display, 475.5 pt from the edge in both orientations
┌──────────────────────────────┬────────────────────────────┬──────────────┐
│ Hinge position               │ 475.5 pt from the edge     │ DERIVED      │
│ Division width when flat     │ 0 pt                       │ OFFICIAL     │
│ Division width when folded   │ Not published              │ ASSUMPTION   │
│ Avoidance band               │ 27 pt centered on the fold │ RECOMMENDED  │
└──────────────────────────────┴────────────────────────────┴──────────────┘

Inner L (flat)        Partial Book          Inner P (flat)                    Partial Tabletop
      │                    ▓│▓
      │ FOLD ·             ▓│▓ DIVISION      FOLD · INACTIVE WHEN FLAT         DIVISION REGION · KEEP CLEAR
      │ INACTIVE           ▓│▓ REGION ·      ─────────────────────────         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
      │ WHEN FLAT          ▓│▓ KEEP CLEAR                                      ─────────────────────────
      │                    ▓│▓                                                 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```
Flat states show a thin line only; partial states show the line inside a tinted band — vertical in landscape / book, horizontal in portrait / tabletop.

### 7.3 Reserved regions

| Region | Kind | Presence | Effect on UI |
|---|---|---|---|
| Outer camera | occlusion | always | round cutout in the top corner; the system arranges the vertical controls around it |
| Inner camera | occlusion | conditional — only while the camera is active | the interface moves aside to show the camera is on |
| Folding region | division | conditional — only when partially open | divides the inner display and excludes the center |

```text
┌ OCCLUSION ─────────────┐ ┌ OCCLUSION · CONDITIONAL ──────────┐ ┌ DIVISION · CONDITIONAL ─────────┐
│ ┌──────●┬┐             │ │ ┌──────────────●┬┐                │ │ ┌───────┐▌┌───────┐┬┐          │
│ │       │▒│ camera in   │ │ │ ▬▬▬▬▬▬        │▒│ UI moved aside │ │ │ pane  │▌│ pane  │▒│          │
│ │       │▒│ top corner  │ │ │ ▬▬▬▬          │▒│ while camera on│ │ │       │▌│       │▒│          │
│ └───────┴┘             │ │ └───────────────┴┘                │ │ └───────┘▌└───────┘┴┘          │
│ Outer camera           │ │ Inner camera                      │ │ Folding region                  │
└────────────────────────┘ └───────────────────────────────────┘ └─────────────────────────────────┘
FOR HANDOFF: developers read these areas with the reserved-region APIs in iOS 27.1 — kind `division` for the
fold, kind `occlusion` for cameras — in SwiftUI and UIKit.
```
Handoff must carry the region **kind and geometry**, not just a red rectangle in the mockup (Apple detail: `duo-device-postures.md` §4).

### 7.4 Margins and content width

- Use layout margins, not fixed offsets.
- Content margin `20 pt` on both displays.
- Gap between panes (kit): `16 pt` outer, `24 pt` inner.
- Max text width (kit): `600 pt` in inner landscape / Partial Book.
- Long text needs a readable measure; spend the remaining width on a second pane, not on endless lines.
- A pane's controls stay with that pane (e.g. list actions above the list).

```text
┌────────────────────────────────┬────────┬─────────────┐
│ Content margin, outer display  │ 20 pt  │ OFFICIAL    │
│ Content margin, inner display  │ 20 pt  │ OFFICIAL    │
│ Gap between panes, outer       │ 16 pt  │ RECOMMENDED │
│ Gap between panes, inner       │ 24 pt  │ RECOMMENDED │
│ Max width for text             │ 600 pt │ RECOMMENDED │
└────────────────────────────────┴────────┴─────────────┘
DO — readable measure + a second pane          DON'T — lines across the whole display
┌──────────────────────────┬──┐                ┌──────────────────────────┬──┐
│ ─────────────  ┌──────┐  │▒▒│                │ ──────────────────────── │▒▒│
│ ─────────────  │second│  │▒▒│                │ ──────────────────────── │▒▒│
│ ─────────────  │ pane │  │▒▒│                │ ──────────────────────── │▒▒│
│ ───────        └──────┘  │▒▒│                │ ──────────────           │▒▒│
└──────────────────────────┴──┘                └──────────────────────────┴──┘
```

### 7.5 Column grid

| State | Columns (RECOMMENDED) |
|---|---|
| Outer portrait | 4 |
| Outer landscape | 6 |
| Inner portrait | 6 |
| Inner landscape | 8 |
| Partial Book | 4 + 4 — two groups meeting at the hinge; never a column on the fold |

Margins follow Apple's 20 pt layout margin; counts and gaps are kit values. The principle matters more than the numbers: use an **even** grid when the task must split cleanly around the fold (Apple: "prefer an even number of columns"). In the kit, use the "Duo / Column Grid" overlay or turn on the hidden layout grid in templates (Ctrl G).

```text
Outer P   ║█│█│█│█║░bar░║                Outer L  ║█│█│█│█│█│█║░bar░║
Inner L   ║█│█│█│█│█│█│█│█║░bar░║
Inner P   ║█│█│█│█│█│█║          (no bar column — bars are top/bottom)
Partial   ║█│█│█│█ ▓ █│█│█│█║░bar░║   ▓ = division band at the hinge; 4 columns each side, none on the fold
Book
```
`█` = columns, `░bar░` = the vertical-bar strip (excluded from the grid).

## 8. Component anatomy (from the kit's component descriptions)

| Part | Spec in the kit |
|---|---|
| **Vertical bar** | width `84 pt`; control column `48 pt`; `12 pt` from the content side; `24 pt` from the screen edge; top / bottom padding `24 pt`; `12 pt` between groups. Order: system / status area → Back → prominent action → toolbar group → tab bar. Items overflow **from the bottom up**. |
| **Bar button** | glyph / control `36 × 36 pt` on a `48 pt` glass group; the prominent item is a `48 pt` circle. Every item needs a **title** so it appears correctly in the overflow menu. |
| **Status bar** | outer and inner landscape use the side rail; inner portrait uses a `104 × 48 pt` block top-trailing, `24 pt` from the top and trailing edges, inside the `84 pt` top inset. |
| **Horizontal navigation bar** | inner portrait: `48 pt` controls inside the `84 pt` top inset, `20 pt` from the leading edge. |
| **Horizontal tab bar** | inside the `95 pt` bottom inset; kit draws a glass tab group `297 × 62 pt` and a `62 pt` search button — a mockup description; check Apple Design Resources before using it as a spec. |
| **Pane** | three roles: Content / primary, Detail / secondary, Supporting / context. Outer shows one pane at a time; inner shows two side by side. |
| **Split View** | available content width `867 pt = 951 − 84`. Flat keeps a readable list width; Partial Book snaps the content pane to `462 pt` so the `27 pt` gutter sits on the folding region; outer collapses to one pane. |
| **Arrangement View** | Split divides the area along the fitting axis; Overlay places primary over secondary when flat and moves the two views to the two sides of the fold when partial. The navigation container must sit **outside** the arrangement view. |
| **Screen Placeholder** | content is an instance swap and always **Fill**, so one component adapts to every state. |

```text
Status — side rail     Status — inner portrait     Glass parts                                Screen Placeholder
   ●  (outer camera)       9:41 ◔ (top-trailing)    (pill) [ rounded card ] (●blue) (pill)        ┌┄┄┐
 9:41                                               glass bar group, glass panel, prominent       └┄┄┘ Screen content
  ◔  (Wi-Fi/battery)                                circle, plain glass pill                      "Swap this instance
                                                                                                   with your screen"
```

```text
Sidebar parts          List pane (Notes)          Detail pane                Supporting pane (This week)
 ☰ Collection          ◯ Weekend trip     Fri      Design review              ┌ Notes edited  14 ┐ +3 since Monday
[☰ Collection] sel.   [◯ Design review   Tue]     ┌──────────────┐           ├ Shared         5 ┤ +1 since Monday
 Library               ◯ Reading list     Mon      │    Image     │           └ Reminders      8 ┘ 2 due today
 [⌂ Home] Saved        ◯ Kitchen plans  Sep 8      └──────────────┘
 Shared Recent         ◯ Garden         Sep 2      ─────────────

Split View — flat (list | divider | detail)        Arrangement View — Split (flat)
┌ Notes ─────────┬ Design review ──────────┐      ┌ PRIMARY VIEW ────────┬ SECONDARY VIEW ──────┐
│ list rows      │ image + text            │      │                      │                      │
└────────────────┴─────────────────────────┘      └──────────────────────┴──────────────────────┘
Split View — Partial Book (panes snap to fold)     Arrangement View — Partial (fold between views)
┌ Notes ──────────────────┐ ┌ Design review ─┐    ┌ PRIMARY VIEW ─────────┐│┌ SECONDARY VIEW ────┐
│ list rows (wider: snaps │ │ image + text   │    │                       │││                    │
│ to the fold, 462 pt)    │ │                │    │                       │││ (line = fold)      │
└─────────────────────────┘ └────────────────┘    └───────────────────────┘│└────────────────────┘
```

```text
Vertical bar variants                    Horizontal bar (inner portrait)
 Default   Compressed   Sidebar-mode       (‹)            Title             (⋯) (＋)      navigation bar
  (‹)        (‹)          (‹)              (⇪ 🔖) group                     (⋯) (✎ blue)  alt. trailing set
  (＋)       (＋)         (＋)              ┌ ⌂ Home · ▦ Browse · 🔖 Saved · 👤 Profile ┐ (🔍)  tab bar + search
  ┌⇪┐        (⋯)          ┌⇪┐              └────────────────────────────────────────────┘
  └⋯┘                     └⋯┘
  ┌⌂┐        ┌⌂┐
  │▦│        │▦│
  └👤┘        └👤┘          (⌂)  ← single tab button when a sidebar shows the destinations
```
"Toolbar Compressed" folds share into the ⋯ overflow; when a sidebar is visible the tab capsule collapses to one button.

## 9. Starter templates and component architecture

### 9.1 Templates

Blank frame + six templates: Master Detail · Sidebar Detail · Feed · Media + Context · Map + Panel · Dashboard. Each device frame holds hidden / locked guides; content is replaced by instance swap. Every vertical bar in the templates is the same: (outer only: camera) → 9:41 → status → (‹) → (＋ blue) → group (⇪ share · ⋯) → gap → tab capsule (⌂ Home selected · ▦ · 👤).

```text
BLANK — Outer P                   Inner L                              Inner P
┌──────────────────┬──┐           ┌────────────────────────────┬──┐    ┌─────────────────────────────────────┐
│                  │● │           │                            │9:│    │ (‹)        Title      (⋯)(＋) 9:41 ◔│
│                  │9:│           │                            │◔ │    │                                     │
│                  │‹ │           │                            │‹ │    │                                     │
│   (empty)        │＋│           │   (empty)                  │＋│    │   (empty)                           │
│                  │⇪⋯│           │                            │⇪⋯│    │                                     │
│                  │⌂▦│           │                            │⌂▦│    │  ┌ ⌂Home · ▦Browse · 🔖Saved ·  ┐(🔍)│
│                  │👤│           │                            │👤│    │  └ 👤Profile ───────────────────┘    │
└──────────────────┴──┘           └────────────────────────────┴──┘    └─────────────────────────────────────┘
Inner portrait swaps the vertical bar for a top bar (Back · centered Title · ⋯ · ＋ · status) and a bottom
tab bar with labels + a separate search button.
```

```text
MASTER DETAIL — outer: "List" (large title) + 6 rows   inner L: "Notes" list ~1/3 | "Design review" detail
┌ List ────────────────┬──┐       ┌ Notes ───────────────┬ Design review ──────────────┬──┐
│ ◯ Row title     9:41 │  │       │ ◯ Weekend trip   Fri │ ┌─────────────────────────┐ │  │
│   Supporting line    │  │       │[◯ Design review  Tue]│ │         Image           │ │  │
│ ◯ Row title     9:41 │  │       │ ◯ Reading list   Mon │ └─────────────────────────┘ │  │
│ … ×6                 │  │       │ ◯ Kitchen plans Sep 8│ ───────────────────────     │  │
│                      │  │       │ ◯ Garden       Sep 2 │ ─────────────               │  │
└──────────────────────┴──┘       └──────────────────────┴─────────────────────────────┴──┘
SIDEBAR DETAIL — outer: "Library" root list (Home, Saved, Shared, Recent, Reading list, Field notes)
inner L: "Library" sidebar ~0.3 width (Home selected; Collections: Reading list, Field notes, Archive)
         | "Design review" detail (image + text lines)
FEED — outer: "Feed" one column of image cards + 2 text lines each
inner L: "Feed" two columns of cards | "This week" supporting column of metric cards
         (Notes edited 14 · +3 since Monday / Shared 5 · +1 since Monday / Reminders 8 · 2 due today)
MEDIA + CONTEXT — outer: image, "Title of the episode", "Show name · 42 min", progress, ‹ (▶) 🔖, then
         "Up next" rows below
inner L: player (image, title, progress, ‹ (▶) 🔖) in a wide leading pane ~0.6 | "Up next" list trailing
         (one row highlighted)
MAP + PANEL — outer: full-bleed map, red pin, bottom card "Place name / Category · 12 min walk"
inner L: leading panel ~1/3 with the place card at the top | map fills the rest up to the bar
DASHBOARD — outer: "Overview" 2 × 2 metric cards (Label · 1,284 · +4.2% this week) + one bar chart
inner L: "Overview" 4 metric cards in one row + two bar charts side by side
```
Each template keeps the outer layout's content sizes and spends the inner width on the next level (detail, sidebar, supporting column, queue, panel, second chart) — the same rule as the patterns in `duo-community-patterns.md` §2.

### 9.2 System design of the kit

- Device state is modelled by the properties `Display`, `Orientation`, `Fold`, `Presentation`, `Content`.
- `Presentation` has three modes: Device, Screen Only, Guides.
- `Show System Chrome` hides the status bar for exports or immersive mockups.
- A component should **not** exist as six separate copies; one component set switches mode per state.
- Pane role and navigation role are a **semantic contract**; geometry is only one representation of that contract.

### 9.3 What is a Figma-only token

Logical frame size · guide overlays · column count / gap · content max width · illustrative corner radius · the community estimate of the folding band. Never use these as an `if device == Duo` condition in production code — production adapts to size class, container, safe area and reserved regions (`duo-foundations.md` §2).
