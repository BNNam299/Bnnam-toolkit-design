# Inputs, missing data and hand-offs

## 1. What each step reads
| Input | Where | Used by | What to take |
|---|---|---|---|
| Market decision and hand-off | `docs/market/market-report.md` §6–7 | kickoff | the decision (làm tiếp / đổi hướng / dừng), the chosen idea sentence, what the product step must know, open questions, assumptions still to verify |
| Pains, competitors, price anchor | `docs/market/market-report.md` §3–5, `evidence.md` | kickoff, users, plan | need clusters with evidence numbers (cite as `M#…`), free-vs-paid matrix, price anchor, competitor archetypes, money check by tier |
| Dev's technical answers | `docs/market/raw/dev-answer-*.md`, `docs/product/raw/` | plan, spec, detail | feasibility per capability with date — Dev's word is final, AI never overrides it |
| Kick-off minutes, team feature sheet (Feature / Execution / IAP / KPI templates) | `docs/product/raw/` | plan | Dev feasibility and hour estimates, chosen scope and dates |
| Flows and screen list | `design/flows.md`, `design/prd.md` (design toolkit) | detail | screen names (single source once it exists), states, assumptions `A-##` Dev must verify |
| Figma / FigJam links (boards, flows, sitemap, wireframe, UI) | prd.md §1 "Liên kết", or the user | every step (§6) | where each picture lives — linked from the text, never copied in |
| UI | Figma link in prd.md §1 | detail | real components per screen for the screen rules table — read by eye; ask the user for frames or screenshots if no Figma access |
| Live data after release | `docs/product/raw/` (dashboards, A/B results, reviews) | plan | evidence for new requests (`P#…`) |

## 2. Missing input — say it, ask, then continue honestly
At the start of each step check what it depends on:
- **kickoff**: a market decision "làm tiếp" (or the user states the idea is assigned and stopping is not an option — record that as a
  decision).
- **users**: pains with evidence (market §3) or interview / survey data in `raw/`.
- **plan**: §2–5 filled; for an update version, the shipped version's row in §13.
- **spec**: the version's FEATs at *Đề xuất* with an approved scope decision.
- **detail**: the UI for those FEATs exists (Figma / screenshots) and `design/flows.md` if the design toolkit was used.

If something is missing: tell the user exactly what, **before writing anything that depends on it**, and ask whether to continue. If
yes: continue, mark every guess **giả định** where it is used, and add a row to prd.md §14 (assumption · what would verify it · what
changes if wrong). If no: stop and say what to bring. Parts that do not depend on the missing input may be listed as "làm được ngay"
in the question, but are still not written before the user answers.

## 3. Personas without real data
Market review mining is real evidence of pains, but it is not an interview. Personas built only from it are **proto-personas**: label
them "GIẢ ĐỊNH (proto) — dựng từ đánh giá store và diễn đàn, chưa phỏng vấn" and add the light check this team can do to §14:
5–7 questions for the next 1–2 people the lead can ask, and the post-launch number that confirms or breaks each persona
(`product-users/references/users.md` §5). No formal interview round or large survey.

## 4. Hand-offs
| To | When | What to send | Format |
|---|---|---|---|
| Design toolkit (`prd-to-ux-flow`) | after product-spec, version at *Đủ để thiết kế* | prd.md (§4 bans, §5, §8 touchpoints, §10–12) + requirements.md §1–2, §5 | the design toolkit looks for PRD files in `product/sources/prd/` of the app project: **copy** `prd.md` and `requirements.md` there (ask first if files already sit there), and say in the report that `docs/product/` stays the source — after a change, copy again. It reads BAN / FR / UC IDs unchanged |
| Dev — feasibility | product-plan (kick-off sheet) and product-spec (Dev questions) | feature list with what each needs and where we are unsure; DQ list | a short block in chat + requirements §8 |
| Dev — build and test (no separate QA) | after product-detail, version at *Đủ để build* | prd.md + requirements.md + export/*.docx + the retest scope (prd.md §13) | .md for Dev's agent, .docx for people; AC tagged [Lead kiểm] / [Dev kiểm] |
| Build toolkit (`/ios-spec`) | same | requirements.md (FR-, UC-, AC-) and prd.md sections it cites | IDs unchanged |

## 5. What this toolkit does not own
Prices and paywall scenarios are drafted here until a monetize toolkit exists; KPIs and events are drafted here until a measure
toolkit exists. Both are labelled "Bản nháp — sẽ chuyển sang bộ monetize / measure khi có". Store listing, ASO, screenshots belong
to growth; architecture belongs to Dev.

## 6. Figma / FigJam links — from the first step
Figma and FigJam are **one display group**: flows, sitemap / information architecture, wireframe, UI, boards, diagrams, the
team's whiteboard — pick whichever fits (FigJam handles flows and sitemaps too; UI and wireframes are usually Figma). The text (prd.md, requirements.md) stays the source; a picture is linked, never pasted in as the only content. Teams often
have boards or early flows before the PRD, so links start at kickoff, not after the UI.
- **Every step asks once** whether new Figma / FigJam files exist, then puts the links where readers look: §1 "Liên kết", the
  "Đọc theo vai trò" block, the `Hình:` line of each FEAT, the "Hình" column and sitemap line of §11, §12, the branch diagram in §8.
  Link to the frame when possible (`?node-id=`). No link → "chưa có"; never invent a URL.
- **Branch logic** (who sees what and when: paywall, trial, free limit, ads, config switches, onboarding variants, feature
  conditions) is a table "Nếu … thì … · ngược lại …" in the text — money in prd.md §8 "Rẽ nhánh", feature logic in its FEAT block
  (business rules with formulas stay in requirements BR, cited by ID). Every condition has both outcomes; no dead end.
- **The diagram is drawn from the table.** When the Figma MCP is connected and the user agrees, draw it on FigJam (load the
  `figma-generate-diagram` skill before `generate_diagram`) and paste the link under the table; otherwise leave "chưa có" and list it
  for the designer. Table changed → redraw. Dev comments on FigJam → change the table first, then redraw; the diagram is never
  edited as the source.
- **Drawing style** (team convention from its draw.io flows): two lanes User / System; rectangle = screen, diamond = decision,
  dashed = optional path, red = error. Every condition in the table appears as a diamond with both exits.
- **When the design toolkit returns** flows, wireframes or UI, copy its links into the same places; screen names follow
  `design/flows.md`.
