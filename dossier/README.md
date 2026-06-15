# TuxMat engineering dossier prototype

The unexpected one. Landing page, product page, and order flow merged
into a single continuous document: a numbered engineering dossier
(Sheet 01-06) in paper and ink, the inversion of the dark-glass suite.

Vanilla HTML/CSS/JS. GSAP (CDN) for scroll choreography. No build step,
and uniquely in the suite: **zero photography dependence**. Every
figure is inline SVG line art (plan view, contour survey, section A-A),
so this version is shippable without a single asset delivery.

## Run

```
python3 -m http.server 4176
```

## The experience

- Sheet 01: title block hero, drawn like an engineering drawing's
  title block.
- Sheets 02-04: the brand argument as technical figures that draw
  themselves stroke by stroke as you scroll. A laser scan line sweeps
  the contour survey on Sheet 03.
- Sheet 05: the coverage specification table.
- Sheet 06: the work order (configurator), which numbers itself per
  vehicle (NO. TM-2025-001).
- The cart is a receipt-styled order ticket with a dashed perforation
  edge; checkout is one panel; success is a gold "ORDER PLACED" stamp.
- A floating order strip appears when the work order scrolls away.

## Motion

All animation gates behind `prefers-reduced-motion`. With motion off
(or `?static`), every drawing renders fully drawn and every element is
visible. The draw-on-scroll effect is additive only.

## Sample data

`TIERS` pricing and `VEHICLES` are placeholders for the live Shopify
catalog. The checkout processes nothing; demo tags say so on both
panels.
