# Camera UX lifecycle on iPhone Duo: permission, privacy, interruptions, preview–output contract, capture → review, tests

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §24.13–24.20, §25.1, §35 @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). Layout per posture, control layers, Camera Control and physical buttons: [duo-camera-layout-controls.md](duo-camera-layout-controls.md). Product capabilities that need their own research (multi-camera, cinematic / depth / RAW, scan / OCR, AR, livestream, calls, regulated capture): [duo-foundations.md](duo-foundations.md) §8. Sources: AVCam, *Tracking photo capture progress*, *Saving captured photos*, [Camera Control](../apple-hig/references/camera-control.md), [Privacy](../apple-hig/references/privacy.md) — links in [duo-apple-sources.md](duo-apple-sources.md).

What a complete camera spec must cover (the gaps the source closed) `[T]`: layout per posture · horizontal vs vertical fold · hardware Camera Control and its overlay · physical buttons / AirPods · camera-specific permission / privacy · interruption state model · preview–output contract · accessibility of capture controls · one source of truth between hardware and UI · a test matrix that does not rely on the simulator.

## Contents
1. Permission, privacy and outer-display exposure
2. Locked camera capture
3. Interruption, multitasking and system pressure — state model
4. Preview, output and composition contract
5. Accessibility of camera controls
6. Component contract for camera UI
7. Camera test matrix and critical scenarios
8. Lifecycle state machine
9. Preparing and ready
10. Focus, exposure and composition
11. Photo capture by its real milestones
12. Video recording
13. Processing, saving and storage
14. Review, retake and undo
15. Camera Control micro-spec
16. Camera lifecycle per posture
17. Camera acceptance criteria

---

## 1. Permission, privacy and outer-display exposure `[A]` / `[T]`

Camera and microphone are protected capabilities:
- ask at the moment the user starts the feature that needs camera / mic — never early without reason;
- the purpose string says concretely what the app uses camera / mic for;
- if a pre-permission screen is needed, it has **one** clear call to action that opens the system prompt — no dark pattern with two fake buttons;
- denied / limited / revoked need recovery UI; never loop the prompt;
- when only existing photos are needed, use the Photos picker instead of asking for the whole library.

Duo specifics:
- the outer display may face other people — treat everything on it as **public by proximity**;
- a clean preview can still reveal people, documents, location or chat overlays;
- the teleprompter must not show private notes or operator metadata;
- when the outer accessory is on, the inner UI shows clearly what the outside is displaying;
- recording / camera / microphone state is clear on the relevant display and never covers the system privacy indicator.

General surface policy: [duo-privacy-onboarding.md](duo-privacy-onboarding.md) §1–6.

## 2. Locked camera capture `[A]`

LockedCameraCapture lets a camera experience open from the Lock Screen, Control Center, the Action button or Camera Control. It is **not** a shrunken full app UI.

Security limits that shape UX directly:
- the extension has no network access;
- it cannot read / write the App Group shared container;
- the extension's container is deleted when it is suspended;
- without camera permission, the system asks the user to authenticate / unlock, then opens the app to request permission;
- captured content can continue into the app after the user authenticates.

A locked-capture design:
- focuses on fast capture with little navigation;
- never promises upload / sync while the extension has no network;
- shows clearly that the capture is temporary and which unlock step continues it;
- preserves the small configuration needed via `appContext` — e.g. front / rear preference or purchased-filter eligibility;
- never shows the private library before authentication;
- has a way out via the system gesture and never assumes the extension lives long.

## 3. Interruption, multitasking and system pressure — state model `[A]` / `[T]`

A camera session can be interrupted by: the app going to the background · audio taken by a phone call / alarm / another client · the video device used by another capture session · multitasking when camera access is not supported / enabled · system pressure / thermal duress · the system's sensitive-content mitigation.

