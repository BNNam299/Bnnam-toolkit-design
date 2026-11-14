# Draw loop — three kinds of job, each with its own check · static vs animated · icons

> Source: ideas (not text) from `upbrew-tech/svg-creator-skill` (Apache-2.0: render → look → fix loop, rounds by kind, build order
> and joint cover) and `Shakibuzzaman3104/gpt-ui-assets` (MIT: inventory of assets from a reference, redraw instead of crop, score
> the redraw against the reference). Adapted to Figma and the tool demo's build loop; no external API needed. `kubai-icons` (one
> accent colour drives every tone; back / content / front pieces) informed §6 — its rules text is not reused (its licence forbids
> republishing modified rules). The kinds, the static / animated question, the concept-image route and the rules in §3 come from the
> designer's reviews of two tests (11/2026): an overlay check means nothing for creative work; not every drawing is animated; a new
> subject built on the reference's skeleton, with parts laid side by side, failed — and most real jobs are "same style, new subject".

## Contents
1. Ask first · the loop and its rounds · the checks decide
2. Copy a reference (or a concept image) — the reference is the standard
3. Create — route A: concept image first · route B: the agent builds · silhouette stop
4. Fix existing art — the original is the standard
5. Static vs animated (Lottie)
6. Icons as a family

## 1. Ask first · the loop and its rounds · the checks decide
Questions, in one message, **in the user's language**, before drawing:
1. **Copy** a reference · **create** from a description · **fix** existing art?
2. Create only: **who makes the concept?** The designer generates it in their image tool (ChatGPT or any) from a prompt the agent
   writes — recommended · or the agent builds it directly.
3. **Static**, or **animated later** (Lottie)? If animated: which parts move?

The answers pick the standard the work is checked against. Without a standard, "looks fine" is the agent's taste — that is how
creative work turns sloppy.
| Kind | Standard | Check each round |
|---|---|---|
| Copy | the reference | `score.cjs` per part + the compare sheet (§2) |
| Create, route A | the concept image the designer picked | the same as copy (§2), after the concept pre-check (§3) |
| Create, route B | the style traits agreed before drawing | silhouette stop + creative checklist + `floating()` (§3) |
| Fix | the original | before / after side by side at 4×; nothing that was right gets worse (§4) |

Every kind loops: **draw a pass → screenshot → run the kind's check + the shape checks → fix → again.** A one-shot drawing is never the
result. Rounds to expect before showing the designer (create route B and fix — a copy has its own fixed passes, §2: draft, check,
at most two refine rounds, lock):
| What | Rounds |
|---|---|
| icon, logo, simple object | 1–2 |
| diagram, infographic | 2–3 |
| scene, landscape, widget art | 3–5 |
| character, animal, figure | 5–8 |

Shape checks in every round, every kind (`scripts/illustration-helpers.js`): `stackedPrimitives` (masses built from circles and
rectangles), `fakeEdges` (flat side from a rectangle), `spills` (detail past its owner), `floating` (parts attached to nothing),
`anchorReport` (wasted anchors), and the 4× zoom for seams, gaps and slivers between touching parts.

