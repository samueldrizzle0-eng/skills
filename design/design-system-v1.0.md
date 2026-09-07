# Design System — v1.0

**Owner:** Sam
**Applies to:** website, landing pages, Digital Product HQ, Product Idea Validator, dashboards, lead magnets, and all future digital products
**Mode:** Dark-first. Light is a supported variant, not the default.
**Last updated:** 2026-09-05

---

## 0. How to use this file

> **This file is a build spec. Read this section before building anything.**

You are building for a brand that teaches established service providers how to create scalable income from digital products. The brand voice is **teacher, guide, and peer** — never authority talking down. Calm confidence, no hype.

**Non-negotiable rules:**

1. **Never invent a value.** Every color, size, space, radius, and duration must come from a token in this file. If you need something that isn't here, use the nearest token — don't improvise a new one.
2. **Dark is the default.** Build dark first. Add light mode only when the brief says so, using the light token table in §2.7.
3. **One accent, used sparingly.** Magenta is the loudest thing on the page. If more than roughly 10% of a screen is magenta, it's wrong. Accent goes on: the single primary action, the active state, one focal highlight. Nothing else.
4. **Ink on magenta is always `#0B0A0F`.** Never white. White text on the accent fails contrast (3.46:1).
5. **Every screen has exactly one primary CTA.** Everything else is secondary or ghost.
6. **Every page ends with a CTA.** No exceptions — marketing pages, product pages, empty states, confirmation screens.
7. **Copy follows §5.** Don't write UI text without reading it.
8. **Never render `#`-prefixed hex directly in components.** Reference CSS custom properties from §7.

**When something is ambiguous:** choose the calmer, simpler, more spacious option. "Simplicity > complexity" is a brand rule, not a slogan.

---

## 1. Design principles

These five decide arguments. When two options are defensible, the one that serves a principle higher up this list wins.

**1. Clarity over cleverness.**
The reader is a busy service provider on a phone. If a layout needs explaining, rebuild it. Plain labels beat witty ones.

**2. Space is the primary design tool.**
Before adding a border, a background, or a divider, try adding space instead. Most of the visual hierarchy in this system comes from spacing, not decoration.

**3. One loud thing per screen.**
The magenta accent is a spotlight. Two spotlights mean neither reads. Pick the single action or idea that matters most and let it be the only saturated thing in view.

**4. Calm surfaces, warm words.**
The interface is quiet and near-monochrome. The personality lives in the copy and the illustration, not in gradients or effects.

**5. Motion explains, it never entertains.**
Animation exists to show where something came from or where it went. If it doesn't clarify a relationship, remove it.

---

## 2. Color

### 2.1 The system in one sentence

A violet-tinted near-black canvas, a narrow set of neutral surfaces separated by hairline borders, and one electric magenta accent used at roughly 1–2 elements per screen.

### 2.2 Neutrals (dark mode — default)

| Token | Hex | Use |
|---|---|---|
| `--color-canvas` | `#0B0A0F` | Page background. The floor. Nothing goes behind it. |
| `--color-surface` | `#16141C` | Cards, panels, inputs, sidebars sitting on canvas. |
| `--color-surface-raised` | `#1E1B26` | Hover states on surface, nested cards, table header rows. |
| `--color-surface-overlay` | `#262230` | Modals, dropdowns, popovers, tooltips — anything floating. |
| `--color-border` | `#272430` | Default hairline. 1px. Separates without drawing attention. |
| `--color-border-strong` | `#3A3545` | Input borders, focused containers, dividers that need to be noticed. |
| `--color-text` | `#F5F3F7` | Headings and body. 17.9:1 on canvas. |
| `--color-text-muted` | `#A29DAD` | Secondary copy, labels, captions, timestamps. 7.5:1. |
| `--color-text-subtle` | `#888195` | Placeholders, disabled labels, metadata. 5.3:1 on canvas, 4.5:1 on raised. |
| `--color-text-inverse` | `#0B0A0F` | Text sitting on any saturated fill. |

**Surface stacking rule:** canvas → surface → raised → overlay. Never skip a level, and never place a surface directly on another surface of the same value. If two panels touch, separate them with `--color-border`, not a shadow.

### 2.3 Accent scale — Electric Magenta

| Token | Hex | Use |
|---|---|---|
| `--accent-50` | `#FFF0F8` | Reserved for light mode only. |
| `--accent-100` | `#FFD6EC` | Reserved for light mode only. |
| `--accent-200` | `#FFADD8` | Rare. Large decorative text on dark. |
| `--accent-300` | `#FF7FC0` | Link hover on dark, small accent text. 8.5:1. |
| `--accent-400` | `#FF54A9` | Accent text at body size, icon accents. 6.7:1. |
| **`--accent-500`** | **`#FF2D96`** | **Primary. Buttons, active states, focal highlights. 5.7:1.** |
| `--accent-600` | `#E0197C` | Button hover fill (darker press feel), light-mode-safe text. |
| `--accent-700` | `#B31161` | Button active/pressed fill. |
| `--accent-800` | `#7D0B44` | Deep fills, chart low end. |
| `--accent-900` | `#4A0628` | Reserved. Almost never used. |
| `--accent-soft` | `rgba(255, 45, 150, 0.12)` | Tinted backgrounds behind accent content. |
| `--accent-ring` | `rgba(255, 45, 150, 0.40)` | Focus rings and glows. |

**Accent budget per screen:** one filled magenta element, plus up to two magenta text or icon accents. Anything more and the spotlight stops working.

### 2.4 Support colors

Used for data visualization, secondary highlights, and category coding. Never used for primary actions.

| Token | Hex | Contrast on canvas | Use |
|---|---|---|---|
| `--color-cyan` | `#3DDCFF` | 12.1:1 | Secondary data series, "new"/live indicators. |
| `--color-violet` | `#A78BFA` | 7.3:1 | Third data series, AI-related affordances. |

### 2.5 Semantic colors

