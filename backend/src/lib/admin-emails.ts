/**
 * Email allowlist for admin auto-promotion. Anyone in this list is granted
 * admin rights on register, and promoted on login if their DB row is out of sync.
 *
 * Configure via ADMIN_EMAILS env var (comma-separated). Defaults to the
 * project owner's account when unset.
 */
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "ayhoung@gmail.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.has(email.toLowerCase());
}
