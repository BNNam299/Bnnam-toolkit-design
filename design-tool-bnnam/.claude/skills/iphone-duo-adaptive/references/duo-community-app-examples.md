# iPhone Duo real-app examples (community UI kit): pane splits and vertical-bar grouping per app

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/figma-iphone-duo-uikit.md §1–7 (images `community-figma-adaptive/example-*`, `examples-all-transformations`) @ 3c0e291 — translated, complete

**Community source, not Apple.** *iPhone Duo · iOS 27 UI Kit (Community)* — Figma `3ZoxuuWeqQMn2lP2sXGxZ6`, page `Examples` (20 frames: 10 outer / inner pairs of Notes, Mail, Music, Maps / Safari in Split View, Slack, Netflix; each in Light and Dark), and the same set on page `Some Ex` of *Iphone Duo Doc* (`vLsfIhagZDtzNEikq0qxwp`, node `1:6673`). Use it as **evidence of how real apps lay out on Duo**. The rules come from Apple: `duo-components.md` (vertical bars, overflow, Split View), `duo-layout-transformation.md` (split view, screen types) and the Apple Figma kit `../apple-design-iphone/references/ios27-figma-kit.md` — **when they differ, Apple wins.** Everything needed is in this file; do not reconnect to the Figma files during project work.

## Contents
1. Repeating frame structure
2. Two panes per app — ratio follows content, not 50 / 50
3. Split View with two apps — Maps / Safari
4. Components used
5. Frame names in this kit are reversed
6. Vertical bar per app — outer ↔ inner (with wireframes)
7. Rules for grouping buttons on the vertical bar

---

## 1. Repeating frame structure

```text
<App> - <Screen>                      FRAME 951 × 669 (inner) · 466 × 678 (outer)
├─ Container                          size = frame
│  ├─ Leading pane                    list / navigation (inner only — except media apps)
│  ├─ Trailing pane                   detail / content
│  └─ Pane controls                   INSTANCE 84 × 669 — VERTICAL control bar on the hardware edge (slot `Controls`)
└─ Bezel                              INSTANCE — device body (1031 × 749 inner · 524 × 730 outer)
```

**Content width = frame width − 84** (the `Pane controls` bar): outer **382** for one pane · inner **867** split into two panes.

## 2. Two panes per app — ratio follows content

| App | Outer (one pane, 382) | Inner: leading / trailing | Notes |
|---|---|---|---|
| Notes | **trailing** (the open note) | 340 / 527 | narrow list, wide content |
| Mail | **trailing** (the message being read) | 402 / 465 | leading has a 143 toolbar + `Toolbar - Bottom - iPhone` |
| Slack | **trailing** (the conversation) | 380 / 487 | `Scroll Edge Effect - Soft` under the header · 46 action bar |
| Music | **leading** (now playing) | **508 / 359** | media is the main content → media pane is wider · `Button Group` 690 × 48 runs across both panes on inner, 297 × 48 on outer |
| Netflix | (one content block) | (one content block) | full-bleed video — no pane split |

**Continuity evidence** (Apple rule: `duo-layout-transformation.md` §9, §12; `duo-foundations.md` §3): the outer display **keeps the pane the person is working in** — reading a message → the outer display shows the message; listening to music → the player — never back to the list.

## 3. Split View with two apps — Maps / Safari

`Container` 470 · **`Grabber` 3 × 46** · `Container` 470. The right-hand app has `Pane controls` 84 on the **outer edge of its own area** (its trailing pane is left with 385) — as in `duo-components.md` §9. One variant shows a **sheet covering only that app's half** (`Sheet - iPhone / Detent` 470 × 669): a presentation belongs to its scene, never to the whole inner display.

## 4. Components used

`Pane controls` (18) · slots `Buttons` (32), `Controls` (18), `Leading` / `Trailing` (6), `Tabs` (4) · `_Tab Bar Button - iPhone` · `Tab Bar` · `Status bar` (18) · `Liquid Glass - Regular - Small` (12) · `Button - Content Area` (12) · `Toolbar` · `Toolbar - Bottom - iPhone` (inside the leading pane) · `Button Group` · `Scroll Edge Effect - Soft` · `Grabber` · `_Separator` · `Contents - Trailing` · `Bezel`.

