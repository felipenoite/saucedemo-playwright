import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async expectOnInventoryPage() {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.pageTitle).toHaveText('Products');
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }

  async addProductToCart(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.locator('button').click();
  }

  async removeProductFromInventory(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.locator('button').click();
  }

  async getCartItemCount(): Promise<number> {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || '0');
    }
    return 0;
  }

  async clickProduct(productName: string) {
    await this.page.locator('.inventory_item_name').filter({ hasText: productName }).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  getAddToCartButton(productName: string): Locator {
    return this.page.locator('.inventory_item')
      .filter({ hasText: productName })
      .locator('[data-test^="add-to-cart"]');
  }

  getRemoveButton(productName: string): Locator {
    return this.page.locator('.inventory_item')
      .filter({ hasText: productName })
      .locator('[data-test^="remove"]');
  }
}
