import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";
import { error } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    return await authController.refresh(req);
  } catch (err) {
    return error(err);
  }
}
