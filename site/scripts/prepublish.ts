import { business, publicationBlockers } from "../src/config/business.ts";
import { toConfirm } from "../src/content/property.ts";

const issues = [...publicationBlockers(business), ...toConfirm.map((item) => `Afirmație de confirmat: ${item}`)];
if (issues.length) {
  console.error("PUBLICAREA ESTE BLOCATĂ:\n" + issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Nu au fost găsite blocaje în configurație. Este necesară aprobarea explicită de publicare.");
}
