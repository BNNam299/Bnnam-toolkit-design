# Reader copy — the version people read (reader md during the steps → docx at the end)

`market-report.md` is the **working file**: the next step, the product toolkit and Dev's agent read it, so it keeps codes (N1, T1),
evidence numbers on every claim, approval history and "Cách làm" lines. People should not have to read that. At the end of **every
step** write a separate **reader copy** in md, rewritten for a person — the user reads and edits it while the research runs. Only
when the research is finished does it become a .docx, and the reader md is deleted: in the end there is **one md for machines and one
docx for people**.

## Life of the reader copy
```
while steps run   docs/market/reader/market-report.md   ← reader md: rewritten at the end of each step; the user reads / edits it
                  docs/market/reader/dev-brief.md       ← same for the Dev brief (when the brief is written or changed)
at the end        docs/market/export/market-report.docx ← exported from the reader md, then reader/market-report.md is deleted
                  docs/market/export/dev-brief.docx     ← exported, then reader/dev-brief.md is deleted
```
- **During steps: md only, no docx.** Rewrite the whole reader md each step (overwrite, never append) so it always shows the current
  state, as if written today. The reply points the user to the reader md.
- **Exception — the Dev brief is sent mid-way** (after step 1 and step 4). When the user says the brief is approved / ready to send,
  export `export/dev-brief.docx` at once so they can send it; keep `reader/dev-brief.md` until the end.
- **The end** is `market-decide` after the team's decision is recorded (or whenever the user says "xong, xuất docx"): export both
  reader copies to `export/`, check the docx files exist, then delete `docs/market/reader/` and tell the user.
- **The working file is the source.** Facts change there first; the reader copy only re-tells them. Never put a number, quote or
  decision in the reader copy that is not in `market-report.md` / `evidence.md` / `dev-brief.md`.
- **The user may edit the reader md.** Before rewriting it (start of each later step, and before the final export) run
  `check_market.py docs/market`: it reports "bản đọc đã sửa tay" when a reader md changed since it was written. Then read what the
  user changed, carry each change into the working file (a fact, a decision, a wording they want kept — ask in one plain question
  if it changes a conclusion), and only then rewrite. Never overwrite the user's edits silently.
- After writing a reader md, record it: `python <skill-dir>/scripts/check_market.py docs/market --mark-reader` (stores a fingerprint
  in `reader/.written` so later hand edits are detected).
- Agents never read the reader copy as input.
- Export: `NODE_PATH="$(npm root -g)" node <skill-dir>/scripts/export_docx.js docs/market/reader/market-report.md
  docs/market/export/market-report.docx` (same for dev-brief). If the npm package `docx` is missing, the script says so — ask the
  user before installing; until it is installed the reader md stays and the report says the docx is pending.
- The meeting briefs (`meeting-brief-b4/b5.md`) are already written for people; they keep their own md + docx.

## Shape — readable in 5–10 minutes
```
# <Tên app> — Báo cáo thị trường (bản đọc)
*Cập nhật dd/mm/yyyy, sau bước N. Bản đọc, viết lại từ bản làm việc. Bạn sửa thẳng ở đây được — bước sau sẽ đưa phần sửa vào bản làm việc trước khi viết lại.*

## Mục lục
- 1. Tóm tắt
- 2. …   (one line per section below, subsections indented)

## 1. Tóm tắt
3–5 câu: đang xét gì, kết luận tới giờ và chắc đến đâu, bạn cần quyết gì, bước tiếp theo.

## 2. <one section per finished step, numbered, titled by the question it answers>
   e.g. "Ý tưởng và giới hạn của team" · "Thị trường lớn cỡ nào, có chỗ cho app mới không" ·
        "Người dùng khổ ở đâu" · "Đối thủ làm gì, hở chỗ nào" · "Nên làm ý tưởng nào" · "Quyết định"
   Each: a plain opening sentence that answers the question, then the few facts that support it.

## <last number>. Còn chưa chắc
Short list of the assumptions that could change the conclusion, each in one sentence + what would settle it.
```
Sections of steps not run yet are left out entirely (no "Chưa làm" lines).

## Numbering and table of contents (every reader copy)
- **Number the sections** in reading order: "## 1. Tóm tắt", "## 2. …", subsections "### 2.1 …". The whole copy is rewritten
  each step, so renumber freely when a section is added.
- **Numbers help people find things; they are not codes.** In the text, refer to a section by number and name — "xem mục 4,
  Người dùng khổ ở đâu" — never by the number alone.
- **A copy with 4 or more main sections starts with "## Mục lục"** right after the date line (not numbered itself): one line per
  main section ("- 1. Tóm tắt"), subsections indented under it. Keep it in step with the headings.
- The docx export turns "Mục lục" into a clickable table of contents and adds "Trang x / y" to every page — nothing to do by hand.
- `check_*.py` flags unnumbered sections, a missing "Mục lục" and a "Mục lục" that does not match the headings.

## Writing rules
1. **Full sentences, spoken order.** Subject, verb, object, as you would explain it to a colleague. No chains of "→" and "·", no
   fill-in-the-slot template sentences, no telegram style.
2. **No internal codes.** Never N1–N5, T1–T4, FEAT-…, #11, "§2", step-skill names, file names, folder paths, repo branches, commit
   hashes, HTML comments. A threshold is named by what it measures ("ngưỡng quy mô ở Mỹ: dưới 100 nghìn lượt tải mỗi tháng thì
   đổi định vị").
3. **Sources in a few words, inside the sentence or in parentheses**: "(AppStoreSpy, ước tính, tháng 10/2026)", "(review App Store,
   2026)". Tool numbers still say *ước tính*. One source mention per paragraph is enough when all numbers share it.
