---
name: playwright-mobile-web
description: Test a responsive or mobile web app in Playwright — device descriptors and projects per form factor, viewport-only projects for breakpoints, touch and tap versus click, the duplicated responsive DOM problem and locator.visible(), mobile-only navigation and gestures, what emulation does and does not prove, and which checks need a real device. Use when a bug only happens on phones, when adding mobile coverage or breakpoint tests, when a tap does nothing, when a locator matches twice because the page renders mobile and desktop markup, or when deciding between a device project and a viewport project.
---

# Mobile and responsive web

Naming and folder placement are defined in `playwright-naming-conventions`; locator choice in `playwright-locators`.

Playwright emulates a phone **browser**, not a phone. Viewport, user agent, device scale factor, touch support, and mobile layout are real; the OS, the GPU, the real Safari build, and actual network conditions are not. That line decides what belongs here and what has to run somewhere else.

## Device projects

```ts
import { defineConfig, devices } from "@playwright/test";

projects: [
  { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
  { name: "mobile-safari",  use: { ...devices["iPhone 15"] } },
  { name: "mobile-chrome",  use: { ...devices["Pixel 7"] } },
]
```

A device descriptor is a bundle: viewport, `userAgent`, `deviceScaleFactor`, `isMobile`, `hasTouch`, and the browser engine it belongs to. Spread it — never copy the viewport out and leave the rest, which produces a desktop browser in a narrow window and hides every touch and user-agent bug.

**Match the engine to the real world.** iPhone traffic is WebKit, so `iPhone 15` runs WebKit — that is the point, and most iOS-only bugs are WebKit bugs rather than screen-size bugs. `isMobile` is not supported in Firefox; a "mobile Firefox" project is emulation with the mobile part missing.

**Run mobile on the tier it earns.** A full suite across three devices is three times the CI bill. Tag the journeys that are genuinely different on a phone and run those; run the rest on one desktop project — `playwright-test-strategy`.

```ts
test("completes checkout on a phone @mobile", ...);
```

## Device project or viewport project

| Testing | Use |
|---|---|
| A real phone's behaviour: touch, WebKit, mobile user agent | Device descriptor |
| A CSS breakpoint on the same browser | Viewport-only project |

```ts
// Breakpoints: same engine, different width, so a failure is the layout and nothing else.
{ name: "tablet-width", use: { ...devices["Desktop Chrome"], viewport: { width: 834, height: 1112 } } },
```

Take breakpoint widths from the app's own CSS, and test **both sides of each one** — the bug is nearly always at the boundary. Do not invent widths; a project per device in a marketing list is a slow suite that proves nothing extra.

## Touch

```ts
await page.getByRole("button", { name: "Menu" }).tap();
```

`tap()` needs `hasTouch: true`, which a device descriptor sets and a bare viewport does not — calling it without touch support throws. `click()` still works under emulation, so **use `tap()` only where the app distinguishes them**: a component listening for `touchstart`, a swipe area, a control with a long-press. Otherwise `click()` keeps the test readable on every project.

Multi-touch and swipes have no matcher. Drive them through `page.touchscreen` or dispatch the events, and assert the *outcome* — the drawer open, the next slide showing — never the gesture:

```ts
await page.touchscreen.tap(200, 400);
```

Prefer a supported path where one exists: test that the carousel's next control works, and cover the swipe once, rather than swiping in twenty tests.

## The duplicated DOM

The single biggest source of mobile locator failures. Many responsive apps render **both** layouts and hide one with CSS, so a role query matches twice and strict mode fails — correctly, because the test really is ambiguous.

```ts
// Matches the hidden desktop nav and the visible mobile one.
await page.getByRole("button", { name: "Menu" }).click();      // strict mode violation

// Right: filter to the one a user can actually reach.
await page.getByRole("button", { name: "Menu" }).visible().click();
```

`locator.visible()` (v1.63; `filter({ visible: true })` since v1.51) narrows to visible elements. It is the correct tool here, and only here — **never reach for it to silence a strict-mode error whose real cause is two genuinely different controls.** Better still, scope to the container that is actually on screen:

```ts
const mobileNav = page.getByRole("navigation", { name: "Mobile" });
await mobileNav.getByRole("button", { name: "Menu" }).tap();
```

If the duplication is the app's own choice, the better fix is in the product: render one nav, or give the two an accessible name each — `testable-ui` in `dvstack-frontend`.

## What is different on a phone

Cover the behaviour that actually changes, not the same test at a smaller width:

- **Navigation collapses.** A hamburger, a drawer, a bottom bar. Assert both directions — open *and* close — `playwright-step-validation`.
- **Controls move or disappear.** A table becomes cards; a sidebar action moves into a menu. The desktop test's locator does not exist, which is the honest signal that this is a different flow.
- **The on-screen keyboard changes the viewport** and can hide the submit button. Assert the control is reachable after focusing a field near the bottom.
- **Sticky headers and safe areas** cover elements. A click that lands on the header is what `scrollIntoViewIfNeeded` is for — never `force: true`, which hides exactly this bug.
- **Hover does not exist.** A menu that only opens on hover is unreachable. That is a product bug, and a test asserting it opens on tap is the right way to report it.
- **Orientation:** `await page.setViewportSize({ width: 844, height: 390 })` for landscape, where the app has a landscape layout at all.

## What emulation does not prove

Do not claim these from a green mobile project:

- Real iOS Safari behaviour — emulated WebKit is close, not identical.
- Performance, scroll smoothness, memory, battery.
- The native keyboard, the share sheet, biometrics, push, deep links into a native app.
- Real network conditions. Throttling via CDP is a useful approximation, not a train tunnel.

Those belong on a real device — a device cloud, or a manual pass before release. **Say so in the test plan** rather than letting a passing emulation project stand in for coverage nobody has.

## Verify

- `npx playwright test --project=mobile-safari` passes, and it is WebKit — not Chromium in a narrow window.
- A locator that matched twice now scopes to one visible element without `.first()`.
- Shrinking the desktop project's viewport does not make it a mobile test: `hasTouch` and `isMobile` are set only by device projects.
- Mobile navigation is asserted open **and** closed.
- Each breakpoint project tests both sides of a width that exists in the app's CSS.
- The test plan names what emulation does not cover.

## Rules

- Spread the whole device descriptor. Never copy out the viewport alone.
- `tap()` only where touch behaviour differs; `click()` everywhere else.
- Never `force: true` to get past a sticky header or a keyboard overlay.
- `visible()` is for the duplicated responsive DOM, not for silencing strict mode.
- No device project without a reason it catches something the desktop project cannot.
- Never report emulation as device coverage.
