# PRD — Calm2 (app chăm sóc sức khỏe tinh thần)

> DỮ LIỆU THỬ — tài liệu mẫu để thử bộ skill; mọi số liệu là giả.

**Phiên bản tài liệu**: 1.2 · **Phiên bản app đang viết**: 1.0.0
**Cập nhật**: 08/11/2026 · **Người viết**: AI soạn, lead duyệt
**Trạng thái**: Bản 1.0.0 ở mức Đủ để thiết kế — sẵn sàng chuyển sang bộ design

## 0. Đọc nhanh
- Đang làm: app iOS cho người đi làm ở Mỹ hạ căng thẳng trong 2 phút; đang viết bản 1.0.0.
- Tình trạng: 6/6 tính năng ở mức Đủ để thiết kế, 0 ở mức Đủ để build. Ba tính năng đã sửa so với kick-off vì vướng quy định App Store (D-07 FEAT-05, D-08 FEAT-06, D-09 FEAT-03).
- Cần chốt: Minh trả lời 10 câu hỏi DQ-01…DQ-10 (requirements.md §8) — 4 câu cần trước khi thiết kế, hạn 15/11/2026.
- Bước tiếp: bộ design (`prd-to-ux-flow`) vẽ luồng, sitemap, wireframe; sau khi có UI thì chạy `product-detail`.

### Đọc theo vai trò
| Vai trò | Đọc mục nào | Xem hình ở đâu |
|---|---|---|
| Dev (Minh) | §1 nền tảng · §4 điều cấm · §8 bảng rẽ nhánh · §9 ràng buộc mobile · §10 luồng và nhánh không suôn sẻ từng tính năng · §11 sitemap và luồng tổng · §13 phạm vi kiểm lại · requirements.md: FR + tiêu chí [Dev kiểm], §4 công thức, §5 quyền và dữ liệu, §8 câu hỏi DQ | chưa có |
| Designer (Lan) | §5 người dùng và khoảnh khắc thấy app có ích · §4 điều cấm và danh sách không được cắt · §8 chỗ hiện paywall · §10 luồng và nhánh không suôn sẻ · §11 phân tích tác vụ, danh sách màn, sitemap, luồng tổng, bảng đi thử luồng · §12 onboarding · requirements.md: tiêu chí [Lead kiểm] | chưa có |

## 1. Thông tin dự án · [Dev]

### Người tham gia
| Vai trò | Tên | Trách nhiệm |
|---|---|---|
| Lead (kiêm PO, UX/UI, ASO, đọc số, test giao diện) | Lan | Chốt tính năng và phiên bản, thiết kế, kiểm dòng [Lead kiểm] |
| Dev iOS | Minh | Làm app, trả lời khả thi, kiểm dòng [Dev kiểm] |

### Nền tảng và nhịp ra bản
- Nền tảng: iOS, iPhone (D-05)
- Nhịp ra bản: 3 tuần một bản; bản vá ngoài chu kỳ chỉ khi crash / store từ chối / vi phạm chính sách (D-06)

### Lịch sử tài liệu
| Ngày | Phiên bản tài liệu | Đổi gì | Vì sao | Người |
|---|---|---|---|---|
| 16/11/2026 | 1.0 | Tạo PRD | market chốt làm tiếp | Lan |
| 21/11/2026 | 1.1 | Chốt bản 1.0.0 sau kick-off | D-04 | Lan |
| 08/11/2026 | 1.2 | Viết đủ để thiết kế: §5 thêm việc người dùng cần làm, §9, §10 sáu khối tính năng, §11, §12, §13 phạm vi kiểm lại, §14, §15 | product-spec | Lan |
| 08/11/2026 | 1.2 | Sửa FEAT-03, FEAT-05, FEAT-06 cho đúng quy định App Store | D-07, D-08, D-09 | Lan |

### Liên kết
| Nội dung | Link |
|---|---|
| Nghiên cứu thị trường | docs/market/market-report.md |
| Luồng, sitemap (kiến trúc thông tin) — Figma / FigJam | chưa có |
| Wireframe, UI — Figma | chưa có |
| Bảng, sơ đồ rẽ nhánh — Figma / FigJam | chưa có |
| Luồng màn của bộ design | chưa có |
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
- Đồng hành hằng ngày, không phải chữa bệnh.

## 3. Mục tiêu và nguyên tắc
| # | Ưu tiên … hơn … | Tính năng hợp lý mà nguyên tắc này loại bỏ |
|---|---|---|
| 1 | dùng hằng ngày trong 2 phút hơn độ sâu nội dung | thư viện 300 bài |
| 2 | giá nói trước hơn tối đa tỉ lệ dùng thử | paywall giấu giá sau trial |
| 3 | ít bước hơn nhiều tuỳ chỉnh | tuỳ chỉnh độ dài bài, chọn giọng đọc |

## 4. Phạm vi và điều cấm · [Dev] [Design]
**Bản đầu phải chứng minh:** người đi làm quay lại check-in ≥ 3 ngày/tuần mà không cần thư viện.

