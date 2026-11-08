# iPhone Duo community kit: navigation transitions, nine product patterns, ten Do / Don't pairs, review checklist

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/figma-adaptive-design-starter-kit-extraction.md §8, §10, §11, §13 (images `community-figma-adaptive/navigation-*`, `adaptive-*`, `do-dont-*`) @ 3c0e291 — translated, complete

**Community source, not Apple** — *iPhone Duo Adaptive Design Starter Kit (Community)*, Noah Elhadedy, v1.0 (reliability badges, tokens, components: `duo-community-kit.md`). Each item below carries the Apple source the kit cites; the Apple rules themselves are in `duo-components.md` (bars, overflow, sheets, menus) and `duo-layout-transformation.md` (split view, arrangement, screen types). **When this file and those differ, the Apple-based references win.** Rules in §4 marked `[T]` are the toolkit's own conclusions.

Wireframe legend: right column = vertical bar (◉ camera · 9:41 status · (‹) Back · (＋) prominent action, blue · ⇪ ⋯ toolbar group · ⌂ ▦ 👤 tab group); `[row]` = selected; ▓ = fold band.

## Contents
1. Eight navigation and bar transitions (outer ↔ inner)
2. Nine product patterns + Dark Mode check
3. Ten Do / Don't pairs
4. Rules to apply directly, and the short review checklist

---

## 1. Eight navigation and bar transitions

### 1.1 Navigation bar
- Outer: Back and the prominent action sit at the **top of the vertical bar**.
- Inner portrait: they return to a **horizontal top bar** beside the title.
- Why: the outer display is short; moving controls to the side keeps height for content and improves reach.
- Kit cites: HIG Designing for iPhone Duo · Vertical controls. Build with: `Duo / Vertical Bar`, `_Mockup / Horizontal Bar`.

```text
OUTER DISPLAY                                   UNFOLD →   INNER DISPLAY · PORTRAIT
┌──────────────────────────────┬─────┐                     ┌──────────────────────────────────────────┐
│ Notes (large title)          │  ◉  │ camera              │ (‹)        Title         (⋯) (＋) 9:41 ◔ │ horizontal top bar
│ ◯ Weekend trip          Fri  │ 9:41│                     │ Notes (large title)                      │
│   Packing list and bookings  │  ◔  │ status              │ ◯ Weekend trip                       Fri │
│ ◯ Design review         Tue  │ (‹) │ Back                │ ◯ Design review                      Tue │
│ ◯ Reading list          Mon  │ (＋)│ prominent (blue)    │ ◯ Reading list                       Mon │
│ ◯ Kitchen plans       Sep 8  │ ┌─┐ │                     │ ◯ Kitchen plans                    Sep 8 │
│ ◯ Garden              Sep 2  │ │⇪│ │ toolbar group       │ ◯ Garden                           Sep 2 │
│ ◯ Gift ideas         Aug 30  │ │⋯│ │ (share, more)       │ ◯ Gift ideas                      Aug 30 │
│                              │ └─┘ │                     │                                          │
│                              │ ┌─┐ │                     │                                          │
│                              │ │⌂│ │ tab bar (Home,      │   ┌ Home · Browse · Saved · Profile ┐ (🔍)│ bottom tab bar
│                              │ │▦│ │ Browse, Profile)    │   └─────────────────────────────────┘      │ + search button
│                              │ │👤│ │                     └──────────────────────────────────────────┘
└──────────────────────────────┴─────┘
```

### 1.2 Tab navigation
- Outer: tabs at the **bottom of the vertical bar**.
- Inner landscape: the same destinations in the **same order** may become a **labelled sidebar** (the tab capsule collapses to a single button).
- Why: regular width has room to name every destination and show the next level; stable order keeps muscle memory.
- Kit cites: Tech Talk "Prepare your app for iPhone Duo" · tab view sidebar placement. Build with: `Duo / Vertical Bar`, `Duo / Sidebar Column`, `_Mockup / Sidebar Row`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · LANDSCAPE
┌──────────────────────────────┬─────┐                    ┌ Library (sidebar) ┬ Home ─────────────────────┬─────┐
│ Home                         │ ◉   │                    │ [⌂ Home]  ← sel.  │ ◯ Weekend trip       Fri  │9:41 │
│ ◯ Weekend trip          Fri  │ 9:41│                    │  🔖 Saved          │ ◯ Design review      Tue  │ (‹) │
│ ◯ Design review         Tue  │ (‹) │                    │  ⇪ Shared         │ ◯ Reading list       Mon  │ (＋)│
│ ◯ Reading list          Mon  │ (＋)│                    │  ▪ Recent         │ ◯ Kitchen plans    Sep 8  │ ⇪ ⋯ │
│ ◯ Kitchen plans       Sep 8  │ ⇪ ⋯ │                    │ Collections       │ ◯ Garden           Sep 2  │     │
│ ◯ Garden              Sep 2  │     │                    │  ☰ Reading list   │ ◯ Gift ideas      Aug 30  │     │
│ ◯ Gift ideas         Aug 30  │ ┌─┐ │                    │  ☰ Field notes    │                           │     │
│                              │ │⌂│ │ tabs at the        │  ☰ Archive        │                           │ (⌂) │ single tab
│                              │ │▦│ │ bottom of the bar  │                   │                           │     │ button left
│                              │ │👤│ │                    └───────────────────┴───────────────────────────┴─────┘
└──────────────────────────────┴─────┘
```

### 1.3 Sidebar
- Outer: the sidebar collapses into the **root list** — the starting point of the flow.
- Inner: the sidebar is **always visible** next to the content.
- Why: destinations stay one tap away without covering what people are reading.
- Kit cites: HIG Sidebars · Designing for iPhone Duo · Split views. Build with: `Duo / Sidebar Column`, `_Mockup / Sidebar Row`, `Duo / Pane`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · LANDSCAPE
┌──────────────────────────────┬─────┐                    ┌ Library ──────────┬ Notes ────────────────────┬─────┐
│ Library  (root list)         │ ◉   │                    │ [⌂ Home]          │ ◯ Weekend trip       Fri  │9:41 │
│  ⌂ Home                      │ 9:41│                    │  🔖 Saved          │[◯ Design review      Tue] │ (‹) │ selected row
│  🔖 Saved                     │ (‹) │                    │  ⇪ Shared         │ ◯ Reading list       Mon  │ (＋)│ highlighted
│  ⇪ Shared                    │ (＋)│                    │  ▪ Recent         │ ◯ Kitchen plans    Sep 8  │ ⇪ ⋯ │
│  ▪ Recent                    │ ⇪ ⋯ │                    │ Collections       │ ◯ Garden           Sep 2  │     │
│  ☰ Reading list              │     │                    │  ☰ Reading list   │                           │ ⌂   │
│  ☰ Field notes               │ ⌂   │                    │  ☰ Field notes    │                           │ ▦   │
│  ☰ Archive                   │ ▦   │                    │  ☰ Archive        │                           │ 👤  │
│                              │ 👤  │                    └───────────────────┴───────────────────────────┴─────┘
└──────────────────────────────┴─────┘
```