**Build sheet + look check — copy and create** (SKILL rule 9; a fix job is checked against the original, §4). A test figure scored 0.987 overall while its sleeves stood apart from the
shoulders, its hands were lumps, its coat was a box where the reference tapered and the reference's grain was gone. A score measures
area; it cannot see joins, hard parts, shape character or finish. So, whatever the style:
- **Before drawing** (in a copy: while the automatic draft builds — the script drafts, you draw in the refine), write the *build sheet* (nine lines: shape family · edges · taper · corners · joins · inner lines · hard parts · finish ·
  ratio — each an observation with where you saw it), the *inventory* (what each region holds: "hands: 4 fingers, thumb over palm,
  cuff over wrist") and the *join list* `[front, back]`. Copy reads them from the reference, create from the style reference. A
  few minutes of looking here is what makes the drawing look made in that style instead of merely the right size.
- **After a pass**, `joins(root, list)` must be empty, then one `compare-sheet.cjs` image (every join, every hard part, a grid of
  neighbouring regions — `checks.json`) is looked at **once**, and every cell is answered with what was seen against the sheet and
  the inventory. That sheet is the sanctioned zoom: it replaces cropping and comparison scripts of your own, which is where test
  runs lost most of their time.
- **Last**, the finish the sheet lists (grain, texture, light bands) as its own named layer(s) on top — the reference's finish is
  part of its look, not decoration.

**The checks decide, not the agent** (SKILL rule 8). A failing check is redrawn, or reported as **not done** with its evidence for the
designer. Never re-label a fail as "close enough", "anti-aliasing", "small part", "on purpose". The overall result is the worst part.
Stop when a round finds nothing (copy: after its two refine rounds at most); say how many rounds it took. **Finish in the run**: what you know how to fix, you fix — the
report asks the designer only what is theirs to decide, never "shall I do another round?".

## 2. Copy a reference (or a concept image) — passes, like building a screen
The reference is the standard. Work in passes the way the build loop makes screens (layout → fill → lock): a fast mechanical draft
of every part, then check, then refine only what fails. **Never trace or type an outline by hand** — the scripts measure, trace and
fit clean shapes, `build_vectors` builds; the agent plans, looks, decides and redraws only the few parts no shape fits, with a few
numbers each (`draw`). Budget: about **8–10 minutes** for a figure (draft ≈ 1, build sheet + look check ≈ 3, two refine rounds,
lock + finish), **one run from request to clean result**: after the questions
asked first (§1), do not stop to ask between draft and final — the draft on the canvas is progress, not a checkpoint.

**The designer watches it come together — four stages in ONE frame.** Like a designer sketching the whole picture first and then
refining it, every stage is built into the same frame **as soon as it exists**, so the canvas always shows the whole drawing at its
current state; the run keeps going on its own (no question between stages) and the designer can interrupt at any time.
| Stage (frame name) | On the canvas | Commands | Target |
|---|---|---|---|
| **1 · thô** (rough) | every region in its colour and place, plain polygons: rough edges, nothing filled in under the parts in front, no clean shapes | `--auto-plan … --out draft-scene.json --rough` → `build_vectors` | **< 1 min** from the request |
| **2 · khối** (masses) | the full build of the same plan: hidden parts filled in, seams closed, smooth outlines, clean shapes; replaces stage 1 in place | `--plan draft.json --out draft-scene.json --render draft.png` → `build_vectors` (same frame) | + ~30 s |
| **3 · chi tiết** (details) | refine round 1: the fix list from the check — draws, joins, hard parts, faces, fine lines | Edit `draft.json` → rebuild → `build_vectors` | + 2–3 min |
| **4 · chốt** (lock) | names, groups (`Head/Eye L`), gradients / overlays, holes dropped, `Draft` deleted, round 2 + finish; the frame gets its final name | `--names` → `--plan plan.json … --dark` → `build_vectors` | + 1–2 min |
Mechanics: **every build carries its stage** — `build_vectors { path, parentId, stage: "1 thô" | "2 khối" | "3 chi tiết" | "" }`;
the plugin names the frame `<Subject> · vector · <stage>` (`""` at lock = the plain final name). No separate rename: a test run
renamed by hand once and then forgot for every later picture. The first build creates the frame and returns its `frameId` — pass it
as `parentId` on every later build. Each `build_vectors` replaces the group of the same name in place (`Draft` in stages 1–3). After
each build write **one line** in the chat in the designer's language ("Xong khối, đang làm chi tiết") — no screenshots, no questions. A stage that fails to build is
reported in that line and the run goes on from the last good stage.
**Never upscale the reference.** The scripts read the image at its own size; a 3× upscale made every step 9× slower (a 34-minute run)
and adds nothing — small features are kept by the draft's detail rules, and a source too small to tell is a size-check question (pass
0+1, step 1). A sharp image is not an easier one: what decides the draft is how many flat colour areas it has. A soft-shaded image
(gloss, gradients, soft rims) splits into hundreds of regions and many `tone steps` — copy it as base shapes with gradients and
see-through overlays (lock); **never reduce it to N flat colours with a script of your own** (a test run did: jagged edges, banded
shading, and the reduction itself cost minutes).

