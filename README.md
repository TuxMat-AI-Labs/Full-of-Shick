# TuxMat web kit

Everything from the web prototype sessions, June 11-12, 2026. Five
concept prototypes plus three full multi-page sites, with the prompts
that produced them and that scope the larger tuxmat.ca UX/SEO redesign.

Open `index.html` at this folder's root for the front-door gallery that
links into all eight designs.

## Contents

| Folder | What it is |
|---|---|
| `index.html` | Front-door gallery (black-and-gold Gold Line aesthetic). Links into all eight designs. Start here. |
| `landing-original/` | Landing page prototype. GSAP scroll choreography, dark cinematic, now with real photography and a cinematic hero video. |
| `landing-threejs/` | Alternate version. Live Three.js mat-tray hero with a laser-scan point cloud; the rest populated with real macro and interior photography. |
| `pdp-cart/` | Product page and cart workflow in the Apple PDP register: sticky local nav, floating add-to-cart, coverage and comparison tables, cart drawer, one-step demo checkout. Real interior + cinematic video. |
| `dossier/` | An unexpected one. Landing + PDP + order merged into a paper-and-ink engineering dossier (Sheet 01-06): self-drawing SVG figures, a self-numbering work order, a receipt-styled order ticket. Zero photography by design. |
| `goldline/` | The other unexpected one. Black with bold brand gold. One unbroken gold line draws the whole story on scroll, with solid-gold statement panels and count-up proof. Zero photography by design. |
| `store-casper/` | Full three-page storefront (home, shop, product) in a luxury-minimal register, modeled on casperscaviar.com: jewel-tone product sections, before/after slider, click-to-zoom galleries, video hero and editorial, persistent cart, one-step demo checkout. |
| `launch-radian/` | Two-page product-launch site modeled on rideradian.com: electric-gold on black, full-viewport video hero, seven-feature carousel, brand narrative with coordinates, and a multi-step reserve configurator with a refundable deposit. |
| `catalog-x8/` | Two-page futuristic catalog modeled on x8.adencys.com: monochrome titanium, all-caps minimal, hamburger menu reveal, video hero with collection tabs, quick-add grid, and a URL-param product page with 001-004 model tabs. |
| `prompts/01-master-audit-redesign-prompt.md` | One-shot prompt: full tuxmat.ca UX/CRO/SEO audit and redesign plan. |
| `prompts/02-staged-sequence.md` | The same scope as four sequential prompts (recommended in Claude Code with Chrome). |
| `prompts/03-build-prompt.md` | The build prompt that produced the two landing pages. |
| `prompts/04-pdp-build-prompt.md` | The build prompt and guardrails that produced the product page. |
| `prompts/05-dossier-build-prompt.md` | The ask and creative concept behind the dossier version. |
| `prompts/06-goldline-build-prompt.md` | The ask and creative concept behind the Gold Line version. |

## Run the kit

The fastest way in: serve this folder's root and open the gallery.

```
python3 -m http.server 4178
```

Then open http://localhost:4178 for `index.html`, and click into any
prototype from there. To run a single prototype on its own, serve its
folder instead. No build step, no install. Each folder's own README
covers the details.

## Shared conventions

- Every image and video slot is wired to the `ASSETS` object at the
  top of `app.js`. Drop finals into `assets/` and set the path; layout
  never changes and alt text is applied automatically. Same pattern as
  the capsule launch page. (Exception: `dossier/` and `goldline/` have
  no media slots at all; every figure is inline SVG line art by design.)
- All motion gates behind `prefers-reduced-motion`. Append `?static`
  to any URL to preview the no-motion fallback.
- Copy is locked to approved claims with mandatory footnotes (2.5x
  coverage, 4.8★ rating, "Limited Lifetime Warranty" exact). No
  em-dashes, no exclamation marks.

## Before production

- Point the selector CTA at the live Shopify fitment URL (submit
  handler in `app.js`); it currently links to tuxmat.ca.
- Replace the sample `VEHICLES` data with the live catalog feed. In
  `pdp-cart/`, `dossier/`, and `goldline/`, the `TIERS` pricing is also
  sample data, and the demo checkouts must be replaced by the real
  Shopify checkout.
- Drop real photography and video into the `ASSETS` slots.
- Self-host fonts, GSAP, and Three.js if CSP requires it.

## Verified state (as packaged)

All eight designs and the gallery: zero console errors, no horizontal
overflow at 1440px or 390px, reduced-motion fallback confirmed. The
purchase / reserve flows (pdp-cart, dossier, goldline, store-casper,
launch-radian, catalog-x8) were exercised end to end: configure, add,
checkout / reserve, confirmation. Working copies live at
`~/tuxmat-landing`, `~/tuxmat-landing-3d`, `~/tuxmat-pdp`,
`~/tuxmat-dossier`, `~/tuxmat-goldline`, `~/tuxmat-store`,
`~/tuxmat-radian`, and `~/tuxmat-x8`; this kit is a snapshot.

Note: serve the kit over a local server (above) rather than opening the
gallery as a `file://` page, so the hero videos and cart behave normally.
