# Adapt workflow: designing one screen family across devices, postures, sizes and scenes

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/adapt.md @ 3c0e291 — translated, complete

The job procedure of this skill. Knowledge it relies on — read in full before step 1, it is **newer than the agent's built-in knowledge**, so take every statement from these files, never from memory: the `duo-*.md` references of this skill (Apple: `duo-foundations.md` → `duo-handoff-testing.md`; decision system: `duo-adaptive-layout-system.md`, `duo-rule-map.md`) and the Apple Figma kit numbers `../apple-design-iphone/references/ios27-figma-kit.md`. Every Figma build or edit follows the build loop `../figma-ui-flow/references/build-loop.md` plus `../bnnam-standards/references/screen-building-lessons.md` — build in passes, numbers after every write, one screenshot per pass.

**Root rule** (`duo-foundations.md` §7): ***design one continuous interface system for the available space; never a fixed set of screens per device name.***

**Three decisions before any frame** (`duo-rule-map.md` §7): (1) **which state must be invariant** · (2) **which container owns the adaptation** · (3) **which representation the current geometry allows** while the task stays easy to understand and operate. Working order: task + hierarchy → component / container semantics → compact / expanded representation → safe area / margins / reserved regions → displacement / overflow → motion / continuity → test matrix.

## Contents
1. When to use, role, prerequisites
2. Reads and writes
3. Step 1 — choose the support level
4. Step 1b — inputs, invariants, transformations
5. Step 2 — the frame matrix and required annotations
6. Step 3 — build the variants: change structure, keep function
7. Step 4 — check: same function, trackable transitions (+ the eight-question gate, states and conditions, community kit)
8. Step 5 — record it for developers
9. Stop and ask · self-gate · report

---

## 1. When to use, role, prerequisites

**Use when:**
- the project's targets (`design/project.yaml › platform.targets`) include a device that changes size / posture: iPhone Duo, iPad, an iPhone app running resizable (iPad, iPhone Mirroring), Split View, several scenes — or `platform.adaptiveLevel` is not `none`;
- the designer says *"adapt cho iPhone Duo"* ("adapt for iPhone Duo"), *"làm responsive"* ("make it responsive"), *"thêm bản iPad"* ("add an iPad version"), *"màn này khi gập / mở / tabletop thì sao"* ("what does this screen do folded / open / tabletop"), *"chia hai pane"* ("split into two panes");
- a maintenance project must upgrade an iPhone app to run well on Duo / iPad (`../figma-project-maintain/SKILL.md`).

**Do not use** for a single-iPhone-size project (`platform.adaptiveLevel: none`) — keep the normal process.

**Role:** designer (the person who actually runs it: the designer).

**Prerequisites**

| Check | If missing |
|---|---|
| `platform.targets` and the **support level** `platform.adaptiveLevel` decided (§3) | ask the designer — propose a level per §3, the designer decides |
| `flows.md` approved — screens, states, flows known | do the UX flow first (`../prd-to-ux-flow/references/ux-flow.md`) |
| every screen in scope has an **adaptive structure** in `flows.md` — level · detail of · pane role · default selection · what the outer display keeps (`../prd-to-ux-flow/references/ux-flow.md` §17) | declare it first — the agent infers from Figma / PRD, the designer confirms; **missing → do not build frames yet** |
| the Apple Design Resources iOS 27 library is enabled in the file, or the project's equivalent system components | ask the designer to enable the kit library (`../apple-design-iphone/references/ios27-figma-kit.md`) — **never redraw** toolbar, tab bar, sheet, status bar |

**Checking that the kit library is enabled — in this order, before concluding "not enabled":** (1) get the **file's library list** (the Figma tools of the agent) and look for a library named *iOS and iPadOS 27* or equivalent · (2) found → search components **inside that library** (pass the library key) — a general search without the library can return 0 even when the kit is enabled · (3) scan the file's pages — the kit may be pasted straight into the file · (4) only when all three find nothing, tell the designer, listing what you tried. Calls into the **kit file** count against the team that holds the kit.

## 2. Reads and writes

| Read | Write |
|---|---|
| **required knowledge, read in full before step 1**: this skill's `duo-*.md` references and `../apple-design-iphone/references/ios27-figma-kit.md` · **before step 3**: `../mobile-ui-master/references/screen-structure.md` §7, §11 · `duo-community-app-examples.md` §6–§7 · **screens with a sheet / presentation**: `duo-video-atlas.md` › *111466 08:44 — presentation across six states* · `flows.md` · `components.md` · `project.yaml` · `lessons.md` | `project.yaml › platform` · `flows.md` (the **Adaptive** entry of each screen) · `components.md` (adaptive contract) · variant frames in Figma (own section) · `review.md` (adaptive checklist) |

