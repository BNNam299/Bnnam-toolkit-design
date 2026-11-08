# App chăm sóc sức khỏe tinh thần — Báo cáo thị trường

> DỮ LIỆU THỬ — tên app và mọi con số trong file này là giả, chỉ dùng để thử bộ skill.

Trạng thái: xong bước 4, chờ Dev trả lời · Cập nhật: 07/11/2026 · Bước đã xong: 1, 2, 3, 4 · Đọc từ raw/: st-downloads-revenue-us-2026-10.csv

## 0. Đọc nhanh
- Đang xét: app iOS giúp người trẻ ở Mỹ giảm căng thẳng hằng ngày bằng check-in tâm trạng + bài thở / nhật ký ngắn.
- Kết luận hiện tại: chọn ý tưởng **Ý1 — chạm tâm trạng xong app đưa thẳng một việc 2 phút, không có thư viện để chọn** (4,30/5, cao nhất trong 4 ý tưởng). Thị trường còn chỗ, nhưng tiền thu ước tính trên một lượt tải (0,70 USD, mức giữa) thấp hơn giá mua một lượt tải ở mọi kịch bản → không vào được bằng quảng cáo.
- Cần chốt: (1) duyệt ý tưởng Ý1; (2) ngưỡng dừng số 3 ở §1 đã chạm → chọn "đổi cách bán" (vào bằng tìm kiếm trên store) hay chờ số CPI thật của dòng sức khoẻ tinh thần; (3) duyệt 4 ngưỡng mới trong `dev-brief.md` bản 2 để gửi Dev.
- Bước tiếp: `market-decide`, sau khi Dev trả lời (hạn 15/11/2026).

## 1. Khởi động
Bắt đầu từ một ý tưởng có sẵn; muốn biết có đáng làm và nên nhắm vào đâu.

- Điểm vào: ý tưởng — app check-in tâm trạng mỗi ngày, gợi ý bài thở hoặc nhật ký 2 phút khi căng thẳng.
- Ý tưởng: Cho người đi làm 22–35 tuổi ở Mỹ đang căng thẳng thường xuyên trong giờ làm, app giúp bình tĩnh lại trong 2 phút bằng check-in tâm trạng và một bài thở / nhật ký ngắn chọn theo tâm trạng lúc đó.
- Ràng buộc: iOS · Mỹ trước · thuê bao · 2 dev iOS · quyết trong 3 tuần.
- Team mạnh gì: onboarding và paywall (màn mời trả tiền); chưa làm AI.

**Ngưỡng dừng đặt trước** (đặt 01/11/2026):
| Nếu… | Thì |
|---|---|
| 3 app đầu chiếm > 80% lượt tải và không app nào ra mắt trong 12 tháng vượt 20k tải/tháng | dừng |
| Nỗi đau chính có < 2 nguồn độc lập | đổi hướng |
| Tiền thu / lượt tải (mức giữa) < CPI tham chiếu thấp nhất ở mọi nhóm nước — CPI là tiền mua một lượt tải qua quảng cáo | dừng hoặc đổi cách bán |
| Dev trả lời "không đạt" cho tính năng cốt lõi mà không có phương án thay | dừng |

## 2. Quét nhanh
Thị trường lớn, đang tăng nhẹ, và vẫn có app mới lên được — đáng đào sâu.

| App | Quy mô (tải/tháng, US) | Xu hướng 3 tháng | Tiền / lượt tải | Ra mắt | Ghi chú |
|---|---|---|---|---|---|
| App A (giả) | ~420k | ▲ +6% | 1,9 USD | 2016 | thiền dài, thư viện lớn |
| App B (giả) | ~310k | ▼ −9% | 2,4 USD | 2014 | thiền + ngủ |
| App C (giả) | ~95k | ▲ +38% | 0,9 USD | 03/2025 | check-in tâm trạng, nhanh |
| App D (giả) | ~60k | ▲ +12% | 0,6 USD | 2021 | nhật ký có gợi ý |
| App E (giả) | ~25k | ▲ +55% | 0,4 USD | 01/2026 | bài thở 1 phút |

