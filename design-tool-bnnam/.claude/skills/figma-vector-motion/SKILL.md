---
name: figma-vector-motion
description: Animates finished Figma vector art for apps - asks the output format first (Lottie .json, dotLottie .lottie, Rive .riv or both), plans timing and easing from motion principles in a beat sheet, writes it as Figma Motion keyframes so the designer watches and tweaks the demo in Figma, then reads the approved keys back and converts them (springs included) into a Lottie for lottie-ios / lottie-android, checked by playing it in lottie-web. Shapes that bend or deform and interactive states go to Rive through the Rive app's MCP. Icons, success / error / loading, onboarding art, characters, buttons, reduced motion, hand-off. Use whenever vector art in Figma should move, loop, react or be exported as Lottie or Rive. Vietnamese triggers such as "làm animation cho hình này", "xuất Lottie", "xuất file .lottie", "làm file Rive", "cho chuông lắc", "icon động", "loading động", "nhân vật chuyển động", "demo chuyển động trong Figma". Drawing the art → figma-vector-illustration; screen transitions → figma-ui-flow.
---

# figma-vector-motion — the Figma art moves, and its rest pose is still the Figma art

**Motion is planned in words, shown to the designer where they work, and checked by watching the player — never by trusting the
file.** Animations made by hand from a picture drift from the design (a part re-placed by eye, a gradient redone), loops jump at the
seam, swings leave the frame and get clipped in the app, and "it built" gets reported as "it works". This skill keeps the Figma
frame as the rest pose, takes timing and easing from measured tables, lets the designer approve the motion in Figma itself, and
plays the exported file before reporting.

Let `SKILL_DIR` be the directory containing this file. Tools: `export_rig`, `export_assets`, `execute_code` (figma-agent —
operator's manual in `../figma-agent-tools/SKILL.md`); the official Figma MCP `use_figma` when the plugin cannot reach Figma Motion;
Rive: the Rive app's MCP. Scripts run with `node` (no install — the check uses the machine's Chrome / Edge and the vendored
lottie-web).

## Need → Read
| Need | Read |
|---|---|
| Durations, easing names, choreography, patterns (success, error, loading, press, entrance, ambient loop), the 12 principles with numbers, keyframe economy, checklist, reduced motion | `references/motion-principles.md` |
| The Figma demo: is Motion available, writing the plan as keyframes, what the designer may change, reading back, springs, measured facts | `references/figma-motion.md` |
| Lottie: both routes, `.json` vs `.lottie`, every field of motion.json, what the build makes, player limits on iOS / Android, what each check line means, hand-off, LottieFiles | `references/lottie.md` |
| Rive: when (bending shapes, interaction), setup (MCP, CLI), art in, rig and bones, timelines, state machine + view model, playback check, hand-off | `references/rive.md` |
| Making art that can move (separate parts, pivots, cut not masked shades, hidden areas drawn, same anchors for morphs) | `../figma-vector-illustration/references/draw-loop.md` §5 |
| figma-agent tools | `../figma-agent-tools/SKILL.md` |

## Core rules
1. **The designer picks the output format** — Lottie `.json`, dotLottie `.lottie`, Rive `.riv`, or Lottie + Rive — asked first,
   with a recommendation and its reason: `.json` for a clip or loop (every player reads it), `.lottie` when the app already uses
   dotLottie or the file is heavy, Rive when shapes bend / deform or the art reacts to states, touch or app values. A format the
   project notes already fix is used with a one-line mention, not asked again.
2. **The Figma frame is the rest pose.** Motion values are offsets from it; a key with the rest value shows the frame exactly.
   Never re-draw, re-place or re-colour art inside the animation — change it in Figma and export the rig again.
3. **Beat sheet before keys** (method: *beat sheet* — iabhi1610 / animation practice). One line per beat: time, part, what it
   does, value, ease, why (which principle). The designer sees it in chat; the work continues — they can stop it.
4. **Numbers from the tables, not taste** — durations, easing, overshoot, stagger from `references/motion-principles.md` (name the
   table used). One hero per beat; 1–2 properties per part on mobile; linear only for constant spin.
5. **Pivots are named, not centred.** A hinge, a hanging point, a stem's base, a joint: `"<part>@top"` or px. Only things that
   spin or pulse around their middle use the centre. In the Figma demo the pivot is the part's transform origin, so a wrong pivot
   is visible to the designer.
6. **Lottie motion is approved in Figma, and after approval Figma holds it.** The plan becomes Figma Motion keyframes; the designer
   watches, tweaks and says it is right; the file is converted from what Figma holds. Later fixes go into Figma and are read back —
   never a hand edit of the converted motion.json. No Figma Motion for this user → route B (`lottie.md` §1), said in the report.
