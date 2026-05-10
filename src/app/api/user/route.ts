import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { ok, error } from "@/lib/response";
import { userController } from "@/server/modules/user";
import { withAuth } from "@/server/modules/auth/auth.middleware";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const profile = await userController.getUser(req, userId);
    logger.info("User fetched", { userId });
    return ok(profile);
  } catch (err) {
    return error(err, "Failed to fetch user.");
  }
});
