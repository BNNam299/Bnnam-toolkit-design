# Job — audit the design system's health and propose optimisations

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/system-audit.md @ 3c0e291 — translated, complete

The skill set already knows how to **use** the system (`scripts/bind.js`, `scripts/inspect.js`, `scripts/restyle.js`, the screen audit)
— this job **audits the system itself**. It reads every variable, style and component in the file, reports what is unused / duplicated /
inconsistent, and proposes merges · deletions · renames · scopes. **It never fixes on its own** — the designer approves each group.

## Contents
1. When to use
2. Inputs and outputs
3. Scale of the job
4. Step 1 — Audit (read only)
5. Step 2 — Report and propose by group
6. Step 3 — Fix approved groups — dry run first
7. Stop points, self-check, report

---

## 1. When to use

- *"audit the design system"*, *"optimise the variables"*, *"clean up the variables"*, *"what's redundant in the system"*
  (*"soát design system"*, *"tối ưu variables"*, *"dọn biến"*, *"hệ có gì thừa"*).
- At the start of a **redesign** (`../figma-project-maintain/references/processes.md` §4 step 1) — learn what of the old system is still
  usable and what will be replaced.
- Before generating components in a **maintain** project — learn which families exist and how they are named.
- After a big batch (many new components, style changes) — audit again.

**Not for** auditing single screens (that's the screen audit, `../ux-review-handoff/scripts/audit.js`, and the tool demo's
`audit_design`), nor for editing main components (`../bnnam-standards/references/team-rules.md` §12.4).

## 2. Inputs and outputs

| Check | If missing |
|---|---|
| The Figma file is reachable | ask for the file link |
| The project's token setup is known (`scripts/detect.js`) — which collection is primitive / alias / mapped | run `detect.js`, the designer confirms |

| Reads | Writes |
|---|---|
| the file's variables, collections, modes, styles, components, instances (read only) · the project's token setup | `design/system-audit.md` (report, `status: draft`) · the decision log `[design]` (groups the designer approved) · in Figma: **only** the `APPLY` items the designer approved |

No project documents are read — the source is the Figma file itself. The token setup says which collection is primitive / alias /
mapped; the designer's design-system documentation (if any, in `design/sources/`) is read for naming conventions before reporting
*"inconsistent naming"*.

Terms you will meet: variable · collection · mode · alias · primitive / alias / mapped (three token tiers — `tokens.md` §1.1) · scope ·
text / paint / effect style · component set · variant · instance · detach.

## 3. Scale of the job

| Level | What |
|---|---|
| **Light** | audit variables (unused, duplicates, broken aliases, scopes) on system pages + UI pages |
| **Standard** | + styles, components, primitives on screens · every page |
| **Full** | + fix the groups the designer approved (dry run → real run) · re-audit to confirm · decision-log entries |

★ **Mandatory floor:** read only until approved · delete / merge only after auditing every page — even at Light.

## 4. Step 1 — Audit (read only)

Run `scripts/system-audit.js` through `execute_code` with `CONFIG.PAGES = null` and `timeoutMs: 120000` (a 40k-layer file takes ~17 s).
On a large file (> 50k layers) audit page by page first (`PAGES`), but **delete / merge only after auditing every page** (the script
refuses otherwise). Output groups (`variables.*`, `styles.*`, `components.*`):

