import { test, expect } from '@playwright/test';

// Helper to login (mocked)
async function login(page) {
    // Mock login and me
    await page.route('**/api/auth/login', async route => {
        await route.fulfill({
            json: {
                success: true,
                data: {
                    accessToken: 'fake-jwt-token',
                    user: { id: '123', username: 'Test', role: 'user' }
                }
            }
        });
    });

    await page.route('**/api/auth/me', async route => {
        await route.fulfill({
            json: {
                success: true,
                data: { id: '123', username: 'Test', role: 'user' }
            }
        });
    });

    // Mock consumptions
    await page.route('**/api/consumptions/today', async route => {
        await route.fulfill({
            json: {
                success: true,
                data: {
                    consumptions: [],
                    totals: { sugar: 10, calories: 100, caffeine: 50 }
                }
            }
        });
    });

    await page.route('**/api/consumptions/leaderboard', async route => {
        await route.fulfill({
            json: { data: [] }
        });
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
}

test.describe('Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('displays health gauges', async ({ page }) => {
        // Check if gauges are visible
        await expect(page.getByText(/Sucre/i).first()).toBeVisible();
        await expect(page.getByText(/Caféine/i).first()).toBeVisible();
    });
});
