/* TuxMat: The Gold Line.
   One unbroken gold line travels the page: vertical thread connectors
   between panels, and single-stroke SVG figures inside them (contour,
   raster scan, layer loops). Everything draws on scroll when motion is
   allowed; with motion off the line renders complete. Like the dossier,
   every figure is inline SVG: zero photography dependence. */

/* Sample data for the prototype. Production should source pricing and
   fitment from the live Shopify catalog and hand the order to the real
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
  order: [],
};

const fmt = (n) => `$${n.toFixed(2)}`;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

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
  $('[data-tier-label]').textContent = tier.label;

  $$('[data-tier-card]').forEach((card) => {
    card.classList.toggle('is-active', card.dataset.tierCard === state.coverage);
  });

  const ready = vehicleComplete();
  configBtn.disabled = !ready;
  configBtn.textContent = ready
    ? `Add to Order · ${fmt(tier.price)}`
    : 'Select your vehicle';

  $('[data-summary]').textContent = ready
    ? `${vehicleLabel()} · ${tier.label} · ${state.color}`
    : 'Select your vehicle';

  const count = state.order.reduce((n, item) => n + item.qty, 0);
  const badge = $('.order-badge');
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

  $$('input[name="color"]', config).forEach((r) =>
    r.addEventListener('change', () => { state.color = r.value; syncUI(); })
  );

  config.addEventListener('submit', (e) => { e.preventDefault(); addToOrder(); });

  /* coverage cards set the tier; the order form follows */
  $$('[data-tier]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.coverage = btn.dataset.tier;
      syncUI();
      config.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
  );
}

function scrollToConfig() {
  config.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => $('select[name="year"]', config).focus({ preventScroll: true }), 450);
}

/* ---------- order ---------- */

function addToOrder() {
  if (!vehicleComplete()) { scrollToConfig(); return; }
  const tier = TIERS[state.coverage];
  const key = `${vehicleLabel()}|${state.coverage}|${state.color}`;
  const existing = state.order.find((i) => i.key === key);
  if (existing) existing.qty += 1;
  else state.order.push({
    key,
    vehicle: vehicleLabel(),
    coverage: state.coverage,
    color: state.color,
    price: tier.price,
    qty: 1,
  });
  syncUI();
  renderOrder();
  openDrawer('order');
}

function subtotal() {
  return state.order.reduce((n, i) => n + i.price * i.qty, 0);
}

function renderOrder() {
  const list = $('.order-items');
  list.innerHTML = '';
  state.order.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'order-item';
    li.innerHTML = `
      <div class="order-item-top">
        <span>Custom-Fit Floor Mats</span>
        <span class="price">${fmt(item.price * item.qty)}</span>
      </div>
      <p class="order-item-detail">${item.vehicle}<br>${TIERS[item.coverage].label} · ${item.color}</p>
      <div class="order-item-row">
        <span class="qty">
          <button type="button" data-dec aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-inc aria-label="Increase quantity">+</button>
        </span>
        <button class="order-remove" type="button" data-remove>Remove</button>
      </div>`;
    li.querySelector('[data-inc]').addEventListener('click', () => { item.qty += 1; renderOrder(); syncUI(); });
    li.querySelector('[data-dec]').addEventListener('click', () => {
      item.qty -= 1;
      if (item.qty <= 0) state.order = state.order.filter((i) => i !== item);
      renderOrder(); syncUI();
    });
    li.querySelector('[data-remove]').addEventListener('click', () => {
      state.order = state.order.filter((i) => i !== item);
      renderOrder(); syncUI();
    });
    list.appendChild(li);
  });

  $('.order-empty').style.display = state.order.length ? 'none' : 'block';
  $('[data-subtotal]').textContent = fmt(subtotal());
  $('[data-checkout]').disabled = state.order.length === 0;
  $('[data-pay]').textContent = `Pay ${fmt(subtotal())}`;
}