**Why a clean step:** flat art is rectangles, rounded rectangles, circles and straight-sided shapes. Tracing a small or soft reference
gives wobbly outlines of them (a 120 px sprite traced at 4×: every pixel stair became a 4 px wave, 14 of 32 parts passed). The same
figure rebuilt from measured clean shapes passed 31 of 32 — but by hand it took 8 more minutes. `vectorize.cjs` now does the fitting
(`scripts/fit-shapes.cjs`): each piece of each part becomes the simplest shape that matches it — rect · rounded rect (a radius per
corner) · pill / circle / ellipse · straight-sided polygon — and keeps its traced outline only when nothing fits.

| Pass | What | Who |
|---|---|---|
| 0+1 · Draft (≈ 1 min) = stages 1–2 | size check · rough draft built at once (stage 1) · then the full build of the same plan: trace + **clean fit** + scene + preview (stage 2) · while they build: build sheet, inventory, join list, `checks.json` (§1) | `vectorize.cjs --auto-plan … --out --rough` → `build_vectors` → `--plan draft.json --out` → `build_vectors` |
| 2 · Check | score every draft part + shape checks + **look check** (compare sheet), once | `score.cjs --plan draft.json` + helpers + `compare-sheet.cjs` |
| 3 · Refine round 1 | the big parts still traced (listed with draw hints) → `draw` shaped by the build sheet; failing parts, joins, hard parts and poke-outs → one fix each; rebuild → re-check those | agent + scripts |
| 4 · Lock — **right after round 1** | one names file (names, groups, gradient / overlay, nested face) → rebuild → **replace the draft in place** (delete the `Draft` group) → score once more | `vectorize.cjs --names` + helpers |
| 5 · Round 2 + finish | what round 1 left, fixed on the **locked** plan (`plan.json`, same keys); **finish layer**; anchors, Lottie extras; report | agent + scripts |

The draft comes **before** naming: the automatic plan already has the right colours and regions, so the shape is on the canvas in about
a minute. Naming and grouping come right after the first refine round — **lock before polishing**: three test runs of a soft-shaded
figure (11/2026) spent their whole budget measuring and redrawing small eyes and ended with an unnamed `Draft`; a locked result is
usable even when time runs out, polish is not. Time-box the reading: build sheet + inventory ≈ 3 minutes, written while the draft
builds, from the labels image and the compare sheet — not from pixel grids of each feature. A test run that named 66 regions first spent
10 minutes on it before anything was drawn.

**Colours are never typed.** Every colour comes from the image: the auto-plan measures it, the fill is the region's most frequent
colour, the lock pass copies it. A colour that looks wrong is fixed by measuring again (`--palette`) and copying, not by guessing a hex.

**Pass 0+1 — draft, at once.**
1. **Size check.** A detail smaller than ~4 px in the reference (a sprite figure 140 px tall) is a guess — say so and ask for a larger
   source; none → go on and mark the guessed parts.
2. **Stage 1 · rough, one command**: `node scripts/vectorize.cjs --auto-plan draft.json --img <ref> [--crop x,y,w,h] --scale <n>
   --name "<Subject> · vector" --out draft-scene.json --rough` (seconds, even for a big image) → every flat-colour region becomes a
   part `p01, p02…` (biggest first = furthest back, one group `Draft`, one part per line), `draft.labels.png` with the numbers on the
   reference, and a rough scene of plain polygons. **Build it at once** (`build_vectors { path, stage: "1 thô" }`, keep the
   `frameId`), one chat line. This is the **first** command after the size check: no `--palette`, no metadata or pixel probes before
   it, no `--crop` unless the image holds more than the subject (the background is skipped anyway).
   **Do not probe pixels, crop zooms or write measuring scripts** — a test run spent 10 of its 16 minutes doing that.
