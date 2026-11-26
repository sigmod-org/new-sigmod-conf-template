# SIGMOD/PODS conference site

A static, lightweight, mobile-friendly website for the ACM SIGMOD/PODS conference. It keeps the structure of recent SIGMOD sites ([2026.sigmod.org](https://2026.sigmod.org/)): a banner, a left menu, the page, and a right menu with upcoming dates. The look follows [sigmod.org](https://sigmod.org/).

The content is SIGMOD/PODS 2028 (Seoul, June 17–23, 2028), taken from [2028.sigmod.org](https://2028.sigmod.org/) in November 2026. The PODS chairs are placeholders (last year's), because the 2028 site lists none yet.

Published at https://sigmod-org.github.io/new-sigmod-conf-template/

## How a year's site is edited

Everything a conference chair changes is in `content/`:

```
content/site.yml          conference name, dates, city, banner, accent color, menus, news,
                          important dates, organizers, sponsors
content/pages/**/*.md     one Markdown file per page
```

- **Change a date:** edit `important_dates` in `site.yml`. The homepage box, the Important Dates page and the call pages update. Past dates turn grey and the next one is highlighted; a deadline counts as past once 23:59 Anywhere on Earth (AoE) has gone by, wherever the visitor is.
- **Edit a page:** open `content/pages/<group>/<page>.md`. Each page's footer shows the file to edit.
- **Add a page:** add a line to `left_menu` or `right_menu` in `site.yml` (for example `Visa Letters: participants/visa`) and create `content/pages/participants/visa.md`. Until the file exists, the menu item appears in gray italics and its page says "coming soon".
- **Hide a menu item:** put `#` in front of its line in `site.yml`.
- **Add news:** add a line under `news` in `site.yml`. It appears on the News page and the homepage.
- **Add an organizer:** add a quoted line `"Name (Affiliation, Country)"` under the right role in `people` in `site.yml`. The groups `Conference`, `SIGMOD` and `PODS` fill the three Organizers pages.
- **Add an organizer photo:** save a square JPEG as `assets/people/<first-last>.jpg` (for example `wook-shin-han.jpg` for "Wook-Shin Han"). Photos appear on the Organizers pages, not in the homepage's chairs block. Anyone without a photo is shown with their initials. Where the current photos came from is listed in `assets/people/SOURCES.md`.
- **Reuse data inside a page:** put one of these on its own line in a `.md` file: `{{dates}}`, `{{dates: SIGMOD research papers}}`, `{{news}}`, `{{chairs}}`, `{{people}}` (everyone) or `{{people: SIGMOD}}` (one group), `{{sponsors}}`.
- **Mark a page "new" in the menu:** add it to `highlight` in `site.yml`.
- **Change the banner:** replace `assets/banner.jpg` and update `banner_credit` in `site.yml`. `banner_position` picks which part of the photo the banner shows.

Editors can make these changes on github.com. Every push to `main` rebuilds and republishes the site.

## How it is built

- [Eleventy](https://www.11ty.dev/) turns `content/` into plain HTML pages. Nothing is rendered in the browser.
- `theme/` holds the page template (`base.njk` with `head.njk`, `macros.njk` and `logobar.njk`), the stylesheet (`style.css`) and one small script (`site.js`) that re-marks past dates in the browser and opens the phone menu. Pages work without the script.
- `eleventy.config.js` reads `site.yml`, builds the menus and renders the dates, people and news blocks. Editors never need to open it.
- `.github/workflows/pages.yml` builds the site and publishes it with GitHub Pages: on every push to `main`, and once a day so dates stay current.

## Run it locally

Needs Node.js 18 or newer.

```bash
npm install
```

Preview with live reload:

```bash
npm start
```

Or build into `_site/` and serve it:

```bash
npm run build
```

```bash
python3 -m http.server 8770 --bind 127.0.0.1 -d _site
```

Then open http://127.0.0.1:8770/. Add `?today=2028-06-20` to any page to see how dates look on another day.

## Assets

- `assets/banner.jpg`: Gwanghwamun, Gyeongbokgung Palace © Korea Heritage Service, KOGL Type 1 (from the 2028 site). The credit is shown on every page, as the licence requires.
- `assets/logos/`: clean redraws of the SIGMOD/PODS logo (`sigmod-pods.svg` as on the 2027 site, `sigmod-pods-oval.svg` without the blue tile) and the ACM logo after the sigmod.org version (`acm.svg`, `acm-white.svg` for dark backgrounds, `acm-mark.svg`), with high-resolution PNG exports. `scripts/make-logos.mjs` regenerates them.
- `assets/people/`: organizer photos.

The earlier design proposals and explorations are in the git history (up to commit `7b65e3d`).
