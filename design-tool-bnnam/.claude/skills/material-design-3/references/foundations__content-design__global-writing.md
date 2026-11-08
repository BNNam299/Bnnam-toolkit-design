<!-- Source: https://m3.material.io/foundations/content-design/global-writing · fetched 2026-10-18 · verbatim English, original headings · packaged from bnnam-appdev-toolkit/design-toolkit/2.0.0/knowledge/material-3/foundations__content-design__global-writing.md @ 3c0e291 -->

# Global writing

Global writing is easier to read, understand, and translate. This guidance is for all American English that is localized.

## Overview

### Overview

#### Global writing

Global writing is the practice of writing inclusively for many cultures and optimizing for localization. This makes writing easier to read, understand, and translate. Writing for localization is necessary when a product will be translated, but can also be a helpful lens when writing for anyone.

*[image: 3 apps in different languages.]*

## Word choice

### Word choice

#### Use global examples & explain local references

References to local places, holidays, and companies won’t always make sense to global audiences.

*[image: Empty wishlist screen that references the holidays]* **✅ Do**
Use generalized, global examples. Most countries and cultures have holidays.

*[image: Empty wishlist screen that references Christmas]* **❌ Don't**
Don’t call out a specific country or culture’s holiday

If it doesn’t make sense to use a global example, explain the reference in the message description so the translator can substitute a locale-specific example. Some instances where local references should be called out include:

- Locations
- Names (common first names and nicknames)
- Currencies
- Temperatures
- Date formats
- Providers (internet and cable)

*[image: Empty state that references New York with message description about replacing New York with a well-known city in other languages]* **⚠️ Caution**
Help translators understand the context by adding message descriptions

#### Use short, simple sentences

Break text into shorter sentences. Use bullets or separate content into sections with headings.

Other languages average at 1.5 times longer than English, so text that’s short may be long when translated.

*[image: 2 screens side by side, in English and German]*
Many languages, like German, are longer than English

#### Avoid abbreviations

Abbreviations don’t translate well and can be confusing out of context. Spell things out whenever possible.

However, common abbreviations for time are acceptable.

*[image: Dialog with options that aren’t abbreviated]* **✅ Do**
Use clear names to refer to things

*[image: Dialog with options that are abbreviated]* **⚠️ Caution**
Avoid abbreviations. If they're used, provide their meaning in message descriptions.

#### Clarify pronouns

Using pronouns, like “it,” can get tricky when translators are working with small, unconnected strings of text and when nouns have genders in many languages. Repeat the noun, or clarify the noun in a message description.

*[image: Photo app with snackbar that reads “Couldn’t move photo”]* **✅ Do**
Using nouns instead of, or in addition to, pronouns can help clarify future and past user actions

*[image: Photo app with snackbar that reads “Couldn’t move it to ‘Travel’ folder because it’s unavailable”]* **❌ Don't**
Avoid using pronouns when it’s unclear what nouns they’re referring to, especially when explaining user actions

#### Clarify “this” and “that”

Don’t start a sentence with "this" or "that" unless it's immediately followed by the noun. When the noun is unclear, the sentence is more difficult to translate.

*[image: Form with clear writing that doesn’t use “this” or “that”]* **✅ Do**
Make sure it’s clear who text is referring to

*[image: Form with a subhead that reads “This can be seen by your IT administrator.” It’s not clear what “this” refers to.]* **❌ Don't**
Avoid using “this” and “that”

#### Avoid idiomatic, colloquial, and polite expressions

Idiomatic or colloquial phrases can be confusing if the meaning isn’t clear. If you use them, clarify the purpose and context of the phrase to help the translator choose an appropriate alternative.

Avoid polite expressions, such as “Please,” “Sorry,” and “Thank you,” especially in error messages. However, "please" may be used when asking the user to do something inconvenient.

*[image: Empty state with illustration that reads “Let’s go”]* **✅ Do**
Clear, everyday language can be used in an expressive and whimsical way when paired with imagery

*[image: Empty state with illustration that reads “Let’s get this party started”]* **❌ Don't**
Idiomatic phrases can be difficult for everyone to understand and for translators to localize

#### Reduce technical jargon

Technical terms don't always translate. Descriptions should be simple, and in some cases literal, to avoid confusion when translating.

*[image: Dialog that prompts people to sign up to try new products]* **✅ Do**
Plain language is easier for everyone to understand

*[image: Wordy and confusing dialog that prompts people to sign up for new communication preferences]* **❌ Don't**
Confusing language makes it difficult for people to understand the actions they’re taking

#### Clarify ambiguities

Some words have multiple meanings. For example, “traffic,” “filter,” and “change” can be used as either nouns or verbs. Avoid using both meanings of the word in the same string or body of text. If a word has the potential to be confusing, provide as much context as possible in the message description so the translation will be accurate.

*[image: Screen displaying devices and speakers at home, next to bottom app bar with “home” button]*
Clarify words that have multiple meanings. “Home” could reference a homepage or where someone lives.
