import { expect } from '@playwright/test';

/**
 * BasePage class to encapsulate shared logic for all Page Objects.
 * Handles asynchrony and common UI patterns in the Bookwise RPG.
 */
export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(path = '/') {
        await this.page.goto(path);
    }

    /**
     * Waits for Framer Motion animations to settle.
     * Useful for ensuring components are fully interactive.
     */
    async waitForAnimation(ms = 500) {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Handles common RPG-style button clicks with slight delay for visual feedback.
     */
    async clickRpgButton(locator) {
        const button = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await button.scrollIntoViewIfNeeded();
        // Ensuring the button is visible and enabled
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
        // Using a slight delay to allow animations to settle
        await this.page.waitForTimeout(300);
        await button.click({ force: true });
        await this.waitForAnimation(500);
    }

    async getTitle() {
        return await this.page.title();
    }
}
