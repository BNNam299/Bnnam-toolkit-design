# Writing dev-brief.md

`dev-brief.md` lets Dev start technical research **in parallel** with the market work, instead of waiting until the market report is
finished. It must stand alone: a Dev who reads nothing else knows what to test, how to tell pass from fail, and how to answer.

## When it is written — at most 3 rounds, about 1.5 weeks (team rule)
| Round | Written by | When | Asks about | Deadline |
|---|---|---|---|---|
| Bản 1 | `market-kickoff` | right after step 1, if an idea exists | **only two things**: can the core be built at all, and what is the biggest technical risk | **3 working days** |
| Bản 2 | `market-score` | after step 4 picks an idea | **only the new questions** raised by the dig and the scoring — never a rewrite of Bản 1 | **2 working days** |
| Vòng thêm | `market-score` (back at step 4) | only when Dev reports a blocker after Bản 2 | **only the 1–2 alternative routes** proposed for that blocker | **2 working days** |

- **Every brief states its deadline as a date** (count working days from the send date). Dev answers any time before it; the answer
  goes to `raw/dev-answer-<yyyy-mm-dd>.md`, and whichever step is running reads the newest answer and uses it at once (e.g. a
  capability reported impossible is dropped or downgraded when scoring).
- **Blocked after Bản 2** → the AI and the user propose 1–2 other routes: a technical workaround, a narrower feature, or the next idea
  in the step-4 ranking (use Dev's own suggestion if the answer has one). Go back to step 4 — never restart from step 1.
- **No fourth round.** After the extra round (or once a deadline has passed without an answer) nothing more is asked: what is still
  unknown goes into the meeting brief as a risk — *"chưa có trả lời của Dev"* or *"Dev cần thêm thời gian"* — and the team decides
  whether to continue with that risk or wait.
- Bản 2 and the extra round are **additions**: keep earlier blocks, add a dated section "Câu hỏi mới — Bản 2" / "Vòng thêm", and a
  one-line change note at the top. Dev never has to reread what they already answered.
- After the team meeting (step 5) add a short "Kết luận sau họp" block at the top: decision, what Dev should do next. Dev's own agent
  reads this file — keep it the single technical source; do not copy its content into the meeting brief.

No idea yet (entry point "nothing yet" or keyword only) → no brief in step 1; say so in the report.

## The AI's role — guess, never conclude
The model's technical knowledge stops at its training date. New frameworks, OS restrictions, API changes, device performance and store
review behaviour are only known by building and measuring. So:
- In the brief: describe the capability in terms of **what the app does for the user**, give the threshold and the reason, list open
  questions. You may add a short "AI gợi ý hướng thử" line (e.g. "có thể thử API X của Apple") marked as a hint, not an answer.
- In the report (§5 quick check "làm được không"): write per capability "AI đoán sơ bộ: <dễ / vừa / khó / không rõ> — chờ Dev xác
  nhận" and the question for Dev. Never "làm được" as a conclusion.
- In step 5: without Dev's answer, the decision cannot be "làm tiếp" on technical grounds — unless the team meeting explicitly accepts the risk,
  which the report then states.

## Writing each section
0. **Đọc nhanh (3 phút)** — what the app does for whom, what Dev must answer, by when the answer is needed.
1. **App làm gì** — the main flow in 3–5 plain steps: the user opens the app → does what → gets what. No market jargon.
2. **Tính năng cần thử** — *Cốt lõi*: without it there is no app → must be tested. *Phụ*: nice if feasible → rough estimate only.
   Name capabilities by behaviour ("kết nối được TV Samsung trong cùng wifi"), not by technology.
3. **Thế nào là đạt** — each core capability gets a numeric PASS and FAIL line, plus the reason for the number, pointing to evidence
   (`#2: người dùng bỏ app khi chờ kết nối quá lâu`). Use a middle band when useful ("50–70% = tạm chấp nhận, UI bù bằng …").
   **AI proposes the thresholds; the user approves them before the brief is sent.** Mark the brief "Bản nháp — chờ duyệt ngưỡng"
   until they do.
4. **Thử trên máy nào** — a weakest device, a typical device, a top device. **All pass/fail lines are judged on the weakest device**
   the app intends to support. Add test conditions that matter (light, network, battery, heat after 10 minutes…).
5. **Nếu không đạt thì sao** — per capability: the fallback, or "bỏ ý tưởng / họp lại ngay" if it is the foundation of the app. This
   tells the whole team what each result changes.
6. **Không cần thử** — out of scope (UI polish, payments, Android, backend, training custom models…) so Dev does not spend time there.
7. **Cách trả lời** — the fixed answer form below, saved by Dev (or the user) as `docs/market/raw/dev-answer-<yyyy-mm-dd>.md`;
   `market-decide` reads it.

Answer form (one block per capability):
```
### <tính năng>
- Kết luận: đạt / không đạt / đạt có điều kiện (<điều kiện>) / chưa rõ
- Số đo: <máy × điều kiện → số>
- Ca lỗi điển hình: …
- Nếu không đạt: phương án dự phòng đã thử và cái giá của nó
- Ước lượng công làm bản thật: S / M / L / XL
```

## Store-policy flags for the category
Add a line to the brief when the category triggers stricter App Review, so Dev checks it early: health or wellbeing (medical claims,
health data — Apple 1.4.1, 5.1.3), apps for children (5.1.4: no third-party analytics or ads), location (5.1.5), user content or
third-party media (5.2). Ask Dev what the planned data storage means under these rules (e.g. whether wellbeing data counts as health
data that must not be stored in iCloud).

## Keep it honest
- A capability with no threshold is not testable — either give a number or move it to "Phụ".
- Do not ask Dev about things the market step has not decided (e.g. pricing, design).
- When Bản 2 or the extra round is added, keep a one-line change note at the top ("Bản 2 — thêm câu hỏi X, bỏ tính năng Y, vì §5").
