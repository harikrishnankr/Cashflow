import type { NextRequest } from "next/server";
import { UnauthorizedError } from "@/lib/errors";
import { ok } from "@/lib/response";
import { logger } from "@/lib/logger";
import { loginFormSchema } from "@/schema/auth/login.schema";
import { registerFormSchema } from "@/schema/auth/register.schema";
import type { AuthSession } from "@/schema/auth";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshSession,
} from "./auth.service";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearAuthCookies,
} from "./auth.middleware";
import { extractMeta, parseAndValidate } from "@/server/utils/validator.utils";
import { unwrap } from "./auth.utils";
import {
  ACCESS_TTL_MS,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  REFRESH_TTL_LONG_MS,
  REFRESH_TTL_MS,
} from "./auth.constants";

class AuthController {
  async login(req: NextRequest) {
    const data = await parseAndValidate(req, loginFormSchema);
    const { session, accessToken, refreshToken } = unwrap(
      await loginUser(data, extractMeta(req)),
    );

    const refreshTtlMs =
      (data.rememberMe ?? false) ? REFRESH_TTL_LONG_MS : REFRESH_TTL_MS;

    logger.info("Login successful", { userId: session.user.id });

    const response = ok<AuthSession>(session);
    response.cookies.set(
      COOKIE_ACCESS_TOKEN,
      accessToken,
      accessTokenCookieOptions(ACCESS_TTL_MS),
    );
    response.cookies.set(
      COOKIE_REFRESH_TOKEN,
      refreshToken,
      refreshTokenCookieOptions(refreshTtlMs),
    );

    return response;
  }

  async register(req: NextRequest) {
    const data = await parseAndValidate(req, registerFormSchema);
    const session = unwrap(await registerUser(data));

    logger.info("User registered", { userId: session.user.id });

    return ok<AuthSession>(session, 201);
  }

  async logout(req: NextRequest) {
    const rawRefreshToken = req.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    if (rawRefreshToken) {
      await logoutUser(rawRefreshToken);
    }

    logger.info("Logout successful");

    const response = ok<null>(null);
    clearAuthCookies(response);

    return response;
  }

  async refresh(req: NextRequest) {
    const rawRefreshToken = req.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    if (!rawRefreshToken) throw new UnauthorizedError("No refresh token.");

    const { accessToken, refreshToken, rememberMe } = unwrap(
      await refreshSession(rawRefreshToken, extractMeta(req)),
    );

    const refreshTtlMs = rememberMe ? REFRESH_TTL_LONG_MS : REFRESH_TTL_MS;

    logger.info("Token refreshed");

    const response = ok<null>(null);
    response.cookies.set(
      COOKIE_ACCESS_TOKEN,
      accessToken,
      accessTokenCookieOptions(ACCESS_TTL_MS),
    );
    response.cookies.set(
      COOKIE_REFRESH_TOKEN,
      refreshToken,
      refreshTokenCookieOptions(refreshTtlMs),
    );

    return response;
  }
}

export const authController = new AuthController();
