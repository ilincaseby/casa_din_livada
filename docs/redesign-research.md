# Casa din Livadă — research și prima propunere

Data: 28 octombrie 2026. **Direcție aprobată și finisaje aplicate; nu există
aprobare de lansare.** Documentul păstrează research-ul primei propuneri și
actualizează rezultatele după feedback.

## Baseline și limite

- Repository Git separat, curat la început. Originalele `index.html`, `css/`,
  `js/` și `images/` sunt păstrate nemodificate.
- Originalul a fost servit local la portul 4320 și inspectat vizual desktop/mobil.
  Capturile before sunt păstrate în artefactele sesiunii, inclusiv conținutul
  revelat prin scroll. Pe mobil: overflow și contrast slab al titlului.
- Original: one-page lung, navigare prin ancore, preloader, galerii cu scroll
  automat, recenzii și numărători animate. Galeria era construită exclusiv în JS;
  lightbox-ul și meniul nu aveau management complet al focusului.
- Rădăcina activă unică după aprobarea direcției: `site/`. Originalul rămâne
  referință istorică/baseline și nu se dezvoltă în paralel. Nu există aprobare
  de arhivare, commit sau deploy.

## Inventar funcțional și decizii

| Original | Propunere | Motiv |
|---|---|---|
| Identitate, despre casă | Homepage + `/casa/` | Introducere compactă, detalii separat |
| Camere și facilități | `/casa/`, fotografii și detalii validate vizual | Nu deducem suprafețe, etaje sau număr de camere din directoare |
| Galerie cu categorii | `/galerie/`, 28 de imagini prerandate, filtre, URL de categorie | Utilizabilă fără JS; fără deplasare automată |
| Lightbox | Dialog nativ, Tab/Shift+Tab, Escape, săgeți, swipe, focus restore | Păstrează explorarea și repară accesibilitatea |
| Tur video | `/galerie/#tur`, YouTube numai la click, alternativă link | Fără tracking/iframe la încărcarea paginii |
| Împrejurimi | `/imprejurimi/`, trei surse oficiale | Fără stock cu identificări false sau durate neverificate |
| Locație | `/contact/#locatie`, link către localitate | Coordonatele proprietății sunt încă neconfirmate |
| Airbnb/Booking | `/contact/#rezervare`, linkuri active | Identitate confirmată de utilizator; tranzacția rămâne pe platformă |
| TuristInfo | Omis din UI | Nume incompatibil, identitate neclarificată |
| Recenzii, rating, Superhost, răspuns în sub o oră | Omise | Nu există verificare independentă |
| Preloader, contoare, carusel perpetuu | Eliminate | Nu ajută decizia sau accesul la conținut |
| Fallback `picsum.photos` | Mesaj și ilustrație locală de eroare | Nicio fotografie a unei alte proprietăți |
| Ancore vechi | Compatibilitate explicită în `site.ts` | `#despre`, `#facilitati`, `#camere`, `#galerie`, `#tur`, `#imprejurimi`, `#locatie`, `#contact` |

Compatibilitatea automată a ancorelor necesită JS; fără JS, navigarea normală
între cele cinci rute și linkurile foto rămân disponibile.

## Media: inventar, selecție și drepturi

- [Inventar complet](media-inventory.csv): **61 de fotografii**, cu cale,
  dimensiuni și dimensiunea fișierului. Toate au fost văzute în patru contact
  sheets; candidatele hero au fost deschise și individual.
- Directoare: backyard (19), balcony (3), bathroom1/2/3 (câte 1),
  bedroom1 (1), bedroom2 (2), bedroom3 (3), bedroom4 (3), exterior (10),
  kitchen (2), living (3), more_photos (9), zona_de_luat_masa (3).
- Selecție: 28 de fotografii. Acoperă toate tipurile de spații, inclusiv băi,
  bucătării, balcon și anotimpuri. Nu pretinde a fi inventarul camerelor.
- Hero: `backyard/ac628e73-68e5-47bf-b4ca-f1221109371a.avif`, 1200×900.
  Arată clar fațada, balcoanele și curtea; rezoluția este potrivită.
- Alternativă: `exterior/910f12d4-1903-4f7e-b6e2-0371ac4df9be.avif`, 720×404.
  Relația casă–livadă este mai clară, dar rezoluția prea mică pentru un hero
  mare. Folosită într-un panou mai mic și la turul video.
