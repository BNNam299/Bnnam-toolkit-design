# product-tool-bnnam — bộ định hình sản phẩm

Bộ skill Claude Code giúp trả lời: **làm gì, cho ai, tới đâu — và nghiệm thu thế nào.**
Đầu vào là kết quả bộ market (`docs/market/`). Đầu ra là PRD + yêu cầu chi tiết cho bộ design, Dev và QA.
PRD là **tài liệu sống**: lớn dần theo từng phiên bản, không viết một lần rồi thôi.
Tra cứu nhanh theo tình huống và ai làm gì: [HUONG-DAN-SKILL.md](HUONG-DAN-SKILL.md).

## Cách dùng
1. Chép thư mục `.claude/skills/` của bộ này vào dự án app (cùng chỗ với bộ market).
2. Tài liệu bạn có sẵn — biên bản kick-off, file Feature / IAP / chỉ số của team, trả lời của Dev, số liệu sau phát hành — để vào
   `docs/product/raw/`.
3. Gọi theo bảng dưới. Mỗi bước tự kiểm bước trước; thiếu gì sẽ báo và hỏi bạn trước khi viết.

| Gọi | Khi nào | Làm gì | Dừng hỏi bạn khi |
|---|---|---|---|
| `/product-kickoff` | một lần (hoặc khi đổi hướng) | nền tảng (iOS / Android / cả hai), chu kỳ ra bản, vấn đề → giải pháp, định vị, nguyên tắc, bản đầu phải chứng minh gì, làm / không làm / **điều cấm** | duyệt phạm vi |
| `/product-users` | một lần; chạy lại khi có dữ liệu người dùng mới | persona (dựa trên bằng chứng), việc người dùng cần làm, hành trình, **khoảnh khắc thấy app có ích** | duyệt persona |
| `/product-plan` | **mỗi phiên bản**, theo chu kỳ (gom thay đổi, không lẻ tẻ) | nhận yêu cầu vào hàng chờ, bảng tính năng, nháp **kiếm tiền** + **chỉ số**, lộ trình, **phạm vi kiểm lại**, **phiếu kick-off** | bạn họp team chốt, rồi báo lại kết quả |
| `/product-spec` | mỗi phiên bản, **trước thiết kế** | tính năng lên mức "đủ để thiết kế": luồng, nhánh lỗi, quyền, use case, yêu cầu, danh sách màn, khung onboarding; câu hỏi cho Dev | bàn giao bộ design |
| `/product-detail` | mỗi phiên bản, **sau khi có UI** | tính năng lên mức "đủ để build": quy tắc từng màn, onboarding từng màn, kiếm tiền chi tiết, event, tiêu chí nghiệm thu gắn **[Lead kiểm] / [Dev kiểm]**; soát + **xuất .docx** | bàn giao Dev (md cho agent, docx cho người) |

`product-standards` là luật chung (cách viết, đánh mã, mức của tính năng, cách soát, cách xuất Word). Các bước tự đọc.

## Mỗi tính năng đi qua 4 mức
```
Đề xuất  →  Đủ để thiết kế  →  Đủ để build  →  Đã phát hành
(plan)       (spec)              (detail)        (plan bản sau)
```
Bản cập nhật (thêm kịch bản paywall, thêm tính năng, A/B test) bắt đầu lại từ `/product-plan` và chỉ đụng tới tính năng của bản đó.
Phần đã phát hành không bị viết lại — thay đổi nào cũng ghi vào sổ quyết định.

## Kết quả nằm ở đâu
```
docs/product/
├── prd.md            ← PRD: Phần A cấp sản phẩm · Phần B tính năng · Phần C phiên bản
├── requirements.md   ← use case, yêu cầu chức năng + tiêu chí nghiệm thu, yêu cầu chất lượng, công thức, quyền & dữ liệu, event
├── decisions.md      ← sổ quyết định (ai chốt, ngày, vì sao) + hàng chờ yêu cầu mới
├── export/           ← prd.docx, requirements.docx
└── raw/              ← file của bạn (AI chỉ đọc)
```
Mã số (`BAN-`, `FEAT-`, `UC-`, `FR-`…) khớp với bộ design (`prd-to-ux-flow`) và bộ build (`/ios-spec`), nên chuyển bước không phải
đặt tên lại.

## Xuất Word
Cần Node.js và gói `docx` (đã cài toàn máy ngày 07/11/2026). md là bản gốc; docx xuất lại sau mỗi lần sửa md, không sửa trên docx.

## Vài điều bộ luôn giữ
- Chỉ giữ câu có số, có mã bằng chứng, có quyết định — cắt phần hoa mỹ.
- Mỗi tính năng trỏ về một nỗi đau hoặc chỗ hở đối thủ ở bộ market (`M#…`), hoặc bằng chứng mới (`P#…`).
- PRD nói **cái gì** và **nghiệm thu thế nào**, không nói công nghệ — phần đó của Dev. AI không kết luận "làm được".
- Phần kiếm tiền và chỉ số là **bản nháp**, sẽ chuyển sang bộ monetize / measure khi có.
- Team chốt phạm vi ở buổi kick-off; AI đề xuất và phản biện, không tự chốt.

## Nguồn kiến thức
Dựng từ: pipeline kit (`prd-architect`, `product-breakdown`, `user-research-synthesizer`, `measurement-designer` và các mẫu tài liệu
05–13), PRD thật của team (ScreenTimeControl, Cal AI, Cast TV), quy trình làm app iOS, các template Feature / Execution / IAP /
Bộ chỉ số, hướng dẫn 8 kịch bản Onboarding + Paywall, bài soát monet Remote TV, app-spec. Tóm tắt ở
`Full-Process-Appdev/docs/notes/product-toolkit-sources.md`. Script xuất Word chuyển thể từ `export_prd.js` của skill prd-builder.
