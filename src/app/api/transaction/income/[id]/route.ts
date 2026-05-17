import { error, ok } from "@/lib/response";
import { withAuth } from "@/server/modules/auth";
import { transactionController } from "@/server/modules/transaction";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  return withAuth(async (_req, userId) => {
    try {
      const income = await transactionController.getIncome(userId, numericId);
      return ok(income);
    } catch (err) {
      return error(err);
    }
  })(req);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  return withAuth(async (req, userId) => {
    try {
      const income = await transactionController.updateIncome(
        req,
        userId,
        numericId,
      );
      return ok(income);
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
      await transactionController.deleteIncome(userId, numericId);
      return ok(null);
    } catch (err) {
      return error(err);
    }
  })(req);
}
