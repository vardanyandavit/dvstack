---
name: playwright-auth-and-roles
description: Authenticate a Playwright suite once and test several roles — a setup project per role writing its own storage state, test.use to pick a role per file, per-worker sign-in for tests that mutate the account, running one spec signed out, two roles in one test with separate contexts, session storage and token expiry, MFA and SSO strategies, and testing what a role must not be able to see. Use when tests sign in through the UI every time, when adding an admin or second role, when parallel tests fight over one account, or when testing permissions and access boundaries.
---

# Authentication and roles

Naming and folder placement are defined in `playwright-naming-conventions`; the setup/teardown project wiring in `playwright-test-architecture`.

Signing in through the UI in every test is the most expensive mistake an e2e suite makes. **Sign in once per role, save the state, and start every other test already there.** The login flow keeps exactly one test of its own.

## Files

| File | Copy to | What it is |
|---|---|---|
| `files/auth.ts` | `constants/auth.ts` | Role list, storage-state paths, the signed-out constant |
| `files/auth.setup.ts` | `tests/auth.setup.ts` | One setup test per role, each saving its own state |
| `files/roles.fixture.ts` | `fixtures/roles.fixture.ts` | Per-worker sign-in, for suites that mutate the account |

## One role

The default, and where most suites should stop. A setup project signs in and writes `.auth/member.json`; browser projects depend on it and load it.

```ts
projects: [
  { name: "setup", testMatch: /.*\.setup\.ts/, teardown: "cleanup" },
  { name: "chromium", dependencies: ["setup"], testMatch: /.*\.spec\.ts/,
    use: { storageState: storageStateFor("member") } },
]
```

**`.auth/` is gitignored, always.** A storage state file holds live cookies and can be used to impersonate the account it came from. It is a credential, not a fixture.

**Assert the session before saving it.** A setup that saves state from a page that never signed in produces a valid-looking file and a suite where every spec fails somewhere confusing. The assertion in `auth.setup.ts` is what makes the setup fail where the problem is.

## Several roles

One setup test per role, one state file per role, and the spec picks:

```ts
// tests/admin-settings.spec.ts — whole file runs as admin
test.use({ storageState: storageStateFor("admin") });

// or one describe block inside a mixed file
test.describe("as a member", () => {
  test.use({ storageState: storageStateFor("member") });
  test("cannot open billing", async ({ page }) => { /* ... */ });
});
```

`test.use` is file- or describe-scoped, never per test — it configures the fixture before the test runs. A single test needing a different role than its neighbours belongs in its own describe block.

**Name roles after permissions, not after people.** `admin`, `member`, `viewer`, `billing-owner` — never `user2`. A role list that reads like the product's permission model stays correct when someone renames an account.

## Signed out

```ts
// tests/auth.spec.ts
test.use({ storageState: SIGNED_OUT });   // { cookies: [], origins: [] }
```

This is how sign-in, sign-up, password reset, and every "redirects to login" test opt out of the shared state. They are the only tests that should type a password.

## Two roles in one test

Real multi-user behaviour — a comment appearing for the other party, an admin revoking access while a member is on the page — needs two contexts in one test, not two tests:

```ts
test("revoking access signs the member out", async ({ browser }) => {
  const adminContext = await browser.newContext({ storageState: storageStateFor("admin") });
  const memberContext = await browser.newContext({ storageState: storageStateFor("member") });

  const adminPage = await adminContext.newPage();
  const memberPage = await memberContext.newPage();
  // ... act as admin, assert as member ...

  await adminContext.close();
  await memberContext.close();
});
```

Wrap it in a fixture that closes both contexts after `use()` rather than repeating the teardown — `playwright-fixtures`. Two tests cannot do this: they have no shared timeline, and coordinating them reintroduces order dependence.

## When tests mutate the account

A shared storage state is correct while tests only *read*. The moment a test changes the signed-in user — renames the profile, flips a setting, burns a quota, cancels the subscription — every parallel test using that account is now order-dependent.

Three fixes, cheapest first:

