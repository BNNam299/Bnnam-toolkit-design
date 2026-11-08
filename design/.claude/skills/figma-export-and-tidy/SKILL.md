---
name: figma-export-and-tidy
description: Export images from a Figma link (frames, whole sections, or "the first N columns" of a banner grid) at a given scale into a local folder with readable file names, and tidy a messy section — even grid spacing plus Layers panel order that matches canvas reading order — through the figma-agent MCP. Use when the user pastes a figma.com/design URL with node-id and asks to export/xuất ảnh (1x/2x/3x), "xuất 2 cột đầu", "đưa vào 1 thư mục để xem", "sắp xếp lại theo đúng trật tự", "căn đều", "dọn layer", or to check the figma-agent connection ("kiểm tra kết nối figma-agent", "thử lại").
---

# figma-export-and-tidy

Mechanics of each tool live in **figma-agent-tools**; this skill is the proven recipe for three recurring jobs: check the connection, export images, tidy a section.

## 0. Link → node id, and the right file

- URL `...?node-id=17094-35760` → node id `17094:35760` (replace `-` with `:`).
- `figma_status` first. The URL's file must appear in `files[]` **by name** (`fileKey` is often `null`, so match on `fileName`). If it is missing, the plugin is open in another file: tell the user to open that file → Plugins → Development → figma-agent-UI → paste token → Connect, then wait for "thử lại".
- With several files connected, pass `file: "<fileName>"` to **every** call.
- `files: []` after a previously good connection = plugin window closed or file reloaded; same reconnect steps. `figma_doctor` gives a per-check diagnosis if anything else looks off.

## 1. Understand what the node is before exporting

`get_node {ids, depth: 1}` — check `type` and size:

- **SECTION / huge frame**: exporting it gives a giant image (a 5660×7559 section at 3x = 17220×22917 px) full of the section's grey background. Export it if asked, but report the size and offer to export the child frames instead.
- `depth ≥ 2` on a section with many children truncates; use `depth: 1`, or `execute_code` that returns one line per child: `index|id|name|type|x,y|w x h` (compact, never truncates).
- To identify a visual group ("nhóm ảnh banner", "2 cột đầu"): take one `screenshot` of the section (`maxSize: 1600`) and map it to the child list by x/y. Columns = distinct x values, rows = distinct y values, among same-size frames (e.g. 312×120 banners). Layer order is **not** visual order — always use coordinates.

## 2. Export

`export_assets {ids, outDir, scales: [3], format: "PNG", file}`

- `outDir` must be absolute. For "put them in one folder to look at" use a new subfolder of the project, e.g. `<project>/banner-export/`, then `open <dir>` so Finder shows it.
- Files are named from the layer name (`banner@3x.png`, `banner-2@3x.png`, …). Duplicate layer names give meaningless numbers → rename afterwards by column/row meaning, e.g. `back-to-school-1@3x.png` … `everyday-life-5@3x.png` (column = theme, number = row top→bottom). Keep the ids list ordered column by column, row by row, so the rename is a simple mapping.
- Verify: `sips -g pixelWidth -g pixelHeight` (expect node size × scale) and `Read` one or two PNGs to make sure they are not blank. Mention anything odd you see (e.g. a stray line at an edge from an unclipped frame).

## 3. Tidy a section ("sắp xếp lại theo đúng trật tự")

The phrase is ambiguous — ask once (AskUserQuestion) between: **both (recommended)** / layer order only / grid spacing only. Then:

1. **Grid spacing** — only for same-size repeated frames; keep each item's current row/column, just make the steps even:
   - cluster items into rows (y within 40 px), rows into groups (consecutive rows < 200 px apart);
   - per group, cluster column slots by x (within 60 px), sorted;
   - set `x = X0 + col * COL_STEP`, `y = groupTop + row * ROW_STEP` (used: X0 = 100, COL_STEP = 312 + 40 = 352, ROW_STEP = 120 + 30 = 150; derive from the existing smallest/average gaps of the file).
   - Leave screens, components and component sets where they are.
2. **Layer order** — sort all section children in reading order (same row if |Δy| < 40 → by x, else by y), then `insertChild(0, node)` for each in that order, so the first item ends up at the top of the Layers panel. Safe when nothing overlaps; check that first, because z-order changes what is visible on overlaps.
3. Return the new order (`name@x,y`) from the same `execute_code` call, then `screenshot` the section once to confirm alignment.

Ready-to-run code: `references/tidy-section.js` (pass the section id).

## 4. Report

Short table: file paths / sizes for exports; groups with rows×cols and start y for tidy. Say what was not touched, and that **Cmd+Z** in Figma undoes the tidy.
