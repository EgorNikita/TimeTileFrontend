// Helper to serialize array query params (subjectIds=1&subjectIds=2)
export function buildQueryParams(
  params: Record<string, any>,
  arrayKeys: string[],
  scalarKeys: string[]
): string {
  const query = new URLSearchParams();

  arrayKeys.forEach((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)));
      }
    },
  );

  scalarKeys.forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}