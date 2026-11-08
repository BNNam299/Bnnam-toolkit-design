---
name: apple-design-iphone
description: Apple HIG standard for designing and reviewing iPhone screens — exact iOS 27 frame sizes, safe areas, status bar/home indicator, navigation bar (top toolbar), tab bar, bottom toolbar, sheets and detents, alerts/action sheets, SF Pro type scale with Dynamic Type up to AX5, 44×44 pt touch targets, system colors (light/dark hex from the official iOS 27 Figma kit), Liquid Glass and materials, Dark Mode, plus the full HIG foundations/patterns/components digest and the Apple Design Resources kit (components, variables). Use whenever a screen targets iPhone or must "look native iOS" — designing, building in Figma, or reviewing — even if the user only says "make an app screen", including Vietnamese requests such as "vẽ màn iPhone", "thiết kế theo chuẩn iOS", "màn này có đúng HIG không", "tab bar iOS bao nhiêu tab", "cỡ khung iPhone là bao nhiêu". For the screen build loop use figma-ui-flow; for iPad use apple-design-ipad; for widgets/Live Activities use apple-design-widget; for iPhone Duo use iphone-duo-adaptive.
---

# apple-design-iphone — iPhone screens per Apple HIG (iOS 27)

This skill is the **iPhone platform standard**: what an iOS screen must look like and why. It does not own the process.
- **How to build a screen** (brief → three-pass outside-in build loop → QA): `../figma-ui-flow/SKILL.md`, `../figma-ui-flow/references/build-loop.md`.
- **Which Figma tool to call**: `../figma-agent-tools/SKILL.md`.
- **Verbatim Apple pages** (source of truth — Apple wins over any digest): `../apple-hig/references/<page>.md`.
- Neighbours: iPad → `../apple-design-ipad/SKILL.md` · widgets, Live Activities, quick actions → `../apple-design-widget/SKILL.md` ·
  iPhone Duo (foldable, outer/inner display, vertical bar) → `../iphone-duo-adaptive/SKILL.md` · layout density and visual review →
  `../mobile-ui-master/SKILL.md` · touch/states/feedback → `../mobile-ux-fundamentals/SKILL.md` · copy → `../ux-writing/SKILL.md` ·
  iOS vs Android decisions → `../material-design-3/references/cross-platform-decisions.md`.

## Need → Read

| Need | Read |
|---|---|
| Any HIG foundation/pattern/component rule (accessibility, color, dark mode, layout, privacy, onboarding, loading, search, settings, alerts, pickers…) in one digest | `references/ios-platform.md` (find the section via its Contents) |
| Exact kit numbers: frame/bezel sizes, 63 color variables, Dimensions (iPhone vs iPad), Dynamic Type table xSmall–AX5, letter spacing, Liquid Glass parameters, component names and variants, kit change log | `references/ios27-figma-kit.md` |
| Exact wording of an Apple rule | `../apple-hig/references/` — `layout.md`, `tab-bars.md`, `toolbars.md`, `sheets.md`, `typography.md`, `color.md`, `materials.md`, `dark-mode.md`, `buttons.md`, `accessibility.md`, `alerts.md`, `action-sheets.md`, `status-bars.md`, `designing-for-ios.md`, `search-fields.md`, `lists-and-tables.md`, `modality.md` |
| Frame/grid conventions of the tool demo, file pages, naming | `../figma-ui-flow/references/file-standards.md` |

Do not read everything at once: the core rules below cover most screens. Open `ios-platform.md` for the section you are judging,
the kit file when you need a number or a component name.

## Core rules (apply even without opening a reference)

### 1. Frame and safe areas
- **Main design frame: 402 × 874 pt** (iPhone 17 / 17 Pro / 18 Pro, iOS 27 kit) for a new project. Also check **440 × 956** (Pro Max)
  and **420 × 912** (Air); for small-screen stress, stretch to 375 width. **An existing project keeps the size / aspect ratio of the
  screens already designed in the file**, so new screens match the old ones (`../figma-ui-flow/references/file-standards.md`).
- Status bar **62 pt** high (includes the Dynamic Island). Home indicator 144 × 5 (portrait) / 226 × 5 (landscape) — keep its zone clear of
  controls; read the bottom inset from the kit's `Safe Areas and Margins` overlay instead of guessing.
