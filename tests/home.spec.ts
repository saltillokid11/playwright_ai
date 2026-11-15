import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page - Product Catalog', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateTo('/');
  });

  test('should load the home page with brand logo and catalog', async () => {
    await expect(homePage.brandLogo).toBeVisible();
    await expect(homePage.productCards.first()).toBeVisible();
    await homePage.search('Hammer');
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.productTitles.first()).toBeVisible();
  });

  test('should filter products when searching by keyword', async () => {
    await homePage.search('Hammer');
    await expect(homePage.productTitles.first()).toContainText("Hammer");
  });
});
