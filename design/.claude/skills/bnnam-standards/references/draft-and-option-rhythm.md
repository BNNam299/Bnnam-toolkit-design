# Draft and option rhythm — fast draft screens, options, clones

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/ui-draft.md + core/build-loop.md §2.11 (draft half), §2.13, §2.16 @ 3c0e291 — translated, complete (toolkit machinery dropped: load contract, adapter README, checkpoint lines). Option count follows the later team decision: **2–3 options**, not 5.

The **draft rhythm** is everything before the designer says *"lock screen …"* (*"chốt màn …"*): options, draft screens of a batch, clones. It is deliberately light. Binding variables, building components, converting to the designer's frame and the full Pass 3 belong to the **lock rhythm** — `lock-phase.md`. The loop itself is the tool demo's (`../figma-ui-flow/references/build-loop.md`) with the team additions in `screen-building-lessons.md`.

## Contents
1. When to use
2. What the draft reads and writes
3. Pass 0 — prepare (no writes, ~2–4 min)
4. Values while drafting: colours, fonts, no variables, no components
5. Read clusters, image inventory, repeated blocks, the plan
6. Pass 1 — frame (one write, ~1 min)
7. Pass 2 — fill by cluster (~3–5 min)
8. Pass 3 — quick check (~1 min)
9. Options for a screen with a new direction
10. Worked example — *Plan detail*, Pass 1
11. Stop points
12. Self-check
13. Report

---

## 1. When to use

- **Options** for a screen with a new direction — a few sketched alternatives to compare and pick a direction.
- **Drafts** of the screens in a batch before the designer says *"lock screen …"*.
- **Clones** of a screen from an image / ref, to measure or try quickly (`screen-building-lessons.md` §10).

**Not for** binding variables, creating components, normalising to the designer's frame, or batch acceptance — that is the lock rhythm (`lock-phase.md`).

Light / standard / full depth make no difference while drafting — depth only matters at the lock.

## 2. What the draft reads and writes

Nothing blocks a draft on documents. Use what exists: ref / moodboard, `design/flows.md` (which screens, which copy), `design/style.md`, existing sibling screens. Real copy missing → write copy that fits the product and note one line in `design/work/notes.md`.

| Read | Write |
|---|---|
| ref images · existing screens the designer points to · the file's palette and fonts (a quick read) · `design/work/notes.md` | draft screens in Figma (own section) · measurement images into `design/work/clone/` · one line per decision in `design/work/notes.md` |

