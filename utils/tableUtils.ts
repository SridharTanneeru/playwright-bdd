// utils/tableUtils.ts
import { Page, Locator } from "@playwright/test";

export interface TableColumn {
    header: string;
    isVisible?: boolean;
}

export class TableUtils {
    static async verifyTableColumns(
        page: Page, 
        expectedColumns: TableColumn[],
        description: string = 'table'
    ): Promise<boolean> {
        console.log(`🔍 Verifying columns for ${description}...`);
        
        let allColumnsValid = true;
        
        // Wait for the table header row
        await page.waitForSelector('table .mat-mdc-header-row', { state: 'visible' });
        
        for (const column of expectedColumns) {
            // Use the more specific Material table header cell selector
            // table .mat-mdc-header-row th.mat-mdc-header-cell
            // const columnHeader = page.locator(`th[role="columnheader"]`, {
            //     hasText: column.header
            // });
            // const columnHeader = page.locator(`th[role="columnheader"]:text-is("${column.header}")`);
            
            const columnHeader = page.locator(`th[role="columnheader"]:has-text("${column.header}")`, {
                hasText: new RegExp(`^${column.header}$`) // Use regex for exact match
            });

            try {
                await columnHeader.waitFor({ state: 'visible', timeout: 5000 });
                console.log(`✅ Column "${column.header}" is visible`);
            } catch (error) {
                console.log(`❌ Column "${column.header}" is not visible`);
                allColumnsValid = false;
            }
        }
        
        return allColumnsValid;
    }
}