| Token | Hex | Contrast on canvas | Use |
|---|---|---|---|
| `--color-success` | `#34D399` | 10.3:1 | Completed steps, validated states, positive deltas. |
| `--color-warning` | `#FBBF24` | 11.8:1 | Needs attention, incomplete, "validate further". |
| `--color-danger` | `#FB7185` | 7.3:1 | Errors, destructive actions, "do not build". |
| `--color-info` | `#38BDF8` | 9.2:1 | Neutral notices, tips, help text. |

Each has a soft background variant at 12% alpha for callouts and badges:

```
--success-soft: rgba(52, 211, 153, 0.12);
--warning-soft: rgba(251, 191, 36, 0.12);
--danger-soft:  rgba(251, 113, 133, 0.12);
--info-soft:    rgba(56, 189, 248, 0.12);
```

**Ink on any saturated fill (accent or semantic) is always `--color-text-inverse` (`#0B0A0F`).** All five pass AA against dark ink; all five fail against white.

### 2.6 Contrast contract

Every pairing below has been verified. Do not deviate.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--color-text` | `--color-canvas` | 17.89:1 | AAA |
| `--color-text` | `--color-surface` | 16.55:1 | AAA |
| `--color-text` | `--color-surface-overlay` | ~14:1 | AAA |
| `--color-text-muted` | `--color-canvas` | 7.48:1 | AAA |
| `--color-text-muted` | `--color-surface-raised` | 6.42:1 | AA+ |
| `--color-text-subtle` | `--color-canvas` | 5.28:1 | AA |
| `--color-text-subtle` | `--color-surface-raised` | 4.53:1 | AA (minimum) |
| `--color-text-subtle` | `--color-surface-overlay` | 4.15:1 | **FAILS — use `--color-text-muted`** |
| `--accent-500` | `--color-canvas` | 5.70:1 | AA |
| `--accent-500` | `--color-surface-raised` | 4.89:1 | AA |
| `--accent-500` | `--color-surface-overlay` | 4.48:1 | **FAILS — use `--accent-400`** |
| `--accent-400` | `--color-surface-overlay` | 5.24:1 | AA |
| `--color-text-inverse` | `--accent-500` | 5.70:1 | AA |
| `--color-text-inverse` | `--color-success` / `--color-warning` / `--color-danger` | 7.3–11.8:1 | AA / AAA |
| `#FFFFFF` | `--accent-500` | 3.46:1 | **FAILS — never use** |

Rules that follow from this table:

- `--color-text-subtle` is the floor. Never introduce a dimmer neutral.
- **On `--color-surface-overlay` (modals, dropdowns, tooltips), the dimmest permitted text is `--color-text-muted`, and the accent steps up to `--accent-400`.** Overlays are the one surface where the bottom of each scale drops out.
- Accent-500 as *text* is fine on canvas, surface, and raised.
- Borders are decorative and exempt from text contrast requirements, but any border carrying meaning (an error outline) must be paired with an icon or label — never color alone.

### 2.7 Light mode variant

Used for: Substack-adjacent pages, printable documents, and any product deliverable meant to be read for a long time. Same structure, remapped values.

| Token | Light value | Notes |
|---|---|---|
| `--color-canvas` | `#FFFFFF` | |
| `--color-surface` | `#FAF9FB` | |
| `--color-surface-raised` | `#F3F1F6` | |
| `--color-surface-overlay` | `#FFFFFF` | Elevated by shadow, not by tint. |
| `--color-border` | `#E6E3EC` | |
| `--color-border-strong` | `#CFC9D9` | |
| `--color-text` | `#16141C` | 18.3:1 |
| `--color-text-muted` | `#5C5668` | 7.0:1 |
| `--color-text-subtle` | `#6F6982` | 5.2:1 |
| `--color-text-inverse` | `#FFFFFF` | |
| **accent (primary)** | `#C9146A` | 5.5:1 on white. `--accent-500` is too bright for light backgrounds. |
| accent hover | `#A80F57` | 7.3:1 |
| `--color-success` | `#047857` | 5.5:1 |
| `--color-warning` | `#92660A` | 5.1:1 |
| `--color-danger` | `#BE123C` | 6.3:1 |
| `--color-info` | `#0369A1` | 5.9:1 |

**In light mode, ink on the accent fill is `#FFFFFF` (5.54:1)** — the inverse of the dark-mode rule. This is the single place the two modes diverge in logic.

---

## 3. Typography

### 3.1 Families

| Role | Family | Fallback stack | Why |
|---|---|---|---|
| Display / headline | **Instrument Serif** | `Fraunces, 'Times New Roman', Georgia, serif` | Editorial weight. Signals "essay and teacher", not "SaaS dashboard". Carries the Substack-first positioning into the product. |
| Body / UI | **Inter** | `Geist, -apple-system, 'Segoe UI', system-ui, sans-serif` | Neutral, tall x-height, excellent at 14–18px on dark backgrounds. |
| Mono | **JetBrains Mono** | `'SF Mono', Menlo, Consolas, monospace` | Prompts, code, token values, data tables. |

**Where the serif is allowed:** display sizes, h1, h2, pull quotes, and the anchor definition when quoted. **Where it is not:** buttons, labels, form fields, navigation, table headers, badges, anything under 20px. Small serif on dark backgrounds smears.

### 3.2 Scale

Desktop values. Mobile values in the right column apply below `md` (768px).

