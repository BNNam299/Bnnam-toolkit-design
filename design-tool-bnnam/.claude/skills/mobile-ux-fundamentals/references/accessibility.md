# Accessibility and inclusive design (+ UX research and evaluation basics)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/accessibility.md (§6, Telos 02) @ 3c0e291 — translated, complete

Accessibility is a foundational requirement, not a final check step. Part A is the mobile rule set; Part B is the research/evaluation
background from the same source (where personas, maps and usability tests fit), ending with the base accessibility checklist.

## Contents
**Part A — Accessibility rules**
1.1 Apple's three properties · 1.2 Target size · 1.3 Text and magnification · 1.4 Contrast and color · 1.5 Screen reader ·
1.6 Focus and alternative input · 1.7 Motion, sound and cognition · 1.8 Quick checklist

**Part B — UX research, artifacts and evaluation**
2. Research as a capability · 3. From data to a problem statement · 4. Persona, empathy map, mental model · 5. IA and the three maps ·
6. Wireframe, mockup, prototype · 7. Usability's five components · 8. Evaluation methods · 9. UX patterns and the base accessibility checklist ·
10. Sources

**Part C — iOS 27 / iPhone Duo additions (pointers)**

---

# Part A — Accessibility rules

## 1.1 Apple's three properties of an accessible interface

- **Intuitive:** familiar, consistent, predictable interactions.
- **Perceivable:** never depends solely on sight, color, sound or touch.
- **Adaptable:** supports system settings and different ways of using the device.

Material adds three orientations: respect individual needs, research before locking a solution, and treat minimum standards as a starting
point, not the destination.

Platform: `../apple-hig/references/accessibility.md`, `../apple-hig/references/inclusion.md`,
`../material-design-3/references/foundations__building-for-all.md`.

## 1.2 Interaction target size

| Platform | Recommended minimum target |
|---|---:|
| iOS / iPadOS | `44 × 44 pt` |
| Android / Material | `48 × 48 dp` |

The visible shape may be smaller, but the touch area must be large enough, **non-overlapping**, and spaced to avoid mis-taps.
(HIG adds: ~12 pt padding around bezeled elements, ~24 pt around borderless ones; M3: ≥ 8 dp between chips/targets. See SKILL.md rule 1.)

## 1.3 Text and magnification

- iOS: use **Dynamic Type**; Apple recommends allowing enlargement of at least about **200%** where appropriate.
- Default custom text size on iOS/iPadOS should be around **17 pt**; the reference minimum is **11 pt**, but never use small sizes to cram content.
- Android: use `sp` and respect font scale; test the largest levels the product supports.
- Never lock the height of a text container.
- With large text, allow reflow, wrap, scroll or a layout switch; never shrink the font to keep the old layout.
- Icons that carry meaning equivalent to text must also scale when the user increases content size.

## 1.4 Contrast and color

- Common WCAG AA reference: **4.5:1** for normal small text and **3:1** for large/bold text (HIG: large = 18 pt and up, or bold at any size);
  check both light and dark and the disabled/focused states. (Non-text UI parts: 3:1 — `../figma-ui-flow/references/handoff-qa.md`.)
- Apple's Accessibility Inspector uses the WCAG AA levels as guidance; Material provides accessible color relationships and three contrast
  levels: standard, medium, high.
- Never use color as the only signal. Combine with label, icon, shape, pattern or position.
- Test problem pairs such as red–green and blue–orange.
- Never use a placeholder as the label; the placeholder disappears while typing.

## 1.5 Screen reader

Every interactive element needs:
- A meaningful name, the correct role and its current state.
- Reading order that matches logic, not just visual coordinates.
- Sensible grouping: avoid reading meaningless fragments, but do not merge so much that separate actions are lost.
- Descriptions for informative images; decorative images are ignored.
- Announcements for important changes such as errors, completion or new content.
- Custom gestures always have an alternative via an accessible control.

Test on real devices with **VoiceOver** and **TalkBack**, not only with automated inspectors.
Platform: `../apple-hig/references/voiceover.md`, `../material-design-3/references/foundations__content-design__alt-text.md`.

## 1.6 Focus and alternative input

- The focus indicator is clearly visible and never clipped.
- Tab / D-pad / keyboard order is logical.
- Support keyboard, Switch Control, Voice Control and pointer where the context allows.
- Hover must not be the only way to reveal information or actions.
- Keyboard shortcuts avoid system conflicts and are discoverable.

Platform: `../apple-hig/references/focus-and-selection.md`, `../apple-hig/references/pointing-devices.md`.

