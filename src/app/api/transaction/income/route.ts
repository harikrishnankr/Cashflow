import { error, ok } from "@/lib/response";
import { withAuth } from "@/server/modules/auth";
import { transactionController } from "@/server/modules/transaction";
import { NextRequest } from "next/server";

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const income = await transactionController.createIncome(req, userId);
    return ok(income, 201);
  } catch (err) {
    return error(err);
  }
});