3. **Stage 2 · masses**: `node scripts/vectorize.cjs --plan draft.json --out draft-scene.json --render draft.png` →
   `build_vectors { path, parentId: <frameId>, stage: "2 khối" }` (replaces the rough `Draft` in place), one chat line. Each part
   is now one lean pen-tool path, filled with the reference's colour, **whole**: what a part in front hides is filled in within its own
   outline; seams between touching parts are closed; outlines are long smooth curves with corners only where the reference turns
   sharply. Leave `simplify` alone (it only loosens how far a refit may move from the trace, default 1 original px).
4. **While it builds, read how it is made** (§1): the build sheet (shape family first), the inventory per region, the matched
   features (what is the same thing twice), the join list, and `checks.json`
   (`joins` and `hard` boxes in crop px from the labels image, `grid` e.g. `[3, 4]`). This is looking and writing, not measuring —
   no pixel probes.
5. Static or Lottie (asked first): only matters at lock; everything is drawn whole anyway.

**Pass 2 — check, once.** Export the frame (`export_assets`, PNG, scale 1, `outDir` absolute — score.cjs resizes it to the reference
crop; Figma not open → use the `--render` PNG), then `node scripts/score.cjs --plan draft.json --draw <png> --diff diff.png` → every
part scored (IoU± forgives the anti-aliased edge), overall = the worst part. Run the shape checks once (`stackedPrimitives`,
`fakeEdges`, `floating`, `joins`, `anchorReport`) — on the draft the layers are still `p01…`, so the join list uses draft ids
here and is renamed at lock; `spills` waits for the named groups at lock (on the one flat `Draft` group it would measure every part
against p01) — until then vectorize's "kept inside" line and its poke-out warnings cover it. Figma not open → these helpers and the
finish layer run at build time; say so in the report. Then the look check: `node scripts/compare-sheet.cjs --plan draft.json
--draw <png> --checks checks.json --out sheet.png`, look once, write one line per cell against the build sheet and the inventory
(e.g. "3 · Sleeve L ↔ shoulder: butted, reference tucks the sleeve under a rounded shoulder"; "7 · Hand R: one lump, reference has
thumb as its own shape over the palm"; "r2c1: coat straight-sided, reference tapers to the hem"). Those lines are the fix list for
pass 3 together with the failing score rows.

**Pass 3 — refine: finish it here.** The designer asked for a finished drawing, so every fault the checks found that you know how to
fix is fixed in this run — never handed back as "shall I do another round on the details?". A test run that ended by offering a
detail round left the designer to ask for work the agent already knew it had to do. At most **two rounds**, each one Edit of
`draft.json` + one rebuild + one re-check of the touched parts: round 1 = the whole fix list, **then lock (pass 4)**; round 2 = only
what round 1 left or made worse, edited in the locked `plan.json`. (The cap is there because open-ended refining is how runs drifted to 20+ minutes.) Touch nothing that passes and is clean.
Kinds of fix:
- **Big parts still traced** (the draft command lists them with a *draw hint*: the outline's corners in crop px) → add `"draw"` to
  that part's line: the hint tidied into the shape a designer would draw — straight sides straight, round ends as arcs
  (`C`), symmetric where the reference is, 4–12 anchors. Short forms: `{ "rect": [x, y, w, h, r] }` (r: one radius or
  `[tl, tr, br, bl]`), `{ "ellipse": [cx, cy, rx, ry] }`, or an array of those for several pieces. A hat crown is a dome on a box,
  a tunic a rounded body with straight sides. This is the hand step of a copy: a few numbers per part, never a traced outline typed out.
  Shape it by the build sheet — taper where the style tapers, corners as soft as the style's, curved where the style curves — so the
  clean shape keeps the style's character instead of turning boxy.
- **Joins and hard parts the look check flagged** → the front part's `draw` extends a few px under / over its neighbour as the build
  sheet says this style joins; a hard part drawn as one lump → split into its layers in the reference's order (thumb, palm, cuff;
  sole, upper, laces) as separate parts with their own `draw`; each new part copies `color` / `seeds` from the draft part it comes
  from (or a `palette` entry of the plan) — copied from the file, never guessed.
- **Failing parts** (score rows: offset dx dy dw dh, and `diff.png` looked at once) → one fix each — a box that catches a neighbour,
  a missing seed, `tol` too tight / loose, `complete: false` for a real hole, `"clean": false` when a fitted shape is wrong for it,
  or a `draw`.
- **Shape family and matched sets** — the draft prints `shape family: … (votes …)` and `matched set: model = member …`. Compare
  with the build sheet: wrong family → `"family": ["pill"]` (or `["ellipse"]`, `[]` = off) at the top of the plan; a set missed
  or wrong → `"same": [["p07", "p11"], ["p12", "p14"]]` (draft ids; `false` = off). A member grown under a `… cover` is a feature
  cut by its holder's colour — check the cover sits where the reference's lid / flap is.
- **Poke-outs** — a detail that should sit inside another part but crosses its edge (`spills()`, or a vectorize warning "draw pokes
  … px out of …") → pull the `draw` inside; if the auto owner is wrong, set `"inside": "<part>"`; only a detail that really crosses
  the edge in the reference gets `"inside": false`. vectorize already keeps auto-detected details inside their owner and refuses
  clean shapes that poke out — its "kept inside" line lists them.

Each round: `vectorize.cjs --plan draft.json --out draft-scene.json --render draft.png` (seconds), `build_vectors` (with `parentId`,
`stage: "3 chi tiết"`) + one chat line,
`score.cjs --plan draft.json --only <the parts you touched> --draw …`, the compare sheet once on the touched cells.
After round 2, what still fails goes to the report with its evidence (rule 8) **only when it needs the designer**: the source is
too small to tell, the reference is ambiguous (two readings of one shape), or a choice is theirs (keep the grain? merge two tones?).
Say what you tried and what they can decide — not "want me to fix it?". What eats the budget and is **not** part of this pass: zoomed crops beyond
the compare sheet, pixel probes, comparison scripts of your own, reading the scripts' source, `simplify` tweaks (the default keeps
corners). A test run spent 8 of its 9½ minutes
on exactly that and never reached the lock pass. The draw hints are the measurements — no other measuring is needed. A crumb (a
sliver of anti-aliasing) is not refined — it is dropped at lock.

**How the reference artist builds it — read the draft's notes into the lock.** A test of 13 copies against the artists' own vector
files (11/2026) showed the tool's grouping and names were better than the originals' (a pile of "Vector"), but its *construction*
was weaker in five places. The draft command now prints one line for each when it sees it; act on them at lock:
| Draft line | What the artist did | At lock |
|---|---|---|
| `compression noise (… ‰ speckle) → "smooth": 2` | a JPEG / re-saved image: its speckle made every traced edge wobble, and a test run spent a whole extra round (11 min) smoothing by hand after the designer said "lines not clean" | nothing — `smooth` is already in the plan and carries to lock; one part still wobbly → `"simplify"` on that part. **Never raise `srcPx` for noise** (curves turn into straight-sided polygons) and never `--no-clean` the whole picture |
| `ink style: p01, p11 …` | ink-outline art (retro, sticker): the colours underneath, the ink **one outline with holes on top** — colours run under it, no seam can open. Drawn at the back, every colour must fit the line exactly and misses show as hairlines (a globe showed black slivers) | the draft already puts the ink last; keep its group **last** (`Body ink` in front of everything it frames) |
| `tone steps: p14 + p17 …` | soft gradient art: **one shape with one gradient** (the same skin gradient reused on face, neck, arms) — a palette cut it into bands with hard seams | join the bands into one part with `"gradient": true` — the stops and direction are measured |
| — (you see it) | shading as a **see-through layer over the base**: one dark tint at 10–20 % for every shadow on the figure, blush / lips in multiply | the shade part gets `"overlay": true` (tint = `"shadowTint"` in names.json, else the darkest colour; `"overlay": "#hex"` to pick) and `"blend": "MULTIPLY"` where the reference multiplies |
| `background colour inside the figure, holding features → … KEEP` | a region in the background's colour that holds features (a white face with its eyes and mouth, a belly with its buttons) is the object's **own fill** — a test run dropped every white region as a "hole" and punched a snowman's face out | keep it and name it (`Face`, `Belly`) |
| `background colour inside the figure, holding nothing: p06 …` | the inside of a ring, a gap under an arm, a letter's counter are **holes** (the background shows through); a tooth, a highlight, a white shirt are parts | decide **each one** by looking, never all at once: holes → `drop` (never a white "Gap" part, it breaks on any other background), parts → name them; the `--dark` preview at lock shows the result; unsure → ask the designer |
| `kept fine detail: p28 line · p43 pattern …` | seams, creases, eyelid lines, halftone dots are part of the look | name them (`Seam`, `Crease L`, `Halftone`); never drop them unasked. A dot pattern in nearly the background's colour is not seen by the draft — say so in the report |

And two things the draft cannot say:
- **Stack by depth, group by object.** Groups follow the depth order the reference shows (back arm → body → head → pole → the hand
  holding it). When one object sits at two depths, it is **two named groups** (`Arm L · back`, `Hand L`) — never a `… cover`
  painted in the colour of what should be in front, never a fill that fakes a gap. Covers are only for a feature cut by its own
  holder's colour (an eyelid in the face's colour, rule 9.3).
