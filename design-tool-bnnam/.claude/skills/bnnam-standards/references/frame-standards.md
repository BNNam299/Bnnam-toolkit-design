# Screen frame standards (designer's frame, safe area, platforms, build checklist)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/screen-frame.md (all) + modules/ui-draft.md (cluster grouping, draft frame size) @ 3c0e291 — translated, complete. Overrides the toolkit's draft root (vertical auto layout): the designer decided drafts use the same `NONE` root and that the layers inside are not limited to three.

Applies to **wireframes and UI** alike. The tool demo's generic frame sizes and grids live in `../figma-ui-flow/references/file-standards.md` §4; this file is the team's (designer's) standard and **wins** where they differ (§11 lists the differences).

## Contents
1. One frame structure for drafts and locked screens
2. The rule: the screen frame has no auto layout; the layers inside are not fixed in advance
3. Why, and the evidence
4. The designer's template screen
5. Safe area is a spacer component — never draw the status bar
6. The standard `Safe-Area` component (all devices) and `scripts/safearea.js`
7. Background clusters and full-bleed visuals
8. The designer's measured structure standard
9. iPhone Duo frames
10. Platforms (iOS / Android / Web)
11. Differences from the tool demo
12. How to build it (code and `render_tree`)
13. Acceptance check
14. Screen build checklist

---

## 1. One frame structure for drafts and locked screens

Drafts, options, clones and locked screens use **the same structure** (the designer's decision: *"draft or real, both need the auto-layout structure"*): the screen frame has **no auto layout** (§2), everything inside it is built with auto layout. Locking a screen therefore never restructures it — it only binds values and swaps in components.

| | **Draft / option / clone** (before the designer says *"lock screen …"* — *"chốt màn …"*) | **Locked screen** |
|---|---|---|
| Structure | Same as locked: root `NONE`, layer frames placed in it (§2), auto layout inside. Read the clusters first (§7). | Same. |
| Frame size | **Clone → the reference's size** (measured 375×812 → build 375×812). Option / draft → the project's screen size; none → the platform size. | **New project: 402×874** (the designer's iPhone, Safe-Area 62 / 34). **Existing project: the size of the screens already designed in that file** — keep their aspect ratio so new screens line up with the old ones. Recorded in the project settings, fixed. |
| Safe area | `Safe-Area` instance when the file has the set; otherwise a placeholder frame at the device inset, swapped at the lock. | `Safe-Area` instances (§5). |
| Values | Hex, no variables, no components (`draft-and-option-rhythm.md` §4). | Bound to the system, components built (`lock-phase.md`). |

## 2. The rule: the screen frame has no auto layout; the layers inside are not fixed in advance

**The root frame that wraps a screen is always a plain frame** — `layoutMode = "NONE"`. Inside it sit **layer frames**, each placed at its position and stacked bottom → top; **everything inside a layer frame uses auto layout** (free positioning only for deliberate geometry and visuals — `visual_…`, absolute overlaps inside a cluster).

The usual skeleton is `Content` → `Bottom Container` → `Top Container`, but **the set of layers is not limited to these three**. Whatever has to sit **on top of** something else — a floating button, a tab bar, a sticker or badge over a card, a character overlapping two regions, a `visual_` background cluster, a scrim, a sheet, a popup, a toast — gets **its own frame in the root**, at the layer order it needs. What a screen needs cannot be predicted: read the screen (§7 and `screen-building-lessons.md` §4) and add the layer frames it calls for, rather than forcing everything into three boxes.

```
Add-Photo-Detail Meal_Result      FRAME · layoutMode NONE · size from the project settings, fixed
├─ Background/<name>                instance · bottom-most layer (if any)
├─ visual_Header                    background cluster with the content on it (if any)
├─ Content                          auto layout · scrolls
├─ Bottom Container                 auto layout · bottom safe area
├─ Top Container                    auto layout · top safe area
├─ FAB / sticker / overlapping art  own frame, auto layout inside, placed over what it covers
└─ Scrim / Sheet / Popup / Toast    own frames, top-most
```

A **component** root is the opposite — it is auto layout (`lock-phase.md` §5). Do not confuse the two rules.

## 3. Why, and the evidence

**Why**
- **The device size must stay fixed.** An auto-layout root hugs or fills its content — a 393×852 screen grows and shrinks as blocks are added or removed and is no longer a device frame.
- **Floating layers need absolute coordinates.** Floating tab bar, FAB, bottom sheet, scrim, toast sit **on top of** the content at a fixed position. Inside an auto-layout root they need `layoutPositioning = "ABSOLUTE"` — and hit the trap where `FILL` fails on an absolutely positioned child (`../figma-agent-tools/references/plugin-api-recipes.md`).
- **Frames deliberately extended to illustrate scrolling** — people do this out of habit. An auto-layout root makes that uncontrollable.
- **The safe area is a fixed zone**, not an item in the content flow.

**Evidence**
- The original requirement said explicitly *"do not use auto layout"* for the screen frame — the agent still built screens with an auto-layout wrapper as the root for the whole project.
- **Pencil:** the default frame is horizontal auto layout. Setting `x/y` on a child is ignored **silently** — you must set `layoutPosition: "absolute"` on each child, or turn layout off on the root.
- **Figma:** `createFrame()` defaults to `NONE`, but **cloning an auto-layout screen keeps the auto layout** — the error spreads through clones. After cloning a screen: **check the root and set it back to `NONE` immediately.**

## 4. The designer's template screen

**The template screen comes first.** The designer places one (or a few) standard screens their own way — often **copied from another file** they designed. **Analyse the template before building any screen**: run `../design-system-audit/scripts/detect.js` with `TEMPLATE` set (or `get_node{ids:[template], depth: 3}`) and read its skeleton — which blocks, which auto layout, which sizing, instances of which components, describe it back in words for the designer to confirm, then record **a pointer** to it in the project settings (screen template = frame name / id). The structure stays in Figma, not copied into a file — re-read the template every session (Figma is the source of truth).

**Learn structure, not values.** A screen copied from another file carries that file's variables, text styles, colours and components — `detect.js` counts them (bound variables / styles / components whose key is not local) and says so in its template note. So:
- **Learn:** block hierarchy · auto layout and sizing · child order · which component stands where · how the safe area is built
- **Do not learn:** colours, text, variables, styles, specific measurements — values always come from **this file's system** (`../design-system-audit/references/system-binding.md`)
- Component from the other file → match it with the **atom with the same role in this file** by name; none found → ask, do not create one
- The template **is not a project screen**: do not audit it, bind it, or count it in progress (list it in `TEMPLATE_FRAMES` of `../ux-review-handoff/scripts/audit.js` and `../design-system-audit/scripts/bind.js`; skip it in `audit_design`, `bind_variables` runs)

The template is **tier 1** for structure: its structure beats this toolkit's default structure. If the template breaks a core rule (e.g. its root is auto layout) → say so once, with the risk, and let the designer decide.

## 5. Safe area is a spacer component — never draw the status bar

**The safe area is an empty-space component; never draw a status bar or home indicator** — not even when cloning from an image that shows one. A layer that is not an instance named *Status bar* / *Home indicator* but draws one is a defect — `audit.js` › `handDrawnStatusBar` catches it (`audit_design` does not; without the script, `find_nodes{name: "Status"}` / `get_node`). Standard build when the project's safe-area setting is `spacer-component`:

```
Settings_Result                   FRAME · layoutMode NONE · 393×852 · no fill of its own
├─ Background/<name>                instance · BOTTOM-MOST LAYER · size = screen · STRETCH — the background is a component (system-binding §6b)
├─ Top container                    vertical auto layout · width = screen · height HUG
│  ├─ Safe area/Top                 instance · height = platform top safe area (60) · width FILL — empty space
│  └─ Toolbar top / nav bar / …     instance — always exactly one safe area below the top edge
├─ Content                          auto layout · scrolls
└─ Bottom container                 vertical auto layout · anchored to the bottom · height HUG
   ├─ Button / tab bar / …          instance
   └─ Safe area/Bottom              instance · height = platform bottom safe area (34) · width FILL — empty space
```

- **Two atom components the designer has prebuilt** in the system — names from the project settings (safe-top / safe-bottom component names); each is an empty frame exactly the safe-area height, width `FILL`. **The agent does not create or edit them on its own** (main components belong to the designer); not found in the file → ask the designer, do not build one yourself. (The one exception is `scripts/safearea.js` in `apply` mode, run only when the designer agrees — §6.)
- The top safe area is the **first child** of the top container; the bottom safe area is the **last child** of the bottom container. Thanks to auto layout, the neighbouring element always sits exactly one safe area from the edge without setting coordinates.
- **Full-bleed images / backgrounds under the status bar** (full-bleed hero, cover photo, gradient strip at the top): see §7.
- **Never hand-draw** a 60-high frame, **never detach** the instance. Changing the standard (different device, different safe area) = the **designer** edits the component once and every screen follows.
- A screen with nothing at the bottom still keeps `Safe area/Bottom` if the project convention requires it — ask when the template does not make it clear.
- Wireframes use the **same** two components (they are just empty space, no colour) — wireframe and UI structure match from the start.

**Why:** a single source for the safe-area height. **Evidence:** *"status bar wrong height spread across 23 screens"* — a safe area drawn by hand on each screen is wrong everywhere once it is wrong in one place and cloned. With instances there is only one place to be wrong, and `audit.js` › `safeArea` finds screens that hand-draw it, detach it, or use the wrong component (instance of the right component, first child of the top block / last child of the bottom block, not hand-drawn, not detached).

Project declares the safe area as `none`, or has no component → follow §2: the top and bottom containers reserve the safe area with **padding** taken from the project's platform settings. (The designer's own measured standard, §8, always uses the `Safe-Area` instance, never padding.)

## 6. The standard `Safe-Area` component (all devices) and `scripts/safearea.js`

Every design file has **one** set **`Safe-Area`** with two variant properties **`Position` (Top | Bottom) × `Device`**. A variant is an **empty frame, no fill, clipping**; instances are placed FILL horizontally. **Safe-Area is the system area** (status, camera, home indicator) — it does **not** include the app's bars and does **not** include layout margins. **There is no `Trailing`:** the 84 vertical-bar area belongs to the system and `Pane controls` holds it.

| Device | Top | Bottom | Source |
|---|---|---|---|
| iPhone (402 × 874) | **62** | **34** | Apple — iOS 27 kit |
| iPad | **32** | **20** | Top: Apple (kit 27) · Bottom: no Apple number yet — provisional 20, **PENDING measurement on Device Hub** |
| Duo Inner Portrait (669 × 951) | — | **24** | Top: **no Safe-Area** — the 84 strip is the system bar (`Toolbar - Top - iPhone Duo` contains status + camera) · Bottom: designer (the kit's 95 is the tab bar) |
| Duo Inner Landscape (951 × 669) | — | — | **No Safe-Area — padding** (designer's decision). Apple = 0 (status lives in the vertical bar) · *replaces the old rule "24 / 24 inside each pane"* |
| Duo Outer (466 × 678 / 678 × 466) | — | — | Same as Duo Inner Landscape — **padding, no Safe-Area** |

**Where it goes**
- **Horizontal bars** (iPhone, iPad, Duo Inner Portrait): Top is the first layer of `Top Container`, Bottom is the last layer of `Bottom Container`. **Duo Inner Portrait: the top block is `Toolbar - Top - iPhone Duo` (system bar 84) — no Safe-Area Top**; an extra one is a defect.
- **Vertical bars** (Duo Inner Landscape, Duo Outer, Split…): **no Safe-Area frame**. Use the **padding** of the pane and the blocks inside it instead: **left ≥ 20 · top ≥ 24 · bottom ≥ 24**. **The edge touching the vertical bar = 0** — content always sits flush against `Pane controls`; the spacing on that side comes from `Pane controls`' own padding (12). Split Left (bar on the left) → mirror the sides. Padding 0 on an outer edge only for deliberate full-bleed backgrounds / media. `audit.js` reports `safeArea` (an extra Safe-Area), `duoMarginBelowApple`, `duoPaddingNextToBar`.
- **Left margin, inner edge of a pane:** **padding, not Safe-Area** — there is no system on the left (asymmetric safe area; RTL does not mirror the vertical bar). **At least 20 on Duo** (Apple's margin) — the designer may choose more per block. Split View: the app on the left also only needs margins.
- iPhone frames other than 402 × 874 (e.g. 375 × 812): **PENDING** — 44 / 34 from existing knowledge, needs verifying.
- Numbers in the designer's component that **differ from Apple** (e.g. iPhone Top 60 vs 62) → `safearea.js` reports them; fix to Apple when the designer agrees (`FIX_TO_APPLE`). Apple numbers win where Apple has one.
- The *Safe Area Inset* annotation layer in Apple's kit **sometimes includes the app's bar** (e.g. 95 on Duo Inner Portrait = tab bar) — **do not use it as the system inset**.

**`scripts/safearea.js`** — run when a file has no set yet, or the set does not cover every device the project targets. Read the script, set `CONFIG` at the top (`MODE`, `DRY_RUN`, `DEVICES` = the project's targets, `FIX_TO_APPLE`), send the whole file as `code` to `execute_code{code, timeoutMs}`.
- `MODE: "check"` (read only) first → report to the designer → `MODE: "apply"`, `DRY_RUN: false` when the designer agrees.
- No set → creates the full set in its own section (`Components — agent`). Set exists (e.g. only `Position`) → adds the `Device` property (old variants become `Device = iPhone`) + the missing variants. **Never changes the height of an existing variant** — a mismatch is reported (`heightMismatch`), fixed only with `FIX_TO_APPLE` and only for Apple-sourced cells. Variants of vertical-bar devices that already exist are reported (`noLongerUsed`), never deleted — the designer decides. A set from an external library → the script stops: edit it in the library file.

**Which variant a screen uses** — the variant **for the screen's device** (name suffix → Device: `_Inner Landscape` → Duo Inner Landscape, `_Inner` → Duo Inner Portrait, `_Outer` → Duo Outer, `_iPad` → iPad; no suffix → by frame size — iPad size → iPad, otherwise iPhone). `audit.js` also reports a **status bar of the wrong device** (`statusBarWrongDevice`, e.g. an iPad screen using the iPhone status bar) and **Duo pane margins under 20**. The height is the component's job, not the screen's.

## 7. Background clusters and full-bleed visuals

**Images / backgrounds that run up under the status bar** (full-bleed hero, cover photo, gradient strip at the top of the screen): the `visual_<name>` layer is **a child of the root frame, below the Top container** (lower in layer order), any size and position. **Do not** make the hero the first layer of the Top container or of Content to push it up to the top edge — the Top container still starts with the Safe-Area. Fixed navigation buttons on top of the hero (close, back) belong to the Top container as usual. A `visual_` layer is not counted as the top block in the safe-area check (`audit.js` › `safeArea`; a clone that made the hero the first layer was reported as "Safe-Area not first"). **Content that sits on the background** (cards, speech bubbles, characters) → the background cluster below, not pushed into Content.

**Background cluster** — *"it needs thinking"*, not a hard rule. A region that has **its own background** (a colour block, image, pattern) **with content sitting on it** is **one cluster** → one frame `visual_<name>` that **contains** that content:
- images that overlap / peek out (character, bubble, decoration) are placed **absolutely** inside the cluster;
- content blocks (card, text rows) follow the cluster's auto layout (usually aligned to the bottom);
- the block right after the cluster (Content) starts at the cluster's bottom edge.

Read the clusters **before** placing anything into the layer frames (`screen-building-lessons.md` §4 *Read the clusters*). Do not apply it mechanically: a cluster that scrolls with Content lives inside Content; a static background behind scrolling content is separate — answer the questions, do not guess from position.

Example the designer demonstrated (a clone of Home) — **just one case**:

```
Home                            FRAME · NONE · 402×874
├─ visual_Header                402×390 · vertical auto layout, bottom-aligned · yellow background
│  ├─ illustration_hero-mascot  absolute — the character peeks out over the background
│  ├─ Speech Bubble             absolute
│  └─ Progress Card             in the flow — the card sits on the yellow background
├─ Content                      starts at y = 390 · HUG · Categories · Daily Challenges
├─ Bottom Container             Tab Bar · Safe-Area Bottom
└─ Top Container                Safe-Area Top · Toolbar (avatar, greeting, bell)
```

The earlier toolkit build left `visual_Header` empty and moved the mascot, bubble and card into `Content › Hero Block` (adding `Hero`, `Bubble Column` layers) — it looked the same, but changing the background height did not move the content, so the designer had to edit two places.

## 8. The designer's measured structure standard

The designer named *Screentime Control* as **the screen structure standard**; it was measured on 117 screens + 4 case projects. Apply it in every project that has no template screen of its own:
- root `NONE`, corner radius following the device corners, root fill is a surface token;
- **layers bottom → top:** `Background/*` (if any) → **Content** → **Bottom Container** → **Top Container** → `Scrim` → sheet / popup. The Top Container sits **above** Content so scrolling content slides under the top bar;
- the three main blocks are **frames by default**; a block repeated **identically** on a second screen → turn the first screen's block into a component and replace both with instances (`lock-phase.md` §4) · the safe area is **always** a `Safe-Area` instance — never reserved with padding · padding / gap on layout frames are raw numbers on purpose;
- Top Container = `Safe Area` 60 + `Toolbar_Top` 76 (IAP / paywall: toolbar 48) · Content vertical, padding 24 or 8/16, gaps chosen by relationship — title ↔ body, inside a group, between groups (`../mobile-ui-master/SKILL.md` §2) · Bottom Container = CTA 56 + bottom 44 (or `Safe area_bottom` 34) · sheet = `Scrim` + `Bottom sheet` (sheet toolbar 76, bottom padding 34);
- templates per screen type (welcome, onboarding, IAP, popup, sheet, settings) come from the designer's screen-structure notes.

(The measured `Safe Area` 60 is the designer's component; Apple's number is 62 — §6, `FIX_TO_APPLE` only with the designer's agreement.)

## 9. iPhone Duo frames

Measured on 31 of the designer's real Duo screens:
- **Horizontal bars** (iPhone, **Inner** in portrait): keep the §2 frame — root `NONE`, Top · Content · Bottom Container. Inner uses the kit's **`Toolbar - Top - iPhone Duo`** as the top block (it already contains the status); the bottom block ends with the **`Safe-Area` Bottom**; margin 20.
- **Never hand-draw system bars** — the vertical bar is the `Pane controls` component; the Inner Portrait top block is `Toolbar - Top - iPhone Duo`; vertical / horizontal status comes from the kit's `Status bar - iPhone Duo` component.
- **Vertical bars** (**Outer**, **Inner Landscape**): the root is **HORIZONTAL auto layout** — the **panes**, then **`Pane controls`** (component 84, last layer, next to the hardware; it contains the vertical status and the button groups with the **same actions, in the same order** as the iPhone version). No top / bottom block, no `Safe-Area`.
- Outer: one `Content pane` 382 (= 466 − 84) holding content + CTA · Inner Landscape: a `Leading pane` (CTA, controls) + a large content pane.
- **Safe area:** the `Device` variant of the standard `Safe-Area` (§6) — Inner Landscape, Outer: **no Safe-Area — padding left 20 / top 24 / bottom 24, edge touching the vertical bar 0** (replaces "Top / Bottom 24 inside each pane"); the 84 edge is held by `Pane controls` · Inner Portrait: top is the 84 system bar (no Safe-Area), bottom 24 · pane margins are padding ≥ 20.

Measurements, pane split and how expanded states move per frame: `../mobile-ui-master/references/screen-structure.md` §11 · adaptive (iOS 27 / Duo / iPad) layouts in depth: the `iphone-duo-adaptive` skill.

## 10. Platforms (iOS / Android / Web)

**One layout for iOS and Android** — the structure designed for iOS applies unchanged to Android; only **system UI components** follow each platform.

Frame size and safe area are **not hardcoded** — they come from the project's platform settings. The tables below are a **starting point** when detecting (reading the file) and when asking the user to confirm, not values to apply directly.

| | iOS | Android | Web |
|---|---|---|---|
| Safe area | component the designer prebuilt (§5) | same as iOS | none |
| Skeleton, navigation, components, icons | per the designer's standard | **shared with iOS** | header, breakpoints |
| System elements | iOS alert, picker, share sheet | Android dialog, picker, share sheet · system back | browser |

| | iOS | Android | Web |
|---|---|---|---|
| Safe area | notch + home indicator | status + gesture bar | none |
| Icons | SF Symbols as text | Material Symbols | SVG |
| Navigation | bottom tab bar | bottom nav / drawer | header |
| Frame size | new project 402×874 · existing project: its designed screens | 360×800 | breakpoints |

The icon-protection rule (glyph icons) keeps the same logic on every platform; only the character ranges and font names change (`lock-phase.md` §6). App-type-specific patterns: `../mobile-ui-master/references/screen-structure.md`.

**Wireframes are built for the phone (compact) only.** Other sizes are built by the user as variables and modes (`../design-system-audit/references/system-binding.md` §5). The root frame size comes from the project settings — it does not need a variable binding (system-binding §4).

## 11. Differences from the tool demo

The tool demo already follows the designer's root (`NONE`, layered `Content` → `Bottom Container` → `Top Container`) and frame size (new project 402×874, existing project = the size of its designed screens) — `../figma-ui-flow/SKILL.md` rule 2, `../figma-ui-flow/references/file-standards.md` §4. What remains different:

| Topic | Tool demo (`figma-ui-flow`, `figma-agent-tools`) | Team standard (this file) |
|---|---|---|
| Safe area | a `Safe Area` placeholder frame (62 / 34) that becomes an instance in Pass 2 (`render-tree-dsl.md` §5) | `Safe-Area` set instance (`Position` × `Device`) as first / last child from the start of the lock; padding only for vertical-bar Duo frames or projects without the component; never a hand-made frame left in place |
| Free graphics naming | `decor/…`, `image/…` | `visual_<name>` for free graphics / background clusters; `image_<name>`, `illustration_<name>`, `logo_<name>` for image placeholders |
| Layers in the root | `Content` → `Bottom Container` → `Top Container` → `Scrim` → sheet | the same as the usual skeleton, but **not limited to it**: any element that must sit over others gets its own layer frame (§2) — in drafts and locked screens alike |
| Background | root fill | `Background/<name>` instance at the bottom-most layer when the file has one (§5) |

## 12. How to build it (code and `render_tree`)

Plugin API (`execute_code`):

```js
const screen = figma.createFrame();
screen.layoutMode = "NONE";                 // explicit, even though it is the default
screen.resize(FRAME_W, FRAME_H);            // from the project's platform frame — do not hardcode
screen.clipsContent = true;

// top block: the safe area is a component instance, first child (§5)
const top = figma.createFrame();
top.layoutMode = "VERTICAL";
screen.appendChild(top);
top.x = 0; top.y = 0;                       // absolute coordinates on the root frame
top.layoutSizingVertical = "HUG";
top.resize(FRAME_W, top.height);
const safeTop = safeTopComponent.createInstance();   // atom prebuilt by the designer — the project's safe-top component
top.appendChild(safeTop);
safeTop.layoutSizingHorizontal = "FILL";     // set after appendChild (see figma-agent-tools §6)
top.appendChild(toolbar);                    // always exactly one safe area below the top edge

const content = figma.createFrame();        // children use auto layout
content.layoutMode = "VERTICAL";
screen.appendChild(content);
content.x = 0; content.y = top.height;      // right below the top block
```

Same frame as a Pass 1 `render_tree` write (designer's iPhone 402×874; Safe-Area 62 + toolbar 76 = 138; bottom = CTA 56 + padding + Safe-Area 34). Children are appended in order, so the first child is the lowest layer — this gives the designer's order Content → Bottom → Top. Verify layer order and positions with `get_node{depth: 2}`:

```jsonc
{ "select": false, "tree":
{ "type": "frame", "name": "Settings_Result", "width": 402, "height": 874, "clip": true, "radius": 0,
  "children": [
    { "type": "frame", "name": "Content", "x": 0, "y": 138, "width": 402, "height": 612, "widthMode": "FIXED", "heightMode": "FIXED",
      "layout": "VERTICAL", "padding": [8, 24], "gap": 48, "children": [
      { "type": "frame", "name": "Section 1", "widthMode": "FILL", "height": 240, "heightMode": "FIXED", "fill": "#FF00001A" } ] },
    { "type": "frame", "name": "Bottom Container", "x": 0, "y": 750, "width": 402, "widthMode": "FIXED", "heightMode": "HUG",
      "layout": "VERTICAL", "padding": [12, 24, 0, 24], "gap": 22, "children": [
      { "type": "frame", "name": "CTA", "widthMode": "FILL", "height": 56, "heightMode": "FIXED", "fill": "#FF00001A" },
      { "type": "instance", "component": "Safe-Area", "variant": { "Position": "Bottom", "Device": "iPhone" }, "widthMode": "FILL" } ] },
    { "type": "frame", "name": "Top Container", "x": 0, "y": 0, "width": 402, "widthMode": "FIXED", "heightMode": "HUG",
      "layout": "VERTICAL", "children": [
      { "type": "instance", "component": "Safe-Area", "variant": { "Position": "Top", "Device": "iPhone" }, "widthMode": "FILL" },
      { "type": "frame", "name": "Toolbar_Top", "widthMode": "FILL", "height": 76, "heightMode": "FIXED", "fill": "#FF00001A" } ] }
  ] } }
```

Numeric check: Top = 62 + 76 = 138 · Bottom = 12 + 56 + 22 + 34 = 124, so `y` = 874 − 124 = 750 · Content 138 → 750 (padding at the bottom edges of the safe-area instances is the component's height, never typed). Bottom padding values here are illustrative; take the real ones from the template or §8. When the screen has a `Background/*` instance, insert it as the first child (lowest layer), stretched to 402×874.

When cloning an existing screen (`clone_node`): **check the root and set it back to `NONE` right after the clone** (`update_nodes{props: {layout: "NONE"}}`).

## 13. Acceptance check

```js
const bad = screens.filter(f => f.layoutMode !== "NONE");   // must be empty
```

`audit.js` runs this check (`rootAutoLayout`) over the locked screens; without the script, read `layout` from `get_node`. Draft screens and the template are excluded.

## 14. Screen build checklist

Used for wireframes and locked UI. Items marked **[UI]** only apply to locked UI — wireframes may use plain grey (`../design-system-audit/references/system-binding.md` §4).

**Before building the screen**
- [ ] The screen is in the flow list (`design/flows.md`) — correct semantic name (`references/naming.md`)
- [ ] It maps to a functional requirement and use case (the flow list's "serves / answers" fields)
- [ ] It is not on the PRD's *Forbidden* list
- [ ] Frame size matches the rest · safe area matches the project standard — project uses the component: instance of the right component, first child of the top block / last child of the bottom block (§5 · `audit.js` › `safeArea`)
- [ ] Root frame `layoutMode = NONE` — only the children inside use auto layout
- [ ] Free graphics are wrapped in a plain `visual_…` frame (`../design-system-audit/references/system-binding.md` §6)
- [ ] No cluster is split — the background and the content on it are in the same frame (§7) · no redundant nesting (a frame with one child and no padding / fill / stroke / auto layout of its own)
- [ ] The voice file (`design/voice.md`) has been read — tone, nuance, length, terminology
- [ ] Existing components looked up for every block

**After building the screen**
- [ ] **[UI]** Every fill is bound to a variable, except labelled image placeholders
- [ ] **[UI]** Every text has a text style, except icon glyphs
- [ ] **[UI]** Padding, gap, radius, stroke, fixed sizes, shadows — bound to the system if the file has them
- [ ] No frame has a default name (`Frame 123456`)
- [ ] **The frame holds only text meant for the app's user** — no descriptions, no specs, no placeholder text, no design jargon (`../ux-writing/references/principles.md`)
- [ ] No invented content · no claims about things that cannot be measured
- [ ] No chevron leading nowhere
- [ ] Nothing overflows the frame, or the overflow is deliberate
- [ ] No main component inside the screen
- [ ] **[UI]** New components have text / boolean / instance-swap properties and pass the load test (`lock-phase.md` §5)
- [ ] **[UI]** Contrast meets AA · no Groups in UI areas — touch-target size is the developer's job and is not checked here (designer's decision)
- [ ] **[UI]** Checked by eye — especially screens with visual areas (`lock-phase.md` §8)

**Before reporting**
- [ ] A second confirming query has been run (re-read the canvas, don't trust the write result alone)
- [ ] Concrete numbers given · what could not be handled, and why · deviations that need a recorded decision
