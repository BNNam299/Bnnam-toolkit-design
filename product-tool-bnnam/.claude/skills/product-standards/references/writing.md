# Writing product documents everyone can read

Readers: PO decides, Dev estimates and builds, Designer draws, DA measures, Tester accepts, a manager reads the first lines. Write for
the busiest first.

## Contents
1. Keep only what carries weight
2. Quick-read lines and the plain first sentence
3. Terms in parentheses
4. Wording to avoid
5. Tables
6. Numbers and labels
7. Name the method you used
8. Talking with the user in chat

## 1. Keep only what carries weight
A sentence stays only if it carries at least one of: a number with its source · an ID (M#, P#, FEAT, UC, FR, D…) · a decision, rule
or next action · an assumption marked **giả định**. Cut the rest, however well written:

| Cut | Write instead |
|---|---|
| Prose repeating the table above | nothing — the "→ Rút ra" line is enough |
| Adjectives with no measure: "mượt", "nhanh", "thân thiện", "trực quan", "hiện đại", "tối ưu" | the measure: "mở trong ≤ 1,5 giây trên iPhone 11" |
| Re-explaining the method or a term already explained in the file | one line, or nothing |
| Comments about the document itself ("Lưu ý thẳng…", "phần này rất quan trọng") | if it changes confidence: what is weak and why |
| General claims from memory ("người dùng Gen Z thích…") | a source, or **giả định** + how to check, or cut |
| Copying market tables into the PRD | 3–5 lines + "xem docs/market/market-report.md §4" |

**Length.** One subsection fits on one screen. A feature block in Part B is 6–10 lines at *Đủ để thiết kế*; the screen rules table
carries the rest at *Đủ để build*. **Delete test** before reporting: if this paragraph is deleted, does an ID, a number or a decision
disappear? If not, delete it.

## 2. Quick-read lines and the plain first sentence
prd.md §0 is rewritten after every step, no jargon:
```
- Đang làm: <app gì, cho ai, đang viết phiên bản nào>
- Tình trạng: <bao nhiêu tính năng ở mức nào>
- Cần chốt: <quyết định đang chờ ai, hạn khi nào — hoặc "chưa có">
- Bước tiếp: <bước + skill cần gọi>
```
Every section opens with one sentence answering its question in everyday words, before any table.

## 3. Terms in parentheses
Explain a term the first time it appears in each file: "paywall (màn mời trả tiền)", "trial (dùng thử miễn phí trước khi bị trừ
tiền)", "AC (tiêu chí nghiệm thu — câu trả lời đạt / không đạt)". Common ones:

| Term | Plain |
|---|---|
| PRD | tài liệu mô tả sản phẩm cần làm |
| MVP / bản đầu | bản nhỏ nhất đủ để chứng minh điều cần chứng minh |
| Persona | chân dung một nhóm người dùng, dựa trên hành vi thật |
| JTBD | việc người dùng "thuê" app làm hộ |
| Aha moment | khoảnh khắc người dùng thấy app có ích lần đầu |
| UC / FR / NFR / BR | tình huống sử dụng / yêu cầu chức năng / yêu cầu chất lượng / công thức nghiệp vụ |
| AC | tiêu chí nghiệm thu |
| North Star | chỉ số chính phản ánh giá trị người dùng nhận được |
| Guardrail | chỉ số không được xấu đi khi tối ưu chỉ số khác |
| IAP / IAA | tiền bán gói trong app / tiền quảng cáo trong app |
| Rewarded / Interstitial | quảng cáo xem để nhận thưởng / quảng cáo chen giữa màn |
| Restore purchase | khôi phục gói đã mua (đổi máy, cài lại) |
| Remote config | đổi thông số app từ xa, không cần ra bản mới |

## 4. Wording to avoid
| Avoid | Write instead |
|---|---|
| GO / NO-GO | làm tiếp / đổi hướng / dừng |
| "Tăng retention", "tăng trải nghiệm" | "D7 ≥ 12% trước khi thêm tính năng" |
| Bullet fragments ("User: / Có thể…") | a full sentence with a subject |
| A flow only as a picture or a diagram code block | numbered text steps; the picture is a bonus |
| A table pasted as an image or "xem sheet" | a real table; the sheet is only a link |
| "anh", "chị", "sếp" | "bạn" |