- **Nest what moves or is swapped.** A face is `Head` with `Head/Eye L`, `Head/Eye R`, `Head/Mouth` inside (white, iris, lid,
  lash, light in each eye) — the artists' files nest this way, and a blink or a mouth swap is then one layer. List the holder group
  first, its nested groups right after it.

Outlines are smoothed for you: traced parts are fitted as long curves read at a few original pixels (`fitOutline`, so pixel stairs
never become anchors), and a `draw` that is a pasted trace is refitted and warned about. Never paste a traced outline into `draw`.

**Pass 4 — lock.**
1. **Names, in one small file.** Read the labels image once and write `names.json` — only names, draft ids and the readings above:
   `{ "frame": "Hero · vector", "shadowTint": "#201829", "groups": [{ "name": "Legs", "parts": [{ "name": "Leg L", "from": ["p03",
   "p17"], "gradient": true }, { "name": "Leg shade", "from": ["p21"], "overlay": true }] }, { "name": "Head", "parts": [...] },
   { "name": "Head/Eye L", "parts": [...] }, …], "drop": ["p41"] }`. Name parts as a designer would select them (Face, Hat, Sleeve L
   — never a colour or a number); several draft parts of one object → one part (`from` lists them); groups back → front (e.g.
   Legs · Arms · Body · Head · Hat); crumbs and holes → `drop`.
   **Keep the reference's rendering**: a shade region stays its own part only where the reference has one.
