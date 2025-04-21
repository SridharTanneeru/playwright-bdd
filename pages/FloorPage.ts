import { Locator, Page } from "@playwright/test";

export class FloorPage {
    async initialisePage(): Promise<FloorPage> {
        await this.page.waitForLoadState();
        return this;
    }
  
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getFloorHeaderLocator(page: Page, floorName: string): Promise<Locator> {
        return page.locator(`.floor-header:has(h2:text-is("${floorName}"))`);
    }
  
    async getFloorActionButton(page: Page, floorName: string): Promise<Locator> {
        return page.locator(`.floor-header:has(h2:text-is("${floorName}")) >> button[aria-haspopup="menu"]`);
    }

    async getHallsUnderFloor(page: Page, floorName: string): Promise<Locator> {
        return page.locator(`.floor:has(.floor-header h2:text-is("${floorName}")) .hall-container`);
      }
}