The kit uses **slots** for the number of buttons / tabs — matching the Apple kit 27.0.0 change log (`../apple-design-iphone/references/ios27-figma-kit.md` §7).

## 5. Frame names in this kit are reversed

This kit names **466 × 678** *"Outer Closed **Landscape**"* and **951 × 669** *"Inner Open **Portrait**"* — the opposite of Apple's kit (466 × 678 = Outer **Portrait**, 951 × 669 = Inner **Landscape**). Follow **Apple's names**; when reading this kit, map by **size**, not by the word in the name. Below, "outer" = 466 × 678, "inner" = 951 × 669.

## 6. Vertical bar per app — outer ↔ inner

The vertical bar (`Pane controls`) always stacks top to bottom: camera (outer only) → time + status → **top group** → empty space → **bottom group** (and standalone buttons). Light and Dark variants of every screen are identical in structure, button groups and pane ratios — only surface colours change (§6.7).

### 6.1 Mail — list + detail; the bar changes the most

| | Outer | Inner |
|---|---|---|
| Content | the message being read (one pane) | list 402 + message 465 · selected row filled with the accent colour |
| Top group | ← back · group ↑ ↓ (previous / next message) | ✎ compose — **standalone button** |
| Bottom group | group 🗑 delete · 📁 move · ↩ reply · then ✎ compose (standalone) | group ↩ reply · ↩↩ reply all · ↪ forward · 🗑 · 📁 |
| List pane | — | **its own toolbar** at the top of the pane: ▯ show / hide sidebar · group (filter · ⋯) · large title *All Inboxes* + a row of filter chips · **Search field floating at the bottom of the pane** |

Reading: ← and ↑ ↓ **disappear** on inner because the list is next to the message — you change message by tapping a row. With room, more actions are **revealed**: *reply all*, *forward*. Compose moves from the bottom of the bar to the **top**.

```text
OUTER 466×678                                 INNER 951×669
┌───────────────────────────────┬────┐        ┌ ▯        (☰ ⋯) ┬ 1 Message      Summarize ┬────┐
│ 1 Message          Summarize  │ ◉  │        │ All Inboxes     │ ◯ Elisha St. Denis 8:32  │9:41│
│ ◯ Elisha St. Denis   8:32 AM  │9:41│        │ 12 Unread       │   To: Pat, Randy & 6 …   │ ◔  │
│   To: Pat, Randy & 6 more… >  │ ◔  │        │ [Primary] 🛒 💬 📢│ Dive Photos              │(✎) │ compose, standalone
│ Dive Photos                   │(←) │        │[◯ Elisha St. Denis]│ Hey crew,              │┌──┐│
│ Hey crew,                     │┌──┐│        │  Dive Photos ← sel.│ Here are my favorite   ││↩ ││ reply
│ Here are my favorite shots    ││↑ ││ prev   │ ◯ Chris & Raul     │ shots from the Palau…  ││↩↩││ reply all
│ from the Palau trip. …        ││↓ ││ next   │ ◯ Christine Huang  │ Elisha                 ││↪ ││ forward
│ Elisha                        │└──┘│        │ ◯ Mary Gonzales    │┌───────────────────────┐││🗑 ││
│┌─────────────────────────────┐│┌──┐│        │                    ││     photo (bleeds     │││📁 ││
││   photo (bleeds to edges)   │││🗑 ││        │ (🔍 Search      🎙) ││     to pane edges)    ││└──┘│
││                             │││📁 ││        └────────────────────┴┴───────────────────────┴┴────┘
││                             │││↩ ││          list 402 (own toolbar, floating search) | message 465
│└─────────────────────────────┘│└──┘│
│                               │(✎) │ compose, standalone at the bottom
└───────────────────────────────┴────┘
```

### 6.2 Notes — list + detail; the bar stays the same

