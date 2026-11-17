# Rive — setup, import, rig, timelines, state machine, check, hand-off

Absorbed (11/2026) from Rive's own docs (MCP, CLI, SVG import), uianimation/rive-skill (MIT — state machines, data binding, runtime
hand-off), jeongjin98/rive-animation-skill (MIT — MCP operations, rig, "structure is not proof, look at playback") and
iabhi1610/rive-animation-skill (MIT — keyframe economy, beat sheet, frame diff). Left out: Luau / shader toolchains, web / engine
runtimes, walk cycles and anatomy libraries, refusing work without a reference image (the Figma art is the reference).
**Tool names below come from community notes, not Rive's docs — the live tool list of the connected server wins. Read it first.**

## Contents
1. When Rive, not Lottie
2. Setup (once per machine)
3. Route — the Rive app via MCP
4. Getting the art in
5. Rig in Rive
6. Timelines from the beat sheet
7. State machine and data (the app's API)
8. Check — playback, not structure
9. Hand-off for developers

## 1. When Rive, not Lottie
Rive takes the two jobs the Figma demo → Lottie route cannot do well:
- **Shapes that bend or deform** — a leaf that curls, a body that squashes along a curve, a tail or cord that waves, a blob that
  stretches: bones bound to the path's vertices (§5). Figma Motion moves, turns, scales and fades whole layers; it does not bend a
  path, and a Lottie path morph needs equal anchor counts in every pose.
- **Interaction** — states that switch (idle → pressed → loading → success), touch / pointer, values from the app (progress,
  counts, a name), several outcomes from one file, long-running characters.
Lottie (demo in Figma first, `figma-motion.md`) when it **plays**: a fixed clip, a loop, segments by marker, rigid parts that swing,
slide, pop, fade, change colour or draw on. Same Figma art and the same beat sheet feed both; for "both", the Figma demo approves
the timing and Rive rebuilds it with the same numbers.

## 2. Setup (once per machine)
- **Rive desktop app** (installed) → open it, open or create a file **with an artboard** before any prompt (the server needs one).
- **MCP**: `claude mcp add --transport http rive http://127.0.0.1:9791/mcp` — the app must be running; only the desktop editor.
  If the port does not answer, the MCP may be in the Early Access build only — say so to the designer, do not work around it.
- **Rive CLI** (for the check — headless frames): Windows `irm https://releases.rive.app/cli/install.ps1 | iex`, then `rive doctor`.
  Screenshots, verify and inspect cost nothing; `push` / `--publish` spend the monthly allowance and watermark below Cadet — not
  used here.
- These change the designer's machine / settings: ask before running them; never add them silently.

## 3. Route — the Rive app via MCP
1. `session_info` / list tools → note the real tool names for this session.
2. Artboard the size of the Figma frame (same px), name = the art's name.
3. Art in (§4) → check names and order against the rig tree (`export_rig` summary).
4. Rig (§5) → timelines (§6) → state machine + view model (§7).
5. Export: `.riv` (runtime) and `.rev` (editable backup) into `design/motion/<name>/` (`export_file` writes the in-memory document,
   unsaved edits included, into an existing folder).
6. Check (§8) → hand-off (§9).
Calls that change the file run one after another; reads may run in parallel. A reply without a top-level error can still carry
per-property errors (`unknown_id`, `type_mismatch`, `invalid_enum_value`, `read_only`) — read them, then query the same targets again
before claiming the change.

## 4. Getting the art in
- `export_assets {ids:[frameId], format:"SVG"}` → the SVG of the vector frame; bring it in with the MCP asset tool (`upload_asset`
  registers the asset — placing it on the artboard is a separate step), or the designer pastes **Copy as SVG** from Figma.
- What survives the SVG import (Rive docs): shapes, paths, fills, strokes, groups; linear and radial gradients **but their
  transforms are ignored** — a rotated or skewed Figma gradient shifts: reset its start / end from `rig.json` (handles in frame px)
  with the property setter; masks arrive as clipping; dashes stay dashed; filters (blur, shadows), skew and embedded images are
  dropped; `inherit` fills turn white; outline text before export.
- Layer names: not documented to survive — compare with the rig tree and rename to the Figma names (they become the developers'
  API in §7).

## 5. Rig in Rive
- One group per independently moving part (the Figma rig already is one — SKILL step 2); static parts stay merged.
- **Origins at the joints**: use Freeze (move the origin without moving the art), turn it off afterwards. Pivots = the ones in the
  beat sheet (hanging point, hinge, base of a leaf).
- Rigid parts: group or bone parenting. Bendy vector parts: bones bound to the path's vertices (no mesh needed for vectors —
  meshes are for images). Parts that overlap at a joint and share bones: one combined auto-weight so the joint does not open.
