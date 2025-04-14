import { expect, Locator, Page } from "playwright/test";
import { HomePage } from "./HomePage";
import { getLatestFloorEventMessage } from "utils/servicebusutil";

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.locator('#username');
        this.password = page.locator('[data-testid="login-page-password-input"]');
        this.continueButton = page.locator('button[type="submit"]', { hasText: 'Continue' });
    }

    async login(): Promise<HomePage> {
        await this.username.fill('test.automation@nextdc.com');
        await this.password.fill('YourNewStr(0)ngPassword1!')
        await this.continueButton.click()
        await this.page.waitForTimeout(2000); // Waits for 3 seconds
        // await this.page.waitForNavigation(); 
        await this.page.waitForLoadState('load');
        return new HomePage(this.page).initialisePage()
    }

    // async navigateToFacility(): Promise<void> {
    //     await this.page.locator(`//div[contains(text(),'817')]`).click()
    //     // .goto('/facility/overview', { waitUntil: 'networkidle' });
    //     await this.page.locator(`div.floor .floor-header .add-card`).click();

    //     // await this.page.locator(`//input[@name="name"]`).fill('Floor 1 Automation Test');
    //     // await this.page.locator(`//input[@name="prefix"]`).fill('PF1AUTO');
    //     // await this.page.locator(`//button//span[contains(text(),'Save')]`).click();

    //     await this.page.fill('[placeholder="Name*"]', 'Level 99');
    //     await this.page.fill('[placeholder="Prefix*"]', 'L99');
    //     await this.page.fill('[placeholder="Description"]', 'test descriqtion');
    //     await this.page.click('button:has-text("Save")');

    //     const messages = await getLatestFloorEventMessage();
    //     const floorCreated = messages.find((msg) =>
    //     msg.name === 'Level 99' && msg.prefix === 'L99'
    //     );

    //     expect(floorCreated).toBeTruthy();
    // }
}