## 1.7 Motion, sound and cognition

- Respect Reduce Motion and the system animation settings.
- No flashing or uncomfortable motion; avoid mandatory parallax.
- Provide captions, subtitles, transcripts or audio descriptions according to the media type.
- Never convey important information only by sound/haptic.
- Keep sentences short and structure consistent; avoid urgent timeouts; allow extending time when needed.

## 1.8 Quick accessibility checklist

- [ ] Every function works without color.
- [ ] Touch targets meet the standard and do not overlap.
- [ ] Large text does not clip, cover the CTA or lose data.
- [ ] The screen reader reads the correct label, role, state, value and order.
- [ ] Keyboard/D-pad focus is visible and moves logically.
- [ ] Light, dark and increased contrast all pass.
- [ ] Reduce Motion loses no information.
- [ ] Video/audio has suitable text alternatives.
- [ ] Errors are indicated in text and linked to the field to fix.
- [ ] The design has been tried with users with different access needs if the product is high-risk.

---

# Part B — UX research, artifacts and evaluation

## 2. UX research is a capability, not just a job title

UX research is the systematic study of users, tasks, pain points, motivations and context of use. The goal is to replace gut decisions with
evidence. Large companies may have dedicated researchers; in small teams the designer or PM still has to do research at a fitting scale.

Two main method groups:
- **Qualitative** answers "why": interview, contextual inquiry, observation and usability testing.
- **Quantitative** answers "what / how many": survey, analytics, funnel, benchmark and A/B testing.

Primary research collects new data from users; secondary/desk research synthesises existing data. Discovery research finds the right
problem; evaluative research checks the solution. Choose the method by the research question, not by the tool you are used to.

**Lean UX research for small teams**
- Short contextual interviews with people doing the real work.
- Guerrilla usability testing with a prototype or the current product.
- Analytics review, support tickets and search logs.
- A short survey to confirm patterns already seen in qualitative data.

Light research is not careless research: it still needs a clear question, participant criteria, notes, separating observation from
interpretation, and openly stating the sample's limits.

## 3. From data to a problem statement

A problem statement briefly describes **who** has the problem, **what need**, **in which context** and **why it matters**, without
embedding a solution. Basic structure:

> [User group] needs [need] because [insight/context].

It can then become a How Might We question to open ideation. Five Whys helps go from symptom to cause, but the conclusion must still be
checked against user data. The problem statement is the yardstick for ideas: a solution that does not address it should not be prioritised.

## 4. Persona, empathy map and mental model

**Persona** — a representative portrait built from data, not a marketing character the team imagined. Usual parts: goals, behaviours, pain
points, context, attitude to technology and a representative quote. Process: collect data → find patterns → empathy map → write the
profile → share and use it in decisions.

**Empathy map** — synthesises six areas: **Says, Thinks, Does, Feels, Pains, Gains**. Says and Does must stick to observation; Thinks/Feels
are interpretations to record carefully. It supports empathy and synthesis but does not replace research data or personas.

**Mental model** — how users think the system works. The gap between the mental model and the real logic causes errors in search,
navigation and operation. Close the gap with familiar conventions, clear labels, consistent feedback and a system image that shows the
right conceptual model. Do not always follow the old mental model; if a new model is better, onboarding and progressive disclosure must
help users learn it.

## 5. Information architecture and the three "maps"

IA is how information is organised, labelled, structured and made searchable. Four core components:
1. **Organization system:** by alphabet, time, topic, task or audience.
2. **Labeling system:** menu, function and content names in the user's language.
3. **Navigation system:** paths between areas.
4. **Search system:** query, filter, results and the ability to find again.

A sitemap is only one deliverable showing hierarchy, not the whole IA.

| Artifact | Scope | Shows |
|---|---|---|
| Customer Journey Map | The whole journey, including outside the product | Stage, touchpoint, action, thought, emotion, pain, opportunity |
| Sitemap | Product structure | Pages/areas, parent–child relations and content groups |
| User Flow | One specific goal | Entry, action, screen, decision, success/error path |

Usual order: CJM finds opportunities → IA/sitemap organises the space → user flow describes the task. They complement, not replace, each
other. Flow building: the `prd-to-ux-flow` skill.

## 6. Wireframe, mockup and prototype

- **Wireframe** decides hierarchy, layout, content blocks, navigation and function before visual investment. Low-fi tests many directions
  fast; high-fi wireframes fit when content density or complex logic must be locked. Do not use Lorem Ipsum when real content affects the decision.
- **Mockup** is a detailed visual representation, usually not fully interactive. It shows typography, color, imagery, spacing and brand. It
  answers "what does it look like", not "does the flow work".
