import { uniqueName } from "../helpers/unique";

/** Every record the suite creates carries this, so a crashed run is still cleanable. */
export const E2E_MARKER = "e2e";

/**
 * The complete, valid shape. Copy to `data/order.factory.ts`.
 *
 * Kept as its own function so the type can be derived from it rather than
 * declared twice — see playwright-naming-conventions.
 */
function defaults() {
  return {
    item: uniqueName("desk"),
    quantity: 1,
    currency: "EUR",
    notes: "",
    createdBy: E2E_MARKER,
  };
}

/** Derived from the value, so it cannot drift from it. */
export type Order = ReturnType<typeof defaults>;

/**
 * A factory returns a complete, valid object and lets the caller override the
 * one field the test is about.
 *
 * The point is readability at the call site: `makeOrder({ quantity: 0 })` says
 * "an order whose quantity is zero" and nothing else, so the reader knows
 * immediately which field the test is about.
 */
export function makeOrder(overrides: Partial<Order> = {}): Order {
  return { ...defaults(), ...overrides };
}

/** A list, where the test is about the collection rather than one record. */
export function makeOrders(count: number, overrides: Partial<Order> = {}): Order[] {
  return Array.from({ length: count }, () => makeOrder(overrides));
}
