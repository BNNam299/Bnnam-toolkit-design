# UX writing — hard rules for every project

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/core/ux-writing.md @ 3c0e291 — translated, complete

These are the rules that apply to **every project**. How they apply to **this project** — voice, tone, lengths, forbidden words,
terminology — lives in the project voice file `design/voice.md`, the **single source of truth for the project's words**
(how to write it: `voice-and-tone.md`; template: `../assets/voice.template.md`). The in-depth handbook: `handbook.md`.

Vietnamese UI copy examples are kept verbatim (they are content); the English gloss follows in *(italics)*.

## Contents
1. Words are a UX decision, not decoration
2. Two text zones — hard rule
3. Eight principles, each with a test
4. Verification and affordance
5. Honesty limits
6. Six questions before writing
7. Button labels and commands
8. Error messages
9. Vietnamese
10. Copy review procedure
11. Writing in wireframes
12. Status messages are not content cards

---

## 1. Words are a UX decision, not decoration

`Continue` and `Start free trial` produce different tap rates and different expectations. **Changing the words changes the behaviour.**

---

## 2. Two text zones — hard rule

```text
INSIDE the screen frame   →  PRODUCT content — the app's user reads it and taps it
OUTSIDE the screen frame  →  notes — designers, developers, reviewers read them
```

The inside of the frame **is** the screen. The outside (wireframe notes, dev notes) **talks about** the screen. This applies to
**both wireframes and UI**. Every explanation of a screen — what it is for, where it is entered from, when it shows, which button is
disabled — lives **only outside the frame**.

**This is the mistake agents make most often when writing copy.** The agent knows what the screen is for, so it tends to *describe*
the screen instead of *writing* it. Evidence: a widget cell labelled `Preview` and `Car Style · your car photo` — a description telling
the designer what the cell contains, not what the user sees on their phone.

### 2.1 The one-sentence test

> **If a screenshot of this screen were posted on the App Store, would this sentence stand up?**

No → the sentence belongs in a note, not on the screen.

### 2.2 Seven kinds of text that must not be inside the frame

| Kind | Wrong | Right |
|---|---|---|
| **Describing a component's role** | `Hành động chính của màn` *(Primary action of the screen)* · `Card trạng thái kết nối` *(Connection status card)* | `Tiếp tục` *(Continue)* · `Đã kết nối với Camry` *(Connected to Camry)* |
| **Design specs** | `Tiêu đề 22pt, đậm` *(Title 22pt, bold)* · `Padding 16` · `#3AADFF` | `Chọn cách giới hạn các app này` *(Choose how to limit these apps)* |
| **Placeholder text** | `Label` · `Title` · `Button` · `Description` · `Text` · lorem ipsum · `TBD` · `xxx` · `[tên]` *([name])* | real copy following `voice.md` |
| **Trade jargon** | `Empty state` · `CTA` · `Paywall` · `Onboarding` · `Toast` · `Hero` | `Chưa có nhóm chặn nào` *(No block groups yet)* |
| **Technical names** | `image_too_large` · `user_id` · `FR-014` · `API error 500` | `Ảnh lớn quá — thử ảnh nhỏ hơn` *(Image too large — try a smaller one)* |
| **Explaining behaviour** | `Bấm vào đây mở màn Paywall` *(Tap here to open the Paywall screen)* · `Hiện khi chưa có dữ liệu` *(Shown when there is no data yet)* | *(move it to a note)* |
| **Screen, state or layer names** | `Home_Empty` · `Preview` · `Slot 1` *(when the user never sees that word)* | *(the name lives on the layer, not in the text)* |

`Slot 1` **is allowed** if the real interface shows that word to the user — e.g. a slot-picker chip. The App Store test decides.

### 2.3 Image placeholders

Wireframe: a **crossed box with no text**. The image description goes in the **layer name** (`image · ảnh xe từ bên hông`
*(image · side photo of the car)*) — layer names are not shown on screen, so this does not break the rule. UI: the real image, or a
text-free placeholder box with a layer name as above.

