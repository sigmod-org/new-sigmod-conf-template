(function () {
  const S = window.S, R = window.R;
  const { C, TODAY, fmt, first, upcoming, daysUntil, isPast, milestones, phase, dateRange, applyTheme, esc, html, keepQuery, horizonSVG } = S;
  applyTheme();
  const page = document.body.dataset.page;

  const COLORS = { "sigmod-research": "#7aa7ff", "pods-research": "#fb923c", industry: "#c084fc", demos: "#f472b6", tutorials: "#facc15" };
  const SHORT = { "sigmod-research": "SIGMOD research", "pods-research": "PODS", industry: "Industrial", demos: "Demos", tutorials: "Tutorials" };
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* ---------- chrome ---------- */
  html("#nav", `<div class="wrap">
    <a class="logo" href="index.html"><span class="yr">SIGMOD/PODS ${C.year}</span><span class="nm">${esc(C.city)}<br>${dateRange()}</span></a>
    ${C.nav.map((s) => `<div class="item"><a href="${s.items[0][1]}">${esc(s.label)}</a><div class="drop">${
      s.items.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join("")}</div></div>`).join("")}
    <div class="item"><a class="cta" href="#">Register</a></div>
    <button class="burger" aria-expanded="false">Menu</button></div>`);
  const nav = document.getElementById("nav"), burger = nav.querySelector(".burger");
  burger.addEventListener("click", () => burger.setAttribute("aria-expanded", nav.classList.toggle("open")));

  html("#footer", `<div class="wrap">
    <div><h3>${esc(C.edition)}</h3><p>${esc(C.fullName)}<br>${dateRange("long")} · ${esc(C.city)}, ${esc(C.region)}</p><p>${esc(C.policy)}</p></div>
    ${C.nav.slice(0, 3).map((s) => `<div><h3>${esc(s.label)}</h3><ul>${s.items.slice(0, 5).map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join("")}</ul></div>`).join("")}
    <div class="base"><span><a href="https://sigmod.org">ACM SIGMOD</a> · <a href="https://sigmod.org/pods/">PODS</a> · <a href="${C.social.x}">X</a> · <a href="${C.social.linkedin}">LinkedIn</a> · <a href="${C.social.bluesky}">Bluesky</a></span><span>Template prototype · option C</span></div></div>`);

  /* ---------- home ---------- */
  if (page === "home") {
    const ph = phase();
    const up = upcoming(4);
    const dayN = Math.floor((TODAY - new Date(C.start + "T00:00:00")) / 864e5) + 1;
    const nDays = C.week.days.length;

    const status = ph === "live" ? `Happening now · day ${dayN} of ${nDays}`
      : ph === "post" ? `Thank you for joining us in ${C.city}`
      : up.length ? `Submissions open · next deadline ${fmt(up[0].date)}` : `Registration open`;
    const btns = ph === "live"
      ? `<a class="b pri" href="#">Today's schedule</a><a class="b ghost" href="#">Venue map</a>`
      : ph === "post" ? `<a class="b pri" href="#">Proceedings</a><a class="b ghost" href="#">Awards</a>`
      : `<a class="b pri" href="#submit">Submit your work</a><a class="b ghost" href="#attend">Plan your trip</a>`;

    const right = ph === "pre" && up.length
      ? `<div class="nextbox"><h3>Next deadlines · 23:59 AoE</h3><ol>${up.map((m) => `<li><time>${fmt(m.date)}</time><div><b>${esc(m.label)}</b><small>${esc(SHORT[m.id] || m.group)}${m.sub ? " · " + esc(m.sub) : ""}</small></div><span class="d">${daysUntil(m.date)}d</span></li>`).join("")}</ol><a href="dates.html">All important dates →</a></div>`
      : ph === "live"
        ? `<div class="nextbox"><h3>Today · ${fmt(TODAY.toISOString().slice(0, 10), "dow")}</h3><ul class="todayl">${(C.week.days.find((d) => d.date === TODAY.toISOString().slice(0, 10)) || C.week.days[0]).blocks.map(([t, k]) => `<li class="${k}">${esc(t)}</li>`).join("")}</ul><a href="#">Full schedule for today →</a></div>`
        : `<div class="nextbox"><h3>After the conference</h3><ul class="todayl"><li class="plenary">Proceedings in the ACM Digital Library</li><li class="sigmod">Best paper &amp; test-of-time awards</li><li class="social">Photo gallery</li><li class="ws">See you at SIGMOD/PODS ${C.year + 1}</li></ul></div>`;

    html("#hero", `<div class="art">${horizonSVG({ dark: true })}<span class="cap">Host-city photo</span></div>
      <div class="wrap"><div>
        <div class="status"><i></i>${esc(status)}</div>
        <h1>${esc(C.city)}<small>${esc(C.fullName)}</small></h1>
        <p class="when">${dateRange("long")} <span>· ${esc(C.venue.name)}</span></p>
        <div class="btns">${btns}</div>
      </div>${right}</div>`);

    // Timeline from the first milestone to the end of the conference.
    const all = milestones().filter((m) => m.deadline);
    const t0 = new Date(first(all[0].date).getFullYear(), first(all[0].date).getMonth(), 1);
    const t1 = new Date(first(C.end).getFullYear(), first(C.end).getMonth() + 1, 1);
    const pos = (dt) => ((dt - t0) / (t1 - t0)) * 100;
    let ticks = "";
    for (let m = new Date(t0); m < t1; m.setMonth(m.getMonth() + 1))
      ticks += `<span class="m" style="left:${pos(new Date(m.getFullYear(), m.getMonth(), 15))}%">${MON[m.getMonth()]}${m.getMonth() === 0 ? " ’" + String(m.getFullYear()).slice(2) : ""}</span>`;
    const nowP = Math.min(Math.max(pos(TODAY), 0), 100);
    html("#timeline", `<div class="wrap">
      <div class="tl-head"><b>The ${C.year} cycle: submission deadlines</b><div class="tl-key">${Object.keys(COLORS).map((k) => `<span style="--c:${COLORS[k]}">${SHORT[k]}</span>`).join("")}</div></div>
      <div class="tl" id="tl">
        <div class="axis"></div><div class="done" style="width:${nowP}%"></div>${ticks}
        ${all.map((m, i) => `<button class="dot${isPast(m.date) ? " past" : ""}" style="left:${pos(first(m.date))}%;--c:${COLORS[m.id]}" data-i="${i}" aria-label="${esc(fmt(m.date, "year") + ": " + m.group + (m.sub ? " " + m.sub : "") + ", " + m.label)}"></button>`).join("")}
        <div class="conf" style="left:${pos(first(C.start))}%;width:${Math.max(pos(first(C.end)) - pos(first(C.start)), 2)}%">${C.year}</div>
        ${nowP > 0 && nowP < 100 ? `<div class="now" style="left:${nowP}%"><span>Today</span></div>` : ""}
      </div></div>`);
    const tl = document.getElementById("tl");
    let tip;
    const show = (e) => {
      const m = all[e.target.dataset.i]; if (!m) return;
      tip && tip.remove(); tip = document.createElement("div"); tip.className = "tip";
      tip.innerHTML = `<b>${fmt(m.date, "year")}</b>${esc(SHORT[m.id] || m.group)}${m.sub ? " · " + esc(m.sub) : ""}: ${esc(m.label)}`;
      tip.style.left = e.target.style.left; tl.appendChild(tip);
    };
    tl.querySelectorAll(".dot").forEach((d) => { d.addEventListener("mouseenter", show); d.addEventListener("focus", show); d.addEventListener("mouseleave", () => tip && tip.remove()); d.addEventListener("blur", () => tip && tip.remove()); });

    // Audience paths
    const nextFor = (id) => { const m = upcoming(50).find((x) => x.id === id); return m ? `<small>${fmt(m.date)}</small>` : ""; };
    const ic = {
      pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m13 7 4 4"/></svg>',
      plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.5 13.5 3 11l1.5-1.5 8 1L17 6a2 2 0 0 1 3 3l-4.5 4.5 1 8L15 23l-2.5-7.5"/></svg>',
      hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h4l3 3h4a2 2 0 0 0 0-4h-3"/><path d="m7 16 4 4h7l3-5-5-3"/></svg>',
    };
    html("#paths", `
      <article class="path" id="submit"><div class="ic">${ic.pen}</div><h3>Submitting</h3><p>Calls, deadlines and guidelines for every track.</p><ul>
        <li><a href="dates.html">Important dates</a></li>
        <li><a href="#">SIGMOD research papers ${nextFor("sigmod-research")}</a></li>
        <li><a href="#">PODS research papers ${nextFor("pods-research")}</a></li>
        <li><a href="#">Industrial track ${nextFor("industry")}</a></li>
        <li><a href="#">Demonstrations ${nextFor("demos")}</a></li>
        <li><a href="#">Tutorials ${nextFor("tutorials")}</a></li></ul></article>
      <article class="path" id="attend"><div class="ic">${ic.plane}</div><h3>Attending</h3><p>${esc(C.venue.name)}, on the Pacific Coast Highway.</p><ul>
        <li><a href="#">Registration</a></li><li><a href="#">Venue &amp; hotel room block</a></li><li><a href="#">Travel &amp; visas</a></li>
        <li><a href="#">Student travel grants</a></li><li><a href="#">Childcare &amp; accessibility</a></li><li><a href="#">Code of conduct</a></li></ul></article>
      <article class="path"><div class="ic">${ic.hand}</div><h3>Partnering</h3><p>Meet the data management community: researchers, engineers, students.</p><ul>
        <li><a href="#">Sponsorship opportunities</a></li><li><a href="#">Exhibit &amp; recruit</a></li><li><a href="#">Our sponsors</a></li><li><a href="#">Contact the sponsorship chairs</a></li></ul></article>`);

    const todayISO = TODAY.toISOString().slice(0, 10);
    html("#days", C.week.days.map((d) => { const x = first(d.date); return `<div class="day${ph === "live" && d.date === todayISO ? " today" : ""}">
      <span class="dw">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][x.getDay()]}</span><h3>${MON[x.getMonth()]} ${x.getDate()}</h3>
      <ul>${d.blocks.map(([t, k]) => `<li class="${k}">${esc(t)}</li>`).join("")}</ul></div>`; }).join("")
      + (C.week.sample ? "" : ""));
    if (C.week.sample) html("#days-note", "Illustrative structure — replaced by the detailed program once published.");

    html("#feed", C.news.map((n) => `<li><span class="tg">${esc(n.tag)}</span><a href="${n.href}">${esc(n.text)}</a></li>`).join(""));
    html("#speakers", C.keynotes.map((k) => `<div class="spk${k.tba ? " tba" : ""}"><div class="av">${k.tba ? "?" : k.name.split(" ").filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(-2).join("")}</div>
      <div><b>${esc(k.name)}</b><span>${esc(k.title)}${k.aff ? " · " + esc(k.aff) : ""}</span></div></div>`).join(""));
    html("#chairs", C.people.filter((g) => g.key).map((g) => `<div><h3>${esc(g.role)}</h3>${g.list.map(([n, a]) => `<p>${esc(n)}<small>${esc(a)}</small></p>`).join("")}</div>`).join("")
      + `<div class="logos" style="grid-column:1/-1"><b>Sponsors</b>${"<span></span>".repeat(7)}</div>`);
  }

  /* ---------- dates: agenda by month ---------- */
  if (page === "dates") {
    const groups = [...C.deadlines.tables, ...C.deadlines.lists];
    html("#chips", `<button class="chip" aria-pressed="true" data-g="">All tracks</button>${groups.map((g) => `<button class="chip" aria-pressed="false" data-g="${g.id}">${esc(SHORT[g.id] || g.title)}</button>`).join("")}
      <label><input type="checkbox" id="hidepast" checked> Hide past</label><a class="ics" id="ics" href="#">Add to calendar</a>`);
    const a = document.getElementById("ics"); a.href = R.icsHref(); a.download = `sigmod-${C.year}-deadlines.ics`;

    let sel = "";
    const nextD = (upcoming(1)[0] || {}).date;
    function draw() {
      const hide = document.getElementById("hidepast").checked;
      const items = milestones().filter((m) => (!sel || m.id === sel) && (!hide || !isPast(m.date)));
      const byMonth = new Map();
      items.forEach((m) => { const x = first(m.date), k = x.getFullYear() * 12 + x.getMonth(); (byMonth.get(k) || byMonth.set(k, []).get(k)).push(m); });
      let out = [...byMonth.entries()].map(([k, list]) => `<section class="month"><h2>${MONTH[k % 12]}<small>${Math.floor(k / 12)}</small></h2><div>${
        list.map((m) => `<div class="ev${m.deadline ? " dl" : ""}${isPast(m.date) ? " past" : ""}${m.date === nextD && m.deadline ? " next" : ""}">
          <time>${fmt(m.date)}</time>
          <div class="lb">${esc(m.label)}${m.was ? ` <span class="was">(was ${fmt(m.was)})</span>` : ""}<small>${esc(m.group)}${m.sub ? " · " + esc(m.sub) : ""}</small></div>
          <span class="tag${m.deadline ? " dlt" : ""}">${m.deadline ? "Deadline" : "Notice"}</span></div>`).join("")}</div></section>`).join("");
      out += `<section class="month conf"><h2>${MONTH[first(C.start).getMonth()]}<small>${C.year}</small></h2><div class="confcard"><b>${esc(C.edition)}</b>${dateRange("long")} · ${esc(C.city)}, ${esc(C.region)}</div></section>`;
      html("#agenda", items.length ? out : `<p class="empty">Nothing to show — untick “Hide past” to see earlier dates.</p>` + out);
    }
    document.getElementById("chips").addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      sel = b.dataset.g; document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); draw();
    });
    document.getElementById("hidepast").addEventListener("change", draw);
    draw();
  }

  keepQuery();
})();
