# Troubleshooting figma-agent

## Connection and versions

| Symptom | Cause / fix |
|---|---|
| Every tool fails with "Port 3055-3075 … lsof" | No free port in the range. Another MCP client holds them. Close it (`lsof -i :3055-3075`) or set `FIGMA_AGENT_PORT`. The server stays up and reports the reason — it does not die. |
| `figma_status` → `files: []` | Plugin not open or not connected. User: Figma → Plugins → Development → figma-agent-UI, paste `token`, Connect. Run `figma_doctor` for a full check. |
| `figma_doctor` → check `manifest` fails | `devAllowedDomains` does not cover the port the server is on. Edit `manifest.json`, then **re-import the plugin in Figma** (Figma caches the manifest). |
| `figma_doctor` → check `capability` fails | The plugin build in Figma is older than the server. `npm run build`, then close and reopen the plugin. |
| `Unknown command "<tool>"` | Plugin build ≠ server build. User closes and reopens the plugin; after a plugin upgrade the version in `package.json` is bumped so the panel shows it. |
| `figma_status` → `missingCommands: [...]` | Same as above, listed explicitly: the plugin does not implement those commands yet. Rebuild + reopen the plugin. |
| Several Figma files open, no file chosen | The server refuses to guess. Pass the `file` param, or pin the target file in the plugin panel (menu → "File đích"). |
| Every call times out after an `execute_code` | The sandbox is stuck in a loop: Figma will close the plugin. User reopens it; rewrite the code with bounded loops. |
| gemini `workerCount: 0` | Studio tab closed or bridge restarted. User opens/reloads `pageUrl` (or the Gemini Canvas tab); `image_generate` can auto-open it. |

## Writes

| Symptom | Cause / fix |
|---|---|
| `render_tree` "unknown key …" | Strict schema; rename the key (see `render-tree-dsl.md`). Rolled back — retry is safe. |
| "FILL needs an auto-layout parent" | `widthMode/heightMode: "FILL"` on the root or under a `layout: "NONE"` parent. |
| Text overflows its row | Text has no width: add `widthMode: "FILL"` (or a fixed width) so it wraps. |
| Icon stuck in a corner of its slot / `warnings: icon-offcenter` | Read the cause in the warning: slot without `layout`, `justify`/`align` not both `CENTER` (`END` + `START` = top-right), uneven `padding`, or a glyph off-centre in its own box (text arrow, unbalanced viewBox). Fix that slot with `update_nodes{layout:"HORIZONTAL", justify:"CENTER", align:"CENTER", padding:0}`; recipe in `render-tree-dsl.md` § Icon slot. |
| Footer not at the bottom | Parent needs `justify: "SPACE_BETWEEN"`, or the middle region `heightMode: "FILL"`. |
| Failure with `safeToRetryWithoutCanvasRead: false` | Canvas may be half-changed: `get_node` the target, then decide. |
| `RolledBackError` from tokens/styles/components | Input validated before writing; nothing changed. Fix and retry. |
| `Limited to 1 modes only` | Figma plan without variable modes. The first mode is written and the rest is a warning; dark mode needs a paid plan. |
| `bind_variables` changed nothing | It defaults to `dryRun: true`. Same for `rename_by_rule`. |
| `bind_variables` never picks a token | Candidates are Semantic variables with matching scopes; primitives (scopes `[]`) are never used. Add `map`. |
| `stress_test` left a section | By design — screenshot `sectionId`, then `delete_nodes` it. |

## Plugin API (`execute_code`)

| Symptom | Cause / fix |
|---|---|
| `Cannot write to node with unloaded font` | `await h.loadNodeFonts(node)` / `h.loadFont({family, style})` first. |
| Font "SemiBold" not found | Style names have spaces: `Semi Bold`, `Extra Bold`; check `list_fonts`. |
| `layoutSizingHorizontal` throws | Node not yet inside an auto-layout parent — append first. |
| Setting `figma.currentPage` throws / sync getter throws | Use `await figma.setCurrentPageAsync(page)`, `getNodeByIdAsync`. |
| Colours completely wrong | 0–255 used instead of 0–1; use `h.solid('#hex')`. |
| Bound fill does not stick | Assign the new paint array returned by `setBoundVariableForPaint`. |
| Layer shows the wrong colour although `boundVariables` is right (e.g. white background on a dark token) | The paint kept a stale colour: Figma re-resolves the colour only when the **binding changes**, so a paint written with the binding it already had (clone paint → edit `color` → reassign, or `{…paint, boundVariables}` by hand) keeps its own colour. `audit_design` reports it as `stale-paint` (blocker). Fix: `update_nodes{fill/stroke: {var}}`, or `setBoundVariableForPaint(h.solid(<resolved hex>), 'color', v)`. Never write `boundVariables` by hand. |
| `v.name = '…'` does nothing, no error | Renaming a variable is not supported from the plugin here; rename in the Figma UI or create a new variable. |
| `setValueByMode is not a function` | It is `setValueForMode(modeId, value)`. |

## Audit false positives (judge, then say so)

- `small-target` on a non-interactive row (table rows, labels): the real target is the card/button around it.
- `no-autolayout` on an SVG icon frame: no longer reported (frames of vectors only are skipped).
- `contrast: needs-check` over an image/gradient: check the screenshot; add an overlay gradient or a solid backing if in doubt.

Not false positives, though they look like it:

- `primitive-bound` on a **Semantic** token: the detail says `scopes []`. A variable with no scopes is hidden from Figma's pickers and counts as a primitive, whatever its collection. Fix the data: give it its role scope (`GAP`, `CORNER_RADIUS`, `FONT_SIZE`, `STROKE_FLOAT`, `WIDTH_HEIGHT`). Only prototype-only tokens (`duration/*`, `easing/*`) keep `[]`.
- `contrast` with a ratio you can't explain: compute it against the colour the screenshot shows, not the token. A `stale-paint` backdrop makes the audit right and the token wrong.
- Verify a suspected false positive with a probe (the same binding on a test frame, audited before and after) before dismissing it, and screenshot it. Delete the probe afterwards.

The purple dashed frame and radius 5 of a component set are chrome; the audit skips them.
