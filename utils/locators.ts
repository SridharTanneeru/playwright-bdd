import { expect, Page } from "playwright/test";

 // Function to find and click an element based on text
 export async function clickLinkByHref(page: Page, iconText: string): Promise<void> {
  const link = page.locator(`//mat-icon[text()="${iconText}"]`);
      // Expect the link to be visible before clicking
      await expect(link).toBeVisible({ timeout: 5000 });
  // await link.waitFor({ state: "visible", timeout: 5000 }); // Wait for the element to be visible
  await link.click(); // Click the element
  await page.waitForLoadState("domcontentloaded");

  }

