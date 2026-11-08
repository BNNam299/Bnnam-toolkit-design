# Structure — PACT, information architecture, task analysis, flows, UX artifacts

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/structure.md (Notion — structure, §4, Telos 08) @ 3c0e291 — translated, complete

A thinking lens, not a procedure. The decided rules in `ux-flow.md` and `wireframe.md` win where they differ.

## Contents
1. PACT — People, Activity, Context, Technology
2. Information architecture
3. Task analysis — goal, task, action, scenario
4. User flows — symbols, eight rules, IA vs flow
5. User stories and story maps — against feature bloat
6. Navigation structure, information scent, progressive disclosure
7. UX artifacts — what each one is for and how they link

---

## 1. PACT — People, Activity, Context, Technology

Used in flow analysis and when arranging wireframes.

**People** — the centre; understand human abilities and limits.

**Activity** — the purpose of use; five characteristics:

| Characteristic | Design consequence |
|---|---|
| **Time — frequency** | frequent functions go where they are easy to see / reach; rare ones are tucked inside BUT still findable. Home is visited most → put what users care about most there |
| **Time — continuity** | interrupted → coming back continues where they left off (autosave, unsent message kept, mail draft) |
| **Time — response time** | ~100 ms for hand–eye actions; > 5 s users get frustrated |
| **Collaboration** | one user or several interacting → decide whether to show other people, and privacy |
| **Complexity** | a complex task is simplified by **splitting it into steps** (Amazon splits checkout into steps) |
| **Safety** | protection: autosave, confirmation on delete / leave |
| **Nature of the content** | what data (text, voice, video, image, emoji) decides the input method (keyboard, microphone, camera) |

**Context** — organisational (rules, role-based permissions; organisational rewards) · social (like / share → wanting to continue; social
rewards carry more emotional value than organisational ones) · physical (light, temperature, wearing gloves / a mask → voice needed?).

**Technology** — input (keys, touch, pen, fingerprint, face, voice) · output (screen, speaker) · platform.

## 2. Information architecture

- IA = organising information **and the relations between pieces** so users **find what they want**.
- **Object modelling:** which objects the user interacts with → attributes → relations. Content is structured (attributes can be
  analysed) or unstructured. Derive it from user research: goal → task → which objects are needed.
  Example, a news site (VnExpress): object = article; in the list: title, summary, (comment count / time / author depending on the
  article); in the detail: title, full content, related articles, author, opinions + count, comments split into *most relevant /
  newest* → **same object, different context, different attribute set**.
- **Seven ways to classify:** time · event · alphabet · geography · content format · task · audience group.
- **Five architectures:**

| Architecture | Shape | Use |
|---|---|---|
| Hierarchical | tree, one root | general |
| Linear | sequential | common on mobile |
| Category | tree + database — every category's content is presented the same way | Home → Men's store / Women's store |
| Hub | a central page with **no** content, only routing | role-based apps: pick a role, then enter its own interface |
| Tab | a tree variant for mobile; pages are **horizontal peers**; the first tab is the root | **reopening the app returns to the last tab** |

- The IA diagram is for **finding missing content** before drawing / handing off; each box = one page → **count screens, quote a price**.
- **Box name in the diagram = page title** in the design.
- **Navigation is IA made visible.**

## 3. Task analysis — goal, task, action, scenario

- Start from the **idea**, do not analyse from an existing app.
- **Goal** = the end result the user wants; one app has many goals (alarm: set a new one · turn on/off · change a set time);
  **goals usually become system functions**.
- **Task** = an activity to reach the goal; many ways to the same goal; "what do they think in order to get there".
- **Action** = the smallest concrete step, it does not need to solve the problem; identifying the actions = being able to picture the
  interaction; many ways to act (a scroll wheel instead of a numeric keypad).
- Worked example — goal *set a timer*:

| Task | Action |
|---|---|
| set the time | type numbers / drag a scroll wheel |
| repeat count | pick from a list |
| name it | type text |
| alert sound | pick from a preset list / add from the device |
| snooze | on/off |

- **Scenario** — a chain of actions + system responses, in steps (Debbie books a hotel: searches the web → compares prices + reviews →
  looks at each hotel's detail → chooses and books). Brainstorm each step with **three kinds of card**: Design Ideas (how to design the
  interaction) · Questions (situations that may happen — can the design handle them?) · Comments & Considerations (do it or not, what to
  weigh).
