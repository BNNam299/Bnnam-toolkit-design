---
name: product-standards
description: Shared rules for every product-definition step - the output layout (docs/product/ with prd.md, requirements.md, decisions.md, export/ and a read-only raw/), the PRD as a living document that grows by version, feature levels (Đề xuất, Đủ để thiết kế, Đủ để build, Đã phát hành), ID rules (BAN, PER, JTBD, FEAT, UC, FR, NFR, BR, PRM, SCR, EVT, D, R, DQ), writing every role understands, who does what in a lead + iOS / Android Dev team, requirement and acceptance-criteria rules, the quality gates and anti-patterns from the team's real PRDs, reading inputs from docs/market and the design toolkit, the missing-data rule, and exporting .docx. Read before any product-kickoff, product-users, product-plan, product-spec or product-detail run, and when the user asks how a PRD or requirement should be written, numbered, reviewed or exported. Vietnamese triggers such as "chuẩn PRD", "viết PRD thế nào", "soát PRD", "xuất PRD ra word", "đánh mã yêu cầu", "tiêu chí nghiệm thu viết sao".
---

# product-standards — the rules every product step follows

The product toolkit turns a market decision into what to build: scope, users, features, versions, and requirements Dev and QA can
accept. Five step skills decide **what** to write; this skill decides **how it is written, numbered, stored, reviewed and exported**.
When a step skill and this skill disagree on writing, IDs or layout, this skill wins; the step skill wins on method.

## The steps (one skill each)
| Skill | Runs | Fills |
|---|---|---|
| `product-kickoff` | once, or when the direction changes | prd.md §0–4, §6 · decisions D-01… |
| `product-users` | once; again when new user data arrives | prd.md §5 |
| `product-plan` | **every version** (1.0.0, then each update) | request queue · §4 updates · §7–8 drafts · §10 table · §13 · kick-off sheet |
| `product-spec` | every version, **before design** | features of that version → *Đủ để thiết kế*: §9–12, requirements §1–6 |
| `product-detail` | every version, **after the UI exists** | same features → *Đủ để build*: screen rules, monetization detail, events, AC · review · .docx |

**Who does what.** The user — a designer who is also the lead — runs every step and holds every role except code (PO, UX, UI test,
ASO, data). The iOS and Android Devs answer technical questions, build, and test logic, data and payments. There is no separate PO,
QA or analyst. Choices are made by the lead alone or in a team meeting, depending on the matter; the kick-off of every version is a
team meeting. The AI proposes and challenges, never decides.

The PRD is not written in one or two passes. It is a living document: Part A (product level) changes rarely, Part B grows one feature
at a time, Part C records each version. A later update (a new paywall scenario, a new feature, an A/B test) enters through
`product-plan` and walks the same levels — it never rewrites what has shipped.

## Output — one fixed place, in the app project
```
docs/product/
├── prd.md            ← main document; Part A product · Part B features · Part C versions
├── requirements.md   ← UC · FR + acceptance criteria · NFR · BR · permissions & data · events · transactions
├── decisions.md      ← append-only decision log D-… and the request queue R-…
├── export/           ← prd.docx, requirements.docx for people (generated from the md, never edited by hand)
└── raw/              ← files the user brings (kick-off minutes, Dev answers, data) — read only
```
Inputs live elsewhere and are read, never edited: `docs/market/` (market toolkit), `design/` and Figma (design toolkit).
Create missing files from `assets/`. Sections whose step has not run stay as heading + `Chưa làm — <skill>`. Documents are in
**Vietnamese**; address the user as "bạn".

## Need → Read
| Need | Read |
|---|---|
| What to keep and cut, quick-read lines, plain first sentence, terms, tables, wording to avoid | `references/writing.md` |
| IDs, feature levels, versions, how to change something already approved or shipped | `references/ids-and-states.md` |
| Reading docs/market, Dev answers, design outputs; missing-data rule; hand-offs to design and build | `references/inputs-and-handoffs.md` |
| Figma / FigJam links in the text, branch tables "nếu … thì …", drawing the diagram on FigJam | `references/inputs-and-handoffs.md` §6 |
| Writing UC, FR, acceptance criteria, NFR, BR, permissions and data, events | `references/requirements-writing.md` |
| The review: 5 gates, 8 anti-patterns from real PRDs, orphan checks, easy-to-miss groups, dark patterns | `references/quality-gates.md` |
| Gate 0: Apple App Review and Google Play rules, privacy / ATT / MASVS, sensitive categories, paywall checklist, safety for wellbeing apps | `references/policy-and-safety.md` |
| Templates | `assets/prd.template.md`, `assets/requirements.template.md`, `assets/decisions.template.md` |
| Export to .docx | `scripts/export_docx.js` — see "Export" below |
| A step's method leaves the question open: more frameworks by kind of problem (OST, impact mapping, forces of progress, SCAMPER, assumption mapping, pre-mortem, VPC, North Star tree…) and how to mix them | `references/thinking-toolbox.md` |
| Mistakes from earlier runs and the rule each became — **read before reporting** | `references/toolkit-lessons.md` |
| Mechanical check (feature table vs blocks, levels, UC / FR / AC links, AC tagged Lead / Dev, traceability, D- ids, wording) | `scripts/check_product.py docs/product` |

