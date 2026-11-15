import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class ProductDetailPage extends BasePage {
    readonly productName: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly toastAlert: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.getByRole('heading', { level: 1 });
        this.quantityInput = page.getByTestId('quantity');
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
        this.toastAlert = page.getByRole('alert');
    }

    async setQuantity(qty: number): Promise<void> {
        await this.quantityInput.fill(qty.toString());
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/.*product/);
    }
}