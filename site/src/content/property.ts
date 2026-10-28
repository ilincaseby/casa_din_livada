import type { Verification } from "../config/business";

export const practicalDetails: { label: string; detail: string; status: Verification }[] = [
  { label: "Dormitoare", detail: "Paturi duble, mobilier din lemn și lumină naturală.", status: "confirmat" },
  { label: "Spații comune", detail: "Living, zonă de luat masa și spații de bucătărie.", status: "confirmat" },
  { label: "Afară", detail: "Livadă, foișor cu masă, grătar zidit și leagăn.", status: "confirmat" },
  { label: "Băi", detail: "Fotografii ale băilor și cabinelor de duș în galeria casei.", status: "confirmat" },
];

export const toConfirm = [
  "Capacitatea pentru adulți și copii și configurația exactă a dormitoarelor și băilor.",
  "Wi-Fi, parcarea, echipamentele disponibile și condițiile de folosire.",
  "Acceptarea animalelor de companie, orele de sosire și plecare și regulile casei.",
  "Starea ultimului segment de drum și recomandările de acces pe timp de iarnă.",
];

export const destinations = [
  { name: "Castelul Bran", title: "O zi pentru istorie.", description: "Consultă programul de vizitare, expozițiile și biletele direct pe site-ul Castelului Bran.", url: "https://bran-castle.com/", label: "Site-ul Castelului Bran", type: "Cultură" },
  { name: "Piatra Craiului", title: "Muntele, în ritmul tău.", description: "Administrația Parcului Național Piatra Craiului publică informații despre vizitare și regulile ariei protejate. Alege traseul după experiență și condițiile zilei.", url: "https://www.pcrai.ro/", label: "Parcul Național Piatra Craiului", type: "Natură" },
  { name: "Bucegi", title: "Pregătește ieșirea în natură.", description: "Descoperă informațiile administrației Parcului Natural Bucegi despre atracții și vizitare înainte de a porni la drum.", url: "https://bucegipark.ro/ro/", label: "Parcul Natural Bucegi", type: "Natură" },
];
