/*
 * SIGMOD/PODS "heritage" template: renderer.
 * Editors never touch this file. They edit content/site.yml and content/pages/*.md.
 * (In production the same files would be pre-rendered by a static site generator.)
 */
(async function () {
  const q = new URLSearchParams(location.search);
  const pageId = (q.get("p") || "home").replace(/[^a-z0-9\-\/]/gi, "");
  const TODAY = q.get("today") ? new Date(q.get("today") + "T12:00:00") : new Date();
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const md = (s) => marked.parse(String(s));
  const mdInline = (s) => marked.parseInline(String(s));

  /* ---------- settings ---------- */
  const site = jsyaml.load(await fetch("content/site.yml").then((r) => r.text()), { schema: jsyaml.CORE_SCHEMA });
  const conf = site.conference;
  document.documentElement.style.setProperty("--accent", conf.accent_color || "#0f766e");
  const highlight = new Set(site.highlight || []);

  const isExternal = (h) => /^https?:/.test(h);
  const href = (h) => (isExternal(h) ? h : `?p=${h}`);
  // A group is { name, items: [{ title, page } | { title, children: [...] }] }
  const toItems = (obj) => Object.entries(obj || {}).map(([title, v]) =>
    v && typeof v === "object" ? { title, children: toItems(v) } : { title, page: String(v) });
  const toGroups = (menu) => Object.entries(menu || {}).map(([name, items]) => ({ name, items: toItems(items) }));
  const leftGroups = toGroups(site.left_menu), rightGroups = toGroups(site.right_menu);
  const allGroups = [...leftGroups, ...rightGroups];
  const flat = (items) => items.flatMap((i) => (i.children ? flat(i.children) : [i]));
  const group = allGroups.find((g) => flat(g.items).some((i) => i.page === pageId));
  const menuItem = group && flat(group.items).find((i) => i.page === pageId);

  /* ---------- dates ---------- */
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const toDate = (s, endOfDay) => new Date(s + (endOfDay ? "T23:59:00" : "T00:00:00"));
  const span = (v) => { const [a, b] = String(v).split(/\s+to\s+/); return { a, b: b || a }; };
  const fmt = (v, withYear = true) => {
    const { a, b } = span(v), x = toDate(a), y = toDate(b);
    const yr = withYear ? `, ${y.getFullYear()}` : "";
    if (a === b) return `${MON[x.getMonth()]} ${x.getDate()}${yr}`;
    return `${MON[x.getMonth()]} ${x.getDate()}–${x.getMonth() === y.getMonth() ? "" : MON[y.getMonth()] + " "}${y.getDate()}${yr}`;
  };
  const past = (v) => toDate(span(v).b, true) < TODAY;
  const all = [];
  for (const t of site.important_dates)
    for (const [label, val] of Object.entries(t.dates))
      (Array.isArray(val) ? val : [val]).forEach((v, i) => all.push({ v, label, track: t.track, round: t.rounds && t.rounds[i], page: t.page }));
  all.sort((m, n) => toDate(span(m.v).a) - toDate(span(n.v).a));
  const upcoming = all.filter((m) => !past(m.v));
  const nextV = upcoming[0] && upcoming[0].v;
  const cls = (v) => (past(v) ? "past" : v === nextV ? "next" : "");

  function datesFor(t) {
    const rows = Object.entries(t.dates);
    if (!t.rounds) return `<ul class="dlist">${rows.map(([l, v]) => `<li class="${cls(v)}"><span>${esc(l)}</span><time>${fmt(v)}</time></li>`).join("")}</ul>`;
    const table = `<div class="tscroll wide-only"><table class="dates"><thead><tr><th></th>${t.rounds.map((r) => `<th>${esc(r)}</th>`).join("")}</tr></thead><tbody>${
      rows.map(([l, vals]) => `<tr><th>${esc(l)}</th>${vals.map((v) => `<td class="${cls(v)}">${fmt(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    const firstOpen = t.rounds.findIndex((_, i) => rows.some(([, vals]) => !past(vals[i])));
    const lists = `<div class="narrow-only">${t.rounds.map((r, i) => `<details class="round"${i === firstOpen ? " open" : ""}><summary>${esc(r)}${i < firstOpen || firstOpen < 0 ? " <small>closed</small>" : ""}</summary><ul class="dlist">${
      rows.map(([l, vals]) => `<li class="${cls(vals[i])}"><span>${esc(l)}</span><time>${fmt(vals[i])}</time></li>`).join("")}</ul></details>`).join("")}</div>`;
    return table + lists;
  }

  /* ---------- shortcodes usable inside Markdown ---------- */
  const person = (p) => { const m = String(p).match(/^(.*?)\s*\((.*)\)\s*$/); return m ? `${esc(m[1])} <small>${esc(m[2])}</small>` : esc(p); };
  const peopleList = (entries) => `<dl class="people">${entries.map(([r, ps]) => `<div><dt>${esc(r)}</dt>${ps.map((p) => `<dd>${person(p)}</dd>`).join("")}</div>`).join("")}</dl>`;
  const shortcodes = {
    dates: (arg) => {
      const tracks = site.important_dates.filter((t) => !arg || t.track.toLowerCase() === arg.toLowerCase());
      if (arg) return `<div class="dates-block">${tracks.map(datesFor).join("")}</div>`;
      return `<div class="dates-block">${tracks.map((t) => `<section class="track"><h2>${esc(t.track)}</h2>${datesFor(t)}${t.page ? `<p class="callink"><a href="?p=${t.page}">Read the call →</a></p>` : ""}</section>`).join("")}</div>`;
    },
    news: () => `<ul class="news">${site.news.map((n) => `<li>${mdInline(n)}</li>`).join("")}</ul>`,
    chairs: () => peopleList(Object.entries(site.people).slice(0, 4)),
    people: () => peopleList(Object.entries(site.people)),
    sponsors: () => {
      const tiers = Object.entries(site.sponsors || {}).filter(([, s]) => s && Object.keys(s).length);
      if (!tiers.length) return `<p class="soon">Sponsors will be announced here. Interested in supporting SIGMOD/PODS ${conf.year}? See <a href="?p=org/sponsor-opportunities">Sponsor Opportunities</a>.</p>`;
      return tiers.map(([tier, s]) => `<h3>${esc(tier)}</h3><p class="sponsors">${Object.entries(s).map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join("")}</p>`).join("");
    },
  };
  const applyShortcodes = (text) => text.replace(/^\s*\{\{\s*(\w+)\s*(?::\s*([^}]*?))?\s*\}\}\s*$/gm, (_, name, arg) =>
    shortcodes[name] ? "\n" + shortcodes[name](arg) + "\n" : `<p class="warn">Unknown shortcode: ${esc(name)}</p>`);

  /* ---------- menus ---------- */
  const link = (i) => `<a href="${href(i.page)}"${i.page === pageId ? ' aria-current="page"' : ""}>${esc(i.title)}${isExternal(i.page) ? ' <span class="ext">↗</span>' : ""}${highlight.has(i.page) ? ' <span class="new">new</span>' : ""}</a>`;
  const itemsHTML = (items) => `<ul>${items.map((i) => i.children
    ? `<li class="parent"><span>${esc(i.title)}</span>${itemsHTML(i.children)}</li>`
    : `<li>${link(i)}</li>`).join("")}</ul>`;
  const groupsHTML = (groups) => groups.map((g) => `<section class="grp${g === group ? " cur" : ""}"><h2>${esc(g.name)}</h2>${itemsHTML(g.items)}</section>`).join("");

  // Prototype-only: ?logo=oval|cylinder|overlap|wordmark previews the logo concepts.
  const LOGOS = { oval: "../logos/oval-mark.svg", cylinder: "../logos/cylinder-mark.svg", overlap: "../logos/overlap-mark.svg", wordmark: "../logos/wordmark.svg" };
  if (LOGOS[q.get("logo")]) conf.logo = LOGOS[q.get("logo")];
  if (q.get("logo") === "wordmark") document.body.classList.add("logo-wordmark");
  const logo = conf.logo ? await fetch(conf.logo).then((r) => (r.ok ? r.text() : "")).catch(() => "") : "";

  // Inlined SVGs need unique ids when the logo appears more than once.
  const uniq = (svg) => { const k = Math.random().toString(36).slice(2, 7); return svg.replace(/id="([^"]+)"/g, `id="$1-${k}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${k})`); };

  /* ---------- chrome (identical on every page) ---------- */
  if (site.announcement) $("announce").innerHTML = `<div class="announce"><div class="wrap">${mdInline(site.announcement)}</div></div>`;

  $("masthead").innerHTML = `<div class="wrap">
      <a class="brand" href="?p=home">${logo ? `<span class="logo">${uniq(logo)}</span>` : ""}
        <span class="txt"><span class="name">${esc(conf.short_name).replace(/(\d{4})/, "<em>$1</em>")}</span><span class="full">${esc(conf.full_name)}</span></span></a>
      <div class="when"><b>${esc(conf.dates)}</b><span>${esc(conf.location)}</span></div>
      <a class="btn" href="${conf.register_link}">Register</a>
      <button class="menubtn" aria-expanded="false" aria-controls="drawer">Menu</button>
    </div>`;

  // Phone drawer: every group, the current one open.
  $("drawer").innerHTML = `<div class="wrap">${allGroups.map((g) => `<details${g === group || (pageId === "home" && g === allGroups[0]) ? " open" : ""}><summary>${esc(g.name)}</summary>${itemsHTML(g.items)}</details>`).join("")}
    <p><a class="btn" href="${conf.register_link}">Register</a></p></div>`;
  const menubtn = document.querySelector(".menubtn");
  menubtn.addEventListener("click", () => menubtn.setAttribute("aria-expanded", document.body.classList.toggle("menu-open")));

  $("banner").innerHTML = `<div class="banner${pageId === "home" ? " tall" : ""}">${horizon(conf.accent_color)}<div class="wrap"><span class="cap">Host-city photo placeholder</span></div></div>`;

  const upBox = `<div class="upbox"><h2>Upcoming dates</h2>${upcoming.length ? `<ul class="dlist compact">${upcoming.slice(0, 4).map((m) =>
      `<li class="${cls(m.v)}"><span><a href="?p=${m.page}">${esc(m.track.replace(" research papers", "").replace(" track", ""))}</a>${m.round ? " · " + esc(m.round) : ""}<br>${esc(m.label)}</span><time>${fmt(m.v, false)}</time></li>`).join("")}</ul>` : "<p>All deadlines have passed.</p>"}
      <p class="small"><a href="?p=calls/dates">All important dates</a> · 23:59 AoE</p></div>`;

  $("left").innerHTML = groupsHTML(leftGroups);
  $("right").innerHTML = upBox + groupsHTML(rightGroups);

  /* ---------- page ---------- */
  let raw = null;
  try { const r = await fetch(`content/pages/${pageId}.md`); if (r.ok) raw = await r.text(); } catch (e) {}
  let meta = {}, body = raw || "";
  const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) { meta = jsyaml.load(fm[1], { schema: jsyaml.CORE_SCHEMA }) || {}; body = body.slice(fm[0].length); }
  const title = meta.title || (menuItem && menuItem.title) || "Page not found";
  document.title = pageId === "home" ? `${conf.short_name} · ${conf.location}` : `${title} · ${conf.short_name}`;

  const crumbs = pageId === "home" ? "" : `<nav class="crumbs" aria-label="Breadcrumb"><a href="?p=home">Home</a>${group ? ` <span>›</span> ${esc(group.name)}` : ""} <span>›</span> ${esc(title)}</nav>`;
  const inSection = group && pageId !== "home" ? `<details class="insection"><summary>In <b>${esc(group.name)}</b></summary>${itemsHTML(group.items)}</details>` : "";
  const content = raw !== null ? md(applyShortcodes(body))
    : group ? `<p class="soon">This page will be published closer to the conference. See <a href="?p=calls/dates">Important Dates</a> for what is coming up.</p>`
    : `<p>We couldn't find this page. Go back to the <a href="?p=home">homepage</a>.</p>`;

  $("main").innerHTML = `${crumbs}${inSection}${pageId === "home" ? `<div class="phone-only">${upBox}</div>` : ""}<h1>${esc(title)}</h1><div class="prose">${content}</div>
    ${raw !== null ? `<p class="edit">Edit this page: <code>content/pages/${pageId}.md</code></p>` : ""}`;

  /* ---------- footer ---------- */
  $("foot").innerHTML = `<div class="wrap">
    <div class="fl">${logo ? `<span class="logo">${uniq(logo)}</span>` : ""}<div><b>${esc(conf.short_name)}</b><br>${esc(conf.full_name)}<br>${esc(conf.dates)} · ${esc(conf.location)}</div></div>
    <div class="fr"><a href="https://sigmod.org">ACM SIGMOD</a> · <a href="https://sigmod.org/pods/">PODS</a> · ${Object.entries(site.footer.social).map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join(" · ")}</div></div>`;

  for (const k of ["today", "logo"]) if (q.get(k)) document.querySelectorAll('a[href^="?p="]').forEach((a) => (a.href += `&${k}=` + q.get(k)));

  function horizon(accent) {
    const lines = Array.from({ length: 6 }, (_, i) => `<path d="M0 ${150 + i * 14} Q 300 ${142 + i * 14} 600 ${150 + i * 14} T 1200 ${150 + i * 14}" stroke="${accent}" stroke-opacity="${0.5 - i * 0.07}" stroke-width="2" fill="none"/>`).join("");
    return `<svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef6f5"/><stop offset="1" stop-color="#fff4ea"/></linearGradient></defs>
      <rect width="1200" height="240" fill="url(#hz)"/><circle cx="880" cy="140" r="62" fill="#c2410c" fill-opacity=".8"/><rect y="140" width="1200" height="100" fill="#eef6f5"/>${lines}</svg>`;
  }
})().catch((err) => {
  document.getElementById("main").innerHTML = `<p class="warn">The site settings could not be loaded: ${String(err.message || err)}</p>`;
  console.error(err);
});
