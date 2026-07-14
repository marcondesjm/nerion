const { chromium } = require('playwright');
const path = require('path');

async function render(page, html, output, width, height) {
  const dir = __dirname;
  await page.setViewportSize({ width, height });
  await page.goto(`file://${path.join(dir, html).replace(/\\/g, '/')}`);
  await page.screenshot({
    path: path.join(dir, output),
    omitBackground: true,
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  await render(page, 'nerion-os-transparent.html', 'nerion-os-logo-lockup-transparent.png', 1600, 600);
  await render(page, 'nerion-os-mark-transparent.html', 'nerion-os-logo-mark-transparent.png', 1024, 1024);

  await browser.close();
})();
