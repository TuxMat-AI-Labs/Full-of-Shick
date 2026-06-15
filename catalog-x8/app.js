/* TUXMAT // futuristic catalog (X8 register).
   Hamburger menu, video hero, QUICK ADD grid, URL-param PDP with model
   tabs, localStorage cart, one-step demo checkout. Sample pricing
   stands in for the live catalog; no payment is processed. */

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const CART_KEY = 'tuxmat-x8-cart';

const COLLECTIONS = {
  'floorline-x1': { name:'FLOORLINE // X1', price:189, tag:'2026' },
  'floorline-x2': { name:'FLOORLINE // X2', price:189, tag:'2025' },
  'cargoline-y1': { name:'CARGOLINE // Y1', price:279, tag:'2026' },
  'cargoline-y2': { name:'CARGOLINE // Y2', price:279, tag:'2025' },
  'capsule-z1':   { name:'CAPSULE // Z1', price:149, tag:'2026' },
  'capsule-z2':   { name:'CAPSULE // Z2', price:149, tag:'2024' },
};
const GRID_IMG = { 'floorline-x1':'g1.jpg','floorline-x2':'g2.jpg','cargoline-y1':'g3.jpg','cargoline-y2':'g4.jpg','capsule-z1':'g5.jpg','capsule-z2':'g6.jpg' };
const fmt = n => `$${n.toFixed(2)}`;

/* image hydration: [data-img] sets background on the element */
function hydrateImages(root=document){
  $$('[data-img]',root).forEach(el=>{
    if(el.dataset.h) return; el.dataset.h='1';
    const probe=new Image();
    probe.onload=()=>{ el.style.backgroundImage=`url("assets/${el.dataset.img}")`; el.style.backgroundSize='cover'; el.style.backgroundPosition='center'; };
    probe.src=`assets/${el.dataset.img}`;
  });
}
function setBg(el,name){ el.style.backgroundImage=`url("assets/${name}")`; el.style.backgroundSize='cover'; el.style.backgroundPosition='center'; }

/* video */
function setupVideos(){
  $$('[data-bgvideo]').forEach(v=>{
    fetch(`assets/${v.dataset.bgvideo}`,{method:'HEAD'}).then(r=>{
      if(!r.ok) return;
      const s=document.createElement('source'); s.src=`assets/${v.dataset.bgvideo}`; s.type='video/mp4';
      v.appendChild(s); v.muted=true; v.setAttribute('muted',''); v.load();
      const go=()=>{const p=v.play(); if(p&&p.catch)p.catch(()=>{});}; go(); v.addEventListener('canplay',go,{once:true});
    }).catch(()=>{});
  });
}

/* menu overlay */
function setupMenu(){
  $('[data-menu-open]')?.addEventListener('click',()=>{
    const ov=document.createElement('div'); ov.className='menu-overlay';
    ov.innerHTML=`<button class="mo-close" type="button">Close</button>
      <nav class="menu-links">
        <a href="index.html">Home</a>
        <a href="index.html#collection">Shop</a>
        <a href="product.html?collection=floorline-x1&model=001&price=$189.00">Floorline</a>
        <a href="product.html?collection=cargoline-y1&model=001&price=$279.00">Cargoline</a>
        <a href="product.html?collection=capsule-z1&model=001&price=$149.00">Capsule</a>
      </nav>
      <div class="menu-side"><span class="label">TuxMat // 2026</span><div class="minor">
        <a href="https://www.tuxmat.ca/">About</a><a href="https://www.tuxmat.ca/">Press</a>
        <a href="https://www.tuxmat.ca/">Shipping</a><a href="https://www.tuxmat.ca/">Returns</a>
        <a href="https://www.tuxmat.ca/">Size guide</a><a href="https://www.tuxmat.ca/">Contact</a>
      </div></div>`;
    document.body.appendChild(ov);
    ov.querySelector('.mo-close').addEventListener('click',()=>ov.remove());
  });
  $$('[data-search]').forEach(b=>b.addEventListener('click',()=>{ window.location.href='index.html#collection'; }));
}

