const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 600 }, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(dir, 'nerion-os-logo-lockup.html').replace(/\\/g, '/')}`);
  await page.screenshot({ path: path.join(dir, 'nerion-os-logo-lockup.png') });
  await browser.close();
})();
