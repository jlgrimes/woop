import { test, expect } from '@playwright/test';

test.describe('Woop App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Message Creation', () => {
    test('should display the input form', async ({ page }) => {
      await expect(page.getByPlaceholder('Add a woop')).toBeVisible();
      await expect(page.getByRole('button', { name: /add/i })).toBeVisible();
    });

    test('should create a new woop', async ({ page }) => {
      const testMessage = `Test message ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.getByRole('button', { name: /add/i }).click();

      await expect(page.getByText(testMessage)).toBeVisible();
    });

    test('should clear input after submitting', async ({ page }) => {
      const testMessage = 'Message to submit';
      const input = page.getByPlaceholder('Add a woop');

      await input.fill(testMessage);
      await page.getByRole('button', { name: /add/i }).click();

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
      await page.getByRole('button', { name: /add/i }).click();

      // Verify selector still shows 5 minutes
      await expect(page.getByRole('combobox')).toContainText('5 minutes');
    });
  });

  test.describe('Message Display', () => {
    test('should show copy button on messages', async ({ page }) => {
      const testMessage = `Copy button test ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.getByRole('button', { name: /add/i }).click();

      const woopItem = page.getByText(testMessage).locator('..');
      await expect(woopItem.getByRole('button')).toBeVisible();
    });

    test('should not show delete button on messages', async ({ page }) => {
      const testMessage = `No delete test ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.getByRole('button', { name: /add/i }).click();

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
      await page.getByRole('button', { name: /add/i }).click();
      await page.getByPlaceholder('Add a woop').fill(message2);
      await page.getByRole('button', { name: /add/i }).click();

      // Focus the first item
      const firstItem = page.getByText(message2).locator('..');
      await firstItem.focus();

      // Press down arrow
      await page.keyboard.press('ArrowDown');

      // Second item should be focused
      const secondItem = page.getByText(message1).locator('..');
      await expect(secondItem).toBeFocused();
    });

    test('should copy message content with Enter key', async ({ page }) => {
      const testMessage = `Copy with enter ${Date.now()}`;

      await page.getByPlaceholder('Add a woop').fill(testMessage);
      await page.getByRole('button', { name: /add/i }).click();

      // Focus and press Enter
      const woopItem = page.getByText(testMessage).locator('..');
      await woopItem.focus();
      await page.keyboard.press('Enter');

      // Check for the check icon (indicates copy success)
      await expect(page.locator('.lucide-check')).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no messages', async ({ page }) => {
      // This test assumes the page starts empty or we clear messages
      // Since we can't delete, we rely on expiration or fresh state
      await expect(page.getByText(/paste/i)).toBeVisible();
    });
  });
});
