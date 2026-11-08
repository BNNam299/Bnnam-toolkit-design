---
name: apple-hig
description: Verbatim Apple Human Interface Guidelines for iOS and iPadOS — 125 official pages (foundations, patterns, components, inputs, system experiences, technologies, iPhone Duo), word for word. Use whenever a decision should follow Apple's own wording - a component's correct use (tab bar, navigation bar, sheet, alert, action sheet, menu, toolbar, search, list, picker, toggle), Dynamic Type sizes, SF Symbols, color and materials, dark mode, accessibility, onboarding, permissions, notifications, widgets, Live Activities, Sign in with Apple, Apple Pay, in-app purchase, App Clips - or whenever someone asks "what does Apple say" or "is this HIG-compliant". Vietnamese triggers such as "theo HIG", "chuẩn Apple", "Apple quy định thế nào", "đúng guideline iOS chưa", "tab bar dùng sao cho đúng", "sheet hay alert", "cỡ chữ Dynamic Type". For quick iPhone/iPad platform rules use apple-design-iphone / apple-design-ipad; for iPhone Duo work use iphone-duo-adaptive; for Android use material-design-3.
---

# apple-hig — Apple Human Interface Guidelines, verbatim (iOS / iPadOS)

This skill is a **library**: official HIG pages copied word for word (English, original headings). It answers "what does Apple say,
exactly?". It runs no process — screen building is `figma-ui-flow`, platform cheat-sheets are `apple-design-iphone` /
`apple-design-ipad` / `apple-design-widget`, iPhone Duo adaptation is `iphone-duo-adaptive`.

**Fetched 2026-10-17** from developer.apple.com (DocC JSON). **Scope: UI/UX for iOS and iPadOS apps (incl. iPhone Duo and iPad).**
- In each kept page, the *Platform considerations* for macOS, tvOS, visionOS and watchOS were removed; iOS/iPadOS and general text is intact.
- **48 pages were not copied** (see "Not in this library" below). If a project needs one, say so and ask the user to fetch it — don't answer from memory as if it were here.

## Need → Read
Open one page, then only the `##`/`###` section you need. All files are `references/<name>.md`.

### Start here
| Need | Read |
|---|---|
| What HIG is, the platforms, where to begin | `getting-started` · `index` |
| iPhone platform overview (best practices, device traits) | `designing-for-ios` |
| iPad platform overview | `designing-for-ipados` |
| iPhone Duo (iOS 27) | `designing-for-iphone-duo` — then the `iphone-duo-adaptive` skill |
| Section landing pages (lists of what each section contains) | `foundations` · `patterns` · `components` · `inputs` · `technologies` |

### Foundations
| Need | Read |
|---|---|
| Layout, safe areas, margins, size classes, adaptivity | `layout` |
| Color, system colors, contrast, P3 | `color` · `dark-mode` |
| Materials, blur, vibrancy, Liquid Glass | `materials` |
| Type, Dynamic Type sizes, SF fonts | `typography` (two size tables repeat headings xSmall…AX3 — cite as `typography.md › <table> › <size>`) |
| Symbols and icons | `sf-symbols` · `icons` · `app-icons` |
| Images, image assets, scale factors | `images` |
| Motion, reduce motion | `motion` |
| Accessibility, VoiceOver, inclusive design | `accessibility` · `voiceover` · `inclusion` |
| Writing style, labels, tone | `writing` |
| Branding inside the app | `branding` |
| Privacy, permission requests | `privacy` |
| Right-to-left languages | `right-to-left` |
| Design principles (hierarchy, harmony, consistency) | `design-principles` |

### Patterns
| Need | Read |
|---|---|
| First launch, onboarding | `launching` · `onboarding` |
| Loading, progress, skeletons | `loading` |
| Feedback, errors, confirmations | `feedback` |
| Modal flows, when to interrupt | `modality` |
| Entering data, forms | `entering-data` |
| Search, search results | `searching` |
| Settings | `settings` |
| Accounts, sign-in, deletion | `managing-accounts` |
| Notifications permissions and settings | `managing-notifications` |
| Help, tips | `offering-help` |
| Ratings and review prompts | `ratings-and-reviews` |
| Undo / redo | `undo-and-redo` |
| Drag and drop | `drag-and-drop` |
| Sharing, collaboration | `collaboration-and-sharing` |
| Charts and data | `charting-data` |
| Full screen | `going-full-screen` |
| Multitasking (iPad: Split View, Slide Over, Stage Manager) | `multitasking` |
| Audio, video, haptics | `playing-audio` · `playing-video` · `playing-haptics` |
| Live-viewing apps (sports, streams) | `live-viewing-apps` |

