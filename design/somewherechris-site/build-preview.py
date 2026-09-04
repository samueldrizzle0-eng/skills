#!/usr/bin/env python3
"""Build somewherechris-preview.html from the .dc.html artboards.

The design canvas is a ~2.5 MB editor payload and can fail to open on a phone.
This produces the same three designs as one ~65 KB page that opens anywhere:
theme tokens become CSS custom properties, so the light/dark switch is a single
attribute on :root instead of eight duplicated artboards.
"""
import json
import re

FILES = ['Main.dc.html', 'VariationB.dc.html', 'VariationC.dc.html', 'PhoneA.dc.html']
FONT_URL = ('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800'
            '&family=IBM+Plex+Mono:wght@400;500&display=swap')


def token_sets(src):
    out = {}
    for name in ('light', 'night'):
        block = re.search(r'const %s = \{(.*?)\};' % name, src, re.S).group(1)
        out[name] = dict(re.findall(r"(\w+):\s*'([^']*)'", block))
    return out


def collect_tokens():
    light, dark = {}, {}
    for f in FILES:
        ts = token_sets(open(f).read())
        for k, v in ts['light'].items():
            assert light.get(k, v) == v, 'light token %s disagrees across artboards' % k
            light[k] = v
        for k, v in ts['night'].items():
            assert dark.get(k, v) == v, 'dark token %s disagrees across artboards' % k
            dark[k] = v
    return light, dark


def extract(path):
    """The artboard's markup, with theme holes rewritten to CSS variables."""
    s = open(path).read()
    body = re.search(r'<x-dc>(.*)</x-dc>', s, re.S).group(1)
    body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S)

    # An SVG presentation attribute cannot take var(); fold it into style instead.
    def fix_svg(m):
        tag = m.group(0)
        found = re.search(r'\sstroke="\{\{t\.(\w+)\}\}"', tag)
        if not found:
            return tag
        decl = 'stroke: var(--%s);' % found.group(1)
        tag = tag.replace(found.group(0), '')
        if re.search(r'\sstyle="', tag):
            return re.sub(r'(\sstyle=")', r'\1' + decl + ' ', tag, count=1)
        return tag[:-1] + ' style="%s">' % decl

    body = re.sub(r'<svg[^>]*>', fix_svg, body)
    body = re.sub(r'\{\{t\.(\w+)\}\}', r'var(--\1)', body)
    assert '{{' not in body, path + ': unresolved template hole'
    return body.strip()


def vars_block(d):
    return '\n'.join('    --%s: %s;' % (k, v) for k, v in sorted(d.items()))


def main():
    light, dark = collect_tokens()
    panels = [
        ('a', 'A — The Document', 1440, extract('Main.dc.html')),
        ('b', 'B — The Split Ledger', 1440, extract('VariationB.dc.html')),
        ('c', 'C — The Statement', 1440, extract('VariationC.dc.html')),
        ('m', 'A — Mobile, 390px', 390, extract('PhoneA.dc.html')),
    ]

    out = ['<title>SomewhereChris Site Preview</title>']
    out.append('''<style>
  :root {
%s
    --chrome-bg: #ffffff; --chrome-fg: #1A1A1A; --chrome-line: #E5E5E0; --chrome-muted: #6b6b66;
  }
  :root[data-theme="dark"] {
%s
    --chrome-bg: #141817; --chrome-fg: #F1F3F1; --chrome-line: #242C2A; --chrome-muted: #9FA9A6;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--chrome-bg); color: var(--chrome-fg);
         font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
                      "Helvetica Neue", Arial, sans-serif; }

  header { position: sticky; top: 0; z-index: 10; background: var(--chrome-bg);
           border-bottom: 1px solid var(--chrome-line); padding: 10px 14px;
           display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .brand { font-size: 14px; font-weight: 600; margin-right: auto; }
  .seg { display: flex; gap: 4px; background: var(--chrome-line);
         padding: 3px; border-radius: 9px; }
  .seg button { appearance: none; border: 0; background: transparent;
                color: var(--chrome-muted); font: inherit; font-size: 13px;
                font-weight: 500; padding: 8px 12px; border-radius: 7px;
                cursor: pointer; min-height: 40px; }
  .seg button[aria-pressed="true"] { background: var(--chrome-bg); color: var(--chrome-fg); }
  .hint { width: 100%%; font-size: 12px; color: var(--chrome-muted); }

  .stage { overflow: hidden; }
  .scaler { transform-origin: top left; }
</style>''' % (vars_block(light), vars_block(dark)))

    out.append('''<header>
  <span class="brand">SomewhereChris — site directions</span>
  <div class="seg" id="dirs">
    <button data-panel="a" aria-pressed="true">A</button>
    <button data-panel="b" aria-pressed="false">B</button>
    <button data-panel="c" aria-pressed="false">C</button>
    <button data-panel="m" aria-pressed="false">Mobile</button>
  </div>
  <div class="seg" id="themes">
    <button data-theme="light" aria-pressed="true">Light</button>
    <button data-theme="dark" aria-pressed="false">Dark</button>
  </div>
  <div class="hint" id="hint"></div>
</header>''')

    for key, _label, width, body in panels:
        out.append('<div class="panel" id="panel-%s" data-width="%d"%s>'
                   % (key, width, '' if key == 'a' else ' hidden'))
        out.append('  <div class="stage"><div class="scaler" style="width:%dpx">' % width)
        out.append(body)
        out.append('  </div></div>')
        out.append('</div>')

    labels = {k: l for k, l, _w, _b in panels}
    out.append('''<script>
  var LABELS = %s;
  var current = "a";

  function fit() {
    var panel = document.getElementById("panel-" + current);
    var stage = panel.querySelector(".stage");
    var scaler = panel.querySelector(".scaler");
    var width = parseInt(panel.dataset.width, 10);
    var scale = Math.min(1, stage.clientWidth / width);
    scaler.style.transform = "scale(" + scale + ")";
    stage.style.height = (scaler.scrollHeight * scale) + "px";
    document.getElementById("hint").textContent = LABELS[current] +
      (scale < 1 ? " — shown at " + Math.round(scale * 100) + "%% to fit your screen" : "");
  }

  function show(key) {
    current = key;
    var dirs = document.getElementById("dirs");
    [].forEach.call(dirs.querySelectorAll("button"), function (x) {
      x.setAttribute("aria-pressed", String(x.dataset.panel === key));
    });
    [].forEach.call(document.querySelectorAll(".panel"), function (p) {
      p.hidden = p.id !== "panel-" + key;
    });
    fit();
  }

  document.getElementById("dirs").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) { show(b.dataset.panel); window.scrollTo(0, 0); }
  });

  document.getElementById("themes").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    document.documentElement.setAttribute("data-theme", b.dataset.theme);
    [].forEach.call(this.querySelectorAll("button"), function (x) {
      x.setAttribute("aria-pressed", String(x === b));
    });
  });

  window.addEventListener("resize", fit);

  // A 1440px design scaled to fit a phone is unreadable, so open narrow
  // screens on the mobile artboard, which renders at 1:1.
  if (window.innerWidth < 700) show("m"); else fit();

  // Fonts load after first paint. A render-blocking <link> costs seconds on a
  // weak connection, which is exactly where this lightweight page has to work.
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "%s";
  link.onload = fit;
  document.head.appendChild(link);
</script>''' % (json.dumps(labels), FONT_URL))

    html = '\n'.join(out)
    open('somewherechris-preview.html', 'w').write(html)
    print('wrote somewherechris-preview.html — %d KB' % (len(html) // 1024))


if __name__ == '__main__':
    main()
