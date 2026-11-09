// Vorschau-Logik (kein Checkout, keine Daten werden gesendet)
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const EN=document.documentElement.lang==='en';const ROOT=window.ROOT||'';
const T=EN?{cart:'Preview: the cart isn’t active yet – nothing was added.',menuOpen:'Open menu',menuClose:'Close menu',size:'Size',vat:'incl. VAT',prev:'Preview price',soon:'Coming soon',oos:'Currently unavailable',view:'View',viewSfx:'– view',need:'Skin need',clear:'Remove filter',inSet:'Included in set',home:'Home',all:'All products',routine:'Routine',less:'Decrease quantity',more:'Increase quantity',qty:'Quantity',add:'Add to cart',matches:'Goes well with',suffix:' – MYMOZY (Preview)',count:n=>n+' products shown',nl:'Preview: sign-up isn’t active yet – nothing was sent.',
 gal:'Image gallery',aiprod:'AI product image',choose:'Choose image',ainote:'Product image is AI-generated and may differ from the actual product.',aimodel:'AI-generated image',malt:'Model applying a serum',neutral:'<p>Product details coming soon.</p>',
 acc:'<details open><summary>What’s inside</summary><p>Product description and ingredients: coming soon.</p></details><details><summary>Ingredients</summary><p>INCI coming soon</p></details><details><summary>How to use</summary><p>Coming soon</p></details><details><summary>Good to know</summary><p>Coming soon</p></details><details><summary>Shipping, payment &amp; returns</summary><p>Free shipping from €50 (DE), €3.95 below that. Payment and returns: details coming soon.</p></details>',
 needs:{feuchtigkeit:'Hydration',reinigung:'Cleansing',hautbarriere:'Skin barrier',glow:'Glow'}}
:{cart:'Vorschau: Der Warenkorb ist noch nicht aktiv – es wurde nichts hinzugefügt.',menuOpen:'Menü öffnen',menuClose:'Menü schließen',size:'Größe',vat:'inkl. MwSt.',prev:'Vorschaupreis',soon:'Bald verfügbar',oos:'Derzeit nicht verfügbar',view:'Ansehen',viewSfx:'ansehen',need:'Hautbedürfnis',clear:'Filter entfernen',inSet:'Enthalten im Set',home:'Start',all:'Alle Produkte',routine:'Routine',less:'Menge verringern',more:'Menge erhöhen',qty:'Menge',add:'In den Warenkorb',matches:'Passt dazu',suffix:' – MYMOZY (Vorschau)',count:n=>n+' Produkte angezeigt',nl:'Vorschau: Die Anmeldung ist noch nicht aktiv – es wurde nichts gesendet.',
 gal:'Bildergalerie',aiprod:'KI-Produktbild',choose:'Bild auswählen',ainote:'Produktabbildung ist KI-generiert und kann vom tatsächlichen Produkt abweichen.',aimodel:'KI-generiertes Bild',malt:'Model trägt ein Serum auf',neutral:'<p>Produktinfos folgen.</p>',
 acc:'<details open><summary>Das steckt drin</summary><p>Produktbeschreibung und Inhaltsstoffe folgen.</p></details><details><summary>Inhaltsstoffe</summary><p>INCI folgt.</p></details><details><summary>Anwendung</summary><p>Folgt.</p></details><details><summary>Hinweise</summary><p>Folgt.</p></details><details><summary>Versand, Zahlung &amp; Rückgabe</summary><p>Kostenloser Versand ab 50 € (DE), darunter 3,95 €. Zahlung und Rückgabe: Details folgen.</p></details>',
 needs:{feuchtigkeit:'Feuchtigkeit',reinigung:'Reinigung',hautbarriere:'Hautbarriere',glow:'Glow'}};
const esc=t=>String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
const infoAcc=p=>{const i=p.info,d=EN?i.en.desc:i.desc,h=EN?i.en.howto:i.howto,n=EN?i.en.note:i.note;
 return `<details open><summary>${EN?'What’s inside':'Das steckt drin'}</summary><p>${esc(d)}</p></details><details><summary>${EN?'Ingredients (INCI)':'Inhaltsstoffe (INCI)'}</summary><p class="small">${esc(i.inci)}</p></details><details><summary>${EN?'How to use':'Anwendung'}</summary><p>${esc(h)}</p></details><details><summary>${EN?'Good to know':'Hinweise'}</summary><p>${esc(n)}</p></details>`+T.acc.slice(T.acc.lastIndexOf('<details>'));};