### 1.4 Vertical navigation
- Between outer and inner landscape the vertical bar keeps almost the **same order and position**; only the content area grows.
- Side controls follow the **hardware** and do **not** switch sides for right-to-left languages; content adapts around the bar (Apple detail: `duo-components.md` §8).
- Kit cites: HIG Designing for iPhone Duo · Keep controls consistent across device poses. Build with: `Duo / Vertical Bar`, `_Mockup / Bar Button`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · LANDSCAPE
┌──────────────────────────────┬─────┐                    ┌ Notes ──────────────┬ Design review ───────────┬─────┐
│ Notes                        │ ◉   │                    │ ◯ Weekend trip  Fri │ ┌──────────────────────┐ │9:41 │
│ ◯ Weekend trip          Fri  │ 9:41│                    │[◯ Design review Tue]│ │        Image         │ │ (‹) │
│[◯ Design review         Tue] │ (‹) │                    │ ◯ Reading list  Mon │ └──────────────────────┘ │ (＋)│
│ ◯ Reading list          Mon  │ (＋)│                    │ ◯ Kitchen plans Sep8│ ───────────────────────  │ ⇪ ⋯ │
│ ◯ Kitchen plans       Sep 8  │ ⇪ ⋯ │                    │ ◯ Garden      Sep 2 │ ───────────────────────  │     │
│ ◯ Garden              Sep 2  │     │                    │                     │ ──────────────           │ ⌂   │
│ ◯ Gift ideas         Aug 30  │ ⌂   │                    │                     │                          │ ▦   │
│                              │ ▦   │                    │                     │                          │ 👤  │
│                              │ 👤  │                    └─────────────────────┴──────────────────────────┴─────┘
└──────────────────────────────┴─────┘
```

### 1.5 Toolbar
- Outer: lower-priority items go into the **system overflow**, from the bottom up.
- Inner has more height: more items stay visible.
- Navigation and the prominent action stay visible first; give **frequent** and **badged** items higher visibility priority.
- The toolbar shares the vertical bar with navigation and tabs, so space runs out sooner on the outer display. On the inner display the text column keeps a readable width instead of running to the bar.
- Kit cites: HIG Designing for iPhone Duo · Prioritize frequently used toolbar items. Build with: `Duo / Vertical Bar` (Toolbar Compressed, Default), `_Mockup / Bar Button`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · LANDSCAPE
┌──────────────────────────────┬─────┐                    ┌──────────────────────────────────────────┬─────┐
│ Weekend trip                 │ ◉   │                    │ Weekend trip                             │9:41 │
│ Saved Friday · 6 items       │ 9:41│                    │ Saved Friday · 6 items                   │ (‹) │
│ ┌──────────────────────────┐ │ (‹) │                    │ ┌──────────────────────────────────┐     │ (＋)│
│ │          Photo           │ │ (＋)│                    │ │              Photo               │     │ ┌─┐ │
│ └──────────────────────────┘ │ (⋯) │ share moved into   │ └──────────────────────────────────┘     │ │⇪│ │ share visible
│ Passports and chargers go in │     │ the overflow       │ Passports and chargers go in the front   │ │⋯│ │ again
│ the front pocket. Train      │     │                    │ pocket. Train leaves at 7:40 from        │ └─┘ │
│ leaves at 7:40 from platform │ ⌂   │                    │ platform 4, so plan to be at the station │ ⌂   │
│ 4, … check-in opens at 3 pm. │ ▦   │                    │ by 7:15. Hotel check-in opens at 3 pm.   │ ▦   │
│                              │ 👤  │                    │                                          │ 👤  │
└──────────────────────────────┴─────┘                    └──────────────────────────────────────────┴─────┘
```

