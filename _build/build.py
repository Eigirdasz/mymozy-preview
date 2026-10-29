import csv,json,openpyxl,os
os.chdir('/workspace/miora-de/koki-preview')
wb=openpyxl.load_workbook('../recheck/Miora_DE_final_prices.xlsx',data_only=True)
PR={r[0]:r[4] for r in wb['Prices'].iter_rows(min_row=4,values_only=True) if r[0] and isinstance(r[4],(int,float))}
INFO={ # sku: (name, type, step, concerns)
"CEU001":("Dr. Ceuracle Pro Balance Pure Cleansing Oil","Reinigungsöl",1,["reinigung"]),
"MXS009":("Mixsoon Bean Cleansing Oil","Reinigungsöl",1,["reinigung"]),
"CEL002":("Celimax Dual Barrier Boosting Serum","Serum",4,["hautbarriere"]),
"CEL003":("Celimax Dual Barrier Skin Wearable Cream","Creme",5,["hautbarriere","feuchtigkeit"]),
"CEL004":("Celimax The Real Cica Niacinamide Serum","Serum",4,["hautbarriere"]),
"CEL005":("Celimax The Real Noni Energy Ampoule","Ampulle",4,["glow"]),
"CEL008":("Celimax The Real Noni Energy Repair Cream","Creme",5,["glow"]),
"CEL011":("Celimax The Vita-A Retinal Shot Booster","Booster",4,["glow"]),
"CEU004":("Dr. Ceuracle Royal Vita Propolis 33 Cream","Creme",5,["glow","feuchtigkeit"]),
"CEU010":("Dr. Ceuracle Vegan Kombucha Tea Essence","Essenz",3,["feuchtigkeit"]),
"CEU011":("Dr. Ceuracle Vegan Kombucha Tea Gel Cream","Gel-Creme",5,["feuchtigkeit"]),
"CEU023":("Dr. Ceuracle Royal Vita Propolis 33 Ampoule","Ampulle",4,["glow"]),
"MXS002":("Mixsoon Bean Cream","Creme",5,["feuchtigkeit"]),
"MXS003":("Mixsoon Bean Essence","Essenz",3,["feuchtigkeit","glow"]),
"MXS013":("Mixsoon Centella Asiatica Toner","Toner",2,["hautbarriere"]),
"MXS028":("Mixsoon PDRN Collagen Serum","Serum",4,["glow"]),
"MXS029":("Mixsoon Soondy Centella Asiatica Essence","Essenz",3,["hautbarriere"]),
"CEU021":("Dr. Ceuracle Hyal Reyouth Moist Sun SPF 50","Sonnenschutz",6,["feuchtigkeit"]),
}
STEPS={1:"Schritt 1 · Reinigung",2:"Schritt 2 · Toner",3:"Schritt 3 · Essenz",4:"Schritt 4 · Serum / Ampulle",5:"Schritt 5 · Creme",6:"Letzter Schritt morgens · Sonnenschutz"}
LOW={"CEL004","CEL011"}
def eur(x): return "€ "+f"{x:.2f}".replace(".",",")
P=[]
for r in csv.DictReader(open('../product-data/mymozy-sku-data.csv')):
  n,t,st,c=INFO[r['sku']]; size=int(r['size']); u=r['unit']; pr=PR.get(r['sku'])
  brand={"MIXSOON":"Mixsoon","CELIMAX":"Celimax","DR. CEURACLE":"Dr. Ceuracle"}[r['brand']]
  P.append(dict(sku=r['sku'],ean=r['ean'],brand=brand,name=f"{n} {size} {u}",type=t,step=st,stepLabel=STEPS[st],concerns=c,size=f"{size} {u}",
    price=eur(pr) if pr else "Preis folgt",grundpreis=(f"Grundpreis: {eur(pr/size*100)} / 100 {u}" if pr else ""),
    ship=("versandkostenfrei" if pr and pr>=50 else "zzgl. 3,95 € Versand") if pr else "",
    img=f"assets/products/{r['ean']}.jpg",featured=r['sku'] not in LOW))
