---
name: figma-vector-illustration
description: Draws and repairs clean, layered vector art in Figma (scenes, empty states, onboarding, icons, characters) the team's way - copies a reference and scores it part by part, creates new art in an existing style (writes a prompt for the designer's image tool, then vectorizes the picked concept), shading as gradient fills on the shape so nothing spills, masks for inner details, cast shadows masked by the receiving surface, rain in depth layers, one named group per object, widgets as auto layout with Illustration + Content, one pen-tool path per part, anchors only where the shape needs them. Use when asked to draw, redraw, copy or create vector art in Figma, or when shadows overlap, shapes poke out, layers are messy or paths have too many anchors. Vietnamese triggers such as "vẽ lại minh hoạ", "bóng bị lòi ra", "gom nhóm minh hoạ", "minh hoạ vector cho widget", "tối ưu điểm neo", "vẽ nhân vật mới cùng style". Raster art → app-asset-generator; backgrounds → screen-background; widget sizes → apple-design-widget.
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
| Pen-tool paths and anchors (rule 6): where anchors go, pen-tool paths vs primitives, reference shapes and counts, where waste comes from, anchors the shape needs, signals, the count → simplify → compare workflow | `references/anchor-economy.md` · code `scripts/anchors.js` |
| The questions (copy / create / fix · who makes the concept · static / Lottie) and each kind's check: copy = keep the reference's rendering, contour + score per part; create = style traits (not structure), route A concept image from the designer's image tool → copy, route B build big to small + attach pairs, silhouette stop; fix = before / after; rounds per kind; static vs animated; icons | `references/draw-loop.md` |
| Build sheet, inventory, join list, look check with the compare sheet, finish layer (rule 9) — when and how in each kind | `references/draw-loop.md` §1 · code `scripts/compare-sheet.cjs`, `joins()` |
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
Ask these first, in one message, **in the user's language** (question text and options alike), before any drawing — they decide
how the work is made and checked:

| Question | Why it matters |
|---|---|
| **What kind of job?** · **Copy** a reference (image, screenshot, sprite) · **Create** new art from a description · **Fix** existing art | each kind has its own standard to check against — `references/draw-loop.md` §1. Never check creative work by "overlay and it lines up" |
| **Create only — who makes the concept?** · **You generate it** in your image tool (ChatGPT or any) from a prompt I write — recommended · **I build it directly** in Figma | an image model is good at composition, pose and natural shapes; the agent is good at clean, lean vectors. Route A turns creative work into a copy job (`references/draw-loop.md` §3). Say the trade-off in the option itself, in plain words: A = the most natural result (copies land within a few % of their image), B = no extra tool, but stiffer (a self-built taco came out lumpy and flat beside the set it joined) |
| **Static, or animated later (Lottie)?** If animated: which parts move? | static → parts grouped for easy editing; animated → one layer per moving part, pivots at joints, joint covers, equal anchors between poses (`references/draw-loop.md` §5). Never rig art nobody will animate |

**Copy jobs are reference work.** The team copies existing art — its own, stock art, another product's character — to study and
measure a style, or as the first step before drawing its own cast. Draw what was asked, as a reference: name the frame
`<Subject> · reference` and keep it in the working section. When the subject is clearly another company's character, say once in
the report that it is a reference only and that the app's own characters come from the create route (same style, new subject) —
then go on; the designer decides what ships.

| Check | If missing |
|---|---|
| Copy: the reference at a usable size — a part should be ≥ ~4 px per detail; a small sprite only gives a guess | say so before drawing, ask for a larger source; if none, draw and mark the guessed parts in the report |
| Create: the style to follow — existing art / icons in the file, or 1–2 references | read the file's art first; none → ask one question about style |
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
Copying soft-shaded art (skin, hair, cloth with smooth light), do what its artist did: **one shape with one gradient** for a tone that
changes across it (never bands of flat colour with seams between them), and shadows as **one see-through tint over the base**
(10–20 %, multiply for blush) — `"gradient"` / `"overlay"` / `"blend"` at lock (`references/draw-loop.md` §2).

