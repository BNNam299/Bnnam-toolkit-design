# Yêu cầu thử nghiệm kỹ thuật — App chăm sóc sức khỏe tinh thần

> DỮ LIỆU THỬ — tài liệu mẫu để thử bộ skill.

Bản 2 · 07/11/2026 · Gửi: 2 dev iOS · Mong nhận trả lời trước: 15/11/2026
Trạng thái: **Bản nháp — chờ duyệt ngưỡng của T2, T3, T4** (T1 đã duyệt ở bản 1)

**Bản 2 đổi gì so với bản 1** — theo ý tưởng chọn ở §5 của `market-report.md`:
- Thêm T3 (app chọn hộ đúng một bài theo tâm trạng) — đây là điểm khác biệt chính, bản 1 chưa hỏi.
- Thêm T4 (biểu đồ tâm trạng tuần, dữ liệu nằm trên máy) — là thứ đem bán trong gói trả phí.
- Bỏ phần nhật ký có gợi ý câu viết khỏi nhóm cốt lõi (nhóm nỗi đau "không biết viết gì" chỉ được 20/35, §5.1) — giữ lại như một dạng nội dung của T3.
- T1, T2, P1 giữ nguyên; T2 nay có ngưỡng số (bản 1 chưa có).

## 0. Đọc nhanh (3 phút)
- App làm gì, cho ai: người đi làm 22–35 tuổi ở Mỹ, đang căng thẳng giữa giờ làm, chạm một cái chọn tâm trạng và app đưa thẳng vào **một** việc 2 phút — không có thư viện để chọn.
- Cần Dev trả lời: check-in có mở được thật nhanh từ widget / màn hình khoá không; bài thở có rung theo nhịp khi màn hình tắt không; luật chọn bài có để hẳn trong máy được không; dữ liệu tâm trạng có giữ trên máy mà vẫn đồng bộ được không.
- Cần câu trả lời trước: 15/11/2026.

## 1. App làm gì
1. Người dùng chạm widget trên màn hình khoá → chọn tâm trạng bằng 1 chạm.
2. App **tự chọn** một bài thở hoặc một câu nhật ký hợp tâm trạng đó và vào thẳng — không hiện danh sách.
3. Làm xong trong ~2 phút → thấy tâm trạng tuần này.
4. Dữ liệu tâm trạng nằm trên máy, không bắt tạo tài khoản.

## 2. Tính năng cần thử
**Cốt lõi:**
- T1 · Mở check-in từ widget / màn hình khoá trong vài giây.
- T2 · Bài thở có rung nhẹ theo nhịp, chạy được khi màn hình tắt.
- T3 · App chọn hộ đúng một bài theo tâm trạng vừa chạm; luật chọn nằm trong máy, sửa được qua bản cập nhật, không cần server.
- T4 · Biểu đồ tâm trạng theo tuần; dữ liệu chỉ nằm trên máy, đồng bộ máy khác mà không bắt đăng nhập tài khoản.

**Phụ:**
- P1 · Lời nhắc thông minh theo giờ người dùng hay căng thẳng.

## 3. Thế nào là đạt
### T1 · Mở check-in từ widget (ngưỡng đã duyệt ở bản 1)
- Đạt: từ chạm widget tới màn check-in ≤ 1,5 giây trên máy yếu nhất.
- Không đạt: > 3 giây.
- Vì sao: người dùng bỏ khi phải chờ lúc đang hoảng (#1).

### T2 · Rung theo nhịp khi màn hình tắt (ngưỡng mới — chờ duyệt)
- Đạt: rung đúng nhịp liên tục đủ 2 phút khi màn hình tắt, lệch nhịp ≤ 150 mili giây, tốn ≤ 2% pin mỗi lần.
- Tạm chấp nhận: chạy được nhưng chỉ khi màn hình sáng → đổi sang hiện hình + tiếng, bỏ rung.
- Không đạt: bị hệ thống cắt giữa chừng trong 2 phút.
- Vì sao 2 phút: cả ý tưởng xây quanh "một việc trong 2 phút" (#1, #2).

### T3 · Chọn hộ đúng một bài (ngưỡng mới — chờ duyệt)
- Đạt: từ lúc chạm tâm trạng tới lúc bài bắt đầu chạy ≤ 0,5 giây, không có màn chờ, không gọi mạng.
- Đạt: sửa được luật chọn bài và danh sách bài bằng một bản cập nhật app, không cần dựng server.
- Không đạt: phải gọi mạng mới chọn được bài.
- Vì sao: điểm khác biệt chính của app (§4.3 — mới 1/5 app có); hiện màn chờ ở đây là quay lại đúng cái người dùng chê (#2).

### T4 · Biểu đồ tuần, dữ liệu trên máy (ngưỡng mới — chờ duyệt)
- Đạt: mở biểu đồ ≤ 1 giây với 365 ngày dữ liệu; đồng bộ sang máy khác không bắt người dùng tạo tài khoản riêng của app.
- Tạm chấp nhận: không đồng bộ được, chỉ nằm một máy → vẫn làm, nói rõ với người dùng.
- Không đạt: buộc phải có tài khoản hoặc buộc phải gửi dữ liệu tâm trạng lên server của mình.
- Vì sao: người dùng lo dữ liệu tâm trạng bị chia sẻ (#27–#29); đây cũng là lời hứa đem bán.

### P1 · Nhắc đúng giờ hay căng thẳng
Chưa đặt ngưỡng — chỉ cần Dev nói có đường nào làm được mà không xin quyền nhạy cảm hay không, và ước lượng công.

## 4. Thử trên máy nào
| Nhóm máy | Máy | Ý nghĩa |
|---|---|---|
| Máy yếu nhất | iPhone 11 (iOS 17) | Mọi ngưỡng tính trên máy này |
| Máy phổ biến | iPhone 14 | |
| Máy mạnh | iPhone 16 Pro | |

Điều kiện cần thử thêm: máy còn ≤ 20% pin (chế độ tiết kiệm pin bật) cho T1 và T2; máy không có mạng cho T3.

## 5. Nếu không đạt thì sao
| Tính năng | Nếu không đạt |
|---|---|
| T1 | bỏ widget, dùng phím tắt / App Intents |
| T2 | bỏ rung, dùng hình + tiếng dẫn nhịp |
| T3 | **họp lại ngay** — đây là điểm khác biệt chính, không có nó thì app trùng với app C |
| T4 | bỏ đồng bộ, dữ liệu nằm một máy; vẫn làm được bản đầu |
| P1 | bỏ, dùng lời nhắc giờ cố định do người dùng tự đặt |

## 6. Không cần thử
- Giao diện hoàn chỉnh, thanh toán, Android, server, AI / mô hình tự huấn luyện.
- Giá gói và màn mời trả tiền — bước thị trường chưa chốt.

## 7. Cách trả lời
Lưu thành `docs/market/raw/dev-answer-<yyyy-mm-dd>.md`. Mỗi tính năng một khối:

```
### <tính năng>
- Kết luận: đạt / không đạt / đạt có điều kiện (<điều kiện>) / chưa rõ
- Số đo: <máy × điều kiện → số>
- Ca lỗi điển hình: …
- Nếu không đạt: phương án dự phòng đã thử và cái giá của nó
- Ước lượng công làm bản thật: S / M / L / XL
```
