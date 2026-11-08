# Atomic Design — systems thinking for design, and Figma practice

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/atomic-design.md @ 3c0e291 — translated, complete

Sources: Brad Frost, *Atomic Design* (chapters 1–5), the blog post *Atomic Web Design*, and official Figma documentation (help center,
best practices) — extracted once at the designer's request (*"that's how we think about a design system"*). Page list in §10. Use this
file; don't reopen the sources.

Knowledge is a lens, not a procedure. **The designer's standard wins where it differs:** the draft / lock rhythm
(`../figma-project-maintain/references/processes.md` §1 rules 2–3, 7), the screen frame and Safe-Area
(`../bnnam-standards/references/frame-standards.md` §5), main components are never edited without approval
(`../bnnam-standards/references/team-rules.md` §12.4). Where a source says otherwise, the item is marked **Designer standard**.

Conventions: text in quotation marks is a short verbatim quote from the source; **(synthesis)** marks what was inferred / combined from
several sources, not a source's words. Source abbreviations: **AD1–AD5** = Brad Frost, *Atomic Design*, chapters 1–5; **AWD** = the
original "Atomic Web Design" blog post; **F-xxx** = Figma documentation (§10).

## Contents
1. Atomic Design is systems thinking (not a rigid taxonomy)
2. The five levels: definition, recognition criteria, mobile examples
3. Classifying a part; when to promote or split
4. The atomic kit for a mobile app — checklist
5. Assembly rules
6. Figma practice
7. Atomic workflow
8. Maintenance and governance
9. Common mistakes
10. Sources (read)

---

## 1. Atomic Design is systems thinking (not a rigid taxonomy)

### 1.1 Design systems, not pages
- "We're not designing pages, we're designing systems of components." (Stephen Hay, quoted in AD1).
- Complexity lies in the **number of component and layout types**, not the number of screens: a 30,000-page site may consist of only a
  few content types and layouts (AD1).
- For mobile apps **(synthesis)**: an app's 40 screens usually use only ~5–8 screen frames (templates) and a few dozen components.
  Estimate work and check consistency per component, not per screen.

### 1.2 A mental model, not a linear process
- "Atomic design is not a linear process" — "it's merely a mental model for constructing a UI" (AD2).
- The main benefit: "quickly shift between abstract and concrete" — seeing the interface as a whole and as a set of parts at once; "the
  parts of our designs influence the whole, and the whole influences the parts" (AD2).
- In practice: you don't have to finish every atom before building screens. Build a screen, see what repeats → extract it into a
  component; build a component, put it back into a screen to test it (§7.2).

### 1.3 Not dogma
- "atomic design is not rigid dogma" (AD2). The GE team renamed the levels to be clearer to colleagues (AD2). Pattern Lab also allows
  any naming / grouping: "You can name and categorize these folders however you'd like" (AD3).
- The real value of the five levels: atom / molecule / organism "imply a hierarchy" that "component" / "module" don't (AD2) → the whole
  team knows what assembles into what.
- Real example: littleBits merged molecules + organisms into one "Components" group because complex organisms were rarely reused across
  templates (F-blog atomic components). → Merging / renaming levels is allowed as long as the **small-to-large assembly relationship**
  stays.

### 1.4 Why a system
- Consistency and reliability: style guides "promote consistency and cohesion" (AD1).
- Faster later because existing patterns are reused; a shared vocabulary across roles (AD1, AD4).
- Common pattern-library failures Atomic Design wants to fix (AD1): missing context ("don't provide any hints as to when, how, and where
  their components get used"), treated as a side project, no methodology ("loosely arranged sprays of modules"), no maintenance /
  governance.

---

## 2. The five levels: definition, recognition criteria, mobile examples

> Mobile examples are **(synthesis)** — the source uses web examples (label, input, button, search form, header, product grid,
> homepage).

### 2.1 Atom
- Source: atoms are the "foundational building blocks that comprise all our user interfaces" (AD2); on the web, HTML tags like label,
  input, button (AWD). "Atoms can also include more abstract elements like color palettes, fonts" and even invisible things like
  animation (AWD).
- An atom alone is of little use, but it's where you see "base styles at a glance" when maintaining (AD2). Atoms "don't exist in a vacuum
  and only really come to life with application" (AD2).
- Recognition **(synthesis)**: can't be split further and still be meaningful UI; contains no other component (except internal base
  components); one visual responsibility.
