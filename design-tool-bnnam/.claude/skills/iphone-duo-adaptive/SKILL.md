---
name: iphone-duo-adaptive
description: Adaptive design for iOS 27, iPhone Duo (foldable, outer + inner display, book / tabletop), iPad, Split View and resizable iPhone apps - one screen family keeping task and state as size, posture and scene change. Support levels, frame matrix and annotations, vertical bars and overflow, safe area vs reserved regions (fold, cameras), displacement, split / overlay arrangements, sheets per posture, camera on two displays, states, accessibility, Device Hub testing, behaviour spec for developers, community kit and real-app examples, and a read-only script finding missing variants and mismatched actions. Use whenever the user mentions iPhone Duo, foldables, outer / inner display, hinge, adaptive iOS layout, an iPad version or Split View. Vietnamese triggers such as "adapt cho iPhone Duo", "làm bản màn gập", "màn ngoài / màn trong", "khi gập / mở thì sao", "chia hai pane", "thêm bản iPad", "làm responsive". For the screen build loop use figma-ui-flow; for iPhone-only layout use mobile-ui-master.
---

# iphone-duo-adaptive — one screen family across devices, postures, sizes and scenes

This skill answers **"how does this screen stay the same app when the space changes?"** — iPhone Duo outer ↔ inner, book / tabletop / tent,
Split View left / right, PiP and keyboard, iPad, resizable iPhone apps, several scenes. iOS 27 and iPhone Duo are **newer than the agent's
built-in knowledge**: take every statement from these references (and the verbatim HIG page
`../apple-hig/references/designing-for-iphone-duo.md`), never from memory.

What lives elsewhere: the 8-stage process and the build loop (`figma-ui-flow`, `../figma-ui-flow/references/build-loop.md`); tool
mechanics and `execute_code` (`figma-agent-tools`); the designer's frame standard incl. Duo packaging and `Pane controls`
(`../bnnam-standards/references/frame-standards.md` §9, `../mobile-ui-master/references/screen-structure.md` §11); Apple iOS 27 Figma kit
numbers (`../apple-design-iphone/references/ios27-figma-kit.md`); variant names (`../bnnam-standards/references/naming.md` §3).

Labels inside the references: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal — never present a `[T]` as "Apple says".
Community sources (`duo-community-*.md`) rank below Apple: where they differ, Apple wins.

## Need → Read
| Need | Read |
|---|---|
| **Run the adapt job** step by step: support level, frame matrix, annotations, build, checks, eight-question gate, report | `references/duo-adapt-workflow.md` |
| Statement types, mental model, four pillars, **support levels** (compatible / adaptive / duo-enhanced), glossary, scope | `references/duo-foundations.md` |
| Device anatomy, postures, size classes, **reserved regions**, safe area / margins / full bleed, concentricity, hinge state | `references/duo-device-postures.md` |
| Transform an iPhone screen to Duo: SDK levels, assumptions to drop, resize rules, displacement, split view, arrangement, container table, screen types | `references/duo-layout-transformation.md` |
| Decision system: state vector, four geometry layers, posture matrix, six transformations, reserved-region algorithm, container tree, bar-item contract, content patterns (form, editor, game…), component and motion contracts | `references/duo-adaptive-layout-system.md` |
| Frame set, required annotations, no device breakpoints, prototype, layout decision table, handoff tokens, test matrix, anti-patterns, **eight-question gate**, review checklist | `references/duo-rule-map.md` |
| Vertical bars: which bars, order, grouping, priority, overflow, representation, axis, compression, RTL, opt-out; sheets, alerts, menus, PiP, custom components | `references/duo-components.md` |
| Grouping buttons on the vertical bar per frame — 6 real apps outer ↔ inner, pane ratios, 8 rules | `references/duo-community-app-examples.md` |
| Community starter kit: reliability badges, six states, `Duo System` tokens (mockup only), layout guides, component anatomy, templates | `references/duo-community-kit.md` |
| Eight navigation transitions, nine product patterns (feed, master–detail, messaging, media, maps, e-commerce, dashboard, settings, calendar), ten Do / Don't | `references/duo-community-patterns.md` |
| Several displays and scenes, Split View, instances, scene accessory, Camera Capture Accessory | `references/duo-multi-display-scenes.md` |
| Camera: direction, posture layouts, control layers and priority, Camera Control, transitions | `references/duo-camera-layout-controls.md` |
| Camera lifecycle: permission, locked capture, interruptions, preview–output, accessibility, test matrix | `references/duo-camera-lifecycle-privacy.md` |
| Accessibility, Dynamic Type per configuration, focus, text expansion, RTL and the hardware-edge exception | `references/duo-accessibility-localization.md` |
| Ergonomics, motion on posture change, input parity | `references/duo-ergonomics-motion-input.md` |
| Loading / empty / error / recovery, feedback (visual, audio, haptic) | `references/duo-states-feedback.md` |
| Privacy across displays, onboarding and discoverability of Duo features | `references/duo-privacy-onboarding.md` |
| Device Hub, test matrix, continuity scenarios, bug reports, **behaviour spec**, component contract, phase checklists, anti-patterns | `references/duo-handoff-testing.md` |
| Liquid Glass, UI / content layers, brand, type, icons, motion on iOS 27 | `references/duo-ios27-visual.md` |
| Verify a statement by video and timestamp; **sheet across six states (111466 08:44)**; WWDC25 design system in full | `references/duo-video-atlas.md` |
| Apple links behind all of this | `references/duo-apple-sources.md` |
| Check a family of variant frames by machine | `scripts/adaptive.js` (below) |

