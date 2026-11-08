# Screen build loop: outside-in, three passes

Applies to **every** screen, in both Stage 4 (directions to compare) and Stage 5 (real screens). Tool names in parentheses are `figma-agent` tools. Detailed syntax: the `figma-agent-tools` skill; pass → tool table: `run-with-figma-agent.md`.

## Contents
1. Why outside-in, and why not a screenshot per block
2. Pick a mode
3. The check budget: numbers every write, eyes per pass
4. Pass 0 — Prepare
5. Pass 1 — Layout
6. Pass 2 — Fill
7. Pass 3 — Lock
8. Rules of the loop
9. Definition of Done for a screen
10. Moving to the next screen
11. Example: Paywall / Timeline
12. Anti-patterns

---

## 1. Why outside-in, and why not a screenshot per block

- **Structure before content.** If the frame is wrong (sizing, padding, region order), everything inside it is wrong too. Fixing it while it is empty costs one call; fixing it under 100 nodes costs a rebuild. Auto Layout also flows parent → child: a child can only `FILL` once its parent has Auto Layout.
- **But checking is not free.** A screenshot is the most expensive check (a round trip plus an image to read), and most block-level screenshots find nothing. Most build errors are *numeric* — a frame that hugged instead of staying fixed, a child wider than its parent, heights that don't add up — and `get_node` catches those for almost nothing.
- So the loop keeps the **outside-in order** and the **early checks**, but writes in bigger steps and saves the eyes for the end of each pass.

## 2. Pick a mode

Decide at the start of the screen and say which one in the first progress update.

| Mode | When | Passes | Eyes (screenshots) |
|---|---|---|---|
| **Sketch** | Stage 4 directions, quick ideas, "show me something" | 1 → 2 | 1 per pass |
| **From template** | A similar screen already exists (same set, same product) | Clone → edit what differs → 3 | Only the changed areas + 1 final |
| **New build** | Complex screen, no template, going to handoff | 0 → 1 → 2 → 3 | 1 per pass + unusual blocks |

When unsure, use **New build** for the first screen of a set and **From template** for the rest.

## 3. The check budget: numbers every write, eyes per pass

