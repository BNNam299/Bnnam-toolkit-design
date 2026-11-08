# Reader copy — the version people read (reader md during a version → docx when the version is ready to build)

`prd.md` and `requirements.md` are **working files**: the next step, the design toolkit and Dev's agent read them, so they keep IDs
(FEAT-, UC-, FR-, AC-, BR-, D-, BAN-, M#, §), levels, traceability and decision history. People should not have to read that. At the
end of **every step** write a separate **reader copy** in md, rewritten for a person — the user reads and edits it while the version
is being defined. When the version reaches *Đủ để build*, the reader copies become .docx and the reader md files are deleted: in the
end there is **md for machines and docx for people**.

## Life of the reader copy
```
while a version's steps run   docs/product/reader/prd.md           ← every step (kickoff, users, plan, spec, detail)
                              docs/product/reader/requirements.md  ← from product-spec on (for Dev)
version ready to build        docs/product/export/prd.docx          ← exported from reader/prd.md
(end of product-detail)       docs/product/export/requirements.docx ← exported from reader/requirements.md
                              then docs/product/reader/ is deleted
next version (product-plan)   reader/ is written again from the updated working files
```
- **During steps: md only, no docx.** Rewrite the whole reader md each step (overwrite, never append) so it shows the current state of
  the product and the version, as if written today. The reply points the user to the reader md.
- **Exception — hand-off to the designer** (end of `product-spec`): when the user says it is ready to send, export
  `export/prd.docx` at once from the reader md; keep `reader/` until the version is ready to build.
- **The end of a version** is `product-detail` after the review: export both reader copies to `export/`, check the docx files
  exist, then delete `docs/product/reader/` and tell the user.
- **The working files are the source.** Facts change there first; the reader copy only re-tells them. Never put a number, feature,
  rule or decision in the reader copy that is not in `prd.md` / `requirements.md` / `decisions.md`.
- **The user may edit the reader md.** Before rewriting it (start of each later step, and before the final export) run
  `check_product.py docs/product`: it reports "bản đọc đã sửa tay" and prints the changed lines. Carry each change into the working
  files — a feature, a rule, a decision (add a `D-` line: the user, date, "sửa trong bản đọc"), a wording they want kept; ask in one
  plain question if it changes scope or a decision — and only then rewrite. Never overwrite the user's edits silently.
- After writing a reader md, record it: `python <skill-dir>/scripts/check_product.py docs/product --mark-reader`.
- Agents never read the reader copy as input.
- Export: `NODE_PATH="$(npm root -g)" node <skill-dir>/scripts/export_docx.js docs/product/reader/prd.md
  docs/product/export/prd.docx` (same for requirements). If the npm package `docx` is missing, ask the user before installing; until
  it is installed the reader md stays and the report says the docx is pending.

## PRD reader copy — for the user, the team, the designer
Shape (readable in about 10–15 minutes; long PRDs keep the version part short and point to the feature list):
```
# <Tên app> — Tài liệu sản phẩm (bản đọc)
*Phiên bản <x.y.z> · cập nhật dd/mm/yyyy, sau bước <tên bước bằng lời>. Bạn sửa thẳng ở đây được — bước sau sẽ đưa phần sửa vào
bản làm việc trước khi viết lại.*

## Mục lục              một dòng mỗi mục bên dưới, mục con thụt vào
## 1. Tóm tắt           3–5 câu: app làm gì cho ai, bản này phải chứng minh điều gì, đang ở đâu, cần bạn chốt gì
## 2. Sản phẩm          vấn đề → cách giải, định vị, nguyên tắc "ưu tiên A hơn B", điều không làm (và vì sao)
## 3. Người dùng        ai là người dùng chính, họ muốn làm được việc gì, khoảnh khắc thấy app có ích
## 4. Bản <x.y.z> có gì  danh sách tính năng bằng lời: mỗi tính năng một đoạn ngắn — làm gì, vì sao vào bản này, mức hoàn thiện
## 5. Kiếm tiền và chỉ số gói, giá, chỗ hiện paywall / quảng cáo, chỉ số chính và mốc đạt
## 6. Màn hình và luồng  (từ product-spec) các màn chính và đường đi chính bằng câu thường; link Figma / FigJam nếu có
## 7. Còn mở             câu hỏi chưa có trả lời, ai trả lời
```
Sections whose step has not run are left out; the rest are renumbered in order.

## Requirements reader copy — for Dev
The reader is a developer, so the rules change in two places:
- **IDs are allowed as a tag at the end of an item, in parentheses** — "(FR-04, AC-04.2)" — so Dev and tests map back to the working
  file. The sentence must read fully without the tag.
- Technical terms Dev uses are fine (permission names, store APIs, event names).
Shape: "Mục lục" first, then one numbered section per feature ("## 3. Chụp theo ảnh mẫu (FEAT-01)", parts as "### 3.1 Luồng
chính") — what it does in 2–3 sentences, the main flow as numbered steps, the unhappy cases (each: when → what the app
does), the acceptance checks as plain "Kiểm: …" lines marked *Lead kiểm* / *Dev kiểm*, business rules as plain sentences, events to
track. No traceability tables, no levels history, no decision log.

## Numbering and table of contents (every reader copy)
- **Number the sections** in reading order: "## 1. Tóm tắt", "## 2. …", subsections "### 2.1 …". The whole copy is rewritten
  each step, so renumber freely when a section is added.
- **Numbers help people find things; they are not codes.** In the text, refer to a section by number and name — "xem mục 4,
  Người dùng khổ ở đâu" — never by the number alone.
- **A copy with 4 or more main sections starts with "## Mục lục"** right after the date line (not numbered itself): one line per
  main section ("- 1. Tóm tắt"), subsections indented under it. Keep it in step with the headings.
- The docx export turns "Mục lục" into a clickable table of contents and adds "Trang x / y" to every page — nothing to do by hand.
- `check_*.py` flags unnumbered sections, a missing "Mục lục" and a "Mục lục" that does not match the headings.

## Writing rules (both copies)
1. **Full sentences, spoken order.** No chains of "→" and "·", no fill-in-the-slot template sentences, no telegram style.
2. **No internal IDs in the PRD reader copy** — never FEAT-, UC-, FR-, AC-, BR-, NFR-, D-, R-, BAN-, PER-, JTBD-, SCR-, EVT-, M#, P#,
   "§8", skill names, file names, folder paths, HTML comments. Name things by what they are ("tính năng chụp theo ảnh mẫu", "luật
   không hiện paywall trước lần chụp đầu").
3. **Sources in a few words**: "(theo nghiên cứu thị trường, đánh giá App Store 2026)", "(Dev ước, 08/11)".
4. **Only what the reader needs to understand or decide.** Leave out: approval history, ID bookkeeping, levels tables, method
   appendix, traceability. Name a method only where it changes how to read a result.
5. **Numbers rounded and compared**; "nghìn / triệu", not "K / M".
6. **Tables only for comparing several items on a few points** — at most 4 columns, at most 8 rows, then one sentence on what the
   table shows (plans and prices are a good fit).
7. **Bold at most once per paragraph.**
8. **Terms**: avoid; when unavoidable, explain in parentheses at first use.
9. **Links only to what any reader can open** (Figma, FigJam, store pages, public web, GitHub if the docs are pushed). Never a local
   md file; write "chi tiết: bản làm việc, phần tính năng" instead.
10. Address the user as "bạn"; decisions in plain words, never "GO / NO-GO".

## Example — working file vs reader copy
Working file:
> | FEAT-03 | Thư viện ảnh mẫu | M#14, M#19 · JTBD-02 | P1 | Next | Đề xuất | D-07 |

Reader copy:
> Thư viện ảnh mẫu để sang bản sau. Người dùng có nhắc tới (theo đánh giá App Store của các app tạo dáng), nhưng bản đầu chỉ cần
> chứng minh một điều: người cầm máy chụp được tấm giống ảnh mẫu. Bạn chốt việc này ngày 08/11.

## Self-check before reporting
- Read each paragraph as someone who was not in the project: understood without flipping to another file or section?
- Before rewriting: no "bản đọc đã sửa tay" left unhandled — the user's edits are in the working files.
- `scripts/check_product.py docs/product` shows no LỖI for the reader md files; then `--mark-reader` was run.
- Every fact in the reader copy exists in the working files; nothing new was added.
- Sections numbered (1., 2.1 …); a copy with 4+ main sections opens with a "Mục lục" that matches the headings.
- During steps: no docx except `prd.docx` once the user approved the hand-off to design. Version ready to build: both docx exported,
  `reader/` deleted.
