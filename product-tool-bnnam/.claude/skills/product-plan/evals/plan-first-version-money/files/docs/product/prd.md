# PRD — 2 Phút (tên làm việc)

**Phiên bản tài liệu**: 0.2 · **Phiên bản app đang viết**: 1.0.0
**Cập nhật**: 08/11/2026 · **Người viết**: AI soạn, PO duyệt
**Trạng thái**: Đang viết bản 1.0.0 — đã xong định hình (product-kickoff) và người dùng (product-users)

> Nguồn thị trường là **DỮ LIỆU THỬ** (`docs/market/market-report.md` ghi rõ tên app và số liệu là giả). Mọi mã `M#…` trong tài liệu này trỏ về `docs/market/evidence.md`.

## 0. Đọc nhanh
- Đang làm: app iOS hạ căng thẳng 2 phút cho người đi làm 22–35 tuổi ở Mỹ; đang viết bản 1.0.0.
- Tình trạng: đã khoá phạm vi (8 hạng mục trong phạm vi, 8 điều cấm) và đã có người dùng — 2 chân dung (cả hai là **GIẢ ĐỊNH (proto)**, chưa phỏng vấn ai), 6 việc người dùng cần làm, khoảnh khắc thấy app có ích = hoàn thành bài thở đầu tiên, đường ngắn nhất 4 bước. Chưa có tính năng nào được đánh mã — bảng tính năng là việc của `product-plan`.
- Cần chốt: (1) 5 câu hỏi cho Dev (DQ-01…DQ-05, §14) — hạn 14/11/2026; (2) bạn xác nhận 2 chân dung và khoảnh khắc 4 bước ở §5 trước buổi kick-off, vì `product-plan` gán persona cho từng tính năng và `product-spec` phải giữ nguyên đường 4 bước đó.
- Bước tiếp: `product-plan` — đánh mã tính năng, ưu tiên, giá gói và chỉ số; chuẩn bị phiếu kick-off.

### Đọc theo vai trò
| Vai trò | Đọc mục nào | Xem hình ở đâu |
|---|---|---|
| Dev | §1 nền tảng · §4 điều cấm · §14 rủi ro và câu hỏi · requirements.md §8 (DQ-01…DQ-05) · §5 "Khoảnh khắc thấy app có ích" (ràng buộc 4 bước) — các mục §8–§13 còn trống | chưa có |
| Designer | §5 người dùng, empathy map, hành trình, khoảnh khắc thấy app có ích · §4 điều cấm và "Không được cắt" · §6 khác biệt — các mục §10–§12 còn trống | chưa có |

## 1. Thông tin dự án

### Người tham gia
| Vai trò | Tên | Trách nhiệm |
|---|---|---|
| Project Manager | chưa có — PO quyết | Quản lý dự án, quyết định cuối cùng |
| Product Owner | bạn | Nghiên cứu, chốt tính năng và các phiên bản |
| Developer | 2 dev iOS (chưa có tên) | Làm app, trả lời khả thi và ước giờ |
| UI/UX | 1 designer (chưa có tên) | Thiết kế |
| Data Analytic | PO kiêm ở bản 1.0.0 (D-09) | Tài liệu đo lường, đọc số hằng tuần |
| BE | — không có ở bản 1.0.0 (BAN-02) | API (nếu có) |
| AI | — không có ở bản 1.0.0 (BAN-08) | Model AI (nếu có) |
| Graphic | chưa có | Icon, ảnh store |
| ASO | PO kiêm ở bản 1.0.0 (D-09) | Tên app, mô tả, từ khoá trên store |
| Tester | PO + 2 dev kiểm chéo (D-09) | Kiểm thử trước khi lên store |
| Marketing (UA) | — không chạy quảng cáo ở bản 1.0.0 (D-07) | Chạy quảng cáo kéo người dùng |

### Lịch sử tài liệu
| Ngày | Phiên bản tài liệu | Đổi gì | Vì sao | Người |
|---|---|---|---|---|
| 07/11/2026 | 0.1 | Tạo tài liệu; viết §0–4, §6; mở §14 | Bước thị trường kết luận "làm tiếp" (market §6) | AI soạn, PO duyệt |
| 08/11/2026 | 0.2 | Viết §5 (2 chân dung proto, empathy map, 6 việc cần làm, hành trình, khoảnh khắc thấy app có ích); thêm khối "Đọc theo vai trò" dưới §0 và "Phương pháp đã dùng" ở §15; thêm 4 dòng vào §14; sửa cách kiểm của dòng giả định "chấp nhận không được chọn bài" từ "5–8 phỏng vấn" sang hỏi 1–2 người + số sau ra mắt | Chạy bước `product-users`; team chưa nói chuyện với người dùng nào nên chân dung là proto và cách kiểm phải vừa sức team (BH-04) | AI soạn, PO duyệt |

### Liên kết
| Nội dung | Link |
|---|---|
| Nghiên cứu thị trường | docs/market/market-report.md |
| Bằng chứng thị trường | docs/market/evidence.md |
| Figma (UI/UX) | chưa có |
| Luồng màn của bộ design | chưa có |
| Yêu cầu chi tiết | docs/product/requirements.md |
| Sổ quyết định | docs/product/decisions.md |

# Phần A — Cấp sản phẩm

## 2. Tóm tắt
Cho người đi làm ở Mỹ đang căng thẳng giữa giờ làm, app đưa thẳng vào **một** bài 2 phút ngay sau một chạm chọn tâm trạng — không có thư viện để chọn, vì chính lúc căng thẳng là lúc người dùng không chọn nổi.

### Vấn đề và giải pháp
| # | Vấn đề (cơ chế → hệ quả đo được) | Bằng chứng | Giải pháp tương ứng |
|---|---|---|---|
| 1 | Người đang căng thẳng mở app thiền → gặp thư viện bài dài và nhiều lựa chọn → không chọn nổi, đóng app giữa chừng ("Too many choices. I just stare at the library and close the app.") | M#1, M#2, M#3–#9 · 4 nguồn độc lập (store A, store B, Reddit, YouTube) · hằng ngày, mức đau cao (market §3) | Một chạm chọn tâm trạng → app đưa thẳng vào **đúng một** bài 2 phút đã chọn sẵn. Không có màn danh sách, không có lựa chọn thứ hai (BAN-01) |
| 2 | Người tải app xong không có cớ mở lại → không thành thói quen → rụng sau tuần đầu | M#17–#22 · 3 nguồn · hằng ngày, mức đau vừa (market §3; nhóm "quên dùng" 27/35 điểm, market §5.1) | Lối vào 1 chạm từ widget màn hình khoá (Dev đo 1,2 giây trên iPhone 11, 14/11/2026) + nhắc 1 lần/ngày theo giờ người dùng tự chọn + biểu đồ tâm trạng tuần cho thấy đã làm được bao nhiêu lần |
| 3 | Hết dùng thử bị trừ tiền mà không biết giá từ trước → đánh giá 1 sao, đòi hoàn tiền, mất lòng tin ngay ở màn mời trả tiền | M#10–#16 · 3 nguồn; app B bị chê đúng điểm này (M#11) · mức đau cao (market §3) | Giá và chu kỳ hiện trước nút mua, nói rõ ngày hết dùng thử và cách huỷ; phần lõi (check-in + bài thở) miễn phí vĩnh viễn, không giới hạn lượt (BAN-04, BAN-05) |

→ **Rút ra:** vấn đề 1 là lý do app tồn tại và quyết định hình dáng app (không thư viện); vấn đề 2 quyết định app có được mở lại không; vấn đề 3 không phải tính năng mà là cách bán — nó quyết định bản 1.0.0 có thu được tiền không. Ba nhóm nỗi đau còn lại trong market §3 (không biết viết gì, lo ngại dữ liệu) không đủ điểm để làm app riêng (market §5.1) và được dùng làm chi tiết bên trong giải pháp 1 và lời hứa dữ liệu, không thành vấn đề riêng.

