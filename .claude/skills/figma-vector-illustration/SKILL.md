---
name: figma-vector-illustration
description: Draws and repairs clean, layered vector illustrations in Figma (widget scenes, empty states, onboarding art) the way the design team reviewed them - shading as extra gradient fills on the shape itself so nothing spills past an edge, masks for details that must stay inside a shape, cast shadows masked by the receiving surface with a radial gradient, natural rain in two depth layers, drops on glass, one named group per object, objects in plain frames with Center constraints, widgets as one auto layout with Illustration + Content. Includes Plugin API helpers and a 4x zoom check. Use when asked to draw, redraw or fix a vector illustration or scene in Figma, or when shadows overlap, shapes poke out, rain looks fake or layers are messy. Vietnamese triggers such as "vẽ lại minh hoạ", "bóng bị lòi ra", "hạt mưa chưa tự nhiên", "gom nhóm minh hoạ", "minh hoạ vector cho widget". For generated raster art use app-asset-generator; for backgrounds use screen-background; for widget sizes use apple-design-widget.
---

# figma-vector-illustration — layered vector art that sits cleanly

**Every shadow, highlight and detail stays inside the shape it belongs to, and every object is a named group.** Small vector scenes (a
window with a plant, a skylight, a waterfall, an empty-state object) look cheap for three reasons: a shadow or highlight shape **pokes
past its shape**, effects are **flat and uniform** (every raindrop identical), and the **layer tree is a pile of "Vector"** nobody can
edit. This skill is the designer's fixes for all three, learned review by review.

Build and edit in Figma with the tool demo's build loop (`../figma-ui-flow/references/build-loop.md`): in passes, read numbers back
after every write, one screenshot per pass.

What lives elsewhere: generated raster art, icons and mascots (`app-asset-generator`, prompts in `generating-oneshot-image-prompts`);
backgrounds behind the art (`screen-background`); widget sizes, margins and surface limits (`apple-design-widget`,
`android-design-widget`); tool mechanics and `execute_code` (`figma-agent-tools`); team copies and naming (`bnnam-standards`).

Let `SKILL_DIR` be the directory containing this file.

## Need → Read
| Need | Read |
|---|---|
| Code for every technique below (multi-fill shading, mask groups, contact shadow, rain, glass drops, grouping, wrap in frames, widget build, zoom check) | `scripts/illustration-helpers.js` (below) |
| Why each technique, the numbers that looked right, what was tried and rejected, gradient transform cheat sheet | `references/techniques.md` |
| Widget sizes, margins 16 / 11, text ≥ 11 pt, no blur | `../apple-design-widget/SKILL.md` · Android: `../android-design-widget/SKILL.md` |
| Background component for the widget / screen | `../screen-background/SKILL.md` |
| Empty-state and onboarding screens the art sits in | `../mobile-ux-fundamentals/SKILL.md` · layout: `../mobile-ui-master/SKILL.md` |
| `execute_code`, `screenshot`, `render_tree` | `../figma-agent-tools/SKILL.md` |
| `_Fix AI` copies, own section, designer edits win | `../bnnam-standards/SKILL.md` |

## When to use
- Draw a vector scene or object in Figma: widget art, empty state, onboarding illustration, small decorative object
  (*"vẽ minh hoạ vector cho widget thời tiết"*, *"vẽ cảnh cửa sổ có cây"*).
- Fix an existing one: *"bóng bị lòi ra"*, *"bóng đè lên khung"*, *"hạt mưa chưa tự nhiên"*, *"gom nhóm minh hoạ"*, *"layer lộn xộn"*.
- Rebuild a widget or card that holds art into the two-frame structure (rule 5).

Not for: a generated image or a transparent PNG asset (`app-asset-generator`); a color-blend background (`screen-background`).

## Before you start
| Check | If missing |
|---|---|
| The target node (link or name) and which state (Rain, Sun, Empty…) | ask the designer |
| The surface size — widget family / card / screen block | `apple-design-widget` sizes, or read the target frame |
| Is it the designer's frame? | work on a copy next to it (`<name> · B3`, `_Fix AI`) — never on the original |

