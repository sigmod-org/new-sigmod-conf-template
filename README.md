# SIGMOD/PODS conference site template

A static, lightweight, mobile-friendly website template for the ACM SIGMOD/PODS conference. It follows the menu structure of [2026.sigmod.org](https://2026.sigmod.org/) and the look of [sigmod.org](https://sigmod.org/).

This repository holds **five design proposals** built from the same content (the 2027 conference). The published site's front page compares them.

| # | Proposal | Idea |
|---|---|---|
| 1 | `heritage` | The 2026 site, cleaned up: banner, left menu, page, right menu. |
| 2 | `masthead` | Closest to sigmod.org: one menu bar with dropdowns, a hero card, a side column. |
| 3 | `handbook` | One sidebar with all eight menu groups as folding lists, like documentation. |
| 4 | `landing` | A homepage that leads with dates and one card per group; section buttons on inner pages. |
| 5 | `proceedings` | The lightest: one centered column, a single line of section links, the site map in the footer. |

## How a year's site is edited

Everything a conference chair changes is in `content/`:

```
content/site.yml          conference name, dates, city, logo, accent color, menus, news,
                          important dates, chairs, sponsors
content/pages/**/*.md     one Markdown file per page
```

- **Change a date:** edit `important_dates` in `site.yml`. The homepage box, the Important dates page and every call page update. Past dates turn grey and the next one is highlighted.
- **Edit a page:** open `content/pages/<group>/<page>.md`. Each page's footer shows the file to edit.
- **Add a page:** add a line to `left_menu` or `right_menu` in `site.yml` (for example `Visa Letters: participants/visa`) and create `content/pages/participants/visa.md`. Until the file exists, the menu item shows "coming soon".
- **Hide a menu item:** put `#` in front of its line in `site.yml`.
- **Reuse data inside a page:** put one of these on its own line in a `.md` file: `{{dates}}`, `{{dates: PODS research papers}}`, `{{news}}`, `{{chairs}}`, `{{people}}`, `{{sponsors}}`.
- **Mark a page "new" in the menu:** add it to `highlight` in `site.yml`.

Editors can make these changes on github.com. Every push to `main` rebuilds and republishes the site.

## How it is built

- [Eleventy](https://www.11ty.dev/) turns `content/` into plain HTML pages. Nothing is rendered in the browser.
- `themes/<name>/` holds each design: one page template (`base.njk`) and one stylesheet (`style.css`). `themes/_shared/` holds what every design uses: the shared stylesheet, menu macros and one small script that re-marks past dates and opens the phone menu. Pages work without the script.
- `eleventy.config.js` reads `site.yml`, builds the menus and renders the dates, people and news blocks. Editors never need to open it.
- `.github/workflows/pages.yml` builds all five designs and publishes them with GitHub Pages: on every push to `main`, and once a day so dates stay current.

A conference that picks one design keeps `content/`, `assets/`, `themes/_shared/` and that one theme folder.

## Run it locally

Needs Node.js 18 or newer.

```bash
npm install
```

Preview one design with live reload (`THEME` is a folder name in `themes/`):

```bash
THEME=masthead npm start
```

Build all five designs and the comparison page into `_site/`:

```bash
npm run build
```

```bash
python3 -m http.server 8765 -d _site
```

Then open http://localhost:8765/. Add `?today=2027-06-15` to any page to see how dates look on another day.

## Other folders

- `assets/`: the logo marks, the placeholder banner (replace with a photo of the host city) and other static files.
- `gallery/`: the comparison page published at the site root.
- `explorations/`: the earlier rounds of this exploration (options A–E and the SIGMOD/PODS logo concepts). These render in the browser and are not part of the template.

Content comes from 2027.sigmod.org as of November 2026.
