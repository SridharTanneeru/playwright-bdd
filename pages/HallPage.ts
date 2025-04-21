import { Locator, Page } from "@playwright/test";

export class HallPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createHall(floorName: string, name: string, description = 'test description', powerCapacity = '1000'): Promise<void> {
        // Wait for the floor to be fully loaded with a longer timeout
        const floorSection = this.page.locator(`.floor:has(.floor-header h2:text-is("${floorName}"))`);
        await floorSection.waitFor({ state: 'visible', timeout: 30000 });
        
        // Wait a bit for any animations to complete
        await this.page.waitForTimeout(1000);
        
        // Click add hall button within the specific floor
        await floorSection.locator('.add-card').first().click();
        
        // Fill in the form using mat-form-field selectors
        await this.page.locator('[placeholder="Name"]').fill(name);
        await this.page.locator('[placeholder="Description"]').fill(description);
        await this.page.locator('[placeholder="Power Capacity"]').fill(powerCapacity);
        
        // Select row direction using material select
        await this.page.locator('mat-select[name="rowDirection"]').click();
        await this.page.locator('mat-option:has-text("Left to right")').click();
        
        // Select containment type
        await this.page.locator('mat-select[name="containment"]').click();
        await this.page.locator('mat-option:has-text("Hot aisle")').click();
        
        // Save the hall
        await this.page.locator('button:has-text("Save")').click();
    }

    async getHallHeaderLocator(hallName: string): Promise<Locator> {
        // Looking at the DOM structure, the hall title is in a mat-card with a title class
        return this.page.locator(`.mat-mdc-card:has(.title:text-is("${hallName}"))`);
    }

    async getHallActionButton(hallName: string): Promise<Locator> {
        // First ensure the hall card is visible
        const hallCard = await this.getHallHeaderLocator(hallName);
        await hallCard.waitFor({ state: 'visible', timeout: 10000 });
        
        // Then get the action button within that card
        return hallCard.locator('button[aria-haspopup="menu"]');
    }

    async deleteHall(hallName: string): Promise<void> {
        console.log(`🗑️ Attempting to delete hall: ${hallName}`);
        
        // Wait for any loading states or animations to complete
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);

        const actionButton = await this.getHallActionButton(hallName);
        
        // Ensure the button is visible and clickable
        await actionButton.waitFor({ state: 'visible', timeout: 10000 });
        await actionButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        console.log('🖱️ Clicking hall action button...');
        await actionButton.click();

        console.log('🔍 Looking for Delete option...');
        const deleteOption = this.page.getByRole('menuitem', { name: 'Delete' });
        await deleteOption.waitFor({ state: 'visible', timeout: 5000 });
        await deleteOption.click();

        console.log('✔️ Confirming deletion...');
        const confirmButton = this.page.locator('button:has-text("Yes, delete hall")');
        await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
        await confirmButton.click();

        // Wait for the deletion to complete
        await this.page.waitForLoadState('networkidle');
        console.log('✅ Hall deletion completed');
    }

    async navigateToHallView(hallName: string): Promise<void> {
        // Click on the hall title to navigate to hall view
        const hallTitle = this.page.locator(`.mat-mdc-card:has(.title:text-is("${hallName}")) .title`);
        await hallTitle.click();
        
        // Wait for navigation and hall view to load
        await this.page.waitForURL(/.*\/hall\/.*/);
        await this.page.waitForSelector('button:has-text("Add rack")', { state: 'visible' });
    }
} 