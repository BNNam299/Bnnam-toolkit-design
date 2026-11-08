# Ergonomics, motion when the posture changes, and input parity

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/ios-27-iphone-duo-ux-ui-knowledge.md §29, §30, §31 @ 3c0e291 — translated, complete

Labels `[A]` / `[C]` / `[T]` as defined in [duo-foundations.md](duo-foundations.md). Sources: [Motion](../apple-hig/references/motion.md), [Gestures](../apple-hig/references/gestures.md), [Keyboards](../apple-hig/references/keyboards.md), [Focus and selection](../apple-hig/references/focus-and-selection.md), [Pointing devices](../apple-hig/references/pointing-devices.md) (verbatim HIG), Reduced Motion evaluation criteria (App Store Connect).

## Contents
1. Ergonomics, handedness and occluded areas
   1.1 Five zones to check · 1.2 Posture matrix · 1.3 Left and right hand · 1.4 Spacing and targets · 1.5 Ergonomics test protocol
2. Motion and transitions when the posture changes
   2.1 Four kinds of motion · 2.2 Reflow on fold / resize · 2.3 Interruptible and reversible · 2.4 Reduce Motion · 2.5 Motion specification template
3. Input system and action parity
   3.1 Intent first, input second · 3.2 Input parity matrix · 3.3 Gesture arbitration · 3.4 Keyboard focus when the layout changes · 3.5 Deduplication and race conditions

---

## 1. Ergonomics, handedness and occluded areas `[T]`

iPhone Duo changes how it is held in every pose. "The control is inside the safe area" does **not** mean the user can reach or see it while their hand holds the device.

### 1.1 Five zones to check

1. **Reach zone** — what the thumb reaches without a risky grip change.
2. **Occlusion zone** — what the finger / hand covers while operating.
3. **Support zone** — where a hand or the table supports the device; never ask for repeated taps there.
4. **Instability zone** — a hard tap may shake or tip a device in tabletop / tent.
5. **System-edge zone** — home gesture, back gesture, Camera Control and physical buttons can conflict.

### 1.2 Posture matrix

| Posture | Risk | Rule |
|---|---|---|
| Outer, one hand | far edge from the thumb; hand covers the preview; easy to hit the system edge | primary action inside reach; rarely used utilities go into a menu; the preview subject never depends on the area the hand covers |
| Inner fully open, two hands | large canvas makes controls drift far; many hand changes | place controls next to the content they own, or split into rails; do not pile every action into one corner |
| Book | one hand holds one "page", the other operates; the spine hides / distorts | no controls on the spine; try the primary pane both left and right; never assume a right-hand grip |
| Tabletop / laptop | lower half is the touch surface, but tapping can shake the device | large targets, wide spacing, sliders that need little precision; strong actions also have a remote / hardware path |
| Tent / standing | the screen is far from the hand | glanceable text / status; remote input; on-screen fallback when the user comes close |
| Split View | controls on the app's edge can conflict with the divider / system gestures | keep padding / hit slop; test the app in both the left and the right half |

### 1.3 Left and right hand

- "On the right" does not mean "easy to reach" for everyone.
- The Duo vertical bar is tied to the hardware; arrange content around it, but do not duplicate the whole bar to serve handedness.
- A custom capture control may let the user choose its position when the benefit is clear and hierarchy stays intact; by default it must work with either hand.
- Test camera use with the index finger near Camera Control, the thumb on the on-screen UI, and both left / right landscape grips.
- When the grip changes during open / fold, debounce accidental taps and never let a dangerous control appear exactly where a finger is resting.

### 1.4 Spacing and targets

- Hit region at least **44 × 44 pt**, small icons included.
- Separate dangerous actions from frequent ones; Stop / Delete never sit right next to Flip / Next when a mis-tap has serious consequences.
- A slider in the lower half needs enough length and a margin from the edge; provide value text and an alternative step control for precision.
- Never put a small text link or the only drag handle right next to the fold / curve.
- In camera use, strong haptics can shake the device or affect camera / microphone; keep feedback short and deliberate.

### 1.5 Ergonomics test protocol

Run every main task at least with: left hand, right hand, two hands, tabletop on a hard surface, tabletop on a soft surface, tent at a distance, and Split View on both sides. Record grip changes, covered actions, hand travel, accidental touches and device shake. Screenshots cannot find this class of bug — it needs a video of the interaction or observation on a real device.

## 2. Motion and transitions when the posture changes `[A]` / `[T]`

Motion helps the user follow the relationship between the old and the new state; it must never hide lost state.

### 2.1 Four kinds of motion

| Kind | Purpose | Duo example |
|---|---|---|
| Feedback | confirm input / result | press state, shutter, save complete |
| Continuity | show the same object changing place | the selected item moves from full screen into the detail pane |
| Hierarchy | explain a layer opening / closing | sheet, popover, inspector |
| Decorative | add character | ambient background, subtle glass response |

