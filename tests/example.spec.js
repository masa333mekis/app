// const { _electron: electron } = require('playwright');
// const { test, expect } = require('@playwright/test');


// test('delete button test', async () => {
//   const electronApp = await electron.launch({ args: ['./public/electron.js'] });
//   const window = await electronApp.firstWindow();

//   // Navigate to the Decks page
//   await window.goto('http://localhost:3000');

//   // Find the delete button
//   const deleteButton = await window.$('button:has-text("Delete")');

//   // Check that the delete button exists on the page
//   expect(deleteButton).not.toBeNull();

//   // Close the app
//   await electronApp.close();
// });

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000');
  const title = await page.title();
  console.log(title);

  await browser.close();
})();