# Tra cứu nhanh — gọi skill nào cho việc gì

27 skill nằm trong `.claude/skills/`. Bảng dưới đây giúp gọi **đúng một skill cho đúng việc**, để Claude không nạp kiến thức thừa.

## Cách gọi

| Cách | Khi nào | Ví dụ |
|---|---|---|
| **Gọi thẳng** `/tên-skill` + việc cần làm | Biết rõ mình cần gì → nhanh và chắc nhất | `/figma-ui-flow phác nhanh màn Home cho app thiền` |
| Nói tên skill trong câu | Như trên, khi không tiện gõ lệnh | "dùng skill ux-writing viết chữ cho màn lỗi mạng" |
| Chỉ tả việc | Chưa biết skill nào → Claude tự chọn theo mô tả | "review luồng checkout này giúp tôi" |

> Claude chỉ đọc nội dung skill khi việc chạm tới. Gọi thẳng giúp chọn đúng ngay lần đầu, không đoán nhầm sang skill na ná.

## Bảng tra theo việc

### Từ ý tưởng đến danh sách màn
| Việc | Gọi | Câu mẫu |
|---|---|---|
| Đọc PRD, tìm mâu thuẫn, liệt kê màn + trạng thái, làm luồng | `prd-to-ux-flow` | "đọc PRD này, liệt kê màn và luồng" |
| Phân tích đối thủ (lấy cấu trúc, không chép nội dung) | `prd-to-ux-flow` | "phân tích 3 app đối thủ cho màn onboarding" |
| Phác wireframe dạng chữ / wireframe xám trước UI | `prd-to-ux-flow` | "phác wireframe luồng đăng ký" |

### Dựng UI trên Figma
| Việc | Gọi | Câu mẫu |
|---|---|---|
| **Dựng màn** (Phác nhanh / Theo mẫu / Dựng mới) | `figma-ui-flow` | "phác nhanh màn paywall", "dựng màn Home theo mẫu màn Settings" |
| Chuẩn team: khung 402×874, root `NONE`, Top / Content / Bottom, đặt tên, chốt màn | `bnnam-standards` | "màn này đúng chuẩn team chưa?" |
| Bố cục, khoảng cách, mật độ, phân cấp, mẫu theo loại màn, paywall | `mobile-ui-master` | "khoảng cách màn này ổn chưa", "wireframe màn Settings" |
| Trạng thái (rỗng, lỗi, tải, offline), sheet hay dialog, cử chỉ, accessibility | `mobile-ux-fundamentals` | "màn danh sách cần những trạng thái nào" |
| Chữ trong màn: nút, lỗi, rỗng, quyền, giọng văn | `ux-writing` | "viết chữ cho onboarding 3 bước" |
| Nền màu loang (blur) thành component `Background/…` | `screen-background` | "làm nền gradient tím cho màn Home" |
| Prototype bấm thử để so phương án | `figma-prototype-flow` | "nối prototype luồng onboarding" |
| Làm màn theo một phong cách / ảnh mẫu | `ios-style-screen-creator` | "làm màn theo phong cách glassmorphism" |

### Dự án Figma có sẵn
| Việc | Gọi | Câu mẫu |
|---|---|---|
| Đọc dự án đang chạy, sơ đồ luồng, chỗ thiếu; sửa màn trên bản `_Fix AI`; thêm màn | `figma-project-maintain` | "đọc file này, báo dự án đang ở đâu" |
| Hệ thống thiết kế: dò quy ước, soát biến / style / component, gắn biến, kit | `design-system-audit` | "soát hệ thống biến của file" |
| Xuất ảnh từ link Figma, dọn section lộn xộn | `figma-export-and-tidy` | "xuất 2 cột đầu ở 2x" |

### Hình ảnh
| Việc | Gọi | Câu mẫu |
|---|---|---|
| Viết prompt sinh ảnh (một ảnh hoặc cả bộ ảnh cùng phong cách) | `generating-oneshot-image-prompts` | "prompt ảnh minh hoạ cho 4 màn onboarding" |
| Sinh một icon / mascot / sticker nền trong suốt | `app-asset-generator` | "làm mascot con mèo nền trong" |
| Vẽ / sửa minh hoạ vector ngay trên Figma (cảnh widget, màn rỗng, onboarding): bóng không lòi, mưa tự nhiên, gom nhóm | `figma-vector-illustration` | "vẽ lại minh hoạ widget thời tiết, bóng đang bị lòi ra" |

