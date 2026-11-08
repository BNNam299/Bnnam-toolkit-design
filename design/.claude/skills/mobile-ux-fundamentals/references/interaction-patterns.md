# Interaction styles, UX patterns and screen templates

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/interaction.md, knowledge/patterns.md (§13, §27, Telos 11) @ 3c0e291 — translated, complete

Knowledge here is a lens for thinking, not a procedure. Platform pages with the exact component rules are linked per section
(`../apple-hig/references/`, `../material-design-3/references/`).

## Contents
1. Interaction styles (WYSIWYG, menus, forms, gestures)
2. Common UX patterns (onboarding → data visualization)
3. Screen and flow templates (list → error state)
4. Mobile app design end to end (strategy → release checklist)
5. iOS 27 / iPhone Duo additions (pointers)

---

## 1. Interaction styles

Used when wireframing and building UI.

| Style | Rule |
|---|---|
| **WYSIWYG** (what you see is what you get) | What you see is what you interact with — the interface must show what is touchable. |
| **WYGIWYS** (what you get is what you see) | Act on natural thought, no button needed (swipe to turn a page like a book, pick a ball from one box into another). Follow the **mental model and real-world habits**; more delightful but demands creativity. |
| **Menu selection** | The user does not have to remember. Rules below. |
| **Audio menu** | At most **3–4 options** per menu so they can be remembered. |
| **Form fill-in** | Rules below. |
| **WIMP** | Windows, icons, menus, pointers (desktop). |
| **Touch / gesture** | Follow iOS interaction standards; attractive gestures create delight: touching two phones (AirDrop), NFC, shake to undo, face-down to turn the screen off, AR, fingerprint, face, eyes, voice, motion recognition. Always keep a visible alternative (see SKILL.md core rules). |

**Menu selection rules**
1. Many options (dozens or more) must be **categorised** so they are easy to find.
2. Color/graphics **distinguish the selected item** from unselected ones (never color alone — see `accessibility.md` §1.4).
3. Titles are fitting, consistent, clear, familiar.
4. Sort by one order: time · attribute · alphabetical · priority.

**Form fill-in rules**
- Meaningful titles · sufficient, easy instructions · move with Tab/Enter (mobile: the keyboard **Next** key).
- **Group logically** · aesthetic presentation · **consistent terminology and abbreviations** · whitespace and outlines for input fields.
- **Allow going back to edit** · **prevent input errors** · **warn when something is wrong**.

Platform detail: `../apple-hig/references/gestures.md`, `../material-design-3/references/foundations__interaction__gestures.md`,
`../apple-hig/references/menus.md`, `../material-design-3/references/components__menus.md`, `../apple-hig/references/entering-data.md`.

---

## 2. Common UX patterns

### 2.1 Onboarding
- Get people to the core value as early as possible.
- Teach in context; avoid long carousels describing features not yet experienced.
- Allow skipping non-essential parts.
- Do not ask for many permissions on first launch.
- If an account is needed, explain the benefit and consider a guest mode.

Platform: `../apple-hig/references/onboarding.md`.

### 2.2 Permission
1. Ask only when the feature is about to need it.
2. A pre-prompt explains in product language if the benefit is not obvious.
3. Use the system prompt at the right moment.
4. If denied, offer a degraded experience and a path to Settings when really needed.
5. Do not pressure or repeat the prompt continually.

Platform: `../apple-hig/references/privacy.md`.

### 2.3 Loading, empty and offline
- Distinguish **initial loading, refresh, pagination and background sync** — each looks different.
- Keep old content during refresh if it is still useful.
- An empty state explains why it is empty and offers a sensible CTA.
- An offline state says which data is still usable, which actions will be queued and when it will sync.
- A timeout must offer retry and must not lose entered data.

Platform: `../apple-hig/references/loading.md`, `../apple-hig/references/progress-indicators.md`,
`../material-design-3/references/components__progress-indicators.md`, `../material-design-3/references/components__loading-indicator.md`.

### 2.4 Form
- Ask only for data that is needed.
- Order by the user's logic, not the backend schema.
- Use safe defaults and autofill.
- Split into sections; a very long form may be stepped, but must show progress.
- Keep data when going back or when the app is interrupted.
- A submit error must point to the field, plus a summary if there are several errors.

