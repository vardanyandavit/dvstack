---
name: playwright-debugging
description: Author and debug Playwright tests with the tooling instead of console.log — UI mode with time travel and watch, the trace viewer, codegen for recording and picking locators, --debug and the inspector, headed and slow-motion runs, pausing mid-test, VS Code integration, and attaching evidence to the report. Use when a test fails and the reason is unclear, when writing a new test against an unfamiliar page, when a locator does not match, or when someone is debugging with screenshots and print statements.
---

# Debugging and authoring

Naming and folder placement are defined in `playwright-naming-conventions`; diagnosing intermittent failures in `playwright-flaky-tests`.

Playwright's tooling makes `console.log` debugging obsolete. Almost every question — *what did the page look like, what did the click hit, what did the network return, why did the locator miss* — is answered by a trace that already exists.

## The four tools

| Tool | Command | Use it for |
|---|---|---|
| **UI mode** | `npx playwright test --ui` | Writing and iterating. Watch mode, time-travel through steps, live locator picker, network and console per step |
| **Trace viewer** | `npx playwright show-trace trace.zip` | A failure you did not watch happen — especially from CI |
| **Codegen** | `npx playwright codegen <url>` | An unfamiliar page: records actions and, more usefully, shows the locator it would choose |
| **Inspector** | `npx playwright test --debug` | Stepping through a run live, with the locator explorer |

UI mode is where a test should be written. It re-runs on save, keeps the browser open between runs, and lets you hover a step to see the DOM at that instant.

## Reading a trace

The trace has everything: timeline, DOM snapshot before and after every action, the action log with timings, network, console, and the test source with the failing line marked.

1. Click the failing action. The **before** snapshot is the page as the action found it — usually the whole answer.
2. Hover the action in the timeline: the target element is highlighted. If nothing is highlighted, the locator matched nothing; if something unexpected is, the locator is wrong.
3. Check the network tab for a failed or pending request behind a missing element.
4. Check the console tab for an app error that broke rendering.

Traces exist for CI failures already — `trace: "retain-on-failure"` in the shared config. Download the report artifact and open the trace rather than re-running CI.

## When a locator does not match

```bash
npx playwright test --debug        # step through, explore locators live
```

In UI mode or the inspector, use the **pick locator** button: click the element and it prints the locator Playwright would use. Compare it with what the test asks for — the usual causes are an element inside a frame, a second match (strict mode), a hidden duplicate in responsive DOM, or an accessible name that differs from the visible text.

`await page.pause()` stops a run at that line and opens the inspector with the page live — the fastest way to inspect real application state mid-flow.

## Slowing it down, watching it run

```bash
npx playwright test --headed --project=chromium          # watch it
npx playwright test auth.spec.ts:12 --repeat-each=5      # one test, five times
PWDEBUG=1 npx playwright test                            # inspector, all timeouts disabled
```

Use a `slowMotion` option fixture (see `playwright-fixtures`) rather than hard-coding delays. Watching headed is for understanding a flow, not for verifying — the run you watch is not the run CI does.

## Leaving evidence for later

```ts
await testInfo.attach("api-response", { body: JSON.stringify(order), contentType: "application/json" });
test.info().annotations.push({ type: "issue", description: "PROJ-412" });
```

Attachments land in the HTML report next to the trace. When a test depends on data that varies per run, attach it — that turns "failed in CI, cannot reproduce" into a report you can read.

## Verify

- A CI failure can be diagnosed from its artifact alone, with no local re-run.
- No `console.log` or commented-out debugging left in a spec.
- No `page.pause()` committed.
- `test.only` is not committed — `forbidOnly` in CI catches it.
- A new test was written in UI mode, with locators picked rather than guessed.

## Rules

- Read the trace before changing the test. Most "flaky" tests are explained in the before-snapshot.
- Never debug by adding screenshots to the test; the trace already has them.
- Never leave `--headed`, `slowMo`, or `pause()` in committed code.
- If a failure cannot be diagnosed from the report, the fix is more attachments, not more re-runs.
