// R5: Vorschau-Warenkorb (localStorage), Routine-Quiz, Kontaktformular – kein Checkout, nichts wird gesendet
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const EN=document.documentElement.lang==='en',ROOT=window.ROOT||'',P=window.PRODUCTS||[],S=window.SETS||[];
const T=EN?{cart:'Your cart',close:'Close cart',empty:'Your cart is empty.',sub:'Subtotal',vat:'incl. VAT',free:'Free shipping within Germany ✓',away:x=>`You’re ${x} away from free shipping within Germany`,ship:'Shipping (DE)',shipv:'€3.95',fits:'Goes well with',add:'Add',checkout:'Checkout (preview)',note:'Checkout isn’t active in this preview – nothing will be ordered or charged.',less:'Decrease quantity',more:'Increase quantity',rm:'Remove',qty:'Quantity',added:n=>`Added to cart: ${n}`,set:'Set',open:'Open cart',items:n=>`Open cart, ${n} item${n==1?'':'s'}`,cont:'Continue shopping',
 qerr:'Please answer all three questions.',best:'Our suggestion',alt:'Alternative',singles:'Plus two single products',view:'View set',again:'Start again',disc:'A suggestion based on your preferences – not a skin analysis or medical advice. For skin concerns, please see a dermatologist.',addset:'Add set to cart',sent:'Preview: the form isn’t active – nothing was sent.'}
:{cart:'Dein Warenkorb',close:'Warenkorb schließen',empty:'Dein Warenkorb ist leer.',sub:'Zwischensumme',vat:'inkl. MwSt.',free:'Versandkostenfrei in DE ✓',away:x=>`Noch ${x} bis zum kostenlosen Versand in DE`,ship:'Versand (DE)',shipv:'3,95 €',fits:'Passt dazu',add:'Hinzufügen',checkout:'Zur Kasse (Vorschau)',note:'Die Kasse ist in dieser Vorschau nicht aktiv – es wird nichts bestellt oder berechnet.',less:'Menge verringern',more:'Menge erhöhen',rm:'Entfernen',qty:'Menge',added:n=>`Zum Warenkorb hinzugefügt: ${n}`,set:'Set',open:'Warenkorb öffnen',items:n=>`Warenkorb öffnen, ${n} Artikel`,cont:'Weiter stöbern',
 qerr:'Bitte beantworte alle drei Fragen.',best:'Unser Vorschlag',alt:'Alternative',singles:'Dazu zwei Einzelprodukte',view:'Zum Set',again:'Neu starten',disc:'Ein unverbindlicher Vorschlag auf Basis deiner Vorlieben – keine Hautanalyse und keine medizinische Beratung. Bei Hautproblemen frag am besten eine Hautärztin oder einen Hautarzt.',addset:'Set in den Warenkorb',sent:'Vorschau: Das Formular ist nicht aktiv – es wurde nichts gesendet.'};
const fmt=n=>EN?'€'+n.toFixed(2):n.toFixed(2).replace('.',',')+'\u00a0€';
const FREE=50,KEY='mymozy-preview-cart';
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let cart=[];try{cart=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){cart=[]}
const lookup=it=>{if(it.t==='s'){const s=S.find(x=>x.id===it.id);return s&&s.price!=null&&{name:s.name,price:s.price,img:P.find(p=>p.sku===s.items[0]).img,href:s.file,sub:T.set,skus:s.items}}
 const p=P.find(x=>x.sku===it.id);return p&&p.available&&{name:p.name,price:p.priceValue,img:p.img,href:'produkt.html?ean='+p.ean,sub:p.size,skus:[p.sku]}};
cart=cart.filter(it=>lookup(it)&&it.q>0);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}};
const count=()=>cart.reduce((a,b)=>a+b.q,0),total=()=>cart.reduce((a,it)=>a+lookup(it).price*it.q,0);
function add(t,id,q){const L=lookup({t,id});if(!L)return false;const f=cart.find(i=>i.t===t&&i.id===id);if(f)f.q+=q;else cart.push({t,id,q});save();render();return L.name}
// Drawer
const dr=document.createElement('div');dr.className='cart-wrap';dr.hidden=true;
dr.innerHTML=`<div class="cart-bg" data-close></div><aside class="cart" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-h" tabindex="-1"><div class="cart-head"><h2 id="cart-h">${T.cart}</h2><button type="button" class="cart-x" data-close aria-label="${T.close}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none"/></svg></button></div><div class="cart-body"></div></aside>`;
document.body.appendChild(dr);const body=dr.querySelector('.cart-body'),panel=dr.querySelector('.cart');
const live=document.createElement('p');live.className='sr';live.setAttribute('role','status');document.body.appendChild(live);
function sugg(){const inCart=new Set(cart.flatMap(it=>lookup(it).skus));if(!inCart.size)return[];
 const ctx=P.filter(p=>inCart.has(p.sku)),brands=new Set(ctx.map(p=>p.brand)),conc=new Set(ctx.flatMap(p=>p.concerns)),setSk=new Set(S.filter(s=>s.items.some(k=>inCart.has(k))).flatMap(s=>s.items));
 return P.filter(p=>p.available&&p.featured&&!inCart.has(p.sku)).map(p=>({p,sc:(setSk.has(p.sku)?3:0)+(brands.has(p.brand)?2:0)+(p.concerns.some(c=>conc.has(c))?1:0)})).filter(o=>o.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,3).map(o=>o.p)}
