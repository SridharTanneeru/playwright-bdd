import { Page } from "@playwright/test";

interface RackDetails {
    rackId: string;
    description: string;
    rowNumber: string;
    bayNumber: string;
    type: string;
    width: string;
    height: string;
    isStandardRack: boolean;
}

export class RackPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillRackDetails(details: RackDetails): Promise<void> {
        // Fill in Rack ID
        await this.page.locator('input[name="rackId"]').fill(details.rackId);
        
        // Fill in Description
        await this.page.locator('textarea[placeholder="Description"]').fill(details.description);
        
        // Fill in Row and Bay numbers
        await this.page.locator('input[placeholder="Row Number"]').fill(details.rowNumber);
        await this.page.locator('input[placeholder="Bay Number"]').fill(details.bayNumber);
        
        // Select Type
        await this.page.locator('mat-select[name="rackTypeSelector"]').click();
        await this.page.locator(`mat-option:has-text("${details.type}")`).click();
        
        // Fill in Width and Height
        // if (!details.isStandardRack) {
            // await this.page.locator('input[placeholder="Width"]').fill(details.width);
            await this.page.locator('mat-form-field:has-text("Width mm") input').fill(details.width);
            await this.page.locator('mat-form-field:has-text("Height ru") input').fill(details.height);
            // await this.page.locator('input[placeholder="Height"]').fill(details.height);
        // } else {
            // Click the standard rack checkbox if it's a standard rack
            // await this.page.locator('mat-checkbox[formcontrolname="isStandardRack"]').click();
        // }
    }

    async deleteRack(rackId: string): Promise<void> {
        console.log(`🗑️ Attempting to delete rack: ${rackId}`);
        
        // Wait for any loading states or animations to complete
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);

        // First select the rack by clicking on it
        const rackElement = this.page.locator(`div[id="rack_${rackId}"]`);
        await rackElement.waitFor({ state: 'visible', timeout: 10000 });
        await rackElement.scrollIntoViewIfNeeded();
        await rackElement.click();
        
        console.log('✅ Selected rack');
        await this.page.waitForTimeout(500); // Wait for selection to register

        // Now find and click the delete button in the toolbar
        const deleteButton = this.page.locator('button:has(mat-icon:has-text("delete"))');
        await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
        
        console.log('🖱️ Clicking rack delete button...');
        await deleteButton.click();

        console.log('✔️ Confirming rack deletion...');
        const confirmButton = this.page.locator('button:has-text("Yes, delete rack")');
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();

        // Wait for the deletion to complete
        await this.page.waitForLoadState('networkidle');
        console.log('✅ Rack deletion completed');
    }
} 