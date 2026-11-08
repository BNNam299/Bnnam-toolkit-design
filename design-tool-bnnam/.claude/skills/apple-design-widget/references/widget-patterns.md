# Widget layout patterns — Apple kit anatomy, 13 Home Screen patterns, Lock Screen and StandBy patterns, gallery copy

> Source: Apple iOS UI kit widget pages (Widgets · StandBy Widgets · Clocks · Home Screen strips, read from the designer's Figma file
> *Carplay – F1 – IOS*, node `122:721`) + 58 screenshots of third-party widgets in the iOS widget gallery and Lock Screen editor
> (designer's capture, Oct 2026: ChatGPT, Claude, Chrome, Grab, Instagram, TikTok, Threads, Facebook, Messenger, Opal, Reddit,
> Shopee, BIDV SmartBanking, Lark, Gmail, SoundCloud, Behance, Ambient Music, App Store, Books, Files, Calendar, Clock, Weather,
> Batteries, Safari) + designer's widget UX brief — redrawn as wireframes, no image copied.

Rules (sizes, margins, limits) live in `../SKILL.md`; Apple's own wording in `../../apple-hig/references/widgets.md`. This file is
**the idea bank**: what real widgets look like, so a new widget starts from a proven skeleton instead of a shrunken app screen.
For Android widgets use `../../android-design-widget/SKILL.md` (canonical layouts in dp, grid cells).

Wireframe legend: `╭─╮` widget container (system corner, concentric radius inside) · `[▢]` image / artwork · `(◯)` avatar or round
button · `▭` button / chip · `⌕` search field · `●` brand logo / glyph · `▁▃▅` chart · `━━━○──` progress · `☐ / ☑` checkbox ·
numbers in the margin are pt at the 393 × 852 row (small 158 × 158 · medium 338 × 158 · large 338 × 354).

## Contents
1. Seven principles and when a widget is the wrong surface
2. Anatomy and layer naming (Apple kit)
3. Home Screen patterns A — Apple's six base patterns
4. Home Screen patterns B — seven patterns from real apps
5. Growing a pattern across sizes
6. Branding without breaking the system look
7. States: placeholder, loading, empty, needs setup, signed-out, error, stale, after a tap
8. Lock Screen accessory patterns (circular, rectangular, inline)
9. StandBy and Night Mode
10. Gallery: names, descriptions, several widgets per app
11. Pattern picker by app type
12. Review checklist (UX)

---

## 1. Seven principles and when a widget is the wrong surface

| Principle | Test |
|---|---|
| **Glanceable** | The main information is understood in 1–2 s. |
| **Focused** | One primary use case per widget; a second purpose = a second widget kind. |
| **Actionable** | At most a few clear quick actions; everything else deep-links into the app. |
| **Fresh** | Data is recent enough, and its age is visible when it may be stale. |
| **Adaptive** | Each size has its own content strategy — never the same layout scaled. |
| **Accessible** | Readable (≥ 11 pt, Dynamic Type), hittable (aim for 44 × 44 pt), VoiceOver labels; meaning never by colour alone. |
| **Platform-native** | Follows iOS (system fonts, SF Symbols, tint and clear appearances); don't force one look onto iOS and Android. |

Don't: put the whole app into a widget · stack many buttons or levels of navigation · scale one layout up · show old data with no
"updated" cue · use the widget as an ad banner or a giant app icon. Real-time progress (delivery, match, timer) → Live Activity
(`../SKILL.md` §7–9), not a widget forced to refresh.

---

## 2. Anatomy and layer naming (Apple kit)

```text
Maps – Light – Small (158 × 158)            Reminders – Light – Medium (338 × 158)
╭──────────────────────╮                    ╭────────────────────────────────────────────╮
│ Widget Container     │                    │ ● Symbol 34       Task 1 ○ Pick up arts…   │
│  [Map, full bleed ]  │                    │                   ───────────────────────  │
│        (◯) current   │                    │                   Task 2 ○ Send cookie…    │
│            location  │                    │ 17      ← count   ───────────────────────  │
│                      │                    │ Reminders ← caption Task 3 ○ Book club…    │
╰──────────────────────╯                    │  Header 75 wide   Task 4 ○ Hike…           │
 Maps   ← Widget Label (16 high, 5 below)   ╰────────────────────────────────────────────╯
                                             margins 16 · header column + Task Container 208 wide, rows ~36 with 1 pt separators
```

