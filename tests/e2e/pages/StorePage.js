import { BasePage } from './BasePage';

export class StorePage extends BasePage {
    constructor(page) {
        super(page);
        this.coinBalance = page.locator('header .bg-gold-500').first(); // Adjust if balance is elsewhere
        this.itemCards = page.locator('.glass.p-4.rounded-xl');
    }

    async getItemCard(itemName) {
        return this.itemCards.filter({ hasText: itemName });
    }

    async purchaseItem(itemName) {
        const card = await this.getItemCard(itemName);
        await this.clickRpgButton(card.locator('button:has-text("Comprar")'));
    }

    async equipItem(itemName) {
        const card = await this.getItemCard(itemName);
        await this.clickRpgButton(card.locator('button:has-text("Equipar")'));
    }

    async getEquippedStatus(itemName) {
        const card = await this.getItemCard(itemName);
        return await card.locator('button:has-text("Equipado")').isVisible();
    }
}
