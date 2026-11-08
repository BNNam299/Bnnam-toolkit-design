---
status: draft
approved: —
from: voice
based_on: prd.md@<YYYY-MM-DD> · analysis.md@<YYYY-MM-DD> · style.md@<YYYY-MM-DD>
by: claude-code
version: —                         # output version — "—" if none
level: —                           # short | standard | full — the depth actually done
---
# Voice & tone — <Project name>

<!-- How to fill it: references/voice-and-tone.md. Copy rules on screens: references/principles.md.
     Save the filled file as design/voice.md — the single source of truth for the project's words.
     Sample sentences are written in the interface language (e.g. Vietnamese). -->

## Product voice — fixed

### Voice chart — 3–4 attributes, each with visible writing behaviour
| Attribute | We are… | We are not… | Shown by… |
|---|---|---|---|
| <attribute> | … | … | … |

### Position on the four tone dimensions (NN/g)
- funny ←→ serious: <point>
- formal ←→ casual: <point>
- respectful ←→ irreverent: <point>
- enthusiastic ←→ matter-of-fact: <point>

- form of address: <bạn / quý khách / dropped subject> — does not change per screen

## Tone by situation — varies
| Situation | Tone | Sample sentence |
|---|---|---|
| Onboarding | eager, short | … |
| Empty state | invites the first task | … |
| Success | warm, not showy | … |
| Fixable error | calm, specific, supportive — **no jokes, no blame** | … |
| Lost data / money | serious, transparent — **no emoji, no showy brand voice** | … |
| Safety warning | direct, action first | … |
| User-caused error | **don't blame**, show how to fix | … |
| System-caused error | **own the error**, say how it will be fixed | … |
| Paywall | clear value, **no pressure** | … |
| Delete, cancel | composed, consequences stated clearly | … |
| Reminder, notification | short, a reason to tap | … |

## Copy rules
- capitalization: <Sentence case / Title Case> — pick one
- buttons: <verb first> · at most <n> characters
- title: <4–6> words · subtitle: <8–12> words              ← from the measured competitor rhythm
- numbers, dates, times, units: <format>
- punctuation: <period at the end of labels or not, when to use an exclamation mark>
- emoji: <yes/no, where>
- interface language: <…> · dev-note language: <…>

## Forbidden words
- <promises the product can't keep>
- <empty marketing words>
- <words claiming what the app can't measure>

## Inconsistencies

<!-- Maintenance projects: places where the project contradicts itself (found with scripts/textdump.js).
     The designer picks one — NEW copy follows the choice, old screens are left alone. -->

### <Inconsistency — e.g. button capitalization>
- current: —                        # "Thêm bữa ăn" (12 buttons) · "Xem Tất Cả" (4 buttons)
- designer chose: —

## Terminology — one concept, one word

### <Concept>
- meaning: —
- don't use: —
- reason: —