// Set-Preise zentral aus window.SETS (products.js)
const fmt=n=>EN?'€'+n.toFixed(2):n.toFixed(2).replace('.',',')+'\u00a0€';
const shipTxt=n=>n>=50?(EN?'free shipping within Germany':'versandkostenfrei in DE'):(EN?'plus €3.95 shipping':'zzgl. 3,95 € Versand');
(window.SETS||[]).forEach(s=>{if(s.price==null)return;$$(`[data-set-price="${s.id}"]`).forEach(e=>e.textContent=fmt(s.price));$$(`[data-set-ship="${s.id}"]`).forEach(e=>e.textContent=shipTxt(s.price))});
const v=(p,k)=>EN&&p.en?p.en[k]:p[k];
// Sprachumschalter: Query (z. B. ?ean=) und Anker übernehmen
$$('a.lsw').forEach(a=>{a.href=a.getAttribute('href')+location.search+location.hash});
// Menü (mobil): Toggle + Esc
const m=$('.menu'),nav=$('#nav');
const setMenu=o=>{nav.classList.toggle('open',o);m.setAttribute('aria-expanded',o);m.setAttribute('aria-label',o?T.menuClose:T.menuOpen)};
if(m){m.onclick=()=>setMenu(!nav.classList.contains('open'));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);m.focus()}})}
// Hero-Video: klein starten (1080/720, Fast-Start), danach optional 4K nachladen und überblenden
const hv=$('#herovid'),vt=$('#vtoggle');
if(hv){let userPaused=false,act=hv;const H=window.__hero={first:hv.currentSrc||hv.querySelector('source').src,swapped:false,active:()=>act};
 const prep=v=>{v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.playsInline=true};prep(hv);
 const ev=['touchstart','pointerdown','click','scroll','keydown'];
 const retry=()=>{ev.forEach(e=>removeEventListener(e,retry,true));if(!userPaused)tryPlay()};
 const tryPlay=()=>{if(userPaused||!act.paused)return;const pp=act.play();if(pp&&pp.catch)pp.catch(()=>{ev.forEach(e=>addEventListener(e,retry,{capture:true,passive:true,once:true}))})};
 const sync=()=>{if(!vt)return;const paused=act.paused;vt.setAttribute('aria-pressed',paused);vt.setAttribute('aria-label',paused?vt.dataset.lPlay:vt.dataset.lPause)};
 ['play','pause'].forEach(e=>hv.addEventListener(e,sync));['loadeddata','canplay'].forEach(e=>hv.addEventListener(e,tryPlay));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tryPlay()});
 if(vt)vt.addEventListener('click',e=>{e.stopPropagation();if(act.paused){userPaused=false;tryPlay()}else{userPaused=true;act.pause()}});
 hv.addEventListener('playing',()=>{H.first=H.first||hv.currentSrc;H.firstSrc=hv.currentSrc});
 tryPlay();sync();
 // 4K nur bei >1200 CSS-px und DPR>=2, erst wenn das kleine Video läuft
 const big=innerWidth>1200&&devicePixelRatio>=2&&!(navigator.connection&&navigator.connection.saveData);
 let started=false;const up=()=>{if(started||!big)return;started=true;
  const v=document.createElement('video');prep(v);v.loop=true;v.preload='auto';v.className='hv4';v.setAttribute('aria-hidden','true');v.tabIndex=-1;v.disablePictureInPicture=true;
  const base=(hv.currentSrc||'').replace(/hero-v2-[^/]*$/,'');const hevc=v.canPlayType('video/mp4; codecs="hvc1"')||v.canPlayType('video/mp4; codecs="hvc1.1.6.L150.B0"');
  v.src=base+(hevc?'hero-v2-2160-hevc.mp4':'hero-v2-2160.mp4');H.upSrc=v.src;
  hv.parentNode.insertBefore(v,hv.nextSibling);
  const giveUp=setTimeout(()=>{if(!H.swapped){v.removeAttribute('src');v.load();v.remove();H.upFailed=true}},25000);
  v.addEventListener('canplaythrough',()=>{if(H.swapped||v.dataset.go)return;v.dataset.go=1;
   v.currentTime=(hv.currentTime+0.15)%(hv.duration||1e9);
   v.addEventListener('seeked',()=>{const pp=v.play();(pp&&pp.then?pp:Promise.resolve()).then(()=>{
     const t=hv.currentTime;if(Math.abs(v.currentTime-t)>0.12&&Math.abs(v.currentTime-t)<5)v.currentTime=t;
     requestAnimationFrame(()=>{v.classList.add('on');clearTimeout(giveUp);H.swapped=true;act=v;['play','pause'].forEach(e=>v.addEventListener(e,sync));
      setTimeout(()=>{hv.pause();sync()},600)});
     if(userPaused)v.pause()}).catch(()=>{})},{once:true})});
 };
 hv.addEventListener('playing',()=>setTimeout(up,300),{once:true});
}
// Newsletter (Vorschau)
const nf=$('.news form');if(nf)nf.addEventListener('submit',()=>{$('#nl-msg').textContent=T.nl});
function bindBuy(){$$('[data-q]').forEach(b=>b.onclick=()=>{const i=$('#qty');i.value=Math.max(1,(+i.value||1)+(+b.dataset.q))});
 const a=$('#add');if(a)a.onclick=()=>{$('#msg').textContent=T.cart};}
