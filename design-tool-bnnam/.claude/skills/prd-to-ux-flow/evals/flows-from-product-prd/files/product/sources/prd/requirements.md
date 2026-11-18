# Yêu cầu chi tiết — Calm2

> DỮ LIỆU THỬ

**Đi kèm**: docs/product/prd.md · **Cập nhật**: 08/11/2026 · **Bản app đang viết**: 1.0.0

## 0. Đọc nhanh
- Phủ: 6 tính năng · 9 tình huống (UC) · 21 yêu cầu (FR) · 79 tiêu chí nghiệm thu (AC — 30 dòng [Lead kiểm], 49 dòng [Dev kiểm]) · 16 yêu cầu chất lượng (NFR) · 7 công thức (BR) · 1 quyền (PRM) · 5 nhóm dữ liệu (DATA) · 26 sự kiện đo (EVT).
- Còn hở: không — mỗi tính năng có ít nhất một UC, mỗi UC có ít nhất một FR, mỗi FR có ít nhất một AC đo được.
- Chờ Dev: 10 câu hỏi (DQ-01…DQ-10), trong đó DQ-02, DQ-04, DQ-06, DQ-07 cần trả lời **trước khi thiết kế**.
- Thuật ngữ dùng trong file này: **UC** tình huống sử dụng · **FR** yêu cầu chức năng · **AC** tiêu chí nghiệm thu (câu trả lời đạt / không đạt) · **NFR** yêu cầu chất lượng · **BR** công thức nghiệp vụ · **paywall** màn mời trả tiền · **dùng thử** dùng miễn phí trước khi bị trừ tiền · **khôi phục mua hàng** lấy lại gói đã mua khi đổi máy hoặc cài lại.

## 1. Tình huống sử dụng (UC)

### UC-001 · Check-in một chạm từ widget · FEAT-01
- Là người đi làm đang căng thẳng giữa hai cuộc họp, tôi muốn nói cho app biết mình đang thấy thế nào bằng một chạm, để nhận ngay một việc làm trong 2 phút mà không phải mở app rồi chọn.
- Điều kiện trước: app đã cài, widget đã đặt trên màn hình chính hoặc màn khoá.
- Luồng chính: 1. Người dùng chạm một trong 4 ô tâm trạng trên widget. 2. App mở và vào thẳng màn bài 2 phút với bài đã chọn sẵn. 3. Lần chạm được ghi lại là một check-in. 4. Người dùng làm bài hoặc rời đi.
- Luồng thay thế: AF-001.1 khi người dùng chưa qua onboarding → app mở màn chào, giữ tâm trạng vừa chạm để dùng lại ở bước chọn tâm trạng, không bắt chọn lại. AF-001.2 khi người dùng chạm nhiều ô trong vòng 60 giây → app dùng lần chạm cuối, các lần trước không tính là check-in (BR-02).
- Luồng ngoại lệ: EX-001.1 khi app bị hệ thống dừng từ trước → app mở lạnh rồi vẫn vào đúng màn bài với tâm trạng vừa chạm; nếu quá 1,5 giây thì hiện vòng chờ, không hiện màn trắng. EX-001.2 khi người dùng chưa đặt widget → không có luồng này; app mời đặt widget một lần ở màn xong bài sau bài đầu tiên, bỏ qua được, và không mời lại.
- Kết quả sau cùng: một check-in được ghi, người dùng đang ở màn bài 2 phút.

### UC-002 · Làm bài 2 phút theo tâm trạng · FEAT-02
- Là người đang căng thẳng, tôi muốn app đưa cho tôi đúng một việc để làm, để tôi không phải quyết định gì thêm khi đang không nghĩ được.
- Điều kiện trước: người dùng vừa chọn một tâm trạng (từ widget hoặc từ màn chính).
- Luồng chính: 1. App chọn đúng một bài theo tâm trạng (BR-01). 2. Người dùng bấm "Bắt đầu". 3. Bài chạy 120 giây bằng hình thở và tiếng dẫn. 4. Hết bài, app ghi nhận hoàn thành và cộng chuỗi ngày (BR-03). 5. Người dùng xem màn xong bài.
- Luồng thay thế: AF-002.1 khi bài được chọn nằm ngoài 3 bài thở miễn phí và người dùng chưa trả tiền → mở paywall trước khi bài chạy; đóng paywall thì app đưa về bài thở miễn phí gần nhất, không bỏ người dùng ở màn trống. AF-002.2 khi máy đang im lặng hoặc âm lượng bằng 0 → bài vẫn chạy bằng hình, kèm một dòng mời bật âm lượng; người dùng không bị chặn. AF-002.3 khi tâm trạng vừa chọn là mức xấu nhất trong 4 mức → màn xong bài có thêm một dòng tĩnh dẫn sang màn tài nguyên hỗ trợ; dòng này không tự mở và không chặn luồng (D-11).
- Luồng ngoại lệ: EX-002.1 khi người dùng thoát giữa bài → hỏi "Dừng bài?"; chọn Tiếp tục thì về đúng giây đang dở, chọn Dừng thì về màn chính và check-in vẫn được giữ nhưng không tính là hoàn thành. EX-002.2 khi có cuộc gọi đến hoặc app bị đẩy xuống nền → bài tạm dừng; mở lại thì hỏi "Tiếp tục từ giây thứ n?" với hai lựa chọn Tiếp / Bắt đầu lại. EX-002.3 khi người dùng rút tai nghe → xử như EX-002.2.
- Kết quả sau cùng: một bài được ghi là hoàn thành hoặc bỏ dở; người dùng ở màn xong bài hoặc màn chính.

### UC-003 · Xem biểu đồ tâm trạng tuần · FEAT-03
- Là người đã dùng app vài ngày, tôi muốn thấy tuần này mình thế nào, để biết việc này có đáng giữ không.
- Điều kiện trước: app đã mở ít nhất một lần.
- Luồng chính: 1. Người dùng chạm "Tuần này" ở màn chính. 2. App hiện biểu đồ 7 ngày gần nhất và chuỗi ngày. 3. Ngày không có check-in để trống. 4. Người dùng quay lại màn chính.
- Luồng thay thế: AF-003.1 khi chưa có check-in nào → hiện trạng thái trống kèm nút "Check-in bây giờ" dẫn về màn chính; không hiện biểu đồ rỗng không giải thích. AF-003.2 khi mới có 1–2 ngày dữ liệu → vẫn vẽ, kèm dòng "cần thêm n ngày để thấy xu hướng". AF-003.3 khi người dùng chưa trả tiền và chạm phần lịch sử quá 7 ngày → mở paywall; đóng thì về đúng biểu đồ 7 ngày đang xem.
- Luồng ngoại lệ: EX-003.1 khi người dùng đổi múi giờ → ngày của mỗi check-in giữ nguyên theo giờ máy lúc check-in, app không tính lại và không dồn cột (BR-04).
- Kết quả sau cùng: người dùng đã xem được 7 ngày gần nhất, hoặc đang ở paywall, hoặc ở trạng thái trống có lối đi tiếp.

### UC-004 · Lần đầu mở app và tới bài đầu tiên · FEAT-04
- Là người vừa cài app, tôi muốn dùng được ngay mà không phải khai báo gì, để biết app có giúp được mình không trước khi quyết định bất cứ điều gì.
- Điều kiện trước: app vừa được cài, chưa mở lần nào.
- Luồng chính: 1. Màn chào nói app làm gì, nói lịch sử tâm trạng nằm trên máy và đổi máy sẽ không mang theo, nói app không thay thế chăm sóc chuyên môn. 2. Người dùng chọn một trong 4 tâm trạng. 3. Bài 2 phút chạy ngay. 4. Màn xong bài. 5. App mời bật nhắc. 6. App mở paywall. 7. Người dùng vào màn chính.
- Luồng thay thế: AF-004.1 khi người dùng vào từ widget → tâm trạng đã chạm được giữ lại, bước 2 hiện sẵn lựa chọn đó. AF-004.2 khi người dùng dừng giữa bài ở bước 3 → bỏ qua bước 5 và bước 6, đưa thẳng về màn chính; app không mời trả tiền khi người dùng chưa thấy giá trị.
- Luồng ngoại lệ: EX-004.1 khi app bị tắt giữa onboarding → mở lại thì vào lại từ bước đang dở, không bắt làm lại từ đầu. EX-004.2 khi không lấy được giá từ store ở bước 6 → hiện màn "chưa lấy được giá · Thử lại", nút đóng vẫn dùng được, người dùng vẫn vào được màn chính.
- Kết quả sau cùng: người dùng ở màn chính, đã hoàn thành hoặc bỏ dở bài đầu tiên; app chưa thu một dữ liệu khai báo nào.

