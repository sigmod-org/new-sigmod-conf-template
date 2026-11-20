# SIGMOD/PODS conference site — design exploration

Three design directions for a reusable SIGMOD/PODS conference website, all rendering the same 2027 content.

```
index.html            comparison page (start here)
shared/content.js     ONE file per conference year: dates, people, news, nav, theme color
shared/core.js        date logic: next deadline, past/next, conference phase, ?today= override
shared/render.js      content partials shared by all designs (dates tables, .ics export, sponsors)
a-society/            Option A: sibling of sigmod.org, top mega-menu
b-handbook/           Option B: modernised three-column SIGMOD layout, searchable sidebar
c-season/             Option C: phase-aware home, deadline timeline, audience entry points
classic/              Option D (round 2): classic, predictable layout, edited as text files
  content/site.yml      dates, menus, news, chairs, accent color: one file per year
  content/pages/*.md    one Markdown file per page
heritage/             Option E (round 3): the 2026.sigmod.org menu structure, same editing model as D
logos/                SIGMOD/PODS logo concepts (index.html compares them; SVG files are reusable)
```

Option E reads its logo from `conference.logo` in `heritage/content/site.yml`. Add `?logo=oval|cylinder|overlap|wordmark` to any page to preview a concept. To hide a menu item until its page is ready, put `#` in front of its line in `site.yml`.

## Option D: how to update it

- **Change a date:** edit `important_dates` in `classic/content/site.yml`. The homepage box, the Important dates page and the call pages all update.
- **Edit a page:** open `classic/content/pages/<section>/<page>.md`. Every page footer shows the path of its file.
- **Add a page:** add a line under `menu` in `site.yml`, for example `Visa letters: attend/visa`, then create `content/pages/attend/visa.md`. Until the file exists, the menu entry shows "coming soon".
- **Reuse dates or people inside a page:** put one of these on its own line: `{{dates}}`, `{{dates: PODS research papers}}`, `{{news}}`, `{{chairs}}` or `{{people}}`.

The prototype renders in the browser. For production, the same `site.yml` and `.md` files would be built into plain HTML pages by a static site generator (such as Eleventy or Hugo) and hosted on GitHub Pages, so editors could also edit them on github.com.

Run locally:

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765/. Add `?today=2027-06-15` (conference week) or `?today=2027-07-10` (after) to any page to see how it changes over the year.

Content comes from 2027.sigmod.org as of November 2026. The "week at a glance" and the sponsor logos are placeholders.