Decorative motion is the first to reduce or remove. Feedback and hierarchy still need an equivalent meaning when Reduce Motion is on.

### 2.2 Reflow on fold / resize

- Animate the smallest group that explains the change; never send the whole screen flying at once.
- Keep object identity: the selected card, the playing video, the draft field and the capture preview do not crossfade into an unrelated copy when they can morph / reparent visibly.
- Controls with the same semantic action keep their label / icon and relative position; if they must move far, use a short, trackable movement.
- Do not wait for the hinge to reach a fixed angle and then "explode" into another layout. Geometry / container state decides the arrangement; animation follows the continuum but does not rerun on every tiny change.
- Preview / video / camera keep a stable frame; chrome may reflow around them.

### 2.3 Interruptible and reversible

The user may open and close again before the animation ends. A transition must:
- start from the current presentation, never snap back to the old state;
- reverse or continue to the new state without duplicating views;
- never block taps / capture while waiting for an animation;
- keep the operation, focus, scroll and selection;
- never replay success feedback / haptics because the transition restarted.

### 2.4 Reduce Motion

Do not simply turn every animation off. Where motion conveys hierarchy or a result, replace it with:
- a short dissolve;
- highlight / fade;
- a colour / shape change;
- a crossfade over a small area;
- an immediate update with a suitable haptic / announcement.

Reduce or remove parallax, full-screen zoom, animated blur, simulated depth, oscillation and large movement across the fold. Motion is never the only signal for a camera switch, an upload finishing or a new pane appearing.

### 2.5 Motion specification template

| Property | What to write |
|---|---|
| Trigger | resize, pose change, selection, system overlay, user gesture |
| Source / target | which object keeps its identity; old / new container |
| Properties | position, size, opacity, axis, material |
| Duration / easing | system default or custom — and why |
| Interruption | reaction to reverse, further resize or app going to background |
| Input during motion | which actions are still accepted; how double actions are prevented |
| Reduce Motion | alternative without large movement |
| Accessibility | when focus / announcement happen |

There is no need to hand off a duration for every system component — prefer system motion. Fix a custom duration only once a prototype and real-device performance prove it fits.

## 3. Input system and action parity `[A]` / `[T]`

### 3.1 Intent first, input second

Components should not define separate logic per device. Define semantic intents such as `save`, `startRecording`, `deleteSelection`, `moveItem`; tap, keyboard, VoiceOver, Camera Control or a remote all send into the same intent handler, so state and feedback never drift between input paths.

### 3.2 Input parity matrix

| Intent | Touch | Keyboard / focus | Accessibility | Hardware / remote |
|---|---|---|---|---|
| Activate primary action | tap the button | Return/Space or a suitable shortcut | VoiceOver / Voice Control / Switch | if the capability exists |
| Dismiss / Back | system gesture + visible control | Escape / Command convention where it fits | accessibility escape / action | never repurpose physical buttons arbitrarily |
| Adjust a continuous value | drag a slider | arrows / steps | adjustable action + value | Camera Control / remote in the right context |
| Reorder / move | drag | command / menu alternative | Move Up / Down custom actions | not required |
| Capture | tap the shutter | shortcut if the app publishes one | named action | Camera Control / volume / Action / AirPods |

Not every input is mandatory in every app, but every core task has at least one direct path and one alternative that does not depend on a complex gesture.

### 3.3 Gesture arbitration

- Never change the meaning of familiar tap, swipe, drag, pinch.
- Edge gestures on the left / right yield to system navigation and the Split View divider.
- A drag across the folding region needs continuous feedback; if the drop target in the other pane collapses midway, keep the item at its source or finish by a clear rule — never lose data.
- Long press only opens secondary / contextual actions; it never hides the only primary action.
- Camera pinch-zoom stays in sync with the slider and Camera Control; the next input continues from the current value.
- A gesture cancelled by fold / background / a system overlay rolls back its preview state or commits at a clear point.

### 3.4 Keyboard focus when the layout changes

- The field being edited keeps its text, selection, marked text and focus across compact / regular when the field still exists.
- If the field moves to another pane, the keyboard must not dismiss / reopen and make the layout jump without need.
- Directional focus follows the new visual / semantic order; it never jumps across the folding region to an unreasonably far node.
- The focus ring / appearance is visible on glass, preview and moving backgrounds.
- Never override system shortcuts. Custom shortcuts appear in the menu / help and follow platform convention.

### 3.5 Deduplication and race conditions

Two inputs can arrive close together: shutter tap + volume, AirPods + Camera Control, keyboard Save + toolbar Save. The intent layer needs an operation token / debounce so one action runs once. Disabled state, haptics, sound and announcements all read from the same result; no input fires its own independent feedback. Feedback rules: [duo-states-feedback.md](duo-states-feedback.md) §7–10.
