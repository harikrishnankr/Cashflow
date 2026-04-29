import { NextRequest } from "next/server";
import { userService } from "@/server/modules/users";
import { logger } from "@/lib/logger";
import { ok, error } from "@/lib/response";
import type { User } from "@/types/user.types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  logger.info("GET /api/users/[id]", { id });

  try {
    const user = await userService.getById(id);
    logger.info("User fetched", { userId: id });
    return ok<User>(user);
  } catch (err) {
    return error(err, "Failed to fetch user.", { id });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  logger.info("PATCH /api/users/[id]", { id });

  const body = await request.json().catch(() => null);

  if (!body) {
    logger.warn("Update user rejected: invalid request body", { id });
    return error("BAD_REQUEST", "Invalid request body.", 400);
  }

  try {
    const user = await userService.update(id, body);
    logger.info("User updated", { userId: id });
    return ok<User>(user);
  } catch (err) {
    return error(err, "Failed to update user.", { id });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  logger.info("DELETE /api/users/[id]", { id });

  try {
    await userService.delete(id);
    logger.info("User deleted", { userId: id });
    return ok(null);
  } catch (err) {
    return error(err, "Failed to delete user.", { id });
  }
}
