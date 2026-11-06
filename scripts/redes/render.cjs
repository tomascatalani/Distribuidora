const { chromium } = require('playwright');
const path = require('path');
// Uso: node scripts/redes/render.cjs <html> <carpeta_salida> <ancho> <alto>
(async () => {
  const [html, outDir, w, h] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(html));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const slides = await page.$$('section.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.join(outDir, `${String(i + 1).padStart(2, '0')}.png`) });
  }
  const loaded = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style + ' ' + f.weight).join(', '));
  console.log(path.basename(html), slides.length, 'slides; fonts:', loaded);
  await browser.close();
})();
