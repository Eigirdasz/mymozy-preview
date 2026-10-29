// Vorschau-Logik (kein Checkout, keine Daten werden gesendet)
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const EN=document.documentElement.lang==='en';const ROOT=window.ROOT||'';
const T=EN?{cart:'Preview: the cart isn’t active yet – nothing was added.',menuOpen:'Open menu',menuClose:'Close menu',size:'Size',vat:'incl. VAT',prev:'Preview price',soon:'Coming soon',view:'View',viewSfx:'– view',need:'Skin concern',clear:'Remove filter',inSet:'Included in set',home:'Home',all:'All products',routine:'Routine',less:'Decrease quantity',more:'Increase quantity',qty:'Quantity',add:'Add to cart',matches:'Goes well with',suffix:' – MYMOZY (Preview)',count:n=>n+' products shown',nl:'Preview: sign-up isn’t active yet – nothing was sent.',
 ainote:'Product image AI-generated, may differ from the actual product.',aimodel:'AI-generated image (preview)',malt:'Model applying a serum',neutral:'<p>Product details coming soon.</p>',
 acc:'<details open><summary>What’s inside</summary><p>Product description and ingredients: coming soon.</p></details><details><summary>Ingredients</summary><p>INCI coming soon</p></details><details><summary>How to use</summary><p>Coming soon</p></details><details><summary>Good to know</summary><p>Coming soon</p></details><details><summary>Shipping, payment &amp; returns</summary><p>Free shipping from €50 (DE), €3.95 below that. Payment and returns: details coming soon.</p></details>',
 needs:{feuchtigkeit:'Hydration',reinigung:'Cleansing',hautbarriere:'Skin barrier',glow:'Glow'}}
:{cart:'Vorschau: Der Warenkorb ist noch nicht aktiv – es wurde nichts hinzugefügt.',menuOpen:'Menü öffnen',menuClose:'Menü schließen',size:'Größe',vat:'inkl. MwSt.',prev:'Vorschaupreis',soon:'Bald verfügbar',view:'Ansehen',viewSfx:'ansehen',need:'Hautbedürfnis',clear:'Filter entfernen',inSet:'Enthalten im Set',home:'Start',all:'Alle Produkte',routine:'Routine',less:'Menge verringern',more:'Menge erhöhen',qty:'Menge',add:'In den Warenkorb',matches:'Passt dazu',suffix:' – MYMOZY (Vorschau)',count:n=>n+' Produkte angezeigt',nl:'Vorschau: Die Anmeldung ist noch nicht aktiv – es wurde nichts gesendet.',
 ainote:'Produktabbildung KI-generiert, kann vom Original abweichen.',aimodel:'KI-generiertes Bild (Vorschau)',malt:'Model trägt ein Serum auf',neutral:'<p>Produktinfos folgen.</p>',
 acc:'<details open><summary>Das steckt drin</summary><p>Produktbeschreibung und Inhaltsstoffe folgen.</p></details><details><summary>Inhaltsstoffe</summary><p>INCI folgt.</p></details><details><summary>Anwendung</summary><p>Folgt.</p></details><details><summary>Hinweise</summary><p>Folgt.</p></details><details><summary>Versand, Zahlung &amp; Rückgabe</summary><p>Kostenloser Versand ab 50 € (DE), darunter 3,95 €. Zahlung und Rückgabe: Details folgen.</p></details>',
 needs:{feuchtigkeit:'Feuchtigkeit',reinigung:'Reinigung',hautbarriere:'Hautbarriere',glow:'Glow'}};
// Set-Preise zentral aus window.SETS (products.js)
const fmt=n=>EN?'€'+n.toFixed(2):n.toFixed(2).replace('.',',')+'\u00a0€';
const shipTxt=n=>n>=50?(EN?'free shipping within Germany':'versandkostenfrei in DE'):(EN?'plus €3.95 shipping':'zzgl. 3,95 € Versand');
(window.SETS||[]).forEach(s=>{$$(`[data-set-price="${s.id}"]`).forEach(e=>e.textContent=fmt(s.price));$$(`[data-set-ship="${s.id}"]`).forEach(e=>e.textContent=shipTxt(s.price))});
const v=(p,k)=>EN&&p.en?p.en[k]:p[k];
// Sprachumschalter: Query (z. B. ?ean=) und Anker übernehmen
$$('a.lsw').forEach(a=>{a.href=a.getAttribute('href')+location.search+location.hash});
// Menü (mobil): Toggle + Esc
const m=$('.menu'),nav=$('#nav');
const setMenu=o=>{nav.classList.toggle('open',o);m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?T.menuClose:T.menuOpen)};
if(m){m.onclick=()=>setMenu(!nav.classList.contains('open'));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);m.focus()}})}
// Hero-Video: erst nach dem Laden starten (Poster-Bild ist LCP), reduzierte Bewegung respektieren
const hv=$('#herovid');
if(hv&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const go=()=>{hv.src=hv.dataset.src;hv.muted=true;const pp=hv.play();if(pp&&pp.catch)pp.catch(()=>{})};document.readyState==='complete'?setTimeout(go,300):addEventListener('load',()=>setTimeout(go,300))}
// Newsletter (Vorschau)
const nf=$('.news form');if(nf)nf.addEventListener('submit',()=>{$('#nl-msg').textContent=T.nl});
function bindBuy(){$$('[data-q]').forEach(b=>b.onclick=()=>{const i=$('#qty');i.value=Math.max(1,(+i.value||1)+(+b.dataset.q))});
 const a=$('#add');if(a)a.onclick=()=>{$('#msg').textContent=T.cart};}
