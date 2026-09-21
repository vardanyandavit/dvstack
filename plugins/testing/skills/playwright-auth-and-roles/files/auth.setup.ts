import { expect, test as setup, type Page } from "@playwright/test";
import { storageStateFor } from "../constants/auth";
import { users, type TestUser } from "../data/users";
import { LoginPage } from "../pages/login.page";

/**
 * One setup test per role. Each writes its own storage state file, and the
 * browser projects declare `dependencies: ["setup"]`, so every spec starts
 * signed in as whichever role it asked for with `test.use({ storageState })`.
 *
 * Sign-in itself keeps its own spec, which opts out with an empty state.
 */
async function signInAs(page: Page, user: TestUser, storageState: string): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.signIn(user.email, user.password);

  // Prove the session exists before saving it. Writing an unauthenticated
  // state file is the failure that makes every later spec fail confusingly.
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.context().storageState({ path: storageState });
}

setup("authenticate as member", async ({ page }) => {
  await signInAs(page, users.standard, storageStateFor("member"));
});

setup("authenticate as admin", async ({ page }) => {
  await signInAs(page, users.admin, storageStateFor("admin"));
});
