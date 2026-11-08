<!-- Source: https://developer.apple.com/design/human-interface-guidelines/toggles · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/toggles.md @ 3c0e291 · Platform considerations removed for: macOS (iOS / iPadOS only) -->

# Toggles

A toggle lets people choose between a pair of opposing states, like on and off, using a different appearance to indicate each state.

*[hình: A stylized representation of two labeled switch controls. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

A toggle can have various styles, such as switch and checkbox, and different platforms can use these styles in different ways. For guidance, see [Platform considerations](https://developer.apple.com/design/human-interface-guidelines/toggles#Platform-considerations).

In addition to toggles, all platforms also support buttons that behave like toggles by using a different appearance for each state. For developer guidance, see [ToggleStyle](https://developer.apple.com/documentation/swiftui/togglestyle).

### Best practices

**Use a toggle to help people choose between two opposing values that affect the state of content or a view.** A toggle always lets people manage the state of something, so if you need to support other types of actions — such as choosing from a list of items — use a different component, like a [pop-up button](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons).

**Clearly identify the setting, view, or content the toggle affects.** In general, the surrounding context provides enough information for people to understand what they’re turning on or off. In some cases, often in macOS apps, you can also supply a label to describe the state the toggle controls. If you use a button that behaves like a toggle, you generally use an interface icon that communicates its purpose, and you update its appearance — typically by changing the background — based on the current state.

**Make sure the visual differences in a toggle’s state are obvious.** For example, you might add or remove a color fill, show or hide the background shape, or change the inner details you display — like a checkmark or dot — to show that a toggle is on or off. Avoid relying solely on different colors to communicate state, because not everyone can perceive the differences.

### Platform considerations

*No additional considerations for tvOS, visionOS, or watchOS.*

#### iOS, iPadOS

**Use the switch toggle style only in a list row.** You don’t need to supply a label in this situation because the content in the row provides the context for the state the switch controls.

**Change the default color of a switch only if necessary.** The default green color tends to work well in most cases, but you might want to use your app’s accent color instead. Be sure to use a color that provides enough contrast with the uncolored appearance to be perceptible.

*[hình: An illustration of two list rows, one with an active switch toggle and one with an inactive switch toggle. The active toggle is tinted green with the standard switch color.]*

*[hình: An illustration of two list rows, one with an active switch toggle and one with an inactive switch toggle. The active toggle is tinted purple with a custom switch color.]*

**Outside of a list, use a button that behaves like a toggle, not a switch.** For example, the Phone app uses a toggle on the filter button to let users filter their recent calls.  The app adds a blue highlight to indicate when the toggle is active, and removes it when the toggle is inactive.

*[hình: A screenshot of the top half of the Phone app on iPhone, showing the filtered list of recent missed calls. The filter button in the top trailing corner has a blue highlight, indicating that the toggle is active.]*

*[hình: A screenshot of the top half of the Phone app on iPhone, showing all recent calls. The filter button in the top trailing corner has no highlight, indicating that the toggle is inactive.]*

**Avoid supplying a label that explains the button’s purpose.** The interface icon you create — combined with the alternative background appearances you supply — help people understand what the button does. For developer guidance, see [changesSelectionAsPrimaryAction](https://developer.apple.com/documentation/uikit/uibutton/changesselectionasprimaryaction).

### Resources

##### Related

[Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

##### Developer documentation

[Toggle](https://developer.apple.com/documentation/swiftui/toggle) — SwiftUI

[UISwitch](https://developer.apple.com/documentation/uikit/uiswitch) — UIKit

[NSButton.ButtonType.toggle](https://developer.apple.com/documentation/appkit/nsbutton/buttontype/toggle) — AppKit

[NSSwitch](https://developer.apple.com/documentation/appkit/nsswitch) — AppKit

### Change log

| Date | Changes |
|---|---|
| March 29, 2024 | Enhanced guidance for using switches in macOS apps, clarified when a checkbox has a title, and added artwork for radio buttons. |
| September 12, 2023 | Updated artwork. |