Platform: `../apple-hig/references/text-fields.md`, `../material-design-3/references/components__text-fields.md`. Error copy: `../ux-writing/references/principles.md`.

### 2.5 Destructive action and undo
- Prefer soft delete / undo when possible.
- Use a confirmation only when the consequence is large, hard to reverse, or the action is easy to hit by mistake.
- Name the object: *"Xóa 3 ảnh"* ("Delete 3 photos") is better than *"Bạn có chắc không?"* ("Are you sure?").
- Primary/secondary placement follows each platform's convention; do not force them to be identical.

Platform: `../apple-hig/references/alerts.md`, `../apple-hig/references/action-sheets.md`, `../apple-hig/references/undo-and-redo.md`,
`../material-design-3/references/components__dialogs.md`, `../material-design-3/references/components__snackbar.md` (Undo action).

### 2.6 Notification
- Send only timely, valuable content the user expects.
- Batch or reduce frequency; allow managing categories.
- Content protects privacy on the lock screen.
- Tapping a notification opens the right context.
- Actions inside a notification are short, safe and give feedback.

Platform: `../apple-hig/references/notifications.md`, `../apple-hig/references/managing-notifications.md`,
`../material-design-3/references/foundations__content-design__notifications.md`.

### 2.7 Settings
- Put frequently used settings close to where they take effect.
- App-wide Settings is for long-term preferences, not frequent actions.
- Use good defaults to reduce the need for configuration.
- Describe the consequence; avoid double negatives.

### 2.8 Account and authentication
- Support password managers, passkeys/biometrics where appropriate.
- Never block pasting a password/OTP.
- State why a session expired and protect draft data.
- Logout, delete account and export data are easy to find in proportion to the risk/legal requirement.
- Do not use biometrics as the only proof for an action that needs deliberate confirmation in a risky context.

Platform: `../apple-hig/references/managing-accounts.md`, `../apple-hig/references/sign-in-with-apple.md`.

### 2.9 Data visualization
- Choose the chart by the question, not by looks.
- Include title, unit, timeframe, legend and a no-data state.
- Never color alone; add label, pattern or marker.
- Give screen readers a summary and alternative data.
- Avoid 3D charts that distort perception.

Platform: `../apple-hig/references/charting-data.md`, `../apple-hig/references/charts.md`.

---

## 3. Screen and flow templates

### 3.1 List screen
**Structure**
1. App/navigation bar with title and screen-level actions.
2. Search/filter/sort if the data set is large.
3. List or grid.
4. Loading, empty, error, offline and pagination states.
5. A primary create action if needed.

| Platform | Convention |
|---|---|
| iOS | List + navigation title, integrated search, toolbar/add button; **swipe actions also available in a menu**. |
| Android | Top app bar, lazy list/grid, FAB when create is the primary action; **snackbar for undo**. |

**Review questions**
- Do rows scan quickly?
- Can a tap on the whole row be confused with an accessory action?
- Is an active filter visible?
- Does going back keep scroll position/selection?

### 3.2 List–detail
- **Compact:** list → push detail; back returns to the exact position.
- **Expanded:** two panes; the list keeps its selection, detail updates. With nothing selected, show a placeholder with guidance. Do not auto-select the first item if that could trigger an action or expose data unintentionally.
- **Foldable:** use the fold as a spacer; avoid putting content across the hinge.

### 3.3 Create/edit form
**Structure**
- Title distinguishes Create vs Edit.
- Sections follow the mental model.
- Label, supporting text, fitting input type.
- Inline validation.
- Clear Save/submit and its loading state.
- Cancel/back handles unsaved changes.

**Principles**
- Use keyboard Next/Done to move.
- Auto-scroll the focused field clear of the keyboard.
- Do not disable Save without explanation; you may allow submit so errors are revealed clearly.
  *(Nuance: M3 dialogs disable the confirming action until a required choice is made — `components__dialogs.md`. In full forms, prefer the rule here.)*
- Draft/autosave for long forms.
- On success, return to the updated context; do not open an unnecessary success modal.

