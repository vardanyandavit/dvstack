import { expect, type Locator, type Page } from "@playwright/test";
import { routes } from "../constants/routes";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, routes.login);
  }

  // --- Locator getters -------------------------------------------------------
  // Only for elements used more than once: inside this class, or asserted on
  // from a spec. Single-use elements stay inline in the method that needs them.

  getRoot(): Locator {
    return this.page.getByRole("heading", { name: "Sign in" });
  }

  getSubmitButton(): Locator {
    return this.page.getByRole("button", { name: "Sign in" });
  }

  getErrorMessage(): Locator {
    return this.page.getByRole("alert");
  }

  // --- Actions ---------------------------------------------------------------
  // One user intent per method. No assertions on the outcome — that is the
  // test's job. The email and password fields are used once each, so their
  // locators live here rather than in a getter.

  async signIn(email: string, password: string): Promise<void> {
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password").fill(password);
    await this.getSubmitButton().click();
  }

  // --- Assertion helpers -----------------------------------------------------
  // Compound checks that belong to the screen rather than to one test.

  async expectRejected(message: string | RegExp): Promise<void> {
    await expect(this.getErrorMessage()).toBeVisible();
    await expect(this.getErrorMessage()).toHaveText(message);
    await expect(this.getRoot()).toBeVisible();
  }
}
