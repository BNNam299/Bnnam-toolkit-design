---
name: mobile-ux-fundamentals
description: Mobile interaction fundamentals with exact numbers - touch targets and spacing, every component and screen state (loading, empty, error, offline, disabled, success), feedback channels (inline, snackbar/toast, banner, alert/dialog, haptics), choosing sheet vs dialog vs full screen vs snackbar, thumb zone and reach, gestures and their visible alternatives, forms and keyboard, accessibility (contrast, Dynamic Type, VoiceOver/TalkBack, Reduce Motion), motion and haptics, behaviour psychology (BJ Fogg, Hooked) and AI-product UX. Use whenever a screen needs interaction decisions or states, even if the user only says "draw this screen" or "review this flow". Vietnamese triggers such as "trạng thái rỗng", "lỗi mạng hiển thị sao", "nút bấm nhỏ quá", "nên dùng sheet hay dialog", "cử chỉ vuốt", "toast hay alert", "accessibility", "chữ to thì vỡ layout", "vùng ngón cái". Layout and density go to mobile-ui-master, copy to ux-writing, the build loop to figma-ui-flow, a feature's screen list from a PRD to prd-to-ux-flow.
---

# mobile-ux-fundamentals — how a mobile screen behaves

This skill answers **"how should this behave, and what states must exist?"** — touch, states, feedback, overlays, gestures, forms,
accessibility, motion. It does not lay out the screen (`mobile-ui-master`), write the words (`ux-writing`) or run the build
(`figma-ui-flow` — its rule 7 "every state is drawn" relies on the state lists here). Exact platform wording lives in the verbatim
libraries `apple-hig` and `material-design-3`; this skill points into them.

## Need → Read
| Need | Read |
|---|---|
| Component states (pressed, focused, disabled…), screen states, feedback channels, durations, haptics | `references/states-feedback-motion.md` §5–7 |
| Motion purpose, iOS motion, M3 spring physics, performance | `references/states-feedback-motion.md` §1–4 |
| Interaction styles, menu and form rules | `references/interaction-patterns.md` §1 |
| UX patterns: onboarding, permission, loading/empty/offline, form, destructive + undo, notification, settings, auth, data viz | `references/interaction-patterns.md` §2 |
| Screen templates: list, list–detail, create/edit form, auth, checkout, settings, dashboard, media, chat, map, camera, empty, error | `references/interaction-patterns.md` §3 |
| Mobile app end to end: product, IA, ergonomics, forms, resilience, iOS vs Android, adaptive, testing, handoff, release | `references/interaction-patterns.md` §4 |
| Accessibility: targets, text size, contrast, screen reader, focus, motion/sound, checklist | `references/accessibility.md` §1 |
| UX research basics, persona, IA maps, usability, evaluation methods | `references/accessibility.md` Part B (§2–10) |
| Emotion, BJ Fogg B = M·A·T, Hooked | `references/behavior-psychology.md` |
| Laws of UX for laying out and checking a screen (Fitts, Hick, Jakob, Von Restorff, serial position, Miller, Tesler, Doherty, aesthetic–usability, peak–end, goal gradient, Gestalt) | `references/behavior-psychology.md` §9 |
| AI features: patterns, trust, conversation, errors, autonomy, evaluation | `references/ai-product.md` |
| Anti-patterns, Definition of Done | `../ux-review-handoff/references/acceptance-checklist.md` |
| Labels, error and empty-state copy | `../ux-writing/references/principles.md` |
| Exact Apple wording | `../apple-hig/references/` — `sheets.md`, `alerts.md`, `action-sheets.md`, `popovers.md`, `modality.md`, `gestures.md`, `feedback.md`, `loading.md`, `playing-haptics.md`, `accessibility.md` |
| Exact Material wording and numbers | `../material-design-3/references/` — `components__snackbar.md`, `components__dialogs.md`, `components__bottom-sheets.md`, `foundations__interaction__states.md`, `foundations__interaction__gestures.md`, `foundations__layout__grids-spacing.md` |
| iPhone Duo postures, fold/unfold motion, feedback matrix | `../iphone-duo-adaptive/SKILL.md` |

## Core rules
1. **Touch targets.** iOS/iPadOS **44 × 44 pt**, Android **48 × 48 dp** minimum — for the touch area, not the visible shape. Targets
   don't overlap; leave room: HIG ~**12 pt** around bezeled controls, ~**24 pt** around borderless ones; M3 ≥ **8 dp** between chips/targets.
   Density settings never shrink targets.
