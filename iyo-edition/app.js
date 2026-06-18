/* TuxMat clone — app.js
   Replicates iyo.ai's JS behaviour using the same data attributes:
   - data-navigation-status  on <nav>
   - data-navigation-toggle  on interactive elements
   - data-module="product-cards"  fan deck on desktop
   - Lenis smooth scroll
   No GSAP needed — pure requestAnimationFrame / CSS transitions. */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     Lenis smooth scroll
  ----------------------------------------------------------- */
  function setupLenis() {
    if (typeof Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1.0, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.__lenis = lenis;
  }

  /* -----------------------------------------------------------
     Navigation — mirrors iyo [data-navigation-status] / [data-navigation-toggle]
  ----------------------------------------------------------- */
  function setupNav() {
    const nav = document.querySelector('[data-module="nav-alt"]');
    if (!nav) return;

    let panel = null; // 'menu' | 'cart' | null

    function setStatus(active, openPanel) {
      nav.setAttribute('data-navigation-status', active ? 'active' : 'not-active');
      // Show the right panel content
      document.querySelectorAll('[data-navigation-panel]').forEach(el => {
        el.style.display = (el.dataset.navigationPanel === openPanel) ? '' : 'none';
      });
      // ARIA
      const toggle = nav.querySelector('[data-navigation-toggle="toggle"]');
      if (toggle) toggle.setAttribute('aria-expanded', String(active));
      panel = active ? openPanel : null;
    }

    // click / tap on toggle elements
    nav.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-navigation-toggle]');
      if (!btn) return;
      const action = btn.dataset.navigationToggle;
      if (action === 'toggle') {
        if (panel === 'menu') { setStatus(false, null); }
        else { setStatus(true, 'menu'); }
      } else if (action === 'cart') {
        if (panel === 'cart') { setStatus(false, null); }
        else { setStatus(true, 'cart'); renderCart(); }
      } else if (action === 'close') {
        setStatus(false, null);
      }
      e.stopPropagation();
    });

    // Keyboard
    nav.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const btn = e.target.closest('[data-navigation-toggle]');
        if (btn) { btn.click(); e.preventDefault(); }
      }
      if (e.key === 'Escape' && panel) { setStatus(false, null); }
    });

    // Click outside closes
    document.addEventListener('click', function (e) {
      if (panel && !nav.contains(e.target)) setStatus(false, null);
    });

    // Init: hide all panels
    document.querySelectorAll('[data-navigation-panel]').forEach(el => {
      el.style.display = 'none';
    });
  }

  /* -----------------------------------------------------------
     Desktop product-cards fan (data-module="product-cards")
     Mirrors iyo's CSS-driven fan — JS only adds touch support
  ----------------------------------------------------------- */
  function setupProductFan() {
    const fan = document.querySelector('[data-module="product-cards"]');
    if (!fan) return;

    // Touch: tap fan to expand / collapse
    let expanded = false;
    fan.addEventListener('click', function (e) {
      if (window.matchMedia('(hover: hover)').matches) return; // hover devices use CSS
      expanded = !expanded;
      fan.classList.toggle('is-touch-expanded', expanded);
    });
  }

  /* -----------------------------------------------------------
     Cart (localStorage, no payment)
  ----------------------------------------------------------- */
  const CART_KEY = 'tuxmat-clone-cart';
  const fmt = n => '$' + n.toFixed(2);

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  }
  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge(items);
  }
  function updateCartBadge(items) {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const total = items.reduce((s, i) => s + i.qty, 0);
    el.textContent = total;
    el.style.display = total ? 'flex' : 'none';
  }

  function renderCart() {
    const items = readCart();
    const empty = document.getElementById('cart-empty');
    const list = document.getElementById('cart-items-list');
    const bottom = document.getElementById('cart-bottom');
    const totalEl = document.getElementById('cart-total');
    if (!empty || !list || !bottom) return;

    if (!items.length) {
      empty.style.display = ''; list.style.display = 'none'; bottom.style.display = 'none';
      return;
    }
    empty.style.display = 'none'; list.style.display = ''; bottom.style.display = '';

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    if (totalEl) totalEl.textContent = fmt(subtotal);

    list.innerHTML = items.map((item, idx) => `
      <div class="cart-item" data-idx="${idx}" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="width:56px;height:56px;border-radius:8px;background:#1a1a1a;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600">${item.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,.5)">${item.variant || ''}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
            <button data-dec="${idx}" style="width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:none;color:#fff;cursor:pointer;font-size:14px">−</button>
            <span style="font-size:13px">${item.qty}</span>
            <button data-inc="${idx}" style="width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:none;color:#fff;cursor:pointer;font-size:14px">+</button>
          </div>
        </div>
        <div style="font-size:13px;font-weight:600;white-space:nowrap">${fmt(item.price * item.qty)}</div>
      </div>
    `).join('');

    list.addEventListener('click', function (e) {
      const dec = e.target.dataset.dec, inc = e.target.dataset.inc;
      const items2 = readCart();
      if (dec !== undefined) { items2[dec].qty = Math.max(1, items2[dec].qty - 1); writeCart(items2); renderCart(); }
      if (inc !== undefined) { items2[inc].qty += 1; writeCart(items2); renderCart(); }
    }, { once: true });
  }

  /* Add to cart public API */
  window.TuxMatCart = {
    add(name, price, variant) {
      const items = readCart();
      const ex = items.find(i => i.name === name && i.variant === variant);
      if (ex) { ex.qty++; } else { items.push({ name, price, variant: variant || '', qty: 1 }); }
      writeCart(items);
    }
  };

  /* -----------------------------------------------------------
     Init
  ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    setupLenis();
    setupNav();
    setupProductFan();
    updateCartBadge(readCart());
  });
})();
