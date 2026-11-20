/* The only script on the site (about 2 KB). Pages work without it.
   - Re-marks past and next dates against the current time, so the static pages stay right between builds.
     A date counts as past once 23:59 Anywhere on Earth (AoE, UTC−12) on that day has gone by, wherever the visitor is.
   - Opens and closes the phone menu.
   - ?today=YYYY-MM-DD previews any date (kept on internal links). */
(function () {
  var q = new URLSearchParams(location.search);
  var AOE = "-12:00";
  var today = q.get("today") ? new Date(q.get("today") + "T12:00:00" + AOE) : new Date();
  var end = function (el) { return new Date(el.getAttribute("data-e") + "T23:59:00" + AOE); };
  var start = function (el) { return el.getAttribute("data-d"); };
  var dated = Array.prototype.slice.call(document.querySelectorAll("[data-d]"));
  var next = null;
  dated.forEach(function (el) {
    var past = end(el) < today;
    el.classList.toggle("past", past);
    el.classList.remove("next");
    if (!past && (!next || start(el) < next)) next = start(el);
  });
  dated.forEach(function (el) { if (start(el) === next) el.classList.add("next"); });

  document.querySelectorAll("[data-upcoming]").forEach(function (ul) {
    var n = +ul.getAttribute("data-upcoming"), shown = 0;
    ul.querySelectorAll(":scope > li").forEach(function (li) {
      var show = !li.classList.contains("past") && shown < n;
      li.hidden = !show; if (show) shown++;
    });
    var none = ul.parentNode.querySelector(".none");
    if (none) none.hidden = shown > 0;
  });

  document.querySelectorAll("details.round").forEach(function (d) {
    var open = !!d.querySelector("li:not(.past)");
    d.classList.toggle("is-closed", !open);
  });
  var rounds = document.querySelectorAll(".rounds");
  rounds.forEach(function (r) {
    var first = r.querySelector("details.round:not(.is-closed)");
    r.querySelectorAll("details.round").forEach(function (d) { d.open = d === first; });
  });

  // Sideways-scrolling tab strips (phones): bring the current tab into view.
  document.querySelectorAll(".tabs, .pills").forEach(function (strip) {
    var cur = strip.querySelector(".cur, [aria-current]");
    if (cur && strip.scrollWidth > strip.clientWidth) strip.scrollLeft = cur.offsetLeft - strip.clientWidth / 2 + cur.offsetWidth / 2;
  });

  // Menu filter (Handbook): type to narrow the sidebar links.
  var filter = document.querySelector("[data-filter]");
  if (filter) {
    var groups = document.querySelectorAll(filter.getAttribute("data-filter"));
    filter.hidden = false;
    filter.addEventListener("input", function () {
      var t = filter.value.trim().toLowerCase();
      groups.forEach(function (g) {
        var any = false;
        g.querySelectorAll("li").forEach(function (li) {
          var hit = !t || li.textContent.toLowerCase().indexOf(t) >= 0 || g.querySelector("summary").textContent.toLowerCase().indexOf(t) >= 0;
          li.hidden = !hit; if (hit && !li.querySelector("li")) any = true;
        });
        g.hidden = !any;
        if (t) g.open = any; else g.open = g.hasAttribute("data-open");
      });
    });
  }

  // Section lists that are open on wide screens start folded on phones.
  if (window.matchMedia("(max-width: 900px)").matches) document.querySelectorAll("details.sec-d, details.qcard").forEach(function (d) { d.open = false; });

  var btn = document.querySelector("[data-menu]");
  if (btn) btn.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open);
  });

  if (q.get("today")) document.querySelectorAll("a[href^='/'], a[href^='.']").forEach(function (a) {
    if (a.href.indexOf(location.origin) === 0 && a.href.indexOf("today=") < 0) a.href += (a.href.indexOf("?") < 0 ? "?" : "&") + "today=" + q.get("today");
  });
})();
