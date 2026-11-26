// Eleventy build for the SIGMOD/PODS conference site.
// Editors never touch this file: they edit content/site.yml and content/pages/**/*.md.
// The page layout, stylesheet and script are in theme/.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import { HtmlBasePlugin } from "@11ty/eleventy";

// Deadlines close at 23:59 Anywhere on Earth (AoE, UTC−12). TODAY=YYYY-MM-DD previews a day (noon AoE).
const AOE = "-12:00";
const TODAY = process.env.TODAY ? new Date(process.env.TODAY + "T12:00:00" + AOE) : new Date();
const md = markdownIt({ html: true });

const site = yaml.load(fs.readFileSync("content/site.yml", "utf8"), { schema: yaml.CORE_SCHEMA });
const conf = site.conference;
const highlight = new Set(site.highlight || []);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const inline = (s) => md.renderInline(String(s ?? ""));

/* ---------- menus ---------- */
const isExternal = (v) => /^https?:/.test(v);
const hrefOf = (slug) => (isExternal(slug) ? slug : slug === "home" ? "/" : `/${slug}/`);
const pageExists = (slug) => fs.existsSync(`content/pages/${slug}.md`);
const toItems = (obj) =>
  Object.entries(obj || {}).map(([title, v]) =>
    v && typeof v === "object"
      ? { title, children: toItems(v) }
      : { title, slug: String(v), href: hrefOf(String(v)), external: isExternal(String(v)), isNew: highlight.has(String(v)), exists: isExternal(String(v)) || pageExists(String(v)) });
const flat = (items) => items.flatMap((i) => (i.children ? flat(i.children) : [i]));
const toGroups = (menu, side) =>
  Object.entries(menu || {}).map(([name, items]) => {
    const list = toItems(items);
    return { name, side, short: (site.short_names || {})[name] || name, items: list, hrefs: flat(list).map((i) => i.href), first: flat(list).find((i) => !i.external) };
  });
const left = toGroups(site.left_menu, "left");
const right = toGroups(site.right_menu, "right");
const nav = { left, right, all: [...left, ...right] };
const soon = nav.all.flatMap((g) => flat(g.items)).filter((i) => !i.exists && i.slug !== "home");

/* ---------- dates ---------- */
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const span = (v) => { const [a, b] = String(v).split(/\s+to\s+/); return { a, b: b || a }; };
const day = (s) => new Date(s + "T00:00:00");
const fmt = (v, withYear = true) => {
  const { a, b } = span(v), x = day(a), y = day(b);
  const yr = withYear ? `, ${y.getFullYear()}` : "";
  // Non-breaking space keeps "Jan 10" together; a long date may still wrap before the year.
  if (a === b) return `${MON[x.getMonth()]}\u00a0${x.getDate()}${yr}`;
  return `${MON[x.getMonth()]}\u00a0${x.getDate()}–${x.getMonth() === y.getMonth() ? "" : MON[y.getMonth()] + "\u00a0"}${y.getDate()}${yr}`;
};
const isPast = (v) => new Date(span(v).b + "T23:59:00" + AOE) < TODAY;
const all = [];
for (const t of site.important_dates || [])
  for (const [label, val] of Object.entries(t.dates))
    (Array.isArray(val) ? val : [val]).forEach((v, i) => all.push({ v, label, track: t.track, round: t.rounds && t.rounds[i], page: t.page }));
all.sort((m, n) => day(span(m.v).a) - day(span(n.v).a));
const nextV = (all.find((m) => !isPast(m.v)) || {}).v;
// data-d / data-e let assets/site.js recompute past/next in the browser, so the page stays right between builds.
const dattr = (v) => { const { a, b } = span(v); return `data-d="${a}" data-e="${b}"`; };
const dcls = (v) => (isPast(v) ? "past" : v === nextV ? "next" : "");
const shortTrack = (t) => t.replace(" research papers", "").replace(" track", "");

