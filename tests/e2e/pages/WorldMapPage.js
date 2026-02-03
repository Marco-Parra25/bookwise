import { BasePage } from './BasePage';

export class WorldMapPage extends BasePage {
    constructor(page) {
        super(page);
        this.nodes = page.locator('.group\\/node');
    }

    async getAvatarNodeLevel() {
        // Find the node that contains the avatar (div with role=img or similar, but here it's text or img)
        // From WorldMap.jsx, if node.current is true, it renders a div with animate-float-fast
        const avatarContainer = this.page.locator('.animate-float-fast');
        const parentNode = this.nodes.filter({ has: avatarContainer });
        // The level number is in a div with font-black and text-xl
        const levelText = await parentNode.locator('.font-black.text-xl').first().innerText();
        return parseInt(levelText.trim());
    }

    async isNodeCompleted(level) {
        const node = this.nodes.filter({ hasText: level.toString() });
        const completedBadge = node.locator('text=LEÍDO');
        return await completedBadge.isVisible();
    }
}
