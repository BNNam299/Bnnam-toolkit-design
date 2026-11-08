# Adaptive layout rule map: Figma frame set, annotations, handoff, test matrix, anti-patterns, the eight-question gate

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/iphone-duo-adaptive-layout-deep-dive.md §13–19 @ 3c0e291 — translated, complete

Labels: `[A]` Apple rule · `[C]` design consequence · `[T]` toolkit proposal (see `duo-foundations.md`). The decision system behind these rules: `duo-adaptive-layout-system.md`. How to run the job step by step: `duo-adapt-workflow.md`. Device Hub, phase checklists and the Apple-based anti-pattern list: `duo-handoff-testing.md`.

## Contents
1. Figma and wireframe workflow (frame set, annotations, no device breakpoints, prototype)
2. Handoff to developers (decision table, allowed / forbidden tokens, QA logging)
3. Adaptive layout test matrix and acceptance criteria
4. Anti-patterns and fixes
5. Rule map for the toolkit (schema, container rule, the eight-question gate)
6. Short design-review checklist
7. Operating conclusion

---

## 1. Figma and wireframe workflow `[T]`

Never make six screen files for six poses. Make **one state model and representative canvases**. The community starter kit (six states, 15 `Duo System` variables, safe-area / hinge / grid guides, eight navigation patterns, nine product patterns, six templates, ten Do / Don't pairs — `duo-community-kit.md`, `duo-community-patterns.md`) is for building and reviewing mockups; runtime geometry still comes from container, safe area and the reserved-region API.

### 1.1 Minimum frame set
1. outer compact;
2. inner expanded;
3. one intermediate resize;
4. book pose with an **active** division region;
5. tabletop, if the product has fitting media / input / controls;
6. Split View with the app on the **left and on the right**;
7. keyboard or PiP reducing usable space;
8. an accessibility text size;
9. RTL, if the product supports it;
10. loading / error / a presentation open while resizing.

### 1.2 Required annotations on every wireframe
- container bounds illustrated;
- horizontal / vertical size class;
- safe area;
- layout margins;
- active reserved regions;
- primary / secondary content;
- container used: navigation split, arrangement split / overlay, grid / list / custom;
- which items are displaced;
- bar edge, item groups and overflow priority;
- state preserved when moving to another frame.

### 1.3 Never write device-style breakpoints

Avoid:
```text
if Duo opened → use layout B
```
Write:
```text
When the horizontal space allows primary + secondary at once
and each pane still reaches its minimum usable width → reveal split.

When an active division region cuts the container → balance panes around the division,
keep the selection and navigation path.
```

### 1.4 What a prototype must show
- compact ↔ expanded;
- fold inactive ↔ active;
- toolbar horizontal ↔ vertical;
- overlay ↔ side by side;
- focus and keyboard continuity;
- overflow appearing as height shrinks;
- opening a sheet / menu first, then changing pose;
- an animation reversed half-way.

## 2. Handoff to developers `[T]`

### 2.1 Layout decision table

| Condition | Representation | Preserved state | Container / API family | Test evidence |
|---|---|---|---|---|
| compact width | single pane | selection / path / draft | navigation stack or collapsed split | screenshot + interaction recording |
| regular width with room for min pane | list + detail | selection / path | navigation split | inner + resized window |
| active division intersects the view | panes / items avoid the fold | all task state | reserved region + system container | book pose |
| primary and secondary must both show | split | play / edit / focus | arrangement split | horizontal + vertical axis |
| foreground may cover content | overlay | z-order and control state | arrangement overlay | flat + folded |
| vertical bar edge available | vertical representation | group / order / priority | system toolbar / tab / navigation | outer + inner landscape |

### 2.2 Tokens and metrics

May be handed off:
- min / ideal / max content width based on legibility;
- spacing scale;
- minimum touch target;
- preferred pane ratio;
- max readable line length;
- image crop / focal point;
- priority and grouping;
- animation intent and duration range.

Never handed off:
- a hard-coded hinge width;
- camera coordinates taken from a screenshot;
- the assumption that the bar is always on the right;
- one fixed width for every locale / text size;
- device-name breakpoints instead of the environment.

### 2.3 Events and state to log in QA
Container size and size classes · active reserved regions · current layout family · visible / overflow toolbar items · primary / secondary placement · selection / focus before and after the transition · state restoration after an interruption · accessibility settings and locale.

## 3. Adaptive layout test matrix `[T]`

### 3.1 Required axes

| Axis | Representative values |
|---|---|
| Display | outer, inner |
| Geometry | portrait, landscape, intermediate resize |
| Fold | flat, partially folded book, tabletop / tent if relevant |
| Multitasking | full screen, Split View left, Split View right |
| System surfaces | keyboard, sheet, alert / menu, PiP, Live Activity if relevant |
| Text | default, large, accessibility sizes |
| Locale | long Vietnamese, English, RTL |
| Appearance | light, dark, increased contrast, reduce transparency |
| Motion | normal, Reduce Motion, transition reversed |
| State | empty, loading, content, error, editing, destructive confirmation |

No need to run the full Cartesian product — use **pairwise coverage** plus the high-risk combinations.

### 3.2 High-risk combinations
- outer landscape + keyboard + large Dynamic Type;
- inner book pose + an open sheet;
- Split View app on the left + RTL;
- overlay arrangement + fold mid-animation;
- grid + active division + more content loading;
- form being typed + closing the device;
- media playing + PiP + opening the device;
- toolbar with many items + badge + low height;
- camera active making the inner occlusion appear;
- drag / drop or multi-select while recomposing.

### 3.3 General acceptance criteria
- [ ] No text, status icon or important hit target covered by the fold / camera / bar.
- [ ] No function disappears just because the pose changed; if in overflow it is still findable and correctly labelled.
- [ ] Compact and expanded keep the same task, selection and navigation path.
- [ ] Split / overlay match the content relation and do not replace navigation.
- [ ] Focus, keyboard and draft survive resize.
- [ ] No grid / tile cut across the folding region.
- [ ] Bars keep grouping, relative order and action priority.
- [ ] RTL does not wrongly mirror the hardware edge.
- [ ] Presentations stay anchored to the right source or fall back safely.
- [ ] Motion explains the change and has a Reduce Motion behaviour.
- [ ] The layout works at intermediate sizes, not only the two open / closed pictures.
- [ ] Full-bleed backgrounds do not pull foreground out of the safe area.
- [ ] Empty / loading / error states adapt like the content state.
- [ ] Hinge angle or model name is never the main layout breakpoint.

## 4. Anti-patterns and fixes `[C]`

| Anti-pattern | Why it is wrong | Fix |
|---|---|---|
| "Closed" and "open" screens designed as two apps | loses the continuum and state | one state model, representation by environment |
| Stretching the phone UI on the inner display | wastes hierarchy, bad line length | reveal valuable panes / metadata |
| Hard-coded hinge spacer | wrong in other poses, views and coordinate spaces | query the reserved region locally |
| Centering everything on the whole display | the focal point may land on the fold | center within the usable region or displace |
| Reordering the whole screen on fold | people lose track of controls | move the minimum, keep item identity |
| Hiding actions when short of room | loses functional parity | priority + system overflow |
| Fixed custom bottom bar | eats height, gets no vertical behaviour | system navigation / toolbar / tab container |
| Orientation as the main logic | inner display and multitasking break old assumptions | size class + bounds + regions |
| Mirroring the bar in RTL | the bar follows the hardware edge | separate hardware edge from semantic direction |
| Arrangement replacing navigation | no path, selection or back behaviour | navigation container outside the arrangement |
| Splitting every screen into two panes | fake hierarchy, high density | split only when the task relation needs it |
| Letterboxing a game by default | wastes the display, less immersion | change aspect ratio; artwork in padding if unavoidable |

## 5. Rule map for the toolkit `[T]`

### 5.1 Base schema (proposed for the toolkit — not an Apple API)

```yaml
adaptive_layout:
  inputs:
    - container_size
    - horizontal_size_class
    - vertical_size_class
    - safe_area
    - layout_margins
    - reserved_regions
    - vertical_bar_edge
    - content_size_category
    - locale_and_direction
    - transient_system_surfaces
  invariants:
    - task_state
    - information_hierarchy
    - functional_parity
    - selection_and_focus
  allowed_transformations:
    - resize
    - reflow
    - reveal_or_collapse
    - displacement
    - recompose
    - overflow_or_representation_change
```

### 5.2 Container rule

```text
hierarchical navigation      → navigation split
two equal-status views       → split arrangement
foreground over background   → overlay arrangement
flowing collection           → list / grid / scroll container
system presentation          → standard sheet / alert / menu / popover
custom geometry              → only when none of the above describes the task
```

### 5.3 The eight-question gate for AI output
An agent producing a Duo wireframe must be able to answer:
1. Which environment inputs does the layout rely on?
2. What is the primary task and the invariant state?
3. When space runs out, what resizes, reflows, overflows or collapses?
4. At which scope is an active division / occlusion handled (element or container)?
5. Which container is responsible for the adaptive behaviour?
6. How do the bars change representation and priority?
7. How are focus, selection, scroll and draft mapped between frames?
8. Which prototype / test proves the behaviour in an **intermediate** state?

If these eight cannot be answered, the output is only a **picture of a Duo**, not adaptive design.

## 6. Short design-review checklist `[T]`

**Structure**
- [ ] Information hierarchy consistent between outer and inner.
- [ ] The expanded layout reveals more value, not just more white space.
- [ ] Navigation split and arrangement used in their right roles.

**Geometry**
- [ ] Components lay out against their local container.
- [ ] Safe area, margins and reserved regions kept distinct.
- [ ] Asymmetry and Split View on both sides checked.

**Content**
- [ ] Text, image focal points and controls do not cross the fold harmfully.
- [ ] Grid / list / form / media have rules matching their semantics.
- [ ] Dynamic Type, localization and RTL do not break groups / order.

**Controls**
- [ ] Horizontal and vertical bars keep item identity.
- [ ] Grouping, visibility priority and overflow are described.
- [ ] Primary / destructive / status actions stay easy to find.

**Continuity**
- [ ] Selection, focus, draft, scroll and task state kept.
- [ ] Motion shows source → destination and supports Reduce Motion.
- [ ] An open presentation keeps its context when the pose changes.

**Verification**
- [ ] Compact, expanded and intermediate evidence exists.
- [ ] Book / tabletop / Split View covered where the product needs them.
- [ ] System surfaces and failure states tested.
- [ ] Device Hub run, and re-checked on hardware when possible (`duo-handoff-testing.md` §1–§2).

## 7. Operating conclusion `[T]`

Adaptive layout on iPhone Duo does not start from drawing the device. It starts from three decisions:
1. **Which state must be invariant?**
2. **Which container owns the adaptation?**
3. **Which representation does the current geometry allow while the task stays easy to understand and operate?**

Working order:

```text
task + hierarchy
→ component / container semantics
→ compact / expanded representations
→ safe area / margins / reserved regions
→ displacement / overflow
→ motion / state continuity
→ test matrix
```

A layout built on containers and system semantics makes iPhone Duo one more context in a shared adaptive system. A layout built on screenshots, model names or a hinge constant adds an exception with every new pose, and the design system soon stops scaling.
