// Vorschau-Logik (kein Checkout, keine Daten werden gesendet)
const $=s=>document.querySelector(s);
const EN=document.documentElement.lang==='en';const ROOT=window.ROOT||'';
const T=EN?{cart:'Preview: cart is not active.',menuOpen:'Open menu',menuClose:'Close menu',size:'Size',vat:'incl. VAT',prev:'Preview price',soon:'Coming soon',view:'View',need:'Skin concern',clear:'Remove filter',inSet:'Included in set',home:'Home',all:'All products',routine:'Routine',less:'decrease',more:'increase',qty:'Quantity',add:'Add to cart',matches:'Goes well with',suffix:' – MYMOZY (Preview)',
 neutral:'<p>Product details coming soon.</p>',acc:'<details open><summary>What’s inside</summary><p>Product description and ingredients: coming soon.</p></details><details><summary>Ingredients</summary><p>INCI coming soon</p></details><details><summary>How to use</summary><p>Coming soon</p></details><details><summary>Good to know</summary><p>Coming soon</p></details><details><summary>Shipping, payment &amp; returns</summary><p>Free shipping from €50 (DE), €3.95 below that. Payment and returns: details coming soon.</p></details>',
 needs:{feuchtigkeit:'Hydration',reinigung:'Cleansing',hautbarriere:'Skin barrier',glow:'Glow'}}
:{cart:'Vorschau: Warenkorb ist nicht aktiv.',menuOpen:'Menü öffnen',menuClose:'Menü schließen',size:'Größe',vat:'inkl. MwSt.',prev:'Vorschaupreis',soon:'Bald verfügbar',view:'Ansehen',need:'Hautbedürfnis',clear:'Filter entfernen',inSet:'Enthalten im Set',home:'Start',all:'Alle Produkte',routine:'Routine',less:'weniger',more:'mehr',qty:'Menge',add:'In den Warenkorb',matches:'Passt dazu',suffix:' – MYMOZY (Vorschau)',
 neutral:'<p>Produktinfos folgen.</p>',acc:'<details open><summary>Das steckt drin</summary><p>Produktbeschreibung und Inhaltsstoffe folgen.</p></details><details><summary>Inhaltsstoffe</summary><p>INCI folgt.</p></details><details><summary>Anwendung</summary><p>Folgt.</p></details><details><summary>Hinweise</summary><p>Folgt.</p></details><details><summary>Versand, Zahlung &amp; Rückgabe</summary><p>Kostenloser Versand ab 50 € (DE), darunter 3,95 €. Zahlung und Rückgabe: Details folgen.</p></details>',
 needs:{feuchtigkeit:'Feuchtigkeit',reinigung:'Reinigung',hautbarriere:'Hautbarriere',glow:'Glow'}};
