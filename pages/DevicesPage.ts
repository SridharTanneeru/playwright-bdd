// pages/DevicesPage.ts
import { Page, Locator } from "@playwright/test";
import { TableUtils, TableColumn } from "../utils/tableUtils";

export class DevicesPage {
    readonly page: Page;
    readonly devicesButton: Locator;
    readonly addDeviceButton: Locator;
    readonly expectedColumns: TableColumn[];
    devicesList: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators
        this.devicesButton = page.getByRole('button', { name: 'Devices' });
        this.addDeviceButton = page.getByRole('button', { name: 'Add device' });
        this.devicesList = page.locator('table .mdc-data-table__content tr');
        
        // Define expected columns for Devices table
        this.expectedColumns = [
            { header: 'Type' },
            { header: 'Name' },
            { header: 'Parent' },
            { header: 'Hall' },
            { header: 'Rack' },
            { header: 'Description' },
            { header: 'Properties' },
            { header: 'Sensor Count' },
            { header: 'Actions' }
        ];
    }

    async navigateToDevices(): Promise<void> {
        console.log('🔍 Clicking Devices button...');
        await this.devicesButton.click();
        await this.page.waitForURL('**/devices/**');
        await this.page.waitForLoadState('networkidle');
        // await this.page.waitForURL('**/glasshouse/devices');
        console.log('✅ Navigated to Devices page');
    }

    async isPageDisplayed(): Promise<boolean> {
          // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
        // Verify URL contains devices
        const currentUrl = this.page.url();
        console.log(`🔍 Current URL: ${currentUrl}`);
        const hasCorrectUrl = currentUrl.includes('/devices/');
        
        // Verify breadcrumb
        const breadcrumb = this.page.locator('ol.xng-breadcrumb-list');
        const isBreadcrumbVisible = await breadcrumb.isVisible();
        
        console.log(`✅ Page verification - URL: ${hasCorrectUrl}, Breadcrumb: ${isBreadcrumbVisible}`);
        return hasCorrectUrl && isBreadcrumbVisible;
    }

    async verifyTableColumns(): Promise<boolean> {
        return TableUtils.verifyTableColumns(
            this.page,
            this.expectedColumns,
            'Devices'
        );
    }

    async isAddDeviceButtonVisible(): Promise<boolean> {
        return await this.addDeviceButton.isVisible();
    }

    async verifyActionsMenu(deviceName: string): Promise<boolean> {
        // Find the row for the device
        try {
        const firstRow = this.devicesList.first();
        const actionMenu = firstRow.locator('button[aria-haspopup="menu"]');
        
        await actionMenu.click();
        const editOption = this.page.getByRole('menuitem', { name: 'Edit' });
        const isVisible = await editOption.isVisible();
        console.log(`✅ Edit option is visible: ${isVisible}`);

        // try {
        //     await actionMenu.waitFor({ state: 'visible' });
        //     await actionMenu.click();
            
        //     // Check for common action items
        //     const menuItems = this.page.locator('mat-menu-item');
        //     const isMenuVisible = await menuItems.first().isVisible();
            
        //     // Close the menu
        //     await this.page.keyboard.press('Escape');
            
            return isVisible;
        } catch (error) {
            console.log(`❌ Error verifying actions menu: ${error.message}`);
            return false;
        }
    }
}