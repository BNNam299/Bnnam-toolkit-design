---
name: generating-oneshot-image-prompts
description: Generates production-ready, one-shot AI image prompts optimized for 1:1, 3:4, 4:3, 2:3, 3:2, 16:9, 9:16 and full-screen iPhone 9:19.5 aspect ratios, plus a Series mode that keeps a whole app's image set consistent and crafted (a style from the style library, fixed style block, confirmed hex palette, a taste gate against bland clip art, stated coverage so art fills its slot) and records exact iOS sizes (pt, @2x/@3x px), safe zones and placement for each asset. Use when the user asks to write an image prompt, plan onboarding or in-app illustrations, fill an image asset list (_assets.md), create visual art/photography prompts, design marketing visuals, or optimize prompts for Midjourney, Flux, DALL-E, Stable Diffusion, or Imagen. Do NOT trigger on CSS layout, front-end image resizing, or Python image processing code requests.
---

# Purpose
Transform brief user concepts into **One-Shot Image Generation Prompts** with strict medium consistency, exact color control, and tailored spatial composition across the standard aspect ratios (`1:1`, `3:4`, `4:3`, `2:3`, `3:2`, `16:9`, `9:16`, and the full-screen iPhone ratio `9:19.5`). Ensure the image generator produces the exact intended framing and style on the first run without token contradiction.

# Gotchas
1. **Medium Cross-Contamination (CRITICAL):** Never mix 3D/photographic tokens (*lens focal length, f-stop aperture, shallow depth of field, foreground-to-background layering, realistic surface patina/grain, screen glow, environmental portrait, documentary perspective*) into a **2D Flat Vector / UI Illustration** prompt. Doing so breaks flat rendering and causes unwanted 3D shading or photorealistic artifacts.
2. **Aspect Ratio Blindness:** Never simply append `--ar 16:9` or `--ar 9:16` without adjusting spatial composition phrasing. Always use the medium-appropriate framing directives from Step 2.
3. **Inline Negative Phrasing (Zero-"No" Rule):** Never write negative words (*"no", "not", "without", "nothing", "never", "empty of"*) inside the main positive prompt (e.g., never write *"no gradient, no horizon line, nothing placed"*). Diffusion and transformer models attend to the negated nouns and render them anyway. Express all constraints as affirmative states (*"solid uniform flat fill, seamless background"*) and isolate all exclusions inside the Negative Prompt block.
4. **UI Context Leakage:** When generating illustrations or assets meant to be placed inside a mobile or web app, NEVER mention `"mobile app screen"`, `"UI background"`, or `"website layout"` inside the prompt unless an actual device mockup frame is desired. Models will hallucinate phone bezels, status bars, and buttons. Describe only the visual canvas itself.
5. **Color Drift & Abstract Prose:**
   - Never rely solely on vague color names (*"warm cream", "near-black"*) when assets must share a consistent palette or match a UI background. Always pair semantic color descriptions with explicit Hex codes (e.g., `solid uniform warm cream background #FAF6F0`, `charcoal black ink #1A1918`).
   - Eliminate abstract emotional adjectives (*"trustworthy, even-handed, quiet, deliberate"*) and filler buzzwords (*"8k, masterpiece, best quality, trending on ArtStation"*). Every token must describe a visible physical or geometric property.
6. **Bland by default (CRITICAL for app art):** "minimalist", "single small object", "centred icon", "generous negative space around the perimeter" produce clip art that sits shrunk in the middle of its slot. App images need a subject that acts, a visual metaphor, three depth layers (backdrop shape → subject → floating accents) and a stated coverage ("the group spans 90 percent of the width, cut by the bottom edge"). Run the taste gate and coverage table in `references/style-library.md` §1 and §5 for every app prompt.

# Inputs
- **Core Subject:** The main entity, scene, or graphic concept requested by the user.
- **Medium Mode:**
  - **Mode A (Photography / 3D / Cinematic):** Realistic photography, studio still-life, macro, or 3D renders.
  - **Mode B (2D Flat Vector / UI Spot Illustration):** Flat vector graphics, minimalist icons, spot illustrations, and editorial line art.