const pimg=b=>`<img src="${ROOT+b}-400.jpg" width="64" height="64" alt="" loading="lazy" decoding="async">`;
function render(){const n=count();$$('.cartbtn').forEach(b=>{const c=b.querySelector('.ccount');if(c){c.textContent=n;c.hidden=!n}b.setAttribute('aria-label',n?T.items(n):T.open)});
 if(!cart.length){body.innerHTML=`<p class="cart-empty">${T.empty}</p><a class="btn ghost" href="${EN?'':''}alle-produkte.html">${T.cont}</a>${foot()}`;return}
 const tot=total(),pct=Math.min(100,tot/FREE*100),rest=FREE-tot;
 body.innerHTML=`<div class="ship-prog"><p>${rest>0?T.away(fmt(rest)):'<b>'+T.free+'</b>'}</p><div class="bar" role="progressbar" aria-label="${EN?'Free shipping progress':'Fortschritt kostenloser Versand'}" aria-valuemin="0" aria-valuemax="50" aria-valuenow="${Math.min(50,tot).toFixed(2)}"><span style="width:${pct}%"></span></div></div>
 <ul class="cart-list">${cart.map((it,i)=>{const L=lookup(it);return `<li>${pimg(L.img)}<div class="ci"><a href="${L.href}">${esc(L.name)}</a><span class="small">${esc(L.sub)} · ${fmt(L.price)}</span><div class="qty sm"><button type="button" data-cq="-1" data-i="${i}" aria-label="${T.less}: ${esc(L.name)}">−</button><span aria-label="${T.qty}">${it.q}</span><button type="button" data-cq="1" data-i="${i}" aria-label="${T.more}: ${esc(L.name)}">+</button></div></div><div class="cr"><b>${fmt(L.price*it.q)}</b><button type="button" class="rm" data-rm="${i}">${T.rm}<span class="sr">: ${esc(L.name)}</span></button></div></li>`}).join('')}</ul>
 <div class="cart-sum"><div><span>${T.sub}</span><b>${fmt(tot)}</b></div><div class="small"><span>${T.ship}</span><span>${rest>0?T.shipv:T.free.replace(' ✓','')}</span></div><p class="small">${T.vat}</p></div>
 ${(()=>{const sg=sugg();return sg.length?`<div class="fits"><h3>${T.fits}</h3><ul>${sg.map(p=>`<li>${pimg(p.img)}<div class="ci"><a href="produkt.html?ean=${p.ean}">${esc(p.name)}</a><span class="small">${EN?p.en.price:p.price}</span></div><button type="button" class="btn sm" data-add-p="${p.sku}" aria-label="${esc(p.name)} – ${T.add}">${T.add}</button></li>`).join('')}</ul></div>`:''})()}${foot()}`}
const foot=()=>`<div class="co"><button class="btn" type="button" disabled aria-describedby="co-note">${T.checkout}</button><p class="small" id="co-note">${T.note}</p></div>`;
let lastF=null;
function open(){lastF=document.activeElement;render();dr.hidden=false;requestAnimationFrame(()=>dr.classList.add('on'));document.documentElement.classList.add('noscroll');panel.focus()}
function close(){dr.classList.remove('on');document.documentElement.classList.remove('noscroll');setTimeout(()=>{dr.hidden=true},200);if(lastF&&lastF.focus)lastF.focus()}
window.MYMOZY_CART={open,close,add};
dr.addEventListener('click',e=>{const t=e.target.closest('[data-close],[data-cq],[data-rm],[data-add-p]');if(!t)return;
 if(t.hasAttribute('data-close'))return close();
 if(t.dataset.cq){const it=cart[+t.dataset.i];it.q+=+t.dataset.cq;if(it.q<1)cart.splice(+t.dataset.i,1);save();render();const b=body.querySelector(`[data-cq="${t.dataset.cq}"][data-i="${t.dataset.i}"]`);(b||panel).focus();return}
 if(t.dataset.rm){cart.splice(+t.dataset.rm,1);save();render();panel.focus();return}
 if(t.dataset.addP){const n=add('p',t.dataset.addP,1);live.textContent=T.added(n);panel.focus()}});
