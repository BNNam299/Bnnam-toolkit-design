# Acceptance checklist, anti-patterns, Definition of Done

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/acceptance.md (§19, §20, §33) @ 3c0e291 — translated, complete

Checklists for accepting a design or a build, the anti-patterns to reject on sight, and review playbooks for a component, a screen and
a flow. A thinking lens, not a procedure: the team review job and its scoring are in `review-methods.md`.

## Contents
1. Testing and acceptance checklist
2. Anti-patterns to avoid
3. Review playbooks and Definition of Done

---

## 1. Testing and acceptance checklist

### 1.1 Flow and function
- [ ] Every screen has a clear primary goal.
- [ ] Back, close, cancel and undo behave as expected.
- [ ] Deep links and notifications open the right state.
- [ ] No data loss on rotate, resize, background or network error.
- [ ] Double tap/submit doesn't create duplicates.
- [ ] Loading, empty, partial, error and offline are designed.

### 1.2 Platform
- [ ] Navigation and components follow iOS/Android conventions.
- [ ] Android back gesture and iOS swipe-back aren't broken.
- [ ] Keyboard, autofill, password manager, copy/paste work.
- [ ] Share, pickers, permissions and authentication use the system flow where appropriate.
- [ ] Status/navigation bar, safe area and insets are correct.

### 1.3 Adaptive
- [ ] Test compact, medium, expanded, large if the product supports them.
- [ ] Test portrait, landscape, split-screen and continuous resize.
- [ ] Content isn't stretched into overly long lines.
- [ ] No controls on the hinge/cutout/gesture area.
- [ ] Multi-pane keeps selection and focus.

### 1.4 Visual
- [ ] Hierarchy is clear at a glance.
- [ ] Spacing uses tokens, no random values (designer exception: raw spacing on screen layout frames —
  `../mobile-ui-master/references/screen-structure.md` §8).
- [ ] Light/dark/high contrast all correct.
- [ ] Icons from one family with matching optical weight.
- [ ] Text isn't cut with real data and long translations.

### 1.5 Accessibility
- [ ] VoiceOver/TalkBack can complete the main task.
- [ ] Touch targets reach 44 pt / 48 dp (in this team the developer enlarges the hit area of smaller visible controls —
  `handoff-spec.md` §2.4).
- [ ] Focus order and focus indicator are correct.
- [ ] Contrast passes and colour is never the only signal.
- [ ] Large text reflows well.
- [ ] Reduce Motion and captions/transcripts are handled.

### 1.6 Performance and perception
- [ ] A tap gets instant feedback.
- [ ] No large layout shift.
- [ ] Animation is smooth on the lowest target device.
- [ ] Skeleton/placeholder is close to the real structure.
- [ ] Images are compressed, cached and loaded at a fitting size.

---

## 2. Anti-patterns to avoid

- Pixel-copying the same UI for iOS and Android.
- A hamburger menu hiding the main navigation on a phone when there are only a few destinations.
- Several CTAs with the same emphasis.
- Modal after modal; a dialog holding a long form.
- Asking for every permission on first launch.
- Disabled controls with no explanation of the condition.
- Placeholder used as the label.
- A toast/snackbar for an important error that disappears too fast.
- Home-made pickers, share sheets, date/time or permission flows worse than the system's.
- Hard-coded colours, font sizes, spacing and corner radii on each screen.
- Shadows/elevation everywhere.
- Long animations that can't be interrupted or ignore Reduce Motion.
- Designing only the happy path.
- Testing only one phone model and one text size.
- Red/green as the only signal.
- Unlabelled icons for hard-to-guess concepts.
- Confirmation for every action, causing "alert blindness".
- Clearing form data on a network error.
- Adding white space without restructuring for large screens.
- Forcing sign-up before users understand the value, when the business doesn't require it.
- Dark patterns: misleading CTAs, hard-to-find opt-outs, fake urgency or hidden fees.

---

## 3. Review playbooks and Definition of Done