### 2.4 Exception

The app **really** shows technical text to its user — a diagnostics screen meant to be sent to support, an app for developers.
Record the decision with its reason in the project's decision notes; otherwise every piece of technical text inside a frame is a defect.

### 2.5 Machine check — before every "screen done" report

Scan every text node inside the frame, except icon glyphs, against these patterns:

```js
const META = [
  /\b(label|title|subtitle|description|button|text|placeholder|lorem|ipsum|tbd|todo|xxx)\b/i,
  /\b(empty state|cta|paywall|onboarding|toast|modal|bottom sheet|hero|skeleton|tooltip)\b/i,
  /\b(hành động chính|thành phần|trạng thái rỗng|màn hình này|bấm vào đây sẽ|hiện khi)\b/i,
  /\b\d+\s?(pt|px)\b|#[0-9a-f]{6}\b|\b(bold|semibold|regular|medium)\b/i,   // specs
  /\b[a-z]+_[a-z_]+\b|\b(FR|UC|WF|DEC|SCR|ST)-\d+/,                        // technical names, IDs
  /[\[{<][^\]}>]{1,40}[\]}>]/,                                              // [name] {value} <text>
];
```

The third pattern holds Vietnamese meta phrases: *primary action · component · empty state · this screen · tapping here will · shown when*.

Add to that: the project's **forbidden words** from `voice.md`, and the *text equals layer name* check (`Title` inside a layer named
`Title` = a placeholder never replaced).

In the tool demo, `audit_design{rootId, checks:["content"]}` only flags lorem. For the full scan, send this read-only snippet through
`execute_code` (set `ROOT_ID` and `FORBIDDEN` first; paste the `META` array above where marked):

```js
const ROOT_ID = "<screen frame id>";
const FORBIDDEN = [];                       // forbidden words from design/voice.md
const META = [ /* paste the six patterns above */ ];
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) return { error: "ROOT_ID not found" };
const hits = []; let scanned = 0;
for (const t of root.findAll(n => n.type === "TEXT" && n.visible !== false)) {
  const c = (typeof t.characters === "string" ? t.characters : "").trim();
  if (!c || c.length === 1 || /^[-]+$/.test(c)) continue;   // icon glyphs
  scanned++;
  const why = [];
  META.forEach((re, i) => { if (re.test(c)) why.push("meta#" + (i + 1)); });
  for (const w of FORBIDDEN) if (c.toLowerCase().includes(w.toLowerCase())) why.push("forbidden:" + w);
  if (c.toLowerCase() === t.name.trim().toLowerCase()) why.push("text=layer-name");
  if (why.length) hits.push({ id: t.id, layer: t.name, text: c.slice(0, 80), why });
  if (hits.length >= 200) break;
}
return { scanned, hits };
```

For a whole page, `../ux-review-handoff/scripts/audit.js` runs the same META patterns plus forbidden words, glossary terms
(`TERMS`), length limits (`LIMITS`) and capitalization (`CASE`) from `voice.md` — see `metaText`, `placeholderText`, `forbiddenWord`,
`termMismatch`, `length`, `caseCheck` in its result.

Note: JavaScript `\b` is ASCII-only, so an alternative that ends in a non-ASCII letter (`bấm vào đây sẽ`) matches only when an ASCII
letter or digit follows it. Treat a clean result for that phrase as unproven and read the text yourself.

The machine catches most of it. The rest — a sentence that *describes* the screen in plain words (*"Nơi bạn xem lại các bữa ăn"*
*(The place where you review your meals)* used as a title instead of a real title) — needs the **App Store test by eye** before
reporting done.

---

## 3. Eight principles, each with a test

