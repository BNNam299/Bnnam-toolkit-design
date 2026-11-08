# Style library — prompts with taste

Picture styles that read as designed, each with a fixed style block, a prompt skeleton and the traps that make it look cheap. Derived from ten professional onboarding sets supplied by the user on 2026-10-19 (layout side: `ios-onboarding` `references/visual-patterns.md`). Pick **one** style for the whole app from the design direction; never mix two in one set.

## 1. The taste gate (every prompt, every style)

A prompt is rejected — rewrite it — when any line fails:

| # | Check | Fails when |
|---|---|---|
| T1 | **Subject that acts** | the picture is a lone shape, an icon, an empty frame or objects standing still with no action |
| T2 | **Metaphor written first** | you cannot say in five words what the picture *means* for this screen ("piggy bank swallowing a note = saving") |
| T3 | **Three layers** | there is no backdrop shape (blob, disc, tonal scene, gradient) or no floating accents around the subject |
| T4 | **Lead colour** | every colour has the same weight; nothing carries the eye |
| T5 | **Concrete nouns, specific details** | it says "a person", "objects", "elements" instead of "a woman in a mustard cardigan holding an open hardback, a small yellow bird on her bun" |
| T6 | **Gesture or motion** | static frontal pose with arms at the sides; nothing tilted, waving, reaching, falling or flying |
| T7 | **Series variation** | same composition and framing as the previous screen's image |
| T8 | **Style block verbatim** | the medium, line, shading and palette sentence differs from the other prompts |
| T9 | **Text zone respected** | the subject or accents reach into the zone the wireframe keeps for title and CTA |
| T10 | **Coverage stated** | the prompt does not say how much of the frame the art fills (a percentage of the width or height) or which edges crop it — generators then shrink the subject into the middle and the image sits "inside" its slot (§5) |
| T11 | **No letter-shaped motifs** | a mark could be read as a letter, digit or symbol: sleep "z"s, "zzz", question marks, music notes, numbers on a clock face, ticks on a ruler — generators draw them as text. Use loops, dots, short arcs or wavy lines instead ("three small loose loops drifting upward") |
| T12 | **Meaning on robust shapes** | the picture only works if a fragile detail comes out right: the exact time on clock hands, which edge a hand enters from, finger poses, a hand gripping an object. Generators miss these. Carry the meaning with whole objects and simple poses; when a hand is needed, write a simple cartoon mitten hand with a loose cuff and one finger extended, entering from one named edge |

Bland signals to remove on sight: "minimalist", "simple", "single small", "centred icon", "geometric shapes", "abstract elements", "clean and modern", "generous negative space around the perimeter", a row or grid of primitives, symmetric still life of one object, generic "person with laptop".

Pure geometry (dots, rings, bars, progress) is not an image asset: draw it natively in SwiftUI and say so instead of writing a prompt.

## 2. Styles

Each style block below is a template: fill the hex values from the confirmed Imagery palette (role names in brackets), then paste the finished sentence verbatim into every prompt of the set.

### S1 · Editorial line-and-fill

- **Look:** thin even dark outline, flat unshaded fills in 4–5 muted tones, cream or warm-white ground, one full-figure character with props, floating small details; lots of air.
- **Fits:** reading, wellness, journaling, productivity with a calm voice.
- **Style block:** `Editorial flat vector illustration with a fine even [ink] outline on every shape, flat unshaded fills in [accent-1], [accent-2], [accent-3] and [skin], small hand-placed details, on a solid uniform [ground] background`
- **Skeleton:** style block + `a [character: age, hair, clothing with colours] [action] [with/beside props], [2–4 small floating props: bird, cloud, leaf sprig, clock], [framing for the aspect], the [zone] left as plain [ground]`
- **Traps:** identical standing pose on every screen; too many props; outline missing on some shapes.

### S2 · Bold doodle + one accent

- **Look:** thick variable-width black marker line, white ground, one saturated accent fill, loose squiggle strings, small round badges (+, check), humorous character proportions (big nose, small body).
- **Fits:** food, delivery, commerce, casual social.
- **Style block:** `Hand-drawn doodle illustration with a thick confident variable-width [ink] marker line, a single [accent] flat fill used on a few key shapes, everything else white, loose curly accent strings, on a solid [ground] background`
- **Skeleton:** style block + `[playful character or hand] [action with the product object], [object details], [2–3 floating items with small round badges], [squiggle strings trailing the motion], [framing]`
- **Traps:** thin uniform line (kills the charm); a second accent colour.

