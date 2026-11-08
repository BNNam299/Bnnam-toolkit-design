# Foundations — design thinking, three layers of knowledge, product design process, UI foundations

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/foundations.md (§1, §2, §3, Telos 01, Telos 09) @ 3c0e291 — translated, complete

A thinking lens, not a procedure. Use it when a PRD looks thin, when it has personas, when the payer differs from the user, and as a
review question set. The decided rules in the job references win where they differ.

## Contents
1. Scope and the three layers of knowledge
2. UI/UX thinking — Apple's eight principles, Material 3's focus, shared laws
3. Product design process — discovery, task modelling, low-fi to prototype, usability criteria
4. What product design is
5. Three pillars — desirability, feasibility, viability
6. The product designer's work across the lifecycle
7. Double Diamond
8. JTBD
9. MVP, prototype, proof of concept
10. The product team
11. Product checklist
12. UI design foundations — hierarchy, grid, type, color, media, elements, feedback, motion, patterns, accessibility, critique

---

## 1. Scope and the three layers of knowledge

This material serves four goals:
- understand the UI/UX principles shared by mobile products;
- design one product with the same business logic that still feels "right for the platform" on iOS and Android;
- build a design system that translates into SwiftUI/UIKit and Jetpack Compose/Android Views;
- act as a checklist when reviewing wireframes, prototypes, finished UI and builds.

Keep three layers of knowledge apart:
1. **Lasting principles:** purpose, control, familiarity, simplicity, accessibility, feedback and error recovery.
2. **Platform conventions:** navigation, action placement, components, gestures, typography, semantic colors and system behaviour.
3. **Brand expression:** the product's own color, shape, type, illustration and motion — without breaking the two layers above.

Guidelines are not hard law. Every decision must be able to answer: who uses it, in what context, for what goal, with what risk, and why
this choice beats the alternatives.

## 2. UI/UX thinking

### 2.1 UI and UX differ but cannot be separated
- **UX** is the whole experience: finding a feature, understanding the system, reaching the goal, handling errors, feeling trust and
  satisfaction.
- **UI** is the interaction layer that is seen or felt: layout, type, color, components, motion, sound and haptics.
- A beautiful interface with a confusing flow is poor UX. A good flow with hard-to-read text, small touch targets or vague feedback is
  poor UX too.

### 2.2 Apple HIG's eight core principles — use them as review questions
1. **Purpose:** what value does the product create; is the most important feature prioritised?
2. **Agency:** are users free to explore, skip, go back, undo and fix mistakes?
3. **Responsibility:** does the product protect data and safety, stay transparent and act in the user's interest?
4. **Familiarity:** does it use mental models and system patterns users already know?
5. **Flexibility:** does it adapt to devices, sizes, input methods, languages and abilities?
6. **Simplicity:** does every element have a reason to exist; are structure and wording direct?
7. **Craft:** are visual detail, animation, content, performance and reliability finished?
8. **Delight:** is there fitting emotion that does not get in the way of the main task?

### 2.3 Material 3's focus
- **Personal:** themes, dynamic color and options that fit the user.
- **Adaptive:** layout responds to window space, device posture and input method — not just the device name.
- **Accessible by default:** components, color roles, states and sizes built on accessibility.
- **Expressive:** emphasised typography, rich shapes, flexible components and physics-based motion with intent.

M3 Expressive does not mean "lots of decoration". Expression only has value when it improves hierarchy, recognisability, feedback or
fitting emotion.

### 2.4 Shared laws
- **Content first:** prioritise content and the main action; chrome only supports.
- **Hierarchy:** the visuals answer at once "what matters most, what comes next".
- **Consistency:** the same meaning has the same name, shape, relative position and behaviour.
- **Feedback:** every action signals received, processing, success or failure.
- **Forgiveness:** prefer undo, autosave, drafts, selective confirmation and the ability to go back.
- **Recognition over recall:** let users recognise options instead of remembering commands, codes or earlier state.
- **Progressive disclosure:** show what is needed first; advanced detail appears at the right moment.
- **Direct manipulation:** where it fits, let users tap, drag, swipe or edit the object directly and see the result immediately.
- **Performance is UX:** sensible skeletons, instant feedback, controlled optimistic UI, no layout shift.
- **Privacy is UX:** explain access by its concrete value, ask at the right moment, always leave a way back.

## 3. Product design process

