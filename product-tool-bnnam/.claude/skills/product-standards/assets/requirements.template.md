# Yêu cầu chi tiết — <Tên app>

**Đi kèm**: docs/product/prd.md · **Cập nhật**: <dd/mm/yyyy> · **Bản app đang viết**: <1.0.0>

<!-- Cách viết: product-standards/references/requirements-writing.md. Chỉ viết CÁI GÌ và NGHIỆM THU THẾ NÀO —
     không kiến trúc, không API, không tên thư viện, không lược đồ dữ liệu (phần đó của Dev).
     Thiếu thông tin kỹ thuật: ghi "giả định" + câu hỏi Dev (DQ-…), không đoán rồi viết như đã chốt.
     Mã không đổi, không dùng lại, không đánh lại. Yêu cầu bỏ đi thì ghi "(bỏ ở bản x — D-…)". -->

## 0. Đọc nhanh
- Phủ: <n> tính năng · <n> tình huống (UC) · <n> yêu cầu (FR) · <n> tiêu chí nghiệm thu
- Còn hở: <tính năng chưa có UC / UC chưa có FR / FR chưa có tiêu chí — hoặc "không">
- Chờ Dev: <n> câu hỏi (DQ-…)

## 1. Tình huống sử dụng (UC)                                   <!-- product-spec -->

### UC-001 · <tên> · FEAT-01
- Là <persona>, tôi muốn <việc>, để <kết quả>.
- Điều kiện trước: …
- Luồng chính: 1. … 2. … 3. …
- Luồng thay thế: AF-001.1 <khi …> → …
- Luồng ngoại lệ: EX-001.1 <khi …> → … (mỗi nhánh có kết cục, không nhánh cụt)
- Kết quả sau cùng: …

## 2. Yêu cầu chức năng (FR) và tiêu chí nghiệm thu             <!-- product-spec viết; product-detail gắn màn -->

### FR-001 · <hệ thống phải …> · UC-001 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: …
- Người dùng nhận được gì · đo hiệu quả bằng: …
- Màn: <SCR-… — điền từ mức Đủ để build>
- Tiêu chí nghiệm thu:
  - AC-001.1 · [Lead kiểm] Given … When … Then … (trên máy <…>)   ← giao diện, chữ, trạng thái màn
  - AC-001.2 · [Dev kiểm] Given … When … Then …                    ← logic, dữ liệu, quyền, thanh toán
- Phụ thuộc / giả định: <DQ-… nếu có>

## 3. Yêu cầu chất lượng (NFR)                                   <!-- product-spec -->
**Máy tham chiếu:** yếu nhất <…> · phổ biến <…> · mạnh <…>

| Mã | Nhóm | Yêu cầu | Ngưỡng | Đo trên máy / điều kiện |
|---|---|---|---|---|
| NFR-01 | Hiệu năng | Mở app lạnh | < 2,0 giây | máy yếu nhất |
| NFR-02 | Tiếp cận | Tương phản chữ thường | ≥ 4,5:1 | |
| NFR-03 | Tiếp cận | Vùng chạm | ≥ 44pt | |
| NFR-04 | Tiếp cận | Cỡ chữ hệ thống lớn nhất | không vỡ bố cục, không cắt chữ | |
| NFR-05 | Tiếp cận | Màu không là kênh báo tin duy nhất | | |
| NFR-06 | Tiếp cận | Nhãn VoiceOver | mọi thành phần bấm được | |
| NFR-07 | Độ tin cậy | Mất mạng / bị dừng / hết dung lượng | <hành vi> | |

## 4. Công thức nghiệp vụ (BR)                                   <!-- product-spec -->
> Công thức chỉ định nghĩa ở đây; nơi khác trích mã BR.

### BR-01 · <tên>
- Công thức: …
- Ví dụ tính tay: …
- Trường hợp biên (≥ 5): bằng 0 · âm · đúng ngưỡng · vượt ngưỡng 1 đơn vị · reset lúc <giờ, múi giờ> · …
- Áp cho: FR-…

## 5. Quyền và dữ liệu                                           <!-- product-spec -->
| Mã | Quyền | Xin lúc nào | Đồng ý | Từ chối | Từ chối vĩnh viễn |
|---|---|---|---|---|---|

| Mã | Dữ liệu | Vì sao cần | Lưu ở đâu (Dev xác nhận) | Giữ bao lâu | Xoá được / đổi máy thì sao |
|---|---|---|---|---|---|

**Không thu thập:** <danh sách — khớp điều cấm BAN-… ở prd.md §4>

## 6. Sự kiện đo — bản nháp                                      <!-- product-spec khung; product-detail gắn màn -->
| Mã | Sự kiện (snake_case, quá khứ) | Bắn khi | Phục vụ chỉ số / bước phễu | Màn |
|---|---|---|---|---|

## 7. Giao dịch và các nhóm dễ sót                                <!-- product-detail -->
| Nhóm | Người dùng thấy gì | Tiêu chí nghiệm thu |
|---|---|---|
| Mua thành công | | |
| Mua thất bại | | |
| Đang chờ | | |
| Huỷ giữa chừng | | |
| Hoàn tiền | | |
| Hết hạn | | |
| Gia hạn thất bại | | |
| Khôi phục mua hàng | | |
| Lỗi và đường phục hồi | | |
| Từ chối quyền / từ chối vĩnh viễn | | |
| Mất mạng giữa chừng | | |
| Chạm giới hạn miễn phí | | |
| Cỡ chữ lớn nhất · chế độ tối | | |
| App bị dừng rồi mở lại | | |

## 8. Câu hỏi cho Dev
| Mã | Câu hỏi | Ngưỡng chấp nhận | Cần trước | Trả lời (nguồn, ngày) |
|---|---|---|---|---|

## 9. Bảng truy vết                                              <!-- product-detail -->
| FEAT | FR | AC | Ai kiểm (Lead / Dev) | Kịch bản nghiệm thu | Trạng thái |
|---|---|---|---|---|---|
