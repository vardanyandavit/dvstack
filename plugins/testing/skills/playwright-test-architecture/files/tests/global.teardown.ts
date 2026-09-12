import { test as teardown } from "@playwright/test";
import { endpoints } from "../constants/endpoints";

/**
 * Runs once after every project that declares `teardown: "cleanup"` finishes.
 *
 * Only for state the suite cannot clean up per test — a seeded tenant, a shared
 * fixture account. Anything one test created belongs in that test's afterEach.
 */
teardown("clean up seeded data", async ({ request }) => {
  await request.delete(endpoints.orders, { params: { createdBy: "e2e" } });
});
