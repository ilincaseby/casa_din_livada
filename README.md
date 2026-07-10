# Casa din Livadă · Predeluț, Bran

Site static de prezentare (HTML + CSS + JavaScript, fără build) pentru casa de vacanță
**Casa din Livadă** din Predeluț (lângă Bran), jud. Brașov. Gata de publicat pe **GitHub Pages**.

## Structură

```
alina_bran/
├─ index.html        # pagina principală
├─ css/style.css     # tot designul + animațiile
├─ js/main.js        # interacțiuni (galerie, lightbox, carusel etc.)
└─ images/           # (opțional) pozele tale locale
```

## Cum îl vezi local

Deschide `index.html` direct în browser (dublu-click), sau pornește un server simplu:

```bash
python3 -m http.server 8000
# apoi deschide http://localhost:8000
```

## Publicare pe GitHub Pages

1. Creează un repo nou pe GitHub (ex. `alina-bran`).
2. Urcă toate fișierele din acest folder în repo:
   ```bash
   git init
   git add .
   git commit -m "Site Casa din Livadă"
   git branch -M main
   git remote add origin https://github.com/UTILIZATOR/alina-bran.git
   git push -u origin main
   ```
3. În repo: **Settings → Pages → Build and deployment → Source: „Deploy from a branch"**,
   alege branch-ul `main` și folderul `/root`, apoi **Save**.
4. După un minut, site-ul e live la:
   `https://UTILIZATOR.github.io/alina-bran/`

## Ce trebuie personalizat (marcat în cod cu comentarii)

- **Poze**: momentan sunt imagini demo (stock) pe temă montană. Pune pozele reale în `images/`
  și înlocuiește `src`-urile din `index.html` (Airbnb/Booking nu permit descărcarea automată a pozelor).
- **Text**: nume, descrieri, facilități — direct în `index.html`.
- **Rezervări**: butoanele duc deja către anunțurile reale (Airbnb, Booking, TuristInfo).
- **Telefon/e-mail**: nu sunt încă puse — dacă vrei contact direct, adaugă-le în secțiunea „Rezervă" și în footer.
- **Tur video**: în `index.html`, atributul `data-video` de pe `.tour__player`.
- **Hartă**: `iframe`-ul din secțiunea „Locație" (setat deja pe coordonatele din Predeluț).

> Notă: dacă o poză nu se încarcă, se afișează automat o imagine substitut (nu rămân poze rupte).