Do not read everything at once. The workflow names the file each step needs; for a quick question read the one row that matches.

## Core rules
1. **Design one continuous system for the available space, never screens per device name.** Write conditions as *"when the width allows
   primary + secondary and each pane keeps its minimum usable width → reveal split"*, never *"if Duo is open → layout B"*.
2. **Three decisions before any frame:** which state must be invariant · which container owns the adaptation · which representation the
   current geometry allows. Invariants never change silently: task, information hierarchy, **functional parity** (the same actions in
   every variant — overflow is allowed, removal is not), selection and focus.
3. **Read the environment, in order:** container bounds → size class → system container → safe area + layout margins → reserved regions →
   displacement. Size class picks the family, container size the continuum, safe area / regions the final geometry. Never use a model name,
   orientation or hinge angle as the main breakpoint.
4. **Safe area is four independent values** and is asymmetric on Duo — never mirror the trailing bar inset to the leading edge.
   Backgrounds may run full bleed; text, controls and targets stay inside.
5. **Reserved regions are dynamic.** Never draw a fixed hinge spacer; never turn an inactive region into permanent space. Continuous
   content (feed, article) may flow across the fold; point content (button, menu, field, dialog, card) sits wholly in one region; a related
   group moves together, the shortest distance.
6. **More space reveals hierarchy, never stretches.** Show a pane, context or column; keep readable line length; pane ratio follows content,
   not 50 / 50. Media and immersive screens reflow or show more picture instead of splitting.
7. **Bars follow the system.** Outer and inner landscape use the vertical bar on the hardware edge (not mirrored for RTL); inner portrait
   uses horizontal bars. Order: status → Back / Close → prominent action → toolbar groups → tab bar. Every item has symbol **and** title;
   set visibility priority; extra actions go into the **system** overflow, never a second ellipsis.
8. **Containers by relation:** hierarchical navigation → navigation split · two peer views → split arrangement · foreground over background →
   overlay arrangement · flowing collection → list / grid / scroll · presentations → system sheet / alert / menu / popover. Navigation sits
   outside the arrangement; custom geometry only when nothing else describes the task.
9. **A sheet stays a sheet.** Outer: fills the pane, × / ✓ on the vertical bar. Inner: its own horizontal header, context visible behind.
   Half folded: one half, never on the fold. Confirmation has one representation in every frame.
10. **The designer's frame standard wins** over the tool demo's defaults: Duo variants follow `../bnnam-standards/references/frame-standards.md`
    §9 (horizontal-bar frames keep Top · Content · Bottom; vertical-bar frames are a HORIZONTAL root — panes, then `Pane controls` 84).