2. `node scripts/vectorize.cjs --names names.json --plan draft.json --to plan.json` — seeds, colours, boxes and tweaks are copied;
   it refuses a draft part that is neither used nor dropped, and warns when one part joins clearly different colours.
3. `vectorize.cjs --plan plan.json --out scene.json --render final.png --dark` → `build_vectors` (same frame, `parentId`,
   `stage: "4 chốt"`) → delete the `Draft` group (`delete_nodes`) so the clean result **replaces** the draft — one frame, no leftover
   (a draft left behind doubles every pixel the score and the designer see) → one chat line → `score.cjs --plan plan.json` once more
   (joined parts are completed together, so check them). `draw` and `clean` carry over from the draft plan. **Look at
   `final-dark.png` once**: the figure on Figma's dark canvas — a fill dropped as a hole, a seam between parts, a white part that
   touches the white background all show there and nowhere else (the score compares on the reference's own background).
4. **Finish layer** from the build sheet's "finish" line: grain / noise, brush texture, light bands — as their own named layer(s)
   on top of the parts they cover (e.g. Figma's Noise effect on the part, or a texture layer masked by the part's group), matched to
   the reference's strength at 1×. Reference flat → none. Route A: the concept was generated without texture on purpose, so the
   finish comes from the **style reference's** build sheet. Run `spills` and `joins` (now with the final names) once here too. Lottie: note which finish the player cannot render.
5. `anchorReport` (simplify on a copy where wasted); 4× zoom for seams; Lottie: pivots and joint covers on the moving parts (§5).
   Last: the last `build_vectors` of the run passes `stage: ""` — the frame gets its final name (`<Subject> · vector`, no stage tag).
   Report: the score table, the look-check lines (cell → what was seen → fixed / not done), parts not done, guessed parts, time and
   turns used.

## 3. Create — route A: concept image first · route B: the agent builds · silhouette stop
Most real jobs are **"the same style, a new subject"** (a new character, object or scene for a set that exists). Read the style first,
whatever the route:

**Style traits** — write them as five lines and show them: palette (hex) · shape language (the shape family — pills, rounded rects,
circles, scallops — round / boxy / pointy, corner softness) ·
rendering (flat / gradient / volume; stroke or none) · proportion ratios (head : body, object width : height) · detail density (how
many features a subject carries). Source: the art in the file, or the designer's references; none → ask one question.
Then the **build sheet** (§1) from the same reference: the traits say *what* the style looks like, the sheet says *how it is built*
— how it tapers, how parts join, how it simplifies hands, shoes, faces, what finish it has. A new subject drawn from traits alone
came out right in palette but boxy, with butted joints and lumpy hands; the sheet is what carries the style into parts the reference
never showed.
**Style traits are not structure**: never reuse the reference's pose, layout, part arrangement or silhouette for a different subject.
The build sheet is construction, not structure — reuse *how* a hand is simplified, never *where* the reference's hand is.

### Route A — concept image first (recommended)
An image model is good at composition, pose and natural shapes; the agent is good at clean, lean vectors. So:
1. **Write the prompt** for the designer's image tool with `../generating-oneshot-image-prompts/SKILL.md` (2D flat vector track):
   the style traits in words, the subject with its 2–3 identifiers, a plain full view, plain one-colour background, no cast shadow on
   the background, no texture or noise, no text — vector-friendly. Tell the designer to **attach the style reference image** and ask
   for 2–4 options.
2. The designer generates, picks one and puts it in Figma.
3. **Pre-check the concept before copying** — say what fails and let the designer regenerate or accept: parts detached or floating,
   joins that do not overlap, hard parts (hands, shoes, face) muddled or off the build sheet, props not held, clutter (more identifiers than the style carries), off-style (palette, rendering, proportions), not vector-friendly
   (texture, noise, soft shadows on the background, tiny details below ~4 px at the target size).
4. **Copy it** by §2 — the concept is now the reference (size check, contour, score, keep its rendering).

### Route B — the agent builds it
Use when the designer chooses it or has no image tool. SKILL rule 7 applies throughout.
1. **Build plan in words first**: the subject's 2–3 identifiers; the big masses; the attach pairs (`[['Hand R','Arm R'], ['Bag','Hand R']]`);
   the join list `[front, back]` and how each join is drawn per the build sheet; the hard parts and their layers (a hand holding a
   cup: fingers over the cup, cup over the palm, thumb on the near side); the overlap order (what is in front); the inventory per
   region. Show it with the silhouettes.
2. **Silhouette stop** (below). The designer picks one.
3. **Build big to small** on the picked silhouette: main mass → secondary forms joined at their joints → covering forms (clothes over
   the body, a lid over a jar) → props held by what holds them → details → the finish layer from the build sheet. The compare
   sheet runs on the exported drawing alone (`--draw` only); `checks.json` boxes are then in that PNG's px. One pen-tool path per part (rule 6), shading on the shape
   (rule 1), named groups (rule 3). Three things a self-built drawing gets wrong in every style (a taco built beside a glossy
   sticker croissant, 11/2026: lumpy filling, flat shell, bumpy ink line):
   - **A mass of many small things** (a filling, foliage, hair, a crowd, clouds) is **one silhouette mass** in its base colour with
     a few overlapping items breaking its edge and top, in two or three sizes — never a row of equal bumps.
   - **Rendering depth is counted, not guessed**: per main mass, list the reference's tone layers from the build sheet (base · shade ·
     light · highlight · rim · gloss…) and give each new mass the same count and kinds; fewer layers reads flat beside the set.
   - **An outline follows the simplified silhouette**, not every bump inside it; its weight is measured from the reference.