| | Outer | Inner |
|---|---|---|
| Content | the open note | list 340 + note 527 |
| Top group | ← · group (share · ⋯) | **identical** |
| Bottom group | group (checklist · attachment · pen) · ✎ new note (standalone) | **identical** |
| List pane | — | its own toolbar: ▯ sidebar · title *Notes* · ⋯ · grouped by date · Search floating at the bottom of the pane |

Reading: every button on the bar acts **on the open note**, so nothing changes. The list carries its own toolbar. Unlike Mail, Notes **keeps ←** (← still leads to the folder, not only to the list).

```text
OUTER                                         INNER
┌───────────────────────────────┬────┐        ┌ ▯   Notes   (⋯) ┬ Nature Walks ─────────────┬────┐
│ Nature Walks                  │ ◉  │        │ Today           │ (handwritten note with    │9:41│
│ (handwritten note with leaf   │9:41│        │[Nature Walks   ]│  leaf drawings)           │(←) │
│  drawings and labels)         │(←) │        │ 11:28 AM … ← sel.│                          │┌──┐│
│                               │┌──┐│        │                 │                           ││⇪ ││
│                               ││⇪ ││        │                 │                           ││⋯ ││
│                               ││⋯ ││        │                 │                           │└──┘│
│                               │└──┘│        │                 │                           │┌──┐│
│                               │┌──┐│        │                 │                           ││☑ ││ checklist
│                               ││☑ ││        │ (🔍 Search   🎙) │                           ││📎││ attach
│                               ││📎││        └─────────────────┴───────────────────────────┘│✍ ││ pen
│                               ││✍ ││          list 340 | note 527                           │└──┘│
│                               │└──┘│                                                        │(✎) │
│                               │(✎) │                                                        └────┘
└───────────────────────────────┴────┘
```

### 6.3 Slack — list + detail; the top group reveals new actions

| | Outer | Inner |
|---|---|---|
| Content | conversation · a person-name capsule + *3 tabs* floating over the top of the content · composer floating at the bottom | workspace sidebar 380 (brand-colour background) + conversation 487 |
| Top group | ← · ⋯ | group (✦ AI summary · 🎧 huddle) + **＋ new message — standalone, brand colour** |
| Bottom group | vertical tab bar (Home · DMs · Activity · More) · 🔍 (standalone) | **identical** |
| List pane | — | its own toolbar: workspace logo · group (filter · avatar) · ＋ · ▯ sidebar · a horizontally scrolling row of shortcut cards (Huddles, Drafts & Sent) · DM list, selected row filled |

Reading: **the tab bar does not change** between displays. The top group (contextual actions) changes: ← and ⋯ are replaced by revealed actions + the primary button.

```text
OUTER                                         INNER
┌───────────────────────────────┬────┐        ┌ (logo) (☰ ◯) (＋) (▯) ┬(James Hartnett · 3 tabs)┬────┐
│(James Hartnett · 3 tabs)      │ ◉  │        │ [Huddles][Huddles][Drafts…] →│ [photo] [photo]  │9:41│
│ [photo]  [photo]              │9:41│        │ Direct Messages >            │                  │┌──┐│
│                               │(←) │        │ ◯ Jenica Chong (you)         │ James: Great, I'm││✦ ││ AI summary
│ ◯ James Hartnett 9:35 AM      │(⋯) │        │ ◯ Aga Orlova                 │ going to drop …  ││🎧││ huddle
│   Great, I'm going to drop…   │    │        │ ◯ Anthony Wu                 │ Janica: Definitely│└──┘│
│ ◯ Janica Chong 9:38 AM        │┌──┐│        │[◯ James Hartnett   ] ← sel.  │ James: You're …  │(＋)│ brand colour
│   Definitely! …               ││⌂ ││        │ ＋ Start a new message        │                  │┌──┐│
│ ◯ James Hartnett 9:41 AM      ││💬││        │ # Channels >                 │                  ││⌂ ││
│   You're going to do …        ││🔔││        │ (brand-colour background)    │ (＋ Message …  🎙)│││💬││
│ (＋ Message James Hartnett 🎙) ││⋯ ││        └──────────────────────────────┴──────────────────┘│🔔││
│                               │└──┘│          sidebar 380 | conversation 487                     ││⋯ ││
│                               │(🔍)│                                                             │└──┘│
└───────────────────────────────┴────┘                                                             │(🔍)│
                                                                                                   └────┘
```