### Vì sao là lúc này
- **Có bề mặt vào mới:** widget trên màn hình khoá cho phép vào thẳng màn check-in mà không qua màn mở app; Dev đã đo 1,2 giây trên iPhone 11 (Dev, 14/11/2026). Ba năm trước chưa có bề mặt này — cùng ý tưởng khi đó buộc người dùng mở app rồi mới check-in, tức là mất đúng cái lợi thế "1 chạm".
- **Tín hiệu cạnh tranh mới:** hai app đi hướng "ngắn, nhanh" ra mắt gần đây đang tăng nhanh nhất nhóm — C (ra mắt 03/2025) +38% và E (ra mắt 01/2026) +55% trong 3 tháng — trong khi app lâu năm B (2014) −9% (M#41–#44). Ba năm trước cả C và E đều chưa tồn tại.
- **Khoảng trống còn nguyên:** "gợi ý đúng việc theo tâm trạng lúc đó" mới 1/5 app có (market §4.3), dù nỗi đau đã có 4 nguồn độc lập trong 2025–2026.

Thị trường đáng quan tâm ở đây là số người ở lại và trả tiền, không phải số lượt tải: 3 app đầu chiếm 90,7% lượt tải (825k/910k) nhưng app E ra mắt 01/2026 vẫn lên 25k tải/tháng (M#40–#44) — chỗ trống nằm ở người ở lại, không ở lượt tải.

### Định vị
- **Từ → tới:** app thiền bán thư viện bài dài để người dùng tự chọn → một việc 2 phút được chọn hộ, đúng lúc đang căng.
- Cho **người đi làm 22–35 tuổi ở Mỹ đang căng thẳng giữa giờ làm**, **2 Phút** là **app hạ căng thẳng 2 phút** giúp **bình tĩnh lại ngay sau một chạm chọn tâm trạng**, khác **app A và B** ở chỗ **không có thư viện để chọn — app chọn hộ đúng một bài**.

(Câu này lấy từ ý tưởng chọn ở market §5.2; đổi câu này phải có một quyết định D-… mới.)

### Tiêu chí thành công
Bản 1.0.0 coi là thành công khi tất cả các trạng thái sau đúng (con số cụ thể do `product-plan` chốt ở §7):
- Người dùng **làm xong bài đầu tiên ngay trong phiên đầu** — đây là đòn bẩy số 3 trong ba thứ đổi kết quả tiền nhiều nhất (market §5.3).
- Người dùng **quay lại check-in nhiều ngày trong tuần đầu** mà app không có thư viện bài nào.
- **Tỉ lệ người tải bắt đầu dùng thử đạt mốc nội bộ team** (> 6%, M#50) — dưới mốc này thì không thêm tính năng mới mà sửa phễu.
- **Không có đánh giá 1 sao nào về "bị trừ tiền bất ngờ"** trong 30 ngày đầu sau ra mắt.

## 3. Mục tiêu và nguyên tắc
- **Mục tiêu sản phẩm:** ra mắt 1.0.0 trên App Store Mỹ chậm nhất 02/01/2027 (D-05), chứng minh được rằng một app **không có thư viện** vẫn giữ được người dùng quay lại và vẫn bán được gói thuê bao.
- **Công ty cần gì từ dự án:** một dòng doanh thu thuê bao mới, và học dòng sức khoẻ tinh thần (team chưa từng làm dòng này) bằng một bản nhỏ, dùng đúng thế mạnh sẵn có là onboarding và màn mời trả tiền (paywall) — market §1.

**Nguyên tắc** (dùng để phân xử khi tranh cãi):
| # | Ưu tiên … hơn … | Tính năng hợp lý mà nguyên tắc này loại bỏ |
|---|---|---|
| 1 | Ưu tiên **một việc làm ngay trong 2 phút** hơn **độ sâu nội dung** | Thư viện bài; màn danh sách để chọn bài (kể cả chỉ 5 bài); bài dài hơn 3 phút; bộ sưu tập theo chủ đề |
| 2 | Ưu tiên **giá nói trước** hơn **tối đa tỉ lệ bắt đầu dùng thử** | Paywall giấu giá sau khi bấm "bắt đầu dùng thử"; đếm ngược giả; nút đóng ẩn sau 5 giây |
| 3 | Ưu tiên **dữ liệu nằm trên máy** hơn **đồng bộ nhiều thiết bị** | Đăng nhập tài khoản; đồng bộ đám mây; backend riêng; hồ sơ người dùng trên server |
| 4 | Ưu tiên **luật chọn bài nằm sẵn trong app** hơn **chọn bằng AI hoặc server** | Gợi ý bài bằng AI; cá nhân hoá cần server; chatbot trò chuyện |
| 5 | Ưu tiên **phần lõi miễn phí vĩnh viễn** hơn **giới hạn lượt để ép mua** | Giới hạn "2 bài thở/ngày" cho người miễn phí; khoá check-in sau 7 ngày; xem quảng cáo để mở thêm lượt |

→ **Rút ra:** nguyên tắc 1 và 5 cùng nhau cấm hai cách tăng doanh thu quen thuộc nhất (bán thư viện, giới hạn lượt) — nên tiền của bản này chỉ có thể đến từ phần **thêm** (biểu đồ tâm trạng tuần), không từ việc khoá phần lõi. `product-plan` phải chốt gói trả phí trong ràng buộc đó.

## 4. Phạm vi và điều cấm
**Bản đầu phải chứng minh:** Không cần thư viện bài, app vẫn khiến người đi làm ở Mỹ quay lại check-in nhiều ngày trong tuần đầu và vẫn đạt mốc team về tỉ lệ bắt đầu dùng thử (> 6%, M#50).

### Trong phạm vi
| Hạng mục | Vì sao cần ở bản này |
|---|---|
| 1 · Check-in tâm trạng một chạm, miễn phí, không giới hạn lượt | Là hành động lõi của câu phải chứng minh; 5/5 đối thủ có và đều để miễn phí (market §4.3) |
| 2 · Chọn hộ đúng **một** bài theo tâm trạng vừa chạm, không có màn chọn | Điểm khác biệt chính — 1/5 app có (market §4.3); giải thẳng vấn đề 1 (M#1, M#2) |
| 3 · Bài thở 2 phút bằng hình + tiếng (không rung) | Hình thức "một việc 2 phút"; bỏ rung theo quyết định Dev 14/11/2026 (rung khi màn tắt bị hệ thống cắt sau ~30 giây) |
| 4 · Câu nhật ký gợi ý ngắn theo tâm trạng (một câu, không phải trang trắng) | Nhánh thứ hai của ý tưởng chọn (market §5.2); gỡ nỗi đau "không biết viết gì" (M#23–#26) ngay trong giải pháp, không thành app riêng |
| 5 · Lối vào 1 chạm từ widget màn hình khoá | Lý do "vì sao là lúc này"; Dev đã đo 1,2 giây trên iPhone 11 (14/11/2026); giải vấn đề 2 |
| 6 · Biểu đồ tâm trạng tuần | Thứ **thêm** để bán (3/5 app đang thu tiền phần này — market §4.3); cho người dùng thấy tiến bộ (vấn đề 2) |
| 7 · Nhắc 1 lần/ngày theo giờ người dùng tự chọn | Cớ mở lại app (vấn đề 2) mà không cần đoán giờ căng thẳng — phần đoán giờ Dev chưa trả lời được (market §5.4, P1) |
| 8 · Thuê bao, màn mời trả tiền có giá hiện trước nút mua và có khôi phục mua hàng | Cách thu tiền duy nhất của bản này (D-07: không quảng cáo, không mua UA); giải vấn đề 3 |

→ **Rút ra:** bỏ bất kỳ hạng mục nào từ 1 đến 3 thì câu "phải chứng minh" không còn kiểm được. Hạng mục 4, 6 và 7 là những thứ `product-plan` được phép hạ xuống P1 nếu Dev ước giờ không vừa 8 tuần — nhưng bỏ thì mất nửa sau của câu phải chứng minh (quay lại và trả tiền).

### Ngoài phạm vi, đã cân nhắc
| Hạng mục | Vì sao chưa làm | Xét lại khi nào |
|---|---|---|
| Thư viện bài, nội dung dài, bộ sưu tập theo chủ đề | Mâu thuẫn trực tiếp nguyên tắc 1 và là nỗi đau chính của đối thủ (M#1, M#2) | Chỉ khi 1.0.0 đã đạt tiêu chí thành công **và** có ≥ 20 yêu cầu xin thêm bài trong đánh giá store |
| Nhắc "đúng giờ hay căng thẳng" do app tự đoán | Dev chưa trả lời có đoán được từ lịch sử check-in mà không xin quyền nhạy cảm không (market §5.4, P1) | Bản 1.1.0, khi đã có ≥ 4 tuần lịch sử check-in thật và Dev trả lời DQ |
| Rung theo nhịp thở | Dev 14/11/2026: hệ thống cắt sau ~30 giây khi màn hình tắt | Khi Dev tìm được cách chạy đủ 2 phút ở nền và đo được mức tốn pin |
| Chatbot / gợi ý bằng AI | Market §4.6 đã loại: rủi ro quy định y tế (M#34) và team chưa làm AI | Khi có người phụ trách AI **và** có ý kiến pháp lý về quảng bá sức khoẻ |
| Đồng bộ nhiều thiết bị, iCloud riêng tư | Nguyên tắc 3; Dev chưa trả lời đồng bộ có bắt đăng nhập không (market §5.4, T4) | Bản 1.2.0, sau khi có số người dùng đổi máy thật |
| iPad, Android | Market §1 chốt iOS, Mỹ trước; 2 dev iOS trong 8 tuần | Sau khi 1.0.0 đạt tiêu chí thành công |
| Quảng cáo trong app | Mô hình là thuê bao; app E đi hướng quảng cáo bị chê dày (M#28) và thu thấp nhất nhóm 0,40 USD/lượt tải (M#44) | Chỉ xét lại nếu bỏ hẳn mô hình thuê bao |
| Mua quảng cáo kéo người dùng (UA) | Market §5.3: không kịch bản nào ở Mỹ mua nổi lượt tải (trần hoà vốn 1,28 USD < CPI tham chiếu thấp nhất 1,50 USD) | Khi có CPI thật của dòng sức khoẻ tinh thần ở Mỹ (đang chờ, market §7) |
| Chèn 2 phút thở vào khe trống lịch họp (Ý4) | Không có bằng chứng người dùng nào trong M#1–#33 đòi điều này (market §5.2) | Sau khi hỏi 5–10 người đi làm |
| Nhiều ngôn ngữ | Chỉ bán ở Mỹ ở bản đầu; dịch làm chậm cả vòng thiết kế lẫn kiểm thử | Khi mở nhóm nước thứ hai |

→ **Rút ra:** hai thứ đau nhất khi cắt là thư viện bài (thứ đối thủ đang thu tiền) và đồng bộ nhiều máy (thứ người dùng sẽ hỏi ngay). Cả hai bị cắt có chủ đích, không phải vì thiếu thời gian — nên chúng nằm trong điều cấm, không chỉ nằm ngoài phạm vi.

### Điều cấm
| Mã | Bị cấm | Vì sao | Ai được mở khoá |
|---|---|---|---|
| BAN-01 | Mọi màn danh sách / thư viện để người dùng tự chọn bài — kể cả "chỉ 5 bài", kể cả nút "đổi bài khác" dẫn tới danh sách | Đây chính là nỗi đau số 1 của cả dòng app (M#1, M#2, 4 nguồn độc lập) và là lý do app tồn tại | PO, qua decisions.md |
| BAN-02 | Tài khoản người dùng, đăng nhập, đồng bộ đám mây, backend riêng | Nguyên tắc 3; mỗi thứ này đều thêm màn, thêm lỗi, thêm luật quyền riêng tư trong 8 tuần | PO, qua decisions.md |
| BAN-03 | Thu thập dữ liệu ngoài danh sách đã duyệt (tâm trạng, thời điểm check-in, bài đã làm — nằm trên máy); cấm gửi dữ liệu tâm trạng ra khỏi máy; cấm SDK quảng cáo / theo dõi của bên thứ ba | Lời hứa "dữ liệu ở trên máy" là thứ bán được (M#27–#29); vi phạm một lần là mất cả lời hứa | PO, qua decisions.md |
| BAN-04 | Mẫu tối ở màn mời trả tiền: giấu giá trước nút mua, đếm ngược giả, nút đóng ẩn, "được N triệu người tin dùng" không kiểm chứng được, nút "Tiếp tục" trong onboarding dẫn thẳng sang mua | Nguyên tắc 2; đây đúng là thứ người dùng chê app B (M#11) và là nỗi đau nhóm 3 (M#10–#16) | PO, qua decisions.md |
| BAN-05 | Giới hạn lượt với check-in và bài thở của người dùng miễn phí (theo ngày, theo tuần, hay theo tổng) | Nguyên tắc 5; 5/5 đối thủ để check-in miễn phí, 4/5 để bài thở miễn phí (market §4.3) — khoá là tự loại mình khỏi đường vào bằng tìm kiếm store | PO, qua decisions.md |
| BAN-06 | Quảng cáo trong app ở bản 1.0.0 (banner, chen giữa màn, xem để nhận thưởng) | App E đi hướng này bị chê quảng cáo dày (M#28) và thu thấp nhất nhóm (M#44) | PO, qua decisions.md |
| BAN-07 | Nhiều ngôn ngữ — bản 1.0.0 chỉ có tiếng Anh Mỹ | Chỉ bán ở Mỹ; dịch làm phình cả thiết kế lẫn kiểm thử trong 8 tuần | PO, qua decisions.md |
| BAN-08 | Tính năng AI / chatbot trị liệu, và mọi câu chữ mang tính chẩn đoán, điều trị hay hứa hẹn kết quả y tế (kể cả trong onboarding và trang store) | Market §4.6 loại vì rủi ro quy định y tế (M#34) và team chưa làm AI; câu chữ y tế có thể làm App Review từ chối bản | PO, qua decisions.md; câu chữ y tế cần thêm ý kiến pháp lý |

### Không được cắt trong mọi trường hợp
| Hạng mục | Vì sao không được cắt | Cắt thì hỏng thế nào |
|---|---|---|
| Màn mời trả tiền hiện đủ giá, chu kỳ, ngày hết dùng thử, cách huỷ, và có nút đóng nhìn thấy được | Là lời hứa công khai của sản phẩm (nguyên tắc 2) và là giải pháp cho vấn đề 3 | Rơi đúng vào nỗi đau M#10–#16 → đánh giá 1 sao và đòi hoàn tiền, đúng thứ đang làm app B tụt 9% |
| Khôi phục mua hàng (restore purchase — lấy lại gói đã mua khi đổi máy hoặc cài lại) | Người đã trả tiền mà mất gói là lỗi nặng nhất của một app thuê bao | Người đổi máy mất gói đã trả → hoàn tiền + 1 sao; App Review có thể từ chối bản |
| Đường đi khi người dùng từ chối quyền thông báo, kể cả từ chối vĩnh viễn | Nhắc 1 lần/ngày là cột sống của vấn đề 2 | App im lặng, người dùng không hiểu vì sao không được nhắc và không biết bật lại ở đâu |
| Phần lõi miễn phí vĩnh viễn: check-in + bài thở 2 phút | Đường vào duy nhất của bản này là tìm kiếm trên store (D-07) — phần miễn phí chính là thứ kéo người tải | Mất đúng nhóm người mà cách vào bằng tìm kiếm store mang về, mà lại không có quảng cáo để bù |
| Đường lui khi widget không mở được hoặc bài không chạy được: mở app bình thường vẫn làm xong được việc đó | Widget là lối vào, không được là điểm hỏng duy nhất | Người dùng chạm widget, không có gì xảy ra, và không còn cách nào khác để check-in |
| Màn trạng thái trống lần đầu của biểu đồ tâm trạng tuần (chưa có dữ liệu) | Mọi người dùng mới đều gặp màn này trước khi gặp bản đầy đủ | Biểu đồ rỗng hoặc vỡ ở đúng phiên đầu — phiên quyết định việc bán được hay không (market §5.3) |
| Lời hứa "dữ liệu tâm trạng nằm trên máy" hiển thị trong app và trên trang store | Là một trong ba điểm khác biệt (§6) và cơ sở của BAN-03 | Mất điểm khác biệt mà không ai nhận ra là đã mất, vì không ai demo phần này |

## 5. Người dùng · [Design]
Người dùng chính là người đi làm 22–35 tuổi ở Mỹ gặp app **ngay tại bàn làm việc lúc đang căng**; họ thuê app làm đúng một việc: hạ được cơn căng trong 2 phút mà không phải ra quyết định nào.

> **Cả hai chân dung dưới đây là GIẢ ĐỊNH (proto)** — dựng từ đánh giá store và diễn đàn đã gom trong `docs/market/evidence.md`, **chưa nói chuyện trực tiếp với người dùng nào** (bạn xác nhận 08/11/2026). Cách bỏ nhãn này nằm ở cuối mục và ở §14.

### 5.1 Bằng chứng đã gom thành nhóm
Cách làm: gom nhóm + đếm nguồn độc lập (theo bộ market §3) — một app = một nguồn, Reddit = nguồn khác.

| Nhóm | Bằng chứng | Nguồn độc lập | Điểm nhu cầu (market §5.1) | Bước này dùng vào đâu |
|---|---|---|---|---|
| Quá dài, quá nhiều lựa chọn khi đang căng | M#1–#9 | 4 (store A, store B, Reddit, YouTube) | 31/35 | PER-01 · JTBD-01 · chỗ vỡ chính của hành trình |
| Quên dùng, không thành thói quen | M#17–#22 | 3 | 27/35 | PER-02 · JTBD-02, JTBD-03 |
| Giá đắt, bị trừ tiền sau dùng thử | M#10–#16 | 3 | 22/35 | JTBD-05 — cách bán, không phải persona riêng |
| Ghi nhật ký không biết viết gì | M#23–#26 | 2 | 20/35 | chi tiết bên trong giải pháp của PER-01 (hạng mục 4, §4) |
| Lo dữ liệu tâm trạng bị chia sẻ | M#27–#29 | 2 | 20/35 | JTBD-06 — lời hứa dữ liệu, cắt ngang cả hai persona |
| Khen và cách tự xoay xở | M#30–#33 | 2 | — | hành vi thật của cả hai persona; M#30, M#31 là thứ **không được làm hỏng** |

→ **Rút ra:** chỉ hai nhóm đầu qua ngưỡng 25/35 — và chúng khác nhau ở **khoảnh khắc app phải có mặt**, nên thành hai chân dung. Ba nhóm còn lại không đủ để thành persona riêng nhưng mỗi nhóm thành một việc cần làm (JTBD).

### 5.2 Vì sao người đang căng lại đóng app — đào sâu
Cách làm: 5 Whys — bắt đầu từ M#2 ("Too many choices. I just stare at the library and close the app.").

1. **Vì sao họ đóng app?** Vì mở ra gặp thư viện và phải chọn một bài (M#2).
2. **Vì sao phải chọn lại khiến họ bỏ?** Vì lúc đang căng, mỗi lựa chọn là thêm một việc phải làm, trong khi thứ họ cần là bớt việc đi (M#1 — "I don't have 15 minutes, I need something now").
3. **Vì sao app lại bắt chọn?** Vì màn chọn là chỗ app trưng thư viện — thứ đang mang về tiền: A 1,23 USD và B 1,56 USD trên mỗi lượt tải sau phí store (M#40, M#41).
4. **Vì sao người dùng vẫn tải đúng những app đó?** Vì họ tải lúc **bình tĩnh**, và lúc bình tĩnh thì "nhiều nội dung" nghe như một ưu điểm: A và B giữ 80,2% lượt tải của nhóm (730k/910k, M#40–#44) dù "quá dài" chính là lời chê nhiều nhất của hai app này (M#2, M#5).
5. **Vì sao đó là gốc?** Vì **người tải và người dùng là cùng một người ở hai trạng thái khác nhau**. App được thiết kế để bán cho trạng thái bình tĩnh, nhưng được mở ở trạng thái căng.

→ **I-1 (nhận định gốc):** người dùng **chọn** app bằng trạng thái bình tĩnh và **dùng** app bằng trạng thái căng thẳng. BAN-01 (cấm thư viện) phục vụ đúng trạng thái dùng — nhưng cũng lấy mất lập luận bán hàng của trạng thái tải, trong khi đường vào duy nhất của bản này là tìm kiếm trên store (D-07). Bằng chứng cho rủi ro này đã có sẵn ở đối thủ gần mình nhất: app C đi hướng ngắn và bị chính người dùng chê "ít nội dung sau 2 tuần" (M#20, market §4.1). → §14.

→ **I-2 (nhận định phụ, độ tin vừa):** việc này diễn ra **ở chỗ làm, nơi hành vi bị nhìn thấy**. Hai cách tự xoay xở duy nhất có trong bằng chứng đều là công cụ trung tính, không lộ: hẹn giờ thở trên Apple Watch (M#32) và gõ vào Notes (M#33) — không ai dùng app sức khoẻ tinh thần ngay tại bàn. Suy ra, chưa có lời người dùng nào nói thẳng → thành JTBD-04 có nhãn giả định và câu hỏi số 3 ở §5.8.

### 5.3 Độ tin và thiên lệch của bằng chứng
Cách làm: soát thiên lệch trước khi kết luận (bộ users §5) — mỗi dòng "có" đều hạ độ tin của phần nó chạm.

| Soát gì | Ở đây | Hạ độ tin của |
|---|---|---|
| Mẫu chỉ gồm người đã quan tâm? | Có — toàn bộ M#1–#33 là người đã tải app thiền **và** còn bận tâm đến mức đi viết đánh giá; người chưa từng tải không có mặt | mọi câu về quy mô nhóm; không dùng bằng chứng này để ước số người dùng |
| Ý định bị đọc thành hành vi? | Có ở JTBD-04 — suy từ 2 cách tự xoay xở (M#32, M#33), không từ lời nói | JTBD-04: độ tin vừa, phải hỏi mới dùng để thiết kế |
| Vài chục đánh giá bị coi là cả thị trường? | Có nếu suy ra tỉ lệ | mọi tỉ lệ ở §7 đều là giả định cho tới khi có số sau ra mắt |
| Lời nguyên văn đủ để dựng empathy map? | Không — bản thử chỉ giữ nguyên văn M#1 và M#2, các nhóm #3–#33 bị lược | ô "Nói" của PER-01 mỏng; PER-02 không đủ để dựng empathy map riêng |
| Nguồn gốc dữ liệu | Toàn bộ số thị trường là **DỮ LIỆU THỬ** (market ghi ở đầu file) | mọi con số trích ở mục này |

### 5.4 Chân dung

#### PER-01 · Người đang căng giữa ca làm — gặp vấn đề ngay tại bàn, cần xong trong 2 phút · **GIẢ ĐỊNH (proto)**
- **Bối cảnh:** giữa ca làm ở Mỹ, trước màn hình máy tính, có đồng nghiệp xung quanh; cơn căng đến bất chợt và họ cần xử lý ngay tại chỗ (M#1). Thiết bị: iPhone trong tầm tay, một số có Apple Watch (M#32).
- **Hành vi thật:** đã tải app thiền lớn rồi bỏ giữa chừng khi gặp thư viện (M#2); vẫn là nhóm đang đổ 80,2% lượt tải về A và B (730k/910k, M#40–#44) — chọn lúc bình tĩnh, bỏ lúc căng (I-1); tự xoay xở bằng hẹn giờ thở trên Apple Watch (M#32) và gõ vào Notes (M#33); khen check-in nhanh của app C (M#31) và giọng đọc dễ chịu (M#30).
- **Mục tiêu cuối (ngoài app):** quay lại được việc đang dở sau vài phút, và tự lo được cơn căng bằng thứ sẵn trong túi, không phải nhờ đến ai (suy từ M#32, M#33).
- **Nỗi đau:** phải chọn đúng lúc không chọn nổi (M#1–#9, 4 nguồn); mở Notes ra thì không biết viết gì (M#23–#26); ghi tâm trạng mà không biết nó đi đâu (M#27–#29).
- **Động lực (vì sao họ vẫn cố):** cơn căng xảy ra hằng ngày và họ đã bỏ công tự dựng cách xoay xở riêng (M#32, M#33) — tức là họ vẫn đang cố, chỉ không cố bằng app nữa.
- **Cần (dạng kết quả):** hạ được cơn căng trong ≤ 2 phút mà không phải ra một quyết định nào — và làm được điều đó kín đáo, không ai quanh họ phải nhận ra (vế sau là **giả định**, I-2).

#### Empathy map — PER-01
| Ô | Nội dung (nguồn) |
|---|---|
| Nói | "When I'm panicking I don't have 15 minutes, I need something now." (M#1) · "Too many choices. I just stare at the library and close the app." (M#2) · Các lời khác cùng nhóm (#3–#9) bị lược trong bản thử — xem §5.3 |
| Nghĩ | "Mình không có 15 phút cho cái này" (M#1) · "Ghi tâm trạng ra thì nó nằm ở đâu, ai đọc được?" (M#27–#29) · "App này chắc hợp với người rảnh hơn mình" — suy ra, độ tin thấp |
| Làm | Tải app nhiều nội dung lúc bình tĩnh, bỏ giữa chừng lúc căng (M#2, M#40–#44) · Hẹn giờ thở trên Apple Watch (M#32) · Gõ vào Notes (M#33) · Khen check-in nhanh của app C (M#31) |
| Cảm thấy | Hoảng và gấp, không còn sức quyết định (M#1); bực vì thứ đáng lẽ giúp lại bắt làm thêm một việc nữa (M#2) |
| Nỗi đau | Phải chọn lúc không chọn nổi (M#1–#9) · bị trừ tiền sau dùng thử mà không biết trước (M#10–#16) · trang giấy trắng khi muốn ghi (M#23–#26) |
| Điều muốn có | Một việc làm ngay trong 1–2 phút, không phải chọn (market §3) · biết giá trước khi bị trừ (M#10–#16) · dữ liệu nằm trên máy (M#27–#29) · giọng dễ nghe — thứ được khen và **không được làm hỏng** (M#30) |

→ **Chênh giữa Nói và Làm:** họ **nói** cần cái gì đó ngay (M#1) nhưng **làm** là tải đúng những app bán thư viện dài nhất (M#40–#44). Chênh này chính là I-1 — và nó có nghĩa: hỏi họ "bạn muốn gì" sẽ ra câu trả lời sai; chỉ hành vi lúc căng mới đáng tin.

#### Mô hình tư duy — PER-01
| Quá khứ (công cụ đang gặp) | Hiện tại (hành vi, nỗi đau) | Tương lai (điều có thể đổi dòng này) |
|---|---|---|
| App thiền A hoặc B đã tải từ trước, còn trên máy | Mở ra gặp thư viện, nhìn một lúc rồi đóng (M#2) | Không có màn chọn: một chạm tâm trạng → vào thẳng một bài (hạng mục 2, §4) |
| Hẹn giờ thở trên Apple Watch (M#32) | Dùng được vì không phải mở app và không lộ, nhưng không giữ lại dấu vết gì | Bài thở 2 phút bằng hình + tiếng, và lần làm được ghi lại (hạng mục 3 và 6, §4) |
| Ghi chú trong Notes (M#33) | Mở ra thì không biết viết gì (M#23–#26) | Một câu gợi ý ngắn theo tâm trạng, không phải trang trắng (hạng mục 4, §4) |
| Tìm "anxiety relief" trên store lúc bình tĩnh | Chọn app theo "nhiều nội dung", rồi bỏ lúc căng (I-1) | Trang store và onboarding phải bán được chính câu "2 phút, không phải chọn" — việc của ASO và `product-spec` |
| App cũ nằm im trên máy | Không còn cớ nào để mở lại (M#17–#22) | Nhắc 1 lần/ngày vào giờ người dùng tự chọn + lối vào từ widget (hạng mục 5 và 7, §4) |

#### PER-02 · Người muốn giữ thói quen rồi quên mất — app phải tìm đến họ, không phải họ tìm đến app · **GIẢ ĐỊNH (proto)**
- **Vì sao tách riêng, không gộp vào PER-01:** khác nhau ở **khoảnh khắc app phải có mặt**. PER-01 được phục vụ lúc đang căng, khi họ tự mở app; PER-02 phải được phục vụ lúc **bình thường**, khi không có gì nhắc họ — nên cần một bề mặt khác (thông báo, widget, biểu đồ), không phải một thiết kế khác của cùng màn. Nhóm này cũng tự qua ngưỡng ở market §5.1 (27/35, 3 nguồn độc lập).
- **Bối cảnh:** tải app với ý định dùng mỗi ngày, dùng được ít ngày rồi thôi; không có thời điểm cố định nào trong ngày gắn với việc này (M#17–#22).
- **Hành vi thật:** ghi tâm trạng rải rác trong Notes (M#33); app C — đúng kiểu check-in nhanh — vẫn bị chê "ít nội dung sau 2 tuần" (M#20, market §4.1), tức là họ ở lại lâu hơn PER-01 nhưng hết lý do quay lại sau khoảng hai tuần.
- **Mục tiêu cuối:** giữ được một thói quen cho bản thân, không thêm một app bị bỏ nữa.
- **Nỗi đau:** không có cớ để mở lại (M#17–#22); không nhìn thấy tiến bộ nên không biết có đáng tiếp không (market §3 — "lời nhắc đúng lúc, thấy được tiến bộ").
- **Động lực:** từ khoá "mood tracker" tăng trong 12 tháng (market §2) và 3/5 app đang **thu tiền** phần biểu đồ tâm trạng tuần (market §4.3) — người ta trả tiền để nhìn thấy mình có tiến bộ.
- **Cần (dạng kết quả):** một cú nhắc đúng giờ họ tự chọn, và một bằng chứng nhìn thấy được rằng tuần này họ đã làm mấy lần.
- **Không có empathy map riêng:** nhóm #17–#22 bị lược hết lời nguyên văn trong bản thử (§5.3) — dựng map sẽ phải bịa ô "Nói". Dựng khi có lời nguyên văn hoặc sau khi hỏi 1–2 người.

→ **Rút ra:** toàn bộ thiết kế dành cho PER-02 nằm ở hạng mục 5 (widget), 6 (biểu đồ tuần) và 7 (nhắc) của §4 — **đúng ba hạng mục mà D-02 cho phép hạ xuống P1 nếu không vừa 8 tuần**. Hạ cả ba thì bản 1.0.0 không còn gì cho PER-02, và nửa sau của câu "phải chứng minh" (người dùng quay lại) không kiểm được nữa. → §14.

### 5.5 Sáu loại người dùng và mức quan trọng
| Loại | Ở app này là ai | Mức | Thiết kế cho họ? |
|---|---|---|---|
| Dùng trực tiếp | PER-01, PER-02 | chính | Có — toàn bộ §4 |
| Quản lý người dùng khác | — không có: app cá nhân, không có vai quản lý | — | Không |
| Chỉ nhận kết quả | — không có: dữ liệu tâm trạng không rời khỏi máy (BAN-03) | — | Không |
| Người kiểm tra hệ thống | App Review của Apple — đọc trang store, onboarding và màn mời trả tiền trước khi duyệt | phụ | Có — qua §4 "Không được cắt" và cổng 0 ở `product-spec` |
| Quyết hoặc trả tiền mà không dùng | — không có: người dùng tự trả cho mình | — | Không |
| Đang dùng đối thủ hôm nay | Người đang ở lại với A, B vì thư viện đã trả tiền; người đang dùng C, E | phụ | Có — qua ASO và onboarding, **không** đổi thiết kế app |
| (mức yếu) Tải theo trào lưu, xoá sau một lần | — | yếu | Không — không thiết kế quanh họ |

### 5.6 Việc người dùng cần làm
| Mã | Khi … tôi muốn … để … | Persona | Bằng chứng · điểm |
|---|---|---|---|
| JTBD-01 | Khi tôi thấy căng lên giữa ca làm, tôi muốn làm xong **một** việc hạ căng trong 2 phút mà không phải chọn gì, để quay lại việc đang dở với cái đầu bớt ồn | PER-01 | M#1, M#2, M#32 · 31/35 |
| JTBD-02 | Khi một ngày trôi qua mà tôi lại quên không dùng, tôi muốn có một cú nhắc vào đúng giờ tôi tự chọn, để không phải nhớ bằng ý chí | PER-02 | M#17–#22 · 27/35 |
| JTBD-03 *(cảm xúc)* | Khi nhìn lại một tuần, tôi muốn thấy bằng chứng mình đã làm được mấy lần, để tin là lần này mình không bỏ cuộc giữa chừng | PER-02 | M#17–#22; market §4.3 (3/5 app thu tiền phần này) · 27/35 |
| JTBD-04 *(xã hội — **giả định**, độ tin vừa)* | Khi tôi đang căng ngay tại bàn, tôi muốn hạ nhịp bằng một cách kín đáo, không ai xung quanh nhận ra, để không phải giải thích với đồng nghiệp | PER-01 | Suy từ M#32, M#33 (cả hai cách xoay xở đều dùng công cụ trung tính) — I-2; chưa có lời người dùng · chưa chấm |
| JTBD-05 | Khi sắp hết dùng thử, tôi muốn biết trước giá, ngày bị trừ và cách huỷ, để không phải canh chừng một app | PER-01, PER-02 | M#10–#16, M#11 · 22/35 |
| JTBD-06 | Khi tôi ghi lại tâm trạng thật, tôi muốn chắc nó không rời khỏi máy, để không phải cân nhắc có nên ghi thật hay không | PER-01, PER-02 | M#27–#29 · 20/35 |

→ **Rút ra:** JTBD-01 là việc duy nhất quyết định app có lý do tồn tại; JTBD-02 và JTBD-03 quyết định app có được mở lần thứ hai; JTBD-05 và JTBD-06 không sinh ra tính năng mới mà ràng buộc **cách bán** và **cách lưu dữ liệu** — đã khoá sẵn ở BAN-03, BAN-04, BAN-05. JTBD-04 chưa được phép dẫn dắt thiết kế cho tới khi hỏi được người thật.

### 5.7 Ai không phải người dùng
- **Người đang cần trị liệu lâm sàng hoặc đang khủng hoảng** — app không thay bác sĩ và không được nói như đang chữa bệnh (BAN-08). Không thiết kế cho họ; nhưng phần an toàn (câu chữ, lối dẫn ra nguồn trợ giúp) vẫn là việc bắt buộc của cổng 0 ở `product-spec`.
- **Trẻ em dưới 13 tuổi** — app không nhắm tới, không thu dữ liệu định danh (BAN-03); ảnh hưởng tới phân loại độ tuổi và trang store.
- **Người đi tìm thư viện thiền dài hoặc bài ngủ ngon** — BAN-01 nói thẳng là app không có. Đây là nhóm **phải chủ động lọc ra ở trang store**, vì nếu họ tải nhầm thì đánh giá 1 sao kiểu "ít nội dung" (M#20) sẽ rơi xuống đúng chỗ đau nhất của bản này.
- **Người dùng Android, người dùng iPad** — D-06.
- **Người không đọc tiếng Anh Mỹ** — BAN-07.
- **Người tải theo trào lưu rồi xoá sau một lần** — nhóm yếu, không thiết kế quanh họ và không tính vào chỉ số giữ chân.

### 5.8 Hành trình — PER-01
Cách làm: hành trình 5 giai đoạn + đánh dấu chỗ vỡ và khoảnh khắc sự thật. Chọn hành trình **đang vỡ** (không phải hành trình điển hình) vì chỗ vỡ chính là lý do app tồn tại.

| Giai đoạn | Hiện tại (không có app mình) | Chỗ vỡ | Mong muốn (có 2 Phút) | Động lực · chỉ số team |
|---|---|---|---|---|
| Phát hiện | Gõ "anxiety relief" trên store lúc đang bình tĩnh, chọn app trông nhiều nội dung nhất 😐 (M#40–#44) | ✗ Chọn app bằng trạng thái bình tĩnh, bằng tiêu chí "nhiều bài" (I-1) | Trang store bán đúng một câu "2 phút, không phải chọn" và lọc sẵn người đi tìm thư viện | Muốn tự lo được · lượt tải từ tìm kiếm store (D-07) |
| Cân nhắc | Đọc đánh giá, thấy chê "quá dài" nhưng vẫn tải app to 😐 (M#2, M#5) | ✗ Không có cách nào thử 2 phút trước khi tải | Mô tả và ảnh store cho thấy đúng 2 chạm là xong | Ngại mất công · tải → mở lần đầu |
| Lần đầu dùng ⭐ | Mở app lúc đang căng → gặp thư viện → nhìn một lúc rồi đóng 😣 (M#2) | ✗ **Chỗ vỡ chính** — đóng app mà chưa làm được gì | Một chạm tâm trạng → vào thẳng bài 2 phút → **làm xong** 😀 | Muốn hết căng ngay · % hoàn thành bài đầu ngay phiên đầu (đòn bẩy số 3, market §5.3) |
| Dùng hằng ngày | Lần căng sau thì xoay bằng hẹn giờ thở trên Watch (M#32) hoặc gõ Notes (M#33), không mở app 😐 | ✗ App không có mặt đúng lúc căng; mở app = rời việc đang làm | Widget màn hình khoá vào thẳng check-in trong 1,2 giây (Dev, 14/11/2026) | Muốn không phải nhớ · số ngày check-in trong tuần đầu |
| Quay lại / bỏ | Sau một hai tuần quên hẳn, app nằm im; hoặc bị trừ tiền sau dùng thử → gỡ app + 1 sao 😣 (M#17–#22, M#10–#16) | ✗ Không có cớ quay lại · ✗ bị trừ tiền bất ngờ | Nhắc 1 lần/ngày giờ tự chọn + biểu đồ tuần cho thấy đã làm mấy lần; giá nói trước nút mua | Muốn thấy mình có tiến bộ · tỉ lệ bắt đầu dùng thử > 6% (M#50); 0 đánh giá 1 sao "trừ tiền bất ngờ" |

→ **Một bước đổi duy nhất:** bỏ hẳn bước **chọn** giữa "mở app" và "làm bài". Mọi thứ khác trong hành trình là hệ quả của bước đó. **Động lực để bắt đầu** là cơn căng đang xảy ra; **khoảnh khắc sự thật** ⭐ nằm ở lần đầu dùng, không ở màn mời trả tiền.

### 5.9 Khoảnh khắc thấy app có ích
**Hành động:** người dùng **hoàn thành bài thở 2 phút đầu tiên** — chạy hết bài, tới màn kết thúc. Đếm được, không phải cảm nhận.

**Đường ngắn nhất từ lần mở đầu: 4 bước, 2 chạm, khoảng 2 phút 10 giây.**
1. Mở app lần đầu (icon hoặc widget) → vào thẳng màn check-in.
2. Chạm một tâm trạng. *(chạm 1)*
3. App mở đúng một bài 2 phút đã chọn sẵn → chạm "Bắt đầu". *(chạm 2)*
4. Làm hết bài → màn kết thúc. ⭐

**Ràng buộc đi kèm — `product-spec` và `product-detail` phải giữ, không được định nghĩa lại:** trước bước 4 không có câu hỏi onboarding, không xin quyền thông báo, không có màn mời trả tiền (nguyên tắc 2 và 3 ở §3, BAN-04). Xin quyền thông báo và màn mời trả tiền đặt **sau** màn kết thúc — tức là sau khi người dùng đã nhận được thứ app hứa.

**Chưa so được với đối thủ:** bằng chứng hiện có chỉ có lời chê "quá nhiều lựa chọn" (M#2) và lời khen check-in nhanh của app C (M#31), không có số bước của bất kỳ app nào → §14.

**Chỉ số kích hoạt (giả thuyết, `product-plan` đặt mốc ở §7):** tỉ lệ người mở app lần đầu hoàn thành bài thở đầu tiên **trong cùng phiên**. Mẫu số là **tất cả** người mở lần đầu, không rút gọn về người đã bắt đầu bài. Đây mới là giả thuyết — làm hành động này đi cùng với việc ở lại, chưa chứng minh là nguyên nhân; xác nhận bằng nhóm người dùng sau ra mắt (market §5.3, đòn bẩy 3).

### 5.10 Kiểm chân dung bằng 1–2 người (khi bạn có dịp)
Hai chân dung trên là proto. Team không chạy phỏng vấn, nên cách kiểm là: **hỏi 1–2 người bạn gặp được** + **số sau ra mắt**. Hỏi về lần gần nhất **đã xảy ra**, không hỏi "bạn có muốn…".

1. Lần gần nhất bạn thấy căng giữa giờ làm là khi nào? Lúc đó bạn đã làm gì?
2. Việc đó mất bao lâu? Bạn làm ngay tại bàn hay phải đi chỗ khác?
3. Lúc đó có ai xung quanh không? Bạn có để ý đến chuyện người khác thấy mình đang làm gì không? *(kiểm JTBD-04 / I-2)*
4. Trên máy bạn có app kiểu này không? Lần cuối mở là bao giờ, và vì sao thôi không mở nữa? *(kiểm I-1 và PER-02)*
5. Lần cuối mở một app như thế, nó hiện ra một danh sách bài — bạn làm gì tiếp? *(kiểm BAN-01)*
6. Có app nào từng tự chọn hộ bạn một thứ (bài nhạc, bài tập, tin) không? Lần đó bạn để yên hay đổi sang cái khác? *(kiểm giả định "chấp nhận không được chọn bài")*
7. Lần gần nhất bạn trả tiền cho một app sức khoẻ, bạn biết giá từ lúc nào? *(kiểm JTBD-05)*

Ghi lại vào `docs/product/raw/hoi-nguoi-dung-<yyyy-mm-dd>.md`: người thuộc loại nào (không ghi tên), hoàn cảnh, câu trả lời nguyên văn, điều làm bạn bất ngờ. Hỏi riêng từng người, không hỏi trong nhóm — đây là chuyện sức khoẻ và tiền.

**1–2 người là tín hiệu, không phải kết luận:** đủ để mở một câu hỏi hoặc thêm một dòng bằng chứng `P#`, **không** đủ để bỏ nhãn GIẢ ĐỊNH. Nhãn chỉ bỏ khi có số sau ra mắt — xem §14.

## 6. Cạnh tranh và khác biệt
Năm app trong nhóm chia làm hai kiểu: app lâu năm (A, B) bán thư viện nội dung dài, thu nhiều tiền trên mỗi lượt tải (A 1,23 USD · B 1,56 USD sau phí store) nhưng bị chê "quá dài"; app mới (C, D, E) thắng nhờ ngắn và nhanh, tăng 12–55% trong 3 tháng nhưng kiếm tiền yếu (0,26–0,59 USD/lượt tải). Chỗ đứng của 2 Phút là ô còn trống giữa hai kiểu đó: **ngắn như C, bán như A**. Chi tiết bảng đối thủ, giá neo và khoảng trống: `docs/market/market-report.md` §4.

| Khác biệt (≤ 3) | Đối thủ đang yếu ở đâu | Khó sao chép vì |
|---|---|---|
| App chọn hộ đúng **một** bài theo tâm trạng vừa chạm, không có thư viện | Mới 1/5 app có tính năng gợi ý theo tâm trạng, và app đó thu tiền phần này (market §4.3); A và B bị chê đúng chỗ "quá dài, quá nhiều lựa chọn" (M#2, M#5) | A và B đang **bán chính cái thư viện**: bỏ thư viện là bỏ thứ đang mang về 1,23–1,56 USD/lượt tải (M#40, M#41). Họ có thể thêm chế độ "nhanh", nhưng không thể bỏ màn chọn |
| Vào thẳng check-in từ widget màn hình khoá trong ≤ 1,5 giây, không qua màn mở app | Không app nào trong 5 app dùng bề mặt này làm lối vào chính (market §2, §5.2) | Lối vào của đối thủ phải đi qua màn chủ có quảng bá nội dung và paywall — bỏ màn đó là bỏ chỗ bán hàng của họ. Dev mình đã đo 1,2 giây trên iPhone 11 (14/11/2026) |
| Dữ liệu tâm trạng nằm trên máy, không cần tài khoản | Người dùng lo dữ liệu tâm trạng bị chia sẻ (M#27–#29) nhưng không app nào trong 5 app bán riêng được điều này (market §5.1) | Đối thủ đã xây hệ tài khoản và đồng bộ; bỏ đi là phá hạ tầng và mất cả phần dữ liệu họ đang dùng để giữ người dùng |

→ **Rút ra:** cả ba khác biệt đều khó sao chép vì cùng một lý do — chúng đòi đối thủ **bỏ bớt** thứ họ đang kiếm tiền, không phải thêm tính năng. Điều này cũng có nghĩa khác biệt sẽ mất ngay nếu mình tự thêm thư viện vào sau — xem BAN-01.

## 7. Chỉ số — bản nháp
Chưa làm — `product-plan`.

## 8. Kiếm tiền — bản nháp
Chưa làm — `product-plan` quyết, `product-detail` chi tiết. Ràng buộc đã khoá ở bước này: thuê bao (D-07), giá neo dưới A/B 59,99–69,99 USD (market §4.5), không quảng cáo (BAN-06), không giới hạn lượt phần lõi (BAN-05), không mẫu tối (BAN-04).

## 9. Ràng buộc mobile
Chưa làm — `product-spec`. Đã khoá: iPhone, không iPad, không Android (D-06); iOS tối thiểu chờ Dev chốt (DQ-02).

# Phần B — Tính năng

## 10. Bảng tính năng
Chưa làm — `product-plan`. Tám hạng mục trong phạm vi ở §4 mới là **khả năng**, chưa được đánh mã FEAT và chưa có ưu tiên.

### Chi tiết từng tính năng
Chưa làm — `product-plan` (mức Đề xuất) → `product-spec` (Đủ để thiết kế) → `product-detail` (Đủ để build).

## 11. Danh sách màn
Chưa làm — `product-spec`.

## 12. Onboarding
Chưa làm — `product-spec` viết khung, `product-detail` viết từng màn.

# Phần C — Phiên bản

## 13. Lộ trình phiên bản
Chưa làm — `product-plan`. Mốc ngày đã khoá ở bước này: ra mắt 1.0.0 chậm nhất 02/01/2027, nộp App Review chậm nhất 19/12/2026 (D-05).

## 14. Rủi ro, giả định, câu hỏi mở
| Loại | Nội dung | Nếu sai / nếu xảy ra thì sao | Cách kiểm / giảm | Ai, hạn |
|---|---|---|---|---|
| Rủi ro | 8 tuần với 2 dev iOS và 1 designer chưa có ước giờ của Dev cho 8 hạng mục ở §4 | Trượt mốc 02/01/2027, hoặc phải cắt hạng mục 4 / 6 / 7 giữa chừng | Buổi kick-off của `product-plan` phải có ước giờ từng hạng mục trước khi chốt bản 1.0.0 | PO + 2 dev, trước 14/11/2026 |
| Rủi ro | Lịch nghỉ cuối năm của App Review chưa xác nhận; nộp 19/12/2026 có thể bị kéo dài thời gian duyệt (DQ-01) | Ra mắt trượt sang sau 02/01/2027 | Dev kiểm lịch App Store Connect năm nay, không lấy theo trí nhớ | Dev, trước 14/11/2026 |
| Câu hỏi mở | **DQ-02** — iOS tối thiểu và máy yếu nhất để đo (nội dung đầy đủ: requirements.md §8) | Ngưỡng hiệu năng ở §9 và mọi tiêu chí nghiệm thu phải viết lại | Dev trả lời kèm ngày và máy đo | Dev, trước 14/11/2026 |
| Câu hỏi mở | **DQ-03** — Dữ liệu tâm trạng trên máy: đổi máy thì đi đâu (market §5.4, T4) | Nếu mất sạch khi đổi máy thì lời hứa ở §6 thành điểm trừ, và BAN-02 phải xét lại | Dev trả lời; nếu không có cách thì app phải nói rõ trước khi người dùng ghi dữ liệu | Dev, trước 14/11/2026 |
| Câu hỏi mở | **DQ-04** — Luật chọn bài nằm trong app, sửa qua bản cập nhật, không cần server (market §5.4, T3) | Nếu phải có server thì đụng BAN-02 và cả mô hình không backend | Dev trả lời | Dev, trước 14/11/2026 |
| Câu hỏi mở | **DQ-05** — Nhắc 1 lần/ngày theo giờ tự chọn khi app chưa mở lần nào trong ngày | Vấn đề 2 mất cơ chế chính | Dev trả lời | Dev, trước 14/11/2026 |
| Giả định | CPI thật của dòng sức khoẻ tinh thần ở Mỹ chưa có — mốc 1,5–4 USD đang mượn của app tiện ích (M#52) | Nếu CPI thật thấp hơn nhiều thì kết luận "không mua quảng cáo" (D-07) có thể sai và cách vào thị trường đổi | Hỏi đội UA; đã nằm trong phiếu xin số liệu của market | PO, trước khi lên kế hoạch kéo người dùng cho 1.1.0 |
| Giả định | Tỉ lệ người tải trở thành người trả tiền 1,2% / 2,5% / 4,0% là suy từ mốc nội bộ team và từ app A (M#50, market §5.3) | Cả ba kịch bản "có lời không" đổi; mục tiêu ở §7 phải đặt lại | Đo số thật trong 30 ngày đầu sau ra mắt | PO + DA, 30 ngày sau ra mắt |
| Giả định | Toàn bộ số liệu thị trường là **DỮ LIỆU THỬ** (market ghi rõ ở đầu file) | Nếu dùng cho dự án thật thì mọi kết luận về quy mô, giá neo và đối thủ phải chạy lại | Thay bằng số thật trước khi chốt giá ở §8 | PO, trước `product-plan` |
| Giả định | Người dùng chấp nhận app không cho chọn bài — chưa có bằng chứng trực tiếp, mới có bằng chứng họ **ghét phải chọn** (M#1, M#2) | Nếu sai thì BAN-01 phải mở và cả định vị đổi | Câu hỏi 5 và 6 ở §5.10 khi hỏi được 1–2 người; chốt bằng % hoàn thành bài đầu ngay phiên đầu sau ra mắt. (Sửa 08/11/2026: bỏ phương án "5–8 phỏng vấn" — team không chạy phỏng vấn) | PO, khi có dịp hỏi; số sau ra mắt 30 ngày |
| Giả định | PER-01 và PER-02 là **proto** — dựng từ đánh giá store và diễn đàn, chưa nói chuyện với người dùng nào (§5) | Nếu PER-02 không tồn tại như một nhóm riêng thì hạng mục 5, 6, 7 ở §4 mất lý do; nếu PER-01 sai thì cả §2 và §4 phải viết lại | 7 câu hỏi ở §5.10 cho 1–2 người; bỏ nhãn GIẢ ĐỊNH chỉ khi có số sau ra mắt: % hoàn thành bài đầu ngay phiên đầu (PER-01) và số ngày check-in trong tuần đầu (PER-02) | PO, 30 ngày sau ra mắt |
| Giả định | JTBD-04 — người dùng muốn hạ căng **kín đáo** ở chỗ làm. Suy từ M#32, M#33 (cả hai cách tự xoay xở đều dùng công cụ trung tính), chưa có lời người dùng nào nói thẳng (I-2) | Nếu sai: bỏ ràng buộc kín đáo thì phần tiếng và giọng của bài thở, cùng câu chữ onboarding, thiết kế khác hẳn | Câu hỏi 3 ở §5.10 | PO, trước khi `product-spec` viết onboarding |
| Rủi ro | BAN-01 phục vụ đúng trạng thái **dùng** nhưng lấy mất lập luận bán hàng ở trạng thái **tải** (I-1), trong khi đường vào duy nhất là tìm kiếm store (D-07). App C đi hướng ngắn đã bị chê "ít nội dung sau 2 tuần" (M#20) | Người tải nhầm kỳ vọng → đánh giá 1 sao kiểu "ít nội dung" rơi đúng vào điểm yếu nhất của bản này; tỉ lệ tải → mở lần đầu thấp | Trang store và onboarding phải bán chính câu "2 phút, không phải chọn" (việc của ASO và `product-spec`); theo dõi tỉ lệ tải → mở lần đầu và đếm riêng đánh giá kiểu "ít nội dung" | PO kiêm ASO, 30 ngày sau ra mắt |
| Rủi ro | Toàn bộ thiết kế cho PER-02 nằm ở hạng mục 5, 6, 7 của §4 — đúng ba hạng mục D-02 cho phép hạ xuống P1 | Hạ cả ba thì bản 1.0.0 không còn gì cho PER-02 và nửa sau câu "phải chứng minh" (người dùng quay lại) không kiểm được | Ở kick-off, nếu phải hạ thì giữ lại ít nhất một trong ba và nói rõ bản 1.0.0 chỉ kiểm được nửa câu | PO + 2 dev, buổi kick-off trước 14/11/2026 |
| Câu hỏi mở | Không có số bước từ lúc mở app tới lúc làm xong bài của bất kỳ đối thủ nào — mới có lời chê "quá nhiều lựa chọn" (M#2) và lời khen check-in nhanh của app C (M#31) | Không biết 4 bước ở §5.9 có thật sự ngắn hơn đối thủ hay không — câu "ngắn hơn" không được dùng trên trang store khi chưa đếm | Tự tải A, C, E và đếm số bước tới lần hoàn thành đầu tiên (mỗi app một lần, ghi vào `docs/product/raw/`) | PO, trước khi `product-spec` viết onboarding |

## 15. Phụ lục

### Bằng chứng mới của bộ product
| Mã | Nhận định | Nguồn | Ngày | Độ tin |
|---|---|---|---|---|
| — | chưa có — `product-users` không thu thêm bằng chứng ngoài: không phỏng vấn, không khảo sát. Mọi nhận định ở §5 suy từ M#1–#52 của bộ market. Dòng `P#` đầu tiên sẽ xuất hiện khi bạn hỏi được 1–2 người (§5.10) hoặc khi có số sau ra mắt | — | — | — |

### Phương pháp đã dùng
| Phương pháp | Dùng ở mục | Để giải việc gì | Ra kết quả gì | Nguồn |
|---|---|---|---|---|
| Gom nhóm bằng chứng + đếm nguồn độc lập | §5.1 | Biết nhóm nỗi đau nào đủ mạnh để thành một chân dung riêng | 6 nhóm; 2 nhóm qua ngưỡng 25/35 → 2 persona | Cách làm của bộ market (§3, §5.1) |
| 5 Whys | §5.2 | Tìm gốc của việc người đang căng mở app rồi đóng | I-1: người **chọn** app ở trạng thái bình tĩnh nhưng **dùng** ở trạng thái căng | Bộ users §1 |
| Đối chiếu "nói" với "làm" | §5.2, empathy map PER-01 | Biết lời nào đáng tin khi thiết kế | Chênh giữa lời chê "quá dài" và 80,2% lượt tải vẫn về A, B → I-1 | Bộ users §5 |
| Empathy map | §5.4 (PER-01) | Dựng chân dung từ bằng chứng thay vì từ tưởng tượng | 6 ô đều có nguồn; ô "Nói" được ghi rõ là mỏng | Bộ users §3 |
| Mô hình tư duy Quá khứ / Hiện tại / Tương lai | §5.4 | Nối hành vi hôm nay với hạng mục ở §4 | 5 dòng, mỗi dòng trỏ về một hạng mục trong phạm vi | Bộ users §2 |
| JTBD "Khi … tôi muốn … để …" | §5.6 | Viết nhu cầu thành kết quả, không thành tính năng | 6 việc, trong đó 1 việc cảm xúc và 1 việc xã hội (giả định) | Bộ users §2 |
| Hành trình 5 giai đoạn + chỗ vỡ + khoảnh khắc sự thật | §5.8 | Tìm đúng một bước cần đổi | Chỗ vỡ ở "Lần đầu dùng"; một bước đổi = bỏ bước chọn | Bộ users §4 |
| Soát thiên lệch | §5.3 | Biết kết luận nào không được dùng | 5 dòng hạ độ tin, trong đó mẫu chỉ gồm người đã tải app | Bộ users §5 |
| Proto-persona + cách kiểm nhẹ | §5.4, §5.10, §14 | Dựng chân dung khi chưa nói chuyện với ai mà không giả vờ là đã có dữ liệu | 2 persona gắn nhãn GIẢ ĐỊNH + 7 câu hỏi + 2 số sau ra mắt để bỏ nhãn | Bộ users §5, BH-04 |

### Lần soát gần nhất
Chưa soát. Lần soát đầu tiên theo `product-standards/references/quality-gates.md` chạy ở cuối `product-spec`.

### Biên bản họp
Chưa có. Buổi đầu tiên là kick-off của `product-plan` (chốt ước giờ và ưu tiên).
