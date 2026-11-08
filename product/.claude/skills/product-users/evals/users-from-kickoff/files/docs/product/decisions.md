# Sổ quyết định — 2 Phút (tên làm việc)

<!-- Chỉ ghi thêm, không sửa, không xoá. Quyết định bị thay: ghi quyết định mới "thay cho D-…". -->

## Đọc nhanh
- 9 quyết định · gần nhất: D-09 ngày 07/11/2026 — PO kiêm vai đo lường, ASO và kiểm thử ở bản 1.0.0.
- Yêu cầu đang chờ xét: 0 (R-…)

## Quyết định
| Mã | Ngày · ai chốt | Chốt gì (thay cho D-… nếu có) | Vì sao (bằng chứng) | Đụng tới | Ghi chú |
|---|---|---|---|---|---|
| D-01 | 07/11/2026 · PO | Làm bản 1.0.0 theo Ý1 của bộ market: một chạm tâm trạng → đúng một bài 2 phút, không có thư viện | Bước thị trường kết luận "làm tiếp — đổi cách bán" (market §6, PO chốt 15/11/2026); Ý1 đạt 4,30/5, cao nhất 4 ý tưởng (market §5.2) | prd §2, §4 | — |
| D-02 | 07/11/2026 · PO | Phạm vi bản 1.0.0 gồm đúng 8 khả năng liệt kê ở prd §4 "Trong phạm vi" | Mỗi hạng mục phục vụ câu "phải chứng minh"; các hạng mục khác đã chuyển sang "Ngoài phạm vi, đã cân nhắc" | prd §4 | `product-plan` được phép hạ hạng mục 4, 6, 7 xuống P1 nếu Dev ước giờ không vừa 8 tuần, nhưng không được bỏ |
| D-03 | 07/11/2026 · PO | Tám điều cấm BAN-01…BAN-08 (prd §4) | BAN-01 từ M#1, M#2 (4 nguồn độc lập); BAN-04, BAN-05 từ M#10–#16; BAN-06 từ M#28, M#44; BAN-08 từ M#34 | prd §4, requirements §5 | Mở khoá bất kỳ điều cấm nào đều cần một quyết định D-… mới |
| D-04 | 07/11/2026 · PO | Năm nguyên tắc phân xử ở prd §3 | Mỗi nguyên tắc loại bỏ được một tính năng hợp lý cụ thể — xem cột thứ ba trong bảng | prd §3, mọi quyết định sau | Dùng để phân xử tranh cãi trong kick-off và khi thiết kế |
| D-05 | 07/11/2026 · PO | Mốc ngày: nộp App Review chậm nhất 19/12/2026, ra mắt 1.0.0 chậm nhất 02/01/2027 (8 tuần từ 07/11/2026) | Ràng buộc PO đặt ra; tuần 7–8 để dự phòng thời gian duyệt và sửa lỗi sau duyệt | prd §3, §13 | Mốc này phụ thuộc DQ-01 (lịch duyệt cuối năm) — chưa xác nhận |
| D-06 | 07/11/2026 · PO | Nền tảng: chỉ iPhone. Không iPad, không Android ở bản 1.0.0. iOS tối thiểu do Dev chốt (DQ-02) | Market §1 chốt iOS và Mỹ trước; team có 2 dev iOS và 8 tuần | prd §4, §9 | — |
| D-07 | 07/11/2026 · PO | Thu tiền bằng thuê bao; không quảng cáo trong app; không mua quảng cáo kéo người dùng ở bản 1.0.0 — đường vào là tìm kiếm trên store | Market §5.3: ở Mỹ không kịch bản nào mua nổi lượt tải (trần hoà vốn 1,28 USD < CPI tham chiếu thấp nhất 1,50 USD, M#52); market §6 chốt nhánh "đổi cách bán" | prd §4, §8 | Xét lại khi có CPI thật của dòng sức khoẻ tinh thần (đang chờ, market §7) |
| D-08 | 07/11/2026 · PO | Tên làm việc của dự án là "2 Phút"; tên thật trên store do ASO đặt sau | Cần một cái tên để gọi trong tài liệu; đặt tên store sớm không có lợi vì chưa làm từ khoá | prd (toàn bộ) | Đổi tên không cần quyết định mới, chỉ cần một dòng ở Lịch sử tài liệu |
| D-09 | 07/11/2026 · PO | Bản 1.0.0 chạy với 4 người: PO (kiêm đo lường, ASO, kiểm thử cùng 2 dev), 2 dev iOS, 1 designer. Không có BE, không có AI, không có UA | Đội hình thực tế PO nêu 07/11/2026; BE và AI trùng với BAN-02 và BAN-08; UA trùng với D-07 | prd §1 | Nếu cần thêm người thì phải xét lại mốc ngày ở D-05 |

## Hàng chờ yêu cầu
<!-- product-plan nhận mọi yêu cầu mới vào đây trước khi xếp vào phiên bản. -->
| Mã | Ngày | Từ đâu | Yêu cầu | Bằng chứng | Trạng thái |
|---|---|---|---|---|---|
| — | — | — | chưa có yêu cầu nào trong hàng chờ | — | — |
