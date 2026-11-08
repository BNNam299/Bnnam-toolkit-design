# Visual foundations: typography, colour and theme, icons and media

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/typography.md, knowledge/color-theme.md, knowledge/iconography-media.md @ 3c0e291 — translated, complete

Knowledge here is a lens for thinking, not a procedure. Platform detail: `../apple-hig/SKILL.md` (typography, color, materials, icons pages) and
`../material-design-3/SKILL.md` (styles__ typography/color/icons, foundations__ pages). Token naming and scales for Figma: `../figma-ui-flow/references/design-system.md`.

## Contents
1. Typography
2. Colour, theme and materials
3. Black for the app's main background
4. Icons, images and illustration
5. Related numeric rules elsewhere

---

## 1. Typography

### 1.1. Goals

Typography must:

- Be readable in real conditions.
- Show a clear hierarchy through size, weight, spacing and position.
- Scale with user settings and language.
- Not depend on too many fonts/weights.

### 1.2. iOS

- Prefer **SF Pro / the SF system font** and text styles so Dynamic Type adapts automatically.
- Use semantic styles by role: large title, title, headline, body, callout, subheadline, footnote, caption.
- Avoid hard-coded line heights and frames that clip text.
- No ALL CAPS for long passages; consider readability and VoiceOver.
- Keep the hierarchy when text is enlarged: you may change the layout instead of keeping exact ratios between every style.

### 1.3. Material 3

M3 now has **30 type styles**:

- 15 baseline styles.
- 15 emphasized styles for moments that need emphasis.

Five main roles:

| Role | Use |
|---|---|
| **Display** | very prominent messages, few words |
| **Headline** | section / screen titles |
| **Title** | component or content-group titles |
| **Body** | main reading content |
| **Label** | buttons, tabs, chips and controls |

Each role has large / medium / small. A typography token should define font family, size, line height, weight, tracking and, when needed,
variable axes. Use emphasized styles selectively to raise hierarchy — do not turn every title into a "hero".

### 1.4. General rules

- A screen usually needs only a few clear hierarchy levels.
- Body text needs a moderate line length and enough line height.
- Do not use very thin weights at small sizes.
- Test Vietnamese with diacritics, numerals, symbols, emoji and tall-script languages.
- Longer translated content must wrap naturally.
- Never put important text inside an image.

## 2. Colour, theme and materials

### 2.1. Semantic colour

At the component level, never name tokens after the visible colour (`blue500`). Use roles:

- `background`, `surface`, `surfaceContainer`.
- `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`.
- `secondary`, `tertiary` and their `on...` pairs.
- `error`, `warning`, `success`, `info` if the design system defines them.
- `labelPrimary`, `labelSecondary`, `separator`, `link` in the iOS model.

Values may change between light / dark / high contrast, but the token's meaning stays the same.

### 2.2. iOS dynamic colours

- Prefer system / semantic colours over hard-coded values.
- iOS has primary, secondary and tertiary background levels for normal and grouped content.
- Foreground has label, secondaryLabel, tertiaryLabel, placeholder, separator and link.
- Never change the meaning of a system token — e.g. using separator as a text colour.
- Test light/dark, Increase Contrast, Reduce Transparency, and backgrounds made of images/video.

### 2.3. Liquid Glass

Per the current HIG, Liquid Glass takes colour from the content behind it and adjusts itself to keep separation. How to use it:

- Use it for the navigation/control layer; do not turn every content card into glass.
- Tint selectively — for the primary action or a state that needs emphasis.
- Over colourful backgrounds, prefer monochrome icons/text to stay readable.
- Avoid several controls all having prominent coloured backgrounds.
- Always check the resting state; do not rely on the system "rescuing" contrast in every situation.
- Content belongs on its own layer; glass helps distinguish controls/navigation.

Deep dive: the `liquid-glass-design` skill (if installed) and `../apple-hig/SKILL.md` (materials).

### 2.4. Material colour system

M3 includes:

- Colour relationships generated to maintain contrast.
- More than 26 colour roles by emphasis, container and foreground/background relationship.
- Baseline light/dark schemes.
- **Dynamic colour** from the wallpaper or content.
- Three contrast levels: standard, medium, high.
- Fixed colours for cases that must keep their colour across light/dark.

Dynamic colour must keep important semantic colours such as error, or brand-critical colours, when changing them would mislead. Always check that
the content colour (`on...`) is paired with the right container.

### 2.5. Elevation

Material uses elevation to describe z-axis relationships:

- M3 prefers **tonal surface colour** and uses shadow only when separation or an interaction hint is needed.
- Components have a default resting elevation; do not change it arbitrarily.
- On hover / drag / open modal, elevation may rise consistently.
- Use few levels; too many shadows make the hierarchy noisy.

iOS usually expresses depth through material, blur, separation, scale and motion; do not mechanically copy the Android shadow system to iOS.

## 3. Black for the app's main background

Knowledge, not a rule — a set of near-black colours usable as the main background of an app. iOS system colours (`label`, `systemBackground`) remain
`#000000` per Apple. Source: a post by Dmitry S., "Alternatives to pure black (#000000) in design: why to avoid it".

Pure black (#000000) is often used in design for contrast and emphasis. However, designers' research and experience suggest pure black can have
negative effects on both perception and function:

- **Eye strain and discomfort:** pure black creates too strong a contrast with most other colours, especially white (#FFFFFF), leading to quick eye
  fatigue over long viewing. Such high contrast can cause discomfort and visual stress.
- **Psychological perception:** pure black is associated with negative emotions such as fear, anxiety and sadness, which can create unwanted
  associations, especially when black is used in large amounts.
- **Text readability:** white text on pure black can look too bright and glaring, making it hard to read. Likewise, black text on white can be too
  contrasting and tiring.
- **Colour compatibility:** pure black can clash with some colours, especially bright, saturated ones, creating visual conflict and reducing harmony.

**Alternatives:**

| # | Name | Hex |
|---|---|---|
| 1 | Charcoal Gray | #121212 |
| 2 | Dark Slate Gray | #191919 |
| 3 | Outer Space | #252525 |
| 4 | Rich Black | #0A0A0A |
| 5 | Coffee Bean | #1B1B1B |
| 6 | Dark Gray | #212427 |
| 7 | Oil Black | #0C0C0C |
| 8 | Obsidian | #0B1215 |
| 9 | Ebony | #222428 |
| 10 | Black Chocolate | #100D08 |
| 11 | Gunmetal | #1D1F21 |
| 12 | Smoky Black | #101720 |
| 13 | Oxford Blue | #212A37 |
| 14 | Eerie Black | #232023 |
| 15 | Jet Black | #161618 |
| 16 | Iridium | #181818 |
| 17 | Arsenic | #11181C |
| 18 | Charleston Green | #212124 |
| 19 | Dark Gunmetal | #222428 |
| 20 | Jet | #2A2A2A |
| 21 | Black Olive | #242526 |
| 22 | Midnight Blue | #212121 |

(Kept as published: #9 and #19 share the same hex; #22's name does not describe a blue.)

*Use when:* choosing the app's own main background colour (brand background, dark-themed app, custom screen). Text / icons on these backgrounds still
need a contrast check (`../mobile-ux-fundamentals/references/accessibility.md`). iOS system colours stay as Apple defines them.

## 4. Icons, images and illustration

### 4.1. Icons

- An icon must have a clear silhouette at its real size.
- Use system icons when the meaning is already familiar.
- Add a text label if the icon is not universal.
- Keep stroke, optical weight and bounding box consistent.
- A selected state may change fill/weight but must not make the layout jump.

**iOS:** prefer SF Symbols; use rendering modes, variable value, animation and alignment with text.

**Android:** Material Symbols support three styles — outlined / rounded / sharp — and the axes weight, fill, optical size, grade. Pick one style
consistent with the theme.

Never assume the same glyph means the same thing on both platforms — especially back, share, overflow, delete, menu and check.

### 4.2. App icon

- Focus on one dominant image, recognisable when small.
- No UI screenshots or lots of text in the icon.
- Do not mask corners yourself; use the platform template.
- Test on many wallpapers, light/dark, and next to other icons.

Generating icon assets: `../app-asset-generator/SKILL.md`.

### 4.3. Images and media

- Keep the aspect ratio; never stretch.
- Crop deliberately and protect the subject area.
- Provide a stable placeholder to avoid layout shift.
- Alt text describes meaning, not redundant decoration.
- Use the right colour profile; iOS supports Display P3 but needs a sensible sRGB fallback.

## 5. Related numeric rules elsewhere

| Rule | Where |
|---|---|
| Letter spacing = font size × 2.5% | `layout-spacing.md` §12 |
| Alpha colour tokens instead of layer opacity; opacity only for a Disabled composite | `layout-spacing.md` §10 |
| Avoid colour dust | `layout-spacing.md` §11 |
| Designer text-style names, SF Symbols as text, radius scale | `screen-structure.md` §8 |
