import { BasePage } from './BasePage';

export class BookSearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.searchInput = page.locator('input[placeholder*="Busca tu próximo tomo"]');
        this.searchButton = page.locator('button:has-text("Buscar")');
        this.bookCards = page.locator('.group\\/card');
    }

    async search(query) {
        await this.searchInput.fill(query);
        await this.clickRpgButton(this.searchButton);
        // Wait for results to appear or for loading to finish
        await this.page.waitForLoadState('networkidle');
    }

    async getFirstBookTitle() {
        return await this.bookCards.first().locator('h3').innerText();
    }

    async consumeBook(title) {
        const bookCard = this.bookCards.filter({ hasText: title });
        const consumeButton = bookCard.locator('button:has-text("Consumir Saber")');
        await this.clickRpgButton(consumeButton);
    }
}
