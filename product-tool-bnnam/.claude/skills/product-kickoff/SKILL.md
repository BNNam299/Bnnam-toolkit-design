---
name: product-kickoff
description: Step 1 of the product toolkit - turns the market decision into a product frame. Reads docs/market (decision, chosen idea, evidence, competitors), checks the market said "làm tiếp" (or the idea is assigned), then with the user writes the problem → solution pairs, why now, positioning, success criteria, product principles ("ưu tiên A hơn B"), what the first version must prove, in-scope / out-of-scope / bans (BAN-01…) and the "không được cắt" list; creates docs/product/ (prd.md §0–4 and §6, requirements.md, decisions.md, raw/). Use whenever the user wants to start defining a product after market research, write or start a PRD, lock scope, set bans, or re-frame the product after a change of direction, even without naming the step. Vietnamese triggers such as "bắt đầu PRD", "định hình sản phẩm", "khoá phạm vi", "scope lock", "điều cấm", "định vị app", "nguyên tắc sản phẩm", "chuyển từ market sang product". Later steps - product-users, product-plan, product-spec, product-detail.
---

# product-kickoff — step 1: what this product is, and what it is not

Scope creep and features nobody can trace back to a user are the two costliest failures in the team's past PRDs. This step fixes the
frame before any feature is listed: what the first version must prove, what is out, what is forbidden. It is a discussion with the
user, not a run-through.

**Read first:** `../product-standards/SKILL.md`.

## Need → Read
| Need | Read |
|---|---|
| Questions to ask, problem → solution pairs, why now, positioning, success criteria | `references/kickoff.md` §1–3 |
| Principles that actually decide something | `references/kickoff.md` §4 |
| Proof sentence, in / out / bans, "không được cắt" | `references/kickoff.md` §5 |
| Gate 0 bans and positioning for sensitive categories (health, kids, privacy) | `references/kickoff.md` §6, `../product-standards/references/policy-and-safety.md` |
| Reading docs/market and the missing-data rule | `../product-standards/references/inputs-and-handoffs.md` §1–2 |
| Templates | `../product-standards/assets/` |

## Workflow
1. **Look before asking.** If `docs/product/prd.md` exists with §2–4 filled, this is a re-frame: show what is there and ask what
   changed; the change becomes a decision, never a silent rewrite. Read `docs/market/market-report.md` (§0, §5–7), `evidence.md`, and
   files in `docs/product/raw/`.
2. **Check the market decision** (`../product-standards/references/inputs-and-handoffs.md` §2). Not "làm tiếp" or no market folder →
   say so and ask before writing anything.
3. **One round of questions** (`references/kickoff.md` §1) — only what the market documents did not answer; offer a default for each.
4. **Draft, then let the user react**: problem → solution pairs with evidence, why now, positioning, success criteria, principles,
   proof sentence, in / out / bans / "không được cắt". Drafts are faster to correct than blank pages.
5. **Create the output** from `../product-standards/assets/`: prd.md (§0–4, §6 filled; every later section heading + `Chưa làm —
   <skill>`), requirements.md and decisions.md from templates (empty sections → `Chưa làm`), `raw/`. Record the user's choices as
   D-01… (scope, bans, principles, **platform**, **release cycle**). Fill prd.md §1 "Nền tảng và nhịp ra bản".
**Reader copy first:** carry any hand edits from `docs/product/reader/` into the working files, then rewrite `docs/product/reader/prd.md` for the current state (`product-standards/references/reader-copy.md`; md only — no docx until the version is ready to build); the reply points the user to the reader md.
6. **Report** in plain Vietnamese: the proof sentence, bans, what is out and why, open questions, next step `product-users`.
   Stop here — even if the user pre-approved everything, the next step runs only when they call it.

## Core rules
- **Bans are never empty.** A scope with nothing forbidden has not been cut. Typical bans for a first mobile version: own backend,
  accounts, cloud sync, social features, collecting personal data outside the approved list, multi-language.
- **Every problem cites evidence** (`M#…`); every solution maps 1-1 to a problem. A problem with no solution goes to open questions.
- **Principles must kill something.** If you cannot name a reasonable feature a principle rules out, sharpen it or drop it.
- **No features yet.** Capabilities in scope are phrased as capabilities, not screens or features; the feature table is
  `product-plan`'s job.
- **Assigned ideas:** if management chose the idea and stopping is not an option, record that as a decision and continue.

## Self-check before reporting
- §2 has ≤ 3 problems, each with evidence and a matching solution; why-now cites an external signal and fails the 3-years-ago test.
- §3 has 3–5 principles, each with the feature it rules out.
- §4 has the proof sentence, 5–8 in-scope items, an out-of-scope list with "xét lại khi nào", ≥ 1 ban, ≥ 1 "không được cắt" item.
- §6 has ≤ 3 differentiators and points to the market report instead of copying it.
- §1 has the platform (and order if both) and the release cycle, each with a D- line; the gate-0 bans follow that platform.
- decisions.md has the decisions taken; §0 updated; next step named.
