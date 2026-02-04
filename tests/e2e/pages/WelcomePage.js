import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WelcomePage extends BasePage {
    constructor(page) {
        super(page);
        this.continueButton = page.locator('button:has-text("CONTINUAR")');
        this.guestModeButton = page.getByRole('button', { name: /MODO INVITADO/i });
    }

    async proceedToGuestMode() {
        // The welcome screen has multiple steps with "CONTINUAR" button
        for (let i = 0; i < 3; i++) {
            await expect(this.continueButton).toBeVisible();
            await this.clickRpgButton(this.continueButton);
        }

        // Last step has the guest mode button
        await expect(this.guestModeButton).toBeVisible();
        await this.clickRpgButton(this.guestModeButton);
    }
}
