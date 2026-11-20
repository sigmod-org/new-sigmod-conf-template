(function () {
  const { C, fmt, upcoming, daysUntil, phase, dateRange, applyTheme, esc, html, keepQuery, horizonSVG } = window.S;
  const R = window.R;
  applyTheme();
  const page = document.body.dataset.page;
  const here = page === "dates" ? "dates.html" : "index.html";

  /* ---------- chrome ---------- */
  html("#strip", `
    <button class="burger" aria-expanded="false" aria-controls="side">Menu</button>
    <a class="brand" href="index.html"><span class="dot">S</span>SIGMOD/PODS <em>${C.year}</em></a>
    <span class="meta">${dateRange()} · ${esc(C.city)}, ${esc(C.region)}</span>
    <span class="sp"></span>
    <a class="lnk" href="https://sigmod.org">sigmod.org ↗</a>
    <a class="btn" href="#">Register</a>`);

  html("#side", `
    <label class="sr" for="find">Find a page</label>
    <input class="find" id="find" type="search" placeholder="Find a page…" autocomplete="off">
    <a class="home" href="index.html"${here === "index.html" ? ' aria-current="page"' : ""}>Home</a>
    ${C.nav.map((s) => `<details open><summary>${esc(s.label)}</summary><ul>${
      s.items.map(([t, h]) => `<li><a href="${h}"${h === here ? ' aria-current="page"' : ""}>${esc(t)}</a></li>`).join("")}</ul></details>`).join("")}
    <p class="none" hidden>No matching pages.</p>`);

  const find = document.getElementById("find");
  find.addEventListener("input", () => {
    const q = find.value.trim().toLowerCase();
    let any = false;
    document.querySelectorAll(".side details").forEach((d) => {
      let hit = false;
      d.querySelectorAll("li").forEach((li) => {
        const ok = !q || li.textContent.toLowerCase().includes(q);
        li.hidden = !ok; hit = hit || ok;
      });
      d.hidden = !hit; if (q && hit) d.open = true; any = any || hit;
    });
    document.querySelector(".side .none").hidden = any;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== find) { e.preventDefault(); find.focus(); }
  });
  const burger = document.querySelector(".burger");
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", open);
  });

  // Right rail: the same on every page.
  const up = upcoming(5);
  const nx = up[0];
  html("#rail", `
    ${nx ? `<div class="box count"><h3>Next deadline</h3>
      <div class="n">${Math.max(daysUntil(nx.date), 0)}<small>days</small></div>
      <p><b>${esc(nx.label)}</b> — ${esc(nx.group)}${nx.sub ? " · " + esc(nx.sub) : ""}<br>${fmt(nx.date, "long")}, 23:59 AoE</p></div>` : ""}
    <div class="box"><h3>Coming up</h3><ul class="mini">${up.slice(1).map((m) => `<li><span>${esc(m.group.replace(" research papers", ""))}: ${esc(m.label.toLowerCase())}</span><time>${fmt(m.date)}</time></li>`).join("")}</ul>
      <a class="icsbtn" href="dates.html">All important dates →</a></div>
    <div class="box"><h3>At a glance</h3><dl class="facts">
      <dt>Dates</dt><dd>${dateRange("long")}</dd>
      <dt>Venue</dt><dd>${esc(C.venue.name)}</dd>
      <dt>Airports</dt><dd>${C.venue.airports.map(esc).join(", ")}</dd></dl></div>
    <div class="box"><h3>Quick links</h3><div class="quick">
      <a href="#">Register</a><a href="#">Book the hotel</a><a href="#">Submit a paper</a><a href="#">Program</a></div></div>
    <div class="box"><h3>Sponsors</h3><div class="sponsor-mini">${"<span></span>".repeat(6)}</div></div>`);

  /* ---------- pages ---------- */
  if (page === "home") {
    html("#content", `
      <div class="banner">${horizonSVG()}<span class="cap">Host-city banner</span>
        <div class="t"><small>${esc(C.fullName)}</small><b>${esc(C.city)}, ${C.year}</b><span>${dateRange("long")} · ${esc(C.venue.name)}</span></div></div>
      <h1>Welcome</h1>
      <p class="lead">${esc(C.intro)}</p>
      <p>${esc(C.introMore)}</p>

      <h2>Latest</h2>
      <ul class="newsl">${C.news.map((x) => `<li><a href="${x.href}">${esc(x.text)}</a></li>`).join("")}</ul>

      <h2>The week at a glance</h2>
      <div class="week">${C.week.days.map((d) => `<div class="d"><b>${fmt(d.date, "dow")}</b>${
        d.blocks.map(([t, k]) => `<span class="blk ${k}">${esc(t)}</span>`).join("")}</div>`).join("")}</div>
      ${C.week.sample ? `<p class="samp">Illustrative layout — the detailed program will replace this.</p>` : ""}

      <h2>Organizers</h2>
      <dl class="ppl">${C.people.map((g) => `<div><dt>${esc(g.role)}</dt><dd>${g.list.map(([n, a]) => `${esc(n)} <small>(${esc(a)})</small>`).join(", ")}</dd></div>`).join("")}</dl>
      <p><a href="#">Full organizing and program committees →</a></p>

      <div class="policy"><b>Code of conduct.</b> ${esc(C.policy)} <a href="#">Read more</a></div>`);
  }

  if (page === "dates") {
    html("#content", `
      <div class="crumbs"><a href="index.html">Home</a> › Submit › Important dates</div>
      <h1>Important dates</h1>
      <p class="lead">All deadlines are 23:59 Anywhere on Earth (AoE). Past dates are greyed out; the next deadline is marked.</p>
      <a class="icsbtn" id="ics" href="#">Add all upcoming deadlines to your calendar (.ics)</a>
      <nav class="jump" aria-label="Tracks">${R.jumpLinks()}</nav>
      ${R.allDates()}`);
    const a = document.getElementById("ics"); a.href = R.icsHref(); a.download = `sigmod-${C.year}-deadlines.ics`;
  }

  keepQuery();
})();
