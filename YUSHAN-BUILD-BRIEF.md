# YUSHAN 玉山 — Build Brief

**For:** Claude Code
**Type:** Demo / practice build. Fictional brand. No real inventory, no real checkout.
**Deliverable:** A production-quality storefront that could pass as a live DTC site.

---

## 0. How to use this file

Read the whole thing before writing code. Do not start with the homepage.

Build order is fixed: **PDP template → cart drawer → collection → the Chart page → homepage → everything else.** The product page is where the money is made. The homepage is not the main event, because most traffic to this brand arrives from a reviewer's link and lands directly on a product page.

Everything in Sections 2 and 3 is source-of-truth data. Do not invent additional pigments, prices, certifications, review counts or claims. If a field is missing, ask rather than filling it in.

Everything in Sections 4 through 10 is a constraint, not a suggestion. Section 10 in particular is a list of things that will fail review.

---

# PART 1 — THE BRAND

Yushan Colour Co. is a two-person watercolour workshop in Datong District, Taipei, founded 2019. They mill paint by hand in small batches and sell direct to painters in the US, UK and EU. No distributor, no importer.

The founder spent eleven years as a materials chemist before starting the workshop. That fact does a lot of work: it explains both why the paint is competent and why the brand publishes more technical data than its competitors.

**The one-sentence position:** the only artist-grade watercolour brand that publishes every Colour Index code and every lightfastness result, including the bad ones, and grinds two pigments nobody else in the world sells.

**The two things that cannot be bought elsewhere:**
- **Beitou Sulphur** — ground from mineral deposits in the Beitou geothermal valley north of Taipei. Granulates harder than anything in the commercial range. No Colour Index equivalent.
- **Yushan Slate** — ground from slate collected in the Yushan range. Cool grey, very heavy granulation, zero staining.

These two SKUs are the entire moat. Every page should be within one click of them.

**Price position:** roughly 30–40% below Daniel Smith and Schmincke at equivalent quality. A 15ml pan of comparable European artist-grade paint retails at US$16–28. Yushan single pans are US$11.

---

# PART 2 — WHAT SHE SELLS

## 2.1 The pigment line (18 colours)

Model this as `data/pigments.json`. Every field is required on the product page and the Chart page.

```json
{
  "id": "ultramarine-blue",
  "name": "Ultramarine Blue",
  "ci": "PB29",
  "pigmentCount": 1,
  "house": false,
  "hex": "#1E4FA0",
  "blueWool": 8,
  "transparency": "Transparent",
  "granulation": "Heavy",
  "staining": "Low",
  "note": "The workhorse blue. Separates beautifully against burnt sienna in a wet wash."
}
```

| Name | CI code | Hex | Blue Wool | Transparency | Granulation | Staining |
|---|---|---|---|---|---|---|
| Ultramarine Blue | PB29 | #1E4FA0 | 8 | Transparent | Heavy | Low |
| Phthalo Blue GS | PB15:3 | #0F5C86 | 8 | Transparent | None | High |
| Cerulean Blue | PB35 | #3E82A8 | 8 | Semi-opaque | Heavy | Low |
| Indanthrone Blue | PB60 | #22355E | 7 | Transparent | Light | Medium |
| Viridian | PG18 | #1F6E5C | 8 | Transparent | Heavy | Low |
| Phthalo Green BS | PG7 | #0B5C4A | 8 | Transparent | None | High |
| Nickel Azo Yellow | PY150 | #A8871F | 7 | Transparent | None | Medium |
| Hansa Yellow Light | PY3 | #E0C13A | 6 | Semi-transparent | None | Low |
| **Beitou Sulphur** ◆ | HOUSE 01 | #C9A32E | 7 | Semi-opaque | Very heavy | None |
| Yellow Ochre | PY43 | #B07C2A | 8 | Semi-opaque | Heavy | Low |
| Raw Sienna | PBr7 | #9A6524 | 8 | Transparent | Medium | Low |
| Burnt Sienna | PBr7 | #93502F | 8 | Transparent | Heavy | Low |
| Pyrrol Scarlet | PR255 | #C2321F | 8 | Semi-transparent | None | Medium |
| Quinacridone Rose | PV19 | #B0245C | 7 | Transparent | None | High |
| Perylene Maroon | PR179 | #7A2A2C | 8 | Transparent | Light | Medium |
| Cobalt Violet | PV14 | #7B4C86 | 8 | Semi-opaque | Very heavy | None |
| **Yushan Slate** ◆ | HOUSE 02 | #4A565C | 8 | Semi-opaque | Very heavy | None |
| Payne's Grey | PBk6+PB29 | #33414C | 8 | Semi-transparent | Heavy | Low |