function datesFor(t) {
  const rows = Object.entries(t.dates);
  if (!t.rounds)
    return `<ul class="dlist">${rows.map(([l, v]) => `<li class="${dcls(v)}" ${dattr(v)}><span>${esc(l)}</span><time datetime="${span(v).a}">${fmt(v)}</time></li>`).join("")}</ul>`;
  const table = `<div class="tscroll wide-only"><table class="dates"><thead><tr><th></th>${t.rounds.map((r) => `<th scope="col">${esc(r)}</th>`).join("")}</tr></thead><tbody>${rows
    .map(([l, vals]) => `<tr><th scope="row">${esc(l).replace(/\//g, "/<wbr>")}</th>${vals.map((v) => `<td class="${dcls(v)}" ${dattr(v)}><span class="dd">${span(v).a === span(v).b ? fmt(v).replace(", ", ",\u00a0") : fmt(v)}</span></td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
  const firstOpen = t.rounds.findIndex((_, i) => rows.some(([, vals]) => !isPast(vals[i])));
  const lists = `<div class="narrow-only rounds">${t.rounds
    .map((r, i) => `<details class="round"${i === firstOpen ? " open" : ""}><summary>${esc(r)}<small class="closed">closed</small></summary><ul class="dlist">${rows
      .map(([l, vals]) => `<li class="${dcls(vals[i])}" ${dattr(vals[i])}><span>${esc(l)}</span><time datetime="${span(vals[i]).a}">${fmt(vals[i])}</time></li>`)
      .join("")}</ul></details>`)
    .join("")}</div>`;
  return table + lists;
}

/* ---------- shortcodes that editors can put in Markdown, each on its own line ---------- */
const person = (p) => { const m = String(p).match(/^(.*?)\s*\((.*)\)\s*$/); return m ? `${esc(m[1])} <small>${esc(m[2])}</small>` : esc(p); };
// Organizer photos: assets/people/<first-last>.jpg (square). Missing photo → initials.
const personSlug = (n) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function personCard(p) {
  const m = String(p).match(/^(.*?)\s*\((.*)\)\s*$/);
  const name = m ? m[1] : String(p), aff = m ? m[2] : "";
  const file = `assets/people/${personSlug(name)}.jpg`;
  const initials = name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c)).slice(0, 2).join("").toUpperCase();
  const pic = fs.existsSync(file)
    ? `<img src="/${file}" alt="" width="80" height="80" loading="lazy">`
    : `<span class="pinit" aria-hidden="true">${esc(initials)}</span>`;
  return `<li>${pic}<span><b>${esc(name)}</b>${aff ? `<small>${esc(aff)}</small>` : ""}</span></li>`;
}
const peopleCards = (entries) => `<div class="org">${entries.map(([r, ps]) => `<section class="org-role"><h3>${esc(r)}</h3><ul class="pcards">${[].concat(ps).map(personCard).join("")}</ul></section>`).join("")}</div>`;
// site.people is grouped by organizers page (Conference, SIGMOD, PODS); a flat list also works.
const peopleSections = (() => {
  const ppl = site.people || {};
  const flatList = Object.values(ppl).every((v) => Array.isArray(v) || typeof v === "string");
  return flatList ? { Conference: ppl } : ppl;
})();
const allRoles = Object.values(peopleSections).flatMap((sec) => Object.entries(sec || {}));
// Homepage chairs: roles listed in homepage_chairs (matched by the start of the role name).
const homepageRoles = () => {
  const want = site.homepage_chairs;
  if (!want) return allRoles.slice(0, 4);
  return want.flatMap((w) => allRoles.filter(([r]) => r.toLowerCase().startsWith(String(w).toLowerCase())));
};
const peopleList = (entries) => `<dl class="people">${entries.map(([r, ps]) => `<div><dt>${esc(r)}</dt>${[].concat(ps).map((p) => `<dd>${person(p)}</dd>`).join("")}</div>`).join("")}</dl>`;
const shortcodes = {
  dates: (arg) => {
    const note = site.dates_note ? `<p class="datesnote">${inline(site.dates_note)}</p>` : "";
    const tracks = (site.important_dates || []).filter((t) => !arg || t.track.toLowerCase() === arg.toLowerCase());
    if (!tracks.length) return `<p class="warn">No dates found for "${esc(arg)}".</p>`;
    if (arg) return `<div class="dates-block">${note}${tracks.map(datesFor).join("")}</div>`;
    return `<div class="dates-block">${note}${tracks.map((t) => `<section class="track"><h2 id="${t.track.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${esc(t.track)}</h2>${datesFor(t)}${t.page ? `<p class="callink"><a href="${hrefOf(t.page)}">Read the call →</a></p>` : ""}</section>`).join("")}</div>`;
  },
  news: () => `<ul class="news">${(site.news || []).map((n) => `<li>${inline(n)}</li>`).join("")}</ul>`,
  chairs: () => peopleList(homepageRoles()),
  // {{people}} = everyone; {{people: SIGMOD}} = one group from site.yml
  people: (arg) => {
    if (!arg) return peopleCards(allRoles);
    const key = Object.keys(peopleSections).find((k) => k.toLowerCase() === arg.toLowerCase());
    return key ? peopleCards(Object.entries(peopleSections[key] || {})) : `<p class="warn">No people group "${esc(arg)}" in site.yml.</p>`;
  },
  sponsors: () => {
    const tiers = Object.entries(site.sponsors || {}).filter(([, s]) => s && Object.keys(s).length);
    if (!tiers.length) return `<p class="soon">Sponsors will be announced here. Interested in supporting SIGMOD/PODS ${esc(conf.year)}? See <a href="/org/sponsor-opportunities/">Sponsor Opportunities</a>.</p>`;
    return tiers.map(([tier, s]) => `<h3>${esc(tier)}</h3><p class="sponsors">${Object.entries(s).map(([n, u]) => `<a href="${esc(u)}">${esc(n)}</a>`).join("")}</p>`).join("");
  },
};
const applyShortcodes = (text) =>
  text.replace(/^[ \t]*\{\{\s*(\w+)\s*(?::\s*([^}]*?))?\s*\}\}[ \t]*$/gm, (_, name, arg) =>
    "\n" + (shortcodes[name] ? shortcodes[name](arg) : `<p class="warn">Unknown shortcode: ${esc(name)}</p>`) + "\n");

