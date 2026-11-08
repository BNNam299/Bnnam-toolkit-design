<!-- Source: https://developer.apple.com/design/human-interface-guidelines/sliders · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/sliders.md @ 3c0e291 · Platform considerations removed for: macOS, visionOS, watchOS (iOS / iPadOS only) -->

# Sliders

A slider is a horizontal track with a control, called a thumb, that people can adjust between a minimum and maximum value.

*[hình: A stylized representation of a brightness slider. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

As a slider’s value changes, the portion of track between the minimum value and the thumb fills with color. A slider can optionally display left and right icons that illustrate the meaning of the minimum and maximum values.

### Best practices

**Customize a slider’s appearance if it adds value.** You can adjust a slider’s appearance — including track color, thumb image and tint color, and left and right icons — to blend with your app’s design and communicate intent. A slider that adjusts image size, for example, could show a small image icon on the left and a large image icon on the right.

**Use familiar slider directions.** People expect the minimum and maximum sides of sliders to be consistent in all apps, with minimum values on the leading side and maximum values on the trailing side (for horizontal sliders) and minimum values at the bottom and maximum values at the top (for vertical sliders). For example, people expect to be able to move a horizontal slider that represents a percentage from 0 percent on the leading side to 100 percent on the trailing side.

**Consider supplementing a slider with a corresponding text field and stepper.** Especially when a slider represents a wide range of values, people may appreciate seeing the exact slider value and having the ability to enter a specific value in a text field. Adding a stepper provides a convenient way for people to increment in whole values. For related guidance, see [Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) and [Steppers](https://developer.apple.com/design/human-interface-guidelines/steppers).

*[hình: An illustration of a horizontal linear slider without tick marks, followed by a text field and a stepper. The thumb is in the center of the slider and the text field displays 50%.]*

### Platform considerations

*Not supported in tvOS.*

#### iOS, iPadOS

**Don’t use a slider to adjust audio volume.** If you need to provide volume control in your app, use a volume view, which is customizable and includes a volume-level slider and a control for changing the active audio output device. For guidance, see [Playing audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio).

### Resources

##### Related

[Steppers](https://developer.apple.com/design/human-interface-guidelines/steppers)

[Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)

##### Developer documentation

[Slider](https://developer.apple.com/documentation/swiftui/slider) — SwiftUI

[UISlider](https://developer.apple.com/documentation/uikit/uislider) — UIKit

[NSSlider](https://developer.apple.com/documentation/appkit/nsslider) — AppKit

### Change log

| Date | Changes |
|---|---|
| June 21, 2023 | Updated to include guidance for visionOS. |