- **Target Aspect Ratio:** `1:1`, `3:4`, `4:3`, `2:3`, `3:2`, `16:9`, `9:16` or `9:19.5` (Default to `1:1` primary + quick variants if unspecified). For an app asset, the ratio comes from its surface (the `ios-app-imagery` skill's `references/surfaces.md`).
- **Color Palette / Hex Tokens (Optional):** Specific Hex codes for background, primary ink/stroke, and accent colors (Default to natural palette for Mode A, or specify cohesive Hex tokens if part of a multi-asset series).

# Procedure

## Step 1: Select the Medium Track
Determine whether the target image belongs to **Mode A (Photography / 3D)** or **Mode B (2D Flat Vector / Illustration)**. All subsequent layers MUST strictly follow the selected track.
- *Engineering Flag:* If the requested asset is purely basic geometric primitives (e.g., a blank rounded rectangle border or an exact $N \times M$ mathematical grid with zero organic illustration), include a brief note recommending native code/Figma rendering alongside the AI prompt.

## Step 2: Apply Aspect Ratio Composition Rules (Medium-Specific)
Select and inject the spatial framing directives matching BOTH the target aspect ratio and the selected Medium Mode:

| Aspect Ratio | Mode A: Photography / 3D Directives | Mode B: 2D Flat Vector / UI Illustration Directives |
| :--- | :--- | :--- |
| **`1:1`** (Square) | `Centered composition`, `tight medium or macro shot`, `subject filling 80–90 % of the frame`, `shot on 50mm f/4 lens`. | `Square 2D composition`, `subject group filling 85–90 % of the frame with a thin even margin`, `backdrop shape spanning 75 % of the width behind it`. |
| **`3:4`** (Vertical) | `Vertical portrait framing`, `rule of thirds placement`, `shallow depth of field`, `layered foreground-to-background separation`, `shot on 85mm f/2 lens`. | `Vertical 3:4 layout`, `subject group spanning 90 % of the width and 85 % of the height`, `clean flat 2D hierarchy`, `accents reaching close to the side edges`. |
| **`4:3`** (Horizontal) | `Classic horizontal framing`, `balanced mid-ground subject`, `natural studio or documentary perspective`, `shot on 35mm lens`. | `Horizontal 4:3 layout`, `side-by-side or centred 2D arrangement spanning 90 % of the width`, `strictly flat orthographic 2D plane`. |
| **`16:9`** (Widescreen) | `Cinematic widescreen framing`, `off-center rule of thirds subject`, `expansive horizontal environment`, `horizontal leading lines`, `24mm wide-angle lens`. | `Widescreen 16:9 horizontal composition`, `asymmetric rule-of-thirds 2D layout`, `scene running past the left and right edges`. |
| **`2:3`** (Tall portrait) | `Portrait framing with headroom`, `subject in the upper middle`, `50mm lens`. | `Vertical 2:3 layout`, `subject group in the upper two thirds spanning 90 % of the width`, `plain ground lower third`. |
| **`3:2`** (Wide inset) | `Horizontal 3:2 framing`, `balanced mid-ground subject`, `35mm lens`. | `Horizontal 3:2 layout`, `centred 2D subject group spanning 85–90 % of the width`. |
| **`9:19.5`** (Full-screen iPhone) | `Full-height vertical composition`, `subject in the central band`, `quiet top and bottom edges`, `35mm lens`. | `Full-height 9:19.5 vertical composition`, `scene covering every edge`, `subject in the central band`, `lower third as plain ground inside the scene`. |
| **`9:16`** (Tall Vertical) | `Tall vertical composition`, `strong vertical leading lines`, `full-body or vertical studio framing with generous headroom and foreground depth`. | `Tall 9:16 vertical composition`, `vertically stacked 2D arrangement covering the full width`, `a plain-ground band where the UI overlays`. |

## Step 3: Assemble the 5-Layer One-Shot Formula
Construct the prompt as a single cohesive, affirmative English paragraph ordered from highest to lowest token priority:

> **`[1. Medium & Canvas]` + `[2. Subject & Geometry/Details]` + `[3. State & Arrangement]` + `[4. Aspect-Ratio Framing]` + `[5. Color Palette & Lighting/Fill]`**

### Track A: Photography / 3D Formula
1. **Layer 1 (Medium & Canvas):** Define the exact photographic style (e.g., *Overhead flat lay studio macro photography*, *Restrained studio still-life photograph*).
2. **Layer 2 (Subject & Micro-Details):** Specify physical materials and tactile textures (e.g., *blank handmade cotton paper sheet with subtle laid-paper grain and soft deckle edges*).
3. **Layer 3 (State & Arrangement):** Describe physical placement and stillness or motion (e.g., *resting flat with a clean vertical gap between the journal and envelope*).
4. **Layer 4 (Aspect-Ratio Framing & Optics):** Insert **Mode A** directives from Step 2 (including focal length and depth of field).
5. **Layer 5 (Lighting & Color Palette):** Specify light direction, shadow softness, and tonal palette with Hex anchors if required (e.g., *soft diffused top-left studio daylight, monochromatic warm cream palette #FAF6F0 with gentle natural edge falloff*).

### Track B: 2D Flat Vector / UI Illustration Formula
1. **Layer 1 (Medium & Canvas):** Define the 2D graphic medium and solid background color with Hex code (e.g., *Editorial flat vector illustration with a fine even charcoal outline #1A1918 on every shape, on a solid uniform warm cream background #FAF6F0*).
2. **Layer 2 (Subject & Crisp Geometry):** Describe simplified 2D shapes, line weights, and crisp vector edges without 3D textures (e.g., *a young woman in a mustard cardigan #C5A059 reading an open hardback while walking, a small yellow bird perched on her bun, a sprig of leaves and a round wall clock floating beside her*).
3. **Layer 3 (State & Arrangement):** Specify 2D alignment, spacing, and proportions (e.g., *mid-stride, leaning slightly forward, the figure and props spanning 90 percent of the width and 85 percent of the height*).
4. **Layer 4 (Aspect-Ratio Framing):** Insert **Mode B** directives from Step 2 (strictly 2D layout and margin geometry — NO camera lenses or depth-of-field terms).
5. **Layer 5 (Color & Fill Rules):** State exact Hex color assignments and affirmative flat-fill rules (e.g., *strictly two-tone palette using warm cream #FAF6F0 and charcoal black #1A1918, uniform flat unshaded solid fills throughout with crisp vector edges*).

## Step 4: Handle Typography (If Requested)
- If text is required: Enclose the exact string in double quotes (`featuring the exact text "YOUR TEXT"`) and specify font style, color Hex, and placement.
- If text must NOT appear: Do not mention text in the positive prompt; place `text, letters, numbers, typography, watermark, signature` in the Negative Prompt block.

## Step 5: Validation Loop
Verify the drafted prompt against this checklist before outputting. Revise immediately if any check fails:
- [ ] **Zero Medium Contamination:** If Mode B (2D Vector), are all camera lenses (`35mm`, `50mm`), depth terms (`foreground-to-background`, `shallow depth of field`, `environmental portrait`), lighting glow, and realistic aging textures (`patina`, `grain`) completely absent?
- [ ] **Zero Inline Negatives:** Is the positive prompt 100% free of words like `"no"`, `"not"`, `"without"`, `"nothing"`, `"unrung"`, or `"empty of"`?
- [ ] **Zero UI Context Leakage:** Are phrases like `"mobile app screen"` or `"app background"` removed from the positive prompt?
- [ ] **Explicit Color Anchors:** Are semantic color names paired with consistent Hex codes (e.g., `#FAF6F0`, `#1A1918`) when consistency across assets is required?
- [ ] **Zero Abstract Filler:** Are non-visual emotional words (*"trustworthy, quiet, deliberate"*) and junk buzzwords (*"8k, masterpiece"*) stripped out?
- [ ] **Taste and coverage (app art):** Does the prompt pass the taste gate T1–T12 in `references/style-library.md` — a subject that acts, a metaphor, three layers, a lead colour, and a stated coverage so the art fills its slot?

# Series mode (app asset sets)

Use when the request is a set of images for one app (onboarding heroes, empty states, success moments) or an `_assets.md` file in an `ios-*` spec. Read `references/style-library.md` and `references/series-consistency.md` first; the surface, concept, composition and size come from the `ios-app-imagery` skill (its `surfaces.md`, `composition.md` and `ios-asset-sizing.md`).

1. **Style anchor** — decide once, before the first prompt: the style (one of `style-library.md` §2, as chosen in the design direction's imagery treatment) with its style block and character sheet, one fixed style block (a sentence pasted verbatim into every prompt), and the palette (hex values only from the design direction's `### Imagery palette`, user-confirmed). These live inside the prompts; `_assets.md` has no separate anchor section. `AST-01` is generated first and becomes the style reference for every later asset.
2. **Per asset** — one image per `AST-NN` (no light/dark pair), written in this order under `## AST-NN · <name>` (see the `_assets.md` template):
   - Spec line `<aspect> · <size> · SCR-NN`: aspect from the slot, size in pt at the reference device (402 × 874 pt) or the slot width with the @3x px, e.g. `1:1 · 120 pt (@3x 360 px) · SCR-10` (`ios-app-imagery` `ios-asset-sizing.md` §3, §5).
   - Composite slot (text, chips, bubbles or UI mixed into the picture): split it per `style-library.md` §3 — one `AST` per generated layer, native layers stay in the wireframe slot.
   - ```` ```prompt ```` block: only the text the user pastes into the generator, written in the order of `style-library.md` §4 — the style block verbatim + the screen's metaphor as a subject that acts (concrete nouns) + props, floating accents and the backdrop shape + coverage for that slot (`style-library.md` §5) and composition by geometry for that aspect, keeping the slot's text zone plain + palette hex — self-contained and affirmative (UI and text are excluded through the negative block, never with "no …" inside the prompt — Gotcha 3). Every colour is a palette hex value, the background is a solid palette `Ground` hex, and the colours read on both light and dark screens once the ground is removed. Never write "transparent", "transparency", "alpha" or "checkerboard" — models paint a checkerboard (`series-consistency.md` §1.5). No labels, sizes or `--ar` flags in the block.
   - ```` ```negative ```` block: text, letters, numbers, logos, watermark, UI, device frame, shadow, reflection, checkerboard pattern, plus anything the style block excludes.
3. **Validate the set** — every prompt passes the taste gate (`style-library.md` §1) including coverage, letter-free motifs and robust shapes; consecutive images change metaphor and composition; every prompt carries the same style block and only palette hex values; no image depends on baked-in text; full-bleed subjects survive a 390–440 pt crop. After generation, check every file with the `ios-app-imagery` skill's `scripts/measure_coverage.py` (ground, coverage, text contrast) and by eye (letter-like marks, hands, fragile details) before it is used.

# Output Format
Always return the final response using this exact template:

### Primary One-Shot Prompt (`[Selected Aspect Ratio]` — `[Mode A: Photography | Mode B: 2D Flat Vector]`)
```text
[Complete 5-Layer Affirmative English Prompt] --ar [X:Y]
```

### Negative Prompt
```text
[Comma-separated exclusions only — every "no/without" idea from the request lives here, never in the positive prompt]
```

### Aspect-Ratio Variants (only when the user did not fix one ratio)
For each other requested ratio, repeat the prompt with Layer 4 swapped for that ratio's directives from Step 2 (same medium track, same Hex anchors):
```text
[Variant prompt] --ar [X:Y]
```

### Notes
- Engineering flag from Step 1, when it applies (render natively instead of generating).
- Validation checklist from Step 5: all items passed.