### 3.1 Discovery — minimum output
- The problem to solve, not just a feature list.
- User groups and context: on the move, one hand, bright light, weak network, interrupted, using assistive tech.
- Job-to-be-done and success criteria.
- Legal, privacy, data, technical and platform constraints.
- Risks: wrong transactions, data loss, information leaks, addiction, misunderstood AI, irreversible errors.

### 3.2 Task modelling — for every main task write down
- **Trigger:** what makes the user start?
- **Entry point:** do they come in from the app, a widget, a notification, a deep link, Spotlight / App Shortcut or a search result?
- **Happy path:** the minimum steps to finish.
- **Alternate path:** missing data, permission denied, offline, session expired.
- **Recovery path:** undo, retry, edit, resume, contact support.
- **Exit state:** how does the user know for sure the job is done?

### 3.3 From low fidelity to prototype
1. **Flow diagram:** logic, branches and decision points first.
2. **Wireframe:** check hierarchy, navigation, content and density.
3. **Behaviour prototype:** test back, modals, keyboard, loading, error, empty, permission, rotation and resize.
4. **Visual design:** apply tokens, components and branding.
5. **High-fidelity prototype:** check motion, focus, haptics and transition states.
6. **Usability test:** observe behaviour; never explain on the interface's behalf.
7. **Handoff + design QA:** check the build on real devices and accessibility settings.

### 3.4 Usability criteria
- **Effectiveness:** correct completion rate.
- **Efficiency:** time, steps, back-tracks and cognitive load.
- **Learnability:** do newcomers understand without long instructions?
- **Error tolerance:** are errors easy to notice, understand and fix?
- **Satisfaction:** is the experience trustworthy, pleasant and on-brand?
- **Accessibility:** can the task be completed with VoiceOver/TalkBack, keyboard, switch control and large text?

## 4. What product design is

Product design for digital products is identifying users' problems, building a solution, putting it into operation and improving it
continuously from feedback and data. The output is not just pretty screens but a product that balances user experience, buildability
and business results.

UI focuses on the interface surface: layout, color, typography, components and micro-interactions. UX focuses on goals, behaviour, flows
and the end-to-end feeling. Product design covers both, and also takes part in deciding **which problem to solve, why, in what order and
how the result is measured**.

Job titles are not consistent across the market. Some companies call a broad scope "UI/UX Designer"; others split UI, UX research and
product designer. Read the actual responsibilities instead of inferring them from the title.

## 5. Three pillars of a lasting product

### 5.1 Desirability — do users want it?
Desirability measures how much users really need and want the solution to exist. It differs from usability: a product can be very easy
to use and solve an unimportant problem; a product that solves a big pain point is sometimes used despite friction.

Ways to validate: user interviews (problem, motivation, current workarounds) · surveys (how common an insight is at larger scale) ·
concept testing before building · Microsoft Reaction Cards (desired perception) · NPS, retention, active users and feature adoption after
launch.

Designers influence desirability directly but should avoid asking "do you like this idea?". Stronger evidence is current behaviour, the
size of the pain point, willingness to switch and whether users come back.

### 5.2 Feasibility — can it be built and run?
Not only "can the technology do it" but can it be done **under current conditions**:
- Technical: do backend, API, data, performance and security support it?
- Time / resources: does the effort fit the sprint, budget and people?
- Operational: can it be supported, maintained and scaled after launch?

Tools: feasibility study, T-shirt sizing, story points, impact–effort matrix and proof of concept. Talk to engineering early, prepare
options at several effort levels, and remember a solution that "can be coded" is not necessarily feasible in time or operations.

### 5.3 Viability — can the business sustain it?
Does the product create lasting business value through revenue, cost, competitive advantage or strategic goals? Usual layers:
- Business Model Canvas and value proposition.
- Unit economics such as CAC, LTV and LTV/CAC.
- TAM/SAM/SOM for market size.
- Competitive analysis and defensible advantage.
- Financial model, break-even, retention and churn.

Designers do not replace Finance or the PM, but must understand conversion, retention, cost to serve and business-model constraints. A
pretty flow that lowers revenue, raises support load or does not fit the strategy is not yet a good product solution.

## 6. The product designer's work across the lifecycle

**Discovery and direction**
- User research through interviews, observation, surveys and analytics.
- Clarify business goals, constraints and success metrics with the PM / stakeholders.
- Synthesise persona, empathy map, CJM, IA, sitemap and user flow where they fit.
- Write the problem statement and the hypotheses to validate.

