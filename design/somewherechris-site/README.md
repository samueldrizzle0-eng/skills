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

## Rebuilding the canvas

The published canvas is generated; the `.dc.html` files above are the source.
To regenerate after an edit, re-run the `design` skill's seeder over all eight
artboards plus `canvas.json`, then republish the output to the same artifact
URL.
