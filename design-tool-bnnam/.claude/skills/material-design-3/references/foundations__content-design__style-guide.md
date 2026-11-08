<!-- Source: https://m3.material.io/foundations/content-design/style-guide · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__content-design__style-guide.md @ 3c0e291 -->

# Style guide

UI text should be understandable by anyone, anywhere

## UX writing best practices

#### Explain consequences

Emphasize the results of the user’s potential action in neutral, direct language. Avoid cautions or warnings that might sound alarming, intimidating, or condescending. Focus instead on communicating the consequences of a function.

*[image: "Move to trash?" dialog with the message "Big birthday bash will be deleted after 30 days."]* **✅ Do**
Tell users what will happen if they take an action and how they can undo it

*[image: "Are you sure you want to move to trash?"dialog with the message "You'll be able to find "Big birthday bash" in your trash for 30 days."]* **❌ Don't**
Don’t misrepresent consequences or try to influence a user’s decision

#### Use scannable words and formats

People scan UI text in search of the most meaningful content to them. Help by using specific titles and headings that clearly describe a topic. When users are skimming or hurrying through an action, this organization helps them avoid mistakes and unintentional actions.

*[image: Easily scannable content with different headings and subheadings on a card.]*
Use headings and subheads to prioritize and group information

#### Use sentence case

Unless otherwise specified, use sentence-style capitalization, where only the first letter of the first word in a sentence or phrase is capitalized. All text, including titles, headings, labels, menu items, navigation components, app bars, and buttons should use sentence-style capitalization.

Products and branded terms may also be capitalized.

*[image: Sentence-style capitalization used for the title and consequence statement  in a dialog.]* **✅ Do**
Capitalize the first word of a sentence or phrase

*[image: Title casing used for the title  in a dialog.]* **❌ Don't**
Don’t use title case capitalization. Instead, use sentence case.

#### Use abbreviations sparingly

Spell out words whenever possible. Shortened forms of words can be difficult for people to understand and screen readers to read. Avoid Latin abbreviations in UI text such as e.g. or etc. Instead, use full phrases like "for example," or "and more."

*[image: AM and PM abbreviations used on a clock app.]* **✅ Do**
When an abbreviation is appropriate, make sure it’s formatted and spelled correctly to avoid confusion

*[image: Abbreviations used for months and days on buttons when there is enough space to spell them out.]* **❌ Don't**
Avoid using abbreviations when there’s space to spell out a word

## Word choice

### Pronouns

#### Use second person pronouns ("you")

Use the second-person pronouns “you” and “your” to help the user to feel like the UI is talking to them and referring to their actions

*[image: Offline error message saying "Your mail isn't available. Try checking your Wi-Fi connection."]* **✅ Do**
Write from the user’s point of view to help them take action

*[image: Offline error message saying "Mail not available."]* **❌ Don't**
Avoid writing that sounds impersonal and robotic

#### Don’t combine first and second person

Avoid mixing "me" or "my" with "you" or "your.” It can cause confusion to see both forms of address in the same context.