| Token | Family | Size / Line height | Weight | Tracking | Mobile |
|---|---|---|---|---|---|
| `--text-display-xl` | serif | 64 / 1.05 | 400 | -0.03em | 40 / 1.1 |
| `--text-display-l` | serif | 48 / 1.10 | 400 | -0.02em | 34 / 1.15 |
| `--text-h1` | serif | 40 / 1.15 | 400 | -0.02em | 30 / 1.2 |
| `--text-h2` | serif | 32 / 1.20 | 400 | -0.015em | 25 / 1.25 |
| `--text-h3` | sans | 24 / 1.30 | 600 | -0.01em | 21 / 1.3 |
| `--text-h4` | sans | 20 / 1.35 | 600 | 0 | 18 / 1.35 |
| `--text-body-lg` | sans | 18 / 1.65 | 400 | 0 | 17 / 1.6 |
| `--text-body` | sans | 16 / 1.60 | 400 | 0 | 16 / 1.6 |
| `--text-body-sm` | sans | 14 / 1.55 | 400 | 0 | 14 / 1.55 |
| `--text-caption` | sans | 13 / 1.45 | 400 | 0 | 13 / 1.45 |
| `--text-overline` | sans | 12 / 1.20 | 600 | 0.08em | 12 / 1.2 |
| `--text-mono` | mono | 14 / 1.50 | 400 | 0 | 13 / 1.5 |

`--text-overline` is always uppercase and always `--color-text-muted` or `--accent-400`. It labels sections; it never carries content.

### 3.3 Typographic rules

- **Measure:** body text never exceeds **68 characters** per line. On marketing pages this means a `680px` max-width for prose regardless of container width.
- **Serif headings render at weight 400.** Instrument Serif has no useful bold. If a heading needs more presence, increase size, not weight.
- **Negative tracking on serif only.** Sans headings sit at 0 or -0.01em. Never tighten body text.
- **One display size per page.** `display-xl` appears once, at the top, or not at all.
- **Paragraph spacing** is `--space-4` (16px) between paragraphs, `--space-8` (32px) before a new h3, `--space-12` (48px) before a new h2.
- **No justified text. No hyphenation. No all-caps runs longer than three words** except `--text-overline`.
- **Numerals:** use tabular figures (`font-variant-numeric: tabular-nums`) in tables, dashboards, and anywhere numbers stack vertically.

---

## 4. Space, shape, depth, motion

### 4.1 Spacing scale

4px base. Use only these values.

| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | Icon-to-label gap, badge padding. |
| `--space-2` | 8 | Tight internal padding, chip gaps. |
| `--space-3` | 12 | Input vertical padding, small button padding. |
| `--space-4` | 16 | Default gap. Card padding on mobile. Paragraph spacing. |
| `--space-5` | 20 | Button horizontal padding (md). |
| `--space-6` | 24 | Card padding (desktop), grid gutter, stack gap between related blocks. |
| `--space-8` | 32 | Gap between distinct component groups. |
| `--space-10` | 40 | Card padding on feature cards. |
| `--space-12` | 48 | Sub-section spacing within a page section. |
| `--space-16` | 64 | Section padding, mobile. |
| `--space-20` | 80 | Section padding, tablet. |
| `--space-24` | 96 | Section padding, desktop. The default rhythm between marketing sections. |
| `--space-32` | 128 | Hero top/bottom padding on desktop only. |

**Rule:** if you're choosing between two adjacent values, take the larger one. This system errs spacious.

### 4.2 Radius

| Token | px | Use |
|---|---|---|
| `--radius-sm` | 6 | Badges, chips, small tags, checkboxes. |
| `--radius-md` | 10 | Buttons, inputs, select, small cards. **The default.** |
| `--radius-lg` | 14 | Cards, panels, callouts. |
| `--radius-xl` | 20 | Feature cards, modals, hero media. |
| `--radius-2xl` | 28 | Full-bleed image containers, large illustration frames. |
| `--radius-full` | 9999 | Avatars, pills, toggles, progress bars. |

Nested radii: the inner radius equals the outer radius minus the padding between them. A `--radius-xl` (20) card with `--space-6` (24) padding holds a child at `--radius-md` (10), not another 20.

### 4.3 Elevation

On a near-black canvas, drop shadows barely read. **Elevation in this system is communicated by surface value + border, with shadow as reinforcement only.**

| Level | Surface | Border | Shadow |
|---|---|---|---|
| 0 — flat | `--color-canvas` | none | none |
| 1 — card | `--color-surface` | 1px `--color-border` | none |
| 2 — hover | `--color-surface-raised` | 1px `--color-border-strong` | `0 4px 16px rgba(0,0,0,0.5)` |
| 3 — overlay | `--color-surface-overlay` | 1px `--color-border-strong` | `0 16px 48px rgba(0,0,0,0.6)` |
| 4 — focal | `--color-surface` | 1px `--accent-ring` | `0 0 0 1px rgba(255,45,150,0.35), 0 8px 32px rgba(255,45,150,0.18)` |

Level 4 is the **accent glow**. Use it for the one thing you want looked at — the recommended plan, the unlocked step, the active quiz answer. Once per screen.

```
--shadow-sm:   0 1px 2px rgba(0,0,0,0.40);
--shadow-md:   0 4px 16px rgba(0,0,0,0.50);
--shadow-lg:   0 16px 48px rgba(0,0,0,0.60);
--glow-accent: 0 0 0 1px rgba(255,45,150,0.35), 0 8px 32px rgba(255,45,150,0.18);
```

### 4.4 Motion

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | 120ms | Color, opacity, border on hover. |
| `--duration-fast` | 180ms | Button press, checkbox, toggle. |
| `--duration-base` | 240ms | Dropdowns, tooltips, tab switches. |
| `--duration-slow` | 400ms | Modals, drawers, step transitions, page-level reveals. |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default. Fast out, settles gently. |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits. |
| `--ease-spring` | `cubic-bezier(0.34, 1.4, 0.5, 1)` | Entrances that should feel alive. Use rarely. |

**Rules:**
- Transition specific properties, never `all`.
- Entrances: fade + 8px translate up. Exits: fade only.
- Nothing on the page moves more than 24px.
- Wrap every non-essential animation in `@media (prefers-reduced-motion: reduce)` and disable it there.
- No looping animation except a loading spinner and a single progress indicator.

### 4.5 Iconography

- **Library:** Lucide. Do not mix icon sets.
- **Stroke:** 1.5px at all sizes.
- **Sizes:** 16 (inline with body-sm), 20 (default, buttons and nav), 24 (section headers), 32 (feature cards, empty states).
- **Color:** inherits `currentColor`. Icons are `--color-text-muted` by default and `--color-text` or `--accent-500` when active.
- **Never** use an icon alone for a destructive or ambiguous action. Pair with a label or a tooltip.