BY={p['sku']:p for p in P}
SETS=[
 dict(id="daily",file="edit-daily.html",num="01",name="The Daily Glow",line="Essenz. Serum. Creme. Deine tägliche Basis.",price=69.90,items=["MXS003","MXS028","MXS002"],fuer="Wenn du eine einfache 3-Schritt-Routine für jeden Tag suchst."),
 dict(id="hydration",file="set-hydration.html",num="02",name="The Hydration Duo",line="Feuchtigkeit in zwei Schritten.",price=46.90,items=["MXS003","MXS002"],fuer="Wenn du mit zwei Schritten starten möchtest: Essenz und Creme."),
 dict(id="reset",file="set-reset.html",num="03",name="The Soft Reset",line="Sanft reinigen, gepflegt starten.",price=42.90,items=["MXS009","MXS002"],fuer="Wenn du deine Abendroutine mit einem Reinigungsöl beginnen möchtest."),
 dict(id="kombucha",file="set-kombucha.html",num="04",name="The Kombucha Ritual",line="Essenz und Gel-Creme aus einer Linie.",price=47.90,items=["CEU010","CEU011"],fuer="Wenn du zwei aufeinander abgestimmte Produkte einer Linie magst."),
]
for s in SETS:
  s['priceTxt']=eur(s['price']); s['ship']="versandkostenfrei" if s['price']>=50 else "zzgl. 3,95 € Versand"
for p in P: p['sets']=[{"name":s['name'],"file":s['file']} for s in SETS if p['sku'] in s['items']]
open('products.js','w').write("// Generiert aus mymozy-sku-data.csv + Miora_DE_final_prices.xlsx (Spalte: 10%-margin price, single unit)\nwindow.PRODUCTS="+json.dumps(P,ensure_ascii=False,indent=1)+";\nwindow.SETS="+json.dumps(SETS,ensure_ascii=False,indent=1)+";\n")
json.dump(dict(products=P,sets=SETS),open('products.json','w'),ensure_ascii=False,indent=1)

ICONS='''<div class="icons"><a href="alle-produkte.html" aria-label="Suche"><svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></a><a href="#" aria-label="Konto"><svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg></a><a href="#" aria-label="Warenkorb"><svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/></svg></a></div>'''
def page(title,body,extra=""):
  return f'''<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} – MYMOZY (Vorschau)</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@600&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css"></head><body>
<div class="topbar"><span>Kostenloser Versand ab 50 € (DE)</span><span>Ausgewählte koreanische Marken</span></div>
<header><div class="wrap"><!-- Arbeitstitel: Markenname MYMOZY ist noch nicht vollständig markenrechtlich geprüft --><a class="logo" href="index.html">MYMOZY</a>
<button class="menu" aria-label="Menü öffnen" aria-expanded="false" aria-controls="nav"><svg viewBox="0 0 24 24" width="24" height="24" stroke="#111" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
<nav id="nav"><a href="alle-produkte.html">Alle Produkte</a><a href="index.html#marken">Marken</a><a href="index.html#beduerfnis">Hautbedürfnisse</a><a href="routine-finden.html">Routinen &amp; Sets</a><a href="skincare-guide.html">Skincare-Guide</a><a href="ueber-uns.html">Über uns</a></nav>{ICONS}</div></header>
{body}
<footer><div class="wrap"><div class="logo">MYMOZY</div><div class="links"><a href="#">Impressum</a><a href="#">Datenschutz</a><a href="#">AGB</a><a href="#">Widerruf</a><a href="#">Versand &amp; Zahlung</a><a href="#">Cookie-Einstellungen</a></div>
<p class="note">Vorschau – nicht veröffentlicht. Texte, Preise und Namen sind Entwürfe. Produktfotos: Herstellerbilder nur zur internen Vorschau.</p></div></footer>
<script src="products.js"></script><script src="app.js"></script>{extra}</body></html>'''
AI='<span class="ai">KI-generiertes Bild (Vorschau)</span>'
def setcard(s):
  imgs="".join(f'<img src="{BY[k]["img"]}" alt="{BY[k]["name"]}">' for k in s['items'])
  inc="<br>".join(f'{BY[k]["name"]}' for k in s['items'])
  return f'<a class="card" href="{s["file"]}"><div class="packs">{imgs}</div><div class="num">{s["num"]}</div><h3>{s["name"]}</h3><p>{s["line"]}</p><p class="small">{inc}</p><div class="price">{s["priceTxt"]}</div><p class="small">inkl. MwSt. · {s["ship"]}</p></a>'