| # | Principle | Test |
|---|---|---|
| 1 | **Clear** | would a first-time, distracted user understand it on one read |
| 2 | **Concise** | does removing a word lose meaning · put the important word first |
| 3 | **Useful** | after reading, does the user know **what to do next** — especially in errors and empty states |
| 4 | **Voice and tone** | the voice is fixed; tone follows the moment — not cheerful in an error, no jokes during payment |
| 5 | **Consistent** | one concept, one word across the app · parallel elements share structure · same capitalization and number format |
| 6 | **Accessible** | would non-native speakers, screen-reader users and stressed users understand it |
| 7 | **Accurate and honest** | is every promise true of the real product — same as the **verification gate** (§4) |
| 8 | **Scannable** | reading only the headings and buttons, do you get the point |

**Severity:** a **clarity** or **accuracy** failure on an important action (CTA, permission, payment) is **high**. A conciseness
failure in a rarely seen tooltip is **low**. A string that breaks several principles at once gets priority.

## 4. Verification and affordance

- **Claim only what the app can measure.** If it can't be measured, switch from a *warning* to an *entry point to instructions*:
  `Not added yet` → `How to add widgets`. Every sentence of the form *"not done yet"*, *"running"*, *"failed"* is a technical
  assumption: it goes into the assumptions table of the flow document (`design/flows.md`, see `../prd-to-ux-flow/SKILL.md`) before
  the UI is built.
- **A chevron is a promise that there is a destination.** No destination → remove the chevron.
- Avoid empty marketing language · one button, one job.
- **Text rhythm** is measured from competitors (title 4–6 words, subtitle 8–12 words) — the project's concrete limits live in `voice.md`.

## 5. Honesty limits

- **Do not invent a brand voice.** With no voice guidance, say you are applying the general standard.
- **Do not claim new copy will raise conversion.** Say it is *expected*, and say how to test it.
- **Keep the user's meaning** — copy that reads better but promises a feature the app does not have is **broken**, not polished.
- **Respect length** — a good label that overflows its button is wrong.

---

## 6. Six questions before writing

Never write a string in isolation. Answer: **who** is reading · **what they want to do** (the real goal, not the internal feature
name) · **what they already know** · **what state they are in** (in a hurry, worried, just lost data, about to pay) · **what the risk
is if they misread** · **what the best next step is**.

**Content frame** — write it down, place it in a note outside the frame, **only for high-risk states**: delete, payment, permission
request, data-loss error, sensitive data. For ordinary screens, thinking through the six questions is enough.

```text
User · Situation · Goal · Required information · Worry/barrier
Primary action (verb + object) · Alternative action · Consequence/risk · Tone · Success criterion
```

(Full template with a worked example: `handbook.md` §3.)

## 7. Button labels and commands

- **Verb + object** when the object is not yet clear: *Lưu địa chỉ* *(Save address)*, *Gửi mã xác minh* *(Send verification code)*.
  When context makes it clear, the verb alone: *Lưu* *(Save)*, *Thử lại* *(Try again)*.
- Usually **2–4 words** — but clarity matters more than word count.
- The label states the **resulting state**, not the current one: if the item is hidden, the button is *Hiện* *(Show)*.
- **Same action, same label** everywhere.
- Avoid *OK*, *Có / Không* *(Yes / No)* when a specific verb exists.
- Destructive actions name the **object and the count**: *Xoá 12 tệp* *(Delete 12 files)*.
- Do not use a marketing feature name in place of a familiar command.
- A non-universal icon → a **visible label** or tooltip; an accessibility label cannot make up for sighted users not being able to guess.
- **A placeholder does not replace a label** — an input always has a visible label (`../mobile-ux-fundamentals/SKILL.md`).

**Action pairs in a dialog** — the title is a specific question, the two buttons are two specific actions:

| Vague | Clear |
|---|---|
| *Bạn có muốn lưu?* — Có / Không *(Do you want to save? — Yes / No)* | *Lưu thay đổi?* — **Lưu** / **Bỏ thay đổi** *(Save changes? — Save / Discard changes)* |
| *Bạn chắc chứ?* — OK / Huỷ *(Are you sure? — OK / Cancel)* | *Xoá 3 ảnh?* — **Xoá ảnh** / **Giữ ảnh** *(Delete 3 photos? — Delete photos / Keep photos)* |

