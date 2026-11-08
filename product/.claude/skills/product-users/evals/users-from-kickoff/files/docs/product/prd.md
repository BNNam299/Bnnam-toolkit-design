# PRD — 2 Phút (tên làm việc)

**Phiên bản tài liệu**: 0.1 · **Phiên bản app đang viết**: 1.0.0
**Cập nhật**: 07/11/2026 · **Người viết**: AI soạn, PO duyệt
**Trạng thái**: Đang khoá phạm vi bản 1.0.0 — mới xong bước định hình (product-kickoff)

> Nguồn thị trường là **DỮ LIỆU THỬ** (`docs/market/market-report.md` ghi rõ tên app và số liệu là giả). Mọi mã `M#…` trong tài liệu này trỏ về `docs/market/evidence.md`.

## 0. Đọc nhanh
- Đang làm: app iOS hạ căng thẳng 2 phút cho người đi làm 22–35 tuổi ở Mỹ; đang viết bản 1.0.0.
- Tình trạng: đã khoá phạm vi (8 hạng mục trong phạm vi, 8 điều cấm). Chưa có tính năng nào được đánh mã — bảng tính năng là việc của `product-plan`.
- Cần chốt: 5 câu hỏi cho Dev (DQ-01…DQ-05, xem §14) trước buổi kick-off; hạn: trước 14/11/2026.
- Bước tiếp: `product-users` — dựng chân dung người dùng và việc họ cần làm, điền §5.

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

## 5. Người dùng
Chưa làm — `product-users`.

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
| Giả định | Người dùng chấp nhận app không cho chọn bài — chưa có bằng chứng trực tiếp, mới có bằng chứng họ **ghét phải chọn** (M#1, M#2) | Nếu sai thì BAN-01 phải mở và cả định vị đổi | 5–8 phỏng vấn ngắn ở bước `product-users`, hoặc đo tỉ lệ làm xong bài đầu ngay phiên đầu sau ra mắt | PO, trong `product-users` |

## 15. Phụ lục

### Bằng chứng mới của bộ product
| Mã | Nhận định | Nguồn | Ngày | Độ tin |
|---|---|---|---|---|
| — | chưa có — bước này chỉ dùng bằng chứng M# của bộ market | — | — | — |

### Lần soát gần nhất
Chưa soát. Lần soát đầu tiên theo `product-standards/references/quality-gates.md` chạy ở cuối `product-spec`.

### Biên bản họp
Chưa có. Buổi đầu tiên là kick-off của `product-plan` (chốt ước giờ và ưu tiên).
