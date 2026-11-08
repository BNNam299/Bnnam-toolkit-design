<!-- Source: https://developer.apple.com/design/human-interface-guidelines/gauges · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/gauges.md @ 3c0e291 · Platform considerations removed for: macOS (iOS / iPadOS only) -->

# Gauges

A gauge displays a specific numerical value within a range of values.

*[hình: A stylized representation of a circular numeric gauge above a linear percentage gauge. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

In addition to indicating the current value in a range, a gauge can provide more context about the range itself. For example, a temperature gauge can use text to identify the highest and lowest temperatures in the range and display a spectrum of colors that visually reinforce the changing values.

### Anatomy

A gauge uses a circular or linear path to represent a range of values, mapping the current value to a specific point on the path. A standard gauge displays an indicator that shows the current value’s location; a gauge that uses the capacity style displays a fill that stops at the value’s location on the path.

Circular and linear gauges in both standard and capacity styles are also available in a variant that’s visually similar to watchOS complications. This variant — called accessory — works well in iOS Lock Screen widgets and anywhere you want to echo the appearance of complications.

> **Note:** In addition to gauges, macOS also supports level indicators, some of which have visual styles that are similar to gauges. For guidance, see [macOS](https://developer.apple.com/design/human-interface-guidelines/gauges#macOS).

### Best practices

**Write succinct labels that describe the current value and both endpoints of the range.** Although not every gauge style displays all labels, VoiceOver reads the visible labels to help people understand the gauge without seeing the screen.

**Consider filling the path with a gradient to help communicate the purpose of the gauge.** For example, a temperature gauge might use colors that range from red to blue to represent temperatures that range from hot to cold.

### Platform considerations

*No additional considerations for iOS, iPadOS, visionOS, or watchOS. Not supported in tvOS.*

### Resources

##### Related

[Ratings and reviews](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews)

##### Developer documentation

[Gauge](https://developer.apple.com/documentation/swiftui/gauge) — SwiftUI

[NSLevelIndicator](https://developer.apple.com/documentation/appkit/nslevelindicator) — AppKit

### Change log

| Date | Changes |
|---|---|
| September 23, 2022 | New page. |