**Draft rhythm rules** (from the two-rhythm rule — a test showed 38 % of what the agent wrote was project documents while the screen was still being refined over many rounds):
- Work **only in Figma**. **Do not** write `flows.md`, decision-log entries, `components.md` or long reports.
- Every decision (the designer's or your own) → **one line** in `design/work/notes.md`: `<date> · <screen> · <decision> · <who: designer / self> · <why>`.
- Progress notes after **each finished screen**, not each pass; a running plan of 3–5 lines.
- **Quick audit** when a screen is done = **only** `../ux-review-handoff/scripts/audit.js` with `CHECK_DUPLICATES: false` → fix the structure / text-overlap / visible-contrast errors — **no** `stress_test`, **no** `audit_design`, **no** done gate (a 3-screen clone test ran stress and full checks while drafting and lost minutes). A clone test is also draft rhythm unless told to lock.
- Steps whose output *is* a document (reading the PRD, UX flow, voice…) still write their documents as usual.

Terms: **cluster** — blocks that read as one (same background, scroll together, same idea) → one region. **Placeholder** — an empty frame at its real size, holding the place of a block to be filled. **Pass** — one round of writing + checking.

## 3. Pass 0 — prepare (no writes, ~2–4 min)

1. **Look at the real ref.** Image in Figma → `export_assets` PNG 2x into `design/work/clone/<run>/` → **open the image and look** (Read). Multi-screen image → crop the right screen. Measure with `../bnnam-standards/scripts/clone_measure.py` (`screens`, `prep --pt-width <screen width>`, `px`, `row`, `col`, `bbox`) — never write your own measuring script.
2. **Screen size:** clone → **the ref's size** (measured 375×812 → build 375×812). Option / draft → the project's screen size (`design/project.yaml › screen`); none → the platform size (new iOS project 402×874 — `frame-standards.md` §1).

## 4. Values while drafting: colours, fonts, no variables, no components

- **Colour:** take codes from the ref (by script, never guessed by eye) · read the file's palette once (`get_design_system`) — a ref colour close to a system colour (each channel off by ≤ 4) → use **the system colour's hex**; not in the system → the ref's **raw colour**. **Don't bind variables while drafting** — at the lock, `bind_variables` matches hex to variables in one pass. A new colour → one line in `notes.md`.
- **Options for a new direction (brand not chosen yet):** brand / accent colours are **free** (more accents allowed); **greys and semantic colours come from the system**. Once the direction is chosen, the brand colours go into variables and everything is bound (`../figma-ui-flow/references/creative-process.md` §4.4).
- **Fonts:** `list_fonts` → the ref's font or the closest one in the file. Font sizes and spacing on the 4 / 8 scale.
- **No components in the draft rhythm** — new blocks are plain frames; repeated / multi-state blocks are only noted in `notes.md`. Components are built at the lock (`lock-phase.md` §4). Exception: when `design/style.md › Proposed components` has been approved (style learning — `../design-system-audit/references/style-read.md`), those components are built at the **first lock** (the template screen) and later screens use their instances from the draft rhythm on, when the role matches (`screen-building-lessons.md` §2.12) — no need to wait for each screen's lock.
- **Draft structure = locked structure:** the screen frame has no auto layout (`layoutMode NONE`), layer frames inside it, auto layout inside each layer frame (`frame-standards.md` §1–2). Safe-Area: the instance when the file has the set, otherwise a placeholder frame at the inset, swapped at the lock. The lock never restructures a draft. While drafting, the tool-demo mandatory configuration is relaxed except the icon slot rule (icon in a centred slot) and never using page templates.

## 5. Read clusters, image inventory, repeated blocks, the plan

3. **Read the clusters** — the region map is written straight into the Pass 1 tree. For each region ask: *"what sits on this same background? what scrolls together? what is one idea?"* → same answer → **one cluster**, named by function (`Header`, `Categories`, `Plan list`, `Tab bar`…). A coloured background with cards / a character on it → one `visual_` cluster that contains them. Then decide the **layer frames** of the root: usually `Content` → `Bottom Container` → `Top Container`, plus **an own frame for anything that must sit over something else** (floating CTA, tab bar, sticker, overlapping character, sheet…) — **no fixed number of layers**. Full questions: `screen-building-lessons.md` §4.
4. **Image inventory:** drawable with 1–2 shapes, flat colour → vector · the rest (characters, detailed illustrations, photos) → **image placeholder** at real size. UI icons → SVG in a slot.
5. **Repeated blocks** (≥ 3 times: list rows, category tiles) → write the JSON once and duplicate it **in the same write**. No component yet.

Report the plan in **3–5 lines** (screen · size · regions · questions) — wait for a clear yes.

## 6. Pass 1 — frame (one write, ~1 min)

`render_tree` (no `parentId`, at most 40 nodes): root (`layout: "NONE"`) + layer frames at their `x`/`y` + **placeholders at their final size**, temporary tint `#FF00001A`. A placeholder that will hold children gets its final `layout` / `gap` / `padding` now, so Pass 2 fills it in place.

- **Number check:** `get_node{ids:[root], depth: 2}` — regions at the right size, no child wider than its parent, heights + gaps + padding add up · clone: main block positions within **≤ 2pt** of the ref (e.g. *"card 1 y 496, ref 497"*).
- **Eyes:** one `screenshot` of the whole screen — it should read as the final layout in grey boxes.

## 7. Pass 2 — fill by cluster (~3–5 min)

- Each write fills **one cluster** (several adjacent blocks, at most 60 nodes): `render_tree{parentId: <placeholder>}` or `delete_nodes` + `render_tree{parentId: <region>, index}` · text, icons, colours changed in bulk with one `update_nodes`.
- A placeholder's fixed height was an estimate → after content goes in, `heightMode: "HUG"`.
- Icons: slot with `layout` + centred on both axes, no uneven padding; a `icon-offcenter` warning → fix it before the next write.
- Long text has a width (`FILL` or fixed) so it wraps; one-line titles `maxLines: 1`.
- Image placeholders stay as they are (light fill + dashed stroke, named `illustration_<name>` / `image_<name>` / `logo_<name>` — `audit.js` counts them by these names).
- **Number check** after each write · **eyes:** one screenshot at the end of the pass, next to the ref.

## 8. Pass 3 — quick check (~1 min)

`audit.js` with `CHECK_DUPLICATES: false` → fix structure errors, text overlap, visible contrast (colours that follow the ref → note them, don't change) → one final screenshot at `scale: 1`. **No** `stress_test`, `audit_design` or done gate — those wait for the lock.

## 9. Options for a screen with a new direction

When: the first screen of a new or redesigned project, or a maintenance screen whose layout or components don't exist in the system yet (`../figma-project-maintain/references/processes.md`).

0. **Ask one question first:** *"draft the first screen **(a) with the kit** — use the kit's variables + atoms where they match the moodboard, clearly marked draft values elsewhere · **(b) entirely fresh** — raw values from the moodboard, the kit is tuned to the locked screen afterwards · or **mixed** (e.g. one option with the kit, one fresh)?"* If the request already says so (*"use the kit"*, *"completely new"*), follow it without asking. Record the choice in `notes.md`. After the direction is locked → kit setup (`../design-system-audit/references/kit-setup.md` §2–§4).
1. **2–3 options that really differ** — in layout / block order, visual hierarchy, shapes, density, emphasis; not recolours. Same function (the competitor crops for the same requirement / use case), same style (`style.md` / the existing system), same real copy.
2. **Sketch fast** — Passes 1–2: standard frame, real copy, blocks, colour, UI icons; illustrations are placeholders (`screen-building-lessons.md` §3); no components; quick audit. Each option is one frame `<Screen name>_Variant A`, `_Variant B`, `_Variant C` (`naming.md`), side by side in their own section; Pass 1 for the whole row → Pass 2 for the whole row → **one screenshot of the whole row** per pass.
3. **Report to the designer once** — one line per option: how it differs, what it suits · recommend 1–2 · the designer picks 1–2 (or merges ideas).
4. **Refine** the chosen option (full Pass 2, fill images per `screen-building-lessons.md` §3) → the designer **locks the direction** → `notes.md` records *"direction locked: <option>"* → kit setup (project with a source kit) → component spec (`../design-system-audit/SKILL.md`) · rejected options are deleted after the lock, with the reason in `notes.md`.

## 10. Worked example — *Plan detail*, Pass 1

Clusters: the purple background with the image and the stats card on it → one cluster `visual_Header`. The list → `Content`. The top bar stays fixed over the header → `Top Container` (safe area + top bar). The button stuck to the bottom sits over the list → **its own layer frame** `CTA bar`. Four layer frames, not three — the screen decides.

```json
{ "defaultFont": "Nunito", "select": false, "tree":
{ "type": "frame", "name": "Plan detail", "width": 390, "height": 844, "layout": "NONE", "clip": true, "fill": "#F7F5FF",
  "children": [
  { "type": "frame", "name": "visual_Header", "x": 0, "y": 0, "width": 390, "widthMode": "FIXED", "heightMode": "HUG",
    "layout": "VERTICAL", "padding": [112, 16, 20, 16], "gap": 16, "radius": [0, 0, 28, 28], "fill": "#6C4CF5", "children": [
    { "type": "frame", "name": "illustration_hero", "widthMode": "FILL", "height": 168, "heightMode": "FIXED", "radius": 20,
      "fill": "#FFFFFF33", "stroke": { "color": "#FFFFFF", "width": 1, "dash": [6, 4] } },
    { "type": "frame", "name": "Stats card", "layout": "HORIZONTAL", "widthMode": "FILL", "height": 72, "heightMode": "FIXED",
      "padding": [12, 16], "justify": "SPACE_BETWEEN", "align": "CENTER", "radius": 18, "fill": "#FF00001A" } ] },
  { "type": "frame", "name": "Content", "x": 0, "y": 388, "width": 390, "height": 456, "widthMode": "FIXED", "heightMode": "FIXED",
    "layout": "VERTICAL", "padding": [20, 16, 112, 16], "gap": 12, "children": [
    { "type": "frame", "name": "Section header", "widthMode": "FILL", "height": 24, "heightMode": "FIXED", "fill": "#FF00001A" },
    { "type": "frame", "name": "Day 1", "widthMode": "FILL", "height": 64, "heightMode": "FIXED", "radius": 16, "fill": "#FF00001A" },
    { "type": "frame", "name": "Day 2", "widthMode": "FILL", "height": 64, "heightMode": "FIXED", "radius": 16, "fill": "#FF00001A" },
    { "type": "frame", "name": "Day 3", "widthMode": "FILL", "height": 64, "heightMode": "FIXED", "radius": 16, "fill": "#FF00001A" } ] },
  { "type": "frame", "name": "CTA bar", "x": 16, "y": 744, "width": 358, "height": 56, "widthMode": "FIXED", "heightMode": "FIXED",
    "layout": "HORIZONTAL", "justify": "CENTER", "align": "CENTER", "radius": 28, "fill": "#FF000033" },
  { "type": "frame", "name": "Top Container", "x": 0, "y": 0, "width": 390, "widthMode": "FIXED", "heightMode": "HUG",
    "layout": "VERTICAL", "children": [
    { "type": "frame", "name": "Safe Area", "widthMode": "FILL", "height": 52, "heightMode": "FIXED", "fill": "#FF00001A" },
    { "type": "frame", "name": "Top bar", "layout": "HORIZONTAL", "widthMode": "FILL", "height": 44, "heightMode": "FIXED",
      "padding": [0, 16], "justify": "SPACE_BETWEEN", "align": "CENTER", "fill": "#FF00001A" } ] } ] } }
```

Number check: root `NONE`, layers bottom → top `visual_Header` → `Content` → `CTA bar` → `Top Container` · `visual_Header` HUG = 112 + 168 + 16 + 72 + 20 = 388 (top padding 112 = safe area 52 + top bar 44 + gap 16, so the image starts below the fixed bar) · `Content` 388 + 456 = 844 · `CTA bar` 744 + 56 = 800 ≤ 844 · `Top Container` 52 + 44 = 96. (A clone of a 390×844 ref, so the ref's size is kept; the `Safe Area` placeholder becomes the `Safe-Area` instance when the file has the set.) Pass 2 fills `Stats card` (3 number cells), `Day 1–3` (one row JSON, duplicated 3× in the same write), `Top bar` (back button, title, add button), the CTA label — one write per cluster.

## 11. Stop points

- The 3–5 line plan → wait for a yes.
- Template screen / clone done (images are placeholders) → stop once: screenshot + **image placeholder table** (name · size · content · drawing style) → the designer chooses how to fill → follow `screen-building-lessons.md` §3 (read it then).
- Options: stop once when the whole row is done.
- A batch of several screens: the template screen stops, later screens are built straight through, review at the end of the batch (`lock-phase.md` §1).
- Never stop between passes · 3 fix rounds on the same problem without success → stop and state the problem.

## 12. Self-check

- [ ] No `#FF00001A` placeholder left (except image placeholders) · no default frame names · no single-child frame without its own layout / fill / padding · repeated blocks identical to the number.
- [ ] `audit.js` shows no structure / text-overlap errors · final screenshot looked at · clone: main blocks within ≤ 2pt of the ref.

## 13. Report

One short block: screen · size · time per pass · audit (errors fixed, items skipped with the reason) · image placeholder table · new raw colours vs the system.

```text
Next step
  → "fill the images with (a)/(b)/(c)"
  → "lock screen …"          to the lock rhythm: variables, components, the designer's frame
```

Knowledge to add when needed: the designer's screen structure (`../mobile-ui-master/references/screen-structure.md`) when the project has the designer's frame standard or a template screen · monetization screens (`../mobile-ui-master/references/monetization-screens.md`, the risk checklist) for paywalls and sales screens.
