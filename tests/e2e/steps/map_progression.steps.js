import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd(test);

Given('que el usuario "MAPA-MASTER" ya ha completado su perfil inicial', async ({ welcomePage, characterCreationPage, profilePage }) => {
    await welcomePage.navigate();
    await welcomePage.proceedToGuestMode();
    await characterCreationPage.ingresarNombreReceptaculo('MAPA-MASTER');
    await characterCreationPage.seleccionarAvatar('Dragón');
    await characterCreationPage.confirmarAventura();
    await profilePage.completarCuestionario({
        genre: 'Viajes al Futuro',
        hobby: 'Aprender del Pasado',
        mood: 'Con el cerebro a mil',
        age: '25'
    });
});

Given('se encuentra en el {string} viendo el mapa', async ({ page }, tabName) => {
    // Cambiamos el tema para que el video sea visualmente distinto
    await page.getByRole('button', { name: /Cambiar tema/i }).click();
    await page.getByRole('button', { name: tabName }).click();
});

Then('el avatar debería estar en el nodo {string}', async ({ page, worldMapPage }, expectedLevel) => {
    const currentLevel = await worldMapPage.getAvatarNodeLevel();
    expect(currentLevel).toBe(parseInt(expectedLevel));
    // Pausa MUY larga para que el usuario vea el resultado final sin que el video se corte
    await page.waitForTimeout(6000);
});

Then('el nodo {string} debería estar marcado como {string}', async ({ page, worldMapPage }, level, status) => {
    const isCompleted = await worldMapPage.isNodeCompleted(parseInt(level));
    expect(isCompleted).toBe(true);
});
