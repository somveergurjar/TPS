const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://dev.liveaccess.ai/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'debug_login.png', fullPage: true });
  console.log('screenshot saved to debug_login.png');
  const html = await page.content();
  console.log(html.slice(0, 1500));
  await browser.close();
})();