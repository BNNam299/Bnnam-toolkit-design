# UX principles behind a review — cognition, attention, decisions, research, trust

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/evaluation.md §35.4–35.21 @ 3c0e291 — translated, complete

The "why" behind review findings: how people think, attend and decide, which research method answers which question, and how
trust is built or lost. A thinking lens, not a checklist. Heuristics, severity and the evaluation procedure live in
`heuristics-evaluation.md`; the review job itself in `../SKILL.md`. Vietnamese UI copy examples keep an English gloss in *(italics)*.

## Contents
1. Mental models and the designer–user gap
2. Cognitive load and working memory
3. Recognition, recall and external memory
4. Selective attention: change blindness, banner blindness
5. Information foraging, information scent, interaction cost
6. Feedback, response time and designing waits
7. Decisions, choices and progressive disclosure
8. Error prevention, undo and confirmation
9. Choosing the right research method
10. Quality usability testing
11. Information architecture: card sorting and tree testing
12. Journey maps
13. Service blueprints
14. Trust, credibility, transparent design; deceptive patterns and sludge
15. Accessibility and inclusive UX beyond compliance
16. AI UX: from novelty to verifiable value
17. From research insight to product decision
18. Playbook: combining methods in a mobile project

---

## 1. Mental models and the designer–user gap

Per NN/g, a **mental model** is what users believe about how the system works. They use it to predict results and choose actions; it
may not match the implementation.

Three models to tell apart:
- **Implementation model** — how the system is really built.
- **Design/conceptual model** — how the product tries to explain how it works.
- **User mental model** — what each person forms from experience, language and other systems.

Problems appear when the gap between the conceptual model and the mental model is too large. Examples:
- Users think "delete from device" means "delete from the cloud".
- They think the cart holds only items they chose, but the system adds insurance.
- They think Back undoes changes, while the app autosaves instantly.
- They think the AI "knows" real facts, while the model only produces probable answers.

### 1.1 Handling a mismatch
1. **Prefer making the system match the common model** — move content to where users look, use conventions.
2. **If a new model is necessary, teach it through interaction** — preview, feedback, examples, clear state and outcome.
3. **Don't make users understand the implementation** — explain value and consequences, not backend architecture.
4. **Stay consistent so the model stays stable over time.**
5. **Research** with interviews, contextual inquiry, card sorting, task tests and support logs.

"Intuitive" usually just means "fits what people already know". A new pattern is not natural; its value must be big enough to pay for
the cost of learning it.

## 2. Cognitive load and working memory