**Designing and developing the solution**
- Ideate, sketch and compare several directions instead of locking one early.
- Wireframes, mockups and prototypes at the fidelity needed.
- UI, interaction, responsiveness, accessibility and edge states.
- Use or grow the design system for consistency and scale.
- Work with engineering during design, not only at handoff.

**Testing and improving**
- Usability testing with real users doing tasks.
- Expert review to catch principle or learnability problems fast.
- Handoff with specification, logic, states, assets and acceptance criteria.
- Design QA on the build.
- Track analytics, support feedback, A/B tests and iterate after launch.

## 7. Double Diamond — find the right problem, then the right solution

Two diverge–converge cycles:
1. **Discover:** widen the research to see the problem from many sides.
2. **Define:** synthesise and lock the priority problem.
3. **Develop:** widen to many solutions, prototype and test.
4. **Deliver:** choose, finish, release and measure.

The team must confirm two separate questions: "is this the right problem?" and "is this the right solution?". The model is for planning
and explaining the process, not a rigid checklist. Design Thinking describes the mindset and the Empathize–Define–Ideate–Prototype–Test
activities; Double Diamond stresses the widen–narrow rhythm of the whole project.

## 8. JTBD — the progress users want to make

Jobs To Be Done asks what job the user is "hiring" the product to do. It looks for context, motivation and desired outcome, not
demographics.

| Tool | Question |
|---|---|
| Persona | Who is the user and what behaviour patterns do they have? |
| User story | What function do they want to perform in the product? |
| JTBD | In what context do they want to make what progress, and why? |

A job statement: **When [context], I want to [motivation / action], so I can [desired outcome].** Research: set the scope, run Switch
Interviews about the moment they changed solutions, synthesise the jobs, build a Job Map and compare it with the current product. JTBD is
useful when personas describe people well but do not explain why they choose.

## 9. MVP, prototype, proof of concept

- A **prototype** validates a flow, interaction or perception before building it fully.
- A **proof of concept** validates one specific technical risk.
- An **MVP** is the smallest working version that still validates value with the market.

MVP does not mean sloppy. Define the hypothesis, audience, behaviour to observe, metric and the decision criteria after the test —
otherwise "MVP" is just another name for a low-quality product.

## 10. The product team

| Role | Focus | The designer coordinates on |
|---|---|---|
| PM | vision, strategy, outcome, roadmap | why, priority, metrics |
| PO | backlog and value in Scrum | acceptance criteria, sprint scope |
| BA | business needs and system rules | requirements, edge cases, process |
| UX research / data | user evidence and behaviour | research questions, insight, metrics |
| Front-end | the user-facing interface and interaction | states, responsiveness, accessibility |
| Back-end | logic, data, API, security | constraints, latency, error handling |
| Stakeholder | organisational goals and influence | alignment, trade-offs, decisions |

An effective designer does not just "take the brief". They clarify the why, separate requests from problems, bring evidence into the
discussion and record trade-offs. Product designers own the outcome with the team, not only the output of the design file.

## 11. Product checklist
- [ ] The problem statement names the user, the need and the context.
- [ ] There is evidence of desirability, not only internal opinion.
- [ ] Engineering has assessed feasibility and operational risk.
- [ ] PM / business has clarified viability and the success metric.
- [ ] At least two solution directions existed before choosing.
- [ ] The prototype / MVP is tied to a specific hypothesis.
- [ ] Accessibility and edge cases are described.
- [ ] There is a plan to measure after release.

## 12. UI design foundations — visual, interaction and accessibility

**12.1 What UI design solves.** UI design turns structure and function into a surface that can be recognised, understood and operated.
Good UI is not just "pretty": it shows hierarchy, affordance, state, feedback and brand without adding cognitive load. Five base
principles: consistency, visual hierarchy, feedback, simplicity and accessibility — criteria for explaining decisions, not a formula that
replaces research.

**12.2 Visual hierarchy.** Size, weight, contrast, position, white space, grouping and motion show the order of importance. Each screen
has a clear primary action, secondary actions that do not compete, and a distinguished destructive action. Gestalt supports grouping:
proximity, similarity, common region, continuity and closure. White space builds relations, not just "airiness". Check hierarchy with
the blur / squint test, greyscale and the scan path.

