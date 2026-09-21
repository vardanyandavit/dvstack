---
name: playwright-locators
description: Choose and write Playwright locators and web-first assertions that survive refactors — role-based queries first, data-testid as the escape hatch, strict-mode-safe scoping, and never CSS or XPath tied to markup structure. Use when writing or reviewing selectors, fixing "strict mode violation" or "element not found" errors, deciding whether to add a test id, or replacing brittle CSS/XPath selectors.
---

# Playwright locators

Naming and folder placement are defined in `playwright-naming-conventions`; suite structure in `playwright-test-architecture`.

## Order of preference

Work down this list. Stop at the first one that applies.

1. **Role + accessible name** — `page.getByRole("button", { name: "Sign in" })`. Survives restyling and DOM moves, and fails when the control stops being reachable for real users, which is a bug worth failing on.
2. **Label** — `page.getByLabel("Email")` for form fields.
3. **Text** — `page.getByText("Order confirmed")` for static copy. Use `{ exact: true }` when a shorter string is a substring of a longer one.
4. **Placeholder / alt / title** — when nothing above exists.
5. **`getByTestId`** — `data-testid`, configured via `testIdAttribute` in the config. The escape hatch for elements with no accessible identity: a chart, a canvas, a drag handle, a list row wrapper.
6. **CSS** — only for structural containers with no semantics (`.modal-backdrop`) and only when scoping, never as the final target.

Never: XPath, `nth-child`, generated class names (`.css-1x2y3z`), or any selector that encodes DOM depth. They break on markup changes that change nothing for the user, which trains people to ignore failures.

## Writing them

**Scope instead of chaining indexes.** Strict mode fails a locator that matches more than one element — that is a feature. Narrow the container, don't add `.first()`:

```ts
const row = page.getByRole("row", { name: "INV-1042" });
await expect(row.getByRole("cell", { name: "Paid" })).toBeVisible();
```

`.first()` / `.nth(0)` are acceptable only when the element genuinely is "whichever comes first" — a feed's newest entry — and never as a way to silence strict mode.

**Filter by content, not by position.**

```ts
page.getByRole("listitem").filter({ hasText: "Pro plan" }).getByRole("button", { name: "Upgrade" });
```

**Define each locator once, at the narrowest scope that covers its uses.** Used once: inline in the page object method that needs it. Used more than once, or asserted on from a spec: a `getXxx()` getter on the page object. Used across pages: the test id or accessible name goes in `constants/selectors.ts` and the page object wraps it. A raw `page.locator(...)` inside a spec means a locator is now defined in two places — see `playwright-test-architecture`.

**Locators are lazy.** Building one resolves nothing, so they can be created in a constructor before the page exists and reused after re-renders. Never store a resolved `ElementHandle`.

## Web-first assertions

Assert with matchers that retry until the expect timeout. This is the single biggest source of stability in a suite.

| Instead of | Write |
|---|---|
| `expect(await el.isVisible()).toBe(true)` | `await expect(el).toBeVisible()` |
| `expect(await el.textContent()).toBe("Paid")` | `await expect(el).toHaveText("Paid")` |
| `expect(await el.count()).toBe(3)` | `await expect(el).toHaveCount(3)` |
| `expect(page.url()).toContain("/dashboard")` | `await expect(page).toHaveURL(/\/dashboard/)` |
| `await el.waitFor(); expect(...)` | `await expect(el).toBeVisible()` |

A missing `await` on `expect` makes the assertion vacuous and the test green forever — the reason `@typescript-eslint/no-floating-promises` belongs in every Playwright project.

Prefer `toHaveText` over `toContainText` when the full string is known; prefer `toBeHidden` over `not.toBeVisible` when the element should leave the DOM or be removed from view, since the negated form also passes when the element never existed.

## Adding a test id

Before adding `data-testid`, check why the role query fails. Usually the element is missing a label, a button is a `div`, or an icon button has no accessible name — fixing that improves the product and the test at once. Add the test id when the element genuinely has no semantics to query. The component-side rules are `testable-ui` in `dvstack-frontend`.

Keep ids stable and domain-named: `data-testid="invoice-row"`, not `data-testid="div-3"`. Set `testIdAttribute` once in the config if the project already uses `data-test` or `data-qa`.

## Verify

- `npx playwright test --reporter=list` passes with zero "strict mode violation" errors.
- `grep -rnE "page\.locator\(|xpath=|nth-child|\.first\(\)" tests/ pages/` returns only reviewed, justified hits.
- Rename a CSS class in the app: the suite still passes.
- Change a button's visible label: the suite fails. That is correct — the contract with the user changed.

## Rules

- Every `expect` on a locator is awaited.
- No `isVisible()` / `textContent()` inside assertions. Those are non-retrying reads, for logic only.
- No `waitForSelector` when an assertion expresses the same thing.
- One definition per element, at the right tier: inline, getter, or shared constant.
- Selector constants hold test ids and accessible names, never raw CSS unless the markup forces it.
