# PRD — <Tên app>

**Phiên bản tài liệu**: <x.y> · **Phiên bản app đang viết**: <1.0.0>
**Cập nhật**: <dd/mm/yyyy> · **Người viết**: <PO / AI soạn, PO duyệt>
**Trạng thái**: <Đang viết bản 1.0.0 — mức Đủ để thiết kế / …>

<!-- Cách viết: product-standards/references/writing.md. Mã số và mức của tính năng: references/ids-and-states.md.
     Mục nào chưa tới lượt: chỉ heading + "Chưa làm — <skill>". Không để bảng rỗng.
     Phần A ít đổi. Phần B lớn dần theo từng tính năng. Phần C ghi từng phiên bản.
     Phần đã phát hành không viết lại — đổi gì cũng ghi ở Lịch sử tài liệu + decisions.md. -->

## 0. Đọc nhanh
- Đang làm: <app gì, cho ai, đang viết phiên bản nào>
- Tình trạng: <bao nhiêu tính năng ở mức nào — vd. 6 tính năng Đủ để thiết kế, 0 Đủ để build>
- Cần chốt: <quyết định đang chờ ai, hạn khi nào — hoặc "chưa có">
- Bước tiếp: <bước + skill cần gọi>

### Đọc theo vai trò
<!-- Cập nhật mỗi khi một bước điền thêm mục. Mục chưa làm thì ghi "chưa có". Hình vẽ (luồng, sitemap, wireframe, UI, sơ đồ)
     nằm ở Figma / FigJam — chỉ dẫn link, không chép vào đây. -->
| Vai trò | Đọc mục nào | Xem hình ở đâu |
|---|---|---|
| Dev | §1 nền tảng · §4 điều cấm · §8 kiếm tiền (bảng nhánh) · §9 ràng buộc mobile · §10 luồng và nhánh không suôn sẻ từng tính năng · §11 sitemap và luồng tổng · §13 phạm vi kiểm lại · requirements.md: FR + tiêu chí [Dev kiểm], quyền và dữ liệu, câu hỏi DQ | <link Figma / FigJam — hoặc "chưa có"> |
| Designer | §5 người dùng, empathy map, khoảnh khắc thấy app có ích · §4 điều cấm · §8 chỗ hiện paywall / quảng cáo · §10 luồng và nhánh không suôn sẻ · §11 phân tích tác vụ, danh sách màn, sitemap, luồng tổng · §12 onboarding · requirements.md: tiêu chí [Lead kiểm] | <link Figma / FigJam — hoặc "chưa có"> |

## 1. Thông tin dự án · [Dev]

### Người tham gia
| Vai trò | Tên | Trách nhiệm |
|---|---|---|
| Lead (designer) | <tên> | Chạy bộ market / product, chốt hoặc đưa ra họp; kiêm PO, UX/UI, ASO, đọc số; test giao diện |
| Dev iOS | <tên / không làm bản này> | Trả lời khả thi, ước công, làm app, test logic / dữ liệu / thanh toán |
| Dev Android | <tên / không làm bản này> | như Dev iOS |
| Khác (nếu có) | | BE, AI, đồ hoạ… — ghi khi dự án cần |

### Nền tảng và nhịp ra bản
- Nền tảng: <iOS / Android / cả hai — cái nào trước> (D-…)
- Chu kỳ ra bản: <n tuần> (đặt ở kick-off, D-…) · bản vá ngoài chu kỳ chỉ khi: crash, bị store từ chối, vi phạm chính sách

### Lịch sử tài liệu
| Ngày | Phiên bản tài liệu | Đổi gì | Vì sao | Người |
|---|---|---|---|---|

### Liên kết
| Nội dung | Link |
|---|---|
| Nghiên cứu thị trường | docs/market/market-report.md |
| Luồng, sitemap (kiến trúc thông tin) — Figma / FigJam | <link / chưa có> |
| Wireframe, UI — Figma | <link / chưa có> |
| Bảng, sơ đồ rẽ nhánh, làm việc nhóm — Figma / FigJam | <link / chưa có> |
| Luồng màn của bộ design | design/flows.md <hoặc chưa có> |
| Yêu cầu chi tiết | docs/product/requirements.md |
| Sổ quyết định | docs/product/decisions.md |

