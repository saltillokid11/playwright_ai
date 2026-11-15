import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Shoping Cart', () => {
   test('should display added product, quantity, and total in cart', async ({ page }) => {
       const homePage = new HomePage(page);
       const productDetailPage = new ProductDetailPage(page);
       const cartPage = new CartPage(page);

       await homePage.navigateTo('/');
       await homePage.openProduct('Combination Pliers');

       await productDetailPage.verifyPageLoaded();
       await productDetailPage.setQuantity(2);
       await productDetailPage.addToCart();

       await expect(productDetailPage.cartQuantity).toHaveText('2');

       await productDetailPage.openCart();
       await cartPage.verifyPageLoaded();

       await expect(cartPage.productTitle).toHaveText('Combination Pliers');
       await expect(cartPage.quantityInput).toHaveValue('2');
       await expect(cartPage.linePrice).toHaveText('$28.30');
       await expect(cartPage.cartTotal).toHaveText('$28.30');
   });
});