- Every kit widget = **`<App> – <Light|Dark|Neutral> – <Small|Medium|Large>`** frame holding **`Widget Container`** (the rounded
  surface) and, on Home Screen mock-ups, **`Widget Label`** (app name under the widget, 16 high, 5 below, centred).
- Inside the container the kit groups by role: `Header` (`Symbol Container` + `Text Container`), a content container
  (`Task Container`, list rows as instances), separators as their own `Separator Container`.
- Variants seen in the kit: appearance (Light / Dark / Neutral), state (`State=Default | Now Playing`), style
  (`Style=Folder | Note`, `Type=Up Next | Date | Month`), options (`Buttons=False | True`, `Stories=False | True`).
- The kit ships the two common size rows: **155 / 329 / 345** (375 × 812) and **158 / 338 / 354** (393 × 852) — the same numbers as
  the table in `../SKILL.md` §4. Mock up at 393; the system scales for other phones.
- Presentation boards put each widget in a 254 × 254 / 434 × 254 / 434 × 450 neutral card with the label underneath — board
  framing, not part of the widget.

---

## 3. Home Screen patterns A — Apple's six base patterns

### A1 · Big number (one value owns the widget)
```text
Small                         Medium
╭────────────────────╮        ╭──────────────────────────────────────────╮
│ ● Porto        ☀   │        │ Porto              ☀ Sunny               │
│ 29°                │        │ 29°                H:30° L:13°           │
│                    │        │ 1PM  2PM  3PM  4PM  5PM  6PM             │
│ Sunny              │        │  ☀    ☀    ☀    ☀    ☀    ☀              │
│ H:30° L:13°        │        │ 29°  28°  27°  23°  19°  17°             │
╰────────────────────╯        ╰──────────────────────────────────────────╯
```
Apple: Weather 29°, Batteries 100 %, Stocks 349.74, Calendar "22", Activity 350/475 CAL. The number is the largest, boldest text;
one label above (place / name), one or two lines below (condition, range). Medium adds a row of time-based detail; Large adds a
daily list under it (Weather: hourly row + 5 day rows).

### A2 · List
```text
Medium                                         Large
╭──────────────────────────────────────────╮   ╭──────────────────────────────────────────╮
│ ● All Inboxes                       1,064│   │ ▭ Notes                       ● ● ●      │
│ Kenzie Lawson                    9:03 AM │   │ My poems                                 │
│ Meeting Reminder                         │   │ 30 Notes                                 │
│ ByteWorks Support                8:59 AM │   │ Love letters                             │
│ Account Update                           │   │ 41 Notes                                 │
╰──────────────────────────────────────────╯   │ … 5 rows                                 │
                                               ╰──────────────────────────────────────────╯
```
Apple: Mail, Notes, Reminders, News "Top Stories", Calendar "Up Next". Header = coloured title + count; rows = bold primary line +
secondary line + trailing meta (time, count). Medium 2–3 rows, Large 4–6. Each row deep-links to that item.

### A3 · Grid of items
```text
Small (Contacts)        Medium (Contacts)                  Medium (Batteries)
╭──────────────────╮    ╭──────────────────────────────╮   ╭──────────────────────────────╮
│      (◯)         │    │ (◯)    (◯)    (◯)    (◯)     │   │ (▯)    (◯)    (◯)    (◯)     │
│     Ashwin       │    │ Ashwin Jordan Kaya  Cameron  │   │ 100%   80%    60%    25%     │
│  (💬)     (📞)   │    │                              │   │ ring = charge, glyph = device │
╰──────────────────╯    ╰──────────────────────────────╯   ╰──────────────────────────────╯
```
Apple: Contacts (1 → 4 → 8 people), Shortcuts (2 → 4 → 8 coloured tiles), Batteries (rings). Items are equal; the grid grows with the
size, never the items.