/* ---------- drawer (order → checkout → success) ---------- */

const drawer = $('.drawer');
const overlay = $('.drawer-overlay');
let lastFocus = null;

function showPanel(name) {
  $$('.drawer-panel').forEach((p) => { p.hidden = p.dataset.panel !== name; });
  $('[data-drawer-title]').textContent =
    name === 'checkout' ? 'Checkout' : name === 'success' ? 'Confirmed' : 'Order';
}

function openDrawer(panel = 'order') {
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
  $('.order-btn').addEventListener('click', () => { renderOrder(); openDrawer('order'); });
  $('.drawer-close').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  $('[data-checkout]').addEventListener('click', () => showPanel('checkout'));

  $('.checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.order = [];
    renderOrder();
    syncUI();
    showPanel('success');
    drawSuccessCheck();
  });

  $('[data-continue]').addEventListener('click', closeDrawer);
}

function drawSuccessCheck() {
  if (reducedMotion || !window.gsap) return;
  const path = $('.success-check .threadpath');
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  gsap.to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', delay: 0.15 });
}

/* ---------- floating gold strip ---------- */

function updateFloatingUI() {
  const rect = config.getBoundingClientRect();
  const configOutOfView = rect.bottom < 90 || rect.top > window.innerHeight;
  $('.goldbar').hidden = !configOutOfView || !drawer.hidden;
}

function setupFloatingUI() {
  window.addEventListener('scroll', updateFloatingUI, { passive: true });
  window.addEventListener('resize', updateFloatingUI);
  updateFloatingUI();
  $$('[data-atc]').forEach((btn) => btn.addEventListener('click', addToOrder));
}

/* ---------- motion ----------
   Additive only. The line renders complete and every element is
   visible with no JS and with prefers-reduced-motion: reduce.
   Append ?static to force the fallback for testing. */

function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power3.out';

  gsap.from('.nav', { y: -14, opacity: 0, duration: 0.8, ease, delay: 0.1 });
  gsap.from('.anim-hero', { y: 28, opacity: 0, duration: 1, ease, stagger: 0.12, delay: 0.2 });

  /* the hero thread drops in after the headline */
  gsap.from('.thread-hero', {
    scaleY: 0, transformOrigin: 'top center', duration: 1.1, ease: 'power2.inOut', delay: 1,
  });

  $$('.panel').forEach((panel) => {
    const items = $$('.anim', panel);
    if (!items.length) return;
    gsap.from(items, {
      y: 26, opacity: 0, duration: 0.9, ease, stagger: 0.1,
      scrollTrigger: { trigger: panel, start: 'top 74%' },
    });
  });

  /* thread connectors grow downward as they enter */
  $$('.thread-enter').forEach((thread) => {
    gsap.from(thread, {
      scaleY: 0, transformOrigin: 'top center', ease: 'none',
      scrollTrigger: { trigger: thread, start: 'top 92%', end: 'top 55%', scrub: true },
    });
  });

  /* the signature move: each line segment draws itself */
  $$('svg [data-draw]').forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    gsap.to(path, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: {
        trigger: path.closest('figure'),
        start: 'top 90%', end: 'bottom 45%', scrub: true,
      },
    });
  });

  /* annotations surface after their segment */
  $$('figure.threadfig').forEach((fig) => {
    gsap.from($$('.svg-label', fig), {
      opacity: 0, duration: 0.6, ease, stagger: 0.1,
      scrollTrigger: { trigger: fig, start: 'top 40%' },
    });
  });

  /* proof figures count up */
  $$('.count').forEach((el) => {
    const to = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const counter = { value: 0 };
    gsap.to(counter, {
      value: to, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
      onUpdate: () => { el.textContent = counter.value.toFixed(decimals); },
    });
  });
}

/* ---------- boot ---------- */

setupConfigurator();
setupDrawer();
setupFloatingUI();
renderOrder();
syncUI();

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  initMotion();
}