## 5. Tables
Every column answers a question; at most 6 columns (the feature and requirement tables included). Details go in the block under the
table. A table used to decide (scope, features, prices, KPIs) ends with "→ Rút ra:" — what it shows, what to do next. Reference
tables that only list (roles, links, IDs) need no "Rút ra". Use "—" for not applicable, "chưa có" for not yet known; never leave a
cell silently empty in a filled section.

## 6. Numbers and labels
- Vietnamese style: 1,5 giây · 39,99 USD · 12k.
- Every number has a source tag: market evidence `(M#12)`, new product evidence `(P#3)`, Dev answer `(Dev, 14/11/2026)`, team
  benchmark `(mốc team)`, or **giả định**.
- Thresholds always name the device and condition: "≤ 1,5 giây trên iPhone 11, iOS 17, wifi".
- Free-tier limits are exact with reset time: "2 lượt/ngày, reset 0h giờ máy" — never "2–3 lần".

## 7. Name the method you used
When a step follows an established method, framework or matrix (5 Whys, Lotus Blossom, RICE, Kano, HEART, story map, cognitive
walkthrough, Need Score, three-layer competition…) rather than the AI's own reasoning, say so — the reader must see how the problem
was solved, not only the answer.
- **Where it is used**, exactly one line before the result (details go to the appendix, not here): "Cách làm: <tên phương pháp> — <dùng để làm gì>." Example: "Cách làm: 5 Whys +
  Fishbone — tìm vì sao người dùng bỏ app sau tuần đầu → 3 nguyên nhân gốc, nguyên nhân 2 sản phẩm tác động được."
- **In the appendix** "Phương pháp đã dùng": one row per method — phương pháp · dùng ở mục · để giải việc gì · ra kết quả gì · nguồn
  (team handbook, team template, a named public source). The team's own templates call this "Nguồn phương pháp".
- Only name a method whose steps were actually followed; a method named but not applied is worse than none. Where the AI reasoned
  on its own, write "AI tự suy luận từ <bằng chứng>".
- The final reply of every step has one line "Cách làm: <phương pháp> → <ra gì> · <phương pháp> → <ra gì>" — naming them, not only
  "xem phụ lục".

## 8. Talking with the user in chat

The user is a person brainstorming with you, not a parser. They cannot hold a 300-line document in their head and should never have
to open a file to understand a question. The working files keep their codes (FEAT-…, BR-…, AC-…, D-…, M#12, §8); **the chat never
depends on them.**

1. **Say the content, not the code.** Never ask "bạn duyệt D-04 chưa?" or "FEAT-03 để Now hay Next?". Write out what is being approved, in
   one plain line each. If a code helps the user find it later, it may follow in parentheses — the sentence must make sense without it.
   - Bad: "Cần chốt: ngưỡng T1–T3 và cột Lõi / Mở rộng trong dev-brief.md (N1–N5 đã duyệt)."
   - Good: "Cần bạn chốt 3 mức đạt cho Dev trước khi gửi:
     1. Nhận diện người trên iPhone 11 chạy được từ 15 khung hình mỗi giây trở lên.
     2. Cùng một ảnh, bản iOS phải ra cùng số đo với bản Android (lệch tối đa 1%).
     3. Đọc góc máy từ ảnh mẫu xong trong 3 giây.
     Đồng ý, hay muốn đổi mức nào?"
2. **Every question stands alone.** Assume the user remembers nothing from earlier in the run. Repeat the one or two facts the
   question depends on ("Bản đầu chỉ có chụp theo ảnh mẫu và chọn 5 tấm đẹp; thư viện ảnh mẫu để bản sau — …").
3. **One decision per question, with the options spelled out** and your suggestion first. Never "bạn thấy sao về mục 5?".
4. **Short.** A stop-and-ask message is what changed, what you need from the user, and the options — no recap of the whole
   document, no file tour. Point to the file once at the end.
5. **No file paths, skill names, section numbers or method jargon as the subject of a sentence.** "Bước tiếp: viết yêu cầu chi tiết cho từng tính năng" — not
   "gọi `product-spec` để điền §6–8". Method names go in the single "Cách làm:" line, explained in a few words.
6. **Numbers rounded and compared, as in the reader copy** ("gấp 3 lần tháng trước"), with a two-word source.
7. Address the user as "bạn"; decisions are *làm tiếp / đổi hướng / dừng*.

Self-check before sending a message that asks for a decision: read it as someone who has not seen any file — could they answer it
right now, without scrolling up or opening anything?
