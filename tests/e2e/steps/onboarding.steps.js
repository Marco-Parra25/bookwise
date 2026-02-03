import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

Given('que un nuevo usuario entra a la aplicación', async ({ welcomePage }) => {
    await welcomePage.navigate();
});

When('completa el recorrido de bienvenida', async ({ welcomePage }) => {
    await welcomePage.proceedToGuestMode();
});

When('forja un nuevo personaje llamado {string} con el avatar {string}', async ({ characterCreationPage }, name, avatar) => {
    await characterCreationPage.ingresarNombreReceptaculo(name);
    await characterCreationPage.seleccionarAvatar(avatar);
    await characterCreationPage.confirmarAventura();
});

When('define sus gustos literarios como:', async ({ profilePage }, dataTable) => {
    const data = dataTable.rowsHash();
    await profilePage.completarCuestionario({
        genre: data['Género'],
        hobby: data['Hobby'],
        mood: data['Vibra'],
        age: data['Edad']
    });
});

Then('debería ver su Dashboard con el rango {string} y el nombre {string}', async ({ page, dashboardPage }, rank, name) => {
    const actualName = await dashboardPage.getCharacterName();
    expect(actualName).toBe(name.toUpperCase());

    const actualRank = await dashboardPage.getLevelText();
    expect(actualRank).toContain(rank);
    // Pause for video clarity
    await page.waitForTimeout(3000);
});
