# Job 2 — Analyse: contradictions, gaps, competitor patterns

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/analyze.md @ 3c0e291 — translated, complete

Cross-check the documents against each other, and borrow **structure** from competitors — never their content, never their style.

## Contents
1. When to use
2. Inputs and outputs
3. Step 1 — Document contradictions `C-##`
4. Step 2 — Gaps `G-##`
5. Step 3 — Competitor scan, three tiers
6. Step 3b — Pick competitor screens that match the spec, crop them by function
7. Step 4 — Competitor screenshots are images, not nodes
8. Adaptive projects (iOS 27 · iPhone Duo · iPad)
9. Output, stop points, self-check, report
10. Knowledge lenses

---

## 1. When to use

- After `prd.md` is approved and competitor screenshots exist.
- Cross-checking several documents — prices, scope, permissions.
- Finding where competitors put a feature and how many steps their flow takes.

**Not for** taking style (color, type, radius) — that comes from other sources (a style/visual reference job, e.g. `design-md-writer`).
**Not for** flows or counting screens — that is `ux-flow.md`.

## 2. Inputs and outputs

| Check | If missing |
|---|---|
| `design/prd.md` exists with `status: approved` | run `prd-read.md` first — say *"the PRD needs approval first"* |
| competitor screenshots in `design/sources/competitors/`, or a Figma page holding them | ask the user; *Contradictions* and *Gaps* can still be done |

| Reads | Writes |
|---|---|
| `prd.md` · the original PRD files when verifying · screenshots in `sources/competitors/` | `design/analysis.md` (`status: draft`, `based_on: prd.md@<approval date>`) from `assets/analysis.template.md` · `design/competitor-parts/` + `index.md` (§6) |

## 3. Step 1 — Document contradictions `C-##`

Compare every document in the PRD folder with each other and with `prd.md`: price · scope · bans · Free/Premium permissions ·
feature names. Each contradiction records **both sides, verbatim, with location**, `status: WAITING FOR USER`. **Never pick a side
yourself.**

## 4. Step 2 — Gaps `G-##`

An FR with no surface · a UC with no path · a ban with unclear boundaries · business states nobody mentions (expired, locked, over
quota). Each item has a `type` and a `proposal`.

## 5. Step 3 — Competitor scan, three tiers, in order

1. **Flow inventory** — how many tabs, their names, how many onboarding steps, where the paywall sits.
2. **Layout anatomy** — **only screens matching features we have** — the skeleton, not the content.
3. **Copy rhythm** — measure: title word count, subtitle word count (typically 4–6 and 8–12). The voice / UX-writing work uses these
   numbers (`../ux-writing/SKILL.md`).

**Per-pattern procedure:** inventory → **scope gate** (do we have that feature? no → drop it immediately) → anatomy → classify
`USE / DON'T` with a reason.

**Count, don't feel:** how many apps have it · where it sits · what the numbers are · what **nobody** does. Write `appears: 1/3`.

**Borrow structure, not content**

| Borrow | Don't borrow |
|---|---|
| layout · block order · primary action position | features · feature names |
| interaction type · number of steps · copy rhythm | proper names · sample content · verbatim sentences |

**Rejected patterns are recorded too**, `decision: DON'T` with the reason — otherwise the next pass proposes exactly that again.

## 6. Step 3b — Pick competitor screens that match the spec, crop them by function

Take the competitor UIs that fit the spec; each screenshot can be cut into the component images needed, staying true to function.

1. **Pick screens** — only screens answering one FR / UC in `prd.md` (they passed the scope gate in §5); record `answers: FR-… / UC-…`.
2. **Measure, crop** — scale the screenshot to the screen's point width (e.g. 393 pt), then crop each **functional block** (plan
   picker, search field, result card, action bar…) into `design/competitor-parts/<function>/<app>-<screen>-<n>.png`. Work files go in
   `design/competitor-parts/_work`.
3. **Index** `design/competitor-parts/index.md` — one line per image: `image · function · answers FR / UC · block role · order in
   screen · app · source screen · USE / DON'T · why`.
4. **What it is for** — when building UI, take **function, block order, primary-action position** from the crops of the right
   function; take **form** from the project's style (style guide, `DESIGN.md`, or the existing system in maintenance work). The
   *Borrow / Don't borrow* table in §5 still applies: no competitor colors, no copy, no feature names.
5. Never write into `sources/` · once per screenshot set; the designer adds screenshots → crop the additions.

## 7. Step 4 — Competitor screenshots are images, not nodes

**Read layouts visually.** A competitor sitemap pasted into Figma is images — a query for `FRAME` returns nothing. Evidence: an agent
once concluded *"there are no screens"* about a section holding 106 elements. Query nodes only to get screen names from text labels and
the `imageHash`.

Images only inside Figma → ask the user to export them to `sources/competitors/` so any agent can read them.

Every pattern records `source:` down to **app · screen · image file**: `App A · widget editor · sources/competitors/appA-widget-edit.png`.

Read competitor screenshots with the same six questions as any screen (`../mobile-ui-master/references/reading-screens.md`) — only an
image, no layer outline.

## 8. Adaptive projects — iOS 27 · iPhone Duo · iPad

When the target platforms include resizable devices (`../iphone-duo-adaptive/SKILL.md`): detect hard-coded assumptions in the
documents and in competitor designs — frames fixed per device model, a fixed **hinge spacer**, layout chosen by device idiom /
orientation, only two "pretty" artboards. Record them under *Contradictions* / *Assumptions*.

## 9. Output, stop points, self-check, report

**Output:** `design/analysis.md` — three parts: *Document contradictions* · *Gaps* · *Competitor patterns*.

**Stop and ask:** documents contradict → stop, ask (§3) · approval of `analysis.md`.

**Self-check:** scope gate applied during the competitor scan (§5) · competitor screenshots read as images, not nodes (§7).

**Report** adds numbers: contradictions · gaps · patterns USE / DON'T · number of apps and screens scanned.

```
Next steps
  → answer C-01, C-02                    contradictions blocking the flow
  → "approve analysis"
  → "make the flows" · "set the voice"   can run in parallel after approval
```

## 10. Knowledge lenses

`requirements.md` · interaction patterns (`../mobile-ux-fundamentals/references/interaction-patterns.md`) · cross-platform decisions
(`../material-design-3/references/cross-platform-decisions.md`, when the project is multi-platform). When choosing between options:
`ideation.md` (three-angle selection). Adaptive projects: `../iphone-duo-adaptive/SKILL.md`.