Reads: the target's tree (type, name, bounds, fills, strokes, rotation, mask). Writes, in Figma: a copy of the illustration / widget
next to the original, temp zoom frames (deleted before reporting).

## Core rules

### 1. Shading lives inside the shape it shades
A separate rectangle laid over a shape for shadow or light will always miss the curve somewhere — rounded corners, a tapered pot,
a tilted leaf. Instead:

| Detail | Technique | Why |
|---|---|---|
| Shadow, highlight, volume on one shape (pot body, rim, leaf half-shade, building wall) | **Extra gradient fills stacked on that same shape** — e.g. side shade = horizontal gradient transparent → dark 20–28 %; contact shadow under a rim = vertical gradient dark 35–45 % → 0 within the top 18 %; highlight sliver = hard-stop band of white 20 % | The paint can't leave the path, gradients follow rotation, edges stay soft. Developers map it 1 : 1 to stacked gradients on one SwiftUI path. |
| A detail drawn as its own line / shape that must stay within a shape (leaf midrib, reflections on glass, pattern on fabric) | **Mask group**: a copy of the shape as the bottom child with `isMask = true`, details above it | The detail can be any length; the mask trims it. |
| A shadow cast by one object onto another (pot on sill, cup on table, car on road) | **Mask by the receiving surface** + **ellipse with a radial gradient** (centre 30 % → 14 % at 55 % → 0) under the object's base | A shadow only exists on the surface that receives it. A flat solid ellipse looks pasted on and spills onto whatever is behind. |
| Shapes that really must merge or cut (a cloud from puffs, a window hole) | Boolean union / subtract | Fine for geometry. **Do not** use Boolean Intersect for shading: on rotated shapes the clones' transforms drift and the edge comes out hard. |

Dark = a darker, warmer tone of the object, never black. Remove duplicates while you are there (two identical rims stacked is common).

### 2. Natural effects are varied, layered and directional
Uniform repetition reads as a pattern, not weather. For rain:
- **Two depth layers**: far (≈ 20 streaks, length 3.5–6, stroke 0.7, opacity 22–34 %) and near (≈ 13 streaks, length 6.5–10.5,
  stroke 1.1, opacity 50–70 %), sizes in a ≈ 100 × 70 pt window.
- **Each streak is a gradient stroke**: transparent at the top → colour at the bottom, round cap — it reads as a falling drop.
- **One shared slant** (≈ 13°, wind) — never random angles.
- **Jittered columns**: split the width into columns, place one streak per column at a random offset — even coverage, no grid.
- **Starts at the cloud base and sits behind the clouds** (rain comes out of the cloud, never above it), a few faint splashes at the
  bottom edge.
- **Drops on glass** are teardrops (pointed top, round bottom, gradient 12 % → 42 %, thin 30 % stroke, small highlight 70 %), some with
  a short wavy trail above, placed on empty glass — never on clouds or other objects. Round dots read as bubbles.

The same idea applies to snow (two sizes, soft discs, slight drift), stars (varied size and opacity), leaves, sparkles.

### 3. Structure: one group per object, everything named
- Every object is a **group of its parts**: a drop = `Trail · Drop · Highlight`; a cloud = `Puff left · Puff top · Puff right · Base`; a
  leaf = `Leaf · Midrib (masked)`; a pot = `Pot body · Pot rim`.
- **Objects that belong together are one unit** — whatever the designer would move, scale or swap together: plant + pot =
  `Potted plant`; sky + rain + clouds + drops = `Scene` inside `Glass`; a lamp + its glow = `Lamp`. One click selects the whole unit;
  its parts stay editable inside. Exception: a cast shadow belongs to the surface that receives it (it is masked by it), not to the
  object casting it.
- Repeated objects sit in a **collection group**: `Rain / far`, `Rain / near`, `Rain / splash` inside `Rain`; `Glass drop × n` inside
  `Glass drops`; `Cloud / large`, `Cloud / small` inside `Clouds`.
