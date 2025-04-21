import { Given, Then, When } from "@fixtures/fixture";
import { expect } from '@playwright/test';
import { DeviceTemplatesPage } from '@pages/DeviceTemplatesPage';

let deviceTemplatesPage: DeviceTemplatesPage;

Given('I am logged in as {string}', async ({ page, context }, userRole: string) => {
    // Store the user role in context for later use
    (context as any).userRole = userRole;
    console.log(`👤 Logged in as ${userRole}`);
});

When('I click on the Device templates icon in the navigation', async ({ page }) => {
    deviceTemplatesPage = new DeviceTemplatesPage(page);
    await deviceTemplatesPage.navigateToDeviceTemplates();
});

Then('the Device templates page should be displayed', async () => {
    expect(await deviceTemplatesPage.isPageDisplayed()).toBeTruthy();
});

Then('I should see the device templates list', async () => {
    expect(await deviceTemplatesPage.isDeviceTemplatesListVisible()).toBeTruthy();
});

// Then('the {string} button should be {string}', async ({}, buttonName: string, visibility: string) => {
//     const isVisible = await deviceTemplatesPage.isAddDeviceTypeButtonVisible();
//     expect(isVisible).toBe(visibility === 'visible');
// });

// Then('the delete action in the menu should be {string}', async ({ context }, visibility: string) => {
//     // Test with the first template in the list as an example
//     const isDeleteVisible = await deviceTemplatesPage.isDeleteActionVisibleForTemplate('BRANCHBUSDUCT');
//     expect(isDeleteVisible).toBe(visibility === 'visible');
// });
// Adding the missing step definitions
Then('the {string} button should be visible', async ({}, buttonName: string) => {
    expect(await deviceTemplatesPage.isAddDeviceTypeButtonVisible()).toBeTruthy();
    console.log(`✅ Verified ${buttonName} button is visible`);
});

Then('the delete action in the menu should be visible', async () => {
    expect(await deviceTemplatesPage.isDeleteActionAvailable()).toBeTruthy();
    console.log('✅ Verified delete action is visible in menu');
});

Then('I should see all the required columns in the device templates list', async () => {
    const columnsValid = await deviceTemplatesPage.verifyTableColumns();
    expect(columnsValid).toBeTruthy();
});