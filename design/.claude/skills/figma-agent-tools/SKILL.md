---
name: figma-agent-tools
description: Operator's manual for every figma-agent MCP tool (figma_status, get_document_info, get_design_system, search_design_system, render_tree, update_nodes, screenshot, audit_design, create_variables, import_tokens, create_styles, create_component_set, stress_test, set_interactions, bind_variables, rename_by_rule, annotate, set_dev_status, export_tokens, export_assets, execute_code…) that drive the figma-agent-UI plugin in the user's open Figma file, plus gemini-image-mcp for generated images. Use whenever a figma-agent tool is about to be called — reading, creating, editing, moving, deleting, screenshotting, auditing, tokens, prototype, handoff — including Vietnamese phrasings such as "sửa màu layer", "chỉnh spacing", "chụp lại frame", "kiểm tra file Figma", "xoá layer". For how to design a screen (flow, outside-in build loop, quality bar) also load figma-ui-flow.
---

# figma-agent-tools — how to drive the figma-agent MCP

This skill is about **mechanics**: which tool, which parameters, what comes back, what breaks. *What* to build and *in which order* lives in **figma-ui-flow** (`../figma-ui-flow/references/build-loop.md` is the mandatory three-pass outside-in loop for screens).

| Need | Read |
|---|---|
| Every tool: purpose, key params, return value, pitfalls | `references/tool-reference.md` |
| Full `render_tree` / `update_nodes` vocabulary, building in passes | `references/render-tree-dsl.md` |
| `execute_code` recipes (variables, binding, auto layout, text, components) | `references/plugin-api-recipes.md` |
| An error message, a stuck plugin, version mismatch, plan limits | `references/troubleshooting.md` |
| Ready-made `execute_code` scripts (audit, detect, bind, clone, flow map, background, prototype…) and the skill that owns each | `../bnnam-standards/SKILL.md` › Team scripts |

## 1. Connect and check the version

1. `figma_status` first. `files: []` → ask the user to open Figma → Plugins → Development → **figma-agent-UI**, paste the `token`, press Connect. Several files → pass `file` to every tool.
2. `versionCheck` starting with ⚠️ → the plugin build differs from the server: new tools answer `Unknown command`. Ask the user to close and reopen the plugin (its panel shows `Plugin <version> (<commit>)`).
3. Two situations need a human restart; say so instead of retrying: the plugin was closed, or an `execute_code` call never returned.

## 2. State model

- **The canvas is the only state.** Nothing survives between calls except node ids: keep every id a write returns, and the `ids` name-path map from `render_tree` (`"Screen/Header/Title"` → `"12:34"`; repeats get `#2`, `#3`).
- Every tool takes `page` (id or exact name): it runs there and restores the previous page. Prefer it to `set_current_page`, always when agents run in parallel.
- Name layers meaningfully when you create them — the name paths are how you address them later.

## 3. Pick the tool

| Group | Tools |
|---|---|
| Orient | `figma_status`, `get_document_info`, `get_design_system` (`usedIn` = variables bound inside a node), `list_fonts` |
| Read | `get_selection`, `get_node{ids[], depth}`, `find_nodes{types,name,text}` |
| Find before create | `search_design_system{query}` |
| Build | `render_tree` (new tree; `parentId`+`index` to build inside an existing frame), `create_component_set` |
| Edit | `update_nodes` (batch), `move_nodes`, `clone_node`, `delete_nodes` |
| Pages | `manage_pages{template|create|rename|delete|order, dryRun}`, `set_current_page` |
| Tokens & styles | `import_tokens` (DTCG, linted), `create_variables`, `create_styles`, `render_foundations` |
| Prototype | `set_interactions` |
| Verify | `screenshot{id}`, `audit_design{rootId, checks}`, `stress_test{id, cases}` |
| Bulk fix | `bind_variables`, `rename_by_rule` — **both `dryRun: true` by default** |
| Handoff | `annotate`, `set_dev_status`, `export_tokens`, `export_assets` |
| Show the user | `select_nodes{ids, zoom}` |
| Anything else in the Plugin API | `execute_code` (last resort) |
| Generated images | `gemini-image-mcp`: `bridge_status` → `image_generate{prompt, savePath, aspectRatio}` → local path into `image.src` / `fill.image` |

Order of preference: dedicated tool → `render_tree`/`update_nodes` → `execute_code`. Dedicated tools validate input, return ids and clean up on failure; `execute_code` does none of that.

