import { routes } from "../constants/routes";
import { users } from "../data/users";
import { expect, test } from "../fixtures";

// This file exercises signing in, so it must start signed out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Sign in", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("signs in with valid credentials", async ({ page, loginPage, dashboardPage }) => {
    await test.step("the sign-in form is ready", async () => {
      await expect(loginPage.getRoot()).toBeVisible();
      await expect(loginPage.getErrorMessage()).toBeHidden();
    });

    await test.step("submit valid credentials", async () => {
      await loginPage.signIn(users.standard.email, users.standard.password);
      await expect(loginPage.getRoot()).toBeHidden();
    });

    await test.step("land on the dashboard", async () => {
      await expect(dashboardPage.getRoot()).toBeVisible();
      await expect(page).toHaveURL(routes.dashboard);
    });
  });

  test("rejects a wrong password", async ({ page, loginPage }) => {
    await test.step("submit a wrong password", async () => {
      await loginPage.signIn(users.standard.email, "wrong-password");
      await expect(loginPage.getSubmitButton()).toBeEnabled();
    });

    await test.step("the error explains the failure and the user stays put", async () => {
      await loginPage.expectRejected(/incorrect email or password/i);
      await expect(page).toHaveURL(routes.login);
    });
  });
});