| State | What the UI must do |
|---|---|
| Preparing | preview skeleton / black surface with a status; shutter disabled until ready |
| Ready | live preview; controls per capability |
| Capturing photo | instant feedback; prevent double trigger; confirm save / failure |
| Recording / live | Record/Stop + elapsed + mic / network state always clear |
| Reconfiguring | keep the last frame / a deliberate transition; lock conflicting controls |
| Interrupted, recoverable | short explanation; keep the layout; resume automatically when sensible or offer Retry |
| Unavailable | give the reason and a way forward; never a silent black viewfinder |
| Thermal / system limited | reduce capability with a notice; never promise quality that cannot be kept |
| Permission denied | call to action opening Settings when needed; explain what is limited |
| Saving / processing | let the user leave if safe; progress / status and failure recovery |

In Duo Split View, never assume "two apps are in the foreground, so the camera surely works". The handoff states the camera-multitasking support and the fallback if the session is interrupted.

## 4. Preview, output and composition contract `[T]`

The designer specifies three different frames:
1. **Sensor frame** — what the camera can capture.
2. **Preview frame** — what the user sees in the UI.
3. **Output frame** — what is actually saved or streamed.

Acceptance criteria:
- the subject in the preview is not cropped unexpectedly in the output;
- overlay / grid / face box share the correct coordinate space after rotation / display move;
- mirrored preview does not mean mirrored file — decide the two separately;
- the selected aspect ratio survives a pose change while the output still supports it;
- if capability changes when switching virtual / physical camera, the app says so or locks invalid choices;
- the fold never becomes an "invisible" part where the user places the subject without seeing it well;
- preview and captured media are always upright, using a new rotation coordinator for the current camera.

## 5. Accessibility of camera controls `[A]` / `[T]`

- Shutter, Record/Stop, Flip, Lens and mode have name, role, state and value.
- Never signal recording by red alone; add shape / icon / text / time and a fitting VoiceOver announcement.
- Zoom / exposure sliders have an adjustable action and a readable value.
- A custom focus reticle or tap-to-focus has an alternative accessibility action.
- After fold / reflow, focus stays on the same control or its semantic equivalent — never jumps to the top of the view.
- Reduce Motion softens flip / zoom transitions but still announces that the camera changed.
- Increase Contrast / Reduce Transparency keep controls clear over a constantly changing preview.
- Remote capture needs audio / haptic confirmation; deaf users still need visual / haptic, blind users need sound / VoiceOver.
- Hardware input is never the only path; motor accessibility needs an on-screen, Switch Control or Voice Control path.

General rules: [duo-accessibility-localization.md](duo-accessibility-localization.md).

## 6. Component contract for camera UI `[T]`

Every control records:

| Property | Example |
|---|---|
| Semantic action | capturePhoto, startRecording, stopRecording, switchCamera |
| Priority | A always visible, B quick access, C overflow |
| Input paths | tap, Camera Control, volume, Action, AirPods, VoiceOver action |
| Pose placement | outer, inner, book, tabletop, dual display |
| Capability | which camera / mode supports it; enabled / disabled reason |
| State sync | source of truth for on-screen UI + hardware overlay |
| Feedback | visual, haptic, sound, announcement |
| Safe behaviour | avoids fold / camera / system overlay |
| Failure | unavailable, interrupted, permission denied, save failed |
| Continuity | what is kept / changed on open / close / display switch |

General component contract: [duo-handoff-testing.md](duo-handoff-testing.md) §6.

## 7. Camera test matrix and critical scenarios `[T]`

The simulator cannot fully test a camera: a real device is needed for the sensor, Camera Control, physical buttons, AirPods, rotation and thermal behaviour.

| Axis | Cases |
|---|---|
| Pose | closed, flat inner landscape, flat inner portrait, book, tabletop, tent |
| Capture state | preparing, ready, photo, recording, live, saving, error |
| Camera | virtual front, inner front, outer front, rear, camera switch |
| Input | on-screen, Camera Control, volume, Action, AirPods, accessibility |
| Presentation | no overlay, Camera Control overlay, menu, sheet, permission prompt |
| Window | full screen, Split View left / right, PiP / stacked video when relevant |
| Display | inner only, outer only, dual-display accessory, accessory lost |
| System | interruption, background / foreground, phone / audio interruption, thermal pressure |
| Appearance | light / dark, glass clear / tinted, Reduce Transparency, Increase Contrast |
| Accessibility | VoiceOver, large text, Reduce Motion, left / right hand use |
| Content | bright / dark / high-detail scene, face at the fold, text / document scan, low light |

