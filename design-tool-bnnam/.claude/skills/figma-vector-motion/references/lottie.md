# Lottie — build, player limits, check, hand-off

Format knowledge absorbed (11/2026) from diffusionstudio/lottie `text-to-lottie` (MIT — spec map, player contract, recipes, the
"look at beat frames" loop) plus standard Bodymovin knowledge; their web player / dev-server plumbing and Skottie-only rule are left
out — our target is lottie-ios / lottie-android, so the check plays lottie-web (the same player family) in the machine's Chrome.

## Contents
1. The pipeline and the files
2. motion.json — every field
3. What the build makes (so you can read the JSON)
4. Player limits — what to avoid for iOS / Android
5. The check — what each line means
6. Hand-off for developers
7. LottieFiles (optional)

## 1. The pipeline and the files
**Route A — demo in Figma, then convert (default when Figma Motion is available, `figma-motion.md`):**
```
export_rig {nodeId, path: <dir>/rig.json}                 Figma frame → data; motionApi says whether Motion is readable
write <dir>/motion.json                                   the beat sheet as keys (agent) — the plan
lottie-build + lottie-check on the plan                   seconds; the first look should already be sane
figma-apply-motion.js (execute_code | use_figma)          the plan becomes Figma keyframes; the designer watches, tweaks, approves
export_rig again                                          now with the approved keys
node scripts/figma-motion.cjs --rig rig.json --out motion.json [--loop]      Figma keys → motion.json (regenerated)
node scripts/lottie-build.cjs --rig rig.json --motion motion.json --out <name>.json | <name>.lottie
export_assets {ids:[frameId], format:"PNG", scales:[1], outDir:<dir>}   the rest pose as Figma draws it (transparent frame)
node scripts/lottie-check.cjs --anim <name>.json|.lottie --motion motion.json --ref <frame>.png --out sheet.png --preview preview.html
```
**Route B — no Figma Motion** (API off for this user): motion.json → build → check, and the designer judges `preview.html`.
Folder: `design/motion/<name>/` in the project (rig.json, motion.json, `<name>.json` or `.lottie`, `<name>-reduced.*` when made,
sheet.png, preview.html, handoff.md). The file keeps the art's name in kebab case (`bell-ring.json`).
The frame must be exported **without** a background fill (vector frames have none) — a dark or white frame fill makes the rest
check fail on the background, not the art.

