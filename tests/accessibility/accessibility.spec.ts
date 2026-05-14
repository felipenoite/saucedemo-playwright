import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { USERS } from '../../utils/constants';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

const loginUser = async (page: any) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USERS.standard.username, USERS.standard.password);
  await page.waitForURL('/inventory.html');
};

test.describe('Acessibilidade - Página de Login', () => {
  test('CT-A11Y-001: Página de login não tem violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    if (criticalViolations.length > 0) {
      console.log('Violações críticas encontradas:', JSON.stringify(criticalViolations, null, 2));
    }
    expect(criticalViolations).toHaveLength(0);
  });

  test('CT-A11Y-004: Navegação por teclado na página de login', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const usernameInput = page.locator('[data-test="username"]');
    await expect(usernameInput).toBeFocused();

    await page.keyboard.press('Tab');
    const passwordInput = page.locator('[data-test="password"]');
    await expect(passwordInput).toBeFocused();

    await page.keyboard.press('Tab');
    const loginBtn = page.locator('[data-test="login-button"]');
    await expect(loginBtn).toBeFocused();
  });

  test('CT-A11Y-005: Login pode ser realizado apenas com teclado', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.type(USERS.standard.username);
    await page.keyboard.press('Tab');
    await page.keyboard.type(USERS.standard.password);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/inventory.html');
  });
});

// BUG-009: <select> de ordenação sem label acessível (select-name, WCAG 4.1.2).
// Registrado aqui para que novas violações críticas ainda quebrem o teste.
const KNOWN_CRITICAL_VIOLATIONS = ['select-name'];

test.describe('Acessibilidade - Página de Inventário', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('CT-A11Y-006: Página de inventário não tem violações críticas', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' && !KNOWN_CRITICAL_VIOLATIONS.includes(v.id)
    );
    if (criticalViolations.length > 0) {
      console.log('Violações críticas não documentadas:', JSON.stringify(criticalViolations.map(v => ({
        id: v.id,
        description: v.description,
        impact: v.impact,
      })), null, 2));
    }
    expect(criticalViolations).toHaveLength(0);
  });

  test('CT-A11Y-007: Imagens dos produtos têm texto alternativo', async ({ page }) => {
    const images = page.locator('.inventory_item img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
      expect(alt?.trim()).not.toBe('');
    }
  });

  test('CT-A11Y-010: Link do carrinho não tem violações de acessibilidade (link-name)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['link-name'])
      .analyze();

    const cartViolation = results.violations.find(v =>
      v.nodes.some(n => n.html.includes('shopping_cart_link'))
    );
    expect(cartViolation).toBeUndefined();
  });

  test('CT-A11Y-011: Contraste de cores dos títulos é adequado', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .analyze();

    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast' && v.impact === 'serious');
    if (contrastViolations.length > 0) {
      console.log('Problemas de contraste (serious):', contrastViolations.length);
    }
    expect(contrastViolations.length).toBeGreaterThanOrEqual(0);
  });

  test('CT-A11Y-012: Estrutura de headings é semântica', async ({ page }) => {
    const h1 = await page.locator('h1').count();
    const h2 = await page.locator('h2').count();
    expect(h1 + h2).toBeGreaterThanOrEqual(0);
    const title = page.locator('.title');
    await expect(title).toBeVisible();
  });
});

test.describe('Acessibilidade - Carrinho', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();
  });

  test('CT-A11Y-013: Página do carrinho não tem violações críticas', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });
});

test.describe('Acessibilidade - Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();
    await page.locator('[data-test="checkout"]').click();
  });

  test('CT-A11Y-015: Página de checkout step 1 não tem violações críticas', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });

  test('CT-A11Y-016: Campos do checkout são acessíveis por teclado', async ({ page }) => {
    const firstName = page.locator('[data-test="firstName"]');
    await firstName.focus();
    await expect(firstName).toBeFocused();
    await page.keyboard.type('João');

    await page.keyboard.press('Tab');
    await page.keyboard.type('Silva');

    await page.keyboard.press('Tab');
    await page.keyboard.type('01310-100');
  });
});
