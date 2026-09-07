# SomewhereChris — website design directions

Three directions for the SomewhereChris site (turning what you already know into
a digital product), built on **Design System v1.0** (`../design-system-v1.0.md`).
Dark is the default; light is the supported variant (§2.7).

| Artboard | Direction |
|---|---|
| `Main.dc.html` / `ALight.dc.html` | A — The Document. 680px prose column, `display-l` serif headline, hairline-separated steps. |
| `VariationB.dc.html` / `BLight.dc.html` | B — The Split Ledger. Sticky offer rail on the system's 4+8 grid split, step table per §6.14. |
| `VariationC.dc.html` / `CLight.dc.html` | C — The Statement. The only direction using `display-xl`; bands alternate canvas and surface. |
| `PhoneA.dc.html` / `PhoneALight.dc.html` | Direction A at 390px, on the mobile type ramp. |

`canvas.json` splits these across three canvas pages (Dark / Light / Mobile) and
carries the direction notes.

## Rules that shaped specific decisions

- **Accent budget (§2.3).** One filled magenta element plus at most two magenta
  text or icon accents per screen. Checklist ticks use `--color-success`, step
  numerals and overlines use `--color-text-muted`, and B's top bar carries no
  button because its sticky rail already holds the primary CTA.
- **Ink on magenta (§0 rule 4).** `#0B0A0F` in dark, `#FFFFFF` in light. This is
  the one place the two modes invert; `check-system.py` asserts it.
- **Serif floor (§3.1).** Instrument Serif is used at `display-xl`, `display-l`,
  `h1` and `h2` only, never below 20px, never in buttons, labels, or nav.
- **Prose measure (§3.3).** Page padding sits outside the prose container so the
  text column is a true 680px rather than 680 minus padding.
- **Anchor definition (§7.5, §5.3).** Every direction carries the definition
  verbatim in an accent callout below the hero.

## Checking

`python3 check-system.py` verifies the mechanical rules: spacing, radius, and
type values come from tokens (§0 rule 1), the serif floor, the contrast contract
(§2.6) recomputed from the shipped hex values, and the §10 anti-patterns
(gradients, emoji in chrome, exclamation marks, white on the accent fill).

## Fonts — do not add a stylesheet `<link>` to the helmet

Each artboard renders in its own sandboxed iframe with an opaque origin, so
eight artboards refetch the same Google Fonts stylesheet with no shared cache
between them, and each fetch blocks its own artboard from painting. With a
render-blocking `<link>` the canvas took over a minute to mount all eight
(measured: 2 at 18s, 5 at 45s). Injecting it from `componentDidMount` instead
drops that under 6 seconds. The fallback stack is what shows until the fonts
arrive, and what PNG/PDF export uses.

## Two outputs

`somewherechris-site.html` is the design canvas — editable, but a ~2.5 MB editor
payload that can fail to open on a phone.

`somewherechris-preview.html` is a ~91 KB standalone page built from the same
artboards by `build-preview.py` — direction tabs, a dark/light switch, no editor.
This is the one to open on a phone. Rebuild it with `python3 build-preview.py`
after any artboard edit. It opens narrow screens on the mobile artboard, since a
1440px design scaled to fit a phone is unreadable.

## Rebuilding the canvas

Re-run the `design` skill's seeder over all eight artboards plus `canvas.json`,
then republish to the same artifact URL with `contract: "0.1.31"`.

## Placeholders

Every hard fact is bracketed — `[YOUR PRICE]`, `[X weeks]`, `[REFUND TERMS]`,
testimonials — and needs filling in before this ships.