- Fotografia vechiului hero pune peisajul înaintea casei; păstrată în galerie.
  Imaginile repetate, mai întunecate sau cu persoane/animale nu sunt necesare
  selecției inițiale, dar originalele nu sunt eliminate.
- Variante WebP 360/720/1200 px, fără upscaling, generate separat. `srcset`,
  `sizes`, dimensiuni intrinseci, lazy-loading sub fold și prioritate pentru hero.
- Sursă: materialele locale ale proiectului. Utilizatorul a răspuns „confirm”
  pentru folosirea lor în propunere. **Permisiunea de publicare trebuie
  reconfirmată înainte de lansare**; autorul/licența originală nu sunt documentate.
- Fără stock, fără upload extern, fără Figma, fără generare de imagini cu credite.
- Manrope este self-hosted prin `@fontsource/manrope`, licență OFL-1.1 în pachet;
  subseturi latin și latin-ext pentru diacritice.
- Relieful și pictogramele sunt procedurale/originale. Posterul WebP este
  randarea scenei Three.js, nu o fotografie și nu date topografice.

## Surse și statutul afirmațiilor

Toate consultate la **2026-10-28**. „Confirmat” este însoțit de metoda verificării,
nu înseamnă că o platformă a fost accesibilă integral.

| Afirmație/material | Sursă | Statut și utilizare |
|---|---|---|
| Nume, Predeluț/Bran, identitate listinguri | HTML + răspunsul utilizatorului „sources=confirm” | `confirmat` de utilizator |
| Airbnb al casei | https://www.airbnb.com/rooms/31561912 | Identitate `confirmat` de utilizator; fetch a expus numai shell-ul, fără detalii |
| Booking al casei | https://www.booking.com/hotel/ro/casa-din-livada-predelut.ro.html | Identitate `confirmat` de utilizator; WAF nu a fost ocolit |
| TuristInfo | https://www.turistinfo.ro/bran/cazare-bran/casa_din_poiana-c110346.html | `de confirmat`, nume diferit, omis |
| Titlul turului video | https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=QKQ7DnCwRoc&format=json | Titlu `confirmat`: „Casa din Livada- Predeluț Brasov”; conținut integral `existent-neverificat` |
| 8 oaspeți, 4 dormitoare, 3 băi, închiriere integrală | HTML, întrebate opțional în formularul media | `existent-neverificat`: răspunsul scurt „confirm” este interpretat conservator, nu drept validare separată a fiecărei cifre |
| 35 m², etaj 2, 900 m altitudine, 3 acri, distanțe/timpi | HTML original | `existent-neverificat`, nu sunt promovate în propunere |
| Balcoane, paturi duble, living, dining, bucătării, dușuri, foișor, grătar, leagăn, pomi înfloriți | Inspecția fotografiilor | `confirmat` ca elemente vizibile, nu ca disponibilitate contractuală |
| Wi-Fi, parcare gratuită, televiziune premium, ping-pong, pet-friendly | HTML | `existent-neverificat`, cerute pentru confirmarea sejurului |
| Ratinguri, recenzii, Superhost, timp de răspuns | HTML | `existent-neverificat`, omise |
| 45.5269415,25.3460601 | Google Maps și HTML | `de confirmat`; pagina Maps nu a furnizat o identitate lizibilă. Nu reutilizăm pinul |
| Acces dificil iarna și 4×4 | HTML | `existent-neverificat`, prezentat ca întrebare de verificat cu gazda |
| Castelul Bran și informarea vizitatorilor | https://bran-castle.com/ | `confirmat`, fără copiere de prețuri sau orare volatile |
| Parcul **Național** Piatra Craiului | https://www.pcrai.ro/ | `confirmat`; corectează denumirea „Natural” din original |
| Parcul Natural Bucegi | https://bucegipark.ro/ro/ | `confirmat`, legătură către administrație |
| Public familii/grupuri | Natura produsului și brief | `inferred`, nu este regulă de cazare |
| Date juridice, domeniu, adresă, contact direct | Nicio sursă verificată | `de confirmat`; mock-uri numai în config, fără destinații active |

Comentariile „PENSIUNEA ALINA” din CSS/JS nu sunt dovadă de identitate.
Nu s-au efectuat rezervări, plăți sau contacte cu gazda.