- Mobile examples **(synthesis)**:
  - token / style level (not components): color token, text style, spacing, radius, shadow / effect, motion / easing.
  - component level: icon, label / text, basic button, avatar, badge / dot, divider, raw checkbox / radio / switch, empty input field,
    image thumbnail, progress bar.

### 2.2 Molecule
- Source: "relatively simple groups of UI elements functioning together as a unit" (AD2); e.g. label + search input + button = search
  form. Molecules "take on their own unique properties" (AD2) — combined they gain new meaning (a button becomes useful attached to an
  input).
- Principle: single responsibility — "do one thing and do it well"; simple molecules are easy to test, reuse and keep consistent (AD2).
- Criteria **(synthesis)**: built from 2+ atoms; does **one job** a user can name (search, pick, show one item); reusable across many
  organisms / screens.
- Mobile examples **(synthesis)**: chip / tag (icon + label), search field (icon + input + clear), list row / cell (avatar + title +
  subtitle + chevron), text field with label + helper / error, segmented control item, stepper (− number +), rating stars, tab bar item
  (icon + label + badge), plan option (radio + plan name + price).

### 2.3 Organism
- Source: "relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms" (AD2); "These
  organisms form distinct sections of an interface" (AD2); encourages "standalone, portable, reusable components" (AWD). Examples: header,
  product grid.
- Organisms show smaller components "in use" and are distinct reusable patterns (AD2).
- Criteria **(synthesis)**: a **region** of the screen with a clear boundary; can move to another screen and keep its meaning; usually
  contains several repeated or different molecules.
- Mobile examples **(synthesis)**: tab bar, navigation bar (back + title + action), paywall plan selector (plan options + CTA + terms),
  card list / feed, bottom sheet, onboarding carousel, sign-in form, empty state block, settings group.

### 2.4 Template
- Source: "page-level objects that place components into a layout" and "articulate the design's underlying content structure" — the
  focus is **content structure**, not final content (AD2). "Templates consist mostly of groups of organisms stitched together" (AWD).
- Templates record important content properties: image sizes, character lengths of titles / paragraphs — so the system survives dynamic
  content (AD2).
- From this level on Frost drops the chemistry metaphor and uses words outsiders understand (AD2).
- Mobile examples **(synthesis)**: a screen frame with status bar + nav bar + scrolling content area + tab bar; a paywall frame (hero,
  benefits, plan selector, CTA); a detail frame; a list frame. Content is constrained placeholders (image 16:9, title ≤ 2 lines).
  **Designer standard:** status bar and home indicator are never drawn — the frame uses Safe-Area spacer components
  (`../bnnam-standards/references/frame-standards.md` §5).

### 2.5 Page
- Source: "specific instances of templates that show what a UI looks like with real representative content in place" (AD2). "The page
  stage is the most concrete stage" and "essential for testing the effectiveness of the underlying design system" (AD2).
- Pages show the **variations** of a template: a cart with 1 item vs 10, a dashboard hiding activity for new users, very different
  long / short titles, an extra button for admins (AD2).
- If real content breaks a pattern (a name wrapping to 5 lines), fix it **at the atom / molecule level**, not by patching the page (AD2).
- Mobile examples **(synthesis)**: Home with real data; a paywall with real localized prices; a list screen empty / full / error /
  loading; a long German translation.

---

## 3. Classifying a part; when to promote or split

### 3.1 Classification questions (synthesis, from the AD2 definitions)
Ask in order, stop at the first "yes":
1. Can it be split further and still be meaningful UI? **No** → atom.
2. A small group doing **one** job? → molecule.
3. A distinct **region** of the screen containing several molecules / atoms / organisms? → organism.
4. A whole-screen layout frame with placeholder content? → template.
5. A specific screen with real data / a specific state? → page.
- The molecule / organism boundary is often blurry; the source accepts merging (§1.3). Decide once, record it, apply it consistently.

