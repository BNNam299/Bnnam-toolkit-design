# figma-agent tool reference

Source of truth: tool descriptions in `src/server/index.ts` and input schemas in `src/shared/schemas.ts`. If the live tool list in the session disagrees with this file, trust the session. Every tool also accepts `file` (several files connected) and `page` (run on that page, then restore).

## Contents
1. Orient and read
2. Build and edit
3. Pages, tokens and styles
4. Components
5. Verify and fix
6. Prototype and handoff
7. Escape hatch
8. gemini-image-mcp (images)

---

## 1. Orient and read

| Tool | Key params | Returns / notes |
|---|---|---|
| `figma_status` | `includeToken` (default false) | `files[]` (fileName, currentPage, pluginVersion), `server.version/build`, `versionCheck`, `port`/`portRange`/`ports`, `preferredFile`, `missingCommands`, `protocol`, and the **masked** `token` (last 4 chars). Pass `includeToken: true` only when you really need the full token. Call first. |
| `figma_doctor` | — | One-shot diagnosis of the server↔plugin link: 7 checks (server, port, token, plugin, version, capability, manifest), each with `ok` + `fix`, plus `nextSteps`. Never fails. Call it when a tool reports no connection, an unknown command, or a timeout. |
| `get_document_info` | — | File name, pages, current page, selection, top-level layers (id, name, type, x, y, w, h). |
| `get_design_system` | `include` (`variables`,`styles`,`components`,`library`), `componentLimit` 200, `usedIn: nodeId` | Variables with modes/values, paint/text/effect/grid styles, local components with properties. `usedIn` = only what is bound inside that node (the remote MCP's `get_variable_defs`). |
| `search_design_system` | `query`, `kinds` (`component`,`variable`,`style`), `includeLibraries`, `limit` 20 | Ranked matches; variables show collection, resolved value, primitive or not, alias target. **Call before creating any component, token or style.** |
| `get_selection` | `depth` 1, `maxNodes` 300 | Serialized selected layers. |
| `get_node` | `ids: string[]` (**array**), `depth` 2, `maxNodes` 300 | Same vocabulary as `render_tree` (layout, sizing, fills as hex or variable names). Raise `maxNodes` when the result says `truncated`. |
| `find_nodes` | `rootId`, `types` (`["TEXT"]`), `name`, `text` (case-insensitive substrings), `limit` 50 | Locate layers the user mentions but you cannot see. |
| `list_fonts` | `family` substring, `limit` | Exact style names — `"Semi Bold"` not `"SemiBold"`. Call whenever the brief uses a family other than Inter. |
| `set_current_page` | `page` | Prefer the `page` param of each tool instead. |

## 2. Build and edit

| Tool | Key params | Returns / notes |
|---|---|---|
| `render_tree` | `tree`, `parentId`, `index`, `defaultFont`, `select` true | `rootId`, `created`, `bounds`, `ids` (name path → id, `#2` for repeats). Failure rolls back the partial tree (`safeToRetry… true`). `warnings` (only when present): `icon-offcenter` slots whose glyph is off the slot centre, with the cause. Full DSL: `render-tree-dsl.md`. Node types: `frame` `text` `rect` `ellipse` `svg` `image` `instance` `section`. Images work everywhere: `render_tree`, `update_nodes`, and `create_component_set` variant trees (server inlines local paths/URLs to base64). |
| `update_nodes` | `updates: [{id, props}]` | `{updated, failed, warnings?}` — per item; `warnings` lists icon slots (the updated nodes and their parents) left off-centre. `props` = render_tree keys + instance `variant`, `properties`, `texts`, `component` (swap). Instance sublayer ids look like `I1006:42;1006:41`. |
| `move_nodes` | `ids`, `parentId`, `index`, `x`, `y` | Reparent/reorder; `x`/`y` only outside auto layout. |
| `clone_node` | `id`, `parentId`, `index`, `x`, `y` | The copy (id). |
| `delete_nodes` | `ids` | `{deleted, missing}`. Never delete what the user made without asking. |
| `select_nodes` | `ids`, `zoom` true | Last step: show the result. |

## 3. Pages, tokens and styles

| Tool | Key params | Returns / notes |
|---|---|---|
| `manage_pages` | `template` (9-page skeleton), `create`, `rename[{page,to}]`, `delete`, `order`, `dryRun` false | Run `dryRun: true` first to show the plan. |
| `import_tokens` | `tokens` (JSON) **or** `path` (absolute, read by the server), `dryRun`, `onExisting` `skip`, `allowLintErrors` | Lints exactly like `figma-ui-flow/scripts/check_tokens.py` before touching Figma; errors stop the import. Top-level group → collection (`primitives` → `Primitives`), `$extensions.modes` → modes, `{primitives.color.white}` → alias, scopes inferred (primitives `[]`). |
| `create_variables` | `collection`, `modes` (first = default), `variables[{name, type COLOR|FLOAT|STRING|BOOLEAN, scopes, values{mode: value | {alias}}}]`, `onExisting` `error` | Alias as `"color/gray/900"` or `"Primitives/color/gray/900"`. Free plan: one mode per collection → extra modes come back as warnings. |
| `create_styles` | `styles[{kind: text|paint|effect|grid, name, …}]`, `onExisting` | Text styles may bind `fontSize: {var}`. Effect needs `effects: […]` (not flat x/y/blur keys). New styles are removed if any spec fails. |
| `render_foundations` | `collections`, `page` (e.g. `"🎨 Foundations"`) | Swatches, type specimen, spacing ruler, radius, elevation — all bound to the real variables/styles. Compact result (rootId + counts). |
| `export_tokens` | `format` `json|css|swift|kotlin`, `collections`, `path` | Code text; written to `path` by the server when given. Motion durations stay in ms. |

## 4. Components

`create_component_set{name, description, variants:[{props:{Size:"md",State:"Default"}, tree:<frame>}], properties:[{name, type TEXT|BOOLEAN|INSTANCE_SWAP, default, targets:[layer names], preferred}], parentId}`

- Variant names become `Size=md, State=Default`. Validation (duplicates, `=`/`,` in values, missing combos, > 50 variants, mixed size vocabularies) fails **before** anything is written.
- `targets` are layer names that must exist in **every** variant's tree.
- A failing call removes everything it drew (verified). Duplicates come from an earlier call that **succeeded**: `get_node` the section before retrying a set under a new name.
- Each variant root is a component: give it `widthMode: "FIXED"` + `width` (or HUG). `FILL` fails unless `parentId` is an auto-layout frame.
- The set gets a purple dashed stroke and radius 5, like sets made in the Figma UI; `audit_design` ignores that chrome.
- Use instances afterwards: `{type: "instance", component: "Button", variant: {State: "Default"}, texts: {Label: "…"}, properties: {"Has icon": true}}`.

## 5. Verify and fix

| Tool | Key params | Returns / notes |
|---|---|---|
| `screenshot` | `id` (**string**), `scale` 0.5, `maxSize` 1024 | PNG. Screenshot the node you just wrote. Raise `scale` to 1 for detail checks. |
| `audit_design` | `rootId` (audited itself, then its subtree), `checks` (`names`,`tokens`,`layout`,`a11y`,`hygiene`,`content`), `limit` 50, `format` `json|markdown` | `counts`, `severity` (Blocker / Should fix / Nice to have; JSON keys `block` / `should` / `nice`), `samples` with ids. Kinds: default/blacklisted names, raw fill/stroke/radius, primitive bound directly (a Primitives variable, or any variable with `scopes []` — the detail says which), `icon-offcenter` (an icon slot whose glyph ink is off its centre, with the cause), `stale-paint` (blocker: a bound paint whose colour is not the variable's value, so the layer renders the old colour), text without style, no auto layout, redundant wrapper, off-scale spacing, contrast (gradient/image backdrop = `needs-check`), small target < 44pt, hidden layers, lorem, outside section, variant explosion, orphan styles/tokens. Heuristic: `small-target` on non-interactive rows and SVG icons reported as `no-autolayout` are false positives — judge and say so. |
| `stress_test` | `id`, `cases` (`long-text`,`large-text`,`narrow`,`wide`,`empty-text`), `modes`, `page` | Section `Stress / <name>` with copies + `overflow[]` per case. Screenshot `sectionId`, then **delete the section**. |
| `bind_variables` | `rootId`, `fields`, `map {"#2563EB": "color/action/primary", "16": "space/4"}`, `auto`, `tolerance` ΔE 2, **`dryRun` true** | Changes, `ambiguous` (add them to `map`), `unmatched`. Never binds primitives; skips instances and sections. Second call with `dryRun: false` writes. |
| `rename_by_rule` | `rootId`, `rules[{match RegExp, to, types}]`, `auto`, **`dryRun` true** | Only default/blacklisted names are auto-renamed (`label/…`, `icon/glyph`, `image/placeholder`, `row`/`stack`). |

## 6. Prototype and handoff

| Tool | Key params | Notes |
|---|---|---|
| `set_interactions` | `items[{id, reactions[{trigger, action, destination, transition{type, duration ms or {var}, easing}}], replace}]`, `flowStart{id, name}` | Actions NAVIGATE / OVERLAY / SWAP / SCROLL_TO / CHANGE_TO (variant → interactive component) / BACK / CLOSE / URL / SET_VARIABLE / SET_VARIABLE_MODE. Easing names: `standard`, `decelerate`, `accelerate`, `spring`, `linear`, `cubic-bezier()`. Durations in ms (converted to seconds). |
| `annotate` | `items[{id, label (markdown), properties[], category}]`, `replace` | Behaviour, edge cases, motion specs, a11y labels. `category` must match a file category (Development/Interaction/Accessibility/Content); invalid names list the valid ones. `properties` uses plural API names (`fills`, not `fill`); invalid names list all 33 valid ones. |
| `set_dev_status` | `ids` (sections or top-level frames), `status` `READY_FOR_DEV|COMPLETED|NONE` | Nested frames are rejected. |
| `export_assets` | `ids`, `format` PNG/JPG/SVG/PDF, `scales` [1,2,3], `outDir` (absolute) | Server writes `name@2x.png`…; returns paths. |

## 7. Escape hatch

`execute_code{code, timeoutMs 30000}` — see SKILL.md §6 and `plugin-api-recipes.md`. Use it only when no tool above fits (constraints, boolean ops, vector edits, unusual bulk edits).

## 8. gemini-image-mcp (images for heroes, illustrations, backgrounds)

1. `bridge_status` → `workerCount ≥ 1`. Zero workers: ask the user to open/reload the studio tab (`pageUrl`); `image_generate` can also auto-open it.
2. `image_generate{prompt, aspectRatio "1:1"|"4:3"|"3:4"|"16:9"|"9:16", savePath: "<project>/generated-images/<screen>-<role>.png"}`. Put **"no text, no letters, no UI"** in the prompt and name the palette with hex values from the design. Two workers → two images run in parallel; send independent prompts in one turn.
3. `Read` the file to look at it before using it.
4. Use the absolute path: `{type: "image", src: "/abs/path.png", scaleMode: "FILL"}` or `fill: {image: "/abs/path.png"}` / an array `[{image}, {gradient…}]` for a readability overlay. The file may be JPEG despite the `.png` name — Figma accepts it.
