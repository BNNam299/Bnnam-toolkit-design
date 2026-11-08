# Heuristics and UX evaluation — metrics, Nielsen's ten, severity, methods

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/evaluation.md §28, §35 intro, §35.1–35.3, §35.22–35.23, "Telos — UX evaluation" §1–10, "Notion — usability" @ 3c0e291 — translated, complete

Expert-review knowledge: what to measure, Nielsen's ten heuristics in depth, how to run a heuristic evaluation, which evaluation method
answers which question, and the master review checklist. A thinking lens, not a procedure — the review job and its single scoring scale
are in `../SKILL.md` and `review-methods.md`. Cognitive and research background (mental models, load, attention, research methods,
trust, AI) is in `ux-research-principles.md`.

> **Severity scales — read before scoring.** This file quotes three published scales that run in **different directions**:
> §1.5 S0–S3 (S3 worst), §5.3 NN/g 0–4 (**4** = catastrophe), and the team scale in §6.3 / `review-methods.md` §4 (**0** = must fix).
> Every finding in `design/review.md` uses **only the team scale 0–4, where 0 is worst and 4 is fine**. Rough mapping when reading other
> sources: S3 / NN/g 4 ≈ team 0 · S2 / NN/g 3 ≈ team 1 · S1 / NN/g 2 ≈ team 2 · S0 / NN/g 1 ≈ team 3 · NN/g 0 (not a problem) ≈ team 4.

## Contents
1. Measuring and evaluating UX quality (metrics, heuristic questions, S0–S3, minimal test plan, experiments)
2. Usability vs UX; five usability attributes; the right unit of analysis
3. Nielsen's ten usability heuristics
4. Running a heuristic evaluation properly
5. Evaluation methods and how to choose (Telos)
6. Usability components, expert vs user evaluation, team 0–4 scale (Notion)
7. UX review master checklist
8. Sources

---

## 1. Measuring and evaluating UX quality

### 1.1 Task metrics
- Task success rate.
- Time on task.
- Error rate and severity.
- Number of steps / returns.
- Abandonment point.
- Time to recover.
- First-time vs returning user performance.

### 1.2 Product behaviour metrics
- Activation — the user reaches the first moment of value.
- Feature adoption — used by the right people, not just clicked.
- Retention by cohort.
- Funnel completion.
- Search success / no-result / refinement rate.
- Notification opt-in, open and disable rate.
- Form correction rate per field.
- Undo/retry rate — can reveal actions that are easy to get wrong, or an unreliable system.

Don't optimise a local metric in a way that harms users. Raising notification opens with fear-inducing titles is a dark pattern.

### 1.3 Perception metrics
- SUS or UMUX-Lite for overall usability.
- SEQ after a task.
- Confidence/trust for financial, medical or AI tasks.
- Perceived performance.
- Accessibility satisfaction among assistive-technology users.

### 1.4 Heuristic review questions
1. Is system status always visible?
2. Does the language match the real world?
3. Can users exit/undo?
4. Are patterns consistent?
5. Does the design prevent errors?
6. Is recognition favoured over recall?
7. Are there accelerators for frequent users?
8. Is the UI focused and free of excess?
9. Do errors help users notice, understand and recover?
10. Is help available at the right time?
11. Are accessibility and privacy the default?
12. Does behaviour follow platform conventions?

### 1.5 Severity scale S0–S3

| Level | Meaning | Example |
|---|---|---|
| S0 | Cosmetic | Spacing slightly off, no effect on the task |
| S1 | Minor | Slows or confuses but there is a way forward |
| S2 | Major | Many people fail or need a workaround |
| S3 | Critical | Data loss, wrong transaction, task blocked, serious privacy/accessibility violation |

Priority also depends on frequency, how many people are affected and recoverability.

### 1.6 Minimal usability test plan
- 5–8 people per main behavioural group for a small formative round.
- The scenario is a goal, not button instructions.
- Record success, time, errors, quotes and hesitation points.
- Test on real devices and real networks.
- At least one large-text/accessibility configuration if the flow is important.
- Synthesise patterns; don't change things for one isolated opinion without evidence.

### 1.7 Experiments
- A/B test only when both variants are safe and accessible.
- Define the primary metric, guardrails and duration before running.
- No peeking, no changing the hypothesis after seeing results.
- Statistical results don't replace qualitative research into causes.
- Never test dark patterns on vulnerable groups.

