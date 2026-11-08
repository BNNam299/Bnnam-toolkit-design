# Kiểm thử thủ công trong Figma

`npm test` kiểm tra schema, bridge, MCP end-to-end (với plugin giả) và việc bundle `code.js` load được. Phần **vẽ thật trên canvas** chỉ kiểm tra được trong Figma desktop. Làm checklist này sau mỗi thay đổi ở `src/plugin/`.

Chuẩn bị: `npm run build`, mở một file Figma nháp, chạy plugin, Connect. Trong Claude Code, `/mcp` phải thấy `figma-agent` connected.

## A. Kết nối (P0/P1)
- [ ] Plugin hiện **Đã kết nối · <tên file>**. Sai token thì hiện *Token sai* và form token tự mở.
- [ ] Tắt Claude Code: plugin chuyển *Chờ MCP server…* và tự kết nối lại khi mở lại.
- [ ] `figma_status` liệt kê đúng file. Mở 2 file, gọi tool với `file` → đúng file.
- [ ] Mở 2 file mà **không** truyền `file` → server báo rõ "nhiều file đang mở" chứ không đoán bừa. Ghim file trong panel (menu → *File đích*) → tool điều khiển đúng file đã ghim.
- [ ] Bật thêm agent (Claude Code thứ hai, Pi…): `lsof -nP -iTCP:3055-3075 -sTCP:LISTEN` chỉ thấy **một** cổng 3055. `figma_status` ở agent mới báo `role: "agent"` và thấy đúng file; agent đầu báo `role: "hub"`, `agents` tăng.
- [ ] Tắt agent đang làm hub: trong vài giây một agent còn lại thành `hub`, plugin tự kết nối lại, tool ở agent kia chạy tiếp.
- [ ] Cổng 3055 bị figma-agent bản cũ chiếm: agent mới **không** mở 3056, `figma_doctor` báo check `port` đỏ kèm cách sửa.
- [ ] `figma_doctor` → 7 check, mọi lỗi đều có `fix`; `token` trong `figma_status` bị mask (chỉ 4 ký tự cuối) trừ khi truyền `includeToken: true`.
- [ ] **Sau khi sửa `manifest.json`: import lại plugin trong Figma** rồi `figma_doctor` check `manifest` phải xanh.

## A2. Panel plugin (300×300)
- [ ] Panel mở ra đúng **300×300**, header 1 dòng: dot + trạng thái + tên file + nút `⋯`.
- [ ] Menu `⋯` mở/đóng được, **không phủ lên** header hay log; mở token thì menu tự đóng.
- [ ] Đổi kích thước S/M/L → panel đổi đúng, nhớ lại sau khi đóng/mở plugin. Chọn L khi Figma không đủ chỗ → panel giữ size cũ và hiện thông báo.
- [ ] Thu phóng 80/100/150% → mọi thứ scale đồng bộ, không tràn ngang, nhớ lại sau khi đóng/mở.
- [ ] Khi chưa kết nối: form token hiện sẵn; khi đã kết nối và log rỗng: toolbar ẩn hẳn, chỉ còn header + log trống.
- [ ] Developer mode (menu) → khối "Test render_tree locally" hiện; tắt → footer biến mất.
- [ ] Bật/tắt theme Figma sáng/tối → panel đọc được, accent đủ contrast.

## B. Đọc
- [ ] `get_document_info` đúng tên page, top-level frame.
- [ ] Chọn 1 frame → `get_selection` có `layout`, `padding`, `fill` dạng hex hoặc `{var}`, text có `font`.
- [ ] `get_design_system` trên file có variables/styles/components: có modes, giá trị, properties của component set.
- [ ] `list_fonts` với `family: "Inter"` có "Semi Bold".
- [ ] `screenshot` trả ảnh hiển thị được trong Claude Code.

## C. render_tree
- [ ] Dán `examples/fintech-wallet.json` vào ô test trong plugin → Render: màn hình đặt cạnh các frame cũ (không ở 0,0), được chọn và zoom tới.
- [ ] Text trong card không bị cắt; "Highlands Coffee" có `maxLines: 1`; hai nút chia đều chiều ngang; icon SVG màu trắng 16px.
- [ ] Gradient của Balance Card đi từ góc trên trái xuống dưới phải (135°).
- [ ] Gửi cây có `widthMode: "FILL"` ở root → lỗi rõ ràng, **không còn lớp thừa** trên canvas.
- [ ] Ảnh từ URL (qua agent) và từ đường dẫn file local hiển thị đúng tỉ lệ.
- [ ] `instance` với component local theo tên + `variant` + `texts` đổi đúng.
- [ ] `{ "var": "..." }` cho fill và gap → Figma hiển thị biến đã bind.
- [ ] Cmd+Z một lần xoá toàn bộ cây vừa vẽ.

