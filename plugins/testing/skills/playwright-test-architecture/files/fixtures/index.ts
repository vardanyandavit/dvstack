import { mergeTests } from "@playwright/test";
import { test as pageObjectTest } from "./test.fixture";

/**
 * The single import for every spec: `import { expect, test } from "../fixtures"`.
 *
 * Each concern gets its own `*.fixture.ts` file and is merged in here — for
 * example `mergeTests(pageObjectTest, networkTest)` once the network fixture
 * from the playwright-network-mocking skill is added.
 */
export const test = mergeTests(pageObjectTest);

export { expect } from "@playwright/test";
