---
name: figma-prototype-flow
description: Builds a click-through prototype flow in Figma so the designer can decide between options by tapping through them, not by looking at static screens - copies the flow's screens into their own "Flow — <name>" section (the originals are never linked or touched), names the copies "<Flow> Flow_Step <n>", wires the links on the copies (navigate, overlay, back, after-timeout), sets the flow starting point in a separate call, and later checks which copies went stale after the source screens changed. One flow per option when comparing options. Use when the user says "let me click through it", "wire this flow", "make a prototype of the … flow", "build a flow to test", or when two options are still tied and only walking the flow can decide. Vietnamese triggers such as "cho tôi bấm thử", "nối flow", "làm prototype luồng", "dựng flow để test", "so hai phương án bằng bấm thử". For prototyping the final screens (interactive components, variables, Smart Animate) use figma-ui-flow Stage 6.
---

# figma-prototype-flow — click through it before deciding

The designer decides between options by **tapping through** them, not only by looking at static screens. This skill builds a
prototype flow on **copies** of the screens, in a section of its own — the source screens are never linked and never touched.

Not for wiring the final prototype of the official screens: on the designer's projects the designer wires those after the design is
finished (`figma-ui-flow` Stage 6, `../figma-ui-flow/references/creative-process.md` §7–8). The flow here exists to be tried.

Let `SKILL_DIR` be the directory containing this file.

## Need → Read
| Need | Read |
|---|---|
| Build, start, check a click-through flow | `scripts/prototype.js` (this file explains it below) |
| The flow's screen order and where each tap leads | the project's `design/flows.md` (`leads to`), or ask the designer — `../prd-to-ux-flow/references/ux-flow.md` |
| Find the right layer to tap on each screen | `../mobile-ui-master/references/reading-screens.md` |
| Screen names | `../bnnam-standards/references/naming.md` |
| Choosing a transition, sheets vs dialogs, navigation patterns | `../mobile-ux-fundamentals/references/interaction-patterns.md` |
| What a prototype should answer (fidelity by question) | `../prd-to-ux-flow/references/structure.md` §7.10 |
| Presenting two options and brainstorming with the designer | `../bnnam-standards/references/team-rules.md` §13 |
| Adaptive projects (iPhone Duo, iPad) | `../iphone-duo-adaptive/SKILL.md` and §Adaptive below |
| Tool mechanics of `execute_code` | `../figma-agent-tools/SKILL.md` |

## When to use
- The designer says *"let me click through it"*, *"wire the flow"*, *"make a prototype of the … flow"*, *"build a flow to test"*
  (*"cho tôi bấm thử"*, *"nối flow"*, *"làm prototype luồng …"*, *"dựng flow để test"*).
- A brainstorm has two equal options and only the feel of walking the flow can decide — **propose** a flow; never build one unasked.
- A source screen changed after the flow was built → check for stale copies and rebuild.

## Before you start
| Check | If missing |
|---|---|
| The flow's screens exist in Figma (the original, a `_Fix AI` copy or a `_Variant`) | build the screens first (`figma-ui-flow`, or `figma-project-maintain` on an existing project) |
| The screen order and every tap are known — from `flows.md` (`leads to`) or from the designer | ask: *"what do you tap to go to which screen?"* |

Reads: `flows.md` · the screens in Figma. Writes, in Figma: section `Flow — <flow name>` · copies `<Flow name> Flow_Step <n>` · links ·
the flow starting point. In the project: `flows.md` › the flow's *click-through flow* field (the source of every copy).

## Running the script
`scripts/prototype.js` is Figma Plugin API code. Read it, set `CONFIG` at the top, then send **the whole file** as `code` to
`execute_code` (pass `timeoutMs` up to ~120000 for long flows). `CONFIG`:

| Key | Meaning |
|---|---|
| `MODE` | `"build"` · `"start"` · `"check"` (read only) |
| `DRY_RUN` | `true` (default) — `build` only reports the plan |
| `PAGE` | the page holding the source screens; the flow section goes on the same page |
| `FLOW` | flow name, e.g. `"Quick checkout"` |
| `STEPS` | source screen names in walking order |
| `LINKS` | `{ from, layer, to, nav, trigger, timeout }` — `from` / `to` are source screen names, `layer` is the layer name (or `"Parent/Child"`) inside `from`, `to: "BACK"` goes back, `nav`: `"NAVIGATE"` (default) or `"OVERLAY"`, `trigger`: `"ON_CLICK"` (default) or `"AFTER_TIMEOUT"` + `timeout` |
| `GAP`, `OWNER_KEY` | spacing; the shared plugin-data namespace (leave as is) |