## Core rules
0. **Only what carries weight.** Every sentence carries a number with its source, an evidence or requirement ID, a decision, or a
   marked assumption. Generic prose ("trải nghiệm mượt mà", "giao diện thân thiện") is cut — `references/writing.md` §1.
1. **Every feature traces back.** A FEAT points to a user pain or competitor gap from the market research (`M#12`) or to new product
   evidence (`P#3`), and to a persona / job. A feature that points nowhere is a candidate to cut, not to build.
2. **Never invent.** No market numbers, interview results, prices or benchmarks from memory. Missing → "chưa có số" or **giả định**
   with what would verify it, listed in prd.md §14.
3. **What, not how.** PRD and requirements say what the app does and how it is accepted. Architecture, APIs, schemas, library names
   belong to Dev. Missing technical facts → **giả định** + a Dev question `DQ-…`; AI never concludes "làm được".
4. **One owner per fact.** A price lives only in prd.md §8; a formula only in requirements BR; a screen name only in the design
   toolkit's `design/flows.md` once it exists. Other places cite the ID.
5. **Decisions are recorded, not remembered.** Anything the user or team chooses gets a `D-…` line (who, date, why). Changing an
   approved or shipped item = a new decision + a row in "Lịch sử tài liệu", never a silent edit.
6. **Missing input: say it, ask, then continue honestly** — before writing anything that depends on it. If the user agrees, continue
   with marked assumptions and list them in §14.
7. **Plain decisions and plain words.** No "GO / NO-GO", no unexplained jargon; terms explained in parentheses at first use.
8. **Credentials never enter a document.**
9. **Gate 0 is not ranked.** Store policy, privacy and safety items (`references/policy-and-safety.md`) are in the version or the
   version does not ship; they never compete with features on a score.
10. **Each role finds its part fast.** prd.md keeps the block "Đọc theo vai trò" under §0 (Dev → sections, Designer → sections,
    each with a link and the Figma / FigJam link once it exists) and the tags [Dev] / [Design] on section headings. Update the block
    whenever a step fills a section. Flows, sitemap, wireframe, UI and diagrams live in Figma / FigJam (one display group, pick
    whichever fits); the text stays the source and links to them from the first step — branch logic (config, monetization,
    feature conditions) is a "nếu … thì …" table in the text, the diagram is drawn from it (`references/inputs-and-handoffs.md` §6).
11. **Name the method used.** When a step follows an established method or matrix (5 Whys, Lotus Blossom, RICE, Kano, story map,
    HEART, cognitive walkthrough…), say so where it is used ("Cách làm: …"), list it in prd.md §15 "Phương pháp đã dùng", and name
    it in the reply — `references/writing.md` §7. When a step's own method leaves the question open, add a second tool from
    `references/thinking-toolbox.md` (mixing rules §8) and name both.

## Export — md for agents, docx for people
The md files are the source: Dev's own agent reads `prd.md` and `requirements.md` directly. The .docx is for people to read and is
regenerated from the md — changes go into the md, then export again; never edit the .docx.
`NODE_PATH="$(npm root -g)" node <skill-dir>/scripts/export_docx.js docs/product/prd.md docs/product/export/prd.docx` (same for
requirements). It needs the npm package `docx` (installed globally); if the script says it is missing, ask the user before
installing. Export only after the review in `references/quality-gates.md`; open items stay visible, never exported as if final.

## Self-check before any step reports
- Run `python <skill-dir>/scripts/check_product.py docs/product` (prefix `PYTHONUTF8=1` on Windows) and fix every LỖI; read each
  CẢNH BÁO and fix it or say why it stays. Re-read `references/toolkit-lessons.md` — none of those mistakes repeated.
- §0 quick-read lines updated; later sections still one line "Chưa làm — …".
- Every new FEAT / UC / FR has a source; IDs continue the sequence, nothing renumbered.
- New decisions in decisions.md; new assumptions and open questions in §14.
- The delete test passed (`references/writing.md` §1).
- Methods actually used are named where used, listed in §15 "Phương pháp đã dùng", and named in the reply's "Cách làm:" line;
  nothing named that was not applied.
- The report names the next step and skill.
