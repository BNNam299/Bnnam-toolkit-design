---
name: figma-ui-flow
description: Tool-agnostic, "master"-level workflow and knowledge for building UI in Figma — 11 core rules, an 8-stage process with approval gates (brief → tokens → components → 2–3 directions → screens → prototype → QA → handoff), and a mandatory OUTSIDE-IN screen build loop in three passes (layout with sized placeholders → fill → lock with audit/stress), three modes (Sketch / From template / New build), one screen finished before starting another, a table routing each stage to the other design skills. Use when the user wants to design/draw/build screens or UI flows, create a design system or component library, explore creative directions, clean up or standardize a file, run QA, prepare a developer handoff, or assess Figma skill level — even when they only say "draw this screen for me", "design a paywall", "create an app UI", "this Figma file is a mess", including Vietnamese requests such as "vẽ giúp tôi màn hình này", "thiết kế paywall", "tạo UI app", "file Figma lộn xộn quá". Tool mechanics live in figma-agent-tools.
---

# figma-ui-flow — Workflow and knowledge for building UI in Figma

This skill answers **what to do, in what order, to what standard**. **Which tool to use** lives in the `figma-agent-tools` skill (the handbook for every figma-agent MCP tool). One standard, two executors:

- **Agent mode** — a Figma write tool is available (`figma-agent` or the remote Figma MCP): the agent reads and writes the canvas itself according to this standard.
- **Designer mode** — no MCP, or the user wants to do it themselves: the agent outputs **step-by-step instructions**, checklists, and token/naming tables for the person to follow.

Let `SKILL_DIR` be the directory containing this file.

## Document map — read the right file at the right time

| When you need | Read |
|---|---|
| **Building any screen** — the three-pass outside-in loop, modes, check budget, Definition of Done | `references/build-loop.md` |
| Session has `figma-agent` tools (`figma_status`, `render_tree`…): stage/pass → tool | `references/run-with-figma-agent.md` + the `figma-agent-tools` skill |
| Session only has the official Figma MCP (`use_figma`…) | `references/remote-figma-mcp.md` |
| Page structure, layer/frame naming, Auto Layout, grids | `references/file-standards.md` |
| Variables, tokens, styles, components, variants, libraries | `references/design-system.md` |
| Moodboards, direction exploration, critique, Motion, shaders, AI | `references/creative-process.md` |
| QA, accessibility, Dev Mode, developer handoff (iOS/Android/Web) | `references/handoff-qa.md` |
| Skill assessment, learning path, shortcuts | `references/skill-ladder.md` |
| Check a token JSON file (names, aliases, contrast) | `scripts/check_tokens.py` |
| Brief template / QA report template | `assets/brief.template.md`, `assets/qa-report.template.md` |
| Two-level token JSON template with Light/Dark | `assets/tokens.example.json` |

Do not read everything at once. Each stage below states which file it needs.

**Knowledge and steps in other skills** — load the one the current stage needs; do not copy it here. In the team's (designer's) files, load `bnnam-standards` first: where it differs from this skill, the team standard wins.

| Need | Skill |
|---|---|
| Team standard: designer's frame (root `NONE`, Safe-Area, 402×874 for new projects), screen naming, draft and option rhythm, lock phase, `_Fix` copies, team scripts | `bnnam-standards` |
| PRD or requirements doc → screen list, flows, wireframes before any UI | `prd-to-ux-flow` |
| A project already in Figma: take it over, rework a screen, add screens or states, flow map, gaps, status | `figma-project-maintain` |
| The file's design system: detect conventions, audit and fix variables/styles/components, moodboard → tokens, base kit | `design-system-audit` |
| Touch targets, states, feedback, sheet/dialog/snackbar, thumb zone, gestures | `mobile-ux-fundamentals` |
| Layout, information density, avoiding card stacks/meaningless emptiness, visual review; measured designer screen structure; paywall, sale, ad gate, banner | `mobile-ui-master` |
| Copy inside the screen: real text, buttons, errors, empty/permission states, voice and tone | `ux-writing` |
| iPhone / iPad / Watch / Widget per HIG | `apple-design-iphone`, `apple-design-ipad`, `apple-design-watch`, `apple-design-widget` |
| Apple's exact wording for a component or pattern (verbatim HIG) | `apple-hig` |
| iOS 27 adaptive layouts: iPhone Duo (foldable), iPad, Split View, resizable windows | `iphone-duo-adaptive` |
| Android, Material 3, iOS vs Android decisions | `material-design-3` |
| Android home screen widgets (grid cells, canonical layouts, quality tiers) | `android-design-widget` |
| Vector illustration drawn in Figma (widget scene, empty state, onboarding art): shading, masks, grouping | `figma-vector-illustration` |
| Websites (marketing site or web product) | `web-design` |
| Store approval of paywalls, subscriptions, ads, permissions, privacy | `app-store-policies` |
| Color-blend screen background (`Background/<name>`) | `screen-background` |
| Prompts for illustrations, hero images, backgrounds | `generating-oneshot-image-prompts` |
| One generated asset with a transparent background (icon, mascot, sticker) | `app-asset-generator` |
| Click-through flow for choosing between options | `figma-prototype-flow` |
| Usability review (heuristics, severity, review list) and developer handoff spec | `ux-review-handoff` |

