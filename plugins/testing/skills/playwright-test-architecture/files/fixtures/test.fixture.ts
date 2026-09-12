import { test as base } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";

/**
 * Page objects arrive as fixtures, so a test declares what it needs in its
 * arguments and never calls `new`. Adding a page object here is the only step
 * needed to make it available in every spec.
 */
export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});
