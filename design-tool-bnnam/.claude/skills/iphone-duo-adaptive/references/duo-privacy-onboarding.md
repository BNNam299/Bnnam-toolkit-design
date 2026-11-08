# Privacy across displays and system surfaces; onboarding and discoverability of Duo features

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §32, §33 @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). Sources: Privacy — HIG, *Preparing your UI to run in the background* (UIKit), Onboarding — HIG, *Discoverable design* (WWDC21) — links in [duo-apple-sources.md](duo-apple-sources.md). Verbatim Apple pages: [privacy](../apple-hig/references/privacy.md), [onboarding](../apple-hig/references/onboarding.md).

## Contents
1. Privacy: map of display surfaces
2. Classify content before routing it to a display
3. Permission UX
4. Background and app-switcher snapshot
5. Recording, sharing and notifications
6. Privacy acceptance criteria
7. Onboarding: do not teach the whole device on first launch
8. Context triggers for tips
9. Progressive disclosure
10. Accessibility and state of tips
11. Measuring discoverability

---

## 1. Privacy: map of display surfaces `[T]` (built on Privacy — HIG and *Preparing your UI to run in the background*)

| Surface | Who can see it | Risk |
|---|---|---|
| Inner display | the owner and people nearby | personal data, editor state, operator notes |
| Outer display | people facing / around the device | preview, messages, location, private teleprompter |
| Scene accessory | other people in the room | content duplicated outside the user's intent |
| App-switcher snapshot | anyone who opens the app switcher | passwords, finance, records, last camera frame |
| Screen recording / sharing | recipients of the recording or call | notifications, overlays, data in the secondary pane |
| Lock Screen / locked camera | whoever holds the device before authentication | old media, account data, network content |

Treat everything on the outer display as **public by proximity**.

## 2. Classify content before routing it to a display `[T]`

Give every piece of data a display policy:
- **public** — may appear on the outer display / accessory;
- **shared-by-intent** — appears only after a clear user action;
- **private** — inner / operator surface only;
- **authentication-required** — hidden or redacted until unlock;
- **never-captured** — covered in the app-switcher snapshot or screen sharing, as the product's capability allows.

A "clean preview" is **not** automatically safe: it can contain faces, documents, location or notification overlays. The inner UI must show what the outer display / accessory is showing and offer a quick way to turn it off.

## 3. Permission UX `[A]` / `[T]`

- Ask when the user starts the feature that needs the permission — unless the capability is the obvious condition for the app to work at all.
- The purpose string says concretely what the data / capability is used for.
- Use a pre-permission view only when context is missing; it has **one** call to action that opens the system prompt — no fake buttons that loop.
- Denied / revoked has a recovery state and an alternative; never loop the prompt.
- Keep the intent: after the user grants permission in Settings or authenticates, return to the same task if it is still valid.

Camera / microphone specifics: [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md) §1.

## 4. Background and app-switcher snapshot `[A]` / `[T]`

UIKit captures the UI when the app goes to the background, for the app switcher. Before that snapshot:
- cover / redact passwords, payments, health data, private messages or sensitive camera frames;
- a neutral cover or blurred summary that reveals nothing is acceptable;
- do not destroy the real state underneath;
- on return to the foreground, remove the cover only after authorisation / state are appropriate;
- test each scene — every window can hold different data.

## 5. Recording, sharing and notifications `[T]`

- If the app has screen sharing / recording, define which pane is shared and show clearly that sharing is on.
- Notifications / banners can appear on the outward-facing display; never put a full secret in a custom overlay.
- For livestream / calls, separate "camera is recording", "broadcasting out" and "screen is being shared" — three states with different labels / indicators.
- Never draw over or hide the system privacy indicator.

## 6. Privacy acceptance criteria `[T]`

- [ ] There is a data inventory for inner, outer, accessory, Lock Screen, app switcher and recording.
- [ ] Outer display / accessory show no private data by default.
- [ ] The user knows which display is active and has a quick way to turn it off.
- [ ] The background snapshot contains no sensitive data.
- [ ] Permission denied / revoked / authentication have a recovery flow.
- [ ] Recording / sharing state is not shown by colour or a vague icon alone.

---

## 7. Onboarding: do not teach the whole device on first launch `[A]` / `[T]`

Onboarding is fast, skippable and happens after launch. The app does not need to explain "how iPhone Duo folds"; it only shows the app's own benefit when the right context appears. A long carousel about book / tabletop before the user has seen the feature is hard to remember and slows the first task.

## 8. Context triggers for tips `[T]`

| First-time context | Suitable tip |
|---|---|
| Opening the inner display with list–detail | highlight the new pane and the selection–detail relationship |
| Putting the device in tabletop for media / camera | tip next to the controls: preview on top, controls below |
| Turning on the outer display / accessory | preview confirming what will appear outside + a short privacy note |
| Using Camera Control | short tip on light press / double light press, if the app needs custom controls |
| Creating a second scene | explain that scenes are independent and how to get back — not repeated every time |

A tip appears only when the action can be tried right away, is anchored next to the related area, never covers the subject / a control, and never repeats endlessly. If the user skips it, the feature still has its normal affordance and help can find it again.

## 9. Progressive disclosure `[T]`

- First time: value proposition and primary action.
- When a capability appears: one contextual tip.
- When the user opens an advanced control: detailed explanation in place.
- Help / settings: full documentation and a way to reset the tutorial.

Never ask for a batch of permissions during onboarding — a permission appears only once its value and reason are clear. Never use onboarding to cover for an unclear icon; fix the label, hierarchy or affordance first.

## 10. Accessibility and state of tips `[T]`

- A tip is focusable, readable by VoiceOver and has a clear close button.
- It does not disappear by itself while assistive technology is reading it.
- Dynamic Type must not make the tip cover the target it explains.
- Tip state syncs sensibly across scenes, but one scene must not suddenly close a tutorial in use in another.
- Reduce Motion uses fade / highlight instead of a long flying pointer.

## 11. Measuring discoverability `[T]`

Track at product level: share of users who reach the context, see the tip, try the action, complete the task, and reuse it without the tip. Do not draw conclusions from single click counts. If many people only complete the task while the tip is always visible, the underlying pattern is not self-explanatory enough.