### 1.6 Split navigation
- Outer: tapping a row **pushes** the detail.
- Inner: the detail appears **next to the list**; the selected row stays highlighted.
- Folding the inner display resizes both panes to either side of the hinge.
- Hierarchy is unchanged; inner reveals **one more level** (Mail and Notes follow this).
- Kit cites: HIG Designing for iPhone Duo · Split views, Create a consistent experience across displays. Build with: `Duo / Split View`, `Duo / Pane`, `_Mockup / List Row`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · LANDSCAPE
┌──────────────────────────────┬─────┐                    ┌ Notes ──────────────┬ Design review ───────────┬─────┐
│ Notes                        │ ◉   │                    │ ◯ Weekend trip  Fri │ ┌──────────────────────┐ │9:41 │
│ ◯ Weekend trip          Fri  │ 9:41│                    │[◯ Design review Tue]│ │        Image         │ │ (‹) │
│ ◯ Design review         Tue  │ (‹) │  tap row → push    │ ◯ Reading list  Mon │ └──────────────────────┘ │ (＋)│
│ ◯ Reading list          Mon  │ (＋)│  detail            │ ◯ Kitchen plans Sep8│ ───────────────────────  │ ⇪ ⋯ │
│ ◯ Kitchen plans       Sep 8  │ ⇪ ⋯ │                    │ ◯ Garden      Sep 2 │ ──────────────           │     │
│ ◯ Garden              Sep 2  │     │                    │                     │                          │ ⌂ ▦ │
│ ◯ Gift ideas         Aug 30  │ ⌂▦👤│                    │                     │                          │ 👤  │
└──────────────────────────────┴─────┘                    └─────────────────────┴──────────────────────────┴─────┘
```

### 1.7 Contextual actions
- Outer: the menu opens **next to the item**.
- Inner partial: the menu stays on the **same side of the fold** as the item, never spanning the hinge.
- Custom menus must imitate the system menu's fold-avoidance.
- Kit cites: HIG Designing for iPhone Duo · Reserved regions. Build with: `_Mockup / Context Menu`, `Duo / Split View`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · PARTIALLY FOLDED
┌──────────────────────────────┬─────┐                    ┌ Notes ──────────────────┐▓┌ Design review ───┬─────┐
│ Notes                        │ ◉   │                    │ ◯ Weekend trip     Fri  │▓│ ┌──────────────┐ │9:41 │
│ ◯ Weekend trip          Fri  │ 9:41│                    │[◯ Design review    Tue] │▓│ │    Image     │ │ (‹) │
│[◯ Design review         Tue] │ (‹) │                    │ ◯ Read┌──────────────┐  │▓│ └──────────────┘ │ (＋)│
│ ◯ Readi┌──────────────────┐  │ (＋)│                    │ ◯ Kitc│ Share      ⇪ │  │▓│ ──────────────── │ ⇪ ⋯ │
│ ◯ Kitch│ Share          ⇪ │  │ ⇪ ⋯ │                    │       │ Save       🔖 │  │▓│ ──────────       │     │
│ ◯ Garde│ Save           🔖 │  │     │                    │       │ Pin to     ⫴ │  │▓│                  │     │
│        │ Pin to sidebar ⫴ │  │     │                    │       │  sidebar     │  │▓│                  │ ⌂▦👤│
│        │ More options   ⋯ │  │ ⌂▦👤│                    │ ◯ Gard│ More opt.  ⋯ │  │▓│                  │     │
│ ◯ Gift └──────────────────┘  │     │                    │       └──────────────┘  │▓│                  │     │
└──────────────────────────────┴─────┘                    └─────────────────────────┘▓└──────────────────┴─────┘
                                                                     menu stays on the list's side ↑ ▓ = fold band
```

### 1.8 Sheets
- Outer: the sheet keeps its controls in a **vertical strip** on the trailing side, like the app underneath; it covers the whole content area (✕ and ＋ stacked at the trailing edge).
- Inner: a **horizontal bar** (✕ leading, title centered, ＋ trailing) on a centered card; the app stays visible, dimmed, behind it.
- Partial: the system **slides the sheet to one side** of the hinge.
- Close / Done stay in a predictable place matching the surrounding layout.
- Kit cites: Tech Talk "Design for iPhone Duo" · Sheet behavior. Build with: `_Mockup / Sheet`.

```text
OUTER DISPLAY                                  UNFOLD →   INNER DISPLAY · LANDSCAPE
┌──────────────────────────────┐ (app dimmed)             ┌ Notes (dimmed) ─┬ Design review (dimmed) ────┬─────┐
│ Notes                    ◉   │                          │ ◯ Weekend trip  │                            │9:41 │
│ ◯ Weekend trip  Fri    9:41  │                          │ ◯ Design┌──────────────────────────────┐ │ (‹) │
│ ┌──────── sheet ─────────────┤                          │ ◯ Readin│ (✕)      Sheet title      (＋)│ │ (＋)│
│ │ Sheet title          (✕)   │ controls in a vertical   │ ◯ Kitche│ On the inner display the     │ │ ⇪ ⋯ │
│ │ Controls sit on the  (＋)   │ strip on the trailing    │ ◯ Garden│ sheet uses a horizontal bar. │ │     │
│ │ side, like the app         │ side                     │         │ When partially folded the    │ │ ⌂▦👤│
│ │ underneath.                │                          │         │ system slides it to one side │ │     │
│ │                            │                          │         │ of the hinge.                │ │     │
│ └────────────────────────────┤                          │         └──────────────────────────────┘ │     │
└──────────────────────────────┘                          └──────────────────────────────────────────┴─────┘
```

## 2. Nine product patterns (closed → open)

Every pattern keeps the main task and uses the inner display for **one more level** of information — the inner display never becomes "another app". Each has seven fields: use for · outer · inner · keep · change · failure · better. In every wireframe the vertical bar is identical on both displays.