4. **Only what the reader needs to understand or decide.** Leave out: approval history, who changed what and when, method appendix,
   evidence bookkeeping, technical detail for Dev (models, file sizes, code) — one sentence pointing to "tài liệu cho Dev" is enough.
   Name a method only where it changes how to read a result ("ước tính từ lượt cài mỗi ngày × 30").
5. **Numbers rounded and compared.** "khoảng 335 nghìn lượt tải mỗi tháng, gấp 3 lần tháng trước" beats a column of raw values. Use
   "nghìn", "triệu" — not "K", "M".
6. **Tables only when comparing several items on the same few points** — at most 4 columns, at most 6 rows, followed by one sentence
   saying what the table shows. Everything else is prose or a short list.
7. **Bold at most once per paragraph**, for the single thing the reader must not miss.
8. **Terms**: avoid them; when one is unavoidable, explain it in parentheses at first use (same as the working file).
9. **Links only to what any reader can open**: store pages, Figma / FigJam, public web pages, a GitHub link if the project's docs are
   pushed. Never link a local md file; write "chi tiết số liệu: bản làm việc, mục 2" instead.
10. Address the user as "bạn"; decisions are *làm tiếp / đổi hướng / dừng*; feasibility stays "AI đoán sơ bộ — chờ Dev xác nhận".

## Dev brief — reader copy for Dev
```
docs/market/reader/dev-brief.md   ← rewritten whenever dev-brief.md is written or changed (step 1 Bản 1, step 4 Bản 2, extra round)
docs/market/export/dev-brief.docx ← exported as soon as the user approves sending; what the user sends to Dev
```
The reader is a developer, so the rules above change in three places:
- **Technology names and repo paths are allowed** (MediaPipe, ONNX, `guidance/GuidanceConfig.kt`, a branch, a commit) — Dev opens
  the repo. Keep it to a short "Đọc gì trong repo" list of the few files that matter, one line each.
- **Tests are numbered plainly** — "Phép thử 1, 2, 3" — with the same order as the md, so Dev's answer maps back. No T1 / N5 codes,
  no evidence numbers, no market jargon.
- Still no approval history, market reasoning, store / ASO talk, or restated code.

Shape (about 1–2 pages):
```
# <Tên app> — Việc cần Dev thử (bản đọc)
*Bản <1/2> · ngày gửi · hạn trả lời (hoặc "không đặt hạn") · bản md đầy đủ cho agent: dev-brief.md*

## Mục lục
## 1. Cần bạn làm gì     2–4 câu: việc, phải trả lời những gì, trả lời bằng cách nào
## 2. App làm gì      3–5 bước người dùng, câu thường
## 3. Đọc gì trong repo (chỉ khi đã có code) 3–6 file, mỗi file một dòng: vì sao đọc
## 4. Các phép thử    mỗi phép: thử gì · thế nào là đạt / tạm được / không đạt · vì sao con số đó
## 5. Thử trên máy nào máy yếu nhất làm chuẩn + điều kiện thử
## 6. Nếu không đạt   mỗi phép một câu: team sẽ làm gì
## 7. Không cần làm   danh sách ngắn
## 8. Cách trả lời    lưu file nào, theo mẫu ở cuối bản md
```

## Example — the same content, working file vs reader copy
Working file (fine for agents, hard for people):
> **N1** (top 5 app ở Mỹ < 100K/tháng) → **vùng xám, chưa kiểm chắc**. Top 5 toàn cầu ~335K/tháng; Mỹ chiếm ~26–28% ở 2 app có số
> theo nước (#11, #12) → phần Mỹ ước ~85–100K, sát ngưỡng. Cần số tải theo nước (Sensor Tower). Tạm đi tiếp, rủi ro ghi ở §7.

Reader copy:
> Trước khi xem số, team đặt mốc: nếu cả nhóm app này ở Mỹ có dưới 100 nghìn lượt tải mỗi tháng thì không làm "app hướng dẫn chụp"
> riêng nữa, mà gắn tính năng vào một app camera. Hiện 5 app đầu có khoảng 335 nghìn lượt tải mỗi tháng trên toàn thế giới
> (AppStoreSpy, ước tính, tháng 10/2026). Hai app có số theo nước cho thấy Mỹ chiếm khoảng một phần tư, tức khoảng 85–100 nghìn —
> **sát mốc, chưa kết luận được**. Cần số theo nước từ Sensor Tower ở bước sau; trong lúc chờ, nghiên cứu vẫn đi tiếp.

## Self-check before reporting
- Read each paragraph as someone who was not in the project: understood without flipping to another file or section?
- Before rewriting: no "bản đọc đã sửa tay" left unhandled — the user's edits are in the working file.
- `scripts/check_market.py docs/market` shows no LỖI for the reader md files (it flags codes, evidence numbers, paths, comments,
  "K/M" units); then `--mark-reader` was run.
- Every number in the reader copy exists in the working file; nothing new was added.
- Sections numbered (1., 2.1 …); a copy with 4+ main sections opens with a "Mục lục" that matches the headings.
- During steps: no docx except `dev-brief.docx` once the user approved sending. At the end: both docx exported, `reader/` deleted.
