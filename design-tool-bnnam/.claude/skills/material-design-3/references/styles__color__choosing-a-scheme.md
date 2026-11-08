<!-- Source: https://m3.material.io/styles/color/choosing-a-scheme · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/styles__color__choosing-a-scheme.md @ 3c0e291 -->

# Choosing a scheme

Static color schemes emphasize brand and uniformity, while dynamic schemes emphasize content or user settings to make products feel more personal

A **color scheme** describes all of a product's colors, color roles, and color relationships across light and dark themes.

There are two kinds of color schemes in Material:

1. Static
2. Dynamic

*[video: Types of color schemes in Material Design 3.]*
Discover when and how to use different color schemes, including static baseline, dynamic user-generated, and dynamic content-based color schemes

## Static color

Working with static color will be the most like other color workflows you may have used. Static colors won't ever change based on user input or in-app content.

Material provides a static baseline color scheme including default color assignments and mappings.

*[image: Email UI in blue baseline scheme, shown in dark and light theme.]*
Colors are static in the baseline color scheme

**What you get:**

✓ Accessible colors<br>✓ Pre-made baseline color scheme<br>✓ Colors that won't break an M2 app<br>✓ Ability to easily update to dynamic color in the future

**What you *don't* get:**

✗ Personalized colors<br>✗ Colors that change based on user's wallpaper or in-app content<br>✗ User-controlled contrast settings

### **Use static (baseline) color if**

- You're not ready to implement dynamic color (though it'll be easy to switch when you are)
- Your product is migrating from M2 and you want to get M3 features without breaking your app
- Your product is for enterprise users who wouldn't benefit from personalized color or user-controlled contrast settings
- Your product is built for iOS

**Choosing baseline?**[**Start designing with the baseline colors**](https://m3.material.io/styles/color/static)

## Dynamic color

Dynamic color will automatically create an accessible color scheme based on a specific source color.

Because the UI could end up with any number of different source colors, it's best to initially design it using the baseline color scheme so you can ensure the right color roles are mapped to the right components in your product. You'll use the Material Theme Builder to see how your UI mocks look across a range of source colors and adjust it as-needed.

*[image: Email UI changing from yellow, to red, to green color schemes,  shown in light and dark theme.]*
While the actual colors may change, the color role mappings remain the same across dynamic color schemes

**What you get:**

✓ Accessible colors<br>✓ Personalized colors that change based on a user's wallpaper or in-app content<br>✓ Ability to use advanced customizations like chroma fidelity to alter the dynamic color output<br>✓ User-controlled contrast settings

**What you *don't* get:**

✗ Exact same UI colors across all devices

### **Use dynamic color if**

- You want your product to showcase personalization
- You want the colors to change base on a user's wallpaper or in-app content
- You want your product to offer user-controlled contrast settings
- You aren't sure if you'll need to also use a mix of dynamic and static colors (you can customize your color scheme to include static colors as your work progresses)

**Choosing dynamic color? Next**[**pick a dynamic color source**](https://m3.material.io/styles/color/dynamic)
