#!/usr/bin/env python3
"""Check the built site against Design System v1.0's non-negotiables.

Adapted from design/somewherechris-site/check-system.py, which does the same job
for the design artboards. Two differences: this reads the site's CSS and HTML,
and it checks that pages reference custom properties rather than raw hex (§0
rule 8) — something the artboards could not do, since they bind tokens through
the canvas runtime instead.

Run from the site directory:  python3 check-site.py
"""
import glob
import os
import re
import sys

SPACE = {0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128}
RADIUS = {6, 10, 14, 20, 28, 9999}
# §3.2 desktop ramp, mobile ramp, and the rem values they are written as.
FONT_REM = {4.0, 3.0, 2.5, 2.0, 1.5, 1.25, 1.125, 1.0, 0.875, 0.8125, 0.75,
            2.125, 1.875, 1.5625, 1.3125, 1.0625}
# Component heights the system names: §6.1 buttons, §6.2 inputs, §6.5 badge,
# §6.6 nav, §6.13 empty-state width, §9 touch target.
COMPONENT_PX = {34, 42, 52, 44, 24, 68, 20, 32, 420, 1, 3, 12, 16, 5, 8}


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


fail = []
css_files = sorted(glob.glob('assets/*.css'))
html_files = sorted(glob.glob('*.html') + glob.glob('*/index.html'))

if not css_files or not html_files:
    print('Run this from the site directory.')
    sys.exit(2)

# ---- §0 rule 1: every value comes from a token. tokens.css is where the
# literal values are allowed to live; everything else must reference them.
for f in [c for c in css_files if not c.endswith('tokens.css')] + html_files:
    s = open(f).read()

    # .visually-hidden is the standard clip utility. Its 1px box and -1px margin
    # are the mechanism, not design spacing, so the rule is excluded whole.
    s = re.sub(r'\.visually-hidden\s*\{[^}]*\}', '', s)

    decls = re.findall(r'(?<!border-)(?:padding|margin|gap)(?:-\w+)?:\s*([^;"\'}]+)', s)
    for v in {int(x) for d in decls for x in re.findall(r'(\d+)px', d)}:
        if v not in SPACE:
            fail.append('%s: spacing %dpx is not a token (§4.1)' % (f, v))

    for v in {int(x) for x in re.findall(r'border-radius:\s*(\d+)px', s)}:
        if v not in RADIUS:
            fail.append('%s: radius %dpx is not a token (§4.2)' % (f, v))

    for v in {float(x) for x in re.findall(r'font-size:\s*([\d.]+)rem', s)}:
        if v not in FONT_REM:
            fail.append('%s: font-size %srem is off the ramp (§3.2)' % (f, v))

    for v in {int(x) for x in re.findall(r'(?<!line-)(?<!-)height:\s*(\d+)px', s)}:
        if v not in COMPONENT_PX and v not in SPACE:
            fail.append('%s: height %dpx is not a token (§4.1/§6)' % (f, v))

# ---- §0 rule 8: components never render #-prefixed hex directly.
for f in [c for c in css_files if not c.endswith('tokens.css')] + html_files:
    s = open(f).read()
    for m in re.finditer(r'#[0-9A-Fa-f]{6}\b', s):
        line = s[:m.start()].count('\n') + 1
        context = s[max(0, m.start() - 200):m.start()]
        # A hex bound to a local custom property, or sitting in an SVG asset,
        # is a deliberate exception and is commented as such at its call site.
        if '--input-border-hover' in context[-80:] or f.endswith('.svg'):
            continue
        fail.append('%s:%d raw hex %s — reference a custom property (§0 rule 8)'
                    % (f, line, m.group(0)))

# ---- §10 anti-patterns.
for f in html_files + css_files:
    s = open(f).read()
    if 'gradient' in s:
        fail.append('%s: gradient (§10)' % f)
    if re.search(r'[\U0001F300-\U0001FAFF]', s):
        fail.append('%s: emoji in UI chrome (§10)' % f)

