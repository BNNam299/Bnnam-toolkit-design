# Series consistency

How to make 10+ images look like one product. Generator features were checked on 2026-10-18 from official docs where reachable; entries marked "verify" come from secondary sources or changed recently — confirm before relying on them.

## 1. The set-up (once per product)

1. **Style anchor.** Generate the most important image first (usually the onboarding welcome hero), iterate until it is right, and lock it. Every later image references it.
2. **Style block.** One fixed sentence pasted verbatim into every prompt: medium, line weight or render style, shading, lighting direction, camera angle, level of detail.
3. **Palette.** The hex values from the design direction's `### Imagery palette` (user-confirmed), named by role ("ground #FAF6F0, ink #1A1918, accent #D9734E"). No other colours.
4. **Character sheet** (when a recurring figure or object exists): the same descriptors in every prompt — proportions, clothing or materials, colours by hex — plus the anchor image as a reference.
5. **Background rule.** The prompt always paints one solid flat ground — the palette `Ground` hex. Transparency is a generator setting (an API option or a transparent endpoint), never a word in the prompt: asked in words, models paint a grey checkerboard into the pixels. Without a transparent setting, remove the solid ground afterwards when the image sits on a different surface.

## 2. Prompt rules for a set

- **Self-contained.** Every prompt states the style block and hex values literally; never "per the design direction".
- **Pictorial nouns only.** Describe what is visible; no abstract adjectives ("trustworthy", "modern").
- **Composition by geometry.** Name where the subject sits and which region stays empty ("subject in the upper middle; the lower third is an empty flat ground"), matching the slot's text zone.
- **No layout coupling.** Never mention screens, buttons, "app UI" or device frames — models draw phone bezels and fake buttons.
- **Raised-object separation.** When objects overlap, state which is in front and keep a visible gap or edge so they do not merge.
- **No text.** Put text, letters, numbers and logos in the Negative field; for a model without one, state it affirmatively in the prompt ("a purely pictorial scene, every surface plain") — never as a "no …" phrase (SKILL.md Gotcha 3).
- **One image per asset.** One prompt, one generated image; its colours read on both light and dark screens once the ground is removed.

## 3. Generator capabilities

| Generator | Consistency feature | Transparent output | Sizes / aspect | Notes |
|---|---|---|---|---|
| Midjourney | `--sref` style reference (weights allowed); Omni Reference `--oref` with `--ow` 0–1000 (default 100) replaces `--cref` | not found | `--ar` any ratio | Docs seen via search; verify. Paid plans own outputs; companies over $1M revenue need Pro or Mega (secondary summary — verify) |
| OpenAI GPT Image | multiple reference images on the edit endpoint; OpenAI notes it "may occasionally struggle to maintain visual consistency for recurring characters" | `background: "transparent"` with PNG/WebP on supported models; reports of gpt-image-2 transparency being withdrawn on 2026-09-30 — verify | 1024×1024, 1536×1024, 1024×1536; newer models accept custom sizes (multiples of 16, ratio 1:3–3:1, edge ≤ 3840 px) | Terms page not reachable at research time |
| Google Nano Banana (Gemini image) | Pro: up to 14 references (5 character, 3 style); 2 / 2.1: up to 10 object + 4 character references | not mentioned | 1K, 2K, 4K | Every output carries a SynthID watermark |
| Ideogram 3.0 | seed 0–2147483647 for repeatability | dedicated generate-transparent endpoint (not with FLASH speed) | multiple aspect presets | |
| FLUX (Kontext) | marketed for character consistency across edits | — | — | FLUX.1 [dev] weights are non-commercial; confirm output rights with Black Forest Labs before commercial use |
| Recraft | — | native SVG output (secondary source) | — | verify |
| Gemini image via AI Image Studio MCP (`gemini-image-mcp`) | a reference image per call (`refImagePath`) | none — JPEG only | 1:1, 3:4, 4:3, 9:16, 16:9 only (no 9:19.5, 2:3, 3:2: generate 9:16 or 3:4 and crop) | Tested 2026-10-19: ~9 s per image, palette hex held within a few units, white ground clean. No negative field — state every exclusion affirmatively inside the prompt ("a purely pictorial scene, every surface plain"). Needs the bridge running and the studio page open as a worker (Gemini Canvas or an API key) |

## 4. Delivery

- Name files after the asset: `ast-01-welcome-hero@3x.png` and `@2x`.
- Deliver PNG for flat art and anything transparent (HEIC/JPEG only for photographs — JPEG has no alpha channel), exported at the @2x/@3x pixels of the spec line.
- A JPEG-only generator (Gemini image studio) gives a solid ground: remove the `Ground` colour to transparency where the image sits on another surface, then export PNG.
- Open each file before using it and run the `ios-app-imagery` skill's `scripts/measure_coverage.py <file> --ground <hex> --target <percent>`: the ground is the palette hex or real transparency (no painted checkerboard), the art reaches its coverage, no shadow or reflection the negative excludes, no letter- or digit-like marks, the subject keeps the slot's text zone empty.
- Keep the anchor image (`AST-01`) and every final prompt so the set can be regenerated.
- Check the licence of the chosen generator for commercial App Store use before shipping.
