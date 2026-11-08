# Yêu cầu thử nghiệm kỹ thuật — <tên app>

Bản <1 / 2 / vòng thêm> (tối đa 3 lần) · <dd/mm/yyyy> · Gửi: <Dev / nhóm> · **Hạn trả lời: <dd/mm/yyyy>** (bản 1: 3 ngày làm việc · bản 2, vòng thêm: 2 ngày)
Trạng thái: <Bản nháp — chờ duyệt ngưỡng / Đã duyệt, gửi Dev>
<Bản 2 / vòng thêm: một dòng ghi thay đổi và lý do. Phần đã hỏi giữ nguyên; câu mới nằm ở mục "Câu hỏi mới" cuối file.>
<Sau họp bước 5: khối "Kết luận sau họp" — quyết định, Dev làm gì tiếp.>

<!-- Cách viết: market-standards/references/dev-brief-writing.md. Tài liệu tự đứng một mình — Dev không cần đọc gì khác.
     AI chỉ gợi ý hướng thử; Dev là người kết luận làm được hay không. -->

## 0. Đọc nhanh (3 phút)
- App làm gì, cho ai: …
- Cần Dev trả lời: …
- Cần câu trả lời trước: … (vì <lý do — vd. bước quyết định ngày …>)

## 1. App làm gì
1. Người dùng mở app → …
2. …
3. … → nhận được …

## 2. Tính năng cần thử
**Cốt lõi** (không làm được thì không có app — phải thử):
- T1 · <tính năng nói bằng việc app làm>
**Phụ** (làm được thì tốt — chỉ cần đánh giá sơ bộ):
- P1 · …

## 3. Thế nào là đạt
### T1 · <tính năng>
- Đạt: <ngưỡng bằng số, trên máy yếu nhất>
- Tạm chấp nhận: <nếu có — và sẽ bù bằng gì>
- Không đạt: <ngưỡng>
- Vì sao chọn ngưỡng này: <… (evidence #…)>
- AI gợi ý hướng thử (chỉ là gợi ý, chưa kiểm): …

## 4. Thử trên máy nào
| Nhóm máy | Máy | Ý nghĩa |
|---|---|---|
| Máy yếu nhất | <…> | Mọi ngưỡng đạt / không đạt tính trên máy này |
| Máy phổ biến | <…> | Người dùng điển hình |
| Máy mạnh | <…> | Giới hạn trên |

Điều kiện thử: <ánh sáng, mạng, pin yếu, máy nóng sau 10 phút…>

## 5. Nếu không đạt thì sao
| Tính năng | Nếu không đạt |
|---|---|
| T1 | <phương án thay / bỏ ý tưởng / họp lại ngay> |

## 6. Không cần thử
- <giao diện hoàn chỉnh, thanh toán, Android, server, tự huấn luyện mô hình…>

## 7. Cách trả lời
Lưu thành `docs/market/raw/dev-answer-<yyyy-mm-dd>.md`, mỗi tính năng một khối:

```
### <tính năng>
- Kết luận: đạt / không đạt / đạt có điều kiện (<điều kiện>) / chưa rõ
- Số đo: <máy × điều kiện → số>
- Ca lỗi điển hình: …
- Nếu không đạt: phương án dự phòng đã thử và cái giá của nó
- Ước lượng công làm bản thật: S / M / L / XL
```

## Câu hỏi mới — Bản 2 · <dd/mm/yyyy> · hạn <dd/mm/yyyy>
<!-- Chỉ thêm khi có Bản 2: câu hỏi mới phát sinh ở bước đào / chấm điểm. Không chép lại câu đã hỏi. -->

## Vòng thêm · <dd/mm/yyyy> · hạn <dd/mm/yyyy>
<!-- Chỉ khi Dev báo chặn sau Bản 2: 1–2 cách đi khác cần thử. Đây là lần hỏi cuối trước buổi họp. -->
