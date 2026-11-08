# Writing market documents everyone can read

The readers are not researchers. A PO decides, a Dev estimates, a Designer looks for what users hate, ASO and UA look for keywords and
acquisition cost, a manager reads the first lines and moves on. Write for the busiest of them first, then let the others dig.

## Contents
1. Keep only what carries weight
2. The four quick-read lines
3. The plain first sentence
4. Terms in parentheses
5. Wording to avoid
6. Tables that lead to a decision
7. How to show a number
8. Plain explanations of common terms
9. Name the method you used

## 1. Keep only what carries weight
People open the report to decide, not to read an essay. A sentence stays only if it carries at least one of:
- a number with its source tag,
- an evidence number (#…),
- a threshold check, a decision or a next action,
- an assumption marked **giả định** (and listed in §7).

Everything else is cut, however well written. What to cut:

| Cut | Write instead |
|---|---|
| Prose that repeats what the table above already shows | nothing — the "→ Rút ra" line is enough |
| Re-explaining the method or a term already explained in this file ("Cách tính, nói trước cho minh bạch…") | one line: the formula and the source of each input |
| Comments about the analysis itself ("Lưu ý thẳng…", "bảng này xác nhận hướng cũ nhiều hơn là…") | if it changes confidence, one line: what is weak and why (#…) |
| Adjectives with no number: "mạnh", "rõ", "khả thi", "nhiều tiềm năng", "đang bùng nổ" | the number behind it: "+38% trong 3 tháng (#42)" — or cut |
| Claims from general knowledge ("Mỹ là nơi CPI đắt nhất") | a source, or cut |
| Full scoring details for items that were dropped | one line each: item — score — the reason it dropped |
| The same number restated in several sections | state it once, point to the section |

**Length.** One subsection fits on one screen (about 30–40 lines). A "→ Rút ra" line is at most 2 sentences: what the table shows +
what to do. Full detail only for the item the user has to decide on.

**The delete test** — run it on every paragraph before reporting: *if this paragraph is deleted, does a number, an evidence link or a
decision disappear?* If not, delete it.

## 2. The four quick-read lines
Section 0 of `market-report.md`, rewritten after every step, no jargon at all:
```
- Đang xét: <app / dòng app, cho ai, ở nước nào>
- Kết luận hiện tại: <one sentence — what we know now, with confidence>
- Cần chốt: <the decision waiting for the user, or "chưa có">
- Bước tiếp: <next step and the skill to call>
```
A reader who stops here must still know where the project stands.

## 3. The plain first sentence
Every section opens with one sentence that answers the section's question in everyday words, before any table:
- Good: "Người dùng khổ nhất vì app hay mất kết nối với TV — gặp ở cả 4 app lớn."
- Bad: "Phân tích review cho thấy pain cluster liên quan connectivity có Need Score cao."

## 4. Terms in parentheses
Explain a domain term **the first time it appears in each file**, inside parentheses, in a few words:
"LTV (tổng tiền một người dùng mang về trong suốt thời gian dùng app)". After that the bare term is fine in that file. Do not collect
terms in a glossary at the end — readers forget before they get there. If a sentence needs two explained terms, split the sentence.

## 5. Wording to avoid
| Avoid | Write instead |
|---|---|
| GO / NO-GO, gate passed | làm tiếp / đổi hướng / dừng; "đạt ngưỡng đã đặt" |
| "Nhiều người phàn nàn" | "12 đánh giá ở 3 app (#4–#15)" |
| Long paragraphs of analysis | one claim per line, evidence numbers at the end |
| English jargon in a Vietnamese sentence without explanation | Vietnamese word, or the term + parentheses |
| "Thị trường tỉ đô" consultant numbers | download / revenue scale of the leading apps, with source |
| Hedging every line | state confidence once: chắc (nguồn công bố) · ước tính (cách ước) · tín hiệu yếu |
| Calling the user "anh", "chị", "sếp" | "bạn" — in documents and in chat |

## 6. Tables that lead to a decision
Raw dumps (a CarPlay-style sheet of 15 columns of tool numbers) look thorough and say nothing. Four rules:
1. **Every column answers a question.** Before adding a column, write the question it answers ("người dùng có chịu trả tiền không?").
   No question → no column.
2. **Derived numbers over raw totals.** Raw totals cannot be compared at a glance. Prefer:
   - change over 3 months: ▲ +25% / ▼ −18%
   - revenue per download (doanh thu / lượt tải)
   - share of the top 3 apps in the group's downloads or revenue
   - review growth speed, not total reviews
   - days since last update (investment signal)
3. **At most 6 columns.** Details go into a vertical block per item below the table.
4. **Every table ends with "→ Rút ra:"** — one or two sentences: what the table shows and what to do next. If you cannot write it,
   delete the table.

Order rows by what matters for the question (e.g. by revenue per download when the question is willingness to pay), not
alphabetically. Use ▲ ▼ for direction, ✓ ✗ for presence, "—" for not applicable, "chưa có số" for not fetched.

Example:

| App | Quy mô | Xu hướng 3 tháng | Tiền / lượt tải | Người dùng chê nhất | Cơ hội cho mình |
|---|---|---|---|---|---|
| A | ~300k tải/tháng | ▼ −18% | 0,4 USD | Quảng cáo dày (#4, #9) | Bản không quảng cáo |
| B | ~80k tải/tháng | ▲ +25% | 1,1 USD | Mất kết nối (#2) | Kết nối ổn định |

→ **Rút ra:** app đầu ngành đang tụt, app nhỏ lên nhanh nhờ ổn định; người dùng chịu trả ~1 USD/lượt tải → đào tiếp hướng "ổn định +
không quảng cáo".

## 7. How to show a number
- Round to what the estimate supports: "~80k", "~1,1 USD", not "81.374".
- Tag every market number: `~80k tải/tháng (Sensor Tower, US, 10/2026, ước tính)`. In tables, put the tag in the column header or a
  note under the table when all rows share it.
- Vietnamese number style in Vietnamese text: comma for decimals (1,1 USD), "k" / "triệu" for thousands / millions.
- Ranges beat false precision: "0,6–1,2 USD" with the scenario named (thận trọng / giữa / mạnh tay).
- A guess is **giả định**, an estimate from a tool is **ước tính**, a number nobody publishes is **Không công bố**, a number not yet
  fetched is **chưa có số**. Never leave a cell silently empty.

## 8. Plain explanations of common terms
Use these (or shorter) the first time a term appears in a file:

| Term | Plain explanation |
|---|---|
| CPI | tiền mua một lượt tải qua quảng cáo |
| LTV | tổng tiền một người dùng mang về trong suốt thời gian dùng app |
| RPD | doanh thu chia cho số lượt tải |
| ARPPU | tiền trung bình thu được từ một người có trả tiền |
| IAP / IAA | tiền bán trong app (gói, mua đứt) / tiền từ quảng cáo trong app |
| eCPM | tiền nhận được cho mỗi 1.000 lượt hiện quảng cáo |
| DAU / MAU | số người mở app mỗi ngày / mỗi tháng |
| Retention D1 / D7 / D30 | % người còn quay lại app sau 1 / 7 / 30 ngày |
| Churn | % người bỏ gói hoặc bỏ app trong một kỳ |
| Paywall | màn mời trả tiền |
| Trial | dùng thử miễn phí trước khi bị trừ tiền |
| Conversion | tỉ lệ chuyển từ bước này sang bước sau (vd. dùng thử → trả tiền) |
| T1 / T3 (tier nước) | nhóm nước giàu như Mỹ, Anh, Đức… / nhóm nước chi ít như Brazil, Việt Nam, Indonesia… |
| ASO | tối ưu trang app trên store để được tìm thấy |
| UA | chạy quảng cáo để kéo người tải app |
| Keyword difficulty | độ khó leo top khi người dùng tìm từ khoá đó |
| Onboarding | các màn giới thiệu khi mở app lần đầu |
| Baseline feature | tính năng app nào cũng có và cho dùng miễn phí |
| Break-even CPI | mức giá mua lượt tải cao nhất mà vẫn không lỗ |

## 9. Name the method you used
When a step follows an established method, framework or matrix (5 Whys, Lotus Blossom, RICE, Kano, HEART, story map, cognitive
walkthrough, Need Score, three-layer competition…) rather than the AI's own reasoning, say so — the reader must see how the problem
was solved, not only the answer.
- **Where it is used**, exactly one line before the result (details go to the appendix, not here): "Cách làm: <tên phương pháp> — <dùng để làm gì>." Example: "Cách làm: 5 Whys +
  Fishbone — tìm vì sao người dùng bỏ app sau tuần đầu → 3 nguyên nhân gốc, nguyên nhân 2 sản phẩm tác động được."
- **In the appendix** "Phương pháp đã dùng": one row per method — phương pháp · dùng ở mục · để giải việc gì · ra kết quả gì · nguồn
  (team handbook, team template, a named public source). The team's own templates call this "Nguồn phương pháp".
- Only name a method whose steps were actually followed; a method named but not applied is worse than none. Where the AI reasoned
  on its own, write "AI tự suy luận từ <bằng chứng>".
- The final reply of every step has one line "Cách làm: <phương pháp> → <ra gì> · <phương pháp> → <ra gì>" — naming them, not only
  "xem phụ lục".