## 11 core rules (they override any personal habit)

1. **No raw values.** Color, font size, spacing, radius, and shadow are always bound to a variable or style. A hand-typed hex code in a layer is a defect. **One exception — Stage 4 directions before the brand is chosen:** brand and accent colors are free hex (you may add accent colors to explore); neutrals/greyscale and semantic colors (success, warning, error, info) still come from the system. Once a direction is chosen, promote its brand/accent colors into variables and bind everything (`references/creative-process.md` §4.4). **Designer-standard exception — spacing on screen layout frames:** padding/gap of the layout frames inside a screen (`Content`, section containers, rows) are raw numbers on purpose; spacing inside components is always bound (`../mobile-ui-master/references/screen-structure.md` §8).
2. **Auto Layout inside, layered regions at the root.** The screen root has **no auto layout** (`layoutMode NONE`): it layers `Background/<name>` (if any) → `Content` → `Bottom Container` → `Top Container` → `Scrim` → sheet/popup, bottom to top, so content scrolls under the top bar. That list is the usual skeleton, not a limit: anything that must sit over something else (floating button, sticker, an illustration overlapping two regions) gets its own region frame at the layer it needs. The same structure applies in every mode, sketches included. Every region and every frame inside it uses Auto Layout; free positioning is only for decoration, background images and overlays, named `decor/…` (`../mobile-ui-master/references/screen-structure.md` §1).
3. **Search before you create.** Before drawing an element, search the library (agent: `search_design_system`). Create something new only when you are sure it does not exist.
4. **Meaningful names, no default names.** No `Frame 12`, `Rectangle 4`, `Group 7` in anything handed off.
5. **Semantics first, values second.** Tokens are named by role (`color/text/primary`), not by value (`blue-500`) — except at the primitive level.
6. **Explore wide before going deep.** Every creative problem gets at least 2–3 genuinely different directions before one is polished.
7. **Every state is drawn.** Default, pressed, disabled, loading, empty, error, long content, large text, dark mode.
8. **Keep draft and approved areas separate.** Explore on the `🧪 Explore` page; only approved work goes into `✅ Ready`.
9. **Non-destructive.** The agent does not delete or overwrite the user's work; edit on a copy or branch, and confirm before changing anything out of scope.
10. **Check numbers every write, eyes every pass.** After every write, read back sizes (`get_node`): fixed sizes kept, children fit, FILL/HUG as planned. At the end of each pass, screenshot the screen and compare it with the intent; screenshot an individual block only when it is visually unusual. Never report "done" without looking.
11. **One screen at a time, outside-in, in three passes.** Pass 1 Layout (frame + regions + sized placeholder blocks, locked while empty) → Pass 2 Fill (components first, then content by cluster) → Pass 3 Lock (audit + stress → DoD). Pick the mode first: Sketch, From template, or New build. Start the next screen only once the current one meets the Definition of Done. Details: `references/build-loop.md`.

## The 8-stage process

Not every task runs all 8. Determine the entry point in Stage 0, then run from there. There is a **human approval gate** after Stages 1, 4, and 7.

### Stage 0 — Intake and orientation

1. Determine the mode: does the session have a Figma write tool — the remote Figma MCP (`use_figma`, `get_metadata`…) **or** `figma-agent` (`figma_status`, `render_tree`, `search_design_system`…)? Yes → Agent. With `figma-agent`: load the `figma-agent-tools` skill, read `references/run-with-figma-agent.md` to know the tool for each step, call `figma_status`, and resolve any `versionCheck` warning before starting. No tool → Designer (same process, the output is instructions). If the user wants Agent mode but the tools are missing: say clearly that they need to open the figma-agent-UI plugin (or connect the remote Figma MCP), then continue in Designer mode.
2. Classify the request and choose the entry point:

| Request | Start at |
|---|---|
| New project from scratch | Stage 1 |
| New project from a PRD / requirements doc | `prd-to-ux-flow` (screen list, flows) → Stage 1 |
| "Clean up / standardize this file" | Stage 7 (audit; design system: `design-system-audit`) → back to Stages 2–3 to fix |
| Create a design system / library | Stage 2 → 3 |
| Take over, rework or extend an app already in Figma | `figma-project-maintain` → Stage 5 |
| Draw a new screen in a file that already has a system | Stage 5 |
| "Find ideas / make it prettier / more creative" | Stage 4 |
| Prototype, animation | Stage 6 |
| Developer handoff | Stage 7 → 8 |
| Skill assessment / learning Figma | `references/skill-ladder.md` |

3. Agent: read the file structure first (pages, top-level frames, existing design system) to know what the file contains. Do not guess. In the team's files, follow `bnnam-standards` (read first, gates, consent) from here on.

### Stage 1 — Brief and file foundation → *gate*

Read `references/file-standards.md` and `assets/brief.template.md`.

1. Lock a minimal brief: product, users, platform (iOS / Android / Web / cross-platform), business goal, constraints (existing brand, deadline, accessibility), success criteria. Ask about anything missing — at most 3–4 questions, batched in one message. A PRD exists → its screen list and flows come from `prd-to-ux-flow`. The platform decides which platform skill to load (table above).
2. Set up the file skeleton using the standard pages (Cover, Brief, Explore, Foundations, Components, Screens, Prototype, Ready, Archive).
3. **Gate:** present a one-page brief + the file skeleton. Wait for the user's confirmation before continuing.

### Stage 2 — Foundations

Read `references/design-system.md` sections 1–4. The file already has a system, or tokens must come from a moodboard or base kit → `design-system-audit` (detect, audit, kit setup).

1. Variables in 3 levels: **Primitives** (raw palette, number scales) → **Semantic** (roles, with Light/Dark… modes) → **Component** (only when truly needed).
2. Typography scale, spacing scale (4/8 grid), radius, elevation, motion tokens.
3. Set `scopes` on each variable so it only appears where it applies.
4. If tokens exist as JSON: run `python3 SKILL_DIR/scripts/check_tokens.py <file.json>` and fix every error before continuing.
5. Build a Foundations page that visualizes every token (swatches, type specimen, spacing ruler).

### Stage 3 — Components

Read `references/design-system.md` sections 5–8.

1. Build order: atoms (icon, text, divider) → basic elements (button, input, chip, avatar) → composites (card, list row, nav bar, tab bar, sheet).
2. Each component: clear anatomy, correct Auto Layout, 100% token binding, component properties instead of redundant variants, all states, a description and documentation link.
3. Name variants as `Property=Value`. Name properties consistently across the whole library.
4. Build a "Playground" page to test each component: stretch it, long text, switch modes, change sizes.

### Stage 4 — Creative exploration → *gate*

Read `references/creative-process.md`.

1. Gather references and build a moodboard annotated with "what to take from this".
2. Diverge: create **2–3 genuinely different directions** (different in concept, not just color), each applied to the same 1–2 "key" screens. Brand/accent colors are free hex here; neutrals and semantic colors come from the system (`references/creative-process.md` §4.4).
3. Each direction comes with: a name, a one-sentence idea, strengths, risks, who it suits. A color-blend background → `screen-background`; to let the user tap through the directions → `figma-prototype-flow`.
4. **Gate:** stop for the user to choose or mix. This is the most expensive decision to get wrong — do not choose on their behalf.
5. Converge: turn the chosen direction into rules — promote its brand/accent hex into Primitive + Semantic variables, bind every layer, update components — and only then polish.

### Stage 5 — Build screens (the outside-in loop)

Read `references/build-loop.md` — **mandatory** for every screen.

1. **Pick the mode:** **Sketch** (quick idea, Stage 4), **From template** (a similar screen exists: clone and edit what differs), **New build** (complex, no template). First screen of a set = New build, the rest = From template.
2. **Pass 0 Prepare:** screen goal, one primary CTA, real content, a region map down to block sizes, which blocks repeat or match an earlier screen (→ components), images generated up front (`generating-oneshot-image-prompts`, `app-asset-generator`). Real content follows `ux-writing`; a paywall or sale screen follows `mobile-ui-master` (monetization) and `app-store-policies`.
3. **Pass 1 Layout (1–2 writes):** root frame at the project's frame size (`file-standards.md` section 4) + named regions (`Top Container` / `Content` / `Bottom Container`) + **sized placeholder blocks** carrying their final Auto Layout. Numeric check, then one screenshot: the screen should already read as the final layout in grey boxes.
4. **Pass 2 Fill:** components first for standard elements (button, list row, key, chip) and for any block identical to one on a screen already built — componentize from the **second** screen (Stage 3), then fill placeholders **by cluster** (several blocks per write) and add real text, icons, images in batches. Numeric check after each write; one screenshot at the end of the pass, extra ones only for unusual blocks.
5. **Pass 3 Lock:** audit + stress + one final screenshot, fix until it meets the **Definition of Done** (skipped in Sketch).
6. Screen meets DoD → report in one line → only then move to the next screen, in From-template mode. State variants (empty, loading, error, long text, large text, dark) are From-template screens of the one that met DoD.
7. Arrange left → right by flow, group with Sections, name them `Flow / Screen / State`.