// Set-Preise zentral aus window.SETS (products.js)
const fmt=n=>EN?'€'+n.toFixed(2):n.toFixed(2).replace('.',',')+'\u00a0€';const shipTxt=n=>n>=50?(EN?'free shipping within Germany':'versandkostenfrei in DE'):(EN?'plus €3.95 shipping':'zzgl. 3,95 € Versand');
(window.SETS||[]).forEach(s=>{document.querySelectorAll(`[data-set-price="${s.id}"]`).forEach(e=>e.textContent=fmt(s.price));document.querySelectorAll(`[data-set-ship="${s.id}"]`).forEach(e=>e.textContent=shipTxt(s.price))});
const v=(p,k)=>EN&&p.en?p.en[k]:p[k];
// Sprachumschalter: Query (z. B. ?ean=) und Anker übernehmen
document.querySelectorAll('a.lsw').forEach(a=>{a.href=a.getAttribute('href')+location.search+location.hash});
// Hero-Video: Autoplay-Fallback, reduzierte Bewegung respektieren
const hv=$('#herovid');if(hv){if(matchMedia('(prefers-reduced-motion: reduce)').matches){hv.removeAttribute('autoplay');hv.pause();hv.preload='none';}else{hv.muted=true;const pp=hv.play();if(pp&&pp.catch)pp.catch(()=>{});}}
function bindBuy(){document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const i=$('#qty');i.value=Math.max(1,(+i.value||1)+(+b.dataset.q))});
const a=$('#add');if(a)a.onclick=()=>{$('#msg').textContent=T.cart};}
const m=$('.menu');if(m)m.onclick=()=>{const n=$('#nav');const o=n.classList.toggle('open');m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?T.menuClose:T.menuOpen)};
const q=new URLSearchParams(location.search);
const card=p=>`<div class="pcard"><a href="produkt.html?ean=${p.ean}"><img src="${ROOT+p.img}" alt="${p.name}"></a><span class="small">${p.brand}${v(p,'type')?' · '+v(p,'type'):''}</span><h3>${p.name}</h3><span class="small">${T.size}: ${p.size}</span><div class="price">${v(p,'price')}</div><span class="small">${p.available?`${T.vat}${v(p,'ship')?' · '+v(p,'ship'):''} · ${T.prev}`:''}</span><span class="small">${v(p,'grundpreis')}</span><a class="btn sm" href="produkt.html?ean=${p.ean}">${T.view}</a></div>`;
const grid=$('#grid');
if(grid){let brand=q.get('marke')||'';const need=q.get('beduerfnis')||'';
 const draw=()=>{grid.innerHTML=PRODUCTS.filter(p=>(!brand||p.brand===brand)&&(!need||p.concerns.includes(need))).map(card).join('');
  document.querySelectorAll('#chips button').forEach(b=>b.classList.toggle('on',b.dataset.b===brand));};
 if(need)$('#cfilter').innerHTML=`${T.need}: <b>${T.needs[need]||need}</b> · <a href="alle-produkte.html">${T.clear}</a>`;
 document.querySelectorAll('#chips button').forEach(b=>b.onclick=()=>{brand=b.dataset.b;draw()});draw();}
const pdp=$('#pdp');
if(pdp){const p=PRODUCTS.find(x=>x.ean===q.get('ean'))||PRODUCTS[0];document.title=p.name+T.suffix;
 const rel=PRODUCTS.filter(x=>x.ean!==p.ean&&x.featured&&(x.brand===p.brand)&&x.step!==p.step).slice(0,3);
 const sets=p.sets.map(s=>`<a class="setlink" href="${s.file}">${T.inSet}: <b>${s.name}</b> →</a>`).join('');
 pdp.innerHTML=`<p class="small crumbs"><a href="index.html">${T.home}</a> / <a href="alle-produkte.html">${T.all}</a> / ${p.name}</p><div class="pdp"><div class="gallery"><div class="main-img"><img src="${ROOT+p.img}" alt="${p.name}"></div></div><div>
 <div class="eyebrow">${p.brand}</div><h1 class="pname">${p.name}</h1><p class="small">${v(p,'type')?v(p,'type')+' · ':''}${T.size}: ${p.size}</p>${v(p,'stepLabel')?`<span class="step">${T.routine}: ${v(p,'stepLabel')}</span>`:''}
 <div class="price big">${v(p,'price')}</div><p class="small">${p.available?`${T.vat}${v(p,'ship')?' · '+v(p,'ship'):''} · ${T.prev}`:''}</p><p class="small">${v(p,'grundpreis')}</p>
 <div class="buy"><div class="qty"${p.available?'':' hidden'}><button type="button" data-q="-1" aria-label="${T.less}">−</button><input id="qty" value="1" aria-label="${T.qty}"><button type="button" data-q="1" aria-label="${T.more}">+</button></div>${p.available?`<button class="btn" type="button" id="add">${T.add}</button>`:`<button class="btn" type="button" disabled aria-disabled="true" style="opacity:.5;cursor:not-allowed">${T.soon}</button>`}</div><p class="small" id="msg" aria-live="polite"></p>${sets}
 ${p.neutral?T.neutral:T.acc}</div></div>
 ${rel.length?`<section><h2 class="h2s">${T.matches}</h2><div class="pgrid">${rel.map(card).join('')}</div></section>`:''}`;}
bindBuy();
