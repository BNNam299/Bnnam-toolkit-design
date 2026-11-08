# Job — measure the reference style, map it to tokens

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/style-read.md @ 3c0e291 — translated, complete

Runs **in parallel** with the wireframe — style doesn't change the component list, but it does change how things are built.

## Contents
1. When to use
2. Inputs and outputs
3. Style is separate from structure — but not completely
4. Style sources are not competitor sources
5. Two modes — detected automatically
6. Measure, don't feel
7. Palette for backgrounds
8. Component signatures — style is more than tokens
9. Existing atoms vs the reference style (mode 2)
10. Cut-out parts — a reusable reference set
11. Write `style.md`
12. Write to Figma — only after approval
13. Adaptive projects (iOS 27 · iPhone Duo · iPad)
14. Stop points, self-check, report, knowledge

---

## 1. When to use

- There are style images (moodboard, Dribbble, apps from other domains) — they need measuring and turning into tokens.
- The project has no design system yet — it needs its first token set.
- The project already has a design system — check whether it can carry this set of screens.
- Applying a new style to an existing system.

**Never** use competitor images as a source of structure here (that's competitor analysis, `../prd-to-ux-flow/references/analyze.md`).
**Never** write straight into variable collections before approval.

## 2. Inputs and outputs

No approved `design/` file is needed first.

| Check | If missing |
|---|---|
| images in `design/sources/style/` | ask the user; suggest the folder split in §4 |
| the project's token setup is known | run `scripts/detect.js` — need to know mode 1 or 2 |

| Reads | Writes |
|---|---|
| images in `sources/style/` · project settings · variables, styles and atom components in Figma (read only — `scripts/inspect.js`) | `design/style.md` (`status: draft`) · `design/style-parts/` + `index.md` (§10) · **after approval**: variables, text styles in Figma |

## 3. Style is separate from structure — but not completely

Style **doesn't change the component list** — if the app has `Meal Card`, `Macro Ring`, `Tab bar`, a minimal or a vivid style still has
the same pieces. But style **does change how things are built**, at the level of variants and detailed layout:

| Style | Effect |
|---|---|
| Liquid Glass | floating tab bar instead of one pinned to the bottom · needs a blurred backdrop behind it |
| No borders, no shadows | surfaces separate by fill only → check surface contrast ~1.2 |
| Card-heavy / flat lists | content grouped in cards vs only rows |
| Airy / dense | the same screen shows very different numbers of items |

Record these effects in `style.md` — the component spec reads it, not only the wireframe.

## 4. Style sources are not competitor sources

| Source | Used for |
|---|---|
| Competitor images | **structure** — competitor analysis |
| Style images | **style** — from outside the category: moodboard, Dribbble, apps in other domains |

**Borrowing a competitor's style erases your difference.** Evidence: Carbina measured three competitors' hues `229° · 214° · 142°` and
chose `205°` to be **different** from all three. If competitor images must serve as a style reference → measure them to **avoid**, not to
copy.

**Moodboard folders:**
```
design/sources/style/
  mau-sac/          colors
  kieu-chu/         typefaces
  man-hinh-hay/     screens we like
  thanh-phan/       components we like
  khong-thich/      what we do NOT want to look like
```
`khong-thich/` produces the `## Avoid` section of `style.md` — knowing what you don't want matters as much as knowing what you want.

Style images are **read visually only** — the same trap as competitor images (`../prd-to-ux-flow/references/analyze.md` §7).

## 5. Two modes — detected automatically

`scripts/detect.js` reports whether a collection for design (`mapped`) and text styles exist.

| Situation | What to do |
|---|---|
| **Mode 1 — no design system yet** | generate the first token set: color, type scale, radius, spacing, depth. **Letter spacing = size × 2.5 %** when generating a new type scale (`../mobile-ui-master/references/layout-spacing.md` §12). Scales: `tokens.md` §2 |
| **Mode 2 — a design system exists** | map the style onto existing tokens · only **propose** additions · never overwrite. The job changes from *choosing a style* to **checking whether the system can carry this set of screens** — the outcome is *use as is / extend / break the rule where* |

In mode 2, every style value falls into one of three branches:
- **matches an existing token** → `USE` that token
- **needs a value the system lacks** → `PROPOSE` a new token, waiting for approval
- **violates contrast** → `REPORT`, don't apply

## 6. Measure, don't feel

| Property | Measure |
|---|---|
| Color | dominant colors with hex · share of area · hue · contrast of each pair |
| Type | serif or sans · weight contrast · size ratios |
| Shape | estimated corner radius in px · stroke |
| Spacing | density — estimated padding and gap |
| Depth | shadow · border · or fill only |
| Icons | outline or filled · stroke weight |
| Illustration | flat · 3D · photo |

Contrast uses the WCAG formula — the same function and thresholds as the screen audit (`../ux-review-handoff/scripts/audit.js`): text per
`../mobile-ux-fundamentals/references/accessibility.md` · **surface vs background ~1.2**. Measuring tool for screenshots:
`../bnnam-standards/scripts/clone_measure.py`.

## 7. Palette for backgrounds

The designer sends a palette and asks for a background → measure 4–6 main colors as in §6, then switch to `../screen-background/SKILL.md`
(roles for base / shapes / overlay, four versions to choose from). The result is recorded in `style.md` › *Background build*.

## 8. Component signatures — style is more than tokens

Tokens carry **values** (color, radius, spacing). But whether a new component looks "like the reference" depends on **how** those values
are combined on each kind of component. Measure from the reference images and record per **component family** — button, input, card,
chip, tab bar, list, toggle…:

| Property | Example values |
|---|---|
| shape | pill · medium radius (~12) · square |
| fill | solid · light tint · outline only · transparent / glass |
| border | none · thin 1 · heavy |
| shadow | none · soft, wide · hard, tight |
| height, padding | button 52, horizontal padding 24 · input 48 |
| text | size, weight, capitalisation |
| icon | outline / filled · weight · with or without an icon |
| states | pressed darkens / shrinks · disabled faded / grey |

Each family records its **source image** (`sources/style/<file>`) so the component spec and visual checks reopen the right image. A
family absent from the reference images → write *"not in ref"*; don't infer.

## 9. Existing atoms vs the reference style (mode 2)

If the file already has atoms → read their signatures with `scripts/inspect.js` (read only) and compare each family with §8. Each family
falls into one of three:
- **matches** — record `MATCH`
- **differs, but tokens can handle it** (changing a color variable is enough) → the token branch of §5
- **differs in shape** (radius 8 vs pill, shadow vs flat, outline vs solid) → record under `## Atoms off-style` and **ask the
  designer**:

```
Button/Primary currently has radius 8 and a 12 drop shadow. The ref (sources/style/thich/app-x.png) is a pill, flat.
  a1) refine the main component to match the ref — I write the exact proposal, YOU edit the main component
  a2) refine the main component to match the ref — I edit it per the proposal, with a dry run for you to see first
  b) keep the main component — new components in this family follow the MAIN COMPONENT (consistent system)
  c) keep the main component — new components follow the REF (accept inconsistency in the system, log a decision)
```

Proposals are always written as **measurable changes in the system's variables**: `radius 8 → alias/border-radius/full` ·
`shadow 12 → none` · `horizontal padding 16 → spacing/24`. If the system lacks the needed variable → propose the new token first (token
branch §5), never a raw number.

- **a1 — the designer edits:** the designer follows the proposal and says *"done"* → the agent re-reads with `scripts/inspect.js` and
  confirms the match.
- **a2 — the agent edits on the designer's order** (exception 2 of `../bnnam-standards/references/team-rules.md` §12.4):
  `scripts/restyle.js` dry run → report before → after, instance count, screens that will change → the designer says *"run it for
  real"* → change → audit those screens, check text overflow and broken layouts caused by the new sizes → log a decision.
- **b, c** → record in `style.md` and the decision log — the component spec reads it from there.

The agent **never edits on its own** before the designer chooses a2. The designer can switch between a1 and a2 at any time — depending on
whether they have time.

Ask **per component family**, at most three families per round, most-used family first.

## 10. Cut-out parts — a reusable reference set

Designer rule: *"first learn the overall style and capture each part that makes up each kind of screen, keep them as references for
components; when creating, generate a same-style component system from those captured parts, and know which components to make".*

The §8 signatures record **measurements** per family, but the eye needs to **see** the right part when building a new block. Every part in
a reference image is cut out separately, saved once, and reopened in later sessions — never re-captured, never re-read from the whole image
(the same spirit as *keep knowledge stored, don't fetch it again*).

1. **Source** — images in `design/sources/style/` (especially `man-hinh-hay/`, `thanh-phan/`) · images inside Figma → the designer sends a
   section link → `export_assets` the frames (3x) to `design/style-parts/_src/<section name>/`. **Never write into `sources/`**
   (`../bnnam-standards/references/team-rules.md` §8).
2. **Measure** — `clone_measure.py prep <image> --pt-width <screen width of the image> --out design/style-parts/_work --name <source>` →
   read the 8pt grid, block edges, color table.
3. **Cut** — one image per part: `clone_measure.py crop design/style-parts/_work/<source> X Y W H --out
   design/style-parts/<family>/<source>-<n>.png` (units in pt, original resolution kept, 4pt padding). Several states of one family
   (selected / unselected, primary / secondary) → one image per state. Families are named per
   `../bnnam-standards/references/naming.md` — button, input, card, chip, tab bar, top bar, list row, toggle, badge, sheet, empty
   state, illustration, icon…
4. **Index** `design/style-parts/index.md` — one line per image:
   `image · family · role (e.g. plan card) · state · source screen type (e.g. home, paywall) · source image · notes` · the signature
   measurements go in `style.md › Component signatures`, each family pointing at its cut-outs (field `cut-outs`).
5. **Proposed components** — from the index → `style.md › Proposed components`: family · variants / states · properties · reference
   cut-outs · reuse an existing atom (§9) or build new · the designer approves **together with "approve style"**. Components are built
   **when the first screen is locked** (the template screen — `../figma-project-maintain/references/processes.md` §1 rule 3); later
   screens use instances when the role matches.
6. **Maintenance — mode 2** (`../figma-project-maintain/references/processes.md` §3, designer rule): still cut parts from the ref to
   follow **function and composition**, but record signatures **in the existing system's tokens, text styles and components**
   (`cut-outs` → `built with: <token / component>`); never take the ref's colors, radii or type. Where the ref differs from the system →
   write *"ref differs from system: …"* and follow the system.
7. **Once per project / per style direction** — later sessions read `index.md` and open only the images of the family needed · the
   designer adds ref images → cut more, update `based_on` · a family absent from the refs → *"not in ref"*, don't infer.

## 11. Write `style.md`

Template: `../assets/style.template.md`. Every item carries a **decision**:
`USE` · `PROPOSE → AWAITING APPROVAL` · `REPORT`. Rejected styles are recorded too, with the reason — like rejected competitor patterns.

Sections the rest of the skill set reads: tokens with decisions · *Effects on building* (§3) · *Avoid* (§4) · *Component signatures*
(§8) · *Atoms off-style* with the designer's a1 / a2 / b / c choice (§9) · *Proposed components* (§10) · *Background build* (§7) · *Raw
values in the visual area* (`system-binding.md` §6.5).

## 12. Write to Figma — only after approval

**Never write straight into variable collections.** Proposals live in `style.md`. The user says *"approve style"* (*"duyệt style"*) → only
then write to Figma, in the order **primitive → alias → mapped**. This touches layer 1 (`../bnnam-standards/references/team-rules.md`
§2). Tools: the tool demo's `create_variables` / `import_tokens` / `create_styles` (`../figma-agent-tools/SKILL.md`) — primitives with
empty scopes, semantic variables with role scopes (`system-binding.md` §3). Afterwards refresh the project's token setup with
`scripts/detect.js`.

---

## 13. Adaptive projects (iOS 27 · iPhone Duo · iPad)

Targeting iOS 27: the brand lives in the **content layer**; the UI layer (toolbar, tab bar, menus, floating controls) follows the system,
using Liquid Glass · tint / accent with purpose · Dark Mode is a complete expression of the brand · the logo isn't repeated on every
screen (`../iphone-duo-adaptive/references/duo-ios27-visual.md` §2–3). iOS 27 system colors and type are measured in
`../apple-design-iphone/references/ios27-figma-kit.md` §4–5 — compare the ref with them before proposing new tokens.

## 14. Stop points, self-check, report, knowledge

**Stop and ask:** new tokens — propose, wait for approval (§5) · atoms off-style — ask the designer per family (§9) · approve style before
writing to Figma (§12) · the *Proposed components* list from the cut-outs — approved together with *approve style* (§10).

**Self-check:**
- measured, not felt — WCAG contrast formula, same thresholds as the screen audit (§6)
- every family under *Component signatures* has cut-outs or says *"not in ref"* · every image in `design/style-parts/` has a line in
  `index.md` · no image written into `sources/` (§10)

**Report** (team format — `../bnnam-standards/references/team-rules.md` §9), plus: mode · counts of USE / PROPOSE / REPORT · contrast
pairs below threshold · number of families with a signature · **number of off-style atoms waiting for the designer's a / b / c** · cut-outs
per family · number of proposed components.

```
Next step
  → "approve style"
  → "go to components"              when the wireframe is approved too
```

Knowledge: `../mobile-ui-master/references/visual-foundations.md` (type, color, iconography) ·
`../mobile-ux-fundamentals/references/states-feedback-motion.md` · `tokens.md` · `../mobile-ui-master/references/layout-spacing.md` ·
`../apple-hig/SKILL.md` + `../material-design-3/SKILL.md` — consult both. Adaptive projects: `../iphone-duo-adaptive/SKILL.md` ·
`../apple-design-iphone/references/ios27-figma-kit.md`.
