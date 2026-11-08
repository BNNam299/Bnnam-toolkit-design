# figma-agent-UI

Plugin Figma + MCP server giúp AI agent (Claude Code, hoặc bất kỳ MCP client nào) **đọc, tạo, sửa và tự chụp màn hình kiểm tra** thiết kế ngay trong file Figma đang mở.

```
Claude Code ──stdio──► MCP server (dist/server.mjs)
                          │  WebSocket ws://localhost:3055 (chỉ loopback, có token)
                          ▼
                        ui.html (iframe plugin) ──postMessage──► code.js (figma API)
```

## Cài đặt

```bash
npm install
npm run build          # code.js (plugin) + dist/server.mjs (MCP server)
```

1. **Figma desktop** → Plugins → Development → *Import plugin from manifest…* → chọn `manifest.json`.
2. **Claude Code**: mở thư mục này, `.mcp.json` sẽ đăng ký server `figma-agent` (chấp nhận khi được hỏi). Với client khác, chạy `node /đường/dẫn/dist/server.mjs` qua stdio.
3. Lấy token: `cat ~/.figma-agent/token` (tạo ở lần chạy đầu), hoặc gọi tool `figma_status`.
4. Trong Figma chạy plugin **figma-agent-UI**, dán token → **Connect**. Token được lưu, lần sau plugin tự kết nối.

Nhiều agent (Claude Code, Pi, opencode…) dùng chung **một cổng**: server khởi động đầu tiên làm *hub* ở 3055 và giữ kết nối với plugin; các server sau nối vào hub thay vì mở cổng mới, lệnh của chúng đi qua hub. Agent giữ hub thoát thì các agent còn lại tự bầu hub mới và plugin tự kết nối lại. `figma_status` cho biết `role` (`hub`/`agent`) và số `agents`. Xem `PLAN-hub.md`.

Biến môi trường: `FIGMA_AGENT_TOKEN` (cố định token), `FIGMA_AGENT_PORT` (mặc định 3055), `FIGMA_AGENT_HUB=0` (tắt hub: mỗi server tự lấy một cổng trong dải `FIGMA_AGENT_PORT_RANGE`, mặc định 3055–3075), `FIGMA_AGENT_PORT_FILE` (nơi ghi port thật, mặc định `~/.figma-agent/port`), `FIGMA_AGENT_MANIFEST` (đường dẫn `manifest.json` cho `figma_doctor`), `FIGMA_AGENT_MAX_OUTPUT` (giới hạn ký tự kết quả, mặc định 20000).

### Khi nhiều MCP client chạy cùng lúc

Cổng **không còn cố định**. Server dò port trống trong dải 3055–3075 và ghi port thật vào `~/.figma-agent/port`; panel plugin cũng dò đúng dải đó nên tự tìm thấy server. Client thứ hai lấy port trống tiếp theo thay vì làm server chết.

> `devAllowedDomains` trong `manifest.json` liệt kê **21 cổng** `ws://localhost:3055…3075`. Sửa `manifest.json` ⇒ **phải import lại plugin trong Figma** (Figma cache manifest lúc import).

### Timeout

- openCode: `timeout` trong `opencode.json` là thời gian **lấy danh sách tool**, không phải thời gian chạy tool → không cần chỉnh.
- Claude Code: mặc định rất dài (`MCP_TOOL_TIMEOUT`), idle 30 phút với stdio → không cần chỉnh. Nếu đặt `timeout` riêng cho server trong `.mcp.json`, đặt ≥ 300000 cho các tool dài (`import_tokens`, `render_foundations`, `execute_code`).

> Ghi chú: `directTools` trong `.mcp.json` **không** được Claude Code hỗ trợ (đã kiểm tra binary + tài liệu) — giữ lại để tương thích client khác, nhưng với Claude Code nó không có tác dụng.

## Tool

| Nhóm | Tool |
|---|---|
| Kết nối | `figma_status` (kèm `versionCheck`: cảnh báo khi plugin trong Figma khác bản build của server; token được **mask**, thêm `includeToken: true` để lấy đầy đủ), `figma_doctor` (chẩn đoán 1 lệnh: port, token, plugin, version, capability, manifest — mỗi lỗi kèm cách sửa) |
| Đọc | `get_document_info`, `set_current_page`, `get_selection`, `get_node`, `find_nodes`, `get_design_system` (`usedIn`: token đang bind trong một node), `list_fonts`, `search_design_system` |
| Tạo | `render_tree`: dựng cả màn hình từ cây JSON (section/frame/auto layout/layout grid, text, rect, ellipse, svg, image, instance) |
| Sửa | `update_nodes`, `delete_nodes`, `move_nodes`, `clone_node`, `select_nodes` |
| Design system | `manage_pages`, `create_variables`, `import_tokens` (DTCG, lint giống `check_tokens.py`), `create_styles`, `render_foundations`, `create_component_set` |
| Prototype | `set_interactions` (Smart Animate, motion token, interactive component, flow start) |
| QA | `audit_design`, `stress_test`, `bind_variables`, `rename_by_rule` (hai tool sau mặc định dryRun) |
| Bàn giao | `annotate`, `set_dev_status`, `export_tokens` (json/css/swift/kotlin), `export_assets` |
| Mọi thứ khác | `execute_code`: chạy JS Plugin API (`figma`, helper `h`) |
| Kiểm tra | `screenshot`: trả PNG để agent tự nhìn |

