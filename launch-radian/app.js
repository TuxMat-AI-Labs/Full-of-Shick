/* TuxMat launch site (Radian register). Image/video hydration, header,
   expandable menu, feature + engineering carousels, and the stepped
   reserve configurator. Sample pricing/vehicle data stands in for the
   live catalog. The $99 deposit flow is a demo; no payment is taken. */

const VEHICLES = {
  years: (() => { const y = []; for (let i = 2026; i >= 2016; i--) y.push(i); return y; })(),
  makes: { Audi:['A3','A4','Q5','Q7'], BMW:['3 Series','5 Series','X3','X5'], Ford:['Escape','Explorer','F-150'], Honda:['Accord','Civic','CR-V','Pilot'], Lexus:['ES','NX','RX'], Tesla:['Model 3','Model S','Model X','Model Y'], Toyota:['Camry','Corolla','Highlander','RAV4'] },
};
const TIERS = { front:{label:'Front Row',price:189.99}, full:{label:'Front + Second Row',price:279.99}, fullst:{label:'Full Set + SuperTrunk™',price:329.99} };
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

/* image hydration (any [data-img] -> img or background) */
function hydrateImages(){
  $$('[data-img]').forEach(el=>{
    if(el.dataset.h) return; el.dataset.h='1';
    const name=el.dataset.img;
    const probe=new Image();
    probe.onload=()=>{
      if(el.tagName==='IMG'){ el.src=`assets/${name}`; }
      else { el.style.backgroundImage=`url("assets/${name}")`; el.style.backgroundSize='cover'; el.style.backgroundPosition='center'; }
    };
    probe.src=`assets/${name}`;
  });
}

/* video-ready (probe HEAD, attach + play muted) */
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

/* header solid on scroll */
function setupHeader(){ const h=$('[data-header]'); if(!h||h.classList.contains('solid'))return; const on=()=>h.classList.toggle('solid',window.scrollY>40); on(); window.addEventListener('scroll',on,{passive:true}); }

/* expandable menu */
function setupMenu(){
  const open=$('[data-menu-open]'); if(!open) return;
  open.addEventListener('click',()=>{
    const ov=document.createElement('div'); ov.className='menu-overlay';
    ov.innerHTML=`<button class="menu-close" type="button">Close</button>
      <nav class="menu-links">
        <a href="index.html#features">Overview</a>
        <a href="index.html#engineering">Engineering</a>
        <a href="index.html#story">Story</a>
        <a href="reserve.html">Reserve</a>
      </nav>`;
    document.body.appendChild(ov);
    ov.querySelector('.menu-close').addEventListener('click',()=>ov.remove());
  });
}

/* feature carousel (arrows scroll the track) */
function setupFeatureCarousel(){
  const track=$('[data-feat-track]'); if(!track) return;
  const step=()=>Math.min(track.clientWidth*0.8, 420);
  $('[data-caro-next]')?.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
  $('[data-caro-prev]')?.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
}

/* engineering crossfade carousel */
function setupEngCarousel(){
  const stage=$('[data-eng-stage]'); if(!stage) return;
  const slides=$$('.eng-slide',stage); let i=0;
  const show=n=>{ i=(n+slides.length)%slides.length; slides.forEach((s,k)=>s.classList.toggle('active',k===i)); $('[data-eng-current]').textContent=String(i+1).padStart(2,'0'); };
  $('[data-eng-next]')?.addEventListener('click',()=>show(i+1));
  $('[data-eng-prev]')?.addEventListener('click',()=>show(i-1));
}

/* reserve gallery auto-rotate + dots */
function setupReserveGallery(){
  const g=$('[data-rgallery]'); if(!g) return;
  const slides=$$('.rg-slide',g); const dotsWrap=$('[data-rg-dots]'); let i=0;
  slides.forEach((_,k)=>{ const b=document.createElement('button'); b.className='rg-dot'+(k===0?' active':''); b.type='button'; b.addEventListener('click',()=>show(k)); dotsWrap.appendChild(b); });
  const dots=$$('.rg-dot',g);
  const show=n=>{ i=(n+slides.length)%slides.length; slides.forEach((s,k)=>s.classList.toggle('active',k===i)); dots.forEach((d,k)=>d.classList.toggle('active',k===i)); };
  return { advance:()=>show(i+1) };
}

/* newsletter demo */
function setupNewsletter(){ $$('[data-newsletter]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault(); f.innerHTML='<p style="color:var(--bolt);font:600 13px/1.4 var(--sans);letter-spacing:.1em;text-transform:uppercase">You\'re on the list.</p>';})); }

