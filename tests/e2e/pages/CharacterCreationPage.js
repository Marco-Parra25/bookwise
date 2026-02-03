import { BasePage } from './BasePage';

export class CharacterCreationPage extends BasePage {
    constructor(page) {
        super(page);
        this.nameInput = page.locator('#character-name');
        this.manifestButton = page.getByRole('button', { name: /MANIFESTAR AVATAR/i });
    }

    async ingresarNombreReceptaculo(name) {
        await this.nameInput.fill(name);
    }

    async seleccionarAvatar(avatarName) {
        // Select avatar by its label (e.g., "Mago", "Dragón")
        const avatarButton = this.page.locator(`button:has-text("${avatarName}")`);
        await this.clickRpgButton(avatarButton);
    }

    async confirmarAventura() {
        await this.clickRpgButton(this.manifestButton);
    }
}