Project data lives in the project's `design/` folder (`../bnnam-standards/references/team-rules.md` §8).

## 3. Step 1 — choose the support level (never force every project to the top)

`duo-foundations.md` §5:

| Level | When | Must have |
|---|---|---|
| **compatible** | the app has no use case of its own for a large canvas | nothing breaks · correct resize · correct safe area · **same functions** at every size |
| **adaptive** | most apps that gain from a large canvas | split / panes / grid / vertical control bar / overflow **designed** |
| **duo-enhanced** | media, camera, productivity, hands-free | arrangement · posture-specific improvements · several scenes / display accessory — **with fallback** |

Answer the Discovery checklist (`duo-handoff-testing.md` §8, Discovery) to propose a level: does the app really gain from the inner display · are there list–detail, supporting pane, overlay, dual-display cases · which posture creates new value · which edit / play / capture task must keep state across open / close · are several scenes needed · is the camera involved. Write the proposal with reasons; **the designer decides** — record it as a decision in the project.

## 4. Step 1b — inputs, invariants, transformations

`duo-adaptive-layout-system.md` §3, §6 and `duo-rule-map.md` §5.1 (toolkit schema — not an Apple API):

| | |
|---|---|
| **Inputs the layout reads** | container size · horizontal / vertical size class · safe area (**four independent values**, never mirrored) · layout margins · reserved regions · vertical bar edge · text size (content size category) · locale and text direction · transient system surfaces (keyboard, PiP, sheet) |
| **Invariants** — never changed silently | task state · information hierarchy · **functional parity** · selection and focus |
| **Six allowed transformations** | **resize** · **reflow** · **reveal / collapse** hierarchy · **displacement** · **recompose** · **overflow / representation change** |

Four geometry layers are **never mixed** (`duo-adaptive-layout-system.md` §4): container bounds → safe area → layout margins → reserved regions — read in the order of §4.5. **Adaptive ≠ responsive** (§2.3): adapting changes structure by task, it does not scale proportionally.

**Never write device-style breakpoints** (`duo-rule-map.md` §1.3) — in `flows.md`, specs, handoff:
- avoid: *"if Duo is open → layout B"*
- write: *"when the width allows primary + secondary and each pane still reaches its minimum usable width → reveal split"* · *"when an active division region cuts the container → balance panes around the division, keep selection and the navigation path"*

## 5. Step 2 — the frame matrix: draw all of it, not just two pretty artboards

Each screen in adaptive scope has **one base screen** and **frame variants**. Names follow `../bnnam-standards/references/naming.md` §3 — variant suffix:

| Suffix | Frame (mockup size — `../apple-design-iphone/references/ios27-figma-kit.md` §2) | Level needed |
|---|---|---|
| *(none)* or `_Outer` | Duo outer portrait 466 × 678 · or iPhone 402 × 874 | every level |
| `_Outer Landscape` | 678 × 466 | compatible and up, when the app rotates |
| `_Inner` | Duo inner portrait 669 × 951 | every level |
| `_Inner Landscape` | 951 × 669 | every level |
| `_Intermediate` | one intermediate resize (Split View, PiP, keyboard) | **adaptive** and up |
| `_Book` · `_Tabletop` · `_Tent` | inner folded by posture | when that posture **has value** (Discovery) |
| `_Split Left` · `_Split Right` | half the inner display, control bar on the **outer edge of its own part** | adaptive and up |
| `_iPad` · `_iPad Landscape` | 1210 × 834 … | when targets include iPad |

E.g. `Inbox_Result_Inner Landscape`, `Player_Result_Tabletop`. Build frames with `../figma-project-maintain/scripts/clone.js` from the base screen into **their own section** per device group (`../figma-project-maintain/scripts/section.js`; Duo frame rules: `../bnnam-standards/references/frame-standards.md` §9), then **convert the structure** per §6 — never stretch.

**Minimum frame set** (`duo-rule-map.md` §1.1) — check against the matrix above, skip no cell the product needs: outer compact · inner expanded · **one intermediate resize** · book pose with an **active division region** · tabletop if there are suitable media / input / controls · **Split View with the app on the left and on the right** · **keyboard or PiP** reducing usable space · **accessibility text size** · **RTL** if supported · **loading / error / a presentation open while resizing**. Never six files for six poses — one state model and representative canvases.

