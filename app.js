// Vorschau-Logik (kein Checkout, keine Daten werden gesendet)
const $=s=>document.querySelector(s);
function bindBuy(){document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const i=$('#qty');i.value=Math.max(1,(+i.value||1)+(+b.dataset.q))});
const a=$('#add');if(a)a.onclick=()=>{$('#msg').textContent='Vorschau: Warenkorb ist nicht aktiv.'};}
const m=$('.menu');if(m)m.onclick=()=>{const n=$('#nav');const o=n.classList.toggle('open');m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?'Menü schließen':'Menü öffnen')};
const q=new URLSearchParams(location.search);
const card=p=>`<div class="pcard"><a href="produkt.html?ean=${p.ean}"><img src="${p.img}" alt="${p.name}"></a><span class="small">${p.brand} · ${p.type}</span><h3>${p.name}</h3><span class="small">Größe: ${p.size}</span><div class="price">${p.price}</div><span class="small">inkl. MwSt.${p.ship?' · '+p.ship:''}</span><span class="small">${p.grundpreis}</span><a class="btn sm" href="produkt.html?ean=${p.ean}">Ansehen</a></div>`;
const grid=$('#grid');
if(grid){const NAMES={feuchtigkeit:'Feuchtigkeit',reinigung:'Reinigung',hautbarriere:'Hautbarriere',glow:'Glow'};let brand=q.get('marke')||'';const need=q.get('beduerfnis')||'';
 const draw=()=>{grid.innerHTML=PRODUCTS.filter(p=>(!brand||p.brand===brand)&&(!need||p.concerns.includes(need))).map(card).join('');
  document.querySelectorAll('#chips button').forEach(b=>b.classList.toggle('on',b.dataset.b===brand));};
 if(need)$('#cfilter').innerHTML=`Hautbedürfnis: <b>${NAMES[need]||need}</b> · <a href="alle-produkte.html">Filter entfernen</a>`;
 document.querySelectorAll('#chips button').forEach(b=>b.onclick=()=>{brand=b.dataset.b;draw()});draw();}
const pdp=$('#pdp');
if(pdp){const p=PRODUCTS.find(x=>x.ean===q.get('ean'))||PRODUCTS[0];document.title=p.name+' – MYMOZY (Vorschau)';
 const rel=PRODUCTS.filter(x=>x.ean!==p.ean&&x.featured&&(x.brand===p.brand)&&x.step!==p.step).slice(0,3);
 const sets=p.sets.map(s=>`<a class="setlink" href="${s.file}">Enthalten im Set: <b>${s.name}</b> →</a>`).join('');
 pdp.innerHTML=`<p class="small crumbs"><a href="index.html">Start</a> / <a href="alle-produkte.html">Alle Produkte</a> / ${p.name}</p><div class="pdp"><div class="gallery"><div class="main-img"><img src="${p.img}" alt="${p.name}"></div></div><div>
 <div class="eyebrow">${p.brand}</div><h1 class="pname">${p.name}</h1><p class="small">${p.type} · Größe: ${p.size}</p><span class="step">Routine: ${p.stepLabel}</span>
 <div class="price big">${p.price}</div><p class="small">inkl. MwSt.${p.ship?' · '+p.ship:''}</p><p class="small">${p.grundpreis}</p>
 <div class="buy"><div class="qty"><button type="button" data-q="-1" aria-label="weniger">−</button><input id="qty" value="1" aria-label="Menge"><button type="button" data-q="1" aria-label="mehr">+</button></div><button class="btn" type="button" id="add">In den Warenkorb</button></div><p class="small" id="msg" aria-live="polite"></p>${sets}
 <details open><summary>Das steckt drin</summary><p>Produktbeschreibung und Inhaltsstoffe: folgt.</p></details><details><summary>Inhaltsstoffe</summary><p>INCI folgt</p></details><details><summary>Anwendung</summary><p>folgt</p></details><details><summary>Hinweise</summary><p>folgt</p></details><details><summary>Versand, Zahlung &amp; Rückgabe</summary><p>Kostenloser Versand ab 50 € (DE), darunter 3,95 €. Zahlung und Rückgabe: Details folgen.</p></details></div></div>
 ${rel.length?`<section><h2 class="h2s">Passt dazu</h2><div class="pgrid">${rel.map(card).join('')}</div></section>`:''}`;}
bindBuy();
