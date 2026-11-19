# Job 1 — Read the PRD and extract `design/prd.md`

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/modules/prd-read.md @ 3c0e291 — translated, complete

The most expensive mistakes in earlier projects did **not** happen in Figma but while reading the documents: building a banned
feature, wrong prices, a paywall placed where the document forbids it. Design work starts here.

## Contents
1. When to use
2. Inputs and outputs
3. Step 1 — Find the documents
4. Step 2 — Read the native format, five layers
5. Step 3 — How to read without assuming tools
6. Step 4 — Extract into `prd.md`
7. Using `scripts/docx_extract.py`
8. Embedded tables (Excel, spreadsheets)
9. Stop-and-ask points and self-check
10. Report (coverage report is mandatory)
11. Knowledge lenses

---

## 1. When to use

- Starting a new project that has a PRD.
- The PRD changed and must be extracted again.
- Looking up *"what does the document say about X"*.

**Not for** competitor analysis (`analyze.md`), flows (`ux-flow.md`) or editing Figma. This skill **does not write** the PRD.

## 2. Inputs and outputs

| Check | If missing |
|---|---|
| At least one requirements document exists (e.g. `product/sources/prd/`, keep all PRD files in one place) | Stop: *"drop the PRD into `product/sources/prd/` to start"* |

No other `design/` file is needed.

| Reads | Writes |
|---|---|
| every file in the PRD folder · a PRD supplement (`product/prd-supplement.md`, read alongside, if present) · an intake content map (`product/intake.md`, if present) | `design/prd.md` (`status: draft`) from `assets/prd.template.md` |

The sources folder is **read-only**: never write into it. Agent-made extracts go to `design/extract/`.

## 3. Step 1 — Find the documents

Ask for, or search for: the requirements document · a screen list if one exists · scope and bans · decisions already made · where
competitor screenshots are kept.

**Several documents disagree → say so and stop.** The newest file is not always the canonical one. Do not pick a side.

**One file, several layers in time.** A PRD kept alive in one doc (Lark, Notion, Google Docs) often stacks releases on top of each
other: *MVP · Update Aug–Sep · Update Oct · Draft*. This is not "several documents disagree" — do not stop the whole job:
1. Spot the layers by headings, dates, version names or the word *Draft* / *Nháp*, and list them in the report with their
   paragraph range. For a `.docx`, the *Outline* at the end of the extract shows the top heading level — layers usually sit
   there. Numbering that carries on across layers (scenarios 1–4 in one layer, 5–10 in the Draft) does not make them one layer.
2. Same topic written differently in two layers → by default the **newest finished layer wins**; the older text is history, not a
   requirement. A layer marked *Draft* (or undated and clearly unfinished) is **not decided** → its items go under *Gaps — ask the user*.
3. Every extracted item records its layer: `source: PRD.docx · Update Oct · §3 Paywall · table 2 · row "Weekly"`.
4. Ask **one** question to confirm the reading: *"I read the layers as MVP → Aug–Sep → Oct (newest wins), Draft = not decided. Right?"*

## 4. Step 2 — Read the native format, five layers

Do not convert to markdown and then read. Conversion loses merged table cells, diagrams, comments and text boxes — exactly the
*gaps* that appear when reading through md.

| Layer | How to read | Why |
|---|---|---|
| **Text and structure** | paragraphs in order · heading levels · numbered lists | the PRD's skeleton |
| **Tables** | every cell, **including merged cells** — record which cell merges rows/columns | price tables and Free/Premium permission tables often merge cells; misreading shifts columns |
| **Images, diagrams** | extract the images, **look at them visually** | user flows are often drawn inside Word |
| **Comments, tracked changes** | read both, record them separately | the latest decision often sits in a comment not yet merged into the body |
| **Text boxes, drawings** | read content outside the main text flow | often skipped entirely |

Also: **text color and highlight** — if the PRD uses colors to mark status (*decided*, *under discussion*), record what each color
means and apply it while extracting.

## 5. Step 3 — How to read without assuming tools

Detect what the environment has, then choose:

1. A dedicated docx-reading library, if available (in this repo: the `anthropic-skills:docx` skill, or `scripts/docx_extract.py`).
2. A command-line converter, **for reading only** — never keep the converted file as a source.
3. **Always available:** a `.docx` is a zip archive — unzip it and read the XML inside:
   - text, tables: `word/document.xml` (merged cells: `<w:gridSpan>`, `<w:vMerge>`)
   - comments: `word/comments.xml`
   - images: `word/media/`
   - tracked changes: `<w:ins>` `<w:del>` tags in `document.xml`
   - text boxes: `<w:txbxContent>` in `document.xml`

Option 3 works on every agent, even with nothing extra installed.

**PDF, Google Docs exports:** same principle — read the native format, cover the equivalent five layers, report coverage. A scanned
PDF needs OCR — state clearly that it is an OCR version with lower confidence.

## 6. Step 4 — Extract into `prd.md` — an extract, not a conversion

