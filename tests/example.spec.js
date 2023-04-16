// @ts-check

const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('delete button test', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();

  // Navigate to the Decks page
  await window.goto('http://localhost:3000');

  // Find the delete button
  const deleteButton = await window.$('button:has-text("Delete")');

  // Check that the delete button exists on the page
  expect(deleteButton).not.toBeNull();

  // Close the app
  await electronApp.close();
});