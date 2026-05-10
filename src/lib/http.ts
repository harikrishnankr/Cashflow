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

type QueueEntry = {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  retry: () => Promise<unknown>;
};

let isRefreshing = false;
let refreshQueue: QueueEntry[] = [];

function flushQueue(error: unknown): void {
  const pending = refreshQueue;
  refreshQueue = [];
  isRefreshing = false;
  if (error) {
    pending.forEach(({ reject }) => reject(error));
  } else {
    pending.forEach(({ retry, resolve, reject }) => {
      retry().then(resolve).catch(reject);
    });
  }
}

async function refreshTokens(): Promise<void> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  if (!res.ok) {
    const json = (await res.json().catch(() => null)) as ApiResponse<never> | null;
    const code = (json?.ok === false ? json.error.code : "UNAUTHORIZED") as ErrorCode;
    throw new HttpError(
      code,
      "Session expired. Please log in again.",
      401,
    );
  }
}

async function fetchJson<T>(path: string, options: HttpOptions): Promise<T> {
  const { body, token, headers: extraHeaders, ...init } = options;

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

export async function http<T = unknown>(
  path: string,
  options: HttpOptions = {},
): Promise<T> {
  try {
    return await fetchJson<T>(path, options);
  } catch (err) {
    // Only intercept 401s, and never recurse on the refresh endpoint itself.
    if (!(err instanceof HttpError) || err.status !== 401 || path === "/auth/refresh") {
      throw err;
    }

    if (isRefreshing) {
      // Park this request until the in-flight refresh resolves.
      return new Promise<T>((resolve, reject) => {
        refreshQueue.push({
          resolve: resolve as (v: unknown) => void,
          reject,
          retry: () => fetchJson<T>(path, options),
        });
      });
    }

    isRefreshing = true;
    try {
      await refreshTokens();
    } catch (refreshErr) {
      flushQueue(refreshErr);
      throw refreshErr;
    }

    // Refresh succeeded — unblock the queue, then retry the original request.
    flushQueue(null);
    return fetchJson<T>(path, options);
  }
}
