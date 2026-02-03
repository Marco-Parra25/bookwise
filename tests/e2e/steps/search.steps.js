import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

Given('que el usuario ya ha completado su perfil inicial', async ({ welcomePage, characterCreationPage, profilePage }) => {
    await welcomePage.navigate();
    await welcomePage.proceedToGuestMode();
    await characterCreationPage.ingresarNombreReceptaculo('BUSCADOR-PRO');
    await characterCreationPage.seleccionarAvatar('Mago');
    await characterCreationPage.confirmarAventura();
    await profilePage.completarCuestionario({
        genre: 'Viajes al Futuro',
        hobby: 'Aprender del Pasado',
        mood: 'Con el cerebro a mil',
        age: '25'
    });
});

When('navega a la pestaña de {string}', async ({ page }, tabName) => {
    await page.getByRole('button', { name: tabName }).click();
});

When('busca el tomo {string}', async ({ bookSearchPage }, query) => {
    await bookSearchPage.search(query);
});

Then('debería ver {string} en los resultados', async ({ bookSearchPage }, expectedTitle) => {
    const title = await bookSearchPage.getFirstBookTitle();
    expect(title).toContain(expectedTitle);
});

When('consume el saber del libro {string}', async ({ bookSearchPage }, title) => {
    await bookSearchPage.consumeBook(title);
});

Then('su contador de {string} debería aumentar a {int}', async ({ page }, label, expectedCount) => {
    // Look for the element that has the text "Libros Leídos" and find its sibling/parent value
    const counter = page.locator('.glass', { hasText: label }).locator('.text-4xl');
    await expect(counter).toHaveText(expectedCount.toString());
    // Pausa larga para ver el contador final
    await page.waitForTimeout(6000);
});
