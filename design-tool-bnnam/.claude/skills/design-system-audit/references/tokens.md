# Design system and design tokens

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/tokens.md @ 3c0e291 — translated, complete

Knowledge is a lens for thinking, not a procedure. Where a team rule (`../bnnam-standards/SKILL.md`) differs, the team rule wins.

## Contents
1. Token tiers, context, groups, component governance
2. Generating scales — color, type, spacing, radius
3. What a design system is and is not
4. Value, and when to build one
5. The five parts
6. OOUX, Atomic Design and component thinking
7. UI foundations
8. Variants and managing complexity
9. Handoff and design–code alignment
10. The design system designer role
11. Design systems in an AI workflow
12. Design system checklist
13. Sources

---

## 1. Token tiers, context, groups, component governance

### 1.1. Three token tiers
Following Material's structure:
1. **Reference token** — palette, font size, raw spacing; e.g. `ref.color.blue.40`.
2. **System / semantic token** — a role; e.g. `sys.color.primary`, `sys.type.bodyLarge`.
3. **Component token** — one specific property; e.g. `comp.button.filled.container.color`.

Components point at semantic / reference tokens and hold no hard-coded hex or number unless there is a reason.

In Figma files these tiers usually appear as collections named **primitive** (tier 1), **alias / semantic** and **mapped** (the tier
designers bind to) — `scripts/detect.js` reports which collection plays which role.

### 1.2. Context
A token may change with:
- light / dark / high contrast
- iOS / Android
- compact / medium / expanded / large
- density or text scale
- LTR / RTL
- brand / theme
- reduce transparency / reduce motion

### 1.3. Token groups a system should have
Color · typography · spacing · size and touch target · shape / radius · elevation / material · motion · opacity / state layer · icon
size / weight · breakpoints and pane rules.

### 1.4. Component governance
Every component in the library needs:
- an owner and a maturity status
- links to design + code + guideline
- a version / change log
- an accessibility contract
- a test snapshot / visual regression
- deprecation and migration rules

---

## 2. Generating scales — color, type, spacing, radius

**Use when:** refining a kit's variables for a project (kit setup — `kit-setup.md`), generating a first token set (style reading, mode 1
— `style-read.md`), auditing scales (`system-audit.md`).

Sources: AgentsORG/DESIGN `CRAFT.md` (MIT — **heuristics, not a standard**), Material 3 and Apple HIG verbatim
(`../material-design-3/`, `../apple-hig/`), and the designer's own rules (`../mobile-ui-master/references/layout-spacing.md` — **the
designer wins** where they differ). Items marked **(synthesis)** combine sources; they are not a source's own words.

### 2.1. General principles
- **Closed scales named by role** — a fixed number of steps; the **primitive** tier holds the scale (color 50…950, spacing, radius); the
  **semantic** tier (alias / mapped) only points at steps of the scale and holds no stray values (CRAFT; §1.1).
- **Values with evidence** — measured from the moodboard + the screen whose direction was approved; never guessed **(synthesis)**
  (`../figma-project-maintain/references/processes.md`, `style-read.md` §4).