- **HTA** (hierarchical task analysis, global) · **CTA** (cognitive task analysis, following what is in the user's head).

## 4. User flows — symbols, eight rules, IA vs flow

- A diagram of the path a user takes to reach **one** goal; it can be drawn at **any stage** and helps define the IA.
- **Symbols:** rounded / circle = start–end · diamond = decision · rectangle = screen / action · arrow = navigation · square = note.
- **Into wireframes:** rectangles replaced by real screens → **user flow + wireframe = wireflow**.
- **How to use:** (1) **redraw the competitors' flows** · (2) start with a simple flow · (3) replace it step by step with wireframes /
  prototypes.
- **Eight rules — the details to keep:**
  - self-describing name · one direction;
  - **one goal per flow — never interrupt users in the middle of a task**, never force them to choose or get distracted;
  - always a legend;
  - a clear start point; several start points → name them explicitly or **split the flow**;
  - clear, short labels: "Sign-in screen"; a decision "Sign in or Sign up" — **not** "Sign in if you already have an account or…";
  - color: best not used; if used, add a legend;
  - **a clear end**: the flow must complete when the goal is reached. Example: a newsletter sign-up that requires accepting the policy
    — **never** "accepting is fine, not accepting is fine too"; the user passes the policy screen, reads it, taps accept, then succeeds.
- **IA = structure** (library layout, categories, labels) · **flow = journey** (the signposts through the shelves). IA provides the
  structure; the flow applies it to doing a task **as simply as possible**.

## 5. User stories and story maps — against feature bloat

- Journey = the whole picture + pain points; story = the concrete requirement of **one feature**, prioritises features, **prevents
  feature bloat**; **a story is a subset of the customer journey map**.
- Structure: **"As a … [user], I want … [desire] … so that … [goal]"**.
- Four points: clear role · **the "why" stands out** · **one sentence** · **action-oriented** language.
- Story map: step 1 frame What / Who / Why · step 2 the **backbone** (high-level steps — buying music: sign up → search → preview →
  enter payment → buy → download → share/rate) · step 3 split into cards grouped under each step (search: by song / artist / album /
  genre / year) · step 4 prioritise by rows · keep the map alive as you go.
- **Backbone = the main activity flow carrying the main value.**

## 6. Navigation structure, information scent, progressive disclosure

### 6.1 Navigation structure — pick the model from the content relations
- **Flat / peer navigation:** a few top-level peer areas. iOS usually a tab bar; Android a navigation bar in compact windows.
- **Hierarchical navigation:** overview → detail; navigation stack / back stack.
- **Content-driven navigation:** users open links or related objects from the content.
- **Search-driven navigation:** fits large data, but never use search to hide a poor architecture.
- **Multi-pane:** list-detail or primary-supporting when the width allows.

Principles:
- One screen has one clear primary goal.
- Do not mix top-level tabs with local filters.
- Keep position, scroll, selection and draft data when the user comes back.
- Back is predictable: it returns to the previous context, not "go to Home".
- A deep link takes the user to the right content with a sensible way to continue.

### 6.2 Information scent
Item names, icons and descriptions must let users predict what is behind them. A good label:
- uses words users know, not internal jargon;
- is more specific than "Other", "Continue" or "Process";
- is consistent across menu, title and CTA;
- does not rely on an icon alone unless its meaning is universal.

### 6.3 Density and progressive disclosure
- Show the information needed to decide right at the decision point.
- Put advanced options in a disclosure, a menu or a separate screen when they are rarely used.
- Never hide the primary action in an overflow menu.
- On large screens "more white space" is not enough; consider revealing another pane, supporting information or parallel actions.

## 7. UX artifacts — what each one is for and how they link

**7.1 An artifact is not the end goal.** Personas, maps, flows and prototypes only matter when they help the team decide. Not every
project needs every artifact. Start from: who will use this document, to decide what, and when does it expire?

**7.2 Empathy map.** Input: interview transcripts, observation, support feedback or usability notes — never filled in from workshop
participants' imagination. Six zones: **Says** (real quotes) · **Thinks** (inferred thoughts, mark the confidence) · **Does** (observed
behaviour) · **Feels** (emotions and signals) · **Pains** (barriers, risks, frustrations) · **Gains** (outcomes, success, motivation).
Output: patterns, contradictions and research gaps. If Says differs from Does, that is an insight to investigate, not a data error.

**7.3 Data-based persona.** Five steps: collect data → code patterns → group by behaviour / goal → build profiles → feed into scenarios
and decisions. Personas should not differ only by age / photo; better grouping axes are frequency, expertise, goal, constraint or
decision behaviour. Each persona needs goal, context, behaviour, pain, workaround, trigger and a sourced quote. Record the update date and
evidence. Avoid an "average persona" that represents nobody, or so many personas the team cannot prioritise.

