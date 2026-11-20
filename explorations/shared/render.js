/* Content partials shared by all designs. Designs differ in chrome + CSS, not in content. */
(function () {
  const { C, fmt, isPast, upcoming, esc } = window.S;
  const nextDate = () => (upcoming(1)[0] || {}).date;

  const trackTag = (t) => `<span class="track track-${t.toLowerCase()}">${esc(t)}</span>`;

  function dateCell(s, isDeadline, next) {
    const cls = [isPast(s) ? "past" : "", s === next && isDeadline ? "next" : "", isDeadline ? "dl" : ""].filter(Boolean).join(" ");
    return `<td class="${cls}"><time datetime="${s.split("/")[0]}">${fmt(s, "year")}</time></td>`;
  }

  function datesTable(t) {
    const next = nextDate();
    return `<section class="dgroup" id="${t.id}">
      <header class="dgroup-head"><h2>${esc(t.title)}</h2>${trackTag(t.track)}<a class="cfp" href="${t.cfp}">Call for papers →</a></header>
      <div class="table-scroll"><table class="dtable">
        <thead><tr><th scope="col"><span class="sr">Milestone</span></th>${t.columns.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${t.rows.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${r.cells.map((c) => dateCell(c, r.deadline, next)).join("")}</tr>`).join("")}</tbody>
      </table></div>
    </section>`;
  }

  function datesList(l) {
    const next = nextDate();
    return `<section class="dgroup" id="${l.id}">
      <header class="dgroup-head"><h2>${esc(l.title)}</h2>${trackTag(l.track)}<a class="cfp" href="${l.cfp}">Call →</a></header>
      <ol class="dlist">${l.items.map((it) => `
        <li class="${[isPast(it.date) ? "past" : "", it.date === next && it.deadline ? "next" : "", it.deadline ? "dl" : ""].join(" ")}">
          <time datetime="${it.date}">${fmt(it.date, "year")}</time>
          <span>${esc(it.label)}${it.was ? ` <span class="was">was <s>${fmt(it.was)}</s></span>` : ""}</span>
        </li>`).join("")}</ol>
    </section>`;
  }

  const allDates = () => C.deadlines.tables.map(datesTable).join("") + C.deadlines.lists.map(datesList).join("");

  const jumpLinks = () =>
    [...C.deadlines.tables, ...C.deadlines.lists].map((g) => `<a href="#${g.id}">${esc(g.title)}</a>`).join("");

  // Calendar export of all future deadlines.
  function icsHref() {
    const ev = window.S.milestones().filter((m) => m.deadline && !isPast(m.date)).map((m) => {
      const day = m.date.split("/")[0].replace(/-/g, "");
      return `BEGIN:VEVENT\r\nUID:${m.id}-${day}-${m.label.replace(/\W/g, "")}@sigmod${C.year}\r\nDTSTART;VALUE=DATE:${day}\r\nSUMMARY:${C.edition}: ${m.group}${m.sub ? " (" + m.sub + ")" : ""} — ${m.label} (AoE)\r\nEND:VEVENT`;
    });
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SIGMOD//Deadlines//EN\r\n${ev.join("\r\n")}\r\nEND:VCALENDAR`;
    return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  }

  function sponsorTiers() {
    return C.sponsors.tiers.map(([tier, n]) => `<div class="tier tier-${tier.toLowerCase()}"><h3>${tier}</h3><div class="logos">${
      Array.from({ length: n }, () => `<span class="logo-slot" aria-hidden="true"></span>`).join("")}</div></div>`).join("");
  }

  window.R = { trackTag, datesTable, datesList, allDates, jumpLinks, icsHref, sponsorTiers };
})();
