# Motion principles — timing, easing, choreography, character motion, checks

Absorbed as thinking (11/2026) from LottieFiles/motion-design-skill (MIT), dylantarre/animation-principles (MIT) and
iabhi1610/rive-animation-skill (MIT); numbers checked against each other, conflicts settled here. Applies to Lottie and Rive alike.
Left out on purpose: "always three motion layers" (it contradicts the same source's mobile budget of 1–2 properties — primary /
secondary / ambient are tools, not a quota), the "Apple" labels on (0.25, 0.1, 0.25, 1) (that is CSS `ease` / the old Core
Animation default; UIKit's easeInOut is (0.42, 0, 0.58, 1) and modern iOS uses springs), web/CSS performance advice, After Effects
expressions (lottie-ios / -android do not run them), colour-psychology tables, parallax on single icons.

## Contents
1. Decide first — a procedure
2. Durations
3. Easing (the names `lottie-build.cjs` knows)
4. Choreography — stagger, overlap, one hero
5. Patterns — feedback, press, entrance / exit, loaders, ambient loops
6. Character and object motion — the 12 principles with numbers
7. Keyframe economy
8. Checklist, troubleshooting, reduced motion

## 1. Decide first — a procedure
1. **Purpose** → the motion: feedback (short, ease-out, minimal) · reveal (ease-out) · conceal (ease-in, ~70 % of the entrance) ·
   emphasis (scale or colour pulse) · ambient (slow sine loop) · celebrate (overshoot + a secondary action) · explain a relationship
   (position).
2. **Frequency**: seen 100× a day → fast and subtle; seen once (onboarding, reward) → may be dramatic; a stressed user (error,
   payment) → calm.
3. **Personality** — one per project, ~90 % of its motion: Corporate (UI default) · Playful (illustration default) · Premium ·
   Energetic. One signature curve for ~80 % of the motion, a palette of 3 durations, one entrance pattern. A moment may borrow
   (a corporate app's playful success).
4. **Properties** — the fewest that tell it: 1 is direct, 2 the sweet spot, 3+ risks overload; mobile 1–2. Entrance = position +
   opacity · success = scale + colour · error = position shake + colour · loading = rotation + opacity · toggle = position + colour
   · delete = scale + opacity. Never opacity alone for an important state change.
5. **Duration** = type table (§2) × distance × weight; mobile ×0.8.
6. **Easing** by direction (§3).
7. **Choreography** (§4).
8. **Beat sheet before any key** — times, parts, values, ease, one line each (SKILL step 3). A vague brief: at most 3 questions,
   once; everything else from the defaults here. Always settle: loop, play once, or wait for the app (segments / states)?

Narrative split by total length: 100–200 ms → action 60–70 %, resolution 30–40 % · 200–400 ms → anticipation 10–15 %, action
40–50 %, reaction 10–15 %, resolution 25–30 % · 400–800 ms → 15–20 / 30–40 / 15–20 / 20–25 %.

## 2. Durations
| Element | ms |
|---|---|
| touch acknowledgement | < 100 |
| tooltip / micro-feedback | 80–120 |
| button press / toggle | 120–180 (press 60–80 down) |
| icon transition | 150–250 |
| card enter / exit | 200–350 |
| sheet / modal | 300–400 |
| page / view | 250–350 mobile (400–600 large) |
| state icon (success / error / warning), plays once and settles | 400–1250 (30–75 frames @ 60) |
| loader / seamless loop | 1000–2000 per cycle |
| celebration / reward | 1200–2000 |
| onboarding illustration beat | 800–1200 per step, 4–6 steps |
| ambient loop | 2–20 s |

Functional UI ≤ 400 ms. Exit = 65–75 % of its entrance. Distance: 50 px ×0.8 · 100 px ×1 · 200 px ×1.3 · 300 px ×1.5 · full screen
×1.8–2. Weight: heavy (overlay) 300–500 ms, 0 % overshoot · medium (card) 200–350, 3–5 % · light (badge, icon) 80–200, 5–15 %.
Personality palettes (quick / standard / slow ms): Playful 150 / 250 / 400 · Premium 350 / 500 / 800 · Corporate 200 / 300 / 450 ·
Energetic 100 / 180 / 300. Frames: at 60 fps one frame = 16.7 ms; 2–4 frames = 33–67 ms.

## 3. Easing — the names `lottie-build.cjs` knows
| Name | Bézier | Use |
|---|---|---|
| `standard` | 0.2, 0, 0, 1 (Material 3 standard) | default, on-screen change |
| `out` | 0.05, 0.7, 0.1, 1 (M3 emphasized decelerate) | entering, landing, settling |
| `in` | 0.3, 0, 1, 1 (M3 accelerate) | leaving |
| `inout` | 0.42, 0, 0.58, 1 (UIKit easeInOut) | swing, travel on screen, shake |
| `sine` | 0.37, 0, 0.63, 1 | ambient loops, breathing, float |
| `back` | 0.175, 0.885, 0.32, 1.275 | ≈ 10 % overshoot pop-in |
| `release` | 0.34, 1.56, 0.64, 1 | press release |
| `linear` | — | rotation of spinners, progress only — never spatial travel |
| `hold` | — | a jump on purpose (blink, frame swap) — a hold where motion was meant snaps ("slideshow") |
Unsure → 250 ms `standard`. Overshoot budget: error 0 % · premium 0 % · feedback 2–5 % · success 5–10 % · celebration 15–25 %;
beyond 25 % looks broken. Lottie has no runtime spring: bake a spring as an overshoot key + a settle key (2–4 frames of settle),
or one segment whose bézier y goes past 1 (`back`, `release`). Rive has elastic / cubic-value interpolators for the same thing.

## 4. Choreography
- **One hero per beat** — it gets the largest move and the strongest curve; supporting parts quieter, same easing family.
- Supporting parts start within 50 ms of the trigger, stagger 2–4 frames (33–67 ms) behind the parent, and may land at different
  times. Stagger tables: micro 20–40 ms per item (< 200 ms total) · standard 50–100 (< 400) · dramatic 100–200 (< 600); hard cap
  500 ms total, mobile −30 %. Overlap of steps 30–50 %.
- With 3+ parts at most 1/3 move at once; leave 100–200 ms of stillness between beats; opacity starts after motion begins and ends
  before it settles; everything enters from one direction / origin.
- Multi-element: a shadow follows its object 50 ms later and shrinks 10–20 % as the object lifts; depth speeds 1.0 / 0.5 / 0.2.
- One value drives synced properties (a knob's position, its colour and the fill all agree).

## 5. Patterns
- **Success (check)**: container 0.9 → 1.0 over 200 ms `back` (5–10 %); check draws (trim) 150–200 ms `out`, starting 100 ms after;
  colour changes TO green over 200 ms (not born green); optional sparkle 300 ms after. Total 400–500 ms, hold ~3 s if it
  auto-dismisses. From a spinner: crossfade 200 ms, then the check.
- **Error**: horizontal shake 2–3 cycles, shrinking, `inout`, 300–400 ms, 4–8 px on a mobile icon, ends exactly at rest, no
  overshoot; red flashes then settles. Errors stay until acknowledged.
- **Warning**: scale in 150 ms with a slight overshoot; optional 2–3 s sine pulse.
- **Loading**: spinner ~1 s per turn `linear`; indeterminate 1.5–2.5 s `inout`; shimmer 1.5–2 s (base 10–20 % opacity, peak 30–40 %).
  Show after 200 ms, keep at least 500 ms. Loader → content overlap 100 ms. In one Lottie: markers `loading` (loop) + `success`.
- **Press**: Playful 0.95 in 60 ms → 1.05 in 80 → spring to 1 in 120 · Corporate 0.97 in 60 → back in 100 · Premium 0.98 in 80 →
  back in 150, no overshoot. Pair a haptic (iOS `.selection/.success/.warning/.error`, Android TICK / CLICK / DOUBLE_CLICK /
  HEAVY_CLICK). Toggle 120–200 ms `inout`, ~2 px overshoot.
- **Entrance**: slide 20–40 px (playful 30–50 with 10–15 % overshoot, premium 15–25, none) 200–350 ms; scale-in from 85–95 %
  (playful 70–80, premium 95–98) 250–400 ms; an illustration that assembles: parts stagger 50–100 ms in depth / reading order,
  300–600 ms total, children 50–100 ms after their container. **The last frame equals the Figma art.**
- **Exit**: fade or shrink to 85–98 % over 150–250 ms `in`; content leaves before its container; move toward where it goes.
- **Ambient loop**: breathe scale 0.98–1.02 over 3 s (indicator 0.95–1.05 / 2 s, background 0.99–1.01 / 4 s); float ±5–15 px over
  3–5 s `sine` with ±2–3° rotation offset 30 % in phase; layered floats with periods that never sync (4 / 5.5 / 3.5 s); sparkles
  0 → 1 → 0 over 0.5–1.5 s, random stagger, 8–15 items; < 20 ambient parts. Beyond ±5 % a pulse demands attention.
- **Seamless loop**: first and last keys identical in value AND speed (ease both ends the same, or go through the rest pose with
  the same velocity); every part's period divides the loop length; phase offsets, not lockstep (typing dots 120° apart over
  1.4 s). Still pleasant after 30 s? Attention loops stop after 3–5 cycles or 10 s; one attention loop on screen at a time.

## 6. Character and object motion — the 12 principles with numbers
- **Squash & stretch**: squash ≈ [1.2, 0.8], stretch ≈ [0.85, 1.15], volume constant; impact 2–4 frames, recovery 4–8; soft 5–10 %;
  UI 0.95–1.05; none on rigid / premium objects.
- **Anticipation**: opposite direction, 10–20 % of the move, 100–200 ms (4–8 frames); UI: dip 2–3 px or 0.97. Skip under 150 ms
  and on direct touch (the press is the anticipation).
- **Follow-through & overlap**: children 2–4 frames (50–150 ms) behind the parent; trailing parts stop 100–200 ms later, small
  parts settle last; settle overshoot 2–5 %; a heavy impact 2 frames of contact, 12+ to settle. Key the parent, delay the child —
  a bell's clapper lags its bell, a leaf lags its stem, ears lag the head.
- **Secondary action**: 30–50 % of the primary's amplitude, 50–100 ms later, a different ease (blink, ear lag, weight shift). If it
  distracts, cut it.
- **Arcs**: things thrown, swung, jumping travel on curves — offset the mid key 10–20 px off the straight line (5 corporate, 20+
  playful); fastest at the bottom of a swing, slowest at the top (so: `inout` per swing segment, amplitude decaying).
- **Slow in / slow out**: every spatial segment eased; linear only for constant spin.
- **Timing** (24 fps vocabulary, ×2.5 for 60 fps): blink 2–4, quick gesture 6–8, step 12–16, reaction 8–12 + hold. Moving holds,
  not dead stops; fast only reads fast next to slow.
- **Exaggeration**: playful 15–25 %, energetic 20–30 %, corporate 0–5 %, premium 0; rotation overshoot ±5–15°.
- **Staging / appeal**: one clear silhouette per pose, no perfectly symmetric "twin" poses, contrast of big / small and fast /
  slow; each character its own tempo and one signature gesture.
- **Solid drawing**: flat 2D by default; fake depth with scaleX only when asked; proportions constant across keys.
- **Pendulum / swing** (bells, signs, lamps): pivot at the hanging point, amplitudes decaying ≈ ×0.6 per half swing (14° → −9° →
  5° → −3° → 0), each half swing `inout`, the hung part (clapper) 4–6 frames behind and ~1.3× the angle.

## 7. Keyframe economy
One eased segment instead of sampled linear keys; overshoot from the curve or one settle key, not three; key only what changes; key
the parent group, not every child; a hold pose is one key; loops by matching ends (Lottie) or `loop` / `pingPong` (Rive); stagger
by time offset; data-driven values (progress, counts) are bound in Rive, segments / markers in Lottie, never hand-keyed. Fewer keys =
smaller file and fewer seams.

## 8. Checklist, troubleshooting, reduced motion
Check before delivery: no linear spatial travel · durations from §2 · entrance eases out, exit in · exit ≤ entrance · no opacity-only
state change · total stagger < 500 ms · followers 50–150 ms behind · one hero per beat · ≤ 1/3 moving at once · same interaction =
same motion · fine on the 100th viewing · readable at 0.5× · recognisable within 100 ms · < 20 animated parts · 60 fps (30 ok for
ambient) · loop seam invisible · **final (or rest) frame = the Figma art**.

| Looks | Fix |
|---|---|
| floaty | more ease at both ends, a 2–4 frame settle, an impact squash |
| stiff / robotic | arcs, offset parts by 1–3 frames, vary anticipation |
| unreadable | fewer moves, longer key poses, stronger silhouette |
| lifeless | one secondary action or overlap, varied timing |
| slow | ease-out instead of in-out, smaller or no anticipation |
| jarring | a 50–100 ms settle |
| distracting | 1/3 rule, smaller amplitude, one hero |
| several faults | fix timing and arcs first; last resort: strip secondary motion and check the primary alone |

**Reduced motion** (deliver it, do not leave it to the developer): slide → fade · bounce → plain ease-out · parallax → static ·
choreography → one fade · ambient loop → static or a faint opacity pulse · loader → static indicator or opacity pulse. No overshoot,
duration −50 %. Never autoplay loops; a pause control for anything > 5 s (WCAG 2.2.2); no flashing > 3 per second (WCAG 2.3.1).
Safe: fades, colour, scale < 5 %. Always hand over a static final frame as the fallback.
