# IDs, feature levels and versions

## 1. IDs
| Prefix | What | Lives in | Example |
|---|---|---|---|
| `BAN-01` | something forbidden in scope | prd.md §4 | BAN-01 · tài khoản người dùng |
| `PER-01` | persona | prd.md §5 | |
| `JTBD-01` | job the user hires the app for | prd.md §5 | |
| `FEAT-01` | feature | prd.md §10 | |
| `SCR-01` | screen (until the design toolkit names it; then use its name and keep the SCR as alias) | prd.md §11 | |
| `UC-001` + `AF-001.1` / `EX-001.1` | use case + alternative / exception flow | requirements §1 | |
| `FR-001` + `AC-001.1` | functional requirement + acceptance criterion | requirements §2 | |
| `NFR-01` · `BR-01` · `PRM-01` · `DATA-01` · `EVT-01` | quality · formula · permission · data · event | requirements §3–6 | |
| `DQ-01` | question for Dev | requirements §8 | |
| `D-01` · `R-01` | decision · incoming request | decisions.md | |
| `EXP-01` · `L-01` | experiment · learning from experiments | prd.md §8 / decisions.md | |
| `M#12` | evidence #12 in docs/market/evidence.md | read only | |
| `P#1` | new evidence found during product work | prd.md §15 | |

The same IDs are what the design toolkit (`prd-to-ux-flow` reads BAN, FR, UC) and the build toolkit (`/ios-spec` reads FR, UC)
look for — keep the prefixes exactly.

Rules: IDs never change, are never reused, never renumbered. A removed item stays with "(bỏ ở bản x.y.z — D-…)". Priority is P0 /
P1 / P2 only: P0 = the version fails without it; P1 = ships without it if forced; P2 = fast-follow.

## 2. Feature levels
| Level | Means | Set by | Must have |
|---|---|---|---|
| **Đề xuất** | accepted into a version, not specified | product-plan | source (M# / P# / R-), persona or job, priority, version |
| **Đủ để thiết kế** | a designer can draw it without guessing | product-spec | behaviour, numbered main flow, every unhappy branch with an exit, permissions with 3 branches, paywall / ad touchpoints, UC + FR draft, Dev questions sent |
| **Đủ để build** | Dev can build and QA can accept it | product-detail | screen rules table on real screens, other cases, events per screen, AC tied to screens, Dev feasibility answered |
| **Đã phát hành** | shipped in a version | product-plan (next version) | version number, date, metrics to watch |
| Hoãn / Bỏ | moved out | any step, with D-… | the decision and the reason |

A feature only moves up when everything in its row is true; otherwise it stays and the report says what is missing.

## 3. Versions
- Version numbers follow the team: `1.0.0` first release, `1.1.0` features or scenarios added, `1.0.1` fixes.
- prd.md §13 has one row per version: what it must prove, which FEATs, which metrics, date approved, status.
- Each step works on **one version at a time** and only touches FEATs of that version.

## 4. Changing what is already approved or shipped
1. Write the new decision `D-…` (who, date, what, why, what it touches, "thay cho D-…" if it replaces one).
2. Add a row to prd.md "Lịch sử tài liệu".
3. For a shipped feature: do not edit its block — add a row to its "Thay đổi ở các bản sau" table and, if the change is large, a new
   FEAT for the new behaviour in the new version.
4. For a feature at *Đủ để thiết kế* or *Đủ để build*: edit, then drop it back to the level whose requirements are no longer true
   (e.g. a new permission → back to *Đủ để thiết kế* until the design shows it).

## 5. Statuses in decisions.md
Request queue: `chờ xét` → `vào bản x.y.z (D-…)` or `bỏ (D-…)`. Nothing goes straight from a chat message into a version without a
request row and a decision.
