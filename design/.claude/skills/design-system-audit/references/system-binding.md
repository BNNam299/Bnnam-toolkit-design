# Always use the file's system

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/system-binding.md @ 3c0e291 — translated, complete

When building UI, **every property that has a matching entry in the file's system must use that entry**. Never hard-code a value the
system already has. This is the **System** gate (`../bnnam-standards/references/team-rules.md` §4).

**Why:** an agent optimises for *"finish this screen"* instead of *"keep the system consistent"*. One component adds one stray value;
after ten components the system is rubbish. Evidence: **889 raw frames vs 59 instances**; a wrong status bar height spread to 23 screens.

## Contents
1. Properties and their required source
2. Apply only what the system really has
3. Bind to the right place
4. No match → report; never force, never invent
5. Responsive
6. Two build zones: system UI and free visuals
6b. Screen background — the `Background/*` component
7. Acceptance — the nine counts

---

## 1. Properties and their required source

| Property | Required source | How to assign |
|---|---|---|
| Fill · stroke color | color variable (the collection meant for design — the project's bind target) — or a color style if the file uses styles | `setBoundVariableForPaint` · by role (§3) |
| Text | text style | `setTextStyleIdAsync` · exact `size/weight` match (§3) |
| Padding · gap | spacing variable | `setBoundVariable("paddingLeft" / "itemSpacing" …)` |
| Corner radius | radius variable | `setBoundVariable("topLeftRadius" …)` — bind **all four corners** |
| Stroke weight | border-width variable | `setBoundVariable("strokeWeight")` |
| Fixed sizes — button height, tap target, tab bar | sizing variable | `setBoundVariable("height" / "width")` |
| Shadow · blur | effect style | `setEffectStyleIdAsync` |
| Layout grid | grid style | `setGridStyleIdAsync` |

**Priority:** variable → style → **report**. Never hard-code when either exists.

A component with a new structure follows the same rule: **"same style" = existing tokens only** — never invent a color, font size,
radius, spacing or stroke weight.

The tool demo's `bind_variables` tool (`../figma-agent-tools/SKILL.md`) binds fills, strokes, gap / padding and radius under a root;
`scripts/bind.js` covers the same plus text styles, stroke weight and the pool split of §3 — see `SKILL.md` › Bind.

## 2. Apply only what the system really has

`scripts/detect.js` answers: does the file have spacing variables? radius? border width? sizing? effect styles? grid styles? Record the
result in the project settings (`none` when absent). If something is absent, **don't make it up** — apply only what exists.

**Variables must have a value in every mode before binding.**
Evidence: a `Responsive` collection once had 38 variables with both iPhone / iPad modes, but **no variable had a value** — binding to it
meant switching modes changed nothing. In that case: report, don't bind (`detect.js` flags it).

## 3. Bind to the right place

- **Bind only to the collection meant for design** (the bind target, usually `mapped`). Binding straight to a primitive **breaks
  theming**.
- **Primitives carry no role — empty scopes** (designer rule): primitives only hold raw values and never appear in the pickers while
  designing; the semantic tier (alias / mapped) points at primitives and sets scopes by role — background `FRAME_FILL` `SHAPE_FILL` ·
  text `TEXT_FILL` · stroke `STROKE_COLOR` · spacing `GAP` · radius `CORNER_RADIUS`. Audit: `scripts/system-audit.js` ›
  `primitiveWithScopes`, `scopeRoleMismatch` (`tokens.md` §2.1).
- **By role:** text → `content/*` · background → `surface/*` · border → `border/*` (the real prefixes come from the project's color
  prefix setting).
- **Nearest-RGB matching is only for fixing legacy work**, never when creating. When fixing legacy, **split the pools** so text never
  binds to a surface token:
  ```js
  if (isText  && !v.name.startsWith("content/")) continue;
  if (!isText &&  v.name.startsWith("content/")) continue;
  ```
- **Text styles keyed by `size/weight`, exact match:**
  ```js
  const TS = {};
  for (const st of await figma.getLocalTextStylesAsync())
    TS[`${Math.round(st.fontSize)}/${st.fontName.style}`] = st;
  ```
  No match → **report**, grouped by `size/weight` with counts. A size far off the scale is usually hand-drawn text — fix it at the root.
- **Icon glyphs never get a text style** — their color is still bound.

`scripts/bind.js` does exactly these steps for bulk fixes.

## 4. No match → report; never force, never invent

The value you need isn't in the system — e.g. padding 18 when the scale has 16 and 20:
- **Don't hard-code 18.**
- **Don't create an 18 variable yourself.**
- Pick the nearest value **only when** the project sets `onMismatch = snap-nearest`.
- **The default is `report`, for every property type.** The user deliberately adds variables and text styles to cover every case — so an
  off-system value is a **real gap in the system**, to be reported and filled, not a place for the agent to improvise.
- Report **grouped by value with counts**; new token proposals go through the style approval gate (`style-read.md` §3, §6).

**If a project chooses `snap-nearest` for text, size must outweigh weight:**
```js
const score = Math.abs(c.size - size) * 10 + Math.abs(rank[c.weight] - rank[weight]);
```
Evidence: one pass forcing `34→32`, `23→24`, `18→16` shifted layouts on already-approved screens.

### Exceptions — exactly these, no further inference

| Case | Allowed |
|---|---|
| Placeholder waiting for an image | raw fill, **labelled** in the layer name (`image · …`) |
| Icon glyph | no text style — color must still be bound |
| Screen root frame size | from the project settings — no binding needed |
| Wireframe | the **wireframe kit's** tokens if it has them; otherwise raw grey is allowed — wireframes are throwaway |
| Mask, matte | leave as is — not visible |
| **Visual area `visual_…`** | plain frame, free positions; only color should use tokens — §6 |

## 5. Responsive

This skill set has **no separate part** for responsive or size classes.
- The user builds the responsive structure in Figma as **variables and modes** — e.g. a collection with modes `iPhone` / `iPad`,
  variables `spacing/*`, `sizing/*`, `layout/*`.
- They are applied **like any other variable** under this file, when the user asks.
- Never add size-class suffixes to screen names, never build frames for other sizes on your own.
- **Wireframes are built for the phone (compact) only.** No iPad or landscape wireframes.

(Adaptive projects — iPhone Duo, iPad — have their own rules: `../iphone-duo-adaptive/SKILL.md`.)

---

## 6. Two build zones: system UI and free visuals

A screen usually has **two kinds of zones**, built by two different rules. The most common build error comes from **applying one zone's
rule to the other**.

| | **System UI zone** | **Free visual zone** |
|---|---|---|
| What | lists, cards, buttons, forms, nav, text — the part consistent across the app | gradients, illustrations, decorative vectors, background images, hero art |
| Frame | **auto layout** | **plain frame** — `layoutMode = NONE` |
| Child position | follows the auto-layout flow | **free, absolute coordinates** |
| Variables, modes, text styles | **required** under this file | only **color** should use tokens where it fits; spacing, radius, size **need not** be bound |
| Audit | full scan, §7 | **skipped** — scanning gives false alarms |

### 6.1 The boundary: graphics vs text on graphics
A visual zone holds **graphic layers only**. Text and buttons placed **on top of** a gradient — the title *"Draw with Photo"* on an
orange background — **still belong to the UI zone**: text styles, color tokens, components as usual.

### 6.2 Marking
The frame name starts with **`visual`** — `visual_hero gradient`, `visual/onboarding-illustration`. Agents and the audit recognise a
visual zone by this prefix; never guess from its shape.

### 6.3 Placing a visual zone inside a UI block
**The only rule:** every graphic sits **inside a plain `visual_…` frame** — so it can be arranged freely within it.

Where the `visual_…` frame sits in the UI block is a **layout choice**, not a rule. Common arrangements, all correct:

**A block in the flow** — an illustration above the title and button:
```
Hero                          vertical auto layout
├─ visual/hero-illustration   plain frame · an ordinary auto-layout child
│    └─ vector, ellipse…      free coordinates inside
├─ Title                      text style · token
└─ Button                     instance
```

**A background behind the content** — a gradient covering the card, text and button on top:
```
Card                          auto layout
├─ visual/card-bg             plain frame · absolute · below the content
├─ Title
└─ Button
```
```js
bg.layoutPositioning = "ABSOLUTE";
bg.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };  // stays covering when the card resizes
card.insertChild(0, bg);
```

**A background cluster holding content** (`../bnnam-standards/references/frame-standards.md` §7) — a background area with a card
and a character on top:
```
visual_Header                 frame · vertical auto layout, bottom-aligned · background
├─ illustration_hero-mascot   absolute — overlapping figure
└─ Progress Card              in the flow
```

Choose by **design intent** — the graphic takes its own space, sits behind the content, or is the background **of** a content cluster.
Don't force every visual into a background, and don't separate content from the background it sits on.

**Inside** `visual_…`: set constraints per layer by intent — a corner-anchored decoration anchors to its corner; don't let `STRETCH`
distort proportions. Turn `clipsContent` on when the graphic deliberately overflows and needs trimming.

### 6.4 When the UI block changes size
Changing a card from fixed to `FILL`, changing breakpoint, changing mode — **the visual zone doesn't follow by itself**. Ellipses
stretch, gradients go off-centre, illustrations get cropped. After any resize of a block with a visual zone:
- **check by eye** (screenshot — `../figma-ui-flow/references/build-loop.md`) — no exceptions
- fix **inside** `visual_…` — move, scale proportionally — **never** convert the visual zone to auto layout "to tidy it" · exception: a
  **background cluster** that holds a content block uses auto layout for that block; the overlapping figure stays absolute

### 6.5 Color inside a visual zone
Brand and accent colors → tokens if the system has them. A gradient whose stops have no token may use raw values, **recorded in
`style.md`** (section *Raw values in the visual area*) so they can be added later. Never invent new tokens mid-build (§4).

---

## 6b. Screen background — the `Background/*` component

The full rules live in `../screen-background/references/technique.md` §2 (workflow: `../screen-background/SKILL.md`). In short:
- The background is a **separate component the same size as the frame it backs** (screen e.g. 402 × 874, card, Live Activity e.g.
  370 × 150) — `Background/<name>` or a `Background` set with variants; one component / variant per frame size.
- Frames use it as an **instance on the bottom layer** (index 0), same size, constraint STRETCH; a frame never draws its own gradient /
  image as background (the screen audit flags this).
- Change = add a variant or edit the main component; new variants are made **on a copy** in its own section and merged only after the
  designer confirms (impact check first). Never adjust per screen, never detach.
- Handoff: developers export the background as an image; Live Activity / widget: one solid color built in code.
- Inside: `layoutMode NONE`, clip, one base fill → shapes (bleeding past the edge) → optional overlay on top, the same size as the frame,
  STRETCH on 4 edges, white / black 10–20 % + background blur (Overlay · Layer · Combined), blur computed from the frame size.
- Color: shapes and gradient stops bind tokens when available; the overlay uses an alpha token. No token → raw values in the visual
  area, recorded in `style.md`. The inside is a visual zone — not counted in §7.
- System surfaces that cannot blur (Live Activity, Dynamic Island, widget): still a `Background/<name>` component the size of that
  surface, but **one solid color** from an alpha token — no shapes, no blur.

## 7. Acceptance — the nine counts

**Designer standard:** padding / gap on **layout frames inside a screen** (Content, section containers, rows) are left as **intentional
raw numbers** — they don't count toward the spacing count (the screen audit records them separately as intentional raw spacing).
**Inside components they must still be bound.**

The screen audit (`../ux-review-handoff/scripts/audit.js`) runs these counts on every node **outside visual zones**:

```js
const B = n => n.boundVariables || {};
const TAP = os === "android" ? 48 : 44;
// fill · text · spacing · radius · stroke · effect · opacity · group · tap
if (n.fills?.[0]?.type === "SOLID" && !n.fills[0].boundVariables?.color) raw.fill++;
if (n.type === "TEXT" && !n.textStyleId && !isGlyphIcon(n)) raw.text++;
if (n.layoutMode && n.layoutMode !== "NONE")
  for (const k of ["paddingTop","paddingRight","paddingBottom","paddingLeft","itemSpacing"])
    if (n[k] > 0 && !B(n)[k]) raw.spacing++;
if (typeof n.cornerRadius === "number" && n.cornerRadius > 0 && !B(n).topLeftRadius) raw.radius++;
if (n.strokes?.length && n.strokeWeight > 0 && !B(n).strokeWeight) raw.stroke++;
if (n.effects?.length && !n.effectStyleId) raw.effect++;
if (n.opacity < 1 && !(n.children?.length > 1 && /disable/i.test(n.name))) raw.opacity++;   // layer opacity only for a disabled composite
if (n.type === "GROUP") raw.group++;                                                       // frames instead of groups
if (n.reactions?.length && (n.width < TAP || n.height < TAP)) raw.tap++;                   // 44pt / 48dp
```

- Count only the types **the file has a system for** (§2).
- **All nine must reach 0**, except the §4 exceptions.
- **Report per type, never one combined number** — a total hides where the problem is.

Layer opacity rule: `../mobile-ui-master/references/layout-spacing.md` §10. The tap count is off by default in this team (touch area is
the developer's job — `../ux-review-handoff/SKILL.md` core rule 9).
