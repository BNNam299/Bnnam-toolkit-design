<!-- Source: https://developer.apple.com/design/human-interface-guidelines/multitasking · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/multitasking.md @ 3c0e291 · Platform considerations removed for: macOS, tvOS, visionOS (iOS / iPadOS only) -->

# Multitasking

Multitasking lets people switch quickly from one app to another, performing tasks in each.

*[hình: A sketch of two side-by-side windows in a split view arrangement, suggesting multitasking. The image is overlaid with rectangular and circular grid lines and is tinted orange to subtly reflect the orange in the original six-color Apple logo.]*

People expect to use multitasking on their devices, and they may think something is wrong if your app doesn’t allow it. With rare exceptions — such as some games, and Apple Vision Pro apps running in a Full Space — every app needs to work well with multitasking.

In addition to app switching, multitasking can present different experiences on different devices; see [Platform considerations](https://developer.apple.com/design/human-interface-guidelines/multitasking#Platform-considerations).

### Best practices

A great multitasking experience helps people accomplish tasks in multiple apps by managing content in a variety of simultaneous contexts. Because you don’t know when people will initiate multitasking, your app or game always needs to be prepared to save and restore their context.

**Pause activities that require people’s attention or active participation when they switch away.** If your app is a game or a media-viewing app, for example, make sure people don’t miss anything when they switch to another app. When they switch back, let them continue as if they never left.

**Respond smoothly to audio interruptions.** Occasionally, audio from another app or the system itself may interrupt your app’s audio. For example, an incoming phone call or a music playlist initiated by Siri might interrupt your app’s audio. When situations like these occur, people expect your app to respond in the following ways:

- Pause audio indefinitely for primary audio interruptions, such as playing music, podcasts, or audiobooks.
- Temporarily lower the volume or pause the audio for shorter interruptions, such as GPS directional notifications, and resume the original volume or playback when the interruption ends.

For guidance, see [Playing audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio).

**Finish user-initiated tasks in the background.** When someone starts a task like downloading assets or processing a video file, they expect it to finish even if they switch away from your app. If your app is in the middle of performing a task that doesn’t need additional input, complete it in the background before suspending.

**Use notifications sparingly.** Your app can send notifications when it’s suspended or running in the background. If people start an important or time-sensitive task in your app, and then switch away from it, they might appreciate receiving a notification when the task completes so they can switch back to your app and take the next step. In contrast, people don’t generally need to know the moment a routine or secondary task completes. In this scenario, avoid sending an unnecessary notification; instead, let people check on the task when they return to your app. For guidance, see [Managing notifications](https://developer.apple.com/design/human-interface-guidelines/managing-notifications).

### Platform considerations

*Not supported in watchOS.*

#### iOS

On iPhone, multitasking lets people use FaceTime or watch a video in Picture in Picture while they also use a different app.

*[hình: A screenshot of the app switcher on iPhone, showing four open apps.]*

*[hình: A screenshot of Mail on iPhone, showing an individual email. On top of the email body content, a small image in the bottom-left corner shows the person currently in a FaceTime call.]*

#### iPadOS

On iPad, people can view and interact with the [windows](https://developer.apple.com/design/human-interface-guidelines/windows) of several different apps at the same time. An individual app can also support multiple open windows, which lets people view and interact with more than one window in the same app at one time.

People can use iPad with either full-screen or windowed apps. When full screen, apps occupy the full screen, and people can switch between individual app windows using the app switcher.

*[hình: A screenshot of the iPad app switcher in landscape orientation, showing five open apps. Thumbnail representations of the apps are arranged in a grid.]*

When using windowed apps, app windows are resizable, and people can arrange them to suit their needs with behavior similar to macOS. The system provides window controls for common tiling configurations, entering full screen, minimizing, and closing windows. The system identifies the frontmost window by coloring its window controls and casting a drop shadow on windows behind it. For guidance, see [Windows > iPadOS](https://developer.apple.com/design/human-interface-guidelines/windows#iPadOS).

*[hình: A screenshot of two windowed apps on iPad in landscape orientation. The frontmost app window overlaps and casts a shadow on the one behind it, and has colored window controls to indicate that the window is active. Both windows sit atop the Home Screen background, and the Dock appears at the bottom.]*

Additionally, videos and FaceTime calls can also play in a Picture in Picture overlay above other content regardless of whether apps are full screen or windowed.

> **Note:** Apps don’t control multitasking configurations or receive any indication of the ones that people choose.

To help your app respond correctly when people open it while windowed, make sure it adapts gracefully to different screen sizes. For guidance, see [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) and [Windows](https://developer.apple.com/design/human-interface-guidelines/windows); for developer guidance, see [Multitasking on iPad, Mac, and Apple Vision Pro](https://developer.apple.com/documentation/uikit/multitasking-on-ipad-mac-and-apple-vision-pro). To learn more about how people use iPad multitasking features, see [Use multitasking on your iPad](https://support.apple.com/en-us/HT207582).

### Resources

##### Related

[Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

[Windows](https://developer.apple.com/design/human-interface-guidelines/windows)

[Playing video](https://developer.apple.com/design/human-interface-guidelines/playing-video)

##### Developer documentation

[Responding to the launch of your app](https://developer.apple.com/documentation/uikit/responding-to-the-launch-of-your-app) — UIKit

[Multitasking on iPad, Mac, and Apple Vision Pro](https://developer.apple.com/documentation/uikit/multitasking-on-ipad-mac-and-apple-vision-pro) — UIKit

##### Videos

- [Elevate the design of your iPad app](https://developer.apple.com/videos/play/wwdc2025/208)
- [Make your UIKit app more flexible](https://developer.apple.com/videos/play/wwdc2025/282)

### Change log

| Date | Changes |
|---|---|
| June 9, 2025 | Reorganized guidance in platform considerations, and added guidance for multitasking with multiple windows in iPadOS. |
| December 5, 2023 | Added artwork for primary and auxiliary windows in iPadOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |
