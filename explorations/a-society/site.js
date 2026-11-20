(function () {
  const { C, fmt, upcoming, daysUntil, phase, dateRange, applyTheme, esc, html, keepQuery, horizonSVG } = window.S;
  const R = window.R;
  applyTheme();

  const icon = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  };

  /* ---------- chrome ---------- */
  const n = C.news[0];
  html("#announce", `<div class="wrap"><b>${esc(n.tag)}</b><a href="${n.href}">${esc(n.text)}</a></div>`);

  html("#header", `<div class="wrap bar">
      <a class="brand" href="index.html"><span class="mark">SIGMOD<i>/</i>PODS</span><span class="yr">${C.year}</span></a>
      <nav class="mainnav" aria-label="Main">${C.nav.map((s, i) => `<button aria-expanded="false" data-i="${i}">${esc(s.label)}</button>`).join("")}</nav>
      <a class="btn" href="#">Register</a>
      <button class="menu-toggle" aria-expanded="false">Menu</button>
    </div>
    <div class="mega" id="mega"><div class="wrap">${C.nav.map((s, i) => `<section data-i="${i}"><h3>${esc(s.label)}</h3><ul>${
      s.items.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join("")}</ul></section>`).join("")}</div></div>`);

  const mega = document.getElementById("mega");
  const btns = document.querySelectorAll(".mainnav button, .menu-toggle");
  function setOpen(btn) {
    const open = btn && btn.getAttribute("aria-expanded") !== "true";
    btns.forEach((b) => b.setAttribute("aria-expanded", "false"));
    mega.classList.toggle("open", !!open);
    mega.querySelectorAll("section").forEach((s) => s.classList.toggle("hl", open && s.dataset.i === btn.dataset.i));
    if (open) btn.setAttribute("aria-expanded", "true");
  }
  btns.forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); setOpen(b); }));
  document.addEventListener("click", (e) => { if (!mega.contains(e.target)) setOpen(null); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(null); });

  html("#footer", `<div class="wrap">
      <div><h3>${esc(C.edition)}</h3><p>${esc(C.fullName)}<br>${dateRange("long")} · ${esc(C.city)}, ${esc(C.region)}</p>
        <p style="color:#94a3b8">${esc(C.policy)} <a href="#">Read the policy</a>.</p></div>
      <div><h3>Conference</h3><ul><li><a href="dates.html">Important dates</a></li><li><a href="#">Registration</a></li><li><a href="#">Organizers</a></li><li><a href="#">Contact</a></li></ul></div>
      <div><h3>Community</h3><ul><li><a href="https://sigmod.org">ACM SIGMOD</a></li><li><a href="https://sigmod.org/pods/">PODS</a></li><li><a href="https://sigmod.org/sigmod-pods-conferences/">Past conferences</a></li><li><a href="${C.social.x}">X</a> · <a href="${C.social.linkedin}">LinkedIn</a> · <a href="${C.social.bluesky}">Bluesky</a></li></ul></div>
      <div class="base"><span>Sponsored by ACM SIGMOD</span><span>Template prototype · option A</span></div>
    </div>`);

  /* ---------- pages ---------- */
  const page = document.body.dataset.page;

  if (page === "home") {
    const p = phase();
    const cta = p === "live"
      ? `<a class="btn" href="#">Today's program</a><a class="btn ghost" href="#">Venue map</a>`
      : p === "post"
        ? `<a class="btn" href="#">Proceedings</a><a class="btn ghost" href="#">Award winners</a>`
        : `<a class="btn" href="dates.html">Important dates</a><a class="btn ghost" href="#">Calls for submissions</a>`;

    html("#hero", `<div class="wrap">
        <div>
          <p class="eyebrow">${esc(C.fullName)}</p>
          <h1>SIGMOD/PODS <span>${C.year}</span></h1>
          <ul class="facts"><li>${icon.cal}${dateRange("long")}</li><li>${icon.pin}${esc(C.city)}, ${esc(C.region)}</li></ul>
          <p class="lede">${esc(C.intro)}</p>
          <div class="actions">${cta}</div>
        </div>
        <figure>${horizonSVG()}<figcaption>Host-city photo goes here</figcaption></figure>
      </div>`);

    const up = upcoming(4);
    html("#deadlines", up.length ? up.map((m, i) => `<article class="card${i === 0 ? " first" : ""}">
        <div class="when">${fmt(m.date)}</div>
        <div class="what">${esc(m.label)}</div>
        <div class="ctx">${esc(m.group)}${m.sub ? " · " + esc(m.sub) : ""}</div>
        <div class="left">${daysUntil(m.date) <= 0 ? "Today" : `In ${daysUntil(m.date)} days`}</div>
      </article>`).join("") : weekCards());

    // Once deadlines are over, the same slot shows the conference week instead.
    function weekCards() {
      const head = document.querySelector("#deadlines").previousElementSibling;
      head.innerHTML = `<h2>The week at a glance</h2><a href="#">Detailed schedule →</a>`;
      document.querySelector("#deadlines").style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
      const todayISO = S.TODAY.toISOString().slice(0, 10);
      return C.week.days.map((d) => `<article class="card${d.date === todayISO ? " first" : ""}">
        <div class="when">${fmt(d.date, "dow")}</div>${d.blocks.map(([t]) => `<div class="ctx">${esc(t)}</div>`).join("")}
        ${d.date === todayISO ? `<div class="left">Today</div>` : ""}</article>`).join("");
    }

    html("#news", C.news.map((x) => `<li><span class="pill">${esc(x.tag)}</span><a href="${x.href}">${esc(x.text)}</a></li>`).join(""));
    html("#glance", `<dl>
      <div><dt>When</dt><dd>${dateRange("long")}</dd></div>
      <div><dt>Where</dt><dd>${esc(C.venue.name)}<br><small>${esc(C.venue.address)}</small></dd></div>
      <div><dt>Fly into</dt><dd>${C.venue.airports.map(esc).join(" · ")}</dd></div>
      <div><dt>Deadlines</dt><dd>23:59 Anywhere on Earth · <a href="dates.html">all dates</a></dd></div></dl>`);

    html("#keynotes", C.keynotes.map((k) => `<div class="kn${k.tba ? " tba" : ""}"><div class="ph">${k.tba ? "?" : k.name.split(" ").map((w) => w[0]).filter((c) => /[A-Z]/.test(c)).slice(-2).join("")}</div>
      <div><b>${esc(k.name)}</b><span>${k.aff ? esc(k.aff) + " · " : ""}${R.trackTag(k.track)}</span></div></div>`).join(""));

    html("#people", C.people.filter((g) => g.key).map((g) => `<div><h3>${esc(g.role)}</h3>${g.list.map(([nm, af]) => `<p>${esc(nm)}<small>${esc(af)}</small></p>`).join("")}</div>`).join(""));
    html("#sponsors", R.sponsorTiers());
  }

  if (page === "dates") {
    html("#toc", `<h3>On this page</h3>${R.jumpLinks()}`);
    html("#dates", R.allDates());
    const a = document.getElementById("ics"); a.href = R.icsHref(); a.download = `sigmod-${C.year}-deadlines.ics`;
  }

  keepQuery();
})();
