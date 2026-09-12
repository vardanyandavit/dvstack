/** Every UI path the suite navigates to. Nothing else hard-codes a path. */
export const routes = {
  login: "/login",
  dashboard: "/dashboard",
  orders: "/orders",
  order: (orderId: string) => `/orders/${orderId}`,
} as const;