**7.4 Customer journey map.**
- *Scope:* define persona, scenario, start / end and level of detail. A CJM of "the whole customer journey" is usually too broad to act on.
- *Components:* stage, goal, action, touchpoint / channel, thought, emotion, pain, backstage dependency, metric and opportunity. Use real
  data; the emotion curve is only a visualisation, do not fake precision.
- *Workshop:* prepare evidence first; map the current state before the future state; invite people with operational knowledge; record an
  owner for each opportunity. Afterwards prioritise opportunities by impact / evidence / effort and turn them into research or product
  initiatives.

**7.5 Information architecture.**
- *Content inventory and audit:* list content / objects, owner, format, status, traffic and quality. Find duplicates, gaps and expired
  content.
- *Organisation and labelling:* choose the organisation scheme by task / audience / topic; label in the users' language. Card sorting
  explores how to group; tree testing checks whether users find the right place in the hierarchy.
- *Navigation and search:* define global / local / contextual navigation, breadcrumbs, cross-links, filters and search behaviour.
  Empty / no-result states need recovery. IA balances users, content and organisational context.

**7.6 Sitemap.** Shows the hierarchy and relations of pages / areas. Each node should have an ID, label, type / template and status if it
is used to manage the project. Do not confuse a UX sitemap with `sitemap.xml` for crawlers. Check breadth / depth, orphan pages,
duplicate labels, the path to the main tasks and room to grow. A sitemap does not show detailed decision logic; that belongs to the user
flow.

**7.7 User flow.** Components: entry point, action, screen / state, decision, system response, error / recovery and end state. Use a
consistent legend and name things by behaviour. Types: **task flow** (one ideal path, few branches) · **user flow** (many entries /
decisions / states) · **wireflow** (wireframes linked into the flow) · **service blueprint** (adds frontstage / backstage / process).
Never draw only the happy path. For authentication, payment or upload, error, cancel, retry and timeout are part of the core experience.

**7.8 Wireframe.** Before drawing, have the requirements, content priority, flow and constraints. Start low-fi to discuss structure. Use
greyscale, annotations and rough components; no time on pixel polish. Bring in real copy, errors and data density early. Review a
wireframe by task, hierarchy, IA, states and responsiveness. Raise fidelity only when the structural questions are answered.

**7.9 Mockup.** A mockup applies the visual language to the structure: grid, typography, color, imagery, spacing, icons and components.
Test contrast, long content, localisation, real data and breakpoints. A beautiful mockup does not prove usability; do not skip the
prototype / test.

**7.10 Prototype.** Choose fidelity by the question. Low-fi for concept / flow; high-fi for interaction / content / visual perception; a
coded prototype for data / state or technical risk. Define scenario, entry point, task and limitations so participants do not misread
how finished it is. A Figma prototype needs consistent layers for Smart Animate, overlays with the right dismiss behaviour, scroll areas
and clear states. Do not build every screen if they do not serve the test question (`../figma-prototype-flow/SKILL.md`).

**7.11 Decision traceability chain.** A good documentation trail can be traced back:
research evidence → insight → problem statement → opportunity / JTBD → IA / flow → wireframe → prototype → test finding → design
decision → metric. If you cannot explain why a screen or feature exists, the artifact is becoming process decoration.

**7.12 Checklist.**
- [ ] Every artifact has an audience, a decision and an owner.
- [ ] Data and assumptions are told apart.
- [ ] Scope and update date are clear.
- [ ] Error / recovery is in the flow.
- [ ] Real copy / data has been checked.
- [ ] The artifact links to evidence and to the next step.

Main sources (Telos Academy, Vietnamese): Empathy Map, Persona, CJM, IA, Sitemap, User Flow, Wireframe, Mockup, Prototype —
`https://academy.telos.vn/` (articles *huong-dan-nguoi-moi-ve-empathy-map-la-gi*, *user-persona-la-gi-cach-tao-ra-1-user-persona*,
*customer-journey-map-hanh-trinh-khach-hang*, *information-architecture-la-gi-vs-sitemap*, *sitemap-la-gi*,
*user-flow-dan-loi-nguoi-dung-trong-tung-tuong-tac*, *wireframe-khung-xuong-cua-thiet-ke*, *mockup-la-gi-huong-dan-toan-tap-cho-nguoi-moi*,
*prototype-la-gi-video-huong-dan*).
