# Meeting brief — what the team reads before deciding

The team is small: the user (designer and lead, who runs this toolkit and holds every role except code) plus iOS and Android Devs.
Big choices are made **in a team meeting**, not by the AI and not inside the long report. The meeting brief is a short, separate file
the user sends ahead, so everyone arrives having read the same five minutes.

## When one is written
| File | Written by | When | The meeting decides |
|---|---|---|---|
| `docs/market/meeting-brief-b4.md` | `market-score` | step 4, **only if the user takes the ranking to the team** (they may also decide alone — ask which) | which idea to check in depth |
| `docs/market/meeting-brief-b5.md` | `market-decide` | step 5, always | làm tiếp / đổi hướng / dừng |

## What it contains — readable in about 5 minutes
1. **Cần chốt gì** — one sentence, plus the meeting date if known.
2. **Các lựa chọn** — 2–4 options. For each: one line of what it means, the key numbers, and **the AI's view and the user's view side
   by side**; where they differ, say how and why in one line.
3. **Số chính** — at most 5 numbers that drive the choice, each pointing to the report section (`market-report.md §5.3`) and its
   evidence number. No new numbers that are not in the report.
4. **Rủi ro và phần chưa rõ** — including every Dev question still unanswered ("chưa có trả lời của Dev, hạn dd/mm") and every
   assumption that would flip the choice.
5. **Gợi ý của AI** — one line, clearly labelled as a suggestion, never as the decision.
6. **Sau họp ghi lại** — empty lines for: quyết định · ai dự · ngày · lý do (filled after the meeting, then copied to the report).

Template: `../assets/meeting-brief.template.md`. Same writing rules as the report (plain first sentence, terms explained in
parentheses, every number with its source).

## Two formats, one source
- **md is the source.** Export a .docx for sending: `node ../scripts/export_docx.js docs/market/meeting-brief-b5.md
  docs/market/export/meeting-brief-b5.docx` (see "Running the export" below). Changes are made in the md, then exported again —
  never edit the .docx.
- **The meeting brief is for people only.** Agents (the product toolkit, Dev's agent) do not read it as input; it only summarises.
  After the meeting the decision is written back into `market-report.md` (§5 for step 4, §6 for step 5: decision, who attended, date,
  reasons) and the "Kết luận sau họp" block of `dev-brief.md`. Those two files are what every agent reads, so there is never a second
  source for the same fact.

## Running the export
Needs Node.js and the npm package `docx` (installed globally once). On Windows set the global path for the run:
```
NODE_PATH="$(npm root -g)" node <skill-dir>/../market-standards/scripts/export_docx.js <in.md> <out.docx>
```
If the package is missing, the script says so; ask the user before installing anything.

## After the meeting
The user tells you the outcome (any wording). Then:
1. Fill "Sau họp ghi lại" in the brief.
2. Write the decision into the report section with who attended, date and reason; if it differs from the AI's suggestion, keep both
   and say why the team chose differently.
3. Update `dev-brief.md` "Kết luận sau họp" (what Dev does next).
4. Update §0 of the report.
