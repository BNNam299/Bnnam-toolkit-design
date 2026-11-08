# Thinking toolbox — frameworks to reach for, and how to mix them

Each step has its own methods (personas, JTBD, RICE / Kano / story map, flows, walkthrough…). This file is the wider toolbox: when a
step's method leaves the question open, pick a tool by the **kind of problem**; when one tool leaves a gap, add the one under "ghép
với". Name every tool actually used (`writing.md` §7). Tools serve thinking — results go into the step's own sections in a few lines,
not as a pasted canvas.

## Contents
1. Frame the goal and the problem
2. Find the cause
3. Generate options
4. Choose and prioritise
5. Risk and assumptions
6. Value and behaviour fit
7. Measure and learn
8. Mixing rules

## 1. Frame the goal and the problem
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Opportunity Solution Tree (Torres)** | many feature ideas, unclear which serve the goal | top: one outcome (a metric) → opportunities (user pains / needs from evidence) → solutions per opportunity → the smallest test per solution. A solution with no opportunity above it is dropped | story map, RICE |
| **Impact mapping (Adzic)** | a version goal must turn into features | Why (goal, measurable) → Who (actors who can help or block) → How (behaviour change of each actor) → What (features that cause that change). Features justify a behaviour change, not a wish list | proof sentence, HEART |
| **OKR for a version** | the team needs one shared target | one objective in plain words + 2–4 measurable key results; KRs are outcomes (D7, aha reach), never outputs (screens built) | metrics draft, §13 |
| **How Might We / POV** | the team argues about solutions | restate as "Làm sao để <ai> <đạt gì> khi <hoàn cảnh>?" — opens several directions | users.md §1 |

## 2. Find the cause
5 Whys, Kipling questions, Fishbone and Lotus Blossom are described in `product-users/references/users.md` §1. Add:
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Pareto 80/20** | many reviews, bugs or requests | count by cluster; the few clusters holding ~80% are the ones to act on | request queue, review mining |
| **Forces of progress (JTBD)** | users try the app but do not switch, or churn in week 1 | push (pain of today) + pull (attraction of the new) vs anxiety (fear of the new: price, data, effort) + habit (comfort of today). Onboarding and paywall copy must lower anxiety and habit, not only shout pull | onboarding outline, paywall |

## 3. Generate options
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **SCAMPER** | stuck with one obvious solution | Substitute · Combine · Adapt · Modify · Put to another use · Eliminate · Reverse — one idea per letter, then filter | three lenses (plan.md) |
| **Inversion** | the plan looks too smooth | "điều gì chắc chắn làm người dùng bỏ app?" — make sure the spec does none of it | pre-mortem |
| **MVP types** | the first version is too big | concierge (do it by hand behind the screen) · Wizard of Oz (looks automatic, a person runs it) · single-feature · piecemeal (stitch existing services). Pick the cheapest that tests the riskiest assumption; Dev confirms feasibility | assumption mapping |

## 4. Choose and prioritise
RICE, ICE, Kano, WSJF, MoSCoW, opportunity canvas, impact – effort, story map and the three lenses are in
`product-plan/references/plan.md` §6. Add:
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Cost of delay** | arguing what goes first | what we lose per week of waiting: value now vs value that decays (seasonal, competitor moving) vs risk reduced / unblocked work. Highest cost of delay ÷ size goes first (= WSJF) | WSJF |
| **Urgent × important (Eisenhower)** | triaging the request queue | urgent + important → this cycle (crash, store rejection, policy) · important not urgent → next version plan · urgent not important → a small fix or no · neither → close with a reason | release-cycle rule |
| **One-way / two-way door** | a decision feels heavy | reversible (a copy, a config value — decide fast, test) vs hard to undo (platform, data model, pricing promise, positioning — decide with the team, record D-) | config table, decisions.md |

## 5. Risk and assumptions
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Assumption mapping** | many "giả định" in §14 | each: importance (if wrong, does the version fail?) × evidence we have. High importance + low evidence = the riskiest assumption → test it first (spec, Dev question, soft launch gate) | risk score 5×5, MVP types |
| **Pre-mortem** | at kick-off, before the scope is final | "bản này ra mắt và thất bại — vì sao?" each person lists reasons; the ones not yet covered become risks with an owner, or a cut | plan.md §6 risk score |
| **Harm question** | wellbeing, money, kids, data | "có thể gây hại cho <ai> nếu <điều gì>?" — answered per FEAT (plan.md hypothesis) | gate 0 |

## 6. Value and behaviour fit
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **Value Proposition Canvas** | checking a version fits the persona | jobs · pains · gains (from §5) ↔ pain relievers · gain creators · FEATs. Each top pain has a reliever; a FEAT that relieves nothing is a cut candidate | JTBD, feature table |
| **B=MAT, Hooked** | users do not act, or do not come back | in `product-spec/references/spec.md` §2 and `product-plan/references/plan.md` §8 | forces of progress |
| **Peak-end rule** | designing a session or onboarding | people judge an experience by its best moment and its end — end the first session on a success, never on a paywall wall or an error | onboarding rules |

## 7. Measure and learn
| Tool | Use when | How (short) | Ghép với |
|---|---|---|---|
| **North Star tree** | metrics feel disconnected | North Star at the top → the 3–5 input metrics that drive it → the FEATs that move each input | metrics-draft §1, OST |
| **HEART + goal → signal → metric** | an experience version | in `metrics-draft.md` §2b | AARRR funnel §2c |
| **Build → measure → learn** | after every release | what we believed · what we measured · what we learned (L-…) · what we change; a learning needs more than one result | lessons log, plan.md §8 |

## 8. Mixing rules — when one tool is not enough
| The tool you used | What it leaves open | Add |
|---|---|---|
| Personas | why users act differently from what they say | forces of progress, empathy map Nói vs Làm |
| RICE | strategy (a high score can serve the wrong goal) | strategy gate, OST / impact mapping |
| Kano | how much to build of each kind | RICE / cost of delay for order |
| Story map | which slice is riskiest | assumption mapping, MVP types |
| Text flows | whether a first-time user gets through | cognitive walkthrough (spec.md §3) |
| A/B test result | why it won or lost | review reading, 1–2 direct questions, forces of progress |
| Metrics dip | the cause | B=MAT order (plan.md §8), 5 Whys on the funnel step that dropped |

If two tools disagree, report both and name the dimension causing it; do not average them away.
