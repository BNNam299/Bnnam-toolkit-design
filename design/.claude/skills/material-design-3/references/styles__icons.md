<!-- Source: https://m3.material.io/styles/icons · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/styles__icons.md @ 3c0e291 -->

# Icons

Icons are small symbols to easily identify actions and categories

## Overview

- Get Material Symbols icons at [fonts.google.com/icons](https://fonts.google.com/icons). Recolor, resize, and copy and paste icons.
- Use the Material Symbols variable font to enable dynamic styling in product
- You can change the weight, fill, optical size, and grade of variable font icons

*[video: Array of icons with various stylistic attributes.]*

### Resources

| Type | Link | Status |
|---|---|---|
| Design | [Icons catalog](https://fonts.google.com/icons) | Available |
| [Material Symbols Figma plugin](http://goo.gle/material-symbols-figma) | Available |  |
| [Icon keyline template (ZIP)](https://storage.googleapis.com/material-io-design/downloads/gm_icon_template.ai.zip) | Available |  |

### What's new

#### Copy & paste customized Material Symbols

You can now copy and paste icons from [Google Fonts](http://fonts.google.com/icons). Once you search for and select the desired icon, options will appear in the right-hand panel to resize, recolor, and copy the customized icon to clipboard.

*[image: Panel showing options to size, recolor, and copy selected icon.]*
Icons can now be copied with a single click

#### Material Symbols

The new variable icon font set supports three styles: **outlined**, **rounded**, and **sharp**. All Material Symbols are newly drawn to be pixel-crisp and modernized.

*[image: Twelve icons depicted in three styles: outlined, with rounded corners, and sharp.]*
1. Outlined
2. Rounded
3. Sharp

#### Adjustable axes

Material Symbols have four adjustable stylistic variable font attributes called **axes**. An axis refers to an attribute of a symbol that can be altered to create visual variations. The attributes are: weight, fill, optical size, **grade**.

*[video: Four icons shown with adjusted weight, fill, grade, and optical sizes.]*
A range of symbols shown with the same weight, fill, grade, and optical sizes

#### Material Symbols Figma plugin

Easily [incorporate Material Symbols](http://goo.gle/material-symbols-figma) into your latest designs on Figma.

*[image: Screenshot of Material Symbols plugin in Figma.]*
Figma Symbols plugin

## Designing icons

### Design principles

Icons are an essential element of any interface, packing an informative punch into a small form factor. They’re designed to be simple, modern, friendly, and sometimes quirky. To ensure consistency and readability, their limited size means that each icon must strictly adhere to guidance while still expressing essential characteristics.

*[image: Front view of boat icon.]* **✅ Do**
Simplify icons for greater clarity and legibility

*[image: Boat image with sails, mast, and flag.]* **❌ Don't**
Don’t be overly literal. Avoid complex icons.

*[image: Use geometric, consistent shapes.]* **✅ Do**
Make icons graphic and bold

*[image: Detailed thumbs-up icon with contoured fingers in outline.]* **❌ Don't**
Don’t use delicate or loose organic shapes

*[image: Four icons with a consistent style.]* **✅ Do**
Use and maintain a consistent visual style throughout one icon set

*[image: Four icons with a inconsistent styles.]* **❌ Don't**
Avoid mixing styles for one icon set

### Icon sizes and layout

#### Standard (Baseline) icon size

Standard icons are displayed as 24dp x 24dp. For pixel-perfect accuracy, create icons for viewing at 100% scale.

*[image: Icon at 100% scale on a 24dp grid.]*
24dp grid at 100% scale

*[image: Icon at 1000% scale on a 24dp grid.]*
24dp grid at 1000% scale

#### Additional optical icon sizes

Icons support additional sizes: 20dp, 40dp, and 48dp, with 20dp primarily for desktop, dense layouts, and small scale visuals, and 40dp and 48dp optimized for display or headline type, plus larger screen sizes.

*[image: Four document icons shown at increasing scales.]*
Supported icon sizes: 20dp, 24dp, 40dp, and 48dp

#### Standard (Baseline) icon layout

Icon content should remain inside of the **live area**, which is the region of an image that is unlikely to be hidden from view (such as an area where sidebars appear upon scrolling).

If additional visual weight is needed, content may extend into the padding between the live area and the **trim area** (the complete size of a graphic). No parts of the icon should extend outside of the trim area.

*[image: A 24dp-by-24dp icon grid with the 20dp-by-20dp live area highlighted.]*
**Live area**

Icon content is limited to the 20dp x 20dp live area, with 2dp of padding around the perimeter

*[image: A 24dp-by-24dp icon grid with the inner 2dp padding highlighted.]*
**Padding**

2dp of padding surrounds the live area

*[image: A 24dp-by-24dp icon grid with the inner 2dp padding highlighted.]* **✅ Do**
Icon content is limited to the 20dp-x-20dp live area, with 2dp of padding around the perimeter

*[image: Icon using live area and trim area.]* **⚠️ Caution**
If additional visual weight is needed, content may extend into the padding between the live area and the trim area

*[image: Icon exceeding trim area.]* **❌ Don't**
No parts of the icon should extend outside of the trim area

### Grid and keyline shapes

#### Icon design template

If your design requires an icon that isn’t covered by the over 2,000 variations in [Google Font’s icon library](https://fonts.google.com/icons), you may want to create your own. [Download this 24dp keyline template](https://storage.googleapis.com/material-io-design/downloads/gm_icon_template.ai.zip)* (ZIP file) to design custom icons in Adobe Illustrator.

**This template is available under*[*Apache 2.0*](https://www.apache.org/licenses/LICENSE-2.0.html)*. By downloading this file, you agree to the*[*Google Terms of Service*](https://policies.google.com/terms)*. The*[*Google Privacy Policy*](https://policies.google.com/privacy)*describes how data is handled in this service.*

#### Icon grid and keyline

The icon grid establishes clear rules for the consistent, but flexible, positioning of graphic elements.

Keyline shapes are the foundation of the grid. By using these core shapes as guidelines, you can maintain consistent visual proportions across system icons.

*[image: A 24dp-by-24dp icon grid.]*
Grid

*[image: A 24dp-by-24dp grid of foundational icon keylines: square, circle, vertical rectangle, horizontal rectangle.]*
24dp grid at 1000% scale

*[image: A 24dp-by-24dp grid of foundational icon keylines with the square keyline highlighted.]*
Square height and width, 18dp

*[image: Add chart icon on square keyline.]*
Icon drawn using square keyline

*[image: A 24dp-by-24dp grid of foundational icon keylines with the circle keyline highlighted.]*
Circle diameter, 20dp

*[image: Globe icon on circle keyline.]*
Icon drawn using circle keyline

*[image: A 24dp-by-24dp grid of foundational icon keylines with the vertical rectangle keyline highlighted.]*
Vertical rectangle height, 20dp, and width, 16dp

*[image: Document icon on vertical rectangle keyline.]*
Icon drawn using vertical rectangle keyline

*[image: A 24dp-by-24dp grid of foundational icon keylines with the horizontal keyline highlighted.]*
Horizontal rectangle height, 16dp, and width, 20dp

*[image: Envelope icon on horizontal rectangle keyline.]*
Icon drawn using horizontal rectangle keyline

*[image: Icon grid including a folder icon aligning to the grid. X and Y placement coordinates are shown using integers.]* **✅ Do**
Position icons “on pixel” within the icon grid

*[image: Icon grid including a folder icon misaligned to the grid with X and Y placement coordinates shown using decimals.]* **❌ Don't**
Don’t place the icon on a coordinate that isn’t “on pixel”

### Icon metrics

#### Anatomy

*[image: Diagram of a calendar icon on a grid highlighting six different elements.]*
1. Corner
2. Stroke terminal
3. Counter stroke
4. Stroke
5. Counter area
6. Bounding area

#### Corners

Corner radii are 2dp by default. For the outlined style symbols, interior corners are square, not rounded. For shapes 2dp wide or less, stroke corners shouldn’t be rounded.

For the rounded style symbols, both exterior and interior corner radii are rounded and for the sharp style symbols, both exterior and interior corners radii reduce from 2dp to 0dp.

*[image: Credit card symbol placed on grid with 2dp rounded exterior corners highlighted.]*
Exterior corners with 2dp corner radii

*[image: Credit card symbol placed on grid with 2dp linear interior corners highlighted.]*
Interior corners shouldn’t be rounded

*[image: Document icon placed on grid with overly rounded corners highlighted.]* **⚠️ Caution**
Overly round corners reduces the symbol’s legibility

*[image: ‘Add more’ icon placed on grid with inconsistent rounded corners.]* **❌ Don't**
Don’t use inconsistent corner radii

#### Weight and stroke

The recommended stroke weight for icons is 2dp or the regular weight (400), which includes curves, angles, and both interior and exterior strokes. Material Symbols can provide a range of weights between thin (100) and bold (700).

*[image: Regular stroke weight timer icon placed on a grid.]*
Timer icon at the regular stroke weight (400)

*[image: Weight timer symbols ranging from 100 to 700 weight.]*
Timer symbol shown across a 100–700 weight range

*[image: Arrow symbol placed on a grid with arrowhead terminals trimmed to 45 degrees highlighted.]*
Stroke terminal on an icon

*[image: Add circle symbol placed on grid with linear 2dp inner stroke highlighted.]*
Counter stroke on an icon

*[image: Add chart icon placed on grid with consistent stroke weights and squared stroke terminals.]*
Use consistent stroke weights and squared stroke terminals

*[image: Add chart icon placed on grid showing inconsistent stroke weights and rounded stroke terminals.]*
Don’t use inconsistent stroke weights or rounded stroke terminals

#### Complex icon shapes

If an icon requires complex details, subtle adjustments can be made to improve its legibility. These adjustments are referred to as optical corrections. Any optical correction should use the geometric forms on which all other icons are based, without skewing or distorting those shapes.

*[image: Paperclip icon on grid with adjusted 1.5dp stroke highlighted.]*
The paperclip icon uses 1.5dp of the possible 2dp stroke area to fit multiple curves within the 24dp x 24dp icon space

*[image: Ramen bowl icon on grid with adjusted 1.5dp stroke highlighted.]*
The ramen bowl icon uses 1.5dp stroke and 2dp stroke together within the 24 x 24dp icon space

*[image: Building icon using flat shapes.]* **✅ Do**
Make icons face forward

*[image: Building icon in isometric perspective.]* **❌ Don't**
Don’t tilt, rotate, or make icons appear dimensional

## Applying icons

### Icon & Material Symbol styles

Material Symbols are the new default, and are available in three styles: **outlined, rounded,**and**sharp**. (The legacy Material Icons continue to be available, but don’t have the variable font capabilities of Material Symbols.)

#### Outlined style

Outlined symbols use stroke and fill attributes for a light, clean style that works well in dense UIs. The stroke weight of outlined icons can be adjusted to complement or contrast the weight of your typography.

*[image: Examples of outlined symbols with stroke and fill attributes.]*
Outlined style

*[image: Outlined icon set on grid.]*
2dp outlined icons remain readable across sizes and applications

*[image: Four filled symbols showing full body human and proprietary icons.]*
For optimal legibility and recognition, some symbols should remain filled, such as full body human icons or proprietary icons

*[image: Thin-lined outlined symbols correspond to app typography.]*
The lighter stroke weight of these outlined symbols mirrors the thin lines of the app’s typography

#### Rounded and sharp styles

Rounded symbols use a corner radius that pairs well with brands that use heavier typography, curved logos, or circular elements to express their style.

Sharp symbols display corners with straight edges, for a crisp style that remains legible even at smaller scales. These rectangular shapes can support brand styles that aren’t well-reflected by rounded shapes.

*[image: Examples of rounded-style icons.]*
Rounded-style icons

*[image: Examples of sharp-style icons.]*
Sharp-style icons

*[image: Plus icon as a round icon.]*
Corner radii for round icons

*[image: Plus icon as a sharp icon.]*
Square corner radii for sharp icons

*[image: Travel app with rounded buttons and rounded icons.]*
This app uses rounded buttons and round icons

*[image: Six icons implementing sharp style.]*
The 0dp corner radius of the sharp icon set echoes this app’s rectangular design details

### Customizing Symbols

Material Symbols have four adjustable stylistic variable font attributes called **axes**. An axis is a typographic term referring to the attribute of a symbol that can be altered to create visual variations.

Each style symbol contains four axes: **weight, fill, grade,** and **optical size**.

#### Weight

Weight defines the symbol’s stroke weight, with a range of weights between thin (100) and bold (700). Weight can also affect the overall size of the symbol.

*[video: Gradual increase of symbols from thin to bold.]*
A symbol in a range of weights

*[image: 400 regular-weight icons used in standard navigation drawer and modal navigation drawer.]*
400 regular-weight symbols

*[image: Photo gallery using 100 weight icons.]* **❌ Don't**
Don't use the lightest weight for standard-size (24dp) icons. The minimum weight for this size should be 200.

*[image: Three side-by-side 24p standard symbols.]* **⚠️ Caution**
Be careful using excessive weight for standard 24dp symbols

*[image: Navigation rail with consistent symbol weights.]* **✅ Do**
Apply weights consistently

*[image: Navigation rail with varying symbol weights.]* **❌ Don't**
Don’t mix different weights

#### Fill

Fill gives you the ability to transition from a more outlined style to a reversed or more filled style.

A fill attribute can be used to convey a state of transition, such as unfilled and filled states. Values range from 0 to 1, with 1 being completely filled. Along with weight, fill is a primary attribute that impacts the overall look of a symbol.

*[image: Unfilled icons.]*
Unfilled symbols with fill set to 0

*[image: Set of filled icons.]*
Filled symbols with fill set to 1

*[video: Four filled symbols in selected and unselected states set in bottom navigation.]*
Bottom navigation with filled symbols in selected and unselected states

#### Grade

Weight and grade affect a symbol’s thickness. Adjustments to grade are more granular than adjustments to weight and have a smaller impact on the size of the symbol.

Grade is also available in some text fonts. Grade levels between text and symbols can be matched for a harmonious visual effect. For example, if the text font has a -25 grade value, the symbols can match it with a suitable value of -25.

*[image: Symbol thickness at grade 0 and at negative grade.]*
1. At grade 0, the thickness of the symbol does not change
2. At negative grade, the thickness of the symbol appears lighter

Grade can also compensate for**visual bleed**, which is when images can look bigger or smaller depending on the color contrast. To match the apparent icon size, the default grade for a dark icon on a light background is 0, and -25 for a light icon on a dark background.

*[image: Button with icon and text in light UI.]*
Icon button featuring a 0 default grade symbol in light UI

*[image: Button with icon and text in dark UI.]*
Icon button featuring a negative grade symbol in dark UI

To make strokes heavier and more emphasized, use positive value grade, such as when representing an active icon state.

*[image: Photo icon in active state appearing bolder.]*
An icon with active state using positive value grade for emphasis

#### Optical sizes

Optical sizes range from 20dp to 48dp.

For the image to look the same at different sizes, the stroke weight (thickness) changes as the icon size scales. Optical size offers a way to automatically adjust the stroke weight when you increase or decrease the symbol size.

*[image: Four icons gradually increasing in optical size.]*
Four optical sizes, 20dp, 24dp, 40dp, 48dp

Traditionally, icons are resized from a 24dp source vector, resulting in a large scaled icon that’s too heavy compared to the original. With the optical size axis, you can maintain the stroke weight (thickness) as the icon size grows.

*[video: Side-by-side scaling view showing a Material icon and a Material Symbol.]*
1. Material icon
2. Material Symbol

*[image: Desktop dropdown menu with icon in active state.]*
Use 20dp optical size value for dense layouts on desktop

*[image: Forward and reverse symbols highlighted on device.]*
Use larger size 40dp–48dp symbols when primary actions need to be highlighted

### Using Material Symbols with typography

Material Symbols are designed with similar considerations to typefaces, and often appear alongside text. Choosing the right icon set can tie the content of an interface together, enhancing the cohesive branded feel of your product.

*[image: Selections of icons and typography examples in different contexts where weights and sizes are paired.]*
Match the optical weight and size of text and icon to ensure consistency

*[image: Text and icon that are the same size.]* **✅ Do**
Use the same size for your Material Symbols and text

*[image: A small icon mismatched with larger text.]* **❌ Don't**
Don’t mix the sizes of your symbol and text

*[image: An icon and text that are the same optical weight.]* **✅ Do**
Use the same optical weight for your symbol and text

*[image: An icon and text that have mismatched optical weight.]* **❌ Don't**
Don’t use different optical weights for Material Symbols and text

*[image: Icon that has had its baseline shifted down 11.5%.]* **✅ Do**
Shift down the baseline of symbols to approximately 11.5% of the text size

*[image: Icon and text that are using the same baseline.]* **❌ Don't**
Don’t use the same baseline for Material Symbols and text

### Accessibility

Learn more about making your icons more accessible.

#### Icons with a label text

Label text provides short, meaningful descriptions when symbols are more abstract. This can prove helpful in the case of navigation.

*[image: Navigation bar showing four destinations, with 1 active destination featuring both icon and text label.]*
Label text provides short descriptions, especially useful for navigation

*[image: Navigation bar with four destinations with only icons, no labels.]*
Use caution if icons are displayed without labels. Icon meaning should always be unambiguous and accessible for all users. Text labels can be omitted in specific circumstances where reduced visual impact is necessary.

#### Small icons

Material Symbols can scale up or down in size without a loss of fidelity. Simple symbols, like stars for ratings, can be used on their own at any size, as long as they remain identifiable.<br><br>Other symbols should have an accompanying text label below 20dp to ensure their meaning is clear and to maintain accessibility. These symbols include:

- Complex icons, which are highly detailed or have multiple parts
- Icons with a key action, which are essential to using the product

#### Target size

Adequate space should surround icons to allow legibility and interaction.

Symbols of 24dp should have a target size of 48dp by default.

*[image: 1. 24dp add symbol inside 48dp red square, 2. mobile UI with attach, add, and more symbols.]*
1. Measurements
2. Placement

When a mouse and keyboard are the primary input methods, measurements may be condensed to accommodate denser layouts.

A 20dp size symbol can use a target size of 40dp.

*[image: 1. 24dp add symbol inside 48dp red square, 2. desktop UI with attach, add, and more symbols.]*
1. Measurements
2. Placement

### Localizing icons

To make sure iconography translates effectively in local markets, test it across age groups, cultures, and languages, and follow these best practices:

- Use labels when icons and symbols are more abstract
- Remember that navigation items must have labels for clarity and accessibility
- Consider tech knowledge: people who use the internet a lot may have different understandings of icons than people who use the internet less

*[image: Comparison of three UIs showing add to cart, add to bag, and add to basket.]*
Translate icons for local markets. For example, different locales may prefer a cart, bag, or basket for checkout experiences.

#### Cultural influence of colors and symbols

Color carries cultural significance and can convey different emotions in different cultures. White is commonly associated with purity in western cultures but symbolizes mourning in some eastern cultures.<br><br>Consider cultural interpretations of symbols. In many western cultures, owls represent wisdom, while some eastern cultures view them as a negative omen. When using or creating symbols, be mindful that their meanings can vary significantly across cultures.

*[image: Comparison of UIs where red and green are warning colors.]*
Think about how color translates. Some locales use red as a warning color, while others use green.
