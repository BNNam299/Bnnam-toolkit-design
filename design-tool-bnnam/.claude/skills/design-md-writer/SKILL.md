---
name: design-md-writer
description: Create or update a DESIGN.md file (Google spec, YAML tokens + Markdown rationale) so AI agents generate UI that follows the project's design system. The only output is a single DESIGN.md file.
---

# DESIGN.md Writer

Goal: produce a professional DESIGN.md that follows the Google spec (google-labs-code/design.md, version alpha). The file must be complete enough for an AI coding agent to generate consistent UI without guessing.

**Output: exactly one file, `DESIGN.md`, at the project root.** Do not create any other file (no tokens.json, no Tailwind config, no preview pages, no edits to CLAUDE.md/AGENTS.md). Any temporary file used for checking must live outside the project and be deleted afterwards.

Principle: **tokens first, rationale second.** Every rule needs a reason. Prefer explicit constraints and concrete prohibitions over mood descriptions.

## Step 1 — Gather input

Identify sources, in priority order:
1. Existing design: Figma (via MCP if available), screenshots, current code (Tailwind config, theme files, SwiftUI Color/Font extensions, CSS variables).
2. A brief/PRD, or the output of a design-director step if one exists.
3. The user's verbal description.

If critical information is missing, ask at most 3 questions in a single turn:
- What is the product, who is it for, and which platform (web / iOS / Android)?
- Desired brand feel (3 adjectives) and 1–2 reference products?
- Any mandatory colors, fonts or logo? Is dark mode required?

If code exists, **extract tokens from the real code** instead of inventing values.

## Step 2 — Load the spec

Run these to get the current spec and rules (the spec is alpha and may change):

```bash
npx @google/design.md spec
npx @google/design.md spec --rules-only --format json
```

Check section order and token names against this output. If it differs from the skeleton in `templates/DESIGN.template.md`, **follow the spec output**.

Optionally study 1–2 files closest in style from awesome-design-md (Stripe, Linear, Vercel, Airbnb, Apple…) to learn how they are organized. Never copy them verbatim.

## Step 3 — Start from the template

Read `templates/DESIGN.template.md`. It contains the full skeleton: YAML front matter with standard token names and all 9 body sections with guidance. Use it as the starting structure for DESIGN.md, replacing every `<placeholder>` and every guidance comment with real content. Remove sections that genuinely do not apply, keeping the remaining ones in order.

## Step 4 — Write the YAML front matter (tokens)

Use standard token names so tools recognize them:
- typography: `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`
- rounded: `none`, `sm`, `md`, `lg`, `xl`, `full`
- Components reference tokens with `{group.name}`, e.g. `{rounded.md}`, `{typography.label-md}`.

Requirements:
- All text-on-background color pairs meet WCAG AA contrast.
- Spacing follows one consistent scale (multiples of 4 or 8).
- Every color has a clear role and a semantic name (`primary`, not `blue`).
- Components reference tokens, never hard-coded values, wherever a token exists.

## Step 5 — Write the Markdown body

Sections (verify order with the spec command):

1. **Visual Theme & Atmosphere**: 2–4 sentences on brand personality and overall feel.
2. **Color Palette & Roles**: each color's role, when to use it and when not to.
3. **Typography**: hierarchy and usage rules per level.
4. **Components**: button, input, card, nav… including states (hover, pressed, disabled, focus).
5. **Layout & Spacing**: grid, max width, spacing between blocks.
6. **Depth & Elevation**: shadows, borders, layering.
7. **Do's & Don'ts**: at least 10 concrete, verifiable prohibitions.
8. **Responsive Behavior**: breakpoints and how layout adapts.
9. **Agent Prompt Guide**: direct instructions for AI agents generating UI.

Writing well:
- Explain the why. "Accent is used for at most one primary CTA per screen to keep focus" beats a bare hex code.
- Make prohibitions concrete: "No gradients on buttons", "No more than 2 headline levels per screen".
- State what is intentionally undefined so agents don't invent it.
- For iOS/SwiftUI: map to Dynamic Type, SF Symbols and semantic colors where relevant.

## Step 6 — Validate

```bash
npx @google/design.md lint DESIGN.md
```

Fix every structural error and contrast warning until lint is clean.

When updating an existing file: back up the old version outside the project (e.g. `/tmp/DESIGN.old.md`), run `npx @google/design.md diff /tmp/DESIGN.old.md DESIGN.md` to summarize changes, then delete the temp file.

If npx cannot run (no network), review the file manually against the spec and state clearly that lint was not run.

## Step 7 — Deliver

- Write the single file `DESIGN.md` at the project root and hand it to the user.
- Add a 2–3 line summary of the design direction and the lint result. No extra files.

## Pre-delivery checklist

- [ ] Exactly one output file: `DESIGN.md`
- [ ] Front matter has `version` and parses
- [ ] Standard token names; components reference tokens instead of hard-coded values
- [ ] Contrast meets WCAG AA
- [ ] At least 10 Don'ts
- [ ] Agent Prompt Guide present
- [ ] No `<placeholder>` or template guidance comments left
- [ ] Lint clean (or clearly stated that lint was not run)
- [ ] Values match real code/Figma when a source exists
- [ ] All temp files deleted
