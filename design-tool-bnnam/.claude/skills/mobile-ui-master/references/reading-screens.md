# Reading screens — the base skill every job needs

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/screen-reading.md @ 3c0e291 — translated, complete

## Contents
1. The rule
2. Why
3. Reading one screen — answer all six questions
4. Reading a whole section, then the whole project
5. Write it down so you never re-read
6. Where it is used
7. Screen images

---

## 1. The rule

**Understand a project by reading every screen, one by one, in detail** — do not guess from screen names, and do not guess from the first few
screens. Prototype links and arrows on the canvas are **extra hints**; with or without them, you still read every screen.

Designs are always packaged in **sections**. Reading order: **section → row → left to right** — designers usually lay screens out in the order the
user walks through them.

Read each screen with **two things at the same time**:

| Input | Gives you |
|---|---|
| **The screen image** (screenshot) | layout, emphasis, what stands out, what is a button |
| **The outline** from `../figma-project-maintain/scripts/readscreen.js` | completeness: blocks top to bottom, text by role, buttons, inputs, choices, images, repeated lists |

Image without outline → you miss small text and buttons hidden in menus. Outline without image → you do not know what is primary.

Run `readscreen.js` through `execute_code`: read the script, set the config constants at its top, send the whole file as `code`
(`timeoutMs` up to ~120000 for big pages).

## 2. Why

The screen is the source of truth about **what the product actually is**. A screen name can be wrong (`Home screen` is really a search-results
screen), documents can be stale, a prototype can be wired incompletely. Only reading the screen tells you for sure.

**Evidence:** when an agent took over a project without reading carefully, it built new screens with the right flow names but the wrong jobs —
adding an error state to a screen that never calls the network; writing button copy that duplicated the meaning of a button on the neighbouring screen.

## 3. Reading one screen — answer all six questions

| # | Question | Taken from |
|---|---|---|
| 1 | **What is this screen for?** — one sentence, in terms of the user's job | title · main content · position in the section |
| 2 | **What does the user see first?** — the most prominent block | image |
| 3 | **What can be done here?** — every button, tab, input, choice, gesture | outline › actions, inputs, choices |
| 4 | **Where does each action lead?** — target screen name, with confidence | link / arrow if any · button copy matching another screen's title · the next screen in the same row |
| 5 | **Which state is this?** — empty, with data, loading, error, editing… | content · name suffix · sibling screens of the same family |
| 6 | **What is unclear?** | write it down to ask — do not fill the gap yourself |

Question 4 records **confidence**: *certain* (there is a link, an arrow, or the button copy matches the target screen's title) · *guess* (based
only on position). A guess must be asked about.

## 4. Reading a whole section, then the whole project

Only after reading every screen of a section, conclude about that section:

- **flow** — the chain of screens per question 4
- **screen family** — the states of the same screen (`_Empty`, `_Result`…), even when the project names them differently
- **gaps** — a screen with no way out · a screen no other screen leads to · an action leading to a screen that does not exist · a missing state

After every section → **restate the project in words** for the designer to confirm: which flows exist, where each flow starts and ends, where the
gaps are, where the agent guessed. Write `flows.md` only after the designer confirms.

## 5. Write it down so you never re-read

Record the reading in `flows.md`. Per screen:

```markdown
### <Flow / Screen_State>
- purpose: <answer to question 1>
- entered from: <screen(s)>
- leads to: <action> → <screen> (certain | guess)
- state: <answer to question 5>
- unclear: <question 6, if any>
```

The next session reads `flows.md` instead of re-reading the whole file — re-read only screens that **have changed** or screens you are **about to
touch**.

Large project: read the **section needed for the current job** first, carefully; skim the rest by outline only and mark it *"skimmed"* — read it
carefully when its turn comes.

## 6. Where it is used

| Job | Read screens to |
|---|---|
| Taking over a project for the first time | understand the project — **every section** (`../figma-project-maintain/SKILL.md`) |
| Fixing a screen, learning from a designer's fix | read the original screen and its `_Fix` / `_Fix AI` versions before editing, before asking why |
| Building screens | visual check at the end of a pass/batch — read the screen you just built as a stranger would (`../figma-ui-flow/references/build-loop.md`) |
| UX review | walk each flow — read each screen in exactly the order the user walks (`../ux-review-handoff/SKILL.md`) |
| Handoff | know which screen needs which note |
| Competitor analysis | competitor screenshots — the same six questions, without an outline (image only) |

## 7. Screen images

Take the image with the screenshot tool of whichever Figma MCP is in use: `screenshot` in figma-agent (`../figma-agent-tools/SKILL.md`), or the
remote Figma MCP's screenshot tool (`../figma-ui-flow/references/remote-figma-mcp.md`). If no image can be obtained → read from the outline and
report *"image not viewed — visual emphasis may be missed"*.
