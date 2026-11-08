# App chăm sóc sức khỏe tinh thần — Báo cáo thị trường

> DỮ LIỆU THỬ — tên app và mọi con số trong file này là giả, chỉ dùng để thử bộ skill.

Trạng thái: đang làm bước 4 · Cập nhật: 05/11/2026 · Bước đã xong: 1, 2, 3 · Đọc từ raw/: st-downloads-revenue-us-2026-10.csv

## 0. Đọc nhanh
- Đang xét: app iOS giúp người trẻ ở Mỹ giảm căng thẳng hằng ngày bằng check-in tâm trạng + bài thở / nhật ký ngắn.
- Kết luận hiện tại: thị trường lớn và vẫn có app mới lên; nỗi đau rõ nhất là "app quá dài, quá nhiều nội dung, lúc căng thẳng không dùng nổi".
- Cần chốt: chọn ý tưởng ở bước 4.
- Bước tiếp: `market-score`.

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
Nỗi đau lớn nhất: lúc căng thẳng thì app quá dài và quá nhiều lựa chọn — người dùng bỏ giữa chừng.

| Nhóm nỗi đau | Người dùng thực sự cần gì | Bằng chứng | Nguồn độc lập | Tần suất / mức đau |
|---|---|---|---|---|
| Bài quá dài, quá nhiều lựa chọn khi đang căng thẳng | một việc làm ngay trong 1–2 phút, không phải chọn | #1–#9 | 4 (store A, B, Reddit, YouTube) | hằng ngày / cao |
| Giá đắt, bị trừ tiền sau dùng thử không biết | biết rõ giá, dùng được phần cơ bản miễn phí | #10–#16 | 3 | hằng tháng / cao |
| Quên dùng, không thành thói quen | lời nhắc đúng lúc, thấy được tiến bộ | #17–#22 | 3 | hằng ngày / vừa |
| Ghi nhật ký không biết viết gì | câu gợi ý ngắn theo tâm trạng | #23–#26 | 2 | vài lần/tuần / vừa |
| Lo ngại dữ liệu tâm trạng bị chia sẻ | dữ liệu ở trên máy, không cần tài khoản | #27–#29 | 2 | thấp / cao |

→ **Rút ra:** hướng "ngắn, làm ngay, không phải chọn" có nhiều bằng chứng nhất; giá minh bạch và quyền riêng tư là điểm cộng có thể bán.

- Người dùng khen: giọng đọc dễ chịu (#30), check-in tâm trạng nhanh của app C (#31).
- Cách tự xoay xở: hẹn giờ thở trên Apple Watch (#32), ghi chú trong Notes (#33).

## 4. Đối thủ
App lớn bán thư viện nội dung dài; app mới thắng nhờ ngắn và nhanh nhưng kiếm tiền yếu.

### 4.1 So sánh nhanh
| App | Quy mô | Xu hướng 3 tháng | Tiền / lượt tải | Người dùng chê nhất | Cơ hội cho mình |
|---|---|---|---|---|---|
| A (giả) | ~420k | ▲ +6% | 1,9 USD | quá dài (#2, #5) | bản ngắn 2 phút |
| B (giả) | ~310k | ▼ −9% | 2,4 USD | giá, trừ tiền bất ngờ (#11) | giá minh bạch |
| C (giả) | ~95k | ▲ +38% | 0,9 USD | ít nội dung sau 2 tuần (#20) | gợi ý theo tâm trạng |
| D (giả) | ~60k | ▲ +12% | 0,6 USD | không biết viết gì (#24) | câu gợi ý ngắn |
| E (giả) | ~25k | ▲ +55% | 0,4 USD | quảng cáo dày (#28) | không quảng cáo |

→ **Rút ra:** app lớn kiếm nhiều tiền / lượt tải nhưng bị chê dài; app nhỏ lên nhanh nhưng kiếm ít → cơ hội là "ngắn như C, kiếm tiền như A".

### 4.3 Tính năng miễn phí và thu tiền
| Tính năng | Bao nhiêu app có | Thường miễn phí hay thu tiền | Vùng | Mình nên |
|---|---|---|---|---|
| Check-in tâm trạng | 5/5 | miễn phí | phải có, miễn phí | có, miễn phí |
| Bài thở ngắn | 4/5 | miễn phí 1–2 bài | phải có, miễn phí | có, miễn phí |
| Thư viện thiền dài | 3/5 | thu tiền | thị trường đang bán | không làm ở bản đầu |
| Gợi ý theo tâm trạng lúc đó | 1/5 | thu tiền | điểm khác biệt có thu tiền | điểm khác biệt chính |
| Biểu đồ tâm trạng theo tuần | 3/5 | thu tiền | thị trường đang bán | gói trả phí |

→ **Rút ra:** check-in và bài thở ngắn là thứ phải có và cho miễn phí; "gợi ý đúng việc theo tâm trạng lúc đó" ít app có → điểm khác biệt.

### 4.5 Mức giá neo
Giá năm tụ quanh 59,99–69,99 USD (A, B); app nhỏ 29,99–39,99 USD/năm; gói tuần 4,99–7,99 USD (#45–#49). Dùng thử 7 ngày phổ biến.

### 4.6 Chỗ hở đã cân nhắc rồi loại
- Chatbot trị liệu bằng AI — loại vì team chưa làm AI và rủi ro quy định y tế (#34).

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
