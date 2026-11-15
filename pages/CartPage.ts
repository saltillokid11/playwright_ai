import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly productTitle: Locator;
    readonly quantityInput: Locator;
    readonly linePrice: Locator;
    readonly cartTotal: Locator;
    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productTitle = page.getByTestId('product-title');
        this.quantityInput = page.getByTestId('product-quantity');
        this.linePrice = page.getByTestId('line-price');
        this.cartTotal = page.getByTestId('cart-total');
        this.proceedToCheckoutButton = page.getByTestId('proceed-to-checkout-button');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/.*checkout/);
        await expect(this.cartTotal).toBeVisible();
    }

    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }
}