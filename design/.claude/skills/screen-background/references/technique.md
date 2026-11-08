# Background technique — shapes + blur, as a component

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/figma-practice.md "Designer — background with shape + blur", core/system-binding.md §6b @ 3c0e291 — translated, complete

A "smooth, color-blending" background is **not** drawn as one gradient: it is built from **several shapes, then blurred**. This is the
designer's technique, measured by the agent in Figma.

## Contents
1. Structure
2. Rules for the component and the frames that use it
3. Three ways to blur
4. Blur amount — measured on a phone screen
5. Light and dark backgrounds
6. From a reference palette
7. Color and tokens
8. Platform limits — where this technique is not used

---

## 1. Structure

```
Background/<name>                   COMPONENT · size = the frame it backs (screen, card, Live Activity…) · NONE · clip · fill ONE color
├─ Shape 1 … Shape n                ellipse / rounded rectangle / polygon — solid or gradient fill
│                                    position and size free; they BLEED past the frame edge
└─ Overlay  (methods 1, 3)          rectangle THE SAME SIZE as that frame, whatever its size · ON TOP · constraint STRETCH on 4 edges
                                     fill white (light background) / black (dark background) · 10–20 % · effect BACKGROUND_BLUR
```

## 2. Rules for the component and the frames that use it

- **The background is a separate component, the same size as the frame it backs** — a screen (e.g. 402 × 874), a card, a Live
  Activity (e.g. 370 × 150)… — `Background/<name>`, or a component set `Background` with variants (`Style=Dark`, `Style=Light`…). One
  component / variant per frame size.
- **A frame uses its background as an instance on the bottom layer** (first child, index 0), the same size as the frame, constraint
  STRETCH. A frame never draws its own gradient / image as background (the screen audit flags a drawn-in background and a background
  that is not the bottom layer — `../ux-review-handoff/scripts/audit.js`).
- **Changing the background = add a variant or edit the main component** — every screen follows. Never adjust the background per screen,
  never detach.
- **Adding a background variant is done on a COPY** of the background component, placed in its own section — the main component is
  **not touched**. The designer looks, confirms → only then is the variant merged into the main component (`scripts/background.js`
  `MODE: "merge"`, run the impact check first).
- **Handoff:** the background is a visual — **developers export it as an image**. No dev note about how it is built. Live Activity,
  widget: one solid color, built in code by the developer.
- **Inside the component:** a frame with `layoutMode NONE`, clip, **one** base fill → the shapes (solid / gradient, **bleeding past the
  edge**) → the overlay (if any) **on top**, **the same size as that frame — whatever the frame size** — constraint STRETCH on 4 edges,
  white / black 10–20 % + background blur. Three blur methods: Overlay · Layer · Combined. Blur amount computed from that frame's size.
- **Color:** shapes and gradient stops bind tokens when they exist; the overlay uses an **alpha token** instead of raw opacity. No token →
  raw values inside the visual area, recorded in `style.md`.
- The inside of the background component is a **visual area** — shape position and size are free and do not count in the raw-value
  checks.
- **System surfaces that cannot blur** — Live Activity, Dynamic Island, widget: the background is still a component `Background/<name>`
  **the size of that surface's frame**, but only **one solid color** from an alpha token — no shapes, no blur, never cloning blur layers
  from the app background (the audit flags blur on system surfaces). §8.

## 3. Three ways to blur

| Method | Do | Character |
|---|---|---|
| **1 · Overlay** | a top overlay with **background blur** | colors blend into one continuous band · changing one overlay changes the light / dark tone of the whole background · unblurred bands show easily at the frame edge |
| **2 · Layer** | **layer blur** directly on each shape, no overlay | fewer layers · each blob blurred by its own amount · keeps the shapes · no one-step tone change |
| **3 · Combined** | layer blur on the shapes **+** a background-blur overlay | the two blurs **add up** → the **smoothest** blend · neither layer needs to be very high |

## 4. Blur amount — measured on a phone screen (402 × 874)

| | Result |
|---|---|
| one layer ~90–120 | boundaries between the colors still show |
| one layer **≥ 200** | smooth |
| Combined: layer **~120** + background **~200** | smoothest |

As a share of the frame's long edge: one layer ≈ **23 %** of the long edge · Combined ≈ **14 %** (layer) + **23 %** (overlay). A frame of
another size → compute from the ratio (`BLUR: "auto"` in the script does this). Want it smoother → use Combined, do not keep raising one
layer.

## 5. Light and dark backgrounds

- Dark background → **black** overlay 15–20 % · light background → **white** overlay.
- **Light backgrounds wash out easily:** a 20 % white overlay over pastel shapes → almost only the base color remains. For light
  backgrounds use shape colors **stronger than you want to see** (mid tones, medium saturation) and / or lower the white overlay to ~10 %.
  The script warns when this is likely.
- **Frame edge:** background blur cannot sample outside the frame → shapes must **bleed past the edge** (negative position, larger than
  the visible part).

## 6. From a reference palette

1. **Measure** 4–6 main colors — hex, share of area, hue, contrast of each pair. Measure, don't feel.
2. **Assign roles:** base = the color covering the largest area (the lightest for a light background, the darkest for a dark one) ·
   shapes = the accent colors; 1–2 gradient shapes between two close accents · overlay = white / black by background.
3. **Build four versions side by side**, same shape layout: unblurred · Overlay · Layer · Combined — plus light versions if the palette
   has both tones.
4. The designer chooses → component `Background/<name>`.

## 7. Color and tokens

- The overlay uses an **alpha token** if the system has one (e.g. `alpha/white/10`, `alpha/black/20`, `overlay/*`) instead of raw opacity.
- Shape colors with a token are bound — **gradient stops can be bound too** (`gradientStops[i].boundVariables.color`). No token → raw value
  inside the visual area, recorded in `style.md` › *Raw values in the visual area*.

## 8. Platform limits — where this technique is not used

| Where | Why | Do instead |
|---|---|---|
| **Live Activity** (lock screen) | the background is only **one color with opacity**; no blur; gradients must be drawn in code | one solid color from an alpha token |
| **Dynamic Island** | the background is always **system black** | only place light-colored content |
| iOS and Android **widgets** | no arbitrary blur | solid color / gradient in code |
| **moving** backgrounds (scroll, animation) | heavy blur costs performance | export a still image, say so at handoff |

Surface details: `../apple-design-widget/SKILL.md`.