| Pattern | Use for | Outer (closed) | Inner (open) | Keep | Change | Failure | Better |
|---|---|---|---|---|---|---|---|
| **Feed** | news, social posts, discovery streams | one column of cards, newest first | two columns of cards + a panel of followed topics; cards never span the fold | card order, scroll position, card actions | cards per row, supporting panel | stretching one card across the whole inner display | add a column or a context panel; keep card width near the outer width |
| **Master–detail** | mail, notes, files, contacts, any list + item view | list is the first screen; tapping a row pushes the item | list and selected item side by side; row stays highlighted | sort order, selection, list actions | how many hierarchy levels are visible at once | keeping push navigation on inner, leaving half the screen empty | show the item next to the list; keep list actions above the list pane |
| **Messaging** | chat, support threads, comments | opens the last active conversation, with a way back to the list | conversation list leading; active conversation beside it | open thread, composer draft, keyboard focus | list revealed so you can switch thread without leaving the conversation | unfolding jumps back to the list and loses the draft | keep the active thread + draft; just reveal the list beside it |
| **Media** | music, podcasts, video, audiobooks | artwork, now playing and transport controls fill the screen | player keeps its layout and size in the leading pane; Up Next or episode notes in the trailing pane | playback, position in the track, transport order | the queue becomes visible | blowing artwork up across inner and pushing controls onto the fold | keep the player near outer size in one pane, use the other pane for the queue |
| **Maps** | places, directions, delivery tracking, map-anchored tasks | full-screen map; compact card at the bottom; map controls float near the vertical bar | search + place detail become a leading panel; map uses the rest | selected place, zoom level, map center | card expands into a panel with more results / detail | keeping the bottom card on inner so it spans the fold | dock detail in a side panel that ends before the hinge; the map may run behind |
| **E-commerce** | stores, marketplaces, catalogs | filters + two-column product grid; tapping a product opens its page | grid stays two columns in the leading pane; selected product opens beside it | filters, grid order, card size, bag | detail appears beside the grid instead of replacing it | growing to five columns of small cards running across the hinge | keep cards at outer size; use the trailing pane for the product being compared |
| **Dashboard** | analytics, finance, fitness summaries, admin tools | metrics two per row, then one chart | four metrics in one row; two charts side by side meeting at the fold | metric order, date range, chart style | items per row, charts visible without scrolling | one giant chart across the display, cut in half by the hinge | pair charts on the two sides of the fold, each at a readable size |
| **Settings** | app settings, account areas, admin consoles | category list; each category opens its own screen, Back in the vertical bar | categories stay in a sidebar; the chosen category opens beside it | order, grouping, current category | category list always visible instead of replaced | merging every setting of every category into one very long inner screen | keep the two existing hierarchy levels, just side by side |
| **Calendar** | calendars, task lists, booking, schedules | one-day agenda; tapping an event opens detail | agenda keeps its width in the leading pane; selected event opens in the trailing pane | day, selected event, time scale | detail appears beside the agenda instead of replacing it | switching to a week grid automatically on unfold, losing the event being checked | keep the day view and add detail; week view is a deliberate choice, never a surprise |

### 2.1 Feed
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ Today ────────────────────────────┬ Following ──┬─────┐
│ Today                        │ ◉   │                    │ ┌──────────────┐ ┌──────────────┐ │ ◯ Transport │9:41 │
│ ┌──────────────────────────┐ │ 9:41│                    │ │    Photo     │ │    Photo     │ │   4 new     │ (‹) │
│ │          Photo           │ │ (‹) │                    │ └──────────────┘ └──────────────┘ │ ◯ Local     │ (＋)│
│ └──────────────────────────┘ │ (＋)│                    │ City council     A quiet week for │   9 new     │ ⇪ ⋯ │
│ City council approves the    │ ⇪ ⋯ │                    │ approves the     the markets      │ ◯ Food      │     │
│ riverside cycle path         │     │                    │ riverside cycle  before earnings  │   2 new     │     │
│ Local · 12 min ago           │     │                    │ path · Local ·   Business · 1 h   │ ◯ Science   │     │
│ ┌──────────────────────────┐ │     │                    │ 12 min ago       ago              │   1 new     │     │
│ │          Photo           │ │ ⌂   │                    │ ┌──────────────┐ ┌──────────────┐ │             │ ⌂   │
│ └──────────────────────────┘ │ ▦   │                    │ │    Photo     │ │    Photo     │ │             │ ▦   │
│ A quiet week for the markets │ 👤  │                    │ └──────────────┘ └──────────────┘ │             │ 👤  │
│ before earnings · Business   │     │                    │ The ferry timetable Five new cafes│             │     │
└──────────────────────────────┴─────┘                    └───────────────────────────────────┴─────────────┴─────┘
```

### 2.2 Master–detail
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ Inbox ────────────────┬ Updated floor plan attached ─┬─────┐
│ Inbox                        │ ◉   │                    │[◯ Maya Torres   9:12] │ Maya Torres · 9:12           │9:41 │
│ ◯ Maya Torres          9:12  │ 9:41│                    │  Updated floor plan…  │ Hi, the new plan moves the   │ (‹) │
│   Updated floor plan attached│ (‹) │  tap row → push    │ ◯ Studio North  8:40  │ kitchen island 40 cm toward  │ (＋)│
│ ◯ Studio North         8:40  │ (＋)│  the item          │ ◯ Leo Park  Yesterday │ the window so the pantry door│ ⇪ ⋯ │
│ ◯ Leo Park        Yesterday  │ ⇪ ⋯ │                    │ ◯ Harbor Library  Yest│ opens fully. Let me know if  │     │
│ ◯ Harbor Library  Yesterday  │     │                    │ ◯ Ana Ruiz       Mon  │ the measurements work for you│     │
│ ◯ Ana Ruiz              Mon  │ ⌂   │                    │ ◯ Transit Office Mon  │ before Thursday.             │ ⌂   │
│ ◯ Transit Office        Mon  │ ▦   │                    │                       │ ┌──────────────────────────┐ │ ▦   │
│                              │ 👤  │                    │                       │ │Attachment · floor-plan.pdf│ │ 👤  │
└──────────────────────────────┴─────┘                    └───────────────────────┴──────────────────────────────┴─────┘
```

