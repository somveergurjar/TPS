const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://dev.liveaccess.ai/login', { waitUntil: 'networkidle' });
  const inputs = await page.$$eval('input', els => els.map(el => ({ type: el.type, name: el.name, id: el.id, placeholder: el.placeholder, outerHTML: el.outerHTML }))); 
  console.log('input elements:', JSON.stringify(inputs, null, 2));
  const buttons = await page.$$eval('button', els => els.map(el => ({ text: el.innerText, type: el.type, outerHTML: el.outerHTML }))); 
  console.log('buttons:', JSON.stringify(buttons, null, 2));
  const forms = await page.$$eval('form', els => els.map(el => ({ action: el.action, method: el.method, outerHTML: el.outerHTML.slice(0, 300) }))); 
  console.log('forms:', JSON.stringify(forms, null, 2));
  await browser.close();
})();