Mọi tool nhận `page` (id/tên) để chạy trên page đó rồi trả page cũ, nên nhiều agent chạy song song không ghi nhầm page.

**Phiên bản:** mỗi lần nâng cấp plugin thì tăng `version` trong `package.json`. `npm run build` gắn version + commit vào cả plugin và server. Bảng plugin hiện `Plugin <version> (<commit>)`, còn `figma_status` báo ⚠️ khi plugin đang mở là bản cũ: đóng và mở lại plugin trong Figma. Server cũng **tự nhận diện lệnh thiếu**: plugin báo danh sách lệnh nó hỗ trợ, nên gọi tool chưa có sẽ ra thông báo *"plugin là bản cũ, thiếu lệnh X"* thay vì "Unknown command".

**Panel plugin (300×300):** panel mặc định nhỏ gọn 300×300. Menu `⋯` gộp mọi thứ: đổi kích thước (S 240×240 · M 300×300 · L 420×560), thu phóng 80–150%, chọn file đích cho agent, developer mode, và chi tiết kết nối (port, user, phiên bản, file key, số lệnh). Nhật ký lệnh ở giữa panel, có lọc / xoá / sao chép / mở rộng JSON. Mọi thành phần nằm trong luồng — không có gì chồng lên nhau.

Bảng tra nhanh skill nào cho việc gì, cách gọi thẳng `/tên-skill` và cách dựng UI nhanh: [HUONG-DAN-SKILL.md](HUONG-DAN-SKILL.md).

Agent có 2 skill chính (Claude Code tự nạp): `.claude/skills/figma-agent-tools/` là sổ tay mọi tool MCP (tham số, kết quả, lỗi, công thức `execute_code`, ảnh gemini); `.claude/skills/figma-ui-flow/` là luồng và kiến thức tạo UI: 11 luật, 8 giai đoạn có gate, và vòng dựng màn từ ngoài vào trong theo 3 lượt (`references/build-loop.md`: bố cục với block giữ chỗ có kích thước → lấp đầy bằng component và nội dung → chốt bằng audit/stress; kiểm tra số liệu sau mỗi lần ghi, chụp màn hình một lần mỗi lượt; 3 chế độ Phác nhanh / Theo mẫu / Dựng mới; đạt Definition of Done mới sang màn khác). Các skill khác trong `.claude/skills/` (chuẩn team `bnnam-standards`, PRD → luồng màn, dự án Figma có sẵn, hệ thống thiết kế, UX/UI mobile, chữ trong màn, HIG / Material 3 / web, iPhone Duo, chính sách store, nền, ảnh, prototype, review và handoff) được `figma-ui-flow` gọi tới ở bảng *Knowledge and steps in other skills* và tại từng giai đoạn. Ví dụ DSL: `examples/fintech-wallet.json` (dán vào ô *Test render_tree locally* trong plugin để thử không cần agent).

## Phát triển

```bash
npm run watch       # rebuild code.js khi sửa src/plugin
npm run typecheck   # plugin + server
npm run lint
npm test            # unit + bridge + MCP end-to-end (cần build trước) + smoke test bundle
```

| Thư mục | Nội dung |
|---|---|
| `src/shared/` | protocol, schema zod (nguồn duy nhất cho DSL và input tool), hàm thuần (màu, gradient, font) |
| `src/plugin/` | sandbox: dispatcher, apply thuộc tính, serialize, các command |
| `src/server/` | MCP server, WebSocket bridge, tải ảnh |
| `tests/` | vitest |

Kiểm thử thủ công trong Figma: xem `TESTING.md`.

## Bảo mật

- Server chỉ nghe trên `127.0.0.1`/`::1` và yêu cầu token (`~/.figma-agent/token`, quyền 600).
- `execute_code` có toàn quyền trên file đang mở; plugin hiển thị nhật ký mọi lệnh. Nên thử trên bản sao file quan trọng. Mỗi lệnh ghi là một bước undo (Cmd+Z).
- `localhost` chỉ có trong `devAllowedDomains`, nên khi publish plugin sẽ không có quyền mạng.
