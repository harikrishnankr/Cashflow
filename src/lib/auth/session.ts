import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { AuthSession } from "@/schema/auth";
import { COOKIE_ACCESS_TOKEN } from "@/server/modules/auth";

// Verifies the access_token cookie and returns the session without a DB round-trip.
// Returns null if the token is absent, invalid, or expired.
export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_ACCESS_TOKEN)?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const { sub, email, name, avatarUrl, createdAt } = payload as {
      sub?: string;
      email?: string;
      name?: string;
      avatarUrl?: string;
      createdAt?: string;
    };

    if (!sub || !email || !name || !createdAt) return null;

    return {
      user: {
        id: sub,
        email,
        name,
        avatarUrl,
        createdAt,
      },
    };
  } catch {
    return null;
  }
}