## Steps
1. **Lock the chain:** the screens in walking order, and for each link: which screen · which layer is tapped · which screen it goes to ·
   the kind — `NAVIGATE` to another screen, `OVERLAY` for sheets and dialogs, `BACK` to return. Read each screen to find the right tap
   layer.
2. **Dry run** — `MODE: "build"`, `DRY_RUN: true`: it reports the section, the copy names and which links can be wired. A link that
   points to a screen outside the chain (`✗ screen not in STEPS`) → fix the chain first.
3. **Build for real** once the designer agrees — `DRY_RUN: false`:
   - a separate section **`Flow — <flow name>`** on empty canvas, with a title frame copied from the style of the existing sections — it
     never overlaps another section (the script pushes it right until the canvas is clear);
   - a **copy** of each screen named **`<Flow name> Flow_Step <n>`** (designer convention) — a safe clone: main components inside a
     screen become instances;
   - **links** wired on the copies — `ON_CLICK` (default) or `AFTER_TIMEOUT` (waiting screens, success screens that move on by
     themselves; check the `timeout` unit in Figma's Prototype panel);
   - a layer that cannot be found → it is listed under `notLinked`; report it, never guess.
4. **Set the starting point** — `MODE: "start"` in a **separate call** after `build`. Setting it in the same call that creates the
   nodes fails with *duplicate input nodeIds*.
5. **Record the source of every copy** — the `copySource` list — in `flows.md` › the flow › *click-through flow*.
6. **Tell the designer how to try it:** Figma › Present (▶) › pick flow `<flow name>`.
7. **One flow per option** when comparing options — `Flow — Option C`, `Flow — Option D` — with every state of the part that changes
   (On **and** Off), so the designer compares them completely.

## Adaptive projects — what the prototype must show
Compact ↔ expanded · fold inactive ↔ active · toolbar horizontal ↔ vertical · overlay ↔ side by side · continuous focus and keyboard ·
overflow appearing when the height shrinks · **open a sheet / menu first, then change posture** · animations that can reverse half-way.
Each frame variant is one step in the flow; a link between variants of the same screen is a posture change, not navigation.

## Stale copies
Copies do not follow their source screen. Each copy remembers its source screen and the source's **fingerprint** at copy time (layer
names, sizes, text, fills, layout). `MODE: "check"` (read only) reports which copies are `stale` and which sources were deleted
(`sourceMissing`). Run `check`:
- at the start of a session when a click-through flow is still open;
- after editing a source screen that belongs to a flow;
- before the designer tries the flow.

Stale copies → report them and propose a rebuild (`build` with the same `FLOW` — the old section is replaced, its position kept).
Never rebuild on your own.

## Clean-up
When the designer settles on an option → ask *"delete the click-through flows?"*. Flows are not project screens: audits and progress
counts skip the flow copies.

## Report
```
Flow "Quick checkout" — 4 screens · 5 links · 1 not wired
  not wired: Checkout-Payment_Result › Apple Pay — layer not found
Try it: Figma › Present (▶) › pick flow "Quick checkout"

Next steps
  → "the Apple Pay layer is Methods/Apple Pay"   wire the last link
  → "build a flow for Option D"                  to compare the two options
```
Always include: flow name · number of screens · links wired / not wired (with the reason) · how to try it.

## Common pitfalls
- Linking the source screens instead of copies — the designer's file gets prototype noodles nobody asked for.
- Setting the starting point in the same call as `build` (*duplicate input nodeIds*).
- Guessing a tap layer when the name is not found.
- Comparing options with only the "On" state built.
- Letting the designer try a flow whose copies are stale.
- Rebuilding a flow under a name whose section was not created by the agent — the script stops; rename `FLOW`.

## Self-check before reporting
- Dry run reviewed, every link inside the chain.
- Section on empty canvas, copies named `<Flow> Flow_Step <n>`, starting point set in its own call.
- `copySource` written to `flows.md`; `notLinked` reported with reasons.
- `check` shows no stale copies before handing over.
