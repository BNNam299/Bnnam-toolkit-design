# States, feedback, motion and haptics

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/motion.md (§10) @ 3c0e291 — translated, complete. §5–7 are a quick reference compiled from the verbatim HIG / M3 pages in this repo (cited per line), because the toolkit note covers motion only.

## Contents
1. Motion must have a job
2. iOS motion and haptics
3. Material 3 motion physics
4. Performance
5. Quick reference — component and screen states
6. Quick reference — feedback channels
7. Quick reference — durations and haptic rules
8. iOS 27 / iPhone Duo additions (pointers)

---

## 1. Motion must have a job

Motion should do at least one of these:
- Explain the source–destination relationship.
- Keep continuity when state/layout changes.
- Show that an action has been received.
- Direct attention.
- Express progress or a change in hierarchy.
- Create emotion that fits the brand.

If an animation only slows the task down or repeats in a distracting way, remove it.

## 2. iOS motion and haptics

- Prefer natural motion that responds directly to the gesture and **can be interrupted/reversed**.
- Use system transitions where appropriate to keep familiarity.
- Haptics are synchronised with meaningful moments: **selection, impact, success/warning/error**.
- **No haptic for every tap.**
- Respect **Reduce Motion**: replace large motion with a dissolve, highlight or gentle transition **while keeping the information**.

Platform: `../apple-hig/references/motion.md`, `../apple-hig/references/playing-haptics.md`.

## 3. Material 3 motion physics

M3 Expressive moves the focus from fixed duration/easing to **spring physics**:
- Two schemes: **expressive** and **standard**.
- Expressive has overshoot/bounce — suits hero moments and prominent interactions.
- Standard is functional, little bounce.
- A spring has stiffness, damping and initial velocity.
- Two token groups: **spatial** for position, size, rotation, corner; **effects** for opacity, color and properties that must not overshoot.
- Each group has fast / default / slow; small elements are usually faster, large elements may be slower.

Keep one motion scheme across the product. Override only at moments with a clear reason.

Platform: `../material-design-3/references/styles__motion__overview.md`, `styles__motion__easing-and-duration.md`, `styles__motion__transitions.md`.

## 4. Performance

- Prefer transform/opacity over heavy layout animation.
- Avoid animating too many elements at once.
- Do not block input during an unnecessary animation.
- Test on low-end devices and battery-saver mode.
- An animation must land on an exact final state if interrupted.

---

## 5. Quick reference — component and screen states

### 5.1 Component states (draw each one that applies)
| State | Note | Source |
|---|---|---|
| Enabled (default) | Default styling of the component | M3 `foundations__interaction__states.md` |
| Pressed | M3 state layer **+10%** opacity; iOS: highlight/dim | same |
| Focused | M3 **+10%**; visible, unclipped focus indicator (keyboard, Switch Control) | same; `accessibility.md` §1.6 |
| Hover (pointer, iPad/web) | M3 **+8%**; never the only way to reveal info | same |
| Dragged | M3 **+16%** | same |
| Selected / activated | Distinguish by more than color | `interaction-patterns.md` §1 |
| Disabled | M3 content opacity **0.38**; disabled states don't need to meet contrast requirements, but must be clearly distinct from enabled and the reason must be discoverable | M3 states + `tokens__components__buttons.md`; HIG `gestures.md` ("indicate when a gesture isn't available") |
| Loading (in-component) | Button shows progress and blocks double submit | `interaction-patterns.md` §3.3, §3.5 |
| Error / invalid | Text message + icon, not color alone; linked to the field | `accessibility.md` §1.8 |

### 5.2 Screen states (from `interaction-patterns.md` §2.3, §3.12–3.13, §4.6)
Initial load (skeleton/progress) · refresh (keep old content) · pagination · background sync · six empty kinds (first use, user-cleared,
no search results, filtered, permission-blocked, offline/no cache) · inline / full-page / blocking error · offline (what works, what queues,
when it syncs) · slow network / timeout + retry (keep input) · partial failure / stale data · permission denied/restricted · session expired
(keep drafts) · success (return to context) · undo · destructive confirmation · plus long content, largest text size and dark mode for each
screen (`../figma-ui-flow/SKILL.md` rule 7).

Skeleton loaders hint where content will appear and stabilise layout while loading (M3 `styles__motion__transitions.md`). HIG: show
something as soon as possible; determinate progress when the duration is known, indeterminate when not (`../apple-hig/references/loading.md`).

## 6. Quick reference — feedback channels

Match the interruption to the significance (HIG `feedback.md`): passive status for status, interruption only for possible data loss.

| Channel | Use for | Key numbers / rules | Source |
|---|---|---|---|
| Inline status (badge, label, row state) | Ongoing status near the item it describes | — | HIG `feedback.md` |
| Snackbar / toast | Low-priority result of an action, Undo | One at a time; mobile label ≤ 2 lines; ≤ 1 action (Dismiss optional); height 48→64dp on compact; no-action snackbar auto-dismisses after **4–10 s**; with an action it stays until acted on/dismissed; sits **above** the FAB, never over navigation; never the only way to reach a core use case; repeat the information inline for accessibility | M3 `components__snackbar.md` |
| Banner / inline error block | Persistent problem on the page (offline, sync failed) | Do not use an alert at app start for "no network" — show cached data + a non-intrusive label | HIG `alerts.md` |
| Dialog / alert | Critical info or a required decision | HIG: title + optional text + up to 3 buttons, title ≤ 2 lines, specific verbs not "OK/Yes/No", Cancel never default; M3: max 2 actions (1 = acknowledgement only), confirm closest to the trailing edge | HIG `alerts.md`; M3 `components__dialogs.md` |
| Haptic | Reinforce a meaningful discrete event | Complement, never sole channel; optional; not for every tap | HIG `playing-haptics.md` |
| Sound | Reinforce; never sole channel | Device may be muted | HIG `feedback.md`; `accessibility.md` §1.7 |

Confirm success only for significant actions (payments); people only need to know when something fails. Show when a command cannot be
carried out and why (HIG `feedback.md`).

## 7. Quick reference — durations and haptic rules

**M3 easing & duration (legacy system, still used for transitions)** — `../material-design-3/references/styles__motion__easing-and-duration.md`

| Easing | Duration | Use |
|---|---|---|
| Emphasized | 500 ms | Begin and end on screen |
| Emphasized decelerate | 400 ms | Enter the screen |
| Emphasized accelerate | 200 ms | Exit the screen |
| Standard | 300 ms | Begin and end on screen |
| Standard decelerate | 250 ms | Enter |
| Standard accelerate | 200 ms | Exit |

Duration tokens: short1–4 = 50/100/150/200 ms; medium1–4 = 250/300/350/400 ms. Small area (e.g. selection controls) ≈ 200 ms; large
area ≈ 500 ms; exit shorter than enter. The Standard set is the fallback for iOS and web.

**Haptics (HIG `playing-haptics.md`)** — use system patterns for their documented meanings; keep a consistent cause→effect mapping; match
haptic intensity/sharpness to the animation; prefer short haptics for discrete events; let people turn haptics off; do not disturb camera,
gyroscope or microphone use.

**Flashing:** nothing flashes more than 3 times per second (`../figma-ui-flow/references/handoff-qa.md`).

---

## 8. iOS 27 / iPhone Duo additions (pointers)

In the `iphone-duo-adaptive` skill (`../iphone-duo-adaptive/SKILL.md`):
- Motion and transitions when the posture changes, opening / folding.
- Visual, audio and haptic feedback (feedback matrix, haptic rules, avoiding duplicate feedback).