**Details that belong inside a part stay inside it** — an eye in a face, a button on a coat, a cuff on a sleeve, a stripe on a sock,
a window in a wall. A detail poking past its owner's edge is the most visible fault of a vector drawing and the easiest to miss at
1×. Copy jobs: `vectorize.cjs` finds each detail's owner (the part behind it holding most of its border), keeps it inside, refuses a
clean shape that pokes out and reports a `draw` that does (`"inside"` in the plan to set or turn it off). Built by hand: draw the
detail within the owner's outline, or put it in the owner's mask group when it must run to the edge (a stripe across a sleeve).
Either way `spills()` comes back empty (copy: at lock, once the parts are named groups; hand-built: every pass).

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
  on the sill belongs to the `Sill` group. An object at two depths (an arm behind the body, its hand in front of a pole) is **two
  named groups** (`Arm L · back`, `Hand L`), never a patch painted in the front part's colour and never a fill that fakes a gap — a
  hole stays a hole.
- **Nest what moves or is swapped**: `Head` holds `Eye L`, `Eye R`, `Mouth` (each with its white, iris, lid, lash, light) — the
  artists' files nest this way, and a blink or a mouth swap is one layer. `build_vectors` nests a group named `Head/Eye L`.
- Ink-outline art: the ink is one outline with holes **in front of** the colours it frames, the colours run under it.

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

### 6. Pen-tool paths, the shape first, then the fewest anchors (team hard rule)
Applies to every vector — art, icons, logos, background shapes. **Optimised ≠ fewest**: every anchor is there because the shape needs
it, and the shape is exactly the intended one.
- **Draw each part as one pen-tool path that follows its outline** — head, jaw, cap, mustache, nose, hand, shoe, leaf, cloud. **Never
  build a mass by stacking circles and rectangles** (a mustache from a bar + 6 circles, a cap from 2 ellipses + a rectangle): the
  joins show, the edges go flat or bumpy, and nobody can edit the outline. `stackedPrimitives()` and `fakeEdges()` flag it.
- **A primitive only when the part really is that shape, or a reusable geometric piece**: a button, a dot, a rivet, a pill, a ring, a
  badge, an eye that is a circle. Say so when you use one.
- **Anchors only at corners, inflection points, extremes and ends**; the handles draw the curve (quarter circle = one segment, handles
  0.5523 × r). Never draw a curve as a run of short straight pieces, never add points to "smooth" a curve.
- **Fidelity before count**: a lighter path is accepted only within 0.5 px of the intended outline (0.25 px for icons ≤ 24 px) and
  identical at 4×. Corners, small features, logo outlines and the matching anchors of a morphing path stay — fewer points at the cost
  of the drawing breaks the rule too.
- **Count before reporting**: `anchorReport`; simplify on a copy with `optimizeAnchors`, compare at 4×, report before → after.
- **Copy jobs**: anchors come from the reference, not by eye — `scripts/vectorize.cjs` traces every part of the plan into a lean path
  (a 2.8× sprite mustache: 456 traced points → 18 anchors, scallops kept), then fits each piece to the cleanest shape that matches
  (rect, rounded rect, pill / circle / ellipse — rotatable —, straight polygon — `scripts/fit-shapes.cjs`; the style's shape family
  and matched sets decide close calls, rule 9.5). Parts nothing fits are **fitted as long smooth curves** read at the size of a few
  original pixels (`fitOutline` in `scripts/anchors.js`): pixel stairs never become anchors or teeth, corners stay only where the
  outline really turns. A test of 11 copies: 91–95 % short straight pieces on soft-shaded drafts → 0 %, 15–95 % fewer anchors, same
  score. Never paste a traced outline into a `draw` — it is refitted and warned about.
- Some flat styles are built by their artists from overlapping same-colour circles; a copy still delivers one path per part (an
  editable outline), smooth because of the fit.

Details, reference shapes and the signals per kind: `references/anchor-economy.md`.

### 7. Build big to small, everything attached, style ≠ structure (any subject)
Applies to characters, objects, scenes, icons alike — whenever the agent builds a form itself (create route B, or the parts of a copy
the reference does not show).
- **Style is not structure.** From a reference in the same style take only its *style traits*: palette, shape language (round / boxy /
  pointy), rendering (flat / gradient / volume), stroke or none, proportion ratios, detail density. **Never reuse its structure** —
  pose, layout, part arrangement, silhouette — for a different subject. A doctor in the plumber's style is not the plumber's body
  with a white coat.