11. **Community numbers are mockup-only** (27 pt band, 475.5 hinge position, column counts, max widths): useful for overlays, never runtime
    constants, never labelled "Apple" without checking the Apple source.
12. **Hand off behaviour, not artboards:** every frame annotated (bounds, size classes, safe area, margins, active regions, container,
    displaced items, bar edge / groups / overflow priority, preserved state, scroll per pane, presentation style), plus the behaviour spec and
    the Device Hub matrix.

## Workflow (adapt a screen family)
Follow `references/duo-adapt-workflow.md`; in short:
1. **Prerequisites** — targets and support level decided (propose, the designer decides), `flows.md` approved with an adaptive structure per
   screen, Apple iOS 27 kit library enabled (check the file's libraries, then search inside that library, then the pages, before saying it
   is missing). → workflow §1–§3.
2. **Inputs, invariants, transformations** for each screen. → workflow §4, `duo-adaptive-layout-system.md` §3–§6.
3. **Frame matrix** for the level (`_Outer`, `_Outer Landscape`, `_Inner`, `_Inner Landscape`, `_Intermediate`, `_Book` / `_Tabletop` /
   `_Tent`, `_Split Left` / `_Split Right`, `_iPad`) — cloned from the base screen into its own section, then restructured. → workflow §5.
4. **Build each variant** in the build loop: container → real-app evidence → reveal hierarchy → bars and button grouping → safe area /
   regions → displacement → presentation → postures → scenes → camera. → workflow §6.
5. **Check** — `scripts/adaptive.js`, `../ux-review-handoff/scripts/audit.js` on every variant, the 10 continuity scenarios, phase
   checklists, the eight-question gate, all states and conditions. → workflow §7.
6. **Record** the Adaptive entry in `flows.md`, component contracts in `components.md`, the behaviour spec and decision table for handoff. → workflow §8.
7. **Report** with variants built / needed, `adaptive.js` results, continuity scenarios, annotations n / n, presentation style per frame. → workflow §9.

## Script — `scripts/adaptive.js` (read only)
Groups frames into families by variant suffix and reports, per family: variants **missing** for the support level · **actions present in one
variant but missing in another** (flags when an overflow button may hold them) · fixed **hinge / fold spacers** · text blocks wider than
`READABLE_MAX_WIDTH`. Run it through `execute_code` (`../figma-agent-tools/SKILL.md` §6): read the script, set `CONFIG` at the top
(`PAGES`, `LEVEL`, `TARGETS`, `POSES`, `ROTATES`, `FAMILIES`, `READABLE_MAX_WIDTH`, name patterns), send the whole file as `code`; pass a
larger `timeoutMs` for big pages. It sees only static frames — continuity is walked through the scenarios in `duo-handoff-testing.md` §3.

## Common pitfalls
- Two pretty artboards (closed / open) and nothing in between — no intermediate size, no Split View on both sides, no keyboard / PiP.
- Stretching the phone column across the inner display, or blowing up artwork and pushing controls onto the fold.
- A hinge spacer or a gap drawn as a constant; centering everything on the whole display so the focal point lands on the fold.
- Mirroring the bar or the insets for RTL; a custom bottom bar kept on outer; a second custom ⋯ next to the system overflow.
- Rebuilding the screen on unfold (selection, scroll, draft or playback lost); jumping to a week grid or the list without being asked.
- A sheet turned into a full screen on inner, or ✓ in one frame and a text button in another.
- Using the community kit's numbers as Apple specs or runtime constants; reading the community kit's frame names instead of sizes.

## Self-check before reporting
- [ ] Support level decided by the designer; every needed variant exists (`adaptive.js` shows none missing, or the gap is reported).
- [ ] Same actions in every variant (or in a titled overflow); no fixed hinge spacer; reading text within its max width.
- [ ] Every frame annotated (§12 of the core rules); presentation style unchanged from the base screen.
- [ ] The eight questions of `duo-rule-map.md` §5.3 answered in the report.
- [ ] Continuity scenarios walked; loading / empty / error, accessibility, RTL and privacy checked where relevant.
- [ ] No `[T]` or community value presented as an Apple rule.