Sixteen single-pigment, two house minerals. Payne's Grey is the only two-pigment mix and must be labelled as such wherever it appears. Hansa Yellow Light at Blue Wool 6 is the weakest in the range and **must not be hidden** — see Section 4.

Granulation drives visual rendering. Map it: `None: 0.02, Light: 0.12, Medium: 0.22, Heavy: 0.40, Very heavy: 0.58` as noise opacity over the swatch. A non-granulating pigment must render visibly flatter than a granulating one. The texture is data, not decoration.

## 2.2 SKUs and price ladder

Three rungs. This structure is deliberate and must survive into the build.

| SKU | Rung | Price | Contents |
|---|---|---|---|
| `dot-card` | Trial | US$14 | All 18 colours hand-painted on Puli cotton, each labelled with CI code and Blue Wool number. Ships flat in an envelope. |
| `landscape-six` | Core | US$58 | Ultramarine, Phthalo Blue GS, Beitou Sulphur, Yellow Ochre, Burnt Sienna, Yushan Slate. Six half pans, tin. |
| `botanical-eight` | Core | US$76 | Eight half pans selected for botanical work. |
| `the-eighteen` | Anchor | US$186 | Complete range, Taiwan cypress box, brass hinge, 21 × 12 × 3 cm. Flagship PDP. |
| `single-pan` | À la carte | US$11 | Any single colour, half pan, 1.8 ml. |
| `puli-block` | Accessory | US$32 | Puli handmade cotton paper block, 300gsm, cold press, 100% cotton, 20 sheets. |

The **dot card is the most important SKU on the site**, not the most expensive one. It is the conversion mechanism: nobody spends US$186 on paint from a brand they have never touched. It should appear on the homepage hero, on every PDP as a fallback CTA, and in the cart as the recovery offer for an abandoning visitor.

## 2.3 Shared specification (applies to all pan products)

- Format: half pan, 1.8 ml, hand-poured in three fills so the pan is solid to the bottom
- Binder: gum arabic, glycerin, longan honey, ox gall
- Fillers or extenders: none
- Lightfastness range: Blue Wool 6–8
- Certification: ACMI AP non-toxic
- Made in: Datong District, Taipei
- Batch size: 40 pans

## 2.4 Shipping and duty (must appear on every PDP, above the buy button)

- Ships from Taipei within 24 hours
- 6–9 business days to US, UK, EU
- US$9 worldwide, free over US$80
- Duties and import tax prepaid. Nothing owed on delivery.
- 60-day return, used or unused

## 2.5 What she does not sell

No tubes. No gouache. No brushes. No student grade. No subscriptions. Do not build UI for any of these.

---

# PART 3 — WHO BUYS IT

Built with the Evolve five-category method: desire first, demographics last. Do not lead with demographics anywhere in the build.

## 3.1 Core Avatar (desire-based)

**"I want a palette nobody else has."**

Core desire underneath: identity and status. This painter's work is how they are seen, and using the same twelve colours as every other person in the Instagram watercolour tag is a threat to that.

This is the single core avatar for the whole site. Everything else below is a sub-avatar of it. Do not write copy that serves a second core desire.

## 3.2 Sub-avatars

**Sub-avatar 1 — the disappointed upgrader** (desire + product experience + emotion)
Wants a palette nobody else has. Bought a premium mineral-pigment set and found that several colours were convenience mixes she could have mixed herself. Feels quietly cheated.
→ *Page job:* prove single-pigment status loudly. The "16 of 18 single-pigment" figure is aimed at her.

**Sub-avatar 2 — the plateaued painter** (desire + situational experience + emotion)
Wants a palette nobody else has. Has been painting three or more years with the same twelve colours she started with. Feels her work looks like everyone else's.
→ *Page job:* the Chart page, and the granulation rendering. She needs to see something she has not seen before, in the first five seconds.