## Direcție propusă

**Casa dintre livadă și cer:** fațada albă, balcoanele deschise și pomii
fotografiați conduc compoziția. Albastru mineral `#203b4b`, cer pal `#eaf0f2`,
alb `#f7f8f6`, accent vișiniu `#792f41` inspirat de acoperiș. Manrope cu
diacritice, fără serif decorativ, fără dark overlay pe fotografii.

Workflow principal Impeccable: context, new-work, craft-floor și inspecție
vizuală. Brief-ul cere o singură propunere construită înaintea aprobării:
nu a fost introdus un picker sau o rundă de alegere vizuală prealabilă.
Concept-seed a fost executat; ideile terminal, litere animate, automat de
hârtie, afiș noir și glife cinetice au fost respinse pentru lipsa unei legături
credibile cu această proprietate. Portalul WebGL rămâne limitat de brief
la fundal, fără ecran imersiv sau scroll-jacking. Nu se pretinde un audit
Impeccable independent. Aprobarea ulterioară este în
[design-approved.md](design-approved.md).

Referință consultată: `awesome-design-md/design-md/airbnb/DESIGN.md`, numai
pentru prioritatea fotografiei, lizibilitate și traseul de explorare.
Nu sunt copiate marca, fontul proprietar, rozul sau interfața marketplace.
Emil-design-eng: feedback imediat, dialoguri fără animații inutile.
Animate: singurul moment decorativ este camera 3D, ocazională, fără mișcare
permanentă. Mobile-native: safe areas, zoom permis, controale touch și hover gated.

Homepage: **4 blocuri** (hero, introducere, selecție de trei fotografii, rezervare).
Rute: `/`, `/casa/`, `/galerie/`, `/imprejurimi/`, `/contact/`, plus 404.

## Efecte și costuri

Estimările de mai jos sunt bugete de proiectare, nu rezultate de benchmark.

| Element | Loc exact | Sursă | Rol | Interacțiune | Cost estimat | Mobil / reduced-motion / fără WebGL |
|---|---|---|---|---|---|---|
| Relief 3D | Partea inferioară stângă a hero-ului, numai `/` | Geometrie procedurală Three.js; 3 suprafețe, aproximativ 30.720 triunghiuri | Adâncime discretă, interpretare artistică | Deplasare de cameră sub 0,3 unități la mouse, arc nativ stiffness 100/damping 10; oprire la stabilizare | 150–200 KB gzip JS, 3 mesh-uri, DPR max. 1,5, fără umbre/texturi | Poster static, fără import Three.js pe mobil/reduced-motion/save-data; fallback la eroare WebGL |
| Poster | Același container, imediat vizibil | Randare locală a aceleiași scene | Continuitate fără dependență de JS | Buton de comparare static/3D pe desktop | Câțiva KB WebP | Același conținut, fără călătorie de cameră |
| Lightbox | Numai `/galerie/` | Dialog HTML și TypeScript | Protejează focusul și mărește fotografia | Click, Escape, săgeți, swipe | JS mic; o fotografie mare la cerere | Controale de minimum 44 px, fără auto-advance |
| Tur video | `/galerie/#tur` | YouTube din sursa veche | Context suplimentar | Numai la click, alternativă link | Zero requesturi YouTube înainte de click; cost extern ulterior | Același comportament |

Fără efecte în conținutul de citit, rezervări, meniu, imagini de galerie sau
pagini interioare. Canvasul este `aria-hidden`, fără focus/pointer capture,
nu este fixed. Cleanup/dispose la navigare, pauză offscreen și tab ascuns.

## Verificare a propunerii

Strategie: site static fără backend/autentificare/DB; check Astro + build și
Playwright în Chromium. Nicio infrastructură Docker nu este necesară.
Originalul nu avea suită de teste. Patru fișiere de regresii acoperă navigarea,
galeria/video, scena și propagarea configurației. Fixture-urile sunt injectate
numai în browserul de test sau într-un build separat în `test-results/`.

- `npm run check`: 0 erori, avertismente sau hints.
- `npm run build`: succes, 6 pagini. Avertisment de dimensiune pentru chunk-ul
  Three.js, încărcat dinamic; nu a fost ascuns prin creșterea pragului.
