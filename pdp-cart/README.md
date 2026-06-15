# TuxMat product page and cart workflow prototype

Vanilla HTML/CSS/JS. GSAP (CDN) for scroll choreography. No build step.

A high-converting PDP in the Apple product-page register: sticky local
nav with anchors and a buy button, floating add-to-cart bar, coverage
guide and comparison tables, cart drawer, and a one-step demo checkout.
Ambient blurred light fields drift behind the page; surfaces are glass.

## Run

```
python3 -m http.server 4175
```

## The workflow

1. Configure: year/make/model, coverage tier, finish. Add to Cart stays
   disabled until the vehicle is complete.
2. The floating bar and local nav appear once the configurator scrolls
   out of view; both carry live price and selection summary.
3. Cart drawer: line items with quantity and remove, subtotal, express
   buttons, checkout.
4. One-step checkout: contact, shipping, and payment on a single panel.
   Submitting shows the success state. No payment is processed; the
   demo tag in the drawer says so on both panels.

## Dropping in final assets

All media slots are wired to the `ASSETS` object at the top of
`app.js` (pdpHero, bleedDesign, bleedEngineering). Stills or muted
loops; the slot `aria-label` becomes the alt text.

## Sample data

`TIERS` pricing and the `VEHICLES` list are placeholders. Production
should source both from the live Shopify catalog and hand the cart to
the real checkout.

## Motion

All animation gates behind `prefers-reduced-motion`. Append `?static`
to preview the no-motion fallback.