**12.3 Grid and layout.** A grid has columns, gutters, margins, a container and a baseline. Desktop usually has many columns, mobile
fewer; the exact number depends on content and system. A spacing scale creates a consistent rhythm — usually a small base, then a finite
set of values. Responsive means fluid sizing, breakpoints, reflow, hide / reveal and changing navigation. Do not keep the desktop order
rigidly if the mobile task differs. Check small and large viewports, zoom and long content.

**12.4 Typography.** Build type roles instead of a list of sizes: display, heading, body, label, caption, code. Each role has font,
size, weight, line height and tracking. Body text needs a sensible line length and enough line height; no very thin weights or long
all-caps. The font must fully support Vietnamese: check diacritics, digits, currency, broken glyphs and fallback. Limit families /
weights for load, performance and consistency.

**12.5 Color.** The palette has brand / accent, neutral and semantic colors. Semantic colors express information, success, warning,
danger; always pair them with an icon / text when the state matters. Build contrast from the real foreground / background and check
hover / focus / disabled states. In UI, color serves function before emotion. Neutrals form the base; accents pull attention under
control. Too many saturated colors destroy hierarchy. Tokenise color by meaning to support dark mode / themes.

**12.6 Icons, images and media.** Icons need a consistent style, stroke, grid and optical size. An ambiguous icon needs a label; never
break convention just to be different. Images must relate to the content, have a focal point, responsive crops, alt text and a licence.
Decorative images must not compete with the CTA. When an image contains text, ensure contrast and never turn important information into
pixels a screen reader cannot read.

**12.7 UI elements.**
- *Input controls:* button, text field, checkbox, radio, switch, select, slider and upload. Choose by number of options, immediacy and
  undo-ability. Forms have persistent labels, required / optional, helper, validation, error and success.
- *Navigation:* header, sidebar, tab, breadcrumb, bottom navigation and pagination. Navigation shows the current location, where you can
  go and the way back. No tabs for a sequential process; no bottom nav with too many items.
- *Information components:* tooltip, toast, banner, dialog, card, table and progress. Choose by urgency / persistence. A toast does not
  fit an error that needs action; a modal should not hold information that can sit inline.
- *Containers:* accordion, sheet, panel and card organise content. A container does not create hierarchy by itself if everything is
  "put in a card".

**12.8 Feedback, errors and user control.** Every action needs system status. Instant feedback with fitting visual / haptic / sound;
long tasks need progress or optimistic UI with recovery. An error message says what happened, why if useful, and what the user does next.
Prevent errors with constraints, format hints, confirmation for destructive actions and undo. A disabled control needs a reason;
sometimes leaving it enabled and explaining validation is better than making users guess.

**12.9 Motion.** Motion serves orientation, continuity, feedback, emphasis and state. Define duration / easing tokens. Avoid animation
that adds delay, excessive parallax or motion that cannot be turned off. Respect reduced motion and never make motion the only channel of
information.

**12.10 UX patterns and conventions.** Patterns such as search, filter, autocomplete, multi-step forms, infinite scroll or onboarding
carry trade-offs. Choose by task, data and platform; never copy a trend. Conventions lower learning cost, especially logo-to-home, close,
back and common shortcuts.

**12.11 Accessibility in practice.**
- Native controls (semantic HTML) before custom controls.
- Keyboard tab order, visible focus, skip links and escape behaviour.
- Label / name / role / value for assistive technology.
- Contrast, 200 % zoom, reflow and text spacing.
- Touch targets, gesture alternatives and orientation.
- Captions / transcripts for media; alt text by purpose.
- No flashing; support reduced motion.
- Error identification and instructions that do not depend on color.

Accessibility is not a QA-only checklist; it shapes tokens, component APIs, content and the definition of done.

**12.12 Design critique checklist.**
- Are the screen's goal and primary action clear?
- Is the hierarchy still clear without color?
- Do components have full states and feedback?
- Do long content / empty data / errors break the layout?
- Do keyboard, zoom and touch work?
- Is the decision a convention, or does it need teaching?
- Does the visual support the brand while still putting the task first?

Main sources (Telos Academy, Vietnamese, `https://academy.telos.vn/` and `https://telos.vn/`): Product Design; Product Designer and the
three mindsets; Product Designer's work; Desirability, Feasibility, Viability; Double Diamond; JTBD; Product Team 101 and the PM / PO /
BA / developer / stakeholder series; MVP; UI/UX principles for beginners; grid systems; color in UI; UI elements; UX patterns;
accessibility; Figma motion; website layout.
