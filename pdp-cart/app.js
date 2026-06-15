/* ============================================================
   ASSETS — single source of truth for every media slot on the
   page. Drop final files into ./assets and set the path here.
   Slots accept stills (.jpg .png .webp .avif) or muted looping
   video (.mp4 .webm, keep loops under 4MB). Layout never moves.
   ============================================================ */
const ASSETS = {
  pdpHero: 'assets/pdp-hero.jpg',            // BMW interior, mats installed
  bleedDesign: 'assets/bleed-design.mp4',    // Porsche cinematic interior loop
  bleedEngineering: 'assets/bleed-engineering.jpg', // 3D laser scan
};

/* Sample data for the prototype. Production should source pricing and
   fitment from the live Shopify catalog and hand the cart to the real
   checkout. No payment is processed anywhere in this demo. */
const TIERS = {
  front: { label: 'Front Row', price: 189.99 },
  full: { label: 'Front + Second Row', price: 279.99 },
  fullst: { label: 'Full Set + SuperTrunk™', price: 329.99 },
};

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

const state = {
  vehicle: { year: '', make: '', model: '' },
  coverage: 'full',
  color: 'Black',
  cart: [],
};

const fmt = (n) => `$${n.toFixed(2)}`;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- media slot hydration ---------- */

function hydrateAssets() {
  $$('[data-asset]').forEach((slot) => {
    const src = ASSETS[slot.dataset.asset];
    if (!src) return;
    const alt = slot.getAttribute('aria-label') || '';
    let el;
    if (/\.(mp4|webm)$/i.test(src)) {
      el = document.createElement('video');
      el.src = src; el.muted = true; el.loop = true;
      el.autoplay = true; el.playsInline = true;
      el.setAttribute('aria-label', alt);
    } else {
      el = document.createElement('img');
      el.src = src; el.alt = alt; el.loading = 'lazy'; el.decoding = 'async';
    }
    const tag = slot.querySelector('.slot-tag');
    if (tag) tag.remove();
    slot.prepend(el);
  });
}

/* ---------- configurator ---------- */

const config = $('form.config');
const configBtn = $('[data-config-atc]');

function vehicleComplete() {
  const v = state.vehicle;
  return Boolean(v.year && v.make && v.model);
}

function vehicleLabel() {
  const v = state.vehicle;
  return vehicleComplete() ? `${v.year} ${v.make} ${v.model}` : '';
}

function syncUI() {
  const tier = TIERS[state.coverage];
  $$('[data-price]').forEach((el) => { el.textContent = fmt(tier.price); });

  const ready = vehicleComplete();
  configBtn.disabled = !ready;
  configBtn.textContent = ready
    ? `Add to Cart · ${fmt(tier.price)}`
    : 'Select your vehicle';

  $('[data-summary]').textContent = ready
    ? `${vehicleLabel()} · ${tier.label} · ${state.color}`
    : 'Select your vehicle';

  const count = state.cart.reduce((n, item) => n + item.qty, 0);
  const badge = $('.cart-badge');
  badge.hidden = count === 0;
  badge.textContent = count;
}

function setupConfigurator() {
  const year = $('select[name="year"]', config);
  const make = $('select[name="make"]', config);
  const model = $('select[name="model"]', config);

  VEHICLES.years.forEach((y) => year.add(new Option(y, y)));
  Object.keys(VEHICLES.makes).forEach((m) => make.add(new Option(m, m)));

  year.addEventListener('change', () => { state.vehicle.year = year.value; syncUI(); });
  make.addEventListener('change', () => {
    state.vehicle.make = make.value;
    state.vehicle.model = '';
    model.length = 1;
    model.selectedIndex = 0;
    (VEHICLES.makes[make.value] || []).forEach((m) => model.add(new Option(m, m)));
    model.disabled = false;
    syncUI();
  });
  model.addEventListener('change', () => { state.vehicle.model = model.value; syncUI(); });

  $$('input[name="coverage"]', config).forEach((r) =>
    r.addEventListener('change', () => { state.coverage = r.value; syncUI(); })
  );
  $$('input[name="color"]', config).forEach((r) =>
    r.addEventListener('change', () => { state.color = r.value; syncUI(); })
  );

  config.addEventListener('submit', (e) => { e.preventDefault(); addToCart(); });

  /* coverage guide "Select" buttons set the tier and return to the configurator */
  $$('[data-tier]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.coverage = btn.dataset.tier;
      $(`input[name="coverage"][value="${state.coverage}"]`, config).checked = true;
      syncUI();
      scrollToConfig();
    })
  );
}

function scrollToConfig() {
  config.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => $('select[name="year"]', config).focus({ preventScroll: true }), 450);
}

/* ---------- cart ---------- */

function addToCart() {
  if (!vehicleComplete()) { scrollToConfig(); return; }
  const tier = TIERS[state.coverage];
  const key = `${vehicleLabel()}|${state.coverage}|${state.color}`;
  const existing = state.cart.find((i) => i.key === key);
  if (existing) existing.qty += 1;
  else state.cart.push({
    key,
    vehicle: vehicleLabel(),
    coverage: state.coverage,
    color: state.color,
    price: tier.price,
    qty: 1,
  });
  syncUI();
  renderCart();
  openDrawer('cart');
}