/* ---------- cart (localStorage) ---------- */
const readCart=()=>{ try{return JSON.parse(localStorage.getItem(CART_KEY))||[];}catch(e){return[];} };
const writeCart=c=>localStorage.setItem(CART_KEY,JSON.stringify(c));
function addItem(line){ const c=readCart(); const e=c.find(i=>i.key===line.key); if(e)e.qty+=line.qty; else c.push(line); writeCart(c); renderCount(); renderCart(); }
function renderCount(){ const n=readCart().reduce((a,i)=>a+i.qty,0); $$('[data-cart-count]').forEach(el=>el.textContent=n); }

let cartEl, ovEl;
function buildCart(){
  if(cartEl) return;
  ovEl=document.createElement('div'); ovEl.className='cart-ov'; ovEl.hidden=true;
  cartEl=document.createElement('aside'); cartEl.className='cart'; cartEl.hidden=true; cartEl.setAttribute('aria-label','Cart');
  cartEl.innerHTML=`
    <div class="cart-head"><h2>CART</h2><button class="cart-close" type="button" aria-label="Close">&#10005;</button></div>
    <div class="cart-panel" data-panel="cart">
      <ul class="cart-items"></ul>
      <p class="cart-empty">Your cart is empty</p>
      <div class="cart-foot">
        <div class="cart-sub"><span>Subtotal</span><span data-sub>$0.00</span></div>
        <button class="btn" style="width:100%" type="button" data-checkout disabled>Checkout</button>
      </div>
    </div>
    <div class="cart-panel" data-panel="checkout" hidden>
      <p class="label" style="margin-bottom:16px">One step · contact, shipping, payment</p>
      <form data-checkout-form style="display:grid;gap:10px">
        <input class="cart-field" name="email" placeholder="Email" required>
        <input class="cart-field" name="name" placeholder="Full name" required>
        <input class="cart-field" name="address" placeholder="Address" required>
        <input class="cart-field" name="card" placeholder="Card number" inputmode="numeric" required>
        <button class="btn" style="width:100%" type="submit" data-pay>Pay $0.00</button>
        <p class="demo-tag" style="text-align:center">Demo · no payment is processed</p>
      </form>
    </div>
    <div class="cart-panel cart-success" data-panel="success" hidden>
      <div class="seal">&#10003;</div><h2 style="font-size:16px;letter-spacing:.16em">Order placed</h2>
      <p class="muted" style="font-size:12px;letter-spacing:.06em;text-transform:uppercase">A confirmation is on its way</p>
      <button class="btn btn-out" type="button" data-continue style="margin-top:8px">Continue</button>
      <p class="demo-tag">Demo · no payment was processed</p>
    </div>`;
  document.body.append(ovEl,cartEl);
  ovEl.addEventListener('click',closeCart);
  cartEl.querySelector('.cart-close').addEventListener('click',closeCart);
  cartEl.querySelector('[data-checkout]').addEventListener('click',()=>showPanel('checkout'));
  cartEl.querySelector('[data-checkout-form]').addEventListener('submit',e=>{e.preventDefault(); writeCart([]); renderCount(); renderCart(); showPanel('success');});
  cartEl.querySelector('[data-continue]').addEventListener('click',closeCart);
}
function showPanel(n){ $$('.cart-panel',cartEl).forEach(p=>p.hidden=p.dataset.panel!==n); }
function openCart(){ buildCart(); renderCart(); showPanel('cart'); ovEl.hidden=false; cartEl.hidden=false; }
function closeCart(){ if(cartEl){cartEl.hidden=true;ovEl.hidden=true;} }
function renderCart(){
  if(!cartEl) return;
  const c=readCart(); const list=cartEl.querySelector('.cart-items'); list.innerHTML='';
  c.forEach((it,idx)=>{
    const li=document.createElement('li'); li.className='cart-item';
    li.innerHTML=`<div class="ph"></div><div><div class="nm">${it.name}</div><div class="mt">Model ${it.model} · ${fmt(it.price)} × ${it.qty}</div><button class="rm" type="button">Remove</button></div>`;
    setBg(li.querySelector('.ph'), it.img);
    li.querySelector('.rm').addEventListener('click',()=>{ const cc=readCart(); cc.splice(idx,1); writeCart(cc); renderCount(); renderCart(); });
    list.appendChild(li);
  });
  cartEl.querySelector('.cart-empty').style.display=c.length?'none':'block';
  const sub=c.reduce((a,i)=>a+i.price*i.qty,0);
  cartEl.querySelector('[data-sub]').textContent=fmt(sub);
  cartEl.querySelector('[data-checkout]').disabled=c.length===0;
  cartEl.querySelector('[data-pay]').textContent=`Pay ${fmt(sub)}`;
}

