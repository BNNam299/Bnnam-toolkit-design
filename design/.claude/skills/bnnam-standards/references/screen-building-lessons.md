# Screen-building lessons — the team's additions to the build loop

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/build-loop.md @ 3c0e291 — translated, complete (toolkit machinery dropped: the `bnnam-figma` plugin and `run_toolkit_script`, the session checkpoint protocol, the Codex command line; plugin limits restated for the tool demo)

The tool demo's build loop (`../figma-ui-flow/references/build-loop.md`) is the base: outside-in, three passes, numbers every write, eyes per pass. This file adds what the team learned on real projects. Where the two differ, **this file wins in the team's files** (decision: the designer's standard wins). Applies to every build or edit of a screen in Figma: wireframes (passes 1–2 *are* the wireframe), locked UI, adaptive variants, maintenance edits, backgrounds, clone tests (§10). Not for steps that only write documents.

## Contents
1. Tools in the tool demo
2. Loop rules — always on
3. Image placeholders: layout → ask → fill
4. Pass 0 additions — read the clusters
5. Pass 1 additions — the frame
6. Pass 2 additions — fill
7. Pass 3 additions — lock
8. Done gate for one screen (team)
9. Modes (team)
10. Clone from an image — test mode
11. Common mistakes

---

## 1. Tools in the tool demo

- Frames, blocks, text: `render_tree` / `update_nodes` (`../figma-agent-tools/SKILL.md`). Team scripts (`scripts/*.js` in this skill set): read the script, set the config constants at its top, send the whole file as `code` to `execute_code{code, timeoutMs}` (default 30 s; pass up to ~120000 for long scans).
- `execute_code` only for short code no tool can do (component sets, variables, vector edits…) and for the team scripts. Long hand-written code in `execute_code` used to hang the plugin — a refusal or a hang means you are building the wrong way: split it or switch tool.
- Write size: the team's plugin refused a `render_tree` that creates a new screen with **more than 40 nodes**, or fills into a frame with **more than 60 nodes**. Keep to those limits in the tool demo too — hitting them means the screen is being built in one go; split it, don't work around it.
- Fallback to another Figma MCP when the plugin is not running → **say so** to the designer; the loop stays the same.

## 2. Loop rules — always on

1. **One screen at a time, built in passes** — never a whole screen in one write. The designer **sees the screen grow** in Figma: grey frame first, content after.
2. **Numbers after every write** (as the tool demo), plus: after switching auto layout on, re-check that the frame did not collapse to HUG.
3. **Eyes once per pass, per screen** — one screenshot of the whole screen at the end of each pass. Extra only for unusual blocks or numbers you can't explain. **Zoomed region-by-region shots only in clone tests** (§10). Creative screens: one whole-screen shot per pass is enough — the style samples already live in the cropped part images (`../design-system-audit/references/style-read.md`).
4. **At most 3 fix rounds for one problem** → stop, state the problem and the planned approach. The same error twice → change approach, don't retry the same thing.
5. **Non-destructive** — new screens, drafts, fixed copies go into their own section (`../figma-project-maintain/scripts/clone.js`; `team-rules.md` §12). Never rename a frame the designer named.
6. **Exported files live in the project**, not in the skill or plugin folders: images used in the design → `design/assets/` · temporary images for measuring, comparing, cropping → `design/work/` (deletable).
7. **Everything is vector.** Where an image is needed → **a vector hint block**: a frame at the right size named `image_<content>`, with a simple vector illustration inside that says what it is; the designer replaces it with a real image later. Never generate images on your own outside §3. Logos, brand icons, simple icons → draw SVG.
   - **Vector first, and drawn with care.** "Simple" means few unnecessary details, **not** crude: illustrations / logos / product shapes are built in **several layers** (base shape, main shape, light face, shadow, accent), colours from the project palette (light / dark of the same hue to model volume), smooth curves, balanced in the frame. Each illustration is a frame `illustration_<content>` or `image_<content>` holding named SVG / vector layers. A long SVG → send each shape separately, don't cram one write.
   - **Logo and brand lettering:** either **a vector that matches the original shape exactly** or **plain text** — never a near-match assembled from shapes (a circle drawn over the letter "p" looked worse than the plain word). **Measure the size** (height, width, letter spacing), never estimate.
   - **Text / numbers on a shape** (a flame with the number "1") must **contrast clearly with that shape**, and the shape must match the original (`audit.js` › `textLostOnShape`).
   - **One brand mark, one form:** a mark that appears in several places (logo and the Home tab icon are both the letter O) → build it **once as a component**, use instances elsewhere.
   - **When to draw:** **common UI icons** (menu, bell, search, check, plus, arrows, tab icons…) → draw vector **right away** in the fill pass · **illustrations, mascots, logos, photos** → the layout pass only builds an empty **placeholder**; draw after the designer chooses (§3).
   - **Vector vs generated-image threshold:** a shape of **1–2 shapes, flat colour, no overlap** (common UI icon, one-colour glyph, geometry) → vector · **3+ colour layers, overlap, shadow / gradient / detail** — icons included (multi-colour category icons, a hexagon icon holding a picture), illustrated objects (pen, eraser, trophy, whale), characters, artwork on cards → placeholder, suggest **(b) generated image** (a whale, pen, eraser and the shape above three stars drawn as vectors were rejected as ugly).
8. **Dark mode later** — build it only when the project reaches that stage.
9. **Build with build tools, not long code** (§1).
10. **Fast but not sloppy** — each write pours a whole cluster (up to 60 nodes) instead of many small writes · batch text / colour / icons of one round into one `update_nodes` · don't re-run a long script when `get_node` is enough · one screenshot per pass (a reference build finished a creative screen in ~8 minutes this way).
11. **Two rhythms: build & refine → lock.** Details in `draft-and-option-rhythm.md` (draft) and `lock-phase.md` (lock). In short: until the designer says *"lock screen …"* (*"chốt màn …"*) work only in Figma, one line per decision in `design/work/notes.md`, a quick audit per screen; documents, components and the full Pass 3 come at the lock.
12. **Reuse when the role matches, not by reflex.** **System atoms** (Safe-Area, status bar, button, tab bar, chip, divider…) and blocks with **the same meaning** that already exist → **instance** (`search_design_system` before building that block) · a new screen needs a block with **a different role** → **create a new block in the app's style** (same colour, type, radius, spacing tokens, same shape language) — never force an old component to look close enough · icons / app logo / images already in the file → use them, don't replace them with placeholders. (An earlier version of the rule — "a component exists, so use the instance" — forced new screens into old moulds.)
13. **Build → look → layer.** *"Build a rough frame, analyse it, see a sensible direction, then layer on; analyse again, layer again."* **Don't plan the whole screen (or the whole batch) in your head before drawing** (one test: the agent thought for almost 3 minutes before its first write; the reference build wrote after 17 seconds).
    1. Look at the ref / request → **build the rough frame now** (Pass 1: root `NONE`, Safe-Area, the layer frames the screen needs, grey blocks at estimated positions) — the first write within about **1 minute** after loading;
    2. **screenshot → look → choose one direction** (a short remark on what is there);
    3. **add one layer** (real text → blocks / instances → colour, tokens → UI icons → details; illustrations / logos / photos are only placeholders — §3);
    4. repeat 2–3 until it works.
    - **Don't stop between steps 1–4** — build straight through to the end of the screen; the grey frame is not a wireframe, don't ask for layout approval (a test agent stopped for "layout approval" after the frame).
    - **One screen at a time:** finish screen 1 before thinking about screen 2 · **the first screen is the template screen** — when it is done, **stop once** for the designer to review it as the standard; once style and structure are agreed, write one line *"style chosen"* in `notes.md`; later screens are built **following that template** (§9 *From template*), the whole batch straight through (a group or flow of related screens — `lock-phase.md` §1), review at the end of the batch.
    - **No components in the draft rhythm** — new blocks are plain frames; repeated / multi-state blocks are only **noted** in `notes.md`, components are built at the lock · the light number check after each write stays.
    - Knowledge, frame standards and hard rules **don't change** — the *before building the frame* items are read before step 1, the rest applied at the layer they belong to.
    - **Creative screens with cropped style parts** (`design/style-parts/index.md`): before laying on a block of some family → open that family's cropped image as the style sample.
14. **A new section goes next to the related section** — create it with `../figma-project-maintain/scripts/section.js`, `NEAR` = the nearest section of the same job (empty → the script picks the section the agent created most recently); never compute the position yourself in `execute_code` (sections used to land at random).
15. **Image placeholders → layout → ask → fill** — §3.
16. **A screen with a new direction → 2–3 sketched options, pick, refine** — `draft-and-option-rhythm.md` §9.

## 3. Image placeholders: layout → ask → fill

Applies to every UI build session — creative screens and clones alike. *"A vector drawn after the layout is done looks better and sits better in the layout"* — by then size, colour and breathing room are visible. (In a 3-screen clone test, drawing illustrations took most of 17 minutes and the free-placed images stuck out of their cards.)

**1. Layout pass.** Each illustration / mascot / logo / photo is an **empty frame** named `illustration_<content>` · `logo_<name>` · `image_<content>`:
- **right size and position** from the ref / region map, **inside the layout flow** (a child of the block that holds it, auto layout or constraints) — never placed freely sticking out of its block;
- light wireframe fill + dashed stroke, **no text on the canvas** (the content is in the layer name); lock the size (`FIXED`) so filling it doesn't shift the layout;
- **common UI icons are drawn right away**, not placeholders · **complex icons** (multi-layer illustrative icons, brand icons, stickers) → placeholder like an illustration;
- **background decoration** — every background region with decoration in the ref (dot patterns, strokes, confetti, rays, stars, shape blocks) **must get a placeholder**, never a plain background: a pattern covering the whole region → `image_bg-<region>` of kind **background**, placed under the region's content (absolute, covering it) · a decoration that **stands alone** → `image_deco-<content>` of kind **object** (a test left the yellow Home background empty and the Result screen without decoration);
- **one illustration = one placeholder:** objects that **overlap / interact** in the ref (a character riding a pen, papers flying around, a character holding a trophy) are **one** image, not split into `illustration_` + `image_deco-` ("instead of grouping the mascot and the pen into one picture, it split them"). Split only when that part is used separately elsewhere, needs its own motion, or the designer says so — *read the clusters* (§4) applies at image level too.

**2. Layout done = end of Pass 2** (text, blocks, colour, UI icons — only empty placeholders left), **not** after the grey frame. Ask at exactly two stops:
- **template screen** done → ask about that screen's placeholders, together with the template review;
- **end of each batch** (still one screen at a time) → **stop and ask the designer once** for the whole batch, with the table

  `screen · placeholder · kind · size · content · drawing style · detail level`

  - **drawing style** — *2D flat · soft 3D · line · hand-painted…* — the agent proposes, the designer confirms **before generating** (text is easier to check than a small image);
  - choices per item, **(a) agent draws a vector** and **(b) generated image** on equal footing — the agent pre-fills a suggestion **by the threshold in §2.7**: (a) only for 1–2 flat-colour shapes · (b) for every multi-layer / detailed image, icons, small objects and background patterns included · **(c) the designer finds the image** (replaces it themselves) — low priority. No more "crop from the source image";
  - **kind:** character · object (cut out) · background (full cover, not cut out);
  - **detail level** for (a) items, pre-filled, the designer may change it: **compact** — 3–6 layers: correct silhouette, main colours, one light / dark area, no small details · **detailed** — many layers as in §2.7 (shapes, light face, shadow, accent, details). Default proposal: **main** images (mascot, character, main hero, logo, brand icon) → detailed · **secondary background** images (trees, ground, clouds, moon, stars, bats, decorative patterns) → compact. *Compact* is still not *crude*: never one flat blob (drawing 10 detailed images took 8 minutes, twice the time of 4);
  - a combined answer (*"draw them all"*) is fine · **default by kind:** the choice made on the template screen applies to placeholders of the same kind on later screens without asking again — only placeholders of a new kind wait for the end-of-batch table;
  - **skip the question only** when the request is **explicit about images** (*"draw all the illustrations yourself"*, *"leave the images empty"*). A general line like *"build it yourself"* or *"use nothing from the file"* is **not** about images — still stop and ask (a clone test read *"build everything else yourself"* as permission to draw).

**3. Fill.**
- **(a) Vector:** draw **inside** the placeholder frame itself, image **centred**, keep the frame size, remove the light fill + dashed stroke — at the chosen **detail level** (§2.7).
- **(b) Generated image** — the team generates bitmaps with Codex in its own toolkit; in this skill set use `../app-asset-generator/SKILL.md` (one image per request, cut out on a key colour). The image generator is only an image maker: it never touches Figma. The team's rules for the brief and the review:
  1. **Brief** per screen: shared part = the palette only (later screens add a **style reference** = an approved image of the template screen of the same kind) · per image: name = the placeholder's layer name, kind, size in px = size in pt × 3, **drawing style**, content, ref (a crop already in `style-parts/` / `competitor-parts/`, crop more only if missing) · a background image notes the **region it sits under**.
     - **Drawing style per image:** **zoom into that image's own ref cell** and describe its style (2D flat / soft 3D / line…) — **never** one style sentence for the whole brief (one brief said "soft 3D" for all 12 images; flat icons came back as 3D emoji). The Ref line says **clear** or **blurry** (a small source image enlarged is still blurry even with enough px) · blurry ref → add a larger ref cell of the same style (the whole icon row).
     - **Style standard per group:** after reviewing the template screen's images, ask **in words** for the drawing style of each group (characters · icons / objects · backgrounds), e.g. *"characters soft 3D · icons / objects 2D flat · backgrounds 2D flat — right?"* → record in `notes.md` → later briefs **reuse it per group**, differing only when a **clear** ref shows otherwise (say so in the report). There is no preset standard — every app differs, the designer decides. (The agent guessed "soft 3D" from blurry refs and leaned towards the mascot: *"all the illustrations on the last screen except the mascot became 3D"*.)
     - **Blurry ref and no standard yet → 2D flat** (generators lean towards 3D) · never apply a character's / style ref's drawing style to objects · a brief with objects / backgrounds marked 3D while all their refs are blurry → reconsider.
  2. **Send:** template-screen images after the designer chooses at the template stop · later screens: send when **that screen's UI is done**, and only after the template images are approved (not approved yet → hold the brief) · don't sit and wait — keep building the next screen.
  3. **Review:** check counts and sizes, background by kind (cut out vs full cover) → **look at every image:** right content, right character vs the ref, no text · broken → note the reason, regenerate that image, **at most 2 rounds** · still broken → place the best version and report the defect · **compare side by side** with the ref and ask exactly one question: **"same drawing style as the ref?"** — a style mismatch (flat ref, glossy 3D image) = broken: regenerate, don't place.
     - **Place only after the whole run has finished and the check passed** — never pick up single images while generation is still running (a test placed 2 images early and skipped the check).
  4. **Place directly into the placeholder** with the same name on the screen — fill `{ image: <absolute path>, scaleMode }` (`FIT` for characters / objects · `FILL` for backgrounds), remove the light fill + dashed stroke · the designer checks **on the screen** that it fits the background and layout — report one line, don't stop.
  5. No image generator available → say so; the designer picks (a) or (c) instead.
- **(c)** keep the placeholder, write one line in `notes.md` (*"designer replaces it"*) — the done gate (§8) accepts it.

`audit.js` counts the placeholder frames still empty (`emptySlots` per screen) — that number is the list to ask about / fill.

## 4. Pass 0 additions — read the clusters

**Draft rhythm: Pass 0 is minimal** — goal + primary action + product content + the *before building the frame* knowledge + screenshot the ref, then **build now**. The region map is a few lines in your head, no per-block sizing · *learn margins from sibling screens* and *inventory everything reusable* are for **From template** mode or when the designer says to follow an existing screen · re-read old screens only when told to. The full list below applies at the lock and in From template. **Reading the clusters** and the **image inventory** still happen in the draft rhythm — a few lines, never skipped.

- One-sentence goal · **one** primary action · real copy per the project voice (`design/voice.md`, `../ux-writing/SKILL.md`) — no lorem.
- **Content follows the product, not the ref.** The ref / moodboard gives style and structure; text, figures, item names and illustrations change to the project's product and users (voice, brief). Copying the ref's text is a defect — except in clone tests.
- **Read the clusters — before the region map.** *"It needs thinking."* (A test split the screen by coordinates into Top / Content / Bottom and broke a visually connected cluster in two; the tool demo, without a fixed template, grouped it correctly.) Look at the ref and answer for each region:
  1. What sits on **the same background** (colour block, image, card)? → one cluster; the background is the frame that holds them.
  2. What **overlaps / peeks out** of an edge — which cluster does it belong to in meaning? → absolute inside that cluster.
  3. Which parts **scroll together**, which are fixed? → the cluster goes in the container that matches its scroll behaviour.
  4. If you split it, would changing one thing (background height, an extra text line) mean **editing two places**? → yes: don't split.

  5. What has to sit **over** something else (floating button, sticker, character overlapping two regions, sheet)? → its **own layer frame** in the root, at the layer order it needs.

  Only then place the **clusters** into the standard frame (Safe-Area, the usual `Content` / `Bottom Container` / `Top Container` **plus whatever extra layer frames the screen needs** — `frame-standards.md` §2, §7), **never split a cluster**. There is no answer key and no fixed number of layers: the example in `frame-standards.md` is one case.
- **Region map in the designer's standard** (`frame-standards.md`, `../mobile-ui-master/references/screen-structure.md`) with block sizes:
  ```text
  <Screen name>        FRAME · layoutMode NONE · size from the project settings (new project 402×874)
  ├─ Safe-Area top      instance of the project's safe-area component
  ├─ Top container      auto layout · blocks: …
  ├─ Content            auto layout · scrolls · blocks: Hero 354×208 · Title · List (3 rows) …
  ├─ Bottom container   auto layout · blocks: CTA FILL×56 …
  └─ Safe-Area bottom
  ```
  In the plan, the map lists **clusters** with **one line of reason** each (e.g. *"visual_Header — progress card, mascot sits on the yellow background"*) so the designer can catch a wrong grouping while approving.
- **Learn margins from sibling screens** — `../figma-project-maintain/scripts/readscreen.js` on 2–3 approved screens, use exactly those values (`lock-phase.md` §8).
- Inventory reuse: components in `design/components.md` / the file (`search_design_system`), variables, styles · mark **blocks that will repeat**.
- **Image inventory** (draft rhythm too, one read of the ref): each image → vector or placeholder by the threshold in §2.7 · each background region → plain or decorated (§3 step 1). A few lines in your head, so the layout pass misses no placeholder.

## 5. Pass 1 additions — the frame

- Root `NONE` + Safe-Area + the layer frames from the map (usually `Content`, `Bottom Container`, `Top Container`, plus any overlay frames) with their auto layout, sizing, padding, gap per the map + **named placeholder blocks at their real size** (`frame-standards.md` §12).
- Placeholder blocks **use the wireframe colours** (the wireframe kit's grey / plain grey — `../prd-to-ux-flow/references/wireframe.md`), **real size but no measurements written on the canvas**.
- Blocks that will hold children get their `layout`, `gap`, `padding`, `align` now, so Pass 2 fills them in place.
- **Background clusters** (§4) are built in this pass together with the placeholder blocks inside them — don't leave the background empty for later.
- Number check `depth: 2` on the root → **one screenshot**. **Pass when** every block of the map exists at the right size and sizing, it fits the screen, and the screenshot reads as the final layout in grey boxes.
- In wireframe work, Pass 1 plus real text **is** the wireframe. For locked UI, the screen starts from the wireframe frame with the same name (`lock-phase.md` §2): clone the wireframe onto the UI page, then Pass 2.

## 6. Pass 2 additions — fill

- **One write per region or cluster** (`render_tree{parentId}` into the placeholder, or delete it and insert at the right `index`), then text, icons, colours in batches with `update_nodes`. A placeholder's estimated height → `heightMode: "HUG"` once content defines it.
- **No redundant nesting:** a frame with **one child** and **no** padding / fill / stroke / auto layout of its own → remove it, lift the child (a test had wrapper frames `Hero`, `Bubble Column`).
- **Draft rhythm: no components yet** — only note repeated / multi-state blocks in `notes.md`. At the lock, components follow `lock-phase.md` §4: existing → instance (never edit the main component, never detach) · new → plain frame first · **used 2+ times** → componentize · **multi-state** → component set with variants.
- Number check after each write · **one screenshot at the end of the pass**.
- **Pass when:** no placeholder block or temporary grey left (except vector image hints and **image placeholders waiting for the designer's choice** or **for a generated image** — §3) · repeated blocks are instances *(lock rhythm)* · multi-state blocks are component sets *(lock rhythm)* · no floating layer sits on top of text · the screenshot shows nothing "temporary".

## 7. Pass 3 additions — lock

The full Pass 3 runs **at the lock rhythm**. While drafting there is only the *quick audit* — `stress_test` and `audit_design` wait for this pass.

1. `../ux-review-handoff/scripts/audit.js` on the screen — **the main gate, errors to 0** (except items covered by a recorded decision). **Mandatory** — never replaced by looking at a screenshot (a test agent admitted skipping audit, detect, readscreen and componentize). It also reports `stalePaint` (a variable bound correctly but Figma still paints the old colour) and `floatOverText` (a freely placed layer sitting on text — the pill-over-text defect). Plus `../mobile-ui-master/scripts/skeleton.js` against the template / a sibling screen when there is one.
2. `audit_design` — **secondary check**: adds contrast, lorem text, hidden layers, bindings to primitive variables. **Ignore** `no-autolayout` reports on the `NONE` root, `visual_` areas, `_Fix` copies and template screens — the designer's standard differs from the plugin's rule.
3. `stress_test{cases: [long-text, large-text]}` → **read the screenshot of the section**, not only the overflow list (HUG text clipped by an ancestor is not reported) → delete the test section.
4. Fix → **re-run exactly the checks that failed** → one final screenshot at `scale: 1` → read the screen as a stranger would (`../mobile-ui-master/references/reading-screens.md`).
5. **Check the logic of numbers and copy** (*"Lower Instagram to 24 opens — your limit is 20"*): every sentence with a number → the direction matches the verb (*lower / reduce* → the new number is smaller; *raise / loosen* → larger) · totals, percentages, prices recompute (`Save x%`) · the same number mentioned in two places matches · units and periods match (week / day). Wrong → fix the copy, note it in the report.

## 8. Done gate for one screen (team)

On top of the tool demo's Definition of Done (`../figma-ui-flow/references/build-loop.md` §9):

- [ ] All three passes — **never report done before Pass 3**.
- [ ] `audit.js` 0 errors (except recorded decisions) · `skeleton.js` matches when there is a template screen.
- [ ] Frame standard: root `NONE`, Safe-Area is an instance, every layer frame uses auto layout inside · no hand-drawn status bar / home indicator (`handDrawnStatusBar` = 0).
- [ ] No placeholder blocks left, no logo / icon left as a plain colour box — images are named vector hint blocks.
- [ ] Image placeholders (`emptySlots`) are filled, except those the designer will replace (recorded in `notes.md`) — §3.
- [ ] Every background region decorated in the ref has its image (no plain background instead of a pattern) · multi-layer / detailed images are not crude vectors — threshold §2.7.
- [ ] No split cluster (a background and the content on it are in one frame) · no redundant nesting — `frame-standards.md` §7, §14.
- [ ] Blocks used 2+ times are component instances *(lock rhythm)*.
- [ ] Multi-state blocks are component sets with variants.
- [ ] Vector illustrations / logos are drawn in layers with palette colours — not one crude shape · text and content follow the product, not copied from the ref.
- [ ] Long-text and large-text stress don't overflow; the test section is deleted.
- [ ] Final screenshot at `scale: 1` reviewed · the report states **what still differs** (vs the ref / template) and **what the agent decided itself**.
- [ ] Numbers and copy checked for logic (Pass 3 step 5) · the screen sits inside its section frame, the section title is correct (`outsideSection` = 0).
- [ ] Text on shapes is readable (`textLostOnShape` = 0) · a brand mark has one form, used as instances · blocks with an existing component use the instance.

## 9. Modes (team)

| Mode | When | Passes | Screenshots |
|---|---|---|---|
| **New build** | screen without a template, going to acceptance | 0 → 1 → 2 → 3 | one per pass + unusual blocks |
| **From template** | a sibling screen already passed the done gate | `clone.js` that screen → edit what differs → number check → 3 | changed areas + one final |
| **Sketch** | brainstorm alternatives, quick ideas | 1 → 2, stop at the designer's choice | one per pass |
| **Option** | screen with a new direction — 2–3 options (`draft-and-option-rhythm.md` §9) | 1 → 2 for all, pick 1–2 → full 2 → lock the direction | one of the whole row per pass |
| **Clone test** | measure how far the build gets a structure right from one image | §10 | per pass + diff image |

First screen of a batch → New build; later sibling screens → From template. **Real work is creating from refs and a moodboard** (`../design-system-audit/references/style-read.md`) — a ref is a source of style, not something to match pixel by pixel.

## 10. Clone from an image — test mode

Only to **measure structure** (frame packing, auto layout, closeness) — not how real screens are made.

- **Pass 0 extra:** export the source image at **3x** to `design/work/clone/` (`export_assets`, or the file the user gave) · **measure and pick colours with a script**, never by eye — block sizes, margins, spacing, font sizes, colour codes → a measurement table · **use `../bnnam-standards/scripts/clone_measure.py`, never write your own measuring script** (agents rewrote one every clone, ~1 minute before the first write): `screens <image>` (multi-screen image → `--crop` each) → `prep <image> --pt-width <screen width> --out design/work/clone/<run> [--crop …] --name s1` (screen image, 8pt grid, palette, block edges, units in pt) → more when needed: `px` · `row` · `col` · `bbox` · a measurement the script lacks → write it, note it in `notes.md` so the script can be extended.
- **Complex images** (photos, illustrations, detailed backgrounds) are **no longer cropped from the source and placed on the screen** → placeholders as on real screens, filled by (a) vector / (b) generated image / (c) the designer (§3) · crops from the source (`clone_measure.py crop`) are **only refs** for the image brief. Text, buttons, icons, logos are built for real (vector) · what can be drawn as vector (flat illustrations, geometric shapes, charts) is drawn carefully (§2.7) · **order still per §3:** layout with placeholders first, ask the designer, then fill.
- **Componentize still applies** — blocks repeated 2+ times (tab bar, pill, list row) become component + instances, even in a clone (a clone hand-copied the tab bar and pills).
- **Colours follow the ref:** picked by script from the source image · **bind the file's token only when it matches the ref colour** (same code, or each channel off by ≤ 4) — otherwise keep the raw colour and note it in `notes.md` (token proposal later), **never** swap in the nearest token (*"cloned, but used colours from the Figma file"*, *"colours far darker than the original"*) · surface / background contrast warnings from `audit.js` where the ref is like that → **note them in the report, don't change colours** away from the ref just to pass the audit.
- **Still the designer's frame standard** — pixel matching happens *inside* the root `NONE` + Safe-Area + layer frames with auto layout.
- **Hero / background image running up under the status bar** → a `visual_<name>` layer below the Top container (`frame-standards.md` §7) · a background with cards / a character on it → **a background cluster** that holds them, not pushed into Content.
- **Never draw the status bar or home indicator**, even when the source shows them ("9:41", signal bars, battery, bottom bar) — that space is the **Safe-Area instance** (`frame-standards.md` §5). The % difference in the top / bottom strips caused by the missing status bar is **accepted** — don't draw it to bring the number down (two clones in a row hand-drew a `Status Bar` frame) · `audit.js` › `handDrawnStatusBar`.
- **Pass 3 extra:** screenshot the build at the source image's size → **diff image** (`clone_measure.py diff <source screen image> <build image> --out …`: % difference, heat map, side by side, worst strips) to find mistakes by machine · score the structure: all containers and Safe-Area present · % of frames with auto layout · count of default names · logos / icons are vectors · number of generated image layers.
- **Pass 3 extra — eye-check where people look first** (a 5.2 % diff looked good, but the logo, the flame and the number "1" were wrong): **logo, illustrations, brand icons, text on images** — zoomed shot of each next to the original, fix shape / size / contrast before reporting done. The 3-round cap (§2.4) applies per spot; not there yet → name the spots still off, never fold them into the % figure.

## 11. Common mistakes

| Mistake | Consequence | Right |
|---|---|---|
| Whole screen in one `render_tree` | size errors, overflow, clipped text all at once · the designer sees no progress | Pass 1 frame → Pass 2 region by region (§1 write limits) |
| Screenshot after every small block | slow, costly, mostly shows nothing | numbers per write, a screenshot per pass |
| No screenshot until the end | visible errors (overlap, broken rhythm) pile up | one screenshot per pass |
| Fixing the frame once it is full | breaks the FILL / HUG chain | lock the frame in Pass 1 |
| Hand-copying repeated blocks | fixing one place means fixing N | used 2+ times → `componentize.js` |
| Logo as a colour box "because there's no logo file" | the screen is unusable | draw SVG |
| Reporting done, then asking "should I run the audit?" | Pass 3 skipped | audit and stress are part of building |
| Pasting long code / a whole long script by hand into `execute_code` without reading it | plugin hangs, must be reopened | build with `render_tree`; send team scripts as files with only the config edited |
| A pill / badge placed freely over text | text hidden, only noticed up close | put it in the auto-layout flow · `audit.js` › `floatOverText` |
| Several states as separate components | hard to switch states, they drift apart | a component set with variants |
| A one-shape crude vector illustration | the screen looks cheap, the designer redraws it | draw in layers, palette colours (§2.7) |
| Setting `boundVariables` by hand in code | right variable, Figma still paints the old colour | `setBoundVariableForPaint` / `update_nodes{var}` · `audit.js` › `stalePaint` |
| A logo assembled from near-match shapes (circle over a letter) | worse than plain text | exact vector or text, measured size (§2.7) |
| Number / text on a shape in the same tone | text disappears | contrast with the shape itself · `textLostOnShape` |
| One brand mark drawn two ways (logo, tab icon) | brand inconsistency | one component, many instances |
| Writing documents after every refinement round | slow, mostly rewritten later | `notes.md` draft, documents at the lock (§2.11) |
| Hand-building a block that has a component | breaks the system, slow | `search_design_system` before each block (§2.12) |
| Drawing illustrations while laying out | slow; effort spent before the layout is done, on images the designer may replace | empty placeholder → layout done → ask → fill (§3) |
| Splitting the screen by coordinates into Top / Content / Bottom, background in one place and its content in another | one visual cluster in two places; changing the background means editing two places | read the clusters before the region map (§4) |
| Sending images to generate before the screen's UI is done / before the template images are approved · sitting and waiting for them | images don't fit the layout; a style rejection means regenerating the whole batch; slow | §3 (b) — screen UI done first, template images approved first, generate in the background |
| Hand-drawing a status bar to look like the image | breaks the frame standard; a wrong height spreads through clones | only the Safe-Area instance (§10) · `handDrawnStatusBar` |
| An image placed freely, sticking out of its card | filling / replacing it shifts the layout | placeholder in the layout flow, fixed size, image centred (§3) |
| Running `stress_test` and full checks while drafting | minutes added, the screen still changes | draft: only `audit.js`; the full set at the lock (§2.11) |
