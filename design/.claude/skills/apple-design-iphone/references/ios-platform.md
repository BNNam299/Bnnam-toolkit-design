# iOS platform knowledge — Apple HIG foundations, patterns and components for design and review

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/platform-hig.md §14, §23, §24, §25, "System surface limits" @ 3c0e291 — translated, complete (iPad-only parts → `../apple-design-ipad/SKILL.md`; widgets, Live Activities and surface limits → `../apple-design-widget/SKILL.md`; iPhone Duo → `../iphone-duo-adaptive/SKILL.md`)

This file is a fast-reading English digest of the HIG for iOS (most of it applies to iPadOS too). It is a thinking lens for
design and review, not a process. **The verbatim Apple pages in `../apple-hig/references/` are the source of truth: when this
digest and an Apple page differ, the Apple page wins.** Each section names the verbatim page to open for exact rules.

## Contents
1. iOS device traits and what "feels like iOS"
2. Navigation
3. HIG components that touch UI/UX directly; special inputs
4. Foundations (accessibility → app launch)
5. Patterns (charting data → workouts)
6. Component catalog (when to use, when to avoid, review points)
7. System experiences (App Shortcuts, notifications; widgets and Live Activities live elsewhere)

---

## 1. iOS device traits and what "feels like iOS"

Verbatim: `../apple-hig/references/designing-for-ios.md`.

### 1.1 Device traits and behaviour
- High-resolution, medium-size screen; viewing distance is usually close (no more than a foot or two).
- People hold the phone in one or two hands, switch orientation, and are interrupted often.
- Main interaction: Multi-Touch, virtual keyboard and voice; optionally pointer, hardware keyboard, sensors and spatial interaction.
- A session may last a few seconds or a long time — **state restoration matters a lot**.

### 1.2 The "right iOS" feeling
- Focus on the task/content; reduce always-visible controls.
- Secondary actions stay discoverable with few interactions.
- Support Dark Mode, Dynamic Type, orientation and accessibility settings.
- Use system capabilities behind permission: Apple Pay, biometrics, location, share sheet, Photos picker.
- Use system navigation, toolbar, sheet, menu and gestures before building custom ones.
- Allow swipe-back wherever the navigation stack supports it; don't block gestures for an unnecessary custom interaction.

## 2. Navigation

Verbatim: `navigation-and-search.md`, `tab-bars.md`, `toolbars.md`, `sidebars.md`, `searching.md`.

| Structure | Use |
|---|---|
| **Navigation stack** | Hierarchy |
| **Tab bar** | A few stable top-level areas |
| **Sidebar / split view** | Wide screens and deep structure (iPad — see `apple-design-ipad`) |
| **Search** | Integrated into navigation when search is a primary behaviour |

Keep titles meaningful. A large title suits landing/list screens but is not required on every screen.

## 3. HIG components that touch UI/UX directly; special inputs

### 3.1 Component families (verbatim page per item in `../apple-hig/references/`)
| Family | Components |
|---|---|
| Layout / organization | collection, list/table, disclosure, split view, tab view |
| Menus / actions | button, context menu, edit menu, pull-down, activity view, toolbar |
| Navigation / search | search field, sidebar, tab bar |
| Presentation | action sheet, alert, popover, scroll view, sheet, window |
| Selection / input | picker, segmented control, slider, stepper, text field, toggle, keyboard |
| Status / system experience | progress, notification, Live Activity, widget, App Shortcut, status bar |

### 3.2 Special inputs
The HIG also covers Action button, Camera Control, Apple Pencil/Scribble, Digital Crown, eye input, focus/selection, game
controller, gestures, gyro/accelerometer, keyboard, nearby interaction, pointer and remote. **Integrate one only when it creates
real value; always provide a fallback, and never make a special input method the only path.** (Pages: `action-button.md`,
`camera-control.md`, `apple-pencil-and-scribble.md`, `focus-and-selection.md`, `gestures.md`, `keyboards.md`, `pointing-devices.md`.)

---

## 4. Foundations

Rules usable in design and review. Mainly iOS/iPadOS, many apply across Apple platforms.

### 4.1 Accessibility — `accessibility.md`, `voiceover.md`
Accessibility belongs in the definition of done of every component and flow (general rules: `../mobile-ux-fundamentals/references/accessibility.md`). Check four layers:

