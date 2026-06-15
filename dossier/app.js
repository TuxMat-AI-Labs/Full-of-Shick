/* TuxMat engineering dossier.
   No raster media anywhere: every figure is inline SVG line art, so
   this concept ships with zero photography dependence. Drawings render
   fully drawn by default; scroll choreography redraws them stroke by
   stroke only when motion is allowed. */

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
  woCounter: 0,
};

const fmt = (n) => `$${n.toFixed(2)}`;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- work order (configurator) ---------- */

const workorder = $('form.workorder');
const woBtn = $('[data-wo-submit]');

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
  woBtn.disabled = !ready;
  woBtn.textContent = ready ? `Add to Order · ${fmt(tier.price)}` : 'Enter your vehicle above';

  $('[data-wo-no]').textContent = ready
    ? `NO. TM-${state.vehicle.year}-${String(state.woCounter + 1).padStart(3, '0')}`
    : 'NO. PENDING';

  $('[data-summary]').textContent = ready
    ? `${vehicleLabel()} · ${tier.label} · ${state.color}`.toUpperCase()
    : 'ENTER YOUR VEHICLE';

  const count = state.order.reduce((n, item) => n + item.qty, 0);
  const badge = $('.ticket-badge');
  badge.hidden = count === 0;
  badge.textContent = count;
}

function setupWorkorder() {
  const year = $('select[name="year"]', workorder);
  const make = $('select[name="make"]', workorder);
  const model = $('select[name="model"]', workorder);

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

  $$('input[name="coverage"]', workorder).forEach((r) =>
    r.addEventListener('change', () => { state.coverage = r.value; syncUI(); })
  );
  $$('input[name="color"]', workorder).forEach((r) =>
    r.addEventListener('change', () => { state.color = r.value; syncUI(); })
  );

  workorder.addEventListener('submit', (e) => { e.preventDefault(); addToOrder(); });
}

function scrollToWorkorder() {
  workorder.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => $('select[name="year"]', workorder).focus({ preventScroll: true }), 450);
}

/* ---------- order ticket ---------- */

function addToOrder() {
  if (!vehicleComplete()) { scrollToWorkorder(); return; }
  const tier = TIERS[state.coverage];
  const key = `${vehicleLabel()}|${state.coverage}|${state.color}`;
  const existing = state.order.find((i) => i.key === key);
  if (existing) existing.qty += 1;
  else {
    state.woCounter += 1;
    state.order.push({
      key,
      no: `TM-${state.vehicle.year}-${String(state.woCounter).padStart(3, '0')}`,
      vehicle: vehicleLabel(),
      coverage: state.coverage,
      color: state.color,
      price: tier.price,
      qty: 1,
    });
  }
  syncUI();
  renderTicket();
  openTicket('order');
}

function subtotal() {
  return state.order.reduce((n, i) => n + i.price * i.qty, 0);
}

function renderTicket() {
  const list = $('.ticket-items');
  list.innerHTML = '';
  state.order.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'ticket-item';
    li.innerHTML = `
      <div class="ticket-item-top">
        <span>${item.no}</span>
        <span>${fmt(item.price * item.qty)}</span>
      </div>
      <p class="ticket-item-detail">CUSTOM-FIT FLOOR MATS<br>${item.vehicle.toUpperCase()}<br>${TIERS[item.coverage].label.toUpperCase()} · ${item.color.toUpperCase()}</p>
      <div class="ticket-item-row">
        <span class="qty">
          <button type="button" data-dec aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-inc aria-label="Increase quantity">+</button>
        </span>
        <button class="ticket-remove" type="button" data-remove>Strike line</button>
      </div>`;
    li.querySelector('[data-inc]').addEventListener('click', () => { item.qty += 1; renderTicket(); syncUI(); });
    li.querySelector('[data-dec]').addEventListener('click', () => {
      item.qty -= 1;
      if (item.qty <= 0) state.order = state.order.filter((i) => i !== item);
      renderTicket(); syncUI();
    });
    li.querySelector('[data-remove]').addEventListener('click', () => {
      state.order = state.order.filter((i) => i !== item);
      renderTicket(); syncUI();
    });
    list.appendChild(li);
  });

  $('.ticket-empty').style.display = state.order.length ? 'none' : 'block';
  $('[data-subtotal]').textContent = fmt(subtotal());
  $('[data-checkout]').disabled = state.order.length === 0;
  $('[data-pay]').textContent = `Pay ${fmt(subtotal())}`;
}

