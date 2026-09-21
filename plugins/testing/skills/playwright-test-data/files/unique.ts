/**
 * Unique values per run and per worker. Copy to `helpers/unique.ts`.
 *
 * Pure TypeScript: no Playwright import, nothing to clean up, so it stays in
 * `helpers/` (see playwright-naming-conventions). The worker index is passed
 * in rather than read from `test.info()`, which keeps the signature pure and
 * the function usable from setup files and scripts too.
 *
 * A timestamp ALONE is not unique — two workers can start in the same
 * millisecond. The random segment is what makes a collision negligible; the
 * worker index is what makes a stray record traceable to the worker that
 * created it.
 */
function suffix(worker?: number): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return worker === undefined ? `${time}-${random}` : `w${worker}-${time}-${random}`;
}

export function uniqueName(prefix: string, worker?: number): string {
  return `${prefix}-${suffix(worker)}`;
}

/**
 * Plus-addressing keeps every generated account reachable at one real inbox,
 * and `.test` is reserved, so a stray signup email cannot reach a real person.
 */
export function uniqueEmail(prefix = "e2e", worker?: number): string {
  return `${prefix}+${suffix(worker)}@example.test`;
}
