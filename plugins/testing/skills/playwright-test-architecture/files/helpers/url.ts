/** Pure URL functions. No `page`, no `expect` — that is what makes them reusable. */

export function withQuery(path: string, query: Record<string, string | number | boolean>): string {
  const params = new URLSearchParams(
    Object.entries(query).map(([key, value]) => [key, String(value)]),
  );
  return `${path}?${params.toString()}`;
}

/** "https://app.test/orders/42?tab=items" -> "/orders/42" */
export function pathOf(url: string): string {
  return new URL(url).pathname;
}

/** Last path segment, for reading an id the app generated: "/orders/42" -> "42" */
export function lastSegment(url: string): string {
  const segments = pathOf(url).split("/").filter(Boolean);
  const segment = segments.at(-1);
  if (!segment) {
    throw new Error(`No path segment to read from: ${url}`);
  }
  return segment;
}
