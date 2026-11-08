---
name: prd-to-ux-flow
description: Turns a PRD into a complete, traceable screen list before any UI is drawn - reads the PRD in its native format (tables, images, comments) with exact source locations; cross-checks documents for contradictions and gaps; scans competitor screens for structure; runs task analysis, information architecture and flows; counts screens in three layers plus overlays with a 15-state sweep and a state matrix; logs technical assumptions; writes design/flows.md as the single traced source of screen names; optionally builds grey wireframes by flow in Figma. Use when the user hands over a PRD, a spec or one feature's excerpt, asks what screens and states an app or a feature needs, or wants user flows, a sitemap, a screen inventory, competitor analysis or text / grey wireframes before UI. Vietnamese triggers such as "đọc PRD", "phân tích đối thủ", "làm luồng", "liệt kê màn", "dựng wireframe", "phác wireframe", "luồng màn", "màn này đáp FR nào". For building UI screens use figma-ui-flow; for the copy voice use ux-writing.
---

# prd-to-ux-flow — from PRD to a screen list nobody has to redo

This skill covers the work **before** the UI: read the requirements correctly, find contradictions and gaps, borrow structure from
competitors, and turn it all into flows and a screen list that is **neither missing screens nor bloated**. The most expensive mistakes
in earlier projects happened here, not in Figma: a banned feature built, a wrong price, a paywall where the document forbids one.

Four jobs, in order — each writes one file in the project's `design/` folder and stops for approval:

| Job | Output | Reference |
|---|---|---|
| 1 Read the PRD | `design/prd.md` | `references/prd-read.md` |
| 2 Analyse | `design/analysis.md` (+ `design/competitor-parts/`) | `references/analyze.md` |
| 3 Flows and screen list | `design/flows.md` — the single source of screen names | `references/ux-flow.md` |
| 4 Wireframe (only when the designer asks) | grey frames by flow in Figma | `references/wireframe.md` |

What lives elsewhere: building UI screens and the three-pass build loop (`figma-ui-flow`); frame structure, regions and naming
(`mobile-ui-master`, `bnnam-standards`); voice and real copy (`ux-writing`); prototype wiring (`figma-prototype-flow`); adaptive
layouts (`iphone-duo-adaptive`); maintenance projects that start from an existing Figma file (`figma-project-maintain`).

## Need → Read
| Need | Read |
|---|---|
| Read a PRD in its native format, five layers, coverage report | `references/prd-read.md` |
| Extract a `.docx` PRD with locations, merged cells, comments, embedded Excel | `scripts/docx_extract.py` |
| Contradictions `C-##`, gaps `G-##`, competitor scan in three tiers, cropping competitor parts by function | `references/analyze.md` |
| Measure and crop competitor screenshots | `../bnnam-standards/scripts/clone_measure.py` |
| Task analysis, IA, eight flow rules, counting screens, 15-state sweep, state matrix, assumptions, `trace` | `references/ux-flow.md` |
| Wireframe kit, three-row layout by flow, notes outside the frame, fold line, acceptance | `references/wireframe.md` |
| Templates for the three files | `assets/prd.template.md`, `assets/analysis.template.md`, `assets/flows.template.md` |
| PACT, the five IA architectures, worked task analysis, flow symbols, story maps, navigation models, information scent, UX artifacts | `references/structure.md` |
| Thin PRD: five requirement types, six user groups, persona quality, journey maps, checking with users and data | `references/requirements.md` |
| Choosing between options: How Might We, 5 Whys, JTBD, three selection angles | `references/ideation.md` |
| Three layers of knowledge, HIG's eight principles, task modelling, usability criteria, product pillars, UI foundations | `references/foundations.md` |
| Screen names and suffixes | `../bnnam-standards/references/naming.md` |
| Read the flows of an existing Figma file (maintenance) | `../figma-project-maintain/scripts/flowmap.js`, `../figma-project-maintain/references/maintain.md` |
| Detect screen type and main components of existing screens | `../figma-project-maintain/scripts/situations.js` |
| Frame structure for wireframes | `../mobile-ui-master/references/screen-structure.md`, `../bnnam-standards/references/frame-standards.md` |
| Paywall, sale, ad-gate screens in the flow | `../mobile-ui-master/references/monetization-screens.md` §8 |
| Adaptive projects (iOS 27, iPhone Duo, iPad) | `../iphone-duo-adaptive/SKILL.md` |

