# Team naming convention — screens, components, reserved names

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/naming.md @ 3c0e291 — translated, complete

Applies to wireframe screens, UI screens, components, and screen headings in `design/flows.md`. Screen names are **born in `flows.md`** — everywhere else only reuses them, never invents new ones (`team-rules.md` §8.1). In the team's files this convention **replaces** the naming in `../figma-ui-flow/references/file-standards.md` §2 where they differ (§8 below).

## Contents
1. Semantic names, no codes
2. Structure of a screen name
3. Suffix table
4. Wireframe and UI share the name — 1:1 mapping
5. Order on the canvas
6. Component names — by domain, not by shape
7. Reserved names
8. Differences from figma-ui-flow (team files follow this file)
9. Self-check

---

## 1. Semantic names, no codes

Never `WF-014`, `SCR-006`. Use a **flow path** — reading the name tells you where the screen sits, no lookup table needed.
Codes `FR-###`, `UC-###`, `DEC-###` are still used — they come from the PRD and the decision log, they are not screen names.

## 2. Structure of a screen name

```
[Flow-path]_[State]_[Variant if any]
```
```
Add-Photo-Detail Meal_Result
Add-Photo-Detail Meal_Editing
Add-Photo-Detail Meal_Empty
Tracking-Calendar_Loading
IAP_Step 1
IAP_Step 1_Variant A
```

| Character | Meaning | Example |
|---|---|---|
| `-` | hierarchy inside the flow, **no spaces around it** | `Add-Photo-Detail Meal` |
| `_` | separates state and variant | `_Result`, `_Step 1_Variant A` |
| space | kept inside a multi-word name of one level | `Detail Meal`, `Log more`, `Step 1` |

- **No dots** (`.` `·`) and **no `/`** in frame names.
- No `-` or `_` **inside** one level — `Check-in` is written `Check in`, because `-` is the hierarchy separator and scripts split names on exactly these two characters.
- **Component** names still use `/` (`Button/Primary`, `Safe area/Top`) — Figma uses `/` to file components into folders; this convention applies only to **frames**.
- **Several screens on the same branch must differ by suffix. A duplicate name is a defect.**

Real example: the Calories AI file, page `5. UI Design`, uses `Add-Photo-Detail Meal`, `Add-Log more-Exercise-Custom` — good hierarchy, but **missing suffixes** to tell same-branch screens apart.

## 3. Suffix table

| Kind | Values |
|---|---|
| Data state | `Empty` · `Loading` · `Error` · `Result` |
| User state | `First run` · `Returning` · `Free` · `Premium` |
| Interaction variant | `Editing` · `Selected` · `Expanded` |
| Frame variant — adaptive projects | `Outer` · `Outer Landscape` · `Inner` · `Inner Landscape` · `Intermediate` · `Book` · `Tabletop` · `Tent` · `Split Left` · `Split Right` · `iPad` · `iPad Landscape` — see the `iphone-duo-adaptive` skill |
| Order in the flow | `Step 1` · `Step 2` |
| Extended states | `Draft` · `Offline` · `Partial` · `Logged out` · `Locked` · `Invalid` · `Success` · `Failed` · `Pending` · `Confirm` · `Update` · `Mastered` · `Recovering` · `Disconnected` · `Denied` · `Limit` |
| Visual option | `Variant A` · `Variant B` |

- Extended states come from the state scan and the two-axis state matrix of the UX-flow work (`prd-to-ux-flow` skill).
- **Suffixes come from the table, never abbreviated.** `IAP_1` → `IAP_Step 1`. `Daily Insight_fail` → `Daily Insight_Error`.
- **Project-specific suffixes:** the table is the default. A project needing more (`Disabled`, `Off`…) declares them in `design/project.yaml › naming.extraSuffixes`, and the audit then accepts them like standard suffixes. Adding a suffix is the **designer's** decision — the agent proposes, never declares it itself.
- **Automatic check** — `../ux-review-handoff/scripts/audit.js` checks every screen name (`screenName`) and reports a name that has: `.` `·` `/` · spaces around `-` or `_` · two separators in a row · a suffix not in the table (or in `extraSuffixes`).

## 4. Wireframe and UI share the name — 1:1 mapping

```
3. Wireframe                           5. UI Design
Add-Photo-Detail Meal_Result    →    Add-Photo-Detail Meal_Result
Add-Photo-Detail Meal_Empty     →    Add-Photo-Detail Meal_Empty
```
Same name, **different page**, so no confusion. Wireframes **also carry the state suffix** — that is when the number of states of a screen is decided.

**Why:**
- Comparing the two pages shows which wireframes haven't reached UI yet,
- and which UI screens **have no wireframe** — i.e. were built directly without layout approval.
- Mechanical handover: find the same name on the other page.
- Progress is counted by comparing names in `flows.md` with frame names — no separate file needed.

**UI produces a state the wireframe doesn't have** → add it to `flows.md` first, then the wireframe, then build the UI. Never build it directly in UI. The two pages always match.

## 5. Order on the canvas

Names carry no order, so **position left → right follows the flow**. Take the order from the flow's `sequence:` field in `flows.md`.

## 6. Component names — by domain, not by shape

```
✓  Meal Card · Macro Ring · Photo Scan Frame
✗  Card Large 3 · Circle 2
```
**States are variants**, never part of the component name.
An existing system with its own naming convention (e.g. `Button/Primary/Default`) → record it in `project.yaml` (`components.namingConvention`) and use exactly those names (component spec work, `design-system-audit` skill).

## 7. Reserved names

The agent and the audit recognise these **by name**, never by guessing from shape. Don't use these names for anything else.

