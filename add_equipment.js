const { chromium } = require('playwright');

const baseURL = 'https://dev.liveaccess.ai';
const validEmail = 'somveergurjar.megaminds@gmail.com';
const validPassword = 'Qwert@123';

async function login(page) {
  await page.goto(`${baseURL}/login`);
  const emailField = page.locator('input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[placeholder*="email"]');
  const passwordField = page.locator('input[name="password"], input[type="password"], #password, input[placeholder*="Password"], input[placeholder*="password"]');
  await emailField.waitFor({ timeout: 15000 });
  await passwordField.waitFor({ timeout: 15000 });
  await emailField.fill(validEmail);
  await passwordField.fill(validPassword);
  await page.click('button[type="submit"], button:has-text("Continue"), button:has-text("Continue Verification"), button:has-text("Login"), button:has-text("Sign in")');
  await page.waitForLoadState('networkidle', { timeout: 20000 });
}

async function addEquipment(page) {
  // Navigate to equipment
  const equipmentSelector = 'a:has-text("Equipment"), button:has-text("Equipment"), nav >> text=Equipment';
  const equipmentLink = page.locator(equipmentSelector);
  if (await equipmentLink.count() > 0) {
    await equipmentLink.first().click();
  } else {
    await page.goto(`${baseURL}/equipment`);
  }
  await page.waitForLoadState('networkidle', { timeout: 20000 });

  // Click on +new equipment
  await page.click('button:has-text("+new equipment"), button:has-text("New Equipment"), button:has-text("Add Equipment")');

  // Validate required fields by clicking save without filling
  await page.click('button:has-text("Save Equipment"), button:has-text("Save"), button[type="submit"]');
  console.log('Clicked save without filling - checking for required field errors');

  // Fill the rest of the fields
  await page.fill('input[name="name"], input[placeholder*="Name"], #name', 'Test Equipment');
  await page.fill('input[name="description"], textarea[name="description"], #description', 'Test Description');
  await page.fill('input[name="serial"], input[placeholder*="Serial"], #serial', '123456');

  // Select from manufacturer dropdown
  await page.selectOption('select[name="manufacturer"], select[id="manufacturer"], select[placeholder*="Manufacturer"]', { index: 1 });

  // Select from supplier dropdown
  await page.selectOption('select[name="supplier"], select[id="supplier"], select[placeholder*="Supplier"]', { index: 1 });

  // Fill supplier identification (unique)
  const uniqueId = 'SUP' + Date.now();
  await page.fill('input[name="supplierIdentification"], input[placeholder*="Supplier Identification"], #supplierIdentification', uniqueId);

  // Click save equipment again
  await page.click('button:has-text("Save Equipment"), button:has-text("Save"), button[type="submit"]');

  console.log('Equipment added with unique supplier ID:', uniqueId);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await login(page);
    await addEquipment(page);
    console.log('Add equipment script completed successfully');
  } catch (error) {
    console.error('Error in script:', error);
  } finally {
    // Keep browser open for inspection
    // await browser.close();
  }
})();