- Names are English nouns of what it is. No layer may stay `Vector`, `Group`, `Frame 2147…`, `Clip path group`.
- Order back → front the way light and depth work: sky → rain → clouds → reflections → drops; the plant **behind** the pot rim; a shadow
  on the sill belongs to the `Sill` group.

### 4. Illustration objects in plain frames, Center constraints
Top-level units of the illustration (`Window`, `Sill`, `Potted plant`, …) are each wrapped in a **plain frame** (no fill, no clip, no
auto layout) with constraints **Center / Center**. When the Illustration frame changes size, the whole scene moves around its centre and
objects keep their positions relative to each other. Groups inside those frames are fine.

### 5. A widget (or card) with art = auto layout all the way down, related parts framed together
```
<Widget>                  auto layout vertical · padding 12 / 16 / 16 / 16 · align top-left · R22 · clip
│                          fill = the background (wall gradient) or a Background/* instance per screen-background
├─ Illustration           frame · Fill × Fill · no fill · units as frames with Center constraints
└─ Content                auto layout vertical · Hug · text ≥ 11 pt
   ├─ Temperature         text
   └─ Details             auto layout vertical · Hug
      ├─ Condition        text
      └─ High Low         auto layout horizontal · Hug ─ High · Low
```
- The widget's flow holds exactly two frames: **Illustration** and **Content**; nothing else absolute-positioned.
- **Every cluster of related elements is its own named auto-layout frame** — a row of values, an icon + label, a title + subtitle, a
  button row. Spacing between clusters is set on the parent, spacing inside a cluster on the cluster, so one number moves one
  relationship. No loose texts side by side positioned by hand; text never sits in a fixed-width wrapper (Hug).
- The same applies to a widget with no art: header, content and actions are each a frame inside the widget's auto layout.

**Exception — art that bleeds.** When the art must run to the widget's edge or past the parent's padding (full-bleed scene, an object
cut by the corner, a sky that fills the top), padding would push it in — so take **only the Illustration** out of the flow:
```
<Widget>                  auto layout vertical · padding 16 · clip · content aligned to the bottom (or where the art leaves room)
├─ Illustration           absolute position · index 0 (behind) · sized to the widget or larger · constraints Stretch / Center
└─ Content                in the flow, as above — still framed clusters, still the padding
```
- Only the art goes absolute; text, values and buttons stay in the flow so the margins of the readable content stay standard.
- Keep the widget's **clip** on, and keep the Illustration's units as frames with Center constraints so a size change re-centres them.
- Content must stay readable over the art: leave the area behind the text calm (sky, wall), or add a scrim inside the Illustration;
  check contrast at the real size.
- Say in the report that the art is absolute on purpose (bleed), so nobody "fixes" it back into the flow.
- Top padding 12 instead of the widget's standard 16 is deliberate: it gives the art room and the art has no text to protect. Sides and
  bottom keep 16 (`apple-design-widget`), so the text margins stay standard.
- If the art is taller than the space left above Content, scale the object frames uniformly to fit — then **say so** and offer the
  alternatives (smaller top padding, or redraw the art for the real box) because fractional sizes appear.

## Running the scripts
**`scripts/illustration-helpers.js`** is a library of Figma Plugin API functions, not a script to run as is. Read it, paste **only the
helpers you need** at the top of the code you send to **`execute_code{code, timeoutMs}`**, then call them and `return` the numbers you
need as JSON (ids, bounds, the scale used). Default timeout 30 s is enough for one object; pass `timeoutMs: 120000` for a whole scene.

