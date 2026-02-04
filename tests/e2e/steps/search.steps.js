import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

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