dr.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}
 if(e.key==='Tab'){const f=[...panel.querySelectorAll('a[href],button:not([disabled]),input')].filter(x=>x.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];
  if(e.shiftKey&&(document.activeElement===a||document.activeElement===panel)){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
$$('.cartbtn').forEach(b=>b.addEventListener('click',open));
// Add-Buttons: Set-/Produktseite (#add, von app.js gerendert) + Auswahl
function bind(){const a=$('#add');if(a&&!a.dataset.r5){a.dataset.r5=1;a.onclick=()=>{const q=Math.max(1,parseInt(($('#qty')||{}).value)||1);let n;
  if(a.dataset.set)n=add('s',a.dataset.set,q);else{const e=new URLSearchParams(location.search).get('ean');const p=P.find(x=>x.ean===e)||P[0];n=p.available&&add('p',p.sku,q)}
  if(n){const m=$('#msg');if(m)m.textContent=T.added(n);open()}}}}
bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{const t=e.target.closest('main [data-add-p]');if(!t)return;const n=add('p',t.dataset.addP,1);if(n){live.textContent=T.added(n);open()}});
render();
// Quiz
const qf=$('#qform');
if(qf){const W={feel:{rich:{daily:2,kombucha:2},light:{fresh:3,daily:1},minimal:{fresh:2,daily:1},open:{daily:2,fresh:1,kombucha:1}},goal:{hyd:{daily:3,kombucha:2},glow:{kombucha:3,daily:2},calm:{daily:2,fresh:2},clean:{fresh:3}},steps:{few:{},many:{fresh:1,kombucha:1}}};
 const CON={hyd:'feuchtigkeit',glow:'glow',calm:'hautbarriere',clean:'reinigung'};
 qf.addEventListener('submit',e=>{e.preventDefault();const a={};for(const k of ['feel','goal','steps']){const r=qf.querySelector(`input[name=${k}]:checked`);if(!r){$('#qerr').textContent=T.qerr;qf.querySelector(`input[name=${k}]`).focus();return}a[k]=r.value}
  $('#qerr').textContent='';const sc={};S.forEach((s,i)=>sc[s.id]=-i/100);for(const k in a)for(const [id,v] of Object.entries(W[k][a[k]]||{}))sc[id]+=v;
  const rank=S.filter(s=>s.price!=null).sort((x,y)=>sc[y.id]-sc[x.id]),best=rank[0],alt=rank[1],used=new Set(best.items);
  const c=CON[a.goal];let singles=P.filter(p=>p.available&&p.featured&&!used.has(p.sku)).map(p=>({p,s:(p.concerns.includes(c)?2:0)+(a.steps==='many'&&!best.items.some(k=>P.find(q=>q.sku===k).step===p.step)?2:0)+(p.brand===P.find(q=>q.sku===best.items[0]).brand?1:0)})).sort((x,y)=>y.s-x.s).slice(0,2).map(o=>o.p);
  const sv=(s,k)=>EN?s.en[k]:s[k];const card=s=>`<a href="produkt.html?ean=${s.ean}" class="qs">${pimg(s.img)}<span><b>${esc(s.name)}</b><span class="small">${EN?s.en.price:s.price}</span></span></a>`;
  $('#qres').innerHTML=`<p class="small qdisc">${T.disc}</p><div class="qbest"><img src="${ROOT}assets/img/s-card-${best.id}-600.jpg" width="600" height="600" alt="" loading="lazy"><div><span class="eyebrow">${T.best}</span><h3>${best.name}</h3><p>${sv(best,'line')}</p><p class="small">${best.items.map(k=>esc(P.find(p=>p.sku===k).name)).join(' · ')}</p><div class="price">${fmt(best.price)}</div><p class="small">${T.vat} · ${sv(best,'ship')}</p><div class="ctas"><a class="btn" href="${best.file}">${T.view}</a><button type="button" class="btn ghost" data-add-s="${best.id}">${T.addset}</button></div></div></div>
  <div class="qmore"><div><span class="eyebrow">${T.alt}</span><p><a href="${alt.file}"><b>${alt.name}</b></a> · ${fmt(alt.price)} <span class="small">(${T.vat} · ${sv(alt,'ship')})</span></p></div><div><span class="eyebrow">${T.singles}</span>${singles.map(card).join('')}</div></div><p class="small">${T.disc}</p><button type="button" class="btn ghost sm2" id="qagain">${T.again}</button>`;
  const r=$('#qres');r.focus();r.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
  r.querySelector('[data-add-s]').onclick=ev=>{add('s',ev.currentTarget.dataset.addS,1);open()};
  $('#qagain').onclick=()=>{qf.reset();r.innerHTML='';qf.querySelector('input').focus()}});}
// Kontaktformular (Vorschau)
const cf=$('#cform');if(cf)cf.addEventListener('submit',e=>{e.preventDefault();$('#c-msg-st').textContent=T.sent});
})();