### 3.4 Authentication
Preferred flow:
1. State the value and the minimum requirement.
2. Passkey / Sign in with Apple / password manager where appropriate.
3. Errors do not reveal that an account exists in sensitive contexts.
4. MFA/OTP supports autofill and paste.
5. After login, return to the original destination.

Never force odd password rules, never block paste, never clear the email when the password is wrong.

### 3.5 Checkout / payment
- Total, fees, tax, address and method are clear before confirmation.
- The final CTA names the consequential action: *"Thanh toán 520.000 ₫"* ("Pay 520,000 ₫").
- Avoid changing the price after the confirmation step without notice.
- Idempotency prevents duplicate payment.
- While pending, do not say "failed"; explain the state and how to check.
- Apple Pay / Google Pay use the official component and flow (`../apple-hig/references/apple-pay.md`).

### 3.6 Settings
- Search if there are many groups.
- Sections by goal: Account, Notifications, Privacy, Appearance, Data.
- A toggle takes effect immediately; a navigation row has a chevron and the current-value summary.
- Destructive/account deletion lives in its own area — not too easy to hit, but not hidden.
- Make clear whether a preference syncs or is local if it affects several devices.

### 3.7 Dashboard
- Choose the 3–5 questions the user needs answered; do not gather every metric.
- KPIs have unit, timeframe and a clear comparison.
- Tapping a card leads to analysis in the right context.
- Show stale/partial data states.
- Expanded: grid/panes; compact: prioritise vertical order.

### 3.8 Media player
- Art/media is the focus.
- Play/pause is easy to reach; seek, duration, route and captions are clear.
- The mini player keeps state while navigating.
- Lock screen / notification / Now Playing stay in sync.
- Buffering looks different from paused; playback errors have retry and just enough information.

### 3.9 Chat / messaging
- The composer stays attached to the conversation and avoids the keyboard.
- Delivery state, failed/retry and timestamps do not add noise.
- A new message arriving while scrolled back does not jump the position; show an indicator to return to the bottom.
- Attachment upload has progress/cancel.
- AI-generated messages identify their source and allow editing before sending where appropriate (`ai-product.md`).
- Privacy: notification preview and screenshot/sensitive-content policy are clear.

### 3.10 Map + detail
- The map does not cover all controls; respect safe area and gesture coexistence (map pan vs sheet drag vs system edges).
- Cluster markers at low zoom.
- The selected marker is clearly linked to the bottom/side sheet.
- Compact: bottom sheet with several detents; expanded: supporting side pane.
- Ask location permission only when the user uses a location feature.

### 3.11 Camera / scanner
- Large preview; shutter/primary action easy to hit.
- Short framing guidance placed outside the important area.
- Permission, no-camera, low-light and capture-failure states exist.
- After capture, allow review / retake / confirm.
- Do not save media unintentionally; explain data handling.

### 3.12 Empty state template
An empty state may contain:
- A small visual if it helps recognition.
- A title stating the state.
- Body stating the cause or the value that will appear.
- A single CTA if there is a sensible action.

Distinguish the six kinds (each gets its own copy and CTA):

| Kind | Typical CTA (column added in this skill as a starting point) |
|---|---|
| First-use empty | Create the first item / import |
| User-cleared empty | None, or a quiet "create" — it is a success state |
| No search results | Edit the query / clear search |
| Filtered empty | Clear or change filters (show which filters are active) |
| Permission-blocked | Explain + path to grant / Settings |
| Offline / no cached data | Retry; say what will appear when online |

Copy: `../ux-writing/references/principles.md`.

### 3.13 Error state template
- **Inline error** for local errors.
- **Full-page error** when the main content cannot load.
- **Dialog** only when a decision is needed or the error blocks an important action.
- Always keep entered data.
- Retry close to the error; support/reference ID only when it really helps resolve it.

---

## 4. Mobile app design end to end

### 4.1 App design is not just drawing screens
Mobile product design covers problem framing, research, flow, architecture, UI, prototype, testing, technical constraints and metrics.
Small screens, touch, interruptions, permissions, network and platform rules create constraints different from the web.

### 4.2 Define the product
- Core job and frequency of use.
- Platform: iOS, Android or cross-platform.
- Account/authentication and sensitive data.
- Online/offline, sync and multi-device.
- Notification, location, camera, file or payment.
- Metrics: activation, task success, retention and crash-free rate.

