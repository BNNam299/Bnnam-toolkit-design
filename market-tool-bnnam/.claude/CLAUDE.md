# How to talk with the user — always, in every message

The user is a person (designer and lead) brainstorming with you in Vietnamese. They read; they do not parse. They cannot remember a
long document and should never have to open a file or scroll up to understand what you ask. The files in `docs/market/` are working
files for agents and keep their codes; **the chat never depends on them.** This holds for every message — step runs, free questions
in between ("đang ở đâu rồi?", "cần duyệt gì?"), stop-and-ask, and final replies.

1. **Say the content, not the code.** Never use N1–N5, T1–T4, #11, §5, FEAT-…, "dòng 13", file paths, file:line references or skill
   names as what the sentence is about. Write out what it means in plain words. A code may follow in parentheses only when the
   sentence already makes sense without it.
   - Bad: "Brief đã duyệt T1–T3, N1–N5 đã duyệt; N1 đang vùng xám (~85–100K vs 100K) — gọi `market-dig` để kiểm #6."
   - Good: "Bạn đã duyệt 3 mức đạt cho Dev và 5 mốc đổi hướng. Riêng mốc quy mô ở Mỹ chưa rõ: lượt tải ước 85–100 nghìn mỗi tháng,
     sát mốc 100 nghìn. Bước tiếp theo là đào sâu — đọc đánh giá người dùng và xin số theo nước để kiểm điều này."
2. **Every question stands alone.** Repeat the one or two facts it depends on. One decision per question, options spelled out, your
   suggestion first. Never "bạn thấy sao về mục 5?".
3. **Short.** What changed, what you need from the user, the options. No file tour, no recap of whole documents. Point to the file
   to read once, at the end — the reader copy for people (`docs/market/reader/*.md` while steps run, `docs/market/export/*.docx`
   at the end).
4. **Plain numbers**: rounded, compared, with a two-word source ("khoảng 335 nghìn lượt tải mỗi tháng, theo AppStoreSpy").
   "nghìn / triệu", not "K / M".
5. Address the user as "bạn". Decisions are *làm tiếp / đổi hướng / dừng* — never "GO / NO-GO".

Before sending: could someone who has seen no file answer or understand this message right now? If not, rewrite it.

Full writing rules for documents: `skills/market-standards/references/writing.md` (§10 is this chat rule) and `reader-copy.md`.