### 3.2 When to turn a part of a screen into a component
- Source: turn repeated parts into components early, even at low fidelity (F-best practices components / styles / libraries). When a
  second team needs the same "one-off" pattern, it belongs in the library (AD5).
- Figma on nested instances: "Think about which parts of this component will need to be reused and stay consistent across designs"
  (F-nesting).
- **Designer standard (wins over the source):** the draft rhythm **creates no components** — repeated parts are only **noted** in
  `design/work/notes.md`; components are created at the lock, after the designer has picked the option / direction
  (`../figma-project-maintain/references/processes.md` §1). The criteria below build the **proposal list** at the lock, not components
  during drafting.
- Criteria **(synthesis)**:
  - Appears **≥ 2 times** (on 2 screens or in 2 places) with the same role → make a component.
  - Appears once but will certainly repeat (a list row, a tab bar item) → make a component straight away (at the lock).
  - Appears once and is specific to one screen (a one-off hero illustration) → leave it as layers; don't abstract yet.

### 3.3 Promotion path (synthesis)
A part inside a screen → extracted into a local component (molecule / organism) → when its sub-parts repeat elsewhere, split those into
kit atoms / molecules → the old component switches to instances of the sub-parts.
- When splitting: replace the layers with an instance; never keep two parallel copies.
- Name by structure, not context (§6.4): "card", not "product card" (AD5).

### 3.4 When NOT to split
- Over-splitting makes a library hard to use; Frost warns against the "bloated and unwieldy Wild West" of one-off patterns (AD5).
- **(synthesis):** don't split a part that only means something inside one component and never changes independently; use a hidden base
  component (§6.1) instead of publishing it.

---

## 4. The atomic kit for a mobile app — checklist (synthesis)

> The source suggests inventory groups (AD4): global elements, navigation, image types, icons, forms, buttons, headings, blocks, lists,
> interactive components, media, third-party, advertising, messaging, colors, animation. The checklist below carries them over to
> mobile.

### 4.1 Foundations (styles / variables, not components)
- [ ] Color: base palette + semantic names (bg, surface, text, border, primary, danger…). littleBits used semantic names because colors
  change per theme (F-blog atomic components). Figma recommends a style for every documented color (F-best practices libraries).
- [ ] Typography: text styles by role (display, title, body, caption, label).
- [ ] Spacing, radius, elevation / shadow, grid / layout.
- [ ] Motion: durations, easing (invisible atoms — AWD).

### 4.2 Atom components
- [ ] Icon (one component per icon, same frame size) — swapped with instance swap, never one variant per icon (F-variants).
- [ ] Button: type (primary / secondary / tertiary / destructive) × size × state (default / pressed / disabled / loading); left / right
  icon via boolean + instance swap.
- [ ] Basic text field, checkbox, radio, switch, slider.
- [ ] Avatar, badge / dot, divider, progress (bar / ring), spinner, thumbnail / image with a fixed ratio.
- [ ] Top / bottom Safe-Area — **spacer** components the designer has prebuilt in the kit. **Designer standard:** never draw the status
  bar or home indicator (`../bnnam-standards/references/frame-standards.md` §5) — Figma's suggestion to nest a status bar instance
  (F-nesting) does not apply. A keyboard only when the screen needs it (system kit).

### 4.3 Basic molecules
- [ ] List row / cell (leading slot / icon / avatar, title, subtitle, trailing: chevron / switch / value).
- [ ] Search field, text field with label + helper + error.
- [ ] Chip / tag, segmented control, tab item, stepper, rating.
- [ ] Nav bar item, icon button, header buttons (F-nesting).
- [ ] Toast / snackbar, tooltip, notice banner.

### 4.4 Common organisms
- [ ] Navigation bar, tab bar, bottom sheet, dialog / alert, card, list section / group, empty state, paywall plan selector, onboarding
  step.

### 4.5 Every component needs
- [ ] Every state and variant (pattern states — AD3; including edge cases). Mobile apps: default · pressed · disabled · loading ·
  selected / on-off by type — **no** hover / visited (web) **(synthesis)**. The touch area is the developer's job — design does not check
  it (designer rule).
