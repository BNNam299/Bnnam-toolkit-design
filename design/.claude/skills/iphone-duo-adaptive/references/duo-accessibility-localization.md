# Accessibility, localization, text expansion and RTL on adaptive layouts

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §14, §26, §27 @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). §1–6 turn the platform checklist into a behaviour specification usable in wireframe, prototype, review and handoff: accessibility is **not a final variant** — every state and pose keeps the same core task. Sources: [Accessibility](../apple-hig/references/accessibility.md), [Motion](../apple-hig/references/motion.md), [Buttons](../apple-hig/references/buttons.md), [Layout](../apple-hig/references/layout.md), [Right to left](../apple-hig/references/right-to-left.md) (verbatim HIG), VoiceOver evaluation criteria (App Store Connect), *Preparing dates, currencies, and numbers for translation* (Xcode) — links in [duo-apple-sources.md](duo-apple-sources.md). General mobile accessibility: `../mobile-ux-fundamentals/references/accessibility.md`.

## Contents
1. Variants every adaptive design must cover
2. Liquid Glass, colour, materials and readability
3. Baseline numbers — never shrink to keep the artboard
4. Dynamic Type per Duo configuration
5. Focus continuity and the semantic tree (VoiceOver)
6. Motor, alternative input, hearing, speech and cognition
7. Text expansion contract
8. RTL rules and the Duo hardware exception
9. Mixed text and paragraph direction
10. Numbers, units, dates and Camera Control values
11. Acceptance criteria (accessibility + localization)

---

## 1. Variants every adaptive design must cover `[T]`

- Dynamic Type, including the accessibility sizes;
- VoiceOver order and focus after resize / fold;
- Reduce Motion;
- Reduce Transparency;
- Increase Contrast;
- Liquid Glass clear ↔ tinted;
- Show Borders where the surface supports it;
- Light / Dark Mode;
- Bold Text;
- RTL;
- long localizations;
- Switch Control / keyboard / Voice Control when the product needs them.

## 2. Liquid Glass, colour, materials and readability `[A]` / `[T]`

Glass controls:
- never use the background colour behind a glass control as its only signal;
- check rest, pressed, selected, disabled and focus states on many backgrounds;
- with Reduce Transparency on, hierarchy stays clear through opaque surfaces / suitable contrast;
- with Increase Contrast or tinted glass, the brand colour must not lose its meaning;
- a custom control needs border / focus / shape as clear as the equivalent system component.

Vision, colour and materials:
- never convey selected, recording, warning or error by colour alone;
- recording = colour + shape/icon + text/time + announcement;
- focus, pressed, selected, disabled and unavailable stay distinguishable on bright, dark and moving previews;
- Reduce Transparency needs surfaces solid enough and clearly layered; Increase Contrast must not erase brand meaning;
- Bold Text must not truncate labels or change hit regions;
- test important statuses in greyscale or with colour-vision-deficiency simulation;
- Smart Invert or contrast modes must not invert an image / video preview in a way that falsifies it; custom overlays stay readable.

Visual foundation of glass: [duo-ios27-visual.md](duo-ios27-visual.md) §1–2.

## 3. Baseline numbers — never shrink to keep the artboard `[A]`

- A button's hit region on iOS is at least **44 × 44 pt**. The icon may be smaller; the touch region may not.
- Custom typography: Apple's iOS/iPadOS reference is **17 pt default, never below 11 pt**; thin fonts need larger sizes to stay readable.
- The design must survive text enlarged to at least about **200 %** and the Dynamic Type accessibility categories.
- When space runs out, prefer reflow, wrap, more height, moving a group, or scrolling. Never squeeze font, hit target or spacing into hard-to-use values to keep the artboard intact.
- Priority-A buttons such as Done, Stop, Save or Capture must not disappear just because large text makes the bar overflow.

Touch ergonomics around system controls `[C]`: vertical bars are placed near the thumb by the system, but custom content still needs targets large enough, must avoid the fold and the curved edge, must not cluster several dangerous actions together, keeps the primary action within reach on the outer display and in tabletop, and offers an alternative to every custom gesture. Full reach / occlusion model: [duo-ergonomics-motion-input.md](duo-ergonomics-motion-input.md) §1.

## 4. Dynamic Type per Duo configuration `[T]`

| Configuration | Required behaviour |
|---|---|
| Outer / compact | labels wrap sensibly; the toolbar keeps symbols and moves titles into a menu / VoiceOver if needed; forms may move labels above fields |
| Inner, fully open | use the extra width for readable width and spacing, not unlimited text growth; keep a readable line length |
| Book (vertical fold) | never let the spine split a control; if the secondary pane is no longer wide enough, switch to overlay / stack or let that pane scroll on its own |
| Tabletop (horizontal fold) | the lower control area scrolls when text is large; the preview above is never squeezed until its main content is lost |
| Split View / PiP | test at the smallest width and the largest text; important actions keep an access path |

Handoff states **three behaviour breakpoints**: default text; large text where a component changes layout; accessibility sizes where a whole group changes axis / scrolls. Never hand off one screenshot at default size.

## 5. Focus continuity and the semantic tree `[A]` / `[T]`

When switching compact ↔ regular or folding:
- VoiceOver focus stays on the same object or the nearest equivalent;
- keyboard focus never leaves the field being typed in;
- if the detail moves to another pane, the announcement must not re-read the whole screen for no reason;
- focus order follows the reading hierarchy, not the technical layer order;
- a vertical bar in RTL keeps its hardware edge, but content order and semantic leading/trailing are still correct (§8).

