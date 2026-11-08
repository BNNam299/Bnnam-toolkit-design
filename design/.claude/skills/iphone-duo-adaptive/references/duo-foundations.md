# iPhone Duo foundations: statement types, mental model, support levels, glossary, scope

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §header, §1, §2, §19.8, §21, §22, §23.8, §25, §36 @ 3c0e291 — translated, complete

**Labels used in every `duo-*.md` file:** `[A]` Apple rule — guidance or behaviour Apple publishes directly (HIG, docs, videos) · `[C]` design consequence — UX/UI conclusion drawn directly from an Apple rule · `[T]` toolkit proposal — how the toolkit turns the knowledge into a brief, component rule, checklist or acceptance criterion; **not** Apple wording. A section may state a default label; inline tags override it.

## Contents
1. How to read this knowledge (statement types, reliability)
2. What "official specs" do and do not mean
3. Core mental model: one continuous experience in changing space
4. Four design pillars
5. Three support levels (Compatible / Adaptive / Duo-enhanced)
6. Glossary and plain-language pose names
7. Operating conclusion: the 8 qualities of a good iOS 27 / Duo design
8. Scope boundary: what this knowledge covers, what needs product research

---

## 1. How to read this knowledge

- **Three statement types** (labels above). Keep them separate in every brief, spec and review: never present a `[T]` proposal as "Apple says".
- **Recency `[T]`:** iOS 27, Xcode 27 and iPhone Duo are **newer than the agent's built-in knowledge**. Take every statement from these references (and the verbatim HIG pages in `../apple-hig/references/`), never from memory. Source material was checked against Apple's documents and videos in October 2026; check Apple's change log before turning a statement into a fixed rule.
- **Scope:** only what affects experience, layout, behaviour, continuity, component system and UI testing. Pure code details with no design impact were removed in the source.
- **Images and examples are illustrations, not templates to copy.** Real design starts from each app's hierarchy, content, states and available space.
- **Diagrams `[T]`:** presenter thumbnails from Apple videos only identify the video; turn principles into your own diagrams (as the wireframes in these references do) instead of depending on video screenshots.

Verbatim Apple page: [Designing for iPhone Duo](../apple-hig/references/designing-for-iphone-duo.md).

## 2. What "official specs" do and do not mean `[A]`

The iPhone Duo HIG does **not** give a fixed set of coordinates to hard-code. Apple requires:
- design for the **current container/window size**, not the model name;
- use **horizontal/vertical size class**, layout margins and safe-area insets;
- accept the **reserved regions** the system supplies at run time;
- never infer iPad, traditional iPhone or Duo from a size class alone;
- never assume orientation, aspect ratio or control-bar position will match a screenshot;
- use **Apple Design Resources** when you need exact geometry templates for mockups.

`[T]` Therefore never write a rule like "Duo is X pt wide so the panel is always Y pt". The correct rule: **"the panel flexes with the available area; switch the hierarchy model at compact/regular; avoid reserved regions; keep state on resize."**

## 3. Core mental model `[A]` unless tagged

iPhone Duo is **not "a small tablet with a crease"**. It is still an iPhone, but one app can appear anywhere on a continuum:
1. outer display, device closed;
2. inner display, opened flat;
3. inner display partly folded like a book;
4. set down like a laptop/tabletop;
5. stood up as a tent / on its edge;
6. one half of Split View;
7. a window shrunk by Picture in Picture, the keyboard or a system surface;
8. an iPhone app resized on iPad or in iPhone Mirroring.

The overarching principle is **one continuous experience whose space changes**, not several independent app versions. Across every change the person must keep:
- their place in the flow;
- the current selection;
- data being entered / drafts;
- play / capture / edit state;
- scroll position where sensible;
- the meaning and rank of actions;
- access to the same functionality in every posture.

A size change **may** reveal more hierarchy, change the pane split, move control bars or send actions to overflow. It **must not** silently change the task or remove a function.

## 4. Four design pillars `[T]`

| Pillar | Mandatory question |
|---|---|
| Resizability | Does the UI work at every intermediate size and ratio, not just the two prettiest artboards? |
| Continuity | When closing/opening/folding/resizing, does the person still know where they are and what they are doing? |
| System adaptation | Does the app let standard components handle safe area, fold, vertical bars, overflow and presentation? |
| Progressive use of space | Does more space reveal more value/hierarchy instead of stretching the phone UI? |

## 5. Three support levels `[T]`

| Level | When | Requirements |
|---|---|---|
| **Compatible** | the app has no Duo-specific use case | does not break, resizes correctly, safe area, same functionality |
| **Adaptive** | most of the app benefits from the large canvas | split / pane / grid / vertical controls / overflow are designed |
| **Duo-enhanced** | product has media, camera, productivity or hands-free use cases | arrangement, posture-specific enhancement, multi-scene / display accessory **with fallback** |

Do not force every project to Duo-enhanced. The right level depends on value to the user, not on a wish to "use all the hardware". Record the chosen level in the project brief (see `duo-adapt-workflow.md` §3).

## 6. Glossary and plain-language pose names `[T]`