- 23 teste Playwright: trecute, exit 0. Cinci rute la 1440, 768, 390, 320 px,
  acces direct/refresh, pagină activă, lipsa overflow-ului, încărcarea fotografiilor.
- Homepage măsurat: 1740 / 2005 / 2098 / 2194 px, în ordinea lățimilor de mai sus.
- Tab/Shift+Tab/Escape, focus restore, filtre persistate în URL, galerie
  goală/un singur element, imagini lipsă, swipe sintetic și nume lung.
- Fără JS: galerie și navigare prerandate; linkuri reale către fotografii.
- Reduced-motion, save-data, mobil, WebGL indisponibil și chunk 3D blocat:
  poster + conținut funcțional. Celelalte rute nu descarcă scena sau posterul.
- Oprirea la tab ascuns este testată prin eveniment de vizibilitate simulat.
  Swipe-ul este sintetic. **Nu sunt teste pe telefon fizic.**
- Zoom text 200% verificat automat; zoom-ul real al browserului și Safari
  pe dispozitive fizice rămân pentru finalizare.
- YouTube: verificată încărcarea la acțiune și unicitatea iframe-ului, cu
  răspuns extern substituit în test. Nu se pretinde redare reală end-to-end.
- Controlul de prepublicare se oprește intenționat cu exit 1 și enumeră
  datele lipsă; nu este un eșec ascuns și nu este un verdict de lansare.
- Schimbarea numelui și localității într-un build de test actualizează titlurile,
  header-ul, footer-ul, metadatele și titlul playerului video. Eliminarea
  listingurilor afișează un mesaj explicit, fără linkuri fictive. Câmpurile
  mock de contact rămân inactive. Sursele și build-ul servit nu sunt modificate
  de fixture.

Capturile before/after, contact sheets și măsurătorile locale sunt în
artefactele persistente ale sesiunii. Referințele sunt prezentate în conversație.
Datele juridice, toate afirmațiile, drepturile, redarea reală video și testele
pe hardware rămân neîncheiate. Aprobarea de design nu le validează implicit.

### Performanță măsurată local

Playwright Chromium headless, build static, 2026-10-28, cache nou pe context.
PerformanceObserver pentru LCP/CLS/long tasks; CDP pentru throttling. Nu este
Lighthouse, nu este măsurare pe telefon și nu prezice găzduirea finală.

| Condiție | LCP observat | CLS | Resurse transferate, fără document | Scenă |
|---|---:|---:|---:|---|
| 1440 px, localhost, fără throttling | 28 ms | 0,00078 | 690.805 bytes | 3D |
| 390 px, CPU 4×, download 1,6 Mbps, latență 150 ms | 484 ms | 0,06141 | 421.163 bytes | Statică |

Pe desktop a existat un long task de 167 ms în fereastra de încărcare a scenei.
WebGL a fost verificat prin SwiftShader, deci nu este un benchmark GPU real;
inițializarea și reacția pe hardware mai slab rămân de măsurat la finalizare.
Nu există buclă de randare permanentă.

Chunk-ul scenei: **529.551 bytes minificat / 130.410 bytes gzip calculat**.
Preview-ul local nu garantează compresia gzip; aceasta este mărimea comprimată
calculată, nu traficul observat. Loader: 3.367 / 1.613 bytes. Restul rutelor:
zero requesturi pentru scenă și poster, verificat în testul de rețea.

Contrast calculat pentru perechile de tokeni: text principal/alb 11,02:1;
text secundar/alb 6,20:1; text secundar/cer 5,74:1; alb/vișiniu 9,15:1.
Eticheta peste relief folosește aceeași cerneală mai închisă ca textul hero
(5,49:1 pe eșantionul de fundal mai închis evaluat). Nu se pretinde audit
automat complet de accesibilitate.

### Finisaje după aprobare

Structura, selecția foto și varianta mobilă au fost păstrate. Numai pe homepage:
colțuri 16/12 px, transparență graduală pe marginea de 6 px și tentă
alb-albăstruie de 2,5–3,5%, fără blur pe subiect. Relieful este mai vizibil
prin suprafață și opacitate, fără mișcare suplimentară. Nu s-au adăugat
dependențe pentru aceste efecte. Capturile după finisaje au fost reinspectate
la desktop, tabletă și mobil.
