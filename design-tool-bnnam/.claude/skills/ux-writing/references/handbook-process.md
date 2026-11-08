# UX writing handbook — process, research, governance, review tools

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/writing.md §34.15–34.19, §34.21–34.22 @ 3c0e291 — translated, complete

Part 3 of the handbook (part 1: `handbook.md`, part 2: `handbook-patterns.md`). Hard rules in `principles.md` win where they differ.

## Contents
1. Using AI to support UX writing, under control
2. UX writing in the product-development process
3. Research methods and measurement
4. Content design system and governance
5. UX writing review scorecard and Definition of Done
6. Quick checklists by content type
7. Research sources

---

## 1. Using AI to support UX writing, under control

AI is good for generating variants, shortening, checking consistency or suggesting edge cases; it is not a source of truth for policy,
legal, health, finance or the system's real behaviour.

Safe workflow:
1. Provide context: user, goal, state, component, limits and voice.
2. Ask for several options with trade-offs; don't take the first one.
3. Check facts, policy, product behaviour and terminology against the source of truth.
4. Review accessibility, bias, tone in the worst case, and translatability.
5. Test with users; don't judge an option because it "sounds good".
6. Don't put personal data, secrets or customer content into unapproved tools.

Sample prompt (kept in Vietnamese because it asks for Vietnamese copy; gloss below):

```text
Viết 5 phương án error message tiếng Việt cho [component].
Người dùng: [...]. Tác vụ: [...].
Lỗi thực tế: [...]. Dữ liệu còn an toàn: [...].
Hành động phục hồi khả dụng: [...].
Voice: rõ, bình tĩnh, tôn trọng; không hài hước.
Mỗi phương án gồm title tối đa [...] và body tối đa [...].
Không thêm nguyên nhân hoặc cam kết mà hệ thống không xác nhận.
Giải thích ngắn trade-off của từng phương án.
```