### A4 · Full-bleed image
```text
Small                        Medium
╭──────────────────────╮     ╭──────────────────────────────────────────╮
│[▢ photo fills the    ]│     │[▢ artwork          ] [▢ second item     ]│
│[  whole container    ]│     │                                          │
│ Featured              │     │ Trying            For All Mankind        │
│ Photo                 │     │ Comedy            Drama                  │
╰──────────────────────╯     ╰──────────────────────────────────────────╯
```
Apple: Photos, Maps (map + current-location dot), TV, News lead image. Label sits bottom-left on a scrim; no margin around the image.

### A5 · Chart / progress
```text
Medium (Activity)                              Medium (Stocks)
╭──────────────────────────────────────────╮   ╭──────────────────────────────────────────╮
│ ◎◎◎   MOVE      ▁▃▅▇▅▃▁                   │   │ ^GDAXI  ▁▂▃▅▆▇  12,345.67 +4.53          │
│       EXERCISE  ▁▂▅▃▁                     │   │ APPLE   ▁▃▂▅▆▇     349.74 +4.50          │
│ 350/475CAL  STAND ▮▮▮▮▮                   │   │ GOOG    ▂▃▅▅▆▇   1,428.34 +4.53          │
╰──────────────────────────────────────────╯   ╰──────────────────────────────────────────╯
```
Rings, sparklines, bars. Colour carries series identity but every value is also printed as text.

### A6 · Clock
```text
Small analog        Small digital        Small world (4 cities)      Medium world
╭─────────────╮     ╭─────────────╮      ╭─────────────╮             ╭──────────────────────────────╮
│  ⏲ 12       │     │    NYC      │      │ ⏲NYC  ⏲LON  │             │ ⏲     ⏲      ⏲      ⏲        │
│ 9  •  3     │     │   12:41     │      │ ⏲DUB  ⏲SYD  │             │NewYork London Dubai Sydney   │
│     6       │     │    +3       │      │             │             │+3HRS  +8HRS  +11HRS +17HRS   │
╰─────────────╯     ╰─────────────╯      ╰─────────────╯             ╰──────────────────────────────╯
```
Kit variants: light / dark face, numerals / ticks only, city code + offset inside the face, 4-up grid. Small = 1 city or 2 × 2;
Medium = 4 cities with name, day, offset.

---

## 4. Home Screen patterns B — seven patterns from real apps

### B1 · Search field + shortcut buttons (the most common third-party pattern)
```text
Medium                                         Small
╭──────────────────────────────────────────╮   ╭────────────────────╮
│ ╭────────────────────────────────────╮   │   │ ╭────────────────╮ │
│ │ ● Search or type URL            ○  │   │   │ │ ● Ask          │ │
│ ╰────────────────────────────────────╯   │   │ ╰────────────────╯ │
│                                          │   │ ╭──────╮ ╭──────╮  │
│  ▭ ⌂ Feed   ▭ 🎂 Birthdays  ▭ 👥 Friends  │   │ │  📷  │ │  ⦀   │  │
╰──────────────────────────────────────────╯   │ ╰──────╯ ╰──────╯  │
                                               ╰────────────────────╯
```
Seen in: Chrome (search + incognito · voice · lens), Claude ("How can I help you today?" + camera · voice · code · app), Instagram
(search + home · reels · messages), TikTok (search + Following · Post · Inbox), Facebook ("Ask Meta AI or search" + Feed ·
Birthdays · Friends), Gmail ("Search in mail" + Compose · unread). Small = field + 2 buttons, or a 2 × 2 grid (ChatGPT: Ask ·
camera · voice). Field is pill-shaped, ~44 high, brand logo leading, placeholder in secondary grey; buttons equal width, monochrome
glyph, label when the glyph is not obvious. Each target opens its own screen. **Max 4 buttons.**

