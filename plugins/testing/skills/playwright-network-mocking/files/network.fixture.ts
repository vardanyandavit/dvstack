import { test as base, type Page, type Route } from "@playwright/test";

type NetworkFixtures = {
  /** Fail every third-party request so the suite never depends on someone else's uptime. */
  blockThirdParty: void;
  mockApi: MockApi;
};

export class MockApi {
  constructor(private readonly page: Page) {}

  /** Replace a JSON endpoint with a fixed body. Pattern is a glob or RegExp. */
  async json(pattern: string | RegExp, body: unknown, status = 200): Promise<void> {
    await this.page.route(pattern, (route) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }),
    );
  }

  /** Make an endpoint fail, to test the error path that is otherwise unreachable. */
  async fail(pattern: string | RegExp, status = 500): Promise<void> {
    await this.page.route(pattern, (route) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ error: "mocked failure" }) }),
    );
  }

  /** Let the request through, then rewrite one field of the real response. */
  async patch<T>(pattern: string | RegExp, edit: (body: T) => unknown): Promise<void> {
    await this.page.route(pattern, async (route: Route) => {
      const response = await route.fetch();
      const body = (await response.json()) as T;
      await route.fulfill({ response, json: edit(body) });
    });
  }

  /** Hold a request open until `release()` is called — for loading and race states. */
  async defer(pattern: string | RegExp): Promise<() => void> {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await this.page.route(pattern, async (route) => {
      await gate;
      await route.continue();
    });
    return release;
  }
}

/** Merge into `fixtures/index.ts` with `mergeTests(pageObjectTest, networkTest)`. */
export const test = base.extend<NetworkFixtures>({
  blockThirdParty: [
    async ({ page }, use) => {
      await page.route(/analytics|googletagmanager|sentry|intercom|hotjar/, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],

  mockApi: async ({ page }, use) => {
    await use(new MockApi(page));
  },
});
