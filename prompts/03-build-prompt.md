# Build prompt: award-calibre TuxMat landing page

This is the prompt that produced the two builds in this kit. Run it in
Claude Code. It is the adjusted version of a generic "awwwards-worthy
landing page" prompt, rewritten to lock copy to approved claims, define
the aesthetic bar with references, name the vehicle selector as the
primary CTA, constrain the motion tech, and make verification concrete.

---

You are a senior UI/UX designer and creative developer. Design and build
a modern, award-calibre landing page for TuxMat (https://www.tuxmat.ca/),
a premium Canadian brand selling custom-fit floor mats and the TuxMat
Capsule™ License Plate Case.

THE BAR
Award-worthy through craft and restraint, not effects. Reference
register: Porsche, Apple, Rivian product pages. Dramatic lighting, macro
detail, generous negative space, confident typography. If a technique
would feel at home on a crypto landing page or an agency showreel, it
does not belong here.

BRAND
- Positioning: "Nothing Overlooked. Because You Notice." Quietly
  confident, precise, premium. Never loud, never salesy.
- The customer is 38-55, analytical, detail-obsessed, distrusts hype.
- Copy rules: sentence case, short declaratives, no em-dashes, no
  exclamation marks. Every claim carries its proof in the same breath.
- Approved claims, use these and only these: "up to 2.5x more coverage"*
  (*Surface area comparison to 2025 Tesla Model Y OEM floor mats);
  "developed using 3D laser scanning"; "TriForce™ multi-layer
  construction"; "rated 4.8★"** (**Based on 4,500+ Google Ratings);
  "Limited Lifetime Warranty" (exact phrase); "Designed to elevate."
  The mats are water-resistant, never "waterproof." Do not invent
  other claims, statistics, awards, or customer reviews.

PAGE GOAL
This is a conversion page, not a brochure. The primary CTA is the
vehicle selector (year/make/model) in the hero, with a path back to it
at every scroll depth. CTA label: "Shop Your Vehicle."

STRUCTURE (suggested, refine if you have a better narrative)
1. Hero: full-bleed visual, headline of 8 words or fewer, one proof
   line, vehicle selector.
2. The problem: what conventional mats leave exposed.
3. Coverage: the 2.5x story.*
4. Engineering: 3D laser scanning, TriForce™ construction.
5. Design: interior harmony, two-tone detail, macro close-ups.
6. Proof: 4.8★,** Limited Lifetime Warranty.
7. Close: selector again, signed off "Nothing Overlooked. Because You
   Notice."

MOTION AND TECH
- GSAP with ScrollTrigger for scroll choreography: reveals, parallax,
  pinned sequences. Subtle and physical, never gimmicky.
- Three.js only if it genuinely serves the product story, such as a
  lighting pass or depth in the hero. If an image or video tells the
  story better, skip it. No decorative spinning 3D objects.
- No scroll-jacking. Honor prefers-reduced-motion with a complete
  static fallback. Animate transform and opacity only; hold 60fps on
  mid-range mobile.
- Semantic HTML throughout: one h1, logical h2/h3, alt text on every
  image slot, meta title and description. Visual page, real SEO bones.

ASSETS
No real product photography is available to you. Build every image and
video slot as a clearly labeled placeholder wired to a single ASSETS
config object at the top of the file, so finals drop in without touching
layout. Art-direct the placeholders with CSS gradients and lighting. Do
not hotlink images from tuxmat.ca or stock sites.

BUILD AND VERIFY
- Create the project in a new folder: vanilla HTML/CSS/JS, GSAP via CDN,
  no framework.
- Run it on a local server and verify before declaring done: screenshot
  at 1440px and 390px, fix all console errors, test with
  prefers-reduced-motion enabled, confirm zero horizontal overflow on
  mobile, and keep LCP under 2.5s and CLS under 0.1.
- Finish by showing me screenshots of both viewports.

---

For the Three.js variant in this kit, the same prompt was run with one
change: "create an alternate version with Three.js included this time."
