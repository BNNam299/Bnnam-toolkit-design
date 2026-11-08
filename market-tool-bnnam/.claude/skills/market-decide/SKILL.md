---
name: market-decide
description: Step 5 of the market toolkit - the decision. Reads Dev's answers (docs/market/raw/dev-answer-*.md) and any new data, checks every stop threshold set in step 1 against the evidence, prepares a short meeting brief (md + docx) with one suggested decision - làm tiếp / đổi hướng / dừng - for the team meeting, records what the team decided, and writes the hand-off for the next stage (what the product step must know, open questions, the list of assumptions still to verify). Fills market-report.md §6–7. Use after market-score, when Dev has answered the technical brief, when new data arrives that could change the verdict, or whenever the user asks "should we build this", "can we close the market research", "what do we hand over to product". Vietnamese triggers such as "quyết định", "chốt thị trường", "làm tiếp hay dừng", "dev trả lời rồi", "tổng kết nghiên cứu", "bàn giao sang sản phẩm", "kiểm lại giả định".
---

# market-decide — step 5: continue, change direction, or stop

The decision was prepared in step 1, when the stop thresholds were set before any data was seen. This step checks them honestly, adds
Dev's technical answers, and prepares the **team meeting** where the decision is made — the user (lead, designer) and the Devs decide
together once market, competitors and Dev's research are in. Stopping is a good outcome — it saves the build.

**Read first:** `../market-standards/SKILL.md`. Stops twice: to hand over the meeting brief, and to record the meeting's outcome.

## Need → Read
| Need | Read |
|---|---|
| Reading Dev's answers, checking thresholds, choosing the verdict, the hand-off, re-checking assumptions | `references/decide.md` |
| What AI may say about feasibility | `../market-standards/references/dev-brief-writing.md` ("The AI's role") |
| Reading new files in `raw/` | `../market-standards/references/evidence-and-sources.md` §5 |
| Dev rounds and deadlines — what to do when a deadline passed or a blocker remains | `../market-standards/references/dev-brief-writing.md` "When it is written" |
| The meeting brief, docx export, recording the outcome | `../market-standards/references/meeting-brief.md` |

## Workflow
1. **Check steps 1–4.** Thresholds (§1), chosen idea and quick checks (§5) must exist. Missing → apply the missing-data rule.
2. **Read Dev's answers**: every `docs/market/raw/dev-answer-*.md` (newest last). Fill the "Trả lời của Dev" column of §5.4 and add
   evidence entries (group C, "Dev đo dd/mm/yyyy"). No answer and the deadline in `dev-brief.md` has passed, or the 3 rounds are used
   up → do not wait or ask again: the open question goes into the meeting brief as a risk ("chưa có trả lời của Dev").
3. **Read new data** in `raw/` since step 4; tick the data request; note what changed.
4. **Check every stop threshold** from §1, one line each: đạt / chạm ngưỡng / chưa kiểm được (missing data) — with evidence numbers.
5. **Draft the suggestion** (`references/decide.md` §2) with reasons, remaining risks, and what would change it — labelled as the
   AI's suggestion.
6. **Write `meeting-brief-b5.md` and export the .docx** (`../market-standards/references/meeting-brief.md`). Show the user the
   suggestion in a few lines and **stop**: they take it to the team meeting.
7. **After the meeting** (the user reports back): fill "Sau họp ghi lại", write the team's decision in §6 — decision, who attended,
   date, reasons, and the AI's suggestion beside it if different — and update `dev-brief.md` "Kết luận sau họp".
8. **Write §7**: what the product stage must know, open questions, and the "Cần bổ sung để kiểm lại" table brought up to date (remove
   assumptions now verified, with the evidence number).
**Reader copy first:** carry any hand edits from `docs/market/reader/` into the working file, then rewrite `docs/market/reader/market-report.md` for the current state (`market-standards/references/reader-copy.md`; md only — no docx until the end); the reply points the user to the reader md.
**Final hand-over to people** (after the team's decision is recorded): export `reader/market-report.md` and `reader/dev-brief.md` to
`export/market-report.docx` and `export/dev-brief.docx`, check both exist, then delete `docs/market/reader/` — one md for machines,
one docx for people (`market-standards/references/reader-copy.md` "Life of the reader copy").
9. **Report**: the verdict in one sentence, the 3 biggest risks, what to carry to the next toolkit (the whole `docs/market/` folder).

## Core rules
- **Thresholds are not moved to fit the result.** A threshold changed now is recorded as a new dated line with the reason; the
  original stays visible.
- **No Dev answer → no "làm tiếp" on technical grounds.** Unless the team meeting explicitly accepts the technical risk; then §6 says so in
  plain words ("Chốt làm tiếp khi chưa có kết quả thử kỹ thuật — team chấp nhận rủi ro trong buổi họp dd/mm/yyyy").
- **Plain words.** Làm tiếp / đổi hướng / dừng — never GO / NO-GO.
- **Every reason points to evidence**; every remaining guess is in §7.
- **The team decides.** The AI suggests with reasons; the recorded decision is the meeting's. The meeting brief is for people only —
  agents read the decision from §6 and `dev-brief.md`.

## Self-check before reporting
- Every §1 threshold has a line: đạt / chạm ngưỡng / chưa kiểm được, with evidence.
- §5.4 shows Dev's answers or states clearly that none arrived.
- After the decision: `export/market-report.docx` and `export/dev-brief.docx` exist and `reader/` is deleted.
- `meeting-brief-b5.md` + .docx written, numbers only from the report, unanswered Dev questions listed as risks.
- §6 (after the meeting): the team's verdict, reasons, risks, who attended and when, the AI's suggestion if different.
- §7: hand-off list, open questions, assumptions table up to date.
- §0 rewritten for someone who only reads four lines.