### 6.4 Music — media, no list + detail split

| | Outer | Inner |
|---|---|---|
| Content | album page: artwork · title · Play · track list below · mini player floating at the bottom | **reflow** into two areas: album + Play on the left 508 · track list on the right 359 — media area wider |
| Top group | ← · group (share · ⋯) | **identical** |
| Bottom group | vertical tab bar (Home · Browse · Radio · Library · 🔍 highlighted) | **identical** |
| Mini player | capsule 297: track · ⏸ · ⏭ | **expanded** 690, running across both areas: 🔀 ⏮ ⏸ ⏭ 🔁 · track · ⋯ · lyrics · queue |

Reading: the extra room **reveals more controls** (full mini player) and places the list beside the album — the artwork is not enlarged.

```text
OUTER                                         INNER
┌───────────────────────────────┬────┐        ┌ album 508 ──────────────────┬ tracks 359 ─────┬────┐
│ (blurred artwork background)  │ ◉  │        │ (artwork)                   │ 1 PLEASE      ⋯ │9:41│
│        COME CLOSER            │9:41│        │                             │ 2 COME CLOSER ⋯ │(←) │
│          TOMORA               │(←) │        │       COME CLOSER           │ 3 A BOY LIKE… ⋯ │┌──┐│
│ Electronic · 2026 · Hi-Res    │┌──┐│        │         TOMORA              │ 4 RING THE …  ⋯ ││⇪ ││
│   (🔀) [ ▶ Play ] (＋)         ││⇪ ││        │   (🔀) [ ▶ Play ] (＋)       │ … 10 SIDE BY  ⋯ ││⋯ ││
│ Ethereal melodies and …       ││⋯ ││        │ Ethereal melodies and …     │                 │└──┘│
│ 1 PLEASE                   ⋯  │└──┘│        │ (🔀 ⏮ ⏸ ⏭ 🔁 │▣ WAVELENGTHS │ ⋯ 💬 ☰ )    │┌──┐│
│ 2 COME CLOSER              ⋯  │┌──┐│        │   expanded mini player 690, across both areas│⌂ ││
│ (▣ WAVELENGTHS  TOMORA ⏸ ⏭)   ││⌂ ││        └─────────────────────────────┴─────────────────┘│▦ ││
│   mini player 297             ││▦ ││                                                          │📻││
│                               ││📻││                                                          │🎵││
│                               ││🎵││                                                          │🔍││ highlighted
│                               ││🔍││                                                          │└──┘│
└───────────────────────────────┴┴──┴┘                                                          └────┘
```

### 6.5 Netflix — full screen; only more picture is revealed

| | Outer | Inner |
|---|---|---|
| Content | image / video to the edges · title badge bottom-left | same, picture wider · title badge keeps its size |
| Top group | group (send · ＋ my list · volume) | **identical** |
| Bottom group | tab bar (Home · My Netflix · 🔍 · profile) | **identical** |

Reading: an immersive app **does not split panes**; the vertical bar is translucent, floats over the content, and is the same in every frame.

```text
OUTER                                    INNER
┌──────────────────────────────┬──┐      ┌──────────────────────────────────────────────┬──┐
│ (video frame, full bleed)    │◉ │      │ (video frame, full bleed — more picture)     │9:│
│                              │9:│      │                                              │┌┐│
│                              │┌┐│      │                                              ││➤││ send
│                              ││➤││      │                                              ││＋││ my list
│                              ││＋││      │                                              ││🔊││ volume
│                              ││🔊││      │                                              │└┘│
│                              │└┘│      │                                              │┌┐│
│                              │┌┐│      │                                              ││⌂││
│ (●) Stranger Things          ││⌂││      │ (●) Stranger Things                          ││▣││
│     Ominous · Nostalgic …    ││▣││      │     Ominous · Nostalgic · 1980s              ││🔍││
│                              ││🔍││      └──────────────────────────────────────────────┤│N││
│                              ││N││        bar translucent, floating over the video      │└┘│
└──────────────────────────────┴┴┘┘                                                       └──┘
```

