# PRD — Calm2 (app chăm sóc sức khỏe tinh thần)

> DỮ LIỆU THỬ — tài liệu mẫu để thử bộ skill; mọi số liệu là giả.

**Phiên bản tài liệu**: 1.2 · **Phiên bản app đang viết**: 1.0.0
**Cập nhật**: 28/11/2026 · **Người viết**: AI soạn, PO duyệt
**Trạng thái**: Bản 1.0.0 — mức Đủ để thiết kế, đang chờ design

## 0. Đọc nhanh
- Đang làm: app iOS cho người đi làm ở Mỹ hạ căng thẳng trong 2 phút; đang viết bản 1.0.0.
- Tình trạng: 5 tính năng ở mức Đủ để thiết kế, 0 ở mức Đủ để build.
- Cần chốt: chưa có.
- Bước tiếp: bộ design vẽ luồng và UI, sau đó gọi product-detail.

## 1. Thông tin dự án

### Người tham gia
| Vai trò | Tên | Trách nhiệm |
|---|---|---|
| Product Owner | Lan | Nghiên cứu, chốt tính năng và các phiên bản |
| Developer | Minh, Huy | Làm app, trả lời khả thi và ước giờ |
| UI/UX | Nga | Thiết kế |
| Data Analytic | Thuý | Tài liệu đo lường |

### Lịch sử tài liệu
| Ngày | Phiên bản tài liệu | Đổi gì | Vì sao | Người |
|---|---|---|---|---|
| 16/11/2026 | 1.0 | Tạo PRD | market chốt làm tiếp | Lan |
| 21/11/2026 | 1.1 | Chốt bản 1.0.0 sau kick-off | D-04 | Lan |
| 28/11/2026 | 1.2 | 5 tính năng lên Đủ để thiết kế | product-spec | Lan |

### Liên kết
| Nội dung | Link |
|---|---|
| Nghiên cứu thị trường | docs/market/market-report.md |
| Figma (UI/UX) | chưa có |
| Yêu cầu chi tiết | docs/product/requirements.md |
| Sổ quyết định | docs/product/decisions.md |

# Phần A — Cấp sản phẩm

## 2. Tóm tắt
Người đi làm đang căng thẳng không chọn nổi bài trong thư viện dài; Calm2 đưa thẳng một bài 2 phút sau một chạm.

### Vấn đề và giải pháp
| # | Vấn đề (cơ chế → hệ quả đo được) | Bằng chứng | Giải pháp tương ứng |
|---|---|---|---|
| 1 | thư viện 300 bài → người đang hoảng không chọn nổi → bỏ app giữa chừng | M#1, M#2, M#5 | chọn tâm trạng 1 chạm → app đưa thẳng một bài 2 phút |
| 2 | không có nhắc đúng lúc → quên dùng sau tuần đầu | M#17–M#22 | chuỗi ngày + biểu đồ tuần (bản 1.0.0), nhắc theo giờ căng (để sau) |

### Định vị
- Từ → tới: app thiền thư viện dài → một việc 2 phút đúng lúc căng.

## 3. Mục tiêu và nguyên tắc
| # | Ưu tiên … hơn … | Tính năng hợp lý mà nguyên tắc này loại bỏ |
|---|---|---|
| 1 | dùng hằng ngày trong 2 phút hơn độ sâu nội dung | thư viện 300 bài |
| 2 | giá nói trước hơn tối đa tỉ lệ dùng thử | paywall giấu giá sau trial |
| 3 | dữ liệu nằm trên máy hơn đồng bộ nhiều thiết bị | đăng nhập tài khoản |

## 4. Phạm vi và điều cấm
**Bản đầu phải chứng minh:** người đi làm quay lại check-in ≥ 3 ngày/tuần mà không cần thư viện.

### Điều cấm
| Mã | Bị cấm | Vì sao | Ai được mở khoá |
|---|---|---|---|
| BAN-01 | tài khoản người dùng | dữ liệu nằm trên máy (nguyên tắc 3) | PO, qua decisions.md |
| BAN-02 | thư viện bài để duyệt | đi ngược vấn đề 1 | PO, qua decisions.md |