# Phần A — Cấp sản phẩm

## 2. Tóm tắt                                                    <!-- product-kickoff -->
<Câu đầu: app giải vấn đề gì cho ai, khác các app khác ở đâu.>

### Vấn đề và giải pháp
| # | Vấn đề (cơ chế → hệ quả đo được) | Bằng chứng | Giải pháp tương ứng |
|---|---|---|---|

### Vì sao là lúc này
- <tín hiệu ngoài + nguồn; câu phải sai nếu lùi 3 năm>

### Định vị
- Từ → tới: <app hiện có làm X → app mình làm Y>
- Cho <ai> đang <vấn đề>, <app> là <loại app> giúp <kết quả>, khác <đối thủ> ở chỗ <khác biệt>.

### Tiêu chí thành công
- <trạng thái kiểm được; con số cụ thể ở §7>

## 3. Mục tiêu và nguyên tắc                                    <!-- product-kickoff -->
- Mục tiêu sản phẩm: <ra mắt gì, cho ai, tới trạng thái nào>
- Công ty cần gì từ dự án: <doanh thu mới / học một dòng app / lấp danh mục…>

**Nguyên tắc** (dùng để phân xử khi tranh cãi):
| # | Ưu tiên … hơn … | Tính năng hợp lý mà nguyên tắc này loại bỏ |
|---|---|---|

## 4. Phạm vi và điều cấm · [Dev] [Design]                                       <!-- product-kickoff; product-plan cập nhật -->
**Bản đầu phải chứng minh:** <một câu>

### Trong phạm vi
| Hạng mục | Vì sao cần ở bản này |
|---|---|

### Ngoài phạm vi, đã cân nhắc
| Hạng mục | Vì sao chưa làm | Xét lại khi nào |
|---|---|---|

### Điều cấm
| Mã | Bị cấm | Vì sao | Ai được mở khoá |
|---|---|---|---|
| BAN-01 | | | PO, qua decisions.md |

### Không được cắt trong mọi trường hợp
| Hạng mục | Vì sao không được cắt | Cắt thì hỏng thế nào |
|---|---|---|

## 5. Người dùng · [Design]                                                 <!-- product-users -->
<Câu đầu: người dùng chính là ai, họ thuê app làm việc gì.>

