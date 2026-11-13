# Anchor economy — the shape first, then the fewest anchors

> Team hard rule 9 (`../bnnam-standards/references/team-rules.md` §10.3). Applies to **every** vector the agent draws or edits:
> illustrations, icons, logos, background shapes, widget art, Lottie rigs.
> Source: the designer's rule (11/2026) — agents draw a 2-anchor curve with a hundred points. No public skill had this rule, so
> it is written here. Curve fitting: Schneider, *An Algorithm for Automatically Fitting Digitized Curves* (Graphics Gems, 1990).

## Contents
1. The rule — what "optimised" means
2. Where anchors go
3. Pen-tool paths by default — primitives only when the part is that shape
4. Reference shapes and their anchor counts
5. Where wasted anchors come from
6. Anchors the shape needs — never drop them
7. Signals, not caps
8. Workflow — count, simplify on a copy, compare, report

## 1. The rule — what "optimised" means
**Optimised does not mean fewest.** It means every anchor is there because the shape needs it, and the shape is exactly the one
intended. Fidelity comes first, the count second:
- A lighter path is only accepted when its outline stays within **0.5 px** of the intended outline at 1× (**0.25 px** for icons
  ≤ 24 px) and looks identical in the 4× zoom check.
- If reaching fewer anchors would bend, flatten, round off or lose a detail, **keep the anchors**. A worse drawing with fewer points
  breaks the rule just as much as a good drawing with a hundred needless points.

Why it matters: a lean path is easy for the designer to edit (drag one handle, not forty points), renders smaller in SVG / Android
VectorDrawable / Lottie, and animates cleanly (path morph needs few, matching anchors).

## 2. Where anchors go
An anchor belongs only at:
| Place | Why |
|---|---|
| **Corners** — a break in direction (tip of a leaf, bottom of a heart, a star point) | the tangent jumps; one anchor with broken handles |
| **Inflection points** — where a curve switches from bending left to bending right (middle of an S) | one cubic cannot bend both ways |
| **Extremes** — the top, bottom, leftmost, rightmost point of a curve | handles lie horizontal / vertical there, so they are easy to edit and the curve stays smooth |
| **Ends** of an open path | — |

Everything between those points is drawn by the **handles**, not by more anchors:
- One cubic segment can draw any arc up to ~90° cleanly; a quarter circle is one segment with handles of **0.5523 × radius**
  (the circle constant).
- Handle length ≈ **⅓ of the segment's chord** as a starting point; longer = fuller curve, shorter = tighter.
- At a smooth anchor the two handles are **collinear** (one straight line through the anchor); at a corner they are independent.

## 3. Pen-tool paths by default — primitives only when the part is that shape
**Every part with a shape of its own — head, jaw, cap, mustache, nose, hand, shoe, leaf, cloud, flame — is one pen-tool path following
its outline.** Never assemble a mass from overlapping circles and rectangles: a mustache from a bar + six circles, a cap from two
ellipses + a rectangle, a nose from two circles. Few anchors, but the joins show, a rectangle leaves a flat edge, and the outline
cannot be edited as one shape. Seen in a test: 57 primitives and 3 paths for one character — blocky, rejected.

Use a Figma primitive only when the part **really is** that geometry, or is a **reusable geometric piece** of the drawing — then it has
no stray anchors and stays editable as a number:
| Shape | Use |
|---|---|
| circle, oval | `createEllipse` |
| ring, donut, arc, pie slice, progress ring | ellipse `arcData` (`startingAngle`, `endingAngle`, `innerRadius`) |
| pill, rounded rectangle, capsule | `createRectangle` + `cornerRadius` (+ corner smoothing 60%, team hard rule) |
| star, polygon, badge | `createStar` / `createPolygon` (+ `innerRadius`, `cornerRadius`) |
| straight line | `createLine` |
| button, rivet, buckle hole, dot, eye that is a circle, coin | the matching primitive — reused as is |
| a hole cut through a geometric part (ring, washer, buckle) | boolean **subtract** of primitives |

Not a primitive: anything organic or drawn — a cloud is one path (6–10 anchors), not a union of circles. Checks: `stackedPrimitives()`
and `fakeEdges()` in `scripts/illustration-helpers.js`. Never flatten a boolean unless the designer asks — flattening multiplies
anchors (§5).