const q=new URLSearchParams(location.search);
const pic=(b,alt,sizes,w,h,mw,lazy,prio)=>`<picture><source type="image/webp" srcset="${b}-600.webp 600w, ${b}-1200.webp ${mw}w" sizes="${sizes}"><img src="${b}-1200.jpg" srcset="${b}-600.jpg 600w, ${b}-1200.jpg ${mw}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}"${lazy?' loading="lazy"':''}${prio?' fetchpriority="high"':''} decoding="async"></picture>`;
const ss=(b,e,ws)=>ws.map(w=>`${b}-${w}.${e} ${w}w`).join(', ');
const ppic=(b,alt,sizes,lazy,prio,big)=>`<picture><source type="image/webp" srcset="${ss(b,'webp',big?[1200,2048]:[400,800,1200])}" sizes="${sizes}"><img src="${b}-800.jpg" srcset="${ss(b,'jpg',[400,800,1200])}" sizes="${sizes}" width="1200" height="1200" alt="${alt}"${lazy?' loading="lazy"':''}${prio?' fetchpriority="high"':''} decoding="async"></picture>`;
// Galerie: Thumbnails (Buttons, aria-pressed, Pfeiltasten), Crossfade, Wischen
function initGal(g){const st=g.querySelector('.stage'),sl=[...st.querySelectorAll('.slide')],th=[...g.querySelectorAll('.th')],ai=st.querySelector('.ai'),cap=g.querySelector('.gcap');let cur=0,tok=0;
 const load=s=>{s.querySelectorAll('[data-srcset]').forEach(e=>{e.srcset=e.dataset.srcset;e.removeAttribute('data-srcset')});const im=s.querySelector('img');if(im.dataset.src){im.src=im.dataset.src;im.removeAttribute('data-src')}return im};
 const go=(i,focus)=>{i=(i+sl.length)%sl.length;const im=load(sl[i]),t=++tok;
  th.forEach((b,k)=>{b.setAttribute('aria-pressed',k===i);b.tabIndex=k===i?0:-1});if(focus)th[i].focus();
  const show=()=>{if(t!==tok)return;sl.forEach((s,k)=>s.classList.toggle('on',k===i))};
  (im.complete&&im.naturalWidth?Promise.resolve():(im.decode?im.decode():Promise.resolve()).catch(()=>{})).then(show);
  g.classList.toggle('is-prod',!sl[i].classList.contains('model'));if(ai){const m=sl[i].classList.contains('model');ai.hidden=m;ai.textContent=m?'':g.dataset.aiProd;}
  const tp=g.querySelector(`template[data-cap="${i}"]`);if(cap)cap.innerHTML=tp?tp.innerHTML:'';cur=i};
 th.forEach((b,k)=>{b.onclick=()=>go(k);b.addEventListener('pointerenter',()=>load(sl[k]));b.addEventListener('focus',()=>load(sl[k]))});
 const grp=g.querySelector('.thumbs');grp.addEventListener('keydown',e=>{const d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];
  if(d){e.preventDefault();go(cur+d,true)}else if(e.key==='Home'){e.preventDefault();go(0,true)}else if(e.key==='End'){e.preventDefault();go(sl.length-1,true)}});
 let x0=null,y0=0;st.addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY});
 st.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(cur+(dx<0?1:-1))});
 st.addEventListener('pointercancel',()=>{x0=null});}