*(Write 5 Vietnamese error-message options for [component]. User: [...]. Task: [...]. Actual error: [...]. Data still safe: [...].
Available recovery actions: [...]. Voice: clear, calm, respectful; no humour. Each option has a title of at most [...] and a body of at
most [...]. Do not add causes or commitments the system has not confirmed. Briefly explain each option's trade-off.)*

---

## 2. UX writing in the product-development process

The UX writer/content designer takes part from problem definition onward, not just "filling in words" after the layout is locked.

### Step 1 — Discovery
- Collect user language from interviews, search queries, support tickets, store reviews and sales calls.
- Build a content inventory: screens, email, push, SMS, help, legal, backend errors.
- Identify internal terms leaking into the UI and the points where users give up.
- Record legal, security, locale and platform constraints.

### Step 2 — Model and content frame
- Map the journey/state machine, including happy path, empty, loading, validation, offline, permission denied, timeout and success.
- Write the content frame before visual polish (template: `handbook.md` §3.1).
- Decide the hierarchy: must know, should know, can open for more.

### Step 3 — Draft in the wireframe
- Use real content early; lorem ipsum hides hierarchy and sizing problems.
- Write the CTA, headings and errors first, because they decide the flow.
- Pair with the designer and engineer so the copy matches real behaviour.
- Check every state, not just the happy path.

### Step 4 — System review
- Compare against the glossary, voice guide, pattern library and source of truth.
- Review privacy, legal and security with the right owners.
- Make sure analytics event names and UX names don't create two hard-to-govern taxonomies.

### Step 5 — Prototype and research
- Test comprehension, information scent and task completion.
- Use content at the right length; test font scaling and long locales.
- Fix hierarchy/interaction problems before polishing tone.

### Step 6 — Handoff
Every important string needs:
- Location/component/state.
- The final version and responsive variants if any.
- A soft character limit with its reason, not just an arbitrary number.
- Accessibility label/hint/live-region behaviour if needed.
- Variables, plurals, format and example data.
- Trigger, fallback, error mapping and related analytics.
- A screenshot or prototype link.

(Developer handoff in the tool demo: `../figma-ui-flow/references/handoff-qa.md`; full handoff job: `../ux-review-handoff/SKILL.md`.)

### Step 7 — Content QA and operations
- Check the build on real devices, every locale/state.
- Compare behaviour with the promises in the copy.
- Check truncation, line wrap, keyboard, screen reader and lock-screen notifications.
- Watch metrics/support queries; fix the pattern and the source string, not isolated screens one by one.

---

## 3. Research methods and measurement

Choose the method by the question, not by the tool at hand.

| Question | Suitable method | Data |
|---|---|---|
| Do users understand the meaning? | Paraphrase/comprehension interview | How they restate it, misunderstandings |
| Does the label lead to the right place? | First-click, tree test, label test | Correct-choice rate, time, confidence |
| Which parts are clear/hard/build trust? | Highlighter test | Positive/negative passages and reasons |
| Is the content predictable/memorable? | Cloze or recall test | Words filled correctly, ideas remembered |
| Does the copy help completion? | Moderated/unmoderated usability test | Completion, errors, time, path |
| Which variant works at scale? | A/B test after an ethics check | Conversion with guardrails |
| What terms do users use? | Search logs, support logs, interviews | Vocabulary, unmet needs |

### 3.1 Metrics to track
- Task completion and first-attempt success.
- Error rate, retry rate and time to recovery.
- Backtracking, abandonment per step and support contacts.
- Permission acceptance rate — only when the request has value and the choice is fair.
- Search reformulation/no-result rate.
- Comprehension accuracy and confidence.
- Accessibility issues by severity.
- Trust/satisfaction via targeted questions.

Don't optimise click-through on its own. A misleading CTA can raise clicks yet lower trust and increase cancellations, refunds and
support. Always set guardrails: complaints, unsubscribes, reversals, errors, long-term retention and impact on vulnerable groups.

---

## 4. Content design system and governance

A good content system keeps the team from rewriting the same problem in dozens of ways.

### 4.1 Components it should have
- **Voice principles** and a tone matrix by severity.
- **Style guide**: capitalization, punctuation, numbers, dates, money, pronouns, abbreviations.
- **Terminology glossary**: preferred term, forbidden synonym, definition, context.
- **Pattern library**: form, error, empty, permission, confirmation, notification, AI disclosure.
- **Component guidance**: anatomy, length guidance, content hierarchy, accessibility.
- **String repository**: source, status, locale, owner, review date.
- **Error taxonomy**: technical code → user-facing cause → recovery action.
- **Source of truth for legal/product claims**.
- **Decision log** for high-impact changes.

### 4.2 Governance
- Each domain has a clear owner and reviewer.
- Define when content review is required: new flows, legal changes, transactions, privacy, AI, widespread errors.
- Version the glossary and patterns together with the design system.
- Deprecate old strings instead of letting synonyms live forever.
- Audit periodically by flow and severity, not just for typos.
- Have an SLA for fixing content that causes money loss, data exposure or blocks accessibility.

---

## 5. UX writing review scorecard and Definition of Done

Score each criterion 0–2: **0 = fails; 1 = partly meets; 2 = meets**.

| Criterion | Review question |
|---|---|
| Useful | Does the content serve the need at the right moment? |
| Clear | Does the target user understand it on the first read? |
| Actionable | Do they know the next step and the consequence? |
| Concise | Can words be removed without losing meaning/risk information? |
| Consistent | Are terminology, patterns and capitalization uniform? |
| Truthful | Does the copy match behaviour, price, timing, policy? |
| Accessible | Usable with screen readers, large text, diverse cognition? |
| Inclusive | No stereotypes, blame, coercion or narrow assumptions? |
| Localizable | No concatenation, word-order dependence or forced length? |
| On-tone | Does the tone fit the emotion and severity? |
| Recoverable | On error, are the data and the recovery path clear? |
| Measurable | Is there a hypothesis and an evaluation criterion? |

The score does not replace judgement. A serious failure in truthfulness, safety or accessibility is still a blocker however high the total.

### 5.1 Definition of Done for UX writing
- [ ] There is a content frame and a clear user goal.
- [ ] Happy path plus loading, empty, error, offline, permission and success all have content.
- [ ] Headings, links and CTAs correctly predict the result.
- [ ] Copy matches the built behaviour and the source of truth.
- [ ] No internal terms, vague words or unnecessary blame.
- [ ] Consequences for money, data, privacy and subscriptions are visible before the decision.
- [ ] The screen reader reads in the right order, with correct name/role/state and errors.
- [ ] Font scaling/text expansion doesn't cut meaning or block the task.
- [ ] Variables, plurals, locale formats and RTL are specified.
- [ ] Reviewed with content/design/product/engineering and any needed specialist.
- [ ] Comprehension or task tested at a level suited to the risk.
- [ ] There is an owner, a metric and an update plan after release.

---

## 6. Quick checklists by content type

### Heading
- [ ] Do the first two words carry distinguishing meaning?
- [ ] Do users correctly predict the section?
- [ ] Does it stand alone in a table of contents/search/rotor?

### Link
- [ ] Specific, sincere, substantial, succinct?
- [ ] Does it promise the right destination?
- [ ] Is it distinguishable from other links out of context?

### Button
- [ ] Is it a specific verb/action?
- [ ] Does it state the right state after tapping?
- [ ] Does it avoid OK/Yes/No when a clearer action exists?

### Error
- [ ] Seen in the right place, at the right time, at the right severity?
- [ ] Is the problem understandable in human language?
- [ ] Is there a low-effort fix that keeps the data?

### Notification
- [ ] Timely, valuable and expected?
- [ ] Protects sensitive content on the lock screen?
- [ ] Does the tap/action open the right context?

### Complete screen
- [ ] Are the main idea and the primary action visible when scanning?
- [ ] Does the information hierarchy survive without colour/decoration?
- [ ] Does the content match every state and the real behaviour?
- [ ] Is the voice consistent and the tone right for the emotion?
- [ ] Readable, understandable, usable and translatable?

---

## 7. Research sources

- [UX Writing: Study Guide — Nielsen Norman Group](https://www.nngroup.com/articles/ux-writing-study-guide/): the learning map and main source list for this chapter.
- [How People Read Online — NN/g](https://www.nngroup.com/articles/how-people-read-online/): eye-tracking research on reading/scanning behaviour.
- [Text Scanning Patterns — NN/g](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/): F-pattern, spotted, layer-cake and commitment.
- [The First 2 Words — NN/g](https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/): front-loading and information scent.
- [Legibility, Readability, and Comprehension — NN/g](https://www.nngroup.com/articles/legibility-readability-comprehension/): the three quality layers of content.
- [Inverted Pyramid — NN/g](https://www.nngroup.com/articles/inverted-pyramid/): putting important information first.
- [How Chunking Helps Content Processing — NN/g](https://www.nngroup.com/articles/chunking/): grouping content for scanning, understanding and memory.
- [The Four Dimensions of Tone of Voice — NN/g](https://www.nngroup.com/articles/tone-voice-users/): the tone model and its effect on perception.
- [Better Link Labels: 4Ss for Encouraging Clicks — NN/g](https://www.nngroup.com/articles/better-link-labels/): criteria for writing links.
- [UI Copy: UX Guidelines for Command Names and Keyboard Shortcuts — NN/g](https://www.nngroup.com/articles/ui-copy/): command labels and shortcuts.
- [Error-Message Guidelines — NN/g](https://www.nngroup.com/articles/error-message-guidelines/): visibility, communication and efficiency.
- [Error-Message Scoring Rubric — NN/g](https://www.nngroup.com/articles/error-messages-scoring-rubric/): a quantitative evaluation rubric.
