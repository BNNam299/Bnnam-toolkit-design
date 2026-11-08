---
status: draft
approved: —
from: style-read
based_on: sources/style/@<YYYY-MM-DD> · project settings@<YYYY-MM-DD>
by: claude-code
version: —                         # output version — "—" if none
level: —                           # light | standard | full — scale of the job done
---
# Style — <Project name>

<!-- How: references/style-read.md. Never write straight into variable collections: proposals live here and are written to Figma
     only after "approve style". -->

- mode: —                           # 1 — no design system yet | 2 — a design system exists — references/style-read.md §5

## Properties

### <Property name — e.g. Card radius>
- measured: —                       # e.g. ~20px · #1E2330 on #15181F
- contrast: —                       # WCAG ratio for colors; — when not applicable
- token: —                          # matching existing token, or "none"
- proposal: —                       # primitive/… → alias/… → mapped/…
- decision: USE                     # USE | PROPOSE → AWAITING APPROVAL | REPORT

## Component signatures

<!-- references/style-read.md §8 — how values combine per component family. The component spec reads this for new components. -->

### <Component family — e.g. Primary button>
- source image: —                   # sources/style/<file> | not in ref
- cut-outs: —                       # style-parts/<family>/<source>-<n>.png — references/style-read.md §10
- shape: —                          # pill | radius ~12 | square
- fill: —                           # solid | tint | outline only | glass
- border: —
- shadow: —
- height, padding: —
- text: —
- icon: —
- states: —                         # how pressed and disabled look

## Proposed components

<!-- references/style-read.md §10 — from the cut-outs in design/style-parts/index.md. Approved together with "approve style"; built
     when the first screen is locked. -->

### <Family — e.g. Plan card>
- variants / states: —             # e.g. Selected = on | off · Badge = none | popular
- properties: —                    # e.g. Title (text) · Subtitle (text) · Show badge (boolean)
- cut-outs: —                      # style-parts/plan-card/paywall-1.png, …
- origin: new                      # new | reuses atom <name> (§9)
- decision: PROPOSE → AWAITING APPROVAL

## Atoms off-style

<!-- references/style-read.md §9 — existing atoms whose shape differs from the ref. The agent does NOT edit the main component
     (bnnam-standards team-rules §12.4). -->

### <Atom name — e.g. Button/Primary>
- currently: —                      # from scripts/inspect.js: radius 8 · drop shadow 12 · solid fill
- ref: —                            # pill · flat · source image
- proposed refinement: —            # measurable change: radius 8 → pill · shadow 12 → none
- designer chose: WAITING           # WAITING | a1 — designer edits main | a2 — agent edits on order | b — keep main, new follow main | c — keep main, new follow ref
- refinement done: —                # <date> · who edited · DEC-### (when a1 or a2)

## Background build

<!-- screen-background skill — the background is a component, an instance on the screen's bottom layer -->

### Background/<name>
- palette: —                        # sources/style/<file> · base / shapes / overlay
- blur method: —                    # overlay | layer | combined
- blur: —                           # e.g. overlay 200 · shapes 120
- overlay: —                        # alpha token, e.g. alpha/black/20
- variants: —                       # Style=Dark · Style=Light
- raw colors: —                     # colors without a token

## Avoid

<!-- Generated from sources/style/khong-thich/ -->

### <What we don't want>
- source: sources/style/khong-thich/<file>
- recognised by: —

## Rejected

### <Rejected style>
- source: —
- reason: —

## Effects on building

<!-- The component spec reads this: floating vs pinned tab bar · cards vs flat rows · density -->

### <Aspect>
- choice: —
- reason: —

## Raw values in the visual area

<!-- Written during the UI build: values without a token used inside visual_… — to add to the system later
     (references/system-binding.md §6.5) -->

### <visual/area-name>_<Screen>
- value: —
- type: —                           # fill | radius | effect | …
