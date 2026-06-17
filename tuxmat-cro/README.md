# TuxMat — Mobile-First Conversion Prototype

A working, mobile-first prototype of the TuxMat experience, built around
two inputs: the agency mobile-CRO assessment and Yuchen's "keep new cars
new" positioning. Apple-clean, video-led, with the interactivity from the
reference build (drag compare, look-closer hotspots, product ecosystem,
review carousel, sticky add-to-cart).

Vanilla HTML/CSS/JS. No build step.

## Pages
- `index.html` — homepage: video hero with the vehicle selector as the
  primary action, the product ecosystem, "look closer" coverage hotspots,
  before/after slider, video band, review carousel.
- `product.html` — product page: sticky add-to-cart, plain-language
  coverage, Capsule cross-sell, Shop Pay pay-in-4, one-step demo checkout.

## Run
```
python3 -m http.server 4184
```
Then open http://localhost:4184 . Best viewed at a phone width first.

## Narrative
Open on the dread, land on the certainty. We are not a floor-mat company;
we keep new cars new. The only claims we make are the two a great phone
case earns: it covers everything with no gaps, and it looks like it
belongs. See the team's narrative framework for the full guardrails.

## Assets
All media lives in `assets/`. To replace an image, overwrite the file
with the same name and refresh. Key Capsule slots:

- `assets/tile-capsule.jpg` — homepage Capsule tile (square, ~1000×1000)
- `assets/xsell-capsule.jpg` — product-page cross-sell thumbnail (square, ~600×600)

Hero and editorial videos (`hero.mp4`, `editorial.mp4`) autoplay muted
with a poster fallback.

## Notes for production
- Sample pricing and vehicle data stand in for the live Shopify catalog.
- Checkout is a demo; no payment is processed.
- Copy follows TuxMat voice: approved claims, footnoted proof, exact
  "Limited Lifetime Warranty," water-resistant never waterproof.