### Không được cắt trong mọi trường hợp
| Hạng mục | Vì sao không được cắt | Cắt thì hỏng thế nào |
|---|---|---|
| bài thở chạy khi từ chối thông báo | thông báo là tuỳ chọn | 30–40% người từ chối không dùng được app |
| giá hiện trước nút dùng thử | nguyên tắc 2 | review "bị trừ tiền bất ngờ" như app B (M#11) |

## 5. Người dùng
#### PER-01 · Mai, 27 tuổi, nhân viên văn phòng ở Mỹ · GIẢ ĐỊNH (proto)
- Bối cảnh: căng thẳng giữa hai cuộc họp, có 2–5 phút.
- Nỗi đau: "When I'm panicking I don't have 15 minutes" (M#1).
- Cần: hạ căng trong 2 phút mà không phải chọn.

**Khoảnh khắc thấy app có ích:** hoàn thành bài 2 phút đầu tiên · đường ngắn nhất 3 bước từ lần mở đầu.

## 6. Cạnh tranh và khác biệt
Xem docs/market/market-report.md §4.

## 7. Chỉ số — bản nháp
> Bản nháp — sẽ chuyển sang bộ measure khi có.

| Tầng | Chỉ số | Công thức (tử / mẫu / cửa sổ) | Mốc tham chiếu | Mục tiêu bản này |
|---|---|---|---|---|
| Chỉ số chính | người làm ≥ 3 bài/7 ngày | người có ≥ 3 checkin_completed trong 7 ngày đầu / người cài | giả định | 25% |
| Đầu vào | đạt aha phiên đầu | người có session_completed trong phiên đầu / người mở lần đầu | giả định | 60% |
| Đầu vào | bắt đầu dùng thử | trial_started / người cài, 7 ngày | mốc team > 6% | 6% |
| Rào chắn | huỷ dùng thử ngày 1 | trial_cancelled trong 24h / trial_started | KB5: < 30–35% | < 30% |

## 8. Kiếm tiền — bản nháp
> Bản nháp — sẽ chuyển sang bộ monetize khi có.

- Mô hình: thuê bao, dùng thử 3 ngày — người dùng dùng hằng ngày.
- Kịch bản onboarding + paywall: xương sống KB5 (Trial-first) — traffic chủ yếu từ tìm kiếm nhưng người dùng sợ bị trừ tiền (M#11).

### Miễn phí và trả phí
| Phần | Miễn phí | Trả phí | Vì sao chia vậy |
|---|---|---|---|
| Bài 2 phút | 3 bài thở cố định | toàn bộ bài theo tâm trạng | miễn phí đủ thành thói quen |
| Biểu đồ tâm trạng | 7 ngày gần nhất | toàn bộ lịch sử + xu hướng tháng | bán chiều sâu |

### Gói và giá
| Mã gói | Chu kỳ | Giá (theo nước) | Dùng thử | Neo đối thủ |
|---|---|---|---|---|
| PLN-W | tuần | 4,99 USD (Mỹ) | không | — |
| PLN-Y | năm | 39,99 USD (Mỹ) | 3 ngày | dưới A/B 59,99–69,99 USD (M#45) |

### Paywall và quảng cáo hiện ở đâu
| Điểm chạm | Loại | Người dùng đã thấy giá trị chưa | Ghi chú |
|---|---|---|---|
| sau bài 2 phút đầu tiên | paywall | rồi (sau aha) | có nút đóng rõ |
| chạm bài trả phí | paywall | rồi | |

## 9. Ràng buộc mobile
| Nhóm | Mức mặc định của team | Dự án này |
|---|---|---|
| Nền tảng | iOS, iPhone | iOS 17+, iPhone, không iPad |
| Hiệu năng | mở app < 2,0 giây trên máy yếu nhất | widget → check-in ≤ 1,5 giây trên iPhone 11 (Dev 14/11: 1,2 giây) |
| Thông báo | nhắc tối đa 1 lần/ngày | 1 lần/ngày, giờ người dùng chọn |

# Phần B — Tính năng

## 10. Bảng tính năng
| Mã | Tính năng | Giải gì (bằng chứng) | Ưu tiên | Mức | Bản |
|---|---|---|---|---|---|
| FEAT-01 | Check-in 1 chạm từ widget | quá nhiều lựa chọn (M#1, M#2) | P0 | Đủ để thiết kế | 1.0.0 |
| FEAT-02 | Bài 2 phút chọn sẵn theo tâm trạng | quá dài (M#1–M#9) | P0 | Đủ để thiết kế | 1.0.0 |
| FEAT-03 | Biểu đồ tâm trạng tuần | quên dùng (M#17–M#22) | P1 | Đủ để thiết kế | 1.0.0 |
| FEAT-04 | Onboarding + paywall dùng thử | giá bất ngờ (M#11) | P0 | Đủ để thiết kế | 1.0.0 |
| FEAT-05 | Nhắc hằng ngày | quên dùng (M#20) | P1 | Đủ để thiết kế | 1.0.0 |

### FEAT-02 · Bài 2 phút chọn sẵn theo tâm trạng
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P0
- Cho ai, giải gì: PER-01 · M#1–M#9
- Luồng chính: 1. chọn tâm trạng → 2. app đưa một bài thở hoặc một câu nhật ký → 3. làm 2 phút → 4. thấy chuỗi ngày.
- Khi không suôn sẻ: thoát giữa bài → lưu "chưa xong", không tính chuỗi; bài trả phí khi chưa mua → paywall, đóng thì đưa bài miễn phí.
- Yêu cầu: UC-002, FR-003, FR-004

## 11. Danh sách màn
| Mã | Màn | Thuộc tính năng | Ưu tiên | Phụ thuộc |
|---|---|---|---|---|
| SCR-01 | Check-in | FEAT-01 | P0 | widget |
| SCR-02 | Bài 2 phút | FEAT-02 | P0 | — |
| SCR-03 | Paywall | FEAT-04 | P0 | thanh toán |
| SCR-04 | Biểu đồ tuần | FEAT-03 | P1 | — |
| SCR-05 | Cài đặt (gói, khôi phục mua hàng) | FEAT-04 | P0 | thanh toán |

## 12. Onboarding
| Bước | Câu hỏi / nội dung | Để làm gì | Kiểu trả lời | Bỏ được không |
|---|---|---|---|---|
| 1 | Bạn hay căng thẳng lúc nào? | chọn giờ nhắc | chọn 1 | được |
| 2 | Bài 2 phút đầu tiên | đạt aha trước paywall | làm bài | không |
| 3 | Paywall dùng thử 3 ngày | KB5 | dùng thử / đóng | được |

# Phần C — Phiên bản

## 13. Lộ trình phiên bản
| Bản | Phải chứng minh | Tính năng | Chỉ số đo | Ngày chốt | Trạng thái |
|---|---|---|---|---|---|
| 1.0.0 | quay lại ≥ 3 ngày/tuần | FEAT-01…05 | người làm ≥ 3 bài/7 ngày, bắt đầu dùng thử | 21/11/2026 | đang thiết kế |
| 1.1.0 | nhắc đúng giờ tăng D30 | — | D30 | — | dự kiến |

## 14. Rủi ro, giả định, câu hỏi mở
| Loại | Nội dung | Nếu sai / nếu xảy ra thì sao | Cách kiểm / giảm | Ai, hạn |
|---|---|---|---|---|
| Giả định | persona dựng từ review, chưa phỏng vấn | sai người dùng chính | phỏng vấn 6 người | Lan, 10/12 |

## 15. Phụ lục

### Lần soát gần nhất
28/11/2026 — 5 cổng đạt ở mức Đủ để thiết kế.