---

## 2. Usability vs UX; five usability attributes; the right unit of analysis

This part systematises core UX knowledge from the [Nielsen Norman Group](https://www.nngroup.com/articles/) library. The aim is not to
memorise "laws" but to build a verifiable chain of reasoning:

```text
Real needs and context
→ cognitive/behavioural limits
→ design principle
→ solution hypothesis
→ research and measurement
→ iterative improvement
```

**Usability** is how effectively target users can complete specific tasks in a defined context. **UX** is broader: expectations before
use, feelings during interaction, results afterwards, trust, fit, accessibility and the whole multichannel experience.

A product can be:
- Easy to use but valueless — quickly completes a task nobody needs.
- Valuable but hard to use — solves the right problem but causes errors or effort.
- Beautiful but untrustworthy — good visuals that hide fees or data status.
- Technically accessible but hard to use — a screen reader reaches every control, but order, labels and flow are still confusing.
- Locally successful but failing end to end — a smooth app, but delivery, support or refunds break.

### 2.1 Five usability attributes for review

| Attribute | Question | Metric or evidence |
|---|---|---|
| Learnability | How easily do newcomers complete basic tasks? | First-attempt success, time, sticking points |
| Efficiency | Once learned, how fast and with how little effort? | Time on task, steps, actions, context switches |
| Memorability | After a break, can they pick it up again? | Relearning time, errors on return |
| Errors | How many errors, how serious, how is recovery? | Error rate, severity, recovery rate, data lost |
| Satisfaction | Is it pleasant, trustworthy and as expected? | SEQ/SUS or a targeted scale, interviews |

Don't optimise one attribute by breaking another. Removing guidance can speed up experts but make newcomers fail; confirmation at every
step may reduce some slips but kills efficiency and creates "confirmation blindness".

### 2.2 The right unit of analysis
- **User** — which group, experience, abilities, motivation and constraints?
- **Goal** — the real-world outcome they want, not just an in-app event.
- **Task** — the sequence of actions to reach the goal.
- **Context** — device, environment, time, interruptions, network, emotion, risk.
- **Outcome** — was the result really achieved, or did the UI only report success?

A usability statement always needs context. "This screen is easy to use" is incomplete; "a user with an existing account can change the
delivery address before the order closes, on a phone, without help" can be verified.

---

## 3. Nielsen's ten usability heuristics

The [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) are broad principles, not a detailed checklist
or a substitute for research. Use them to find risks, explain problems and generate review questions.

### 3.1 Visibility of system status
The system responds in reasonable time and helps users know:
- Has the action been received?
- What is the system doing?
- What is the progress or waiting time?
- Is the current data saved, synced or sent?
- What just happened, and where is the next step?

Good examples: a button switches to a processing state and blocks double submit; an upload shows each file and its own error; autosave
shows a "Saved" state; offline mode says which parts still work.

### 3.2 Match between the system and the real world
- Use concepts users know; don't let the data model or service names leak into the UI.
- Order things by the real process: departure date before return date, delivery address before delivery method.
- Natural mapping makes the control–outcome relationship predictable.
- Metaphors help only when consistent; don't drag a physical model so far that it limits digital abilities.

User research must establish terminology and mental models. A word the internal team has used for years is not necessarily understood
by customers.

### 3.3 User control and freedom
- Clear back/cancel/close; never trap users in a flow against their will.
- Prefer undo/redo and reversible actions.
- Never auto-select extra services or change consequential settings.
- Allow edits before committing, review before large transactions, and stopping long processes where sensible.
- Protect draft data on accidental exit or session expiry.

Control makes users confident to explore. If every tap might have irreversible consequences, they act slowly and try less.

### 3.4 Consistency and standards
- The same word, icon, shape and behaviour mean the same thing.
- Follow iOS/Android, web and domain conventions before inventing a pattern.
- Internal consistency is not enough: a pattern consistent within the app is still hard to learn if it contradicts the ecosystem users know.
- Standardise loading, errors, forms, navigation, gestures and accessibility semantics in the design system.

Consistency lowers learning; it doesn't mean every screen looks the same or both platforms match pixel for pixel.

### 3.5 Error prevention
Two layers:
1. **Remove error-prone conditions** — constraints, the right keyboard, autoformat, safe defaults, clear dependencies, sensible disabling.
2. **Check before commit** — review, inline validation, or confirmation for serious actions.

Distinguish:
- **Slip** — the right goal but a wrong action; improve targets, mapping, undo, spacing.
- **Mistake** — a goal/decision based on a wrong mental model; improve concepts, guidance, preview and information.

### 3.6 Recognition rather than recall
- Show options, history, values just entered and previous state.
- Use recent items, autocomplete, search suggestions and examples.
- Keep instructions close to where they're used; never require remembering from a previous screen.
- Allow showing the password when needed; support password managers/passkeys.
- Menus and visible actions beat secret commands for newcomers; shortcuts support experts.

Recognition doesn't mean putting everything on screen. Too many unstructured options create scanning cost; group and build hierarchy.

### 3.7 Flexibility and efficiency of use
- Good defaults and an easy basic path.
- Accelerators: shortcuts, bulk actions, templates, saved filters, automation, command palette.
- Customisation when professional workflows truly differ.
- Don't force experts to repeat onboarding or pass every step.
- An adaptive interface must not change so arbitrarily that the mental model becomes unstable.

### 3.8 Aesthetic and minimalist design
Every extra unit competes for attention with the necessary ones. Minimalism isn't lots of white space or few colours; it is **the right
content, the right priority, at the right time**.
- Remove decoration with no meaning.
- Reduce competing CTAs.
- Move secondary detail into progressive disclosure.
- Don't lose context, predictability or trust just to make the screen "clean".
- A data-dense interface can still be minimal if every piece of information supports a professional decision.

### 3.9 Help users recognize, diagnose and recover from errors
- Put the error near its source, in the user's language.
- Say exactly what's wrong and how to fix it.
- Keep input, state and work already done.
- Offer retry, an alternative path or contextual support.
- An error code is only secondary information for support.

Detailed rubric: `../ux-writing/references/handbook-patterns.md` §2.

### 3.10 Help and documentation
The interface should explain itself, but complex systems still need help. NN/g distinguishes:
- **Proactive help** — guidance before a problem, such as onboarding or a contextual tip.
- **Reactive help** — help when an error happens or users need to learn more.

Good help is searchable, task-focused, has concrete steps and isn't too long. Put help near where it's needed; never use a large
documentation centre to make up for a hard UI.

---

## 4. Running a heuristic evaluation properly

A [heuristic evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) is an expert review against usability
principles. It finds **potential problems**; it doesn't prove that real users will certainly hit them.

### 4.1 When to use it
- Early in design, to catch obvious problems before testing.
- Before a usability test, to choose areas to observe closely.
- When the research budget is small but a baseline is needed.
- When auditing an old flow, a design system or a build.
- When adding domain heuristics: health, finance, AI, accessibility, games.

### 4.2 Procedure
1. **Scope** — one user group, task, device and version.
2. **Pick the heuristics** — the ten general ones plus domain principles if needed.
3. **Prepare evaluators** — ideally 3–5 people with different viewpoints; explain the criteria and severity.
4. **Review independently** — each evaluator goes through the flow several times in 1–2 hours without seeing the others' notes.
5. **Record each problem separately** — evidence, location, violated heuristic, impact, preliminary recommendation.
6. **Merge** — combine duplicates, discuss differences, don't drop a minority insight just because it got fewer votes.
7. **Rate severity** — frequency, impact, persistence/recoverability and scope.
8. **Prioritise action** — owner, milestone, how it will be verified.
9. **User research** — confirm the high-risk or disputed points.

### 4.3 Issue template

```text
Flow/state:
User/task/device:
Observation:
Heuristic:
Evidence/screenshot:
Impact on the user:
Severity + reason:
Recommendation or question to test:
Owner/status:
```

Don't turn a heuristic review into a bug-hunting contest or a demand for mechanical compliance. A violation can have a valid reason; the
team records the trade-off and verifies it with research. (The team's `design/review.md` entry format: `review-methods.md` §8.)

---

## 5. Evaluation methods and how to choose (Telos)

### 5.1 Which question does evaluation answer?
UX evaluation is not one activity. Some methods predict problems through experts, some observe real users, some measure behaviour after
release. The wrong method can produce correct data that doesn't answer the project's question.

| Question | Fitting method |
|---|---|
| Does the interface break usability principles? | Heuristic evaluation |
| Can newcomers figure out how to use it alone? | Cognitive walkthrough |
| Which task creates high cognitive effort? | PURE |
| Where and why do real people fail? | Usability testing |
| Which version produces better behaviour? | A/B testing |
| At which step does the funnel drop? | Analytics |
| How do users feel and explain it? | Suitable interview/survey |

### 5.2 Planning an evaluation
An evaluation plan has:
- The context and the decision the result will support.
- A research question, not a vague goal like "test the UX".
- Audience, tasks, devices and environment.
- Method, who runs it and when.
- Data to collect, metrics and success criteria.
- How results are synthesised, severity, and who receives the report.

Separate **diagnostic metrics** from **outcome metrics**. A long task time may signal friction but doesn't explain its cause. Higher
conversion may be good for the business, but check errors, regret and support cost to avoid local optimisation.

### 5.3 Heuristic evaluation
- **Preparation** — choose the scope, important tasks, persona/context and heuristic set. Nielsen's ten are the usual start; specialised
  products may add accessibility, privacy, mobile conventions or domain safety.
- **Execution** — each evaluator checks independently in at least two passes: first to understand the overall flow, then element by
  element. Each issue records location, violated heuristic, evidence, impact, severity and suggestion. Merge only afterwards, to avoid
  groupthink.
- **Severity (NN/g scale — 4 is worst; the team review uses the reverse scale, see the note at the top):**
  0 not a usability problem · 1 cosmetic, fix when there is time · 2 minor, has an effect but doesn't block the task · 3 major, causes
  failure/significant cost · 4 catastrophe, must fix before release. Consider frequency, impact and persistence, not personal annoyance.

### 5.4 Cognitive walkthrough
Define the new user, their starting knowledge, the goal and the correct action sequence. For each action ask:
1. Does the user form the right goal at this step?
2. Do they notice the control/action needed?
3. Do they connect that control with the goal?
4. After acting, does the feedback show correct progress?

Write a specific success story or failure story. Fits onboarding, new features, rarely used flows or products without training. It
doesn't measure expert efficiency and doesn't replace user testing. (Team procedure: `review-methods.md` §3.)

### 5.5 PURE
PURE — Pragmatic Usability Rating by Experts — splits a task into steps and rates each step's cognitive effort. A low score means a clear,
direct action; a high score means users must infer, learn or overcome an obstacle. The total helps compare flows or track improvement.
PURE is fast and gives a number that's easy to communicate, but it is still expert judgement. Use it to prioritise and compare; never
present it as evidence of user behaviour.

### 5.6 Usability testing step by step
- **Tasks** — describe the goal and context without revealing button names or the path. Good: "Bạn vừa đổi số điện thoại và muốn cập
  nhật tài khoản" *(You just changed your phone number and want to update your account)*; leading: "Hãy vào Cài đặt và bấm Đổi số"
  *(Go to Settings and tap Change number)*.
- **Participants** — recruit by behaviour, experience and relevant context, not only demographics. Several segments or permission roles
  need separate tests. About five participants can be enough for a small qualitative round with one homogeneous group, but that is not a
  rule for benchmarks or statistical comparison.
- **Facilitation** — say the product is being tested, not the user. Keep reasonable silence, ask neutrally ("What are you thinking?"),
  don't rescue too early. Record observation before interpretation.
- **Data** — task success (completed, completed with help, failed) · time on task and path · errors, hesitation, backtracking and points
  needing help · quotes/mental model · post-task ease or satisfaction.
- **Synthesis** — cluster observations into patterns; tie each issue to task, evidence and impact; rank severity; propose a direction
  rather than turning every user remark into a feature request. Retest after fixes.

### 5.7 A/B testing
Write the hypothesis: change X for group Y will improve metric Z because of Q. Choose the primary metric, guardrail metrics,
randomisation unit, sample size and duration before running. Don't stop as soon as results look good, run many variants but report only
the winner, or change the experiment midway. A/B tests suit behavioural decisions at sufficient scale. They don't fit low traffic, high
risk, variants with obvious usability errors, or "why" questions. Combine with qualitative research to explain results.

### 5.8 Analytics and UX metrics
Common metrics: funnel completion, activation, retention, churn, search success, error rate, feature adoption and support contacts. HEART:
Happiness, Engagement, Adoption, Retention, Task success. No vanity metrics detached from goals. Design the event taxonomy before release:
event name, trigger, properties, user/session identity and privacy. Check that events really fire correctly — precise wrong data still
leads to wrong decisions.

### 5.9 Reporting
Lead from decision → evidence → implication → recommendation. Each issue has an image/video/timecode where suitable, a severity and an
owner. Keep findings separate from recommendations so the team can weigh several solutions. A good readout prioritises **5–10 important
problems** over hundreds of unranked details.

### 5.10 Quality checklist
- [ ] The research question and the decision after it are clear.
- [ ] The method fits the kind of evidence needed.
- [ ] Tasks are not leading.
- [ ] Participants represent the important behaviours.
- [ ] Observation is separated from interpretation.
- [ ] Metrics and experiment stopping rules are set in advance.
- [ ] Severity is based on impact, not preference.
- [ ] There is a retest or follow-up after changes.

---

## 6. Usability components, expert vs user evaluation, team 0–4 scale (Notion)

### 6.1 Usability
UX = LOOK + FEEL + USABILITY. Usability = how well the product is used to reach goals in a specific context. Five components (also the
measurement criteria in tests):
1. **Learnability — easy to learn the first time**
   - Predictability: one look and you correctly guess the result of an action; tapping and not getting what you predicted → frustration.
   - Recognisability: components can be seen and told apart (a button lost in body text = not recognised).
   - Hidden interactions (tap a card to flip it) are only fine when based on users' familiar experience.
2. **Efficiency — performance once learned**, four criteria:
   - Navigation: clear path, clear signs, a shortest path exists — tied to IA.
   - Control: users can control/personalise what is shown.
   - Feedback: clear, consistent, fast, continuous — users know immediately whether it failed or succeeded and move on.
   - Smart system: does work for the user (keyword suggestions, spelling correction).
3. **Memorability — remembered after a long time**
   - Familiarity: familiar language and symbols; create new identifiers only for specific meaning. An icon may carry a caption on the
     first screen, then appear alone on later screens.
   - Consistency across the whole system.
4. **Errors — errors users make**, three levels:
   - Not serious — self-fixable (wrong category, tap Back).
   - Neutral — no big consequence (forgot to change the default address).
   - Serious — bad result (exit without saving, accidental delete).
   → Three mechanisms: **Warn** (confirm before a risky action) · **Self-protect** (autosave, block malicious files) · **Recover**
   (trash kept 15–30 days, restore).
5. **Satisfaction**
   - Flexibility: several ways for newcomers and veterans; fits each platform.
   - Style fits the target audience.
   - Avoid sudden changes that disrupt interaction.

### 6.2 Two kinds of evaluation
- **Expert** — subjective, based on the first four components (Satisfaction needs real users).
- **User** — objective, following a scenario.

Before evaluating: understand the product and build the scenario — **Who / When / Why / How**.

### 6.3 Team scale 0–4 (used in every review)
**4** fine, no fix · **3** not great, fix or not · **2** fairly serious, needs fixing · **1** very serious, fix soon · **0** must fix,
otherwise unusable.

Each issue carries the violated criterion + score + solution. Real example (MyTV):
- "Tất cả" *(All)* in the Recommended section opens the Movies section instead → predictability (1); also navigation (0).
- An icon that appears and disappears while posters rotate → recognisability (2); an unfamiliar icon → predictability (3).
- Repeated navigation when the tab bar already has that item · no customisation (3) · search with no suggestions (smart system).
- Sample solution: rename the section to match expectations ("Đề xuất" *(Recommended)* that isn't personalised → rename to "Phim"
  *(Movies)*).

---

## 7. UX review master checklist

**Value and task**
- [ ] Specific user/goal/context?
- [ ] Is the real-world outcome clearer than an in-app event?
- [ ] Does the feature solve a need, or just show off technology?

**Mental model and cognitive load**
- [ ] Concepts, order and mapping match expectations?
- [ ] Recognition instead of recall at important points?
- [ ] No unnecessary remembering, calculating or context switching?
- [ ] Progressive disclosure doesn't hide what changes the decision?

**Interaction**
- [ ] Status, feedback and saved data are clear?
- [ ] Exit, cancel, undo and recovery exist?
- [ ] Errors prevented up front; confirmation only at fitting risk?
- [ ] Loading pattern matches the duration and process type?

**Attention and findability**
- [ ] Important content sits near the focus and has a cue?
- [ ] Nothing looks like an ad or competes with animation?
- [ ] Labels/links have information scent?
- [ ] IA has been tested and doesn't mirror the org chart?

**Trust and ethics**
- [ ] Price, fees, renewal, data and consequences disclosed before the action?
- [ ] Opt-in/opt-out and join/cancel take fair effort?
- [ ] No fake urgency, scarcity or social proof?
- [ ] Claims match behaviour and have sources?

**Accessibility and inclusion**
- [ ] Semantics, focus, state, errors and change announcements correct?
- [ ] Task completable with screen reader/keyboard/large text?
- [ ] No unnecessary timeouts, sensory load or gesture-only actions?
- [ ] Disabled users take part in research?

**Evidence**
- [ ] Decisions tied to observations and research limits?
- [ ] Method matches the question?
- [ ] Behaviour + attitude, qualitative + quantitative where needed?
- [ ] Owner, severity, metric, guardrail and review date?

---

## 8. Sources

NN/g:
- [UX & Usability Articles](https://www.nngroup.com/articles/) — topic library and popular articles.
- [UX Basics: Study Guide](https://www.nngroup.com/articles/ux-basics-study-guide/) — map of foundational knowledge.
- [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — the ten usability principles.
- [How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) — expert review procedure.
- [Mental Models](https://www.nngroup.com/articles/mental-models/) — users' beliefs about the system.
- [Minimize Cognitive Load](https://www.nngroup.com/articles/minimize-cognitive-load/) — intrinsic/extraneous load and reducing it.
- [Recognition and Recall](https://www.nngroup.com/articles/recognition-and-recall/) — memory cues in interfaces.
- [Psychology for UX: Study Guide](https://www.nngroup.com/articles/psychology-study-guide/) — sensemaking, attention, decision making.
- [Change Blindness](https://www.nngroup.com/articles/change-blindness-definition/) — attention limits with UI changes.
- [Banner Blindness](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/) — selective attention to ad-like elements.
- [Information Foraging](https://www.nngroup.com/articles/information-foraging-leave-site/) — cost–benefit when seeking information.
- [Interaction Cost](https://www.nngroup.com/articles/interaction-cost-definition/) — total mental and physical effort.
- [Response-Time Limits](https://www.nngroup.com/articles/response-times-3-important-limits/) — feedback by wait time.
- [Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/) — choosing skeleton, spinner or progress.
- [Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/) — when to confirm and when to use undo.
- [When to Use Which UX Research Methods](https://www.nngroup.com/articles/which-ux-research-methods/) — framework for 20 methods.
- [Usability Testing 101](https://www.nngroup.com/articles/usability-testing-101/) — facilitator, tasks and participants.
- [Journey Mapping 101](https://www.nngroup.com/articles/journey-mapping-101/) — journeys by goal and time.
- [UX Mapping Methods: Study Guide](https://www.nngroup.com/articles/ux-mapping-methods-study-guide/) — journey, blueprint and roadmap.
- [Service Blueprints: Definition](https://www.nngroup.com/articles/service-blueprints-definition/) — linking touchpoints to people/process/props.
- [Trustworthiness in Web Design](https://www.nngroup.com/articles/trustworthy-design/) — four groups of credibility signals.
- [Deceptive Patterns](https://www.nngroup.com/articles/deceptive-patterns/) — recognising dark patterns and sludge.
- [Accessibility and Inclusivity: Study Guide](https://www.nngroup.com/articles/accessibility-inclusivity-study-guide/) — accessible/inclusive design and research.
- [Designing AI Products and Features: Study Guide](https://www.nngroup.com/articles/designing-ai-study-guide/) — value, scope and patterns for AI.
- [How AI Works and How Users Think About It](https://www.nngroup.com/articles/ai-functionality-study-guide/) — mental models, trust and AI behaviour.

Telos Academy (Vietnamese): [Usability](https://academy.telos.vn/usability-la-gi-ux-design/),
[Learnability](https://academy.telos.vn/learnability-la-gi-ux-design/),
[Usability Testing](https://academy.telos.vn/usability-testing-la-gi-ux-design/),
[Heuristic Evaluation](https://academy.telos.vn/phuong-phap-heuristic-evaluation/),
[Cognitive Walkthrough](https://academy.telos.vn/phuong-phap-cognitive-walkthrough/),
[PURE](https://academy.telos.vn/pure-phuong-phap-danh-gia-ux-tu-chuyen-gia-google/),
[A/B Testing](https://academy.telos.vn/a-b-testing-la-gi-product-ux/).
