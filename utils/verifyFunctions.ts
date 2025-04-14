import { Page, expect } from "playwright/test";
import { clickLinkByHref } from "./locators";

export async function navigateAndVerify(page: Page, href: string, expectedText: string) {
    await clickLinkByHref(page, href);
    await page.waitForLoadState("domcontentloaded");
    await verifyTextDisplayed(page, expectedText);
  }

export async function verifyTextDisplayed(page: Page, text: string): Promise<void> {
    const actualText = await (await page.waitForSelector('h3', { state: 'visible', timeout: 5000 })).textContent() //`text=${text}`);
    console.log("Actual text: ", actualText)
    expect(await actualText).toBe(text)//.toBeVisible()
}