### B2 · Action grid
```text
Small (Grab)               Medium (BIDV)                                Small (ChatGPT shortcuts, 2 × 2)
╭────────────────────╮     ╭──────────────────────────────────────────╮ ╭────────────────────╮
│ ☾ Late-night       │     │ ╭───────────╮                     BIDV●  │ │ ▭ 💬 Chat ▭ 📷 Cam │
│   delivery?        │     │ │    ＋     │   (⇄)        (📱)          │ │ ▭ 🖼 Photo ▭ ⦀ Voice│
│  (🚗)     (🍴)     │     │ │ Show my QR│  Transfer   Top up phone   │ ╰────────────────────╯
│  (🛵)     (🚌)     │     │ ╰───────────╯                            │
╰────────────────────╯     ╰──────────────────────────────────────────╯
```
Equal round or rounded-square buttons, glyph + short label. A contextual one-line prompt on top is allowed (Grab "Late-night
delivery?" changes with time of day). One primary tile may be larger (BIDV QR). Vietnamese labels seen: *Hiển thị mã QR của tôi*
(show my QR code), *Chuyển tiền* (transfer), *Nạp tiền điện thoại* (top up phone).

### B3 · Recommended / trending content
```text
Medium (Threads)                               Small (TikTok)          Medium (App Store Today)
╭──────────────────────────────────────────╮   ╭────────────────────╮  ╭──────────────────────────────────────────╮
│ ▭Trending now  Summarized by AI       ●  │   │ [#]           ●    │  │[▢ event artwork, full bleed          ●]  │
│ Đề xuất hiến tạng dưới 18 tuổi    [▢]    │   │ #TikTok            │  │ ANNIVERSARY EVENT                        │
│ 8K posts                                 │   │ Trending now       │  │ 10 years on the Liên Quân battlefield    │
│ Sprite Spicy Fest diễn ra ở Hà Nội [▢]   │   │ [▢][▢][▢][▢]       │  ╰──────────────────────────────────────────╯
│ 3K posts                                 │   ╰────────────────────╯
╰──────────────────────────────────────────╯
```
Accent chip ("Trending now", tinted background) + 1–2 headline rows with count and thumbnail; or one hero item full bleed with an
eyebrow line. Also: Instagram Suggested Reels (4 thumbnails), Behance Featured Works (one artwork). Content must rotate during the
day; the AI attribution line ("Summarized by AI") is set small and secondary.

### B4 · People row
```text
Medium (Instagram Stories / Messages)          Small (Messenger Recent)
╭──────────────────────────────────────────╮   ╭────────────────────╮
│ Stories                               ●  │   │ ● Recent           │
│ (◯+)   (◯)      (◯)      (◯)             │   │       (◯)①         │
│ Your   y.ennie  vkhanh   hisu.px         │   │                    │
│ story   •                 •              │   │     Linh Yến       │
╰──────────────────────────────────────────╯   ╰────────────────────╯
```
4 avatars on Medium, 1 large avatar on Small. Ring (story) or dot / count badge (unread) is the only status mark; first slot can be
the user's own "add" avatar. Tap avatar → that person's chat / story.

### B5 · Status + session control
```text
Medium (Opal focus)                            Small (Books goal)
╭──────────────────────────────────────────╮   ╭────────────────────╮
│ ◆42 · ⌛2048                          ○   │   │ [▢ cover]      📖  │
│              [▢ hero gem]                │   │                    │
│ Focus Session                ▭ 🔓 Unblock │   │ Browse the store   │
│ 30:01                                    │   │ and find your next │
│ ━━━━━━━━━━○─────────────────────         │   │ ○ 5 min to goal    │
╰──────────────────────────────────────────╯   ╰────────────────────╯
```
Large timer / value + progress bar + **one** contextual action. Brand surface (dark, saturated) is fine because the content is
minimal. Books shows a goal ring + "5 min to goal" at the foot.

### B6 · Quick play / mood tiles
```text
Small (Ambient Music)          Medium (Ambient Music)
╭────────────────────╮         ╭──────────────────────────────────────────╮
│ [▢]            ⁂   │         │ ▭ Sleep        [▢]  ▭ Chill         [▢] │
│ Ambient Bedtime    │         │   ▶ Play Ambient…     ▶ Play Laidback…   │
│ Sleep              │         │ ▭ Productivity [▢]  ▭ Wellbeing     [▢] │
│ ▭ ▶ Play           │         │   ▶ Play Momentum…    ▶ Play Calm Piano  │
╰────────────────────╯         ╰──────────────────────────────────────────╯
```
Small = one playlist + Play button; Medium = 2 × 2 mood tiles, each its own play intent. SoundCloud "Your likes": header with
avatar + 4 square artworks. Brand-colour surface (purple) carries identity.

### B7 · Re-order / offer card (commerce)
```text
Medium (Grab Food — Order Again)
╭──────────────────────────────────────────╮
│ Order Again                         Grab●│
│ [▢ dish]  Trà Sữa Đô Đô – Nguyễn A…       │
│           27 mins · 2.02 km · ★ 4.6       │
│           ▭ 🏷 6.000đ off                 │
│ (←)                                  (→) │
╰──────────────────────────────────────────╯
```
One item at a time with arrows to step (interactive buttons), image + name + meta + offer chip. Variant: full-bleed photo with the
store name on top. Shopee small: coin illustration + "Nhận" (claim) button. **Caution:** offers and claim buttons drift towards
advertising — keep them tied to the user's own history (re-order, rewards they earned), never a pure promotion; Live Activities
forbid ads outright (`../SKILL.md` §7).

---

## 5. Growing a pattern across sizes

```text
Small: 1 key fact (+1 action)   Medium: key fact | list or detail   Large: key fact + list + more rows/sections
╭───────────╮                   ╭─────────────┬─────────────────╮   ╭─────────────────────────────╮
│  29°      │                   │ 29°         │ hourly row      │   │ 29°          ☀ Sunny         │
│  Sunny    │                   │ Sunny       │                 │   │ hourly row                  │
╰───────────╯                   ╰─────────────┴─────────────────╯   │ Tue … Sat daily rows        │
                                                                    ╰─────────────────────────────╯
```
- Keep the **same purpose and the same anchor element** in every size (the big number stays top-left; the search field stays on top).
- Medium usually splits **left: identity / key value · right: list or actions** (Reminders, Calendar, Batteries) or adds a second row
  of items (Contacts, Shortcuts, Photos).
- Large adds **depth** (more rows, a second section such as "Tomorrow", a chart), never bigger type.
- Only offer the sizes that add value; many real apps ship Small + Medium only.

---

## 6. Branding without breaking the system look

| Technique | Seen in | Use when |
|---|---|---|
| Small logo top-right | TikTok, Instagram, Threads, App Store, Grab wordmark | Content is generic (a list, a search field) and needs attribution |
| Brand-colour surface | Ambient Music (purple), Books (orange), Opal (dark) | Content is minimal (one playlist, one goal, one timer) |
| Accent colour on title / chip only | Notes (yellow header), Reminders (red count), Threads chip | Default — neutral surface, brand in the accent |
| Brand illustration | Shopee coin mascot, Reddit "Looong Cat" | Delight on a small surface; never on data-heavy widgets |

- Brand must never be the only thing making text readable — widgets render tinted / clear / monochrome (`../SKILL.md` §5).
- Light and Dark variants are both designed (kit ships every widget in both).
- In the gallery the **Add Widget** button takes the brand colour (Ambient purple, Calendar red); everything else stays system.

---

## 7. States: placeholder, loading, empty, needs setup, signed-out, error, stale, after a tap

```text
Needs setup (Lark, Small)      Empty (Safari, Small)        Needs setup (Grab Transport, Medium)
╭────────────────────╮         ╭────────────────────╮       ╭──────────────────────────────────────────╮
│        📄＋        │         │ ⓘ Reading List     │       │ Tap and hold to edit your          [▢🚗] │
│ Tap and hold to    │         │                    │       │ Saved Places                             │
│ add Docs           │         │     No Items       │       │ (⌂)     (＋)      (＋)      (⌕)          │
╰────────────────────╯         ╰────────────────────╯       │ Home    Add       Add       Where…       │
                                                            ╰──────────────────────────────────────────╯
```
| State | Design |
|---|---|
| **Placeholder** (gallery, first render) | Static parts + semi-opaque bars / circles for dynamic content, final layout, no real data |
| **Loading** | Same skeleton as placeholder; never a spinner alone |
| **Empty** | Name the list + one calm line ("No Items", "No Events Today") — keep the header so the widget still says what it is; fill the space, no sparse corners |
| **Needs setup** | Say the gesture and the result: "Tap and hold to add Docs", "Tap and hold to edit your Saved Places"; show empty slots (＋) in the final layout |
| **Signed-out / no permission** | Say what signing in adds ("Sign in to view reservations"), one tap opens the sign-in screen |
| **Error / offline** | Keep last good data + small "Updated 10:24" or "Offline" line; a refresh button only if data can change faster than the system refreshes |
| **Stale** | "Updated …" timestamp; never hide stale data behind placeholder |
| **After a tap** (button / toggle) | Widget reflects the new state immediately (checked task, Play → Pause); if the action fails, revert and show it in the app |

---

## 8. Lock Screen accessory patterns

Rendered **monochrome, vibrant** over the wallpaper — design in one colour with opacity steps, never rely on hue.

```text
CIRCULAR 72 × 72                               RECTANGULAR 160 × 72
 Glyph launcher   Gauge          Clock          Big value + label        2–3 info lines          Brand art
╭──────╮        ╭──────╮       ╭──────╮        ╭──────────────────╮     ╭──────────────────╮    ╭──────────────────╮
│  ●   │        │ ◜22◝ │       │ CUP  │        │ ⏰ Alarm          │     │ CUP 07:18 −14    │    │  ✦ ▬▬╮  ⬆ ✉     │
│      │        │18  31│       │ ⏲    │        │ 06:05            │     │ TOK 23:18 +2     │    │ ◉ ⬆ ╰──▬ ✦      │
╰──────╯        ╰──────╯       ╰──────╯        ╰──────────────────╯     │ SYD 01:18 +4     │    ╰──────────────────╯
                                                                        ╰──────────────────╯
```
| Shape | Pattern | Seen in |
|---|---|---|
| Circular | **Glyph launcher** (by far the most common) | ChatGPT new chat · voice · Codex, Chrome search · Dino, TikTok Now camera, Instagram Instants camera · Reels · Create · Explore |
| Circular | **Gauge** — value in the centre, ring = range or progress | Weather temperature (22, ring 18–31), UV index 6 |
| Circular | Analog city clock / on-off state | Clock City Analog, Opal "OFF" |
| Rectangular | **Big value + small label** | Clock City Digital "Cupertino −14HRS 07:18", Next Alarm "06:05" |
| Rectangular | **2–3 information lines** | World Clock (3 cities), Weather Conditions (22° Partly Cloudy H:31° L:18°), Opal "No Apps Blocked", Facebook "Top updates · Đức Anh accepted your friend request" |
| Rectangular | **One content excerpt** | Reddit Front Page (r/pics + post title) |
| Rectangular | **Brand illustration launcher** | Reddit "Looong Cat Butt / Head" |
| Inline | One line above the clock: glyph + short text, **one** tap target | (not in the captures — Weather condition, next event) |

- HIG asks Lock Screen widgets to give information, not just launch the app; in practice the top apps ship glyph launchers
  anyway. Rule for our designs: **offer at least one informative accessory** (gauge or rectangular) and add launchers as extras.
- Many apps pair sizes: Circular + Rectangular of the same data (Clock City Digital, Next Alarm, Opal OFF / No Apps Blocked).
- Gallery copy for Lock Screen: title + one-line description + "Tap or drag to add widget."

---

## 9. StandBy and Night Mode

```text
StandBy (iPhone landscape, charging) — two widgets side by side, each the small widget scaled up
╭──────────────────────────────╮ ╭──────────────────────────────╮
│  ⏲ big analog clock          │ │ JUNE                         │
│                              │ │ S M T W T F S                │
│                              │ │ … ⑦ …  (today in red)        │
╰──────────────────────────────╯ ╰──────────────────────────────╯
Night Mode: same layout, every element red on black
```
- Background removed (pure black); content keeps colour in text, glyphs and charts (Fitness rings, Stocks green, Calendar red).
- Type gets bigger and bolder: one value per widget (76°, 100 %, 180.95, 2h 43m, $1,682.55).
- Kit variants show what StandBy is for: Clock (7 styles), Calendar (Up Next · Date · Month), Stocks (Symbol / Watchlist, with or
  without Stories), Home (switch on / off), Contacts (with / without buttons), Batteries (single / multi device).
- Night Mode (low light) renders everything **monochrome red** — test contrast of every element in red only.

---

## 10. Gallery: names, descriptions, several widgets per app

```text
╭──────────────────────────────────────────╮
│ ● Grab                                ✕  │  app icon + name
│                                          │
│              Transport                   │  widget name (title, bold)
│  The widget can display up to 3 Saved    │  description (secondary)
│  Places.                                 │
│                                          │
│        ╭──────────────────────╮          │  realistic preview
│        │  live-looking preview │          │
│        ╰──────────────────────╯          │
│                • ○ ○                     │  page dots = widget kinds
│  ▭ ⊕ Add Widget   (brand colour)          │
╰──────────────────────────────────────────╯
```
- One widget **kind** per purpose, each with its own name: Instagram (Messages · Suggested Reels · Shortcuts · Stories), TikTok
  (Trending · TikTok LIVE · Search), Chrome (Search · Password Manager · Dino Game · Quick Actions · Shortcuts), Weather Lock Screen
  (8 kinds).
- Names are short nouns of the job: *Up Next*, *Recents*, *Order Again*, *Quick Actions*, *Continue*, *Featured Works*.
- Descriptions start with a verb and promise the value: *"Keep track of your upcoming events and meetings."* · *"See what's blocked
  and take a break, right from your home screen."* · *"Quickly start a new chat with ChatGPT."* · *"Discover, create and share
  short videos."*
- **Anti-example (seen in the wild):** Grab Food — *"This widget displays Food recommendations."* → rewrite: *"See food picks near
  you and reorder in one tap."*
- Preview uses realistic content (real-looking names, numbers, artwork) at the exact size; it must match what appears after adding.

---

## 11. Pattern picker by app type

| App type | Small | Medium | Large / Lock Screen |
|---|---|---|---|
| AI assistant / chat | B1 2 × 2 (Ask · camera · voice) | B1 prompt field + 3–4 tools | Circular glyphs: new chat, voice |
| Browser / search | B1 field + 1 button | B1 field + 3 modes | Circular search; Dino-style delight |
| Social / messaging | B4 one avatar + badge | B4 4 avatars, or B3 trending | Circular camera / create; Rectangular latest update |
| Food / ride / commerce | B2 4 actions with time-of-day prompt | B7 Order Again card; B2 saved places | Rectangular order status → better as Live Activity |
| Banking / wallet | B2 QR + 2 actions | B2 large QR tile + actions | A1 balance only if privacy allows (hide on Lock Screen) |
| Productivity / notes / tasks | A2 count + caption | A2 header column + 4 rows | A2 6 rows; Rectangular next item |
| Focus / health / habit | B5 value + ring | B5 timer + bar + one action | Circular gauge; Rectangular status |
| Music / audio | B6 one playlist + Play | B6 2 × 2 moods or 4 artworks | Rectangular now playing |
| Utilities (weather, clock, battery) | A1 / A6 | A1 + hourly row / A3 rings | A1 + daily list; Circular gauge |
| Car / CarPlay companion | A1 battery or range, or A4 parked-car map | A4 map + address; B2 car actions | Circular range gauge; Rectangular status |
| Games / content | B3 hero artwork + event line | B3 full-bleed event | Circular launcher with brand glyph |

---

## 12. Review checklist (UX)

- [ ] Value understood in 2 s; one primary use case per widget kind.
- [ ] Most important information is first in the visual hierarchy.
- [ ] Small, Medium, Large each have their own content strategy (§5); no stretched layout.
- [ ] Targets ≥ 44 × 44 pt; ≤ 4 actions side by side; each tap deep-links to the right screen.
- [ ] Placeholder, loading, empty, needs-setup, signed-out, error / offline, stale and after-tap states are drawn (§7).
- [ ] Old data is visible as old ("Updated …").
- [ ] Works in Light, Dark, tinted and clear appearances, on busy wallpapers, and with large Dynamic Type.
- [ ] VoiceOver reads content and actions in visual order; icon buttons have labels; decorative images are hidden.
- [ ] Lock Screen versions read in one colour; at least one is informative, not only a launcher.
- [ ] Gallery name + verb-first description; preview matches the real widget.
- [ ] Not an ad banner; offers only from the user's own context.
