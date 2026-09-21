---
name: playwright-hard-interactions
description: Handle the parts of a page that ordinary locators cannot reach — iframes, shadow DOM, native dialogs and alerts, popups and new tabs, file uploads and downloads, drag and drop, hover-only menus, clipboard, date pickers, infinite scroll and virtualised lists, canvas, multiple users in one test, permissions, and frozen time. Use when an element cannot be clicked or found, when a click opens a new tab or a download, when a test times out on an alert, or when interacting with an embedded or custom widget.
---

# Hard interactions

Naming and folder placement are defined in `playwright-naming-conventions`; locator choice in `playwright-locators`.

**The rule behind half of this page:** downloads, popups, file choosers, and dialogs arrive as *events*. Register the listener **before** the action that triggers them. Awaiting the click first is the most common cause of a timeout here — the event fires while nothing is listening.

## Files

- `files/download.ts` — `downloadFrom`, `popupFrom`, `readDownloadedText`. Copy to `helpers/download.ts`.

## Frames and shadow DOM

```ts
// Scoped to one frame.
await page.frameLocator("#checkout-frame").getByRole("button", { name: "Pay" }).click();

// Searches every frame on the page, when the frame is an implementation detail.
await page.frameLocator().getByRole("button", { name: "Pay" }).click();
```

Nested frames chain: `page.frameLocator("#outer").frameLocator("#inner")`. A frame's content is a separate document, so `page.getByRole(...)` alone will never see it.

**Shadow DOM needs nothing special.** Playwright's locators pierce open shadow roots automatically. Closed shadow roots are deliberately unreachable — if the app owns the component, open the root; if a third party owns it, test around it.

## Dialogs, popups, tabs

```ts
// Native alert/confirm/prompt. Playwright auto-dismisses if nothing handles it,
// and a page waiting on an unhandled dialog will hang.
page.once("dialog", (dialog) => dialog.accept());
await page.getByRole("button", { name: "Delete" }).click();

// A click that opens a new tab.
const popup = await popupFrom(page, () => page.getByRole("link", { name: "Invoice" }).click());
await expect(popup.getByRole("heading", { name: "Invoice" })).toBeVisible();
```

A modal built in HTML is not a dialog — it is ordinary DOM, located normally. Only `alert`, `confirm`, `prompt`, `beforeunload`, and basic auth are browser dialogs.

For two users in one test, use two contexts rather than two tests: `const buyer = await browser.newContext()`, `const seller = await browser.newContext()`. Each has its own cookies and storage.

## Files in and out

```ts
// Upload. Works on a hidden input — no need to make it visible.
await page.getByLabel("Attachment").setInputFiles("fixtures/invoice.pdf");
await page.getByLabel("Attachment").setInputFiles([]);                      // clear
await page.getByLabel("Attachment").setInputFiles({ name: "a.csv", mimeType: "text/csv", buffer });

// When a button opens the OS picker instead of exposing an input.
const chooserPromise = page.waitForEvent("filechooser");
await page.getByRole("button", { name: "Upload" }).click();
await (await chooserPromise).setFiles("fixtures/invoice.pdf");

// Download.
const download = await downloadFrom(page, () => page.getByRole("button", { name: "Export" }).click());
expect(download.suggestedFilename()).toBe("orders.csv");
expect(await readDownloadedText(download)).toContain("order_id");
```

Assert on the *content*, not just that something downloaded. Read it from the stream rather than writing to disk, so nothing is left behind and parallel workers cannot collide.

## Gestures and hidden UI

```ts
// Drag and drop. Works for most implementations.
await page.getByTestId("card-1").dragTo(page.getByTestId("column-done"));

// HTML5 drag events that dragTo does not trigger: drive the mouse in steps,
// because the app's dragover handler needs intermediate movements.
await source.hover();
await page.mouse.down();
await target.hover();
await target.hover();                 // second hover: some libraries need two moves
await page.mouse.up();

// Hover-only menus.
await page.getByRole("button", { name: "Account" }).hover();
await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible();
```

**Duplicated responsive DOM** — a page rendering both a mobile and a desktop version, where only one is visible — is what `visible()` is for: `await page.getByRole("button", { name: "Menu" }).visible().click()` (v1.63; `filter({ visible: true })` since v1.51). Prefer scoping to the visible container when one exists, and see `playwright-mobile-web` for the rest of the responsive cases.

## Widgets that fight back

- **Date pickers:** type into the input if the app accepts typed dates — it is faster and locale-explicit. Only click through the calendar when the input is read-only, and then assert the resulting value rather than the calendar's internals.
- **Infinite scroll / virtualised lists:** the row you want may not be in the DOM. `await locator.scrollIntoViewIfNeeded()` on the last visible row, then assert the count grew. Never assert on an index in a virtualised list.
- **Canvas and charts:** nothing inside is locatable. Assert on the surrounding state (a legend, a tooltip, a value readout), read app state exposed for testing, or fall back to a masked screenshot — see `playwright-visual-testing`.
- **Rich text editors:** `locator.fill()` on a `contenteditable` works; keyboard input via `page.keyboard.type()` when the editor needs real key events.
- **Clipboard:** grant permission with `context.grantPermissions(["clipboard-read", "clipboard-write"])`, then read via `page.evaluate(() => navigator.clipboard.readText())`.
- **Geolocation, camera, notifications:** `context.grantPermissions([...])` and `context.setGeolocation(...)` in the fixture, never a manual click on a browser prompt.
- **Time-dependent UI:** `await page.clock.install({ time: new Date("2026-01-01T10:00:00Z") })`, then `await page.clock.fastForward("01:00")`. Far better than waiting for a countdown.

## Verify

- Every event-driven interaction registers its listener before the trigger.
- A download test asserts on file contents, not only on the event firing.
- The dialog test fails if the app stops showing the dialog — `page.once` was consumed.
- Popup assertions run against the popup's own `Page` object, not the opener.
- No `force: true` anywhere in this code: if an element is covered, the test should say so.

## Rules

- Never click a trigger before registering its event listener.
- Never use `page.waitForTimeout` to wait for a dialog, popup, or download.
- No real files written to the repo by a test; read streams or write to `testInfo.outputPath()`.
- No interacting with a closed shadow root or a cross-origin frame you do not control — test around it or ask for a hook.
