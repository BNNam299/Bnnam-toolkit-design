# render_tree / update_nodes DSL

## Contents
1. Arguments
2. Node vocabulary
3. Paints and effects people get wrong
4. Sizing rules (the source of most failures)
5. Building in passes
6. update_nodes
7. FigJam and Slides

---

## 1. Arguments

`tree` (required) · `parentId` + `index` to build **inside** an existing frame · `defaultFont` when the product does not use Inter · `select: false` to keep the user's view still.

Result: `rootId`, `created`, `bounds`, `ids` keyed by name path (`"Login/Form/Email"`; repeats get `#2`, `#3`). Keys are strict — an unknown key is rejected and named in the error, and the partial tree is removed.

## 2. Node vocabulary

Types: `frame`, `text`, `rect`, `ellipse`, `svg`, `image`, `instance`, `section`.

```jsonc
{
  "type": "frame", "name": "Login", "width": 390, "height": 844,
  "layout": "VERTICAL",            // HORIZONTAL | VERTICAL | NONE (auto layout)
  "padding": [48, 24],             // n | [v, h] | [t, r, b, l]; also paddingTop… singly
  "gap": 16,                       // or "AUTO" = space-between
  "justify": "START",              // primary axis: START | CENTER | END | SPACE_BETWEEN
  "align": "CENTER",               // counter axis: START | CENTER | END | BASELINE
  "fill": "#FFFFFF",               // hex | {var} | {style} | gradient | {image} | array (top first)
  "radius": 16,                    // n or [tl, tr, br, bl] — the plugin adds corner smoothing 60% (team rule)
  "stroke": { "color": "#E2E8F0", "width": 1, "align": "INSIDE" },   // width n or [t,r,b,l]; dash [4,4]
  "effects": "md",                 // none|sm|md|lg|xl | [{x,y,blur,spread,color,type}] | [{layerBlur}] | [{backgroundBlur}] | {style}
  "layoutGrids": { "preset": "mobile" },   // or [{pattern, count, gutter, margin}] | {style}
  "variableModes": { "Semantic": "Dark" },
  "children": [
    { "type": "text", "text": "Welcome back", "fontSize": 28, "fontWeight": 700,
      "color": "#0F172A", "lineHeight": "120%", "letterSpacing": "-2%",
      "widthMode": "FILL", "maxLines": 1 },
    { "type": "svg", "svg": "<svg …lucide icon…>", "width": 20, "height": 20, "color": "#64748B" },
    { "type": "image", "src": "/abs/path/or/https/url.png", "width": 342, "height": 200, "radius": 12, "scaleMode": "FILL" },
    { "type": "instance", "component": "Button", "variant": { "Variant": "Primary" },
      "texts": { "Label": "Sign in" }, "properties": { "Show icon": true }, "widthMode": "FILL" }
  ]
}
```

Other keys: `widthMode`/`heightMode` (`FIXED|HUG|FILL`), `min/maxWidth`, `min/maxHeight`, `absolute` + `x`/`y`, `opacity`, `visible`, `locked`, `rotation`, `clip` (both `true` and `false` round-trip), `wrap` + `counterGap`, `component: true` (+ `description`); on text `fontFamily`, `fontStyle`, `textAlign`, `verticalAlign`, `textCase`, `decoration`, `maxLines`, `textStyle`. Grids accept `count: "auto"` (= Figma Infinity). `get_node` returns every key above, so its output replays into `update_nodes`. **Any number may be `{ "var": "space/4" }`** and any colour `{ "var": "color/text/primary" }` — use them whenever the file has tokens.

`section`: `{type: "section", name, children: [frames], gap 200, padding 80, fill}` — screens of one flow, auto-placed left to right.

### Icon slot (icon button, list leading icon, tab icon)

```jsonc
{ "type": "frame", "name": "icon-button/back", "width": 44, "height": 44, "widthMode": "FIXED", "heightMode": "FIXED",
  "layout": "HORIZONTAL", "justify": "CENTER", "align": "CENTER",      // both CENTER, always
  "radius": 999, "fill": { "var": "surface/raised" },
  "children": [ { "type": "svg", "svg": "<svg …24×24 viewBox…>", "width": 24, "height": 24, "color": "#…" } ] }
```

