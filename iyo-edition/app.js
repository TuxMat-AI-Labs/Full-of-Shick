/* TuxMat — iyO Edition.
   Shared across landing + PDP: media hydration, floating nav scroll
   state, vehicle selector, localStorage cart, sticky action bars,
   drag before/after, look-closer hotspots, scroll-snap carousels,
   scroll reveals, and a one-step demo checkout with Shop Pay / Apple
   Pay facades. Sample pricing and vehicle data; no payment is
   processed. */

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
function setupVideos() {
  $$('[data-bgvideo]').forEach(v => {
    fetch(`assets/${v.dataset.bgvideo}`, { method: 'HEAD' }).then(r => {
      if (!r.ok) return;
      const s = document.createElement('source'); s.src = `assets/${v.dataset.bgvideo}`; s.type = 'video/mp4';
      v.appendChild(s); v.muted = true; v.setAttribute('muted', ''); v.load();
      const go = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      go(); v.addEventListener('canplay', go, { once: true });
    }).catch(() => {});
  });
}

/* ---------- floating nav scroll state ---------- */
function setupNav() {
  const nav = $('[data-nav]'); if (!nav || document.body.dataset.page === 'product') return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
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
function renderCount() { const n = readCart().reduce((a, i) => a + i.qty, 0); $$('[data-cart-count]').forEach(b => { b.hidden = n === 0; b.textContent = n; }); }

/* ---------- overlays: menu + cart ---------- */
let menuEl, cartEl, ov;
function ovGet() { ov = ov || $('[data-overlay]'); return ov; }
function buildMenu() {
  if (menuEl) return; menuEl = document.createElement('div'); menuEl.className = 'menu-panel'; menuEl.hidden = true;
  menuEl.innerHTML = `<div class="panel-head"><span class="nav-logo">TUX<b>MAT</b></span><button class="panel-close" type="button" aria-label="Close">&#10005;</button></div>
    <nav><a href="product.html?p=mats">Floor mats</a><a href="product.html?p=cargo">SuperTrunk&trade;</a><a href="product.html?p=capsule">Capsule&trade; case</a><a href="index.html#engineering">Engineering</a><a href="index.html#reviews">Reviews</a></nav>
    <div class="menu-sub"><a href="https://www.tuxmat.ca/pages/faq">FAQ</a><a href="https://www.tuxmat.ca/pages/return-request">Returns</a><a href="https://www.tuxmat.ca/pages/warranty">Warranty</a><a href="https://www.tuxmat.ca/pages/company">About</a></div>`;
  document.body.appendChild(menuEl);
  menuEl.querySelector('.panel-close').addEventListener('click', closeAll);
}
function buildCart() {
  if (cartEl) return; cartEl = document.createElement('aside'); cartEl.className = 'cart'; cartEl.hidden = true; cartEl.setAttribute('aria-label', 'Cart');
  cartEl.innerHTML = `<div class="panel-head"><h2>Your cart</h2><button class="panel-close" type="button" aria-label="Close">&#10005;</button></div>
    <div class="cart-panel" data-panel="cart">
      <div class="cart-body"><ul class="cart-items" style="list-style:none"></ul><p class="cart-empty">Your cart is empty.</p></div>
      <div class="cart-foot"><div class="cart-sub total"><span>Subtotal</span><span data-sub>$0.00</span></div>
        <p class="cart-note">Shipping and taxes calculated at checkout.</p>
        <div class="wallets"><button class="wallet shop" type="button" data-express>Shop Pay</button><button class="wallet apple" type="button" data-express>&#63743; Pay</button></div>
        <button class="btn btn-block btn-gold" type="button" data-checkout disabled>Checkout</button>
        <p class="demo">Pay in 4 with Shop Pay &middot; demo</p></div></div>
    <div class="cart-panel cart-body" data-panel="checkout" hidden><p class="field-label" style="margin-top:0">One step &middot; contact, shipping, payment</p>
      <form class="checkout-form" data-checkout-form><input name="email" placeholder="Email" required><input name="name" placeholder="Full name" required><input name="address" placeholder="Address" required><input name="card" placeholder="Card number" inputmode="numeric" required>
      <button class="btn btn-block btn-gold" type="submit" data-pay>Pay $0.00</button><p class="demo">Demo &middot; no payment is processed</p></form></div>
    <div class="cart-panel cart-success" data-panel="success" hidden><div class="seal">&#10003;</div><h2 style="font-size:1.2rem">Order placed.</h2><p class="cart-note" style="text-align:center">Your set is cut from the scan of your exact vehicle.</p><button class="btn btn-ghost btn-block" type="button" data-continue style="margin-top:18px">Continue</button><p class="demo">Demo &middot; no payment processed</p></div>`;
  document.body.appendChild(cartEl);
  cartEl.querySelector('.panel-close').addEventListener('click', closeAll);
  cartEl.querySelector('[data-checkout]').addEventListener('click', () => panel('checkout'));
  $$('[data-express]', cartEl).forEach(b => b.addEventListener('click', () => panel('checkout')));
  cartEl.querySelector('[data-checkout-form]').addEventListener('submit', e => { e.preventDefault(); writeCart([]); renderCount(); renderCart(); panel('success'); });
  cartEl.querySelector('[data-continue]').addEventListener('click', closeAll);
}
function panel(n) { $$('.cart-panel', cartEl).forEach(p => p.hidden = p.dataset.panel !== n); }
function openMenu() { buildMenu(); ovGet().hidden = false; menuEl.hidden = false; document.body.style.overflow = 'hidden'; }
function openCart() { buildCart(); renderCart(); panel('cart'); ovGet().hidden = false; cartEl.hidden = false; document.body.style.overflow = 'hidden'; }
function closeAll() { ovGet().hidden = true; if (menuEl) menuEl.hidden = true; if (cartEl) cartEl.hidden = true; document.body.style.overflow = ''; }
function renderCart() {
  if (!cartEl) return; const c = readCart(); const list = cartEl.querySelector('.cart-items'); list.innerHTML = '';
  c.forEach((it, idx) => {
    const li = document.createElement('li'); li.className = 'citem';
    li.innerHTML = `<div class="ci-img"></div><div><div class="ci-nm">${it.name}</div><div class="ci-mt">${it.detail}</div><div class="ci-mt">${fmt(it.price)} &times; ${it.qty}</div><button class="ci-rm" type="button">Remove</button></div>`;
    setBg(li.querySelector('.ci-img'), it.img);
    li.querySelector('.ci-rm').addEventListener('click', () => { const cc = readCart(); cc.splice(idx, 1); writeCart(cc); renderCount(); renderCart(); });
    list.appendChild(li);
  });
  cartEl.querySelector('.cart-empty').style.display = c.length ? 'none' : 'block';
  const sub = c.reduce((a, i) => a + i.price * i.qty, 0);
  cartEl.querySelector('[data-sub]').textContent = fmt(sub);
  cartEl.querySelector('[data-checkout]').disabled = c.length === 0;
  const pay = cartEl.querySelector('[data-pay]'); if (pay) pay.textContent = `Pay ${fmt(sub)}`;
}

/* ---------- look-closer hotspots ---------- */
function setupHotspots() {
  $$('[data-hotspots]').forEach(box => {
    const cap = $('[data-hot-cap]', box);
    $$('.hot', box).forEach(h => h.addEventListener('click', () => {
      const wasActive = h.classList.contains('active');
      $$('.hot', box).forEach(x => x.classList.remove('active'));
      if (wasActive) { cap.classList.remove('show'); return; }
      h.classList.add('active');
      const [t, b] = (h.dataset.cap || '|').split('|');
      cap.innerHTML = `<b>${t}</b><span>${b}</span>`; cap.classList.add('show');
    }));
  });
}

/* ---------- scroll reveal ---------- */
function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('.section-head, .pcard, .review, .hotspots, .compare, .vband-inner, .feat-media, .feat-copy, .ctaband > *');
  els.forEach(e => e.classList.add('reveal'));
  const io = new IntersectionObserver(ents => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

/* ---------- before/after compare ---------- */
function setupCompare() {
  $$('[data-compare]').forEach(el => {
    const r = $('input[type=range]', el); if (!r) return;
    const set = v => el.style.setProperty('--pos', `${v}%`);
    set(r.value); r.addEventListener('input', () => set(r.value));
  });
}

/* ---------- carousel (scroll-snap + arrows) ---------- */
function setupCarousels() {
  $$('[data-carousel]').forEach(c => {
    const track = $('[data-carousel-track]', c);
    const step = () => Math.min(track.clientWidth * 0.85, (track.firstElementChild?.offsetWidth || 320) + 14);
    $('[data-carousel-prev]', c)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('[data-carousel-next]', c)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
}

/* ---------- landing ---------- */
function setupHome() {
  if (document.body.dataset.page !== 'home') return;
  const form = $('[data-selector]'); const sel = fillSelector(form); const find = $('[data-find]');
  const bar = $('[data-sticky]'); const card = $('[data-selector-card]');
  form.addEventListener('vchange', () => {
    find.disabled = !sel.complete();
    const sb = $('.sb-price', bar); if (sb) sb.firstChild.textContent = sel.complete() ? sel.label() : 'Find your fit';
  });
  const goShop = () => { window.location.href = sel.complete() ? `product.html?p=mats&v=${encodeURIComponent(sel.label())}` : 'product.html?p=mats'; };
  find.addEventListener('click', goShop);
  $('[data-sticky-find]')?.addEventListener('click', () => sel.complete() ? goShop() : window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('[data-scroll-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  // sticky bar appears once the hero selector scrolls away
  const onScroll = () => { const r = card.getBoundingClientRect(); bar.classList.toggle('show', r.bottom < 60); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- PDP ---------- */
function setupPDP() {
  if (document.body.dataset.page !== 'product') return;
  document.body.classList.add('has-sticky');
  const params = new URLSearchParams(location.search);
  const v = params.get('v'); if (v) $$('[data-vehicle]').forEach(e => e.textContent = v);
  let cov = 'full', color = 'Black';
  const main = $('[data-main]'); setBg(main, 'pdp-1.jpg');
  $$('[data-thumbs] .thumb').forEach(t => {
    setBg(t, t.dataset.thumb);
    t.addEventListener('click', () => { $$('[data-thumbs] .thumb').forEach(x => x.classList.remove('active')); t.classList.add('active'); setBg(main, t.dataset.thumb); });
  });
  const form = $('[data-selector]'); const sel = fillSelector(form);
  form.addEventListener('vchange', () => { if (sel.complete()) $$('[data-vehicle]').forEach(e => e.textContent = sel.label()); });
  const price = () => COV[cov].price;
  function sync() {
    const p = price();
    $('[data-price]').textContent = fmt(p);
    $('[data-add-price]').textContent = fmt(p);
    $('[data-pay4]').textContent = fmt(p / 4);
    $('[data-sticky-price]').firstChild.textContent = fmt(p);
    const c = $('[data-sticky-cov]'); if (c) c.textContent = COV[cov].label;
  }
  $$('.opt').forEach(c => c.addEventListener('click', () => { $$('.opt').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); $('input', c).checked = true; cov = c.dataset.cov; sync(); }));
  $$('.swatch').forEach(s => s.addEventListener('click', () => { $$('.swatch').forEach(x => x.classList.remove('sel')); s.classList.add('sel'); $('input', s).checked = true; color = s.dataset.color; }));
  $$('[data-add]').forEach(b => b.addEventListener('click', () => {
    const veh = $('[data-vehicle]').textContent;
    addItem({ key: `mats|${veh}|${cov}|${color}`, name: 'Custom-Fit Floor Mats', detail: `${veh} · ${COV[cov].label} · ${color}`, price: price(), img: 'pdp-1.jpg', qty: 1 });
    openCart();
  }));
  $('[data-xsell]')?.addEventListener('click', () => { addItem({ key: 'capsule', name: 'Capsule™ License Plate Case', detail: 'Machined aluminum · Black', price: 149, img: 'product-capsule.jpg', qty: 1 }); openCart(); });
  sync();
}

/* ---------- boot ---------- */
hydrateImages(); setupVideos(); setupNav(); setupCompare(); setupHotspots(); setupReveal(); setupCarousels(); renderCount();
$$('[data-menu-open]').forEach(b => b.addEventListener('click', openMenu));
$$('[data-cart-open]').forEach(b => b.addEventListener('click', openCart));
document.addEventListener('click', e => { if (e.target.matches('[data-overlay]')) closeAll(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
setupHome(); setupPDP();