### 4.6 Illustration

The reference direction is hand-drawn single-weight line art on the canvas color, with sparse magenta spot marks — loose, imperfect, human. It is the counterweight to an otherwise precise interface.

- Line: 2px, `--color-text-muted`, no fills.
- Accents: small magenta ticks, plus-marks, and underlines — no more than three per illustration.
- Never photographic. Never 3D-rendered. Never stock-vector-with-gradient.
- One illustration per page section maximum, and never inside a component.

---

## 5. UI voice and content style

The interface talks the way Sam writes: short sentences, plain words, teacher-not-guru, always pointing at the next action.

### 5.1 The four voice rules

1. **Talk to one person.** "your product", not "users' products". Second person, always.
2. **Verb-first and specific.** Every button says what happens. "Start the quiz", not "Continue". "Validate my idea", not "Submit".
3. **Say the hard thing kindly.** When something fails or scores badly, name it plainly, then give the next step. No euphemism, no false cheer.
4. **End every surface with a way forward.** Even a confirmation screen offers a next action.

### 5.2 Voice calibration

| Trait | We are | We are not |
|---|---|---|
| Posture | Peer who's a few steps ahead | Expert on a stage |
| Energy | Calm, confident, unhurried | Hyped, urgent, exclamation-heavy |
| Proof | Concrete examples and steps | Big claims and adjectives |
| Complexity | One idea per screen | Comprehensive and exhausting |
| Humor | Dry, occasional, never at the reader's expense | Jokey, meme-y |

### 5.3 Recurring phrases

These belong to the brand. Use them where they land naturally — as section transitions, empty states, or step intros. Don't force them, and don't use more than one per page.

- "Let's break it down further."
- "Taking action > preparation."
- "Simplicity > complexity."
- **Anchor definition** (quote verbatim when defining the category): *"A digital product is a piece of knowledge or experience packaged once and sold repeatedly."*
- **North Star question** (use in decision-point UI): *"Does this move money closer, or does it move money further away?"*

### 5.4 Copy patterns by surface

**Buttons** — verb + object, sentence case, 1–4 words, no trailing punctuation.
✅ `Start the quiz` · `Validate my idea` · `See my results` · `Save and continue`
❌ `Submit` · `Click Here` · `LET'S GO!!!` · `Proceed to the next step of the process`

**Headings** — a claim or a question, not a label.
✅ `You don't need a bigger audience.` · `What are you already teaching for free?`
❌ `Introduction` · `Overview` · `Step 2`

**Empty states** — three parts: what's missing (one line), why it matters (one line), the action (a button).
> **Nothing saved yet.**
> Your validated ideas will live here so you can compare them side by side.
> `[ Validate my first idea ]`

**Errors** — what happened, in plain words, then the fix. Never blame the reader, never expose system language.
✅ `That email address is missing an @. Check it and try again.`
❌ `Invalid input: field 'email' failed validation (ERR_422)`

**Loading** — say what's happening, not "Loading…".
✅ `Reading your answers…` · `Checking what's already out there…`

**Success** — confirm, then point forward.
✅ `Saved. Your idea scored 74 — that's a Build. Here's what to do first.`

**Locked / gated states** — never scold. State the condition and the unlock.
✅ `Finish the quiz to unlock this step.`
❌ `Access denied. Complete previous steps.`

### 5.5 Terminology

Use these exact terms; don't introduce synonyms mid-product.

| Use | Not |
|---|---|
| digital product | info product, infoproduct, offer stack |
| service provider | freelancer, solopreneur, creator (unless quoting) |
| idea | concept, opportunity |
| validate | verify, vet, check |
| step | module, chapter, lesson |
| skill | template, asset, tool (when referring to the Claude skill library) |

### 5.6 Mechanics

- Sentence case everywhere except `--text-overline`.
- No exclamation marks in UI copy. One per marketing page, maximum.
- No em dashes in buttons, labels, or form copy. Fine in long-form body text, used sparingly.
- Numerals as digits from 1 up ("3 steps", not "three steps").
- Oxford comma on.
- Contractions on. "You'll", "don't", "it's" — this is spoken register.

---

## 6. Components

Every component below lists **anatomy → sizes → states**. States are non-optional: build all of them or the component isn't done.

### 6.1 Button

**Variants**

| Variant | Fill | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--accent-500` | `--color-text-inverse` | none | The one action per screen. |
| Secondary | `--color-surface` | `--color-text` | 1px `--color-border-strong` | Alternative actions. |
| Ghost | transparent | `--color-text-muted` | none | Tertiary, toolbar, cancel. |
| Danger | `--color-danger` | `--color-text-inverse` | none | Destructive, confirmed. |
| Link | transparent | `--accent-400` | none | Inline navigation. Underline on hover. |

**Sizes**

| Size | Height | Padding X | Text | Radius | Icon |
|---|---|---|---|---|---|
| sm | 34px | `--space-3` (12) | `--text-body-sm` 500 | `--radius-md` | 16 |
| md | 42px | `--space-5` (20) | `--text-body-sm` 600 | `--radius-md` | 20 |
| lg | 52px | `--space-6` (24) | `--text-body` 600 | `--radius-md` | 20 |

**States (all variants)**

| State | Treatment |
|---|---|
| Default | As above. |
| Hover | Primary → `--accent-600`. Secondary → `--color-surface-raised`. Ghost → `--color-surface`. 120ms. |
| Active | Primary → `--accent-700`, `transform: translateY(1px)`. |
| Focus-visible | `outline: 2px solid var(--accent-ring); outline-offset: 2px`. Same ring for every interactive element in the system. |
| Disabled | `opacity: 0.4; cursor: not-allowed`. No hover response. |
| Loading | Label stays in place, opacity 0.6; 16px spinner replaces the leading icon. Button is disabled but retains width — never let it collapse. |

**Rules:** minimum touch target 44×44 (use invisible padding on `sm` if needed). Icon sits left of the label except for "next"-style forward arrows. Never two primary buttons side by side.

### 6.2 Input, textarea, select

**Anatomy:** label (`--text-body-sm`, 500, `--color-text`) → field → help text or error (`--text-caption`).

| Property | Value |
|---|---|
| Height | 44px (textarea: min 120px) |
| Background | `--color-surface` |
| Border | 1px `--color-border-strong` |
| Radius | `--radius-md` |
| Padding | `--space-3` `--space-4` |
| Text | `--text-body` (16px — never smaller; iOS zooms below 16) |
| Placeholder | `--color-text-subtle` |
| Label gap | `--space-2` above field |
| Help text gap | `--space-2` below field |

**States**

- **Hover:** border → `#463F52`.
- **Focus:** border → `--accent-500`, plus `box-shadow: 0 0 0 3px var(--accent-ring)`.
- **Filled:** identical to default. No special styling.
- **Error:** border → `--color-danger`, message below in `--color-danger` with a 16px alert icon. Never rely on the border alone.
- **Disabled:** background `--color-canvas`, text `--color-text-subtle`, `cursor: not-allowed`.

