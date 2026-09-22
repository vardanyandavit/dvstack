import { mergeTests } from "@playwright/test";
import { test as pageObjectTest } from "./test.fixture";

/**
 * The single import for every spec: `import { expect, test } from "../fixtures"`.
 *
 * Each concern gets its own `*.fixture.ts` file and is merged in here — for
 * example `mergeTests(pageObjectTest, networkTest)` once a network fixture
 * is added.
 */
export const test = mergeTests(pageObjectTest);

export { expect } from "@playwright/test";
