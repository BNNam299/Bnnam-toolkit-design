# Multiple displays, scenes and multitasking on iPhone Duo

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §11.1–11.4 (fig. 11), §20.2, §23.4 (00:49–07:04) @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). Hinge angle as data (not a breakpoint) is in [duo-device-postures.md](duo-device-postures.md) §7; the camera-specific accessory is in [duo-camera-layout-controls.md](duo-camera-layout-controls.md) §9; what each surface may show (privacy) is in [duo-privacy-onboarding.md](duo-privacy-onboarding.md) §1–6.

## Contents
1. Four concepts — never merge them into "dual screen mode"
2. Hinge data is for interaction and effects
3. Side-by-side multitasking (Split View, video-stacked)
4. Several instances (scenes) of the same app
5. Scene accessory
6. Camera Capture Accessory and teleprompter (video example)
7. Wrap-up checklist from the video

---

## 1. Four concepts `[A]`

Apple illustration (fig. 11, *Leverage multiple displays and scenes on iPhone Duo*, tech talk 111464): one app coordinating UI between the inner and the outer display.

| Concept | Meaning |
|---|---|
| **Display** | the physical surface — outer or inner |
| **Scene / window** | one UI instance with its own state and lifecycle |
| **Split View** | two apps sharing the inner display |
| **Scene accessory** | secondary UI an app shows on the *other* display, in a context the system allows |

Do not merge them into one "dual screen mode" `[C]`: each has different state logic and different user expectations.

## 2. Hinge data is for interaction and effects `[A]` (video 00:49–02:34)

Hinge state and angle (`onHingeChange`, `UIHingeInteraction`, the guitar pitch-bend example, fallback when there is no hinge) are covered in [duo-device-postures.md](duo-device-postures.md) §7. In short: use them for interaction and effects; **layout** uses arrangement and reserved-region APIs ([duo-layout-transformation.md](duo-layout-transformation.md) §10–11), never an angle breakpoint.

## 3. Side-by-side multitasking `[A]` (video 02:59–03:37, design guidance)

- Every app takes part in multitasking on Duo; two apps can sit side by side. Duo also has a layout that stacks a video above an app; for the app, side-by-side and video-stacked are handled by the same resize foundation.
- Size class and scene geometry are the layout inputs. An app that already resizes well on iPad / iPhone Mirroring is largely ready.

Design for more than the prettiest 50/50 split `[C]`:
- the bar can be on the left **or** the right edge;
- width and height can change during the session;
- keyboard, PiP and Live Activity keep taking space;
- drag & drop and copy/paste keep their meaning;
- the task does not reset when the user drags the divider.

## 4. Several instances of the same app `[A]` (video 03:38–04:21)

- iPhone Duo is the first iPhone that supports several UI instances of one app. Apps that already support multiple scenes on iPad get the behaviour on Duo.
- A new window/scene can be created on the **inner** display; the **outer** display does not allow creating one.
- Availability changes dynamically; a request to create a scene must handle failure.
- `UIWindowSceneActivationAction` hides itself when a new window is unavailable — better UX than a call to action that is always visible but often fails.

UX opportunities `[C]`: compare two documents · drag / refer between two pieces of content · keep a dashboard and a detail apart · write in one window while reading the source in another.

Design requirements `[C]`:
- every scene keeps its own navigation, selection, scroll, draft and undo state;
- title / window identity is clear enough to tell scenes apart;
- a deep link opens the right scene or deliberately creates a new one;
- the same data changed in two scenes needs a refresh / conflict strategy;
- "Open in new window" is shown or enabled only when the system allows it; on failure there is a fallback, never an empty state.

## 5. Scene accessory `[A]` (video 04:22–04:59)

- A scene accessory shows secondary UI next to the main UI on another display — on iPhone/iPad as well as on an external display (wider example: an iPhone as the controller of a game shown on an external display).
- The system decides availability; the accessory is enabled by default, but the user or the system can toggle it at any time.
- The app must observe availability so that the main UI, the toggle and the accessory state stay in sync.

Principles `[C]`:
- it is **supplementary UI, not a mandatory second main screen**;
- its content stays in sync with the main scene;
- never put a vital function only on the accessory;
- it has loading / connecting / unavailable / ended states;
- the control that turns it on is disabled, or hidden with an explanation, when unavailable;
- when the device closes or the condition is lost, the primary task continues safely.

Camera example: main camera UI on the inner display; the outer display shows a preview, a teleprompter or guidance for the person being filmed; the accessory is available only under conditions such as the app being full screen with an active camera session.

## 6. Camera Capture Accessory and teleprompter `[A]` (video 05:00–06:43)

- Camera Capture Accessory puts secondary UI on the outer display while the main camera UI is on the inner display.
- Available **only** when the app is full screen on the inner display and has an active camera session.
- Register the accessory on the same view as the camera UI so its lifecycle follows that context; when the camera view is not shown, the accessory should not live on its own.
- Teleprompter example: text for the person being filmed on the outer display; a toolbar button in the main UI turns it on/off. The button is **disabled when the accessory is unavailable** (for example when the device is closed); an availability callback updates it.
- Consequence `[C]`: a multi-display feature is an enhancement with clear states, never the only way to finish the camera task. Layout and content rules for the outer side: [duo-camera-layout-controls.md](duo-camera-layout-controls.md) §9.

## 7. Wrap-up checklist from the video `[A]` (06:44–07:04)

- Support Split View and resizing first.
- Use the Hinge API only for meaningful interaction / effects.
- Use a scene accessory only when the two displays play genuinely complementary roles.
- Test the accessory appearing, disappearing, being turned off, and the main scene changing midway.

---