| Group (output key) | Reports | Usual action |
|---|---|---|
| unused variables (`unused`) | no layer and no alias points to it | delete — except variables reserved for developers or modes not built yet (ask) |
| duplicate values (`duplicateValues`) | same collection, same name group, same value | merge into the variable at the right tier (alias / mapped) — or keep if the two roles will split later |
| near-duplicate colors (`nearDuplicateColors`) | ≤ 2 % difference per channel | usually entered twice — the designer picks which to keep |
| broken aliases (`brokenAliases`) | alias points to a variable that no longer exists | re-point or delete |
| "all scopes" (`allScopes`) | color / number variable left at `ALL_SCOPES` | set scopes: background `FRAME_FILL` `SHAPE_FILL` · text `TEXT_FILL` · spacing `GAP` · radius `CORNER_RADIUS` |
| missing mode values (`missingModeValues`) | a variable has no value in one mode | fill it |
| inconsistent naming (`namingInconsistent`) | grouping differs from the majority, stray spaces | rename per `../bnnam-standards/references/naming.md` |
| primitive on screens (`primitiveBoundOnScreens`) | a color on a screen bound straight to a primitive | switch to the mapped variable (`scripts/bind.js`, `BIND_TARGET: "mapped"`) |
| primitive with scopes (`primitiveWithScopes`) | a primitive has scopes (usually `ALL_SCOPES`) — shows in pickers | empty scopes (designer rule — `system-binding.md` §3) |
| scope vs role (`scopeRoleMismatch`) | a semantic variable's scopes don't match its name (`text/*` without `TEXT_FILL`) | set scopes by role |
| raw value in the semantic tier (`rawValueInSemanticTier`) | an alias / mapped color variable holds a hex instead of pointing at a primitive (alpha colors `a < 1` excluded) | point it at a primitive step |
| alias too deep / loop (`aliasTooDeep`) | > 10 levels | shorten the alias chain |
| ramp missing steps / not monotonic (`rampMissingSteps`, `rampNotMonotonic`) | compared with the step set of most primitive ramps · a later step lighter than the previous | add steps / fix values (`tokens.md` §2.2, §2.8) |
| token-pair contrast (`tokenPairContrastBelow4_5`) | text / background pairs below 4.5:1 in **each mode** — pairs declared in `CONTRAST_PAIRS`, or auto-paired `on-X` ↔ background `X` | shift L on one side (`tokens.md` §2.4) |
| font size below the floor (`fontSizeBelowFloor`, `styles.text.sizeBelowFloor`) | a font-size variable / text style < 11 | raise it or keep it with a reason |
| semantic variable without description (`semanticMissingDescription`) | no description | add one: when to use it |
| unused / duplicate styles (`styles.paint/text/effect`) | text, paint, effect styles | delete / merge — the designer does it in Figma (the script doesn't edit styles) |
| component without instances (`components.noInstances`) | within the audited scope | ask: still used? |
| inconsistent variant property names (`variantPropertyNameClash`, `variantValueCaseClash`) | `State` / `States`, `Type` / `Types`; `Default` / `default` | the designer fixes the main component |
| detached instances (`detached`, or `framesNamedLikeComponent_maybeDetached`) | frames with `detachedInfo` (Figma's official property — guessing by name only when the API lacks it) | the designer reviews, replaces with instances |
| inside components (`components.inside`) | fill / stroke / radius / padding / gap not bound (gap in *space-between* and fully rounded pills excluded) · text without a text style (character icons excluded) · missing auto layout · text without a TEXT property · hand-typed opacity · default layer names `Frame 12` | bind variables / styles, add properties — the designer fixes the main component or orders the fix (`../bnnam-standards/references/team-rules.md` §12.4) |
| variants (`components.variants`) | default names (`Property 1`) · variants stacked at the same coordinates · variant count differs from the matrix (missing / extra combinations) · > 30 variants · an icon set as variants instead of instance swap · missing descriptions | fix in the main component (`atomic-design.md` §5) |

Also returned: `proposals` (one line per group with numbers) and `caveats` (limits of this run, e.g. instance counts capped by
`MAX_COMPONENTS`).

## 5. Step 2 — Report and propose by group

Write `design/system-audit.md`: count per group, detailed items, proposals with reasons. Talk to the designer **by group, heaviest first**,
at most three groups per round — one question per group: *"merge these 9 duplicate-variable groups as in this table? (strike the rows to
keep)"*.

## 6. Step 3 — Fix approved groups — dry run first

Only four kinds of variable fix, all reversible by hand: `scope` · `rename` · `delete` (only while it still has 0 uses) · `merge` (rebind
every use to the target variable, then delete the old one). Fill `APPLY`, run with `DRY_RUN: true` → tell the designer what would change
→ the designer says *"run it for real"* (*"chạy thật"*) → `DRY_RUN: false` → re-run Step 1 to confirm the numbers dropped → log a
decision. Styles and components: **report only**, the designer fixes them (`../bnnam-standards/references/team-rules.md` §12.4).

## 7. Stop points, self-check, report

**Stop and ask:** approval per group before filling `APPLY` · *"run it for real"* after the dry run · *unused* variables may be reserved
for developers / modes not built yet — ask before deleting.

**Self-check:**
- **every page** audited before deleting / merging (the script refuses when `PAGES` is not null) · re-audit after fixing; fixed groups
  are back to 0
- no style or main component edited · every fixed group has a decision-log entry

**Report** (team format — `../bnnam-standards/references/team-rules.md` §9), plus: number of variables · count per group before →
after · groups waiting for the designer · audit time (a 40k-layer file ~17 s).

```
Next step
  → "merge the duplicate variable groups"
  → "set scopes on color variables"
  → "later"
```

Knowledge: `tokens.md` (three token tiers, token groups, component governance, design-system checklist) · `figma-practice.md` (variables
and tokens, audits) · `system-binding.md`.