- **Primitives carry no role** — empty scopes, so they don't appear in the pickers while designing; the semantic tier sets the scope by
  role (background → Fill, text → Text, spacing → Gap, radius → Corner radius) (designer rule; Figma's `figma-generate-library` skill).

### 2.2. Color ramps — one source color, one ramp
- **Work in OKLCH** (not HSL, not sRGB mixing): anchor the two ends at about **L 0.97** (lightest step) and **L 0.22** (darkest), with L
  **evenly spaced** between steps; chroma follows a curve — about **30 % of the gamut ceiling at both ends**, rising to **about 85 % in the
  middle** (CRAFT).
- **One ramp, one hue:** if hue drifts more than about **10°** from end to end → rebuild around the middle step's hue (CRAFT).
- **Sibling ramps** (brand, success, warning, danger): **the same L at each step**, chroma at the same *fraction* of each hue's own
  chroma ceiling — never the same absolute chroma (CRAFT).
- **Tint by lowering chroma**, not opacity · **neutrals** lean slightly toward the accent hue — avoid pure grey `#808080` · if the brand
  is green, success uses a different color · clamp to sRGB **keeping L and H** (CRAFT).
- Material does the same: one source color → 5 key colors → a **tonal palette** of tones 0–100 (steps of 10, plus 95, 98, 99) → tones
  assigned to 26 color roles (`../material-design-3/references/styles__color__system.md` › *4. The algorithm creates tonal palettes*,
  *5. The algorithm assigns tones to color roles*).
- The number of steps follows the designer's kit (e.g. `color/Blue/50…950`) — keep exactly the kit's step set, add no odd steps
  **(synthesis)**.
- Tool: `../screen-background/scripts/palette.py` — `ramp <source color> --steps <kit steps>`, `match` for sibling ramps, `dark` for
  mirrored dark steps, `contrast` for pairs.

### 2.3. Dark mode
- **Swap the step a role points to** — 50↔950, 200↔800, 300↔700 — don't hand-pick a second palette (CRAFT). In Figma: the same semantic
  variable, whose Dark mode points at the mirrored step of the same ramp **(synthesis)**.
- Vivid accents on dark backgrounds: **lower chroma by about 20–30 %** · borders on dark: a muted solid or low-alpha white (CRAFT).
- Material: tone-based surfaces — surface is no longer tied to elevation
  (`../material-design-3/references/styles__color__system.md` › *Tone-based surface colors*).

### 2.4. Contrast — check and fix
- Thresholds: **4.5:1** normal text · **3:1** large text (about ≥ 24 px, or bold from about 18.5 px) and UI components — the same
  thresholds as the screen audit (`../ux-review-handoff/scripts/audit.js`) (CRAFT; `../mobile-ux-fundamentals/references/accessibility.md`).
- Check **declared token pairs** (`content/*` × `surface/*`) in **both Light and Dark** — not only the pairs visible on one screen
  (Terrazzo idea; `scripts/system-audit.js`).
- **Fix a failing pair by shifting L only** on one side, keeping hue and chroma (CRAFT).
- Quick guess: background **L ≥ 0.85** → text **L ≤ 0.45** · background **L ≤ 0.25** → text **L ≥ 0.75** (CRAFT).

### 2.5. Type scale
- **iOS first:** follow Apple's Dynamic Type scale — size, line height, weight per style (Large Title … Caption 2) in *Specifications* of
  `../apple-hig/references/typography.md`; an app with its own scale still needs every matching role **(synthesis)**.
- **Material:** one scale of 15 baseline + 15 emphasized styles, Display Large → Label Small; ratio **Major Second (1.125)**, base size
  **14** (`../material-design-3/references/styles__typography.md`).
- Building your own scale **(synthesis of the two above)**: pick the **body size** first (iOS 17 at the default size, Material 14–16),
  multiply / divide by one fixed ratio (1.125 dense · 1.2–1.25 airy), round to even integers where possible; **at most 3 typefaces** ·
  size floor **16 / 14 / 13**, almost never below 12 (CRAFT) — iOS allows 11 for Caption 2 (Apple).
- Line height: display about **1.1**, body **1.5–1.6** are web suggestions (CRAFT); mobile apps follow the Apple / Material tables (iOS
  body ~1.3).
- **Letter spacing = font size × 2.5 %** — the designer's rule (`../mobile-ui-master/references/layout-spacing.md` §12), which **wins**
  over CRAFT's tracking suggestions (−0.015em for large sizes, +0.06em for small all-caps labels).

### 2.6. Spacing
- Material: an **8dp** scale, `space100 = 8dp`, with small steps 2, 4, 6 and large ones up to 48, 56, 64, 72; define only the steps in
  use and extend when needed (`../material-design-3/references/styles__spacing.md` › *Spacing units*).
- A **4pt** grid for iOS — steps 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 **(synthesis**; matches Material's 8 grid on the even steps).
- Spacing by context (mobile / tablet / desktop, density) → variables with modes — the kit's `responsive` collection
  (`system-binding.md` §5).

### 2.7. Radius
- Material shape scale: **0 · 4 · 8 · 12 · 16 · 20 · 28 · 32 · 48 · full** (none → extra extra large); changing one step (e.g. *medium*)
  changes every component that uses it; buttons default to *full* (`../material-design-3/references/styles__shape.md`).
- **The designer's rule wins** (`../mobile-ui-master/references/layout-spacing.md`): containers in the same frame use **equal** radii · a
  large element's radius = **½ the height** of the small element next to it (image radius 22 next to a 44-high button). CRAFT's nested
  radius `inner = outer − padding` applies only where the designer's rule says nothing **(synthesis)**.

### 2.8. Checking a scale
- **Every step, no holes** — a ramp has the kit's full 50…950; spacing / radius have every declared step (Terrazzo `required-children`,
  idea).
- Monotonic steps: L decreases evenly along a color ramp; spacing, radius, font size increase with the step **(synthesis)**.
- Every semantic variable points at one step — no raw values in the alias / mapped tier (`figma-generate-library` skill).
- Semantic variables have a description (when to use it) (Terrazzo, idea).

---

## 3. What a design system is and is not

A design system is shared infrastructure — components, standards and documentation — that lets many people create a consistent
experience. It is at the same time a **shared language**, a **reusable library** and a **change-governance mechanism**.

A UI kit mostly supplies assets / components to assemble. A component library may already be mapped to code. A full design system also
needs a token architecture, patterns, content guidelines, accessibility, documentation, ownership, contribution and a release process.
A Figma file full of components is not automatically a design system.

## 4. Value, and when to build one

- **Consistency** across screens, products, platforms and teams.
- **Efficiency:** no re-deciding and re-implementing the same problem.
- **Quality:** states, accessibility and behaviour already verified.
- **Scale:** supports multiple brands / themes, dark mode and markets.
- **Collaboration:** design and code share names, logic and versions.

A design system becomes necessary when screens, teams or products grow; duplication appears; global changes cost too much; or experiences
drift apart. For a small MVP an open-source system / UI kit helps move fast, but the team still has to define how far it customises and
how it will exit the dependency.

## 5. The five parts

### Design tokens
Tokens turn visual decisions into named data. Structure:
- **Primitive:** raw values such as `blue-600`, `space-8`.
- **Semantic:** meaning, such as `color-text-primary`, `color-danger`.
- **Component-level:** specific values such as `button-primary-bg`.

Tokens cover color, typography, spacing, radius, elevation, border and motion. Semantic tokens let you change theme / brand without
editing every component. Names describe the role, never lock to a momentary color or pixel value.

### Component library
Every component needs anatomy, variants, sizes, states, behaviour, responsive rules and accessibility. Minimum states depend on context:
default, hover, focus, pressed, disabled, loading, selected, error, success and empty.

A good component has a just-enough API, avoiding two extremes: too specific → duplication; too general → property combinations that are
hard to use. Figma components and code components should map conceptually, though not necessarily layer for layer.

### Patterns and templates
A pattern solves a combination of behaviours — form validation, search / filter, onboarding, authentication, destructive actions. A
template arranges patterns into a page structure. This is where a design system goes from "a box of buttons" to guidance for building
experiences.

### Content guidelines
Voice / tone, labels, CTAs, errors, dates / numbers, terminology and localization. Language is part of the interface; the same component
with inconsistent copy is still an inconsistent experience (`../ux-writing/SKILL.md`).

### Documentation and governance
Documentation answers: when to use, when not to use, anatomy, properties, behaviour, accessibility, content, examples. Governance defines
ownership, proposing new components, review, release, deprecation and migration.

## 6. OOUX, Atomic Design and component thinking

OOUX starts from the objects in the user's mental model, their attributes, relationships and actions. A commerce system has Product,
Seller, Order and Customer; defining the objects first makes the IA and UI more stable than starting from a list of screens.

Atomic Design describes the levels atom → molecule → organism → template → page (`atomic-design.md`). It helps to see how
things assemble, but should not become a mandatory taxonomy for every team. What matters is the boundary of responsibility and
reusability.

OOUX / OOP give a shared language: object, property, state, method / action and composition. But a UX object is not a code object; the
designer owns the mental model and semantics, the developer owns the technical architecture.

## 7. UI foundations

- **Color** serves hierarchy, state, brand and accessibility. A palette needs a wide enough neutral range, semantic colors for success /
  warning / error / info, and contrast rules. Never hard-wire "red" into logic; use a danger token so the theme can change.
- **Typography:** define family, weight, size, line height, tracking and role. The type scale must support hierarchy without many
  near-identical styles. Test Vietnamese, digits, special characters, responsiveness and localization.
- **Grid, spacing and responsive:** the grid is the organising backbone — consistency, scannability, moving between breakpoints. Define
  container, columns, gutter, margin, spacing scale and reflow rules. Responsive is not only shrinking; hierarchy, navigation, density and
  interaction may change.
- **UI elements and interaction:** common groups are input controls, navigation, information components and containers. Every control
  needs affordance, feedback, focus, error prevention and recovery. Motion explains relationships, state changes or feedback — never
  decoration that slows the task or hurts accessibility.

## 8. Variants and managing complexity

- Plan properties along real dimensions: size, state, emphasis, icon.
- Don't turn every content difference into a variant.
- Use text / boolean / instance-swap properties for their intended roles.
- Avoid a Cartesian explosion of meaningless combinations.
- Name logically and keep instances linked; limit detaching.
- Test the component in real layouts, with long content, localization and breakpoints.

## 9. Handoff and design–code alignment

Handoff is continuous:
1. Engineering joins while flows are shaped and solutions chosen.
2. The designer clarifies behaviour, constraints and edge cases.
3. The file uses tokens, auto layout, components and meaningful names.
4. The spec covers states, responsive, content, assets, animation and accessibility.
5. Developers give feedback on API, data, performance and implementation trade-offs.
6. The designer checks the build and logs issues by severity.

A design system needs a source of truth and versions. When a token / component changes it needs a changelog, migration, a deprecation
window and an owner. Handoff content in detail: `../ux-review-handoff/references/handoff-spec.md`.

## 10. The design system designer role

A dedicated role usually owns token architecture, components, documentation, governance, contribution, adoption and measurement, working
with product designers, developers, accessibility, brand and content. The core skill is systems thinking: knowing when to generalise,
when to keep a use case separate, and how to serve many consumers without making the API too complex.

Metrics may include adoption, reduced duplication, design / build time, number of contributions, accessibility defects, upgrade rate and
internal consumer satisfaction.

## 11. Design systems in an AI workflow

When AI generates UI / code, the system must be more machine-readable: clear tokens, component APIs, "when to use / not use" rules,
examples and constraints. AI can become a consumer of the system through Figma Make, code generation or MCP.

Suggested workflow: prompt → AI generates from the system → designer reviews logic / UX → AI or developer implements → developer review
→ QA. Better suited to landing pages / marketing sites with little logic; products with sensitive data, security or complex interaction
need tighter control.

AI tends to favour systems that are easy to read as code, such as shadcn/ui, Radix and Tailwind. That speeds things up but risks
aesthetic sameness. The designer's role shifts toward architecting rules, trust, emotion and exceptions rather than only producing
screens.

## 12. Design system checklist

- [ ] Clear scope, consumers and owner.
- [ ] Tokens split primitive / semantic, supporting the themes needed.
- [ ] Components have states, responsive rules and accessibility.
- [ ] Patterns describe combined behaviour, not just single UI pieces.
- [ ] Content guidelines and terminology are consistent.
- [ ] Documentation has do / don't and real examples.
- [ ] Contribution, release, deprecation and migration are defined.
- [ ] Design–code mapping and versions are tracked.
- [ ] Adoption and quality metrics exist.
- [ ] Rules for AI consumers don't rely on images alone.

## 13. Sources

- §2: [AgentsORG/DESIGN — CRAFT.md](https://github.com/AgentsORG/DESIGN) (MIT) · [Terrazzo lint rules](https://github.com/terrazzoapp/terrazzo)
  · [Figma — figma-generate-library](https://github.com/figma/mcp-server-guide/blob/main/skills/figma-generate-library/SKILL.md) ·
  Material 3, Apple HIG (verbatim copies in `../material-design-3/`, `../apple-hig/`).
- §3–12 (Telos Academy, Vietnamese):
  [What is a design system](https://academy.telos.vn/design-system-la-gi/) — five parts, UI kit vs system, open source ·
  [Design system designer](https://academy.telos.vn/design-system-designer-la-ai-product-design/) — token architecture, governance, the
  dedicated role · [OOUX](https://telos.vn/tu-duy-thiet-ke-ui-ux-huong-doi-tuong-va-xay-dung-design-system/) — objects / components and
  the overlap with OOP · [Color in UI](https://telos.vn/mau-sac-trong-ui-design-khong-chi-dep-ma-can-hieu-qua/),
  [UI elements](https://telos.vn/yeu-to-ui-element-trong-thiet-ke-ban-nen-biet/) and
  [Grid](https://academy.telos.vn/grid-system-la-gi-vai-tro-trong-ui-ux/) — foundations ·
  [Code for Designer](https://telos.vn/khoa-hoc-code-for-designer-dao-tao-designer-thau-hieu-developer-tu-diem-mu-thiet-ke-den-san-pham-toi-uu-cho-lap-trinh/)
  — collaboration / handoff · [Design system with AI P1](https://academy.telos.vn/design-system-voi-ai-p1/),
  [P2](https://academy.telos.vn/design-system-voi-ai-la-end-user-part-2/) and
  [which systems AI chooses](https://academy.telos.vn/cach-ma-ai-lua-chon-design-system/) — AI as a consumer.