/* ---------- the upcoming-dates box (all milestones; the browser hides past ones) ---------- */
function upcomingBox(n = 4, title = "Upcoming dates") {
  let shown = 0;
  const items = all.map((m) => {
    const hide = isPast(m.v) || shown >= n;
    if (!hide) shown++;
    return `<li class="${dcls(m.v)}" ${dattr(m.v)}${hide ? " hidden" : ""}><span><span class="nowrap"><a href="${hrefOf(m.page)}">${esc(shortTrack(m.track))}</a>${m.round ? " · " + esc(m.round) : ""}</span><br>${esc(m.label)}</span><time datetime="${span(m.v).a}">${fmt(m.v, false)}</time></li>`;
  });
  const note = site.dates_note ? `<p class="small upnote">${esc(site.dates_note_short || "Placeholder dates")}</p>` : "";
  return `<div class="upbox"><h2>${esc(title)}</h2>${note}<ul class="dlist compact" data-upcoming="${n}">${items.join("")}</ul><p class="none"${shown ? " hidden" : ""}>All submission deadlines have passed.</p><p class="small"><a href="/calls/dates/">All important dates</a> · 23:59 AoE</p></div>`;
}

/* ---------- logo, inlined so it stays crisp and can appear twice on a page ---------- */
function logo(suffix = "a") {
  const file = conf.logo || "assets/logos/sigmod-pods-oval.svg";
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf8").replace(/<\?xml[^>]*>/, "").replace(/<title>[^<]*<\/title>/, "").replace(/ width="\d+" height="\d+"/, "")
    .replace(/id="([^"]+)"/g, `id="$1-${suffix}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${suffix})`).replace("<svg", `<svg role="img" aria-label="ACM SIGMOD/PODS"`);
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addGlobalData("site", site);
  eleventyConfig.addGlobalData("conf", conf);
  eleventyConfig.addGlobalData("nav", nav);
  eleventyConfig.addGlobalData("soon", soon);
  eleventyConfig.addGlobalData("layout", "base.njk");
  // content/pages/calls/dates.md → /calls/dates/ ; content/pages/home.md → /
  eleventyConfig.addGlobalData("permalink", () => (data) => {
    const stem = data.page.filePathStem.replace(/^\/pages/, "");
    return stem === "/home" ? "/" : `${stem}/`;
  });

  eleventyConfig.addPreprocessor("shortcodes", "md", (data, content) => applyShortcodes(content));

  eleventyConfig.addFilter("inline", inline);
  eleventyConfig.addFilter("groupOf", (url) => nav.all.find((g) => g.hrefs.includes(url)));
  eleventyConfig.addFilter("yearEm", (s) => esc(s).replace(/(\d{4})/, "<em>$1</em>"));
  eleventyConfig.addShortcode("upcoming", upcomingBox);
  eleventyConfig.addShortcode("logo", logo);
  eleventyConfig.addShortcode("editPath", (inputPath) => inputPath.replace(/^\.\//, ""));

  // Pages listed in a menu whose file does not exist yet.
  eleventyConfig.addTemplate("virtual/soon.njk", `<p class="soon">This page will be published closer to the conference. See <a href="/calls/dates/">Important dates</a> for what is coming up.</p>`, {
    pagination: { data: "soon", size: 1, alias: "item" },
    permalink: (data) => data.item.href,
    eleventyComputed: { title: (data) => data.item.title },
    isSoon: true,
  });
  eleventyConfig.addTemplate("virtual/404.njk", `<p>We couldn't find this page. Go back to the <a href="/">homepage</a>.</p>`, {
    permalink: "/404.html",
    title: "Page not found",
    isSoon: true,
  });

  // Theme files and shared assets.
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ "theme/style.css": "assets/style.css" });
  eleventyConfig.addPassthroughCopy({ "theme/site.js": "assets/site.js" });
  eleventyConfig.addWatchTarget("theme/");
  eleventyConfig.addWatchTarget("content/site.yml");

  return {
    dir: { input: "content", includes: "../theme", layouts: "../theme", output: "_site" },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
