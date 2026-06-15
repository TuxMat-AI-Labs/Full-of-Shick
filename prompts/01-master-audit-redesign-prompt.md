# Master one-shot prompt: tuxmat.ca UX/UI audit and redesign plan

Use when you want a single artifact to hand off or run on claude.ai.
For Claude Code with the Chrome extension, prefer the staged sequence
in 02-staged-sequence.md.

---

Use the browser to navigate the site and take screenshots at both
viewports before writing anything.

You are a senior UX/CRO lead, art director, and technical SEO specialist
for premium Shopify e-commerce. Redesign the experience of
https://www.tuxmat.ca/ around three directives: modernize the experience,
cut visible copy to the minimum, and shift the storytelling weight to
video and photography, without losing organic search strength.

CONTEXT
- TuxMat sells custom-fit floor mats and the TuxMat Capsule™ License
  Plate Case. Platform is Shopify, bilingual EN/FR, Canadian market.
- The brand is repositioning under "Nothing Overlooked. Because You
  Notice." Premium, design-led, quietly confident. The UI must feel
  like the brand: restrained, precise, considered.
- Primary customer: 38-55, household income $100K-175K, analytical,
  detail-obsessed, distrusts hype, researches like an enthusiast. He
  notices placeholder text, misalignment, and slow pages instantly.

DESIGN DIRECTION
- Visual-first and modern: full-bleed video hero, macro detail
  photography, generous negative space, restrained type scale, no
  decorative clutter. Reference register: Porsche, Apple, Rivian
  product pages.
- Every section leads with motion or imagery. Copy per section: one
  headline (max 8 words) plus one proof line (max 20 words). If a
  section needs a paragraph to work, redesign the section.
- Distribute three visual pillars across the page: category disruption
  (what other mats leave exposed), design authority (interior harmony,
  two-tone styling, dramatic lighting), and engineering depth (3D laser
  scanning, TriForce™ construction, precision machining).
- Replace outbound YouTube review links with on-site embedded video so
  high-intent traffic stays on the page.

SEO REQUIREMENTS (minimal visible copy must not mean thin content)
- Keyword map first: research and rank Canadian-market keywords by
  intent ("custom fit car mats," "floor mats for [year make model],"
  "[make model] floor mats," "winter floor mats Canada") and assign one
  primary keyword per template: homepage, collection, fitment/PDP, and
  supporting content pages. Identify gaps vs WeatherTech, 3D MAXpider,
  and Husky Liners.
- Vehicle fitment pages are the SEO engine for this category. Spec a
  scalable template whose H1, title tag, meta description, and schema
  generate per year/make/model.
- Preserve crawlable depth without on-screen bulk: long-form spec and
  FAQ copy lives in accordions and tabs that remain in the DOM. Never
  put load-bearing text inside images or video.
- Full structured data spec: Product, AggregateRating, FAQPage,
  VideoObject, BreadcrumbList. Bilingual hreflang for EN/FR.
- Semantic heading hierarchy on every page, including purely visual
  sections. Descriptive alt text on all imagery. Captions or
  transcripts for all video.
- Meta titles factual and confident, under 60 characters, in the
  register of "TuxMat | Precision-Fit Custom Floor Mats." Descriptions
  under 155 characters.

MEDIA AND PERFORMANCE
- Video plan: muted autoplay hero loop with poster frame, PDP install
  and fitment close-up videos, embedded expert reviews using a
  poster-click facade pattern.
- Hard performance budget: LCP under 2.5s on 4G mobile, CLS under 0.1.
  Lazy-load all below-fold media, responsive srcset, WebP/AVIF stills,
  compressed WebM/MP4 loops under 4MB. If a video breaks the budget,
  ship the poster image instead.
- Deliver a shot list: every video and photo asset the redesign needs,
  mapped to its section, with format, aspect ratio, and duration.

PROCESS
1. Screenshot at 1440px desktop and 390px mobile: homepage, vehicle
   selector flow, a product detail page, cart drawer, checkout entry.
2. Verify these known issues: a lorem ipsum placeholder section is live
   on the homepage; the vehicle selector is not prominent in the hero;
   headlines mix the new refined voice with retired loud patterns;
   expert reviews link off-site to YouTube.
3. Treat the year/make/model selector as the primary CTA sitewide.

DELIVERABLES
1. Keyword map and per-template on-page SEO spec.
2. Section-by-section redesign of the homepage and PDP: wireframe-level
   layout descriptions, the media asset each section needs, and its
   full copy within the word limits above.
3. Vehicle selector redesign as the first interactive element on every
   entry page: placement, sizing, states, defaults, error handling.
4. Structured data and hreflang spec, ready to hand to a developer.
5. Media shot list for the content team.
6. 30/60/90 plan: copy and metadata fixes this week, component and
   template changes this month, fitment-page SEO architecture this
   quarter, each with Shopify-specific implementation notes.

COPY RULES (apply to every line you write)
- No em-dashes. No exclamation marks. Sentence case by default.
- Every claim carries its proof in the same breath. "Up to 2.5x more
  coverage" always footnoted (2025 Tesla Model Y OEM comparison). 4.8★
  always footnoted (4,500+ Google Ratings). Warranty written exactly as
  "Limited Lifetime Warranty."
- No urgency tactics, countdown timers, or discount popups. This brand
  earns the sale.

CONSTRAINTS
- Stay on Shopify; no replatforming.
- Mobile-first; mobile is the majority experience.
- Story supports conversion, never blocks it: every scroll depth offers
  a path to the vehicle selector.
- Be direct, rank everything, and say when something cannot be verified
  from what you can see.
