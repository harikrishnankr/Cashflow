import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "./user.repository";
import { ForbiddenError } from "./user.errors";

export function withUserOwnership(
  handler: (req: NextRequest, userId: string, targetId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest, userId: string, targetId: string): Promise<NextResponse> => {
    try {
      // Allow if acting on own account or is admin
      // TODO: add role check once auth session carries role
      if (userId !== targetId) {
        throw new ForbiddenError();
      }

      return handler(req, userId, targetId);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        return NextResponse.json(
          { ok: false, error: { code: err.code, message: err.message } },
          { status: err.statusCode }
        );
      }
      throw err;
    }
  };
}
