import { When, Then } from '@fixtures/fixture';
import { expect } from '@playwright/test';
import { DevicesPage } from '@pages/DevicesPage';

let devicesPage: DevicesPage;

When('I click on the Devices button', async ({ page }) => {
    devicesPage = new DevicesPage(page);
    await devicesPage.navigateToDevices();
});

Then('the Devices page should be displayed', async () => {
    expect(await devicesPage.isPageDisplayed()).toBeTruthy();
});

Then('I should see all the required columns in the devices list', async () => {
    expect(await devicesPage.verifyTableColumns()).toBeTruthy();
});

Then('the {string} button should be visible in devices page', async ({}, buttonName: string) => {
    expect(await devicesPage.isAddDeviceButtonVisible()).toBeTruthy();
});

Then('the actions menu should be available for devices', async () => {
    // Check the first device in the list
    expect(await devicesPage.verifyActionsMenu('any-device-name')).toBeTruthy();
});