**Required annotation on every frame** (`duo-rule-map.md` §1.2): container bounds illustrated · horizontal / vertical size class · safe area · layout margins · **active** reserved region · primary / secondary content · container used (navigation split / arrangement split / overlay / grid / list / custom) · which elements are displaced · bar edge, item groups, overflow priority · **state kept** when going to another frame · **scroll behaviour of each pane** (fixed / vertical / horizontal) · **presentation style** (sheet / full screen / popover — compared with the base screen). Use the Apple kit's `_Layout Overlays` (`ios27-figma-kit.md` §3) or the community kit's layout guides (`duo-community-kit.md` §7) — hidden on export.

## 6. Step 3 — build the variants: change structure, keep function

**The designer's packaging standard comes first** (`../mobile-ui-master/references/screen-structure.md` §11, `../bnnam-standards/references/frame-standards.md` §9): horizontal bars (iPhone, Inner) keep the Top · Content · Bottom Container frame; vertical bars (Outer, Inner Landscape) use a HORIZONTAL root — panes, then **`Pane controls`** 84 as the last layer. Mapping iPhone → Duo: horizontal `Bottom Toolbar` → bottom group of the vertical bar (same items, same order) · top primary actions → top group · CTA → `Content pane` (Outer) or `Leading pane` (Inner Landscape). Apple / community examples apply only where the designer standard says nothing. *(This designer standard overrides the tool demo's default frame rules — decision #114.)*

**Container tree** (`duo-adaptive-layout-system.md` §8.5, `duo-rule-map.md` §5.2): hierarchical navigation → **navigation split** · two equal-role views → **split arrangement** · foreground over background → **overlay arrangement** · flowing collection (list / grid / feed) → list / grid / scroll · system presentation → standard sheet / alert / menu / popover · **custom geometry only when none of these describes the task**. Navigation sits **outside** the arrangement (§8.3).

**Patterns by content type** (`duo-adaptive-layout-system.md` §10 + `duo-community-patterns.md` §2): list–detail · grid / dashboard · feed / article / document · form + keyboard · media player · editor / canvas · game / immersive · messaging · maps · e-commerce · settings · calendar. Map the designer's screen type (`../mobile-ui-master/references/screen-structure.md` §7) to the matching pattern before building the inner version.

In order — each step is answerable with one rule from the references:

1. **Choose the container** (`duo-layout-transformation.md` §11): list → detail → *navigation split view* · two peer regions → *split arrangement* · controls / context floating over content → *overlay arrangement* · feed / article → plain scroll · a few controls avoiding the fold → plain layout + displacement. Never put a navigation container inside an arrangement.
2. **Evidence from real apps** (`duo-community-app-examples.md`): content width = frame − 84 (vertical bar) · the outer display **keeps the pane the person is working in** (the message being read, the track playing) · pane ratio follows content, never forced 50 / 50 · Split View: vertical bar on the outer edge of each app, a sheet covers only that app's half.
3. **Use the large space to reveal hierarchy** (`duo-foundations.md` §4 *Progressive use of space*, `duo-device-postures.md` §8) — show panes, context, columns — **never** stretch one phone column; forms and reading text get a max width (`Readable Content Margin`).
4. **Control bars** (`duo-components.md`): outer and inner landscape → **vertical bar** on the hardware edge (kit: `Toolbar - Top - iPhone Duo`, vertical `Tab Bar - iPhone Duo`, `_Buttons - 48pt` with `Preferred Axis = Vertical`, `Status bar - iPhone Duo` `Type = Vertical`); inner portrait → horizontal bars. Axis order: Dynamic Island → status → Back / Close → Done → toolbar groups → tab bar. Every item has **symbol + title**. Decide **whether the toolbar or the tab bar wins** by screen state (§7). Record **visibility priority** and the overflow group (§4). **Group the buttons per frame**: look up `duo-community-app-examples.md` §6 (6 real apps, outer ↔ inner) and apply its 8 rules (§7) — app-level navigation stays, contextual actions change per frame · drop buttons the layout now does · reveal more when there is room · the primary button stands alone · the list pane carries its own toolbar. Write the reason for every button into the frame annotation.
5. **Safe area and reserved regions are DYNAMIC** (`duo-device-postures.md` §4–§5): place content by the safe area, **never draw a fixed hinge spacer**. On a mockup annotate with the kit's `_Layout Overlays` (`Layout Margin` · `Safe Area Inset` · `Reserved Region`) in a `Layout Guides` frame, hidden on export; the safe area is asymmetric — never mirror the left inset to the right. When an Inner landscape mockup **splits into two panes**, put the gap **at the hinge** by the kit's numbers (only to illustrate the book posture on a mockup — never a spec, never a runtime constant).
6. **Displacement** (`duo-layout-transformation.md` §5–§6): continuous content may flow across the fold; point content (button, menu, field, dialog, single card) sits wholly in one region; a related group moves together, the shortest distance, keeping label / icon / action.
7. **Presentation** (`duo-components.md` §11–§13): **keep the presentation style** — a sheet stays a sheet, a popover stays a popover. Sheet: on **Outer** it fills the pane, × / ✓ go onto the vertical bar · on **Inner** it keeps its own horizontal header with the context still visible behind · **half folded** it slides to one half · the confirm action has **one representation** in every frame. The six-state table with frames: `duo-video-atlas.md` › *111466 08:44* — **read before building a screen with a sheet**. Alert / menu / popover use system components; PiP makes the app shorter — the layout shrinks vertically.
8. **Postures** (`duo-device-postures.md` §8): book — balance panes around the fold · tabletop — view on the upper half, touch on the lower half · tent — glanceable. Posture features **have a fallback**; never use the hinge angle as a breakpoint (§7).
9. **Several scenes, accessories** (`duo-multi-display-scenes.md`): each scene keeps its own state; an accessory only supplements and **never holds a required function**.
10. **Camera** (`duo-camera-layout-controls.md`) if any: speak by purpose (*facing you / facing out*), not just "flip"; preview ↔ output, mirroring and the active display are clear.

