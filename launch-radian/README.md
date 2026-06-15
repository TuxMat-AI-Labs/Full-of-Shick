# TuxMat — Launch site (Radian register)

A TuxMat site in the look and feel of rideradian.com: a premium
product-launch experience. Black ground, electric-gold accent, heavy
uppercase display type, full-viewport video hero, scroll reveals, and a
distinctive multi-step reserve configurator.

Vanilla HTML/CSS/JS. No build step.

## Pages
- `index.html` — launch home: video hero, 7-feature carousel, brand
  narrative with map coordinates, use-case sections, engineering
  crossfade carousel, and a reserve CTA.
- `reserve.html` — the Radian-style stepped configurator: Region →
  Vehicle → Coverage → Finish → Reserve, with a step indicator, a
  rotating gallery, an order summary, and a refundable $99 deposit.

## Run
```
python3 -m http.server 4181
```
Then open http://localhost:4181 .

## Notes
- Hero uses `assets/hero.mp4` (Porsche brand film) with a poster
  fallback. Real TuxMat photography/video throughout.
- The reserve flow and $99 deposit are a demo; no payment is processed.
- Sample pricing and vehicle data stand in for the live catalog.
- Copy follows TuxMat rules: approved claims, footnoted 2.5x, exact
  "Limited Lifetime Warranty," water-resistant never waterproof.