**After every write — numeric check** (`get_node{ids:[<written root>], depth: 2}`; the write result's `bounds` is often enough):

- [ ] every frame you gave a `width`/`height` still has it (an auto-layout frame without `widthMode: "FIXED"` hugs its content and can clip an absolute child);
- [ ] no child is wider than its parent's inner width; fixed heights + gaps + padding add up within the parent;
- [ ] `FILL`/`HUG` are where the region map says;
- [ ] long text has a width (`FILL` or fixed) so it wraps instead of overflowing;
- [ ] padding and gap on the 4/8 scale.

**At the end of each pass — visual check:** one `screenshot` of the whole screen (`scale` 1–1.5). Read it for overlaps, clipping, uneven rhythm, hierarchy, contrast and leftover placeholders.

**Escalate to an extra screenshot only when** the block is visually unusual — rotation, absolute/overlapping layers, custom shapes, text over an image, gradients or shadows that carry meaning — or the numeric check shows something you can't explain.

## 4. Pass 0 — Prepare (nothing written)

- One-sentence goal and **one primary action** (CTA).
- Real content in the user's language. No lorem.
- **Region map** with sizing, down to the blocks:
  ```
  Screen 402×874 NONE (layered, bottom → top)
  ├─ Content           FILL width · VERTICAL   Hero 208 · Title · Timeline (3 steps)
  ├─ Bottom Container  pinned bottom · HUG     Rating · CTA 56 · Caption · Link · safe area 34
  └─ Top Container     pinned top · HUG        safe area 62 · close · restore
  ```
- Inventory what to reuse (`search_design_system`, `get_design_system`). Mark standard elements and blocks identical to a screen already built — they become components in Pass 2.
- Generate images now (gemini) so Pass 2 only attaches them.
- In **Sketch** mode this pass is a few lines in your head; in **From template** it is "what differs from the template".

## 5. Pass 1 — Layout

- **Goal:** the whole screen's structure, locked while it is still empty.
- **Write (1 write; 2 for a long screen):** root frame at the platform size + named regions + **named placeholder blocks with their final sizes** (`Hero 342×208`, `CTA FILL×56`, `D-pad 216×212`). Placeholders are empty frames with a temporary tint (`#FF00001A`) so they show in the screenshot. Give a placeholder that will hold children its final `layout`/`gap`/`padding`/`align` now, so Pass 2 can fill it in place; a placeholder that becomes an image or an instance is simply replaced.
- **Check:** numeric check (§3) on the root with `depth: 2`; then **one screenshot** of the screen.
- **Pass when:** every block in the region map exists with the right size and sizing mode, everything fits the screen, and the screenshot reads as the final layout in grey boxes.

## 6. Pass 2 — Fill

- **Goal:** the screen looks real.
- **Components first.** A standard element (button, list row, key, chip), or a block whose structure is identical to one on a screen already built (componentize from the **second** screen: make the component from the first screen's block and swap both to instances), becomes a component *before* you fill it in (`search_design_system` → `create_component_set`). Fixing it later is then one edit, not N.
- **Fill by cluster, not by region.** One write may fill several neighbouring blocks: replace each placeholder (`delete_nodes` + `render_tree{parentId, index}`, or `render_tree{parentId: <placeholder>}` and clear its tint). Then real text, icons and images in batches with `update_nodes`. A placeholder's fixed height was only a layout estimate: switch it to `heightMode: "HUG"` once its content defines the height. Every icon sits in a slot with `layout` + `justify: "CENTER"` + `align: "CENTER"` and no uneven padding; a write that returns `warnings: icon-offcenter` is fixed before the next write.
- **Check:** numeric check (§3) after each write; an extra screenshot only for unusual blocks; **one screenshot of the screen** at the end of the pass.
- **Pass when:** no placeholder or tint is left, repeated blocks are instances, and the screenshot shows nothing temporary.

## 7. Pass 3 — Lock

- **Goal:** meet the Definition of Done. Run it in **New build** and **From template**, and in any mode before handoff; skip it in **Sketch**.
- **Do:**
  1. `audit_design{rootId: <screen>}` — all groups.
  2. `stress_test{id: <screen>, cases: [long-text, large-text]}` (+ `modes` if Dark exists) → one screenshot of the section → delete the section. **Read the screenshot, not only the `overflow` list:** text that hugs its width and is clipped by an ancestor frame (a centred title cut on both sides) is not reported. The fix is usually `widthMode: "FILL"` on the text so it wraps.
  3. Fix: `update_nodes`; default names with `rename_by_rule`; raw values where tokens exist with `bind_variables` (dryRun first).
  4. Re-run only the checks that failed, then **one final screenshot** at `scale: 1`.
- **Triage:** false positives (small target on a non-tappable label or on an indicator inside a tappable row — a radio or chevron in a 72-high list row, contrast sampled behind an opaque plate) are stated as reviewed and dismissed.

## 8. Rules of the loop

1. **Outside-in order is fixed:** structure (Pass 1) is locked before content (Pass 2). Don't adjust the root frame once it is full.
2. **Numbers every write, eyes per pass** (§3). A screenshot after every small block is waste; finishing a pass without one is negligence.
3. **Root layered, Auto Layout inside.** The screen root is `layoutMode NONE` with the regions layered (`Content` → `Bottom Container` → `Top Container`); every region and every frame inside uses Auto Layout. Free positioning only for decoration, background images, overlays and deliberately geometric blocks (dials, charts), named `decor/…` or explained in the report.
4. **Tokens first, hex later.** Bind existing variables/styles while building (padding/gap of screen layout frames stay raw numbers on purpose — `../mobile-ui-master/references/screen-structure.md` §8). No system yet → note the raw values for the Pass 3 report, or go back to Stage 2. Stage 4 directions (brand not chosen yet): brand/accent colors are free hex, neutrals and semantic colors are bound to the system (`creative-process.md` §4.4).
5. **At most 3 fix rounds on the same problem.** Still off → stop, tell the user the problem and the proposed approach.
6. **One screen at a time** in New build and From template. Sketch may lay out several screens side by side, Pass 1 for all first.

## 9. Definition of Done for a screen

- [ ] 0 **Blocker** issues.
- [ ] Body text contrast ≥ 4.5:1, large text and UI elements ≥ 3:1. Text over images checked visually.
- [ ] No default-named layers remain.
- [ ] Screen root is `layoutMode NONE` with regions layered; every frame inside a region uses Auto Layout (or is a documented geometric block).
- [ ] No raw values outside the primitive level — except padding/gap of screen layout frames (raw on purpose) — or the remaining ones are listed with a reason (file has no tokens yet).
- [ ] Long-text and large-text stress cases don't overflow; the stress section has been deleted.
- [ ] Tappable targets ≥ 44pt; exactly 1 primary CTA.
- [ ] Repeated blocks are instances.
- [ ] The final screenshot at `scale: 1` has been reviewed.

## 10. Moving to the next screen

- Report in one line: `✅ <Flow / Screen / State> meets DoD — audit: 0 Blocker, N Should fix (reviewed)`.
- The next screen of the set runs in **From template**: `clone_node` the screen that met DoD, edit what differs, numeric-check the edits, screenshot the changed areas, then Pass 3.
- State screens (empty, loading, error) are From-template screens of the one that met DoD.
- Stage 4: each direction is a Sketch; stop at the gate for the user to choose.

## 11. Example: Paywall / Timeline (New build)

**Pass 0:** goal = start a trial, CTA "Start free trial". Map as in §4. Timeline step is a list-row-like standard element → component. Hero generated with gemini → `generated-images/paywall-c-hero.png`.

**Pass 1 (1 write):**

```jsonc
{ "type": "frame", "name": "Paywall / Timeline", "width": 402, "height": 874, "layout": "NONE", "radius": 44,
  "fill": "#FFFFFF", "layoutGrids": { "preset": "mobile" }, "children": [
  { "type": "frame", "name": "Content", "x": 0, "y": 106, "width": 402, "height": 560, "layout": "VERTICAL", "padding": [24, 24], "gap": 24,
    "children": [ { "type": "frame", "name": "Hero", "widthMode": "FILL", "height": 208, "fill": "#FF00001A" },
                  { "type": "frame", "name": "Title", "layout": "VERTICAL", "gap": 8, "widthMode": "FILL", "height": 64, "fill": "#FF00001A" },
                  { "type": "frame", "name": "Timeline", "layout": "VERTICAL", "gap": 16, "widthMode": "FILL", "height": 216, "fill": "#FF00001A" } ] },
  { "type": "frame", "name": "Bottom Container", "x": 0, "y": 736, "width": 402, "layout": "VERTICAL", "heightMode": "HUG", "padding": [12, 24, 0, 24], "gap": 8,
    "children": [ { "type": "frame", "name": "CTA", "widthMode": "FILL", "height": 56, "fill": "#FF00001A" },
                  { "type": "frame", "name": "Caption", "widthMode": "FILL", "height": 20, "fill": "#FF00001A" },
                  { "type": "frame", "name": "Safe Area", "widthMode": "FILL", "height": 34, "fill": "#FF00001A" } ] },
  { "type": "frame", "name": "Top Container", "x": 0, "y": 0, "width": 402, "layout": "VERTICAL", "heightMode": "HUG",
    "children": [ { "type": "frame", "name": "Safe Area", "widthMode": "FILL", "height": 62, "fill": "#FF00001A" },
                  { "type": "frame", "name": "Toolbar", "layout": "HORIZONTAL", "widthMode": "FILL", "height": 44, "padding": [0, 16], "justify": "SPACE_BETWEEN", "align": "CENTER",
                    "children": [ { "type": "frame", "name": "Close", "width": 44, "height": 44, "fill": "#FF00001A" },
                                  { "type": "frame", "name": "Restore", "width": 72, "height": 44, "fill": "#FF00001A" } ] } ] } ] }
```

Numeric check: root `NONE`, layer order Content → Bottom Container → Top Container, Top/Bottom Container `HUG` and pinned to the edges (Bottom Container's bottom = 874), 208 + 64 + 216 + gaps fit inside Content. The `Safe Area` placeholders become `Safe-Area` component instances in Pass 2. One screenshot: grey boxes in the right order.

**Pass 2 (≈ 3 writes):** create the `Timeline step` component (Title, Desc, Icon swap, Has line) → fill Content (hero image, title, 3 step instances) in one write → fill Top Container + Bottom Container (close, restore, CTA as a `Button` instance, caption "7 days free, then 399,000₫/year") in one write → `update_nodes` for icon colours. Numeric check after each; one screenshot at the end.

**Pass 3:** audit finds white CTA text on #7C5CFC at 4.38:1 (Blocker) → #6A45F0; stars #B7791F at 3.4:1 → #946200. Long-text stress doesn't overflow. Re-audit 0 Blocker, final screenshot. ✅ DoD → "Paywall / Success" in From-template mode.

**Cost:** ~6 writes and 3–4 screenshots, against ~10 writes and 8+ screenshots when every region is written and screenshotted on its own.

## 12. Anti-patterns

| Wrong | Consequence | Right |
|---|---|---|
| One write of 136 nodes for 3 screens | Sizing, contrast and orphan errors surface at once on all 3 | Pass 1 → 3 per screen |
| A screenshot after every small block | Slow and token-heavy; most shots find nothing | Numeric check per write, one screenshot per pass |
| No screenshot until the very end | Visual errors (overlap, rhythm, hierarchy) pile up | One screenshot per pass, extra only for unusual blocks |
| Adjusting the frame once it is full | Breaks the FILL/HUG chain | Lock structure in Pass 1 with placeholders |
| Hand-copying repeated blocks | Fixing 1 place means fixing N places | Components first in Pass 2 |
| Giving a frame a `width` but leaving it HUG | It shrinks to its content and clips absolute children | `widthMode: "FIXED"` with the width; numeric check catches it |
| Polishing 3 directions before the gate | Wasted effort on the rejected ones | Sketch mode, stop at the gate |
| Building screen 2 while screen 1 still has Blockers | The errors get duplicated | DoD first, then From template |
