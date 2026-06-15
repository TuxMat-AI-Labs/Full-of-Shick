# TuxMat landing page prototype

Vanilla HTML/CSS/JS. GSAP (CDN) for scroll choreography. No build step.

## Run

Serve the folder with any static server, for example:

```
python3 -m http.server 4173
```

## Dropping in final assets

Every image and video slot is wired to the `ASSETS` object at the top of
`app.js`. Place finals in `./assets` and set the path, for example:

```js
heroLoop: 'assets/hero-loop.mp4',
```

Slots accept stills (.jpg .png .webp .avif) or muted looping video
(.mp4 .webm, keep loops under 4MB). Layout never changes; the labeled
placeholder is replaced in place. The `aria-label` on each slot becomes
the image alt text automatically.

## Motion

All animation is gated behind `prefers-reduced-motion`. The page is
complete and fully visible with JS disabled. Append `?static` to the URL
to preview the reduced-motion fallback.

## Before production

- Point the selector CTA at the live Shopify fitment URL (see the
  submit handler in `app.js`); it currently links to tuxmat.ca.
- Replace the sample `VEHICLES` data with the live catalog feed.
- Self-host fonts and GSAP if CSP requires it.
