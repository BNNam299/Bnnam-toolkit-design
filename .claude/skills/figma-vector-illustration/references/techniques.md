# Techniques — what the designer reviewed and why each fix works

> Source: design-team review rounds on an iOS Weather widget illustration ("Window with plant", Rain state) — the accepted fixes, complete

Each section: the complaint, the cause, the fix that was accepted, the numbers that looked right.

## Contents
1. Shadow band spilling past the pot
2. Cast shadow lying on the window frame
3. Leaf veins poking out
4. Rain that looked like a pattern
5. Drops on the glass that looked like bubbles
6. Layer tree and grouping
7. Widget structure
8. Gradient transforms cheat sheet
9. Zoom check

---

## 1. Shadow band spilling past the pot
**Complaint:** "các phần bóng vẽ chưa được tinh tế … shape đặt gọn vào" — a dark band under the rim stuck out at both rounded ends.
**Cause:** the band was a 29 × 2 rectangle over a 29 pt rim with radius 3 and a 24 pt tapered body. Also the rim was duplicated.
**Tried and rejected:** Boolean Intersect (body clone ∩ rectangle). On shapes with rotation the clones landed offset, and the result has a
hard straight edge that reads as a stripe.
**Accepted:** stack paints on the body itself:
| Paint | Gradient | Stops |
|---|---|---|
| highlight sliver | horizontal | white 0 → hard band 22 % between 0.13 and 0.20 → 0 |
| side shade | horizontal | dark 0 until 0.55 → 28 % at 1 |
| rim contact shadow | vertical | dark 45 % at 0 → 0 at 0.18 |
Rim: one vertical paint — white 35 % at 0 → 0 at 0.35 … dark 0 at 0.7 → 30 % at 1.
Dark = a darker, warmer tone of the object (pot `#7A3A1F` on `#E79566`), never black.

## 2. Cast shadow lying on the window frame
**Complaint:** "bóng từ bình đổ xuống là 1 hình ellipse đang đè phẳng lên cả bệ cửa sổ lẫn khung cửa".
**Cause:** solid ellipse 34 × 4.4 at y 96.3–100.7 while the sill top starts at y 98 → 1.7 pt lay on the frame; hard edge.
**Accepted:** group `Pot shadow (masked by sill)` = sill clone (mask) + ellipse 32 × 5 centred under the base, top at base − 2.2,
radial gradient `#5A4632` 30 % → 14 % at 0.55 → 0. The group belongs to the `Sill` object.

## 3. Leaf veins poking out
Midrib strokes were longer than the leaves. Mask group per leaf: leaf clone (mask, solid fill) + midrib (white 35 %, 1 pt, round cap).
Leaf half-shade: an extra horizontal paint with a hard stop at 0.5 (0 → dark green 16 %) — the leaf reads as folded along the vein.

## 4. Rain that looked like a pattern
**Complaint:** "Hạt mưa chưa tự nhiên lắm".
**Cause:** 14 identical streaks 3.4 × 8.6, stroke 1.44, 60 %, almost on a grid, drawn over the clouds.
**Accepted:** see `rainLayers()`; jittered columns, two layers, gradient strokes, slant 0.24 (≈ 13°), start at the cloud base
(y ≈ 28 in a 73 pt glass), behind clouds, 4 splashes 2.6 × 0.9 at 35 % on the bottom edge. Use a seeded random so a re-run is identical.

## 5. Drops on the glass that looked like bubbles
Round dot + highlight on top of the clouds → bubbles. Teardrop path (radius r 1.0–1.6, height 2.7 r), gradient white 12 % → 42 %,
inside stroke 0.35 at 30 %, highlight ellipse 0.33 r × 0.42 r at 70 % on the upper-left of the round part, optional trail 3–8 pt with a
slight S curve, stroke 0.55 r, transparent → 22 %. Only on empty glass below the clouds, away from the plant.

## 6. Layer tree and grouping
**Complaint:** "các thành phần liên quan phải được group lại" — a drop was three loose layers.
Target tree (Rain state):
```
Illustration
├─ Window   (frame, Center)
│  ├─ Frame shadow · Frame · Mullion
│  └─ Glass (clip) ─ Glass mask · Scene
│        Scene: Sky · Rain{Rain / far, Rain / near, Rain / splash} · Clouds{Cloud / large, Cloud / small}
│               · Glass reflections · Glass drops{Glass drop × n = Trail · Drop · Highlight}
├─ Sill     (frame, Center) ─ Sill shadow · Sill · Pot shadow (masked by sill)
└─ Potted plant (frame, Center)
   ├─ Plant ─ Leaf × 5 = Leaf · Midrib (masked)
   └─ Pot   ─ Pot body · Pot rim
```
Plant and pot are one unit (they move together); the pot's cast shadow stays in `Sill`, the surface that receives it.

## 7. Widget structure
**Complaint 1:** only Content was wrapped. **Complaint 2:** "Widget là 1 auto layout, chứa 2 Frame … frame minh họa và Frame nội
dung", objects in plain frames with Center constraints.
Accepted: widget auto layout vertical, padding 12 / 16 / 16 / 16, children Illustration (Fill × Fill) + Content (Hug); wall gradient
moved onto the widget fill. Inside Content, related texts are framed as clusters (`Details` = Condition + `High Low` row), each an
auto layout that hugs its text.
**Exception accepted later:** art that must bleed past the padding (to the edge, cut by the corner) is absolute at index 0 behind Content,
the widget clips; only the Illustration leaves the flow — Content keeps the padding. `buildWidget(…, { bleed: true })`. Art 138 × 96 into a 138 × 92 box → uniform scale 0.958 — reported, with options (top padding 8 or redraw
for 138 × 92). If the designer has since adjusted the split themselves, re-read before touching it again — designer edits win.

## 8. Gradient transforms cheat sheet (shape-local, 0–1 box)
| Direction | `gradientTransform` |
|---|---|
| left → right | `[[1,0,0],[0,1,0]]` |
| top → bottom | `[[0,1,0],[-1,0,1]]` |
| radial centred, fills the box | `[[1,0,0],[0,1,0]]` on `GRADIENT_RADIAL` |
| radial, radius r, centre (cx, cy) — all in 0–1 of the box | `[[a,0,0.5-cx*a],[0,a,0.5-cy*a]]` with `a = 0.5/r` |
A hard edge = two stops 0.001 apart with different alpha.

## 9. Zoom check
A 170 pt screenshot hides 1–2 pt spills. Clone the frame (or the Illustration) into a temp frame, `rescale(4)`, offset to the area,
clip, screenshot, put the original next to it for comparison, then delete the temp frame. `zoomCheck()` in the helpers.