CARDS='<div class="cards c4">'+"".join(setcard(s) for s in SETS)+'</div>'
home=f'''<main>
<section class="hero"><div class="hero-txt"><div class="eyebrow">Der K-Beauty Edit</div><h1>Gute Hauttage beginnen hier.</h1><p class="script big">Deine gemütliche Skincare-Ecke.</p>
<p>Koreanische Skincare-Favoriten, ausgewählt für deinen Alltag.</p><div class="ctas"><a class="btn" href="alle-produkte.html">Skincare entdecken →</a><a class="btn ghost" href="routine-finden.html">Routinen entdecken</a></div></div>
<div class="hero-media"><video autoplay muted loop playsinline poster="assets/models/hero.jpg"><source src="assets/models/hero.mp4" type="video/mp4"><img src="assets/models/hero-still.jpg" alt=""></video><span class="side">Weniger suchen.<br>Mehr Routine.</span><span class="ai">KI-generiertes Video (Vorschau)</span></div></section>
<div class="strip wrap"><div class="trust"><span>Neu in Deutschland – sei von Anfang an dabei</span><span>Kuratiert: drei koreanische Marken, eine klare Auswahl</span><span>Sicher bezahlen</span></div></div>
<section id="edits"><div class="wrap"><div class="sec-head"><h2>Routinen &amp; Sets</h2><span class="script">Kuratierte Routinen für deinen Alltag.</span><a class="more" href="routine-finden.html">Alle Routinen →</a></div>
<div class="lifestyle"><img src="assets/models/edits-serum.jpg" alt="Model trägt ein Serum auf">{AI}</div>{CARDS}</div></section>
<section id="marken"><div class="wrap"><div class="sec-head"><h2>Shop nach Marke</h2></div><div class="tiles brands">
<a class="tile bt" href="alle-produkte.html?marke=Mixsoon">Mixsoon<span>→</span></a><a class="tile bt" href="alle-produkte.html?marke=Celimax">Celimax<span>→</span></a><a class="tile bt" href="alle-produkte.html?marke=Dr.%20Ceuracle">Dr. Ceuracle<span>→</span></a></div></div></section>
<section id="beduerfnis"><div class="wrap"><div class="sec-head"><h2>Shop nach Hautbedürfnis</h2></div><div class="concern-row"><div class="lifestyle small-ls"><img src="assets/models/concern-model.jpg" alt="Model wäscht ihr Gesicht">{AI}</div><div class="tiles">
<a class="tile t1" href="alle-produkte.html?beduerfnis=feuchtigkeit">Feuchtigkeit<span>→</span></a><a class="tile t2" href="alle-produkte.html?beduerfnis=reinigung">Reinigung<span>→</span></a><a class="tile t3" href="alle-produkte.html?beduerfnis=hautbarriere">Hautbarriere<span>→</span></a><a class="tile t4" href="alle-produkte.html?beduerfnis=glow">Glow<span>→</span></a></div></div></div></section>
<!-- Abschnitt Top-Produkte & Kundenstimmen: kommt erst nach dem Launch, wenn echte Daten vorliegen. -->
<section id="ueber"><div class="wrap about"><div><h2>Über MYMOZY</h2><p>Hinter MYMOZY steht ein kleines Team, das selbst gern koreanische Skincare nutzt. Wir starten bewusst mit wenigen Marken – Mixsoon, Celimax und Dr. Ceuracle – statt mit einem endlosen Regal.</p><p>Bei jedem Produkt zeigen wir dir, wofür es in deiner Routine gedacht ist: Reinigung, Essenz, Serum oder Creme. So siehst du auf einen Blick, was zu deinem Alltag passt.</p><a class="btn" href="ueber-uns.html">Mehr über uns</a></div></div></section>
<section><div class="wrap"><div class="news"><div class="news-img"><img src="assets/models/newsletter-model.jpg" alt="">{AI}</div><div><h2>Newsletter</h2><p>Neue Routinen, Skincare-Tipps und Neuigkeiten von MYMOZY – direkt in dein Postfach.</p>
<form onsubmit="return false"><input type="email" placeholder="Deine E-Mail-Adresse" aria-label="E-Mail-Adresse"><label><input type="checkbox"> [Platzhalter Einwilligungstext: Ich möchte den Newsletter erhalten und habe die Datenschutzerklärung gelesen. Abmeldung jederzeit möglich.]</label><br><button class="btn" type="submit">Anmelden</button></form></div></div></div></section></main>'''
open('index.html','w').write(page("Koreanische Skincare",home))

