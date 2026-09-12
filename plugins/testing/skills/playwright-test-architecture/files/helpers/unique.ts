/**
 * Unique values per test run, so parallel workers never collide on the same
 * record. Isolation is what keeps `fullyParallel` honest.
 */
export function uniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function uniqueEmail(prefix = "user"): string {
  return `${uniqueName(prefix)}@example.test`;
}