### Components
| Family | Pages |
|---|---|
| Content | `content` (landing) · `charts` · `image-views` · `text-views` · `web-views` |
| Layout and organization | `layout-and-organization` (landing) · `boxes` · `collections` · `disclosure-controls` · `labels` · `lists-and-tables` · `outline-views` · `split-views` · `tab-views` |
| Menus and actions | `menus-and-actions` (landing) · `activity-views` · `buttons` · `context-menus` · `edit-menus` · `home-screen-quick-actions` · `menus` · `pop-up-buttons` · `pull-down-buttons` · `the-menu-bar` (iPad) · `toolbars` |
| Navigation and search | `navigation-and-search` (landing) · `tab-bars` · `sidebars` · `search-fields` |
| Presentation | `presentation` (landing) · `action-sheets` · `alerts` · `page-controls` · `popovers` · `scroll-views` · `sheets` · `windows` |
| Selection and input | `selection-and-input` (landing) · `color-wells` · `pickers` · `segmented-controls` · `sliders` · `steppers` · `text-fields` · `toggles` · `virtual-keyboards` |
| Status | `status` (landing) · `gauges` · `progress-indicators` · `rating-indicators` |
| System experiences | `system-experiences` (landing) · `controls` (Control Center) · `live-activities` · `notifications` · `status-bars` · `widgets` |

### Inputs
| Need | Read |
|---|---|
| Gestures | `gestures` |
| Keyboards, shortcuts (`keyboards.md › Standard keyboard shortcuts` is one 135-line table — grep it) | `keyboards` |
| Pointer / trackpad (iPad) | `pointing-devices` |
| Apple Pencil, Scribble | `apple-pencil-and-scribble` |
| Focus and selection | `focus-and-selection` |
| Action button, Camera Control | `action-button` · `camera-control` |

### Technologies
| Need | Read |
|---|---|
| Payments: Apple Pay, in-app purchase, subscriptions UI | `apple-pay` · `apple-in-app-purchase` (store rules: `../app-store-policies/SKILL.md`) |
| Sign in with Apple, iCloud | `sign-in-with-apple` · `icloud` |
| App Clips | `app-clips` |
| AR, AirPlay, Maps, Live Photos, photo editing | `augmented-reality` · `airplay` · `maps` · `live-photos` · `photo-editing` |
| Machine learning, generative AI | `machine-learning` · `generative-ai` |

## Not in this library (48 pages)
- **Other platforms:** macOS (`designing-for-macos`, column views, combo boxes, dock menus, image wells, panels, path controls, token fields, Mac Catalyst), tvOS (`designing-for-tvos`, digit entry, lockups, top shelf, remotes), visionOS (`designing-for-visionos`, eyes, immersive experiences, ornaments, spatial layout), watchOS (`designing-for-watchos`, always on, complications, Digital Crown, watch faces).
- **Out-of-scope technologies:** activity rings, app shortcuts, CareKit, CarPlay, games (designing for games, Game Center, game controls), gyro and accelerometer, HealthKit, HomeKit, ID Verifier, iMessage apps and stickers, nearby interactions, NFC, ResearchKit, SharePlay, ShazamKit, Siri, snippets, Tap to Pay on iPhone, Wallet.
- **Reference only (user's choice):** file management, printing, workouts.
- Fetch URL pattern: `https://developer.apple.com/design/human-interface-guidelines/<page-name>`.

## Core rules
1. **Verbatim beats summary.** These pages win over the summaries in `apple-design-*`, `mobile-ux-fundamentals`, `mobile-ui-master`,
   `iphone-duo-adaptive`, and over memory. When you rely on a rule, cite `references/<page>.md › <section>`.
2. **Read the page, not just the heading.** Apple often states the rule in *Best practices* and the exception in *Platform considerations
   › iOS, iPadOS* — read both before concluding.
3. **Stay in scope.** Nothing here covers watchOS/macOS/tvOS/visionOS UI. Say so instead of extrapolating.
4. **Use these copies during project work** instead of browsing the live site, so every agent reads the same text. If a page looks
   outdated (e.g. a newer iOS release changed it), tell the user; refreshing is done in the source toolkit.

## Workflow — answering an Apple question
1. Identify the component / pattern / foundation → pick the page above.
2. Grep its headings (`^#`), open the relevant section: *Best practices*, *Content*, *Platform considerations › iOS, iPadOS*.
3. Numbers (sizes, Dynamic Type points, minimum targets) → quote them exactly with the section path.
4. Cross-platform question → also `../material-design-3/references/cross-platform-decisions.md`.
5. Report: the rule (quoted or closely paraphrased) + `file › section`.

## Self-check before reporting
- Every Apple claim points to `references/<page>.md › <section>`.
- iOS vs iPadOS differences checked in *Platform considerations*.
- Nothing claimed about a page listed under "Not in this library".
