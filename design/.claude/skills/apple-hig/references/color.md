<!-- Source: https://developer.apple.com/design/human-interface-guidelines/color · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/color.md @ 3c0e291 · Platform considerations removed for: macOS, tvOS, visionOS, watchOS (iOS / iPadOS only) -->

# Color

Judicious use of color can enhance communication, evoke your brand, provide visual continuity, communicate status and feedback, and help people understand information.

*[hình: A sketch of a paint palette, suggesting the use of color. The image is overlaid with rectangular and circular grid lines and is tinted yellow to subtly reflect the yellow in the original six-color Apple logo.]*

The system defines colors that look good on various backgrounds and appearance modes, and can automatically adapt to vibrancy and accessibility settings. Using system colors is a convenient way to make your experience feel at home on the device.

You may also want to use custom colors to enhance the visual experience of your app or game and express its unique personality. The following guidelines can help you use color in ways that people appreciate, regardless of whether you use system-defined or custom colors.

### Best practices

**Avoid using the same color to mean different things.** Use color consistently throughout your interface, especially when you use it to help communicate information like status or interactivity. For example, if you use your brand color to indicate that a borderless button is interactive, using the same or similar color to stylize noninteractive text is confusing.

**Make sure all your app’s colors work well in light, dark, and increased contrast contexts.** iOS, iPadOS, macOS, and tvOS offer both light and [dark](https://developer.apple.com/design/human-interface-guidelines/dark-mode) appearance settings. [System colors](https://developer.apple.com/design/human-interface-guidelines/color#System-colors) vary subtly depending on the system appearance, adjusting to ensure proper color differentiation and contrast for text, symbols, and other elements. With the Increase Contrast setting turned on, the color differences become far more apparent. When possible, use system colors, which already define variants for all these contexts. If you define a custom color, make sure to supply light and dark variants, and an increased contrast option for each variant that provides a significantly higher amount of visual differentiation. Even if your app ships in a single appearance mode, provide both light and dark colors to support Liquid Glass adaptivity in these contexts.

*[hình: A screenshot of the Notes app in iOS with the light system appearance and default contrast. The Notes app is open to a note with the text 'Note'. The text is selected, which shows a yellow selection highlight and text editing menu. The Done button appears in the upper-right corner. The Liquid Glass background of the button is yellow, and its label, which shows a checkmark, is white. The shade of yellow is vibrant.]*

*[hình: A screenshot of the Notes app in iOS with the light system appearance and increased contrast. The Notes app is open to a note with the text 'Note'. The text is selected, which shows a yellow selection highlight and text editing menu. The Done button appears in the upper-right corner. The Liquid Glass background of the button is yellow, and its label, which shows a checkmark, is black. The shade of yellow is darker to provide more contrast and differentiation against the note's white background.]*

*[hình: A screenshot of the Notes app in iOS with the dark system appearance and default contrast. The Notes app is open to a note with the text 'Note'. The text is selected, which shows a yellow selection highlight and text editing menu. The Done button appears in the upper-right corner. The Liquid Glass background of the button is yellow, and its label, which shows a checkmark, is white.]*

*[hình: A screenshot of the Notes app in iOS with the dark system appearance and increased contrast. The Notes app is open to a note with the text 'Note'. The text is selected, which shows a yellow selection highlight and text editing menu. The Done button appears in the upper-right corner. The Liquid Glass background of the button is yellow, and its label, which shows a checkmark, is black.]*

**Test your app’s color scheme under a variety of lighting conditions.** Colors can look different when you view your app outside on a sunny day or in dim light. In bright surroundings, colors look darker and more muted. In dark environments, colors appear bright and saturated. In visionOS, colors can look different depending on the colors of a wall or object in a person’s physical surroundings and how it reflects light. Adjust app colors to provide an optimal viewing experience in the majority of use cases.

**Test your app on different devices.** For example, the True Tone display — available on certain iPhone, iPad, and Mac models — uses ambient light sensors to automatically adjust the white point of the display to adapt to the lighting conditions of the current environment. Apps that primarily support reading, photos, video, and gaming can strengthen or weaken this effect by specifying a white point adaptivity style (for developer guidance, see [UIWhitePointAdaptivityStyle](https://developer.apple.com/documentation/bundleresources/information-property-list/uiwhitepointadaptivitystyle)). Test tvOS apps on multiple brands of HD and 4K TVs, and with different display settings. You can also test the appearance of your app using different color profiles on a Mac — such as P3 and Standard RGB (sRGB) — by choosing a profile in System Settings > Displays. For guidance, see [Color management](https://developer.apple.com/design/human-interface-guidelines/color#Color-management).

**Consider how artwork and translucency affect nearby colors.** Variations in artwork sometimes warrant changes to nearby colors to maintain visual continuity and prevent interface elements from becoming overpowering or underwhelming. Maps, for example, displays a light color scheme when in map mode but switches to a dark color scheme when in satellite mode. Colors can also appear different when placed behind or applied to a translucent element like a toolbar.

**If your app lets people choose colors, prefer system-provided color controls where available.** Using built-in color pickers provides a consistent user experience, in addition to letting people save a set of colors they can access from any app. For developer guidance, see [ColorPicker](https://developer.apple.com/documentation/swiftui/colorpicker).

### Inclusive color

**Avoid relying solely on color to differentiate between objects, indicate interactivity, or communicate essential information.** When you use color to convey information, be sure to provide the same information in alternative ways so people with color blindness or other visual disabilities can understand it. For example, you can use text labels or glyph shapes to identify objects or states.

**Avoid using colors that make it hard to perceive content in your app.** For example,  insufficient contrast can cause icons and text to blend with the background and make content hard to read, and people who are color blind might not be able to distinguish some color combinations. For guidance, see [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility).

**Consider how the colors you use might be perceived in other countries and cultures.** For example, red communicates danger in some cultures, but has positive connotations in other cultures. Make sure the colors in your app send the message you intend.

*[hình: An illustration of an upward-trending stock chart in the Stocks app in English. The line of the graph is green to indicate the rising value of the stock during the selected time period.]*

*[hình: An illustration of an upward-trending stock chart in the Stocks app in Chinese. The line of the graph is red to indicate the rising value of the stock during the selected time period.]*

### System colors

**Avoid hard-coding system color values in your app.** Documented color values are for your reference during the app design process. The actual color values may fluctuate from release to release, based on a variety of environmental variables. Use APIs like [Color](https://developer.apple.com/documentation/swiftui/color) to apply system colors.

iOS, iPadOS, macOS, and visionOS also define sets of *dynamic system colors* that match the color schemes of standard UI components and automatically adapt to both light and dark contexts. Each dynamic color is semantically defined by its purpose, rather than its appearance or color values. For example, some colors represent view backgrounds at different levels of hierarchy and other colors represent foreground content, such as labels, links, and separators.

**Avoid redefining the semantic meanings of dynamic system colors.** To ensure a consistent experience and ensure your interface looks great when the appearance of the platform changes, use dynamic system colors as intended. For example, don’t use the [separator](https://developer.apple.com/documentation/uikit/uicolor/separator) color as a text color, or [secondary text label](https://developer.apple.com/documentation/uikit/uicolor/secondarylabel) color as a background color.

### Liquid Glass color

By default, [Liquid Glass](https://developer.apple.com/design/human-interface-guidelines/materials#Liquid-Glass) has no inherent color, and instead takes on colors from the content directly behind it. You can apply color to some Liquid Glass elements, giving them the appearance of colored or stained glass. This is useful for drawing emphasis to a specific control, like a primary call to action, and is the approach the system uses for prominent button styling. Symbols or text labels on Liquid Glass controls can also have color.

*[hình: A screenshot of the Done button in iOS, which appears as a checkmark on a blue Liquid Glass background.]*

*[hình: A screenshot of a tab bar in iOS, with the first tab selected. The symbol and text label of the selected tab bar item are blue.]*

*[hình: A screenshot of the Share button in iOS over a colorful image. The colors from the background image infuse the Liquid Glass in the button, affecting its color.]*

For smaller elements like toolbars and tab bars, the system can adapt Liquid Glass between a light and dark appearance in response to the underlying content. By default, symbols and text on these elements follow a monochromatic color scheme, becoming darker when the underlying content is light, and lighter when it’s dark. Liquid Glass appears more opaque in larger elements like sidebars to preserve legibility over complex backgrounds and accommodate richer content on the material’s surface.

**Apply color sparingly to the Liquid Glass material, and to symbols or text on the material.** If you apply color, reserve it for elements that truly benefit from emphasis, such as status indicators or primary actions. To emphasize primary actions, apply color to the background rather than to symbols or text. For example, the system applies the app accent color to the background in prominent buttons — such as the Done button — to draw attention and elevate their visual prominence. Refrain from adding color to the background of multiple controls.

*[hình: A screenshot of the top half of an iPhone app that shows a toolbar with several buttons. All of the buttons in the toolbar use a blue accent color for their Liquid Glass background.]*

*[hình: An X in a circle to indicate incorrect usage.]*

*[hình: A screenshot of the top half of an iPhone app that shows a toolbar with several buttons. Only the Done button in the toolbar uses a blue accent color for its Liquid Glass background.]*

*[hình: A checkmark in a circle to indicate correct usage.]*

**Avoid using similar colors in control labels if your app has a colorful background.** While color can make apps more visually appealing, playful, or reflective of your brand, too much color can be overwhelming and make control labels more difficult to read. If your app features colorful backgrounds or visually rich content, prefer a monochromatic appearance for toolbars and tab bars, or choose an accent color with sufficient visual differentiation. By contrast, in apps with primarily monochromatic content or backgrounds, choosing your brand color as the app accent color can be an effective way to tailor your app experience and reflect your company’s identity.

**Be aware of the placement of color in the content layer.** Make sure your interface maintains sufficient contrast by avoiding overlap of similar colors in the content layer and controls when possible. Although colorful content might intermittently scroll underneath controls, make sure its default or resting state — like the top of a screen of scrollable content — maintains clear legibility.

### Color management

A *color space* represents the colors in a *color model* like RGB or CMYK. Common color spaces — sometimes called *gamuts* — are sRGB and Display P3.

*[hình: Diagram showing the colors included in the sRGB space, compared to the larger number of colors included in the P3 color space.]*

A *color profile* describes the colors in a color space using, for example, mathematical formulas or tables of data that map colors to numerical representations. An image embeds its color profile so that a device can interpret the image’s colors correctly and reproduce them on a display.

**Apply color profiles to your images.** Color profiles help ensure that your app’s colors appear as intended on different displays. The sRGB color space produces accurate colors on most displays.

**Use wide color to enhance the visual experience on compatible displays.** Wide color displays support a P3 color space, which can produce richer, more saturated colors than sRGB. As a result, photos and videos that use wide color are more lifelike, and visual data and status indicators that use wide color can be more meaningful. When appropriate, use the Display P3 color profile at 16 bits per pixel (per channel) and export images in PNG format. Note that you need to use a wide color display to design wide color images and select P3 colors.

**Provide color space–specific image and color variations if necessary.** In general, P3 colors and images appear fine on sRGB displays. Occasionally, it may be hard to distinguish two very similar P3 colors when viewing them on an sRGB display. Gradients that use P3 colors can also sometimes appear clipped on sRGB displays. To avoid these issues and to ensure visual fidelity on both wide color and sRGB displays, you can use the asset catalog of your Xcode project to provide different versions of images and colors for each color space.

### Platform considerations

#### iOS, iPadOS

iOS defines two sets of dynamic background colors — *system* and *grouped* — each of which contains primary, secondary, and tertiary variants that help you convey a hierarchy of information. In general, use the grouped background colors ([systemGroupedBackground](https://developer.apple.com/documentation/uikit/uicolor/systemgroupedbackground), [secondarySystemGroupedBackground](https://developer.apple.com/documentation/uikit/uicolor/secondarysystemgroupedbackground), and [tertiarySystemGroupedBackground](https://developer.apple.com/documentation/uikit/uicolor/tertiarysystemgroupedbackground)) when you have a grouped table view; otherwise, use the system set of background colors ([systemBackground](https://developer.apple.com/documentation/uikit/uicolor/systembackground), [secondarySystemBackground](https://developer.apple.com/documentation/uikit/uicolor/secondarysystembackground), and [tertiarySystemBackground](https://developer.apple.com/documentation/uikit/uicolor/tertiarysystembackground)).

With both sets of background colors, you generally use the variants to indicate hierarchy in the following ways:

- Primary for the overall view
- Secondary for grouping content or elements within the overall view
- Tertiary for grouping content or elements within secondary elements

For foreground content, iOS defines the following dynamic colors:

| Color | Use for… | UIKit API |
|---|---|---|
| Label | A text label that contains primary content. | [label](https://developer.apple.com/documentation/uikit/uicolor/label) |
| Secondary label | A text label that contains secondary content. | [secondaryLabel](https://developer.apple.com/documentation/uikit/uicolor/secondarylabel) |
| Tertiary label | A text label that contains tertiary content. | [tertiaryLabel](https://developer.apple.com/documentation/uikit/uicolor/tertiarylabel) |
| Quaternary label | A text label that contains quaternary content. | [quaternaryLabel](https://developer.apple.com/documentation/uikit/uicolor/quaternarylabel) |
| Placeholder text | Placeholder text in controls or text views. | [placeholderText](https://developer.apple.com/documentation/uikit/uicolor/placeholdertext) |
| Separator | A separator that allows some underlying content to be visible. | [separator](https://developer.apple.com/documentation/uikit/uicolor/separator) |
| Opaque separator | A separator that doesn’t allow any underlying content to be visible. | [opaqueSeparator](https://developer.apple.com/documentation/uikit/uicolor/opaqueseparator) |
| Link | Text that functions as a link. | [link](https://developer.apple.com/documentation/uikit/uicolor/link) |

### Specifications

#### System colors

| Name | SwiftUI API | Default (light) | Default (dark) | Increased contrast (light) | Increased contrast (dark) |
|---|---|---|---|---|---|
| Red | [red](https://developer.apple.com/documentation/swiftui/color/red) | *[hình: R-255,G-56,B-60]* | *[hình: R-255,G-66,B-69]* | *[hình: R-233,G-21,B-45]* | *[hình: R-255,G-97,B-101]* |
| Orange | [orange](https://developer.apple.com/documentation/swiftui/color/orange) | *[hình: R-255,G-141,B-40]* | *[hình: R-255,G-146,B-48]* | *[hình: R-197,G-83,B-0]* | *[hình: R-255,G-160,B-86]* |
| Yellow | [yellow](https://developer.apple.com/documentation/swiftui/color/yellow) | *[hình: R-255,G-204,B-0]* | *[hình: R-255,G-214,B-0]* | *[hình: R-161,G-106,B-0]* | *[hình: R-254,G-223,B-67]* |
| Green | [green](https://developer.apple.com/documentation/swiftui/color/green) | *[hình: R-52,G-199,B-89]* | *[hình: R-48,G-209,B-88]* | *[hình: R-0,G-137,B-50]* | *[hình: R-74,G-217,B-104]* |
| Mint | [mint](https://developer.apple.com/documentation/swiftui/color/mint) | *[hình: R-0,G-200,B-179]* | *[hình: R-0,G-218,B-195]* | *[hình: R-0,G-133,B-117]* | *[hình: R-84,G-223,B-203]* |
| Teal | [teal](https://developer.apple.com/documentation/swiftui/color/teal) | *[hình: R-0,G-195,B-208]* | *[hình: R-0,G-210,B-224]* | *[hình: R-0,G-129,B-152]* | *[hình: R-59,G-221,B-236]* |
| Cyan | [cyan](https://developer.apple.com/documentation/swiftui/color/cyan) | *[hình: R-0,G-192,B-232]* | *[hình: R-60,G-211,B-254]* | *[hình: R-0,G-126,B-174]* | *[hình: R-109,G-217,B-255]* |
| Blue | [blue](https://developer.apple.com/documentation/swiftui/color/blue) | *[hình: R-0,G-136,B-255]* | *[hình: R-0,G-145,B-255]* | *[hình: R-30,G-110,B-244]* | *[hình: R-92,G-184,B-255]* |
| Indigo | [indigo](https://developer.apple.com/documentation/swiftui/color/indigo) | *[hình: R-97,G-85,B-245]* | *[hình: R-109,G-124,B-255]* | *[hình: R-86,G-74,B-222]* | *[hình: R-167,G-170,B-255]* |
| Purple | [purple](https://developer.apple.com/documentation/swiftui/color/purple) | *[hình: R-203,G-48,B-224]* | *[hình: R-219,G-52,B-242]* | *[hình: R-176,G-47,B-194]* | *[hình: R-234,G-141,B-255]* |
| Pink | [pink](https://developer.apple.com/documentation/swiftui/color/pink) | *[hình: R-255,G-45,B-85]* | *[hình: R-255,G-55,B-95]* | *[hình: R-231,G-18,B-77]* | *[hình: R-255,G-138,B-196]* |
| Brown | [brown](https://developer.apple.com/documentation/swiftui/color/brown) | *[hình: R-172,G-127,B-94]* | *[hình: R-183,G-138,B-102]* | *[hình: R-149,G-109,B-81]* | *[hình: R-219,G-166,B-121]* |

visionOS system colors use the default dark color values.

#### iOS, iPadOS system gray colors

| Name | UIKit API | Default (light) | Default (dark) | Increased contrast (light) | Increased contrast (dark) |
|---|---|---|---|---|---|
| Gray | [systemGray](https://developer.apple.com/documentation/uikit/uicolor/systemgray) | *[hình: R-142,G-142,B-147]* | *[hình: R-142,G-142,B-147]* | *[hình: R-108,G-108,B-112]* | *[hình: R-174,G-174,B-178]* |
| Gray (2) | [systemGray2](https://developer.apple.com/documentation/uikit/uicolor/systemgray2) | *[hình: R-174,G-174,B-178]* | *[hình: R-99,G-99,B-102]* | *[hình: R-142,G-142,B-147]* | *[hình: R-124,G-124,B-128]* |
| Gray (3) | [systemGray3](https://developer.apple.com/documentation/uikit/uicolor/systemgray3) | *[hình: R-199,G-199,B-204]* | *[hình: R-72,G-72,B-74]* | *[hình: R-174,G-174,B-178]* | *[hình: R-84,G-84,B-86]* |
| Gray (4) | [systemGray4](https://developer.apple.com/documentation/uikit/uicolor/systemgray4) | *[hình: R-209,G-209,B-214]* | *[hình: R-58,G-58,B-60]* | *[hình: R-188,G-188,B-192]* | *[hình: R-68,G-68,B-70]* |
| Gray (5) | [systemGray5](https://developer.apple.com/documentation/uikit/uicolor/systemgray5) | *[hình: R-229,G-229,B-234]* | *[hình: R-44,G-44,B-46]* | *[hình: R-216,G-216,B-220]* | *[hình: R-54,G-54,B-56]* |
| Gray (6) | [systemGray6](https://developer.apple.com/documentation/uikit/uicolor/systemgray6) | *[hình: R-242,G-242,B-247]* | *[hình: R-28,G-28,B-30]* | *[hình: R-235,G-235,B-240]* | *[hình: R-36,G-36,B-38]* |

In SwiftUI, the equivalent of `systemGray` is [gray](https://developer.apple.com/documentation/swiftui/color/gray).

### Resources

##### Related

[Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

[Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

[Materials](https://developer.apple.com/design/human-interface-guidelines/materials)

[Apple Design Resources](https://developer.apple.com/design/resources/)

##### Developer documentation

[Color](https://developer.apple.com/documentation/swiftui/color) — SwiftUI

[UIColor](https://developer.apple.com/documentation/uikit/uicolor) — UIKit

[Color](https://developer.apple.com/documentation/appkit/color) — AppKit

##### Videos

- [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219)

### Change log

| Date | Changes |
|---|---|
| December 16, 2025 | Updated guidance for Liquid Glass. |
| June 9, 2025 | Updated system color values, and added guidance for Liquid Glass. |
| February 2, 2024 | Distinguished UIKit and SwiftUI gray colors in iOS and iPadOS, and added guidance for balancing brightness levels in visionOS apps. |
| September 12, 2023 | Enhanced guidance for using background color in watchOS views, and added color swatches for tvOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using background color in watchOS. |
| December 19, 2022 | Corrected RGB values for system mint color (Dark Mode) in iOS and iPadOS. |
