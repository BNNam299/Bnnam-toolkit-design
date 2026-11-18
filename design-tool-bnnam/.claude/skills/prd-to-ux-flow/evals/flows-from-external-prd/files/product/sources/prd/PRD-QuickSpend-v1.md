# QuickSpend — Product Requirements v1.0

Owner: Hùng (PO, đối tác) · Ngày: 02/11/2026 · Nền tảng: iOS 17+ (iPhone)

## 1. Mục tiêu
Ghi một khoản chi trong dưới 5 giây. Xem tổng chi tuần / tháng theo danh mục. Kiếm tiền bằng gói Pro.

## 2. Phạm vi
- Trong phạm vi bản 1.0: ghi chi tay, danh mục, tổng tuần / tháng, ngân sách tháng, xuất CSV (Pro), khoá Face ID (Pro), widget ghi nhanh.
- Ngoài phạm vi: thu nhập, nhiều ví, đồng bộ nhiều thiết bị, chia tiền nhóm.

## 3. Điều cấm
- BAN: "Không kết nối tài khoản ngân hàng hay ví điện tử dưới bất kỳ hình thức nào."
- BAN: "Không hiện quảng cáo cho người dùng Pro."
- BAN: "Không yêu cầu đăng nhập để dùng bản miễn phí."

## 4. Yêu cầu chức năng

| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-01 | Ghi khoản chi: số tiền (bắt buộc), danh mục (mặc định danh mục dùng gần nhất), ghi chú (tuỳ chọn), ngày (mặc định hôm nay) | P0 |
| FR-02 | 8 danh mục có sẵn; người dùng thêm được danh mục riêng (miễn phí tối đa 3, Pro không giới hạn) | P0 |
| FR-03 | Sửa và xoá khoản chi; xoá có xác nhận | P0 |
| FR-04 | Danh sách khoản chi theo ngày, mới nhất trên cùng | P0 |
| FR-05 | Tổng chi tuần / tháng, biểu đồ cột theo danh mục | P0 |
| FR-06 | Đặt ngân sách tháng; báo khi đạt 80 % và 100 % | P1 |
| FR-07 | Widget màn hình chính: nút ghi nhanh + tổng hôm nay | P1 |
| FR-08 | Xuất CSV theo khoảng ngày (Pro) | P1 |
| FR-09 | Khoá app bằng Face ID (Pro) | P1 |
| FR-10 | Gói Pro: tuần 49.000 đ, năm 399.000 đ, dùng thử 3 ngày cho gói năm; khôi phục mua hàng | P0 |
| FR-11 | Quảng cáo banner cho người dùng miễn phí ở danh sách khoản chi | P1 |
| FR-12 | Dữ liệu lưu trên máy; sao lưu iCloud (Pro) | P1 |

## 5. Use case
- UC-01 Ghi nhanh một khoản chi từ widget.
- UC-02 Xem tháng này đã tiêu bao nhiêu cho ăn uống.
- UC-03 Nâng cấp Pro để xuất CSV gửi kế toán.
- UC-04 Đặt ngân sách tháng và nhận báo khi sắp vượt.

## 6. Quyết định
- DEC: "Màn mở app là danh sách khoản chi hôm nay, không phải màn tổng quan."
- DEC: "Paywall hiện khi chạm tính năng Pro, không hiện ngay lúc mở app lần đầu."