**Perception**
- Text, icons and controls keep contrast on static **and** moving backgrounds.
- With background images or Liquid Glass, check several states of the content behind — not one sample screenshot.
- Dynamic Type must affect meaningful content, not only body text.
- Video needs captions; information that exists only in imagery needs audio description or an alternative description where suitable.

**Operation**
- Every action driven by a custom gesture has an equivalent control or accessibility action.
- Drag and drop has an alternative for people who can't drag precisely.
- Timeouts warn and allow extension unless a mandatory safety requirement forbids it.
- Custom controls need the minimum hit region, a pressed state and semantics equivalent to the standard control.

**Understanding**
- Navigation, labels, errors and action order are consistent.
- Don't change context unexpectedly just because of focus or value entry.
- Forms give guidance **before** the error when the format is hard to guess.
- Important content uses direct sentences; avoid innuendo or wordplay that is hard to translate.

**Robustness**
- VoiceOver reads name, role, value, state — and a hint only when a hint is really needed.
- Group elements by meaning, not by technical layer.
- Re-check the accessibility tree after every UI refactor.
- Run Accessibility Inspector, then test manually — automated tools can't judge label quality or flow logic.

### 4.2 App icons — `app-icons.md`
An app icon is an identifier, not an advertising poster.
- Pick one dominant concept with a clear silhouette.
- Avoid small text, complex photos, screenshots, overly subtle gradients, or detail visible only at large sizes.
- Use depth, material and light consistent with the platform language, but don't imitate a pressable control.
- Prepare a large enough source asset; check every size the system generates.
- Don't add your own rounded-corner mask or effects the system already applies.
- Alternate icons must still read as the same brand and must not be mistaken for another app.
- Test on light/dark Home Screen, colourful wallpapers, App Library, Spotlight, notifications and Settings.

### 4.3 Branding — `branding.md`
Brand in an app does not mean repeating the logo.
- Express brand through voice, accent colour, controlled typography, illustration, motion and quality of detail.
- Keep familiar navigation/controls; don't replace back, share, close or search with cryptic brand symbols.
- No promotional splash screen after the launch screen.
- Show the logo only where it means something: identity, sign-in, multi-source content, or legal.
- When a brand colour fails contrast, create a semantic variant instead of clinging to the hex code.
- Concentrate brand moments in empty states, onboarding, success, or editorial content; don't add noise to frequent tasks.

### 4.4 Color — `color.md`
A good iOS colour system has three tiers:
1. **System / neutral semantics:** background, grouped background, label, secondary label, separator.
2. **Product semantics:** primary action, success, warning, error, info, selected.
3. **Brand expression:** accent and editorial colours.

Rules:
- Use the asset catalog or semantic colour APIs for light/dark and contrast variants.
- Don't create disabled states with arbitrary opacity — contrast can drop too far.
- Don't hard-code black/white for text; use label semantics.
- Use destructive colour selectively; don't paint a whole screen red because one action is dangerous.
- Charts need a palette that stays distinguishable under colour blindness, supported by markers/labels/patterns.
- With P3, check the sRGB fallback and devices without wide gamut.
- When images/video sit behind controls, keep the resting state legible; a gradient scrim may be needed.

Exact system colour values (light/dark, iOS 27 kit): `ios27-figma-kit.md` §4.1.