## 7. Step 4 — check: same function, trackable transitions

- **`scripts/adaptive.js`** (read only) on each screen family: which variants are **missing** for the support level · **actions present in one variant and missing in another** (functions must be the same — `duo-foundations.md` §3) · **fixed hinge / fold spacer** · text blocks wider than the readable width · vertical bar items without a title. Run it through `execute_code`: read the script, set the config at the top, send the whole file as `code`.
- **`../ux-review-handoff/scripts/audit.js`** on every variant (touch targets, contrast, names, background, safe area).
- **Continuity** — walk the 10 scenarios of `duo-handoff-testing.md` §3 on the frames (open detail on outer → open the device → detail still selected, list appears · typing → fold / unfold · sheet open → partially fold · Split View left ↔ right · AX5 text · …). For each scenario record: variant before → after, what is kept, what changes.
- Checklists `duo-handoff-testing.md` §8 (all phases) and anti-patterns §9 — record in `review.md` › *Adaptive*.

### 7.1 Gate: the eight questions the agent must answer (`duo-rule-map.md` §5.3)

Before reporting an adaptive screen as done, write the answers in the report — **if any question has no answer, the output is only a picture of a Duo, not adaptive design**:
1. Which **environment inputs** does the layout rely on?
2. What are the **primary task** and the **invariant state**?
3. When space runs out, what **resizes, reflows, overflows or collapses**?
4. At which **scope** (element or container) is an **active** division / occlusion handled?
5. Which **container** is responsible for adapting?
6. How do the control bars change **representation** and **priority**?
7. How are **focus, selection, scroll, draft** mapped between frames?
8. Which **prototype / test** proves the behaviour in the **intermediate state**?

### 7.2 All states and conditions

Each variant must be right beyond the pretty state. Also check, one answer per item on the frames:
- **loading, empty, error, recovery** in each container — an empty pane before anything is selected, an error in one pane never clears the other (`duo-states-feedback.md`);
- **operational accessibility**: focus after a posture change, VoiceOver across two panes, the vertical bar with AX text · **localization**: longer text, RTL — the bar follows the hardware edge and is not mirrored (`duo-accessibility-localization.md`);
- **ergonomics**: handedness, areas covered by the hand in each posture · **motion** on open / fold / posture change — trackable, no jumps (`duo-ergonomics-motion-input.md` §1–§2);
- **input parity**: everything doable by touch is doable with keyboard / pointer / other controls (`duo-ergonomics-motion-input.md` §3);
- **privacy** when two displays or system surfaces expose content to others · **onboarding**: Duo features discoverable, never mandatory (`duo-privacy-onboarding.md`);
- **feedback**: visual, audio and haptic consistent across postures (`duo-states-feedback.md` §7–§10) · **camera**: Camera Control by pose, lifecycle from preparing to review (`duo-camera-layout-controls.md`, `duo-camera-lifecycle-privacy.md`);
- the completeness audit and scope boundary (`duo-foundations.md` §8) — use it as the final list before reporting a batch.

