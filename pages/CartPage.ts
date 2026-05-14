import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async expectOnCartPage() {
    await expect(this.page).toHaveURL('/cart.html');
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItem(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await item.locator('[data-test^="remove"]').click();
  }

  async expectItemInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(item).toBeVisible();
  }

  async expectItemNotInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(item).not.toBeVisible();
  }

  async expectEmptyCart() {
    await expect(this.cartItems).toHaveCount(0);
    await expect(this.cartBadge).not.toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemQuantities(): Promise<string[]> {
    return await this.page.locator('.cart_quantity').allTextContents();
  }
}
