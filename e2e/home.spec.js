import { test, expect } from '@playwright/test';

test('home page displays title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ParAmedic/i);


    // Check for some content
    await expect(page.locator('body')).toContainText(/Consos du jour/i);
});
