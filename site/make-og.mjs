/* Renders assets/og-source.html to assets/og.png at exactly 1200x630.
 *
 * Requires the local server to be running:  python3 -m http.server 8181
 * Then:                                     node make-og.mjs
 *
 * It refuses to write the file unless Instrument Serif actually loaded — a
 * fallback serif in a social card is the kind of thing nobody notices until
 * it is on every share of the site.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:8181/assets/og-source.html', { waitUntil: 'domcontentloaded' });

// Give the webfonts a real chance, then confirm rather than assume.
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForTimeout(4000);

const check = await page.evaluate(() => {
  const h = document.querySelector('.og__headline');
  const box = document.getElementById('og').getBoundingClientRect();
  return {
    family: getComputedStyle(h).fontFamily.split(',')[0].replace(/"/g, ''),
    loaded: document.fonts.check('400 64px "Instrument Serif"'),
    w: Math.round(box.width), h: Math.round(box.height),
    // Real clipping is content escaping the card, not a tight line-height
    // making scrollHeight a pixel taller than the glyph box.
    overflow: h.getBoundingClientRect().bottom > box.bottom ||
              h.getBoundingClientRect().right > box.right
  };
});

console.log(`font: ${check.family} (loaded: ${check.loaded}) — card ${check.w}x${check.h} — headline clipped: ${check.overflow}`);

if (!check.loaded) {
  console.error('Instrument Serif did not load. Not writing og.png.');
  await browser.close();
  process.exit(1);
}

await page.locator('#og').screenshot({ path: 'assets/og.png' });
console.log('wrote assets/og.png');
await browser.close();
