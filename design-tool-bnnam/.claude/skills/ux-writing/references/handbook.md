# UX writing handbook — foundations

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/writing.md §11, §34.1–34.9 @ 3c0e291 — translated, complete

This handbook is a thinking lens, not a procedure: when it differs from the hard rules in `principles.md`, the hard rules win.
It is split in three files:

| File | Covers |
|---|---|
| `handbook.md` (this file) | Basics · what UX writing is · user, task and moment · how people read · legibility/readability/comprehension · plain language · structure · headings · links · commands |
| `handbook-patterns.md` | Copy by component and state · error messages in depth · voice and tone · accessibility · localization · Vietnamese before/after library |
| `handbook-process.md` | AI-assisted writing · process in product development · research and metrics · content system and governance · scorecard and Definition of Done · quick checklists · sources |

The chapter extends the basics (§1) into a handbook for writing, reviewing, researching and governing product content. Its main basis
is the [UX Writing Study Guide by Nielsen Norman Group](https://www.nngroup.com/articles/ux-writing-study-guide/) and the articles it
links, interpreted and systematised for Vietnamese products on iOS and Android — not a verbatim copy. Vietnamese UI copy is kept
verbatim with an English gloss in *(italics)*.

## Contents
1. Basics
2. What UX writing is
3. Start from the user, the task and the moment
4. How people read online
5. Three quality layers: legibility, readability, comprehension
6. Plain language: simple without impoverishing meaning
7. Content structure: inverted pyramid, chunking, progressive disclosure
8. Headings, titles and the first two words
9. Link labels and information scent
10. UI copy for buttons, menus and commands

---

## 1. Basics

### 1.1 Principles
- Clear first, short second, personality last.
- Use specific verbs for actions: “Lưu thay đổi” *(Save changes)*, “Xóa ảnh” *(Delete photo)*, “Gửi yêu cầu” *(Send request)*.
- The title describes the situation; the body explains the consequence or how to handle it.
- Keep the same term for the same object.
- Avoid blaming the user.
- Do not use “Có/Không” *(Yes/No)* when the question is long or vague; label by action.

### 1.2 Errors
A good error message answers:
1. What happened?
2. Is the data/work safe?
3. What does the user do next?

Good example: “Chưa tải được hóa đơn. Dữ liệu của bạn vẫn được lưu. Kiểm tra kết nối rồi thử lại.” *(Couldn't load the invoice
yet. Your data is still saved. Check your connection and try again.)*

### 1.3 Localization
- Do not build a sentence from several fragments.
- Leave room for longer translations.
- Use the system formatter for dates, times, numbers, currency, units and plurals.
- Support RTL with leading/trailing; mirror an icon only when its meaning has a direction.
- Check Vietnamese: diacritics, line height, long compound words, proper names and capitalization.
- Avoid putting text inside image assets.

### 1.4 AI content
- Say clearly when content is AI-generated or may be wrong.
- Distinguish user input, AI output and source data.
- Provide edit, retry, copy, report and undo where appropriate.
- Do not describe the AI as a person if that misleads users about its abilities.
- For risky actions, require the user to confirm the result before it is executed.

---

## 2. What UX writing is

**UX writing** is designing words based on users' context, needs, behaviour and emotional state, to help them understand the system,
make decisions and reach their goals. Words in the experience deserve the same deliberate consideration as layout, colour, components
and interaction.

Quality copy reaches several goals at once:
- **Useful**: appears at the right moment and answers what the user needs to know.
- **Clear**: the reader understands the meaning and consequence without decoding.
- **Actionable**: shows the next step or helps the user choose with confidence.
- **Honest**: does not hide conditions, costs, risks, or use dark patterns.
- **Consistent**: the same concept uses the same term across the product.
- **Context-appropriate**: tone reflects the severity and the current emotion.
- **Accessible and localizable**: can be read, understood when heard, and translated.
- **Supports product goals**: builds trust and conversion through real value, not deception.

### 2.1 Neighbouring concepts

| Concept | Scope | Example |
|---|---|---|
| UX writing | Designing the whole experience in words | Sign-up flow, permissions, errors, success states |
| UI copy | Command labels in interactive controls | “Lưu thay đổi” *(Save changes)*, “Tắt thông báo” *(Turn off notifications)*, “Thử lại” *(Try again)* |
| Microcopy/microcontent | Short text with large influence on navigation or decisions | Heading, link, helper text, tooltip, notification title |
| Content design | Using content and structure to meet user needs | Choosing which information appears, order, format, progressive disclosure |
| Content strategy | Organisation-level content lifecycle strategy | Governance, owners, taxonomy, workflow, measurement, localization |
| Marketing copy | Persuading the reader to care or buy | Landing page, campaign, ads |
| Technical writing | Explaining how to install, operate or integrate | API docs, help centre, manual |

The boundaries overlap. What sets UX writing apart is that the copy sits inside, or directly supports, a usage journey where the
choice of words can change whether the task gets done.

---

## 3. Start from the user, the task and the moment

Never write a standalone string. Before drafting, answer six questions:
1. **Who** is reading? A newcomer, a long-time user, an expert, or someone using assistive technology?
2. **What do they want to do?** The real goal, not the internal feature name.
3. **What do they already know?** Don't re-explain the obvious, but don't assume knowledge they don't have.
4. **What state are they in?** Normal, in a hurry, anxious, frustrated, having just lost data, or about to pay?
5. **What is the risk of misreading?** A few seconds' delay, losing money, exposing data, or an irreversible action?
6. **What is the best next step?** Choose, enter, read more, fix an error, wait, undo, or leave?

### 3.1 Content frame before writing

Use this short template for important screens or states:

```text
User: [who]
Situation: [what just happened]
Goal: [what they need to accomplish]
Required information: [what they must know to act]
Worry/barrier: [what might make them hesitate]
Primary action: [verb + object]
Alternative action: [if any]
Consequence/risk: [what must be stated clearly]
Tone: [calm, direct, supportive...]
Success criterion: [measured how]
```

Example — deleting an account:

```text
User: the signed-in account owner
Situation: chose delete account in Settings
Goal: understand the consequences and confirm, or go back
Required information: which data is deleted, when it takes effect, what can be restored
Worry: losing data, confusing it with signing out
Primary action: Xóa tài khoản (Delete account)
Alternative action: Giữ tài khoản (Keep account)
Tone: serious, neutral, no pressure
Success criterion: the user correctly predicts the consequences before confirming
```

---

## 4. How people read online

NN/g eye-tracking research shows users usually **scan** for relevant signals rather than reading every word in order. How they scan
depends on motivation, task, focus, layout and content type — so do not conclude that "nobody reads". When content is needed and well
presented, users still read carefully.

### 4.1 Four important patterns

| Pattern | Behaviour | When it usually happens | Design consequence |
|---|---|---|---|
| F-pattern | Reads a lot at the top, horizontal sweeps get shorter, then moves down the left edge | The page is a block of text with little structure | Break into paragraphs, add headings, put meaning-carrying words first |
| Spotted | Eyes jump to keywords, numbers, links, bold text or standout shapes | User is looking for one specific fact | Highlight selectively; too many highlights cancel each other out |
| Layer-cake | Scans headings, then reads only the relevant section | Page has a clear hierarchy and descriptive headings | Headings must carry information, not just decorate |
| Commitment | Reads almost everything | Important task, valuable content or high motivation | Still needs readability, chunking and structure to reduce load |

On some layouts there are also:
- **Lawn-mower pattern**: the eye moves back and forth along rows in a grid/cells, like scanning a list of cards.
- **Pinball pattern**: the eye bounces between many elements on search results or module-dense pages.

Don't design to force a pattern. Provide a hierarchy clear enough for users to find the reading path that fits their goal.

### 4.2 Rules that support scanning
- Put the conclusion, decision or important change first.
- Headings describe the section's content; avoid “Tổng quan” *(Overview)*, “Thông tin khác” *(Other information)* without context.
- One idea per paragraph; the first sentence carries the main idea.
- Bullets for parallel lists; numbers when order matters.
- Put meaning-carrying keywords at the start of headings, links and sentences.
- Bold key words or phrases; never a whole paragraph, never just for decoration.
- Use white space and visual grouping to show relationships.
- Don't hide important conditions in a tooltip, footnote or the last paragraph.
- On mobile, write more tightly: the viewport is narrow and users are easily interrupted.

---

## 5. Three quality layers: legibility, readability, comprehension

Related but not interchangeable:

| Layer | Question | Main factors | How to check |
|---|---|---|---|
| Legibility — recognising characters | Can users see and tell the characters apart? | Font, size, weight, contrast, line height, spacing, environment | Test on real devices, Dynamic Type/font scaling, low vision, bright light |
| Readability — ease of reading | Are the words and sentences easy to process? | Familiar words, short sentences, active voice, structure, line length | Readability heuristics, read-aloud, plain-language editing |
| Comprehension — understanding correctly | Do users understand the intent and know what to do? | Mental model, terminology, information order, context, examples | Task tests, paraphrase, memory questions, Cloze test |

An interface can be crisp yet hard to understand, or use simple words in a font that is too small. Content review therefore cannot be
separated from visual design and interaction.

### 5.1 Readability baseline
- A clean typeface; size and contrast meet platform/accessibility standards.
- Allow iOS Dynamic Type and Android font scaling without truncating text or losing the CTA.
- No ALL CAPS for long sentences.
- Avoid very long lines; for long content, about **50–75 characters per line** is usually easier to scan.
- Never put an important label only in the placeholder — it disappears on input.
- Text must reflow; never force horizontal zoom.
- Read the copy aloud: places where you must take a breath or re-read usually mean the sentence is too long or badly structured.

### 5.2 Evaluating comprehension
Don't ask “Do you understand?” — users usually say yes. Instead:
- “What do you think this button will do?”
- “After choosing, what will happen?”
- “Say this message again in your own words.”
- “What would you do next?”
- Give a real task and watch whether they take the right path.

---

## 6. Plain language: simple without impoverishing meaning

Plain language helps readers understand correctly on the first read and act more easily. It is not "writing for children"; it is
choosing words, structure and detail level that fit the goal.

### 6.1 Principles
- Use the words users say and search for: “mật khẩu” *(password)* instead of an internal system term.
- One term per concept; don't swap words just to avoid repetition.
- Prefer active voice when it matters who does what: “Chúng tôi sẽ hoàn tiền” *(We will refund you)* is clearer than a subjectless construction.
- Write short sentences, but don't chop them into fragments that lose cause and effect.
- Drop empty openers like “Xin lưu ý rằng” *(Please note that)*, “Nhằm mục đích” *(For the purpose of)*, “Trong trường hợp” *(In the event that)*.
- Be specific about time, money, data and consequences.
- Explain an acronym on first use if you're not sure the audience knows it.
- Use specialist terms when they really are the expert audience's language; don't "simplify" to the point of being wrong.
- Prefer affirmative statements; avoid double negatives.
- Don't use coined brand words as labels for common actions.

### 6.2 Before and after

| Long/vague | Clear and direct |
|---|---|
| “Vui lòng lưu ý rằng việc tiếp tục có thể dẫn đến việc các thay đổi chưa được lưu bị mất.” *(Please note that continuing may result in unsaved changes being lost.)* | “Bạn sẽ mất các thay đổi chưa lưu.” *(You'll lose your unsaved changes.)* |
| “Yêu cầu của bạn đã được tiếp nhận và đang trong quá trình xử lý.” *(Your request has been received and is in the process of being handled.)* | “Đang xử lý yêu cầu. Thường mất khoảng 2 phút.” *(Processing your request. Usually takes about 2 minutes.)* |
| “Không thể thực hiện thao tác tại thời điểm hiện tại.” *(The operation cannot be performed at the present time.)* | “Không thể tải hóa đơn vì bạn đang ngoại tuyến. Kết nối mạng rồi thử lại.” *(Can't load the invoice because you're offline. Connect and try again.)* |
| “Quý khách có nhu cầu tiếp tục thanh toán?” *(Does the valued customer wish to continue the payment?)* | “Thanh toán 450.000 ₫” *(Pay 450.000 ₫)* |

### 6.3 Brevity is not "as short as possible"
The goal is **no wasted words**, not the fewest words. A label “OK” is short but says nothing about what happens. “Xóa 3 ảnh”
*(Delete 3 photos)* is longer but reduces confusion. Cut in this order:
1. Remove what repeats what the interface already shows.
2. Remove lead-ins and filler words.
3. Replace long phrases with familiar words.
4. Move secondary conditions to progressive disclosure if they aren't needed for the current decision.
5. Keep consequences, limits and safety information.

---

## 7. Content structure: inverted pyramid, chunking, progressive disclosure

### 7.1 Inverted pyramid
Put the most important information or the conclusion first, then supporting detail, finally wider context. Someone who reads one
sentence still gets the main point; someone who needs more can continue.

Procedure:
1. Identify the one thing the user must know if they read only one sentence.
2. Rank secondary information by how necessary it is for the decision.
3. Write short and direct, short paragraphs, lists where appropriate.
4. Front-load meaning-carrying words in titles, headings, sentences and paragraphs.
5. For long pages, add a summary or key takeaways.

Example:

```text
Poor: Do hoạt động bảo trì theo lịch, một số chức năng có thể tạm thời bị ảnh hưởng...
      (Due to scheduled maintenance, some functions may be temporarily affected...)
Good: Chuyển khoản sẽ tạm dừng từ 01:00 đến 02:00 ngày 12/10 để bảo trì.
      Bạn vẫn có thể xem số dư và lịch sử giao dịch.
      (Transfers pause from 01:00 to 02:00 on 12/10 for maintenance.
       You can still view your balance and transaction history.)
```

### 7.2 Chunking
Chunking divides content into small, meaningful, clearly distinct units that are easier to scan, understand and remember. A chunk must
express a relationship; arbitrary paragraph breaks don't create structure.

Chunking tools:
- Short paragraphs and white space.
- Descriptive headings/subheadings.
- Lists with parallel structure.
- Group related information by proximity, alignment or a light background.
- A summary for long sections.
- Split number strings into familiar formats; forms auto-format instead of making users type separators.
- Split long video/help into labelled chapters.

Don't cap navigation or lists at exactly seven items because of a misread “magical number seven”. Menus rely on recognition, not on
holding every option in memory. What matters is meaningful groups, clear labels and not forcing users to remember too much at once.

### 7.3 Progressive disclosure
Show first what the current decision needs; give detail when the user opens it or when the context requires it.
- Use for advanced explanations, rare criteria, technical specs and contextual help.
- Never use it to hide price, terms, privacy, risks or conditions that change the decision.
- The opener label must predict the content: “Xem cách tính phí” *(See how fees are calculated)* beats “Tìm hiểu thêm” *(Learn more)*.
- An accordion fits when users need only a few sections and the headings are clear; don't use it when they'd have to open nearly
  all of them to compare.

---

## 8. Headings, titles and the first two words

A heading is a navigation tool. Layer-cake readers often read only the headings before choosing a section.

A good heading:
- Says what the content below is, not just sets a mood.
- Puts the distinguishing word first; about the **first two words** need information scent.
- Uses specific, familiar language.
- Has a logical hierarchy H1 → H2 → H3; never pick a level by its visual size.
- Stands alone well enough when it appears in a table of contents, search, or the screen-reader rotor.
- Keeps the same grammatical form across items of the same level.

| Weak | Better | Why |
|---|---|---|
| “Thông tin quan trọng” *(Important information)* | “Phí hủy chuyến” *(Trip cancellation fee)* | Has a specific topic |
| “Bắt đầu nào” *(Let's get started)* | “Tạo tài khoản” *(Create account)* | Predicts the next step |
| “Điều bạn cần biết về việc thay đổi địa chỉ giao hàng” *(What you need to know about changing your delivery address)* | “Đổi địa chỉ giao hàng” *(Change delivery address)* | Front-loaded and shorter |
| “Có gì mới?” *(What's new?)* | “Tính năng mới tháng 9” *(New features in September)* | Has a scope and a time |

Passive voice is not always wrong. In a heading it can be used to put an important object or state first, e.g. “Thanh toán đã bị từ
chối” *(Payment was declined)*. The criterion is priority of information, not an absolute ban on a grammatical structure.

---

## 9. Link labels and information scent

A link is a promise about its destination. A good link meets the **4S**:
1. **Specific**: says precisely what content or action is behind it.
2. **Sincere**: true to the destination, no clickbait, no hidden conditions.
3. **Substantial**: carries enough meaning on its own, not wholly dependent on the surrounding sentence.
4. **Succinct**: short enough to scan without sacrificing meaning.

Rules:
- Avoid “Bấm vào đây” *(Click here)*, “Xem thêm” *(See more)*, “Learn more” when you can describe the destination.
- Links on the same page must be distinguishable when a screen reader reads them as a list.
- Don't use a raw URL as the label unless users need to know or copy the address.
- File-download links should state type and size when useful: “Tải báo cáo 2026 (PDF, 2,4 MB)” *(Download the 2026 report (PDF, 2.4 MB))*.
- If it opens an external website or losing context is risky, warn — sparingly.
- A link must look and behave like a link; don't rely on colour alone in long content.
- Don't place many links side by side if the touch targets or the reading area become ambiguous.

| Vague | With information scent |
|---|---|
| “Tìm hiểu thêm” *(Learn more)* | “Cách chúng tôi bảo vệ dữ liệu vị trí” *(How we protect location data)* |
| “Xem tại đây” *(See here)* | “Xem biểu phí chuyển khoản” *(See the transfer fee schedule)* |
| “Chi tiết” *(Details)* | “Điều kiện hoàn tiền” *(Refund conditions)* |

---

## 10. UI copy for buttons, menus and commands

A command label describes the action the control performs. Per NN/g, labels are usually effective at about **2–4 words**, but clarity
always matters more than the word count.

### 10.1 Labelling principles
- **Verb + object** when the object isn't clear: “Lưu địa chỉ” *(Save address)*, “Gửi mã xác minh” *(Send verification code)*.
- When the context is clear, the verb alone: “Lưu” *(Save)*, “Gửi” *(Send)*, “Thử lại” *(Try again)*.
- Describe the **resulting state**, not the current one: the button next to a hidden item is “Hiện” *(Show)*, not “Ẩn” *(Hide)*.
- Actions use verbs; presentation states may use adjectives or choices: “Nhỏ / Vừa / Lớn” *(Small / Medium / Large)*.
- The same action uses the same label everywhere.
- Avoid “OK”, “Có/Không” *(Yes/No)* when a specific action can be used.
- For destructive operations, name the object and the count when useful: “Xóa 12 tệp” *(Delete 12 files)*.
- An ellipsis can signal that the action needs more input before it completes, but follow the platform and design-system convention.
- Don't use a marketing feature name in place of a familiar command.
- For non-universal icons add a visible label or tooltip; an accessibility label doesn't restore discoverability for sighted users.

### 10.2 Action pairs in dialogs

| Vague | Clear |
|---|---|
| “Bạn có muốn lưu?” — Có / Không *(Do you want to save? — Yes / No)* | “Lưu thay đổi?” — Lưu / Bỏ thay đổi *(Save changes? — Save / Discard changes)* |
| “Bạn chắc chứ?” — OK / Hủy *(Are you sure? — OK / Cancel)* | “Xóa 3 ảnh?” — Xóa ảnh / Giữ ảnh *(Delete 3 photos? — Delete photos / Keep photos)* |
| “Cho phép truy cập?” — Đồng ý / Không *(Allow access? — Agree / No)* | “Cho phép dùng vị trí khi sử dụng ứng dụng” / “Để sau” *(Allow location while using the app / Later)* |

Don't swap the order of actions just to make the two platforms identical. Use iOS and Android conventions for position/visual
priority, but keep semantics and terminology consistent.

### 10.3 Shortcuts and advanced commands
- Keep the platform's standard shortcuts; don't override familiar combinations.
- Show shortcuts in menus or tooltips so they can be discovered.
- Allow customisation if a professional product needs different workflows.
- Use the fewest modifiers that still avoid conflicts.
- Menu names, command palette entries and accessibility actions must match.
