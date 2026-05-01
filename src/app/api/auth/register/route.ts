import { NextRequest } from "next/server";
import { registerUser } from "@/server/modules/auth";
import { registerFormSchema } from "@/schema/auth/register.schema";
import { logger } from "@/lib/logger";
import { ok, error } from "@/lib/response";
import type { AuthSession } from "@/schema/auth";

export async function POST(request: NextRequest) {
  logger.info("POST /api/auth/register");

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    logger.warn("Register rejected: invalid request body");
    return error("BAD_REQUEST", "Invalid request body.", 400);
  }

  const parsed = registerFormSchema.safeParse(body);

  if (!parsed.success) {
    const fields = Object.fromEntries(
      parsed.error.issues.map((i) => [i.path.join("."), i.message])
    );
    logger.warn("Register rejected: validation failed", { fields });
    return error("VALIDATION_ERROR", "Validation failed.", 422, fields);
  }

  const result = await registerUser(parsed.data);

  if (!result.ok) {
    const status = result.error.code === "EMAIL_TAKEN" ? 409 : 500;
    logger.warn("Register failed", { email: parsed.data.email, code: result.error.code, status });
    return error(result.error.code, result.error.message, status);
  }

  logger.info("User registered", { userId: result.data.user.id, email: result.data.user.email });
  return ok<AuthSession>(result.data, 201);
}
