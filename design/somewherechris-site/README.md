# SomewhereChris — website design directions

Three directions for the SomewhereChris site (turning ideas into digital
products with AI), each in light and dark mode, plus a mobile pass on
direction A.

| Artboard | Direction |
|---|---|
| `Main.dc.html` / `ADark.dc.html` | A — The Document. Single 760px column, hairline rules, mono step numbers. Closest to the Tally reference in `design.md`. |
| `VariationB.dc.html` / `BDark.dc.html` | B — The Split Ledger. Sticky offer rail, four-column step table. |
| `VariationC.dc.html` / `CDark.dc.html` | C — The Statement. 76px headline, soft-green promise band, full-bleed teal block. |
| `PhoneA.dc.html` / `PhoneADark.dc.html` | Direction A at 390px. |

`canvas.json` positions the artboards and carries the direction notes.

Light and dark come from a single `theme` prop on each artboard, so the two
modes cannot drift apart. Teal lifts from `#008080` to `#4FC3BB` in dark mode
with ink-coloured button text to hold contrast.

Every hard fact is a bracketed placeholder — `[YOUR PRICE]`, `[X weeks]`,
refund terms, testimonials — and needs filling in before this ships.

## Fonts — do not add a stylesheet `<link>` to the helmet

Each artboard renders in its own sandboxed iframe with an opaque origin, so
eight artboards refetch the same Google Fonts stylesheet with no shared cache
between them, and each fetch blocks its own artboard from painting. With a
render-blocking `<link>` in the helmet the canvas took over a minute to mount
all eight artboards (measured: 2 mounted at 18s, 5 at 45s). Injecting the same
stylesheet from `componentDidMount` instead drops that to under 6 seconds.

Fonts therefore load *after* mount, and the fallback stack is what shows until
they arrive — and what PNG/PDF export uses, since export cannot embed Google
Fonts either way. Keep the fallback metrically close to Inter.

## Two outputs

`somewherechris-site.html` is the design canvas — the editable multi-artboard
version. It carries a ~2.5 MB editor payload and can fail to open on a phone
("Something went wrong"), so its artboards are split across three canvas pages
(Light / Dark / Mobile) to cut how many mount at once from eight to three.

`somewherechris-preview.html` is a ~66 KB standalone page built from the same
artboards by `build-preview.py` — direction tabs, a light/dark switch, and no
editor. This is the one to open on a phone or a weak connection. Rebuild it
with `python3 build-preview.py` after any artboard edit.

In the preview the theme holes become CSS custom properties, so light and dark
are one attribute on `:root` rather than eight duplicated artboards. It opens
narrow screens on the mobile artboard, since a 1440px design scaled to fit a
phone lands around 27% and is unreadable.

## Rebuilding the canvas

The published canvas is generated; the `.dc.html` files above are the source.
To regenerate after an edit, re-run the `design` skill's seeder over all eight
artboards plus `canvas.json`, then republish the output to the same artifact
URL.