Do not read everything at once: each job needs its own reference, plus a lens only when the situation calls for it.

## Core rules
1. **Read the native format, never a conversion.** Converting to markdown loses merged cells, diagrams, comments and text boxes. Read
   all five layers and always report coverage — without it nobody knows what the extract is missing.
2. **Every item points back to its exact place** — `source: PRD.docx · §11 Monetization · table 2 · row "Annual"`. The original file
   stays the source; when unsure, reopen it.
3. **Never invent, never pick a side.** Numbers, prices and names come from the documents. Bans are quoted verbatim. Unresolved
   comments, unaccepted tracked changes and documents that disagree go to the user — the newest file is not always the right one.
4. **Borrow structure from competitors, not content or style.** Layout, block order, primary-action position, step count and copy
   rhythm — yes; features, names, sample copy, colors — no. Count (`appears: 2/3`), don't feel. Rejected patterns are recorded too.
   Competitor screenshots are images: read them by eye, never conclude "no screens" from an empty node query.
5. **`flows.md` is the single source of screen names.** A new screen goes into `flows.md` before it is built; a later stage that finds
   a missing screen comes back here first.
6. **Count in three layers plus overlays** — main path · every outcome of every decision point · data states (each core screen pulls in
   1–2) · modals, sheets, dialogs, toasts. Sweep every core screen with the 15-state table; decide own screen / variant / annotation so
   the list neither bloats nor misses screens.
7. **No empty cell in the state matrix, and every state has an exit.** Fill the "Mastered" column — it decides when to stop teaching.
   Projects with Android say where system back goes.
8. **No permission screens by default.** Assume permissions are granted; behaviour on denial goes to the dev note. A project that wants
   otherwise records a decision.
9. **Every sentence that asserts a state is an assumption** (`A-##`) a developer verifies before the UI is built.
10. **Stop at each approval gate.** PRD, analysis, flows and wireframes are each approved by the user (*"duyệt PRD"*, *"duyệt
    flows"*…) before the next job relies on them.

## Workflow
1. **Read the PRD** (`references/prd-read.md`): find the documents → read five layers (`scripts/docx_extract.py` for `.docx`, then open
   the images) → extract `design/prd.md` from the template → report coverage, *Could not read*, *Where I interpreted*, *Need to ask* →
   stop for *"approve PRD"*.
2. **Analyse** (`references/analyze.md`): contradictions with both sides verbatim → gaps with type and proposal → competitor scan
   (inventory → scope gate → anatomy → USE / DON'T) → crop matching competitor screens by function → stop for approval.
3. **Flows** (`references/ux-flow.md`): task analysis → IA → redraw competitor flows, then yours → count screens → state sweep and
   matrix → assumptions → write `design/flows.md` → cross-check and `trace` → stop for *"approve flows"*. Voice can run in parallel
   (`ux-writing`).
4. **Wireframe — only if the designer asked** (`references/wireframe.md`): one prototype per interaction type; the template screen
   first, then batches by flow; three rows per flow section; audit in `wireframe` mode → stop for *"approve wireframe"*. Otherwise the
   UI build (`figma-ui-flow`) starts from the approved `flows.md`.

For a single question (*"what does the PRD say about X"*, *"does FR-008 have a screen"*, *"what breaks if I delete screen X"*), answer
from the existing files with the matching step only — `trace` is read-only.

## Common pitfalls
- Reading a markdown conversion of the PRD and missing a merged price table or a decision sitting in a comment.
- Filling a thin PRD with guesses instead of listing them under *Gaps — ask the user*.
- Copying a competitor's feature names or copy along with the layout.
- Stopping at the two branches drawn in the PRD (login has at least four outcomes).
- Turning every toast and label change into a screen — or leaving loading, empty and offline out entirely.
- Building permission-explainer screens nobody asked for.
- Keeping a separate traceability table that drifts from `flows.md`.
- Adding a screen in Figma that `flows.md` does not have.

## Self-check before reporting
- PRD: coverage report present, every item has an exact `source:`, unreadable parts named.
- Analysis: both sides of every contradiction quoted, scope gate applied, rejected patterns recorded.
- Flows: every screen in ≥ 1 flow, every flow step matches a screen heading, no FR without a screen, no screen without FR/UC, no empty
  *entered from* / *leads to* without a reason, every matrix cell filled or explained, assumptions listed.
- Wireframe (if built): acceptance list in `references/wireframe.md` §11 met.
