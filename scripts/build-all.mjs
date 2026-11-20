// Builds every design into _site/<id>/, plus the gallery page and the earlier explorations.
//   npm run build                 (links start at /)
//   BASE=/repo-name/ npm run build (for a GitHub Pages project site)
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const BASE = (process.env.BASE || "/").replace(/\/?$/, "/");
const proposals = JSON.parse(fs.readFileSync("themes/proposals.json", "utf8"));

fs.rmSync("_site", { recursive: true, force: true });
for (const p of proposals) {
  console.log(`\n▸ ${p.name}`);
  execFileSync("npx", ["@11ty/eleventy", "--quiet", `--output=_site/${p.id}`, `--pathprefix=${BASE}${p.id}/`], {
    stdio: "inherit",
    env: { ...process.env, THEME: p.id },
  });
}
fs.cpSync("gallery", "_site", { recursive: true });
fs.cpSync("explorations", "_site/explorations", { recursive: true });
fs.writeFileSync("_site/.nojekyll", "");
console.log(`\nDone: ${proposals.length} designs in _site/ (base ${BASE})`);
