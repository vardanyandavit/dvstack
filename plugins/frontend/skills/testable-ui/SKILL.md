---
name: testable-ui
description: Build front-end components an automated suite and an AI agent can actually drive — accessible names on every control, semantic elements over div handlers, when a data-testid is the right answer and how to name it, stable identity for list rows, exposing loading, empty and error states in the DOM, announcing async results, and the markup patterns that force tests into brittle CSS selectors. Use when writing or reviewing React/TSX components, when a test needs a selector the markup cannot provide, when a locator matches twice, or when asked to make an app easier to test or automate.
---

# Testable UI

The front-end side of `playwright-locators`. That skill says how to *query* a page; this one says how to *build* one so the query is possible.

**A test that reaches for `.css-1x2y3z` is reporting a markup bug.** The selector is brittle because the element has no identity a user — or a screen reader, or an agent — could use to find it. Fixing that in the component makes the product better and the test stable in the same change. An AI agent driving the app through an accessibility tree (Playwright MCP, `playwright-agents`) sees exactly what a screen reader sees, so the same fix is what makes the app automatable at all.

## Give every control a name

The name is the contract. Nine times out of ten the fix is one attribute.

```tsx
// No accessible name: the test has no query but CSS, and a screen reader says "button".
<button onClick={onDelete}><TrashIcon /></button>

// Named. `getByRole("button", { name: "Delete invoice" })` now works.
<button onClick={onDelete} aria-label="Delete invoice"><TrashIcon aria-hidden="true" /></button>
```

- **Icon-only controls get `aria-label`**, and the icon itself gets `aria-hidden="true"` so it does not pollute the name.
- **Inputs get a real `<label htmlFor>`.** A placeholder is not a label — it disappears on focus, and `getByLabel` will not find it.
- **Name by what it does, in the user's words.** `aria-label="Delete invoice"`, not `"btn-del"`. If the visible text already says it, add nothing.
- **Distinguish repeated controls.** Five "Edit" buttons in a table are five strict-mode violations. Either name them (`aria-label={`Edit ${invoice.number}`}`) or make each row a queryable container — below.

## Use the element that already has the semantics

```tsx
<div className="btn" onClick={submit}>Save</div>        // no role, no keyboard, no query
<button type="button" onClick={submit}>Save</button>    // all three, free
```

`button`, `a[href]`, `nav`, `main`, `table`, `dialog`, `input` + `label`. Every one carries a role, keyboard behaviour, and a locator for free. A `div` with a click handler has none of them — it is untestable, unreachable by keyboard, and invisible to an agent reading the tree.

Where a custom widget is unavoidable, give it the role and the state its native equivalent would have: `role="tab"` with `aria-selected`, `role="switch"` with `aria-checked`, `aria-expanded` on anything that discloses.

## When a test id is the right answer

Reach for `data-testid` only after a role query has genuinely failed — and it should fail rarely:

| Element | Add a test id? |
|---|---|
| Button, link, input, heading, list item | No. Fix the name. |
| Chart, canvas, map, drag handle | Yes — no accessible identity exists |
| A row or card wrapper tests need to scope into | Yes — wrappers have no role |
| Something only the test cares about | Yes |
| An element whose visible text keeps changing for copy reasons | Yes |

Naming, so the id survives a rewrite:

- **Domain, not markup.** `data-testid="invoice-row"`, never `"div-3"` or `"MuiBox-root-12"`.
- **Include identity on repeated elements:** `data-testid={`invoice-row-${invoice.id}`}`, or put the id in a `data-` attribute beside it.
- **One convention per project**, set once via `testIdAttribute` in the Playwright config if the repo already uses `data-test` or `data-qa`.
- **Never strip them in production builds** unless the e2e suite runs before that step. A suite that cannot run against the artifact you ship is testing something else.
- A test id is **not** a licence to skip the label. Add both when the element is user-facing.

## Make lists scopeable

The most common source of ambiguous locators.

```tsx
// Nothing to scope to: every cell in the table matches every other.
{invoices.map((i) => <div key={i.id} className="row">…</div>)}

// A named container per row. `getByRole("row", { name: /INV-1042/ })` scopes cleanly.
<table>
  <tbody>
    {invoices.map((i) => (
      <tr key={i.id} data-testid="invoice-row" data-invoice-id={i.id}>
        <td>{i.number}</td>
        <td><button aria-label={`Download ${i.number}`}>Download</button></td>
      </tr>
    ))}
  </tbody>
</table>
```

Give each row a container with a role or a test id, put something identifying inside it, and every action in the row becomes reachable by scoping rather than by index. **Never `key={index}`** — it makes React reuse DOM across reorders, which breaks both rendering and any test holding a reference.

## Render one layout, or name both

A responsive app that renders a mobile nav and a desktop nav together makes every shared query ambiguous — the failure described in `playwright-mobile-web`.

Best: render one. If both must exist, give each an accessible name (`<nav aria-label="Main">`, `<nav aria-label="Mobile">`) so a test can scope to the one on screen instead of filtering on visibility.

## Put state in the DOM

A test can only assert what the markup says. Each of these is one attribute and each removes a class of flaky test:

```tsx
<button disabled={isSaving} aria-busy={isSaving}>{isSaving ? "Saving…" : "Save"}</button>

{isLoading && <div role="status" aria-label="Loading invoices" />}
{error && <div role="alert">{error.message}</div>}
{items.length === 0 && <p data-testid="invoices-empty">No invoices yet</p>}
```

- **A distinct loading state** lets a test assert the spinner appeared *and* went away, instead of racing the request.
- **Empty and error states need their own queryable element.** "Nothing rendered" is indistinguishable from "still loading" and from "crashed".
- **`role="alert"` / `role="status"`** announce async results to screen readers and give the test a durable thing to assert on.
- **`aria-invalid` plus `aria-describedby`** tie a field error to its field, so the test asserts *this* field's message rather than any message on the page.
- **Disable the button while submitting.** It prevents the double submit and gives the test a real signal.

## Do not

- Hide the real `<input>` behind a styled `div` that takes the click. `setInputFiles` and `fill` need the input.
- Put the only identity in a CSS class, a generated class name, or DOM order.
- Change visible copy in ways nothing else pins down — a test asserting a button's label is asserting the user contract, and that failure is correct.
- Animate an element in and out with no end state a test can assert.
- Remove the focusable element from the tab order (`tabindex="-1"` on a real control).
- Render text into a canvas when it is the thing users read.

## Verify

- Every interactive element has a role and a non-empty accessible name — check the browser devtools accessibility tree, or `toMatchAriaSnapshot` (`playwright-accessibility-testing`).
- The whole flow works with a keyboard alone.
- A repeated control in a list is reachable by scoping, with no `.first()` or `.nth()`.
- Loading, empty, and error each render a distinct, queryable element.
- `grep -rn "onClick" src/ | grep "<div"` returns nothing.
- `grep -rn "key={index}" src/` returns nothing.
- Renaming a CSS class or restyling the component breaks no test.
- Test ids survive the production build the suite runs against.

## Rules

- Every control has an accessible name before it gets a test id.
- Native element first; a custom widget carries the role and state its native equivalent has.
- Test ids are domain-named, include identity on repeated elements, and are never stripped from the build under test.
- One layout rendered, or both named.
- Loading, empty, and error states are in the DOM, not implied by absence.
- Never `key={index}`, never a click handler on a `div`.