- **Big to small.** Main mass and silhouette → secondary forms → details. Character: line of action → torso → limbs joined at their
  joints → clothing over the body → props. Object: main body → attachments (handle, lid, stand) → surface details. Scene: planes /
  horizon → main subject → secondary → effects.
- **Everything is attached to what holds it.** Limb → joint, hand → wrist, prop → hand, handle → body, object → the surface it rests on
  (contact shadow). Write the attach pairs in the build plan and check them with `floating()`. Nothing sits in the air unless it is
  meant to (sparkles, rain).
- **Plan what is in front.** Decide the overlap order before drawing; a part going behind another is hidden cleanly — no stubs peeking
  out, no hand without its arm.
- **Few strong identifiers.** 2–3 features that say what the subject is (doctor: long white coat + stethoscope); detail density no
  higher than the reference style. Every extra item must earn its place — cut the rest.

### 8. The checks decide, not the agent
A failing check is **redrawn**, or **reported as not done** with the evidence (score row, diff map crop, screenshot) for the designer
to decide. The agent never re-labels a fail as "close enough", "anti-aliasing", "small part" or "on purpose" by itself. The overall
result is the **worst** part, never the whole-figure average. `score.cjs` already ignores the anti-aliased edge band (IoU±), so a part
that still fails has the wrong shape.
**Finish the job in the run.** Everything the checks found that you know how to fix is fixed before reporting (copy: up to two
refine rounds, **locked (named, grouped) after the first**, `references/draw-loop.md` §2). The report never ends by offering "another round on the details" — that hands the
designer work you already knew about. What is left is only what needs them: a source too small to tell, an ambiguous reference, a
choice that is theirs; each with what you tried.

### 9. Read how the style is built, then check the places a score cannot see (any style, copy and create)
A whole-figure score of 0.987 passed a figure whose sleeves stood apart from the shoulders like flat cards, whose hands were lumps,
whose coat was a box where the reference tapered, and which had lost the reference's grain. Those faults live in **joins, hard parts,
shape character, shape consistency and finish** — the score measures area, not any of them. Copies have passed the score with the two
sides of a pair drawn as different shapes (one an ellipse, the other a box) and a half-covered feature drawn as a shorter, squarer
thing, while the reference drew every one of them as the same shape. Five habits, the same for every style; the style only fills in
the answers:
1. **Build sheet before drawing** (in a copy: while the automatic draft builds). Read *how* the style is constructed, not only what it shows, and write it as nine short lines:
   **shape family** (the few kinds of shape the style builds everything from — pills, rounded rects, circles, scallops, straight
   polygons — read from its biggest, clearest features) ·
   edges (curved / straight / mixed) · taper (do limbs and clothes narrow toward the ends?) · corners (sharp / soft, how soft) · joins
   (how one part meets another: overlap, a tuck, a seam line, a dark gap) · inner lines (folds, fingers, seams: lines, shapes or
   none) · hard parts (how this style draws hands, feet / shoes, face, ears — simplified to what?) · finish (grain / noise, brush
   texture, shading bands, highlights — or flat) · ratio (figure: head : body, limb thickness; object / scene: the main masses to
   each other; icon: stroke width, grid, corner radius). Each line is an observation with where you
   saw it, not an adjective. The sheet is the standard for drawing **and** for checking; copy reads it from the reference, create
   from the style reference.
2. **Joins overlap; list them and check them.** Where two parts meet, one tucks over the other (sleeve over shoulder, cuff over
   wrist, leg into hip, lid over jar) the way the build sheet says this style joins — never two edges butted side by side. Write the
   join list `[front, back]` before drawing; `joins(root, list)` must come back empty, and every join is a cell in the compare sheet.