- [ ] A description of how to use it, a link to docs (F-component properties; F-best practices libraries).
- [ ] Padding inside the component so it tiles cleanly (F-component architecture).
- [ ] Content constraints: max lines, image ratio (AD2 on templates).

---

## 5. Assembly rules

### 5.1 Higher levels use instances of lower levels
- Source: "the smallest patterns (atoms) are included inside bigger patterns (molecules)"; changing a small pattern changes every larger
  pattern containing it (AD3). Figma: "Building complex components with nested instances is a great way to maintain consistency";
  editing an icon component updates every nested instance (F-nesting). A library should have "atom components that you can nest in
  others to make updating easier" (F-best practices libraries).
- Rule **(synthesis):** inside a molecule / organism, every part that exists in the kit must be an **instance**, never redrawn as loose
  layers.

### 5.2 Don't detach
- Detaching turns an instance into a plain frame and cuts the link; later component changes "no longer" reach it; you can undo right
  away, but the old instance can't be reconnected (F-detach). Figma Organizations track detach frequency in Design System Analytics
  (F-detach).
- Figma considers detaching reasonable only when you need a change overrides can't make, or to start a new variant (F-detach).
- Rule **(synthesis):** needing to detach = the component is missing a property / slot → fix the component (add a property, slot,
  variant) instead of detaching in the screen.

### 5.3 Variant or separate component
- Use variants when similar components share properties: "state, size, count, layout, and more"; true / false toggles; name properties
  to match React / Vue prop / value style (F-variants).
- Don't use variants when combinations become unmanageable → "nesting instances or using base components instead" (F-variants).
- Never a variant per icon: "this quickly becomes unmanageable" → use a nested icon instance and swap (F-variants).
- Never variants for color / theme: they balloon the variant count and must be maintained on every component (F-variants).
  **(synthesis):** handle themes with variables / modes.
- Criterion for a separate component **(synthesis):** different **role / structure** (list row vs card) → separate component; same
  structure, different state / size / kind → variant.

### 5.4 Which component property to use
| Need | Property | Source |
|---|---|---|
| States, sizes, kinds that define the component | Variant | F-component properties |
| Show / hide an optional layer (icon, badge, secondary button) | Boolean — "Currently, boolean properties only support layer visibility" | F-component properties; F-property fundamentals |
| Change text | Text (no rich text: list styles, superscript) | F-component properties |
| Swap a nested instance for an approved alternative (icon) | Instance swap + preferred instances | F-component properties |
| Free content area / a variable number of repeated items | Slot | F-slots; F-property fundamentals |
- Booleans instead of combinations: without booleans "you'd need separate components for every possible combination of optional
  elements" (F-property fundamentals).
- Text properties "eliminate confusion about which text layers are meant to be edited" — e.g. a toast: fixed title, changing message
  (F-property fundamentals).
- Properties don't lock other layers: they "simply guide users by making the right controls easier to find" (F-property fundamentals).
- Warning: merging components with a boolean can lose prototype connections, because the interaction needs two separate objects to
  connect (F-component properties).
- Before adding properties, review the existing system to decide which parts become properties and which stay variants (F-component
  properties).

### 5.5 Instance swap and preferred instances
- Instance swap marks a nested instance as swappable; the default can be any component in the file / library (F-component properties).
- Preferred instances: a curated list shown by default when swapping — e.g. an icon button should only use 8 of 100+ icons (F-component
  properties).
- One base card + icon as a component + instance swap, instead of one card per icon (F-nesting).

### 5.6 Slots
- A slot is a component property: a flexible area in the main component where instance users add / edit / reorder content "without
  detaching" (F-slots; F-component properties). Available on every plan; publishable in libraries (F-slots). Some Figma pages list slots
  as **open beta** — re-check when using them.
- Use for: repeated items (task list, tabs), free layouts (card, modal); fewer variants / hidden layers; less detaching so instances keep
  receiving updates (F-slots).
- Preferred instances for slots; option "Only allow preferred instances"; min / max layer limits (e.g. at most 5 avatars, at least 2
  radios) — limits only warn, "designed to guide your team, not restrict them" (F-slots).
- Limits: no component properties on layers **inside** a slot (use variables instead); a top-level layer of a component can't be a slot;
  a slot spans variants via multi-edit; try removing a slot on a branch before publishing (F-slots).
