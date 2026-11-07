# Experience goals, emotion and behavior (BJ Fogg, Hooked)

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/behavior.md @ 3c0e291 — translated, complete

Use when wireframing onboarding, CTAs and engagement loops, and when writing UX copy (`../ux-writing/references/principles.md`).
Ethics line: these models explain behavior; never use them to build dark patterns (see `ai-product.md` §3 Governors and
`../ux-review-handoff/references/acceptance-checklist.md` anti-patterns).

## 1. UX = perception and response

UX is a person's perceptions and responses (ISO 9241-210) — every emotion, belief and behavior **before, during and after** use.

## 2. Mood and decisions

A positive mood → faster decisions; a negative mood → slower decisions, **driven by habit, reluctant to try anything new**.
Implication: stressful moments (errors, payment, waiting) are the worst time to introduce a new pattern.

## 3. Four sources of emotion

| Source | Meaning |
|---|---|
| Physical | The senses — an ugly design is taken for a counterfeit product |
| Social | Connection with a community |
| Psychological | Conquering levels, leaderboards, keeping a streak |
| Conscious (values) | Core values, the brand — takes a long time; users who love it forgive bugs and advertise it themselves |

## 4. Three levels of emotion

1. **Immediate** — easy to achieve, short-lived.
2. **Thinking about the future.**
3. **Future + remembering the past** — the longest-lasting.

## 5. "Scratch where it itches"

Find the pain point and offer a **painkiller** — it solves one level; other pains come back later (so the product keeps evolving, see §8).

## 6. BJ Fogg: B = M · A · T at the same moment

Behavior happens only when **Motivation, Ability and a Trigger** are present at the same time; missing one, it does not happen.
Example — a phone call: no ring = missing trigger; unknown number = missing motivation; driving = missing ability.

**Ability is limited by:** time · money · physical effort · mental effort · social fit · fit with routine.

**Motivation — three pairs:** pleasure / avoiding pain · hope / fear · acceptance / rejection.

**External trigger — choose by motivation × ability:**

| Motivation | Ability | Trigger type | Looks like |
|---|---|---|---|
| Low | Easy | **Spark** | "Tap here, it's easy" |
| High | Hard | **Facilitator** | Concrete step-by-step guidance |
| High | Easy | **Signal** | Just a reminder or a button; people may even find it themselves |

**Internal trigger:** fires in the head once a habit has formed — very hard to achieve.

**Prioritise increasing Ability (simplify).** Motivation is very hard to push up; you can only understand it.

## 7. Hooked model

1. **Trigger** — internal: what they truly want · external: value they can see.
2. **Action** — simple (usability).
3. **Variable reward** —
   - *Tribe:* upvotes, badges.
   - *Hunt:* the Pinterest pin store (endless finds).
   - *Self:* Duolingo streak, leaderboard.
4. **Investment** — accumulated content, data, follows, reputation, skills → a reason to come back.

## 8. The chain

Find the problem → solve the problem → raise the quality (the long-term core value).

## 9. Laws of UX — for building a screen and checking it

> Source: Laws of UX (Jon Yablonski, lawsofux.com) and the Gestalt principles of perception; added 08/11/2026 at the team's request.

Use while laying out a screen and again in review; name the law in the review entry ("caught by: Fitts").
| Law | What it means on a phone screen | Check |
|---|---|---|
| **Fitts** | time to hit a target grows with distance and shrinks with size | the primary action is large and in the thumb zone; destructive actions are not next to it |
| **Hick** | more choices, slower decisions | one primary action per screen; long option lists are grouped or progressively disclosed |
| **Jakob** | users spend most of their time in other apps and expect yours to work the same | platform patterns (tab bar, back, share sheet, pull to refresh) are not reinvented |
| **Von Restorff** (isolation) | the item that differs is the one remembered | only one element stands out — the primary action or the key number; two "special" items cancel each other |
| **Serial position** | first and last items in a list are remembered best | the most important items sit at the start and end of lists and tab bars |
| **Miller** (chunking) | people hold a few chunks at a time | long numbers, codes and forms are split into groups; steps show progress |
| **Tesler** (conservation of complexity) | complexity cannot vanish, only move | the app absorbs it (defaults, smart suggestions) instead of pushing it to the user — but never hides choices the user must make |
| **Doherty** | under ~400 ms the user stays in flow | every tap gets feedback within 400 ms; longer work shows progress (`states-feedback-motion.md`) |
| **Aesthetic–usability** | attractive designs are perceived as easier and forgive small flaws | in review, do not let polish hide a usability problem; test the flow, not the look |
| **Peak–end** | an experience is judged by its peak and its end | the success moment is designed with care; a session never ends on an error, a wall or an ad |
| **Goal gradient** | effort increases as people near a goal | show progress in onboarding and multi-step tasks; a head start ("1/4 xong") helps |
| **Gestalt — proximity, similarity, common region, continuity** | things close, alike or inside the same container read as one group | spacing and containers match the real grouping; unrelated items are not boxed together |
