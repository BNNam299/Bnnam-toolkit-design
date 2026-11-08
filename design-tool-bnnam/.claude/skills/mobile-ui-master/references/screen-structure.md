# Designer screen structure — measured from real screens

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/designer-screen-structure.md @ 3c0e291 — translated, complete

This is the **designer's standard**, read read-only through Figma MCP from the designer's own files. Every number below is **measured, not
estimated**. How to apply it:

- **Structure** follows this standard in **every** project.
- **Appearance** (specific colours, fonts, radii) follows each file's own system.
- When the project has its own **template screen**, that template wins for that project.

## Contents
0. Sources
1. Screen frame — general rules
2. Top Container
3. Content
4. Lists / settings
5. Bottom Container
6. Sheets and popups
7. By screen type — cases (7b: templates per screen type, Screentime)
8. Text, colour, icons, tokens
9. Sections, names, where other things go
10. Applying the standard
11. iPhone Duo frame packaging

---

## 0. Sources

| Role | File · node | What was read |
|---|---|---|
| **Structure standard** — chosen by the designer | *Screentime Control F1 iOS_UI* `ajmyRiO9ZER1fRAgLS97ak` · page `UI Design` (`117:490`) | **117 screens / 18 sections** fully analysed · 2 screens + 5 frame components layer by layer · **17 representative screens by type** (§7b) |
| **Welcome** · **IAP** case | *Sketra AR Drawing iOS F2* `efjFDeYO1RmKnfRmPIFYD9` · `3285:13884` (Welcome) · `3288:15608` (`pw_us_3`) | 2 screens |
| **IAP — Subscription Sale** (iOS) | *HOME AI F3 iOS* `hhqStAdOlOaCzpc04cZW5c` · `1825:141` | 1 screen |
| **IAP — Subscription Sale** (Android) | *Home AI F2 ADR* `etcCWdZjj95iNtm4reSd51` · `10335:17911` | 1 screen |
| **IAP as a component** · **Reward Ads popup** | *Calories AI F1 iOS* `bBV5Fa1ZyAsx87ZLLuthDK` · `35076:30535` · `35111:41865` | 2 nodes |
| **iPhone Duo packaging standard** | *AR Drawing F1 iOS* `rx6BzsnVlNbp9BpdNi9Oxb` · section *Update: Drawing Flow - iphone Duo* (page `17053:4296`) | **31 Duo screens** + 8 iPhone screens of the same family — §11 |

## 1. Screen frame — general rules

Measured on 117 Screentime screens, consistent across every case:

- **Screen root `layoutMode NONE` — 117 / 117.** No auto layout at the root — **except** Duo variants with a vertical bar (Outer, Inner Landscape): root is HORIZONTAL (§11).
- **Size:** 402 × 874 (114 screens — iPhone 17 Pro) · long scrolling screens stretch the frame taller (402 × 1444, 402 × 1685). Existing projects (390 × 844, 393 × 852…): build new screens at the size of the screens already designed in that file, keeping their aspect ratio.
- **Root radius 44** (device corner) · **root fill is a surface token** (`surface/container_secondary` 65 screens · `surface/background_secondary` 24 · `surface/background` 22) — never a raw colour.
- **Layer order, bottom → top:**

```text
<Screen>                               FRAME · NONE · 402 × 874 · r44 · fill $surface/…
├─ Background/<name>                   INSTANCE — BOTTOM-MOST LAYER (when the screen has a visual background)
├─ Content                             VERTICAL auto layout · width FILL — the scrolling content
├─ Bottom Container                    auto layout · pinned to the bottom — CTA / tab bar / keyboard + bottom safe area
├─ Top Container                       VERTICAL auto layout · HUG — top safe area + toolbar · ABOVE Content so scrolling content slides under it
├─ Scrim                               INSTANCE (Overlay) — only when there is a sheet / popup
└─ Bottom sheet / Popup                FRAME — top-most
```

  Most common frames in Screentime: `Content | Bottom Container | Top Container | Scrim | Bottom sheet` (14 screens) · `Background/Default |
  Content | Top Container | Bottom Container` (10 screens with a background).
