# TuxMat landing page prototype (Three.js variant)

Vanilla HTML/CSS/JS. GSAP (CDN) for scroll choreography, Three.js (CDN,
ES module) for the hero. No build step.

The hero is a live 3D render: a stylized mat tray under one overhead
light, swept every few seconds by a laser scan line that reveals a
point cloud across the surface. Pointer parallax on hover devices,
slight tilt on scroll. The loop pauses when the hero is offscreen or
the tab is hidden. With `prefers-reduced-motion` (or `?static`) it
renders a single composed frame. If a `heroLoop` asset is set in
`app.js`, the delivered footage replaces the render entirely (see
`hero3d.js`). The non-3D original lives in `../tuxmat-landing`.

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
