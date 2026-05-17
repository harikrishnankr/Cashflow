import { BadRequestError, ValidationError } from "@/lib/errors";
import { NextRequest } from "next/server";
import z from "zod";

export async function parseAndValidate<S extends z.ZodTypeAny>(
  req: NextRequest,
  schema: S,
): Promise<z.infer<S>> {
  const body = await req.json().catch(() => {
    throw new BadRequestError("Invalid request body.");
  });

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      "Validation failed.",
      Object.fromEntries(
        parsed.error.issues.map((i) => [i.path.join("."), i.message]),
      ),
    );
  }

  return parsed.data;
}

export function parseQuery<S extends z.ZodTypeAny>(
  req: NextRequest,
  schema: S,
): z.infer<S> {
  const { searchParams } = new URL(req.url);
  const raw = Object.fromEntries(searchParams.entries());

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid query parameters.",
      Object.fromEntries(
        parsed.error.issues.map((i) => [i.path.join("."), i.message]),
      ),
    );
  }

  return parsed.data;
}

export function extractMeta(req: NextRequest) {
  return {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress:
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? undefined,
  };
}