### Stage 6 — Prototype and motion

Read `references/creative-process.md` sections 7–8.

1. Prototype the main flow first, secondary branches later. A flow for deciding between options, built on copies so the originals stay untouched → `figma-prototype-flow`. Use interactive components for micro-interactions (toggle, tab, accordion) so you don't have to wire every screen.
2. Use variables + conditional logic when the prototype needs state (cart, login, counter).
3. Motion (Smart Animate / Figma Motion): every animation has a reason — guidance, feedback, or spatial continuity. Duration and easing come from motion tokens. Always provide a Reduce Motion alternative.

### Stage 7 — QA → *gate*

Read `references/handoff-qa.md` sections 1–3, use `assets/qa-report.template.md`. A usability review of the flows (heuristics, severity, a review list the user picks fixes from) → `ux-review-handoff`.

1. Run the 6-group QA checklist: structure, tokens, layout, states, accessibility, content.
2. Log issues by severity: **Blocker** (must be fixed before handoff), **Should fix**, **Nice to have**.
3. Agent: check whatever can be checked automatically (default names, values not bound to tokens, frames without Auto Layout, contrast, text overflow) with the read-only audit/stress tools; check the rest via screenshots. State clearly which warnings are false positives.
4. **Gate:** present the QA report; move on to handoff only after the Blocker items are fixed.

### Stage 8 — Handoff

Read `references/handoff-qa.md` sections 4–6; the full handoff spec is `../ux-review-handoff/references/handoff-spec.md`.

1. Mark Ready for dev per Section, write annotations for behavior that isn't visible (logic, edge cases, animation, accessibility).
2. Map tokens to code (Swift/Kotlin/CSS) using the table in `handoff-qa.md`. If Code Connect is available, connect components to the real code.
3. Write the library version changelog; publish the library with a description of the changes.

## Output by mode

**Agent:** real changes in the Figma file + a short report: what was created/edited (with node IDs or links), which decisions were locked, what remains open. Don't re-describe what the user can open and see for themselves.

**Designer:** an instruction document containing: goal → steps (numbered, naming the exact menu/shortcut/panel) → value tables (tokens, naming) → self-check checklist. Each step is specific enough to follow without guessing.

## Self-check before reporting done

- No default-named layers remain in the scope worked on.
- No hand-typed colors/font sizes/spacing outside the primitive level (Stage 4 directions: only brand/accent hex, listed in the direction's palette).
- Content frames all use Auto Layout; test resizing doesn't break them.
- All states and dark mode are present (if the project has modes).
- Body text contrast ≥ 4.5:1, large text and UI elements ≥ 3:1.
- Agent: screenshotted and reviewed the final result; deleted nothing out of scope.
- Every screen went through Pass 1 → 3 (Sketch: 1 → 2) and met the Definition of Done before the next screen started.
- Passed the human approval gates corresponding to the stages that were run.

## Common pitfalls

- **Jumping straight to pixels** without a brief and tokens → everything must be redone when the direction changes.
- **Variant explosion** (Size × State × Icon × Theme = hundreds) → use boolean/instance-swap properties and variable modes instead of variants.
- **Dark mode by duplicating screens** → use modes on the Semantic collection.
- **Groups instead of Frames** → Groups have no Auto Layout, padding, or clipping; use Groups only for illustrations.
- **"Creative" = adding effects** → creativity lies in how content is organized and the emotion it evokes; effects only serve the idea.
- **Agent writes a big chunk before checking** (a whole finished screen, or all 3 screens, in one write) → errors pile on errors and fixing costs many times more. Lock the layout with placeholders first, then fill.
- **Checking too densely** (a screenshot after every small block) → slow and token-heavy, and most shots find nothing. Check numbers every write with `get_node`, look once per pass.
- **Polishing before the gate** → building out all 3 directions in detail before the user has chosen. In Stage 4, build each direction in Sketch mode (Pass 1–2), just enough to compare, then stop.
- **Copying a famous app verbatim** → references must state which principle is being taken, not the surface.
