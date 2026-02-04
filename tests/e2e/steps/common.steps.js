import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When } = createBdd(test);

async function completeOnboarding(userName, avatarName, welcomePage, characterCreationPage, profilePage) {
    await welcomePage.navigate();
    await welcomePage.proceedToGuestMode();
    await characterCreationPage.ingresarNombreReceptaculo(userName);
    await characterCreationPage.seleccionarAvatar(avatarName);
    await characterCreationPage.confirmarAventura();
    await profilePage.completarCuestionario({
        genre: 'Viajes al Futuro',
        hobby: 'Aprender del Pasado',
        mood: 'Con el cerebro a mil',
        age: '25'
    });
}

Given('que el usuario ya ha completado su perfil inicial', async ({ welcomePage, characterCreationPage, profilePage }) => {
    await completeOnboarding('BUSCADOR-PRO', 'Mago', welcomePage, characterCreationPage, profilePage);
});

Given('que el usuario {string} ya ha completado su perfil inicial', async ({ welcomePage, characterCreationPage, profilePage }, userName) => {
    // We use a default avatar if not specified, but for MAPA-MASTER we might want Dragon
    const avatar = userName === 'MAPA-MASTER' ? 'Dragón' : 'Mago';
    await completeOnboarding(userName, avatar, welcomePage, characterCreationPage, profilePage);
});

When('navega a la pestaña de {string}', async ({ page }, tabName) => {
    // Helper to handle regex or exact text
    const button = page.getByRole('button', { name: new RegExp(tabName, 'i') });
    await button.click();
});