### S3 · Duotone ink + brand accent

- **Look:** black and white illustration with one brand colour, a pale tint of that colour as an organic blob behind the subject, strong metaphors, hands and objects in action.
- **Fits:** finance, utilities, B2B, anything with a strong single brand colour.
- **Style block:** `Duotone vector illustration in [ink] and white with [accent] as the only colour, crisp outlines with solid [ink] shadow shapes, a soft organic blob of [accent-tint] behind the subject, on a solid [ground] background`
- **Skeleton:** style block + `[metaphor in action: a hand dropping a folded banknote into a smiling piggy bank], [secondary props: a potted plant, coins in mid-air, a paper plane], [dashed motion path], [framing]`
- **Traps:** metaphor too literal (a bank building); accent spread over everything.

### S4 · Saturated characters on a tonal scene

- **Look:** flat vector without outlines; the environment (city, park, room) is drawn in 3–4 shades of one hue, characters wear saturated contrasting colours, confetti dots and sparkles; usually cropped by a bottom sheet (layout V2).
- **Fits:** learning, language, community, events.
- **Style block:** `Flat vector illustration without outlines, the whole environment drawn in tonal shades of [scene-hue] from [scene-light] to [scene-dark], characters in saturated flat colours [accent-1], [accent-2], [accent-3], small confetti dots and four-point sparkles, on a solid [ground] sky`
- **Skeleton:** style block + `[2–3 diverse characters: skin, hair, outfit colours] [shared gesture: waving hello], [scene: city skyline, bench, plants in the tonal hue], [characters cropped at the waist along the bottom edge], [framing]`
- **Traps:** environment in full colour (subject drowns); text in bubbles — bubbles are native views.

### S5 · Glossy gradient objects on a colour disc

- **Look:** semi-flat objects with smooth gradients and soft glow (phone, book, card, coin), a hand gesture, floating sparkles and UI-like fragments without text, a large colour disc behind; the disc colour changes per screen.
- **Fits:** content, rewards, consumer apps with a bright voice.
- **Style block:** `Semi-flat vector illustration with smooth two-stop gradients and a soft coloured glow, rounded glossy objects, small four-point sparkles, a large solid [disc colour] circle behind the subject, on a solid [ground] background`
- **Skeleton:** style block + `[hand gesture or object pair: a hand holding a phone at an angle], [2–3 floating fragments: rounded cards with blank lines, a heart, coins], [framing]`
- **Traps:** gradients on everything including the ground; fake text lines that look like real copy.

### S6 · Soft mascot

- **Look:** one recurring round character with a minimal face (closed eyes, small smile), soft flat shading, pastel backdrop circle or ground shadow; appears across the series and inside choice tiles as cropped fragments.
- **Fits:** wellness, meditation, mood, learning for beginners.
- **Character sheet (fixed, pasted in every prompt):** body shape, proportions, colours by hex, face, one signature prop (headphones, scarf).
- **Style block:** `Soft flat vector character illustration with rounded shapes, gentle single-tone shading, a minimal face, the [mascot sheet], a pale [backdrop] circle behind, a soft oval ground shadow, on a solid [ground] background`
- **Skeleton:** style block + `the mascot [pose / action for this screen] [with prop], [1–3 small props tied to the screen], [framing]`; choice tiles: `an oversized fragment of [object or mascot face] cropped by the left and bottom edges, on a solid [tile colour] square`
- **Traps:** mascot proportions drift between prompts (paste the sheet verbatim and attach the anchor image); a smile on screens about difficult feelings.

### S7 · Warm portrait collage

- **Look:** portraits with matching warm light, cut into circles and tall capsules (the cut is native), arranged with native UI chips and sparkles on a gradient wash.
- **Fits:** family, social, community, services with real people.
- **What is generated:** each portrait (one AST each) and optionally the gradient wash; chips, cards, icons, sparkles and the arrangement are native.
- **Portrait style block:** `Photographic head-and-shoulders portrait, soft warm key light from the left, gentle smile, natural skin texture, plain [ground] seamless studio background, 85 mm lens, eye level, centred`
- **Skeleton:** style block + `[age, ethnicity, hair, clothing colour within the palette], [expression]` — vary people, never light, lens or background.
- **Traps:** mixed lighting; stock-photo grins; generating the whole collage as one picture; "window light" — the model paints the window into the background (tested 2026-10-19), so name the light, never its source.

