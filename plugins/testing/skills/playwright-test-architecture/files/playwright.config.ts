import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const IS_CI = Boolean(process.env.CI);
const STORAGE_STATE = ".auth/user.json";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",

  // Every file runs in parallel. Tests that cannot tolerate this are the bug,
  // not this setting — see `test.describe.configure({ mode: "serial" })` below.
  fullyParallel: true,
  workers: IS_CI ? "50%" : undefined,

  // A `test.only` that reaches CI silently skips the rest of the suite.
  forbidOnly: IS_CI,

  // Retries locally would hide flakiness while it is still cheap to fix.
  retries: IS_CI ? 2 : 0,

  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: IS_CI
    ? [["list"], ["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,
    testIdAttribute: "data-testid",
    actionTimeout: 10_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Signs in once, writes storage state, and names the project that cleans up
    // after the whole run. Project dependencies are Playwright's recommended
    // alternative to globalSetup/globalTeardown: they appear in the report,
    // record traces, and can use fixtures.
    { name: "setup", testMatch: /.*\.setup\.ts/, teardown: "cleanup" },
    { name: "cleanup", testMatch: /global\.teardown\.ts/ },
    {
      name: "chromium",
      dependencies: ["setup"],
      // Without this the browser project would also pick up the setup and
      // teardown files as ordinary tests.
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
    },
    // Add firefox / webkit / "Pixel 7" the day a bug justifies the runtime.
  ],

  webServer: {
    command: "npm run start",
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
    timeout: 120_000,
  },
});