### 2.3 Messaging
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ Messages ─────────────┬ ◯ Leo Park ───────────────────┬─────┐
│ ◯ Leo Park                   │ ◉   │ opens on the last  │[◯ Leo Park      9:02] │                              │9:41 │
│                              │ 9:41│ active thread      │  Great, see you there │                              │ (‹) │
│                              │ (‹) │ (‹ = back to list) │ ◯ Maya Torres   8:15  │                              │ (＋)│
│                              │ (＋)│                    │ ◯ Book club Yesterday │                              │ ⇪ ⋯ │
│ (Are we still on for Friday?)│ ⇪ ⋯ │                    │ ◯ Ana Ruiz       Mon  │ (Are we still on for Friday?)│     │
│       (Yes. 7:30 at the harbor?)   │                    │ ◯ Family         Sun  │      (Yes. 7:30 at the harbor?)    │
│ (Perfect. I will book a table│     │                    │                       │ (Perfect. I will book a      │     │
│  by the window.)             │ ⌂   │                    │                       │  table by the window.)       │ ⌂   │
│        (Great, see you there)│ ▦   │                    │                       │        (Great, see you there)│ ▦   │
│ [Message      ] (＋)         │ 👤  │                    │                       │ [Message      ] (＋)          │ 👤  │
└──────────────────────────────┴─────┘                    └───────────────────────┴──────────────────────────────┴─────┘
```

### 2.4 Media
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ player (leading pane) ──────┬ Up next ───────────┬─────┐
│ ┌──────────────────────────┐ │ ◉   │                    │ ┌─────────────────────────┐ │ ◯ Salt Air    4:10 │9:41 │
│ │                          │ │ 9:41│                    │ │                         │ │ ◯ Night Ferry 3:37 │ (‹) │
│ │        Album art         │ │ (‹) │                    │ │        Album art        │ │ ◯ Lanterns    5:02 │ (＋)│
│ └──────────────────────────┘ │ (＋)│                    │ └─────────────────────────┘ │ ◯ Undertow    3:15 │ ⇪ ⋯ │
│ Low Tide                     │ ⇪ ⋯ │                    │ Low Tide                    │ ◯ Shoreline   4:44 │     │
│ Harbor Lights · Quiet Coast  │     │                    │ Harbor Lights · Quiet Coast │   (Harbor Lights)  │     │
│ ━━━━━━━──────────────────    │     │                    │ ━━━━━━━━━─────────────────  │                    │     │
│ 1:24                   3:52  │ ⌂   │                    │ 1:24                  3:52  │                    │ ⌂   │
│       ‹    (▶)    ♥          │ ▦   │                    │        ‹    (▶)    ♥        │                    │ ▦   │
│                              │ 👤  │                    │                             │                    │ 👤  │
└──────────────────────────────┴─────┘                    └─────────────────────────────┴────────────────────┴─────┘
```

