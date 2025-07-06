export function buildQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
        );
      } else {
        return [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];
      }
    })
    .join("&");
}
