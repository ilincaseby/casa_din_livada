
# Casa din Livadă

Prima propunere de redesign este în [`site/`](site/): **Astro + TypeScript +
Tailwind CSS**, cu Three.js progresiv numai pe homepage.

**Statut: direcție aprobată, finisaje aplicate; publicare blocată de datele
neconfirmate.** Nu s-a făcut deploy. `site/` este singura sursă activă de
dezvoltare și build. Originalul static (`index.html`, `css/`, `js/`, `images/`)
este păstrat intact ca referință istorică; nu îl modifica în paralel cu
aplicația Astro. Arhivarea/ștergerea originalelor cere acord separat.
Vezi [deciziile aprobate](docs/design-approved.md).

## Pornire

Node compatibil cu `package.json` (testat aici cu Node 23.11.0 și npm 10.9.2;
pentru dezvoltare pe termen lung recomandat un Node LTS compatibil).

```sh
cd site
npm ci
npm run dev
```

Deschide adresa exactă afișată în terminal: Astro schimbă portul dacă este
ocupat. La această propunere preview-ul verificat rulează la
**http://127.0.0.1:4322/**, numai local.

```sh
npm run check
npm run build
npm run preview -- --port 4322
```

Preview-ul lăsat pornit poate fi oprit din `site/` cu:

```sh
npx astro preview stop
```

Pentru dev serverul pornit în terminal: `Ctrl+C`.

## Teste

```sh
cd site
npm run build
npm test
```

Testele pornesc propriul preview. Dacă există deja un preview Astro al acestui
proiect, folosește adresa lui verificată:

```sh
PREVIEW_URL=http://127.0.0.1:4322 npm test
```

Dacă lipsește Chromium, instalează-l cu `npx playwright install chromium`.
Nu există DB, backend, conturi, plăți sau CMS. Testele folosesc un browser,
nu servicii externe de rezervare. `CAPTURE_DIR=/cale/absoluta` salvează
capturile desktop/mobil din suita de navigare.

Măsurare locală reproductibilă (nu Lighthouse și nu benchmark pe telefon):

```sh
PREVIEW_URL=http://127.0.0.1:4322 npm run measure
```

Raportează LCP/CLS/long tasks în Chromium, desktop fără throttling și mobil
simulat cu CPU 4×/1,6 Mbps/150 ms, plus dimensiunile JS și gzip calculat.

## Unde modifici informațiile

- [`site/src/config/business.ts`](site/src/config/business.ts): nume,
  localitate, listinguri, video, contact, date juridice și statusul verificării.
  Nu activa destinații mock. Datele neconfirmate nu sunt exportate în JSON-LD.
- [`site/src/content/property.ts`](site/src/content/property.ts): spații,
  detalii practice de confirmat și surse pentru împrejurimi.
- [`site/src/content/selection.json`](site/src/content/selection.json):
  selecția fotografiilor, descrieri și categorii.
- [`site/src/pages/`](site/src/pages/): conținutul celor cinci rute.
- [`site/src/styles/global.css`](site/src/styles/global.css): tokeni Tailwind,
  layout și responsive.
- [`site/src/scripts/mountain.ts`](site/src/scripts/mountain.ts): geometria
  originală a reliefului. Este interpretare artistică, nu hartă topografică.

## Fotografii

1. Adaugă originalul în `images/`, fără să suprascrii fișiere existente.
2. Adaugă în `selection.json` un `id` unic, numele exact al fișierului în
   `source`, o descriere `alt` onestă și categoria.
3. Din `site/`, rulează `npm run media`.
4. Verifică imaginile și rulează `npm run check && npm run build`.

Scriptul refuză surse lipsă/ambigue și generează separat
`public/photos/*.webp` și `src/content/photos.json` (fișier generat).
Nu edita manual acest din urmă fișier. Nu mărește imaginile peste rezoluția
originală. Originalele nu sunt alterate.

Posterul montan este o randare WebP locală a scenei. Scenele și fotografiile
nu sunt trimise unor servicii externe. Fontul Manrope este self-hosted;
licența OFL este inclusă în pachetul Fontsource.

## Publicare — blocată în această etapă

```sh
cd site
npm run prepublish:check
```

Este normal să se încheie cu **exit 1** acum. Lipsesc confirmări pentru domeniu,
operator, contact, adresă, permisiuni media, video și detalii de cazare.
Preview-ul este `noindex, nofollow`; nu există JSON-LD cu mock-uri sau ratinguri.
Nu sunt suficiente eliminarea flagului preview ori completarea unei singure
valori: sunt necesare confirmările și aprobarea separată de publicare.

Directorul viitor de deploy este **`site/dist/`**, generat prin build, nu
rădăcina repository-ului și nici originalul static. Nu este configurat sau
autorizat niciun deploy.

Vezi [research-ul și limitele propunerii](docs/redesign-research.md) și
[inventarul complet al celor 61 de fotografii](docs/media-inventory.csv).
