import { NextResponse } from "next/server";
import { BaseError, ErrorCode } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/schema/common";

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function error(
  code: ErrorCode,
  message: string,
  status: number,
  fields?: Record<string, string>,
): NextResponse<ApiResponse<never>>;

export function error(
  err: unknown,
  fallbackMessage?: string,
  context?: number | Record<string, unknown>,
): NextResponse<ApiResponse<never>>;

export function error(
  errOrCode: ErrorCode | unknown,
  messageOrFallback = "An unexpected error occurred.",
  statusOrContext?: number | Record<string, unknown>,
  fields?: Record<string, string>,
): NextResponse<ApiResponse<never>> {
  if (typeof errOrCode === "string") {
    const status = statusOrContext as number;
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: errOrCode,
          message: messageOrFallback,
          ...(fields && { fields }),
        },
      },
      { status },
    );
  }

  const context = statusOrContext as Record<string, unknown> | undefined;

  if (errOrCode instanceof BaseError) {
    logger.warn(errOrCode.message, {
      code: errOrCode.code,
      status: errOrCode.statusCode,
      ...context,
    });
    return NextResponse.json(
      {
        ok: false,
        error: { code: errOrCode.code, message: errOrCode.message },
      },
      { status: errOrCode.statusCode },
    );
  }

  logger.error(messageOrFallback, {
    error:
      errOrCode instanceof Error ? errOrCode : new Error(String(errOrCode)),
    ...context,
  });
  return NextResponse.json(
    {
      ok: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: messageOrFallback },
    },
    { status: 500 },
  );
}