const meta=p=>p.available?`${T.vat}${v(p,'ship')?' · '+v(p,'ship'):''} · ${T.prev}`:'';
const card=p=>`<article class="pcard"><a class="ph-link" href="produkt.html?ean=${p.ean}" tabindex="-1" aria-hidden="true">${ppic(ROOT+p.img,'',"(max-width:560px) 46vw, (max-width:1100px) 31vw, 290px",true)}</a><span class="small">${p.brand}${v(p,'type')?' · '+v(p,'type'):''}</span><h3><a href="produkt.html?ean=${p.ean}">${p.name}</a></h3><span class="small">${T.size}: ${p.size}</span><div class="price">${v(p,'price')}</div><span class="small meta">${meta(p)}${v(p,'grundpreis')?'<br>'+v(p,'grundpreis'):''}</span><a class="btn sm" href="produkt.html?ean=${p.ean}" aria-label="${p.name} ${T.viewSfx}">${T.view}</a></article>`;
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
 const hasM=p.ean==="8809732915406",SZ="(max-width:820px) 100vw, 640px",mb=ROOT+'assets/img/m-model-serum-apply-v3';
 const gal=hasM?`<div class="gallery" data-gal data-ai-model="${T.aimodel}" data-ai-prod="${T.aiprod}"><div class="main-img stage" role="region" aria-label="${T.gal}"><div class="slide on prod">${ppic(ROOT+p.img,p.name,SZ,false,true,true)}</div><div class="slide model"><picture><source type="image/webp" data-srcset="${mb}-600.webp 600w, ${mb}-1200.webp 1200w, ${mb}-hd.webp 2048w" sizes="${SZ}"><img data-src="${mb}-1200.jpg" data-srcset="${mb}-600.jpg 600w, ${mb}-1200.jpg 1200w, ${mb}-hd.jpg 2048w" sizes="${SZ}" width="1280" height="720" alt="${T.malt}" decoding="async"></picture></div><span class="ai">${T.aiprod}</span></div><p class="gcap small" aria-live="polite"></p><div class="thumbs" role="group" aria-label="${T.choose}" style="--n:4"><button type="button" class="th" data-i="0" aria-pressed="true" aria-label="${p.name}">${ppic(ROOT+p.img,'',"120px",false)}</button><button type="button" class="th" data-i="1" aria-pressed="false" tabindex="-1" aria-label="${T.malt}">${pic(mb,'',"120px",1280,720,1200,true)}</button></div><p class="small ainote">${T.ainote}</p></div>`
  :`<div class="gallery"><div class="main-img">${ppic(ROOT+p.img,p.name,SZ,false,true,true)}</div><p class="small ainote">${T.ainote}</p></div>`;
 pdp.innerHTML=`<p class="small crumbs"><a href="index.html">${T.home}</a> / <a href="alle-produkte.html">${T.all}</a> / ${p.name}</p><div class="pdp">${gal}<div class="buybox">
 <div class="eyebrow">${p.brand}</div><h1>${p.name}</h1><p class="small">${v(p,'type')?v(p,'type')+' · ':''}${T.size}: ${p.size}</p>${v(p,'stepLabel')?`<span class="step">${T.routine}: ${v(p,'stepLabel')}</span>`:''}
 <div class="price big">${v(p,'price')}</div>${p.available?`<p class="small">${meta(p)}</p><p class="small">${v(p,'grundpreis')}</p>`:''}
 <div class="buy"><div class="qty"${p.available?'':' hidden'}><button type="button" data-q="-1" aria-label="${T.less}">−</button><input id="qty" value="1" inputmode="numeric" aria-label="${T.qty}"><button type="button" data-q="1" aria-label="${T.more}">+</button></div>${p.available?`<button class="btn" type="button" id="add">${T.add}</button>`:`<button class="btn" type="button" disabled>${p.oos?T.oos:T.soon}</button>`}</div><p class="small" id="msg" role="status"></p>${sets}
 <div class="accs">${p.neutral?T.neutral:(p.info?infoAcc(p):T.acc)}</div></div></div>
 ${rel.length?`<section class="rel" aria-labelledby="h-rel"><h2 class="h2s" id="h-rel">${T.matches}</h2><div class="pgrid">${rel.map(card).join('')}</div></section>`:''}`;
 pdp.style.minHeight='';}
$$('[data-gal]').forEach(initGal);
bindBuy();
})();
/* Akkordeon: exklusiv + animiert (Safari-tauglich via Hoehen-Animation am <details>) */
(function(){const RM=matchMedia('(prefers-reduced-motion: reduce)'),D=280,E='cubic-bezier(.4,0,.2,1)';
function sh(d){return d.querySelector(':scope>summary').offsetHeight}
function anim(d,open){if(d._a){d._a.cancel();d._a=null}
  if(RM.matches||!d.animate){d.open=open;return}
  const from=d.offsetHeight;if(open)d.open=true;const to=open?d.scrollHeight:sh(d);
  d.style.overflow='hidden';const a=d.animate({height:[from+'px',to+'px']},{duration:D,easing:E});d._a=a;
  a.onfinish=()=>{d._a=null;if(!open)d.open=false;d.style.overflow=''};a.oncancel=()=>{d.style.overflow=''}}
document.addEventListener('click',e=>{const s=e.target.closest('details>summary');if(!s)return;const d=s.parentElement;e.preventDefault();
  const open=!(d.open&&!d._closing);d._closing=!open;
  if(open)[...d.parentElement.children].forEach(o=>{if(o!==d&&o.tagName==='DETAILS'&&o.open){o._closing=true;anim(o,false);setTimeout(()=>o._closing=false,D)}});
  anim(d,open);setTimeout(()=>{d._closing=false},D)})})();
