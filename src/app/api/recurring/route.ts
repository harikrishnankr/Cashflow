import { error, ok } from "@/lib/response";
import { withAuth } from "@/server/modules/auth";
import { transactionController } from "@/server/modules/transaction";
import { NextRequest } from "next/server";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const result = await transactionController.listRecurring(req, userId);
    return ok(result);
  } catch (err) {
    return error(err);
  }
});
