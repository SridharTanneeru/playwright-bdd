import { Given, Then, When } from "@fixtures/fixture";
import { FloorPage } from "@pages/FloorPage";
import * as path from "path";
import { expect } from "playwright/test";

let floorPage: FloorPage  

// Extend BrowserContext to include custom properties
declare module 'playwright' {
  interface BrowserContext {
    floorName?: string;
    floorPrefix?: string;
  }
}

When('I import floor data from file {string}', async ({ page, context }, filePath: string) => {
    const absolutePath = path.resolve(filePath);
    const fileChooserPromise = page.waitForEvent('filechooser');
  
    await page.click('button:has-text("Import")'); // Adjust selector to your import trigger
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(absolutePath);
  
    // Optional: Wait for UI feedback (toast/snackbar, spinner)
    await page.waitForSelector('text=Import completed successfully', { timeout: 10000 });
  
    // Store the imported floor name to context (e.g., Level 99)
    const importedName = 'Level 99';
    const importedPrefix = 'L99';
  
    context.floorName = importedName;
    context.floorPrefix = importedPrefix;
  });

  Then('the floor {string} should be visible on the floors page', async ({ page }, floorName: string) => {
    floorPage = new FloorPage(page); // Initialize floorPage
    const locator = await floorPage.getFloorHeaderLocator(page, floorName);
    await expect(locator).toBeVisible();
  });