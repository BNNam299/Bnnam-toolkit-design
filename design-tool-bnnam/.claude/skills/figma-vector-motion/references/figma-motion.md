# Figma Motion — the demo the designer approves, then the conversion to Lottie

Figma Motion (keyframes on a frame's layers, played in Figma's own timeline) is where the designer watches and tweaks a Lottie-bound
animation before anything is exported. Facts below were measured on a real file (11/2026) through the Plugin API and the official
Figma MCP (`get_motion_context`); the plugin API surface comes from Figma's `figma-use-motion` skill.

## Contents
1. Why the demo lives in Figma
2. Is Motion available? (and which tool talks to it)
3. Writing the plan into Figma — `figma-apply-motion.js`
4. What the designer may change, and what converts
5. Reading it back — `export_rig` / `figma-read-motion.js` → `figma-motion.cjs`
6. Measured facts (eases, signs, origins, springs, timeline)
7. One source of truth

## 1. Why the demo lives in Figma
- The designer judges motion by watching it, in the tool they already use, next to the art — not by reading a beat sheet or opening
  a local HTML page.
- They can fix timing or an ease by hand in the timeline; the conversion reads what they left, so a hand fix is never lost.
- The rest pose stays the Figma art (Motion stores offsets from it), the same contract as the Lottie build.
Rive work (deforming shapes, bones, states, touch) does not go through Figma Motion — `rive.md`.

## 2. Is Motion available?
- Motion is a beta API: every getter throws `"<name>" is not a supported API` when it is off for the user or the plugin. Stop at
  the first such error and say so — do not retry or work around it.
- `export_rig` reports `motionApi: ok | unavailable`. **ok** → the figma-agent plugin reads and writes Motion: run the scripts
  below through `execute_code`. **unavailable** → the same scripts run unchanged through the official Figma MCP `use_figma` (load
  its `figma-use` + `figma-use-motion` skills first; it needs a `create_session` with the file key).
- Neither works → skip the Figma demo: build the Lottie straight from motion.json and let the designer judge `preview.html`
  (`lottie.md` §1, route B). Say this in the report.
- `get_screenshot` / `screenshot` show only the rest pose, never motion. `export_video` (official MCP) renders motion server-side
  but is slow and needs `ffmpeg` on the machine to cut frames — not used by default; the agent's own frame check is
  `lottie-check.cjs` on the converted file.

## 3. Writing the plan into Figma — `scripts/figma-apply-motion.js`
Plugin API code. Set three constants at the top, send the whole file as `code`:
| Constant | Value |
|---|---|
| `FRAME_ID` | the top-level frame holding the art (Figma keeps one timeline per top-level frame) |
| `MOTION` | the motion.json object (the beat sheet as keys — `lottie.md` §2) |
| `REPLACE_ALL` | `true` for a new plan (removes every manual track under the frame first); `false` to replace only the fields written |
Per track it finds the target (group path, name or `#id`), sets the part's **transform origin** to the pivot (as a % of the part's
own box — the swing pivots where the beat sheet says, visibly, in Figma), and writes manual keyframe tracks: `ROTATION` (sign
flipped), `TRANSLATION_X/_Y`, `SCALE_X/_Y` (÷ 100), `OPACITY` (absolute = % × the part's own opacity), `PATH_TRIM_START/_END`,
fills[0] colour. Each ease moves one key forward. The frame timeline is set to `duration`. Returns the parts, fields, origins and
warnings. The top-level frame itself cannot carry keys — the moving art must be a child group.
Before writing to Figma, run `lottie-build` + `lottie-check` on the same motion.json once (seconds): the designer's first look
should not be at a pose that leaves the frame or a loop that jumps.

## 4. What the designer may change, and what converts
| Change in Figma | Converts as |
|---|---|
| key times, values, adding / removing keys | the same keys |
| ease presets, custom cubic, linear, hold | the same curve (Figma stores presets with their cubic) |
| springs (Gentle 0.25, Quick 0.42, Bouncy 0.69, Slow 0, custom bounce) | keys at the swing peaks + a fitted cubic per piece, ≤ 0.5 % off; a spring shorter than ~2 frames per piece → a key every frame |
| transform origin (pivot) | the Lottie pivot |
| X and Y (or start / end) keyed at different times or eases | sampled every 2 frames, linear — exact, more keys (reported) |
| colour keys on the first solid fill | `color`; alpha in a colour key is dropped (animate opacity) |
| width / height, corner radius, stroke weight, layout spacing, effects, colour on fill 2+ | **not converted** — warned; ask the designer to remove it or accept the static value |
| animation styles (presets applied as a style, text stagger) | **not converted** — not readable as keys; use manual keyframes |
Also not convertible: motion on the top-level frame, on hidden layers, or that depends on blur / shadow animation.

## 5. Reading it back
1. `export_rig {nodeId, path}` again **after** the designer approves — every animated node carries `motion = { origin (frame px),
   tracks (as Figma stores them), styles }`, the frame carries `timeline` (s). The summary lists the animated parts.
2. If `motionApi: unavailable`: run `scripts/figma-read-motion.js` (set `FRAME_ID`) through `use_figma`, save the result as
   `motion-read.json`, pass it with `--tracks`.
3. `node scripts/figma-motion.cjs --rig rig.json [--tracks motion-read.json] --out motion.json [--loop] [--fps 60]`
   - `--loop` when the beat sheet said loop (Figma's preview always loops; the file only does if asked).
   - Lines `·` = what changed shape on the way (springs, sampled channels) with the error; lines `⚠` = what did not convert or will
     look wrong (loop seam in Figma, a colour with alpha, a style). Answer each `⚠` in the report.
   - Targets are group paths; when two parts share a path the track uses `#<node id>`.
4. Build + check as in `lottie.md` §1 — the check's rest pose must still equal the Figma export.

## 6. Measured facts
| Fact | Detail |
|---|---|
| Ease position | Figma: on the key a segment **arrives at** (the first key's ease is unused). Lottie / motion.json: on the key it leaves |
| Rotation sign | Figma `ROTATION` + = counter-clockwise; Lottie + = clockwise |
| Transform values | translation and rotation add to the rest transform, scale multiplies; opacity, trim, size are absolute |
| Transform origin | default 50 % / 50 % (centre); settable in % or px of the node's own box, also outside it (150 %, −50 %), without moving the art |
| Spring curve | depends on bounce only, stretched over the segment: p(u) = 1 − e^(−a·u)·(cos ωu + (a/ω)·sin ωu), ζ = 1 − bounce, ω = (a/ζ)·√(1 − ζ²); a = 11.18 (bounce 0), 7.67 (0.25), 7.59 (0.3), 7.44 (0.42), 7.19 (0.69) |
| Before the first / after the last key | the first value holds back to 0, the last holds to the end |
| Timeline | one per top-level frame, in seconds; preview loops |
| Custom cubic | y values outside 0..1 accepted (overshoot eases such as back / release) |
| Colour keys | `manualKeyframeTracks.fills[<index>]`, values `{r, g, b, a}` 0..1, solid paints only |

## 7. One source of truth
After the designer approves, **Figma holds the motion**. A fix after the check goes into Figma (re-run `figma-apply-motion.js` with
the corrected plan, or the designer fixes it by hand), then read back and rebuild — never a hand edit of motion.json, which the next
read-back would overwrite. Before approval the beat sheet / motion.json is the plan and may be rewritten freely.