4. **Creative checklist, every round** — answer each line with what you saw, not "ok":
   | Check | How |
   |---|---|
   | Reads at real size | screenshot at 1×: can you tell what it is in one glance? |
   | Values separate | greyscale copy (temp, deleted after): main forms still separate light / dark |
   | Style match | the five style lines hold; **placed beside the style reference at the same scale, one screenshot of both** — it looks like the same set. Not done = not finished: never report "not compared yet" |
   | Rendering depth | each main mass carries the reference's tone layers, same count and kinds (build sheet) |
   | Masses of many things | one base mass + a few overlapping items in 2–3 sizes; no row of equal bumps; the outline follows the simplified edge |
   | Not the reference's skeleton | pose, layout and silhouette differ from the reference subject's |
   | Attached | `floating(root, pairs)` empty; nothing peeks out from behind another part |
   | Joins overlap | `joins(root, list)` empty; each join cell of the compare sheet (`--draw` alone) drawn the way the build sheet says |
   | Hard parts | each hand / foot / face / ear (handle, spout…) in its layers, simplified the way the build sheet says — not a lump |
   | Build sheet | taper, corners, edges, inner lines match the sheet line by line; the finish layer is there if the sheet lists one |
   | Identifiers | 2–3, readable; nothing else competing |
   | Clean shapes | shape checks of §1 empty or reasoned; no seams at 4× |