- How the background instance binds to the system: `../screen-background/SKILL.md`.
- **The three main blocks are FRAMES BY DEFAULT** (`Top Container`, `Content`, `Bottom Container`). Only a block that **repeats a lot** becomes a
  component. Procedure: build the first screen with frames → at the second screen, any block whose **structure is identical** to the first
  screen's becomes a component (made from the first screen's block) and the block on both screens is replaced by an instance. Different text stays
  as overrides; the main component goes in a separate section. A block with a different structure stays its own frame.
  (Componentize/clone helpers: `../figma-project-maintain/SKILL.md`.)

## 2. Top Container

| Part | Measured |
|---|---|
| **`Top Container` component** | VERTICAL · gap 0 · pad 0 · HUG · 402 × 136–158 |
| `Safe Area` | **60 high** in the Screentime file — instance of the `Safe-Area` component (`Position = Top / Bottom`) · **new builds use Apple's number: 62** for a 402 × 874 frame (`../bnnam-standards/references/frame-standards.md`) |
| `Toolbar_Top` | **76 high** · HORIZONTAL · pad `$spacing/2*8` (16) on all four sides · variants `Styles = L IC Button - Cen Title - R IC Button / … - R Button` · title absolutely centred (`Label/lg-emphasized`, `$content/primary`) · icon buttons 44 × 44 (`Icon Button` Size M, Fill, `r $border radius/round`; left Tertiary `$surface/overlay_dim_2`, right Primary `$surface/action_default`) · many boolean / instance-swap properties (Show icon 1–3, Leading / Trailing icon) |
| `Pagination` (optional) | 22 high · pad 8, 36 — onboarding page dots |
| inside a sheet | `Toolbar_Sheet_Top` 76 high, pad 16 |
| IAP screen | `Safe area_top` 60 + `Toolbar` **48 high**, horizontal pad 16: *Restore Purchase* (Caption 12) + round close button 28 (`$Color/Filled/White 10%`, r24) |

**The safe area is ALWAYS an instance of the `Safe-Area` component** — never reserve it with padding-top (the old way, seen in the Calories file).
The standard component in **every file** is `Position × Device` (`../bnnam-standards/references/frame-standards.md`; the designer's main
component: AR Drawing `17393:103911`). Reason: the `Safe-Area` component **will gain more variants** (today `Position = Top / Bottom`) — change it in
one place and every screen follows.

## 3. Content

- VERTICAL · width FILL · **common padding**: `24` on all four sides (13 screens) · `8, 16` (10) · `24, 16` (8) · `16, 24` (5) · `0, 24` (4) — written as (vertical, horizontal); a single number = all four sides.
- Measured in this file: **gap between sections 48** (24 screens) · inside a section **24 / 16 / 8**. These are one file's values, not the rule —
  the designer's standard is gaps chosen by relationship: sections usually **20–24** (48 is too big for mobile), elements / cards **6–12**
  (`../SKILL.md` §2). Grouped lists use smaller gaps between titled groups (§4, Settings g16).
- Usually opens with the **`Headline + Subheadline`** component, followed by containers named by role: `Selections Container`, `Categories Card`,
  `Icon State Container`, `Section 1 / 2 / 3`.
- Each content block = **header (title `Headline/xs-emphasized` + chevron) + body** — e.g. `Summary Container`, `Group Container`.
- **Horizontally scrolling cards**: `Group Cards` HORIZONTAL gap 12, cards 216 × 260, r36, pad 16 — instances with variants `Types` × `States`.

## 4. Lists / settings

