import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Product Detail Page', () => {
    let homePage: HomePage;
    let productDetailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productDetailPage = new ProductDetailPage(page);
        await homePage.navigateTo('/');
    });

    test('should open product detail page', async () => {
        await homePage.openProduct('Combination Pliers');
        await productDetailPage.verifyPageLoaded();
        await expect(productDetailPage.productName).toHaveText('Combination Pliers');
    });

    test('should update quantity and add to cart', async () => {
        await homePage.openProduct('Combination Pliers');
        await productDetailPage.verifyPageLoaded();
        await productDetailPage.setQuantity(2);
        await productDetailPage.addToCart();
        await expect(productDetailPage.toastAlert).toBeVisible();
        await expect(productDetailPage.toastAlert).toHaveText(' Product added to shopping cart.');
    });

});



