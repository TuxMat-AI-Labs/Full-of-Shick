/* TuxMat — iyO Edition.
   Faithful to iyo.ai's behavior: Lenis smooth scroll, a dot-grid menu
   that drops a full-screen product card menu, a slide-out cart with
   quantity steppers, discount code, cart note, subtotal and a one-step
   demo checkout, plus Taxi-like page-transition veils. Vehicle data,
   pricing and checkout are samples; no payment is processed. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const CART_KEY = 'tuxmat-iyo-cart';
const fmt = n => `$${n.toFixed(2)}`;

const VEHICLES = {
  years: (() => { const y = []; for (let i = 2026; i >= 2016; i--) y.push(i); return y; })(),
  makes: {
    Audi: ['A3', 'A4', 'Q5', 'Q7'], BMW: ['3 Series', '5 Series', 'X3', 'X5'],
    Ford: ['Escape', 'Explorer', 'F-150'], Honda: ['Accord', 'Civic', 'CR-V', 'Pilot'],
    Lexus: ['ES', 'NX', 'RX'], Nissan: ['Kicks', 'Rogue', 'Sentra'],
    Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'], Toyota: ['Camry', 'Corolla', 'Highlander', 'RAV4']
  }
};
const COV = { front: { label: 'Front row', price: 189 }, full: { label: 'Front + rear', price: 276.80 }, fullst: { label: 'Full set + trunk', price: 329 } };

/* ---------- media hydration ---------- */
function hydrateImages(root = document) {
  $$('[data-img]', root).forEach(el => {
    if (el.dataset.h) return; el.dataset.h = '1';
    const probe = new Image();
    probe.onload = () => { el.style.backgroundImage = `url("assets/${el.dataset.img}")`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; };
    probe.src = `assets/${el.dataset.img}`;
  });
}
function setBg(el, name) { el.style.backgroundImage = `url("assets/${name}")`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }

/* ---------- Lenis smooth scroll ---------- */
function setupLenis() {
  if (typeof Lenis === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  window.__lenis = lenis;
}

/* ---------- page-transition veil (taxi-like) ---------- */
function setupTransitions() {
  const veil = $('[data-veil]'); if (!veil) return;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || a.target === '_blank') return;
    if (!/\.html(\?|$)/.test(href) && href !== 'index.html') return;
    e.preventDefault();
    veil.classList.add('show');
    setTimeout(() => { window.location.href = href; }, 360);
  });
  window.addEventListener('pageshow', () => veil.classList.remove('show'));
}

/* ---------- vehicle selector ---------- */
function fillSelector(form) {
  const y = $('select[name=year]', form), m = $('select[name=make]', form), mo = $('select[name=model]', form);
  if (!y) return null;
  if (!y.options.length || y.options[0].disabled) VEHICLES.years.forEach(v => y.add(new Option(v, v)));
  if (m.options.length <= 1) Object.keys(VEHICLES.makes).forEach(v => m.add(new Option(v, v)));
  const state = { year: '', make: '', model: '' };
  m.addEventListener('change', () => {
    state.make = m.value; mo.length = 0;
    mo.add(new Option('Model', '', true, true)); mo.options[0].disabled = true;
    (VEHICLES.makes[m.value] || []).forEach(v => mo.add(new Option(v, v)));
    mo.disabled = false; state.model = '';
    form.dispatchEvent(new CustomEvent('vchange', { detail: state }));
  });
  y.addEventListener('change', () => { state.year = y.value; form.dispatchEvent(new CustomEvent('vchange', { detail: state })); });
  mo.addEventListener('change', () => { state.model = mo.value; form.dispatchEvent(new CustomEvent('vchange', { detail: state })); });
  return { state, complete: () => state.year && state.make && state.model, label: () => `${state.year} ${state.make} ${state.model}` };
}

/* ---------- cart (localStorage) ---------- */
const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } };
const writeCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));
function addItem(line) { const c = readCart(); const e = c.find(i => i.key === line.key); if (e) e.qty += line.qty; else c.push(line); writeCart(c); renderCount(); renderCart(); }
function setQty(idx, d) { const c = readCart(); if (!c[idx]) return; c[idx].qty = Math.max(1, c[idx].qty + d); writeCart(c); renderCount(); renderCart(); }
function removeItem(idx) { const c = readCart(); c.splice(idx, 1); writeCart(c); renderCount(); renderCart(); }
function renderCount() { const n = readCart().reduce((a, i) => a + i.qty, 0); $$('[data-cart-count]').forEach(b => { b.hidden = n === 0; b.textContent = n; }); }

/* ---------- overlays: scrim, card menu, slide cart ---------- */
const scrim = () => $('[data-scrim]');
const menuEl = () => $('[data-menu]');
const cartEl = () => $('[data-cart]');
let cartView = 'cart';

