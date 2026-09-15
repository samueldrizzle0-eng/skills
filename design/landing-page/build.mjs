// Assembles the six .dc.html artboards from one shared token/CSS layer plus
// three per-option bodies. Landing Page Design System v1.0 is the spec.
import { writeFileSync } from 'node:fs';

/* ------------------------------------------------------------------ tokens */

const CSS = `
:root { color-scheme: dark; }
body { margin: 0; }

.page {
  /* §1.3 spacing — 4px base, only these steps */
  --sp-1:4px;  --sp-2:8px;   --sp-3:12px;  --sp-4:16px;
  --sp-5:24px; --sp-6:32px;  --sp-7:48px;  --sp-8:64px;
  --sp-9:96px; --sp-10:128px;

  --section-y:      clamp(64px, 9vw, 112px);
  --section-y-hero: clamp(72px, 11vw, 144px);
  --gutter:         clamp(20px, 5vw, 32px);

  /* §1.4 layout */
  --container:1120px; --container-md:880px; --content:640px; --form-max:460px;

  /* §1.5 radius, elevation, motion */
  --r-sm:8px; --r-md:12px; --r-lg:20px; --r-pill:999px;
  --elev-light: 0 1px 2px rgba(20,18,26,.04), 0 8px 24px rgba(20,18,26,.06);
  --ease: cubic-bezier(.2,.8,.2,1); --dur-fast:140ms; --dur-slow:420ms;

  /* §1.2 type */
  --font-display: "Instrument Serif", Georgia, "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  font-family: var(--font-body);
  background: var(--canvas);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  min-height: 100%;
}

/* §1.1 light is the bare default */
.page {
  --canvas:#FFFFFF; --surface:#F7F5FA; --surface-raised:#FFFFFF;
  --border:#E5E1EC; --border-strong:#908AA3;
  --text-primary:#14121A; --text-secondary:#555063; --text-muted:#6E6880;
  --accent:#C9146A; --accent-hover:#A80F58; --accent-press:#8C0C49;
  --accent-ink:#FFFFFF; --accent-soft:rgba(201,20,106,.08); --accent-line:rgba(201,20,106,.22);
  --success:#0B7350; --error:#C42B2B; --focus-ring:#C9146A;
  --shell-shadow: var(--elev-light);
}
.page[data-theme="dark"] {
  --canvas:#0B0A0F; --surface:#16141C; --surface-raised:#201D29;
  --border:#2E2A3A; --border-strong:#6A6280;
  --text-primary:#F5F3F7; --text-secondary:#A8A2B8; --text-muted:#8B839C;
  --accent:#FF2D96; --accent-hover:#FF57AB; --accent-press:#E01A7E;
  --accent-ink:#0B0A0F; --accent-soft:rgba(255,45,150,.12); --accent-line:rgba(255,45,150,.28);
  --success:#3DDC97; --error:#FF6B6B; --focus-ring:#FF2D96;
  --shell-shadow: none;
}

/* ------------------------------------------------------------ primitives */

.page *, .page *::before, .page *::after { box-sizing: border-box; }
.page img, .page svg { max-width: 100%; }
.page p, .page h1, .page h2, .page h3, .page ul { margin: 0; }
.page ul { list-style: none; padding: 0; }
a { color: var(--text-secondary); text-decoration: none; }
a:hover { color: var(--text-primary); text-decoration: underline; }
.page :focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 3px; border-radius: 2px; }

/* §1.3 gutter set once, side padding only */
.wrap { padding-inline: var(--gutter); }
.container { max-width: var(--container); margin-inline: auto; }
.container-md { max-width: var(--container-md); margin-inline: auto; }
.content { max-width: var(--content); margin-inline: auto; }

/* §1.2 type roles */
.h1 { font-family: var(--font-display); font-weight: 400;
      font-size: clamp(2.75rem, 7vw, 5rem); line-height: 1.02; letter-spacing: -.02em;
      max-width: 16ch; text-wrap: balance; }
.h2 { font-family: var(--font-display); font-weight: 400;
      font-size: clamp(1.875rem, 4vw, 2.75rem); line-height: 1.1; letter-spacing: -.015em;
      text-wrap: balance; }
.h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; letter-spacing: -.01em; }
.lead { font-size: clamp(1.0625rem, 1.6vw, 1.25rem); line-height: 1.6;
        color: var(--text-secondary); max-width: 36ch; text-wrap: pretty; }
.body { font-size: 1rem; line-height: 1.65; max-width: 62ch; text-wrap: pretty; }
.small { font-size: .875rem; line-height: 1.55; }
.eyebrow { font-size: .75rem; font-weight: 600; line-height: 1.2;
           letter-spacing: .08em; text-transform: uppercase; }

/* §5.1 EyebrowChip */
.chip { display: inline-flex; align-self: flex-start; padding: 6px 12px;
        border-radius: var(--r-pill); background: var(--accent-soft);
        border: 1px solid var(--accent-line); color: var(--accent); }

/* §5.2 Button — the only filled button on the page */
.btn { background: var(--accent); color: var(--accent-ink); border: none;
       border-radius: var(--r-sm); padding: 14px 22px; min-height: 48px;
       font: 600 .9375rem/1 var(--font-body); letter-spacing: .01em; cursor: pointer;
       transition: background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease); }
.btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn:active { background: var(--accent-press); transform: none; }

/* §5.3 SubscribeShell + §5.4 FormField (the specced native upgrade path) */
.shell { max-width: var(--form-max); background: var(--surface-raised);
         border: 1px solid var(--border); border-radius: var(--r-md);
         padding: var(--sp-2); overflow: hidden; box-shadow: var(--shell-shadow); }
.shell form { display: flex; gap: var(--sp-2); }
.field { flex: 1 1 auto; min-width: 0; background: var(--canvas);
         border: 1px solid var(--border-strong); border-radius: var(--r-sm);
         padding: 14px 16px; min-height: 48px; color: var(--text-primary);
         font: 400 1rem var(--font-body); }
.field::placeholder { color: var(--text-muted); }
.field:focus { border-color: var(--accent); outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.trust { margin-block-start: var(--sp-3); color: var(--text-muted); max-width: 46ch; }

/* §4.1 nav */
.nav { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: var(--sp-4); }
.wordmark { font-weight: 600; font-size: 1.0625rem; color: var(--text-primary); }
.nav-right { display: flex; align-items: center; gap: var(--sp-4); }
.toggle { width: 32px; height: 32px; display: grid; place-items: center; padding: 0;
          background: none; border: none; border-radius: var(--r-sm);
          color: var(--text-secondary); cursor: pointer;
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease); }
.toggle:hover { color: var(--text-primary); background: var(--surface); }

/* §4.2 hero */
.hero { padding-block: var(--section-y-hero); background: var(--canvas); }
.hero-grid { display: grid; gap: var(--sp-8); align-items: center; }
.hero-left { display: flex; flex-direction: column; align-items: flex-start; }
.hero-left .h1 { margin-block: var(--sp-5) var(--sp-4); }
.hero-left .lead { margin-block-end: var(--sp-6); }
.hero-left .shell, .hero-left .trust { width: 100%; }
.hero-art { display: flex; justify-content: center; }
.hero-art svg { width: 100%; max-width: 380px; height: auto; color: var(--text-secondary); }

/* §4.3 what's inside — full-bleed surface panel */
.panel { background: var(--surface); padding-block: var(--section-y);
         border-block: 1px solid var(--border); }
.value-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
              gap: var(--sp-6); margin-block-start: var(--sp-6); }
.value { display: flex; flex-direction: column; align-items: flex-start; }
.value svg { width: 20px; height: 20px; color: var(--text-secondary); margin-block-end: var(--sp-3); }
.value .h3 { margin-block-end: var(--sp-2); }
.value p { color: var(--text-secondary); }
.asset { display: flex; justify-content: center; margin-block-start: var(--sp-8); }
.asset svg { width: 100%; max-width: 420px; height: auto; color: var(--text-secondary); }

/* §4.4 proof strip — low visual weight on purpose */
.proof { background: var(--canvas); padding-block: var(--sp-7); text-align: center; }
.proof .body { margin-inline: auto; color: var(--text-secondary); }
.proof strong { color: var(--text-primary); font-weight: 600; }
.quotes { display: grid; grid-template-columns: 1fr; gap: var(--sp-6); text-align: left; }
.quote p { color: var(--text-primary); max-width: 34ch; }
.quote .attr { margin-block-start: var(--sp-3); color: var(--text-muted); }
.quote .attr b { color: var(--text-primary); font-weight: 600; }

/* §4.5 objection handler */
.objection { padding-block: var(--section-y); }
.obj-panel { background: var(--surface); border: 1px solid var(--border);
             border-radius: var(--r-lg); padding: var(--sp-7); }
.obj-cols { display: grid; grid-template-columns: 1fr; gap: var(--sp-7); margin-block-start: var(--sp-6); }
.obj-cols h3 { margin-block-end: var(--sp-4); }
.obj-cols li { display: grid; grid-template-columns: 16px 1fr; gap: var(--sp-3);
               color: var(--text-secondary); line-height: 1.65; }
.obj-cols ul { display: flex; flex-direction: column; gap: var(--sp-3); }
.obj-cols li span { color: var(--text-muted); }
.note p { color: var(--text-secondary); margin-block-start: var(--sp-5); }
.note p:first-of-type { margin-block-start: var(--sp-6); }
.sign { display: flex; align-items: center; gap: var(--sp-4); margin-block-start: var(--sp-6); }
.sign svg { width: 72px; height: auto; color: var(--text-secondary); flex: none; }
.sign span { font-family: var(--font-display); font-size: 1.75rem; color: var(--text-primary); }

/* §4.6 final CTA */
.final { background: var(--canvas); padding-block: var(--section-y); text-align: center; }
.final .body { margin: var(--sp-4) auto 0; color: var(--text-secondary); max-width: 44ch; }
.final .shell { margin: var(--sp-6) auto 0; }
.final .trust { margin-inline: auto; }

/* §4.7 footer */
.foot { padding-block: var(--sp-8); border-block-start: 1px solid var(--border); }
.foot-top { display: flex; flex-wrap: wrap; gap: var(--sp-6); justify-content: space-between; }
.foot-top p { color: var(--text-muted); margin-block-start: var(--sp-2); max-width: 40ch; }
.foot-links { display: flex; flex-wrap: wrap; gap: var(--sp-5); align-items: flex-start; }
.foot-copy { color: var(--text-muted); margin-block-start: var(--sp-7); }

/* §1.5 motion — one entrance animation, hero cluster only */
@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.hero-grid { animation: rise var(--dur-slow) var(--ease) both; }
@media (prefers-reduced-motion: reduce) {
  .hero-grid { animation: none; }
  .btn, .toggle { transition: none; }
  .btn:hover { transform: none; }
}

/* §7 responsive */
@media (max-width: 639px) {
  .hero-art { display: none; }                 /* illustration hidden below 640 */
  .shell form { flex-direction: column; }
  .btn { width: 100%; }
}
@media (min-width: 640px) {
  .quotes { grid-template-columns: 1fr 1fr; }
  .obj-cols { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 900px) {
  .hero-grid { grid-template-columns: 7fr 5fr; }
}
`;