**Sub-avatar 3 — the researcher** (desire + behaviour)
Wants a palette nobody else has. Reads pigment databases, watches swatch videos and cross-references CI codes before every purchase.
→ *Page job:* complete, scannable, screenshot-able spec data. She is the one who posts your chart in a Facebook group. Build for her.

**Sub-avatar 4 — the burned skeptic** (desire + product experience + emotion)
Wants a palette nobody else has. Ordered an unfamiliar set online that turned out to be relabelled student paint. Now distrusts any brand that does not publish pigment codes.
→ *Page job:* the entire transparency architecture, including the visible weak spot (see 4.3).

## 3.3 What they say, verbatim

Use these as raw material for headlines and FAQ questions. Do not clean them up.

- "Is this just rebranded student paint?"
- "What's actually in it? No codes on the site means no sale."
- "Will this still look like this in twenty years?"
- "I already have a Daniel Smith set. What does this do that mine doesn't?"
- "Half the 'genuine mineral' colours in my set are mixes."
- "How much is shipping from Taiwan, and will I get a customs bill?"
- "Everything I paint looks like everything everyone else paints."
- "I want something that granulates hard."

## 3.4 Objection → page element assignment

Every objection gets a home. If an element does not answer an objection, it should not be on the page.

| Objection | Element |
|---|---|
| Unknown brand, might be student grade | Spec table above the fold; "16 of 18 single-pigment" in the data strip |
| Will it fade | Blue Wool rating per colour, plus the 12-month window-test gallery |
| What pigments are in it | Full CI code on the pan, the PDP, the Chart and the downloadable PDF |
| How does it compare to what I own | Side-by-side comparison block on the PDP |
| Shipping cost and time | Ship box above the buy button, not at checkout |
| Customs bill | Explicit "duties prepaid" line in the same box |
| What if I hate it | 60-day return under the buy button, and the US$14 dot card |
| Is it safe / archival | ACMI AP line in the spec table |

## 3.5 Traffic → page mapping

This brand does not run cold paid social. Do not build advertorial or quiz templates.

| Source | Awareness | Destination |
|---|---|---|
| Reviewer video or blog link | Product aware | PDP |
| Google pigment search ("PB29 vs PB60") | Solution aware | Chart page, then PDP |
| Reddit or forum link | Product aware | PDP |
| Retargeting | Product aware | Enhanced PDP |
| Email flow | Most aware | PDP or restored cart |
| AI assistant referral | Product aware, pre-researched | PDP with complete machine-readable spec data |

That last row is why product structured data matters here more than usual. Emit valid Product schema with price, availability, rating and full spec, and keep it consistent with what is visible on the page.

## 3.6 Demographics (last, and lightly)

Skews 28–55, skews female, English-speaking, US/UK/EU, disposable income for a hobby that runs US$300–800 a year. **Do not write copy that references any of this.** It is a media-buying note, not a positioning note.

---

# PART 4 — VOICE AND COPY

## 4.1 Register

A maker talking to a painter. Technical, specific, unhurried. Closer to a lutherie forum than a skincare brand. This audience reads superlatives as a warning sign and numbers as a courtesy.

> Wrong: "Experience colour like never before."
> Right: "Single-pigment PB29, Blue Wool 8, ground in gum arabic and longan honey. Granulates heavily on cold press."

## 4.2 Emotional target

Valence and intensity, per the model: sit in **high valence / low intensity** for all trust and specification content. Calm, reassuring, competent. Move to **high valence / high intensity** only on the two house minerals and the Chart reveal, where discovery and delight are the point.

Never use low-valence zones. No fear, no urgency, no manufactured scarcity, no "don't make this mistake." Nothing on this site counts down.

## 4.3 The transparency rule

Publish the weak result. Hansa Yellow Light is Blue Wool 6 and the site says so, on the label, on the Chart, and in a review left visible where a customer marks the product down for it. A visible 4.6 outperforms a suspicious 5.0, and for sub-avatar 4 the admission is the entire proof.

## 4.4 Anti-slop rules (hard fails)

- No "not X, it's Y" binary contrasts as filler
- Maximum one em dash in the entire site. Commas and periods otherwise.
- Banned vocabulary: delve, tapestry, realm, harness, unlock, intricate, multifaceted, underscore, palpable, testament, landscape (figurative), navigate (figurative), elevate, embark, seamless, robust, vibrant, foster, leverage, resonate, myriad, meticulous, pivotal, curated, bespoke
- No throat-clearing openers. First sentence is the sentence.
- No rule-of-three lists by reflex. Vary the count.
- No emoji as bullets
- No hollow closers. Stop when done.
- Vary rhythm. Short line after a long one. Fragments allowed.

