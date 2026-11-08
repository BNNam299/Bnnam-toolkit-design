# Deciding and handing over

## Contents
1. Reading Dev's answers
2. Choosing the verdict
3. The hand-off (§7)
4. Re-checking assumptions later

## 1. Reading Dev's answers
Answer files follow the form in `dev-brief.md` §7: per capability — kết luận, số đo, ca lỗi, phương án dự phòng, ước lượng công.
- Compare each answer with the brief's thresholds (on the weakest device). Write the result in §5.4 and as evidence ("Dev đo …").
- "Đạt có điều kiện" → write the condition into §6 risks and §7.
- "Không đạt" on a **core** capability → look at section 5 of the brief ("nếu không đạt thì sao"): fallback exists → the idea may
  continue in a changed form (đổi hướng); no fallback → that capability's stop threshold is hit.
- "Chưa rõ" or missing → the capability counts as not checked.
- If Dev's answer contradicts the AI's earlier guess, Dev wins; note the old guess was wrong — it is useful calibration.

## 2. Choosing the verdict
| Verdict | When |
|---|---|
| **Làm tiếp** | no stop threshold hit; core capabilities "đạt" (or the user accepted the technical risk); the money check works in at least one target tier, or the gap to make it work is named |
| **Đổi hướng** | a threshold is hit but the evidence points to a better variant: another segment, another tier, a narrower idea, a different business model, a fallback for a failed capability — name the new direction and which step to rerun (usually `market-score`, sometimes `market-dig`) |
| **Dừng** | a threshold is hit with no credible variant; or a core capability fails with no fallback; or users will not pay and the team cannot change the model |

Before the meeting, this table feeds the **suggestion** in the meeting brief. After the meeting, write §6 as: one plain sentence
with the team's verdict → threshold lines → technical status (incl. Dev questions left unanswered at the deadline) → 3 biggest
remaining risks → what would change the verdict → who attended, when → the AI's suggestion if the team chose differently, and why.

If the idea was assigned (stopping not allowed, recorded in §1), the verdict is still written honestly; "dừng" becomes "làm tiếp với
rủi ro cao" plus the conditions that reduce the risk.

## 3. The hand-off (§7)
The next toolkit (product: requirements, flows) reads `docs/market/` as its input. List what it must know, in plain words:
- the target user and situation (one sentence)
- the main pain clusters with evidence numbers, and what users praise (must keep)
- core features and baseline features (from the free-vs-paid matrix), the 1–2 differentiators
- the price anchor and the money model that fits each target tier
- technical status per core capability (Dev's answers)
- countries / tier to start with
- open questions the product stage must answer

## 4. Re-checking assumptions later
The "Cần bổ sung để kiểm lại" table is the to-do list for verification. When new data arrives (now or months later):
1. Read the data, add evidence entries.
2. For each assumption it touches: verified → remove the row and note "đã kiểm (#n)"; wrong → follow the "Nếu sai thì đổi kết luận
   nào" column and tell the user which sections and which decision need revisiting.
3. If a conclusion changes, update §0 and add a dated line to §6 — never silently rewrite an earlier decision.