Template: `assets/prd.template.md`. `prd.md` is a **structured catalogue in which every item points back to its exact location in
the original file**. The original stays the canonical source; when unsure, **reopen the original** instead of trusting the extract.

| Section | Id | Rule |
|---|---|---|
| **Scope** in / out | — | |
| **Bans** | `BAN-##` | quoted **verbatim** |
| **Requirements** | `FR-###` | ids as in the PRD; PRD has no ids → number in order and mark `id: assigned by agent` |
| **Use cases** | `UC-###` | |
| **Decisions already in the PRD** | `PRD-DEC-##` | quoted verbatim |
| **Gaps — ask the user** | — | |

**Cite the exact location** — every item has `source:` down to **heading → table/figure → row/paragraph**:
```
- source: PRD.docx · §11 Monetization · table 2 · row "Annual"
```
So the user can open the original and find it at once, and the agent can reopen the exact spot to verify.

**Unresolved comments and unaccepted tracked changes** are not final decisions — put them under *Gaps — ask the user*.

**Never invent** — every number, price and proper name comes from the document. A thin PRD → write it under *Gaps*; do not fill it with
guesses.

### 6.1 UX work the PRD already did

Some PRDs arrive with UX thinking already done — the product toolkit writes personas, jobs, a journey, task analysis, a text sitemap,
overall flows, a screen list and onboarding steps into its PRD (§5, §10–12 there); other teams' PRDs may carry a few of these, or none.
Redoing that work wastes time, and worse, produces a second version that quietly disagrees with the one the team already agreed on. So
while reading, **look for these by content, not by heading name** (any language, any layout), and extract what exists into the
section *UX already in the PRD* of `prd.md`:

| Part | Recognise it by | Extract |
|---|---|---|
| Users | personas, "who is NOT a user", empathy map, mental model | id, one-line positioning, goal, pain — and the **proto / assumed** label if the PRD marks it so |
| Jobs | "When … I want … so that …", jobs to be done, user goals | id + the sentence verbatim |
| Journey | stages, break points, moment of truth, "aha" / value moment and its step count | stages + the value moment verbatim + step count |
| Task analysis | goal → task → action table | rows, with the feature / screen each maps to |
| Sitemap / IA | navigation type (tab, linear, hub…), a screen tree | navigation type + reason, the tree as written |
| Screen list | screen ids (`SCR-01`…) or a numbered list of screens | id, name, feature, priority |
| Flows | overall flows (first open → value, daily return), per-feature main flow, unhappy branches, branching tables | steps verbatim, decision points and their outcomes |
| Onboarding | steps, questions asked, skippable or not | rows |
| Screens often forgotten | a checklist the PRD gives (paywall + restore, permission + denied, offline…) | the list |
| App-wide situations | a table or list of cases that touch **several features** at once — permission denied, offline / connection lost, reconnect, app killed and reopened, update required… The product toolkit's PRD has it as *Tình huống chung cho cả app* (§10: group · situation · how the app knows · what the user sees, can do · features affected); other PRDs call it *Edge Cases chung*, *Common edge cases* or just list them under one feature | one row per case, verbatim: group, situation, how the app knows, what the user sees / can do, features affected |
| Permissions and their popup text | a permission table (product toolkit: `requirements.md` `PRM-##` — permission · when asked · text in the system popup · granted · denied · permanently denied) or permission wording anywhere in the PRD | id, permission, when it is asked, the popup text **verbatim**, what happens on grant / deny / permanent deny |

Each part gets a status: **present** (usable as a starting point) · **partial** (say what is missing — e.g. tree without navigation
type, main flow without unhappy branches) · **absent**. Every extracted item keeps its exact `source:` like any other item.

Nothing found → write *none — Job 3 builds everything itself* and carry on exactly as before. This step never asks the user for UX
parts the PRD does not have and never blocks: a PRD without UX is a normal PRD.

## 7. Using `scripts/docx_extract.py`

For a `.docx` PRD:
```
python <skill>/scripts/docx_extract.py product/sources/prd/<file>.docx -o design/extract/<file>.md
```
The last line printed is the count for the coverage report (paragraphs · headings and levels · tables · images + table previews · embedded tables ·
comments · tracked changes · text boxes · links · unreadable places).
- **Writes nothing into `sources/`** (the script refuses an output path containing `/sources/`); the extract is the agent's file in `design/extract/`.
- The extract follows the reading order of the document and carries:
  - locations (¶ paragraph · table · row · sheet); merged cells marked (`↑` = content in the cell above, `←` = content in the cell
    to the left);
  - **images at their place** — `🖼 image12.png (2560×2560 px) · after ¶256` — so you know which section each picture belongs to;
  - **embedded Excel tables at their place** (`📊`, every sheet, every row). Word keeps a preview picture of each embedded table; the
    script counts those apart (*47 images · 16 preview pictures*) — a preview is not an image to look at, its table is printed;
  - **comments** on their paragraph, image or table cell — also on a paragraph with only an image — with author, date,
    *resolved / open* (or *not recorded* when the file does not say) and replies under the comment they answer. A comment the script
    cannot place is listed under *Comments not tied to a place*, never dropped;
  - **tracked changes not yet accepted** inline: `{+inserted+}` `{-deleted-}` — not final, they go under *Gaps*;
  - **text boxes** (`🗒`) and **links with their address**, collected again under *Links in the document*;
  - a **Could not read** section.