### 2.5 Maps
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ leading panel ──────────────┬ map ─────────────────┬─────┐
│ ░░░░░ map (full screen) ░░░░ │ ◉   │                    │ (🔍 Food halls nearby     ) │ ░░░░░░░░░░░░░░░░░░░░ │9:41 │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ 9:41│                    │ ┌ Harbor Market ──────────┐ │ ░░░░░░░░░░░░░░░░░░░░ │ (‹) │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ (‹) │                    │ │ Food hall · Open until  │ │ ░░░░ map keeps the ░ │ (＋)│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ (＋)│                    │ │ 9 pm · 12 min walk      │ │ ░░░░ rest of the ░░░ │ ⇪ ⋯ │
│ ┌──┐ map controls float near │ ⇪ ⋯ │                    │ │ (Directions)            │ │ ░░░░ display ░░░░░░░ │     │
│ │⫴ │ the vertical bar         │     │                    │ └─────────────────────────┘ │ ░░░░░░░░░░░░░░░░░░░░ │     │
│ │📍│                          │     │                    │ Also nearby                 │ ░░░░░░░░░░░░░░░░░░░░ │     │
│ │(＋)                         │ ⌂   │                    │ ◯ Pier Kitchens  4.6        │ ░░░░░░░░░░░░░░░░░░░░ │ ⌂   │
│ ┌ Harbor Market ───────────┐ │ ▦   │                    │   Food hall · 18 min        │ ░░░░░░░░░░░░░░░░░░░░ │ ▦   │
│ │ Food hall · Open until   │ │ 👤  │                    │ ◯ Old Mill Yard  4.4        │ ░░░ [⫴ 📍 (＋)] ░░░░ │ 👤  │
│ │ 9 pm · 12 min walk       │ │     │                    │   Market · 25 min           │  controls row, bottom │     │
│ │ (Directions)             │ │     │                    │                             │  right of the map     │     │
│ └──────────────────────────┘ │     │                    └─────────────────────────────┴──────────────────────┴─────┘
└──────────────────────────────┴─────┘
```
Floating map controls move from a vertical stack (outer) to a horizontal row (inner).

### 2.6 E-commerce
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ Shop (leading pane) ────────┬ product (trailing) ──┬─────┐
│ Shop                         │ ◉   │                    │ Shop                        │ ┌──────────────────┐ │9:41 │
│ [All] Bags Knitwear Outdoor  │ 9:41│                    │ [All] Bags Knitwear Outdoor │ │  Product photo   │ │ (‹) │
│ ┌──────────┐ ┌──────────┐    │ (‹) │                    │ ┏━━━━━━━━━━┓ ┌──────────┐   │ └──────────────────┘ │ (＋)│
│ │ Product  │ │ Product  │    │ (＋)│                    │ ┃ Product  ┃ │ Product  │   │ Canvas tote          │ ⇪ ⋯ │
│ └──────────┘ └──────────┘    │ ⇪ ⋯ │                    │ ┗━━━━━━━━━━┛ └──────────┘   │ $48 · Natural        │     │
│ Canvas tote   Wool beanie    │     │                    │ Canvas tote   Wool beanie   │ Heavy cotton canvas  │     │
│ $48           $32            │     │                    │ $48 (selected) $32          │ with an inside pocket│     │
│ ┌──────────┐ ┌──────────┐    │ ⌂   │                    │ ┌──────────┐ ┌──────────┐   │ and reinforced       │ ⌂   │
│ │ Product  │ │ Product  │    │ ▦   │                    │ │ Product  │ │ Product  │   │ handles. Fits a 14   │ ▦   │
│ └──────────┘ └──────────┘    │ 👤  │                    │ └──────────┘ └──────────┘   │ inch laptop.         │ 👤  │
│ Trail bottle  Linen shirt    │     │                    │ Trail bottle  Linen shirt   │ [   Add to bag    ]  │     │
│ $24           $68            │     │                    │ $24           $68           │                      │     │
└──────────────────────────────┴─────┘                    └─────────────────────────────┴──────────────────────┴─────┘
```

### 2.7 Dashboard
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ This week ──────────────────────────────────────────┬─────┐
│ This week                    │ ◉   │                    │ ┌Revenue──┐┌Orders───┐┌Visitors─┐┌Conversion┐       │9:41 │
│ ┌Revenue───┐ ┌Orders────┐    │ 9:41│                    │ │$12,480  ││342      ││9,120    ││3.8%      │       │ (‹) │
│ │$12,480   │ │342       │    │ (‹) │                    │ │+8.1% vs ││+3.4% vs ││+1.2% vs ││+0.4 pt vs│       │ (＋)│
│ │+8.1% vs  │ │+3.4% vs  │    │ (＋)│                    │ │last week││last week││last week││last week │       │ ⇪ ⋯ │
│ │last week │ │last week │    │ ⇪ ⋯ │                    │ └─────────┘└─────────┘└─────────┘└──────────┘       │     │
│ ┌Visitors──┐ ┌Conversion┐    │     │                    │ ┌ Revenue by week ─────┐ ┌ Orders by week ──────┐   │     │
│ │9,120     │ │3.8%      │    │     │                    │ │ ▁▂▃▃▄▅▅▆▇█           │ │ ▁▂▃▃▄▅▅▆▇█           │   │     │
│ │+1.2% …   │ │+0.4 pt … │    │ ⌂   │                    │ │                      │ │                      │   │ ⌂   │
│ ┌ Revenue by week ───────┐   │ ▦   │                    │ └──────────────────────┘ └──────────────────────┘   │ ▦   │
│ │ ▁▂▃▃▄▅▅▆▇█             │   │ 👤  │                    │            charts meet at the fold ↑                │ 👤  │
│ └────────────────────────┘   │     │                    │                                                     │     │
└──────────────────────────────┴─────┘                    └─────────────────────────────────────────────────────┴─────┘
```

### 2.8 Settings
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ Settings (sidebar) ─┬ Notifications ─────────────────┬─────┐
│ Settings                     │ ◉   │                    │ 👤 Account          │ Allow notifications      (●━) │9:41 │
│ ◯ Rosa Lind                  │ 9:41│                    │[🔔 Notifications]   │  Banners, sounds and badges    │ (‹) │
│   Personal plan              │ (‹) │                    │ 📍 Privacy          │ Daily summary            (●━) │ (＋)│
│ 👤 Account                   │ (＋)│                    │ ▦ Display           │  Delivered at 8:00             │ ⇪ ⋯ │
│ 🔔 Notifications             │ ⇪ ⋯ │                    │ ⫴ Storage           │ Mentions only            (━○) │     │
│ 📍 Privacy                   │     │                    │ ⚙ About             │  Mute everything else          │     │
│ ▦ Display                    │ ⌂   │                    │                     │ Show previews            (●━) │ ⌂   │
│ ⫴ Storage                    │ ▦   │                    │                     │  When unlocked                 │ ▦   │
│ ⚙ About                      │ 👤  │                    │                     │                                │ 👤  │
└──────────────────────────────┴─────┘                    └─────────────────────┴────────────────────────────────┴─────┘
```