### 3.1 Reviewing a component
1. What need does the component solve?
2. Is there an equivalent native/Material component?
3. What are its anatomy and content rules?
4. Are all sizes/variants/states there?
5. Touch target and semantics?
6. Dynamic Type/font scale/RTL?
7. Light/dark/high contrast?
8. Keyboard/pointer/screen reader?
9. Motion/reduced motion?
10. Token and code mapping?
11. Visual regression tests?
12. Migration/versioning?

(Component system audit: `../design-system-audit/SKILL.md`.)

### 3.2 Reviewing a screen
- **Goal** — what does the user come here to do?
- **Hierarchy** — in the first 3 seconds, are the title, content and primary CTA seen?
- **Navigation** — do users know where they are, and where back/close go?
- **States** — loading, empty, error, offline, permission, signed-out?
- **Input** — keyboard, autofill, validation, save draft?
- **Adaptive** — compact/expanded, landscape, split-screen, fold?
- **Accessibility** — large text, contrast, reader, focus, target?
- **Privacy** — does it collect/show too much data?
- **Performance** — how does the first content appear, does the layout jump?

### 3.3 Reviewing a flow
- Complete entry points: app, deep link, widget, notification, shortcut.
- A short happy path that still keeps the information needed to decide.
- Alternate paths for missing data, permissions, network and account.
- A recovery path for every fixable error.
- A clearly confirmed exit state, never ambiguous.
- Resume after an interruption.
- Analytics measure outcomes, not just taps.

### 3.4 Definition of Ready for design
- [ ] Problem statement and user group are clear.
- [ ] Business rules and constraints are confirmed.
- [ ] Real or representative content/data is available.
- [ ] Platform/version/device scope is clear.
- [ ] Privacy, accessibility and legal risks are stated.
- [ ] A success metric and a rough test plan exist.

### 3.5 Definition of Done for design
- [ ] Happy/alternate/error/offline/empty/loading states.
- [ ] Responsive/adaptive specs.
- [ ] Light/dark/high contrast.
- [ ] Dynamic Type/font scale and RTL.
- [ ] Screen reader/focus/touch target.
- [ ] Content/localization spec.
- [ ] Motion/reduced motion.
- [ ] Native behaviour per platform.
- [ ] Token/component mapping.
- [ ] Prototype tested with users, or equivalent evidence.
- [ ] Handoff reviewed by engineering.

### 3.6 Definition of Done for the build
- [ ] Behaviour matches, not just screenshots.
- [ ] Tested on real lowest-target iOS/Android devices.
- [ ] Tested with large text, dark, high contrast, RTL.
- [ ] VoiceOver/TalkBack completes the main task.
- [ ] Keyboard/pointer if large screens are supported.
- [ ] Slow network/offline/server errors.
- [ ] Rotate/resize/background/restore.
- [ ] Performance budget met.
- [ ] Analytics, privacy and permissions correct.
- [ ] No S2/S3 usability issues left (S-scale: `heuristics-evaluation.md` §1.5; ≈ team scores 0–1).

### 3.7 Running a design critique
1. The presenter states the problem, users, constraints and the questions they want feedback on.
2. Reviewers first look through the flow silently, to capture their natural understanding.
3. Feedback ties to goals/principles/evidence, not just taste.
4. Classify: blocker, major, exploration, polish.
5. Record the decision, owner and follow-up.
6. Don't solve every detail by committee; the design owner is responsible for synthesis.

A good piece of feedback: "At 200 % text size the CTA is pushed out of the viewport and can't be scrolled to, so users can't finish.
Suggest moving the action into the scroll content, or a sticky area with keyboard/safe-area handling."

### 3.8 Keeping this knowledge current
- Review Apple HIG and Material 3 at each major OS/design-library release.
- Put a check date next to every number that changes easily.
- Keep a changelog of internal design-system decisions.
- Don't copy a component spec into many places; link the source of truth.
- When a guideline changes, assess the impact on tokens, components, templates and tests.
- Audit the real product periodically — the implementation drifts from the design file.
