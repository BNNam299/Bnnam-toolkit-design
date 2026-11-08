# Users method

## 1. Sort the evidence first
- Put every quote and observation (market `M#…`, raw interviews, surveys, analytics) on one line each, then group by natural
  relation; name each group. Dense groups are strong signals. Count **independent sources** per group (one app's reviews = one
  source; Reddit = another).
- An **insight** is a hidden truth that changes behaviour, not a surface observation. Dig with 5 Whys (start every chain with Why,
  stay on the problem's keyword), then What / Where / When / Who / How around each cause.
- When one problem has many tangled causes, lay them out as a **fishbone**: each bone = one cause from the 5 Whys, its small bones
  = the What / Where / When / Who / How details. It shows which cause the product can actually act on.
- Other digging tools: **Lotus Blossom** (the problem in the centre, related factors as petals; take a petal worth digging as the
  centre of a new flower) · **POV** = user + need + insight in one sentence · **How Might We** ("Làm sao để …?") turns a POV into
  several solution directions for kickoff / plan.
- Keep what users praise — it marks what must not break.

## 2. Jobs to be done
- Format: **"Khi <hoàn cảnh>, tôi muốn <việc>, để <kết quả>."** Users do not buy the app; they hire it to get a job done.
- Each job traces to an insight or a quote. Rank by frequency × pain (from market Need Score when it exists).
- Include ≥ 1 emotional or social job ("để không thấy mình yếu đuối trước đồng nghiệp") — they shape tone and paywall copy.
- Jobs become the language of features later: every FEAT cites the job it serves.

**Mental model** (bridge from today to features): one table per primary persona — Quá khứ (tools, apps, habits they meet today) ·
Hiện tại (behaviour and pains, one per row) · Tương lai (what could change that row). The "Tương lai" column is where FEAT ideas come
from, each still citing the pain row.

## 3. Personas
Six criteria — a persona passes when it has all of them:
1. **Context**: where and when they meet the problem.
2. **Real behaviours**: what they do today (with sources), including workarounds.
3. **End goals**: what they want in their life, not in the app.
4. **Written from their perspective**: their words, their reasons.
5. **Clear setting**: device, time of day, moment of use.
6. **Clear pains**: with evidence numbers.

**Empathy map first** (prd.md §5, one per primary persona): Nói (verbatim quotes) · Nghĩ (worries and beliefs — inferred, with
confidence) · Làm (real behaviour, workarounds) · Cảm thấy (the feeling at the moment of the problem) · Nỗi đau · Điều muốn có. Every
cell cites M# / P#; an empty cell stays "chưa có bằng chứng". The persona is then written from the map, not from imagination. When
"Nói" and "Làm" disagree, the gap is usually the insight.

Format per persona: name + one-line position · bối cảnh · hành vi thật · mục tiêu cuối · nỗi đau · cần (outcome). Primary persona
first. A secondary persona is kept only if it needs a **different design**; otherwise merge.

**Who the users are — six kinds** (from the team's research method): people who use the app directly · people who manage other
users · people who only receive its output (a shared result) · people who check the system · people who decide or pay without using
it (parents of a kids app — their needs count) · people using a competitor today (what keeps them there). Importance: **chính** =
often and directly · **phụ** = sometimes or through someone else · **yếu** = came from an ad or a trend and delete the app once done —
do not design around them.

**Who is not a user** — name groups you deliberately do not design for (e.g. "người cần trị liệu lâm sàng — app không thay bác sĩ",
"trẻ em dưới 13"). It protects scope and store review.

**No real data** → proto-persona: label it, and add to prd.md §14 a check the team can actually do (§5 "How this team checks"):
"Kiểm bằng <số liệu sau ra mắt: chỉ số / hỏi thẳng 1–2 người khi có dịp>; nếu <điều gì> sai thì đổi <persona / tính năng nào>."

## 4. Journey and aha moment
- One journey per primary persona. Choose the journey that matters most: the typical one, the most broken one, or the one over time.
- Five stages: **Phát hiện → Cân nhắc → Lần đầu dùng → Dùng hằng ngày → Quay lại / bỏ**. Per stage: action · feeling (😀 / 😐 /
  😣) · obstacle · touchpoint · motivation (why they keep trying), from evidence — plus a short business half: what the company wants
  at that stage (metric) and the opportunity. Mark the moment of truth with ⭐.
- Pick the kind of journey by purpose: experience map (check assumptions, attach metrics per stage) · current state (improve from data)
  · future state (the vision) · **a day in the user's life** (every activity, even unrelated — finds the time slot the app can fit
  into; useful for habit apps) · empathy map (deep feeling layer for one persona).
- Mark the **break point** in the current journey (where they give up) and the **one changed step** in the desired journey — the
  desired journey is an experience, not a feature list.
- Two things always identified: the **motivation to start** and the **moment of truth** (when they decide it works).
- **Aha moment**: the first action that delivers the promised value, written as a countable action, with the **shortest path in
  steps** from first launch. Compare with competitors' step counts from market evidence (complaints about long onboarding).
  Onboarding, paywall position and the activation metric are built on this — later steps cite it, never redefine it.

## 5. Reading evidence honestly and planning research
- A quote is evidence, not a finding; tag each as **did** (behaviour) or **says** (stated preference) — behaviour wins. Disagreeing
  sources usually mean two segments; keep both. Rank findings by frequency × impact; give each a confidence (cao / vừa / thấp); a
  finding from a couple of interviews is a hypothesis. Name people by type, never by name.
- **How this team checks** (small team, no researcher; surveys are rare): the main evidence is **store reviews and forums**, which
  the AI mines itself. When the lead gets the chance to **ask 1–2 people directly**, give them a ready list of **5–7 short questions**
  about what the person **did** the last time, not what they would do (e.g. "Lần gần nhất bạn thấy căng thẳng giữa giờ làm, bạn đã
  làm gì? Mất bao lâu? Có dùng app nào không, vì sao bỏ?"), plus a note format to save the answers as
  `docs/product/raw/hoi-nguoi-dung-<yyyy-mm-dd>.md` (who by type, context, verbatim answers, what surprised). 1–2 people = **a signal,
  not a conclusion**: it can raise a question or a P# evidence line, never upgrade a persona out of "GIẢ ĐỊNH". The persona is
  confirmed by **data after launch** — e.g. does the share of users reaching the aha moment match the guess (activation below).
  Do not propose 5–8 interviews or a 100-person survey unless the user says the team can run them.
- **Choosing a method when the team can do more** (team research method): problem still unknown → open interviews or watching people,
  never a survey · a hypothesis to prove widely → closed survey or analytics · two concrete options → A/B test, one difference · menu /
  navigation questions → card sorting (create) or tree testing (check) · "can people use this design" → usability test · first
  impression → 5-second test · no budget → existing data, reviews and analytics, labelled **dự đoán**. Say which of five requirement
  types the research must clarify: chức năng · dữ liệu · môi trường · kỹ năng người dùng · tâm lý.
- **Writing the questions**: open-ended (let them tell their own story), plain words (no jargon, no product names they do not use),
  every question serves the goal — cut the rest. Ask about the last real time, never "would you…". Sensitive topics (health, money,
  mood) are asked one-on-one, never in a group. Start from what the business needs to learn (earn more or spend less) so the
  questions are not random.
- **Bias check before reporting** (team research audit): sample only of people already interested? leading questions? sample too
  small to conclude? intention read as behaviour? a few reviews treated as the whole market? Each "yes" lowers the confidence of the
  findings it touches — say which.
- **Activation event**: pick the early action that goes with users staying (aha moment), treat it as a hypothesis, and confirm it on a
  later group of users after release — doing the action is not proven to cause staying. Never shrink the denominator to users who
  already activated.
