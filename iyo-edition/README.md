# TuxMat — iyO Edition

A mobile-first, cinematic e-commerce experience for TuxMat, with the
UX/UI register of [iyo.ai](https://www.iyo.ai/): a deep-black canvas, a
floating glass navigation, a full-bleed product video hero, oversized
sentence-case statements with generous negative space, scroll-driven
reveals, a clean product configurator, and a reserve-style buy flow.

Vanilla HTML/CSS/JS. No build step. Designed at a phone width first,
then scaled up.

## Pages
- `index.html` — landing: cinematic video hero with the vehicle selector
  as the primary action, the two-product system, the three brand pillars
  (no-gaps coverage, engineering depth, design authority), a drag
  before/after, look-closer hotspots, a video band, scroll-snap image
  and review carousels, and a closing call to the selector.
- `product.html` — product page: sticky gallery, vehicle selector,
  coverage and finish configurator, sticky add-to-cart, Capsule
  cross-sell, spec accordions, cart drawer, and a one-step demo checkout
  with Shop Pay / Apple Pay facades.

## Run
```
python3 -m http.server 4188 --directory .
```
Then open http://localhost:4188 . Serve over HTTP(S), not `file://`, so
the hero and editorial videos autoplay.

## Design notes
- Palette: near-black (`#070708`) with off-white text and a single
  restrained metallic-gold accent (`#d8be86`).
- Type: Inter Tight for display, Inter for body. Large `clamp()` scale,
  tight letter-spacing on headlines.
- Motion: muted autoplay video, `IntersectionObserver` reveals, CSS
  scroll-snap carousels, and a glass nav that solidifies on scroll. All
  motion is disabled under `prefers-reduced-motion`.

## Copy and claims
Follows TuxMat voice and the approved-claims guardrails: sentence case,
no em-dashes, no exclamation marks, no urgency tactics. "Up to 2.5x more
coverage" is footnoted to the 2025 Tesla Model Y OEM comparison; 4.8★ is
footnoted to 4,500+ Google Ratings; the warranty is written exactly as
"Limited Lifetime Warranty"; protection is described as water-resistant,
never waterproof.

## Notes for production
- Sample pricing and vehicle data stand in for the live Shopify catalog.
- Checkout is a demo; no payment is processed.
- Media is reused from the kit's shared asset library. Replace a file in
  `assets/` with the same name to swap imagery.
