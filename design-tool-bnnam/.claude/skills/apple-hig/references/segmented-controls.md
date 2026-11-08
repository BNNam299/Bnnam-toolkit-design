<!-- Source: https://developer.apple.com/design/human-interface-guidelines/segmented-controls · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/segmented-controls.md @ 3c0e291 · Platform considerations removed for: macOS, tvOS, visionOS (iOS / iPadOS only) -->

# Segmented controls

A segmented control is a linear set of two or more segments, each of which functions as a button.

*[hình: A stylized representation of a selected segment in a segmented control. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

Within a segmented control, all segments are usually equal in width. Like [buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), segments can contain text or images. Segments can also have text labels beneath them (or beneath the control as a whole).

A segmented control offers a single choice from among a set of options, or in macOS, either a single choice or multiple choices. For example, in macOS Keynote people can select only one segment in the alignment options control to align selected text. In contrast, people can choose multiple segments in the font attributes control to combine styles like bold, italics, and underline. The toolbar of a Keynote window also uses a segmented control to let people show and hide various editing panes within the main window area.

*[hình: A partial screenshot of a segmented control that consists of four text-alignment options. The center alignment option is selected.]*

*[hình: A partial screenshot of a segmented control that consists of four font types. Three of the four options are selected.]*

In addition to representing the state of a single or multiple-choice selection, a segmented control can function as a set of buttons that perform actions without showing a selection state. For example, the Reply, Reply all, and Forward buttons in macOS Mail. For developer guidance, see [isMomentary](https://developer.apple.com/documentation/uikit/uisegmentedcontrol/ismomentary) and [NSSegmentedControl.SwitchTracking.momentary](https://developer.apple.com/documentation/appkit/nssegmentedcontrol/switchtracking/momentary).

### Best practices

**Use a segmented control to provide closely related choices that affect an object, state, or view.** For example, a segmented control in an inspector could let people choose one or more attributes to apply to a selection, or a segmented control in a toolbar could offer a set of actions to perform on the current view.

*[hình: A screenshot of the top half of the Activity screen in the iOS Health app, showing graphs of Move and Exercise activity. The segmented control above the graphs has D selected, indicating that the graphs show one day of activity.]*

**Consider a segmented control when it’s important to group functions together, or to clearly show their selection state.** Unlike other button styles, segmented controls preserve their grouping regardless of the view size or where they appear. This grouping can also help people understand at a glance which controls are currently selected.

**Keep control types consistent within a single segmented control.** Don’t assign actions to segments in a control that otherwise represents selection state, and don’t show a selection state for segments in a control that otherwise performs actions.

**Limit the number of segments in a control.** Too many segments can be hard to parse and time-consuming to navigate. Aim for no more than about five to seven segments in a wide interface and no more than about five segments on iPhone.

**In general, keep segment size consistent.** When all segments have equal width, a segmented control feels balanced. To the extent possible, it’s best to keep icon and title widths consistent too.

### Content

**Prefer using either text or images — not a mix of both — in a single segmented control.** Although individual segments can contain text labels or images, mixing the two in a single control can lead to a disconnected and confusing interface.

**As much as possible, use content with a similar size in each segment.** Because all segments typically have equal width, it doesn’t look good if content fills some segments but not others.

**Use nouns or noun phrases for segment labels.** Write text that describes each segment and uses [title-style capitalization](https://support.apple.com/guide/applestyleguide/c-apsgb744e4a3/web#apdca93e113f1d64). A segmented control that displays text labels doesn’t need introductory text.

### Platform considerations

*Not supported in watchOS.*

#### iOS, iPadOS

**Consider a segmented control to switch between closely related subviews.** A segmented control can be useful as a way to quickly switch between related subviews. For example, the segmented control in Calendar’s New Event sheet switches between the subviews for creating a new event and a new reminder. For switching between completely separate sections of an app, use a [tab bar](https://developer.apple.com/design/human-interface-guidelines/tab-bars) instead.

*[hình: A screenshot of the top half of the iOS Calendar app, showing the New Event sheet. A segmented control provides the ability to switch between adding a new event and a new reminder.]*

### Resources

##### Related

[Split views](https://developer.apple.com/design/human-interface-guidelines/split-views)

##### Developer documentation

[segmented](https://developer.apple.com/documentation/swiftui/pickerstyle/segmented) — SwiftUI

[UISegmentedControl](https://developer.apple.com/documentation/uikit/uisegmentedcontrol) — UIKit

[NSSegmentedControl](https://developer.apple.com/documentation/appkit/nssegmentedcontrol) — AppKit

### Change log

| Date | Changes |
|---|---|
| June 21, 2023 | Updated to include guidance for visionOS. |