### UC-005 · Bắt đầu dùng thử và mua gói · FEAT-04
- Là người vừa thấy app có ích, tôi muốn biết rõ mình sẽ bị trừ bao nhiêu và khi nào trước khi bấm, để không bị trừ tiền bất ngờ như app khác (M#11).
- Điều kiện trước: paywall đang mở; đã lấy được giá từ store.
- Luồng chính: 1. Người dùng đọc được gì, giá, chu kỳ, "dùng thử 3 ngày rồi tự gia hạn cho tới khi huỷ", ngày hết dùng thử, cách huỷ. 2. Người dùng chọn gói. 3. Hộp thanh toán của hệ thống mở. 4. Mua xong, app mở khoá ngay. 5. Cài đặt hiện trạng thái gói và ngày hết dùng thử.
- Luồng thay thế: AF-005.1 khi người dùng chọn gói tuần → không có dùng thử; chữ trên nút nói đúng việc nút làm, không viết "Tiếp tục". AF-005.2 khi người dùng đóng paywall → về màn trước, dùng bản miễn phí, paywall không hiện lại trong phiên này.
- Luồng ngoại lệ: EX-005.1 mua thất bại → paywall giữ nguyên, hiện lý do từ hệ thống và nút "Thử lại"; không đổ lỗi cho người dùng. EX-005.2 mua đang chờ duyệt (Ask to Buy) → màn "đang chờ duyệt", app dùng bản miễn phí, tự mở khoá khi được duyệt kể cả khi app đang đóng. EX-005.3 người dùng tự huỷ hộp thanh toán → về paywall nguyên trạng, không hiện thêm lời mời nào. EX-005.4 người dùng đã có gói mà paywall vẫn mở → chỉ hiện trạng thái gói và lối huỷ, không mời mua lần nữa.
- Kết quả sau cùng: người dùng đang dùng thử, đã trả tiền, đang chờ duyệt, hoặc vẫn dùng bản miễn phí — và biết mình đang ở trạng thái nào.

### UC-006 · Khôi phục mua hàng trên máy mới · FEAT-04
- Là người đã trả tiền rồi đổi máy, tôi muốn lấy lại gói đã mua mà không phải trả lần nữa.
- Điều kiện trước: app đã cài trên máy mới, đăng nhập Apple ID đã từng mua.
- Luồng chính: 1. Người dùng chạm "Khôi phục mua hàng" trên paywall hoặc trong Cài đặt. 2. App hỏi store. 3. Tìm thấy gói → mở khoá, hiện báo ngắn "đã khôi phục gói".
- Luồng thay thế: AF-006.1 không tìm thấy gói nào → hiện "không thấy gói nào trên Apple ID này" kèm lối quay lại paywall; đây không phải lỗi và không hiện biểu tượng lỗi.
- Luồng ngoại lệ: EX-006.1 mất mạng → hiện "chưa hỏi được store · Thử lại"; không coi là không có gói và không khoá thêm gì. EX-006.2 gói đã hết hạn → mở khoá không thành công, hiện trạng thái "đã hết hạn" kèm lối mua lại.
- Kết quả sau cùng: gói được mở khoá, hoặc người dùng biết rõ vì sao chưa mở khoá và làm gì tiếp.

### UC-007 · Bật và nhận lời nhắc hằng ngày · FEAT-05
- Là người hay quên dùng sau tuần đầu, tôi muốn được nhắc một lần mỗi ngày, để giữ được thói quen 2 phút.
- Điều kiện trước: người dùng vừa hoàn thành bài đầu tiên.
- Luồng chính: 1. App giải thích sẽ nhắc gì, mấy lần một ngày, đổi được ở đâu. 2. Người dùng chọn "Bật nhắc". 3. Hộp quyền của hệ thống hiện. 4. Người dùng đồng ý. 5. App đặt lời nhắc 1 lần/ngày lúc 15:00 giờ máy. 6. Hôm sau, nếu chưa check-in, người dùng nhận một thông báo và chạm vào để vào thẳng màn bài.
- Luồng thay thế: AF-007.1 người dùng chọn "Để sau" → app đi tiếp, không hỏi lại trong 7 ngày và tối đa 2 lần trong đời app. AF-007.2 hôm đó người dùng đã check-in → không gửi thông báo. AF-007.3 người dùng không mở app 3 ngày → một thông báo khơi lại, tối đa 1 lần mỗi 3 ngày.
- Luồng ngoại lệ: EX-007.1 người dùng từ chối quyền → app đi tiếp và dùng được đủ mọi tính năng; thay lời nhắc bằng dòng chuỗi ngày ở màn chính; app không hỏi lại. EX-007.2 người dùng từ chối vĩnh viễn → Cài đặt hiện "Thông báo đang tắt" kèm nút mở Cài đặt máy; app không hỏi lại lần nào. EX-007.3 người dùng tắt nhắc trong Cài đặt app → dừng gửi, giữ nguyên dữ liệu và chuỗi ngày.
- Kết quả sau cùng: lời nhắc đang bật hoặc đang tắt, và trong cả hai trường hợp người dùng vẫn dùng được đủ app.

### UC-008 · Được mời đánh giá và gửi góp ý · FEAT-06
- Là người thấy app có ích, tôi muốn nói ra điều đó mà không bị chen ngang giữa lúc đang cần app.
- Điều kiện trước: người dùng vừa hoàn thành bài thứ 3 trở lên.
- Luồng chính: 1. Ở màn xong bài, app gọi API đánh giá của Apple (BR-06). 2. Hệ thống tự quyết định có hiện hộp hay không. 3. App không đổi màn theo kết quả và không biết người dùng đã chọn gì.
- Luồng thay thế: AF-008.1 người dùng muốn góp ý bất cứ lúc nào → Cài đặt → "Gửi góp ý" → soạn thư; mục này luôn có, không gắn với bước 1. AF-008.2 chưa đủ 3 bài hoặc đã gọi API trong 120 ngày → app không gọi, không làm gì.
- Luồng ngoại lệ: EX-008.1 hệ thống không hiện hộp → app không làm gì và không gọi lại trong phiên. EX-008.2 máy không có ứng dụng thư → màn góp ý hiện địa chỉ thư kèm nút sao chép.
- Kết quả sau cùng: người dùng được mời đánh giá đúng một lần trong 120 ngày qua đường của hệ thống, hoặc tự gửi góp ý khi muốn.

### UC-009 · Xoá toàn bộ dữ liệu · FEAT-03
- Là người lo dữ liệu tâm trạng của mình (M#27–M#29), tôi muốn xoá sạch mọi thứ app đang giữ, để không phải gỡ app mới yên tâm.
- Điều kiện trước: app có ít nhất một check-in.
- Luồng chính: 1. Cài đặt → "Xoá toàn bộ dữ liệu". 2. Hộp xác nhận nói rõ xoá cái gì và không lấy lại được. 3. Người dùng xác nhận. 4. App xoá lịch sử check-in và chuỗi ngày, về trạng thái trống.
- Luồng thay thế: AF-009.1 người dùng huỷ ở bước 3 → không xoá gì, về Cài đặt.
- Luồng ngoại lệ: EX-009.1 người dùng đang có gói trả phí → gói không bị xoá; hộp xác nhận nói rõ điều đó để người dùng không sợ mất gói.
- Kết quả sau cùng: dữ liệu tâm trạng đã xoá hết trên máy, trạng thái gói giữ nguyên.

## 2. Yêu cầu chức năng (FR) và tiêu chí nghiệm thu

### FR-001 · App phải mở thẳng màn bài 2 phút khi người dùng chạm một ô tâm trạng trên widget · UC-001 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: PER-01 đang căng thẳng, mỗi bước thêm là một chỗ bỏ cuộc (M#1, M#2).
- Người dùng nhận được gì · đo hiệu quả bằng: vào được việc chính sau đúng một chạm · `checkin_started` có thuộc tính nguồn = widget.
- Màn: SCR-01, SCR-04
- Tiêu chí nghiệm thu:
  - AC-001.1 · [Dev kiểm] Given app đã qua onboarding và đang không chạy, When người dùng chạm ô tâm trạng trên widget màn hình chính, Then màn bài 2 phút hiện và sẵn sàng bấm "Bắt đầu" trong ≤ 1,5 giây trên iPhone 11, iOS 17.
  - AC-001.2 · [Dev kiểm] Given như trên nhưng quá 1,5 giây, When màn chưa vẽ xong, Then app hiện vòng chờ trên nền của màn bài, không hiện màn trắng và không hiện màn chính rồi mới chuyển.
  - AC-001.3 · [Dev kiểm] Given người dùng chưa qua onboarding, When chạm ô tâm trạng trên widget, Then app mở màn chào, và ở bước chọn tâm trạng ô vừa chạm đã được chọn sẵn.
  - AC-001.4 · [Lead kiểm] Given widget trên màn khoá, When nhìn ở cỡ chữ hệ thống lớn nhất, Then cả 4 ô tâm trạng vẫn đọc được và vùng chạm mỗi ô ≥ 44pt.

### FR-002 · App phải ghi lại mỗi lần chọn tâm trạng là một check-in, kể cả khi bài không được làm xong · UC-001 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: biểu đồ tuần mất nghĩa nếu chỉ đếm bài hoàn thành — người dùng vẫn đã nói ra tâm trạng.
- Người dùng nhận được gì · đo hiệu quả bằng: biểu đồ phản ánh đúng số lần họ mở lòng · `checkin_started`.
- Màn: SCR-01, SCR-06, SCR-07
- Tiêu chí nghiệm thu:
  - AC-002.1 · [Dev kiểm] Given người dùng chạm ô tâm trạng rồi đóng app ngay trước khi bấm "Bắt đầu", When mở biểu đồ tuần, Then ngày hôm đó có một điểm tâm trạng.
  - AC-002.2 · [Dev kiểm] Given người dùng chạm 3 ô khác nhau trong 40 giây, When mở biểu đồ tuần, Then chỉ có một điểm, lấy theo lần chạm cuối (BR-02).
  - AC-002.3 · [Dev kiểm] Given người dùng chạm ô tâm trạng lúc 23:58 và một ô khác lúc 00:03 hôm sau (giờ máy), When mở biểu đồ, Then có hai điểm ở hai ngày khác nhau (BR-04).

### FR-003 · App phải chọn đúng một bài theo tâm trạng, không hiện danh sách để chọn · UC-002 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: người đang căng không chọn nổi (M#1, M#2); đây là điểm khác biệt chính (market §4.3) và là BAN-02.
- Người dùng nhận được gì · đo hiệu quả bằng: không phải quyết định gì thêm · tỉ lệ `session_started` / `checkin_started`.
- Màn: SCR-04
- Tiêu chí nghiệm thu:
  - AC-003.1 · [Dev kiểm] Given tâm trạng X được chọn, When màn bài mở, Then đúng một bài được hiện và bài đó nằm trong nhóm bài gắn với X theo BR-01.
  - AC-003.2 · [Dev kiểm] Given người dùng chọn cùng một tâm trạng hai lần liên tiếp trong cùng một ngày, When màn bài mở lần thứ hai, Then bài được hiện khác bài lần thứ nhất nếu nhóm đó có từ 2 bài trở lên (BR-01).
  - AC-003.3 · [Lead kiểm] Given bất kỳ màn nào của app, When soát toàn bộ màn kể cả lớp ẩn trong Figma, Then không có màn nào liệt kê nhiều bài cho người dùng chọn (BAN-02).

### FR-004 · App phải chạy bài 120 giây bằng hình thở và tiếng dẫn, không dùng rung theo nhịp · UC-002 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: Dev đo rung theo nhịp bị hệ thống cắt sau khoảng 30 giây (Dev, 14/11/2026) — nếu giữ thì bài hỏng giữa chừng.
- Người dùng nhận được gì · đo hiệu quả bằng: một bài chạy trọn vẹn · `session_completed` / `session_started`.
- Màn: SCR-04
- Tiêu chí nghiệm thu:
  - AC-004.1 · [Dev kiểm] Given người dùng bấm "Bắt đầu", When bài chạy, Then hình thở và tiếng dẫn chạy liên tục 120 giây ± 1 giây trên iPhone 11 và kết thúc ở màn xong bài.
  - AC-004.2 · [Lead kiểm] Given máy đang ở chế độ im lặng hoặc âm lượng 0, When bài chạy, Then bài vẫn chạy bằng hình và một dòng mời bật âm lượng hiện ở màn bài; không có hộp thoại nào chặn.
  - AC-004.3 · [Lead kiểm] Given người dùng đã tắt hiệu ứng chuyển động trong Cài đặt máy, When bài chạy, Then nhịp thở vẫn theo được bằng chữ đếm, không chỉ dựa vào hình chuyển động (NFR-08).
  - AC-004.4 · [Lead kiểm] Given cỡ chữ hệ thống lớn nhất và chế độ tối, When mở màn bài, Then không có chữ bị cắt và không có thành phần chồng lên nhau.

### FR-005 · App phải cho dừng, tạm dừng và tiếp tục bài mà không mất chỗ đang dở · UC-002 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: PER-01 làm bài giữa giờ làm, cuộc gọi và việc chen ngang là bình thường.
- Người dùng nhận được gì · đo hiệu quả bằng: không phải bắt đầu lại từ đầu · `session_resumed`.
- Màn: SCR-04, SCR-20, SCR-21
- Tiêu chí nghiệm thu:
  - AC-005.1 · [Lead kiểm] Given bài đang chạy ở giây thứ 45, When người dùng vuốt ra hoặc bấm đóng, Then hộp "Dừng bài?" hiện với hai lựa chọn Tiếp tục và Dừng, không tự dừng.
  - AC-005.2 · [Dev kiểm] Given hộp "Dừng bài?" đang hiện, When người dùng chọn Tiếp tục, Then bài chạy tiếp từ giây thứ 45, không về 0.
  - AC-005.3 · [Dev kiểm] Given bài đang chạy ở giây thứ 45, When có cuộc gọi đến rồi người dùng quay lại app trong vòng 10 phút, Then app hỏi "Tiếp tục từ giây thứ 45?" với hai lựa chọn Tiếp và Bắt đầu lại.
  - AC-005.4 · [Dev kiểm] Given bài bị dừng ở giây thứ 45, When người dùng chọn Dừng, Then check-in của lần đó vẫn nằm trong biểu đồ tuần nhưng không tính vào chuỗi ngày (BR-03).

### FR-006 · App phải khoá bài nằm ngoài 3 bài thở miễn phí khi người dùng chưa trả tiền, và luôn đưa người dùng về một bài dùng được · UC-002 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: bán chiều sâu nội dung mà không khoá việc chính (§8); người đang căng không được bỏ ở màn trống.
- Người dùng nhận được gì · đo hiệu quả bằng: luôn có việc làm ngay cả khi không trả tiền · `paywall_viewed` có thuộc tính điểm chạm = bài khoá.
- Màn: SCR-04, SCR-08
- Tiêu chí nghiệm thu:
  - AC-006.1 · [Dev kiểm] Given người dùng chưa trả tiền và bài được chọn nằm ngoài 3 bài thở miễn phí, When màn bài sắp mở, Then paywall mở trước và bài không chạy (BR-05).
  - AC-006.2 · [Dev kiểm] Given paywall mở từ tình huống trên, When người dùng đóng paywall, Then app mở bài thở miễn phí gần nhất của tâm trạng đó và bài chạy được; người dùng không bị trả về màn trống.
  - AC-006.3 · [Dev kiểm] Given bài miễn phí đang chạy, When người dùng chưa trả tiền, Then không có paywall nào hiện cho tới khi bài kết thúc.

### FR-007 · App phải hiện biểu đồ 7 ngày gần nhất, và hiện trạng thái trống có lối đi tiếp khi chưa có dữ liệu · UC-003 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: cho người dùng thứ họ bỏ vào app, để có lý do quay lại (M#17–M#22).
- Người dùng nhận được gì · đo hiệu quả bằng: thấy được mình có đang giữ được thói quen không · `chart_viewed`.
- Màn: SCR-07, SCR-14
- Tiêu chí nghiệm thu:
  - AC-007.1 · [Lead kiểm] Given có check-in ở 3 trong 7 ngày gần nhất, When mở biểu đồ, Then 3 ngày đó có điểm và 4 ngày còn lại để trống — không nối liền, không vẽ điểm 0.
  - AC-007.2 · [Lead kiểm] Given chưa có check-in nào, When mở biểu đồ, Then hiện trạng thái trống có một câu giải thích và nút "Check-in bây giờ" dẫn về màn chính.
  - AC-007.3 · [Lead kiểm] Given chỉ có 1 ngày dữ liệu, When mở biểu đồ, Then biểu đồ vẫn hiện kèm dòng "cần thêm 6 ngày để thấy xu hướng".
  - AC-007.4 · [Dev kiểm] Given người dùng bay từ New York sang Tokyo giữa tuần, When mở biểu đồ, Then các check-in cũ vẫn nằm đúng ngày đã ghi, không dồn cột và không mất cột (BR-04).

### FR-008 · App phải khoá phần lịch sử dài hơn 7 ngày khi người dùng chưa trả tiền, và nói rõ đang khoá cái gì trước khi người dùng chạm · UC-003 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: bán chiều sâu lịch sử (§8) mà không gài người dùng chạm nhầm vào paywall.
- Người dùng nhận được gì · đo hiệu quả bằng: biết mình đang bỏ lỡ gì trước khi bấm · `paywall_viewed` có thuộc tính điểm chạm = lịch sử khoá.
- Màn: SCR-07, SCR-08
- Tiêu chí nghiệm thu:
  - AC-008.1 · [Lead kiểm] Given người dùng chưa trả tiền, When mở biểu đồ, Then phần quá 7 ngày hiện dòng nói rõ nội dung bị khoá (toàn bộ lịch sử và xu hướng tháng) trước khi người dùng chạm vào.
  - AC-008.2 · [Dev kiểm] Given người dùng chạm phần khoá rồi đóng paywall, When paywall đóng, Then app về đúng biểu đồ 7 ngày đang xem, không về màn chính.
  - AC-008.3 · [Dev kiểm] Given người dùng đang dùng thử và có 40 ngày dữ liệu, When mở biểu đồ, Then cả 40 ngày và xu hướng tháng đều hiện, và không có dòng khoá nào trên màn.

### FR-009 · App phải đưa người dùng mới tới bài 2 phút đầu tiên trong 3 bước và không thu dữ liệu khai báo nào · UC-004 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: mỗi màn hỏi thêm là một chỗ rơi; app không có tài khoản (BAN-01) và chỉ được thu dữ liệu tối thiểu (Apple 5.1.1(iii)).
- Người dùng nhận được gì · đo hiệu quả bằng: tới khoảnh khắc thấy app có ích ngay phiên đầu · chỉ số "đạt aha phiên đầu" ở §7.
- Màn: SCR-02, SCR-03, SCR-04, SCR-05, SCR-10, SCR-08
- Tiêu chí nghiệm thu:
  - AC-009.1 · [Lead kiểm] Given app vừa cài, When người dùng mở lần đầu, Then đếm được đúng 3 bước từ màn chào tới lúc bài bắt đầu chạy, và không bước nào hỏi tên, tuổi, mục tiêu, nghề nghiệp hay thư điện tử.
  - AC-009.2 · [Lead kiểm] Given màn chào, When đọc màn đó, Then có đủ: app làm gì · lịch sử tâm trạng nằm trên máy và đổi máy sẽ không mang theo · app không thay thế chăm sóc chuyên môn.
  - AC-009.3 · [Dev kiểm] Given người dùng dừng giữa bài đầu tiên, When bài dừng, Then app về màn chính và không hiện màn mời bật nhắc lẫn paywall trong phiên đó.
  - AC-009.4 · [Dev kiểm] Given paywall đã hiện một lần trong phiên và người dùng đã đóng, When người dùng tiếp tục dùng app trong cùng phiên, Then paywall không tự mở lại; chỉ còn lối vào từ Cài đặt.
  - AC-009.5 · [Dev kiểm] Given app bị tắt khi đang ở bước chọn tâm trạng, When mở lại, Then app vào lại đúng bước đó, không bắt xem lại màn chào.

### FR-010 · Paywall phải hiện đủ giá, chu kỳ, cách tự gia hạn, ngày hết dùng thử, cách huỷ, Điều khoản, Chính sách riêng tư, Khôi phục mua hàng và nút đóng — trên một màn · UC-005 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: người dùng chê app B trừ tiền bất ngờ (M#11); đây là mục "không được cắt" ở §4 và là checklist bắt buộc trước khi nộp (Apple 3.1.2(c), 5.1.1(i), 5.6).
- Người dùng nhận được gì · đo hiệu quả bằng: biết mình sẽ bị trừ bao nhiêu và khi nào · chỉ số rào chắn "huỷ dùng thử ngày 1" ở §7.
- Màn: SCR-08
- Tiêu chí nghiệm thu:
  - AC-010.1 · [Lead kiểm] Given paywall mở trên iPhone 11 ở cỡ chữ hệ thống mặc định, When nhìn màn đầu tiên mà không cuộn, Then thấy đủ 9 thứ: được gì khi trả tiền · 39,99 USD/năm · "dùng thử 3 ngày, sau đó tự gia hạn cho tới khi huỷ" · ngày hết dùng thử · cách huỷ · 4,99 USD/tuần · Điều khoản · Chính sách riêng tư · Khôi phục mua hàng; và nút đóng nhìn thấy được.
  - AC-010.2 · [Lead kiểm] Given paywall mở, When đọc chữ trên các nút, Then nút bắt đầu dùng thử ghi đúng việc nó làm ("Bắt đầu dùng thử 3 ngày"), và không nút nào trên màn này ghi "Tiếp tục".
  - AC-010.3 · [Lead kiểm] Given màn trước paywall là màn mời bật nhắc, When so vị trí nút, Then nút mua trên paywall không nằm đúng chỗ nút "Bật nhắc" của màn trước.
  - AC-010.4 · [Lead kiểm] Given toàn bộ màn trong Figma kể cả lớp ẩn, When soát giá, Then mọi chỗ ghi giá đều khớp bảng giá ở prd.md §8, và không có chữ của Google Play trên màn iOS.
  - AC-010.5 · [Lead kiểm] Given paywall mở, When soát chữ, Then không có đồng hồ đếm ngược giả, không có câu "#1" hay "tốt nhất", không có số người dùng không kiểm chứng được, và không có từ "chữa", "điều trị", "giảm trầm cảm" (BAN-03).
  - AC-010.6 · [Dev kiểm] Given máy đang mất mạng, When mở paywall, Then hiện màn "chưa lấy được giá · Thử lại" và nút đóng vẫn bấm được; app không hiện giá lưu sẵn từ lần trước.

### FR-011 · App phải xử lý đủ bốn kết quả của hộp thanh toán và cho người dùng biết đang ở trạng thái nào · UC-005 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: người dùng không biết mình đã mua hay chưa là nguồn review xấu và yêu cầu hoàn tiền (Apple 5.6).
- Người dùng nhận được gì · đo hiệu quả bằng: luôn biết trạng thái của mình · `purchase_succeeded`, `purchase_failed`, `purchase_pending`, `purchase_cancelled`.
- Màn: SCR-08, SCR-16, SCR-18
- Tiêu chí nghiệm thu:
  - AC-011.1 · [Dev kiểm] Given mua thành công, When hộp thanh toán đóng, Then app mở khoá trong ≤ 2 giây mà không cần khởi động lại, và Cài đặt hiện gói cùng ngày hết dùng thử.
  - AC-011.2 · [Dev kiểm] Given mua thất bại, When hộp thanh toán đóng, Then paywall giữ nguyên, hiện lý do từ hệ thống và nút "Thử lại"; không có chữ đổ lỗi cho người dùng.
  - AC-011.3 · [Dev kiểm] Given mua đang chờ duyệt (Ask to Buy), When hộp thanh toán đóng, Then app hiện màn "đang chờ duyệt", vẫn dùng bản miễn phí, và tự mở khoá khi được duyệt kể cả khi app đã bị đóng rồi mở lại.
  - AC-011.4 · [Dev kiểm] Given người dùng tự huỷ hộp thanh toán, When hộp đóng, Then về paywall nguyên trạng, không hiện thêm lời mời, không hiện gói hạ giá (D-12).

### FR-012 · App phải có khôi phục mua hàng ở cả paywall và Cài đặt, và nói rõ kết quả · UC-006 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: bắt buộc của store (Apple 3.1.1) và là mục "không được cắt" ở §4.
- Người dùng nhận được gì · đo hiệu quả bằng: lấy lại gói đã mua khi đổi máy · `purchase_restored`.
- Màn: SCR-08, SCR-09, SCR-17, SCR-23
- Tiêu chí nghiệm thu:
  - AC-012.1 · [Dev kiểm] Given Apple ID đã mua gói và app vừa cài trên máy mới, When chạm "Khôi phục mua hàng", Then gói mở khoá và báo ngắn "đã khôi phục gói" hiện.
  - AC-012.2 · [Lead kiểm] Given Apple ID chưa từng mua, When chạm "Khôi phục mua hàng", Then hiện "không thấy gói nào trên Apple ID này" kèm lối quay lại paywall, không hiện biểu tượng lỗi và không có chữ "thất bại".
  - AC-012.3 · [Dev kiểm] Given máy đang mất mạng, When chạm "Khôi phục mua hàng", Then hiện "chưa hỏi được store · Thử lại" và trạng thái gói hiện tại không bị đổi.

### FR-013 · Cài đặt phải hiện trạng thái gói, ngày hết dùng thử và lối huỷ · UC-005 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: người dùng phải biết cách dừng trả tiền mà không phải đi tìm (Apple 5.6); và khi không bật thông báo thì đây là chỗ duy nhất thấy ngày hết dùng thử.
- Người dùng nhận được gì · đo hiệu quả bằng: dừng được bất cứ lúc nào · `settings_subscription_viewed`.
- Màn: SCR-09, SCR-18
- Tiêu chí nghiệm thu:
  - AC-013.1 · [Lead kiểm] Given người dùng đang dùng thử, When mở Cài đặt, Then thấy tên gói, ngày hết dùng thử dạng ngày cụ thể, số tiền sẽ bị trừ, và một lối "Quản lý gói" dẫn sang chỗ huỷ của hệ thống.
  - AC-013.2 · [Dev kiểm] Given người dùng chưa trả tiền, When mở Cài đặt, Then thấy "Đang dùng bản miễn phí" kèm lối mở paywall; không hiện ngày hết dùng thử nào.
  - AC-013.3 · [Dev kiểm] Given gói đã hết hạn, When mở Cài đặt, Then thấy "Đã hết hạn" kèm lối mua lại, và các phần trả phí quay về trạng thái khoá.
  - AC-013.4 · [Dev kiểm] Given người dùng đang dùng thử và còn 1 ngày và đã bật thông báo, When tới thời điểm nhắc, Then một thông báo nhắc hết dùng thử được gửi (BR-07); nếu chưa bật thông báo thì không gửi gì và ngày vẫn hiện ở Cài đặt.

### FR-014 · App phải giải thích trước rồi mới xin quyền thông báo, sau bài đầu tiên, và cho bỏ qua · UC-007 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: xin quyền trước khi người dùng thấy giá trị thì bị từ chối, và từ chối rồi thì không xin lại được; Apple 5.1.1(iv) buộc có đường thay thế.
- Người dùng nhận được gì · đo hiệu quả bằng: hiểu được nhắc để làm gì trước khi quyết định · `notification_prompt_shown`, `notification_permission_result`.
- Màn: SCR-10
- Tiêu chí nghiệm thu:
  - AC-014.1 · [Dev kiểm] Given app vừa cài, When người dùng chưa hoàn thành bài nào, Then hộp quyền thông báo của hệ thống chưa bao giờ hiện.
  - AC-014.2 · [Lead kiểm] Given màn mời bật nhắc hiện sau bài đầu tiên, When đọc màn đó, Then có đủ: nhắc mấy lần một ngày · nhắc lúc mấy giờ · đổi được ở đâu; và hai nút "Bật nhắc" với "Để sau" cùng cỡ chữ, cùng độ tương phản, không nút nào bị làm mờ.
  - AC-014.3 · [Dev kiểm] Given người dùng chọn "Để sau", When dùng app trong 7 ngày sau đó, Then màn mời bật nhắc không hiện lại; và trong cả đời app màn này hiện tối đa 2 lần.
  - AC-014.4 · [Dev kiểm] Given người dùng từ chối ở hộp quyền của hệ thống, When dùng app tiếp, Then app không hiện lại màn mời bật nhắc lần nào nữa.

### FR-015 · App phải gửi tối đa một lời nhắc mỗi ngày, và chỉ khi hôm đó chưa check-in · UC-007 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: người dùng quên dùng sau tuần đầu (M#20), nhưng nhắc thừa là lý do tắt thông báo hẳn.
- Người dùng nhận được gì · đo hiệu quả bằng: một lời nhắc đúng lúc, không phiền · `notification_sent`, `notification_opened`.
- Màn: SCR-09
- Tiêu chí nghiệm thu:
  - AC-015.1 · [Dev kiểm] Given đã bật nhắc và hôm đó chưa check-in, When tới 15:00 giờ máy, Then đúng một thông báo được gửi; chạm vào thì mở thẳng màn bài, không qua màn chính.
  - AC-015.2 · [Dev kiểm] Given đã bật nhắc và hôm đó đã check-in lúc 09:00, When tới 15:00 giờ máy, Then không có thông báo nào được gửi.
  - AC-015.3 · [Dev kiểm] Given người dùng không mở app 3 ngày liên tiếp, When tới ngày thứ 4, Then có nhiều nhất một thông báo khơi lại, và không có thông báo khơi lại nào nữa trong 3 ngày kế tiếp.
  - AC-015.4 · [Lead kiểm] Given mọi chữ của thông báo, When soát, Then không có câu trách người dùng ("bạn đã bỏ lỡ", "chuỗi ngày sắp mất"), không có thông báo giả làm tin nhắn của người thật, và không có từ bị cấm ở BAN-03.
  - AC-015.5 · [Dev kiểm] Given người dùng tắt nhắc trong Cài đặt app, When tới giờ nhắc, Then không có thông báo nào được gửi và lịch sử check-in cùng chuỗi ngày giữ nguyên.

### FR-016 · App phải dùng được đủ mọi tính năng khi người dùng từ chối quyền thông báo · UC-007 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: Apple 5.1.2 cấm app đòi bật thông báo mới dùng được một tính năng; cách chốt ở kick-off vi phạm điều này và đã sửa bằng D-07. Đây là đường cứu của một luật bắt buộc nên để P0 dù FEAT-05 là P1.
- Người dùng nhận được gì · đo hiệu quả bằng: không bị chặn vì một lựa chọn riêng tư · `notification_permission_result` có giá trị từ chối, đối chiếu với `session_completed` của nhóm đó.
- Màn: SCR-06, SCR-10, SCR-12
- Tiêu chí nghiệm thu:
  - AC-016.1 · [Dev kiểm] Given người dùng từ chối quyền thông báo, When đi hết mọi màn của app, Then không màn nào khoá, không màn nào chặn, và không màn nào bắt quay lại bật thông báo mới đi tiếp được.
  - AC-016.2 · [Dev kiểm] Given người dùng chọn "Để sau" ở màn mời bật nhắc, When màn đó đóng, Then app đi tiếp sang bước kế tiếp của onboarding như khi chọn "Bật nhắc".
  - AC-016.3 · [Dev kiểm] Given người dùng từ chối vĩnh viễn (hệ thống không cho hỏi lại), When mở Cài đặt, Then hiện "Thông báo đang tắt" kèm nút mở Cài đặt máy; app không gọi hộp quyền của hệ thống thêm lần nào.
  - AC-016.4 · [Lead kiểm] Given người dùng đã từ chối thông báo, When mở app, Then màn chính hiện dòng chuỗi ngày thay cho lời nhắc; dòng này không phải lời mời bật thông báo.

### FR-017 · App phải xin đánh giá chỉ bằng API đánh giá của Apple, không hộp tự thiết kế, không lọc theo số sao · UC-008 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: Apple 5.6.1 chỉ cho phép xin đánh giá bằng API của Apple; cách chốt ở kick-off (hỏi sao trước rồi rẽ nhánh) là đúng điều bị cấm, đã sửa bằng D-08.
- Người dùng nhận được gì · đo hiệu quả bằng: không bị chen ngang bằng một hộp lạ · `review_prompt_requested` (app gọi API, không phải người dùng chọn gì).
- Màn: SCR-05, SCR-24
- Tiêu chí nghiệm thu:
  - AC-017.1 · [Dev kiểm] Given người dùng vừa hoàn thành bài thứ 3 và chưa gọi API trong 120 ngày, When màn xong bài hiện, Then app gọi API đánh giá của Apple đúng một lần (BR-06).
  - AC-017.2 · [Lead kiểm] Given toàn bộ màn của app kể cả lớp ẩn trong Figma, When soát, Then không có màn nào do app tự vẽ hỏi người dùng chấm sao hoặc hỏi "bạn có thích app không".
  - AC-017.3 · [Dev kiểm] Given app đã gọi API đánh giá, When hệ thống hiện hộp hoặc không hiện, Then app không đổi màn, không ghi lại người dùng chọn gì, và không mở trang App Store bằng tay.
  - AC-017.4 · [Dev kiểm] Given bài đang chạy, When người dùng chưa tới màn xong bài, Then app không gọi API đánh giá.

### FR-018 · Cài đặt phải luôn có lối gửi góp ý, không gắn với việc mời đánh giá · UC-008 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: mục tiêu "kéo điểm store" của kick-off vẫn giữ, nhưng đường nghe người dùng chưa hài lòng phải luôn mở chứ không phải chỉ mở cho người chấm điểm thấp (D-08).
- Người dùng nhận được gì · đo hiệu quả bằng: nói được điều mình nghĩ bất cứ lúc nào · `feedback_opened`.
- Màn: SCR-09, SCR-11
- Tiêu chí nghiệm thu:
  - AC-018.1 · [Lead kiểm] Given Cài đặt, When mở, Then thấy mục "Gửi góp ý" ở mọi lúc, không phụ thuộc số bài đã làm hay việc hộp đánh giá đã hiện hay chưa.
  - AC-018.2 · [Dev kiểm] Given máy không có ứng dụng thư nào, When chạm "Gửi góp ý", Then hiện địa chỉ thư kèm nút sao chép, không hiện lỗi hệ thống.

### FR-019 · App phải cho xoá toàn bộ dữ liệu tâm trạng trong app, và nói rõ việc đó không đụng tới gói đã mua · UC-009 · P1
- Giải vấn đề gì, cho ai, trong bối cảnh nào: người dùng lo dữ liệu tâm trạng (M#27–M#29); app không có tài khoản nên không có xoá tài khoản, nhưng người dùng vẫn phải xoá được thứ app đang giữ (MASVS-PRIVACY).
- Người dùng nhận được gì · đo hiệu quả bằng: xoá sạch mà không phải gỡ app · `data_deleted`.
- Màn: SCR-09, SCR-22
- Tiêu chí nghiệm thu:
  - AC-019.1 · [Lead kiểm] Given hộp xác nhận xoá, When đọc, Then nói rõ xoá lịch sử tâm trạng và chuỗi ngày, nói rõ không lấy lại được, và nói rõ gói đã mua không bị ảnh hưởng.
  - AC-019.2 · [Dev kiểm] Given người dùng xác nhận xoá, When mở biểu đồ, Then hiện trạng thái trống; và trạng thái gói vẫn đúng như trước khi xoá.
  - AC-019.3 · [Dev kiểm] Given người dùng huỷ ở hộp xác nhận, When về Cài đặt, Then không dữ liệu nào bị xoá.

### FR-020 · Dữ liệu tâm trạng phải chỉ nằm trên máy, và app phải nói trước điều đó cùng hệ quả khi đổi máy · UC-004 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: Apple 5.1.3 cấm để thông tin sức khoẻ cá nhân trên iCloud (D-09, BAN-04); và mất lịch sử mà không được báo trước là lý do người dùng bỏ app và viết review xấu.
- Người dùng nhận được gì · đo hiệu quả bằng: biết trước mình đang đánh đổi gì · không có sự kiện riêng; kiểm bằng AC.
- Màn: SCR-02, SCR-09
- Tiêu chí nghiệm thu:
  - AC-020.1 · [Dev kiểm] Given người dùng dùng app một tuần rồi tắt mạng hoàn toàn, When dùng tiếp, Then mọi tính năng trừ mua gói và khôi phục mua hàng vẫn chạy bình thường.
  - AC-020.2 · [Dev kiểm] Given app đang chạy, When soát mọi dữ liệu app gửi đi, Then không có dữ liệu tâm trạng, nội dung check-in hay chuỗi ngày nào rời khỏi máy, kể cả qua iCloud và kể cả dưới dạng sao lưu (BAN-04).
  - AC-020.3 · [Lead kiểm] Given màn chào và Cài đặt, When đọc, Then cả hai nơi đều có câu nói lịch sử tâm trạng nằm trên máy và đổi máy hoặc cài lại sẽ không mang theo.
  - AC-020.4 · [Lead kiểm] Given Cài đặt, When mở, Then có link Chính sách riêng tư mở được (Apple 5.1.1(i)).

### FR-021 · App phải có dòng miễn trừ và lối tới tài nguyên hỗ trợ, không chặn và không tự bật · UC-004 · P0
- Giải vấn đề gì, cho ai, trong bối cảnh nào: định vị đồng hành, không chữa bệnh (BAN-03, Apple 1.4.1); app nhắm đúng lúc người dùng đang căng (M#1) nên team chọn có tài nguyên hỗ trợ (D-11).
- Người dùng nhận được gì · đo hiệu quả bằng: biết app là gì và không phải là gì · `support_resources_opened`.
- Màn: SCR-02, SCR-05, SCR-09, SCR-19
- Tiêu chí nghiệm thu:
  - AC-021.1 · [Lead kiểm] Given màn chào và Cài đặt, When đọc, Then cả hai nơi có câu "đồng hành hằng ngày, không thay thế chăm sóc chuyên môn" (D-10).
  - AC-021.2 · [Lead kiểm] Given tâm trạng vừa chọn là mức xấu nhất trong 4 mức, When màn xong bài hiện, Then có thêm một dòng tĩnh dẫn sang màn tài nguyên hỗ trợ; dòng này không tự mở màn đó và không chặn nút đi tiếp.
  - AC-021.3 · [Lead kiểm] Given toàn bộ chữ trong app, trên paywall và trong thông báo, When soát, Then không có từ "chữa", "điều trị", "giảm trầm cảm" hay câu hứa kết quả y tế nào (BAN-03).

## 3. Yêu cầu chất lượng (NFR)
**Máy tham chiếu:** yếu nhất iPhone 11 (iOS 17) · phổ biến iPhone 13 · mạnh iPhone 15 Pro. iOS tối thiểu 17 là **giả định** — DQ-07.

| Mã | Nhóm | Yêu cầu | Ngưỡng | Đo trên máy / điều kiện |
|---|---|---|---|---|
| NFR-01 | Hiệu năng | Mở app lạnh tới màn chính | < 2,0 giây | iPhone 11, iOS 17, app vừa bị hệ thống dừng |
| NFR-02 | Hiệu năng | Chạm ô tâm trạng trên widget → màn bài sẵn sàng bấm "Bắt đầu" | ≤ 1,5 giây | iPhone 11, iOS 17 (Dev đo 1,2 giây, 14/11/2026) |
| NFR-03 | Hiệu năng | Mở biểu đồ tuần khi đã có dữ liệu | < 1,0 giây | iPhone 11, 90 ngày dữ liệu |
| NFR-04 | Tiếp cận | Vùng chạm của 4 ô tâm trạng và mọi nút chính | ≥ 44pt, bấm được bằng một ngón khi cầm máy một tay | iPhone 11 |
| NFR-05 | Tiếp cận | Tương phản chữ thường | ≥ 4,5:1 | chế độ sáng và chế độ tối |
| NFR-06 | Tiếp cận | Cỡ chữ hệ thống lớn nhất | không vỡ bố cục, không cắt chữ, không chồng thành phần | mọi màn ở §11 |
| NFR-07 | Tiếp cận | Nhãn VoiceOver | mọi thành phần bấm được đều có nhãn đọc ra nghĩa, không đọc "nút" trống | mọi màn ở §11 |
| NFR-08 | Tiếp cận | Màu và chuyển động không phải kênh báo tin duy nhất | nhịp thở có chữ đếm khi người dùng tắt hiệu ứng chuyển động; tâm trạng phân biệt được không chỉ bằng màu | iPhone 11 |
| NFR-09 | Độ tin cậy | Mất mạng | mọi tính năng trừ mua gói và khôi phục mua hàng vẫn chạy (**giả định**, DQ-02) | chế độ máy bay |
| NFR-10 | Độ tin cậy | App bị hệ thống dừng giữa bài rồi mở lại | vào lại đúng giây đang dở hoặc hỏi "Bắt đầu lại", không mất check-in | iPhone 11 |
| NFR-11 | Độ tin cậy | Hết dung lượng máy | check-in mới không ghi được thì báo rõ cho người dùng, không im lặng mất dữ liệu | iPhone 11 |
| NFR-12 | Tương thích | iOS tối thiểu | iOS 17 — **giả định**, DQ-07 | — |
| NFR-13 | Riêng tư | Dữ liệu tâm trạng | chỉ nằm trên máy, không rời máy kể cả qua iCloud hay sao lưu (BAN-04) | kiểm bằng AC-020.2 |
| NFR-14 | Riêng tư | Dữ liệu thu thập | chỉ những mục ở §5; không thu tên, tuổi, thư điện tử, vị trí, danh bạ, sức khoẻ từ máy | kiểm bằng AC-009.1 |
| NFR-15 | Vận hành | Tỉ lệ phiên không lỗi | ≥ 99,5% | 7 ngày sau khi ra bản |
| NFR-16 | Vận hành | Pin tiêu hao cho một bài 2 phút | **giả định** — chưa có ngưỡng, DQ-03 | iPhone 11, màn tắt |

## 4. Công thức nghiệp vụ (BR)
> Công thức chỉ định nghĩa ở đây; nơi khác trích mã BR.

### BR-01 · Chọn bài theo tâm trạng
- Công thức: mỗi tâm trạng T gắn với một nhóm bài đã sắp thứ tự `L(T)`. Bài được chọn = `L(T)[ n mod |L(T)| ]`, với `n` = số lần người dùng đã chọn tâm trạng T từ trước tới giờ (tính cả lần này, đếm từ 0). Nếu bài chọn ra bị khoá và người dùng chưa trả tiền → áp BR-05.
- Ví dụ tính tay: `L("căng")` có 4 bài [B1, B2, B3, B4]. Người dùng chọn "căng" lần thứ 6 → n = 5 → 5 mod 4 = 1 → bài B2.
- Trường hợp biên (≥ 5): nhóm chỉ có 1 bài → luôn ra bài đó, không coi là lỗi · nhóm rỗng → không được phép tồn tại, mỗi tâm trạng phải có ≥ 1 bài miễn phí (kiểm lúc nộp bản) · n = 0 (lần đầu) → bài đầu nhóm · người dùng xoá toàn bộ dữ liệu → n về 0, bài quay lại từ đầu nhóm · bản cập nhật thêm bài vào giữa nhóm → thứ tự nhóm chỉ được nối thêm vào cuối, không chèn giữa, để người dùng cũ không nhảy bài.
- Khi phá vỡ: nếu hai lần chọn cùng tâm trạng liên tiếp ra cùng một bài thì FR-003 không đạt.
- Áp cho: FR-003, FR-006.

### BR-02 · Gộp nhiều lần chạm tâm trạng liên tiếp
- Công thức: nhiều lần chọn tâm trạng cách nhau < 60 giây được gộp thành một check-in duy nhất, lấy tâm trạng của lần chạm cuối và lấy thời điểm của lần chạm cuối.
- Ví dụ tính tay: chạm "căng" lúc 14:00:05, "mệt" lúc 14:00:30, "căng" lúc 14:01:20. Hai lần đầu cách nhau 25 giây → gộp, giữ "mệt" lúc 14:00:30. Lần thứ ba cách lần thứ hai 50 giây → vẫn < 60 giây → gộp tiếp, kết quả cuối là "căng" lúc 14:01:20. Tổng: một check-in.
- Trường hợp biên (≥ 5): đúng 60 giây → tính là hai check-in riêng (ngưỡng là "nhỏ hơn 60") · 61 giây → hai check-in · chạm rồi làm xong bài rồi chạm lại sau 20 giây → vẫn gộp, nhưng bài đã hoàn thành vẫn được tính cho chuỗi ngày (BR-03) · hai lần chạm nằm hai bên nửa đêm → không gộp, vì chúng thuộc hai ngày khác nhau (BR-04 thắng) · app bị dừng giữa hai lần chạm → vẫn gộp nếu khoảng cách < 60 giây.
- Khi phá vỡ: biểu đồ tuần có nhiều điểm trong cùng một phút → FR-002 không đạt.
- Áp cho: FR-002.

### BR-03 · Chuỗi ngày
- Công thức: chuỗi ngày = số ngày liên tiếp tính ngược từ hôm nay, trong đó mỗi ngày có ít nhất một bài **hoàn thành** (chạy hết 120 giây). Check-in không làm xong bài không tính vào chuỗi. Chuỗi về 0 khi có một ngày không có bài hoàn thành nào.
- Ví dụ tính tay: thứ Hai 1 bài xong, thứ Ba 2 bài xong, thứ Tư chỉ check-in rồi thoát giữa bài, thứ Năm 1 bài xong, hôm nay là thứ Năm → chuỗi = 1 (thứ Tư đã cắt chuỗi).
- Trường hợp biên (≥ 5): chưa có ngày nào → chuỗi = 0, hiện là 0 chứ không ẩn · hôm nay chưa làm bài nào → chuỗi giữ nguyên số của hôm qua cho tới hết ngày, chỉ về 0 khi sang ngày mới mà hôm qua trống · bài kết thúc lúc 23:59:50 → tính cho ngày hôm đó theo giờ máy (BR-04) · người dùng đổi múi giờ làm "hôm nay" ngắn hơn 24 giờ → ngày vẫn tính theo giờ máy lúc bài kết thúc, chuỗi không bị cắt thêm · người dùng chỉnh giờ máy lùi lại một ngày → chuỗi không tăng thêm; mỗi ngày đóng góp nhiều nhất 1 vào chuỗi.
- Khi phá vỡ: chuỗi tăng khi người dùng chỉ chạm mà không làm bài → FR-005 không đạt.
- Áp cho: FR-005, FR-007, FR-016.

### BR-04 · Ngày của một check-in và việc đổi múi giờ
- Công thức: ngày của một check-in = ngày theo lịch của **giờ máy tại thời điểm check-in**, ghi lại một lần và không tính lại về sau. Đổi múi giờ không làm đổi ngày của các check-in cũ.
- Ví dụ tính tay: check-in lúc 22:00 ngày 10/11 ở New York → ngày 10/11. Người dùng bay sang Tokyo; ở Tokyo thời điểm đó là 12:00 ngày 11/11, nhưng check-in vẫn thuộc ngày 10/11 và cột biểu đồ không đổi.
- Trường hợp biên (≥ 5): check-in lúc 00:00:00 → thuộc ngày mới · check-in lúc 23:59:59 → thuộc ngày cũ · ngày đổi giờ mùa hè, một ngày dài 25 giờ → vẫn là một ngày, một cột · ngày đổi giờ mùa hè, một ngày ngắn 23 giờ → vẫn một cột · người dùng chỉnh tay giờ máy về quá khứ → check-in mới ghi theo giờ máy đang đặt, app không sửa lại dữ liệu cũ và không chặn.
- Khi phá vỡ: số cột trong biểu đồ đổi sau khi người dùng bay sang múi giờ khác → FR-007 không đạt.
- Áp cho: FR-002, FR-003, FR-007, FR-015.

### BR-05 · Bài miễn phí và bài khoá
- Công thức: ba bài thở `B1, B2, B3` luôn miễn phí cho mọi tâm trạng. Mọi bài khác khoá khi trạng thái gói là "miễn phí" hoặc "hết hạn", mở khi là "đang dùng thử" hoặc "đã trả tiền". Check-in không bao giờ bị khoá và không có giới hạn lượt theo ngày.
- Ví dụ tính tay: trạng thái gói = miễn phí; BR-01 chọn ra B5 cho tâm trạng "căng" → B5 khoá → mở paywall; người dùng đóng paywall → app mở bài miễn phí gần nhất trong `L("căng")` tính từ B5 ngược lên, tức B3 nếu B3 nằm trong nhóm đó.
- Trường hợp biên (≥ 5): nhóm của một tâm trạng không chứa bài miễn phí nào → không được phép, mỗi nhóm phải có ≥ 1 bài miễn phí (kiểm lúc nộp bản) · gói hết hạn giữa lúc bài đang chạy → bài đang chạy không bị cắt, lần sau mới khoá · đang chờ duyệt (Ask to Buy) → coi như miễn phí cho tới khi được duyệt · khôi phục mua hàng thành công giữa phiên → mở khoá ngay, không cần mở lại app · người dùng xoá toàn bộ dữ liệu → trạng thái gói giữ nguyên, bài không bị khoá lại (FR-019).
- Khi phá vỡ: người dùng miễn phí gặp màn trống không có bài nào chạy được → FR-006 không đạt.
- Áp cho: FR-006, FR-008, FR-011, FR-013.

### BR-06 · Thời điểm gọi API đánh giá của Apple
- Công thức: gọi API khi **cả ba** điều sau đúng — số bài đã hoàn thành ≥ 3 · đang ở màn xong bài · lần gọi gần nhất cách đây ≥ 120 ngày (hoặc chưa gọi lần nào). App không đếm và không ghi lại việc hệ thống có hiện hộp hay không.
- Ví dụ tính tay: người dùng hoàn thành bài thứ 3 ngày 01/12 → gọi API. Hoàn thành bài thứ 4 ngày 02/12 → không gọi (chưa đủ 120 ngày). Hoàn thành bài thứ 40 ngày 02/04 năm sau → đã qua 122 ngày → gọi.
- Trường hợp biên (≥ 5): đúng bài thứ 3 → gọi · đúng 120 ngày kể từ lần gọi trước → gọi (ngưỡng là "lớn hơn hoặc bằng") · 119 ngày → không gọi · người dùng xoá toàn bộ dữ liệu → số bài hoàn thành về 0 nhưng mốc 120 ngày vẫn giữ, để không hỏi lại ngay · app bị gỡ rồi cài lại → mốc mất theo máy, chấp nhận, vì app không có tài khoản (BAN-01).
- Khi phá vỡ: app hỏi người dùng chấm sao trước khi gọi API, hoặc đổi màn theo kết quả → FR-017 không đạt và bản bị từ chối (Apple 5.6.1).
- Áp cho: FR-017.

### BR-07 · Ngày hết dùng thử và lời nhắc trước khi bị trừ tiền
- Công thức: ngày hết dùng thử = thời điểm bắt đầu dùng thử + 3 ngày (72 giờ), lấy theo giờ máy lúc bắt đầu. Lời nhắc hết dùng thử gửi tại thời điểm **ngày hết dùng thử trừ 24 giờ**, và chỉ gửi khi người dùng đã bật thông báo.
- Ví dụ tính tay: bắt đầu dùng thử 14:30 ngày 10/11 → hết dùng thử 14:30 ngày 13/11 → lời nhắc gửi 14:30 ngày 12/11.
- Trường hợp biên (≥ 5): người dùng chưa bật thông báo → không gửi gì, ngày hết dùng thử vẫn hiện trong Cài đặt (FR-013) · người dùng huỷ trước thời điểm nhắc → không gửi · người dùng đổi múi giờ giữa kỳ dùng thử → thời điểm hết dùng thử là một mốc thời gian tuyệt đối, không đổi theo múi giờ; chữ hiển thị đổi theo giờ máy mới · người dùng bật thông báo sau khi đã bắt đầu dùng thử và còn hơn 24 giờ → lời nhắc vẫn được đặt · còn dưới 24 giờ → không đặt, không gửi muộn · store báo gia hạn thất bại → coi như hết hạn, áp BR-05.
- Khi phá vỡ: người dùng bị trừ tiền mà chưa từng thấy ngày hết dùng thử ở đâu → FR-010 và FR-013 không đạt, và là đúng lời chê app B ở M#11.
- Áp cho: FR-010, FR-013.

## 5. Quyền và dữ liệu
| Mã | Quyền | Xin lúc nào | Đồng ý | Từ chối | Từ chối vĩnh viễn |
|---|---|---|---|---|---|
| PRM-01 | Thông báo | sau khi hoàn thành bài 2 phút đầu tiên, và chỉ sau một màn giải thích có nút "Để sau" ngang nút "Bật nhắc" (D-07) | đặt lời nhắc 1 lần/ngày lúc 15:00 giờ máy; đổi giờ và tắt được trong Cài đặt | app đi tiếp ngay, không khoá tính năng nào; thay bằng dòng chuỗi ngày ở màn chính; không hỏi lại | Cài đặt hiện "Thông báo đang tắt" kèm nút mở Cài đặt máy; app không gọi hộp quyền của hệ thống lần nào nữa; mọi tính năng vẫn dùng được |

App không xin quyền nào khác: không vị trí, không máy ảnh, không micro, không danh bạ, không lịch, không dữ liệu sức khoẻ của máy, không theo dõi quảng cáo (nên không có hộp xin theo dõi ATT). FR phụ thuộc PRM-01: FR-014, FR-015, FR-016, và một phần FR-013 (lời nhắc hết dùng thử).

| Mã | Dữ liệu | Vì sao cần | Lưu ở đâu (Dev xác nhận) | Giữ bao lâu | Xoá được / đổi máy thì sao |
|---|---|---|---|---|---|
| DATA-01 | Lần check-in: thời điểm, tâm trạng đã chọn | vẽ biểu đồ tuần (FEAT-03), chọn bài (BR-01) | trên máy, không rời máy (BAN-04) — Dev xác nhận qua DQ-06 | tới khi người dùng xoá hoặc gỡ app | xoá được trong Cài đặt (FR-019); đổi máy hoặc cài lại thì mất, đã báo trước ở màn chào (FR-020) |
| DATA-02 | Bài đã chạy: mã bài, có hoàn thành hay không, giây dừng nếu bỏ dở | tiếp tục bài đang dở (FR-005), tính chuỗi ngày (BR-03) | trên máy | như trên | như trên |
| DATA-03 | Chuỗi ngày | giữ chân (FEAT-05) | trên máy, tính ra từ DATA-01 và DATA-02 | như trên | như trên |
| DATA-04 | Trạng thái gói: miễn phí / đang dùng thử / đã trả tiền / hết hạn, ngày hết dùng thử | khoá hay mở nội dung (BR-05), hiện trạng thái trong Cài đặt (FR-013) | trên máy; nguồn gốc là store — Dev xác nhận | tới khi gói hết hiệu lực | không xoá cùng dữ liệu tâm trạng (FR-019); đổi máy thì lấy lại bằng khôi phục mua hàng (FR-012) |
| DATA-05 | Cờ tiến trình: đã qua onboarding chưa, đã hỏi quyền thông báo mấy lần, số bài đã hoàn thành, lần gọi API đánh giá gần nhất | không hỏi lại quá số lần cho phép (FR-014), gọi API đánh giá đúng lúc (BR-06) | trên máy | như DATA-01 | mốc 120 ngày của BR-06 giữ lại khi xoá dữ liệu; phần còn lại xoá |

**Không thu thập:** tên, tuổi, giới tính, thư điện tử, số điện thoại, tài khoản (BAN-01) · vị trí · danh bạ, lịch, ảnh · dữ liệu sức khoẻ từ máy · định danh quảng cáo và mọi dữ liệu dùng để theo dõi qua app khác (nên không cần hộp xin theo dõi ATT) · nội dung chữ người dùng tự viết (bản 1.0.0 không có nhật ký tự do) · mọi thứ gửi lên iCloud hoặc máy chủ (BAN-04).

Mục cần Dev chốt trước khi thiết kế xong: dữ liệu tâm trạng có bị xếp là thông tin sức khoẻ cá nhân theo Apple 5.1.3 không (DQ-06) — câu trả lời quyết định R-02 có mở lại được không, và quyết định phần khai App Privacy lúc nộp.

## 6. Sự kiện đo — bản nháp
> Mỗi sự kiện phục vụ một chỉ số ở prd.md §7 hoặc một bước phễu; sự kiện không phục vụ gì thì bỏ. Tên đã phát hành không đổi — muốn đổi thì thêm tên mới và đánh dấu tên cũ là bỏ.

| Mã | Sự kiện | Bắn khi | Phục vụ chỉ số / bước phễu | Màn |
|---|---|---|---|---|
| EVT-01 | `app_opened` | app vào trạng thái dùng được, kèm thuộc tính nguồn (icon / widget / thông báo) | nền của mọi tỉ lệ | — |
| EVT-02 | `onboarding_started` | màn chào hiện lần đầu | phễu onboarding bước 1 | SCR-02 |
| EVT-03 | `onboarding_step_completed` | mỗi bước onboarding xong, kèm số thứ tự bước | tìm chỗ rơi ở từng bước (§12) | SCR-02…SCR-08 |
| EVT-04 | `checkin_started` | người dùng chọn một tâm trạng, kèm nguồn (widget / trong app) và tâm trạng | chỉ số chính, FR-001, FR-002 | SCR-01, SCR-03, SCR-06 |
| EVT-05 | `session_started` | bài bắt đầu chạy, kèm mã bài và miễn phí hay trả phí | mẫu của tỉ lệ hoàn thành bài | SCR-04 |
| EVT-06 | `session_completed` | bài chạy hết 120 giây | chỉ số chính "người làm ≥ 3 bài/7 ngày" và "đạt aha phiên đầu" | SCR-04 |
| EVT-07 | `session_abandoned` | người dùng chọn Dừng ở hộp "Dừng bài?", kèm giây dừng | chỗ rơi ở onboarding bước 3 | SCR-20 |
| EVT-08 | `session_resumed` | người dùng chọn Tiếp ở hộp "Tiếp tục từ giây thứ n?" | FR-005 | SCR-21 |
| EVT-09 | `chart_viewed` | biểu đồ tuần hiện, kèm số ngày có dữ liệu | FEAT-03 có được dùng không | SCR-07 |
| EVT-10 | `paywall_viewed` | paywall hiện, kèm điểm chạm (onboarding / bài khoá / lịch sử khoá / Cài đặt) và mã bản paywall | bước phễu trước "bắt đầu dùng thử" | SCR-08 |
| EVT-11 | `paywall_dismissed` | người dùng đóng paywall, kèm điểm chạm và mã bản paywall | đọc chất lượng paywall theo điểm chạm | SCR-08 |
| EVT-12 | `trial_started` | store báo dùng thử bắt đầu, kèm mã gói và mã bản paywall | chỉ số đầu vào "bắt đầu dùng thử" (mốc team > 6%, M#50) | SCR-25 |
| EVT-13 | `trial_cancelled` | store báo dùng thử bị huỷ, kèm số giờ kể từ khi bắt đầu | chỉ số rào chắn "huỷ dùng thử ngày 1" (< 30%) | — |
| EVT-14 | `purchase_succeeded` | store báo mua thành công, kèm mã gói và mã bản paywall | doanh thu, phễu dùng thử → trả tiền | SCR-25 |
| EVT-15 | `purchase_failed` | store báo mua thất bại, kèm loại lỗi | nhóm dễ sót "mua thất bại" | SCR-08 |
| EVT-16 | `purchase_pending` | mua rơi vào trạng thái chờ duyệt | nhóm dễ sót "đang chờ" | SCR-16 |
| EVT-17 | `purchase_cancelled` | người dùng tự huỷ hộp thanh toán | nhóm dễ sót "huỷ giữa chừng" | SCR-25 |
| EVT-18 | `purchase_restored` | khôi phục mua hàng xong, kèm có tìm thấy gói hay không | FR-012, mục bắt buộc của store | SCR-17 |
| EVT-19 | `subscription_expired` | store báo gói hết hạn hoặc gia hạn thất bại | nhóm dễ sót "hết hạn", "gia hạn thất bại" | — |
| EVT-20 | `notification_prompt_shown` | màn giải thích trước khi xin quyền hiện | FR-014, mẫu của tỉ lệ bật nhắc | SCR-10 |
| EVT-21 | `notification_permission_result` | hộp quyền của hệ thống trả kết quả, kèm giá trị đồng ý / từ chối / để sau | FR-014, FR-016 — đối chiếu nhóm từ chối với `session_completed` để chứng minh app không bị khoá | SCR-10 |
| EVT-22 | `notification_opened` | người dùng chạm vào thông báo, kèm loại (nhắc hằng ngày / khơi lại / hết dùng thử) | FEAT-05 có kéo người quay lại không | — |
| EVT-23 | `review_prompt_requested` | app gọi API đánh giá của Apple | FR-017 — chỉ ghi việc app gọi, không ghi người dùng chọn gì (Apple 5.6.1) | SCR-05 |
| EVT-24 | `feedback_opened` | người dùng chạm "Gửi góp ý" trong Cài đặt | FR-018 | SCR-09 |
| EVT-25 | `support_resources_opened` | người dùng mở màn tài nguyên hỗ trợ, kèm nguồn (màn xong bài / Cài đặt) | D-11 — xem tính năng này có bị mở nhầm nhiều không | SCR-19 |
| EVT-26 | `data_deleted` | người dùng xác nhận xoá toàn bộ dữ liệu | FR-019 | SCR-22 |

Sự kiện cố tình **không có**: bất cứ sự kiện nào ghi lại người dùng chấm app mấy sao (app không biết và không được biết — Apple 5.6.1) · sự kiện gắn định danh quảng cáo · sự kiện mang nội dung tâm trạng ra khỏi máy dưới dạng nhận dạng được người dùng (BAN-04) — thuộc tính tâm trạng ở EVT-04 chỉ được gửi dưới dạng gộp, Dev xác nhận cách làm qua DQ-06.

Nhóm bắt buộc đã phủ: vòng đời app (EVT-01) · việc chính xong (EVT-06) · từng bước onboarding (EVT-03) · paywall, dùng thử, mua (EVT-10…EVT-19) · lỗi và đường phục hồi (EVT-07, EVT-08, EVT-15) · từ chối quyền kể cả vĩnh viễn (EVT-21) · chạm giới hạn miễn phí (EVT-10 với điểm chạm bài khoá / lịch sử khoá) · bật tắt thông báo (EVT-20, EVT-21). Mất mạng chưa có sự kiện riêng — đang chờ DQ-02 xem app có trạng thái mất mạng nào ngoài paywall không.

## 7. Truy vết và nghiệm thu
Chưa làm — product-detail

## 8. Câu hỏi cho Dev (DQ)
| Mã | Câu hỏi | Ngưỡng chấp nhận | Cần trước | Trả lời (nguồn, ngày) |
|---|---|---|---|---|
| DQ-01 | Widget trên **màn khoá** có mở thẳng được màn bài không, hay chỉ widget màn hình chính làm được? Nếu không thì người dùng chạm widget màn khoá sẽ thấy gì? | nếu không mở thẳng được thì phải có đường thay thế, không được dừng ở màn chính | trước thiết kế | chưa trả lời (câu cho widget màn hình chính đã trả lời: 1,2 giây trên iPhone 11 — Dev, 14/11/2026) |
| DQ-02 | Toàn bộ bài (hình + tiếng) nằm hẳn trong app, chạy được khi mất mạng đúng không? Nếu phải tải thì tải lúc nào và app làm gì khi tải lỗi? | chạy được khi mất mạng; nếu không thì mọi nhánh "mất mạng → không áp dụng" ở FEAT-01, 02, 03 phải viết lại | **trước thiết kế** | chưa trả lời |
| DQ-03 | Tiếng dẫn có chạy tiếp khi người dùng tắt màn hình hoặc chuyển app khác không? Nếu bị cắt thì cắt sau bao lâu, và một bài 2 phút tốn bao nhiêu pin trên iPhone 11? | nếu bị cắt thì FR-005 phải đổi: app dừng bài và hỏi khi quay lại, thay vì chạy ngầm | trước thiết kế | chưa trả lời (rung theo nhịp đã trả lời: bị cắt sau ~30 giây — Dev, 14/11/2026) |
| DQ-04 | Tiếng dẫn và nhạc nền lấy từ đâu, đã có giấy phép ghi lại chưa? | có bản ghi giấy phép cho từng đoạn tiếng trước khi nộp (Apple 5.2) | **trước thiết kế** | chưa trả lời |
| DQ-05 | Hai gói PLN-W và PLN-Y khai trên App Store Connect có vướng gì không, và gói tuần 7 ngày có đúng mức tối thiểu của Apple không? | PLN-W phải là chu kỳ ≥ 7 ngày (Apple 3.1.2(a)) | trước build | chưa trả lời |
| DQ-06 | Dữ liệu tâm trạng của app này có bị xếp là thông tin sức khoẻ cá nhân theo Apple 5.1.3 không? Câu trả lời quyết định: có được đồng bộ iCloud ở bản sau không (R-02), và khai App Privacy thế nào. | câu trả lời có dẫn chiếu mục quy định, không phải phỏng đoán | **trước thiết kế** | chưa trả lời |
| DQ-07 | iOS tối thiểu của bản 1.0.0 là bao nhiêu, và máy yếu nhất cần hỗ trợ là máy nào? | đủ để chốt mốc đo của NFR-01…NFR-03 | **trước thiết kế** | chưa trả lời |
| DQ-08 | Lời nhắc 15:00 hằng ngày đặt được hoàn toàn trên máy, không cần máy chủ đúng không? Có giới hạn số lời nhắc đặt trước không? | đặt được trên máy; nếu không thì vướng BAN-01 và phải quay lại quyết định | trước build | chưa trả lời |
| DQ-09 | Mua ở trạng thái chờ duyệt (Ask to Buy) có tự mở khoá khi được duyệt lúc app đang đóng không? | có, nếu không thì FR-011 phải đổi sang cách người dùng tự kiểm | trước build | chưa trả lời |
| DQ-10 | Khi người dùng xoá toàn bộ dữ liệu, lời nhắc đã đặt có bị xoá theo không, và chuỗi ngày trong thông báo đã xếp lịch có hiện số cũ không? | không hiện số cũ sau khi xoá | trước build | chưa trả lời |

## 9. Bảng truy vết
Chưa làm — product-detail