**Rules:** labels are always visible — no placeholder-as-label. Required fields marked with a `--color-text-muted` "(required)" in the label, not an asterisk. Help text appears before the user errs, not after.

### 6.3 Checkbox, radio, toggle

| Component | Size | Unchecked | Checked |
|---|---|---|---|
| Checkbox | 20×20, `--radius-sm` | `--color-surface`, 1px `--color-border-strong` | `--accent-500` fill, `--color-text-inverse` check icon |
| Radio | 20×20, `--radius-full` | same as checkbox | 2px `--accent-500` ring, 8px `--accent-500` center dot |
| Toggle | 44×24 track, `--radius-full` | `--color-border-strong` track, `--color-text-muted` 18px knob | `--accent-500` track, `--color-text` knob, knob slides 180ms |

Label sits right of the control with `--space-3` gap, vertically centered, and the whole label is clickable.

### 6.4 Card

**Base card**

```
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
padding: var(--space-6);   /* --space-4 below md */
```

**Variants**

| Variant | Change |
|---|---|
| Interactive | Hover → `--color-surface-raised`, border → `--color-border-strong`, 120ms. Cursor pointer. Whole card is the click target. |
| Feature | `--radius-xl`, `--space-10` padding, 32px icon at top in `--accent-500`. |
| Focal | Elevation level 4 (`--glow-accent`) + 1px `--accent-ring` border. Once per screen. |
| Locked | `opacity: 0.5`, no hover, 20px lock icon top-right in `--color-text-subtle`, unlock condition as caption at the bottom. |

**Card content order:** icon (optional) → overline (optional) → heading → body → action. Never more than one action per card.

### 6.5 Badge / pill

Height 24px, `--radius-full`, `--space-1` `--space-3` padding, `--text-caption` at weight 600.

| Type | Background | Text |
|---|---|---|
| Neutral | `--color-surface-raised` | `--color-text-muted` |
| Accent | `--accent-soft` | `--accent-300` |
| Success | `--success-soft` | `--color-success` |
| Warning | `--warning-soft` | `--color-warning` |
| Danger | `--danger-soft` | `--color-danger` |
| Solid | `--accent-500` | `--color-text-inverse` |

Badges are labels, never buttons. If it's clickable, it's a chip — add a hover state and a 16px close icon.

### 6.6 Navigation

**Top nav (marketing)**
Height 68px. Background `rgba(11,10,15,0.8)` with `backdrop-filter: blur(12px)`. Bottom border 1px `--color-border` that appears only after 24px of scroll. Wordmark left, links center or right in `--text-body-sm` `--color-text-muted` (active/hover → `--color-text`), one `md` primary button far right. Below `md`: wordmark + hamburger, panel slides down full-width from the top.

**Sidebar (app)**
Width 260px, background `--color-surface`, right border 1px `--color-border`. Items: 40px tall, `--radius-md`, `--space-3` padding, 20px icon + `--text-body-sm`. Active item = `--accent-soft` background, `--color-text` label, `--accent-500` icon, and a 2px `--accent-500` bar on the left edge. Section headers use `--text-overline`. Collapses to a bottom tab bar below `md`.

### 6.7 Modal / dialog

Overlay `rgba(11,10,15,0.72)` with `backdrop-filter: blur(4px)`. Panel: `--color-surface-overlay`, `--radius-xl`, `--space-8` padding, `--shadow-lg`, max-width 520px (560px for forms). Header `--text-h3` with a ghost close button top-right. Footer actions right-aligned, secondary then primary, `--space-3` gap.

Entrance: fade + scale 0.98→1 over `--duration-slow` with `--ease-standard`. Exit: fade only, `--duration-base`. Focus traps inside; Esc closes; focus returns to the trigger on close. Below `sm`, the modal becomes a bottom sheet: full width, `--radius-xl` on top corners only, slides up.

### 6.8 Toast

Bottom-right on desktop, top-center on mobile. `--color-surface-overlay`, `--radius-lg`, `--shadow-lg`, `--space-4`, max-width 400px. A 3px left bar carries the semantic color. Auto-dismiss at 5s (never for errors — those require a dismiss). Maximum three stacked; older ones collapse.

### 6.9 Tabs

Underline style only. Tab: `--text-body-sm` 500, `--color-text-muted`, `--space-3` `--space-4` padding. Active: `--color-text` with a 2px `--accent-500` bottom border that slides between tabs over `--duration-base`. Container has a 1px `--color-border` bottom edge. Below `sm`, tabs scroll horizontally with a fade mask on the right.

### 6.10 Progress and step indicator

Critical for the DPHQ four-step flow and any sequential product.

**Linear progress:** 6px tall, `--radius-full`, track `--color-surface-raised`, fill `--accent-500`, width transitions over `--duration-slow`.

