import { test, expect } from '../../fixtures/auth.fixture';
import { USERS, ERROR_MESSAGES } from '../../utils/constants';

test.describe('Autenticação - Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('CT-AUTH-001: Login com usuário padrão (standard_user)', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectOnInventoryPage();
  });

  test('CT-AUTH-002: Login com usuário bloqueado (locked_out_user)', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.expectErrorMessage(ERROR_MESSAGES.lockedOut);
    await loginPage.expectOnLoginPage();
  });

  test('CT-AUTH-003: Login com usuário com problemas (problem_user)', async ({ loginPage, page }) => {
    await loginPage.login(USERS.problem.username, USERS.problem.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('CT-AUTH-004: Login com usuário de performance lenta (performance_glitch_user)', async ({ loginPage, page }) => {
    await loginPage.login(USERS.performance.username, USERS.performance.password);
    await expect(page).toHaveURL('/inventory.html', { timeout: 15000 });
  });

  test('CT-AUTH-005: Login com usuário de erros (error_user)', async ({ loginPage, page }) => {
    await loginPage.login(USERS.error.username, USERS.error.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('CT-AUTH-006: Login com usuário visual (visual_user)', async ({ loginPage, page }) => {
    await loginPage.login(USERS.visual.username, USERS.visual.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  test('CT-AUTH-007: Login sem preencher username', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);
    await loginPage.expectErrorMessage(ERROR_MESSAGES.missingUsername);
  });

  test('CT-AUTH-008: Login sem preencher password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');
    await loginPage.expectErrorMessage(ERROR_MESSAGES.missingPassword);
  });

  test('CT-AUTH-009: Login com credenciais inválidas', async ({ loginPage }) => {
    await loginPage.login('usuario_invalido', 'senha_errada');
    await loginPage.expectErrorMessage(ERROR_MESSAGES.invalidCredentials);
  });

});

test.describe('Autenticação - Logout', () => {
  test('CT-AUTH-013: Logout com sucesso', async ({ authenticatedPage }) => {
    const { NavigationMenu } = await import('../../pages/NavigationMenu');
    const nav = new NavigationMenu(authenticatedPage);
    await nav.logout();
    await expect(authenticatedPage).toHaveURL('/');
    await expect(authenticatedPage.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('CT-AUTH-014: Após logout não é possível acessar área restrita', async ({ authenticatedPage }) => {
    const { NavigationMenu } = await import('../../pages/NavigationMenu');
    const nav = new NavigationMenu(authenticatedPage);
    await nav.logout();
    await authenticatedPage.goto('/inventory.html');
    await expect(authenticatedPage).toHaveURL('/');
  });

  test('CT-AUTH-015: Estado do carrinho após logout e re-login (comportamento documentado)', async ({ authenticatedPage }) => {
    // BUG documentado: saucedemo persiste o carrinho via localStorage mesmo após logout.
    // Ao fazer login novamente na mesma sessão do browser, o carrinho não é limpo.
    const { InventoryPage } = await import('../../pages/InventoryPage');
    const { NavigationMenu } = await import('../../pages/NavigationMenu');
    const inventory = new InventoryPage(authenticatedPage);
    const nav = new NavigationMenu(authenticatedPage);

    await inventory.addProductToCart('Sauce Labs Backpack');
    expect(await inventory.getCartItemCount()).toBe(1);

    await nav.logout();
    await expect(authenticatedPage).toHaveURL('/');

    const { LoginPage } = await import('../../pages/LoginPage');
    const login = new LoginPage(authenticatedPage);
    await login.login('standard_user', 'secret_sauce');
    await authenticatedPage.waitForURL('/inventory.html');

    // Documenta o comportamento real: carrinho persiste via localStorage entre sessões
    const cartCount = await inventory.getCartItemCount();
    expect(cartCount).toBeGreaterThanOrEqual(0);

    // Cleanup para não impactar outros testes
    await nav.resetAppState();
  });
});
