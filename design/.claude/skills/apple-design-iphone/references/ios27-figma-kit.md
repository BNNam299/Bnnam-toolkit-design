# Figma — Apple Design Resources: iOS and iPadOS 27 kit (Community)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/figma-ios27-kit.md @ 3c0e291 — translated, complete

Values below were read directly from the Figma file (read-only), kit version **27.1.0** (13 Sep 2026). They are the **real values in
the file**, not estimates. Use them as a **geometry template for mockups — not as fixed rules**: design for the current container
and never hard-code coordinates per device model (the system reports the real regions at runtime).

- **File:** <https://www.figma.com/design/U16qUqwvYEgBuYpGBjQOep/iOS-and-iPadOS-27--Community-> · fileKey `U16qUqwvYEgBuYpGBjQOep`
- **How to use:** reference for geometry, component names and variable names when building iOS 27 / iPhone Duo / iPad mockups. When
  the project uses the component kit, **enable the library** (or duplicate the file) and use instances — **do not redraw system
  controls**. With figma-agent, find kit components with `search_design_system` before drawing anything (`../figma-agent-tools/SKILL.md`).
- **Prerequisite:** install the latest SF Symbols before using the kit (page *Getting Started*). The kit is under the Apple Design Resources licence.

## Contents
1. File structure — 46 pages
2. Device frame sizes (pt)
3. iPhone Duo geometry — page `Safe Areas and Margins`
4. Variables — 6 collections
5. Styles
6. Components — catalogue read (20 / 31 pages)
7. Kit change log — changes that affect design
8. Extracted scope and what to do for the rest

## 1. File structure — 46 pages

`Cover` · `Getting Started` · **`Examples`** (sample screens per device) · `Colors` · `Materials` · `Text Styles and Dynamic Type` ·
**`Safe Areas and Margins`** · **`Product Bezels`** · `System` · `Action Sheets` · `Activity Views` · `Alerts` · `App Icons` · `Buttons` ·
`Color Pickers` · `Contextual Menus` · `Date and Time Pickers` · `Empty States` · `Face ID` · `Keyboards` · `Lists` · `Menus` ·
`Notifications` · `Page Controls` · `Popovers` · `Pop-up Buttons` · `Progress Indicators` · `Segmented Controls` · `Sheets` · `Sidebars` ·
`Sliders` · `Status Bars and Menu Bars` · `Steppers` · `Tab Bars` · `Text Fields` · `Toggles` · `Toolbars` · `Widgets` · `Windows` ·
`Change log` · `License` · `_Kit Helpers`

## 2. Device frame sizes (pt)

### 2.1 Screens — from page `Examples` (official mockup frames)