/* ------------------------------------------------------- shared fragments */

// §5.8 ThemeToggle — half-filled circle reads in both directions
const TOGGLE = `<button class="toggle" type="button" onClick="{{toggleTheme}}" aria-label="Switch colour theme">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <circle cx="9" cy="9" r="7" />
              <path d="M9 2 A7 7 0 0 1 9 16 Z" fill="currentColor" stroke="none" />
            </svg>
          </button>`;

const nav = () => `<div class="wrap">
        <header class="nav container">
          <span class="wordmark">Sam</span>
          <div class="nav-right">
            ${TOGGLE}
            <a class="small" href="#">Read the newsletter</a>
          </div>
        </header>
      </div>`;

const TRUST = `The skill file lands in your inbox in two minutes. One email a week after that. Unsubscribe anytime.`;

const shell = () => `<div class="shell">
              <form>
                <input class="field" type="email" placeholder="you@example.com" aria-label="Email address" />
                <button class="btn" type="submit">Send me the skill</button>
              </form>
            </div>
            <p class="trust small">${TRUST}</p>`;

// §5.5 ValueItem marker — stroke tick, --text-secondary (accent budget is spent
// on the button, the chip and the two illustration details)
const TICK = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 10.4 L7.6 15.2 L17 4.6" />
              </svg>`;

const value = (title, body) => `<div class="value">
              ${TICK}
              <h3 class="h3">${title}</h3>
              <p class="body">${body}</p>
            </div>`;

// §5.6 AssetPreview — line-art stand-in for the file itself
const ASSET = `<div class="asset">
            <svg viewBox="0 0 420 260" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M104 26 L286 30 L330 76 L326 236 L100 230 Z" />
              <path d="M284 30 L288 78 L330 76" />
              <path d="M132 104 L214 106" />
              <path d="M132 130 L288 132" />
              <path d="M132 156 L262 157" />
              <path d="M132 182 L228 183" />
              <path d="M132 68 L196 69" />
              <path d="M126 205 L142 219 L170 191" stroke="var(--accent)" />
            </svg>
          </div>`;

const finalCta = (h2, body) => `<section class="final">
        <div class="wrap">
          <div class="content">
            <h2 class="h2">${h2}</h2>
            <p class="body">${body}</p>
            ${shell()}
          </div>
        </div>
      </section>`;

const foot = () => `<footer class="foot">
        <div class="wrap">
          <div class="container">
            <div class="foot-top">
              <div>
                <span class="wordmark">Sam</span>
                <p class="small">Turning what you already know into something you sell.</p>
              </div>
              <nav class="foot-links small">
                <a href="#">Substack</a>
                <a href="#">LinkedIn</a>
                <a href="#">[YOUR EMAIL]</a>
              </nav>
            </div>
            <p class="foot-copy small">© 2026 Sam. All rights reserved.</p>
          </div>
        </div>
      </footer>`;

const forNotFor = (forItems, skipItems) => `<div class="obj-cols">
              <div>
                <h3 class="h3">This is for you if…</h3>
                <ul class="body">${forItems.map((t) => `
                  <li><span>—</span><span>${t}</span></li>`).join('')}
                </ul>
              </div>
              <div>
                <h3 class="h3">Skip it if…</h3>
                <ul class="body">${skipItems.map((t) => `
                  <li><span>—</span><span>${t}</span></li>`).join('')}
                </ul>
              </div>
            </div>`;

/* ------------------------------------------------------------ the options */

// Option A — the named asset (§6.1 formula 2), proof format C, objection A
const HERO_ART_A = `<svg viewBox="0 0 340 200" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M10 62 L88 59 L90 121 L12 123 Z" />
              <path d="M26 80 L70 78" /><path d="M26 93 L58 92" />
              <path d="M97 91 L121 89" /><path d="M114 84 L122 90 L114 96" />
              <path d="M132 60 L210 62 L208 122 L130 120 Z" />
              <path d="M148 80 L191 79" /><path d="M148 93 L177 92" />
              <path d="M219 91 L243 89" /><path d="M236 84 L244 90 L236 96" />
              <path d="M254 59 L332 62 L330 121 L252 119 Z" />
              <path d="M270 92 L285 106 L315 74" stroke="var(--accent)" />
            </svg>`;

const optionA = {
  file: 'Main.dc.html',
  title: 'Option A — Named asset',
  body: `<section class="hero">
        <div class="wrap">
          <div class="container hero-grid">
            <div class="hero-left">
              <span class="chip eyebrow">Free skill</span>
              <h1 class="h1">The skill file that finds your next product idea.</h1>
              <p class="lead">For solopreneurs who know a lot and still can't name the thing to sell. Drop it into Claude, answer its questions, and come out with an idea you've already tested.</p>
              ${shell()}
            </div>
            <div class="hero-art">${HERO_ART_A}</div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="wrap">
          <div class="container-md">
            <h2 class="h2">What's inside the file</h2>
            <div class="value-grid">
              ${value('A pass over your own work', "It works through what you already do and pulls out the ideas hiding in there.")}
              ${value('Ideas scored, not just listed', 'Every idea comes back ranked on demand, effort, and what you can actually ship alone.')}
              ${value('A verdict you can act on', "Build, validate further, pivot, or don't. One call, with the reasoning shown.")}
            </div>
            ${ASSET}
          </div>
        </div>
      </section>

      <section class="proof">
        <div class="wrap">
          <div class="container-md">
            <p class="body">It's the same process I run on my own products before I build them, written down for people doing this on their own.</p>
          </div>
        </div>
      </section>

      <section class="objection">
        <div class="wrap">
          <div class="container-md">
            <div class="obj-panel">
              <h2 class="h2">Is this for you?</h2>
              ${forNotFor(
                ["You've got real expertise and no idea which slice of it to sell.",
                 "You've started three products and finished none of them.",
                 "You'd rather test an idea this week than think about it for a month."],
                ['You already know exactly what you are building.',
                 'You want someone to hand you an idea instead of working through yours.'])}
            </div>
          </div>
        </div>
      </section>

      ${finalCta('Stop guessing which idea to build.',
        "Answer a few questions tonight. Know what you're building tomorrow.")}`,
};

// Option B — the reframe (§6.1 formula 3), proof format A, objection B
const HERO_ART_B = `<svg viewBox="0 0 340 200" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M28 66 L112 48 L131 133 L46 152 Z" />
              <path d="M122 54 L210 47 L217 140 L128 146 Z" />
              <path d="M226 50 L306 68 L292 152 L212 136 Z" />
              <path d="M143 76 L190 72" /><path d="M143 94 L176 91" />
              <path d="M118 44 C 152 26, 214 30, 228 62 C 242 96, 230 148, 174 158 C 118 168, 104 122, 108 90" stroke="var(--accent)" />
            </svg>`;

// one hand-drawn detail beside the signature (§3: second illustration lives in §4.5 here)
const PEN = `<svg viewBox="0 0 96 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 40 C 22 36, 30 12, 44 14 C 56 16, 50 38, 62 38 C 74 38, 78 20, 90 16" />
            </svg>`;

const optionB = {
  file: 'OptionB.dc.html',
  title: 'Option B — Reframe + founder note',
  body: `<section class="hero">
        <div class="wrap">
          <div class="container hero-grid">
            <div class="hero-left">
              <span class="chip eyebrow">Free skill</span>
              <h1 class="h1">You don't need another idea. You need proof.</h1>
              <p class="lead">For solopreneurs sitting on ten half-ideas with no way to tell which one is real. This skill runs each of them against the market before you spend a weekend building.</p>
              ${shell()}
            </div>
            <div class="hero-art">${HERO_ART_B}</div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="wrap">
          <div class="container-md">
            <h2 class="h2">What the skill does</h2>
            <div class="value-grid">
              ${value('Pulls ideas out of your work', 'It starts from what you already do rather than from a list of trends.')}
              ${value('Checks them against the market', 'It goes looking for competitors, prices, and people already complaining about the gap.')}
              ${value('Gives you a straight verdict', "Build, validate further, pivot, or don't. With the reasoning, so you can argue back.")}
            </div>
          </div>
        </div>
      </section>

      <section class="proof">
        <div class="wrap">
          <div class="container-md">
            <p class="body"><strong>[YOUR NUMBER]</strong> solopreneurs read the newsletter this skill came out of.</p>
          </div>
        </div>
      </section>

      <section class="objection">
        <div class="wrap">
          <div class="container-md">
            <div class="obj-panel">
              <h2 class="h2">Why I made this</h2>
              <div class="note content">
                <p class="body">For two years I told people to productize what they already know. The advice was fine. It kept landing on the same wall: they'd nod, go away, and come back three months later with nothing.</p>
                <p class="body">It wasn't a motivation problem. They couldn't see the idea from the inside. And the ones who did have an idea had no cheap way to find out whether it was any good.</p>
                <p class="body">So I wrote the process down, step by step, until it was something you could run instead of something you had to interpret. That's the file.</p>
                <p class="body">Taking action beats preparation. This is the smallest piece of action I could hand you.</p>
                <div class="sign">${PEN}<span>Sam</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      ${finalCta('Find out if your idea holds up.',
        "It takes one sitting. You'll know more at the end of it than after a month of thinking about it.")}`,
};

// Option C — before → after (§6.1 formula 4), proof format B, objection A
const HERO_ART_C = `<svg viewBox="0 0 340 190" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 116 C 40 60, 74 152, 98 92 C 112 56, 76 52, 70 90 C 64 130, 106 142, 130 112 C 150 86, 132 62, 154 56" />
              <path d="M166 86 L300 82" />
              <path d="M286 73 L302 82 L287 92" stroke="var(--accent)" />
            </svg>`;

const optionC = {
  file: 'OptionC.dc.html',
  title: 'Option C — Before → after',
  body: `<section class="hero">
        <div class="wrap">
          <div class="container hero-grid">
            <div class="hero-left">
              <span class="chip eyebrow">Free skill</span>
              <h1 class="h1">From blank page to a validated idea in one evening.</h1>
              <p class="lead">For solopreneurs who've been circling the same question for months. You finish with one idea, scored against real market evidence, and a clear reason to build it or drop it.</p>
              ${shell()}
            </div>
            <div class="hero-art">${HERO_ART_C}</div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="wrap">
          <div class="container-md">
            <h2 class="h2">Inside the file</h2>
            <div class="value-grid">
              ${value('Questions that get you unstuck', "Fifteen minutes of prompts that surface what you're too close to see on your own.")}
              ${value('Real evidence, not vibes', 'Competitors, prices, and the complaints people are already posting. Gathered before you commit.')}
              ${value('One verdict, with the reasoning', "Build, validate further, pivot, or don't. You can see how it got there.")}
            </div>
            ${ASSET}
          </div>
        </div>
      </section>

      <section class="proof">
        <div class="wrap">
          <div class="container-md quotes">
            <div class="quote">
              <p class="body">“[REAL QUOTE — 20 WORDS MAX, IN THEIR OWN WORDS]”</p>
              <p class="attr small"><b>[NAME]</b> · [ROLE]</p>
            </div>
            <div class="quote">
              <p class="body">“[SECOND REAL QUOTE — 20 WORDS MAX]”</p>
              <p class="attr small"><b>[NAME]</b> · [ROLE]</p>
            </div>
          </div>
        </div>
      </section>

      <section class="objection">
        <div class="wrap">
          <div class="container-md">
            <div class="obj-panel">
              <h2 class="h2">Is this for you?</h2>
              ${forNotFor(
                ['You have more expertise than you have ideas you trust.',
                 "You keep researching and never get to the point of deciding.",
                 'You want to be wrong in an evening rather than in six months.'],
                ['You have already validated the idea and are mid-build.',
                 'You are looking for a business handed to you rather than found in your own work.'])}
            </div>
          </div>
        </div>
      </section>

      ${finalCta('One evening. One idea you trust.',
        'The file arrives, you run it, and you know where you stand by the end of the night.')}`,
};

/* ------------------------------------------------------------------ write */

const doc = (title, body) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&family=Inter:wght@400;600&display=swap" />
  <style>${CSS}</style>
</helmet>
<div class="page" data-theme="{{theme}}">
      ${nav()}
${body}
      ${foot()}
</div>
</x-dc>
<script data-dc-script data-props='{"theme":{"editor":"enum","options":["dark","light"],"default":"dark","section":"Theme"},"$preview":{"width":1280,"height":3400}}'>
class Component extends DCLogic {
  renderVals() {
    const theme = this.state.theme ?? this.props.theme ?? 'dark';
    return {
      theme,
      toggleTheme: () => this.setState({ theme: theme === 'dark' ? 'light' : 'dark' }),
    };
  }
}
</script>
</body>
</html>
`;

