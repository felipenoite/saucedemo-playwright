import { test, expect } from '@playwright/test';
import { VIEWPORTS, USERS } from '../../utils/constants';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

const loginUser = async (page: any) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USERS.standard.username, USERS.standard.password);
  await page.waitForURL('/inventory.html');
};

test.describe('Responsividade - Mobile', () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test('CT-RESP-001: Login funciona em viewport mobile (375x667)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
    await login.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('CT-RESP-002: Página de inventário é usável em mobile', async ({ page }) => {
    await loginUser(page);
    const inventory = new InventoryPage(page);
    const items = inventory.inventoryItems;
    const count = await items.count();
    expect(count).toBe(6);

    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toBeVisible();
    }
  });

  test('CT-RESP-003: Menu hambúrguer abre corretamente em mobile', async ({ page }) => {
    await loginUser(page);
    const menuBtn = page.locator('#react-burger-menu-btn');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false');
  });

  test('CT-RESP-004: Adicionar produto ao carrinho funciona em mobile', async ({ page }) => {
    await loginUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('CT-RESP-005: Fluxo de checkout funciona em mobile', async ({ page }) => {
    await loginUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const { CartPage } = await import('../../pages/CartPage');
    const { CheckoutPage } = await import('../../pages/CheckoutPage');

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(page);
    await checkout.fillShippingInfo('João', 'Silva', '01310-100');
    await checkout.continue();
    await checkout.expectOnStep2();
    await checkout.finish();
    await checkout.expectOnComplete();
  });

  test('CT-RESP-007: Botões são clicáveis com touch em mobile', async ({ page }) => {
    await loginUser(page);
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(addBtn).toBeVisible();
    const box = await addBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThan(40);
      expect(box.height).toBeGreaterThan(30);
    }
  });
});

test.describe('Responsividade - Tablet', () => {
  test.use({ viewport: VIEWPORTS.tablet });

  test('CT-RESP-008: Login funciona em viewport tablet (768x1024)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('CT-RESP-010: Checkout é funcional em tablet', async ({ page }) => {
    await loginUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const { CartPage } = await import('../../pages/CartPage');
    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const { CheckoutPage } = await import('../../pages/CheckoutPage');
    const checkout = new CheckoutPage(page);
    await checkout.fillShippingInfo('João', 'Silva', '01310-100');
    await checkout.continue();
    await checkout.finish();
    await checkout.expectOnComplete();
  });
});