| Device | Screen / orientation | Size |
|---|---|---|
| iPhone (17 / 17 Pro / 18 Pro) | portrait | **402 × 874** |
| iPad (Examples sample, Pro 11") | landscape | **1210 × 834** |
| **iPhone Duo** | **Outer** — portrait | **466 × 678** |
| | **Outer** — landscape | **678 × 466** |
| | **Inner** — portrait | **669 × 951** |
| | **Inner** — landscape | **951 × 669** |
| | **Inner (Folded)** — landscape | **951 × 669** (same size, with a folding region) |

Kit variants are named by property: `Screen = Outer | Inner | Inner (Folded)` · `Orientation = Portrait | Landscape` · `Type = …`.

### 2.2 Device bezels — page `Product Bezels`

| Component | Variant | Size (including bezel) |
|---|---|---|
| iPhone 17 · 17 Pro · 18 Pro | colour | 402 × 874 |
| iPhone Air | colour | 420 × 912 |
| iPhone 17 Pro Max · 18 Pro Max | colour | 440 × 956 |
| **iPhone Duo** | `Display = Inner / Outer` · `Orientation` · `Color = Night Sky / Star White` | Inner 749 × 1031 (landscape 1031 × 749) · Outer 525 × 731 (landscape 731 × 525) |
| iPad Pro M4 11" | Silver / Space Gray | 1210 × 834 |
| iPad Pro M4 13" | Silver / Space Gray | 1376 × 1034 |
| iPad mini | — | 1133 × 744 |

## 3. iPhone Duo geometry — page `Safe Areas and Margins`

*Kit measurements only. How to adapt layouts across Duo displays and postures (vertical control bar, reserved regions, continuity) is
owned by `../iphone-duo-adaptive/SKILL.md`.*

Apple **annotates** safe regions with the `_Layout Overlays` set — `Type = Layout Margin | Safe Area Inset | Reserved Region` — placed in
a `Layout Guides and Safe Areas` frame over the screen. This is an **annotation layer for mockups, not a UI element**.

| Configuration | Measured parts |
|---|---|
| **Inner — landscape** (951 × 669) | **Vertical Bar** **84** wide on the hardware edge: group `Top` 48 × 343 · group `Bottom` = `Tab Bar - iPhone Duo` **48 × 270** · `Toolbar - Top - iPhone Duo` **84** high · Layout Margin **20** · Safe Area Inset 84 (bar edge) · **Reserved Region 84 × 119** |
| **Inner — portrait** (669 × 951) | **horizontal** bars: top Toolbar **84** high · `Tab Bar` **409 × 95** at the bottom · Layout Margin **20** both sides · Safe Area Inset top **84**, bottom **95** · **Reserved Region 151 × 84** |
| **Outer — landscape** (678 × 466) | Vertical Bar **84** · `Top` 48 × 90 · `Bottom` (Tab Bar) 48 × 270 · **Camera Punchout 48 × 42** · `Outer Display Lens` 96 × 96 · Layout Margin **20** · Safe Area Inset 84 |
| **Outer — portrait** (466 × 678) | Vertical Bar **84** · Camera Punchout 48 × 42 at the top · `Top` 48 × 302 · `Bottom` 48 × 270 · Layout Margin **20** · Safe Area Inset 84 · **Reserved Region 84 × 169** |
| **Sheet on Inner** | sheet **653 × 356**, vertical bar **76** inside the sheet, sheet toolbar **76** high, Layout Margin **16** (sheets use 16, screens use 20) |
| **Sheet on Outer** | landscape: sheet 662 × 458, vertical bar 84 · portrait: sheet 450 × 356, vertical bar 76 · Layout Margin **16** |

Reserved regions are **dynamic**: the inner camera region exists only while the camera is on; the folding region only while folded.
**These measurements are one mockup state** — the real regions are reported by the system at runtime.

## 4. Variables — 6 collections

### 4.1 `Colors` — Light | Dark (63 variables)

| Variable | Light | Dark |
|---|---|---|
| Labels/Primary | #000000 | #FFFFFF |
| Labels/Secondary | #3C3C43 @60% | #EBEBF5 @70% |
| Labels/Tertiary | #3C3C43 @30% | #EBEBF5 @30% |
| Labels/Quaternary | #3C3C43 @18% | #EBEBF5 @16% |
| Backgrounds/Primary | #FFFFFF | #000000 |
| Backgrounds/Secondary | #F2F2F7 | #1C1C1E |
| Backgrounds/Tertiary | #FFFFFF | #2C2C2E |
| Backgrounds/Primary - Elevated | #FFFFFF | #1C1C1E |
| Backgrounds/Secondary - Elevated | #F2F2F7 | #2C2C2E |
| Backgrounds/Tertiary - Elevated | #FFFFFF | #3A3A3C |
| Backgrounds (Grouped)/Primary | #F2F2F7 | #000000 |
| Backgrounds (Grouped)/Secondary | #FFFFFF | #1C1C1E |
| Backgrounds (Grouped)/Tertiary | #F2F2F7 | #2C2C2E |
| Backgrounds (Grouped)/Primary - Elevated | #F2F2F7 | #1C1C1E |
| Backgrounds (Grouped)/Secondary - Elevated | #FFFFFF | #2C2C2E |
| Backgrounds (Grouped)/Tertiary - Elevated | #F2F2F7 | #3A3A3C |
| Fills/Primary | #787878 @20% | #787880 @36% |
| Fills/Secondary | #787880 @16% | #787880 @32% |
| Fills/Tertiary | #767680 @12% | #767680 @24% |
| Fills/Quaternary | #747480 @8% | #767680 @18% |
| Separators/Opaque | #C6C6C8 | #38383A |
| Separators/Non-opaque | #000000 @12% | #FFFFFF @17% |
| Separators/Vibrant | #E6E6E6 | #1A1A1A |
| Accents/Red | #FF383C | #FF4245 |
| Accents/Orange | #FF8D28 | #FF9230 |
| Accents/Yellow | #FFCC00 | #FFD600 |
| Accents/Green | #34C759 | #30D158 |
| Accents/Mint | #00C8B3 | #00DAC3 |
| Accents/Teal | #00C3D0 | #00D2E0 |
| Accents/Cyan | #00C0E8 | #3CD3FE |
| **Accents/Blue** | **#0088FF** | **#0091FF** |
| Accents/Indigo | #6155F5 | #6D7CFF |
| Accents/Purple | #CB30E0 | #DB34F2 |
| Accents/Pink | #FF2D55 | #FF375F |
| Accents/Brown | #AC7F5E | #B78A66 |
| Grays/Gray | #8E8E93 | #8E8E93 |
| Grays/Gray 2 | #AEAEB2 | #636366 |
| Grays/Gray 3 | #C7C7CC | #48484A |
| Grays/Gray 4 | #D1D1D6 | #3A3A3C |
| Grays/Gray 5 | #E5E5EA | #2C2C2E |
| Grays/Gray 6 | #F2F2F7 | #1C1C1E |
| Grays/Black · Grays/White | #000000 · #FFFFFF | #000000 · #FFFFFF |
| Overlays/Default | #000000 @20% | #000000 @48% |
| Overlays/Activity View Controller | #000000 @20% | #000000 @29% |
| Labels - Vibrant/Primary · Secondary · Tertiary · Quaternary | #1A1A1A · #727272 · #BFBFBF · #D9D9D9 | #F5F5F5 · #8A8A8A · #404040 · #262626 |
| Labels - Vibrant - Controls/Primary · Secondary · Tertiary | #1A1A1A · #727272 · #BFBFBF | #F5F5F5 · #8A8A8A · #404040 |
| Fills - Vibrant/Primary · Secondary · Tertiary | #CCCCCC · #E0E0E0 · #EDEDED | #333333 · #1F1F1F · #121212 |
| Miscellaneous/Buttons/BG - Destructive | #FF383C @14% | #FF4245 @14% |
| Miscellaneous/Segmented Control - Selected Fill | #FFFFFF | #FFFFFF @27% |
| Miscellaneous/Tab Bar Selection | → Accents/Blue | #FFFFFF |
| Miscellaneous/Toggle/AX Label - Off | #B3B3B3 | #A6A6A6 |
| Miscellaneous/Sidebar/Sidebar - BG - Active · Inactive | #DAE6F2 · #EDF4FA | #141517 · #131414 |
| Miscellaneous/Keyboards/Emoji + Mic | #000000 | #FFFFFF |

Kit 27.0.0 **removed the Increase Contrast mode** from the Colors collection (change log) — check Increase Contrast on a device or in
Device Hub (Increased-contrast values: `../apple-hig/references/color.md` §Specifications).

### 4.2 `Dimensions` — iPhone | iPad (25 variables)

| Variable | iPhone | iPad |
|---|---|---|
| **Margin** | **16** | **20** |
| Status Bar/Height | 62 | 32 |
| Readable Content Margin | 260 | 260 |
| Sheet Top Radius | 38 | 32 |
| Sheet Bottom Radius | 58 | 32 |
| Popover Corner Radius | 38 | 38 |
| Grabber Width · Height | 60 · 4 | 60 · 4 |
| Home Indicator/Portrait Width · Landscape Width · Height | 144 · 226 · 5 | 273 · 315 · 5.5 |
| Menus/Menu Items/Title Font Size | → Size/Body | 15 |
| Menus/Menu Items/Title Line Height · Subtitle Line Height | 20 · 18 | 18 · 16 |
| Menus/Menu Items/Padding Top + Bottom · Padding Sides | 10 · 16 | 11 · 8 |
| Menus/Menu Items/Label and Subtitle Padding Left | 0 | 4 |
| Menus/Menu Items/Separator Padding Top · Bottom | 10 · 10 | 8 · 9 |
| Menus/Section Titles/Font Size · Top Padding · Bottom Padding | 13 · 4 · 10 | 12 · 5 · 7 |
| Menus/Control Group/Padding Top · Item Spacing · Symbol Height | 6 · 5 · 22 | 9 · 1 · 19 |

Note: the iPhone Duo **screen** margin on the Safe Areas page is **20** (overlay `Layout Margin: 20pt`) and the sheet margin is **16** —
read the overlay of each configuration; don't take one number for every device.

### 4.3 `Dynamic Type` — 12 modes (font size, pt)

| Style | Large (Default) | xSmall | Small | Medium | xLarge | xxLarge | xxxLarge | AX1 | AX2 | AX3 | AX4 | AX5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Large Title | 34 | 31 | 32 | 33 | 36 | 38 | 40 | 44 | 48 | 52 | 56 | 60 |
| Title 1 | 28 | 25 | 26 | 27 | 30 | 32 | 34 | 38 | 43 | 48 | 53 | 58 |
| Title 2 | 22 | 19 | 20 | 21 | 24 | 26 | 28 | 34 | 43 | 44 | 50 | 56 |
| Title 3 | 20 | 17 | 18 | 19 | 22 | 24 | 26 | 31 | 37 | 43 | 43 | 55 |
| Headline | 17 | 14 | 15 | 16 | 19 | 21 | 23 | 28 | 33 | 40 | 47 | 53 |
| Body | 17 | 14 | 15 | 16 | 19 | 21 | 23 | 28 | 33 | 40 | 47 | 53 |
| Callout | 16 | 13 | 14 | 15 | 18 | 20 | 22 | 26 | 32 | 38 | 44 | 51 |
| Subheadline | 15 | 12 | 13 | 14 | 17 | 19 | 21 | 25 | 30 | 36 | 42 | 49 |
| Footnote | 13 | 12 | 12 | 12 | 15 | 17 | 19 | 23 | 27 | 33 | 38 | 44 |
| Caption 1 | 12 | 11 | 11 | 11 | 14 | 16 | 18 | 22 | 26 | 32 | 37 | 43 |
| Caption 2 | 11 | 11 | 11 | 11 | 13 | 15 | 17 | 20 | 24 | 29 | 34 | 40 |

Leading for each size points to the `Text Leading` collection (modes Default | Loose | Tight, 132 variables) — *its values were not
read* (call limit, §8); Large-size leading is in `../apple-hig/references/typography.md` §Specifications. **Designs must hold up to AX5.**

### 4.4 `Kit` — Liquid Glass and type parameters

| Variable | Value |
|---|---|
| Liquid Glass/Opacity | 25 |
| Liquid Glass/Refraction | 70 |
| Liquid Glass/Dispersion | 20 |
| Liquid Glass/Light Angle | 0 |
| Liquid Glass/Depth - Regular · Medium and Large | 30 · 30 |
| Liquid Glass/Frost - Regular · Medium · Large | 6 · 16 · 16 |
| Liquid Glass/Splay - Regular · Medium and Large | 20 · 20 |
| Scroll Edge Effect/Blur Radius | 10 |
| Typography/Font family | SF Pro |
| Typography/Font Weight | Regular · Medium · Semibold · Bold · Regular Italic · Medium Italic · Semibold Italic |
| Typography/Letter spacing | Large Title 0.40 · Title 1 0.38 · Title 2 −0.26 · Title 3 −0.45 · Headline −0.43 · Body −0.43 · Callout −0.31 · Subheadline −0.23 · Footnote −0.08 · Caption 1 0 · Caption 2 0.06 |

`Icons` — 1 variable `Mode`: Light | Dark | **Clear Light** (icons have a transparent mode).

## 5. Styles

**34 text styles** (SF Pro, default size Large): Large Title Regular / Emphasized 34 · Title1 28 · Title2 22 · Title3 20 (Emphasized =
Semibold) · Headline 17 Semibold (+ Italic) · Body 17 (Regular · Emphasized Semibold · Italic · Emphasized Italic) · Callout 16 · Subheadline
15 · Footnote 13 · Caption1 12 · Caption2 11 — each has Regular / Emphasized / Italic / Emphasized Italic.

**50 paint styles:** `Colors/*` (12 accents) · `Backgrounds/*` · `Backgrounds Grouped/*` · `Fills/*` · `Grays/*` · `Labels/*` ·
`Separators/*` · **`Vibrant Fills/Light|Dark/*`** · **`Vibrant Labels/Light|Dark/*`** (text and fills on glass material). There are no effect
styles or grid styles — Liquid Glass is built with material components (page `Materials`).

## 6. Components — catalogue read (20 / 31 pages)

Notation: `SLOT` = slot property (free number of children), `=` = variant.

### Toolbars
- **Toolbar - Top - iPhone** — `Style = Default / Compact Large / Large Title / Title 2 Line / Title 2 Line Left` · Leading, Trailing: SLOT · Show Subtitle
- **Toolbar - Top - iPhone Duo** — `Style = Title / Compact Large / Large Title / Title 2 Line` · `Sheet = True/False` · Leading, Trailing: SLOT · Show Title / Leading / Trailing / Subtitle / **Show Reserved Region** / **Show Status Bar**
- **Toolbar - Top - iPad** — `Style = Title 2 Line / Title 2 Line Left / Compact Large / Large Title` · `Tab Bar = True/False` · Show Search
- **Toolbar - Bottom - iPhone** — `Type = Buttons / Buttons + Page Dots / Search / Search with Focus / Search + Trailing Item / Search + Leading Item` · Buttons Leading, Trailing: SLOT
- **Toolbar - Bottom - iPad** — Buttons Leading / Center / Trailing: SLOT
- internal: `_Buttons - 44pt` (Type = Symbol - Prominent / Symbol / Button Group / Text / Text - Prominent / Back) · **`_Buttons - 48pt`** — adds **`Preferred Axis = Horizontal / Vertical`** (buttons for the Duo vertical bar) · `_Back Bar Button Item` (Title, **Show Title default False**) · `_Button - Text / Symbol` (State = Default / Tinted / Selected / Disabled) · `_Search - 44pt / 48pt` · `_Search Accessory` · `_Title - iPhone Duo - Large Title` · `_Toolbar page control`

### Tab Bars
- **Tab Bar - iPhone** · **Tab Bar - iPhone Duo** — `Minimized = True/False` · `Tabs = 2/3/4/5` · `Type = Default / Search Role / Prominent Tab` (24 variants)
- **Tab Bar - iPad** — Buttons: SLOT · Show Sidebar · Show Search
- buttons: `_Tab Bar Button - iPhone` (Symbol + Label) · `_Tab Bar Button - iPhone Duo` · `_Tab Bar Button Round - iPhone / iPhone Duo` (Is Selected)

### Sheets
- **Sheet - iPhone** — `Detent = Medium / Large / Large (Stacked)` · Content: SLOT · Show Grabber · Show Dimming Layer
- **Sheet - iPad** · `Grabber` (Light/Dark) · `Overlay`
- Duo examples: `Type = Small / Medium / Large Detent / Full Screen` × `Screen = Outer / Inner / Inner (Folded)` × orientation

### Sidebars
- **Sidebar** — Sidebar Items: SLOT · `Floating Window = True/False` · **Sidebar Row** — `State = Default / Selected / Disabled / Disclosable` · `Indent Level = 0/1/2` · Section Header · Sidebar Search Field

### Status Bars and Menu Bars
- **Status bar - iPhone Duo** — `Type = Horizontal / Vertical` (vertical status on the edge axis) · Status bar - iPhone 17 Pro (402 × 62) · Status bar and Menu bar - iPad

### Windows
- Window · **Window with Sidebar** (`Mode = Active / Inactive`) · `_Window Controls` · `_Window Resize` (`Floating / Full Screen`)

### Buttons
- **Button - Content Area** — `Size = Small / Medium / Large` · `Style = Bordered - Prominent / Bordered / Borderless` · `Label Style = Title and Icon / Icon only / Title only` · Is Enabled · Destructive (108 variants)
- **Button - Liquid Glass - Text** — `Style = Glass Prominent / Glass` · Size · Is Enabled · Destructive · **Button - Liquid Glass - Symbol**

### Lists
- **Row** — `Height = Regular / Tall` · Show Image / Edit Button / Grabber / Subtitle / Trailing · Row - Button (`Default / Disabled / Destructive`) · **Row with Swipe Actions** (`Swipe = Left / Right`, 3 kinds) · Header (`Type = Nested / Prominent / Extra Prominent`) · Section Title · Grouped Table Footer · Index Bar (`Device = iPhone / iPad`)

### Menus · Contextual Menus · Popovers
- **Menu** — Menu Items: SLOT · **Menu Items** (State = Default / Destructive / Disabled · Menu has Selection · shortcut ⌘⇧⌥) · Menu Items - Submenus · **Quick Action** (= Control Group) · Edit Menu (Items: SLOT) · Separator · Section Title
- **Context Menu** — `Alignment = Vertical / Horizontal (iPad only)` · `Side = Trailing / Leading` · Dimming Overlay
- **Popovers (iPad Only)** — `Edge` 12 positions (Top / Leading / Trailing / Bottom × Leading / Center / Trailing)

### Alerts · Action Sheets
- **Alert** — `Button Layout = Side-by-Side / Stacked` · Actions: SLOT · Title · Message · Show Text Field
- **Action Sheet** — Actions: SLOT · Title · Message

### Controls
- **Segmented Control** — Segments: SLOT · `Size = Large / Small` · Is Enabled
- **Text Field** — `State = Placeholder / Focused / Typing / Value Entered`
- **Toggle - Switch** — `State = Idle / Pressed` · Is On · Is Enabled · Show AX Label
- **Sliders** — `State = Idle / Pressed / Disabled` · Value 0–100% · Show Symbols / Ticks
- **Stepper** · **Progress Bar - Determinate Linear** (height 4, Show Label) · **Spinner** (`Size = Small / Regular / Large`) · **Page Control** (`Pages = 1-6 / 7 / 8+`, SLOT)

## 7. Kit change log — changes that affect design

- **27.1.0 (13 Sep 2026):** added **iPhone Duo** symbols and examples — Keyboards, Toolbars, Tab bars, Status bars, Sheets · added iPhone Duo,
  iPhone 18 Pro / Pro Max bezels · updated app icon
- **27.0.3 (14 Aug 2026):** Sheets — iPad sheet toolbar button inset 16 → **10** · iPad sheet radius 38 → **32** · iPhone sheet radius bound
  to a variable · grabber width 58 → **60**
- **27.0.0 (23 Jun 2026):** removed the link to the *Liquid Glass appearance mode* collection · **Colors dropped the Increase Contrast mode** ·
  Materials: every Liquid Glass component updated, Scroll Edge Effect soft / hard; `Liquid Glass - Regular` property State → **Prominent**
  (boolean) · Action Sheet, Alert: buttons became a **slot**, "Description" → **"Message"** · Alert: button text Medium → **Semi-Bold** ·
  Buttons: "Tinted" → **Style = Glass / Glass Prominent**, added disabled, 3 sizes, **secondary button removed** · Keyboards: accessory split
  into its own component, accessory toolbar uses a slot · Lists: row fill added, swipe actions have symbol + label · Menus: **iPhone / iPad
  types removed, differences moved into the variable collection** · Quick Actions → **Control Group** · Page Controls: unselected dots use
  **Tertiary Label** · Popovers: Edge and Alignment split into two properties · Progress: height 6 → **4** · iPhone Sheets merged into one
  component with 3 detents · Segmented Control: slot, added disabled, tapped, Large size · Sidebars: **edge to edge**, Liquid Glass buttons ·
  Tab Bars: slot for tab count, **"Separate Search" → "Prominent Tab"**, minimized tab bar has a diamond icon · Toggles, Sliders: added
  pressed, disabled · Toolbars: active / inactive property (window state); Back Button **Show Title default False**, Semibold chevron; Title
  bound to Subheadline tight + emphasized; bottom buttons use a slot · Widgets: Liquid Glass, added **XL for iPhone** · Windows: added split
  view window type active / inactive

## 8. Extracted scope and what to do for the rest

20 of 31 component pages were extracted (Figma MCP call limit at read time). **Not extracted:** `System` · `Keyboards` (other than the Duo
examples in §2) · `Widgets` · `Materials` · `Notifications` · `Date and Time Pickers` · `Empty States` · `Face ID` · `Color Pickers` ·
`Activity Views` · `App Icons` · `Pop-up Buttons` · the page layouts of `Colors`, `Text Styles and Dynamic Type` (their values are already
in the variables) · the values of the `Text Leading` collection.

Do **not** open the kit file to study it further during project work. When you need a component from a non-extracted page in order to
**build**, use an instance from the kit library enabled in the design file (check the enabled libraries first) and read the properties of
that instance itself.
