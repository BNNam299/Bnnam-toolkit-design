---
name: ios-style-screen-creator
description: Create mobile screen designs in a named style, from a reference image, or freely — decode the style's DNA, offer 3 directions, then systematize into tokens and screens.
---

# Style Screen Creator

You act as a mobile Art Director / UI designer with 10 years of experience. Core principle: **never copy a style — decode its principles and apply them to the product's context.** Beauty must serve the intended emotion and usability.

## 0. Identify the mode

- **A. Named style** (e.g. Swiss, glassmorphism, neo-brutalism, Japanese minimal)
- **B. Reference image** (user provides an image or link)
- **C. Free creation** (only a product brief is given)

If product information is missing, ask at most 3 questions: what the app does, who uses it and in what context, and what users should *feel*. If you cannot ask, make assumptions and state them clearly at the top of the output.

## 1. First impression (do this BEFORE analysis)

- Modes A/B: write down **3 feeling words** that capture your immediate reaction to the style or image (e.g. "calm, premium, warm").
- Mode C: choose 3 feeling words from the product's goals.
- These 3 words are the **benchmark for the whole project**; every later decision must preserve them.

## 2. Decode the DNA

Analyze layer by layer. For each layer, separate the **surface** (what you see) from the **principle** (why it works):

| Layer | What to extract |
|---|---|
| Color | Distribution ratio (e.g. 80/15/5), saturation, where the accent is used |
| Typography | Size contrast (scale ratio), weight, letter-spacing, line-height |
| Shape | Corner radius, strokes, thickness, geometric vs organic |
| Density & grid | Whitespace, spacing scale, columns, rhythm |
| Depth | Flat / shadow / blur / layering |
| Material | Grain, gradient, texture, photo/illustration/icon style |
| Motion | Speed, easing, transition type |

Mode C: build a verbal moodboard from **sources outside apps** (architecture, packaging, magazines, film, nature) to avoid generic Dribbble-looking results.

Pick **2–3 core principles** that must be kept. Everything else may change to fit the product.

## 3. Signature move

Propose **exactly one** memorable element (a distinctive card shape, a way of displaying data, a unique transition, a typographic detail…). Keep everything around it restrained so it stands out.

## 4. Three design directions

Present 3 directions. Each includes: name, 3 feeling words, principles kept, signature move, palette (hex + role), font pairing, radius/spacing, risks.

- **Safe** — close to platform standards (HIG), light touch of style
- **Balanced** — the default recommendation
- **Bold** — pushes the style to its limit, with trade-offs stated

**Approval gate:** stop and let the user pick a direction (or a mix). If running unattended with no reviewer, choose Balanced and say so.

## 5. Systematize into tokens

Before drawing any screen, define:

- **Color:** primitive → semantic (`bg/base`, `bg/surface`, `text/primary`, `text/secondary`, `accent`, `border`, `state/success|warning|error`), with Light + Dark modes
- **Typography:** 6–8 text styles (Display, Title, Headline, Body, Callout, Caption…), supporting Dynamic Type
- **Spacing:** a scale (e.g. 4/8/12/16/24/32/48)
- **Radius, elevation/blur, motion** (duration + easing)
- **Core components:** button (primary/secondary/ghost), card, list row, input, tab bar, nav bar — each with default/pressed/disabled states

The style must live in the tokens, not in hand-applied decoration.

## 6. Build screens — hard first, pretty last

Order:
1. A **dense** screen (long list / data-heavy dashboard)
2. A **form**
3. **Empty state** and **error state**
4. Hero / home screen
5. Splash + onboarding (if in scope)

A style that only works on the hero screen is a broken style — if steps 1–3 break, go back and adjust the tokens.

Mobile standards: 393×852 frame (iPhone) unless specified otherwise; respect safe areas; touch targets ≥ 44pt; primary content within thumb reach; follow iOS patterns (navigation, tab bar, sheets) unless there is a clear reason to break them.

## 7. First-impression check (self-review every screen)

- [ ] **One primary focal point** — the eye knows where to look immediately
- [ ] **Squint test** — hierarchy remains clear when blurred
- [ ] **5-second test** — purpose of the screen is understood in 5 seconds
- [ ] **Thumbnail test** — layout holds up when scaled down
- [ ] Still evokes the **3 feeling words**
- [ ] Text contrast ≥ 4.5:1 (large text ≥ 3:1); Dark mode works
- [ ] Signature move is present but not overused
- [ ] No effect (glass, gradient, shadow) used just "for style"

## 8. Output

**If a Figma tool (MCP/plugin) is available:** create Variables (with Light/Dark modes), Text Styles, and Components with variants using Auto Layout, then build screen frames using those tokens/components — never hard-code colors or font sizes. Name layers clearly.

**If Figma is not available:** output a Markdown spec file plus a mockup (HTML or SwiftUI preview).

The spec file contains:
1. Assumptions & brief
2. The 3 feeling words
3. DNA table + principles kept
4. Signature move
5. Chosen direction + rationale
6. Full token set
7. Screen list + design notes
8. Results of the step 7 checklist

When used inside a spec workflow, save under `spec/` and assign traceable IDs (e.g. `STY-01` for the style direction, `TOK-xx` for tokens, `SCR-xx` for screens).

## Pitfalls to avoid

- Copying the reference image verbatim (layout, content, logos, illustrations)
- Applying the style everywhere instead of using accents
- Sacrificing readability or tap targets for aesthetics
- Designing only the hero screen
- Creating tokens after drawing screens