```text
Group List                             VERTICAL · gap 8 · pad 8, 16
└─ Table row Container                 VERTICAL · horizontal pad 16 · fill $surface/container_primary · r21     (in a sheet: $surface/recessed_1 · r28)
   ├─ <Row>                            HORIZONTAL · gap 10
   │  ├─ icon tile                     36 × 36 · round r999 · fill $surface/container_tertiary · 20 icon inside
   │  └─ Table row item                INSTANCE · Types = Headline + Sub + Toggle / Headline + Sub / Headline + Selections · vertical pad $spacing/2*6 (12) or $spacing/2*8 (16)
   ├─ Divider                          INSTANCE · between rows
   └─ <Row> …
```

Rows of one group share **one** container with dividers — not one card per row.

## 5. Bottom Container

| Screen type | Measured |
|---|---|
| **CTA** (Screentime component) | VERTICAL · gap 24 · **pad 0, 24, 44, 24** (top, right, bottom, left — the 44 bottom includes the home-indicator area) · `Button` Size XL **56 high**, Fill, Primary, `$surface/action_default`, `r $border radius/round` |
| **IAP** | `Actions` VERTICAL gap 10, horizontal pad 16: commitment line (*Secure payment via Apple. Cancel anytime*, Caption 12) → CTA 50 high, gradient, r200 → `Policy` (12 high) — then **`Safe area_bottom` 34** |
| **Welcome** | VERTICAL gap 10 · pad 0, 16, **52**, 16: title 34 + description (Body 16 Medium) → CTA 56 r32 |
| **Data entry** | `Bottom Container` = `Keyboard` (13 screens) |
| **Tab bar** | `Tab Bar` instance · Calories version: **floating pill tab bar** (r999, 278 × 60, pad 4) over a fading gradient mask layer 148 high |
| **Two buttons** | a HORIZONTAL frame holding 2 `Button`s |

## 6. Sheets and popups

- **`Scrim`** (instance, `Overlay` covering the whole screen) → **`Bottom sheet`** frame VERTICAL · bottom pad **34** · fill `$surface/container_primary`.
- Inside: `Toolbar_Sheet_Top` 76 (pad 16) → `Content` (pad 16, gap ~19) → `Bottom Container` (if it has buttons).
- Cards inside a sheet: `$surface/recessed_1`, **r28**; selection rows are `Table row item` Types = Headline + Selections, separated by `Divider`.

## 7. By screen type — cases

| Type | Measured structure |
|---|---|
| **Welcome** (Sketra) | hero visual fills the top part (usually full-bleed) → `Bottom Container` pinned to the bottom: large title 34 + description + CTA. The CTA has a **glowing visual layer** (absolute ellipse, layer blur) — a visual zone inside the button |
| **Onboarding** (Screentime) | `Top Container` has `Pagination` · `Content` opens with `Headline + Subheadline` + a selection area · `Bottom Container` CTA · named `Onboarding-<Step>_Step n` |
| **IAP / Paywall** (Home AI F2 Android + F3 iOS, Sketra, Calories) | `Background/<name>` instance at the bottom → `Top container` (safe 60 + toolbar 48: Restore Purchase + close) → `Content` pad 24 gap 20: `Header` (large headline 36 + subtitle Title 2 Semibold) · offer / ticket block (r21–29) · price row (original price → sale price, `Heading/H3`) · countdown · note → `Bottom container`: commitment + CTA + Policy + safe 34. **The same frame for iOS and Android** (evidence that one structure serves both platforms) |
| **IAP screen as a component** (Calories) | the whole screen is a COMPONENT: a `background` frame (decorative vectors, gradient) + `Content` with a `Light Decoration` group placed absolutely |
| **Popup / Reward Ads** (Calories) | a full background screen (background → content cards r36 → top container → bottom container with floating tab bar) + a popup layer on top |
| **Detail sheet** (Screentime Group Detail) | §6 |
| **Settings** (Screentime Settings) | `Top Container` + `Group List` (§4) — background `$surface/background_secondary` |

Paywall and offer patterns in depth (offers, pricing, Amobear samples): `monetization-screens.md`.

