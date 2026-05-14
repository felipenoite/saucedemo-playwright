import { test, expect } from '../../fixtures/auth.fixture';
import { NavigationMenu } from '../../pages/NavigationMenu';
import { InventoryPage } from '../../pages/InventoryPage';
import { ROUTES } from '../../utils/constants';

test.describe('Navegação - Menu Lateral', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // já está autenticado
  });

  test('CT-NAV-001: Menu hambúrguer abre o menu lateral', async ({ authenticatedPage }) => {
    const nav = new NavigationMenu(authenticatedPage);
    await nav.openMenu();
    await expect(authenticatedPage.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false');
  });

  test('CT-NAV-002: Menu lateral exibe todas as opções', async ({ authenticatedPage }) => {
    const nav = new NavigationMenu(authenticatedPage);
    await nav.openMenu();
    await expect(nav.allItemsLink).toBeVisible();
    await expect(nav.aboutLink).toBeVisible();
    await expect(nav.logoutLink).toBeVisible();
    await expect(nav.resetAppStateLink).toBeVisible();
  });

  test('CT-NAV-004: Link "All Items" navega para o inventário', async ({ authenticatedPage }) => {
    const nav = new NavigationMenu(authenticatedPage);
    await authenticatedPage.goto(ROUTES.cart);
    await nav.goToAllItems();
    await expect(authenticatedPage).toHaveURL('/inventory.html');
  });

  test('CT-NAV-006: Reset App State limpa o carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    expect(await inventory.getCartItemCount()).toBe(1);

    const nav = new NavigationMenu(authenticatedPage);
    await nav.resetAppState();

    await expect(inventory.cartBadge).not.toBeVisible();
  });
});

test.describe('Navegação - URLs e Redirecionamentos', () => {
  test('CT-NAV-009: Acesso direto à /inventory.html sem login redireciona para login', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
  });

  test('CT-NAV-010: Acesso direto ao carrinho sem login redireciona para login', async ({ page }) => {
    await page.goto('/cart.html');
    await expect(page).toHaveURL('/');
  });

  test('CT-NAV-011: Acesso direto ao checkout sem login redireciona para login', async ({ page }) => {
    await page.goto('/checkout-step-one.html');
    await expect(page).toHaveURL('/');
  });
});