Keep **position and emphasis** per each platform's convention; keep **meaning and terminology** shared across platforms.

## 8. Error messages

**Formula:** `[what happened] + [impact / whether data is kept or lost, if needed] + [how to fix it]` — drop any part that is already obvious.

> *Không thể lưu thay đổi vì mất kết nối. Nội dung vẫn còn trên máy — kết nối mạng rồi thử lại.*
> *(Couldn't save your changes because the connection dropped. Your content is still on the device — connect and try again.)*

**Three groups of criteria:**
- *visible* — close to the source of the error · not relying on colour alone · as prominent as its severity · not shown while the user
  is still typing
- *understandable* — plain words, no error codes · specific, main point first · includes a fix · no blaming, no jokes at a moment of failure
- *low effort to fix* — prevent errors up front · **keep the data already entered** · focus the right place, allow retry

| Don't write | Write |
|---|---|
| *Có lỗi xảy ra* *(An error occurred)* | *Không tải được đơn hàng. Kiểm tra kết nối rồi thử lại.* *(Couldn't load your orders. Check your connection and try again.)* |
| *Dữ liệu không hợp lệ* *(Invalid data)* | *Ngày hết hạn phải có dạng MM/YY.* *(The expiry date must be in MM/YY format.)* |
| *Bạn nhập sai mật khẩu* *(You entered the wrong password)* | *Mật khẩu không khớp. Thử lại hoặc đặt lại mật khẩu.* *(Password doesn't match. Try again or reset your password.)* |
| *Error 500* | *Máy chủ tạm không phản hồi. Thử lại sau vài phút.* *(The server isn't responding right now. Try again in a few minutes.)* |
| *Oops! Internet đi nghỉ rồi* *(Oops! The internet went on holiday)* | *Mất kết nối. Nội dung chưa gửi vẫn được lưu.* *(Connection lost. Unsent content is still saved.)* |

Need a reference code for support → put it in a secondary area and make it copyable; it never replaces the guidance.

## 9. Vietnamese

- A space **after** commas and periods; **no** space before punctuation.
- Money and units in **one format**: `450.000 ₫`.
- Headings in **sentence case** — do not capitalize every word English-style.
- *Bạn* *(you, neutral)* / *quý khách* *(valued customer, formal)* / dropping the subject — pick one in `voice.md` and **do not change
  it per screen**.

---

## 10. Copy review procedure

Use it when writing wireframes, when reviewing a whole set (`../ux-review-handoff/SKILL.md`), and whenever the user asks for a copy review.

1. **Inventory the copy** per screen and per kind (title · body · button · label · error · empty · help), **in reading order** — to
   expose repetition and drift between screens.
2. **Establish context:** what the user wants right now · product voice · platform · emotional temperature.
3. **Run the eight tests** (§3) and attach the violated principle to every issue.
4. **Rewrite, don't just criticise.** Every issue gets a before/after · add **one alternative** when there is a genuine strategic
   choice. *"Make it shorter"* is not feedback; *"drop 'in order to' → 'to', 6 words shorter"* is.
5. **Check consistency across the whole set** — fixing each string while the set still drifts is a **failure**.
6. **Note what must be tested with users or data** — where you are genuinely unsure, say how to test it.

## 11. Writing in wireframes

Write the CTA, titles and error messages **first** — they decide the flow. Write for **every state**, not just the main path.
Wireframes use **real copy**, not lorem ipsum — text length decides the layout.

---

## 12. Status messages are not content cards

An in-screen notice or reminder (*"Nhóm này đang khoá khi bật Hard mode"* *(This group is locked while Hard mode is on)*) **must look
different from the content cards** next to it — otherwise users read it as one more settings item. Write **one sentence** that states
the status; **give no how-to instruction** when no action comes with it. The concrete form (background or none, icon size) is **learned
from the notices already in the file**. Check by eye: a notice with a card-like fill and corner radius sitting among cards is a defect.