## D. Sửa
- [ ] `update_nodes` đổi text của layer dùng font khác Inter (font load đúng).
- [ ] Đổi `width` của frame auto layout đang HUG chiều cao → chiều cao vẫn HUG.
- [ ] Batch có 1 id sai → các id khác vẫn được cập nhật, id sai nằm trong `failed`.
- [ ] `move_nodes`, `clone_node`, `delete_nodes`, `select_nodes` hoạt động; Cmd+Z hoàn tác từng lệnh.

## E. execute_code
- [ ] `return figma.currentPage.children.length` trả số.
- [ ] Tạo component set 2 variant bằng `figma.combineAsVariants` → trả id.
- [ ] Code lỗi → `safeToRetryWithoutCanvasRead: false`; code sai cú pháp → "Syntax error".
- [ ] Vòng lặp lâu với `timeoutMs: 2000` → server báo timeout, plugin vẫn dùng được sau đó.

## F. Agent end-to-end
Prompt mẫu trong Claude Code:
1. "Thiết kế màn hình đăng nhập mobile cho app ngân hàng, tiếng Việt, dùng design system trong file nếu có."
2. "Chọn frame tôi đang chọn, đổi sang dark mode và tăng khoảng cách giữa các section lên 24."
3. "Rà soát màn hình đang chọn: text bị cắt, spacing lệch, độ tương phản; sửa luôn."

Đạt khi agent: kiểm tra file trước khi dựng, dựng bằng 1–2 lệnh `render_tree`, chụp `screenshot` và tự sửa lỗi nhìn thấy, không để lớp rác khi lỗi.

## H. figma-ui-flow tools (v1.1.0, trước đây figma-master)

Chạy trên page `🤖 Agent sandbox` của một file nháp. Trước tiên: `figma_status` → `versionCheck` phải ✅ (nếu ⚠️ thì đóng/mở lại plugin).

- [ ] `manage_pages{template: true}` → đủ 9 page đúng thứ tự; gọi lần 2 không tạo trùng.
- [ ] `search_design_system{query: "button"}` trên file có component → hit có `properties`; query vô nghĩa → `hint` gợi ý tạo mới.
- [ ] `import_tokens{path: <skill>/assets/tokens.example.json, dryRun: true}` → 2 collection; chạy thật → Primitives (scopes rỗng) + Semantic (alias). Gói free: cảnh báo mode Dark, không lỗi. Gọi lại lần 2 → mọi variable `skip`.
- [ ] `create_styles` 1 text (fontSize bind `{var}`), 1 paint `{var}`, 1 effect `md`, 1 grid `{preset: "mobile"}` → đủ 4 style; gọi lại với `onExisting: "error"` → lỗi, không sinh style thừa.
- [ ] `render_foundations{page: "🎨 Foundations"}` → swatch bind đúng variable (chọn chip → panel hiện tên variable), specimen dùng text style.
- [ ] `create_component_set` Button 2 State × 2 Size + property `Label` (TEXT) và `Has icon` (BOOLEAN) → panel Properties có đủ; instance đổi Label được; tên variant `Size=md, State=Default`.
- [ ] `create_component_set` với layer `targets` sai → cảnh báo, set vẫn tạo; variant trùng → lỗi, canvas sạch.
- [ ] `stress_test{id: <card>, modes: {"Semantic": "Dark"}}` → Section "Stress / …" ở Explore; `overflow` liệt kê text tràn.
- [ ] `render_tree` với `{type: "section", name: "Login", children: [3 frame]}` → Section bọc 3 màn, cách nhau 200.
- [ ] `set_interactions` NAVIGATE + SMART_ANIMATE `{var: "duration/base"}` → Present chạy đúng, duration 0.25s; `flowStart` hiện trong Prototype panel.
- [ ] `audit_design` trên màn có stroke trần, radius trần, lorem → có `raw-stroke`, `raw-radius`, `lorem`; text trên nền gradient → tỉ lệ thật (không còn `needs-check`).
- [ ] `bind_variables{rootId}` (dryRun) → `changes` + `ambiguous`; `dryRun: false` → fill bind variable; audit raw-fill giảm.
- [ ] `rename_by_rule{rootId}` (dryRun) → `Text 3` → `label/…`; `dryRun: false` đổi thật, Cmd+Z hoàn tác.
- [ ] `annotate` → Dev Mode hiện annotation; `set_dev_status` Section → "Ready for dev".
- [ ] `export_tokens{format: "css", path: /tmp/t.css}` và `swift`/`kotlin` → file mở được, alias đúng.
- [ ] `export_assets{ids, scales: [1,2,3], outDir}` → `name.png`, `name@2x.png`, `name@3x.png`.