Off-centre icons come from: no `layout` (icon stuck at 0,0), `justify`/`align` left at START or swapped (`justify: "END", align: "START"` = top-right), uneven `padding` (`[0,0,8,8]` pushes it up-right), a slot resized later without auto layout, or a glyph that is itself off-centre (a text arrow `→`, an SVG whose path is not centred in its viewBox). `justify` is the slot's own primary axis: horizontal in a HORIZONTAL slot, vertical in a VERTICAL one — set both to CENTER and the axis does not matter. Use SVG, not text characters, for icons. `render_tree`, `update_nodes` and `create_component_set` measure every icon slot (≤ 64×64 frame with one icon) they touch and return `warnings: ["icon-offcenter …"]` with the cause; fix that slot before moving on.

## 3. Paints and effects people get wrong

```jsonc
"fill": { "gradient": "LINEAR", "angle": 135, "stops": [ { "color": "#F59E0B", "position": 0 }, { "color": "#EF4444", "position": 1 } ] }
"fill": [ { "image": "/abs/bg.png", "scaleMode": "FILL" }, { "gradient": "LINEAR", "angle": 180, "stops": [ { "color": "#0B061800", "position": 0.3 }, { "color": "#0B0618E6", "position": 0.66 } ] } ]
"effects": [ { "type": "DROP", "x": 0, "y": 4, "blur": 12, "spread": 0, "color": "#00000026" } ]   // DROP | INNER (not DROP_SHADOW)
```

## 4. Sizing rules (the source of most failures)

- Auto-layout frames without `width`/`height` **hug** their content.
- A frame **without `layout`** keeps a given `width` + `height`. With neither it shrinks to its children (a 44×44 icon button becomes 22×22). With only one it gets **100** on the other axis (`height: 44` alone → 100×44: a pill instead of a circle). Its children sit at (0,0) and are never centred. For an icon slot or round button use `layout: "HORIZONTAL"`, `justify: "CENTER"`, `align: "CENTER"`, plus both sizes.
- A frame dropped into a **Section** (no auto layout) lands at (0,0) on top of its siblings: wrap the set in an auto-layout frame, or give `x`/`y`.
- `{var: "space/9"}` resolves by name. When Primitives and Semantic share a name the bare name binds the non-primitive one; write `"Primitives/space/9"` only for foundations charts that show the primitive tier.
- `widthMode: "FILL"` only inside an auto-layout parent, never on the root (explicit error, safe retry).
- Text wraps only with a width — `widthMode: "FILL"` or fixed `width`. A long label in a row needs `FILL` on the text, otherwise it overflows.
- Compose with `gap`, `padding`, `justify`, `align`; `x`/`y` only on `absolute: true` children, `layout: "NONE"` parents or the root.
- Push a footer down with `justify: "SPACE_BETWEEN"` on the parent, or give the middle region `heightMode: "FILL"`.
- Canvases: 390×844 (iPhone 15), 393×852, 360×800 (Android), 1440 desktop. Mobile side padding 16–24.

## 5. Building in passes

The build loop in figma-ui-flow locks the layout first, then fills it:

```jsonc
// Pass 1 — frame + regions + sized placeholder blocks (1 call)
// Designer standard: root layout NONE, regions layered bottom → top (Content → Bottom Container → Top Container)
{ "tree": { "type": "frame", "name": "Paywall / Timeline", "width": 402, "height": 874, "radius": 44,
  "layout": "NONE", "fill": { "var": "color/bg/default" }, "layoutGrids": { "preset": "mobile" },
  "children": [
    { "type": "frame", "name": "Content", "x": 0, "y": 106, "width": 402, "height": 560, "layout": "VERTICAL", "padding": [24, 24], "gap": 24, "children": [
      { "type": "frame", "name": "Hero",     "widthMode": "FILL", "height": 208, "fill": "#FF00001A" },
      { "type": "frame", "name": "Timeline", "widthMode": "FILL", "height": 216, "layout": "VERTICAL", "gap": 16, "fill": "#FF00001A" } ] },
    { "type": "frame", "name": "Bottom Container", "x": 0, "y": 764, "width": 402, "layout": "VERTICAL", "heightMode": "HUG", "padding": [12, 24, 0, 24], "gap": 8, "children": [
      { "type": "frame", "name": "CTA", "widthMode": "FILL", "height": 56, "fill": "#FF00001A" },
      { "type": "frame", "name": "Safe Area", "widthMode": "FILL", "height": 34, "fill": "#FF00001A" } ] },
    { "type": "frame", "name": "Top Container", "x": 0, "y": 0, "width": 402, "layout": "VERTICAL", "heightMode": "HUG", "children": [
      { "type": "frame", "name": "Safe Area", "widthMode": "FILL", "height": 62, "fill": "#FF00001A" },
      { "type": "frame", "name": "Toolbar", "layout": "HORIZONTAL", "widthMode": "FILL", "height": 44, "padding": [0, 16], "justify": "SPACE_BETWEEN", "align": "CENTER" } ] }
  ] } }

// Pass 2 — fill a placeholder in place (it already has its layout) …
{ "parentId": "<Timeline id>", "tree": { "type": "instance", "component": "Timeline step", "widthMode": "FILL" } }
// … or replace one: delete_nodes the placeholder, then insert at its index
{ "parentId": "<Bottom Container id>", "index": 0, "tree": { "type": "instance", "component": "Button", "variant": { "Variant": "Primary" }, "widthMode": "FILL" } }
```