### 6.6 Maps / Safari — Split View with two apps on the inner display

- Two apps 470 / 470, a vertical **Grabber** in the middle.
- **Maps** (left): no vertical bar of its own — controls sit in the left column of its **sheet** (× · share · ⋯ · ＋). The sheet covers only Maps' half; the place's main actions (Plan · Call · Website · More) are a horizontal button row inside the sheet.
- **Safari** (right): vertical bar on its outer (right) edge — group (‹ › back / forward) · 📖 reader mode (standalone) · … · bottom group (＋ new tab · ⧉ tabs).

Reading: each app keeps its controls on the **outer edge of its own area**; a presentation (sheet) belongs to that app and never covers the whole display.

```text
INNER 951×669 — Split View
┌ Maps 470 ───────────────────────┐┃┌ Safari 470 ─────────────────────────┬────┐
│ (map)            🍴 Aira pin     │┃│ [photo]      Dinner: Seasonal …     │9:41│
│                                  │┃│              Chef's Table …         │ ◔  │
│┌ sheet (Maps' half only) ───────┐│┃│              Biskopsvägen 9, …      │┌──┐│
││(✕)        Aira                 ││┃│              MAKE A RESERVATION     ││‹ ││ back
││(⇪) Modern European Cuisine     ││┃│ The gastronomic experience at AIRA  ││› ││ forward
││(⋯) [Plan][Call][Website][More] ││┃│ is constantly evolving …            │└──┘│
││    Hours Open · MICHELIN · 85% ││┃│                                     │(📖)│ reader
││    [From the Business][Photos] ││┃│ [photo]           [photo]           │┌──┐│
││(＋)                            ││┃│                                     ││＋││ new tab
│└────────────────────────────────┘│┃│                                     ││⧉ ││ tabs
└──────────────────────────────────┘┃└─────────────────────────────────────┴┴──┴┘
                           Grabber 3×46
```

### 6.7 Light / Dark — verified

The two columns of frames in the page are **the same screen in Light and Dark**: structure, button groups and pane ratios identical — only surface colours change (e.g. Mail inner, Dark: black surfaces, same blue selected row, same bar). The page overview (`examples-all-transformations`) lays out every pair: Music, Notes, Mail, Slack in Light + Dark, Maps / Safari in Light + Dark, Netflix in one variant.

## 7. Rules for grouping buttons on the vertical bar

1. **Separate the two kinds of button.** App-level navigation (tab bar) → **stays the same** in every frame (Slack, Music, Netflix). Contextual actions (for the open content) → **change per frame**.
2. **Drop buttons the layout now does for you.** List shown beside detail → drop ← and previous / next (Mail, Slack). ← still leads elsewhere (Notes: to the folder) → keep it.
3. **With room, reveal more — do not enlarge.** Inner shows actions outer had to hide in ⋯ (Mail: reply all, forward · Slack: AI summary, huddle · Music: full mini player).
4. **The primary button stands alone** — a standalone circle, may use the brand colour. Inner puts it at the **top** of the top group (Mail ✎, Slack ＋); outer usually at the **bottom** of the bar (Notes ✎, Mail ✎).
5. **The list pane carries its own toolbar** (sidebar · filter · ⋯ · create) and a Search field floating at the bottom of the pane — **not** pushed onto the vertical bar. The vertical bar serves the detail / main content pane.
6. **A group = one vertical glass capsule** for buttons of the same kind; primary button, Search and single buttons = standalone capsules.
7. **Media and immersive apps do not split panes** — reflow (Music) or just reveal more picture (Netflix); the bar stays the same.
8. **Split View** — each app puts its controls on its own outer edge; a sheet is limited to that app's half.

**Applying it to a project:** before grouping buttons for `Pane controls` → list every button of the iPhone version → put each into one kind from rule 1 → apply rules 2–6 → write the reasons into the frame annotation (adaptive behaviour spec: `duo-handoff-testing.md` §5). This is **community-kit evidence** imitating real apps — where it differs, the Apple kit (`../apple-design-iphone/references/ios27-figma-kit.md`) and `duo-components.md` win.
