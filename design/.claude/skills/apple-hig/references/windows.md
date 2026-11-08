<!-- Source: https://developer.apple.com/design/human-interface-guidelines/windows · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/windows.md @ 3c0e291 · Platform considerations removed for: macOS, visionOS (iOS / iPadOS only) -->

# Windows

A window presents UI views and components in your app or game.

*[hình: A stylized representation of a window with close, minimize, and full-screen buttons. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

In iPadOS, macOS, and visionOS, windows help define the visual boundaries of app content and separate it from other areas of the system, and enable multitasking workflows both within and between apps. Windows include system-provided interface elements such as frames and window controls that let people open, close, resize, and relocate them.

Conceptually, apps use two types of windows to display content:

- A *primary* window presents the main navigation and content of an app, and actions associated with them.
- An *auxiliary* window presents a specific task or area in an app. Dedicated to one experience, an auxiliary window doesn’t allow navigation to other app areas, and it typically includes a button people use to close it after completing the task.

For guidance laying out content within a window on any platform, see [Layout](https://developer.apple.com/design/human-interface-guidelines/layout); for guidance laying out content in Apple Vision Pro space, see [Spatial layout](https://developer.apple.com/design/human-interface-guidelines/spatial-layout). For developer guidance, see [Windows](https://developer.apple.com/documentation/swiftui/windows).

### Best practices

**Make sure that your windows adapt fluidly to different sizes to support multitasking and multiwindow workflows.** For guidance, see [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) and [Multitasking](https://developer.apple.com/design/human-interface-guidelines/multitasking).

**Choose the right moment to open a new window.** Opening content in a separate window is great for helping people multitask or preserve context. For example, Mail opens a new window whenever someone selects the Compose action, so both the new message and the existing email are visible at the same time. However, opening new windows excessively creates clutter and can make navigating your app more confusing. Avoid opening new windows as default behavior unless it makes sense for your app.

**Consider providing the option to view content in a new window.** While it’s best to avoid opening new windows as default behavior unless it benefits your user experience, it’s also great to give people the flexibility of viewing content in multiple ways. Consider letting people view content in a new window using a command in a [context menu](https://developer.apple.com/design/human-interface-guidelines/context-menus) or in the [File menu](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar#File-menu). For developer guidance, see [OpenWindowAction](https://developer.apple.com/documentation/swiftui/openwindowaction).

**Avoid creating custom window UI.** System-provided windows look and behave in a way that people understand and recognize. Avoid making custom window frames or controls, and don’t try to replicate the system-provided appearance. Doing so without perfectly matching the system’s look and behavior can make your app feel broken.

**Use the term *window* in user-facing content.** The system refers to app windows as *windows* regardless of type. Using different terms — including *scene*, which refers to window implementation — is likely to confuse people.

### Platform considerations

*Not supported in iOS, tvOS, or watchOS.*

#### iPadOS

Windows present in one of two ways depending on a person’s choice in Multitasking & Gestures settings.

- **Full screen.** App windows fill the entire screen, and people switch between them — or between multiple windows of the same app — using the app switcher.
- **Windowed.** People can freely resize app windows. Multiple windows can be onscreen at once, and people can reposition them and bring them to the front. The system remembers window size and placement even when an app is closed.

**Full screen**
*[hình: A screenshot of the Notes app in full screen on iPad, with an open document titled Nature Walks. The app interface fills the entire screen, with no visible border to the window.]*

**Windowed**
*[hình: A screenshot of the Notes app  in a window on iPad, with an open document titled Nature Walks. The document window occupies the center of the screen, with the Home Screen background filling the rest of the screen behind it, and the Dock at the bottom.]*

**Make sure window controls don’t overlap toolbar items.** When windowed, app windows include window controls at the leading edge of the toolbar. If your app has toolbar buttons at the leading edge, they might be hidden by window controls when they appear. To prevent this, instead of placing buttons directly on the leading edge, move them inward when the window controls appear.

**Consider letting people use a gesture to open content in a new window.** For example, people can use the pinch gesture to expand a Notes item into a new window. For developer guidance, see [collectionView(_:sceneActivationConfigurationForItemAt:point:)](https://developer.apple.com/documentation/uikit/uicollectionviewdelegate/collectionview(_:sceneactivationconfigurationforitemat:point:)) (to transition from a collection view item), or [UIWindowScene.ActivationInteraction](https://developer.apple.com/documentation/uikit/uiwindowscene/activationinteraction) (to transition from an item in any other view).

> **Tip:** If you only need to let people view one file, you can present it without creating your own window, but you must support multiple windows in your app. For developer guidance, see [QLPreviewSceneActivationConfiguration](https://developer.apple.com/documentation/quicklook/qlpreviewsceneactivationconfiguration).

### Resources

##### Related

[Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

[Split views](https://developer.apple.com/design/human-interface-guidelines/split-views)

[Multitasking](https://developer.apple.com/design/human-interface-guidelines/multitasking)

##### Developer documentation

[Windows](https://developer.apple.com/documentation/swiftui/windows) — SwiftUI

[WindowGroup](https://developer.apple.com/documentation/swiftui/windowgroup) — SwiftUI

[UIWindow](https://developer.apple.com/documentation/uikit/uiwindow) — UIKit

[NSWindow](https://developer.apple.com/documentation/appkit/nswindow) — AppKit

##### Videos

- [Elevate the design of your iPad app](https://developer.apple.com/videos/play/wwdc2025/208)

### Change log

| Date | Changes |
|---|---|
| June 9, 2025 | Added best practices, and updated with guidance for resizable windows in iPadOS. |
| June 10, 2024 | Updated to include guidance for using volumes in visionOS 2 and added game-specific examples. |
| June 21, 2023 | Updated to include guidance for visionOS. |
