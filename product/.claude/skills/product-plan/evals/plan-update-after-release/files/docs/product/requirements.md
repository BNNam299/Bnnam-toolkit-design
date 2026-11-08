# Yêu cầu chi tiết — Calm2

> DỮ LIỆU THỬ

## 1. Tình huống sử dụng (UC)
### UC-002 · Làm bài 2 phút theo tâm trạng · FEAT-02
- Là người đi làm đang căng, tôi muốn làm ngay một bài 2 phút, để bình tĩnh lại trước cuộc họp.
- Luồng chính: 1. chọn tâm trạng 2. nhận một bài 3. làm 2 phút 4. thấy chuỗi ngày.
- Luồng ngoại lệ: EX-002.1 thoát giữa bài → lưu "chưa xong".

## 2. Yêu cầu chức năng (FR)
### FR-003 · hệ thống đưa đúng một bài theo tâm trạng · UC-002 · P0
- AC-003.1: Given đã chọn tâm trạng, When bấm Bắt đầu, Then bài chạy trong ≤ 1 giây trên iPhone 11.
### FR-004 · bài trả phí mở paywall khi chưa mua · UC-002 · P0
- AC-004.1: Given chưa mua, When chạm bài trả phí, Then hiện paywall có nút đóng; đóng thì đưa bài miễn phí.
