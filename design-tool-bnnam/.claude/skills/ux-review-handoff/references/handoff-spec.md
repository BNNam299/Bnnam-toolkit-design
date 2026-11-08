# Developer handoff — team dev notes, spec content, implementation limits, system integration

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/handoff.md, knowledge/handoff-spec.md (§18), knowledge/dev-awareness.md, knowledge/system-integration.md (§32) @ 3c0e291 — translated, complete

Part A is the team's dev-note job on the Figma file (optional). Part B is what a handoff must specify. Part C is what developers
constrain. Part D is system integration and advanced situations a spec has to cover. Tool-demo mechanics for Dev Mode, annotations,
measurements, asset export and token mapping live in `../figma-ui-flow/references/handoff-qa.md` §4–6 — not repeated here.

## Contents
- **A. Dev notes on Figma** — 1. When · 2. Modes · 3. Note convention · 4. Identifying a dev note · 5. Note content · 6. Adaptive
  projects · 7. Backgrounds · 8. Stop points, self-check, report
- **B. What a handoff specifies** — 9. State matrix · 10. Behaviour spec · 11. Responsive spec · 12. Content spec
- **C. Implementation limits (dev awareness)** — 13
- **D. System integration and advanced situations** — 14. System bars · 15. Back · 16. Keyboard/IME · 17. Clipboard, autofill,
  passkey · 18. Permission state machine · 19. Lifecycle and restoration · 20. Offline-first · 21. Optimistic UI · 22. Background
  work · 23. Notifications · 24. Widgets and live surfaces · 25. Foldables and posture · 26. Large screens and desktop input ·
  27. Performance budgets · 28. Security-sensitive UX · 29. AI interaction · 30. iOS 27 / iPhone Duo pointers

---

# A. Dev notes on Figma

Handoff to developers is **optional**. Dev notes only **carry** information that already exists in the project's `design/` files — they
never write new specification.

## 1. When

- Screens are accepted and the user asks for *"ghi chú cho dev"* *(notes for dev)*, *"bàn giao"* *(handoff)*.
- **Not** for writing new specs, changing behaviour, or placing notes inside screen frames.

| Check | If missing |
|---|---|
| The flow holding the screen is marked accepted in `flows.md` | say which screens aren't accepted |
| The user has chosen a mode (§2) | **ask first** — never place notes on your own |

| Read | Write |
|---|---|
| `flows.md` · design decision log · `voice.md` (dev-note language) · the UI page in Figma | `Dev Note` instances + arrows on the UI page, at section level |

## 2. Modes — the user chooses

| Mode | What the agent does |
|---|---|
| **Notes on Figma** | places dev notes + arrows next to the screen, following the convention found in the file |
| **Skip** | nothing — the user writes notes by hand |
| **Dev Mode** *(optional)* | tool-demo tools: `annotate` (behaviour, states, motion, accessibility labels) · `set_dev_status` *Ready for dev* on approved sections · `export_assets` / `export_tokens` into `design/assets/` — see `../figma-ui-flow/references/handoff-qa.md` §4 and `../figma-agent-tools/SKILL.md` |

Default: **ask first**.

## 3. Note convention — detect it from the file, never assume

A real reference (one project's UI page):

| | Convention |
|---|---|
| Note | an **instance** of the note component · yellow fill `#F0DA80` · width 260 · padding 20 · text uses a text style |
| Arrow | `VECTOR` · white 2 px stroke · named `Arrow N` |
| Position | **section level, next to the screen** — never inside the screen frame |

That is **one** project. **Detect the existing note component and arrow style** in the current file and use instances — never draw a
new note, never hard-code the yellow. Other projects may use other colours, sizes, shapes. The file has no note component → say so and
propose creating a `Dev Note` component (component spec: `../design-system-audit/SKILL.md`).

**Placing notes outside the screen frame matters:** a note inside a screen ends up in exported images and is counted as a UI element by
the audit (`../scripts/audit.js` reports `devNoteInScreen`).

## 4. Identifying a dev note — two conditions at once

The dev-note component is named **`Dev Note`** (`../bnnam-standards/references/naming.md`). When scanning, a dev note is a node
that is **both** an instance of `Dev Note` **and** outside any screen frame. Never count by the name `Note` — a real UI card can also be
called `Note`.

## 5. Note content — where it comes from

| Content | Source |
|---|---|
| Behaviour: when disabled, which state leads where | `flows.md` — entry condition, exits, leads to |
| Technical assumptions the developer has verified | `flows.md` — technical assumptions table |
| Why it deviates from the PRD | the design decision log |
| Edge cases: *"user doesn't add a photo"* | the state suffix in the screen name · `flows.md` |
| Behaviour when the user denies a permission | `flows.md` · decision log (the permission screen itself is not built by default) |
| Touch area: a visible button smaller than 44 pt / 48 dp → the developer enlarges the **hit area** in code, the visual stays | applies to every screen — the team decided touch area is the developer's job and the design isn't checked for it |

Write in the **dev-note language** declared in `voice.md`. A note that needs information not in `design/` reveals a **gap in an earlier
stage** — report it back, never fill it in yourself. Read each screen with the six questions
(`../mobile-ui-master/references/reading-screens.md`): question 4 (where it leads) and question 6 (what is unclear) are usually the
note content.

## 6. Adaptive projects (iOS 27 · iPhone Duo · iPad)

When the project is adaptive, don't hand off artboards alone — attach a **behaviour spec** per screen (what stays at every size ·
reveal / collapse / reflow / overflow · state kept across resize · reaction to fold, camera, side bar · item priority · keyboard, PiP,
sheet, multitasking) and the **Device Hub test matrix**. Never hard-code model, orientation or screen bounds. Include the **layout
decision table**, which tokens may / may not be handed off, and the events to log during QA. Details: `../iphone-duo-adaptive/SKILL.md`.