*[image: "Your photos" is used in the description of a photo wall to emphasize the user's perspective.]* **✅ Do**
Write from a user’s point of view by emphasizing their perspective with “you” and “your”

*[image: My' is used in the title and 'Your' in the description of a photo album.]* **❌ Don't**
Don’t mix different forms of address in the same screen. Instead, use “you” and “your” or get rid of the pronoun.

#### Use caution with “I” and “we”

When written on behalf of a large, global company like Google, “we” or “I” may come across as robotic or disconcerting.

Focus on the user’s point of view, rather than Google’s, and consider if it’s possible to rewrite a phrase without “we.”

*[image: "We're glad you're our customer" is the title of a survey by Google.]* **❌ Don't**
Don’t use first person pronouns to speak for the voice of Google

*[image: "My latest episode" and "My best match" are the titles used in a video app.]* **❌ Don't**
Avoid using first person pronouns. Write from the user’s point of view by using second person pronouns or removing pronouns altogether.

Some legal texts may merit an exception: “I” or “my” (the first person) emphasizes ownership in agreements or acknowledgments. For example, “I agree to the terms of service.”

*[image: "I agree" is used in the description of an agreement checkbox to emphasize on user's ownership.]* **✅ Do**
First person pronouns can help users understand when they’re making impactful decisions

*[image: A part of Google ad message says, "Plus, we can assist with setting up your first campaign at no extra cost."]* **⚠️ Caution**
Use caution with “we” or “our.” Even when these pronouns represent real people employed by Google, seeing first person pronouns in UI text can be confusing or jarring.

## Grammar and punctuation

This style guide is specific to English-language UX writing. Google generally follows [Associated Press (AP) style](http://www.apstylebook.com).

#### Skip periods and unnecessary punctuation

To help readers scan text, avoid using periods and other unnecessary punctuation.

Avoid using periods to end single sentences, particularly in:

- Labels
- Tooltip text
- Bulleted lists
- Dialog body text
- Hyperlinked text

Use periods on:

- Multiple sentences
- Long or complex sentences, if it suits the context

*[image: Example of a period removed at the end of a short sentence on a snackbar.]* **✅ Do**
Omit punctuation on single-line sentences

*[image: Example of a period used at the end of a short sentence on a snackbar.]* **❌ Don't**
Avoid using periods to end single sentences

#### Use contractions

Contractions can make a sentence easier to understand and scan.

However, sometimes "do not" can give more emphasis than "don't” when caution is needed.

*[image: Dialog with the title "You can't edit".]* **✅ Do**
Avoid spelling out words that can be contractions

*[image: Dialog with the title "You cannot edit".]* **❌ Don't**
Phrases that aren’t contracted can feel stiff or overly formal

#### Use serial commas

Use the serial (or Oxford) comma, except before an ampersand.

Always place commas inside quotation marks.

*[image: Serial comma used in an information text containing 3 items.]* **✅ Do**
Use a serial comma in lists of three or more items

*[image: Serial comma not used in an information text containing 3 items.]* **❌ Don't**
Don’t skip serial commas before “and”

#### Use commas for numbers between 1,000 and 1 million

Use commas for numbers over 1,000. Don’t use commas when identifying something, such as a:

- Street address
- Radio frequency
- Year

For numbers over 1 million, comma use depends on context. “Million” can be abbreviated with with “M” and the value can be rounded when the intent is to give people a sense of the volume, rather than the exact numbers.

*[image: Music app showing song with 23 million views, which is abbreviated to 23M]* **✅ Do**
Abbreviate “million” with “M” and don’t use commas when giving people a sense of volume

*[image: Restaurant with 1,185 reviews, without abbreviation]* **✅ Do**
Use commas in numbers between 1,000 and 1 million

#### Skip colons in headings

For headings on lists of items, do not use colons. For lists within body text, use a colon.

*[image: Colon used after the introduction statement for a list.]*
Use colons for lists within body text

#### Use exclamation points sparingly

Exclamation points can come across as shouting or overly friendly. Some exceptions include greetings or congratulatory messages.

*[image: Exclamation mark used after "Congratulations".]* **✅ Do**
Exclamation marks can be used to emphasize celebratory moments

*[image: Exclamation mark used after a general statement.]* **❌ Don't**
Avoid using exclamation marks for empty states and common tasks. Save it for bigger accomplishments.

#### Use ellipses sparingly

Use ellipses to indicate an action in progress or incomplete text. Truncated text may appear with ellipses, but check with your engineering partners before implementing, as this often happens automatically.<br><br>Don’t add a space before ellipses. Omit ellipses from menu items or buttons that open a dialog or start a process.

*[image: A process indicator shows a 45% completion state.]* **✅ Do**
Ellipses show an action in progress

*[image: A button as part of a form has text saying "Saving" following by an ellipses.]* **❌ Don't**
Don’t use ellipses in buttons or menu items

#### Use parentheses to define terms

Parentheses can be used to define acronyms or jargon or when referencing a source. They shouldn’t be used when adding a side note or an afterthought of a sentence.

*[image: Parentheses used to define an acronym.]* **✅ Do**
Use parentheses to define terms and jargon

*[image: Parentheses used for adding an additional thought to a statement.]* **❌ Don't**
Don’t use parentheses to add extra thoughts. If information is needed, include it in the sentence without parentheses for easier scanning and improved comprehension.

#### Skip ampersands in body text

The “&” symbol can be used instead of “and” in headlines, column headers, table headers, navigation labels, and buttons. However, when there’s room, spelling out “and” can improve readability and make scanning easier.

“And” should be spelled out in sentences and paragraphs, before the final item in a 3+ item list, and in email subject lines.

*[image: Ampersand used in a heading.]* **⚠️ Caution**
Ampersands can be used in headlines where there's limited space

*[image: Ampersand used in an email subject line.]* **❌ Don't**
Avoid ampersands in email subject lines

#### Use dashes with caution

Dashes and hyphens can interrupt a sentence and lead to a fragmented experience, so they should be used with caution. There are three kinds of dashes:

- Em dash: —
- En dash: –
- Hyphen: -

Em dashes are best avoided in UX writing, as they indicate a break in the flow of a sentence that could be simplified using a comma, period, or new sentence.

Use an en dash without spaces to indicate a range, such as 9 AM–Noon.

*[image: En dash used for time range.]*
Use an en dash without spaces for ranges

#### Use hyphens with care

Hyphens can help readers better understand how words relate to each other by binding closely related words. They can also be used to represent negative numbers, such as -100. Spaces should never be used surrounding hyphens.<br><br>Refer to the [Associated Press (AP) style guidelines](http://www.apstylebook.com) if you are unsure whether an adjective or noun phrase needs a hyphen.

| **Rule** | **Examples** | **Why** |
|---|---|---|
| **Hyphenate adjective phrases<br>** | Case-by-case basis<br>Best-in-class performance<br>Once-in-a-lifetime opportunity | When multiple words are used together as an adjective, they should be hyphenated |
| Cell phone number<br>Chocolate chip cookie | However, proper nouns and common, easily understood adjective phrases don't need to be, such as "cell phone number" or "chocolate chip cookie" |  |
| **Hyphenate noun phrases**<br>A noun phrase is two or more words acting as a noun. These phrases are hyphenated in certain cases: | Sign-off<br>Drive-through<br>Go-ahead | Hyphenate a noun phrase if it contains a verb followed by an adverb |
| Higher-up<br>Most-read | Hyphenate an adjective phrase that is functioning as a noun |  |
| Jack-of-all-trades<br>Stick-in-the-mud | Some noun phrases, especially long or complicated ones, are always hyphenated |  |
| **Don't hyphenate verb phrases**<br>A verb phrase is two or more words acting as a verb. These should not be hyphenated. | Look out for falling rocksPlease drive in and drop off your carCheck in to the room when you arrive | Don't hyphenate a verb followed by an adverb or preposition if it's functioning as a verb phrase. For example, "check in" would not need a hyphen when used as a verb, such as "check in to the room," rather than as a noun, like "the next check-in." Also, note that since "in" is a part of the verb, it can't be combined with "to" to form "into," since check into doesn't mean the same as check in to. |

#### Use italics sparingly

Italics typically aren't easy to read. When emphasizing text, use bold weight instead.

However, italics can provide unique emphasis when applied to a single word or phrase, like a name or title.

*[image: Dialog with Home Laptop in italics while rest of supporting text is not italicized.]* **✅ Do**
Italicize a word or phrase

*[image: Dialog with all supporting text in italics.]* **❌ Don't**
Don’t italicize a sentence

#### Don’t use caps blocks

Avoid using caps blocks altogether; they're not accessible.

*[image: UI for Maps showing description of a location with a single word in a caps block.]* **❌ Don't**
Don't use caps block. Use sentence case for all product text.
