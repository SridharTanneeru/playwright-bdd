// import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { chromium, BrowserContext } from "playwright";
import { Given, Then, When } from "@fixtures/fixture";
import { LoginPage } from "@pages/LoginPage";
import { glasshouseEnvSettings } from "env/glasshouse.env";
import { HomePage } from "@pages/HomePage";
import { clickLinkByHref } from "utils/locators";
import { navigateAndVerify, verifyTextDisplayed } from "utils/verifyFunctions";
import { getLatestEventMessages } from "utils/servicebusutil";
import { FloorPage } from "@pages/FloorPage";

// let browser;
// let page;
let homePage: HomePage
let floorPage: FloorPage  

Given("I navigate to the glasshouse homepage", async ({page}) => {

console.log("Base URL is: ", glasshouseEnvSettings.URLS.baseURL)
  await page.goto(glasshouseEnvSettings.URLS.baseURL);
  const loginPage = new LoginPage(page)
   homePage = await loginPage.login()
});

Then("the page title should be {string}", async ({}, expectedTitle: string) => {
  const title = await homePage.title();
  expect(title).toBe(expectedTitle);
});

Given("I navigate to the building page", async ({page}, expectedTitle: string) => {
  await navigateAndVerify(page, 'business', 'Data centres')
});

When("I navigate to the facility {string}", async ({ context }, facilityName: string) => {
  await homePage.navigateToFacility(facilityName);
});

interface ExtendedBrowserContext extends BrowserContext {
  floorName?: string;
  floorPrefix?: string;
}

When("I create a new {string}", async ({ context }: { context: ExtendedBrowserContext }, entity: string) => {

  const id = Date.now();
  const name = `Level ${id}`;
  const prefix = `L${id}`;

  // Store in context
  context.floorName = name;
  context.floorPrefix = prefix;

  if (entity.toLowerCase() === "floor") {
    await homePage.createFloor(name, prefix);
  } else {
    throw new Error(`Entity type '${entity}' is not supported yet.`);
  }
}
);

Then('the floor should be visible on the floors page', async ({ page, context }) => {
  const floorName = (context as ExtendedBrowserContext).floorName;
  floorPage = new FloorPage(page); // Initialize floorPage
  const floorHeaderLocator = await floorPage.getFloorHeaderLocator(page, floorName || '');

  await expect(floorHeaderLocator).toBeVisible();
  console.log(`✅ Verified that floor '${floorName}' is visible.`);
});

When('verify that the event has been created in the service bus for {string}', async ({context}, eventType: string) => {

  const name = (context as ExtendedBrowserContext).floorName;
    const prefix = (context as ExtendedBrowserContext).floorPrefix;

  const expectedTypeMap: Record<string, string> = {
    "floor add": "ndc.corp.facility.configuration.floor.added.v2",
    "floor remove": "ndc.corp.facility.configuration.floor.removed.v2",
    "hall add": "ndc.corp.facility.configuration.hall.added.v2",
    "hall remove": "ndc.corp.facility.configuration.hall.removed.v2"
    // add more as needed
  };

  const expectedType = expectedTypeMap[eventType.toLowerCase()];
  if (!expectedType) {
    throw new Error(`Unsupported event type: ${eventType}`);
  }

  const messages = await getLatestEventMessages(); // or getLatestEventMessage()

  const eventMessage = messages.find(
    (msg) =>
      msg.Type === expectedType &&
      msg.Data?.Name === name &&
      msg.Data?.Prefix === prefix
  );

  console.log("📨 Matching event message:", eventMessage);
  expect(eventMessage).toBeTruthy();
});

When('I delete the newly created floor', async ({ page, context }) => {
  const floorName = (context as ExtendedBrowserContext).floorName || '';
  floorPage = new FloorPage(page); // Initialize floorPage

  const actionButton = await floorPage.getFloorActionButton(page, floorName);
  await actionButton.click();

  const deleteOption = page.getByRole('menuitem', { name: 'Delete' });
  await deleteOption.click();

  // Click "Yes, delete floor" in confirmation dialog
  const confirmButton = page.locator('button:has-text("Yes, delete floor")');
  await expect(confirmButton).toBeVisible({ timeout: 5000 });
  await confirmButton.click();

  console.log(`🗑️ Deleted floor: ${floorName}`);
});

Then('the floor should not be visible on the floors page', async ({ page, context }) => {
  const floorName = (context as ExtendedBrowserContext).floorName || '';  
  floorPage = new FloorPage(page); // Initialize floorPage

  const locator = await floorPage.getFloorHeaderLocator(page, floorName);
  await expect(locator).toHaveCount(0, { timeout: 10000 }); // give it time to disappear

  console.log(`✅ Verified that floor '${floorName}' is not visible.`);
})

// Then("the page title should be {string}", async ({page}, expectedTitle) => {
//   const title = await homePage.title();
//   console.log("Home Page title seconds is: ", title)
//   expect(title).toBe(expectedTitle);
//   // // await page.close();
//   // await clickLinkByHref(page, 'business')
//   // await page.waitForLoadState("domcontentloaded");
//   // await verifyTextDisplayed(page, 'Data centres')

//   await navigateAndVerify(page, 'business', 'Data centres')

//   // await clickLinkByHref(page, 'people')
//   // await page.waitForLoadState("domcontentloaded");
//   // await page.waitForLoadState("networkidle");

//   // await verifyTextDisplayed(page, 'Tenants')

//   // await clickLinkByHref(page, 'hub')
//   // await page.waitForLoadState("domcontentloaded");
//   // await page.waitForLoadState("networkidle");


//   // await verifyTextDisplayed(page, 'Tenant telemetry')

//   // await clickLinkByHref(page, 'account_tree')
//   // await page.waitForLoadState("domcontentloaded");
//   // await page.waitForLoadState("networkidle");


//   // await verifyTextDisplayed(page, 'Explore')

//   // await clickLinkByHref(page, 'feed')
//   // await page.waitForLoadState("domcontentloaded");
//   // await page.waitForLoadState("networkidle");

//   // await verifyTextDisplayed(page, 'Audit trail')

//   // await clickLinkByHref(page, 'category')
//   // await page.waitForLoadState("domcontentloaded");
//   // await page.waitForLoadState("networkidle");

//   // await verifyTextDisplayed(page, 'Administration>Sensor types')

//   const id = Date.now();
//   const randomName = `Level ${id}`;
//   const randomPrefix = `L${id}`;

//   await homePage.navigateToFacility('C1');
//   await homePage.createFloor(randomName, randomPrefix);
//   await homePage.verifyFloorAddedEvent(randomName, randomPrefix);
// });

// 1. Missing step definition for "features\login.feature:7:5"
Then('I verify that the Device templates button exists on the home page', async ({}) => {
  // ...
});

// 2. Missing step definition for "features\login.feature:8:5"
When('I click on the Device templates page', async ({}) => {
  // ...
});

// 3. Missing step definition for "features\login.feature:9:5"
Then('the page displayed with the available device templates', async ({}) => {
  // ...
});