**Output format — the designer chose it at step 0:**
| Format | What it is | Pick when |
|---|---|---|
| Lottie `.json` | Bodymovin JSON, text | default: every Lottie player reads it (lottie-ios, lottie-android, lottie-web, React Native) |
| dotLottie `.lottie` | the same JSON zipped with a manifest (`manifest.json` + `animations/<id>.json`), ~70–80 % smaller | the app already uses dotLottie, or the file is heavy; lottie-ios 4.x (`DotLottieFile`) and lottie-android 6.x (`LottieCompositionFactory.fromAsset`) read it, as do the dotlottie players |
The build writes `.lottie` when `--out` ends in `.lottie` (Node's zlib, nothing installed); the check reads either. Both from the
same build — making both costs one more command.

## 2. motion.json — every field
```json
{ "name": "Bell ring", "fps": 60, "duration": 1.6, "loop": true,
  "markers": [ { "name": "ring", "from": 0, "to": 1.6 } ],
  "tracks": [
    { "target": "Bell", "pivot": "Bell body@top",
      "rotate": [[0, 0, "out"], [0.2, -14, "inout"], [0.5, 9, "inout"], [0.8, -5, "inout"], [1.05, 3, "inout"], [1.3, 0, "linear"], [1.6, 0]] },
    { "target": "Bell/Clapper", "pivot": "Clapper@top",
      "rotate": [[0, 0, "out"], [0.27, 18, "inout"], [0.57, -12, "inout"], [0.87, 7, "inout"], [1.12, -3, "inout"], [1.4, 0, "linear"], [1.6, 0]] }
  ] }
```
- **target** — a group path as in Figma (`Bell/Clapper`) or a part's name (first match). Motion goes on the group that moves as one.
- **pivot** — `[x, y]` in frame px, or `"<node>@<center|top|bottom|left|right|top-left|top-right|bottom-left|bottom-right>"` of
  that node's box. Default: the target's centre. A hinge / joint / hanging point is never the centre — name it.
- **keys** `[seconds, value, ease]` — the ease shapes the segment that LEAVES the key; the last key needs none.
  - `rotate` degrees (+ = clockwise) · `move` `[dx, dy]` px from rest · `scale` % (number or `[sx, sy]`, 100 = rest) ·
    `opacity` % of the part's own opacity · `color` hex, solid fills only · `trim` `[start%, end%]` of a vector stroke's centre
    line (draw-on: `[[0.2, [0, 0], "out"], [0.5, [0, 100]]]`).
- **markers** — named segments the app plays: lottie-ios `play(fromMarker:toMarker:)`, lottie-android `setMinAndMaxFrame("name")`.
  Loading loop + success ending in one file = two markers.
- One track per target; values are offsets from the Figma pose, so **a key with the rest value IS the Figma frame**.

## 3. What the build makes
- Each top-level part of the frame → one shape layer named as in Figma (developers reach it by keypath `"Bell.**"`); its motion
  on the layer transform (anchor = position = pivot, so rest = identity).
- Groups inside → nested shape groups (`gr`) with their own transform, animatable the same way.
- A group holding a Figma mask → a null layer (its transform) + content layers parented to it; the run above the mask → one layer
  with a layer mask (`masksProperties`, mode add). A null layer passes no opacity — the build warns.
- Fills: solid `fl`, linear / radial `gf` (handles in frame px; elliptical radial drawn round — warned), each paint its own group;
  Figma's bottom → top order is reversed (Lottie draws the first item on top).
- Strokes: outlined to filled shapes (identical on every player); with a `trim` track the vector's centre line is stroked instead.
- Text: arrives as outlines (no fonts in the app). Effects, image fills, angular / diamond gradients: dropped with a warning.
- `v` 5.7.0, `fr` 60, `ip` 0, `op` = duration × fps (exclusive: the last frame is op − 1). No expressions, no 3D, no `tp`, no slots.

## 4. Player limits — what to avoid for iOS / Android
| Avoid | Why | Instead |
|---|---|---|
| blur, drop / inner shadow, glow (layer effects) | not rendered or uneven (iOS ≠ Android) | stacked tonal shapes, a soft shape at low opacity, or bake to PNG |
| blend modes | partial on Android | plain fills at opacity |
| track mattes (alpha / luma) | an offscreen pass per frame — slow on Android; luma partial on old iOS | layer masks (what the build makes) or cut shapes |
| merge paths | off on Android unless enabled | Figma boolean flattened before export |
| expressions, 3D layers, camera | not run on mobile | bake to keys |
| path morph between different point counts | breaks / pops | same anchor count in every pose, else crossfade |
| dashed gradient strokes, text on path | unsupported | outlines |
| huge layer count | layer count costs more than path count | animate groups, keep static art merged |
Masks are fine but each is an offscreen pass: use them where the art needs them (shine inside a coin), not as a habit. Keep icons on
whole pixels at rest so they stay crisp.

## 5. The check — what each line means
`lottie-check.cjs` plays the file with **lottie-web** (vendored, MIT) in headless Chrome / Edge (or `CHROME_PATH`), so what it sees is
what the player does, not what the build intended.
| Line | Means | When it is not OK |
|---|---|---|
| rest pose vs Figma | the rest frame (last for play-once, first for a loop; `--rest N`) against the Figma export: mean colour Δ and % of pixels off by > 40 | > 3 mean or > 0.5 % → a part moved at rest, a fill or order differs, a gradient handle is off — open the sheet's first cell beside the reference |
| loop seam | last frame → first, as a multiple of a normal step | > 2.5× → first and last keys differ, or speeds do not match at the seam |
| pops | a step far bigger than both its neighbours | a `hold` where motion was meant, a missing key, a key on the wrong frame |
| empty frames | frames with nothing drawn | only a fault in the middle; from-nothing entrances / to-nothing exits are reported as such |
| art leaving the canvas | frames with more art on the edge than the rest pose | the swing / bounce goes outside the frame → the app clips it: enlarge the Figma frame (padding) and re-export, or reduce the amplitude |
The **sheet** shows the beat frames (every key time, plus in-betweens) — look at it once and answer: does each pose read? do joints
stay closed? does anything poke out or vanish? is the hero clear? The numbers do not replace the look; the look does not replace the
numbers. `preview.html` is for the designer (play, scrub, 0.5×, light / dark / checker) — it works offline.

## 6. Hand-off for developers (`handoff.md` next to the file)
- File and format, size (w × h), fps, duration, loop or play-once, markers (name → frames, what the app does at each).
- How to load it: `.json` — lottie-ios `LottieAnimationView(name:)` / `LottieAnimation.named`, lottie-android `LottieAnimationView`
  `setAnimation("x.json")` or `rawRes`; `.lottie` — lottie-ios `DotLottieFile.named` / `LottieAnimationView(dotLottieName:)`,
  lottie-android `setAnimation("x.lottie")` (6.x) or the dotlottie-android player. Loop / autoplay are also in the `.lottie`
  manifest, but the app's call wins.
- Where it sits: the slot size in pt and content mode (`scaleAspectFit` / `ContentScale.Fit`); transparent background.
- Keypaths for runtime colour (lottie-ios `ColorValueProvider` on `"Bell.**.Fill 1.Color"`, lottie-android `addValueCallback`
  with `KeyPath("Bell", "**")`) — layer and group names are the API: never renamed silently.
- Reduced motion: the reduced file or the static frame to show (`currentProgress = 1` / last frame).
- Players: lottie-ios 4.x, lottie-android 6.x; no merge paths needed; no fonts; no images.
- Test notes: background / foreground, rapid replays, low-end Android.

## 7. LottieFiles (optional)
The designer has a LottieFiles account. The hosted **Creator MCP** (`claude mcp add --transport http --scope user creator-mcp
https://creator.mcp.lottiefiles.com/mcp`, then `/mcp` → creator-mcp → Authenticate) imports a Lottie JSON / SVG
(`creator_import_media`), saves to the workspace (`creator_save_to_workspace`, `creator_open_in_creator`) and exports MP4 / GIF for review (dotLottie is made locally by the build). Use it to **share or convert** a finished file, not to author: its scripts use absolute seconds, radians and
ratios, variables do not persist between calls, files come back as links, and credits are spent on generation. Authoring stays in
Figma Motion and motion.json, where the Figma art is the rest pose.