- Choosing **(synthesis):** a few fixed alternatives in one position → instance swap; free content or a varying count → slot.

---

## 6. Figma practice

### 6.1 Base components ("building blocks")
- Create base components (e.g. a rounded rectangle) as the basis of other components; the base is **not published** to the team library
  (F-component architecture).
- Every button and its states nest this base and use style overrides for the states → change the base, change everything
  (F-component architecture).
- Hide from publishing: prefix the component name with `.` or `_` (F-best practices libraries); or right-click in Assets → "Hide when
  publishing", or add `.` in Layers (F-remove from library — that article only mentions `_` for variable collections).
- Caution (forum, unofficial): hidden components may not appear as preferred values for library users and may not receive updates as
  expected — test before relying on a hidden base as a preferred instance.

### 6.2 Component properties in practice
- Create: select the main component / component set → Properties → pick the type; booleans are attached in the layer's Appearance
  section; instance swap via "Apply instance swap property" (F-component properties).
- Variants apply only to component sets and always sit above other properties in the panel (F-component properties).
- Rename default properties ("Property 1", "Variant") to meaningful names (F-create variants).
- Simplified instances were removed on 23 March 2026: every instance shows all properties and default layers (F-component properties).

### 6.3 Exposed nested instances
- How: select the main component / component set → Properties → "Expose properties from" → "Nested instances" → tick the instances to
  show (F-component properties).
- Appears only when the component already has an exposed nested instance or contains a nested instance with component properties. If a
  boolean hides an exposed instance, that instance's properties are hidden too (F-component properties).
- Effect **(synthesis):** users of an organism edit properties of the molecule inside (e.g. a button label inside a card) without digging
  into layers → fewer variants, less detaching.

### 6.4 Naming
- `/` creates levels in the instance menu: "buttons/primary/default"; the fastest way to organise, but long names are hard to read in
  Layers (F-best practices libraries; F-component architecture).
- When combining as variants, `/` groups in layer names become variant property values (F-variants).
- Give **text layers the same name** across related components / variants (e.g. "Text") so overrides survive a swap (F-component
  architecture; F-best practices libraries).
- Context-neutral names: "The more agnostic pattern names are, the more versatile and reusable they become" — "carousel", not "homepage
  carousel"; "card", not "product card"; tip: blur the content and name by structure (AD5).
- Per-level convention **(synthesis):** page / group prefix by level or by type (e.g. page "Atoms", frame "Buttons", component
  "Button"), consistent across the library; property / value names match the code prop names. Team naming rules:
  `../bnnam-standards/references/naming.md` §6.

### 6.5 Pages / sections by level
- Figma recommends **pages and frames** as the main organisation: page names become top-level headings, frame names collapsible
  subheadings in the panel; keep names short and put usage notes next to the main component (F-best practices libraries).
- Components in the same frame are treated as related and show together in the instance menu (F-best practices libraries). Group main
  components in an aptly named frame, with instances showing the states next to them (F-component architecture).
- A page may hold just one component set (e.g. "Buttons") and leave room for related components later (F-variants).
- Suggested order **(synthesis):** Cover → Foundations (color, type, spacing, effects) → Icons → Atoms → Molecules → Organisms →
  Templates; Templates / Pages pages may live in the project file instead of the library file.

### 6.6 Publishing and updates
- Publish from the Team Library; published main components and styles are usable in other files (F-best practices libraries).
  Publishing a change pushes the update to every file using it (F-review updates).
- Consumer side: a blue badge on the Libraries icon → Updates tab → view side by side or overlay → "Update" each item or "Update all";
  updates apply to every page of the file; changes on hidden layers can't be compared visually (F-review updates).
- One library: simple but bloats easily; several libraries "tends to scale much better" for mid / large teams (F-best practices
  libraries).
- Add a description to main components — it shows as a tooltip and helps tell similar variants apart (F-best practices libraries).
- Note: the older best-practices article advises "a separate component for each state" — written before variants; today use variants +
  properties (F-variants) **(synthesis)**.

---

## 7. Atomic workflow

