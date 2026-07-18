import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 1077 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Your security system' }),
  ).toBeVisible();
});

test('matches the measured desktop geometry', async ({ page }) => {
  const cameraHeader = page.getByRole('button', {
    name: /^Choose your cameras 2 selected$/,
  });
  const review = page.locator('aside');
  const reviewContent = review.locator(':scope > div').first();
  const cards = page.getByRole('article');

  const cameraBox = await cameraHeader.boundingBox();
  const reviewBox = await review.boundingBox();
  const reviewContentBox = await reviewContent.boundingBox();
  const firstCardBox = await cards.nth(0).boundingBox();
  const fifthCardBox = await cards.nth(4).boundingBox();

  expect(cameraBox).not.toBeNull();
  expect(reviewBox).not.toBeNull();
  expect(reviewContentBox).not.toBeNull();
  expect(firstCardBox).not.toBeNull();
  expect(fifthCardBox).not.toBeNull();

  expect(cameraBox?.x).toBe(122);
  expect(cameraBox?.width).toBe(768);
  expect(reviewBox?.x).toBe(919);
  expect(reviewBox?.width).toBe(399);
  expect(reviewContentBox?.x).toBe(919);
  expect(reviewContentBox?.width).toBe(390);
  expect(reviewContentBox?.height).toBeGreaterThanOrEqual(823);
  expect(firstCardBox?.width).toBe(361.5);
  expect(firstCardBox?.height).toBe(160);
  expect(fifthCardBox?.width).toBe(360);
  expect(fifthCardBox?.height).toBe(160);
});

test('opens the accessible checkout confirmation', async ({ page }) => {
  const checkoutButton = page.getByRole('button', { name: 'Checkout' });
  await checkoutButton.click();

  const dialog = page.getByRole('dialog', { name: 'Confirm checkout' });
  const cancelButton = page.getByRole('button', { name: 'Cancel' });
  const confirmButton = page.getByRole('button', {
    name: 'Confirm checkout',
  });

  await expect(dialog).toBeVisible();
  await expect(cancelButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(confirmButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancelButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(checkoutButton).toBeFocused();
});

test('has no horizontal overflow at every required width', async ({ page }) => {
  const widths = [390, 375, 320, 768, 1024, 1280];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1252 });
    await page.reload();
    await expect(
      page.getByRole('heading', { name: 'Your security system' }),
    ).toBeVisible();

    const dimensions = await page.locator('html').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));

    expect(
      dimensions.scrollWidth,
      `horizontal overflow detected at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.clientWidth);

    if (width === 320) {
      await page
        .getByRole('button', { name: /^Choose your cameras 2 selected$/ })
        .click();
      const expandedDimensions = await page
        .locator('html')
        .evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
      expect(
        expandedDimensions.scrollWidth,
        'horizontal overflow detected with the camera step open at 320px',
      ).toBeLessThanOrEqual(expandedDimensions.clientWidth);
    }
  }
});

test('matches the mobile structure and keyboard interactions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1252 });
  await page.reload();

  const pageTitle = page.getByRole('heading', { name: /get started/i });
  const stepButtons = page.locator('h2').filter({ has: page.locator('button') });
  const cameraButton = page.getByRole('button', {
    name: /^Choose your cameras 2 selected$/,
  });
  const review = page.locator('aside');

  await expect(pageTitle).toBeVisible();
  await expect(stepButtons).toHaveCount(4);
  await expect(cameraButton).toHaveAttribute('aria-expanded', 'false');
  await expect(cameraButton).toHaveAttribute(
    'aria-controls',
    'cameras-accordion-panel',
  );

  const reviewBox = await review.boundingBox();
  expect(reviewBox?.x).toBe(0);
  expect(reviewBox?.y).toBe(406);
  expect(reviewBox?.width).toBe(390);

  await cameraButton.focus();
  const outlineWidth = await cameraButton.evaluate(
    (element) => getComputedStyle(element).outlineWidth,
  );
  expect(outlineWidth).not.toBe('0px');

  await page.keyboard.press('Enter');
  await expect(cameraButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#cameras-accordion-panel')).toBeVisible();

  const blackVariant = page.getByRole('button', {
    name: 'Select Wyze Cam v4 Black',
  });
  await blackVariant.focus();
  await page.keyboard.press('Enter');
  await expect(blackVariant).toHaveAttribute('aria-pressed', 'true');

  await expect(
    page.getByRole('button', {
      name: 'Decrease Wyze Cam Floodlight v2 White',
    }),
  ).toBeDisabled();

  const headingLevels = await page
    .getByRole('heading')
    .evaluateAll((headings) =>
      headings.map((heading) => Number(heading.tagName.slice(1))),
    );
  for (let index = 1; index < headingLevels.length; index += 1) {
    expect(headingLevels[index]).toBeLessThanOrEqual(
      (headingLevels[index - 1] ?? 1) + 1,
    );
  }
});

test('announces save status and honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const saveButton = page.getByRole('button', {
    name: 'Save my system for later',
  });
  await saveButton.click();

  const status = page.getByText('Your configuration was saved.');
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await expect(status).toHaveAttribute('aria-atomic', 'true');

  const transitionDuration = await saveButton.evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  expect(transitionDuration).toBe('1e-05s');
});

test('loads every rendered image without browser errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Your security system' }),
  ).toBeVisible();

  // Wait for all images to finish loading or erroring
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', () => resolve(null));
          img.addEventListener('error', () => resolve(null));
        });
      })
    );
  });

  const failedImages = await page.locator('img').evaluateAll((images) =>
    images
      .map((image) => image as HTMLImageElement)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.src),
  );

  expect(failedImages).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