function openMenu() { closeCart(); menuEl().classList.add('open'); scrim().classList.add('open'); document.body.style.overflow = 'hidden'; const t = $('[data-menu-toggle]'); t && t.setAttribute('aria-expanded', 'true'); }
function closeMenu() { menuEl()?.classList.remove('open'); if (!cartEl()?.classList.contains('open')) { scrim().classList.remove('open'); document.body.style.overflow = ''; } const t = $('[data-menu-toggle]'); t && t.setAttribute('aria-expanded', 'false'); }
function toggleMenu() { menuEl()?.classList.contains('open') ? closeMenu() : openMenu(); }

function openCart() { closeMenu(); cartView = 'cart'; renderCart(); cartEl().classList.add('open'); scrim().classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { cartEl()?.classList.remove('open'); if (!menuEl()?.classList.contains('open')) { scrim().classList.remove('open'); document.body.style.overflow = ''; } }
function closeAll() { closeMenu(); closeCart(); }

function renderCart() {
  const el = cartEl(); if (!el) return;
  const c = readCart();
  const sub = c.reduce((a, i) => a + i.price * i.qty, 0);

  if (cartView === 'checkout') {
    el.innerHTML = `<div class="cart-head"><h2>Checkout</h2><button class="x-btn" type="button" data-cart-close aria-label="Close">&#10005;</button></div>
      <div class="cart-body"><form class="checkout-form" data-checkout-form>
        <p class="field-label" style="margin-top:0">One step &middot; contact, shipping, payment</p>
        <input name="email" placeholder="Email" required><input name="name" placeholder="Full name" required>
        <input name="address" placeholder="Address" required><input name="card" placeholder="Card number" inputmode="numeric" required>
        <button class="checkout-btn" type="submit" style="margin-top:6px">Pay ${fmt(sub)}</button>
        <p class="demo">Demo &middot; no payment is processed</p></form></div>`;
    wireCartButtons();
    el.querySelector('[data-checkout-form]').addEventListener('submit', e => { e.preventDefault(); writeCart([]); renderCount(); cartView = 'success'; renderCart(); });
    return;
  }
  if (cartView === 'success') {
    el.innerHTML = `<div class="cart-head"><h2>Order placed</h2><button class="x-btn" type="button" data-cart-close aria-label="Close">&#10005;</button></div>
      <div class="cart-body success"><div class="seal">&#10003;</div><h3 style="font-size:1.1rem;font-weight:600">Thank you.</h3>
      <p class="cart-note-txt" style="margin-top:8px">Your set is cut from the scan of your exact vehicle.</p>
      <button class="btn btn-ghost btn-block" type="button" data-cart-close style="margin-top:18px">Continue</button>
      <p class="demo">Demo &middot; no payment processed</p></div>`;
    wireCartButtons();
    return;
  }

  const items = c.map((it, idx) => `
    <div class="citem">
      <div class="ci-img" style="background-image:url('assets/${it.img}')"></div>
      <div style="flex:1">
        <div class="ci-nm">${it.name}</div><div class="ci-mt">${it.detail}</div>
        <div class="ci-row">
          <div class="qty"><button type="button" data-dec="${idx}" aria-label="Decrease">&minus;</button><span>${it.qty}</span><button type="button" data-inc="${idx}" aria-label="Increase">+</button></div>
          <div class="ci-price">${fmt(it.price * it.qty)}</div>
        </div>
        <button class="ci-rm" type="button" data-rm="${idx}">Remove</button>
      </div>
    </div>`).join('');

  el.innerHTML = `<div class="cart-head"><h2>Your cart</h2><button class="x-btn" type="button" data-cart-close aria-label="Close">&#10005;</button></div>
    <div class="cart-body">${c.length ? items : '<p class="cart-empty">You have nothing in your shopping cart.</p>'}</div>
    <div class="cart-foot">
      <div class="disc"><input type="text" placeholder="Enter coupon" data-disc><button type="button" data-disc-add>Add</button></div>
      <textarea class="note-input" placeholder="Type your order note" data-note></textarea>
      <div class="cart-sub"><span>Subtotal</span><span>${fmt(sub)}</span></div>
      <p class="cart-note-txt">Shipping and taxes calculated at checkout.</p>
      <button class="checkout-btn" type="button" data-checkout ${c.length ? '' : 'style="opacity:.35;pointer-events:none"'}>Checkout</button>
      <p class="demo">Pay in 4 with Shop Pay &middot; demo</p>
    </div>`;
  wireCartButtons();
  c.forEach((_, idx) => {
    el.querySelector(`[data-inc="${idx}"]`).addEventListener('click', () => setQty(idx, 1));
    el.querySelector(`[data-dec="${idx}"]`).addEventListener('click', () => setQty(idx, -1));
    el.querySelector(`[data-rm="${idx}"]`).addEventListener('click', () => removeItem(idx));
  });
  el.querySelector('[data-checkout]')?.addEventListener('click', () => { if (readCart().length) { cartView = 'checkout'; renderCart(); } });
  el.querySelector('[data-disc-add]')?.addEventListener('click', () => { const i = el.querySelector('[data-disc]'); i.value = ''; i.placeholder = 'No valid coupon'; });
}
function wireCartButtons() { $$('[data-cart-close]', cartEl()).forEach(b => b.addEventListener('click', closeCart)); }

/* ---------- compare / reveal / carousel ---------- */
function setupCompare() { $$('[data-compare]').forEach(el => { const r = $('input[type=range]', el); if (!r) return; const set = v => el.style.setProperty('--pos', `${v}%`); set(r.value); r.addEventListener('input', () => set(r.value)); }); }
function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('.reveal, .section-head, .feat-media, .feat-copy, .review, .cslide');
  els.forEach(e => e.classList.add('reveal'));
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}
function setupCarousels() {
  $$('[data-carousel]').forEach(c => {
    const track = $('[data-carousel-track]', c);
    const step = () => Math.min(track.clientWidth * 0.85, (track.firstElementChild?.offsetWidth || 320) + 12);
    $('[data-carousel-prev]', c)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('[data-carousel-next]', c)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
}

/* ---------- PDP ---------- */
function setupPDP() {
  if (document.body.dataset.page !== 'product') return;
  document.body.classList.add('has-sticky');
  const params = new URLSearchParams(location.search);
  const v = params.get('v'); if (v) $$('[data-vehicle]').forEach(e => e.textContent = v);
  let cov = 'full', color = 'Black';
  const main = $('[data-main]'); if (main) setBg(main, 'pdp-1.jpg');
  $$('[data-thumbs] .thumb').forEach(t => { setBg(t, t.dataset.thumb); t.addEventListener('click', () => { $$('[data-thumbs] .thumb').forEach(x => x.classList.remove('active')); t.classList.add('active'); setBg(main, t.dataset.thumb); }); });
  const form = $('[data-selector]'); const sel = form ? fillSelector(form) : null;
  form?.addEventListener('vchange', () => { if (sel.complete()) $$('[data-vehicle]').forEach(e => e.textContent = sel.label()); });
  const price = () => COV[cov].price;
  function sync() {
    const p = price();
    $('[data-price]') && ($('[data-price]').textContent = fmt(p));
    $('[data-add-price]') && ($('[data-add-price]').textContent = fmt(p));
    $('[data-pay4]') && ($('[data-pay4]').textContent = fmt(p / 4));
    $('[data-sticky-price]') && ($('[data-sticky-price]').firstChild.textContent = fmt(p));
    const c = $('[data-sticky-cov]'); if (c) c.textContent = COV[cov].label;
  }
  $$('.opt').forEach(c => c.addEventListener('click', () => { $$('.opt').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); $('input', c).checked = true; cov = c.dataset.cov; sync(); }));
  $$('.swatch').forEach(s => s.addEventListener('click', () => { $$('.swatch').forEach(x => x.classList.remove('sel')); s.classList.add('sel'); $('input', s).checked = true; color = s.dataset.color; }));
  $$('[data-add]').forEach(b => b.addEventListener('click', () => {
    const veh = $('[data-vehicle]') ? $('[data-vehicle]').textContent : 'Your vehicle';
    addItem({ key: `mats|${veh}|${cov}|${color}`, name: 'Custom-Fit Floor Mats', detail: `${veh} · ${COV[cov].label} · ${color}`, price: price(), img: 'pdp-1.jpg', qty: 1 });
    openCart();
  }));
  $('[data-xsell]')?.addEventListener('click', () => { addItem({ key: 'capsule', name: 'Capsule™ License Plate Case', detail: 'Machined aluminum · Black', price: 149, img: 'product-capsule.jpg', qty: 1 }); openCart(); });
  sync();
  // sticky bar visibility
  const bar = $('[data-sticky-buy]'); const anchor = $('[data-add]');
  if (bar && anchor) { const onScroll = () => { const r = anchor.getBoundingClientRect(); bar.classList.toggle('show', r.bottom < 0 || r.top > window.innerHeight); }; onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); }
}

/* ---------- boot ---------- */
hydrateImages(); setupLenis(); setupTransitions(); setupCompare(); setupReveal(); setupCarousels(); renderCount(); renderCart();
$$('[data-menu-toggle]').forEach(b => b.addEventListener('click', toggleMenu));
$$('[data-cart-toggle]').forEach(b => b.addEventListener('click', openCart));
$('[data-scrim]')?.addEventListener('click', closeAll);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
setupPDP();
