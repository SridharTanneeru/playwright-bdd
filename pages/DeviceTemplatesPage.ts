import { Page, Locator } from "@playwright/test";
import { TableColumn, TableUtils } from "utils/tableUtils";

export class DeviceTemplatesPage {
    readonly page: Page;
    
    // Locators
    readonly deviceTemplatesIcon: Locator;
    readonly deviceTemplatesList: Locator;
    readonly addDeviceTypeButton: Locator;
    readonly breadcrumbList: Locator;
    readonly searchInput: Locator;
    readonly deviceAllowFilter: Locator;
    readonly parentTypesFilter: Locator;
    readonly childTypesFilter: Locator;
    readonly resetButton: Locator;

    readonly expectedColumns: TableColumn[];

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators based on the UI structure from screenshot
        this.deviceTemplatesIcon = page.locator('mat-icon[data-mat-icon-type="font"]').filter({ hasText: 'view_quilt' });
        this.deviceTemplatesList = page.locator('table .mdc-data-table__content tr');
        this.addDeviceTypeButton = page.getByRole('button', { name: 'Add Device Type' });
        this.breadcrumbList = page.locator('ol.xng-breadcrumb-list');
        this.searchInput = page.locator('input[placeholder="Search"]');
        this.deviceAllowFilter = page.locator('mat-select[aria-label="Device Allow"]');
        this.parentTypesFilter = page.locator('mat-select[aria-label="Parent Types"]');
        this.childTypesFilter = page.locator('mat-select[aria-label="Child Types"]');
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        // Define expected columns for Device Templates
        this.expectedColumns = [
            { header: 'Type' },
            { header: 'Display Name' },
            { header: 'Allow Location' },
            { header: 'Parent Device Types' },
            { header: 'Child Device Types' },
            { header: 'Properties' },
            { header: 'Device Count' },
            { header: 'Actions' }
        ];
    }

    async navigateToDeviceTemplates(): Promise<void> {
        console.log('🔍 Clicking Device Templates icon...');
        await this.deviceTemplatesIcon.click();
        await this.page.waitForURL('**/classification/device-templates');
        await this.page.waitForLoadState('networkidle');
        console.log('✅ Navigated to Device Templates page');
    }

    async isPageDisplayed(): Promise<boolean> {
        // Wait for breadcrumb to be visible
        await this.breadcrumbList.waitFor({ state: 'visible' });
        
        // Check if we have the correct breadcrumb items
        const adminItem = this.page.locator('.xng-breadcrumb-item', { hasText: 'Administration' });
        const deviceTemplatesItem = this.page.locator('.xng-breadcrumb-trail', { hasText: 'Device Templates' });
        
        const isAdminVisible = await adminItem.isVisible();
        const isDeviceTemplatesVisible = await deviceTemplatesItem.isVisible();
        
        console.log(`✅ Breadcrumb visibility check - Admin: ${isAdminVisible}, Device Templates: ${isDeviceTemplatesVisible}`);
        
        return isAdminVisible && isDeviceTemplatesVisible;
    }

    async isDeviceTemplatesListVisible(): Promise<boolean> {
        await this.deviceTemplatesList.first().waitFor({ state: 'visible' });
        return true;
    }

    async isAddDeviceTypeButtonVisible(): Promise<boolean> {
        return await this.addDeviceTypeButton.isVisible();
    }

    async isDeleteActionVisibleForTemplate(templateName: string): Promise<boolean> {
        console.log(`🔍 Checking delete action visibility for template: ${templateName}`);
        const row = this.page.locator('mat-row', { has: this.page.locator(`text=${templateName}`) });
        const actionMenu = row.locator('button[aria-haspopup="menu"]');
        
        await actionMenu.click();
        const deleteOption = this.page.getByRole('menuitem', { name: 'Delete' });
        const isVisible = await deleteOption.isVisible();
        
        // Close the menu
        await this.page.keyboard.press('Escape');
        console.log(`✅ Delete action visibility: ${isVisible}`);
        return isVisible;
    }

    async isDeleteActionAvailable(): Promise<boolean> {
        // Get the first template row and check its action menu
        const firstRow = this.deviceTemplatesList.first();
        const actionMenu = firstRow.locator('button[aria-haspopup="menu"]');
        
        await actionMenu.click();
        const deleteOption = this.page.getByRole('menuitem', { name: 'Delete' });
        const isVisible = await deleteOption.isVisible();
        
        // Close the menu
        await this.page.keyboard.press('Escape');
        console.log(`✅ Delete action availability: ${isVisible}`);
        return isVisible;
    }

    async verifyTableColumns(): Promise<boolean> {
        return TableUtils.verifyTableColumns(
            this.page,
            // 'table .mat-mdc-header-row',  // or the appropriate selector for your table header row
            this.expectedColumns,
            'Device Templates'
        );
    }
}