import { NextRequest } from "next/server";
import { loginUser } from "@/server/modules/auth";
import { loginFormSchema } from "@/components/features/auth/schemas/login-form.schema";
import { logger } from "@/lib/logger";
import { ok, error } from "@/lib/response";
import type { AuthSession } from "@/types/auth.types";

export async function POST(request: NextRequest) {
  logger.info("POST /api/auth/login");

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    logger.warn("Login rejected: invalid request body");
    return error("BAD_REQUEST", "Invalid request body.", 400);
  }

  const parsed = loginFormSchema.safeParse(body);

  if (!parsed.success) {
    const fields = Object.fromEntries(
      parsed.error.issues.map((i) => [i.path.join("."), i.message])
    );
    logger.warn("Login rejected: validation failed", { fields });
    return error("VALIDATION_ERROR", "Validation failed.", 422, fields);
  }

  const result = await loginUser(parsed.data);

  if (!result.ok) {
    const status = result.error.code === "RATE_LIMITED" ? 429 : 401;
    logger.warn("Login failed", { email: parsed.data.email, code: result.error.code, status });
    return error(result.error.code, result.error.message, status);
  }

  logger.info("Login successful", { userId: result.data.user.id, email: result.data.user.email });
  return ok<AuthSession>(result.data);
}
