import { test as base, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import { users } from "../data/users";
import { LoginPage } from "../pages/login.page";
import { type Role } from "../constants/auth";

/**
 * Per-worker authentication, for suites whose tests MUTATE the signed-in
 * account (change settings, rename the profile, consume a quota).
 *
 * A single shared storage state is correct and cheaper when tests only read.
 * Use this only when they write: each worker signs in as its own account, so
 * two tests can never fight over one user's server-side state.
 */
type WorkerFixtures = {
  workerRole: Role;
  workerStorageState: string;
};

export const test = base.extend<object, WorkerFixtures>({
  // Set per project: `use: { workerRole: "admin" }`.
  workerRole: ["member", { option: true, scope: "worker" }],

  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser, workerRole }, use) => {
      const id = test.info().parallelIndex;
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${workerRole}-${id}.json`);

      if (fs.existsSync(fileName)) {
        await use(fileName);
        return;
      }

      const context = await browser.newContext({ storageState: undefined });
      const page: Page = await context.newPage();
      const account = workerRole === "admin" ? users.admin : users.standard;

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.signIn(account.email, account.password);
      await page.waitForURL(/\/dashboard/);

      await context.storageState({ path: fileName });
      await context.close();

      await use(fileName);
    },
    { scope: "worker" },
  ],
});

export { expect } from "@playwright/test";