- Lark / Feishu embedded blocks export as *"[This type of content is unavailable…]"*; embedded files that are not Excel → **ask the
  user for the original or a link**, never skip silently.
- **PRDs exported from Lark (or any online doc).** Boards, flow drawings and pasted notes come out as one picture squeezed to the
  page width — a whole board in 2560 px leaves note text a few pixels high. When you open an image and cannot read its text at full
  size, do not guess: list it under *Could not read* (image name, where it sits, what it seems to show) and ask for the link to the
  board or a bigger export. Check *Links in the document* first — the readable original is often already linked there.
  - *Full size* means the file's own pixels: an image viewer shrinks a 2560 px picture to fit, so before deciding, crop the
    unreadable area at original resolution (any image tool) and look again. Only what is still unreadable goes under *Could not read*.
  - A sticky note whose text runs past its box is cut off **in the board itself** — no crop brings it back. List it the same way
    (*"note cut off: «Trong lúc hiển thị popup này, nếu đang…»"*).
  - A picture that does not match the heading it sits under (an old flow pasted under a new scenario, store screenshots under a
    paywall scenario) is not evidence for that heading: write what it shows under *Where I interpreted* and ask where it belongs.
  - A picture used twice is marked by the script (*same picture already placed after ¶…*) — read it once, cite both places.
- The extract is for fast reading; **the original file is still the source**. Every `🖼` image still has to be opened and looked at
  (layer 3).

## 8. Embedded tables — Excel, spreadsheets

A PRD `.docx` often embeds Excel tables (field specs, permission matrices, notification lists…). Open the file as a zip: embedded
tables sit in `word/embeddings/` (`.xlsx`, `.xls`, `.bin`). Read every sheet as a source of the PRD and extract with full location:
`source: <file> · embedded table <name> · sheet <name> · row <n>`. An embedded table that **cannot be read** → report its name and
location and ask the user to send the Excel file separately — never skip silently. Coverage counts embedded tables too.

## 9. Stop-and-ask points and self-check

Stop and ask:
- Several documents disagree → stop, ask (§3).
- One file with several layers in time → one question confirming which layer wins (§3) — do not stop the rest of the work.
- *Gaps — ask the user* (§6).
- Approval of the PRD extract (report).

Self-check before reporting:
- Coverage report present (mandatory), including the *UX already in the PRD* line (or *none*).
- Every item has an exact `source:` (§6).
- Unreadable embedded tables reported (§8).
- Comment count equals the file's (`word/comments.xml`); every comment is placed or listed — none dropped.
- Images whose text was too small to read are under *Could not read*, not guessed (§7).

## 10. Report — coverage report is mandatory

Without a coverage report nobody knows what the extract is missing.

```
Read
  headings         42  (4 levels)
  layers in time    3  (MVP → Update Oct → Draft · newest finished wins, Draft = not decided — confirm?)
  tables           11  (3 with merged cells)
  embedded tables   4  (Excel, read all sheets)
  images            6  (looked at 6 · 1 text too small — asked for the board link) · 4 table previews not counted
  comments         17  (5 unresolved)
  tracked changes   8  (not accepted)
  links             5  (2 Lark boards)

UX already in the PRD             (Job 3 starts from the present / partial parts)
  users ✔ present · jobs ✔ · journey + value moment ✔ (4 steps) · task analysis ✗ absent
  sitemap ◐ partial (tree, no navigation type) · screen list ✔ 14 SCR · flows ◐ (main flows, no unhappy branches) · onboarding ✔
  app-wide situations ✔ 6 rows · permissions ◐ 2 PRM (popup text for 1 — the other under Need to ask)

Could not read
  · 1 SmartArt in §5 — the user must describe it or export an image
  · 2 embedded objects in §9

Where I interpreted instead of quoting verbatim
  · <list, or "none">

Need to ask
  · comment #12 contradicts the body text of §11 — which is right?

Next steps
  → "approve PRD"                 after the Need-to-ask items are answered
  → "analyse competitors"         once prd.md is approved — drop screenshots into design/sources/competitors/
```

*"Where I interpreted instead of quoting verbatim"* is the equivalent of *"where I had to decide myself"* — never leave it empty when you
did interpret.

User says *"approve PRD"* (*"duyệt PRD"*) → write `status: approved`, `approved: <date>` into `prd.md`.

## 11. Knowledge lenses

`requirements.md` and `foundations.md` — when the PRD looks thin (the five requirement types), when the PRD has personas, when the
payer differs from the user. They are lenses for thinking, not extra steps.
