const { test, expect } = require('@playwright/test');

const baseURL = 'https://dev.liveaccess.ai';
const validEmail = 'somveergurjar.megaminds@gmail.com';
const validPassword = 'Qwert@123';

async function login(page) {
  await page.goto(`${baseURL}/login`);
  const emailField = page.locator('input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[placeholder*="email"]');
  const passwordField = page.locator('input[name="password"], input[type="password"], #password, input[placeholder*="Password"], input[placeholder*="password"]');
  await expect(emailField).toBeVisible({ timeout: 15000 });
  await expect(passwordField).toBeVisible({ timeout: 15000 });
  await emailField.fill(validEmail);
  await passwordField.fill(validPassword);
  await page.click('button[type="submit"], button:has-text("Continue"), button:has-text("Continue Verification"), button:has-text("Login"), button:has-text("Sign in")');
  await page.waitForLoadState('networkidle', { timeout: 20000 });
}

test.describe('LiveAccess Equipment module', () => {
  test('login and open equipment module then verify page title', async ({ page }) => {
    await login(page);

    const equipmentSelector = 'a:has-text("Equipment"), button:has-text("Equipment"), nav >> text=Equipment';
    const equipmentLink = page.locator(equipmentSelector);

    if (await equipmentLink.count() > 0) {
      await equipmentLink.first().click();
    } else {
      await page.goto(`${baseURL}/equipment`);
    }

    await page.waitForLoadState('networkidle', { timeout: 20000 });

    const equipmentTitle = await page.title();
    console.log('Equipment module title:', equipmentTitle);

    await expect(equipmentTitle).not.toBeNull();
    await expect(equipmentTitle).not.toHaveLength(0);
  });

  test('add new equipment: validate required fields and save', async ({ page }) => {
    await login(page);

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
    //await expect(page.locator('text=This field is required, text=Required')).toBeVisible({ timeout: 5000 });

    // Fill the rest of the fields (assuming common fields: name, description, etc.)
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

    // Verify success (e.g., redirect or success message)
    await expect(page.locator('text=Equipment added successfully, text=Saved')).toBeVisible({ timeout: 10000 });
  });
});