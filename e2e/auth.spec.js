import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

    test('login with valid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill input fields
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');

        // Mock successful login API call
        await page.route('**/api/auth/login', async route => {
            const json = {
                success: true,
                data: {
                    accessToken: 'fake-jwt-token',
                    user: {
                        id: '123',
                        email: 'test@example.com',
                        username: 'Test User',
                        role: 'user'
                    }
                }
            };
            await route.fulfill({ json });
        });

        // Mock /api/auth/me to return user after login
        await page.route('**/api/auth/me', async route => {
            const json = {
                success: true,
                data: {
                    id: '123',
                    email: 'test@example.com',
                    username: 'Test User',
                    role: 'user'
                }
            };
            await route.fulfill({ json });
        });

        await page.click('button[type="submit"]');

        // Verify redirection to dashboard (home /)
        await expect(page).toHaveURL('/');
    });

    test('show error on invalid credentials', async ({ page }) => {
        await page.goto('/login');

        // Mock failed login
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({
                status: 401,
                json: { error: 'Identifiants invalides' }
            });
        });

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpass');
        await page.click('button[type="submit"]');

        // Verify error message
        await expect(page.getByRole('alert')).toContainText(/Identifiants invalides/i);
    });
});
