# Yêu cầu thử nghiệm kỹ thuật — App chăm sóc sức khỏe tinh thần

> DỮ LIỆU THỬ — tài liệu mẫu để thử bộ skill.

Bản 1 · 01/11/2026 · Gửi: 2 dev iOS · Mong nhận trả lời trước: 15/11/2026
Trạng thái: Đã duyệt, gửi Dev

## 0. Đọc nhanh (3 phút)
- App làm gì, cho ai: người đi làm ở Mỹ check-in tâm trạng và làm một bài thở / nhật ký 2 phút khi căng thẳng.
- Cần Dev trả lời: check-in + bài thở có mở được thật nhanh từ màn hình khoá / widget không; lời nhắc có đến đúng lúc không.
- Cần câu trả lời trước: 15/11/2026.

## 1. App làm gì
1. Người dùng chạm widget → chọn tâm trạng bằng 1 chạm.
2. App gợi ý một bài thở hoặc nhật ký 2 phút.
3. Làm xong → thấy tâm trạng tuần này.

## 2. Tính năng cần thử
**Cốt lõi:**
- T1 · Mở check-in từ widget / màn hình khoá trong vài giây.
- T2 · Bài thở có rung nhẹ theo nhịp, chạy được khi màn hình tắt.
**Phụ:**
- P1 · Lời nhắc thông minh theo giờ người dùng hay căng thẳng.

## 3. Thế nào là đạt
### T1
- Đạt: từ chạm widget tới màn check-in ≤ 1,5 giây trên máy yếu nhất.
- Không đạt: > 3 giây.
- Vì sao: người dùng bỏ khi phải chờ lúc đang hoảng (#1).

## 4. Thử trên máy nào
| Nhóm máy | Máy | Ý nghĩa |
|---|---|---|
| Máy yếu nhất | iPhone 11 (iOS 17) | Mọi ngưỡng tính trên máy này |
| Máy phổ biến | iPhone 14 | |
| Máy mạnh | iPhone 16 Pro | |

## 5. Nếu không đạt thì sao
| Tính năng | Nếu không đạt |
|---|---|
| T1 | bỏ widget, dùng phím tắt / App Intents |

## 6. Không cần thử
- Giao diện hoàn chỉnh, thanh toán, Android, server.

## 7. Cách trả lời
Lưu thành `docs/market/raw/dev-answer-<yyyy-mm-dd>.md`.