- IK for planted contacts; a joystick for gaze / head turns. A group named "bone" is not a bone — claim weighting only after
  querying real bones and bindings.

## 6. Timelines from the beat sheet
- One timeline per behaviour (`idle`, `press`, `success`, `error`), named in camelCase; reuse and rename the default `Timeline`.
- Units: the property setter takes **degrees** for rotation and **percent** for opacity / scale / trim (100 = full); RML and runtime
  values use radians and 0..1 — keep the two apart. Keys in frames, transition durations in ms.
- Keyframe economy: 2 keys + a cubic ease instead of sampled keys; overshoot from the elastic / cubic-value interpolator, not three
  keys; key only what moves, key the parent; loops with `loop` or `pingPong`, not a keyed way back. The interpolation of a key sets
  the interval that follows it; a key with no interpolation is a hold and snaps.
- Easing names → Rive cubic: same béziers as `motion-principles.md` §3.

## 7. State machine and data (the app's API)
- Use a **view model with data binding** — state machine inputs (Bool / Number / Trigger) and runtime events are deprecated.
  Enum for modes (`state: idle | loading | success | error`) rather than several booleans; Boolean for a two-way switch; Trigger
  for a one-shot (`play`, `dismiss` — verbs); Number for progress (`progress` — nouns); signals back to the app past tense
  (`finished`); internal helpers start with `_`.
- **One layer per independent behaviour** (idle loop, press) — two layers keying one property: the later wins. **Every state has an
  exit**, authored both ways; a hold state is a one-key timeline and the transition duration (ms) does the blend; a resting loop is
  one looping state with no exit needed; sequences chain with exit time 100 %; conditions on one transition are AND (OR = parallel
  transitions); Any State only for true global interrupts. The outro fires `finished`.
- Pointer input on the whole artboard: a hit-area shape with a listener (a listener with no target is not exported).
- Reduced motion: a view-model boolean `reduceMotion` the app sets; the state machine takes the short / static path.
- Names of artboard, state machine, view model and properties are the public API — never renamed after hand-off without telling.

## 8. Check — playback, not structure
A successful tool call, a key count or a state-machine simulation (`simulateStateMachine` renders no pixels) proves structure only.
- Before editing, write the acceptance lines: each state, what must be seen, what would be wrong.
- **Frames**: with the CLI, `rive create check --from-rev <name>.rev` once, then per beat
  `rive check --screenshot=<beat>.png --advance=<t>ms --viewport=<w>x<h> [--data=state=success]`; `--compare=<png>` diffs against
  the Figma export (the rest pose). Without the CLI: ask the designer to look in the app — never claim the motion unseen.
- Look at neutral and extreme poses, in-betweens both ways, the loop boundary (position and speed), each transition interrupted
  midway (press during loading), and the rest pose against Figma. Five relationships: attachment, occlusion, shape / volume,
  contact, scale.
- Labels per check: PASS / FAIL / UNVERIFIED with what was seen.

## 9. Hand-off for developers (`handoff.md`)
File and revision; artboard, state machine and view-model names; each property: type, values, default, direction (app → file or
file → app), purpose, whether firing a trigger twice is safe; fit (`Contain` for a fixed slot); reduced motion; runtime versions
(rive-ios / rive-android current); failure behaviour (missing artboard / view model, late data, dispose on leave); QA: rapid taps,
interrupt mid-transition, background / resume, low-end Android. Keep embedded images at display size, reference fonts the app has,
no hidden art left in the file (it still ships).