### 7b. Templates by screen type — Screentime (17 sections, representative screen, frame read 3 levels deep)

Notation: `TC` Top Container · `C` Content · `BC` Bottom Container · `g` gap · `p` pad (top-and-bottom / horizontal) · numbers in pt. Layer order per §1.

| Screen type | Representative screen | Frame |
|---|---|---|
| **Onboarding — question** | `Onboarding-Question_Step 1` (7 screens) | `TC` = Safe Area 60 + `Toolbar_Top` 76 + **`Pagination` 22** · `C` vertical **g48 p24**: question `Headline/sm` + `Selections Container` g10 of `select item` 56 (r32, p16 / 20) · `BC` g24 p0 / 24: `Button` 56 r999 |
| **Home — group list** | `Home-Groups_Result` | `TC` · `Group List` g8 p8 / 16 of `Group_Horizontal Items` cards 370 × 127 (r32, g19, p16 / 20) |
| **Home with detail sheet** | `Home-Group Detail-Quick Block_Result` | `C` · `BC` · `TC` (three instances) → `Scrim` → `Bottom sheet`: `Toolbar_Sheet_Top` 76 + `Content` g19 p16 (`Count Container` + list) |
| **Choose a mode — popover** | `Home-Create Group-Choose Mode` | background screen → **`Popover Container`** vertical **p72 / 16** (pushed below the toolbar) holding `Select Group Mode` r28 — a popover anchored below the top bar, not a sheet |
| **Card feed — 2-column grid** | `Focus-For You_Result` | `TC` · `Group List` g12 p8 / 16 → **horizontal rows g12**, each row 2 `Focus Card`s 179 × 224 (r28, p24 / 16) — the grid is built from auto-layout rows, not a grid |
| **Player / session** | `Focus-Session Player_Result` | `TC` · `BC` vertical g20 **p60 / 24**: session-name pill (r999, `Label/lg-emphasized`) + **timer pill** 354 × 68 (r999, digits `Title/md-emphasized`) + controls |
| **Settings** | `Settings_Result` | `C` vertical g16 p0 / 16: **upsell card `Offer Visual`** (r24) at the top → `Section n` g8 = `Title` (horizontal p0 / 8) + `Table row Container` r21 · `BC` · `TC` |
| **Edit — form by section** | `Home-Edit Group-Open Limit_Result` | `TC` = Safe Area + **`Toolbar_Sheet_Top`** (edit screens use the sheet-style bar) · `C` g19 p8 / 16: `Section` = `Headline Container` (horizontal p0 / 16) + `Table row Container` (**single row: r999 pill** · several rows: r28) · bottom bar **2 buttons side by side** 181 × 52 |
| **Delete / confirm — sheet** | `Home-Edit Group-Delete_Step 1` | edit screen → `Scrim` → `Bottom sheet`: `Toolbar_Top_Sheet` 78 · glass icon `Iconly/Glass/Info` 93 × 80 + text · 2 buttons side by side 180 |
| **Premium lock — sheet** | `Premium Off-Group Detail_Locked` | detail screen → `Scrim` → `Bottom sheet`: `Count Container` + list r28 → **2 buttons stacked** 52 |
| **Block screen (shield)** | `Block Screen-Open Limit` | **no TC** · `C` vertical **g98 p24**, centred: app icon + prompt `Headline/sm-emphasized` + secondary text · `BC` g10 p24 / 16: **2 buttons stacked** 52 r999 |
| **Waiting / barrier** | `Home-Edit Group-Barrier_Pending` | **visual fills the whole screen** (`Waiting Animation`: layered polygons) · title `Headline/md-emphasized` · `BC`: **progress pill** 56 r999 (rectangle filling up + *"Wait for 5s"*) · `TC` |
| **Paywall** | `Paywall 1` | `Background/Default` (ellipse + blur + illustration) → **`ScrollableContent`**: `TC` (Safe area_top + `PaywallHeader` 36) + `Body` g40 p24 / 16 (hero + `Plans` g10) → **`PaywallFooter`** g12 p8 / 16: `TrustBadge` (`Body/xs`) + `Button` **60** r999 + `Policy` (Privacy · Restore · Terms, separated by bars) |
| **Celebration — streak** | `Streak_Step 1` | background screen → `Scrim` → `Streak Content` g24 p0 / 24 centred: `Streak Badge` (flame + number **overlapping, g−8**) |
| **Passcode entry** | `Passcode-Reset_Step 1` (18 screens) | `TC` = **`Safe-Area` instance** + `Toolbar_Top` 68 (icon buttons 44) · `C` g24 p24 / 16 · **`BC` = `Keyboard` 318** |
| **Locked while editing** | `Turn Off Hard Mode Flow_Step 1` | edit screen · `BC` = **`Locked Note`**: glyph 14 + `Body/sm`, **no background** |
| **First-try flow** | `First Try-Open Limit-Home_Result` (26 screens) | `C` · `BC` · `TC` — three component instances, Home screen frame |