## 7. Backgrounds

`Background/*` is a visual region — **the developer exports it as an image**. No dev notes about how the background is built.
Exception: **Live Activity and widget** backgrounds are a single colour the developer **builds in code**, not an exported image
(`../apple-design-widget/SKILL.md`). (Backgrounds: `../screen-background/SKILL.md`.)

## 8. Stop points, self-check, report

- **Stop:** choose the mode — default **ask first** (§2).
- **Self-check:** notes sit outside frames (§3) · dev notes identified by both conditions (§4) · only information already in `design/`
  is carried (§5).
- **Report:** screens with notes · number of notes · missing information to report back.

```text
Next steps
  → "where are we"                 see overall progress
  → add <missing item> to flows.md
```

---

# B. What a handoff specifies

A screen isn't complete with only a happy-state mockup. A handoff needs:

## 9. State matrix

| Group | States to describe |
|---|---|
| Data | initial, loading, loaded, empty, partial, stale, error, offline |
| Input | empty, filled, focus, validation error, disabled, read-only |
| Action | enabled, pressed, loading, success, failure, cooldown |
| Selection | unselected, selected, multi-selected, indeterminate |
| Permission | not determined, allowed, limited, denied, restricted |
| Account | signed out, signing in, signed in, expired, locked |

## 10. Behaviour spec
- Entry/exit transitions.
- Scroll, sticky, collapse and keyboard avoidance.
- Back behaviour and state restoration.
- Tap, long press, swipe, drag, hover, focus, keyboard shortcuts.
- Haptics/sound.
- Error recovery and retry.
- Analytics events with a purpose and a privacy review.

## 11. Responsive spec
- Layout at each breakpoint/size class.
- Min/max width of panes and content.
- Rules for reveal/divide/resize/reposition/swap.
- Hinge, safe area, system bars and keyboard inset.
- Large Dynamic Type/font scale.
- Portrait, landscape, multi-window and desktop mode.

## 12. Content spec
- Real strings; no lorem ipsum in the final review.
- Min/max length, truncation/wrap.
- Plurals, date/time/number/currency.
- Empty/error/offline/permission text.
- Localization notes and RTL.

(Per-string handoff fields: `../ux-writing/references/handbook-process.md` §2 step 6.)

---

# C. Implementation limits (dev awareness)

## 13. What developers constrain
- **Slow/complex APIs** → design loading states and skeleton screens so the experience isn't interrupted.
- **Responsive** — components change with the screen size.
- **iOS/Android/web differences** → design components that can be built on every platform, not redrawn for each.
- **Frameworks have limits** (complex animation is costly) → design within what can be built.
- **Performance** — optimised images (SVG, WebP, lazy load); animation must not slow things down.
- **WCAG accessibility** — semantic structure for screen readers.
- **Clear design-to-code documentation**; an interactive prototype helps developers understand behaviour.
- **Data-driven design** — A/B tests, analytics.

For iOS 27 / iPhone Duo, developers also need these concepts to spec correctly (details in `../iphone-duo-adaptive/SKILL.md`):
geometry per scene instead of the main screen; layout by size/trait, not idiom/orientation · the reserved-region API is dynamic data ·
`NavigationSplitView` / `UISplitViewController` · `ArrangementView` / `UIArrangementViewController` · toolbar groups, visibility
priority, axis behaviour · camera direction per view/display · three compatibility levels by SDK 26 / 27 / 27.1.

---

# D. System integration and advanced situations

## 14. System bars and edge-to-edge
**iOS**
- Background/media may go edge-to-edge, but content/controls respect the safe area.
- The status bar style must contrast with the background in every scroll state.
- The home indicator is never covered by a fixed CTA.

**Android**
- Design edge-to-edge with status/navigation bar insets.
- Gesture navigation has edge zones; avoid conflicting horizontal gestures.
- Handle the IME inset for composers/forms; don't just resize the whole layout and make it jump.

## 15. Back behaviour
- **iOS** — back within the navigation stack; keep swipe-back whenever possible. Close/Cancel is for modal tasks.
- **Android** — system Back/gesture returns to the previous state, closing the keyboard/drawer/sheet before the destination when that
  matches the hierarchy. Predictive Back needs a transition preview that matches the destination.

Don't use Back to open a confirmation unless there is unsaved data or a real consequence.

