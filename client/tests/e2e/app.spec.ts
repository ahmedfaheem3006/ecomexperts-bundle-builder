import { expect, test } from '@playwright/test';

test('loads the frontend workspace', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Frontend workspace ready' }),
  ).toBeVisible();
});
