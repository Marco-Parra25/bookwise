import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
        this.characterName = page.locator('h1.magic-text');
        this.levelBadge = page.locator('.bg-gold-500');
    }

    async getCharacterName() {
        return await this.characterName.innerText();
    }

    async getLevelText() {
        // Specifically look for the rank label in the profile section
        return await this.page.locator('.glass h2 + div .bg-gold-500').innerText();
    }
}