/* quick add (grid) */
function setupQuickAdd(){
  $$('[data-quick]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault(); e.stopPropagation();
    const d=JSON.parse(b.dataset.quick);
    addItem({ key:`${d.coll}|001`, name:d.coll, model:'001', price:d.price, img:d.img, qty:1 });
    openCart();
  }));
  $$('[data-cart-open]').forEach(b=>b.addEventListener('click',openCart));
}

/* newsletter */
function setupNewsletter(){ $$('[data-newsletter]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault(); f.innerHTML='<p class="label" style="color:var(--white)">On the list.</p>';})); }

/* ---------- PDP ---------- */
function setupPDP(){
  const main=$('[data-main]'); if(!main) return;
  const p=new URLSearchParams(location.search);
  const collKey=p.get('collection')||'floorline-x1';
  const coll=COLLECTIONS[collKey]||COLLECTIONS['floorline-x1'];
  const price=coll.price;
  let model=p.get('model')||'001';

  $('[data-bc]').textContent=coll.name;
  $('[data-title]').textContent='CUSTOM-FIT FLOOR MATS';
  $('[data-coll]').textContent=`${coll.name} > ${model}`;
  $('[data-price]').textContent=fmt(price);
  $('[data-install]').textContent=`Pay in 4 interest-free installments of ${fmt(price/4)}.`;

  const setModel=(m,thumb)=>{
    model=m;
    $('[data-coll]').textContent=`${coll.name} > ${model}`;
    setBg(main,thumb);
    $$('[data-model-tabs] .model-tab').forEach(t=>t.classList.toggle('active',t.dataset.model===m));
    $$('[data-thumbs] .pdp-thumb').forEach(t=>t.classList.toggle('active',t.dataset.thumb===thumb));
  };
  // hydrate thumbs + model tabs backgrounds
  $$('[data-thumbs] .pdp-thumb').forEach(t=>setBg(t,t.dataset.thumb));
  $$('[data-model-tabs] .model-tab').forEach(t=>setBg(t,t.dataset.thumb));
  // initial main = the model's image (001->m001 etc.)
  const initialThumb=`m${model}.jpg`;
  setBg(main, initialThumb);
  $$('[data-thumbs] .pdp-thumb').forEach(t=>t.classList.toggle('active',t.dataset.thumb===initialThumb));
  $$('[data-model-tabs] .model-tab').forEach(t=>t.classList.toggle('active',t.dataset.model===model));

  $$('[data-thumbs] .pdp-thumb').forEach(t=>t.addEventListener('click',()=>{ const m=t.dataset.thumb.match(/m(\d+)/)[1]; setModel(m,t.dataset.thumb); }));
  $$('[data-model-tabs] .model-tab').forEach(t=>t.addEventListener('click',()=>setModel(t.dataset.model,t.dataset.thumb)));

  $('[data-add]').addEventListener('click',()=>{
    addItem({ key:`${coll.name}|${model}`, name:coll.name, model, price, img:`m${model}.jpg`, qty:1 });
    openCart();
  });

  // related = other collections
  const rel=$('[data-related]');
  if(rel){
    Object.keys(COLLECTIONS).filter(k=>k!==collKey).slice(0,3).forEach(k=>{
      const c=COLLECTIONS[k];
      const a=document.createElement('a'); a.className='tile'; a.href=`product.html?collection=${k}&model=001&price=$${c.price}.00`;
      a.innerHTML=`<div class="tile-media"><span class="tile-tag">${c.tag}</span><div class="ph" data-img="${GRID_IMG[k]}"></div></div><div class="tile-body"><h3>${c.name}</h3><span class="price">${fmt(c.price)}</span></div>`;
      rel.appendChild(a);
    });
    hydrateImages(rel);
  }
}

/* boot */
hydrateImages();
setupVideos();
setupMenu();
setupQuickAdd();
setupNewsletter();
renderCount();
setupPDP();