**Verifying a source:** anything uncertain → `duo-video-atlas.md` (by video and timestamp) and `duo-apple-sources.md`.

### 7.3 Community kit — at its own reliability level

`duo-community-kit.md` / `duo-community-patterns.md` (*iPhone Duo Adaptive Design Starter Kit*, community): 5-step workflow · 6 device states · `Duo System` variables · layout guides · 8 navigation patterns · 9 product patterns · **10 Do / Don't pairs** · 6 starter templates.
- keep the kit's **5 reliability levels** — *Official* is only the kit's own label until checked against Apple; *Recommended / Illustrative / Assumption* never become a spec;
- kit tokens (column count, gap, content-max-width, leading column, hinge position 475.5, **27 pt avoidance band — a community estimate**, corner radius) are **for mockups / overlays only** — never runtime constants, never an *"if this is Duo"* condition;
- where the community kit and the Apple kit (`ios27-figma-kit.md`) disagree on a measurement → **the Apple kit wins**; note the difference.

## 8. Step 5 — record it for developers

- `flows.md`, each screen: an **Adaptive** entry — container · what is kept at every size · what reveals / collapses / reflows / overflows · state kept across resize · posture-specific improvements (`duo-handoff-testing.md` §5).
- `components.md`, each important component: the **contract** (`duo-handoff-testing.md` §6) — role · size behaviour · **axis behaviour** · **priority** · safe behaviour · state · continuity · accessibility (full form: `duo-adaptive-layout-system.md` §11).
- Handoff: a **behaviour spec**, not just artboards · the **Device Hub test matrix** (`duo-handoff-testing.md` §2) · pictures of the extreme states (`../ux-review-handoff/references/handoff-spec.md`).
- **Layout decision table** (`duo-rule-map.md` §2.1): condition → representation → state kept → container / API family → test evidence · **tokens handed off** (min / ideal / max width by legibility, spacing, touch target, preferred pane ratio, max line length, image focal point, priority, animation intent) and **never handed off** (fixed hinge width, camera coordinates from a screenshot, the bar assumed always on the right, one width for every locale, device-name breakpoints) (§2.2) · **events to log in QA** (§2.3).

## 9. Stop and ask · self-gate · report

**Stop and ask the designer**
- choosing the support level — the designer decides (§3) · a new variant whose functions differ between frames — report and ask (§7);
- the base screen is a sheet / presentation and you plan to **change its presentation style** on Duo (e.g. sheet → full-frame screen) — ask, record the decision (§6 step 7);
- no adaptive structure in `flows.md` yet — give the inferred version to the designer to confirm before building (§1 prerequisites).

**Self-gate**
- §7 checks — `audit.js` on every variant · the eight-question gate · all states and conditions.
- **Never report done** while any of these is missing: `adaptive.js` has run · the §5 annotation is under **every** frame · prerequisites checked (support level, adaptive structure). Missing → report **not done**, saying exactly what is missing.
- **Presentation style unchanged** — compare every frame with the base screen against the *111466 08:44* table (`duo-video-atlas.md`): a sheet is still a sheet on Inner, the context is still visible, confirmation has one representation.

**Report** — the team's report format (`../bnnam-standards/references/team-rules.md` §9), plus: support level · screens × variants built / needed · `adaptive.js` results (missing variants, mismatched actions) · continuity scenarios walked · **annotations n / n frames** · **presentation style of each frame** · decisions taken on your own · knowledge read.

```text
Adaptive — level adaptive · iPhone Duo + iPad
  12 screens × 5 variants: 48 / 60 built · _Intermediate missing on 6 screens, _Split Right on 6 screens
  Mismatched actions: Inbox_Result_Outer lacks "Archive" (present in _Inner) — functions must be the same
  Continuity: 7 / 10 scenarios pass — 3 waiting for _Intermediate

Next steps
  → "dựng _Intermediate cho luồng Inbox"  ("build _Intermediate for the Inbox flow")
  → "Archive on outer goes into overflow"   proposed per duo-components.md §4
```