5. **Report** the checklist with what you saw per line, and which choices you made yourself. Then say plainly that route A (a
   concept image, copied) gives a more natural result and offer it for the next subject — copying now reaches 0.99 of its reference,
   a self-built drawing is only as good as these checks.

### Silhouette stop (route B; route A's options play the same role)
- Each option is **one solid shape, one fill, no strokes**, at the real size.
- Options **differ for real** — pose, structure, props or proportions — not three copies with one change.
- **The subject is recognisable from the silhouette alone** at real size, through its identifiers (a doctor by the long coat and the
  stethoscope; a coffee cup by its handle and steam; a rocket by its fins). Not recognisable → not an option.

## 4. Fix existing art — the original is the standard
Work on a copy; keep everything that was right. Screenshot the original and the copy side by side at 4× after each round; name what
changed and confirm nothing else moved (bounds, colours, layer order). Shape checks of §1 on the fixed parts.

## 5. Static vs animated (Lottie)
Build order for any figure: body / torso → legs → arms → head → face → details, checking after each; objects: main body →
attachments → details.

**Static** (the default when the answer is "static"):
- Group parts for easy editing (`Head`, `Body`, `Handle`…); a part may be one shape when nobody moves it.
- No pivots, no joint covers, no splitting into segments — that is work nobody uses. Parts are still attached (rule 7).

**Animated later (Lottie)** — only when the designer said so, and only for the parts they named as moving:
- Each moving part is its own named layer or group (`Arm L upper`, `Arm L lower`, `Hand L`, `Lid`), nothing merged across a joint.
- Pivot at the joint: the joint end is rounded and sits **under** the covering part (sleeve, body); a small circle in the part's
  colour covers each joint so a rotation never shows a gap.
- A shape that morphs between poses keeps the **same anchor count** in every pose (`references/anchor-economy.md` §6).
- Avoid effects Lottie players render unevenly (layer blur, background blur, some blend modes) — note them for the Lottie step.
- Hand-off to the Lottie work: the list of moving parts, pivots, and what each one does.

## 6. Icons as a family
- One **accent colour** drives the icon's tones (fill, darker outline, shadow, highlight derived from it), so recolouring is one change.
- Build in pieces: **back** (base shape) · **content** (the symbol, often white) · **front** (overlapping detail) — each a named layer.
- Same grid, same stroke width, same corner radius and same optical size across the set; check new icons **beside** existing ones, at
  the real size (24 / 28 px) and at 4×.
- Lean pen-tool paths (rule 6, `tol: 0.25` at 24 px); strokes stay strokes so the weight can change in one place; geometric icon parts
  (a dot, a ring) may be primitives.
