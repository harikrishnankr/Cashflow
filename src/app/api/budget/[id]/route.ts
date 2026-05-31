import { error, ok } from "@/lib/response";
import { withAuth } from "@/server/modules/auth";
import { budgetController } from "@/server/modules/budget";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  return withAuth(async (req, userId) => {
    try {
      const budget = await budgetController.getOne(userId, numericId);
      return ok(budget);
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
      const budget = await budgetController.update(req, userId, numericId);
      return ok(budget);
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
      await budgetController.remove(userId, numericId);
      return ok(null);
    } catch (err) {
      return error(err);
    }
  })(req);
}
