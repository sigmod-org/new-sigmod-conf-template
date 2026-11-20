// Eleventy build for the SIGMOD/PODS conference site.
// Editors never touch this file: they edit content/site.yml and content/pages/**/*.md.
// THEME picks the design (a folder in themes/). The default is "heritage".
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import { HtmlBasePlugin } from "@11ty/eleventy";

const THEME = process.env.THEME || "heritage";
// Per-design options from themes/proposals.json (e.g. "hubs": true builds an index page for each menu group).
const THEME_OPTS = (JSON.parse(fs.readFileSync("themes/proposals.json", "utf8")).find((p) => p.id === THEME) || {});
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
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { name, slug, side, short: (site.short_names || {})[name] || name, items: list, hrefs: flat(list).map((i) => i.href), first: flat(list).find((i) => !i.external), hub: `/${slug}/` };
  });
const left = toGroups(site.left_menu, "left");
const right = toGroups(site.right_menu, "right");
const nav = { left, right, all: [...left, ...right] };
const soon = nav.all.flatMap((g) => flat(g.items)).filter((i) => !i.exists && i.slug !== "home");

// First sentence or paragraph of a page, for section index cards.
function describe(item) {
  if (item.external) return "External site";
  if (!item.exists) return "Coming soon";
  const body = fs.readFileSync(`content/pages/${item.slug}.md`, "utf8").replace(/^---[\s\S]*?---/, "");
  const para = body.split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !/^(#|\{\{|>|\||\[|!)/.test(x));
  if (!para) return "";
  const text = para.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ");
  return text.length > 150 ? text.slice(0, 150).replace(/\s+\S*$/, "") + "…" : text;
}
const hubs = THEME_OPTS.hubs
  ? nav.all.map((g) => ({ ...g, cards: g.items.flatMap((i) => (i.children ? i.children.map((c) => ({ ...c, title: `${i.title}: ${c.title}` })) : [i])).map((i) => ({ ...i, text: describe(i) })) }))
  : [];

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
const AOE_TAG = `<abbr class="aoe" title="23:59 Anywhere on Earth (UTC−12)">AoE</abbr>`;
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
    return `<ul class="dlist">${rows.map(([l, v]) => `<li class="${dcls(v)}" ${dattr(v)}><span>${esc(l)}</span><time datetime="${span(v).a}">${fmt(v)} ${AOE_TAG}</time></li>`).join("")}</ul>`;
  const table = `<div class="tscroll wide-only"><table class="dates"><thead><tr><th></th>${t.rounds.map((r) => `<th scope="col">${esc(r)}</th>`).join("")}</tr></thead><tbody>${rows
    .map(([l, vals]) => `<tr><th scope="row">${esc(l)}</th>${vals.map((v) => `<td class="${dcls(v)}" ${dattr(v)}><span class="dd">${fmt(v)}</span> ${AOE_TAG}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
  const firstOpen = t.rounds.findIndex((_, i) => rows.some(([, vals]) => !isPast(vals[i])));
  const lists = `<div class="narrow-only rounds">${t.rounds
    .map((r, i) => `<details class="round"${i === firstOpen ? " open" : ""}><summary>${esc(r)}<small class="closed">closed</small></summary><ul class="dlist">${rows
      .map(([l, vals]) => `<li class="${dcls(vals[i])}" ${dattr(vals[i])}><span>${esc(l)}</span><time datetime="${span(vals[i]).a}">${fmt(vals[i])} ${AOE_TAG}</time></li>`)
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
  chairs: () => peopleList(Object.entries(site.people || {}).slice(0, 4)),
  people: () => peopleCards(Object.entries(site.people || {})),
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
    return `<li class="${dcls(m.v)}" ${dattr(m.v)}${hide ? " hidden" : ""}><span><a href="${hrefOf(m.page)}">${esc(shortTrack(m.track))}</a>${m.round ? " · " + esc(m.round) : ""}<br>${esc(m.label)}</span><time datetime="${span(m.v).a}">${fmt(m.v, false)} ${AOE_TAG}</time></li>`;
  });
  const note = site.dates_note ? `<p class="small upnote">${esc(site.dates_note_short || "Placeholder dates")}</p>` : "";
  return `<div class="upbox"><h2>${esc(title)}</h2>${note}<ul class="dlist compact" data-upcoming="${n}">${items.join("")}</ul><p class="none"${shown ? " hidden" : ""}>All submission deadlines have passed.</p><p class="small"><a href="/calls/dates/">All important dates</a> · 23:59 AoE</p></div>`;
}

/* ---------- deadline cards (style "cards") or just the next one (style "fact") ---------- */
function deadlines(n = 4, style = "cards") {
  let shown = 0;
  const items = all.map((m) => {
    const hide = isPast(m.v) || shown >= n;
    if (!hide) shown++;
    const { a } = span(m.v);
    const dt = day(a);
    return `<li ${dattr(m.v)}${hide ? " hidden" : ""}><a href="${hrefOf(m.page)}"><time datetime="${a}"><b>${fmt(m.v, false)}</b> ${dt.getFullYear()} · 23:59 ${AOE_TAG}</time><span class="dc-track">${esc(shortTrack(m.track))}${m.round ? " · " + esc(m.round) : ""}</span><span class="dc-label">${esc(m.label)}</span></a></li>`;
  });
  return `<ol class="dcards ${style}" data-upcoming="${n}">${items.join("")}</ol><p class="none"${shown ? " hidden" : ""}>All submission deadlines have passed.</p>`;
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
  eleventyConfig.addGlobalData("hubs", hubs);
  eleventyConfig.addGlobalData("theme", THEME);
  eleventyConfig.addGlobalData("layout", "base.njk");
  // content/pages/calls/dates.md → /calls/dates/ ; content/pages/home.md → /
  eleventyConfig.addGlobalData("permalink", () => (data) => {
    const stem = data.page.filePathStem.replace(/^\/pages/, "");
    return stem === "/home" ? "/" : `${stem}/`;
  });

  eleventyConfig.addPreprocessor("shortcodes", "md", (data, content) => applyShortcodes(content));

  eleventyConfig.addFilter("inline", inline);
  eleventyConfig.addFilter("groupOf", (url) => nav.all.find((g) => g.hrefs.includes(url) || (THEME_OPTS.hubs && g.hub === url)));
  eleventyConfig.addFilter("yearEm", (s) => esc(s).replace(/(\d{4})/, "<em>$1</em>"));
  eleventyConfig.addShortcode("upcoming", upcomingBox);
  eleventyConfig.addShortcode("deadlines", deadlines);
  // Give every <h2> an id, then list them ("On this page").
  const slugify = (t) => t.replace(/<[^>]+>/g, "").toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  eleventyConfig.addFilter("headingIds", (html = "") => String(html).replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => `<h2 id="${slugify(t)}">${t}</h2>`));
  eleventyConfig.addFilter("toc", (html = "") => [...String(html).matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, "") })));
  // Previous / next page within the same menu group.
  eleventyConfig.addFilter("neighbors", (url) => {
    const g = nav.all.find((x) => x.hrefs.includes(url));
    if (!g) return {};
    const list = flat(g.items).filter((i) => !i.external);
    const k = list.findIndex((i) => i.href === url);
    return { prev: list[k - 1], next: list[k + 1], group: g };
  });
  eleventyConfig.addShortcode("logo", logo);
  eleventyConfig.addShortcode("editPath", (inputPath) => inputPath.replace(/^\.\//, ""));

  // Pages listed in a menu whose file does not exist yet.
  eleventyConfig.addTemplate("virtual/soon.njk", `<p class="soon">This page will be published closer to the conference. See <a href="/calls/dates/">Important dates</a> for what is coming up.</p>`, {
    pagination: { data: "soon", size: 1, alias: "item" },
    permalink: (data) => data.item.href,
    eleventyComputed: { title: (data) => data.item.title },
    isSoon: true,
  });
  // Optional index page for each menu group (designs with "hubs": true).
  if (hubs.length)
    eleventyConfig.addTemplate("virtual/hub.njk", `<ul class="hubcards">{% for c in hub.cards %}<li><a href="{{ c.href }}"><b>{{ c.title }}{% if c.external %} ↗{% endif %}</b>{% if c.isNew %} <span class="new">new</span>{% endif %}<span{% if not c.exists %} class="soonline"{% endif %}>{{ c.text }}</span></a></li>{% endfor %}</ul>`, {
      pagination: { data: "hubs", size: 1, alias: "hub" },
      permalink: (data) => data.hub.hub,
      eleventyComputed: { title: (data) => data.hub.name },
      isSoon: true,
      isHub: true,
    });
  eleventyConfig.addTemplate("virtual/404.njk", `<p>We couldn't find this page. Go back to the <a href="/">homepage</a>.</p>`, {
    permalink: "/404.html",
    title: "Page not found",
    isSoon: true,
  });

  // Theme files and shared assets.
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ [`themes/${THEME}/style.css`]: "assets/theme.css" });
  eleventyConfig.addPassthroughCopy({ "themes/_shared/base.css": "assets/base.css" });
  eleventyConfig.addPassthroughCopy({ "themes/_shared/site.js": "assets/site.js" });
  eleventyConfig.addWatchTarget("themes/");
  eleventyConfig.addWatchTarget("content/site.yml");

  return {
    dir: { input: "content", includes: "../themes", layouts: `../themes/${THEME}`, output: "_site" },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
