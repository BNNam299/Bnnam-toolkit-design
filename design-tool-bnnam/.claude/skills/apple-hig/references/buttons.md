<!-- Source: https://developer.apple.com/design/human-interface-guidelines/buttons · fetched 2026-10-17 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/apple-hig/buttons.md @ 3c0e291 · Platform considerations removed for: macOS, visionOS, watchOS (iOS / iPadOS only) -->

# Buttons

A button initiates an instantaneous action.

*[hình: A stylized representation of two horizontally aligned buttons. The image is tinted red to subtly reflect the red in the original six-color Apple logo.]*

Versatile and highly customizable, buttons give people simple, familiar ways to do tasks in your app. In general, a button combines three attributes to clearly communicate its function:

- **Style.** A visual style based on size, color, and shape.
- **Content.** A symbol (or icon), text label, or both that a button displays to convey its purpose.
- **Role.** A system-defined role that identifies a button’s semantic meaning and can affect its appearance.

There are also many button-like components that have distinct appearances and behaviors for specific use cases, like [toggles](https://developer.apple.com/design/human-interface-guidelines/toggles), [pop-up buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons), and [segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls).

### Best practices

When buttons are instantly recognizable and easy to understand, an app tends to feel intuitive and well designed.

**Make buttons easy for people to use.** It’s essential to include enough space around a button so that people can visually distinguish it from surrounding components and content. Giving a button enough space is also critical for helping people select or activate it, regardless of the method of input they use. As a general rule, a button needs a hit region of at least 44x44 pt — in visionOS, 60x60 pt — to ensure that people can select it easily, whether they use a fingertip, a pointer, their eyes, or a remote.

**Always include a press state for a custom button.** Without a press state, a button can feel unresponsive, making people wonder if it’s accepting their input.

### Style

System buttons offer a range of styles that support customization while providing built-in interaction states, accessibility support, and appearance adaptation. Different platforms define different styles that help you communicate hierarchies of actions in your app.

**In general, use a button that has a prominent visual style for the most likely action in a view.** To draw people’s attention to a specific button, use a prominent button style so the system can apply an accent color to the button’s background. Buttons that use color tend to be the most visually distinctive, helping people quickly identify the actions they’re most likely to use. Keep the number of prominent buttons to one or two per view. Presenting too many prominent buttons increases cognitive load, requiring people to spend more time considering options before making a choice.

**Use style — not size — to visually distinguish the preferred choice among multiple options.** When you use buttons of the same size to offer two or more options, you signal that the options form a coherent set of choices. By contrast, placing two buttons of different sizes near each other can make the interface look confusing and inconsistent. If you want to highlight the preferred or most likely option in a set, use a more prominent button style for that option and a less prominent style for the remaining ones.

**Avoid applying a similar color to button labels and content layer backgrounds.** If your app already has bright, colorful content in the content layer, prefer using the default monochromatic appearance of button labels. For more guidance, see [Liquid Glass color](https://developer.apple.com/design/human-interface-guidelines/color#Liquid-Glass-color).

### Content

**Ensure that each button clearly communicates its purpose.** Depending on the platform, a button can contain a symbol (or icon), a text label, or both to help people understand what it does.

> **Note:** In macOS and visionOS, the system displays a tooltip after people hover over a button for a moment. A tooltip displays a brief phrase that explains what a button does; for guidance, see [Offering help](https://developer.apple.com/design/human-interface-guidelines/offering-help).

**Try to associate familiar actions with familiar icons.** For example, people can predict that a button containing the `square.and.arrow.up` symbol will help them perform share-related activities. If it makes sense to use an icon in your button, consider using an existing or customized [symbol](https://developer.apple.com/design/human-interface-guidelines/sf-symbols). For a list of symbols that represent common actions, see [Standard icons](https://developer.apple.com/design/human-interface-guidelines/icons#Standard-icons).

**Consider using text when a short label communicates more clearly than an icon.** To use text, write a few words that succinctly describe what the button does. Using [title-style capitalization](https://help.apple.com/applestyleguide/#/apsgb744e4a3?sub=apdca93e113f1d64), consider starting the label with a verb to help convey the button’s action — for example, a button that lets people add items to their shopping cart might use the label “Add to Cart.”

### Role

A system button can have one of the following roles:

- **Normal.** No specific meaning.
- **Primary.** The button is the default button — the button people are most likely to choose.
- **Cancel.** The button cancels the current action.
- **Destructive.** The button performs an action that can result in data destruction.

A button’s role can have additional effects on its appearance. For example, a primary button uses an app’s accent color, whereas a destructive button uses the system red color.

*[hình: An example alert with three system buttons, labeled Primary Button, Destructive Button, and Secondary Button. The primary button uses a blue accent color, the destructive button uses text in the system red color, and the secondary button appears as a standard button.]*

**Assign the primary role to the button people are most likely to choose.** When a primary button responds to the Return key, it makes it easy for people to quickly confirm their choice. In addition, when the button is in a temporary view — like a [sheet](https://developer.apple.com/design/human-interface-guidelines/sheets), an editable view, or an [alert](https://developer.apple.com/design/human-interface-guidelines/alerts) — assigning it the primary role means that the view can automatically close when people press Return.

**Don’t assign the primary role to a button that performs a destructive action, even if that action is the most likely choice.** Because of its visual prominence, people sometimes choose a primary button without reading it first. Help people avoid losing content by assigning the primary role to nondestructive buttons.

### Platform considerations

*No additional considerations for tvOS.*

#### iOS, iPadOS

**Configure a button to display an activity indicator when you need to provide feedback about an action that doesn’t instantly complete.** Displaying an activity indicator within a button can save space in your user interface while clearly communicating the reason for the delay. To help clarify what’s happening, you can also configure the button to display a different label alongside the activity indicator. For example, the label “Checkout” could change to “Checking out…” while the activity indicator is visible. When a delay occurs after people click or tap your configured button, the system displays the activity indicator next to the original or alternative label, hiding the button image, if there is one.

*[hình: An illustration of a button labeled Checkout.]*

*[hình: An illustration of a button labeled Checking out, with an activity indicator on the leading side of the label.]*

### Resources

##### Related

[Pop-up buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons)

[Pull-down buttons](https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons)

[Toggles](https://developer.apple.com/design/human-interface-guidelines/toggles)

[Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)

[Location button](https://developer.apple.com/design/human-interface-guidelines/privacy#Location-button)

##### Developer documentation

[Button](https://developer.apple.com/documentation/swiftui/button) — SwiftUI

[UIButton](https://developer.apple.com/documentation/uikit/uibutton) — UIKit

[NSButton](https://developer.apple.com/documentation/appkit/nsbutton) — AppKit

### Change log

| Date | Changes |
|---|---|
| December 16, 2025 | Updated guidance for Liquid Glass. |
| June 9, 2025 | Updated guidance for button styles and content. |
| February 2, 2024 | Noted that visionOS buttons don’t support custom hover effects. |
| December 5, 2023 | Clarified some terminology and guidance for buttons in visionOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using buttons in watchOS. |