## 4. Reference shapes and their anchor counts
Starting points when drawing by hand. A drawing may differ; these show the scale.
| Shape | Anchors | Where |
|---|---|---|
| leaf, lens, eye outline | 2 | the two tips (corners); each side one cubic |
| teardrop / raindrop | 3–4 | the point + the round bottom's extremes |
| circle drawn as a path | 4 | top, right, bottom, left — prefer an ellipse node |
| egg, bean, pebble | 4 | the four extremes |
| heart | 4–6 | top dip and bottom tip (corners) + the two lobe tops |
| S-curve, swoosh | 3 | two ends + the inflection |
| wave | 1 per crest / trough + ends | the extremes |
| speech bubble | rounded rectangle + 3 for the tail | |
| simple mascot head | 4–8 | extremes + ears / chin corners |
| mustache with 5 scallops | ~14–18 | two tips, top arch extremes, one dip + one crest per scallop |
| line icon glyph (24 px) | usually ≤ 12 per path | corners + extremes; strokes stay strokes |

## 5. Where wasted anchors come from
| Cause | What it looks like | Fix |
|---|---|---|
| A curve **computed point by point** (sin, arc, spiral in a loop of `L` commands) | dozens of tiny straight pieces turning the same way | write the cubic Béziers directly (§2) or run `simplifyPath` |
| **Collinear anchors** on a straight edge | 3–5 anchors on one line | drop them; one segment per straight edge |
| **Duplicate anchors** | two anchors at the same spot | drop one |
| **Image trace** (vtracer, potrace, "vectorize") | hundreds of anchors, wobbly edges | trace only as a guide; redraw on top with primitives and lean paths, or simplify and check at 4× |
| **Flatten / outline stroke / outline text** | a boolean or stroke turned into a dense outline | keep booleans live, strokes as strokes, text as text; flatten only on request, then simplify |
| **Imported SVG from a generator** | dense paths, many tiny segments | simplify, then check |
| **Smoothing by adding points** | extra anchors placed to make a curve look rounder | lengthen the handles instead |

## 6. Anchors the shape needs — never drop them
- Corners that give the shape its character: the tip of a leaf, a claw, the notch of a bitten apple, a jagged leaf edge, a sharp chin.
- Small features: the corner of an eye, a nostril curve, a finger gap, a serration, a 1 px notch in a logo — `simplifyPath` keeps
  them because removing them fails the deviation check; drawing by hand, keep them too.
- Brand / logo outlines: match the original exactly (`../bnnam-standards/references/screen-building-lessons.md` §7); never trade
  logo accuracy for a lower count.
- **Animation:** a path that morphs between keyframes needs the **same number of anchors in every keyframe** — adding an anchor so two
  poses match is correct, not waste. Rigged parts (Lottie) are separate shapes per moving part; never merge parts to save anchors.

## 7. Signals, not caps
These numbers tell the agent when to **look again**, not a limit to force a shape under:
| Kind of shape | Look again above |
|---|---|
| simple geometric shape (leaf, drop, bubble, badge) | 6 |
| organic shape (cloud outline, plant, blob) | 12 |
| one part of a character (head, hand, torso) | 16 |
| one icon path (24 px) | 12 |
| anything | 150 — likely traced or flattened art (the plugin audit flags it) |

Above the number → find the cause in §5. Nothing wasted → keep it and say why in the report (*"hand 22 anchors — five fingers"*).

## 8. Workflow — count, simplify on a copy, compare, report
1. **Draw lean from the start**: one pen-tool path per part (§3), anchors only at the places in §2, curves by handles. Copy jobs:
   take the outline from the reference with `scripts/contour.cjs` instead of placing anchors by eye.
2. **Count**: `anchorReport(root)` (`scripts/anchors.js`) lists every vector with `anchors`, `couldBe` (after a fidelity-checked
   simplify), `removable` (collinear / duplicate), `polylineRuns` (curves drawn point by point). Read-only.
3. **Simplify on a copy** of the designer's art: `optimizeAnchors(node, { tol })` rewrites only vectors where a lighter path stays within
   `tol`; corners (tangent break > 25°) always stay anchors. Default `tol: 0.5`; icons ≤ 24 px `tol: 0.25`.
4. **Compare**: `zoomCheck` the original and the copy side by side at 4×. Any visible difference → undo that vector (keep the
   original), or redraw it by hand per §2. Also read `boundsDrift` from `optimizeAnchors` — above 0.5 px means the outline moved.
5. **Report** per vector: `before → after anchors, max deviation`; vectors kept dense and why.

The plugin audit (`audit_design`, kind `vector-anchors`, 🔵 suggestion) and the screen audit (`ux-review-handoff` `audit.js`,
`vectorAnchors`) flag the same waste signals; they never rewrite a path — the fix is always this workflow.
