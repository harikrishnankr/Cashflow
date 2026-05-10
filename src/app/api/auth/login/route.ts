import type { NextRequest } from "next/server";
import { error, ok } from "@/lib/response";
import { authController } from "@/server/modules/auth";

export async function POST(req: NextRequest) {
  try {
    return ok(await authController.login(req));
  } catch (err) {
    return error(err);
  }
}