Visual reparenting must not create semantic duplicates. When a detail moves from a navigation stack into a second pane:
1. the same object appears only **once** in the accessibility tree;
2. label, value, trait and custom actions keep their meaning;
3. focus stays on the same object or the nearest semantic equivalent;
4. the screen is not re-read just because the layout changed;
5. if a control disappears because capability changed, an announcement explains the new state, then focus moves to a sensible point;
6. reading order follows hierarchy and reading order — not z-index or technical node order.

Camera: focus reticle, zoom, exposure and capture state have a semantic representation. A face box drawn on the preview should not become dozens of focusable elements when the user cannot act on each box. Camera-specific accessibility: [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md) §5.

## 6. Motor, alternative input, hearing, speech and cognition `[A]` / `[T]`

Core features work with:
- a tap on a visible control;
- a VoiceOver action;
- Voice Control, with names that can be spoken;
- Switch Control, in a sensible scan order;
- Full Keyboard Access when the app supports keyboard environments;
- hardware / remote input only as an **extra** path, never the only one.

Never put an important action only behind a swipe, a multi-finger drag, a long press or a physical pose. If swipe-to-delete exists, provide Edit/Delete or an equivalent menu. If pinch adjusts zoom, provide a slider / buttons / adjustable action. Input parity matrix: [duo-ergonomics-motion-input.md](duo-ergonomics-motion-input.md) §3.

Hearing, speech, cognition:
- every important sound has a visual or haptic equivalent; every important visual-only event has an announcement, sound or haptic as context fits;
- spoken video has captions; voice guidance is never the only way to finish a task;
- avoid banners that vanish too fast — VoiceOver and Switch Control users need time to reach them;
- do not change navigation, vocabulary or action positions just because the pose changed; consistency lowers cognitive load;
- error copy says what happened, what it affects and what to do next — never just an error code.

## 7. Text expansion contract `[A]` / `[T]`

Localization changes component structure, not just strings: Apple requires layout to adapt to text length, fonts, number/date formats and reading direction. Every component with text declares:
- minimum / maximum number of lines;
- wrap or truncate, and truncate at the start / middle / end;
- which part may become a symbol;
- which part may overflow into a menu;
- whether it may grow taller or change axis;
- what must **never** be shortened because it concerns money, rights, errors or consequences;
- the impact of long text on the other pane.

Never hard-code widths from the English copy. Test at least Vietnamese, English, one typically long language and one RTL language. Run pseudolocalization on outer, inner, book, tabletop and the smallest Split View.

## 8. RTL rules and the Duo hardware exception `[A]`

| Element | Mirrors in RTL? | Note |
|---|---|---|
| Reading order, lists, leading/trailing alignment | Yes | hierarchy runs leading → trailing per locale |
| Back/Forward, Previous/Next in content order | Yes | icon and direction follow the flow |
| Progress / slider showing linear progress | Usually | reverse the value order, never the digits inside a number |
| Images, logos, screenshots, charts with physical meaning | Not automatically | mirror only if the meaning truly follows reading direction |
| Camera left/right, physical direction, compass | No | keep the real direction |
| Universal play, microphone, camera, checkmark | Usually not | use SF Symbols / system behaviour |
| **iPhone Duo vertical system bar** | **Does not move to the opposite edge because of RTL** | the bar keeps its relationship to hardware / camera; content inside still follows semantic direction |

In book pose, never swap the two panes mechanically if that breaks the preview–control relationship. Decide which pane is primary by task, which follows reading flow and which part is anchored by the camera / hardware. Use `leading/trailing` for semantic content and **hardware edge** for bars tied to hardware — never substitute one concept for the other.

## 9. Mixed text and paragraph direction `[A]`

- A paragraph of three lines or more aligns to its own language, not to the app's locale.
- Lists keep a consistent alignment for scanning, even when one item contains another script.
- File names, URLs, product codes, phone numbers and technical strings are tested with bidirectional text so their order never changes and no action is triggered by mistake.
- No arbitrary uppercase: Arabic / Hebrew have no equivalent uppercase and can look smaller next to Latin uppercase.

## 10. Numbers, units, dates and Camera Control values `[A]` / `[T]`

- Use locale formatters for dates, times, currency, percentages and decimals; never concatenate strings by hand.
- Never reverse the digits inside a number.
- Sliders / progress may reverse semantic direction in RTL, but camera values with physical meaning — negative/positive EV, focal length, compass — follow professional convention and are tested separately.
- A Camera Control value carries a unit or symbol with enough meaning (`EV`, `%`, `×`); the title is short so Dynamic Type does not cover the viewfinder.
- Countdown, elapsed time and timecode stay consistently readable on both displays.

## 11. Acceptance criteria `[T]`

Accessibility:
- [ ] Every main action has a hit region of at least 44 × 44 pt.
- [ ] The task completes at the largest text size without losing a call to action or entered content.
- [ ] VoiceOver focus stays correct after open, close, rotate, split and display change.
- [ ] Switch Control does not scan hidden, duplicate or decorative nodes.
- [ ] Voice Control labels are speakable, with no two actions of the same name on one screen.
- [ ] Full Keyboard Access has a focus order, focus appearance and a clear way out of modals.
- [ ] Reduce Motion, Reduce Transparency, Increase Contrast and Bold Text all have test cases.
- [ ] No feedback relies only on colour, sound, haptics or animation.

Localization:
- [ ] No fixed width based on the English version.
- [ ] Outer, book and the smallest Split View survive pseudolocalization + Dynamic Type.
- [ ] RTL mirrors content correctly but does not move the vertical hardware bar.
- [ ] Icon direction is classified as semantic or physical.
- [ ] Numbers, dates, money, units and plurals use formatters / localized resources.
- [ ] VoiceOver reads mixed strings in the right language and order.
- [ ] Screenshots / illustrations containing text are localized, or the text is separated from the asset.
