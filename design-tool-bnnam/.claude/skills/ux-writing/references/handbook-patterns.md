# UX writing handbook — patterns: components, states, errors, voice, accessibility, localization

> Source: bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/writing.md §34.10–34.14, §34.20, addendum "iOS 27, iPhone Duo" @ 3c0e291 — translated, complete

Part 2 of the handbook (part 1: `handbook.md`, part 3: `handbook-process.md`). Hard rules in `principles.md` win where they differ.
Vietnamese UI copy is kept verbatim with an English gloss in *(italics)*.

## Contents
1. Copy by component and state
2. Error messages: visibility, communication, recovery
3. Voice and tone
4. Accessibility and inclusive writing
5. Localization and internationalization
6. Vietnamese before/after library
7. Adaptive layouts (iPhone Duo / iOS 27)

---

## 1. Copy by component and state

### 1.1 Onboarding
- Say the value the user gets, not the product's history.
- Teach at the right moment, with content tied to an action.
- Let users skip what isn't essential.
- Every step answers “What do I get?” or “What do I need to do?”.
- Avoid long carousels with look-alike marketing headings.

### 1.2 Permission
A pre-prompt is only needed when the benefit isn't obvious. It should contain:
1. The specific feature that needs the permission.
2. The value the user gets.
3. Scope/frequency of data use, if meaningful.
4. A choice to continue or decide later.

Example: “Cho phép vị trí để tự động điền điểm đón. Ứng dụng chỉ dùng vị trí khi bạn đặt chuyến.” *(Allow location to fill in your
pickup point automatically. The app uses your location only when you book a ride.)* Don't use threats like “Nếu không cho phép, ứng
dụng sẽ không hoạt động” *(If you don't allow it, the app won't work)* when most of the app still works.

### 1.3 Form
- The label says what data to enter; helper text says the format, the reason, or a non-obvious condition.
- A placeholder only illustrates; it never replaces the label.
- Mark required/optional consistently; if most fields are required, you can mark the optional ones.
- State password requirements before submit and update their status in real time.
- Put errors next to the field, keep the entered data, and move focus to the summary/first field when appropriate.
- The submit button describes the goal: “Tạo tài khoản” *(Create account)*, not just “Gửi” *(Submit)*.

### 1.4 Empty state
A useful empty state answers:
1. What state is this?
2. Why is it empty, if that isn't obvious?
3. Does anything need doing?
4. Which actions are available?

Distinguish first-use empty, user-cleared empty, no results, filtered empty, permission-limited and error. Never use one sentence
“Chưa có dữ liệu” *(No data yet)* for every case.

```text
First use:  “Chưa có dự án” + “Tạo dự án đầu tiên”
            (No projects yet + Create your first project)
No results: “Không tìm thấy ‘Hà Nội’” + “Kiểm tra chính tả hoặc bỏ bớt bộ lọc”
            (No results for ‘Hà Nội’ + Check the spelling or remove some filters)
Filtered:   “Không có giao dịch phù hợp” + “Xóa bộ lọc”
            (No matching transactions + Clear filters)
Offline:    “Không thể tải dự án mới. Bạn vẫn có thể mở 4 dự án đã lưu.”
            (Can't load new projects. You can still open 4 saved projects.)
```

### 1.5 Loading and progress
- If you know the duration or percentage, show meaningful progress.
- If the wait is long, say what task is running and let users leave the screen if it continues in the background.
- Don't promise fake times; if you estimate, use reliable data and update it.
- Don't keep changing the text just to create a feeling of activity.
- For important uploads/processing, say clearly whether it can be cancelled and whether current data is safe.

### 1.6 Success
- Confirm what was just completed and the related result: “Đã chuyển 500.000 ₫ cho Minh” *(Sent 500.000 ₫ to Minh)*.
- Give a receipt/reference when needed.
- Offer a next step with real value; don't open a “Thành công!” *(Success!)* modal that only forces an OK tap.
- With optimistic UI, don't announce completion before the system can guarantee it, unless there is a clear rollback mechanism.

