---
name: playwright-accessibility-testing
description: Add accessibility checks to a Playwright suite — @axe-core/playwright scans with WCAG tags, attaching violations to the report, scoping and excluding known issues, aria snapshots with toMatchAriaSnapshot for structural assertions, and keyboard and focus tests that automation can actually cover. Use when adding a11y coverage, when asked about WCAG compliance in tests, or when deciding what accessibility testing can and cannot be automated.
---

# Accessibility testing

Naming and folder placement are defined in `playwright-naming-conventions`.

**Automated rules catch roughly a third of real accessibility defects.** They find missing labels, contrast failures, and broken ARIA; they cannot tell you whether a flow is usable with a screen reader. Write the automated checks, and do not report them as compliance.

## Files

- `files/a11y.fixture.ts` — an `a11y` fixture wrapping `@axe-core/playwright`: WCAG A/AA tags, results attached to the report, failures reported as a readable summary. Copy to `fixtures/a11y.fixture.ts` and merge it in `fixtures/index.ts`.

```bash
npm i -D @axe-core/playwright
```

## Scanning

```ts
test("the dashboard has no WCAG A/AA violations", async ({ dashboardPage, a11y }) => {
  await test.step("open the dashboard", async () => {
    await dashboardPage.goto();
    await expect(dashboardPage.getRoot()).toBeVisible();
  });

  await test.step("it passes an axe scan", async () => {
    await a11y.expectNoViolations();
  });
});
```

- **Scan a settled page.** A scan mid-render reports violations that do not exist a moment later.
- **Scan each distinct state, not each URL.** A modal open, a form in its error state, and a populated table are different trees; the empty page passing says nothing about them.
- **`withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])`** keeps the suite on the standard most teams are actually held to. Scanning every axe rule on an existing app produces a list nobody triages.
- **Attach results to the report.** A failure that prints only "expected []" costs a re-run to diagnose.
- **Summarise before asserting.** `expect(violations).toEqual([])` on raw axe output prints hundreds of lines of internals; assert on `{ id, impact, nodes, help }`.
- **`exclude()` is for issues with a ticket number in the comment**, not for making the suite green. An exclusion with no ticket is a silent regression.

Adding this to an existing app will fail immediately and widely. Scope it to new or reworked screens first, then widen — a blanket scan that everyone learns to skip is worse than no scan.

## Structural assertions with aria snapshots

`toMatchAriaSnapshot` asserts the accessibility tree — the structure a screen reader announces — in YAML:

```ts
await expect(page.getByRole("main")).toMatchAriaSnapshot(`
  - heading "Orders" [level=1]
  - table:
    - rowgroup:
      - row "Order Date Status"
  - button "Export"
`);
```

Generate one by passing an empty template and running with `--update-snapshots`, or keep it in a file with `{ name: "orders.aria.yml" }`.

It sits between a locator assertion and a screenshot: it catches a heading level changing, a button losing its name, or a landmark disappearing — semantic regressions a screenshot ignores and a single-element assertion never looks at — while staying immune to styling changes. Use it for stable structural scaffolding; do not snapshot a whole page of volatile content.

## What only a test can check

Axe cannot see behaviour. These are ordinary Playwright tests, and they are where the real bugs are:

```ts
// Keyboard reachability and order.
await page.keyboard.press("Tab");
await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

// A modal traps focus and returns it on close.
await page.getByRole("button", { name: "Settings" }).click();
await expect(page.getByRole("dialog")).toBeFocused();
await page.keyboard.press("Escape");
await expect(page.getByRole("button", { name: "Settings" })).toBeFocused();

// An async result is announced, not just rendered.
await expect(page.getByRole("status")).toHaveText(/3 results/);
```

Cover: every interactive control reachable and operable by keyboard, visible focus, `Escape` closing overlays, focus returning to the trigger, live regions announcing async changes, and no keyboard trap.

**What stays manual:** actual screen-reader output, whether alt text is *meaningful*, whether an error message is understandable, whether a custom widget behaves the way its role promises, and testing with disabled users.

## Verify

- The scan fails when a label is removed from a form field.
- The report contains the axe attachment for both passing and failing runs.
- Every `exclude()` carries a ticket reference.
- Keyboard tests fail if `tabindex` ordering is broken.
- Aria snapshots fail on a heading level change and survive a CSS change.

## Rules

- Never report an axe pass as "accessible" — it is one third of the picture.
- No exclusion without a ticket and a comment.
- Scan states, not URLs.
- Keyboard and focus tests are normal specs, not a separate suite nobody runs.
