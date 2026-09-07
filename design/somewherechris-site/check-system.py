#!/usr/bin/env python3
"""Check the artboards against Design System v1.0's non-negotiables.

Covers the rules that can be checked mechanically: token-only values (§0 rule 1),
the type ramp (§3.2), radii (§4.2), spacing (§4.1), the contrast contract (§2.6),
and the anti-pattern list (§10).
"""
import glob
import re
import sys

SPACE = {0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128}
RADIUS = {6, 10, 14, 20, 28, 9999}
FONT_SIZE = {64, 48, 40, 32, 24, 20, 18, 16, 14, 13, 12,          # desktop ramp
             34, 30, 25, 21, 17}                                   # mobile ramp
HEIGHT = {34, 42, 52, 68, 44, 24, 20, 1, 56, 32}                   # component heights

def lum(hex_):
    c = [int(hex_[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

fail = []

for f in sorted(glob.glob('*.dc.html')):
    s = open(f).read()

    spacing_decls = re.findall(r'(?<!border-)(?:padding|margin|gap)(?:-\w+)?: ([^;"]+)', s)
    for v in {int(x) for d in spacing_decls for x in re.findall(r'(\d+)px', d)}:
        if v not in SPACE:
            fail.append('%s: spacing %dpx is not a token (§4.1)' % (f, v))
    for v in {int(x) for x in re.findall(r'border-radius: (\d+)px', s)}:
        if v not in RADIUS:
            fail.append('%s: radius %dpx is not a token (§4.2)' % (f, v))
    for v in {int(x) for x in re.findall(r'font-size: (\d+)px', s)}:
        if v not in FONT_SIZE:
            fail.append('%s: font-size %dpx is off the ramp (§3.2)' % (f, v))
    for v in {int(x) for x in re.findall(r'(?<!line-)height: (\d+)px', s)}:
        if v not in HEIGHT and v not in SPACE:
            fail.append('%s: height %dpx is not a token (§4.1/§6)' % (f, v))

    # §3.1 — serif is never used below 20px.
    for m in re.finditer(r'font-family: ([^;]*);\s*font-size: (\d+)px', s):
        if 'Instrument Serif' in m.group(1) and int(m.group(2)) < 20:
            fail.append('%s: serif at %spx (§3.1 floor is 20px)' % (f, m.group(2)))

    # §10 anti-patterns.
    if 'gradient' in s:
        fail.append('%s: gradient present (§10)' % f)
    if re.search(r'[\U0001F300-\U0001FAFF✀-➿]', s):
        fail.append('%s: emoji in UI chrome (§10)' % f)
    if '!' in re.sub(r'!important', '', ''.join(re.findall(r'>([^<]{3,})<', s))):
        fail.append('%s: exclamation mark in UI copy (§5.6)' % f)

    # §0 rule 4 / §2.6 — ink on the magenta fill is never white.
    for m in re.finditer(r'background: \{\{t\.accent500\}\}; color: \{\{t\.(\w+)\}\}', s):
        if m.group(1) != 'inverse':
            fail.append('%s: accent fill paired with %s, not inverse (§0 rule 4)' % (f, m.group(1)))

# §2.6 contrast contract, verified against the token values actually shipped.
DARK = dict(canvas='#0B0A0F', surface='#16141C', raised='#1E1B26', overlay='#262230',
            text='#F5F3F7', muted='#A29DAD', subtle='#888195', inverse='#0B0A0F',
            accent500='#FF2D96', accent400='#FF54A9', success='#34D399')
LIGHT = dict(canvas='#FFFFFF', surface='#FAF9FB', raised='#F3F1F6',
             text='#16141C', muted='#5C5668', subtle='#6F6982', inverse='#FFFFFF',
             accent500='#C9146A', success='#047857')

print('Contrast (dark):')
for fg, bg, floor in [('text','canvas',4.5), ('muted','canvas',4.5), ('subtle','canvas',4.5),
                      ('muted','surface',4.5), ('subtle','raised',4.5),
                      ('accent500','canvas',4.5), ('inverse','accent500',4.5),
                      ('success','canvas',4.5), ('text','surface',4.5)]:
    r = ratio(DARK[fg], DARK[bg])
    ok = 'ok ' if r >= floor else 'FAIL'
    print('  %-4s %-10s on %-8s %5.2f:1' % (ok, fg, bg, r))
    if r < floor:
        fail.append('contrast: %s on %s is %.2f:1 (dark)' % (fg, bg, r))

print('Contrast (light):')
for fg, bg, floor in [('text','canvas',4.5), ('muted','canvas',4.5), ('subtle','canvas',4.5),
                      ('accent500','canvas',4.5), ('inverse','accent500',4.5),
                      ('success','canvas',4.5)]:
    r = ratio(LIGHT[fg], LIGHT[bg])
    ok = 'ok ' if r >= floor else 'FAIL'
    print('  %-4s %-10s on %-8s %5.2f:1' % (ok, fg, bg, r))
    if r < floor:
        fail.append('contrast: %s on %s is %.2f:1 (light)' % (fg, bg, r))

print()
if fail:
    print('%d issue(s):' % len(fail))
    for x in sorted(set(fail)):
        print('  -', x)
    sys.exit(1)
print('All mechanical checks pass.')