/* ---------- ticket drawer (order → checkout → success) ---------- */

const ticket = $('.ticket');
const overlay = $('.ticket-overlay');
let lastFocus = null;

function showPanel(name) {
  $$('.ticket-panel').forEach((p) => { p.hidden = p.dataset.panel !== name; });
  $('[data-ticket-title]').textContent =
    name === 'checkout' ? 'CHECKOUT' : name === 'success' ? 'FILED' : 'ORDER TICKET';
}

function openTicket(panel = 'order') {
  lastFocus = document.activeElement;
  ticket.hidden = false;
  overlay.hidden = false;
  showPanel(panel);
  updateFloatingUI();
  $('.ticket-close').focus();
  document.addEventListener('keydown', onTicketKeydown);
}

function closeTicket() {
  ticket.hidden = true;
  overlay.hidden = true;
  updateFloatingUI();
  document.removeEventListener('keydown', onTicketKeydown);
  if (lastFocus) lastFocus.focus();
}

function onTicketKeydown(e) {
  if (e.key === 'Escape') closeTicket();
}

function setupTicket() {
  $('.ticket-btn').addEventListener('click', () => { renderTicket(); openTicket('order'); });
  $('.ticket-close').addEventListener('click', closeTicket);
  overlay.addEventListener('click', closeTicket);

  $('[data-checkout]').addEventListener('click', () => showPanel('checkout'));

  $('.checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.order = [];
    renderTicket();
    syncUI();
    showPanel('success');
  });

  $('[data-continue]').addEventListener('click', closeTicket);
}

/* ---------- floating order strip ---------- */

function updateFloatingUI() {
  const rect = workorder.getBoundingClientRect();
  const woOutOfView = rect.bottom < 90 || rect.top > window.innerHeight;
  $('.stampbar').hidden = !woOutOfView || !ticket.hidden;
}

function setupFloatingUI() {
  window.addEventListener('scroll', updateFloatingUI, { passive: true });
  window.addEventListener('resize', updateFloatingUI);
  updateFloatingUI();
  $$('[data-atc]').forEach((btn) => btn.addEventListener('click', addToOrder));
}

/* ---------- motion ----------
   Additive only. Drawings are fully drawn and every element visible
   with no JS and with prefers-reduced-motion: reduce. Append ?static
   to force the fallback for testing. */

function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power3.out';

  gsap.from('.nav', { y: -14, opacity: 0, duration: 0.8, ease, delay: 0.1 });
  gsap.from('.anim-hero', { y: 26, opacity: 0, duration: 1, ease, delay: 0.2 });

  $$('.sheet').forEach((sheet) => {
    const items = $$('.anim', sheet);
    if (!items.length) return;
    gsap.from(items, {
      y: 24, opacity: 0, duration: 0.9, ease, stagger: 0.1,
      scrollTrigger: { trigger: sheet, start: 'top 74%' },
    });
  });

  /* the signature move: every drawing draws itself as it enters */
  $$('svg [data-draw]').forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    gsap.to(path, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: {
        trigger: path.closest('figure'),
        start: 'top 88%', end: 'top 30%', scrub: true,
      },
    });
  });

  /* annotations surface after their drawing */
  $$('figure.drawing').forEach((fig) => {
    gsap.from($$('.svg-label, .figcap', fig), {
      opacity: 0, duration: 0.6, ease, stagger: 0.08,
      scrollTrigger: { trigger: fig, start: 'top 45%' },
    });
  });

  /* the scan line sweeps the contour survey */
  const scan = $('.scanline');
  if (scan) {
    gsap.fromTo(scan, { x: -330 }, {
      x: 230, ease: 'none',
      scrollTrigger: { trigger: '#s3 figure', start: 'top 80%', end: 'bottom 35%', scrub: true },
    });
  }

  /* the closing stamp presses in */
  gsap.from('.stamp', {
    scale: 1.6, opacity: 0, rotation: 4, duration: 0.5, ease: 'power4.in',
    scrollTrigger: { trigger: '.closing', start: 'top 80%' },
  });
}

/* ---------- boot ---------- */

setupWorkorder();
setupTicket();
setupFloatingUI();
renderTicket();
syncUI();

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('static');

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  initMotion();
}
