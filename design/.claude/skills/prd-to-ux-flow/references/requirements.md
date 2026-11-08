# Requirements, users, personas, journeys — and checking a design with users and data

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/requirements.md, knowledge/validation.md (Notion) @ 3c0e291 — translated, complete

A thinking lens, not a procedure. Use it while reading a PRD (`prd-read.md` — coverage of the PRD, persona quality, journeys) and while
analysing (`analyze.md`). The decided rules in the job references win where they differ.

## Contents
1. Basics — UX, UI, content; client ≠ user
2. Defining requirements — two questions, six user groups, three importance levels, five requirement types
3. Personas — what makes a good one
4. Customer journey maps — and how to pick which flow to build first
5. Checking a design with users and data

---

## 1. Basics — UX, UI, content; client ≠ user

- **UX** = perception and emotion before, during and after use; **UI** = the touchpoints, the look; **content** = the raw material.
- The *desire path* example: users leave the pretty path for the short / convenient one → design for what people really want.
- **Client ≠ user**: the person paying for the app is not the person using it → the user's needs win.
- A non-interactive product (a plane ticket) only has to be read and understood; an app has to be experienced to be judged.

## 2. Defining requirements

- **Two questions:** **what does the business want** (make more money / save more money; a measurable goal) · **what does the user
  want** (they cannot say it — "anything is fine to eat" / "rice then?" / "no" → you have to understand it yourself).
- **Six user groups:** interact directly · manage other users (permission-based apps) · **receive output from the system** (someone a
  result is shared with) · testers · **the person who decides to buy** (kids' apps — parents pay) · users of competitors.
- **Three importance levels:** important (frequent, direct use — in a kids' app the child matters more than the parent when designing the
  interaction) · normal (occasional, indirect) · weak (pulled in by ads / price, use once and delete — trend apps).
- The goal of gathering requirements: show **the problems of the current system** + prove **the new system solves them**.
- **Five requirement types to clarify — use them as the PRD coverage checklist:**
  1. functional — what the system must do (which functions to add / remove);
  2. data — what information users need, the data structure;
  3. environment — physical, social, organisational (permissions, limits), technical;
  4. users — skills, abilities, limits (people with disabilities / general public / experts);
  5. **users' thinking and psychology** — "very important".
- Gathering methods (research — before the PRD, outside this skill's scope): interviews (open / closed / semi-structured, with a
  script) · questionnaires (once there is a hypothesis, to test it; questions clear, not misleading) · focus groups (need a skilled
  moderator) · natural observation · desk research (predictive only).

## 3. Personas — what makes a good one

- A **fictional but realistic** description of a user group, **mapped from research data**.
- Purpose: empathy · defining the problem · generating fitting ideas · choosing test-participant criteria.
- **Six criteria of a good persona:** fits the context · **real behaviour** (attitude, skills, motivation, goals) · the ultimate goal
  (which feature helps reach it) · real situations written **from the persona's point of view** · a clear setting · **clear pain points**.
- Before the persona: an affinity diagram groups the research data. After the persona: an empathy map.
- → A persona with only demographics (age, gender, job) is **weak** — flag it when reading the PRD.

## 4. Customer journey maps

- CJM = the **touchpoints** of **one persona** on the way to a goal. Contains: timeline · actions (customer / business) · impact
  (touchpoint, message) · customer view (expectations, emotions, thoughts) · business view (goals, metrics) · communication (channel,
  messages) · outcome (emotion, feedback, barriers).
- Layout: touchpoints left → right; customer experience on top, the business part below.
- **Choosing which journey to map:** the typical one (affects the most people — e-commerce: checkout) · **the one with many problems**
  · over time (savings apps, banking) → **also the criteria for which flow to wireframe / build first**.
- Focus on **motivation** and **moments of truth**; always keep in mind: the persona · the timeline · the channels.
- For each user define: motivation (why) · channel · action · difficulty.
- Stages: before purchase (awareness → consideration → decision) · purchase (buy → use) · after purchase (share, refer).
- Four user elements: **action · emotion · obstacle · touchpoint**.
- Make an **assumed** CJM first, then **validate it with real users**.
- Five types: experience map (emotion per touchpoint) · current state · future state · day in the life · empathy map.
- You can map a CJM on **a similar service users are unhappy with** to find opportunities.

## 5. Checking a design with users and data

Research before the PRD is out of scope; this part keeps what is used to **check** a design.

- **Quantitative** (numbers, statistics, narrow focused results) · **qualitative** (spoken, multi-dimensional, the whole picture) —
  combine them: qualitative finds the direction, quantitative proves it (Samsung found TVs stayed off all day → they became furniture →
  beautiful design, hidden speakers; then measured with CSAT / Likert).
- Methods for checking a design:
  - **Usability test** — when: before designing · **once there is a wireframe / lo-fi** · before launch · after launch; **keep leading
    instructions to a minimum** for participants.
  - **Card sorting** (~5 people; open / closed / hybrid) — create or evaluate navigation.
  - **Tree testing** (~20 minutes, at most 10 tasks; only item names shown) — check hierarchy and findability.
  - **A/B test** — after release; **change only one element** (e.g. the CTA copy "See a quote" vs "Learn more"); multivariate when
    changing several (layout, labels, copy).
  - **5-second test** — measures first impressions.
  - Eye-tracking (≥ 30 people before a trend shows) · analytics (bounce, conversion, retention, search behaviour; where they click,
    where they leave).
  - Remote usability (completion rate, time on task).
- **Surveys:** avoid **leading questions**; every question must yield usable information. A good qualitative question is open, simple
  without jargon, and useful to the topic.
- **ROI = 100 % × net benefit / cost** (benefits: lower bug-fix cost, more sales, less churn, higher NPS…).
- **Research plan in five steps:** purpose (audience · functional / content / behavioural goal, or evaluating the old version) · method ·
  participants within the right scope (do not spam the link) · location · script.

Deeper method guidance (usability testing, card sort / tree test procedure, metrics, reporting):
`../ux-review-handoff/references/heuristics-evaluation.md` §5, `../ux-review-handoff/references/ux-research-principles.md` §9–13.
