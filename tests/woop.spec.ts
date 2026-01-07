import { test, expect } from '@playwright/test';

test.describe('Woop App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Message Creation', () => {
    test('should display the input form', async ({ page }) => {
      await expect(page.getByPlaceholder('Add a woop')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should create a new woop', async ({ page }) => {
      const testMessage = `Test message ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText(testMessage)).toBeVisible();
    });

    test('should clear input after submitting', async ({ page }) => {
      const testMessage = 'Message to submit';
      const input = page.getByPlaceholder('Add a woop');

      await input.fill(testMessage);
      await page.locator('button[type="submit"]').click();

      await expect(input).toHaveValue('');
    });

    test('should submit with Enter key', async ({ page }) => {
      const testMessage = `Enter key test ${Date.now()}`;
      const input = page.getByPlaceholder('Add a woop');

      await input.fill(testMessage);
      await input.press('Enter');

      await expect(page.getByText(testMessage)).toBeVisible();
    });
  });

  test.describe('Expiration Selector', () => {
    test('should display expiration selector', async ({ page }) => {
      await expect(page.getByRole('combobox')).toBeVisible();
    });

    test('should default to 10 minutes', async ({ page }) => {
      await expect(page.getByRole('combobox')).toContainText('10 minutes');
    });

    test('should allow selecting 5 minutes', async ({ page }) => {
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: '5 minutes' }).click();

      await expect(page.getByRole('combobox')).toContainText('5 minutes');
    });

    test('should allow selecting 20 minutes', async ({ page }) => {
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: '20 minutes' }).click();

      await expect(page.getByRole('combobox')).toContainText('20 minutes');
    });

    test('should persist selection when creating messages', async ({ page }) => {
      // Select 5 minutes
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: '5 minutes' }).click();

      // Create a message
      const testMessage = `Expiration test ${Date.now()}`;
      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.locator('button[type="submit"]').click();

      // Verify selector still shows 5 minutes
      await expect(page.getByRole('combobox')).toContainText('5 minutes');
    });
  });

  test.describe('Message Display', () => {
    test('should show copy button on messages', async ({ page }) => {
      const testMessage = `Copy button test ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.locator('button[type="submit"]').click();

      // Find the woop item containing our message and check for a button inside it
      const woopItem = page.locator('[data-slot="item"]').filter({ hasText: testMessage });
      await expect(woopItem.locator('button')).toBeVisible();
    });

    test('should not show delete button on messages', async ({ page }) => {
      const testMessage = `No delete test ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.locator('button[type="submit"]').click();

      // The trash icon should not exist
      await expect(page.locator('[data-testid="delete-button"]')).not.toBeVisible();
      // Also check there's no trash icon by looking for the lucide class
      await expect(page.locator('.lucide-trash-2')).not.toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate between messages with arrow keys', async ({ page }) => {
      // Create two messages
      const message1 = `First message ${Date.now()}`;
      const message2 = `Second message ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(message1);
      await page.locator('button[type="submit"]').click();
      // Wait for the first message to appear
      await expect(page.getByText(message1)).toBeVisible();

      await page.getByPlaceholder('Add a woop').fill(message2);
      await page.locator('button[type="submit"]').click();
      // Wait for the second message to appear
      await expect(page.getByText(message2)).toBeVisible();

      // Focus the first item (message2 is at the top since it's newer)
      const firstItem = page.locator('[data-slot="item"]').filter({ hasText: message2 });
      await firstItem.click();

      // Press down arrow
      await page.keyboard.press('ArrowDown');

      // Second item should be focused (message1)
      const secondItem = page.locator('[data-slot="item"]').filter({ hasText: message1 });
      await expect(secondItem).toBeFocused();
    });

    test('should copy message content with Enter key', async ({ page }) => {
      const testMessage = `Copy with enter ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.locator('button[type="submit"]').click();

      // Focus and press Enter
      const woopItem = page.locator('[data-slot="item"]').filter({ hasText: testMessage });
      await woopItem.focus();
      await page.keyboard.press('Enter');

      // Check for the check icon (indicates copy success)
      await expect(page.locator('.lucide-check')).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show welcome text in empty state', async ({ page }) => {
      // Check for any of the empty state elements
      // The empty state shows "Welcome to woop" heading
      // If there are messages, this test will be skipped
      const emptyState = page.getByText(/Welcome to woop/i);
      const hasMessages = await page.locator('[data-slot="item"]').count() > 0;

      if (!hasMessages) {
        await expect(emptyState).toBeVisible();
      } else {
        // If there are messages, the empty state won't be visible, which is expected
        test.skip();
      }
    });
  });
});
