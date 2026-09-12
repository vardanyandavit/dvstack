/**
 * Selectors shared by more than one page object or spec. A selector used by a
 * single page belongs in that page object, not here.
 *
 * Values are `data-testid` attributes or accessible names — what the page object
 * passes to `getByTestId` / `getByRole` — so the role-first locator rule still
 * holds. A raw CSS string is allowed only where the markup leaves no choice, and
 * carries a comment saying why.
 */

/** Chrome present on every page. */
export const HeaderSelectors = {
  UserMenu: "header-user-menu",
  SignOut: "header-sign-out",
  Search: "header-search",
} as const;

/** Widgets any feature can raise. */
export const CommonSelectors = {
  Toast: "app-toast",
  Modal: "app-modal",
  LoadingSpinner: "app-spinner",
  ConfirmButton: "app-confirm",
} as const;
