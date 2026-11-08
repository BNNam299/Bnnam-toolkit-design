# Tra cứu nhanh — bộ product: gặp việc gì thì gọi gì, ai làm gì

Bạn (designer, kiêm lead) cầm bộ này: kiêm PO, UX/UI, ASO, đọc số, test giao diện. Dev iOS / Android trả lời khả thi, làm app, test
phần logic / dữ liệu / thanh toán. Bản nào cũng họp kick-off; việc nhỏ bạn chốt luôn được. AI đề xuất và phản biện, không tự chốt.

## Gặp việc gì → gọi gì
| Bạn muốn | Gọi | Bạn làm gì |
|---|---|---|
| Market chốt làm tiếp, bắt đầu sản phẩm | `/product-kickoff` | chọn nền tảng (iOS / Android / cả hai), chu kỳ ra bản, duyệt phạm vi và điều cấm |
| Rõ người dùng là ai, khoảnh khắc thấy app có ích | `/product-users` | khi có dịp hỏi 1–2 người: dùng 5–7 câu AI đưa, ghi vào `raw/` |
| Lên kế hoạch một phiên bản (bản đầu hoặc cập nhật) | `/product-plan` | gửi phiếu kick-off cho Dev trước 1 ngày · họp · báo lại kết quả |
| Viết PRD đủ để vẽ | `/product-spec` | nhận bàn giao sang bộ design (file được chép vào `product/sources/prd/`) |
| Có UI rồi, hoàn thiện để Dev làm | `/product-detail` | gửi docx cho người đọc, md cho agent của Dev; test phần [Lead kiểm] |
| Có yêu cầu mới giữa chừng | `/product-plan` | yêu cầu vào hàng chờ, chờ tới kỳ — trừ crash, bị store từ chối, vi phạm chính sách |

## Mỗi phiên bản đi thế nào
1. Yêu cầu dồn vào **hàng chờ** (`decisions.md`).
2. Tới kỳ (chu kỳ đặt ở kick-off) → gom thành **một bản có một mục tiêu**. Ít quá, lẻ tẻ → chờ kỳ sau.
3. Họp kick-off với Dev → chốt tính năng, ngày, **phạm vi kiểm lại**.
4. Spec → design → detail → Dev làm.
5. Kiểm: bạn kiểm dòng **[Lead kiểm]** (giao diện, chữ, trạng thái màn), Dev kiểm dòng **[Dev kiểm]** (logic, dữ liệu, quyền, thanh toán).

## Đọc gì, gửi gì
| File | Ai đọc |
|---|---|
| `docs/product/prd.md`, `requirements.md` | agent của Dev, bộ design, bộ build — đây là bản gốc |
| `docs/product/reader/prd.md`, `requirements.md` | **bạn đọc và sửa trong lúc làm** — viết lại cuối mỗi bước; phần bạn sửa được đưa vào bản làm việc ở bước sau |
| `docs/product/export/*.docx` | **bản gửi đi** — xuất khi phiên bản đủ để build (PRD xuất sớm khi bạn duyệt gửi Designer); lúc đó `reader/` bị xoá |
| `docs/product/decisions.md` | ai chốt gì, ngày nào, vì sao · hàng chờ yêu cầu |
| Figma / FigJam | luồng, sitemap, wireframe, UI, bảng, sơ đồ — xem bằng mắt, góp ý bằng comment |

**PRD và Figma / FigJam:** đầu PRD có khối "Đọc theo vai trò" (Dev đọc mục nào, Designer đọc mục nào); tiêu đề mục gắn [Dev] / [Design].
Hình không chép vào PRD, chỉ dẫn link, từ bước đầu tiên: có file Figma / FigJam nào thì đưa link, AI ghi vào đúng chỗ. Phần rẽ nhánh
(ai thấy paywall khi nào, hết lượt miễn phí thì sao, config…) viết thành bảng "nếu … thì …" trong PRD; AI vẽ sơ đồ lên FigJam từ bảng đó
nếu bạn đồng ý. Dev góp ý trên FigJam → AI sửa bảng rồi vẽ lại.

**PRD tự đủ, không cần Figma:** các phần UX đều viết thành chữ trong PRD — empathy map và persona (§5), phân tích tác vụ, sitemap dạng
cây, luồng lần đầu mở và luồng quay lại hằng ngày (§11), luồng + nhánh từng tính năng (§10). Tool demo đọc phần chữ này để vẽ luồng,
sitemap, wireframe, UI; vẽ xong thì link vào dòng "Hình:".

## Luật store
Bộ tự soát luật Apple và Google Play (theo nền tảng đã chọn) ở các phần ảnh hưởng tới tính năng: thanh toán, thuê bao, quyền, quảng cáo,
dữ liệu, app sức khoẻ. Hồ sơ nộp store (khai báo dữ liệu, cấu hình) để dành cho bộ ship sau này.

## Khi bộ làm sai
Nói thẳng chỗ sai. AI sửa, rồi ghi một dòng vào `.claude/skills/product-standards/references/toolkit-lessons.md` để lần sau không lặp lại.