### 2.9 Calendar
```text
CLOSED · OUTER DISPLAY                         UNFOLD →   OPEN · INNER DISPLAY
┌──────────────────────────────┬─────┐                    ┌ Saturday (agenda) ──────────┬ Design review ─────────┬─────┐
│ Saturday                     │ ◉   │                    │ September 13                │ 9:00 to 9:45 · Room 4  │9:41 │
│ September 13                 │ 9:41│                    │ 9:00  ┏ Design review ━━━━┓ │ Attendees              │ (‹) │
│ 9:00  ┌ Design review ─────┐ │ (‹) │                    │       ┃ Room 4 · 45 min   ┃ │ ◯ Maya Torres Accepted │ (＋)│
│       │ Room 4 · 45 min    │ │ (＋)│                    │       ┗━━━━━━━━━━━━━━━━━━━┛ │ ◯ Leo Park    Accepted │ ⇪ ⋯ │
│ 11:30 ┌ Lunch with Ana ────┐ │ ⇪ ⋯ │                    │ 11:30 ┌ Lunch with Ana ───┐ │ ◯ Rosa Lind   Accepted │     │
│       │ Harbor Market      │ │     │                    │       │ Harbor Market     │ │ Notes                  │     │
│ 14:00 ┌ Kitchen fitting ───┐ │ ⌂   │                    │ 14:00 ┌ Kitchen fitting ──┐ │ Walk through the new   │ ⌂   │
│       │ Home · 2 h         │ │ ▦   │                    │       │ Home · 2 h        │ │ onboarding flow and    │ ▦   │
│ 17:15 ┌ Ferry to the island┐ │ 👤  │                    │ 17:15 ┌ Ferry to the island┐│ agree on the empty     │ 👤  │
│       │ Pier 2             │ │     │                    │       │ Pier 2            │ │ states.                │     │
└──────────────────────────────┴─────┘                    └─────────────────────────────┴────────────────────────┴─────┘
```

### 2.10 Dark Mode check
The same messaging screen on outer and inner, with the `iOS Semantic Colors` collection switched to **Dark per frame**. Nothing is recolored by hand; every fill resolves through a semantic token. It tests that the **component system** is sound, not just the colours of one screenshot. The inner frame also reveals a supporting "Plan" pane (route, attendees) beside the thread.

```text
OUTER (Dark)                                   INNER (Dark)
┌──────────────────────────────┬─────┐         ┌ thread ─────────────────────────┬ Plan (supporting pane) ──┬─────┐
│ ◯ Saturday hike              │9:41 │         │ ◯ Saturday hike                 │ ┌ Ridge loop · Saturday ┐│9:41 │
│   Sam, Priya, Jonah and you  │ (‹) │         │   Sam, Priya, Jonah and you     │ │ 8:30 at the north     ││ (‹) │
│ Sam: Forecast says clear     │ (✎) │ blue    │ Sam: Forecast says clear skies  │ │ trailhead · 9.6 km    ││ (✎) │
│ skies from 8                 │ 💬 ⋯│         │ from 8                          │ └───────────────────────┘│ 💬 ⋯│
│        (Trailhead at 8:30 then?)   │         │          (Trailhead at 8:30 then?)│ [ Route preview ]        │     │
│ [Photo · Ridge view]         │     │         │ [Photo · Ridge view]            │ Going                    │     │
│ Priya: Last time we went up  │ ⌂   │         │ Priya: Last time we went up …   │ ◯ Sam  Driving, 3 seats Yes│ ⌂ │
│ this way. Bring layers, …    │ ▦   │         │          (Packing the thermos)  │ ◯ Priya Bringing snacks Yes│ ▦ │
│          (Packing the thermos)│ 👤  │         │ [Message Saturday hike ] (＋)    │ ◯ Jonah Might be late Maybe│👤 │
│ [Message Saturday hike ] (＋) │     │         │                                 │                          │     │
└──────────────────────────────┴─────┘         └─────────────────────────────────┴──────────────────────────┴─────┘
```

## 3. Ten Do / Don't pairs

| # | Do | Don't (why it fails) |
|---|---|---|
| 1 | **Preserve task continuity** — keep the same screen, selection and scroll position when the device opens or closes, so people pick up exactly where they were | **Rebuild the interface after unfolding** — a new layout forces people to search for their place again, often mid-task |
| 2 | **Use the extra area for secondary context** — show the next level of hierarchy or supporting information next to the primary task | **Simply scale every element larger** — bigger rows and wider cards add no information and push content below the fold |
| 3 | **Respect the hinge and reserved regions** — keep interactive elements on either side of the fold and away from the camera regions | **Place critical actions across the fold** — when partially folded the center is curved and hard to see or press |
| 4 | **Keep bars where the system puts them** — on the outer display and inner landscape, toolbars and tab bars sit on the side; that placement is the core iPhone Duo pattern | **Move bars back to the top and bottom** — overriding the vertical placement wastes vertical space and breaks what people learn in other apps |
| 5 | **Keep control order stable across poses** — navigation first, then the prominent action, then toolbar groups, then the tab bar; people should not relearn where actions live | **Reorder actions for each pose** — controls that jump between poses are hard to find and track |
| 6 | **Split grids evenly at the fold** — use an even number of columns so content divides cleanly when the device folds | **Let a column straddle the hinge** — a card or image cut by the fold loses its most important detail |
| 7 | **Let scrolling content stay in place** — feeds and articles keep flowing when the device folds; move controls, not the stream | **Push a feed around the fold** — displacing continuous content makes people lose their reading position |
| 8 | **Handle each safe-area inset on its own** — insets are asymmetric because controls sit along one edge; read every side separately | **Mirror left and right insets** — copying the trailing vertical-bar inset to the leading edge wastes space and misaligns content |
| 9 | **Keep a readable line length** — on the inner display give long text a comfortable measure and use the remaining width for a second pane | **Run text across the whole inner display** — very long lines are tiring to read and make the extra width feel empty |
| 10 | **Use the system overflow menu** — when items overflow, move your own extra actions into the system menu so everything lives in one place | **Add a second custom overflow menu** — two ellipsis buttons make people guess which one holds the action |

