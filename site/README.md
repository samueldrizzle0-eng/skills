# SomewhereChris — website

Static HTML and CSS. No framework, no build step, no dependencies. Open a file,
edit it, save it. The whole site is 7 pages and 3 stylesheets.

Built on **Design System v1.0** (`../design/design-system-v1.0.md`), Direction C
("The Statement") from `../design/somewherechris-site/`. Dark throughout: §2.7
scopes the light variant to Substack-adjacent pages and long-form reading, so the
marketing site doesn't use it. The light tokens still ship for later document
pages.

## Pages

| Path | Recipe | Notes |
|---|---|---|
| `index.html` | §7.5 landing page | The main argument. |
| `the-system/` | §7.6 sales page | Waitlist variant. No price is quoted anywhere. |
| `about/` | prose | **Scaffold only — the story has to be Sam's.** |
| `join/` | §7.9 opt-in | One field. Hands off to Substack. |
| `privacy/`, `terms/` | prose | Honest drafts. Not lawyer-reviewed. |
| `404.html` | §6.13 empty state | |

## Running it

```sh
cd site && python3 -m http.server 8181
```

Then open <http://localhost:8181>. Paths are absolute (`/assets/…`), so it has to
be served from this directory rather than opened as a `file://` URL.

## Checking it

```sh
python3 check-site.py
```

Asserts the rules that can be checked mechanically: spacing, radius and type
values come from tokens (§0 rule 1), no raw hex outside `tokens.css` (§0 rule 8),
the §2.6 contrast contract recomputed from the shipped values, the §10
anti-patterns, and per-page basics (lang, title, description, skip link, a CTA on
every page). It is the sibling of
`../design/somewherechris-site/check-system.py`, which does the same for the
artboards.

There is also a Playwright pass that checks all 7 pages at 375, 768 and 1280 for
horizontal overflow, heading order, touch-target height, and unlabelled inputs.

## The waitlist

`join/index.html` holds a plain GET form pointed at Substack's hosted subscribe
page. No JavaScript. If Substack honours the `email` parameter the field arrives
prefilled; if it doesn't, the reader lands on the subscribe page and types it
once. Either way it works.

**This has not been tested against a real publication** — Substack is blocked
from the network this was built on. Confirm it once `[SUBSTACK URL]` is real.

## Placeholders to replace before launch

Every one is written in `[BRACKETS]` so they are greppable:

```sh
grep -rn '\[[A-Z][A-Z ]*\]' --include='*.html' --include='*.xml' --include='*.txt' .
```

- `[SUBSTACK URL]` — the publication root, no trailing slash, e.g. `https://name.substack.com`
- `[SITE URL]` — the live origin, for canonical and Open Graph tags
- `[YEAR]`, `[DATE]`, `[X]`, `[X weeks]`
- `[CONTACT EMAIL]`, `[JURISDICTION]`, `[LEGAL NAME OR BUSINESS]`
- The whole of `about/` below the first heading
- Every testimonial and proof number

## Deploying

`netlify.toml` publishes this directory as-is. Vercel and GitHub Pages need no
config beyond pointing them at `site/`. There is nothing to build.

An `assets/og.png` (1200×630) is referenced by every page and does not exist yet.
Social previews will be blank until it does.

## A note on the duplicated shell

The header and footer are copied into each page, which is the cost of having no
build step. Changing the nav means editing 7 files. If that becomes annoying,
either add a ~20-line assembly script or move to Astro; both are a straight port
since the CSS carries the design.
