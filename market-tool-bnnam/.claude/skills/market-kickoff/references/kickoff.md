# Kickoff — questions, idea sentence, stop thresholds

## Contents
1. Entry points
2. Constraints to ask
3. The idea sentence and team strengths
4. Stop thresholds

## 1. Entry points
| The user has | What the research does | Starts from |
|---|---|---|
| **A keyword** (given by management or chosen by the PO), e.g. "cast TV" | checks the size and direction of that app group, then looks for the gap | 2–3 main keywords → scan |
| **An idea** ("an app that … for …") | validates the idea: is the pain real, who already solves it, can we win and earn | the idea's pain → scan around it, but widen it into a pain group, not one feature |
| **Nothing yet** | looks for a pain group worth building for | 3–5 need zones (below) → scan each briefly |
| **Several ideas to choose from** | compares them | scan each lightly → dig into the 1–2 best |

Need zones when starting from nothing — pick 3–5, prefer zones where the team already has an advantage:
life management · money · health · mental wellbeing / focus · family · learning · creativity (drawing, writing, photo, content) ·
digital devices (storage cleaning, security, email, files, remote control) · work · entertainment.

Always say which entry point you are using, so the user can correct it.

## 2. Constraints to ask
Ask in one message, with defaults:
- Platform: iOS / Android / both, and which first if both. No default — the team has iOS and Android Devs and decides per app.
- Target countries: which tier first? (T1 = rich countries like US, UK, DE, JP; T3 = lower-spending like BR, MX, VN, ID.) Default:
  US first, note others.
- Monetization in mind: subscription, one-time purchase, ads, mixed — or open.
- Time: when must the decision be made? Is there a deadline for launch?
- Team: who builds (iOS / Android / AI skills), how many people, any tech the team is strong or weak at.
- Budget for user acquisition, if known (affects whether paid ads or search is the way in).
- What is already known: earlier research, competitor lists, tool exports, Dev opinions → should be in `raw/`.
- Is stopping allowed? (If the idea is assigned, the research optimises *how*, not *whether*.)

## 3. The idea sentence and team strengths
Write the idea as one sentence, so it can be tested:
```
Cho <ai> đang khổ vì <vấn đề> trong <hoàn cảnh>, app giúp <kết quả> bằng <cách riêng>.
```
If the user's idea is a feature ("an AI cleaner"), push for the pain behind it: who suffers, when, what they do today. "AI" is a
mechanism, not a value — "dọn hàng nghìn email quảng cáo theo người gửi" is an idea; "app dọn dẹp AI" is not yet.

Separate *what users ask for* from *what they really need*: "I need a delete-all button" → the need is "clear the clutter without fear
of deleting something important".

Team strengths to record (ask the user to confirm or update): utility / device cleaning, drawing and creative learning, remote control
and casting, subscription onboarding and paywalls, AI-assisted features — plus anything specific to this project. A team strength
lowers both build and marketing risk and counts in the "hợp team" score later.

## 4. Stop thresholds
Rules written now, checked in step 2 (early stop) and step 5 (decision). Each must name **a measurable condition** and **an action**.
Propose 3–5 from this menu, adjusted to the project:

| Area | Example threshold | Checked in |
|---|---|---|
| Market closed | top 3 apps take > 80% of the group's downloads AND no app launched in the last 12 months reached > <n> downloads/month | step 2 |
| Market shrinking | downloads of the top 5 fell > 30% over 12 months with no sign of a new direction | step 2 |
| Pain not real | the main pain group has < 2 independent sources, or appears only in one viral post | step 3 |
| Users won't pay | revenue per download of the top 5 is below <x> USD and no plan structure works in the target tier | step 4 |
| Not profitable | the break-even CPI (middle scenario) is below the low end of the industry CPI range in every target tier, and the idea cannot win store search | step 4 |
| Can't build | Dev answers "không đạt" for a core capability with no fallback | step 5 |
| Not a fit | the team has none of the strengths the idea needs and no plan to get them | step 4 |

Write the numbers with the user. If they do not know, propose a value and its reason, and mark it "đề xuất — người dùng đã duyệt
dd/mm/yyyy". Stopping early is a good result: it saves the build.
