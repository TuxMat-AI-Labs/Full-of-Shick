# TuxMat: The Gold Line prototype

Black throughout, with bold areas of brand gold. One unbroken gold
line of light travels the entire page: the laser's path. Vertical
thread connectors run between panels, and inside each panel the same
line becomes a single-stroke figure that draws itself on scroll:

- Segment 01: the line draws the mat's contour (outer edge, inner
  floor line).
- Segment 02: the line rasters back and forth, the path of the scan.
- Segment 03: the line loops three times, one loop per TriForce™
  layer.
- Segment 04: coverage tiers as cards; the selected tier turns solid
  gold.
- Segment 05: the order. "The line ends at your door."

Bold gold inversions carry the statements: a full-gold "Because You
Notice." panel and a gold proof panel where 4.8★ and 2.5x count up on
entry (both footnoted). The floating add-to-order strip is solid gold;
the order drawer is black with a gold spine, and the success state
draws a gold check.

Like the dossier, every figure is inline SVG: zero photography
dependence.

## Run

```
python3 -m http.server 4177
```

## Motion

All animation gates behind `prefers-reduced-motion`. With motion off
(or `?static`), the line renders complete, counters show final values,
and every element is visible.

## Sample data

`TIERS` pricing and `VEHICLES` are placeholders for the live Shopify
catalog. The checkout processes nothing; demo tags say so on both
panels.
