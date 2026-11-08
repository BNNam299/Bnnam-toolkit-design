# Creative process in Figma

## Contents
1. Operating model: Understand → Expand → Narrow → Polish
2. Creative brief and the right questions
3. References and moodboard
4. Divergence: techniques for genuinely different directions
5. Critique and convergence
6. Visual polish
7. Motion: Smart Animate and Figma Motion
8. New materials and AI on the canvas
9. Habits of strong designers

---

## 1. Operating model

```
UNDERSTAND ──► EXPAND ──► NARROW ──► POLISH
brief          2–3 directions  pick + rules   pixels, motion
               (Explore)       (user gate)    (Screens)
```
- Expand fast and rough: low-fi, grayscale, no pixel worries. The goal is a quantity of distinct ideas.
- Narrow by criteria (from the brief), not by a gut feeling of "looks nice".
- Polish only the chosen direction. Polishing early is wasteful and makes reviewers fixate on details.

## 2. Creative brief

Beyond the product brief (see `assets/brief.template.md`), also lock down:
- **Core emotion:** 3 adjectives, each with a "not" (e.g. *warm — not childish*).
- **Key moments:** 1–2 screens that define the impression (onboarding, home, results). Every exploration direction is applied to these same screens for a fair comparison.
- **Non-negotiables:** logo, brand colors, mandatory platform conventions.
- **Success measure:** what the user must be able to do faster/more easily.

## 3. References and moodboard

1. Collect 15–30 references from many sources: products in the same industry, **outside the industry** (magazines, architecture, packaging, games, posters), nature, materials.
2. Paste them into the Explore page, grouped by theme: color, typography, layout, imagery, motion, micro-details.
3. **Annotate each reference**: which *principle* you are taking ("information hierarchy through extra-large type", "background color changes with content"), not just "pretty".
4. Distill 3–5 shared principles → these are the raw material for the directions.

Agent: you can use `generate_figma_design` to capture a live reference interface as a reference image; always credit the source; never use it as the final design.

## 4. Divergence — creating genuinely different directions

"Genuinely different" test: if two directions look alike once you hide the color → they are not different yet.

### 4.1 Axes of differentiation
| Axis | Pole A ↔ Pole B |
|---|---|
| Density | Airy, one idea per screen ↔ Dense, dashboard |
| Hierarchy | Type-led (editorial) ↔ Image-led |
| Structure | Familiar lists/cards ↔ Free space/canvas |
| Voice | Serious, utilitarian ↔ Playful, characterful |
| Material | Flat, thin borders ↔ Depth, glass, shadows, shaders |
| Motion | Static, instant ↔ Continuous, physical |

Pick 2–3 different pole combinations → each combination is one direction.

