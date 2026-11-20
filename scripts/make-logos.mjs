// Regenerates assets/logos/{sigmod-pods,sigmod-pods-oval,acm,acm-white,acm-mark}.svg and the PNG exports.
// Lettering is outlined from Open Sans and Inter (SIL Open Font License), so the files need no fonts.
// Run outside the site build:
//   npm install --no-save opentype.js@1 @resvg/resvg-js@2 @fontsource/open-sans@5 @fontsource/inter@5
//   node scripts/make-logos.mjs assets/logos

// Redraws the SIGMOD/PODS tile (2027.sigmod.org/img27/logos/sigmod.png, 148x73) and the ACM logo
// as clean SVGs with outlined lettering (Open Sans / Inter, both SIL OFL), plus high-res PNGs.
import fs from "node:fs";
import opentype from "opentype.js";
import { Resvg } from "@resvg/resvg-js";

const OUT = process.argv[2];
const F = (p) => opentype.loadSync(`node_modules/@fontsource/${p}`);
const openSans = F("open-sans/files/open-sans-latin-400-normal.woff");
const openSansBold = F("open-sans/files/open-sans-latin-700-normal.woff");
const inter = F("inter/files/inter-latin-500-normal.woff");

// Outline `text` so its cap height (or x-height) equals `h`, centred on cx (or starting at x), baseline at y.
function textPath(font, text, { h, y, cx, x, ref = "H", spacing = 0 }) {
  const size = 1000;
  const refBox = font.getPath(ref, 0, 0, size).getBoundingBox();
  const k = h / -refBox.y1;
  const p = font.getPath(text, 0, 0, size, { letterSpacing: spacing });
  const b = p.getBoundingBox();
  const w = (b.x2 - b.x1) * k;
  const ox = cx !== undefined ? cx - w / 2 - b.x1 * k : x - b.x1 * k;
  const d = font.getPath(text, 0, 0, size * k, { letterSpacing: spacing }).toPathData(2);
  return { d, ox, y, w };
}
const g = (t, fill) => `<path transform="translate(${t.ox.toFixed(2)} ${t.y})" fill="${fill}" d="${t.d}"/>`;

/* ---------- SIGMOD / PODS ---------- */
const C = { bg: "#4b7bb9", light: "#9cc4ea", dark: "#0a2a6e", text: "#ffffff" };
const wave = "M7 37.6 C14 47.2 24 51.2 36 50.6 C52 50 70 40.2 90 35.6 C104 32.4 120 33 143 42.6";
const sig = textPath(openSans, "SIGMOD", { h: 10, y: 36.9, cx: 51, spacing: 0.02 });
const pods = textPath(openSans, "PODS", { h: 10, y: 56.4, cx: 97.4, spacing: 0.02 });
const ovalDefs = (id) => `<defs>
    <clipPath id="${id}-l"><ellipse cx="74.3" cy="41.5" rx="66.3" ry="27.6"/></clipPath>
    <mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="148" height="73"><rect width="148" height="73" fill="#fff"/><path d="${wave}" fill="none" stroke="#000" stroke-width="2.1"/></mask>
  </defs>`;
const oval = (id) => `<g mask="url(#${id}-m)">
    <path clip-path="url(#${id}-l)" fill="${C.dark}" d="${wave} L148 73 L0 73 Z"/>
    <path clip-path="url(#${id}-l)" fill="${C.light}" d="${wave} L148 0 L0 0 Z"/>
  </g>
  ${g(sig, C.text)}
  ${g(pods, C.text)}`;
const sigTile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 148 73" width="592" height="292">
  <title>ACM SIGMOD/PODS</title>
  ${ovalDefs("sp")}
  <rect width="148" height="73" fill="${C.bg}"/>
  ${oval("sp")}
</svg>
`;
const sigOval = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="7 13 134.6 57" width="538" height="228">
  <title>ACM SIGMOD/PODS</title>
  ${ovalDefs("so")}
  ${oval("so")}
</svg>
`;

/* ---------- ACM (after sigmod.org/assets/logo/acm.png, 320x112) ---------- */
const interSemi = F("inter/files/inter-latin-600-normal.woff");
function fitWidth(font, text, { w, y, cx, spacing = 0 }) {
  const t = textPath(font, text, { h: 10, y, cx, ref: "x", spacing });
  return textPath(font, text, { h: (10 * w) / t.w, y, cx, ref: "x", spacing });
}
const acmLetters = fitWidth(openSansBold, "acm", { w: 49, y: 63.8, cx: 55.5, spacing: -0.01 });
const acmMarkBody = (id) => `<defs>
    <linearGradient id="${id}-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#78c6e7"/><stop offset="1" stop-color="#1a9ed6"/></linearGradient>
    <linearGradient id="${id}-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1499d3"/><stop offset="1" stop-color="#86cbe9"/></linearGradient>
  </defs>
  <path fill="url(#${id}-d)" d="M55.5 1 L110.5 56 L55.5 111 L0.5 56 Z"/>
  <circle cx="55.5" cy="56" r="35" fill="#fff"/>
  <circle cx="55.5" cy="56" r="29.4" fill="url(#${id}-c)"/>
  ${g(acmLetters, "#fff")}`;
const t1 = textPath(interSemi, "Association for", { h: 13.4, y: 51.4, x: 120 });
const t2 = textPath(interSemi, "Computing Machinery", { h: 13.4, y: 74.6, x: 120 });
const acmW = Math.ceil(120 + Math.max(t1.w, t2.w) + 2);
const acmLockup = (color, id) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${acmW} 112" width="${acmW * 2}" height="224">
  <title>ACM, Association for Computing Machinery</title>
  ${acmMarkBody(id)}
  ${g(t1, color)}
  ${g(t2, color)}
</svg>
`;
const acmFull = acmLockup("#3b4048", "a");
const acmWhite = acmLockup("#ffffff", "w");
const acmMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111 112" width="222" height="224">
  <title>ACM</title>
  ${acmMarkBody("m")}
</svg>
`;

const files = { "sigmod-pods.svg": sigTile, "sigmod-pods-oval.svg": sigOval, "acm.svg": acmFull, "acm-white.svg": acmWhite, "acm-mark.svg": acmMark };
for (const [n, s] of Object.entries(files)) fs.writeFileSync(`${OUT}/${n}`, s);
const png = (svg, w, name) => fs.writeFileSync(`${OUT}/${name}`, new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng());
png(sigTile, 1184, "sigmod-pods@8x.png");
png(sigTile, 592, "sigmod-pods@4x.png");
png(acmFull, acmW * 4, "acm@4x.png");
png(acmWhite, acmW * 4, "acm-white@4x.png");
console.log("acm width", acmW, Object.keys(files).map((n) => `${n} ${files[n].length}B`).join(", "));
