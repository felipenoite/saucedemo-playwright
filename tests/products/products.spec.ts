import { test, expect } from '../../fixtures/auth.fixture';
import { SORT_OPTIONS } from '../../utils/constants';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Produtos - Ordenação e Filtragem', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // authenticatedPage já está autenticado e na inventory page
  });

  test('CT-PROD-002: Ordenação A-Z (padrão)', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.sortBy(SORT_OPTIONS.nameAZ);
    const names = await inventory.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('CT-PROD-003: Ordenação Z-A', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.sortBy(SORT_OPTIONS.nameZA);
    const names = await inventory.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('CT-PROD-004: Ordenação por preço crescente (menor para maior)', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.sortBy(SORT_OPTIONS.priceLowHigh);
    const prices = await inventory.getProductPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('CT-PROD-005: Ordenação por preço decrescente (maior para menor)', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.sortBy(SORT_OPTIONS.priceHighLow);
    const prices = await inventory.getProductPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('CT-PROD-007: Cada produto tem nome, descrição, preço e imagem', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    const items = inventory.inventoryItems;
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      await expect(item.locator('.inventory_item_name')).not.toBeEmpty();
      await expect(item.locator('.inventory_item_desc')).not.toBeEmpty();
      await expect(item.locator('.inventory_item_price')).not.toBeEmpty();
      await expect(item.locator('img.inventory_item_img')).toBeVisible();
    }
  });

  test('CT-PROD-009: Navegação para detalhes do produto ao clicar no nome', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    const firstName = (await inventory.getProductNames())[0];
    await inventory.clickProduct(firstName);
    await expect(authenticatedPage).toHaveURL(/inventory-item\.html/);
  });

  test('CT-PROD-011: Adicionar produto ao carrinho a partir da listagem', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    const initialCount = await inventory.getCartItemCount();
    await inventory.addProductToCart('Sauce Labs Backpack');
    const newCount = await inventory.getCartItemCount();
    expect(newCount).toBe(initialCount + 1);
  });

  test('CT-PROD-013: Remover produto direto da listagem', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProductToCart('Sauce Labs Backpack');
    expect(await inventory.getCartItemCount()).toBe(1);

    await inventory.removeProductFromInventory('Sauce Labs Backpack');
    expect(await inventory.getCartItemCount()).toBe(0);
    await expect(inventory.cartBadge).not.toBeVisible();
  });
});

test.describe('Produtos - Página de Detalhe', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.clickProduct('Sauce Labs Backpack');
  });

  test('CT-PROD-014: Página de detalhe exibe informações corretas', async ({ authenticatedPage }) => {
    const { ProductDetailPage } = await import('../../pages/ProductDetailPage');
    const detail = new ProductDetailPage(authenticatedPage);
    await expect(detail.productName).toContainText('Sauce Labs Backpack');
    await expect(detail.productDescription).not.toBeEmpty();
    await expect(detail.productPrice).toContainText('$');
    await expect(authenticatedPage.locator('img.inventory_details_img')).toBeVisible();
  });

  test('CT-PROD-015: Adicionar produto ao carrinho na página de detalhe', async ({ authenticatedPage }) => {
    const { ProductDetailPage } = await import('../../pages/ProductDetailPage');
    const detail = new ProductDetailPage(authenticatedPage);
    await detail.addToCart();
    await expect(detail.cartBadge).toBeVisible();
    await expect(detail.cartBadge).toHaveText('1');
  });
});
