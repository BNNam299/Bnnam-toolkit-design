# Lock phase — locked UI screens, components and batch acceptance

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/ui-build.md + core/build-loop.md §2.11 (lock half) @ 3c0e291 — translated, complete (toolkit machinery dropped: load contract, report template of the toolkit's own agents, pending-work notes)

The **lock rhythm** starts when the designer says *"lock screen …"* (*"chốt màn …"*). Before that, screens are drafts (`draft-and-option-rhythm.md`). This file covers: building in batches, what the UI step may not decide, components, icons, the audit, the eye check, binding legacy files. Each screen is built with the tool demo's loop (`../figma-ui-flow/references/build-loop.md`) plus `screen-building-lessons.md`, and checked against `frame-standards.md` §14. Read `../figma-agent-tools/references/troubleshooting.md` **before the first batch** of a session.

The UI step does its job well only when all that is left is to make it look good — the screen list, layout and copy were closed in the earlier steps.

## Contents
1. Build in batches — and when to stop
2. Before you start
3. The lock steps for one screen
4. Components — frame first, component when it repeats
5. Standard for a new component
6. Icon rules
7. Audit — `audit.js`
8. Eye check — end of every batch
9. Binding a legacy file — `bind.js`
10. Adaptive projects (iOS 27 · iPhone Duo · iPad)
11. Stop points and report

---

## 1. Build in batches — and when to stop

Use the lock phase when `design/components.md` is approved and screens are built batch by batch; when binding a legacy file's colours, text and spacing to the system in bulk; when auditing a messy file. **Not** for adding screens, changing layout, changing copy, or generating components that aren't in `components.md`.

**A batch = a group or flow of related screens** (*"to keep a good grip"*). The previous batch not accepted → **don't build the next one**. The user says *"build them all"* → still build one batch, stop, and say why: **a mistake in batch one multiplies into every batch.** Pick the first batch by: the flow that affects the most people, the one with the most problems, or the order users go through in time.

**Stop rhythm:** the **template screen** (the first screen of the first batch) is built in one go to the end — illustrations are empty placeholders (`screen-building-lessons.md` §3) — then **stop once** for the designer to review it as the standard · the rest of the batch is built straight through following the template, **review at the end of the batch** · **never stop between passes** (after the grey frame, mid-way through layering) — the grey frame is not a wireframe, don't ask for layout approval.

**Generated-image rhythm** (placeholders the designer marked (b) — `screen-building-lessons.md` §3): template-screen stop → the designer chooses → send the **template images** brief → keep building the next screens while the images are generated → images back: review, place them on the template screen, report one line (don't stop) → the designer approves the template images — ask **in words** for the drawing style per group too (*"characters soft 3D · icons / objects 2D flat · backgrounds 2D flat — right?"*; approving by eye misses things) → this becomes the **style / character / drawing-style standard** (ref for later briefs, recorded in `notes.md`) · later screens: **send each screen's brief when that screen's UI is done** (template images not approved yet → hold the brief); the choices made on the template screen are the **default per image kind** · end of batch: one combined review of screens and images; a rejected image → regenerate exactly that one, for the stated reason.

**Batch status** lives in the flow's `ui:` field in `design/flows.md`:
```yaml
- ui: accepted 16/09          # not built | building | awaiting acceptance | accepted <date>
```
The agent writes `building` when it starts and `awaiting acceptance` when the batch report is done. **`accepted <date>` only when the user says it is accepted** — same as every approval (`team-rules.md` §7). Every batch accepted and the user says *"approve UI"* → write `ui_approved: <date>`.

The designer checks and refines the batch — on a **duplicate** next to the original — then tells the agent → run the learning loop (`../figma-project-maintain/references/learn.md`, `team-rules.md` §12.5) before acceptance: lessons from this batch apply to the next batch **from the start**, without waiting for the designer to fix them again.

## 2. Before you start

| Check | If missing |
|---|---|
| `flows.md` `approved` (screen list, screen cases) · `style.md` `approved` — for new / redesign projects | run the UX flow (`../prd-to-ux-flow/SKILL.md`) · style reading (`../design-system-audit/references/style-read.md`) |
| *Single screen / clone test: the document gates in this table **do not block** — say what is missing (`../figma-project-maintain/references/processes.md`)* | — |
| `design/components.md` `approved` — **from the direction lock on** · maintenance projects: the existing system in Figma replaces `components.md`, new parts per the maintenance process. The first screen / a new direction still in the **option** rhythm (no components — `draft-and-option-rhythm.md` §9) doesn't need it yet | run the component spec (`../design-system-audit/references/component-spec.md`) after the designer locks the direction |
| `flows.md` has `wireframe_approved` — **only when the project uses wireframes** (`project.yaml › process.wireframe: true`) | do the wireframes (`../prd-to-ux-flow/references/wireframe.md`) |
| the previous batch (the `ui:` field of the previous flow) is `accepted <date>` | **don't build the next batch** — finish the previous one |
| the Figma part of `project.yaml` is still correct | re-run `../design-system-audit/scripts/detect.js` — pages may change between sessions |
| `project.yaml › screen.template` points at the template screen and it has been analysed (if the designer has one) | `detect.js` with `TEMPLATE`, describe the skeleton back for the designer to confirm (`frame-standards.md` §4) |
| the screen about to be touched has **no** `<screen name>_Fix` copy | if it has → the designer is editing: run the learning loop first (`team-rules.md` §12.3) |

**Read:** `design/lessons.md › In force` · `flows.md` · `components.md` · `voice.md` · `style.md` · decision log `[design]` · `project.yaml` · wireframes in Figma · `design/work/notes.md` (drafts, locked direction) · `style-parts/index.md` (form samples by family) · `competitor-parts/index.md` (function, block order).
**Write:** components at `components.atomicLocation` · screens on page `pages.ui` · `flows.md` (`ui:` of each flow; `ui_approved`) · `style.md` (raw values of visual areas) · decision log `[design]`.

**Three things the UI step must not decide:**
- **the screen list** — closed in `flows.md`;
- **the layout** — closed in the wireframe;
- **the copy** — closed in the wireframe per `voice.md`. Text overflowing its box → **go back to the wireframe** and fix it there, never cut it in place.

Something missing → go back to the step that owns it, never add it quietly. A UI screen is built by **finding the frame with the same name** on the wireframe page (`naming.md` §4) — no matching wireframe means it is being built directly: stop.

## 3. The lock steps for one screen

When the designer says *"lock screen …"*:
1. **Check the frame** — drafts already have the designer's structure (root `NONE`, layer frames, auto layout inside — `frame-standards.md` §1–2); swap any `Safe Area` placeholder for the `Safe-Area` instance and fix a split cluster (§7) if the review found one. No restructuring.
2. **Bind:** `bind_variables` matches the draft hex values to variables in one pass (`../design-system-audit/references/system-binding.md`).
3. **Components** (§4): review the locked screens → **propose a component list** (name · variants · properties · which blocks reuse an existing component) → the designer approves → build the components (a set with variants when there are several states, system tokens) → **rebuild the screen with instances** in place of the draft frames.
4. **Full Pass 3** (`screen-building-lessons.md` §7) and the done gate (§8 there).
5. **Documents:** read `design/work/notes.md` and turn it into a **list of proposed document writes** (which screens go into `flows.md` · which lines become decision-log entries · which blocks become official components · which lessons go into `lessons.md`) → the designer approves / strikes items → only then write, and report once.

**When `style.md › Proposed components` is already approved** (style learning): build those components as soon as the **first screen is locked** (the template screen); later screens use their instances from the draft rhythm on when the role matches — no need to wait for each lock.

## 4. Components — frame first, component when it repeats

- **Existing** in `components.md` / the file → **instance**. Never edit the main component, never detach.
- **New block not in the system** → build a **plain frame** first, named descriptively like a component candidate (`naming.md` §6).
- That block **used 2 or more times** — on the same screen or another → `../design-system-audit/scripts/componentize.js`: creates the component in **its own section**, replaces the copies with **instances**, differing text becomes overrides → record it in `components.md` with status **proposed** + a decision-log entry, wait for the designer's approval. The component **sits in the same section as the screen** (next to the screen, never on top of it); a separate section is also fine. **Never make a component "in case it repeats"** — only once it really repeats.
- **Multi-state block** (selected / unselected tab, chip on / off, primary / secondary / disabled button, empty / filled / error input) → **a component set with variants** (`create_component_set`, properties named per `naming.md`), never several loose components or hand-copied frames (a reference build had 5 component sets with variants where ours had 4 plain components).
- **Missing component in the middle of building a screen: don't generate it.** Note it, ask, add it to the system through the component spec, then use it. Components generated half-way almost always drift from each other.
- A block repeated **identically** on a second screen → turn the first screen's block into a component and replace both with instances.

**Order:** atoms → molecules → organisms. Don't build a card before the badge it contains.

**Clone-proto** — clone a node that already has the right tokens instead of creating one and binding by hand:
```js
const proto = source.findAll(n => n.type === "TEXT")[0];
await figma.loadFontAsync(proto.fontName);
const t = proto.clone();          // inherits font, bound colour, text style
t.characters = "Tiếp tục";        // real copy per voice.md ("Continue")
```
**Create the proto before any deletion** in the same script — cloning a deleted node fails (`../figma-agent-tools/references/troubleshooting.md`).

**Main components live in the component area** (`project.yaml › components.atomicLocation`), never inside a screen.

**Build only new components listed in the approved `components.md`.** Existing components — and the ones just built once the designer accepted them — are main components: **don't edit, don't add variants, don't detach instances**; need something different → override on the instance, or propose a change for the designer to make (`team-rules.md` §12.4).

**Acceptance — four counts at 0** (plus the standard in §5): unbound fills · unstyled text (except glyphs) · default-named frames · hand-drawn elements that should be instances. **An unusually low `instance / frame` ratio = hand drawing** — `audit.js` reports this ratio.

## 5. Standard for a new component

A new component must **work like one a person built by hand**: edit text, toggle optional parts, swap icons **without going inside the instance**, and **not break** when resized or given long text.

Evidence: a subtitle was added to `MB/Slot Chip` as a text node **without a text property** — editing it meant going inside the instance.

**Four kinds of property — use the right one**

| Kind | For | Not for |
|---|---|---|
| **Variant** | differences of **structure** or **state**: `State = Default · Pressed · Disabled`, `Size = S · M · L` | optional parts — use boolean |
| **Boolean** | **optional** parts: `Show icon`, `Show subtitle`, `Show badge` | states |
| **Text** | **every text users change**: `Label`, `Title`, `Subtitle`, `Value` | fixed text of the component |
| **Instance swap** | icons and swappable children: `Leading icon`, `Trailing icon` — with a list of suggested values | — |

- **Optional parts are booleans, not variants.** Three optional parts as variants = 8 combinations; as booleans = 3 switches.
- **Property names are consistent across components** — the main text is always `Label`, never `Label` here, `Text` there, `Title` elsewhere.
- **Default values are real copy** per `voice.md`, never `Label` or `Button` (`../ux-writing/references/principles.md`).
- **A nested instance with properties that need changing** → enable *expose properties from nested instances*.

```js
const labelProp = comp.addComponentProperty("Label", "TEXT", "Tiếp tục");   // returns a KEY string — use it directly
labelNode.componentPropertyReferences = { characters: labelProp };

const showIcon = comp.addComponentProperty("Show icon", "BOOLEAN", true);
iconNode.componentPropertyReferences = { visible: showIcon };

const iconSwap = comp.addComponentProperty("Leading icon", "INSTANCE_SWAP", defaultIconId);
iconInstance.componentPropertyReferences = { mainComponent: iconSwap };
```

**Auto-layout structure.** **A component root is auto layout** — unlike a **screen** root (`frame-standards.md` §2). Except visual components (`visual_…`).

| Part | Resizing |
|---|---|
| Component root | **hug** along the axis its content decides; the other axis is decided where it is placed (`FILL` inside a parent) |
| Multi-line text | width `FILL` · height `HUG` |
| One-line text in a narrow place | `HUG` + truncate at the end (`textTruncation = "ENDING"`, `maxLines = 1`) |
| Text group in the middle of a row | `FILL` — pushes both ends to the edges |
| Icon cell | fixed square from the sizing variable, glyph centred |
| Button, chip | `minWidth` so it never shrinks too small |
| Absolutely placed child | only for overlays (corner badge) or a visual background — with constraints |

Padding and gap **bind to spacing variables** (`../design-system-audit/references/system-binding.md`).

**Default recipes for common blocks** — use them when the project has **no** matching atom. **An atom exists → follow the atom**, don't lay a recipe over it.
```text
List row     horizontal · [icon HUG] [text group FILL] [value/chevron HUG] · height HUG
Card         vertical   · [media FIXED ratio] [content FILL · vertical] · width from parent
Nav bar      horizontal · [left HUG] [title FILL centred] [right HUG] · fixed height from variable
Chip         horizontal · [icon HUG?] [label HUG] · minWidth · radius = ½ height
Sheet header horizontal · [grabber] / [title FILL] [close HUG]
Button       horizontal · [icon?] [label HUG] · minWidth · fixed height from variable
```

**Load test before handing in — mandatory.** Place an instance and try: **text three times the normal length** in every text property · **narrowest** and **widest** reasonable width · **all booleans off** and **all on** · **every state variant**. Nothing overflows, overlaps or distorts → then hand it in. A problem → **fix the structure**, never limit the content. Check by eye (§8). Delete the test instances afterwards.

**Component acceptance:** every user-changeable text has a **text property** · every optional part has a **boolean** · every swappable icon has an **instance swap** · property names **consistent** with the other components · **load test** passed.

## 6. Icon rules

Two kinds of icon side by side: **font glyphs** (SF Symbols, Material Symbols — they are `TEXT` nodes) and **vectors**. Recognise a glyph by **a private-use character + short length**, not by length alone — `isGlyphIcon` in `audit.js`, character ranges from `project.yaml › icons.glyphRanges`. `✕` (U+2715), `→` (U+2192), `OK`, `12` are real text.

| Operation | Glyph | Vector |
|---|---|---|
| Apply a text style · change the font | **forbidden** | — |
| Resize | only via the frame, when asked | — |
| Letter spacing · line height | keep **0** · **AUTO** | — |
| Switch library | **forbidden** | forbidden |
| Bind `content/*` colours · rename the layer | allowed | allowed |

**Why absolute:** one pass of applying text styles filtered by `type === "TEXT"` switched **193 glyphs** to a regular text font → no character at that code point → empty boxes, invisible at canvas zoom.

**Removing a text style does not undo the values it wrote** — reset explicitly:
```js
await figma.loadFontAsync(node.fontName);
node.textStyleId = "";
node.fontName = { family: SYMBOL_FONT, style };   // keep the original weight — Semibold / SemiBold differ between fonts
node.letterSpacing = { unit: "PIXELS", value: 0 };
node.lineHeight = { unit: "AUTO" };
```
- **Filter glyphs out at selection time**, never apply then remove.
- **Health check after any bulk text operation** — all three must be empty: glyphs with the wrong font · glyphs still carrying a text style · glyphs with type-scale metrics (`audit.js` › `glyphHealth`).
- Glyph layer names follow the symbol name: `icon_chevron right` (`naming.md` §7), never the raw character.
- The same logic holds on every platform; only the character ranges and font names change (`project.yaml › icons`).

## 7. Audit — `audit.js`

`../ux-review-handoff/scripts/audit.js` — read only. Run it **after each screen** (meta-text part, before reporting the screen done) and **at the end of each batch** (everything). It covers:
- the nine system counts (`../design-system-audit/references/system-binding.md` §7) — `visual_…` areas skipped;
- **screen root is auto layout** (`frame-standards.md` §2);
- **meta text in the frame** · forbidden words · length (`../ux-writing/references/principles.md`, `voice.md`);
- **safe area** — instance of the right component, first child of the top block / last child of the bottom block; not hand-drawn, not detached (`frame-standards.md` §5);
- default frame names · **main component inside a screen** · components with **duplicate names** on any page · developer notes inside a screen;
- **near-duplicates** — the same thing under two names, or a project component repeating an atom (`CONFIG.PROJECT_PREFIX` from `project.yaml › components.projectPrefix`). The audit only gives **candidates** by name; whether they really are the same is a human call — merging → decision-log entry;
- **text contrast** (`team-rules.md` §10.3 — WCAG 4.5; large text ≥ 24px or ≥ 18.66px bold 3.0). A failing token pair → **pick another token** in the system, don't change the colour; a failing raw colour → defect; also **surface vs background (~1.2)** — per colour mode. The third threshold few people check: in a language without borders or shadows, the fill difference is the only thing separating a surface. One system had cards only **1.02** from the background — the cards had no edge, and nobody could say why the screen looked wrong;
- **overflow** — children heights + gap + padding vs available space. A screen frame taller than the device: tell real overflow from a frame deliberately extended to illustrate scrolling — **ask, don't guess**;
- **dead ends** — text like *how to · learn more · see all · set up* must have a target screen; the reverse direction uses `trace` (`../prd-to-ux-flow/references/ux-flow.md`);
- **instance lost its main component** — after switching an icon library the nodes update but overrides don't, and break silently. One library switch left **54 overrides** pointing at old names → empty icons while the layer tree looked normal;
- **adjacent corner radii** — report only, don't fix · **glyph health**;
- the `instance / frame` ratio.

**Report per area, never one merged number.** Image placeholders waiting for images are **expected** — counted separately, never as errors.
```text
Screens         12   ·  0 unbound fills  ·  0 unstyled text
Components       8   ·  2 unbound fills  (image placeholders — expected)

Needs a decision
  · 2 screens off the standard size
  · 1 main component inside a screen
  · 3 links without a target
```

## 8. Eye check — end of every batch

Besides one screenshot per screen per pass (`screen-building-lessons.md` §2.3), a review at the end of each batch. A query-based audit catches tokens, names, structure. **It misses what the eye sees at once:** clipped text, overlapping layers, distorted decoration, off-centre gradients, uneven spacing.

**At the end of every batch** — and **after any resize of a block with a visual area** (`../design-system-audit/references/system-binding.md` §6) — screenshot the screens and check:

- **Screen background** — use the file's existing `Background/*` component instance, placed **at the bottom-most layer** (`../design-system-audit/references/system-binding.md` §6b). None → `../screen-background/SKILL.md`. Never paint a gradient straight into the screen frame.
- **Learn margins and spacing from sibling screens** before building a new screen — read 2–3 sibling screens with `../figma-project-maintain/scripts/readscreen.js` (each block's margins), and use exactly those values: Content margin, padding of text-only buttons, icon–label spacing. Test: the new screen's Content margin = the sibling's.
- **Taking an instance from another state** (toggle Off → On, field Empty → Filled) — after switching the variant **re-check the bound colours** of the target state; old overrides can keep the old state's colour.
- **Reusing a block from another screen** — take it from a screen of **the same context** (Edit ← Edit, sheet ← sheet). Before placing it, compare the screen background fill and card fill with the source screen of the same kind — a block from a white-background sheet placed on a grey-background screen will be off.
- **Disabled state** — opacity only on the **content** (row, label, icon); the card background stays at 100 %. Fading the whole card sinks it into the screen background. `audit.js` › `fadedCardBackground` catches it.
- **New screens, drafts, fixed copies** — cloned with `../figma-project-maintain/scripts/clone.js` into their own section (`team-rules.md` §12.2).
- **Read the new screen as a stranger would** — `../mobile-ui-master/references/reading-screens.md`: do the six answers match `flows.md` (purpose, action, where it leads, states)? No → fix before reporting the batch.
- **New component vs its ref image:** place the source image listed in the component's `style from` field (`components.md`) next to the new component, same scale. Different shape, shadow, fill, density → fix the new component (not accepted yet, so not a main component), or report if a token is missing.

| Check | Common breakage |
|---|---|
| Text | clipped by accident · overflowing a button · a single word on the last line |
| Overlap | layers on top of each other · variants stacked |
| Visual | stretched images · off-centre gradients · illustrations with the main part cut off |
| Rhythm | uneven spacing between blocks · ragged alignment |
| Matches the wireframe | block order · primary CTA within the first view (the `— fold` line) |
| Two text zones | meta text left in the frame |

Check **screens with visual areas** first — errors gather there. **Fix before reporting.** The report says how many screens were checked and what was fixed.

**Proportion sample within the same file:** the **open** file already has an approved screen of the same pattern → check the new screen's proportions against it. Don't search across the project — other files may not be open.

## 9. Binding a legacy file — `bind.js`

`../design-system-audit/scripts/bind.js`: colours by semantic role · text styles by exact size match · spacing, radius, stroke to their variables · effect styles · **glyph icons skipped** · **report what doesn't match instead of forcing it** (`../design-system-audit/references/system-binding.md` §3–4).

Run with `DRY_RUN = true` on **one screen** first → read the report → only then run for real on the batch. Afterwards: `audit.js`.

## 10. Adaptive projects (iOS 27 · iPhone Duo · iPad)

When the project's adaptive level is not `none`: build variants per the `iphone-duo-adaptive` skill (`../iphone-duo-adaptive/SKILL.md`) — **change the structure, don't stretch** · the vertical control bar and vertical status come from the kit (`../apple-design-iphone/references/ios27-figma-kit.md`) · every vertical-bar item has a symbol **and** a title · Liquid Glass only for the floating control layer, never over content cards · brand lives in the content layer, never fills the system chrome.

## 11. Stop points and report

**Stop points**
- Template screen done (images are placeholders) → review as the standard + image placeholder table · end of batch → review + combined placeholder table · **no** stop between passes (§1).
- The placeholder table has a **drawing style** column for the designer to confirm before generating.
- Generated images: **no** extra stop — images arrive, are placed, one report line · later briefs wait for the template images to be approved · placeholders of a new kind (not on the template screen) wait for the end-of-batch table.
- Previous batch accepted before the next one (§1) · one of the three things the UI step can't decide → stop (§2) · batch acceptance.

**Self-check:** §4 component acceptance · §7 audit · §8 eye check.

**Report:** the standard report (`team-rules.md` §9) plus the audit block (§7) and the eye-check line: *"checked N screens, fixed …"*. The line **"Where I had to decide myself"** at this step usually points at gaps in `flows.md`, `style.md` or the wireframe — fix them back there with a decision-log entry.
```text
Next step
  → "accept batch Onboarding"
  → "build batch Add"              after acceptance
  → "UX review"                    when every batch is accepted
```

**Knowledge to load:** the designer's screen structure (`../mobile-ui-master/references/screen-structure.md` — read before building the frame) · `../mobile-ui-master/references/layout-spacing.md` · `../mobile-ui-master/references/visual-foundations.md` · `../mobile-ux-fundamentals/references/accessibility.md` · `../design-system-audit/references/component-system.md` · `../design-system-audit/references/figma-practice.md` · `apple-hig` + `material-design-3` (`team-rules.md` §10.2). Adaptive projects: the `iphone-duo-adaptive` skill · `../apple-design-iphone/references/ios27-figma-kit.md`. **Monetization screens** (paywall, sale, ad gate, plan banner): `../mobile-ui-master/references/monetization-screens.md` — **read its risk checklist before building / reviewing**.