## 4. Building in passes (mechanics for figma-ui-flow's build loop)

```text
Pass 1  render_tree{tree: <frame + regions + sized placeholder blocks>}   → rootId, ids
        get_node{ids:[rootId], depth:2}  →  one screenshot{id: rootId}
Pass 2  create_component_set{…}  for blocks repeated ≥ 3×
        render_tree{parentId: ids["Screen/Content/Hero"], tree}          → fill a placeholder in place
        delete_nodes + render_tree{parentId: <region>, index, tree}      → or replace it (instance, image)
        update_nodes{updates:[…]}                                        → text, icons, colours in batches
        get_node / write bounds after each write → one screenshot{id: rootId} at the end
Pass 3  audit_design{rootId} → stress_test{id: rootId} → update_nodes fixes → screenshot{id, scale: 1}
```

- `render_tree` with `parentId` appends into that frame (`index` to insert at a position). The new subtree's `ids` keys start at the subtree root, not the screen.
- Give regions their final sizing in Pass 1: on the layered `NONE` root each region gets `x`/`y` and the screen width (`widthMode: "FIXED"`), a fixed height for the scrolling `Content`, `heightMode: "HUG"` for `Top Container`/`Bottom Container`. Placeholder blocks get a fixed size, a temporary tint (`#FF00001A`) and, if they will hold children, their final `layout`/`gap`/`padding`.
- A frame given a `width` inside auto layout must also get `widthMode: "FIXED"`, otherwise it hugs its content and clips absolute children (same for height).
- One write may fill several neighbouring placeholders: wrap them in the region's call, or send consecutive calls without screenshots in between.
- A placeholder's fixed height was an estimate: set `heightMode: "HUG"` once real content defines it.

## 5. Errors and retries

- Each failed write reports `safeToRetryWithoutCanvasRead`. `true` (e.g. every `render_tree` failure: the partial tree is removed) → fix the input and retry. `false` → the canvas may have changed: `get_node` before retrying.
- `update_nodes` fails per item: read `failed`; the other updates landed.
- Same error twice → change approach, don't retry a third time.

## 6. execute_code rules

The body of an async function with `figma` and `h` in scope; top-level `await`, **`return`** a JSON-friendly value (`console.log` is not returned).

- **No loop or wait that can fail to finish.** The sandbox is single-threaded and cannot be interrupted: the server times out, Figma closes the plugin, the user must reopen it. Bounded loops only, well under 30 s.
- Colors are 0–1 with opacity on the paint: `h.solid('#3B82F6')`. `fills`/`strokes`/`effects` are immutable: clone, edit, reassign.
- Load fonts first: `await h.loadNodeFonts(node)` / `await h.loadFont({family, style})`.
- Async APIs only (`documentAccess: dynamic-page`): `getNodeByIdAsync`, `setCurrentPageAsync`, `getMainComponentAsync`.
- `resize()` resets sizing to FIXED: resize first, then `layoutSizing*`; append to the auto-layout parent before `FILL`.
- New top-level nodes at `h.freeSpot()`. Never `figma.closePlugin()`. Return `{createdNodeIds, mutatedNodeIds}`.
- Recipes: `references/plugin-api-recipes.md`.

## 7. Verify: numbers every write, eyes per pass

- **After every write:** read sizes back — the write's `bounds`, or `get_node{ids, depth: 2}` on the written subtree. Check: fixed sizes kept (no unintended HUG), children fit their parent, heights + gaps + padding add up, long text has a width, FILL/HUG as planned. Fix the specific node with `update_nodes`; don't rebuild.
- **At the end of each pass:** `screenshot` the screen (`scale` 1–1.5) and read it for clipped/overflowing text, wrong wrapping, overlaps, misalignment, uneven spacing, weak contrast, leftover placeholders.
- **Extra screenshot only for unusual blocks:** rotation, absolute or overlapping layers, custom shapes, text over images, meaningful gradients/shadows — or a number you can't explain. Screenshot that block (`screenshot{id}`), not the page.
- `stress_test` lists text that overflows its own clip area only; a HUG text clipped by an ancestor is missed. Always screenshot the stress section.
- `audit_design` findings are heuristics: `small-target` on a non-interactive label and contrast sampled behind an opaque plate or over an image are judged by eye, and say so in the report.