**Further patterns drawn from the 17 types:**
- Overlays come in three forms, chosen by the job: **sheet** (edit, confirm, lock) · **popover** anchored below the top bar (quick mode pick) ·
  **scrim + centred content** (celebration, big announcement).
- Two buttons: **side by side** when they are equals (Cancel / Save) · **stacked** when one is primary (shield, Premium lock).
- **Full-screen screens that need no navigation** (shield, barrier) drop `TC` or keep it minimal; content is centred with large spacing (g98).
- `Table row Container` with **one row → pill radius r999**; several rows → r21 (screen) / r28 (sheet, form).
- Edit screens use **`Toolbar_Sheet_Top`** even as full screens — it signals the "editing" context.
- Card grids are built from **horizontal auto-layout rows** (2 cards per row), not a grid.

**Adaptive versions of each type** (multi-device projects): look up the pattern of the same type — feed, master–detail, messaging, media, maps,
e-commerce, dashboard, settings, calendar, list–detail, grid, form + keyboard, editor, game — in `../iphone-duo-adaptive/SKILL.md`. The templates here
are the compact versions.

## 8. Text, colour, icons, tokens

- **Text styles** (Screentime): `Label/lg-emphasized` · `Headline/xs-emphasized` · `Body/md-emphasized` · `Label/lg` · `Body/xs-emphasized` ·
  `Label/md-emphasized` · `Body/sm-emphasized` … — pattern *Group/size(-emphasized)*. Text colours: `$content/primary · on_action · brand · tertiary ·
  secondary · Quaternary · inverse_*` · `$color/alpha/white/70`.
- **Icons:** **SF Symbols** glyphs set as text (size 14–23, coloured with tokens — which is why there are many "raw" text sizes 14 / 16 / 20 / 23) or
  iconify vector icons (`solar:*`, `reicon:*`) 20 × 20 in a 36 tile.
- **Spacing:** variables of the form `$spacing/2*N` (= 2 × N: `2*4` 8 · `2*5` 10 · `2*6` 12 · `2*8` 16 · `2*9` 18) — used **inside components**.
  **Padding / gap of layout frames inside a screen** (Content, section containers, rows) **are raw numbers ON PURPOSE** — an audit should only note
  them (raw spacing in a screen layout frame), not report them as errors, and must not auto-bind them.
- **Corner radius:** `$border radius/round` (pill) · 21 (list cards) · 28 (cards in a sheet, summary cards) · 36 (large cards) · 44 (screen root).

> Overrides the tool demo: `figma-ui-flow` core rule 1 treats any unbound spacing as a defect. Do not follow that — raw padding/gap on
> screen-level layout frames is intended; component internals still bind `$spacing/…`.

## 9. Sections, names, where other things go