### 4.2 Techniques
- **Crazy 8s:** 8 layout options for one screen in 8 minutes (low-fi frames at the project's frame size — 402×874 for a new project — in a grid).
- **Inversion:** "What if this screen couldn't have a list?"
- **Exaggeration:** push one attribute to the extreme (96px type, a single color) and then pull back.
- **Borrow from other fields:** magazine layout for a finance app; game UI for a learning app.
- **Artificial constraints:** only 2 colors; only 1 font, 2 sizes; no icons.
- **Fast variations with modes:** if variables exist, create experimental modes (`Exp – Warm`, `Exp – Mono`) and switch the whole screen's mode for instant comparison.

### 4.3 Presenting directions
One Section per direction in Explore:
- An evocative name (not "Option A"): "Morning Magazine", "Quiet Dashboard".
- A one-sentence idea.
- 1–2 key screens + a mini color/type palette.
- Strengths, risks, who it suits.

### 4.4 Color while exploring (first screens, brand not chosen yet)
The first screens of a product are where the brand is decided, so the system cannot dictate it yet — but it can still carry everything that is not brand.
- **Free:** brand and accent colors. Use hex directly; add accent colors if a direction needs them (a second accent, a highlight). Keep them near the system's lightness/saturation range so they can be promoted without redrawing.
- **From the system:** neutrals/greyscale (background, surface, text, border, divider) and semantic colors (success, warning, error, info). Bind them as usual — they rarely change with the direction, and binding them now keeps contrast and dark mode honest.
- **Palette on the section:** each direction lists its brand/accent hex next to its name, so the comparison and the later promotion read from one place.
- **After the gate:** the chosen direction's brand/accent hex become Primitive variables, mapped to Semantic roles (`color/brand/primary`, `color/accent/…`); bind every layer and update components. Rejected directions keep their hex in Archive.

## 5. Critique and convergence

### 5.1 Critique framework (for people and agents)
1. **Goal:** how well does this direction help users reach the goal in the brief?
2. **Hierarchy:** in 3 seconds, where does the eye go first, then next? Is that the right priority order?
3. **Consistency:** do things of the same kind look alike?
4. **Emotion:** does it hit the 3 adjectives in the brief? Does it fall into a "not" pole?
5. **Feasibility:** can dev build it within constraints? Any accessibility issues?
6. **Distinctiveness:** is there something users will remember?

Give feedback as: *observation → impact → suggestion*. Avoid "I don't like it".

### 5.2 Convergence
- The user picks or blends. Record the **reason for choosing** and the **reason for rejecting** in the Brief page.
- Turn the winning direction into rules: update tokens, text styles, components. Losing directions → Archive (do not delete).

## 6. Visual polish

Polish checklist in order of impact:
1. **Alignment and rhythm:** every spacing value comes from the spacing scale; edges line up; vertical rhythm is even.
2. **Typography:** at most 2 families; clear size contrast between levels; reasonable line length; no single-word orphan at the end of a heading.
3. **Color:** accent color only for what matters (the 60-30-10 rule as a starting point); states use consistent feedback colors.
4. **Optics:** align icons optically (a triangular "play" icon shifts slightly right); center button text by eye, not just by the box.
5. **Nested corner radii:** inner radius = outer radius − padding (so the curves stay parallel).
6. **Micro-details:** consistent stroke widths, shadows from the same light source, images in the same tone.
7. **Real content:** replace lorem ipsum with real or near-real content; long names, large numbers, bad photos.
8. **Test dark mode and large text sizes** — polish is not just for the happy path.

## 7. Motion

### 7.1 When to use motion
| Purpose | Example |
|---|---|
| Spatial orientation | Push a screen, open a sheet from the bottom, expand a card into detail |
| Feedback | Button shrinks slightly on press, shake on wrong password |
| State | Skeleton → content, loading → success |
| Personality (use sparingly) | Onboarding illustrations, completion celebrations |

No purpose → no animation.

### 7.2 Smart Animate (prototype)
- Two frames with layers of **the same name, at the same level** → Figma interpolates position, size, opacity, color, rotation.
- Consistent layer naming across frames is a hard requirement.
- Interactive components: create interactions between variants (Default → Pressed on press) so every instance gets the interaction automatically.
- Variables + conditionals: `if count > 0 → show badge`, switch mode when dark mode is turned on.

### 7.3 Figma Motion (timeline, if the account has it)
- Keyframe animation directly on the canvas: position, scale, rotation, opacity, easing; use it for micro-interactions, transitions, animated illustrations.
- Shader properties can also be keyframed → animated backgrounds and lighting.
- Duration and easing come from motion tokens (`design-system.md` section 2.5).
- Always export specs for dev: duration, delay, easing (cubic-bezier or spring stiffness/damping), changed properties.
- Design a **Reduce Motion** alternative: replace slides/zooms with a short fade or an instant change.

## 8. New materials and AI on the canvas

> The features below were announced by Figma in 2026; some are in beta, rolling out gradually, and often only available on paid plans. Check which features the account has before building them into the process.

| Tool | Used for | Standards note |
|---|---|---|
| **Shader fills/effects** | Backgrounds, lighting, noise, glass, animated gradients | Treat them as "materials" — make them styles/tokens and use them consistently; check text contrast on shader backgrounds; provide a static fallback for Reduce Motion and low-end devices |
| **Figma agent (AI in Figma)** | Generate drafts, change layouts, clean up layer names, create quick variations | Treat output as a draft in Explore; always check against the core rules (tokens, Auto Layout, naming) before moving it into Screens |
| **Weave tools** | Create/edit images, illustrations, graphics with node-based AI flows | Record the workflow/prompts used so results are reproducible; check image usage rights |
| **Generative plugins** (create plugins from a prompt) | Automate the team's own repetitive tasks: batch renaming, data generation, checks | Test plugins on a copy before running them on the real file |
| **Figma Make** | Working, code-backed prototypes from a prompt or a design | Good for trying complex interactions and user testing; the source of truth is still the Design file |
| **Code Layers / Figma Sites** | Interactive code layers on the canvas; publish designs as websites | Clearly separate "source-of-truth design" from "code experiments" with dedicated Sections |

Agent: when the user asks for AI-driven creative work, still apply the Expand → Narrow loop: create several small variations, present them with names and rationale, and wait for a choice.

## 9. Habits of strong designers

- **Design with real content** early; content drives layout.
- **Grayscale first, color later** — if the hierarchy doesn't hold in grayscale, color won't save it.
- **Zoom to 100% often** and view on a real device (Figma mirror/app) — a zoomed-in canvas misleads you about type size and touch targets.
- **Name things as you create them** — 2 seconds now saves 2 hours at handoff.
- **Shortcuts are speed**: see `skill-ladder.md` section 3.
- **One source of truth**: edit the main component, not an instance you then detach.
- **Record the why**: every important design decision gets a one-line "why" (comment or annotation).