## 4.5 UI copy

Active voice, sentence case, one job per element. The button that says "Add to cart" produces a cart that says "Added." Errors explain what happened and how to fix it, without apologising. Empty states invite an action.

---

# PART 5 — DESIGN SYSTEM

## 5.1 Tokens

```css
--ink:     #10161C;  /* near-black, blue cast, Payne's Grey */
--ink-2:   #2C3841;
--paper:   #E9EAE4;  /* cool cold-press white. NOT warm cream */
--paper-2: #F4F5F1;
--mist:    #B7C0BC;
--rule:    #CDD2CB;
--pb29:    #1E4FA0;  /* ultramarine, primary accent */
--pbr7:    #93502F;  /* burnt sienna, secondary accent, sparing */
--ok:      #3D6B4A;
```

The palette derives from the product. Both accents are real pigments in the range. **Do not introduce a warm cream background or a terracotta accent** — that combination is the current default AI aesthetic and it will read as generic.

## 5.2 Type

Three roles, two families maximum loaded, self-hosted, `font-display: swap`.

- **Display:** Newsreader, 300/400/600 plus italic. Product names, headlines, section heads. Tight tracking, `-0.02em` at large sizes.
- **Body:** Public Sans, 300/400/500.
- **Data:** JetBrains Mono, 400/500. **All CI codes, Blue Wool numbers, prices, SKUs and spec values render in mono.** They are codes; they should look like codes. This is the type system encoding something true.

## 5.3 The signature element

The Chart: an interactive grid of all 18 swatches. Each swatch is CSS, not an image — layered radial gradients pushed through an SVG `feTurbulence` + `feDisplacementMap` filter for the ragged wash edge, with a noise overlay whose opacity is driven by that pigment's granulation value. Hover or tap loads a readout panel with name, CI code, Blue Wool bar, transparency, granulation and staining.

This is the one place to spend boldness. Everything else stays quiet.

## 5.4 The Taiwanese layer

Applied as skin, never structure. Specificity is the whole game: a specific window grille from a specific building, not "Asian-inspired."

**Permitted vocabulary:** 鐵花窗 iron window grille geometry as dividers, section rules and loading states; 花磚 majolica tile pattern as low-contrast ground behind editorial sections; Puli paper deckle edge as a section transition; Traditional Chinese characters used sparingly and correctly (玉山 in the wordmark, never as decoration).

**Banned:** red and gold, dragons, brush-script display type, lantern motifs, anything that would appear in a search for "oriental design."

Render patterns as inline SVG or CSS, never raster. Keep them low contrast, behind content, under the page-weight budget. The pattern is the paper the product sits on.

---

# PART 6 — SITE ARCHITECTURE

Build in this order.

## 6.1 PDP (build first)

Above the fold, mobile, in this order:

1. **Gallery**, 5–8 images, min 1200×1200, swipeable. Shot list: product on white, real swatch on real paper, scale reference against a coin, macro of granulation, what's in the box, one infographic answering the top objection. Preload the first image. Never lazy-load it.
2. **Title.** Descriptive, not clever.
3. **Star rating with review count, inline under the title.** Not at the bottom.
4. **Price**, with per-unit breakdown where it helps.
5. **Three to five benefit bullets** in the painter's language.
6. **Spec table.** Above the fold or immediately below. Never behind a tab.
7. **Quantity and add to cart**, sticky on scroll below 900px.
8. **Ship box** — origin, delivery window, shipping cost, duty position. Before the buy button.
9. **60-day return line** under the button.

Below the fold: swatch chart for the set, comparison block against brands the visitor already owns, the 12-month lightfast test gallery, maker story in two short paragraphs, reviews with photos, FAQ built from the objection table, related products.

## 6.2 Cart drawer

Drawer, never a page. Free-shipping progress bar against the US$80 threshold. Exactly one upsell (the Puli block, or the dot card if the cart is empty of trial SKUs). Editable quantity, visible product image, trust and returns note. Single dominant checkout button plus accelerated wallet row (Shop Pay, Apple Pay, Google Pay, PayPal). Guest checkout implied.

## 6.3 Collection page

