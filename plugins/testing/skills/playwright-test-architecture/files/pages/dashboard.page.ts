import { type Locator, type Page } from "@playwright/test";
import { routes } from "../constants/routes";
import { HeaderSelectors } from "../constants/selectors";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.dashboard);
  }

  getRoot(): Locator {
    return this.page.getByRole("heading", { name: "Dashboard" });
  }

  /** Shared with every other signed-in page, so the selector comes from constants. */
  getUserMenu(): Locator {
    return this.page.getByTestId(HeaderSelectors.UserMenu);
  }

  async openUserMenu(): Promise<void> {
    await this.getUserMenu().click();
  }

  /** Used once, so the locator stays inline. */
  async signOut(): Promise<void> {
    await this.openUserMenu();
    await this.page.getByTestId(HeaderSelectors.SignOut).click();
  }
}