(Sensor Tower, US, 10/2026, ước tính — #40–#44)

→ **Rút ra:** hai app lớn chiếm phần lớn doanh thu nhưng app B đang tụt; hai app mới (C, E) lên nhanh với hướng "ngắn, nhanh" → còn chỗ cho người mới nếu đi hướng ngắn.

- Từ khoá chính: "anxiety relief" (tìm nhiều, khó cao), "mood tracker" (vừa, khó vừa, ▲ 12 tháng), "breathing exercise" (vừa, khó thấp).
- Có chỗ cho người mới không: có — C và E ra mắt 2025–2026 đã vào top 10 (#42, #44).
- Nhu cầu thật hay trào lưu: nhu cầu thật — nhiều từ khoá cùng tăng, nhiều app cùng tăng.
- **Kết luận bước 2:** đào tiếp — chưa chạm ngưỡng dừng nào.

## 3. Người dùng đang khổ ở đâu
Nỗi đau lớn nhất: lúc căng thẳng thì app quá dài và quá nhiều lựa chọn — người dùng bỏ giữa chừng.

| Nhóm nỗi đau | Người dùng thực sự cần gì | Bằng chứng | Nguồn độc lập | Tần suất / mức đau |
|---|---|---|---|---|
| Bài quá dài, quá nhiều lựa chọn khi đang căng thẳng | một việc làm ngay trong 1–2 phút, không phải chọn | #1–#9 | 4 (store A, B, Reddit, YouTube) | hằng ngày / cao |
| Giá đắt, bị trừ tiền sau dùng thử không biết | biết rõ giá, dùng được phần cơ bản miễn phí | #10–#16 | 3 | hằng tháng / cao |
| Quên dùng, không thành thói quen | lời nhắc đúng lúc, thấy được tiến bộ | #17–#22 | 3 | hằng ngày / vừa |
| Ghi nhật ký không biết viết gì | câu gợi ý ngắn theo tâm trạng | #23–#26 | 2 | vài lần/tuần / vừa |
| Lo ngại dữ liệu tâm trạng bị chia sẻ | dữ liệu ở trên máy, không cần tài khoản | #27–#29 | 2 | thấp / cao |

→ **Rút ra:** hướng "ngắn, làm ngay, không phải chọn" có nhiều bằng chứng nhất; giá minh bạch và quyền riêng tư là điểm cộng có thể bán.

- Người dùng khen: giọng đọc dễ chịu (#30), check-in tâm trạng nhanh của app C (#31).
- Cách tự xoay xở: hẹn giờ thở trên Apple Watch (#32), ghi chú trong Notes (#33).

## 4. Đối thủ
App lớn bán thư viện nội dung dài; app mới thắng nhờ ngắn và nhanh nhưng kiếm tiền yếu.

### 4.1 So sánh nhanh
| App | Quy mô | Xu hướng 3 tháng | Tiền / lượt tải | Người dùng chê nhất | Cơ hội cho mình |
|---|---|---|---|---|---|
| A (giả) | ~420k | ▲ +6% | 1,9 USD | quá dài (#2, #5) | bản ngắn 2 phút |
| B (giả) | ~310k | ▼ −9% | 2,4 USD | giá, trừ tiền bất ngờ (#11) | giá minh bạch |
| C (giả) | ~95k | ▲ +38% | 0,9 USD | ít nội dung sau 2 tuần (#20) | gợi ý theo tâm trạng |
| D (giả) | ~60k | ▲ +12% | 0,6 USD | không biết viết gì (#24) | câu gợi ý ngắn |
| E (giả) | ~25k | ▲ +55% | 0,4 USD | quảng cáo dày (#28) | không quảng cáo |

→ **Rút ra:** app lớn kiếm nhiều tiền / lượt tải nhưng bị chê dài; app nhỏ lên nhanh nhưng kiếm ít → cơ hội là "ngắn như C, kiếm tiền như A".

### 4.3 Tính năng miễn phí và thu tiền
| Tính năng | Bao nhiêu app có | Thường miễn phí hay thu tiền | Vùng | Mình nên |
|---|---|---|---|---|
| Check-in tâm trạng | 5/5 | miễn phí | phải có, miễn phí | có, miễn phí |
| Bài thở ngắn | 4/5 | miễn phí 1–2 bài | phải có, miễn phí | có, miễn phí |
| Thư viện thiền dài | 3/5 | thu tiền | thị trường đang bán | không làm ở bản đầu |
| Gợi ý theo tâm trạng lúc đó | 1/5 | thu tiền | điểm khác biệt có thu tiền | điểm khác biệt chính |
| Biểu đồ tâm trạng theo tuần | 3/5 | thu tiền | thị trường đang bán | gói trả phí |

→ **Rút ra:** check-in và bài thở ngắn là thứ phải có và cho miễn phí; "gợi ý đúng việc theo tâm trạng lúc đó" ít app có → điểm khác biệt.

### 4.5 Mức giá neo
Giá năm tụ quanh 59,99–69,99 USD (A, B); app nhỏ 29,99–39,99 USD/năm; gói tuần 4,99–7,99 USD (#45–#49). Dùng thử 7 ngày phổ biến.

### 4.6 Chỗ hở đã cân nhắc rồi loại
- Chatbot trị liệu bằng AI — loại vì team chưa làm AI và rủi ro quy định y tế (#34).

## 5. Cơ hội và ý tưởng
Chọn **Ý1 — chạm tâm trạng một cái là app đưa thẳng một việc 2 phút, không có thư viện để chọn**, vì nó nằm đúng nhóm nỗi đau mạnh nhất (31/35, 4 nguồn độc lập) và đúng khoảng trống mà mới 1/5 app chạm tới (§4.3).

### 5.1 Chấm điểm nhu cầu
Giữ nhóm nào ≥ 25/35. Mỗi ô 1–5 điểm.

| Nhóm nỗi đau | Tần suất | Mức đau | Tìm kiếm | Đang xoay xở | Trả tiền | Quay lại | Hợp team | Tổng /35 |
|---|---|---|---|---|---|---|---|---|
| Bài quá dài, quá nhiều lựa chọn | 5 | 5 | 4 | 4 | 4 | 5 | 4 | **31** ✓ |
| Quên dùng, không thành thói quen | 5 | 3 | 4 | 4 | 3 | 5 | 3 | **27** ✓ |
| Giá đắt, bị trừ tiền bất ngờ | 3 | 5 | 2 | 3 | 2 | 2 | 5 | 22 ✗ |
| Ghi nhật ký không biết viết gì | 3 | 3 | 2 | 3 | 2 | 3 | 4 | 20 ✗ |
| Lo ngại dữ liệu tâm trạng | 2 | 4 | 2 | 3 | 2 | 2 | 5 | 20 ✗ |

Căn cứ từng nhóm:
- **Quá dài (31):** xảy ra hằng ngày và người dùng bỏ app giữa chừng (#1, #2); đang tự xoay xở bằng hẹn giờ thở trên Apple Watch (#32); người chê "dài" chính là người đang trả 1,90 USD/lượt tải cho app A (#40). "Hợp team" 4 vì không cần AI, mà cần onboarding + màn mời trả tiền (paywall) — đúng thứ team mạnh (§1).
- **Quên dùng (27):** từ khoá "mood tracker" tăng trong 12 tháng (§2); tự xoay xở bằng ghi chú trong Notes (#33); biểu đồ tâm trạng đang được 3/5 app thu tiền (§4.3). "Hợp team" 3 vì lời nhắc thông minh team chưa làm bao giờ.
- **Giá đắt (22):** đau thật (#10–#16) nhưng chính nhóm này là nhóm né trả tiền, và không ai lên store tìm "app minh bạch giá" → điểm "Tìm kiếm" và "Trả tiền" thấp.
- **Không biết viết gì (20):** chỉ 2 nguồn độc lập (#23–#26); app D đi hướng này chỉ thu 0,60 USD/lượt tải — thấp nhì nhóm (#43).
- **Lo ngại dữ liệu (20):** mức đau cao nhưng tần suất thấp, và không app nào trong 5 app bán riêng được điều này (§4.3).

→ **Rút ra:** chỉ 2 nhóm qua ngưỡng — "quá dài" và "quên dùng". Ba nhóm còn lại không đủ để làm app riêng nhưng dùng được: "giá đắt" thành cách bán, "lo ngại dữ liệu" thành lời hứa dữ liệu nằm trên máy.

### 5.2 Các ý tưởng
| Ý tưởng | Cho ai, giải gì | Nhu cầu tăng | Kiếm tiền | Khoảng trống | Điểm /5 |
|---|---|---|---|---|---|
| **Ý1 · Một việc duy nhất, 2 phút** | người đi làm 22–35 ở Mỹ căng thẳng giữa giờ làm — không phải chọn gì cả | 5 | 4 | 4 | **4,30** |
| Ý2 · Thở 60 giây từ màn hình khoá | người hoảng đột ngột — hạ nhịp thở mà không cần mở app | 5 | 2 | 3 | 3,55 |
| Ý3 · Giữ thói quen 2 phút/ngày | người tải app thiền rồi bỏ — nhắc đúng giờ + biểu đồ tuần | 4 | 3 | 2 | 3,35 |
| Ý4 · Chèn 2 phút thở vào khe trống lịch họp | người lịch họp dày — tự tìm khe trống giữa 2 cuộc họp | 3 | 3 | 5 | 3,35 |

Điểm đầy đủ (Nhu cầu tăng 25% · Kiếm tiền 20% · Khoảng trống 20% · Dùng lặp lại 15% · Dễ kéo người dùng 10% · Lợi thế build 10%):

| | Nhu cầu | Tiền | Trống | Lặp lại | Kéo người | Build | Tổng |
|---|---|---|---|---|---|---|---|
| Ý1 | 5 | 4 | 4 | 5 | 3 | 4 | **4,30** |
| Ý2 | 5 | 2 | 3 | 4 | 4 | 3 | 3,55 |
| Ý3 | 4 | 3 | 2 | 5 | 3 | 3 | 3,35 |
| Ý4 | 3 | 3 | 5 | 4 | 2 | 2 | 3,35 |

Vì sao chấm thế — chỗ quyết định điểm:
- **Ý1 · Kiếm tiền 4:** "gợi ý theo tâm trạng lúc đó" là tính năng 1/5 app có và app đó thu tiền (§4.3); app A thu 1,90 USD/lượt tải với cùng tập người dùng (#40). **Kéo người dùng 3:** từ khoá chính "anxiety relief" độ khó cao (§2).
- **Ý2 · Kiếm tiền 2:** app E đi đúng hướng này chỉ thu 0,40 USD/lượt tải — thấp nhất nhóm (#44); widget khó gắn màn mời trả tiền. **Build 3:** rung theo nhịp khi màn hình tắt chưa rõ chạy được — xem §5.4.
- **Ý3 · Khoảng trống 2:** biểu đồ tâm trạng đã có ở 3/5 app (§4.3) → không phải điểm khác biệt.
- **Ý4 · Nhu cầu 3 — giả định:** không có bằng chứng người dùng nào trong #1–#33 đòi điều này; suy ra từ #1 ("khi hoảng không có 15 phút"). Cần dữ liệu: hỏi 5–10 người đi làm xem họ có muốn app đọc lịch không.

→ **Rút ra:** Ý1 hơn Ý2 chủ yếu ở khả năng kiếm tiền (4 vs 2) — cùng một nỗi đau, nhưng bán được hay không nằm ở chỗ app chọn hộ việc chứ không phải ở bài thở. Ý3 gộp vào Ý1 làm tính năng giữ chân, không tách app riêng.

**Xếp nhóm hành động:** Ý1 → làm thử ngay (nhu cầu cao + khoảng trống còn hở). Ý2 → cần khác biệt mạnh mới đáng làm (E đã đi trước, chỉ hở ở chỗ E bị chê quảng cáo dày #28). Ý3 → thành tính năng của Ý1. Ý4 → theo dõi, chưa làm (chưa có bằng chứng người dùng).

- **Ý tưởng chọn:** Cho người đi làm 22–35 tuổi ở Mỹ đang căng thẳng giữa giờ làm, app giúp bình tĩnh lại trong 2 phút bằng cách sau một chạm chọn tâm trạng là đưa thẳng vào **một** bài thở hoặc một câu nhật ký đã chọn sẵn — không có thư viện, không phải quyết định gì thêm.
- **Vì sao là lúc này:**
  - Cửa phân phối mới: widget trên màn hình khoá cho phép vào thẳng check-in mà không qua màn mở app — 3 năm trước chưa có bề mặt này.
  - Tín hiệu cạnh tranh: hai app đi hướng "ngắn" ra mắt gần đây đang tăng nhanh nhất nhóm — C (03/2025) +38% và E (01/2026) +55% trong 3 tháng — trong khi app lâu năm B (2014) −9% (#41–#44).
  - Khoảng trống còn nguyên: "gợi ý đúng việc theo tâm trạng lúc đó" mới 1/5 app có (§4.3), dù nỗi đau đã có 4 nguồn độc lập từ 2025–2026.

### 5.3 Kiểm nhanh "có lời không"
So tiền một lượt tải mang về trong 12 tháng (LTV — tổng tiền một người dùng mang về) với tiền bỏ ra mua một lượt tải (CPI). Cách tính: tỉ lệ người tải trở thành người trả tiền × tiền trung bình thu từ một người trả tiền (ARPPU), đã trừ phí store / thuế / hoàn tiền (giá niêm yết × 0,65 — quy ước team). Giá dự kiến 39,99 USD/năm hoặc 6,99 USD/tuần, neo dưới A/B 59,99–69,99 USD (§4.5).

| Nhóm nước | Tiền thu / lượt tải (thận trọng – giữa – mạnh tay) | CPI tham chiếu | Trần CPI hoà vốn | Đánh giá |
|---|---|---|---|---|
| T1 (Mỹ, nhóm nước chi nhiều) | 0,31 – **0,70** – 1,28 USD | 1,5 – 4 USD — **giả định**, là CPI app tiện ích, dòng sức khoẻ tinh thần có thể khác (#52) | 0,70 USD (mức giữa); trần an toàn LTV/CPI = 2 → 0,35 USD | **lỗ ở cả ba kịch bản** nếu chỉ mua quảng cáo |
| T3 (nhóm nước chi ít) | chưa có số | chưa có số | chưa có số | ngoài phạm vi bản đầu (§1: Mỹ trước) — chưa kết luận |

Ba kịch bản T1 (giả định tỉ lệ trả tiền, ARPPU net 12 tháng):
- thận trọng: 1,2% × 26 USD = 0,31 USD — 1,2% là mốc nội bộ team (6% bắt đầu dùng thử × 20% dùng thử → trả tiền, #50)
- giữa: 2,5% × 28 USD = 0,70 USD
- mạnh tay: 4,0% × 32 USD = 1,28 USD

Đối chiếu với đối thủ (doanh thu ÷ lượt tải tháng 10, trừ 0,65 cho phí store): A 1,23 USD · B 1,56 USD · C 0,59 USD · D 0,39 USD · E 0,26 USD (#40–#44, ước tính). App A ngụ ý khoảng 2,9% người tải trở thành người trả tiền. Mức giữa 0,70 USD của mình nằm giữa C và A — tức là giả định mình bán tốt hơn C nhưng chưa bằng A.

→ **Rút ra:** ở T1 không kịch bản nào mua nổi lượt tải bằng quảng cáo (trần 1,28 USD < 1,5 USD thấp nhất của mốc tham chiếu) → đường vào phải là tìm kiếm trên store và lan truyền, không phải UA. Muốn mở quảng cáo thì phải nâng tỉ lệ trả tiền lên ~5,4%, gần gấp đôi app A — hoặc có CPI thật của dòng sức khoẻ tinh thần ở Mỹ, đây là số duy nhất đổi được kết luận này.

**Cái gì làm đổi kết quả nhiều nhất (T1), xếp theo mức ảnh hưởng:**
1. Tỉ lệ người tải bắt đầu dùng thử — đi từ 4% lên 10% làm LTV đổi khoảng 2,5 lần.
2. Tỉ lệ dùng thử → trả tiền (15% → 35%).
3. % người làm xong bài thở đầu tiên ngay phiên đầu — trong nghiên cứu nội bộ, app dẫn đầu chốt bán ngay phiên đầu (#51).
Tỉ lệ quay lại sau 1 ngày gần như không đổi kết quả ở T1. Khoảng 0,31 → 1,28 USD là chênh hơn 4 lần giữa hai kịch bản — khớp với nhận xét trong báo cáo nội bộ rằng **cách app bán quyết định giá trị mỗi lượt tải, không phải thị trường** (#51).

### 5.4 Kiểm nhanh "làm được không"
AI chỉ đoán; Dev đo xong mới kết luận.

| Tính năng cốt lõi | AI đoán sơ bộ | Câu hỏi cho Dev | Trả lời của Dev |
|---|---|---|---|
| T1 · Chạm widget / màn hình khoá → màn check-in ≤ 1,5 giây | vừa — chờ Dev xác nhận | Widget vào thẳng màn check-in được không, hay vẫn phải qua màn mở app? Đo trên iPhone 11 / iOS 17. | chưa có |
| T2 · Bài thở rung theo nhịp, chạy tiếp khi màn hình tắt | khó — chờ Dev xác nhận | Rung theo nhịp có chạy liên tục 2 phút khi màn tắt / app ở nền không, hay bị hệ thống cắt? Tốn bao nhiêu pin? | chưa có |
| T3 · Chọn hộ đúng một bài theo tâm trạng vừa chạm | dễ — chờ Dev xác nhận | Luật chọn bài để hẳn trong app, sửa được qua bản cập nhật mà không cần server — có vướng gì không? | chưa có |
| T4 · Biểu đồ tâm trạng tuần, dữ liệu chỉ nằm trên máy | dễ — chờ Dev xác nhận | Đồng bộ qua iCloud riêng tư có bắt người dùng đăng nhập tài khoản không? Đổi máy thì dữ liệu đi đâu? | chưa có |
| P1 (phụ) · Nhắc đúng giờ hay căng thẳng | không rõ — chờ Dev xác nhận | Có cách nào đoán giờ căng thẳng chỉ từ lịch sử check-in trên máy, không xin quyền nhạy cảm? | chưa có |

→ **Rút ra:** T3 và T4 — hai thứ tạo nên điểm khác biệt và gói trả phí — là phần AI đoán dễ nhất; rủi ro kỹ thuật dồn vào T1 và T2, mà cả hai đều có phương án thay (bỏ widget dùng App Intents; bỏ rung, dùng hình + tiếng). Chưa có câu trả lời nào của Dev → chưa được kết luận "làm được".

### 5.5 Đối chiếu ngưỡng dừng ở §1
| Ngưỡng | Số thực tế | Kết quả |
|---|---|---|
| 3 app đầu > 80% lượt tải **và** không app mới nào trong 12 tháng vượt 20k tải/tháng → dừng | 3 app đầu chiếm 90,7% lượt tải (825k/910k) — **chạm vế 1**; nhưng app E ra mắt 01/2026 đạt 25k tải/tháng > 20k — **không chạm vế 2** (#40–#44) | **không kích hoạt** (cần cả hai vế) |
| Nỗi đau chính < 2 nguồn độc lập → đổi hướng | nhóm "quá dài" có 4 nguồn độc lập (#1–#9) | không chạm |
| Tiền thu / lượt tải (mức giữa) < CPI tham chiếu thấp nhất ở mọi nhóm nước → dừng hoặc đổi cách bán | T1: 0,70 USD < 1,50 USD (CPI tham chiếu, **giả định** mượn của app tiện ích); T3 chưa có số | **đã chạm ở T1** → phải chọn: đổi cách bán, hay chờ CPI thật |
| Dev trả lời "không đạt" cho tính năng cốt lõi mà không có phương án thay → dừng | Dev chưa trả lời | chưa kiểm được |

→ **Rút ra:** một ngưỡng đã chạm — ngưỡng tiền. Theo đúng điều đã đặt ngày 01/11, lựa chọn là "đổi cách bán": vào bằng tìm kiếm trên store thay vì mua quảng cáo, và dồn công vào màn mời trả tiền để nâng tỉ lệ trả tiền. Cần bạn xác nhận hướng này ở bước 5.

## 6. Quyết định
Chưa làm — bước 5 (`market-decide`), chờ Dev trả lời (hạn 15/11/2026).

## 7. Đưa sang bước sau
Chưa làm — bước 5 (`market-decide`).

### Cần bổ sung để kiểm lại
| Giả định | Dùng ở | Cần dữ liệu gì để kiểm | Nếu sai thì đổi kết luận nào |
|---|---|---|---|
| Tiền / lượt tải lấy từ doanh thu ÷ tải tháng 10, có lẫn tiền gia hạn | §2, §4, §5.3 | doanh thu theo nhóm người tải cùng tháng | mức giữa 0,70 USD ở §5.3 |
| CPI tham chiếu 1,5–4 USD là của app tiện ích, không phải dòng sức khoẻ tinh thần | §5.3, §5.5 | CPI thật dòng sức khoẻ tinh thần, iOS, Mỹ (hỏi UA) | ngưỡng dừng số 3 có thật sự chạm hay không |
| Tỉ lệ trả tiền 1,2% / 2,5% / 4,0% lấy từ mốc nội bộ team và suy từ app A | §5.3 | tỉ lệ bắt đầu dùng thử và dùng thử → trả tiền của app cùng dòng | cả ba kịch bản "có lời không" |
| Doanh thu Sensor Tower là tiền người dùng trả, chưa trừ phí store → nhân 0,65 | §5.3 | Sensor Tower báo doanh thu gross hay net | giá trị mỗi lượt tải của cả 5 đối thủ |
| T3 chưa xét vì chưa có doanh thu chia theo nước | §5.3 | `raw/st-revenue-by-country-2026-10.csv` | có nhóm nước nào mua quảng cáo có lời không |
| Ý4 (chèn vào khe trống lịch họp) chấm "nhu cầu 3" mà không có bằng chứng người dùng | §5.2 | hỏi 5–10 người đi làm | thứ hạng Ý4, không đổi ý tưởng chọn |

## Phụ lục — Phiếu xin số liệu
| ☐ | Lấy gì (app · nước · kỳ) | Để trả lời câu hỏi gì | Mức | Lưu vào |
|---|---|---|---|---|
| ☑ | Tải + doanh thu theo tháng, A–E · US · 10/2026 | thị trường lớn cỡ nào, có trả tiền không | bắt buộc | `raw/st-downloads-revenue-us-2026-10.csv` |
| ☐ | Doanh thu chia theo nước, app A và C | nên nhắm nhóm nước nào | bắt buộc | `raw/st-revenue-by-country-2026-10.csv` |
| ☐ | Retention D1/D7/D30 app A, C, E | người dùng có quay lại không | tốt nếu có | `raw/st-retention-us-2026-10.csv` |
| ☐ | CPI dòng sức khoẻ tinh thần · iOS · Mỹ · quý gần nhất (hỏi UA, không phải Sensor Tower) | mua quảng cáo có lỗ không — số duy nhất chốt được §5.3 | bắt buộc | `raw/ua-cpi-mental-health-us.md` |
| ☐ | Sensor Tower báo doanh thu trước hay sau phí store | giá trị mỗi lượt tải của 5 đối thủ đang bị lệch bao nhiêu | bắt buộc | ghi thẳng vào §7 |
