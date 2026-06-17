# Capsule — License Plate Launch Event (interactive presentation)

A single-file, four-section interactive showcase built to storytell the
Capsule launch at the internal launch party. Open it on the big screen,
click a piece of the exploded license-plate case, and walk the room
through what marketing built. Black ground, electric-gold accent — same
register as the rest of the kit.

Vanilla HTML/CSS/JS. No build step. Everything is in `index.html`.

## Run
```
python3 -m http.server 4190
```
Then open http://localhost:4190/capsule-launch/ (or just open
`index.html` directly — it works from `file://` too).

## The four sections

1. **Exploded View (hub).** The Capsule case, exploded. Each product
   piece is a click-through:
   - **Black frame → Section 2 (Prelaunch)**
   - **Clear UV protection layer → Section 3 (Launch)**
   - **Plate face → Section 4 (Social)**
   The pieces drift apart and back together in a slow loop (gated behind
   `prefers-reduced-motion`); hovering pauses it.
2. **Prelaunch.** Prelaunch video ads playing, the warm-up email flow
   scrolling up, and the live waitlist webpage scrolling — laid out per
   the "Capsule Prelaunch Assets" sketch. Back-to-hub control top-right.
3. **Launch.** An Amazon-style product listing with a thumbnail gallery,
   plus the launch asset grid, per the "Capsule Launch — Amazon and
   Social" sketch. Bridges to Section 4 for the social cut.
4. **Social.** Placeholder frames for Instagram, TikTok, YouTube, and
   Pinterest — the social finals are still in production.

### Navigation
- Click any hotspot / button.
- Keyboard: `1`–`4` jump to a section, `Esc` returns to the hub, `G`
  toggles the hotspot outlines (handy when aligning a new exploded
  image before the party).
- The current section is reflected in the URL hash and the top-bar
  step indicator.

## Assets — and dropping in finals

Same convention as the rest of the kit: every slot is wired by filename
and hydrated at runtime, so dropping a final into the right folder is
all it takes. Missing files fail silently and leave their slot empty.

- **`assets/capsule-exploded.png`** — the hero exploded photo for
  Section 1. **Not committed yet.** Until it exists, the page renders a
  built-in SVG exploded illustration so the interaction works today. As
  soon as you drop the real PNG in, it takes over the stage
  automatically. The three clickable hotspots are positioned as
  percentages of the stage (`.hot-frame`, `.hot-uv`, `.hot-plate` in the
  `<style>` block) and are tuned to the built-in art — when you add the
  real photo, press `G` to show the outlines and nudge those three rules
  so each hotspot lands on the matching piece.
- **`assets/`** — prelaunch media (video ads, email imagery, waitlist
  site). Currently seeded with the real launch marketing assets copied
  from `launch-radian/assets/` so the room sees finished work today.
- **`Launch/`** — Section 3 launch assets (Amazon gallery + grid). Also
  seeded from the real launch marketing set.
- **`social/`** — Section 4 social finals. Empty placeholder folder; the
  cards are placeholders until these arrive.

To swap in different content, edit the small data arrays at the bottom
of `index.html` (`EMAILS`, `LAUNCH`, `SOCIAL`, and the Amazon `set`).

## Notes
- All motion gates behind `prefers-reduced-motion`.
- Copy follows the kit's claim rules (2.5× coverage, 4.8★, "Limited
  Lifetime Warranty"), with footnote markers. No em-dashes or
  exclamation marks in on-screen copy.
- The seeded prelaunch/launch imagery is stand-in marketing photography
  from the Radian launch set. Replace with the true Capsule finals
  before any external use.