## G. Kết quả kiểm thử thực tế (Figma desktop)

Đã chạy đủ **16/16 tool** trên một page test riêng rồi xoá page đó (thiết kế gốc không đổi). Trạng thái: `render_tree` (frame/text/rect/ellipse/svg/gradient 135°/`component`/`instance` + `texts`/`{var}`/paint-text-effect style), `update_nodes` (batch + `failed` tách từng id), `move_nodes` (reparent), `clone_node` (parent + index), `delete_nodes`, `select_nodes`, `screenshot`, `get_node`, `find_nodes`, `get_selection`, `get_document_info`, `set_current_page`, `get_design_system`, `list_fonts`, `execute_code`.

Ghi chú để không vấp lại:

- Sai tên tham số sẽ bị Zod chặn trước khi tới Figma: `update_nodes` dùng `updates: [{ id, props }]` (không phải `ops`/`properties`).
- Định dạng gradient trong DSL: `{ gradient: "LINEAR", angle: 135, stops: [{ color, position }] }`; ép style bằng `{ style: "Tên style" }`; text style bằng `textStyle`, effect style bằng `effects: { style }`.
- **API Figma:** biến dùng `setValueForMode(modeId, value)` — `setValueByMode` không tồn tại. `figma.util.rgb` có, nhưng `figma.util.solid` **không** có ở build này → dùng helper `h.solid(hex)`.
- Gói Figma hiện tại **giới hạn 1 mode mỗi collection**: `addMode` báo `Limited to 1 modes only` (lỗi rõ ràng, không hỏng gì).
- `render_tree` lỗi giữa chừng (vd `widthMode: "FILL"` ở root) → dọn sạch, không để lớp rác, `safeToRetryWithoutCanvasRead: true`.
- ⚠️ **`execute_code` không thể ngắt**: một vòng lặp vô hạn (`while(true)`) chặn luồng chính của plugin; server báo timeout 30 s nhưng Figma sẽ tự đóng sandbox, plugin mất kết nối và **phải chạy lại plugin** (Plugins → Development). Server/bridge vẫn sống. Vì vậy `timeoutMs` chỉ ngăn phía MCP chờ, không dừng được code trong plugin — đừng viết vòng lặp không có điều kiện kết thúc.
- Plugin tự kết nối lại sau khi chạy lại (không cần khởi động lại server).

### H. Kết quả smoke test figma-ui-flow tools (2026-10-19, Figma desktop, gói 1 mode)

Đã chạy đủ 16 mục ở H trên file thật (page tạo bằng `manage_pages{template}`). v1.1.0 lộ ra 10 lỗi, đã sửa ở 1.1.1 và kiểm lại trên canvas:

- Lỗi validate xảy ra *trước khi ghi* giờ trả `safeToRetryWithoutCanvasRead: true` (`create_variables`, `create_component_set`, `create_styles`).
- `stress_test`: `absoluteRenderBounds` đã bị parent cắt nên không bao giờ thấy chữ tràn — dùng `absoluteBoundingBox`.
- `create_component_set`: độ rộng set có số lẻ làm ô cuối rớt hàng (+2px dư); property không gắn được layer nào thì bị gỡ thay vì để mồ côi.
- `bind_variables`: bỏ qua instance (override) và Section (fill mặc định của canvas).
- `audit_design` `orphan-token`: quét cả file, không chỉ subtree; 1.1.2 thêm grid style.
- `get_design_system{usedIn}`: binding của paint không còn bị đếm đôi.
- `search_design_system` hiện đích của alias; `render_foundations` trả kết quả gọn thay vì map hàng trăm id.

Ghi chú: `import_tokens` trên gói 1 mode ghi mode đầu (Light) và cảnh báo Dark — đúng thiết kế. Annotation đọc lại có cả `label` và `labelMarkdown`. Grid không hiện trong ảnh `screenshot` (Figma không export grid) — kiểm bằng `layoutGrids`.