### Điều cấm
| Mã | Bị cấm | Vì sao | Ai được mở khoá |
|---|---|---|---|
| BAN-01 | tài khoản người dùng, backend riêng | bản đầu không cần, giảm việc Dev | lead, qua decisions.md |
| BAN-02 | thư viện bài để duyệt | đi ngược vấn đề 1 | lead, qua decisions.md |
| BAN-03 | lời lẽ chẩn đoán / chữa trị ("chữa", "điều trị", "giảm trầm cảm") trong app, store, quảng cáo | định vị đồng hành | lead, qua decisions.md |
| BAN-04 | đưa lịch sử tâm trạng ra khỏi máy (iCloud hoặc nơi khác) ở bản 1.0.0 | Apple 5.1.3 cấm để thông tin sức khoẻ cá nhân trên iCloud; và lời hứa dữ liệu nằm trên máy là thứ đang bán (M#27–M#29) · D-09 | lead, qua decisions.md, sau khi Dev trả lời DQ-06 |

### Không được cắt trong mọi trường hợp
| Hạng mục | Vì sao không được cắt | Cắt thì hỏng thế nào |
|---|---|---|
| giá hiện trước nút dùng thử | nguyên tắc 2 | review "bị trừ tiền bất ngờ" như app B (M#11) |
| khôi phục mua hàng | bắt buộc của store | bị từ chối khi nộp (Apple 3.1.1) |
| app dùng đủ khi người dùng từ chối thông báo | Apple 5.1.2 | bị từ chối khi nộp; D-07 |
| một dòng nói trước rằng dữ liệu nằm trên máy và đổi máy sẽ mất | lời hứa đang bán, và người dùng mất lịch sử mà không được báo là lý do bỏ app | review "mất hết dữ liệu"; D-09 |

## 5. Người dùng · [Design]
#### PER-01 · Mai, 27 tuổi, nhân viên văn phòng ở Mỹ · GIẢ ĐỊNH (proto)
- Bối cảnh: căng thẳng giữa hai cuộc họp, có 2–5 phút.
- Nỗi đau: "When I'm panicking I don't have 15 minutes" (M#1).
- Cần: hạ căng trong 2 phút mà không phải chọn.

### Việc người dùng cần làm
> GIẢ ĐỊNH — suy ra từ §2 và market §3, chưa hỏi người dùng thật. `product-users` xác nhận lại khi có dữ liệu (§14).

| Mã | Khi … tôi muốn … để … | Persona | Bằng chứng |
|---|---|---|---|
| JTBD-01 | Khi tôi căng thẳng giữa hai cuộc họp, tôi muốn hạ căng trong 2 phút mà không phải chọn gì, để quay lại làm việc được | PER-01 | M#1, M#2, M#5 |
| JTBD-02 | Khi đã dùng được vài ngày, tôi muốn thấy tuần này mình thế nào, để biết việc này có đáng giữ không | PER-01 | M#17–M#22 |

**Khoảnh khắc thấy app có ích:** hoàn thành bài 2 phút đầu tiên · đường ngắn nhất 3 bước từ lần mở đầu.

## 6. Cạnh tranh và khác biệt
Xem docs/market/market-report.md §4.

## 7. Chỉ số — bản nháp
> Bản nháp — sẽ chuyển sang bộ measure khi có.

| Tầng | Chỉ số | Công thức (tử / mẫu / cửa sổ) | Mốc tham chiếu | Mục tiêu bản này |
|---|---|---|---|---|
| Chỉ số chính | người làm ≥ 3 bài/7 ngày | người có ≥ 3 session_completed trong 7 ngày đầu / người cài | giả định | 25% |
| Đầu vào | đạt aha phiên đầu | người có session_completed trong phiên đầu / người mở lần đầu | giả định | 60% |
| Đầu vào | bắt đầu dùng thử | trial_started / người cài, 7 ngày | mốc team > 6% (M#50) | 6% |
| Rào chắn | huỷ dùng thử ngày 1 | trial_cancelled trong 24h / trial_started | KB5: < 30–35% | < 30% |

## 8. Kiếm tiền — bản nháp · [Dev] [Design]
> Bản nháp — sẽ chuyển sang bộ monetize khi có.

- Mô hình: thuê bao, dùng thử 3 ngày — người dùng dùng hằng ngày.
- Kịch bản onboarding + paywall: xương sống KB5 (Trial-first) — traffic chủ yếu từ tìm kiếm nhưng người dùng sợ bị trừ tiền (M#11). Paywall đặt **sau** bài 2 phút đầu tiên, không đặt trước khoảnh khắc thấy app có ích (nguyên tắc 2 ở §3).
- Không có ở bản này, và đó là quyết định chứ không phải bỏ sót: quảng cáo, gói trọn đời, gói hạ giá khi người dùng định rời paywall (D-12).

### Miễn phí và trả phí
| Phần | Miễn phí | Trả phí | Vì sao chia vậy |
|---|---|---|---|
| Check-in tâm trạng | không giới hạn | — | là việc người dùng chê các app khác bắt trả tiền (market §4.3) — không được khoá |
| Bài 2 phút | 3 bài thở cố định | toàn bộ bài theo tâm trạng | miễn phí đủ thành thói quen |
| Biểu đồ tâm trạng | 7 ngày gần nhất | toàn bộ lịch sử + xu hướng tháng | bán chiều sâu |

→ **Rút ra:** việc chính (check-in + bài 2 phút) luôn làm được miễn phí, không có lượt/ngày — thứ bán là chiều sâu nội dung và chiều dài lịch sử.

### Gói và giá
| Mã gói | Chu kỳ | Giá (theo nước) | Dùng thử | Neo đối thủ |
|---|---|---|---|---|
| PLN-W | tuần (7 ngày — đạt mức tối thiểu của Apple 3.1.2(a)) | 4,99 USD (Mỹ) | không | — |
| PLN-Y | năm | 39,99 USD (Mỹ) | 3 ngày | dưới A/B 59,99–69,99 USD (M#45) |

→ **Rút ra:** chỉ hai gói, một có dùng thử một không — paywall phải nói rõ gói nào có dùng thử để không bị hiểu là cả hai (Apple 3.1.2(c)).

### Paywall và quảng cáo hiện ở đâu
| Điểm chạm | Loại | Người dùng đã thấy giá trị chưa | Ghi chú |
|---|---|---|---|
| sau bài 2 phút đầu tiên (onboarding bước 6) | paywall | rồi (sau aha) | có nút đóng rõ; đóng rồi thì không hiện lại trong cùng phiên |
| chạm bài trả phí | paywall | rồi | không bao giờ cắt ngang bài đang chạy |
| chạm phần lịch sử dài hơn 7 ngày | paywall | rồi | dòng khoá nói rõ bị khoá cái gì trước khi chạm |

### Rẽ nhánh — ai thấy gì, khi nào
| # | Nếu (điều kiện) | Thì (app làm gì) | Ngược lại | Nguồn |
|---|---|---|---|---|
| 1 | chưa trả tiền và bài được chọn nằm ngoài 3 bài thở miễn phí | mở paywall trước khi bài chạy | mở thẳng màn bài | D-03, BR-05 |
| 2 | chưa trả tiền và người dùng chạm phần lịch sử quá 7 ngày | mở paywall | hiện toàn bộ lịch sử và xu hướng tháng | D-03, FR-008 |
| 3 | đã đóng paywall trong phiên này | không mở lại paywall trong phiên, chỉ còn lối vào từ Cài đặt | mở paywall theo bảng điểm chạm | FR-010 |
| 4 | đang dùng thử và còn ≤ 1 ngày | gửi một thông báo nhắc hết dùng thử — chỉ khi đã bật thông báo | không gửi; ngày hết dùng thử vẫn ghi trong Cài đặt | BR-07, FR-013 |
| 5 | đã mua hoặc đang dùng thử | paywall mở từ Cài đặt chỉ hiện trạng thái gói và lối huỷ | hiện lời mời mua | Apple 3.1.2(b), FR-013 |

Sơ đồ: chưa có

## 9. Ràng buộc mobile · [Dev]
| Nhóm | Mức mặc định của team | Dự án này |
|---|---|---|
| Nền tảng | iOS, iPhone; iOS tối thiểu … | iOS, iPhone, không iPad (D-05); iOS tối thiểu 17 — **giả định**, DQ-07 |
| Hiệu năng | mở app lạnh < 2,0 giây trên máy yếu nhất; màn vẽ < 1,0 giây khi đã có dữ liệu; crash-free ≥ 99,5% | như mặc định, máy yếu nhất là iPhone 11; thêm: chạm widget → màn bài chạy được ≤ 1,5 giây trên iPhone 11 (Dev đo 1,2 giây, 14/11/2026) |
| Mất mạng và đồng bộ | — | toàn bộ app chạy được khi mất mạng, trừ mua gói và khôi phục mua hàng (**giả định**, DQ-02); không đồng bộ, nên không có việc giải quyết xung đột dữ liệu (D-09) |
| Thông báo | xin quyền khi cần; nhắc tối đa 1 lần/ngày; khơi lại chỉ sau 3+ ngày không dùng | xin sau bài 2 phút đầu tiên, bỏ qua được, từ chối vẫn dùng đủ app (D-07); 1 lời nhắc/ngày lúc 15:00 giờ máy (**giả định** giờ mặc định, DQ-08); khơi lại tối đa 1 lần/3 ngày không mở app |
| Trợ năng | vùng chạm ≥ 44pt; cỡ chữ hệ thống; VoiceOver | như mặc định; thêm: nhịp thở không được chỉ báo bằng chuyển động — phải có chữ đếm nhịp cho người tắt hiệu ứng chuyển động (NFR-08) |
| Riêng tư | dữ liệu tối thiểu; xoá tài khoản trong app nếu có tài khoản | không có tài khoản (BAN-01) nên không cần xoá tài khoản; thay bằng "Xoá toàn bộ dữ liệu" trong Cài đặt (SCR-22); link Chính sách riêng tư trong app và trên paywall (Apple 5.1.1(i)); onboarding không hỏi tên, tuổi, mục tiêu (Apple 5.1.1(iii)) |
| Sẵn sàng phát hành | khôi phục mua hàng; thử mất mạng; thử từ chối quyền | cả ba bắt buộc; thêm: thử từ chối vĩnh viễn thông báo, thử mua đang chờ duyệt (Ask to Buy), thử cỡ chữ hệ thống lớn nhất, thử chế độ tối |

# Phần B — Tính năng

## 10. Bảng tính năng · [Dev] [Design]
| Mã | Tính năng | Giải gì (bằng chứng) | Ưu tiên | Mức | Bản |
|---|---|---|---|---|---|
| FEAT-01 | Check-in 1 chạm từ widget | quá nhiều lựa chọn (M#1, M#2) | P0 | Đủ để thiết kế | 1.0.0 |
| FEAT-02 | Bài 2 phút chọn sẵn theo tâm trạng | quá dài (M#1–M#9) | P0 | Đủ để thiết kế | 1.0.0 |
| FEAT-03 | Biểu đồ tâm trạng tuần, dữ liệu chỉ nằm trên máy (D-09) | quên dùng (M#17–M#22) | P1 | Đủ để thiết kế | 1.0.0 |
| FEAT-04 | Onboarding + paywall dùng thử | giá bất ngờ (M#11) | P0 | Đủ để thiết kế | 1.0.0 |
| FEAT-05 | Nhắc hằng ngày — xin quyền sau bài đầu tiên, bỏ qua được, từ chối vẫn dùng đủ app (D-07) | quên dùng (M#20) | P1 | Đủ để thiết kế | 1.0.0 |
| FEAT-06 | Mời đánh giá bằng API đánh giá của Apple sau bài thứ 3, không hỏi sao trước (D-08) | kéo điểm store lên | P1 | Đủ để thiết kế | 1.0.0 |

→ **Rút ra:** 4 tính năng phục vụ câu "phải chứng minh" (quay lại ≥ 3 ngày/tuần): FEAT-01 và FEAT-02 làm việc chính dễ tới, FEAT-03 và FEAT-05 kéo người dùng quay lại. FEAT-04 là đường tiền, FEAT-06 là đường tăng trưởng — cả hai không được làm hỏng hai nhóm trên.

### FEAT-01 · Check-in 1 chạm từ widget
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P0
- Cho ai, giải gì: PER-01 · JTBD-01 · M#1, M#2 — bỏ cả bước mở app lẫn bước chọn bài.
- Người dùng làm gì: đặt một widget 4 ô tâm trạng lên màn hình chính hoặc màn khoá. Lúc căng thẳng, chạm đúng một ô. App mở thẳng vào bài đã chọn sẵn, không đi qua màn trung gian nào.
- Luồng chính: 1. Người dùng chạm một ô tâm trạng trên widget → 2. ◇ Đã qua onboarding chưa? → Chưa: mở SCR-02 và giữ lại tâm trạng vừa chạm để dùng ở bước onboarding chọn tâm trạng / Rồi: bước 3 → 3. App mở SCR-04 với bài đã chọn theo BR-01, trong ≤ 1,5 giây trên iPhone 11 → 4. Lần chạm được ghi là một check-in (DATA-01) ngay cả khi người dùng không làm hết bài → 5. Kết thúc ở SCR-05 khi bài chạy xong.
- Khi không suôn sẻ: chưa đặt widget → SCR-13 hướng dẫn đặt, hiện một lần ở SCR-05 sau bài đầu tiên, bỏ qua được · chạm nhiều ô trong vòng 60 giây → lấy lần chạm cuối, các lần trước không tính là check-in (BR-02) · app bị hệ thống dừng → mở lạnh rồi vẫn vào đúng SCR-04 với tâm trạng vừa chạm · mất mạng → không ảnh hưởng, bài nằm trong app (**giả định**, DQ-02) · hết lượt miễn phí → không áp dụng, check-in không giới hạn (§8) · quyền hệ thống → không áp dụng, widget không cần quyền nào.
- Hình: chưa có
- Quyền và dữ liệu: không cần quyền hệ thống · DATA-01, DATA-02 · Paywall / quảng cáo chạm ở: không có ở tính năng này.
- Yêu cầu: UC-001, FR-001, FR-002 trong requirements.md
- Câu hỏi cho Dev: DQ-01, DQ-02 · Trả lời của Dev: widget → màn check-in 1,2 giây trên iPhone 11 — KHẢ THI (Dev, 14/11/2026); DQ-01 và DQ-02 CHƯA TRẢ LỜI.
- Cổng 0: không quyền, không dữ liệu cá nhân mới, không nội dung của bên thứ ba → không có mục nào của `policy-and-safety.md` áp vào.

### FEAT-02 · Bài 2 phút chọn sẵn theo tâm trạng
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P0
- Cho ai, giải gì: PER-01 · JTBD-01 · M#1–M#9 — đây là điểm khác biệt chính, mới 1/5 app có (market §4.3).
- Người dùng làm gì: chọn một trong 4 tâm trạng rồi nhận đúng một bài, không có danh sách để chọn (BAN-02). Bài chạy 2 phút bằng hình thở và tiếng dẫn, không rung — Dev đo rung theo nhịp bị hệ thống cắt sau khoảng 30 giây (Dev, 14/11/2026).
- Luồng chính: 1. Người dùng chọn tâm trạng ở widget (FEAT-01) hoặc ở SCR-06 → 2. App chọn đúng một bài theo BR-01 → 3. ◇ Bài này có bị khoá không? → Có: SCR-08 paywall, nút đóng đưa về bài thở miễn phí gần nhất / Không: bước 4 → 4. Người dùng bấm "Bắt đầu"; bài chạy 120 giây → 5. Hết bài → SCR-05: ghi nhận hoàn thành, chuỗi ngày +1 (BR-03) → 6. Từ SCR-05 đi tiếp theo FEAT-05 (lần đầu), FEAT-04 (paywall) hoặc FEAT-06 (bài thứ 3), ngược lại về SCR-06.
- Rẽ nhánh:
  | # | Nếu | Thì | Ngược lại | Nguồn |
  |---|---|---|---|---|
  | 1 | chưa trả tiền và bài được chọn nằm ngoài 3 bài thở miễn phí | mở SCR-08 trước khi bài chạy | mở thẳng SCR-04 | D-03, BR-05 |
  | 2 | tâm trạng vừa chọn là mức xấu nhất trong 4 mức | SCR-05 hiện thêm một dòng tĩnh dẫn sang SCR-19 tài nguyên hỗ trợ; không tự mở, không chặn | SCR-05 bình thường | D-11 |
- Khi không suôn sẻ: thoát giữa bài → SCR-20 "Dừng bài?" với hai lựa chọn Tiếp tục / Dừng; dừng thì về SCR-06, check-in vẫn giữ nhưng không tính là hoàn thành (BR-03) · có cuộc gọi đến hoặc app bị đẩy xuống nền → bài tạm dừng, mở lại thì SCR-21 hỏi "Tiếp tục từ giây thứ n?" (DQ-03) · máy đang im lặng hoặc âm lượng 0 → bài vẫn chạy bằng hình, hiện một dòng "Bài này có tiếng dẫn — bật âm lượng để nghe", không chặn · rút tai nghe → tạm dừng như trên · mất mạng → không áp dụng (DQ-02) · lần đầu chưa có dữ liệu → không áp dụng, bài không cần lịch sử · bài trả phí → paywall ở bước 3, không bao giờ cắt ngang bài đang chạy.
- Hình: chưa có
- Quyền và dữ liệu: không cần quyền hệ thống · DATA-01, DATA-02, DATA-03 · Paywall / quảng cáo chạm ở: bước 3; không có quảng cáo (D-12).
- Yêu cầu: UC-002, FR-003, FR-004, FR-005, FR-006 trong requirements.md
- Câu hỏi cho Dev: DQ-02, DQ-03, DQ-04 · Trả lời của Dev: rung theo nhịp khi màn tắt — KHÓ, bỏ, dùng hình + tiếng (Dev, 14/11/2026); ba câu còn lại CHƯA TRẢ LỜI.
- Cổng 0: BAN-03 — chữ trong bài và ở SCR-05 không được nói "chữa", "điều trị", "giảm trầm cảm" (Apple 1.4.1). Tiếng dẫn và nhạc nền phải có giấy phép ghi lại trước khi nộp (Apple 5.2) → DQ-04, mở trong §14.

### FEAT-03 · Biểu đồ tâm trạng tuần, dữ liệu chỉ nằm trên máy
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P1
- Cho ai, giải gì: PER-01 · JTBD-02 · M#17–M#22 — cho người dùng thứ họ bỏ vào app, để có lý do quay lại.
- Người dùng làm gì: mở biểu đồ từ màn chính, xem 7 ngày gần nhất và chuỗi ngày. Dữ liệu chỉ nằm trên máy; đổi máy hoặc cài lại thì không mang theo, và app nói điều đó trước ở onboarding bước 1 chứ không để người dùng tự phát hiện (D-09).
- Luồng chính: 1. SCR-06 → chạm "Tuần này" → SCR-07 → 2. ◇ Đã có check-in nào chưa? → Chưa: SCR-14 trạng thái trống với nút "Check-in bây giờ" dẫn về SCR-06 / Rồi: bước 3 → 3. Biểu đồ 7 ngày gần nhất; ngày không có check-in để trống, không nội suy, không coi là điểm 0 → 4. ◇ Người dùng đã trả tiền chưa? → Rồi: hiện thêm toàn bộ lịch sử và xu hướng tháng / Chưa: phần đó khoá, có một dòng nói rõ đang khoá cái gì, chạm vào → SCR-08.
- Khi không suôn sẻ: mới có 1–2 ngày dữ liệu → vẫn vẽ, ghi "cần thêm n ngày để thấy xu hướng", không ẩn biểu đồ · đổi máy hoặc cài lại → dữ liệu không theo sang, đã báo trước ở onboarding bước 1 và ở Cài đặt (D-09) · người dùng xoá dữ liệu trong Cài đặt → SCR-22 xác nhận, xong thì về SCR-14 · đổi múi giờ → ngày của một check-in tính theo giờ máy lúc check-in, không tính lại (BR-04) · mất mạng → không áp dụng · từ chối quyền → không áp dụng, tính năng không dùng quyền nào.
- Hình: chưa có
- Quyền và dữ liệu: không cần quyền hệ thống · DATA-01, DATA-03 · Paywall / quảng cáo chạm ở: bước 4.
- Yêu cầu: UC-003, UC-009, FR-007, FR-008, FR-019, FR-020 trong requirements.md
- Câu hỏi cho Dev: DQ-02, DQ-06 · Trả lời của Dev: CHƯA TRẢ LỜI.
- Cổng 0: Apple 5.1.3 cấm để thông tin sức khoẻ cá nhân trên iCloud. Bản này để dữ liệu trên máy (D-09, BAN-04); Dev phải phân loại dữ liệu tâm trạng (DQ-06) trước khi R-02 được mở lại. Apple 5.1.1(i): link Chính sách riêng tư trong app.

### FEAT-04 · Onboarding + paywall dùng thử
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P0
- Cho ai, giải gì: PER-01 · JTBD-01 · M#11 — người dùng chê app B trừ tiền bất ngờ, nên giá phải hiện trước nút dùng thử (§4 "không được cắt").
- Người dùng làm gì: mở app lần đầu, đi 6 bước tới bài 2 phút đầu tiên rồi mới thấy lời mời trả tiền. Trên paywall người dùng đọc được giá, chu kỳ, ngày hết dùng thử và cách huỷ trước khi bấm bất cứ nút nào.
- Luồng chính: 1. SCR-02 chào, lời hứa dữ liệu nằm trên máy, dòng miễn trừ (D-09, D-10) → 2. SCR-03 chọn tâm trạng lần đầu; không hỏi tên, tuổi, mục tiêu (BAN-01, Apple 5.1.1(iii)) → 3. SCR-04 bài 2 phút chạy ngay (FEAT-02) → 4. SCR-05 xong bài ⭐ khoảnh khắc thấy app có ích, đúng 3 bước (§5) → 5. SCR-10 mời bật nhắc, bỏ qua được (FEAT-05) → 6. SCR-08 paywall → 7. ◇ Người dùng chọn gì? → "Bắt đầu dùng thử 3 ngày" (PLN-Y): mở hộp thanh toán của hệ thống SCR-25 / "Mua gói tuần" (PLN-W, không dùng thử): mở SCR-25 / "Đóng": về SCR-06 dùng bản miễn phí → 8. ◇ Hộp thanh toán trả về gì? → Thành công: mở khoá ngay, về SCR-06, Cài đặt hiện trạng thái gói (SCR-18) / Thất bại: giữ SCR-08, hiện lý do và nút "Thử lại" / Đang chờ duyệt (Ask to Buy): SCR-16, app dùng bản miễn phí, tự mở khoá khi được duyệt / Người dùng tự huỷ hộp thanh toán: về SCR-08 nguyên trạng, không hiện lại paywall trong phiên này.
- Rẽ nhánh: xem bảng "Rẽ nhánh — ai thấy gì, khi nào" ở §8 (5 dòng, mỗi dòng đủ hai chiều).
- Khi không suôn sẻ: mất mạng khi mở paywall → không hiện giá cũ hay giá bịa, hiện SCR-15 "chưa lấy được giá · Thử lại", nút đóng vẫn dùng được · khôi phục mua hàng không tìm thấy gì → SCR-17 "không thấy gói nào trên Apple ID này", không coi là lỗi, không đổ cho người dùng · đã mua rồi mà mở lại paywall → chỉ hiện trạng thái gói và lối huỷ, không mời mua lại (Apple 3.1.2(b)) · dùng thử sắp hết → nhắc trước 1 ngày, chỉ khi đã bật thông báo; không bật thì ngày hết dùng thử vẫn ghi ở SCR-18 (BR-07) · từ chối quyền → không áp dụng, mua gói không cần quyền nào · lần đầu chưa có dữ liệu → không áp dụng.
- Hình: chưa có
- Quyền và dữ liệu: không cần quyền hệ thống · DATA-04 · Paywall / quảng cáo chạm ở: bước 6; không có quảng cáo (D-12).
- Yêu cầu: UC-004, UC-005, UC-006, FR-009, FR-010, FR-011, FR-012, FR-013, FR-021 trong requirements.md
- Câu hỏi cho Dev: DQ-05, DQ-09 · Trả lời của Dev: CHƯA TRẢ LỜI.
- Cổng 0: Apple 3.1.1 phải có khôi phục mua hàng · 3.1.2(a) chu kỳ ngắn nhất 7 ngày — PLN-W là 7 ngày, đạt · 3.1.2(c) nói rõ được gì trước khi mời mua · 5.6 không gài mua · 5.1.1(i) link Chính sách riêng tư và Điều khoản trên paywall · checklist paywall ở `policy-and-safety.md` §4 áp đủ vào FR-010.

### FEAT-05 · Nhắc hằng ngày
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P1
- Cho ai, giải gì: PER-01 · JTBD-02 · M#20 — người dùng quên dùng sau tuần đầu.
- Người dùng làm gì: sau bài đầu tiên, app giải thích sẽ nhắc gì rồi mới xin quyền. Bỏ qua được, và từ chối rồi thì app vẫn dùng được đủ mọi tính năng — đây là chỗ sửa so với kick-off (D-07).
- Luồng chính: 1. Sau bài hoàn thành đầu tiên → SCR-10 nói app sẽ nhắc gì, mấy lần một ngày, đổi được ở đâu; hai nút "Bật nhắc" và "Để sau" ngang nhau → 2. ◇ Người dùng chọn gì? → "Để sau": đóng, đi tiếp bước paywall; không hỏi lại trong 7 ngày và tối đa 2 lần trong đời app / "Bật nhắc": mở hộp quyền của hệ thống → 3. ◇ Hệ thống trả về gì? → Đồng ý: đặt lời nhắc 1 lần/ngày lúc 15:00 giờ máy, đổi được ở Cài đặt / Từ chối: đóng, đi tiếp, không hỏi lại / Từ chối vĩnh viễn: Cài đặt hiện SCR-12 "Thông báo đang tắt" kèm nút mở Cài đặt máy; app không hỏi lại lần nào nữa → 4. Mỗi ngày đúng giờ đặt, nếu hôm đó chưa check-in → một thông báo "2 phút thôi" → chạm → SCR-04.
- Giữ chân: kiểu nhắc = **mồi** (động lực thấp, việc dễ — chỉ cần một chạm) · vòng: nhắc "2 phút thôi" → check-in 1 chạm → chuỗi ngày +1 và biểu đồ tuần dày thêm → lịch sử tâm trạng là thứ người dùng bỏ vào và không muốn bỏ đi. Không dùng lời trách ("bạn đã bỏ lỡ"), không đếm ngược chuỗi sắp mất, không thông báo giả làm tin nhắn (nguyên tắc 1, BAN-03).
- Khi không suôn sẻ: từ chối quyền → không khoá tính năng nào; thay bằng nhắc nhẹ trong app: dòng chuỗi ngày ở SCR-06 khi mở app · từ chối vĩnh viễn → SCR-12, app chỉ chỉ đường tới Cài đặt máy, không hỏi lại · đã check-in hôm đó → không gửi thông báo · không mở app 3 ngày → một thông báo khơi lại, tối đa 1 lần/3 ngày · tắt thông báo trong Cài đặt app → dừng gửi, giữ nguyên dữ liệu · mất mạng → không áp dụng, lời nhắc đặt sẵn trên máy (DQ-10) · hết lượt miễn phí → không áp dụng.
- Hình: chưa có
- Quyền và dữ liệu: PRM-01 quyền thông báo (đủ 3 nhánh: đồng ý / từ chối / từ chối vĩnh viễn) · DATA-05 · Paywall / quảng cáo chạm ở: không có ở tính năng này.
- Yêu cầu: UC-007, FR-014, FR-015, FR-016 trong requirements.md
- Câu hỏi cho Dev: DQ-08, DQ-10 · Trả lời của Dev: CHƯA TRẢ LỜI.
- Cổng 0: Apple 5.1.2 — app không được đòi bật thông báo mới dùng được một tính năng; 5.1.1(iv) — phải có đường thay thế khi từ chối. Cách viết ở D-04 vi phạm cả hai; D-07 sửa. FR-016 (app dùng đủ khi từ chối) là P0 dù FEAT-05 là P1, vì nó là đường cứu của một luật bắt buộc.

### FEAT-06 · Mời đánh giá bằng API đánh giá của Apple
- Mức: Đủ để thiết kế · Bản: 1.0.0 · Ưu tiên: P1
- Cho ai, giải gì: PER-01 · điểm store thấp làm giảm lượt cài từ tìm kiếm — đường vào duy nhất của bản này (market §6).
- Người dùng làm gì: sau bài hoàn thành thứ 3, app gọi API đánh giá của Apple ngay ở màn xong bài. Hệ thống tự quyết định có hiện hộp hay không và tự giới hạn số lần. App không hỏi trước, không lọc theo điểm dự kiến, không tự dẫn ai sang trang App Store — đây là chỗ sửa so với kick-off (D-08).
- Luồng chính: 1. SCR-05 hiện sau một bài hoàn thành → 2. ◇ Đây là bài hoàn thành thứ 3 trở lên và chưa gọi API trong 120 ngày? → Có: gọi API đánh giá của Apple (BR-06) / Không: không làm gì → 3. Hệ thống quyết định hiện hộp hay không; app không biết kết quả và không được đổi màn theo kết quả → 4. Người dùng muốn góp ý bất cứ lúc nào: Cài đặt → "Gửi góp ý" → SCR-11, luôn có, không gắn với bước 2.
- Khi không suôn sẻ: hệ thống không hiện hộp → app không làm gì và không gọi lại trong phiên · người dùng đang trong bài → không gọi, chờ tới SCR-05 · máy không có ứng dụng thư để gửi góp ý → SCR-11 hiện địa chỉ thư kèm nút sao chép · mất mạng → hộp đánh giá là việc của hệ thống; "Gửi góp ý" soạn thư để gửi sau · từ chối quyền → không áp dụng, không dùng quyền nào · hết lượt miễn phí → không áp dụng.
- Hình: chưa có
- Quyền và dữ liệu: không cần quyền hệ thống · DATA-05 (số bài đã hoàn thành, lần gọi API gần nhất) · Paywall / quảng cáo chạm ở: không có ở tính năng này.
- Yêu cầu: UC-008, FR-017, FR-018 trong requirements.md
- Câu hỏi cho Dev: không có.
- Cổng 0: Apple 5.6.1 — chỉ được xin đánh giá bằng API của Apple, cấm hộp tự thiết kế; lọc người dùng theo số sao rồi mới dẫn sang App Store là đúng điều bị cấm. Cách viết ở D-04 vi phạm; D-08 sửa. Việc đo không được dựa vào "người dùng chọn mấy sao" vì app không biết (§7, requirements §6).

## 11. Danh sách màn, sitemap và luồng · [Dev] [Design]
> Cách làm: phân tích tác vụ theo lối phân rã mục đích → nhiệm vụ → hành động (HTA), chọn kiểu điều hướng theo số việc làm hằng ngày, rồi đi thử luồng bằng lối đi thử của người mới (cognitive walkthrough) — xem bảng cuối mục.

| Mã | Màn | Thuộc tính năng | Ưu tiên | Phụ thuộc | Loại | Hình (link frame) |
|---|---|---|---|---|---|---|
| SCR-01 | Widget check-in (màn hình chính / màn khoá) | FEAT-01 | P0 | — | lõi | chưa có |
| SCR-02 | Onboarding — chào, lời hứa dữ liệu, dòng miễn trừ | FEAT-04 | P0 | D-09, D-10 | lõi | chưa có |
| SCR-03 | Onboarding — chọn tâm trạng lần đầu | FEAT-04 | P0 | — | lõi | chưa có |
| SCR-04 | Bài 2 phút đang chạy | FEAT-02 | P0 | giấy phép tiếng dẫn (DQ-04) | lõi | chưa có |
| SCR-05 | Xong bài — chuỗi ngày, tâm trạng đã ghi | FEAT-02 | P0 | — | lõi | chưa có |
| SCR-06 | Màn chính — check-in trong app | FEAT-01, FEAT-02 | P0 | — | lõi | chưa có |
| SCR-07 | Biểu đồ tâm trạng tuần | FEAT-03 | P1 | trạng thái gói | lõi | chưa có |
| SCR-08 | Paywall | FEAT-04 | P0 | thanh toán | lõi | chưa có |
| SCR-09 | Cài đặt | FEAT-03, 04, 05, 06 | P0 | — | lõi | chưa có |
| SCR-10 | Giải thích trước khi xin quyền thông báo | FEAT-05 | P1 | PRM-01 | nhánh | chưa có |
| SCR-11 | Gửi góp ý (soạn thư) | FEAT-06 | P1 | ứng dụng thư của máy | nhánh | chưa có |
| SCR-12 | Thông báo đang tắt — chỉ đường sang Cài đặt máy | FEAT-05 | P1 | PRM-01 từ chối vĩnh viễn | trạng thái | chưa có |
| SCR-13 | Hướng dẫn đặt widget | FEAT-01 | P1 | — | nhánh | chưa có |
| SCR-14 | Biểu đồ — chưa có dữ liệu (lần đầu) | FEAT-03 | P1 | — | trạng thái | chưa có |
| SCR-15 | Paywall — chưa lấy được giá (mất mạng) | FEAT-04 | P0 | mạng | trạng thái | chưa có |
| SCR-16 | Mua đang chờ duyệt (Ask to Buy) | FEAT-04 | P0 | thanh toán | trạng thái | chưa có |
| SCR-17 | Khôi phục mua hàng — kết quả | FEAT-04 | P0 | thanh toán | trạng thái | chưa có |
| SCR-18 | Trạng thái gói trong Cài đặt — gói, ngày hết dùng thử, lối huỷ | FEAT-04 | P0 | thanh toán | trạng thái | chưa có |
| SCR-19 | Tài nguyên hỗ trợ (D-11) | FEAT-02 | P1 | — | nhánh | chưa có |
| SCR-20 | "Dừng bài?" | FEAT-02 | P0 | — | lớp phủ | chưa có |
| SCR-21 | "Tiếp tục từ giây thứ n?" | FEAT-02 | P0 | DQ-03 | lớp phủ | chưa có |
| SCR-22 | "Xoá toàn bộ dữ liệu?" — xác nhận | FEAT-03 | P1 | — | lớp phủ | chưa có |
| SCR-23 | Báo ngắn "đã khôi phục gói" | FEAT-04 | P0 | thanh toán | lớp phủ | chưa có |
| SCR-24 | Hộp đánh giá của hệ thống | FEAT-06 | P1 | API đánh giá của Apple | lớp phủ — hệ thống vẽ | — |
| SCR-25 | Hộp thanh toán của hệ thống | FEAT-04 | P0 | thanh toán | lớp phủ — hệ thống vẽ | — |

**Đếm màn:** 9 lõi + 4 nhánh + 6 trạng thái = 19 màn vẽ đủ; 4 lớp phủ app tự vẽ (SCR-20…23) tính 0,5 = 2; 2 lớp phủ do hệ thống vẽ (SCR-24, SCR-25) tính 0 → **khoảng 21 màn cần thiết kế** cho bản 1.0.0.

→ **Rút ra:** 6 trong 21 màn là màn trạng thái của việc mua và việc xin quyền, không phải màn tính năng. Nếu đến sát hạn phải cắt, cắt ở SCR-13 và SCR-19 (nhánh, P1), không cắt ở nhóm trạng thái — đó là nhóm bị store kiểm.

## 12. Onboarding · [Design]
Xương sống KB5 (Trial-first) theo D-03, nhưng paywall đặt sau khoảnh khắc thấy app có ích chứ không trước (§8, nguyên tắc 2). Sáu bước, trong đó ba bước đầu chính là việc chính của app — người dùng không học cách dùng, người dùng dùng luôn.

| Bước | Câu hỏi / nội dung | Để làm gì | Kiểu trả lời | Bỏ được không |
|---|---|---|---|---|
| 1 · SCR-02 | "Chạm một cái, 2 phút, xong." + "Lịch sử tâm trạng nằm trên máy bạn; đổi máy sẽ không mang theo" (D-09) + "Đồng hành hằng ngày, không thay thế chăm sóc chuyên môn" (D-10) | đặt đúng kỳ vọng và giữ lời hứa dữ liệu đang bán (M#27–M#29) | một nút "Bắt đầu" | không — một màn, một nút, không có gì để bỏ |
| 2 · SCR-03 | "Bây giờ bạn thấy thế nào?" — 4 ô tâm trạng | vừa là bước cá nhân hoá, vừa là bước đầu của việc chính | chạm 1 trong 4 | không — đây là việc chính, không phải câu hỏi phụ |
| 3 · SCR-04 | bài 2 phút chạy ngay | tới khoảnh khắc thấy app có ích ở bước 3 (§5) | bấm "Bắt đầu"; dừng được bất cứ lúc nào | dừng được, không bỏ qua được |
| 4 · SCR-05 | xong bài, chuỗi ngày = 1 | thưởng, và đưa cho người dùng thứ đầu tiên họ bỏ vào app | xem | — |
| 5 · SCR-10 | "Nhắc bạn mỗi ngày một lần lúc 15:00?" | giữ chân (M#17–M#22) | "Bật nhắc" / "Để sau" | **bỏ được** (D-07) — từ chối vẫn dùng đủ app |
| 6 · SCR-08 | paywall: được gì, giá, dùng thử 3 ngày, ngày hết dùng thử, cách huỷ | bán sau khi người dùng đã thấy giá trị | chọn gói / đóng | **bỏ được**, nút đóng rõ, không hiện lại trong phiên |

Cá nhân hoá: tâm trạng ở bước 2 quyết định bài ở bước 3 (BR-01) và là cột đầu tiên của biểu đồ tuần. Không hỏi tên, tuổi, mục tiêu, nghề nghiệp — không bước nào thu dữ liệu mà app không dùng tới (Apple 5.1.1(iii)).

Chỗ dễ rơi, theo hành vi: bước 3 (người dùng thoát giữa bài — đo bằng `session_started` không có `session_completed` kèm theo) và chỗ nối bước 5 → 6 (hai lời mời liên tiếp — xem bảng đi thử luồng ở §11).

Không có paywall nào đặt trước khoảnh khắc thấy app có ích, nên không cần lý do riêng cho việc đó.

Hình: chưa có

# Phần C — Phiên bản

## 13. Lộ trình phiên bản · [Dev]
| Bản | Phải chứng minh | Tính năng | Chỉ số đo | Ngày chốt | Trạng thái | Phạm vi kiểm lại |
|---|---|---|---|---|---|---|
| 1.0.0 | quay lại ≥ 3 ngày/tuần | FEAT-01…06 | người làm ≥ 3 bài/7 ngày, bắt đầu dùng thử | 21/11/2026 | đã chốt · mức Đủ để thiết kế | toàn bộ app (bản đầu) |
| 1.1.0 | nhắc đúng giờ tăng D30 | R-01, R-02 (chờ xét) | D30 | — | dự kiến | — |

**Phạm vi kiểm lại của bản 1.0.0** (bản đầu — kiểm toàn bộ; bảng này nêu những chỗ dễ trượt nhất):
| Thay đổi | Màn / chức năng phải kiểm lại | Lead kiểm (giao diện) | Dev kiểm (logic, dữ liệu, thanh toán) |
|---|---|---|---|
| D-07 bỏ ép bật thông báo | SCR-10, SCR-12, toàn bộ app sau khi từ chối quyền | chữ trên SCR-10, hai nút ngang nhau, SCR-12 chỉ đúng đường | từ chối và từ chối vĩnh viễn đều không khoá tính năng nào; không hỏi lại quá 2 lần |
| D-08 đổi cách mời đánh giá | SCR-05, SCR-24, SCR-11 | không còn hộp sao tự vẽ ở bất kỳ màn nào, kể cả lớp ẩn trong Figma | gọi đúng API của Apple, đúng thời điểm BR-06, không rẽ nhánh theo kết quả |
| D-09 bỏ đồng bộ iCloud | SCR-02, SCR-07, SCR-09, SCR-22 | dòng báo trước ở onboarding bước 1 và trong Cài đặt | không có dữ liệu tâm trạng nào rời khỏi máy; xoá dữ liệu xoá hết |
| Paywall và dùng thử | SCR-08, SCR-15, SCR-16, SCR-17, SCR-18, SCR-23 | đủ 8 thứ của checklist paywall; nút không nằm đúng chỗ nút "Tiếp tục" của màn trước | 8 trạng thái giao dịch, khôi phục mua hàng, ngày hết dùng thử (BR-07) |
| Bài 2 phút | SCR-04, SCR-05, SCR-20, SCR-21 | cỡ chữ lớn nhất, chế độ tối, chữ đếm nhịp khi tắt hiệu ứng chuyển động | tạm dừng / tiếp tục, app bị dừng rồi mở lại, chuỗi ngày (BR-03) |

## 14. Rủi ro, giả định, câu hỏi mở
| Loại | Nội dung | Nếu sai / nếu xảy ra thì sao | Cách kiểm / giảm | Ai, hạn |
|---|---|---|---|---|
| Giả định | persona dựng từ review, chưa hỏi người dùng thật | sai người dùng chính | hỏi 1–2 người bằng 5–7 câu, xem số sau ra mắt | Lan, 10/12 |
| Giả định | JTBD-01 và JTBD-02 suy từ §2 và market §3, chưa hỏi người dùng thật | phân tích tác vụ ở §11 lệch theo, có thể thừa FEAT-03 | chạy `product-users` khi có dữ liệu phỏng vấn | Lan, 10/12 |
| Giả định | toàn bộ bài nằm trong app, chạy được khi mất mạng | nếu phải tải bài thì mọi nhánh "mất mạng → không áp dụng" ở FEAT-01, 02, 03 phải viết lại | DQ-02 | Minh, 15/11 |
| Giả định | iOS tối thiểu 17 | đổi mốc máy yếu nhất và ngưỡng hiệu năng ở §9 | DQ-07 | Minh, 15/11 |
| Giả định | dữ liệu tâm trạng là thông tin sức khoẻ cá nhân theo Apple 5.1.3 | nếu Dev xác nhận không phải, mở lại R-02 và FEAT-03 quay về mức Đề xuất để viết lại | DQ-06 | Minh, 15/11 |
| Giả định | giờ nhắc mặc định 15:00 giờ máy | tỉ lệ bật nhắc và tỉ lệ chạm thông báo thấp hơn dự tính | DQ-08; xem số sau ra mắt rồi đổi bằng bản cập nhật | Lan, sau ra mắt |
| Rủi ro | tiếng dẫn và nhạc nền chưa có giấy phép ghi lại | bị từ chối khi nộp (Apple 5.2) | DQ-04; chốt nguồn tiếng trước khi thiết kế xong SCR-04 | Lan, 15/11 |
| Rủi ro | hai lời mời liên tiếp ở onboarding bước 5 → 6 | rơi người dùng ngay trước paywall | quy tắc chữ ở §11 bảng đi thử luồng; đo `onboarding_step_completed` từng bước | Lan, sau ra mắt |
| Rủi ro | ba điểm của D-04 vướng quy định App Store đã sửa, nhưng kick-off là quyết định của cả Lan và Minh | Minh chưa biết FEAT-03, 05, 06 đã đổi → ước công sai | gửi D-07, D-08, D-09 cho Minh cùng danh sách DQ | Lan, 10/11 |
| Câu hỏi mở | tài nguyên hỗ trợ (D-11) có làm người dùng thấy nặng nề không | bỏ hoặc chuyển hẳn vào Cài đặt | xem phản hồi sau ra mắt | Lan, sau ra mắt |

## 15. Phụ lục

### Bằng chứng mới của bộ product
| Mã | Nhận định | Nguồn | Ngày | Độ tin |
|---|---|---|---|---|
| P#1 | Ba hạng mục chốt ở kick-off (FEAT-03 đồng bộ iCloud, FEAT-05 ép bật thông báo, FEAT-06 hộp đánh giá lọc theo sao) vi phạm Apple 5.1.3, 5.1.2 và 5.6.1 — mỗi cái đủ để bị từ chối khi nộp | `product-standards/references/policy-and-safety.md` §1–3, đọc 07/11/2026 | 08/11/2026 | cao |

### Phương pháp đã dùng
| Phương pháp | Dùng ở mục | Để giải việc gì | Ra kết quả gì | Nguồn |
|---|---|---|---|---|
| Cổng 0 — đối chiếu từng tính năng với quy định store | §10 dòng "Cổng 0" từng khối, §4 | tìm chỗ bản đã chốt vi phạm quy định trước khi thiết kế | 3 chỗ phải sửa → D-07, D-08, D-09; P#1 | `product-standards/references/policy-and-safety.md` |
| Phân tích tác vụ phân rã (HTA) | §11 | nối mục đích người dùng xuống tới từng màn, tìm mục đích không có tính năng | 9 dòng nhiệm vụ, không có mục đích trống | `product-spec/references/spec.md` §3 |
| Đi thử luồng bằng mắt người mới (cognitive walkthrough) | §11 bảng cuối | tìm bước người mới không hiểu vì sao phải làm | 2 bước 2 điểm (F1.5, F1.6) → sửa bằng quy tắc chữ và FR-009 | `product-spec/references/spec.md` §3 |
| Bản đồ việc chạy ngầm 4 dòng (service blueprint) | §11 | chỉ cho Dev chỗ tính năng hỏng được mà người dùng không thấy | 2 bảng: mua gói, lời nhắc | `product-spec/references/spec.md` §3 |
| Đếm màn theo lối đi chính + nhánh + trạng thái + lớp phủ | §11 | cho Lan và Minh một con số để lên lịch | khoảng 21 màn | `product-spec/references/spec.md` §3 |
| Danh sách màn hay quên | §11 cuối | tìm màn không ai nghĩ tới cho tới lúc nộp | SCR-12, 14, 15, 16, 17, 18, 22 | `product-spec/references/spec.md` §3 |
| Chọn kiểu nhắc theo động lực và độ khó của việc | §10 FEAT-05 dòng "Giữ chân" | chọn giữa mồi / hướng dẫn từng bước / báo hiệu | kiểu mồi — động lực thấp, việc chỉ một chạm | `product-spec/references/spec.md` §2 |

### Lần soát gần nhất
Ngày 08/11/2026 · phạm vi: 6 tính năng của bản 1.0.0, mức Đủ để thiết kế · theo `product-standards/references/quality-gates.md` §1–3, §5.

| Cổng | Kết quả | Ghi chú |
|---|---|---|
| 0 · Chính sách và an toàn | **đạt sau khi sửa** | 3 vi phạm tìm thấy và sửa bằng D-07, D-08, D-09; không tính năng nào còn đòi thông báo / vị trí / theo dõi mới dùng được; PRM-01 có đường thay thế khi bị từ chối; mục còn mở: giấy phép tiếng dẫn (DQ-04) và phân loại dữ liệu sức khoẻ (DQ-06), cả hai có người và hạn ở §14 |
| 1 · Đủ phần lõi | đạt | §2–5, §9–12 có nội dung; không còn heading rỗng ở phần của bản 1.0.0 |
| 2 · Bằng chứng | đạt | mọi số có M# / Dev + ngày / mốc team / **giả định**; 7 giả định liệt ở §14 |
| 3 · Ràng buộc mobile | đạt | §9 phủ mất mạng, thông báo, trợ năng, riêng tư, sẵn sàng phát hành (khôi phục mua hàng, thử từ chối quyền, thử mất mạng) |
| 4 · Phạm vi rõ | đạt | BAN-01…04 và danh sách không được cắt đã đủ; FEAT-01, 02, 04 là P0 và phục vụ câu "phải chứng minh"; FR-016 là đường cứu của một luật bắt buộc nên để P0 dù FEAT-05 là P1 |
| 5 · Đo được | đạt ở mức bản nháp | 4 chỉ số ở §7 đều tính được từ sự kiện ở requirements §6; mọi sự kiện đều phục vụ một chỉ số hoặc một bước phễu |

Tám lỗi hay gặp: không lỗi nào. Luồng viết thành bước có đánh số, không chỉ có hình; bảng là bảng thật; persona ghi rõ là GIẢ ĐỊNH (proto); mỗi tính năng có nhánh từ chối quyền / mất mạng / lỗi / trống hoặc ghi rõ "không áp dụng".

Chưa đạt, không giấu: §5 chưa có empathy map và hành trình người dùng — phần đó của `product-users`, không phải của bước này; `product-detail` sẽ cần nó khi viết quy tắc từng màn.

### Biên bản họp
- 21/11/2026 · Lan, Minh · kick-off bản 1.0.0 — chốt FEAT-01…06 và ngày ra store 20/01/2027 (D-04).
- 08/11/2026 · Lan · soát cổng 0 khi viết đủ để thiết kế — sửa ba hạng mục của D-04 (D-07, D-08, D-09), thêm D-10…D-13. Minh chưa được báo (§14).
