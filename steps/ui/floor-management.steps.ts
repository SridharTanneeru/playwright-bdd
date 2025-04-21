import { expect } from "@playwright/test";
import { Given, Then, When } from "@fixtures/fixture";
import { LoginPage } from "@pages/LoginPage";
import { glasshouseEnvSettings } from "env/glasshouse.env";
import { HomePage } from "@pages/HomePage";
import { navigateAndVerify } from "utils/verifyFunctions";
import { FloorPage } from "@pages/FloorPage";
import { generateFloorName } from "utils/nameGenerator";
import { EventType, eventTypeToMessageType } from '../../types/events';
import { ExtendedBrowserContext } from '../../types/browser';
import { waitForMessage } from '../../utils/messageUtils';
import { HallPage } from "@pages/HallPage";
import { RackPage } from "@pages/RackPage";


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

When("I create a new {string}", async ({ context }: { context: ExtendedBrowserContext }, entity: string) => {
  const { name, prefix } = generateFloorName();

  // Store in context
  context.floorName = name;
  context.floorPrefix = prefix;

  if (entity.toLowerCase() === "floor") {
    await homePage.createFloor(name, prefix);
  } else {
    throw new Error(`Entity type '${entity}' is not supported yet.`);
  }
});

Then('the floor should be visible on the floors page', async ({ page, context }) => {
  const floorName = (context as ExtendedBrowserContext).floorName;
  floorPage = new FloorPage(page); // Initialize floorPage
  const floorHeaderLocator = await floorPage.getFloorHeaderLocator(page, floorName || '');

  await expect(floorHeaderLocator).toBeVisible();
  console.log(`✅ Verified that floor '${floorName}' is visible.`);
});

