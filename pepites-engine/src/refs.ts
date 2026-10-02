import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface DesignerRef {
  name: string;
  era: string;
  families: string[];
  editors: string[];
  signatureDetails: string[];
  priceSignal: string;
}

let cache: DesignerRef[] | null = null;

export function loadRefs(): DesignerRef[] {
  if (cache) return cache;
  const here = path.dirname(fileURLToPath(import.meta.url));
  // dist/refs.js → ../refs/designers.json (copié hors de src pour rester éditable)
  const file = path.resolve(here, "..", "refs", "designers.json");
  cache = JSON.parse(fs.readFileSync(file, "utf-8")) as DesignerRef[];
  return cache;
}

export function refsForFamily(family: string, max = 8): DesignerRef[] {
  const all = loadRefs();
  const hits = all.filter((r) => r.families.includes(family));
  return (hits.length > 0 ? hits : all).slice(0, max);
}

export function refsAsPromptBlock(refs: DesignerRef[]): string {
  return refs
    .map(
      (r) =>
        `- ${r.name} (${r.era}) — éditeurs : ${r.editors.join(", ") || "n/a"} — détails authentifiants : ${r.signatureDetails.join(" ; ")} — cote : ${r.priceSignal}`,
    )
    .join("\n");
}