[Cognitive load](https://www.nngroup.com/articles/minimize-cognitive-load/) in UX is the mental resources needed to operate an
interface. Working memory is limited; when the UI demands too much, users slow down, miss things, err or give up.

- **Intrinsic load** — the inherent difficulty of the goal or domain (understanding interest rates, a technical diagnosis).
- **Extraneous load** — effort caused by the design that doesn't help the goal (vague terms, having to remember data, chaotic layout).

You can't and shouldn't remove all load. Reduce extraneous load so the remaining resources go to the real decision.

### 2.1 Common sources of load
- Remembering information from a previous screen.
- Many options, ungrouped or without comparison criteria.
- Visual clutter, competing animation, weak hierarchy.
- New labels/interactions that break convention.
- Converting formats, units or mental models in your head.
- Context switching between apps, tabs, documents and tools.
- Long sentences, jargon, double negatives.
- A slow system with no feedback.
- Important data scattered in several places.

### 2.2 Three strategies to reduce load
1. **Cut clutter** — remove what's extra, group by meaning, build hierarchy.
2. **Lean on existing mental models** — conventions, familiar words, natural mapping.
3. **Offload memory** — show data again, preview, defaults, calculations, comparison tables, recent items.

Checklist:
- [ ] Is there anything users must remember instead of see?
- [ ] Is there a calculation/conversion the system could do?
- [ ] Is any decision made before there's enough information?
- [ ] Can things be compared directly, or must users go back and forth between screens?
- [ ] Does every visual emphasis carry meaning?
- [ ] After an interruption, can users recover the context?

## 3. Recognition, recall and external memory

[Recognition](https://www.nngroup.com/articles/recognition-and-recall/) is easier than recall because options and context give cues
for retrieving memories. The UI should act as an "external memory" while still supporting search and filtering.

| Forces recall | Supports recognition |
|---|---|
| Remember the exact command name | Menu/command palette with search and synonyms |
| Remember a code from a previous screen | Show or auto-fill the code |
| Retype an address | Recent/saved addresses and autocomplete |
| Remember old filters | Saved views, active filter chips |
| Remember password requirements | Status checklist next to the field |
| Remember where a file is | Recents, breadcrumbs, preview |

Three things make memories easier to retrieve: **practice** (frequent use), **recency** (used recently), **context** (the cue appears
in the right situation). Use all three: shortcuts for practised actions, recent items for recency, contextual suggestions for cues.

## 4. Selective attention: change blindness, banner blindness

People don't process everything on screen. They focus on the area relevant to their goal and ignore the rest.

### 4.1 Change blindness
[Change blindness](https://www.nngroup.com/articles/change-blindness-definition/) is the tendency not to notice a change that is far
from focus, happens across an interruption, or sits next to many other changes.

Risks:
- An error appears at the top of a form while the user is at the bottom.
- A filter updates the result count far from the control.
- A button changes function after a menu opens.
- New content loads without a cue.
- A price changes in several areas at once.

Reduce the risk:
- Put feedback near the source of the action/focus.
- One main change at a time.
- Group related changing areas.
- Use short transitions to explain relationships, not competing decorative animation.
- Use contrast, spacing, or dim unchanged areas for important events.
- Announce changes to screen readers with a suitable live region.

### 4.2 Banner blindness
[Banner blindness](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/) makes users ignore elements that look like
ads, sit in familiar ad positions or near ads — even when they are useful content.
- Don't make an important CTA look like a promotion banner.
- Avoid animation, overly "salesy" colours and the right rail for essential information.
- Don't put help or warnings next to ads.
- Visual prominence doesn't guarantee attention; relevance and task-based position matter more.
- Click A/B tests aren't enough if the pattern erodes trust or trains users to ignore the UI.

## 5. Information foraging, information scent, interaction cost

Users judge each path by expected benefit versus effort. Per
[information foraging](https://www.nngroup.com/articles/information-foraging-leave-site/), they continue while the "information scent"
says they're getting closer; they leave when the cost is high or the scent is weak.

**Information scent** comes from:
- Specific links/headings.
- Fitting descriptions, icons and previews.
- Position in a category that matches the mental model.
- Signals about quantity, time, format and destination.
- Results at each step confirming the right direction.

Strong but wrong scent is dangerous too: if users find the category they expect and the item was filed elsewhere, they may conclude the
product doesn't have it. Fix with fitting IA, synonyms, search and cross-references.

### 5.1 Interaction cost
[Interaction cost](https://www.nngroup.com/articles/interaction-cost-definition/) is the total physical and mental effort to reach a goal:
- Reading, understanding, remembering, deciding.
- Scrolling, clicking, tapping, typing, dragging.
- Waiting for loads, switching apps/tabs, re-authenticating.
- Recovering from errors, finding the context again.

Don't just count taps. A clear review step can lower the total cost more than a shorter flow that causes mistakes. Optimise by outcome:

```text
Expected utility ≈ value the user expects − interaction cost they perceive
```

Lower the cost with defaults, autofill, batching, direct manipulation, kept context and performance. Raise perceived value with clear
outcomes, previews, trust signals and goal-relevant content. Never use fake simplicity to hide difficult work behind it.

## 6. Feedback, response time and designing waits

NN/g's three classic thresholds are cognitive heuristics, not absolute SLAs:
- **About 0.1 s** — feels nearly instant; direct feedback.
- **About 1 s** — the flow of thought is still intact, but users notice the delay.
- **About 10 s** — attention starts leaving the task; give an estimate, progress and the ability to do something else.

Apply by context and real data:

| Wait / type | Pattern |
|---|---|
| Very fast, under about 1 s | Don't flash a skeleton/spinner; respond with state instantly |
| About 2–10 s, one module | Spinner/looping indicator, with a label when needed |
| About 2–10 s, full screen | Skeleton reflecting the real layout, avoiding layout shift |
| Over about 10 s | Determinate progress, current step, time remaining if reliable |
| Long background process | Let users leave the screen, notify when done, history, cancel when safe |

Skeletons are only for loading page structure/content — not for uploads, conversions or processes with progress. They don't replace
performance work.

### 6.1 When users return after an interruption
- Summarise what finished, failed and is pending.
- Keep history, input, selection and position.
- Show timestamp, owner and latest status.
- Offer a CTA to continue from a sensible point.
- For important processes, provide a log or receipt.

No fake progress. A bar that moves steadily then stalls at 99 % loses more trust than a cautious estimate that updates honestly.

## 7. Decisions, choices and progressive disclosure

More options are not automatically better. The cost comes from understanding differences, comparing, predicting consequences and fear
of choosing wrong.

### 7.1 Designing the option set
- Offer only meaningfully different options.
- Group by criteria users understand; use a natural order.
- Give a safe, common, transparent default.
- Show important differences side by side.
- Use a recommended option when it's based on real benefit; state the criterion, never disguised paid placement.
- Search/filter for large sets; keep active filters and the result count visible.
- Progressive disclosure for advanced options.

### 7.2 Responsible defaults
Defaults are powerful because they save effort and read as a recommendation. So:
- Never preselect paid add-ons, data sharing or unnecessary consent.
- Defaults are easy to change and their consequences are clear.
- Personalise defaults only when explainable, beneficial and controllable.
- For irreversible decisions, the default must not push users into risk.

### 7.3 Two-level progressive disclosure
1. **Primary** — the information/actions most users need right now.
2. **Secondary** — advanced options, explanations or edge cases opened on demand.

Never hide what changes the decision: price, renewal, fees, data, deadlines, risks and constraints.

## 8. Error prevention, undo and confirmation

Order of priority:
1. Remove the possibility of error.
2. Constrain and hint at the right moment.
3. Offer preview/review.
4. Offer undo/recovery.
5. Use confirmation only when needed.

A [confirmation dialog](https://www.nngroup.com/articles/confirmation-dialog/) fits serious, hard-to-reverse or unusual consequences.
Not for routine actions — users learn to click through it.

A good confirmation:
- The title names the action and the object.
- The body states the specific consequence; never a generic "Are you sure?".
- Buttons are action labels, not Yes/No.
- Default focus/visual priority doesn't push users into the destructive action.
- A clear safe alternative exists.
- If undo is available and the consequence is low, undo usually beats a dialog.

### 8.1 Designing undo
- Define the undo window and scope.
- Keep the object long enough, or soft-delete.
- Feedback says clearly what happened and that it can be undone.
- Undo must not disappear before assistive technology can read/activate it.
- For batch actions, undo all of it, or explain which part failed.
- If the action has synced to several systems, state the limits of reversing it.

## 9. Choosing the right research method

[NN/g classifies 20 methods](https://www.nngroup.com/articles/which-ux-research-methods/) along three dimensions:
1. **Attitudinal ↔ behavioural** — what users say versus what they actually do.
2. **Qualitative ↔ quantitative** — understanding why/how to fix versus measuring how much.
3. **Context of use** — natural use, scripted, limited prototype, or no product use.

### 9.1 Question → method

| Need to know | Preferred method | Don't rely only on |
|---|---|---|
| Real-life needs/problems | Field study, contextual inquiry, diary, interview | A survey asking which features people want |
| Whether a concept has value | Concept test, interview, ethical fake-door | Usability test of a finished UI |
| Whether IA matches the mental model | Card sorting + tree testing | Stakeholder opinions |
| Whether a flow is usable | Moderated usability test | A demo and "do you like it?" |
| How often a problem happens | Analytics, survey, benchmark, unmoderated study | A few anecdotes |
| Why a funnel drops | Usability test + interview + suitable session evidence | Analytics alone |
| What feeling the visuals evoke | Desirability study, first-impression test | Team taste |
| Which behaviour a variant changes | A/B test with guardrails | A poll picking the prettiest screen |
| Long or multichannel experience | Diary + journey interview | A single 30-minute session |

### 9.2 By product stage

| Stage | Goal | Research family |
|---|---|---|
| Strategize | Find opportunities and direction | Generative: field, diary, interview, survey, concept |
| Design | Improve the solution | Formative: card sort, tree test, prototype/usability test |
| Launch & assess | Measure performance and compare | Summative: benchmark, analytics, A/B, survey |

No single method answers every question. Triangulation combines sources to cover blind spots: behaviour shows what happens, qualitative
explains why, quantitative shows scale.

## 10. Quality usability testing

[Usability testing](https://www.nngroup.com/articles/usability-testing-101/) observes users doing tasks with an interface. Its three
core parts are the facilitator, the tasks and fitting participants.

### 10.1 Goals
- Find problems and opportunities.
- Understand behaviour, goals, strategies and mental models.
- Check whether users complete the task.
- For quantitative studies, build a success/time/ease benchmark.

### 10.2 Writing task scenarios
A good task:
- Has realistic context and a goal.
- Doesn't reveal menu names, labels or the path.
- Doesn't ask people to pretend far beyond their experience.
- Has a clear endpoint for the observer.
- Never says "please test feature X".

```text
Poor: Hãy dùng bộ lọc Giá để tìm khách sạn.
      (Use the Price filter to find a hotel.)
Good: Bạn cần phòng ở Đà Nẵng cuối tuần này, tối đa 1.200.000 ₫/đêm.
      Hãy tìm một lựa chọn phù hợp và cho biết bạn sẽ đặt phòng nào.
      (You need a room in Da Nang this weekend, at most 1.200.000 ₫/night.
       Find a suitable option and tell us which room you'd book.)
```

### 10.3 Facilitation
- Say clearly that the product is being tested, not the participant.
- Encourage thinking aloud without turning the session into a constant interview.
- Use neutral questions: "What are you thinking?" rather than "Is that button hard to see?".
- Don't rescue too early; note where help was needed.
- Ask follow-ups after the task to avoid priming.
- Observe behaviour first, statements second; note contradictions.
- Protect consent, privacy and the right to stop.

### 10.4 Sample size
NN/g usually recommends about **five people** for one qualitative round with **one user group**, to find the common problems, then fix
and retest. That rule does not apply to:
- Quantitative benchmarks.
- Several personas/locales/accessibility needs.
- Rare or high-risk problems.
- Statistically meaningful comparisons.

Several small rounds (test → fix → retest) beat one big study at the end of the project.

### 10.5 Analysis
- Record observations per task/state, not just quotes.
- Separate symptom, hypothesised cause and evidence.
- Cluster patterns but keep high-risk outliers.
- Rate severity by impact, frequency, persistence and recovery.
- Recommendations attach to problems; don't jump straight to a single UI.

## 11. Information architecture: card sorting and tree testing

IA must reflect how users group and find things, not the internal org chart.

### 11.1 Card sorting
Participants group items and may name the groups. Use it to explore mental models and vocabulary.
- **Open sort** — they group and name; good for discovery.
- **Closed sort** — they sort into given categories; good for checking a taxonomy.
- **Hybrid** — given categories, but they may add more.

A card sort doesn't produce the final navigation. Combine it with business constraints, a content inventory and testing.

### 11.2 Tree testing
Participants find items in a text-only structure with no visual design. Measures:
- Direct/indirect success.
- First choice.
- Backtracking and path.
- Time/confidence.

Practical sequence:
1. Audit content and top tasks.
2. Interviews/search logs for vocabulary.
3. Card sort to explore groups.
4. Design the taxonomy/navigation.
5. Tree test to verify findability.
6. Usability test in the real UI to check interaction and visual cues.

## 12. Journey maps

A [journey map](https://www.nngroup.com/articles/journey-mapping-101/) shows the process a person goes through to reach a goal. It
helps the team see beyond one screen or touchpoint.

### 12.1 Parts
- **Actor** — one specific persona/user group.
- **Scenario + goal** — situation and outcome.
- **Phases** — meaningful stages.
- **Actions** — what the user does.
- **Thoughts/questions** — what they weigh.
- **Emotions** — evidence-based emotional ups and downs.
- **Touchpoints/channels** — app, web, email, store, people.
- **Pain points/opportunities**.
- **Owner/metric** when used for operations.

### 12.2 Current-state, future-state, assumption map
- **Current-state** — today's experience from research; find pain points.
- **Future-state** — the desired experience; sets design direction.
- **Assumption-first** — the team writes down current understanding to expose gaps; label it as assumptions and research later.

A journey map must not be a pretty poster with no owner. Every opportunity needs evidence, an owner, a priority and a roadmap link.

### 12.3 When a diary study pays off
Journeys spanning several days/channels are hard to recall accurately in an interview. A diary captures data close to the moment:
trigger, context, emotion, workaround and photo/evidence. Combine diary with interviews to dig into key moments.

## 13. Service blueprints

A [service blueprint](https://www.nngroup.com/articles/service-blueprints-definition/) extends a journey map to show the resources and
processes that create the experience.

Typical layers:
1. Customer actions.
2. Frontstage — staff/systems the user sees.
3. Backstage — invisible activity.
4. Support processes — teams, policies, vendors, supporting systems.
5. Physical/digital evidence — email, app screen, receipt, package.
6. Lines of interaction, visibility and internal interaction.

Use it when:
- The experience is omnichannel.
- Several departments create the outcome together.
- A front-end problem is caused by process/policy/backend.
- You need to find dependencies, handoffs, bottlenecks and single points of failure.
- You want to improve customer and employee experience together.

A blueprint ties to one specific journey/goal and business objective. Most of its value is in building, debating and verifying it
cross-functionally — not only the final artefact.

## 14. Trust, credibility, transparent design; deceptive patterns and sludge

[NN/g names four groups of credibility signals](https://www.nngroup.com/articles/trustworthy-design/): design quality, up-front
disclosure, comprehensive/current content, and connection to the wider ecosystem.

### 14.1 Designing for trust
- Stable, professional UI with no bugs and fitting performance.
- Show price, fees, renewal, shipping and policies before the decision.
- Say who is behind the product, how to contact them, and real support.
- Content has dates, author/expertise, sources and updates.
- Reviews/testimonials are verified and not cherry-picked to mislead.
- Security/privacy explanations in the right place, in plain language.
- Behaviour matches promises; status and receipts are verifiable.
- Let users leave, cancel, export and delete data within reasonable rights.

Trust builds slowly and is lost fast. One surprise fee or misleading consent can undo many good visual details.

### 14.2 Deceptive patterns and sludge
[Deceptive patterns](https://www.nngroup.com/articles/deceptive-patterns/) exploit cognitive limits to push outcomes against the user's
interest or intent. **Sludge** is friction that makes it hard to get the result users want.

Examples:
- Preselected paid add-ons.
- A prominent Accept while Reject is hidden or takes several steps.
- Confirmshaming/guilt copy.
- Fake scarcity or countdowns.
- A low initial price with fees added late.
- One-tap sign-up but cancellation by phone.
- Fake close buttons; ad CTAs that look like system controls.
- Privacy choices with misleading wording/hierarchy.

Symmetry audit:
- Do opt-in and opt-out take comparable effort?
- Are join and cancel equally easy to find?
- Are Accept and Reject equally clear?
- Do benefits and costs appear at the same time?
- Can users edit/reverse the decision?
- Do growth metrics have guardrails for trust, complaints, refunds and retention?

(Monetization screens: `../mobile-ui-master/references/monetization-screens.md` and `../app-store-policies/SKILL.md`.)

## 15. Accessibility and inclusive UX beyond compliance

The [Accessibility and Inclusivity Study Guide](https://www.nngroup.com/articles/accessibility-inclusivity-study-guide/) stresses that
this is a branch of usability and a mindset, not just a procedure/checklist.
- **Accessible design** — supports differences in vision, hearing, motor, cognitive and emotional abilities.
- **Inclusive design** — welcomes differences in background, culture, gender, religion and circumstance; doesn't let them become barriers.

### 15.1 Three maturity levels
1. **Conformance** — semantics, focus, contrast, targets, captions, keyboard, screen reader.
2. **Usability** — disabled users complete tasks effectively, not just reach the controls.
3. **Inclusion** — they take part in research and co-design; difference is strategic input.

### 15.2 A screen reader is a linear experience
- Order/semantics must make sense without seeing the layout.
- Headings, landmarks, rotor and skip links give direct access; never force a sequential pass through hundreds of items.
- The accessible name matches the visible label, for voice control.
- State/changes/errors are announced at the right level, without spam.
- A functional image describes the action; an informative image conveys the message; a decorative image is skipped.
- Complex gestures have an alternative control.

### 15.3 Neuroinclusive design
- Stable structure, clear language, specific instructions.
- Reduce sensory overload and surprise animation.
- Let users control autoplay, timeouts, notifications and density.
- Split tasks, save progress, remind context on return.
- No fake urgency or vague schedules.
- Offer several ways to receive information where appropriate.

Accessibility testing needs real users with their own assistive technology. Automated scans catch only part of the problems and don't
evaluate task usability. (Accessibility rules and checklist: `../mobile-ux-fundamentals/references/accessibility.md`.)

## 16. AI UX: from novelty to verifiable value

NN/g's 2026 study guides on [designing AI products](https://www.nngroup.com/articles/designing-ai-study-guide/) and
[AI mental models](https://www.nngroup.com/articles/ai-functionality-study-guide/) stress: AI is not a value proposition by itself, and
chat is not always the right interface.

### 16.1 Deciding whether to use AI
1. What is the specific user problem?
2. Does AI have a measurable advantage over rules, search, forms or ordinary automation?
3. What does an error cost, and who is accountable?
4. Is there suitable data, usage rights and a privacy basis?
5. Can quality, latency, cost and drift be evaluated?
6. Can users understand, control and recover?

Capabilities that usually create value when scoped clearly: content generation, summarising, basic data analysis and widening
perspectives. Narrow features are usually easier to understand, measure and trust than a "does everything" chatbot.

### 16.2 Intent-based interaction and its new costs
AI lets users state an outcome instead of a command sequence, but adds costs:
- Not knowing what to prompt.
- Hard to predict output and scope.
- Long, polished output reduces error checking.
- Every retry costs time; conversation state is hard to manage.
- Hard to compare versions or trace sources.

Reduce them with:
- Task-based example prompts, starters and prompt assistance.
- Scope/abilities stated before input.
- A plan preview before multi-step actions.
- Citations/sources, timestamps and confidence in context.
- Edit, controlled regenerate, compare, undo and history.
- Structured input/output when the task has a clear schema.
- Users stay in the approval loop for risky actions.

### 16.3 Calibrated trust
The goal is not maximum trust but **the right level of trust**:
- State specific limits, not generic disclaimers.
- No anthropomorphism that misleads users about abilities/accountability.
- Distinguish fact, inference and generated suggestion.
- Fluency is not evidence of accuracy.
- For critical facts, encourage checking the original source.
- AI disclosure depends on audience, context, how much AI is involved and the consequences — not a badge added for form's sake.

### 16.4 AI agents and the right to act
Design by autonomy level:
1. Suggest.
2. Draft.
3. Prepare — prepare the action and wait for review.
4. Execute with approval.
5. Execute within policy — act alone within clear limits.

Each level needs scope, permissions, logs, undo/compensation and escalation. The agent says what it is doing, which data it uses, which
part failed and how to take back control. (AI product patterns: `../mobile-ux-fundamentals/references/ai-product.md`.)

## 17. From research insight to product decision

An insight only has value when it changes a decision. Use the chain:

```text
Observation → Pattern → Interpretation → Risk/opportunity
→ Recommendation/hypothesis → Owner → Validation → Outcome
```

### 17.1 Evidence ledger

| Field | Content |
|---|---|
| Claim | What the team believes is true |
| Evidence | Source, method, sample, date |
| Confidence | High/medium/low and why |
| Limits | Segments/contexts not covered |
| Decision | What changes |
| Metric | Success signal and guardrail |
| Review date | When to look again |

Don't rank evidence by volume alone. A large analytics pattern tells **what** happens but doesn't explain **why**; five qualitative
sessions can explain the mechanism but not the prevalence. Combine them to prioritise accurately.

### 17.2 Research anti-patterns
- Asking users which features they want and treating that as requirements.
- Using a focus group to evaluate individual task usability.
- Listening to statements, ignoring behaviour.
- Recruiting colleagues or non-target people because it's convenient.
- Testing a prototype missing real states and drawing over-optimistic conclusions.
- Synthesis that loses the trail to the original evidence.
- Generating "personas" with AI and calling it research.
- Reporting only nice quotes, with no severity/owner.
- Not retesting after fixes.

## 18. Playbook: combining methods in a mobile project

**Discovery**
- Stakeholder interviews to understand constraints — not a substitute for user research.
- Analytics/support logs to find risk areas.
- 5–8 interviews or field/contextual sessions depending on diversity.
- Current-state journey map; tag assumptions/evidence.
- Problem statement and outcome metric.

**Structure**
- Content inventory and top tasks.
- Card sort if the taxonomy is unclear.
- Tree test of the proposed structure.
- Task flow and content frame.

**Design**
- Wireframes with real content and complete states.
- Independent heuristic evaluation.
- Early accessibility review.
- 1–3 rounds of qualitative usability testing, fixing between rounds.

**Build**
- Content/design QA on real iOS and Android devices.
- Screen reader, font scaling, keyboard/pointer where relevant.
- Slow network/offline, interruptions, restore and error injection.
- Instrument events by outcome, not just page views.

**Launch and operations**
- Funnel/behaviour analytics with fitting privacy.
- Error, latency, support and trust guardrails.
- Short, well-timed surveys; don't ask on every screen.
- Periodic benchmarks for top tasks.
- Research repository, decision log and evidence backlog.