3. **Hard parts are layered the way the reference layers them.** Hands, feet / shoes, faces, ears (and in objects: handles, hinges,
   spouts) are where a figure goes wrong. Draw them from the build sheet's "hard parts" line, as separate layers in the same order the
   reference stacks them (thumb over palm, sole under upper, ear behind the hair) — never one lump, never a generic shape from
   another style. A hard part gets its own cell in the compare sheet. **A feature cut by a piece of its holder's colour** (an
   eyelid in the head's colour over the top of an eye, a flap over a pocket, hair over an ear) is built as the designer built it:
   the feature whole, then a *cover* in the holder's colour on top — never a feature with a flat side and a brow floating above it.
4. **Look check by neighbouring regions, against an inventory, then the finish.** Before drawing, list what the reference has region
   by region (*inventory*: "head: 2 brows, nose, beard with 3 tufts, ear behind hair"). After drawing, `compare-sheet.cjs` puts
   reference | drawing side by side for every join, every hard part and a grid of neighbouring regions; answer **each cell** with what
   you saw (overlap, taper, layering, missing item, finish) — a cell answered "ok" is not checked. Last, the **finish layer** the
   build sheet lists (grain, texture, light bands) goes on top as its own named layer(s) — skipped only if the reference is flat.
   Lottie art: note finish effects the player cannot render.
5. **One shape family, matched features drawn alike.** Decide the family on the clear features, then draw the unclear ones (small,
   half hidden, bitten by a highlight) in it — a 25-pixel detail fits an ellipse and a pill within a percent, so pixels cannot decide,
   the style can. Features that are the same thing (two eyes, a pair of ears, the wheels of a car, a row of windows or buttons) are
   **one shape**: same kind,
   same width, same length, mirrored where left / right; only position and what covers them differ. A half-lidded eye is the same eye
   with a lid on it, not a shorter, squarer eye. Copy: `vectorize.cjs` votes the pill / ellipse call, matches sets and adds covers —
   check its "shape family" and "matched set" lines against your build sheet, and set `"family"` / `"same"` in the plan when they
   disagree. Create: pick the family before drawing and build every feature of a kind from it.

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
| `stackedPrimitives` | 6 | read only: masses built from overlapping same-colour primitives or a union of primitives — redraw as one path |
| `spills` | 1 | read only: small details on a base shape that stick out past it (bracelet past the arm); masks are skipped |
| `fakeEdges` | 6 | read only: a boolean that takes a straight side from a plain rectangle — the flat edge on a round cap |
| `floating(root, attach)` | 7 | read only: shapes touching nothing, and the pairs from your build plan that must touch (hand → arm, prop → hand, handle → cup) |
| `joins(root, list, min)` | 9 | read only: each `[front, back]` join overlaps by ≥ `min` px (default 2) and the front part is in front — butted edges and gaps flagged |

