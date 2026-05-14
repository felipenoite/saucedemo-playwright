import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Gerenciamento do Carrinho', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Garante que o carrinho está vazio no início
    const nav = authenticatedPage;
    const { NavigationMenu } = await import('../../pages/NavigationMenu');
    const menu = new NavigationMenu(nav);
    await menu.resetAppState();
  });

  test('CT-CART-001: Carrinho vazio exibe sem badge no ícone', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await expect(inventory.cartBadge).not.toBeVisible();
  });

  test('CT-CART-002: Adicionar 1 produto ao carrinho atualiza badge', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('CT-CART-003: Adicionar múltiplos produtos ao carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.addProductToCart('Sauce Labs Bike Light');
    await inventory.addProductToCart('Sauce Labs Bolt T-Shirt');
    await expect(inventory.cartBadge).toHaveText('3');
  });

  test('CT-CART-005: Produto adicionado aparece no carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(authenticatedPage);
    await cart.expectItemInCart('Sauce Labs Backpack');
  });

  test('CT-CART-006: Remover produto do carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(authenticatedPage);
    await cart.removeItem('Sauce Labs Backpack');
    await cart.expectItemNotInCart('Sauce Labs Backpack');
    await cart.expectEmptyCart();
  });

  test('CT-CART-007: Remover item parcialmente mantém outros no carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.addProductToCart('Sauce Labs Bike Light');
    await inventory.goToCart();

    const cart = new CartPage(authenticatedPage);
    await cart.removeItem('Sauce Labs Backpack');
    await cart.expectItemNotInCart('Sauce Labs Backpack');
    await cart.expectItemInCart('Sauce Labs Bike Light');
    expect(await cart.getCartItemCount()).toBe(1);
  });

  test('CT-CART-008: Carrinho persiste ao navegar entre páginas', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');

    await inventory.clickProduct('Sauce Labs Bike Light');
    await authenticatedPage.goBack();

    expect(await inventory.getCartItemCount()).toBe(1);
  });

  test('CT-CART-011: Todos os 6 produtos podem ser adicionados ao carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    const totalProducts = 6;

    // Sempre clica no primeiro botão disponível — após cada clique ele vira "Remove"
    const addButtons = authenticatedPage.locator('[data-test^="add-to-cart"]');
    for (let i = 0; i < totalProducts; i++) {
      await addButtons.first().click();
    }

    expect(await inventory.getCartItemCount()).toBe(6);
  });

  test('CT-CART-012: Após remover todos os itens o badge desaparece', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.addProductToCart('Sauce Labs Bike Light');
    await inventory.goToCart();

    const cart = new CartPage(authenticatedPage);
    await cart.removeItem('Sauce Labs Backpack');
    await cart.removeItem('Sauce Labs Bike Light');

    await expect(inventory.cartBadge).not.toBeVisible();
  });
});
