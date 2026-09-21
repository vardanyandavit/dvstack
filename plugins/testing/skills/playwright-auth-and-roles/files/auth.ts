/**
 * Where each role's storage state lives. Copy to `constants/auth.ts`.
 *
 * `.auth/` is gitignored: a state file contains live cookies and can be used
 * to impersonate the account it was created from.
 */
export const AUTH_DIR = ".auth";

export const roles = ["member", "admin"] as const;

export type Role = (typeof roles)[number];

export function storageStateFor(role: Role): string {
  return `${AUTH_DIR}/${role}.json`;
}

/** For a spec that must run signed out. */
export const SIGNED_OUT = { cookies: [], origins: [] } as const;
