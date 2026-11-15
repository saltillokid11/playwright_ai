import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  readonly brandLogo: Locator;
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLogo = page.getByRole('heading', { name: 'Practice Software Testing' });
    this.cartLink = page.getByRole('link', { name: 'cart' });
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async navigateTo(url: string): Promise<void> { 
    await this.page.goto(url);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}