**Copy jobs — scripts and one plugin command** (run in a shell from the tool demo folder, `sharp` is in its `node_modules`). The agent
looks and decides; the scripts measure and trace; **never type path coordinates or colours by hand** (`references/draw-loop.md` §2:
draft first, names last).
| Script / command | Does |
|---|---|
| `scripts/vectorize.cjs --auto-plan draft.json --img ref.png --scale 4 --out draft-scene.json --rough` | **stage 1, seconds**: the draft plan + a rough scene (plain polygons) to build at once so the whole picture shows; without `--rough` the same command builds the full draft. The draft in one command: every flat-colour region → part `p01…` with seed + measured colour, traced, then **fitted to clean shapes**; a labels image, the scene, a preview, and *draw hints* for the big parts still traced — build it at once (`--palette` lists the colours only). It also reads how the art is built: `ink style` (ink placed in front), `tone steps` (bands to join as one gradient), `background colour inside the figure` (holes or parts?), `kept fine detail` (lines, dot patterns) |
| `scripts/vectorize.cjs --plan plan.json --out scene.json [--groups Head] [--render draft.png] [--dark] [--no-clean]` | every part of the plan → one whole, lean path (hidden parts filled in, seams closed, fill = the region's flat colour, clean fit), seconds (≈ 20 s for a 1254 px image of 400 parts); a part's `draw` (path, `{rect}`, `{ellipse}`) replaces its outline; `--dark` also renders `<render>-dark.png` on Figma's dark canvas (holes, seams) |
| `scripts/fit-shapes.cjs` (used by vectorize) | the clean step: each piece → rect · rounded rect · pill / circle / ellipse (rotatable, may continue under a part in front) · straight-sided polygon; close calls go to the style's shape family; matched sets drawn from one model; nothing fits → traced outline kept |
| `scripts/vectorize.cjs --names names.json --plan draft.json --to plan.json` | lock pass: names + groups from a small file of draft ids (`from`, `drop`); seeds, colours and boxes are copied, never typed |
| `build_vectors { path, groups, parentId, stage }` (figma-agent) | reads the scene file and builds / replaces those groups in the frame (`parentId` = the `frameId` of the first build, so every stage lands in the same frame; `stage` = "1 thô" / "2 khối" / "3 chi tiết" / "4 chốt" shows in the frame name, `""` on the last build = final name) — coordinates never pass through the agent; places each part by its curve (not its handles), builds gradients, opacity, blend, and nests `Head/Eye L` inside `Head` |
| `scripts/score.cjs --plan plan.json --draw draw.png [--groups Head] [--only p07,p12] --diff diff.png` | the same parts scored against the reference crop; `--only` re-scores just the refined parts |
| `scripts/compare-sheet.cjs --plan plan.json --draw draw.png --checks checks.json --out sheet.png` | rule 9 look check: one image, reference \| drawing at 2× for every join, hard part and a grid of neighbouring regions (`checks.json`: `joins`, `hard`, `grid`); `--ref` instead of `--plan` for any reference, no reference (create route B) → the drawing alone. Look once, answer every cell |
| `scripts/contour.cjs --img ref.png --color "#hex" --box x,y,w,h --scale 4 --src-px 2.8` | one outline on its own (checking a single shape); `vectorize.cjs` uses the same tracing |
| `scripts/score.cjs --ref ref.png --draw draw.png --parts parts.json --edge <original px> --diff diff.png` | per part: strict and edge-tolerant shape overlap (IoU / IoU±), box offset, colour difference ΔE, verdict; overall = the worst part; mismatch map. Screenshot reference crop and drawing at the same size and scale |

**`scripts/anchors.js`** (rule 6) — same use: paste the functions you need. Pure geometry (`parsePath`, `analyzeAnchors`,
`simplifyPath`) needs nothing else; the two Figma helpers need the whole file above them.
| Helper | Does |
|---|---|
| `anchorReport(root, { tol })` | read-only: every VECTOR under root with `anchors`, `couldBe` (after a fidelity-checked simplify), `removable`, `polylineRuns`, `maxDev` — sorted by waste |
| `optimizeAnchors(node, { tol, cornerDeg })` | rewrites one VECTOR's paths only where the new outline stays within `tol` px (both ways); corners kept; returns before / after / `maxDev` / `boundsDrift` — run on a copy |
| `simplifyPath(d, { tol })` | path data → `{ d, before, after, maxDev, changed }`; use it when writing paths from code (a designer's drawing: faithful to itself) |
| `fitOutline(d, { unit })` | a TRACED or pasted polyline outline → long smooth curves (stairs read at `unit` = one original px), corners only where it turns sharply, ≤ 1 original px from the trace |
| `pathBounds(d)` | the curve's own bounds (not its handles) — the box Figma places a vector by |

## Steps
0. **Ask the questions** (Before you start, in the user's language): copy / create / fix · for create, who makes the concept ·
   static / Lottie. Then follow that kind's route in `references/draw-loop.md` (§2 copy · §3 create · §4 fix) — the steps below run
   inside it. Copy and create both start with the build sheet, inventory and join list (rule 9). In a copy the passes of §2 replace
   steps 2–5 (the result is a new frame; naming and grouping happen at its lock pass); the designer sees it grow in that frame in four
   stages — rough · masses · details · lock — each built as soon as it exists, one chat line each, no stop between them.
1. **Read first.** Dump the target's tree (type, name, bounds, fills, strokes, rotation, mask). Note duplicates, shading drawn as
   separate shapes, uniform repeats, unnamed layers (`unnamed()`), masses of stacked primitives (`stackedPrimitives()`).
2. **Work on a copy** next to the original (`<name> · B3`, `_Fix AI`) — never on the designer's frame.
3. **Fix shading** with rule 1 (multi-fill first, mask next, boolean only for geometry).
4. **Fix effects** with rule 2.
5. **Group and name** per rule 3; wrap top-level objects in frames per rule 4; rebuild the widget per rule 5.
6. **Shapes and anchors** (rules 6–7): `stackedPrimitives`, `fakeEdges`, `spills`, `floating` must come back empty or with a stated
   reason;
   `anchorReport` on the result; simplify wasted vectors on the copy with `optimizeAnchors`; anything still above
   the signals in `references/anchor-economy.md` §7 → find the cause or say why it is kept.
7. **Zoom check**: clone the result into a temp frame scaled 4×, screenshot, compare with the original side by side, then delete the
   temp frame. A 170 pt screenshot hides every spill this skill is about. Copy jobs: `score.cjs` per part too — "it lines up" is
   never a check. Then the look check (rule 9): `joins` + `compare-sheet.cjs`, every cell answered; the finish layer last. Loop
   steps 3–7 until a round finds nothing — rounds per kind in `references/draw-loop.md` §1.
8. **Report** in the user's language (below).

## Report
```
Weather widget "Window with plant" — copy "Rain · B3" next to the original
  Fixed
    shadow band 29 pt wide over a 24 pt pot body → 3 gradient paints on the body (sliver · side shade · rim contact)
    cast shadow 1.7 pt on the window frame       → ellipse 32 × 5, radial, masked by Sill
    14 identical rain streaks on a grid           → Rain / far 22 · Rain / near 13 · Rain / splash 4, behind Clouds
  Layer tree   Illustration ─ Window · Sill · Potted plant (frames, Center)   ·   0 unnamed layers
  Anchors      Leaf × 6: 2 each · Pot body 186 → 6 (max 0.31 px) · Cloud one path, 7 anchors · Hand 22 kept (five fingers)
  Checks       stackedPrimitives 0 · fakeEdges 0 · spills 0 · joins 0
  Widget       auto layout: Illustration + Content · art scaled 0.958 to fit ⚠

Next steps
  → "top padding 8"          art at full size
  → "redraw for 138 × 92"    no fractional sizes
```
Always include: what was wrong with numbers · the technique that fixed it · the new layer tree · any scale < 1 or other decision made on
your own · anchors before → after with the max deviation, and any vector kept dense with its reason · the zoom check done.
"Next steps" are decisions for the designer (a size, a variant, a choice between readings), never "shall I fix the rest?".

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
- A curve written as a loop of `L` points (circle, wave, arc computed in code); a traced or flattened outline delivered as is; extra
  points added to smooth a curve instead of longer handles.
- Cutting anchors until the shape changes — a rounder tip, a lost notch, a logo off by a pixel. Fidelity first.
- A part built from stacked circles and rectangles — a mustache bar with circle scallops, a cap from ellipses + a rectangle (flat
  edge), a nose from two circles, an arm as a plain tube cut flat at the top. Seen in a test: few anchors, blocky drawing.
- Copy job reported as "lines up" from a 55 % overlay of the whole figure while the head, cap and mustache were off — score per part.
- Rigging (joints, pivots, one layer per moving part) for art that stays static; or the reverse — animated art drawn as one merged shape.
- Creating a new subject on the reference's skeleton (same body, pose, layout) instead of taking only its style traits.
- Parts laid side by side instead of joined: an arm standing next to the body, a hand floating over a bag with no arm, a stethoscope
  lying on the coat with tubes going nowhere; nine accessories piled on one small figure.
- Explaining a failing score away ("anti-aliasing", "small part") and reporting the whole as passed; adding gradients or effects the
  reference does not have when copying.
- Questions to the designer written in English when the designer writes Vietnamese.
- A high whole-figure score taken as "done" while joins butt, hands and shoes are lumps, clothes are boxes where the reference
  tapers, and the reference's grain is missing — the score cannot see any of these; the look check can.
- Clean-shape fitting that turns every part into a rectangle: correct size, wrong character. The build sheet decides how round,
  how tapered.
- A detail that should sit inside a part laid over it and poking out past its edge (a button past the coat, an eye past the face).
- Ending a finished-looking run with "want me to do one more round on the details?" when the fixes were already known.
- Each feature fitted on its own pixels: the two of a pair drawn as different shapes, ellipses in a style built from pills; a
  half-covered feature drawn shorter and squarer instead of whole under its cover.
- A traced outline delivered as a staircase (hair of 549 anchors, 89 % straight pieces of 3 px — teeth along every edge), or pasted
  into a `draw`.
- Soft shading copied as flat bands with hard seams (5 hair tones, a striped arm) instead of one gradient; shadows as opaque
  darker shapes instead of one see-through tint.
- A white "Gap" part painted where the reference has a hole; a `… cover` in the front part's colour to fake the stacking order.
- Ink outline at the back of ink-outline art — every colour must then fit the line exactly; the misses show as dark slivers.
- A whole face as one flat group of 20+ layers — no `Eye L` / `Mouth` groups to blink or swap.
- Seams, creases and halftone dots dropped as crumbs.
- Nothing on the canvas for minutes while the agent perfects the draft off-screen — build the rough stage first, then each stage as it
  comes (`references/draw-loop.md` §2).
- Upscaling the reference before drawing (9× the pixels, every step 9× slower), or reducing a soft-shaded image to N flat colours with
  a script of your own (jagged edges, banded shading).
- Raising `srcPx` to calm a noisy (JPEG) reference — curves come out as straight-sided polygons. The draft already writes `"smooth"`
  for compressed images; keep it.
- Every region in the background's colour dropped as a hole — a white face or belly punched out; decide each one, check `--dark`.

## Self-check before reporting
- [ ] No shading shape or detail extends past its owner — `spills()` empty, vectorize warnings none, checked at 4×.
- [ ] Every fixable fault was fixed in this run; the report asks the designer only what is theirs to decide.
- [ ] Every cast shadow is masked by its receiving surface and uses a radial gradient.
- [ ] Repeated effects vary in size and opacity, share one direction, and come from the right source.
- [ ] Every object is a named group; related objects form one unit; `unnamed()` returns nothing.
- [ ] Top-level illustration objects are plain frames with Center constraints.
- [ ] Widget = auto layout with exactly Illustration + Content; every related cluster inside is a named auto-layout frame; text ≥ 11 pt;
  side and bottom margins 16. Illustration absolute only when it bleeds — clip on, behind Content, text still readable.
- [ ] The three questions were asked; the checks of that kind (copy / create / fix) were run and are in the report.
- [ ] `stackedPrimitives`, `fakeEdges`: empty, or each remaining item has a reason (a button is a primitive on purpose); `spills` empty.
- [ ] Copy: `score.cjs` table in the report — whole ≥ 0.90, each part ≥ 0.85 (IoU±), ΔE ≤ 6; any failing part listed as **not done**
  with its diff crop, never explained away; overall = the worst part.
- [ ] Create: style traits written (not structure); attach pairs checked with `floating()`; 2–3 identifiers, no clutter.
- [ ] Shape family named in the build sheet; matched features (pairs, rows, repeats) are the same shape kind and size;
  features cut by a holder-coloured piece are whole under a cover.
- [ ] Copy and create: build sheet + inventory written before drawing; `joins()` empty; compare sheet looked at and every cell
  answered with what was seen; hard parts layered as the reference layers them; finish layer present when the sheet lists one.
- [ ] `anchorReport`: no `polylineRuns`, no `removable`; every vector above its signal has a stated reason; simplified vectors checked
  at 4× against the original (max deviation ≤ 0.5 px, icons ≤ 0.25 px).
- [ ] Copy: the four stages were built into one frame as they came (rough within a minute); the frame carries its final name.
- [ ] Copy: the `--dark` preview looked at once — no punched-out fill, no seam.
- [ ] Copy: the draft's readings acted on — ink group in front, tone steps joined as one gradient, holes dropped (or asked) one by one,
  fine lines / patterns named; objects at two depths are two named groups; faces nested (`Head/Eye L`…).
- [ ] Original untouched; temp zoom frames deleted.