### S8 · Abstract gradient object

- **Look:** a soft gradient field and one glossy orb or blob with subtle grain; no people.
- **Fits:** sensitive health topics, mood on heavy days, privacy screens.
- **Style block:** `Smooth abstract 3D render of a single glossy sphere with a [accent-1] to [accent-2] gradient and soft subsurface glow, fine film grain, resting in a seamless [ground] field, soft diffused light from the upper left`
- **Skeleton:** style block + `[position: upper right third], [scale: 30 % of the frame width], [secondary soft shape or shadow]`
- **Traps:** more than two objects; harsh specular highlights.

### S9 · Real content (no generation)

The product's own content (covers, photos, entries) is the picture (layout V4). Write no prompt; list the content source in the wireframe slot. Never generate fake covers, brands or screenshots.

## 3. Composite pictures

When a wireframe slot's picture mixes painted parts with text, chips, cards, flags, speech bubbles or icons (layouts V2, V3, V6), split it:

- **Generated layers** — characters, objects, portraits, scenes, backdrops: one `AST` each, with its own prompt.
- **Native layers** — every piece carrying text or UI, sparkles that animate, masks (circles, capsules), the arrangement itself: described in the wireframe slot, built in SwiftUI.

The slot names its layers; `_assets.md` holds only the generated ones.

## 4. Writing order for one prompt

1. Metaphor in five words (T2) and the subject's action (T1, T6).
2. Style block verbatim (T8).
3. Subject with concrete details and palette hex (T5, T4).
4. Props and floating accents, then the backdrop shape (T3).
5. Coverage and composition by geometry for the aspect, with the text zone as plain ground (T9, T10, §5).
6. Run the taste gate; compare with the previous screen's prompt (T7).

## 5. Coverage — the art fills its slot

Left alone, generators centre a small subject in a wide empty margin; placed in the app, the picture looks shrunk inside its frame while the references fill theirs. The image's own frame **is** the slot, so the art must reach it.

| Placement (layout) | Coverage to write in the prompt |
|---|---|
| Hero-top vignette (V1) | the subject group spans 85–95 % of the width and 80–90 % of the height; accents reach within 4 % of the side edges; the backdrop shape (blob, disc) spans at least 75 % of the width |
| Bleed-top scene (V2) | the scene runs past all four edges (sky to the top edge, ground and characters cut by the bottom edge, scenery cut by both sides); characters fill 70–90 % of the height |
| Collage wash (V3), abstract field (V8) | the gradient field covers the whole frame edge to edge; the orb or group sits in a stated third at a stated size |
| Choice tile (V6) | the object is oversized — 110–140 % of the tile — and cropped by two named edges |
| Spot / icon spot (V7, A9) | the subject fills 80–90 % of the square; only a thin even margin |
| Full-bleed 9:19.5 | the scene covers every edge; the text zone is plain ground *inside* the scene, not an empty margin |

Generators under-fill: in testing (Gemini image, 2026-10-19) a prompt asking for 90 % of the width gave 82 %. Generators treat percentages as hints (a 92 % request came back at 81 × 69 %). Write the target plus 5 percentage points (target 85 % → write 90 %), name the edges the art touches, and after generation measure it with the `ios-app-imagery` skill's `scripts/measure_coverage.py`. On a solid ground, fix an under-filled image with `--fit OUT.png` (crops to the art and re-pads to the aspect — nothing is lost); regenerate only when the composition itself is wrong. Full-bleed art (gradient fields, V2 scenes) and art cut by an edge on purpose (portraits cut at the shoulders, V6 tiles) are checked with `--bleed`, then the ground is checked by eye.

Write it as geometry, never as a feeling: "the characters fill 85 percent of the height and are cut at the waist by the bottom edge", "the blob spans 80 percent of the width". Never write "generous negative space", "small", "centred in the frame with margins" for a hero. Export the image at the slot's exact aspect so no letterboxing or extra padding is added on placement (`scaledToFill` for heroes and tiles, `scaledToFit` only for spots).
