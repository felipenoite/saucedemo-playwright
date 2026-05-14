import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly summaryTotal: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryTotal = page.locator('.summary_total_label');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.pageTitle = page.locator('.title');
  }

  async expectOnStep1() {
    await expect(this.page).toHaveURL('/checkout-step-one.html');
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async expectOnStep2() {
    await expect(this.page).toHaveURL('/checkout-step-two.html');
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async expectOnComplete() {
    await expect(this.page).toHaveURL('/checkout-complete.html');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async getTotalAmount(): Promise<number> {
    const totalText = await this.summaryTotal.textContent() || '';
    const match = totalText.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getSubtotalAmount(): Promise<number> {
    const subtotalText = await this.summarySubtotal.textContent() || '';
    const match = subtotalText.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTaxAmount(): Promise<number> {
    const taxText = await this.summaryTax.textContent() || '';
    const match = taxText.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async backToHome() {
    await this.backHomeButton.click();
  }
}