### Kiểm tra và bàn giao
| Việc | Gọi | Câu mẫu |
|---|---|---|
| Review UX cả luồng (thang 0–4), audit màn bằng script, bàn giao dev | `ux-review-handoff` | "review UX luồng checkout", "audit page UI Design" |
| Paywall / gói thuê bao / quảng cáo / quyền có bị store từ chối không | `app-store-policies` | "paywall này có bị reject không" |

### Nền tảng (tra cứu chuẩn)
| Việc | Gọi |
|---|---|
| Màn iPhone theo HIG (cỡ, thanh trên, tab bar, sheet, Dynamic Type) | `apple-design-iphone` |
| Màn iPad (split view, sidebar, popover) | `apple-design-ipad` |
| Widget, Live Activity, Dynamic Island (kèm mẫu bố cục từ app thật) | `apple-design-widget` |
| Widget Android, hoặc một widget cho cả iOS và Android | `android-design-widget` |
| iPhone Duo (gập), màn co giãn nhiều cỡ | `iphone-duo-adaptive` |
| Android / Material 3 | `material-design-3` |
| Website (marketing site, landing page) | `web-design` |
| Nguyên văn trang HIG của Apple | `apple-hig` — thường do skill khác tự tra, ít khi phải gọi thẳng |
| Viết file `DESIGN.md` cho dự án | `design-md-writer` |
| Cách dùng từng tool của plugin figma-agent | `figma-agent-tools` — `figma-ui-flow` tự nạp, không cần gọi |

## Gọi theo giai đoạn dự án

```
PRD ──► prd-to-ux-flow ──► figma-ui-flow ──► ux-review-handoff
        (màn + luồng)      (dựng màn)        (review + bàn giao)
```
Trong lúc dựng, `figma-ui-flow` tự gọi thêm skill khác khi việc chạm tới: chuẩn team, bố cục, chữ, nền, ảnh — và **chính sách store khi màn là paywall / quảng cáo / xin quyền**.

## Muốn dựng UI nhanh hơn

Khi chỉ cần **ra hình**, gọi thẳng `figma-ui-flow` và **nói rõ phạm vi** — Claude sẽ bỏ các bước kiểm không cần:

| Nói thêm trong câu | Bỏ được |
|---|---|
| "**phác nhanh**" | Lượt 3 (audit + stress test + Definition of Done); màu thô, chưa gắn biến, chưa tạo component |
| "**bỏ kiểm chính sách store**" | Không nạp `app-store-policies` (paywall vẫn có giá, Restore, Terms nhưng không soát từng luật) |
| "**chữ tạm cũng được**" / "**không review chữ**" | Không soát chữ theo `ux-writing` |
| "**duyệt sẵn, cứ dựng**" | Không dừng chờ duyệt, làm một hướng thiết kế thay vì đưa 2–3 hướng để chọn |

Ví dụ:
```
/figma-ui-flow phác nhanh màn paywall cho app thiền, bỏ kiểm chính sách store, duyệt sẵn cứ dựng trên page "Draft"
```

**Lưu ý thật:**
- Phần lớn thời gian là **dựng và kiểm trên Figma**, không phải đọc skill. Test 28/10: một màn paywall Phác nhanh mất ~9,5 phút; đọc skill chỉ chiếm một phần nhỏ. Bỏ kiểm giúp nhanh hơn chủ yếu vì **ít lượt sửa** hơn.
- Bỏ kiểm thì **phải kiểm lại trước khi chốt**: màn bán hàng phải qua `app-store-policies`, màn hoàn chỉnh phải qua lượt 3 (audit). Khi chốt, nói "**chốt màn <tên>**".
- Chuẩn team (khung, Safe-Area, 3 vùng, CTA 56, khoảng cách theo quan hệ) **luôn áp dụng**, kể cả khi phác nhanh — đó là cấu trúc, không phải bước kiểm.

## Chuẩn bị trước khi làm việc với Figma

1. `npm install` rồi `npm run build` (lần đầu, hoặc sau khi kéo code mới).
2. Figma desktop → Plugins → Development → **figma-agent-UI** (build mới thì đóng plugin, mở lại).
3. Mở Claude Code trong thư mục này, chấp nhận server `figma-agent` khi được hỏi.
