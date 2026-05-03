import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const COOKIE_ACCESS_TOKEN = "access_token";
export const COOKIE_REFRESH_TOKEN = "refresh_token";

export function accessTokenCookieOptions(ttlMs: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(ttlMs / 1000),
  };
}

export function refreshTokenCookieOptions(ttlMs: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth", // scoped — only sent to the auth refresh endpoint
    maxAge: Math.floor(ttlMs / 1000),
  };
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(COOKIE_ACCESS_TOKEN, "", { maxAge: 0, path: "/" });
  response.cookies.set(COOKIE_REFRESH_TOKEN, "", {
    maxAge: 0,
    path: "/api/auth",
  });
}

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
        { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid or expired token." } },
        { status: 401 }
      );
    }
  };
}
