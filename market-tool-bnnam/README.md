# market-tool-bnnam — bộ nghiên cứu thị trường app

Bộ skill Claude Code giúp trả lời một câu hỏi: **ý tưởng / dòng app này có đáng làm không, và nếu làm thì nhắm vào đâu.**
Bộ này dùng riêng, không phụ thuộc bộ khác. Kết quả là tài liệu bạn mang sang bước sau (sản phẩm, thiết kế).
Tra cứu nhanh theo tình huống và ai làm gì: [HUONG-DAN-SKILL.md](HUONG-DAN-SKILL.md).

## Cách dùng
1. Chép cả thư mục `.claude/` của bộ này (gồm `skills/` và `CLAUDE.md` — luật nói chuyện dễ hiểu, luôn được nạp) vào dự án app, hoặc mở Claude Code ngay trong thư mục này.
2. Tài liệu bạn đã có (file xuất từ công cụ, ảnh chụp, nghiên cứu cũ) để vào `docs/market/raw/` của dự án app.
3. Gọi lần lượt 5 bước dưới đây. Mỗi bước tự kiểm bước trước đã xong chưa. Nếu thiếu, bộ sẽ báo thiếu gì và hỏi bạn có cho chạy tiếp không.

| Bước | Gọi | Làm gì | Dừng hỏi bạn khi |
|---|---|---|---|
| 1 | `/market-kickoff` | hỏi điểm vào (từ khoá / ý tưởng / chưa có gì), ràng buộc, đặt **ngưỡng dừng** trước; có ý tưởng thì viết **brief cho Dev** bản 1 | bàn ý tưởng và ngưỡng dừng |
| 2 | `/market-scan` | quét nhanh: thị trường lớn cỡ nào, lên hay xuống, còn chỗ cho app mới không | chỉ khi thấy không đáng đào |
| 3 | `/market-dig` | đọc đánh giá người dùng và đối thủ trong một lượt; đưa **phiếu xin số liệu** | một lần: kết nối AppStoreSpy + phiếu Sensor Tower |
| 4 | `/market-score` | chấm điểm, chọn ý tưởng (≥ 3), kiểm nhanh "có lời không" và "làm được không"; brief cho Dev bản 2 (chỉ câu hỏi mới) | bảng ưu tiên ghi cả góc nhìn AI và bạn; bạn chọn luôn hoặc mang ra họp team |
| 5 | `/market-decide` | đọc trả lời của Dev, so với ngưỡng dừng, soạn **tài liệu họp** (md + docx) | **họp team** chốt làm tiếp / đổi hướng / dừng; bạn báo lại kết quả |

`market-standards` là luật chung (cách viết, cách ghi nguồn, cách xử lý thiếu dữ liệu). Các bước tự đọc, bạn không cần gọi.

## Kết quả nằm ở đâu
```
docs/market/
├── market-report.md   ← bản làm việc (agent đọc): mỗi bước điền một mục
├── evidence.md        ← bằng chứng nguyên văn, đánh số #1, #2… để báo cáo trỏ tới
├── dev-brief.md       ← yêu cầu thử nghiệm kỹ thuật, gửi Dev (agent của Dev đọc được) — tối đa 3 lần hỏi, ~1,5 tuần
├── meeting-brief-b4.md / -b5.md ← tài liệu họp team, đọc 5 phút (chỉ cho người đọc)
├── reader/            ← bản đọc (md) cho người trong lúc làm, bạn sửa thẳng được — xoá khi xong
├── export/            ← bản .docx để gửi, xuất khi xong: market-report.docx, dev-brief.docx + tài liệu họp
└── raw/               ← file của bạn (AI chỉ đọc) + trả lời của Dev: raw/dev-answer-<ngày>.md
```

## Số liệu: ai lấy gì
- **AI tự lấy:** trang App Store, đánh giá người dùng, Reddit, diễn đàn, Google Trends, báo cáo CPI công khai (team không có UA).
- **AppStoreSpy:** tới bước cần, bộ sẽ nhắc bạn kết nối. Bộ không bao giờ hỏi hay ghi mật khẩu.
- **Sensor Tower:** bạn tự lấy theo **phiếu xin số liệu** ở cuối `market-report.md`. Mỗi dòng ghi lấy gì, để trả lời câu hỏi nào, lưu vào `raw/` tên gì.
- **Dùng thử app đối thủ:** bạn làm (AI không cài được app). Phiếu ghi rõ cần chụp gì.

## Vài điều bộ luôn giữ
- Viết để PO, Dev, Designer, ASO, UA đều đọc hiểu. Thuật ngữ được giải nghĩa trong ngoặc ở lần đầu xuất hiện.
- Mỗi bảng có dòng **"→ Rút ra:"**. Bảng không dẫn tới việc gì thì không đưa vào.
- Không bịa số. Số từ công cụ luôn ghi "ước tính" kèm nguồn, nước và tháng. Chỉ dùng dữ liệu từ 2025 trở đi.
- AI chỉ **đoán sơ bộ** chuyện kỹ thuật. Dev mới là người kết luận làm được hay không.
- Chỗ nào phải đoán thì ghi **"giả định"** ngay tại chỗ, và gom vào danh sách *"Cần bổ sung để kiểm lại"* để kiểm sau.
