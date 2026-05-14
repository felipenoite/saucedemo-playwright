import { Page, Locator, expect } from '@playwright/test';

export class NavigationMenu {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly menuContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.menuContainer = page.locator('.bm-menu-wrap');
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.menuContainer).toHaveAttribute('aria-hidden', 'false');
  }

  async closeMenu() {
    await this.closeMenuButton.click();
    await expect(this.menuContainer).toHaveAttribute('aria-hidden', 'true');
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('/');
  }

  async goToAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async goToAbout() {
    await this.openMenu();
    await this.aboutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
  }
}
