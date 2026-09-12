import { test as base, expect } from "@playwright/test";
import { uniqueEmail } from "../helpers/unique";

/**
 * Three fixture kinds in one file:
 *
 * - `slowMotion` is an **option** fixture: its value comes from `use: {}` in
 *   playwright.config.ts, so each project can run with a different setting.
 * - `workerAccount` is **worker-scoped**: created once per worker process and
 *   shared by every test that worker runs. Use it for setup too expensive to
 *   repeat and safe to share read-only.
 * - `failOnConsoleError` is an **auto** fixture: it applies to every test in the
 *   suite without being named in the test's arguments.
 */
export const test = base.extend<
  { seededOrderId: string; failOnConsoleError: void },
  { slowMotion: number; workerAccount: { email: string; id: string } }
>({
  slowMotion: [0, { option: true, scope: "worker" }],

  workerAccount: [
    async ({}, use, workerInfo) => {
      const email = uniqueEmail(`worker-${workerInfo.workerIndex}`);
      const id = `acct-${workerInfo.workerIndex}`;
      // Everything before `use()` is setup...
      await use({ email, id });
      // ...and everything after is teardown, run even when the test fails.
    },
    { scope: "worker" },
  ],

  seededOrderId: async ({ request }, use) => {
    const response = await request.post("/api/orders", { data: { createdBy: "e2e" } });
    expect(response).toBeOK();
    const { id } = (await response.json()) as { id: string };

    await use(id);

    await request.delete(`/api/orders/${id}`);
  },

  failOnConsoleError: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push(message.text());
        }
      });

      await use();

      expect(errors, "the page logged console errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
