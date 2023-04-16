// const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');

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

const { electron } = require('playwright-electron');

test.describe('My Electron App', () => {
  let app, window;

  test.beforeAll(async () => {
    app = await electron.launch({
      executablePath: 'C:/Usersmekis/OneDrive - Univerza v Mariboru/Dokumenti/app/app/node_modules/.bin/electron',
      args: ['./public/electron.js']
    });
    window = await app.newWindow();
  });

  test.afterAll(async () => {
    await app.close();
  });

  test('should navigate to the decks page and click the button', async () => {
    await window.goto(`file://${path.join(__dirname, '../build/index.html')}`);

    expect(await window.title()).toBe('Cards App');
  });
});

// const { chromium } = require('playwright');

// test('page title', (async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   await page.goto('http://localhost:3000');
//   const title = await page.title();
//   expect(title).toBe('Cards App');

//   await browser.close();
// })
// );

// const { chromium } = require('playwright');

// test.describe('Login page', () => {
//   test('should require authorization', async () => {
//     const browser = await chromium.launch();
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     await page.goto('http://localhost:3000');
//     await page.type('#username', 'masa@gmail.com');
//     await page.type('#password', 'masa');
//     await page.click('#submit');
//     const title = await page.title();
//     expect(title).toBe('Cards App');
//     await browser.close();
//   });
// });