function subtotal() {
  return state.cart.reduce((n, i) => n + i.price * i.qty, 0);
}

function renderCart() {
  const list = $('.cart-items');
  list.innerHTML = '';
  state.cart.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">Custom-Fit Floor Mats</span>
        <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
      </div>
      <span class="cart-item-detail">${item.vehicle}</span>
      <span class="cart-item-detail">${TIERS[item.coverage].label} · ${item.color}</span>
      <div class="cart-item-row">
        <span class="qty">
          <button type="button" data-dec aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-inc aria-label="Increase quantity">+</button>
        </span>
        <button class="cart-remove" type="button" data-remove>Remove</button>
      </div>`;
    li.querySelector('[data-inc]').addEventListener('click', () => { item.qty += 1; renderCart(); syncUI(); });
    li.querySelector('[data-dec]').addEventListener('click', () => {
      item.qty -= 1;
      if (item.qty <= 0) state.cart = state.cart.filter((i) => i !== item);
      renderCart(); syncUI();
    });
    li.querySelector('[data-remove]').addEventListener('click', () => {
      state.cart = state.cart.filter((i) => i !== item);
      renderCart(); syncUI();
    });
    list.appendChild(li);
  });

  $('.cart-empty').style.display = state.cart.length ? 'none' : 'block';
  $('[data-subtotal]').textContent = fmt(subtotal());
  $('[data-checkout]').disabled = state.cart.length === 0;
  $$('[data-express]').forEach((b) => { b.disabled = state.cart.length === 0; });
  $('[data-pay]').textContent = `Pay ${fmt(subtotal())}`;
}

/* ---------- drawer (cart → one-step checkout → success) ---------- */

const drawer = $('.drawer');
const overlay = $('.drawer-overlay');
let lastFocus = null;

function showPanel(name) {
  $$('.drawer-panel').forEach((p) => { p.hidden = p.dataset.panel !== name; });
  $('[data-drawer-title]').textContent =
    name === 'checkout' ? 'Checkout' : name === 'success' ? 'Thank you' : 'Cart';
}

function openDrawer(panel = 'cart') {
  lastFocus = document.activeElement;
  drawer.hidden = false;
  overlay.hidden = false;
  showPanel(panel);
  updateFloatingUI();
  $('.drawer-close').focus();
  document.addEventListener('keydown', onDrawerKeydown);
}

function closeDrawer() {
  drawer.hidden = true;
  overlay.hidden = true;
  updateFloatingUI();
  document.removeEventListener('keydown', onDrawerKeydown);
  if (lastFocus) lastFocus.focus();
}

function onDrawerKeydown(e) {
  if (e.key === 'Escape') closeDrawer();
}

function setupDrawer() {
  $('.cart-btn').addEventListener('click', () => { renderCart(); openDrawer('cart'); });
  $('.drawer-close').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  $('[data-checkout]').addEventListener('click', () => showPanel('checkout'));
  $$('[data-express]').forEach((b) =>
    b.addEventListener('click', () => showPanel('checkout'))
  );

  $('.checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.cart = [];
    renderCart();
    syncUI();
    showPanel('success');
  });

  $('[data-continue]').addEventListener('click', closeDrawer);
}

/* ---------- floating bar + local nav visibility ---------- */

function updateFloatingUI() {
  const rect = config.getBoundingClientRect();
  const configOutOfView = rect.bottom < 90 || rect.top > window.innerHeight;
  $('.atc-bar').hidden = !configOutOfView || !drawer.hidden;
  $('.localnav').classList.toggle('is-visible', configOutOfView);
}

function setupFloatingUI() {
  window.addEventListener('scroll', updateFloatingUI, { passive: true });
  window.addEventListener('resize', updateFloatingUI);
  updateFloatingUI();
  $$('[data-atc]').forEach((btn) => btn.addEventListener('click', addToCart));
}

/* ---------- motion ----------
   Additive only. The page is complete and fully visible with no JS and
   with prefers-reduced-motion: reduce. Append ?static to force the
   fallback for testing. */

function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power3.out';

  gsap.from('.nav', { y: -14, opacity: 0, duration: 0.8, ease, delay: 0.1 });
  gsap.from('.anim-hero', { y: 28, opacity: 0, duration: 1, ease, stagger: 0.1, delay: 0.2 });

  $$('.section, .bleed').forEach((section) => {
    const items = $$('.anim', section);
    if (!items.length) return;
    gsap.from(items, {
      y: 26, opacity: 0, duration: 0.9, ease, stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 74%' },
    });
  });

  /* Apple-style expand: bleed frames scale up to full width as they enter */
  $$('.bleed-frame').forEach((frame) => {
    gsap.fromTo(frame,
      { scale: 0.94 },
      {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 35%', scrub: true },
      });
  });

  /* ambient orbs drift slower than the page */
  $$('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: -120 - i * 60, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'max', scrub: 1.5 },
    });
  });
}

/* ---------- boot ---------- */

hydrateAssets();
setupConfigurator();
setupDrawer();
setupFloatingUI();
renderCart();
syncUI();

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  initMotion();
}
