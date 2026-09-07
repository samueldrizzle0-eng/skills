#!/usr/bin/env python3
"""Bundle the 7-page site into one self-contained HTML file.

Everything is inlined: the three stylesheets, the JS, and the favicon. The
result opens by double-clicking, with no server and no network beyond the
Google Fonts stylesheet.

The pages become sections switched by a hash router. Routes are written as
`#/the-system` so they cannot collide with ordinary in-page anchors — `#main`
for the skip link and `#waitlist` on the system page still behave natively.

What this format costs, and why the zip is the one to deploy:
  - one URL, so /join/ cannot be shared or linked as its own page
  - one set of Open Graph tags, so every share previews as the home page
  - no 404 handling by the server, no robots.txt, no sitemap.xml

Run:  python3 build-single.py   ->   samuel-chris-single.html
"""
import base64
import pathlib
import re

SITE = pathlib.Path(__file__).parent
ORIGIN = 'https://samuelchris.netlify.app'

# route slug -> (source file, document title, nav label)
PAGES = [
    ('/',            'index.html',            'Samuel Chris — turn what you know into a digital product'),
    ('/the-system',  'the-system/index.html', 'The system — Samuel Chris'),
    ('/about',       'about/index.html',      'About — Samuel Chris'),
    ('/join',        'join/index.html',       'Join the waitlist — Samuel Chris'),
    ('/privacy',     'privacy/index.html',    'Privacy — Samuel Chris'),
    ('/terms',       'terms/index.html',      'Terms — Samuel Chris'),
    ('/404',         '404.html',              'Page not found — Samuel Chris'),
]


def read(rel):
    return (SITE / rel).read_text()


def main_of(rel):
    """The <main> contents of a page, with its wrapper stripped."""
    m = re.search(r'<main id="main">(.*?)</main>', read(rel), re.S)
    if not m:
        raise SystemExit('no <main> found in ' + rel)
    return m.group(1)


def relink(html):
    """Site paths become hash routes; everything else is left alone."""
    for a, b in [('href="/the-system/"', 'href="#/the-system"'),
                 ('href="/about/"', 'href="#/about"'),
                 ('href="/join/"', 'href="#/join"'),
                 ('href="/privacy/"', 'href="#/privacy"'),
                 ('href="/terms/"', 'href="#/terms"'),
                 ('href="/"', 'href="#/"')]:
        html = html.replace(a, b)
    return html


def build():
    css = '\n'.join(read('assets/' + f) for f in ('tokens.css', 'base.css', 'components.css'))
    js = read('assets/site.js')
    favicon = base64.b64encode((SITE / 'assets/favicon.svg').read_bytes()).decode()

    # The header and footer are identical on every page; take them from home.
    home = read('index.html')
    header = relink(re.search(r'(<header class="site-header">.*?</header>)', home, re.S).group(1))
    footer = relink(re.search(r'(<footer class="site-footer">.*?</footer>)', home, re.S).group(1))

    sections = []
    titles = {}
    for route, src, title in PAGES:
        body = relink(main_of(src))
        sections.append(
            '<section class="route" id="route:%s" hidden>\n%s\n</section>' % (route, body))
        titles[route] = title

    routes_json = '{' + ','.join('"%s":%s' % (r, _js_str(t)) for r, t in titles.items()) + '}'

    return f'''<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titles['/']}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="One repeatable process for turning what you already know into a digital product people pay for, with AI doing the drafting, structuring, and packaging.">
<meta property="og:title" content="Samuel Chris">
<meta property="og:description" content="One repeatable process for turning what you already know into a digital product people pay for.">
<meta property="og:type" content="website">
<meta property="og:url" content="{ORIGIN}/">
<meta property="og:image" content="{ORIGIN}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml;base64,{favicon}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
{css}
</style>
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>

{header}

<main id="main">
{chr(10).join(sections)}
</main>

{footer}

<script>
{js}
</script>

<script>
/* Hash router. Only hashes beginning with "#/" are routes, so the skip link
 * (#main) and the in-page #waitlist anchor keep working normally. */
(function () {{
  "use strict";
  var TITLES = {routes_json};

  function show(route) {{
    if (!TITLES[route]) route = "/404";
    var found = false;
    var sections = document.querySelectorAll(".route");
    for (var i = 0; i < sections.length; i++) {{
      var isMatch = sections[i].id === "route:" + route;
      sections[i].hidden = !isMatch;
      if (isMatch) found = true;
    }}
    if (!found) return show("/404");
    document.title = TITLES[route];

    var links = document.querySelectorAll(".site-nav__link, .nav-panel__link");
    for (var j = 0; j < links.length; j++) {{
      var href = links[j].getAttribute("href") || "";
      if (href.slice(0, 2) === "#/" && href.slice(1) === route) {{
        links[j].setAttribute("aria-current", "page");
      }} else {{
        links[j].removeAttribute("aria-current");
      }}
    }}
  }}

  function routeFromHash() {{
    var h = location.hash;
    if (h.slice(0, 2) !== "#/") return null;
    return h.slice(1).replace(/\\/$/, "") || "/";
  }}

  function closeNavPanel() {{
    // On the multi-page site a nav tap reloads the page, which closes the
    // panel for free. Here nothing reloads, so the panel would sit open on
    // top of the page it just navigated to.
    var panel = document.getElementById("nav-panel");
    var toggle = document.querySelector(".nav-toggle");
    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }}

  function render() {{
    var r = routeFromHash();
    if (r === null) {{
      // Not a route — an in-page anchor, or no hash at all.
      if (!document.querySelector(".route:not([hidden])")) show("/");
      return;
    }}
    show(r);
    closeNavPanel();
    window.scrollTo(0, 0);
  }}

  window.addEventListener("hashchange", render);
  render();
}})();
</script>

</body>
</html>
'''


def _js_str(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


if __name__ == '__main__':
    # Written outside site/ on purpose: inside it, the deploy would serve a
    # duplicate of the whole site at a second URL.
    out = SITE.parent / 'samuel-chris-single.html'
    out.write_text(build())
    print('wrote %s (%d KB)' % (out.name, len(out.read_text()) // 1024))
