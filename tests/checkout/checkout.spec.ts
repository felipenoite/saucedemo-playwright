import { test, expect } from '../../fixtures/auth.fixture';
import { CHECKOUT_INFO, ERROR_MESSAGES } from '../../utils/constants';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Fluxo Completo de Compra', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.addProductToCart('Sauce Labs Bike Light');
    await inventory.goToCart();
  });

  test('CT-CHK-001: Fluxo completo de compra com 1 produto', async ({ authenticatedPage }) => {
    const { InventoryPage: Inv } = await import('../../pages/InventoryPage');
    const { LoginPage } = await import('../../pages/LoginPage');

    await authenticatedPage.goto('/');
    await authenticatedPage.goto('/inventory.html');
    const inv = new Inv(authenticatedPage);
    await inv.addProductToCart('Sauce Labs Onesie');
    await inv.goToCart();

    const cart = new CartPage(authenticatedPage);
    await cart.expectOnCartPage();
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.expectOnStep1();
    await checkout.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkout.continue();

    await checkout.expectOnStep2();
    await expect(checkout.summarySubtotal).toContainText('$');
    await expect(checkout.summaryTax).toContainText('$');
    await expect(checkout.summaryTotal).toContainText('$');

    await checkout.finish();
    await checkout.expectOnComplete();

    await expect(checkout.completeText).toContainText('Your order has been dispatched');
    await checkout.backToHome();
    await expect(authenticatedPage).toHaveURL('/inventory.html');
  });

  test('CT-CHK-002: Fluxo completo com múltiplos produtos', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.expectOnCartPage();
    expect(await cart.getCartItemCount()).toBe(2);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkout.continue();
    await checkout.expectOnStep2();

    const subtotal = await checkout.getSubtotalAmount();
    const tax = await checkout.getTaxAmount();
    const total = await checkout.getTotalAmount();
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);

    await checkout.finish();
    await checkout.expectOnComplete();
  });

  test('CT-CHK-003: Erro ao tentar continuar sem First Name', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillShippingInfo('', CHECKOUT_INFO.lastName, CHECKOUT_INFO.postalCode);
    await checkout.continue();
    await checkout.expectErrorMessage(ERROR_MESSAGES.firstNameRequired);
    await checkout.expectOnStep1();
  });

  test('CT-CHK-004: Erro ao tentar continuar sem Last Name', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillShippingInfo(CHECKOUT_INFO.firstName, '', CHECKOUT_INFO.postalCode);
    await checkout.continue();
    await checkout.expectErrorMessage(ERROR_MESSAGES.lastNameRequired);
  });

  test('CT-CHK-005: Erro ao tentar continuar sem Postal Code', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillShippingInfo(CHECKOUT_INFO.firstName, CHECKOUT_INFO.lastName, '');
    await checkout.continue();
    await checkout.expectErrorMessage(ERROR_MESSAGES.postalCodeRequired);
  });

  test('CT-CHK-006: Cancelar no step 1 retorna ao carrinho', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.cancel();
    await cart.expectOnCartPage();
  });

  test('CT-CHK-009: Verificar cálculo correto do total (subtotal + tax)', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkout.continue();

    const subtotal = await checkout.getSubtotalAmount();
    const tax = await checkout.getTaxAmount();
    const total = await checkout.getTotalAmount();

    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);
  });

  test('CT-CHK-010: Após finalizar compra carrinho fica vazio', async ({ authenticatedPage }) => {
    const cart = new CartPage(authenticatedPage);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillShippingInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkout.continue();
    await checkout.finish();
    await checkout.backToHome();

    const inventory = new InventoryPage(authenticatedPage);
    expect(await inventory.getCartItemCount()).toBe(0);
    await expect(inventory.cartBadge).not.toBeVisible();
  });
});