/* ===== stepped reserve configurator ===== */
function setupReserve(){
  const panel=$('.reserve-panel'); if(!panel) return;
  const fmt=n=>`$${n.toFixed(2)}`;
  const state={ region:'', vehicle:{year:'',make:'',model:''}, coverage:'full', color:'Black' };
  const steps=$$('.step[data-step]').filter(s=>s.dataset.step!=='done');
  const pipsWrap=$('[data-pips]');
  steps.forEach(()=>{ const p=document.createElement('span'); p.className='step-pip'; pipsWrap.appendChild(p); });
  const pips=$$('.step-pip');
  let idx=0;
  const render=()=>{
    $$('.step').forEach(s=>s.classList.remove('active'));
    steps[idx].classList.add('active');
    pips.forEach((p,k)=>{ p.classList.toggle('done',k<idx); p.classList.toggle('current',k===idx); });
  };
  const go=n=>{ idx=Math.max(0,Math.min(steps.length-1,n)); render(); panel.scrollTo?.({top:0}); };

  // region
  $$('[data-region] .opt').forEach(o=>o.addEventListener('click',()=>{
    $$('[data-region] .opt').forEach(x=>x.classList.remove('sel')); o.classList.add('sel');
    state.region=o.dataset.val;
    steps[0].querySelector('[data-next]').disabled=false;
  }));

  // vehicle
  const ry=$('select[name="year"]',panel), rm=$('select[name="make"]',panel), rmo=$('select[name="model"]',panel);
  if(ry){ VEHICLES.years.forEach(y=>ry.add(new Option(y,y))); Object.keys(VEHICLES.makes).forEach(m=>rm.add(new Option(m,m)));
    const chk=()=>{ steps[1].querySelector('[data-next]').disabled=!(state.vehicle.year&&state.vehicle.make&&state.vehicle.model); };
    ry.addEventListener('change',()=>{state.vehicle.year=ry.value;chk();});
    rm.addEventListener('change',()=>{ state.vehicle.make=rm.value; state.vehicle.model=''; rmo.length=1; (VEHICLES.makes[rm.value]||[]).forEach(m=>rmo.add(new Option(m,m))); rmo.disabled=false; chk(); });
    rmo.addEventListener('change',()=>{state.vehicle.model=rmo.value;chk();});
  }

  // coverage
  $$('[data-coverage] .opt').forEach(o=>o.addEventListener('click',()=>{
    $$('[data-coverage] .opt').forEach(x=>x.classList.remove('sel')); o.classList.add('sel'); state.coverage=o.dataset.val;
  }));
  // finish
  $$('[data-finish] .swatch').forEach(o=>o.addEventListener('click',()=>{
    $$('[data-finish] .swatch').forEach(x=>x.classList.remove('sel')); o.classList.add('sel'); state.color=o.dataset.val;
  }));

  // nav buttons
  $$('[data-next]').forEach(b=>b.addEventListener('click',()=>{ if(idx===steps.length-1) return; go(idx+1); if(idx===steps.length-1) renderSummary(); }));
  $$('[data-back]').forEach(b=>b.addEventListener('click',()=>go(idx-1)));

  function vehLabel(){ const v=state.vehicle; return `${v.year} ${v.make} ${v.model}`; }
  function renderSummary(){
    const tier=TIERS[state.coverage];
    const region={ca:'Canada',us:'United States',row:'Rest of world'}[state.region]||'—';
    $('[data-summary]').innerHTML=`
      <div class="summary-line"><span>Region</span><span class="v">${region}</span></div>
      <div class="summary-line"><span>Vehicle</span><span class="v">${vehLabel()}</span></div>
      <div class="summary-line"><span>Coverage</span><span class="v">${tier.label}</span></div>
      <div class="summary-line"><span>Finish</span><span class="v">${state.color}</span></div>
      <div class="summary-line"><span>Set price</span><span class="v">${fmt(tier.price)}</span></div>`;
    const list=state.region==='row';
    $('[data-deposit]').textContent=list?'$0':'$99';
    $('[data-deposit-btn]').textContent=list?'Join the list':'$99';
    $('[data-deposit-note]').textContent=list
      ? 'No payment required. We will notify you the moment reservations open in your region.'
      : 'Your $99 deposit reserves your place in line. The balance is charged before your set ships. Fully refundable.';
  }

  $('[data-reserve-form]')?.addEventListener('submit',e=>{
    e.preventDefault();
    const tier=TIERS[state.coverage];
    const list=state.region==='row';
    $('[data-confirm-line]').textContent=list
      ? `You're on the interest list for ${vehLabel()}. We'll be in touch.`
      : `Your ${tier.label} set for the ${vehLabel()} is reserved. A confirmation is on its way.`;
    $$('.step').forEach(s=>s.classList.remove('active'));
    $('.step[data-step="done"]').classList.add('active');
    pips.forEach(p=>{p.classList.add('done');p.classList.remove('current');});
  });

  render();
}

/* boot */
hydrateImages();
setupVideos();
setupHeader();
setupMenu();
setupFeatureCarousel();
setupEngCarousel();
setupNewsletter();
const rg=setupReserveGallery();
if(rg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){ setInterval(rg.advance, 4000); }
setupReserve();
