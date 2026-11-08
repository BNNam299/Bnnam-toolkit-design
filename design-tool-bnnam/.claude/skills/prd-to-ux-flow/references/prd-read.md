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

## 7. Using `scripts/docx_extract.py`

For a `.docx` PRD:
```
python <skill>/scripts/docx_extract.py product/sources/prd/<file>.docx -o design/extract/<file>.md
```
- **Writes nothing into `sources/`** (the script refuses an output path containing `/sources/`); the extract is the agent's file in `design/extract/`.
- The extract carries locations (¶ paragraph · table · row · sheet), comments attached to their paragraph, merged cells marked
  (`↑` = content in the cell above, `←` = content in the cell to the left), embedded images and Excel tables, and a **Could not read**
  section.
- Lark / Feishu embedded blocks export as *"[This type of content is unavailable…]"*; embedded files that are not Excel → **ask the
  user for the original or a link**, never skip silently.
- The extract is for fast reading; **the original file is still the source**. Images listed by the script still have to be opened
  and looked at (layer 3).

## 8. Embedded tables — Excel, spreadsheets

A PRD `.docx` often embeds Excel tables (field specs, permission matrices, notification lists…). Open the file as a zip: embedded
tables sit in `word/embeddings/` (`.xlsx`, `.xls`, `.bin`). Read every sheet as a source of the PRD and extract with full location:
`source: <file> · embedded table <name> · sheet <name> · row <n>`. An embedded table that **cannot be read** → report its name and
location and ask the user to send the Excel file separately — never skip silently. Coverage counts embedded tables too.

## 9. Stop-and-ask points and self-check

Stop and ask:
- Several documents disagree → stop, ask (§3).
- *Gaps — ask the user* (§6).
- Approval of the PRD extract (report).

Self-check before reporting:
- Coverage report present (mandatory).
- Every item has an exact `source:` (§6).
- Unreadable embedded tables reported (§8).

## 10. Report — coverage report is mandatory

Without a coverage report nobody knows what the extract is missing.

```
Read
  headings         42  (4 levels)
  tables           11  (3 with merged cells)
  images            6  (looked at 6)
  comments         17  (5 unresolved)
  tracked changes   8  (not accepted)

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
