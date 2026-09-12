/** Every API path the suite calls directly or intercepts. */
const API_PREFIX = "/api";

export const endpoints = {
  session: `${API_PREFIX}/session`,
  orders: `${API_PREFIX}/orders`,
  order: (orderId: string) => `${API_PREFIX}/orders/${orderId}`,
} as const;

/**
 * Glob patterns for `page.route()`. Kept next to the endpoints so a path change
 * updates the calls and the mocks in one edit.
 */
export const endpointPatterns = {
  orders: `**${API_PREFIX}/orders**`,
  order: (orderId: string) => `**${API_PREFIX}/orders/${orderId}**`,
} as const;
