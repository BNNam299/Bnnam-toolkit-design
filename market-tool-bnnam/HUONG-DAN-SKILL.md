# Tra cứu nhanh — bộ market: gặp việc gì thì gọi gì, ai làm gì

Bạn (designer, kiêm lead) cầm bộ này từ đầu tới cuối. Dev iOS / Android trả lời phần kỹ thuật. Team không có ASO, UA — bộ tự lấy phần số đó.
Việc lớn chốt ở **họp team**; AI chuẩn bị tài liệu và gợi ý, không tự chốt.

## Gặp việc gì → gọi gì
| Bạn muốn | Gọi | Bạn làm gì |
|---|---|---|
| Bắt đầu với một từ khoá / một ý tưởng / chưa có gì | `/market-kickoff` | trả lời một lượt câu hỏi, duyệt ngưỡng dừng, duyệt brief gửi Dev |
| Xem nhanh thị trường có đáng đào không | `/market-scan` | nếu AI thấy không đáng: bạn quyết dừng / đổi hướng / vẫn đào |
| Đào nỗi đau người dùng + đối thủ | `/market-dig` | kết nối AppStoreSpy khi được nhắc · tra Sensor Tower theo phiếu · dùng thử 3 app đối thủ |
| Chấm điểm, chọn ý tưởng | `/market-score` | tự xếp ưu tiên bên cạnh AI · chọn luôn hoặc mang ra họp team |
| Dev trả lời / hết hạn / chốt cuối | `/market-decide` | mang tài liệu họp đi họp team · họp xong báo lại kết quả |
| Dev báo bị chặn sau bản 2 | `/market-score` (chạy lại) | cùng AI chọn 1–2 cách đi khác → gửi vòng hỏi cuối |
| Có số liệu mới sau khi đã chốt | `/market-decide` | để file vào `docs/market/raw/` |

## Hỏi Dev — tối đa 3 lần, khoảng 1,5 tuần
| Lần | Khi nào | Hỏi gì | Hạn |
|---|---|---|---|
| Bản 1 | sau bước 1 | phần lõi làm được không, rủi ro lớn nhất | 3 ngày làm việc |
| Bản 2 | sau bước 4 | chỉ câu hỏi mới | 2 ngày |
| Vòng thêm | Dev báo bị chặn | chỉ cách đi khác | 2 ngày |

Dev trả lời lúc nào cũng được — để vào `docs/market/raw/dev-answer-<ngày>.md`. Quá hạn hoặc hết 3 lần mà chưa rõ → đưa vào họp dạng rủi ro.

## Ai lấy số liệu gì
- **AI tự lấy:** trang store, review, Reddit / diễn đàn, Google Trends, báo cáo CPI công khai (thay cho người làm UA).
- **AppStoreSpy:** bạn kết nối khi được nhắc; AI đọc thứ hạng, lượt tải ước tính, từ khoá.
- **Sensor Tower:** bạn tra theo **phiếu xin số liệu** ở cuối báo cáo, lưu đúng tên file vào `raw/`.

## Đọc gì, gửi gì
| File | Ai đọc |
|---|---|
| `docs/market/reader/market-report.md` | **bạn đọc và sửa trong lúc làm** — bản viết lại dễ đọc, cập nhật cuối mỗi bước; phần bạn sửa được đưa vào bản làm việc ở bước sau |
| `docs/market/export/market-report.docx`, `dev-brief.docx` | **bản gửi đi** — xuất khi xong bước 5 (brief Dev xuất ngay khi bạn duyệt gửi); lúc đó thư mục `reader/` bị xoá |
| `docs/market/market-report.md` | bản làm việc — agent của các bước sau và bộ product đọc; có mã, số bằng chứng, lịch sử |
| `docs/market/meeting-brief-b4.md` / `-b5.md` + `export/*.docx` | người dự họp (5 phút) — agent không dùng file này |
| `docs/market/dev-brief.md` | Dev và agent của Dev |
| `docs/market/evidence.md` | khi cần kiểm một nhận định |

## Khi bộ làm sai
Nói thẳng chỗ sai. AI sửa, rồi ghi một dòng vào `.claude/skills/market-standards/references/toolkit-lessons.md` để lần sau không lặp lại.