**Step indicator:** a horizontal row of numbered nodes joined by 2px connectors.

| Step state | Node | Connector | Label |
|---|---|---|---|
| Complete | `--color-success` fill, `--color-text-inverse` check | `--color-success` | `--color-text-muted` |
| Current | `--accent-500` fill, `--color-text-inverse` number, `--glow-accent` | `--color-border` | `--color-text`, weight 600 |
| Upcoming | `--color-surface` fill, 1px `--color-border-strong`, `--color-text-subtle` number | `--color-border` | `--color-text-subtle` |
| Locked | as upcoming, number replaced by 16px lock icon | `--color-border` | `--color-text-subtle` |

Node 32px, `--radius-full`. Below `md`, collapse to "Step 2 of 4" plus a linear progress bar.

### 6.11 Quiz / selectable option card

The core interaction of the quiz and validator flows.

Full-width card, min-height 64px, `--radius-lg`, `--space-4` `--space-5` padding, `--color-surface`, 1px `--color-border`. Content: letter chip (A/B/C, 28px, `--radius-md`, `--color-surface-raised`, `--text-body-sm` 600) + option text `--text-body`.

| State | Treatment |
|---|---|
| Hover | Background `--color-surface-raised`, border `--color-border-strong`. |
| Selected | Border 1px `--accent-500`, background `--accent-soft`, letter chip flips to `--accent-500` fill with `--color-text-inverse` text, `--glow-accent` applied. |
| Disabled | `opacity: 0.4`. |

Options stack with a `--space-3` gap. Never more than five per question. Selecting one does not auto-advance — the reader confirms with a primary button.

### 6.12 Callout

Left border 3px in the semantic color, background the matching `-soft` token, `--radius-md`, `--space-4` padding, 20px icon top-left, `--text-body-sm` content. Four types: info, success, warning, danger. Plus **accent callout** (`--accent-soft` / `--accent-500` border) reserved for the anchor definition and North Star question — the brand's own voice speaking.

### 6.13 Empty state

Centered, max-width 420px, `--space-16` vertical padding. Order: illustration or 32px icon in `--color-text-subtle` → heading `--text-h4` → body `--text-body-sm` in `--color-text-muted` → primary button. Copy follows the three-part pattern in §5.4.

### 6.14 Table

Header row: `--color-surface-raised`, `--text-overline`, `--color-text-muted`, 44px tall. Body rows: 56px tall, 1px `--color-border` bottom, hover → `--color-surface`. Cells `--space-4` horizontal padding, `--text-body-sm`. Numeric columns right-aligned with tabular figures. Below `md`, tables become stacked cards — one card per row, label-value pairs — never a horizontal scroll of a real table.

### 6.15 Tooltip

`--color-surface-overlay`, 1px `--color-border-strong`, `--radius-md`, `--space-2` `--space-3`, `--text-caption`, max-width 240px, `--shadow-md`. 300ms open delay, no close delay. Never contains an interactive element. Never the only place information exists.

### 6.16 Code / prompt block

`--color-canvas` background inside a `--color-surface` card, 1px `--color-border`, `--radius-md`, `--space-4`, `--text-mono`, `--color-text-muted`. Copy button top-right (ghost, sm), confirming with a toast. Used heavily for the Claude skill library — treat prompts as first-class content, not decoration.

---

## 7. Layout and page patterns

### 7.1 Breakpoints

| Name | Min-width | Design target |
|---|---|---|
| `sm` | 640px | Large phone |
| `md` | 768px | Tablet — the point where sidebars and multi-column grids appear |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop — the primary design canvas |
| `2xl` | 1536px | Large desktop — content stays capped, gutters grow |

Design mobile-first. Every layout must be verified at 375px before it ships.

### 7.2 Containers

| Token | Max-width | Use |
|---|---|---|
| `--container-prose` | 680px | Long-form reading. Articles, product docs, single-question flows. |
| `--container-content` | 1120px | Default marketing and app content. |
| `--container-wide` | 1320px | Dashboards, wide tables, image-heavy sections. |
| `--container-full` | 100% | Full-bleed backgrounds only — inner content still uses a container. |

Horizontal page padding: `--space-4` (16) below `md`, `--space-8` (32) at `md`, `--space-12` (48) at `lg` and up.

### 7.3 Grid

12 columns, `--space-6` (24) gutter at `md` and up, single column below. Common splits: 12 (full), 6+6 (equal pair), 8+4 (content + sidebar), 4+4+4 (three cards), 3+3+3+3 (four stats).

### 7.4 Vertical rhythm

| Context | Section padding (Y) |
|---|---|
| Mobile | `--space-16` (64) |
| Tablet | `--space-20` (80) |
| Desktop | `--space-24` (96) |
| Hero, desktop | `--space-32` (128) top, `--space-24` bottom |

Alternate section backgrounds between `--color-canvas` and `--color-surface` to separate them. Never use a horizontal rule as a section divider on marketing pages.

### 7.5 Page recipe — Landing page

1. **Nav** — sticky, transparent until scroll.
2. **Hero** — `--container-content`, centered. Overline (optional) → `--text-display-l` headline stating the outcome → `--text-body-lg` subhead in `--color-text-muted`, max 2 lines, max-width 560px → primary `lg` button + ghost secondary → single line of proof beneath in `--text-caption`.
3. **Anchor definition** — accent callout, centered, `--container-prose`. Quote the definition verbatim.
4. **Problem** — 3 cards (4+4+4) naming the reader's real friction. No solution language yet.
5. **How it works** — step indicator or numbered 3-step list, illustration on one side at `lg`.
6. **Proof** — results, screenshots, or subscriber count. Concrete over adjectival.
7. **Objection handling** — accordion, `--container-prose`.
8. **Final CTA** — full-width `--color-surface` band, centered, `--text-h1` + primary `lg` button. Restate the outcome, not the product name.
9. **Footer** — `--color-canvas`, `--text-body-sm` `--color-text-muted`, links + a single subscribe field.