- Layout margin **16 pt** (iPhone); readable-content guide per kit. Backgrounds and media may run edge to edge; text and controls stay inside the safe area.
- Decide layout by **size class**, not device or orientation; keep functionality identical when the size class changes (`layout.md`).
- Never hard-code coordinates per device model — the system reports safe areas at runtime; kit numbers are a mockup template.
- **Team sizes override HIG minimums** when building the team's screens: CTA **56**, toolbar **76**, `Top Container` / `Content` /
  `Bottom Container`, gaps by relationship (`../mobile-ui-master/SKILL.md` §1–2, `../bnnam-standards/references/frame-standards.md`).
  Kit sizes (50 pt button…) are not the team's sizes. A visible control under 44 pt is allowed — the dev note asks for a larger hit area
  (`../ux-review-handoff/SKILL.md` rule 9).

### 2. Two layers: content and Liquid Glass
- Navigation and controls (tab bar, toolbars, sidebars, sheets' bars) float in the **Liquid Glass** layer above content. **No Liquid
  Glass in the content layer**; use standard materials (ultra-thin, thin, regular, thick) there.
- Don't paint solid/semi-opaque backgrounds under bars; use the **scroll edge effect** to separate bars from content.
- Colour on glass sparingly: tint the **background** of the one primary action (prominent style), never several controls. On colourful
  content keep bars monochrome.
- Clear glass only over rich media; add a **35 %** dark dimming layer when the content below is bright.
- Brand colour lives in the content layer (accent, illustration), not by recolouring system bars.

### 3. Top bar (navigation bar = top toolbar)
- Kit component `Toolbar - Top - iPhone`, styles Default / Compact Large / Large Title / Title 2 Line / Title 2 Line Left.
- Large title for landing/list screens; it collapses to a standard title on scroll. Title **under 15 characters**, never the app name.
- Standard **Back** chevron (title hidden by default in iOS 27) and standard **Close** symbol — never the text "Back"/"Close".
- Only **one** primary (`.prominent`, e.g. Done) action, on the **trailing** side. Prefer borderless system symbols; text for actions
  like Edit. Max **three** groups; separate text-labelled buttons with fixed space.
- iOS space is tight: keep only essential items; put the rest in a More menu.

### 4. Tab bar
- Navigation between top-level sections only — **actions go in a toolbar**.
- Floats at the bottom on Liquid Glass; visible on every top-level section (a modal may cover it). Kit `Tab Bar - iPhone`: **2–5 tabs**,
  Type Default / Search Role / Prominent Tab, Minimized True/False.
- Avoid the More overflow tab. Never hide or disable a tab because it is empty — open it and explain the empty state.
- One-word labels, filled SF Symbols, selected = filled variant without size jump. Badge (red oval) only for critical information.
- Optional dedicated **search tab at the trailing end**; with an accessory (e.g. mini player) the bar may minimise on scroll.
- Each tab keeps its own navigation stack.

### 5. Bottom toolbar
- Kit `Toolbar - Bottom - iPhone`: Buttons / Buttons + Page Dots / Search variants. Actions for the current screen; frequent first,
  rare ones in More. Icons need accessibility labels; stable order.

### 6. Sheets, alerts, action sheets
- Sheet = scoped self-contained task. **Cancel leading, Done trailing** in the top bar; Done is always paired with Cancel (or Back);
  never show Cancel, Done and Back together.
- Detents: **medium** (~half) and **large**; kit `Sheet - iPhone` has Medium / Large / Large (Stacked). Use medium for progressive
  disclosure; compose-style content stays large only. Grabber **60 × 4** on resizable sheets. Kit radius: top **38**, bottom **58**.
- Swipe down dismisses; with unsaved changes confirm with an action sheet. **One sheet at a time** — close the first before opening another.
- Long or complex flows → full-screen modal, not a sheet. Nonmodal sheets are allowed when they edit the parent view (e.g. formatting).
- Alert only when a decision is needed before continuing: title = problem, message = consequence/fix, few specifically-labelled
  actions; not for success, permission pre-prompts or marketing. Action sheet for choices tied to one action (especially destructive),
  with a clear Cancel.

### 7. Typography
- **SF Pro** (New York allowed). Default body **17 pt**, absolute minimum **11 pt**. Avoid Ultralight/Thin/Light weights.
- Text styles at Large (default), size/leading: Large Title 34/41 · Title 1 28/34 · Title 2 22/28 · Title 3 20/25 · Headline 17/22
  Semibold · Body 17/22 · Callout 16/21 · Subhead 15/20 · Footnote 13/18 · Caption 1 12/16 · Caption 2 11/13.
- Mockup tracking (kit): Large Title 0.40 · Title 1 0.38 · Title 2 −0.26 · Title 3 −0.45 · Headline/Body −0.43 · Callout −0.31 ·
  Subheadline −0.23 · Footnote −0.08 · Caption 1 0 · Caption 2 0.06.
- **Dynamic Type up to AX5** (Body 53 pt, Large Title 60 pt at AX5 — full table `ios27-figma-kit.md` §4.3). At large sizes stack
  horizontally adjacent items vertically, let rows grow, wrap labels, reduce columns, minimise truncation, keep primary content on top.
- Custom fonts must support Dynamic Type, Bold Text and full Vietnamese glyphs.

### 8. Touch targets and spacing
- Hit region **44 × 44 pt** default, **28 × 28 pt** absolute minimum. About **12 pt** padding around bezelled elements, **24 pt** around
  borderless ones. Custom controls always have a pressed state.
- Reach: primary actions in the middle/bottom of the screen; support swipe-back and row swipe actions.

### 9. Colour and Dark Mode
- Use semantic system colours: Labels Primary–Quaternary, Backgrounds (system vs **grouped** for grouped lists/settings), Fills,
  Separators. Primary for the view, secondary for groups inside it, tertiary inside those. Default accent **Blue #0088FF / #0091FF (dark)**.
- Contrast: text up to 17 pt **4.5:1**; 18 pt+ or bold **3:1**; check light and dark; provide Increase Contrast variants
  (the kit no longer has that mode — check on device).
- Never hard-code black/white text, never create disabled states with arbitrary opacity, never use colour as the only signal.
- Dark Mode is a full appearance: base (#000000) vs elevated (#1C1C1E…) backgrounds for layered UI; tone down saturated colours;
  provide image/logo variants. Test keyboard, sheets, alerts, widgets in the same appearance.

### 10. System first
- Use system navigation, sheets, menus, share sheet, Photos picker, Sign in with Apple, Apple Pay before inventing custom UI. In
  Figma, place kit instances (`search_design_system`) — never redraw system controls.
- Special inputs (Action button, Camera Control…) only with a fallback path.

## Workflow (reviewing or designing an iPhone screen)
1. Confirm the target: iPhone only, or also iPad / iPhone Duo (load those skills too). Note the project's frame choice.
2. Build with figma-ui-flow's loop. Pass 1: frame per §1 (new project 402 × 874), status bar 62, margins 16, root regions
   `Top Container` / `Content` / `Bottom Container` (`../mobile-ui-master/references/screen-structure.md` §1), tab bar/toolbar from kit instances.
3. Pass 2: fill with kit components and semantic colour/type tokens. Pass 3: stress — AX5 text, Dark Mode, long Vietnamese strings,
   no-data states.
4. Review against the self-check below; cite the HIG page for any violation.

## Common pitfalls
- Actions placed in the tab bar, or a tab hidden when empty.
- Custom back button with text "Back", or two prominent buttons in one bar.
- Glass/blur cards in the content layer; tinted toolbars on colourful content.
- Sheets stacked on sheets; Done without Cancel; swipe-to-dismiss that drops unsaved data.
- Text below 11 pt, light weights, tight leading on 3+ lines; layout that breaks at AX sizes.
- Pure #000/#FFF hard-coded text; opacity-faded disabled states; brand colour failing 4.5:1 kept "for the brand".
- Layout decided by device model instead of size class; content under the Dynamic Island or home indicator.

## Self-check before reporting
- [ ] Frame size stated; nothing important inside status bar / home indicator zones; margins 16.
- [ ] Bars are kit instances on the glass layer; one primary action; titles < 15 chars.
- [ ] Tab bar: navigation only, 2–5 tabs, labels + filled symbols, never hidden/disabled.
- [ ] Sheets: correct buttons, detents, grabber, one at a time.
- [ ] Type uses text styles; ≥ 11 pt; checked at AX5.
- [ ] Targets ≥ 44 × 44 (never < 28); contrast 4.5:1 / 3:1 in light and dark.
- [ ] Semantic colours only; Dark Mode screen exists and uses elevated backgrounds for layered surfaces.
- [ ] Any rule you cited can be found in `../apple-hig/references/`.