Critical scenarios:
1. Recording, then fold into tabletop → Record/Stop and elapsed are not lost; preview / output upright.
2. Book pose, then switch camera → focal region, mirroring and controls update together.
3. Camera Control adjusting zoom, then open / close → on-screen zoom does not jump to a stale value.
4. Outer accessory showing a teleprompter loses availability → the main recording continues.
5. Split View makes the camera unavailable → the state explains it; no black viewfinder.
6. AirPods capture while the user is not looking at the screen → audible feedback, no double capture.
7. Permission not yet granted from locked capture → authentication and the hand-off to the app keep the intent.
8. Thermal pressure reduces capability → quality / status update; the task does not fail silently.

## 8. Lifecycle state machine `[T]`

From "camera not ready" to media saved or recovered after an error:

```text
Permission / authentication
          |
          v
Preparing camera -> Ready -> Focusing / adjusting
                         |             |
                         +-------> Capture intent
                                      |
                                      v
                         Exposure / recording active
                                      |
                                      v
                            Processing / saving
                              |             |
                              v             v
                            Review       Recoverable error
                              |             |
                         keep / share    retry / discard
```

A pose / display transition can happen at any node. It may change the layout but never jumps the capture state on its own — unless the camera is truly unavailable and the UI explains why.

## 9. Preparing and ready `[T]`

- Preparing never shows an unexplained black viewfinder: use a preview placeholder / blurred last-safe frame, or a neutral state with short progress.
- A disabled shutter has a reason if the wait is noticeable; never a button that looks active but ignores input.
- When ready, preview, active camera, mode, zoom and storage / recordability status agree.
- Without permission, keep the capture intent but never pretend the camera is ready.
- If a device switch or fold needs a camera reconfiguration, keep the UI state clear and prevent double capture during the unavailable window.

## 10. Focus, exposure and composition `[T]`

- Tap-to-focus shows a reticle at the touch point and its state (focusing / locked / failed) through changes not based on colour alone.
- Focus / exposure lock has a readable label or icon state and a path back to auto.
- The reticle avoids the fold and system overlays but still maps to the right point in the preview coordinate space.
- If the preview crop differs from the output, grid / face box / focal guide use the real output area or state the crop clearly.
- Zoom via pinch, slider and Camera Control shares one source of truth; switching input never makes the value jump.
- When the virtual camera switches physical lens, avoid a confusing flash / jump; if quality / minimum focus distance changes in a way that affects the task, update the state accordingly.

## 11. Photo capture by its real milestones `[A]` / `[T]`

Apple describes at least: settings resolved, exposure start, exposure complete, result delivery and capture complete. Map the UI to them:

| Milestone | Possible UX response |
|---|---|
| Intent accepted | one press / haptic; lock out a double intent |
| Settings resolved | update flash / Live Photo / format actually used, if needed |
| Exposure start | shutter animation / system sound |
| Exposure complete | hand the preview back; do not claim "saved" too early |
| Processing / result | temporary thumbnail or progress if processing is noticeable |
| Save complete | final thumbnail / status; allow review / share |
| Error | keep temporary data if any; say whether capture or saving failed; offer a fitting retry |

**Capture feedback is not save success.** The user may see the shutter while Photos permission, storage or processing still fails.

## 12. Video recording `[T]`

Recording state has:
- clear start / stop with double-action protection;
- elapsed time;
- mic state and audio route when relevant;
- storage / remaining limit when the product needs it;
- connection / stream state for livestreams;
- an indicator not based on colour alone;
- Stop always reachable in every pose and never in overflow;
- a `stopping / finalizing` state after Stop while the file is not ready.

