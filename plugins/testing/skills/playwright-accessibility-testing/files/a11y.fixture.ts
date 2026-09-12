import AxeBuilder from "@axe-core/playwright";
import { expect, test as base, type Page, type TestInfo } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

class A11yScanner {
  constructor(
    private readonly page: Page,
    private readonly testInfo: TestInfo,
  ) {}

  /**
   * Scans the page and attaches the full result to the report, so a failure can
   * be read without re-running. `exclude` is for known issues that already have
   * a ticket — with the ticket in the comment, never a silent skip.
   */
  async expectNoViolations(exclude: string[] = []): Promise<void> {
    let builder = new AxeBuilder({ page: this.page }).withTags(WCAG_TAGS);
    for (const selector of exclude) {
      builder = builder.exclude(selector);
    }

    const results = await builder.analyze();
    await this.testInfo.attach("axe-results", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    // Compare on a readable summary: `toEqual([])` on raw violations prints
    // hundreds of lines of axe internals and hides which rule actually failed.
    const summary = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
      help: violation.help,
    }));
    expect(summary).toEqual([]);
  }
}

export const test = base.extend<{ a11y: A11yScanner }>({
  a11y: async ({ page }, use, testInfo) => {
    await use(new A11yScanner(page, testInfo));
  },
});
