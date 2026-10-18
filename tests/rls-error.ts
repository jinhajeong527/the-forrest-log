// Prisma may wrap driver errors under cause or meta.driverAdapterError.
export function isRlsViolation(error: unknown, table: string): boolean {
  const seen = new Set<object>();
  function check(value: unknown): boolean {
    if (!value || typeof value !== "object" || seen.has(value)) return false;
    seen.add(value);
    const item = value as Record<string, unknown>;
    const code = item.originalCode ?? item.code;
    const message = item.originalMessage ?? item.message;
    if (code === "42501" && typeof message === "string" &&
        message.includes(`new row violates row-level security policy for table "${table}"`)) {
      return true;
    }
    return [item.cause, item.meta, item.driverAdapterError].some(check);
  }
  return check(error);
}
