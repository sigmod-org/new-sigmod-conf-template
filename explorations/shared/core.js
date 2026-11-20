/* Shared helpers used by every design alternative. No dependencies. */
(function () {
  const C = window.CONF;
  const q = new URLSearchParams(location.search);

  // ?today=2027-06-15 lets you preview how the site looks at any point in the year.
  const TODAY = q.get("today") ? new Date(q.get("today") + "T12:00:00") : new Date();

  const d = (s) => new Date(s + "T23:59:00");
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function fmt(s, style = "short") {
    if (!s) return "";
    if (s.includes("/")) {
      const [a, b] = s.split("/").map(d);
      const sameMonth = a.getMonth() === b.getMonth();
      if (style === "long") return `${MONTH[a.getMonth()]} ${a.getDate()}–${sameMonth ? "" : MONTH[b.getMonth()] + " "}${b.getDate()}, ${b.getFullYear()}`;
      return `${MON[a.getMonth()]} ${a.getDate()}–${sameMonth ? "" : MON[b.getMonth()] + " "}${b.getDate()}`;
    }
    const x = d(s);
    if (style === "long") return `${MONTH[x.getMonth()]} ${x.getDate()}, ${x.getFullYear()}`;
    if (style === "year") return `${MON[x.getMonth()]} ${x.getDate()}, ${x.getFullYear()}`;
    if (style === "dow") return `${DOW[x.getDay()]} ${MON[x.getMonth()]} ${x.getDate()}`;
    return `${MON[x.getMonth()]} ${x.getDate()}`;
  }
  const first = (s) => d(s.split("/")[0]);
  const last = (s) => d(s.split("/").pop());
  const daysUntil = (s) => Math.ceil((first(s) - TODAY) / 864e5);
  const isPast = (s) => last(s) < TODAY;

  // Every dated milestone, flattened.
  function milestones() {
    const out = [];
    for (const t of C.deadlines.tables)
      t.rows.forEach((r) => r.cells.forEach((c, i) =>
        out.push({ date: c, label: r.label, deadline: !!r.deadline, group: t.title, sub: t.columns[i], track: t.track, id: t.id })));
    for (const l of C.deadlines.lists)
      l.items.forEach((it) => out.push({ ...it, deadline: !!it.deadline, group: l.title, track: l.track, id: l.id }));
    return out.sort((a, b) => first(a.date) - first(b.date));
  }
  const upcoming = (n = 4, onlyDeadlines = true) =>
    milestones().filter((m) => !isPast(m.date) && (!onlyDeadlines || m.deadline)).slice(0, n);

  // pre | live | post — drives what the homepage emphasizes.
  function phase() {
    if (TODAY < d(C.start) - 864e5) return "pre";
    if (TODAY <= d(C.end)) return "live";
    return "post";
  }

  const dateRange = (style) => {
    const a = d(C.start), b = d(C.end);
    if (style === "long") return `${MONTH[a.getMonth()]} ${a.getDate()}–${b.getDate()}, ${b.getFullYear()}`;
    return `${MON[a.getMonth()]} ${a.getDate()}–${b.getDate()}, ${b.getFullYear()}`;
  };

  function applyTheme() {
    const r = document.documentElement.style;
    r.setProperty("--accent", C.theme.accent);
    r.setProperty("--accent-soft", C.theme.accentSoft);
    r.setProperty("--warm", C.theme.warm);
    document.title = document.title.replace("{edition}", C.edition).replace("{city}", C.city);
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const html = (sel, s) => { const el = $(sel); if (el) el.innerHTML = s; };

  // Keep the ?today= override when moving between prototype pages.
  function keepQuery() {
    if (!location.search) return;
    document.querySelectorAll('a[href$=".html"]').forEach((a) => {
      if (!a.href.includes("?")) a.href += location.search;
    });
  }

  // Abstract host-city mark: horizon + sun + water lines. Replace with a real photo per year.
  function horizonSVG(opts = {}) {
    const dark = !!opts.dark;
    const a = dark ? "#5eead4" : C.theme.accent, w = C.theme.warm;
    const sky0 = dark ? "#0e1b36" : C.theme.accentSoft, sky1 = dark ? "#3b2a3f" : "#fff7ed", sea = dark ? "#0b1830" : C.theme.accentSoft;
    const lines = Array.from({ length: 7 }, (_, i) =>
      `<path d="M0 ${200 + i * 18} Q 150 ${190 + i * 18} 300 ${200 + i * 18} T 600 ${200 + i * 18}" stroke="${a}" stroke-opacity="${(dark ? 0.35 : 0.55) - i * (dark ? 0.04 : 0.06)}" stroke-width="2" fill="none"/>`).join("");
    const id = "sky" + (dark ? "d" : "l");
    return `<svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration: sun over the Pacific" ${opts.cls ? `class="${opts.cls}"` : ""}>
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky0}"/><stop offset="1" stop-color="${sky1}"/></linearGradient></defs>
      <rect width="600" height="340" fill="url(#${id})"/>
      <circle cx="400" cy="185" r="70" fill="${w}" fill-opacity="${dark ? 0.7 : 0.85}"/>
      <rect y="185" width="600" height="155" fill="${sea}"/>
      ${lines}
    </svg>`;
  }

  window.S = { C, TODAY, fmt, first, last, daysUntil, isPast, milestones, upcoming, phase, dateRange, applyTheme, esc, $, html, keepQuery, horizonSVG };
})();
