---
name: screen-background
description: Builds smooth color-blend backgrounds the designer's way - from a reference palette, as several shapes plus blur (Overlay, Layer or Combined) inside a separate Background/<name> component the same size as the frame it backs, placed as an instance on the bottom layer of screens, cards or Live Activities. Explores four blur versions side by side, warns when a light background will wash out, turns the chosen one into a component or adds a variant on a copy of the existing set (the main component is untouched until the designer confirms), then applies it to frames. Includes palette.py for OKLCH ramps and contrast. Use when the user sends a palette and asks for a background, a dark / light background, a background variant, or when screens draw their own gradient. Vietnamese triggers such as "làm background từ bảng màu này", "làm nền tối", "làm nền sáng", "thêm biến thể nền", "nền mờ chuyển màu". For screen layout use figma-ui-flow; for hero images use app-asset-generator; vector art figma-vector-illustration.
---

# screen-background — backgrounds from a palette, as a component

**The background is a separate component, the same size as the frame it backs** — a screen, a card, a Live Activity… The frame uses it
as an **instance on the bottom layer**. The top overlay is **the same size as that frame**, constrained on all 4 edges. Changing the
background = add a **variant** or edit the **main component** — never draw a background straight into a frame, never detach, never draw
one single gradient.

Build and edit screens in Figma with the tool demo's build loop (`../figma-ui-flow/references/build-loop.md`): in passes, read numbers
back after every write, one screenshot per pass.

Let `SKILL_DIR` be the directory containing this file.

## Need → Read
| Need | Read |
|---|---|
| Component structure, three blur methods, blur amounts, light vs dark, palette roles, tokens, platform limits | `references/technique.md` |
| Explore, make the component / variant, merge, apply | `scripts/background.js` (below) |
| Color ramps (OKLCH), sibling ramps, contrast check, mirrored dark steps | `scripts/palette.py` |
| Live Activity, Dynamic Island, widget surface limits | `../apple-design-widget/SKILL.md`, `references/technique.md` §8 |
| Color roles, contrast, dark mode | `../mobile-ui-master/references/visual-foundations.md` |
| Does the file already have a `Background/*` component, which screen size | `../design-system-audit/scripts/detect.js` |
| Impact of editing the main background component | `../design-system-audit/SKILL.md` (impact check) |
| Check screens for drawn-in backgrounds / background not on the bottom layer | `../ux-review-handoff/scripts/audit.js` |

## When to use
- The designer sends a reference palette: *"make a background from this palette"*, *"make a dark / light background"*, *"add a background
  variant …"* (*"làm background từ bảng màu này"*, *"làm nền tối / sáng"*, *"thêm biến thể nền"*).
