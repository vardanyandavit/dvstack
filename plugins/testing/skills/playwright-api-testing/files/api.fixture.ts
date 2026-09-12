import { test as base } from "@playwright/test";
import { ApiClient } from "../helpers/api-client";

/**
 * `request` is Playwright's built-in API context. It already carries `baseURL`
 * and, when the test uses storage state, the signed-in cookies — so an API call
 * runs as the same user as the browser.
 */
export const test = base.extend<{ api: ApiClient }>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});
