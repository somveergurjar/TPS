const { test, expect } = require('@playwright/test');

const baseURL = 'https://dev.liveaccess.ai';
const validEmail = 'somveergurjar.megaminds@gmail.com';
const validPassword = 'Qwert@123';

async function login(page, email = validEmail, password = validPassword) {
  await page.goto(`${baseURL}/login`);
  const emailField = page.locator('input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[placeholder*="email"]');
  const passwordField = page.locator('input[name="password"], input[type="password"], #password, input[placeholder*="Password"], input[placeholder*="password"]');
  await expect(emailField).toBeVisible({ timeout: 15000 });
  await expect(passwordField).toBeVisible({ timeout: 15000 });
  await emailField.fill(email);
  await passwordField.fill(password);
  await page.click('button[type="submit"], button:has-text("Continue"), button:has-text("Continue Verification"), button:has-text("Login"), button:has-text("Sign in")');
  await page.waitForLoadState('networkidle', { timeout: 20000 });
}

test.describe('LiveAccess Login Cases', () => {
  test('positive login should succeed and show dashboard', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/.*dashboard|.*app|.*home/, { timeout: 15000 });
    await expect(page.locator('text=Logout, text=Log out, text=Sign out')).toBeVisible({ timeout: 15000 });
  });

  test('invalid password should show invalid message', async ({ page }) => {
    await login(page, validEmail, 'WrongPassword123!');
    await expect(page.locator('text=Invalid credentials, text=Password is incorrect')).toBeVisible({ timeout: 10000 });
  });

  test('non-existent user should show error', async ({ page }) => {
    await login(page, 'nouser@example.com', 'AnyPass123!');
    await expect(page.locator('text=User not found, text=Invalid credentials')).toBeVisible({ timeout: 10000 });
  });

  test('empty fields should show required validation', async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email is required')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Password is required')).toBeVisible({ timeout: 5000 });
  });

  test('SQL injection input should be rejected', async ({ page }) => {
    await login(page, "' OR 1=1 --", "' OR '1'='1");
    await expect(page.locator('text=Invalid credentials, text=User not found')).toBeVisible({ timeout: 10000 });
  });
});