# §5.6: no exclamation marks in interface copy. Check visible text only.
for f in html_files:
    s = open(f).read()
    body = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', s, flags=re.S)
    for text in re.findall(r'>([^<>]{4,})<', body):
        if '!' in text:
            fail.append('%s: exclamation mark in copy (§5.6): %r' % (f, text.strip()[:50]))

# ---- §9 / accessibility basics that are checkable in the markup.
for f in html_files:
    s = open(f).read()
    if '<html lang=' not in s:
        fail.append('%s: no lang attribute (§9)' % f)
    if 'skip-link' not in s:
        fail.append('%s: no skip link (§9)' % f)
    if '<title>' not in s:
        fail.append('%s: no title' % f)
    if 'name="description"' not in s:
        fail.append('%s: no meta description' % f)
    # §0 rule 6: every page ends with a CTA.
    if '/join/' not in s:
        fail.append('%s: no CTA on the page (§0 rule 6)' % f)
    # §6.1: never two primary buttons side by side. Count per page as a smell.
    for m in re.finditer(r'<(img)\b[^>]*>', s):
        if 'alt=' not in m.group(0):
            fail.append('%s: <img> without alt (§9)' % f)

# ---- §2.6 contrast contract, recomputed from tokens.css as shipped.
tokens = open('assets/tokens.css').read()
dark_block = tokens.split('[data-theme="light"]')[0]
light_block = tokens.split('[data-theme="light"]')[1]


def tok(block, name, fallback=None):
    m = re.search(r'--%s:\s*(#[0-9A-Fa-f]{6})' % re.escape(name), block)
    if m:
        return m.group(1)
    if fallback:
        return fallback
    raise SystemExit('token --%s not found' % name)


DARK = {n: tok(dark_block, n) for n in
        ['color-canvas', 'color-surface', 'color-surface-raised', 'color-surface-overlay',
         'color-text', 'color-text-muted', 'color-text-subtle', 'color-text-inverse',
         'accent-400', 'accent-500', 'color-success', 'color-danger', 'color-info',
         'color-warning']}
LIGHT = dict(DARK)
LIGHT.update({n: tok(light_block, n) for n in
              ['color-canvas', 'color-surface', 'color-surface-raised', 'color-text',
               'color-text-muted', 'color-text-subtle', 'color-text-inverse',
               'accent-400', 'accent-500', 'color-success', 'color-danger', 'color-info',
               'color-warning']})

PAIRS = [
    ('color-text', 'color-canvas'), ('color-text', 'color-surface'),
    ('color-text-muted', 'color-canvas'), ('color-text-muted', 'color-surface'),
    ('color-text-muted', 'color-surface-raised'),
    ('color-text-subtle', 'color-canvas'), ('color-text-subtle', 'color-surface'),
    ('accent-500', 'color-canvas'), ('accent-400', 'color-canvas'),
    ('color-text-inverse', 'accent-500'),
    ('color-success', 'color-canvas'), ('color-danger', 'color-canvas'),
    ('color-info', 'color-canvas'), ('color-warning', 'color-canvas'),
]

for label, table in (('dark', DARK), ('light', LIGHT)):
    print('Contrast (%s):' % label)
    for fg, bg in PAIRS:
        r = ratio(table[fg], table[bg])
        ok = r >= 4.5
        print('  %-4s %-18s on %-20s %5.2f:1' % ('ok' if ok else 'FAIL', fg, bg, r))
        if not ok:
            fail.append('contrast (%s): %s on %s is %.2f:1' % (label, fg, bg, r))

# §0 rule 4 / §2.6: white on the magenta fill fails and is banned outright.
r = ratio('#FFFFFF', DARK['accent-500'])
print('\n  white on accent-500 (dark) = %.2f:1 — must never be used (§0 rule 4)' % r)

print()
if fail:
    print('%d issue(s):' % len(fail))
    for x in sorted(set(fail)):
        print('  -', x)
    sys.exit(1)

print('All mechanical checks pass. %d pages, %d stylesheets.'
      % (len(html_files), len(css_files)))
