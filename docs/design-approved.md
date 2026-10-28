# Direcție aprobată — Casa din Livadă

**28 octombrie 2026.** Utilizatorul a ales explicit „Aprob direcția pentru
finalizare”, după inspectarea propunerii funcționale.

## Decizii aprobate

- Concept: „Casa dintre livadă și cer”, fotografiile autentice drept protagonist.
- Cinci rute: homepage, casa, galerie, împrejurimi, contact.
- Homepage compact, patru blocuri. Feedback: „nu, e frumos așa” la întrebarea
  despre schimbarea structurii.
- Mobil și selecție de fotografii: „e bun”.
- Paletă minerală, Manrope, accent vișiniu, conținut fără cifre sau recenzii
  neverificate, rezervări pe platforme externe.
- Galerie cu filtre și dialog, fără mișcare automată.

## Finisaje cerute odată cu aprobarea

1. Numai fotografiile de pe homepage: colțuri puțin rotunjite, margini
   estompate spre fundal și o tentă alb-albăstruie **extrem de subtilă**.
   Implementare: rază 16 px desktop / 12 px mobil, estompare locală la margine,
   strat de culoare de 2,5–3,5%; fără blur pe subiectul fotografiei.
2. Relief mai vizibil: suprafață decorativă mai mare și opacitate crescută.
   Nu se amplifică mișcarea camerei și nu se extinde efectul pe alte rute.

## Capturile direcției aprobate, înainte de finisaje

- [Desktop](approved-home-desktop.png)
- [Mobil](approved-home-mobile.png)

Acestea păstrează starea văzută la aprobare. Capturile actualizate după finisaje
sunt livrate separat în conversație; nu sunt prezentate retroactiv drept
imagini aprobate individual.

## Sursa activă și build

**`site/` este singura rădăcină activă de dezvoltare și build.**
Stack: Astro + TypeScript + Tailwind CSS; Three.js încărcat dinamic numai în hero.
Director de deploy: **`site/dist/`**.

Originalele statice rămân intacte ca referință istorică, nu a doua implementare
activă. Nu au fost arhivate, șterse sau adaptate în paralel.

## Efecte acceptate și limite

Relief procedural cu perspectivă/lumină, interpretare artistică, fără pretenție
topografică. Mișcare mică la mouse, pauză offscreen/tab ascuns, cleanup.
Poster pe mobil/reduced-motion/save-data/fără WebGL. Fără canvas fixed, alte
scene 3D, animații la scroll sau blur permanent pe fotografii.

**Aprobarea nu autorizează deploy, commit sau ștergerea originalelor.**
Nu confirmă implicit date juridice, coordonate, politici, capacități sau
drepturi de publicare. Blocajele de prepublicare rămân active.
