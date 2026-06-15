# Staged prompt sequence: tuxmat.ca UX/UI audit and redesign plan

Run these four prompts in order, in the same Claude Code session with
the Chrome extension connected, so each prompt builds on the
screenshots and findings before it. Recommended over the one-shot
master prompt when you want full depth per phase.

---

## Prompt 1 — See it, then judge it

Use the browser to navigate the site and take screenshots at both
viewports before writing anything. Site: https://www.tuxmat.ca/
Viewports: 1440px desktop and 390px mobile. Capture: homepage top to
bottom, the vehicle selector flow, one product detail page, the cart
drawer, and checkout entry.

You are a senior UX/CRO lead for premium Shopify e-commerce. Context:
TuxMat sells custom-fit floor mats and the TuxMat Capsule™ License Plate
Case. Bilingual EN/FR, Canadian market. The brand is repositioning under
"Nothing Overlooked. Because You Notice": premium, design-led, quietly
confident. The customer is 38-55, analytical, detail-obsessed, distrusts
hype, and notices placeholder text and slow pages instantly.

Audit what you captured. Treat the year/make/model selector as the
primary CTA sitewide. Verify these suspected issues: a lorem ipsum
placeholder section live on the homepage; the vehicle selector not
prominent in the hero; headlines mixing the new refined voice with
retired loud patterns; expert reviews linking off-site to YouTube.

Deliver only two things for now:
1. A scorecard rating each page 1-10 on first impression, hierarchy,
   conversion clarity, brand fit, mobile experience, and accessibility,
   one line of justification per score, citing what you saw in the
   screenshots.
2. The top 10 problems ranked by (conversion impact x brand impact) /
   effort. No redesigns yet. Say when something could not be verified.

---

## Prompt 2 — SEO architecture before design

Using the audit above, build the SEO foundation that lets us strip
visible copy without losing organic strength.

1. Keyword map for the Canadian market, ranked by intent: "custom fit
   car mats," "floor mats for [year make model]," "[make model] floor
   mats," "winter floor mats Canada," and what you find beyond these.
   Assign exactly one primary keyword per template: homepage,
   collection, fitment/PDP, supporting content. Flag gaps vs
   WeatherTech, 3D MAXpider, and Husky Liners.
2. Fitment pages are the SEO engine for this category. Spec a scalable
   template whose H1, title tag, meta description, and structured data
   generate per year/make/model.
3. Rules for thin-content prevention with minimal visible copy:
   long-form spec and FAQ copy in accordions and tabs that stay in the
   DOM; semantic heading hierarchy on visual sections; descriptive alt
   text; captions or transcripts on all video; never put load-bearing
   text inside images or video.
4. Structured data spec: Product, AggregateRating, FAQPage, VideoObject,
   BreadcrumbList. Bilingual EN/FR hreflang implementation.
5. Meta titles under 60 characters in the register of "TuxMat |
   Precision-Fit Custom Floor Mats." Descriptions under 155. Sentence
   case, no em-dashes, no exclamation marks, factual and confident.

Output as a spec a developer and an SEO can execute from directly.

---

## Prompt 3 — The visual-first redesign

Now redesign the homepage and the PDP section by section, using the
screenshots from the audit and the SEO architecture above.

Design direction: visual-first and modern. Full-bleed video hero, macro
detail photography, generous negative space, restrained type scale.
Reference register: Porsche, Apple, Rivian product pages. Every section
leads with motion or imagery. Copy per section: one headline (max 8
words) plus one proof line (max 20 words). If a section needs a
paragraph, redesign the section. Distribute three visual pillars across
the page: category disruption (what other mats leave exposed), design
authority (interior harmony, two-tone styling, dramatic lighting), and
engineering depth (3D laser scanning, TriForce™ construction, precision
machining). Replace outbound YouTube review links with on-site embedded
video.

For each section deliver: wireframe-level layout description for both
viewports, the media asset it needs, and its full copy. The vehicle
selector is the first interactive element on every entry page; spec its
placement, sizing, states, defaults, and error handling. Every scroll
depth offers a path back to the selector.

Copy rules for every line you write: no em-dashes, no exclamation marks,
sentence case by default. Every claim carries its proof in the same
breath. "Up to 2.5x more coverage" always footnoted (2025 Tesla Model Y
OEM comparison). 4.8★ always footnoted (4,500+ Google Ratings). Warranty
written exactly as "Limited Lifetime Warranty." No urgency tactics,
countdown timers, or discount popups.

---

## Prompt 4 — Production plan and rollout

Finish with production and rollout, based on everything above.

1. Media shot list: every video and photo asset the redesign needs,
   mapped to its section, with format, aspect ratio, duration, and a
   one-line creative direction note per asset.
2. Performance budget the build must meet: LCP under 2.5s on 4G mobile,
   CLS under 0.1, lazy-load all below-fold media, responsive srcset,
   WebP/AVIF stills, WebM/MP4 loops under 4MB, poster-click facades for
   embeds. State the rule explicitly: if a video breaks the budget, the
   poster image ships instead.
3. 30/60/90 rollout: copy and metadata fixes this week (including
   removing the lorem ipsum section), component and template changes
   this month, fitment-page SEO architecture this quarter. Shopify-
   specific implementation notes on each item, no replatforming.

Close with the five metrics to watch post-launch and the expected
direction of each.
