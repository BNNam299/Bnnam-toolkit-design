# Toolkit lessons — what went wrong in real runs, and the rule it became

The design toolkit got good through rounds of real review; this file does the same for the market toolkit. **Read it before
reporting any step.** After every real run where the user or the team corrects something, append a line — newest at the bottom,
never renumber. A lesson that becomes a rule elsewhere still stays here, with where it was fixed.

Format: `BH-<n> · <dd/mm/yyyy> · <source: test vòng N / dùng thật – dự án> · what happened → the rule · fixed in <file>`

## Lessons
- BH-01 · 06/11/2026 · test vòng 1 · the report addressed the user as "anh" → always "bạn" · `SKILL.md` luật 0, `scripts/check_market.py`
- BH-02 · 06/11/2026 · test vòng 1 · with step 3 missing, step 4 drafted §5.3–5.4 first and asked afterwards → say what is missing and
  ask **before writing anything** · `SKILL.md` luật 5, `market-score` bước 1
- BH-03 · 06/11/2026 · test vòng 1 · kickoff filled every later section with rows of "chưa có số" → a section not run yet is one
  line "Chưa làm — bước N" · `SKILL.md` Output
- BH-04 · 06/11/2026 · test vòng 1 · the CPI range of utility apps was applied to a mental-health app → a team number is only valid
  for its own category; otherwise use an industry range for the right category · `market-score/references/economics.md` §3
- BH-05 · 07/11/2026 · góp ý người dùng · flowery, generic paragraphs with no number or evidence → keep only what carries weight;
  the delete test · `references/writing.md` §1
- BH-06 · 07/11/2026 · test vòng 2 · kickoff ran on into step 2 because the user had pre-approved → pre-approval covers the step's
  own choices, never the next step · `market-kickoff` bước 6
- BH-07 · 07/11/2026 · test vòng 2 · why-now guessed the release date of an OS feature → never date platform features from memory;
  ask Dev or cite a source · `market-score/references/scoring.md` §5
- BH-08 · 07/11/2026 · soát bằng script · a full score table had 8 columns → max 6 columns; split the table or move detail to a list ·
  `references/writing.md` §6, `scripts/check_market.py`
- BH-09 · 07/11/2026 · bàn vai trò với người dùng · the toolkit let the AI or the user "confirm" the final decision → the team meeting
  decides; the AI writes a meeting brief and records the outcome · `references/meeting-brief.md`, `market-decide`
- BH-10 · 07/11/2026 · bàn vai trò · the brief asked Dev for "whatever is certain to be needed", with no limit → round 1 = core +
  biggest risk, max 3 rounds, about 1.5 weeks, dated deadlines · `references/dev-brief-writing.md`
- BH-11 · 07/11/2026 · bàn vai trò · CPI was "asked from UA", but the team has no UA or ASO person → look up an industry range and
  compare it with the break-even CPI in one plain sentence · `market-score/references/economics.md` §3, `references/data-sources.md`
- 08/11/2026 · người dùng · tài liệu đưa kết quả mà không nói đã giải bằng cách nào → dùng phương pháp có tên thì ghi "Cách làm:" tại
  chỗ + phụ lục "Phương pháp đã dùng" + nêu trong câu trả lời · `references/writing.md` §9
