import { expect, test as setup } from "@playwright/test";
import { users } from "../data/users";
import { LoginPage } from "../pages/login.page";

const STORAGE_STATE = ".auth/user.json";

/**
 * Runs once before the browser projects (see `dependencies` in the config) and
 * saves cookies + localStorage. Tests then start signed in, without paying for
 * the login flow every time. Sign-in itself is still covered by auth.spec.ts.
 */
setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { email, password } = users.standard;

  await loginPage.goto();
  await loginPage.signIn(email, password);

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE });
});