1. **Create the data the test mutates**, and leave the account alone. Most "we need separate accounts" turns out to be a seeding problem — `playwright-test-data`.
2. **Per-worker accounts** (`files/roles.fixture.ts`): each worker signs in as its own account, keyed on `parallelIndex`, so tests run fully parallel and never share a user. Costs one account per worker.
3. **A named lock** when the resource genuinely is singular — one sandbox tenant, one rate-limited integration:
   ```ts
   test("updates the org's billing plan", { lock: "org-billing" }, async ({ page }) => { /* ... */ });
   ```
   Tests holding the same lock never run concurrently; the rest of the suite keeps running in parallel. Reach for it last: a lock is a real cap on runtime.

Never `workers: 1`. That is the lock applied to the whole suite.

## Session storage, tokens, and expiry

- **`storageState` saves cookies and localStorage. It does not save sessionStorage.** An app that keeps its token there needs it restored by hand:
  ```ts
  await context.addInitScript((storage) => {
    for (const [key, value] of Object.entries(storage)) window.sessionStorage.setItem(key, String(value));
  }, savedSessionStorage);
  ```
- **A saved state expires.** A setup project re-runs per suite run, so this bites in watch mode and in long local sessions, not in CI. Let the setup re-authenticate rather than adding logic that inspects the token.
- **Test expiry deliberately** rather than waiting for it: clear the cookie, or use `page.clock` to move past the expiry, then assert the app redirects to login and returns to the original page after signing back in. That is a real flow and it breaks often.
- **Never commit a token, a state file, or a password.** Accounts come from the environment through `data/users.ts` — `grep -rn "password" tests/` should find only variable names.

## MFA, SSO, and other doors you do not own

An e2e suite must not automate a third party's login screen or a real second factor. Neither is your product, both change without warning, and a CAPTCHA can appear on either at any time.

In order of preference:

1. **Test accounts exempt from MFA** in the test environment. The normal answer.
2. **A seeded TOTP secret** for the test account, with the code computed in the setup — this tests your own second factor without depending on a phone or a mail provider.
3. **A session minted through the API** in setup, written into the state file — fastest, and the right choice when the identity provider is external.
4. **A signed test bypass** the test environment accepts and production does not.

Whichever you pick, **the real login flow keeps at least one test** against the real provider's sandbox, so a broken sign-in is still caught somewhere.

## Testing the boundary, not just the role

The permission tests that matter are the negative ones, and they are the ones suites skip:

```ts
test.describe("as a member", () => {
  test.use({ storageState: storageStateFor("member") });

  test("cannot reach the admin page", async ({ page }) => {
    await page.goto(routes.adminSettings);
    await expect(page).toHaveURL(routes.dashboard);
    await expect(page.getByRole("heading", { name: "Admin settings" })).toBeHidden();
  });

  test("the API refuses the admin action", async ({ request }) => {
    const response = await request.delete(endpoints.organisation);
    expect(response.status()).toBe(403);
  });
});
```

**Assert the API, not only the UI.** A hidden button is not access control; it is CSS. A role test that only checks the button is missing proves nothing about the endpoint behind it — see `playwright-api-testing`.

Cover: direct navigation to a forbidden route, the API call behind a hidden control, a deep link to another tenant's record, and what happens after a role is downgraded mid-session.

## Verify

- `npx playwright test` from a clean checkout with no `.auth/` present passes — setup regenerates every role's state.
- `git check-ignore .auth/member.json` succeeds, and `git log --all --name-only | grep .auth` is empty.
- Exactly one spec types a password, and it runs with `SIGNED_OUT`.
- `npx playwright test --repeat-each=3 --workers=4` passes: no two tests fight over one account.
- Deleting one role's setup test fails only that role's specs, with a clear message.
- Every role has at least one negative test, asserted at the API as well as the UI.

## Rules

- No signing in through the UI outside `auth.setup.ts` and the sign-in spec.
- `.auth/` gitignored. A storage state file is a credential.
- Assert the session before writing the state file.
- `test.use({ storageState })` at file or describe scope — never a per-test hack.
- No shared account for tests that mutate it. Per-worker state, or seed the data instead.
- Never automate a third-party login screen or a real second factor.
- A hidden UI control is not a permission test. Assert the endpoint.
