# Toolkit lessons — what went wrong in real runs, and the rule it became

The design toolkit got good through rounds of real review; this file does the same for the product toolkit. **Read it before
reporting any step.** After every real run where the user or the team corrects something, append a line — newest at the bottom,
never renumber. (These `BH-` lessons are about how the toolkit works; lessons from the app's own A/B tests are `L-` in decisions.md.)

Format: `BH-<n> · <dd/mm/yyyy> · <source: test vòng N / dùng thật – dự án> · what happened → the rule · fixed in <file>`

## Lessons
- BH-01 · 07/11/2026 · bàn vai trò với người dùng · the toolkit assumed a PO, a QA and an analyst → the real team is the lead
  (designer, holds every role except code) + iOS and Android Devs; write for that team · `SKILL.md` "Who does what"
- BH-02 · 07/11/2026 · bàn vai trò · acceptance criteria had no owner → tag every AC [Lead kiểm] (UI, copy, states) or [Dev kiểm]
  (logic, data, permissions, payments) · `product-detail/references/detail.md` §5, `scripts/check_product.py`
- BH-03 · 07/11/2026 · bàn vai trò · the toolkit defaulted to iOS → the platform is decided per app at kickoff; gate 0 then uses
  Apple, Google Play or both · `product-kickoff/references/kickoff.md` §1, `references/policy-and-safety.md` §6
- BH-04 · 07/11/2026 · bàn vai trò · persona checks proposed 5–8 interviews and 100-person surveys the team never runs → main
  evidence from reviews and forums, 5–7 questions for the next 1–2 people the lead can ask, confirmation from post-launch data ·
  `product-users/references/users.md` §5
- BH-05 · 07/11/2026 · bàn vai trò · updates could ship one small change at a time → versions follow the cycle set at kickoff,
  changes are batched, out-of-cycle patches only for crash / store rejection / policy, every version has a retest scope ·
  `product-plan/references/plan.md` §1, §4
- BH-06 · 07/11/2026 · bàn vai trò · unclear which file Dev uses → md is the source for Dev's agent, docx is regenerated for people,
  never edited · `SKILL.md` "Export"
- BH-07 · 07/11/2026 · soát nối bộ · product wrote to `docs/product/` while the design toolkit looks in `product/sources/prd/` → copy
  prd.md and requirements.md there at hand-off · `references/inputs-and-handoffs.md` §4
- BH-08 · 08/11/2026 · người dùng sau khi hỏi Dev · Dev và Designer phải lục cả PRD mới thấy phần của mình → khối "Đọc theo
  vai trò" dưới §0 + nhãn [Dev] / [Design] ở tiêu đề mục; hình ở Figma / FigJam, văn bản là gốc và dẫn link · `SKILL.md` luật 10
- BH-09 · 08/11/2026 · người dùng · link Figma / FigJam chỉ được nghĩ tới sau khi có UI, trong khi team có bảng và luồng sớm hơn →
  link từ bước đầu, bảng rẽ nhánh "nếu … thì …" trong văn bản, sơ đồ FigJam vẽ từ bảng · `references/inputs-and-handoffs.md` §6
- BH-10 · 08/11/2026 · người dùng · PRD trông chờ Figma / tool demo cho luồng, sitemap → PRD tự làm các tác vụ UX và ghi thành
  chữ (empathy map, phân tích tác vụ, sitemap cây chữ, luồng tổng); tool demo chỉ vẽ lại và link về · `product-spec/references/spec.md` §3
- BH-11 · 08/11/2026 · người dùng · tài liệu đưa kết quả mà không nói đã giải bằng cách nào → dùng phương pháp có tên thì ghi "Cách làm:"
  tại chỗ + phụ lục "Phương pháp đã dùng" + nêu trong câu trả lời · `references/writing.md` §7
- 08/11/2026 · người dùng (chạy thật market, áp dụng cho product) · agent hỏi duyệt bằng mã (T1, N1) khiến người dùng phải mở file
  tra → chat nói thẳng nội dung cần chốt, mỗi câu hỏi tự đứng được, không dùng FEAT- / D- / § / tên file làm chủ ngữ ·
  `references/writing.md` §8, luật 12