```text
1 continuity      DO  ┌───┬┐ → ┌───┬─────┬┐       DON'T ┌───┬┐ → ┌──┬──┬──┬┐
                      │▬▬▬││   │▬▬▬│ img ││             │▬▬▬││   │▢ │▢ │▢ ││  list + selected row become
                      │███││   │███│ ─── ││             │███││   │▢ │▢ │▢ ││  a tile grid: selection lost
                      └───┴┘   └───┴─────┴┘             └───┴┘   └──┴──┴──┴┘
                      selected row (█) kept; detail opens beside it
2 extra area      DO  ┌────┬────────┬┐              DON'T ┌──────────────┬┐
                      │▬▬▬▬│  image │││                   │▭▭▭▭▭▭▭▭▭▭▭▭▭▭││  one list with huge rows
                      │████│ ────── │││                   │██████████████││
                      │▬▬▬▬│ ────── │││                   │▭▭▭▭▭▭▭▭▭▭▭▭▭▭││
                      └────┴────────┴┘                    └──────────────┴┘
3 hinge           DO  ┌──────▓──────┬┐              DON'T ┌──────▓──────┬┐
                      │ ▬▬▬▬ ▓ ──── ││                    │ ▬▬▬▬ ▓ ──── ││
                      │ ▬▬▬▬ ▓ (███)││  button on one     │ ▬▬ (██▓██)  ││  red button straddles the fold
                      └──────▓──────┴┘  side of the fold  └──────▓──────┴┘
4 bar placement   DO  ┌───┬┐ → ┌──────────┬┐        DON'T ┌─────┐ → ┌──────────┬┐
                      │▬▬▬│●│   │▬▬▬ ───── │●│            │▀▀▀▀▀│   │▬▬▬ ───── ││  outer gets a top and bottom
                      │▬▬▬│●│   │▬▬▬       │●│            │▬▬▬▬▬│   │▬▬▬       ││  bar instead of the side bar
                      └───┴┘   └──────────┴┘             │▄▄▄▄▄│   └──────────┴┘
5 control order   DO  [●][◐][○][·] → [●][◐][○][·]   DON'T [●][◐][○][·] → [○][·][●][◐]  (vertical bar, top→bottom)
6 even grid       DO  ║█│█│█│█▓█│█│█│█║            DON'T ║█│█│█│▓█▓│█│█│█║  a column sits on the fold
7 scroll content  DO  ┌───────▓───────┐            DON'T ┌──────┐▓┌──────┐
                      │ [=====▓=====] │  cards keep      │[====]│▓│      │  cards pushed to both sides
                      │ [=====▓=====] │  flowing across  │[====]│▓│[====]│  and offset — reading position
                      └───────▓───────┘  the fold        └──────┘▓└──────┘  lost
8 insets          DO  ┌──────────────┬┐            DON'T ┌▒┬────────────┬┐  trailing bar inset copied to
                      │  content     │●│                 │▒│  content   │●│  the leading edge (▒)
                      └──────────────┴┘                  └▒┴────────────┴┘
9 line length     DO  ┌──────────┬────┬┐           DON'T ┌──────────────┬┐
                      │ ──────── │pane│●│                │ ──────────── │●│  text across the whole display
                      │ ──────── │    │●│                │ ──────────── │●│
                      └──────────┴────┴┘                 └──────────────┴┘
10 overflow       DO  [○][○][●] → ┌ menu ─┐          DON'T [○][○][●][●red]  a second custom ⋯ button
                                  │ ───── │                beside the system one
                                  └───────┘
```

## 4. Rules to apply directly, and the short review checklist

### 4.1 Rules `[T]` (toolkit conclusions from the kit)

- Always design the **state pair** outer ↔ inner for the same task.
- Every state transition must **declare the preserved state**: selection, scroll, draft, playback, focus, zoom, map center.
- Extra width reveals hierarchy / context; never unconditional scaling.
- Safe area is **four independent values**.
- Controls never span the division region; scrolling content may continue across it if it stays readable.
- Bar order, destination order and action identity stay stable.
- Custom menus / sheets / overlays sit entirely inside one usable region and keep their relation to the source item.
- Every Figma frame is annotated with: display, orientation, fold, size class, active reserved region, bar edge, preserved state (full behaviour spec: `duo-handoff-testing.md` §5).
- Kit tokens are Figma / reference-only (`duo-community-kit.md` §9.3).

### 4.2 Short review checklist

- [ ] Same task and same active item before / after unfolding.
- [ ] No control, hit target or key detail on the fold or the cameras.
- [ ] No mechanical mirroring of safe-area insets.
- [ ] Bars on the right edge and in the right group order.
- [ ] Overflow prioritises navigation, prominent and frequent / badged actions.
- [ ] Inner reveals more context / hierarchy instead of just enlarging.
- [ ] No grid, card or chart cut by the hinge.
- [ ] Text keeps a readable measure.
- [ ] Menus, sheets and overlays sit entirely inside one usable region.
- [ ] Dark Mode resolves through semantic tokens.
- [ ] Community numbers are never labelled "Apple" without checking the original source.

The full Apple-based checklists per phase are in `duo-handoff-testing.md` §8.
