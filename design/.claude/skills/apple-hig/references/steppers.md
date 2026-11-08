<!-- Source: https://developer.apple.com/design/human-interface-guidelines/steppers · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/steppers.md @ 3c0e291 · Platform considerations removed for: macOS (iOS / iPadOS only) -->

# Steppers

A stepper is a two-segment control that people use to increase or decrease an incremental value.

*[hình: A stylized representation of a stepper control. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

A stepper sits next to a field that displays its current value, because the stepper itself doesn’t display a value.

### Best practices

**Make the value that a stepper affects obvious.** A stepper itself doesn’t display any values, so make sure people know which value they’re changing when they use a stepper.

**Consider pairing a stepper with a text field when large value changes are likely.** Steppers work well by themselves for making small changes that require a few taps or clicks. By contrast, people appreciate the option to use a field to enter specific values, especially when the values they use can vary widely. On a printing screen, for example, it can help to have both a stepper and a text field to set the number of copies.

### Platform considerations

*No additional considerations for iOS, iPadOS, or visionOS. Not supported in watchOS or tvOS.*

### Resources

##### Related

[Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)

[Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields)

##### Developer documentation

[UIStepper](https://developer.apple.com/documentation/uikit/uistepper) — UIKit

[NSStepper](https://developer.apple.com/documentation/appkit/nsstepper) — AppKit
