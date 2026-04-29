import { logoutUser } from "@/server/modules/auth";
import { logger } from "@/lib/logger";
import { ok } from "@/lib/response";

export async function POST(request: Request) {
  logger.info("POST /api/auth/logout");
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  await logoutUser(token);
  logger.info("Logout successful");
  return ok(null);
}
