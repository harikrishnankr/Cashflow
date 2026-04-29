import { NextRequest } from "next/server";
import { userService } from "@/server/modules/users";
import { logger } from "@/lib/logger";
import { ok, error } from "@/lib/response";
import type { User } from "@/types/user.types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 20);

  logger.info("GET /api/users", { page, pageSize });

  try {
    const result = await userService.list({ page, pageSize });
    logger.info("Users fetched", { total: result.total, page, pageSize });
    return ok(result);
  } catch (err) {
    return error(err, "Failed to fetch users.", { page, pageSize });
  }
}

export async function POST(request: NextRequest) {
  logger.info("POST /api/users");

  const body = await request.json().catch(() => null);

  if (!body) {
    logger.warn("Create user rejected: invalid request body");
    return error("BAD_REQUEST", "Invalid request body.", 400);
  }

  try {
    const user = await userService.create(body);
    logger.info("User created", { userId: user.id, email: user.email });
    return ok<User>(user, 201);
  } catch (err) {
    return error(err, "Failed to create user.");
  }
}
