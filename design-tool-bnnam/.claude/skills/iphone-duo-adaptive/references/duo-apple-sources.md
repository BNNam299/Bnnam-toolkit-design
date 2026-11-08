# Apple sources behind the iPhone Duo / iOS 27 knowledge

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §20.1–20.12, §24.20, source lines of §26–35 @ 3c0e291 — translated, complete

Use this file to trace a rule back to Apple before turning it into a fixed rule, and to check Apple's change log — iOS 27, Xcode 27 and iPhone Duo are newer than the agent's built-in knowledge. Verbatim HIG pages live in `../apple-hig/references/`. The frame-by-frame video atlas is a separate source (see the skill's SKILL.md).

## Contents
1. iPhone Duo tech talks, HIG page and developer hub
2. Device Hub
3. Design system and other iOS 27 sessions
4. Camera sources
5. HIG pages behind the cross-cutting chapters

---

## 1. iPhone Duo tech talks, HIG page and developer hub

| Source | Main contribution |
|---|---|
| [Prepare your app for iPhone Duo — 111461](https://developer.apple.com/videos/play/tech-talks/111461/) | SDK path old SDK → iOS 27 → iOS 27.1; resizability, size classes, scene geometry; removing `UIScreen.main`, orientation and idiom assumptions; self-adapting system containers; safe area, custom bars and reserved regions; the App Resizability skill and the Duo simulator in Xcode 27.1 |
| [Raise the bar with iPhone Duo — 111462](https://developer.apple.com/videos/play/tech-talks/111462/) | bars go vertical only for the right container / hardware edge; hierarchy Back/Close → Done → groups; fixed width / flexible height; symbol / title, custom views and axis behaviour; badges, group spacing, reduced transparency; toolbar / tab compression and visibility priority; reasonable opt-out cases |
| [Strike a pose with adaptive layouts on iPhone Duo — 111463](https://developer.apple.com/videos/play/tech-talks/111463/) | reserved regions and displacement; continuous content need not avoid the fold; smallest scope and related-group movement; book / tabletop patterns; split / overlay arrangement, axes and minimization; arrangement is not navigation; hinge data for effects, not for the main layout |
| [Leverage multiple displays and scenes on iPhone Duo — 111464](https://developer.apple.com/videos/play/tech-talks/111464/) | hinge state / angle and its limits for layout; side-by-side multitasking; several instances of an app's UI; scene-creation availability; scene accessory, especially the Camera Capture Accessory; coordinating state between two displays and graceful fallback |
| [Build a great camera experience for iPhone Duo — 111465](https://developer.apple.com/videos/play/tech-talks/111465/) | two front cameras and the virtual front camera; capability / quality trade-off; direction relative to view / display; mirroring, rotation, output continuity; preview layout on the inner display; dual-display camera and accessory |
| [Design for iPhone Duo — 111466](https://developer.apple.com/videos/play/tech-talks/111466/) | design principles of the outer / inner display and the poses; side controls, asymmetry and reachability; no separate design per pose; split hierarchy, sheet behaviour, fold avoidance; full-width immersive vs inset scroll content; consistent functionality / hierarchy |
| [Designing for iPhone Duo — HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo) (verbatim: [designing-for-iphone-duo.md](../apple-hig/references/designing-for-iphone-duo.md)) | **the central UX/UI rule source**: anatomy and device poses; best practices; dynamic layouts and reserved regions; split views and arrangement views; vertical controls, item order, priority, grouping and overflow; RTL / hardware alignment; game guidance; change log: new page on 2026-09-09 |
| [iPhone Duo developer hub](https://developer.apple.com/iphone-duo/) and [Three steps to update your app](https://developer.apple.com/iphone-duo/prepare/) | official images / assets; compatibility matrix per SDK; three groups of work — build with the new SDK, resize correctly, test with the simulator / Device Hub; common bugs — fixed sizes, orientation, idiom, aspect-fill crop; preparing a fitting App Store presentation |

## 2. Device Hub

| Source | Main contribution |
|---|---|
| [Device Hub documentation](https://developer.apple.com/documentation/xcode/device-hub) | real devices and simulators in one tool; compact / full mode; live screen, properties, app / data, diagnostics and device settings; resize and state configuration for visual QA |
| [Get the most out of Device Hub — WWDC26/260](https://developer.apple.com/videos/play/wwdc2026/260/) | device / simulator workflow; 1:1 physical size, zoom, keyboard capture; appearance / text-size / location / audio testing; several compact windows for comparison; bug reproduction and `devicectl` automation |

Details: [duo-handoff-testing.md](duo-handoff-testing.md) §1–4.

## 3. Design system and other iOS 27 sessions

| Source | Main contribution |
|---|---|
| [Get to know the new design system — WWDC25/356](https://developer.apple.com/videos/play/wwdc2025/356/) | Liquid Glass as a functional layer between navigation / actions and content; colour, typography and the three-shape system (fixed, capsule, concentric); source–presentation relationship, focus, modality and depth; bar grouping / overflow, Search tab, accessory view and scroll-edge effects; sidebar / background extension; shared anatomy and behaviour for continuity across iPhone, iPad and Mac |
| [What's new in SwiftUI — WWDC26/269](https://developer.apple.com/videos/play/wwdc2026/269/) | new Liquid Glass, resizable iPhone apps, Live Previews, toolbar priority / overflow / minimization, prominent tab |
| [Modernize your UIKit app — WWDC26/278](https://developer.apple.com/videos/play/wwdc2026/278/) | scene lifecycle, traits / geometry, resizability, sidebar, menus and scroll-edge behaviour |
| [Communicate your brand identity on iOS — WWDC26/251](https://developer.apple.com/videos/play/wwdc2026/251/) | UI / content layers, native components, brand content, colour, type, icons and motion |
| [Materials — HIG](https://developer.apple.com/design/human-interface-guidelines/materials) (verbatim: [materials.md](../apple-hig/references/materials.md)) | Liquid Glass, standard materials, contrast and accessibility adaptation |
| [WWDC26 Design guide](https://developer.apple.com/wwdc26/guides/design/) | overview of platform design updates, Icon Composer and design resources |
| [Platforms State of the Union — WWDC26/112](https://developer.apple.com/videos/play/wwdc2026/112/) | iOS 27 Liquid Glass refinements, transparency slider, resizability and Xcode / Device Hub |

Visual foundation: [duo-ios27-visual.md](duo-ios27-visual.md).

## 4. Camera sources

- [Camera Control — HIG](https://developer.apple.com/design/human-interface-guidelines/camera-control) (verbatim: [camera-control.md](../apple-hig/references/camera-control.md))
- [Enhancing your app experience with the Camera Control](https://developer.apple.com/documentation/avfoundation/enhancing-your-app-experience-with-the-camera-control)
- [Enhancing your camera experience with capture controls — WWDC25/253](https://developer.apple.com/videos/play/wwdc2025/253/)
- [Choosing a camera by the direction it faces](https://developer.apple.com/documentation/avkit/choosing-a-camera-by-the-direction-it-faces)
- [AVCaptureDeviceDirectionCoordinator](https://developer.apple.com/documentation/avkit/avcapturedevicedirectioncoordinator)
- [LockedCameraCapture](https://developer.apple.com/documentation/lockedcameracapture)
- [Creating a camera experience for the Lock Screen](https://developer.apple.com/documentation/lockedcameracapture/creating-a-camera-experience-for-the-lock-screen)
- [Privacy — HIG](https://developer.apple.com/design/human-interface-guidelines/privacy)
- [AVCaptureSession interruption reasons](https://developer.apple.com/documentation/avfoundation/avcapturesession/interruptionreason)
- [AVCam: Building a camera app](https://developer.apple.com/documentation/avfoundation/avcam-building-a-camera-app)
- [Tracking photo capture progress](https://developer.apple.com/documentation/avfoundation/tracking-photo-capture-progress)
- [Saving captured photos](https://developer.apple.com/documentation/avfoundation/saving-captured-photos)

Details: [duo-camera-layout-controls.md](duo-camera-layout-controls.md), [duo-camera-lifecycle-privacy.md](duo-camera-lifecycle-privacy.md).

## 5. HIG pages behind the cross-cutting chapters

| Topic file | Apple sources |
|---|---|
| [duo-accessibility-localization.md](duo-accessibility-localization.md) | [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [VoiceOver evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/voiceover-evaluation-criteria), [Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [Layout](https://developer.apple.com/design/human-interface-guidelines/layout), [Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left), [Preparing dates, currencies, and numbers for translation](https://developer.apple.com/documentation/xcode/preparing-dates-numbers-with-formatters) |
| [duo-states-feedback.md](duo-states-feedback.md) | [Loading](https://developer.apple.com/design/human-interface-guidelines/loading), [Progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators), [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts), [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback), [Playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics), [Playing audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio) |
| [duo-ergonomics-motion-input.md](duo-ergonomics-motion-input.md) | [Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria), [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures), [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards), [Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection), [Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices) |
| [duo-privacy-onboarding.md](duo-privacy-onboarding.md) | [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy), [Preparing your UI to run in the background](https://developer.apple.com/documentation/uikit/preparing-your-ui-to-run-in-the-background), [Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding), [Discoverable design — WWDC21](https://developer.apple.com/videos/play/wwdc2021/10126/) |
