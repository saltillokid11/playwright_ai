import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder('Search');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.productCards = page.locator('.card');
    this.productTitles = page.locator('.card-title');
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productCards.filter({ hasText: productName }).first().click();
  }
}
