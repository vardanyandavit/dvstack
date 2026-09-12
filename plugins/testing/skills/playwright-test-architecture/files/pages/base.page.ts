import { expect, type Locator, type Page } from "@playwright/test";
import { CommonSelectors } from "../constants/selectors";

/**
 * Every page object extends this.
 *
 * `getRoot()` returns the one element that proves the page is loaded — a
 * heading, a main landmark, a form. It is what `goto()` waits for, so no test
 * ever starts against a half-rendered screen.
 */
export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    private readonly path: string,
  ) {}

  abstract getRoot(): Locator;

  /** Shared chrome: defined once here, reachable from every page object and spec. */
  getToast(): Locator {
    return this.page.getByTestId(CommonSelectors.Toast);
  }

  getLoadingSpinner(): Locator {
    return this.page.getByTestId(CommonSelectors.LoadingSpinner);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.getRoot()).toBeVisible();
  }
}
