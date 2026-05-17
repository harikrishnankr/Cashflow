import { error, ok } from "@/lib/response";
import { withAuth } from "@/server/modules/auth";
import { transactionController } from "@/server/modules/transaction";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  return withAuth(async (req, userId) => {
    try {
      const item = await transactionController.updateRecurringExpense(req, userId, numericId);
      return ok(item);
    } catch (err) {
      return error(err);
    }
  })(req);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  return withAuth(async (req, userId) => {
    try {
      await transactionController.deleteRecurringExpense(userId, numericId);
      return ok(null);
    } catch (err) {
      return error(err);
    }
  })(req);
}