When background, a phone call, the audio route, system pressure or a scene change affects recording, the UI distinguishes `paused`, `interrupted`, `stopped`, `finalizing` and `failed`. Elapsed time never keeps running over a frozen preview.

## 13. Processing, saving and storage `[T]`

- Several captures can process at once; thumbnails / order are tied to a capture ID so results never swap.
- If saving can run in the background, let the user keep shooting and show a local queue / status.
- If the user cannot leave, say clearly that it is finalizing and what Cancel / background would cause.
- Out of storage: block the next capture at the right moment, keep temporary media if possible, offer manage / retry actions; never promise the file is saved.
- Thermal / system pressure: reducing capability can beat stopping abruptly; if a resolution / frame-rate change affects a product promise, announce it.
- Ask for Photos permission at a sensible point for the camera feature; do not wait until after the first shot if the prompt would break a burst.

## 14. Review, retake and undo `[T]`

Pick the post-capture pattern by goal:
- **Fast capture** — thumbnail updates, stay in the viewfinder; tap the thumbnail to review.
- **Single-result task** — mandatory review with Use / Retake.
- **Document / scan** — review crop / perspective / page order before Save.
- **Pro / batch** — filmstrip / queue; never block the next capture.

Review says whether it shows a temporary or final version, whether there are unsaved edits, and whether Delete / Discard has undo or needs confirmation. Opening / folding during review keeps asset, zoom, edits and scroll; never return to the live camera unintentionally. If the outer display shows a clean preview, do not automatically show the just-taken photo there when it may be private and no policy says so.

## 15. Camera Control micro-spec `[A]`

- SF Symbols only; the symbol shows the type of control and does not try to encode the whole current state.
- Short control names: labels follow Dynamic Type and can cover the viewfinder.
- Values carry a unit / context such as EV, %, × or a localized string.
- Sliders declare **prominent values** so the hardware stops easily at common marks.
- The control list is not added to / removed from at runtime; change enabled state per mode / capability.
- Frequent controls near the middle; the system remembers the last used control.
- While the overlay is visible, reduce duplicated UI in the viewfinder and restore the exact state when it closes.

## 16. Camera lifecycle per posture `[T]`

| State | Fully open / flat | Book | Tabletop | Outer / dual display |
|---|---|---|---|---|
| Ready | preview + panel or full bleed | preview and controls split across two panes | preview on top, controls below | minimal outer preview; operator on inner |
| Focus / adjust | reticle in the right coordinates | avoid the spine; controls next to the preview owner | sliders in the lower area | values in sync; no private metadata exposed |
| Capturing | feedback does not make the preview jump | never reparent the shutter mid-press | reduce shake / strong haptics | one intent; feedback on the right display |
| Processing | local thumbnail / progress | stays in the owner pane | never covers Stop / next capture | outer never claims "saved" before the inner state |
| Review | use the large canvas | asset in one pane, tools in the other | preview on top, tools below | review outside only when policy allows |
| Error | inline per operation | next to the pane that caused it | call to action in the touch area | accessory loss never loses media |

## 17. Camera acceptance criteria `[T]`

- [ ] Shutter feedback, exposure complete and save complete are three distinct states.
- [ ] Focus / exposure have visual and semantic state and a reset path.
- [ ] Zoom / lens state does not jump when switching between touch, Camera Control and fold.
- [ ] Record/Stop / elapsed / mic stay correct in every pose and interruption.
- [ ] The processing queue is tied to the right capture ID; thumbnails never swap.
- [ ] Storage, Photos permission, thermal and save failure have a recovery flow.
- [ ] Review keeps asset / edit state across resize, fold and display move.
- [ ] The outer display does not expose review / media / metadata beyond policy.
- [ ] Camera Control has localized units, prominent values and an enabled-state contract.
- [ ] Real-device tests for haptics, sound, sensor, physical buttons, AirPods and system pressure.
