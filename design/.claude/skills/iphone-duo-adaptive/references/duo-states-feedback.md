# Loading, empty, error and recovery states; visual, audio and haptic feedback

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §28, §34 @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). An adaptive app is incomplete if it only has the "loaded" state: when the pose or scene changes in the middle of an asynchronous task, the system state **continues** instead of the screen being rebuilt. Sources: [Loading](../apple-hig/references/loading.md), [Progress indicators](../apple-hig/references/progress-indicators.md), [Alerts](../apple-hig/references/alerts.md), [Feedback](../apple-hig/references/feedback.md), [Playing haptics](../apple-hig/references/playing-haptics.md), [Playing audio](../apple-hig/references/playing-audio.md) (verbatim HIG). Camera-specific states: [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md) §3, §8–16. Copy for these states: `../ux-writing/SKILL.md`.

## Contents
1. Minimum state model
2. Indicators and progress
3. Empty state is not an error state
4. Error placement and level of interruption
5. Continuity and source of truth
6. Recovery contract
7. Feedback matrix
8. Haptic rules
9. Audio rules
10. Preventing duplicate feedback

---

## 1. Minimum state model `[T]`

| State | What the UI shows | When the pose / display changes |
|---|---|---|
| Initial | a sensible skeleton or base content almost instantly | no white flash when switching surface |
| Loading | what is loading and which tasks are still usable | the indicator stays with the content owner, never jumps between panes |
| Partial content | available data + the part still loading | keep scroll / selection; update locally |
| Empty | why it is empty, a fitting call to action, "nothing yet" vs "filter found nothing" | the call to action stays in the same semantic region as the content |
| Stale / offline | cached data + status mark + last-updated time | never wipe content just because the network dropped during a fold |
| Permission blocked | locked capability + path to Settings or an alternative | keep the intent so the task continues after permission is granted |
| Recoverable error | specific description + Retry / alternative | an error belonging to a pane sits next to that pane |
| Fatal / conflict | effect on the whole task + safe way out | modal / alert only when it truly must block |
| Saving / processing | progress, whether the user may leave, Cancel/Pause when safe | the operation never restarts because of a layout reflow |
| Success | result or confirmation long enough, with a next step | no duplicate toast on two displays |

## 2. Indicators and progress `[A]`

- Show content or a placeholder as early as possible; a blank screen makes the app look broken.
- Use determinate progress when progress is known; indeterminate only when it cannot be estimated.
- Never race to 90 % and then sit there for a long time if the numbers do not reflect reality.
- Keep the indicator in a stable place, next to the object being processed.
- When switching from unknown to known progress, the state may change, but not with a jarring change of form or a layout jump.
- Offer Cancel / Pause when possible; if Cancel discards processed data, say so before doing it.
- Background loading never locks the whole app; block only the area that truly depends on the operation.

## 3. Empty state is not an error state `[T]`

Distinguish at least:
1. no data created yet;
2. search / filter found nothing;
3. data not synced yet;
4. no permission to view;
5. content deleted or no longer available.

Each has its own copy and call to action — "No data" is not enough. On the inner display, an empty detail pane may guide the user to pick an item from the list; when collapsing to the outer display, do not keep an empty screen if navigation can return the user to the list.

## 4. Error placement and level of interruption `[A]` / `[T]`

- Local error: inline, next to the field / item / pane.
- Background or connection error: non-blocking status / banner; let the user see the cache and Retry.
- Error affecting the current operation: in context, with the action that resolves it.
- Risk of irreversible data loss: confirmation alert.
- Never use an alert just to inform, or for a common error that can be undone / retried in place.
- The title names the problem, the body the consequence, actions use concrete verbs. Avoid "Error" or a technical code as the main content.

## 5. Continuity and source of truth `[T]`

```text
User intent
   -> operation / state owner
       -> representation on the outer display
       -> representation on the inner display / pane
       -> accessory / secondary display
       -> system surface / Live Activity, if any
```

Every representation reads the same operation ID and state. Fold / resize only changes presentation: it never creates a new request, never duplicates an upload / capture / payment, and never resets the retry count. Independent scenes may keep their own selection, but a shared operation has a clear owner and conflict handling.

## 6. Recovery contract `[T]`

The handoff for every long operation states:
- which state is persisted;
- whether the operation continues in the background;
- what the user sees on return after the app was terminated;
- whether retry is idempotent;
- which data is already safely saved;
- whether Cancel / Undo has a time limit or consequences;
- which display or scene is the owner;
- which notification or status reports completion.

## 7. Feedback matrix `[T]`

| Event | Visual | Haptic | Audio | Accessibility |
|---|---|---|---|---|
| Button accepted | press / state change | light selection / impact if useful | usually none | trait / state updated |
| Capture photo | shutter / thumbnail | suitable discrete impact | system shutter as regulated | announcement when needed; avoid constant talk-over |
| Start / stop recording | red state + elapsed + icon / text | distinct pattern | tone if the context allows | start / stop announcement |
| Save / upload complete | inline status / result | success for important tasks | depends on context | focus / announcement without yanking out of the task |
| Recoverable error | inline / banner + Retry | measured warning / error | not required | read the problem and the action |
| Destructive, irreversible | alert + explicit action | warning if fitting | none by default | focus on the alert, consequence clear |
| Remote action | indicator on the relevant display | feedback on the device, if any | important when the user is not looking at the screen | visual equivalent for deaf / hard-of-hearing users |

## 8. Haptic rules `[A]`

- Use system patterns for their exact meaning; never a success haptic for a warning.
- Keep a clear cause → effect link between input, UI change and vibration.
- Haptics complement visual / audio, never replace them.
- Do not fire on every scroll tick or on high-frequency actions — it is tiring.
- Allow turning custom haptics off; the app still works without haptics.
- Haptics can affect the camera, gyroscope or microphone; for capture / tabletop, keep them short and light and test on a real device.

## 9. Audio rules `[A]`

- Respect Silent mode and audio-session conventions; never play unexpected sound.
- Never change the system volume or repurpose audio controls.
- When the headphone route changes, behaviour matches expectations; camera / calls show the mic / audio-route state clearly.
- Sound is never the only signal; there is a visual / haptic / VoiceOver path.
- Use distinct start and stop recording sounds, so one tone never leaves the user unsure of the final state.

## 10. Preventing duplicate feedback `[T]`

One intent produces **one feedback transaction**. If the system already plays the shutter sound or haptic for a standard component, the custom layer does not play it again. With two displays there may be two visual representations, but never double sound / announcements. The handoff names the feedback owner, the display that gets the visual, and the conditions that suppress it. Input deduplication: [duo-ergonomics-motion-input.md](duo-ergonomics-motion-input.md) §3.5.
