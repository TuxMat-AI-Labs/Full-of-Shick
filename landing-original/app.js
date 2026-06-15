/* ============================================================
   ASSETS — single source of truth for every media slot on the
   page. Drop final files into ./assets and set the path here.
   Slots accept stills (.jpg .png .webp .avif) or muted looping
   video (.mp4 .webm, keep loops under 4MB). Layout never moves.
   ============================================================ */
const ASSETS = {
  heroLoop: 'assets/hero-loop.mp4',          // cinematic reveal loop
  problemCompare: 'assets/problem-compare.jpg', // wide interior, full coverage
  coverageMap: 'assets/coverage-map.jpg',    // 3D laser scan
  macroEdge: 'assets/macro-edge.jpg',        // heel pad / edge detail
  macroSurface: 'assets/macro-surface.jpg',  // two-tone surface texture
  macroLight: 'assets/macro-light.jpg',      // water-beaded surface under light
};

/* Sample fitment data for the prototype. Production should source
   this from the live Shopify catalog and deep-link the CTA to the
   matching fitment page. */
const VEHICLES = {
  years: (() => { const y = []; for (let i = 2026; i >= 2016; i--) y.push(i); return y; })(),
  makes: {
    Audi: ['A4', 'Q5', 'Q7'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5'],
    Ford: ['Escape', 'Explorer', 'F-150'],
    Honda: ['Accord', 'Civic', 'CR-V', 'Pilot'],
    Lexus: ['ES', 'NX', 'RX'],
    Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
    Toyota: ['Camry', 'Corolla', 'Highlander', 'RAV4'],
  },
};

/* ---------- media slot hydration ---------- */

function hydrateAssets() {
  document.querySelectorAll('[data-asset]').forEach((slot) => {
    const src = ASSETS[slot.dataset.asset];
    if (!src) return;
    const alt = slot.getAttribute('aria-label') || '';
    let el;
    if (/\.(mp4|webm)$/i.test(src)) {
      el = document.createElement('video');
      el.src = src;
      el.muted = true;
      el.loop = true;
      el.autoplay = true;
      el.playsInline = true;
      el.setAttribute('aria-label', alt);
    } else {
      el = document.createElement('img');
      el.src = src;
      el.alt = alt;
      el.loading = 'lazy';
      el.decoding = 'async';
    }
    const tag = slot.querySelector('.slot-tag');
    if (tag) tag.remove();
    slot.prepend(el);
  });
}

/* ---------- vehicle selector ---------- */

function setupSelectors() {
  document.querySelectorAll('form.selector').forEach((form) => {
    const year = form.querySelector('select[name="year"]');
    const make = form.querySelector('select[name="make"]');
    const model = form.querySelector('select[name="model"]');
    const btn = form.querySelector('button');

    VEHICLES.years.forEach((y) => year.add(new Option(y, y)));
    Object.keys(VEHICLES.makes).forEach((m) => make.add(new Option(m, m)));

    const update = () => {
      btn.disabled = !(year.value && make.value && model.value);
    };

    make.addEventListener('change', () => {
      model.length = 1;
      model.selectedIndex = 0;
      (VEHICLES.makes[make.value] || []).forEach((m) => model.add(new Option(m, m)));
      model.disabled = false;
      update();
    });
    year.addEventListener('change', update);
    model.addEventListener('change', update);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) return;
      window.location.href = 'https://www.tuxmat.ca/';
    });
  });
}

/* ---------- motion ----------
   Everything below is additive. The page is complete and fully
   visible with no JS and with prefers-reduced-motion: reduce.
   Append ?static to the URL to force the fallback for testing. */

function initMotion() {
  gsap.registerPlugin(ScrollTrigger);

  const ease = 'power3.out';

  gsap.from('.nav', { y: -14, opacity: 0, duration: 0.8, ease, delay: 0.1 });
  gsap.from('.anim-hero', {
    y: 28,
    opacity: 0,
    duration: 1,
    ease,
    stagger: 0.12,
    delay: 0.2,
  });

  gsap.to('.hero-media', {
    yPercent: 9,
    scale: 1.05,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  document.querySelectorAll('.section').forEach((section) => {
    const items = section.querySelectorAll('.anim');
    if (!items.length) return;
    gsap.from(items, {
      y: 26,
      opacity: 0,
      duration: 0.9,
      ease,
      stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 74%' },
    });
  });

  document.querySelectorAll('.section .media-slot').forEach((slot, i) => {
    gsap.fromTo(
      slot,
      { y: 26 + (i % 3) * 8 },
      {
        y: -(26 + (i % 3) * 8),
        ease: 'none',
        scrollTrigger: { trigger: slot, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.triforce-wrap', start: 'top 70%', end: 'center center', scrub: 1 },
  });
  tl.from('.layer-1', { y: -130, opacity: 0 }, 0)
    .from('.layer-3', { y: 130, opacity: 0 }, 0)
    .from('.layer-2', { opacity: 0, scale: 0.94 }, 0);
}

/* ---------- boot ---------- */

hydrateAssets();
setupSelectors();

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  initMotion();
}
