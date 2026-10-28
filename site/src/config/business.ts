export type Verification = "confirmat" | "existent-neverificat" | "inferred" | "de confirmat";

interface Source {
  status: Verification;
  source: string;
  checkedAt: string;
}

interface Listing extends Source {
  label: string;
  url: string;
}

interface Business {
  name: string;
  mode: "preview" | "production";
  siteUrl: string | null;
  location: { village: string; area: string; county: string; status: Verification };
  address: string | null;
  coordinates: { latitude: number; longitude: number } | null;
  legal: { name: string; cui: string | null };
  contact: { email: string; phone: string | null; verified: boolean };
  listings: Listing[];
  video: { url: string; embedUrl: string; title: string } & Source;
  media: { localPreviewPermitted: boolean; publicationRightsConfirmed: boolean; source: string };
}

export const business: Business = {
  name: "Casa din Livadă",
  mode: "preview",
  siteUrl: null,
  location: { village: "Predeluț", area: "Bran", county: "Brașov", status: "confirmat" },
  address: null,
  coordinates: null,
  legal: { name: "DEMO - firma de completat", cui: null },
  contact: { email: "contact@example.com", phone: null, verified: false },
  listings: [
    {
      label: "Airbnb",
      url: "https://www.airbnb.com/rooms/31561912",
      status: "confirmat",
      source: "Identitatea listingului confirmată de utilizator în formular; detaliile nu au fost accesibile automat.",
      checkedAt: "2026-10-28",
    },
    {
      label: "Booking.com",
      url: "https://www.booking.com/hotel/ro/casa-din-livada-predelut.ro.html",
      status: "confirmat",
      source: "Identitatea listingului confirmată de utilizator în formular; verificarea automată blocată de WAF.",
      checkedAt: "2026-10-28",
    },
  ],
  video: {
    url: "https://www.youtube.com/watch?v=QKQ7DnCwRoc",
    embedUrl: "https://www.youtube-nocookie.com/embed/QKQ7DnCwRoc",
    title: "Casa din Livada- Predeluț Brasov",
    status: "existent-neverificat",
    source: "Titlul și identitatea geografică verificate prin YouTube oEmbed; conținutul integral nu a fost verificat.",
    checkedAt: "2026-10-28",
  },
  media: {
    localPreviewPermitted: true,
    publicationRightsConfirmed: false,
    source: "Fotografii din proiectul original; utilizatorul a confirmat folosirea în propunerea locală.",
  },
};

export const locationLabel = `${business.location.village} · ${business.location.area}`;
export const verifiedListings = business.listings.filter((listing) => listing.status === "confirmat");
export const platformLabel = new Intl.ListFormat("ro", { type: "disjunction" }).format(verifiedListings.map((listing) => listing.label));
export const mapsUrl = business.coordinates
  ? `https://www.google.com/maps/search/?api=1&query=${business.coordinates.latitude},${business.coordinates.longitude}`
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.location.village}, ${business.location.area}, ${business.location.county}`)}`;

export function publicationBlockers(config: Business): string[] {
  const issues: string[] = [];
  if (config.mode !== "production") issues.push("Modul preview/noindex este activ.");
  if (!config.siteUrl) issues.push("Domeniul public nu este confirmat.");
  if (config.legal.name.startsWith("DEMO") || !config.legal.cui) issues.push("Identitatea juridică este incompletă.");
  if (!config.address) issues.push("Adresa și instrucțiunile de acces trebuie confirmate.");
  if (!config.contact.verified) issues.push("Contactul direct nu este verificat.");
  if (!config.media.publicationRightsConfirmed) issues.push("Drepturile de publicare a fotografiilor trebuie confirmate.");
  if (!config.listings.some((listing) => listing.status === "confirmat")) issues.push("Lipsește o platformă de rezervare confirmată.");
  if (config.listings.some((listing) => listing.status !== "confirmat")) issues.push("Există listinguri neverificate.");
  if (config.video.status !== "confirmat") issues.push("Conținutul integral și permisiunea turului video trebuie confirmate.");
  return issues;
}