### 7.1 Interface inventory
- Purpose: expose inconsistency (e.g. 37 different button styles) so everyone sees the problem (AD4).
- How (AD4):
  1. Gather every role (design, dev, content, PM, business, QA).
  2. Agree on one screenshot tool so results can be merged.
  3. Capture **one sample per distinct pattern**, not every occurrence.
  4. Timebox ~30–90 minutes; sweep the whole experience: "Any piece of UI that is or could be managed by your organization should be
     documented."
  5. Each group presents for 5–10 minutes; merge into a shared document; a small team decides the next step.
- Closing questions: "Which patterns should stay, which should go, and which can be merged together?" and "What pattern names should we
  settle on?" (AD4).
- For the agent **(synthesis):** before building a kit for an app that already has screens, scan the screens → list one sample per
  pattern by group (§4) → mark keep / drop / merge → name → only then build components. `scripts/system-audit.js` and
  `scripts/inspect.js` do the machine part.

### 7.2 Top-down and bottom-up in parallel
- "to create the whole, you need to create the parts of that whole" — patterns are built, then assembled into templates; the effort per
  template drops as the patterns mature (AD4).
- Conversely, the overall direction is set first and patterns are refined inside it (AD4; the "top-down / bottom-up" labels are an
  interpretation, not the source's words).
- "This work can happen concurrently but shouldn't happen in isolation"; no "a rigid order of operations" (AD4).
- Rough to refined: lo-fi sketches first to settle what a screen holds and in what order; "Ideas are meant to be ugly"; "Rolling updates
  are preferable to big reveals"; agree the big direction before high fidelity (AD4).
- Style tiles / element collages: try the design mood (color, type, icons) on real components before full comps (AD4).

### 7.3 When to abstract (synthesis, from AD4–AD5 and F-best practices)
- Figma advises turning repeated parts into components early, even lo-fi (F-best practices libraries). **Designer standard:** note
  during drafting, create at the lock (§3.2) — and even then only parts **already seen repeating** or certain to repeat.
- Lock atoms / molecules before multiplying them across many screens; lock organisms after trying them in ≥ 2 templates.
- Use pages with real data to test the system; when it breaks, fix it at a lower level (AD2).

---

## 8. Maintenance and governance

### 8.1 The system is a product, not a project
- "A system isn't a project with an end" (Nathan Curtis, in AD5). It needs a roadmap, a backlog and an owner.
- "The Design System informs our Product Design. Our Product Design informs the Design System." (Jina Bolton, AD5) → a two-way flow.
- "The biggest existential threat to any system is neglect." (Alex Schleifer, AD5).

### 8.2 How far an atom change reaches (lineage)
- A pattern should say which smaller patterns it contains and which larger patterns use it → you know what to retest after a change, and
  can find unused patterns to remove (AD3, AD5).
- Without the "when, how, and where" context you can't measure a change's impact (AD1).
- **(synthesis):** before editing an atom in Figma, look up where it's used (its instances in molecules / organisms and project files);
  edit → check each level above → only then publish. Tool: `scripts/impact.js`.

### 8.3 Governance questions to answer up front (AD5)
- What happens when a pattern doesn't fit a specific application?
- How are new pattern requests handled? How are old patterns retired?
- How are bugs handled, who approves changes, who updates the docs?
- How do changes reach the product, and how does everyone find out?

### 8.4 Changing patterns: modify, add, remove (AD5)
- **Modify:** add features, fix bugs, adjust visuals, performance, accessibility, refactor.
- **Add:** avoid the "Wild West" of one-off patterns; when a second team needs it → bring it into the library (contribute back).
- **Remove (deprecate):** when ineffective, outdated, unused, or users report problems. Mark as deprecated + point to the replacement,
  announce in advance (e.g. Salesforce's Sass Deprecate).
- **(synthesis)** for Figma: mark deprecated in the name / description, point to the replacement component, keep it for a while, then
  hide it from publishing (§6.1). Deleting a main component leaves its instances as instances so it can be restored (F-component
  architecture).

### 8.5 Versioning and communicating change
- Versions: e.g. CSS / JS served from a CDN with the version number in the URL; upgrading = changing the number (AD5).
- Communication: change log, roadmap, success stories, tips; delivered to the channels teams already use (AD5).
- **(synthesis)** for Figma: describe changes on every publish; consumers review updates (overlay) before "Update all" (F-review
  updates); breaking changes (removing a slot, restructuring) are tried on a branch first (F-slots).

### 8.6 Visible, cross-disciplinary, contextual (AD5)
- Make the system visible and inviting; a "watering hole for the entire organization".
- Contextual: images / videos of where a pattern is used, and usage guidance.
- The "holy grail": change a pattern and both the library and the product change; distributed organisations start with patterns +
  guidance + shared docs.

---

## 9. Common mistakes

| Mistake | Why it's wrong / what to do instead | Source |
|---|---|---|
| Treating the 5 levels as hard rules, arguing forever over molecule vs organism | It's a mental model; merge / rename levels, keep the assembly relationship | AD2, AD3, F-blog atomic |
| Finishing every atom before touching screens | Not linear; work in parallel, move between whole and parts | AD2, AD4 |
| Designing components in a vacuum | "It would be foolish to design buttons and other elements in isolation"; test in pages | AD2 |
| Redrawing kit parts as loose layers | Use instances so updates propagate | AD3, F-nesting |
| Detaching for a quick tweak | Updates lost forever; add a property / slot to the component | F-detach, F-slots |
| One variant per icon | Nested icon + instance swap + preferred instances | F-variants, F-component properties |
| Color / theme as variants | Variant bloat; use styles / variables | F-variants |
| Exploding variant combinations for optional parts | Use booleans / base components / nested instances | F-variants, F-property fundamentals |
| Context-bound names ("homepage carousel") | Name by structure, neutrally | AD5 |
| Different text-layer names across variants | Overrides are lost on swap; give layers the same name | F-component architecture |
| Patching content problems at page level | Fix at atom / molecule | AD2 |
| Publishing base components | Hide with `.` / `_` or Hide when publishing | F-component architecture, F-libraries |
| Adding one-off patterns freely | Accept only real repeated needs; have a proposal process | AD5 |
| No record of usage, no descriptions | Impact of changes can't be measured; add descriptions + lineage | AD1, AD3, AD5 |
| No owner | The system dies of neglect | AD1, AD5 |
| Merging with a boolean and forgetting the prototype | Prototype connections are lost | F-component properties |

---

## 10. Sources (read)

Brad Frost:
- AD1 — https://atomicdesign.bradfrost.com/chapter-1/
- AD2 — https://atomicdesign.bradfrost.com/chapter-2/
- AD3 — https://atomicdesign.bradfrost.com/chapter-3/ (only tool-independent concepts taken)
- AD4 — https://atomicdesign.bradfrost.com/chapter-4/
- AD5 — https://atomicdesign.bradfrost.com/chapter-5/
- AWD — https://bradfrost.com/blog/post/atomic-web-design/

Figma:
- F-component properties — https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties
- F-property fundamentals — https://help.figma.com/hc/en-us/articles/39636407507735-Components-collection-Component-property-fundamentals
- F-nesting — https://help.figma.com/hc/en-us/articles/39723486706455-Components-collection-Nesting-instances-fundamentals
- F-slots — https://help.figma.com/hc/en-us/articles/38231200344599 (Use slots to build flexible components)
- F-detach — https://help.figma.com/hc/en-us/articles/360038665754-Detach-an-instance-from-the-component
- F-review updates — https://help.figma.com/hc/en-us/articles/360039234193 (Review and accept library updates)
- F-remove from library — https://help.figma.com/hc/en-us/articles/360039238193 (Remove styles and components from a library)
- F-component architecture — https://www.figma.com/best-practices/component-architecture/
- F-variants — https://www.figma.com/best-practices/creating-and-organizing-variants/ (the readable copy was cut off at the end)
- F-best practices libraries — https://www.figma.com/best-practices/components-styles-and-shared-libraries/
- F-blog atomic components — https://www.figma.com/blog/creating-atomic-components-in-figma/ (littleBits, 2018)

Seen only in search results (pages not opened): F-create variants https://help.figma.com/hc/en-us/articles/360056440594 (renaming default
properties); Figma forum on hidden components and preferred values.
