import { expect } from "@playwright/test";
import { When, Then } from "@fixtures/fixture";
import { HallPage } from "@pages/HallPage";
import { generateHallName } from "utils/nameGenerator";
import { BrowserContext } from "playwright";

let hallPage: HallPage;

interface ExtendedBrowserContext extends BrowserContext {
    floorName?: string;
    floorPrefix?: string;
    hallName?: string;
    hallPrefix?: string;
}

When('I add a new hall to the current floor', async ({ page, context }) => {
    hallPage = new HallPage(page);
    const { name, prefix } = generateHallName();
    const floorName = (context as ExtendedBrowserContext).floorName || '';

    // Store hall details in context
    (context as ExtendedBrowserContext).hallName = name;
    (context as ExtendedBrowserContext).hallPrefix = prefix;

    await hallPage.createHall(floorName, name);
    console.log(`✨ Created new hall: ${name} under floor: ${floorName}`);
});

Then('the hall should be visible on the floor page', async ({ page, context }) => {
    const hallName = (context as ExtendedBrowserContext).hallName;
    const locator = await hallPage.getHallHeaderLocator(hallName || '');
    
    await expect(locator).toBeVisible();
    console.log(`✅ Verified that hall '${hallName}' is visible.`);
});

When('I delete the newly created hall', async ({ page, context }) => {
    const hallName = (context as ExtendedBrowserContext).hallName || '';
    await hallPage.deleteHall(hallName);
    console.log(`🗑️ Deleted hall: ${hallName}`);
});

Then('the hall should not be visible on the floor page', async ({ page, context }) => {
    const hallName = (context as ExtendedBrowserContext).hallName || '';
    const locator = await hallPage.getHallHeaderLocator(hallName);
    
    await expect(locator).toHaveCount(0, { timeout: 10000 }); // give it time to disappear
    console.log(`✅ Verified that hall '${hallName}' is not visible.`);
}); 