type UserRole = "admin" | "member";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function user(emailVar: string, passwordVar: string, role: UserRole) {
  return { email: requireEnv(emailVar), password: requireEnv(passwordVar), role };
}

/**
 * Getters, not plain properties, so a missing variable fails in the test that
 * needs the account rather than at import time in every file.
 */
export const users = {
  get standard() {
    return user("E2E_USER", "E2E_PASSWORD", "member");
  },
  get admin() {
    return user("E2E_ADMIN_USER", "E2E_ADMIN_PASSWORD", "admin");
  },
};

/** Derived from the value, so it can never drift from it. */
export type TestUser = ReturnType<typeof user>;