ACC='<details><summary>Inhaltsstoffe</summary><p>INCI folgt</p></details><details><summary>Anwendung</summary><p>folgt</p></details><details><summary>Hinweise</summary><p>folgt</p></details><details><summary>Versand, Zahlung &amp; Rückgabe</summary><p>Kostenloser Versand ab 50 € (DE), darunter 3,95 €. Zahlung und Rückgabe: Details folgen.</p></details>'
def setpage(s):
  it="".join(f'<li><img src="{BY[k]["img"]}" alt=""><div><span class="step">{BY[k]["stepLabel"]}</span><a href="produkt.html?ean={BY[k]["ean"]}"><b>{BY[k]["name"]}</b></a><span class="small">Größe: {BY[k]["size"]}</span></div></li>' for k in s['items'])
  gal=f'<div class="gallery"><div class="main-img model"><img src="assets/models/daily-model.jpg" alt="Model mit Cremetiegel">{AI}</div><div class="thumbs">'+"".join(f'<img src="{BY[k]["img"]}" alt="">' for k in s['items'])+'</div></div>' if s['id']=="daily" else '<div class="gallery"><div class="main-img packs big">'+"".join(f'<img src="{BY[k]["img"]}" alt="{BY[k]["name"]}">' for k in s['items'])+'</div></div>'
  rout='<section><h2 class="h2s">Deine Routine</h2><div class="steps"><div class="step-card"><h3>Morgens</h3><ol>'+"".join(f'<li>{BY[k]["type"]}: {BY[k]["name"]}</li>' for k in s['items'] if BY[k]['type']!="Reinigungsöl")+'</ol></div><div class="step-card"><h3>Abends</h3><ol>'+"".join(f'<li>{BY[k]["type"]}: {BY[k]["name"]}</li>' for k in s['items'])+'</ol></div></div><p class="small">Allgemeine Reihenfolge von leicht nach reichhaltig. Genaue Anwendung: folgt.</p></section>'
  body=f'''<main class="wrap"><p class="small crumbs"><a href="index.html">Start</a> / <a href="routine-finden.html">Routinen &amp; Sets</a> / {s["name"]}</p><div class="pdp">{gal}
<div><div class="eyebrow">Set {s["num"]}</div><h1>{s["name"]}</h1><span class="script">{s["line"]}</span>
<h3 class="h3s">Das ist drin</h3><ul class="inside">{it}</ul>
<div class="price big">{s["priceTxt"]}</div><p class="small">inkl. MwSt. · {s["ship"]}</p><!-- Set aus verschiedenen Produkten: kein gemeinsamer Grundpreis, Größen je Produkt oben (Hinweis Legal) -->
<div class="buy"><div class="qty"><button type="button" data-q="-1" aria-label="weniger">−</button><input id="qty" value="1" aria-label="Menge"><button type="button" data-q="1" aria-label="mehr">+</button></div><button class="btn" type="button" id="add">In den Warenkorb</button></div><p class="small" id="msg" aria-live="polite"></p>{ACC}</div></div>{rout}</main>'''
  open(s['file'],'w').write(page(s['name'],body))
for s in SETS: setpage(s)

grid='''<main class="wrap"><div class="sec-head" style="margin-top:40px"><h2>Alle Produkte</h2><span class="script">18 Produkte, drei Marken.</span></div>
<div class="chips" id="chips"><button data-b="" class="on">Alle</button><button data-b="Mixsoon">Mixsoon</button><button data-b="Celimax">Celimax</button><button data-b="Dr. Ceuracle">Dr. Ceuracle</button></div><p class="small" id="cfilter"></p>
<div class="pgrid" id="grid"></div></main>'''
open('alle-produkte.html','w').write(page("Alle Produkte",grid))
pdp='''<main class="wrap" id="pdp"></main>'''
open('produkt.html','w').write(page("Produkt",pdp))
fin='<main class="wrap"><section><div class="sec-head"><h2>Finde deine Routine</h2><span class="script">Vier Sets, ein klarer Start.</span></div><p>Du weißt noch nicht, wo du anfangen sollst? Hier siehst du unsere Sets auf einen Blick – mit allen Produkten und der Reihenfolge in deiner Routine.</p><div class="cards c4">'+"".join(setcard(s).replace('<div class="price">',f'<p class="fuer">{s["fuer"]}</p><div class="price">') for s in SETS)+'</div><p class="small" style="margin-top:20px">Phase 1: statische Übersicht. Ein interaktiver Routine-Finder folgt.</p></section></main>'
open('routine-finden.html','w').write(page("Routine finden",fin))
open('skincare-guide.html','w').write(page("Skincare-Guide",'<main class="wrap"><section><h2>Skincare-Guide</h2><p class="script">Bald hier.</p><p>Hier erklären wir bald Schritt für Schritt, wie eine koreanische Routine aufgebaut ist: Reinigung, Toner, Essenz, Serum, Creme und morgens Sonnenschutz. Inhalte folgen.</p><a class="btn" href="routine-finden.html">Routinen entdecken</a></section></main>'))
open('ueber-uns.html','w').write(page("Über uns",'<main class="wrap"><section class="about"><div><h2>Über MYMOZY</h2><p>Hinter MYMOZY steht ein kleines Team, das selbst gern koreanische Skincare nutzt. Wir starten mit drei Marken und einer überschaubaren Auswahl, damit du dich nicht durch hunderte Produkte klicken musst.</p><p>Jedes Produkt bekommt bei uns eine klare Rolle in der Routine. Ausführlicher Text folgt.</p></div></section></main>'))