- A new screen needs a background and the file has no `Background/*` component yet.
- A maintenance project has screens drawing their own gradient on the screen frame (the audit's drawn-in background) — propose turning
  it into a component.

**Live Activity, Dynamic Island, widget** cannot blur: still make a component `Background/<name>` **the size of that surface's frame**
(e.g. 370 × 150), but only one solid color from an alpha token — `METHODS: ["skeleton"]`, no shapes.

## Before you start
| Check | If missing |
|---|---|
| A palette — an image in `design/sources/style/` or a frame in Figma | ask the designer for the palette |
| Does the file already have a `Background/*` component (`detect.js`) | yes → **reuse it**: add a variant or use it as is — ask the designer; never build a parallel background |
| The size of the frame that needs the background — screen (the project's frame size), card, Live Activity… | `SIZE` in `background.js`, or take it from the target frame (`SIZE_FROM`) |

Reads: the palette · `style.md` · color and alpha tokens in Figma · existing `Background/*` components. Writes, in Figma: a section
`Background — <name>` (its own) · component `Background/<name>` or a new variant · background instances in screens. In the project:
`style.md` › *How the background is built*.

## Running the scripts
**`scripts/background.js`** is Figma Plugin API code. Read it, set `CONFIG`, send **the whole file** as `code` to `execute_code`
(`timeoutMs` up to ~120000 for many frames). `DRY_RUN: true` (default) reports the plan and creates nothing. Key settings:

| Key | Meaning |
|---|---|
| `MODE` | `"explore"` · `"component"` · `"merge"` · `"apply"` |
| `PAGE`, `NAME` | page to work on · background name (required) → `Background/<NAME>` |
| `SIZE` / `SIZE_FROM` | `{ w, h }`, or the name of the target frame to copy its size; neither → the most common screen size on the page |
| `PALETTE` | `{ base, shapes, overlay }` — each paint `"#hex"` · `"var:<variable>"` · `["#a", "#b"]` (linear) · `["#a", "#b", "radial"]`; overlay `[color, opacity]` or `"var:<alpha token>"` |
| `PALETTE_LIGHT` | optional light version, same layout (overlay `["#FFFFFF", 0.1]`) |
| `METHODS` | `["skeleton", "overlay", "layer", "combined"]` |
| `BLUR` | `"auto"` (from the long edge: 23 % · combined 14 % + 23 %) or explicit numbers |
| `PICK` | the chosen explore frame, e.g. `"Combined"`, `"Combined — light"` |
| `ADD_AS_VARIANT_OF`, `VARIANT_PROPS` | existing set (e.g. `"Background"`) → the variant is added on a **copy**; new variant name, e.g. `"Style=Dark"` |
| `DESIGNER_CONFIRMED` | `merge` only — `true` only after the designer confirmed the variant on the copy |
| `COMPONENT`, `SCREEN_NAMES` | `apply` — the background component / variant and the frames to place it in |

**`scripts/palette.py`** (Python standard library only; anchor numbers are heuristics — the designer reviews the table, never write it
straight into Figma):
```
python SKILL_DIR/scripts/palette.py ramp "#2F6BFF" [--steps 50,…,950] [--light 0.97] [--dark 0.22] [--keep 500]
python SKILL_DIR/scripts/palette.py match "#2F6BFF" "#12B76A" "#F79009"     # sibling ramps, same L per step
python SKILL_DIR/scripts/palette.py contrast "#FFFFFF" "#2F6BFF"            # WCAG ratio + suggested L shift if < 4.5
python SKILL_DIR/scripts/palette.py dark 50,100,…,950                        # mirrored steps for Dark mode
```

## Steps
1. **Measure the palette** — 4–6 main colors: hex, share of area, hue, contrast of each pair (`references/technique.md` §6).
2. **Assign roles:** base = the color covering the largest area (lightest for a light background, darkest for a dark one) · shapes = the
   accent colors; 1–2 gradient shapes between two close accents · overlay = white (light) / black (dark). A color matching a token → use
   the token (`var:<name>`), including gradient stops and the overlay (alpha token).
3. **Build to choose** — `MODE: "explore"`: four versions side by side, same shape layout, only the blur changes — **unblurred · Overlay ·
   Layer · Combined**. Palette with light tones too → four more light versions (`PALETTE_LIGHT`). Blur computed from the frame size
   (`BLUR: "auto"`).
4. **Read the warnings** — a light background at risk of **washing out** → the script warns; propose stronger shape colors or a ~10 %
   overlay *before* the designer looks.
5. **The designer picks** one version (or mixes: *"Combined but a lighter overlay"*) → adjust → `MODE: "component"`, `PICK` = the version:
   - no background in the file → new component `Background/<name>`;
   - the file already has a background set → **add the variant on a COPY** (`ADD_AS_VARIANT_OF`, e.g. `Style=Light`): the script
     duplicates the background set into its own section and adds the variant to the copy — **the main component is not touched**. More
     variants: run again, same copy;
   - the designer looks at the copy and **confirms** → `MODE: "merge"` (`DESIGNER_CONFIRMED: true`): the new variant moves into the main
     component, the copy is deleted. Run the impact check first. Not confirmed → the main component stays exactly as it was.
6. **Place it in frames** — `MODE: "apply"`: the instance becomes the **bottom layer** (index 0), the target frame's size, constraint
   STRETCH; a frame that already has a background → switch the variant, never stack another; a frame drawing its own gradient → that fill
   is removed. The target can be a screen, card or Live Activity — **the background component's size must match the target frame**, or
   the script reports it. Maintenance projects: only new frames and `_Fix AI` copies.
7. **Write `style.md` › *How the background is built*:** component, variant, blur method, blur amount, overlay, raw colors (if any).

**Changing the background later** — add a variant (on a copy, confirm, then merge) or edit the main component once the designer confirms
— **every screen follows**. Never tune the background on one screen.

**Handoff:** the background is a visual — developers export it as an image. No dev note about how it is built.

## Report
```
Background "Focus" — 8 versions in section "Background — Focus"
  dark: Skeleton · Overlay · Layer · Combined   (blur 201 · combined 122 + 201)
  light: … — ⚠ wash-out risk: pastel shapes under a 20 % white overlay

Next steps
  → "pick Combined"                 make component Background/Focus
  → "stronger colors for light"     rebuild the light versions
```
Always include: the palette with its roles · number of versions · wash-out warnings · component / variant created · number of screens
that received the background.

## Common pitfalls
- One big gradient painted on the screen frame — it cannot be changed app-wide and the audit flags it.
- Shapes inside the frame edge — background blur shows an unblurred band at the edge; let them bleed.
- Raising a single blur layer forever instead of switching to Combined.
- A hand-drawn blob traced or computed point by point — background shapes are ellipses / rounded rectangles, or a lean path when a
  custom form is needed (team hard rule, `../figma-vector-illustration/references/anchor-economy.md`).
- A light background under a 20 % white overlay with pastel shapes — it comes out as plain base color.
- Adding a variant directly to the designer's main background set, or merging before they confirm.
- Background instance not at index 0, or stacked on top of an existing one.
- Copying blur layers into a Live Activity or widget background.

## Self-check before reporting
- Background is a component the same size as its target frame; instances at index 0 with STRETCH.
- Overlay (if any) on top, frame-sized, alpha token where available; shapes bleed past the edge.
- Main component untouched unless the designer confirmed and the impact check ran.
- `style.md` updated; screenshot checked once at the end.
