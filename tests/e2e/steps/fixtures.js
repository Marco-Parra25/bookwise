import { test as base } from 'playwright-bdd';
import { WelcomePage } from '../pages/WelcomePage';
import { CharacterCreationPage } from '../pages/CharacterCreationPage';
import { ProfilePage } from '../pages/ProfilePage';
import { DashboardPage } from '../pages/DashboardPage';
import { BookSearchPage } from '../pages/BookSearchPage';
import { WorldMapPage } from '../pages/WorldMapPage';

export const test = base.extend({
    welcomePage: async ({ page }, use) => {
        await use(new WelcomePage(page));
    },
    characterCreationPage: async ({ page }, use) => {
        await use(new CharacterCreationPage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    bookSearchPage: async ({ page }, use) => {
        await use(new BookSearchPage(page));
    },
    worldMapPage: async ({ page }, use) => {
        await use(new WorldMapPage(page));
    },
});