### 1.7 Destructive action
- The title names the action and the object.
- The body explains only non-obvious consequences, whether it can be undone, and the data affected.
- The confirm button uses the exact destructive verb.
- The safe button states what is kept: “Giữ bản nháp” *(Keep draft)* beats “Hủy” *(Cancel)* when “Hủy” could be read as cancelling the draft.
- No guilt copy: “Không, tôi không quan tâm dữ liệu của mình” *(No, I don't care about my data)*.

### 1.8 Search and no results
- The search field describes the scope when needed: “Tìm theo tên hoặc mã đơn” *(Search by name or order number)*.
- Results restate the query, filters and count when useful.
- No results offers recovery: fix spelling, widen scope, remove filters, or create the item.
- Never report “0 kết quả” *(0 results)* when the system actually had a network error.

### 1.9 Settings
- The label states the state/concept; the description explains the consequence.
- Avoid double negatives: “Không tắt tự động lưu” *(Don't turn off autosave)*.
- For a switch, the label stays the same when on/off; the control shows the state.
- Immediate changes need no “Lưu” *(Save)* button if the convention allows; if submission is needed, state the scope of the change.

### 1.10 Tooltip
- Use it to explain an unfamiliar control, never to replace the visible label of an important action.
- One short sentence describing the function; don't repeat the label verbatim.
- May contain a shortcut, but don't cram in long help or mandatory information.
- Must be reachable by keyboard/focus and assistive technology, not hover only.

### 1.11 Transactional notification
A notification should relate to an event the user needs to know about or act on:
- The title prioritises object/state: “Đơn hàng đã giao” *(Order delivered)*.
- The body adds necessary detail: which order, when, what's next.
- No marketing teasers disguised as transactions.
- Don't expose sensitive data on the lock screen.
- Deep-link to the right context and keep sign-in/security state sensible.
- Actions are short, safe and have a clear result; high-risk destructive actions should require opening the app.

### 1.12 Authentication, payment and sensitive data
- Distinguish wrong credentials, locked account, expired session and system error.
- Don't reveal whether an account exists if that creates a security risk.
- Price and CTA must match: “Thanh toán 450.000 ₫” *(Pay 450.000 ₫)*.
- State the subscription period, trial, billing date and how to cancel before the decision.
- Keep valid data when payment fails; ask to re-enter only the fields that need it.
- For an expired session, explain and protect draft data: “Phiên đã hết hạn. Đăng nhập lại để tiếp tục; nội dung của bạn đã được lưu.”
  *(Your session expired. Sign in again to continue; your content has been saved.)*

### 1.13 AI-generated content
- Say clearly that the user is interacting with AI when this affects expectations.
- Explain scope and limits at the moment they matter; don't use a long disclaimer in place of safe design.
- Attach sources or a confidence level when the decision needs verification.
- Allow edit, regenerate, undo and report.
- No anthropomorphic copy to cover the system not understanding or not being accountable.
- On failure, say what the system couldn't do and give a recovery step; avoid “AI đang suy nghĩ” *(The AI is thinking)* when the request actually failed.

---

## 2. Error messages: visibility, communication, recovery

A good error doesn't just describe the error. It helps users notice, understand, fix it and avoid repeating it without losing work.

### 2.1 Working formula

```text
[What happened] + [impact / data status, if needed] + [how to fix it]
```

Examples:
- “Không thể lưu thay đổi vì mất kết nối. Nội dung vẫn còn trên thiết bị; kết nối mạng rồi thử lại.” *(Couldn't save your changes
  because the connection dropped. Your content is still on the device; connect and try again.)*
- “Mã xác minh đã hết hạn. Yêu cầu mã mới để tiếp tục.” *(The verification code has expired. Request a new code to continue.)*
- “Số thẻ thiếu 4 chữ số. Kiểm tra và nhập đủ 16 chữ số.” *(The card number is missing 4 digits. Check it and enter all 16 digits.)*

You don't always need all three parts; drop what is already obvious to avoid length.

### 2.2 NN/g's three groups of criteria

**1. Visibility — seen at the right time**
- Place the error near its source and move focus/announcement to the right place.
- Combine several accessible signals: text, icon, colour, border or summary; never colour alone.
- Prominence matches severity; no flow-blocking alert for a minor error.
- Don't report an error too early, while the user is still typing.

**2. Communication — understandable**
- Human language, no error codes or backend messages.
- State the problem precisely, front-load the important information.
- Offer a concrete solution if there is one.
- Stay positive, don't blame, and usually avoid humour in failure situations.

**3. Efficiency — cheap to fix**
- Prevent predictable errors with constraints, defaults, validation and selective confirmation.
- Keep the data the user entered.
- Reduce repair steps: focus the right field, allow retry, give the format or a direct action.
- Contextual help appears only when needed and is short enough.

### 2.3 12-criterion error rubric

Score each group 1 to 4, then average:

| Group | 4 audit questions |
|---|---|
| Visibility | Near the source? Redundant, accessible signals? Prominence matches severity? Appears at the right time? |
| Communication | Easy-to-read language? Specific/front-loaded? Offers a solution? Positive and non-blaming? |
| Efficiency | Prevents errors? Keeps input? Cheap to fix? Short contextual help? |

NN/g reference scale: **A = 3.3–4.0; B = 2.5–3.2; C = 1.6–2.4; D ≤ 1.5**. For payment, health, safety or data-loss flows, set a higher
release bar and test with real users.

### 2.4 Error patterns to avoid

| Don't | Why | Rewrite |
|---|---|---|
| “Có lỗi xảy ra” *(An error occurred)* | No cause or fix | “Không thể tải đơn hàng. Kiểm tra kết nối rồi thử lại.” *(Couldn't load your orders. Check your connection and try again.)* |
| “Dữ liệu không hợp lệ” *(Invalid data)* | Doesn't point to field/format | “Ngày hết hạn phải có dạng MM/YY.” *(The expiry date must be in MM/YY format.)* |
| “Bạn nhập sai mật khẩu” *(You entered the wrong password)* | Can sound accusatory | “Mật khẩu không khớp. Thử lại hoặc đặt lại mật khẩu.” *(Password doesn't match. Try again or reset your password.)* |
| “Error 500” | A technical code | “Máy chủ tạm thời không phản hồi. Thử lại sau vài phút.” *(The server isn't responding right now. Try again in a few minutes.)* |
| “Rất tiếc! Oops! Có vẻ internet đang đi nghỉ.” *(So sorry! Oops! Looks like the internet is on holiday.)* | Humour while the user is losing work | “Mất kết nối. Nội dung chưa gửi vẫn được lưu.” *(Connection lost. Unsent content is still saved.)* |

Logs may keep the error code for support, but it never replaces the user-facing guidance. If a reference code is needed, put it in a
secondary area and make it copyable.

---

## 3. Voice and tone

**Voice** is the product's relatively stable personality. **Tone** is how the voice adjusts to the situation. A friendly brand must
still be calm and specific when a transaction fails.

NN/g describes four tone dimensions you can use as coordinates:
1. Funny ↔ serious.
2. Formal ↔ casual.
3. Respectful ↔ irreverent.
4. Enthusiastic ↔ matter-of-fact.

No position is right for every context. A conversational, casual, enthusiastic tone usually feels approachable, but fit depends on the
product, the audience and the risk.

### 3.1 Tone matrix by context

| Context | Suggested tone | Avoid |
|---|---|---|
| Onboarding | Clear, encouraging, moderate energy | Over-promising, forcing sign-up |
| First-use empty | Helpful, gentle | Blaming for "having nothing" |
| Small success | Short, positive | Over-celebrating that interrupts |
| Fixable error | Calm, specific, supportive | Humour, blaming the user |
| Lost data/money | Serious, transparent, just enough empathy | Emoji, showy brand voice |
| Safety warning | Direct, action first | Hiding the danger behind euphemism |
| In-app marketing | Valuable, well-timed | Disguised as a system notification |

### 3.2 Building a voice chart

Pick 3–4 attributes with observable writing behaviour:

| Attribute | We are... | We are not... | Shown by... |
|---|---|---|---|
| Clear | Say the consequence directly | Cold | Familiar words, short sentences, concrete numbers |
| Respectful | Give users the choice | Distant | No pressure, no blame |
| Warm | Acknowledge emotion at the right moment | Jokey | Short empathy, solution first |

“Thân thiện” *(friendly)*, “hiện đại” *(modern)* or “trẻ trung” *(youthful)* on their own are too vague. Each needs do/don't
examples and rules by severity. (How to produce the project voice file: `voice-and-tone.md`.)

---

## 4. Accessibility and inclusive writing

Accessible content is more than contrast. The words must work across many ways of perceiving and interacting.
- Use semantic headings and a correct hierarchy for screen-reader navigation.
- An accessibility label states name and purpose; don't add “nút” *(button)* if the framework already announces the role.
- If the visible label is “Thanh toán” *(Pay)*, the accessible name should start with the same word to support voice control.
- Links and buttons must make sense when read out of context.
- Errors must be announced and programmatically associated with their field.
- Alt text describes the image's purpose in context; decorative images get empty alt and don't repeat the caption.
- Never convey information only by colour, position, shape or emoji.
- Write sentences with few clauses; limit idioms, metaphors and wordplay in core tasks.
- Avoid stigmatising language, default genders, or treating the writer's abilities as the norm.
- Allow enough reading time; content that disappears by itself needs a control mechanism when it matters.
- Test with VoiceOver, TalkBack, zoom, large text, reduce motion and voice control on a real build.

(Accessibility beyond copy: `../mobile-ux-fundamentals/references/accessibility.md`.)

### 4.1 Alt text by purpose
- Product image: describe the traits that affect the purchase decision.
- Chart: give the key insight and alternative data, not just “biểu đồ đường” *(line chart)*.
- Icon button: label the action “Chia sẻ hóa đơn” *(Share invoice)*, not the picture “mũi tên lên” *(up arrow)*.
- Decorative image: remove it from the accessibility tree to reduce noise.

---

## 5. Localization and internationalization

UX writing must be designed for translation, not just shipped as a string table at the end of the project.
- Don't concatenate sentence fragments; word order changes between languages.
- Use the platform's plural/gender/case system; don't assume a plural is made by adding one character.
- Send translators context, screenshots, soft character limits and variable descriptions.
- Semantic key names: `checkout.payment_failed_title`, not `red_dialog_text_2`.
- Variables have examples and types: `{amount}` is formatted money, `{name}` is the recipient's name.
- Format dates, times, numbers, money, units and addresses by locale.
- Allow for text expansion and test truncation; don't force a wrong translation just to fit the box.
- Support RTL in layout, directional icons and content order.
- Build a glossary of domain terms and a do-not-translate list.
- Transcreation of tone allows cultural adaptation, but keeps legal, safety and product meaning intact.
- Pseudolocalize early to catch hard-coded strings, concatenation, clipping and length-dependent layouts.
- For Vietnamese, keep full diacritics, keep pronouns/forms of address consistent, and avoid mixing English and Vietnamese when unnecessary.

### 5.1 Vietnamese punctuation and format
- A space after commas/periods; no space before punctuation.
- Write units and money by one consistent product/locale convention: `450.000 ₫` rather than mixing formats.
- Don't overuse English-style capitalization in headings; sentence case is usually more natural.
- Decide between “bạn” *(you, neutral)*, “quý khách” *(valued customer, formal)* or dropping the subject per the voice guide; don't
  change it per screen.
- Check how a Vietnamese screen reader reads numbers, codes, abbreviations and proper names.

---

## 6. Vietnamese before/after library

### 6.1 CTA and navigation

| Before | After | Improvement |
|---|---|---|
| Tiếp tục *(Continue)* | Xác nhận địa chỉ *(Confirm address)* | Names the next step |
| Gửi *(Send)* | Gửi yêu cầu hoàn tiền *(Send refund request)* | Names the goal |
| Hoàn tất *(Done)* | Tạo hồ sơ *(Create profile)* | Names the result |
| Quay lại *(Back)* | Sửa thông tin *(Edit details)* | Names the reason for going back |
| Xem thêm *(See more)* | Xem 12 đánh giá *(See 12 reviews)* | Has content and scale |

“Tiếp tục” *(Continue)* is still fine when the next step is obvious in a linear flow; don't replace it mechanically everywhere.

### 6.2 Form and validation

| Before | After |
|---|---|
| Email không hợp lệ *(Invalid email)* | Nhập email theo dạng ten@congty.vn. *(Enter an email like ten@congty.vn.)* |
| Mật khẩu yếu *(Weak password)* | Dùng ít nhất 12 ký tự, gồm một chữ và một số. *(Use at least 12 characters, including a letter and a number.)* |
| Bắt buộc *(Required)* | Nhập số điện thoại để nhận mã xác minh. *(Enter your phone number to get a verification code.)* |
| Sai định dạng *(Wrong format)* | Ngày hết hạn phải có dạng MM/YY. *(The expiry date must be in MM/YY format.)* |

### 6.3 Empty and no results

| Before | After |
|---|---|
| Không có dữ liệu *(No data)* | Chưa có hóa đơn. Hóa đơn sẽ xuất hiện sau lần thanh toán đầu tiên. *(No invoices yet. Invoices appear after your first payment.)* |
| Không tìm thấy *(Not found)* | Không tìm thấy “sen đá”. Thử từ ngắn hơn hoặc xóa bộ lọc Giá. *(No results for “sen đá” (succulents). Try a shorter word or clear the Price filter.)* |
| Danh sách trống *(Empty list)* | Chưa lưu địa điểm nào. Lưu địa điểm để đặt chuyến nhanh hơn. *(No saved places yet. Save places to book rides faster.)* |

### 6.4 Error and offline

| Before | After |
|---|---|
| Oops! Có gì đó sai sai. *(Oops! Something's not right.)* | Không thể tải tin nhắn. Kiểm tra kết nối rồi thử lại. *(Can't load messages. Check your connection and try again.)* |
| Giao dịch thất bại. *(Transaction failed.)* | Ngân hàng từ chối giao dịch. Thử thẻ khác hoặc liên hệ ngân hàng. Bạn chưa bị trừ tiền. *(The bank declined the transaction. Try another card or contact your bank. You have not been charged.)* |
| Lỗi máy chủ. *(Server error.)* | Máy chủ tạm thời không phản hồi. Bản nháp đã được lưu; thử lại sau vài phút. *(The server isn't responding right now. Your draft is saved; try again in a few minutes.)* |
| Không có mạng. *(No network.)* | Bạn đang ngoại tuyến. Có thể tiếp tục chỉnh sửa; thay đổi sẽ đồng bộ khi có mạng. *(You're offline. You can keep editing; changes will sync when you're back online.)* |

### 6.5 Confirmation and destructive

| Before | After |
|---|---|
| Bạn có chắc chắn muốn tiếp tục không? *(Are you sure you want to continue?)* | Xóa danh sách “Du lịch”? 18 địa điểm sẽ bị xóa và không thể khôi phục. *(Delete the “Du lịch” (Travel) list? 18 places will be deleted and can't be restored.)* |
| Có / Không *(Yes / No)* | Xóa danh sách / Giữ danh sách *(Delete list / Keep list)* |
| Hủy *(Cancel)* | Giữ bản nháp *(Keep draft)* |

### 6.6 Notification

| Before | After |
|---|---|
| Tin vui dành cho bạn! *(Good news for you!)* | Khoản hoàn 320.000 ₫ đã được chuyển về thẻ •••• 4242. *(Your 320.000 ₫ refund has been sent to card •••• 4242.)* |
| Đừng bỏ lỡ! *(Don't miss out!)* | Chuyến bay VN210 đổi cửa ra máy bay sang C4. *(Flight VN210 has changed to gate C4.)* |
| Đơn hàng cập nhật *(Order updated)* | Đơn #2048 sẽ giao hôm nay, 14:00–16:00. *(Order #2048 will be delivered today, 14:00–16:00.)* |

### 6.7 Permission and privacy

| Before | After |
|---|---|
| Ứng dụng cần vị trí của bạn. *(The app needs your location.)* | Dùng vị trí để tự điền điểm đón. Bạn vẫn có thể nhập địa chỉ thủ công. *(Use your location to fill in the pickup point. You can still enter an address manually.)* |
| Cho phép truy cập danh bạ để có trải nghiệm tốt hơn. *(Allow contacts access for a better experience.)* | Tìm bạn đã dùng ứng dụng bằng số điện thoại trong danh bạ. Danh bạ không được lưu trên máy chủ. *(Find friends already on the app using phone numbers in your contacts. Your contacts are not stored on the server.)* |

Write a data commitment only if engineering and policy truly guarantee it. Copy must not "upgrade" the truth.

---

## 7. Adaptive layouts (iPhone Duo / iOS 27)

Copy topics for adaptive, posture-aware layouts live in the iPhone Duo knowledge (`../iphone-duo-adaptive/SKILL.md`):
- text expansion, RTL, and strings that vary by posture when the layout adapts;
- copy for loading, empty, error and recovery states;
- onboarding and feature discovery by posture.