- Section title frame **116 high**, named `— <name>` (e.g. `— Hardmode On`).
- **Flow arrows** are vectors named `"<screen> --> <screen>"`, 112 × 9, placed between screens in a section — readable by
  `../figma-project-maintain/scripts/flowmap.js`.
- Local components live inside the section (`Table row Container`, `Button`, `Headline + Subheadline`); when cloning a screen, the main component
  stays in that screen / section.
- Screen name `Flow-path_State` (`Home-Group Detail-Open Limit_Partial`, `Set Passcode Flow_Step 5`) — per `../bnnam-standards/references/naming.md`.

## 10. Applying the standard

- **New project without a template screen** → build per §1–6. Project with its own template screen → the template wins (project-level standard).
- **By screen type** → template in §7; compare the built screen with the template of the same type using `scripts/skeleton.js`.
- Specific values (pad 24, toolbar 76, CTA 56; gaps by relationship — sections 20–24, elements 6–12, `../SKILL.md` §2) are the **designer's defaults** when the file has no other convention — if the project
  file has its own tokens / components, appearance follows the file.

## 11. iPhone Duo frame packaging — designer standard

The rules distilled from these measurements: `../bnnam-standards/references/frame-standards.md` §9. This section keeps the measured detail.

Source file: *AR Drawing F1 iOS*, section "Update: Drawing Flow - iphone Duo" (31 Duo screens + 8 iPhone screens). The designer notes they do not
yet know the exact safe area for some positions and adjusted by hand, **but top and bottom safe areas are still required** in principle.

Each screen has **four versions side by side in one section**, named by variant suffix (`../bnnam-standards/references/naming.md`):
`<screen>` (iPhone 375 × 812) · `<screen>_Outer` (466 × 678) · `<screen>_Inner` (669 × 951) · `<screen>_Inner Landscape` (951 × 669).
The packaging is **consistent across all 31 screens**:

### 11.1. Two configuration families

| | **Horizontal bar** — iPhone · **Inner** (portrait) | **Vertical bar** — **Outer** · **Inner Landscape** |
|---|---|---|
| screen root | **`NONE`** (as the iPhone standard §1) | **HORIZONTAL auto layout**, gap 0, pad 0 — a deliberate exception |
| frame | Top · Content · Bottom Container (§1) | the **panes** → **`Pane controls`** (last layer, at the hardware edge) |
| top block | iPhone: top component (108 = `Safe-Area` Top **60** + toolbar 48) · Inner: the kit's **`Toolbar - Top - iPhone Duo`** (84, already contains `Status bar - iPhone Duo` `Type = Horizontal`) | none — the status sits **inside** the vertical bar |
| bottom block | vertical `Bottom Container`: step content + **horizontal** `Bottom Toolbar` + **`Safe-Area` Bottom** (iPhone 34 · Inner Portrait 24) | CTA lives inside the pane · **no `Safe-Area` — padding left 20 / top 24 / bottom 24, edge touching the vertical bar 0** · the 84 edge = `Pane controls` |
| horizontal margin | iPhone **16** · Inner **20** | **padding ≥ 20** (Apple's margin on Duo) — measured in the AR Drawing file: Outer Bottom Container pad 24 / 16 (horizontal 16 — below Apple's value) · Inner Landscape: pad 24 |

### 11.2. `Pane controls` — the vertical bar is a component

```text
Pane controls                         COMPONENT · 84 × screen height · VERTICAL · gap 24 · pad 30, 24, 24, 12 · height FILL
├─ Status bar                         INSTANCE · VERTICAL 44 × 118 (Dynamic Island = On — Outer) · 44 × 68 (Dynamic Island = Off — Inner Landscape)
└─ Controls                           VERTICAL · gap 16
   ├─ Container (top group)           VERTICAL · gap 10 — primary actions: Symbol · Symbol - Prominent
   └─ Container (bottom group)        VERTICAL · gap 10 — Symbol · Group - Vertical 48 × 212 · Symbol
```

