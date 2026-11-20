/*
 * Classic SIGMOD/PODS template — renderer.
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

  // Prototype-only: layout switch (sidebar | tabs), remembered per browser.
  let layout = q.get("layout");
  try { layout = layout || localStorage.getItem("classic-layout") || "sidebar"; } catch (e) { layout = layout || "sidebar"; }
  document.body.classList.add("layout-" + layout);

  /* ---------- load settings ---------- */
  const site = jsyaml.load(await fetch("content/site.yml").then((r) => r.text()), { schema: jsyaml.CORE_SCHEMA });
  const conf = site.conference;
  document.documentElement.style.setProperty("--accent", conf.accent_color || "#0f766e");

  const isExternal = (h) => /^https?:/.test(h);
  const href = (h) => (isExternal(h) ? h : `?p=${h}`);
  const sections = Object.entries(site.menu).map(([name, pages]) => ({ name, pages: Object.entries(pages) }));
  const section = sections.find((s) => s.pages.some(([, p]) => p === pageId));
  const menuTitle = section && section.pages.find(([, p]) => p === pageId)[0];

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
  for (const t of site.important_dates) {
    for (const [label, val] of Object.entries(t.dates)) {
      if (Array.isArray(val)) val.forEach((v, i) => all.push({ v, label, track: t.track, round: t.rounds[i], page: t.page }));
      else all.push({ v: val, label, track: t.track, page: t.page });
    }
  }
  all.sort((m, n) => toDate(span(m.v).a) - toDate(span(n.v).a));
  const upcoming = all.filter((m) => !past(m.v));
  const nextV = upcoming[0] && upcoming[0].v;
  const cls = (v) => (past(v) ? "past" : v === nextV ? "next" : "");

  function datesFor(t) {
    const rows = Object.entries(t.dates);
    if (t.rounds) {
      // table for wide screens + one list per round for phones
      const table = `<div class="tscroll wide-only"><table class="dates"><thead><tr><th></th>${t.rounds.map((r) => `<th>${esc(r)}</th>`).join("")}</tr></thead><tbody>${
        rows.map(([l, vals]) => `<tr><th>${esc(l)}</th>${vals.map((v) => `<td class="${cls(v)}">${fmt(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      const firstOpen = t.rounds.findIndex((_, i) => rows.some(([, vals]) => !past(vals[i])));
      const lists = `<div class="narrow-only">${t.rounds.map((r, i) => `<details class="round"${i === firstOpen ? " open" : ""}><summary>${esc(r)}${i < firstOpen || firstOpen < 0 ? ' <small>closed</small>' : ""}</summary><ul class="dlist">${
        rows.map(([l, vals]) => `<li class="${cls(vals[i])}"><span>${esc(l)}</span><time>${fmt(vals[i])}</time></li>`).join("")}</ul></details>`).join("")}</div>`;
      return table + lists;
    }
    return `<ul class="dlist">${rows.map(([l, v]) => `<li class="${cls(v)}"><span>${esc(l)}</span><time>${fmt(v)}</time></li>`).join("")}</ul>`;
  }

  /* ---------- shortcodes usable inside Markdown ---------- */
  const shortcodes = {
    dates: (arg) => {
      const tracks = site.important_dates.filter((t) => !arg || t.track.toLowerCase() === arg.toLowerCase());
      if (arg) return `<div class="dates-block">${tracks.map(datesFor).join("")}</div>`;
      return `<div class="dates-block">${tracks.map((t) => `<section class="track"><h2 id="${t.track.toLowerCase().replace(/\W+/g, "-")}">${esc(t.track)}</h2>${datesFor(t)}${t.page ? `<p class="callink"><a href="?p=${t.page}">Read the call →</a></p>` : ""}</section>`).join("")}</div>`;
    },
    news: () => `<ul class="news">${site.news.map((n) => `<li>${mdInline(n)}</li>`).join("")}</ul>`,
    chairs: () => `<dl class="people">${Object.entries(site.people).slice(0, 4).map(([r, ps]) => `<div><dt>${esc(r)}</dt>${ps.map((p) => `<dd>${person(p)}</dd>`).join("")}</div>`).join("")}</dl>`,
    people: () => `<dl class="people">${Object.entries(site.people).map(([r, ps]) => `<div><dt>${esc(r)}</dt>${ps.map((p) => `<dd>${person(p)}</dd>`).join("")}</div>`).join("")}</dl>`,
  };
  function person(p) { const m = String(p).match(/^(.*?)\s*\((.*)\)\s*$/); return m ? `${esc(m[1])} <small>${esc(m[2])}</small>` : esc(p); }
  const applyShortcodes = (text) => text.replace(/^\s*\{\{\s*(\w+)\s*(?::\s*([^}]*?))?\s*\}\}\s*$/gm, (_, name, arg) =>
    shortcodes[name] ? "\n" + shortcodes[name](arg) + "\n" : `<p class="warn">Unknown shortcode: ${esc(name)}</p>`);

  /* ---------- chrome (identical on every page) ---------- */
  if (site.announcement) $("announce").innerHTML = `<div class="announce"><div class="wrap">${mdInline(site.announcement)}</div></div>`;

  $("masthead").innerHTML = `<div class="wrap">
    <a class="brand" href="?p=home"><span class="name">${esc(conf.short_name).replace(/(\d{4})/, "<em>$1</em>")}</span>
      <span class="full">${esc(conf.full_name)}</span><span class="mwhen">${esc(conf.dates)} · ${esc(conf.location.split(",")[0])}</span></a>
    <div class="when"><b>${esc(conf.dates)}</b><span>${esc(conf.location)}</span></div>
    <a class="btn" href="${conf.register_link}">Register</a>
    <button class="menubtn" aria-expanded="false" aria-controls="mainnav">Menu</button></div>`;

  $("mainnav").innerHTML = `<div class="wrap"><ul class="top">
    <li class="${pageId === "home" ? "on" : ""}"><a href="?p=home">Home</a></li>
    ${sections.map((s) => `<li class="has${section === s ? " on" : ""}"><a href="${href(s.pages[0][1])}">${esc(s.name)}</a><ul class="sub">${
      s.pages.map(([t, p]) => `<li><a href="${href(p)}"${p === pageId ? ' aria-current="page"' : ""}>${esc(t)}${isExternal(p) ? " ↗" : ""}</a></li>`).join("")}</ul></li>`).join("")}
    <li class="mreg"><a href="${conf.register_link}">Register</a></li>
  </ul></div>`;
  const menubtn = document.querySelector(".menubtn");
  menubtn.addEventListener("click", () => menubtn.setAttribute("aria-expanded", document.body.classList.toggle("menu-open")));

  /* ---------- page ---------- */
  let raw = null;
  try { const r = await fetch(`content/pages/${pageId}.md`); if (r.ok) raw = await r.text(); } catch (e) {}
  let meta = {}, body = raw || "";
  const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) { meta = jsyaml.load(fm[1], { schema: jsyaml.CORE_SCHEMA }) || {}; body = body.slice(fm[0].length); }
  const title = meta.title || menuTitle || "Page not found";
  document.title = pageId === "home" ? `${conf.short_name} · ${conf.location}` : `${title} · ${conf.short_name}`;

  const sectionNav = section ? `<nav class="secnav" aria-label="${esc(section.name)}"><h2>${esc(section.name)}</h2><ul>${
    section.pages.map(([t, p]) => `<li><a href="${href(p)}"${p === pageId ? ' aria-current="page"' : ""}>${esc(t)}${isExternal(p) ? " ↗" : ""}</a></li>`).join("")}</ul></nav>` : "";

  const glance = `<div class="box"><h2>Upcoming dates</h2>${upcoming.length ? `<ul class="dlist compact">${upcoming.slice(0, 5).map((m) => `<li class="${cls(m.v)}"><span><a href="?p=${m.page}">${esc(m.track.replace(" research papers", ""))}</a>${m.round ? " · " + esc(m.round) : ""}<br>${esc(m.label)}</span><time>${fmt(m.v, false)}</time></li>`).join("")}</ul>` : "<p>All submission deadlines have passed.</p>"}
      <p class="small">23:59 AoE · <a href="?p=submit/dates">All important dates</a></p></div>
    <div class="box"><h2>At a glance</h2><dl class="facts"><dt>When</dt><dd>${esc(conf.dates)}</dd><dt>Where</dt><dd>${esc(conf.venue)}<br>${esc(conf.location)}</dd></dl>
      <p class="small"><a href="?p=attend/venue">Venue &amp; hotel</a> · <a href="?p=attend/travel">Travel</a></p></div>`;

  if (pageId === "home") {
    document.body.classList.add("is-home");
    $("banner").innerHTML = `<div class="banner">${horizon(conf.accent_color)}<div class="wrap"><span class="cap">${esc(conf.banner_caption || "")} · photo placeholder</span></div></div>`;
    $("side").innerHTML = glance;
  } else {
    $("side").innerHTML = sectionNav;
  }

  const crumbs = pageId === "home" ? "" : `<nav class="crumbs" aria-label="Breadcrumb"><a href="?p=home">Home</a>${section ? ` <span>›</span> ${esc(section.name)}` : ""} <span>›</span> ${esc(title)}</nav>`;
  const tabs = section ? `<nav class="tabs" aria-label="${esc(section.name)} pages">${section.pages.map(([t, p]) => `<a href="${href(p)}"${p === pageId ? ' aria-current="page"' : ""}>${esc(t)}</a>`).join("")}</nav>` : "";
  const mobileSec = section ? `<details class="insection"><summary>In this section: <b>${esc(section.name)}</b></summary><ul>${
    section.pages.map(([t, p]) => `<li><a href="${href(p)}"${p === pageId ? ' aria-current="page"' : ""}>${esc(t)}</a></li>`).join("")}</ul></details>` : "";
  const content = raw !== null ? md(applyShortcodes(body))
    : section ? `<p class="soon">This page will be published soon. Check back later, or see <a href="?p=submit/dates">Important dates</a>.</p>`
    : `<p>We couldn't find this page. Go back to the <a href="?p=home">homepage</a>.</p>`;

  $("main").innerHTML = `${crumbs}${mobileSec}<h1>${esc(title)}</h1>${tabs}<div class="prose">${content}</div>
    ${raw !== null ? `<p class="edit">Edit this page: <code>content/pages/${pageId}.md</code></p>` : ""}`;

  /* ---------- footer ---------- */
  $("foot").innerHTML = `<div class="wrap">
    <div class="fcol"><b>${esc(conf.short_name)}</b><p>${esc(conf.full_name)}<br>${esc(conf.dates)} · ${esc(conf.location)}</p>
      <p><a href="?p=attend/code-of-conduct">Code of conduct</a> · <a href="${site.footer.contact}">Contact</a></p></div>
    ${sections.slice(0, 3).map((s) => `<div class="fcol"><b>${esc(s.name)}</b><ul>${s.pages.slice(0, 4).map(([t, p]) => `<li><a href="${href(p)}">${esc(t)}</a></li>`).join("")}</ul></div>`).join("")}
    <div class="fbase"><span>Sponsored by <a href="https://sigmod.org">ACM SIGMOD</a></span><span>${Object.entries(site.footer.social).map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join(" · ")}</span></div></div>`;

  /* ---------- prototype-only layout switch ---------- */
  const proto = $("proto");
  proto.hidden = false;
  proto.innerHTML = `<span>Prototype layout</span>${["sidebar", "tabs"].map((l) => `<button aria-pressed="${l === layout}" data-l="${l}">${l === "sidebar" ? "Sidebar" : "Tabs"}</button>`).join("")}`;
  proto.addEventListener("click", (e) => {
    const l = e.target.dataset && e.target.dataset.l; if (!l) return;
    try { localStorage.setItem("classic-layout", l); } catch (err) {}
    const u = new URL(location.href); u.searchParams.delete("layout"); location.href = u.toString();
  });

  // Keep ?today= while clicking around (for previewing other dates).
  if (q.get("today")) document.querySelectorAll('a[href^="?p="]').forEach((a) => (a.href += "&today=" + q.get("today")));

  function horizon(accent) {
    const lines = Array.from({ length: 6 }, (_, i) => `<path d="M0 ${150 + i * 14} Q 300 ${142 + i * 14} 600 ${150 + i * 14} T 1200 ${150 + i * 14}" stroke="${accent}" stroke-opacity="${0.5 - i * 0.07}" stroke-width="2" fill="none"/>`).join("");
    return `<svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef6f5"/><stop offset="1" stop-color="#fff4ea"/></linearGradient></defs>
      <rect width="1200" height="240" fill="url(#hz)"/><circle cx="880" cy="140" r="62" fill="#c2410c" fill-opacity=".8"/><rect y="140" width="1200" height="100" fill="#eef6f5"/>${lines}</svg>`;
  }
})().catch((err) => {
  document.getElementById("main").innerHTML = `<p class="warn">The site settings could not be loaded: ${String(err.message || err)}</p>`;
  console.error(err);
});