### 4.5 Dark Mode — `dark-mode.md`
Dark Mode is a complete appearance, not an inversion.
- Keep hierarchy with semantic colours and materials, not just by adding shadow.
- Avoid pure black backgrounds on every screen unless the content or an OLED display benefits. *(Apple wins where it differs: the
  system background in Dark Mode is #000000 base / #1C1C1E elevated and should be preferred — apply this rule to custom surfaces.)*
- Images, illustrations and logos need variants when brightness or edges get lost.
- Saturated colours can glare on dark backgrounds; adjust tone instead of reusing the light palette.
- Test keyboard, sheet, alert, notification, widget and system bars in the same appearance.
- Respect the system choice; if the app has its own theme, explain Auto/Light/Dark clearly and don't make system surfaces drift.

### 4.6 Icons and SF Symbols — `icons.md`, `sf-symbols.md`
SF Symbols provide alignment, scale, weight and animation that match the system.
- Choose a symbol by meaning, not by "pretty shape".
- Use one rendering mode within a group: monochrome, hierarchical, palette or multicolor.
- Match symbol weight to the neighbouring typography.
- A selected tab usually prefers the filled variant if one exists; don't enlarge it so the layout jumps.
- Variable symbols suit volume, signal, progress — but need an accessible label/value.
- Custom symbols follow the SF Symbols grid and optical proportions.
- Don't mirror every icon in RTL. Navigation-direction arrows usually mirror; media playback, clocks, logos and symbols with physical meaning usually don't.

### 4.7 Images — `images.md`, `image-views.md`
- Pick the scale mode by purpose: aspect fit for content that must be seen whole, aspect fill for covers with controlled crop.
- Don't cover the subject with toolbars, text or safe-area overlays.
- Use correctly sized thumbnails; don't load originals into lists.
- Progressive loading keeps the frame stable.
- Provide an image error state and a reload button when the image is essential.
- Allow zoom/pan for detailed images; support double-tap and accessibility actions.
- If an image carries data, provide a description or a text alternative.

### 4.8 Immersive experiences — `going-full-screen.md`
Immersion serves the content; it never removes control.
- Full screen suits video, games, camera, reading or creating when chrome distracts.
- Bring controls back when the person taps or moves the pointer; auto-hide timing must be reasonable.
- Always provide an easy-to-discover way out.
- Respect orientation; don't force rotation unless truly needed.
- Don't cover system gestures or create competing edge gestures.
- Keep audio, brightness, motion and haptics comfortable over long sessions.

### 4.9 Inclusion — `inclusion.md`
Inclusive design goes beyond compliance:
- Research with people of different cultures, ages, digital skills, abilities and devices.
- Don't assume names, gender, family, address or identity formats follow one template.
- Illustrations are diverse without tokenism or stereotypes.
- Health, finance and safety content avoids judgemental language.
- Let people describe themselves when the data is truly needed; don't collect sensitive attributes just to personalise the surface.

### 4.10 Layout — `layout.md`
- Start from content hierarchy, then choose the container.
- Align to the visual edge rather than the mathematical bounding box when icons/text have optical offset.
- Group by proximity before reaching for dividers and cards.
- Keep primary content stable when the toolbar collapses or the keyboard appears.
- Allow scrolling instead of compressing text/controls below their minimum size.
- Respect the safe area, but background/media may run edge to edge.
- At large Dynamic Type, prefer vertical stacks, multi-line labels and actions that wrap.
- On iPad, use split view / sidebar / panes instead of stretching a single phone column (details: `apple-design-ipad`).

### 4.11 Materials — `materials.md`
Apple materials create layering and preserve context.
- Use system materials to get blur, vibrancy, contrast and accessibility adaptation for free.
- The content layer should be clear; the navigation/control layer may use Liquid Glass.
- Don't stack several blur/translucency layers — hierarchy gets lost and performance suffers.
- With Reduce Transparency on, the interface still separates layers with suitable opaque colours.
- Material does not replace spacing, typography or structure.
- Test custom backgrounds behind glass while scrolling — contrast changes continuously.

### 4.12 Motion — `motion.md`
- Tie motion to its cause: source control → destination, old object → new object.
- Keep spatial continuity on expand/collapse, sheet detents or split-view resize.
- Gesture-driven animation follows the finger and finishes according to velocity.
- Avoid chained animations that make people wait.
- A loading animation must not suggest fake progress.
- Reduce Motion replaces strong transitions with gentle effects while keeping feedback.

### 4.13 Privacy — `privacy.md`
Four principles:
- **Data minimization:** collect only what is needed.
- **Purpose clarity:** say what it is for at the moment you ask.
- **User control:** people can decline, change and delete where appropriate.
- **Secure defaults:** the default protects more; people shouldn't have to hunt for a setting.

Practice:
- Use the Photos picker instead of full library access if only a few photos are needed.
- Use approximate location if it is enough.
- Don't ask for tracking, contacts, microphone or camera before a related action.
- Before the system prompt, explain the concrete value — and never fake a system button.
- After a refusal, don't loop the prompt; point to Settings only when a core function needs it.
- Avoid showing sensitive data in notifications/widgets by default.

### 4.14 Right to left — `right-to-left.md`
- Lay out with leading/trailing.
- Navigation direction, disclosure and progress may mirror with the writing system.
- Phone numbers, codes, expressions, media controls and logos may stay LTR.
- Test mixed-direction text for real, especially punctuation and placeholders.
- Icons containing text need localized assets or the text removed.
- Don't just mirror a screenshot: check focus order, swipe actions, charts and animation.

### 4.15 Spatial layout
When designing spatial interfaces or content with depth:
- Respect comfort, viewing distance and the natural field of view.
- Don't put essential information in the periphery.
- Scale and depth must mean something; no excessive parallax.
- Targets need enough spacing for eye/pointer selection.
- Sound can reinforce position but needs a visual equivalent.
- Avoid virtual objects that block the environment or disorient people.

### 4.16 Typography — `typography.md`
Beyond Dynamic Type:
- Use semantic text styles so the system adjusts size/leading/weight.
- Headlines don't replace structural hierarchy; too much bold flattens everything to one level.
- Align icons to the text baseline.
- Text links are recognisable by more than colour alone.
- Long passages need whitespace, a sensible line length and paragraph spacing.
- A custom font must cover Vietnamese glyphs, local characters, numerals and accessibility sizes.

Exact sizes: `../SKILL.md` core rules and `ios27-figma-kit.md` §4.3.

### 4.17 Writing — `writing.md` (full guidance: `../ux-writing/references/principles.md`)
Apple favours clear, direct, people-centred language.
- Say what people can do; avoid long descriptions of the system.
- Buttons use verbs; menu items describe the result.
- An alert title can be a short sentence describing the problem; the body adds consequence/fix.
- Don't repeat the title in the body.
- Use sentence case per localization; don't force English capitalization onto every language.
- Don't put "Please" in every sentence unless it adds politeness or clarity.
- Keep a calm tone for errors; no jokes in data-loss, health or payment situations.

### 4.18 App launch and first state — `launching.md`
The launch screen only creates a fast transition:
- It resembles the background/basic frame of the first screen — no ads, no dynamic text.
- Don't delay launch to "show the logo".
- After launch, prefer cached content or a stable skeleton.
- If migration, authentication or restore is needed, show progress and keep it recoverable.

---

## 5. Patterns

### 5.1 Charting data — `charting-data.md`, `charts.md`
- Choose the chart by the question: trend → line, comparison → bar, composition → stacked when sensible.
- Axes, units, time marks and range are clear.
- Data points are selectable with large enough targets; tooltips/annotations don't hide context.
- Provide a VoiceOver summary and an alternative data table.
- Avoid dual axes, 3D, or truncated scales that mislead.

### 5.2 Collaboration and sharing — `collaboration-and-sharing.md`
- Distinguish sharing a copy, sharing a link, and live collaboration.
- Show permission state — owner, editor, viewer — and explain who can access.
- Presence/avatars don't cover content.
- Conflicts need merge or history; never silently overwrite.
- Use the system share sheet for general sharing; custom flows only for special permission/collaboration needs.

### 5.3 Drag and drop — `drag-and-drop.md`
- A draggable object gives feedback on lift.
- Drop targets appear at the right time and show accepted/rejected.
- Auto-scroll at the edges of long lists.
- Drag is never the only path; provide Move/Copy/Reorder menus.
- For reorder, keep focus and announce the new position to assistive technology.
(Especially valuable on iPad — `apple-design-ipad`.)

### 5.4 Entering data — `entering-data.md`
- Choose the control by data type and number of options.
- Use formatters/keyboard types/autofill to reduce typing.
- Show complex requirements before submit.
- Allow paste, scan or import when it reduces errors.
- Sensitive data gets appropriate privacy and secure entry.

### 5.5 Feedback — `feedback.md`
Feedback can be visual, audio or haptic, but shouldn't depend on one channel.
- Immediate feedback confirms a tap/gesture.
- Progress feedback for long processing.
- Completion feedback sits near the result.
- Error feedback says how to recover.
- Don't use an alert for light feedback, and don't repeat haptics continuously.

### 5.6 File management
- Use the document picker and the system location model for files outside the app.
- Autosave and versioning reduce the risk of data loss.
- Show sync, conflict, unavailable/offline states clearly.
- Rename/move/delete protects the extension, location and undo.
- Don't let people think a file is downloaded when only a cloud placeholder exists.

### 5.7 Going full screen — `going-full-screen.md`
- Go full screen only when the content clearly benefits.
- Chrome hides/shows through an easy-to-discover interaction.
- Keep the exit gesture and necessary system indicators.
- When the keyboard/a notification appears, people don't lose context.

### 5.8 Launching — `launching.md`
- Start fast; no repeated intro screen.
- Restore the appropriate screen, but consider privacy when the app returns.
- Universal/deep links open the right destination; if sign-in is needed, resume the destination after sign-in.
- Bootstrapping distinguishes network error, maintenance and expired session.

### 5.9 Live-viewing apps — `live-viewing-apps.md`
- Live content is the focus; controls don't cover what matters.
- Live/delay status, quality, captions and audio track are clear.
- On network loss, explain that it is reconnecting and keep the playback context.
- Avoid destructive actions or chat overlays covering the video.

### 5.10 Loading — `loading.md`
- For very short waits, press feedback may be enough; don't flash a spinner.
- Use determinate progress when it can be estimated reliably.
- Skeletons mirror the real layout; don't use them for actions that don't load content.
- If a task runs in the background, let people leave the screen and notify when done.
- Provide cancel when a task is long, data-heavy, or has consequences.

### 5.11 Managing accounts — `managing-accounts.md`, `sign-in-with-apple.md`
- Delay sign-in until it's needed or its benefit is clear.
- Support Sign in with Apple when the requirement applies.
- Account switching shows the current account and the scope of data.
- Account deletion is not hidden; explain which data is lost, retention and processing time.
- Re-authenticate only for sensitive actions; don't interrupt often.

### 5.12 Managing notifications — `managing-notifications.md`
- Ask for permission after people understand what kind of notifications they'll get.
- Offer in-app preferences per category, not only a master switch.
- Time-sensitive/critical only when they truly meet the criteria.
- Badges mean something and clear when the item is handled — not merely when the app is opened.
- Notification actions are short, safe and compatible with Lock Screen privacy.

### 5.13 Modality — `modality.md`
Modality creates a temporary context and restricts navigation:
- Use it to complete/cancel a separate task, pick data, or confirm something important.
- Don't use it for information that could be inline or pushed.
- Provide Done/Cancel by convention and protect unsaved changes.
- Don't chain modals; for a long flow use a full-screen task or its own navigation.

### 5.14 Multitasking — `multitasking.md`
- The app survives resizing and losing focus.
- State doesn't reset when the window shrinks/grows.
- Drag and drop, clipboard and multiple windows add value on iPad.
- Background tasks save resources and reflect their state when the person returns.
(iPad windowing: `apple-design-ipad`.)

### 5.15 Offering help — `offering-help.md`
- Prefer self-explanatory UI and contextual help.
- Tooltips/hints are short; never use them to patch an unclear label.
- A help centre needs search, task-based structure and deep links to the right article.
- For recurring errors, put a support link right in the error state.
- Don't auto-launch a tour on every update.

### 5.16 Onboarding — `onboarding.md`
- Introduce only value or concepts that can't be understood on their own.
- Allow skip; don't make people memorise complex gestures from a carousel.
- Keep permissions separate from marketing slides.
- Personalisation asks little, has good defaults and can be changed later.
- Sample data helps understanding but is clearly distinguished from real data.

### 5.17 Playing audio — `playing-audio.md`
- Respect silent mode, the audio session and whatever is already playing.
- No unexpected autoplay sound.
- Play/pause, seek, route, volume and Now Playing are consistent.
- Show buffering, downloaded and device-route states.
- Support background / Lock Screen / remote control if the experience needs it.

### 5.18 Playing haptics — `playing-haptics.md`
- Use system haptics for selection, impact, notification.
- Sync timing with the visual state.
- Don't repeat densely — tiring and battery-draining.
- Haptics never replace labels, sound or visual feedback.

### 5.19 Playing video — `playing-video.md`
- Use familiar player controls.
- Keep aspect ratio, captions, audio description, AirPlay/Picture in Picture where suitable.
- Muted autoplay only when people expect it, with a way to stop.
- The scrubber is large enough, with preview for long videos.
- Rotation/full screen doesn't lose the playback position.

### 5.20 Printing
- Print preview reflects the final result.
- Use the system print UI.
- Printed content has suitable pagination, margins, orientation and colour.
- Don't print navigation chrome or meaningless controls.

### 5.21 Ratings and reviews — `ratings-and-reviews.md`
- Ask for a rating only after a genuine positive moment, never right after an error.
- Don't block the task or ask repeatedly.
- Don't ask "Do you like the app?" to send only happy people to the App Store.
- A separate feedback/support path must not be used as a dark pattern that filters reviews.

### 5.22 Searching — `searching.md`, `search-fields.md`
- The search field placeholder describes the scope when needed.
- Results update quickly, but avoid excess requests with a reasonable debounce.
- Highlight keywords with restraint; ranking favours relevance.
- Recents/suggestions can be cleared when privacy is involved.
- The no-results state suggests fixing the term, removing filters or browsing categories.

### 5.23 Settings — `settings.md`
- Defaults work well without configuration.
- Task-related settings live near the task; long-term preferences go in Settings.
- Group by mental model; add search if large.
- Each toggle describes the positive state; avoid double negatives.
- For high-impact changes, offer a preview or explanation.

### 5.24 Undo and redo — `undo-and-redo.md`
- Support undo for common edits and destructive actions.
- The undo scope is clear and doesn't change unexpectedly when switching screens.
- Provide a menu/button alternative to the shake gesture.
- For multi-step operations, one undo transaction matches one user intention.

### 5.25 Workouts
- The main metric is glanceable: high contrast, large numerals.
- Controls used while moving need large targets and few steps.
- Avoid fine gestures or long confirmations while the person is moving.
- Haptic/audio cues help but are never the only channel.
- Pause/end protect against accidental taps and show the recording state clearly.

---

## 6. Component catalog

### 6.1 Layout and organization
| Component | Use when | Avoid when | Review points |
|---|---|---|---|
| Box (`boxes.md`) | Grouping content with a clear boundary, mostly desktop | Pure decoration on phone | Title, padding, hierarchy |
| Collection (`collections.md`) | Flexible grid/items, images or cards | Data that must be read sequentially like a table | Reuse, selection, adaptive columns |
| Column view | Browsing a hierarchy in several columns | Compact phone | Selection persistence, width |
| Disclosure control (`disclosure-controls.md`) | Locally showing/hiding detail | Main content or a mandatory action | State label, focus |
| Label (`labels.md`) | Pairing an icon with semantic text | Hand-aligning icon and text | Baseline, Dynamic Type |
| List/table (`lists-and-tables.md`) | Sequential data, scanning, settings | Very free-form editorial content | Row actions, separators, selection |
| Outline view (`outline-views.md`) | Hierarchical tree | Shallow hierarchy | Expand state, keyboard |
| Split view (`split-views.md`) | Master–detail, several panes | Compact space that can't fit them | Collapse behaviour, selection |
| Tab view (`tab-views.md`) | Peer destinations | Step flows or actions | State per tab, number of tabs |

### 6.2 Menus and actions
**Activity view** (`activity-views.md`)
- Use the system share sheet for share/copy/save/print/action extensions.
- Prepare items with the right type and preview; don't put app-specific actions in the share sheet when they don't fit the context.
- On iPad, anchor the popover to the correct source.

**Buttons** (`buttons.md`)
- A button has a style, content and a semantic role.
- Hit region at least **44×44 pt**.
- A custom button always has a pressed state.
- Only one or two prominent buttons per view; more increases decision load.
- Distinguish priority with style, not by changing size.
- The primary role is not for destructive actions, even when the destructive choice is the "likely" one.
- For slow processing, an activity indicator can sit inside the button and the label changes to a state such as "Đang lưu…" ("Saving…").

**Context menu** (`context-menus.md`)
- For object-related, less frequent actions.
- An important main action must also be discoverable outside the context menu.
- A preview is useful but optional; destructive actions are separated.

**Edit menu** (`edit-menus.md`)
- Keep Cut/Copy/Paste/Select as the system defines them.
- Custom edit actions apply to the right selection and support the keyboard.

**Pull-down / pop-up button** (`pull-down-buttons.md`, `pop-up-buttons.md`)
- Pull-down opens a list of actions; pop-up shows the current selection.
- The label/icon signals that there is a menu.
- Long menus need grouping, checkmarks and keyboard navigation.

**Toolbar** (`toolbars.md`)
- Holds actions for the current screen, not top-level destinations.
- Prioritise frequent actions; overflow the rare ones.
- Icons need accessibility labels; order is stable.
- In modern iOS the toolbar sits on Liquid Glass, so use colour sparingly.

### 6.3 Navigation and search
**Search field** (`search-fields.md`)
- The placeholder may describe the scope: "Tìm trong ghi chú" ("Search in notes").
- Cancel/clear behave by convention.
- With the keyboard open, results and filters aren't covered.
- A dedicated search tab only when search is a main area.

**Sidebar** (`sidebars.md`) — suits iPad/Mac and structures with groups/hierarchy. Selection is clear and the detail pane updates
steadily. It may convert to/from a tab bar when the structure fits, but don't force that when the sidebar is the main model.
(Details: `apple-design-ipad`.)

**Tab bar** (`tab-bars.md`)
- For navigation, not actions.
- Always visible across the main destinations; a modal may cover it temporarily.
- Fewer tabs are easier; avoid More/overflow.
- Don't hide/disable a tab just because its content is empty; open it and explain the empty state.
- One-word labels where possible; badges only for information that truly needs attention.
- Each tab keeps its own navigation state.

### 6.4 Presentation
**Action sheet** (`action-sheets.md`) — choices related to one action, especially destructive ones. On iPad it must anchor to the
source. Clear Cancel; never use it for an OK-only message.

**Alert** (`alerts.md`)
- Only when attention or a decision is needed before continuing.
- Title states the problem; message states the consequence/how to handle it.
- At most a few actions, with specific labels.
- Don't abuse it for success, permission pre-prompts or marketing.

**Page control** (`page-controls.md`)
- For a small number of horizontal pages where people understand they can swipe.
- Not for many pages that can't be navigated to.
- The current page state is accessible.

**Popover** (`popovers.md`) — secondary content tied to a source; it doesn't cover the source or data people need to reference. Size
appropriately; don't turn it into an overly complex mini-screen.

**Scroll view** (`scroll-views.md`)
- One main scroll direction where possible.
- Nested scrolling needs a clear reason.
- Keep scroll position on return; content insets respect the safe area.

**Sheet** (`sheets.md`)
- For a self-contained secondary task.
- Detents reflect the amount of content; dragging must not lose data unintentionally.
- Clear Done/Cancel or close; warn on dismiss with unsaved data.

### 6.5 Selection and input
**Picker** (`pickers.md`) — the value belongs to a finite set. Choose the presentation by count: inline, menu, wheel, navigation
list. Don't use a wheel for a very long, hard-to-scan list when search would work better.

**Segmented control** (`segmented-controls.md`) — 2–5 peer options with short labels. Not for navigation hierarchy or multiple
selection. At large text sizes, change the layout instead of squeezing segments.

**Slider** (`sliders.md`) — continuous or approximate values. Show the value when precision matters; min/max labels if they help.
Not for a few discrete values when a segmented control/stepper is clearer.

**Stepper** (`steppers.md`) — small increments; always show the value near the control. Clear limits and disabled state.

**Text field** (`text-fields.md`, `text-views.md`)
- Single-line input; text view for multi-line.
- Choose content type, keyboard and submit label to match.
- Clear button, secure entry, autocorrection/capitalization according to the data.
- An error is not just a red border: give a message and a VoiceOver announcement.

**Toggle** (`toggles.md`)
- A boolean change that takes effect immediately.
- The label describes the property in positive form.
- Don't add Save just to apply one toggle, unless the form is a multi-change transaction.

### 6.6 Status
**Progress indicator** (`progress-indicators.md`) — determinate if progress is known, indeterminate if not. Label the task when
several processes run. Don't reset the bar when the phase changes; explain the phase if needed.

**Gauge** (`gauges.md`) — values in a meaningful range such as battery, temperature, capacity. Text value/unit; colour is not the only signal.

**Rating indicator** (`rating-indicators.md`) — distinguish display-only from editable. Number/meaning label, large enough target,
keyboard/VoiceOver support.

## 7. System experiences

**App Shortcuts** — each action has a clear phrase/intent, sensible parameters and a confirming result.

**Notifications** (`notifications.md`) — timely content, sensible categories/actions, correct deep link, no badge abuse.

**Live Activities and widgets** — rules, exact sizes and surface limits (no blur, Dynamic Island always black):
`../apple-design-widget/SKILL.md`.

**Home Screen quick actions** — `../apple-design-widget/SKILL.md` §Quick actions.