### 4.3 IA and navigation
Choose navigation by the number of areas and their frequency: **bottom tab for 3–5 main destinations**, navigation stack for drill-down,
drawer is lower priority on modern mobile. Users need to know where they are, the way back, and the effect of system back/gesture.
Deep links, push notifications and widgets create entry points outside home; flows must handle expired session, permission and missing context.
Platform: `../apple-hig/references/tab-bars.md`, `../material-design-3/references/components__navigation-bar.md`.

### 4.4 Touch and ergonomics
Touch targets large enough, spacing that prevents mis-taps, primary action easy to reach but not covering content. Gestures need an
affordance or an alternative; do not hide an important action only in a swipe. Haptics are supplementary feedback, never a replacement
for visual/audio. Numbers: SKILL.md core rules 1 and 6.

### 4.5 Form and keyboard
Choose the right keyboard type, autofill, input mask and validation timing. With the keyboard open, field/error/CTA stay visible; support
Next/Done. Reduce input with defaults, scanning, pickers or existing data, but be transparent about permissions.
Platform: `../apple-hig/references/keyboards.md`, `../apple-hig/references/virtual-keyboards.md`.

### 4.6 State and resilience
Design each of these:
- First load, skeleton/progress.
- First-time empty and zero results.
- Offline, slow network, timeout and retry.
- Partial failure and stale data.
- Permission denied/restricted.
- Session expired.
- Success, undo and destructive confirmation.

Optimistic UI increases perceived speed but needs rollback and a clear sync state.

### 4.7 iOS and Android
Respect the Human Interface Guidelines and Material Design on navigation, components, typography, permission, back behaviour and platform
convention. The brand can be unified, but interaction need not be pixel-identical. Native conventions lower the learning cost and improve
accessibility. See `../material-design-3/references/cross-platform-decisions.md`.

### 4.8 Responsive and adaptive
Mobile is not one size. Check small phone, large phone, landscape, tablet/foldable, Dynamic Type and safe area. An adaptive layout may
change columns, navigation or panels. Never lock heights to one sample device. Layout detail: `../mobile-ui-master/SKILL.md`.

### 4.9 Accessibility
Dynamic text, contrast, touch target, screen-reader label/order, Switch Control, Voice Control, reduced motion and captions. Check focus when
a modal/sheet opens, custom gestures and status announcements. Never use a placeholder as the label. Full detail: `accessibility.md`.

### 4.10 Prototype and testing
Prototype the important tasks and the risky states. Test on real devices because reach, keyboard, gestures and context differ from a desktop
preview. With a coded prototype, test permission, camera, sensors or complex animation. Record task success, errors, hesitation and comprehension.

### 4.11 Handoff
Hand over breakpoint/device rules, components/states, asset density/vector, icons, animation, haptics, permission copy, keyboard behaviour,
safe area and accessibility. Agree on native/cross-platform constraints. Design QA on real OS/devices, checking dark mode and localization.
Process: `../figma-ui-flow/references/handoff-qa.md`, `../ux-review-handoff/references/acceptance-checklist.md`.

### 4.12 Release checklist
- [ ] Onboarding teaches only what is needed before doing.
- [ ] Permissions are asked at the right time and explain the value.
- [ ] Back / deep link / session work.
- [ ] Offline / error / retry are designed.
- [ ] The keyboard does not cover actions.
- [ ] Touch targets and screen reader meet requirements.
- [ ] Notifications have preferences and a way to turn them off.
- [ ] Analytics, crash reporting and privacy consent are clear.

Main sources (Telos Academy, Vietnamese): 8 principles of mobile app design for iOS and Android; designing app UI in Figma from UI to product
design; mobile app learning path; prototyping in Figma for beginners.

---

## 5. iOS 27 / iPhone Duo additions (pointers)

The foldable deep-dive lives in the `iphone-duo-adaptive` skill (`../iphone-duo-adaptive/SKILL.md`). Topics relevant here:
- Input system and action equivalence — touch, keyboard, pointer, Camera Control.
- Camera Control per pose.
- Visual / audio / haptic feedback matrix.
