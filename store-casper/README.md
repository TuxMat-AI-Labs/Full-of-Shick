# TuxMat storefront prototype

A three-page TuxMat store in the style of casperscaviar.com: luxury-
minimal, warm light ground, centered serif nav, full-bleed hero, jewel-
tone color-blocked product sections, an editorial band, an interactive
before/after slider, and a clean two-column product page. Persistent
cart and a one-step demo checkout.

Real TuxMat photography (pulled from tuxmat.ca) is already baked into
`assets/`. Vanilla HTML/CSS/JS. No build step, no framework.

## Pages

- `index.html` — homepage
- `shop.html` — Shop All collection
- `product.html` — the 2026 Audi A3 product page

## How to view it (for colleagues)

Easiest: double-click `index.html` to open it in your browser. Most
features work this way.

Best (everything works, including the cart and the video check): run a
tiny local server from this folder, then open the address it prints.

  macOS / Linux:   python3 -m http.server 4180
  Windows:         py -m http.server 4180

Then open  http://localhost:4180  in your browser.

## What's interactive

- **Hero + editorial band are video-ready.** They show a real TuxMat
  photo now. Drop a video in (see below) and it autoplays in place.
- **Before/after slider** ("See the difference" on the homepage). Drag
  the handle to wipe between a footwell with and without a TuxMat.
- **Click any product image to zoom.** The product-page gallery opens a
  full-screen lightbox with next/previous through all four views. The
  homepage product sections zoom too.
- **Hover the shop cards** to see a second angle and a gentle zoom.
- **Cart** persists across pages; checkout is one step (a demo, no
  payment is taken).

## Video (included)

Real TuxMat cinematic video is wired in and autoplays muted on loop:

- Homepage hero: `assets/hero-home.mp4` (Porsche Q3 brand film, 6.6 MB)
- Editorial band: `assets/editorial-standard.mp4` (Genesis A1, 29 MB)

To swap either, overwrite the file with the same name and refresh. Each
slot falls back to its poster photo (`hero-home.jpg` /
`editorial-standard.jpg`) if the video is removed. Keep clips muted,
landscape, and reasonably small for the web.

## Swapping any image

Every image lives in `assets/` with a descriptive name. To replace one,
overwrite the file with the same name and refresh. Full list:

- Home hero poster: `hero-home.jpg`
- Homepage product sections: `block-frontrow.jpg`, `block-secondrow.jpg`, `block-fullset.jpg`
- Before/after: `compare-with.jpg`, `compare-without.jpg` (must share dimensions)
- Editorial poster: `editorial-standard.jpg`
- Collection banner: `collection-hero.jpg`
- Shop cards (front + hover): `card-frontrow.jpg` / `card-frontrow-alt.jpg`, and the same for `secondrow`, `fullset`
- Product gallery: `pdp-audi-a3-1.jpg` … `pdp-audi-a3-4.jpg`
- Product origin image: `pdp-origin.jpg`

## Notes for production

- This is a static prototype. Wire it onto Shopify, or hand the cart to
  the real Shopify checkout. The demo checkout processes nothing.
- Pricing and the vehicle list in `app.js` are sample data for the live
  catalog to replace.
- Copy follows TuxMat rules: approved claims only, footnoted 2.5x and
  4.8★, "Limited Lifetime Warranty" written exactly, water-resistant
  never waterproof.
- Imagery is reused across a few slots (the interior shot on two heroes,
  the scanning shot on the editorial band and product origin). Hand over
  a few more photos and those can each become unique.