Product cards need image with second-image-on-hover, title, price, star rating, and a granulation indicator. Filters that matter to painters: by hue family, by granulation, by transparency, by Blue Wool rating. Sort by best-selling as default. Quick-add without leaving the page.

## 6.4 The Chart page

The signature page and the SEO asset. Full interactive grid, downloadable PDF, printable swatch sheet. Targets pigment-code search. This page will be screenshotted and linked to more than the homepage.

## 6.5 Homepage

Under ten sections. Announcement bar with the shipping threshold. Hero with one promise and one CTA. Data strip. The Chart preview. Price ladder, three cards. Proof block. Maker story. Email capture with a real incentive. Footer with policies, contact and shipping visible.

No carousel. No hero slider.

## 6.6 Pages everyone forgets

Shipping and returns (generous, plain, specific — one of the most-visited pages before a first purchase). Thank-you page with post-purchase upsell. 404 routing to best sellers. Wholesale and stockists.

---

# PART 7 — CONVERSION NON-NEGOTIABLES

These do not get renegotiated by the design layer.

- Mobile-first at 390px. 65–85% of sessions.
- LCP under 2.5s, INP under 200ms, CLS under 0.1, total page weight under 2MB, mobile PageSpeed above 60
- Two font families maximum
- Shipping cost and duty position visible before checkout
- Reviews inline under the title
- Sticky ATC on mobile
- Cart drawer, not a cart page
- Accelerated wallets prominent
- Product structured data valid and matching visible content exactly. Schema drift makes AI crawlers drop the page.
- Visible keyboard focus, `prefers-reduced-motion` respected, alt text on every image

---

# PART 8 — TECH

- Static site, no framework requirement. Vanilla HTML/CSS/JS or a light build step. No React unless there is a reason.
- Component-based. Build a modular section library so new products and seasonal pages assemble from existing parts rather than bespoke pages.
- No browser storage APIs. Cart state in memory.
- Data in `data/pigments.json` and `data/products.json`. Never hard-code a pigment into markup.
- Swatch rendering is a single reusable function taking a pigment object and returning a style string.
- SVG filters defined once, globally, referenced everywhere.

Suggested structure:

```
/index.html
/product.html
/chart.html
/collection.html
/data/pigments.json
/data/products.json
/css/tokens.css
/css/components.css
/js/swatch.js      // paintStyle(pigment) -> css string
/js/cart.js
/js/chart.js
/assets/patterns/  // inline SVG grille + tile
```

---

# PART 9 — ACCEPTANCE CRITERIA

Do not call it done until all of these pass.

**Function**
- [ ] Add to cart works from PDP, collection card and cart upsell
- [ ] Free-shipping bar updates correctly and flips state at US$80
- [ ] Chart readout updates on hover and on tap, and works with keyboard
- [ ] Every one of the 18 pigments renders with correct hex, code, Blue Wool and granulation texture
- [ ] Non-granulating pigments render visibly flatter than "very heavy" ones

**Technical**
- [ ] Mobile PageSpeed above 60 on a throttled connection, tested at 390px
- [ ] LCP image preloaded, not lazy-loaded
- [ ] Total page weight under 2MB
- [ ] Product schema validates and matches visible content
- [ ] Focus visible on every interactive element
- [ ] `prefers-reduced-motion` disables the wash animations
- [ ] No console errors

**Content**
- [ ] Every objection in 3.4 is answered by a specific element
- [ ] Hansa Yellow Light's Blue Wool 6 is visible in at least three places
- [ ] No banned vocabulary from 4.4 anywhere in the copy
- [ ] Maximum one em dash sitewide
- [ ] No lorem ipsum
- [ ] Shipping, duty and returns stated on the PDP above the buy button

---

# PART 10 — DO NOT

- Do not build a countdown timer, a spin-to-win, an exit-intent discount popup, or any urgency mechanic
- Do not put the spec table behind a tab or an accordion
- Do not hide or round up the Blue Wool 6 result
- Do not use a warm cream background or a terracotta accent
- Do not use red-and-gold, dragons or brush-script type
- Do not add a homepage carousel
- Do not exceed six third-party scripts
- Do not invent pigments, prices, certifications, awards or press mentions
- Do not write a 50-word product page. High-consideration products need enough content to answer every pre-purchase question.
- Do not lead any copy with a demographic
