# TUXMAT // Catalog (X8 / Adencys register)

A TuxMat site in the look and feel of x8.adencys.com: futuristic-luxury,
monochrome titanium, all-caps minimal type, a hamburger MENU reveal, a
video hero with collection tabs, a QUICK-ADD collection grid, and a
URL-parameter-driven product page with 001-004 model tabs.

Vanilla HTML/CSS/JS. No build step.

## Pages
- `index.html` — futuristic home: video hero with collection tabs, a
  scrolling spec marquee, and the collection grid with hover QUICK ADD.
- `product.html` — two-column PDP driven by URL params, e.g.
  `product.html?collection=cargoline-y1&model=003&price=$279.00`.
  Model tabs (001-004) swap the image and variant; Shop-Pay-style
  installment line; spec accordions; related products; cart drawer.

## Run
```
python3 -m http.server 4182
```
Then open http://localhost:4182 .

## Notes
- Hero uses `assets/hero.mp4` (Genesis Reveal) with a poster fallback.
- Cart persists across pages (localStorage). Checkout is a one-step
  demo; no payment is processed.
- Collection codes (FLOORLINE // X1, CARGOLINE // Y1, CAPSULE // Z1) and
  sample pricing stand in for the live catalog.
- Copy follows TuxMat rules: approved claims, footnoted 2.5x, exact
  "Limited Lifetime Warranty," water-resistant never waterproof.
