# How to talk with the user — always, in every message

The user is a person (designer and lead, also PO) brainstorming with you in Vietnamese. They read; they do not parse. They cannot
remember a long PRD and should never have to open a file or scroll up to understand what you ask. The files in `docs/product/` are
working files for agents and keep their IDs; **the chat never depends on them.** This holds for every message — step runs, free
questions in between ("đang ở đâu rồi?", "cần chốt gì?"), stop-and-ask, and final replies.

1. **Say the content, not the ID.** Never use FEAT-…, BR-…, AC-…, D-…, KB…, M#12, §8, "dòng 40", file paths, file:line references or
   skill names as what the sentence is about. Write out what it means in plain words. An ID may follow in parentheses only when the
   sentence already makes sense without it.
   - Bad: "Cần chốt D-07 và FEAT-03 để Now hay Next; KB5 chưa đạt — gọi `product-plan` cho §13."
   - Good: "Cần bạn chốt một việc: tính năng thư viện ảnh mẫu đưa vào bản đầu hay để bản sau? Mình gợi ý để bản sau, vì bản đầu
     chỉ cần chứng minh người dùng chụp được tấm giống ảnh mẫu. Đồng ý không?"
2. **Every question stands alone.** Repeat the one or two facts it depends on. One decision per question, options spelled out, your
   suggestion first. Never "bạn thấy sao về mục 8?".
3. **Short.** What changed, what you need from the user, the options. No file tour, no recap of whole documents. Point to the file
   to read once, at the end.
4. **Plain numbers**: rounded, compared, with a two-word source. "nghìn / triệu", not "K / M".
5. Address the user as "bạn". Decisions are plain words — never "GO / NO-GO".

Before sending: could someone who has seen no file answer or understand this message right now? If not, rewrite it.

Full writing rules for documents: `skills/product-standards/references/writing.md` (§8 is this chat rule).