2. **Draw every state that applies.** Component: enabled, pressed (M3 state layer +10%), focused (+10%, visible unclipped ring), hover
   (+8%, never the only way to reveal something), dragged (+16%), selected (more than color), disabled (content opacity 0.38, still clearly
   different, reason discoverable), in-component loading (blocks double submit), error (text + icon, linked to the field). Screen: first
   load (skeleton/progress), refresh (keep old content), pagination, empty ×6 (first use, cleared, no results, filtered, permission-blocked,
   offline), inline/full-page/blocking error, offline, slow/timeout + retry (keep input), stale/partial, permission denied, session expired
   (keep drafts), success, undo, destructive confirm — plus long content, largest text and dark mode.
3. **Match the interruption to the significance.** Status → inline. Low-priority result or Undo → snackbar/toast (one at a time, ≤ 2 lines,
   ≤ 1 action, auto-dismiss **4–10 s** without action, above the FAB, never the only path to a core task). Persistent problem → banner /
   inline block (no alert for "no network" at launch — show cached data + a quiet label). Required decision or possible data loss →
   alert/dialog (HIG: ≤ 3 buttons, title ≤ 2 lines, specific verbs not OK/Yes/No, Cancel never default; M3: ≤ 2 actions, confirm on the
   trailing side). Confirm success only for significant actions (payments).
4. **Choose the overlay by the task:**
   - **Alert / dialog** — a short, critical decision; nothing else to do on it.
   - **Action sheet / menu** — choose one of several actions tied to what was tapped.
   - **Sheet (bottom sheet, partial detent)** — a focused sub-task that keeps the parent context (filters, a short form, details); dismissible
     by swipe; a sheet whose content becomes a multi-step task should become a full-screen push/modal.
   - **Full-screen modal** — a self-contained task with its own navigation (compose, onboarding, edit flow); always an explicit close/cancel.
   - **Push (navigation)** — drilling into content the user will navigate back from.
   - **Popover (iPad/large widths)** — transient options anchored to a control.
   Read `modality.md` / `sheets.md` (HIG) and `components__bottom-sheets.md` / `components__dialogs.md` (M3) for edge cases.
5. **Gestures always have a visible alternative.** Never hide an important action only behind a swipe, long-press or shake; show an
   affordance, and keep a button/menu path (also required for screen readers). Indicate when a gesture isn't available.
6. **Reach and the thumb zone.** One-handed use favours the lower part of the screen: put the primary action and frequent navigation
   there (tab bar, bottom CTA, FAB); keep destructive actions away from the primary thumb path and from the main CTA; top corners are the
   hardest to reach — use them for secondary/rare actions (back, close, settings). The primary action must not cover content or the
   keyboard; with the keyboard open, the field, its error and the CTA stay visible.
7. **Forms.** Label always visible (placeholder is not a label); right keyboard type, autofill, masks; validate at the right time (on
   blur/submit, not on every keystroke for format errors); group logically; Next/Done move through fields; allow going back to edit; keep
   input after errors.
8. **Accessibility is part of the design, not a pass at the end.** Contrast **4.5:1** normal text, **3:1** large/bold text (≥ 18 pt or bold)
   and non-text UI; never color alone; Dynamic Type / `sp` up to the largest supported sizes with reflow, never fixed-height text boxes;
   default body ~17 pt iOS, 11 pt absolute minimum; every control has name, role, state; logical reading/focus order; Reduce Motion keeps
   the information; nothing flashes > 3 times per second.
9. **Motion has a job** (relationship, continuity, acknowledgement, attention, progress, brand) and is interruptible; durations from tokens
   (M3: enter 250–400 ms, exit ~200 ms, large areas ~500 ms); haptics only for meaningful discrete events, never every tap, never the only
   channel.

## Workflow — adding behaviour to a screen
1. Read the screen's goal and primary action (from the brief or `figma-ui-flow` Pass 0).
2. List its component and screen states with rule 2; mark which need their own frame (`figma-ui-flow` From-template screens).
3. For each event, pick the feedback channel (rule 3) and any overlay (rule 4).
4. Check reach (rule 6), targets (rule 1), gestures (rule 5), forms (rule 7).
5. Run `references/accessibility.md` §1.8; fix before handoff.
6. Copy for states and errors → `ux-writing`.

## Common pitfalls
- Only the happy path drawn; empty/error/offline added late and inconsistent.
- Toast used for errors that need action, or an alert for a status that could sit inline.
- A sheet that grows into a three-step flow with its own back stack.
- Icon-only buttons with tiny hit areas; chips with no spacing.
- Swipe-to-delete as the only way to delete.
- Disabled primary button with no hint why.
- Text in fixed-height containers that clips at large sizes.

## Self-check before reporting
- Every interactive element ≥ 44 pt / 48 dp, non-overlapping.
- State list written and each state designed or explicitly marked as not applicable.
- Each feedback/overlay choice justified by rules 3–4.
- Accessibility checklist §1.8 passed; claims cite `apple-hig` / `material-design-3` sections where they come from there.