| Name | What it is | Rule lives in |
|---|---|---|
| `— section label` | title block at the top of a section (like `Icon · 14591×112`) — filtered out when inventorying screens | this file |
| `— fold` | fold line at device height when a frame is extended to illustrate scrolling | wireframe work (`frame-standards.md`) |
| `visual_…` | frame for a free visual area: `visual_hero gradient` | `../design-system-audit/references/system-binding.md` §6 (two build zones: system UI vs free visual) |
| `Wireframe/…` | prefix of wireframe-kit components: `Wireframe/Button`, `Wireframe/List Row` | wireframe work |
| `Dev Note` | developer handoff note component — deliberately unlike any UI element name | `ux-review-handoff` skill |
| `<screen name>_Fix` | copy the **designer** duplicated to edit — `project.yaml › collab.editSuffix` · temporary | `team-rules.md` §12.3, §12.5 |
| `<screen name>_Fix AI` | copy the **agent** built for the designer to compare — `project.yaml › collab.agentSuffix` · temporary | `team-rules.md` §12.1 |
| `<screen name>_Variant A` | brainstorm draft — chosen → goes into `flows.md`, rejected → deleted | `team-rules.md` §13 |
| `<Flow name> Flow_Step <n>` · section `Flow — <flow name>` | copies inside a tap-through prototype flow — the designer's convention; not project screens | `figma-prototype-flow` skill |
| `Background/<name>` · set `Background` (`Style=…`) | background component — same size as the frame it backs (screen, card, Live Activity), instance in the bottom-most layer | `screen-background` skill |
| section `Background — <name>` · `Fix AI — …` | the agent's own sections — with a number + name title frame | `team-rules.md` §12.2 |
| `image_<description>` | name of an image placeholder frame: `image_ảnh xe từ bên hông` ("photo of the car from the side") | `../ux-writing/references/principles.md` (placeholder images) |
| `icon_<symbol name>` | name of an icon glyph layer: `icon_chevron right` — never leave the raw glyph character as the name; dots in the symbol name become spaces | `lock-phase.md` §6 (icon rules) |

- **Locking a fixed copy** → the surviving copy gets its **official name per this convention**, even when the original screen in a maintenance project was named differently (`team-rules.md` §12.1).
- **No frame keeps a default name** (`Frame 123456`) — the audit counts them.
- **Why `Wireframe/` and not `WF/`:** `WF` clashes with the page name and with old-style screen codes like `WF-014`.
- **Why `Dev Note` and not `Note`:** the Calories AI file has **a real UI card also called `Note`** — an encouraging message in a screen's `Content`. Counting developer notes by the name `Note` would count it too.

## 8. Differences from figma-ui-flow (team files follow this file)

`../figma-ui-flow/references/file-standards.md` §1–2 describes a generic file. In the team's files the team convention applies:

| Topic | figma-ui-flow | Team standard |
|---|---|---|
| Screen frame name | `[Flow] / [Screen] / [State]`, e.g. `Checkout / Payment / Error – card declined` | `[Flow-path]_[State]_[Variant]`, e.g. `Checkout-Payment_Error`; **no `/`, no `.`, no spaces around separators**; state from the suffix table, details go to `flows.md`, not the name |
| Platform suffix | `… / iOS`, `… / Android` | one layout for both platforms (`team-rules.md` §10.2) — no platform suffix; frame-variant suffixes only for adaptive frames (`_iPad`, `_Outer`…) |
| Region layer names | `header`, `content`, `footer`, `actions` | the designer's skeleton: `Top Container`, `Content`, `Bottom Container` (+ `Scrim`, `Background/…`) — `frame-standards.md` |
| Icon layer | `icon/<name>` | `icon_<symbol name>` |
| Image layer | `image/<content>` | `image_<description>` (the description may be in the content language, e.g. Vietnamese) |
| Free decoration | `decor/<description>` | `visual_<description>` frame for a free visual area |
| Language of layer names | English for all technical names | English for structure and components; image placeholder descriptions may be in the content language |
| Pages | emoji pages `📘 Cover … 🗄 Archive` | the file's own numbered pages (e.g. `3. Wireframe`, `5. UI Design`, `Components`, `Draft`, `Moodboard`) — **detected from the file each session** and recorded in `project.yaml › pages`; never rename or reorder the designer's pages |
| Explore / draft area | `🧪 Explore` page | drafts and options go into **the agent's own section** with a number + name title frame (`team-rules.md` §12.2) |
| Grouping | Sections named after the flow, `Flow / Screen / State` | numbered sections with a title frame (`3.2`, `3.2.1`); screens left → right in flow order |
| Status / versions | status stickers, `v1.2 – …` version names | approval recorded in `design/flows.md` (`wireframe_approved`, `ui_approved`, per-screen `approved`) |
| Forbidden | `Frame 123`, `Copy`, `Final`… | same, plus codes as screen names (`WF-014`), abbreviated suffixes, duplicate names |

Component names (`/` hierarchy, Title Case, states as variants `Property=Value`) and token names are the same in both.

## 9. Self-check
- [ ] Every screen name exists in `flows.md` and follows `[Flow-path]_[State]_[Variant]`.
- [ ] No `.` `·` `/`, no spaces around `-` `_`, no double separators, no `-`/`_` inside a level.
- [ ] Every suffix is from the table or `extraSuffixes`; none abbreviated; no two screens share a name.
- [ ] Wireframe and UI names match 1:1; screens are placed left → right in flow order.
- [ ] Components named by domain; states are variants.
- [ ] Reserved names used only for their purpose; no default frame names.