**One primary CTA repeated three times** (hero, mid-page, final). Same label every time.

### 7.6 Page recipe — Sales page

Hero → who this is for / who it isn't (two columns, honest about the second) → the transformation (before/after, not features) → what's inside (feature cards, one per deliverable) → the anchor definition callout → proof → pricing card (focal card, elevation 4) → FAQ accordion → risk reversal → final CTA.

`--container-prose` for all narrative sections. Price appears exactly once, on the pricing card.

### 7.7 Page recipe — Quiz / sequential flow

Minimal top bar: wordmark + step indicator + exit. No nav, no footer, no links out. `--container-prose`, vertically centered, `--space-16` padding.

Per screen: overline "Question 2 of 6" → question as `--text-h2` (serif) → option cards (§6.11) → primary button, full-width below `sm`. Back link as ghost button, bottom-left, always available.

Transition between questions: outgoing fades and translates -8px; incoming fades in from +8px; `--duration-slow`. One question per screen, always.

### 7.8 Page recipe — Dashboard / skill library

Sidebar (§6.6) + `--container-wide` content area. Header: `--text-h2` page title, `--text-body-sm` `--color-text-muted` subtitle, primary action right-aligned. Then a 4-column stat row (3+3+3+3) if relevant, then content — cards in a 4+4+4 grid or a table.

Gated steps render as locked cards (§6.4) in sequence. The single next-available step gets elevation 4. Everything after it is locked. **The reader should never wonder what to do next** — exactly one thing is unlocked and glowing.

### 7.9 Page recipe — Opt-in / lead magnet

`--container-prose`, single column, no nav beyond the wordmark, no footer links. Headline stating the outcome → 3 bullets of what they get, each one line → email field + primary button on one row at `md`, stacked below → `--text-caption` privacy line in `--color-text-subtle`.

**No more than one form field.** Email only.

### 7.10 Applying the system to documents and product files

For PDFs, workbooks, and templates delivered as products, switch to the **light mode variant** (§2.7) — long-form reading on a screen or in print wants a light ground.

- Page margins 20mm; body `--text-body` at 11pt with 1.6 line height; measure capped at 68 characters.
- Headings keep the serif family; accent color becomes `#C9146A`.
- Section openers get an overline + serif h2 + a 2px accent rule 48px wide.
- Callouts keep their structure with light-mode soft backgrounds.
- Cover page: canvas `#0B0A0F` (dark, even in a light document) with the serif title in `--color-text` and one accent rule. The dark cover is the brand signature.
- Every document ends with a CTA page.

---

## 8. Machine-readable tokens

### 8.1 CSS custom properties

