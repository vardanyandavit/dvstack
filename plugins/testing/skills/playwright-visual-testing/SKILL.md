---
name: playwright-visual-testing
description: Add screenshot comparison to a Playwright suite without making it flaky — toHaveScreenshot, masking volatile regions, disabling animations and freezing time, per-platform snapshots and why CI must generate them, diff thresholds, snapshot update policy, and when an aria snapshot or an assertion is the better tool. Use when setting up visual regression, when screenshot tests fail only in CI, when snapshots need updating, or when deciding whether a bug is worth a screenshot test.
---

# Visual testing

Naming and folder placement are defined in `playwright-naming-conventions`.

Screenshots catch what assertions cannot see — a collapsed layout, a white-on-white button, a chart that renders empty. They also fail for reasons that are not bugs. Everything below is about keeping the second from drowning the first.

## Set it up

```ts
// playwright.config.ts
expect: {
  toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", scale: "css" },
},
snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",
```

```ts
await expect(page).toHaveScreenshot("dashboard.png");
await expect(dashboardPage.getSummaryCard()).toHaveScreenshot("summary-card.png");
```

`toHaveScreenshot` retries like any web-first assertion: it re-takes the screenshot until it matches or the timeout expires, which absorbs a late-loading image.

## Making it deterministic

Pixels change with OS, browser build, fonts, GPU, and device scale factor. A snapshot generated on macOS will not match Linux CI — this is the single biggest reason visual testing gets abandoned.

1. **Generate snapshots where they are verified.** Commit only CI-generated images, via a container matching the CI image (`mcr.microsoft.com/playwright:v1.63.0-jammy`) or by updating them from a CI run. Playwright suffixes snapshots per platform, so locally generated files are simply never used by CI.
2. **Prefer component screenshots over full pages.** A page shot fails when anything anywhere changes; `getSummaryCard()` fails only when that card changes.
3. **Mask what is volatile** — timestamps, avatars, ids, ads: `toHaveScreenshot({ mask: [page.getByTestId("updated-at")] })`.
4. **Freeze anything moving.** `animations: "disabled"` handles CSS; for JS animation and time-dependent rendering use `page.clock.install({ time })`. Seed any randomised data.
5. **Fix the fonts.** A web font that has not loaded renders as fallback and changes every glyph: `await document.fonts.ready` before the shot, or block webfonts entirely and accept the fallback as the baseline.
6. **Pin the viewport** in the project's `use`, and take `fullPage` shots only when the whole page is the subject.
7. **Set a threshold, not zero.** `maxDiffPixelRatio: 0.01` absorbs antialiasing. `maxDiffPixels` is better for small components where a ratio hides a real shift.

## Review and update

`--update-snapshots` is the moment visual testing either works or becomes theatre.

- Updating is a **code review event**. New images go in the PR; a reviewer looks at them. A snapshot updated without anyone looking is a regression committed on purpose.
- Update the specific test, never the whole suite: `npx playwright test dashboard.spec.ts --update-snapshots`.
- On failure, open the HTML report: it shows expected, actual, and diff side by side.
- Snapshots are binary files in git. Keep them few and small — this is the other reason to screenshot components rather than pages.

## Choosing the right tool

| Concern | Tool |
|---|---|
| Is the value correct, is the button enabled | `expect(locator)` — always first |
| Did the structure or semantics change | `toMatchAriaSnapshot` — see `playwright-accessibility-testing` |
| Did it *look* right | `toHaveScreenshot` |

Reach for a screenshot when the thing under test genuinely is visual: layout at a breakpoint, a chart, a theme, a print stylesheet, an email template. A screenshot asserting that a list shows three rows is a slower, more fragile `toHaveCount(3)`.

## Verify

- The same test passes twice in a row locally and in CI with no update.
- Changing a padding value fails the test; changing unrelated copy elsewhere does not.
- Every masked region is masked because it is volatile, not because it was failing.
- The snapshot folder is under 50 files and nobody dreads updating it.

## Rules

- Never commit snapshots generated on a developer machine when CI runs another OS.
- Never run `--update-snapshots` across the whole suite to go green.
- No screenshot where an assertion answers the question.
- Every mask is explained in a comment.