### Persona
#### <PER-01 · Tên — một dòng định vị> · <dữ liệu thật / GIẢ ĐỊNH (proto)>
- Bối cảnh: …
- Hành vi thật: … (M#…)
- Mục tiêu cuối: …
- Nỗi đau: … (M#…)
- Động lực (vì sao họ cố làm việc này): …
- Cần (dạng kết quả): …

#### Empathy map — PER-01 (từ bằng chứng, không tưởng tượng)
| Ô | Nội dung (nguồn M# / P#) |
|---|---|
| Nói | <lời nguyên văn> |
| Nghĩ | <điều họ lo, tin — suy ra, ghi độ tin> |
| Làm | <hành vi thật, cách xoay xở> |
| Cảm thấy | <cảm xúc ở khoảnh khắc gặp vấn đề> |
| Nỗi đau | … |
| Điều muốn có | … |

#### Mô hình tư duy — PER-01 (cầu nối từ hôm nay sang tính năng)
| Quá khứ (công cụ, app, thói quen đang gặp) | Hiện tại (hành vi, nỗi đau) | Tương lai (điều có thể thay đổi dòng này) |
|---|---|---|

### Việc người dùng cần làm
| Mã | Khi … tôi muốn … để … | Persona | Bằng chứng |
|---|---|---|---|

### Ai không phải người dùng
- <nhóm> — <vì sao không thiết kế cho họ>

### Hành trình
| Giai đoạn | Hiện tại (không có app) — làm gì, cảm thấy gì | Chỗ vỡ | Mong muốn (có app) | Động lực · chỉ số của team |
|---|---|---|---|---|

Đánh dấu ⭐ ở khoảnh khắc sự thật.

**Khoảnh khắc thấy app có ích:** <hành động cụ thể> · đường ngắn nhất <N> bước từ lần mở đầu.

## 6. Cạnh tranh và khác biệt                                    <!-- product-kickoff -->
<Tóm 3–5 dòng, trỏ về docs/market/market-report.md §4. Không chép lại bảng đối thủ.>

| Khác biệt (≤ 3) | Đối thủ đang yếu ở đâu | Khó sao chép vì |
|---|---|---|

## 7. Chỉ số — bản nháp                                          <!-- product-plan -->
> Bản nháp — sẽ chuyển sang bộ measure khi có.

| Tầng | Chỉ số | Công thức (tử / mẫu / cửa sổ) | Mốc tham chiếu | Mục tiêu bản này |
|---|---|---|---|---|
| Chỉ số chính | | | | |
| Đầu vào | | | | |
| Rào chắn | | | | |

## 8. Kiếm tiền — bản nháp · [Dev] [Design]                                       <!-- product-plan quyết; product-detail chi tiết -->
> Bản nháp — sẽ chuyển sang bộ monetize khi có.

- Mô hình: <thuê bao / mua đứt / quảng cáo / lai> — vì <hành vi dùng của persona>
- Kịch bản onboarding + paywall: <xương sống KBx + lớp KBy> — vì <…>; kịch bản loại sát nút: <…>

### Miễn phí và trả phí
| Phần | Miễn phí | Trả phí | Vì sao chia vậy |
|---|---|---|---|

### Gói và giá
| Mã gói | Chu kỳ | Giá (theo nước) | Dùng thử | Neo đối thủ |
|---|---|---|---|---|

### Paywall và quảng cáo hiện ở đâu
| Điểm chạm | Loại (paywall / rewarded / interstitial / banner) | Người dùng đã thấy giá trị chưa | Ghi chú |
|---|---|---|---|

### Rẽ nhánh — ai thấy gì, khi nào
<!-- Bảng là bản gốc; sơ đồ trên FigJam vẽ từ bảng. Bảng đổi → vẽ lại. Dev góp ý trên FigJam → sửa bảng trước. -->
| # | Nếu (điều kiện) | Thì (app làm gì) | Ngược lại | Nguồn (D-, BR-, FR-) |
|---|---|---|---|---|

Sơ đồ: <link FigJam — chưa có>

## 9. Ràng buộc mobile · [Dev]                                           <!-- product-spec -->
| Nhóm | Mức mặc định của team | Dự án này |
|---|---|---|
| Nền tảng | iOS, iPhone; iOS tối thiểu <…> | |
| Hiệu năng | mở app < 2,0 giây trên máy yếu nhất; crash-free ≥ 99,5% | |
| Mất mạng và đồng bộ | | |
| Thông báo | xin quyền khi cần; nhắc tối đa 1 lần/ngày | |
| Trợ năng | vùng chạm ≥ 44pt; cỡ chữ hệ thống; VoiceOver | |
| Riêng tư | dữ liệu tối thiểu; có xoá tài khoản nếu có tài khoản | |
| Sẵn sàng phát hành | khôi phục mua hàng; thử mất mạng; thử từ chối quyền | |

# Phần B — Tính năng

## 10. Bảng tính năng · [Dev] [Design]                                           <!-- product-plan; product-spec / product-detail cập nhật mức -->
| Mã | Tính năng | Giải gì (bằng chứng) | Ưu tiên | Mức | Bản |
|---|---|---|---|---|---|

### FEAT-01 · <tên>                                             <!-- lặp khối này cho mỗi tính năng -->
- Mức: <Đề xuất / Đủ để thiết kế / Đủ để build / Đã phát hành> · Bản: <1.0.0> · Ưu tiên: <P0>
- Cho ai, giải gì: <PER-01 · JTBD-01 · M#…>
- Người dùng làm gì: <2–3 dòng hành vi>
- Luồng chính: 1. … → 2. … → 3. …
- Khi không suôn sẻ: <từ chối quyền / mất mạng / lỗi / trống — mỗi nhánh đi đâu>
- Rẽ nhánh (khi có ≥ 2 điều kiện, ví dụ config, gói, lượt miễn phí): bảng "Nếu … thì … · ngược lại …" ngay dưới dòng này
- Giữ chân (với nhắc nhở, chuỗi ngày, thông báo): kiểu nhắc <mồi / hướng dẫn từng bước / báo hiệu> · vòng <nhắc → làm → thưởng → điều người dùng bỏ vào>
- Hình: <link frame Figma / FigJam của luồng này — chưa có>
- Quyền và dữ liệu: <PRM-…, DATA-…> · Paywall / quảng cáo chạm ở: <…>
- Yêu cầu: <UC-…, FR-…> trong requirements.md
- Câu hỏi cho Dev: <DQ-…> · Trả lời của Dev: <khả thi / khó / không / chưa trả lời — nguồn, ngày>

<!-- Từ mức Đủ để build (product-detail) thêm: -->
#### Quy tắc từng màn
| Màn | Thành phần | Làm gì | Quy tắc | Mặc định |
|---|---|---|---|---|

#### Trường hợp khác
| Màn | Trường hợp | Hành động |
|---|---|---|

#### Thay đổi ở các bản sau
| Bản | Đổi gì | Quyết định |
|---|---|---|

## 11. Danh sách màn, sitemap và luồng · [Dev] [Design]                                            <!-- product-spec; product-detail dùng tên trong design/flows.md -->
| Mã | Màn | Thuộc tính năng | Ưu tiên | Phụ thuộc | Hình (link frame) |
|---|---|---|---|---|---|

### Phân tích tác vụ
| Mục đích của người dùng | Nhiệm vụ | Hành động (bước nhỏ nhất) | Tính năng · màn |
|---|---|---|---|

### Sitemap (dạng chữ)
Kiểu điều hướng: <tab / tuyến tính / phân cấp / hub> — vì <…>
```
<App>
├─ SCR-01 …
│  └─ SCR-0x …
└─ SCR-0y …
```
Hình: <link Figma / FigJam — chưa có>

### Luồng tổng (dạng chữ)
**Lần đầu mở → khoảnh khắc thấy app có ích:** 1. SCR-… → 2. SCR-… ◇ <điều kiện>? → Có: 3 / Không: 2b → …
**Quay lại hằng ngày:** 1. <nhắc / widget / icon> → SCR-… → …
Hình: <link Figma / FigJam — chưa có>

**Màn hay quên:** paywall (có khôi phục mua hàng) · xin quyền + khi bị từ chối · lỗi mạng · hết lượt miễn phí · hỏi đánh giá · vị trí quảng cáo · trạng thái trống lần đầu.

## 12. Onboarding · [Design]                                                <!-- product-spec khung; product-detail từng màn -->
| Bước | Câu hỏi / nội dung | Để làm gì | Kiểu trả lời | Bỏ được không |
|---|---|---|---|---|

Hình: <link luồng onboarding trên Figma / FigJam — chưa có>

# Phần C — Phiên bản

## 13. Lộ trình phiên bản · [Dev]                                        <!-- product-plan -->
| Bản | Phải chứng minh | Tính năng | Chỉ số đo | Ngày chốt | Trạng thái |
|---|---|---|---|---|---|

**Phạm vi kiểm lại của bản đang làm** (mỗi bản một khối):
| Thay đổi | Màn / chức năng phải kiểm lại | Lead kiểm (giao diện) | Dev kiểm (logic, dữ liệu, thanh toán) |
|---|---|---|---|

## 14. Rủi ro, giả định, câu hỏi mở                              <!-- mọi bước -->
| Loại | Nội dung | Nếu sai / nếu xảy ra thì sao | Cách kiểm / giảm | Ai, hạn |
|---|---|---|---|---|

## 15. Phụ lục

### Bằng chứng mới của bộ product
| Mã | Nhận định | Nguồn | Ngày | Độ tin |
|---|---|---|---|---|

### Phương pháp đã dùng
| Phương pháp | Dùng ở mục | Để giải việc gì | Ra kết quả gì | Nguồn |
|---|---|---|---|---|

### Lần soát gần nhất
<Kết quả product-standards/references/quality-gates.md — ngày, cổng nào đạt, cổng nào chưa và vì sao.>

### Biên bản họp
<Mỗi buổi: ngày · thành phần · đã chốt gì (D-…).>
