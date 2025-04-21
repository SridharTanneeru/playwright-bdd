import {  Locator, Page } from "playwright/test";
import { HomePage } from "./HomePage";

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
        await this.page.waitForLoadState('load');
        return new HomePage(this.page).initialisePage()
    }


}