## 16. Keyboard and IME
- The focused field is always visible.
- The keyboard submit action reflects Next/Search/Send/Done.
- Hardware keyboards have focus order and shortcuts.
- Shortcuts show in menus/tooltips where appropriate.
- Don't dismiss the keyboard after every small validation.
- A chat composer and bottom bar move with the IME animation smoothly.

## 17. Clipboard, autofill and passkeys
- Never block paste into password/OTP fields.
- Set the right content type/autofill hint so the system recognises fields.
- Don't read the clipboard silently (warnings/privacy concerns).
- A passkey flow needs a fallback and explains which account is used.
- After OTP autofill it may submit if safe, but allow editing when the code was wrong.

## 18. Permission state machine
Design every state:
1. Not asked yet.
2. In-context pre-prompt.
3. System prompt.
4. Granted full.
5. Granted limited/approximate/selected items.
6. Denied.
7. Restricted/policy controlled.
8. Revoked after some time.

The UI must work with limited access; never treat every permission as binary.

## 19. Lifecycle and state restoration
- The app can be backgrounded/killed at any moment.
- Save drafts, navigation context and the selection needed.
- When data expires, refresh without resetting the task.
- If security requires hiding content in the app switcher, use a privacy overlay without losing state.
- A deep link on cold start and warm start gives the same logical result.

## 20. Offline-first
State model:
- Fresh local data.
- Stale local data being refreshed.
- Offline with cache.
- Offline without cache.
- Pending mutation.
- Sync conflict.
- Permanent failure.

Show "last updated", pending mutations and how to retry. Don't show success before the server confirms if the action can't be safely
reconciled.

## 21. Optimistic UI
Fits when:
- The action is easily reversible.
- Success is highly likely.
- Failure can be clearly recovered.

Doesn't fit:
- Payments/money transfers.
- Permanent deletion.
- Access rights or legal data.
- Actions with non-idempotent side effects.

## 22. Background work
- Long tasks let users leave the screen.
- Show status where users come back to look for it.
- Notify only when the result is noteworthy and expected.
- Offer cancel/pause if it costs battery or data or has consequences.
- Distinguish queued, running, paused, completed, failed.

## 23. Advanced notifications
- Group by conversation/category.
- Summaries don't hide important information.
- Actions work without opening the app if they promise to.
- Badge counts are based on items needing attention, never as a pressure mechanism.
- Respect quiet hours/focus modes and system settings.
- Marketing notifications need opt-in that meets regulations.

## 24. Widgets and live surfaces
- A widget is a glanceable window, not a shrunken app screen.
- Each size keeps the same purpose and adds detail.
- Android and iOS widgets both need responsive layouts and limited interaction.
- Real-time events use Live Activities/ongoing notifications as the platform suits.
- Tap/deep link opens the right object; signed-out/permission states have alternative content.

## 25. Foldables and posture
- Book posture: two panes, list-detail/supporting.
- Tabletop posture: content on top, controls below if it suits the task.
- Never assume the hinge is always centred or the halves equal.
- Continuity on fold/unfold matters more than showy animation.
- Test camera, media and keyboard in each posture.

## 26. Large screens and desktop input
- Add panes/inspectors/toolbars, don't just scale up.
- Cap the max width of forms and text.
- Hover, right-click/context menu, keyboard, resize and multi-window must work.
- Focus ring and selection differ from hover.
- Drag-and-drop between windows/apps where the platform supports it.

## 27. Performance budgets
The design sets budgets for:
- Time to first meaningful content.
- Input latency.
- Scroll frame stability.
- Animation frame time.
- Image memory/cache.
- Network payload for the first screen.

Avoid excessive blur/shadow/overdraw, lists without virtualisation and oversized images. Perceived performance improves with stable
skeletons, cached content and instant action feedback.

## 28. Security-sensitive UX
- Don't show secrets in full by default.
- Copying a secret needs feedback, and clipboard auto-clear if policy allows — but tell the user.
- The biometric prompt appears after the user understands the action.
- Re-authentication keeps the context and doesn't clear the form.
- Phishing resistance: show the domain/merchant/account clearly in confirmations.
- Audit logs use user language, with clear timestamps/time zones.

## 29. AI interaction
States to design:
- Ready.
- Generating/streaming.
- Partial result.
- Completed.
- Stopped/cancelled.
- Safety refusal.
- Tool/action pending confirmation.
- Tool/action running.
- Failed/retry.

Principles:
- Show sources/citations when available.
- Allow stopping generation and editing the prompt.
- Never perform consequential external actions without confirmation.
- Distinguish model suggestions from verified data.
- Allow report and regenerate, and preserve the previous answer on retry.
- High-risk content needs a disclaimer and a path to an expert, but a disclaimer never replaces safety design.

## 30. iOS 27 / iPhone Duo pointers
Covered in `../iphone-duo-adaptive/SKILL.md`: outer/inner camera region and the side bar shared with the Dynamic Island · multiple
scenes, several instances of the same app, scene accessories · PiP, keyboard and Split View overlapping · Device Hub test matrix,
10 continuity scenarios and reproducible bug reports · camera UX, Camera Control by pose and the camera lifecycle · privacy across
several displays and system surfaces.
