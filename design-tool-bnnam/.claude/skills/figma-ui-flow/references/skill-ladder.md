# Figma skill ladder (assessment standard + learning path)

## Contents
1. 6 skill levels and pass criteria
2. Practical tests per level
3. Core shortcuts
4. How the agent uses this file

---

## 1. 6 skill levels

A level is "passed" only when **all** criteria can be done without looking anything up.

### Level 1 — Basic operations (Beginner)
- Create frames, shapes, text, insert images; draw simple icons with the Pen tool; booleans (union, subtract).
- Align, distribute, layers, group vs frame.
- Fill, stroke, effects (shadow, blur), export PNG/SVG/PDF.
- Comment, share files, view version history.

### Level 2 — UI layout (Junior)
- Fluent Auto Layout: direction, gap, padding, Hug/Fill/Fixed, wrap, absolute position inside, min/max.
- Constraints for non-Auto Layout frames; layout grids saved as styles.
- Text styles, color styles, effect styles.
- Build a mobile screen that resizes 320–430 without breaking.

### Level 3 — Components (Mid)
- Components, instances, overrides, swap, reset.
- Variants named `Property=Value`; component properties (text, boolean, instance swap).
- Base components, nested components, slots.
- Interactive components (Default → Pressed).
- Publish and use a Team Library.

### Level 4 — Systems (Senior)
- 3-tier variables, aliases, scopes, modes (Light/Dark, brand, density).
- Typography scale and spacing scale aligned with the platform (Dynamic Type / Material 3).
- Prototypes with logic: variables, conditionals, expressions.
- Dev Mode, annotation, Ready for dev; QA against the checklist.
- Library governance: semver, deprecation, analytics, branching.

### Level 5 — Creativity and motion (Lead)
- Lead the Understand → Expand → Narrow → Polish process; run critiques.
- Produce 3 genuinely distinct directions for a brief in one session.
- Smart Animate, Figma Motion, motion tokens, Reduce Motion alternatives.
- Use shaders, Weave, and Figma agents as materials with standards — not as improvised effects.

### Level 6 — Master
- Design a multi-brand/multi-platform design system and operate it for the whole team.
- Automation: write or generate plugins (Plugin API / generative plugins), operate agents safely via Figma MCP.
- Connect design ↔ code: Code Connect, token pipeline (Figma → JSON → Swift/Compose/CSS), Figma Make / Code Layers for code-backed prototypes.
- Teach others; write standards (like this skill) and improve them.

## 2. Practical tests

| Level | Task | Passes when |
|---|---|---|
| 1 | Redraw a 6-icon 24×24 icon set with Pen + boolean | Even strokes, pixel-aligned, clean SVG export |
| 2 | Mobile login screen | 100% Auto Layout, resizes without breaking, styles for text and color |
| 3 | Complete Button + Input + List row | All states, properties, no more than 30 variants per component |
| 4 | Mini Light/Dark design system + 3 screens using it | Switching mode on whole screens has no errors; check_tokens.py reports no errors |
| 5 | Brief "morning habit app" → 3 directions → pick 1 → animated prototype | The three directions differ even with color hidden; motion has specs |
| 6 | Agent rebuilds the level-4 task via MCP + links Code Connect for 3 components | No violations of the core rules; full node ID report |

## 3. Core shortcuts (macOS)

Windows: replace `⌘` → `Ctrl`, `⌥` → `Alt`. Shortcuts may vary by keyboard/language — see `?` or the Help → Keyboard shortcuts menu in Figma.

| Action | Keys |
|---|---|
| Frame / Rectangle / Text / Pen | `F` / `R` / `T` / `P` |
| Add Auto Layout | `⇧ A` |
| Wrap selection in a frame | `⌥ ⌘ G` |
| Group / Ungroup | `⌘ G` / `⇧ ⌘ G` |
| Create component | `⌥ ⌘ K` |
| Detach instance | `⌥ ⌘ B` |
| Rename layer | `⌘ R` |
| Select child / select parent | `Enter` / `⇧ Enter` |
| Measure distance | hold `⌥` + hover |
| Copy / Paste properties | `⌥ ⌘ C` / `⌥ ⌘ V` |
| Show/hide layer | `⇧ ⌘ H` |
| Lock layer | `⇧ ⌘ L` |
| Zoom to fit all / selection / 100% | `⇧ 1` / `⇧ 2` / `⇧ 0` |
| Toggle layout grid | `⌃ G` |
| Toggle Dev Mode | `⇧ D` |
| Quick actions (find commands, plugins) | `⌘ /` or `⌘ K` |
| Place image | `⇧ ⌘ K` |

## 4. How the agent uses this file

- User asks "what level am I at": ask them to self-check the criteria for each level, or review a file they made (via MCP) and grade against the criteria — cite concrete evidence for each conclusion.
- User wants to learn: propose a path from their current level, one group of criteria per week + one practical task from section 2.
- No gut-feel grading; every remark is tied to a criterion.