- **Prototype** simulates behaviour to test a hypothesis. Low-fi tests structure; mid-fi tests flow and state; high-fi tests interaction,
  content and near-real feel. A prototype must include the success path, errors, loading, empty states and going back when those states
  affect the task. Prototyping in Figma: the `figma-prototype-flow` skill.

## 7. Usability and its five components

1. **Learnability:** how easily a newcomer completes a task.
2. **Efficiency:** how fast someone who knows the product completes it.
3. **Memorability:** whether people remember how to use it after a break.
4. **Errors:** number, severity and recoverability.
5. **Satisfaction:** subjective comfort and satisfaction.

Prioritise per product. Consumer apps need high first-use learnability; professional tools may accept a learning curve in exchange for
expert efficiency. Improve learnability with progressive disclosure, contextual onboarding, clear affordances, conventions and consistent feedback.

## 8. UX evaluation methods

**Usability testing** — observe real users doing tasks, encourage think-aloud, record behaviour rather than just asking opinions. Process:
1. Define research question, tasks and success criteria.
2. Choose suitable participants, prepare the prototype/product.
3. Pilot the script.
4. Facilitate neutrally, never lead to the answer.
5. Record task success, time, errors, quotes and observations.
6. Synthesise patterns, severity and recommendations.

Five people can find many major problems in a fairly homogeneous group, but that is not a rule sufficient for every study. Several segments,
tasks or quantitative comparisons need different samples.

**Heuristic evaluation** — experts judge the interface against established principles. The common Nielsen set: visibility of system status;
match with the real world; user control; consistency; error prevention; recognition over recall; flexibility; minimalism; helpful error
recovery; help/documentation. Use several independent evaluators, then merge and rate severity.
Full procedure: `../ux-review-handoff/references/heuristics-evaluation.md`.

**Cognitive walkthrough** — focuses on newcomers and one specific task. At each step ask: does the user want this effect, do they see the
right action, do they connect the action with the result, and does the feedback tell them they are on the right track? Suits onboarding,
first use and rarely used features.

**PURE, A/B testing and analytics** — PURE is an expert review scoring the cognitive effort of each task step. A/B testing compares two
variants on real behaviour and needs a hypothesis, a metric, sample allocation and enough time. Analytics only tells what happened;
qualitative research explains why. Never use an A/B test instead of fixing an obvious usability bug.

## 9. UX patterns and the base accessibility checklist

A UX pattern is a reusable solution to a recurring problem. Patterns lower cognitive load through familiarity but should be used only when
the problem/context matches. A pattern is no excuse to copy a competitor or skip research.

Accessibility targets use under permanent disability, temporary limitation and environmental circumstance. Base checklist:
- [ ] Text and control contrast is clear enough.
- [ ] Headings and landmarks are structured.
- [ ] Usable by keyboard, focus visible, logical order.
- [ ] Forms have labels, instructions and errors attached to the right field.
- [ ] Color is not the only carrier of state.
- [ ] Informative images have alt text; decorative images are skipped appropriately.
- [ ] Touch targets are large enough and spaced.
- [ ] Motion can be reduced; content does not depend on animation.
- [ ] Zoom/reflow and screen reader lose no information.

## 10. Sources (Telos Academy, Vietnamese articles)

UX research (methods, organisation scale, lean research) · problem statement (structure, Five Whys, HMW) · persona, empathy map, mental
model (three different synthesis outputs) · IA vs sitemap and the CJM / user flow / sitemap series (structure and mapping) · wireframe,
prototype, mockup (levels of representation) · usability, learnability, usability testing (criteria and testing with real people) ·
heuristic evaluation and cognitive walkthrough (expert review) · UX patterns and accessibility (conventions and inclusive design).

---

# Part C — iOS 27 / iPhone Duo additions (pointers)

Accessibility checks when the layout adapts; full content in the `iphone-duo-adaptive` skill (`../iphone-duo-adaptive/SKILL.md`):
- Focus continuity after resize / fold.
- Liquid Glass clear ↔ tinted, Reduce Transparency, Increase Contrast — the Figma kit dropped the Increase Contrast mode; check it on Device Hub.
- Vertical bars with Dynamic Type up to AX5.
- RTL: bars attached to a hardware edge do not mirror; content still mirrors.
- Touch areas avoid the fold, curved edges and system gesture edges.
- Accessibility running on an adaptive interface; localization, text expansion, RTL; ergonomics, handedness and occluded areas
  (reach zone, occlusion zone, support zone, instability zone, system-edge zone).
