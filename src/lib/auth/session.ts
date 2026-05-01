import { cookies } from "next/headers";
import type { AuthSession } from "@/schema/auth";

// Server-only. Use this in Server Components and API routes to read the current
// session without an HTTP round-trip. The login API route must set the "session"
// httpOnly cookie for this to work (see TODO in auth.service.ts).
export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const raw = store.get("session")?.value;
  if (!raw) return null;

  try {
    // TODO: verify JWT signature and expiry before trusting payload
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}