7. **Watch it before saying it works.** Lottie: `lottie-check.cjs` (lottie-web plays the file) — the sheet looked at once and every
   number line answered. Rive: frames from the Rive CLI, or the designer looks in the app — a tool call, a key count or a state
   simulation proves structure only. Unseen = reported as UNVERIFIED.
8. **Mobile-safe output** — no effects (blur, shadows, glow), no blend modes, no expressions, no 3D, masks only where the art needs
   them, text as outlines; the build drops or warns on each (`references/lottie.md` §4). Figma keys with no Lottie form (size,
   corner radius, effects, animation styles) are warned by the converter — answered, never silently dropped.
9. **Names are the developers' API.** Layer / group names (Lottie keypaths), Rive artboard, state machine, view model and property
   names come from the Figma names and are never renamed silently after hand-off. Reduced motion and a static fallback are part of
   the delivery (`motion-principles.md` §8).
10. **At most two fix rounds** after the first check — each one: fix in Figma (or the Rive keys), read back, rebuild, re-check.
    What still needs the designer goes in the report with its frame.

## Running the scripts
| Command | What it gives |
|---|---|
| `export_rig {nodeId, path}` (figma-agent) | the frame as data in `rig.json` — outlines in frame px (text, rectangles, booleans too), solid / linear / radial fills with handles, strokes, masks, and Figma Motion keys per part with its origin, the timeline length; returns the group tree, the animated parts, `motionApi` and warnings. Read-only |
| `scripts/figma-apply-motion.js` → `execute_code` (or `use_figma`) | the plan (motion.json) written as Figma keyframes + transform origins; set `FRAME_ID`, `MOTION`, `REPLACE_ALL` at the top |
| `scripts/figma-read-motion.js` → `use_figma` | the Figma keys when the plugin reports `motionApi: unavailable`; save as `motion-read.json` |
| `node scripts/figma-motion.cjs --rig rig.json [--tracks motion-read.json] --out motion.json [--loop]` | the approved Figma keys as motion.json (ease shifted to the leaving key, rotation sign flipped, springs keyed at their peaks ≤ 0.5 % off) + notes and warnings |
| `node scripts/lottie-build.cjs --rig rig.json --motion motion.json --out <name>.json` (or `.lottie`) | the Lottie (Bodymovin 5.7 shape layers, layer per top-level part, nested groups animatable, masks as layer masks, markers); `.lottie` = the same zipped with a manifest |
| `export_assets {ids:[frameId], format:"PNG", scales:[1], outDir}` | the rest pose as Figma renders it, for `--ref` |
| `node scripts/lottie-check.cjs --anim <name>.json\|.lottie --motion motion.json --ref <frame>.png --out sheet.png --preview preview.html` | plays the file in lottie-web (headless Chrome / Edge, `CHROME_PATH` to choose): the beat-frame sheet, and OK / LOOK / FAIL lines — rest pose vs Figma, loop seam, pops, empty frames, art leaving the canvas; an offline preview page |
| Rive app MCP / `rive … --screenshot` | `references/rive.md` |
motion.json fields (target, pivot, rotate / move / scale / opacity / color / trim keys, markers, easing names): `references/lottie.md` §2.

## Steps
0. **Ask once.** First the output format (rule 1, with your recommendation). Then at most three more, only what the frame and the
   request do not say: what it is for and where it sits (slot size, when it plays) · plays once, loops, or follows the app's states ·
   which parts must move, if not obvious (propose them). Everything else from the defaults in `motion-principles.md` (personality:
   Corporate for UI, Playful for illustration). Rive chosen → steps 1–3, then `references/rive.md` §2–9.
1. **Read the art**: `export_rig` → `design/motion/<name>/rig.json`; read the tree, the warnings and `motionApi`. The frame should be
   a finished vector frame (figma-vector-illustration); a raster image is not animated here — draw it first.
2. **Rig ready?** Each moving part is its own named group (a child of the frame — the frame itself takes no keys); pivots findable;
   what a moving part uncovers is drawn underneath (the inside of a bell behind its clapper); room in the frame for the swing; no
   effects / images / blend on moving parts. Allowed in place, reported line by line: grouping, renaming, reordering, and padding the
   frame evenly so motion has room — the look unchanged. Re-drawing → the rules of `figma-vector-illustration` (draw-loop §5), then
   export the rig again.
3. **Beat sheet** (rule 3) in chat, then `motion.json`. Name the methods used: which pattern (`motion-principles.md` §5), which
   principles (§6 — e.g. pendulum with decaying amplitude, follow-through 4–6 frames), which table for durations and easing.
