import { expect, Page } from "playwright/test";
import { getLatestFloorEventMessage } from "utils/servicebusutil";


let randomName = `Level ${Date.now()}`;
let randomPrefix = `L${Date.now()}`;

export class HomePage {
    async initialisePage(): Promise<HomePage> {
        await this.page.waitForLoadState();
        return this;
    }
  
  
    readonly page: Page;


    constructor(page: Page) {
        this.page = page;
    }

    async title(): Promise<string> {
       
          return await this.page.title()
     
    }

    async navigateToFacility(facilityName: string): Promise<void> {
        // Wait for the page to be ready
        await this.page.waitForLoadState('networkidle');
        
        // Click on the facility link in the breadcrumb
        const facilityLink = this.page.locator('.mat-mdc-card-title .title', { hasText: facilityName }).first();
        await facilityLink.waitFor({ state: 'visible', timeout: 10000 });
        await facilityLink.click();
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
    }

    async createFloor(name: string, prefix: string, description = 'test description'): Promise<void> {
        await this.page.locator(`div.floor .floor-header .add-card`).click();

        await this.page.fill('[placeholder="Name"]', name);
        await this.page.fill('[placeholder="Prefix"]', prefix);
        await this.page.fill('[placeholder="Description"]', description);
        await this.page.click('button:has-text("Save")');


    }

    async verifyFloorAddedEvent(name: string, prefix: string): Promise<void> {
        const message = await this.waitForFloorAddedMessage(name, prefix);
        expect(message).toBeTruthy();
      }

    async waitForFloorAddedMessage(name: string, prefix: string, retries = 5) {
        for (let i = 0; i < retries; i++) {
          const messages = await getLatestFloorEventMessage();

          if (!messages || messages.length === 0) { 
            console.log("No messages found, retrying...");
            await new Promise((res) => setTimeout(res, 3000)); // Wait 3s
            continue;
          }
          console.log(`Messages found: ${messages.length}`);
      
          const floorCreated = messages.find(
            (msg) =>
              msg.Type === 'ndc.corp.facility.configuration.floor.added.v2' 
            && msg.Data?.Name === name && msg.Data?.Prefix === prefix
          );

          console.log(`Floor created message: ${JSON.stringify(floorCreated)}`);
      
          if (floorCreated) return floorCreated;
      
          console.log(`Waiting for message... attempt ${i + 1}`);
          await new Promise((res) => setTimeout(res, 3000)); // Wait 3s
        }
        throw new Error('Floor creation event message not found after retries.');
}
}