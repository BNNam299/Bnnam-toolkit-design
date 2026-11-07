---
status: draft
approved: —
from: ux-review
based_on: flows.md@<YYYY-MM-DD> · voice.md@<YYYY-MM-DD> · figma@<YYYY-MM-DD>
by: claude-code
version: —                         # output version — "—" if none
level: —                           # short | standard | full — the depth actually done
---
# UX review — <Project name>

<!-- How to do it: references/review-methods.md. One entry per problem, LOWEST SCORE FIRST.
     Titles and proposals in plain words, in the user's language; criteria in their own field. The user picks which entries to fix.
     Save the filled file as design/review.md. -->

## Refinements

### <Problem — in plain words>
- screen: —                         # exact screen name
- criteria: —                       # component — sub-criterion: learnability — predictability · efficiency — feedback …
- caught by: —                      # 5 components · Nielsen #n · Shneiderman #n · walkthrough <task> step n question n
- score: —                          # 0 | 1 | 2 | 3 — 4 is fine and goes under "What works well"
- proposal: —
- fix in: —                         # flows.md · wireframe · voice.md · UI

## Adaptive

<!-- Only for adaptive projects (iOS 27 · iPhone Duo · iPad) — references/review-methods.md §11, ../iphone-duo-adaptive/SKILL.md -->

### <Screen family>
- variants present / missing: —     # adaptive-variant scan
- actions that differ between variants: —
- continuity: —                     # continuity scenarios walked: pass / fail — variant before → after, what is kept, what is lost
- control bar, overflow: —          # axis order, priority, titles complete
- condition combination causing the problem: —   # e.g. outer landscape + keyboard + AX text + Live Activity

## What works well

### <What works well — plain words>
- screen: —
- why keep it: —

## Scope and confidence
- screens read: —                   # n / total
- flows walked through: —           # task · assumed user
- methods used: —                   # e.g. 5 components · Nielsen · walkthrough <task> · Laws of UX — and what each found
- overall score: —                  # optional, references/review-methods.md §13 — preset, arithmetic
- usage data: no                    # no | yes — source
- check in build: —                 # items not checkable on a static design

## Needs testing with users

### <What to test>
- why: —                            # the agent is unsure | concerns satisfaction
