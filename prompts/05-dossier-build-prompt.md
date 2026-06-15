# Build prompt: the unexpected version (engineering dossier)

This is the prompt and concept that produced `dossier/`. The ask was
open-ended by design; the concept block records the creative direction
that answered it, so the result can be reproduced, extended, or
deliberately re-invented. TuxMat guardrails from 03/04 apply throughout.

---

## The ask

Create a totally unexpected version of our landing page and product
page (PDP). Think beyond anything we've done before and something that
is a groundbreaking experience, that also will be responsive, working
great on mobile too.

## The concept that answered it

THE INVERSION
- Everything prior in the suite is dark glass, photography-led, and
  split across pages. So: light paper and ink, illustration-led, and
  one continuous document. Landing page, product page, and order flow
  merged into a single numbered engineering dossier (Sheet 01 to 06).

THE DOCUMENT
- Sheet 01: a title block hero laid out like a real drawing's title
  block (DWG NO., SCALE 1:1, DRAWN BY, MATERIAL).
- Sheets 02-04: the brand argument as technical figures. A plan view
  of conventional-vs-TuxMat coverage with dimension lines. A
  topographic contour survey swept by a laser scan line. A Section A-A
  cross-section of the TriForce™ layers with hatch patterns.
- Sheet 05: the coverage specification table.
- Sheet 06: the configurator as a work order that numbers itself per
  vehicle (NO. TM-[year]-001), closing with a rubber-stamp signoff.
- The cart is a receipt-styled order ticket: dashed perforation edge,
  mono type, line items carrying their work-order numbers, "Strike
  line" for remove, one-step checkout, success as a gold ORDER PLACED
  stamp.

THE SIGNATURE MOVE
- Every figure is inline SVG line art that draws itself stroke by
  stroke as it scrolls into view (stroke-dashoffset scrubbed by GSAP).
  Annotations surface after their drawing. With prefers-reduced-motion
  (or ?static) every drawing renders fully drawn.

THE PRACTICAL SUPERPOWER
- Zero photography dependence. No ASSETS slots, no placeholders, no
  waiting on a shoot. This is the only version in the suite that can
  ship without a single asset delivery.

TYPE AND COLOR
- Fraunces (serif statements), IBM Plex Mono (annotations, labels,
  receipt), Inter (body). Paper #f6f3ed on a faint graph-paper grid,
  near-black ink, gold reserved for the stamp moments. Buttons are
  square, ink-filled, mono, letterspaced.

GUARDRAILS (same as 03/04)
- Approved claims only, footnoted in place (2.5x Tesla Model Y
  comparison; 4.8★ Google Ratings; "Limited Lifetime Warranty" exact).
  No em-dashes, no exclamation marks, sentence case. Demo checkout
  labeled "demo · no payment is processed." Sample TIERS and VEHICLES
  data marked for live Shopify replacement. Vanilla HTML/CSS/JS plus
  GSAP CDN, mobile-first, no horizontal overflow, full reduced-motion
  fallback.
