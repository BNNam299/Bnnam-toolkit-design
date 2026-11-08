<!-- Source: https://m3.material.io/foundations/usability · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__usability.md @ 3c0e291 -->

# Usability

Usability focuses on making products intuitive and easy to understand for everyone

## Overview

### Key takeaways

- Emphasize key actions to create effective visual hierarchy
- Leverage [expressive design tactics](https://m3.material.io/blog/building-with-m3-expressive#what-rsquo-s-in-the-update) to improve usability
- Don't overwhelm the user with too much visual information
- Test and iterate to validate designs

Usability helps create digital products that are easy to use and engaging. By leveraging M3 Expressive [design tactics](https://m3.material.io/blog/building-with-m3-expressive#what-rsquo-s-in-the-update) like containment, size, shape, color, and typography, designers can guide users through experiences and emphasize key actions to create intuitive, usable products.

### What is usability?

The [Nielsen Norman Group](https://www.nngroup.com/articles/usability-101-introduction-to-usability/) defines usability by how effectively users interact with a product through five aspects:

| Aspect | Definition |
|---|---|
| Efficiency | Users can efficiently complete tasks and goals |
| Errors | Proper design reduces the likelihood of mistakes, and users can easily correct any errors that do occur |
| Learnability | New users learn to use the product and complete tasks easily, even if it’s the first time they’re using it |
| Memorability | When users come back to a product, they remember how to use it |
| Satisfaction | Users are satisfied with the designed experience |

#### How is usability different from accessibility?

**Accessibility** focuses on making products accessible for people with disabilities. Accessible experiences are perceivable, operable, understandable and robust, and support people who use assistive technology. [More on accessibility](https://m3.material.io/foundations/overview)

**Usability** focuses on making products intuitive and easy to understand for everyone.

### Usability design tactics

There are many ways to design for usability; not all design tactics need to be combined at the same time. An effective combination of design tactics can:

- Make a product easily understood, learnable, and memorable
- Help people quickly identify what do to next
- Minimize distractions to focus on the task

Start by creating a strong visual hierarchy to emphasize important information by using color, size, spacing, placement, containment, and other [tactics](https://m3.material.io/blog/building-with-m3-expressive#what-rsquo-s-in-the-update). Then add unique emphasis to celebrate success or progress, by adding illustrations, scale, shapes, and shape morph.

#### Color & color contrast

Use eye-catching primary and secondary colors to create hierarchy and emphasize key actions. Instead of similar colors, try using contrasting colors, like purple and green. Colors should always follow [basic accessibility guidelines](https://m3.material.io/foundations/designing).

Tip: Material Design’s dynamic [color roles](https://m3.material.io/styles/color/roles) automatically create color palettes with proper emphasis and accessible contrast ratios.

More on [Color](https://m3.material.io/styles/color/system/overview?utm_source=homepage&utm_medium=referral&utm_campaign=IO25) & [color contrast](https://m3.material.io/foundations/designing)

*[image: Light purple, dark purple, yellow and dark green colors on a light purple background]*

#### Containment & grouping content

Group related elements in subtle containers to make them easier to understand. Break content into manageable sections using containment, [spacing](https://m3.material.io/foundations/layout/grids-spacing), and headings.

*[image: Four different rectangular shapes with round or rounded corners]*

#### [Motion](https://m3.material.io/styles/motion/overview)

Motion emphasizes key moments or unique experiences. However, use it sparingly since motion can be distracting.

*[video: The flower expands and contracts]*

#### Shape & shape morph

The [Material shape library](https://m3.material.io/styles/shape) has 35 shapes to apply to designs. Shapes are often used to mask imagery or fill empty space.

Shape:

- Adds emphasis and delight
- Guides focus
- Differentiates containers, buttons and animations
- Signals interaction
- Sets emotional tone

Every shape can morph into another in the set. Shape morph is also applied when interacting with components like [buttons](https://m3.material.io/components/buttons). Shape morph:

- Communicates interaction states, like selected, tap, swipe, scroll, release, long press
- Emphasize actions in progress

More on [shape](https://m3.material.io/styles/shape) & [shape morph](https://m3.material.io/styles/shape)

*[image: Five shapes from the Material Shape set]*

#### Size

The size and scale of elements shows their level of importance. The most important action or the main call to action (CTA) should be the largest element.

Using larger sizes for key actions dramatically increases usability and makes products more efficient. Users are satisfied, they make fewer errors, and find the products to be more learnable.

*[image: Small, medium, and large soft burst]*

#### Typography

Type can separate different hierarchies of information. More important information might use one font and less important or supplemental content might use another.

- The largest, most legible text on the screen could signal a primary action
- Smaller text signals secondary or tertiary action
- Group similar content by using the same font style

[More on typography](https://m3.material.io/styles/typography)

*[image: Different weights and width of letters]*

### Design based on primary goals

Primary goals are the main tasks to use a product successfully, like starting a process or making decisions, so they need the strongest emphasis. Secondary and tertiary goals add to the experience of the product but aren’t required, like viewing statuses or settings. Identify primary, secondary, and tertiary goals by considering product needs and user satisfaction.

To guide people to the primary goal while ensuring that other goals are still discoverable, try:

- Creating a strong visual hierarchy with size, color, and other design tactics
- Simplifying to one primary task on each page, leveraging empty space to focus attention
- Making core actions recognizable and easily reachable, like using large buttons for the most frequent actions
- Designing a harmonious experience that is aesthetically pleasing and easy to understand
- Not using too many expressive tactics at the same time as they can be distracting

### Iterate

Test, iterate, and gather feedback early and often from a range of users and contexts to validate design choices and minimize errors. User testing offers valuable insights into how users perceive and interact with the usability of the product experience.

## Applying M3 Expressive

### Aura: An example app showcasing usability with M3 Expressive

*[image: Four key screens of the breathing app.]*
The four goals in the Aura breathing app:

1. Start a breathing session
2. Experience and complete a breathing session
3. View the breathing session results
4. Check progress towards personal goals

Aura is a conceptual breathing app that illustrates how [Material 3 (M3) Expressive design tactics](https://m3.material.io/blog/building-with-m3-expressive#what-rsquo-s-in-the-update) can make an app more usable and draw the user’s attention to the most important actions. It’s used with a smart watch to measure heart rate. It was created based on the [eye tracking and focus group research](https://design.google/library/expressive-material-design-google-research) that played a key role in the creation of M3 Expressive. Research showed that participants were able to spot key UI elements up to **four times faster** in the M3 Expressive designs compared to other designs.

Examples include:

- Using scale, color, and containment to guide people to start a breathing session
- Using shape, color, and empty space to guide people to breathe slowly and with intention
- Minimizing cognitive load by using empty space and fewer actions, so people can stay focused on their breath
- Balancing primary tasks with supportive data to show progress and impact of a session

### Example 1: Start a breathing session

Starting the session is the primary goal when opening the app. Size, placement, color, and contrast guide the user to the **Start breathing** button. The button’s large size and low placement makes it easy to reach when holding a phone.

The **settings** use a secondary color to draw attention, but they’re not as emphasized as the button.

The **daily message** is the least emphasized, but uses large containment and type to draw attention.

Expressive components used:

- [Extra large button](https://m3.material.io/components/buttons)
- [Button groups](https://m3.material.io/components/button-groups)
- [Switch](https://m3.material.io/components/switch)
- [Navigation bar](https://m3.material.io/components/navigation-bar)

*[image: 3 elements of the landing page of a breathing app.]*
App elements in order of emphasis:

1. The **Start breathing** button is the primary goal of the app
2. Breathing session settings
3. Daily welcome message

#### Usability design tactics

| Color & contrast | The prominent dark purple **Start breathing** button (1) on a soft light purple background uses [Material primary color roles](https://m3.material.io/styles/color/roles) to create high contrast, making the button easy to find and remember. |
|---|---|
| Hierarchy | The main goal is to tap the large **Start breathing** button (1). The daily message (3) and settings (2) are in lighter colors and in subtle containers because they are supportive actions, but not required. |
| Placement | The button (1) is close to the bottom so it’s easy to reach. It’s the final, most prominent element in the vertical flow, naturally guiding the eye down the screen without competing with other content. |
| Shape | The rounded button form reinforces it as a distinct, touchable control. |
| Size | The button (1) is extra large to make it the most emphasized element on the screen. |
| Spacing | Generous spacing separates the button (1) from the message (3) and settings (2). |
| Typography | The button (1) has larger text to emphasize the primary action. |
| Visual harmony & hierarchy | The daily message is placed at the top in a soft blue container with medium sized text, setting a reflective tone without drawing too much focus. The hierarchy guides the user from the daily message (3) to settings (2) and finally to the **Start breathing** button (1). |

### Example 2: Breathing session (inhale & exhale)

The guided breathing exercise is the [hero moment](https://m3.material.io/blog/building-with-m3-expressive). A large central flower expands and contracts, serving as the visual guide for each breath, while a countdown shows remaining seconds for inhaling, exhaling, and holding the breath.

The **pause** and **stop** buttons are less prominent than the flower to encourage people to focus on the session. The buttons are placed at the bottom so they’re easy to reach.

Expressive components and styles used:

- [Large buttons](https://m3.material.io/components/buttons) in a [button group](https://m3.material.io/components/button-groups)
- [Material shape library](https://m3.material.io/styles/shape) (“flower” and “sunny”)
- [Emphasized typography](https://m3.material.io/styles/typography)

*[video: A flower shape getting larger as a user inhales, and smaller as they exhale.]*
The flower’s shape, size, and movement guide the user to inhale, exhale, and hold the breath.

#### Usability design tactics

| Color & contrast | The vibrant yellow appears when inhaling to contrast the soft purple background and be obvious. |
|---|---|
| Motion | The flower expands and contracts to guide the pace of the breath. The motion uses[Material Spring Motion Tokens](https://figma.com/community/plugin/1397759704974764283/material-motion). |
| Placement | The **pause** and **stop** buttons are at the bottom, spaced away from the flower, but easy to reach. The navigation bar hides during the breathing journey. |
| Shape | The flower uses the “flower” and “sunny” [Material shapes](https://m3.material.io/styles/shape) to draw attention and clearly stand apart from the simple **pause** and **stop** buttons. |
| Size | The size of the animating, breathing flower dominates the screen to draw attention. |
| Typography | The countdown numbers are very large in comparison to the **inhale**, **hold**, and **exhale** text to focus attention on the exercise. This provides strong visual contrast, while still keeping the instructions associated with the countdown. |

### Example 3: Breathing report

The breathing report comes after the breathing exercise. It’s the secondary goal in the app, not the primary hero moment, so it uses fewer design tactics to reduce cognitive load.

It draws attention to each data point on the page using shapes and decreasing size. The button is less emphasized than the **Start breathing** button on the landing page.

Expressive components and elements used:

- [Medium button](https://m3.material.io/components/buttons)
- [Material shape library](https://m3.material.io/styles/shape)
- [Emphasized typography](https://m3.material.io/styles/typography)

*[image: The breathing report provides data (total breaths taken, exercise duration, heart rate/beats per minute (BPM), and breaths per minute) from the user’s breathing session.]*
Shapes and smaller sizes emphasize key information and draw attention down the screen to the **Finish** button

#### Usability design tactics

| Color & contrast | Dark text on the light flower shapes creates a strong contrast, making each metric easy to read at a glance. The solid, dark purple **Finish** button stands out clearly against the light purple background, guiding users to the next step. |
|---|---|
| Placement | The metrics are spread out across the screen in a loose cluster, guiding the user from one to the next. The **Finish** button is centered at the bottom so it’s easy to reach. |
| Shape | The metrics are inside Material flower shapes, making achievements stand out. The use of flower shapes make the design look consistent. |
| Size & typography | Key numbers like **18** and **3min** are larger and use emphasized styles, making it easy to scan the most important data. |
| Spacing & grouping | Ample spacing around each metric avoids clutter, while making the layout tide any scannable. Playful Material shapes serve as clear containers, making the grouping feel lively. |

### Example 4: Check progress

The progress report is a tertiary goal in the app to track statistics and see progress over a monthly view. Since it’s not a primary goal or hero moment, it uses more subtle design tactics to make the app usable and draw more attention.

The key data is dark on a light background to draw attention, while the yellow shapes on the calendar highlight completed sessions.

Expressive components and elements used:

- [App bar](https://m3.material.io/components/app-bars)
- [Progress indicator](https://m3.material.io/components/progress-indicators)
- [Medium button](https://m3.material.io/components/buttons)
- [Navigation bar](https://m3.material.io/components/navigation-bar)
- [Material shape library](https://m3.material.io/styles/shape)
- [Emphasized typography](https://m3.material.io/styles/typography)

*[image: A progress screen shows data in dark primary colors, then statuses in secondary yellow colors in a progress bar and calendar view.]*
Large text and colorful completed sessions draw attention to the key progress information

#### Usability design tactics

| Color & contrast | The data uses the **primary** role to be darker than all other elements and draw attention.The yellow accents on the daily goal bar and calendar use the **secondary** roles to highlight progress. |
|---|---|
| Grouping & spacing | The metrics (days, breaths, and minutes) are grouped together. The equal vertical spacing between elements makes it easy to scan data. |
| Shape | The rounded Material flower shape on the highlighted days in the calendar makes data more expressive. The flower shapes remind the user of the breathing exercise visualization. |
| Size | Custom-scaled numbers for key statistics such as days, breaths, and minutes are large enough to scan, but they don’t dominate the screen. |

### Testing & iteration improves the experience

By testing the experience with users, it’s easy to identify usability issues and address them. From version 1 to 2, the design shifts from cluttered to calm and simplified.

*[image: A button to start breathing followed by loosely-grouped settings for duration, sound, and haptics, all with their own styles.]*
Version 1: No containment, similar sizes, and inconsistent colors

*[image: A list of settings consistently styled followed by an extra large button to start breathing.]*
Version 2: Neatly grouped settings, an extra large button, and consistent secondary color usage

Version 1 loaded the screen with settings for duration, sound, and haptics all fighting for attention, creating unnecessary complexity. In Version 2, these options are neatly grouped as list items above the main action. The focus stays on starting the breathing session.

By carefully using hierarchy, containment, shape, and color, the final design is easier to follow and more intuitive. Exploring different design refinements can result in an experience that feels intuitive and easy for the user to follow.

### Best practices for applying usability design tactics

#### Use clear scale and placement

Avoid crowding the screen with too many large or equally prominent elements. Scale and placement create a clear focal point.

*[image: The aura app home page with similar-sized elements competing for attention.]* **⚠️ Caution**
- All the elements were large and competed for attention
- The visual hierarchy was unclear
- The settings weren’t grouped together

*[image: The aura app home page with a clear visual hierarchy and appropriate emphasis per element.]* **✅ Do**
- The large **Start breathing** button is a strong visual focal point
- The supporting controls are clear, but less prominent than the **Start breathing** button

#### Reinforce with consistent color roles

Use different color roles for actions and data to create a visual hierarchy that makes it simple for users to identify what they can do.

*[image: 3 color roles incorrectly used in the aura app.]* **⚠️ Caution**
- The same color roles, primary (1, 2) and primary container (3), are used for all actions and data

*[image: 3 color roles used in the aura app.]* **✅ Do**
- The primary color role (1) makes the button clear and prominent
- The secondary color on selected settings (2) and secondary container color on the dates (3) contrast with the background and primary colors

#### Create calm, balanced layouts

Use uniform shapes and sizes. Add space between shapes and data to make it simple to compare data. Create gentle visual rhythm by aligning elements in a consistent flow to support a serene, focused experience.

*[image: Breathing report statistics in containers that overlap each other.]* **⚠️ Caution**
- The shapes have different forms and sizes
- The shapes overlap

*[image: Breathing reports statistics in containers neatly organized on the page.]* **✅ Do**
- There’s more even spacing between shapes
- The shapes are uniform

*[video: Arrows, countdown numbers and text move along with the purple and yellow flower that opens and compresses.]* **⚠️ Caution**
- The text shifts from very condensed (inhale) and expanded (exhale) while the large arrows animate at the same time as the moving flower

*[video: The purple and yellow flower expands and contracts, numbers appear for the exhale, hold and inhale]* **✅ Do**
- The text spacing is consistent so the user can focus on the flower’s pulsating and morphing shape guiding the pace of breathing
