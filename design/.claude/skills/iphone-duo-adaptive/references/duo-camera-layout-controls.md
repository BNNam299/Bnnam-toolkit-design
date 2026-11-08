# Camera UX on iPhone Duo: cameras, direction, layout per posture, control layers and hardware input

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §12 (fig. 12), §20.8, §23.5, §24 intro, §24.1–24.12 (fig. 15–17) @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). Applies to photo, video, video-call, livestream, scanner and creative-camera apps. Lifecycle, permissions, privacy, interruptions, accessibility, component contract and camera test matrix continue in [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md). Verbatim Apple page: [Camera Control](../apple-hig/references/camera-control.md).

**Plain-language posture names `[T]` — write them verbatim in briefs, wireframes, prototypes and test cases**, never only `book`, `tabletop` or `partial fold` (people unfamiliar with Apple's terms misread the posture). The Vietnamese names are the team's working names:

| Name to write | Apple / technical term | Fold direction as seen in the UI | Camera UX model |
|---|---|---|---|
| **Fully open / flat** (*Mở hoàn toàn / mở phẳng*) — §5 | Fully open, flat inner display | the screen is not split into two regions | large preview; controls at the side, at the bottom or in a supporting pane |
| **Half open like a book** (*Mở một nửa kiểu quyển sách*) — §6 | Book pose, partial fold | vertical fold | two pages left–right: preview on one, controls / secondary content on the other; or the preview spans both but avoids the spine |
| **Half open like a laptop** (*Mở một nửa kiểu laptop*) — §7 | Tabletop / laptop pose, partial fold | horizontal fold | top half for watching the preview, bottom half as the touch / control area |

"Half open" alone is ambiguous: always add **like a book / vertical fold** or **like a laptop / horizontal fold** — the two postures create two layouts and two completely different reach areas.

## Contents
1. The two front cameras; virtual vs physical camera
2. Direction instead of front/back; mirroring, rotation, preview on the inner display
3. Posture matrix and overview wireframes
4. Closed / outer display
5. Fully open / flat — inner display
6. Half open like a book — vertical fold
7. Half open like a laptop — horizontal fold
8. Tent / standing and remote capture
9. Dual-display camera and Camera Capture Accessory
10. Four layers of camera control — one state
11. Control priority A / B / C
12. Transitions when opening, closing or changing display
13. Hardware Camera Control and the system overlay
14. Volume, Action button and AirPods
15. Required product decisions and design checklist

---

## 1. The two front cameras; virtual vs physical camera `[A]`

Apple illustration (fig. 12, *Build a great camera experience for iPhone Duo*, tech talk 111465): camera UI can use the large screen, the fold and the secondary display.

- Duo is the first iPhone with **two front cameras**, both **square sensors with an ultrawide field of view**: the **outer** ultrawide on the outside of the device, and the **inner** ultrawide — the first under-display camera on an iPhone.
- **Virtual Front Camera:** when an app requests the front Wide / Ultra Wide camera the usual way, Duo provides a virtual camera. Device open → it uses the inner front camera; closed → it switches to the outer front camera automatically. The system handles the switch, giving good continuity and fewer states for the app to manage. This is the default when the goal is "always the camera that matches the screen the user is looking at" and no special capability is needed.
- **A specific physical camera:** the app can access the outer / inner ultrawide separately via the matching device type, gaining capability but owning the camera switch on open / close, orientation, mirroring and clear state.
- **Capability trade-off (per the video):** inner max **1080p60**; outer max **4K120**; virtual only uses the shared capability, max **1080p60**. **Depth** is supported only when accessing a physical camera directly.
- `[C]` Do not treat the two sources as one front camera when the product needs a specific capability. Decide explicitly: automatic continuity, or quality / advanced features. If the user chooses, the label describes the benefit, not just the hardware name. These numbers inform quality messaging and expectations — they are no reason to expose technical terms in the UI when the user does not need them.

## 2. Direction instead of front/back; mirroring, rotation, preview `[A]` / `[C]`

**Direction (video 02:46–05:37)**
- Both the outer and the inner front camera have position `.front`, but the displays can face opposite ways: "front" no longer guarantees the camera is looking at the person using the app. The outer front camera may face away while the user looks at the inner display, then face them when the device closes. When the device is opened and turned around, the rear camera can face the user like a selfie camera.
- `AVCaptureDeviceDirectionCoordinator` reports which camera is forward / backward **relative to the current view** and updates when geometry changes. It takes a view, the group of device types to track and a change handler. The same camera can be reported in different directions when the view moves from outer to inner.
- When the app uses both displays there are two views at once → one coordinator per view; the outer and inner coordinators may report the rear camera in two different directions because each result is relative to its own view. The scene accessory is the mechanism that enables two-display camera UI (§9).
- The coordinator is tied to the main UI context and returns a safe device descriptor to pass to the camera / capture layer instead of touching AVFoundation in the UI change handler. `[C]` Camera state needs a clear intermediate layer: the UI reflects state and sends intents; the capture pipeline configures the hardware — this avoids frozen UI, race conditions or an out-of-sync preview when fold / display change quickly.
- `[C]` Spec consequence: every preview / control knows which display / view context it belongs to; never one global camera-direction flag for the whole app.

**Describe cameras by purpose `[C]`:** camera facing you · camera facing outward · preview for the person being filmed · high-quality camera · which screen the active camera is on. Never a lone flip icon whose resulting state is hard to predict — preview, label, animation and haptic confirm the change.

**Handling a direction change (06:17–07:02)**
- On open / close the handler reports the new forward-facing camera. An app using a specific camera reconfigures the capture session to keep streaming from the forward-facing camera.
- Re-evaluate mirroring after every direction change. When the rear camera becomes forward-facing, mirror the preview so selfie interaction feels natural.
- Update the UI in the same phase as the camera switch: active state, preview transition, control availability and quality indicator never lag behind.

**Mirroring and orientation**
- The selfie preview is usually mirrored for natural interaction, even when the rear camera faces the user in a special pose.
- Saved photos / videos follow the product's convention and never "flip unexpectedly".
- When the app / display moves between outer and inner, preview and capture output stay upright.
- With a square sensor the UI can change aspect ratio more freely; do not force a fixed-orientation preview just because the device is lying sideways.

**Rotation (08:03–08:46)**
- The rotation coordinator keeps preview and captured photos upright. On Duo it also updates when the app **moves to another display**, not only when the device rotates.
- Apply rotation consistently to preview, capture output and overlay UI.
- After adopting the coordinator, Apple asks to turn off camera-sensor-orientation compensation for performance — a technical handoff note, since slow performance degrades preview / interaction.

**Preview on the inner display (07:03–08:02)**
- The rear camera's full field of view can leave spare space around the preview on the inner display. Two valid directions: (1) **offset the preview** and use the rest to group controls (or specs, shot list); (2) let the preview **fill the display**, accepting a crop that fits the goal — always protect the subject / focal area.
- The square front ultrawide sensor allows choosing a landscape aspect ratio dynamically to fill the wide screen.
- `[C]` The designer states preview gravity / crop intent and the preview–output relationship explicitly; never let the implementation pick `fill` in every state. The user must not see one composition in the preview and receive a noticeably different crop without being told. Full contract: [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md) §4.

## 3. Posture matrix and overview wireframes `[T]`

Quick-reference diagrams; §5–7 detail behaviour, transitions and variants.

**A. Fully open / flat**
```text
+--------------------------------+------------+
|                                | Mode       |
|                                | Lens       |
|            PREVIEW             | Zoom       |
|                                | Exposure   |
|                                |            |
|                                | [CAPTURE]  |
+--------------------------------+------------+
  The inner display is one flat surface; the side panel is optional.
```

**B. Half open like a book / vertical fold**
```text
+----------------------+||+----------------------+
|                      ||| Mode / Lens          |
|       PREVIEW        ||| Exposure             |
|                      ||| [CAPTURE]            |
|                      ||| Shot list / Gallery  |
+----------------------+||+----------------------+
                        ^
               vertical fold / spine
```

**C. Half open like a laptop / horizontal fold**
```text
+----------------------------------------------+
|                                              |
|                   PREVIEW                    |  top half: watch
|                                              |
+=============== horizontal fold ==============+
| Mode       Zoom       Exposure       Timer   |
| Gallery             [CAPTURE]          Flip  |  bottom half: touch
+----------------------------------------------+
```

These wireframes describe **functional zones**, not pixel sizes, and do not force every camera app to have a panel. With little secondary content the preview can grow, but capture state, focal area and important controls still avoid the folding / reserved region.

| State | Primary surface | Capture controls | System chrome | Protect |
|---|---|---|---|---|
| Closed / outer | compact preview, one main task | bottom edge or content layer within reach; utility actions in the side bar | vertical bar on the hardware edge | outer camera region, Dynamic Island, crop from the wide–short canvas |
| Inner flat, landscape | large preview, or preview + supporting pane | control rail / panel in the remaining space; global actions may sit in the side bar | usually vertical | inner camera when active, readable composition, no stretching |
| Inner flat, portrait | vertical preview or preview + bottom controls | horizontal / bottom controls per convention | horizontal bar | inner camera when active, safe bottom gesture area |
| Book partial fold | preview in one region; controls / shot list in the other, or preview on both sides with a focal-safe zone | moved off the fold, grouped by context | outer edge per container | vertical folding region; subject / focus not on the spine |
| Tabletop / laptop partial fold | preview / participant in the top half | capture / mode / sliders stable in the bottom half | depends on geometry / container | horizontal folding region, hand reach, preview–output ratio |
| Tent / standing | preview / glanceable state facing the user | remote / physical capture first; on-screen fallback still exists | system decides | readability from afar, orientation, which display is active |
| Split View / PiP | preview shrinks with the window; may lose area | keep A-level controls; reduce B/C or overflow them | bar on the app's outer edge | camera availability in multitasking, PiP overlap, text / status |
| Dual display | inner: operator UI; outer: clean preview / teleprompter | main controls on inner; outer usually non-critical | each scene per its context | privacy on the outer display, accessory availability, synced countdown / recording |

## 4. Closed / outer display `[T]`

Goal: fast one-handed capture on a wide, short canvas.
- The preview may be full bleed, but the focal area avoids the camera / status / vertical bar.
- The on-screen shutter belongs to the **content layer** and is always reachable; never make the shutter a toolbar item that can overflow.
- Back/Close and utility actions use the vertical system bar. A mode selector or a too-wide text control may stay in a horizontal bar.
- When a Live Activity or system status takes more of the vertical axis, C-level toolbar items give way first.
- The physical Camera Control or volume button never replaces the on-screen path — the user may not know or be able to use the hardware.
- If the preview uses `aspectFill`, define a focal-point / crop rule for the outer aspect ratio.

```text
┌──────────────────────────────┬────┐
│                              │SYS │
│          PREVIEW             │BAR │
│                              │    │
│  Gallery   ● Shutter   Flip  │Tab │
└──────────────────────────────┴────┘
```

## 5. Fully open / flat — inner display `[A]` / `[T]`

Apple allows two main preview directions:
1. **Preview fills the display** — suits immersive capture; accept a deliberate crop and keep controls / focal content out of reserved regions.
2. **Preview offset** — keep the full field of view and use the remaining space for controls, shot list, script or specs.

The square front sensor supports a dynamic landscape aspect ratio so the preview uses the inner screen; a filling preview must still not make the output differ much from the composition the user framed.

Inner landscape usually has a vertical bar; inner portrait keeps a horizontal bar. Capture controls belong to content and need not follow the toolbar axis — e.g. the shutter sits in its own control panel while Back / Done / Share follow the system bar.

```text
┌──────────────────────────────┬────────────┐
│                              │ Mode       │
│          PREVIEW             │ Zoom       │
│                              │ Exposure   │
│                              │ ● Capture  │
└──────────────────────────────┴────────────┘
```

Use the large space to reveal valuable context — shot list, timeline, participants, transcript — instead of just enlarging the shutter and icons.

## 6. Half open like a book — vertical fold `[T]`

The folding region becomes a division region. Three patterns:

**Pattern A — preview + control / supporting pane**
```text
┌────────────────┬────────────────┐
│                │ Mode / Lens    │
│    PREVIEW     │ Exposure       │
│                │ ● Capture      │
│                │ Shot list      │
└────────────────┴────────────────┘
                 ↑ fold
```
Fits pro camera, scanner, livestream-operator apps or cameras with a lot of supporting information.

**Pattern B — main preview + secondary content**
- Preview in the priority region.
- The other region holds the gallery, teleprompter, participants, a reference image or the captured result.
- The capture control stays in the same region as the preview when that keeps the relationship clearer.

**Pattern C — preview spanning both regions**
- Only if content continuous across the fold stays readable.
- Keep the subject guide, focus reticle, face box, shutter and text off the spine.
- If the fold splits the subject, consider shifting / cropping the preview or a guide asking the user to reframe.

Never use the hinge angle as a breakpoint ("exactly 90° → change layout"). Arrangement / reserved region decides when to split; hinge data may only add effects / feedback.

## 7. Half open like a laptop — horizontal fold `[T]`

The strongest pattern for hands-free capture:
```text
┌────────────────────────────────┐
│                                │
│            PREVIEW             │  watched from a distance
│                                │
├──────── folding region ────────┤
│ Mode  Zoom  Exposure  Timer    │
│ Gallery      ● Capture    Flip │  stable touch area
└────────────────────────────────┘
```
- Top half: preview, participant, framing guide, recording result or content to observe.
- Bottom half: mode, shutter, sliders and frequent controls.
- Keep shutter / stop stable while the fold angle changes; never let a button "drift" from the bottom to the edge while the finger is heading to it.
- Overlays / context menus of the bottom controls appear in the same region or close enough to their source.
- The preview needs a clear aspect rule: fit to see the whole composition, fill for immersion, or a dynamic aspect ratio if the camera supports it.
- This is an enhancement: every action still exists when the device is flat or closed.

## 8. Tent / standing and remote capture `[T]`

When the device stands away from the hand:
- make countdown, active camera, timer and recording state more glanceable;
- use Camera Control / volume / Action button or AirPods to capture remotely when available;
- multichannel feedback: visual + haptic / audio as capability allows;
- AirPods capture needs a confirmation sound — the user may not be looking at the screen;
- keep the on-screen fallback and an accessibility action;
- never show unnecessary sensitive data on the display facing other people.

## 9. Dual-display camera and Camera Capture Accessory `[A]` / `[T]`

The Camera Capture Accessory shows secondary content on the outer display while the main camera UI is on the inner display. Conditions Apple publishes:
- the main app is full screen on the inner display;
- a camera session is active;
- the accessory is registered in the same context as the camera view;
- availability is controlled by the system and can change at any time.

With both displays active: each display needs its own view context; the inner keeps advanced controls for the operator; accessibility and privacy indicators are clear on the relevant side; the accessory disappearing must not stop recording or lose configuration unnecessarily.

The outer display suits: clean preview for the person being filmed · teleprompter · countdown and recording indicator · framing / safe-area guide · short pose guidance.

The outer display should **not** hold: the only Stop button · the only permission recovery · a setting the operator cannot reach on the inner display · private content the person outside does not need · controls that pretend to be interactive when the accessory is actually non-interactive.

When the accessory loses availability, the inner UI keeps capturing safely, updates the toggle and explains the state if the user just asked to turn the outer display on. Scene-accessory mechanics: [duo-multi-display-scenes.md](duo-multi-display-scenes.md) §5–6; what may be shown outside: [duo-privacy-onboarding.md](duo-privacy-onboarding.md) §1–2.

## 10. Four layers of camera control — one state `[T]`

A camera app on iOS 27 / Duo can receive intent from four layers. Treat them as several representations of **the same state**, not four independent control systems.

| Layer | Examples | UX rule |
|---|---|---|
| On-screen capture UI | shutter, record, mode, zoom, exposure, flip, gallery | always a clear path; adapts to pose and safe region |
| System / app chrome | Back, Close, Done, toolbar, tab, status, Dynamic Island | standard containers; vertical / horizontal per the system; priority / overflow |
| Physical / remote input | Camera Control, volume, Action button, AirPods | same action / state as the on-screen UI; no surprising results |
| Secondary display / accessory | outer preview, teleprompter, countdown, framing guide | supplementary, dynamic availability, never the only holder of a vital function |

If zoom changes via Camera Control, pinch, an on-screen slider or remote input, every representation reads the new value. Otherwise the next gesture jumps back to the stale value — a bug Apple shows directly in the capture-controls session.

## 11. Control priority A / B / C `[T]`

**A — never lost during active capture:** shutter or record/stop · elapsed time and recording / live state · important camera / microphone failure · a safe way to stop the task · system-provided privacy indicators.

**B — quick access, representation may change:** camera / lens switch · zoom · basic exposure / focus · torch / flash · mute / unmute in calls / livestream · mode selector directly related to capture.

**C — may go into menu / sheet / overflow:** grid, timer, format, resolution · rarely used filters / effects · long settings · help and advanced metadata.

Record/Stop must not vanish into toolbar overflow while recording. If the system bar runs out of space, this action lives in the content layer or a custom capture control with its own area; the toolbar keeps only navigation and secondary tasks.

## 12. Transitions when opening, closing or changing display `[T]`

**Before capturing**
- keep mode, zoom, exposure, filter and selected camera when capability allows;
- reflow controls with short movement, keeping relative positions;
- change the preview source via the automatic Virtual Front Camera or the direction coordinator;
- update mirroring / rotation before the preview settles, to avoid a flipped / upside-down flash.

**While taking a photo**
- a physical press has three phases: *began* to prepare, *cancelled* when backgrounded / unavailable, *ended* to capture;
- never create two photos because the same intent arrived from both the on-screen and the hardware path;
- shutter feedback is identical whatever the input source.

**While recording video / livestream / call**
- prefer not interrupting the stream just because the layout reflows;
- Record/Stop, elapsed time, microphone and connection state stay continuous;
- if a camera switch changes capability / resolution, say so clearly or block the switch when the output contract cannot be kept;
- on a session interruption, distinguish "layout is changing" from "capture has stopped"; never leave a frozen preview without a state.

**While the Camera Control overlay is open**
- avoid reflowing the whole app while the system overlay is changing a value;
- keep the selected control / value and resync the on-screen UI after the transition;
- if the control is no longer supported in the new camera / mode, disable it and explain — never silently switch to another control.

## 13. Hardware Camera Control and the system overlay `[A]`

The hardware **Camera Control** is different from camera buttons drawn in the app. A **light press** opens an overlay to adjust the selected control; a **double light press** opens the list of controls so the user can switch.

Wireframe of fig. 15 (Apple — *Enhancing your app experience with the Camera Control*): the overlay grows out of the top edge of the display, next to the button, over the viewfinder:
```text
Single light press                         Double light press
╭──────────╮▔▔▔▔▔▔▔▔▔▔╭──────────╮         ╭───────╮▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╭───────╮
│          ╰ |·|·|┃|·|· ╯         │         │       ╰  t   ƒ  [⌖]  ◎  ▦ ╯       │
│              1×  (yellow)       │         │              ZOOM (yellow)        │
│                                 │         │                                   │
│        viewfinder (app)         │         │   viewfinder (app)                │
│                                 │         │   selected control highlighted    │
│                                 │         │   in yellow, others white         │
╰─────────────────────────────────╯         ╰───────────────────────────────────╯
 overlay = scale ticks + current value       overlay = row of control symbols
```

Rules:
- Keep app UI out of the overlay area; never put essential labels / status underneath it.
- The camera mode decides which controls are enabled — e.g. a video-only control is disabled in photo mode.
- HIG allows several controls, but do not change the list unpredictably while the user operates; keep the structure stable and change enabled state per mode.
- Put frequently used controls near the **middle** of the list, rarely used ones at both ends.
- The system remembers the last used control; the app handles it no longer being available in the new mode / camera.
- When a control enters its fullscreen appearance, reduce / minimise distracting camera UI; on exit, restore exactly the previous UI.
- Never run a capture session just to get Camera Control — the power and privacy cost is justified only in a real capture experience.

The two standard controls are **zoom** and **exposure bias**. Wireframe of fig. 16 (`AVCaptureSystemZoomSlider`, `AVCaptureSystemExposureBiasSlider`):
```text
╭──────╮ |·|·|┃|·|·|·  ╭──────╮      ╭──────╮ |·|·|┃|·|·|  ╭──────╮
│        1×  (yellow)          │      │       0 EV (yellow)        │
 zoom: tick scale, value "1×"          exposure bias: tick scale centred on 0, value "0 EV"
```

Custom controls may be a **continuous slider, a discrete slider or an indexed picker**. Wireframe of fig. 17 (custom focus `AVCaptureSlider`, filter `AVCaptureIndexPicker`):
```text
Control list (double press)              Control list (double press)
╭────╮  ◎◎   [⌖]  ╭────╮                  ╭────╮  [◎◎]   ⌖  ╭────╮
       FOCUS (yellow)                            FILTERS (yellow)

Focus slider (light press)               Filter picker (light press)
╭────╮ |·|·|┃|·|·|·|·  ╭────╮             ╭────╮  •  •  ┃  •  ╭────╮
          .50 (yellow)                           STARK B&W (yellow)
 continuous value with ticks              discrete positions (dots), current
                                          item name shown below
```

A custom Camera Control needs: a clear localized title · a recognisable SF Symbol · a meaningful value / index · enabled state matching capability · the same state model as the on-screen UI · its action near the capture / session layer while updating the UI safely · no use for settings unrelated to capture. Micro-spec (units, prominent values, list stability): [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md) §15.

When temporarily unavailable, Apple advises **disabling rather than removing** the control; if removed, the system may pick another control as a fallback and the user will not understand where the old one went.

## 14. Volume, Action button and AirPods `[A]`

Physical capture input shares one contract:
- `began` — prepare the camera / capture feedback;
- `cancelled` — cancel because the app went to the background or capture is unavailable;
- `ended` — capture;
- primary and secondary actions are not handled as the same event if the app defined two roles;
- if the app overrides button behaviour, every received event gets feedback — a silent button is a UX bug.

A backgrounded app, or one without an active capture session, receives no capture events; the buttons return to system behaviour. UI / guidance must not promise "volume is always the shutter" outside an active camera context.

AirPods (H2) can trigger remote capture. Because the user may not be looking at the screen:
- play a confirmation sound;
- the sound fits the capture type — e.g. shutter vs start / stop recording differ;
- the visual countdown / recording state stays visible for people in the frame;
- avoid playing custom sounds when the system does not allow it or the action did not come from AirPods.

## 15. Required product decisions and design checklist `[A]` / `[T]`

Decisions from the video (08:47–09:12) `[A]`: build with the **iOS 27.1 SDK** for full capability · decide the camera-switch strategy on open / close · use the direction coordinator whenever you go beyond the Virtual Front Camera · test the real preview on Duo with open / close, flip, two displays, crop, mirror and rotation.

Design checklist `[T]`:
- Can the user tell which camera / display is active?
- Does a camera switch have continuity, preview and feedback?
- Is mirroring correct in both preview and output?
- Is the capture control reachable in book / tabletop?
- Are recording state, duration, microphone, storage and errors visible in every pose?
- Does the preview avoid the fold / camera region and the bar?
- If quality changes between virtual / physical camera, is the user told as much as needed?
- When the accessory is unavailable, can the main flow still complete?
