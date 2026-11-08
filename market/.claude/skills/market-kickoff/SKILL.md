---
name: market-kickoff
description: Step 1 of the market toolkit - starts market research for a mobile app. Asks the entry point (a keyword, an app idea, or nothing yet) and the constraints (platform, target countries, monetization, time, budget, team strengths), reads what the user already has in docs/market/raw/, sets the stop thresholds BEFORE any data is seen, creates docs/market/ (market-report.md §0–1, evidence.md, raw/), and when an idea exists writes dev-brief.md version 1 so Dev can start technical research in parallel. Use whenever the user wants to start or restart market research, validate an app idea, or check whether a keyword or app category is worth entering, even without naming the step. Vietnamese triggers such as "bắt đầu nghiên cứu thị trường", "tôi có ý tưởng app", "nghiên cứu keyword", "dòng app này còn cơ hội không", "khởi động market". Later steps - market-scan, market-dig, market-score, market-decide.
---

# market-kickoff — step 1: where we start and when we stop

Most wasted research comes from starting without knowing what question is being answered and without deciding in advance what result
would make us stop. This step fixes both in one conversation with the user, before any data is collected.

**Read first:** `../market-standards/SKILL.md` (output layout, writing and evidence rules). This step stops for the user — it is a
discussion, not a run-through.

## Need → Read
| Need | Read |
|---|---|
| The questions to ask, per entry point; team strengths; how to phrase the idea | `references/kickoff.md` §1–3 |
| Setting stop thresholds that can actually be checked | `references/kickoff.md` §4 |
| Reading what is already in `raw/` | `../market-standards/references/evidence-and-sources.md` §5 |
| Writing `dev-brief.md` version 1 | `../market-standards/references/dev-brief-writing.md` |
| Templates | `../market-standards/assets/` |

## Workflow
1. **Look before asking.** Check whether `docs/market/` exists. If it does and §1 is already filled, this is a restart or an update —
   show what is there and ask what changed instead of starting over. List the files in `docs/market/raw/` (and any file the user
   points to) and read them; they often answer half the questions.
2. **Ask the entry point** — keyword / idea / nothing yet — and the constraints, in one short round of questions
   (`references/kickoff.md` §1–2). Do not ask what `raw/` already answered; confirm it instead.
3. **Discuss, then propose the stop thresholds** (`references/kickoff.md` §4): 3–5 rules "if … then stop / change direction", each
   checkable with data the later steps will collect. The user approves them; record the date. They are not edited after data comes in.
4. **Create the output**: `docs/market/market-report.md` from the template (fill §0 and §1; every
   later section is only its heading plus `Chưa làm — bước N (market-…)`, no empty tables),
   `docs/market/evidence.md` from the template (add evidence from `raw/` if any), `docs/market/raw/` if missing.
5. **If an idea exists, write `dev-brief.md` version 1** — it asks Dev **only two things**: can the core be built at all, and what is
   the biggest technical risk. Put the deadline as a date, **3 working days** after sending (`dev-brief-writing.md` "When it is
   written": at most 3 rounds, about 1.5 weeks in total). Propose the pass/fail numbers, mark the brief "Bản nháp — chờ duyệt
   ngưỡng", and ask the user to approve before it goes to Dev. No idea yet → no brief; write in §1 that the brief comes after step 4.
6. **Report** in plain Vietnamese: what was recorded, the thresholds, whether the Dev brief is ready to send, next step
   `market-scan`. **Then stop** — even when the user pre-approved everything ("coi như tôi duyệt luôn") or asked to "start the
   research". Pre-approval covers the thresholds and the brief, not the next step: the user calls `market-scan` when ready, after
   checking what step 1 recorded.

## Core rules
- **Thresholds come before data.** A threshold set after seeing the numbers is a justification, not a test. If the user wants to
  change one later, record it as a new line with the date and the reason; never overwrite the original.
- **An assigned idea is validated, not hunted.** If the user (or management) already chose the idea and stopping is not an option,
  say the scores will be for reference and the research will focus on *how* to win, and record that in §1.
- **One round of questions, not twenty.** Group them; offer sensible defaults the user can accept with "ok".
- **Do not research yet.** No web searching for competitors in this step beyond what is needed to understand the idea; that is
  `market-scan`.
- **Credentials stay out.** If a file in `raw/` contains tool accounts or passwords, do not copy them anywhere.

## Self-check before reporting
- §0 has four quick-read lines; §1 has entry point, idea sentence (if any), constraints, team strengths, files from `raw/`.
- Stop thresholds: 3–5 lines, each checkable, dated, approved by the user.
- `evidence.md` and `raw/` exist; any evidence taken from `raw/` is numbered and tagged.
- `dev-brief.md` v1 exists if there is an idea, with thresholds marked as awaiting approval or approved.
- The report names the next step: `market-scan`.
