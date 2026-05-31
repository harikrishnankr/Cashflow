import { error, ok } from "@/lib/response";
import { withAuth } from "@/server/modules/auth";
import { budgetController } from "@/server/modules/budget";
import { NextRequest } from "next/server";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const result = await budgetController.list(req, userId);
    return ok(result);
  } catch (err) {
    return error(err);
  }
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const budget = await budgetController.create(req, userId);
    return ok(budget, 201);
  } catch (err) {
    return error(err);
  }
});
