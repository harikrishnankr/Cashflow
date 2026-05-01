import type { ApiResponse } from "@/schema/common";
import type { ErrorCode } from "@/lib/errors";

// Client-side only. In Server Components, call service functions directly instead.
export class HttpError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type HttpOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
};

export async function http<T = unknown>(
  path: string,
  { body, token, headers: extraHeaders, ...init }: HttpOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };

  const res = await fetch(`/api${path}`, {
    ...init,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.ok) {
    throw new HttpError(
      json.error.code as ErrorCode,
      json.error.message,
      res.status,
      json.error.fields,
    );
  }

  return json.data;
}
