---
name: product-users
description: Step 2 of the product toolkit - who the product is for, grounded in evidence. Builds personas from behaviour (with the 6 quality criteria, proto-personas clearly labelled), jobs to be done ("Khi … tôi muốn … để …"), who is NOT a user, the current vs desired journey with break points, and the aha moment with the shortest path in steps; fills prd.md §5. Uses market evidence (store reviews, forums) and any interview, survey or analytics data in docs/product/raw/, and plans a light check (1–2 direct questions, post-launch data) when no real user data exists. Use after product-kickoff, when new user research arrives, or whenever the user asks for personas, JTBD, a user journey, an empathy map, the aha moment or "who exactly is this for". Vietnamese triggers such as "persona", "chân dung người dùng", "hành trình người dùng", "việc người dùng cần làm", "aha moment", "khoảnh khắc thấy app có ích", "ai là người dùng".
---

# product-users — step 2: who exactly, doing what, breaking where

Personas invented in a meeting room steer the whole product the wrong way and are hard to notice later. This step builds them only
from what users actually said or did, says plainly when that evidence is thin, and pins down the one moment the product must reach
quickly — the aha moment — because onboarding, paywall placement and activation metrics all hang on it.

**Read first:** `../product-standards/SKILL.md`.

## Need → Read
| Need | Read |
|---|---|
| Sorting evidence into groups, insight vs observation, 5 Whys, fishbone, Lotus Blossom, POV, How Might We | `references/users.md` §1 |
| Six kinds of users and their importance, mental model table | `references/users.md` §2–3 |
| JTBD format and job types | `references/users.md` §2 |
| Empathy map, persona criteria, proto-personas, who is not a user | `references/users.md` §3 |
| Journey stages, break points, motivation and business rows, kinds of journey maps, aha moment | `references/users.md` §4 |
| Choosing a research method, five requirement types, did vs says, confidence, how this small team checks personas (reviews, 1–2 direct questions, post-launch data), activation | `references/users.md` §5 |
| Inputs and the missing-data rule | `../product-standards/references/inputs-and-handoffs.md` §1–3 |

## Workflow
1. **Check inputs.** prd.md §2–4 exist; pains with evidence in `docs/market/` or research data in `docs/product/raw/`. Missing →
   say it and ask before writing (inputs-and-handoffs §2).
2. **Group the evidence** (`references/users.md` §1): pains, workarounds, triggers, what users praise. Count independent sources.
3. **Write jobs**, then an **empathy map** per primary persona, then **personas** from the map and a **mental model** table, then **who is not a user**, then the **journey** and **aha moment**.
4. **Fill prd.md §5**; add new evidence found here as `P#…` in §15; add validation work to §14 if personas are proto.
5. **Report**: personas (data-based or proto), main job, aha moment and its step count, what would change the picture, next step
   `product-plan`. Stop.

## Core rules
- **Every behavioural detail has a source** (`M#…`, `P#…`). Nothing added to make the persona vivid.
- **Personas differ by need or context, not age.** Two personas that would get the same design are one persona.
- **Proto is labelled.** Built only from reviews / forums → "GIẢ ĐỊNH (proto)" + a check the team can do: 5–7 questions for the next
  1–2 people the lead can ask, and which post-launch number would confirm or break it (`references/users.md` §5).
- **Needs are outcomes, not features**: "hạ căng trong 2 phút mà không phải chọn" — not "cần tính năng nhắc nhở".
- **The aha moment is an action**, observable and countable ("hoàn thành bài thở đầu tiên"), with the shortest path in steps from
  first launch.

## Self-check before reporting
- An empathy map per primary persona, every cell sourced; 1–3 personas, each passing the 6 criteria or labelled proto; "ai không phải người dùng" not empty.
- Every JTBD in "Khi … tôi muốn … để …" form with evidence; ≥ 1 emotional or social job.
- Journey covers 5 stages including "Quay lại", with break points marked and the desired change per break.
- Aha moment written as an action with a step count; §0 updated; next step named.
