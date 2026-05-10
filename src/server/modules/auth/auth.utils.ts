import { InternalServerError, RateLimitedError } from "@/lib/errors";
import { hash, verify } from "argon2";
import { EmailTakenError, InvalidCredentialsError } from "./auth.errors";
import { TokenUser } from "./auth.types";
import { ACCESS_TTL_MS, COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "./auth.constants";
import { SignJWT } from "jose";
import { AuthResult } from "@/schema/auth";
import { NextResponse } from "next/server";

export function unwrap<T>(result: AuthResult<T>): T {
  if (result.ok) return result.data;

  const { code, message } = result.error;
  switch (code) {
    case "INVALID_CREDENTIALS":
      throw new InvalidCredentialsError();
    case "EMAIL_TAKEN":
      throw new EmailTakenError();
    case "RATE_LIMITED":
      throw new RateLimitedError();
    default:
      throw new InternalServerError(message);
  }
}

export function hashPassword(plain: string): Promise<string> {
  return hash(plain); // argon2id, 64 MB memory, 3 iterations (library defaults)
}

export function verifyPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return verify(hashed, plain);
}

export async function generateAccessToken(user: TokenUser): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const extra: Record<string, string> = {
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
  if (user.avatarUrl) extra.avatarUrl = user.avatarUrl;

  return new SignJWT(extra)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ACCESS_TTL_MS) / 1000))
    .sign(secret);
}

export function generateRefreshTokenRaw(): string {
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashToken(raw: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  return Array.from(new Uint8Array(buf), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

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