| Helper | Rule | Does |
|---|---|---|
| `addPaints`, `shadeBody`, `shadeRim`, `shadeHalf` | 1 | stack gradient paints on the shape itself (body, rim, leaf presets) |
| `maskInside` | 1 | clip detail nodes to a shape; pins the clone's `relativeTransform` |
| `contactShadow` | 1 | radial-gradient ellipse under an object, masked by the receiving surface |
| `rainLayers` | 2 | far / near / splash rain groups, jittered columns, seeded random (a re-run is identical) |
| `glassDrop` | 2 | teardrop + highlight + optional trail, grouped as `Glass drop` |
| `groupAs`, `unnamed` | 3 | group parts (or related objects) under a name · list layers still carrying default names |
| `wrapInFrames` | 4 | wrap each top-level unit of the Illustration in a plain frame, Center constraints (group related objects with `groupAs` first) |
| `buildWidget` | 5 | widget auto layout + Illustration + Content; returns the uniform scale (report it if < 1) · `bleed: true` puts the Illustration absolute behind Content, full widget size |
| `zoomCheck` | — | clone into a temp 4× frame for the screenshot; returns its id — delete it afterwards |

## Steps
1. **Read first.** Dump the target's tree (type, name, bounds, fills, strokes, rotation, mask). Note duplicates, shading drawn as
   separate shapes, uniform repeats, unnamed layers (`unnamed()`).
2. **Work on a copy** next to the original (`<name> · B3`, `_Fix AI`) — never on the designer's frame.
3. **Fix shading** with rule 1 (multi-fill first, mask next, boolean only for geometry).
4. **Fix effects** with rule 2.
5. **Group and name** per rule 3; wrap top-level objects in frames per rule 4; rebuild the widget per rule 5.
6. **Zoom check**: clone the result into a temp frame scaled 4×, screenshot, compare with the original side by side, then delete the
   temp frame. A 170 pt screenshot hides every spill this skill is about.
7. **Report** in the user's language (below).

## Report
```
Weather widget "Window with plant" — copy "Rain · B3" next to the original
  Fixed
    shadow band 29 pt wide over a 24 pt pot body → 3 gradient paints on the body (sliver · side shade · rim contact)
    cast shadow 1.7 pt on the window frame       → ellipse 32 × 5, radial, masked by Sill
    14 identical rain streaks on a grid           → Rain / far 22 · Rain / near 13 · Rain / splash 4, behind Clouds
  Layer tree   Illustration ─ Window · Sill · Potted plant (frames, Center)   ·   0 unnamed layers
  Widget       auto layout: Illustration + Content · art scaled 0.958 to fit ⚠

Next steps
  → "top padding 8"          art at full size
  → "redraw for 138 × 92"    no fractional sizes
```
Always include: what was wrong with numbers · the technique that fixed it · the new layer tree · any scale < 1 or other decision made on
your own · the zoom check done.

## Common pitfalls
- A shadow rectangle wider than the shape below it, or covering rounded corners.
- A cast shadow as a flat solid ellipse overlapping the wall / frame behind the surface.
- Boolean Intersect for shading on rotated shapes — offset results and hard edges.
- Cloning a node into a group and assuming the position carries over: set `relativeTransform` from the source when the clone lands in
  a different parent.
- Identical repeated streaks / drops on a grid; rain drawn above the clouds; drops sitting on clouds.
- Plant drawn above the pot rim; shadow on the sill grouped with the pot.
- Related objects left as separate top-level layers (plant and pot moved one by one); content texts loose in one frame instead of
  framed clusters.
- Leaving `Vector` / `Group` names; content texts inside a fixed-width frame.
- Absolute layers without a reason — only bleeding art may leave the flow; text or buttons positioned absolutely; bleeding art forced into
  the flow so the padding squeezes it.
- Judging the result from a 1× screenshot.

## Self-check before reporting
- [ ] No shading shape extends past its owner — checked at 4×.
- [ ] Every cast shadow is masked by its receiving surface and uses a radial gradient.
- [ ] Repeated effects vary in size and opacity, share one direction, and come from the right source.
- [ ] Every object is a named group; related objects form one unit; `unnamed()` returns nothing.
- [ ] Top-level illustration objects are plain frames with Center constraints.
- [ ] Widget = auto layout with exactly Illustration + Content; every related cluster inside is a named auto-layout frame; text ≥ 11 pt;
  side and bottom margins 16. Illustration absolute only when it bleeds — clip on, behind Content, text still readable.
- [ ] Original untouched; temp zoom frames deleted.
