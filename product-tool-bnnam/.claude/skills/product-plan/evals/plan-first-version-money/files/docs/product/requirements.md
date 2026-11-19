# Yêu cầu chi tiết — 2 Phút (tên làm việc)

**Đi kèm**: docs/product/prd.md · **Cập nhật**: 07/11/2026 · **Bản app đang viết**: 1.0.0

## 0. Đọc nhanh
- Phủ: 0 tính năng · 0 tình huống (UC) · 0 yêu cầu (FR) · 0 tiêu chí nghiệm thu — bước `product-kickoff` chưa viết yêu cầu nào.
- Còn hở: tất cả — chưa có tính năng nào được đánh mã; `product-plan` đánh mã FEAT, `product-spec` viết UC và FR.
- Chờ Dev: 5 câu hỏi (DQ-01…DQ-05, §8).

## 1. Tình huống sử dụng (UC)
Chưa làm — `product-spec`.

## 2. Yêu cầu chức năng (FR) và tiêu chí nghiệm thu
Chưa làm — `product-spec` viết, `product-detail` gắn màn.

## 3. Yêu cầu chất lượng (NFR)
Chưa làm — `product-spec`. Máy tham chiếu chưa chốt (DQ-02).

## 4. Công thức nghiệp vụ (BR)
Chưa làm — `product-spec`.

## 5. Quyền và dữ liệu
Chưa làm — `product-spec`.

**Không thu thập** (khớp BAN-03 ở prd.md §4, đã khoá từ bước định hình): danh tính người dùng (tên, email, số điện thoại) · vị trí · danh bạ · lịch · ảnh · dữ liệu sức khoẻ từ HealthKit · bất kỳ dữ liệu tâm trạng nào gửi ra khỏi máy · dữ liệu cho SDK quảng cáo hoặc theo dõi của bên thứ ba.

## 6. Sự kiện đo — bản nháp
Chưa làm — `product-spec` dựng khung, `product-detail` gắn màn.

## 7. Giao dịch và các nhóm dễ sót
Chưa làm — `product-detail`. Danh sách nhóm bắt buộc phải phủ đã nằm trong "Không được cắt" ở prd.md §4 (khôi phục mua hàng, từ chối quyền kể cả vĩnh viễn, đường lui khi widget hỏng, trạng thái trống lần đầu).

## 8. Câu hỏi cho Dev
| Mã | Câu hỏi | Ngưỡng chấp nhận | Cần trước | Trả lời (nguồn, ngày) |
|---|---|---|---|---|
| DQ-01 | Lịch duyệt của App Store Connect dịp cuối năm nay thế nào? Nộp ngày 19/12/2026 thì khi nào duyệt xong? (kiểm trên trang chính thức, không lấy theo trí nhớ) | Có ngày cụ thể từ nguồn chính thức, đủ để biết mốc 02/01/2027 còn giữ được không | 14/11/2026 — trước buổi kick-off | chưa có |
| DQ-02 | iOS tối thiểu của bản 1.0.0 là bản nào? Máy yếu nhất dùng để đo là máy gì? (ngày 14/11/2026 bạn đã đo widget trên iPhone 11 / iOS 17) | Một con số iOS tối thiểu và một tên máy, kèm lý do (tỉ lệ máy còn dùng) | 14/11/2026 | chưa có |
| DQ-03 | Dữ liệu tâm trạng chỉ nằm trên máy: người dùng đổi máy hoặc cài lại thì dữ liệu đi đâu? Có cách giữ lại mà không bắt đăng nhập tài khoản không? (market §5.4, T4) | Nêu rõ một trong hai: có cách giữ không cần tài khoản, hoặc xác nhận mất dữ liệu — để app nói trước với người dùng | 14/11/2026 | chưa có |
| DQ-04 | Luật chọn bài theo tâm trạng để hẳn trong app và sửa qua bản cập nhật, không cần server — có vướng gì không? (market §5.4, T3) | Xác nhận làm được không cần server, hoặc nêu rõ chỗ buộc phải có server | 14/11/2026 | chưa có |
| DQ-05 | Nhắc 1 lần/ngày vào giờ người dùng tự chọn có bắn đúng giờ khi app chưa mở lần nào trong ngày không? Bị trễ bao lâu trong trường hợp xấu nhất? | Có số độ trễ tối đa đo được trên máy yếu nhất | 14/11/2026 | chưa có |

→ **Rút ra:** DQ-03 và DQ-04 chạm thẳng vào điều cấm BAN-02 (không tài khoản, không backend). Nếu câu trả lời là "buộc phải có server" thì phải mở điều cấm bằng một quyết định mới trước khi `product-plan` chốt danh sách tính năng — không được âm thầm thêm server vào sau.