When('verify that the event has been created in the service bus for {string}', async ({context}, eventTypeStr: string) => {
  const name = (context as ExtendedBrowserContext).floorName;
  const prefix = (context as ExtendedBrowserContext).floorPrefix;

  // Convert string to enum
  const eventType = Object.values(EventType).find(type => type === eventTypeStr.toLowerCase());
  if (!eventType) {
    throw new Error(`Unsupported event type: ${eventTypeStr}`);
  }

  // Get the corresponding message type
  const expectedType = eventTypeToMessageType[eventType];
  
  // Wait for the message to appear with retries
  const message = await waitForMessage(expectedType, context as ExtendedBrowserContext);

  const validateEventMessage = (msg: any, eventType: EventType, context: ExtendedBrowserContext) => {
    // Common validation for all event types
    if (!msg.Data) {
      console.log('❌ No Data field in message');
      return false;
    }

    // Event-specific validation
    switch (eventType) {
      case EventType.FLOOR_ADD:
      case EventType.FLOOR_REMOVE:
      case EventType.FLOOR_UPDATE:
        const floorMatch = msg.Data.Name === name && msg.Data.Prefix === prefix;
        console.log('🏢 Floor validation:', floorMatch, 'for', msg.Data.Name);
        return floorMatch;

      case EventType.HALL_ADD:
      case EventType.HALL_REMOVE:
      case EventType.HALL_UPDATE:
        const hallMatch = msg.Data.FloorId && 
          (msg.Data.FloorId.includes(context.floorName || '') || 
           msg.Data.FloorId.toLowerCase().includes((context.floorName || '').toLowerCase()));
        console.log('🏗️ Hall validation for message:', {
          messageName: msg.Data.Name,
          messageFloorId: msg.Data.FloorId,
          contextFloorName: context.floorName,
          messageTime: msg.Time,
          matched: hallMatch
        });
        return hallMatch;

      case EventType.RACK_ADD:
      case EventType.RACK_REMOVE:
      case EventType.RACK_UPDATE:
        const rackValidation = {
            nameMatch: msg.Data.Name === msg.Data.Id, // Name should match Id
            facilityMatch: msg.Data.FacilityId === (context.facilityId || 'C1'),
            floorMatch: msg.Data.FloorId?.includes(context.floorName || ''),
            hallMatch: msg.Data.HallId?.includes(context.hallShortId || ''),
            typeMatch: eventType === EventType.RACK_ADD ? msg.Data.RackType === 'FullRack' : true,
            rowMatch: eventType === EventType.RACK_ADD ? msg.Data.RowNumber === 1 : true,
            bayMatch: eventType === EventType.RACK_ADD ? msg.Data.BayNumber === 1 : true
        };

        console.log('🔍 Rack validation details:', {
            ...rackValidation,
            eventType,
            messageData: msg.Data
        });
        
        return Object.values(rackValidation).every(match => match === true);

      case EventType.POWER_CONNECTION_ADD:
      case EventType.POWER_CONNECTION_REMOVE:
        return msg.Data.RackId?.includes(context.rackId || '') &&
               msg.Data.HallId?.includes(context.hallShortId || '') &&
               msg.Data.FloorId?.includes(context.floorName || '');

      default:
        return false;
    }
  };

  const isValid = validateEventMessage(message, eventType, context as ExtendedBrowserContext);
  
  if (!isValid) {
    throw new Error(`Found message of correct type but validation failed. Message: ${JSON.stringify(message, null, 2)}`);
  }

  console.log("📨 Successfully validated event message:", {
    Type: message.Type,
    Time: message.Time,
    Name: message.Data?.Name,
    FloorId: message.Data?.FloorId
  });
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

When('I navigate to the hall view page', async ({ page, context: baseContext }) => {
    const context = baseContext as ExtendedBrowserContext;
    const hallPage = new HallPage(page);
    
    // Store facility ID if not already stored
    if (!context.facilityId) {
        context.facilityId = 'C1';
    }

    // Extract floor short ID from floor name
    if (!context.floorShortId && context.floorName) {
        context.floorShortId = `F${context.floorName.match(/\d+/)?.[0] || '1'}`;
    }

    await hallPage.navigateToHallView(context.hallName || '');
    await page.waitForSelector('button:has-text("Add rack")', { state: 'visible' });
    console.log('✅ Successfully navigated to hall view page');
});

When('I add a new rack to the hall', async ({ page, context: baseContext }) => {
    const context = baseContext as ExtendedBrowserContext;
    const rackPage = new RackPage(page);
    
    context.rackCount = (context.rackCount || 0) + 1;
    const rackId = `${context.facilityId || 'C1'}-${context.floorShortId || 'F1'}-${context.hallShortId || 'H1'}-R${context.rackCount}`;
    context.rackId = rackId;

    // Click add rack button
    await page.locator('button:has-text("Add rack")').click();
    
    // Fill in the rack details
    await rackPage.fillRackDetails({
        rackId: rackId,
        description: 'test description',
        rowNumber: '1',
        bayNumber: '1',
        type: 'FullRack', // or whatever rack types are available
        width: '600',
        height: '42',
        isStandardRack: true
    });

    // Click save
    await page.locator('button:has-text("Save")').click();
    
    // Wait for the rack to appear in the view
    await page.waitForSelector(`text=${rackId}`, { state: 'visible' });
    console.log(`✅ Successfully added rack with ID: ${rackId}`);
});

When('I delete the rack', async ({ page, context: baseContext }) => {
    const context = baseContext as ExtendedBrowserContext;
    const rackPage = new RackPage(page);
    
    if (!context.rackId) {
        throw new Error('No rack ID found in context. Make sure a rack was created first.');
    }

    await rackPage.deleteRack(context.rackId);
    console.log(`✅ Successfully deleted rack: ${context.rackId}`);
});

When('I navigate back to facility view', async ({ page, context: baseContext }) => {
    const context = baseContext as ExtendedBrowserContext;
    
    // Use breadcrumb navigation
    console.log('🔙 Navigating back using breadcrumb...');
    const facilityLink = page.locator(`.xng-breadcrumb-link:has-text("${context.facilityId || 'C1'}")`).first();
    await facilityLink.waitFor({ state: 'visible', timeout: 10000 });
    await facilityLink.click();
    
    await page.waitForLoadState('networkidle');
    console.log('✅ Successfully navigated back to facility view');
});

When('I navigate to the floor view', async ({ page, context: baseContext }) => {
    const context = baseContext as ExtendedBrowserContext;
    
    // Wait for the page to be ready
    await page.waitForLoadState('networkidle');
    
    // Click on the floor name to navigate to its view
    const floorLink = page.locator(`:text("${context.floorName}")`).first();
    await floorLink.waitFor({ state: 'visible', timeout: 10000 });
    await floorLink.click();
    
    // Wait for the floor view to load
    await page.waitForSelector('.floor-header', { state: 'visible', timeout: 10000 });
    console.log(`✅ Successfully navigated to floor view for: ${context.floorName}`);
});