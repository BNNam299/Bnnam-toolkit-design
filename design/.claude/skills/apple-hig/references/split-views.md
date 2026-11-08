<!-- Source: https://developer.apple.com/design/human-interface-guidelines/split-views · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/split-views.md @ 3c0e291 · Platform considerations removed for: macOS, tvOS, visionOS, watchOS (iOS / iPadOS only) -->

# Split views

A split view manages the presentation of multiple adjacent panes of content, each of which can contain a variety of components, including tables, collections, images, and custom views.

*[hình: A stylized representation of a window consisting of three areas: a sidebar, a canvas, and an inspector. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

Typically, you use a split view to show multiple levels of your app’s hierarchy at once and support navigation between them. In this scenario, selecting an item in the view’s primary pane displays the item’s contents in the secondary pane. Similarly, a split view can display a tertiary pane if items in the secondary pane contain additional content.

It’s common to use a split view to display a [sidebar](https://developer.apple.com/design/human-interface-guidelines/sidebars) for navigation, where the leading pane lists the top-level items or collections in an app, and the secondary and optional tertiary panes can present child collections and item details. Rarely, you might also use a split view to provide groups of functionality that supplement the primary view — for example, Keynote in macOS uses split view panes to present the slide navigator, the presenter notes, and the inspector pane in areas that surround the main slide canvas.

### Best practices

**To support navigation, persistently highlight the current selection in each pane that leads to the detail view.** The selected appearance clarifies the relationship between the content in various panes and helps people stay oriented.

**Consider letting people drag and drop content between panes.** Because a split view provides access to multiple levels of hierarchy, people can conveniently move content from one part of your app to another by dragging items to different panes. For guidance, see [Drag and drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop).

### Platform considerations

#### iOS

**Prefer using a split view in a regular — not a compact — environment.** A split view needs horizontal space in which to display multiple panes. In a compact environment, such as iPhone in portrait orientation, it’s difficult to display multiple panes without wrapping or truncating the content, making it less legible and harder to interact with.

#### iPadOS

In iPadOS, a split view can include either two vertical panes, like Mail, or three vertical panes, like Keynote.

**Account for narrow, compact, and intermediate window widths.** Since iPad windows are fluidly resizable, it’s important to consider the design of a split view layout at multiple widths. In particular, ensure that it’s possible to navigate between the various panes in a logical way. For guidance, see [Layout](https://developer.apple.com/design/human-interface-guidelines/layout). For developer guidance, see [NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview) and [UISplitViewController](https://developer.apple.com/documentation/uikit/uisplitviewcontroller).

### Resources

##### Related

[Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)

[Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)

[Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

##### Developer documentation

[NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview) — SwiftUI

[UISplitViewController](https://developer.apple.com/documentation/uikit/uisplitviewcontroller) — UIKit

[NSSplitViewController](https://developer.apple.com/documentation/appkit/nssplitviewcontroller) — AppKit

##### Videos

- [Make your UIKit app more flexible](https://developer.apple.com/videos/play/wwdc2025/282)

### Change log

| Date | Changes |
|---|---|
| June 9, 2025 | Added iOS and iPadOS platform considerations. |
| December 5, 2023 | Added guidance for split views in visionOS. |
| June 5, 2023 | Added guidance for split views in watchOS. |
