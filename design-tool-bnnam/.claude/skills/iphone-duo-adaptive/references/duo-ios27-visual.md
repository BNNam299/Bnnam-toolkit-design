# iOS 27 visual foundation: Liquid Glass, UI/content layers, brand, type, icons, motion

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §3, §20.11, §25.2 (visual) @ 3c0e291 — translated, complete

Labels: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal (see `duo-foundations.md`).
Verbatim Apple pages: [materials](../apple-hig/references/materials.md), [branding](../apple-hig/references/branding.md), [color](../apple-hig/references/color.md), [typography](../apple-hig/references/typography.md), [sf-symbols](../apple-hig/references/sf-symbols.md), [app-icons](../apple-hig/references/app-icons.md), [motion](../apple-hig/references/motion.md), [dark-mode](../apple-hig/references/dark-mode.md). Readability/accessibility of glass: `duo-accessibility-localization.md` §2.

## Contents
1. Liquid Glass in iOS 27
2. The two layers of an interface
3. Colour and brand
4. Typography, iconography, motion
5. App icon
6. Design-system fundamentals carried from WWDC25 "new design system"

---

## 1. Liquid Glass in iOS 27 `[A]`

Liquid Glass arrived with the 26 generation and is refined further in iOS 27. Apple describes:
- better diffusion of complex content behind it, for readability;
- darker edges and brighter reflective highlights to separate layers;
- a user-adjustable visibility level from very **clear** to **tinted** (system setting / transparency slider);
- the material adapts automatically to Reduce Transparency, Increase Contrast and other accessibility settings;
- apps already using system components/materials get many refinements automatically, without rebuilding the effect.

`[C]` Never approve Liquid Glass on a single wallpaper or the default transparency level. Check light and dark backgrounds, highly detailed images, moving content, clear and tinted glass levels, and accessibility settings.

## 2. The two layers of an interface `[A]`

- **UI layer:** navigation and global actions — toolbar, tab bar, sidebar, menus, floating controls. Should be familiar, easy to learn, and prefer system components.
- **Content layer:** content, data, images, video, illustration, typography, voice, motion and product-specific experiences. This is where brand should speak loudest.

Liquid Glass is the functional layer floating above content. Do **not** spread glass through the content layer — it muddles hierarchy, lowers contrast and competes with content. **Standard materials** suit surfaces inside content. **Custom glass** only for important controls with a clear interaction reason.

## 3. Colour and brand `[A]`

- Put most brand colour in the content/scroll layer instead of filling toolbars or tab bars.
- Use tint/accent with purpose: primary action, selection, state, feedback, badge or new information.
- Full-bleed image/video/gradient can carry a strong brand while navigation keeps the iOS language.
- Dark Mode is a complete expression of the brand, not an automatic colour inversion.
- The logo need not repeat on every screen — iPhone already tells people which app they are in. If used, keep it subtle, tied to Home/onboarding or meaningful content, and able to fade on scroll.

`[C]` Design tokens of a specific app come from the product brand; Apple documents cannot supply them.

*Image skipped:* `images/14-brand-identity-ios27.jpg` — presenter frame from the WWDC26 session "Communicate your brand identity on iOS" (no layout information).

## 4. Typography, iconography, motion `[A]`

**Typography**
- SF Pro is the safe foundation; SF Rounded, SF Compact, SF Mono and New York add nuance in the right context.
- Custom fonts are allowed but must support Dynamic Type, Vietnamese and the other target languages, with sensible weight/leading at accessibility sizes.
- Brand can show through scale, width, rhythm and hierarchy; the whole system font need not be replaced.

**Iconography**
- Custom icons must read at small sizes, share one stroke/shape language and still respect iOS conventions.
- Do not change the share / back / close shapes just to match web or Android.
- SF Symbols are the strong default; a custom icon is worth it only when it increases recognition or clarifies the content domain.
- **Every toolbar item that shows a symbol still has a title.** The system needs the title when the item goes to overflow or appears in expanded form (see `duo-components.md` §5).

**Motion**
- Motion should connect the interaction source to the result and keep spatial continuity when a pane, sheet or layout changes shape.
- Brand effects must not cause delay, dropped frames, or hide a state change.
- On fold/resize, small trackable motion beats a full-screen "grand rearrangement". Full rules: `duo-ergonomics-motion-input.md` §2.

## 5. App icon `[A]`

Icon Composer continues the multi-layer structure with Liquid Glass. iOS 27 refines sharpness and edges and allows selective refraction. When designing:
- start from a clear silhouette and recognisability;
- split layers that mean depth — do not slice a flat artwork into arbitrary layers;
- preview light, dark, tinted and earlier OS versions;
- do not rely on fine detail or glass effects to rescue a weak symbol;
- the app icon's glass level has its own rendering rules and does not fully follow the UI transparency slider.

## 6. Design-system fundamentals (WWDC25 "Get to know the new design system") `[A]`

What that session contributes, and still applies on iOS 27:
- Liquid Glass as the **functional layer** between navigation/actions and content;
- colour, typography and the **three-shape system: fixed, capsule, concentric** (concentric shapes: `duo-device-postures.md` §6);
- **source–presentation relationship**, focus, modality and depth;
- bar grouping / overflow, the **Search tab**, accessory views and **scroll-edge effects**;
- sidebar / background extension;
- shared anatomy and shared behaviour to keep continuity across iPhone, iPad and Mac.

Related iOS 27 sessions (WWDC26): What's new in SwiftUI (new Liquid Glass, resizable iPhone apps, toolbar priority/overflow/minimization, prominent tab), Modernize your UIKit app (scene lifecycle, traits/geometry, resizability, sidebar, menu, scroll-edge), Platforms State of the Union (Liquid Glass refinements, transparency slider, resizability, Xcode/Device Hub). Links: `duo-apple-sources.md`.
