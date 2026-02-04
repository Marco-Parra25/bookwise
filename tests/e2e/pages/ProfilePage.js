import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
    constructor(page) {
        super(page);
        this.ageInput = page.locator('#age-input');
        this.discoveryButton = page.getByRole('button', { name: /Ver Destino/i });
    }

    async seleccionarOpcion(optionLabel) {
        const option = this.page.getByRole('button').filter({ hasText: optionLabel });
        await this.clickRpgButton(option);
    }

    async ingresarEdad(age) {
        await this.ageInput.fill(age.toString());
    }

    async verDestino() {
        await this.clickRpgButton(this.discoveryButton);
    }

    async completarCuestionario({ genre, hobby, mood, age }) {
        await this.seleccionarOpcion(genre);
        await this.seleccionarOpcion(hobby);
        await this.seleccionarOpcion(mood);
        await this.ingresarEdad(age);
        await this.verDestino();
        // Esperar a que el formulario desaparezca
        await this.page.locator('h3:has-text("Crea tu destino lector")').waitFor({ state: 'hidden' });
    }
}
