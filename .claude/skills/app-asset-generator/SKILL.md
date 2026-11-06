---
name: app-asset-generator
description: Generate ONE image asset (icon, mascot, sticker, illustration, object) with the Gemini image MCP on a chromakey background and cut it out into a clean transparent PNG for design work in Figma, with no purple/green fringe. Use whenever the user needs an app/design asset with a transparent background, or wants the background removed from a chromakey image. For vector illustrations drawn in Figma use figma-vector-illustration.
---

# App Asset Generator

One request → **one generated image → one cut-out PNG** ready for Figma.

## Why the usual approach leaves a purple/green ring
Image models cannot output transparent pixels, so the asset is generated on a flat key color and the
key is removed afterwards. Simple removers threshold the distance to the key: an edge pixel that is
70% subject + 30% key is "far enough" to be kept fully opaque, so a 1–2px key-colored ring survives.
Over-aggressive despill then flips it to the opposite color (green → purple, magenta → green).

`scripts/remove_bg.py` fixes this by **unmixing** every edge pixel: it solves how much of the pixel is
subject vs key, removes the key in exactly that proportion, and corrects rim-light spill without
over-correcting. Always use it — never write an ad-hoc remover.

Requirements: `pip install numpy pillow scipy`

## Step 1 — Brief
Confirm only what's missing: asset ID (`AST-###`), subject, style (match the project's design
direction/tokens), main colors. Generate **one** image — no variants unless the user asks.

## Step 2 — Key color
| Subject contains… | Key |
|---|---|
| no strong green (default) | `#00FF00` pure green |
| green (leaves, plants, green brand) | `#FF00FF` pure magenta |
| both green and pink/purple | `#0000FF` pure blue |

## Step 3 — Prompt (copy this template)
```
[Subject], [style, e.g. flat vector illustration / soft 3D clay / line icon], [colors from the design tokens],
single subject, centered, fully visible, at least 10% empty margin on every side.
BACKGROUND: one solid, flat, uniform pure [KEY NAME] ([HEX]) filling the entire background.
No shadow, no floor, no gradient, no texture, no vignette on the background.
No rim light, no glow, no outline or reflection in [KEY NAME]; the subject contains no [KEY NAME].
Crisp clean edges.
```
Never write "transparent background" — the model paints a fake checkerboard.

## Step 4 — Generate (gemini-image-mcp)
Call `image_generate` once:
- `prompt`: the filled template
- `aspectRatio`: `"1:1"` (or the asset's shape: `3:4`, `4:3`, `9:16`, `16:9`)
- `outputDir`: e.g. `assets/raw` — **don't** use `savePath` with a `.png` name: the service may return JPEG
- `refImagePath`: an approved asset, when this one must match an existing style/character

Use the `filePath` returned by the tool as the input for Step 5.

## Step 5 — Remove the background
```bash
python scripts/remove_bg.py <filePath> -o assets/AST-004_mascot_happy.png
```
Defaults are measured from the image (key color, gradient, noise, spill width) — pass nothing else
unless Step 6 tells you to. It writes:
- `AST-004_mascot_happy.png` — transparent PNG, trimmed to the subject (+4px), no key color stored anywhere
- `..._original.png` — the untouched generation
- `..._preview.png` — the cut-out on white / black / gray + a 5x zoom of the edge
- a JSON report on stdout; exit code `0` = pass, `2` = failed checks, `1` = unusable input

## Step 6 — Verify (mandatory)
1. Read the JSON: `pass`, `problems`, `warnings`.
2. **Open `_preview.png` and look at the zoom yourself.** Pass only if there is no purple/green
   ring on either background and the subject isn't clipped.
3. If it fails, apply the fix from `problems` — **at most one retry**:

| Problem | Fix |
|---|---|
| fringe on the edge ring | rerun with the suggested `--edge N` |
| key color left inside the subject | regenerate with the other key color |
| subject touches the border | regenerate with more margin |
| background not a saturated key color | regenerate; the model ignored the background rule |
| `halo` warning | fine if the design has a thin dark/light outline; otherwise check the zoom |

Still failing after one retry → stop and show the user the preview with the problem; don't loop.

## Step 7 — Deliver
- Send the PNG (and the preview if anything looked borderline). Place it in Figma only if asked.
- Name files `AST-###_<name>.png` (lowercase snake_case).
- Add a row to `spec/assets.md`: ID, screen ID, prompt, key color, file, status (draft/approved).