| Term | Meaning in these references |
|---|---|
| Outer display | the outside screen used when Duo is closed |
| Inner display | the large inside screen when Duo is open |
| Pose | how the device is opened / set down / held |
| Posture-specific enhancement | an improvement useful in one pose that removes no function from other poses |
| Reserved region | dynamic area that content/controls must avoid or adapt to |
| Folding region | the reserved region over the curved screen area around the hinge |
| Displacement | moving an existing element/group to a usable region without changing the task |
| Arrangement | container that lays out primary/secondary as split or overlay; **not** navigation |
| Vertical controls | toolbar / tab bar / navigation moved to a vertical side edge |
| Scene accessory | supplementary UI on another display, dependent on availability |
| Continuity | keeping task, state, hierarchy and orientation across resize / pose / display |
| UI layer | floating navigation/actions; prefer system components |
| Content layer | the content, and the main space for brand expression |

**Plain-language pose names (mandatory in briefs, wireframes, prototypes and test cases).** Write these Vietnamese names verbatim (the team's working language), with the Apple term beside them — never only `book`, `tabletop` or `partial fold`, because people unfamiliar with Apple terms misread the posture:

| Write verbatim | English gloss | Apple / technical term | Fold direction seen from the UI |
|---|---|---|---|
| **Mở hoàn toàn / mở phẳng** | fully open / opened flat | Fully open, flat inner display | no fold split |
| **Mở một nửa kiểu quyển sách** | half-open like a book | Book pose, partial fold | vertical fold |
| **Mở một nửa kiểu laptop** | half-open like a laptop | Tabletop / laptop pose, partial fold | horizontal fold |

"Mở một nửa" (half-open) alone is ambiguous: always add **kiểu quyển sách / gập dọc** (book / vertical fold) or **kiểu laptop / gập ngang** (laptop / horizontal fold) — the two create different layouts and different reach zones.

## 7. Operating conclusion `[T]`

A good iOS 27 / iPhone Duo design is judged not by how many special layouts it has, but by its ability to:
1. flex continuously without breaking;
2. keep task and state when space changes;
3. use a larger hierarchy when it helps;
4. put controls on the right edge, in the right pane, with the right priority;
5. avoid fold / camera / system UI using **dynamic data**;
6. use Liquid Glass and brand deliberately and stay readable in every setting;
7. exploit multiple displays / cameras / poses as **enhancements with fallback**;
8. be verified with Device Hub on realistic combinations of states.

The shortest rule:
> **Design one continuous interface system for the available space; do not design a fixed set of screens per device name.**

## 8. Scope boundary `[T]`

### 8.1 Layers this knowledge covers
1. anatomy, pose, safe area, reserved region (`duo-device-postures.md`);
2. adaptive container, navigation, bars, presentation (`duo-layout-transformation.md`, `duo-components.md`);
3. multi-scene, multi-display, continuity (`duo-multi-display-scenes.md`);
4. iOS 27 visual system and Liquid Glass (`duo-ios27-visual.md`);
5. accessibility with operational criteria; 6. localization, text expansion, RTL (`duo-accessibility-localization.md`);
7. loading, empty, error, recovery, persistence (`duo-states-feedback.md`);
8. ergonomics, handedness, occlusion; 9. motion, alternative input, feedback (`duo-ergonomics-motion-input.md`, `duo-states-feedback.md`);
10. privacy on every system/display surface; 11. onboarding/discoverability (`duo-privacy-onboarding.md`);
12. camera layout, hardware controls, capture→review lifecycle (`duo-camera-layout-controls.md`, `duo-camera-lifecycle-privacy.md`);
13. handoff contract and test matrix (`duo-handoff-testing.md`).

Two reminders: design tokens of a specific app come from the **product brand**, never from Apple documents; the **simulator does not replace a real device** for sensor, hardware input and thermal behaviour.

### 8.2 Product modules, not platform gaps — route to dedicated research
When a PRD turns on any of these, route to specialised research instead of extrapolating from the base camera/layout rules:
- simultaneous multi-camera and picture-in-picture capture;
- spatial / cinematic / depth / RAW professional workflows;
- document scanning / OCR / perspective correction; AR overlay or computer-vision guidance;
- pro manual controls, histogram, waveform, false colour;
- livestream network quality, reconnect and moderation;
- video-call participant layout, screen share, reactions;
- external storage or long-form professional recording;
- game controls / custom HUD;
- regulated capture (medical, financial, identity);
- brand tokens, content model and business flow of each product.

### 8.3 Definition of "enough"
This knowledge is enough for **iOS 27 / iPhone Duo adaptive-design foundations** when a designer can determine layout, behaviour, state, transition, accessibility, privacy, failure and tests for a mainstream feature **without guessing platform rules**. It does not replace product research, domain research or usability testing.

### 8.4 Five-layer completeness check (before declaring any Duo package or spec complete)
1. **Source coverage** — official sources and their exceptions read?
2. **Behaviour model** — states, transitions and failures described?
3. **Applied pattern** — does the designer know where to place components in a real use case?
4. **Input/output integration** — do system overlays, hardware, accessibility and multiple displays share the same state?
5. **Verification** — is there a test matrix on simulator **and** the right real devices?
