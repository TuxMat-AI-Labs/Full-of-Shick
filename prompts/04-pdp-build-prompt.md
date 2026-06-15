# Build prompt: high-converting TuxMat product page and cart workflow

This is the prompt that produced `pdp-cart/`. The first block is the
original ask; the second block is the TuxMat guardrail set carried over
from 03-build-prompt.md, which was applied to this build. Run both
together in Claude Code to reproduce or extend the result.

---

## The ask

Design and build a high-converting e-commerce product page and cart
workflow. Include a floating "Add to Cart" button, sticky navigation, a
prominent size guide/comparison table, and a frictionless 1-step
checkout. Use a modern, minimalist layout with blurred background
elements and smooth parallax scrolling. Push this even further to be
bold and aspirational. As well, look at https://www.apple.com/ca/ as a
best-practice web design with large imagery and video content for a
dynamic experience.

## TuxMat guardrails (apply to every part of the build)

BRAND
- Product: TuxMat® custom-fit floor mats. Positioning: "Nothing
  Overlooked. Because You Notice." Quietly confident, precise, premium.
- Copy rules: sentence case, short declaratives, no em-dashes, no
  exclamation marks. Every claim carries its proof in the same breath.
- Approved claims only: "up to 2.5x more coverage"* (*Surface area
  comparison to 2025 Tesla Model Y OEM floor mats); "developed using 3D
  laser scanning"; "TriForce™ multi-layer construction"; "rated 4.8★"**
  (**Based on 4,500+ Google Ratings); "Limited Lifetime Warranty"
  (exact phrase); "Designed to elevate." Water-resistant, never
  "waterproof." Do not invent claims, statistics, awards, or reviews.

CONVERSION STRUCTURE
- The configurator (year/make/model, coverage tier, finish) is the
  primary interaction. Add to Cart stays disabled until the vehicle is
  complete.
- The floating bar and sticky local nav carry live price and selection
  state, and return the user to the configurator when nothing is
  selected.
- The size guide is a coverage-tier table (zones x configurations with
  prices); the comparison table argues TuxMat vs conventional mats
  line by line.
- Checkout is one panel: contact, shipping, payment together. The
  prototype processes nothing; label it "demo · no payment is
  processed" wherever money appears to change hands.

TECH
- Vanilla HTML/CSS/JS, GSAP via CDN, no framework. Blurred background
  elements as cheap gradient orbs plus backdrop-filter glass, never
  large filter: blur() surfaces. Parallax via GSAP scrub, transform and
  opacity only, no scroll-jacking.
- Complete static fallback behind prefers-reduced-motion (and a
  ?static override for testing). Semantic HTML, alt text on every
  media slot.
- Every image and video slot wired to a single ASSETS config object so
  finals drop in without touching layout. Pricing and vehicle data are
  clearly marked sample data for the live Shopify catalog to replace.

VERIFY
- Run on a local server. Screenshot 1440px and 390px. Zero console
  errors, zero horizontal overflow, CLS under 0.1. Exercise the whole
  workflow before declaring done: configure, add to cart, change
  quantity, checkout, success state, cart cleared.