const q=new URLSearchParams(location.search);
const pic=(b,alt,sizes,w,h,mw,lazy,prio)=>`<picture><source type="image/webp" srcset="${b}-600.webp 600w, ${b}-1200.webp ${mw}w" sizes="${sizes}"><img src="${b}-1200.jpg" srcset="${b}-600.jpg 600w, ${b}-1200.jpg ${mw}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}"${lazy?' loading="lazy"':''}${prio?' fetchpriority="high"':''} decoding="async"></picture>`;
const meta=p=>p.available?`${T.vat}${v(p,'ship')?' · '+v(p,'ship'):''} · ${T.prev}`:'';
const card=p=>`<article class="pcard"><a class="ph-link" href="produkt.html?ean=${p.ean}" tabindex="-1" aria-hidden="true">${pic(ROOT+p.img,'',"(max-width:560px) 46vw, (max-width:1100px) 31vw, 290px",1024,1024,1024,true)}</a><span class="small">${p.brand}${v(p,'type')?' · '+v(p,'type'):''}</span><h3><a href="produkt.html?ean=${p.ean}">${p.name}</a></h3><span class="small">${T.size}: ${p.size}</span><div class="price">${v(p,'price')}</div><span class="small meta">${meta(p)}${v(p,'grundpreis')?'<br>'+v(p,'grundpreis'):''}</span><a class="btn sm" href="produkt.html?ean=${p.ean}" aria-label="${p.name} ${T.viewSfx}">${T.view}</a></article>`;
// Produktraster: serverseitig gerendert, hier nur filtern
const grid=$('#grid');
if(grid){let brand=q.get('marke')||'';const need=q.get('beduerfnis')||'';
 const draw=(announce)=>{let n=0;$$('#grid .pcard').forEach(c=>{const ok=(!brand||c.dataset.brand===brand)&&(!need||c.dataset.concerns.split(' ').includes(need));c.hidden=!ok;if(ok)n++});
  $$('#chips button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.b===brand));if(announce)$('#gcount').textContent=T.count(n)};
 if(need)$('#cfilter').innerHTML=`${T.need}: <b>${T.needs[need]||need}</b> · <a href="alle-produkte.html">${T.clear}</a>`;
 $$('#chips button').forEach(b=>b.onclick=()=>{brand=b.dataset.b;draw(true)});draw(false);}
// Produktseite
const pdp=$('#pdp');
if(pdp){const p=PRODUCTS.find(x=>x.ean===q.get('ean'))||PRODUCTS[0];document.title=p.name+T.suffix;
 const rel=PRODUCTS.filter(x=>x.ean!==p.ean&&x.featured&&(x.brand===p.brand)&&x.step!==p.step).slice(0,4);
 const sets=p.sets.map(s=>`<a class="setlink" href="${s.file}">${T.inSet}: <b>&nbsp;${s.name}</b>&nbsp;→</a>`).join('');
 const extra=p.ean==="8809732915406"?`<div class="main-img model wide">${pic(ROOT+'assets/img/m-model-serum-apply',T.malt,"(max-width:820px) 100vw, 640px",1280,720,1200,true)}<span class="ai">${T.aimodel}</span></div>`:'';
 pdp.innerHTML=`<p class="small crumbs"><a href="index.html">${T.home}</a> / <a href="alle-produkte.html">${T.all}</a> / ${p.name}</p><div class="pdp"><div class="gallery"><div class="main-img">${pic(ROOT+p.img,p.name,"(max-width:820px) 100vw, 640px",1024,1024,1024,false,true)}</div><p class="small ainote">${T.ainote}</p>${extra}</div><div class="buybox">
 <div class="eyebrow">${p.brand}</div><h1>${p.name}</h1><p class="small">${v(p,'type')?v(p,'type')+' · ':''}${T.size}: ${p.size}</p>${v(p,'stepLabel')?`<span class="step">${T.routine}: ${v(p,'stepLabel')}</span>`:''}
 <div class="price big">${v(p,'price')}</div>${p.available?`<p class="small">${meta(p)}</p><p class="small">${v(p,'grundpreis')}</p>`:''}
 <div class="buy"><div class="qty"${p.available?'':' hidden'}><button type="button" data-q="-1" aria-label="${T.less}">−</button><input id="qty" value="1" inputmode="numeric" aria-label="${T.qty}"><button type="button" data-q="1" aria-label="${T.more}">+</button></div>${p.available?`<button class="btn" type="button" id="add">${T.add}</button>`:`<button class="btn" type="button" disabled>${T.soon}</button>`}</div><p class="small" id="msg" role="status"></p>${sets}
 <div class="accs">${p.neutral?T.neutral:T.acc}</div></div></div>
 ${rel.length?`<section class="rel" aria-labelledby="h-rel"><h2 class="h2s" id="h-rel">${T.matches}</h2><div class="pgrid">${rel.map(card).join('')}</div></section>`:''}`;
 pdp.style.minHeight='';}
bindBuy();
})();
