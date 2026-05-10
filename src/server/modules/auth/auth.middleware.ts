import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_ACCESS_TOKEN } from "./auth.constants";

// Route-handler guard. Reads the access_token cookie, verifies the JWT,
// and injects the userId into the handler.
export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token = req.cookies.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "UNAUTHORIZED", message: "Authentication required." },
        },
        { status: 401 },
      );
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const userId = payload.sub;
      if (!userId) throw new Error("Missing sub");
      return handler(req, userId);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "UNAUTHORIZED", message: "Invalid or expired token." },
        },
        { status: 401 },
      );
    }
  };
}
