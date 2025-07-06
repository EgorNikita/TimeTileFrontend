export interface ResultPattern<T> {
  isSuccess: boolean;
  isFailure: boolean;
  data: T | null;
  error: string | null;
}

export function success<T>(data: T): ResultPattern<T> {
  return {
    isSuccess: true,
    isFailure: false,
    data,
    error: null,
  };
}

export function failure<T = unknown>(error: string): ResultPattern<T> {
  return {
    isSuccess: false,
    isFailure: true,
    data: null,
    error,
  };
}

export function isResultPattern<T>(
  result: unknown,
): result is ResultPattern<T> {
  return (
    result !== null &&
    typeof result === "object" &&
    "isSuccess" in result &&
    typeof (result as any).isSuccess === "boolean" &&
    "isFailure" in result &&
    typeof (result as any).isFailure === "boolean" &&
    ("data" in result || "error" in result)
  );
}