```css
:root {
  /* ---- Neutrals (dark, default) ---- */
  --color-canvas:          #0B0A0F;
  --color-surface:         #16141C;
  --color-surface-raised:  #1E1B26;
  --color-surface-overlay: #262230;
  --color-border:          #272430;
  --color-border-strong:   #3A3545;
  --color-text:            #F5F3F7;
  --color-text-muted:      #A29DAD;
  --color-text-subtle:     #888195;
  --color-text-inverse:    #0B0A0F;

  /* ---- Accent ---- */
  --accent-50:  #FFF0F8;
  --accent-100: #FFD6EC;
  --accent-200: #FFADD8;
  --accent-300: #FF7FC0;
  --accent-400: #FF54A9;
  --accent-500: #FF2D96;
  --accent-600: #E0197C;
  --accent-700: #B31161;
  --accent-800: #7D0B44;
  --accent-900: #4A0628;
  --accent-soft: rgba(255, 45, 150, 0.12);
  --accent-ring: rgba(255, 45, 150, 0.40);

  /* ---- Support ---- */
  --color-cyan:   #3DDCFF;
  --color-violet: #A78BFA;

  /* ---- Semantic ---- */
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-danger:  #FB7185;
  --color-info:    #38BDF8;
  --success-soft: rgba(52, 211, 153, 0.12);
  --warning-soft: rgba(251, 191, 36, 0.12);
  --danger-soft:  rgba(251, 113, 133, 0.12);
  --info-soft:    rgba(56, 189, 248, 0.12);

  /* ---- Type ---- */
  --font-display: "Instrument Serif", Fraunces, "Times New Roman", Georgia, serif;
  --font-body:    Inter, Geist, -apple-system, "Segoe UI", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;

  --text-display-xl: 4rem;    /* 64 */
  --text-display-l:  3rem;    /* 48 */
  --text-h1:         2.5rem;  /* 40 */
  --text-h2:         2rem;    /* 32 */
  --text-h3:         1.5rem;  /* 24 */
  --text-h4:         1.25rem; /* 20 */
  --text-body-lg:    1.125rem;/* 18 */
  --text-body:       1rem;    /* 16 */
  --text-body-sm:    0.875rem;/* 14 */
  --text-caption:    0.8125rem;/* 13 */
  --text-overline:   0.75rem; /* 12 */
  --text-mono:       0.875rem;/* 14 */

  /* ---- Space ---- */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;
  --space-32: 128px;

  /* ---- Radius ---- */
  --radius-sm: 6px;  --radius-md: 10px; --radius-lg: 14px;
  --radius-xl: 20px; --radius-2xl: 28px; --radius-full: 9999px;

  /* ---- Elevation ---- */
  --shadow-sm:   0 1px 2px rgba(0,0,0,0.40);
  --shadow-md:   0 4px 16px rgba(0,0,0,0.50);
  --shadow-lg:   0 16px 48px rgba(0,0,0,0.60);
  --glow-accent: 0 0 0 1px rgba(255,45,150,0.35), 0 8px 32px rgba(255,45,150,0.18);

  /* ---- Motion ---- */
  --duration-instant: 120ms;
  --duration-fast:    180ms;
  --duration-base:    240ms;
  --duration-slow:    400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);
  --ease-spring:   cubic-bezier(0.34, 1.4, 0.5, 1);

  /* ---- Layout ---- */
  --container-prose:   680px;
  --container-content: 1120px;
  --container-wide:    1320px;
  --container-full:    100%;
}

/* ---- Light variant ---- */
[data-theme="light"] {
  --color-canvas:          #FFFFFF;
  --color-surface:         #FAF9FB;
  --color-surface-raised:  #F3F1F6;
  --color-surface-overlay: #FFFFFF;
  --color-border:          #E6E3EC;
  --color-border-strong:   #CFC9D9;
  --color-text:            #16141C;
  --color-text-muted:      #5C5668;
  --color-text-subtle:     #6F6982;
  --color-text-inverse:    #FFFFFF;

  --accent-500: #C9146A;
  --accent-600: #A80F57;
  --accent-400: #E0197C;
  --accent-soft: rgba(201, 20, 106, 0.08);
  --accent-ring: rgba(201, 20, 106, 0.32);

  --color-success: #047857;
  --color-warning: #92660A;
  --color-danger:  #BE123C;
  --color-info:    #0369A1;

  --shadow-sm: 0 1px 2px rgba(22,20,28,0.06);
  --shadow-md: 0 4px 16px rgba(22,20,28,0.10);
  --shadow-lg: 0 16px 48px rgba(22,20,28,0.14);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 8.2 Tailwind config

```js
// tailwind.config.js
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas:  'var(--color-canvas)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised:  'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
        },
        line: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
        },
        ink: {
          DEFAULT: 'var(--color-text)',
          muted:   'var(--color-text-muted)',
          subtle:  'var(--color-text-subtle)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          50:'#FFF0F8', 100:'#FFD6EC', 200:'#FFADD8', 300:'#FF7FC0',
          400:'#FF54A9', 500:'#FF2D96', 600:'#E0197C', 700:'#B31161',
          800:'#7D0B44', 900:'#4A0628',
          soft: 'var(--accent-soft)',
        },
        success: '#34D399',
        warning: '#FBBF24',
        danger:  '#FB7185',
        info:    '#38BDF8',
        cyan:    '#3DDCFF',
        violet:  '#A78BFA',
      },
      fontFamily: {
        display: ['Instrument Serif', 'Fraunces', 'Georgia', 'serif'],
        sans:    ['Inter', 'Geist', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4rem',     { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-l':  ['3rem',     { lineHeight: '1.10', letterSpacing: '-0.02em' }],
        'h1':         ['2.5rem',   { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2':         ['2rem',     { lineHeight: '1.20', letterSpacing: '-0.015em' }],
        'h3':         ['1.5rem',   { lineHeight: '1.30', letterSpacing: '-0.01em' }],
        'h4':         ['1.25rem',  { lineHeight: '1.35' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.65' }],
        'body':       ['1rem',     { lineHeight: '1.60' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.55' }],
        'caption':    ['0.8125rem',{ lineHeight: '1.45' }],
        'overline':   ['0.75rem',  { lineHeight: '1.20', letterSpacing: '0.08em' }],
      },
      spacing: {
        1:'4px', 2:'8px', 3:'12px', 4:'16px', 5:'20px', 6:'24px',
        8:'32px', 10:'40px', 12:'48px', 16:'64px', 20:'80px', 24:'96px', 32:'128px',
      },
      borderRadius: {
        sm:'6px', md:'10px', lg:'14px', xl:'20px', '2xl':'28px', full:'9999px',
      },
      boxShadow: {
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        glow: 'var(--glow-accent)',
      },
      maxWidth: {
        prose:   '680px',
        content: '1120px',
        wide:    '1320px',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        spring:   'cubic-bezier(0.34, 1.4, 0.5, 1)',
      },
      transitionDuration: {
        instant:'120ms', fast:'180ms', base:'240ms', slow:'400ms',
      },
    },
  },
}
```

---

## 9. Accessibility contract

Non-negotiable on every build.

- **Contrast:** all text meets WCAG AA (4.5:1 body, 3:1 for 24px+). §2.6 is the verified reference.
- **Focus:** every interactive element has a visible focus ring — `2px solid var(--accent-ring)`, `outline-offset: 2px`. Never `outline: none` without a replacement.
- **Keyboard:** full operation without a mouse. Logical tab order. Modals trap focus and restore it on close. Esc closes any overlay.
- **Touch:** minimum 44×44px target on every tappable element.
- **Color is never the only signal.** Errors get an icon and text. Chart series get labels or patterns. Locked states get a lock icon.
- **Motion:** `prefers-reduced-motion` respected globally (block included in §8.1).
- **Semantics:** real headings in order, real buttons for actions, real links for navigation, real labels bound to inputs. `alt` text on every meaningful image; `alt=""` on decorative illustration.
- **Text size:** body text is never below 14px, and form inputs are never below 16px.

---

## 10. Anti-patterns

Things that break this system. If you catch one, it's a bug.

- ❌ Gradients as backgrounds or button fills. Flat only.
- ❌ Magenta used for more than the accent budget in §2.3.
- ❌ White text on the magenta fill.
- ❌ Two primary buttons in the same view.
- ❌ Serif type below 20px.
- ❌ Drop shadows doing the job that surface value and borders should do.
- ❌ Placeholder text used as a field label.
- ❌ A spacing, radius, or duration value that isn't a token.
- ❌ Emoji in UI chrome — buttons, nav, labels, badges.
- ❌ Exclamation marks in interface copy.
- ❌ Stock photography or gradient-vector illustration.
- ❌ A page or screen with no CTA.
- ❌ Horizontal scrolling on mobile for anything except a deliberate carousel or a tab strip.
- ❌ Countdown timers, fake scarcity, "only 3 spots left" — this brand doesn't do hype.

---

## 11. Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-09-05 | Initial system. Dark-first Electric Magenta palette, Instrument Serif + Inter typography, full component and layout specs, UI voice rules, verified contrast contract. |

---

*Taking action > preparation. This file exists so you don't have to re-decide the small things — decide the product instead.*