4. **Demo in Figma** (Lottie): build + check the plan once (`lottie-build`, `lottie-check` — fix what fails), then
   `figma-apply-motion.js` with `REPLACE_ALL: true` on the first write. Tell the designer which frame to play and what to look for;
   **stop here until they approve** ("chốt") or change keys / eases / pivots in Figma. Requests in words → re-apply the plan.
5. **Convert and build**: `export_rig` again → `figma-motion.cjs` (`--loop` if the beat sheet loops) → answer every `⚠` →
   `lottie-build.cjs` to the chosen format(s); read the build's warnings.
6. **Check** (rule 7): `export_assets` the frame → `lottie-check.cjs … --ref`; look at the sheet once — poses read, joints closed,
   nothing poking out or vanishing, the hero clear, the rest frame = Figma, and the motion matches what was approved in Figma; answer
   every line. Fix (rule 10), re-check.
7. **Deliver** into `design/motion/<name>/`: the file(s) (`<name>.json` / `<name>.lottie` / `.riv` + `.rev`), `preview.html`,
   `sheet.png`, the reduced version or the static frame to use, `handoff.md` (`references/lottie.md` §6 / `rive.md` §9). Then the
   report.

## Report
```
<Tên> — Lottie .json | .lottie | Rive · <w×h> · <fps> fps · <thời lượng> · <lặp | chạy một lần | theo trạng thái>
Cách làm: <mẫu chuyển động> · <nguyên lý đã dùng> · <bảng thời lượng / easing đã dùng>
Bảng nhịp: <thời điểm — phần — làm gì — easing>
Demo Figma: <frame> · bạn đã chốt <ngày / lời chốt> · bạn đã sửa: <…> · chuyển: <lò xo / kênh lấy mẫu, sai số> · không chuyển được: <…>
Kiểm (lottie-web | Rive CLI | designer xem):
  dáng nghỉ so với Figma · chỗ nối vòng lặp · giật · khung trống · tràn mép — OK / cần xem / lỗi, kèm số
  nhìn tấm khung: <điều thấy, có giống bản đã chốt trong Figma không>
Đã sửa trong <n> vòng: <…>
File: <đường dẫn> · xem thử: preview.html · bàn giao dev: handoff.md
Chưa kiểm được / cần bạn quyết: <…>
```
In the user's language, plain words, no internal codes. Before approval (step 4) the message is shorter: the beat sheet, the frame
to play in Figma, what to look at, what the plan check found.

## Common pitfalls
- Pivot left at the centre of a hinged part — the bell spins on its belly instead of swinging from its top.
- Linear ease on travel or swing (robotic); `hold` where motion was meant (snaps — the check's "pops").
- The ease written on the wrong key: motion.json shapes the segment **leaving** its key, Figma the segment **arriving** — the scripts
  shift it; never copy eases between the two by hand. Same for rotation: Figma + = counter-clockwise.
- A loop whose first and last keys differ, or whose parts' periods do not divide the loop — the seam jumps.
- A swing or bounce that leaves the frame — fine in Figma's preview and the HTML canvas, clipped in the app's view (the check's "art
  leaving the canvas"). Pad the Figma frame.
- Animating every part — one hero per beat; supporting parts at 30–50 % amplitude and 2–4 frames late.
- Keys on the top-level frame, an animation style instead of manual keys, or size / radius / effect keys — none of them converts.
- Editing motion.json after the designer approved in Figma — the next read-back overwrites it; fix in Figma.
- Converting before the designer said it is right, or reporting the Figma demo itself as the delivery — the app needs the file.
- A colour track on a gradient part (only solid fills take `color`) — fade a second fill instead.
- Reporting "done" from a successful build or a Rive tool reply without watching frames.
- Rive: state machine inputs or runtime events (deprecated) instead of a view model; renaming the public names after hand-off.
- Blur, shadows, glow, blend modes kept "because Figma shows them" — iOS and Android draw them differently or not at all.

## Self-check before reporting
- [ ] The format was asked (or taken from the project notes) and the delivered file is that format.
- [ ] The beat sheet was shown before keys and names its pattern, principles and tables.
- [ ] Every pivot is named (no centred hinge); every moving part is its own group in the rig.
- [ ] Lottie: the designer approved the motion in Figma, and the file was converted from Figma after that approval (or route B is
      stated); every converter `⚠` and build warning is answered.
- [ ] `lottie-check` ran on the LAST file with `--ref`: rest pose OK, seam OK (loops), no pops, no mid empty frames, no art leaving
      the canvas — or each one explained; the sheet was looked at. Rive: frames from the CLI or the designer's look.
- [ ] Reduced motion / static fallback delivered; `handoff.md` lists format, how to load it, names, size, fps, markers / states.
- [ ] Files in `design/motion/<name>/`; nothing in Figma changed except the motion keys / origins and reported rig fixes.
