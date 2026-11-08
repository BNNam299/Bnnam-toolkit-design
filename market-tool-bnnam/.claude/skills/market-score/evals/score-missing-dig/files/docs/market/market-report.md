# App chăm sóc sức khỏe tinh thần — Báo cáo thị trường

> DỮ LIỆU THỬ — tên app và mọi con số trong file này là giả, chỉ dùng để thử bộ skill.

Trạng thái: đang làm bước 3 · Cập nhật: 05/11/2026 · Bước đã xong: 1, 2 · Đọc từ raw/: st-downloads-revenue-us-2026-10.csv

## 0. Đọc nhanh
- Đang xét: app iOS giúp người trẻ ở Mỹ giảm căng thẳng hằng ngày bằng check-in tâm trạng + bài thở / nhật ký ngắn.
- Kết luận hiện tại: thị trường lớn, đang tăng nhẹ, vẫn có app mới lên — đáng đào sâu.
- Cần chốt: chưa có.
- Bước tiếp: `market-dig`.

## 1. Khởi động
Bắt đầu từ một ý tưởng có sẵn; muốn biết có đáng làm và nên nhắm vào đâu.

- Điểm vào: ý tưởng — app check-in tâm trạng mỗi ngày, gợi ý bài thở hoặc nhật ký 2 phút khi căng thẳng.
- Ý tưởng: Cho người đi làm 22–35 tuổi ở Mỹ đang căng thẳng thường xuyên trong giờ làm, app giúp bình tĩnh lại trong 2 phút bằng check-in tâm trạng và một bài thở / nhật ký ngắn chọn theo tâm trạng lúc đó.
- Ràng buộc: iOS · Mỹ trước · thuê bao · 2 dev iOS · quyết trong 3 tuần.
- Team mạnh gì: onboarding và paywall (màn mời trả tiền); chưa làm AI.

**Ngưỡng dừng đặt trước** (đặt 01/11/2026):
| Nếu… | Thì |
|---|---|
| 3 app đầu chiếm > 80% lượt tải và không app nào ra mắt trong 12 tháng vượt 20k tải/tháng | dừng |
| Nỗi đau chính có < 2 nguồn độc lập | đổi hướng |
| Tiền thu / lượt tải (mức giữa) < CPI tham chiếu thấp nhất ở mọi nhóm nước | dừng hoặc đổi cách bán |
| Dev trả lời "không đạt" cho tính năng cốt lõi mà không có phương án thay | dừng |

## 2. Quét nhanh
Thị trường lớn, đang tăng nhẹ, và vẫn có app mới lên được — đáng đào sâu.

| App | Quy mô (tải/tháng, US) | Xu hướng 3 tháng | Tiền / lượt tải | Ra mắt | Ghi chú |
|---|---|---|---|---|---|
| App A (giả) | ~420k | ▲ +6% | 1,9 USD | 2016 | thiền dài, thư viện lớn |
| App B (giả) | ~310k | ▼ −9% | 2,4 USD | 2014 | thiền + ngủ |
| App C (giả) | ~95k | ▲ +38% | 0,9 USD | 03/2025 | check-in tâm trạng, nhanh |
| App D (giả) | ~60k | ▲ +12% | 0,6 USD | 2021 | nhật ký có gợi ý |
| App E (giả) | ~25k | ▲ +55% | 0,4 USD | 01/2026 | bài thở 1 phút |

(Sensor Tower, US, 10/2026, ước tính — #40–#44)

→ **Rút ra:** hai app lớn chiếm phần lớn doanh thu nhưng app B đang tụt; hai app mới (C, E) lên nhanh với hướng "ngắn, nhanh" → còn chỗ cho người mới nếu đi hướng ngắn.

- Từ khoá chính: "anxiety relief" (tìm nhiều, khó cao), "mood tracker" (vừa, khó vừa, ▲ 12 tháng), "breathing exercise" (vừa, khó thấp).
- Có chỗ cho người mới không: có — C và E ra mắt 2025–2026 đã vào top 10 (#42, #44).
- Nhu cầu thật hay trào lưu: nhu cầu thật — nhiều từ khoá cùng tăng, nhiều app cùng tăng.
- **Kết luận bước 2:** đào tiếp — chưa chạm ngưỡng dừng nào.

## 3. Người dùng đang khổ ở đâu

## 4. Đối thủ

## 5. Cơ hội và ý tưởng

## 6. Quyết định

## 7. Đưa sang bước sau

### Cần bổ sung để kiểm lại
| Giả định | Dùng ở | Cần dữ liệu gì để kiểm | Nếu sai thì đổi kết luận nào |
|---|---|---|---|
| Tiền / lượt tải lấy từ doanh thu ÷ tải tháng 10, có lẫn tiền gia hạn | §2, §4 | doanh thu theo nhóm người tải cùng tháng | ước tính có lời ở bước 4 |

## Phụ lục — Phiếu xin số liệu
| ☐ | Lấy gì (app · nước · kỳ) | Để trả lời câu hỏi gì | Mức | Lưu vào |
|---|---|---|---|---|
| ☑ | Tải + doanh thu theo tháng, A–E · US · 10/2026 | thị trường lớn cỡ nào, có trả tiền không | bắt buộc | `raw/st-downloads-revenue-us-2026-10.csv` |
| ☐ | Doanh thu chia theo nước, app A và C | nên nhắm nhóm nước nào | bắt buộc | `raw/st-revenue-by-country-2026-10.csv` |
| ☐ | Retention D1/D7/D30 app A, C, E | người dùng có quay lại không | tốt nếu có | `raw/st-retention-us-2026-10.csv` |
