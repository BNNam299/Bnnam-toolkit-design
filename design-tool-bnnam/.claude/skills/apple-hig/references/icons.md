<!-- Source: https://developer.apple.com/design/human-interface-guidelines/icons · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/icons.md @ 3c0e291 · Platform considerations removed for: macOS (iOS / iPadOS only) -->

# Icons

An effective icon is a graphic asset that expresses a single concept in ways people instantly understand.

*[hình: A sketch of the Command key icon. The image is overlaid with rectangular and circular grid lines and is tinted yellow to subtly reflect the yellow in the original six-color Apple logo.]*

Apps and games use a variety of simple icons to help people understand the items, actions, and modes they can choose. Unlike [app icons](https://developer.apple.com/design/human-interface-guidelines/app-icons), which can use rich visual details like shading, texturing, and highlighting to evoke the app’s personality, an *interface icon* typically uses streamlined shapes and touches of color to communicate a straightforward idea.

You can design interface icons — also called *glyphs* — or you can choose symbols from the SF Symbols app, using them as-is or customizing them to suit your needs. Both interface icons and symbols use black and clear colors to define their shapes; the system can apply other colors to the black areas in each image. For guidance, see [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols).

### Best practices

**Create a recognizable, highly simplified design.** Too many details can make an interface icon confusing or unreadable. Strive for a simple, universal design that most people will recognize quickly. In general, icons work best when they use familiar visual metaphors that are directly related to the actions they initiate or content they represent.

**Maintain visual consistency across all interface icons in your app.** Whether you use only custom icons or mix custom and system-provided ones, all interface icons in your app need to use a consistent size, level of detail, stroke thickness (or weight), and perspective. Depending on the visual weight of an icon, you may need to adjust its dimensions to ensure that it appears visually consistent with other icons.

*[hình: Diagram of four glyphs in a row. From the left, the glyphs are a camera, a heart, an envelope, and an alarm clock. Two horizontal dashed lines show the bottom and top boundaries of the row and a horizontal red line shows the midpoint. All four glyphs are solid black; some include interior detail lines in white. Parts of the alarm clock extend above the top dashed line because its lighter visual weight requires greater height to achieve balance with the other glyphs.]*

*[hình: Diagram of the same four glyphs shown above and the same horizontal dashed lines at top and bottom and horizontal red line through the middle. In this diagram, all four glyphs are solid gray; the interior detail lines are black to emphasize that all lines use the same weight.]*

**In general, match the weights of interface icons and adjacent text.** Unless you want to emphasize either the icons or the text, using the same weight for both gives your content a consistent appearance and level of emphasis.

**If necessary, add padding to a custom interface icon to achieve optical alignment.** Some icons — especially asymmetric ones — can look unbalanced when you center them geometrically instead of optically. For example, the download icon shown below has more visual weight on the bottom than on the top, which can make it look too low if it’s geometrically centered.

*[hình: Two images of a white arrow that points down to a white horizontal line segment within a black disk. The image on the right includes two horizontal pink bars — one between the top of the glyph and the top of the disk and the other between the bottom of the glyph and the bottom of the disk — that show the glyph is geometrically centered within the disk.]*

In such cases, you can slightly adjust the position of the icon until it’s optically centered. When you create an asset that includes your adjustments as padding around an interface icon (as shown below on the right), you can optically center the icon by geometrically centering the asset.

*[hình: Two images of a white arrow that points down to a white horizontal line segment within a black disk. The image on the left includes the two horizontal pink bars in the same locations as in the previous illustration, but the glyph has been moved up by a few pixels. The image on the right includes a pink rectangle overlaid on top of the glyph to represent a padding area, which includes the extra pixels below the glyph.]*

Adjustments for optical centering are typically very small, but they can have a big impact on your app’s appearance.

*[hình: Two images of a white arrow that points down to a white horizontal line segment within a black disk. The glyph on the left is geometrically centered and the one on the right is optically centered.]*

**Provide a selected-state version of an interface icon only if necessary.** You don’t need to provide selected and unselected appearances for an icon that’s used in standard system components such as toolbars, tab bars, and buttons. The system updates the visual appearance of the selected state automatically.

*[hình: An image of two toolbar buttons that share a background. The left button shows the Filter icon in a selected state, using a blue tint color for its background. The right button shows the More icon in an unselected state, using the default appearance for toolbar buttons.]*

**Use inclusive images.** Consider how your icons can be understandable and welcoming to everyone. Prefer depicting gender-neutral human figures and avoid images that might be hard to recognize across different cultures or languages. For guidance, see [Inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion).

**Include text in your design only when it’s essential for conveying meaning.** For example, using a character in an interface icon that represents text formatting can be the most direct way to communicate the concept. If you need to display individual characters in your icon, be sure to localize them. If you need to suggest a passage of text, design an abstract representation of it, and include a flipped version of the icon to use when the context is right-to-left. For guidance, see [Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left).

*[hình: A partial screenshot of the SF Symbols app showing the info panel for the character symbol, which looks like the capital letter A. Below the image, the following eight localized versions of the symbol are listed: Latin, Arabic, Hebrew, Hindi, Japanese, Korean, Thai, and Chinese.]*

*[hình: A partial screenshot of the SF Symbols app showing the info panel for the text dot page symbol, which looks like three left-aligned horizontal lines inside a rounded rectangle. Below the image, the left-to-right and right-to-left localized versions are shown.]*

**If you create a custom interface icon, use a vector format like PDF or SVG.** The system automatically scales a vector-based interface icon for high-resolution displays, so you don’t need to provide high-resolution versions of it. In contrast, PNG — used for app icons and other images that include effects like shading, textures, and highlighting — doesn’t support scaling, so you have to supply multiple versions for each PNG-based interface icon. Alternatively, you can create a custom SF Symbol and specify a scale that ensures the symbol’s emphasis matches adjacent text. For guidance, see [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols).

**Provide alternative text labels for custom interface icons.** Alternative text labels — or accessibility descriptions — aren’t visible, but they let VoiceOver audibly describe what’s onscreen, simplifying navigation for people with visual disabilities. For guidance, see [VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover).

**Avoid using replicas of Apple hardware products.** Hardware designs tend to change frequently and can make your interface icons and other content appear dated. If you must display Apple hardware, use only the images available in [Apple Design Resources](https://developer.apple.com/design/resources/) or the SF Symbols that represent various Apple products.

### Standard icons

For icons to represent common actions in [menus](https://developer.apple.com/design/human-interface-guidelines/menus), [toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars), [buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), and other places in interfaces across Apple platforms, you can use these [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols).

#### Editing

| Action | Icon | Symbol name |
|---|---|---|
| Cut | *[hình: An icon showing a pair of scissors.]* | `scissors` |
| Copy | *[hình: An icon showing two copies of a document.]* | `document.on.document` |
| Paste | *[hình: An icon showing a document in front of a clipboard.]* | `document.on.clipboard` |
| Done | *[hình: An icon showing a checkmark.]* | `checkmark ` |
| Save |  |  |
| Cancel | *[hình: An icon showing an X.]* | `xmark` |
| Close |  |  |
| Delete | *[hình: An icon showing a trash can.]* | `trash` |
| Undo | *[hình: An icon showing an arrow curving toward the top left.]* | `arrow.uturn.backward` |
| Redo | *[hình: An icon showing an arrow curving toward the top right.]* | `arrow.uturn.forward` |
| Compose | *[hình: An icon showing a pencil positioned over a square.]* | `square.and.pencil` |
| Duplicate | *[hình: An icon showing a square with a plus sign on top of another square.]* | `plus.square.on.square` |
| Rename | *[hình: An icon showing a pencil.]* | `pencil` |
| Move to | *[hình: An icon showing a folder.]* | `folder` |
| Folder |  |  |
| Attach | *[hình: An icon showing a paperclip.]* | `paperclip` |
| Add | *[hình: An icon showing a plus sign.]* | `plus` |
| More | *[hình: An icon showing an ellipsis.]* | `ellipsis` |

#### Selection

| Action | Icon | Symbol name |
|---|---|---|
| Select | *[hình: An icon showing a checkmark in a circle.]* | `checkmark.circle` |
| Deselect | *[hình: An icon showing an X.]* | `xmark` |
| Close |  |  |
| Delete | *[hình: An icon showing a trash can.]* | `trash` |

#### Text formatting

| Action | Icon | Symbol name |
|---|---|---|
| Superscript | *[hình: An icon showing the capital letter A with the number 1 in the upper right corner.]* | `textformat.superscript` |
| Subscript | *[hình: An icon showing the capital letter A with the number 1 in the lower right corner.]* | `textformat.subscript` |
| Bold | *[hình: An icon showing the capital letter B in bold.]* | `bold` |
| Italic | *[hình: An icon showing the capital letter I in italics.]* | `italic` |
| Underline | *[hình: An icon showing the capital letter U with an underline.]* | `underline` |
| ​​Align Left | *[hình: An icon showing a stack of four horizontal lines of varying widths that align at the left edge.]* | `text.alignleft` |
| Center | *[hình: An icon showing a stack of four horizontal lines of varying widths that align in the center.]* | `text.aligncenter` |
| Justified | *[hình: An icon showing a stack of four horizontal lines of identical widths.]* | `text.justify` |
| Align Right | *[hình: An icon showing a stack of four horizontal lines of varying widths that align at the right edge.]* | `text.alignright` |

#### Search

| Action | Icon | Symbol name |
|---|---|---|
| Search | *[hình: An icon showing a magnifying glass.]* | `magnifyingglass` |
| Find | *[hình: An icon showing a magnifying glass above a document.]* | `text.page.badge.magnifyingglass` |
| Find and Replace |  |  |
| Find Next |  |  |
| Find Previous |  |  |
| Use Selection for Find |  |  |
| Filter | *[hình: An icon showing a stack of three horizontal lines decreasing in width from top to bottom.]* | `line.3.horizontal.decrease` |

#### Sharing and exporting

| Action | Icon | Symbol name |
|---|---|---|
| Share | *[hình: An icon showing an arrow pointing up from the middle of square.]* | `square.and.arrow.up` |
| Export |  |  |
| Print | *[hình: An icon showing a printer.]* | `printer` |

#### Users and accounts

| Action | Icon | Symbol name |
|---|---|---|
| Account | *[hình: An icon showing an abstract representation of a person’s head and shoulders in a circular outline.]* | `person.crop.circle` |
| User |  |  |
| Profile |  |  |

#### Ratings

| Action | Icon | Symbol name |
|---|---|---|
| Dislike | *[hình: An icon showing a hand giving a thumbs down gesture.]* | `hand.thumbsdown` |
| Like | *[hình: An icon showing a hand giving a thumbs up gesture.]* | `hand.thumbsup` |

#### Layer ordering

| Action | Icon | Symbol name |
|---|---|---|
| Bring to Front | *[hình: An icon showing a stack of three squares overlapping each other, with the top square using a solid fill style while the other squares are outlines.]* | `square.3.layers.3d.top.filled` |
| Send to Back | *[hình: An icon showing a stack of three squares overlapping each other, with the bottom square using a solid fill style while the other squares are outlines.]* | `square.3.layers.3d.bottom.filled` |
| Bring Forward | *[hình: An icon showing a stack of two squares overlapping each other, with the top square using a solid fill style while the other square is an outline.]* | `square.2.layers.3d.top.filled` |
| Send Backward | *[hình: An icon showing a stack of two squares overlapping each other, with the bottom square using a solid fill style while the other square is an outline.]* | `square.2.layers.3d.bottom.filled` |

#### Other

| Action | Icon | Symbol name |
|---|---|---|
| Alarm | *[hình: An icon showing an alarm clock.]* | `alarm` |
| Archive | *[hình: An icon showing a file box.]* | `archivebox` |
| Calendar | *[hình: An icon showing a calendar.]* | `calendar` |

### Platform considerations

*No additional considerations for iOS, iPadOS, tvOS, visionOS, or watchOS.*

### Resources

##### Related

[App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)

[SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)

##### Videos

- [Designing Glyphs](https://developer.apple.com/videos/play/wwdc2017/823)

### Change log

| Date | Changes |
|---|---|
| June 9, 2025 | Added a table of SF Symbols that represent common actions. |
| June 21, 2023 | Updated to include guidance for visionOS. |