- Placeholder tints show the layout in the Pass 1 screenshot; clear them (`update_nodes` fill → token, or `[]`) when filling.
- Read the frame back with `get_node{ids:[rootId], depth: 2}` to confirm sizing modes and that everything fits before filling.
- A frame with a `width` inside auto layout also needs `widthMode: "FIXED"`, or it hugs its content.

## 6. update_nodes

```jsonc
{ "updates": [ { "id": "12:34", "props": { "text": "New", "fill": { "var": "color/primary" } } } ] }
```

`props` accepts every render_tree key that makes sense on an existing node, plus on instances `variant`, `properties` (by name; `#id` suffix optional), `texts` (by text layer name) and `component` (swap). Text inside an instance: id `I1006:42;1006:41`. Failures come back per item in `failed`; the rest landed.

## 7. FigJam and Slides

The plugin runs in FigJam boards and Slides decks too (manifest `editorType`: figma, figjam, slides). On a board or deck the
Design-only tools refuse with *"… is Design-only"* and change nothing: `set_interactions`, `annotate`, `set_dev_status`,
`bind_variables`, `create_variables`, `create_styles`, `import_tokens`, `export_tokens`, `render_foundations`,
`create_component_set`, `stress_test`, `get_design_system`, `search_design_system`. With a Design file and a board open at once,
pass `file`.

FigJam node types in `render_tree` (plus `section`, `frame`, `text` as usual):

```jsonc
{ "type": "section", "name": "Onboarding", "children": [
  { "type": "shape", "name": "step-1", "shape": "ROUNDED_RECTANGLE", "text": "Splash", "x": 0, "y": 0 },
  { "type": "shape", "name": "step-2", "shape": "DIAMOND", "text": "Signed in?", "x": 320, "y": 0 },
  { "type": "connector", "from": "Onboarding/step-1", "to": "Onboarding/step-2",
    "lineType": "ELBOWED", "caps": { "end": "ARROW_EQUILATERAL" }, "text": "auto" },
  { "type": "sticky", "text": "Ask: skip allowed?", "color": "#FFE066", "isWide": false },
  { "type": "table", "rows": 2, "columns": 3, "cells": [["Screen","FR","State"],["Splash","FR-01","default"]] },
  { "type": "code", "code": "{ \"plan\": \"annual\" }", "language": "JSON" }
] }
```

- `connector.from` / `to`: a node id, or an ids-map key (`"Root/Child"`) from the **same** call — connectors are wired after
  everything else exists. A missing end fails the whole call and leaves the board clean.
- Caps: `NONE | ARROW_EQUILATERAL | ARROW_LINES | TRIANGLE_FILLED | DIAMOND_FILLED | CIRCLE_FILLED` — there is no `ARROW`.
- `shape` outlines: SQUARE, ELLIPSE, ROUNDED_RECTANGLE, DIAMOND (decision), PARALLELOGRAM_*, DOCUMENT_*, CHEVRON, HEXAGON… (full
  list in `src/shared/schemas.ts` › `FigjamShape`). Never pass `radius` to a shape — its corner radius is read-only.
- FigJam text lives on a sublayer: change it with `text` (or `cells` for a table) in `update_nodes`; `{var}` / `{style}` are
  rejected; sticky colours snap to FigJam's palette.
- `table.cells` is row-major and must be exactly rows × columns. `get_node` on a big table (> 400 cells) returns `cellsTruncated`.

Slides: `{ "type": "slide", "name": "Problem", "row": 0, "col": 1, "transition": { "style": "DISSOLVE", "duration": 0.3 },
"skipped": false }` adds a slide to the deck grid (default: appended); put frames / text inside as children.

Manual check list for both: `TESTING.md` §J at the toolkit root.
