# TuxMat — iyO Edition

A faithful rebuild of the TuxMat storefront in the UX/UI of
[iyo.ai](https://www.iyo.ai/), based on the real iyo.ai page source.

iyo.ai is a Webflow site whose defining traits are: a **pure-black,
monochrome** canvas with almost no body copy; a **single-screen hero**
dominated by a **full-screen WebGL product** (`data-module="webgl"`);
**Lenis** smooth scroll and **Taxi.js** page transitions; a centered
**logotype** nav with a distinctive **3×3 dot-grid menu** that drops a
full-screen **product card grid**; a **product-card row**; and a
**slide-out Shopify cart** with quantity steppers, a discount field, a
cart note, subtotal and checkout.

This build mirrors all of that:

- **Pure-black / white monochrome**, Manrope type, minimal copy.
- **Single-screen hero** with a **Three.js product** centerpiece — a
  custom-fit mat that slowly rotates and is swept by a laser scan line
  that reveals a point cloud (TuxMat's 3D-laser-scanning story, shown
  literally). Falls back gracefully to a black stage if WebGL is absent;
  renders one static frame under `prefers-reduced-motion`.
- **Lenis** smooth scroll and a **page-transition veil** (Taxi-like).
- Centered **`tuxmat`** logotype, a **3×3 dot-grid menu** that opens a
  full-screen **card menu**, and a **slide-out cart** with quantity
  steppers, discount code, cart note, subtotal and a one-step demo
  checkout.
- A **product-card row** (Floor Mats, SuperTrunk, Capsule, Seat — soon)
  with Learn more / Shop now, plus one restrained proof section.

## Pages
- `index.html` — single-screen hero (WebGL canvas + product cards),
  one proof section with a drag before/after, footer.
- `product.html` — dark product page: gallery, vehicle selector,
  coverage + finish configurator, sticky add-to-cart, Capsule
  cross-sell, spec accordions, shared dot-menu and slide cart.

## Files
- `styles.css` — the monochrome design system.
- `app.js` — Lenis, dot-menu, slide cart, configurator, transitions.
- `hero3d.js` — the Three.js hero (ES module; Three.js via importmap CDN).

## Run
```
python3 -m http.server 4189 --directory .
```
Open http://localhost:4189 . Serve over HTTP(S), not `file://`. The hero
needs a network connection at runtime for Three.js and Lenis (loaded
from CDN), exactly as the real iyo.ai loads its dependencies.

## Copy and claims
Follows TuxMat's approved-claims guardrails: sentence case, no em-dashes,
no exclamation marks, no urgency tactics. "Up to 2.5x more coverage"
footnoted to the 2025 Tesla Model Y OEM comparison; 4.8★ to 4,500+
Google Ratings; exact "Limited Lifetime Warranty"; water-resistant,
never waterproof.

## Notes for production
- Sample pricing and vehicle data stand in for the live Shopify catalog.
- Checkout is a demo; no payment is processed.
- Product imagery reuses the kit's shared asset library. The hero is
  generated in 3D, so no product render file is required.
