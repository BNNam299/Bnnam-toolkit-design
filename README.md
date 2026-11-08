# Bnnam toolkit

Repo chứa các bộ skill Claude Code. Mỗi thư mục là **một bộ độc lập**: mở Claude Code ngay trong thư mục đó (hoặc chép `.claude/skills/` của bộ đó vào dự án app) là dùng được, không cần bộ khác.

| Thư mục | Bộ | Trả lời câu hỏi | Hướng dẫn |
|---|---|---|---|
| [market-tool-bnnam/](market-tool-bnnam/) | Nghiên cứu thị trường | Ý tưởng / dòng app này có đáng làm không, nhắm vào đâu | [market-tool-bnnam/README.md](market-tool-bnnam/README.md) |
| [product-tool-bnnam/](product-tool-bnnam/) | Định hình sản phẩm | Làm gì, cho ai, tới đâu, nghiệm thu thế nào (PRD) | [product-tool-bnnam/README.md](product-tool-bnnam/README.md) |
| [design-tool-bnnam/](design-tool-bnnam/) | Thiết kế + plugin Figma | Dựng luồng, màn hình, soát UX, bàn giao | [design-tool-bnnam/README.md](design-tool-bnnam/README.md) |

Khi dùng nối nhau, thứ tự là **market → product → design**: kết quả bộ trước để trong `docs/` của dự án app, bộ sau tự đọc.

Thêm bộ mới: tạo một thư mục ngang hàng, có `.claude/skills/` + `README.md` riêng.