**Same actions, same order as the iPhone version** — the iPhone's horizontal `Bottom Toolbar` (Symbol · `Group - Horizontal` · Symbol) becomes the
bottom group of the vertical bar (Symbol · `Group - Vertical` · Symbol): keep the identity and order of items, change only the axis. Buttons are
48 × 48 from the `Buttons` component (`Type = Symbol / Symbol - Prominent / Group - Horizontal / Group - Vertical`).

### 11.3. Pane split

| Variant | Panes | What goes where |
|---|---|---|
| **Outer** 466 × 678 | **one** `Content pane` **382** (= 466 − 84) — VERTICAL gap 48: `Content` (FILL) + `Bottom Container` (CTA, pad 24 / 16) | main content + CTA in the same pane |
| **Inner Landscape** 951 × 669 | **`Leading pane` 266** (or 318) + **`Content` / `Trailing pane` 601** (or 549) + vertical bar 84 | **CTA and step controls move to the leading pane** (top pad 24, Bottom Container pad 24) · canvas / main content in the large pane |
| **Inner** 669 × 951 | one column like iPhone | iPhone frame, the kit's top bar, margin 20 |

### 11.4. Other

- Overlays (`Menu · Color Mode` 238 × 96) are placed **absolutely at root level**, at the same relative position in every variant.
- This project's iPhone screens are 375 × 812 (an older size) — size follows the project, structure follows the standard.
- Safe area: `Safe-Area` appears **only** in horizontal-bar frames (iPhone; Inner portrait: Bottom). Vertical-bar frames (Outer, Inner Landscape)
  get **no empty Safe-Area frame**: padding left ≥ 20 · top ≥ 24 · bottom ≥ 24 · **edge touching the vertical bar = 0**, content runs right up to
  `Pane controls`. Measured: Outer `Bottom Container` pad 24 top / bottom · Inner Landscape `Leading pane` top pad 24, `Bottom Container` pad 24.
  Known deviation still in the file: `Bottom Container` of Outer on screen `Lesson_Result` has horizontal pad 16 (below 20) and right pad ≠ 0 —
  waiting for the designer to fix; do not copy it.

### 11.5. Expanded states — panels, overlays and popovers move per frame

The same state is placed **differently** in each frame but keeps **the same content and the same actions**:

| State | iPhone · Inner portrait | Outer | Inner Landscape |
|---|---|---|---|
| **Steps** (list of steps) | horizontal panel inside `Bottom Container`, **above** `Bottom Toolbar` | `Steps Panel` inside the pane's `Bottom Container` (pad 24 / 20) | **vertical glass panel in the `Leading pane`** (pad 8, `Liquid Glass - Regular - Large`, 2-column grid) — the whole list is revealed |
| **Camera** (photo / video) | bottom overlay | overlay inside `Bottom Container` | overlay **absolute at root level**, anchored to its source, top-most layer, **does not dim the background** — the component name states the rule: *"Steps Overlay · neo nguồn, trên cùng, không dim"* ("anchored to source, top-most, no dim") |
| **Opacity** | bottom slider | inside `Bottom Container` | popover inside the `Bottom Container` of the **content pane** (pad 24) |
| **Step buttons** (Stepper) | bottom centre, above `Bottom Toolbar` | bottom of the pane | **bottom corner of the `Leading pane`** (`Bottom Container` pad 24) |
| **Bottom Toolbar** (tool group) | horizontal at the bottom | moves to the **vertical bar** (Symbol · `Group - Vertical` · Symbol) | moves to the vertical bar |

**Pattern:** **horizontal-bar** frames keep everything at the bottom · **vertical-bar** frames push the tool group into `Pane controls`, while content
panels stay in the pane · **Inner Landscape has room** → a panel that needs a lot of area (Steps) becomes a **left pane** instead of a bottom strip;
short overlays (Camera) float on top, anchored to their source, without dimming. Apply together with the adaptation rule "keep the presentation
style" in `../iphone-duo-adaptive/SKILL.md`.
