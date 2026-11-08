---
status: draft
approved: —
from: ux-flow
based_on: prd.md@<YYYY-MM-DD> · analysis.md@<YYYY-MM-DD>
by: claude-code
wireframe_approved: —               # write <date> only when the user says "approve wireframe"
ui_approved: —                      # write <date> when every batch is accepted and the user says "approve UI"
---
# Flows — <Project name>

<!-- THE SINGLE SOURCE OF SCREEN NAMES. Adding a screen = add it here first, then build it.
     Screen names: ../bnnam-standards/references/naming.md. How, trace, assumptions: references/ux-flow.md. -->

<!-- Large projects or maintenance in rounds: group by FEATURE — one heading "## Feature — <name>" per feature, keeping exactly
     "### <Flow>" and "### <Screen>" inside. Status reports count per feature. -->

## Flows

### <Flow name>
- sequence: <Screen> → <Screen> → <Screen>
- ui: not built                     # not built | building | awaiting acceptance | accepted <date>
- origin: —                         # maintenance projects: current state | added <date>
- click-through flow: —             # "<Flow name> Flow_Step 1 ← <source screen>" … — the copySource list from ../figma-prototype-flow/scripts/prototype.js
- adaptive: —                       # only when the adaptive level is not none — container · kept at every size · reveal / collapse / reflow / overflow · state kept across resize · posture
                                   #   written as CONDITIONS ('when the width fits primary + secondary → reveal split'), never by device name

## Screens

### <Screen-Path>_<State>
- purpose: —                        # one sentence, in terms of the user's job — ../mobile-ui-master/references/reading-screens.md §3
- screen type: —                    # MANDATORY — e.g. home, paywall, onboarding step, settings · no match → new type + description · detect: ../figma-project-maintain/scripts/situations.js
- main components: —                # e.g. tab bar, list rows, plan picker — the agent fills from situations.js, the designer corrects
- canonical name: —                 # ONLY maintenance projects whose frame names differ from the naming standard — a mapping; NEVER rename the designer's frames in Figma
- flow: —
- answers: —                        # FR-###, …
- serves: —                         # UC-###, …
- entered from: —                   # exact screen name
- leads to: —                       # exact screen name
- states in the same branch: —
- entry condition: —
- exit: —
- assumptions: —                    # A-##
- approved: —                       # maintenance projects: <date> the designer approved this screen — replaces the whole-file flag
- adaptive structure: —             # only when the adaptive level is not none — level <n> · detail of <screen> · pane role primary|detail|supplementary ·
                                   #   default selection <rule> · outer screen keeps <pane> — references/ux-flow.md §17
- notes: —

## Technical assumptions

### A-01 · <statement a developer must confirm>
- screen: —
- status: UNVERIFIED                # UNVERIFIED | VERIFIED | WRONG
- verified: —                       # who, date