const options = [optionA, optionB, optionC];
const artboards = [];
const MOBILE = { 'Main.dc.html': 'OptionAMobile.dc.html', 'OptionB.dc.html': 'OptionBMobile.dc.html', 'OptionC.dc.html': 'OptionCMobile.dc.html' };

options.forEach((o, i) => {
  writeFileSync(o.file, doc(o.title, o.body));
  writeFileSync(MOBILE[o.file], doc(o.title, o.body));
  artboards.push({ file: o.file, title: o.title, x: i * 1400, y: 0, w: 1280, h: 3500, is_interactive: true });
  artboards.push({ file: MOBILE[o.file], title: o.title.replace('Option', 'Mobile —').replace(/ — .*/, '') + ' — phone', page: 'page-2', x: i * 500, y: 0, w: 390, h: 4200, is_interactive: true });
});

// tidy mobile titles
artboards.filter((a) => a.page === 'page-2').forEach((a, i) => {
  a.title = ['Option A — phone', 'Option B — phone', 'Option C — phone'][i];
});

writeFileSync('canvas.json', JSON.stringify({
  artboards,
  pages: [{ id: 'page-1', name: 'Options' }, { id: 'page-2', name: 'Phone' }],
  annotations: [
    { id: 'how-to-read', x: 0, y: -320, w: 460, text: 'Three directions, same design system.\n\nA — names the asset. Safest, most literal. Proof is one honest line of context.\nB — reframes the problem, then a founder note. Converts on trust in you.\nC — before/after promise, backed by two real quotes.\n\nEvery artboard has a dark/light chip above it. Bracketed text is yours to fill in.' },
  ],
  launch: { view: 'canvas', page: 'page-1' },
}, null, 2));

console.log('wrote', artboards.length, 'artboards');
