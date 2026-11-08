<!-- Source: https://m3.material.io/foundations/layout/bidirectionality-rtl · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__layout__bidirectionality-rtl.md @ 3c0e291 -->

# Bidirectionality &amp; RTL

Design products that adapt to languages that read right-to-left (RTL)

[Over 2 billion people](https://www.w3.org/International/questions/qa-scripts.en.html) read and write in right-to-left (RTL) languages like Arabic, Hebrew, Farsi, and Urdu. Layouts should support both left-to-right (LTR) and RTL languages through mirroring and other best practices to ensure content is easy for global audiences to understand and navigate. Consider the holistic experience including [global writing](https://m3.material.io/foundations/content-design/global-writing), localizing voice and [design principles for culturally appropriate icons](https://m3.material.io/styles/icons).

Material's components are built to support RTL, such as naming elements and tokens as "leading" and "trailing." However, extra configuration may be needed to achieve specific RTL situations.

## Mirroring

When a layout is changed from LTR to RTL (or vice-versa), or flipped horizontally, it’s often called mirroring. UI elements and text that typically appear on the left in LTR aligns to the right. Reading flow starts from the top right corner, instead of the top left.

Not all elements mirror with RTL languages. For example, graphs and charts maintain a LTR directionality for Persian and Urdu.

*[image: Layout in LTR and mirrored for RTL language.]*
A mirrored layout in an RTL language reverses the alignment and ordering of elements

## Text rendering

Correct text rendering is foundational for a great user experience, and it’s critical for readability and usability. Text rendering has two parts:

1. Alignment: How the edges of the text box are placed alongside other elements
2. Directionality: How text and other elements flow within a text box, like left-to-right or right-to-left

In RTL languages, text is usually right-aligned, and elements flow from right-to-left.

Common issues with RTL language rendering are text entry, cursor position, punctuation, phone numbers, and URLs.

Improperly rendering text in RTL languages can create cognitive overload and negatively impact user sentiment and trust.

*[image: Text field incorrectly displaying the word order of an email address and cursor placement.]* **❌ Don't**
Don't reverse the order of the email username and domain (@google.com). The domain should always be to the right of the username. Usernames can still be written RTL, with the cursor moving to the left.

Note: This example isn’t translated to illustrate a common issue with text rendering.

*[image: Dialog window incorrectly displaying word order decreasing readability.]* **❌ Don't**
Don’t apply LTR directionality to RTL content, because it may scramble word order. To ensure readability across all languages, the content should have both RTL alignment and directionality.

Note: This example isn’t translated to illustrate a common issue with text rendering.

## Icons & symbols

In RTL languages, directional UI icons, like back and forward, should be mirrored. However, in Hebrew, timelines and media controls on a page should retain left-to-right directionality.

The meaning of icons and symbols can vary significantly across cultures. For additional guidance, refer to [design principles for icons](https://m3.material.io/styles/icons).

*[image: Back and forward icons in LTR and RTL.]*
Back and foward icons are mirrored in RTL

*[image: Send and question mark icons in LTR and RTL.]*
Send buttons are mirrored in RTL. Help icons are mirrored in some RTL languages, like Urdu and Persian.

## Time

Linear representations of time are often mirrored in RTL language experiences.

Linear progress indicators should move from right to left for most RTL languages, except Hebrew where it should remain LTR.

Circular representations of time remain the same.

*[image: RTL linear progress indicator filling from right to left and circular progress indicator filling clockwise.]*
1. RTL linear progress indicator starts to fill progress from the right
2. Circular progress indicators move clockwise

### Media players

Media controls for video or audio players are always LTR.

*[image: Media player with control and progress in LTR and all other content is RTL.]*
In Urdu, controls and progress for media and a podcast title are shown in LTR, while all other content is RTL

### Clocks

For RTL languages, the directionality of time remains LTR, and clocks still turn clockwise. However, the AM/PM symbols for 12h clocks should be placed to the left. The 24-hour clock is often used in countries where the primary language isn’t English.

Clock icons, circular refresh icons, and progress indicators with arrows pointing clockwise shouldn’t be mirrored.

*[image: 24-hour clock in RTL.]*
24-hour clocks in RTL move clockwise, but mirror elements such as buttons

*[image: 12-hour clock in RTL.]*
12-hour clocks in RTL move clockwise, but mirror UI elements such as AM/PM and buttons

## Canonical layout examples

### List-detail

The [list-detail layout](https://m3.material.io/foundations/layout/canonical-examples):

- Is a single-pane at compact breakpoints, switching between list and detail views
- Divides the window into two side-by-side panes on large screens
- Is mirrored in RTL

*[image: RTL list layout on mobile.]*
List-detail mirrored for RTL, where text and other elements are aligned to the right and flow from right to left

### Feed

Use a [feed layout](https://m3.material.io/foundations/layout/canonical-examples) to arrange content elements like cards in a configurable grid for quick, convenient viewing of a large amount of content. The feed layout is mirrored in RTL.

*[image: RTL feed layout.]*
Feed layout mirrored for RTL, where the order of text, grid, and other elements align to the right and flow from right to left

### Supporting pane

Use the [supporting pane layout](https://m3.material.io/foundations/layout/canonical-examples) to organize content into primary and secondary display areas. The supporting pane layout is mirrored in RTL.

*[image: RTL supporting pane in an RTL language.]*
Supporting pane to the left of the primary content. Text and other elements within the pane are aligned to the right and flow from right to left.

## Component examples

### Badges

Change the position and alignment of [badges](https://m3.material.io/components/badges) for RTL languages.

*[image: Small badge on the top left of a folder icon.]*
Small badge appears on the top left of the icon

*[image: Large badge on the top left of an image icon.]*
Large badge appears on the top left of the icon

### Toolbars

[Toolbars](https://m3.material.io/components/toolbars) provide actions related to the current page. For RTL languages, mirror the order of the tools.

*[image: RTL floating toolbar.]*
Mirrored floating toolbar, where the FAB appears on the left

### App bars

[App bars](https://m3.material.io/components/app-bars) are placed at the top of the screen to help people navigate through a product:

- Mirror an app bar’s layout in RTL
- Flip appropriate icons, such as arrows

*[image: 4 app bars in RTL.]*
1. RTL center-aligned, small app bars
2. RTL medium, flexible app bar
3. RTL large, flexible app bar

### Navigation rail

The [navigation rail](https://m3.material.io/components/navigation-rail) is placed on the leading edge of the screen, on the left side for LTR, and on the right for RTL.

*[image: Nav rail on the right side for an RTL language, and left side for LTR.]*
Based on the language, a navigation rail is set on a screen’s leading edge:

- Right side for RTL languages
- Left side for LTR languages

### Expanded navigation rail

Expanded navigation rails that open from the side are always placed on the leading edge of the screen, on the left for LTR languages, and on the right for RTL.

*[image: RTL expanded navigation rail, including mirrored icons.]*
RTL expanded navigation rails open from the leading edge and should include mirrored icons

### Text fields

Icons in [text fields](https://m3.material.io/components/text-fields) are optional. Leading and trailing icons change their position based on LTR or RTL contexts.

*[image: Text fields in RTL with leading and trailing icons.]*
Icons, symbols, and label text for RTL:

1. Icon signifier
2. Valid or error icon
3. Clear icon
4. Voice input icon
5. Dropdown icon
6. Image

### Chips

The leading icon of input chips can be an icon, logo, or circular image.

The trailing icon is always aligned to the end side of the container. It’s placed on the right for LTR and on the left for RTL.

*[image: Filter chips with checkmark icons in RTL layout.]*
Filter chips shown in an RTL layout. Note: This example is not translated to help illustrate mirroring.

## Swipe gestures

Gestures are the ways people interact with UI elements using touch or body motion.

People can navigate horizontally between peer views like tabs and to complete actions.

RTL swiping and gestures should mirror their counterparts in LTR. If a product includes a delete icon revealed when swiped from the right for LTR languages, the same should be possible on the left for RTL languages.

*[image: RTL list layout with swipe gesture revealing additional actions.]*
Swiping reveals additional action in RTL list layout

On Android, [predictive back](https://github.com/material-components/material-components-android/blob/master/docs/foundations/PredictiveBack.md) allows people to swipe left or right on the screen to go back or dismiss modal components.

RTL predictive back features should mirror those found in a LTR context.

*[video: Back swipe for RTL languages. The back swipe on a bottom sheet takes person back to previous screen of a photo feed.]*
The predictive back gesture should adjust for RTL languages
